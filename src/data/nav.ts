// idenfit.com üst-seviye navigasyonu — yapı burada, METİNLER src/i18n/'de.
// Gerçek menü başlıkları (TR, BÜYÜK HARF): ÜRÜNLER, NEDEN IDENFIT, SEKTÖRLER,
// FİYATLAR, MÜŞTERİLER, KURUMSAL, KEŞFET.
// NOT: slug'lar aktif dile göre `getRelativeLocaleUrl` ile prefixlenir; ilgili
// route'lar içerik migrasyonunda oluşacak (şimdilik iskelet).
//
// ⚠️ 2026-07-31 — ayrı bir üst-seviye "BLOG" linki (KEŞFET'in hemen
// yanında) kullanıcı isteğiyle KALICI olarak kaldırıldı: blog zaten
// KEŞFET mega-menüsünün "İçerikler" kolonunda ("Bloglar") linkli, ayrı
// bir üst-seviye giriş noktası fazlalıktı. Kalan 7 öğenin arası kaynağın
// gerçek ölçülen boşluğuna göre ayarlandı (bkz. Header.astro).
//
// Header aria-label metinleri (openMenu/closeMenu/brandHome/mainNav/langLabel)
// artık burada DEĞİL — `src/i18n/*.ts`'in `headerUi` şemasında (bkz. CLAUDE.md).

import type { Translations } from '../i18n';

export const LOCALES = ['tr', 'en', 'nl', 'it', 'az'] as const;
export type Locale = (typeof LOCALES)[number];

export interface NavItem {
  /** URL slug (dil öneki hariç). */
  slug: string;
  /** src/i18n/*.ts `nav` şemasındaki karşılık gelen anahtar. */
  key: keyof Translations['nav'];
}

export const NAV_ITEMS: NavItem[] = [
  { slug: 'urunler', key: 'products' },
  { slug: 'neden-idenfit', key: 'whyIdenfit' },
  { slug: 'sektorler', key: 'sectors' },
  { slug: 'fiyatlar', key: 'pricing' },
  { slug: 'musteriler', key: 'customers' },
  { slug: 'kurumsal', key: 'company' },
  { slug: 'kesfet', key: 'discover' },
];
