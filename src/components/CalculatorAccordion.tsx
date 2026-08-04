import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CALCULATOR_DEFINITIONS, type CalculatorField, type CalculatorResultRow } from '../data/calculatorDefinitions';

export interface CalculatorAccordionProps {
  /** Tam `CalculatorDefinition` nesnesi DEĞİL, yalnızca `slug` prop olarak
   * geçiriliyor — Astro'nun astro-island prop serileştirmesi (SSR'dan
   * client'a JSON üzerinden) fonksiyonları (`calculate`/`visibleWhen`)
   * TAŞIYAMIYOR; tam nesne prop olarak geçirilirse client'ta bu alanlar
   * `undefined` olup sunucudakinden FARKLI bir görünür-alan kümesi
   * hesaplanıyor, bu da React hydration mismatch'ine yol açıyordu (bulunup
   * düzeltildi). `slug` (düz string, sorunsuz serileşir) ile tanım burada,
   * client JS bundle'ının kendi `import`'undan (fonksiyonlar dahil sağlam)
   * çözülüyor. */
  slug: string;
  calculateLabel: string;
}

function defaultValues(fields: CalculatorField[]): Record<string, string> {
  const values: Record<string, string> = {};
  for (const f of fields) {
    if (f.defaultValue) values[f.id] = f.defaultValue;
  }
  return values;
}

function formatNumberInput(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return '';
  return parseInt(digits, 10).toLocaleString('tr-TR');
}

/** Sonuç satırlarının birim/biçimine göre görüntü metni — kaynağın
 * `currencyFormatter` (`toLocaleString('tr-TR')`) davranışıyla tutarlı. */
function formatResultValue(row: CalculatorResultRow): string {
  if (row.unit === 'currency') {
    return `${Math.round(row.value).toLocaleString('tr-TR')} ₺`;
  }
  if (row.unit === 'percent') {
    return `%${row.value.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}`;
  }
  if (row.unit === 'days') {
    return `${row.value.toLocaleString('tr-TR')} gün`;
  }
  return row.value.toLocaleString('tr-TR');
}

/** Sonuç modalı — `document.body`'ye portal'lanır (bkz. CLAUDE.md
 * "position:fixed dialog/modal/overlay kuralı": header'ın `backdrop-blur`'ü
 * altında nested bir `position:fixed` panel viewport yerine header'a göre
 * konumlanır — bu bug'a baştan düşmemek için mobil menüdeki AYNI portal
 * çözümü burada da uygulandı). */
function ResultModal({
  title,
  icon,
  results,
  onClose,
}: {
  title: string;
  icon: string;
  results: CalculatorResultRow[];
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label={title} className="relative w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <img src={icon} alt="" aria-hidden="true" className="h-8 w-8 shrink-0" />
          <h3 className="text-lg font-bold text-heading">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="ml-auto rounded-md p-1 text-muted transition-colors hover:text-brand"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <dl className="mt-5 divide-y divide-gray-100 border-t border-gray-100">
          {results.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-muted">{row.label}</dt>
              <dd className="text-sm font-semibold text-heading">{formatResultValue(row)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>,
    document.body,
  );
}

export default function CalculatorAccordion({ slug, calculateLabel }: CalculatorAccordionProps) {
  const definition = CALCULATOR_DEFINITIONS.find((d) => d.slug === slug);
  const [values, setValues] = useState<Record<string, string>>(() => defaultValues(definition?.fields ?? []));
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CalculatorResultRow[] | null>(null);

  const setField = (id: string, value: string) => setValues((prev) => ({ ...prev, [id]: value }));

  if (!definition) return null; // beklenmez — `slug` her zaman CALCULATOR_DEFINITIONS'tan gelir

  const visibleFields = definition.fields.filter((f) => !f.visibleWhen || f.visibleWhen(values));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const missing = visibleFields.find((f) => {
      if (f.optional) return false;
      if (f.type === 'radio' && f.defaultValue) return false; // her zaman bir varsayılanı var
      const v = values[f.id];
      if (f.type === 'currency' || f.type === 'percent' || f.type === 'plain-number') {
        return !v || parseInt(v.replace(/[^\d]/g, ''), 10) <= 0;
      }
      return !v;
    });
    if (missing) {
      setError(`"${missing.label}" alanı boş bırakılamaz ve geçerli bir değer içermelidir.`);
      return;
    }

    const result = definition.calculate(values);
    if ('error' in result) {
      setError(result.error);
      return;
    }
    setResults(result);
  };

  return (
    <details className="group py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-heading marker:content-none">
        <span className="flex items-center gap-3">
          <img src={definition.icon} alt="" aria-hidden="true" className="h-6 w-6 shrink-0" />
          {definition.title}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className="h-3 w-3 shrink-0 transition-transform group-open:rotate-180"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>

      <form onSubmit={handleSubmit} className="mt-4">
        {definition.note && <p className="mb-4 text-xs text-muted">ⓘ {definition.note}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          {visibleFields.map((field) => {
            const wrapperClass = field.halfWidth ? '' : 'sm:col-span-2';
            if (field.type === 'radio') {
              return (
                <div key={field.id} className={wrapperClass}>
                  <span className="mb-1.5 block text-sm text-body">{field.label}</span>
                  <div className="flex flex-wrap gap-4">
                    {field.options?.map((opt) => (
                      <label key={opt.value} className="flex items-center gap-1.5 text-sm text-body">
                        <input
                          type="radio"
                          name={`${definition.slug}-${field.id}`}
                          value={opt.value}
                          checked={(values[field.id] ?? field.defaultValue) === opt.value}
                          onChange={() => setField(field.id, opt.value)}
                          className="accent-brand"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              );
            }
            if (field.type === 'select') {
              return (
                <div key={field.id} className={wrapperClass}>
                  <label className="mb-1.5 block text-sm text-body" htmlFor={`${definition.slug}-${field.id}`}>
                    {field.label}
                  </label>
                  <select
                    id={`${definition.slug}-${field.id}`}
                    value={values[field.id] ?? ''}
                    onChange={(e) => setField(field.id, e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-heading focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                  >
                    <option value="">{field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
            if (field.type === 'date') {
              return (
                <div key={field.id} className={wrapperClass}>
                  <label className="mb-1.5 block text-sm text-body" htmlFor={`${definition.slug}-${field.id}`}>
                    {field.label}
                  </label>
                  <input
                    id={`${definition.slug}-${field.id}`}
                    type="date"
                    value={values[field.id] ?? ''}
                    onChange={(e) => setField(field.id, e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-heading focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
              );
            }
            // currency / percent / plain-number
            const unitSuffix = field.type === 'currency' ? 'TL' : field.type === 'percent' ? '%' : null;
            return (
              <div key={field.id} className={wrapperClass}>
                <label className="mb-1.5 block text-sm text-body" htmlFor={`${definition.slug}-${field.id}`}>
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    id={`${definition.slug}-${field.id}`}
                    type="text"
                    inputMode="numeric"
                    value={values[field.id] ?? ''}
                    onChange={(e) => setField(field.id, formatNumberInput(e.target.value))}
                    placeholder="0"
                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-heading focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                  {unitSuffix && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">
                      {unitSuffix}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {error && <p className="mt-3 text-sm text-brand">{error}</p>}

        <button
          type="submit"
          className="btn-cta mt-4 px-6 py-2.5 text-sm font-semibold"
        >
          {calculateLabel}
        </button>
      </form>

      {results && (
        <ResultModal title={definition.title} icon={definition.icon} results={results} onClose={() => setResults(null)} />
      )}
    </details>
  );
}
