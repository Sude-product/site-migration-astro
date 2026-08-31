// dist/client'taki TÜM sayfaları tarayıp hâlâ https://idenfit.com/wp-content/...
// (veya wp-content/themes/... gibi diğer WP yolları) adresine hotlink yapan
// referansları raporlar. Açık nokta #45 — kapsam belirleme, İNDİRME/DEĞİŞTİRME
// YAPMAZ, yalnızca raporlar.
//
// Çalıştırma: DIST_DIR=dist/client node scripts/audit-remote-hotlinks.mjs

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST_DIR = process.env.DIST_DIR || 'dist';
const URL_RE = /https:\/\/idenfit\.com\/wp-content\/[^\s"'`,)>&]+/g;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (entry.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk(DIST_DIR);
console.log(`Taranan HTML dosyası: ${files.length}\n`);

const urlToPages = new Map(); // url -> Set(pagePaths)
const pageToUrls = new Map(); // page -> Set(urls)

for (const f of files) {
  const text = readFileSync(f, 'utf-8');
  const matches = text.match(URL_RE);
  if (!matches) continue;
  const unique = new Set(matches);
  const pageUrl = '/' + f.slice(DIST_DIR.length + 1).replace(/index\.html$/, '').replace(/\\/g, '/');
  pageToUrls.set(pageUrl, unique);
  for (const u of unique) {
    if (!urlToPages.has(u)) urlToPages.set(u, new Set());
    urlToPages.get(u).add(pageUrl);
  }
}

console.log(`Hotlink içeren sayfa sayısı: ${pageToUrls.size}`);
console.log(`Benzersiz hotlink URL sayısı: ${urlToPages.size}\n`);

// Uzantıya göre kırılım
const extCount = new Map();
for (const u of urlToPages.keys()) {
  const ext = (u.split('.').pop() || '').split('?')[0].toLowerCase();
  extCount.set(ext, (extCount.get(ext) || 0) + 1);
}
console.log('=== Uzantıya göre kırılım (benzersiz dosya) ===');
for (const [ext, n] of [...extCount.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  .${ext}: ${n}`);
}

// Sayfa türüne göre kırılım (path'in ilk segmentine göre kaba kategori)
function categorize(pageUrl) {
  const noLocale = pageUrl.replace(/^\/(en|nl|it|az)\//, '/');
  const seg = noLocale.split('/').filter(Boolean)[0] || '(kök)';
  return seg;
}
const pageCategoryCount = new Map();
for (const p of pageToUrls.keys()) {
  const cat = categorize(p);
  pageCategoryCount.set(cat, (pageCategoryCount.get(cat) || 0) + 1);
}
console.log('\n=== Sayfa yoluna göre kaba kırılım (ilk path segmenti, locale hariç) ===');
for (const [cat, n] of [...pageCategoryCount.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  /${cat}: ${n} sayfa`);
}

console.log('\n=== En çok kullanılan 15 hotlink URL (kaç sayfada geçiyor) ===');
const topUrls = [...urlToPages.entries()].sort((a, b) => b[1].size - a[1].size).slice(0, 15);
for (const [u, pages] of topUrls) {
  console.log(`  [${pages.size} sayfa] ${u}`);
}

console.log('\n=== Örnek sayfa listesi (ilk 20) ===');
for (const p of [...pageToUrls.keys()].slice(0, 20)) {
  console.log(`  ${p}  (${pageToUrls.get(p).size} hotlink)`);
}
