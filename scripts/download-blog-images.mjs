// 622 blog yazısının .md dosyalarındaki https://idenfit.com/wp-content/uploads/...
// görsel referanslarını TARAR, henüz `public/wp-content/uploads/...`da mevcut
// olmayanları CANLI idenfit.com'dan indirip AYNI göreli yola yazar (Açık nokta
// #14 — uploads.zip bu makinede yok, bu yüzden zip yerine doğrudan HTTP).
// URL metinleri .md dosyalarında DEĞİŞTİRİLMEZ — yalnızca dosyalar yerelleştirilir.
//
// Kullanım:
//   node scripts/download-blog-images.mjs --limit 25   (pilot)
//   node scripts/download-blog-images.mjs               (kalanların tamamı)

import { readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const BLOG_DIR = 'src/content/blog';
const DEST_ROOT = 'public/wp-content/uploads';
const URL_RE = /https:\/\/idenfit\.com\/wp-content\/uploads\/([^)\s"'`]+)/g;
const CONCURRENCY = 6;

const args = process.argv.slice(2);
const limitIdx = args.indexOf('--limit');
const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;

function collectUrls() {
  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  const found = new Set();
  for (const f of files) {
    const text = readFileSync(join(BLOG_DIR, f), 'utf-8');
    for (const m of text.matchAll(URL_RE)) {
      found.add(m[1]); // relative path after uploads/
    }
  }
  return [...found].sort();
}

const MAGIC_CHECKS = [
  { name: 'PNG', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { name: 'JPEG', bytes: [0xff, 0xd8, 0xff] },
  { name: 'GIF', bytes: [0x47, 0x49, 0x46, 0x38] },
  { name: 'WEBP', bytes: [0x52, 0x49, 0x46, 0x46], offsetCheck: (buf) => buf.length > 11 && buf.toString('ascii', 8, 12) === 'WEBP' },
];

function isValidImage(buf, relPath) {
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
  // HTML error page mistakenly saved as image (common failure mode)
  const head = buf.toString('utf-8', 0, Math.min(200, buf.length)).trim().toLowerCase();
  if (head.startsWith('<!doctype html') || head.startsWith('<html')) {
    return { ok: false, reason: 'received HTML instead of image (likely 404/error page)' };
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
    const check = isValidImage(buf, relPath);
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
  const todo = all.slice(0, limit);
  console.log(`Toplam benzersiz görsel: ${all.length}, bu turda işlenecek: ${todo.length}\n`);

  const results = [];
  const queue = [...todo];
  let done = 0;

  async function worker() {
    while (queue.length) {
      const relPath = queue.shift();
      const r = await downloadOne(relPath);
      done++;
      results.push(r);
      console.log(`[${done}/${todo.length}] ${r.status.startsWith('OK') || r.status.startsWith('skipped') ? '✓' : '✗'} ${relPath} — ${r.status}`);
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
