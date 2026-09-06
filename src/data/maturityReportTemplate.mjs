// ADIM 4 (2026-09-03) — İK Dijital Olgunluk Testi PDF raporunun HTML
// şablonu. Kasıtlı olarak SAF ESM/JS (TypeScript SÖZ DİZİMİ yok) —
// bu dosya İKİ FARKLI ortamdan da değişmeden çalıştırılabilsin diye:
// (1) `src/pages/api/maturity-pdf.ts` (Astro/Vite üzerinden, Cloudflare
// Workers Browser Rendering ile gerçek üretim), (2) düz Node.js
// (`scripts/render-maturity-pdf-pilot.mjs`, yerel önizleme/pilot —
// Cloudflare Browser Rendering bu ortamda ÇALIŞTIRILAMADIĞI için, aynı
// şablon yerel `puppeteer` ile render edilip görsel/içerik onayı için
// kullanılıyor). Düz Node bir `.ts` dosyasını derlemeden import EDEMEZ,
// bu yüzden ikisinin de içe aktarabileceği TEK dosya .mjs olmak zorunda.
//
// Kategori/grup etiketleri `maturityTestDefinitions.ts`'teki
// `MATURITY_CATEGORY_LABELS`/`GROUP_LABELS` ile AYNI (bilerek kopyalandı,
// aynı sebepten — o dosya TypeScript, düz Node import edemiyor). Biri
// değişirse diğeri de GÜNCELLENMELİ.
import { MATURITY_REPORT_MODELS, REPORT_METHODOLOGY_TEXT, getReportModelKey } from './maturityReportContent.mjs';

const CATEGORY_LABELS = {
  temel: 'Dijital Altyapı & Özlük',
  zaman: 'Zaman & İzin Yönetimi',
  performans: 'Performans & Yetkinlik',
  ise_alim: 'İşe Alım (ATS)',
  analitik: 'Analitik & Raporlama',
};

const GROUP_LABELS = {
  ozluk: 'Özlük',
  bordro: 'Bordro Süreci',
  dijital_imza: 'Dijital İmza',
  pdks: 'Pdks',
  izin: 'İzin Yönetimi',
  performans_surec: 'Performans Yönetimi',
  ise_alim: 'İşe Alım',
  egitim: 'Eğitim',
  calisan_deneyimi: 'Çalışan Deneyimi',
  raporlama: 'Raporlama',
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** %70+ İyi, %40-69 Orta, <%40 Kritik — dokümanda/örnek PDF'te açıkça
 * yazılı bir eşik yok, örnek PDF'teki gerçek etiket-yüzde eşleşmelerinden
 * (İyi: %60/%84/%85, Orta: %30/%45) geriye doğru çıkarılan makul bir
 * eşik. */
function qualityTag(score) {
  if (score >= 70) return { label: 'İyi', color: '#16A34A' };
  if (score >= 40) return { label: 'Orta', color: '#F59E0B' };
  return { label: 'Kritik', color: '#DC2626' };
}

function formatDate(date) {
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

/**
 * @param {{
 *   companyName: string;
 *   totalScore: number;
 *   level: { title: string; subtitle: string };
 *   categoryScores: Record<string, number>;
 *   groupScores: Record<string, number>;
 *   generatedAt?: Date;
 * }} data
 */
export function renderMaturityReportHtml(data) {
  const { companyName, totalScore, level, categoryScores, groupScores } = data;
  const generatedAt = data.generatedAt ?? new Date();
  const modelKey = getReportModelKey(totalScore);
  const model = MATURITY_REPORT_MODELS[modelKey];
  const safeCompanyName = escapeHtml(companyName || 'Değerli Müşterimiz');

  const categoryCardsHtml = Object.entries(CATEGORY_LABELS)
    .map(([key, label]) => {
      const score = categoryScores[key] ?? 0;
      const tag = qualityTag(score);
      return `
        <div class="category-card">
          <p class="category-card__label">${escapeHtml(label)}</p>
          <p class="category-card__tag" style="color:${escapeHtml(tag.color)}">${escapeHtml(tag.label)}</p>
          <p class="category-card__score">%${escapeHtml(score)}</p>
        </div>`;
    })
    .join('');

  const groupBarsHtml = Object.entries(GROUP_LABELS)
    .map(([key, label]) => {
      const score = groupScores[key] ?? 0;
      return `
        <div class="group-bar">
          <div class="group-bar__track"><div class="group-bar__fill" style="height:${escapeHtml(score)}%"></div></div>
          <p class="group-bar__pct">%${escapeHtml(score)}</p>
          <p class="group-bar__label">${escapeHtml(label)}</p>
        </div>`;
    })
    .join('');

  const analysisBlocksHtml = model.analysisBlocks
    .map(
      (block) => `
        <div class="analysis-block">
          <div class="analysis-block__header">
            <h4>${escapeHtml(block.title)}</h4>
            <span class="pill" style="background:${escapeHtml(block.statusColor)}1A;color:${escapeHtml(block.statusColor)}">${escapeHtml(block.status)}</span>
          </div>
          <p><strong>Analiz:</strong> ${escapeHtml(block.analysis)}</p>
          ${block.solution ? `<p><strong>Çözüm:</strong> ${escapeHtml(block.solution)}</p>` : ''}
        </div>`,
    )
    .join('');

  const roadmapHtml = model.roadmap
    .map((step, i) => `<li><span class="roadmap-num">${escapeHtml(i + 1)}</span><span>${escapeHtml(step)}</span></li>`)
    .join('');

  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8" />
<title>İK Dijital Olgunluk Raporu — ${safeCompanyName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Quicksand', sans-serif; color: #333333; }
  .pdf-page { width: 210mm; min-height: 297mm; padding: 16mm; position: relative; overflow: hidden; page-break-after: always; }
  .pdf-page:last-child { page-break-after: auto; }
  .footer { position: absolute; bottom: 10mm; left: 16mm; right: 16mm; display: flex; justify-content: space-between; font-size: 9px; color: #808080; border-top: 1px solid #eee; padding-top: 4mm; }
  .logo { font-weight: 700; font-size: 22px; color: #070707; }
  .logo span { color: #FF0000; }
  h1, h2, h3, h4 { color: #070707; margin: 0; }
  p { margin: 0; }

  /* Sayfa 1 — Kapak */
  .cover { display: flex; flex-direction: column; justify-content: center; height: 100%; }
  .cover-arc { position: absolute; top: -60mm; right: -60mm; width: 160mm; height: 160mm; border-radius: 50%; border: 22mm solid rgba(255,0,0,0.12); }
  .cover h1 { font-size: 34px; line-height: 1.2; max-width: 130mm; margin-top: 40mm; }
  .cover .for-company { margin-top: 10mm; font-size: 16px; color: #333333; }
  .cover .date { margin-top: 2mm; font-size: 13px; font-weight: 700; color: #FF0000; }
  .cover .engine { margin-top: auto; font-size: 12px; color: #808080; }

  /* Sayfa 2 — Skor + Kategoriler */
  .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8mm; }
  .page-header .report-title { font-size: 11px; color: #808080; }
  .section-label { color: #FF0000; font-weight: 700; font-size: 13px; letter-spacing: 0.05em; margin-bottom: 4mm; }
  .score-row { display: flex; align-items: center; gap: 10mm; }
  .score-box { background: linear-gradient(135deg, #FFF7D6, #FFFFFF); border-radius: 6mm; padding: 8mm 12mm; }
  .score-box .score { font-size: 48px; font-weight: 700; color: #070707; }
  .score-box .score small { font-size: 18px; color: #808080; font-weight: 500; }
  .level-title { font-size: 22px; font-weight: 700; }
  .level-subtitle { font-size: 14px; color: #FF0000; font-weight: 600; margin-top: 1mm; }
  .category-cards { display: flex; gap: 4mm; margin-top: 8mm; }
  .category-card { flex: 1; border: 1px solid #eee; border-radius: 4mm; padding: 4mm; text-align: center; }
  .category-card__label { font-size: 10px; font-weight: 600; min-height: 9mm; }
  .category-card__tag { font-size: 10px; font-weight: 700; margin-top: 2mm; }
  .category-card__score { font-size: 18px; font-weight: 700; margin-top: 1mm; }
  .headline { font-size: 20px; margin-top: 10mm; }
  .detection { margin-top: 4mm; font-size: 13px; line-height: 1.6; }
  .methodology { margin-top: 10mm; background: #FAFAFA; border-radius: 4mm; padding: 6mm; }
  .methodology h4 { font-size: 12px; margin-bottom: 2mm; }
  .methodology p { font-size: 11px; line-height: 1.6; color: #808080; }

  /* Sayfa 3 — Yetkinlik Karnesi + Analiz */
  .group-bars { display: flex; align-items: flex-end; gap: 3mm; height: 60mm; margin-top: 8mm; }
  .group-bar { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; }
  .group-bar__track { width: 100%; height: 40mm; background: #F2F2F2; border-radius: 2mm; display: flex; align-items: flex-end; overflow: hidden; }
  .group-bar__fill { width: 100%; background: linear-gradient(180deg, #FF6B6B, #FF0000); }
  .group-bar__pct { font-size: 9px; font-weight: 700; margin-top: 1.5mm; }
  .group-bar__label { font-size: 7px; text-align: center; margin-top: 1mm; color: #808080; }
  .analysis-block { margin-top: 6mm; border: 1px solid #eee; border-radius: 4mm; padding: 5mm; }
  .analysis-block__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2mm; }
  .analysis-block h4 { font-size: 13px; }
  .pill { border-radius: 999px; padding: 1mm 3mm; font-size: 10px; font-weight: 700; }
  .analysis-block p { font-size: 11px; line-height: 1.6; margin-top: 1.5mm; }

  /* Sayfa 4 — SWOT + Yol Haritası + Sonuç */
  .swot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin-top: 8mm; }
  .swot-cell { border-radius: 4mm; padding: 5mm; background: #FAFAFA; }
  .swot-cell .badge { display: inline-flex; align-items: center; justify-content: center; width: 8mm; height: 8mm; border-radius: 50%; background: #FFE1E1; color: #FF0000; font-weight: 700; margin-bottom: 2mm; }
  .swot-cell h4 { font-size: 12px; }
  .swot-cell p { font-size: 11px; margin-top: 1.5mm; line-height: 1.5; }
  .roadmap { margin-top: 10mm; }
  .roadmap ol { list-style: none; padding: 0; margin: 4mm 0 0; }
  .roadmap li { display: flex; align-items: flex-start; gap: 3mm; margin-bottom: 4mm; font-size: 12px; }
  .roadmap-num { flex-shrink: 0; width: 7mm; height: 7mm; border-radius: 50%; background: #FFE1E1; color: #FF0000; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 11px; }
  .closing-box { margin-top: 10mm; background: #FFF3F3; border-radius: 4mm; padding: 6mm; text-align: center; font-size: 13px; font-weight: 600; }
  .package-line { margin-top: 6mm; text-align: center; font-size: 12px; color: #808080; }
  .package-line strong { color: #070707; font-size: 15px; }
  .cta-button { margin: 6mm auto 0; display: block; width: fit-content; background: #FF0000; color: #FFFFFF; font-weight: 700; font-size: 13px; padding: 4mm 10mm; border-radius: 3mm; text-align: center; text-decoration: none; }
</style>
</head>
<body>

  <section class="pdf-page cover">
    <div class="cover-arc" aria-hidden="true"></div>
    <div class="logo">idenfit<span>★</span></div>
    <h1>İK Dijital Olgunluk ve Teknoloji Analiz Raporu</h1>
    <p class="for-company">${safeCompanyName} için özel olarak hazırlanmıştır.</p>
    <p class="date">${formatDate(generatedAt)}</p>
    <p class="engine">Hazırlayan: İdenfit HR Tech Analysis Engine · © ${generatedAt.getFullYear()} idenfit</p>
  </section>

  <section class="pdf-page">
    <div class="page-header">
      <div class="logo" style="font-size:16px">idenfit<span>★</span></div>
      <div class="report-title">İK Dijital Olgunluk ve Teknoloji Analiz Raporu — ${safeCompanyName}</div>
    </div>

    <p class="section-label">GENEL PUAN</p>
    <div class="score-row">
      <div class="score-box"><span class="score">${escapeHtml(totalScore)}<small>/100</small></span></div>
      <div>
        <p class="level-title">${escapeHtml(level.title)}</p>
        <p class="level-subtitle">${escapeHtml(level.subtitle)}</p>
      </div>
    </div>

    <div class="category-cards">${categoryCardsHtml}</div>

    <h2 class="headline">${escapeHtml(model.headline)}</h2>
    <p class="detection">${escapeHtml(model.detection)}</p>

    <div class="methodology">
      <h4>Bu Rapor Nasıl Hazırlandı?</h4>
      <p>${escapeHtml(REPORT_METHODOLOGY_TEXT)}</p>
    </div>

    <div class="footer"><span>© idenfit ${generatedAt.getFullYear()}</span><span>support@idenfit.com · www.idenfit.com</span></div>
  </section>

  <section class="pdf-page">
    <div class="page-header">
      <div class="logo" style="font-size:16px">idenfit<span>★</span></div>
      <div class="report-title">İK Dijital Olgunluk ve Teknoloji Analiz Raporu — ${safeCompanyName}</div>
    </div>

    <p class="section-label">YETKİNLİK KARNESİ</p>
    <div class="group-bars">${groupBarsHtml}</div>

    ${analysisBlocksHtml}

    <div class="footer"><span>© idenfit ${generatedAt.getFullYear()}</span><span>support@idenfit.com · www.idenfit.com</span></div>
  </section>

  <section class="pdf-page">
    <div class="page-header">
      <div class="logo" style="font-size:16px">idenfit<span>★</span></div>
      <div class="report-title">İK Dijital Olgunluk ve Teknoloji Analiz Raporu — ${safeCompanyName}</div>
    </div>

    <p class="section-label">SWOT ANALİZİ</p>
    <div class="swot-grid">
      <div class="swot-cell"><span class="badge">S</span><h4>Güçlü Yönler</h4><p>${escapeHtml(model.swot.strengths)}</p></div>
      <div class="swot-cell"><span class="badge">W</span><h4>Zayıf Yönler</h4><p>${escapeHtml(model.swot.weaknesses)}</p></div>
      <div class="swot-cell"><span class="badge">O</span><h4>Fırsatlar</h4><p>${escapeHtml(model.swot.opportunities)}</p></div>
      <div class="swot-cell"><span class="badge">T</span><h4>Tehditler</h4><p>${escapeHtml(model.swot.threats)}</p></div>
    </div>

    <div class="roadmap">
      <p class="section-label">DİJİTAL DÖNÜŞÜM YOL HARİTASI</p>
      <ol>${roadmapHtml}</ol>
    </div>

    <div class="closing-box">${escapeHtml(model.closingSummary)}</div>
    <p class="package-line">Önerilen İdenfit Paketi:<br /><strong>${escapeHtml(model.recommendedPackage)}</strong></p>
    <a class="cta-button" href="https://idenfit.com/online-sunum-talep-et/">${escapeHtml(model.ctaLabel)}</a>

    <div class="footer"><span>© idenfit ${generatedAt.getFullYear()}</span><span>support@idenfit.com · www.idenfit.com</span></div>
  </section>

</body>
</html>`;
}
