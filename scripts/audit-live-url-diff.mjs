// Cutover-öncesi kapsamlı URL denetimi (2026-09-04) — canlı idenfit.com'un
// GÜNCEL Yoast sitemap'i (4 alt-sitemap: post/page/sectors/category) ile
// projenin KENDİ ürettiği `sitemap-0.xml`'i (site alanı aktif olduğu için
// artık mutlak URL'ler taşıyor) karşılaştırır. Yalnızca RAPOR üretir,
// hiçbir dosyayı değiştirmez.
//
// Kullanım:
//   1) Canlı 4 sitemap dosyasını `scratchpad-live-*.xml` olarak indir
//      (bkz. konuşma geçmişi — Invoke-WebRequest ile).
//   2) `astro build` (dist/client/sitemap-0.xml güncel olmalı).
//   3) `node scripts/audit-live-url-diff.mjs`
import { readFileSync } from 'node:fs';

const LIVE_FILES = [
  'scratchpad-live-post-sitemap.xml',
  'scratchpad-live-page-sitemap.xml',
  'scratchpad-live-sectors-sitemap.xml',
  'scratchpad-live-category-sitemap.xml',
];
const OURS_FILE = 'dist/client/sitemap-0.xml';

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1].trim());
}

function toPath(url) {
  const u = new URL(url);
  let p = u.pathname;
  if (!p.endsWith('/')) p += '/';
  return p;
}

const live = new Set();
for (const f of LIVE_FILES) {
  const xml = readFileSync(f, 'utf-8');
  for (const loc of extractLocs(xml)) live.add(toPath(loc));
}

const oursXml = readFileSync(OURS_FILE, 'utf-8');
const ours = new Set(extractLocs(oursXml).map(toPath));

const onlyLive = [...live].filter((p) => !ours.has(p)).sort();
const onlyOurs = [...ours].filter((p) => !live.has(p)).sort();

console.log(`Canlı toplam: ${live.size}, Bizim toplam: ${ours.size}`);
console.log(`\n=== YALNIZCA CANLIDA (${onlyLive.length}) ===`);
for (const p of onlyLive) console.log(`  ${p}`);
console.log(`\n=== YALNIZCA BİZDE (${onlyOurs.length}) ===`);
for (const p of onlyOurs) console.log(`  ${p}`);
