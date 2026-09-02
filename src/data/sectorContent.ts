// `reference/wordpress-export/sectors.json`'daki gerçek sektör içeriğini
// (12 sektör × 4 dil, WP `sectors` custom post type'ından çekildi — bkz.
// `scripts/fetch-sectors.mjs` ve CLAUDE.md §"Sektör sayfaları — DÜZELTME")
// tipli, kullanılabilir bir forma sokan veri katmanı. Ham JSON burada
// import edilir; sayfalar/component'ler bu dosyanın export ettiği
// fonksiyonları kullanır, JSON'a doğrudan dokunmaz.
import { getRelativeLocaleUrl } from 'astro:i18n';
import sectorsExport from '../../reference/wordpress-export/sectors.json';
import { deepRelativizeWpUrls } from './relativizeWpUrls';
import { SECTOR_AZ_OVERRIDES, SECTOR_AZ_SLUGS } from './sectorTranslationOverrides';
import type { Locale } from './nav';

export interface SectorImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface SectorBlock {
  title: string;
  text: string;
  ctaText: string;
  ctaUrl: string;
  image: SectorImage | null;
}

export interface SectorContent {
  hero: SectorBlock;
  whyIdenfit: { title: string; text: string; image: SectorImage | null };
  features: SectorBlock[];
}

interface SectorLocaleEntryRaw {
  id: number;
  slug: string;
  link: string;
  title: string;
  modified: string;
  content: SectorContent;
}

interface SectorGroupRaw {
  trSlug: string;
  locales: Partial<Record<Locale, SectorLocaleEntryRaw>>;
}

interface SectorsExportRaw {
  sectors: SectorGroupRaw[];
}

// Açık nokta #45, yol (B) — bkz. `relativizeWpUrls.ts` yorumu.
const DATA = deepRelativizeWpUrls(sectorsExport as unknown as SectorsExportRaw);

const LOCALE_CODES: readonly Locale[] = ['tr', 'en', 'nl', 'it'];

/** Bir idenfit.com URL'sinden domain + (varsa) locale önekini soyutlar.
 *
 * BULUNAN GERÇEK VERİ HATASI (2026-07-22): `sanayi-otomotiv-ik-cozumleri`
 * sektörünün TR "İş Gücü Yönetimi" özellik bloğunda kaynak ACF alanı
 * `ctaUrl`'ün başında yanlışlıkla bir `#` karakteri var
 * (`#https://idenfit.com/tr/insan-kaynaklari-isgucu-yonetimi/`) — hub
 * tile'larındaki (`hubContent.ts`, offboarding) AYNI sınıf WP veri
 * hatasının bir tekrarı. `new URL()` bu string'i (protokol yok, `#` ile
 * başlıyor) parse edemeyip hatayı fırlatıyor, `catch` bloğu da ham
 * string'i OLDUĞU GİBİ (baştaki `#` dahil) döndürüyordu — sonuç,
 * `getRelativeLocaleUrl()`'e geçince `/#https://idenfit.com/...` gibi
 * kırık bir href'e dönüşüyordu. Baştaki `#` artık `new URL()`'e
 * geçmeden önce temizleniyor — kaynakta ne zaman aynı hata tekrar
 * çıkarsa (elle düzeltme beklemeden) otomatik olarak düzelir. */
function bareSlugFromUrl(url: string): string {
  const cleaned = url.replace(/^#+/, '');
  try {
    const { pathname } = new URL(cleaned);
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length && LOCALE_CODES.includes(parts[0] as Locale)) parts.shift();
    return parts.join('/');
  } catch {
    return cleaned;
  }
}

/** trSlug -> locale -> bu sitede kullanılacak GERÇEK route slug'ı (WP `link`'inden türetildi). */
const SLUG_INDEX: Record<string, Partial<Record<Locale, string>>> = {};
/** bareSlug (herhangi bir dilden) -> trSlug — çapraz-sektör linklerini güvenilir şekilde çözmek için. */
const SLUG_TO_TRSLUG: Record<string, string> = {};
for (const group of DATA.sectors) {
  const perLocale: Partial<Record<Locale, string>> = {};
  for (const [locale, entry] of Object.entries(group.locales) as [Locale, SectorLocaleEntryRaw][]) {
    const bare = bareSlugFromUrl(entry.link);
    perLocale[locale] = bare;
    SLUG_TO_TRSLUG[bare] = group.trSlug;
  }
  SLUG_INDEX[group.trSlug] = perLocale;
}
// az (2026-08-21) — kaynakta hiç az verisi yok, `SECTOR_AZ_SLUGS`'taki
// elle atanmış slug'lar aynı SLUG_INDEX/SLUG_TO_TRSLUG'a enjekte edilir
// (yukarıdaki döngüyle AYNI ilke, yalnızca kaynak WP değil elle veri).
for (const [trSlug, azSlug] of Object.entries(SECTOR_AZ_SLUGS)) {
  if (SLUG_INDEX[trSlug]) SLUG_INDEX[trSlug].az = azSlug;
  SLUG_TO_TRSLUG[azSlug] = trSlug;
}

// idenfit.com'da "Online Sunum Talebi" sayfasının 4 dildeki gerçek slug'ı
// birbirinden tamamen farklı (bkz. page-inventory.md) — ama BİZİM sitemiz
// tek bir canonical slug kullanıyor (`online-sunum-talebi`, bkz.
// `navigation.ts`'teki aynı not, Header.astro'nun CTA'sıyla tutarlı).
const REQUEST_DEMO_SOURCE_SLUGS = new Set([
  'online-sunum-talep-et', // tr
  'request-online-presentation', // en (bazı ACF alanlarında locale öneki bile eksik)
  'richiedi-presentazione-online', // it
]);

/**
 * ACF'ten gelen ham CTA URL'sini bu sitenin kendi route şemasına çevirir.
 * Üç durumu ayrı ele alır çünkü WP kaynağı locale başına TUTARSIZ slug'lar
 * kullanıyor (bkz. CLAUDE.md "Sektör sayfaları — DÜZELTME"):
 *   1) "Online Sunum Talebi" hedefi → her zaman bizim canonical slug'ımız.
 *   2) Başka bir sektöre link (ör. bir feature bloğunun linki) → o
 *      sektörün BİZDEKİ gerçek slug'ı üzerinden çözülür (raw metne
 *      güvenilmez — kaynakta bazı locale'lerin cross-link'i yanlış
 *      slug kullanıyor).
 *   3) Ürün/modül sayfası linki (feature blokları) → henüz bizim sitede
 *      inşa edilmedi (bkz. page-inventory.md Hafta 2-4); kaynaktaki
 *      per-locale slug olduğu gibi taşınır, modül sayfaları gerçekten
 *      kurulurken (hangi slug konvansiyonu kullanılacağına o zaman karar
 *      verilecek) yeniden gözden geçirilmesi gerekecek.
 */
function localizeCtaUrl(rawUrl: string, locale: Locale): string {
  const bare = bareSlugFromUrl(rawUrl);
  if (REQUEST_DEMO_SOURCE_SLUGS.has(bare)) {
    return getRelativeLocaleUrl(locale, 'online-sunum-talebi');
  }
  const matchedTrSlug = SLUG_TO_TRSLUG[bare];
  if (matchedTrSlug) {
    const correctSlug = SLUG_INDEX[matchedTrSlug]?.[locale] ?? bare;
    return getRelativeLocaleUrl(locale, correctSlug);
  }
  return getRelativeLocaleUrl(locale, bare);
}

/** Belirli bir sektörün belirli bir dildeki gerçek route slug'ı. */
export function getSectorSlug(trSlug: string, locale: Locale): string | undefined {
  return SLUG_INDEX[trSlug]?.[locale];
}

/** Sayfanın GERÇEK WP `modified` tarihi ("No visible content dates" GEO
 * bulgusu, 2026-08-17 — bkz. CLAUDE.md, `productContent.ts`'teki AYNI
 * fonksiyonun yorumu). */
export function getSectorModifiedDate(trSlug: string, locale: Locale): Date | undefined {
  const raw = DATA.sectors.find((g) => g.trSlug === trSlug)?.locales[locale]?.modified;
  return raw ? new Date(raw) : undefined;
}

/**
 * Bir sektörün 4 dildeki TAM (locale-prefix'li) URL'leri — LanguageSwitcher'a
 * geçirilir. Sektör sayfalarında her dilin slug'ı tamamen farklı olduğu
 * için (bkz. CLAUDE.md "Sektör sayfaları — GERÇEK İÇERİK UYGULANDI"),
 * Header.astro'nun genel "aynı slug + prefix" varsayımı burada YANLIŞ URL
 * üretir — bu fonksiyon doğru eşlemeyi sağlar.
 */
export function getSectorLocaleUrls(trSlug: string): Partial<Record<Locale, string>> {
  const perLocale = SLUG_INDEX[trSlug];
  if (!perLocale) return {};
  const result: Partial<Record<Locale, string>> = {};
  for (const [locale, slug] of Object.entries(perLocale) as [Locale, string][]) {
    result[locale] = getRelativeLocaleUrl(locale, slug);
  }
  return result;
}

/** getStaticPaths için: {trSlug, localeSlug} çiftleri. */
export function listSectorSlugs(locale: Locale): { trSlug: string; localeSlug: string }[] {
  return DATA.sectors
    .map((g) => ({ trSlug: g.trSlug, localeSlug: SLUG_INDEX[g.trSlug]?.[locale] }))
    .filter((x): x is { trSlug: string; localeSlug: string } => Boolean(x.localeSlug));
}

// Kaynak WP verisinde Gıda ve Hizmet sektörlerinin IT hero.title'ı
// (ACF `section_1_title`) gerçek sektör adı yerine WP'nin kendi editör
// placeholder metnini ("Contenuti della Pagina" = "Sayfa İçeriği") taşıyor
// — sayfa hiç düzenlenmeden yayınlanmış gibi duruyor (site denetim raporu
// madde 9, Turizm'in İngilizce kalmış H1'iyle aynı sınıf kaynak veri
// hatası, ama bu kez gerçek bir dil bile değil — düzeltilmesi gerekiyordu).
// Diğer 10 sektörün IT hero.title'ı kısa/gerçek İtalyanca sektör adı
// (ör. "Energia", "Retail", "Sicurezza") — TR kaynaktan ("Gıda"/"Hizmet")
// aynı üsluba uygun gerçek çeviri yazıldı.
const IT_HERO_TITLE_FIX: Partial<Record<string, string>> = {
  'gida-sektoru-ik-cozumleri': 'Alimentare e Bevande',
  'hizmet-sektoru-ik-cozumleri': 'Servizi',
};

/**
 * Bir sektörün belirli dildeki tam içeriğini, dahili CTA URL'lerini
 * OUR SITE'ın locale-prefix konvansiyonuna göre yeniden çözerek döner.
 * Görseller kasıtlı olarak dokunulmadan (gerçek idenfit.com hotlink)
 * bırakılır — bkz. CLAUDE.md, kullanıcı talimatı #6.
 */
export function getSectorContent(trSlug: string, locale: Locale) {
  // az (2026-08-21) — kaynakta hiç az verisi yok, TR kaynaktan gerçek
  // çeviri `SECTOR_AZ_OVERRIDES`'tan geliyor (KARAR 1). Aynı `resolveBlock()`
  // CTA çözümlemesinden geçiyor, ham WP entry'sine ihtiyaç duymuyor.
  if (locale === 'az') {
    const azContent = SECTOR_AZ_OVERRIDES[trSlug];
    if (!azContent) return undefined;
    const resolveBlock = (b: SectorBlock): SectorBlock => ({
      ...b,
      ctaUrl: b.ctaUrl ? localizeCtaUrl(b.ctaUrl, locale) : b.ctaUrl,
    });
    const hero = resolveBlock(azContent.hero);
    return {
      pageTitle: hero.title || trSlug,
      hero,
      whyIdenfit: azContent.whyIdenfit,
      features: azContent.features.map(resolveBlock),
    };
  }

  const entry = DATA.sectors.find((g) => g.trSlug === trSlug)?.locales[locale];
  if (!entry) return undefined;

  const c = entry.content;
  const resolveBlock = (b: SectorBlock): SectorBlock => ({
    ...b,
    ctaUrl: b.ctaUrl ? localizeCtaUrl(b.ctaUrl, locale) : b.ctaUrl,
  });

  const hero = resolveBlock(c.hero);
  const heroTitleFix = locale === 'it' ? IT_HERO_TITLE_FIX[trSlug] : undefined;
  if (heroTitleFix) hero.title = heroTitleFix;

  return {
    // WP post_title (title.rendered) boş olabilir (ör. IT Turizm — kaynak
    // sitenin kendi hatası, bkz. CLAUDE.md). Görünen başlık için önce ACF
    // hero.title'a güveniyoruz, o da boşsa post title'a, o da boşsa trSlug'a
    // düşüyoruz — sayfa hiçbir zaman tamamen başlıksız kalmaz.
    pageTitle: hero.title || entry.title || trSlug,
    hero,
    whyIdenfit: c.whyIdenfit,
    features: c.features.map(resolveBlock),
  };
}

// Meta description override'ları (2026-08-10, meta description uzunluk
// denetimi) — `SectorPage.astro`'nun varsayılan `hero.text || whyIdenfit.text`
// mantığı bu 7 (sektör, dil) kombinasyonunda 70 karakterin altında kaldı.
// Her açıklama o sektörün KENDİ `hero.text`/`whyIdenfit.text` gerçek
// temasından (kaynağın kendi WP içeriği) sentezlendi — kopya çeviri değil,
// diğer 5 sektör/29 kombinasyon zaten 70+ karakter olduğu için DOKUNULMADI.
const SECTOR_META_DESCRIPTION_OVERRIDES: Partial<Record<string, Partial<Record<Locale, string>>>> = {
  'perakende-sektoru-ik-cozumleri': {
    tr: "idenfit, perakende sektöründeki köklü firma ve KOBİ'lerin PDKS, izin/zaman yönetimi, işe alım ve personel eğitimi süreçlerini tek platformda birleştirir.",
    az: 'idenfit, pərakəndə sektorunda PDKS, icazə & vaxt idarəçiliyi, işə qəbul və personal təlimi proseslərini tək platformada birləşdirir.',
  },
  'guvenlik-sektoru-ik-cozumleri': {
    tr: 'Güvenlik sektöründe yetişmiş personel yönetimi idenfit ile kolaylaşır — PDKS, vardiya planlama ve İK süreçlerini tek platformda yönetin.',
  },
  'gida-sektoru-ik-cozumleri': {
    tr: 'Gıda sektöründe yoğun rekabet ve nitelikli personel eksikliğine karşı idenfit, İK süreçlerinizi dijitalleştirip verimliliğinizi artırır.',
  },
  'egitim-sektoru-ik-cozumleri': {
    tr: 'Genç nüfusla büyüyen eğitim sektöründe idenfit, yetenek keşfi, işe alım ve İK süreçlerinizi kolaylaştırarak rekabet avantajı sağlar.',
    nl: 'In de competitieve onderwijssector helpt Idenfit u de juiste talenten te vinden en HR-processen efficiënt te beheren.',
    en: 'High competition in education makes finding the right talent and managing HR processes challenging — idenfit helps you stay ahead.',
    az: 'Gənc əhali ilə böyüyən təhsil sektorunda idenfit, istedad kəşfi, işə qəbul və İK proseslərinizi asanlaşdıraraq rəqabət üstünlüyü təmin edir.',
  },
  'tesis-yonetimi-ik-cozumleri': {
    nl: 'De facilitair beheerindustrie groeit snel — Idenfit helpt u HR en personeel systematisch te beheren binnen deze sector.',
  },
};

export function getSectorMetaDescription(trSlug: string, locale: Locale): string | undefined {
  return SECTOR_META_DESCRIPTION_OVERRIDES[trSlug]?.[locale];
}
