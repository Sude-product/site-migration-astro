import { LOCALES, type Locale } from '../data/nav';
import { computeGenericLocaleUrls } from './localeUrls';

export interface HreflangAlternate {
  locale: Locale;
  href: string;
}

/**
 * `<link rel="alternate" hreflang>` etiketleri için mutlak URL listesi
 * üretir (2026-08-17, "No hreflang tags" SEO bulgusu — bkz. CLAUDE.md).
 *
 * İki kalıcı kural, ikisi de araştırma turunda doğrulandı:
 * 1. **Mutlak URL şart.** Google'ın hreflang dokümantasyonu göreli yolu
 *    KABUL ETMİYOR — `site` (Faz 2'de prod domain bağlanınca) tanımlı
 *    değilse HİÇ tag üretilmez (canonical'ın `pageUrl` mantığıyla AYNI
 *    "hazır ama uykuda" ilkesi, bkz. `BaseLayout.astro`).
 * 2. **Yalnızca GERÇEK içerik.** Fallback/redirect stub'lara (zaten
 *    `noindex`, bkz. Açık nokta #27) işaret eden bir hreflang Google
 *    tarafından geçersiz sayılıp yok sayılıyor — bu yüzden `localeUrls`
 *    prop'unun ham anahtarları KÖRÜ KÖRÜNE kullanılmaz. Birçok
 *    `get*LocaleUrls()` fonksiyonu (bkz. `miscPagesContent.ts`'in
 *    `localeUrlsFor()`'ı + `faqContent.ts`/`hubContent.ts`/
 *    `supportRequestContent.ts`/`thankYouContent.ts`'in kendi kopyaları)
 *    dil DEĞİŞTİRİCİSİ için BİLİNÇLİ olarak eksik NL'yi EN'in gerçek
 *    URL'ine "alias"lıyor (kırık ara-adım/404 riskini önlemek için) — bu,
 *    switcher için doğru ama hreflang için YANLIŞ bir sinyal olurdu
 *    (hreflang="nl" EN sayfasına işaret eder, ki bu Google'ın kurallarına
 *    aykırı). Bu yüzden hangi locale'lerin GERÇEKTEN var olduğu
 *    `hreflangLocales` prop'uyla HER ZAMAN açıkça belirtilir — verilmezse
 *    varsayılan LOCALES'in HEPSİ (çoğu sayfa için doğru varsayım), ama
 *    gerçek bir eksik varsa (KVKK/Güvenlik/SSS/Hub/Destek Talebi/
 *    Teşekkürler ailesi gibi) çağıran sayfa MUTLAKA kısıtlı listeyi
 *    geçirmeli — bkz. `BaseLayout.astro`'daki prop yorumu.
 */
export function buildHreflangAlternates(
  site: URL | undefined,
  pathname: string,
  localeUrls: Partial<Record<Locale, string>> | undefined,
  hreflangLocales: readonly Locale[] | undefined,
): HreflangAlternate[] {
  if (!site) return [];
  const hrefMap = localeUrls && Object.keys(localeUrls).length > 0 ? localeUrls : computeGenericLocaleUrls(pathname);
  const locales = (hreflangLocales ?? LOCALES).filter((l): l is Locale => Boolean(hrefMap[l]));
  // Tek dilse (ör. blog, Hesaplama Araçları) bildirilecek bir alternatif
  // yok — hreflang'ın kendisi anlamsız, hiç üretilmiyor.
  if (locales.length < 2) return [];
  return locales.map((l) => ({ locale: l, href: new URL(hrefMap[l]!, site).href }));
}
