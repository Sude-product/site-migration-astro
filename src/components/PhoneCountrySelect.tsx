import { useEffect, useMemo, useRef, useState } from 'react';
import { COUNTRY_PHONE_CODES, type CountryPhoneDef } from '../data/phoneCountries';
import CountryFlagIcon, { type CountryFlagCode } from './icons/CountryFlagIcon.tsx';
import type { Locale } from '../data/nav';

export interface PhoneCountrySelectProps {
  value: CountryPhoneDef;
  onChange: (country: CountryPhoneDef) => void;
  /** `<label htmlFor>` çakışmasını önlemek için (HeroForm.tsx'in
   * `idPrefix`'iyle aynı desen — aynı sayfada birden fazla form olabilir). */
  idPrefix: string;
  /** Kapsayan grubun kırmızı hata durumuna göre kenarlık rengi. */
  hasError: boolean;
  /** Erişilebilir etiket (ekran okuyucular için, buton görsel olarak
   * yalnızca bayrak+kod gösteriyor). */
  ariaLabel: string;
  /** i18n'den — component'te dile özel hardcoded string yok (projenin
   * genel kuralı, bkz. HeroForm.tsx). */
  searchPlaceholder: string;
  noResultsText: string;
  /** Ülke adlarının hangi dilde gösterileceği (bkz. `phoneCountries.ts`'teki
   * `CountryPhoneDef.name` — 2026-07-27'de bulunan gerçek bug: bu alan
   * önceden sabit Türkçe idi, artık `Record<Locale,string>`). */
  locale: Locale;
}

// Ülke kodu seçici — `LanguageSwitcher.tsx`'teki AYNI desen (buton + dışarı
// tıklayınca/Esc ile kapanan liste, bkz. o dosyadaki yorum) burada da
// kullanıldı, tutarlılık için. Ek olarak bir arama kutusu var (kullanıcı
// isteği: "arama/scroll ile diğerleri").
export default function PhoneCountrySelect({
  value,
  onChange,
  idPrefix,
  hasError,
  ariaLabel,
  searchPlaceholder,
  noResultsText,
  locale,
}: PhoneCountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Aktif dile göre alfabetik sıralı liste — her dilde farklı sıralanır
  // (ör. TR "Amerika Birleşik Devletleri" A'da, EN "United States" U'da).
  const countriesInLocale = useMemo(
    () => [...COUNTRY_PHONE_CODES].sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale)),
    [locale],
  );

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    // Açılınca arama kutusuna odaklan — klavye kullanıcıları direkt yazmaya başlayabilir.
    searchRef.current?.focus();
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? countriesInLocale.filter(
        (c) => c.name[locale].toLowerCase().includes(normalizedQuery) || c.dialCode.includes(normalizedQuery.replace(/^\+/, '')),
      )
    : countriesInLocale;

  const select = (country: CountryPhoneDef) => {
    onChange(country);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={rootRef} className="relative">
      {/* 2026-08-03: gerçek SVG bayrak (`CountryFlagIcon`, `flagEmoji()`
          Unicode emoji'sinin YERİNE — bkz. o dosyanın başlık yorumu) +
          belirgin dropdown affordance'ı (hover'da hafif zemin, açıkken
          marka rengi kenarlık+halka — diğer input alanlarının
          `focus:border-brand` deseniyle tutarlı).
          ⚠️ DÜZELTME (2026-08-03, 2. tur): `HeroForm.tsx`'te seçici artık
          input'un SOLUNDA değil SAĞINDA render ediliyor (form alanlarının
          metin hizası için) — bu yüzden ayırıcı kenarlık `border-r`'dan
          `border-l`'ye, dropdown da `left-0`'dan `right-0`'a çevrildi
          (buton artık en sağda olduğu için dropdown SOLA doğru açılıyor,
          aksi halde form/viewport dışına taşardı). */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={`flex h-full select-none items-center gap-1.5 border-l px-3 text-sm text-heading transition-colors hover:bg-black/[0.03] focus-visible:bg-black/[0.03] focus:outline-none ${
          hasError ? 'border-red-500' : open ? 'border-brand' : 'border-[#D9D9D9]'
        }`}
      >
        <CountryFlagIcon code={value.iso as CountryFlagCode} />
        <span>+{value.dialCode}</span>
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true" className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          id={`${idPrefix}-phone-country-listbox`}
          className="absolute right-0 top-full z-50 mt-1.5 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl ring-1 ring-black/5"
        >
          <div className="border-b border-gray-100 p-2">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-[3px] border border-gray-200 px-2.5 py-1.5 text-sm text-heading placeholder:text-muted focus:border-brand focus:outline-none"
            />
          </div>
          <ul role="listbox" aria-label={ariaLabel} className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && <li className="px-3 py-2 text-sm text-muted">{noResultsText}</li>}
            {filtered.map((country) => {
              const isActive = country.iso === value.iso;
              return (
                <li key={country.iso} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => select(country)}
                    className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-brand-light ${
                      isActive ? 'font-semibold text-brand' : 'text-body'
                    }`}
                  >
                    <CountryFlagIcon code={country.iso as CountryFlagCode} />
                    <span className="flex-1 truncate">{country.name[locale]}</span>
                    <span className="text-muted">+{country.dialCode}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
