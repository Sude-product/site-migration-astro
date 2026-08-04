// idenfit.com'un `faq` custom post type'ından (WP REST API, wp/v2/faq) 90
// SSS kaydını + `faq-category` taxonomy'sini çeker, reference/wordpress-export/
// faq.json'a yazar. Bu içerik `sectors`/`donanim` gibi orijinal pages.json
// export'una hiç dahil değildi (ayrı bir CPT) — CLAUDE.md'de "faq CPT'si
// gerçek, dolu içerik (90 kayıt), henüz çekilmedi" olarak not edilmişti.
//
// ÖNEMLİ BULGU (bkz. KARAR 2, kullanıcıyla netleşti): idenfit.com'un canlı
// `/sss/` sayfası kendi ACF `question_N`/`answer_N` alanlarını KULLANMIYOR
// (hepsi boş) — sayfadaki TÜM sorular bu `faq` CPT'sinden geliyor,
// kategori başlıklarına göre gruplanmış düz bir liste olarak (accordion
// widget'ı YOK). Bu script o gerçek kaynağı çekiyor.
//
// `faq` CPT'sinde Polylang meta (`pll_language`/`pll_translations`) REST
// alanları AÇIK DEĞİL (pages/sectors'ın aksine) — dil, `link` URL'sinin
// locale önekinden türetiliyor (`/en/blog/faq/...` → en, `/it/blog/faq/...`
// → it, önek yoksa → tr). **NL hiç yok** (CLAUDE.md'de zaten not edilmişti).
//
// Kategori sırası: her dilde 6 kategori var, WP term id'leri her dilde
// KENDİ İÇİNDE artan sırada gerçek sitedeki görünüm sırasıyla birebir
// örtüşüyor (doğrulandı: TR 158→168, EN 170→181, IT 1085→1099) — bu
// yüzden kategoriler `id` küçükten büyüğe sıralanarak kaynaktaki sırayla
// aynı sırada yazılıyor.
//
// Çalıştırma: node scripts/fetch-faq.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const API_BASE = 'https://idenfit.com/wp-json/wp/v2';
const OUT_PATH = join('reference', 'wordpress-export', 'faq.json');

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API request failed (${res.status}): ${url}`);
  return res.json();
}

function localeFromLink(link) {
  const { pathname } = new URL(link);
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'en' || parts[0] === 'it' || parts[0] === 'nl') return parts[0];
  return 'tr';
}

function cleanHtml(html) {
  return (html || '').replace(/\s(class|style|id)="[^"]*"/g, '').trim();
}

async function main() {
  const [faqRaw, categoriesRaw] = await Promise.all([
    fetchJson(`${API_BASE}/faq?per_page=100`),
    fetchJson(`${API_BASE}/faq-category?per_page=100`),
  ]);
  console.log(`Fetched ${faqRaw.length} 'faq' CPT entries, ${categoriesRaw.length} 'faq-category' terms`);

  const categoriesById = new Map(categoriesRaw.map((c) => [c.id, c]));

  const categories = { tr: [], en: [], it: [] };
  const faq = { tr: [], en: [], it: [] };

  for (const entry of faqRaw) {
    const locale = localeFromLink(entry.link);
    if (locale === 'nl') continue; // beklenmiyor, savunmacı
    const categoryId = entry['faq-category']?.[0];
    const category = categoriesById.get(categoryId);
    faq[locale].push({
      id: entry.id,
      slug: entry.slug,
      link: entry.link,
      question: (entry.title?.rendered || '').trim(),
      answer: cleanHtml(entry.content?.rendered),
      categoryId: categoryId ?? null,
      categorySlug: category?.slug ?? null,
    });
  }

  for (const term of categoriesRaw) {
    // Terimin kendi dilini, o kategoriyi kullanan İLK faq kaydının
    // dilinden türetiyoruz (taxonomy endpoint'inde de dil alanı yok).
    const sample = faqRaw.find((e) => e['faq-category']?.[0] === term.id);
    if (!sample) continue;
    const locale = localeFromLink(sample.link);
    if (locale === 'nl') continue;
    categories[locale].push({ id: term.id, slug: term.slug, name: term.name, count: term.count });
  }
  for (const locale of ['tr', 'en', 'it']) {
    categories[locale].sort((a, b) => a.id - b.id);
    faq[locale].sort((a, b) => a.id - b.id);
  }

  mkdirSync(join('reference', 'wordpress-export'), { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify(
      {
        _source: 'https://idenfit.com/wp-json/wp/v2/faq + wp/v2/faq-category (custom post type, pages.json export\'una dahil değildi)',
        _fetchedAt: new Date().toISOString(),
        _note:
          "idenfit.com'un canlı /sss/ (ve /en/faq/, /it/faq/) sayfaları bu CPT'den besleniyor — sayfanın kendi ACF question_N/answer_N alanları boş/kullanılmıyor. NL hiç yok (dil bazında sistemik boşluk, diğer birçok sayfada görülen örüntüyle tutarlı).",
        // SSS "indeks" sayfasının kendi per-locale slug'ları — bunlar bu
        // CPT'nin İÇİNDE değil, `pages.json`'daki `sss`/`faq`/`faq-3`
        // sayfalarının GERÇEK `link` alanından (WP `slug` değil) elle
        // doğrulandı: tr `/sss/`, en `/en/faq/`, it `/it/faq/`. NL yok.
        trSlug: 'sss',
        localeSlugs: { tr: 'sss', en: 'faq', it: 'faq' },
        categories,
        faq,
      },
      null,
      2,
    ),
  );

  console.log(`Wrote ${OUT_PATH}`);
  for (const locale of ['tr', 'en', 'it']) {
    console.log(`- ${locale}: ${categories[locale].length} kategori, ${faq[locale].length} soru`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
