/**
 * Valutakurser fra Danmarks Nationalbank.
 *
 * HVORFOR IKKE BANKENS EGEN KURS: momsbekendtgørelsens § 97, stk. 4 opregner
 * udtømmende, hvilke kurser der må bruges ved omregning af en faktura i fremmed
 * valuta — Nationalbankens kurs, Den Europæiske Centralbanks kurs, eller
 * toldkursen. Den kurs, Wise eller banken tilfældigvis vekslede til, står ikke
 * på listen og kan derfor ikke bruges som grundlag for momsangivelsen.
 *
 * Skattemæssigt gælder samme princip: indtægten omregnes på det tidspunkt, den
 * er erhvervet, ikke da pengene blev vekslet. Forskellen mellem de to er en
 * kursgevinst eller et kurstab, der opgøres for sig (se Kursdifference i
 * typer.ts).
 *
 * Valget af kilde er bindende i mindst to år og skal fremgå af en note til
 * regnskabet. Programmet bruger konsekvent Nationalbankens middelkurs.
 *
 * KILDE: Danmarks Statistiks Statistikbank, tabel DNVALD (Nationalbankens
 * officielle valutakurser, dagligt siden 1977). Serien opgøres som
 * DKK pr. 100 enheder fremmed valuta og findes kun for bankdage.
 */

const STATBANK = "https://api.statbank.dk/v1/data/DNVALD/CSV";

/** Nationalbankens valutakoder for de valutaer, der er relevante her. */
export const KENDTE_VALUTAER = ["EUR", "GBP", "USD", "SEK", "NOK", "CHF", "PLN"] as const;

export type Kursopslag = {
  valuta: string;
  /** DKK pr. 1 enhed fremmed valuta. */
  kurs: number;
  /** Den dato kursen faktisk gælder for. */
  kursdato: string;
  /** Blev der brugt en tidligere bankdag, fordi den ønskede dato var lukket? */
  forskudt: boolean;
  kilde: string;
};

/** "2026-02-06" → "2026M02D06" (Statistikbankens tidsformat). */
function tilStatbankTid(iso: string): string {
  const [aar, md, dag] = iso.split("-");
  return `${aar}M${md}D${dag}`;
}

/** Trækker n dage fra en ISO-dato. */
function minusDage(iso: string, n: number): string {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

/**
 * Slår kursen op for én valuta på én dato.
 *
 * Er datoen ikke en bankdag (weekend, helligdag), gås der bagud dag for dag —
 * op til en uge — indtil en offentliggjort kurs findes. Det svarer til
 * "senest offentliggjorte kurs", som er den, momsbekendtgørelsen peger på.
 *
 * Returnerer null hvis kursen ikke kunne hentes; kaldere skal så bede om en
 * manuelt indtastet kurs frem for at gætte.
 */
export async function hentKurs(
  valuta: string,
  dato: string,
  maksDageTilbage = 7,
): Promise<Kursopslag | null> {
  const v = valuta.toUpperCase().trim();
  if (v === "DKK" || v === "") {
    return { valuta: "DKK", kurs: 1, kursdato: dato, forskudt: false, kilde: "DKK" };
  }

  for (let i = 0; i <= maksDageTilbage; i++) {
    const forsoegsdato = minusDage(dato, i);
    const url =
      `${STATBANK}?VALUTA=${encodeURIComponent(v)}&KURTYP=KBH&Tid=${tilStatbankTid(forsoegsdato)}`;
    try {
      const r = await fetch(url, {
        headers: { accept: "text/csv" },
        // Kurser for en given dato ændrer sig aldrig — cache dem hårdt.
        next: { revalidate: 60 * 60 * 24 * 30 },
      });
      if (!r.ok) continue;
      const tekst = (await r.text()).trim();
      if (!tekst || tekst.includes("errorTypeCode")) continue;

      // Sidste linje: "<valutanavn>;<enhedstekst>;<tid>;<kurs>"
      const sidste = tekst.split("\n").pop() ?? "";
      const felter = sidste.split(";");
      const raa = felter[felter.length - 1]?.trim();
      if (!raa) continue;

      // Dansk decimalkomma, og serien er DKK pr. 100 enheder.
      const pr100 = Number(raa.replace(/\./g, "").replace(",", "."));
      if (!Number.isFinite(pr100) || pr100 <= 0) continue;

      return {
        valuta: v,
        kurs: pr100 / 100,
        kursdato: forsoegsdato,
        forskudt: i > 0,
        kilde: "Danmarks Nationalbank (Statistikbanken DNVALD, middelkurs)",
      };
    } catch {
      // Netværksfejl — prøv dagen før, ellers giv op og lad kalderen taste manuelt.
      continue;
    }
  }
  return null;
}

/**
 * Omregner et beløb i fremmed valuta til DKK-øre.
 *
 * `beloebMinor` er i valutaens mindste enhed (pence, cent). Resultatet er
 * DKK-øre, afrundet til nærmeste øre — regnskabet holdes i heltal.
 */
export function tilDkkOere(beloebMinor: number, kurs: number): number {
  return Math.round(beloebMinor * kurs);
}

/**
 * Opgør kursdifferencen på en fordring.
 *
 * Positivt tal = gevinst (der kom flere kroner ind, end der blev bogført).
 * Negativt tal = tab.
 */
export function kursdifferenceOere(bogfoertOere: number, modtagetOere: number): number {
  return modtagetOere - bogfoertOere;
}

/**
 * Bagatelgrænsen i kursgevinstlovens § 14 for personer.
 *
 * Er den samlede NETTOgevinst på fordringer og gæld i fremmed valuta under
 * grænsen, skal den ikke oplyses. Overskrides den, er HELE gevinsten
 * skattepligtig — det er en tærskel, ikke et bundfradrag.
 *
 * Beløbet har været uændret 2.000 kr. i både 2025 og 2026.
 */
export const KURSGEVINST_BAGATELGRAENSE_OERE = 200_000;

/** Er kursdifferencen så stor, at den skal oplyses? */
export function skalKursgevinstOplyses(nettoOere: number): boolean {
  return Math.abs(nettoOere) > KURSGEVINST_BAGATELGRAENSE_OERE;
}
