// idenfit.com'un ÜRÜNLER mega-menüsünden birebir çıkarılan SVG ikonlar.
// Daire arkaplan rengi marka kırmızısı token'ına (--color-brand) bağlandı.
// "plug" ikonu kaynakta literal açık pembe (#F4CCCE) kullanıyor (canlı
// header HTML'i + CSS'i ile doğrulandı, 2026-07-24 — kaynağın kendi
// tasarım tutarsızlığı, CSS override'ı yok) — ama diğer 3 ikonla görsel
// tutarlılık için kullanıcı kararıyla bilinçli olarak marka rengine
// çevrildi (bkz. CLAUDE.md).

interface IconProps {
  className?: string;
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg width="32" height="32" viewBox="0 0 52 52" fill="none" aria-hidden="true" className={className}>
      <circle cx="26" cy="26" r="26" fill="var(--color-brand)" />
      <circle cx="26" cy="18" r="8" stroke="white" strokeWidth="2" />
      <path d="M39 41V41C39 35.4772 34.5228 31 29 31H23C17.4772 31 13 35.4772 13 41V41" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg width="32" height="32" viewBox="0 0 52 52" fill="none" aria-hidden="true" className={className}>
      <circle cx="26" cy="26" r="26" fill="var(--color-brand)" />
      <path d="M25 13V29.5H36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AwardIcon({ className }: IconProps) {
  return (
    <svg width="32" height="31" viewBox="0 0 52 50" fill="none" aria-hidden="true" className={className}>
      <path
        d="M33.3854 9.98941L31.1432 5.64183C30.6146 4.62101 29.8672 3.81895 28.9649 3.27208C28.0717 2.72522 27.0053 2.43356 25.8569 2.43356C24.7085 2.43356 23.6512 2.72522 22.7489 3.27208C21.8466 3.81895 21.0992 4.63013 20.5705 5.64183L18.3284 9.98941C17.6995 11.2016 16.8518 12.1951 15.831 12.9425C14.8011 13.6899 13.598 14.1912 12.2491 14.4099L7.41842 15.2029C6.28823 15.3851 5.28562 15.85 4.48355 16.5427C3.68148 17.2263 3.07082 18.1468 2.72447 19.2406C2.36901 20.3252 2.32345 21.428 2.56954 22.4579C2.81563 23.4879 3.34425 24.4449 4.14632 25.2652L7.5916 28.7469C8.54861 29.713 9.23219 30.8341 9.63322 32.0372C10.0251 33.2494 10.1254 34.5528 9.92489 35.8926L9.18662 40.7324C9.01345 41.8717 9.14102 42.9654 9.55117 43.9406C9.96132 44.9159 10.6358 45.7726 11.5655 46.4471C12.4951 47.1216 13.5251 47.5044 14.5732 47.5864C15.6305 47.6684 16.706 47.4588 17.7268 46.9484L22.1017 44.7518C23.3231 44.1411 24.59 43.8313 25.866 43.8313C27.142 43.8313 28.4089 44.1411 29.6303 44.7518L34.0052 46.9484C35.026 47.4588 36.1106 47.6684 37.1588 47.5864C38.2069 47.5044 39.2369 47.1216 40.1665 46.4471C41.0962 45.7726 41.7798 44.9159 42.1808 43.9406C42.5909 42.9654 42.7186 41.8717 42.5454 40.7324L41.8071 35.8926C41.5975 34.5528 41.7069 33.2494 42.0988 32.0372C42.4907 30.825 43.1743 29.713 44.1404 28.7469L47.5857 25.2652C48.3878 24.454 48.9255 23.497 49.1625 22.4579C49.4086 21.428 49.363 20.3252 49.0075 19.2406C48.6521 18.1468 48.0414 17.2354 47.2484 16.5427C46.4463 15.85 45.4529 15.3943 44.3136 15.2029L39.483 14.4099C38.134 14.1912 36.9309 13.6899 35.901 12.9425C34.8711 12.1951 34.0234 11.2016 33.4037 9.98941H33.3854Z"
        fill="var(--color-brand)"
      />
    </svg>
  );
}

export function PlugIcon({ className }: IconProps) {
  return (
    <svg width="32" height="32" viewBox="0 0 52 52" fill="none" aria-hidden="true" className={className}>
      <circle cx="26" cy="26" r="26" fill="var(--color-brand)" />
      <path
        d="M30.125 33L21.875 33M30.125 33V33C33.922 33 37 29.922 37 26.125L37 15L31.5 15M30.125 33L30.125 39L26 39M21.875 33V33C18.078 33 15 29.922 15 26.125L15 15L20.5 15M21.875 33L21.875 39L26 39M26 39L26 50.5M20.5 15L20.5 5.5M20.5 15L31.5 15M31.5 15L31.5 5.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
