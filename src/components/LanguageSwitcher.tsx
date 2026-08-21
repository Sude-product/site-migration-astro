import { useEffect, useRef, useState } from 'react';
import FlagIcon, { type FlagCode } from './icons/FlagIcon.tsx';

export interface LanguageSwitcherProps {
  /** Aktif dil kodu (Astro.currentLocale'den prop olarak gelir). */
  currentLocale: string;
  /**
   * Dil kodu -> o dildeki eşdeğer sayfanın URL'i.
   * Astro tarafında `getRelativeLocaleUrl` ile hesaplanır (sunucu-tarafı util).
   */
  urls: Record<string, string>;
}

// ⚠️ DÜZELTME (2026-07-28, altıncı tur): önceki turda burada bayrak EMOJİ'si
// (`flagEmoji()`, `phoneCountries.ts`) kullanılıyordu — kullanıcı Windows'ta
// Chrome'da "TR TR" gibi bir tekrar bildirdi. Kök neden: emoji DEĞİL, bir
// render sorunu — Windows'un emoji fontu regional-indicator sembollerini
// (🇹+🇷) TEK bir bayrak glyph'inde birleştiremiyor, iki harfi ayrı ayrı
// gösteriyor, bu da yanındaki "TR" kısa koduyla birlikte tekrar gibi
// görünüyor. Bkz. `FlagIcon.tsx` — elle çizilmiş 4 küçük SVG'ye geçildi
// (kütüphane kurulmadı, yalnızca 4 bayrak gerektiği için), Windows dahil
// HER platformda tutarlı render ediliyor. ⚠️ 2026-08-03: `PhoneCountrySelect.tsx`
// (45 ülke) de AYNI emoji sorununu yaşıyordu — bu düzeltme o zaman yalnızca
// dil seçiciyi kapsıyordu, telefon seçici kapsam dışı bırakılmıştı. Artık o
// da düzeltildi (`CountryFlagIcon.tsx`, aynı elle-çizilmiş SVG ilkesiyle
// 45+ ülkeye genişletildi) — `flagEmoji()` hiçbir yerde kullanılmadığı için
// `phoneCountries.ts`'ten tamamen kaldırıldı.
const LABELS: Record<string, { short: string; long: string; flag: FlagCode }> = {
  tr: { short: 'TR', long: 'Türkçe', flag: 'TR' },
  en: { short: 'EN', long: 'English', flag: 'GB' },
  nl: { short: 'NL', long: 'Nederlands', flag: 'NL' },
  it: { short: 'IT', long: 'Italiano', flag: 'IT' },
  az: { short: 'AZ', long: 'Azərbaycan', flag: 'AZ' },
};

export default function LanguageSwitcher({ currentLocale, urls }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Dışarı tıklayınca / Esc ile kapat.
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
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = LABELS[currentLocale] ?? LABELS.tr;
  const locales = Object.keys(LABELS).filter((l) => urls[l]);

  const go = (locale: string) => {
    if (locale === currentLocale) {
      setOpen(false);
      return;
    }
    window.location.href = urls[locale];
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Dil seçici, aktif dil: ${current.long}`}
        className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-heading transition-colors hover:border-brand hover:text-brand"
      >
        <FlagIcon code={current.flag} />
        <span>{current.short}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Diller"
          className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-md border border-gray-100 bg-surface py-1 shadow-lg"
        >
          {locales.map((locale) => {
            const isActive = locale === currentLocale;
            return (
              <li key={locale} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => go(locale)}
                  lang={locale}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-brand-light ${
                    isActive ? 'font-semibold text-brand' : 'text-body'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FlagIcon code={LABELS[locale].flag} />
                    <span>{LABELS[locale].long}</span>
                  </span>
                  <span className="text-muted">{LABELS[locale].short}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
