/**
 * Viden-guide: Virksomhedsordningen (VSO) for indkomståret 2026 — valg af
 * beskatningsordning (PSL/KAO/VSO), satser, rubrikker, frister og betydningen
 * for en senere skattefri ApS-omdannelse. Kildekritisk researchet 2026-07-08;
 * kritikerens korrektioner er indarbejdet, og uverificerede detaljer er
 * markeret i teksten.
 */
import type { VidenGuide } from "./typer";

export const VSO_GUIDE: VidenGuide = {
  id: "vso",
  titel: "Virksomhedsordningen — skal du bruge den?",
  rune: "ᛟ",
  emoji: "⚖️",
  intro:
    "Alfaderen gav et øje for visdom — Skattestyrelsen forlanger blot et kryds i den rigtige rubrik. Hugin og Munin har fløjet over Den juridiske vejledning og virksomhedsskatteloven, og her står bøgernes fulde tale: hvad virksomhedsordningen kan, hvad den koster i bogholderi, og hvornår den for en lille webvirksomhed blot er bureaukrati. Alt gælder indkomståret 2026.",
  opdateret: "2026-07-08",
  afsnit: [
    {
      id: "overblik",
      overskrift: "De tre ordninger — overblik",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Som ejer af en enkeltmandsvirksomhed vælger du hvert år, hvordan virksomhedens resultat skal beskattes: personskattelovens regler (PSL), kapitalafkastordningen (KAO) eller virksomhedsordningen (VSO). Sætter du ikke aktivt et kryds, beskattes du efter PSL. Valget er årligt, træffes på oplysningsskemaet og gælder hele virksomheden i hele indkomståret — driver du flere virksomheder, behandles de som én under VSO."
        },
        {
          type: "tabel",
          kolonner: [
            "Ordning",
            "Overskud beskattes som",
            "Renteudgifter",
            "Opsparing til 22 %?",
            "Administration"
          ],
          raekker: [
            [
              "Personskattelovens regler (PSL) — standard",
              "Personlig indkomst (AM-bidrag + indkomstskat) i optjeningsåret",
              "Kapitalindkomst (lav fradragsværdi, ca. 25-33 % — cirka-tal, kommuneafhængigt)",
              "Nej",
              "Lav"
            ],
            [
              "Kapitalafkastordningen (KAO)",
              "Personlig indkomst, minus et beregnet kapitalafkast der flyttes til kapitalindkomst",
              "Kapitalindkomst",
              "Kun via konjunkturudligning (sjældent brugt)",
              "Mellem"
            ],
            [
              "Virksomhedsordningen (VSO)",
              "Hævet overskud = personlig indkomst; opsparet overskud = foreløbig 22 %",
              "Fuldt fradrag i personlig indkomst (op til ca. 52 % værdi i 2026)",
              "Ja, 22 % (2026)",
              "Høj"
            ]
          ]
        },
        {
          type: "tekst",
          tekst:
            "For Camsilo-scenariet — webudvikling uden ansatte, uden erhvervsgæld og med lønjob ved siden af — er PSL det naturlige udgangspunkt, og VSO bliver først interessant, når den samlede indkomst når op i mellem- eller topskat. Resten af guiden viser præcis hvornår og hvordan."
        }
      ],
      kilder: [
        {
          titel: "Skat.dk — Skat af din virksomhed (valg af ordning)",
          url: "https://skat.dk/en-us/businesses/own-business/tax-on-own-business"
        },
        {
          titel: "Den juridiske vejledning C.C.5.2.3.1 — betingelser for VSO",
          url: "https://info.skat.dk/data.aspx?oid=1948869"
        },
        {
          titel: "Den juridiske vejledning C.C.5.2.1 — VSO's fordele",
          url: "https://info.skat.dk/data.aspx?oid=1948842"
        }
      ]
    },
    {
      id: "opsparing",
      overskrift: "Sådan virker VSO-opsparingen (konto for opsparet overskud)",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Kerneidéen i VSO er, at virksomheden skattemæssigt behandles næsten som et selskab, selvom den juridisk er personlig. Overskud, du ikke hæver til privatforbrug, beskattes kun foreløbigt med virksomhedsskat på 22 % (2026 — samme sats som selskabsskatten, uændret siden 2016, jf. VSL § 10, stk. 2). De resterende 78 % står på »konto for opsparet overskud« og indgår ikke i årets personlige indkomstopgørelse."
        },
        {
          type: "tabel",
          kolonner: ["Regneeksempel: du opsparer 100.000 kr. i 2026", "Beløb"],
          raekker: [
            ["Foreløbig virksomhedsskat, 22 %", "22.000 kr."],
            ["Indestående på konto for opsparet overskud (78 %)", "78.000 kr."],
            [
              "Ved senere hævning medregnes i personlig indkomst (hævning + virksomhedsskat)",
              "100.000 kr. (inkl. 8 % AM-bidrag)"
            ],
            ["Modregnes krone-for-krone i slutskatten", "22.000 kr."]
          ]
        },
        {
          type: "advarsel",
          tekst:
            "De 22 % er skatteUDSKYDELSE — ikke en endelig lav skat. Når du senere hæver det opsparede overskud, medregnes hævningen med tillæg af den betalte virksomhedsskat i din personlige indkomst (inkl. 8 % AM-bidrag), og de 22 % modregnes i slutskatten. Kan de ikke rummes i slutskatten, udbetales de som overskydende skat (VSL § 10, stk. 3 — ikke fuldt verificeret, tjek kilden). Gevinsten opstår kun, hvis du hæver i år med lavere marginalskat, end du ellers ville have betalt."
        },
        {
          type: "tekst",
          tekst:
            "VSO's anden klassiske fordel er fuldt rentefradrag: virksomhedens renteudgifter indgår i resultatet og fratrækkes dermed i personlig indkomst (fradragsværdi op til ca. 52 % i 2026, mod ca. 25-33 % som kapitalindkomst under PSL — cirka-tal, kommuneafhængige). Uden erhvervsgæld er denne fordel værdiløs, og det er netop Camsilos situation."
        }
      ],
      kilder: [
        {
          titel: "Skatteministeriet — satser i virksomhedsskatteloven",
          url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/virksomhedsskatteloven"
        },
        {
          titel: "Den juridiske vejledning C.C.5.2.10 — opsparet overskud",
          url: "https://info.skat.dk/data.aspx?oid=1948909"
        },
        {
          titel: "Den juridiske vejledning C.C.5.2.1 — rentefradrag og udjævning",
          url: "https://info.skat.dk/data.aspx?oid=1948842"
        }
      ]
    },
    {
      id: "krav-og-konti",
      overskrift: "Krav, konti og hæverækkefølgen",
      blokke: [
        {
          type: "liste",
          punkter: [
            "Selvstændig erhvervsvirksomhed med regnskab efter bogføringsloven (VSL § 2, stk. 1).",
            "Regnskabsmæssig adskillelse af virksomhedsøkonomi og privatøkonomi — separat bankkonto er i praksis en nødvendighed.",
            "Indskudskonto opgøres ved indtræden i ordningen: værdien af de aktiver minus den gæld, du lægger ind.",
            "Kapitalafkastgrundlag opgøres årligt, og der skal udfyldes ekstra VSO-rubrikker på oplysningsskemaet.",
            "Ordningen skal bruges for hele virksomheden i hele indkomståret; flere virksomheder behandles som én."
          ]
        },
        {
          type: "advarsel",
          tekst:
            "Negativ indskudskonto (privat gæld lagt ind i ordningen) udløser rentekorrektion (VSL § 11) og blokerer for opsparing af overskud. Rentekorrektionssatsen for 2025 er 5 %; satsen for 2026 er endnu ikke fastsat pr. 8. juli 2026. Starter du uden gæld og indskyder kun erhvervsaktiver, er problemet irrelevant."
        },
        {
          type: "tabel",
          kolonner: ["Hæverækkefølgen (VSL § 5)", "Beskatning"],
          raekker: [
            ["1. Kapitalafkast", "Kapitalindkomst"],
            ["2. Årets resterende overskud", "Personlig indkomst (+ AM-bidrag)"],
            [
              "3. Opsparet overskud (+ tilhørende virksomhedsskat)",
              "Personlig indkomst; de betalte 22 % modregnes"
            ],
            ["4. Indskudskonto", "Skattefrit"],
            ["5. Beløb ud over indskudskontoen", "Kan gøre indskudskontoen negativ"]
          ]
        },
        {
          type: "tekst",
          tekst:
            "Alle overførsler fra virksomheden til privatøkonomien anses hævet i denne faste rækkefølge. Forud for hæverækkefølgen kan bl.a. refusion af driftsomkostninger betalt privat og beløb til dækning af virksomhedsskatten overføres, og beløb hensat til senere hævning ligger også uden for rækkefølgen (detaljerne stemmer med Den juridiske vejledning C.C.5.2.7, men er ikke fuldt verificeret — tjek kilden)."
        },
        {
          type: "tip",
          tekst:
            "Mellemregningskontoen er VSO's smidige bagdør: private kontantindskud kan bogføres på mellemregning i stedet for indskudskontoen og hæves skattefrit igen uden om hæverækkefølgen. Kontoen må aldrig blive negativ — så anses beløbet for hævet i hæverækkefølgen — og indestående indgår ikke i kapitalafkastgrundlaget. (Kildebelagt via tax.dk-spejlet af C.C.5.2.6 — bekræft mod info.skat.dk før du disponerer.)"
        }
      ],
      kilder: [
        {
          titel: "Den juridiske vejledning C.C.5.2.3.1 — betingelser for VSO",
          url: "https://info.skat.dk/data.aspx?oid=1948869"
        },
        {
          titel: "Den juridiske vejledning C.C.5.2.7 — hæverækkefølgen",
          url: "https://info.skat.dk/data.aspx?oid=1948885"
        },
        {
          titel: "Skatteministeriet — rentekorrektionssats m.m.",
          url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/virksomhedsskatteloven"
        },
        {
          titel: "Den juridiske vejledning C.C.5.2.6 (tax.dk-spejl) — mellemregningskonto",
          url: "https://www.tax.dk/jv/cc/C_C_5_2_6.htm"
        }
      ]
    },
    {
      id: "hvornaar",
      overskrift: "Hvornår kan VSO betale sig? 2026-satserne afgør det",
      blokke: [
        {
          type: "tekst",
          tekst:
            "2026 er første år med personskattereformens tredeling af de øverste trin, og det er netop de grænser, VSO-opsparing skal måles imod. Alle grænser gælder personlig indkomst efter 8 % AM-bidrag:"
        },
        {
          type: "tabel",
          kolonner: ["Skat 2026", "Sats", "Grænse (efter AM-bidrag)"],
          raekker: [
            ["AM-bidrag", "8 %", "Fra første krone af virksomhedsoverskud/løn"],
            ["Bundskat", "12,01 %", "—"],
            ["Mellemskat", "+7,5 %", "Over 641.200 kr."],
            ["Topskat", "+7,5 %", "Over 777.900 kr."],
            ["Top-topskat", "+5 %", "Over 2.592.700 kr."],
            [
              "Marginalskat over topskattegrænsen",
              "ca. 52 % (skråt skatteloft 52,07 %)",
              "Ekskl. kirkeskat og AM-bidrag"
            ]
          ]
        },
        {
          type: "liste",
          punkter: [
            "VSO giver mening, når lønjob + virksomhedsoverskud tilsammen overstiger mellemskattegrænsen (641.200 kr. efter AM-bidrag i 2026), og du kan lade en del af overskuddet stå: du betaler 22 % nu i stedet for op til ca. 52 % + AM-bidrag og hæver i senere lavindkomstår (orlov, deltid, pension, opstartsår).",
            "VSO giver mening, når overskuddet svinger kraftigt år for år og skal »klippes« til under mellem-, top- eller top-topskattegrænsen med resten gemt til magre år.",
            "VSO giver mening ved væsentlig erhvervsgæld (fuldt rentefradrag) — ikke relevant for Camsilo.",
            "VSO er overkill, når den samlede indkomst ligger under mellemskattegrænsen: ingen satsgevinst, kun ekstra bogholderi og penge bundet i virksomhedsøkonomien.",
            "VSO er overkill, når du løbende skal bruge hele overskuddet privat: alt hæves alligevel og beskattes som personlig indkomst — ordningen tilføjer kun bureaukrati."
          ]
        },
        {
          type: "tip",
          tekst:
            "Odins tommelfingerregel: vælg kun VSO, hvis (løn + forventet virksomhedsoverskud, efter AM-bidrag) overstiger 641.200 kr. i 2026, OG du kan undvære en del af overskuddet. Ellers vælg PSL — det er lav-risiko, for valget kan frit laves om helt frem til 30. juni 2028 (se fristafsnittet)."
        }
      ],
      kilder: [
        {
          titel: "Skat.dk — bundskat, mellemskat, topskat og top-topskat 2026",
          url: "https://skat.dk/en-us/help/botton-bracket-middle-bracket-top-bracket-and-additional-top-bracket-tax"
        },
        {
          titel: "Skat.dk — skattesatser (AM-bidrag m.m.)",
          url: "https://skat.dk/en-us/help/tax-rates"
        },
        {
          titel: "Den juridiske vejledning C.C.5.2.1 — indkomstudjævning",
          url: "https://info.skat.dk/data.aspx?oid=1948842"
        }
      ]
    },
    {
      id: "placering",
      overskrift: "Hvor må de opsparede penge stå?",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Opsparet overskud skal blive i virksomhedsøkonomien — du kan ikke bare flytte pengene over i et privat aktiedepot. VSL § 1, stk. 2 sætter grænser for, hvilke værdipapirer der kan indgå i ordningen:"
        },
        {
          type: "liste",
          punkter: [
            "KAN indgå: kontanter og bankindestående.",
            "KAN indgå: almindelige rentebærende obligationer samt konvertible obligationer.",
            "KAN indgå: aktier og investeringsbeviser udstedt af et investeringsselskab (ABL § 19) — i praksis akkumulerende, lagerbeskattede investeringsforeninger og ETF'er.",
            "KAN IKKE indgå: almindelige (udloddende) aktier og andet omfattet af aktieavancebeskatningsloven i øvrigt.",
            "KAN IKKE indgå: uforrentede obligationer og præmieobligationer (medmindre der foreligger næring)."
          ]
        },
        {
          type: "advarsel",
          tekst:
            "Køber du et »forbudt« aktiv for virksomhedens midler, anses beløbet for hævet i hæverækkefølgen — og så udløses netop den beskatning, opsparingen skulle udskyde. Tjek aktivtypen, før du investerer opsparede VSO-midler."
        }
      ],
      kilder: [
        {
          titel: "Virksomhedsskatteloven § 1, stk. 2 (lovtekst)",
          url: "https://danskelove.dk/virksomhedsskatteloven/1"
        }
      ]
    },
    {
      id: "kao",
      overskrift: "Kapitalafkastordningen — sjældent relevant for en webvirksomhed",
      blokke: [
        {
          type: "tekst",
          tekst:
            "KAO flytter et beregnet afkast — kapitalafkastgrundlaget (værdien af erhvervsmæssige aktiver, uden fradrag af gæld; finansielle aktiver holdes som hovedregel ude) ganget med kapitalafkastsatsen — fra personlig indkomst til kapitalindkomst. Det sparer AM-bidrag og eventuel mellem-/topskat af den bid."
        },
        {
          type: "tabel",
          kolonner: ["Indkomstår", "Kapitalafkastsats"],
          raekker: [
            ["2018-2022", "0 %"],
            ["2023", "3 %"],
            ["2024", "4 %"],
            ["2025", "2 %"],
            ["2026", "Ikke fastsat pr. 8. juli 2026 — offentliggøres typisk juli/august"]
          ]
        },
        {
          type: "advarsel",
          tekst:
            "2026-satsen kendes ikke endnu: den beregnes som gennemsnittet af Nationalbankens kassekreditrente for ikke-finansielle selskaber i årets første seks måneder (VSL § 9) og offentliggøres først i en SKM-meddelelse — 2024-satsen kom fx i SKM2024.399.SKTST i august 2024. Regn ikke med en bestemt sats, før den er meldt ud."
        },
        {
          type: "tekst",
          tekst:
            "For Camsilo er ordningen reelt værdiløs: en webudvikler med en bærbar og lidt software til måske 20.000 kr. får med 2025-satsen på 2 % et kapitalafkast på ca. 400 kr. om året — en skattebesparelse på under 200 kr., som ikke opvejer det ekstra bogholderi. Ordningens konjunkturudligningsopsparing kræver en båndlagt bankkonto og bruges sjældent (ikke fuldt verificeret — tjek kilden). KAO er mest relevant med store driftsaktiver som ejendom, maskiner eller varelager."
        }
      ],
      kilder: [
        {
          titel: "Den juridiske vejledning C.C.5.2.9.4 — kapitalafkastsatsen",
          url: "https://info.skat.dk/data.aspx?oid=1948906"
        },
        {
          titel: "Den juridiske vejledning C.C.5.3.1.1 — kapitalafkastordningen",
          url: "https://info.skat.dk/data.aspx?oid=1948932"
        },
        {
          titel: "Skatteministeriet — satser i virksomhedsskatteloven",
          url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/virksomhedsskatteloven"
        }
      ]
    },
    {
      id: "valg-og-frister",
      overskrift: "Sådan vælger du ordningen — rubrikker, felter og frister",
      blokke: [
        {
          type: "tabel",
          kolonner: ["Felt/rubrik", "Hvor", "Betydning"],
          raekker: [
            [
              "Rubrik 147",
              "Oplysningsskemaet",
              "Kryds = du vælger virksomhedsordningen for indkomståret"
            ],
            [
              "Rubrik 141",
              "Oplysningsskemaet, under »Virksomhedsoplysninger«",
              "Kryds = du vælger kapitalafkastordningen"
            ],
            [
              "Intet kryds",
              "Oplysningsskemaet",
              "Du beskattes efter personskattelovens regler (standard)"
            ],
            [
              "Felt 184",
              "Forskudsopgørelsen",
              "Foreløbigt valg — styrer kun B-skatterater i årets løb; det bindende valg sker på oplysningsskemaet"
            ]
          ]
        },
        {
          type: "trin",
          trin: [
            {
              titel: "Forskudsopgørelsen (valgfrit, i løbet af 2026)",
              tekst:
                "Vil du have B-skatteraterne til at afspejle VSO allerede i årets løb, angives det foreløbige valg i felt 184 på forskudsopgørelsen på skat.dk."
            },
            {
              titel: "Åbn oplysningsskemaet",
              tekst:
                "Log på skat.dk og åbn oplysningsskemaet for indkomståret 2026, når det åbner — forventet medio marts 2027 (ikke fuldt verificeret — tjek kilden)."
            },
            {
              titel: "Find virksomhedsdelen",
              tekst:
                "Gå til afsnittet »Virksomhedsoplysninger«, hvor virksomhedens resultat og valget af beskatningsordning hører til."
            },
            {
              titel: "Sæt kryds i rubrik 147",
              tekst:
                "Vælg virksomhedsordningen i rubrik 147 (eller kapitalafkastordningen i rubrik 141 — eller lad begge stå tomme for PSL)."
            },
            {
              titel: "Udfyld VSO-rubrikkerne",
              tekst:
                "Har du valgt VSO, skal de VSO-specifikke rubrikker også udfyldes: bl.a. kapitalafkastgrundlag, indskudskonto, opsparet overskud og hensættelser til senere hævning."
            },
            {
              titel: "Godkend senest 1. juli 2027",
              tekst:
                "Indsend oplysningsskemaet for indkomståret 2026 senest den 1. juli 2027."
            }
          ]
        },
        {
          type: "tabel",
          kolonner: ["Frist", "Dato", "Gælder"],
          raekker: [
            [
              "Oplysningsskema for indkomståret 2026",
              "1. juli 2027",
              "Alle selvstændige; skemaet åbner forventet medio marts 2027 (ikke fuldt verificeret)"
            ],
            [
              "Omvalg af beskatningsordning for 2026 (VSL § 2, stk. 2)",
              "30. juni 2028",
              "Ubetinget ret til at skifte til/fra VSO, KAO og PSL ved meddelelse til Skattestyrelsen"
            ]
          ]
        },
        {
          type: "advarsel",
          tekst:
            "Indsender du oplysningsskemaet for sent, koster det et skattetillæg på 400 kr. pr. dag, maks. 10.000 kr. — dog 200 kr. pr. dag og maks. 5.000 kr., hvis din skattepligtige indkomst ikke overstiger mellemskattegrænsen. Satserne blev fordoblet med virkning fra indkomståret 2024 (SKL § 73)."
        },
        {
          type: "tip",
          tekst:
            "Fortrydelsesretten er din ven: indberet simpelt efter PSL til fristen, og lad en revisor regne efter, når årsopgørelsen foreligger. Viser VSO sig at være en gevinst for 2026, kan valget frit ændres helt frem til 30. juni 2028."
        }
      ],
      kilder: [
        {
          titel: "Skat.dk — Skat af din virksomhed (rubrik 147/141, felt 184)",
          url: "https://skat.dk/en-us/businesses/own-business/tax-on-own-business"
        },
        {
          titel: "Skat.dk — oplysningsskemaet (frister)",
          url: "https://skat.dk/erhverv/egen-virksomhed/bogfoering-regnskab-og-oplysningsskema/oplysningsskema"
        },
        {
          titel: "Den juridiske vejledning C.C.5.2.3.1 — omvalgsfristen (VSL § 2, stk. 2)",
          url: "https://info.skat.dk/data.aspx?oid=1948869"
        },
        {
          titel: "Den juridiske vejledning A.C.2.1.4.3.1 — skattetillæg (SKL § 73)",
          url: "https://info.skat.dk/data.aspx?oid=2284578"
        }
      ]
    },
    {
      id: "aps-omdannelse",
      overskrift: "VSO og en senere skattefri ApS-omdannelse",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Opsparet overskud i VSO er ikke en fælde, hvis du senere vil omdanne til ApS — tværtimod er »opspar i VSO, omdan skattefrit« en kendt vej til at få 22 %-beskattede midler med over i selskabet. Reglerne står i virksomhedsomdannelsesloven (VOL) og VSL §§ 16-16a."
        },
        {
          type: "liste",
          punkter: [
            "Alle virksomhedens aktiver og passiver overdrages til et nystiftet ApS/A/S, og vederlaget skal udelukkende bestå af anparter (VOL § 2).",
            "Ejeren skal være fuldt skattepligtig i Danmark.",
            "Omdannelsen skal gennemføres senest 6 måneder efter statusdagen — med kalenderårsregnskab: omdannelsesdato 1. januar og gennemførelse senest 30. juni (fx omdannelse pr. 1. januar 2027 gennemført senest 30. juni 2027).",
            "Dokumenterne skal være hos Skattestyrelsen senest 1 måned efter omdannelsen.",
            "Anparternes skattemæssige anskaffelsessum må ikke være negativ — undtagelse: VSO-brugere, der har anvendt ordningen i indkomståret forud for omdannelsen og omdanner samtlige virksomheder samlet."
          ]
        },
        {
          type: "tekst",
          tekst:
            "VSO-specifikt gælder: en eventuel negativ indskudskonto SKAL udlignes ved kontant indskud inden omdannelsen (VOL § 2, stk. 1, nr. 5 / VSL § 16, stk. 2) — ellers ingen skattefri omdannelse. Konto for opsparet overskud kan helt eller delvist nedsætte anparternes skattemæssige anskaffelsessum: den udskudte VSO-skat konverteres dermed til en større fremtidig aktieavance og kommer aldrig til personbeskatning som hævning. Driver man flere virksomheder under VSO, kan én af dem godt omdannes skattefrit alene (delvis skattefri virksomhedsomdannelse, VSL § 16a) — kravet om at omdanne samtlige virksomheder samlet gælder kun undtagelsen for negativ anskaffelsessum."
        },
        {
          type: "advarsel",
          tekst:
            "En lav eller negativ anskaffelsessum betyder større avanceskat den dag, anparterne sælges — skatten forsvinder ikke, den flytter. Og omdannelsesberegningen kræver, at indskudskonto og konto for opsparet overskud er ført korrekt gennem alle VSO-årene. Brug altid revisor til selve omdannelsen."
        }
      ],
      kilder: [
        {
          titel: "Den juridiske vejledning C.C.7.2.2 — betingelser for skattefri virksomhedsomdannelse",
          url: "https://info.skat.dk/data.aspx?oid=2047507"
        },
        {
          titel: "Den juridiske vejledning C.C.5.2.14.2 — fuldstændig skattefri omdannelse fra VSO",
          url: "https://info.skat.dk/data.aspx?oid=1948923"
        },
        {
          titel: "Den juridiske vejledning C.C.5.2.14.3 — delvis skattefri omdannelse (VSL § 16a)",
          url: "https://info.skat.dk/data.aspx?oid=1948924"
        }
      ]
    },
    {
      id: "anbefaling",
      overskrift: "Odins anbefaling til Camsilo",
      blokke: [
        {
          type: "liste",
          punkter: [
            "Standard: PSL. Lille webvirksomhed, ingen erhvervsgæld, ejer med lønjob — indberet resultatet som personlig indkomst med simpelt regnskab.",
            "Skift-trigger: overstiger løn + forventet overskud (efter 8 % AM-bidrag) mellemskattegrænsen på 641.200 kr. (2026), så regn på VSO-opsparing (22 % nu mod op til ca. 52 % + AM-bidrag) og tag en revisor med på råd.",
            "KAO: nedprioriteret — kun interessant med væsentlige driftsaktiver, og 2026-satsen kendes først ca. august 2026.",
            "Fristerne: oplysningsskema for 2026 senest 1. juli 2027; omvalg af ordning for 2026 senest 30. juni 2028; skattefri omdannelse pr. 1. januar skal være gennemført senest 30. juni samme år.",
            "Selv under PSL: bogfør aktiver, gæld og private hævninger struktureret, så indskudskonto og kapitalafkastgrundlag kan opgøres, hvis VSO senere vælges med tilbagevirkende kraft inden omvalgsfristen."
          ]
        },
        {
          type: "tip",
          tekst:
            "Ravnene ser alt, men de behøver ikke rapportere alt hvert år: så længe indkomsten ligger under mellemskattegrænsen, er PSL både billigst og enklest — og fortrydelsesretten til 30. juni 2028 betyder, at du aldrig står fanget i et forkert valg for 2026."
        }
      ],
      kilder: [
        {
          titel: "Den juridiske vejledning C.C.5.2.1 — hvornår VSO er en fordel",
          url: "https://info.skat.dk/data.aspx?oid=1948842"
        },
        {
          titel: "Skat.dk — Skat af din virksomhed (valg og rubrikker)",
          url: "https://skat.dk/en-us/businesses/own-business/tax-on-own-business"
        }
      ]
    }
  ]
};
