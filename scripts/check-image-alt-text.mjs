// Görsel `alt` metni denetimi (2026-08-10) — `check-link-accessibility.mjs`/
// `check-title-length.mjs`/`check-meta-description-length.mjs`/
// `check-json-ld.mjs` ile AYNI desen (`dist/**/*.html` taranır, redirect
// stub'ları hariç tutulur, `parse5`'e dayanır, `readdir({recursive:true})`
// KULLANILMAZ — bkz. o script'lerdeki OneDrive-flakiness notu, en az 2 kez
// art arda çalıştırıp aynı sayıyı verdiği doğrulanmalı).
//
// KURAL (WCAG 1.1.1 / axe-core ile AYNI mantık): `alt=""` (boş string) —
// DEKORATİF bir görsel için GEÇERLİ ve BİLİNÇLİ bir işaret, İHLAL DEĞİL.
// `alt` özniteliği TAMAMEN YOK (undefined) — HER ZAMAN bir ihlal, dekoratif
// olsa bile (tarayıcı/ekran okuyucu dosya adını/URL'i duyurur). Bu script
// yalnızca İKİNCİ durumu ("alt hiç yok") tarıyor — birincisi zaten doğru.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'parse5';

const DIST_DIR = process.env.DIST_DIR ?? 'dist';

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

function getAttr(node, name) {
  return node.attrs?.find((a) => a.name === name);
}

function outerSummary(node) {
  const attrs = (node.attrs ?? [])
    .filter((a) => ['src', 'class'].includes(a.name))
    .map((a) => `${a.name}="${a.value.length > 70 ? a.value.slice(0, 70) + '…' : a.value}"`)
    .join(' ');
  return `<img ${attrs}>`;
}

function scanDocument(root, filePath, violations) {
  function walk(node) {
    if (node.tagName === 'img') {
      const altAttr = getAttr(node, 'alt');
      if (!altAttr) {
        // `alt` özniteliği TAMAMEN yok (`altAttr === undefined`) — boş
        // string (`alt=""`, dekoratif için GEÇERLİ) burada YAKALANMAZ,
        // `getAttr` onu bulur (`find` boş string'i de eşleştirir).
        violations.push({
          file: filePath,
          src: getAttr(node, 'src')?.value ?? '(src yok)',
          summary: outerSummary(node),
        });
      }
    }
    for (const c of node.childNodes ?? []) walk(c);
  }
  walk(root);
}

const files = await findHtmlFiles(DIST_DIR);
if (files.length === 0) {
  console.error(`❌ '${DIST_DIR}/' içinde .html dosyası bulunamadı — önce 'npx astro build' çalıştırın.`);
  process.exit(2);
}

const allViolations = [];
for (const file of files) {
  const html = await readFile(file, 'utf8');
  if (/<meta\s+http-equiv="refresh"/i.test(html)) continue; // redirect stub
  const doc = parse(html);
  scanDocument(doc, path.relative(DIST_DIR, file).replace(/\\/g, '/'), allViolations);
}

// `src`'e göre tekilleştir (aynı görsel birçok sayfada tekrar edebilir —
// ör. paylaşılan bir modül ekran görüntüsü, logo, İK Olgunluk Testi ikonu).
const bySrc = new Map();
for (const v of allViolations) {
  if (!bySrc.has(v.src)) bySrc.set(v.src, { src: v.src, summary: v.summary, files: [], count: 0 });
  const entry = bySrc.get(v.src);
  entry.count++;
  if (entry.files.length < 3) entry.files.push(v.file);
}

console.log('\n=== Görsel `alt` Metni Denetimi ===');
console.log(`Taranan dosya: ${files.length}`);
console.log(`Ham bulgu (tüm sayfalarda toplam): ${allViolations.length}`);
console.log(`Benzersiz sorunlu görsel (src'e göre): ${bySrc.size}\n`);

let i = 1;
for (const entry of [...bySrc.values()].sort((a, b) => b.count - a.count)) {
  console.log(`${i}. ${entry.summary}`);
  console.log(`   src: ${entry.src}`);
  console.log(`   Görüldüğü sayfa sayısı: ${entry.count} (ör. ${entry.files.join(', ')}${entry.count > entry.files.length ? ', …' : ''})`);
  console.log('');
  i++;
}

if (bySrc.size === 0) {
  console.log("✅ `alt` özniteliği eksik görsel bulunamadı.");
  process.exit(0);
} else {
  console.log(`❌ ${bySrc.size} benzersiz görselde \`alt\` özniteliği hiç yok (yukarıda listelendi).`);
  process.exit(1);
}
