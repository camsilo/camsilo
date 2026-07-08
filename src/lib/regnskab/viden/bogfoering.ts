/**
 * Viden-guide: Bogføringsloven — krav til regnskabet og til dette program.
 * Kildebelagt research pr. 2026-07-08 (bogføringsloven LOV 700/2022, BEK 297/2025,
 * BEK 205/2024, BEK 1383/2023 som ændret ved BEK 302/2025 samt Erhvervsstyrelsens
 * vejledninger). Kritiker-korrektioner er indarbejdet; uverificerede punkter er
 * markeret i teksten.
 */
import type { VidenGuide } from "./typer";

export const BOGFOERING_GUIDE: VidenGuide = {
  id: "bogfoering",
  titel: "Bogføringsloven — krav til dit regnskab (og til dette program)",
  rune: "ᛖ",
  emoji: "📚",
  intro:
    "Alfaderen gav et øje for visdom — du skal blot give dine bøger orden, så Hugin og Munin kan finde hver en krone igen. Her står, hvad bogføringsloven kræver af din enkeltmandsvirksomhed i 2026, og hvad den kræver af netop dette program. Alt er efterprøvet mod lovteksten og Erhvervsstyrelsens vejledninger.",
  opdateret: "2026-07-08",
  afsnit: [
    {
      id: "pligt-og-graense",
      overskrift: "Gælder digital bogføringspligt for dig i 2026?",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Bogføringspligten gælder alle erhvervsdrivende virksomheder etableret i Danmark — „af enhver art uanset ejer- eller hæftelsesforhold“ (bogføringslovens § 1, LOV nr. 700 af 24/05/2022). Også en enkeltmandsvirksomhed med lille omsætning er altså fuldt bogføringspligtig, og de generelle krav (§§ 5-14: registrering, transaktions- og kontrolspor, bilag, afstemning, 5 års opbevaring) har været i kraft siden 1. juli 2022. Noget andet er kravet om DIGITAL bogføring (§ 16): det gælder fra 1. januar 2026 også for personligt ejede virksomheder uden årsrapportpligt (BEK nr. 297 af 20/03/2025) — men kun hvis nettoomsætningen overstiger 300.000 kr. i hvert af to på hinanden følgende indkomstår. Erhvervsstyrelsen har oplyst, at udvidelsen omfatter ca. 118.000 personligt ejede virksomheder og foreninger.",
        },
        {
          type: "trin",
          trin: [
            {
              titel: "Opgør nettoomsætningen for 2024",
              tekst:
                "Nettoomsætning = salgsværdien af årets leverancer med fradrag af prisnedslag og moms (årsregnskabslovens bilag 1, afsnit C, nr. 13). Det er den FAKTISKE omsætning — ikke budgetteret og ikke omregnet til 12 måneder. Delår tæller som de er.",
            },
            {
              titel: "Opgør nettoomsætningen for 2025 på samme måde",
              tekst:
                "For pligt pr. 1. januar 2026 er det netop indkomstårene 2024 og 2025, der tæller — de to år umiddelbart forud. Man skal IKKE først overskride grænsen i to år efter 2026.",
            },
            {
              titel: "Sammenlign med grænsen",
              tekst:
                "Over 300.000 kr. i BEGGE år → du er omfattet af digital bogføringspligt fra 1. januar 2026 (førstkommende regnskabsår). 300.000 kr. eller derunder i bare ét af årene → du er ikke omfattet.",
            },
            {
              titel: "Gentag testen hvert år",
              tekst:
                "Vurderingen er rullende pr. indkomstår. Falder omsætningen under grænsen ét år, bortfalder pligten fra det efterfølgende indkomstår og genindtræder først efter to nye år i træk over grænsen.",
            },
          ],
        },
        {
          type: "tabel",
          kolonner: ["Situation", "Digital bogføringspligt?"],
          raekker: [
            [
              "Over 300.000 kr. i både 2024 og 2025",
              "Ja — fra 1. januar 2026",
            ],
            [
              "300.000 kr. eller derunder i mindst ét af årene",
              "Nej — papir, regneark eller eget program er lovligt",
            ],
            [
              "500.000 kr. i år 1 og 200.000 kr. i år 2",
              "Nej — der modregnes ikke mellem årene",
            ],
            [
              "Omsætningsfald under grænsen ét år (efter man er blevet omfattet)",
              "Fritaget fra det efterfølgende indkomstår; genindtræder efter to nye år i træk over grænsen",
            ],
            [
              "Nystiftet virksomhed efter 1. januar 2026",
              "Tidligst omfattet fra tredje indkomstår",
            ],
            [
              "Startet midt i året (fx 1. marts 2024)",
              "Delåret tæller med, som det er — over 300.000 kr. i både 2024 (10 mdr.) og 2025 → omfattet fra 1. januar 2026",
            ],
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Selv når du er UNDER grænsen, gælder alle bogføringslovens generelle krav: løbende registrering, bilag på alt, transaktions- og kontrolspor og 5 års opbevaring. „Lille virksomhed“ fritager kun fra kravet til selve bogføringssystemet — aldrig fra bogføringen.",
        },
      ],
      kilder: [
        {
          titel: "Bogføringsloven (LOV nr. 700 af 24/05/2022)",
          url: "https://www.retsinformation.dk/eli/lta/2022/700",
        },
        {
          titel: "BEK nr. 297 af 20/03/2025 (ikrafttræden for personligt ejede)",
          url: "https://www.retsinformation.dk/eli/lta/2025/297",
        },
        {
          titel: "Erhvervsstyrelsens vejledning om bogføringsloven",
          url: "https://erhvervsstyrelsen.dk/vejledning-bogfoeringsloven",
        },
        {
          titel: "Erhvervsstyrelsen: digital bogføring for personligt ejede pr. 1. januar 2026",
          url: "https://erhvervsstyrelsen.dk/digital-bogfoering-traeder-i-kraft-personligt-ejede-virksomheder-og-foreninger-mfl-den-1-januar",
        },
      ],
    },
    {
      id: "eget-program",
      overskrift: "Må du bogføre i dit eget hjemmelavede program?",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Ja. Loven skelner mellem registrerede standardsystemer (udbyderens ansvar; de står på Erhvervsstyrelsens offentlige fortegnelse, jf. §§ 19-20) og ikke-registrerede systemer. Kun udbydere, der markedsfører til en ubestemt kreds, kan registrere et system — et hjemmelavet program kan derfor aldrig optages på fortegnelsen og er pr. definition et „ikke-registreret digitalt bogføringssystem“. Så er det virksomhedens eget ansvar, at systemet opfylder kravene (§ 16, stk. 2, nr. 2).",
        },
        {
          type: "liste",
          punkter: [
            "Under omsætningsgrænsen: der stilles INGEN krav til selve systemet (BEK 205 § 1 afgrænser systemkravene til § 16-omfattede virksomheder). Frivillig digital bogføring udløser ikke kravene.",
            "Over grænsen: et hjemmelavet program er kun lovligt, hvis HELE kravlisten i næste afsnit er opfyldt.",
            "Excel og andre regneark regnes som MANUEL bogføring og opfylder ikke digital bogføringspligt — et hjemmelavet program med database kan derimod kvalificere.",
            "Kombinerer du et registreret standardsystem med egne apps til dele af bogføringen eller bilagsopbevaringen, behandles HELHEDEN som et ikke-registreret system.",
            "Bruger du en ekstern bogholder, er det bogholderens ansvar at anvende et lovligt digitalt system (§ 17) — dit ansvar er kun at levere alt regnskabsmateriale rettidigt.",
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Lovens definition af et digitalt bogføringssystem (§ 3, nr. 6) kræver, at systemet kan opbevare registreringer og bilag — eller som minimum en fuldstændig sikkerhedskopi heraf — på en server hos en udbyder eller anden tredjepart. Et rent lokalt program uden ekstern backup opfylder ikke engang definitionen.",
        },
      ],
      kilder: [
        {
          titel: "Erhvervsstyrelsen: ikke-registrerede digitale bogføringssystemer",
          url: "https://erhvervsstyrelsen.dk/ikke-registrerede-digitale-bogfoeringssystemer",
        },
        {
          titel: "Erhvervsstyrelsens vejledning om bogføringsloven",
          url: "https://erhvervsstyrelsen.dk/vejledning-bogfoeringsloven",
        },
        {
          titel: "Bogføringsloven §§ 3, 16-20",
          url: "https://www.retsinformation.dk/eli/lta/2022/700",
        },
      ],
    },
    {
      id: "krav-eget-system",
      overskrift: "Kravene til et ikke-registreret system (BEK 205/2024)",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Kravene her gælder KUN, når virksomheden er omfattet af digital bogføringspligt (§ 16, stk. 1) og bruger et ikke-registreret system. Overtrædelse straffes med bøde (BEK 205 § 6). Registreringsdelen (BEK nr. 205 af 29/02/2024, § 3) kræver følgende felter og automatik ved hver transaktion:",
        },
        {
          type: "tabel",
          kolonner: ["Felt", "Hvem udfylder", "Bemærkning"],
          raekker: [
            ["Transaktionsdato", "Brugeren", "Skal angives ved hver transaktion"],
            ["Beløb", "Brugeren", "Skal angives ved hver transaktion"],
            ["Bilagsnummer", "Brugeren", "Entydig henvisning til bilaget"],
            ["Transaktionstekst", "Brugeren", "Kort beskrivelse af transaktionen"],
            [
              "Valutakurs/omregningsfaktor",
              "Brugeren",
              "Kun hvis transaktionen er i andet end DKK",
            ],
            ["Registreringsdato", "Systemet automatisk", "Hvornår posteringen blev bogført"],
            [
              "Fortløbende transaktionsnummer eller -id",
              "Systemet automatisk",
              "Ubrudt nummerserie",
            ],
            [
              "Initialer/identifikation",
              "Systemet automatisk",
              "Hvilken person eller hvilket program der har bogført",
            ],
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Uforanderlighed er et kernekrav (BEK 205 § 3, stk. 3): brugere må IKKE kunne ændre, tilbagedatere eller slette bogførte transaktioner. Fejl rettes ved nye posteringer (stornering), og ændringer eller tilføjelser til bilag skal logges, så det oprindelige indhold altid kan findes frem. Et hjemmebygget system skal altså være append-only.",
        },
        {
          type: "liste",
          punkter: [
            "It-sikkerhed (lovens § 15 + BEK 205 § 4): anerkendte standarder, herunder bruger- og adgangsstyring — proportionalt med virksomhedens størrelse; for en énmandsvirksomhed vil login og fornuftig adgangskontrol række langt.",
            "Backup (BEK 205 § 4): mindst ugentlig FULD sikkerhedskopi af alle bogførte transaktioner og digitalt opbevarede bilag (medmindre intet er bogført siden sidste kopi), opbevaret hos en ikke-nærtstående tredjepart på en server i et EU-/EØS-land. En europæisk cloud-udbyder opfylder tredjepartskravet.",
            "Kopiens opbevaringstid: 5 år fra udgangen af det regnskabsår, materialet vedrører. Bemærk: 5-års-perioden står IKKE i BEK 205 § 4 — den følger af Erhvervsstyrelsens vejledning om ikke-registrerede systemer (kap. 5.1), jf. bogføringslovens § 12, stk. 1.",
            "Komprimeret eller krypteret format er efter vejledningen i orden, men data skal kunne udleveres i læsbar form efter lovens § 22 (den præcise formulering er ikke fuldt verificeret — tjek kilden).",
            "E-faktura (BEK 205 § 5, stk. 1, nr. 1-2): systemet skal automatisk kunne SENDE og MODTAGE e-faktura og kreditnota i både OIOUBL via Nemhandel og Peppol BIS — inklusive application response (OIOUBL) samt message level response og invoice response (Peppol). En PDF pr. e-mail er IKKE en e-faktura (lovens § 3, nr. 8).",
            "SAF-T (BEK 205 § 5): systemet skal kunne generere en SAF-T-fil (XML-standard defineret af Erhvervsstyrelsen) til deling med myndigheder og revisor. Der er ikke krav om at kunne indlæse filen.",
            "Bankafstemning (BEK 205 § 5): systemet skal understøtte afstemning af bogføringen med bankkontoen og tydeligt fremhæve differencer for uafstemte posteringer. Funktionen må gerne ligge i et eksternt modul.",
          ],
        },
        {
          type: "tip",
          tekst:
            "Registreringsdelen og backup er overkommelige at bygge selv — den reelle barriere er OIOUBL/Peppol-e-fakturakravet. Det kan opfyldes via integration til en ekstern e-fakturerings-leverandør eller et Nemhandel-adgangspunkt, men funktionen SKAL findes i helheden, hvis du er omfattet og bruger eget system.",
        },
      ],
      kilder: [
        {
          titel: "BEK nr. 205 af 29/02/2024 (krav til ikke-registrerede systemer)",
          url: "https://www.retsinformation.dk/eli/lta/2024/205",
        },
        {
          titel: "Erhvervsstyrelsens vejledning om ikke-registrerede digitale bogføringssystemer",
          url: "https://erhvervsstyrelsen.dk/ikke-registrerede-digitale-bogfoeringssystemer",
        },
        {
          titel: "Bogføringslovens §§ 12, 15 og 22",
          url: "https://www.retsinformation.dk/eli/lta/2022/700",
        },
      ],
    },
    {
      id: "opbevaring",
      overskrift: "Opbevaring: 5 år, betryggende og læsbart",
      blokke: [
        {
          type: "liste",
          punkter: [
            "Alt regnskabsmateriale skal opbevares i 5 år fra udgangen af det regnskabsår, det vedrører (§ 12, stk. 1) — bilag fra 2026 gemmes altså til 31. december 2031.",
            "Undtagelse: detailhandlens kassestrimler og tilsvarende interne bilag (§ 12, stk. 2).",
            "Opbevaring „på betryggende vis“ (§ 13): sikret mod ødelæggelse, bortskaffelse, forvanskning, fejl og misbrug.",
            "Der er ikke længere krav om opbevaring i Danmark.",
            "Opbevaringspligten fortsætter, selv om virksomheden lukker (§ 14).",
            "Ved kontrol skal materialet kunne udleveres vederlagsfrit i et anerkendt filformat og omregnet til danske kroner (§ 22).",
          ],
        },
        {
          type: "tabel",
          kolonner: ["Materiale/situation", "Krav til opbevaringsform"],
          raekker: [
            [
              "Virksomhed under omsætningsgrænsen",
              "Frit valg: papir eller digitalt — blot betryggende og i 5 år",
            ],
            [
              "Virksomhed over grænsen (digital bogføringspligt)",
              "Registreringer og omfattede købs-/salgsbilag skal opbevares digitalt i bogføringssystemet — eller som fuldstændig sikkerhedskopi hos tredjepart",
            ],
            [
              "Salgsfakturaer (over grænsen)",
              "Gemmes digitalt i den version, de oprindeligt blev udstedt i",
            ],
            [
              "Kassestrimler og rent fysiske bilag fra udlandet",
              "Undtaget fra kravet om digital opbevaring (BEK 1383 § 1)",
            ],
          ],
        },
        {
          type: "tip",
          tekst:
            "Gem alt digitalt fra dag ét, uanset om du er under grænsen: et foto eller en PDF af hvert bilag koblet direkte på posteringen gør både 5-års-kravet og kontrolsporet trivielt — og du er klar den dag, grænsen rammes.",
        },
      ],
      kilder: [
        {
          titel: "Bogføringslovens §§ 12-14 og 22",
          url: "https://www.retsinformation.dk/eli/lta/2022/700",
        },
        {
          titel: "Bilagsbekendtgørelsen (BEK nr. 1383 af 29/11/2023)",
          url: "https://www.retsinformation.dk/eli/lta/2023/1383",
        },
        {
          titel: "Erhvervsstyrelsens vejledning om bogføringsloven",
          url: "https://erhvervsstyrelsen.dk/vejledning-bogfoeringsloven",
        },
      ],
    },
    {
      id: "bilag-og-faktura",
      overskrift: "Gyldige bilag og fakturaens indholdskrav",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Bogføringslovens minimum gælder ALLE virksomheder (§ 9): enhver registrering skal kunne dokumenteres ved et bilag, og registreringen skal henvise til bilaget (bilagsnummer). Bilaget skal tydeligt angive transaktionsdato og beløb. Formatet er frit — PDF, foto eller papir — og eksterne bilag (fx modtagne købsfakturaer) skal foretrækkes som dokumentation, når de findes. Rettes der i et bilag, skal både det oprindelige indhold og ændringen fremgå.",
        },
        {
          type: "tabel",
          kolonner: ["Nr.", "De 6 oplysninger der udløser digital opbevaringspligt (BEK 1383 § 1 — kun over grænsen)"],
          raekker: [
            ["1", "Udstedelsesdato"],
            ["2", "Leverancens art"],
            ["3", "Beløb"],
            ["4", "Afsender og modtager: navn, adresse og CVR-/SE-nummer"],
            ["5", "Momsbeløbets størrelse"],
            ["6", "Betalingsoplysninger"],
          ],
        },
        {
          type: "tekst",
          tekst:
            "Fra 1. januar 2026 gælder den digitale bilagsopbevaringspligt også personligt ejede virksomheder omfattet af § 16 (BEK nr. 302 af 20/03/2025). Købs- og salgsbilag, der indeholder alle 6 oplysninger, SKAL ind i systemet digitalt; bilag uden alle 6 (fx momsfrie transaktioner) opbevares blot efter de almindelige regler i § 12. En momsmæssigt gyldig fuld salgsfaktura kræver derudover følgende 11 punkter (momsbekendtgørelsens § 58, stk. 1):",
        },
        {
          type: "tabel",
          kolonner: ["Nr.", "Krav til fuld faktura"],
          raekker: [
            ["1", "Udstedelsesdato — fakturadatoen må ikke tilbagedateres"],
            ["2", "Fortløbende fakturanummer"],
            ["3", "Sælgers momsregistreringsnummer (CVR-/SE-nummer)"],
            ["4", "Sælgers navn og adresse"],
            ["5", "Købers navn og adresse"],
            ["6", "Mængde og art af de leverede varer eller ydelser"],
            ["7", "Leveringsdato, hvis den afviger fra fakturadatoen"],
            ["8", "Momsgrundlag og pris pr. enhed ekskl. moms"],
            ["9", "Eventuelle prisnedslag og rabatter"],
            ["10", "Gældende momssats (25 %)"],
            ["11", "Momsbeløbet i danske kroner"],
          ],
        },
        {
          type: "liste",
          punkter: [
            "Forenklet faktura kan bruges over for momsregistrerede købere ved salg under 3.000 kr. (momsbekendtgørelsens § 66, stk. 1-2, jf. Den juridiske vejledning A.B.3.3.1.6).",
            "Ved salg af ydelser til PRIVATE kræves fuld faktura, hvis fakturabeløbet overstiger 5.000 kr. inkl. moms.",
          ],
        },
        {
          type: "tip",
          tekst:
            "Lad programmet generere alle salgsfakturaer, så de opfylder alle 11 punkter — så er de samtidig gyldige bilag efter både momsreglerne og bogføringsloven, og kontrolsporet følger med gratis.",
        },
      ],
      kilder: [
        {
          titel: "Den juridiske vejledning A.B.3.3.1.4 (fuld fakturas indhold)",
          url: "https://info.skat.dk/data.aspx?oid=2068789",
        },
        {
          titel: "Den juridiske vejledning A.B.3.3.1.6 (forenklet faktura)",
          url: "https://info.skat.dk/data.aspx?oid=2068791",
        },
        {
          titel: "Bilagsbekendtgørelsen (BEK nr. 1383 af 29/11/2023)",
          url: "https://www.retsinformation.dk/eli/lta/2023/1383",
        },
        {
          titel: "Bogføringslovens § 9",
          url: "https://www.retsinformation.dk/eli/lta/2022/700",
        },
      ],
    },
    {
      id: "spor-og-afstemning",
      overskrift: "Transaktionsspor, kontrolspor og løbende afstemning",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Transaktionssporet (§ 3, nr. 3 og § 8) er sammenhængen mellem de enkelte registreringer og regnskabet, momsangivelsen eller skatteopgørelsen — begge veje: hvert tal i opgørelsen skal kunne opløses i sine posteringer, og alle posteringer skal indgå i tallene. Kontrolsporet (§ 3, nr. 4 og § 9) er dokumentationen for registreringernes rigtighed: fra hver postering skal man kunne komme til et entydigt bilag. Tilsammen er kravet, at regnskab ↔ postering ↔ bilag kan følges begge veje — det er hele lovens kernetest ved en kontrol.",
        },
        {
          type: "liste",
          punkter: [
            "Fast kontoplan, hvor hver konto mapper entydigt til en momsrubrik eller regnskabspost — så kan systemet dokumentere, hvordan konti samles til poster i opgørelsen.",
            "Rapport pr. periode med summer pr. konto og mulighed for at folde hvert tal ud til de underliggende posteringer.",
            "Hver postering har fortløbende nummer, dato og obligatorisk reference til et bilag med entydigt bilagsnummer.",
            "Bilagsfiler kan aldrig overskrives, og efterposteringer ved årsafslutning bogføres og dokumenteres som alt andet.",
            "Løbende drift: registrér nøjagtigt og „snarest muligt“ (§ 7 — loven sætter ingen fast frekvens), bogfør i DKK, euro eller relevant fremmed valuta med gemt omregningskurs (§ 10), og hav bogføringen afstemt (fx med bankkontoen) senest på fristdagen for moms- eller skatteindberetningen (§ 11).",
            "Beskrivelse af bogføringsproceduren (§ 6) kræves kun ved årsrapportpligt eller omsætning over 300.000 kr. i to år i træk.",
          ],
        },
        {
          type: "tip",
          tekst:
            "Afstem banken, hver gang du alligevel bogfører — så er § 11 altid opfyldt, uanset hvornår moms- og skattefristerne falder, og differencer opdages, mens de stadig er nemme at finde.",
        },
      ],
      kilder: [
        {
          titel: "Bogføringslovens §§ 3 og 6-11",
          url: "https://www.retsinformation.dk/eli/lta/2022/700",
        },
        {
          titel: "Erhvervsstyrelsen om transaktions- og kontrolspor (ikke-registrerede systemer)",
          url: "https://erhvervsstyrelsen.dk/ikke-registrerede-digitale-bogfoeringssystemer",
        },
      ],
    },
    {
      id: "konsekvenser",
      overskrift: "Hvad koster det at sjuske?",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Normalreaktionen ved en kontrol er et PÅBUD fra Erhvervsstyrelsen om at rette forholdet (§ 26) — efterleves påbuddet, sker der typisk ikke mere. Styrelsen fører risikobaseret kontrol med brugere af ikke-registrerede systemer og kan kræve en revisorerklæring om systemet for virksomhedens egen regning (§§ 23-24). Lovliggøres et ikke-registreret system ikke efter påbud, kan styrelsen påbyde virksomheden at skifte til et registreret standardsystem (§ 27, stk. 1).",
        },
        {
          type: "tabel",
          kolonner: ["Overtrædelse (virksomhed med omsætning under 10 mio. kr.)", "Vejledende bøde"],
          raekker: [
            [
              "Mindre overtrædelser (fx ikke-konsekvent registrering)",
              "10.000–25.000 kr.",
            ],
            [
              "Mere omfattende (fx bogføring der ikke kan revideres)",
              "25.000–100.000 kr.",
            ],
            [
              "Særligt omfattende/skærpede (fx hovedparten af transaktioner ikke registreret, eller påbud ignoreret)",
              "100.000–250.000 kr.",
            ],
            ["Lovens absolutte maksimum (§ 33)", "Op til 1,5 mio. kr."],
          ],
        },
        {
          type: "advarsel",
          tekst:
            "At ignorere et påbud er i sig selv en „særligt omfattende overtrædelse“ med skærpet bøde til følge. Forældelsesfristen for strafansvar er 5 år (§ 33, stk. 5) — sjusk forsvinder altså ikke af sig selv.",
        },
        {
          type: "advarsel",
          tekst:
            "Ved særligt grove overtrædelser af bogføringslovgivningen kan straffelovens § 302 give bøde eller fængsel i op til 1 år og 6 måneder — 4 måneder ved grov uagtsomhed (ikke fuldt verificeret mod retsinformation, kun mod uofficiel gengivelse — tjek kilden). Derudover kan Skattestyrelsen tilsidesætte et regnskab uden holdbart transaktions- og kontrolspor og fastsætte indkomst og moms skønsmæssigt; det er gængs praksis, men den præcise lovhjemmel er ikke efterprøvet i denne research (ikke fuldt verificeret — tjek kilden).",
        },
      ],
      kilder: [
        {
          titel: "Erhvervsstyrelsen: kontrol og bødeniveauer (ikke-registrerede systemer)",
          url: "https://erhvervsstyrelsen.dk/ikke-registrerede-digitale-bogfoeringssystemer",
        },
        {
          titel: "Bogføringslovens §§ 23-27 og 33",
          url: "https://www.retsinformation.dk/eli/lta/2022/700",
        },
        {
          titel: "Straffelovens § 302 (uofficiel gengivelse)",
          url: "https://danskelove.dk/straffeloven/302",
        },
      ],
    },
    {
      id: "camsilo-tjekliste",
      overskrift: "Det betyder det for dette program (Camsilo)",
      blokke: [
        {
          type: "trin",
          trin: [
            {
              titel: "Afgør din status nu",
              tekst:
                "Var Camsilos nettoomsætning over 300.000 kr. i både 2024 og 2025? Hvis nej: programmet er fuldt lovligt som dit primære bogføringssystem i 2026 — der stilles ingen krav til softwaren, kun til bogføringens indhold (bilag, spor, afstemning, opbevaring).",
            },
            {
              titel: "Byg de billige BEK 205-egenskaber ind fra start",
              tekst:
                "Append-only posteringer med fortløbende numre og automatisk registreringsdato, obligatorisk bilagsreference på hver postering, uforanderlige bilagsfiler med ændringslog. Det koster lidt nu og gør regnskabet bevismæssigt stærkt — og fremtidssikret.",
            },
            {
              titel: "Slå automatisk backup til",
              tekst:
                "Mindst ugentlig (gerne daglig) fuld kopi af posteringer og bilag til en europæisk cloud-udbyder (ikke-nærtstående tredjepart, server i EU/EØS), gemt i 5 år fra regnskabsårets udgang.",
            },
            {
              titel: "Indbyg 300.000 kr.-vagten",
              tekst:
                "Programmet bør beregne nettoomsætning pr. indkomstår og advare, når to på hinanden følgende år begge overstiger 300.000 kr. — så ved du i god tid, at NÆSTE års bogføring skal ske i et lovligt digitalt bogføringssystem.",
            },
            {
              titel: "Læg en plan for dagen, grænsen rammes",
              tekst:
                "Fra det følgende års start skal systemet kunne sende og modtage OIOUBL/Peppol-e-faktura, generere SAF-T-eksport og understøtte bankafstemning. Planlæg enten integration til et Nemhandel-adgangspunkt/e-faktura-leverandør — eller flyt bogføringen til et registreret standardsystem.",
            },
            {
              titel: "Gem alt i 5 år — også hvis firmaet lukker",
              tekst:
                "Opbevaringspligten fortsætter efter ophør (§ 14). Sørg for, at eksport og backup overlever selve programmet.",
            },
          ],
        },
        {
          type: "tip",
          tekst:
            "Odins råd: byg reglerne ind som kode, ikke som huskesedler. Et system, der nægter at slette bogførte posteringer, selv tildeler numre og selv tager backup, kan ikke glemme — og så behøver du ikke huske.",
        },
      ],
      kilder: [
        {
          titel: "Erhvervsstyrelsens vejledning om bogføringsloven",
          url: "https://erhvervsstyrelsen.dk/vejledning-bogfoeringsloven",
        },
        {
          titel: "BEK nr. 205 af 29/02/2024",
          url: "https://www.retsinformation.dk/eli/lta/2024/205",
        },
        {
          titel: "BEK nr. 297 af 20/03/2025",
          url: "https://www.retsinformation.dk/eli/lta/2025/297",
        },
      ],
    },
  ],
};
