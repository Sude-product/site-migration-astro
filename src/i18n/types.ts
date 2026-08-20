// i18n şema tanımı — tüm dil dosyaları (tr/en/nl/it) bu şekle `: Translations`
// olarak uymak zorunda. Bir anahtar tr.ts'de olup başka bir dilde eksikse
// TypeScript derleme zamanında hata verir (eksik/fazla property kontrolü).

/** Sayfa tipinden bağımsız, birden fazla şablonda paylaşılan küçük
 * metinler — bkz. `LastUpdated.astro` ("No visible content dates" GEO
 * bulgusu, 2026-08-17). */
export interface CommonLabels {
  lastUpdated: string;
}

export interface NavLabels {
  products: string;
  whyIdenfit: string;
  sectors: string;
  pricing: string;
  customers: string;
  company: string;
  discover: string;
}

export interface CtaLabels {
  login: string;
  requestDemo: string;
  submit: string;
}

// KVKK/Kullanım Koşulları onay metni — WP'nin gerçek `banner_kvkk_metin`
// ACF alanından (ana sayfa + Online Sunum Talebi sayfası, ikisi de aynı
// metni kullanıyor) alınan, iki gerçek link içeren cümle. Her dilde cümle
// yapısı [prefix][KVKK linki][middle][Kullanım Koşulları linki][suffix]
// şeklinde ayrıştırılabiliyor (bkz. HeroForm.tsx render mantığı).
export interface KvkkNoticeLabels {
  prefix: string;
  kvkkLinkText: string;
  middle: string;
  termsLinkText: string;
  suffix: string;
}

export interface HeroLabels {
  title: string;
  description: string;
  /** 2026-08-19, kullanıcı isteğiyle eklendi — hero'nun GÖRÜNÜR H1/alt
   * metni artık `title`/`description`'dan AYRI bir çift (`headline`/
   * `subheadline`). Neden ayrı: `title`/`description` hâlâ `<title>`
   * etiketi (`index.astro`) VE meta description'ın (`BaseLayout`) kaynağı
   * — anahtar kelime içeren eski metni (`"Tüm İK Süreçlerinizi Hemen
   * Dijitalleştirin!"` vb.) SEO için korumak, aynı anda sayfada yeni bir
   * marka sloganı ("People first. Everything else, simplified.") GÖSTERMEK
   * istendi. İkisini AYNI alana yazıp SEO'yu bozmak yerine iki ayrı alan
   * eklendi — `title`/`description` artık yalnızca <title>/meta description
   * kaynağı, `headline`/`subheadline` yalnızca H1/paragraf render'ı. */
  headline: string;
  subheadline: string;
  /** Hero'nun YENİ tek-alanlı (yalnızca e-posta) formunun placeholder'ı —
   * `HeroEmailCaptureForm.astro`, 2026-08-19. Eski çok-alanlı `formEmail`
   * ("Mail") ile KARIŞTIRILMASIN — o hâlâ Contact/Presentation/Panel
   * formlarında kullanılıyor, bu yalnızca hero'nun yeni formu için. */
  emailPlaceholder: string;
  formName: string;
  formPhone: string;
  /** Telefon alanı geçersiz/eksikken (submit denemesinden sonra) gösterilen
   * hata metni — bkz. HeroForm.tsx. */
  formPhoneError: string;
  /** Ülke kodu seçicinin erişilebilir etiketi + arama kutusu metinleri
   * (bkz. PhoneCountrySelect.tsx). */
  formPhoneCountryLabel: string;
  formPhoneCountrySearchPlaceholder: string;
  formPhoneCountryNoResults: string;
  formCompany: string;
  formEmail: string;
  /** "Mesajınız" — yalnızca İletişim sayfasının formunda kullanılıyor
   * (`HeroForm.tsx`'in `showMessage` prop'u, 2026-08-11 KARAR). Hero'nun
   * kendisi bu alanı hiç render etmiyor ama diğer 4 form etiketiyle aynı
   * `t.hero.*` grubunda tutuluyor (component zaten tüm etiketleri
   * `t.hero.*`'dan alıyor). */
  formMessage: string;
  formSubmit: string;
  /** CTA/anchor text optimizasyonu (2026-08-12) — `HeroForm.tsx`'in
   * submit butonu jenerik metin taşıdığında (`isGenericCtaText()`)
   * `buildCtaAnchorText(ctaKeyword, locale)`'a düşülür (ör. TR: "Ücretsiz
   * Demo için Başvur"). Yalnızca ana sayfanın hero formunda kullanılıyor
   * (`HeroSection.astro`) — `PanelFeatureSection.astro` kendi gerçek
   * `home.panel.title`'ını (zaten var olan, çeviri gerektirmeyen bir
   * metin) kullanıyor. */
  ctaKeyword: string;
  kvkkNotice: KvkkNoticeLabels;
  sideTitle: string;
  sideSubtitle: string;
  /** Ana sayfa hero formunun altındaki "Destek Talebi" giriş linki —
   * kaynakta bulunamadı (idenfit.com'un anasayfasında/footer'ında bu linke
   * rastlanmadı), kullanıcı isteğiyle 2026-07-27'de yeni eklendi (bkz.
   * CLAUDE.md). */
  supportRequestLink: string;
  /** WhatsApp/telefon hızlı iletişim butonlarının aria-label'ı (2026-07-28,
   * kaynağın sağ-altta sabit duran WhatsApp/Ara butonlarıyla aynı ikonografi,
   * "Destek Talebi İçin Tıklayın" linkinin altına eklendi). */
  whatsappLabel: string;
  callLabel: string;
  /** Online Sunum Talebi sayfasının (`PresentationRequestPage.astro`) KENDİ
   * form widget'ı (`69d7eaa`, template 15441, TR/EN/IT'de element-ID
   * doğrulamalı okundu — 2026-08-04) — yukarıdaki formName/formPhone/
   * formCompany/formEmail'den (Hero'nun widget'ı `43e32bd`) FARKLI
   * placeholder'lar kullanıyor, aynı `t.hero.*` paylaşılmasın diye ayrı
   * tutuldu. */
  presentationForm: {
    name: string;
    phone: string;
    email: string;
    company: string;
  };
}

export interface FooterColumnTitles {
  about: string;
  products: string;
  general: string;
}

export interface FooterAboutLinks {
  story: string;
  contact: string;
  blog: string;
  kvkk: string;
  security: string;
  globalBrand: string;
}

export interface FooterProductLinks {
  employeeRecords: string;
  recruitment: string;
  performance: string;
  training: string;
  timesheet: string;
  leaveManagement: string;
  hardware: string;
  timeAttendance: string;
}

export interface FooterGeneralLinks {
  pricing: string;
  advantages: string;
  successStories: string;
  faq: string;
  consumerRights: string;
  /** "Gizlilik ve Güvenlik Politikası" — GENEL kolonunda kaynaktaki gibi
   * uzun/tam etiket. About kolonundaki kısa "Güvenlik" (`about.security`,
   * `getSecuritySlug()`, 6 hukuki belgeye link veren liste sayfası) ile
   * AYNI sayfa DEĞİL — ayrı, gerçek paragraf içerikli bir makale
   * (`getPrivacySecuritySlug()`). */
  securityPolicy: string;
  distanceSalesAgreement: string;
}

export interface FooterLinks {
  about: FooterAboutLinks;
  products: FooterProductLinks;
  general: FooterGeneralLinks;
}

export interface FooterLabels {
  columnTitles: FooterColumnTitles;
  links: FooterLinks;
  /** "{year}" değişkeni render sırasında gerçek yılla değiştirilir. */
  copyright: string;
  privacy: string;
  kvkk: string;
  /** Ödeme yöntemi rozetleri görselinin (iyzico/Troy/Visa/Mastercard/Amex) alt metni. */
  paymentMethodsAlt: string;
  /** Güven rozetleri şeridindeki 4 ayrı logonun (SSL/ISO 27001/Peryön/GDPR) alt metinleri. */
  trustBadges: {
    ssl: string;
    iso: string;
    peryon: string;
    gdpr: string;
  };
}

export interface MegaUrunlerIntro {
  title: string;
  description: string;
  faqLink: string;
}

export interface MegaUrunlerEmployeeLabels {
  title: string;
  /** Kolonun en üstündeki "Genel Bakış" linki — İK hub sayfasına gider
   * (bkz. `hubContent.ts`, `insan-kaynaklari-yonetimi-modulu`). */
  overview: string;
  personalFile: string;
  corporateCalendar: string;
  documents: string;
  expenseManagement: string;
  training: string;
  assetManagement: string;
  messages: string;
  notes: string;
  shuttleServices: string;
  occupationalHealth: string;
}

export interface MegaUrunlerWorkforceLabels {
  title: string;
  /** Kolonun en üstündeki "Genel Bakış" linki — İK hub sayfasına gider
   * (bkz. `hubContent.ts`, `insan-kaynaklari-isgucu-yonetimi`). */
  overview: string;
  timeAttendance: string;
  timesheetTracking: string;
  leaveManagement: string;
  payroll: string;
}

export interface MegaUrunlerTalentLabels {
  title: string;
  onboarding: string;
  offboarding: string;
  employeeExperience: string;
  survey: string;
  performanceOkr: string;
  recruitmentAts: string;
}

export interface MegaUrunlerHardwareLabels {
  title: string;
  overview: string;
  integratedDevices: string;
  biometricDevices: string;
  rfidDevices: string;
  turnstiles: string;
}

export interface MegaUrunlerPromo {
  /** "LATER IS NEVER" — marka sloganı, bilinçli olarak dillerde çevrilmedi. */
  titleLines: [string, string, string];
  description: string;
  ctaText: string;
  imageAlt: string;
}

export interface MegaUrunlerLabels {
  intro: MegaUrunlerIntro;
  employeeManagement: MegaUrunlerEmployeeLabels;
  workforceManagement: MegaUrunlerWorkforceLabels;
  talentManagement: MegaUrunlerTalentLabels;
  hardwareManagement: MegaUrunlerHardwareLabels;
  promo: MegaUrunlerPromo;
}

export interface MegaSektorlerLabels {
  title: string;
  food: string;
  services: string;
  tourism: string;
  retail: string;
  energy: string;
  healthcare: string;
  education: string;
  security: string;
  facilityManagement: string;
  industryAutomotive: string;
  legalConsulting: string;
  logisticsDistribution: string;
}

export interface MegaKurumsalLabels {
  title: string;
  about: string;
  contact: string;
  faq: string;
  globalBrand: string;
  /** Sağ taraftaki promo kart (görsel + kategori etiketi + başlık) — kaynakta
   * yok, kullanıcı talimatıyla eklendi (bkz. navigation.ts `promoCard`). */
  promo: MegaKesfetReportItem;
}

export interface MegaKesfetReportItem {
  category: string;
  title: string;
  imageAlt: string;
}

export interface MegaKesfetLabels {
  contentTitle: string;
  blog: string;
  /** Yalnızca Bloglar kartının altında (KEŞFET → İçerikler, `content-card`
   * stili) — kaynağın gerçek açıklama metni, bkz. `navigation.ts`. */
  blogDescription: string;
  digitalMaturityTest: string;
  /** Yalnızca Dijital İK Olgunluk Testi kartının altında (KEŞFET →
   * İçerikler, `content-card` stili) — kaynağın gerçek açıklama metni. */
  digitalMaturityTestDescription: string;
  calculatorsTitle: string;
  overtimePay: string;
  incomeTax: string;
  employerCost: string;
  severancePay: string;
  salaryRaise: string;
  corporateTax: string;
  mealAllowance: string;
  noticePeriod: string;
  reportsTitle: string;
  generationsWorkforce: MegaKesfetReportItem;
  dataDrivenRecruitment: MegaKesfetReportItem;
  digitalTransformation: MegaKesfetReportItem;
  strategicHr: MegaKesfetReportItem;
}

/** Kolon-tipi bağımsız, MegaMenu.tsx içinde tekrar kullanılan küçük UI metinleri. */
export interface MegaUiLabels {
  nextReports: string;
  prevReports: string;
}

export interface MegaLabels {
  urunler: MegaUrunlerLabels;
  sektorler: MegaSektorlerLabels;
  kurumsal: MegaKurumsalLabels;
  kesfet: MegaKesfetLabels;
  ui: MegaUiLabels;
}

export interface HeaderUiLabels {
  openMenu: string;
  closeMenu: string;
  brandHome: string;
  mainNav: string;
  langLabel: string;
}

export interface CustomerStoryQuoteLabels {
  text: string;
  /** Bazı alıntılarda isim/rol yok (kaynakta da yok — ör. Tuğba Kuruyemiş'in
   * yalnızca ismi var, rolü hiç belirtilmemiş — uydurulmadı). */
  name?: string;
  role?: string;
}

/** Tek bir müşteri bloğunun çevrilen metni (isim/görsel/taraf gibi dile
 * bağlı olmayan alanlar `src/data/customerStories.ts`'de tutulur).
 * 2026-07-27 (ikinci tur) — canlı siteyle yeniden karşılaştırılıp
 * güncellendi, bkz. customerStories.ts'in başındaki revizyon notu. */
export interface CustomerStoryLabels {
  /** Şirket tanıtım paragrafı — Femaş/Civil/Yatsan'da var. Doğ-Ser/Tuğba
   * Kuruyemiş'te YOK (tek içerikleri `quote`). */
  description?: string;
  employeeCount: string;
  /** "X mağaza/şube/lokasyon" — yalnızca bazılarında var. */
  secondaryStat?: string;
  /** Ana bloktaki isimli alıntı — Yatsan/Doğ-Ser/Tuğba'da var (ikincisi
   * ikisinde TEK içerik budur). */
  quote?: CustomerStoryQuoteLabels;
}

/** Civil'in kaynakta GERÇEKTEN AYRI bir ikinci bloğu var (şirket tanıtımından
 * sonra, kendi videosu + kişi fotoğrafıyla ayrı bir "liderlik testimonial'ı"
 * — 2026-07-27'de bulundu, bkz. customerStories.ts). */
export interface CustomerStorySecondaryLabels {
  quote: CustomerStoryQuoteLabels;
}

/** `/musteriler/` sayfası — idenfit.com'un gerçek "Müşteri Başarı
 * Hikayeleri" sayfasından çıkarıldı (bkz. CLAUDE.md). */
export interface CustomerStoriesLabels {
  heroTitle: string;
  heroDescription: string;
  ctaLabel: string;
  videoComingSoon: string;
  /** Video tıkla-oynat butonunun erişilebilir etiketi (bkz.
   * YoutubeClickToPlay.tsx, 2026-07-27). */
  videoPlayLabel: string;
  femas: CustomerStoryLabels;
  civil: CustomerStoryLabels;
  civilSecondary: CustomerStorySecondaryLabels;
  yatsan: CustomerStoryLabels;
  dogSer: CustomerStoryLabels;
  tugbaKuruyemis: CustomerStoryLabels;
}

/** Ana sayfanın hero-altı bölümleri (bkz. `docs/homepage-sections-report.md`)
 * — GRUP 1: müşteri logo şeridi, 4'lü özellik kartı grid'i, sertifika rozet
 * şeridi, 2 ayraç başlığı. Görsel URL'leri/logo isimleri gibi dile bağlı
 * olmayan yapısal veri `src/data/homeContent.ts`'de tutulur. */
export interface HomeLogoStripLabels {
  /** "1000'den fazla mutlu müşteri..." — kaynak sitede bu şeridin tek metni. */
  caption: string;
}

export interface HomeDividerLabels {
  /** Logo şeridinden sonraki ayraç başlığı. */
  afterLogos: string;
  /** Özellik grid'inden sonraki ayraç başlığı. */
  afterFeatures: string;
}

export interface HomeFeatureCardLabels {
  title: string;
  text: string;
}

export interface HomeFeatureGridLabels {
  title: string;
  intro: string;
  timeLeave: HomeFeatureCardLabels;
  performance: HomeFeatureCardLabels;
  employeeExperience: HomeFeatureCardLabels;
  analytics: HomeFeatureCardLabels;
}

export interface HomeCertificationsLabels {
  /** Başlık kaynak sitede 2 ayrı heading widget'ı olarak iki satıra bölünmüş. */
  titleLine1: string;
  titleLine2: string;
  text: string;
}

/** GRUP 2 — video bölümü ("Neden idenfit?"). */
export interface HomeVideoLabels {
  title: string;
  ctaText: string;
  /** "Links without descriptive text" turu (2026-08-19) — `ctaText`
   * ("Daha Fazla"/"Learn More" vb.) tek başına jenerik, bu yüzden görünür
   * metin DEĞİŞTİRİLMEDEN ayrı bir `aria-label` eklendi (bkz.
   * `VideoSection.astro`). */
  ctaAriaLabel: string;
  /** `<iframe title>` — erişilebilirlik için, kaynakta karşılığı yok. */
  videoTitle: string;
  /** Tıkla-oynat play butonunun aria-label'ı (2026-07-28 — kaynakta bu
   * video da `/musteriler/`'in video kartları gibi Elementor'un
   * "tıkla-oynat" widget'ı: `show_image_overlay:"yes"`, autoplay YOK,
   * bkz. `YoutubeClickToPlay.tsx`). */
  playLabel: string;
}

/** GRUP 2 — "Verimliliği Ölçen 5 Soru". */
export interface HomeEfficiencyLabels {
  title: string;
  text: string;
  /** Kaynakta `alt` boştu (TR/IT'de yanlışlıkla "efficiency tr") — burada
   * gerçek, betimleyici bir alt metni yazıldı. */
  imageAlt: string;
}

/** GRUP 2 — "Kullanıcı Dostu Panel" (2026-08-20: 2. lead-capture formu
 * kullanıcı isteğiyle kaldırıldı, yalnızca görsel + açıklama/checklist
 * kaldı). */
export interface HomePanelLabels {
  title: string;
  text: string;
  /** İkon listesi (3 öğe — Anlık Bilgiler/Hatırlatmalar/Gerçek Zamanlı Monitör). */
  features: [string, string, string];
  imageAlt: string;
}

/** GRUP 3 — Suprema donanım-partner vurgusu. Link artık `/donanim/`'e
 * gidiyor (kaynaktaki `/suprema/` sayfası hâlâ içeriksiz — bkz. CLAUDE.md
 * "WP media export" notları — ama Donanım sayfası GERÇEKTEN kuruldu ve
 * Suprema'yı zaten "Onaylı Markalar" bölümünde marka olarak listeliyor). */
export interface HomeSupremaLabels {
  title: string;
  text: string;
  /** "Hardware partner" etiketi. */
  partnerLabel: string;
}

/** Tek bir testimonial'ın çevrilen metni (isim/fotoğraf gibi dile bağlı
 * olmayan alanlar `src/data/homeContent.ts`'de — `TESTIMONIAL_PEOPLE`). */
export interface HomeTestimonialItemLabels {
  quote: string;
  /** "Zsa Zsa Zsu - People & Culture Manager" gibi şirket+unvan — dile göre
   * değişebiliyor (ör. Emre Özcan'ın unvanı EN'de farklı çevrildi). */
  jobTitle: string;
}

/** GRUP 3 — testimonial carousel (`/musteriler/`'deki 5 hikayeden farklı
 * 2 yeni tanık, bkz. docs/homepage-sections-report.md §11). */
export interface HomeTestimonialsLabels {
  title: string;
  intro: string;
  prevLabel: string;
  nextLabel: string;
  ismailUnal: HomeTestimonialItemLabels;
  emreOzcan: HomeTestimonialItemLabels;
}

/** Ana sayfa SSS (FAQ) bölümü (2026-08-12) — bkz. `HomeFaqSection.astro`.
 * Bölüm başlığı YENİDEN bir çeviri gerektirmiyor, `footer.links.general.faq`
 * ("Sıkça Sorulan Sorular") doğrudan yeniden kullanılıyor — burada yalnızca
 * bu bölüme ÖZEL, gerçekten yeni olan tek metin (/sss/ sayfasına giden
 * link). */
export interface HomeFaqLabels {
  viewAllLink: string;
}

export interface HomeLabels {
  logoStrip: HomeLogoStripLabels;
  dividers: HomeDividerLabels;
  featureGrid: HomeFeatureGridLabels;
  certifications: HomeCertificationsLabels;
  video: HomeVideoLabels;
  efficiency: HomeEfficiencyLabels;
  panel: HomePanelLabels;
  suprema: HomeSupremaLabels;
  testimonials: HomeTestimonialsLabels;
  faq: HomeFaqLabels;
}

/** 404 sayfası (`src/pages/404.astro` + `en/nl/it/404.astro`) — bkz.
 * `NotFoundPage.astro`. Popüler sayfa linklerinin METİNLERİ burada
 * DEĞİL, mevcut `footer.links.*` anahtarları yeniden kullanılıyor (Blog/
 * İletişim/Fiyatlar/SSS) — içerik tekrarı yerine tek kaynak. */
export interface NotFoundLabels {
  /** `buildIdenfitTitle()`'a geçilen ham sayfa adı (`<title>` DEĞİL). */
  pageTitle: string;
  metaDescription: string;
  /** "404" rakamının altındaki başlık. */
  heading: string;
  description: string;
  backHomeButton: string;
  popularLinksTitle: string;
}

export interface Translations {
  common: CommonLabels;
  nav: NavLabels;
  cta: CtaLabels;
  hero: HeroLabels;
  footer: FooterLabels;
  mega: MegaLabels;
  headerUi: HeaderUiLabels;
  customerStories: CustomerStoriesLabels;
  home: HomeLabels;
  faqPage: FaqPageLabels;
  notFound: NotFoundLabels;
  sectorPage: SectorPageLabels;
}

/** Sektör sayfası (`[sectorSlug].astro`, 12 sektör × 4 dil) — bkz.
 * `SectorPage.astro`. "Few H2 subheadings" SEO bulgusu (2026-08-17):
 * modül vurgu blokları (`SectorFeatureCard` grid'i, kartlar zaten h3)
 * hiç sarmalayıcı h2 taşımıyordu — bu tek anahtar o boşluğu dolduruyor. */
export interface SectorPageLabels {
  modulesHeading: string;
}

/** SSS sayfası (`/sss/`, `/en/faq/`, `/it/faq/`) — bkz. `FaqPage.astro`.
 * Başlık için ayrı bir anahtar YOK, `footer.links.general.faq` yeniden
 * kullanılıyor ("Sıkça Sorulan Sorular" zaten orada gerçek çeviriyle var). */
export interface FaqPageLabels {
  /** "PDF İNDİR" butonu — kaynakta IT bunu "PDF DOWNLOAD" (EN kopyası)
   * olarak gösteriyordu, burada gerçek İtalyanca çeviri kullanıldı. */
  pdfLabel: string;
  /** Meta description (2026-08-10, meta description uzunluk denetimi) —
   * önceden sayfa BAŞLIĞI description olarak kullanılıyordu ("Sıkça
   * Sorulan Sorular", 21 karakter — bkz. CLAUDE.md). Sayfanın gerçek 6
   * kategorisinden (Genel/Ödeme/Kurulum/Müşteri Deneyimi/Veri Güvenliği/
   * Üyelik) türetildi. */
  metaDescription: string;
}
