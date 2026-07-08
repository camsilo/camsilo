/**
 * Fradragskataloget — Odins viden-base-guide om skatte- og momsfradrag for en
 * enkeltmandsvirksomhed (webudvikling, ingen ansatte, lønjob ved siden af).
 * Indholdet er kildekritisk efterprøvet pr. 2026-07-08; korrektioner fra
 * kildekritikken er indarbejdet, og uverificerede praksis-påstande er markeret.
 */

import type { VidenGuide } from "./typer";

export const FRADRAG_GUIDE: VidenGuide = {
  id: "fradrag",
  rune: "ᚢ",
  emoji: "💡",
  titel: "Fradragskataloget — hvad kan trækkes fra, i skat og i moms",
  intro:
    "Huginn og Muninn har fløjet over Skattestyrelsens bøger og bragt mig hvert et fradrag hjem til dig. Her er hele kataloget for 2026: hvad din enkeltmandsvirksomhed kan trække fra i skat og i moms — to adskilte regnskaber, som selv Alfaderen holder hver for sig. Satserne er efterprøvet mod kilderne, og hvor praksis er tåget, siger jeg det ligeud.",
  opdateret: "2026-07-08",
  afsnit: [
    {
      id: "grundprincipper",
      overskrift: "Grundprincipperne: skat og moms er to adskilte systemer",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Skattefradrag nedsætter virksomhedens skattepligtige overskud og kræver, at udgiften er afholdt for at erhverve, sikre og vedligeholde indkomsten (statsskattelovens § 6 a). Momsfradrag er noget andet: det kræver momsregistrering og en forskriftsmæssig faktura. En udgift kan sagtens have fuldt skattefradrag men intet momsfradrag (fx repræsentation) — eller næsten omvendt (dansk hotel: 100 % af momsen kan fradrages, men skattemæssigt kun 25 % af udgiften, hvis opholdet er repræsentation).",
        },
        {
          type: "liste",
          punkter: [
            "Momsregistrering er pligtig ved momspligtig omsætning over 50.000 kr. inden for en 12-måneders periode (momslovens § 48) — og frivillig derunder.",
            "Uden momsregistrering er der intet momsfradrag overhovedet; til gengæld fradrages hele bruttobeløbet inkl. moms skattemæssigt.",
            "Køb af ydelser fra udlandet med omvendt betalingspligt kan udløse selvstændig registreringspligt for erhvervelsesmomsen — selv under 50.000 kr.-grænsen.",
            "Alle bilag skal opbevares i 5 år fra udgangen af det regnskabsår, de vedrører (bogføringsloven).",
          ],
        },
        {
          type: "tabel",
          kolonner: ["Sats/grænse", "Værdi 2026"],
          raekker: [
            ["Straksafskrivning, rent erhvervsmæssige driftsmidler", "36.000 kr. ekskl. moms (2025: 34.400 kr.)"],
            ["Straksfradrag, blandet privat/erhvervsmæssigt benyttede driftsmidler", "16.900 kr. (2025: 16.200 kr.)"],
            ["Saldoafskrivning på driftsmidler", "Op til 25 % pr. år"],
            ["Fri telefon, skattepligtig værdi", "3.500 kr. pr. år (2025: 3.300 kr.)"],
            ["Ægtefællerabat på fri telefon, beløbsgrænse", "4.600 kr. samlet — så 25 % nedslag til hver"],
            ["Kørsel i egen bil", "3,94 kr./km op til 20.000 km pr. år; 2,28 kr./km derover"],
            ["Cykel, knallert, scooter, el-løbehjul", "0,64 kr./km"],
            ["Repræsentation, skattefradrag", "25 % af udgiften (inkl. ikke-fradraget moms)"],
            ["Restaurationsmoms, fradrag", "25 % af momsbeløbet = 5 % af bruttobeløbet inkl. moms"],
            ["Hotelmoms (dansk hotel), fradrag", "100 % af momsen ved strengt erhvervsmæssig karakter"],
            ["Momsregistreringsgrænse", "50.000 kr. momspligtig omsætning pr. 12 måneder"],
            ["Fagforeningskontingent, privat fradragsloft", "7.000 kr. pr. år"],
            ["Opbevaringspligt for bilag", "5 år fra regnskabsårets udgang"],
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Kravet om digitalt bogføringssystem trådte i kraft 1. januar 2026 for personligt ejede virksomheder med nettoomsætning over 300.000 kr. i to på hinanden følgende indkomstår (nystiftede omfattes tidligst fra tredje indkomstår). Det stiller krav om bl.a. digital bilagsopbevaring — relevant for dit eget regnskabsprogram.",
        },
      ],
      kilder: [
        { titel: "Momslovens § 48 — registreringsgrænsen", url: "https://danskelove.dk/momsloven/48" },
        { titel: "Bogføringsloven (lov nr. 700 af 24/5 2022)", url: "https://www.retsinformation.dk/eli/lta/2022/700" },
        { titel: "Erhvervsstyrelsen — digital bogføring fra 1. januar 2026", url: "https://erhvervsstyrelsen.dk/digital-bogfoering-traeder-i-kraft-personligt-ejede-virksomheder-og-foreninger-mfl-den-1-januar" },
        { titel: "Skatteministeriet — satser i afskrivningsloven", url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/afskrivningsloven" },
      ],
    },
    {
      id: "software-udland",
      overskrift: "Software, SaaS, hosting og udenlandske ydelser — omvendt betalingspligt",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Skattemæssigt er der fuldt fradrag: løbende abonnementer (Adobe, GitHub, OpenAI, Vercel, hosting, domæner) er almindelige driftsomkostninger, og købt software kan altid straksafskrives fuldt ud i anskaffelsesåret uanset beløb (afskrivningslovens § 6, stk. 1, nr. 4). Bruges et abonnement delvist privat, fradrages kun den erhvervsmæssige andel efter et sagligt skøn.",
        },
        {
          type: "tekst",
          tekst:
            "Momsmæssigt er det vigtige, at næsten alle disse leverandører er udenlandske, så der gælder omvendt betalingspligt (reverse charge) efter momslovens § 16, stk. 1 og § 46, stk. 1, nr. 3. Ved hvert udenlandsk ydelseskøb gør du sådan på momsangivelsen i TastSelv Erhverv:",
        },
        {
          type: "trin",
          trin: [
            {
              titel: "Beregn momsen",
              tekst: "Beregn 25 % dansk moms af fakturabeløbet (fakturaen skal være udstedt uden udenlandsk moms).",
            },
            {
              titel: "Angiv beløbet som salgsmoms",
              tekst: "Skriv det beregnede beløb i feltet »Moms af ydelseskøb i udlandet med omvendt betalingspligt« på momsangivelsen.",
            },
            {
              titel: "Fradrag samme beløb som købsmoms",
              tekst: "Ved fuld fradragsret skrives det samme beløb i købsmoms-feltet. Nettoeffekten er 0 kr., men angivelsen er lovpligtig.",
            },
            {
              titel: "Rubrik A – ydelser (kun EU-køb)",
              tekst: "Køb fra EU-leverandører (Google Ireland, Meta Ireland, Adobe Ireland m.fl.) indberettes desuden med værdien uden moms i »Rubrik A – ydelser«. Køb fra ikke-EU-lande (fx OpenAI i USA) skal IKKE i rubrik A — kun i momsfelterne.",
            },
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Står der irsk eller anden udenlandsk moms på fakturaen, er kontoen sat op som privat/B2C — den udenlandske moms kan hverken angives eller fradrages i dansk momsregnskab. Løsning: registrér dit CVR-/momsnummer hos leverandøren og bed om kreditnota (eller søg momsrefusion i det pågældende EU-land). Bruttobeløbet kan dog stadig fradrages skattemæssigt. Manglende reverse charge-angivelse er et klassisk fund ved momskontrol, selvom nettoeffekten er nul.",
        },
        {
          type: "tip",
          tekst:
            "Oplys altid dit CVR-/momsnummer, når du opretter konto hos en udenlandsk leverandør — så udstedes fakturaen uden udenlandsk moms og med »reverse charge«-påtegning, og bogføringen bliver ren fra start.",
        },
      ],
      kilder: [
        { titel: "Den juridiske vejledning — straksafskrivning af edb-software", url: "https://info.skat.dk/data.aspx?oid=2060787" },
        { titel: "PwC Momsvejledningen — køb og salg af ydelser til/fra udlandet", url: "https://www.pwc.dk/da/momsvejledningen/moms-og-handel-med-udlandet/koeb-og-salg-af-ydelser-fra-til-udlandet.html" },
        { titel: "BDO — pas på momsen ved køb af varer og ydelser i udlandet", url: "https://www.bdo.dk/da-dk/faglig-info/skat-og-moms/skat-og-moms-2023/pas-pa-momsen-ved-k%C3%B8b-af-varer-og-ydelser-i-udlandet" },
      ],
    },
    {
      id: "udstyr-afskrivning",
      overskrift: "Computer, udstyr og møbler — småanskaffelser og afskrivning",
      blokke: [
        {
          type: "tabel",
          kolonner: ["Situation", "Regel 2026"],
          raekker: [
            ["Udelukkende erhvervsmæssig brug, anskaffelsessum ≤ 36.000 kr. ekskl. moms", "Straksafskrivning — fuldt fradrag i købsåret (AL § 6, stk. 1, nr. 2)"],
            ["Udelukkende erhvervsmæssig brug, over 36.000 kr.", "Saldoafskrivning op til 25 % pr. år (AL § 5)"],
            ["Blandet privat/erhvervsmæssig brug, anskaffelsessum ≤ 16.900 kr.", "Straksfradrag af den erhvervsmæssige andel (AL § 11, stk. 3)"],
            ["Blandet brug, over 16.900 kr.", "Op til 25 % afskrivning på særskilt saldo — kun erhvervsandelen fradrages (AL § 11)"],
            ["Restsaldo under 36.000 kr. (ren erhvervssaldo)", "Kan fradrages fuldt ud"],
            ["Købt software/edb-programmer", "Straksafskrivning uanset beløb (AL § 6, stk. 1, nr. 4)"],
          ],
        },
        {
          type: "tekst",
          tekst:
            "Samlesæt-reglen: aktiver, der er bestemt til at fungere sammen (fx pc + dockingstation + skærme købt som ét sæt), vurderes under ét mod beløbsgrænsen — et samlesæt kan ikke splittes op for at komme under grænsen. Beløbsgrænserne er ekskl. moms, når momsen fradrages.",
        },
        {
          type: "advarsel",
          tekst:
            "Den klassiske fælde: en computer til fx 25.000 kr., der også bruges privat, ligger OVER 16.900 kr.-grænsen (2026) for blandet benyttede aktiver og kan derfor ikke straksafskrives — grænsen for blandede aktiver blev ikke hævet, da 36.000 kr.-grænsen kom i 2022. Og en erhvervsandel på 100 % på husstandens eneste computer holder sjældent ved kontrol.",
        },
        {
          type: "tekst",
          tekst:
            "Moms: fuldt momsfradrag ved ren erhvervsbrug. Ved blandet brug fradrages kun en skønsmæssig erhvervsandel af momsen (momslovens § 38, stk. 2). Skønnet fastlægges ved anskaffelsen, skal være sagligt begrundet (fx tidsforbrug) og bør dokumenteres i bogføringen.",
        },
        {
          type: "tekst",
          tekst:
            "Kontorartikler (papir, blæk, kabler o.l.) er fuldt fradragsberettigede driftsomkostninger ved forbrug. Møbler (skrivebord, kontorstol) er driftsmidler efter tabellen ovenfor — men møbler i hjemmet, der reelt også kan bruges privat, risikerer § 11-behandling (kun erhvervsandel) eller helt at blive anset for private. Skattestyrelsen ser kritisk på fx dyre designmøbler i privatboligen.",
        },
      ],
      kilder: [
        { titel: "Skatteministeriet — satser i afskrivningsloven (36.000/16.900 kr., 2026)", url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/afskrivningsloven" },
        { titel: "Afskrivningslovens § 11 — blandet benyttede driftsmidler", url: "https://danskelove.dk/afskrivningsloven/11" },
        { titel: "Den juridiske vejledning — delvist momsfradrag (ML § 38, stk. 2)", url: "https://info.skat.dk/data.aspx?oid=2085687" },
      ],
    },
    {
      id: "telefon-internet",
      overskrift: "Telefon og internet — fri telefon eller erhvervsandel",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Model A — telefonen indgår i virksomheden: virksomheden fradrager ALLE udgifter (apparatet efter afsnittet om udstyr, abonnementet fuldt ud), og du beskattes til gengæld af fri telefon på 3.500 kr. pr. år (2026; 3.300 kr. i 2025), fordi privat rådighed formodes (ligningslovens § 16, stk. 12, jf. stk. 14 for selvstændige). Betaler virksomheden både telefon og internet, beskattes du stadig kun af 3.500 kr. i alt. Beløbet nedsættes forholdsmæssigt pr. måned, hvis du kun har rådighed en del af året.",
        },
        {
          type: "tekst",
          tekst:
            "Model B — telefonen holdes privat: du afholder udgiften privat og fradrager et konkret, sagligt skøn over erhvervsandelen i virksomheden. Ingen fri telefon-beskatning, men skønnet skal kunne forsvares.",
        },
        {
          type: "tekst",
          tekst:
            "Ægtefællerabat: er ægtefællernes samlede skattepligtige værdi af goderne før nedslag mindst 4.600 kr. (2026; 4.400 kr. i 2025), får hver ægtefælle 25 % nedslag. Bemærk: betingelsen er beløbsgrænsen, ikke et månedstal — i 2026 svarer den regnemæssigt til mindst 16 måneders fri telefon tilsammen, men implementér beløbsgrænsen, da den reguleres årligt.",
        },
        {
          type: "tekst",
          tekst:
            "Internet i hjemmet: giver forbindelsen adgang til virksomhedens netværk, kan virksomheden afholde udgiften med fuldt skattefradrag uden separat beskatning af internetdelen. For en hjemmebaseret enkeltmandsvirksomhed anses hjemmets forbindelse i praksis for at give adgang til virksomhedens filer/systemer (ikke fuldt verificeret — fortolkning af Den juridiske vejledning C.C.2.1.4.4.2.2, tjek kilden konkret). Har du samtidig privat rådighed over en virksomhedsbetalt telefon, udløses de 3.500 kr. (2026) dog alligevel — det er ét samlet beløb for begge goder.",
        },
        {
          type: "advarsel",
          tekst:
            "Fri telefon-beløbet er IKKE en udgift, men et skattepligtigt tillæg til virksomhedens resultat. Og 100 % momsfradrag på husstandens internetforbindelse accepteres ikke — ved blandet brug fradrages kun en skønsmæssig andel af momsen (momslovens § 38, stk. 2).",
        },
        {
          type: "tip",
          tekst:
            "Regn begge modeller igennem: Model A er typisk bedst, når de samlede telefon- og internetudgifter overstiger værdien af beskatningen på 3.500 kr. (2026) — hvilket de ofte gør, når virksomheden betaler både abonnement og apparat.",
        },
      ],
      kilder: [
        { titel: "Skatteministeriet — satser i ligningsloven (fri telefon 3.500 kr., grænse 4.600 kr., 2026)", url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/ligningsloven" },
        { titel: "Ligningslovens § 16, stk. 12", url: "https://danskelove.dk/ligningsloven/16" },
        { titel: "Den juridiske vejledning — datakommunikation/internet for selvstændige", url: "https://info.skat.dk/data.aspx?oid=2061424" },
        { titel: "Den juridiske vejledning — delvist momsfradrag (ML § 38, stk. 2)", url: "https://info.skat.dk/data.aspx?oid=2085687" },
      ],
    },
    {
      id: "koersel",
      overskrift: "Kørsel i egen bil — satser og kørebog",
      blokke: [
        {
          type: "tabel",
          kolonner: ["Transportmiddel", "Sats 2026"],
          raekker: [
            ["Egen bil, de første 20.000 erhvervskilometer pr. år", "3,94 kr. pr. km"],
            ["Egen bil, over 20.000 erhvervskilometer pr. år", "2,28 kr. pr. km"],
            ["Egen cykel, knallert, 45-knallert, scooter eller el-løbehjul", "0,64 kr. pr. km"],
          ],
        },
        {
          type: "tekst",
          tekst:
            "Satserne er fastsat af Skatterådet (bekendtgørelse nr. 1333 af 20/11/2025, § 4). Som selvstændig kan du fradrage erhvervsmæssig kørsel i din private bil efter satserne — de dækker ALLE biludgifter (brændstof, forsikring, værditab). Alternativet er fradrag for den faktiske erhvervsmæssige andel af samtlige biludgifter efter kørebogens fordeling; vælg én metode og vær konsistent. Erhvervsmæssig parkering og broafgift kan normalt fradrages særskilt som driftsomkostning.",
        },
        {
          type: "liste",
          punkter: [
            "Kørebogen skal indeholde: dato for kørslen.",
            "Kilometertællerens stand ved dagens begyndelse og slutning (praksiskrav for selvstændige — ikke fuldt verificeret mod primær lovkilde, men konsistent med fast praksis).",
            "Antal kørte erhvervskilometer.",
            "Bestemmelsessted (adresse).",
            "Konkret ærinde — kunde, projekt og anledning. Vage formål som »kundebesøg« er den hyppigste grund til, at kørebøger tilsidesættes.",
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Kørsel mellem hjem og et fast arbejdssted er IKKE erhvervsmæssig kørsel. Mangelfuld kørebog betyder, at Skattestyrelsen kan tilsidesætte hele fordelingen og fastsætte den skønsmæssigt. Og der er intet momsfradrag på anskaffelse eller drift af en hvidpladebil (momslovens § 42, stk. 1) — kilometersatsen er derfor i praksis den relevante mekanisme for en webudvikler med privat bil.",
        },
      ],
      kilder: [
        { titel: "Skattestyrelsen — satser for kørsel 2026", url: "https://sktst.dk/nyheder-og-pressemeddelelser/hoejere-fradrag-til-pendlerne-i-2026" },
        { titel: "Bekendtgørelse nr. 1333 af 20/11/2025 om Skatterådets satser for 2026", url: "https://www.lovtidende.dk/api/pdf/252475" },
        { titel: "Den juridiske vejledning — kørebogskrav for selvstændige", url: "https://info.skat.dk/data.aspx?oid=2083502" },
        { titel: "Momslovens § 42 — intet momsfradrag på personbiler", url: "https://danskelove.dk/momsloven/42" },
      ],
    },
    {
      id: "arbejdsvaerelse",
      overskrift: "Arbejdsværelse i hjemmet — strenge betingelser",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Fradrag for arbejdsværelse godkendes sjældent. To krav skal begge være opfyldt: (1) værelset har skiftet karakter, så det er reelt uanvendeligt til privat brug (indretning og adgangsforhold; et gennemgangsrum diskvalificerer typisk), og (2) rummet er dit hovedarbejdssted inden for normal arbejdstid. Et almindeligt pænt kontor med skrivebord og pc opfylder normalt IKKE kravene, fordi rummet fortsat kan bruges privat. Bevisbyrden ligger hos dig.",
        },
        {
          type: "tekst",
          tekst:
            "Godkendes fradraget: i lejebolig en forholdsmæssig kvadratmeterandel af husleje, el og varme; i ejerbolig en andel af el og varme samt et forholdsmæssigt nedslag i ejendomsværdiskatten. Momsmæssigt er der i praksis intet at hente — boligudgifter er private, og husleje er typisk momsfri.",
        },
        {
          type: "advarsel",
          tekst:
            "Med lønjob ved siden af virksomheden er hjemmekontoret sjældent hovedarbejdsstedet inden for normal arbejdstid — fradraget er dermed næsten uopnåeligt for bibeskæftigede. Regn ikke med det, medmindre du kan dokumentere begge betingelser konkret.",
        },
        {
          type: "tip",
          tekst:
            "Møbler og udstyr i rummet kan stadig fradrages som driftsmidler efter afsnittet om udstyr, hvis de konkret er erhvervsmæssigt begrundede — også selvom selve værelset ikke godkendes som arbejdsværelse.",
        },
      ],
      kilder: [
        { titel: "Den juridiske vejledning C.C.2.2.2.13 — arbejdsværelse i hjemmet", url: "https://info.skat.dk/data.aspx?oid=2083512" },
      ],
    },
    {
      id: "repraesentation-reklame",
      overskrift: "Repræsentation, reklame, restaurant og hotel",
      blokke: [
        {
          type: "tabel",
          kolonner: ["Udgiftstype", "Skattefradrag", "Momsfradrag"],
          raekker: [
            ["Repræsentation (mad, gaver, arrangementer for kunder og forretningsforbindelser)", "25 % af udgiften inkl. ikke-fradraget moms (LL § 8, stk. 4)", "0 % (ML § 42, stk. 1, nr. 5)"],
            ["Restaurationsydelse, strengt erhvervsmæssig", "Typisk 25 % som repræsentation; fuldt fradrag ved egne rejseudgifter på erhvervsrejse", "25 % af momsbeløbet (ML § 42, stk. 2)"],
            ["Hotelovernatning i Danmark, strengt erhvervsmæssig", "Fuldt fradrag ved egen erhvervsrejse; 25 % hvis repræsentation", "100 % af momsen — kun selve overnatningen"],
            ["Reklame (ubestemt kreds: annoncer, website, sponsorater med reklameværdi)", "100 % (LL § 8, stk. 1)", "100 %"],
            ["Reklameartikler med logo, indkøbspris højst ca. 100 kr. (praksisgrænse — ikke fuldt verificeret, tjek kilden)", "100 % som reklame", "Fradrag i praksis ved ≤ 100 kr. ekskl. moms"],
          ],
        },
        {
          type: "tekst",
          tekst:
            "Restaurationsmomsen regnes sådan: fradraget er 25 % af MOMSBELØBET, hvilket svarer til 6,25 % af nettobeløbet ekskl. moms og 5 % af bruttobeløbet inkl. moms. Eksempel: en regning på 1.250 kr. inkl. moms består af 1.000 kr. netto + 250 kr. moms — momsfradraget er 62,50 kr. Delvist private restaurantbesøg giver intet momsfradrag. På hotelregninger skal morgenmad/restaurantdelen udskilles og følger restaurations-reglen; udenlandske hoteller fakturerer med udenlandsk moms, som ikke kan fradrages i dansk momsregnskab.",
        },
        {
          type: "tekst",
          tekst:
            "Dokumentation: repræsentationsbilag skal påføres anledning og deltagere (navne/virksomheder). Den ikke-fradragsberettigede moms lægges til udgiften, FØR 25 %-fradraget beregnes. Annoncer hos Google og Meta er fuldt fradragsberettiget reklame — momsmæssigt håndteres de med omvendt betalingspligt som beskrevet i software-afsnittet (faktureret fra Irland, så også Rubrik A – ydelser).",
        },
        {
          type: "advarsel",
          tekst:
            "Din egen frokost er privat — du er ikke ansat i din enkeltmandsvirksomhed, så »personaleudgifter« findes ikke uden ansatte. Undtagelsen er rejseudgifter under erhvervsrejse med overnatning. Og gaver til navngivne kunder over ca. 100 kr. er repræsentation (25 % skat, 0 % moms), ikke reklame — 100 kr.-grænsen er administrativ praksis, ikke en lovfæstet beløbsgrænse (ikke fuldt verificeret — tjek kilden).",
        },
      ],
      kilder: [
        { titel: "Den juridiske vejledning — repræsentationsudgifter (LL § 8, stk. 4)", url: "https://info.skat.dk/data.aspx?oid=1976834" },
        { titel: "Den juridiske vejledning D.A.11.5.7.2 — moms på restaurationsydelser", url: "https://info.skat.dk/data.aspx?oid=2085707" },
        { titel: "Den juridiske vejledning — moms på hotelovernatning", url: "https://info.skat.dk/data.aspx?oid=2085700" },
        { titel: "Ase — fradrag for reklame- og repræsentationsudgifter", url: "https://www.ase.dk/selvstaendig/faa-svar/virksomhedsjura/skatteret/fradrag-for-reklameudgifter-og-repraesentationsudgifter" },
      ],
    },
    {
      id: "kurser",
      overskrift: "Kurser, faglitteratur og konferencer",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Skattereglen er en skillelinje: fradrag for AJOURFØRING — kurser der vedligeholder og ajourfører din eksisterende faglige viden med konkret tilknytning til indtjeningen — men INTET fradrag for VIDEREUDDANNELSE eller etablering af et nyt indtægtsgrundlag. Kurser af for generel eller privat karakter afvises også.",
        },
        {
          type: "liste",
          punkter: [
            "Kursus i et nyt JS-framework eller it-sikkerhed: typisk fradrag (ajourføring af eksisterende webudvikler-viden).",
            "En hel ny uddannelse (fx MBA eller ny profession): intet fradrag (videreuddannelse).",
            "Fagbøger og fagblade: fradrag. Almen litteratur: intet fradrag.",
            "Rejse og ophold til fagligt begrundede konferencer følger med kurset — det faglige program er nøglen; blandede ferie-agtige rejser beskæres eller nægtes.",
          ],
        },
        {
          type: "tekst",
          tekst:
            "Moms: danske kurser og bøger med dansk moms giver momsfradrag ved erhvervsmæssig relevans. Adgangsbilletter til udenlandske konferencer pålægges typisk lokal moms (beskatningssted der, hvor arrangementet afholdes) — den udenlandske moms kan ikke fradrages i Danmark, men kan eventuelt søges refunderet i det pågældende EU-land. Online-kurser købt fra udlandet håndteres med omvendt betalingspligt som i software-afsnittet.",
        },
      ],
      kilder: [
        { titel: "Den juridiske vejledning C.C.2.2.2.3 — kursusudgifter", url: "https://info.skat.dk/data.aspx?oid=2083495" },
      ],
    },
    {
      id: "forsikring-raadgivning-foer-start",
      overskrift: "Forsikringer, rådgivere, kontingenter — og udgifter før virksomhedsstart",
      blokke: [
        {
          type: "liste",
          punkter: [
            "Erhvervsforsikringer (ansvar, professionelt rådgiveransvar, løsøre, cyber): fuldt skattefradrag. Forsikringspræmier er momsfri (momslovens § 13), så der er intet momsfradrag at hente — hele præmien bogføres uden moms. Dine private forsikringer (indbo, ulykke) er ikke fradragsberettigede.",
            "Revisor, bogholder og advokat til løbende drift (bogføring, regnskab, moms, kontrakter): fuldt skatte- og momsfradrag.",
            "Rådgivning ved selve etableringen (stiftelsesbistand, markedsanalyser, gebyrer): INTET skattefradrag — etableringsudgift (ligningslovens § 8 J blev ophævet i 2010).",
            "Branchekontingent med driftsformål: fradrag i virksomheden (kontingenter er ofte uden moms).",
            "Fagforeningskontingent: PRIVAT ligningsmæssigt fradrag med loft på 7.000 kr. pr. år (2026) — oplyses i rubrik 458, ikke i virksomhedens regnskab. A-kassebidrag fradrages ligeledes fuldt ud privat.",
          ],
        },
        {
          type: "tekst",
          tekst:
            "Udgifter FØR virksomhedsstart, skat: udgifter med driftsomkostningskarakter afholdt op til ca. 6 måneder før start (husleje, telefon, annoncering, udstyr) kan normalt fradrages, når de var nødvendige for driften — 6-måneders-grænsen er praksis, ikke en fast lovfrist (ikke fuldt verificeret — tjek kilden og vurdér konkret). Udstyr købt tidligere kan indskydes i virksomheden til handelsværdi og afskrives derfra.",
        },
        {
          type: "tekst",
          tekst:
            "Udgifter før momsregistrering: købsmomsen kan efter praksis fradrages, når indkøbene reelt anvendes i den momspligtige virksomhed og fakturakravene er opfyldt — tommelfingerreglen på ca. 6 måneder stammer fra branchekilder, ikke fra en fast lovregel (ikke fuldt verificeret — tjek kilden og dokumentér sammenhængen konkret).",
        },
        {
          type: "tip",
          tekst:
            "Overvej frivillig momsregistrering fra dag ét, selv under 50.000 kr.-grænsen — uden registrering er der intet momsfradrag overhovedet, og køb af udenlandske ydelser (reverse charge) kan alligevel udløse betalingspligt for erhvervelsesmomsen uden fradragsret.",
        },
      ],
      kilder: [
        { titel: "Den juridiske vejledning C.C.2.2.1.7 — udgifter afholdt før virksomhedsstart", url: "https://info.skat.dk/data.aspx?oid=2083474" },
        { titel: "Momslovens § 13 — momsfritagelse (forsikring)", url: "https://danskelove.dk/momsloven/13" },
        { titel: "Tax.dk — fagforeningskontingent", url: "https://tax.dk/skat/fagforeningskontingent.htm" },
        { titel: "Dinero — omkostninger ved start af virksomhed", url: "https://dinero.dk/support/omkostninger-start-af-virksomhed/" },
      ],
    },
    {
      id: "underskud",
      overskrift: "Underskud — modregning i din lønindkomst og hobby-risikoen",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Underskud i en erhvervsmæssig enkeltmandsvirksomhed fradrages i din øvrige personlige indkomst — altså lønnen fra dit lønjob — samme år, dernæst i ægtefællens (personskattelovens § 13; virksomhedsskattelovens § 13 i virksomhedsordningen). Uudnyttet underskud fremføres uden tidsbegrænsning, og fremført underskud nedsætter også AM-bidragsgrundlaget. Praktisk oplyses underskuddet på oplysningsskemaet som underskud af virksomhed — rubrik 112 (rubriknummeret er ikke fuldt verificeret — tjek det i det aktuelle TastSelv-oplysningsskema).",
        },
        {
          type: "advarsel",
          tekst:
            "Den store fælde er omklassificering til hobbyvirksomhed: giver virksomheden underskud flere år i træk (tommelfingerregel 3-4+ år) uden udsigt til rentabel drift, kan Skattestyrelsen erklære den ikke-erhvervsmæssig. Så bortfalder underskudsfradraget helt — hverken modregning eller fremførsel — og momsfradrag kan nægtes eller tilbageføres med henvisning til manglende økonomisk virksomhed. Web-bibeskæftigelse med lav omsætning og faste underskud er en typisk risikoprofil.",
        },
        {
          type: "tip",
          tekst:
            "Dokumentér den erhvervsmæssige drift løbende: budget, kundeopsøgning, timeregistrering og en rimelig intensitet. Det er den bedste forsikring mod hobby-stemplet, hvis Skattestyrelsen banker på efter et par underskudsår.",
        },
      ],
      kilder: [
        { titel: "Den juridiske vejledning — underskud af virksomhed (PSL § 13)", url: "https://info.skat.dk/data.aspx?oid=1948911" },
        { titel: "Den juridiske vejledning C.C.1.1.2 — erhvervsmæssig vs. ikke-erhvervsmæssig virksomhed", url: "https://www.tax.dk/jv/cc/C_C_1_1_2.htm" },
      ],
    },
  ],
};
