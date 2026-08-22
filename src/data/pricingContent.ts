// Fiyatlar/Pricing sayfası (3 katmanlı Mikro/KOBİ/Pro fiyat tablosu) veri
// katmanı. Kaynak: `reference/wordpress-export/pricing.json`
// (`scripts/extract-pricing.mjs` ile yerel `pages.json`'dan, network YOK).
// `link` alanı otoriter (WP `slug` değil) — projedeki diğer tüm veri
// katmanlarıyla aynı ilke. CTA URL'leri `productContent.ts`'in
// `resolveCtaUrl()`'ünden geçiyor (Pro planının CTA'sı gerçekte "Online
// Sunum Talebi" sayfasına gidiyor — kod tekrarı yok, aynı sentinel deseni;
// Mikro/KOBİ'nin CTA'sı `app.idenfit.com`'a giden GERÇEK bir dış link,
// `resolveCtaUrl()` bunu tanıyıp dokunmadan bırakıyor). Kaynak idenfit.com'da
// `app.idenfit.com` linkleri AYNI SEKMEDE açılıyor (yeni sekme YOK) — bu
// yüzden `ctaExternal` artık `cta.external` değil `cta.newTab`'dan geliyor
// (bkz. `resolveCtaUrl()`'ün `newTab` alanı, 2026-07-23 düzeltmesi).
import { getRelativeLocaleUrl } from 'astro:i18n';
import pricingExport from '../../reference/wordpress-export/pricing.json';
import { resolveCtaUrl } from './productContent';
import type { Locale } from './nav';

export interface PricingFeatureRow {
  akademi: string;
  chatbot: string;
  ozelGelistirme: string;
  raporlama: string;
  destek: string;
  odeme: string;
  egitim: string;
  topluAktarim: string;
}
export interface PricingAddonRow {
  dijitalImza: string;
  okrPerformans: string;
  aiIseAlim: string;
  bordro: string;
  lms: string;
  yanHaklar: string;
}
export interface PricingPlan {
  planTitle: string;
  employeeRange: string;
  modules: string[];
  modulesMore?: string[];
  showMoreText?: string;
  showLessText?: string;
  price: string;
  priceSuffix: string;
  ctaText: string;
  ctaUrl: string;
  ctaExternal?: boolean;
  getQuoteText?: string;
  features: PricingFeatureRow;
  addons: PricingAddonRow;
}
export interface PricingContent {
  pageTitle: string;
  featuresTitle: string;
  addonsTitle: string;
  packagesTitle: string;
  featureNames: string[];
  addonNames: string[];
  micro: PricingPlan;
  sme: PricingPlan;
  pro: PricingPlan;
  /** Pro kartının üstünde beliren Suprema donanım rozetinin metni (bkz.
   * `SUPREMA_BADGE_TEXT`). */
  supremaBadgeText: string;
  /** Mobil/tablet (`lg` altı) — her kartın KENDİ Özellikler/Eklentiler
   * listesini açıp kapatan `<details>` toggle metni (bkz.
   * `MOBILE_DETAILS_TOGGLE` + `PricingPage.astro`'nun kart-içi accordion'u,
   * 2026-08-22). Opsiyonel — `getPricingContent()` HER locale için bunu
   * `MOBILE_DETAILS_TOGGLE`'dan koşulsuz doldurur, `PRICING_AZ_OVERRIDE`
   * gibi elle yazılan literal'lerin bu alanı taşıması GEREKMEZ. */
  mobileDetailsMoreText?: string;
  mobileDetailsLessText?: string;
}

interface RawGroup {
  trSlug: string;
  locales: Partial<Record<Locale, { id: number; slug: string; title: string; modified: string; content: PricingContent }>>;
}
const DATA = pricingExport as unknown as RawGroup;

// Kaynakta EN/NL/IT'nin `features_title` alanı yanlışlıkla `packages_title`
// ile AYNI metni taşıyor ("Packages"/"Pakketten"/"Pacchetti" — TR'nin kendi
// içinde "Özellikler" (Features) ile "Paketler" (Packages) doğru şekilde
// AYRI iken, diğer 3 dilde ikisi de "Packages" ailesinden). Gerçek bir
// kaynak veri hatası (kopya değil, yanlış alan doldurulmuş) — düzeltildi.
const FEATURES_TITLE_FIX: Partial<Record<Locale, string>> = {
  en: 'Features',
  nl: 'Kenmerken',
  it: 'Caratteristiche',
};

// Pro kartının üstünde beliren Suprema donanım rozetinin metni
// (`.suprema-text`, `pricing.css`) — kaynak template'in ACF/REST alanı
// DEĞİL, ham PHP şablonuna gömülü sabit metin olduğu için `pricing.json`
// çıkarımında hiç yakalanmamıştı (2026-08-04'te element-ID doğrulamalı
// canlı sayfa okunarak bulundu — TR/EN/IT/NL'nin hepsi GERÇEK, birbirinin
// çevirisi, farklı uzunlukta: TR "DONANIMLAR İLE TAM ENTEGRASYON" diğer 3
// dilin kısa "Fully Integrated" tarzından belirgin uzun).
const SUPREMA_BADGE_TEXT: Record<Locale, string> = {
  tr: 'DONANIMLAR İLE TAM ENTEGRASYON',
  en: 'Fully Integrated',
  nl: 'Volledig Geïntegreerd',
  it: 'Completamente Integrato',
  az: 'AVADANLIQLARLA TAM İNTEQRASİYA',
};

// Mobil kart-içi "Özellikler/Eklentiler" accordion'unun aç/kapa metni
// (2026-08-22, kullanıcının paylaştığı canlı site ekran görüntüsüne göre —
// kaynağın `.mobile-only` akordeon HTML'i "Daha Fazla"/"Daha Az" TR metnini
// kullanıyor). Bu metin `pricing.json`'da HİÇ yok — kaynağın mobil-only
// bloğu ayrı bir PHP template parçası, standart extraction'a hiç
// yakalanmadı (`SUPREMA_BADGE_TEXT` ile AYNI durum). EN/NL/IT/AZ gerçek/
// profesyonel çeviri (KARAR 1) — kısa, standart UI ifadeleri.
const MOBILE_DETAILS_TOGGLE: Record<Locale, { more: string; less: string }> = {
  tr: { more: 'Daha Fazla', less: 'Daha Az' },
  en: { more: 'Show More', less: 'Show Less' },
  nl: { more: 'Toon Meer', less: 'Toon Minder' },
  it: { more: 'Mostra di più', less: 'Mostra meno' },
  az: { more: 'Daha Çox', less: 'Daha Az' },
};

// Fiyat güncellemesi (2026-08-18, kullanıcı talebi) — ham `pricing.json`
// `extract-pricing.mjs` ile `pages.json`'dan (dondurulmuş bir WP
// anlık görüntüsü) yeniden üretilebildiği için fiyat KALICI olarak
// buraya, `SUPREMA_BADGE_TEXT`/`FEATURES_TITLE_FIX` ile AYNI override
// ilkesiyle eklendi — ham JSON'a elle dokunulmadı (script yeniden
// çalıştırılırsa bu override hayatta kalır, ham JSON'daki eski fiyat
// silinip gitse bile).
// KOBİ (sme): TR 4.999→9.999 ₺, EN/NL/IT 149→199 € (`priceSuffix` aynı
// kalıyor, yalnızca sayı değişti).
const SME_PRICE_OVERRIDE: Record<Locale, string> = {
  tr: '9.999',
  en: '199',
  nl: '199',
  it: '199',
  az: '199',
};

// Pro paketi artık sabit bir fiyat GÖSTERMİYOR, "Teklif Al" metnine
// çevrildi (kaynakta zaten var olan ama `PricingPage.astro`'nun hiçbir
// yerinde render edilmeyen `getQuoteText` alanı — o alan aslında
// kaynağın "fake-select" dinamik fiyat hesaplayıcısının [bkz.
// PricingPage.astro dosya başı yorumu, kapsam dışı bırakıldı] belirli
// çalışan sayılarında gösterdiği metindi. Kullanıcı bu metni artık
// DAİMİ/koşulsuz istediği için doğrudan `price` alanına yazıldı, ayrı
// bir bileşen değişikliği gerekmedi). `priceSuffix` de temizlendi —
// aksi halde "Teklif Al ₺/aylık'dan başlayan fiyatlar" gibi anlamsız
// bir birleşim oluşurdu.
const PRO_QUOTE_TEXT: Record<Locale, string> = {
  tr: 'Teklif Al',
  en: 'Get a Quote',
  nl: 'Offerte Aanvragen',
  it: 'Richiedi un Preventivo',
  az: 'Təklif Alın',
};

// az (Azerbaycan dili, 2026-08-21) — kaynakta hiç az verisi yok
// (`pricing.json`'da yalnızca tr/en/nl/it), TR kaynaktan tam gerçek
// çeviri (KARAR 1). Addon fiyat detayı (TR'nin "Opsiyonel (5 ₺)") EN/NL/IT'nin
// hiçbirinde YOK (hepsi yalnızca "Optional"/"Optioneel"/"Opzionale") —
// aynı ilke az için de uygulandı, TL fiyatı EUR'a keyfi çevrilmedi.
const PRICING_AZ_OVERRIDE: PricingContent = {
  pageTitle: 'Ən dəyərli aktivinizi insan resurslarını <br><b>səmərəli və bütöv şəkildə idarə edin!</b>',
  featuresTitle: 'Xüsusiyyətlər',
  addonsTitle: 'Əlavələr',
  packagesTitle: 'Paketlər',
  featureNames: [
    'idenfit Akademiya',
    'HR AI Chatbot',
    'Xüsusi İnkişaf',
    'Hesabatlıq',
    'Telefon/Onlayn Dəstək',
    'Onlayn Ödəniş',
    'Tətbiq Təlimi',
    'Toplu Köçürmə',
  ],
  addonNames: ['Rəqəmsal İmza', 'OKR & Performans', 'AI İşə Qəbul', 'Əmək Haqqı', 'LMS', 'Əlavə Haqlar'],
  micro: {
    planTitle: 'Mikro',
    employeeRange: '<b>1-25</b> İşçi',
    modules: ['Rəqəmsal Qeydiyyat (Mikro)', 'Vaxt (1 Növbə)', 'İcazə'],
    price: 'PULSUZ',
    priceSuffix: '',
    ctaText: 'İndi Başlayın',
    ctaUrl: 'https://app.idenfit.com/register/micro/?lang=en',
    features: {
      akademi: 'x',
      chatbot: 'x',
      ozelGelistirme: 'x',
      raporlama: '5',
      destek: 'Pulsuz',
      odeme: 'Self-Onboarding',
      egitim: 'Xeyr',
      topluAktarim: 'x',
    },
    addons: { dijitalImza: 'x', okrPerformans: 'x', aiIseAlim: 'x', bordro: 'x', lms: 'x', yanHaklar: 'x' },
  },
  sme: {
    planTitle: 'KOB',
    employeeRange: '<b>1-100</b> İşçi',
    modules: ['Rəqəmsal Qeydiyyat (Əsas)', 'İcazə', 'Avans', 'Əmlak', 'Sənəd', 'Əmək Haqqına Baxış', 'Xərc'],
    price: '199',
    priceSuffix: '€/ayda',
    ctaText: 'Satın Alın',
    ctaUrl: 'https://app.idenfit.com/register/sme/?lang=en',
    features: {
      akademi: 'Video, Pdf',
      chatbot: 'Limitli',
      ozelGelistirme: 'x',
      raporlama: '20',
      destek: 'Opsional',
      odeme: 'Bəli',
      egitim: 'Onlayn (120dəq)',
      topluAktarim: 'Bəli',
    },
    addons: {
      dijitalImza: 'Opsional',
      okrPerformans: 'Opsional',
      aiIseAlim: 'Opsional',
      bordro: 'Opsional',
      lms: 'Opsional',
      yanHaklar: 'Opsional',
    },
  },
  pro: {
    planTitle: 'Pro',
    employeeRange: '',
    modules: ['Rəqəmsal Qeydiyyat (Pro)', 'Vaxt', 'İcazə', 'Davamiyyət', 'Məkan İzləmə', 'Sənədlər'],
    modulesMore: [
      'Məlumat Analizi',
      'Bildiriş Mərkəzi',
      'Sənədlər',
      'Avanslar',
      'Xərclər',
      'Xərc İdarəçiliyi',
      'Sorğu',
      'Geri Bildirim',
      'Rəy & Təklif',
      'Tədbirlər',
      'Sağlamlıq',
      'Mesajlar',
      'Qeydlər',
      'Onboarding-Offboarding',
      'Əmək Haqqı',
      'Servislər',
      'Təlimlər',
      'Səyahət',
      'Aktivlər və Əmlak',
      'Vasitələr',
      'Yemək',
      'Qonaqlar',
      'Tapşırıqlar',
      'Avadanlıq',
    ],
    showMoreText: 'Bütün Modulları Gör',
    showLessText: 'Hamısını Gizlət',
    price: 'Təklif Alın',
    priceSuffix: '',
    ctaText: 'Müraciət Et',
    ctaUrl: 'https://idenfit.com/tr/online-sunum-talep-et/',
    getQuoteText: 'Sualınız',
    features: {
      akademi: 'Video, Pdf',
      chatbot: 'Full',
      ozelGelistirme: 'Opsional',
      raporlama: '50+',
      destek: 'Opsional',
      odeme: 'Bizimlə Əlaqə Saxlayın',
      egitim: 'Onlayn (300dəq)',
      topluAktarim: 'Bəli',
    },
    addons: {
      dijitalImza: 'Opsional',
      okrPerformans: 'Opsional',
      aiIseAlim: 'Opsional',
      bordro: 'Opsional',
      lms: 'Opsional',
      yanHaklar: 'Opsional',
    },
  },
  supremaBadgeText: SUPREMA_BADGE_TEXT.az,
};

function resolvePlan(plan: PricingPlan, locale: Locale): PricingPlan {
  const cta = resolveCtaUrl(plan.ctaUrl, locale);
  return { ...plan, ctaUrl: cta.url, ctaExternal: cta.newTab };
}

export function getPricingContent(locale: Locale): PricingContent | undefined {
  const c = locale === 'az' ? PRICING_AZ_OVERRIDE : DATA.locales[locale]?.content;
  if (!c) return undefined;
  const sme = resolvePlan(c.sme, locale);
  const pro = resolvePlan(c.pro, locale);
  return {
    ...c,
    featuresTitle: FEATURES_TITLE_FIX[locale] ?? c.featuresTitle,
    micro: resolvePlan(c.micro, locale),
    sme: { ...sme, price: SME_PRICE_OVERRIDE[locale] ?? sme.price },
    pro: { ...pro, price: PRO_QUOTE_TEXT[locale] ?? pro.price, priceSuffix: '' },
    supremaBadgeText: SUPREMA_BADGE_TEXT[locale],
    mobileDetailsMoreText: MOBILE_DETAILS_TOGGLE[locale].more,
    mobileDetailsLessText: MOBILE_DETAILS_TOGGLE[locale].less,
  };
}

// Meta description override — yalnızca TR (2026-08-10, meta description
// uzunluk denetimi). `PricingPage.astro` `content.pageTitle`'ı hem H1 hem
// description olarak kullanıyor; TR'nin pageTitle'ı ("En değerli
// varlığınız insan kaynaklarını verimli ve bütüncül yönetin!") 69 karakter
// — sınırın 1 altında. EN/NL/IT'nin kendi `pageTitle`'ları zaten 70+,
// DOKUNULMADI. `pageTitle`'IN KENDİSİ değiştirilmedi (H1 için hâlâ doğru) —
// yalnızca META ETİKETİ için sayfanın kendi gerçek paket isimlerinden
// (Mikro/KOBİ/Pro) genişletilmiş bir açıklama.
const PRICING_META_DESCRIPTION_TR =
  "En değerli varlığınız insan kaynaklarını verimli yönetin — idenfit'in Mikro, KOBİ ve Pro paketleriyle işletmenize uygun fiyatlandırmayı keşfedin.";
export function getPricingMetaDescription(locale: Locale): string | undefined {
  return locale === 'tr' ? PRICING_META_DESCRIPTION_TR : undefined;
}

// az (2026-08-21) — kaynakta az sayfası yok, gerçek Azerice slug elle
// atandı (SYNTHETIC_SLUGS ilkesiyle aynı, bkz. CLAUDE.md §Mimari).
const PRICING_AZ_SLUG = 'qiymetler';

export function getPricingSlug(locale: Locale): string | undefined {
  if (locale === 'az') return PRICING_AZ_SLUG;
  return DATA.locales[locale]?.slug;
}

export function getPricingLocaleUrls(): Partial<Record<Locale, string>> {
  const result: Partial<Record<Locale, string>> = {};
  for (const [locale, entry] of Object.entries(DATA.locales) as [Locale, { slug: string }][]) {
    result[locale] = getRelativeLocaleUrl(locale, entry.slug);
  }
  result.az = getRelativeLocaleUrl('az', PRICING_AZ_SLUG);
  return result;
}

/** Sayfanın GERÇEK WP `modified` tarihi ("No visible content dates" GEO
 * bulgusu, 2026-08-17 — bkz. CLAUDE.md, `productContent.ts`'teki AYNI
 * fonksiyonun yorumu). */
export function getPricingModifiedDate(locale: Locale): Date | undefined {
  const raw = DATA.locales[locale]?.modified;
  return raw ? new Date(raw) : undefined;
}
