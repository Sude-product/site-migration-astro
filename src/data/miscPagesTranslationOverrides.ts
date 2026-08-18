// KARAR 1 (gerçek çeviri kuralı) — bu turda üretilen sayfalardan IT'nin
// eksik/kopya/boş olduğu tespit edilenler için TR kaynaktan gerçek,
// profesyonel çeviri. `tuketici-haklari`/`mesafeli-satis-sozlesmesi` burada
// YOK çünkü ikisinin de IT'si zaten gerçek, kaliteli, kaynakta hazır
// çeviriydi (kontrol edildi) — override gerekmedi.
import type { ContactContent } from './miscPagesContent';
import type { ProductBlock } from './productContent';

// Güvenlik sayfasının GDPR/KVKK linki artık gerçekten kurulu KVKK sayfamıza
// gidiyor — bu bare TR slug `miscPagesContent.ts`'teki `resolveSecurityItemUrl()`
// tarafından her locale için `getKvkkSlug(locale)`'e yeniden çözülüyor (IT
// dahil), burada elle per-locale slug yazmaya gerek yok.
const KVKK_BARE_SLUG = 'kisisel-verilerin-korunmasi';

export interface SecurityItem {
  title: string;
  linkText: string;
  url: string;
}

export const CONTACT_IT_OVERRIDE: ContactContent = {
  pageTitle: 'Siamo aperti a qualsiasi tipo di comunicazione',
  pageSubtitle: 'Per un supporto e informazioni illimitati<br>siamo sempre al tuo fianco!',
  callTitle: 'Chiamaci!',
  callText: '+31 6 27436201',
  callLinkUrl: 'tel:+31627436201',
  emailTitle: 'Scrivici!',
  emailLinkUrl: 'mailto:hello@idenfit.com',
  formTitle: 'Contattaci!',
  officesTitle: 'Uffici',
  offices: [
    { name: "Ufficio Vendite Globale dell'Aia", address: 'Zuid Hollandlaan, Rode Olifant 7, 2596 AL Den Haag/Paesi Bassi' },
    { name: 'Ufficio R&S', address: 'Teknopark İstanbul Teknopark Bulvarı 1/1A Blok No:109 Pendik' },
    { name: 'Ufficio Vendite MENA', address: 'Ofis-D. Şerifali Mah. Kale Sk. No:22 Zemin Kat 34775 Ümraniye / İSTANBUL' },
  ],
  // 2026-08-11 eklendi — heroImage/officesImage kaynakta 4 dilde AYNI
  // gerçek görsel (TR/EN/NL'nin `misc-pages.json`'daki değerleriyle
  // BİREBİR aynı URL/boyut), socialMediaTitle + videoUrl ise IT'nin kendi
  // gerçek ACF verisinden (bkz. `reference/wordpress-export/pages.json`
  // id 23526) — `social_media_title` ham ACF'de İngilizce idi (IT
  // sayfasının kaynak bug'ı, `page_title`'daki AYNI sınıf), burada gerçek
  // İtalyanca çeviriyle düzeltildi. `videoUrl` EN/NL ile AYNI
  // (`iEQ_lep-ZY8`, kaynakta da öyle — yalnızca TR'nin kendi videosu var).
  heroImage: { url: 'https://idenfit.com/wp-content/uploads/2025/08/bisiklet@2x.png', alt: 'bisiklet@2x', width: 1362, height: 1068 },
  officesImage: { url: 'https://idenfit.com/wp-content/uploads/2025/08/contact-image.webp', alt: 'contact image', width: 1299, height: 895 },
  // EN/NL ile AYNI paylaşılan dosya (kaynakta da öyle — yalnızca TR'nin
  // kendi map_image'ı var, bkz. `extract-misc-pages.mjs`).
  mapImage: { url: 'https://idenfit.com/wp-content/uploads/2025/09/contact-map-scaled.webp', alt: 'contact-map', width: 2560, height: 1433 },
  socialMediaTitle: 'Seguici sui social media per maggiori informazioni.',
  videoUrl: 'https://youtu.be/iEQ_lep-ZY8',
};

export const SECURITY_IT_OVERRIDE: SecurityItem[] = [
  { title: 'Protezione dei Dati Personali', linkText: 'GDPR', url: KVKK_BARE_SLUG },
  { title: 'Politica di Sicurezza delle Informazioni', linkText: '', url: 'https://idenfit.com/wp-content/uploads/2025/08/information_security.pdf' },
  { title: 'Politica sui Cookie e Informativa sui Cookie', linkText: '', url: 'https://idenfit.com/wp-content/uploads/2025/08/cookie_policy_and_cookie_clarification_text.pdf' },
  { title: 'Modulo di Richiesta del Titolare dei Dati', linkText: '', url: 'https://idenfit.com/wp-content/uploads/2025/08/Veri_Sahibi_Basvuru_Formu_v2EN.pdf' },
  { title: 'Informativa per Dipendenti e Candidati ai Sensi della Normativa sui Dati Personali', linkText: '', url: 'https://idenfit.com/wp-content/uploads/2025/08/Kisisel_Veriler_Kapsaminda_Calisan_ve_Calisan_Adayi_Aydinlatma_Metni_v3EN.pdf' },
  { title: 'Informativa per i Partner Commerciali in Materia di Dati Personali', linkText: '', url: 'https://idenfit.com/wp-content/uploads/2025/08/Kisisel_Veriler_Kapsaminda_İs_Ortagi_Aydinlatma_Metni_v3-EN.pdf' },
];

export const GLOBAL_BRAND_IT_HERO: ProductBlock = {
  title: 'Marchio Globale & Idenfit',
  text:
    "Siamo partiti con l'obiettivo di diventare un attore forte a livello mondiale nelle tecnologie di gestione delle risorse umane e della forza lavoro. La nostra visione è che Idenfit diventi un marchio globale entro il 2027 e venga utilizzato attivamente in almeno 3 continenti.",
  ctaText: '',
  ctaUrl: '',
  image: { url: 'https://idenfit.com/wp-content/uploads/2025/09/Group-6.webp', alt: 'global', width: 973, height: 930 },
};

export const GLOBAL_BRAND_IT_SECTIONS: ProductBlock[] = [
  {
    title: '',
    text:
      '<p>Come Idenfit, il nostro obiettivo non è solo la Turchia, ma guidare la trasformazione digitale della forza lavoro anche in diverse regioni del mondo. Con le nostre soluzioni cloud di nuova generazione, permettiamo alle aziende di gestire le proprie risorse umane in modo più efficiente, di rafforzare la propria forza lavoro e di proiettare il proprio modo di lavorare verso il futuro.</p>\n<p>Nel nostro percorso di crescita globale, lavoriamo con l\'obiettivo di entrare tra i primi 10 software più scelti al mondo. Quando realizzeremo questa visione, ci avvicineremo naturalmente anche allo status di "unicorno", simbolo di successo nel mondo imprenditoriale.</p>\n<p>Ringraziamo il nostro team che lavora ogni giorno per andare avanti, tutti i nostri partner commerciali che ci sostengono e i nostri clienti. Nel 2027, annunceremo con ancora più orgoglio il nome Idenfit come marchio globale, una soluzione utilizzata in 3 continenti.</p>',
    ctaText: '',
    ctaUrl: '',
    image: { url: 'https://idenfit.com/wp-content/uploads/2025/09/Layer_1.webp', alt: 'Layer_1', width: 1659, height: 644 },
  },
];

// "No H2 subheadings" GEO bulgusu (2026-08-19) — bkz. CLAUDE.md Açık
// nokta #32. Ham `misc-pages.json`'daki NL kaydı yalnızca `hero`
// taşıyordu, `sections: []` (tamamen BOŞ dizi) — bu yüzden sayfa TR/IT'nin
// aksine hiç `<h2>` üretmiyordu (TR/IT'nin kendi section'ı da başlıksız/
// boş bir `<h2>` üretiyor — bu AYRI, daha küçük bir kusur, bu turun
// kapsamı DIŞINDA bırakıldı). TR kaynaktan gerçek, profesyonel Hollandaca
// çeviri (KARAR 1) + section'a GERÇEKTEN anlamlı, kısa bir başlık
// eklendi ("Onze Wereldwijde Groeivisie") — TR/IT'nin boş başlığını
// KÖRÜ KÖRÜNE kopyalamak yerine, içeriğin (küresel büyüme vizyonu)
// gerçekten anlattığı tek temayı özetliyor.
export const GLOBAL_BRAND_NL_HERO: ProductBlock = {
  title: 'Wereldwijd Merk & Idenfit',
  text:
    'We hebben ons ten doel gesteld om een sterke wereldspeler te worden in human resources en workforce management technologieën. Onze visie is dat Idenfit tegen 2027 een wereldwijd merk wordt en actief wordt gebruikt op ten minste drie continenten.',
  ctaText: '',
  ctaUrl: '',
  image: { url: 'https://idenfit.com/wp-content/uploads/2025/09/Group-6.webp', alt: 'global', width: 973, height: 930 },
};

export const GLOBAL_BRAND_NL_SECTIONS: ProductBlock[] = [
  {
    title: 'Onze Wereldwijde Groeivisie',
    text:
      "<p>Als Idenfit willen we niet alleen in Turkije, maar ook in verschillende regio's van de wereld richting geven aan de digitale transformatie van de beroepsbevolking. Met onze cloudgebaseerde, nieuwe generatie oplossingen stellen we bedrijven in staat hun personeel efficiënter te beheren, hun beroepsbevolking te versterken en hun manier van werken naar de toekomst te brengen.</p>\n<p>Op onze weg naar wereldwijde groei werken we met als doel tot de tien meest gekozen software ter wereld te behoren. Wanneer we deze visie realiseren, zullen we vanzelfsprekend ook dichter bij de “unicorn”-status komen, een symbool van succes in de ondernemerswereld.</p>\n<p>We danken ons team dat elke dag hard werkt om verder vooruit te komen, al onze zakenpartners die ons steunen en onze klanten. In 2027 zullen we de naam Idenfit met nog meer trots aankondigen als wereldwijd merk, een oplossing die op 3 continenten wordt gebruikt.</p>",
    ctaText: '',
    ctaUrl: '',
    image: { url: 'https://idenfit.com/wp-content/uploads/2025/09/Layer_1.webp', alt: 'Layer_1', width: 1659, height: 644 },
  },
];

const DEMO_CTA_URL = 'https://idenfit.com/tr/online-sunum-talep-et/';

export const WHY_IDENFIT_IT_HERO: ProductBlock = {
  title: 'raggiungi obiettivi migliori per la tua azienda con una forza lavoro gestita correttamente!',
  text: '<p><strong>moduli facili, dinamici e flessibili che si supportano a vicenda</strong></p>',
  ctaText: 'Richiedi Ora',
  ctaUrl: DEMO_CTA_URL,
  image: { url: 'https://idenfit.com/wp-content/uploads/2025/08/1@2x-2-2.webp', alt: '1@2x 2 2', width: 1080, height: 1080 },
};

export const WHY_IDENFIT_IT_SECTIONS: ProductBlock[] = [
  {
    title: '40 buoni motivi <br>per idenfit',
    text:
      '<p><strong>Abbiamo 40 buoni motivi per iniziare a usare Idenfit oggi stesso.</strong></p><p>Crediamo che dietro ogni azienda di successo ci siano persone straordinarie. Ti supportiamo nel raggiungere l\'efficienza della forza lavoro dei tuoi sogni e nel realizzare i tuoi obiettivi. Idenfit offre alle aziende l\'esperienza utente che desiderano, grazie a prodotti e servizi che creano valore e ai principi di redditività, soddisfazione del cliente e trasparenza.</p>',
    ctaText: '',
    ctaUrl: '',
    image: null,
  },
  {
    title: 'Garanzia di servizio di prima classe',
    text:
      '<p><strong>Ci prendiamo cura di te e delle tue richieste. Con il servizio che offriamo come Idenfit, ti facciamo sentire speciale.</strong></p><p>Con 20 anni di esperienza nel settore, un\'infrastruttura solida e un database sicuro, garantiamo ai nostri utenti una qualità di servizio di prima classe. Lavoriamo per soddisfare le tue richieste nel modo più rapido, personalizzato e adatto alla tua azienda.</p>',
    ctaText: '',
    ctaUrl: '',
    image: null,
  },
  {
    title: 'Vantaggi',
    text:
      '<ul class="list gray"><li>Paghi mensilmente in base all\'utilizzo</li><li>Accedi al sistema sempre e ovunque</li><li>Automatizza i processi aziendali</li><li>Aumenta l\'efficienza</li><li>Favorisce una comunicazione migliore</li><li>Semplifica i processi di onboarding</li><li>Riduce il turnover dei dipendenti</li><li>Riduce l\'assenteismo aziendale</li><li>Ti fa risparmiare tempo per concentrarti sul tuo core business</li><li>Non richiede investimenti di acquisto anticipati</li></ul>',
    ctaText: '',
    ctaUrl: '',
    image: null,
  },
  {
    title: 'Vantaggi principali',
    text:
      '<ul class="list gray"><li>Offre 20 anni di esperienza del team</li><li>Digitalizza i processi delle risorse umane</li><li>Offre applicazioni mobili e modulari</li><li>Fornisce un database sicuro e affidabile</li><li>Include formazione per gli utenti</li><li>Offre supporto gratuito</li><li>Facile da acquistare, imparare e usare</li><li>Garantisce un\'ottima esperienza utente</li><li>Organizza report analitici</li><li>Innovazione continua del sistema</li><li>Si integra con applicazioni e dispositivi hardware popolari</li></ul>',
    ctaText: '',
    ctaUrl: '',
    image: null,
  },
  {
    title: 'Infrastruttura',
    text:
      '<ul class="list gray"><li>Architettura basata su Java – dotata di un\'infrastruttura solida</li><li>Certificazione ISO-27001 – sicurezza informatica (ISO-9001)</li><li>Conforme al GDPR – non viola la protezione dei dati</li><li>SHA-2 SSL 256-Bit AES – transazioni sicure</li><li>Sistema espandibile e scalabile</li><li>Dati anonimizzati – dati sensibili separabili</li><li>Database con backup automatico</li><li>Nessun costo di manutenzione</li><li>Nessun investimento richiesto in server, database o licenze</li><li>Piattaforma basata sul cloud di Amazon Web Services</li></ul>',
    ctaText: '',
    ctaUrl: '',
    image: null,
  },
  {
    title: 'Supporto',
    text:
      '<ul class="list gray"><li>Offre un servizio clienti di prima classe</li><li>Aggiornamenti / upgrade / supporto gratuiti</li><li>Supporto gratuito per personalizzazione e sviluppo</li><li>Offre supporto gratuito</li><li>Caratteristiche rapidamente applicabili</li><li>Dà priorità al cliente</li><li>Aumenta la fidelizzazione dei dipendenti all\'azienda</li><li>Supporto per app mobile individuale</li><li>Crea soddisfazione del cliente</li><li>Non richiede assistenza in loco</li></ul>',
    ctaText: '',
    ctaUrl: '',
    image: null,
  },
];

// ============================== Hakkımızda ==============================
// EN'in "Our story" bölümü kaynakta EKSİK: `section_2_text` (Johann Meyer/
// 1878 tarihçe paragrafı) boş, yalnızca `section_2_text_3` (gelecek odaklı
// ikinci paragraf) doluydu — TR'nin tarihçe paragrafı İngilizce'ye çevrilip
// başa eklendi (`appendSections` değil, tam `sections` override — tek
// bloğun içindeki eksik parçayı tamamlıyor).
// ⚠️ DÜZELTME (2026-08-04): kaynak site "Burada olmaktan mutluyuz =)"
// bölümünün ekip fotoğrafını 2026-05'te değiştirdi (`hakkimizda-1-1.png`,
// 2025/10 → `Group-1365418971.png`, 2026/05, 4096×2232 — canlı TR/EN/IT'nin
// ÜÇÜ de element-ID doğrulamalı bu YENİ görseli kullanıyor, tek bir dile
// özel değil, site geneli bir güncelleme). Görsel gerçekten görüntülenip
// (Read tool) içeriği doğrulandı: idenfit çalışanlarının fotoğraflarından
// oluşan kırmızı/siyah bir kolaj + "GREAT PEOPLE GREAT COMPANY"/"LATER IS
// NEVER"/"YOU" marka sloganları.
export const ABOUT_TEAM_PHOTO_IMAGE = {
  url: 'https://idenfit.com/wp-content/uploads/2026/05/Group-1365418971.png',
  alt: 'idenfit çalışanlarının fotoğraflarından oluşan kolaj',
  width: 4096,
  height: 2232,
};

export const ABOUT_EN_SECTIONS: ProductBlock[] = [
  {
    title: 'Our story',
    text:
      '<p>In Berlin, watchmaker Johann Meyer opened a watch shop in Istanbul in 1878 as the chief watchmaker of the Ottoman Empire. His son and grandsons transformed this small business into a five-generation global company. For over 140 years, we have been answering the questions "Who, where, and when?"</p>We are working hard to become one of the top 10 software solutions in the world for human resources and workforce planning. The values we inherited from Johann Meyer 140 years ago continue under the idenfit brand, driving us to create a more innovative and better future in our field.',
    ctaText: '',
    ctaUrl: '',
    image: null,
  },
  {
    title: 'We love being here!',
    text: '',
    ctaText: '',
    ctaUrl: '',
    image: ABOUT_TEAM_PHOTO_IMAGE,
  },
];

// IT'nin TÜM sayfası (hero dahil) kelimesi kelimesine EN'in kopyasıydı
// ("Our goal to become...", "We love being here!" — hiç İtalyanca'ya
// çevrilmemiş) — TR kaynaktan gerçek İtalyanca çeviri.
export const ABOUT_IT_HERO: ProductBlock = {
  title:
    'Il nostro obiettivo è diventare uno dei migliori marchi al mondo, raggiungendo nuovi successi nel settore del software con la nostra identità innovativa e pionieristica.',
  text: '<p><strong>Il team idenfit</strong></p>',
  ctaText: 'Candidati Ora',
  ctaUrl: DEMO_CTA_URL,
  image: { url: 'https://idenfit.com/wp-content/uploads/2025/09/about-us-1.webp', alt: 'about us image', width: 2282, height: 1323 },
};

export const ABOUT_IT_SECTIONS: ProductBlock[] = [
  {
    title: 'la nostra storia',
    text:
      '<p>A Berlino, l\'orologiaio Johann Meyer aprì un negozio di orologi a Istanbul nel 1878, come orologiaio capo dell\'Impero Ottomano. Suo figlio e i suoi nipoti trasformarono questa piccola attività in un\'azienda globale attiva da 5 generazioni. Da oltre 140 anni rispondiamo alle domande "Chi, dove e quando?"</p>Lavoriamo duramente per diventare una delle prime 10 soluzioni software al mondo nel campo delle risorse umane e della pianificazione del personale. Portando avanti i valori ereditati da Johann Meyer 140 anni fa, il nostro obiettivo è lasciare, sotto il marchio idenfit, un futuro più innovativo e migliore.',
    ctaText: '',
    ctaUrl: '',
    image: null,
  },
  {
    title: 'Siamo felici di essere qui =)',
    text: '',
    ctaText: '',
    ctaUrl: '',
    image: ABOUT_TEAM_PHOTO_IMAGE,
  },
];

// ================= Online Sunum Talebi (Request Online Presentation) =================
// IT'nin TÜM alanları (pageTitle/formTitle dışında) kaynakta BOŞTU — EN'in
// bile kopyası değil, gerçekten hiç doldurulmamış (bkz. `misc-pages.json`).
// TR kaynaktan tam İtalyanca çeviri.
//
// ⚠️ DÜZELTME (2026-08-04): EN'de `callText`/`phoneNumber`/`phoneNumberLink`
// kaynakta GERÇEKTEN boş (canlı `idenfit.com/en/request-online-presentation/`
// element-ID doğrulamalı kontrol edildi, `tel:` linki hiç yok) — önceki not
// bunun "EN'in kendi bilinçli tercihi" olduğunu varsayıyordu, ama kullanıcı
// bu turda EN sayfasında telefon arama yönlendirmesinin EKSİK olduğunu
// bildirip eklenmesini istedi. Çözüm: `PRESENTATION_EN_OVERRIDE` — site
// genelinde (footer, `FloatingContactButtons`, `HeroSection`) zaten TEK bir
// numara kullanılıyor (`+90 216 295 09 27`, `FOOTER_CONTACT` ile aynı) —
// idenfit'in ayrı bir İngilizce destek hattı yok, aynı numara EN
// ziyaretçilere de gösteriliyor.
//
// ⚠️ DÜZELTME (2026-08-04, 4. tur): kullanıcı IT'de de aynı eksikliği
// bildirdi — IT_OVERRIDE'ın callText/phoneNumber/phoneNumberLink'i AYNI
// gerekçeyle (idenfit'in ayrı bir İtalyanca destek hattı yok, site geneli
// TEK numara) dolduruldu, aşağıda görülebilir.
//
// ⚠️ DÜZELTME (2026-08-04, 2. tur): kullanıcı "çeviri yanlış" dedi — element-ID
// doğrulamalı karşılaştırma sayfanın TÜM görünür metninin canlı kaynakla
// BİREBİR eşleştiğini gösterdi (yanlış bir çeviri YOK), ama kaynağın KENDİ
// İngilizcesi 3 yerde gramer hatası taşıyor. Kullanıcı bunları düzeltmemizi
// onayladı (kaynağa körü körüne sadakat yerine kullanılabilirlik önceliği —
// projenin YoutubeClickToPlay/placeholder-rengi presedanlarıyla aynı ilke):
// `info[1]` "Pay per as many employees as you want" → doğal İngilizceye,
// `info[2]` "Free update" → çoğul "Free updates", `formText`'teki fazladan
// "the" ("taking the advantage of") kaldırıldı, `integrationsText`teki
// eksik edat ("Work integrated" → "Integrate With") düzeltildi.
export const PRESENTATION_EN_OVERRIDE = {
  callText: 'Call Now',
  phoneNumber: '+90 216 295 09 27',
  phoneNumberLink: 'tel:+902162950927',
  info: ['No credit card needed', 'Pay only for the employees you need', 'Free updates'],
  formText: "Fill in the form and start taking advantage of Idenfit's special offers!",
  integrationsText: 'Systems We Can<br>Integrate With',
};

export interface PresentationContent {
  pageTitle: string;
  info: string[];
  callText: string;
  phoneNumber: string;
  phoneNumberLink: string;
  formTitle: string;
  formText: string;
  integrationsText: string;
  integrationsImage: { url: string; alt: string; width: number; height: number } | null;
  referencesText: string;
  referencesImage: { url: string; alt: string; width: number; height: number } | null;
}

export const PRESENTATION_IT_OVERRIDE: PresentationContent = {
  pageTitle: 'Sperimenta velocità ed efficienza nella gestione delle risorse umane con idenfit.',
  info: [
    'Pronto in 48 ore, utilizzo immediato',
    'Il tuo processo di onboarding è semplicissimo con noi',
    'Trasferimento dati sicuro e senza interruzioni',
  ],
  callText: 'Chiama Ora',
  phoneNumber: '+90 216 295 09 27',
  phoneNumberLink: 'tel:+902162950927',
  formTitle: 'Richiesta di Presentazione Online',
  formText:
    "Compila subito il modulo per usufruire delle soluzioni che idenfit offre appositamente per te, ti contatteremo!",
  integrationsText: 'Sistemi con cui possiamo <br>lavorare in modo integrato',
  integrationsImage: { url: 'https://idenfit.com/wp-content/uploads/2025/08/79d119e.webp', alt: '79d119e', width: 394, height: 210 },
  referencesText: 'Unisciti anche tu alle straordinarie aziende <br>che si fidano di noi!',
  // 2026-07-30: kaynak site bu görseli güncelledi (`onlinerequest.png`, 7
  // logo → `customer-brands.jpeg`, 12 logo) — bkz. misc-pages.json'daki
  // TR/EN kayıtlarının aynı güncellemesi. `uploads.zip`'ten yerelleştirildi.
  referencesImage: { url: '/wp-content/uploads/2026/01/customer-brands.jpeg', alt: 'Marchi dei clienti', width: 1000, height: 982 },
};

// ⚠️ YENİ (2026-08-04): NL için de kaynakta bu sayfa HİÇ yok — canlı
// `idenfit.com/nl/`'in kendi "Demo Aanvragen" CTA'sı bile kendi NL sayfası
// olmadığı için EN'in `request-online-presentation` URL'ine gidiyor
// (doğrulandı, NL sitesinin KENDİSİ de bu sayfayı EN'e devrediyor). Kullanıcı
// yine de gerçek bir NL sayfası istedi — KARAR 2'nin ("kaynakta olmayan
// çeviriler için sayfa üretimi ertelendi") istisnası, kullanıcının bu SAYFA
// için AÇIK talimatı üzerine. IT_OVERRIDE'ın izlediği AYNI yöntemle (TR
// kaynaktan gerçek profesyonel çeviri, EN'in DEĞİL — IT_OVERRIDE'ın kendi
// yorumundaki "TR kaynaktan tam çeviri" ilkesiyle tutarlı) yazıldı.
// callText/phoneNumber: EN'de olduğu gibi site genelinde (footer/
// FloatingContactButtons/Hero) zaten kullanılan TEK numara.
export const PRESENTATION_NL_OVERRIDE: PresentationContent = {
  pageTitle: 'Ervaar snelheid en efficiëntie in HR-beheer met idenfit.',
  info: [
    'Binnen 48 uur klaar, direct te gebruiken',
    'Uw onboardingproces verloopt bij ons moeiteloos',
    'Veilige en naadloze gegevensmigratie',
  ],
  callText: 'Bel Nu',
  phoneNumber: '+90 216 295 09 27',
  phoneNumberLink: 'tel:+902162950927',
  formTitle: 'Online Presentatie Aanvragen',
  formText:
    'Vul het formulier direct in om te profiteren van de oplossingen die idenfit speciaal voor u biedt, we nemen contact met u op!',
  integrationsText: 'Systemen Waarmee We <br>Kunnen Integreren',
  integrationsImage: { url: 'https://idenfit.com/wp-content/uploads/2025/08/79d119e.webp', alt: '79d119e', width: 394, height: 210 },
  referencesText: 'Sluit u aan bij de geweldige bedrijven <br>die ons al vertrouwen!',
  referencesImage: { url: '/wp-content/uploads/2026/01/customer-brands.jpeg', alt: 'Klantmerken', width: 1000, height: 982 },
};
