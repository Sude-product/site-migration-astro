// İK hub sayfaları için gerçek çeviri kuralı (KARAR 1, bkz.
// productTranslationOverrides.ts'teki aynı kural) burada da geçerli: IT
// içeriğinin TAMAMI (hero, intro, 17/7 tile, SSS) EN'in birebir kopyasıydı;
// Hub B'nin EN `intro.title`'ı da TR'nin gerçek çevirisi değil, section_1
// başlığının ("Workforce Management") tembelce tekrarıydı (section_2_text
// ise gerçek, farklı İngilizce metin — yalnızca title yamalandı, text'e
// dokunulmadı). Hepsi TR kaynak / EN'in kendi gerçek içeriğinden çevrildi.
import type { HubBlock, HubFaqItem } from './hubContent';
import type { Locale } from './nav';

interface HubTileOverride {
  key: string;
  title: string;
  text: string;
  ctaText: string;
  ctaUrl: string;
  image: { url: string; alt: string; width?: number; height?: number } | null;
}

export interface HubOverride {
  // `image` yok — hero görseli dile göre değişmiyor, her zaman TR taban
  // girdisinden okunuyor (bkz. `hubContent.ts`'teki `getHeroImage()`).
  hero?: Omit<HubBlock, 'image'>;
  intro?: { title: string; text: string } | null;
  tiles?: HubTileOverride[];
  faq?: HubFaqItem[];
}

export const HUB_OVERRIDES: Record<string, Partial<Record<Locale, HubOverride>>> = {
  'insan-kaynaklari-yonetimi-modulu': {
    // `intro` (TR/EN) 2026-08-13'te eklendi — "Başlık hiyerarşisi sıralı
    // değil" SEO uyarısı turu, bkz. CLAUDE.md. Kaynağın kendi ham verisinde
    // (`hubs.json`) bu hub'ın EN/IT `intro` alanı `null`'dı (TR'de gerçek
    // bir intro var) — `HubPage.astro`'nun "Tanıtım bloğu" H2'si bu yüzden
    // hiç render edilmiyor, sayfa doğrudan tile grid'in H3'üne (H1→H3
    // atlaması) düşüyordu. TR'nin gerçek `intro.title`/`intro.text`'inden
    // (bkz. `hubs.json`) çevrildi — kopya/uydurma DEĞİL, KARAR 1 ilkesi.
    en: {
      intro: {
        title: '360° HR Management With a Single Software',
        text: "idenfit's cloud-based human resources software brings a holistic approach to HR management, letting you handle every HR process — from employee information to hiring, performance evaluation to trainings — all on a single platform. There's no need for extra software or additional programs when using idenfit — managing everything through one cloud platform with a single piece of software saves you time and operational costs.",
      },
    },
    it: {
      hero: {
        title: 'Moduli di Gestione delle Risorse Umane',
        text: 'Idenfit, basato su cloud, è un software di gestione delle risorse umane e della forza lavoro che porta un approccio olistico ai processi HR e ti aiuta a esaminare e gestire tutti i processi HR in un unico posto.',
        ctaText: 'Richiedi Subito',
        ctaUrl: 'https://idenfit.com/tr/online-sunum-talep-et/',
      },
      intro: {
        title: 'Gestione delle Risorse Umane a 360° con un Unico Software',
        text: "Il software per le risorse umane di idenfit porta un approccio olistico alla gestione HR, permettendoti di gestire tutti i processi che rientrano nell'ambito delle risorse umane — dai fascicoli dei dipendenti al reclutamento, dalla valutazione delle prestazioni alla formazione — su un'unica piattaforma. Utilizzando idenfit non hai bisogno di software o programmi aggiuntivi: gestendo tutto da un'unica piattaforma cloud con un solo software, risparmi tempo e costi operativi.",
      },
      tiles: [
        {
          key: '1', title: 'reclutamento',
          text: '<p>Il modulo di reclutamento di idenfit rende l\'intero processo di assunzione semplice e senza stress sia per l\'azienda che per i potenziali candidati. Le soluzioni automatizzate e la dashboard facile da usare di idenfit permettono al tuo reparto HR di reclutare, selezionare, monitorare, assumere e completare la verifica dei dipendenti dei migliori talenti per costruire una forza lavoro più coinvolta e produttiva.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://idenfit.com/tr/ise-alim-modulu/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/hiring.svg', alt: 'hiring', width: 118, height: 127 },
        },
        {
          key: '2', title: 'onboarding',
          text: '<p>Il modulo onboarding di idenfit aiuta gli utenti a completare rapidamente le pratiche burocratiche per un inserimento più significativo, permette di raccogliere firme elettroniche con pacchetti di pre-onboarding personalizzabili e rende semplice preparare in anticipo i nuovi dipendenti con e-mail di benvenuto e checklist IT. Gli utenti possono essere certi che il processo di onboarding sia ben organizzato ed efficiente con idenfit, contribuendo a mantenere un\'immagine di marca e una reputazione positive.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://idenfit.com/tr/onboarding-modulu/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/onboarding.svg', alt: 'onboarding', width: 141, height: 127 },
        },
        {
          key: '2_copy', title: 'fascicolo personale',
          text: '<p>Il modulo fascicolo personale di idenfit consente alle aziende di centralizzare le informazioni riservate dei dipendenti e definire i permessi di accesso per i responsabili autorizzati, garantendo che le informazioni siano sia sicure che accessibili. Tutte le informazioni riservate e i documenti come il contratto di lavoro, le approvazioni di ferie, i documenti finanziari e i moduli di straordinario possono essere archiviati online e verificati con firma biometrica.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://idenfit.com/tr/calisan-ozluk-yonetimi-modulu/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/personal-file.svg', alt: 'personal file', width: 160, height: 95 },
        },
        {
          key: '2_copy2', title: 'evraklar',
          text: '<p>Il modulo evraklar di idenfit aiuta gli utenti ad archiviare in modo sicuro i documenti ufficiali dei dipendenti. Gli utenti possono caricare e conservare i documenti ufficiali dei dipendenti, oltre a creare e aggiungere tipologie di documento e filtrarli per nome, reparto o tipo.</p>',
          ctaText: '', ctaUrl: '',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/papers.svg', alt: 'papers', width: 124, height: 124 },
        },
        {
          key: '2_copy3', title: 'documenti',
          text: '<p>Il modulo documenti di idenfit ti aiuta a caricare e archiviare i documenti aziendali, tra cui l\'atto costitutivo, lo statuto, il regolamento interno e qualsiasi altro documento relativo alla costituzione, proprietà o gestione di un\'azienda. Puoi gestire e categorizzare i documenti aziendali e dare ai dipendenti accesso per condividerli con il proprio team o reparto.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://idenfit.com/tr/dokuman-yonetim-sistemi-modulu/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/documents.svg', alt: 'documents', width: 156, height: 126 },
        },
        {
          key: '2_copy4', title: 'formazione',
          text: '<p>Il modulo formazione dei dipendenti basato su cloud di idenfit ti aiuta a pianificare, assegnare, monitorare e valutare i corsi di formazione in base al feedback diretto dei tuoi dipendenti, offrendoti una visione immediata dell\'efficacia delle tue sessioni di formazione e sviluppo.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://idenfit.com/tr/calisan-egitim-yonetimi-modulu/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/trainings.svg', alt: 'trainings', width: 176, height: 120 },
        },
        {
          key: '2_copy5', title: 'zimmet',
          text: '<p>Il modulo zimmet di idenfit ti aiuta ad aggiungere tutte le informazioni sui beni aziendali e poi gli utenti possono assegnare facilmente gli addebiti ai dipendenti selezionati. Gli utenti possono anche inserire le condizioni di garanzia e il numero di edizione del prodotto per monitorare i beni con precisione.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://idenfit.com/tr/zimmet-yonetimi-modulu/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/debit-ticket.svg', alt: 'debit ticket', width: 150, height: 139 },
        },
        {
          key: '2_copy6', title: 'performance',
          text: '<p>La valutazione delle prestazioni di idenfit ti permette di misurare efficacemente le prestazioni individuali e di team con KPI e competenze. Puoi avere una visione del contributo di ciascuno rispetto a ogni obiettivo, anche a livello organizzativo. Utilizzando la valutazione delle prestazioni di idenfit, puoi misurare facilmente il completamento di ogni attività e quanto efficacemente viene svolta. Puoi anche monitorare quali competenze sono essenziali per completare le attività e infine rivedere la qualità del completamento. Idenfit aiuta i dipendenti a ricevere valutazioni delle prestazioni e giudizi di qualità dai propri responsabili per ogni attività completata.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://idenfit.com/tr/calisan-performans-degerlendirme-sistemi-modulu/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/performance.svg', alt: 'performance', width: 178, height: 124 },
        },
        {
          key: '2_copy7', title: 'harcamalar',
          text: '<p>Il modulo harcamalar di idenfit aiuta gli utenti a gestire le spese in modo rigoroso! I dipendenti possono caricare la prova di spesa scattando una foto della ricevuta e inviarla al responsabile assegnato sul modulo spese.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://idenfit.com/tr/masraf-yonetimi-modulu/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/expense_en.svg', alt: 'expense en', width: 138, height: 130 },
        },
        {
          key: '2_copy8', title: 'salute',
          text: '<p>Il modulo salute di idenfit consente agli utenti di gestire dati come lo stato e la storia sanitaria, i farmaci prescritti e i precedenti interventi chirurgici dei dipendenti, che possono essere aggiunti al sistema nell\'ambito di un\'autorizzazione scritta ottenuta dai dipendenti stessi.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://idenfit.com/tr/isyeri-saglik-yonetimi-modulu/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/health.svg', alt: 'health', width: 198, height: 120 },
        },
        {
          key: '2_copy9', title: 'messaggi',
          text: '<p>Il modulo messaggi di idenfit aiuta gli utenti a condividere informazioni importanti e note dei colloqui con il team. I messaggi possono essere inviati come messaggio breve, e-mail o notifica, e gli utenti possono anche inviarli a un team o a persone selezionate.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://idenfit.com/tr/ofis-ici-mesajlasma-modulu/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/messages.svg', alt: 'messages', width: 145, height: 129 },
        },
        {
          key: '2_copy10', title: 'notlar',
          text: '<p>Il modulo notlar di idenfit permette agli utenti di creare note per il reparto o per un singolo dipendente. Gli utenti possono inserire note e assegnarle alla persona selezionata. Le note possono essere create e modificate solo dal proprietario, quindi non possono essere viste in forma anonima.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://idenfit.com/tr/notlar-modulu/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/notes.svg', alt: 'notes', width: 143, height: 131 },
        },
        {
          key: '2_copy11', title: 'geri bildirim',
          text: '<p>Il modulo geri bildirim di idenfit permette ai dipendenti di mostrare il proprio umore quotidiano con emoji e inviarlo come feedback al proprio team o responsabile. I responsabili, d\'altra parte, possono aggiungere domande e risposte personalizzate per raccogliere feedback dai dipendenti. I responsabili possono monitorare i risultati del feedback di ogni dipendente o team e gestirli in modo efficiente.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://idenfit.com/tr/organizasyonel-geri-bildirim-modulu/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/feedback.svg', alt: 'feedback', width: 193, height: 130 },
        },
        {
          key: '2_copy12', title: 'anket',
          text: '<p>Il modulo anket di idenfit è una componente essenziale per conoscere le opinioni dei dipendenti e offrire un quadro delle esigenze della tua organizzazione. I sondaggi possono essere usati per raccogliere le opinioni dei dipendenti su vari temi, come il successo dell\'azienda nel comunicare la propria missione, la responsabilità sociale d\'impresa o questioni locali come la qualità dell\'ambiente di lavoro.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://idenfit.com/tr/anket-modulu/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/survey.svg', alt: 'survey', width: 206, height: 131 },
        },
        {
          key: '2_copy13', title: 'offboarding',
          text: '<p>Idenfit ti permette di pianificare e realizzare un offboarding senza stress e rigoroso, con checklist per garantire la conformità e automazioni che ti aiutano a concentrarti sulla persona, non sulla pratica burocratica. Idenfit invia notifiche automatiche ad amministratori, responsabili e altri, così gli utenti possono essere certi che l\'intero processo sia verificato e che l\'uscita del dipendente sia sicura, utile e ben gestita.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://idenfit.com/tr/offboarding-modulu/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/offboarding.svg', alt: 'offboarding', width: 157, height: 136 },
        },
        {
          key: '2_copy14', title: 'Il modulo bordrolar può integrarsi bidirezionalmente con diversi programmi ERP',
          text: '<p>L\'integrazione bordrolar di idenfit offre un\'integrazione a 360° con i principali fornitori di buste paga, direttamente sulla piattaforma di archiviazione dati. Il sistema paghe di idenfit è collegato alla rilevazione presenze, al database dei dipendenti e ad altri sistemi informativi HR: le informazioni possono essere trasferite avanti e indietro sulla piattaforma senza necessità di doppia immissione dei dati.</p>',
          ctaText: '', ctaUrl: '',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/payroll_en.svg', alt: 'payroll en', width: 192, height: 123 },
        },
        {
          key: '2_copy15', title: 'servis',
          text: '<p>Il modulo servis di idenfit aiuta le aziende a gestire i turni delle navette per diversi reparti e sedi, tenendo i dipendenti informati sul veicolo, l\'orario di arrivo e partenza, l\'autista e i suoi contatti, e il percorso della navetta. È un modulo molto efficiente per le aziende che hanno molti turni per diversi reparti e sedi.</p>',
          ctaText: '', ctaUrl: '',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/shuttle.svg', alt: 'shuttle', width: 230, height: 130 },
        },
      ],
      faq: [
        {
          question: 'Cos\'è un software per le risorse umane?',
          answer: '<p>Il software per le risorse umane è una soluzione basata su cloud che ti consente di gestire digitalmente tutti i processi HR come reclutamento, fascicoli del personale, prestazioni e formazione.</p>',
        },
        {
          question: 'Quali vantaggi offre il programma di gestione delle risorse umane idenfit?',
          answer: '<p>Come programma di gestione delle risorse umane, idenfit riunisce tutte le attività HR su un\'unica piattaforma, elimina la necessità di software aggiuntivi e garantisce efficienza dei costi.</p>',
        },
        {
          question: 'Perché il software di gestione delle risorse umane è importante?',
          answer: '<p>Perché utilizzare un software di gestione HR per ogni processo — dalle buste paga alla gestione ferie, dal reclutamento all\'offboarding — accelera i flussi di lavoro e garantisce la sicurezza.</p>',
        },
        {
          question: 'Quali sono i vantaggi di un software HR basato su cloud?',
          answer: '<p>Con il software HR basato su cloud di idenfit, puoi accedere ai dati in qualsiasi momento e ovunque, archiviare le informazioni in modo sicuro nel rispetto del GDPR e garantire la continuità aziendale.</p>',
        },
        {
          question: 'Come scegliere il miglior software HR?',
          answer: '<p>Il miglior software HR è quello che offre tutti i moduli HR su un\'unica piattaforma, è scalabile e facile da usare.</p>',
        },
        {
          question: 'Cosa distingue idenfit tra i programmi software HR?',
          answer: '<p>idenfit unifica tutti i moduli HR — inclusi reclutamento, onboarding, prestazioni, formazione, fascicoli del personale, spese, gestione dei beni e buste paga — sotto un\'unica piattaforma.</p>',
        },
      ],
    },
  },

  'insan-kaynaklari-isgucu-yonetimi': {
    en: {
      // Yalnızca intro.title düzeltildi (section_1 başlığının tembel
      // tekrarıydı, TR'nin gerçek çevirisi değil) — intro.text zaten
      // doğru, farklı, gerçek İngilizce içerikti, dokunulmadı.
      intro: {
        title: 'Efficient Workforce Planning & Management',
        text: 'idenfit workforce management is the platform for scheduling shifts, clocking in & out, calculating time off and track leaves accurately. It is in full compliance with labor law. It helps users assign tasks to the right person with the right skill at the right time, ensuring that staff are optimally positioned in order to meet demand. It allows users to track employees daily performance and quickly pinpoint areas of improvement while supplying secure datas about time & attendance.',
      },
    },
    it: {
      hero: {
        title: 'Gestione della Forza Lavoro',
        text: 'Pianifica i turni e monitora con precisione le ore lavorative, l\'assenteismo e le ferie dei tuoi dipendenti con la gestione della forza lavoro di idenfit.',
        ctaText: 'Inizia Ora',
        ctaUrl: 'https://idenfit.com/tr/online-sunum-talep-et/',
      },
      intro: {
        title: 'Pianificazione e Gestione Efficiente della Forza Lavoro',
        text: 'idenfit gestione della forza lavoro è la piattaforma per pianificare i turni, timbrare entrata e uscita, calcolare i permessi e monitorare le ferie con precisione. È pienamente conforme alla normativa sul lavoro. Aiuta gli utenti ad assegnare le attività alla persona giusta, con le competenze giuste, al momento giusto, garantendo che il personale sia posizionato in modo ottimale per soddisfare la domanda. Consente di monitorare le prestazioni quotidiane dei dipendenti e individuare rapidamente le aree di miglioramento, fornendo al contempo dati sicuri su presenze e orari.',
      },
      tiles: [
        {
          key: '1', title: 'presenze',
          text: '<p>Idenfit ti aiuta a pianificare gli orari dei tuoi dipendenti in pochi minuti e a gestire permessi, disponibilità e richieste di cambio turno. Puoi monitorare le ore dei dipendenti, evitare di superare il budget e gli straordinari non pianificati, oltre a ridurre l\'assenteismo e i ritardi, gestendo i cambiamenti imprevisti senza difficoltà. Il modulo di gestione presenze di idenfit è la scelta perfetta per uffici con più sedi. La pianificazione dei turni su idenfit ti offre tutte le informazioni necessarie per pianificare turni senza conflitti in pochi minuti. Da un\'unica piattaforma, puoi tenere traccia dei turni e vedere tutta la pianificazione sul calendario con un design colorato e piacevole.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://idenfit.com/tr/puantaj-takip-programi-modulu/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/08/workforce-timekeeping.svg', alt: 'workforce timekeeping', width: 140, height: 136 },
        },
        {
          key: '2', title: 'permessi',
          text: '<p>Il sistema di gestione permessi di idenfit ti consente di bloccare tutti gli abusi sui permessi e implementare una politica aziendale uniforme. Puoi aggiungere le tue tipologie di permesso, fare eccezioni per singoli dipendenti e gruppi per l\'uso di richieste e approvazioni di permesso. Idenfit consente agli utenti di monitorare le richieste e le approvazioni di permesso su base annuale, mensile e settimanale. Puoi rivedere qualsiasi richiesta di permesso sulla dashboard intuitiva, aggiungerne una nuova o modificarla. È anche possibile definire e aggiungere tipologie di permesso al sistema per gli utenti.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://idenfit.com/tr/yillik-izin-takip-programi/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/08/workforce-leave.svg', alt: 'workforce leave', width: 181, height: 133 },
        },
        {
          key: '2_copy', title: 'pianificazione turni',
          text: '<p>Idenfit ti aiuta a pianificare i turni dei tuoi dipendenti in pochi minuti e a gestire permessi, disponibilità e richieste di cambio turno. Puoi monitorare le ore dei dipendenti, evitare di superare il budget e gli straordinari non pianificati, oltre a ridurre l\'assenteismo e i ritardi, gestendo i cambiamenti imprevisti senza difficoltà. La gestione intelligente dei turni consente ai tuoi dipendenti di scegliere i turni in cui desiderano lavorare, pianificando i turni disponibili per loro con idenfit. Puoi permettere ai dipendenti di scegliere i turni in ordine di arrivo oppure approvare tu stesso le richieste.</p>',
          ctaText: '', ctaUrl: '',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/08/workforce-shifts-1.svg', alt: 'workforce shifts 1', width: 203, height: 132 },
        },
        {
          key: '2_copy2', title: 'calendario aziendale',
          text: '<p>La gestione del tempo e della pianificazione è più semplice con il calendario aziendale di idenfit. Gli amministratori possono creare riunioni, notifiche, eventi o note, ricevere promemoria sulle attività imminenti, così gli utenti sanno sempre cosa succederà dopo. Il calendario è pensato per i team, quindi è facile condividere la propria agenda con altri e creare più calendari che i team possono usare insieme.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://idenfit.com/tr/kurumsal-takvim-modulu/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/08/workforce-calendar.svg', alt: 'workforce calendar', width: 153, height: 115 },
        },
        {
          key: '2_copy3', title: 'guard',
          text: '<p>Con il sistema di controllo tour di sicurezza di idenfit, i responsabili possono vedere in tempo reale quale personale è in quale turno di ronda, i giri mancati o incompleti. Possono così essere consapevoli di tutti gli eventi sul campo, seguirli e gestirli istantaneamente. I responsabili possono creare tour illimitati e dettagliati nel sistema, aggiungere quanti dipendenti desiderano e monitorare il personale generale. Le registrazioni di entrata-uscita e l\'orario di lavoro possono essere visualizzati sullo schermo del monitor, dove tutti i flussi possono essere monitorati istantaneamente.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://www.workmana.com/it/guard/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/08/workforce-guard.svg', alt: 'workforce guard', width: 158, height: 122 },
        },
        {
          key: '2_copy4', title: 'task',
          text: '<p>Con Idenfit Task puoi eseguire la pianificazione, il monitoraggio e la valutazione delle attività pianificate, sia sul web che su mobile. Puoi determinare chi, quando e per quanto tempo verranno svolte le attività create e puoi verificare se vengono eseguite nei tempi previsti. Con Idenfit Task, i dipendenti possono visualizzare l\'elenco generale delle attività assegnate al proprio team, visualizzare le attività assegnate specificamente a loro e prendere un\'attività basata sulla data dall\'elenco generale.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://www.workmana.com/it/task/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/08/workforce-task.svg', alt: 'workforce task', width: 178, height: 115 },
        },
        {
          key: '2_copy5', title: 'audit',
          text: '<p>Idenfit Audit è progettato per controllare in tempo reale tutti i processi di verifica, per controllare se le attività vengono svolte sul posto e nei tempi previsti. Con il software Idenfit Audit, puoi completare e segnalare rapidamente e facilmente tutte le fasi dell\'audit. Puoi visualizzare i moduli di audit definiti e i report di audit nel menu in base alla categoria desiderata, sotto "report di audit", "report di audit dettagliato", "report di audit per dipendente" e "registri di integrazione", e stamparli come report.</p>',
          ctaText: 'Scopri di più >', ctaUrl: 'https://www.workmana.com/it/audit/',
          image: { url: 'https://idenfit.com/wp-content/uploads/2025/08/workforce-audit.svg', alt: 'workforce audit', width: 182, height: 120 },
        },
      ],
    },
  },
};
