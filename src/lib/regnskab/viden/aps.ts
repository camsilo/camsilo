/**
 * Odins viden-base: Fra enkeltmandsvirksomhed til ApS — hele drejebogen.
 * Kildekritisk researchet 2026-07-08; kritikerens korrektioner er indarbejdet
 * (bl.a. selskabslovens § 33, stk. 1 om delvis indbetaling), og uverificerede
 * påstande er markeret i teksten. Alle satser er 2026-satser, hvor intet
 * andet er angivet.
 */

import type { VidenGuide } from "./typer";

export const APS_GUIDE: VidenGuide = {
  id: "aps",
  rune: "ᛒ",
  emoji: "🏢",
  titel: "Fra enkeltmandsvirksomhed til ApS — hele drejebogen",
  intro:
    "Hugin og Munin har fløjet over Erhvervsstyrelsens sale og Skattestyrelsens bøger og bragt hele drejebogen hjem til dig: vejen fra den frie hånds enkeltmandsvirksomhed til anpartsselskabets faste borg. Her står hver frist, hvert felt og hver sats — læs runerne grundigt, før du binder dig, for selskabets bånd er stærkere og dyrere at løse end den enkeltes.",
  opdateret: "2026-07-08",
  afsnit: [
    {
      id: "overblik",
      overskrift: "Overblik: de to veje og de vigtigste tal",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Der findes to veje fra enkeltmandsvirksomhed til ApS. Vej A er den skattefri virksomhedsomdannelse efter virksomhedsomdannelsesloven, hvor skatten udskydes, men hvor alle lovens betingelser skal opfyldes og en fast årlig frist gælder. Vej B er den skattepligtige overdragelse, hvor du stifter et ApS og sælger virksomheden til selskabet til handelsværdi — den kan gennemføres når som helst. I begge tilfælde får ApS'et sit eget, nye CVR-nummer, og enkeltmandsvirksomhedens CVR afmeldes og lukkes.",
        },
        {
          type: "advarsel",
          tekst:
            "Pr. 8. juli 2026 er fristen for skattefri omdannelse med virkning fra 1. januar 2026 overskredet — den udløb 30. juni 2026 ved kalenderårsregnskab. Næste vindue er omdannelse pr. 1. januar 2027, som skal være gennemført senest 30. juni 2027. En skattepligtig overdragelse (vej B) kan derimod gennemføres når som helst med op til 6 måneders tilbagevirkende kraft fra stiftelsesdatoen.",
        },
        {
          type: "tabel",
          kolonner: ["Nøgletal", "Værdi 2026", "Bemærkning"],
          raekker: [
            [
              "Minimumskapital ApS",
              "20.000 kr.",
              "Halveret fra 40.000 kr. pr. 1. januar 2025; gælder både kontant- og apportindskud",
            ],
            [
              "Registreringsgebyr, stiftelse via Virk",
              "670 kr.",
              "Betales med kort i flowet (ikke fuldt verificeret mod Erhvervsstyrelsens gebyr-side — tjek kilden)",
            ],
            ["Selskabsskat", "22 %", "Selskabsskattelovens § 17, stk. 1"],
            [
              "Udbytteskat",
              "27 % / 42 %",
              "27 % op til 79.400 kr., 42 % derover (ægtefæller samlet 158.800 kr.)",
            ],
            [
              "Momsregistreringsgrænse",
              "50.000 kr.",
              "Momspligtig omsætning over 12 måneder",
            ],
            [
              "Frist for skattefri omdannelse",
              "30. juni",
              "6 måneder efter statusdagen ved kalenderårsregnskab (se nuance i vej A-afsnittet)",
            ],
            [
              "Årsrapportfrist",
              "6 måneder efter regnskabsårets udløb",
              "30. juni ved kalenderårsregnskab — ingen dispensation",
            ],
          ],
        },
      ],
      kilder: [
        {
          titel: "Skat.dk — Fra virksomhed til selskab",
          url: "https://skat.dk/erhverv/selskaber-fonde-og-foreninger/selskaber-og-fonde/generelt-om-selskaber-og-fonde/fra-virksomhed-til-selskab",
        },
        {
          titel: "Erhvervsstyrelsen — Kapitalkravet for anpartsselskaber er halveret",
          url: "https://erhvervsstyrelsen.dk/kapitalkravet-anpartsselskaber-er-halveret",
        },
        {
          titel: "Skatteministeriet — Selskabsskatteloven, satser",
          url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/selskabsskatteloven",
        },
        {
          titel: "Skatteministeriet — Beløbsgrænser 2025-2026",
          url: "https://skm.dk/tal-og-metode/satser/regulering-af-beloebsgraenser/beloebsgraenser-i-skattelovgivningen-der-reguleres-efter-personskattelovens-20-2025-2026",
        },
      ],
    },
    {
      id: "vej-a-skattefri",
      overskrift: "Vej A: skattefri virksomhedsomdannelse",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Ved skattefri omdannelse efter virksomhedsomdannelsesloven udløser selve omdannelsen ingen skat. Til gengæld arver anparterne en lav skattemæssig anskaffelsessum, så beskatningen blot er udskudt til den dag, du sælger anparterne, eller selskabet likvideres. Alle betingelser i lovens §§ 1-2 skal være opfyldt (jf. Juridisk vejledning C.C.7.2.2):",
        },
        {
          type: "liste",
          punkter: [
            "Fuld dansk skattepligt: du skal på omdannelsestidspunktet være fuldt skattepligtig til Danmark.",
            "Hele virksomheden: ALLE virksomhedens aktiver og passiver skal overdrages til selskabet — du kan ikke plukke.",
            "Vederlag udelukkende i anparter: ingen kontanter og intet stiftertilgodehavende/gældsbrev.",
            "Anparternes pålydende skal svare til den samlede anpartskapital.",
            "Anparternes skattemæssige anskaffelsessum må ikke være negativ. Undtagelse: har du brugt virksomhedsordningen (VSO) året før, må den godt være negativ — men kun hvis du omdanner samtlige dine virksomheder samlet.",
            "Negativ indskudskonto i VSO skal udlignes ved privat indbetaling, inden omdannelsen gennemføres.",
            "Omdannelsen skal ske til et nystiftet ApS/A/S eller et „skuffeselskab“, der aldrig har haft aktivitet.",
            "Udskudt skat skal hensættes i selskabets åbningsbalance.",
            "Frist: omdannelsesdatoen er dagen efter statusdagen for dit seneste årsregnskab (1. januar ved kalenderår), og omdannelsen skal være gennemført senest 6 måneder efter statusdagen — dvs. senest 30. juni.",
            "Papirer til Skattestyrelsen senest 1 måned efter omdannelsen: kopi af stiftelsesdokument, vedtægter, vurderingsberetning, åbningsbalance, dokumentation for registrering hos Erhvervsstyrelsen samt opgørelse af anparternes skattemæssige anskaffelsessum.",
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Om fristens præcise slutdato: skat.dk skriver „6 måneder efter statusdagen“ med 30. juni som eksempel, mens lovteksten regner 6 måneder fra omdannelsesdatoen (1. januar), hvilket kan læses som 1. juli. Nuancen er ikke fuldt verificeret — planlæg altid efter 30. juni som konservativ frist, så du aldrig står i tvivlszonen.",
        },
        {
          type: "tip",
          tekst:
            "VSO-bonus: har du opsparet overskud i virksomhedsordningen, kan du vælge at lade det nedsætte anparternes anskaffelsessum i stedet for at blive efterbeskattet — så ruller den lave aconto-beskatning med ind i selskabet.",
        },
        {
          type: "tekst",
          tekst:
            "Vej A kan især betale sig, når virksomheden rummer betydelige latente avancer — goodwill (kundekreds, tilbagevendende omsætning), driftsmidler med genvundne afskrivninger eller ejendom. Skattefriheden udskyder en skat, der ellers skulle betales kontant nu.",
        },
      ],
      kilder: [
        {
          titel: "Juridisk vejledning C.C.7.2.2 — Betingelser for skattefri virksomhedsomdannelse",
          url: "https://info.skat.dk/data.aspx?oid=2047507",
        },
        {
          titel: "Skat.dk — Fra virksomhed til selskab",
          url: "https://skat.dk/erhverv/selskaber-fonde-og-foreninger/selskaber-og-fonde/generelt-om-selskaber-og-fonde/fra-virksomhed-til-selskab",
        },
      ],
    },
    {
      id: "vej-b-skattepligtig",
      overskrift: "Vej B: skattepligtig overdragelse (salg til eget selskab)",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Ved den skattepligtige model stifter du et ApS (kontant eller ved apportindskud) og sælger virksomhedens aktiver til selskabet til handelsværdi. Skattemæssigt behandles det som ophør plus salg: goodwill, avancer og genvundne afskrivninger beskattes hos dig personligt i det indkomstår, hvor skæringsdatoen ligger.",
        },
        {
          type: "liste",
          punkter: [
            "Tilbagevirkende kraft: op til 6 måneder (selskabsskattelovens § 4, stk. 4-5) — stiftelsen skal ske senest 6 måneder efter den valgte skæringsdato, og hele den bestående virksomhed skal overdrages til et nystiftet selskab.",
            "Fleksibelt vederlag: du må gerne modtage et stiftertilgodehavende (gældsbrev), som selskabet senere afdrager til dig skattefrit — det er allerede beskattede penge.",
            "Høj anskaffelsessum: anparterne får anskaffelsessum lig handelsværdien, hvilket er en fordel ved et senere salg.",
            "Ingen fast årsfrist: kan gennemføres når som helst på året — modsat vej A's 30. juni-vindue.",
          ],
        },
        {
          type: "tip",
          tekst:
            "For en typisk lille webudviklings-enkeltmandsvirksomhed med få aktiver (computer, software, evt. beskeden goodwill) er den skattepligtige model ofte både billigere og enklere: goodwill i konsulentlignende énmandsvirksomheder sættes ofte lavt, fordi indtjeningen er knyttet til personen, så skatten ved salget kan være beskeden eller nul. Få en revisor til at regne den konkrete goodwill- og avanceskat efter, før du vælger vej.",
        },
      ],
      kilder: [
        {
          titel: "Juridisk vejledning C.C.7.1.2 — Skattepligtig virksomhedsomdannelse med tilbagevirkende kraft",
          url: "https://tax.dk/jv/cc/C_C_7_1_2.htm",
        },
      ],
    },
    {
      id: "selskabskrav",
      overskrift: "ApS-krav 2026: kapital, dokumenter og ejerregistre",
      blokke: [
        {
          type: "tabel",
          kolonner: ["Krav", "Indhold"],
          raekker: [
            [
              "Minimumskapital",
              "20.000 kr. (halveret fra 40.000 kr. pr. 1. januar 2025). Kan indskydes kontant eller som apportindskud (virksomheden) — værdien skal blot udgøre mindst 20.000 kr.",
            ],
            [
              "Delvis indbetaling (selskabslovens § 33, stk. 1)",
              "Ved kontantindskud skal der til enhver tid være indbetalt mindst 25 % af kapitalen, dog altid mindst 20.000 kr. Ved apportindskud skal hele kapitalen plus evt. overkurs indbetales fuldt ud. Ved minimumskapital på 20.000 kr. er delvis indbetaling i praksis irrelevant.",
            ],
            [
              "Stiftelsesdokument (selskabslovens §§ 25-27)",
              "Stifterens navn og adresse (plus CVR hvis stifter er et selskab), tegningskurs, frister for tegning og indbetaling, stiftelsesomkostninger hvis selskabet bærer dem, dato for regnskabsmæssig/skattemæssig virkning (fx 1. januar ved tilbagevirkende kraft), oplysninger om evt. apportindskud med vedhæftet vurderingsberetning, samt vedtægterne.",
            ],
            [
              "Vedtægter (selskabslovens § 28)",
              "Skal indeholde: 1) navn og evt. binavne, 2) formål, 3) kapitalens størrelse og antal/pålydende af anparter, 4) anparternes rettigheder, 5) ledelsesorganer, 6) regler om indkaldelse til generalforsamling, 7) regnskabsår. Valgfrit efter § 29: forkøbsret, samtykkekrav ved overdragelse, stemmeretsforskelle m.v.",
            ],
            [
              "Ejerbog",
              "Føres fra stiftelsen med alle anparter, ejere og evt. panthavere. Privat dokument — ikke offentligt, men myndigheder kan kræve indsigt.",
            ],
            [
              "Legale ejere",
              "Ejere med mindst 5 % registreres i Det Offentlige Ejerregister — sker som del af stiftelsesflowet på Virk.",
            ],
            [
              "Reelle ejere",
              "Fysiske personer med mindst 25 % ejerskab eller kontrol registreres på Virk. For et enmands-ApS er du selv både legal og reel ejer med 100 %. Har selskabet ingen reelle ejere over grænsen, registreres ledelsen.",
            ],
            [
              "Registreringsfrist (selskabslovens § 40)",
              "Stiftelsen skal anmeldes til Erhvervsstyrelsen senest 2 uger efter underskrivelsen af stiftelsesdokumentet. Der skal indsendes bevis for, at kapitalen er indbetalt senest på registreringstidspunktet.",
            ],
          ],
        },
        {
          type: "advarsel",
          tekst:
            "To ting kan vælte hele stiftelsen: overskrides 2-ugers-fristen for anmeldelse, kan registrering slet ikke finde sted, og stiftelsen må gøres om. Og manglende registrering af reelle ejere kan medføre tvangsopløsning af selskabet.",
        },
        {
          type: "tip",
          tekst:
            "For et enmands-ApS er standardvedtægter normalt tilstrækkelige: 1 direktør, ingen bestyrelse (den er valgfri for ApS) og tegningsreglen „selskabet tegnes af en direktør“.",
        },
      ],
      kilder: [
        {
          titel: "Erhvervsstyrelsen — Vejledning: stiftelse af ApS og A/S",
          url: "https://erhvervsstyrelsen.dk/vejledning-stiftelse-af-aps-og-as",
        },
        {
          titel: "Selskabsloven § 33 (delvis indbetaling)",
          url: "https://danskelove.dk/selskabsloven/33",
        },
        {
          titel: "Selskabsloven § 40 (registreringsfrist)",
          url: "https://danskelove.dk/selskabsloven/40",
        },
        {
          titel: "Virk — Det Offentlige Ejerregister: registrér ejerforhold",
          url: "https://virk.dk/myndigheder/stat/ERST/selvbetjening/Det_Offentlige_Ejerregister/vejledning-registrer-ejerforhold/",
        },
      ],
    },
    {
      id: "virk-registrering",
      overskrift: "Virk.dk klik for klik: stiftelse af ApS'et",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Stiftelsen registreres i Webreg-løsningen: virk.dk → „Start virksomhed“ → „Opret et A/S eller ApS“. Kræver MitID. Bemærk: den detaljerede felt-rækkefølge nedenfor er delvist baseret på en tredjeparts-gennemgang af flowet (ikke fuldt verificeret — tjek kilden), og flowet kan ændre sig, men de krævede oplysninger er de samme.",
        },
        {
          type: "trin",
          trin: [
            {
              titel: "Log ind og vælg selskabsform",
              tekst:
                "Gå til virk.dk → „Start virksomhed“ → „Opret et A/S eller ApS“ (Webreg). Log ind med MitID og vælg virksomhedsformen Anpartsselskab (ApS). Skal du have holdingstruktur, kan holding-ApS'et stiftes i samme ombæring.",
            },
            {
              titel: "Navn og binavne",
              tekst:
                "Angiv selskabets navn (tjekkes automatisk mod registret) og op til 5 gratis binavne.",
            },
            {
              titel: "Hjemstedsadresse",
              tekst: "Angiv selskabets adresse — den må gerne være din privatadresse.",
            },
            {
              titel: "Formål",
              tekst:
                "Fritekst, der skal matche vedtægterne — fx „Selskabets formål er at drive virksomhed med webudvikling, softwareudvikling og hermed beslægtet virksomhed.“",
            },
            {
              titel: "Branchekode (NACE)",
              tekst: "Vælg branchekode — for webudvikling typisk 62.01.00 Computerprogrammering.",
            },
            {
              titel: "Regnskabsår og første regnskabsperiode",
              tekst:
                "Fx 1. januar-31. december. Første regnskabsperiode må være op til 18 måneder (årsregnskabslovens § 15, stk. 2); ved omdannelse pr. 1. januar vælges typisk 1/1-31/12 samme år.",
            },
            {
              titel: "Kapital og indskudsform",
              tekst:
                "Angiv beløb (min. 20.000 kr.), tegningskurs og indskudsform: kontant eller „andre værdier end kontanter“ (apportindskud). Ved apportindskud uploades vurderingsberetning og åbningsbalance.",
            },
            {
              titel: "Kapitaldokumentation",
              tekst:
                "Angiv e-mail på en „kapitalerklærer“ — bank, advokat eller godkendt revisor, der bekræfter kapitalens indbetaling/tilstedeværelse. Beviset skal foreligge senest ved registreringen.",
            },
            {
              titel: "Ledelse",
              tekst:
                "Registrér direktionen med mindst 1 direktør (dig; CPR valideres). Bestyrelse er valgfri for ApS og udelades normalt i enmandsselskaber.",
            },
            {
              titel: "Tegningsregel",
              tekst: "Fx „Selskabet tegnes af en direktør“.",
            },
            {
              titel: "Revision: til- eller fravalg",
              tekst:
                "Et nystiftet ApS kan fravælge revision allerede ved stiftelsen, hvis det ikke er revisionspligtigt (se afsnittet om årsrapport og revision).",
            },
            {
              titel: "Ejerforhold",
              tekst:
                "Registrér legale ejere (mindst 5 %) og reelle ejere (mindst 25 %) — for et enmands-ApS: dig selv med 100 % som begge dele.",
            },
            {
              titel: "Upload dokumenter og underskriv",
              tekst:
                "Upload stiftelsesdokument og vedtægter (plus vurderingsberetning ved apportindskud). Alle stiftere underskriver digitalt med MitID.",
            },
            {
              titel: "Betal gebyret",
              tekst:
                "670 kr. (2026), betales med kort i flowet — kan ikke betales kontant (beløbet er ikke fuldt verificeret mod Erhvervsstyrelsens gebyr-side — tjek kilden). CVR-nummer tildeles typisk straks eller inden for få dage; apportindskud kan udløse manuel sagsbehandling og tage længere.",
            },
            {
              titel: "Registrér skattepligter på det nye CVR",
              tekst:
                "I forlængelse af stiftelsen registreres moms — og senere arbejdsgiverpligter (A-skat/AM-bidrag), når du begynder at udbetale løn — på det nye CVR-nummer via virk.dk.",
            },
          ],
        },
      ],
      kilder: [
        {
          titel: "Virk — Webreg: start et A/S eller ApS",
          url: "https://virk.dk/myndigheder/stat/ERST/selvbetjening/Webreg_starte_AS_eller_ApS/",
        },
        {
          titel: "Erhvervsstyrelsen — Vejledning: stiftelse af ApS og A/S",
          url: "https://erhvervsstyrelsen.dk/vejledning-stiftelse-af-aps-og-as",
        },
        {
          titel: "Erhvervsstyrelsen — Gebyrer og takster",
          url: "https://erhvervsstyrelsen.dk/gebyrer-og-takster",
        },
      ],
    },
    {
      id: "apportindskud",
      overskrift: "Apportindskud og vurderingsberetning",
      blokke: [
        {
          type: "tekst",
          tekst:
            "Indskyder du virksomheden i stedet for kontanter (obligatorisk konstruktion ved skattefri omdannelse, valgfri ved skattepligtig), gælder selskabslovens §§ 36-37 om vurderingsberetning:",
        },
        {
          type: "liste",
          punkter: [
            "Vurderingsberetningen udarbejdes af en uvildig, godkendt revisor.",
            "Den skal indeholde: beskrivelse af indskuddet, vurderingsmetoden, det fastsatte vederlag og en erklæring om, at værdien mindst svarer til vederlaget (kapital plus evt. overkurs).",
            "Vurderingen må højst være 4 uger ældre end stiftelsesdokumentets underskrivelse — ellers skal der laves en ny.",
            "Når indskuddet er en bestående virksomhed, kræves desuden en åbningsbalance for selskabet — ved skattefri omdannelse inklusive hensættelse af udskudt skat.",
          ],
        },
        {
          type: "tip",
          tekst:
            "Typisk prisniveau (vejledende markedspriser fra brancheblogs, ikke officielle satser — ikke fuldt verificeret, indhent altid konkret tilbud): enkle vurderingsberetninger ca. 5.000-15.000 kr.; en komplet skattefri virksomhedsomdannelse inkl. opgørelse af anskaffelsessum typisk 15.000-25.000 kr. plus moms, op til 40.000-45.000 kr. med fuld juridisk pakke. En simpel webudviklingsvirksomhed uden ejendom og varelager ligger i den lave ende.",
        },
      ],
      kilder: [
        {
          titel: "Erhvervsstyrelsen — Vejledning: vurderingsberetninger ved registreringer",
          url: "https://erhvervsstyrelsen.dk/vejledning-anvendelse-af-vurderingsberetninger-ved-registreringer",
        },
        {
          titel: "Dinero — Skattefri virksomhedsomdannelse (markedspriser)",
          url: "https://dinero.dk/tips/skattefri-virksomhedsomdannelse/",
        },
      ],
    },
    {
      id: "moms-cvr-lukning",
      overskrift: "Bank, moms og lukning af det gamle CVR",
      blokke: [
        {
          type: "trin",
          trin: [
            {
              titel: "Opret erhvervskonto og NemKonto",
              tekst:
                "Opret bankkonto i selskabets navn og udpeg den som NemKonto — alle virksomheder med CVR-nummer skal have en (bruges bl.a. til udbetalinger fra det offentlige, fx negativ moms). Banken kræver typisk stiftelsesdokument, vedtægter, ejerbog og legitimation (hvidvaskregler); regn med ugers sagsbehandling og gebyrer, der varierer fra bank til bank.",
            },
            {
              titel: "Momsregistrér ApS'et på det nye CVR",
              tekst:
                "Registreringsgrænsen er 50.000 kr. momspligtig omsætning over 12 måneder, men registrér straks: at ApS'et er momsregistreret og fortsætter driften er en betingelse for momsfriheden ved overdragelsen, når den gamle virksomhed var momsregistreret. Momsregistreringen følger IKKE med fra enkeltmandsvirksomheden.",
            },
            {
              titel: "Gennemfør overdragelsen momsfrit",
              tekst:
                "Overdragelsen af virksomheden som samlet formuemasse er momsfri efter momslovens § 4, stk. 5, når køberen (ApS'et) momsregistreres og fortsætter driften.",
            },
            {
              titel: "Giv Skattestyrelsen meddelelse inden 8 dage",
              tekst:
                "Sælger (dig) skal give Skattestyrelsen meddelelse om overdragelsen inden 8 dage med køberens navn og adresse samt salgsprisen. Manglende meddelelse er ikke sanktioneret — men giv den alligevel, så papirsporet er rent.",
            },
            {
              titel: "Luk enkeltmandsvirksomheden",
              tekst:
                "Afmeld enkeltmandsvirksomheden via virk.dk („Luk virksomhed“). Det gamle CVR kan midlertidigt bruges til afsluttende TastSelv-indberetninger, fx sidste momsperiode (ikke fuldt verificeret — tjek kilden).",
            },
            {
              titel: "Flyt aftalerne til den nye juridiske enhed",
              tekst:
                "Gennemgå leverandør-, leje-, forsikrings- og bankaftaler samt kundekontrakter — de skal overdrages til eller nytegnes af ApS'et, som er en ny juridisk enhed med nyt CVR.",
            },
          ],
        },
      ],
      kilder: [
        {
          titel: "Juridisk vejledning D.A.11.1.3.2.4 — Momsfri virksomhedsoverdragelse",
          url: "https://info.skat.dk/data.aspx?oid=2085639",
        },
        {
          titel: "Skat.dk — Momsregistrering",
          url: "https://skat.dk/erhverv/moms/momsregistrering",
        },
        {
          titel: "Virksomhedsguiden — Omdannelse af personligt ejet virksomhed",
          url: "https://virksomhedsguiden.dk/content/ydelser/omdannelse-af-personligt-ejet-virksomhed/709c901c-8c9a-4409-ae6a-f1243fe7253f/",
        },
        {
          titel: "Virksomhedsguiden — Sådan får du NemKonto til din virksomhed",
          url: "https://virksomhedsguiden.dk/content/ydelser/saadan-faar-du-nemkonto-til-din-virksomhed/410823eb-4257-4f0d-af61-7b2279320b00/",
        },
      ],
    },
    {
      id: "loen-udbytte-skat",
      overskrift: "Løn, udbytte og skat — pengene er nu selskabets",
      blokke: [
        {
          type: "tekst",
          tekst:
            "I enkeltmandsvirksomheden var „løn“ bare private hævninger. I ApS'et er pengene selskabets, og du kan kun få dem ud som løn eller udbytte. Vil du udbetale løn til dig selv, skal ApS'et registreres som arbejdsgiver (A-skat/AM-bidrag) på virk.dk senest 8 dage efter første lønudbetaling (fristen stammer fra Virksomhedsguiden; bekendtgørelsens præcise ordlyd er ikke genlæst her — tjek kilden). Løn indberettes månedligt til eIndkomst via TastSelv Erhverv; selskabet indeholder A-skat og 8 % AM-bidrag, og der er ATP-pligt ved ansatte med mindst 9 timer om ugen. I praksis bruges et lønsystem som Salary, Zenegy eller Danløn. Udbytte besluttes på ordinær eller ekstraordinær generalforsamling; selskabet indeholder 27 % udbytteskat ved udlodningen og indberetter til Skattestyrelsen.",
        },
        {
          type: "tabel",
          kolonner: ["Sats/grænse", "Værdi 2026"],
          raekker: [
            ["AM-bidrag", "8 % af lønnen, før øvrige indkomstskatter"],
            ["Bundskat", "12,01 %"],
            ["Mellemskat", "7,5 % af personlig indkomst over 641.200 kr."],
            ["Topskat", "Yderligere 7,5 % over 777.900 kr."],
            ["Top-topskat", "Yderligere 5 % over 2.592.700 kr."],
            ["Personfradrag", "54.100 kr."],
            [
              "Skatteloft",
              "44,57 % — men det dækker kun bundskat + mellemskat + kommuneskat; topskat og top-topskat lægges OVENI loftet",
            ],
            [
              "Udbytteskat (aktieindkomst)",
              "27 % op til 79.400 kr., 42 % derover; ægtefæller samlet 158.800 kr. Grænsen stiger markant igen i 2027 (Iværksætterpakken)",
            ],
            ["Selskabsskat", "22 % (acontoskat betales i marts og november)"],
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Lån aldrig af selskabets konto: ulovlige kapitalejerlån beskattes hårdt hos dig personligt og skal indberettes. Adskillelsen mellem din og selskabets økonomi er absolut — hævninger uden om løn og udbytte er ikke en mulighed.",
        },
        {
          type: "tip",
          tekst:
            "Med lønjob ved siden af er regnestykket: overskud, du ikke skal bruge privat, kan blive stående i selskabet til 22 % i stedet for at ryge oven i lønindkomsten (hvor mellemskatten sætter ind fra 641.200 kr. og topskatten fra 777.900 kr. i 2026). Udbytte op til 79.400 kr./år beskattes kun med 27 % — kombineret med selskabsskatten giver det en effektiv skat på ca. 43,1 % under progressionsgrænsen og ca. 54,8 % over.",
        },
      ],
      kilder: [
        {
          titel: "Skatteministeriet — Personskatteloven, satser 2026",
          url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/personskatteloven",
        },
        {
          titel: "Skatteministeriet — Beløbsgrænser 2025-2026 (aktieindkomst)",
          url: "https://skm.dk/tal-og-metode/satser/regulering-af-beloebsgraenser/beloebsgraenser-i-skattelovgivningen-der-reguleres-efter-personskattelovens-20-2025-2026",
        },
        {
          titel: "Skatteministeriet — Selskabsskatteloven, satser",
          url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/selskabsskatteloven",
        },
        {
          titel: "Virksomhedsguiden — Registrér dig som arbejdsgiver",
          url: "https://virksomhedsguiden.dk/content/ydelser/registrer-dig-som-arbejdsgiver/5a0a6f46-577a-40f9-b5df-9b730bb30bbb/",
        },
      ],
    },
    {
      id: "aarsrapport-revision",
      overskrift: "Årsrapport, revision og selskabets faste pligter",
      blokke: [
        {
          type: "tekst",
          tekst:
            "ApS'et skal indberette årsrapport digitalt (XBRL) til Erhvervsstyrelsen via Regnskab Basis på Virk senest 6 måneder efter regnskabsårets udløb — 30. juni ved kalenderårsregnskab. Fristen er permanent og uden dispensationsmulighed. Første regnskabsår kan være op til 18 måneder (årsregnskabslovens § 15, stk. 2). Derudover skal selskabet indsende sit eget oplysningsskema (selskabsselvangivelse) til Skattestyrelsen og betale acontoselskabsskat i marts og november.",
        },
        {
          type: "tabel",
          kolonner: ["Forsinkelse med årsrapporten", "Personlig afgift pr. ledelsesmedlem"],
          raekker: [
            ["1. påbegyndte måned", "500 kr."],
            ["2. påbegyndte måned", "2.000 kr. i alt"],
            ["3. påbegyndte måned", "3.000 kr. i alt"],
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Afgifterne ved for sen årsrapport er personlige for hvert ledelsesmedlem — og fortsætter forsinkelsen, risikerer selskabet i sidste ende oversendelse til tvangsopløsning. Sæt fristen 30. juni i kalenderen fra dag 1.",
        },
        {
          type: "liste",
          punkter: [
            "Revision kan fravælges, hvis selskabet i 2 på hinanden følgende regnskabsår ikke overskrider 2 af 3 grænser: balancesum 4 mio. kr., nettoomsætning 8 mio. kr., 12 heltidsansatte.",
            "Et nystiftet ApS kan fravælge revision allerede ved stiftelsen (angives i stiftelsesdokumentet/Virk-flowet).",
            "Senere fravalg besluttes på ordinær generalforsamling med virkning fra det følgende regnskabsår; revisionspligten genindtræder automatisk, hvis grænserne overskrides. Visse brancher er undtaget fra fravalgsmuligheden.",
            "Fravalget gælder kun revisionen — årsrapporten skal stadig udarbejdes og indberettes hvert år.",
          ],
        },
      ],
      kilder: [
        {
          titel: "Erhvervsstyrelsen — Vejledning om årsrapporter",
          url: "https://erhvervsstyrelsen.dk/vejledning-aarsrapporter",
        },
        {
          titel: "Erhvervsstyrelsen — Beløbsgrænser ved fravalg af revision",
          url: "https://erhvervsstyrelsen.dk/virksomheder-overskrider-beloebsgraenser-ved-fravalg-af-revision",
        },
      ],
    },
    {
      id: "betaler-det-sig",
      overskrift: "Kan ApS betale sig for Camsilo? For, imod og tidslinje",
      blokke: [
        {
          type: "liste",
          punkter: [
            "FOR — begrænset hæftelse: du hæfter kun med indskuddet og oparbejdet egenkapital. Relevant ved større kundekontrakter med erstatningsrisiko. Men banker og udlejere kræver ofte personlig kaution af små ApS'er, og ansvar for fejl kan stadig ramme dig personligt — tegn professionel ansvarsforsikring uanset virksomhedsform.",
            "FOR — skatteoptimering med lønjob ved siden af: overskud kan blive stående i selskabet til 22 % i stedet for at lægge sig oven i lønindkomsten, og udbytte op til 79.400 kr./år (2026) beskattes kun med 27 %.",
            "FOR — troværdighed og salgbarhed: offentlig årsrapport og selskabsform signalerer soliditet over for større kunder, og et ApS er langt lettere at sælge, optage medejere i eller rejse kapital til.",
            "FOR — klar adskillelse af privat- og virksomhedsøkonomi.",
            "IMOD — virksomhedsordningen (VSO) giver næsten samme skatteudskydelse: opsparet overskud aconto-beskattes med 22 %, så selve „gem overskuddet til lav skat“-fordelen kræver ikke et ApS. VSO kræver dog skarp regnskabsmæssig adskillelse og typisk revisorhjælp.",
            "IMOD — flere omkostninger og pligter: stiftelsesgebyr 670 kr. plus evt. revisor 5.000-25.000 kr. (vejledende markedspriser — ikke fuldt verificeret), årlig offentlig årsrapport, lønadministration, generalforsamling og ejerregistre. Realistisk merudgift til bogholder/revisor på typisk 10.000-25.000 kr./år selv uden revisionspligt (skøn, ikke officiel sats).",
            "IMOD — pengene er selskabets: du kan ikke længere hæve frit, og ulovlige kapitalejerlån beskattes hårdt.",
            "IMOD — underskud: i enkeltmandsvirksomheden kan underskud modregnes i din lønindkomst; i et ApS er underskuddet låst inde i selskabet.",
          ],
        },
        {
          type: "tip",
          tekst:
            "Vælger du ApS: overvej at stifte et holding-ApS samtidig med „rullende kapital“ — de samme 20.000 kr. bruges til begge stiftelser. Udbytte fra driftsselskabet til holdingselskabet er skattefrit, og et senere salg af driftsselskabet kan ske skattefrit på holdingniveau. Tommelfingerregel: bliv i enkeltmandsvirksomheden (evt. med VSO), så længe du bruger overskuddet privat — ApS bliver interessant, når overskuddet varigt overstiger dit private forbrug, når løn plus virksomhedsoverskud nærmer sig mellemskattegrænsen på 641.200 kr. (2026), eller når du tager kontrakter med reel erstatningsrisiko.",
        },
        {
          type: "tabel",
          kolonner: ["Hvornår", "Hvad"],
          raekker: [
            [
              "Efterår 2026",
              "Beslut vej A/B med revisor; ved vej A: tjek VSO-indskudskontoen (negativ saldo udlignes inden 31/12-2026) og saml regnskab pr. 31/12-2026",
            ],
            ["1. januar 2027", "Omdannelsesdato/skæringsdato (statusdag 31/12-2026)"],
            [
              "Januar-juni 2027",
              "Revisor udarbejder vurderingsberetning (max 4 uger før underskrift), åbningsbalance, stiftelsesdokument, vedtægter og opgørelse af anskaffelsessum",
            ],
            [
              "Senest 30. juni 2027",
              "Stiftelsen gennemført (vej A-krav); Virk-anmeldelse senest 2 uger efter underskrift; gebyr 670 kr.",
            ],
            [
              "Senest 8 dage efter overdragelsen",
              "Momsmeddelelse til Skattestyrelsen (momsfri virksomhedsoverdragelse)",
            ],
            [
              "Senest 1 måned efter stiftelsen",
              "Alle dokumenter til Skattestyrelsen (vej A)",
            ],
            [
              "Løbende",
              "Erhvervskonto/NemKonto, momsregistrering af ApS'et, lukning af det gamle CVR, arbejdsgiverregistrering senest 8 dage efter første løn",
            ],
            [
              "Senest 30. juni 2028",
              "Første årsrapport (regnskabsåret 2027) til Erhvervsstyrelsen",
            ],
          ],
        },
        {
          type: "advarsel",
          tekst:
            "Alle satser er 2026-satser, hvor intet andet er angivet — progressionsgrænsen for aktieindkomst og personskattegrænserne reguleres årligt og stiger ekstraordinært i 2027 (Iværksætterpakken/personskattereformen). Denne guide er research, ikke rådgivning: få en revisor til at efterprøve valget mellem vej A og B på dine konkrete tal, før du underskriver noget.",
        },
      ],
      kilder: [
        {
          titel: "Skat.dk — Fra virksomhed til selskab",
          url: "https://skat.dk/erhverv/selskaber-fonde-og-foreninger/selskaber-og-fonde/generelt-om-selskaber-og-fonde/fra-virksomhed-til-selskab",
        },
        {
          titel: "Skatteministeriet — Personskatteloven, satser 2026",
          url: "https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/personskatteloven",
        },
        {
          titel: "Skatteministeriet — Beløbsgrænser 2025-2026",
          url: "https://skm.dk/tal-og-metode/satser/regulering-af-beloebsgraenser/beloebsgraenser-i-skattelovgivningen-der-reguleres-efter-personskattelovens-20-2025-2026",
        },
      ],
    },
  ],
};
