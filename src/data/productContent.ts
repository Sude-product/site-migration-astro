// `reference/wordpress-export/products.json`'daki ürün/modül sayfası
// içeriğini (WP'nin standart `page` post type'ından, `scripts/extract-products.mjs`
// ile çıkarıldı — sektörlerin aksine ayrı bir CPT DEĞİL, bkz. CLAUDE.md
// "Ürün/modül sayfaları için CPT kontrolü") tipli bir forma sokan veri
// katmanı. `sectorContent.ts` ile aynı desen: `link` alanı otoriter (WP
// `slug` alanı değil), CTA URL'leri kendi route şemamıza göre yeniden
// çözülür, LanguageSwitcher için per-sayfa gerçek locale URL'leri üretilir.
import { getRelativeLocaleUrl } from 'astro:i18n';
import productsExport from '../../reference/wordpress-export/products.json';
import { PRODUCT_OVERRIDES } from './productTranslationOverrides';
import type { Locale } from './nav';

export interface ProductImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProductBlock {
  title: string;
  /** Ham WP zengin metni (HTML) olabilir — bkz. `cleanRichText()`. */
  text: string;
  ctaText: string;
  ctaUrl: string;
  image: ProductImage | null;
  /** Opsiyonel anchor id (`<section id="...">`) — çoğu ürün sayfasında
   * kullanılmaz, ama Donanım sayfası gibi tek-sayfa+çoklu-blok yapılarda
   * mega-menü/dış linklerin `#rfid` gibi belirli bir bloğa atlaması için
   * gerekir (bkz. `hardwareContent.ts`). */
  id?: string;
}

export interface ProductFaqItem {
  question: string;
  answer: string;
}

export interface ProductContent {
  hero: ProductBlock;
  sections: ProductBlock[];
  faq: ProductFaqItem[];
}

interface ProductLocaleEntryRaw {
  id: number;
  slug: string;
  link: string;
  title: string;
  modified: string;
  hero: ProductBlock;
  sections: ProductBlock[];
  faq: ProductFaqItem[];
}

interface ProductGroupRaw {
  trSlug: string;
  locales: Partial<Record<Locale, ProductLocaleEntryRaw>>;
}

interface ProductsExportRaw {
  products: ProductGroupRaw[];
}

const DATA = productsExport as unknown as ProductsExportRaw;

const LOCALE_CODES: readonly Locale[] = ['tr', 'en', 'nl', 'it'];

function bareSlugFromUrl(url: string): string {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length && LOCALE_CODES.includes(parts[0] as Locale)) parts.shift();
    return parts.join('/');
  } catch {
    return url;
  }
}

const SLUG_INDEX: Record<string, Partial<Record<Locale, string>>> = {};
for (const group of DATA.products) {
  const perLocale: Partial<Record<Locale, string>> = {};
  for (const [locale, entry] of Object.entries(group.locales) as [Locale, ProductLocaleEntryRaw][]) {
    perLocale[locale] = bareSlugFromUrl(entry.link);
  }
  SLUG_INDEX[group.trSlug] = perLocale;
}

// Kaynak sitede hiç var olmayan ama bizim sitemizde çeviriyle YENİDEN
// oluşturulan locale'ler için slug (bkz. İşe Alım NL — kaynakta 401
// rest_forbidden, `productTranslationOverrides.ts`'te TR'den çevrilerek
// sıfırdan oluşturuldu). `SLUG_INDEX` bunu ham `products.json`'dan
// türetemez çünkü kaynakta hiç veri yok — burada elle eklenir.
const SYNTHETIC_SLUGS: Record<string, Partial<Record<Locale, string>>> = {
  'ise-alim-modulu': { nl: 'wervingsmodule' },
};
for (const [trSlug, locales] of Object.entries(SYNTHETIC_SLUGS)) {
  SLUG_INDEX[trSlug] = { ...SLUG_INDEX[trSlug], ...locales };
}

// bkz. sectorContent.ts'teki aynı not — "Online Sunum Talebi" hedefinin
// gerçek WP slug'ı dile göre değişiyor, bizim sitemiz tek canonical slug
// kullanıyor.
const REQUEST_DEMO_SOURCE_SLUGS = new Set([
  'online-sunum-talep-et',
  'request-online-presentation',
  'richiedi-presentazione-online',
]);

export interface ResolvedCtaUrl {
  url: string;
  external: boolean;
  /** true = bu link YENİ SEKMEDE açılmalı (`target="_blank"`). `external`
   * ile AYNI ŞEY DEĞİL: `app.idenfit.com` (kayıt/uygulama girişi) dış link
   * sayılır (`external:true`, URL dönüştürülmez) ama kaynak idenfit.com'da
   * AYNI SEKMEDE devam eder — bu yüzden `newTab:false`. workmana.com/HRTech
   * Alliance gibi tamamen ayrı marka/sitelere giden GERÇEK dış linkler
   * `newTab:true` kalır. */
  newTab: boolean;
}

/** Bizim sitemizin kendi hostname'i — CTA URL'leri yalnızca bu domain
 * için site-içi slug'a çözülür. `app.idenfit.com` (kayıt/uygulama girişi),
 * `my.idenfit.com` (müşteri portalı) gibi alt alan adları veya tamamen
 * farklı domainler bizim sitemizde bir karşılığı olmayan GERÇEK dış
 * linklerdir — query param'ları dahil olduğu gibi bırakılır (bkz.
 * Fiyatlar sayfasının Mikro/KOBİ CTA'ları, `app.idenfit.com/register/...`). */
const OWN_HOSTNAME = 'idenfit.com';

/** `app.idenfit.com` kendi ekosistemimizin bir parçası (kayıt/uygulama
 * girişi) — dış link sayılır ama kaynak sitedeki gerçek davranışla birebir
 * AYNI SEKMEDE açılır, `target="_blank"` almaz (bkz. site denetim raporu
 * sonrası kullanıcı düzeltmesi, 2026-07-23). */
const SAME_TAB_EXTERNAL_HOSTNAMES = new Set(['app.idenfit.com']);

export function resolveCtaUrl(rawUrl: string, locale: Locale): ResolvedCtaUrl {
  if (!rawUrl) return { url: '', external: false, newTab: false };
  try {
    const { hostname } = new URL(rawUrl);
    if (hostname !== OWN_HOSTNAME) {
      return { url: rawUrl, external: true, newTab: !SAME_TAB_EXTERNAL_HOSTNAMES.has(hostname) };
    }
  } catch {
    // relative bir şey verilmiş olabilir (beklenmez, kaynak hep absolute) — olduğu gibi bırak
    return { url: rawUrl, external: false, newTab: false };
  }
  const bare = bareSlugFromUrl(rawUrl);
  if (REQUEST_DEMO_SOURCE_SLUGS.has(bare)) {
    return { url: getRelativeLocaleUrl(locale, 'online-sunum-talebi'), external: false, newTab: false };
  }
  // Diğer ürün/modül sayfalarına link (henüz nadir görüldü) — kendi ürün
  // slug indeksimizde varsa doğru locale'e çözülür, yoksa kaynaktaki
  // slug aynen taşınır (bkz. sectorContent.ts'teki aynı ilke).
  const matchedTrSlug = Object.keys(SLUG_INDEX).find((trSlug) =>
    Object.values(SLUG_INDEX[trSlug]).includes(bare),
  );
  if (matchedTrSlug) {
    const correctSlug = SLUG_INDEX[matchedTrSlug]?.[locale] ?? bare;
    return { url: getRelativeLocaleUrl(locale, correctSlug), external: false, newTab: false };
  }
  return { url: getRelativeLocaleUrl(locale, bare), external: false, newTab: false };
}

export function localizeCtaUrl(rawUrl: string, locale: Locale): string {
  return resolveCtaUrl(rawUrl, locale).url;
}

/** WP zengin metin alanlarındaki `class`/`style` niteliklerini temizler —
 * kaynak Bootstrap benzeri sınıflar (`text-sm`, `col-12` vb.) bizim
 * Tailwind sistemimizde anlamsız/çakışmaya açık; düz semantik HTML
 * (p/strong/ul/li) bırakılıp kendi stilimizle sarmalanıyor. */
export function cleanRichText(html: string): string {
  return html.replace(/\s(class|style)="[^"]*"/g, '');
}

/** Başlıklar için düz metin — bazı ACF başlık alanları ham HTML etiketi
 * (ör. `<b>...</b>`) içeriyor (bkz. `section_10_title`, `<title>` etiketi
 * ve `og:title` gibi yerlerde HTML kaçamaz, orada bu kullanılır). Görünen
 * `<h1>`/`<h2>` başlıkları için `cleanRichText` + `set:html` tercih edilir
 * (biçimlendirme korunur), bu yalnızca düz metin GEREKEN yerler için. */
export function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim();
}

export function getProductSlug(trSlug: string, locale: Locale): string | undefined {
  return SLUG_INDEX[trSlug]?.[locale];
}

/** Sayfanın GERÇEK WP `modified` tarihi ("No visible content dates" GEO
 * bulgusu, 2026-08-17 — bkz. CLAUDE.md) — `SYNTHETIC_SLUGS`/override ile
 * ÜRETİLEN sayfalarda (kaynakta hiç yok) `undefined` döner, UYDURULMAZ. */
export function getProductModifiedDate(trSlug: string, locale: Locale): Date | undefined {
  const raw = DATA.products.find((g) => g.trSlug === trSlug)?.locales[locale]?.modified;
  return raw ? new Date(raw) : undefined;
}

export function getProductLocaleUrls(trSlug: string): Partial<Record<Locale, string>> {
  const perLocale = SLUG_INDEX[trSlug];
  if (!perLocale) return {};
  const result: Partial<Record<Locale, string>> = {};
  for (const [locale, slug] of Object.entries(perLocale) as [Locale, string][]) {
    result[locale] = getRelativeLocaleUrl(locale, slug);
  }
  return result;
}

/**
 * Ham `products.json` verisini + varsa `productTranslationOverrides.ts`'teki
 * gerçek çeviriyi birleştirir. Öncelik: `override.hero`/`override.sections`
 * VERİLMİŞSE ham veriyi TAMAMEN ez (IT'nin EN kopyası olduğu sayfalar gibi);
 * `override.appendSections` VERİLMİŞSE ham verideki bloklara EKLE (yalnızca
 * eksik bir blok tamamlanıyorsa — bkz. İzin Yönetimi'nin EN/NL'deki 6.
 * bloğu). Ne ham veri ne override varsa (bir locale gerçekten hiç yoksa
 * VE çeviri de eklenmemişse) `undefined` döner.
 */
export function getProductContent(trSlug: string, locale: Locale): ProductContent | undefined {
  const entry = DATA.products.find((g) => g.trSlug === trSlug)?.locales[locale];
  const override = PRODUCT_OVERRIDES[trSlug]?.[locale];
  if (!entry && !override) return undefined;

  const resolveBlock = (b: ProductBlock): ProductBlock => ({
    title: cleanRichText(b.title),
    text: cleanRichText(b.text),
    ctaText: b.ctaText,
    ctaUrl: b.ctaUrl ? localizeCtaUrl(b.ctaUrl, locale) : '',
    image: b.image,
  });

  const heroRaw = override?.hero ?? entry?.hero;
  if (!heroRaw) return undefined; // savunmacı — normalde olmamalı

  let sectionsRaw = override?.sections ?? entry?.sections ?? [];
  if (override?.appendSections) sectionsRaw = [...sectionsRaw, ...override.appendSections];

  const faqRaw = override?.faq ?? entry?.faq ?? [];
  return {
    hero: resolveBlock(heroRaw),
    sections: sectionsRaw.map(resolveBlock),
    faq: faqRaw.map((f) => ({ question: f.question, answer: cleanRichText(f.answer) })),
  };
}

export function getProductPageTitle(trSlug: string, locale: Locale): string {
  const entry = DATA.products.find((g) => g.trSlug === trSlug)?.locales[locale];
  const override = PRODUCT_OVERRIDES[trSlug]?.[locale];
  return stripTags(override?.hero?.title || entry?.hero.title || entry?.title || trSlug);
}
