/**
 * Odins viden-base: Fristkalenderen 2026-2027 for enkeltmandsvirksomhed
 * (momsregistreret, ingen ansatte, ejer med lønjob ved siden af).
 * Alle datoer og satser er kildekritisk efterprøvet mod skat.dk/Skattestyrelsen
 * pr. 8. juli 2026; regelberegnede 2027-datoer er markeret som ikke fuldt
 * verificerede i teksten.
 */

import type { VidenGuide } from "./typer";

export const FRISTKALENDER_GUIDE: VidenGuide = {
  id: "fristkalender",
  titel: "Fristkalenderen 2026-2027 — dato for dato",
  rune: "ᛃ",
  emoji: "📅",
  intro:
    "Hugin og Munin har fløjet året rundt og bragt hver eneste frist hjem til Alfaderens bog — moms, B-skat, oplysningsskema og restskat, dato for dato, efterprøvet mod skat.dk den 8. juli 2026. Én frist brænder allerede under fødderne: oplysningsskemaet for 2025 er over tiden, og tillægget vokser for hver dag. Læs først, betal så — og lad ravnene minde dig om resten.",
  opdateret: "2026-07-08",
  afsnit: [
    {
      id: "haster-nu",
      overskrift: "Haster nu: oplysningsskemaet for 2025 er over fristen",
      blokke: [
        {
          type: "advarsel",
          tekst:
            "Fristen for oplysningsskemaet for indkomståret 2025 (udvidet skema — obligatorisk for alle med enkeltmandsvirksomhed) var 1. juli 2026 og ER overskredet med 7 dage pr. 8. juli 2026. Skattetillægget løber videre for hver dag, skemaet ikke er indsendt: 400 kr. pr. dag (maks. 10.000 kr.) — dog kun 200 kr. pr. dag (maks. 5.000 kr.), hvis den skattepligtige indkomst for 2025 ikke oversteg 611.800 kr. (2025-grænsen; 2026-grænsen på 641.200 kr. gælder først for 2026-skemaet). Satserne blev fordoblet i januar 2025, så ældre guides med 200 kr./5.000 kr. som normalsats er forældede. Tillægget er ikke fradragsberettiget.",
        },
        {
          type: "trin",
          trin: [
            {
              titel: "Indsend oplysningsskemaet i TastSelv i dag",
              tekst:
                "Skemaet for 2025 er stadig åbent på skat.dk (TastSelv). Indsendelsen stopper uret samme dag — hver dags udsættelse koster 200 eller 400 kr. oveni.",
            },
            {
              titel: "Regn med det allerede påløbne tillæg",
              tekst:
                "Pr. 8. juli 2026 er der påløbet ca. 1.400 kr. ved lav sats eller ca. 2.800 kr. ved normal sats (ikke fuldt verificeret — Skattestyrelsens præcise dagsoptælling kan afvige med en dag; tjek kilden).",
            },
            {
              titel: "Søg eventuelt fritagelse for tillægget",
              tekst:
                "Fritagelse kan søges hos Skattestyrelsen via TastSelv eller skriftligt sammen med indsendelsen, men gives kun i særlige tilfælde — fx dokumenteret sygdom eller it-nedbrud hos Skattestyrelsen. »Travlhed« eller revisors forhold godtages efter praksis ikke (de konkrete praksis-eksempler er ikke fuldt verificerede — tjek kilden).",
            },
            {
              titel: "Tjek restskatten for 2025, når årsopgørelsen dannes",
              tekst:
                "Fristen 1. juli 2026 for at betale restskat 2025 med dag-til-dag-rente (3,7 % p.a.) er også passeret, så restskat pålægges nu et fast procenttillæg på 5,7 %. Op til 25.368 kr. inkl. tillæg indregnes automatisk i forskudsskatten for 2027; beløb derover opkræves i 3 rater med betalingsfrist 20. august, 21. september og 20. oktober 2026.",
            },
          ],
        },
        {
          type: "tip",
          tekst:
            "Indsend skemaet nu, selv om tallene ikke er perfekte — du kan rette bagefter i TastSelv. Det er dagene uden indsendt skema, der koster; en senere rettelse koster ikke skattetillæg.",
        },
      ],
      kilder: [
        {
          titel: "Skattestyrelsen — Årsopgørelsen for 2025: hvad sker hvornår",
          url: "https://sktst.dk/personskat/arsopgoerelsen/arsopgoerelsen-for-2025-hvad-sker-hvornaar",
        },
        {
          titel: "Juridisk Vejledning A.C.2.1.4.3.1 — skattetillæg (skattekontrollovens § 73)",
          url: "https://info.skat.dk/data.aspx?oid=2284578",
        },
        {
          titel: "skat.dk — Oplysningsskema for egen virksomhed",
          url: "https://skat.dk/erhverv/egen-virksomhed/bogfoering-regnskab-og-oplysningsskema/oplysningsskema",
        },
        {
          titel: "skat.dk — Restskat: betaling, rente og procenttillæg",
          url: "https://skat.dk/en-us/individuals/tax-assessment-notice/outstanding-tax/pay-outstanding-tax",
        },
      ],
    },
    {
      id: "kalender-2026",
      overskrift: "Kalenderen: resten af 2026",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Alle frister herunder er sidste rettidige dag for både indberetning og betaling. Datoer, der falder på weekend eller helligdag, er allerede forskudt til næste hverdag i tabellen.",
        },
        {
          type: "tabel",
          kolonner: ["Dato", "Frist"],
          raekker: [
            [
              "NU — hurtigst muligt",
              "Oplysningsskema 2025 (frist 1. juli 2026 overskredet — skattetillægget løber, se afsnittet ovenfor)",
            ],
            ["20. juli 2026", "B-skat-rate (juli)"],
            [
              "20. august 2026",
              "B-skat-rate (august) + evt. 1. restskat-rate for 2025",
            ],
            [
              "1. september 2026 (tirsdag)",
              "MOMS: 1. halvår 2026 (halvårlig afregning) eller 2. kvartal 2026 (kvartalsafregning) — indberetning og betaling",
            ],
            [
              "21. september 2026",
              "B-skat-rate (september — 20/9 er søndag) + evt. 2. restskat-rate for 2025",
            ],
            [
              "20. oktober 2026",
              "B-skat-rate (oktober) + evt. 3. restskat-rate for 2025",
            ],
            [
              "ca. 10.-12. november 2026 (forventet — ikke fuldt verificeret, ikke officielt annonceret)",
              "Forskudsopgørelsen for 2027 åbner i TastSelv (2026-udgaven åbnede 11. november 2025). Opdater forventet virksomhedsoverskud",
            ],
            ["20. november 2026", "B-skat-rate (november — årets sidste)"],
            [
              "1. december 2026 (tirsdag)",
              "MOMS: 3. kvartal 2026 (kun ved kvartalsafregning)",
            ],
            [
              "senest 31. december 2026 — betal i praksis 29.-30. december",
              "Frivillig indbetaling af forventet restskat for 2026: betalt inden 1. januar 2027 = ingen rente overhovedet. Registrering tager 2-3 bankdage (praktisk råd fra PwC — ikke fuldt verificeret mod officiel kilde)",
            ],
          ],
        },
      ],
      kilder: [
        {
          titel: "skat.dk — Momsfrister: indberet og betal moms",
          url: "https://skat.dk/erhverv/moms/frister-indberet-og-betal-moms",
        },
        {
          titel: "Juridisk Vejledning A.B.4.1.2.1 — B-skat-rater",
          url: "https://info.skat.dk/data.aspx?oid=2085241",
        },
        {
          titel: "Skattestyrelsen — Forskudsopgørelsen for 2026 åbner 11. november",
          url: "https://sktst.dk/nyheder-og-pressemeddelelser/forskudsopgoerelsen-for-2026-aabner-den-11-november",
        },
        {
          titel: "PwC — Betal restskatten inden nytår og undgå renter",
          url: "https://www.pwc.dk/da/artikler/2025/12/betal-restskatten-inden-2026-og-undgaa-renter.html",
        },
      ],
    },
    {
      id: "kalender-2027",
      overskrift: "Kalenderen: 2027",
      blokke: [
        {
          type: "advarsel",
          tekst:
            "B-skat-datoerne for 2027 (herunder forskydningerne 22/2, 22/3 og 22/11, fordi den 20. er lørdag) og momsfristerne efter 1. marts 2027 er regelberegnede — Skattestyrelsen havde pr. juli 2026 endnu ikke offentliggjort 2027-kalenderen, og skat.dk's momstabel gik kun til 1. marts 2027. Weekend-kollisionerne er matematisk verificeret, men genbekræft alle 2027-datoer mod skat.dk ultimo 2026 (ikke fuldt verificeret — tjek kilden).",
        },
        {
          type: "tabel",
          kolonner: ["Dato", "Frist"],
          raekker: [
            [
              "20. januar 2027",
              "B-skat-rate (januar). Samme dato er ca.-frist for at rette forskudsopgørelsen 2027, hvis ændringen skal nå januar-lønnen",
            ],
            ["22. februar 2027", "B-skat-rate (februar — 20/2 er lørdag)"],
            [
              "1. marts 2027 (mandag)",
              "MOMS: 2. halvår 2026 (halvårlig) eller 4. kvartal 2026 (kvartalsvis)",
            ],
            ["22. marts 2027", "B-skat-rate (marts — 20/3 er lørdag)"],
            [
              "medio-ultimo marts 2027 (forventet)",
              "Årsopgørelsen for 2026 klar i TastSelv (2025-udgaven kom 23. marts 2026)",
            ],
            ["20. april 2027", "B-skat-rate (april)"],
            [
              "1. maj 2027 (forventet)",
              "Rettefrist for årsopgørelsen 2026 for lønmodtager-delen (blev i 2026 ekstraordinært forlænget til 20. maj — regn ikke med gentagelse)",
            ],
            ["20. maj 2027", "B-skat-rate (maj)"],
            [
              "1. juni 2027 (tirsdag)",
              "MOMS: 1. kvartal 2027 (kun kvartalsvis) — regelberegnet, ikke fuldt verificeret",
            ],
            [
              "1. juli 2027 (torsdag)",
              "OPLYSNINGSSKEMA for indkomståret 2026 (udvidet skema — din hårde frist) + sidste dag at betale restskat 2026 med dag-til-dag-rente i stedet for procenttillæg",
            ],
            ["20. juli 2027", "B-skat-rate (juli)"],
            [
              "20. august 2027",
              "B-skat-rate (august) + evt. 1. restskat-rate for 2026",
            ],
            [
              "1. september 2027 (onsdag)",
              "MOMS: 2. kvartal 2027 (kvartalsvis) eller 1. halvår 2027 (halvårlig, forventet) — regelberegnet, ikke fuldt verificeret",
            ],
            [
              "20. september 2027 (mandag)",
              "B-skat-rate (september) + evt. 2. restskat-rate for 2026",
            ],
            [
              "20. oktober 2027",
              "B-skat-rate (oktober) + evt. 3. restskat-rate for 2026",
            ],
            ["22. november 2027", "B-skat-rate (november — 20/11 er lørdag)"],
          ],
        },
      ],
      kilder: [
        {
          titel: "skat.dk — Momsfrister: indberet og betal moms",
          url: "https://skat.dk/erhverv/moms/frister-indberet-og-betal-moms",
        },
        {
          titel: "Kildeskattelovens § 41 (weekend-forskydning af B-skat)",
          url: "https://danskelove.dk/kildeskatteloven/41",
        },
        {
          titel: "skat.dk — Oplysningsskema for egen virksomhed",
          url: "https://skat.dk/erhverv/egen-virksomhed/bogfoering-regnskab-og-oplysningsskema/oplysningsskema",
        },
        {
          titel: "Skattestyrelsen — Årsopgørelsen er klar 23. marts 2026",
          url: "https://sktst.dk/nyheder-og-pressemeddelelser/arsopgoerelsen-er-klar-den-23-marts-2026",
        },
      ],
    },
    {
      id: "moms-regler",
      overskrift: "Moms — reglerne bag datoerne",
      blokke: [
        {
          type: "liste",
          punkter: [
            "Halvårlig afregning gælder ved omsætning under 5 mio. kr. om året — og kun hvis tidligere indberetninger er sket til tiden. Frister: 1. marts og 1. september (weekend/helligdag forskyder til næste hverdag).",
            "Kvartalsvis afregning: frist den 1. i den tredje måned efter kvartalets udløb, dvs. 1. marts, 1. juni, 1. september og 1. december.",
            "Nyregistrerede virksomheder starter typisk på kvartalsafregning — tjek i TastSelv Erhverv, hvilken afregningsperiode Camsilo faktisk står på, før du lægger kalenderen fast.",
            "Konkrete frister fremad: 2. halvår 2025 havde frist 2. marts 2026 (1. marts var en søndag); 1. halvår 2026 har frist 1. september 2026; 2. halvår 2026 har frist 1. marts 2027.",
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Indberet ALTID — også ved 0 kr. i moms. Manglende indberetning udløser en foreløbig fastsættelse (FF) med en afgift på 1.400 kr. pr. periode (forhøjet fra 800 kr. pr. 1. februar 2025) plus renter. Afgiften eftergives ikke, selv om du senere indberetter korrekt. For sen betaling forrentes desuden via skattekontoen med ca. 0,95 % pr. måned i 2026 med daglig renteberegning (månedssatsen er ikke fuldt verificeret — tjek kilden); renten er ikke fradragsberettiget.",
        },
        {
          type: "tip",
          tekst:
            "Betal tidligst 5 hverdage før fristen: Skattekontoen sender penge retur, der står for længe, medmindre udbetalingsgrænsen er hævet. Læg altså betalingen i vinduet fra 5 hverdage før fristen til selve fristdagen.",
        },
      ],
      kilder: [
        {
          titel: "skat.dk — Momsfrister: indberet og betal moms",
          url: "https://skat.dk/erhverv/moms/frister-indberet-og-betal-moms",
        },
        {
          titel: "skat.dk — Foreløbige fastsættelser (skattekontoen)",
          url: "https://skat.dk/en-us/businesses/payment-and-the-tax-account-skattekontoen/estimates",
        },
        {
          titel: "skat.dk — Momsfrister og betaling (skattekonto-reglen om 5 hverdage)",
          url: "https://skat.dk/en-us/businesses/vat/deadlines-filing-vat-returns-and-paying-vat",
        },
        {
          titel: "skm.dk — Satser efter opkrævningsloven (skattekonto-rente)",
          url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/opkraevningsloven",
        },
      ],
    },
    {
      id: "b-skat-regler",
      overskrift: "B-skat — reglerne bag de 10 rater",
      blokke: [
        {
          type: "tekst",
          tekst:
            "B-skat af virksomhedsoverskuddet opkræves kun, hvis forskudsopgørelsen indeholder resultat af virksomhed — det står i rubrik 221 (»Overskud af virksomhed«) på forskudsopgørelsen. Der er 10 rater om året: alle måneder undtagen juni og december. Raten forfalder den 1. i måneden, og sidste rettidige betalingsdag er den 20. i samme måned. Falder den 20. på en lørdag, søndag eller helligdag, forlænges fristen til den følgende hverdag (kildeskattelovens § 41, stk. 3).",
        },
        {
          type: "tabel",
          kolonner: ["År", "Betalingsfrister (sidste rettidige dag)"],
          raekker: [
            [
              "2026",
              "20/1 · 20/2 · 20/3 · 20/4 · 20/5 · 20/7 · 20/8 · 21/9 (20/9 er søndag) · 20/10 · 20/11",
            ],
            [
              "2027 (regelberegnet — ikke fuldt verificeret, tjek kilden ultimo 2026)",
              "20/1 · 22/2 (20/2 er lørdag) · 22/3 (20/3 er lørdag) · 20/4 · 20/5 · 20/7 · 20/8 · 20/9 · 20/10 · 22/11 (20/11 er lørdag)",
            ],
          ],
        },
        {
          type: "tip",
          tekst:
            "Da du også har lønjob, kan du i stedet hæve trækprocenten på lønnen via forskudsopgørelsen og helt undgå B-skat-rater. Ret forskudsopgørelsen i TastSelv, når det forventede overskud ændrer sig — så justeres de resterende rater automatisk.",
        },
      ],
      kilder: [
        {
          titel: "Juridisk Vejledning A.B.4.1.2.1 — opkrævning af B-skat",
          url: "https://info.skat.dk/data.aspx?oid=2085241",
        },
        {
          titel: "Kildeskattelovens § 41",
          url: "https://danskelove.dk/kildeskatteloven/41",
        },
        {
          titel: "Martinsen — Vigtige datoer i 2026 (krydstjek af 2026-raterne)",
          url: "https://martinsen.dk/faglig-viden/vigtige-datoer-i-kalenderen/vigtige-datoer-i-2026/",
        },
      ],
    },
    {
      id: "restskat-trappen",
      overskrift: "Restskat — de tre trin på trappen",
      blokke: [
        {
          type: "trin",
          trin: [
            {
              titel: "Trin 1: Betal frivilligt inden nytår — 0 kr. i rente",
              tekst:
                "Betaler du forventet restskat inden 1. januar i året efter indkomståret, koster den ingenting ekstra. For indkomståret 2026: betal senest 31. december 2026 — i praksis 29.-30. december, da registreringen tager 2-3 bankdage (praktisk råd fra PwC, ikke fuldt verificeret mod officiel kilde).",
            },
            {
              titel: "Trin 2: Betal mellem 1. januar og 1. juli — dag-til-dag-rente",
              tekst:
                "For indkomståret 2025 var renten 3,7 % p.a., beregnet fra 1. januar 2026 frem til betalingsdagen. Satsen for indkomståret 2026 kendes endnu ikke og offentliggøres først i december 2026 (ikke fuldt verificeret — brug 3,7 %/5,7 % som foreløbigt pejlemærke).",
            },
            {
              titel: "Trin 3: Efter 1. juli — fast procenttillæg",
              tekst:
                "Betales restskatten ikke senest 1. juli året efter, erstattes dag-til-dag-renten af et fast procenttillæg — 5,7 % for indkomståret 2025, uanset hvornår du betaler herefter. Restskat op til 25.368 kr. inkl. tillæg (2025-grænsen, reguleres årligt) indregnes i næste års forskudsskat; resten opkræves i 3 rater i august, september og oktober (2026-frister: 20/8, 21/9 og 20/10).",
            },
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Hverken dag-til-dag-renten eller procenttillægget er fradragsberettiget. Frivillig indbetaling før nytår er derfor næsten altid det billigste — særligt i år med pænt virksomhedsoverskud oven i lønnen.",
        },
      ],
      kilder: [
        {
          titel: "skat.dk — Restskat: betaling, rente og procenttillæg",
          url: "https://skat.dk/en-us/individuals/tax-assessment-notice/outstanding-tax/pay-outstanding-tax",
        },
        {
          titel: "PwC — Betal restskatten inden nytår og undgå renter",
          url: "https://www.pwc.dk/da/artikler/2025/12/betal-restskatten-inden-2026-og-undgaa-renter.html",
        },
      ],
    },
    {
      id: "forskudsopgoerelsen",
      overskrift: "Forskudsopgørelsen — styr B-skatten ved kilden",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Forskudsopgørelsen er dit ratteslag: Skriver du det forventede virksomhedsoverskud i rubrik 221, opkræver Skattestyrelsen B-skat løbende, og du undgår stor restskat. Forskudsopgørelsen for 2027 forventes at åbne i TastSelv ca. 10.-12. november 2026 — det er et mønster-estimat ud fra, at 2026-udgaven åbnede 11. november 2025, og er ikke officielt annonceret endnu (ikke fuldt verificeret — tjek kilden). Ret den senest ca. 20. januar 2027, hvis ændringen skal slå igennem i januar-lønnen.",
        },
        {
          type: "tip",
          tekst:
            "Sæt en fast påmindelse medio november: åbn den nye forskudsopgørelse, opdater rubrik 221 med årets realistiske overskud, og tjek at trækprocenten på lønnen stadig passer. Ti minutter i november sparer både B-skat-bøvl og restskat-rente året efter.",
        },
      ],
      kilder: [
        {
          titel: "Skattestyrelsen — Forskudsopgørelsen for 2026 åbner 11. november",
          url: "https://sktst.dk/nyheder-og-pressemeddelelser/forskudsopgoerelsen-for-2026-aabner-den-11-november",
        },
        {
          titel: "Juridisk Vejledning A.B.4.1.2.1 — opkrævning af B-skat",
          url: "https://info.skat.dk/data.aspx?oid=2085241",
        },
      ],
    },
    {
      id: "satser-og-gebyrer",
      overskrift: "Satser og gebyrer — hvad det koster at glemme",
      blokke: [
        {
          type: "tabel",
          kolonner: ["Sats/gebyr", "Værdi", "Gælder"],
          raekker: [
            [
              "FF-afgift, moms (manglende indberetning)",
              "1.400 kr. pr. periode",
              "Fra 1. februar 2025 (forhøjet fra 800 kr.)",
            ],
            [
              "Skattetillæg, for sent oplysningsskema (normal sats)",
              "400 kr. pr. dag, maks. 10.000 kr.",
              "Fra og med indkomståret 2024",
            ],
            [
              "Skattetillæg, lav sats (indkomst under grænsen)",
              "200 kr. pr. dag, maks. 5.000 kr.",
              "Fra og med indkomståret 2024",
            ],
            [
              "Grænse for lav sats (top-/mellemskattegrænsen)",
              "611.800 kr. (indkomståret 2025) / 641.200 kr. (2026 — ikke fuldt verificeret, tjek kilden)",
              "Reguleres årligt",
            ],
            [
              "Dag-til-dag-rente, restskat 2025",
              "3,7 % p.a. (ikke fradragsberettiget)",
              "Betaling 1. januar - 1. juli 2026",
            ],
            [
              "Procenttillæg, restskat 2025",
              "5,7 % (ikke fradragsberettiget)",
              "Betaling efter 1. juli 2026",
            ],
            [
              "Indregningsgrænse, restskat",
              "25.368 kr. (2025-grænsen)",
              "Reguleres årligt",
            ],
            [
              "Skattekonto-morarente",
              "Ca. 0,95 % pr. måned i 2026 (basisrente 0,1 % + tillæg 0,85 procentpoint) — ikke fuldt verificeret, tjek kilden; 2025: ca. 0,9 %",
              "Daglig renteberegning, ikke fradragsberettiget",
            ],
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Flere 2027-tal kendes ikke endnu: dag-til-dag-rente og procenttillæg for indkomståret 2026, indregningsgrænsen for 2026 samt de officielle B-skat- og momskalendere for 2027 offentliggøres først i november-december 2026. Brug 2025/2026-værdierne som foreløbige pejlemærker, og genbekræft mod skat.dk, når de nye tal udgives — misforstået sats kan koste både rente og tillæg.",
        },
        {
          type: "tip",
          tekst:
            "Odins tommelfingerregel: Ingen af strafrenterne og tillæggene på denne side er fradragsberettigede. Én times kalenderdisciplin i november og december er derfor den bedst forrentede arbejdstime i hele regnskabsåret.",
        },
      ],
      kilder: [
        {
          titel: "skat.dk — Foreløbige fastsættelser (skattekontoen)",
          url: "https://skat.dk/en-us/businesses/payment-and-the-tax-account-skattekontoen/estimates",
        },
        {
          titel: "Juridisk Vejledning A.C.2.1.4.3.1 — skattetillæg",
          url: "https://info.skat.dk/data.aspx?oid=2284578",
        },
        {
          titel: "skat.dk — Restskat: betaling, rente og procenttillæg",
          url: "https://skat.dk/en-us/individuals/tax-assessment-notice/outstanding-tax/pay-outstanding-tax",
        },
        {
          titel: "skm.dk — Satser efter opkrævningsloven (skattekonto-rente)",
          url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/opkraevningsloven",
        },
      ],
    },
  ],
};
