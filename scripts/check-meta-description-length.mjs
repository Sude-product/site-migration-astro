// Meta description uzunluk denetimi (2026-08-10) — Google'ın arama
// sonuçlarında snippet olarak kullandığı `<meta name="description">`
// çok kısa (kesik/anlamsız görünür) veya çok uzun (kırpılır) olmamalı.
// Hedef aralık: 70-160 karakter (SEO endüstri standardı — Google genelde
// ~155-160 karaktere kadar gösterir, 70'in altı "muhtemelen yetersiz
// açıklama" sinyali sayılır).
//
// `dist/**/*.html` (build çıktısı) taranır — `check-link-accessibility.mjs`
// ile AYNI desen (`npm run build` sonrası doğrudan çalıştırılabilir, canlı
// sunucu GEREKMİYOR). Aynı 4 dilin (`tr`/`en`/`nl`/`it`) hepsi ayrı ayrı
// taranıyor — bir dilde eksik olan diğer dillerde düzeltilmiş olabilir,
// bu yüzden href/dosya bazlı, dil-BAĞIMSIZ bir liste tutuluyor.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = process.env.DIST_DIR ?? 'dist';
const MIN_LENGTH = 70;
const MAX_LENGTH = 160;

// `readdir(dir, { recursive: true })` GÜVENİLMEZ bulundu (2026-08-10) —
// bu proje OneDrive-senkronize bir klasörde, Node'un recursive readdir'i
// bazen (görünürde rastgele) yalnızca 1 dosya döndürdü (gerçek sayı 2368).
// Elle recursive tarama (alt dizin başına ayrı `readdir`) bu ortamda
// istikrarlı — `check-title-length.mjs`/`check-link-accessibility.mjs`
// ile AYNI düzeltme.
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

function decodeEntities(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

const files = await findHtmlFiles(DIST_DIR);
if (files.length === 0) {
  console.error(`❌ '${DIST_DIR}/' içinde .html dosyası bulunamadı — önce 'npx astro build' çalıştırın.`);
  process.exit(2);
}

const tooShort = [];
const tooLong = [];
const missing = [];
let checked = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  // Redirect stub'ları (`<meta http-equiv="refresh">`) gerçek içerik
  // taşımıyor — description denetimi kapsam dışı (bkz. noindex denetimi,
  // CLAUDE.md Açık nokta #27 — aynı 1490 sayfa burada da gürültü yaratırdı).
  if (/<meta\s+http-equiv="refresh"/i.test(html)) continue;

  checked++;
  const rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  const m = html.match(/<meta\s+name="description"\s+content="([^"]*)"\s*\/?>/i);
  if (!m) {
    missing.push({ file: rel });
    continue;
  }
  const desc = decodeEntities(m[1]).trim();
  const len = desc.length;
  if (len === 0) {
    missing.push({ file: rel });
  } else if (len < MIN_LENGTH) {
    tooShort.push({ file: rel, length: len, desc });
  } else if (len > MAX_LENGTH) {
    tooLong.push({ file: rel, length: len, desc });
  }
}

console.log(`\n=== Meta Description Uzunluk Denetimi ===`);
console.log(`Hedef aralık: ${MIN_LENGTH}-${MAX_LENGTH} karakter`);
console.log(`Taranan sayfa (redirect stub'ları hariç): ${checked}\n`);

function report(title, list, showLen = true) {
  console.log(`--- ${title} (${list.length}) ---`);
  for (const e of list) {
    if (showLen) {
      console.log(`  [${String(e.length).padStart(3)}] ${e.file}`);
      console.log(`        "${e.desc}"`);
    } else {
      console.log(`  ${e.file}`);
    }
  }
  console.log('');
}

report(`ÇOK KISA (<${MIN_LENGTH} karakter)`, tooShort);
report(`ÇOK UZUN (>${MAX_LENGTH} karakter)`, tooLong);
report('META DESCRIPTION YOK/BOŞ', missing, false);

const totalIssues = tooShort.length + tooLong.length + missing.length;
console.log(`=== ÖZET: ${totalIssues} sorunlu sayfa (${tooShort.length} kısa, ${tooLong.length} uzun, ${missing.length} eksik) ===`);

process.exit(totalIssues === 0 ? 0 : 1);
