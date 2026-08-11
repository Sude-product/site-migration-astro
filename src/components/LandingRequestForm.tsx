import { useState } from 'react';
import PhoneCountrySelect from './PhoneCountrySelect.tsx';
import {
  formatPhoneDigits,
  getDefaultCountryForLocale,
  isValidPhoneForCountry,
  normalizePhoneDigits,
  type CountryPhoneDef,
} from '../data/phoneCountries';
import type { Locale } from '../data/nav';

interface FormData {
  fullName: string;
  email: string;
  /** Bkz. `HeroForm.tsx`'teki AYNI alan yorumu — yalnızca normalize
   * edilmiş rakamlar, görünen biçim `formatPhoneDigits()` ile türetilir. */
  phone: string;
  company: string;
}

const EMPTY: FormData = { fullName: '', email: '', phone: '', company: '' };

export interface KvkkNoticeLabels {
  prefix: string;
  kvkkLinkText: string;
  middle: string;
  termsLinkText: string;
  suffix: string;
}

export interface LandingFormLabels {
  fullName: string;
  email: string;
  phone: string;
  phoneError: string;
  phoneCountryLabel: string;
  phoneCountrySearchPlaceholder: string;
  phoneCountryNoResults: string;
  company: string;
  /** Adım 1'in devam butonu ("Devam Et"). */
  next: string;
  /** Adım 2'den Adım 1'e dönüş linki ("Geri"). */
  back: string;
  /** Adım 2'nin nihai gönder butonu ("Gönder"). */
  submit: string;
  /** Site genelindeki formların (bkz. `HeroForm.tsx`) kullandığı AYNI,
   * zaten onaylı KVKK/Kullanım Koşulları metni — yeni bir hukuki metin
   * yazılmadı, `t.hero.kvkkNotice` doğrudan yeniden kullanılıyor. */
  kvkkNotice: KvkkNoticeLabels;
}

export interface LandingRequestFormProps {
  labels: LandingFormLabels;
  kvkkHref: string;
  termsHref: string;
  /** Telefon ülke kodu seçicinin varsayılan ülkesini belirler (bkz.
   * `HeroForm.tsx`'teki AYNI kullanım, `getDefaultCountryForLocale()`). */
  locale: Locale;
  idPrefix?: string;
}

// Landing Page (reklam trafiği, `/demo`) — 2 adımlı form: Adım 1 (ad soyad
// + e-posta) → Adım 2 (telefon + şirket). Telefon doğrulama/formatlama
// mantığı `HeroForm.tsx` ile AYNI paylaşılan `phoneCountries.ts`
// yardımcılarını kullanıyor, kod tekrarı yok.
//
// Gerçek backend YOK (Faz 2 TODO, değişmedi) — Adım 2 gönderiminde
// `HrMaturityTest.tsx`'teki `EmailReportForm`'un kullandığı AYNI dürüst
// desen uygulanıyor: veriyi `console.log`'la, ardından "raporunuz
// gönderildi" gibi YANLIŞ bir başarı iması YARATMADAN mevcut, genel
// `/tesekkurler/` sayfasına yönlendir (bkz. CLAUDE.md 2026-08-06 planı).
export default function LandingRequestForm({ labels, kvkkHref, termsHref, locale, idPrefix = 'landing' }: LandingRequestFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [data, setData] = useState<FormData>(EMPTY);
  const [country, setCountry] = useState<CountryPhoneDef>(() => getDefaultCountryForLocale(locale));
  // Adım 1'de zorunlu alanlar tarayıcının kendi `required` doğrulamasına
  // bırakılıyor (HeroForm'daki gibi) — bu bayrak yalnızca Adım 2'nin
  // telefon hatasını (tarayıcı doğrulayamadığı için) kontrol ediyor.
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const update = (field: 'fullName' | 'email' | 'company') => (e: React.ChangeEvent<HTMLInputElement>) =>
    setData((d) => ({ ...d, [field]: e.target.value }));

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((d) => ({ ...d, phone: normalizePhoneDigits(e.target.value, country) }));
  };

  const handleCountryChange = (next: CountryPhoneDef) => {
    setCountry(next);
    setData((d) => ({ ...d, phone: normalizePhoneDigits(d.phone, next) }));
  };

  const phoneValid = isValidPhoneForCountry(data.phone, country);
  const showPhoneError = attemptedSubmit && !phoneValid;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 1) {
      // fullName/email zaten `required`/`type=email` ile tarayıcı
      // tarafından doğrulanmadan buraya ulaşılamaz.
      setStep(2);
      return;
    }
    setAttemptedSubmit(true);
    if (!phoneValid) return; // eksik/yanlış telefon — gönderme, hata görünür kalır.
    console.log('Landing page form gönderildi:', { ...data, phone: `+${country.dialCode}${data.phone}` });
    window.location.href = '/tesekkurler/';
  };

  const inputClass =
    'w-full rounded-full border border-[#DDDDDD] bg-white px-6 py-3 text-base font-normal text-heading placeholder:text-muted transition-colors focus:border-brand focus:outline-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-label={step === 1 ? labels.next : labels.submit}>
      {step === 1 ? (
        <>
          <div>
            <label htmlFor={`${idPrefix}-fullName`} className="sr-only">
              {labels.fullName}
            </label>
            <input
              id={`${idPrefix}-fullName`}
              name="fullName"
              type="text"
              required
              value={data.fullName}
              onChange={update('fullName')}
              placeholder={labels.fullName}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-email`} className="sr-only">
              {labels.email}
            </label>
            <input
              id={`${idPrefix}-email`}
              name="email"
              type="email"
              required
              value={data.email}
              onChange={update('email')}
              placeholder={labels.email}
              className={inputClass}
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label htmlFor={`${idPrefix}-phone`} className="sr-only">
              {labels.phone}
            </label>
            <div
              className={`flex items-stretch rounded-full border bg-white transition-colors ${
                showPhoneError ? 'border-red-500' : 'border-[#DDDDDD] focus-within:border-brand'
              }`}
            >
              <input
                id={`${idPrefix}-phone`}
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                required
                value={formatPhoneDigits(data.phone, country)}
                onChange={handlePhoneChange}
                placeholder={labels.phone}
                aria-invalid={showPhoneError}
                aria-describedby={showPhoneError ? `${idPrefix}-phone-error` : undefined}
                className="w-full rounded-full bg-white px-6 py-3 text-base font-normal text-heading placeholder:text-muted focus:outline-none"
              />
              <PhoneCountrySelect
                value={country}
                onChange={handleCountryChange}
                idPrefix={idPrefix}
                hasError={showPhoneError}
                ariaLabel={labels.phoneCountryLabel}
                searchPlaceholder={labels.phoneCountrySearchPlaceholder}
                noResultsText={labels.phoneCountryNoResults}
                locale={locale}
              />
            </div>
            {showPhoneError && (
              <p id={`${idPrefix}-phone-error`} role="alert" className="mt-1 text-xs text-red-600">
                {labels.phoneError}
              </p>
            )}
          </div>
          <div>
            <label htmlFor={`${idPrefix}-company`} className="sr-only">
              {labels.company}
            </label>
            <input
              id={`${idPrefix}-company`}
              name="company"
              type="text"
              required
              value={data.company}
              onChange={update('company')}
              placeholder={labels.company}
              className={inputClass}
            />
          </div>
        </>
      )}

      {/* `.btn-cta btn-cta-form` — site genelindeki form submit butonlarıyla
          (bkz. `HeroForm.tsx`'in `underline` varyantı) AYNI paylaşılan sınıf,
          yeni bir buton stili icat edilmedi. */}
      <button type="submit" className="btn-cta btn-cta-form w-full px-6 py-3">
        {step === 1 ? labels.next : labels.submit}
      </button>

      {step === 2 && (
        <button
          type="button"
          onClick={() => setStep(1)}
          className="w-full text-center text-sm text-muted underline transition-colors hover:text-brand"
        >
          {labels.back}
        </button>
      )}

      <p className="text-xs leading-relaxed text-muted">
        {labels.kvkkNotice.prefix}
        <a href={kvkkHref} target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-brand">
          {labels.kvkkNotice.kvkkLinkText}
        </a>
        {labels.kvkkNotice.middle}
        <a href={termsHref} target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-brand">
          {labels.kvkkNotice.termsLinkText}
        </a>
        {labels.kvkkNotice.suffix}
      </p>
    </form>
  );
}
