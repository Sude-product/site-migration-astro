import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { MATURITY_CATEGORY_LABELS, type MaturityCategoryKey, type MaturityResult } from '../data/maturityTestDefinitions';

// ADIM 2 (2026-09-03) — kategori skorlarının önceki yatay bar listesinin
// YERİNE geçen radar (örümcek ağı) grafiği. Teknik spesifikasyon dokümanı
// (5.1) ve ilk belgenin (sayfa 1/4) ikisi de bu ekran için radar istiyor —
// puanlama mantığına HİÇ dokunulmadı, yalnızca GÖRSELLEŞTİRME değişti.
// Marka paleti (kırmızı/gri/siyah/beyaz) dışına çıkılmadı: dolgu/çizgi
// `#FF0000` (bg-brand), ızgara açık gri, eksen etiketleri `#333333`
// (text-body) — projede zaten tanımlı token'larla AYNI hex değerleri.
export default function MaturityRadarChart({ categoryScores }: { categoryScores: MaturityResult['categoryScores'] }) {
  const data = (Object.keys(MATURITY_CATEGORY_LABELS) as MaturityCategoryKey[]).map((key) => ({
    category: MATURITY_CATEGORY_LABELS[key],
    score: categoryScores[key],
  }));

  return (
    <div className="mx-auto h-[300px] w-full max-w-md sm:h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis dataKey="category" tick={{ fill: '#333333', fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} tickCount={5} />
          <Radar name="Skor" dataKey="score" stroke="#FF0000" fill="#FF0000" fillOpacity={0.35} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
