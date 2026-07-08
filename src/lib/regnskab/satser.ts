/**
 * Centrale satser og beløbsgrænser pr. år — ét sted, så et årsskifte er én
 * fil at opdatere. 2026-værdierne er kildekritisk efterprøvet mod skat.dk,
 * skm.dk og Skatterådets satsbekendtgørelse (research juli 2026); se
 * viden-basen for kilderne bag hvert tal.
 *
 * BEMÆRK: Satserne bruges til Odins ESTIMATER og påmindelser — den endelige
 * sandhed er altid din forskuds-/årsopgørelse hos Skattestyrelsen.
 */

export type AarsSatser = {
  aar: number;
  /** AM-bidrag af virksomhedsoverskud/løn (procent). */
  amBidragPct: number;
  /** Personfradrag (kr./år). */
  personfradragKr: number;
  /** Bundskat (procent). */
  bundskatPct: number;
  /**
   * 2026-skattereformens trin (alle grænser i kr. personlig indkomst EFTER
   * AM-bidrag): mellemskat og topskat à 7,5 % afløste den gamle 15 %-topskat,
   * og top-topskatten på 5 % kom til.
   */
  mellemskatPct: number;
  mellemskatGraenseKr: number;
  topskatPct: number;
  topskatGraenseKr: number;
  topTopskatPct: number;
  topTopskatGraenseKr: number;
  /** Gennemsnitlig kommuneskat (procent) — bruges hvis du ikke har sat din egen. */
  kommuneskatGnsPct: number;
  /** Gennemsnitlig kirkeskat (procent) — lægges til estimatet, hvis du betaler. */
  kirkeskatGnsPct: number;
  /** Straksafskrivningsgrænse, UDELUKKENDE erhvervsmæssige driftsmidler (kr. ekskl. moms). */
  smaaanskaffelserKr: number;
  /** Straksafskrivningsgrænse ved BLANDET privat/erhvervsbrug (kr.). */
  smaaanskaffelserBlandetKr: number;
  /** Skattefri kørselssats, egen bil: op til/over 20.000 km/år (kr./km). */
  koerselLavKrPrKm: number;
  koerselHoejKrPrKm: number;
  /** Momsregistreringsgrænse (kr. momspligtig omsætning PR. KALENDERÅR, 2025-regel). */
  momsgraenseKr: number;
  /** Afgift for foreløbig fastsættelse ved manglende momsindberetning (kr. pr. periode). */
  fastsaettelseGebyrKr: number;
  /** Beskatning af fri telefon (kr./år). */
  friTelefonKr: number;
  /** Loft for fradrag af fagforeningskontingent (kr./år). */
  fagforeningLoftKr: number;
  /** Skattetillæg ved for sent oplysningsskema (kr./dag og loft). */
  skattetillaegPrDagKr: number;
  skattetillaegMaksKr: number;
  /** Restskat: indregningsgrænse (kr.). */
  restskatIndregningKr: number;
  /** B-skat: måneder med rate (1-12) og sidste rettidige betalingsdag i måneden. */
  bSkatMaaneder: number[];
  bSkatBetalingsdag: number;
  /** Noter om kildegrundlag/usikkerhed. */
  kilde: string;
};

/** 2026-satser — kildekritisk efterprøvet juli 2026. */
export const SATSER_2026: AarsSatser = {
  aar: 2026,
  amBidragPct: 8,
  personfradragKr: 54_100,
  bundskatPct: 12.01,
  mellemskatPct: 7.5,
  mellemskatGraenseKr: 641_200,
  topskatPct: 7.5,
  topskatGraenseKr: 777_900,
  topTopskatPct: 5,
  topTopskatGraenseKr: 2_592_700,
  kommuneskatGnsPct: 25.05,
  kirkeskatGnsPct: 0.87,
  smaaanskaffelserKr: 36_000,
  smaaanskaffelserBlandetKr: 16_900,
  koerselLavKrPrKm: 3.94,
  koerselHoejKrPrKm: 2.28,
  momsgraenseKr: 50_000,
  fastsaettelseGebyrKr: 1_400,
  friTelefonKr: 3_500,
  fagforeningLoftKr: 7_000,
  skattetillaegPrDagKr: 400,
  skattetillaegMaksKr: 10_000,
  restskatIndregningKr: 25_200,
  bSkatMaaneder: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11],
  bSkatBetalingsdag: 20,
  kilde:
    "skat.dk/skm.dk-satser 2026, kildekritisk efterprøvet 2026-07-08 — kilder i viden-basen.",
};

export function satserFor(aar: number): AarsSatser {
  // Indtil flere år er lagt ind, bruges 2026-satserne som grundlag for alle år.
  return { ...SATSER_2026, aar };
}
