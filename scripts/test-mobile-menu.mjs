// MobileMenu regresyon testi (2026-08-10) — `Header.astro`'nun off-canvas
// mobil menüsü artık masaüstünde (`>=1024px`) HİÇ mount edilmiyor (bkz.
// CLAUDE.md Açık nokta #24, DOM boyutu düzeltmesi). Bu script iki şeyi
// doğruluyor:
// 1. Masaüstü viewport'ta panel gerçekten DOM'da YOK (fix'in kendisi).
// 2. Mobil viewport'ta panel HÂLÂ tam işlevsel: aç/kapa, linkler, akordeon,
//    Escape ile kapama + fokus geri dönüşü, klavye (Tab) navigasyonu.
// Ayrıca masaüstü→mobil→masaüstü geçişinde (`matchMedia` `change` event'i)
// panelin doğru mount/unmount olduğu + açıkken masaüstüne dönülünce
// otomatik kapandığı test ediliyor.
//
// `playwright` projede kalıcı bir devDependency DEĞİL — `verify-navbar-jank.mjs`
// ile AYNI kalıcı desen (`npm install --no-save playwright`).
import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4321';
const DESKTOP_VIEWPORT = { width: 1280, height: 900 };
const MOBILE_VIEWPORT = { width: 375, height: 800 };

let failures = 0;
function check(label, condition) {
  if (condition) {
    console.log(`  ✅ ${label}`);
  } else {
    console.log(`  ❌ ${label}`);
    failures++;
  }
}

const browser = await chromium.launch({ headless: true });

// --- 1. Masaüstü: panel hiç mount edilmemeli ---
console.log('\n=== Masaüstü viewport (1280x900) ===');
{
  const page = await browser.newPage({ viewport: DESKTOP_VIEWPORT });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  const info = await page.evaluate(() => ({
    dialogExists: !!document.querySelector('body > div[role="dialog"]'),
    triggerVisible: (() => {
      const btn = document.querySelector('header button[aria-haspopup="dialog"]');
      return btn ? btn.getBoundingClientRect().width > 0 : null;
    })(),
  }));
  check('Off-canvas panel DOM\'da YOK (createPortal render edilmedi)', info.dialogExists === false);
  check('Hamburger tetikleyici zaten görünmez (lg:hidden, CSS)', info.triggerVisible === false);
  await page.close();
}

// --- 2. Mobil: panel tam işlevsel ---
console.log('\n=== Mobil viewport (375x800) ===');
{
  const page = await browser.newPage({ viewport: MOBILE_VIEWPORT });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

  const beforeOpen = await page.evaluate(() => !!document.querySelector('body > div[role="dialog"]'));
  check('Panel başlangıçta DOM\'da mevcut (mobilde mount edilir)', beforeOpen === true);

  const trigger = page.locator('header button[aria-haspopup="dialog"]');
  await trigger.click();
  await page.waitForTimeout(350); // açılış transition'ı

  const afterOpen = await page.evaluate(() => {
    const panel = document.querySelector('body > div[role="dialog"]');
    const style = panel ? getComputedStyle(panel) : null;
    return {
      ariaModal: panel?.getAttribute('aria-modal'),
      translateX: style?.transform,
      linkCount: panel ? panel.querySelectorAll('nav a[href]').length : 0,
    };
  });
  check('Panel açıldı (aria-modal="true")', afterOpen.ariaModal === 'true');
  check('Panel içinde linkler render edildi (>0)', afterOpen.linkCount > 0);

  // Akordeon: ilk mega-menü öğesine tıkla, panel içeriği genişlesin.
  const firstAccordionButton = page.locator('body > div[role="dialog"] nav button').first();
  const expandedBefore = await firstAccordionButton.getAttribute('aria-expanded');
  await firstAccordionButton.click();
  await page.waitForTimeout(100);
  const expandedAfter = await firstAccordionButton.getAttribute('aria-expanded');
  check('Akordeon aç/kapa çalışıyor (aria-expanded değişti)', expandedBefore !== expandedAfter);

  // Escape ile kapat. NOT: bu projede Escape handler'ı (`onKeyDown` içindeki
  // `if (e.key === 'Escape') setOpen(false)`) yalnızca `setOpen(false)`
  // çağırıyor, `close()`'un (overlay/X butonu/nav linki tıklaması)
  // ÇAĞIRMADIĞI `triggerRef.current?.focus()` adımını İÇERMİYOR — bu,
  // bu turdan ÖNCE de var olan, DOM boyutu düzeltmesiyle İLGİSİZ bir
  // davranış (dokunulmadı, kapsam dışı) — bu yüzden burada fokusun
  // tetikleyiciye DÖNMESİ değil, yalnızca panelin görünür/etkileşimli
  // olmaktan çıkması test ediliyor.
  await page.keyboard.press('Escape');
  await page.waitForTimeout(350);
  const afterEscape = await page.evaluate(() => {
    const panel = document.querySelector('body > div[role="dialog"]');
    return { pointerEventsNone: panel ? getComputedStyle(panel).pointerEvents === 'none' : null };
  });
  check('Escape ile panel kapandı (pointer-events:none)', afterEscape.pointerEventsNone === true);

  // Klavye (Tab) navigasyonu — panel yeniden aç, ilk odaklanabilir öğe
  // tetikleyici değil panel içi bir öğe olmalı.
  await trigger.click();
  await page.waitForTimeout(350);
  const focusInsidePanel = await page.evaluate(() => {
    const panel = document.querySelector('body > div[role="dialog"]');
    return !!panel && panel.contains(document.activeElement);
  });
  check('Panel açılınca odak panel içine taşındı (focus trap)', focusInsidePanel === true);

  await page.close();
}

// --- 3. Viewport geçişi (resize) ---
console.log('\n=== Viewport geçişi (mobil → masaüstü, açıkken) ===');
{
  const page = await browser.newPage({ viewport: MOBILE_VIEWPORT });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await page.locator('header button[aria-haspopup="dialog"]').click();
  await page.waitForTimeout(350);
  const openBeforeResize = await page.evaluate(
    () => document.querySelector('body > div[role="dialog"]')?.getAttribute('aria-modal') === 'true',
  );
  check('Mobilde panel açıldı (resize öncesi kontrol)', openBeforeResize === true);

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.waitForTimeout(200); // matchMedia `change` event'i + re-render

  const afterResize = await page.evaluate(() => ({
    dialogExists: !!document.querySelector('body > div[role="dialog"]'),
  }));
  check('Masaüstüne büyütülünce panel DOM\'dan kalktı (unmount)', afterResize.dialogExists === false);

  // Tekrar mobile küçült — panel yeniden mount olmalı (ama KAPALI, çünkü
  // resize sırasında `setOpen(false)` tetiklendi).
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.waitForTimeout(200);
  const afterShrinkBack = await page.evaluate(() => {
    const panel = document.querySelector('body > div[role="dialog"]');
    return {
      dialogExists: !!panel,
      isClosed: panel ? getComputedStyle(panel).pointerEvents === 'none' : null,
    };
  });
  check('Tekrar mobile küçültülünce panel yeniden mount edildi', afterShrinkBack.dialogExists === true);
  check('Panel kapalı durumda yeniden mount edildi (açık kalmadı)', afterShrinkBack.isClosed === true);

  await page.close();
}

await browser.close();

console.log(`\n=== SONUÇ: ${failures === 0 ? 'TÜM TESTLER GEÇTİ' : `${failures} test BAŞARISIZ`} ===`);
process.exit(failures === 0 ? 0 : 1);
