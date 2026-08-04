// 4 dilin bayrak ikonları — küçük, elle çizilmiş inline SVG'ler (basit
// geometrik şekiller: dikdörtgen bantlar/daireler, gerçek bayrak
// oranlarına (3:2) sadık ama küçük boyutta detay gerektirmeyecek kadar
// sade). 2026-07-28 (altıncı tur) — bayrak EMOJİ'si (🇹🇷 vb.) Windows'ta
// Chrome'un regional-indicator sembollerini tek bir bayrak glyph'inde
// BİRLEŞTİREMEMESİ yüzünden iki harfi ayrı ayrı gösteriyordu (kullanıcı
// bulgusu — "TR TR" olarak görünen şey aslında "🇹"+"🇷" harflerinin
// düşmesi + yanındaki "TR" kısa kodu). Ayrı bir SVG bayrak kütüphanesi
// (`flag-icons` vb.) KURULMADI — yalnızca 4 ülke gerektiği için tüm
// dünya bayraklarını içeren bir paket orantısız olurdu; bunun yerine
// yalnızca ihtiyaç duyulan 4 bayrak elle, sıfır bağımlılıkla eklendi.
export type FlagCode = 'TR' | 'GB' | 'NL' | 'IT';

const FLAGS: Record<FlagCode, React.ReactNode> = {
  TR: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#E30A17" />
      <circle cx="12" cy="10" r="5.5" fill="#FFFFFF" />
      <circle cx="13.5" cy="10" r="4.4" fill="#E30A17" />
      <path d="M17.5 10l4.6 1.5-2.9-3.9v4.8l2.9-3.9z" fill="#FFFFFF" />
    </svg>
  ),
  GB: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#00247D" />
      <path d="M0 0l30 20M30 0L0 20" stroke="#FFFFFF" strokeWidth="4" />
      <path d="M0 0l30 20M30 0L0 20" stroke="#CF142B" strokeWidth="1.6" />
      <path d="M15 0v20M0 10h30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M15 0v20M0 10h30" stroke="#CF142B" strokeWidth="2.4" />
    </svg>
  ),
  NL: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#FFFFFF" />
      <rect width="30" height="6.67" fill="#AE1C28" />
      <rect y="13.33" width="30" height="6.67" fill="#21468B" />
    </svg>
  ),
  IT: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="10" height="20" fill="#009246" />
      <rect x="10" width="10" height="20" fill="#FFFFFF" />
      <rect x="20" width="10" height="20" fill="#CE2B37" />
    </svg>
  ),
};

export default function FlagIcon({ code }: { code: FlagCode }) {
  return <span className="inline-flex shrink-0 overflow-hidden rounded-[2px]">{FLAGS[code]}</span>;
}
