/**
 * Den private årsopgørelse — rubrik for rubrik.
 *
 * Formålet er ét: at du kan sidde med skat.dk åben ved siden af og vide
 * præcis, hvad der skal stå i hvert felt, og hvilke felter Skattestyrelsen
 * ALDRIG udfylder for dig. Det er der, pengene ligger.
 *
 * Tre slags rubrikker, og forskellen er afgørende:
 *
 *  - LÅST: en arbejdsgiver, bank, fagforening eller a-kasse har indberettet
 *    tallet, og du kan ikke rette i feltet. Til gengæld er det dér, fejlen
 *    typisk sidder: har fagforeningen ikke dit CPR-nummer, står der 0, uanset
 *    hvad du har betalt — og du kan ikke selv skrive det ind.
 *  - DU SKAL SELV: feltet står tomt, indtil du udfylder det. Skattestyrelsen
 *    ved ikke, hvor du kører hen eller hvem der har gjort rent hos dig.
 *    Det er her, de fleste taber penge.
 *  - BEREGNET: udledes af de øvrige felter.
 *
 * Rubriknumre og feltnavne er læst ordret af Skattestyrelsens blanket 04.003
 * (oplysningsskemaet) og 04.076, hentet august 2026. Hvor et nummer ikke
 * kunne verificeres, står feltet uden nummer frem for med et gættet.
 */

export type Udfylder = "laast" | "selv" | "beregnet";

export type AarsRubrik = {
  /** Rubriknummer som det står på årsopgørelsen. */
  nr: string;
  /** Feltnummer på blanketten, hvor det er verificeret. */
  felt?: string;
  navn: string;
  udfylder: Udfylder;
  /** Hvem indberetter, når feltet er låst. */
  indberetter?: string;
  /** Loft eller bundgrænse i kroner for året. */
  loftKr?: number;
  bundfradragKr?: number;
  /** Én linje: hvad feltet dækker. */
  kort: string;
  /** Den fulde forklaring bag "?": hvor, hvornår, og hvad fælden er. */
  forklaring: string;
  hjemmel: string;
  /** Er det et af de felter, folk oftest taber penge på? */
  overset?: boolean;
};

export const AARSRUBRIKKER_2026: AarsRubrik[] = [
  {
    nr: "11",
    navn: "Lønindkomst, bestyrelseshonorar m.v.",
    udfylder: "laast",
    indberetter: "Din arbejdsgiver",
    kort: "Din løn. Arbejdsgiveren har indberettet den til eIndkomst.",
    forklaring:
      "Feltet er låst, fordi arbejdsgiveren indberetter hver måned. Tjek alligevel, at beløbet passer med summen af dine lønsedler — er der en måned, der mangler, er det arbejdsgiveren, der skal rette det, ikke dig. " +
      "Har du skiftet job eller haft flere arbejdsgivere, skal alle være med.",
    hjemmel: "Skatteindberetningsloven",
  },
  {
    nr: "16",
    navn: "Pensioner, dagpenge, stipendier m.v.",
    udfylder: "laast",
    indberetter: "Udbetaleren",
    kort: "SU, dagpenge, kontanthjælp, sygedagpenge og pensionsudbetalinger.",
    forklaring:
      "Alt hvad du har fået udbetalt fra det offentlige eller fra en pensionsordning. Feltet er låst — udbetaleren indberetter. " +
      "Tjek at perioderne stemmer, især hvis du er gået fra en ydelse til løn midt i året.",
    hjemmel: "Skatteindberetningsloven",
  },
  {
    nr: "111",
    felt: "221",
    navn: "Overskud af virksomhed/udlejningsejendom",
    udfylder: "selv",
    kort: "Virksomhedens overskud før renter og før AM-bidrag.",
    overset: true,
    forklaring:
      "Her skriver du virksomhedens resultat: omsætning minus erhvervsudgifter. Ikke fratrukket AM-bidrag, og ikke fratrukket renter — dem har rubrik 114 og 117. " +
      "PERIODISERINGEN ER DET, DER GÅR GALT: en indtægt hører til den dag, den er ERHVERVET, ikke den dag pengene lander. Fakturerer du i december og får betalingen hen over foråret, hører hele beløbet til december. " +
      "Er du momsregistreret, skal du bruge OPLYSNINGSSKEMAET og ikke den almindelige årsopgørelse — det er en anden blanket med flere felter, som åbnes samme sted i TastSelv. " +
      "Fristen er 1. juli året efter. Overskrides den, løber der et skattetillæg på 400 kr. pr. dag op til 10.000 kr.",
    hjemmel: "Statsskatteloven § 4 · blanket 04.003",
  },
  {
    nr: "112",
    felt: "435",
    navn: "Underskud i virksomhed/udlejningsejendom",
    udfylder: "selv",
    kort: "Bruges kun, hvis virksomheden gav underskud.",
    forklaring:
      "Giver virksomheden underskud, skrives det her — ikke som et negativt tal i rubrik 111. " +
      "Underskuddet modregnes i din anden indkomst samme år, så det sænker skatten af din løn. Er der mere tilbage, kan det føres videre til senere år uden tidsbegrænsning. " +
      "Bemærk: AM-bidraget af din løn kan ikke nedsættes med et virksomhedsunderskud.",
    hjemmel: "Personskatteloven § 13 · blanket 04.003",
  },
  {
    nr: "39",
    navn: "Anden kapitalindkomst",
    udfylder: "selv",
    kort: "Blandt andet kursgevinst på penge, du har stående i fremmed valuta.",
    overset: true,
    forklaring:
      "Fakturerer du i pund eller dollar, bogføres beløbet til kursen den dag, du fakturerer. Når pengene senere kommer ind og veksles til en anden kurs, er forskellen en kursgevinst eller et kurstab. " +
      "Er den samlede NETTOgevinst på dine fordringer i fremmed valuta over 2.000 kr., er hele beløbet skattepligtigt og skal stå her. Under grænsen skal det slet ikke oplyses — det er en tærskel, ikke et bundfradrag. " +
      "Gevinsten hører til det år, hvor du faktisk vekslede — ikke det år, du fakturerede. " +
      "Bemærk asymmetrien: et nettoTAB på erhvervsmæssige tilgodehavender er en driftsomkostning i den personlige indkomst, mens en nettoGEVINST er kapitalindkomst her. De to skal holdes adskilt.",
    hjemmel: "Kursgevinstloven §§ 14 og 17",
  },
  {
    nr: "51",
    felt: "417",
    navn: "Befordringsfradrag (kørselsfradrag)",
    udfylder: "selv",
    kort: "3,17 kr. pr. km ud over de første 24 km om dagen, tur-retur.",
    overset: true,
    forklaring:
      "DET MEST OVERSETE FRADRAG I DANMARK. Skattestyrelsen ved ikke, hvor du kører hen, så feltet står TOMT, indtil du selv skriver i det — hvert eneste år. Det overføres heller ikke fra forskudsopgørelsen. " +
      "Regnestykket: afstanden hjem til arbejde ganget med to, minus 24 km. Resten giver 3,17 kr. pr. km op til 120 km og 1,59 kr. derover (2026-satser). " +
      "Skiftende arbejdssteder tæller også — du regner på den plads, du faktisk kørte til den dag. Og SKOLEOPHOLD PÅ EN ERHVERVSUDDANNELSE tæller: Skattestyrelsen har i et styresignal fastslået, at skolen er en arbejdsplads for elever med uddannelsesaftale. " +
      "FÆLDEN: får du kørepenge fra arbejdsgiveren eller fra AUB, må du ikke også tage fradrag for de samme kilometer.",
    hjemmel: "Ligningsloven § 9 C · blanket 04.003",
  },
  {
    nr: "53",
    felt: "429",
    navn: "Rejseudgifter (fradrag for kost og logi på rejser)",
    udfylder: "selv",
    loftKr: 34400,
    kort: "625 kr. pr. døgn til kost, 268 kr. til logi. Loft 34.400 kr.",
    forklaring:
      "Arbejder du så langt hjemmefra, at du ikke kan nå hjem og sove, kan du trække udgifter til mad og overnatning fra. Rejsen skal vare mindst 24 timer, og derefter regnes 1/24 pr. påbegyndt time. " +
      "DER FINDES INGEN 12-TIMERS-REGEL i skatteretten — det er en udbredt misforståelse hentet fra tjenesterejseaftaler. " +
      "Ved mobile arbejdssteder, der flytter sig mindst 8 km, gælder 12-månedersbegrænsningen på kost ikke — relevant i bygge- og anlægsbranchen. " +
      "FÆLDEN: betaler arbejdsgiveren maden, eller får du skattefri diæter, kan du ikke også tage fradraget.",
    hjemmel: "Ligningsloven § 9 A · blanket 04.003",
  },
  {
    nr: "50",
    felt: "458",
    navn: "Fagligt kontingent — højst 7.000 kr.",
    udfylder: "laast",
    indberetter: "Din fagforening",
    loftKr: 7000,
    kort: "Kontingent til fagforening. Loftet er 7.000 kr. om året.",
    overset: true,
    forklaring:
      "Feltet er låst, fordi fagforeningen indberetter direkte. Og det er præcis derfor, det går galt: HAR FAGFORENINGEN IKKE DIT CPR-NUMMER, INDBERETTER DE INGENTING — og så står der 0, selv om du har betalt hele året. Du kan ikke selv rette i et låst felt. " +
      "Tjek rubrik 50 på din årsopgørelse. Er den tom, og betaler du kontingent, så ring til fagforeningen og bed dem indberette. Det kan gøres bagudrettet, også for tidligere år. " +
      "Fradraget er værd omkring 26 øre pr. krone — 7.000 kr. i kontingent giver cirka 1.820 kr. mindre i skat.",
    hjemmel: "Ligningsloven § 13",
  },
  {
    nr: "52",
    felt: "439",
    navn: "A-kasse, efterlønsordning og fleksydelse",
    udfylder: "laast",
    indberetter: "Din a-kasse",
    kort: "Bidrag til a-kasse. Der er INTET loft — hele beløbet tæller.",
    overset: true,
    forklaring:
      "Modsat fagforeningskontingentet er der ingen øvre grænse: hele dit a-kassebidrag kan trækkes fra. " +
      "Feltet er låst — a-kassen indberetter selv. Samme fælde som med fagforeningen: står der 0, og betaler du alligevel, mangler indberetningen, og du skal kontakte a-kassen. " +
      "Er du lærling eller elev, er kontingentet ofte nedsat eller gratis de første år.",
    hjemmel: "Pensionsbeskatningsloven § 49",
  },
  {
    nr: "55",
    felt: "412",
    navn: "Gaver til godkendte foreninger mv.",
    udfylder: "laast",
    indberetter: "Foreningen",
    loftKr: 20000,
    kort: "Donationer til foreninger godkendt af Skattestyrelsen. Loft 20.000 kr.",
    overset: true,
    forklaring:
      "FÆLDEN ER DEN SAMME SOM VED FAGFORENING: foreningen skal indberette gaven med dit CPR-nummer. Donerer du bare med kort eller MobilePay uden at oplyse CPR, står der ingenting i rubrikken — og så er der intet fradrag, uanset hvor meget du har givet. " +
      "Tjek rubrik 55. Er den tom, selv om du har doneret, så kontakt foreningen og bed dem indberette bagudrettet. " +
      "Foreningen skal være godkendt efter ligningslovens § 8 A; listen ligger på skat.dk.",
    hjemmel: "Ligningsloven § 8 A",
  },
  {
    nr: "461",
    navn: "Servicefradrag",
    udfylder: "selv",
    loftKr: 18300,
    kort: "Rengøring, vinduespudsning, havearbejde og børnepasning. Loft 18.300 kr.",
    overset: true,
    forklaring:
      "Betaler du nogen for at gøre rent, pudse vinduer, passe haven eller passe børn, kan ARBEJDSLØNNEN trækkes fra — ikke materialer og ikke transport. " +
      "Tre krav, der alle skal være opfyldt: arbejdet udført i din egen bolig, betalt ELEKTRONISK (aldrig kontant), og en regning med firmaets CVR-nummer. " +
      "Fradraget hører til det år, du BETALER — ikke det år, arbejdet blev udført. Betaler du 2. januar, tæller det i det nye år. " +
      "Skattestyrelsen ved ikke, at du har fået gjort rent, så feltet står tomt, indtil du selv skriver i det.",
    hjemmel: "Ligningsloven § 8 V",
  },
  {
    nr: "460",
    navn: "Håndværkerfradrag",
    udfylder: "selv",
    loftKr: 9000,
    kort: "Kun GRØN istandsættelse: isolering, varmepumpe, solceller, energiruder.",
    forklaring:
      "Ordningen blev afskaffet i 2022 og genindført 1. januar 2025 — men i en SMALLERE udgave. Nu dækker den kun grøn istandsættelse. " +
      "DET TÆLLER: isolering, varmepumpe, solceller, energiruder, afmontering af oliefyr. " +
      "DET TÆLLER IKKE LÆNGERE: nyt badeværelse, køkken, maler- og gulvarbejde. Mange husker den gamle, brede ordning og tror stadig, alt håndværk giver fradrag. " +
      "Samme tre krav som servicefradraget: eget hjem, elektronisk betaling, regning med CVR. Kun arbejdslønnen, aldrig materialerne.",
    hjemmel: "Ligningsloven § 8 V",
  },
  {
    nr: "58",
    navn: "Øvrige lønmodtagerudgifter",
    udfylder: "selv",
    bundfradragKr: 7600,
    kort: "Virker omvendt: kun det, der ligger UD OVER 7.600 kr., giver fradrag.",
    forklaring:
      "Her er en spærre frem for et loft. Du får kun fradrag for det, der OVERSTIGER 7.600 kr. i 2026. Har du haft udgifter for 9.000 kr., får du fradrag for 1.400 kr. Har du haft for 5.000 kr., får du ingenting. " +
      "I praksis kommer de færreste over grænsen, og rubrikken står derfor oftest tom. " +
      "VIGTIGT: arbejdstøj og sikkerhedsudstyr skal ARBEJDSGIVEREN betale efter arbejdsmiljøreglerne. Har du lagt ud, så bed om pengene retur hos dem — det er hele beløbet frem for en fjerdedel af et fradrag. " +
      "Udgifter til din egen virksomhed hører ikke til her; de går i virksomhedens regnskab, hvor der ingen bundgrænse er.",
    hjemmel: "Ligningsloven § 9, stk. 1",
  },
  {
    nr: "20",
    navn: "Anden personlig indkomst",
    udfylder: "selv",
    kort: "Blandt andet gevinst på kryptovaluta og indtægt fra hobbyvirksomhed.",
    forklaring:
      "Gevinst ved salg af kryptovaluta hører her, hvis købet var spekulation — hvilket det næsten altid anses for at være. " +
      "PAS PÅ ASYMMETRIEN: gevinst skal i rubrik 20, men TAB skal i rubrik 58, og de må IKKE modregnes i hinanden. Har du både gevinst og tab, beskattes gevinsten fuldt ud, mens tabet kun tæller i det omfang, det sammen med andre udgifter overstiger bundfradraget på 7.600 kr. Det er hårdt, men sådan er reglen. " +
      "Indtægt fra en virksomhed, der ikke anses for erhvervsmæssig (hobby), står også her — opgjort efter nettoindkomstprincippet, uden mulighed for at fremføre underskud.",
    hjemmel: "Statsskatteloven §§ 4 og 5",
  },
  {
    nr: "31",
    navn: "Renteudgifter i pengeinstitutter mv.",
    udfylder: "laast",
    indberetter: "Din bank",
    kort: "Renter på lån, kassekredit og studiegæld.",
    forklaring:
      "Banken indberetter selv. Tjek at alle dine lån er med — især hvis du har skiftet bank i løbet af året, eller har lån hos et andet institut end din hovedbank. " +
      "Studiegæld hos Udbetaling Danmark indberettes særskilt; kontrollér at renterne derfra også står der.",
    hjemmel: "Skatteindberetningsloven",
  },
];

/** De rubrikker, hvor pengene typisk tabes. */
export const OVERSETE = AARSRUBRIKKER_2026.filter((r) => r.overset);

/** Rubrikker du selv skal udfylde — de står tomme, til du gør det. */
export const SKAL_SELV = AARSRUBRIKKER_2026.filter((r) => r.udfylder === "selv");

/** Klikvejen til at rette et tidligere år. */
export const RET_TRIN = [
  {
    titel: "Log på TastSelv Borger",
    tekst: "skat.dk → Log på → TastSelv Borger → MitID.",
  },
  {
    titel: "Vælg året",
    tekst:
      "Årsopgørelsen → vælg indkomståret i menuen. Er du momsregistreret, hedder den Oplysningsskemaet og har flere felter.",
  },
  {
    titel: "Tryk Ret årsopgørelsen",
    tekst:
      "Felterne åbner. Låste felter kan ikke ændres — der skal du i stedet kontakte den, der har indberettet.",
  },
  {
    titel: "Skriv tallene ind og godkend",
    tekst:
      "Der dannes en ny årsopgørelse med det samme. Skylder du penge, får du en betalingslinje; har du penge til gode, kommer de på din NemKonto.",
  },
];

/**
 * Hvor længe kan et år rettes?
 *
 * Ordinær genoptagelse løber til 1. maj i det FJERDE år efter indkomstårets
 * udløb (skatteforvaltningslovens § 26). Et glemt fradrag fra 2023 kan altså
 * stadig hentes hjem i 2027.
 */
export function rettefristFor(indkomstaar: number): string {
  return `${indkomstaar + 4}-05-01`;
}

export function kanRettes(indkomstaar: number, idag: string): boolean {
  return idag <= rettefristFor(indkomstaar);
}
