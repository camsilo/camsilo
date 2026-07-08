/**
 * Odins viden-base: Moms — registrering, frister, alle rubrikker i
 * momsindberetningen og klik-for-klik-navigation i TastSelv Erhverv/virk.dk.
 * Skrevet ud fra kildekritisk research (juli 2026); korrektioner fra
 * kildekritikken er indarbejdet, og uverificerede påstande er markeret.
 */

import type { VidenGuide } from "./typer";

export const MOMS_GUIDE: VidenGuide = {
  id: "moms",
  titel: "Moms — alle rubrikker og TastSelv klik for klik",
  rune: "ᛏ",
  emoji: "🏛️",
  intro:
    "Fra Hlidskjalf ser Alfaderen alle riger — og Skattestyrelsen ser alle fakturaer. Hugin og Munin har fløjet over skat.dk og lovbøgerne og båret hver rubrik, hver frist og hvert klik hjem til denne bog. Læs den, og momsen skal aldrig overraske dig.",
  opdateret: "2026-07-08",
  afsnit: [
    {
      id: "registrering",
      overskrift: "Momsregistrering — hvornår og hvordan",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Din virksomhed skal momsregistreres, når den sælger momspligtige varer og ydelser for mere end 50.000 kr. inden for ét kalenderår (1. januar til 31. december). Det er omsætningen ekskl. moms, der tæller — ikke overskuddet. Reglen blev ændret 1. januar 2025 med EU's SMV-særordning: før måltes grænsen over en rullende 12-måneders periode, nu pr. kalenderår, og tælleren nulstilles ved nytår. Ældre guides, der stadig skriver »12 måneder«, er forældede.",
        },
        {
          type: "advarsel",
          tekst:
            "Momspligten indtræder fra og med den leverance, der bringer årets omsætning over 50.000 kr. — der skal altså moms på selve den faktura, der overskrider grænsen. Og der gælder en karantæneregel: overskred du grænsen i 2025, skal du være momsregistreret i hele 2026. Anmeldelse til registrering skal ske senest 8 dage inden du påbegynder registreringspligtig virksomhed (momsloven § 47) — registrér i god tid, når du kan se, at grænsen nås.",
        },
        {
          type: "trin",
          trin: [
            {
              titel: "Gå til virk.dk",
              tekst:
                "Registreringen sker hos Erhvervsstyrelsen på virk.dk — ikke hos Skat. Har virksomheden allerede et CVR-nummer, skal du bruge selvbetjeningen »Ændre virksomhed«; har du slet intet CVR endnu, bruges »Start virksomhed«, hvor momsvalget indgår i samme flow.",
            },
            {
              titel: "Åbn »Ændre virksomhed«",
              tekst:
                "Søg »Ændre virksomhed« på virk.dk (eller gå via menuen Virksomhed → Ændre virksomhed) og klik »Start selvbetjening«.",
            },
            {
              titel: "Log på med MitID",
              tekst:
                "Som eneejer af en enkeltmandsvirksomhed kan du bruge dit private MitID (ordningen »MitID Privat til Erhverv«) — du behøver ikke MitID Erhverv, når du kan tegne virksomheden alene.",
            },
            {
              titel: "Sæt kryds ved moms og indsend",
              tekst:
                "Vælg virksomheden, sæt kryds ved momsregistrering (samme sted kan du til-/afmelde punktafgifter, import/eksport, lønsum og arbejdsgiverpligter), udfyld startdato og forventet omsætning, og indsend. Det er gratis for personligt ejede virksomheder.",
            },
            {
              titel: "Vent på Skattestyrelsens godkendelse",
              tekst:
                "Skattestyrelsen godkender momsregistreringen bagefter — der kan gå dage til uger, før den er aktiv.",
            },
          ],
        },
        {
          type: "tip",
          tekst:
            "Frivillig registrering under 50.000 kr.-grænsen er tilladt og ofte en fordel for en webvirksomhed: du får fradrag for momsen på udstyr, software og hosting. Men husk — er du først registreret, gælder alle indberetningspligter, uanset hvor lille omsætningen er.",
        },
      ],
      kilder: [
        {
          titel: "skat.dk — Sådan registrerer du din virksomhed for moms",
          url: "https://skat.dk/erhverv/moms/moms-saadan-goer-du/saadan-registrerer-du-din-virksomhed-for-moms",
        },
        {
          titel: "Den juridiske vejledning D.A.14.2.2.2 (50.000 kr.-grænsen, spejlet)",
          url: "https://www.tax.dk/jv/da/D_A_14_2_2_2.htm",
        },
        {
          titel: "Momsloven § 47 (8-dages-fristen)",
          url: "https://danskelove.dk/momsloven/47",
        },
        {
          titel: "Virk — selvbetjeningen Ændre virksomhed",
          url: "https://virk.dk/myndigheder/stat/ERST/selvbetjening/Webreg_aendre_virksomhed__lukke_virksomhed/",
        },
      ],
    },
    {
      id: "afregningsperioder",
      overskrift: "Afregningsperiode — hvor tit skal du indberette?",
      blokke: [
        {
          type: "tabel",
          kolonner: ["Afregning", "Hvem (momspligtig omsætning pr. år)"],
          raekker: [
            [
              "Halvårlig",
              "Under 5 mio. kr. — og du har indberettet og betalt til tiden",
            ],
            [
              "Kvartalsvis",
              "5–50 mio. kr. — eller nystartet virksomhed — eller eget ønske",
            ],
            ["Månedlig", "Over 50 mio. kr. — eller eget ønske"],
          ],
        },
        {
          type: "tekst",
          tekst:
            "Nystartede virksomheder sættes altid på kvartalsvis afregning (momsloven § 57). Efter typisk ca. 1½ år vurderer Skattestyrelsen omsætningen og flytter virksomheder under 5 mio. kr. til halvårlig afregning — ændringen varsles og sker pr. 1. januar. Selve 1½-års-varigheden står dog kun i revisorkilder, ikke på skat.dk (ikke fuldt verificeret — tjek kilden). En enkeltmandsvirksomhed som Camsilo vil altså typisk køre kvartal de første par år og derefter halvår.",
        },
        {
          type: "tekst",
          tekst:
            "Du kan selv anmode om kortere afregningsperioder, men aldrig længere. Ifølge researchen kan skift kun ske pr. 1. januar eller 1. juli, og valget binder i 2 år — denne detalje kunne ikke verificeres direkte i momsloven § 57 (ikke fuldt verificeret — tjek momsloven § 57, stk. 7–8 på retsinformation.dk).",
        },
      ],
      kilder: [
        {
          titel: "skat.dk — Frister: indberet og betal moms",
          url: "https://skat.dk/erhverv/moms/frister-indberet-og-betal-moms",
        },
        {
          titel: "Momsloven § 57 (afregningsperioder og frister)",
          url: "https://danskelove.dk/momsloven/57",
        },
        {
          titel: "Revisormægleren — momsfrister 2026 (1½-års-praksis)",
          url: "https://revisormaegleren.dk/momsfrister-2026-hvornaar-skal-der-indberettes-moms/",
        },
      ],
    },
    {
      id: "frister",
      overskrift: "Frister 2026–2027 — indberetning og betaling er samme dato",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Lovreglen (momsloven § 57): fristen er den 1. i den tredje måned efter periodens udløb — dvs. 1. marts og 1. september for halvår, og 1. juni, 1. september, 1. december og 1. marts for kvartaler. Falder fristen i weekend eller på en helligdag, udskydes den til førstkommende bankdag. Datoer markeret med * er afledt af lovreglen og var endnu ikke offentliggjort på skat.dk's fristside pr. juli 2026 — genverificér dem dér, når de udmeldes.",
        },
        {
          type: "tabel",
          kolonner: ["Halvårlig afregning", "Frist"],
          raekker: [
            ["2. halvår 2025 (1/7–31/12 2025)", "mandag 2. marts 2026 (1. marts er en søndag)"],
            ["1. halvår 2026 (1/1–30/6 2026)", "tirsdag 1. september 2026"],
            ["2. halvår 2026 (1/7–31/12 2026)", "mandag 1. marts 2027"],
            ["1. halvår 2027", "1. september 2027*"],
            ["2. halvår 2027", "1. marts 2028*"],
          ],
        },
        {
          type: "tabel",
          kolonner: ["Kvartalsvis afregning", "Frist"],
          raekker: [
            ["4. kvartal 2025", "mandag 2. marts 2026"],
            ["1. kvartal 2026", "mandag 1. juni 2026"],
            ["2. kvartal 2026", "tirsdag 1. september 2026"],
            ["3. kvartal 2026", "tirsdag 1. december 2026"],
            ["4. kvartal 2026", "mandag 1. marts 2027"],
            ["1. kvartal 2027", "1. juni 2027*"],
            ["2. kvartal 2027", "1. september 2027*"],
            ["3. kvartal 2027", "1. december 2027*"],
            ["4. kvartal 2027", "1. marts 2028*"],
          ],
        },
        {
          type: "tekst",
          tekst:
            "Månedlig afregning (kun over 50 mio. kr. i omsætning — næppe relevant her): frist den 25. i den efterfølgende måned, med særfrister omkring årsskifte og sommer, fx december 2025 → 26. januar 2026 og juni 2026 → 17. august 2026 (sommer-særfristen følger lovreglen, men blev ikke set direkte på skat.dk's fristside — ikke fuldt verificeret, tjek kilden).",
        },
        {
          type: "tip",
          tekst:
            "Man kan indberette fra periodens første dag og helt frem til fristen. Læg indberetningen tidligt i fristmåneden — så er der luft til at rette fejl, og betalingen kan stadig times til fristdagen.",
        },
      ],
      kilder: [
        {
          titel: "skat.dk — Frister: indberet og betal moms",
          url: "https://skat.dk/erhverv/moms/frister-indberet-og-betal-moms",
        },
        {
          titel: "Momsloven § 57 (fristreglen)",
          url: "https://danskelove.dk/momsloven/57",
        },
      ],
    },
    {
      id: "rubrikker-momsbeloeb",
      overskrift: "Rubrikkerne, del 1: momsbeløb (øverste del af indberetningen)",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Momsindberetningen i TastSelv Erhverv har to dele: momsbeløb øverst og værdifelter (rubrik A, B og C) nederst. Her er alle felter i den øverste del, i den rækkefølge de optræder — med hvad en webvirksomhed som Camsilo typisk skal skrive.",
        },
        {
          type: "tabel",
          kolonner: ["Felt", "Hvad skriver du", "Typisk for Camsilo"],
          raekker: [
            [
              "Salgsmoms (udgående moms)",
              "Momsen opkrævet på dine salg i perioden — 25 % oven i prisen på alle danske kundefakturaer",
              "Summen af moms på periodens fakturaer",
            ],
            [
              "Moms af varekøb i udlandet",
              "Selvberegnet 25 % af varekøb i EU (25 % af rubrik A-varer) plus importmoms fra fortoldningen for varer fra lande uden for EU",
              "0 — et webbureau køber sjældent varer i udlandet",
            ],
            [
              "Moms af ydelseskøb i udlandet med omvendt betalingspligt",
              "Selvberegnet 25 % af fakturaværdien af ydelser købt i udlandet — både EU og fx USA",
              "25 % af Adobe-, GitHub-, hosting- og SaaS-fakturaer fra udlandet",
            ],
            [
              "Købsmoms (indgående moms)",
              "Moms på fradragsberettigede køb: dansk moms på udstyr, software, telefon, revisor m.m. PLUS de selvberegnede beløb fra de to felter ovenfor (når købet vedrører momspligtig aktivitet)",
              "Dansk købsmoms + reverse charge-momsen",
            ],
            [
              "Olie- og flaskegasafgift",
              "Godtgørelse af energiafgift fra købsfakturaer, afhængigt af anvendelse",
              "0",
            ],
            [
              "Elafgift",
              "Delvis/hel godtgørelse af elafgift ved erhvervsmæssigt elforbrug — kræver bl.a. at elregningen er virksomhedens (satser og betingelser i Den juridiske vejledning)",
              "0 — privat elregning på hjemmekontor giver normalt ikke godtgørelse (ikke fuldt verificeret — tjek kilden)",
            ],
            [
              "Naturgas- og bygasafgift",
              "Som elafgift, blot for gas",
              "0",
            ],
            ["Kulafgift", "Som ovenfor, for kul", "0"],
            [
              "CO2-afgift",
              "Som hovedregel INTET fradrag (særregler for energitunge processer)",
              "0",
            ],
            [
              "Vandafgift",
              "Vandafgift kan fratrækkes, hvis vandet er brugt i den momspligtige virksomhed",
              "0",
            ],
            [
              "Moms i alt",
              "Beregnes automatisk. Positivt beløb = du skal betale; negativt = du har penge til gode",
              "—",
            ],
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Felterne Salgsmoms og Købsmoms skal ALTID udfyldes — også med 0. Efterlader du dem tomme, kan indberetningen ikke godkendes. Og der skal indberettes hver eneste periode, også helt uden aktivitet (nulindberetning) — ellers laver Skattestyrelsen en foreløbig fastsættelse med en afgift på 1.400 kr.",
        },
      ],
      kilder: [
        {
          titel: "Skats officielle hjælpetekster til momsangivelsen (PDF)",
          url: "https://www.dst.dk/ext/5437448703/0/konjstat/momsangivelsen-hjaelpetekster--pdf",
        },
        {
          titel: "skat.dk — Reporting your international trade (rubrikkernes struktur)",
          url: "https://skat.dk/en-us/businesses/vat/vat-on-international-trade/reporting-your-international-trade",
        },
        {
          titel: "skat.dk — Sådan laver du din virksomheds momsregnskab",
          url: "https://skat.dk/erhverv/moms/moms-saadan-goer-du/saadan-laver-du-din-virksomheds-momsregnskab",
        },
      ],
    },
    {
      id: "rubrikker-vaerdifelter",
      overskrift: "Rubrikkerne, del 2: værdifelter A, B og C (beløb uden moms)",
      blokke: [
        {
          type: "tabel",
          kolonner: ["Rubrik", "Hvad skriver du", "Typisk for Camsilo"],
          raekker: [
            [
              "Rubrik A — varer",
              "Værdien uden moms af varekøb fra momsregistrerede virksomheder i andre EU-lande (aldrig lande uden for EU)",
              "0",
            ],
            [
              "Rubrik A — ydelser",
              "Værdien uden moms af ydelseskøb fra momsregistrerede virksomheder i andre EU-lande, som du beregner erhvervelsesmoms af",
              "Adobe (Irland), EU-hosting m.m. — IKKE amerikanske leverandører",
            ],
            [
              "Rubrik B — varer (indberettes til »EU-salg uden moms«)",
              "Fakturaværdi af varer solgt momsfrit til virksomheder i andre EU-lande — skal OGSÅ specificeres i systemet »EU-salg uden moms«",
              "0",
            ],
            [
              "Rubrik B — varer (indberettes ikke til »EU-salg uden moms«)",
              "Fjernsalg, installation/montage og nye transportmidler til ikke-momsregistrerede kunder i EU",
              "0",
            ],
            [
              "Rubrik B — ydelser",
              "Fakturaværdi af ydelser solgt momsfrit med omvendt betalingspligt til momsregistrerede virksomheder i andre EU-lande — skal OGSÅ indberettes i »EU-salg uden moms« (undtagelser: fast ejendom, personbefordring, restauration, korttidsudlejning af transportmidler)",
              "Kun ved EU-erhvervskunder",
            ],
            [
              "Rubrik C",
              "Opsamlingsfelt: værdien af andre varer/ydelser leveret uden moms i DK, EU og uden for EU — fx dokumenteret eksport ud af EU og ydelser til kunder uden for EU, som ikke hører i B-rubrikkerne",
              "Kun hvis du fakturerer fx en norsk eller amerikansk kunde uden moms",
            ],
          ],
        },
        {
          type: "tip",
          tekst:
            "En rent dansk webvirksomhed uden udenlandske kunder, men med udenlandske software-abonnementer, udfylder typisk kun fire ting: Salgsmoms, Moms af ydelseskøb i udlandet, Købsmoms og Rubrik A-ydelser — og 0 eller tomt i alt andet.",
        },
        {
          type: "tekst",
          tekst:
            "De præcise skærm-labels i TastSelv Erhverv kan afvige en anelse fra navnene her (strukturen er fastlagt i momsbekendtgørelsen, men Skat migrerer systemet løbende). Felter markeret med rød stjerne er obligatoriske, og de blå spørgsmålstegn åbner Skats egne hjælpetekster.",
        },
      ],
      kilder: [
        {
          titel: "Skats officielle hjælpetekster til momsangivelsen (PDF)",
          url: "https://www.dst.dk/ext/5437448703/0/konjstat/momsangivelsen-hjaelpetekster--pdf",
        },
        {
          titel: "skat.dk — Reporting your international trade",
          url: "https://skat.dk/en-us/businesses/vat/vat-on-international-trade/reporting-your-international-trade",
        },
      ],
    },
    {
      id: "udland",
      overskrift: "Handel med udlandet — omvendt betalingspligt, EU-salg og OSS",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Når du køber ydelser eller software i udlandet, lægger sælgeren ikke moms på — forudsat du har opgivet dit danske momsnummer (DK + CVR) i fx Adobes og GitHubs faktureringsindstillinger. Gør det altid. I stedet beregner du selv 25 % dansk moms (omvendt betalingspligt), og ved fuld fradragsret trækker du samme beløb fra igen i købsmomsen, så nettovirkningen er 0 kr. — men indberetningen er lovpligtig alligevel.",
        },
        {
          type: "liste",
          punkter: [
            "Eksempel, EU-køb — Adobe faktureret fra Irland, 745 kr. ekskl. moms: beregnet moms 745 × 25 % = 186,25 kr. Skriv 186,25 kr. i »Moms af ydelseskøb i udlandet med omvendt betalingspligt«, 186,25 kr. i »Købsmoms« og 745 kr. i »Rubrik A — ydelser«. Nettovirkning: 0 kr.",
            "Eksempel, køb uden for EU — GitHub faktureret fra USA, 300 kr.: samme øvelse med 75 kr. i begge momsfelter — men INTET i rubrik A, for rubrik A er kun for EU-køb.",
            "Varer fra lande uden for EU: importmomsen fra fortoldningen/importspecifikationen skrives i »Moms af varekøb i udlandet« — heller ikke i rubrik A.",
            "Bogføringsteknisk: postér både en udgående reverse charge-moms og en tilsvarende indgående moms på købet (to modposter), så begge felter kan summeres automatisk.",
            "Faktura-tjek: EU-fakturaer skal bære dit momsnummer og typisk teksten »Reverse charge«.",
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Har en udenlandsk leverandør fejlagtigt opkrævet udenlandsk (eller dansk) moms, kan den IKKE trækkes fra som dansk købsmoms. Bed om en korrekt reverse charge-faktura i stedet — ellers er momsbeløbet tabt.",
        },
        {
          type: "tekst",
          tekst:
            "Salg til udlandet: B2B til en EU-virksomhed med gyldigt momsnummer (validér i VIES) faktureres uden moms med teksten »Reverse charge« og kundens momsnummer; beløbet skrives i rubrik B-ydelser OG specificeres pr. kunde-momsnummer i det separate system »EU-salg uden moms« — som hovedregel månedligt, senest den 25. i måneden efter. Muligheden for at skifte til kvartalsvis frekvens, og at perioder helt uden EU-salg ikke skal indberettes, er ikke fuldt verificeret — tjek kilden. Kunder uden for EU (fx Norge, USA) faktureres som hovedregel uden dansk moms, og beløbet skrives i rubrik C.",
        },
        {
          type: "tekst",
          tekst:
            "Sælger du digitale ydelser til PRIVATE forbrugere i andre EU-lande, gælder en EU-fælles bagatelgrænse på 10.000 EUR pr. kalenderår (samlet B2C-fjernsalg + elektroniske ydelser til hele EU): under grænsen må du bruge dansk moms, over den skal kundelandets moms afregnes — i praksis via Moms One Stop Shop. At OSS-indberetningen er kvartalsvis, er ikke fuldt verificeret — tjek kilden.",
        },
      ],
      kilder: [
        {
          titel: "skat.dk — Purchases of goods and services in the EU",
          url: "https://skat.dk/en-us/businesses/vat/vat-on-international-trade/vat-on-sales-to-businesses/trading-with-eu-countries/purchases-of-goods-and-services-in-the-eu",
        },
        {
          titel: "skat.dk — Buying goods and services outside the EU",
          url: "https://skat.dk/en-us/businesses/vat/vat-on-international-trade/vat-on-sales-to-businesses/trading-with-non-eu-countries/buying-goods-and-services-in-countries-outside-the-eu",
        },
        {
          titel: "skat.dk — Sale of goods and services in the EU",
          url: "https://skat.dk/en-us/businesses/vat/vat-on-international-trade/vat-on-sales-to-businesses/trading-with-eu-countries/sale-of-goods-and-services-in-the-eu",
        },
        {
          titel: "skat.dk — Sales to private consumers in the EU (OSS)",
          url: "https://skat.dk/en-us/businesses/vat/vat-on-international-trade/vat-on-sales-to-private-individuals/sales-to-private-consumers-in-the-eu",
        },
      ],
    },
    {
      id: "tastselv-indberetning",
      overskrift: "TastSelv Erhverv klik for klik — log ind og indberet",
      blokke: [
        {
          type: "trin",
          trin: [
            {
              titel: "Log på",
              tekst:
                "Gå til skat.dk → klik »Log på« øverst til højre → vælg »Log på som erhverv« (ikke Borger) → vælg »Log på som erhverv med MitID« og gennemfør MitID-login. Alternativ: »Log på med TastSelv-kode« (CVR-/SE-nummer + kode; koden bestilles under Hjælp til TastSelv Erhverv og sendes med fysisk post — det præcise undersidenavn for bestillingen er ikke fuldt verificeret, tjek kilden). Du lander på forsiden af det nye TastSelv Erhverv (ntse.skat.dk/ntse-front/forside).",
            },
            {
              titel: "Vælg »Moms« i menuen",
              tekst: "På forsiden af TastSelv Erhverv vælger du menupunktet »Moms«.",
            },
            {
              titel: "Vælg »Momsindberetning« → »Indberet moms«",
              tekst:
                "Du ser nu listen over dine momsperioder med status og frister.",
            },
            {
              titel: "Klik »Indberet moms« ud for den åbne periode",
              tekst:
                "Har du haft NUL aktivitet i perioden, kan du i stedet klikke »Nulindberet« ud for perioden — så udfyldes alle felter automatisk med 0, og du skal blot godkende.",
            },
            {
              titel: "Udfyld eller bekræft kontaktoplysninger",
              tekst: "Systemet beder først om dine kontaktoplysninger.",
            },
            {
              titel: "Udfyld rubrikkerne",
              tekst:
                "Alle felter med rød stjerne er obligatoriske (salgsmoms og købsmoms skal udfyldes, evt. med 0); blå spørgsmålstegn åbner hjælpetekster. Se rubrik-afsnittene ovenfor for, hvad der skal stå hvor. Indberetningen kan gemmes som kladde undervejs.",
            },
            {
              titel: "Klik »Godkend« nederst",
              tekst:
                "Kvitteringen vises med beløbet til betaling eller udbetaling — og med betalingslinjen til netbank.",
            },
            {
              titel: "Find tidligere kvitteringer",
              tekst:
                "Moms → Momsindberetning → »Se tidligere indberetninger« → klik øje-ikonet i kolonnen »Vis«.",
            },
          ],
        },
        {
          type: "tekst",
          tekst:
            "MitID privat kontra MitID Erhverv: som eneejer, der kan tegne virksomheden alene, bruger du dit private MitID til både TastSelv Erhverv og virk.dk — du skal ikke oprette noget. MitID Erhverv er kun nødvendigt, hvis andre end dig skal handle digitalt for virksomheden. Skal en revisor eller bogholder have adgang, kan det klares med Skats egen autorisation: »Giv andre adgang til TastSelv Erhverv«. Husk skillelinjen: virksomhedens moms køres i TastSelv Erhverv, mens din forskudsopgørelse og årsopgørelse (inkl. virksomhedens overskud) køres i TastSelv Borger — begge med samme private MitID.",
        },
        {
          type: "tekst",
          tekst:
            "Forbehold: Skat har migreret TastSelv Erhverv til nyt system (ntse.skat.dk), og menupunkternes præcise navne bag login (fx »Se din Skattekonto« og »Udbetalingsgrænse«) kan ikke verificeres uden virksomheds-login — brug klikvejene som vejledning, ikke som skærmbillede-facit (ikke fuldt verificeret — tjek kilden).",
        },
      ],
      kilder: [
        {
          titel: "skat.dk — Sådan indberetter du moms (officiel trin-for-trin)",
          url: "https://skat.dk/erhverv/moms/moms-saadan-goer-du/saadan-indberetter-du-moms",
        },
        {
          titel: "skat.dk — Hjælp til TastSelv Erhverv (login og adgang)",
          url: "https://skat.dk/erhverv/hjaelp-til-tastselv-erhverv",
        },
        {
          titel: "skat.dk — How you log on to E-tax for businesses (privat MitID)",
          url: "https://skat.dk/en-us/businesses/e-tax-for-businesses/how-you-log-on-to-e-tax-for-businesses",
        },
        {
          titel: "MitID Erhverv — enkeltmandsvirksomheder",
          url: "https://mitid-erhverv.dk/tilslutning/sadan-far-i-mitid-erhverv/enkeltmandsvirksomheder/",
        },
      ],
    },
    {
      id: "betaling",
      overskrift: "Betaling, Skattekontoen og udbetalingsgrænsen",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Sidste rettidige betalingsdag er samme dato som indberetningsfristen. Al betaling går ind på virksomhedens Skattekonto — én samlet mellemregningskonto hos Skattestyrelsen for moms, skatter, afgifter og gebyrer. Du finder den i TastSelv Erhverv via »Se din Skattekonto«: negativt beløb i kontoudtoget betyder, at du skylder; positivt, at du har penge til gode.",
        },
        {
          type: "liste",
          punkter: [
            "Netbank med betalingslinje (mest almindelig): kopiér HELE betalingslinjen fra kvitteringen (afsnittet »Betalingslinje til netbank«) ind i netbankens indbetalingskort-funktion. Linjen er fast for virksomheden og kan altid findes igen under Skattekontoen → »Stamoplysninger«.",
            "Dankort/Visa-Dankort direkte i TastSelv Erhverv — valgfrit beløb, maks. 100.000 kr.",
            "MobilePay via TastSelv Erhverv — betalingen trækkes dags dato.",
            "Leverandørservice (anbefalet af Skat): automatisk træk ved hver frist — tilmeld én gang og slip for 5-hverdages-reglen.",
            "Udenlandsk bankkonto: overførsel til Skats IBAN/SWIFT med CVR-/SE-nummer i meddelelsesfeltet.",
            "Betalingsservice kan derimod KUN bruges til grundskyld/dækningsafgift — ikke til moms.",
          ],
        },
        {
          type: "advarsel",
          tekst:
            "5-hverdages-reglen: betal tidligst 5 hverdage før fristen. Betaler du tidligere, står pengene som tilgodehavende og bliver automatisk betalt tilbage til virksomhedens NemKonto, hvis de overstiger udbetalingsgrænsen. Udbetalingsgrænsen er som standard 0 kr. (alt tilgodehavende over 200 kr. udbetales automatisk inden for 5 hverdage) og kan sættes op til maksimalt 200.000 kr. under menupunktet »Udbetalingsgrænse« på Skattekontoen. Vil du betale tidligt, så hæv grænsen først.",
        },
        {
          type: "tekst",
          tekst:
            "Negativ moms (fx efter store udstyrskøb) udbetales som udgangspunkt til NemKonto inden for ca. 3 uger efter indberetningen, hvis alle indberetninger er ajour og der ikke er gæld (ikke fuldt verificeret — tjek kilden). Kreditrenten på positiv saldo er 0 %, mens negativ saldo forrentes — så betal til tiden, men ikke for tidligt.",
        },
      ],
      kilder: [
        {
          titel: "skat.dk — Sådan betaler du moms",
          url: "https://skat.dk/erhverv/moms/moms-saadan-goer-du/saadan-betaler-du-moms",
        },
        {
          titel: "skat.dk — Betaling til Skattekontoen",
          url: "https://skat.dk/erhverv/betaling-og-skattekonto/betaling-til-skattekontoen",
        },
        {
          titel: "skat.dk — Skattekontoen",
          url: "https://skat.dk/erhverv/betaling-og-skattekonto/skattekontoen",
        },
        {
          titel: "Virk — Udbetalingsgrænse på Skattekontoen",
          url: "https://virk.dk/myndigheder/stat/SKST/selvbetjening/Udbetalingsgraense_paa_Skattekontoen/",
        },
      ],
    },
    {
      id: "for-sent",
      overskrift: "Glemt fristen? Foreløbig fastsættelse, afgift og renter",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Indberetter du ikke til tiden, skønner Skattestyrelsen din moms — en foreløbig fastsættelse (FF) — og opkræver en afgift oveni. FF'en forsvinder ikke af sig selv: du skal selv erstatte skønnet med en rigtig indberetning i TastSelv Erhverv, og afgiften står ved magt, selv om det korrekte tal var 0 kr.",
        },
        {
          type: "advarsel",
          tekst:
            "Afgiften er 1.400 kr. pr. periode (sats siden 1. februar 2025, hævet fra 800 kr. ved lov nr. 16 af 14/01/2025 — ældre kilder med 800 kr. er forældede). Gentagne foreløbige fastsættelser kan i sidste ende føre til tvangsafmelding af momsregistreringen. En glemt nulindberetning koster altså 1.400 kr. for ingenting.",
        },
        {
          type: "tekst",
          tekst:
            "Rente ved for sen betaling (Skattekontoen, 2026-regler): fra 1. januar 2026 beregnes simpel rente (ingen renters rente) på debetsaldoen med basisrenten plus et tillæg på 0,85 procentpoint pr. påbegyndt måned — samlet 0,95 % pr. påbegyndt måned i 2026, svarende til 11,40 % p.a. Renten er IKKE fradragsberettiget. Bemærk at 2025 fulgte de gamle regler: renters rente og et tillæg på 0,70 procentpoint. Den samlede 2026-sats på 0,95 % stammer fra revisorkilder (ikke fuldt verificeret — tjek den officielle satsmeddelelse i Den juridiske vejledning A.B.4.7.2, før den bruges i beregninger).",
        },
        {
          type: "tip",
          tekst:
            "Sæt en fast påmindelse for HVER momsperiode — også perioder helt uden bilag. Nulindberetningen tager under et minut med »Nulindberet«-knappen, og den sparer dig 1.400 kr. plus renter hver gang. Lad regnskabsprogrammet holde satser og frister i en konfiguration med årstal — de ændrer sig.",
        },
      ],
      kilder: [
        {
          titel: "skat.dk — Estimates (foreløbige fastsættelser, 1.400 kr.)",
          url: "https://skat.dk/en-us/businesses/payment-and-the-tax-account-skattekontoen/estimates",
        },
        {
          titel: "Den juridiske vejledning A.B.4.7.2 (rente på Skattekontoen)",
          url: "https://info.skat.dk/data.aspx?oid=2168585",
        },
        {
          titel: "FDR — Simpel rente på Skattekontoen fra årsskiftet 2025/2026",
          url: "https://fdr.dk/simpel-rente-paa-skattekontoen-fra-aarsskiftet-2025-2026/",
        },
        {
          titel: "Redmark — Slut med renters rente på Skattekontoen (0,95 %/md., 11,40 % p.a.)",
          url: "https://redmark.dk/nyheder/skat/slut-med-renters-rente-paa-skattekontoen/",
        },
      ],
    },
  ],
};
