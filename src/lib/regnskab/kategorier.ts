/**
 * Kategorikatalog for begge bøger — privat og firma.
 *
 * Hver firma-kategori bærer sine moms- og fradrags-DEFAULTS, så en postering
 * arver korrekt behandling i samme øjeblik den kategoriseres (og du kan
 * overstyre pr. postering, når Odin spørger). odinNote er Odins korte
 * forklaring af reglen bag kategorien — den vises i spørge-flowet.
 *
 * Satser og procenter her er DEFAULTS for typiske tilfælde; viden-basen
 * (src/lib/regnskab/viden) rummer de fulde, kildebelagte regler.
 */
import type { Konto, MomsType } from "./typer";

export type Kategori = {
  id: string;
  navn: string;
  emoji: string;
  konto: Konto | "begge";
  retning: "udgift" | "indtaegt" | "begge";
  /** Firma: momsmæssig standard-behandling. */
  momsType?: MomsType;
  /** Firma: andel af momsen der kan fradrages (0-100). */
  momsFradragPct?: number;
  /** Firma: skattemæssig fradragsandel (0-100). */
  fradragPct?: number;
  /** Privat: kategorien kan påvirke din årsopgørelse. */
  skatteRelevant?: boolean;
  /** Odins forklaring — regler, faldgruber, hvad du skal huske. */
  odinNote?: string;
};

// ═══════════════════════════════════════════════════════════════
// FIRMA-BOGEN (Camsilo)
// ═══════════════════════════════════════════════════════════════

export const FIRMA_KATEGORIER: Kategori[] = [
  // ── Indtægter ─────────────────────────────────────────────────
  {
    id: "salg",
    navn: "Salg / omsætning",
    emoji: "💰",
    konto: "firma",
    retning: "indtaegt",
    momsType: "salgsmoms",
    odinNote:
      "Dansk salg med 25 % moms. Af et indbetalt bruttobeløb er 20 % salgsmoms (25 % oven på nettoprisen). Husk: du opkræver momsen på Skats vegne — den er aldrig dine penge.",
  },
  {
    id: "salg-eu",
    navn: "Salg til EU-virksomhed (ydelser)",
    emoji: "🇪🇺",
    konto: "firma",
    retning: "indtaegt",
    momsType: "momsfri",
    odinNote:
      "Salg af ydelser til virksomheder i andre EU-lande er uden dansk moms (omvendt betalingspligt hos køberen) — men SKAL angives i rubrik B-ydelser OG indberettes i »EU-salg uden moms« (EU-salgslisten). Kundens momsnummer skal stå på fakturaen. Spørg viden-basen før du fakturerer EU første gang.",
  },
  {
    id: "salg-tredjeland",
    navn: "Salg uden for EU",
    emoji: "🌍",
    konto: "firma",
    retning: "indtaegt",
    momsType: "momsfri",
    odinNote:
      "Salg af ydelser til kunder uden for EU er uden dansk moms og skal hverken i rubrik B eller EU-salgslisten. Husk dokumentation for, at kunden er etableret uden for EU.",
  },
  {
    id: "ejerindskud",
    navn: "Ejerindskud (dine egne penge ind)",
    emoji: "🔁",
    konto: "firma",
    retning: "indtaegt",
    momsType: "udenfor",
    fradragPct: 0,
    odinNote:
      "Dine egne penge sat ind i virksomheden. Hverken omsætning, moms eller skat — men bogfør det, så kontoen stemmer.",
  },
  {
    id: "momsrefusion",
    navn: "Momsrefusion fra Skat",
    emoji: "↩️",
    konto: "firma",
    retning: "indtaegt",
    momsType: "udenfor",
    fradragPct: 0,
    odinNote:
      "Negativt momstilsvar udbetalt fra Skattekontoen. Ikke en indtægt — bare din egen købsmoms retur.",
  },

  // ── Driftsudgifter ────────────────────────────────────────────
  {
    id: "software",
    navn: "Software & SaaS-abonnementer",
    emoji: "🧩",
    konto: "firma",
    retning: "udgift",
    momsType: "omvendt",
    momsFradragPct: 100,
    fradragPct: 100,
    odinNote:
      "Adobe, GitHub, OpenAI, Figma m.fl. fakturerer typisk fra udlandet UDEN dansk moms → omvendt betalingspligt: du beregner selv 25 % moms, angiver den som skyldig OG trækker den fra igen (neutralt ved fuld erhvervsbrug). Køber du hos en DANSK leverandør med moms på fakturaen, så skift til 'dansk køb med moms'.",
  },
  {
    id: "hosting",
    navn: "Hosting, domæner & cloud",
    emoji: "🌐",
    konto: "firma",
    retning: "udgift",
    momsType: "omvendt",
    momsFradragPct: 100,
    fradragPct: 100,
    odinNote:
      "Hosting og domæner er fuldt fradragsberettiget drift. Udenlandske udbydere (Cloudflare, Vercel, AWS …) = omvendt betalingspligt; danske udbydere (fx one.com, Punktum dk via dansk forhandler) = almindelig købsmoms.",
  },
  {
    id: "udstyr",
    navn: "Computer, hardware & udstyr",
    emoji: "💻",
    konto: "firma",
    retning: "udgift",
    momsType: "koebsmoms",
    momsFradragPct: 100,
    fradragPct: 100,
    odinNote:
      "Udstyr under småanskaffelsesgrænsen (36.000 kr. ekskl. moms i 2026 ved ren erhvervsbrug — kun 16.900 kr. ved blandet privat/erhverv) kan straksafskrives; dyrere aktiver saldoafskrives op til 25 % om året. Software kan ALTID straksafskrives uanset beløb. Delvist privat brug nedsætter både fradrag og moms til erhvervsandelen — sig det, når jeg spørger.",
  },
  {
    id: "kontor",
    navn: "Kontorartikler & inventar",
    emoji: "🗂️",
    konto: "firma",
    retning: "udgift",
    momsType: "koebsmoms",
    momsFradragPct: 100,
    fradragPct: 100,
    odinNote: "Almindelig fradragsberettiget drift med fuld købsmoms.",
  },
  {
    id: "markedsfoering",
    navn: "Markedsføring & annoncer",
    emoji: "📣",
    konto: "firma",
    retning: "udgift",
    momsType: "omvendt",
    momsFradragPct: 100,
    fradragPct: 100,
    odinNote:
      "Google Ads og Meta fakturerer fra Irland → omvendt betalingspligt. Dansk trykkeri/avis = almindelig købsmoms. Reklame er fuldt fradragsberettiget — i modsætning til repræsentation.",
  },
  {
    id: "telefon-internet",
    navn: "Telefon & internet (erhvervsandel)",
    emoji: "📱",
    konto: "firma",
    retning: "udgift",
    momsType: "koebsmoms",
    momsFradragPct: 50,
    fradragPct: 100,
    odinNote:
      "Blandet privat/erhvervs-telefon i enkeltmandsvirksomhed: du beskattes i stedet af „fri telefon” (3.500 kr./år i 2026), og momsen kan kun fradrages med et skøn over erhvervsandelen (her sat til 50 % — justér efter dit reelle skøn). Reglerne er lumske — læs viden-basens afsnit før årsafslutning.",
  },
  {
    id: "transport-offentlig",
    navn: "Tog, bus & fly (erhverv)",
    emoji: "🚆",
    konto: "firma",
    retning: "udgift",
    momsType: "momsfri",
    fradragPct: 100,
    odinNote:
      "Billetter til kundemøder, kurser og erhvervsrejser fradrages med de faktiske udgifter (persontransport er typisk momsfri). Gem billetten og notér formålet.",
  },
  {
    id: "koersel",
    navn: "Kørsel i egen bil (benzin, parkering)",
    emoji: "🚗",
    konto: "firma",
    retning: "udgift",
    momsType: "momsfri",
    fradragPct: 0,
    odinNote:
      "PAS PÅ: udgifter til egen (hvidplade)bil fradrages IKKE efter kvitteringerne — fradraget beregnes i stedet separat med Skatterådets km-sats efter kørebog (2026: 3,94 kr./km op til 20.000 km, 2,28 kr./km derover), og der er intet momsfradrag på hvidpladebil. Derfor står posteringen her med 0 % fradrag: før i stedet kørebog (dato, km-tællerstand, antal erhvervs-km, mål, ærinde) og tag km-fradraget på oplysningsskemaet.",
  },
  {
    id: "repraesentation",
    navn: "Repræsentation (kundemøder, gaver)",
    emoji: "🍽️",
    konto: "firma",
    retning: "udgift",
    momsType: "koebsmoms",
    momsFradragPct: 25,
    fradragPct: 25,
    odinNote:
      "Mad, drikke og gaver til KUNDER og forretningsforbindelser: kun 25 % skattefradrag. Moms: restaurant giver 25 % af MOMSEN i fradrag, hotel 100 % — gaver og øvrig repræsentation giver 0 % momsfradrag. Gem kvitteringen og skriv PÅ den, hvem du var sammen med og hvorfor — ellers ryger fradraget ved kontrol.",
  },
  {
    id: "kurser",
    navn: "Kurser, konferencer & faglitteratur",
    emoji: "📚",
    konto: "firma",
    retning: "udgift",
    momsType: "koebsmoms",
    momsFradragPct: 100,
    fradragPct: 100,
    odinNote:
      "Fradrag for at VEDLIGEHOLDE og ajourføre din faglige viden — ikke for helt ny uddannelse (fx en ny grad). Udenlandske online-kurser er ofte omvendt betalingspligt.",
  },
  {
    id: "forsikring",
    navn: "Erhvervsforsikring",
    emoji: "🛡️",
    konto: "firma",
    retning: "udgift",
    momsType: "momsfri",
    fradragPct: 100,
    odinNote:
      "Erhvervs- og ansvarsforsikringer er fradragsberettigede. Forsikring er momsfri — der er ingen købsmoms at trække fra.",
  },
  {
    id: "raadgivning",
    navn: "Revisor, advokat & rådgivning",
    emoji: "⚖️",
    konto: "firma",
    retning: "udgift",
    momsType: "koebsmoms",
    momsFradragPct: 100,
    fradragPct: 100,
    odinNote:
      "Løbende regnskabs- og rådgivningsbistand er fradragsberettiget drift. Visse stiftelses-/omdannelsesomkostninger behandles særskilt — spørg viden-basen ved ApS-omdannelsen.",
  },
  {
    id: "kontingent",
    navn: "Kontingenter & medlemskaber",
    emoji: "🎫",
    konto: "firma",
    retning: "udgift",
    momsType: "momsfri",
    fradragPct: 100,
    odinNote:
      "Erhvervsmæssige kontingenter (brancheforening o.l.) er fradragsberettigede; moms afhænger af foreningen.",
  },
  {
    id: "bankgebyr",
    navn: "Bankgebyrer & renter",
    emoji: "🏦",
    konto: "firma",
    retning: "udgift",
    momsType: "momsfri",
    fradragPct: 100,
    odinNote:
      "Gebyrer på erhvervskontoen og erhvervsmæssige renteudgifter er fradragsberettigede. Finansielle ydelser er momsfrie.",
  },
  {
    id: "moms-skat-betaling",
    navn: "Betaling af moms/skat til Skattekontoen",
    emoji: "🏛️",
    konto: "firma",
    retning: "udgift",
    momsType: "udenfor",
    fradragPct: 0,
    odinNote:
      "Betaling af momstilsvar eller acontoskat er IKKE en driftsudgift — momsen var aldrig din, og skat af overskud er privat. Bogføres uden for både moms- og fradragsregnskabet.",
  },
  {
    id: "privat-haevning",
    navn: "Privat hævning (dine penge ud)",
    emoji: "🏠",
    konto: "firma",
    retning: "udgift",
    momsType: "udenfor",
    fradragPct: 0,
    odinNote:
      "I en enkeltmandsvirksomhed er virksomhedens penge dine — men hævninger til privatforbrug er hverken fradrag eller løn. De påvirker kun din bog, ikke skatten. (I et ApS er det en HELT anden og farligere sag: ulovligt anpartshaverlån!)",
  },
  {
    id: "andet-drift",
    navn: "Andet (drift)",
    emoji: "📦",
    konto: "firma",
    retning: "begge",
    momsType: "koebsmoms",
    momsFradragPct: 100,
    fradragPct: 100,
    odinNote:
      "Opsamlingskategori. Brug den sparsomt — jo mere præcist du kategoriserer, jo bedre kan jeg vogte din moms og dine fradrag.",
  },
];

// ═══════════════════════════════════════════════════════════════
// PRIVAT-BOGEN (din egen konto)
// ═══════════════════════════════════════════════════════════════

export const PRIVAT_KATEGORIER: Kategori[] = [
  { id: "loen", navn: "Løn", emoji: "💼", konto: "privat", retning: "indtaegt" },
  {
    id: "offentlig-ydelse",
    navn: "SU / offentlige ydelser",
    emoji: "🏛️",
    konto: "privat",
    retning: "indtaegt",
  },
  {
    id: "skat-retur",
    navn: "Skat (overskydende/restskat)",
    emoji: "🧾",
    konto: "privat",
    retning: "begge",
    skatteRelevant: true,
    odinNote: "Udbetalinger fra eller betalinger til Skattestyrelsen privat.",
  },
  { id: "bolig", navn: "Bolig / husleje", emoji: "🏠", konto: "privat", retning: "udgift" },
  {
    id: "el-varme-vand",
    navn: "El, varme & vand",
    emoji: "⚡",
    konto: "privat",
    retning: "udgift",
  },
  {
    id: "forsikring-privat",
    navn: "Forsikringer",
    emoji: "🛡️",
    konto: "privat",
    retning: "udgift",
  },
  {
    id: "dagligvarer",
    navn: "Dagligvarer",
    emoji: "🛒",
    konto: "privat",
    retning: "udgift",
  },
  {
    id: "transport-privat",
    navn: "Transport & brændstof",
    emoji: "⛽",
    konto: "privat",
    retning: "udgift",
    skatteRelevant: true,
    odinNote:
      "Pendler du over 24 km til arbejde (tur/retur), har du ret til befordringsfradrag — det skal DU selv skrive på årsopgørelsen. Spørg mig i viden-basen.",
  },
  {
    id: "telefon-internet-privat",
    navn: "Telefon & internet",
    emoji: "📱",
    konto: "privat",
    retning: "udgift",
  },
  {
    id: "abonnementer",
    navn: "Streaming & abonnementer",
    emoji: "📺",
    konto: "privat",
    retning: "udgift",
  },
  {
    id: "restauranter",
    navn: "Restauranter & caféer",
    emoji: "🍔",
    konto: "privat",
    retning: "udgift",
  },
  {
    id: "toej",
    navn: "Tøj & personlig pleje",
    emoji: "👕",
    konto: "privat",
    retning: "udgift",
  },
  {
    id: "sundhed",
    navn: "Sundhed & medicin",
    emoji: "💊",
    konto: "privat",
    retning: "udgift",
  },
  {
    id: "underholdning",
    navn: "Underholdning & fritid",
    emoji: "🎮",
    konto: "privat",
    retning: "udgift",
  },
  {
    id: "fagforening",
    navn: "Fagforening & A-kasse",
    emoji: "🤝",
    konto: "privat",
    retning: "udgift",
    skatteRelevant: true,
    odinNote:
      "Fradragsberettiget! A-kasse fuldt, fagforeningskontingent op til et årligt loft. Indberettes normalt automatisk — men tjek at det står på årsopgørelsen.",
  },
  {
    id: "donationer",
    navn: "Gaver & donationer",
    emoji: "🎁",
    konto: "privat",
    retning: "udgift",
    skatteRelevant: true,
    odinNote:
      "Donationer til godkendte foreninger (§ 8A) er fradragsberettigede op til et årligt loft — men KUN hvis foreningen har dit CPR-nummer og indberetter det.",
  },
  {
    id: "haandvaerker",
    navn: "Håndværker- & serviceydelser i hjemmet",
    emoji: "🔨",
    konto: "privat",
    retning: "udgift",
    skatteRelevant: true,
    odinNote:
      "Servicefradraget (rengøring, børnepasning m.m.) — og evt. håndværkerfradrag afhængigt af årets regler. Kræver elektronisk betaling og indberetning med dokumentation. Tjek viden-basen for årets lofter.",
  },
  {
    id: "opsparing",
    navn: "Opsparing & investering",
    emoji: "📈",
    konto: "privat",
    retning: "begge",
    skatteRelevant: true,
    odinNote:
      "Overførsler til opsparing/depot/aktiesparekonto. Selve overførslen er ikke skat — men afkastet beskattes (aktieindkomst 27/42 %, aktiesparekonto lagerbeskattes).",
  },
  {
    id: "mobilepay",
    navn: "MobilePay & overførsler",
    emoji: "💸",
    konto: "privat",
    retning: "begge",
  },
  {
    id: "kontant",
    navn: "Kontanthævning",
    emoji: "🏧",
    konto: "privat",
    retning: "udgift",
  },
  {
    id: "boern",
    navn: "Børn & familie",
    emoji: "🧒",
    konto: "privat",
    retning: "begge",
  },
  {
    id: "gebyrer-renter",
    navn: "Gebyrer & renter",
    emoji: "🏦",
    konto: "privat",
    retning: "begge",
    skatteRelevant: true,
    odinNote:
      "Private renteUDGIFTER er fradragsberettigede (kapitalindkomst) og indberettes normalt automatisk af banken.",
  },
  {
    id: "firmaoverfoersel",
    navn: "Overførsel til/fra firmaet",
    emoji: "🔁",
    konto: "privat",
    retning: "begge",
    odinNote:
      "Modposten til firma-bogens ejerindskud/private hævninger. Holder de to bøger adskilt — nøglen til et regnskab, Skat aldrig kan anfægte.",
  },
  {
    id: "andet-privat",
    navn: "Andet (privat)",
    emoji: "📦",
    konto: "privat",
    retning: "begge",
  },
];

export const ALLE_KATEGORIER: Kategori[] = [...FIRMA_KATEGORIER, ...PRIVAT_KATEGORIER];

const pr_id = new Map(ALLE_KATEGORIER.map((k) => [k.id, k]));

export function findKategori(id: string | undefined): Kategori | undefined {
  return id ? pr_id.get(id) : undefined;
}

export function kategorierFor(konto: Konto): Kategori[] {
  return ALLE_KATEGORIER.filter((k) => k.konto === konto || k.konto === "begge");
}
