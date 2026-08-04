// İK "hub"/dizin sayfalarının (İnsan Kaynakları Modülleri,
// İşgücü Yönetimi) 3 dildeki (NL kaynakta yok, bkz. CLAUDE.md KARAR 2)
// ACF içeriğini YEREL `pages.json`'dan çıkarıp
// `reference/wordpress-export/hubs.json`'a normalize eder.
//
// Bu sayfalar standart ürün/modül şemalarına (extract-products.mjs)
// UYMUYOR — hero (section_1_*) + tanıtım bloğu (section_2_*) + bir
// "ürün tile grid" (N_product_title/text/cta_text/cta_url/image,
// `_copy`/`_copy2`.../`_copy15` sonekleriyle çoğaltılmış) + SSS
// (question_N/answer_N, hub A'da var, hub B'de hiç yok). Aşama 3.0
// taramasının "muhtemelen ACF'de içerik yok, Elementor HTML'de" tahmini
// YANLIŞ çıktı — içerik burada, ACF'de, sadece farklı bir düzende.
//
// Çalıştırma: node scripts/extract-hubs.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const PAGES_PATH = join('reference', 'wordpress-export', 'pages.json');
const OUT_PATH = join('reference', 'wordpress-export', 'hubs.json');

const HUB_TR_SLUGS = ['insan-kaynaklari-yonetimi-modulu', 'insan-kaynaklari-isgucu-yonetimi'];

function slimImage(img) {
  if (!img || typeof img !== 'object') return null;
  return { url: img.url, alt: img.alt || img.title || '', width: img.width, height: img.height };
}

function stripHtml(html) {
  return (html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#8211;/g, '-')
    .replace(/&#038;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Tile'ların kimliği alan adındaki SAYISAL önek + SONEK'in (`''`, `_copy`,
 * `_copy2`.. `_copy15`) BİRLEŞİMİDİR. Hub A'da iki tile'ın (servis,
 * "Bordrolar modülü..." başlıklı tile) CTA alanları hiç yok; ayrıca
 * yanıltıcı bir şekilde alakasız bir "17_product_cta_text_copy" /
 * "17_product_cta_url_copy2" çifti duruyor (WP'de elle veri girişi
 * kalıntısı — hangi tile'a ait olduğu belirsiz, bir tile'ın sonek'iyle
 * bile örtüşmüyor). Bu ikisini tahminle eşleştirmek (denendi, yanlış
 * sonuç verdi — bkz. git geçmişi) yerine, CTA yalnızca kendi index+sonek
 * alanında bulunuyorsa kullanılır; yoksa tile CTA'sız (tıklanamaz kart)
 * kalır — veri uydurulmaz. */
function collectProductTiles(acf) {
  const seen = new Set();
  const tiles = [];
  for (const key of Object.keys(acf)) {
    const m = key.match(/^(\d+)_product_title(_copy\d*)?$/);
    if (!m) continue;
    const [, index, suffixRaw] = m;
    const suffix = suffixRaw || '';
    const dedupeKey = `${index}${suffix}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const title = acf[`${index}_product_title${suffix}`];
    if (!title || !title.trim()) continue;

    const text = acf[`${index}_product_text${suffix}`] || '';
    const image = slimImage(acf[`${index}_product_image${suffix}`]);
    const ctaText = acf[`${index}_product_cta_text${suffix}`] || '';
    // Bazı kayıtlarda (hub A'nın "offboarding" tile'ının EN/IT'si) URL'nin
    // başında yanlışlıkla bir "#" karakteri var (Elementor link-anchor
    // artığı) — TR'de yok, gerçek bir path'in önüne yapışmış, temizlenir.
    const ctaUrl = (acf[`${index}_product_cta_url${suffix}`] || '').replace(/^#(https?:\/\/)/, '$1');

    // `key` = alan index+sonek'i (ör. '2_copy2') — tile başlığı dile göre
    // değişse de (ör. TR "evraklar" / EN "papers") bu kimlik WP şablonunda
    // locale-bağımsız sabit kalır; hubContent.ts'te belirli bir tile'ı
    // hariç tutmak için başlık metnine değil bu `key`'e göre filtrelenir.
    tiles.push({ key: dedupeKey, title, text, ctaText, ctaUrl, image });
  }
  return tiles;
}

function extractFaq(acf) {
  const faq = [];
  for (let i = 1; i <= 20; i++) {
    const question = acf[`question_${i}`];
    if (!question || !question.trim()) continue;
    faq.push({ question, answer: acf[`answer_${i}`] || '' });
  }
  return faq;
}

function extractHub(acf) {
  const hero = {
    title: acf.section_1_title || '',
    text: acf.section_1_text || '',
    ctaText: acf.section_1_cta_text || '',
    ctaUrl: acf.section_1_cta_url || '',
    image: slimImage(acf.section_1_image),
  };
  const intro =
    acf.section_2_title || acf.section_2_text
      ? { title: acf.section_2_title || '', text: acf.section_2_text || '' }
      : null;
  const tiles = collectProductTiles(acf);
  const faq = extractFaq(acf);
  return { hero, intro, tiles, faq };
}

function main() {
  const pages = JSON.parse(readFileSync(PAGES_PATH, 'utf-8'));
  const byId = new Map(pages.map((p) => [p.id, p]));

  const hubs = [];
  for (const trSlug of HUB_TR_SLUGS) {
    const trEntry = pages.find((p) => p.slug === trSlug && p.pll_language === 'tr');
    if (!trEntry) {
      console.warn(`UYARI: '${trSlug}' TR sayfası pages.json'da bulunamadı, atlanıyor.`);
      continue;
    }
    const translations = trEntry.pll_translations || {};
    const perLocale = {};
    for (const [locale, id] of Object.entries(translations)) {
      const entry = byId.get(id);
      if (!entry) continue; // KARAR 2 — kaynakta olmayan dil atlanır (bkz. CLAUDE.md)
      perLocale[locale] = {
        id: entry.id,
        slug: entry.slug,
        link: entry.link,
        title: stripHtml(entry.title?.rendered),
        ...extractHub(entry.acf || {}),
      };
    }
    hubs.push({ trSlug, locales: perLocale });
  }

  mkdirSync(join('reference', 'wordpress-export'), { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify(
      {
        _source: 'reference/wordpress-export/pages.json (yerel export, `page` post type)',
        _fetchedAt: new Date().toISOString(),
        _note:
          'Hub/dizin sayfaları — hero + tanıtım bloğu + ürün tile grid + (varsa) SSS. NL kaynakta yok (KARAR 2 gereği o dil atlandı).',
        hubs,
      },
      null,
      2,
    ),
  );

  console.log(`Wrote ${hubs.length} hub grubu -> ${OUT_PATH}`);
  for (const h of hubs) {
    const langs = Object.keys(h.locales);
    const tileCounts = langs.map((l) => `${l}:${h.locales[l].tiles.length}`);
    const faqCounts = langs.map((l) => `${l}:${h.locales[l].faq.length}`);
    console.log(`- ${h.trSlug} — diller: [${langs.join(', ')}] — tile sayısı: ${tileCounts.join(', ')} — SSS sayısı: ${faqCounts.join(', ')}`);
  }
}

main();
