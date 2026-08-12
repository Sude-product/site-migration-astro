// H1 sayısı denetimi (2026-08-12) — `check-title-length.mjs`/`check-meta-
// description-length.mjs` ile AYNI desen/mimari (`dist/**/*.html` taranır,
// redirect stub'ları hariç tutulur, ELLE recursive tarama — bkz. altındaki
// `findHtmlFiles()` yorumu). KÖK OLAY: kullanıcının bildirdiği SEO uyarısı
// — "2026-sgk-tesvikleri-rehberi-neler-degisti" blog yazısında 7 H1
// bulundu. Kök neden canlı idenfit.com'un KENDİSİNDE: WordPress Gutenberg
// editöründe bazı yazarlar ara başlıklar için yanlışlıkla "Heading 1" blok
// stilini seçmiş. Bu, iki katmanlı bir düzeltmeyle kapatıldı — bkz.
// `scripts/extract-blog-posts.mjs`'in `downgradeStrayH1sToH2()`'si
// (extraction anında, legacy JSON), `src/data/blogHeadingSanitizer.ts`'in
// `demoteBodyH1s()`'i (render-time, legacy JSON için ikinci katman) +
// `astro.config.mjs`'in `rehypeDemoteBodyH1s`'i (render-time, göç etmiş
// `.md` yazılar için — extraction script'i bu dosyalarda hiç çalışmıyor).
// Bu script o düzeltmenin KALICI doğrulama aracı: her sayfada TAM 1 H1
// olması gerektiğini (WCAG/SEO en iyi pratiği) `dist` çıktısı üzerinde
// tarar — yeni bir blog yazısı/sayfa eklendiğinde tekrar çalıştırılabilir.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = process.env.DIST_DIR ?? 'dist';

// `readdir(dir, { recursive: true })` bu OneDrive-senkronize klasörde
// GÜVENİLMEZ bulundu (bkz. CLAUDE.md §Proje kuralları) — elle recursive
// tarama kullanılıyor, diğer `check-*.mjs` script'leriyle AYNI desen.
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

const files = await findHtmlFiles(DIST_DIR);
if (files.length === 0) {
  console.error(`❌ '${DIST_DIR}/' içinde .html dosyası bulunamadı — önce 'npx astro build' çalıştırın.`);
  process.exit(2);
}

const zero = [];
const multiple = [];
let stubCount = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  // Redirect stub'ları (i18n fallback + elle `redirects`) gerçek içerik
  // taşımıyor, `<h1>` kuralı onlar için anlamsız — bkz. diğer check
  // script'lerindeki AYNI hariç tutma.
  if (/<meta\s+http-equiv="refresh"/i.test(html)) {
    stubCount++;
    continue;
  }

  const count = (html.match(/<h1[\s>]/gi) ?? []).length;
  const rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  if (count === 0) zero.push(rel);
  else if (count > 1) multiple.push({ file: rel, count });
}

console.log(`\n=== H1 Sayısı Denetimi ===`);
console.log(`Kural: her gerçek içerik sayfasında TAM 1 <h1> olmalı.`);
console.log(`Taranan sayfa: ${files.length - stubCount} (toplam ${files.length} dosyadan ${stubCount} redirect stub'ı hariç)\n`);

console.log(`--- H1 HİÇ YOK (${zero.length}) ---`);
for (const f of zero) console.log(`  ${f}`);
console.log('');

console.log(`--- BİRDEN FAZLA H1 (${multiple.length}) ---`);
for (const e of multiple) console.log(`  [${e.count}] ${e.file}`);
console.log('');

const totalIssues = zero.length + multiple.length;
console.log(`=== ÖZET: ${totalIssues} sorunlu sayfa (${zero.length} H1 yok, ${multiple.length} birden fazla H1) ===`);

process.exit(totalIssues === 0 ? 0 : 1);
