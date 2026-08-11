// JSON-LD (structured data) denetimi (2026-08-10) — `check-title-length.mjs`/
// `check-meta-description-length.mjs` ile AYNI desen (`dist/**/*.html`
// taranır, redirect stub'ları hariç tutulur, `readdir({recursive:true})`
// KULLANILMAZ — bkz. o script'lerdeki OneDrive-flakiness notu).
//
// Google'ın Rich Results Test'i / schema.org'un resmi validator'ı bu ortamda
// (internet erişimi/canlı URL olmadan) çağrılamaz — bu script AYNI kuralları
// YEREL olarak uyguluyor: geçerli JSON söz dizimi, `@context`/`@type`
// zorunlu alanları, `BlogPosting` için Google'ın "Article" rich result
// gereksinimleri (headline, image, datePublished — dateModified ÖNERİLEN),
// ISO 8601 tarih formatı doğrulaması, ve `dateModified >= datePublished`
// mantık kontrolü (bir yazı yayınlanmadan ÖNCE "güncellenmiş" olamaz).
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = process.env.DIST_DIR ?? 'dist';
const ISO_8601_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

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

// `BlogPosting`/`Article`'ın Google Rich Results için zorunlu/önerilen alanları.
const REQUIRED_BY_TYPE = {
  BlogPosting: ['headline', 'image', 'datePublished'],
  Article: ['headline', 'image', 'datePublished'],
};
const RECOMMENDED_BY_TYPE = {
  BlogPosting: ['dateModified', 'author', 'publisher'],
  Article: ['dateModified', 'author', 'publisher'],
};

function validateBlock(block) {
  const errors = [];
  const warnings = [];

  if (!block['@context'] || !String(block['@context']).includes('schema.org')) {
    errors.push('`@context` eksik veya "schema.org" içermiyor');
  }
  if (!block['@type']) {
    errors.push('`@type` eksik');
  }

  const type = block['@type'];
  const required = REQUIRED_BY_TYPE[type] ?? [];
  const recommended = RECOMMENDED_BY_TYPE[type] ?? [];
  for (const field of required) {
    if (!block[field]) errors.push(`zorunlu alan eksik: \`${field}\` (@type: ${type})`);
  }
  for (const field of recommended) {
    if (!block[field]) warnings.push(`önerilen alan eksik: \`${field}\` (@type: ${type})`);
  }

  for (const dateField of ['datePublished', 'dateModified']) {
    const value = block[dateField];
    if (value && !ISO_8601_RE.test(value)) {
      errors.push(`\`${dateField}\` ISO 8601 formatında değil: "${value}"`);
    }
  }

  if (block.datePublished && block.dateModified && ISO_8601_RE.test(block.datePublished) && ISO_8601_RE.test(block.dateModified)) {
    const published = new Date(block.datePublished).getTime();
    const modified = new Date(block.dateModified).getTime();
    if (modified < published) {
      errors.push(`\`dateModified\` (${block.dateModified}) \`datePublished\`'tan (${block.datePublished}) ÖNCE — mantıksız`);
    }
  }

  return { errors, warnings };
}

const files = await findHtmlFiles(DIST_DIR);
if (files.length === 0) {
  console.error(`❌ '${DIST_DIR}/' içinde .html dosyası bulunamadı — önce 'npx astro build' çalıştırın.`);
  process.exit(2);
}

let pagesWithJsonLd = 0;
let pagesWithoutJsonLd = 0;
let totalBlocks = 0;
let invalidBlocks = 0;
let blocksWithWarnings = 0;
const invalidExamples = [];
const warningExamples = [];
const typeCounts = {};

for (const file of files) {
  const html = await readFile(file, 'utf8');
  if (/<meta\s+http-equiv="refresh"/i.test(html)) continue; // redirect stub

  const rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  const matches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  if (matches.length === 0) {
    pagesWithoutJsonLd++;
    continue;
  }
  pagesWithJsonLd++;

  for (const m of matches) {
    totalBlocks++;
    let parsed;
    try {
      parsed = JSON.parse(m[1]);
    } catch (err) {
      invalidBlocks++;
      invalidExamples.push({ file: rel, error: `JSON söz dizimi hatası: ${err.message}` });
      continue;
    }
    typeCounts[parsed['@type']] = (typeCounts[parsed['@type']] ?? 0) + 1;
    const { errors, warnings } = validateBlock(parsed);
    if (errors.length > 0) {
      invalidBlocks++;
      invalidExamples.push({ file: rel, error: errors.join('; ') });
    }
    if (warnings.length > 0) {
      blocksWithWarnings++;
      if (warningExamples.length < 5) warningExamples.push({ file: rel, warning: warnings.join('; ') });
    }
  }
}

console.log('\n=== JSON-LD (Structured Data) Denetimi ===');
console.log(`Taranan sayfa (redirect stub'ları hariç): ${pagesWithJsonLd + pagesWithoutJsonLd}`);
console.log(`JSON-LD içeren sayfa: ${pagesWithJsonLd}`);
console.log(`JSON-LD İÇERMEYEN sayfa: ${pagesWithoutJsonLd} (bilgi amaçlı — henüz yalnızca blog'a kuruldu)`);
console.log(`\nToplam JSON-LD bloğu: ${totalBlocks}`);
console.log('Tür dağılımı:', typeCounts);
console.log(`Geçersiz blok: ${invalidBlocks}`);
console.log(`Uyarılı (önerilen alan eksik) blok: ${blocksWithWarnings}`);

if (invalidExamples.length > 0) {
  console.log('\n--- Geçersiz bloklar (ilk 10) ---');
  for (const e of invalidExamples.slice(0, 10)) console.log(`  ${e.file}: ${e.error}`);
}
if (warningExamples.length > 0) {
  console.log('\n--- Uyarı örnekleri (ilk 5) ---');
  for (const e of warningExamples) console.log(`  ${e.file}: ${e.warning}`);
}

console.log(`\n=== ÖZET: ${invalidBlocks} geçersiz blok ===`);
process.exit(invalidBlocks === 0 ? 0 : 1);
