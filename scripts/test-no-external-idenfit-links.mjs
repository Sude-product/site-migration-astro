// Sitede "idenfit.com" içeren ama DIŞ link olmaması gereken href'leri
// tarar. Kök neden: birkaç sayfa (ör. Güvenlik'in KVKK maddesi) kaynak
// WP verisinden gelen TAM (mutlak) `https://idenfit.com/...` URL'lerini
// dış link sanıp `target=_blank` ile canlı siteye gönderiyordu — artık o
// sayfaların kendi gerçek karşılığı bizim sitemizde de var, bu yüzden bu
// tür linkler İÇ (relative) link olmalı.
//
// `astro build` çıktısındaki (`dist/**/*.html`) TÜM href'ler taranır —
// kaynak kodu grep'lemek yeterli değil, çünkü `localizeCtaUrl()`/
// `resolveTileCta()` gibi fonksiyonlar birçok ham `idenfit.com` URL'ini
// render zamanında relative'e çeviriyor (bkz. `hubContent.ts`,
// `productContent.ts`) — yalnızca GERÇEKTEN render edilmiş HTML güvenilir.
//
// İzin verilen istisnalar (bilinçli, gerçek dış linkler):
// - `app.idenfit.com` (canlı uygulama — giriş/kayıt linkleri, CTA URL'leri
//   `?lang=xx` query param'ıyla — bunlar GERÇEKTEN app.idenfit.com'a
//   gitmeli, bizim sitemizde bir karşılığı yok)
// - `my.idenfit.com` (canlı müşteri hesabı portalı — Şirket Takvimi
//   modülünün metninde gerçek, kaynaktan gelen bir referans; zaten
//   `target=_blank` ile işaretli, bizim sitemizde bir karşılığı yok)
// - `mailto:...@idenfit.com` (e-posta adresi, link değil)
// - `/wp-content/uploads/...` (gerçek PDF/görsel — proje genelinde
//   bilinçli olarak hotlink ediliyor, bkz. CLAUDE.md; bunlar SAYFA değil
//   medya dosyası, "kendi sitemizde karşılığı olması gereken bir sayfa"
//   kategorisine girmiyor)
const ALLOWED_HOSTNAMES = new Set(['app.idenfit.com', 'my.idenfit.com']);
//
// Çalıştırma: `astro build` sonrası → `node scripts/test-no-external-idenfit-links.mjs`

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

function listHtmlFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) out.push(...listHtmlFiles(full));
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

function isAllowed(href) {
  if (href.startsWith('mailto:')) return true;
  if (href.includes('/wp-content/uploads/')) return true;
  try {
    const url = new URL(href);
    if (ALLOWED_HOSTNAMES.has(url.hostname)) return true;
  } catch {
    // relative URL — asla "idenfit.com" içermez, buraya düşmez zaten
  }
  return false;
}

let files;
try {
  files = listHtmlFiles(DIST);
} catch {
  console.error(`'${DIST}/' bulunamadı — önce 'npx astro build' çalıştırın.`);
  process.exit(1);
}

const findings = [];
for (const file of files) {
  const html = readFileSync(file, 'utf-8');
  const hrefRe = /href="([^"]*idenfit\.com[^"]*)"/gi;
  for (const m of html.matchAll(hrefRe)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (!isAllowed(href)) findings.push({ file, href });
  }
}

if (findings.length === 0) {
  console.log(`✅ ${files.length} HTML dosyası tarandı — dış idenfit.com linki bulunamadı.`);
  process.exit(0);
}

console.log(`❌ ${findings.length} şüpheli dış link bulundu (${files.length} dosya tarandı):\n`);
for (const f of findings) {
  console.log(`  ${f.file.replace(/\\/g, '/')}\n    → ${f.href}`);
}
process.exit(1);
