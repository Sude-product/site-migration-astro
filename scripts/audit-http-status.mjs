// TÜM sayfaların (gerçek + redirect stub) gerçek HTTP durumunu dev server
// üzerinden doğrular. Gerçek sayfalar 200 dönmeli, redirect stub'lar
// 301/302 + doğru Location dönmeli.
//
// Gereksinim: dev server ayakta olmalı. Çalıştırma: AUDIT_OUT=<path> node scripts/audit-http-status.mjs

import { readFileSync } from 'node:fs';

const BASE = 'http://localhost:4321';
const IN = process.env.AUDIT_OUT || 'audit-data.json';
const pages = JSON.parse(readFileSync(IN, 'utf-8'));

const results = { ok: 0, bad: [] };

async function checkPage(p) {
  const res = await fetch(`${BASE}${p.url}`, { redirect: 'manual' });
  if (p.isRedirect) {
    if (res.status === 301 || res.status === 302) {
      results.ok++;
    } else {
      results.bad.push({ url: p.url, expected: '301/302', got: res.status });
    }
  } else {
    if (res.status === 200) {
      results.ok++;
    } else {
      results.bad.push({ url: p.url, expected: 200, got: res.status });
    }
  }
}

const CONCURRENCY = 10;
const queue = [...pages];
async function worker() {
  while (queue.length) {
    const p = queue.shift();
    await checkPage(p);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(`\n=== HTTP DURUM TARAMASI (${pages.length} URL) ===`);
console.log(`OK: ${results.ok}`);
console.log(`Sorunlu: ${results.bad.length}`);
for (const b of results.bad) console.log(`  - ${b.url} :: beklenen ${b.expected}, gelen ${b.got}`);
