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
};

function resolvePlan(plan: PricingPlan, locale: Locale): PricingPlan {
  const cta = resolveCtaUrl(plan.ctaUrl, locale);
  return { ...plan, ctaUrl: cta.url, ctaExternal: cta.newTab };
}

export function getPricingContent(locale: Locale): PricingContent | undefined {
  const entry = DATA.locales[locale];
  if (!entry) return undefined;
  const c = entry.content;
  return {
    ...c,
    featuresTitle: FEATURES_TITLE_FIX[locale] ?? c.featuresTitle,
    micro: resolvePlan(c.micro, locale),
    sme: resolvePlan(c.sme, locale),
    pro: resolvePlan(c.pro, locale),
    supremaBadgeText: SUPREMA_BADGE_TEXT[locale],
  };
}

export function getPricingSlug(locale: Locale): string | undefined {
  return DATA.locales[locale]?.slug;
}

export function getPricingLocaleUrls(): Partial<Record<Locale, string>> {
  const result: Partial<Record<Locale, string>> = {};
  for (const [locale, entry] of Object.entries(DATA.locales) as [Locale, { slug: string }][]) {
    result[locale] = getRelativeLocaleUrl(locale, entry.slug);
  }
  return result;
}
