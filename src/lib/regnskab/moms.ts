/**
 * Momsmotoren — udregner momsindberetningens rubrikker for en periode ud fra
 * firma-bogens posteringer, klar til at taste direkte ind i TastSelv Erhverv.
 *
 * Momsmatematikken pr. postering ligger i regler.ts (beregnMoms); her
 * aggregeres pr. periode:
 *
 *   Salgsmoms (udgående)           = moms af dansk salg
 *   Moms af ydelseskøb i udlandet  = beregnet 25 % ved omvendt betalingspligt
 *   Købsmoms (indgående)           = fradragsberettiget moms af køb
 *                                     (inkl. den beregnede udlandsmoms, ganget
 *                                     med momsFradragPct pr. postering)
 *   Momstilsvar                    = salgsmoms + udlandsmoms − købsmoms
 *
 * Rubrik A-ydelser = nettoværdien af ydelseskøb i udlandet (EU) — oplysning,
 * ikke penge. Positivt tilsvar = du skylder Skat; negativt = du får retur.
 */
import type {
  Faktura,
  FakturaRubrik,
  Momsperiode,
  MomsIndberetning,
  Transaktion,
} from "./typer";

/**
 * EU's momsområde pr. 2026. Bemærk to ting, der ofte tages fejl af:
 *
 * - Storbritannien er IKKE med. Efter Brexit er UK et tredjeland, og salg
 *   dertil hører i rubrik C — ikke i rubrik B, og ikke i "EU-salg uden moms".
 *   Nordirland er kun i EU's momsområde for VARER, ikke for ydelser.
 * - Danmark står ikke på listen, fordi dansk salg behandles for sig.
 */
const EU_LANDE = new Set([
  "BE", "BG", "CY", "CZ", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "HU",
  "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK", "AT",
]);

export function erEuLand(land: string): boolean {
  return EU_LANDE.has(land.toUpperCase().trim());
}

/**
 * Hvilken momsrubrik hører et ydelsessalg i?
 *
 * Reglen for ydelser solgt til virksomheder er, at leveringsstedet er dér,
 * hvor kunden hører hjemme (momslovens § 16, stk. 1). Derfor:
 *
 * - Dansk kunde        → dansk moms, 25 %.
 * - EU-virksomhed med gyldigt momsnummer → uden dansk moms, omvendt
 *   betalingspligt, rubrik B, og skal desuden på EU-salgslisten.
 * - EU-kunde UDEN momsnummer → betragtes som privatkunde: dansk moms.
 * - Uden for EU        → uden dansk moms, rubrik C.
 *
 * FORBEHOLD, der ikke kan afgøres maskinelt: momslovens § 16, stk. 3 flytter
 * leveringsstedet TILBAGE til Danmark for visse rådgivnings- og
 * databehandlingsydelser, hvis ydelsen faktisk udnyttes her i landet. Sælger
 * du udvikling til et udenlandsk selskab, men arbejdet bruges i Danmark, kan
 * der alligevel være dansk moms på. Det skal vurderes konkret.
 */
export function foreslaaFakturaRubrik(
  land: string,
  kundeMomsnr?: string,
): FakturaRubrik {
  const l = land.toUpperCase().trim();
  if (l === "DK" || l === "") return "salgsmoms";
  if (erEuLand(l)) return kundeMomsnr?.trim() ? "rubrikB" : "salgsmoms";
  return "rubrikC";
}

export type Periode = {
  /** Nøgle, fx "2026-H1", "2026-K3" eller "2026-M07". */
  noegle: string;
  /** Menneske-label, fx "1. halvår 2026". */
  label: string;
  fra: string; // ISO inkl.
  til: string; // ISO inkl.
};

/** Alle perioder for et år ved en given afregningsfrekvens. */
export function perioderForAar(aar: number, frekvens: Momsperiode): Periode[] {
  if (frekvens === "halvaar") {
    return [
      {
        noegle: `${aar}-H1`,
        label: `1. halvår ${aar}`,
        fra: `${aar}-01-01`,
        til: `${aar}-06-30`,
      },
      {
        noegle: `${aar}-H2`,
        label: `2. halvår ${aar}`,
        fra: `${aar}-07-01`,
        til: `${aar}-12-31`,
      },
    ];
  }
  if (frekvens === "kvartal") {
    return [1, 2, 3, 4].map((k) => {
      const fraMd = (k - 1) * 3 + 1;
      const tilMd = k * 3;
      return {
        noegle: `${aar}-K${k}`,
        label: `${k}. kvartal ${aar}`,
        fra: `${aar}-${String(fraMd).padStart(2, "0")}-01`,
        til: `${aar}-${String(tilMd).padStart(2, "0")}-${sidsteDag(aar, tilMd)}`,
      };
    });
  }
  return Array.from({ length: 12 }, (_, i) => {
    const md = i + 1;
    return {
      noegle: `${aar}-M${String(md).padStart(2, "0")}`,
      label: `${MD_NAVNE[i]} ${aar}`,
      fra: `${aar}-${String(md).padStart(2, "0")}-01`,
      til: `${aar}-${String(md).padStart(2, "0")}-${sidsteDag(aar, md)}`,
    };
  });
}

const MD_NAVNE = [
  "Januar", "Februar", "Marts", "April", "Maj", "Juni",
  "Juli", "August", "September", "Oktober", "November", "December",
];

function sidsteDag(aar: number, md: number): string {
  return String(new Date(Date.UTC(aar, md, 0)).getUTCDate()).padStart(2, "0");
}

/**
 * Rekonstruér [fra, til]-intervallet fra en periode-NØGLE alene — nøglen
 * (H1/H2, K1-4, M01-12) er selvbeskrivende, uafhængigt af den aktuelle
 * afregningsfrekvens. Bruges til overlap-vagten ved indberetning.
 */
export function intervalForNoegle(
  noegle: string,
): { fra: string; til: string } | null {
  const m = noegle.match(/^(\d{4})-(H[12]|K[1-4]|M(0[1-9]|1[0-2]))$/);
  if (!m) return null;
  const aar = Number(m[1]);
  const del = m[2];
  const frekvens: Momsperiode = del.startsWith("H")
    ? "halvaar"
    : del.startsWith("K")
      ? "kvartal"
      : "maaned";
  const p = perioderForAar(aar, frekvens).find((x) => x.noegle === noegle);
  return p ? { fra: p.fra, til: p.til } : null;
}

/** Find den periode en ISO-dato hører til. */
export function periodeForDato(dato: string, frekvens: Momsperiode): Periode {
  const aar = Number(dato.slice(0, 4));
  const perioder = perioderForAar(aar, frekvens);
  return (
    perioder.find((p) => dato >= p.fra && dato <= p.til) ?? perioder[perioder.length - 1]
  );
}

export type MomsOpgoerelse = {
  periode: Periode;
  /** Rubrikkerne, alle i øre. */
  salgsmomsOere: number;
  ydelseskoebsmomsOere: number;
  koebsmomsOere: number;
  tilsvarOere: number;
  /** Rubrik A-ydelser: nettoværdi af ydelseskøb i andre EU-LANDE (oplysningsrubrik). */
  rubrikAYdelserOere: number;
  /** Rubrik B-ydelser: momsfrit salg af ydelser til EU-virksomheder (oplysningsrubrik + EU-salgsliste). */
  rubrikBYdelserOere: number;
  /**
   * Rubrik C: værdien af salg uden dansk moms, der IKKE hører i rubrik B —
   * i praksis alt salg til kunder uden for EU. Efter Brexit også UK.
   * Må ikke indberettes til "EU-salg uden moms".
   */
  rubrikCOere: number;
  /** Grundlag til kontrol. */
  omsaetningNettoOere: number;
  antalPosteringer: number;
  uafklarede: number;
  /** Fakturaer, hvis fakturadato falder i perioden. */
  fakturaer: Faktura[];
  /**
   * Sat, når salget er opgjort ud fra bankposteringer frem for fakturaer.
   * Så er periodiseringen kun rigtig, hvis betaling og fakturering faldt i
   * samme periode — hvilket sjældent holder ved udenlandske kunder.
   */
  salgUdenFakturagrundlag?: boolean;
  /** Er perioden allerede markeret som indberettet? */
  indberetning?: MomsIndberetning;
};

/**
 * Udregn momsopgørelsen for én periode.
 *
 * SALGSSIDEN kommer fra FAKTURAERNE og periodiseres efter fakturadatoen, fordi
 * momspligten indtræder ved leveringen — ikke når kunden betaler. En faktura
 * udstedt i december hører til december, også selv om pengene først kommer i
 * marts. Bruger man bankdatoen, ryger omsætningen i den forkerte periode.
 *
 * KØBSSIDEN kommer fra bankposteringerne, hvor betalingen normalt er tæt nok
 * på leveringen til, at det ikke gør en forskel.
 *
 * Er der ingen fakturaer registreret i perioden, falder opgørelsen tilbage til
 * den gamle adfærd og læser salget af posteringerne — så eksisterende regnskaber
 * ikke pludselig viser nul. Det markeres med `salgUdenFakturagrundlag`.
 */
export function beregnMomsOpgoerelse(
  transaktioner: Transaktion[],
  periode: Periode,
  indberetninger: MomsIndberetning[] = [],
  fakturaer: Faktura[] = [],
): MomsOpgoerelse {
  const iPerioden = transaktioner.filter(
    (t) => t.konto === "firma" && t.dato >= periode.fra && t.dato <= periode.til,
  );
  const fakturaerIPerioden = fakturaer.filter(
    (f) => f.fakturadato >= periode.fra && f.fakturadato <= periode.til,
  );
  const harFakturagrundlag = fakturaerIPerioden.length > 0;

  let salgsmoms = 0;
  let ydelsesmoms = 0;
  let koebsmoms = 0;
  let rubrikA = 0;
  let rubrikB = 0;
  let rubrikC = 0;
  let omsaetning = 0;
  let uafklarede = 0;

  // ── Salgssiden: fra fakturaerne, periodiseret efter fakturadato ──
  for (const f of fakturaerIPerioden) {
    switch (f.rubrik) {
      case "salgsmoms":
        salgsmoms += f.momsDkkOere;
        omsaetning += f.dkkOere;
        break;
      case "rubrikB":
        rubrikB += f.dkkOere;
        omsaetning += f.dkkOere;
        break;
      case "rubrikC":
        rubrikC += f.dkkOere;
        omsaetning += f.dkkOere;
        break;
      case "momsfri":
        omsaetning += f.dkkOere;
        break;
    }
  }

  for (const t of iPerioden) {
    if (!t.afklaret) uafklarede++;
    const moms = t.momsOere ?? 0;
    const momsFradrag = Math.round((moms * (t.momsFradragPct ?? 100)) / 100);
    // Fortegn: en kreditnota/refusion vender modsat af momstypens normale
    // retning og skal TRÆKKES FRA i stedet for at lægges til. ind = penge ind.
    const ind = t.beloebOere >= 0 ? 1 : -1;
    switch (t.momsType) {
      case "salgsmoms":
        // Springes over når fakturaerne bærer salget — ellers tælles det dobbelt.
        if (harFakturagrundlag) break;
        salgsmoms += ind * moms;
        omsaetning += ind * (Math.abs(t.beloebOere) - moms);
        break;
      case "koebsmoms":
        koebsmoms += -ind * momsFradrag;
        break;
      case "omvendt":
        // Beregnet dansk moms af EU-ydelseskøb: skyldes OG fradrages.
        ydelsesmoms += -ind * moms;
        koebsmoms += -ind * momsFradrag;
        // Rubrik A-ydelser omfatter KUN EU-køb (tredjeland holdes ude).
        rubrikA += -ind * Math.abs(t.beloebOere);
        break;
      case "omvendt3land":
        // Samme momsmekanik som EU-køb — men ingen rubrik A.
        ydelsesmoms += -ind * moms;
        koebsmoms += -ind * momsFradrag;
        break;
      case "momsfri":
        if (harFakturagrundlag) break;
        if (t.beloebOere > 0) {
          omsaetning += t.beloebOere;
          // EU-salg af ydelser skal oplyses i rubrik B (og EU-salgslisten).
          if (t.kategori === "salg-eu") rubrikB += t.beloebOere;
        }
        break;
      default:
        break;
    }
  }

  return {
    periode,
    salgsmomsOere: salgsmoms,
    ydelseskoebsmomsOere: ydelsesmoms,
    koebsmomsOere: koebsmoms,
    tilsvarOere: salgsmoms + ydelsesmoms - koebsmoms,
    rubrikAYdelserOere: rubrikA,
    rubrikBYdelserOere: rubrikB,
    rubrikCOere: rubrikC,
    omsaetningNettoOere: omsaetning,
    antalPosteringer: iPerioden.length,
    uafklarede,
    fakturaer: fakturaerIPerioden,
    salgUdenFakturagrundlag: harFakturagrundlag ? undefined : true,
    indberetning: indberetninger.find((i) => i.periode === periode.noegle),
  };
}

/**
 * De perioder der er relevante at vise: alle fra første regnskabsår
 * til og med i dag (nyeste først).
 */
export function relevantePerioder(
  foersteAar: number,
  frekvens: Momsperiode,
  idag: string,
): Periode[] {
  const iAar = Number(idag.slice(0, 4));
  const ud: Periode[] = [];
  for (let aar = foersteAar; aar <= iAar; aar++) {
    for (const p of perioderForAar(aar, frekvens)) {
      if (p.fra <= idag) ud.push(p);
    }
  }
  return ud.reverse();
}
