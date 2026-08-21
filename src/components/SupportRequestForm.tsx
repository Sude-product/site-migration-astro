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
  phone: string;
  email: string;
  company: string;
  message: string;
}

const EMPTY: FormData = { fullName: '', phone: '', email: '', company: '', message: '' };

/** Destek Talebi formunun onay metni — kaynakta HeroForm'un tek satırlık
 * (2 linkli) yapısından FARKLI: TR'de kaynakta GERÇEKTEN 2. bir satır var
 * ("Ayrıntılı bilgi için KVKK sayfamızı ziyaret edebilirsiniz.", 3. bir
 * KVKK linkiyle) — EN/IT'de bu 2. satır kaynakta YOK, yalnızca 1 satır
 * (2026-07-27, canlı 3 dilin `content.rendered`'ı karşılaştırılarak
 * doğrulandı). `secondLine` bu yüzden opsiyonel. */
export interface SupportKvkkNoticeLabels {
  prefix: string;
  kvkkLinkText: string;
  middle: string;
  termsLinkText: string;
  suffix: string;
  secondLine?: {
    prefix: string;
    kvkkLinkText: string;
    suffix: string;
  };
}

export interface SupportRequestFormLabels {
  name: string;
  phone: string;
  phoneError: string;
  phoneCountryLabel: string;
  phoneCountrySearchPlaceholder: string;
  phoneCountryNoResults: string;
  email: string;
  company: string;
  message: string;
  submit: string;
  kvkkNotice: SupportKvkkNoticeLabels;
}

export interface SupportRequestFormProps {
  labels: SupportRequestFormLabels;
  idPrefix?: string;
  /** Ülke kodu seçicinin varsayılan ülkesi için (bkz. HeroForm.tsx'teki
   * aynı mekanizma, 2026-07-27). */
  locale: Locale;
  kvkkHref: string;
  termsHref: string;
}

// idenfit.com Destek Talebi formu (`/destek-talebi/`) — HeroForm.tsx'ten
// BİLİNÇLİ olarak AYRI bir component: kaynakta tamamen farklı stillenmiş
// (dolu açık gri input `#F5F5F5`, `13px` köşe — HeroForm'un beyaz/`3px`
// stilinden farklı, 2026-07-27'de canlı sitede Playwright ile ölçüldü),
// bir `textarea` alanı var, ve buton YEŞİL (`#60A344`) — sitenin geri
// kalanındaki kırmızı CTA konvansiyonunun kaynaktaki BİLİNÇLİ istisnası
// (kullanıcı isteğiyle olduğu gibi korundu). Telefon alanının ülke kodu
// seçicisi HeroForm'la AYNI paylaşılan altyapıyı (`phoneCountries.ts`,
// `PhoneCountrySelect.tsx`) kullanıyor — kod tekrarı yok.
//
// NOT: submit şimdilik yalnızca console.log — backend/CRM entegrasyonu
// Faz 2'de yapılacak (bkz. CLAUDE.md "Açık noktalar" madde 2, HeroForm'la
// aynı TODO).
export default function SupportRequestForm({ labels, idPrefix = 'sr', locale, kvkkHref, termsHref }: SupportRequestFormProps) {
  const [data, setData] = useState<FormData>(EMPTY);
  const [country, setCountry] = useState<CountryPhoneDef>(() => getDefaultCountryForLocale(locale));
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const update = (field: 'fullName' | 'email' | 'company' | 'message') =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
    setAttemptedSubmit(true);
    if (!phoneValid) return;
    // TODO: backend entegrasyonu — şimdilik sadece logla.
    console.log('Destek talebi gönderildi:', { ...data, phone: `+${country.dialCode}${data.phone}` });
  };

  // Kaynağın kendi input stili: dolu açık gri (`#F5F5F5`), ince açık
  // kenarlık (`#E4E4E4`), `13px` köşe, `17px 24px` padding — HeroForm'un
  // beyaz/`3px`/`rgba(0,0,0,.6)` stilinden BİLİNÇLİ olarak farklı (bu
  // sayfanın kaynaktaki kendi tasarımı, birebir ölçüldü).
  const inputClass =
    'w-full rounded-[13px] border border-[#E4E4E4] bg-[#F5F5F5] px-6 py-4 text-sm text-heading placeholder:text-muted transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label={labels.submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-fullName`} className="sr-only">{labels.name}</label>
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
        <div>
          <label htmlFor={`${idPrefix}-phone`} className="sr-only">{labels.phone}</label>
          <div
            className={`flex items-stretch rounded-[13px] border bg-[#F5F5F5] transition-colors focus-within:ring-2 ${
              showPhoneError
                ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20'
                : 'border-[#E4E4E4] focus-within:border-brand focus-within:ring-brand/20'
            }`}
          >
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
              className="w-full bg-transparent px-6 py-4 text-sm text-heading placeholder:text-muted focus:outline-none"
            />
          </div>
          {showPhoneError && (
            <p id={`${idPrefix}-phone-error`} role="alert" className="mt-1 text-xs text-red-600">
              {labels.phoneError}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${idPrefix}-email`} className="sr-only">{labels.email}</label>
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
          <label htmlFor={`${idPrefix}-company`} className="sr-only">{labels.company}</label>
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
      </div>

      <div>
        <label htmlFor={`${idPrefix}-message`} className="sr-only">{labels.message}</label>
        <textarea
          id={`${idPrefix}-message`}
          name="message"
          required
          rows={5}
          value={data.message}
          onChange={update('message')}
          placeholder={labels.message}
          className={`${inputClass} resize-y`}
        />
      </div>

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
        {labels.kvkkNotice.secondLine && (
          <>
            <br />
            {labels.kvkkNotice.secondLine.prefix}
            <a href={kvkkHref} target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-brand">
              {labels.kvkkNotice.secondLine.kvkkLinkText}
            </a>
            {labels.kvkkNotice.secondLine.suffix}
          </>
        )}
      </p>

      {/* Buton BİLİNÇLİ olarak yeşil (`#60A344`) — kaynakta birebir bu
          renk, sitenin geri kalanındaki kırmızı CTA'lardan FARKLI, kullanıcı
          isteğiyle olduğu gibi korundu (2026-07-27, Playwright ile ölçüldü). */}
      <button
        type="submit"
        className="w-full rounded-[13px] bg-[#60A344] px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
      >
        {labels.submit}
      </button>
    </form>
  );
}
