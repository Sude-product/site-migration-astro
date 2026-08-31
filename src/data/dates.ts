import type { Locale } from './nav';

/** `Intl.DateTimeFormat` için locale kodları — proje genelinde tarih
 * biçimlendirmesi gereken her yerde (bkz. `LastUpdated.astro`, "No visible
 * content dates" GEO bulgusu, 2026-08-17) paylaşılan tek eşleme.
 * `blogContent.ts`'in `formatBlogDate()`'i TR-only olduğu için sabit
 * `'tr-TR'` kullanıyordu — bu proje 4 dilli sayfalar için genelleştirir. */
export const BCP47_LOCALE: Record<Locale, string> = {
  tr: 'tr-TR',
  en: 'en-US',
  nl: 'nl-NL',
  it: 'it-IT',
  az: 'az-AZ',
};

export function formatLocalizedDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(BCP47_LOCALE[locale], { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}
