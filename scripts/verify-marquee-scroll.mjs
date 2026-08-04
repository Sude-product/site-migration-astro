// Marquee bar scroll-hide doğrulaması — 5. tur (2026-07-31).
// Marquee'nin scroll'da gizlenip gösterilmesi GERİ GETİRİLDİ (kullanıcı
// isteği) — bu turda `<header>`'ın `backdrop-blur`'ü artık kaldırılmış
// olduğundan AYNI `grid-template-rows` tekniğinin gerçekten jank'sız
// çalışıp çalışmadığı ölçülüyor. Chrome uzantısı bağlı değildi —
// Playwright (geçici kurulmuş) ile:
//  1. Video kaydı.
//  2. `requestAnimationFrame` frame-timing ölçümü (gerçek "titreme"/jank
//     göstergesi — CLS'ten farklı olarak, KASITLI/smooth bir animasyonun
//     kendisini değil, DROPPED FRAME'leri yakalar).
//  3. Gerçek toggle sayısı (`window.__marqueeToggleCount`) — gizle/göster
//     mekanizmasının fiilen çalıştığını da doğruluyor (yalnızca "jank yok"
//     değil, "özellik çalışıyor" da kanıtlanmalı).
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT_DIR = 'scripts/.tmp-marquee-verify';
mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  recordVideo: { dir: OUT_DIR, size: { width: 1280, height: 900 } },
});
const page = await context.newPage();

await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });

// A/B testi için — backdrop-blur'ü GERİ EKLEYİP (yalnızca sayfa içi CSS
// enjeksiyonuyla, gerçek dosyayı değiştirmeden) önceki 3 denemenin
// koşuluyla (blur VARKEN) karşılaştırma yapabilmek için.
if (process.argv.includes('--with-blur')) {
  await page.addStyleTag({ content: 'header.sticky { backdrop-filter: blur(8px) !important; }' });
  console.log('VARYANT: backdrop-blur GERİ EKLENDİ (karşılaştırma testi)');
}

const marqueeWrap = page.locator('#marquee-wrap');
const initialRows = await marqueeWrap.evaluate((el) => getComputedStyle(el).gridTemplateRows);
console.log('Başlangıç grid-template-rows:', initialRows);

// Frame-timing + CLS ölçümünü kur.
await page.evaluate(() => {
  window.__frameDeltas = [];
  let last = performance.now();
  function tick(now) {
    window.__frameDeltas.push(now - last);
    last = now;
    window.__rafHandle = requestAnimationFrame(tick);
  }
  window.__rafHandle = requestAnimationFrame(tick);

  window.__clsEntries = [];
  const obs = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) window.__clsEntries.push(entry.value);
  });
  obs.observe({ type: 'layout-shift', buffered: true });
});

// Gerçekçi, SÜREKLİ bir aşağı scroll (eşiği (12px) rahatça aşacak kadar
// büyük adımlarla — gerçek bir kullanıcının normal scroll hızı) — marquee
// gizlenmeli. Sonra yukarı — tekrar görünmeli. 3 tekrar.
async function scroll(totalPx, steps) {
  const perStep = totalPx / steps;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, perStep);
    await page.waitForTimeout(16);
  }
}

for (let i = 0; i < 3; i++) {
  console.log(`--- Döngü ${i + 1}/3: aşağı (400px) ---`);
  await scroll(400, 25);
  await page.waitForTimeout(350); // geçişin tamamlanmasını bekle
  const rowsAfterDown = await marqueeWrap.evaluate((el) => getComputedStyle(el).gridTemplateRows);
  console.log('  grid-template-rows:', rowsAfterDown);

  console.log(`--- Döngü ${i + 1}/3: yukarı (400px) ---`);
  await scroll(-400, 25);
  await page.waitForTimeout(350);
  const rowsAfterUp = await marqueeWrap.evaluate((el) => getComputedStyle(el).gridTemplateRows);
  console.log('  grid-template-rows:', rowsAfterUp);
}

await page.evaluate(() => cancelAnimationFrame(window.__rafHandle));

const frameDeltas = await page.evaluate(() => window.__frameDeltas);
const clsEntries = await page.evaluate(() => window.__clsEntries);
const toggleCount = await page.evaluate(() => window.__marqueeToggleCount ?? -1);
const totalCLS = clsEntries.reduce((a, b) => a + b, 0);

const jankFrames = frameDeltas.filter((d) => d > 32);
const severeJankFrames = frameDeltas.filter((d) => d > 50);
const avg = frameDeltas.reduce((a, b) => a + b, 0) / frameDeltas.length;
const sorted = [...frameDeltas].sort((a, b) => a - b);
const p95 = sorted[Math.floor(sorted.length * 0.95)];
const max = Math.max(...frameDeltas);

console.log('\n=== SONUÇ ===');
console.log('Gerçek toggle sayısı (özellik ÇALIŞIYOR mu):', toggleCount);
console.log('Toplam frame sayısı:', frameDeltas.length);
console.log('Ortalama frame süresi:', avg.toFixed(2), 'ms (60fps bütçesi: 16.67ms)');
console.log('p95 frame süresi:', p95.toFixed(2), 'ms');
console.log('Maksimum frame süresi:', max.toFixed(2), 'ms');
console.log('Jank frame sayısı (>32ms):', jankFrames.length, `(%${((jankFrames.length / frameDeltas.length) * 100).toFixed(1)})`);
console.log('Ciddi jank frame sayısı (>50ms):', severeJankFrames.length);
console.log('Toplam CLS (referans — kasıtlı animasyon nedeniyle sıfır OLMASI beklenmez):', totalCLS.toFixed(4));

await page.waitForTimeout(300);
await context.close();
await browser.close();

console.log('\nVideo kaydedildi:', OUT_DIR);
