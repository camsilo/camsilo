/**
 * Engangs-indlæsning af kendte regnskabsdata.
 *
 * HVORFOR EN RUTE OG IKKE EN SEED-FIL I KODEN: dette repo er offentligt, fordi
 * det samtidig er GitHub-profilens repo. Fakturaer, kundenavne og beløb må
 * derfor aldrig ligge i kildekoden. Data sendes i stedet som JSON direkte til
 * den kørende server, hvor det lander på den persistente disk bag admin-login.
 *
 * Indlæsningen er IDEMPOTENT: fakturaer dedupes på fakturanummer og posteringer
 * på fingeraftryk, så den samme fil kan sendes igen uden at skabe dubletter.
 * Låste posteringer røres aldrig.
 */
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { erAdmin } from "@/lib/admin-auth";
import { beregnFingeraftryk } from "@/lib/regnskab/csv";
import {
  gemFaktura,
  gemIndstillinger,
  gemKursdifference,
  hentFakturaer,
  hentIndstillinger,
  tilfoejTransaktioner,
} from "@/lib/regnskab/store";
import type { Faktura, Konto, MomsType, Transaktion } from "@/lib/regnskab/typer";

export const dynamic = "force-dynamic";

type IndFaktura = Omit<Faktura, "id" | "ts">;
type IndTransaktion = {
  konto: Konto;
  dato: string;
  tekst: string;
  beloebOere: number;
  kategori?: string;
  momsType?: MomsType;
  momsOere?: number;
  momsFradragPct?: number;
  fradragPct?: number;
  skatteRelevant?: boolean;
  afklaret?: boolean;
  note?: string;
};
type Krop = {
  fakturaer?: IndFaktura[];
  transaktioner?: IndTransaktion[];
  kursdifferencer?: {
    fakturaNummer: string;
    aar: number;
    bogfoertOere: number;
    modtagetOere: number;
    differenceOere: number;
    note?: string;
  }[];
  indstillinger?: Record<string, unknown>;
};

export async function POST(req: Request) {
  if (!(await erAdmin())) {
    return NextResponse.json({ fejl: "Ingen adgang" }, { status: 401 });
  }

  let krop: Krop;
  try {
    krop = (await req.json()) as Krop;
  } catch {
    return NextResponse.json({ fejl: "Ugyldig JSON" }, { status: 400 });
  }

  const kvittering = {
    fakturaer: { nye: 0, fandtes: 0 },
    transaktioner: { indsat: 0, dubletter: 0 },
    kursdifferencer: 0,
    indstillinger: false,
    advarsler: [] as string[],
  };

  // ── Indstillinger ──
  if (krop.indstillinger) {
    const nu = await hentIndstillinger();
    await gemIndstillinger({ ...nu, ...krop.indstillinger });
    kvittering.indstillinger = true;
  }

  // ── Fakturaer ──
  const eksisterende = await hentFakturaer();
  const efterNummer = new Map(eksisterende.map((f) => [f.nummer, f]));
  for (const f of krop.fakturaer ?? []) {
    if (efterNummer.has(f.nummer)) {
      kvittering.fakturaer.fandtes++;
      continue;
    }
    try {
      const gemt = await gemFaktura(f);
      efterNummer.set(gemt.nummer, gemt);
      kvittering.fakturaer.nye++;
    } catch (err) {
      kvittering.advarsler.push(
        `Faktura ${f.nummer}: ${err instanceof Error ? err.message : "kunne ikke gemmes"}`,
      );
    }
  }

  // ── Posteringer ──
  // Fingeraftrykket beregnes pr. bog, fordi den samme tekst og det samme beløb
  // kan optræde i både privat- og firmabogen uden at være samme postering.
  if (krop.transaktioner?.length) {
    const importId = randomUUID();
    const nu = Date.now();
    const klar: Transaktion[] = [];

    for (const konto of ["privat", "firma"] as Konto[]) {
      const iBogen = krop.transaktioner.filter((t) => t.konto === konto);
      if (!iBogen.length) continue;
      const aftryk = beregnFingeraftryk(
        konto,
        iBogen.map((t) => ({
          dato: t.dato,
          tekst: t.tekst,
          beloebOere: t.beloebOere,
        })),
      );
      iBogen.forEach((t, i) => {
        klar.push({ ...t, id: randomUUID(), importId, fingeraftryk: aftryk[i], ts: nu });
      });
    }

    kvittering.transaktioner = await tilfoejTransaktioner(klar);
  }

  // ── Kursdifferencer ──
  for (const k of krop.kursdifferencer ?? []) {
    const f = efterNummer.get(k.fakturaNummer);
    if (!f) {
      kvittering.advarsler.push(
        `Kursdifference for ${k.fakturaNummer}: fakturaen findes ikke.`,
      );
      continue;
    }
    await gemKursdifference({
      fakturaId: f.id,
      aar: k.aar,
      bogfoertOere: k.bogfoertOere,
      modtagetOere: k.modtagetOere,
      differenceOere: k.differenceOere,
      note: k.note,
    });
    kvittering.kursdifferencer++;
  }

  return NextResponse.json({ ok: true, kvittering });
}
