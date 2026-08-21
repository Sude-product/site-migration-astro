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
//
// SEVİYE ATLAMASI DENETİMİ (2026-08-13 eklendi) — kullanıcının bildirdiği
// "Başlık hiyerarşisi sıralı değil" SEO uyarısı üzerine. ÖNCEDEN bu script
// yalnızca H1 SAYISINI kontrol ediyordu, seviye SIRASINI (H1→H3 gibi bir
// atlama olup olmadığını) HİÇ kontrol etmiyordu — bu tur o eksiği kapatıyor.
// Kural: ardışık iki başlık arasında (belge sırasına göre) yeni seviye,
// öncekinden 1'den FAZLA büyükse (ör. H1'den H3'e, H2'den H4'e) bu bir
// "atlama" — WCAG 1.3.1/en iyi pratik ihlali (AZALAN geçişler, ör. H4'ten
// H2'ye dönmek, SORUN DEĞİL — bir alt bölümü kapatıp yeni bir üst bölüme
// geçmek geçerli). **Yalnızca `<main>...</main>` içi taranıyor** — Header'ın
// mega-menü'sü + Footer'ın kolon başlıkları da `<h3>` kullanıyor (site
// geneli, HER sayfada), belge TAMAMI taranırsa bunlar gerçek içerik
// hiyerarşisiyle hiç ilgisi olmayan sahte "atlama" sinyalleri üretir (ör.
// H1'den hemen sonra Footer'ın H3'ü gelirse yanlışlıkla H1→H3 atlaması
// gibi görünür) — `check-html-lang-attribute.mjs`/legal heading turlarında
// kullanılan AYNI `<main>` izolasyon ilkesi.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = process.env.DIST_DIR ?? 'dist';

// `readdir(dir, { recursive: true })` bu OneDrive-senkronize klasörde
// GÜVENİLMEZ bulundu (bkz. CLAUDE.md §Proje kuralları) — elle recursive
// tarama kullanılıyor, diğer `check-*.mjs` script'leriyle AYNI desen.
//
// EK GÜVENLİK AĞI (2026-08-13) — bu turda BULUNAN daha SİNSİ bir flakiness
// çeşidi: elle recursive tarama BİLE, belirli TEK bir alt dizinin (`dist/
// sozlesme/`) kendi `readdir()` çağrısı SESSİZCE BOŞ dizi döndürüyordu —
// üst dizinde doğru şekilde bir klasör olarak GÖRÜNÜYOR, `isDirectory()`
// doğru `true` dönüyor, recursion doğru TETİKLENİYOR, ama o TEK çağrının
// kendisi 3 gerçek alt klasörü yok sayıyor. Script 3 kez ART ARDA
// çalıştırılıp AYNI (yanlış) düşük sayıyı verdi — önceki turların "2 kez
// çalıştır, aynı sayı çıkarsa güven" varsayımı BU türden flakiness'i
// YAKALAMAZ (bkz. `find` ile çapraz doğrulama, CLAUDE.md 26. tur). Çözüm:
// boş dönen bir dizin okumasını KISA bir gecikmeyle 1 kez tekrar dene —
// gerçekten boş bir dizin tekrar denemede de boş kalır (zararsız), sahte
// boş sonuç genelde tekrar denemede düzeliyor.
async function readdirWithRetry(dir) {
  let entries = await readdir(dir, { withFileTypes: true });
  let attempt = 0;
  while (entries.length === 0 && attempt < 5) {
    attempt++;
    await new Promise((resolve) => setTimeout(resolve, 200));
    entries = await readdir(dir, { withFileTypes: true });
    if (entries.length > 0) console.error(`  [retry] '${dir}' boş döndü, ${attempt}. denemede düzeldi (${entries.length} entry).`);
  }
  if (entries.length === 0) console.error(`  [uyarı] '${dir}' 5 denemeden sonra hâlâ boş — gerçekten boş olabilir.`);
  return entries;
}

async function findHtmlFiles(dir) {
  const results = [];
  async function walk(current) {
    const entries = await readdirWithRetry(current);
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

// `<main>...</main>` gövdesini çıkarır — yalnızca ilk çift kullanılıyor,
// önceki turlarda (legal heading sanitizer, html-lang denetimi) her
// sayfada TAM 1 `<main>` olduğu doğrulanmıştı, aynı varsayım burada da
// geçerli.
function extractMain(html) {
  const start = html.indexOf('<main');
  const end = html.indexOf('</main>');
  if (start === -1 || end === -1) return html;
  return html.slice(start, end);
}

// Ardışık başlık çiftlerinde seviye atlaması (>1 artış) arıyor. AZALAN
// geçişler (ör. H4→H2) sorun DEĞİL, yalnızca ARTAN >1 sıçrama flag'leniyor.
function findLevelSkips(mainHtml) {
  const levels = [...mainHtml.matchAll(/<h([1-6])[\s>]/gi)].map((m) => Number(m[1]));
  const skips = [];
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) skips.push(`H${levels[i - 1]}→H${levels[i]}`);
  }
  return skips;
}

const zero = [];
const multiple = [];
const levelSkips = [];
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

  const skips = findLevelSkips(extractMain(html));
  if (skips.length > 0) levelSkips.push({ file: rel, skips });
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

console.log(`=== Seviye Atlaması Denetimi ===`);
console.log(`Kural: ardışık başlıklar arasında >1 seviye ARTIŞI olmamalı (ör. H1→H3, H2→H4) — AZALAN geçişler (ör. H4→H2) sorun DEĞİL. Yalnızca <main> içi taranıyor.\n`);
console.log(`--- SEVİYE ATLAMASI VAR (${levelSkips.length}) ---`);
for (const e of levelSkips) console.log(`  [${e.skips.join(', ')}] ${e.file}`);
console.log('');

const totalIssues = zero.length + multiple.length + levelSkips.length;
console.log(
  `=== ÖZET: ${totalIssues} sorunlu sayfa (${zero.length} H1 yok, ${multiple.length} birden fazla H1, ${levelSkips.length} seviye atlaması) ===`,
);

process.exit(totalIssues === 0 ? 0 : 1);
