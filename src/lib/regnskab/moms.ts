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
import type { Momsperiode, MomsIndberetning, Transaktion } from "./typer";

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
  /** Grundlag til kontrol. */
  omsaetningNettoOere: number;
  antalPosteringer: number;
  uafklarede: number;
  /** Er perioden allerede markeret som indberettet? */
  indberetning?: MomsIndberetning;
};

/** Udregn momsopgørelsen for én periode af firma-bogen. */
export function beregnMomsOpgoerelse(
  transaktioner: Transaktion[],
  periode: Periode,
  indberetninger: MomsIndberetning[] = [],
): MomsOpgoerelse {
  const iPerioden = transaktioner.filter(
    (t) => t.konto === "firma" && t.dato >= periode.fra && t.dato <= periode.til,
  );

  let salgsmoms = 0;
  let ydelsesmoms = 0;
  let koebsmoms = 0;
  let rubrikA = 0;
  let rubrikB = 0;
  let omsaetning = 0;
  let uafklarede = 0;

  for (const t of iPerioden) {
    if (!t.afklaret) uafklarede++;
    const moms = t.momsOere ?? 0;
    const momsFradrag = Math.round((moms * (t.momsFradragPct ?? 100)) / 100);
    // Fortegn: en kreditnota/refusion vender modsat af momstypens normale
    // retning og skal TRÆKKES FRA i stedet for at lægges til. ind = penge ind.
    const ind = t.beloebOere >= 0 ? 1 : -1;
    switch (t.momsType) {
      case "salgsmoms":
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
    omsaetningNettoOere: omsaetning,
    antalPosteringer: iPerioden.length,
    uafklarede,
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
