// Açık nokta #45, yol (A) — 19 TypeScript/Astro dosyasındaki LİTERAL
// mutlak `https://idenfit.com/wp-content/uploads/...` hotlink'lerini
// (blog+navigation dışında kalan, hâlâ dokunulmamış 293 hotlink'in bir
// kısmı) indirir + göreliye çevirir. `scripts/download-report-assets.mjs`
// (indirme) + `scripts/relativize-blog-image-urls.mjs` (göreliye çevirme)
// ile AYNI yöntem/doğrulama mantığı, ama tek script'te birleştirildi ve
// kaynak dosya listesi CLI'dan (pilot) veya varsayılan (tüm 19 dosya) alınır.
//
// `wp-content/themes/...` (404 arka plan görseli, `NotFoundPage.astro`)
// KASITLI OLARAK KAPSAM DIŞI — farklı bir WP tema yolu, `uploads/` değil,
// ayrı ele alınıyor (bkz. CLAUDE.md Açık nokta #45).
//
// Kullanım:
//   node scripts/localize-remaining-hotlinks.mjs --files src/components/PricingPage.astro,src/components/CalculatorsPage.astro   (pilot)
//   node scripts/localize-remaining-hotlinks.mjs --all                                                                            (tüm 19 dosya)

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ALL_FILES = [
  'src/data/homeContent.ts',
  'src/data/thankYouContent.ts',
  'src/data/customerStories.ts',
  'src/data/productTranslationOverridesAz.ts',
  'src/data/productTranslationOverrides.ts',
  'src/data/supportThankYouContent.ts',
  'src/data/faqContent.ts',
  'src/data/miscPagesContent.ts',
  'src/data/hubTranslationOverridesAz.ts',
  'src/data/hubTranslationOverrides.ts',
  'src/components/PricingPage.astro',
  'src/data/customerStoryCarousel.ts',
  'src/components/CalculatorsPage.astro',
  'src/data/miscPagesTranslationOverrides.ts',
  'src/data/sectorTranslationOverrides.ts',
  'src/data/hardwareTranslationOverrides.ts',
  'src/data/calculatorDefinitions.ts',
  'src/components/icons/IdenfitLogo.tsx',
  // NotFoundPage.astro KASITLI OLARAK burada değil — themes/vault yolu,
  // ayrı script/adımda ele alınıyor.
];

const DEST_ROOT = 'public/wp-content/uploads';
const ABS_PREFIX_RE = /https?:\/\/idenfit\.com\/wp-content\/uploads\//g;
const URL_RE = /https:\/\/idenfit\.com\/wp-content\/uploads\/([^)\s"'`]+)/g;
const CONCURRENCY = 4;

const args = process.argv.slice(2);
const filesIdx = args.indexOf('--files');
const files = filesIdx !== -1 ? args[filesIdx + 1].split(',') : args.includes('--all') ? ALL_FILES : null;

if (!files) {
  console.error('Kullanım: --files a.ts,b.astro (pilot) veya --all (tüm 19 dosya)');
  process.exit(1);
}

function collectUrls(fileList) {
  const found = new Set();
  for (const f of fileList) {
    const text = readFileSync(f, 'utf-8');
    for (const m of text.matchAll(URL_RE)) found.add(m[1]);
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
  // NFC normalizasyonu YALNIZCA uzak istek URL'inde — bkz.
  // `download-json-source-images.mjs`'teki AYNI düzeltmenin tam yorumu
  // (Türkçe "İ" parçalanmış/birleşik kod noktası uyuşmazlığı, 404 nedeni).
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

async function downloadAll(urls) {
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
  return results;
}

function relativizeFiles(fileList) {
  let totalReplacements = 0;
  for (const f of fileList) {
    const text = readFileSync(f, 'utf-8');
    const matches = text.match(ABS_PREFIX_RE);
    const count = matches ? matches.length : 0;
    if (count === 0) {
      console.log(`  (atlandı, mutlak URL yok) ${f}`);
      continue;
    }
    const newText = text.replace(ABS_PREFIX_RE, '/wp-content/uploads/');
    writeFileSync(f, newText);
    totalReplacements += count;
    console.log(`✓ ${f} — ${count} URL göreli hale getirildi`);
  }
  return totalReplacements;
}

async function main() {
  console.log(`İşlenecek dosya: ${files.length}\n${files.map((f) => `  ${f}`).join('\n')}\n`);

  const urls = collectUrls(files);
  console.log(`\n=== 1/2: İndirme (${urls.length} benzersiz görsel) ===\n`);
  const results = await downloadAll(urls);
  const ok = results.filter((r) => r.status.startsWith('OK')).length;
  const skipped = results.filter((r) => r.status.startsWith('skipped')).length;
  const failed = results.filter((r) => r.status.startsWith('FAIL'));
  console.log(`\n${ok} indirildi, ${skipped} zaten mevcuttu, ${failed.length} BAŞARISIZ`);
  if (failed.length) {
    console.log('\nBaşarısız olanlar (relativize YAPILMAYACAK, dosyalar dokunulmadan kalacak):');
    for (const f of failed) console.log(`  ${f.relPath} — ${f.status}`);
    console.log('\n=== DURDURULDU: önce başarısız indirmeleri çöz ===');
    process.exit(1);
  }

  console.log(`\n=== 2/2: Göreliye çevirme ===\n`);
  const totalReplacements = relativizeFiles(files);
  console.log(`\n=== SONUÇ: ${files.length} dosya tarandı, ${totalReplacements} URL göreli hale getirildi ===`);
}

await main();
