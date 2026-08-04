// Donanım sayfasının (`idenfit.com/donanim/`) içeriğini tipli bir forma
// sokan veri katmanı — `productContent.ts` ile aynı desen (`link` alanı
// otoriter, CTA URL'leri `localizeCtaUrl()` ile yeniden çözülür, per-locale
// URL'ler `LanguageSwitcher` için üretilir). Tek fark: bu TEK bir sayfa
// (`sectors`/`products` gibi bir grup DEĞİL) — `ProductBlock` tipini
// (hero+sections şekli birebir aynı) doğrudan yeniden kullanır, bu yüzden
// render tarafında da yeni bir component yazılmadı, `ProductPage.astro`
// yeniden kullanıldı (bkz. `src/pages/donanim.astro` ve locale eşdeğerleri).
import { getRelativeLocaleUrl } from 'astro:i18n';
import hardwareExport from '../../reference/wordpress-export/hardware.json';
import { cleanRichText, localizeCtaUrl, stripTags, type ProductBlock } from './productContent';
import { HARDWARE_OVERRIDES } from './hardwareTranslationOverrides';
import type { Locale } from './nav';

export interface HardwareContent {
  hero: ProductBlock;
  sections: ProductBlock[];
}

interface HardwareLocaleEntryRaw {
  id: number;
  slug: string;
  link: string;
  title: string;
  modified: string;
  hero: ProductBlock;
  sections: ProductBlock[];
}

interface HardwareExportRaw {
  hardware: { trSlug: string; locales: Partial<Record<Locale, HardwareLocaleEntryRaw>> };
}

const DATA = hardwareExport as unknown as HardwareExportRaw;

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

const SLUG_INDEX: Partial<Record<Locale, string>> = {};
for (const [locale, entry] of Object.entries(DATA.hardware.locales) as [Locale, HardwareLocaleEntryRaw][]) {
  SLUG_INDEX[locale] = bareSlugFromUrl(entry.link);
}

export function getHardwareSlug(locale: Locale): string | undefined {
  return SLUG_INDEX[locale];
}

export function getHardwareLocaleUrls(): Partial<Record<Locale, string>> {
  const result: Partial<Record<Locale, string>> = {};
  for (const [locale, slug] of Object.entries(SLUG_INDEX) as [Locale, string][]) {
    result[locale] = getRelativeLocaleUrl(locale, slug);
  }
  return result;
}

/**
 * Ham `hardware.json` verisini + varsa `hardwareTranslationOverrides.ts`'teki
 * gerçek çeviriyi birleştirir — `productContent.ts`'in `getProductContent()`'i
 * ile birebir aynı öncelik mantığı (`override` verilmişse ham veriyi TAMAMEN
 * ez). IT'nin tamamı (hero + 7 blok) EN'in ham kopyası olduğu için IT
 * override'ı tam sayfa değişimi.
 */
export function getHardwareContent(locale: Locale): HardwareContent | undefined {
  const entry = DATA.hardware.locales[locale];
  const override = HARDWARE_OVERRIDES[locale];
  if (!entry && !override) return undefined;

  const resolveBlock = (b: ProductBlock): ProductBlock => ({
    title: cleanRichText(b.title),
    text: cleanRichText(b.text),
    ctaText: b.ctaText,
    ctaUrl: b.ctaUrl ? localizeCtaUrl(b.ctaUrl, locale) : '',
    image: b.image,
    id: b.id,
  });

  const heroRaw = override?.hero ?? entry?.hero;
  if (!heroRaw) return undefined;
  const sectionsRaw = override?.sections ?? entry?.sections ?? [];

  return {
    hero: resolveBlock(heroRaw),
    sections: sectionsRaw.map(resolveBlock),
  };
}

export function getHardwarePageTitle(locale: Locale): string {
  const entry = DATA.hardware.locales[locale];
  const override = HARDWARE_OVERRIDES[locale];
  return stripTags(override?.hero?.title || entry?.hero.title || entry?.title || 'donanim');
}
