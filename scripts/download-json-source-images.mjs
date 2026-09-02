// Açık nokta #45, yol (B) — 5 ham WordPress export JSON'unda
// (`reference/wordpress-export/products.json`/`sectors.json`/
// `hardware.json`/`hubs.json`/`misc-pages.json`) gömülü, RUNTIME'da
// `*Content.ts` dosyaları tarafından okunan `https://idenfit.com/wp-content/...`
// referanslarını indirir. Kod tarafındaki göreliye-çevirme
// (`src/data/relativizeWpUrls.ts`'in `deepRelativizeWpUrls()`'ü, her
// `*Content.ts`'in `DATA` sabitine uygulanıyor) yalnızca URL METNİNİ
// değiştirir — asıl dosyaların `public/wp-content/uploads/...` altında
// GERÇEKTEN var olması bu script'in işi (aksi halde göreli URL 404 verir).
//
// JSON ağacı derinlemesine gezilip HERHANGİ bir string alanda (yalnızca
// bilinen `image`/`url` gibi alan adlarıyla SINIRLANMADAN — zengin
// metin/HTML içine gömülü `<img src="...">` dahil) `idenfit.com/wp-content/`
// öneği aranır. `scripts/download-report-assets.mjs` ile AYNI indirme/
// doğrulama mantığı.
//
// Kullanım: node scripts/download-json-source-images.mjs

import { readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';

const JSON_FILES = [
  'reference/wordpress-export/products.json',
  'reference/wordpress-export/sectors.json',
  'reference/wordpress-export/hardware.json',
  'reference/wordpress-export/hubs.json',
  'reference/wordpress-export/misc-pages.json',
];

const DEST_ROOT = 'public/wp-content/uploads';
const URL_RE = /https:\/\/idenfit\.com\/wp-content\/uploads\/([^)\s"'`\\]+)/g;
const CONCURRENCY = 6;

function collectUrlsFromValue(value, found) {
  if (typeof value === 'string') {
    for (const m of value.matchAll(URL_RE)) found.add(m[1]);
  } else if (Array.isArray(value)) {
    for (const v of value) collectUrlsFromValue(v, found);
  } else if (value !== null && typeof value === 'object') {
    for (const v of Object.values(value)) collectUrlsFromValue(v, found);
  }
}

function collectUrls() {
  const found = new Set();
  for (const f of JSON_FILES) {
    const json = JSON.parse(readFileSync(f, 'utf-8'));
    collectUrlsFromValue(json, found);
  }
  return [...found].sort();
}

const MAGIC_CHECKS = [
  { name: 'PNG', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { name: 'JPEG', bytes: [0xff, 0xd8, 0xff] },
  { name: 'GIF', bytes: [0x47, 0x49, 0x46, 0x38] },
  { name: 'PDF', bytes: [0x25, 0x50, 0x44, 0x46] },
  { name: 'WEBP', bytes: [0x52, 0x49, 0x46, 0x46], offsetCheck: (buf) => buf.length > 11 && buf.toString('ascii', 8, 12) === 'WEBP' },
];

function isValidAsset(buf, relPath) {
  if (!buf || buf.length === 0) return { ok: false, reason: 'empty (0 byte)' };
  if (relPath.toLowerCase().endsWith('.svg')) {
    const head = buf.toString('utf-8', 0, Math.min(500, buf.length)).trim();
    if (head.startsWith('<?xml') || head.startsWith('<svg')) return { ok: true };
    return { ok: false, reason: 'svg does not start with <?xml/<svg' };
  }
  for (const check of MAGIC_CHECKS) {
    if (buf.length >= check.bytes.length && check.bytes.every((b, i) => buf[i] === b)) {
      if (check.offsetCheck && !check.offsetCheck(buf)) continue;
      return { ok: true };
    }
  }
  const head = buf.toString('utf-8', 0, Math.min(200, buf.length)).trim().toLowerCase();
  if (head.startsWith('<!doctype html') || head.startsWith('<html')) {
    return { ok: false, reason: 'received HTML instead of asset (likely 404/error page)' };
  }
  return { ok: false, reason: 'unrecognized file signature' };
}

async function downloadOne(relPath) {
  // İKİ AYRI kod noktası biçimi meselesi: `relPath` (JSON kaynağından
  // OLDUĞU GİBİ) Türkçe "İ"yi PARÇALANMIŞ (`I` + U+0307 BİRLEŞTİRME
  // NOKTASI, ham JSON metninde böyle) taşıyabilir, ama CANLI sunucudaki
  // GERÇEK dosya adı BİRLEŞİK biçimde (`İ`, U+0130) — parçalanmış haliyle
  // istek atınca 404 (doğrulandı). Çözüm: yalnızca UZAK İSTEK URL'i NFC'ye
  // normalize edilir (doğru dosyayı bulmak için); `relPath`/`destPath`
  // KASITLI OLARAK normalize EDİLMEZ — yerel dosya, kaynak JSON'un/
  // `deepRelativizeWpUrls()`'ün üreteceği GERÇEK göreli URL'le (parçalanmış
  // biçim) BİREBİR eşleşmeli, aksi halde kendi sitemizde 404 oluşur.
  const url = `https://idenfit.com/wp-content/uploads/${encodeURI(relPath.normalize('NFC'))}`;
  const destPath = join(DEST_ROOT, relPath);
  if (existsSync(destPath) && statSync(destPath).size > 0) {
    return { relPath, status: 'skipped (already exists)' };
  }
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30000) });
    if (res.status !== 200) return { relPath, status: `FAIL http ${res.status}` };
    const buf = Buffer.from(await res.arrayBuffer());
    const check = isValidAsset(buf, relPath);
    if (!check.ok) return { relPath, status: `FAIL invalid content (${check.reason}), ${buf.length} bytes` };
    mkdirSync(dirname(destPath), { recursive: true });
    writeFileSync(destPath, buf);
    return { relPath, status: `OK ${buf.length} bytes` };
  } catch (err) {
    return { relPath, status: `FAIL ${err.message}` };
  }
}

async function main() {
  const urls = collectUrls();
  console.log(`Taranan JSON dosyası: ${JSON_FILES.length}\nToplam benzersiz görsel/dosya: ${urls.length}\n`);

  const results = [];
  const queue = [...urls];
  let done = 0;
  async function worker() {
    while (queue.length) {
      const relPath = queue.shift();
      const r = await downloadOne(relPath);
      done++;
      results.push(r);
      console.log(`[${done}/${urls.length}] ${r.status.startsWith('OK') || r.status.startsWith('skipped') ? '✓' : '✗'} ${relPath} — ${r.status}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const ok = results.filter((r) => r.status.startsWith('OK')).length;
  const skipped = results.filter((r) => r.status.startsWith('skipped')).length;
  const failed = results.filter((r) => r.status.startsWith('FAIL'));

  console.log(`\n=== SONUÇ: ${ok} indirildi, ${skipped} zaten mevcuttu, ${failed.length} BAŞARISIZ ===`);
  if (failed.length) {
    console.log('\nBaşarısız olanlar:');
    for (const f of failed) console.log(`  ${f.relPath} — ${f.status}`);
  }
}

await main();
