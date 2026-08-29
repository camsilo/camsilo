export type Lang = "da" | "en";

export const STORAGE_KEY = "camsilo_lang";

export const dict = {
  da: {
    metaTitle: "Camsilo — dansk softwarestudie",
    skipToContent: "Spring til indhold",

    navProducts: "Produkter",
    navServices: "Ydelser",
    navAbout: "Om",
    navContact: "Kontakt",

    heroKicker: "Softwarestudie · Danmark",
    heroTitleA: "Software,",
    heroTitleB: "smedet i Norden.",
    heroSub:
      "Camsilo designer og bygger digitale produkter — webapplikationer, fagværktøjer og AI-integration. Fra første idé til drift i produktion.",
    heroCtaPrimary: "Se vores produkter",
    heroCtaSecondary: "Kontakt os",
    heroRuneNote: "ᚲ — kaunan, runen for K/C. Også kendt som en vinkelparentes.",

    productsLabel: "01 — Produkter",
    productsTitle: "Bygget af Camsilo",
    termoTag: "Live · termocalc.dk",
    termoTitle: "TermoCalc",
    termoDesc:
      "Beregnings- og læringsplatform til teknisk isolering. Ingeniørkalkulatorer efter DS 452 og EN ISO 12241, kompendium, prøver og AI-assistent — brugt i både undervisning og praksis.",
    termoLink: "Besøg termocalc.dk",
    disceboTag: "Live · discebo.dk",
    disceboTitle: "Discebo",
    disceboDesc:
      "Det faglige og sociale netværk for håndværkere. Materiale til over 120 fag og uddannelser, beregnere med 3D-visning og pladeudfoldning, projekt- og byggepladsstyring, timeregistrering med løneksport — og et firmalag med roller og rettigheder. Ét login, hele værkstedet.",
    disceboLink: "Besøg discebo.dk",

    servicesLabel: "02 — Ydelser",
    servicesTitle: "Hvad vi smeder",
    s1Title: "Webapplikationer & SaaS",
    s1Desc:
      "Produktionsklare webprodukter fra første streg til drift — frontend, backend, data og betaling.",
    s2Title: "Fagværktøjer & beregnere",
    s2Desc:
      "Domænespecifikke kalkulatorer og systemer, der følger virkelighedens standarder og tal — ikke omtrentligheder.",
    s3Title: "AI-integration",
    s3Desc:
      "Assistenter, automatisering og søgning bygget på sprogmodeller — forankret i jeres faglighed og data.",
    s4Title: "Drift & deployment",
    s4Desc:
      "Hosting, domæner, CI og overvågning. Vi sejler det i havn — og holder det flydende.",

    aboutLabel: "03 — Om",
    aboutTitle: "Få ting. Gjort ordentligt.",
    aboutBody:
      "Camsilo er et lille dansk softwarestudie. Vi tror på små hold, skarpe værktøjer og håndværk, der holder — software bygget som langskibe: let, stærkt og lavet til at sejle langt.",
    v1Title: "Enkelhed",
    v1Desc: "Det enkleste, der løser opgaven — og ikke mere.",
    v2Title: "Præcision",
    v2Desc: "Rigtige tal, rigtige standarder, ingen skøn.",
    v3Title: "Holdbarhed",
    v3Desc: "Bygget til drift, ikke til demo.",

    contactLabel: "04 — Kontakt",
    contactTitle: "Skal vi bygge noget sammen?",
    contactBody: "Skriv til os — vi svarer hurtigt.",
    contactCta: "kontakt@camsilo.dk",

    formNavn: "Navn",
    formNavnPlaceholder: "Dit navn",
    formEmail: "E-mail",
    formEmailPlaceholder: "dig@eksempel.dk",
    formEmne: "Emne",
    formEmnePlaceholder: "Hvad drejer det sig om? (valgfrit)",
    formBesked: "Besked",
    formBeskedPlaceholder: "Fortæl kort om projektet eller idéen …",
    formSend: "Send besked",
    formSender: "Sender …",
    formOk: "Tak — din besked er sendt. Vi vender tilbage hurtigt.",
    formFejl: "Noget gik galt. Prøv igen, eller skriv direkte til os.",
    formUgyldig: "Tjek lige navn, e-mail og besked.",
    contactOrPre: "… eller skriv direkte til ",

    footerLine: "© 2026 Camsilo · Danmark",
    footerCvr: "CVR-nr. 45925145 · Enkeltmandsvirksomhed",
    footerRunes: "ᚲᚨᛗᛋᛁᛚᛟ — Camsilo i ældre futhark",
  },
  en: {
    metaTitle: "Camsilo — Danish software studio",
    skipToContent: "Skip to content",

    navProducts: "Work",
    navServices: "Services",
    navAbout: "About",
    navContact: "Contact",

    heroKicker: "Software studio · Denmark",
    heroTitleA: "Software,",
    heroTitleB: "forged in the North.",
    heroSub:
      "Camsilo designs and builds digital products — web applications, professional tools and AI integration. From first idea to running in production.",
    heroCtaPrimary: "See our products",
    heroCtaSecondary: "Get in touch",
    heroRuneNote: "ᚲ — kaunan, the rune for K/C. Also known as an angle bracket.",

    productsLabel: "01 — Work",
    productsTitle: "Built by Camsilo",
    termoTag: "Live · termocalc.dk",
    termoTitle: "TermoCalc",
    termoDesc:
      "Calculation and learning platform for technical insulation. Engineering calculators per DS 452 and EN ISO 12241, study material, exams and an AI assistant — used in classrooms and in the field.",
    termoLink: "Visit termocalc.dk",
    disceboTag: "Live · discebo.dk",
    disceboTitle: "Discebo",
    disceboDesc:
      "The professional and social network for skilled trades. Material for more than 120 trades and programmes, calculators with 3D views and sheet-metal development, project and site management, time tracking with payroll export — and a company layer with roles and permissions. One login, the whole workshop.",
    disceboLink: "Visit discebo.dk",

    servicesLabel: "02 — Services",
    servicesTitle: "What we forge",
    s1Title: "Web applications & SaaS",
    s1Desc:
      "Production-grade web products from first sketch to operations — frontend, backend, data and billing.",
    s2Title: "Professional tools & calculators",
    s2Desc:
      "Domain-specific calculators and systems that follow real-world standards and real numbers — no approximations.",
    s3Title: "AI integration",
    s3Desc:
      "Assistants, automation and search built on language models — grounded in your domain and your data.",
    s4Title: "Operations & deployment",
    s4Desc:
      "Hosting, domains, CI and monitoring. We sail it home — and keep it afloat.",

    aboutLabel: "03 — About",
    aboutTitle: "Few things. Done properly.",
    aboutBody:
      "Camsilo is a small Danish software studio. We believe in small teams, sharp tools and craftsmanship that lasts — software built like longships: light, strong and made to sail far.",
    v1Title: "Simplicity",
    v1Desc: "The simplest thing that solves the task — and nothing more.",
    v2Title: "Precision",
    v2Desc: "Real numbers, real standards, no guesswork.",
    v3Title: "Durability",
    v3Desc: "Built for production, not for the demo.",

    contactLabel: "04 — Contact",
    contactTitle: "Shall we build something together?",
    contactBody: "Write to us — we reply fast.",
    contactCta: "kontakt@camsilo.dk",

    formNavn: "Name",
    formNavnPlaceholder: "Your name",
    formEmail: "Email",
    formEmailPlaceholder: "you@example.com",
    formEmne: "Subject",
    formEmnePlaceholder: "What's it about? (optional)",
    formBesked: "Message",
    formBeskedPlaceholder: "Tell us briefly about the project or idea …",
    formSend: "Send message",
    formSender: "Sending …",
    formOk: "Thanks — your message has been sent. We'll get back to you soon.",
    formFejl: "Something went wrong. Please try again, or email us directly.",
    formUgyldig: "Please check your name, email and message.",
    contactOrPre: "… or email us directly at ",

    footerLine: "© 2026 Camsilo · Denmark",
    footerCvr: "Company reg. (CVR) no. 45925145 · Sole proprietorship",
    footerRunes: "ᚲᚨᛗᛋᛁᛚᛟ — Camsilo in Elder Futhark",
  },
} as const;

export type Dict = (typeof dict)[Lang];
