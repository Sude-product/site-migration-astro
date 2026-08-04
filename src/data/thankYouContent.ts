// Teşekkürler / "Demo – Thank You" sayfası — Online Sunum Talebi (hero)
// formu gönderildikten sonra kaynak sitede gösterilen sayfa. Kaynak:
// standart `page` post type (`pages.json`, id 15810/en 15856/it 23535,
// `pll_translations` yalnızca tr/en/it — NL kaynakta yok). ACF'i
// TAMAMEN BOŞ (391 alanın hepsi null — başka şablonlardan kalma gürültü,
// bkz. CLAUDE.md ACF analizi), gerçek içerik Elementor `content.rendered`'da
// — bu yüzden diğer sayfalardaki gibi genel bir ACF extraction script'i
// değil, Ana Sayfa bölümleriyle aynı yaklaşım (elle transkripsiyon)
// kullanıldı. IT'nin ham `<title>` alanı yine anlamsız ("Demo – Thank
// You_IT", bkz. "About_IT" ile aynı sınıf junk) — hiç kullanılmadı, kendi
// içeriğimizden gerçek bir `<title>` üretiliyor.
//
// Video/logo testimonial'ları `/musteriler/`deki AYNI 2 müşteri (Civil,
// Femaş — kaynakta yalnızca bu ikisinde gerçek YouTube video URL'si var,
// bkz. `customerStories.ts`) ama alıntı METNİ burası için AYRI/daha kısa
// bir versiyon (kaynakta öyle, kopya değil) — bu yüzden burada tekrar
// tanımlandı, `customerStories.ts`'ten import edilmedi.
//
// BULUNAN KAYNAK VERİ HATASI: EN/IT'de "Why idenfit?"/"Perché idenfit?"
// linkinin METNİ doğruyken HEDEFİ yanlışlıkla `/customers/`/`/clienti/`
// (Müşteriler sayfası) idi — yalnızca TR doğru şekilde `/tr/neden-idenfit/`e
// gidiyordu. Ham href'e güvenilmedi, projenin CTA çözümleme ilkesiyle
// tutarlı olarak `getWhyIdenfitSlug()` üzerinden doğru hedefe bağlandı.
import { getRelativeLocaleUrl } from 'astro:i18n';
import { getWhyIdenfitSlug } from './miscPagesContent';
import type { Locale } from './nav';

type ThankYouLocale = 'tr' | 'en' | 'it';

export interface ThankYouTestimonial {
  name: string;
  logoUrl: string;
  logoAlt: string;
  videoUrl: string;
  quote: string;
}

export interface ThankYouContent {
  title: string;
  text: string;
  homeCtaText: string;
  whyIdenfitCtaText: string;
  whyIdenfitHref: string;
  youtubePromptPrefix: string;
  youtubePromptLinkText: string;
  youtubePromptSuffix: string;
  youtubeChannelUrl: string;
  brandTagline: string;
  testimonials: ThankYouTestimonial[];
}

// Gerçek per-locale slug'lar (`link` alanından) — üçü de FARKLI, tek
// canonical slug varsayımı burada geçerli değil (KVKK ailesiyle aynı sınıf).
const SLUGS: Record<ThankYouLocale, string> = {
  tr: 'tesekkurler',
  en: 'thanks',
  it: 'grazie',
};

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/channel/UCE-4lk4QsU71NfTI7vxPCJQ/';

export const THANK_YOU_HERO_IMAGE = {
  url: 'https://idenfit.com/wp-content/uploads/2025/09/Group-1365420168-1-1024x997.webp',
  width: 1000,
  height: 974,
};
export const THANK_YOU_BRAND_ICON_URL = 'https://idenfit.com/wp-content/uploads/2025/08/id-circle.svg';

const CIVIL_LOGO_URL = 'https://idenfit.com/wp-content/uploads/2025/08/civil.svg';
const FEMAS_LOGO_URL = 'https://idenfit.com/wp-content/uploads/2025/08/logo-white-1024x162.png';
const CIVIL_VIDEO_URL = 'https://youtu.be/-MxZWA99a20';
const FEMAS_VIDEO_URL = 'https://youtu.be/cakFopJJ-pE';

const TESTIMONIALS: Record<ThankYouLocale, ThankYouTestimonial[]> = {
  tr: [
    {
      name: 'Civil',
      logoUrl: CIVIL_LOGO_URL,
      logoAlt: 'Civil',
      videoUrl: CIVIL_VIDEO_URL,
      quote:
        'Vardiya çizelgelerinden izin takiplerine, bordro imzalarından mesai takiplerine tüm resmi evrak ve imza işlerini dijitale taşımış olduk. idenfit, etkin ve verimli bir İK yönetimi altyapısını bize sağlamış oldu. Yolculuğumuza eşlik ettikleri için kendilerine teşekkür ediyoruz.',
    },
    {
      name: 'Femaş',
      logoUrl: FEMAS_LOGO_URL,
      logoAlt: 'Femaş',
      videoUrl: FEMAS_VIDEO_URL,
      quote:
        "idenfit olarak sağladığımız yazılım desteğiyle, 5 kıta ve 100'den fazla ülkede faaliyet gösteren Femaş Grup'un insan kaynakları ve iş gücü yönetimi süreçlerini dijital ortamda kolayca yönetmesini sağladık.",
    },
  ],
  en: [
    {
      name: 'Civil',
      logoUrl: CIVIL_LOGO_URL,
      logoAlt: 'Civil',
      videoUrl: CIVIL_VIDEO_URL,
      quote:
        'We have transitioned all official documents and signature tasks to digital, from shift schedules and leave tracking to payroll signatures and overtime monitoring. idenfit has provided us with an effective and efficient HR management infrastructure. We thank them for accompanying us on this journey.',
    },
    {
      name: 'Femaş',
      logoUrl: FEMAS_LOGO_URL,
      logoAlt: 'Femaş',
      videoUrl: FEMAS_VIDEO_URL,
      quote:
        'With the software support provided by idenfit, we have enabled Femaş Group, operating in over 100 countries across 5 continents, to manage its human resources and workforce management processes effortlessly in the digital environment.',
    },
  ],
  it: [
    {
      name: 'Civil',
      logoUrl: CIVIL_LOGO_URL,
      logoAlt: 'Civil',
      videoUrl: CIVIL_VIDEO_URL,
      quote:
        "Abbiamo trasferito tutti i documenti ufficiali e le attività di firma al digitale, dagli orari dei turni al tracciamento delle ferie, dalle firme delle buste paga al monitoraggio degli straordinari. idenfit ci ha fornito un'infrastruttura di gestione delle risorse umane efficace ed efficiente. Li ringraziamo per averci accompagnato in questo viaggio.",
    },
    {
      name: 'Femaş',
      logoUrl: FEMAS_LOGO_URL,
      logoAlt: 'Femaş',
      videoUrl: FEMAS_VIDEO_URL,
      quote:
        "Con il supporto software fornito da idenfit, abbiamo permesso al Gruppo Femaş, che opera in oltre 100 paesi in 5 continenti, di gestire i processi di gestione delle risorse umane e della forza lavoro senza sforzo nell'ambiente digitale.",
    },
  ],
};

const CONTENT: Record<
  ThankYouLocale,
  Omit<ThankYouContent, 'whyIdenfitHref' | 'testimonials' | 'youtubeChannelUrl'>
> = {
  tr: {
    title: 'Teşekkürler!',
    text: 'Formumuzu doldurduğunuz için teşekkür ederiz! Sizlere en kısa süre içerisinde ulaşacağız. Bu süreçte bizi daha yakından tanımaya ne dersiniz?',
    homeCtaText: 'Anasayfaya Dön',
    whyIdenfitCtaText: 'Neden idenfit?',
    youtubePromptPrefix: 'Eğlenceli ve bilgilendirici videolarımızı keşfetmek ve bizi daha yakından tanımak için ',
    youtubePromptLinkText: 'YouTube kanalımıza',
    youtubePromptSuffix: ' göz atmayı unutmayın!',
    brandTagline: 'Yeni nesil tanımlama ve işgücü yönetim platformu',
  },
  en: {
    title: 'Thank you!',
    text: 'Thank you for filling out our form! We will get back to you as soon as possible. In the meantime, how about getting to know us better?',
    homeCtaText: 'Return to Homepage',
    whyIdenfitCtaText: 'Why idenfit?',
    youtubePromptPrefix: "Don't forget to check out our ",
    youtubePromptLinkText: 'YouTube channel',
    youtubePromptSuffix: ' to explore our fun and informative videos and get to know us better!',
    brandTagline: 'New generation human resources & workforce management software',
  },
  it: {
    title: 'Grazie!',
    text: 'Grazie per aver compilato il nostro modulo! Ti risponderemo il prima possibile. Nel frattempo, che ne dici di conoscerci meglio?',
    homeCtaText: 'Torna alla Home Page',
    whyIdenfitCtaText: 'Perché idenfit?',
    youtubePromptPrefix: "Non dimenticare di dare un'occhiata al nostro ",
    youtubePromptLinkText: 'canale YouTube',
    youtubePromptSuffix: ' per esplorare i nostri video divertenti e informativi e conoscerci meglio!',
    brandTagline: 'Software di nuova generazione per le risorse umane e la gestione della forza lavoro',
  },
};

function toThankYouLocale(locale: Locale): ThankYouLocale | undefined {
  return locale === 'tr' || locale === 'en' || locale === 'it' ? locale : undefined;
}

export function getThankYouContent(locale: Locale): ThankYouContent | undefined {
  const key = toThankYouLocale(locale);
  if (!key) return undefined;
  return {
    ...CONTENT[key],
    whyIdenfitHref: getRelativeLocaleUrl(locale, getWhyIdenfitSlug(locale) ?? 'neden-idenfit'),
    youtubeChannelUrl: YOUTUBE_CHANNEL_URL,
    testimonials: TESTIMONIALS[key],
  };
}

export function getThankYouSlug(locale: Locale): string | undefined {
  const key = toThankYouLocale(locale);
  return key ? SLUGS[key] : undefined;
}

export function getThankYouLocaleUrls(): Partial<Record<Locale, string>> {
  const result: Partial<Record<Locale, string>> = {};
  for (const [locale, slug] of Object.entries(SLUGS) as [ThankYouLocale, string][]) {
    result[locale] = getRelativeLocaleUrl(locale, slug);
  }
  // NL kaynakta yok — dil değiştiricide NL doğrudan EN'in gerçek URL'ine
  // eşitleniyor (KVKK/Hub ailesindeki aynı düzeltme, site denetim raporu
  // madde 3/6'da bulunan hatayı bu YENİ sayfada baştan tekrarlamamak için).
  if (!result.nl && result.en) result.nl = result.en;
  return result;
}
