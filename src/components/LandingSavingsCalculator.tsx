import { useState } from 'react';

// Çalışan sayısına göre basit tahmini zaman tasarrufu hesaplayıcısı
// (2026-08-07). Kaynakta bu hesaplama için bir veri YOK — mevcut 8
// hesaplayıcı (`calculatorDefinitions.ts`) fazla mesai/gelir vergisi/kıdem
// tazminatı gibi tamamen farklı, kaynak siteden birebir taşınmış
// hukuki/mali araçlar; bu ise sıfırdan, bespoke bir landing page aracı.
// Kullanıcı onayıyla BASİT bir varsayım kullanılıyor: çalışan başına ayda
// ortalama 2 saat (manuel puantaj/devam takibi yerine idenfit ile
// otomatikleştirilen süre) — kesin bir istatistik olarak DEĞİL, her zaman
// "tahmini" ibaresiyle gösteriliyor.
const HOURS_SAVED_PER_EMPLOYEE_PER_MONTH = 2;

export default function LandingSavingsCalculator() {
  const [raw, setRaw] = useState('');
  const employeeCount = parseInt(raw.replace(/[^\d]/g, ''), 10) || 0;
  const hoursSaved = employeeCount * HOURS_SAVED_PER_EMPLOYEE_PER_MONTH;
  const daysSaved = hoursSaved / 8;

  // 2026-08-07: soluk `bg-brand-light` pastel zemin yerine beyaz kart +
  // kalın kırmızı sol kenarlık (KONU 1 — "cesur/doygun kırmızı", gereksiz
  // pastel tondan kaçınma).
  return (
    <div className="mt-8 rounded-2xl border border-black/5 border-l-4 border-l-brand bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      <label htmlFor="landing-employee-count" className="text-sm font-semibold text-heading">
        Kaç çalışanınız var?
      </label>
      <div className="mt-2 flex items-center gap-3">
        <input
          id="landing-employee-count"
          type="text"
          inputMode="numeric"
          value={raw}
          onChange={(e) => setRaw(e.target.value.replace(/[^\d]/g, ''))}
          placeholder="ör. 50"
          className="w-28 rounded-full border border-[#DDDDDD] bg-white px-4 py-2 text-base text-heading placeholder:text-muted focus:border-brand focus:outline-none"
        />
        <span className="text-sm text-muted">çalışan</span>
      </div>
      {employeeCount > 0 && (
        <p className="mt-3 text-sm text-body">
          Ayda tahmini <span className="font-semibold text-brand">{hoursSaved.toLocaleString('tr-TR')} saat</span> (~
          {daysSaved.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} iş günü) zaman tasarrufu sağlayabilirsiniz.
        </p>
      )}
    </div>
  );
}
