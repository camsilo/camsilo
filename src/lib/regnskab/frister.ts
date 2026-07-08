/**
 * Frist-motoren — Odins vagttårn. Genererer alle kommende (og nyligt
 * overståede) frister ud fra dine indstillinger: momsfrister efter din
 * afregningsperiode, B-skat-rater, oplysningsskema, forskudsopgørelse m.m.
 *
 * Reglerne er generative (fx "halvårsmoms: 1. i den 3. måned efter periodens
 * udløb") med automatisk weekend-forskydning til førstkommende hverdag.
 * NB: Skat kan flytte enkeltfrister (helligdage m.m.) — motoren er et
 * vagttårn, TastSelv er facitlisten.
 */
import type { Indstillinger, MomsIndberetning } from "./typer";
import { perioderForAar, type Periode } from "./moms";
import { satserFor } from "./satser";

export type FristKategori =
  | "moms"
  | "b-skat"
  | "oplysningsskema"
  | "forskud"
  | "aarsrapport";

export type Frist = {
  id: string;
  kategori: FristKategori;
  titel: string;
  /** ISO-dato for sidste rettidige handling. */
  dato: string;
  beskrivelse: string;
  /** Kort "sådan gør du" — hvor du klikker, hvad du taster. */
  handling: string;
  /** Momsperiode-nøgle hvis fristen hører til en periode. */
  periodeNoegle?: string;
  /** Er handlingen allerede udført (fx moms markeret som indberettet)? */
  udfoert?: boolean;
};

/**
 * Danske helligdage (+ banklukkedage) for et år som "mm-dd"-sæt.
 * Påskeafledte dage beregnes med Gauss' påskeformel. Store Bededag er
 * afskaffet fra 2024 og medtages IKKE. 5/6, 24/12 og 31/12 er banklukkedage
 * og tælles med, da fristerne er bankdags-frister.
 */
function helligdage(aar: number): Set<string> {
  // Gauss/Meeus: påskesøndag
  const a = aar % 19;
  const b = Math.floor(aar / 100);
  const c = aar % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const md = Math.floor((h + l - 7 * m + 114) / 31); // 3=marts, 4=april
  const dag = ((h + l - 7 * m + 114) % 31) + 1;
  const paaske = Date.UTC(aar, md - 1, dag);
  const plus = (dage: number) =>
    new Date(paaske + dage * 86_400_000).toISOString().slice(5, 10);
  return new Set([
    "01-01", // nytårsdag
    plus(-3), // skærtorsdag
    plus(-2), // langfredag
    plus(1), // 2. påskedag
    plus(39), // Kristi himmelfartsdag
    plus(50), // 2. pinsedag
    "06-05", // grundlovsdag (banklukket)
    "12-24", // juleaftensdag (banklukket)
    "12-25", // juledag
    "12-26", // 2. juledag
    "12-31", // nytårsaftensdag (banklukket)
  ]);
}

/** Skub en dato til førstkommende BANKDAG (uden om weekend og helligdage). */
export function tilHverdag(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  let hellig = helligdage(d.getUTCFullYear());
  for (let vagt = 0; vagt < 14; vagt++) {
    const ugedag = d.getUTCDay();
    const mmdd = d.toISOString().slice(5, 10);
    if (ugedag !== 0 && ugedag !== 6 && !hellig.has(mmdd)) break;
    const foerAar = d.getUTCFullYear();
    d.setUTCDate(d.getUTCDate() + 1);
    if (d.getUTCFullYear() !== foerAar) hellig = helligdage(d.getUTCFullYear());
  }
  return d.toISOString().slice(0, 10);
}

function isoDato(aar: number, md: number, dag: number): string {
  return `${aar}-${String(md).padStart(2, "0")}-${String(dag).padStart(2, "0")}`;
}

/** Momsfristen for en periode: den 1. i den 3. måned efter periodens udløb. */
export function momsfristFor(periode: Periode): string {
  const tilAar = Number(periode.til.slice(0, 4));
  const tilMd = Number(periode.til.slice(5, 7));
  // Månedsafregning har kortere frist (25. i måneden efter) — de øvrige 1. i 3. måned efter.
  const erMaaned = /-M\d{2}$/.test(periode.noegle);
  if (erMaaned) {
    // Lovbestemt sommerundtagelse (momsloven § 57, stk. 2): juni-perioden har
    // frist 1 måned og 17 dage efter udløb, dvs. 17. august.
    if (tilMd === 6) return tilHverdag(isoDato(tilAar, 8, 17));
    const md = tilMd === 12 ? 1 : tilMd + 1;
    const aar = tilMd === 12 ? tilAar + 1 : tilAar;
    return tilHverdag(isoDato(aar, md, 25));
  }
  let md = tilMd + 3;
  let aar = tilAar;
  if (md > 12) {
    md -= 12;
    aar += 1;
  }
  return tilHverdag(isoDato(aar, md, 1));
}

/**
 * Generér alle frister i vinduet [fra − 45 dage bagud, ca. 15 mdr. frem].
 * `idag` som ISO-dato; indberettede momsperioder markeres som udført.
 */
export function beregnFrister(
  indstillinger: Indstillinger,
  indberetninger: MomsIndberetning[],
  idag: string,
): Frist[] {
  const frister: Frist[] = [];
  const iAar = Number(idag.slice(0, 4));
  const indberettet = new Set(indberetninger.map((i) => i.periode));

  // ── Moms ──────────────────────────────────────────────────────
  if (indstillinger.momsregistreret) {
    for (let aar = iAar - 1; aar <= iAar + 1; aar++) {
      for (const p of perioderForAar(aar, indstillinger.momsperiode)) {
        const frist = momsfristFor(p);
        frister.push({
          id: `moms-${p.noegle}`,
          kategori: "moms",
          titel: `Momsindberetning: ${p.label}`,
          dato: frist,
          beskrivelse: `Indberet og betal moms for ${p.label} (${p.fra} – ${p.til}). Selv uden aktivitet SKAL der nul-indberettes — ellers laver Skat en foreløbig fastsættelse med 1.400 kr. i afgift.`,
          handling:
            "Log på skat.dk → TastSelv Erhverv → Moms → vælg perioden. Odins momspanel har alle rubrikkernes tal klar til at taste ind.",
          periodeNoegle: p.noegle,
          udfoert: indberettet.has(p.noegle),
        });
      }
    }
  }

  // ── B-skat ────────────────────────────────────────────────────
  if (indstillinger.betalerBSkat) {
    for (let aar = iAar; aar <= iAar + 1; aar++) {
      const s = satserFor(aar);
      for (const md of s.bSkatMaaneder) {
        const dato = tilHverdag(isoDato(aar, md, s.bSkatBetalingsdag));
        frister.push({
          id: `bskat-${aar}-${md}`,
          kategori: "b-skat",
          titel: `B-skat-rate (${MD_NAVNE[md - 1].toLowerCase()} ${aar})`,
          dato,
          beskrivelse:
            "Månedens B-skat-rate af det forventede virksomhedsoverskud forfalder.",
          handling:
            "Betales via betalingslinjen på din forskudsopgørelse/skattekonto, eller tilmeld Betalingsservice på skat.dk → TastSelv.",
        });
      }
    }
  }

  // ── Oplysningsskema (udvidet årsopgørelse for selvstændige) ───
  for (let indkomstAar = iAar - 1; indkomstAar <= iAar; indkomstAar++) {
    const frist = tilHverdag(isoDato(indkomstAar + 1, 7, 1));
    frister.push({
      id: `oplysning-${indkomstAar}`,
      kategori: "oplysningsskema",
      titel: `Oplysningsskema for ${indkomstAar}`,
      dato: frist,
      beskrivelse: `Frist for at oplyse virksomhedens resultat for ${indkomstAar} (rubrik 111 = overskud, 112 = underskud). For sen oplysning koster skattetillæg — op til 400 kr. pr. dag, maks. 10.000 kr.`,
      handling:
        "skat.dk → TastSelv (privat) → Ret årsopgørelsen/oplysningsskemaet → udfyld virksomhedsrubrikkerne. Odins skattepanel har tallene klar.",
    });
  }

  // ── Forskudsopgørelse ─────────────────────────────────────────
  frister.push({
    id: `forskud-${iAar + 1}`,
    kategori: "forskud",
    titel: `Forskudsopgørelsen for ${iAar + 1} åbner`,
    dato: isoDato(iAar, 11, 10),
    beskrivelse: `Omkring 10. november åbner forskudsopgørelsen for ${iAar + 1} (datoen kan skride et par dage). Sæt forventet virksomhedsoverskud (felt 221), så B-skatten passer, og du undgår restskat.`,
    handling:
      "skat.dk → TastSelv → Forskudsopgørelsen → felt 221 'Overskud af virksomhed'. Brug Odins skatte-estimat som pejlemærke.",
  });

  // ── Årsrapport (kun ApS) ──────────────────────────────────────
  if (indstillinger.virksomhedsform === "aps") {
    frister.push({
      id: `aarsrapport-${iAar}`,
      kategori: "aarsrapport",
      titel: `Årsrapport til Erhvervsstyrelsen (regnskabsåret ${iAar - 1})`,
      dato: tilHverdag(isoDato(iAar, 6, 30)),
      beskrivelse:
        "ApS'ets årsrapport skal indberettes senest 6 måneder efter regnskabsårets udløb.",
      handling: "virk.dk → Regnskab 2.0 → indberet årsrapport.",
    });
  }

  // Sortér på dato; behold kun vinduet [-45 dage, +15 måneder].
  const fraVindue = flytDage(idag, -45);
  const tilVindue = flytDage(idag, 460);
  return frister
    .filter((f) => f.dato >= fraVindue && f.dato <= tilVindue)
    .sort((a, b) => a.dato.localeCompare(b.dato));
}

const MD_NAVNE = [
  "Januar", "Februar", "Marts", "April", "Maj", "Juni",
  "Juli", "August", "September", "Oktober", "November", "December",
];

function flytDage(iso: string, dage: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dage);
  return d.toISOString().slice(0, 10);
}

/** Hele dage fra `idag` til fristen (negativ = overskredet). */
export function dageTil(frist: string, idag: string): number {
  const a = Date.UTC(
    Number(idag.slice(0, 4)),
    Number(idag.slice(5, 7)) - 1,
    Number(idag.slice(8, 10)),
  );
  const b = Date.UTC(
    Number(frist.slice(0, 4)),
    Number(frist.slice(5, 7)) - 1,
    Number(frist.slice(8, 10)),
  );
  return Math.round((b - a) / 86_400_000);
}

/** Dags dato i København som ISO — hele regnskabet regner i dansk tid. */
export function idagIso(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Copenhagen",
  }).format(new Date());
}
