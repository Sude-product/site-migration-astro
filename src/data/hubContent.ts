// İK "hub"/dizin sayfalarının (İnsan Kaynakları Modülleri, İşgücü Yönetimi)
// içeriğini tipli bir forma sokan veri katmanı — `productContent.ts` ile
// aynı desen (`link` alanı otoriter, CTA URL'leri `localizeCtaUrl()` ile
// yeniden çözülür), ama bu sayfalar standart hero+section şemasına değil,
// hero + tanıtım bloğu + "ürün tile grid" düzenine uyuyor (bkz.
// `scripts/extract-hubs.mjs`, CLAUDE.md "İK Hub sayfaları").
import { getRelativeLocaleUrl } from 'astro:i18n';
import hubsExport from '../../reference/wordpress-export/hubs.json';
import { cleanRichText, localizeCtaUrl, resolveCtaUrl } from './productContent';
import { HUB_OVERRIDES } from './hubTranslationOverrides';
import type { Locale } from './nav';

export interface HubBlock {
  title: string;
  text: string;
  ctaText: string;
  ctaUrl: string;
}

export interface HubTile {
  title: string;
  text: string;
  ctaText: string;
  ctaUrl: string;
  ctaExternal: boolean;
  image: { url: string; alt: string; width?: number; height?: number } | null;
}

export interface HubFaqItem {
  question: string;
  answer: string;
}

export interface HubContent {
  hero: HubBlock;
  intro: { title: string; text: string } | null;
  tiles: HubTile[];
  faq: HubFaqItem[];
}

interface HubTileRaw {
  /** Locale-bağımsız kararlı kimlik (alan index+sonek'i, ör. "2_copy2") —
   * başlık metni dile göre değiştiği için (TR "evraklar" / EN "papers")
   * belirli bir tile'ı hariç tutmak için bu kullanılır, title değil. */
  key: string;
  title: string;
  text: string;
  ctaText: string;
  ctaUrl: string;
  image: { url: string; alt: string; width?: number; height?: number } | null;
}

interface HubLocaleEntryRaw {
  id: number;
  slug: string;
  link: string;
  title: string;
  hero: HubBlock;
  intro: { title: string; text: string } | null;
  tiles: HubTileRaw[];
  faq: HubFaqItem[];
}

interface HubGroupRaw {
  trSlug: string;
  locales: Partial<Record<Locale, HubLocaleEntryRaw>>;
}

const DATA = hubsExport as unknown as { hubs: HubGroupRaw[] };

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
for (const group of DATA.hubs) {
  const perLocale: Partial<Record<Locale, string>> = {};
  for (const [locale, entry] of Object.entries(group.locales) as [Locale, HubLocaleEntryRaw][]) {
    perLocale[locale] = bareSlugFromUrl(entry.link);
  }
  SLUG_INDEX[group.trSlug] = perLocale;
}

// "evraklar" tile'ı (key: "2_copy2") hub A'da var ama kaynak sitede migrate
// edilmiş/var olan bir karşılığı yok (bkz. CLAUDE.md — evraklar-modulu
// export'ta da, canlı sitede de bulunamadı, gerçek bir içerik boşluğu).
// Kullanıcı kararı: kart tamamen çıkarılsın (link vermek ya da boş kart
// göstermek yerine). `key` locale-bağımsız (title dile göre değişir, ör.
// TR "evraklar" / EN "papers" — bu yüzden title değil key ile filtrelenir).
const EXCLUDED_TILE_KEYS: Record<string, string[]> = {
  'insan-kaynaklari-yonetimi-modulu': ['2_copy2'],
};

/** Tile CTA'sı idenfit.com dışına (ör. workmana.com — Güvenlik/Görev/Denetim,
 * kardeş bir ürüne gerçek çapraz-satış linkleri) gidiyorsa OLDUĞU GİBİ
 * (dış link) korunur — kendi sitemizde var olmayan bir yola dönüştürülmez.
 * idenfit.com içiyse normal şekilde locale'e göre çözülür.
 * `productContent.ts`'teki paylaşılan `resolveCtaUrl()`'ü kullanır (Fiyatlar
 * sayfasının Mikro/KOBİ CTA'ları için eklenen aynı dış-domain mantığı). */
function resolveTileCta(rawUrl: string, locale: Locale): { url: string; external: boolean; newTab: boolean } {
  return resolveCtaUrl(rawUrl, locale);
}

export function getHubContent(trSlug: string, locale: Locale): HubContent | undefined {
  const entry = DATA.hubs.find((g) => g.trSlug === trSlug)?.locales[locale];
  const override = HUB_OVERRIDES[trSlug]?.[locale];
  if (!entry && !override) return undefined;

  const heroRaw = override?.hero ?? entry?.hero;
  if (!heroRaw) return undefined;

  const introRaw = override?.intro !== undefined ? override.intro : (entry?.intro ?? null);
  const tilesRaw = override?.tiles ?? entry?.tiles ?? [];
  const faqRaw = override?.faq ?? entry?.faq ?? [];

  const excluded = EXCLUDED_TILE_KEYS[trSlug] ?? [];

  return {
    hero: {
      title: cleanRichText(heroRaw.title),
      text: cleanRichText(heroRaw.text),
      ctaText: heroRaw.ctaText,
      ctaUrl: heroRaw.ctaUrl ? localizeCtaUrl(heroRaw.ctaUrl, locale) : '',
    },
    intro: introRaw ? { title: cleanRichText(introRaw.title), text: cleanRichText(introRaw.text) } : null,
    tiles: tilesRaw
      .filter((t) => !excluded.includes(t.key))
      .map((t) => {
        const cta = resolveTileCta(t.ctaUrl, locale);
        return {
          title: cleanRichText(t.title),
          text: cleanRichText(t.text),
          ctaText: t.ctaText,
          ctaUrl: cta.url,
          // workmana.com gibi GERÇEK dış linkler yeni sekmede açılır; olası
          // bir app.idenfit.com CTA'sı (şu an kaynakta yok) aynı sekmede
          // kalır — bkz. `resolveCtaUrl()`'ün `newTab` alanı.
          ctaExternal: cta.newTab,
          image: t.image,
        };
      }),
    faq: faqRaw.map((f) => ({ question: f.question, answer: cleanRichText(f.answer) })),
  };
}

export function getHubPageTitle(trSlug: string, locale: Locale): string {
  const entry = DATA.hubs.find((g) => g.trSlug === trSlug)?.locales[locale];
  const override = HUB_OVERRIDES[trSlug]?.[locale];
  return override?.hero?.title ?? entry?.title ?? '';
}

export function getHubSlug(trSlug: string, locale: Locale): string | undefined {
  return SLUG_INDEX[trSlug]?.[locale];
}

export function getHubLocaleUrls(trSlug: string): Partial<Record<Locale, string>> {
  const perLocale = SLUG_INDEX[trSlug];
  if (!perLocale) return {};
  const urls: Partial<Record<Locale, string>> = {};
  for (const [locale, slug] of Object.entries(perLocale) as [Locale, string][]) {
    urls[locale] = getRelativeLocaleUrl(locale, slug);
  }
  // Hub sayfalarının NL'de kaynak sayfası hiç yok — `miscPagesContent.ts`'in
  // `localeUrlsFor()`'unda (KVKK/Tüketici Hakları/Mesafeli Satış/Güvenlik
  // için) uygulanan AYNI düzeltme burada da gerekiyordu (site denetim
  // raporu madde 6): `urls.nl` eksik kalınca Header'ın generic (yanlış,
  // path-bağımlı) fallback'i sızıp hangi sayfadan geçildiğine göre
  // tutarsız/kırık bir NL hedefi üretiyordu. `nl` eksikse doğrudan EN'in
  // gerçek URL'ine eşitleniyor.
  if (!urls.nl && urls.en) urls.nl = urls.en;
  return urls;
}
