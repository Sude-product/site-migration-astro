// Blog kategori/tag id -> {slug, name} eşlemesini idenfit.com'un canlı WP
// REST API'sinden çekip önbelleğe alır (fetch-sectors.mjs/fetch-faq.mjs ile
// aynı desen). `posts.json`'daki `categories`/`tags` alanları yalnızca ID
// dizisi (ör. [328, 1162]) — isim/slug export'a hiç dahil edilmemiş, bu
// yüzden extract-blog-posts.mjs bu önbelleğe ihtiyaç duyuyor.
//
// Çalıştırma: node scripts/fetch-blog-taxonomy.mjs

import { writeFileSync } from 'node:fs';

const OUT_DIR = 'reference/wordpress-export';

// Sayfalanmış — `tags` endpoint'i tek sayfada 129 kayıt döndürüyor
// (per_page üst sınırı 100), ilk sürüm yalnızca 1. sayfayı çekip 16 tag'i
// (posts.json'da GERÇEKTEN kullanılan) sessizce eksik bırakmıştı — 618
// yazının toplu işlenmesi sırasında `extract-blog-posts.mjs` bunları
// çözemeyip atlıyordu, fark edilip düzeltildi (bkz. CLAUDE.md).
async function fetchAll(endpoint) {
  const items = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`https://idenfit.com/wp-json/wp/v2/${endpoint}?per_page=100&page=${page}`);
    if (!res.ok) {
      if (res.status === 400 && page > 1) break; // WP: sayfa sınırının ötesi
      throw new Error(`${endpoint} fetch başarısız: ${res.status}`);
    }
    const batch = await res.json();
    if (batch.length === 0) break;
    items.push(...batch);
    const totalPages = Number(res.headers.get('x-wp-totalpages') ?? '1');
    if (page >= totalPages) break;
  }
  return items.map((it) => ({ id: it.id, slug: it.slug, name: it.name, count: it.count }));
}

const categories = await fetchAll('categories');
const tags = await fetchAll('tags');

writeFileSync(`${OUT_DIR}/blog-categories.json`, JSON.stringify(categories, null, 2));
writeFileSync(`${OUT_DIR}/blog-tags.json`, JSON.stringify(tags, null, 2));

console.log(`✅ ${categories.length} kategori → blog-categories.json`);
console.log(`✅ ${tags.length} tag → blog-tags.json`);
