// idenfit.com'un `sectors` custom post type'ından (WP REST API, wp/v2/sectors)
// 12 sektörün 4 dildeki tam içeriğini çeker ve reference/wordpress-export/
// sectors.json'a yazar. Bu içerik önceki pages.json/posts.json export'unda
// YOKTU çünkü o export yalnızca `page` ve `post` post type'larını kapsıyordu
// — sektör sayfaları ayrı bir CPT (`sectors`) kullanıyor, WP REST API'de
// varsayılan olarak farklı bir endpoint'te durur (bkz. CLAUDE.md).
//
// Çalıştırma: node scripts/fetch-sectors.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const API_BASE = 'https://idenfit.com/wp-json/wp/v2/sectors';
const OUT_PATH = join('reference', 'wordpress-export', 'sectors.json');

async function fetchAll() {
  const res = await fetch(`${API_BASE}?per_page=100`);
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  return res.json();
}

// Medya nesnelerini küçük, kullanışlı bir forma indirger (tüm `sizes`
// varyantlarını atar — biz yalnızca orijinal URL + alt + boyut istiyoruz).
function slimImage(img) {
  if (!img || typeof img !== 'object') return null;
  return { url: img.url, alt: img.alt || img.title || '', width: img.width, height: img.height };
}

// ACF alanlarını ham WP şemasından (section_N_*, feature_N_*) düzenli bir
// şemaya çevirir — bkz. gida-sektoru-ik-cozumleri (id 11889) üzerinde
// keşfedilen gerçek yapı: 1 hero blok + 1 "neden idenfit" blok + 1 "ilgili
// sektör" çapraz-tanıtım bloğu + 3 (bazen 4) özellik/modül vurgu bloğu.
function normalizeAcf(acf) {
  const hero = {
    title: acf.section_1_title || '',
    text: acf.section_1_text || '',
    ctaText: acf.section_1_cta_text || '',
    ctaUrl: acf.section_1_cta_url || '',
    image: slimImage(acf.section_1_image),
  };
  const whyIdenfit = {
    title: acf.section_2_title || '',
    text: acf.section_2_text || '',
    image: slimImage(acf.section_2_image),
  };
  // section_3_* gerçekte BU sektörün içeriği değil — başka bir sektöre
  // çapraz-tanıtım (ör. Gıda sayfasında "Turizm Sektörü" görünüyor).
  const relatedSectorPromo = acf.section_3_title
    ? {
        title: acf.section_3_title,
        text: acf.section_3_text || '',
        ctaText: acf.section_3_cta_text || '',
        ctaUrl: acf.section_3_cta_url || '',
        image: slimImage(acf.section_3_image),
      }
    : null;

  const features = [];
  for (let i = 1; i <= 4; i++) {
    const title = acf[`feature_title_${i}`];
    if (!title) continue; // feature_4 çoğu sayfada boş — atla.
    features.push({
      title,
      text: acf[`feature_text_${i}`] || '',
      ctaText: acf[`feature_cta_text_${i}`] || '',
      ctaUrl: acf[`feature_cta_url_${i}`] || '',
      image: slimImage(acf[`feature_image_${i}`]),
    });
  }

  return { hero, whyIdenfit, relatedSectorPromo, features };
}

/** WP `slug` alanı yanıltıcı olabilir (bkz. hizmet-sektoru vakası — `slug`
 * "hizmet-sektoru" ama gerçek `link` ".../hizmet-sektoru-ik-cozumleri/").
 * Grup anahtarı olarak HER ZAMAN `link`'ten türetilen bare slug kullanılır. */
function bareSlugFromLink(link) {
  const { pathname } = new URL(link);
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length && ['tr', 'en', 'nl', 'it'].includes(parts[0])) parts.shift();
  return parts.join('/');
}

function stripHtml(html) {
  return (html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#8211;/g, '-')
    .replace(/&#038;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  const raw = await fetchAll();
  console.log(`Fetched ${raw.length} 'sectors' CPT entries from idenfit.com`);

  // Gruplama: her benzersiz TR id'si bir "sektör grubu"; pll_translations
  // üzerinden 4 dildeki karşılıklarını buluyoruz. "sectors" (id 20347,
  // yalnızca EN, TR/NL/IT karşılığı yok) gibi öksüz/taslak kayıtlar ayrı
  // not ediliyor, 12'lik gruba dahil edilmiyor.
  const byId = new Map(raw.map((e) => [e.id, e]));
  const trEntries = raw.filter((e) => e.pll_language === 'tr');
  const orphans = raw.filter((e) => {
    const t = e.pll_translations || {};
    return !t.tr; // TR karşılığı olmayan kayıtlar (ör. id 20347 "sectors")
  });

  const sectors = trEntries.map((tr) => {
    const translations = tr.pll_translations || {};
    const perLocale = {};
    for (const [locale, id] of Object.entries(translations)) {
      const entry = byId.get(id);
      if (!entry) continue;
      perLocale[locale] = {
        id: entry.id,
        slug: entry.slug,
        link: entry.link,
        title: stripHtml(entry.title?.rendered),
        modified: entry.modified,
        content: normalizeAcf(entry.acf || {}),
      };
    }
    return { trSlug: bareSlugFromLink(tr.link), locales: perLocale };
  });

  mkdirSync(join('reference', 'wordpress-export'), { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify(
      {
        _source: 'https://idenfit.com/wp-json/wp/v2/sectors (custom post type, not in original pages.json/posts.json export)',
        _fetchedAt: new Date().toISOString(),
        _note:
          'section_3_* alanı her sayfada BAŞKA bir sektöre çapraz-tanıtımdır (relatedSectorPromo) — bu sektörün kendi içeriği değildir.',
        orphanEntries: orphans.map((e) => ({ id: e.id, slug: e.slug, link: e.link, pll_language: e.pll_language, note: 'TR karşılığı yok, 12 sektör grubuna dahil edilmedi' })),
        sectors,
      },
      null,
      2,
    ),
  );
  console.log(`Wrote ${sectors.length} sector groups (x4 locale each, where available) to ${OUT_PATH}`);
  console.log(`Orphan entries (no TR translation): ${orphans.length}`, orphans.map((e) => `${e.slug} (${e.pll_language})`));

  // Hızlı özet: her grubun kaç dilde mevcut olduğu + kaç feature bloğu var.
  for (const s of sectors) {
    const langs = Object.keys(s.locales);
    const featureCounts = langs.map((l) => `${l}:${s.locales[l].content.features.length}`);
    console.log(`- ${s.trSlug} — diller: [${langs.join(', ')}] — feature blok sayısı: ${featureCounts.join(', ')}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
