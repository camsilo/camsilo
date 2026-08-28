/**
 * Skattemotoren — årets virksomhedsresultat og et ærligt ESTIMAT af skatten.
 *
 * Skattemæssig behandling pr. postering:
 *   fradragsgrundlag = |brutto| − fradragsberettiget købsmoms
 *   skattefradrag    = fradragsgrundlag × fradragPct/100
 *
 * (Momsen du får retur, er aldrig en omkostning; ikke-fradragsberettiget moms
 * ER en omkostning og indgår derfor i grundlaget.)
 *
 * Skatteestimatet regner virksomhedsoverskuddet som MARGINAL indkomst oven på
 * din løn: AM-bidrag 8 % + (bund- + kommuneskat) af resten, plus 2026-
 * reformens trin (mellemskat 7,5 %, topskat 7,5 %, top-topskat 5 %) af de
 * dele, der ligger over trinnenes grænser. Personfradraget antages brugt af
 * lønnen. Det er et pejlemærke — forskudsopgørelsen er dommeren.
 */
import type { Faktura, Indstillinger, Kursdifference, Transaktion } from "./typer";
import { KURSGEVINST_BAGATELGRAENSE_OERE } from "./valuta";
import { satserFor } from "./satser";

export type SkatteOpgoerelse = {
  aar: number;
  omsaetningOere: number; // netto (uden moms)
  udgifterOere: number; // skattemæssigt fradragsberettigede
  resultatOere: number; // før AM-bidrag
  amBidragOere: number;
  efterAmOere: number;
  /** Estimeret samlet skat af virksomhedsoverskuddet (inkl. AM-bidrag). */
  estimeretSkatOere: number;
  /** Estimeret marginalprocent anvendt. */
  marginalPct: number;
  /** Rammer overskuddet (oven på løn) mellem-/topskattetrinnene? */
  topskatRamt: boolean;
  antalPosteringer: number;
  uafklarede: number;
  /** Fakturaer med fakturadato i året — grundlaget for omsætningen. */
  fakturaer: Faktura[];
  /**
   * Sat, når omsætningen er læst af bankposteringerne frem for fakturaerne.
   * Så er periodiseringen kun rigtig, hvis betaling og fakturering faldt i
   * samme år — hvilket sjældent holder ved udenlandske kunder.
   */
  omsaetningUdenFakturagrundlag?: boolean;
  /**
   * Realiseret kursgevinst eller -tab i året. Hører IKKE til virksomhedens
   * resultat: for personer er nettogevinst på en fordring i fremmed valuta
   * kapitalindkomst efter kursgevinstlovens § 14 og oplyses i rubrik 39.
   * Vises derfor for sig, så den ikke forsvinder i overskuddet.
   */
  kursgevinstOere: number;
  /** Overstiger nettoen bagatelgrænsen, så den skal oplyses? */
  kursgevinstSkalOplyses: boolean;
};

/**
 * Skattemæssigt fradragsbeløb (øre, fortegnet) for én firma-postering.
 * En leverandør-refusion (positivt beløb på en udgiftstype) giver NEGATIVT
 * fradrag — den nedsætter årets omkostninger.
 */
export function fradragsbeloebOere(t: Transaktion): number {
  if (t.konto !== "firma" || t.beloebOere === 0) return 0;
  if (t.momsType === "salgsmoms" || t.momsType === "udenfor") return 0;
  // Uden momstype eller momsfri: kun udgifter fradrages (indtægter er
  // omsætning eller ukategoriserede — aldrig negativt fradrag).
  if (t.beloebOere > 0 && (t.momsType === undefined || t.momsType === "momsfri"))
    return 0;
  const brutto = Math.abs(t.beloebOere);
  const moms = t.momsOere ?? 0;
  const momsFradrag = Math.round((moms * (t.momsFradragPct ?? 100)) / 100);
  // Ikke-fradragsberettiget moms er en reel omkostning og bliver i grundlaget.
  // Ved omvendt betalingspligt er fakturaen netto; den beregnede moms skyldes
  // og fradrages i momsregnskabet — men den IKKE-fradragne del betales reelt
  // og LÆGGES derfor til grundlaget (spejlbilledet af koebsmoms-grenen).
  const ikkeFradragetMoms = moms - Math.min(momsFradrag, moms);
  const erOmvendt = t.momsType === "omvendt" || t.momsType === "omvendt3land";
  const grundlag = erOmvendt ? brutto + ikkeFradragetMoms : brutto - Math.min(momsFradrag, moms);
  const fradrag = Math.round((grundlag * (t.fradragPct ?? 100)) / 100);
  return t.beloebOere < 0 ? fradrag : -fradrag;
}

/** Nettoomsætning (øre, fortegnet — en kreditnota trækker fra). */
function omsaetningOere(t: Transaktion): number {
  if (t.konto !== "firma" || t.beloebOere === 0) return 0;
  if (t.momsType === "salgsmoms") {
    const ind = t.beloebOere > 0 ? 1 : -1;
    return ind * (Math.abs(t.beloebOere) - (t.momsOere ?? 0));
  }
  if (t.momsType === "momsfri" && t.beloebOere > 0) return t.beloebOere;
  return 0; // udenfor/ejerindskud/momsrefusion tæller ikke som omsætning
}

export function beregnSkatteOpgoerelse(
  transaktioner: Transaktion[],
  aar: number,
  indstillinger: Indstillinger,
  fakturaer: Faktura[] = [],
  kursdifferencer: Kursdifference[] = [],
): SkatteOpgoerelse {
  const fra = `${aar}-01-01`;
  const til = `${aar}-12-31`;
  const s = satserFor(aar);

  const firmaAar = transaktioner.filter(
    (t) => t.konto === "firma" && t.dato >= fra && t.dato <= til,
  );

  // Omsætningen periodiseres efter FAKTURADATOEN — en indtægt hører til det
  // år, den er erhvervet, ikke det år pengene kom ind (statsskattelovens § 4).
  const fakturaerIAaret = fakturaer.filter(
    (f) => f.fakturadato >= fra && f.fakturadato <= til,
  );
  const harFakturagrundlag = fakturaerIAaret.length > 0;

  let omsaetning = 0;
  let udgifter = 0;
  let uafklarede = 0;

  if (harFakturagrundlag) {
    // Beløbet uden moms — momsen er statens penge og aldrig omsætning.
    for (const f of fakturaerIAaret) omsaetning += f.dkkOere;
  }

  for (const t of firmaAar) {
    if (!t.afklaret) uafklarede++;
    if (!harFakturagrundlag) omsaetning += omsaetningOere(t);
    udgifter += fradragsbeloebOere(t);
  }

  // Kursgevinsten er kapitalindkomst, ikke virksomhedsindkomst — den holdes
  // uden for resultatet og vises for sig.
  const kursgevinst = kursdifferencer
    .filter((k) => k.aar === aar)
    .reduce((sum, k) => sum + k.differenceOere, 0);

  const resultat = omsaetning - udgifter;

  // Underskud: kan modregnes i anden indkomst — ingen skat at estimere her.
  if (resultat <= 0) {
    return {
      aar,
      omsaetningOere: omsaetning,
      udgifterOere: udgifter,
      resultatOere: resultat,
      amBidragOere: 0,
      efterAmOere: resultat,
      estimeretSkatOere: 0,
      marginalPct: 0,
      topskatRamt: false,
      antalPosteringer: firmaAar.length,
      uafklarede,
      fakturaer: fakturaerIAaret,
      omsaetningUdenFakturagrundlag: harFakturagrundlag ? undefined : true,
      kursgevinstOere: kursgevinst,
      kursgevinstSkalOplyses: Math.abs(kursgevinst) > KURSGEVINST_BAGATELGRAENSE_OERE,
    };
  }

  const amBidrag = Math.round((resultat * s.amBidragPct) / 100);
  const efterAm = resultat - amBidrag;

  const kommune = indstillinger.kommuneskatPct ?? s.kommuneskatGnsPct;
  const basisPct =
    s.bundskatPct + kommune + (indstillinger.kirkeskat ? s.kirkeskatGnsPct : 0);

  // Virksomhedsindkomsten ligger marginalt OVEN PÅ lønnen. For hvert af
  // 2026-reformens trin beskattes den del af [løn, løn+overskud] (efter AM),
  // der rager op over trinnets grænse.
  const loenEfterAm = Math.round(
    ((indstillinger.loenAarOere ?? 0) * (100 - s.amBidragPct)) / 100,
  );
  const overTrin = (graenseKr: number): number =>
    Math.max(0, loenEfterAm + efterAm - Math.max(graenseKr * 100, loenEfterAm));
  const trinSkat =
    Math.round((overTrin(s.mellemskatGraenseKr) * s.mellemskatPct) / 100) +
    Math.round((overTrin(s.topskatGraenseKr) * s.topskatPct) / 100) +
    Math.round((overTrin(s.topTopskatGraenseKr) * s.topTopskatPct) / 100);

  const basisSkat = Math.round((efterAm * basisPct) / 100);
  const estimeret = amBidrag + basisSkat + trinSkat;

  return {
    aar,
    omsaetningOere: omsaetning,
    udgifterOere: udgifter,
    resultatOere: resultat,
    amBidragOere: amBidrag,
    efterAmOere: efterAm,
    estimeretSkatOere: estimeret,
    marginalPct: Math.round((estimeret / resultat) * 1000) / 10,
    topskatRamt: trinSkat > 0,
    antalPosteringer: firmaAar.length,
    uafklarede,
    fakturaer: fakturaerIAaret,
    omsaetningUdenFakturagrundlag: harFakturagrundlag ? undefined : true,
    kursgevinstOere: kursgevinst,
    kursgevinstSkalOplyses: Math.abs(kursgevinst) > KURSGEVINST_BAGATELGRAENSE_OERE,
  };
}

/** Udgifter grupperet pr. kategori (øre) — til søjlerne i skattepanelet. */
export function udgifterPrKategori(
  transaktioner: Transaktion[],
  aar: number,
): { kategori: string; fradragOere: number; bruttoOere: number }[] {
  const fra = `${aar}-01-01`;
  const til = `${aar}-12-31`;
  const pr = new Map<string, { fradrag: number; brutto: number }>();
  for (const t of transaktioner) {
    if (t.konto !== "firma" || t.beloebOere >= 0) continue;
    if (t.dato < fra || t.dato > til) continue;
    const noegle = t.kategori ?? "(ukategoriseret)";
    const e = pr.get(noegle) ?? { fradrag: 0, brutto: 0 };
    e.fradrag += fradragsbeloebOere(t);
    e.brutto += Math.abs(t.beloebOere);
    pr.set(noegle, e);
  }
  return [...pr.entries()]
    .map(([kategori, v]) => ({
      kategori,
      fradragOere: v.fradrag,
      bruttoOere: v.brutto,
    }))
    .sort((a, b) => b.bruttoOere - a.bruttoOere);
}
