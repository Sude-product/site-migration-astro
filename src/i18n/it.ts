import type { Translations } from './types';

export const it: Translations = {
  common: {
    lastUpdated: 'Ultimo aggiornamento',
    home: 'Home',
    formSubmitting: 'Invio in corso…',
    formSubmitError: 'Qualcosa è andato storto — riprova tra poco.',
  },
  nav: {
    products: 'PRODOTTI',
    whyIdenfit: 'PERCHÉ IDENFIT',
    sectors: 'SETTORI',
    pricing: 'PREZZI',
    customers: 'CLIENTI',
    company: 'AZIENDA',
    discover: 'ESPLORA',
  },
  cta: {
    login: 'Accedi',
    requestDemo: 'Richiedi una Demo',
    submit: 'Invia',
  },
  hero: {
    // ⚠️ DÜZELTME (2026-08-04): title/description/formSubmit/sideSubtitle/
    // supportRequestLink canlı `idenfit.com/it/` ile element-ID doğrulamalı
    // (`0c8eb2b`/`4ec6dae`/`43e32bd`/`68737fd`/`a4b5bd9`) yeniden ölçüldü —
    // önceki değerler kaynak sitenin güncellenmesinden ÖNCEki bir
    // snapshot'a aitti. **Not:** formName/formPhone/formCompany alanları
    // BİLİNÇLİ olarak DOKUNULMADI — kaynağın kendi ana sayfa form widget'ı
    // (`43e32bd`) bu 3 alanda GERÇEK bir kaynak-taraflı etiket kayması bug'ı
    // taşıyor (name alanı "Numero di Telefono", tel alanı "Nome Azienda"
    // gösteriyor) — güvenilir bir "doğru" değer YOK, körü körüne
    // kopyalanmadı (bkz. sohbet günlüğü).
    title: 'Digitalizza Ora Tutti i Processi\ndelle Risorse Umane!',
    description:
      "Gestisci tutti i processi HR su un'unica piattaforma, dalla gestione delle prestazioni al monitoraggio delle buste paga e delle ferie, oltre alla gestione degli asset e dell'inventario.",
    // 2026-08-19, traduzione reale della tagline inglese fornita dall'utente
    // (KARAR 1 — non una copia letterale).
    headline: 'Le persone al centro. Il resto, semplice.',
    subheadline:
      "Idenfit unisce HR, gestione della forza lavoro, payroll ed employee experience in un'unica piattaforma, così i tuoi team possono concentrarsi sulle persone, non sui processi.",
    emailPlaceholder: 'La Tua Email Aziendale',
    formName: 'Nome e Cognome',
    formPhone: 'Telefono',
    formPhoneError: 'Inserisci un numero di telefono valido (es. 555 123 45 67)',
    formPhoneCountryLabel: 'Seleziona il prefisso',
    formPhoneCountrySearchPlaceholder: 'Cerca un paese...',
    formPhoneCountryNoResults: 'Nessun risultato trovato',
    formCompany: 'Nome Azienda',
    formEmail: 'Email',
    formMessage: 'Il Tuo Messaggio',
    formSubmit: 'Inizia Ora',
    ctaKeyword: 'Demo Gratuita',
    kvkkNotice: {
      prefix: "Accetto l'",
      kvkkLinkText: 'Informativa GDPR Web Contatti',
      middle: ' e le ',
      termsLinkText: "Condizioni d'Uso",
      suffix: '.',
    },
    sideTitle: 'Applicazioni HR Olistiche',
    sideSubtitle: 'Un Ponte in Tempo Reale tra Dipendenti e Risorse Umane',
    supportRequestLink: 'Clicca qui per richiedere assistenza!',
    whatsappLabel: 'Scrivici su WhatsApp',
    callLabel: 'Chiamaci ora',
    presentationForm: {
      name: 'Nome Completo',
      phone: 'Numero di Telefono',
      email: 'E-mail',
      company: 'Nome Azienda',
      next: 'Continua',
      back: 'Indietro',
    },
    presentationTrustCaption: 'Unisciti a oltre 1.000 clienti che si fidano di idenfit.',
    presentationTimeline: {
      title: 'idenfit in 3 Passi',
      steps: [
        { title: '1. Registrati', text: 'Crea il tuo account: la configurazione si completa entro 48 ore.' },
        { title: '2. Importa i Tuoi Dati', text: 'Carica i dati dei dipendenti con importazione massiva tramite Excel.' },
        { title: '3. Inizia a Gestire', text: 'Gestisci entrate/uscite, ferie e buste paga in tempo reale dal pannello live.' },
      ],
    },
    presentationFeatures: {
      title: 'Funzionalità Principali',
      items: [
        { title: 'Gestione HR Completa', text: 'Dati anagrafici centralizzati, onboarding/offboarding monitorati per attività.' },
        { title: 'Tempo, Turni e Rilevazione Presenze', text: 'Monitoraggio live di entrate/uscite, completamento da mobile dei dati mancanti.' },
        { title: 'Flussi di Approvazione e Richieste', text: 'Ferie, spese, anticipi, straordinari, trasferte — con meccanismi di approvazione gerarchici.' },
        { title: 'Buste Paga e Gestione Documentale', text: 'Accesso mobile criptato, documenti del personale conservati in sicurezza.' },
        { title: 'Performance, Formazione, Comunicazione', text: 'Valutazione a 360 gradi, pianificazione della formazione, feedback anonimo.' },
        { title: 'Flessibilità nelle Operazioni Massive', text: 'Importazione massiva dei dati tramite Excel, assegnazione di ruoli/turni/ferie a centinaia di dipendenti con un clic.' },
      ],
    },
  },
  footer: {
    columnTitles: {
      about: 'CHI SIAMO',
      products: 'PRODOTTI',
      general: 'GENERALE',
    },
    links: {
      about: {
        story: 'La Nostra Storia',
        contact: 'Contatti',
        blog: 'Blog',
        kvkk: 'Informativa sulla Protezione dei Dati',
        security: 'Sicurezza',
        globalBrand: 'Obiettivo Brand Globale',
      },
      products: {
        employeeRecords: 'Fascicolo Dipendente',
        recruitment: 'Selezione del Personale',
        performance: 'Performance',
        training: 'Formazione',
        timesheet: 'Rilevazione Presenze',
        leaveManagement: 'Gestione Ferie e Permessi',
        hardware: 'Hardware',
        timeAttendance: 'Controllo Accessi',
      },
      general: {
        pricing: 'Prezzi e Moduli',
        advantages: 'Vantaggi idenfit',
        successStories: 'Storie di Successo',
        faq: 'Domande Frequenti',
        consumerRights: 'Accordo sui Diritti dei Consumatori',
        securityPolicy: 'Informativa sulla Privacy e Sicurezza',
        distanceSalesAgreement: 'Accordo di Vendita a Distanza',
      },
    },
    copyright: '© idenfit, {year}',
    privacy: 'Informativa sulla Privacy',
    kvkk: 'Informativa sulla Protezione dei Dati',
    trustBadges: {
      ssl: 'Certificato di Sicurezza SSL',
      iso: 'Certificazione ISO 27001 per la Gestione della Sicurezza delle Informazioni',
      peryon: 'Iscrizione a Peryön (associazione turca delle risorse umane)',
      gdpr: 'Conformità GDPR',
    },
  },
  mega: {
    urunler: {
      intro: {
        title: 'Programma HR 360°',
        description:
          "Con l'approccio olistico di idenfit alla gestione delle risorse umane, i reparti HR risparmiano tempo e possono concentrarsi su attività a maggior valore. Gestisci tutti i tuoi processi HR dalla A alla Z su un'unica piattaforma.",
        faqLink: 'Domande Frequenti',
      },
      employeeManagement: {
        title: 'Gestione del Personale',
        overview: 'Panoramica',
        personalFile: 'Fascicolo Dipendente',
        corporateCalendar: 'Calendario Aziendale',
        documents: 'Documenti',
        expenseManagement: 'Gestione Spese',
        training: 'Formazione',
        assetManagement: 'Gestione Beni Aziendali',
        messages: 'Messaggi',
        notes: 'Note',
        shuttleServices: 'Servizi Navetta',
        occupationalHealth: 'Salute sul Lavoro',
      },
      workforceManagement: {
        title: 'Gestione della Forza Lavoro',
        overview: 'Panoramica',
        timeAttendance: 'Controllo Accessi',
        timesheetTracking: 'Rilevazione Presenze',
        leaveManagement: 'Gestione Ferie e Permessi',
        payroll: 'Buste Paga',
      },
      talentManagement: {
        title: 'Gestione dei Talenti',
        onboarding: 'Onboarding',
        offboarding: 'Offboarding',
        employeeExperience: 'Esperienza del Dipendente',
        survey: 'Sondaggio',
        performanceOkr: 'Performance/OKR',
        recruitmentAts: 'Selezione del Personale/ATS',
      },
      hardwareManagement: {
        title: 'Gestione Hardware',
        overview: 'Gestione Hardware',
        integratedDevices: 'Dispositivi Integrati',
        biometricDevices: 'Dispositivi Biometrici',
        rfidDevices: 'Dispositivi RFID',
        turnstiles: 'Tornelli',
      },
      promo: {
        titleLines: ['LATER', 'IS', 'NEVER'],
        description: 'Richiedi ora una consulenza gratuita per la digitalizzazione HR!',
        ctaText: 'INIZIA ORA',
        imageAlt: 'Consulenza per la digitalizzazione HR',
      },
    },
    sektorler: {
      title: 'Settori',
      food: 'Alimentare',
      services: 'Servizi',
      tourism: 'Turismo',
      retail: 'Retail',
      energy: 'Energia',
      healthcare: 'Sanità',
      education: 'Istruzione',
      security: 'Sicurezza',
      facilityManagement: 'Facility Management',
      industryAutomotive: 'Industria e Automotive',
      legalConsulting: 'Legale e Consulenza',
      logisticsDistribution: 'Logistica e Distribuzione',
    },
    kurumsal: {
      title: 'Azienda',
      about: 'Chi Siamo',
      contact: 'Contatti',
      faq: 'Domande Frequenti',
      globalBrand: 'Obiettivo Brand Globale',
      promo: {
        category: 'AZIENDALE',
        title: 'Conosci il team idenfit',
        description: 'Siamo al tuo fianco con soluzioni sicure, innovative e centrate sulle persone.',
        imageAlt: 'illustrazione di soluzioni digitali sicure idenfit',
      },
    },
    kesfet: {
      contentTitle: 'Contenuti',
      blog: 'Blog',
      blogDescription: 'Scopri le novità nel mondo delle risorse umane e porta le tue conoscenze oltre.',
      digitalMaturityTest: 'Test di Maturità Digitale HR',
      digitalMaturityTestDescription: 'Scopri il tuo punteggio in 3 minuti e ricevi la tua roadmap gratuita.',
      calculatorsTitle: 'Calcolatori',
      overtimePay: 'Calcolo Straordinari',
      incomeTax: 'Calcolo IRPEF',
      employerCost: 'Calcolo Costo del Lavoro',
      severancePay: 'Calcolo TFR',
      salaryRaise: 'Calcolo Aumento Salariale',
      corporateTax: 'Calcolo IRES',
      mealAllowance: 'Calcolo Buoni Pasto',
      noticePeriod: 'Calcolo Periodo di Preavviso e Indennità',
      reportsTitle: 'Report',
      generationsWorkforce: {
        category: 'Trend HR',
        title: "L'Impatto delle Generazioni sulla Forza Lavoro",
        imageAlt: "Copertina del report L'Impatto delle Generazioni sulla Forza Lavoro",
      },
      dataDrivenRecruitment: {
        category: 'Data-Driven',
        title: 'Guida al Reclutamento Basato sui Dati',
        imageAlt: 'Copertina della Guida al Reclutamento Basato sui Dati',
      },
      digitalTransformation: {
        category: 'Trasformazione HR',
        title: 'Guida alla Digitalizzazione in 10 Passi',
        imageAlt: 'Copertina della Guida alla Digitalizzazione in 10 Passi',
      },
      strategicHr: {
        category: 'Trend HR',
        title: 'Guida Strategica alle Risorse Umane',
        imageAlt: 'Copertina della Guida Strategica alle Risorse Umane',
      },
    },
    ui: {
      nextReports: 'Report successivi',
      prevReports: 'Report precedenti',
    },
  },
  headerUi: {
    openMenu: 'Apri menu',
    closeMenu: 'Chiudi menu',
    brandHome: 'idenfit home',
    mainNav: 'Menu principale',
    langLabel: 'Selettore lingua',
  },
  customerStories: {
    heroTitle: 'Storie di\nSuccesso dei Clienti',
    heroDescription:
      'Condividiamo le storie di successo di alcune delle aziende che amano lavorare con noi e sono cresciute insieme a noi.',
    ctaLabel: 'Richiedi Ora',
    videoComingSoon: 'Video in arrivo',
    videoPlayLabel: 'Riproduci video',
    femas: {
      description:
        'Grazie al supporto software di idenfit, abbiamo permesso a Femaş Group — attivo in 5 continenti e in oltre 100 paesi — di gestire facilmente in digitale i propri processi di gestione delle risorse umane e della forza lavoro. Femaş Group gestisce ora la pianificazione dei turni e tutta la documentazione dei suoi 3.000 dipendenti da un unico pannello idenfit, risparmiando tempo e carico di lavoro.',
      employeeCount: '3.000 dipendenti',
    },
    civil: {
      description:
        'Il nostro percorso Civil è iniziato nel 1996 in un negozio di 50 m² a Kartal, Istanbul. Oggi, nel nostro 29° anno, continuiamo a raggiungere milioni di famiglie attraverso oltre 100 negozi e più di 3.000 colleghi.\n\nNelle categorie mamma & gestante, neonato e bambino, selezioniamo con cura abbigliamento, calzature, giocattoli, articoli per l\'infanzia, prodotti per la cura del bebè e beni di largo consumo sotto un unico tetto, per essere sempre presenti per le famiglie quando ne hanno bisogno.\n\nGuidati dai nostri principi di qualità, fiducia e prezzi accessibili, restiamo una scelta preferita in Turchia e all\'estero — orgogliosi di accompagnare ogni giorno la storia di una nuova famiglia.',
      employeeCount: '3.000 dipendenti',
      secondaryStat: '112 negozi',
    },
    civilSecondary: {
      quote: {
        text:
          "Il valore più grande che ha portato la famiglia Civil al successo nel nostro percorso di 29 anni sono i nostri oltre 3.000 colleghi. Continuando questo importante percorso, abbiamo collaborato con idenfit per digitalizzare il nostro legame con i dipendenti e creare un ambiente di lavoro più trasparente ed efficiente.\n\nAbbiamo digitalizzato tutti i processi di documentazione e approvazione ufficiali, dai turni di lavoro al monitoraggio delle ferie, dalle firme sulle buste paga alla gestione degli straordinari. Questo permette ai nostri dipendenti di accedere molto più facilmente ai propri diritti e doveri.\n\nGrazie alla struttura HR self-service, i nostri dipendenti possono seguire il proprio sviluppo di carriera, consultare i propri benefit e accedere alle informazioni su mensa e trasporto navetta. Anche le procedure aggiornate e la corrispondenza interna aziendale vengono condivise in modo trasparente tramite idenfit.\n\nRingraziamo idenfit per questa collaborazione, che ci ha aiutato a offrire a ogni membro della famiglia Civil un'esperienza di risorse umane efficace, accessibile e sostenibile, rafforzando la soddisfazione e la fedeltà dei nostri dipendenti.",
        name: 'Mustafa Yıldıran',
        role: 'Presidente del Consiglio di Amministrazione di Civil',
      },
    },
    yatsan: {
      description:
        "Come Yatsan, sei anni fa abbiamo avviato il nostro percorso di trasformazione digitale con idenfit per gestire in modo più efficiente e rapido i processi HR nel nostro stabilimento e nei nostri negozi.\n\nCon l'applicazione idenfit abbiamo digitalizzato molti processi — dalla gestione delle ferie alle buste paga, dal monitoraggio degli ingressi/uscite alla gestione dei documenti — riducendo il nostro carico di lavoro operativo.\n\nInoltre, tramite l'app mobile idenfit rendiamo facilmente accessibili ai nostri dipendenti informazioni come annunci, sondaggi e menu. Grazie alla funzione di reclami e suggerimenti, i nostri dipendenti possono condividere rapidamente le loro idee con noi.",
      employeeCount: '900 dipendenti',
      secondaryStat: '40 negozi',
      quote: {
        text:
          'Con questa collaborazione abbiamo reso i nostri processi HR più trasparenti, accessibili e facili da usare, aumentando al contempo la soddisfazione dei dipendenti.',
        name: 'Müzeyyen Kıran Mergen',
        role: 'Responsabile Buste Paga, Fascicoli del Personale e Affari Amministrativi',
      },
    },
    dogSer: {
      employeeCount: '250 dipendenti',
      secondaryStat: '10 sedi',
      quote: {
        text:
          'Nella nostra attività basata su progetti, i nostri processi HR sono cambiati in meglio dal momento in cui abbiamo iniziato a lavorare con idenfit. La loro apertura all\'innovazione e allo sviluppo, insieme a un approccio orientato al cliente nel soddisfare le nostre richieste, ha risposto pienamente alle nostre esigenze e aspettative. Anche il loro supporto orientato alla soluzione per ogni problema incontrato durante la digitalizzazione dei nostri processi HR è stato un fattore determinante nella nostra collaborazione di lungo periodo con idenfit. Grazie a idenfit abbiamo iniziato a gestire facilmente la rilevazione presenze e le ferie in digitale, e i nostri processi proseguono con facilità e soddisfazione.',
        name: 'Cem Çolak',
        role: 'Affari Amministrativi e Finanziari',
      },
    },
    tugbaKuruyemis: {
      employeeCount: '1.200 dipendenti',
      secondaryStat: '111 negozi',
      quote: {
        text:
          'Grazie al supporto software di idenfit, abbiamo aiutato Tuğba Kuruyemiş — che ha iniziato il suo percorso nel 1980 e oggi serve i clienti attraverso oltre 100 negozi in tutta la Turchia — a gestire facilmente in digitale i propri processi di gestione delle risorse umane e della forza lavoro. Gestendo la documentazione di routine da un unico pannello idenfit, Tuğba Kuruyemiş risparmia anche sul carico di lavoro nella digitalizzazione dei propri processi HR.',
        name: 'Nevzat Atmaca',
      },
    },
    beyazFirin: {
      quote: {
        text:
          'idenfit ha offerto un servizio addirittura in anticipo rispetto alle nostre stesse richieste, e ci ha fatto crescere su questo fronte. Una delle caratteristiche più importanti è che le nostre richieste trovano davvero risposta. Tutte le richieste che arrivano dall\'attività quotidiana vengono valutate e il programma viene rivisto di conseguenza: il ritmo di miglioramento qui è davvero molto veloce.',
        name: 'Nuri Sütlüoğlu',
        role: 'Responsabile Risorse Umane',
      },
    },
    emreOzcan: {
      quote: {
        text:
          'Quando abbiamo conosciuto Idenfit, la cosa che mi ha colpito di più è stata la sua praticità e la capacità di combinare diverse discipline sulla stessa piattaforma. La semplicità dell\'interfaccia indicava un sistema a cui i nostri dipendenti potevano adattarsi rapidamente. Soprattutto per le aziende come la nostra che gestiscono operazioni intense e su turni, è stato prezioso trovare una "soluzione digitale employee-friendly".',
        name: 'Emre Özcan',
        role: 'Responsabile Comunicazione Aziendale',
      },
    },
    ismailUnal: {
      quote: {
        text:
          "Idenfit è diventata per noi una scelta vincente, in particolare per la sua capacità di strutturare i processi di rilevazione presenze end-to-end, per la sua interfaccia user-friendly e per le soluzioni versatili che offre per le diverse esigenze HR tramite un'unica applicazione.",
        name: 'İsmail Ünal',
        role: 'People & Culture Manager',
      },
    },
    ibisStyles: {
      quote: {
        text:
          "Il nostro hotel utilizza idenfit fin dal giorno dell'apertura. Una delle cose che mi ha colpito di più di idenfit, e il motivo principale per cui l'abbiamo scelto, è stata l'idea che ha proposto. Ha messo da parte tutto ciò a cui eravamo abituati: lettori di badge, tornelli o firme cartacee. I nostri colleghi possono ora registrare entrata e uscita tramite l'app mobile, e poter monitorare tutto questo in tempo reale e da remoto, ovunque ci troviamo, ha migliorato anche le nostre prestazioni.",
        name: 'Tolga Avcı',
        role: 'Direttore Generale',
      },
    },
  },
  home: {
    logoStrip: {
      caption: 'Più di 1000 clienti soddisfatti hanno realizzato la loro trasformazione digitale HR con noi.',
    },
    dividers: {
      afterLogos: 'Liberati dai processi manuali, semplifica le tue operazioni HR!',
      afterFeatures: 'Risparmia tempo, gestisci i processi HR in modo intelligente!',
    },
    featureGrid: {
      title: 'Soluzioni HR intelligenti per aziende efficienti',
      intro:
        "Scopri una gestione delle risorse umane che aumenta la produttività, rafforza l'engagement e sviluppa strategie per il futuro, analizzando per quanto tempo, in quale ruolo e con quale stato d'animo lavorano i tuoi dipendenti.",
      timeLeave: {
        title: 'Gestione Presenze e Ferie',
        text: 'Gestisci facilmente gli orari di lavoro e i permessi, aumenta la produttività e la soddisfazione dei dipendenti.',
      },
      performance: {
        title: 'Gestione della Performance',
        text: 'Potenzia i tuoi team con un monitoraggio delle prestazioni equo e misurabile.',
      },
      employeeExperience: {
        title: 'Esperienza del Dipendente',
        text: 'Crea un ambiente di lavoro incentrato sulle persone che aumenti la motivazione e la fedeltà aziendale.',
      },
      analytics: {
        title: 'Esperienza Dipendenti e Analytics',
        text: 'Ottimizza i tuoi processi HR con decisioni basate sui dati (data-driven).',
      },
    },
    certifications: {
      titleLine1: 'Tecnologia Cloud',
      titleLine2: '& Standard di Qualità',
      text:
        'Idenfit è una piattaforma basata sul cloud che ti consente di gestire i tuoi dipendenti e la tua forza lavoro in modo più semplice e affidabile. Garantiamo ai nostri utenti di offrire tutti i nostri prodotti e servizi, creati con 20 anni di esperienza nel settore, in conformità con gli standard ISO (27001 e 9001) e basandoci sulla soddisfazione del cliente.',
    },
    video: {
      ctaAriaLabel: 'Scopri di più nella pagina Perché idenfit',
      title: 'Perché Idenfit?',
      ctaText: 'Scopri di più',
      videoTitle: 'Video di presentazione idenfit',
      playLabel: 'Riproduci video',
    },
    efficiency: {
      title: '5 Domande per misurare la produttività',
      text:
        'Assicurati che i tuoi dipendenti svolgano il lavoro giusto, al momento giusto, nel posto giusto e con qualità. Grazie alla tecnologia cloud (SaaS) adattabile a ogni tipo di azienda, alla solida infrastruttura e al database affidabile, ti permette di gestire i dipendenti e le operazioni da qualsiasi luogo con accesso a internet, in qualsiasi momento.',
      imageAlt: '5 domande per misurare la produttività — screenshot del pannello idenfit',
    },
    panel: {
      title: 'Pannello Intuitivo e User-Friendly',
      text:
        "Idenfit ti permette di trovare tutti i dati ottenuti durante la gestione delle risorse umane in un unico pannello, grazie alle sue funzionalità semplici, chiare e facili da usare. Il pannello dinamico è progettato per consentire integrazioni all'interno di diversi moduli.",
      features: ['Informazioni Istantanee', 'Promemoria', 'Monitoraggio in Tempo Reale'],
      imageAlt: 'screenshot del pannello intuitivo idenfit',
    },
    suprema: {
      title: 'Una Piattaforma di Controllo Accessi Integrata con Tutti gli Hardware',
      text:
        "Grazie al sistema integrato con dispositivi di riconoscimento facciale e lettura delle impronte digitali, l'autenticazione dei dipendenti può essere effettuata in tempo reale. Allo stesso tempo, il monitoraggio di entrate, uscite e pause può essere gestito con facilità.",
    },
    partners: {
      title: 'I Nostri Partner',
      text: 'I partner tecnologici e commerciali affidabili con cui idenfit si integra.',
      categories: {
        turnstile: 'Tornello',
        payroll: 'Buste Paga',
        lms: 'LMS',
        task: 'Gestione Attività',
        sso: 'SSO',
      },
    },
    testimonials: {
      title: "Miglioramento dell'Esperienza dei Dipendenti",
      intro:
        "Offriamo alle aziende soluzioni orientate alle persone per migliorare la percezione e l'esperienza lavorativa dei dipendenti.",
      prevLabel: 'Testimonianza precedente',
      nextLabel: 'Testimonianza successiva',
      ismailUnal: {
        quote:
          "Idenfit è diventata per noi una scelta vincente, in particolare per la sua capacità di strutturare i processi di rilevazione presenze end-to-end, per la sua interfaccia user-friendly e per le soluzioni versatili che offre per le diverse esigenze HR tramite un'unica applicazione.",
        jobTitle: 'Zsa Zsa Zsu - People & Culture Manager',
      },
      emreOzcan: {
        quote:
          'Quando abbiamo conosciuto Idenfit, la cosa che mi ha colpito di più è stata la sua praticità e la capacità di combinare diverse discipline sulla stessa piattaforma. La semplicità dell\'interfaccia indicava un sistema a cui i nostri dipendenti potevano adattarsi rapidamente. Soprattutto per le aziende come la nostra che gestiscono operazioni intense e su turni, è stato prezioso trovare una "soluzione digitale employee-friendly".',
        jobTitle: 'HAVAİST - Responsabile Comunicazione Aziendale',
      },
    },
    customerCarousel: {
      title: 'Storie dei Clienti',
      intro: 'Esperienze reali di aziende che trasformano i propri processi HR con idenfit.',
      prevLabel: 'Storia precedente',
      nextLabel: 'Storia successiva',
      readMoreLabel: 'Leggi di più',
      civilVideo: { headline: 'Guarda come Civil ha trasformato i propri processi HR con idenfit' },
      femasVideo: { headline: 'Guarda come Femaş ha trasformato i propri processi HR con idenfit' },
      tugbaKuruyemis: { headline: 'Tuğba Kuruyemiş gestisce i processi HR da un unico pannello con idenfit' },
      beyazFirinVideo: { headline: 'Guarda come Beyaz Fırın ha trasformato i propri processi HR con idenfit' },
      ibisStylesVideo: { headline: 'Guarda come ibis Styles Hotels ha trasformato i propri processi HR con idenfit' },
    },
    faq: {
      viewAllLink: 'Visualizza Tutte le Domande',
    },
  },
  faqPage: {
    pdfLabel: 'Scarica PDF',
    metaDescription:
      'Trova le risposte alle domande più frequenti su idenfit: informazioni generali, prezzi, configurazione, supporto e sicurezza dei dati.',
  },
  sectorPage: {
    modulesHeading: 'Moduli Dedicati a Questo Settore',
  },
  notFound: {
    pageTitle: 'Pagina Non Trovata',
    metaDescription:
      'La pagina che stai cercando non è stata trovata. Torna alla home page di idenfit oppure esplora pagine popolari come Blog, Contatti e Prezzi.',
    heading: 'Pagina Non Trovata',
    description:
      'La pagina che stai cercando potrebbe essere stata spostata, rimossa o non essere mai esistita. Torna alla home page oppure scopri alcune delle nostre pagine più popolari qui sotto.',
    backHomeButton: 'Torna alla Home Page',
    popularLinksTitle: 'Pagine Popolari',
  },
};
