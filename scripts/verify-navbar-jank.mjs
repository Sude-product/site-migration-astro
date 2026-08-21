// Navbar (header + marquee) scroll jank/flicker teşhisi (2026-07-31).
// Chrome uzantısı bağlı değildi — DevTools Performance'ın yerine gerçek
// bir Chromium (Playwright, geçici kurulmuş) ile:
//  1. `context.tracing` (Chrome DevTools Performance paneliyle AYNI trace
//     formatı — kullanıcı isterse `trace.zip`'i DevTools'a yükleyip
//     birebir inceleyebilir) kaydediliyor.
//  2. Sayfa içinde bir `requestAnimationFrame` döngüsüyle GERÇEK frame
//     sürelerini ölçüyoruz — 16.7ms (60fps) bütçesini aşan frame'ler
//     "jank" sayılıyor, >50ms olanlar "ciddi jank".
//  3. Video kaydı (görsel kanıt).
// Argüman: --label <isim> → sonuç dosyalarının adına eklenir (before/after
// karşılaştırması için).
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const label = process.argv.includes('--label') ? process.argv[process.argv.indexOf('--label') + 1] : 'run';
const OUT_DIR = 'scripts/.tmp-navbar-jank';
mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  recordVideo: { dir: OUT_DIR, size: { width: 1280, height: 900 } },
});
const page = await context.newPage();

await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
// Sayfanın yeterince uzun olduğundan emin ol (scroll edilecek yer olsun).
const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
console.log(`[${label}] Sayfa yüksekliği: ${bodyHeight}px`);

// Hızlı A/B testi için — gerçek dosyaları değiştirip dev:clean yapmadan,
// sayfa içine CSS override enjekte ederek varyant deniyoruz. Yalnızca ölçüm
// amaçlı, kalıcı değil.
const variant = process.argv.includes('--variant') ? process.argv[process.argv.indexOf('--variant') + 1] : 'none';
if (variant === 'no-blur') {
  await page.addStyleTag({ content: 'header.sticky { backdrop-filter: none !important; }' });
  console.log(`[${label}] VARYANT: backdrop-blur kaldırıldı (test)`);
} else if (variant === 'no-willchange') {
  await page.addStyleTag({ content: 'header.sticky { will-change: auto !important; }' });
  console.log(`[${label}] VARYANT: will-change kaldırıldı (test)`);
} else if (variant === 'no-blur-no-willchange') {
  await page.addStyleTag({ content: 'header.sticky { backdrop-filter: none !important; will-change: auto !important; }' });
  console.log(`[${label}] VARYANT: backdrop-blur + will-change kaldırıldı (test)`);
} else if (variant === 'opaque-bg') {
  await page.addStyleTag({ content: 'header.sticky { backdrop-filter: none !important; background-color: #ffffff !important; }' });
  console.log(`[${label}] VARYANT: backdrop-blur kaldırıldı + tam opak beyaz zemin (test)`);
}

await context.tracing.start({ screenshots: true, snapshots: true });

// Frame-timing ölçümü — gerçek rAF aralıklarını kaydet.
await page.evaluate(() => {
  window.__frameDeltas = [];
  let last = performance.now();
  function tick(now) {
    window.__frameDeltas.push(now - last);
    last = now;
    window.__rafHandle = requestAnimationFrame(tick);
  }
  window.__rafHandle = requestAnimationFrame(tick);
});

// Gerçekçi, SÜREKLİ (jitter'sız, düz) bir scroll — kullanıcının tarif
// ettiği "normal scroll sırasında navbar titriyor" senaryosu; marquee
// artık gizlenmediği için burada yön değişimi/eşik testi YOK, yalnızca
// düz aşağı/yukarı scroll performansı ölçülüyor.
async function smoothScroll(totalPx, steps) {
  const perStep = totalPx / steps;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, perStep);
    await page.waitForTimeout(16);
  }
}

console.log(`[${label}] Aşağı scroll (600px, 40 adım)...`);
await smoothScroll(600, 40);
await page.waitForTimeout(200);
console.log(`[${label}] Yukarı scroll (600px, 40 adım)...`);
await smoothScroll(-600, 40);
await page.waitForTimeout(200);
console.log(`[${label}] Tekrar aşağı (1200px, 60 adım, daha hızlı)...`);
await smoothScroll(1200, 30);
await page.waitForTimeout(300);

await page.evaluate(() => cancelAnimationFrame(window.__rafHandle));

const frameDeltas = await page.evaluate(() => window.__frameDeltas);
await context.tracing.stop({ path: `${OUT_DIR}/trace-${label}.zip` });

const jankFrames = frameDeltas.filter((d) => d > 32); // 2x 16.7ms bütçesi
const severeJankFrames = frameDeltas.filter((d) => d > 50);
const avg = frameDeltas.reduce((a, b) => a + b, 0) / frameDeltas.length;
const max = Math.max(...frameDeltas);
const sorted = [...frameDeltas].sort((a, b) => a - b);
const p95 = sorted[Math.floor(sorted.length * 0.95)];

console.log(`\n=== SONUÇ [${label}] ===`);
console.log('Toplam frame sayısı:', frameDeltas.length);
console.log('Ortalama frame süresi:', avg.toFixed(2), 'ms (60fps bütçesi: 16.67ms)');
console.log('p95 frame süresi:', p95.toFixed(2), 'ms');
console.log('Maksimum frame süresi:', max.toFixed(2), 'ms');
console.log('Jank frame sayısı (>32ms):', jankFrames.length, `(%${((jankFrames.length / frameDeltas.length) * 100).toFixed(1)})`);
console.log('Ciddi jank frame sayısı (>50ms):', severeJankFrames.length);
console.log('Trace kaydedildi:', `${OUT_DIR}/trace-${label}.zip`, '(Chrome DevTools Performance paneline yüklenebilir)');

await context.close();
await browser.close();

console.log(`Video: ${OUT_DIR}`);
