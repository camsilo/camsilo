/**
 * Fælles typer for Odin-regnskabet — det personlige regnskabsprogram i /admin.
 *
 * Grundprincipper:
 * - ALLE beløb lagres i HELE ØRE som integers (aldrig flydende komma på penge).
 *   Negativt beløb = udgift/hævning, positivt = indtægt/indsætning.
 * - To adskilte "bøger": privat (din egen konto) og firma (Camsilo).
 * - Moms behandles KUN på firma-bogen; privat-bogen kender i stedet til
 *   skatterelevans (befordring, fagforening, donationer …).
 * - Datoer som ISO "yyyy-mm-dd" (bankernes bogføringsdato), tidsstempler epoch-ms.
 */

export type Konto = "privat" | "firma";

/**
 * Momsmæssig behandling af én postering (kun firma-bogen).
 *
 * - salgsmoms:  dansk salg med 25 % moms — momsOere er salgsmomsen (20 % af brutto).
 * - koebsmoms:  dansk køb med 25 % moms — momsOere er købsmomsen (20 % af brutto).
 * - omvendt:    ydelseskøb i et andet EU-LAND med omvendt betalingspligt
 *               (reverse charge) — fakturaen er uden moms; momsOere er den
 *               BEREGNEDE danske moms (25 % af beløbet), som både skal angives
 *               som skyldig OG kan fradrages som købsmoms (neutral ved fuld
 *               fradragsret). Indgår i oplysningsrubrik A-ydelser.
 * - omvendt3land: samme momsmekanik, men leverandøren er UDEN FOR EU (fx USA)
 *               — skal IKKE med i rubrik A-ydelser (kun EU-køb hører til dér).
 * - momsfri:    ingen moms i transaktionen (forsikring, bankgebyrer, renter,
 *               momsfrie ydelser) — momsOere er 0.
 * - udenfor:    helt uden for momsregnskabet (ejerindskud, privat hævning,
 *               momsbetaling til Skat, interne overførsler) — momsOere er 0.
 */
export type MomsType =
  | "salgsmoms"
  | "koebsmoms"
  | "omvendt"
  | "omvendt3land"
  | "momsfri"
  | "udenfor";

export type Transaktion = {
  id: string;
  konto: Konto;
  /** Bogføringsdato fra banken, ISO "yyyy-mm-dd". */
  dato: string;
  /** Posteringstekst fra banken, som den kom. */
  tekst: string;
  /** Beløb i hele øre. Negativt = udgift. */
  beloebOere: number;
  /** Saldo efter posteringen i hele øre, hvis banken leverer den. */
  saldoOere?: number;

  /** Kategori-id (se kategorier.ts) — sættes af regler eller af dig via Odin. */
  kategori?: string;
  /** Har Odin fået dit ord på posteringen (kategori + moms/fradrag bekræftet)? */
  afklaret?: boolean;

  // ── Firma-bogens moms & skattefradrag ─────────────────────────
  momsType?: MomsType;
  /** Momsbeløb i øre (fortegnsløst; retning følger momsType). */
  momsOere?: number;
  /** Hvor stor en andel af MOMSEN der kan fradrages (0-100). Fx restaurant 25. */
  momsFradragPct?: number;
  /** Hvor stor en andel af udgiften der er SKATTEMÆSSIGT fradragsberettiget (0-100). */
  fradragPct?: number;
  /** Fortløbende bilagsnummer på firma-bogen (bogføringslovens transaktionsspor). */
  bilagNr?: number;

  // ── Privat-bogens skatterelevans ──────────────────────────────
  /** Posteringen kan have betydning for din private årsopgørelse. */
  skatteRelevant?: boolean;

  /** Din egen note på posteringen. */
  note?: string;
  /** Hvilken import posteringen kom fra. */
  importId: string;
  /** Dedup-fingeraftryk — samme postering importeres aldrig to gange. */
  fingeraftryk: string;
  /** Er posteringen låst af en indberettet momsperiode? (id i indberetninger) */
  laastAf?: string;
  /** Oprettet (epoch-ms). */
  ts: number;
};

/** En gennemført import af et kontoudtog (til historik og fortryd). */
export type ImportLog = {
  id: string;
  konto: Konto;
  filnavn: string;
  /** Antal nye posteringer, sprunget-over dubletter og ulæselige linjer. */
  nye: number;
  dubletter: number;
  fejllinjer: number;
  /** Datointerval i filen. */
  fra?: string;
  til?: string;
  ts: number;
};

/** Kategoriseringsregel: tekst-mønster → kategori (+ moms/fradrags-defaults). */
export type Regel = {
  id: string;
  /** Mønster matches som lowercase-delstreng i den normaliserede posteringstekst. */
  moenster: string;
  /** Begræns evt. reglen til én bog. */
  konto?: Konto;
  kategori: string;
  momsType?: MomsType;
  momsFradragPct?: number;
  fradragPct?: number;
  skatteRelevant?: boolean;
  /** indbygget = leveret med programmet; laert = skabt af dine svar til Odin. */
  kilde: "indbygget" | "laert";
  ts: number;
};

/** En momsperiode markeret som indberettet i TastSelv (låser posteringerne). */
export type MomsIndberetning = {
  id: string;
  /** Periode-nøgle, fx "2026-H1" eller "2026-K3". */
  periode: string;
  /** Øjebliksbillede af rubrikkerne, i øre, som de så ud ved indberetning. */
  salgsmomsOere: number;
  koebsmomsOere: number;
  ydelseskoebsmomsOere: number;
  tilsvarOere: number;
  rubrikAOere: number;
  /** Rubrik B-ydelser: EU-salg af ydelser uden moms (oplysningsrubrik). */
  rubrikBOere?: number;
  /** Markeret som betalt? */
  betalt?: boolean;
  note?: string;
  ts: number;
};

export type Momsperiode = "halvaar" | "kvartal" | "maaned";

export type Virksomhedsform = "enkeltmandsvirksomhed" | "aps";

/** Programmets indstillinger — udfyldes gennem Odins onboarding-spørgsmål. */
export type Indstillinger = {
  onboardingFaerdig: boolean;
  virksomhedsnavn: string;
  cvr?: string;
  virksomhedsform: Virksomhedsform;
  /** Er virksomheden momsregistreret (pligt ved omsætning over registreringsgrænsen)? */
  momsregistreret: boolean;
  momsperiode: Momsperiode;
  /** Første regnskabsår i programmet, fx 2026. */
  foersteAar: number;
  /** Din kommunale skatteprocent (bruges KUN til estimater). */
  kommuneskatPct?: number;
  /** Betaler du kirkeskat? */
  kirkeskat?: boolean;
  /** Forventet årlig lønindkomst ved siden af (øre) — til skatte-estimatets kontekst. */
  loenAarOere?: number;
  /** Betaler du B-skat-rater i øjeblikket? */
  betalerBSkat?: boolean;
};

/** Standard-indstillinger før onboarding er gennemført. */
export const STANDARD_INDSTILLINGER: Indstillinger = {
  onboardingFaerdig: false,
  virksomhedsnavn: "Camsilo",
  virksomhedsform: "enkeltmandsvirksomhed",
  momsregistreret: true,
  // Nyregistrerede virksomheder sættes altid på KVARTALSVIS afregning
  // (typisk de første ca. 1½ år, hvorefter Skat kan flytte små til halvår).
  momsperiode: "kvartal",
  foersteAar: 2026,
  kommuneskatPct: 25.0,
  kirkeskat: false,
  betalerBSkat: false,
};

// ── Hjælpere til beløb ──────────────────────────────────────────

const fmtKr = new Intl.NumberFormat("da-DK", {
  style: "currency",
  currency: "DKK",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const fmtKrRund = new Intl.NumberFormat("da-DK", {
  style: "currency",
  currency: "DKK",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Øre → "1.234,56 kr." */
export function kr(oere: number): string {
  return fmtKr.format(oere / 100);
}

/** Øre → "1.235 kr." (afrundet, til KPI-tal). */
export function krRund(oere: number): string {
  return fmtKrRund.format(Math.round(oere / 100));
}
