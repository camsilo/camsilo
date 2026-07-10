/**
 * Statistikmotoren — "hvad har jeg brugt penge på?" Rene beregninger over
 * posteringerne: forbrug pr. kategori, måned-for-måned, top-forretninger og
 * en detektor for faste abonnementer (samme forretning, stabilt beløb,
 * tilbagevendende måned efter måned).
 *
 * VIGTIGT skel: OVERFØRSLER er ikke FORBRUG. Private hævninger, ejerindskud,
 * moms-/skattebetalinger og opsparing flytter penge — de forbruger dem ikke —
 * og holdes derfor ude af forbrugstallene og vises for sig.
 */
import type { Konto, Transaktion } from "./typer";
import { findKategori } from "./kategorier";
import { foreslaaMoenster } from "./regler";

/** Kategorier der flytter penge frem for at forbruge dem. */
const OVERFOERSLER = new Set([
  "privat-haevning",
  "moms-skat-betaling",
  "ejerindskud",
  "momsrefusion",
  "firmaoverfoersel",
  "opsparing",
  "skat-retur",
]);

export type StatKonto = Konto | "begge";

export type KategoriStat = {
  kategori: string; // kategori-id eller "(ukategoriseret)"
  udOere: number;
  antal: number;
  andelPct: number; // andel af periodens forbrug
};

export type MaanedStat = {
  maaned: string; // "2026-03"
  indOere: number;
  udOere: number; // kun forbrug (uden overførsler)
};

export type ForretningStat = {
  navn: string; // repræsentativ posteringstekst
  udOere: number;
  antal: number;
  kategori?: string;
};

export type AbonnementStat = {
  navn: string;
  prMaanedOere: number; // typisk (median) månedstræk
  antal: number;
  maaneder: number; // antal forskellige måneder med træk
  senest: string; // seneste dato
  kategori?: string;
};

export type Statistik = {
  fra: string;
  til: string;
  forbrugOere: number;
  indtaegterOere: number;
  overfoerslerUdOere: number;
  gnsPrMaanedOere: number;
  stoersteUdgift: { tekst: string; beloebOere: number; dato: string } | null;
  kategorier: KategoriStat[];
  maaneder: MaanedStat[];
  forretninger: ForretningStat[];
  abonnementer: AbonnementStat[];
  antalPosteringer: number;
};

function erOverfoersel(t: Transaktion): boolean {
  if (t.kategori && OVERFOERSLER.has(t.kategori)) return true;
  // Firma-bogens "uden for momsregnskabet" uden kategori ligner også en flytning.
  return false;
}

/** Median af en talrække (øre). */
function median(tal: number[]): number {
  const s = [...tal].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

/** Alle måneder "yyyy-mm" i intervallet [fra, til], inklusive. */
function maanederI(fra: string, til: string): string[] {
  const ud: string[] = [];
  let aar = Number(fra.slice(0, 4));
  let md = Number(fra.slice(5, 7));
  const slutAar = Number(til.slice(0, 4));
  const slutMd = Number(til.slice(5, 7));
  while (aar < slutAar || (aar === slutAar && md <= slutMd)) {
    ud.push(`${aar}-${String(md).padStart(2, "0")}`);
    md++;
    if (md > 12) {
      md = 1;
      aar++;
    }
    if (ud.length > 120) break; // nødbremse
  }
  return ud;
}

export function beregnStatistik(
  transaktioner: Transaktion[],
  konto: StatKonto,
  fra: string,
  til: string,
): Statistik {
  const iPerioden = transaktioner.filter(
    (t) =>
      (konto === "begge" || t.konto === konto) && t.dato >= fra && t.dato <= til,
  );

  let forbrug = 0;
  let indtaegter = 0;
  let overfoerslerUd = 0;
  let stoerste: Statistik["stoersteUdgift"] = null;

  const prKategori = new Map<string, { ud: number; antal: number }>();
  const prMaaned = new Map<string, { ind: number; ud: number }>();
  const prForretning = new Map<
    string,
    { navn: string; ud: number; antal: number; kategori?: string; datoer: string[]; beloeb: number[] }
  >();

  for (const t of iPerioden) {
    const flytning = erOverfoersel(t);
    const md = t.dato.slice(0, 7);
    const mdPost = prMaaned.get(md) ?? { ind: 0, ud: 0 };

    if (t.beloebOere > 0) {
      if (!flytning) {
        indtaegter += t.beloebOere;
        mdPost.ind += t.beloebOere;
      }
    } else if (t.beloebOere < 0) {
      const ud = -t.beloebOere;
      if (flytning) {
        overfoerslerUd += ud;
      } else {
        forbrug += ud;
        mdPost.ud += ud;

        const kategoriNoegle = t.kategori ?? "(ukategoriseret)";
        const k = prKategori.get(kategoriNoegle) ?? { ud: 0, antal: 0 };
        k.ud += ud;
        k.antal++;
        prKategori.set(kategoriNoegle, k);

        const fNoegle = `${t.konto}|${foreslaaMoenster(t.tekst)}`;
        const f =
          prForretning.get(fNoegle) ??
          { navn: t.tekst, ud: 0, antal: 0, kategori: t.kategori, datoer: [], beloeb: [] };
        f.ud += ud;
        f.antal++;
        if (t.tekst.length < f.navn.length) f.navn = t.tekst; // korteste = pæneste
        f.datoer.push(t.dato);
        f.beloeb.push(ud);
        prForretning.set(fNoegle, f);

        if (!stoerste || ud > -stoerste.beloebOere) {
          stoerste = { tekst: t.tekst, beloebOere: t.beloebOere, dato: t.dato };
        }
      }
    }
    prMaaned.set(md, mdPost);
  }

  const kategorier: KategoriStat[] = [...prKategori.entries()]
    .map(([kategori, v]) => ({
      kategori,
      udOere: v.ud,
      antal: v.antal,
      andelPct: forbrug > 0 ? Math.round((v.ud / forbrug) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.udOere - a.udOere);

  const maaneder: MaanedStat[] = maanederI(fra, til).map((maaned) => ({
    maaned,
    indOere: prMaaned.get(maaned)?.ind ?? 0,
    udOere: prMaaned.get(maaned)?.ud ?? 0,
  }));

  const forretninger: ForretningStat[] = [...prForretning.values()]
    .map((f) => ({ navn: f.navn, udOere: f.ud, antal: f.antal, kategori: f.kategori }))
    .sort((a, b) => b.udOere - a.udOere)
    .slice(0, 12);

  // Abonnements-detektor: ≥3 træk fordelt på ≥3 måneder, stabilt beløb
  // (spænd ≤ 25 % eller ≤ 30 kr.) og ca. månedlig kadence.
  const abonnementer: AbonnementStat[] = [...prForretning.values()]
    .filter((f) => {
      if (f.antal < 3) return false;
      const mdr = new Set(f.datoer.map((d) => d.slice(0, 7)));
      if (mdr.size < 3) return false;
      const kadence = f.antal / mdr.size;
      if (kadence > 1.6) return false; // flere træk pr. måned = ikke abonnement
      const mn = Math.min(...f.beloeb);
      const mx = Math.max(...f.beloeb);
      return mx - mn <= Math.max(3000, mx * 0.25);
    })
    .map((f) => ({
      navn: f.navn,
      prMaanedOere: median(f.beloeb),
      antal: f.antal,
      maaneder: new Set(f.datoer.map((d) => d.slice(0, 7))).size,
      senest: f.datoer.reduce((a, b) => (a > b ? a : b)),
      kategori: f.kategori,
    }))
    .sort((a, b) => b.prMaanedOere - a.prMaanedOere);

  // Gennemsnit pr. måned regnes over måneder MED aktivitet (ellers udvander
  // tomme måneder i starten af perioden tallet).
  const aktiveMdr = maaneder.filter((m) => m.udOere > 0 || m.indOere > 0).length;
  const gnsPrMaaned = aktiveMdr > 0 ? Math.round(forbrug / aktiveMdr) : 0;

  return {
    fra,
    til,
    forbrugOere: forbrug,
    indtaegterOere: indtaegter,
    overfoerslerUdOere: overfoerslerUd,
    gnsPrMaanedOere: gnsPrMaaned,
    stoersteUdgift: stoerste,
    kategorier,
    maaneder,
    forretninger,
    abonnementer,
    antalPosteringer: iPerioden.length,
  };
}

/** Pæn kategorietiket (emoji + navn) til statistik-visningen. */
export function kategoriEtiket(id: string): string {
  if (id === "(ukategoriseret)") return "❔ Ukategoriseret";
  const k = findKategori(id);
  return k ? `${k.emoji} ${k.navn}` : id;
}
