// Sektör sayfalarında LanguageSwitcher'ın gerçek (locale-başına farklı
// slug'lı) URL'ler ürettiğini uçtan uca doğrular. Her sektör için TR
// sayfasından başlayıp o sayfanın KENDİ LanguageSwitcher'ının verdiği
// EN URL'ine gider, oradan NL'e, oradan IT'ye — 3 zincirleme geçiş.
// Gereksinim: dev server ayakta olmalı (`astro dev --background`).
//
// Çalıştırma: node scripts/test-sector-language-switch.mjs

import { readFileSync } from 'node:fs';

const BASE = 'http://localhost:4321';
const CHAIN = ['tr', 'en', 'nl', 'it'];

function trSlugsFromSectorsJson() {
  const data = JSON.parse(readFileSync('reference/wordpress-export/sectors.json', 'utf-8'));
  return data.sectors.map((s) => s.trSlug).sort();
}

/** Astro'nun serialize ettiği `[0, value]` / `[1, [...]]` tuple'larını sade değere çözer. */
function unwrap(node) {
  if (!Array.isArray(node)) return node;
  const [tag, value] = node;
  if (tag === 0) return value;
  if (tag === 1) return value.map(unwrap);
  return value;
}

/** Bir sayfa HTML'inden LanguageSwitcher astro-island'ının `urls` prop'unu çıkarır. */
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
  const res = await fetch(url);
  const html = await res.text();
  return { status: res.status, html };
}

async function testSector(trSlug) {
  const results = [];
  // 1) TR sayfasına git (kanonik TR slug zaten trSlug'ın kendisi).
  let currentUrl = `${BASE}/${trSlug}/`;
  for (let i = 0; i < CHAIN.length - 1; i++) {
    const fromLocale = CHAIN[i];
    const toLocale = CHAIN[i + 1];
    const { status, html } = await fetchPage(currentUrl);
    if (status !== 200) {
      results.push({ trSlug, fromLocale, toLocale, ok: false, reason: `${fromLocale} sayfası ${status} döndü (${currentUrl})` });
      break;
    }
    const urls = extractLanguageSwitcherUrls(html);
    if (!urls) {
      results.push({ trSlug, fromLocale, toLocale, ok: false, reason: `LanguageSwitcher bulunamadı (${currentUrl})` });
      break;
    }
    const targetUrl = urls[toLocale];
    if (!targetUrl) {
      results.push({ trSlug, fromLocale, toLocale, ok: false, reason: `urls['${toLocale}'] eksik (${currentUrl})` });
      break;
    }
    const fullTargetUrl = targetUrl.startsWith('http') ? targetUrl : `${BASE}${targetUrl}`;
    const target = await fetchPage(fullTargetUrl);
    results.push({
      trSlug,
      fromLocale,
      toLocale,
      ok: target.status === 200,
      url: targetUrl,
      reason: target.status === 200 ? null : `${toLocale} hedefi ${target.status} döndü (${fullTargetUrl})`,
    });
    if (target.status !== 200) break;
    currentUrl = fullTargetUrl;
  }
  return results;
}

async function main() {
  const trSlugs = trSlugsFromSectorsJson();
  console.log(`${trSlugs.length} sektör için TR→EN→NL→IT zincir testi başlıyor...\n`);

  let totalHops = 0;
  let okHops = 0;
  const failures = [];

  for (const trSlug of trSlugs) {
    const results = await testSector(trSlug);
    const allOk = results.length === CHAIN.length - 1 && results.every((r) => r.ok);
    console.log(`${allOk ? '✅' : '❌'} ${trSlug}`);
    for (const r of results) {
      totalHops++;
      if (r.ok) {
        okHops++;
        console.log(`   ${r.fromLocale} → ${r.toLocale}: OK (${r.url})`);
      } else {
        console.log(`   ${r.fromLocale} → ${r.toLocale}: FAIL — ${r.reason}`);
        failures.push({ trSlug, ...r });
      }
    }
  }

  console.log(`\n=== SONUÇ: ${okHops}/${totalHops} geçiş başarılı (${trSlugs.length} sektör × 3 geçiş = ${trSlugs.length * 3} beklenen) ===`);
  if (failures.length > 0) {
    console.log('\nBaşarısız geçişler:');
    for (const f of failures) console.log(`  - ${f.trSlug}: ${f.fromLocale}→${f.toLocale} — ${f.reason}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
