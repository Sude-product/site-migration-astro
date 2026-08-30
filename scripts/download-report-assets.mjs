// `src/data/navigation.ts` (KEŞFET mega-menü "Raporlar" kartları) ve
// `src/pages/blog/[slug].astro` (site logosu — OG/JSON-LD publisher
// fallback'i) içindeki, hâlâ canlı idenfit.com'a hotlink olan
// `wp-content/uploads` referanslarını CANLI siteden indirip AYNI göreli
// yola (`public/wp-content/uploads/...`) yazar. `scripts/download-blog-images.mjs`
// ile aynı yöntem/doğrulama mantığı (Açık nokta #14'ün blog kısmı gibi),
// ama kaynak dosya seti farklı ve PDF de destekleniyor.
//
// Kullanım: node scripts/download-report-assets.mjs

import { readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';

const SOURCE_FILES = ['src/data/navigation.ts', 'src/pages/blog/[slug].astro'];
const DEST_ROOT = 'public/wp-content/uploads';
const URL_RE = /https:\/\/idenfit\.com\/wp-content\/uploads\/([^)\s"'`]+)/g;
const CONCURRENCY = 4;

function collectUrls() {
  const found = new Set();
  for (const f of SOURCE_FILES) {
    const text = readFileSync(f, 'utf-8');
    for (const m of text.matchAll(URL_RE)) {
      found.add(m[1]);
    }
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
  const url = `https://idenfit.com/wp-content/uploads/${relPath}`;
  const destPath = join(DEST_ROOT, relPath);
  if (existsSync(destPath) && statSync(destPath).size > 0) {
    return { relPath, status: 'skipped (already exists)' };
  }
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30000) });
    if (res.status !== 200) {
      return { relPath, status: `FAIL http ${res.status}` };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const check = isValidAsset(buf, relPath);
    if (!check.ok) {
      return { relPath, status: `FAIL invalid content (${check.reason}), ${buf.length} bytes` };
    }
    mkdirSync(dirname(destPath), { recursive: true });
    writeFileSync(destPath, buf);
    return { relPath, status: `OK ${buf.length} bytes` };
  } catch (err) {
    return { relPath, status: `FAIL ${err.message}` };
  }
}

async function main() {
  const all = collectUrls();
  console.log(`Toplam benzersiz görsel/dosya: ${all.length}\n`);

  const results = [];
  const queue = [...all];
  let done = 0;

  async function worker() {
    while (queue.length) {
      const relPath = queue.shift();
      const r = await downloadOne(relPath);
      done++;
      results.push(r);
      console.log(`[${done}/${all.length}] ${r.status.startsWith('OK') || r.status.startsWith('skipped') ? '✓' : '✗'} ${relPath} — ${r.status}`);
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
