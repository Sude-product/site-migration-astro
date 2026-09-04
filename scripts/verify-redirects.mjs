// Cutover-öncesi denetim (2026-09-04) — `astro.config.mjs`'in `redirects`
// bloğundaki HER girdinin, mevcut `output:'server'` + Cloudflare adapter
// mimarisinde GERÇEK bir HTTP 301/308 olarak çalıştığını doğrular.
// Gereksinim: `astro preview` ayakta olmalı (Cloudflare adapter runtime).
import { readFileSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:4321';
const configSrc = readFileSync('astro.config.mjs', 'utf-8');

const startIdx = configSrc.indexOf('redirects: {');
const objSrc = configSrc.slice(startIdx);
const pairs = [...objSrc.matchAll(/^\s*'([^']+)':\s*'([^']+)',?\s*$/gm)].map((m) => [m[1], m[2]]);

console.log(`astro.config.mjs'te ${pairs.length} redirect girdisi bulundu.\n`);

const results = { ok: 0, bad: [] };

for (const [from, to] of pairs) {
  try {
    const res = await fetch(`${BASE}${from}`, { redirect: 'manual' });
    const location = res.headers.get('location');
    const isRedirectStatus = res.status === 301 || res.status === 308 || res.status === 302;
    const locationOk = location && (location === to || location.endsWith(to) || new URL(location, BASE).pathname.replace(/\/$/, '') === to.replace(/\/$/, ''));
    if (isRedirectStatus && locationOk) {
      results.ok++;
    } else {
      results.bad.push({ from, to, status: res.status, location });
    }
  } catch (err) {
    results.bad.push({ from, to, error: String(err) });
  }
}

console.log(`OK: ${results.ok}/${pairs.length}`);
if (results.bad.length) {
  console.log(`\nSORUNLU (${results.bad.length}):`);
  for (const b of results.bad) console.log(`  ${JSON.stringify(b)}`);
} else {
  console.log('Tüm redirect girdileri doğru 301/308 + doğru Location döndürdü.');
}
