/**
 * Odins viden-base: Skat for selvstændige (indkomståret 2026) — B-skat,
 * forskudsopgørelse og oplysningsskema for en enkeltmandsvirksomhed med
 * lønjob ved siden af. Kildekritisk efterprøvet 2026-07-08; satser for
 * indkomståret 2026, frister ind i 2027 hvor relevant.
 */

import type { VidenGuide } from "./typer";

export const SKAT_GUIDE: VidenGuide = {
  id: "skat",
  rune: "ᚦ",
  emoji: "🧾",
  titel: "Skat for selvstændige — B-skat, forskudsopgørelse og oplysningsskema",
  intro:
    "Alfaderen gav et øje for al verdens visdom — Skattestyrelsen nøjes med otte af hver hundrede kroner, før resten af regnestykket begynder. Mine ravne har fløjet over skat.dk og skm.dk og bragt 2026-satserne hjem til bøgerne. Her står hele vejen: fra felt 221 på forskudsopgørelsen over B-skattens ti rater til rubrik 111 inden den 1. juli 2027.",
  opdateret: "2026-07-08",
  afsnit: [
    {
      id: "grundprincip",
      overskrift: "Grundprincippet: virksomhedens overskud er din personlige indkomst",
      blokke: [
        {
          type: "tekst",
          tekst:
            "En enkeltmandsvirksomhed er ikke et selvstændigt skattesubjekt. Virksomhedens overskud beskattes som ejerens personlige indkomst — uanset om pengene hæves eller bliver stående på virksomhedskontoen. Der findes ingen »løn til dig selv«; overskuddet ER din indkomst. Overskuddet lægges oven på lønindkomsten, og den samlede personlige indkomst afgør, hvor langt du når op i progressionen (mellemskat/topskat)."
        },
        {
          type: "liste",
          punkter: [
            "Skattepligtigt resultat = omsætning (ekskl. moms) minus fradragsberettigede driftsudgifter — opgjort FØR renter (renter oplyses separat).",
            "AM-bidrag på 8 % trækkes af overskuddet først; de resterende 92 % indgår i din personlige indkomst sammen med lønnen.",
            "Skatten af overskuddet opkræves løbende som B-skat — men kun hvis overskuddet står på din forskudsopgørelse (felt 221).",
            "Efter årets udgang oplyser du det faktiske resultat i oplysningsskemaet (rubrik 111/112) — den automatiske årsopgørelse er ikke nok for selvstændige."
          ]
        },
        {
          type: "tip",
          tekst:
            "Standardreglerne (personskatteloven) er det normale for en lille bibeskæftigelse. Alternativerne — virksomhedsordningen (vælges i rubrik 147) og kapitalafkastordningen (rubrik 141) — er mest relevante ved store renteudgifter i virksomheden eller ved opsparing af stort overskud. Overvej dem først, når overskuddet vokser."
        }
      ],
      kilder: [
        {
          titel: "Skat.dk — Skat af egen virksomhed",
          url: "https://skat.dk/erhverv/egen-virksomhed/skat-af-egen-virksomhed"
        },
        {
          titel: "Skat.dk — B-income (B-skat og AM-bidrag for selvstændige)",
          url: "https://skat.dk/en-us/individuals/b-income"
        }
      ]
    },
    {
      id: "satser-2026",
      overskrift: "Satser og grænser 2026 — inkl. skattereformen",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Fra 1. januar 2026 trådte personskattereformen i kraft: den gamle topskat (15 % over 611.800 kr. i 2025) er delt i en mellemskat og en topskat på hver 7,5 %, og der er indført en top-topskat på 5 % for meget høje indkomster. Beskæftigelsesfradraget er samtidig hævet. Alle trin-grænser gælder personlig indkomst EFTER AM-bidrag."
        },
        {
          type: "tabel",
          kolonner: ["Sats/grænse", "Værdi 2026", "Bemærkning"],
          raekker: [
            ["AM-bidrag", "8 %", "Af hele virksomhedsoverskuddet, trækkes før al anden skat"],
            ["Personfradrag", "54.100 kr.", "Typisk allerede brugt af lønnen, når man har lønjob"],
            ["Bundskat", "12,01 %", "Af personlig indkomst + positiv nettokapitalindkomst over personfradraget"],
            ["Kommuneskat", "25,049 % (landsgennemsnit)", "Brug din egen kommunes sats; beregnes af skattepligtig indkomst"],
            ["Kirkeskat", "ca. 0,87 % (gennemsnit)", "Kun folkekirkemedlemmer; varierer pr. kommune"],
            ["Mellemskat (NY)", "7,5 % over 641.200 kr.", "Ny fra 2026 — erstatter nederste del af den gamle topskat"],
            ["Topskat (ny definition)", "7,5 % over 777.900 kr.", "Lægges OVEN PÅ mellemskatten (i alt 15 % ekstra i intervallet)"],
            ["Top-topskat (NY)", "5 % over 2.592.700 kr.", "Næppe relevant for en lille bibeskæftigelse"],
            ["Beskæftigelsesfradrag", "12,75 %, maks. 63.300 kr.", "Gælder også selvstændiges AM-pligtige overskud (LL § 9 J)"],
            ["Jobfradrag", "4,5 % over 235.200 kr., maks. 3.100 kr.", "Beregnes automatisk af Skattestyrelsen"],
            ["Skatteloft, personlig indkomst", "44,57 %", "Dækker bundskat + mellemskat + kommuneskat; topskat/top-topskat ligger ovenpå"],
            ["Maks. marginalskat", "ca. 60,5 % inkl. AM-bidrag", "57,07 % ekskl. AM-bidrag og kirkeskat"]
          ]
        },
        {
          type: "tekst",
          tekst:
            "Reformens praktiske effekt: for personlig indkomst mellem 641.200 og 777.900 kr. (efter AM-bidrag) er marginalskatten 7,5 procentpoint lavere end under de gamle regler. Bundskat og AM-bidrag er uændrede."
        }
      ],
      kilder: [
        {
          titel: "Skatteministeriet — satser og beløbsgrænser, personskatteloven",
          url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/personskatteloven"
        },
        {
          titel: "Skatteministeriet — satser og beløbsgrænser, ligningsloven",
          url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/ligningsloven"
        },
        {
          titel: "Skat.dk — bundskat, mellemskat, topskat og top-topskat",
          url: "https://skat.dk/en-us/help/botton-bracket-middle-bracket-top-bracket-and-additional-top-bracket-tax"
        },
        {
          titel: "Skatteministeriet — kommuneskatter, gennemsnitsprocenten i 2026",
          url: "https://skm.dk/tal-og-metode/satser/statistik-i-kommunerne/kommuneskatter-gennemsnitsprocenten-i-2026"
        }
      ]
    },
    {
      id: "regnestykket",
      overskrift: "Regnestykket trin for trin (2026)",
      blokke: [
        {
          type: "trin",
          trin: [
            {
              titel: "Opgør det skattepligtige resultat",
              tekst:
                "Omsætning (ekskl. moms) minus fradragsberettigede driftsudgifter. Det er resultatet FØR renter, der bruges — renter i virksomheden angives i egne felter/rubrikker."
            },
            {
              titel: "Træk AM-bidrag: 8 %",
              tekst:
                "8 % af overskuddet går til arbejdsmarkedsbidrag. Du skal ikke selv trække det fra i dine indberetninger — Skattestyrelsen beregner det, men det hører med i din egen kalkule."
            },
            {
              titel: "Læg de resterende 92 % til din personlige indkomst",
              tekst:
                "Virksomhedens indkomst efter AM-bidrag lægges sammen med lønindkomsten (efter AM-bidrag) til én samlet personlig indkomst."
            },
            {
              titel: "Fratræk personfradraget — hvis der er noget tilbage",
              tekst:
                "Personfradraget er 54.100 kr. i 2026, men med et lønjob ved siden af er det typisk allerede brugt af lønnen, så virksomhedsoverskuddet beskattes reelt fra første krone."
            },
            {
              titel: "Beregn skatterne af den samlede personlige indkomst",
              tekst:
                "Kommuneskat (din kommunes sats), bundskat 12,01 %, mellemskat 7,5 % af delen over 641.200 kr., topskat yderligere 7,5 % over 777.900 kr., top-topskat 5 % over 2.592.700 kr. — plus evt. kirkeskat."
            },
            {
              titel: "Husk de ligningsmæssige fradrag",
              tekst:
                "Beskæftigelsesfradrag 12,75 % af AM-grundlaget (maks. 63.300 kr.) og jobfradrag (maks. 3.100 kr.). De beregnes automatisk og har en skatteværdi på ca. kommuneskatteprocenten (~25 %). Maks. nås ved ca. 496.500 kr. i AM-indkomst — med lønjob er loftet ofte allerede nået via lønnen."
            }
          ]
        },
        {
          type: "tabel",
          kolonner: ["Eksempel: overskud 100.000 kr.", "Beløb"],
          raekker: [
            ["AM-bidrag 8 %", "8.000 kr."],
            ["Personlig indkomst fra virksomheden", "92.000 kr."],
            ["Bundskat 12,01 % af 92.000 kr.", "11.049 kr."],
            ["Kommuneskat 25,049 % af 92.000 kr. (gennemsnitskommune)", "23.045 kr."],
            ["Værdi af ekstra beskæftigelsesfradrag (12,75 % × 100.000 × ~25 %)", "-3.194 kr."],
            ["Skat i alt", "ca. 38.900 kr. (~39 %)"]
          ]
        },
        {
          type: "tekst",
          tekst:
            "Eksemplet forudsætter, at personfradraget er brugt af lønnen, at den samlede indkomst ligger under mellemskattegrænsen, og at beskæftigelsesfradragets loft IKKE allerede er nået via lønnen — er det nået, forsvinder de ca. 3.200 kr. i fradragsværdi, og skatten bliver ca. 42 %."
        },
        {
          type: "tip",
          tekst:
            "Tommelfingerregel: sæt 40 % af hvert overskudskrone til side til skat. Rammer din samlede personlige indkomst over 641.200 kr. (efter AM-bidrag), stiger marginalen til ca. 49 % — over 777.900 kr. ca. 56 % inkl. AM-bidrag."
        }
      ],
      kilder: [
        {
          titel: "Skatteministeriet — satser og beløbsgrænser, personskatteloven",
          url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/personskatteloven"
        },
        {
          titel: "Skatteministeriet — satser og beløbsgrænser, ligningsloven",
          url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/ligningsloven"
        },
        {
          titel: "Skat.dk — B-income (AM-bidrag og B-skat)",
          url: "https://skat.dk/en-us/individuals/b-income"
        },
        {
          titel: "Skatteministeriet — kommuneskatter, gennemsnitsprocenten i 2026",
          url: "https://skm.dk/tal-og-metode/satser/statistik-i-kommunerne/kommuneskatter-gennemsnitsprocenten-i-2026"
        }
      ]
    },
    {
      id: "forskudsopgoerelse",
      overskrift: "Forskudsopgørelsen: felt 221 — her starter alt",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Virksomhedens forventede overskud oplyses på DIN private forskudsopgørelse i TastSelv Borger (med dit private MitID) — ikke i TastSelv Erhverv. Som eneejer, der kan tegne virksomheden alene, bruger du dit private MitID begge steder (ordningen »MitID Privat til Erhverv«); MitID Erhverv er kun nødvendigt, hvis andre skal handle digitalt for virksomheden. Når overskuddet er registreret, omsætter Skattestyrelsen det automatisk til B-skatterater."
        },
        {
          type: "trin",
          trin: [
            {
              titel: "Log på TastSelv Borger",
              tekst: "Gå til skat.dk → klik »Log på« øverst til højre → vælg »Log på som borger« → log ind med dit private MitID."
            },
            {
              titel: "Åbn forskudsopgørelsen",
              tekst: "Vælg menupunktet »Forskudsopgørelsen«."
            },
            {
              titel: "Find virksomhedsfelterne",
              tekst: "Under »Oftest tilføjede felter« vælger du »Egen virksomhed/udlejningsejendom«."
            },
            {
              titel: "Udfyld felt 221",
              tekst:
                "Skriv det forventede overskud (omsætning minus udgifter, FØR renter, FØR AM-bidrag og skat) i felt 221. Forventet underskud skrives i stedet i felt 435, og renteudgifter i virksomheden i felt 481."
            },
            {
              titel: "Beregn",
              tekst: "Scroll ned og klik »Beregn« nederst på siden."
            },
            {
              titel: "Tjek det nye skattekort",
              tekst:
                "Under »Nyt skattekort« ser du B-skatten: står der et beløb, opkræves skatten af overskuddet som B-skatterater. Er beløbet i stedet indregnet, trækkes det via en højere trækprocent på din løn — for virksomhedsoverskud er B-skatterater standarden."
            },
            {
              titel: "Godkend",
              tekst: "Klik »Godkend«. Raterne og indbetalingskortene dannes automatisk."
            }
          ]
        },
        {
          type: "tabel",
          kolonner: ["Felt", "Indhold"],
          raekker: [
            ["221", "Forventet overskud af virksomhed (før renter)"],
            ["435", "Forventet underskud af virksomhed"],
            ["481", "Renteudgifter i virksomheden"]
          ]
        },
        {
          type: "advarsel",
          tekst:
            "Uden felt 221 opkræves der INGEN løbende skat af virksomhedsoverskuddet — arbejdsgiverens A-skattetræk dækker kun lønnen. Hele beløbet lander så som restskat året efter, med rente og procenttillæg oveni. Skat.dk siger det selv: »Hvis du ikke retter forskudsopgørelsen, betaler du løbende forkert skat. I værste fald risikerer du at skulle betale en restskat, når året er omme.«"
        },
        {
          type: "tip",
          tekst:
            "Opdatér forskudsopgørelsen straks ved opstart og derefter mindst kvartalsvis, når forventningen til overskuddet ændrer sig — retter du felt 221 midt i året, fordeles ændringen på årets resterende rater. Husk også at sætte felt 221 på forskudsopgørelsen for 2027, når den åbner — erfaringsmæssigt i november 2026 (ikke fuldt verificeret — tjek kilden)."
        }
      ],
      kilder: [
        {
          titel: "Skat.dk start-up-guide — Del 2: Ret forskudsopgørelsen",
          url: "https://skat.dk/erhverv/guides-og-webinarer-til-start-ups/start-up-med-skat/for-virksomheder/forskud-og-loebende-skat/del-2-ret-forskudsopgoerelsen"
        },
        {
          titel: "Skat.dk — Skat af egen virksomhed (felt 221/435/481)",
          url: "https://skat.dk/erhverv/egen-virksomhed/skat-af-egen-virksomhed"
        },
        {
          titel: "Skat.dk — sådan logger du på (MitID privat til erhverv)",
          url: "https://skat.dk/en-us/businesses/e-tax-for-businesses/how-you-log-on-to-e-tax-for-businesses"
        },
        {
          titel: "MitID Erhverv — enkeltmandsvirksomheder",
          url: "https://mitid-erhverv.dk/tilslutning/sadan-far-i-mitid-erhverv/enkeltmandsvirksomheder/"
        }
      ]
    },
    {
      id: "b-skat",
      overskrift: "B-skat 2026: 10 rater og deres frister",
      blokke: [
        {
          type: "tekst",
          tekst:
            "B-skatten betales i 10 rater: januar-maj og juli-november. Juni og december er betalingsfrie. Hver rate forfalder den 1. i måneden, og sidste rettidige betalingsdag er den 20. i samme måned — falder den 20. på en weekend eller helligdag, er fristen første hverdag efter. Raterne dækker både indkomstskat og AM-bidrag af det forskudsregistrerede overskud. Indbetalingskortene kommer i Digital Post."
        },
        {
          type: "tabel",
          kolonner: ["Rate", "Måned", "Sidste rettidige betalingsdag 2026"],
          raekker: [
            ["1", "Januar", "tirsdag 20. januar 2026"],
            ["2", "Februar", "fredag 20. februar 2026"],
            ["3", "Marts", "fredag 20. marts 2026"],
            ["4", "April", "mandag 20. april 2026"],
            ["5", "Maj", "onsdag 20. maj 2026"],
            ["—", "Juni", "betalingsfri måned"],
            ["6", "Juli", "mandag 20. juli 2026"],
            ["7", "August", "torsdag 20. august 2026"],
            ["8", "September", "mandag 21. september 2026 (20/9 er en søndag)"],
            ["9", "Oktober", "tirsdag 20. oktober 2026"],
            ["10", "November", "fredag 20. november 2026"],
            ["—", "December", "betalingsfri måned"]
          ]
        },
        {
          type: "tip",
          tekst:
            "Tilmeld raterne Betalingsservice, så de trækkes automatisk hver måned — så glemmer du aldrig en frist. Alternativt betales via betalingslinjen i TastSelv, Dankort eller MobilePay."
        }
      ],
      kilder: [
        {
          titel: "Skat.dk — B-income (rater og betalingsfrie måneder)",
          url: "https://skat.dk/en-us/individuals/b-income"
        },
        {
          titel: "Skat.dk start-up-guide — Del 3: Betal skat",
          url: "https://skat.dk/erhverv/guides-og-webinarer-til-start-ups/start-up-med-skat/for-virksomheder/forskud-og-loebende-skat/del-3-betal-skat"
        },
        {
          titel: "Den juridiske vejledning A.B.4.1.2.1 (forfald og betalingsfrister)",
          url: "https://info.skat.dk/data.aspx?oid=2085241"
        }
      ]
    },
    {
      id: "oplysningsskema",
      overskrift: "Oplysningsskemaet: rubrik 111 og fristen 1. juli 2027",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Som selvstændig kan du ikke nøjes med den automatiske årsopgørelse — du SKAL udfylde oplysningsskemaet (den udvidede årsopgørelse) i TastSelv. For indkomståret 2026 er fristen 1. juli 2027. Skemaet åbner erfaringsmæssigt medio/ultimo marts 2027 — 2025-skemaet åbnede 23. marts 2026 (åbningsdatoen er ikke fuldt verificeret — tjek kilden)."
        },
        {
          type: "tabel",
          kolonner: ["Rubrik", "Indhold"],
          raekker: [
            ["111", "Overskud af virksomhed — årets resultat FØR renter og FØR AM-bidrag (Skattestyrelsen beregner selv AM-bidraget)"],
            ["112", "Underskud af virksomhed — udfyld kun 111 ELLER 112"],
            ["114", "Renteindtægter i virksomheden"],
            ["117", "Renteudgifter i virksomheden"],
            ["147", "Kryds, hvis virksomhedsordningen vælges"],
            ["141", "Kryds, hvis kapitalafkastordningen vælges"],
            ["300-306", "Regnskabsoplysninger (ikke fuldt verificeret — tjek numrene i selve TastSelv-skemaet; kun belagt med branchekilder)"]
          ]
        },
        {
          type: "advarsel",
          tekst:
            "Indberetter du for sent, koster det et skattetillæg på op til 400 kr. pr. dag, dog højst 10.000 kr. i alt. Sæt en påmindelse i god tid før 1. juli 2027."
        },
        {
          type: "tekst",
          tekst:
            "Ved omsætning under 300.000 kr. om året er man efter skat.dk's kategorisering fritaget for de fleste regnskabsoplysninger i skemaet, så resultat-rubrikken (111/112) og få felter rækker (omfanget af fritagelsen er ikke fuldt verificeret — tjek kilden). Regnskabet skal ikke indsendes, men det skal være bogført og kunne fremvises på forlangende — opbevar bilagene i 5 år."
        }
      ],
      kilder: [
        {
          titel: "Skat.dk — Oplysningsskema (frist og regnskabskrav)",
          url: "https://skat.dk/erhverv/egen-virksomhed/bogfoering-regnskab-og-oplysningsskema/oplysningsskema"
        },
        {
          titel: "Skat.dk start-up-guide — Del 2: Oplys resultatet (rubrik 111/112)",
          url: "https://skat.dk/erhverv/guides-og-webinarer-til-start-ups/start-up-med-skat/for-virksomheder/arets-regnskab-og-skat/del-2-oplys-resultatet"
        },
        {
          titel: "Skat.dk — Skat af egen virksomhed (rubrik 147/141)",
          url: "https://skat.dk/erhverv/egen-virksomhed/skat-af-egen-virksomhed"
        },
        {
          titel: "Dinero — udvidet selvangivelse for enkeltmandsvirksomhed (rubrik 300-306, branchekilde)",
          url: "https://dinero.dk/tips/udvidet-selvangivelse-til-enkeltmandsvirksomhed/"
        }
      ]
    },
    {
      id: "restskat",
      overskrift: "Restskat og overskydende skat",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Når årsopgørelsen for 2026 kommer i foråret 2027, afregnes forskellen mellem den betalte forskudsskat (A-skat af lønnen + B-skat af virksomheden) og den faktiske skat. Betaler du en forventet restskat frivilligt inden årsskiftet, slipper du helt for rente."
        },
        {
          type: "tabel",
          kolonner: ["Betalingsvindue", "Omkostning"],
          raekker: [
            ["Frivillig indbetaling til og med 31. december 2026", "Ingen rente"],
            ["1. januar - 1. juli 2027", "Dag-til-dag rente (ikke fradragsberettiget)"],
            ["Efter 1. juli 2027", "Fast procenttillæg (ikke fradragsberettiget)"]
          ]
        },
        {
          type: "advarsel",
          tekst:
            "Rentesatserne for indkomståret 2026 er endnu ikke offentliggjort — skm.dk skriver »fastlægges senere« (de fastsættes ud fra Nationalbankens rente, typisk i december 2026). Seneste kendte satser er fra indkomståret 2025: dag-til-dag rente 3,7 % p.a. og procenttillæg 5,7 % (ikke fuldt verificeret for 2026 — tjek kilden ultimo 2026)."
        },
        {
          type: "liste",
          punkter: [
            "Indregningsgrænse 2026: 25.200 kr. — restskat plus tillæg op til grænsen indregnes automatisk i forskudsskatten for 2028.",
            "Restskat over grænsen opkræves i 3 rater i august, september og oktober 2027; mindsterate ved opkrævning er 500 kr. (mindsteraten er ikke fuldt verificeret — tjek kilden).",
            "Overskydende skat udbetales typisk automatisk til NemKonto fra april 2027; en eventuel procentgodtgørelse har de senere år været lille (0-0,4 %) og fastlægges også først senere."
          ]
        },
        {
          type: "tip",
          tekst:
            "Sammenlign i november/december 2026 årets bogførte resultat med felt 221 på forskudsopgørelsen. Ser B-skatten ud til at være for lav, så betal differencen frivilligt inden nytår — det er den eneste periode helt uden rente."
        }
      ],
      kilder: [
        {
          titel: "Skatteministeriet — satser og beløbsgrænser, kildeskatteloven",
          url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/kildeskatteloven"
        },
        {
          titel: "Skat.dk — Pay outstanding tax (betalingsvinduer for restskat)",
          url: "https://skat.dk/en-us/individuals/tax-assessment-notice/outstanding-tax/pay-outstanding-tax"
        }
      ]
    },
    {
      id: "loen-og-virksomhed",
      overskrift: "Samspillet mellem lønjob og virksomhed",
      blokke: [
        {
          type: "liste",
          punkter: [
            "Én samlet skatteberegning: lønnen (efter AM-bidrag) og virksomhedsoverskuddet (efter AM-bidrag) lægges sammen til én personlig indkomst — progressionsgrænserne (641.200/777.900 kr.) vurderes på summen.",
            "Personfradraget (54.100 kr. i 2026) er typisk brugt af lønnen — hvert overskudskrone beskattes derfor med ca. 39-42 % fra første krone, mere ved mellemskat/topskat.",
            "Beskæftigelsesfradragets loft (63.300 kr.) nås ved ca. 496.500 kr. i samlet AM-indkomst — tjener du det via lønnen, giver virksomhedsoverskuddet ikke ekstra beskæftigelsesfradrag.",
            "A-skatten fra arbejdsgiveren dækker KUN lønnen — B-skatteraterne er den eneste løbende opkrævning af virksomhedens skat.",
            "To justeringsveje findes: B-skatterater (standarden) eller indregning via højere trækprocent på lønnen — TastSelv viser hvilken der er valgt under »Nyt skattekort«."
          ]
        },
        {
          type: "advarsel",
          tekst:
            "Et lille virksomhedsoverskud kan blive ramt af mellemskat, selv om det isoleret set er beskedent — hvis lønnen i forvejen ligger tæt på grænsen på 641.200 kr. (efter AM-bidrag). Regn altid progressionen på den SAMLEDE indkomst, ikke på overskuddet alene."
        },
        {
          type: "tip",
          tekst:
            "Odins årshjul: bogfør løbende → estimér årets resultat → sammenlign med felt 221 og ret forskudsopgørelsen ved afvigelse → betal B-skatterater senest den 20. i ratemånederne → i december: betal en forventet restskat frivilligt → i marts-juni 2027: udfyld rubrik 111 (resultat før renter) og indberet senest 1. juli 2027."
        }
      ],
      kilder: [
        {
          titel: "Skat.dk — B-income (samspil mellem A- og B-indkomst)",
          url: "https://skat.dk/en-us/individuals/b-income"
        },
        {
          titel: "Skatteministeriet — satser og beløbsgrænser, personskatteloven",
          url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/personskatteloven"
        },
        {
          titel: "Skat.dk start-up-guide — Del 2: Ret forskudsopgørelsen",
          url: "https://skat.dk/erhverv/guides-og-webinarer-til-start-ups/start-up-med-skat/for-virksomheder/forskud-og-loebende-skat/del-2-ret-forskudsopgoerelsen"
        }
      ]
    }
  ]
};
