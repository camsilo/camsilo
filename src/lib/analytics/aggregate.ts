/**
 * Aggregering af rå hændelser til dashboard-tal: KPI'er med ændring i
 * forhold til forrige periode, tidsserie (sidevisninger + unikke), top-lister
 * og "online nu" (aktivitet inden for de sidste 5 minutter).
 */
import { laesHaendelser, type Haendelse } from "./store";

export type Periode = "24h" | "7d" | "30d" | "90d";

export const PERIODER: { id: Periode; label: string }[] = [
  { id: "24h", label: "24t" },
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
  { id: "90d", label: "90d" },
];

const MS_TIME = 3_600_000;
const MS_DAG = 24 * MS_TIME;

function periodeMs(p: Periode): number {
  switch (p) {
    case "24h":
      return MS_DAG;
    case "7d":
      return 7 * MS_DAG;
    case "30d":
      return 30 * MS_DAG;
    case "90d":
      return 90 * MS_DAG;
  }
}

export type Punkt = { label: string; visninger: number; unikke: number };

export type Oversigt = {
  periode: Periode;
  visninger: number;
  visningerDelta: number | null;
  unikke: number;
  unikkeDelta: number | null;
  afvisningsrate: number | null;
  afvisningsrateDelta: number | null;
  gnsBesoegSek: number | null;
  gnsBesoegDelta: number | null;
  onlineNu: number;
  serie: Punkt[];
  topStier: { navn: string; antal: number }[];
  topHenvisninger: { navn: string; antal: number }[];
  topSprog: { navn: string; antal: number }[];
};

type SessionStat = { hits: number; foerste: number; sidste: number };

function sessionsStat(haendelser: Haendelse[]): Map<string, SessionStat> {
  const m = new Map<string, SessionStat>();
  for (const h of haendelser) {
    const s = m.get(h.s);
    if (!s) {
      m.set(h.s, { hits: h.t === "hit" ? 1 : 0, foerste: h.ts, sidste: h.ts });
    } else {
      if (h.t === "hit") s.hits++;
      if (h.ts < s.foerste) s.foerste = h.ts;
      if (h.ts > s.sidste) s.sidste = h.ts;
    }
  }
  return m;
}

function noegletal(haendelser: Haendelse[]) {
  const visninger = haendelser.filter((h) => h.t === "hit").length;
  const sessioner = sessionsStat(haendelser);
  const antal = sessioner.size;

  let afvisninger = 0;
  let varighedSum = 0;
  let varighedAntal = 0;
  for (const s of sessioner.values()) {
    if (s.hits <= 1 && s.sidste - s.foerste < 10_000) afvisninger++;
    varighedSum += s.sidste - s.foerste;
    varighedAntal++;
  }

  return {
    visninger,
    unikke: antal,
    afvisningsrate: antal > 0 ? (afvisninger / antal) * 100 : null,
    gnsBesoegSek: varighedAntal > 0 ? varighedSum / varighedAntal / 1000 : null,
  };
}

function delta(nu: number | null, foer: number | null): number | null {
  if (nu === null || foer === null || foer === 0) return null;
  return ((nu - foer) / foer) * 100;
}

function dansk(d: Date, periode: Periode): string {
  if (periode === "24h") {
    return d.toLocaleTimeString("da-DK", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  }
  return d.toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

function vaertsnavn(r: string): string | null {
  try {
    const u = new URL(r);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function top(
  taeller: Map<string, number>,
  maks = 8,
): { navn: string; antal: number }[] {
  return [...taeller.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maks)
    .map(([navn, antal]) => ({ navn, antal }));
}

export async function beregnOversigt(periode: Periode): Promise<Oversigt> {
  const nu = Date.now();
  const ms = periodeMs(periode);
  const fra = nu - ms;
  const forrigeFra = fra - ms;

  const alle = await laesHaendelser(forrigeFra, nu);
  const aktuelle = alle.filter((h) => h.ts >= fra);
  const forrige = alle.filter((h) => h.ts < fra);

  const tal = noegletal(aktuelle);
  const talFoer = noegletal(forrige);

  // Tidsserie: timebuckets for 24t, dagsbuckets ellers
  const bucketMs = periode === "24h" ? MS_TIME : MS_DAG;
  const antalBuckets = Math.round(ms / bucketMs);
  const serie: Punkt[] = [];
  for (let i = 0; i < antalBuckets; i++) {
    const start = fra + i * bucketMs;
    const slut = start + bucketMs;
    const iBucket = aktuelle.filter((h) => h.ts >= start && h.ts < slut);
    serie.push({
      label: dansk(new Date(start), periode),
      visninger: iBucket.filter((h) => h.t === "hit").length,
      unikke: new Set(iBucket.map((h) => h.s)).size,
    });
  }

  // Top-lister (kun hits)
  const stier = new Map<string, number>();
  const henvisninger = new Map<string, number>();
  const sprog = new Map<string, number>();
  for (const h of aktuelle) {
    if (h.t !== "hit") continue;
    if (h.p) stier.set(h.p, (stier.get(h.p) ?? 0) + 1);
    if (h.r) {
      const navn = vaertsnavn(h.r);
      if (navn && navn !== "camsilo.dk") {
        henvisninger.set(navn, (henvisninger.get(navn) ?? 0) + 1);
      }
    }
    if (h.l) {
      const kode = h.l.slice(0, 2).toLowerCase();
      sprog.set(kode, (sprog.get(kode) ?? 0) + 1);
    }
  }

  // Online nu: sessioner med aktivitet inden for 5 min
  const graense = nu - 5 * 60_000;
  const onlineNu = new Set(aktuelle.filter((h) => h.ts >= graense).map((h) => h.s))
    .size;

  return {
    periode,
    visninger: tal.visninger,
    visningerDelta: delta(tal.visninger, talFoer.visninger),
    unikke: tal.unikke,
    unikkeDelta: delta(tal.unikke, talFoer.unikke),
    afvisningsrate: tal.afvisningsrate,
    afvisningsrateDelta: delta(tal.afvisningsrate, talFoer.afvisningsrate),
    gnsBesoegSek: tal.gnsBesoegSek,
    gnsBesoegDelta: delta(tal.gnsBesoegSek, talFoer.gnsBesoegSek),
    onlineNu,
    serie,
    topStier: top(stier),
    topHenvisninger: top(henvisninger),
    topSprog: top(sprog),
  };
}
