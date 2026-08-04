// Telefon alanı ülke kodu seçici — HeroForm.tsx (+ PanelFeatureSection'daki
// 2. form, PresentationRequestPage, ContactPage — hepsi aynı component'i
// paylaşıyor). idenfit.com 4 dilde (TR/EN/NL/IT) hizmet verdiği için
// kullanıcı yalnızca Türkiye'den değil, başka ülkelerden de başvurabilmeli
// (2026-07-27, kullanıcı isteği).
//
// KÜTÜPHANE KARARI: `react-phone-number-input`/`libphonenumber-js` gibi bir
// paket KURULMADI — bilinçli tercih. Gerekçe: (1) bu proje boyunca
// benzer durumlarda (bkz. CLAUDE.md "Telefon alanına giriş kısıtlamaları"
// günlüğü, 2026-07-27) hep aynı ilke izlendi — `intl-tel-input`
// kütüphanesi kaynakta bile var olsa, TR-öncelikli basit bir validasyon
// yeterliyse yeni bağımlılık eklenmedi. (2) `libphonenumber-js`'in tam
// meta verisi (~140KB min) bir lead-capture formu için orantısız ağır.
// (3) Kullanıcı da "sen karar ver" diyerek iki seçeneği açık bırakmıştı.
// Bu dosyadaki liste + yardımcı fonksiyonlar, kütüphanenin sağladığı
// temel değeri (ülke seçimi + kaba uzunluk doğrulama + biçimlendirme)
// sıfır ek bağımlılıkla karşılıyor.

import type { Locale } from './nav';

export interface CountryPhoneDef {
  /** ISO 3166-1 alpha-2 (bayrak emoji + eşleştirme için). */
  iso: string;
  /** Kullanıcıya gösterilen ülke adı — 4 dilin hepsinde.
   *
   * ⚠️ BULUNAN BUG (2026-07-27, aynı gün ikinci tur): bu alan önceden
   * `string` idi ve TÜM ülke adları sabit TÜRKÇE yazılmıştı ("Türkiye",
   * "Almanya", "Fransa"...) — `PhoneCountrySelect.tsx` locale'e bakmadan
   * doğrudan bu metni gösteriyordu. Sonuç: EN/NL/IT sitelerinde telefon
   * ülke kodu dropdown'unu açan HERHANGİ bir kullanıcı (Hero formu, Destek
   * Talebi, İletişim, Online Sunum Talebi — hepsi bu component'i
   * paylaşıyor) 45 ülke adının TAMAMINI Türkçe görüyordu. Kullanıcı
   * "Destek Talebi'nde TR kelime kaldı mı" diye sorunca bulundu — asıl
   * sorun tek bir sayfada değil, PAYLAŞILAN component'teydi. Düzeltme:
   * `Record<Locale, string>`'e çevrildi, 45 ülkenin 4 dildeki gerçek adı
   * yazıldı. */
  name: Record<Locale, string>;
  /** Ülke kodu, `+` işareti OLMADAN (ör. "90"). */
  dialCode: string;
  /** Yerel numaranın (ülke kodu hariç) beklenen hane aralığı. Çoğu ülke
   * için tek bir yaygın değer kullanıldı — bu alan hukuki/teknik bir
   * doğrulama değil, kaba bir kullanıcı-deneyimi kontrolü (kullanıcının
   * isteğiyle: "genel bir minimum/maksimum aralığı kullanılsın"). */
  minLength: number;
  maxLength: number;
}

/** Türkiye özel durum: `isValidPhoneForCountry()`'de tam 10 hane + `5` ile
 * başlama kuralı korunuyor (2026-07-27'nin önceki turunda doğrulanmış,
 * kaynağa en yakın/en sık kullanılan pazar). Diğer tüm ülkeler için yalnızca
 * min/max hane aralığı kontrol edilir. */
export const TR_DIAL_CODE = '90';

// Yaygın ~45 ülke — kullanıcının açıkça istediği 5'i (TR/US/GB/NL/IT) +
// idenfit'in muhtemel hedef pazarlarını (AB, Orta Doğu, komşu bölgeler)
// makul ölçüde kapsayan bir liste. Hane aralıkları ITU/ülke telekom
// otoritelerinin yaygın bilinen ulusal numara uzunluklarına dayanır —
// kesin/yasal bir kaynak DEĞİL, kaba bir UX kontrolü (bkz. yukarıdaki not).
export const COUNTRY_PHONE_CODES: CountryPhoneDef[] = [
  { iso: 'TR', name: { tr: 'Türkiye', en: 'Turkey', nl: 'Turkije', it: 'Turchia' }, dialCode: '90', minLength: 10, maxLength: 10 },
  { iso: 'US', name: { tr: 'Amerika Birleşik Devletleri', en: 'United States', nl: 'Verenigde Staten', it: 'Stati Uniti' }, dialCode: '1', minLength: 10, maxLength: 10 },
  { iso: 'GB', name: { tr: 'Birleşik Krallık', en: 'United Kingdom', nl: 'Verenigd Koninkrijk', it: 'Regno Unito' }, dialCode: '44', minLength: 9, maxLength: 10 },
  { iso: 'NL', name: { tr: 'Hollanda', en: 'Netherlands', nl: 'Nederland', it: 'Paesi Bassi' }, dialCode: '31', minLength: 9, maxLength: 9 },
  { iso: 'IT', name: { tr: 'İtalya', en: 'Italy', nl: 'Italië', it: 'Italia' }, dialCode: '39', minLength: 9, maxLength: 10 },
  { iso: 'DE', name: { tr: 'Almanya', en: 'Germany', nl: 'Duitsland', it: 'Germania' }, dialCode: '49', minLength: 10, maxLength: 11 },
  { iso: 'FR', name: { tr: 'Fransa', en: 'France', nl: 'Frankrijk', it: 'Francia' }, dialCode: '33', minLength: 9, maxLength: 9 },
  { iso: 'ES', name: { tr: 'İspanya', en: 'Spain', nl: 'Spanje', it: 'Spagna' }, dialCode: '34', minLength: 9, maxLength: 9 },
  { iso: 'BE', name: { tr: 'Belçika', en: 'Belgium', nl: 'België', it: 'Belgio' }, dialCode: '32', minLength: 8, maxLength: 9 },
  { iso: 'CH', name: { tr: 'İsviçre', en: 'Switzerland', nl: 'Zwitserland', it: 'Svizzera' }, dialCode: '41', minLength: 9, maxLength: 9 },
  { iso: 'AT', name: { tr: 'Avusturya', en: 'Austria', nl: 'Oostenrijk', it: 'Austria' }, dialCode: '43', minLength: 10, maxLength: 11 },
  { iso: 'SE', name: { tr: 'İsveç', en: 'Sweden', nl: 'Zweden', it: 'Svezia' }, dialCode: '46', minLength: 9, maxLength: 9 },
  { iso: 'NO', name: { tr: 'Norveç', en: 'Norway', nl: 'Noorwegen', it: 'Norvegia' }, dialCode: '47', minLength: 8, maxLength: 8 },
  { iso: 'DK', name: { tr: 'Danimarka', en: 'Denmark', nl: 'Denemarken', it: 'Danimarca' }, dialCode: '45', minLength: 8, maxLength: 8 },
  { iso: 'FI', name: { tr: 'Finlandiya', en: 'Finland', nl: 'Finland', it: 'Finlandia' }, dialCode: '358', minLength: 9, maxLength: 10 },
  { iso: 'PL', name: { tr: 'Polonya', en: 'Poland', nl: 'Polen', it: 'Polonia' }, dialCode: '48', minLength: 9, maxLength: 9 },
  { iso: 'PT', name: { tr: 'Portekiz', en: 'Portugal', nl: 'Portugal', it: 'Portogallo' }, dialCode: '351', minLength: 9, maxLength: 9 },
  { iso: 'GR', name: { tr: 'Yunanistan', en: 'Greece', nl: 'Griekenland', it: 'Grecia' }, dialCode: '30', minLength: 10, maxLength: 10 },
  { iso: 'IE', name: { tr: 'İrlanda', en: 'Ireland', nl: 'Ierland', it: 'Irlanda' }, dialCode: '353', minLength: 9, maxLength: 9 },
  { iso: 'RU', name: { tr: 'Rusya', en: 'Russia', nl: 'Rusland', it: 'Russia' }, dialCode: '7', minLength: 10, maxLength: 10 },
  { iso: 'UA', name: { tr: 'Ukrayna', en: 'Ukraine', nl: 'Oekraïne', it: 'Ucraina' }, dialCode: '380', minLength: 9, maxLength: 9 },
  { iso: 'RO', name: { tr: 'Romanya', en: 'Romania', nl: 'Roemenië', it: 'Romania' }, dialCode: '40', minLength: 9, maxLength: 9 },
  { iso: 'BG', name: { tr: 'Bulgaristan', en: 'Bulgaria', nl: 'Bulgarije', it: 'Bulgaria' }, dialCode: '359', minLength: 8, maxLength: 9 },
  { iso: 'CZ', name: { tr: 'Çekya', en: 'Czechia', nl: 'Tsjechië', it: 'Repubblica Ceca' }, dialCode: '420', minLength: 9, maxLength: 9 },
  { iso: 'HU', name: { tr: 'Macaristan', en: 'Hungary', nl: 'Hongarije', it: 'Ungheria' }, dialCode: '36', minLength: 8, maxLength: 9 },
  { iso: 'SK', name: { tr: 'Slovakya', en: 'Slovakia', nl: 'Slowakije', it: 'Slovacchia' }, dialCode: '421', minLength: 9, maxLength: 9 },
  { iso: 'HR', name: { tr: 'Hırvatistan', en: 'Croatia', nl: 'Kroatië', it: 'Croazia' }, dialCode: '385', minLength: 8, maxLength: 9 },
  { iso: 'RS', name: { tr: 'Sırbistan', en: 'Serbia', nl: 'Servië', it: 'Serbia' }, dialCode: '381', minLength: 8, maxLength: 9 },
  { iso: 'AE', name: { tr: 'Birleşik Arap Emirlikleri', en: 'United Arab Emirates', nl: 'Verenigde Arabische Emiraten', it: 'Emirati Arabi Uniti' }, dialCode: '971', minLength: 8, maxLength: 9 },
  { iso: 'SA', name: { tr: 'Suudi Arabistan', en: 'Saudi Arabia', nl: 'Saoedi-Arabië', it: 'Arabia Saudita' }, dialCode: '966', minLength: 8, maxLength: 9 },
  { iso: 'QA', name: { tr: 'Katar', en: 'Qatar', nl: 'Qatar', it: 'Qatar' }, dialCode: '974', minLength: 7, maxLength: 8 },
  { iso: 'KW', name: { tr: 'Kuveyt', en: 'Kuwait', nl: 'Koeweit', it: 'Kuwait' }, dialCode: '965', minLength: 7, maxLength: 8 },
  { iso: 'IL', name: { tr: 'İsrail', en: 'Israel', nl: 'Israël', it: 'Israele' }, dialCode: '972', minLength: 8, maxLength: 9 },
  { iso: 'EG', name: { tr: 'Mısır', en: 'Egypt', nl: 'Egypte', it: 'Egitto' }, dialCode: '20', minLength: 9, maxLength: 10 },
  { iso: 'MA', name: { tr: 'Fas', en: 'Morocco', nl: 'Marokko', it: 'Marocco' }, dialCode: '212', minLength: 9, maxLength: 9 },
  { iso: 'ZA', name: { tr: 'Güney Afrika', en: 'South Africa', nl: 'Zuid-Afrika', it: 'Sudafrica' }, dialCode: '27', minLength: 9, maxLength: 9 },
  { iso: 'IN', name: { tr: 'Hindistan', en: 'India', nl: 'India', it: 'India' }, dialCode: '91', minLength: 10, maxLength: 10 },
  { iso: 'CN', name: { tr: 'Çin', en: 'China', nl: 'China', it: 'Cina' }, dialCode: '86', minLength: 11, maxLength: 11 },
  { iso: 'JP', name: { tr: 'Japonya', en: 'Japan', nl: 'Japan', it: 'Giappone' }, dialCode: '81', minLength: 9, maxLength: 10 },
  { iso: 'KR', name: { tr: 'Güney Kore', en: 'South Korea', nl: 'Zuid-Korea', it: 'Corea del Sud' }, dialCode: '82', minLength: 9, maxLength: 10 },
  { iso: 'AU', name: { tr: 'Avustralya', en: 'Australia', nl: 'Australië', it: 'Australia' }, dialCode: '61', minLength: 9, maxLength: 9 },
  { iso: 'NZ', name: { tr: 'Yeni Zelanda', en: 'New Zealand', nl: 'Nieuw-Zeeland', it: 'Nuova Zelanda' }, dialCode: '64', minLength: 8, maxLength: 9 },
  { iso: 'BR', name: { tr: 'Brezilya', en: 'Brazil', nl: 'Brazilië', it: 'Brasile' }, dialCode: '55', minLength: 10, maxLength: 11 },
  { iso: 'MX', name: { tr: 'Meksika', en: 'Mexico', nl: 'Mexico', it: 'Messico' }, dialCode: '52', minLength: 10, maxLength: 10 },
  { iso: 'AZ', name: { tr: 'Azerbaycan', en: 'Azerbaijan', nl: 'Azerbeidzjan', it: 'Azerbaigian' }, dialCode: '994', minLength: 9, maxLength: 9 },
  { iso: 'GE', name: { tr: 'Gürcistan', en: 'Georgia', nl: 'Georgië', it: 'Georgia' }, dialCode: '995', minLength: 9, maxLength: 9 },
  { iso: 'KZ', name: { tr: 'Kazakistan', en: 'Kazakhstan', nl: 'Kazachstan', it: 'Kazakistan' }, dialCode: '7', minLength: 10, maxLength: 10 },
];

export function findCountryByIso(iso: string): CountryPhoneDef {
  return COUNTRY_PHONE_CODES.find((c) => c.iso === iso) ?? COUNTRY_PHONE_CODES[0];
}

/** Site diline göre makul bir varsayılan ülke — kullanıcının önerdiği
 * eşleme birebir uygulandı (TR→TR, EN→GB, NL→NL, IT→IT). */
export function getDefaultCountryForLocale(locale: Locale): CountryPhoneDef {
  const isoByLocale: Record<Locale, string> = { tr: 'TR', en: 'GB', nl: 'NL', it: 'IT' };
  return findCountryByIso(isoByLocale[locale]);
}

/** Rakam olmayan her karakteri kaldırır. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/** Ham girdiyi normalize eder: rakam-dışını temizler, baştaki tek `0`'ı
 * atar (çoğu ülkede yerel/trunk numaralandırma kuralı — ülke kodu
 * kullanılınca `0` düşer), seçili ülkenin azami hanesiyle sınırlar. */
export function normalizePhoneDigits(raw: string, country: CountryPhoneDef): string {
  let digits = digitsOnly(raw);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, country.maxLength);
}

/** Görsel gruplama. TR için kaynakta doğrulanmış `3-3-2-2` deseni
 * korunuyor (ör. `555 123 45 67`); diğer ülkeler için basit, evrensel
 * 3'lü gruplama kullanılıyor (ör. `123 456 789`) — kaynakta her ülke
 * için ayrı bir biçim yok, bu genel/basit bir UX kararı. */
export function formatPhoneDigits(digits: string, country: CountryPhoneDef): string {
  if (country.dialCode === TR_DIAL_CODE) {
    return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)].filter(Boolean).join(' ');
  }
  return (digits.match(/.{1,3}/g) ?? []).join(' ');
}

/** Geçerlilik kontrolü. TR için (önceki turda doğrulanmış) tam 10 hane +
 * `5` ile başlama kuralı korunuyor; diğer ülkeler için yalnızca
 * min/max hane aralığı kontrol edilir (kullanıcı isteği: "genel bir
 * minimum/maksimum aralığı kullanılsın"). */
export function isValidPhoneForCountry(digits: string, country: CountryPhoneDef): boolean {
  if (country.dialCode === TR_DIAL_CODE) {
    return /^5\d{9}$/.test(digits);
  }
  return digits.length >= country.minLength && digits.length <= country.maxLength;
}
