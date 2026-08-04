// Ürün/modül sayfalarında LanguageSwitcher'ın gerçek (locale-başına farklı
// slug'lı) URL'ler ürettiğini uçtan uca doğrular — `test-sector-language-switch.mjs`
// ile aynı desen (bkz. o dosyadaki yorum), yalnızca sektörler yerine
// `products.json`'daki gruplar üzerinden çalışır. NL'i olmayan gruplar
// (bkz. `ise-alim-modulu`) TR→EN→IT şeklinde test edilir, TR→EN→NL→IT değil.
//
// Gereksinim: dev server ayakta olmalı (`astro dev --background`).
// Çalıştırma: node scripts/test-product-language-switch.mjs

import { readFileSync } from 'node:fs';

const BASE = 'http://localhost:4321';

function productGroups() {
  const data = JSON.parse(readFileSync('reference/wordpress-export/products.json', 'utf-8'));
  // PDKS (Aşama 1) zaten test edildi — bu script Aşama 2'nin 5 yeni modülüne odaklanır.
  return data.products.filter((p) => p.trSlug !== 'pdks-modulu');
}

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
  const res = await fetch(url);
  const html = await res.text();
  return { status: res.status, html };
}

async function testGroup(group) {
  const availableLocales = Object.keys(group.locales).filter((l) => ['tr', 'en', 'nl', 'it'].includes(l));
  const chain = ['tr', 'en', 'nl', 'it'].filter((l) => availableLocales.includes(l));
  const results = [];

  function bareSlug(link) {
    const u = new URL(link);
    const parts = u.pathname.split('/').filter(Boolean);
    if (['tr', 'en', 'nl', 'it'].includes(parts[0])) parts.shift();
    return parts.join('/');
  }

  let currentUrl = `${BASE}/${bareSlug(group.locales.tr.link)}/`;
  for (let i = 0; i < chain.length - 1; i++) {
    const fromLocale = chain[i];
    const toLocale = chain[i + 1];
    const { status, html } = await fetchPage(currentUrl);
    if (status !== 200) {
      results.push({ fromLocale, toLocale, ok: false, reason: `${fromLocale} sayfası ${status} döndü (${currentUrl})` });
      break;
    }
    const urls = extractLanguageSwitcherUrls(html);
    if (!urls) {
      results.push({ fromLocale, toLocale, ok: false, reason: `LanguageSwitcher bulunamadı (${currentUrl})` });
      break;
    }
    const targetUrl = urls[toLocale];
    if (!targetUrl) {
      results.push({ fromLocale, toLocale, ok: false, reason: `urls['${toLocale}'] eksik (${currentUrl})` });
      break;
    }
    const fullTargetUrl = targetUrl.startsWith('http') ? targetUrl : `${BASE}${targetUrl}`;
    const target = await fetchPage(fullTargetUrl);
    results.push({
      fromLocale,
      toLocale,
      ok: target.status === 200,
      url: targetUrl,
      reason: target.status === 200 ? null : `${toLocale} hedefi ${target.status} döndü (${fullTargetUrl})`,
    });
    if (target.status !== 200) break;
    currentUrl = fullTargetUrl;
  }
  return { results, chain };
}

async function main() {
  const groups = productGroups();
  console.log(`${groups.length} modül için dil değiştirici zincir testi başlıyor...\n`);

  let totalHops = 0;
  let okHops = 0;
  const failures = [];

  for (const group of groups) {
    const { results, chain } = await testGroup(group);
    const allOk = results.length === chain.length - 1 && results.every((r) => r.ok);
    console.log(`${allOk ? '✅' : '❌'} ${group.trSlug} (zincir: ${chain.join('→')})`);
    for (const r of results) {
      totalHops++;
      if (r.ok) {
        okHops++;
        console.log(`   ${r.fromLocale} → ${r.toLocale}: OK (${r.url})`);
      } else {
        console.log(`   ${r.fromLocale} → ${r.toLocale}: FAIL — ${r.reason}`);
        failures.push({ trSlug: group.trSlug, ...r });
      }
    }
  }

  console.log(`\n=== SONUÇ: ${okHops}/${totalHops} geçiş başarılı ===`);
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
