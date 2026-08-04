// SSS sayfasında (accordion → sekmeli tasarıma geçişten sonra, bkz.
// CLAUDE.md) LanguageSwitcher'ın her locale'den doğru hedeflere gittiğini
// uçtan uca doğrular. `test-sector-language-switch.mjs`/
// `test-product-language-switch.mjs` ile aynı desen (embedded astro-island
// `urls` prop'unu çözüp gerçek HTTP isteği atar) — SSS tek bir sayfa
// olduğu için zincir yerine TAM MATRİS test edilir: TR/EN/IT sayfalarının
// HER BİRİNİN kendi switcher'ından diğer 3 locale'e giden URL 200
// döndürüyor mu (NL dahil — NL'in kendi sayfası yok, `getFaqLocaleUrls()`
// artık NL'i doğrudan EN'in gerçek URL'ine eşliyor, bkz. faqContent.ts).
//
// Gereksinim: dev server ayakta olmalı (`astro dev --background`).
// Çalıştırma: node scripts/test-faq-language-switch.mjs

const BASE = 'http://localhost:4321';
const ENTRY_URLS = {
  tr: `${BASE}/sss/`,
  en: `${BASE}/en/faq/`,
  it: `${BASE}/it/faq/`,
};

function unwrap(node) {
  if (!Array.isArray(node)) return node;
  const [tag, value] = node;
  if (tag === 0) return value;
  if (tag === 1) return value.map(unwrap);
  return value;
}

function extractLanguageSwitcherUrls(html) {
  const marker = 'component-url="/src/components/LanguageSwitcher.tsx"';
  const idx = html.indexOf(marker);
  if (idx === -1) return null;
  const propsStart = html.indexOf('props="', idx);
  if (propsStart === -1) return null;
  const valueStart = propsStart + 'props="'.length;
  const valueEnd = html.indexOf('"', valueStart);
  const raw = html
    .slice(valueStart, valueEnd)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
  const parsed = JSON.parse(raw);
  const urlsRaw = unwrap(parsed.urls);
  const urls = {};
  for (const [locale, val] of Object.entries(urlsRaw)) urls[locale] = unwrap(val);
  return urls;
}

async function fetchPage(url) {
  const res = await fetch(url, { redirect: 'follow' });
  const html = await res.text();
  return { status: res.status, html };
}

async function main() {
  console.log('SSS sayfası dil değiştirici matris testi başlıyor...\n');
  let total = 0;
  let ok = 0;
  const failures = [];

  for (const [fromLocale, entryUrl] of Object.entries(ENTRY_URLS)) {
    const { status, html } = await fetchPage(entryUrl);
    if (status !== 200) {
      console.log(`❌ ${fromLocale} (${entryUrl}) → sayfa ${status} döndü`);
      failures.push({ fromLocale, toLocale: '-', reason: `giriş sayfası ${status}` });
      total++;
      continue;
    }
    const urls = extractLanguageSwitcherUrls(html);
    if (!urls) {
      console.log(`❌ ${fromLocale} (${entryUrl}) → LanguageSwitcher bulunamadı`);
      failures.push({ fromLocale, toLocale: '-', reason: 'switcher bulunamadı' });
      total++;
      continue;
    }
    console.log(`== ${fromLocale} (${entryUrl}) ==`);
    for (const toLocale of ['tr', 'en', 'nl', 'it']) {
      if (toLocale === fromLocale) continue;
      total++;
      const targetUrl = urls[toLocale];
      if (!targetUrl) {
        console.log(`  ${fromLocale} → ${toLocale}: FAIL — urls['${toLocale}'] eksik`);
        failures.push({ fromLocale, toLocale, reason: 'urls eksik' });
        continue;
      }
      const fullTargetUrl = targetUrl.startsWith('http') ? targetUrl : `${BASE}${targetUrl}`;
      const target = await fetchPage(fullTargetUrl);
      if (target.status === 200) {
        ok++;
        console.log(`  ${fromLocale} → ${toLocale}: OK (${targetUrl})`);
      } else {
        console.log(`  ${fromLocale} → ${toLocale}: FAIL — ${target.status} (${fullTargetUrl})`);
        failures.push({ fromLocale, toLocale, reason: `${target.status} (${fullTargetUrl})` });
      }
    }
  }

  console.log(`\n=== SONUÇ: ${ok}/${total} geçiş başarılı ===`);
  if (failures.length > 0) {
    console.log('\nBaşarısız geçişler:');
    for (const f of failures) console.log(`  - ${f.fromLocale} → ${f.toLocale}: ${f.reason}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
