// AŞAMA 3.0 — SADECE TARAMA. Hiçbir route/sayfa üretmez. Kalan modül
// sayfalarının ACF şemasını, dil bazında içerik varlığını, blok sayısı
// tutarlılığını ve SSS başlıklarını çıkarıp konsola/JSON'a dökerek
// `docs/remaining-modules-report.md`'nin ham verisini üretir.
//
// Çalıştırma: node scripts/scan-remaining-modules.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const PAGES_PATH = 'reference/wordpress-export/pages.json';

const ALREADY_DONE = new Set([
  'pdks-modulu', 'bordo-onay-modulu', 'yillik-izin-takip-programi',
  'calisan-performans-degerlendirme-sistemi-modulu', 'onboarding-modulu',
  'ise-alim-modulu', 'isyeri-saglik-yonetimi-modulu', 'offboarding-modulu',
  'anket-modulu', 'organizasyonel-geri-bildirim-modulu', 'kurumsal-takvim-modulu',
  'notlar-modulu',
]);

// page-inventory.mjs'in A_modules listesinden TR-kökenli slug'lar
// (bkz. scripts/page-inventory.mjs) — bunlardan zaten yapılanlar çıkarıldı.
const CANDIDATE_TR_SLUGS = [
  'calisan-egitim-yonetimi-modulu',
  'calisan-ozluk-yonetimi-modulu-2',
  'demirbas-yonetimi-modulu',
  'dokuman-yonetim-sistemi-modulu',
  'insan-kaynaklari-isgucu-yonetimi',
  'insan-kaynaklari-yonetimi-modulu',
  'masraf-yonetimi-modulu',
  'ofis-ici-mesajlasma-modulu',
  'personel-servisi-yonetimi-modulu',
  'puantaj-takip-programi-modulu',
  'seyahat-ve-gorevlendirme-yonetimi-modulu',
  'zimmet-yonetimi-modulu',
].filter((s) => !ALREADY_DONE.has(s));

function detectSchema(acf) {
  if (acf.module_title) return 'A (module_title)';
  if (acf.hero_title) return 'B (hero_title)';
  if (acf.section_title_1 || acf.section_text_1) return 'C (section_title_N, ters sıra)';
  if (acf.section_1_title) return 'D (section_1_title, PDKS)';
  return 'BİLİNMEYEN';
}

function heroTitleFor(acf, schema) {
  if (schema.startsWith('A')) return acf.module_title || '';
  if (schema.startsWith('B')) return acf.hero_title || '';
  if (schema.startsWith('C')) return acf.section_title_1 || '';
  if (schema.startsWith('D')) return acf.section_1_title || '';
  return '';
}

/** Kabaca kaç içerik bloğu dolu (section_2..10 VEYA section_title_2..N) — tam
 * extractHeroAndSections() kadar titiz değil, tarama amaçlı hızlı bir sayım. */
function roughSectionCount(acf, schema) {
  let count = 0;
  if (schema.startsWith('C')) {
    for (let i = 2; i <= 10; i++) if (acf[`section_title_${i}`]) count++;
  } else {
    for (let i = 2; i <= 10; i++) {
      if (acf[`section_${i}_title`] || acf[`sectin_${i}_title`]) count++;
      if (acf[`section_${i}_title_copy`] || acf[`sectin_${i}_title_copy`]) count++;
    }
  }
  return count;
}

function faqQuestions(acf) {
  const qs = [];
  for (let i = 1; i <= 20; i++) {
    const q = acf[`question_${i}`];
    if (q && q.trim()) qs.push(q.trim());
  }
  return qs;
}

async function checkLiveStatus(pageId) {
  try {
    const res = await fetch(`https://idenfit.com/wp-json/wp/v2/pages/${pageId}`);
    return res.status;
  } catch {
    return 'FETCH_ERROR';
  }
}

async function main() {
  const pages = JSON.parse(readFileSync(PAGES_PATH, 'utf-8'));
  const byId = new Map(pages.map((p) => [p.id, p]));
  const LOCALES = ['tr', 'en', 'nl', 'it'];

  const report = [];

  for (const trSlug of CANDIDATE_TR_SLUGS) {
    const trEntry = pages.find((p) => p.slug === trSlug && p.pll_language === 'tr');
    if (!trEntry) {
      report.push({ trSlug, error: 'TR sayfası pages.json içinde bulunamadı' });
      continue;
    }
    const translations = trEntry.pll_translations || {};
    const localeData = {};
    for (const locale of LOCALES) {
      const id = translations[locale];
      if (!id) {
        localeData[locale] = { status: 'KAYNAKTA_HİÇ_YOK' };
        continue;
      }
      const entry = byId.get(id);
      if (!entry) {
        // pll_translations id'ye işaret ediyor ama pages.json'da yok —
        // canlı API'de gerçekten var mı (yayınlanmamış/taslak) kontrol et.
        const liveStatus = await checkLiveStatus(id);
        localeData[locale] = { status: 'EXPORT_DIŞI', liveApiId: id, liveApiStatus: liveStatus };
        continue;
      }
      const schema = detectSchema(entry.acf || {});
      const heroTitle = heroTitleFor(entry.acf || {}, schema);
      const sectionCount = roughSectionCount(entry.acf || {}, schema);
      const faq = faqQuestions(entry.acf || {});
      localeData[locale] = {
        status: 'VAR',
        id: entry.id,
        slug: entry.slug,
        link: entry.link,
        schema,
        heroTitle,
        sectionCount,
        faqCount: faq.length,
        faqQuestions: faq.slice(0, 3),
      };
    }
    report.push({ trSlug, locales: localeData });
  }

  writeFileSync('scripts/_remaining-modules-scan.json', JSON.stringify(report, null, 2));
  console.log(`Tarandı: ${report.length} modül. Ham veri: scripts/_remaining-modules-scan.json`);
  for (const r of report) {
    if (r.error) {
      console.log(`❌ ${r.trSlug}: ${r.error}`);
      continue;
    }
    console.log(`\n=== ${r.trSlug} ===`);
    for (const locale of LOCALES) {
      const d = r.locales[locale];
      if (d.status === 'VAR') {
        console.log(`  ${locale}: [${d.schema}] "${d.heroTitle}" | bloklar: ${d.sectionCount} | SSS: ${d.faqCount}`);
      } else if (d.status === 'EXPORT_DIŞI') {
        console.log(`  ${locale}: EXPORT DIŞI (id ${d.liveApiId}, canlı API: ${d.liveApiStatus})`);
      } else {
        console.log(`  ${locale}: KAYNAKTA HİÇ YOK (pll_translations'ta bile referans yok)`);
      }
    }
  }
}

main();
