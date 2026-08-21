import { getRelativeLocaleUrl } from 'astro:i18n';
import { LOCALES, type Locale } from '../data/nav';

/**
 * Aktif path'in locale önekini soyutlayıp diğer 3 dildeki AYNI slug'a
 * karşılık gelen URL'leri üretir — yalnızca slug'ın locale'ler arasında
 * GERÇEKTEN aynı olduğu sayfalarda doğru sonuç verir (ör. ana sayfa,
 * Müşteriler, Online Sunum Talebi). Slug'ı farklı sayfalar kendi
 * `localeUrls` override'ını geçirmeli — bkz. `Header.astro`/`BaseLayout.astro`.
 *
 * `Header.astro`'nun dil değiştiricisi + `BaseLayout.astro`'nun hreflang
 * üretimi AYNI hesaplamayı paylaşır (2026-08-17'de buraya taşındı, önceden
 * yalnızca Header.astro içinde inline'dı).
 */
export function computeGenericLocaleUrls(pathname: string): Record<Locale, string> {
  const segments = pathname.split('/').filter(Boolean);
  if (LOCALES.includes(segments[0] as Locale)) segments.shift();
  const restPath = segments.join('/');
  return Object.fromEntries(LOCALES.map((l) => [l, getRelativeLocaleUrl(l, restPath)])) as Record<Locale, string>;
}
