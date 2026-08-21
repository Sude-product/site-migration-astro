// `<html lang="...">` denetimi (2026-08-12) — `check-heading-hierarchy.mjs`/
// `check-json-ld.mjs` ile AYNI desen (`dist/**/*.html` taranır, ELLE
// recursive tarama — bkz. o script'lerdeki OneDrive-flakiness notu).
//
// KÖK OLAY: kullanıcının bildirdiği bir SEO/erişilebilirlik uyarısı —
// "<html> etiketinde lang özniteliği eksik". `BaseLayout.astro`/
// `LandingLayout.astro` incelendi: İKİSİ DE doğru (`BaseLayout` dinamik
// `Astro.currentLocale`'den geliyor, `LandingLayout` bilinçli olarak
// sabit "tr" — `/demo` TR-only bir sayfa, KARAR 2). Gerçek eksiklik
// bizim `src/` kodumuzda DEĞİL — Astro'nun KENDİ i18n fallback/`redirects`
// mekanizmasının ürettiği redirect stub şablonunda (`node_modules/astro/
// dist/core/routing/3xx.js`'in `redirectTemplate()`'i, framework-içi,
// bizim değiştiremeyeceğimiz bir kod) — bu şablon `<html>` etiketini HİÇ
// üretmiyor (yalnızca `<!doctype html><title>...<meta refresh>...<body>`).
// Bu script bu iki kategoriyi AYRI raporluyor: gerçek içerik sayfaları
// (hata/uyarı olarak) vs redirect stub'ları (bilgi amaçlı, "hata" DEĞİL —
// zaten `noindex` taşıyorlar, aynı diğer check-*.mjs script'lerinin
// stub'ları hariç tutma ilkesiyle tutarlı, bkz. CLAUDE.md Açık nokta #27).
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = process.env.DIST_DIR ?? 'dist';
const VALID_LOCALES = ['tr', 'en', 'nl', 'it', 'az'];

async function findHtmlFiles(dir) {
  const results = [];
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(fullPath);
      else if (entry.isFile() && entry.name.endsWith('.html')) results.push(fullPath);
    }
  }
  await walk(dir);
  return results;
}

// URL yoluna göre BEKLENEN locale — TR prefix'siz (`prefixDefaultLocale: false`),
// diğerleri `/en/`/`/nl/`/`/it/` önekli (bkz. astro.config.mjs).
function expectedLocaleFor(relPath) {
  const parts = relPath.split(/[\\/]/).filter(Boolean);
  if (VALID_LOCALES.includes(parts[0]) && parts[0] !== 'tr') return parts[0];
  return 'tr';
}

const files = await findHtmlFiles(DIST_DIR);
if (files.length === 0) {
  console.error(`❌ '${DIST_DIR}/' içinde .html dosyası bulunamadı — önce 'npx astro build' çalıştırın.`);
  process.exit(2);
}

let stubCount = 0;
let stubMissingLang = 0; // bilgi amaçlı, hata SAYILMIYOR
const missing = [];
const wrongLocale = [];
let checkedRealPages = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  const isStub = /<meta\s+http-equiv="refresh"/i.test(html);

  const m = html.match(/<html\b[^>]*\blang="([^"]*)"/i);

  if (isStub) {
    stubCount++;
    if (!m) stubMissingLang++;
    continue;
  }

  checkedRealPages++;
  if (!m || !m[1].trim()) {
    missing.push(rel);
    continue;
  }
  const expected = expectedLocaleFor(rel);
  if (m[1] !== expected) {
    wrongLocale.push({ file: rel, found: m[1], expected });
  }
}

console.log(`\n=== <html lang> Denetimi ===`);
console.log(`Gerçek içerik sayfası (redirect stub hariç): ${checkedRealPages}`);
console.log(`Redirect stub sayfası: ${stubCount} (bilgi amaçlı — Astro'nun kendi framework şablonu hiç <html> üretmiyor, bkz. dosyanın kendi yorumu)`);
console.log(`  -> stub'ların ${stubMissingLang}/${stubCount}'inde <html lang> yok (BEKLENEN davranış, hata DEĞİL)\n`);

console.log(`--- GERÇEK İÇERİK SAYFASINDA lang EKSİK/BOŞ (${missing.length}) ---`);
for (const f of missing) console.log(`  ${f}`);
console.log('');

console.log(`--- GERÇEK İÇERİK SAYFASINDA YANLIŞ lang DEĞERİ (${wrongLocale.length}) ---`);
for (const e of wrongLocale) console.log(`  ${e.file}: "${e.found}" (beklenen: "${e.expected}")`);
console.log('');

const totalIssues = missing.length + wrongLocale.length;
console.log(`=== ÖZET: ${totalIssues} sorunlu GERÇEK sayfa (${missing.length} eksik, ${wrongLocale.length} yanlış) — redirect stub'ları hariç ===`);

process.exit(totalIssues === 0 ? 0 : 1);
