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
export type Andel = { navn: string; antal: number };
export type RealtidsHit = {
  ts: number;
  sti: string;
  land?: string;
  enhed?: string;
};

export type Oversigt = {
  periode: Periode;
  genereretTs: number;
  visninger: number;
  visningerDelta: number | null;
  unikke: number;
  unikkeDelta: number | null;
  afvisningsrate: number | null;
  afvisningsrateDelta: number | null;
  gnsBesoegSek: number | null;
  gnsBesoegDelta: number | null;
  sidesPerSession: number | null;
  engagementProcent: number | null;
  onlineNu: number;
  serie: Punkt[];
  topStier: Andel[];
  topHenvisninger: Andel[];
  topSprog: Andel[];
  topLande: Andel[];
  enheder: Andel[];
  browsere: Andel[];
  styresystemer: Andel[];
  indgangssider: Andel[];
  udgangssider: Andel[];
  /** hits pr. time-på-døgnet (UTC), 24 tal */
  timer: number[];
  /** seneste hits til live-feed, nyeste først */
  realtid: RealtidsHit[];
  /** er Google Analytics (NEXT_PUBLIC_GA_ID) konfigureret? */
  gaKonfigureret: boolean;
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

const landeNavne = (() => {
  try {
    return new Intl.DisplayNames(["da"], { type: "region" });
  } catch {
    return null;
  }
})();

/** "DK" → "🇩🇰 Danmark" (flag-emoji bygges af regional-indicator-symboler). */
function landeEtiket(kode: string): string {
  const k = kode.toUpperCase();
  let navn = k;
  try {
    navn = landeNavne?.of(k) ?? k;
  } catch {
    navn = k;
  }
  const flag = /^[A-Z]{2}$/.test(k)
    ? String.fromCodePoint(...[...k].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))
    : "";
  return flag ? `${flag} ${navn}` : navn;
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

  // Top-lister + fordelinger (kun hits)
  const stier = new Map<string, number>();
  const henvisninger = new Map<string, number>();
  const sprog = new Map<string, number>();
  const lande = new Map<string, number>();
  const enheder = new Map<string, number>();
  const browsere = new Map<string, number>();
  const styresystemer = new Map<string, number>();
  const timer = new Array(24).fill(0) as number[];
  // session → kronologiske hit-stier (til ind-/udgangssider)
  const sessionStier = new Map<string, { ts: number; p: string }[]>();

  for (const h of aktuelle) {
    if (h.t !== "hit") continue;
    if (h.p) {
      stier.set(h.p, (stier.get(h.p) ?? 0) + 1);
      const liste = sessionStier.get(h.s);
      if (liste) liste.push({ ts: h.ts, p: h.p });
      else sessionStier.set(h.s, [{ ts: h.ts, p: h.p }]);
    }
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
    if (h.c) lande.set(landeEtiket(h.c), (lande.get(landeEtiket(h.c)) ?? 0) + 1);
    if (h.dv) enheder.set(h.dv, (enheder.get(h.dv) ?? 0) + 1);
    if (h.br) browsere.set(h.br, (browsere.get(h.br) ?? 0) + 1);
    if (h.os) styresystemer.set(h.os, (styresystemer.get(h.os) ?? 0) + 1);
    timer[new Date(h.ts).getUTCHours()]++;
  }

  // Ind-/udgangssider: første og sidste hit-sti pr. session
  const indgang = new Map<string, number>();
  const udgang = new Map<string, number>();
  for (const liste of sessionStier.values()) {
    liste.sort((a, b) => a.ts - b.ts);
    const ind = liste[0].p;
    const ud = liste[liste.length - 1].p;
    indgang.set(ind, (indgang.get(ind) ?? 0) + 1);
    udgang.set(ud, (udgang.get(ud) ?? 0) + 1);
  }

  // Realtids-feed: seneste hits, nyeste først
  const realtid: RealtidsHit[] = aktuelle
    .filter((h) => h.t === "hit" && h.p)
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 14)
    .map((h) => ({
      ts: h.ts,
      sti: h.p as string,
      land: h.c ? landeEtiket(h.c) : undefined,
      enhed: h.dv,
    }));

  // Online nu: sessioner med aktivitet inden for 5 min
  const graense = nu - 5 * 60_000;
  const onlineNu = new Set(aktuelle.filter((h) => h.ts >= graense).map((h) => h.s))
    .size;

  const sidesPerSession = tal.unikke > 0 ? tal.visninger / tal.unikke : null;
  const engagementProcent =
    tal.afvisningsrate === null ? null : 100 - tal.afvisningsrate;

  return {
    periode,
    genereretTs: nu,
    visninger: tal.visninger,
    visningerDelta: delta(tal.visninger, talFoer.visninger),
    unikke: tal.unikke,
    unikkeDelta: delta(tal.unikke, talFoer.unikke),
    afvisningsrate: tal.afvisningsrate,
    afvisningsrateDelta: delta(tal.afvisningsrate, talFoer.afvisningsrate),
    gnsBesoegSek: tal.gnsBesoegSek,
    gnsBesoegDelta: delta(tal.gnsBesoegSek, talFoer.gnsBesoegSek),
    sidesPerSession,
    engagementProcent,
    onlineNu,
    serie,
    topStier: top(stier),
    topHenvisninger: top(henvisninger),
    topSprog: top(sprog),
    topLande: top(lande),
    enheder: top(enheder, 6),
    browsere: top(browsere, 6),
    styresystemer: top(styresystemer, 6),
    indgangssider: top(indgang),
    udgangssider: top(udgang),
    timer,
    realtid,
    gaKonfigureret: Boolean(process.env.NEXT_PUBLIC_GA_ID),
  };
}
