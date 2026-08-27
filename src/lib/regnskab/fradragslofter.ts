/**
 * Fradrag med et loft — og hvor meget der er tilbage af hvert.
 *
 * Tanken: mange fradrag har en øvre grænse pr. år. Har du ikke brugt dem, er
 * de tabt ved årsskiftet. Ved at vise dem som målere med "X kr. tilbage"
 * bliver det synligt, hvad der stadig kan nås — og hvad der er ved at løbe ud.
 *
 * VIGTIGT om værdien: et fradrag er ikke penge, du får udbetalt. Det er en
 * nedsættelse af den indkomst, du beskattes af. Et ligningsmæssigt fradrag
 * (fagforening, befordring, service) er ca. 26 øre værd pr. krone, mens et
 * fradrag i den personlige indkomst (driftsudgifter, pension) er ca. 42 øre
 * værd. Derfor bærer hvert fradrag sin egen `vaerdiPrKrone`.
 *
 * Beløbsgrænserne er efterprøvet mod Skattestyrelsens blanketter 04.003 og
 * 04.076 samt Den juridiske vejledning, august 2026. Kilderne ligger i
 * viden-basen under de tilsvarende guides.
 */
import type { Transaktion } from "./typer";

export type FradragsType = "ligningsmaessigt" | "personlig-indkomst" | "virksomhed";

export type Fradragsloft = {
  id: string;
  navn: string;
  /** Hvor det oplyses — rubrik eller regnskabspost. */
  hvor: string;
  /** Loft i ØRE pr. år. null = intet loft. */
  loftOere: number | null;
  /** Gælder loftet pr. år eller pr. anskaffelse? */
  loftType: "pr-aar" | "pr-ting" | "intet";
  /**
   * Bundfradrag i øre: du får kun fradrag for det, der ligger UD OVER dette.
   * Bruges af rubrik 58, hvor de første 7.600 kr. ikke tæller.
   */
  bundfradragOere?: number;
  type: FradragsType;
  /** Hvor mange øre mindre i skat pr. fradragskrone. */
  vaerdiPrKrone: number;
  /** Kan momsen også trækkes fra? */
  momsFradrag: boolean;
  /** Hvilke kategori-id'er i regnskabet der tæller med i forbruget. */
  kategorier?: string[];
  /** Kort forklaring til måleren. */
  kort: string;
  /** Den lange forklaring bag "?" — hvor, hvornår, og hvad fælden er. */
  forklaring: string;
  hjemmel: string;
};

/**
 * Lofterne for 2026. Ved årsskifte lægges et nyt sæt ind — grænserne
 * reguleres hvert år efter personskattelovens § 20.
 */
export const FRADRAGSLOFTER_2026: Fradragsloft[] = [
  {
    id: "smaaanskaffelser",
    navn: "Straksafskrivning af udstyr",
    hvor: "Virksomhedens regnskab · rubrik 356 (felt 690)",
    loftOere: 3_600_000,
    loftType: "pr-ting",
    type: "virksomhed",
    vaerdiPrKrone: 0.425,
    momsFradrag: true,
    kategorier: ["udstyr", "hardware", "inventar"],
    kort: "Alt udstyr under 36.000 kr. pr. ting trækkes fuldt fra i købsåret.",
    forklaring:
      "Store driftsmidler skal normalt afskrives med højst 25 % om året. Men koster en ting under 36.000 kr. uden moms, må hele beløbet trækkes fra allerede i købsåret. " +
      "Grænsen gælder PR. TING, ikke pr. år — fire ting til 30.000 kr. hver kan alle straksafskrives. " +
      "FÆLDEN: køber du dem som ét samlet sæt, kan Skattestyrelsen lægge priserne sammen og behandle det som ét driftsmiddel. Køb hver ting for sig, gerne på hver sin faktura. " +
      "En anden fælde er blandet brug: bruges tingen også privat, falder grænsen til 16.900 kr., og momsfradraget skæres ned efter et skøn. Hold arbejdsudstyret rent erhvervsmæssigt.",
    hjemmel: "Afskrivningsloven § 6, stk. 1, nr. 2",
  },
  {
    id: "driftsudgifter",
    navn: "Erhvervsudgifter i virksomheden",
    hvor: "Virksomhedens regnskab · rubrik 111 (felt 221)",
    loftOere: null,
    loftType: "intet",
    type: "virksomhed",
    vaerdiPrKrone: 0.425,
    momsFradrag: true,
    kort: "Hosting, abonnementer, domæner, værktøjer. Ingen øvre grænse.",
    forklaring:
      "Alt, der er afholdt for at erhverve, sikre og vedligeholde indkomsten, kan trækkes fra. Der er ingen grænse — jo flere reelle erhvervsudgifter, jo mindre overskud at betale skat af. " +
      "Husk de udgifter, der er lette at glemme: erhvervsforsikring, faglitteratur, kurser, kontorartikler, revisor og gebyrer. " +
      "Uden bilag er der intet fradrag, hverken skattemæssigt eller momsmæssigt. Fotografér kvitteringen samme dag — termopapir falmer på et halvt år.",
    hjemmel: "Statsskatteloven § 6, stk. 1, litra a",
  },
  {
    id: "fagforening",
    navn: "Fagforening",
    hvor: "Årsopgørelsen · rubrik 50 (felt 458)",
    loftOere: 700_000,
    loftType: "pr-aar",
    type: "ligningsmaessigt",
    vaerdiPrKrone: 0.26,
    momsFradrag: false,
    kategorier: ["fagforening"],
    kort: "Op til 7.000 kr. om året — men kun hvis fagforeningen kender dit CPR.",
    forklaring:
      "Kontingent til en fagforening kan trækkes fra med op til 7.000 kr. om året. Feltet er LÅST på årsopgørelsen, fordi fagforeningen indberetter beløbet direkte. " +
      "FÆLDEN: har fagforeningen ikke dit CPR-nummer, indberetter de ingenting — og så står der 0, selv om du har betalt hele året. Du kan ikke selv rette i et låst felt. " +
      "Tjek rubrik 50 på din årsopgørelse. Er den tom, så ring til fagforeningen og bed dem indberette; det kan gøres bagudrettet.",
    hjemmel: "Ligningsloven § 13",
  },
  {
    id: "akasse",
    navn: "A-kasse",
    hvor: "Årsopgørelsen · rubrik 52 (felt 439)",
    loftOere: null,
    loftType: "intet",
    type: "ligningsmaessigt",
    vaerdiPrKrone: 0.26,
    momsFradrag: false,
    kategorier: ["akasse"],
    kort: "Hele kontingentet kan trækkes fra — der er intet loft.",
    forklaring:
      "Modsat fagforeningskontingentet er der ingen øvre grænse for a-kassebidraget. Hele beløbet kan trækkes fra. " +
      "Feltet er låst, fordi a-kassen indberetter selv — samme fælde som med fagforeningen: står der 0, mangler indberetningen.",
    hjemmel: "Pensionsbeskatningsloven § 49",
  },
  {
    id: "ratepension",
    navn: "Ratepension",
    hvor: "Årsopgørelsen · rubrik 21",
    loftOere: 6_870_000,
    loftType: "pr-aar",
    type: "personlig-indkomst",
    vaerdiPrKrone: 0.425,
    momsFradrag: false,
    kategorier: ["pension"],
    kort: "Op til 68.700 kr. om året, fradrages fuldt ud i den personlige indkomst.",
    forklaring:
      "Indbetaler du selv til en ratepension, kan beløbet trækkes fra med op til 68.700 kr. i 2026. Det er det stærkeste fradrag, der findes: du sparer skatten nu, og pengene er stadig dine — de står bare bundet. " +
      "Indbetalingen skal ske senest 31. december for at tælle i året. " +
      "Til gengæld er pengene låst indtil pensionsalderen. Det er ikke en løsning, hvis de skal bruges til udstyr eller til at betale restskat. " +
      "En arbejdsgiverordning tæller ikke med her — den er allerede trukket fra din løn, før du ser den.",
    hjemmel: "Pensionsbeskatningsloven § 16, stk. 2",
  },
  {
    id: "befordring",
    navn: "Kørselsfradrag",
    hvor: "Årsopgørelsen · rubrik 51 (felt 417)",
    loftOere: null,
    loftType: "intet",
    type: "ligningsmaessigt",
    vaerdiPrKrone: 0.26,
    momsFradrag: false,
    kort: "3,17 kr. pr. km ud over de første 24 km om dagen, tur-retur.",
    forklaring:
      "Det mest oversete fradrag i Danmark. Skattestyrelsen ved ikke, hvor du kører hen, så feltet står TOMT, indtil du selv skriver i det — hvert eneste år. " +
      "Regnestykket: afstanden hjem-arbejde ganget med to, minus 24 km. Resten giver 3,17 kr. pr. km op til 120 km og 1,59 kr. derover. " +
      "Skiftende arbejdssteder tæller også — du regner på den plads, du faktisk kørte til den dag. Og skoleophold på en erhvervsuddannelse tæller, fordi skolen betragtes som arbejdsplads. " +
      "FÆLDEN: får du kørepenge fra arbejdsgiveren eller fra AUB, må du ikke også tage fradrag for de samme kilometer.",
    hjemmel: "Ligningsloven § 9 C",
  },
  {
    id: "rejse",
    navn: "Rejsefradrag (kost og logi)",
    hvor: "Årsopgørelsen · rubrik 53 (felt 429)",
    loftOere: 3_440_000,
    loftType: "pr-aar",
    type: "ligningsmaessigt",
    vaerdiPrKrone: 0.26,
    momsFradrag: false,
    kort: "625 kr. pr. døgn til kost, 268 kr. til logi. Loft 34.400 kr.",
    forklaring:
      "Arbejder du så langt hjemmefra, at du ikke kan nå hjem og sove, kan du trække udgifter til mad og overnatning fra. Rejsen skal vare mindst 24 timer. " +
      "Der findes INGEN 12-timers-regel i skatteretten — det er en misforståelse hentet fra tjenesterejseaftaler. " +
      "FÆLDEN: betaler arbejdsgiveren maden, eller får du skattefri diæter, kan du ikke også tage fradraget.",
    hjemmel: "Ligningsloven § 9 A",
  },
  {
    id: "service",
    navn: "Servicefradrag",
    hvor: "Årsopgørelsen · rubrik 461",
    loftOere: 1_830_000,
    loftType: "pr-aar",
    type: "ligningsmaessigt",
    vaerdiPrKrone: 0.26,
    momsFradrag: false,
    kategorier: ["service"],
    kort: "Rengøring, vinduespudsning, havearbejde, børnepasning. Loft 18.300 kr.",
    forklaring:
      "Betaler du nogen for at gøre rent, pudse vinduer, passe haven eller passe børn, kan ARBEJDSLØNNEN trækkes fra — ikke materialer, ikke transport. " +
      "Tre krav, der alle skal være opfyldt: arbejdet udført i din egen bolig, betalt ELEKTRONISK (aldrig kontant), og en regning med firmaets CVR-nummer. " +
      "Fradraget hører til det år, du BETALER — ikke det år, arbejdet blev udført. Betaler du 2. januar, tæller det i det nye år.",
    hjemmel: "Ligningsloven § 8 V",
  },
  {
    id: "haandvaerker",
    navn: "Håndværkerfradrag (grønt)",
    hvor: "Årsopgørelsen · rubrik 460",
    loftOere: 900_000,
    loftType: "pr-aar",
    type: "ligningsmaessigt",
    vaerdiPrKrone: 0.26,
    momsFradrag: false,
    kategorier: ["haandvaerker"],
    kort: "Kun grøn istandsættelse: isolering, varmepumpe, solceller, energiruder.",
    forklaring:
      "Ordningen blev afskaffet i 2022 og genindført 1. januar 2025 — men i en SMALLERE udgave. Nu dækker den kun grøn istandsættelse. " +
      "Det tæller: isolering, varmepumpe, solceller, energiruder, afmontering af oliefyr. Det tæller IKKE længere: nyt badeværelse, køkken, maler- og gulvarbejde. " +
      "Samme tre krav som servicefradraget: eget hjem, elektronisk betaling, regning med CVR. Kun arbejdslønnen, ikke materialerne.",
    hjemmel: "Ligningsloven § 8 V",
  },
  {
    id: "gaver",
    navn: "Gaver til godkendte foreninger",
    hvor: "Årsopgørelsen · rubrik 55 (felt 412)",
    loftOere: 2_000_000,
    loftType: "pr-aar",
    type: "ligningsmaessigt",
    vaerdiPrKrone: 0.26,
    momsFradrag: false,
    kategorier: ["donation", "gave"],
    kort: "Op til 20.000 kr. — men foreningen skal indberette med dit CPR.",
    forklaring:
      "Gaver til foreninger godkendt af Skattestyrelsen kan trækkes fra med op til 20.000 kr. i 2026. " +
      "FÆLDEN: foreningen skal indberette gaven med dit CPR-nummer. Donerer du bare med kort eller MobilePay uden at oplyse CPR, står der ingenting i rubrikken — og så er der intet fradrag. " +
      "Tjek rubrik 55 på årsopgørelsen. Er den tom, kan du kontakte foreningen og bede dem indberette bagudrettet.",
    hjemmel: "Ligningsloven § 8 A",
  },
  {
    id: "oevrige",
    navn: "Øvrige lønmodtagerudgifter",
    hvor: "Årsopgørelsen · rubrik 58",
    loftOere: null,
    loftType: "intet",
    bundfradragOere: 760_000,
    type: "ligningsmaessigt",
    vaerdiPrKrone: 0.26,
    momsFradrag: false,
    kort: "Virker omvendt: kun det, der ligger ud over 7.600 kr., giver fradrag.",
    forklaring:
      "Her er en spærre frem for et loft. Du får kun fradrag for det, der OVERSTIGER 7.600 kr. i 2026. Har du haft udgifter for 9.000 kr., får du fradrag for 1.400 kr. — har du haft for 5.000 kr., får du ingenting. " +
      "I praksis kommer de færreste over grænsen, og rubrikken står derfor oftest tom. " +
      "VIGTIGT: arbejdstøj og sikkerhedsudstyr skal ARBEJDSGIVEREN betale efter arbejdsmiljøreglerne. Har du lagt ud, så bed om pengene retur i stedet — det er hele beløbet frem for en fjerdedel af et fradrag. " +
      "Udgifter til din egen virksomhed hører ikke til her; de går i virksomhedens regnskab, hvor der ingen bundgrænse er.",
    hjemmel: "Ligningsloven § 9, stk. 1",
  },
];

export type FradragsMaaler = {
  loft: Fradragsloft;
  /** Hvad der er registreret brugt i året, i øre. null = programmet ved det ikke. */
  brugtOere: number | null;
  /** Hvad der er tilbage af loftet, i øre. null hvis der ikke er et loft. */
  tilbageOere: number | null;
  /** Andel af loftet der er brugt, 0-100. */
  pct: number;
  /** Hvad det ubrugte er værd i sparet skat, i øre. */
  potentialeOere: number;
};

/**
 * Regn ud, hvor meget af hvert fradrag der er brugt i året.
 *
 * Forbruget udledes af posteringernes kategori. Findes der ingen kategorier
 * for et fradrag, kan programmet ikke vide, om det er brugt — så sættes
 * `brugtOere` til null, og måleren siger det ærligt frem for at vise et nul,
 * der ligner "ubrugt".
 */
export function beregnFradragsMaalere(
  transaktioner: Transaktion[],
  aar: number,
  lofter: Fradragsloft[] = FRADRAGSLOFTER_2026,
): FradragsMaaler[] {
  const iAaret = transaktioner.filter((t) => t.dato.startsWith(String(aar)));

  return lofter.map((loft) => {
    let brugtOere: number | null = null;
    if (loft.kategorier?.length) {
      brugtOere = iAaret
        .filter((t) => t.kategori && loft.kategorier!.includes(t.kategori))
        .reduce((sum, t) => sum + Math.abs(t.beloebOere), 0);
    } else if (loft.loftType === "pr-ting" || loft.loftType === "intet") {
      // Uden kategorier og uden årsloft giver et forbrugstal ingen mening.
      brugtOere = null;
    }

    const tilbageOere =
      loft.loftOere === null || brugtOere === null
        ? null
        : Math.max(0, loft.loftOere - brugtOere);

    const pct =
      loft.loftOere === null || brugtOere === null
        ? 0
        : Math.min(100, Math.round((brugtOere / loft.loftOere) * 100));

    const potentialeOere =
      tilbageOere === null ? 0 : Math.round(tilbageOere * loft.vaerdiPrKrone);

    return { loft, brugtOere, tilbageOere, pct, potentialeOere };
  });
}
