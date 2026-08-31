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
import type { KvkkNoticeLabels } from '../i18n/types';

interface FormData {
  email: string;
  company: string;
  phone: string;
  fullName: string;
}

const EMPTY: FormData = { email: '', company: '', phone: '', fullName: '' };

export interface PresentationFormLabels {
  email: string;
  company: string;
  phone: string;
  phoneError: string;
  phoneCountryLabel: string;
  phoneCountrySearchPlaceholder: string;
  phoneCountryNoResults: string;
  name: string;
  next: string;
  back: string;
  submit: string;
  kvkkNotice: KvkkNoticeLabels;
}

export interface PresentationRequestFormProps {
  labels: PresentationFormLabels;
  kvkkHref: string;
  termsHref: string;
  locale: Locale;
  /** Gönderim sonrası yönlendirilecek, locale-doğru "Teşekkürler" URL'i
   * (`getThankYouLocaleUrls()`'ten). */
  redirectHref: string;
  idPrefix?: string;
}

// Online Sunum Talebi formu (2026-08-29 yeniden tasarım) — 2 adım: Adım 1
// (e-posta + firma adı) → Adım 2 (telefon + ad soyad). `LandingRequestForm.tsx`
// ile AYNI iskelet/telefon doğrulama mantığı (`phoneCountries.ts`), yalnızca
// alan GRUBU ve sırası farklı (kullanıcı talimatı, 2026-08-29). Gerçek
// backend YOK (Faz 2 TODO) — `LandingRequestForm.tsx`'in KENDİSİNİN zaten
// kullandığı AYNI dürüst desen: veriyi `console.log`'la, mevcut/genel
// teşekkür sayfasına yönlendir (yeni bir "başarılı" iması UYDURULMADI).
export default function PresentationRequestForm({
  labels,
  kvkkHref,
  termsHref,
  locale,
  redirectHref,
  idPrefix = 'presentation',
}: PresentationRequestFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [data, setData] = useState<FormData>(EMPTY);
  const [country, setCountry] = useState<CountryPhoneDef>(() => getDefaultCountryForLocale(locale));
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const update = (field: 'email' | 'company' | 'fullName') => (e: React.ChangeEvent<HTMLInputElement>) =>
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
      setStep(2);
      return;
    }
    setAttemptedSubmit(true);
    if (!phoneValid) return;
    console.log('Online Sunum Talebi formu gönderildi:', { ...data, phone: `+${country.dialCode}${data.phone}` });
    window.location.href = redirectHref;
  };

  const inputClass =
    'w-full rounded-full border-2 border-brand bg-white px-6 py-3 text-base font-normal text-heading placeholder:text-muted transition-colors focus:outline-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-label={step === 1 ? labels.next : labels.submit}>
      {step === 1 ? (
        <>
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
      ) : (
        <>
          <div>
            <label htmlFor={`${idPrefix}-phone`} className="sr-only">
              {labels.phone}
            </label>
            <div
              className={`flex items-stretch rounded-full border-2 bg-white transition-colors ${
                showPhoneError ? 'border-red-500' : 'border-brand'
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
            <label htmlFor={`${idPrefix}-fullName`} className="sr-only">
              {labels.name}
            </label>
            <input
              id={`${idPrefix}-fullName`}
              name="fullName"
              type="text"
              required
              value={data.fullName}
              onChange={update('fullName')}
              placeholder={labels.name}
              className={inputClass}
            />
          </div>
        </>
      )}

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
