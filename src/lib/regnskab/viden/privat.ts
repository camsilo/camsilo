/**
 * Odins viden-guide: privat skat og fradrag for enkeltmandsvirksomhedsejeren
 * med lønjob ved siden af. Alle satser er 2026-tal, kildekritisk efterprøvet
 * 2026-07-08. Punkter markeret »ikke fuldt verificeret« kunne ikke bekræftes
 * direkte på en officiel side i kontrollen — tjek kilden før du stoler blindt.
 */
import type { VidenGuide } from "./typer";

export const PRIVAT_GUIDE: VidenGuide = {
  id: "privat",
  rune: "ᛚ",
  emoji: "🏠",
  titel: "Din private skat — fradrag du selv skal huske",
  opdateret: "2026-07-08",
  intro:
    "Alfaderen gav et øje for visdom — giv du kun Skat det, loven kræver, og ikke en krone mere. Mine ravne har gransket årsopgørelsens rubrikker og hjembragt de fradrag, ingen indberetter for dig: kørsel, håndværkere, private lån og sideindkomst. Alle satser er 2026-tal, efterprøvet mod bøgerne den 8. juli 2026.",
  afsnit: [
    {
      id: "automatiske-fradrag",
      overskrift: "De automatiske fradrag 2026 — dem skal du kun kontrollere",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Disse fradrag beregner Skattestyrelsen helt selv — både af din løn og af overskuddet fra din enkeltmandsvirksomhed. Du skal intet indtaste, men det er klogt at kende beløbene, så du kan se, om årsopgørelsen ser rigtig ud.",
        },
        {
          type: "tabel",
          kolonner: ["Fradrag", "Sats/beløb 2026", "Handling"],
          raekker: [
            ["Personfradrag", "54.100 kr. (51.600 kr. i 2025)", "Automatisk"],
            [
              "Beskæftigelsesfradrag",
              "12,75 % af arbejdsindkomst, maks. 63.300 kr.",
              "Automatisk — beregnes af både løn og virksomhedsoverskud",
            ],
            [
              "Jobfradrag",
              "4,50 % af arbejdsindkomst over 235.200 kr., maks. 3.100 kr.",
              "Automatisk",
            ],
            [
              "Ekstra beskæftigelsesfradrag, enlige forsørgere",
              "11,50 %, maks. 50.600 kr.",
              "Automatisk — kræver at du modtager ekstra børnetilskud",
            ],
            [
              "Ekstra beskæftigelsesfradrag, seniorer",
              "Op til 6.100 kr. tæt på pensionsalderen",
              "Automatisk",
            ],
          ],
        },
        {
          type: "tekst",
          tekst:
            "Nyt i 2026: topskatten er delt i tre trin. Mellemskat på 7,5 % betales af indkomst over 641.200 kr., topskat på i alt 15 % af indkomst over 777.900 kr. (begge efter AM-bidrag), og oveni kommer en ny »toptopskat« på yderligere 5 procentpoint for meget høje indkomster — grænsen ligger i millionklassen (ikke fuldt verificeret — tjek kilden). Alt beregnes automatisk.",
        },
        {
          type: "tip",
          tekst:
            "Beskæftigelsesfradraget steg kraftigt fra 55.600 kr. i 2025 til 63.300 kr. i 2026, og det beregnes også af Camsilos overskud. Jo mere overskud du tager ud som personlig indkomst, jo mere af fradraget udnytter du — helt uden at løfte en finger.",
        },
      ],
      kilder: [
        {
          titel: "Skattestyrelsen — beskæftigelses- og jobfradrag",
          url: "https://skat.dk/en-us/individuals/deductions-and-allowances/deductions-and-allowances-when-working/employment-and-job-allowances",
        },
        {
          titel: "Skatteministeriet — beløbsgrænser efter personskattelovens § 20 (2025-2026)",
          url: "https://skm.dk/tal-og-metode/satser/regulering-af-beloebsgraenser/beloebsgraenser-i-skattelovgivningen-der-reguleres-efter-personskattelovens-20-2025-2026",
        },
      ],
    },
    {
      id: "koerselsfradrag",
      overskrift: "Kørselsfradrag (rubrik 51) — det største fradrag, folk glemmer",
      blokke: [
        {
          type: "advarsel",
          tekst:
            "Kørselsfradraget overføres ALDRIG automatisk til årsopgørelsen — heller ikke fra forskudsopgørelsen. Skat kender ikke dine faktiske arbejdsdage og hjemmearbejdsdage, så du skal selv opgøre og indtaste det i rubrik 51 hvert eneste år. Glemmer du det, mister du fradraget.",
        },
        {
          type: "tabel",
          kolonner: ["Daglig transport (hjem-arbejde-hjem)", "Sats 2026"],
          raekker: [
            ["0-24 km", "0 kr. — de første 24 km giver aldrig fradrag"],
            ["25-120 km", "2,28 kr. pr. km (2,23 kr. i 2025)"],
            ["Over 120 km", "1,14 kr. pr. km"],
            [
              "Over 120 km, udpegede yderkommuner",
              "2,28 kr. pr. km hele vejen",
            ],
          ],
        },
        {
          type: "liste",
          punkter: [
            "Fradraget gælder uanset transportmiddel — bil, tog, bus, samkørsel og cykel tæller ens.",
            "Det kræver over 12 km hver vej (over 24 km i alt pr. dag), før der overhovedet er fradrag.",
            "Lavindkomst-tillæg: op til 30.800 kr. ekstra i 2026. Fuldt tillæg ved indkomst op til 341.500 kr., aftrappes til 0 ved 391.500 kr. — beregnes automatisk, NÅR du har udfyldt rubrik 51.",
            "Broafgift giver et ekstra fast fradrag pr. passage oveni kilometersatsen.",
          ],
        },
        {
          type: "trin",
          trin: [
            {
              titel: "Opgør dine faktiske arbejdsdage",
              tekst:
                "Tæl kun dage, hvor du reelt kørte til arbejdspladsen. Træk hjemmearbejdsdage, ferie, sygedage og helligdage fra.",
            },
            {
              titel: "Mål afstanden",
              tekst:
                "Find den normale transportvej hjem-arbejde i km. Fradraget beregnes af den samlede daglige afstand minus de første 24 km.",
            },
            {
              titel: "Brug Skats beregner",
              tekst:
                "Gå til skat.dk/borger/fradrag/koerselsfradrag/beregn-dit-koerselsfradrag og lad beregneren regne beløbet ud for dig.",
            },
            {
              titel: "Skriv beløbet i rubrik 51",
              tekst:
                "Log på TastSelv på skat.dk og indtast det samlede fradrag i rubrik 51 på årsopgørelsen. Gentag hvert år — tallet ruller ikke med automatisk.",
            },
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Forveksl ikke det private befordringsfradrag med skattefri kørselsgodtgørelse for erhvervskørsel i Camsilo. Erhvervskørsel i egen bil kan godtgøres med 3,94 kr. pr. km op til 20.000 km/år og 2,28 kr. derover (2026); egen cykel, knallert eller el-løbehjul 0,64 kr. pr. km. Samme kilometer må aldrig tælles begge steder.",
        },
      ],
      kilder: [
        {
          titel: "Skat.dk — kørselsfradrag",
          url: "https://skat.dk/borger/fradrag/koerselsfradrag",
        },
        {
          titel: "Skattestyrelsen — højere fradrag til pendlerne i 2026",
          url: "https://sktst.dk/nyheder-og-pressemeddelelser/hoejere-fradrag-til-pendlerne-i-2026",
        },
        {
          titel: "Skat.dk — deduction for transport between home and work",
          url: "https://skat.dk/en-us/individuals/deductions-and-allowances/deduction-for-transport/deduction-for-transport-between-home-and-work",
        },
        {
          titel: "Skat.dk — beregn dit kørselsfradrag",
          url: "https://skat.dk/borger/fradrag/koerselsfradrag/beregn-dit-koerselsfradrag",
        },
      ],
    },
    {
      id: "service-haandvaerker",
      overskrift: "Service- og håndværkerfradrag (felt 461 og 460)",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Begge fradrag findes i 2026 og skal indtastes af dig selv. Håndværkerfradraget blev genindført 1. januar 2025 i en grøn version, der kun dækker energiforbedrende arbejde. Fradragsværdien er ca. 26 % som ligningsmæssigt fradrag.",
        },
        {
          type: "tabel",
          kolonner: ["Fradrag", "Loft pr. person 2026", "Felt", "Omfatter"],
          raekker: [
            [
              "Servicefradrag",
              "18.300 kr.",
              "461",
              "Rengøring, vinduespudsning, børnepasning, almindeligt havearbejde m.m. i hjemmet",
            ],
            [
              "Håndværkerfradrag (grøn istandsættelse)",
              "9.000 kr.",
              "460",
              "Udskiftning af vinduer/døre, isolering af tag, varmepumper, solceller m.m.",
            ],
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Tre krav, der koster hele fradraget at misse: 1) Betalingen SKAL ske elektronisk — kontant betaling giver 0 kr. i fradrag. 2) Der gives kun fradrag for arbejdsløn inkl. moms — aldrig materialer, så fakturaen skal have arbejdslønnen specificeret. 3) Arbejde udført i 2026 skal være betalt senest 28. februar 2027 for at høre til 2026.",
        },
        {
          type: "trin",
          trin: [
            {
              titel: "Betal elektronisk",
              tekst:
                "Brug bankoverførsel, betalingskort eller MobilePay til virksomhedens erhvervskonto — aldrig kontanter.",
            },
            {
              titel: "Gem fakturaen",
              tekst:
                "Fakturaen skal vise arbejdslønnen som separat post. Gem den som dokumentation, hvis Skat spørger.",
            },
            {
              titel: "Indtast fradraget selv",
              tekst:
                "Log på TastSelv og skriv arbejdslønnen i felt 461 (service) eller felt 460 (grøn istandsættelse) på årsopgørelsen.",
            },
            {
              titel: "Overhold betalingsfristen",
              tekst:
                "Betal senest 28. februar 2027 for arbejde udført i 2026 — så henføres fradraget til 2026.",
            },
          ],
        },
        {
          type: "tip",
          tekst:
            "Ægtefæller og samlevere har hvert sit loft. Får I lavet et større grønt projekt, så del regningen mellem jer og udnyt op til 2 x 9.000 kr. i håndværkerfradrag og 2 x 18.300 kr. i servicefradrag.",
        },
      ],
      kilder: [
        {
          titel: "Skat.dk — generelle betingelser for service- og håndværkerfradrag",
          url: "https://skat.dk/en-us/individuals/deductions-and-allowances/home-improvement-and-household-services/general-terms",
        },
        {
          titel: "Skat.dk — household services (servicefradrag)",
          url: "https://skat.dk/en-us/individuals/deductions-and-allowances/home-improvement-and-household-services/household-services",
        },
        {
          titel: "Skat.dk — home improvement services (håndværkerfradrag)",
          url: "https://skat.dk/en-us/individuals/deductions-and-allowances/home-improvement-and-household-services/home-improvement-services",
        },
        {
          titel: "BDO — reglerne for håndværker- og servicefradrag i 2026",
          url: "https://www.bdo.dk/da-dk/faglig-info/depechen/depechen-artikler-2026/reglerne-for-handvarker-og-servicefradrag-i-2026",
        },
      ],
    },
    {
      id: "fagforening-akasse-renter",
      overskrift: "Fagforening, a-kasse og renter — mest automatik, én fælde",
      blokke: [
        {
          type: "tabel",
          kolonner: ["Post", "Fradrag 2026", "Automatisk?", "Rubrik"],
          raekker: [
            [
              "Fagforeningskontingent",
              "Maks. 7.000 kr. pr. år",
              "Ja — fagforeningen indberetter",
              "50 (felt 458 på forskudsopgørelsen)",
            ],
            [
              "A-kasse og efterlønsbidrag",
              "Fuldt fradrag, intet loft",
              "Ja — a-kassen indberetter",
              "52",
            ],
            [
              "Renter af bank-, realkredit- og SU-lån",
              "Fuldt fradrag (kapitalindkomst)",
              "Ja — långiver indberetter",
              "41/42 m.fl.",
            ],
            [
              "Renter af private lån (fx familielån)",
              "Fuldt fradrag",
              "NEJ — skriv selv",
              "44 + långivers CPR-nr.",
            ],
          ],
        },
        {
          type: "tekst",
          tekst:
            "Rubriknumrene 50, 52 og 44 bekræftes samstemmende af fagforenings- og revisorkilder, men stod ikke på selve skat.dk-siderne i kontrollen (ikke fuldt verificeret — tjek kilden). Risikoen er lav: rubrik 50 og 52 udfyldes alligevel automatisk af indberetteren.",
        },
        {
          type: "advarsel",
          tekst:
            "Renter af private lån er fradragets glemte hjørne: du skal selv skrive dem på årsopgørelsen OG oplyse långivers identitet (CPR-nr.) hvert eneste år. Glemmer du CPR-oplysningen, mister du fradragsretten.",
        },
        {
          type: "tekst",
          tekst:
            "Rentefradragets skatteværdi er ca. 33 % af de første 50.000 kr. negativ nettokapitalindkomst pr. person (100.000 kr. for ægtepar) takket være et ekstra nedslag på 8 procentpoint efter personskattelovens § 11, og derover ca. 25 %. De præcise procenter afhænger af din kommuneskat (ikke fuldt verificeret — brug tallene som illustration, aldrig som eksakt beregning).",
        },
        {
          type: "tip",
          tekst:
            "Betaler du mere end 7.000 kr. i fagforeningskontingent, er resten fradragsmæssigt spildt — a-kassedelen har derimod intet loft. Tjek på årsopgørelsen, at fagforeningens indberetning i rubrik 50 ikke overstiger loftet.",
        },
      ],
      kilder: [
        {
          titel: "Skat.dk — fradrag for fagforening og a-kasse",
          url: "https://skat.dk/en-us/individuals/deductions-and-allowances/deduction-for-trade-union-fees-etc",
        },
        {
          titel: "Skat.dk — fradrag for renteudgifter",
          url: "https://skat.dk/en-us/individuals/deductions-and-allowances/deduction-for-interest-expenses",
        },
        {
          titel: "BDO — renteudgifter, du selv skal skrive på årsopgørelsen",
          url: "https://www.bdo.dk/da-dk/faglig-info/depechen/depechen-artikler-2025/renteudgifter,-du-selv-skal-skrive-pa-arsopgorelsen",
        },
      ],
    },
    {
      id: "gaver-boernebidrag",
      overskrift: "Gaver til velgørenhed og børnebidrag",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Gaver til velgørende foreninger (ligningslovens § 8A) giver fradrag op til 20.000 kr. i 2026 (19.000 kr. i 2025) med en skatteværdi på ca. 26 %. Det gælder KUN foreninger på Skattestyrelsens godkendte liste. Fradraget lander automatisk i rubrik 55 (selve rubriknummeret er ikke fuldt verificeret — tjek kilden), men KUN hvis foreningen har fået dit CPR-nr. — du kan ikke selv taste det ind. Gaver til forskning (§ 8H) har intet loft.",
        },
        {
          type: "tip",
          tekst:
            "Oplys altid dit CPR-nr., når du donerer — ellers eksisterer gaven ikke i Skats bøger, og fradraget er tabt. Sæt det som fast rutine ved hver ny forening.",
        },
        {
          type: "tekst",
          tekst:
            "Børnebidrag er fradragsberettiget, når tre krav er opfyldt: barnet er under 18, barnet bor ikke hos dig, og bidraget er fastsat af Familieretshuset eller skriftligt aftalt. Fradraget er det betalte bidrag minus 192 kr. pr. måned (2026); betaler du normalbidraget, giver det 1.483 kr. pr. måned i fradrag (2026).",
        },
        {
          type: "liste",
          punkter: [
            "Betales bidraget via Udbetaling Danmark, kommer fradraget automatisk.",
            "Betaler du direkte til den anden forælder, skal du selv skrive beløbet i rubrik 56 og oplyse barnets CPR-nr.",
            "Private gaver til nær familie er noget andet: de er afgiftsfri op til gaveafgiftsgrænsen, som ligger omkring 79.000 kr. i 2026 (ikke fuldt verificeret — tjek kilden før du disponerer).",
          ],
        },
      ],
      kilder: [
        {
          titel: "Skat.dk — fradrag for gaver og bidrag til velgørende foreninger",
          url: "https://skat.dk/borger/fradrag/fradrag-for-gaver-og-bidrag-til-velgoerende-foreninger",
        },
        {
          titel: "Skat.dk — fradrag for børnebidrag",
          url: "https://skat.dk/borger/fradrag/boernebidrag-og-aegtefaellebidrag/fradrag-for-boernebidrag",
        },
        {
          titel: "Skatteministeriet — beløbsgrænser efter personskattelovens § 20 (2025-2026)",
          url: "https://skm.dk/tal-og-metode/satser/regulering-af-beloebsgraenser/beloebsgraenser-i-skattelovgivningen-der-reguleres-efter-personskattelovens-20-2025-2026",
        },
      ],
    },
    {
      id: "rejsefradrag",
      overskrift: "Rejsefradrag (rubrik 53) — ved midlertidigt arbejdssted",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Arbejder du på et midlertidigt arbejdssted og er mindst 24 timer hjemmefra, kan du få fradrag for kost og logi efter standardsatser — eller for dokumenterede faktiske udgifter. Fradraget indtastes af dig selv i rubrik 53 på årsopgørelsen.",
        },
        {
          type: "tabel",
          kolonner: ["Sats", "Beløb 2026"],
          raekker: [
            ["Kost og småfornødenheder", "625 kr. pr. døgn"],
            ["Logi", "268 kr. pr. døgn"],
            ["Årligt loft for rejsefradrag", "34.400 kr."],
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Loftet på 34.400 kr. er bekræftet direkte i Skatteministeriets § 20-tabel, men døgnsatserne 625/268 kr. bekræftes kun samstemmende af flere revisorkilder og er ikke set direkte på en skat.dk-side i kontrollen (ikke fuldt verificeret — tjek kilden, før du regner med dem).",
        },
      ],
      kilder: [
        {
          titel: "Skat.dk — deduction for travel expenses",
          url: "https://skat.dk/en-us/individuals/deductions-and-allowances/deductions-and-allowances-when-working/travel-deductions-and-allowances/deduction-for-travel-expenses",
        },
        {
          titel: "Danrevi — skattefri rejsegodtgørelse og rejsefradrag 2026",
          url: "https://www.danrevi.dk/nyheder/skattefri-rejsegodtgoerelse-og-rejsefradrag-2026-kost-og-logi/",
        },
      ],
    },
    {
      id: "investering",
      overskrift: "Investering 2026 — aktiesparekonto og frie midler",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Aktiesparekontoen har et indskudsloft på 174.200 kr. i 2026. Loftet måles på kontoens kursværdi pr. 31. december 2025 — var den under 174.200 kr., kan du indskyde differencen i 2026. Afkastet beskattes fladt med 17 % efter lagerprincippet, dvs. også urealiserede gevinster (satsen er stabil siden 2022, men ikke genverificeret mod skat.dk i denne kontrol — meget lav risiko). Banken opgør afkastet og betaler skatten automatisk; intet skal på årsopgørelsen. Tab fremføres til modregning i senere års afkast på kontoen.",
        },
        {
          type: "tabel",
          kolonner: ["Aktieindkomst (frie midler)", "Sats 2026"],
          raekker: [
            ["Op til 79.400 kr. (ægtefæller samlet 158.800 kr.)", "27 %"],
            ["Over 79.400 kr.", "42 %"],
          ],
        },
        {
          type: "tekst",
          tekst:
            "Progressionsgrænsen er hævet ekstraordinært fra 67.500 kr. i 2025 til 79.400 kr. i 2026 som følge af aftalen »Et stærkere erhvervsliv«. Grænsen gælder udbytter og gevinster på noterede og unoterede aktier uden for aktiesparekonto og pension. Danske depoter indberettes normalt automatisk af banken; udenlandske depoter skal du selv oplyse.",
        },
        {
          type: "tip",
          tekst:
            "Udnyt 27 %-bunden hvert år: ligger du under 79.400 kr. i aktieindkomst, kan det betale sig at realisere gevinster eller tage udbytte inden årsskiftet, så du fylder den lave sats op i stedet for at ramme 42 % senere.",
        },
      ],
      kilder: [
        {
          titel: "Skat.dk — aktiesparekonto",
          url: "https://skat.dk/borger/aktier-og-andre-vaerdipapirer/aktiesparekonto",
        },
        {
          titel: "Skatteministeriet — beløbsgrænser efter personskattelovens § 20 (2025-2026)",
          url: "https://skm.dk/tal-og-metode/satser/regulering-af-beloebsgraenser/beloebsgraenser-i-skattelovgivningen-der-reguleres-efter-personskattelovens-20-2025-2026",
        },
      ],
    },
    {
      id: "hobby-vs-erhverv",
      overskrift: "Hobby eller erhverv — sideindkomst uden om Camsilo",
      blokke: [
        {
          type: "advarsel",
          tekst:
            "Der findes INGEN skattefri bundgrænse for hobbyindkomst — det er en udbredt misforståelse. Nettooverskuddet (indtægter minus direkte omkostninger) er skattepligtigt fra første krone som personlig indkomst uden AM-bidrag og skal skrives i rubrik 20 (»Anden personlig indkomst«) på årsopgørelsen. Underskud kan hverken modregnes i anden indkomst eller fremføres.",
        },
        {
          type: "liste",
          punkter: [
            "Moms er en helt separat vurdering: overstiger omsætningen 50.000 kr. inden for 12 måneder, skal du moms- og CVR-registreres — også selv om aktiviteten skattemæssigt er hobby.",
            "Salg af egne brugte private ejendele (fx eget indbo på DBA) er skattefrit uanset beløb.",
            "Camsilo (webudvikling med systematisk omsætning) er typisk erhvervsmæssig virksomhed — hobbyreglerne er relevante for eventuelle sideaktiviteter.",
          ],
        },
        {
          type: "tekst",
          tekst:
            "Grænsen mellem hobby og erhverv er ingen beløbsgrænse, men en samlet konkret vurdering (Juridisk Vejledning C.C.1.3.1) med to hovedkriterier: rentabilitet (udsigt til et overskud, der kan forrente kapitalen og give en rimelig driftsherreløn) og intensitet/professionel drift (en vis omsætning, systematik, faglige forudsætninger, budgetter m.m.).",
        },
        {
          type: "tabel",
          kolonner: ["Forhold", "Hobbyvirksomhed", "Erhvervsmæssig virksomhed"],
          raekker: [
            [
              "Beskatning af overskud",
              "Personlig indkomst uden AM-bidrag (rubrik 20)",
              "Personlig indkomst med AM-bidrag (oplysningsskema)",
            ],
            [
              "Underskud",
              "Kan hverken modregnes eller fremføres",
              "Fradrag for underskud",
            ],
            [
              "Virksomhedsordning",
              "Nej",
              "Ja — mulighed for virksomheds- eller kapitalafkastordning",
            ],
            [
              "Beskæftigelsesfradrag af overskud",
              "Nej",
              "Ja",
            ],
          ],
        },
      ],
      kilder: [
        {
          titel: "Juridisk Vejledning C.C.1.1.2 — hobbyvirksomhed (beskatning)",
          url: "https://info.skat.dk/data.aspx?oid=2048528",
        },
        {
          titel: "Juridisk Vejledning C.C.1.3.1 — erhvervsmæssig virksomhed (kriterier)",
          url: "https://info.skat.dk/data.aspx?oid=2083457",
        },
        {
          titel: "Juridisk Vejledning D.A.3.1.4.2.2 — momspligt uafhængigt af skattemæssig vurdering",
          url: "https://info.skat.dk/data.aspx?oid=1977974",
        },
        {
          titel: "Virksomhedsguiden — hvornår er din virksomhed en hobbyvirksomhed",
          url: "https://virksomhedsguiden.dk/content/ydelser/hvornaar-er-din-virksomhed-en-hobbyvirksomhed/468fac1e-990e-447c-b8c1-a8975adc2e8e/",
        },
      ],
    },
    {
      id: "oversigt-og-frister",
      overskrift: "Den store oversigt: automatisk vs. manuelt — og fristerne",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Årsopgørelsen for 2026 åbner i TastSelv i marts 2027. Fristen for at rette og tilføje oplysninger er 1. maj 2027 (visse rubrikker: 1. juli 2027). Som ejer af en enkeltmandsvirksomhed skal du desuden udfylde oplysningsskemaet med virksomhedens resultat — det kommer aldrig af sig selv.",
        },
        {
          type: "tabel",
          kolonner: ["Post", "Automatisk?", "Rubrik/felt"],
          raekker: [
            ["Løn, AM-bidrag, A-skat", "Ja (arbejdsgiver via eIndkomst)", "11 m.fl."],
            ["Person-, beskæftigelses- og jobfradrag", "Ja (beregnes af Skat)", "—"],
            ["Renter, bank/realkredit/SU-lån", "Ja", "41/42 m.fl."],
            ["Renter, private lån", "NEJ — selv", "44 + långivers CPR-nr."],
            ["Fagforening (loft 7.000 kr.)", "Ja", "50"],
            ["A-kasse og efterløn", "Ja", "52"],
            ["Kørselsfradrag", "NEJ — selv, hvert år", "51"],
            ["Rejsefradrag", "NEJ — selv", "53"],
            ["Gaver, § 8A", "Kun hvis CPR-nr. er oplyst til foreningen", "55"],
            ["Børnebidrag", "Kun via Udbetaling Danmark; ellers selv", "56"],
            ["Servicefradrag", "NEJ — selv", "461"],
            ["Håndværkerfradrag (grøn)", "NEJ — selv", "460"],
            ["Hobby-overskud", "NEJ — selv, fra første krone", "20"],
            ["Aktiesparekonto", "Ja (banken afregner alt)", "—"],
            ["Dansk aktiedepot (udbytte/gevinst)", "Overvejende ja; udenlandske depoter selv", "—"],
            ["Enkeltmandsvirksomhedens resultat", "NEJ — oplysningsskema", "Oplysningsskemaet"],
          ],
        },
        {
          type: "tekst",
          tekst:
            "Forbehold: rubriknumrene 44, 50, 52 og 55 bekræftes af revisor-, fagforenings- og a-kassekilder, men stod ikke direkte på skat.dk-siderne i kontrollen (ikke fuldt verificeret — tjek kilden). De øvrige numre (51, 53, 56, 20, 460, 461) er bekræftet på officielle sider.",
        },
        {
          type: "tip",
          tekst:
            "Næsten alle beløbsgrænser reguleres årligt efter personskattelovens § 20 — i 2026 med 4,8 %. Sæt en fast påmindelse hver december: hent de nye satser i Skatteministeriets reguleringstabel og på skat.dk, før du planlægger det nye år.",
        },
      ],
      kilder: [
        {
          titel: "Skatteministeriet — beløbsgrænser efter personskattelovens § 20 (2025-2026)",
          url: "https://skm.dk/tal-og-metode/satser/regulering-af-beloebsgraenser/beloebsgraenser-i-skattelovgivningen-der-reguleres-efter-personskattelovens-20-2025-2026",
        },
        {
          titel: "Skat.dk — kørselsfradrag",
          url: "https://skat.dk/borger/fradrag/koerselsfradrag",
        },
        {
          titel: "Skat.dk — fradrag for gaver og bidrag til velgørende foreninger",
          url: "https://skat.dk/borger/fradrag/fradrag-for-gaver-og-bidrag-til-velgoerende-foreninger",
        },
      ],
    },
  ],
};
