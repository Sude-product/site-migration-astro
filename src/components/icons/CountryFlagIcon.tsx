// Telefon ülke kodu seçicisinin (`PhoneCountrySelect.tsx`) bayrak ikonları —
// `FlagIcon.tsx`'in (dil seçici, 4 ülke) AYNI ilkesiyle: küçük, elle
// çizilmiş inline SVG'ler, gerçek bayrak oranına (3:2, 30x20 viewBox)
// sadık ama küçük boyutta detay gerektirmeyecek kadar sade geometrik
// şekiller. 2026-08-03 — `PhoneCountrySelect.tsx` daha önce `flagEmoji()`
// (Unicode regional-indicator emoji) kullanıyordu; `FlagIcon.tsx`'in kendi
// yorumunda belgelendiği gibi bu, Windows'ta Chrome'da bayrakların iki ayrı
// harfe (`🇹`+`🇷`) düşmesine yol açıyordu — dil seçicide 2026-07-28'de
// düzeltilmişti ama bu düzeltme yalnızca 4 dile kapsamlıydı, 45 ülkelik
// telefon seçiciye hiç uygulanmamıştı (bu dosya o boşluğu kapatıyor).
//
// KÜTÜPHANE KARARI: `flag-icons` (npm, ~4MB unpacked, TÜM dünya bayrakları)
// KURULMADI — `phoneCountries.ts`'teki AYNI gerekçe burada da geçerli:
// yalnızca 45 ülke gerektiği için orantısız bir bağımlılık olurdu. Bazı
// karmaşık bayraklar (arma/kartal/yıldız takımyıldızı içerenler) bilinçli
// olarak SADELEŞTİRİLDİ (ör. ABD'nin 50 yıldızı yerine temsili birkaç nokta,
// Avustralya/Yeni Zelanda'nın Güney Haçı yıldızları basitleştirildi, Mısır/
// Meksika'nın merkez amblemi çıkarıldı) — bu küçük boyutta (20x14px) zaten
// görünmeyecek detaylar, ülkeyi tanımaya yetecek renk/desen korunuyor.
export type CountryFlagCode =
  | 'TR' | 'US' | 'GB' | 'NL' | 'IT' | 'DE' | 'FR' | 'ES' | 'BE' | 'CH'
  | 'AT' | 'SE' | 'NO' | 'DK' | 'FI' | 'PL' | 'PT' | 'GR' | 'IE' | 'RU'
  | 'UA' | 'RO' | 'BG' | 'CZ' | 'HU' | 'SK' | 'HR' | 'RS' | 'AE' | 'SA'
  | 'QA' | 'KW' | 'IL' | 'EG' | 'MA' | 'ZA' | 'IN' | 'CN' | 'JP' | 'KR'
  | 'AU' | 'NZ' | 'BR' | 'MX' | 'AZ' | 'GE' | 'KZ';

const FLAGS: Record<CountryFlagCode, React.ReactNode> = {
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
  US: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#FFFFFF" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} y={i * (20 / 13)} width="30" height={20 / 13} fill="#B22234" />
      ))}
      <rect width="14" height="10.8" fill="#3C3B6E" />
    </svg>
  ),
  DE: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="6.67" fill="#000000" />
      <rect y="6.67" width="30" height="6.67" fill="#DD0000" />
      <rect y="13.33" width="30" height="6.67" fill="#FFCE00" />
    </svg>
  ),
  FR: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="10" height="20" fill="#002654" />
      <rect x="10" width="10" height="20" fill="#FFFFFF" />
      <rect x="20" width="10" height="20" fill="#ED2939" />
    </svg>
  ),
  ES: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#AA151B" />
      <rect y="5" width="30" height="10" fill="#F1BF00" />
    </svg>
  ),
  BE: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="10" height="20" fill="#000000" />
      <rect x="10" width="10" height="20" fill="#FDDA24" />
      <rect x="20" width="10" height="20" fill="#EF3340" />
    </svg>
  ),
  CH: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#D52B1E" />
      <rect x="12.5" y="5" width="5" height="10" fill="#FFFFFF" />
      <rect x="7.5" y="8.5" width="15" height="3" fill="#FFFFFF" />
    </svg>
  ),
  AT: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="6.67" fill="#ED2939" />
      <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
      <rect y="13.33" width="30" height="6.67" fill="#ED2939" />
    </svg>
  ),
  SE: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#006AA7" />
      <rect x="11" width="3" height="20" fill="#FECC02" />
      <rect y="8.5" width="30" height="3" fill="#FECC02" />
    </svg>
  ),
  NO: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#EF2B2D" />
      <rect x="10.5" width="5" height="20" fill="#FFFFFF" />
      <rect y="7.5" width="30" height="5" fill="#FFFFFF" />
      <rect x="12" width="2" height="20" fill="#002868" />
      <rect y="9" width="30" height="2" fill="#002868" />
    </svg>
  ),
  DK: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#C60C30" />
      <rect x="11" width="3" height="20" fill="#FFFFFF" />
      <rect y="8.5" width="30" height="3" fill="#FFFFFF" />
    </svg>
  ),
  FI: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#FFFFFF" />
      <rect x="11" width="3" height="20" fill="#003580" />
      <rect y="8.5" width="30" height="3" fill="#003580" />
    </svg>
  ),
  PL: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="10" fill="#FFFFFF" />
      <rect y="10" width="30" height="10" fill="#DC143C" />
    </svg>
  ),
  PT: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="12" height="20" fill="#046A38" />
      <rect x="12" width="18" height="20" fill="#DA291C" />
      <circle cx="12" cy="10" r="3.5" fill="#FFCC29" stroke="#FFFFFF" strokeWidth="0.5" />
    </svg>
  ),
  GR: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#0D5EAF" />
      {[0, 2, 4, 6, 8].map((i) => (
        <rect key={i} y={i * (20 / 9)} width="30" height={20 / 9} fill="#FFFFFF" />
      ))}
      <rect width="11" height="11.11" fill="#0D5EAF" />
      <rect x="4.2" width="2.6" height="11.11" fill="#FFFFFF" />
      <rect y="4.25" width="11" height="2.6" fill="#FFFFFF" />
    </svg>
  ),
  IE: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="10" height="20" fill="#169B62" />
      <rect x="10" width="10" height="20" fill="#FFFFFF" />
      <rect x="20" width="10" height="20" fill="#FF883E" />
    </svg>
  ),
  RU: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="6.67" fill="#FFFFFF" />
      <rect y="6.67" width="30" height="6.67" fill="#0039A6" />
      <rect y="13.33" width="30" height="6.67" fill="#D52B1E" />
    </svg>
  ),
  UA: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="10" fill="#0057B7" />
      <rect y="10" width="30" height="10" fill="#FFD700" />
    </svg>
  ),
  RO: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="10" height="20" fill="#002B7F" />
      <rect x="10" width="10" height="20" fill="#FCD116" />
      <rect x="20" width="10" height="20" fill="#CE1126" />
    </svg>
  ),
  BG: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="6.67" fill="#FFFFFF" />
      <rect y="6.67" width="30" height="6.67" fill="#00966E" />
      <rect y="13.33" width="30" height="6.67" fill="#D62612" />
    </svg>
  ),
  CZ: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="10" fill="#FFFFFF" />
      <rect y="10" width="30" height="10" fill="#D7141A" />
      <path d="M0 0l14 10-14 10z" fill="#11457E" />
    </svg>
  ),
  HU: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="6.67" fill="#CE2939" />
      <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
      <rect y="13.33" width="30" height="6.67" fill="#477050" />
    </svg>
  ),
  SK: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="6.67" fill="#FFFFFF" />
      <rect y="6.67" width="30" height="6.67" fill="#0B4EA2" />
      <rect y="13.33" width="30" height="6.67" fill="#EE1C25" />
    </svg>
  ),
  HR: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="6.67" fill="#FF0000" />
      <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
      <rect y="13.33" width="30" height="6.67" fill="#0093DD" />
    </svg>
  ),
  RS: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="6.67" fill="#C6363C" />
      <rect y="6.67" width="30" height="6.67" fill="#0C4076" />
      <rect y="13.33" width="30" height="6.67" fill="#FFFFFF" />
    </svg>
  ),
  AE: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="6.67" fill="#00732F" />
      <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
      <rect y="13.33" width="30" height="6.67" fill="#000000" />
      <rect width="8" height="20" fill="#FF0000" />
    </svg>
  ),
  SA: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#006C35" />
      <rect y="9" width="30" height="1.6" fill="#FFFFFF" />
    </svg>
  ),
  QA: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#8D1B3D" />
      <rect width="9" height="20" fill="#FFFFFF" />
    </svg>
  ),
  KW: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="6.67" fill="#007A3D" />
      <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
      <rect y="13.33" width="30" height="6.67" fill="#CE1126" />
      <rect width="8" height="20" fill="#000000" />
    </svg>
  ),
  IL: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#FFFFFF" />
      <rect y="2.5" width="30" height="2.5" fill="#0038B8" />
      <rect y="15" width="30" height="2.5" fill="#0038B8" />
      <path d="M15 7l2.3 4h-4.6zM15 13l-2.3-4h4.6z" fill="none" stroke="#0038B8" strokeWidth="0.8" />
    </svg>
  ),
  EG: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="6.67" fill="#CE1126" />
      <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
      <rect y="13.33" width="30" height="6.67" fill="#000000" />
    </svg>
  ),
  MA: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#C1272D" />
      <path
        d="M15 7.5l1 2h2.2l-1.8 1.3.7 2.1-1.9-1.4-1.9 1.4.7-2.1-1.8-1.3H14z"
        fill="none"
        stroke="#006233"
        strokeWidth="0.9"
      />
    </svg>
  ),
  ZA: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#FFFFFF" />
      <path d="M0 0l14 10-14 10z" fill="#000000" />
      <path d="M0 0l30 0-16 10 16 10-30 0z" fill="none" />
      <path d="M0 3l11 7-11 7z" fill="#007A4D" />
      <path d="M0 0l16 10-16 10v-3l11-7-11-7z" fill="#DE3831" />
      <path d="M0 20l16-10L0 0" fill="#002395" />
      <path d="M0 6.5l7.5 3.5-7.5 3.5z" fill="#FFB612" />
    </svg>
  ),
  IN: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="6.67" fill="#FF9933" />
      <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
      <rect y="13.33" width="30" height="6.67" fill="#138808" />
      <circle cx="15" cy="10" r="2.2" fill="none" stroke="#000080" strokeWidth="0.5" />
    </svg>
  ),
  CN: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#DE2910" />
      <path d="M6 4l1 3h3l-2.5 2 1 3-2.5-2-2.5 2 1-3-2.5-2h3z" fill="#FFDE00" />
    </svg>
  ),
  JP: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#FFFFFF" />
      <circle cx="15" cy="10" r="5.5" fill="#BC002D" />
    </svg>
  ),
  KR: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#FFFFFF" />
      <path d="M15 5a5 5 0 010 10 2.5 2.5 0 010-5 2.5 2.5 0 000-5z" fill="#CD2E3A" />
      <path d="M15 15a5 5 0 010-10 2.5 2.5 0 010 5 2.5 2.5 0 000 5z" fill="#0047A0" />
    </svg>
  ),
  AU: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#00247D" />
      <path d="M0 0l15 10M15 0L0 10" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="22" cy="6" r="1" fill="#FFFFFF" />
      <circle cx="25" cy="11" r="1" fill="#FFFFFF" />
      <circle cx="21" cy="15" r="1" fill="#FFFFFF" />
      <circle cx="26" cy="16" r="0.8" fill="#FFFFFF" />
    </svg>
  ),
  NZ: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#00247D" />
      <path d="M0 0l15 10M15 0L0 10" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="22" cy="6" r="1.1" fill="#CC142B" />
      <circle cx="26" cy="10" r="1.1" fill="#CC142B" />
      <circle cx="22" cy="15" r="1.1" fill="#CC142B" />
    </svg>
  ),
  BR: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#009B3A" />
      <path d="M15 2.5l12 7.5-12 7.5-12-7.5z" fill="#FEDF00" />
      <circle cx="15" cy="10" r="4" fill="#002776" />
    </svg>
  ),
  MX: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="10" height="20" fill="#006847" />
      <rect x="10" width="10" height="20" fill="#FFFFFF" />
      <rect x="20" width="10" height="20" fill="#CE1126" />
      <circle cx="15" cy="10" r="2" fill="#8B4513" />
    </svg>
  ),
  AZ: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="6.67" fill="#00B5E2" />
      <rect y="6.67" width="30" height="6.67" fill="#EF3340" />
      <rect y="13.33" width="30" height="6.67" fill="#509E2F" />
      <circle cx="14" cy="10" r="3" fill="#FFFFFF" />
      <circle cx="15.2" cy="10" r="2.4" fill="#EF3340" />
    </svg>
  ),
  GE: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#FFFFFF" />
      <rect x="12.5" width="5" height="20" fill="#FF0000" />
      <rect y="7.5" width="30" height="5" fill="#FF0000" />
      <rect x="4" y="2.5" width="2.4" height="2.4" fill="#FF0000" />
      <rect x="23.6" y="2.5" width="2.4" height="2.4" fill="#FF0000" />
      <rect x="4" y="15.1" width="2.4" height="2.4" fill="#FF0000" />
      <rect x="23.6" y="15.1" width="2.4" height="2.4" fill="#FF0000" />
    </svg>
  ),
  KZ: (
    <svg viewBox="0 0 30 20" width="20" height="14" aria-hidden="true">
      <rect width="30" height="20" fill="#00AFCA" />
      <circle cx="15" cy="9" r="3.2" fill="#FEC50C" />
      <rect x="2" width="2" height="20" fill="#FEC50C" />
    </svg>
  ),
};

export default function CountryFlagIcon({ code }: { code: CountryFlagCode }) {
  return <span className="inline-flex shrink-0 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">{FLAGS[code]}</span>;
}
