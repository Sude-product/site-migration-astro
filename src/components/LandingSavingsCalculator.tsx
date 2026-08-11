import { useState } from 'react';
import { Clock, BarChart3, Heart } from 'lucide-react';

// Çalışan sayısına göre basit tahmini zaman tasarrufu hesaplayıcısı
// (2026-08-07, "mini deneyim"e dönüştürüldü 2026-08-10). Kaynakta bu
// hesaplama için bir veri YOK — mevcut 8 hesaplayıcı (`calculatorDefinitions.ts`)
// fazla mesai/gelir vergisi/kıdem tazminatı gibi tamamen farklı, kaynak
// siteden birebir taşınmış hukuki/mali araçlar; bu ise sıfırdan, bespoke bir
// landing page aracı. Kullanıcı onayıyla BASİT bir varsayım kullanılıyor:
// çalışan başına ayda ortalama 2 saat (manuel puantaj/devam takibi yerine
// idenfit ile otomatikleştirilen süre) — kesin bir istatistik olarak DEĞİL,
// her zaman "tahmini" ibaresiyle gösteriliyor.
const HOURS_SAVED_PER_EMPLOYEE_PER_MONTH = 2;

const MIN_EMPLOYEES = 1;
const MAX_EMPLOYEES = 300;
const DEFAULT_EMPLOYEES = 25;

// Paket eşikleri GERÇEK/doğrulanabilir (`src/data/pricingContent.ts` →
// `reference/wordpress-export/pricing.json`, TR): Mikro "1-25 Çalışan",
// KOBİ "1-100 Çalışan" (üst sınırı 100), Pro'nun üst sınırı yok (kurumsal/
// sınırsız) — uydurulmadı.
const MICRO_MAX = 25;
const SME_MAX = 100;

type Tier = 'micro' | 'sme' | 'pro';

function getTier(employeeCount: number): Tier {
  if (employeeCount <= MICRO_MAX) return 'micro';
  if (employeeCount <= SME_MAX) return 'sme';
  return 'pro';
}

const TIER_MESSAGE: Record<Tier, string> = {
  micro: 'Mikro paketle bugün ücretsiz başlayın.',
  sme: 'KOBİ paketiyle büyümenize ayak uydurun.',
  pro: 'Pro paketle kurumsal ölçekte yönetin.',
};

export default function LandingSavingsCalculator() {
  const [employeeCount, setEmployeeCount] = useState(DEFAULT_EMPLOYEES);
  const hoursSaved = employeeCount * HOURS_SAVED_PER_EMPLOYEE_PER_MONTH;
  const daysSaved = hoursSaved / 8;
  const tier = getTier(employeeCount);
  const progressPercent = ((employeeCount - MIN_EMPLOYEES) / (MAX_EMPLOYEES - MIN_EMPLOYEES)) * 100;

  const scrollToForm = () => {
    document.getElementById('landing-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // 2026-08-07: soluk `bg-brand-light` pastel zemin yerine beyaz kart +
  // kalın kırmızı sol kenarlık (KONU 1 — "cesur/doygun kırmızı", gereksiz
  // pastel tondan kaçınma). `relative overflow-hidden` (2026-08-10) —
  // arka plan dekorasyonlarını (nokta-grid + süzülen ikonlar) yuvarlak
  // köşelerin içinde tutmak için.
  return (
    <div className="relative mt-8 overflow-hidden rounded-2xl border border-black/5 border-l-4 border-l-brand bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      {/* Arka plan dekorasyonu (2026-08-10) — ince nokta-grid dokusu + 3
          süzülen ikon. `pointer-events-none` + `z-0` (içerik `z-10`):
          yalnızca görsel, form/kaydırıcı etkileşimine ASLA karışmıyor. */}
      <div className="lp-calc-dots pointer-events-none absolute inset-0 z-0" aria-hidden="true" />
      <Heart className="lp-calc-icon-b pointer-events-none absolute top-3 left-3 z-0 h-7 w-7 text-brand/20" aria-hidden="true" />
      <Clock className="lp-calc-icon-a pointer-events-none absolute top-3 right-3 z-0 h-7 w-7 text-brand/20" aria-hidden="true" />
      <BarChart3 className="lp-calc-icon-c pointer-events-none absolute right-3 bottom-3 z-0 h-7 w-7 text-brand/20" aria-hidden="true" />

      <div className="relative z-10">
        <label htmlFor="landing-employee-count" className="text-sm font-semibold text-heading">
          Ekibinizin büyüklüğünü söyleyin, size ne kadar zaman kazandıracağımızı gösterelim.
        </label>

        <div className="mt-4 flex items-baseline justify-between">
          <span key={employeeCount === MAX_EMPLOYEES ? 'max' : employeeCount} className="lp-value-pulse text-3xl font-bold text-brand tabular-nums">
            {employeeCount}
            {employeeCount === MAX_EMPLOYEES ? '+' : ''}
          </span>
          <span className="text-sm text-muted">çalışan</span>
        </div>

        <input
          id="landing-employee-count"
          type="range"
          min={MIN_EMPLOYEES}
          max={MAX_EMPLOYEES}
          step={1}
          value={employeeCount}
          onChange={(e) => setEmployeeCount(Number(e.target.value))}
          style={{ '--range-progress': `${progressPercent}%` } as React.CSSProperties}
          className="lp-range mt-3"
          aria-label="Çalışan sayısı"
        />

        {/* Paket eşiği (Mikro/KOBİ/Pro) rozeti — `key={tier}` yalnızca tier
            değiştiğinde remount edip `.lp-value-pulse` animasyonunu tetikler. */}
        <p key={tier} className="lp-value-pulse mt-3 text-sm font-medium text-brand">
          {TIER_MESSAGE[tier]}
        </p>

        <p className="mt-3 text-sm text-body">
          Ayda tahmini <span className="font-semibold text-brand">{hoursSaved.toLocaleString('tr-TR')} saat</span> zaman tasarrufu
          sağlayabilirsiniz.
        </p>
        <p className="mt-1 text-sm text-muted">
          Bu, yaklaşık{' '}
          <span className="font-semibold text-heading">{daysSaved.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} iş gününe</span> denk
          geliyor — ekibinize geri kazandırdığınız zaman.
        </p>

        <button
          type="button"
          onClick={scrollToForm}
          className="mt-4 text-sm font-semibold text-brand underline underline-offset-2 transition-colors hover:text-heading"
        >
          Bu tasarrufu gerçeğe dönüştürün →
        </button>
      </div>
    </div>
  );
}
