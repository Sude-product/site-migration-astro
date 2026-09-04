// ADIM 4 pilot script — Cloudflare Browser Rendering API bu geliştirme
// ortamında ÇALIŞTIRILAMADIĞI için (gerçek bir Cloudflare Workers
// dağıtımı + hesapta aktif bir Browser Rendering aboneliği gerektiriyor),
// `maturityReportTemplate.mjs`'in ÜRETİMDE KULLANILACAK AYNI HTML
// çıktısı burada yerel `puppeteer` (yalnızca bu pilot/önizleme script'i
// için devDependency, üretim kodunda KULLANILMIYOR) ile gerçek bir
// PDF'e çevrilip diske yazılıyor — içerik/tasarım onayı için.
//
// Kullanım: node scripts/render-maturity-pdf-pilot.mjs [A|B|C|D]
// (harf verilmezse örnek olarak gerçek bir test koşusundan alınan
// "Dijital İK" / Model C verisi kullanılır — skor 61, 2026-09-03'te
// tarayıcıda uçtan uca doğrulanmış GERÇEK hesaplama sonucu, uydurma
// değil.)
import puppeteer from 'puppeteer';
import { writeFile } from 'node:fs/promises';
import { renderMaturityReportHtml } from '../src/data/maturityReportTemplate.mjs';

const SAMPLE_RESULTS = {
  A: {
    companyName: 'Örnek Firma A.Ş.',
    totalScore: 18,
    level: { title: 'Geleneksel İK', subtitle: 'Kaos Yönetimi' },
    categoryScores: { temel: 20, zaman: 10, performans: 15, ise_alim: 10, analitik: 20 },
    groupScores: { ozluk: 20, bordro: 20, dijital_imza: 20, pdks: 20, izin: 0, performans_surec: 20, ise_alim: 10, egitim: 0, calisan_deneyimi: 20, raporlama: 20 },
  },
  B: {
    companyName: 'Örnek Firma A.Ş.',
    totalScore: 38,
    level: { title: 'Dijitalleşme Yolunda', subtitle: 'Parçalı Yapı' },
    categoryScores: { temel: 60, zaman: 40, performans: 30, ise_alim: 20, analitik: 20 },
    groupScores: { ozluk: 60, bordro: 60, dijital_imza: 60, pdks: 40, izin: 40, performans_surec: 40, ise_alim: 20, egitim: 20, calisan_deneyimi: 20, raporlama: 20 },
  },
  // 2026-09-03'te tarayıcıda GERÇEKTEN koşulmuş uçtan uca testin (ADIM
  // 2/3 onay turu) birebir sonucu — uydurma veri değil.
  C: {
    companyName: 'Adım3 Test Firma',
    totalScore: 61,
    level: { title: 'Dijital İK', subtitle: 'Stratejik Oyuncu' },
    categoryScores: { temel: 100, zaman: 30, performans: 70, ise_alim: 10, analitik: 60 },
    groupScores: {
      ozluk: 100, bordro: 100, dijital_imza: 100, pdks: 40, izin: 20,
      performans_surec: 80, ise_alim: 10, egitim: 100, calisan_deneyimi: 40, raporlama: 60,
    },
  },
  D: {
    companyName: 'Örnek Firma A.Ş.',
    totalScore: 92,
    level: { title: 'Data & AI Odaklı', subtitle: 'HR Visionary' },
    categoryScores: { temel: 100, zaman: 90, performans: 90, ise_alim: 90, analitik: 90 },
    groupScores: {
      ozluk: 100, bordro: 100, dijital_imza: 100, pdks: 100, izin: 80,
      performans_surec: 90, ise_alim: 90, egitim: 90, calisan_deneyimi: 90, raporlama: 90,
    },
  },
};

const modelKey = (process.argv[2] || 'C').toUpperCase();
const data = SAMPLE_RESULTS[modelKey];
if (!data) {
  console.error(`Bilinmeyen model: ${modelKey}. Kullanım: node scripts/render-maturity-pdf-pilot.mjs [A|B|C|D]`);
  process.exit(1);
}

const html = renderMaturityReportHtml({ ...data, generatedAt: new Date() });
const outPath = `scratchpad-maturity-report-${modelKey}.pdf`;

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });
const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
await browser.close();

await writeFile(outPath, pdfBuffer);
console.log(`Yazıldı: ${outPath} (${pdfBuffer.length} bayt, Model ${modelKey})`);
