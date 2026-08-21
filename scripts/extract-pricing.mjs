// Fiyatlar/Pricing sayfasının (Mikro/KOBİ/Pro 3 katmanlı fiyat tablosu)
// ACF verisini `pages.json`'dan (standart `page` post type, network YOK)
// normalize edip `reference/wordpress-export/pricing.json`'a yazar.
// `template-pricing.php` şablonunu kullanan 4 sayfa (tr/en/nl/it),
// `pll_translations` ile birbirine bağlı.
//
// Alan adları TUTARSIZ (bu projede sık görülen desen): SME/Pro planlarının
// "telefon/çevrimiçi destek" ve "AI işe alım" eklentisi farklı sayfalarda
// farklı adlarla saklanmış (`sme_-_telefoncevrimici_destek` boşken asıl
// veri `sme_-_telefoncevrimici`'de; `sme_-_ai_ise_alim` yerine `sme_-_ai_alim`;
// `sme_bordro`/`sme-lms`/`sme-yan_haklar` alt çizgi yerine tire kullanıyor).
// `firstDefined()` her satır için tüm bilinen varyantları sırayla dener.
//
// Çalıştırma: node scripts/extract-pricing.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const PAGES_PATH = join('reference', 'wordpress-export', 'pages.json');
const OUT_PATH = join('reference', 'wordpress-export', 'pricing.json');

function bareSlugFromLink(link) {
  const { pathname } = new URL(link);
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length && ['tr', 'en', 'nl', 'it'].includes(parts[0])) parts.shift();
  return parts.join('/');
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/&#8211;/g, '-').replace(/\s+/g, ' ').trim();
}

function listFromHtml(html) {
  return [...(html || '').matchAll(/<li>(.*?)<\/li>/gs)].map((m) =>
    m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim(),
  );
}

function firstDefined(acf, keys) {
  for (const k of keys) {
    if (acf[k] !== undefined && acf[k] !== null && acf[k] !== '') return acf[k];
  }
  return '';
}

const FEATURE_ROWS = [
  { key: 'akademi', suffixes: ['idenfit_akademi'] },
  { key: 'chatbot', suffixes: ['hr_ai_chatbot'] },
  { key: 'ozelGelistirme', suffixes: ['ozel_gelistirme'] },
  { key: 'raporlama', suffixes: ['raporlama'] },
  { key: 'destek', suffixes: ['telefoncevrimici_destek', 'telefoncevrimici'] },
  { key: 'odeme', suffixes: ['cevrimici_odeme'] },
  { key: 'egitim', suffixes: ['uygulama_egitimi'] },
  { key: 'topluAktarim', suffixes: ['toplu_aktarim'] },
];

const ADDON_ROWS = [
  { key: 'dijitalImza', suffixes: ['dijital_imza'] },
  { key: 'okrPerformans', suffixes: ['okr_&_performans'] },
  { key: 'aiIseAlim', suffixes: ['ai_ise_alim', 'ai_alim'] },
  { key: 'bordro', suffixes: ['bordro'] },
  { key: 'lms', suffixes: ['lms'] },
  { key: 'yanHaklar', suffixes: ['yan_haklar'] },
];

function extractPlanRows(acf, planPrefixes, rows) {
  const out = {};
  for (const row of rows) {
    const keys = planPrefixes.flatMap((prefix) =>
      row.suffixes.flatMap((suf) => [`${prefix}_-_${suf}`, `${prefix}-${suf}`, `${prefix}_${suf}`]),
    );
    out[row.key] = firstDefined(acf, keys);
  }
  return out;
}

function extractPricing(acf) {
  return {
    pageTitle: acf.page_title || '',
    featuresTitle: acf.features_title || '',
    addonsTitle: acf['add-ons_title'] || '',
    packagesTitle: acf.packages_title || '',
    featureNames: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => acf[`feature_name_${i}`] || ''),
    addonNames: [1, 2, 3, 4, 5, 6].map((i) => acf[`add-on_name_${i}`] || ''),
    micro: {
      planTitle: acf.mikro_plan_title || '',
      employeeRange: acf.employee_range || '',
      modules: listFromHtml(acf.micro_modules),
      price: acf.micro_price || '',
      priceSuffix: '',
      ctaText: acf.mikro_cta_text || '',
      ctaUrl: acf.mikro_cta_url || '',
      features: extractPlanRows(acf, ['micro'], FEATURE_ROWS),
      addons: extractPlanRows(acf, ['micro'], ADDON_ROWS),
    },
    sme: {
      planTitle: acf.sme_plan_title || '',
      employeeRange: acf.sme_employee_range || '',
      modules: listFromHtml(acf.sme_modules),
      price: acf.sme_price || '',
      priceSuffix: acf.sme_price_suffix || '',
      ctaText: acf.sme_cta_text || '',
      ctaUrl: acf.sme_cta_url || '',
      features: extractPlanRows(acf, ['sme'], FEATURE_ROWS),
      addons: extractPlanRows(acf, ['sme'], ADDON_ROWS),
    },
    pro: {
      planTitle: acf.pro_plan_title || '',
      employeeRange: '',
      modules: listFromHtml(acf.Pro_modules),
      modulesMore: listFromHtml(acf.Pro_modules_more),
      showMoreText: acf['pro_-_show_more_button_text'] || '',
      showLessText: acf['pro_-_show_less_button_text'] || '',
      price: acf.Pro_price || '',
      priceSuffix: acf.Pro_price_suffix || '',
      ctaText: acf.Pro_cta_text || '',
      ctaUrl: acf.Pro_cta_url || '',
      getQuoteText: acf.Pro_get_a_quote || '',
      features: extractPlanRows(acf, ['Pro'], FEATURE_ROWS),
      addons: extractPlanRows(acf, ['Pro'], ADDON_ROWS),
    },
  };
}

const byId = new Map(JSON.parse(readFileSync(PAGES_PATH, 'utf-8')).map((p) => [p.id, p]));
const pages = [...byId.values()];

const trEntry = pages.find(
  (p) => p.pll_language === 'tr' && p.template === 'pricing/template-pricing.php',
);
if (!trEntry) {
  console.error('UYARI: Fiyatlar TR sayfası bulunamadı.');
  process.exit(1);
}

const translations = trEntry.pll_translations || {};
const locales = {};
for (const [locale, id] of Object.entries(translations)) {
  const entry = byId.get(id);
  if (!entry) continue;
  locales[locale] = {
    id: entry.id,
    slug: bareSlugFromLink(entry.link),
    title: stripHtml(entry.title?.rendered),
    modified: entry.modified,
    content: extractPricing(entry.acf || {}),
  };
}

mkdirSync(join('reference', 'wordpress-export'), { recursive: true });
writeFileSync(
  OUT_PATH,
  JSON.stringify({ trSlug: 'fiyatlar', locales }, null, 2),
);

console.log(`Wrote pricing data (${Object.keys(locales).join(', ')}) to ${OUT_PATH}`);
