// "Destek Talebiniz Alınmıştır" — Destek Talebi (`/destek-talebi/`) formu
// gönderildikten sonra kaynak sitede gösterilen ayrı bir teşekkür sayfası
// (KARIŞTIRILMASIN: `thankYouContent.ts`'teki `/tesekkurler/` Online Sunum
// Talebi/demo formunun teşekkür sayfasıdır, bambaşka içerik/görsel taşır).
// Kaynak: standart `page` post type (`pages.json`, TR id 16712/EN id 16742),
// `pll_translations` yalnızca tr/en — IT/NL kaynakta hiç yok (Açık nokta #10).
// ACF alanları temiz/düz (`page_title`/`page_subtitle`/`text`/`faq_button_*`/
// `home_button_*`/`page_image`) — Elementor `content.rendered`'ı parse etmeye
// gerek kalmadı.
//
// ⚠️ KALICI NOT (2026-08-29): Bu sayfa yalnızca İÇERİK olarak migrate edildi.
// `SupportRequestForm.tsx` hâlâ backend'siz (`console.log` stub, Faz 2
// bekliyor) — form BİLEREK bu sayfaya yönlendirilmiyor. "Başarılı" bir onay
// sayfasına yönlendirmek, form aslında hiçbir yere gitmediği için kullanıcıya
// yanlış bilgi verir. Form gerçek submit işlevine kavuştuğunda (Faz 2,
// Cloudflare Pages Functions) `SupportRequestForm.tsx`'e yönlendirme
// eklenecek — bkz. CLAUDE.md Açık nokta #10 ve `ThankYouPage.astro`'daki
// AYNI bekleyen-yönlendirme durumu (Online Sunum Talebi'nin teşekkür
// sayfası da aynı sebeple bağlı değil).
import { getRelativeLocaleUrl } from 'astro:i18n';
import { getPageModifiedDateById } from './pagesJsonModified';
import type { Locale } from './nav';

type SupportThankYouLocale = 'tr' | 'en';

const PAGE_IDS: Record<SupportThankYouLocale, number> = {
  tr: 16712,
  en: 16742,
};

// Gerçek per-locale slug'lar (`link` alanından) — FARKLI (KVKK ailesiyle
// aynı sınıf), tek canonical slug varsayımı geçerli değil.
const SLUGS: Record<SupportThankYouLocale, string> = {
  tr: 'tesekkurler-destek',
  en: 'thank-you',
};

export interface SupportThankYouContent {
  title: string;
  subtitle: string;
  // Kaynakta iki cümle arasında `<br>` var (bkz. ekran görüntüsü) — düz
  // metin yerine 2 satır olarak taşınıyor, uydurma bir bölme değil.
  textLines: [string, string];
  faqText: string;
  faqHref: string;
  homeText: string;
  homeHref: string;
}

const IMAGE = {
  url: 'https://idenfit.com/wp-content/uploads/2025/08/thankyou-support-e1756402693518.png',
  width: 932,
  height: 945,
};

export const SUPPORT_THANK_YOU_IMAGE = IMAGE;

function toSupportThankYouLocale(locale: Locale): SupportThankYouLocale | undefined {
  return locale === 'tr' || locale === 'en' ? locale : undefined;
}

export function getSupportThankYouContent(locale: Locale): SupportThankYouContent | undefined {
  const key = toSupportThankYouLocale(locale);
  if (!key) return undefined;

  const faqSlug = key === 'tr' ? 'sss' : 'faq';
  const faqHref = getRelativeLocaleUrl(key, faqSlug);
  const homeHref = getRelativeLocaleUrl(key, '');

  if (key === 'tr') {
    return {
      title: 'Destek Talebiniz Alınmıştır',
      subtitle: 'Sizlere en kısa süre içerisinde ulaşacağız.',
      textLines: ['Destek talepleriniz mail olarak cevaplanmaktadır.', 'Lütfen mail adresinizi sık sık kontrol ediniz!'],
      faqText: 'Sıkça Sorulan Sorular',
      faqHref,
      homeText: 'Anasayfaya Dön',
      homeHref,
    };
  }

  return {
    title: 'Your support request has been received.',
    subtitle: 'We will contact you as soon as possible.',
    textLines: ['Your support requests are answered via email.', 'Please check your email address frequently!'],
    faqText: 'Frequently Asked Questions',
    faqHref,
    homeText: 'Back to Homepage',
    homeHref,
  };
}

// IT/AZ'de kaynakta gerçek sayfa yok — bare slug (`tesekkurler-destek`)
// TR ile aynı olduğu için `astro.config.mjs`'in genel `it:'tr'`/`az:'tr'`
// fallback'i otomatik çalışır, elle bir şey gerekmez. NL'de ise per-locale
// slug FARKLI olduğu (TR≠EN) için otomatik `nl:'en'` fallback'i aynı bare
// slug'ı ('tesekkurler-destek') EN altında arar ve BULAMAZ — KVKK/`tesekkurler`/
// `destek-talebi` sınıfının AYNISI, `astro.config.mjs`'e elle bir
// `redirects` girdisi gerekiyor (bkz. o dosyadaki `/nl/tesekkurler-destek`).
export function getSupportThankYouLocaleUrls(): Partial<Record<Locale, string>> {
  const result: Partial<Record<Locale, string>> = {};
  for (const [locale, slug] of Object.entries(SLUGS) as [SupportThankYouLocale, string][]) {
    result[locale] = getRelativeLocaleUrl(locale, slug);
  }
  // Yukarıdaki yorumun "elle bir şey gerekmez" varsayımı EN sayfasından
  // (bare slug 'thank-you') dil değiştirilirse GEÇERSİZ kalıyordu —
  // Header'ın generic fallback'i o zaman `/az/thank-you/`/`/it/thank-you/`
  // üretir, TR'de böyle bir slug olmadığı için gerçek 404 verir (2026-09-02,
  // `supportRequestContent.ts`'teki eşdeğer düzeltmenin bulunduğu tur —
  // bkz. o dosyadaki bug açıklaması). IT/az az'de KAPSAM DIŞI — `result.tr`
  // (bare TR URL'i, 'tesekkurler-destek') doğrudan kullanılıyor.
  if (!result.it) result.it = result.tr;
  if (!result.az) result.az = result.tr;
  return result;
}

export function getSupportThankYouModifiedDate(locale: Locale): Date | undefined {
  const key = toSupportThankYouLocale(locale);
  return key ? getPageModifiedDateById(PAGE_IDS[key]) : undefined;
}
