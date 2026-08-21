// <title> uzunluk denetimi (2026-08-10) — `check-meta-description-length.mjs`
// ile AYNI desen/mimari (parse5 tabanlı, `dist/**/*.html` taranır, redirect
// stub'ları hariç tutulur). Hedef aralık: 50-60 karakter — Google'ın arama
// sonuçlarında title genelde ~60 karaktere kadar kesilmeden gösterilir,
// 50'nin altı "muhtemelen yetersiz/az açıklayıcı başlık" sinyali sayılır.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = process.env.DIST_DIR ?? 'dist';
const MIN_LENGTH = 50;
const MAX_LENGTH = 60;

// `readdir(dir, { recursive: true })` GÜVENİLMEZ bulundu (2026-08-10) —
// bu proje OneDrive-senkronize bir klasörde, Node'un recursive readdir'i
// bazen (görünürde rastgele) yalnızca 1 dosya döndürdü (gerçek sayı 2368).
// Elle recursive tarama (alt dizin başına ayrı `readdir`) bu ortamda
// istikrarlı — üç check script'inin (title/description/link) HEPSİNDE
// AYNI düzeltme uygulandı, sonuçlar art arda 2 kez çalıştırılıp
// karşılaştırılarak doğrulandı.
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

for (const file of files) {
  const html = await readFile(file, 'utf8');
  if (/<meta\s+http-equiv="refresh"/i.test(html)) continue;

  const rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  const m = html.match(/<title>([^<]*)<\/title>/i);
  if (!m) {
    missing.push({ file: rel });
    continue;
  }
  const title = decodeEntities(m[1]).trim();
  const len = title.length;
  if (len === 0) {
    missing.push({ file: rel });
  } else if (len < MIN_LENGTH) {
    tooShort.push({ file: rel, length: len, title });
  } else if (len > MAX_LENGTH) {
    tooLong.push({ file: rel, length: len, title });
  }
}

console.log(`\n=== Title Uzunluk Denetimi ===`);
console.log(`Hedef aralık: ${MIN_LENGTH}-${MAX_LENGTH} karakter`);
const checked = files.length - (tooShort.length + tooLong.length === 0 ? 0 : 0);
console.log(`Taranan sayfa (redirect stub'ları hariç, missing dahil): ${files.length}\n`);

function report(title, list, showLen = true) {
  console.log(`--- ${title} (${list.length}) ---`);
  for (const e of list) {
    if (showLen) {
      console.log(`  [${String(e.length).padStart(3)}] ${e.file}`);
      console.log(`        "${e.title}"`);
    } else {
      console.log(`  ${e.file}`);
    }
  }
  console.log('');
}

report(`ÇOK KISA (<${MIN_LENGTH} karakter)`, tooShort);
report(`ÇOK UZUN (>${MAX_LENGTH} karakter)`, tooLong);
report('TITLE YOK/BOŞ', missing, false);

const totalIssues = tooShort.length + tooLong.length + missing.length;
console.log(`=== ÖZET: ${totalIssues} sorunlu sayfa (${tooShort.length} kısa, ${tooLong.length} uzun, ${missing.length} eksik) ===`);

process.exit(totalIssues === 0 ? 0 : 1);
