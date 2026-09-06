// ÜRÜN SAYFALARI ÇEVİRİ KURALI (KARAR, 2026-07-21):
// idenfit.com'un kaynak WP export'unda ürün/modül sayfalarının çevirileri
// güvenilmez — IT sistemik olarak EN'in birebir kopyası, bazı bloklar
// hiç çevrilmemiş (boş), bazı sayfalarda EN/IT'nin kendisi bile ham
// Türkçe. **Kural: Bu tür eksik/kopya/boş içerik tespit edildiğinde, TR
// kaynak metinden GERÇEK bir çeviri üretilir — ham kopyalama veya boş
// bırakma kabul edilmez.** Bu dosya, `products.json`'daki ham (bazen
// bozuk) çeviriyi ez/tamamlayan elle yazılmış gerçek çevirileri tutar.
//
// `productContent.ts`'in `getProductContent()`'i her (trSlug, locale) için
// önce burada bir override olup olmadığına bakar:
//   - `hero`/`sections` VERİLMİŞSE → ham `products.json` verisinin YERİNE geçer
//     (IT'nin EN kopyası olduğu durumlar — tam sayfa yeniden çevrildi).
//   - `appendSections` VERİLMİŞSE → ham veride VAR OLAN bloklara EKLENİR
//     (yalnızca eksik/boş bir blok tamamlanıyorsa, geri kalan içerik zaten
//     doğruysa — ör. İzin Yönetimi'nin EN/NL'de eksik 6. bloğu).
// Görseller özel isim gerektirmez — WP medya kütüphanesinde dile göre
// AYRI görsel yok, TR'deki gerçek görsel URL'leri burada da kullanıldı.
import type { ProductBlock, ProductFaqItem } from './productContent';
import type { Locale } from './nav';

// idenfit.com'daki "Online Sunum Talebi" sayfasının HERHANGİ bir gerçek
// kaynak slug'ı — `productContent.ts`'in `localizeCtaUrl()`'ü bunu tanıyıp
// bizim canonical `online-sunum-talep-et` slug'ımıza çeviriyor (bkz. o
// dosyadaki `REQUEST_DEMO_SOURCE_SLUGS`). Override'larda CTA hedefi olarak
// hep bu sentinel kullanılıyor.
const DEMO_CTA_URL = 'https://idenfit.com/tr/online-sunum-talep-et/';

// İşe Alım Modülü/Hiringoz hero'sunun dekoratif arka plan illüstrasyonu
// (2026-09-02) — canlı sitede TR/EN/IT'nin ÜÇÜNÜN de AYNI dosyayı
// (`ise-alim-hero-2.png`, metinsiz/dilden bağımsız) kullandığı doğrulandı
// (`curl` ile EN'in kendi post CSS'i kontrol edildi) — locale'e özel bir
// kopya YOK, tek indirilmiş dosya paylaşılıyor.
export const HERO_BG_IMAGE = { url: '/wp-content/uploads/2025/11/ise-alim-hero-2.png', width: 2093, height: 1416 };

// Hero'daki "hiringoz →" marka rozeti (2026-09-02) — canlı sitede bu görsel
// bir LİNK değil (Elementor image widget'ında `link` alanı boş, `<a>`
// sarmalayıcısı yok), yalnızca CTA butonunun yanında duran dekoratif bir
// marka logosu. Dosya adı "en" içerse de TR sayfasında da AYNEN kullanılıyor
// (curl ile doğrulandı) — locale'e özel değil, tek paylaşılan dosya.
export const HIRINGOZ_PARTNER_LOGO = {
  url: '/wp-content/uploads/2025/11/hiringoz-logo-en.svg',
  alt: 'Hiringoz',
  width: 164,
  height: 44,
};

// Kapanış bölümünün ("Şimdi Başlayın"/"Start Now" vb.) dekoratif zemin
// deseni (2026-09-02) — canlı sitede aynı bölüm bu görseli `#EDEDED`
// zemin üzerinde `contain` olarak kullanıyor.
const CLOSING_BG_IMAGE = '/wp-content/uploads/2025/11/ise-alim-footer.png';

export interface ProductOverride {
  hero?: ProductBlock;
  sections?: ProductBlock[];
  appendSections?: ProductBlock[];
  /** Verilirse ham `products.json`'daki `faq` dizisinin YERİNE geçer (ör.
   * Puantaj'ın IT SSS'i tamamen EN kopyasıydı). */
  faq?: ProductFaqItem[];
}

export const PRODUCT_OVERRIDES: Record<string, Partial<Record<Locale, ProductOverride>>> = {
  // ============================== PDKS ==============================
  'pdks-modulu': {
    it: {
      hero: {
        title: 'PDKS - Sistema di Rilevazione Presenze',
        text: 'idenfit PDKS offre soluzioni software e hardware integrate, riducendo al minimo i costi operativi aggiuntivi e mantenendo il vantaggio di prezzo.',
        ctaText: 'Richiedi Subito',
        ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/07/time-attendance-system1@2x-1.webp', alt: 'time attendance system', width: 1221, height: 1100 },
      },
      sections: [
        {
          title: 'Perché idenfit',
          text: '<p>Il PDKS, ovvero "Sistema di Rilevazione Presenze del Personale", è un sistema automatizzato che registra gli ingressi e le uscite del personale nei punti di accesso e controllo stabiliti, tramite dispositivi e hardware PDKS. I dati raccolti vengono trasmessi online al software PDKS per l\'analisi; il risultato permette di registrare in modo affidabile informazioni sulla presenza dei dipendenti, come orari di ingresso e uscita, straordinari e permessi. In questo modo, a fine mese le performance, i fogli presenza e i relativi calcoli degli stipendi vengono gestiti con facilità.</p>',
          ctaText: '', ctaUrl: '', image: null,
        },
        {
          title: 'Sistemi di Accesso a Tornello',
          text: '<p>Con il sistema PDKS di idenfit collegato ai tornelli o ai punti di accesso, l\'autenticazione dell\'identità e il monitoraggio in tempo reale degli ingressi e delle uscite dei dipendenti diventano semplici. Grazie al programma PDKS di idenfit, è possibile configurare gli accessi tramite tornelli con carta, riconoscimento facciale o impronta digitale.</p><p>"Il nostro software, che raccoglie tutti i report, funziona in perfetta integrazione con i dispositivi PDKS con cui collaboriamo."</p>',
          ctaText: 'Richiedi Informazioni Dettagliate', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/2@2x-1-1.webp', alt: 'sistemi a tornello', width: 1258, height: 1079 },
        },
        {
          title: 'Lettori di Card',
          text: '<p>Con le soluzioni PDKS mobile di idenfit, puoi implementare il PDKS nella tua azienda grazie a lettori di card collegati al software presso tornelli, porte o punti di accesso, e a card personalizzate assegnate ai dipendenti.</p><p>Il sistema funziona registrando con timestamp gli ID delle card quando i lettori le rilevano, trasmettendo i dati al software. Grazie alle informazioni raccolte dai lettori di card, puoi valutarle e generare report con il Software PDKS di idenfit, gestendo facilmente il monitoraggio dei dipendenti e il calcolo dei fogli presenza.</p>',
          ctaText: 'Contatta il Team Vendite', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/3@2x-2.webp', alt: 'lettori di card', width: 941, height: 1120 },
        },
        {
          title: 'Lettori di Impronte Digitali',
          text: '<p>Ogni azienda ha esigenze PDKS diverse: per alcune il sistema a card è più adatto, per altre il lettore di impronte digitali è più efficiente. Con la soluzione a impronta digitale di idenfit, gli ingressi e le uscite dai punti di controllo possono avvenire in modo sicuro tramite la scansione dell\'impronta.</p><p>Grazie alle informazioni raccolte dai lettori di impronte digitali, puoi valutarle e generare report con il Software PDKS di idenfit, gestendo facilmente i calcoli dei fogli presenza dei dipendenti.</p>',
          ctaText: 'Contattaci', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/4@2x-1.webp', alt: 'lettori di impronte digitali', width: 1164, height: 1326 },
        },
        {
          title: 'Sistemi di Riconoscimento Facciale',
          text: '<p>I sistemi di riconoscimento facciale sono sistemi di monitoraggio biometrico progettati per il PDKS e il controllo accessi. Grazie all\'elevato tasso di verifica, al basso margine di errore, all\'identificazione rapida e all\'uso igienico senza contatto, rappresentano una delle soluzioni più pratiche e sicure, specialmente nei settori non adatti a lettori di card o impronte digitali.</p><p>Grazie alle informazioni raccolte, puoi valutarle e generare report con il Software PDKS di idenfit, monitorando facilmente i dipendenti.</p>',
          ctaText: 'Richiedi Subito', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/5@2x-1-1.webp', alt: 'riconoscimento facciale', width: 1227, height: 1109 },
        },
        {
          title: 'BAB Beacon (Bluetooth)',
          text: '<p>La famiglia di prodotti Bab, che include soluzioni di accesso e monitoraggio come beacon, reader, wall reader e app di accesso mobile, ti permette di monitorare e gestire facilmente persone o oggetti tramite tecnologia bluetooth.</p><p>Con BAB puoi controllare gli orari di ingresso e uscita dei dipendenti e gestire i permessi di accesso. Anche a distanza, tramite il tuo dispositivo mobile, puoi condividere o limitare l\'accesso sicuro per qualsiasi intervallo di tempo e per i dipendenti che desideri. Sul lato PDKS, se lo desideri, puoi effettuare interrogazioni retroattive ed estrarre dati storici dal sistema.</p>',
          ctaText: 'Prova Gratis', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/6@2x-1.png', alt: 'BAB beacon bluetooth', width: 994, height: 1101 },
        },
        {
          title: 'App Mobile PDKS',
          text: '<p>I dipendenti possono effettuare l\'autenticazione dell\'identità e della posizione tramite tecnologie come beacon, GPS, NFC e codice QR, utilizzando l\'app mobile PDKS di idenfit scaricata sul proprio telefono. Possono inoltre effettuare richieste di straordinario e permesso direttamente dall\'app mobile.</p><p>Grazie all\'uso del dispositivo mobile, l\'app del sistema di rilevazione presenze del personale idenfit registra ingressi e uscite, permessi, turni, pause e straordinari dei dipendenti.</p>',
          ctaText: '', ctaUrl: '',
          image: { url: '/wp-content/uploads/2025/07/7@2x.png', alt: 'app mobile PDKS', width: 962, height: 1125 },
        },
        {
          title: 'Come Funziona la Scansione del Codice QR nel Sistema di Monitoraggio del Personale?',
          text: '<p>Con il metodo di scansione del codice QR presente nell\'app mobile PDKS di idenfit, puoi gestire facilmente gli ingressi e le uscite del personale. Dopo la scansione, le informazioni sulla posizione vengono registrate istantaneamente nel sistema.</p><p>Il codice QR viene utilizzato anche nei sistemi di accesso con card: quando il lettore QR scansiona il codice o il codice a barre stampato sulla card, l\'ingresso o l\'uscita del dipendente viene registrato.</p><p>"Grazie alla tecnologia che consente di utilizzare dispositivi mobili o telefoni come card di accesso dei dipendenti, l\'app mobile PDKS di idenfit permette alle aziende di implementare un sistema di monitoraggio del personale senza sostenere costi aggiuntivi per dispositivi."</p>',
          ctaText: '', ctaUrl: '',
          image: { url: '/wp-content/uploads/2025/07/idenfit-karekod-tr@2x.webp', alt: 'scansione codice QR', width: 438, height: 546 },
        },
        {
          title: 'Programma PDKS di idenfit <b>Caratteristiche Generali</b>',
          text: '<ul class="list"><li>Interfaccia intuitiva</li><li>Moduli adatti a ogni settore</li><li>Database affidabile basato su cloud</li><li>Diritti di accesso basati sull\'utente</li><li>Servizi web-based, accesso desktop e mobile</li><li>Facile integrazione con molti programmi grazie al supporto API</li><li>Infrastruttura solida sviluppata in linguaggio Java</li></ul>',
          ctaText: '', ctaUrl: '',
          image: { url: '/wp-content/uploads/2025/07/8@2x.png', alt: 'caratteristiche generali', width: 604, height: 499 },
        },
      ],
    },
  },

  // ============================== Bordro ==============================
  'bordo-onay-modulu': {
    it: {
      hero: {
        title: 'Modulo Buste Paga',
        text: 'Il modulo buste paga di idenfit si integra bidirezionalmente con numerosi programmi di gestione paghe ed ERP!',
        ctaText: 'Richiedi Subito',
        ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/08/bordro1@2x.webp', alt: 'modulo buste paga', width: 1020, height: 1161 },
      },
      sections: [
        {
          title: 'Integrazione con i Sistemi ERP',
          text: '<p>Con il modulo buste paga di idenfit, le buste paga dei dipendenti possono essere visualizzate dal menu Risorse Umane, nella sezione Buste Paga. Tutte le buste paga possono essere caricate nel sistema su base mensile. Il modulo si integra bidirezionalmente con i programmi ERP.</p>',
          ctaText: 'Richiedi una Presentazione Online', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/08/bordro3@2x.jpg', alt: 'integrazione ERP', width: 1039, height: 886 },
        },
        {
          title: 'Modulo Buste Paga Integrato',
          text: '<p>Con idenfit & Datassist, puoi definire nel sistema tutti i processi legati alle buste paga, dalla preparazione dei fogli presenza al calcolo, dalla preparazione delle dichiarazioni fino alla chiusura delle buste paga. Il modulo di gestione del tempo di idenfit può funzionare in integrazione con i tuoi dispositivi hardware. In questo modo, le buste paga possono essere generate da un\'unica piattaforma insieme ai dati dei fogli presenza.</p>',
          ctaText: 'Richiedi Informazioni Dettagliate', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/08/bordro2@2x.webp', alt: 'modulo buste paga integrato', width: 998, height: 927 },
        },
      ],
    },
  },

  // ============================== İzin Yönetimi ==============================
  'yillik-izin-takip-programi': {
    en: {
      appendSections: [
        {
          title: 'Leave idenfit’s leave management, your time is yours again!',
          text: '<p>Employees can easily request these leaves through the mobile or tablet app. Leave requests are sent instantly as a system notification and email. Leave requests go sequentially to the assigned managers for approval. Annual leave periods are determined by the company. idenfit’s leave management handles complex annual leave calculation processes for you. Each time an employee takes leave, the relevant entitlement is automatically deducted from the leave balance. The system does this automatically, without requiring manual intervention. If a leave type is defined as transferable, the system automatically performs this calculation every year, so managers never have to calculate past leave manually.</p>',
          ctaText: 'Request Online Presentation', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/7@2x.webp', alt: 'leave management', width: 1140, height: 1281 },
        },
      ],
    },
    nl: {
      appendSections: [
        {
          title: 'Laat verlofbeheer over aan idenfit, uw tijd is weer van u!',
          text: '<p>Medewerkers kunnen dit verlof eenvoudig aanvragen via de mobiele of tablet-app. Verlofaanvragen worden direct als systeemmelding en e-mail verzonden. Verlofaanvragen gaan achtereenvolgens naar de aangewezen leidinggevenden ter goedkeuring. Jaarlijkse verlofperiodes worden door het bedrijf bepaald. Het verlofbeheer van idenfit voert de complexe berekeningen van jaarlijks verlof voor u uit. Telkens wanneer een medewerker verlof opneemt, wordt het betreffende recht automatisch van het verlofsaldo afgetrokken. Het systeem doet dit automatisch, zonder handmatige tussenkomst. Als binnen een verloftype is bepaald dat het verlof overgedragen kan worden, voert het systeem deze berekening elk jaar automatisch uit, zodat leidinggevenden nooit achteraf verlof hoeven te berekenen.</p>',
          ctaText: 'Online Presentatie Aanvragen', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/7@2x.webp', alt: 'verlofbeheer', width: 1140, height: 1281 },
        },
      ],
    },
    it: {
      // IT, EN'in kopyasıydı (bkz. CLAUDE.md) — tüm sayfa yeniden çevrildi.
      hero: {
        title: 'Gestione Ferie e Permessi',
        text: 'Con idenfit, gestisci ferie e permessi tramite una <b>piattaforma intelligente</b> e <b>flessibile</b>!',
        ctaText: 'Richiedi Subito',
        ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/07/izinler1@2x.webp', alt: 'gestione ferie e permessi', width: 1210, height: 1350 },
      },
      sections: [
        {
          title: 'Gestione Ferie e Calendario Permessi',
          text: '<p>Con la gestione ferie e il calendario permessi di idenfit, puoi definire tipologie di permesso secondo qualsiasi vincolo o condizione desiderata. Puoi gestire contemporaneamente festività ufficiali e permessi speciali. idenfit supporta diverse tipologie di permesso di cui i dipendenti hanno bisogno, come malattia, maternità o matrimonio, con maturazione illimitata e trasferimento dei permessi, offrendo una piattaforma che ti permette di dettagliare ogni tipologia con suddivisioni personalizzate.</p><p>idenfit unisce tutte le tipologie di permesso richieste dai tuoi dipendenti in un unico calendario, visualizzabile su base annuale, mensile e settimanale. Puoi facilmente eliminare, aggiungere o modificare qualsiasi permesso tramite un pannello intuitivo. Inoltre, il pannello mostra ogni tipologia di permesso con colori diversi, evitando di perdersi tra i dati.</p>',
          ctaText: 'Contatta il Team Vendite', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/izinler2@2x.webp', alt: 'calendario permessi', width: 1119, height: 962 },
        },
        {
          title: 'Opzioni Avanzate per i Permessi',
          text: '<p>Con le opzioni avanzate per i permessi di idenfit, è possibile definire nel sistema dettagli come chi richiede quanto permesso, le maturazioni, quali reparti possono visualizzare questi permessi o con quanto anticipo un permesso può essere richiesto. Per le tipologie di permesso che richiedono approvazione, quando viene richiesta la presentazione di documenti, report o documenti possono essere inviati o registrati tramite il sistema.</p>',
          ctaText: 'Contattaci', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/izinler3@2x.webp', alt: 'opzioni avanzate permessi', width: 1114, height: 615 },
        },
        {
          title: 'Parametri Intelligenti per i Permessi',
          text: '<p>Utilizzando i parametri, puoi mostrare automaticamente le tipologie di permesso solo nel calendario delle persone che possono effettivamente richiederle, evitando possibili confusioni. Ad esempio, il congedo di paternità è un tipo di permesso assegnato solo alle dipendenti donne. Nella gestione permessi di idenfit, puoi creare tipologie di permesso flessibili basate su genere, età, stato civile e molti altri parametri dettagliati, assegnandole ai dipendenti target.</p>',
          ctaText: 'Richiedi Informazioni Dettagliate', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/izinler4@2x.webp', alt: 'parametri intelligenti', width: 1180, height: 873 },
        },
        {
          title: 'Processi di Approvazione a Più Livelli',
          text: '<p>Con la gestione permessi di idenfit, i dipendenti possono richiedere rapidamente un permesso ai propri responsabili e ricevere una notifica in caso di modifica. I responsabili possono vedere in tempo reale quali dipendenti sono in permesso, quali stanno per andarci e lo storico dei permessi di ogni dipendente.</p><p>Per i permessi che richiedono approvazione, puoi creare processi di approvazione a più livelli con idenfit — ad esempio facendo sì che una richiesta passi prima al capo reparto e, dopo la sua approvazione, al responsabile dell\'unità competente.</p>',
          ctaText: 'Richiedi Subito', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/5@2x-1.webp', alt: 'approvazione a più livelli', width: 1186, height: 1106 },
        },
        {
          title: 'Opzioni Flessibili per i Permessi',
          text: '<p>Considerando che ogni dipendente ha differenze individuali come età, genere e stato civile, definire le stesse tipologie di permesso per tutti non è un approccio efficiente. I dipendenti possono richiedere i permessi come giornata intera, mezza giornata o un quarto di giornata, e questi periodi vengono automaticamente scalati.</p><p>Con la gestione permessi di idenfit, i permessi retribuiti o non retribuiti dei dipendenti possono essere gestiti digitalmente, senza documenti cartacei, da qualsiasi luogo.</p>',
          ctaText: 'Contatta il Team Vendite', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/6@2x-1.webp', alt: 'opzioni flessibili', width: 1297, height: 1197 },
        },
        {
          title: 'Affida la gestione dei permessi a idenfit, il tuo tempo torna tuo!',
          text: '<p>Il personale può richiedere facilmente questi permessi tramite l\'app mobile o tablet. Le richieste vengono inviate immediatamente come notifica di sistema ed e-mail, passando in sequenza all\'approvazione dei responsabili definiti.</p><p>La gestione permessi di idenfit esegue per te i complessi processi di calcolo dei permessi annuali. Ogni volta che un dipendente prende un permesso, il relativo diritto viene automaticamente scalato dal saldo, senza bisogno di intervento manuale.</p>',
          ctaText: 'Richiedi Presentazione Online', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/7@2x.webp', alt: 'affida a idenfit', width: 1140, height: 1281 },
        },
      ],
    },
  },

  // ============================== Performans ==============================
  'calisan-performans-degerlendirme-sistemi-modulu': {
    it: {
      hero: {
        title: 'Modulo di Gestione delle Prestazioni',
        text: 'Accelera lo sviluppo dei tuoi dipendenti con una <b>valutazione delle prestazioni</b> accurata!',
        ctaText: 'Richiedi Subito',
        ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/07/tr_ilk_resim@2x.jpg', alt: 'gestione delle prestazioni', width: 927, height: 1281 },
      },
      sections: [
        {
          title: 'Obiettivi e Competenze',
          text: '<p>Nel modulo di gestione delle prestazioni di idenfit, selezionando un modello di valutazione, puoi definire nel pannello obiettivi (KPI) e competenze. Nella sezione competenze puoi definire quanti gruppi desideri — aziendali, professionali, sociali, di leadership, organizzative — e allo stesso modo, negli obiettivi, puoi definire quelli stabiliti dal tuo reparto sotto diverse categorie.</p>',
          ctaText: 'Contatta il Team Vendite', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/performans2@2x.png', alt: 'obiettivi e competenze', width: 1099, height: 955 },
        },
        {
          title: 'Valutazione delle Prestazioni a 360 Gradi',
          text: '<p>Il modulo di valutazione delle prestazioni di idenfit, a differenza dei metodi tradizionali, ti permette di effettuare le valutazioni su base periodica, generando KPI (Indicatori Chiave di Prestazione). La valutazione può essere effettuata individualmente oppure offrendo la possibilità di essere valutati dal proprio subordinato, da se stessi, da un pari e dal proprio superiore, rendendola a 360 gradi.</p>',
          ctaText: 'Richiedi Informazioni Dettagliate', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/performans3@2x.png', alt: 'valutazione a 360 gradi', width: 1202, height: 988 },
        },
        {
          title: 'Aiuta i tuoi dipendenti a raggiungere i loro obiettivi!',
          text: '<p>Con idenfit, quando effettui la valutazione delle prestazioni, non devi più affrontare tabelle complesse preparate con metodi tradizionali. Puoi valutare i valori di prestazione delle persone, costantemente aggiornati, insieme ai KPI su base periodica, all\'interno del modello di obiettivi e competenze.</p>',
          ctaText: 'Richiedi Presentazione Online', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/performans4@2x.png', alt: 'raggiungere gli obiettivi', width: 1095, height: 854 },
        },
        {
          title: 'Pianifica la formazione in base ai risultati!',
          text: '<p>Puoi accedere al pannello sia dal portale web che dall\'app mobile. idenfit, oltre alla valutazione delle prestazioni, ti permette anche di intraprendere azioni in base ai risultati ottenuti — premiare i tuoi dipendenti o indirizzarli verso percorsi formativi.</p><p>Grazie al pannello pronto e personalizzabile offerto da idenfit, risparmi tempo nella gestione delle risorse umane, misurando al contempo le prestazioni del tuo team con dati reali.</p>',
          ctaText: 'Richiedi Subito', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/tr_son_resim@2x.jpg', alt: 'pianifica la formazione', width: 1347, height: 1228 },
        },
      ],
    },
  },

  // ============================== Onboarding ==============================
  'onboarding-modulu': {
    it: {
      hero: {
        title: 'Onboarding',
        text: 'idenfit ti permette di gestire i processi di <b>onboarding</b> dei dipendenti in un flusso fluido e senza intoppi.',
        ctaText: 'Richiedi Subito',
        ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/07/onboarding1@2x.png', alt: 'onboarding', width: 1061, height: 1285 },
      },
      sections: [
        {
          title: 'Nessuna attività dimenticata nel processo di onboarding!',
          text: '<p>Dal momento in cui un dipendente inizia a lavorare, le operazioni che i reparti devono svolgere — configurazione degli accessi, assegnazione delle autorizzazioni, apertura degli account e-mail, assegnazione di benefit — possono essere definite passo dopo passo nel sistema.</p><p>Con il modulo onboarding di idenfit: "Benvenuto tra noi! Ci sono ancora delle cose da completare per farti sentire uno di noi!"</p>',
          ctaText: 'Richiedi Informazioni Dettagliate', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/onboarding2@2x.png', alt: 'processo di onboarding', width: 1221, height: 844 },
        },
        {
          title: 'Comunicazione Rapida tra Reparti',
          text: '<p>Le operazioni di competenza di reparti diversi possono essere visualizzate e monitorate direttamente dai reparti interessati. Le attività da svolgere possono essere definite e seguite per reparto, anziché richiedere un\'operazione manuale separata per ogni dipendente.</p>',
          ctaText: 'Richiedi Subito', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/onboarding3@2x.png', alt: 'comunicazione tra reparti', width: 1089, height: 1197 },
        },
      ],
    },
  },

  // ============================== İşe Alım (ATS → Hiringoz) ==============================
  // 2026-09-02 — kullanıcı bulgusu: canlı site (TR/EN/IT'nin ÜÇÜ de) bu
  // sayfayı TAMAMEN yeniden tasarlamış — artık idenfit'in kendi native ATS
  // özelliklerini değil, kardeş ürün "Hiringoz"u (idenfit'in AI destekli
  // işe alım ajanı) tanıtıyor (bkz. HRTECHTOOLS panelindeki `HIRINGOZ`
  // kutusu, `ProductPreviewWidget.tsx`). Ham `products.json`'daki TR verisi
  // de STALE (eski ATS açıklaması) — bu yüzden `tr` de override edildi
  // (`tr:` override precedent'i: `ozluk-dosyasi-modulu`). İçerik canlı
  // sitenin TR/EN/IT'sinden BİREBİR (uydurma yok, KARAR 1), NL/AZ kaynakta
  // hiç yok — TR/EN temel alınıp gerçek çeviri üretildi (NL için önceki
  // override'ın ilkesiyle AYNI). CTA hedefleri (`request-online-presentation`/
  // `richiedi-presentazione-online`) `resolveCtaUrl()`'ün ZATEN tanıdığı
  // Online Sunum Talebi sentinel'leri — `DEMO_CTA_URL` yeterli. Görseller
  // idenfit.com'a hotlink YAPILMADI — indirilip `public/wp-content/uploads/2025/11/`
  // altına yerleştirildi (TR kendi Türkçe arayüz metinli `ise-alim-*.png`
  // görsellerini kullanıyor; EN/IT/NL/AZ paylaşımlı İngilizce arayüz metinli
  // `hiring-*.png`'yi — canlı sitede IT de AYNI İngilizce görselleri
  // kullanıyor, doğrulandı). Ham `alt` metinleri boştu — gerçek/açıklayıcı
  // alt yazıldı (görüntülenen ekran görüntüsü izlenerek, uydurulmadı).
  // `hero.title` artık kaynağın UZUN pazarlama cümlesi (`<title>`/CTA
  // anahtar kelimesi için `ise-alim-modulu.astro`'nun `title`/`ctaKeyword`
  // override'ına bkz. — `en/hardware.astro`'nun AYNI deseni).
  'ise-alim-modulu': {
    tr: {
      hero: {
        title: 'İşe alım maliyetlerini azaltın, zamandan tasarruf edin, objektif değerlendirmeler yapın ve Hiringoz ile verimliliği yakalayın.',
        text: '<p>Hiringoz, işe alım süreçlerini dijitalleştirerek işe alımda hız, doğruluk, sürdürülebilir verimlilik sağlar ve stratejik öngörüler sunar.</p><p>Yapay zeka destekli değerlendirmeler, akıllı mülakat planlaması ve aday analizleri sayesinde operasyonel yük azalır; siz stratejik karar alma ve aday deneyimi süreçlerine odaklanabilirsiniz.</p>',
        ctaText: 'Hemen Başvur',
        ctaUrl: DEMO_CTA_URL,
        image: { url: HERO_BG_IMAGE.url, alt: 'Beş sandalyeden birinin (kırmızı) öne çıkarıldığı, doğru adayın seçilmesini simgeleyen illüstrasyon', width: HERO_BG_IMAGE.width, height: HERO_BG_IMAGE.height },
      },
      sections: [
        {
          title: 'İşe Alımda Hız, Objektiflik ve Stratejik Değer',
          text: '<p>İşe alım profesyonellerinin büyük kısmı zamanını operasyonel işlere harcıyor.</p><p>Hiringoz ile ekibinize bir AI Agent dahil ederek size özel bir dijital işe alımcı kazanırsınız.</p><p>Hiringoz, operasyonel yükünüzün %74’ünü üstlenir, süreçleri otomatikleştirir. Siz, stratejiye ve aday deneyimine odaklanırsınız.</p><ul><li>İşe alım sürecini hızlandırır</li><li>Değerlendirmelerde objektiflik sağlar</li><li>Aday deneyimini güçlendirir</li></ul>',
          ctaText: '', ctaUrl: '', reverse: true,
          image: { url: '/wp-content/uploads/2025/11/ise-alim-2.png', alt: 'Hiringoz panelini kullanan bir işe alım uzmanı', width: 1108, height: 793 },
        },
        {
          title: 'Daha Akıllı ve Hızlı İşe Alım',
          text: '<p>Hiringoz, kaynak bulma, değerlendirme ve mülakat aşamalarını yapay zeka ile otomatikleştirir.</p><p>Zaman kazandırır, maliyetleri düşürür, insan hatasını en aza indirir.</p><p>Tüm süreci tek panelden yönetin, işe alımı kolaylaştırın!</p>',
          ctaText: '', ctaUrl: '', reverse: false,
          image: { url: '/wp-content/uploads/2025/11/ise-alim-3.png', alt: 'Hiringoz gösterge paneli: toplam başvuru ve nitelikli aday istatistikleri', width: 1170, height: 693 },
        },
        {
          title: 'Doğru Aday, Doğru Karar',
          text: '<p>Hiringoz, sadece özgeçmişleri değil, gerçek becerileri ve potansiyeli değerlendirir.</p><p>AI destekli testler ve simülasyonlarla doğru adayları objektif biçimde belirleyin.</p><p>Gözden kaçan yetenekleri keşfedin, doğru kararı verin.</p>',
          ctaText: '', ctaUrl: '', reverse: true,
          image: { url: '/wp-content/uploads/2025/11/ise-alim-4.png', alt: 'Hiringoz aday değerlendirme panosu ve mülakat skor grafiği', width: 1230, height: 890 },
        },
        {
          title: 'Güvenilir Yetenek Doğrulaması',
          text: '<p>İşe alımda başarı; hız, doğruluk ve güvenilirliğe dayanır. Hiringoz, her adayın yetkinliğini yapay zeka destekli testler ve mülakatlarla doğrular. Her işe alım şirket standartlarınıza uygun hale gelir.</p><p>Hiringoz, yetenekleri objektif biçimde değerlendirilmiş, güçlü yönleri doğrulanmış ve pratik deneyimi kanıtlanmış adayları kurumlarla buluşturur.</p>',
          ctaText: '', ctaUrl: '', reverse: false,
          image: { url: '/wp-content/uploads/2025/11/ise-alim-5.png', alt: 'Hiringoz yetkinlik testi seçim ekranı', width: 1142, height: 865 },
        },
        {
          title: 'Şimdi Başlayın',
          text: '<p>Hiringoz ile işe alımda yeni bir döneme adım atın.</p><p>Operasyonel yükleri geride bırakın, stratejiye ve potansiyele odaklanın.</p><p>Doğru adayları keşfedin, güçlü ekipler kurun.</p>',
          ctaText: 'Hemen Başvur', ctaUrl: DEMO_CTA_URL, image: null, backgroundImage: CLOSING_BG_IMAGE,
        },
      ],
      faq: [
        { question: 'İşe alım süreci nasıl işler?', answer: 'İşe alım süreci açık pozisyonun belirlenmesiyle başlar. Ardından iş ilanı hazırlanır, aday başvuruları alınır ve ön eleme yapılır. Hiringoz ile bu adımlar dijitalleştirilir; adaylar otomatik olarak analiz edilir, mülakat planlamaları optimize edilir ve süreç tek panelden yönetilir. Böylece hem zamandan hem maliyetten tasarruf edilir.' },
        { question: 'İşe alım süreç haritası nedir?', answer: 'İşe alım süreç haritası, adayın başvuru yaptığı andan işe başladığı ana kadar geçen tüm adımların görselleştirilmiş halidir. Hiringoz, bu süreci yapay zeka destekli bir harita ile yönetir; ilan oluşturma, değerlendirme, mülakat ve teklif aşamalarını uçtan uca takip edebilmenizi sağlar.' },
        { question: 'İşe alım süreci ne kadar sürer?', answer: 'Süre, pozisyonun gerekliliklerine ve aday yoğunluğuna göre değişir. Hiringoz, akıllı filtreleme ve otomatik değerlendirme özellikleriyle işe alım süresini ciddi ölçüde kısaltır, operasyonel yükün %74’ünü ortadan kaldırır.' },
        { question: 'İşe alım süreci aşamaları nelerdir?', answer: 'İşe alım süreci; iş ilanı yayınlama, başvuruların alınması, ön eleme, mülakatlar, test ve değerlendirme, teklif verme ve onboarding adımlarından oluşur. Hiringoz tüm bu aşamaları dijitalleştirir ve sürecin her adımında ölçülebilir veriler sunar.' },
        { question: 'İşe alım sürecinde hangi testler uygulanır?', answer: 'Hiringoz; adayların yetkinliklerini ölçmek için kişilik envanterleri, yetenek testleri ve teknik değerlendirmeler uygular. Bu testler, yapay zeka tarafından analiz edilerek doğru adayları objektif biçimde belirlemenizi sağlar.' },
        { question: 'İşe alım süreci nasıl olmalı?', answer: 'Etkin bir işe alım süreci; şeffaf, hızlı, ölçülebilir ve aday deneyimini önemseyen bir yapıda olmalıdır. Hiringoz, süreci standartlaştırır ve aday deneyimini güçlendirir. Böylece işe alımda stratejik kararlar almanızı ve güçlü ekipler kurmanızı sağlar.' },
      ],
    },
    en: {
      hero: {
        title: 'Reduce recruitment costs, save time, make objective evaluations, and achieve efficiency with Hiringoz.',
        text: '<p>By digitalizing recruitment processes, Hiringoz provides speed, accuracy, and sustainable efficiency in hiring while offering strategic insights.</p><p>With AI-powered assessments, smart interview scheduling, and candidate analytics, the operational workload decreases; allowing you to focus on strategic decision-making and candidate experience.</p>',
        ctaText: 'Get Started',
        ctaUrl: DEMO_CTA_URL,
        image: { url: HERO_BG_IMAGE.url, alt: 'Illustration of five chairs with one (red) highlighted, symbolizing choosing the right candidate', width: HERO_BG_IMAGE.width, height: HERO_BG_IMAGE.height },
      },
      sections: [
        {
          title: 'Speed, Objectivity, and Strategic Value in Recruitment',
          text: '<p>Most recruitment professionals spend their time on operational tasks.</p><p>With Hiringoz, you add an AI Agent to your team and gain a digital recruiter tailored to you.</p><p>Hiringoz takes on 74% of your operational workload and automates processes, allowing you to focus on strategy and candidate experience.</p><ul><li>Accelerates the recruitment process</li><li>Ensures objectivity in evaluations</li><li>Enhances candidate experience</li></ul>',
          ctaText: '', ctaUrl: '', reverse: true,
          image: { url: '/wp-content/uploads/2025/11/hiring-2.png', alt: 'A recruiter using the Hiringoz dashboard', width: 1108, height: 793 },
        },
        {
          title: 'Smarter and Faster Hiring',
          text: '<p>Hiringoz automates sourcing, evaluation, and interview stages using artificial intelligence.</p><p>It saves time, reduces costs, and minimizes human error.</p><p>Manage the entire process from a single panel — simplify recruitment!</p>',
          ctaText: '', ctaUrl: '', reverse: false,
          image: { url: '/wp-content/uploads/2025/11/hiring-3.png', alt: 'Hiringoz dashboard showing applicant statistics', width: 1166, height: 690 },
        },
        {
          title: 'Right Candidate, Right Decision',
          text: '<p>Hiringoz evaluates not only resumes but also real skills and potential.</p><p>Identify the right candidates objectively through AI-powered tests and simulations.</p><p>Discover overlooked talents and make the right decision.</p>',
          ctaText: '', ctaUrl: '', reverse: true,
          image: { url: '/wp-content/uploads/2025/11/hiring-4.png', alt: 'Hiringoz candidate pipeline and interview score chart', width: 1230, height: 890 },
        },
        {
          title: 'Reliable Talent Verification',
          text: '<p>Success in recruitment depends on speed, accuracy, and reliability. Hiringoz verifies each candidate’s competencies through AI-assisted tests and interviews. Each recruitment becomes aligned with your company standards.</p><p>Hiringoz connects organizations with candidates whose strengths are validated, skills objectively assessed, and practical experience proven.</p>',
          ctaText: '', ctaUrl: '', reverse: false,
          image: { url: '/wp-content/uploads/2025/11/hiring-5.png', alt: 'Hiringoz skills assessment selection screen', width: 1142, height: 864 },
        },
        {
          title: 'Start Now',
          text: '<p>Step into a new era of recruitment with Hiringoz.</p><p>Leave operational burdens behind and focus on strategy and potential.</p><p>Discover the right candidates and build strong teams.</p>',
          ctaText: 'Get Started', ctaUrl: DEMO_CTA_URL, image: null, backgroundImage: CLOSING_BG_IMAGE,
        },
      ],
      faq: [
        { question: 'How does the recruitment process work?', answer: 'The recruitment process begins with identifying an open position. Then the job posting is prepared, applications are collected, and pre-screening is conducted. With Hiringoz, these steps are digitalized — candidates are automatically analyzed, interview scheduling is optimized, and the entire process is managed from a single panel. This saves both time and cost.' },
        { question: 'What is the recruitment process map?', answer: 'The recruitment process map is the visualized representation of all the steps a candidate goes through from application to onboarding. Hiringoz manages this process with an AI-powered map, allowing you to track job posting, evaluation, interview, and offer stages end-to-end.' },
        { question: 'How long does the recruitment process take?', answer: 'The duration depends on the position requirements and candidate volume. Hiringoz significantly shortens the process with smart filtering and automated evaluation features, eliminating 74% of the operational workload.' },
        { question: 'What are the stages of the recruitment process?', answer: 'The recruitment process consists of job posting, receiving applications, pre-screening, interviews, testing and evaluation, offering, and onboarding. Hiringoz digitalizes all these stages and provides measurable data at every step.' },
        { question: 'Which tests are used in the recruitment process?', answer: 'Hiringoz applies personality inventories, aptitude tests, and technical assessments to measure candidates’ competencies. These tests are analyzed by AI, helping you objectively identify the right candidates.' },
        { question: 'How should the recruitment process be structured?', answer: 'An effective recruitment process should be transparent, fast, measurable, and focused on candidate experience. Hiringoz standardizes the process and enhances candidate experience, enabling you to make strategic hiring decisions and build strong teams.' },
      ],
    },
    it: {
      hero: {
        title: 'Riduci i costi di reclutamento, risparmia tempo, effettua valutazioni oggettive e ottieni efficienza con Hiringoz.',
        text: '<p>Digitalizzando i processi di reclutamento, Hiringoz offre velocità, precisione ed efficienza nell’automazione delle assunzioni, fornendo al contempo approfondimenti strategici.</p><p>Con valutazioni basate sull’intelligenza artificiale, pianificazione intelligente dei colloqui e analisi dei candidati, il carico di lavoro operativo diminuisce, consentendoti di concentrarti sul processo decisionale strategico e sull’esperienza del candidato.</p>',
        ctaText: 'Invia Richiesta',
        ctaUrl: DEMO_CTA_URL,
        image: { url: HERO_BG_IMAGE.url, alt: 'Illustrazione di cinque sedie con una (rossa) in evidenza, che simboleggia la scelta del candidato giusto', width: HERO_BG_IMAGE.width, height: HERO_BG_IMAGE.height },
      },
      sections: [
        {
          title: 'Velocità, obiettività e valore strategico nel reclutamento',
          text: '<p>La maggior parte dei professionisti del reclutamento impiega il proprio tempo in attività operative.</p><p>Con Hiringoz, aggiungi un agente AI al tuo team e ottieni un reclutatore digitale su misura per te.</p><p>Hiringoz si fa carico del 74% del tuo carico di lavoro operativo e automatizza i processi, permettendoti di concentrarti sulla strategia e sull’esperienza del candidato.</p><ul><li>Accelera il processo di reclutamento</li><li>Garantisce l’obiettività nelle valutazioni</li><li>Migliora l’esperienza del candidato</li></ul>',
          ctaText: '', ctaUrl: '', reverse: true,
          image: { url: '/wp-content/uploads/2025/11/hiring-2.png', alt: 'Un recruiter che utilizza la dashboard di Hiringoz', width: 1108, height: 793 },
        },
        {
          title: 'Assunzioni più intelligenti e veloci',
          text: '<p>Hiringoz automatizza le fasi di screening, valutazione e colloquio utilizzando l’intelligenza artificiale.</p><p>Risparmia tempo, riduce i costi e riduce al minimo l’errore umano.</p><p>Gestisci l’intero processo da un unico pannello: semplifica il reclutamento!</p>',
          ctaText: '', ctaUrl: '', reverse: false,
          image: { url: '/wp-content/uploads/2025/11/hiring-3.png', alt: 'Dashboard Hiringoz con le statistiche dei candidati', width: 1166, height: 690 },
        },
        {
          title: 'Candidato giusto, decisione giusta',
          text: '<p>Hiringoz valuta non solo i curriculum ma anche le competenze reali e il potenziale.</p><p>Identifica i candidati giusti in modo oggettivo attraverso test e simulazioni basati sull’intelligenza artificiale.</p><p>Scopri talenti trascurati e prendi la decisione giusta.</p>',
          ctaText: '', ctaUrl: '', reverse: true,
          image: { url: '/wp-content/uploads/2025/11/hiring-4.png', alt: 'Pipeline candidati Hiringoz e grafico dei punteggi dei colloqui', width: 1230, height: 890 },
        },
        {
          title: 'Verifica affidabile dei talenti',
          text: '<p>Il successo nel reclutamento dipende da velocità, precisione e affidabilità. Hiringoz verifica le competenze di ogni candidato attraverso test e colloqui assistiti dall’intelligenza artificiale. Ogni assunzione diventa allineata agli standard della tua azienda.</p><p>Hiringoz connette le organizzazioni con candidati i cui punti di forza sono convalidati, le competenze valutate oggettivamente e l’esperienza pratica comprovata.</p>',
          ctaText: '', ctaUrl: '', reverse: false,
          image: { url: '/wp-content/uploads/2025/11/hiring-5.png', alt: 'Schermata di selezione dei test di valutazione delle competenze Hiringoz', width: 1142, height: 864 },
        },
        {
          title: 'Inizia Ora',
          text: '<p>Entra in una nuova era del reclutamento con Hiringoz.</p><p>Lasciati alle spalle gli oneri operativi e concentrati su strategia e potenziale.</p><p>Scopri i candidati giusti e costruisci team forti.</p>',
          ctaText: 'Invia Richiesta', ctaUrl: DEMO_CTA_URL, image: null, backgroundImage: CLOSING_BG_IMAGE,
        },
      ],
      faq: [
        { question: 'Come funziona il processo di reclutamento?', answer: 'Il processo di reclutamento inizia con l’identificazione di una posizione aperta. Successivamente viene preparato l’annuncio di lavoro, vengono raccolte le candidature e viene condotto il pre-screening. Con Hiringoz, questi passaggi sono digitalizzati: i candidati vengono analizzati automaticamente, la pianificazione dei colloqui è ottimizzata e l’intero processo è gestito da un unico pannello. Ciò consente di risparmiare tempo e costi.' },
        { question: 'Cos\'è la mappa del processo di reclutamento?', answer: 'La mappa del processo di reclutamento è la rappresentazione visiva di tutti i passaggi che un candidato attraversa dalla candidatura all’onboarding. Hiringoz gestisce questo processo con una mappa basata sull’intelligenza artificiale, consentendoti di tracciare le fasi di annuncio, valutazione, colloquio e offerta end-to-end.' },
        { question: 'Quanto dura il processo di reclutamento?', answer: 'La durata dipende dai requisiti della posizione e dal volume dei candidati. Hiringoz accorcia significativamente il processo con funzionalità di filtraggio intelligente e valutazione automatizzata, eliminando il 74% del carico di lavoro operativo.' },
        { question: 'Quali sono le fasi del processo di reclutamento?', answer: 'Il processo di reclutamento consiste in pubblicazione dell’annuncio, ricezione delle candidature, pre-screening, colloqui, test e valutazione, offerta e onboarding. Hiringoz digitalizza tutte queste fasi e fornisce dati misurabili in ogni fase.' },
        { question: 'Quali test vengono utilizzati nel processo di reclutamento?', answer: 'Hiringoz applica inventari di personalità, test attitudinali e valutazioni tecniche per misurare le competenze dei candidati. Questi test sono analizzati dall’intelligenza artificiale, aiutandoti a identificare oggettivamente i candidati giusti.' },
        { question: 'Come dovrebbe essere strutturato il processo di reclutamento?', answer: 'Un processo di reclutamento efficace dovrebbe essere trasparente, veloce, misurabile e focalizzato sull’esperienza del candidato. Hiringoz standardizza il processo e migliora l’esperienza del candidato, consentendoti di prendere decisioni di assunzione strategiche e costruire team forti.' },
      ],
    },
    nl: {
      // Kaynak sitede NL hiç yok (401 rest_forbidden, bkz. CLAUDE.md) — EN
      // temel alınıp gerçek çeviri üretildi (önceki override'ın AYNI ilkesi).
      hero: {
        title: 'Verminder wervingskosten, bespaar tijd, voer objectieve beoordelingen uit en behaal efficiëntie met Hiringoz.',
        text: '<p>Door wervingsprocessen te digitaliseren, biedt Hiringoz snelheid, nauwkeurigheid en duurzame efficiëntie bij het werven van personeel, en levert het strategische inzichten.</p><p>Met AI-gestuurde beoordelingen, slimme interviewplanning en kandidaatanalyses neemt de operationele werklast af, zodat u zich kunt richten op strategische besluitvorming en de kandidaatervaring.</p>',
        ctaText: 'Direct Aanvragen',
        ctaUrl: DEMO_CTA_URL,
        image: { url: HERO_BG_IMAGE.url, alt: 'Illustratie van vijf stoelen waarvan er één (rood) is uitgelicht, symbool voor het kiezen van de juiste kandidaat', width: HERO_BG_IMAGE.width, height: HERO_BG_IMAGE.height },
      },
      sections: [
        {
          title: 'Snelheid, objectiviteit en strategische waarde bij werving',
          text: '<p>De meeste wervingsprofessionals besteden hun tijd aan operationele taken.</p><p>Met Hiringoz voegt u een AI Agent toe aan uw team en krijgt u een digitale recruiter op maat.</p><p>Hiringoz neemt 74% van uw operationele werklast over en automatiseert processen, zodat u zich kunt richten op strategie en kandidaatervaring.</p><ul><li>Versnelt het wervingsproces</li><li>Zorgt voor objectiviteit bij beoordelingen</li><li>Verbetert de kandidaatervaring</li></ul>',
          ctaText: '', ctaUrl: '', reverse: true,
          image: { url: '/wp-content/uploads/2025/11/hiring-2.png', alt: 'Een recruiter die het Hiringoz-dashboard gebruikt', width: 1108, height: 793 },
        },
        {
          title: 'Slimmer en sneller werven',
          text: '<p>Hiringoz automatiseert sourcing, beoordeling en interviewfasen met behulp van kunstmatige intelligentie.</p><p>Het bespaart tijd, verlaagt kosten en minimaliseert menselijke fouten.</p><p>Beheer het hele proces vanuit één paneel — vereenvoudig werving!</p>',
          ctaText: '', ctaUrl: '', reverse: false,
          image: { url: '/wp-content/uploads/2025/11/hiring-3.png', alt: 'Hiringoz-dashboard met sollicitatiestatistieken', width: 1166, height: 690 },
        },
        {
          title: 'De juiste kandidaat, de juiste beslissing',
          text: '<p>Hiringoz beoordeelt niet alleen cv’s, maar ook echte vaardigheden en potentieel.</p><p>Identificeer de juiste kandidaten objectief met AI-gestuurde tests en simulaties.</p><p>Ontdek over het hoofd geziene talenten en neem de juiste beslissing.</p>',
          ctaText: '', ctaUrl: '', reverse: true,
          image: { url: '/wp-content/uploads/2025/11/hiring-4.png', alt: 'Hiringoz kandidatenpijplijn en interviewscoregrafiek', width: 1230, height: 890 },
        },
        {
          title: 'Betrouwbare talentverificatie',
          text: '<p>Succes bij werving hangt af van snelheid, nauwkeurigheid en betrouwbaarheid. Hiringoz verifieert de competenties van elke kandidaat via AI-ondersteunde tests en interviews. Elke aanwerving sluit aan bij uw bedrijfsstandaarden.</p><p>Hiringoz brengt organisaties in contact met kandidaten van wie de sterke punten zijn gevalideerd, vaardigheden objectief zijn beoordeeld en praktijkervaring is bewezen.</p>',
          ctaText: '', ctaUrl: '', reverse: false,
          image: { url: '/wp-content/uploads/2025/11/hiring-5.png', alt: 'Hiringoz selectiescherm voor vaardigheidstests', width: 1142, height: 864 },
        },
        {
          title: 'Begin nu',
          text: '<p>Stap met Hiringoz een nieuw tijdperk van werving binnen.</p><p>Laat operationele lasten achter u en focus op strategie en potentieel.</p><p>Ontdek de juiste kandidaten en bouw sterke teams.</p>',
          ctaText: 'Direct Aanvragen', ctaUrl: DEMO_CTA_URL, image: null, backgroundImage: CLOSING_BG_IMAGE,
        },
      ],
      faq: [
        { question: 'Hoe verloopt het wervingsproces?', answer: 'Het wervingsproces begint met het identificeren van een openstaande functie. Vervolgens wordt de vacature opgesteld, worden sollicitaties verzameld en vindt een voorselectie plaats. Met Hiringoz worden deze stappen gedigitaliseerd — kandidaten worden automatisch geanalyseerd, interviewplanning wordt geoptimaliseerd en het hele proces wordt vanuit één paneel beheerd. Dit bespaart zowel tijd als kosten.' },
        { question: 'Wat is de wervingsprocesskaart?', answer: 'De wervingsprocesskaart is de gevisualiseerde weergave van alle stappen die een kandidaat doorloopt, van sollicitatie tot onboarding. Hiringoz beheert dit proces met een AI-gestuurde kaart, waarmee u de fasen van vacature, beoordeling, interview en aanbod end-to-end kunt volgen.' },
        { question: 'Hoe lang duurt het wervingsproces?', answer: 'De duur hangt af van de functie-eisen en het aantal kandidaten. Hiringoz verkort het proces aanzienlijk met slimme filtering en geautomatiseerde beoordeling, waardoor 74% van de operationele werklast wordt weggenomen.' },
        { question: 'Wat zijn de fasen van het wervingsproces?', answer: 'Het wervingsproces bestaat uit het plaatsen van een vacature, het ontvangen van sollicitaties, voorselectie, interviews, testen en beoordeling, het doen van een aanbod en onboarding. Hiringoz digitaliseert al deze fasen en biedt meetbare gegevens bij elke stap.' },
        { question: 'Welke tests worden gebruikt in het wervingsproces?', answer: 'Hiringoz past persoonlijkheidsinventarisaties, aanlegtests en technische beoordelingen toe om de competenties van kandidaten te meten. Deze tests worden door AI geanalyseerd, zodat u objectief de juiste kandidaten kunt identificeren.' },
        { question: 'Hoe zou het wervingsproces eruit moeten zien?', answer: 'Een effectief wervingsproces moet transparant, snel, meetbaar en gericht op kandidaatervaring zijn. Hiringoz standaardiseert het proces en verbetert de kandidaatervaring, zodat u strategische wervingsbeslissingen kunt nemen en sterke teams kunt opbouwen.' },
      ],
    },
  },

  // ============================== Aşama 2.5 ==============================

  // ------------------------------ Sağlık Modülü ------------------------------
  'isyeri-saglik-yonetimi-modulu': {
    it: {
      hero: {
        title: 'Modulo Salute',
        text: '<b>La salute non va trascurata,</b> resta informato sulla salute dei tuoi dipendenti! Il modulo salute di idenfit ti aiuta a monitorare facilmente le condizioni di salute dei tuoi dipendenti e le eventuali condizioni particolari, gestendo situazioni straordinarie in base ai dati raccolti.',
        ctaText: 'Richiedi Subito', ctaUrl: DEMO_CTA_URL,
        // Görsel URL'i düzeltildi (site denetim raporu madde 4) — override
        // yazılırken TR'nin Türkçe karakterli (404 veren) dosya adı
        // yanlışlıkla kopyalanmıştı; gerçek/çalışan dosya EN/NL/IT'nin ham
        // verisinde zaten ASCII isimle mevcuttu, boyutlar zaten aynıydı.
        image: { url: '/wp-content/uploads/2025/08/1@2x.png', alt: 'modulo salute', width: 889, height: 1281 },
      },
      sections: [
        {
          title: 'Sfrutta i dati del sistema in caso di emergenza!',
          text: '<p>La maggior parte delle aziende può richiedere ai propri dipendenti, in fase di assunzione, documenti approvati come certificati medici o relazioni su condizioni particolari. A volte, in base alla posizione lavorativa, può essere richiesto di comunicare interventi chirurgici subiti, farmaci assunti regolarmente o eventuali allergie. I dati sanitari, inseriti nel sistema con il consenso dei dipendenti, vengono utilizzati per fornire un intervento adeguato in caso di emergenza.</p>',
          ctaText: 'Contattaci', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/08/2@2x.png', alt: 'dati in caso di emergenza', width: 1017, height: 1203 },
        },
        {
          title: 'Monitora facilmente i dati sanitari dei tuoi dipendenti!',
          text: '<p>Con il modulo salute di idenfit, i dati relativi alle condizioni di salute dei dipendenti — interventi chirurgici, farmaci assunti regolarmente — possono essere registrati nel sistema previo consenso scritto o su richiesta degli stessi. Le condizioni di salute, i farmaci, le condizioni particolari e l\'intera storia sanitaria possono essere mantenuti nel sistema e utilizzati in caso di emergenza.</p>',
          ctaText: 'Richiedi Presentazione Online', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/08/3@2x.webp', alt: 'dati sanitari dei dipendenti', width: 952, height: 1261 },
        },
      ],
    },
  },

  // ------------------------------ Offboarding ------------------------------
  'offboarding-modulu': {
    it: {
      hero: {
        title: 'Modulo Offboarding',
        text: 'Con il modulo offboarding, gestisci il processo di uscita in modo <b>prevedibile</b> e <b>senza stress</b>!',
        ctaText: 'Richiedi Subito', ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/07/offboarding-1.png', alt: 'modulo offboarding', width: 877, height: 1201 },
      },
      sections: [
        {
          title: 'Gestisci il processo di offboarding con la massima comunicazione.',
          text: '<p>Come nel processo di assunzione, anche in caso di uscita di un dipendente l\'intero processo può essere gestito tramite il sistema senza intoppi. Tutti i reparti vengono informati simultaneamente sullo stato di avanzamento grazie a un unico pannello. Grazie al reporting, è possibile calcolare i tassi di turnover e apportare le modifiche necessarie.</p><p>Con il modulo offboarding di idenfit: "Siamo dispiaciuti che le nostre strade si separino! Gestiamo il processo senza intoppi per salutarti nel modo migliore!"</p>',
          ctaText: 'Richiedi Presentazione Online', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/offboarding-3.png', alt: 'gestione con comunicazione', width: 1086, height: 1099 },
        },
        {
          title: 'Proteggi sia il dipendente che la tua azienda durante il processo di offboarding.',
          text: '<p>Considerando i processi da completare, l\'uscita di un dipendente è una situazione stressante sia per il dipendente che per il reparto risorse umane. Quando è necessario organizzare un incontro informativo, trasferire correttamente le informazioni o gestire la riconsegna dei beni aziendali, il modulo Offboarding di idenfit ti permette di gestire il processo senza confusione, proteggendo la percezione positiva del brand.</p>',
          ctaText: 'Contattaci', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/offboarding-2.webp', alt: 'protezione durante offboarding', width: 1081, height: 765 },
        },
      ],
    },
  },

  // ------------------------------ Anket Modülü ------------------------------
  'anket-modulu': {
    it: {
      hero: {
        title: 'Modulo Sondaggi',
        text: 'Scopri nel modo più rapido cosa pensano i tuoi dipendenti, <b>agisci subito!</b>',
        ctaText: 'Richiedi Subito', ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/07/Anket1@2x.png', alt: 'modulo sondaggi', width: 950, height: 1261 },
      },
      sections: [
        {
          title: 'Tieni il polso della tua azienda con i sondaggi!',
          text: '<p>Con il modulo sondaggi di idenfit, i pensieri e le opinioni dei dipendenti possono essere raccolti facilmente tramite sondaggi e moduli di feedback preparati e inviati attraverso il sistema, permettendo di prendere decisioni più accurate e rapide in base ai risultati. Per un\'azienda più efficiente, dai valore all\'opinione dei tuoi dipendenti.</p>',
          ctaText: 'Richiedi Subito', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/Anket2@2x.png', alt: 'tenere il polso aziendale', width: 1186, height: 751 },
        },
        {
          title: 'Ottieni risultati per reparto o complessivi!',
          text: '<p>Nel modulo sondaggi di idenfit, i responsabili possono creare domande e opzioni di risposta come desiderano. Possono somministrare il sondaggio all\'intera azienda oppure solo a reparti specifici, ottenendo risultati per reparto o complessivi. I dati risultanti possono essere riportati in modo dettagliato ed esaustivo.</p>',
          ctaText: 'Richiedi Presentazione Online', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/Anket3@2x.png', alt: 'risultati per reparto', width: 1080, height: 935 },
        },
      ],
    },
  },

  // ------------------------------ Geri Bildirim Modülü ------------------------------
  'organizasyonel-geri-bildirim-modulu': {
    it: {
      hero: {
        title: 'Modulo Feedback',
        text: '<b>Con il feedback raccolto dai dipendenti,</b> aumenta la motivazione all\'interno dell\'azienda.',
        ctaText: 'Richiedi Subito', ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/07/geri-bildirim1@2x.png', alt: 'modulo feedback', width: 1203, height: 1305 },
      },
      sections: [
        {
          title: 'Valuta la soddisfazione dei dipendenti con i report!',
          text: '<p>Con il modulo feedback di idenfit, per un\'azienda più felice, la soddisfazione dei dipendenti viene misurata con dati reali. Le risposte inserite dai dipendenti possono essere visualizzate in dettaglio tramite analisi e report, con confronti temporali (mese scorso, settimana scorsa...). Quali aree soddisfano i dipendenti o richiedono miglioramenti può essere valutato alla luce dei dati.</p>',
          ctaText: 'Contatta il Team Vendite', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/geri-bildirim3@2x.webp', alt: 'valutazione con i report', width: 1135, height: 983 },
        },
        {
          title: 'Sfrutta il feedback per dipendenti più felici!',
          text: '<p>Con il modulo feedback di idenfit, i dipendenti possono selezionare il proprio stato d\'animo istantaneo o giornaliero tramite un design divertente. I responsabili possono creare domande e risposte personalizzate, visualizzare i risultati per singola persona e apportare miglioramenti a livello individuale o di team. Nella home page delle risorse umane si ottengono dati aggregati come il tasso di soddisfazione generale.</p>',
          ctaText: 'Contatta il Team Vendite', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/geri-bildirim2@2x.webp', alt: 'feedback per dipendenti felici', width: 1161, height: 773 },
        },
        {
          title: 'Resta in contatto con i tuoi dipendenti!',
          text: '<p>La risorsa più importante delle aziende di successo sono dipendenti felici e soddisfatti. Il fatto che i responsabili rimangano costantemente in contatto con i dipendenti e dimostrino di avere a cuore il loro stato d\'animo crea un senso di valore, influenzando direttamente la soddisfazione. Con domande poste periodicamente e risposta multipla, è possibile effettuare rapidamente un\'analisi dello stato d\'animo aziendale e pianificare miglioramenti, team building ed eventi sociali.</p>',
          ctaText: 'Contattaci', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/geri-bildirim4@2x.png', alt: 'resta in contatto', width: 1111, height: 747 },
        },
      ],
    },
  },

  // ------------------------------ Şirket takvimi ------------------------------
  // NOT: Bu sayfanın IT'si kısmen çevrilmişti (hero tam doğru, section
  // başlıkları karışık, section metinleri İngilizce kalmış) — yalnızca
  // `sections` override edildi, `hero` KASITLI OLARAK BOŞ BIRAKILDI ki
  // zaten doğru olan ham veri kullanılmaya devam etsin (bkz. productContent.ts
  // merge mantığı: `override.hero` verilmezse ham veriye düşer).
  // Görsel URL'leri düzeltildi (site denetim raporu madde 4) — ikisi de
  // TR'nin Türkçe karakterli (404 veren) dosya adıyla kopyalanmıştı;
  // gerçek/çalışan dosyalar EN/NL/IT'nin ham verisinde ASCII isimle
  // mevcuttu. İlk görselin width/height'ı da TR'nin (1042×666, yanlış)
  // yerine gerçek dosyanın kendi boyutuna (1032×668) düzeltildi — ikincisi
  // zaten TR ile aynı boyuttaydı, dokunulmadı.
  'kurumsal-takvim-modulu': {
    it: {
      sections: [
        {
          title: 'Crea Eventi',
          text: '',
          ctaText: 'Contatta il Team Vendite', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/2@2x-5.png', alt: 'crea eventi', width: 1032, height: 668 },
        },
        {
          title: 'Gestisci il tuo tempo',
          text: '<p>Sul calendario aziendale puoi visualizzare il tuo programma giornaliero, gli eventi definiti, l\'intervallo di tempo e informazioni dettagliate come i partecipanti e il tipo di sessione. Puoi accedere al calendario aziendale sia dall\'app mobile che dal tuo account web personale (https://my.idenfit.com).</p>',
          ctaText: 'Richiedi Presentazione Online', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/3@2x-5.png', alt: 'gestisci il tuo tempo', width: 1019, height: 820 },
        },
      ],
    },
  },

  // ------------------------------ Notlar Modülü ------------------------------
  'notlar-modulu': {
    it: {
      hero: {
        title: 'Modulo Note',
        text: 'Usa il <b>modo più pratico</b> per prendere appunti per il tuo reparto e i tuoi dipendenti!',
        ctaText: 'Contattaci', ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/07/notlar1@2x.png', alt: 'modulo note', width: 1138, height: 1201 },
      },
      sections: [
        {
          title: 'Rendi interattivo il monitoraggio delle note con la funzione di promemoria!',
          text: '<p>Nella gestione delle risorse umane, il monitoraggio delle note relative ai dipendenti occupa un posto importante. Creare le note direttamente sulla persona interessata e registrarle in un sistema integrato con gli altri moduli riduce notevolmente il carico di lavoro. Le note create con idenfit sono personali, e la funzione di promemoria semplifica la visualizzazione retroattiva e il monitoraggio.</p>',
          ctaText: 'Richiedi Informazioni Dettagliate', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/notlar3@2x.png', alt: 'monitoraggio note con promemoria', width: 1085, height: 1295 },
        },
        {
          title: 'Crea note per persona e per data!',
          text: '<p>Con il modulo note di idenfit, nel sistema è possibile creare note relative all\'azienda o a una persona specifica, inserite in base alla persona e alla data. Oltre a contenuto e livello di importanza, se necessario è possibile allegare documenti. Le note non sono anonime: sono personali per chi le ha create e visibili solo a quella persona.</p>',
          ctaText: 'Contattaci', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/notlar2@2x.png', alt: 'note per persona e data', width: 1053, height: 888 },
        },
        {
          title: 'Gestisci le tue note insieme agli altri moduli su un\'unica piattaforma!',
          text: '<p>Con il modulo note di idenfit non ti perderai più tra fogli e post-it disordinati. Con il software idenfit, con cui puoi svolgere tutte le operazioni di gestione delle risorse umane, puoi tenere le tue note sulla stessa piattaforma, inserire note per persona in base alla data e allegare documenti.</p>',
          ctaText: 'Richiedi Presentazione Online', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/notlar4@2x.webp', alt: 'gestione note su unica piattaforma', width: 1084, height: 757 },
        },
      ],
    },
  },

  // ============================== Aşama 3 (kısım 1) — 7 temiz modül ==============================
  // docs/remaining-modules-report.md'deki "yapısal olarak sorunsuz" 7 modül.
  // Hepsinde en az bir dilde eksik/kopya/kısmen-çevrilmiş içerik bulundu —
  // KARAR 1 kuralı burada da uygulandı.

  // ------------------------------ Doküman Modülü ------------------------------
  'dokuman-yonetim-sistemi-modulu': {
    it: {
      // Ham IT verisi EN'in birebir kopyasıydı — EN'in kendi (TR'den bağımsız,
      // zaten iyi lokalize edilmiş) içeriğinden İtalyanca'ya çevrildi.
      hero: {
        title: 'Modulo Documenti',
        text: 'Carica, archivia e condividi i documenti aziendali in modo rapido e sicuro!',
        ctaText: 'Inizia Ora', ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/09/1@2x-4.webp', alt: 'modulo documenti', width: 1220, height: 1332 },
      },
      sections: [
        {
          title: 'Più digitale, meno carta!',
          text: '<p>Il modulo documenti di idenfit ti permette di ridurre la carta e gestire i tuoi documenti aziendali come file digitali. Puoi caricare, archiviare e condividere in modo sicuro i documenti organizzativi comuni, comprese le informazioni o la documentazione di registrazione e i documenti operativi.</p>',
          ctaText: 'Inizia Ora', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/3@2x-5.webp', alt: 'più digitale, meno carta', width: 864, height: 1261 },
        },
        {
          title: 'Carica facilmente i documenti aziendali!',
          text: '<p>Il modulo documenti di idenfit ti aiuta a caricare e archiviare i documenti aziendali, tra cui l\'atto costitutivo, lo statuto, il regolamento interno e qualsiasi altro documento relativo alla costituzione, proprietà o gestione di un\'azienda. Puoi gestire e categorizzare i documenti aziendali e dare ai dipendenti accesso per condividerli con il proprio team o reparto.</p>',
          ctaText: '', ctaUrl: '',
          image: { url: '/wp-content/uploads/2025/07/2@2x-8.png', alt: 'carica documenti aziendali', width: 1129, height: 731 },
        },
      ],
    },
  },

  // ------------------------------ Harcamalar Modülü ------------------------------
  'masraf-yonetimi-modulu': {
    it: {
      // Ham IT verisi EN'in kopyasıydı VE ek olarak yapıştırma artığı
      // ("1" gibi anlamsız karakterler) içeriyordu — tamamen İtalyanca'dan
      // (EN'in gerçek içeriğinden) yeniden yazıldı.
      hero: {
        title: 'Modulo Spese',
        text: 'Gestisci le spese in base alle categorie di tipo di spesa, anticipi e indennità.',
        ctaText: 'Inizia Ora', ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/07/1@2x-3.webp', alt: 'modulo spese', width: 975, height: 1241 },
      },
      sections: [
        {
          title: 'Gestisci le spese in tempo reale da mobile!',
          text: '',
          ctaText: '', ctaUrl: '',
          image: { url: '/wp-content/uploads/2025/07/2@2x-4.webp', alt: 'gestione spese da mobile', width: 1364, height: 1228 },
        },
        {
          title: 'Non perderti tra le spese!',
          text: '<p>Con il modulo spese, puoi registrare le spese in tempo reale dal tuo profilo amministratore. I dipendenti possono caricare le spese scattando una foto della ricevuta sostenuta per conto dell\'azienda. Questo modulo può assegnare un responsabile per le spese se il dipendente necessita di un\'approvazione. Grazie a funzionalità di filtraggio multiplo, la spesa desiderata può essere trovata senza perdere tempo.</p>',
          ctaText: '', ctaUrl: '',
          image: { url: '/wp-content/uploads/2025/07/2@2x-3.webp', alt: 'non perderti tra le spese', width: 1364, height: 1228 },
        },
        {
          title: 'Separa anticipi e indennità dalle spese',
          text: '<p>Categorizzare le spese in base alla fonte di pagamento ti aiuta a essere più sistematico. Poiché il tipo e l\'elenco delle spese sono separati, puoi visualizzarli in modo semplice. Inoltre, puoi determinare l\'indennità per i tuoi dipendenti. Usa la sezione anticipi per facilitare la preparazione delle buste paga, fornendo informazioni sull\'importo degli anticipi.</p>',
          ctaText: 'Richiedi Presentazione Online', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/3@2x-4.webp', alt: 'separa anticipi e indennità', width: 901, height: 1173 },
        },
      ],
    },
  },

  // ------------------------------ Mesaj Modülü ------------------------------
  'ofis-ici-mesajlasma-modulu': {
    it: {
      hero: {
        title: 'Modulo Messaggi',
        text: 'Usa il modulo messaggi per comunicare tra dipendenti e condividere i tuoi annunci con i reparti interni.',
        ctaText: 'Inizia Ora', ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/07/1@2x-1-1.png', alt: 'modulo messaggi', width: 1309, height: 1241 },
      },
      sections: [
        {
          title: 'Chat tra dipendenti',
          text: '<p>Non ridurre la tua efficienza con e-mail e chiamate, usa il modulo messaggi!</p>',
          ctaText: '', ctaUrl: '',
          image: { url: '/wp-content/uploads/2025/07/3@2x-3.png', alt: 'chat tra dipendenti', width: 951, height: 1240 },
        },
        {
          title: 'Comunicazione facile e veloce con idenfit!',
          text: '<p>Con il modulo messaggi puoi condividere informazioni importanti e note dei colloqui con il tuo team. I processi di invio possono avvenire come messaggio breve, e-mail o notifica dell\'app, a tua scelta, e puoi anche scegliere i dipendenti con cui vuoi metterti in contatto. Se vuoi dare un grande annuncio per la tua azienda, questo modulo ti aiuta a farlo collettivamente.</p>',
          ctaText: '', ctaUrl: '',
          image: { url: '/wp-content/uploads/2025/07/2@2x-3.png', alt: 'comunicazione facile e veloce', width: 1066, height: 955 },
        },
        {
          title: 'Invia e-mail, messaggi brevi o notifiche dal web!',
          text: '<p>Puoi scegliere i membri con cui vuoi metterti in contatto tra le tante opzioni di comunicazione. Specificare l\'importanza del messaggio è semplicissimo con idenfit. Invia gli annunci in tempo reale ai tuoi dipendenti.</p>',
          ctaText: '', ctaUrl: '',
          image: { url: '/wp-content/uploads/2025/07/4@2x-1.png', alt: 'invia messaggi dal web', width: 1113, height: 966 },
        },
      ],
    },
  },

  // ------------------------------ Zimmet Yönetimi ------------------------------
  // TR dışında hiçbir dil gerçekten çevrilmemişti (EN VE IT ikisi de ham
  // Türkçe) — yalnızca NL doğruydu. EN ve IT burada TR'den sıfırdan çevrildi.
  'zimmet-yonetimi-modulu': {
    en: {
      hero: {
        title: 'Asset Assignment Management',
        text: 'Easily track your fixed assets and the items assigned to employees, all in one digital platform!',
        ctaText: 'Apply Now', ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/08/zimmetler1@2x.png', alt: 'asset assignment management', width: 1035, height: 1261 },
      },
      sections: [
        {
          title: 'Easily track your fixed assets and assigned items in a digital environment!',
          text: '',
          ctaText: 'Contact Us', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/08/zimmetler2@2x.png', alt: 'track assigned items digitally', width: 1099, height: 1041 },
        },
        {
          title: 'Track asset assignments digitally!',
          text: '<p>With idenfit\'s asset management module, the issue dates of assets and the dates they need to be returned can be entered into the system. The dates on which assets are actually returned can also be recorded. Reports can be generated based on the assigned person and dates.</p>',
          ctaText: 'Request Online Presentation', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/08/zimmetler3@2x.png', alt: 'track asset assignments', width: 1099, height: 963 },
        },
      ],
    },
    it: {
      hero: {
        title: 'Gestione delle Assegnazioni',
        text: 'Monitora facilmente i tuoi beni aziendali e gli articoli assegnati ai dipendenti, tutto su un\'unica piattaforma digitale!',
        ctaText: 'Richiedi Subito', ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/08/zimmetler1@2x.png', alt: 'gestione delle assegnazioni', width: 1035, height: 1261 },
      },
      sections: [
        {
          title: 'Monitora facilmente i tuoi beni e gli articoli assegnati in ambiente digitale!',
          text: '',
          ctaText: 'Contattaci', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/08/zimmetler2@2x.png', alt: 'monitora articoli assegnati', width: 1099, height: 1041 },
        },
        {
          title: 'Monitora le assegnazioni dei beni in digitale!',
          text: '<p>Con il modulo di gestione dei beni di idenfit, le date di consegna dei beni e le date in cui devono essere restituiti possono essere inserite nel sistema. Anche le date di restituzione effettiva possono essere registrate. È possibile generare report in base alla persona assegnataria e alle date.</p>',
          ctaText: 'Richiedi Presentazione Online', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/08/zimmetler3@2x.png', alt: 'monitora le assegnazioni', width: 1099, height: 963 },
        },
      ],
    },
  },

  // ------------------------------ Servisler Modülü ------------------------------
  'personel-servisi-yonetimi-modulu': {
    nl: {
      // Yalnızca hero.title ("Shuttle Module" → Hollandaca bileşik kelime
      // konvansiyonu, bkz. "Berichtmodule"/"Documentenmodule") ve s0.text
      // (boştu) düzeltildi — geri kalanı (hero.text, tüm cta/image) zaten
      // doğru Hollandaca'ydı, aynen korundu.
      hero: {
        title: 'Shuttlemodule',
        text: 'Deel alle gedetailleerde informatie met je team terwijl je shuttles voor verschillende locaties beheert.',
        ctaText: 'Aan de slag', ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/07/1@2x-5.webp', alt: '1@2x 5', width: 1127, height: 1282 },
      },
      sections: [
        {
          title: 'slimme shuttlebeheer',
          text: '<p>Met de shuttleroute-module helpt de shuttlemodule van idenfit bedrijven om hun shuttlediensten voor verschillende afdelingen en locaties te beheren, terwijl medewerkers geïnformeerd blijven over het voertuig, aankomst- en vertrektijd, de chauffeur en diens contactgegevens, en de route van de shuttle. Het is een zeer efficiënte module voor bedrijven met veel diensten voor verschillende afdelingen en locaties.</p>',
          ctaText: 'Aan de slag', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/2@2x-5.webp', alt: '2@2x 5', width: 1056, height: 942 },
        },
      ],
    },
    it: {
      // Ham IT verisi EN'in kopyasıydı — EN'in gerçek içeriğinden çevrildi.
      hero: {
        title: 'Modulo Navetta',
        text: 'Condividi tutte le informazioni dettagliate con il tuo team mentre gestisci le navette per diverse sedi.',
        ctaText: 'Inizia Ora', ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/07/1@2x-5.webp', alt: 'modulo navetta', width: 1127, height: 1282 },
      },
      sections: [
        {
          title: 'gestione intelligente delle navette',
          text: '<p>Con il modulo percorso navetta, il modulo navetta di idenfit aiuta le aziende a gestire i turni delle navette per diversi reparti e sedi, tenendo i dipendenti informati sul veicolo, l\'orario di arrivo e partenza, l\'autista e i suoi contatti, e il percorso della navetta. È un modulo molto efficiente per le aziende che hanno molti turni per diversi reparti e sedi.</p>',
          ctaText: 'Inizia Ora', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/2@2x-5.webp', alt: 'gestione intelligente delle navette', width: 1056, height: 942 },
        },
      ],
    },
  },

  // ------------------------------ Özlük Dosyası Modülü ------------------------------
  'calisan-ozluk-yonetimi-modulu-2': {
    en: {
      // Yalnızca s0.text (boştu, TR'de dolu) eklendi — geri kalan EN
      // içeriği zaten kendi başına iyi lokalize edilmişti, korundu.
      hero: {
        title: 'Employee Information Module',
        text: 'Store your employee information secure and verify confidentiality with biometric signature.',
        ctaText: 'Get Started', ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/09/1@2x.png', alt: '1@2x', width: 913, height: 1281 },
      },
      sections: [
        {
          title: 'Store your employee information safe and secure',
          text: '<p>Digitizing personnel files and using them as digital copies is preferred by many HR departments because it is more practical and convenient.</p>',
          ctaText: 'Get Started', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/09/3@2x.png', alt: '3@2x', width: 940, height: 1281 },
        },
        {
          title: 'Verify confidentiality with biometric signature',
          text: '<p>Idenfit employee information module allows companies to centralize confidential employee information and define access permissions to authorized managers to ensure that employee information is both secure and accessible. All confidential employee information and records beside documents such as employment contract, leave approvals, financial papers, overtime forms can be stored online and verified with a biometric signature.</p>',
          ctaText: 'Get Started', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/09/2@2x.png', alt: '2@2x', width: 1129, height: 902 },
        },
        {
          title: 'Change and update employee information easily',
          text: '<p>It\'s hard to store employee information in accurate and secure way when it is shared across spreadsheets or individual documents. Idenfit lets users manage all employee data in one HR database that communicates with every other module of the software, so users can enter, update, and check employee records instantly.</p>',
          ctaText: 'Get Started', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/09/4@2x.png', alt: '4@2x', width: 1099, height: 1166 },
        },
      ],
    },
    nl: {
      hero: {
        title: 'Medewerker Informatie Module',
        text: 'Bewaar uw medewerkersinformatie veilig en verifieer vertrouwelijkheid met een biometrische handtekening.',
        ctaText: 'Aan de slag', ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/09/1@2x.png', alt: '1@2x', width: 913, height: 1281 },
      },
      sections: [
        {
          title: 'Bewaar uw medewerkersinformatie veilig en beveiligd',
          text: '<p>Het digitaliseren van personeelsdossiers en het gebruik ervan als digitale kopieën wordt door veel HR-afdelingen verkozen omdat het praktischer en gemakkelijker is.</p>',
          ctaText: 'Aan de slag', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/09/3@2x.png', alt: '3@2x', width: 940, height: 1281 },
        },
        {
          title: 'Verifieer vertrouwelijkheid met een biometrische handtekening',
          text: '<p>De medewerkersinformatie module van Idenfit stelt bedrijven in staat om vertrouwelijke medewerkersinformatie te centraliseren en toegangsrechten te definiëren voor bevoegde leidinggevenden. Alle vertrouwelijke informatie en documenten zoals arbeidsovereenkomsten, verlofgoedkeuringen en financiële documenten kunnen online worden opgeslagen en geverifieerd met een biometrische handtekening.</p>',
          ctaText: 'Aan de slag', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/09/2@2x.png', alt: '2@2x', width: 1129, height: 902 },
        },
        {
          title: 'Wijzig en update medewerkersinformatie eenvoudig',
          text: '<p>Het is moeilijk om medewerkersinformatie op een nauwkeurige en veilige manier op te slaan wanneer het verspreid is over spreadsheets of losse documenten. Met Idenfit beheert u alle medewerkersgegevens in één HR-database die communiceert met alle andere modules, zodat gegevens direct kunnen worden ingevoerd, bijgewerkt en gecontroleerd.</p>',
          ctaText: 'Aan de slag', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/09/4@2x.png', alt: '4@2x', width: 1099, height: 1166 },
        },
      ],
    },
    // TR ve IT'nin görselleri KAYNAKTA ZATEN KIRIK (site denetim raporu
    // madde 5) — `2025/08/özlükdos*@2x.png` dosyaları canlı idenfit.com'un
    // WP medya sunucusunda 404 veriyor (bizim hatamız değil, WP'nin kendi
    // veri bütünlüğü sorunu). EN/NL aynı modülün `2025/09/{1,2,3,4}@2x.png`
    // dosyalarını kullanıyor ve onlar ÇALIŞIYOR — boyutlar (913×1281,
    // 940×1281, 1129×902, 1099×1166) TR/IT'ninkilerle birebir aynı,
    // gerçekten aynı görseller, yalnızca farklı (çalışan) bir yüklemeye
    // bağlılar. Hem `tr` hem `it` override'ı bu görsellere işaret ediyor.
    tr: {
      // Metin ham veriyle birebir aynı (değişmedi) — yalnızca 4 görsel
      // düzeltildi.
      hero: {
        title: 'Özlük dosyası modülü',
        text: 'idenfit ile özlük dosyalarını dijital ortamda <b>güncel</b> ve <b>eksiksiz</b> olarak güvenle saklayın.',
        ctaText: 'Hemen Başvur', ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/09/1@2x.png', alt: 'özlük dosyası modülü', width: 913, height: 1281 },
      },
      sections: [
        {
          title: 'Güncel ve eksiksiz özlük dosyası tutun!',
          text: 'Özlük dosyalarını dijitale taşımak ve dijital kopya olarak kullanmak daha kullanışlı ve kolay olması nedeniyle birçok insan kaynakları departmanı tarafından tercih edilmektedir',
          ctaText: 'Detaylı Bilgi Al', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/09/3@2x.png', alt: 'güncel özlük dosyası', width: 940, height: 1281 },
        },
        {
          title: 'Kişisel bilgileriniz biyometrik imza ile güvende!',
          text: '<p>İş Kanunu’nun 75. maddesine göre işverenler, çalışan her personel için özlük dosyası tutmak zorundadır. Gerek görülmesi durumunda bu belgeleri yetkili kişilere göstermekle yükümlüdür.</p><p>idenfit özlük dosyası modülüyle, çalışana ait; iş sözleşmesi, işe alım ve izin evrakları, finansal belgeler, çalışma süresince aldığı evraklar, görevlendirme ve mesai formları gibi tüm resmi belge ve kayıtları online sistemde biyometrik imza ile doğrulanmış olarak saklanabilir.</p>',
          ctaText: 'Hemen Başvur', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/09/2@2x.png', alt: 'biyometrik imza', width: 1129, height: 902 },
        },
        {
          title: 'KVKK ile uyumlu olarak verileri saklayın!',
          text: '<ul><li>KVKK (Kişisel Verileri Koruma Kanunu) kuralları gereğince çalışanların kişisel bilgileri sistemde, çalışan çıkarları doğrultusunda anonimleştirilmiş olarak tutulur.</li><li>Özlük dosyalarının dijital ortamda KVKK’ya uygun olarak oluşturulması hem işveren hem de insan kaynakları departmanı çalışanları için zaman ve maliyet tasarrufu sağlar.</li></ul><p>Çalışanlarla ilgili tüm bilgilere mobil veya web üzerinden, internetin olduğu her an ve her yerden ulaşılabilir.</p>',
          ctaText: 'Online Sunum Talebi', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/09/4@2x.png', alt: 'KVKK uyumlu saklama', width: 1099, height: 1166 },
        },
      ],
    },
    it: {
      // Hero zaten doğru İtalyanca'ydı (korundu). s0.title ham Türkçe'ydi,
      // s1.text boştu, s2.text ham Türkçe'ydi — üçü de düzeltildi. Görsel
      // URL'leri de düzeltildi (yukarıdaki nota bkz. — TR'nin kırık
      // dosyası kopyalanmıştı).
      hero: {
        title: 'Modulo Fascicolo Personale',
        text: 'Archivia i fascicoli del personale in modo sicuro, aggiornati e completi in ambiente digitale con idenfit.',
        ctaText: 'Inizia Ora', ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/09/1@2x.png', alt: 'modulo fascicolo personale', width: 913, height: 1281 },
      },
      sections: [
        {
          title: 'Tieni un fascicolo del personale aggiornato e completo!',
          text: '<p>La digitalizzazione dei fascicoli del personale e il loro utilizzo in formato digitale sono preferiti da molti reparti HR poiché risultano più pratici e comodi.</p>',
          ctaText: 'Richiedi Informazioni Dettagliate', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/09/3@2x.png', alt: 'fascicolo aggiornato', width: 940, height: 1281 },
        },
        {
          title: 'I tuoi dati personali sono al sicuro con la firma biometrica!',
          text: '<p>Il modulo fascicolo del personale di idenfit consente alle aziende di centralizzare le informazioni riservate dei dipendenti e definire i permessi di accesso per i responsabili autorizzati, garantendo che le informazioni siano sicure e accessibili. Tutte le informazioni riservate e i documenti come il contratto di lavoro, le approvazioni di ferie, i documenti finanziari e i moduli di straordinario possono essere archiviati online e verificati con firma biometrica.</p>',
          ctaText: 'Inizia Ora', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/09/2@2x.png', alt: 'firma biometrica', width: 1129, height: 902 },
        },
        {
          title: 'Archivia i dati in conformità con la normativa sulla protezione dei dati (KVKK/GDPR)!',
          text: '<p>In conformità con le norme sulla protezione dei dati personali, le informazioni personali dei dipendenti vengono conservate nel sistema in forma anonimizzata, nell\'interesse dei dipendenti stessi. Creare i fascicoli del personale in formato digitale conforme al GDPR consente sia al datore di lavoro sia al reparto HR di risparmiare tempo e costi. Tutte le informazioni relative ai dipendenti sono accessibili da mobile o dal web, in qualsiasi momento e ovunque sia disponibile una connessione internet.</p>',
          ctaText: 'Richiedi Presentazione Online', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/09/4@2x.png', alt: 'conformità KVKK/GDPR', width: 1099, height: 1166 },
        },
      ],
    },
  },

  // ------------------------------ Eğitim Yönetimi Modülü ------------------------------
  'calisan-egitim-yonetimi-modulu': {
    nl: {
      // Yalnızca s0.text (boştu) eklendi — geri kalanı zaten doğru
      // Hollandaca'ydı. NOT: EN/IT'de olan 3. blok ("Evaluate training
      // success") TR/NL'de kaynakta hiç yok — bu blok TR'ye/NL'ye EKLENMEDİ
      // (KARAR 1, TR'den çeviri eksik/kopya durumlarını hedefliyor, EN'in
      // TR'de olmayan FAZLADAN içeriğini içe aktarmayı değil).
      appendSections: [],
      hero: {
        title: 'Opleidingsbeheer Module',
        text: 'Met idenfit beheert u de opleidingsprocessen & resultaten binnen en buiten de organisatie probleemloos.',
        ctaText: 'Aan de slag', ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/07/1@2x-5.png', alt: 'opleidingsbeheer module', width: 1076, height: 1339 },
      },
      sections: [
        {
          title: 'Volg de deelname aan opleidingen via idenfit!',
          text: '<p>Het volgen van de daadwerkelijke fysieke deelname van medewerkers aan trainingen die fysieke aanwezigheid vereisen, kan via mobiele apparaten worden gecontroleerd met beacon- en gps-technologie. De deelname kan in het systeem als sessies op vaste tijden worden gedefinieerd, waarbij de via het mobiele apparaat ingevoerde tijden en gegevens realtime zijn.</p>',
          ctaText: '', ctaUrl: '',
          image: { url: '/wp-content/uploads/2025/07/3@2x-7.png', alt: 'deelname volgen', width: 1102, height: 1225 },
        },
        {
          title: 'Plan uw opleidingen met idenfit!',
          text: '<p>Met de idenfit opleidingsbeheer module kunnen interne en externe opleidingen worden gepland. Opleidingen kunnen worden gecategoriseerd en gerapporteerd. Trainer, deelnemer en opleidingsinhoud kunnen in het systeem worden gedefinieerd.</p>',
          ctaText: '', ctaUrl: '',
          image: { url: '/wp-content/uploads/2025/07/2@2x-7.png', alt: 'opleidingen plannen', width: 1121, height: 1336 },
        },
      ],
    },
    it: {
      // Ham IT verisi EN'in kopyasıydı (bazı bloklarda metin de boştu) —
      // EN'in gerçek içeriğinden tamamen yeniden çevrildi.
      hero: {
        title: 'Modulo Formazione del Personale',
        text: 'idenfit ti permette di gestire senza problemi tutte le sessioni di formazione interne o esterne.',
        ctaText: 'Inizia Ora', ctaUrl: DEMO_CTA_URL,
        image: { url: '/wp-content/uploads/2025/07/1@2x-5.png', alt: 'modulo formazione del personale', width: 1076, height: 1339 },
      },
      sections: [
        {
          title: 'Ottieni risultati di formazione efficaci',
          text: '<p>Il modulo di formazione dei dipendenti basato su cloud di idenfit ti aiuta a pianificare, assegnare, monitorare e valutare i corsi di formazione in base al feedback diretto dei tuoi dipendenti, offrendoti una visione immediata dell\'efficacia delle tue sessioni di formazione. Puoi ottenere dati reali sulla partecipazione tramite sistemi di tracciamento GPS e beacon durante le sessioni, usando solo il telefono cellulare.</p>',
          ctaText: '', ctaUrl: '',
          image: { url: '/wp-content/uploads/2025/07/3@2x-7.png', alt: 'risultati di formazione efficaci', width: 1102, height: 1225 },
        },
        {
          title: 'Pianifica, Assegna, Monitora e Valuta le Formazioni',
          text: '<p>Con il modulo formazione di idenfit, pianifica sessioni di formazione interne o esterne. Carica vari documenti, file, immagini o video formativi. Monitora le informazioni sulla formazione e gli iscritti sul calendario. Aggiungi formatori, iscritti e sessioni. Invia notifiche sui dispositivi mobili. Categorizza le formazioni e ottieni report.</p>',
          ctaText: '', ctaUrl: '',
          image: { url: '/wp-content/uploads/2025/07/2@2x-7.png', alt: 'pianifica formazioni', width: 1121, height: 1336 },
        },
        {
          title: 'Valuta il successo della formazione',
          text: '<p>Valutare i risultati e l\'efficacia in modo accurato è il risultato più desiderato della formazione, ma di solito è anche il più difficile da ottenere. Il modulo formazione di idenfit ti permette di valutare la reazione dei partecipanti, il loro processo di apprendimento, le prestazioni del formatore e i risultati ottenuti al termine della formazione.</p>',
          ctaText: 'Inizia Ora', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/4@2x-4.png', alt: 'valuta il successo della formazione', width: 938, height: 1112 },
        },
      ],
    },
  },

  // ============================== Aşama 3 (kısım 2) — Puantaj (Şema E) ==============================
  // IT: hero zaten doğru İtalyanca'ydı (dokunulmadı, override'a dahil
  // edilmedi). s0/s2/s3/s4 tamamen EN kopyasıydı; s1/s5'in METNİ zaten
  // doğru İtalyanca'ydı ama BAŞLIKLARI İngilizce kalmıştı (satır satır
  // karışık çeviri — Şirket Takvimi'nde görülen örüntünün bir tekrarı);
  // FAQ'ın 5 çifti de tamamen EN kopyasıydı. Hepsi düzeltildi.
  'puantaj-takip-programi-modulu': {
    // TR: kaynağın kendi ACF alanı (`product_tit`) canlı sayfada GÖRÜNMÜYOR
    // (2026-08-24 bulgusu). `extract-products.mjs` bu alanı `hero.title`'a
    // doğru eşlemişti ("Zaman ve Devamsızlık Yönetimi") ama canlı
    // idenfit.com/puantaj-takip-programi-modulu/'nin gerçek `<h1>`'i
    // (`curl` ile doğrulandı) TAMAMEN FARKLI bir metin: "Puantaj Takip
    // Modülü" — Elementor'daki başlık widget'ı bu sayfada ACF alanına değil,
    // elle girilmiş sabit metne bağlı (WP'nin kendi post `title` alanı da
    // "Puantaj Takibi Modülü" — birbirine yakın ama YİNE farklı bir üçüncü
    // varyant, kaynağın kendi iç tutarsızlığı). Yalnızca `title` düzeltildi;
    // `text`/`ctaText`/`ctaUrl`/`image` ham `products.json`'daki `hero`
    // alanıyla BİREBİR AYNI (bu override tam blok değişimi gerektiriyor,
    // bkz. `getProductContent()`) — `ctaText`'in görünen değeri zaten ayrı
    // bir mekanizmayla (`puantaj-takip-programi-modulu.astro`'nun
    // `ctaTextOverride`'ı) yönetiliyor, burada yalnızca buton'un
    // render edilmesi için gereken truthy değer korundu.
    tr: {
      hero: {
        title: 'Puantaj Takip Modülü',
        text: '<p>Şirketinizin büyüklüğünden bağımsız olarak, Idenfit çalışanlarınızın çalışma vardiyalarını kolayca planlamanızı sağlar.</p>\n<p>Idenfit, çalışanlarınızın programlarını sadece birkaç dakika içinde planlamanıza ve izin, uygunluk ve vardiya değişikliği taleplerini yönetmenize yardımcı olur. Çalışanların çalıştığı saatleri takip edebilir, bütçe aşımını ve fazla mesaiyi önleyebilir, devamsızlık ve geç kalmaları azaltabilir ve beklenmedik değişiklikleri sorunsuz bir şekilde yönetebilirsiniz. Idenfit’in zaman ve devamsızlık yönetim modülü, çok lokasyonlu ofisler için mükemmel bir seçimdir.</p>\n<p>Idenfit’in masaüstü kontrol paneli ve mobil uygulaması, çalışanların vardiyalarını platformda kolayca yönetmelerini sağlar; vardiyalarının başlangıç ve bitiş zamanlarını kaydederek. Ara verme sürelerini manuel olarak girmenize gerek yoktur; bu otomatik olarak gerçekleşir.</p>\n',
        ctaText: 'Başlayın',
        ctaUrl: 'https://idenfit.com/request-online-presentation/',
        image: { url: '/wp-content/uploads/2025/07/1@2x.webp', alt: '1@2x', width: 1038, height: 1403 },
      },
    },
    it: {
      sections: [
        {
          title: 'Gestione del Tempo',
          text: '<p>Con la gestione presenze di Idenfit, puoi gestire senza difficoltà gli arrivi, i turni, le ferie, gli straordinari e le festività dei dipendenti. Idenfit garantisce che i turni vengano calcolati correttamente. Turni calcolati con precisione aiutano gli utenti a effettuare valutazioni delle prestazioni in modo più efficiente.</p>',
          ctaText: 'Inizia Ora', ctaUrl: DEMO_CTA_URL,
          image: null,
        },
        {
          title: 'Gestione Intelligente dei Turni',
          text: '<p class="mb-30 border-b">Puoi consentire ai tuoi dipendenti di scegliere i turni in cui desiderano lavorare pianificando i turni disponibili con il programma di gestione turni intelligente di Idenfit. I turni, le ore perse e le pause dei dipendenti possono essere visualizzati e gestiti attraverso un unico pannello. Nella gestione intelligente, i turni possono essere classificati come fissi, flessibili e dinamici. I turni fissi si basano su orari di inizio e fine specifici, mentre i turni flessibili e dinamici prendono in considerazione le ore lavorative totali durante la giornata.</p>\n<p>Riceverai una notifica automatica in caso di problemi con gli straordinari nelle ore lavorative settimanali, così non dovrai occuparti ripetutamente di tali situazioni.</p>',
          ctaText: 'Inizia Ora', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/puantajtak.2@2x.jpg', alt: 'puantajtak.2@2x', width: 751, height: 1071 },
        },
        {
          title: 'Calendario Annuale',
          text: '<p>Idenfit ti permette di gestire gli arrivi, i turni, le ferie, gli straordinari e le festività dei dipendenti su un calendario annuale per ciascun dipendente singolarmente. I dati possono anche essere modificati manualmente. Il calendario annuale offre alle aziende dati dettagliati su presenze e orari, tutti in un\'unica dashboard dove puoi monitorare le abitudini del tuo team.</p>',
          ctaText: '', ctaUrl: '',
          image: { url: '/wp-content/uploads/2025/07/puantajtak-1.webp', alt: 'puantajtak 1', width: 1147, height: 840 },
        },
        {
          title: 'Calendario dei Turni',
          text: '<p>Pianificare i turni dei dipendenti su Idenfit ti offre tutte le informazioni necessarie per pianificare turni senza conflitti in pochi minuti. Da un\'unica piattaforma, puoi monitorare i turni e vedere tutta la pianificazione sul calendario con un design colorato e piacevole. Puoi facilmente tenere conto di festività e indisponibilità, evitare conflitti di pianificazione e prevenire gli straordinari restando nel budget.</p>\n<p>Con Idenfit, non dovrai mai creare due volte lo stesso piano turni. Potrai invece sfruttare la flessibilità della nostra funzione di ripetizione o creare modelli da riutilizzare in futuro.</p>',
          ctaText: 'Inizia Ora', ctaUrl: DEMO_CTA_URL,
          image: { url: '/wp-content/uploads/2025/07/puantajtak-2.webp', alt: 'puantajtak 2', width: 1109, height: 615 },
        },
        {
          title: 'Pause',
          text: '<p>Idenfit ti permette di gestire le pause durante i turni in modo flessibile, a seconda del tipo di turno. I dati sulle pause vengono archiviati e possono essere ottenuti come report su richiesta. Le pause vengono definite e aggiunte su Idenfit in base alla politica aziendale.</p>',
          ctaText: '', ctaUrl: '',
          image: { url: '/wp-content/uploads/2025/07/5@2x.webp', alt: '5@2x', width: 801, height: 1074 },
        },
        {
          title: 'Monitor Live e Storici',
          text: '<p>I dati in tempo reale sui turni dei dipendenti possono essere visualizzati sui monitor live e storici. Sul monitor dei dati live, puoi visualizzare gli ultimi 10 movimenti in tempo reale dei dipendenti. Il monitor dei dati storici mostra la cronologia dei dati che può essere filtrata in base al personale, alla data e al terminale.</p>\n<p>Presso i terminali o i punti di controllo in cui è richiesta l\'autenticazione, le foto dei dipendenti possono essere scattate sull\'app mobile Idenfit con la funzione di acquisizione foto in tempo reale. I monitor live e storici sono costituiti interamente da dati in tempo reale.</p>',
          ctaText: '', ctaUrl: '',
          image: { url: '/wp-content/uploads/2025/07/6@2x.webp', alt: '6@2x', width: 1071, height: 899 },
        },
      ],
      faq: [
        {
          question: 'Cos\'è la rilevazione presenze e come viene calcolata?',
          answer: '<p>La rilevazione presenze si riferisce al sistema utilizzato per tenere traccia degli orari di entrata e uscita dei dipendenti, delle ferie, delle pause e degli straordinari. Per preparare dati accurati, i dati orari dei dipendenti vengono raccolti e organizzati tramite calendari orari, registri orari o software specializzati di rilevazione presenze.</p>',
        },
        {
          question: 'A cosa servono i calendari orari, i registri orari e la rilevazione presenze?',
          answer: '<p>I calendari orari o i registri orari mostrano quante ore ha lavorato un dipendente in un determinato periodo, quando è stato in ferie e se ha accumulato straordinari.</p><ul><li>Gli esempi giornalieri di rilevazione presenze aiutano i singoli a tenere traccia del proprio orario.</li><li>Gli elenchi settimanali o mensili raccolgono i dati per l\'intero team.</li><li>I calendari degli straordinari registrano le ore lavorative prolungate e supportano un\'elaborazione accurata delle buste paga.</li></ul>',
        },
        {
          question: 'Cos\'è un software di rilevazione presenze e come funziona?',
          answer: '<p>Un sistema di rilevazione presenze è una piattaforma digitale che raccoglie, organizza e riporta automaticamente i dati orari dei dipendenti, eliminando la necessità di inserimento manuale e riducendo gli errori.</p>',
        },
        {
          question: 'Come vengono monitorate le presenze dei dipendenti tramite un sistema di rilevazione presenze?',
          answer: '<p>La rilevazione presenze dei dipendenti include registrazioni individuali di presenza, ferie e straordinari. Che l\'azienda operi con turni fissi o programmi a rotazione, i sistemi di rilevazione presenze garantiscono un monitoraggio accurato per ogni dipendente.</p>',
        },
        {
          question: 'Come viene integrata la gestione delle ferie nei sistemi di rilevazione presenze?',
          answer: '<p>Il software di rilevazione presenze è integrato con i moduli di gestione ferie. Ferie annuali, giorni di malattia, permessi non retribuiti e festività vengono automaticamente visualizzati nei registri di rilevazione presenze. Questo garantisce che i motivi delle assenze siano sistematicamente documentati, semplifica l\'elaborazione delle buste paga e fornisce dati conformi per gli audit.</p>',
        },
      ],
    },
  },
};
