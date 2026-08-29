/**
 * Valgbare perioder — fra de seneste timer til hele virksomhedens levetid.
 *
 * En ting er værd at vide på forhånd: bankposteringer har kun en DATO, ikke
 * et klokkeslæt. Netbankernes kontoudtog leverer bogføringsdato, og det er
 * det eneste, der er at gå efter. "Seneste 12 timer" kan derfor ikke skære i
 * bankdata — den ser i stedet på, hvornår posteringen kom ind i programmet,
 * og er dermed et svar på "hvad har jeg lige importeret", ikke "hvad brugte
 * jeg penge på i nat". Det står også i valgets forklaring, så tallet ikke
 * læses som noget, det ikke er.
 */

export type PeriodeValgId =
  | "12t"
  | "idag"
  | "7d"
  | "30d"
  | "90d"
  | "iaar"
  | "sidsteaar"
  | "foerste-faktura"
  | "firmastart"
  | "alt";

export type PeriodeValg = {
  id: PeriodeValgId;
  navn: string;
  /** Vises under vælgeren, når valget er aktivt. */
  forklaring?: string;
  /** Skærer på importtidspunkt frem for bogføringsdato. */
  paaTidsstempel?: boolean;
};

/** Camsilo er registreret i CVR med startdato 1. oktober 2025. */
export const FIRMA_START = "2025-10-01";

export const PERIODEVALG: PeriodeValg[] = [
  {
    id: "12t",
    navn: "Seneste 12 timer",
    paaTidsstempel: true,
    forklaring:
      "Bankposteringer har kun en dato, ikke et klokkeslæt. Det her viser derfor, hvad der er kommet ind i programmet de seneste 12 timer — ikke hvad der er brugt penge på i nat.",
  },
  { id: "idag", navn: "I dag" },
  { id: "7d", navn: "7 dage" },
  { id: "30d", navn: "30 dage" },
  { id: "90d", navn: "90 dage" },
  { id: "iaar", navn: "I år" },
  { id: "sidsteaar", navn: "Sidste år" },
  {
    id: "foerste-faktura",
    navn: "Siden første faktura",
    forklaring:
      "Fra den dato, den første faktura blev udstedt. Det er dér, virksomheden begyndte at tjene penge — og dermed dér, skatten begynder.",
  },
  {
    id: "firmastart",
    navn: "Siden firmaets start",
    forklaring: `Camsilo er registreret i CVR med startdato ${FIRMA_START.split("-").reverse().join("-")}.`,
  },
  { id: "alt", navn: "Alt" },
];

/** Trækker n dage fra en ISO-dato. */
function minusDage(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

export type Interval = {
  fra: string;
  til: string;
  /** Sat, når der skæres på importtidspunkt frem for bogføringsdato. */
  fraTs?: number;
  navn: string;
  forklaring?: string;
};

/**
 * Oversæt et valg til et konkret datointerval.
 *
 * `aeldsteDato` er den ældste postering i bogen og bruges til "Alt".
 * `foersteFakturadato` bruges til "Siden første faktura"; mangler den, falder
 * valget tilbage til virksomhedens startdato.
 */
export function intervalFor(
  valg: PeriodeValgId,
  idag: string,
  aeldsteDato: string,
  foersteFakturadato?: string,
): Interval {
  const v = PERIODEVALG.find((p) => p.id === valg) ?? PERIODEVALG[5];
  const grund = { navn: v.navn, forklaring: v.forklaring };
  const aar = Number(idag.slice(0, 4));

  switch (valg) {
    case "12t":
      return {
        ...grund,
        fra: minusDage(idag, 1),
        til: idag,
        fraTs: Date.now() - 12 * 60 * 60 * 1000,
      };
    case "idag":
      return { ...grund, fra: idag, til: idag };
    case "7d":
      return { ...grund, fra: minusDage(idag, 6), til: idag };
    case "30d":
      return { ...grund, fra: minusDage(idag, 29), til: idag };
    case "90d":
      return { ...grund, fra: minusDage(idag, 89), til: idag };
    case "iaar":
      return { ...grund, navn: `I år (${aar})`, fra: `${aar}-01-01`, til: idag };
    case "sidsteaar":
      return {
        ...grund,
        navn: `Sidste år (${aar - 1})`,
        fra: `${aar - 1}-01-01`,
        til: `${aar - 1}-12-31`,
      };
    case "foerste-faktura":
      return { ...grund, fra: foersteFakturadato ?? FIRMA_START, til: idag };
    case "firmastart":
      return { ...grund, fra: FIRMA_START, til: idag };
    case "alt":
    default:
      return { ...grund, fra: aeldsteDato, til: idag };
  }
}

/** Hvor mange dage dækker intervallet? Bruges til at vise perioden pænt. */
export function antalDage(i: Interval): number {
  const a = new Date(`${i.fra}T12:00:00Z`).getTime();
  const b = new Date(`${i.til}T12:00:00Z`).getTime();
  return Math.round((b - a) / 86_400_000) + 1;
}

/** "1. okt. 2025 – 29. aug. 2026 · 333 dage" */
export function beskrivInterval(i: Interval): string {
  const f = new Intl.DateTimeFormat("da-DK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Copenhagen",
  });
  const d = antalDage(i);
  const spand =
    i.fra === i.til
      ? f.format(new Date(`${i.fra}T12:00:00Z`))
      : `${f.format(new Date(`${i.fra}T12:00:00Z`))} – ${f.format(new Date(`${i.til}T12:00:00Z`))}`;
  return d === 1 ? spand : `${spand} · ${d} dage`;
}
