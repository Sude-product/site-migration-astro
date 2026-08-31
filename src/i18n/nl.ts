import type { Translations } from './types';

export const nl: Translations = {
  common: {
    lastUpdated: 'Laatst bijgewerkt',
    home: 'Startpagina',
  },
  nav: {
    products: 'PRODUCTEN',
    whyIdenfit: 'WAAROM IDENFIT',
    sectors: 'SECTOREN',
    pricing: 'PRIJZEN',
    customers: 'KLANTEN',
    company: 'BEDRIJF',
    discover: 'ONTDEK',
  },
  cta: {
    login: 'Inloggen',
    requestDemo: 'Demo Aanvragen',
    submit: 'Versturen',
  },
  hero: {
    title: 'Digitaliseer Al Uw\nHR-processen Nu!',
    description:
      'Met de holistische aanpak van idenfit voor human resources management beheert u alles van werving tot loonadministratie, van verlof tot prestaties — allemaal op één platform.',
    // 2026-08-19, echte NL-vertaling van de door de gebruiker aangeleverde
    // Engelse tagline (KARAR 1 — geen letterlijke kopie).
    headline: 'Mensen eerst. De rest, simpel.',
    subheadline:
      'Idenfit brengt HR, workforce management, salarisadministratie en employee experience samen — zodat uw teams zich kunnen richten op mensen, niet op processen.',
    emailPlaceholder: 'Uw Zakelijke E-mailadres',
    formName: 'Volledige Naam',
    formPhone: 'Telefoon',
    formPhoneError: 'Voer een geldig telefoonnummer in (bijv. 555 123 45 67)',
    formPhoneCountryLabel: 'Selecteer landcode',
    formPhoneCountrySearchPlaceholder: 'Zoek land...',
    formPhoneCountryNoResults: 'Geen resultaten gevonden',
    formCompany: 'Bedrijfsnaam',
    formEmail: 'E-mail',
    formMessage: 'Uw Bericht',
    formSubmit: 'Nu Aanvragen',
    ctaKeyword: 'Gratis Demo',
    kvkkNotice: {
      prefix: 'Ik accepteer de ',
      kvkkLinkText: 'Contact Web GDPR-verklaring',
      middle: ' en de ',
      termsLinkText: 'Gebruiksvoorwaarden',
      suffix: '.',
    },
    sideTitle: 'Holistische HR-toepassingen',
    sideSubtitle: 'Vraag vandaag nog een gratis online demo aan!',
    supportRequestLink: 'Klik hier voor een ondersteuningsverzoek',
    whatsappLabel: 'Stuur ons een bericht via WhatsApp',
    callLabel: 'Bel ons nu',
    // Online Sunum Talebi sayfasının kendi NL versiyonu YOK (`i18n.fallback`
    // ile `/en/online-sunum-talebi/`e yönleniyor, bkz. astro.config.mjs) —
    // bu alan asla render EDİLMİYOR, yalnızca tip tamlığı için EN'in gerçek
    // değerleriyle tutarlı Hollandaca karşılıklar verildi.
    presentationForm: {
      name: 'Volledige Naam',
      phone: 'Telefoonnummer',
      email: 'E-mail',
      company: 'Bedrijfsnaam',
      next: 'Doorgaan',
      back: 'Terug',
    },
    presentationTrustCaption: 'Sluit u aan bij 1.000+ klanten die idenfit vertrouwen.',
  },
  footer: {
    columnTitles: {
      about: 'OVER ONS',
      products: 'PRODUCTEN',
      general: 'ALGEMEEN',
    },
    links: {
      about: {
        story: 'Ons Verhaal',
        contact: 'Contact',
        blog: 'Blog',
        kvkk: 'Gegevensbeschermingsverklaring',
        security: 'Beveiliging',
        globalBrand: 'Doel Wereldwijd Merk',
      },
      products: {
        employeeRecords: 'Personeelsdossier',
        recruitment: 'Werving',
        performance: 'Prestaties',
        training: 'Trainingen',
        timesheet: 'Urenregistratie',
        leaveManagement: 'Verlofbeheer',
        hardware: 'Hardware',
        timeAttendance: 'Tijdregistratie',
      },
      general: {
        pricing: 'Prijzen & Modules',
        advantages: 'idenfit Voordelen',
        successStories: 'Succesverhalen',
        faq: 'Veelgestelde Vragen',
        consumerRights: 'Consumentenrechtenovereenkomst',
        securityPolicy: 'Privacy- en Beveiligingsbeleid',
        distanceSalesAgreement: 'Overeenkomst op Afstand',
      },
    },
    copyright: '© idenfit, {year}',
    privacy: 'Privacybeleid',
    kvkk: 'Gegevensbeschermingsverklaring',
    trustBadges: {
      ssl: 'SSL-beveiligingscertificaat',
      iso: 'ISO 27001-certificering voor informatiebeveiliging',
      peryon: 'Peryön (Turkse HR-vereniging) lidmaatschap',
      gdpr: 'GDPR-naleving',
    },
  },
  mega: {
    urunler: {
      intro: {
        title: '360° HR-programma',
        description:
          'Met de holistische aanpak van idenfit voor human resources management besparen HR-afdelingen tijd en creëren ze ruimte voor werk dat waarde toevoegt. Beheer al uw HR-processen van A tot Z op één platform.',
        faqLink: 'Veelgestelde Vragen',
      },
      employeeManagement: {
        title: 'Personeelsbeheer',
        overview: 'Overzicht',
        personalFile: 'Personeelsdossier',
        corporateCalendar: 'Bedrijfskalender',
        documents: 'Documenten',
        expenseManagement: 'Onkostenbeheer',
        training: 'Trainingen',
        assetManagement: 'Activabeheer',
        messages: 'Berichten',
        notes: 'Notities',
        shuttleServices: 'Personeelsvervoer',
        occupationalHealth: 'Bedrijfsgezondheid',
      },
      workforceManagement: {
        title: 'Werkkrachtbeheer',
        overview: 'Overzicht',
        timeAttendance: 'Tijdregistratie',
        timesheetTracking: 'Urenregistratie',
        leaveManagement: 'Verlofbeheer',
        payroll: 'Salarisadministratie',
      },
      talentManagement: {
        title: 'Talentmanagement',
        onboarding: 'Onboarding',
        offboarding: 'Offboarding',
        employeeExperience: 'Medewerkerservaring',
        survey: 'Enquête',
        performanceOkr: 'Prestaties/OKR',
        recruitmentAts: 'Werving/ATS',
      },
      hardwareManagement: {
        title: 'Hardwarebeheer',
        overview: 'Hardwarebeheer',
        integratedDevices: 'Geïntegreerde Apparaten',
        biometricDevices: 'Biometrische Apparaten',
        rfidDevices: 'RFID-apparaten',
        turnstiles: 'Draaihekken',
      },
      promo: {
        titleLines: ['LATER', 'IS', 'NEVER'],
        description: 'Vraag nu gratis HR-digitaliseringsadvies aan!',
        ctaText: 'NU STARTEN',
        imageAlt: 'HR-digitaliseringsadvies',
      },
    },
    sektorler: {
      title: 'Sectoren',
      food: 'Voeding',
      services: 'Diensten',
      tourism: 'Toerisme',
      retail: 'Retail',
      energy: 'Energie',
      healthcare: 'Zorg',
      education: 'Onderwijs',
      security: 'Beveiliging',
      facilityManagement: 'Facilitair Beheer',
      industryAutomotive: 'Industrie & Automotive',
      legalConsulting: 'Juridisch & Advies',
      logisticsDistribution: 'Distributie & Logistiek',
    },
    kurumsal: {
      title: 'Bedrijf',
      about: 'Over Ons',
      contact: 'Contact',
      faq: 'Veelgestelde Vragen',
      globalBrand: 'Doel Wereldwijd Merk',
      promo: {
        category: 'ZAKELIJK',
        title: 'Maak kennis met het idenfit-team',
        imageAlt: 'idenfit-team',
      },
    },
    kesfet: {
      contentTitle: 'Content',
      blog: 'Blog',
      blogDescription: 'Ontdek de nieuwste ontwikkelingen in HR en breid uw kennis verder uit.',
      digitalMaturityTest: 'Digitale HR-volwassenheidstest',
      digitalMaturityTestDescription: 'Ontdek uw score in 3 minuten en ontvang uw gratis routekaart.',
      calculatorsTitle: 'Berekeningen',
      overtimePay: 'Overwerkvergoeding Berekenen',
      incomeTax: 'Inkomstenbelasting Berekenen',
      employerCost: 'Werkgeverskosten Berekenen',
      severancePay: 'Ontslagvergoeding Berekenen',
      salaryRaise: 'Loonsverhoging Berekenen',
      corporateTax: 'Vennootschapsbelasting Berekenen',
      mealAllowance: 'Maaltijdvergoeding Berekenen',
      noticePeriod: 'Opzegtermijn en Vergoeding Berekenen',
      reportsTitle: 'Rapporten',
      generationsWorkforce: {
        category: 'HR-trends',
        title: 'De Invloed van Generaties op de Werkvloer',
        imageAlt: 'Omslag van het rapport De Invloed van Generaties op de Werkvloer',
      },
      dataDrivenRecruitment: {
        category: 'Data-gedreven',
        title: 'Gids voor Data-gedreven Werving',
        imageAlt: 'Omslag van de Gids voor Data-gedreven Werving',
      },
      digitalTransformation: {
        category: 'HR-transformatie',
        title: 'Gids: Digitalisering in 10 Stappen',
        imageAlt: 'Omslag van de Gids: Digitalisering in 10 Stappen',
      },
      strategicHr: {
        category: 'HR-trends',
        title: 'Gids voor Strategisch Human Resources',
        imageAlt: 'Omslag van de Gids voor Strategisch Human Resources',
      },
    },
    ui: {
      nextReports: 'Volgende rapporten',
      prevReports: 'Vorige rapporten',
    },
  },
  headerUi: {
    openMenu: 'Menu openen',
    closeMenu: 'Menu sluiten',
    brandHome: 'idenfit startpagina',
    mainNav: 'Hoofdmenu',
    langLabel: 'Taalkiezer',
  },
  customerStories: {
    heroTitle: 'Klant\nSuccesverhalen',
    heroDescription:
      'We delen de succesverhalen van een aantal bedrijven die graag met ons samenwerken en samen met ons zijn gegroeid.',
    ctaLabel: 'Direct aanvragen',
    videoComingSoon: 'Video volgt binnenkort',
    videoPlayLabel: 'Video afspelen',
    femas: {
      description:
        'Met de softwareondersteuning van idenfit hebben we het voor Femaş Group — actief op 5 continenten en in meer dan 100 landen — eenvoudig gemaakt om de hr- en workforcemanagementprocessen digitaal te beheren. Femaş Group beheert de dienstroosters en alle administratie van zijn 3.000 medewerkers nu overzichtelijk vanuit één idenfit-paneel, en bespaart daarmee tijd en werkdruk.',
      employeeCount: '3.000 medewerkers',
    },
    civil: {
      description:
        'Onze Civil-reis begon in 1996 in een winkel van 50 m² in Kartal, Istanbul. Vandaag, in ons 29e jaar, bereiken we via meer dan 100 winkels en ruim 3.000 collega\'s nog steeds miljoenen gezinnen.\n\nIn de categorieën moeder & zwangerschap, baby en kind brengen we kleding, schoenen, speelgoed, benodigdheden, babyverzorging en snel bewegende consumentenproducten zorgvuldig samen onder één dak, zodat we er altijd voor gezinnen kunnen zijn.\n\nMet onze principes van kwaliteit, vertrouwen en toegankelijke prijzen blijven we een voorkeurskeuze in Turkije en daarbuiten — met trots begeleiden we elke dag het verhaal van een nieuw gezin.',
      employeeCount: '3.000 medewerkers',
      secondaryStat: '112 winkels',
    },
    civilSecondary: {
      quote: {
        text:
          'De grootste waarde die de Civil-familie in onze 29-jarige reis naar succes heeft gebracht, zijn onze meer dan 3.000 collega\'s. Terwijl we deze sterke reis voortzetten, zijn we een samenwerking met idenfit aangegaan om onze band met onze medewerkers te digitaliseren en een transparantere, efficiëntere werkomgeving te creëren.\n\nWe hebben alle officiële documenten en goedkeuringsprocessen gedigitaliseerd — van dienstroosters tot verlofopvolging, van salarishandtekeningen tot overurenbeheer. Zo krijgen onze medewerkers veel eenvoudiger toegang tot hun rechten en verplichtingen.\n\nDankzij de zelfbedieningsstructuur van HR kunnen onze medewerkers hun loopbaanontwikkeling volgen, hun voordelen bekijken en informatie over maaltijden en pendeldiensten raadplegen. Actuele procedures en interne bedrijfscorrespondentie worden eveneens transparant gedeeld via idenfit.\n\nWij danken idenfit voor deze samenwerking, die ons heeft geholpen elk lid van de Civil-familie een doeltreffende, toegankelijke en duurzame HR-ervaring te bieden — en de tevredenheid en betrokkenheid van onze medewerkers heeft versterkt.',
        name: 'Mustafa Yıldıran',
        role: 'Voorzitter van de Raad van Bestuur van Civil',
      },
    },
    yatsan: {
      description:
        'Als Yatsan zijn we zes jaar geleden onze digitale transformatie met idenfit gestart om de HR-processen in onze fabriek en winkels efficiënter en sneller te beheren.\n\nMet de idenfit-applicatie hebben we veel processen naar de digitale omgeving verplaatst — van verlofbeheer tot loonadministratie, van in- en uitklokken tot documentbeheer — waardoor we onze operationele werklast verminderen.\n\nDaarnaast maken we via de idenfit mobiele app informatie zoals aankondigingen, enquêtes en menu\'s gemakkelijk toegankelijk voor onze medewerkers. Dankzij de klachten- en suggestieknop kunnen onze medewerkers hun ideeën snel met ons delen.',
      employeeCount: '900 medewerkers',
      secondaryStat: '40 winkels',
      quote: {
        text:
          'Met dit samenwerkingsverband hebben we onze HR-processen transparanter, toegankelijker en gebruiksvriendelijker gemaakt, terwijl we ook de medewerkerstevredenheid hebben verhoogd.',
        name: 'Müzeyyen Kıran Mergen',
        role: 'Manager Salarisadministratie, Personeelsdossiers en Administratieve Zaken',
      },
    },
    dogSer: {
      employeeCount: '250 medewerkers',
      secondaryStat: '10 locaties',
      quote: {
        text:
          'In ons projectgerichte bedrijf zijn onze HR-processen ten goede veranderd vanaf het moment dat we met idenfit gingen werken. Hun openheid voor innovatie en ontwikkeling, en hun klantgerichte aanpak bij het realiseren van onze wensen, sloten volledig aan bij onze behoeften en verwachtingen. Ook hun oplossingsgerichte ondersteuning bij elk probleem dat we tegenkwamen tijdens het digitaliseren van onze HR-processen was een belangrijke factor in onze langdurige samenwerking met idenfit. Dankzij idenfit beheren we nu eenvoudig onze urenregistratie en verlofopvolging digitaal, en verlopen onze processen soepel en met plezier.',
        name: 'Cem Çolak',
        role: 'Administratie & Financiën',
      },
    },
    tugbaKuruyemis: {
      employeeCount: '1.200 medewerkers',
      secondaryStat: '111 winkels',
      quote: {
        text:
          'Met de softwareondersteuning van idenfit hebben we Tuğba Kuruyemiş — dat zijn reis begon in 1980 en tegenwoordig via meer dan 100 winkels in heel Turkije actief is — geholpen om zijn HR- en workforcemanagementprocessen eenvoudig digitaal te beheren. Door routinematige administratie digitaal te beheren vanuit één idenfit-paneel, bespaart Tuğba Kuruyemiş ook op werkdruk bij het digitaliseren van zijn HR-processen.',
        name: 'Nevzat Atmaca',
      },
    },
    beyazFirin: {
      quote: {
        text:
          'idenfit leverde een service die zelfs vooruitliep op onze eigen wensen, en heeft ons hierin verder ontwikkeld. Een van de belangrijkste kenmerken is dat onze verzoeken daadwerkelijk worden opgevolgd. Alle verzoeken die uit de dagelijkse praktijk komen, worden geëvalueerd en het programma wordt daarop aangepast — de ontwikkeling hierin gaat werkelijk heel snel.',
        name: 'Nuri Sütlüoğlu',
        role: 'HR-manager',
      },
    },
    emreOzcan: {
      quote: {
        text:
          "Wat mij het meest opviel toen we Idenfit voor het eerst leerden kennen, was de praktische toepasbaarheid en de mogelijkheid om verschillende functies op één platform te bundelen. De eenvoudige interface maakte duidelijk dat onze medewerkers zich snel konden aanpassen. Voor bedrijven zoals het onze, die werken met intensieve en ploegenroosters, was het zien van een echt 'medewerkersvriendelijke digitale oplossing' van onschatbare waarde.",
        name: 'Emre Özcan',
        role: 'Manager Bedrijfscommunicatie',
      },
    },
    ismailUnal: {
      quote: {
        text:
          'Idenfit viel voor ons op door de mogelijkheid om end-to-end tijdregistratieprocessen te ontwerpen, de gebruiksvriendelijke interface en de veelzijdige oplossingen die inspelen op verschillende HR-behoeften via één applicatie.',
        name: 'İsmail Ünal',
        role: 'People & Culture Manager',
      },
    },
  },
  home: {
    logoStrip: {
      caption: 'Meer dan 1.000 tevreden klanten hebben samen met ons een digitale HR-transformatie gerealiseerd.',
    },
    dividers: {
      afterLogos: 'Vervang handmatige processen, vereenvoudig alle HR activiteiten',
      afterFeatures: 'Werk slimmer en verbeter de kwaliteit van belangrijke HR data',
    },
    featureGrid: {
      title: 'Slimme HR-oplossingen voor efficiente organisaties',
      intro:
        'Ontdek hoe de productiviteit verbetert, de betrokkenheid van werknemers versterkt en toekomstige strategieën zich ontwikkelt door inzicht te krijgen in hoe lang jullie werknemers werken, in welke rol ze zitten en in welke gemoedstoestand ze verkeren ten opzichte van hun werkzaamheden.',
      timeLeave: {
        title: 'Core HR, Tijd & Verlofbeheer',
        text: 'Beheer eenvoudig personeelsadministratie, tijd & aanwezigheid en verlof door onze Desktop platform voor je admin en handige app voor medewerkers.',
      },
      performance: {
        title: 'Prestatiebeheer',
        text: 'Geef teams de mogelijkheid om performance management meetbaar te maken. Faciliteer performance management traditioneel en/of 360 feedback.',
      },
      employeeExperience: {
        title: 'Voice of the Employee',
        text: 'Bied medewerkers een veilige werkomgeving en geef ze een veilige spreekbuis.',
      },
      analytics: {
        title: 'HR - Analyse',
        text: 'Optimaliseer de HR processen met bruikbare Analytics.',
      },
    },
    certifications: {
      titleLine1: 'Cloud Technologie',
      titleLine2: '& Kwaliteitsnormen',
      text:
        'Idenfit is een cloudgebaseerd platform waarmee u uw personeelsbestand eenvoudiger en veiliger kunt beheren. Dankzij meer dan 20 jaar ervaring in de sector voldoen al onze producten en diensten aan de ISO-normen (27001 en 9001), wat betrouwbaarheid en klanttevredenheid garandeert.',
    },
    video: {
      ctaAriaLabel: 'Meer informatie op de pagina Waarom Idenfit',
      title: 'Waarom kiezen voor Idenfit?',
      ctaText: 'Meer informatie',
      videoTitle: 'idenfit introductievideo',
      playLabel: 'Video afspelen',
    },
    efficiency: {
      title: '5 vragen om productiviteit te meten',
      text:
        'Zorg ervoor dat medewerkers het juiste werk doen, op de juiste plaats zijn en op het juiste moment. Werken in de cloud (SaaS) stelt iedereen met internettoegang in staat om hun eigen activiteiten te beheren en in te zien. Met onze plug & play oplossing wordt HR-data geharmoniseerd, wat de input, throughput en output van HR-data aanzienlijk verbetert.',
      imageAlt: '5 vragen om productiviteit te meten — idenfit dashboard screenshot',
    },
    panel: {
      title: 'Gebruiksvriendelijk dashboard',
      text:
        'Idenfit biedt een overzichtelijke, eenvoudige en intuïtieve interface waarmee alle HR-data op één plek geraadpleegd kan worden. Gedurende de gehele hire-to-retire cyclus kan de medewerker geadministreerd worden met onze HR core. Het dashboard is gebouwd voor de admin en naar persoonlijke voorkeur in te stellen.',
      features: ['Realtime Inzichten', 'Herinneringen', 'Live Monitoring'],
      imageAlt: 'idenfit gebruiksvriendelijk dashboard screenshot',
    },
    suprema: {
      title: 'Een Tijdregistratieplatform Geïntegreerd Met Alle Hardware',
      text:
        'Dankzij de integratie van Idenfit met gezichtsherkenning en vingerafdrukscanners kan de identiteit van medewerkers in realtime worden geverifieerd. Ook het bijhouden van in- en uitklokken tijdens shifts en pauzes kan eenvoudig beheerd worden.',
    },
    testimonials: {
      title: 'Verbeter de werknemerservaring',
      intro:
        'Wij bieden mensgerichte oplossingen waarmee bedrijven hun werkplekbeleving en de werknemerservaring kunnen verbeteren.',
      prevLabel: 'Vorige ervaring',
      nextLabel: 'Volgende ervaring',
      ismailUnal: {
        quote:
          'Idenfit viel voor ons op door de mogelijkheid om end-to-end tijdregistratieprocessen te ontwerpen, de gebruiksvriendelijke interface en de veelzijdige oplossingen die inspelen op verschillende HR-behoeften via één applicatie.',
        jobTitle: 'Zsa Zsa Zsu - People & Culture Manager',
      },
      emreOzcan: {
        quote:
          "Wat mij het meest opviel toen we Idenfit voor het eerst leerden kennen, was de praktische toepasbaarheid en de mogelijkheid om verschillende functies op één platform te bundelen. De eenvoudige interface maakte duidelijk dat onze medewerkers zich snel konden aanpassen. Voor bedrijven zoals het onze, die werken met intensieve en ploegenroosters, was het zien van een echt 'medewerkersvriendelijke digitale oplossing' van onschatbare waarde.",
        jobTitle: 'HAVAİST - Manager Bedrijfscommunicatie',
      },
    },
    customerCarousel: {
      title: 'Klantverhalen',
      intro: 'Echte ervaringen van bedrijven die hun HR-processen transformeren met idenfit.',
      prevLabel: 'Vorig verhaal',
      nextLabel: 'Volgend verhaal',
      readMoreLabel: 'Lees meer',
      civilVideo: { headline: 'Bekijk hoe Civil zijn HR-processen transformeerde met idenfit' },
      femasVideo: { headline: 'Bekijk hoe Femaş zijn HR-processen transformeerde met idenfit' },
      tugbaKuruyemis: { headline: 'Tuğba Kuruyemiş beheert zijn HR-processen vanuit één paneel met idenfit' },
      beyazFirinVideo: { headline: 'Bekijk hoe Beyaz Fırın zijn HR-processen transformeerde met idenfit' },
      ibisStylesVideo: { headline: 'Bekijk hoe ibis Styles Hotels zijn HR-processen transformeerde met idenfit' },
      ibisStylesQuote: {
        text: 'Ons hotel gebruikt idenfit vanaf de dag dat het werd geopend. Een van de dingen die mij het meest aanspraken aan idenfit, en de belangrijkste reden waarom we ervoor kozen, was het concept dat idenfit introduceerde. Het liet alles los waar we aan gewend waren — kaartlezers, tourniquetsystemen of handmatig ondertekenen. Onze collega\'s kunnen nu via de mobiele app in- en uitklokken, en het feit dat wij dit direct en mobiel van overal kunnen volgen, heeft onze prestaties ook verbeterd.',
        name: 'Tolga Avcı',
        jobTitle: 'ibis Styles Hotels - Algemeen Directeur',
      },
    },
    faq: {
      viewAllLink: 'Bekijk Alle Vragen',
    },
  },
  faqPage: {
    pdfLabel: 'PDF DOWNLOADEN',
    // NL'nin kendi `/nl/faq/` sayfası yok (`i18n.fallback: { nl: 'en' }`
    // ile `/en/faq/`'e yönleniyor) — bu alan yine de dolduruldu (KARAR 1,
    // gerçek çeviri kuralı, placeholder değil), ileride NL sayfası
    // eklenirse hazır olsun diye.
    metaDescription:
      'Vind antwoorden op veelgestelde vragen over idenfit — algemene info, prijzen, installatie, klantenservice en gegevensbeveiliging.',
  },
  sectorPage: {
    modulesHeading: 'Modules Speciaal voor Deze Sector',
  },
  notFound: {
    pageTitle: 'Pagina Niet Gevonden',
    metaDescription:
      'De pagina die u zoekt kon niet worden gevonden. Ga terug naar de idenfit homepage of bekijk populaire pagina\'s zoals Blog, Contact en Prijzen.',
    heading: 'Pagina Niet Gevonden',
    description:
      'De pagina die u zoekt is mogelijk verplaatst, verwijderd of heeft nooit bestaan. Ga terug naar de homepage of bekijk hieronder enkele populaire pagina\'s.',
    backHomeButton: 'Terug naar Homepage',
    popularLinksTitle: 'Populaire Pagina\'s',
  },
};
