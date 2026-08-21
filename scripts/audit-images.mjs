// TÜM sayfalardaki benzersiz <img src> URL'lerine gerçek HTTP isteği atıp
// kırık (404/timeout) görselleri listeler. Gerçek internet erişimi
// gerektirir (çoğu görsel idenfit.com'un WP medya kütüphanesinden hotlink).
//
// Çalıştırma: AUDIT_OUT=<path> node scripts/audit-images.mjs

import { readFileSync } from 'node:fs';

const IN = process.env.AUDIT_OUT || 'audit-data.json';
const pages = JSON.parse(readFileSync(IN, 'utf-8'));
const realPages = pages.filter((p) => !p.isRedirect);

const srcToPages = new Map();
for (const p of realPages) {
  for (const src of p.imgSrcs) {
    if (!src || src.startsWith('data:')) continue;
    if (!srcToPages.has(src)) srcToPages.set(src, []);
    srcToPages.get(src).push(p.url);
  }
}

console.log(`Toplam benzersiz görsel: ${srcToPages.size}\n`);

async function checkOne(src) {
  try {
    const res = await fetch(src, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(15000) });
    return res.status;
  } catch (err) {
    return `ERR:${err.message}`;
  }
}

const entries = [...srcToPages.entries()];
const CONCURRENCY = 8;
const broken = [];
let done = 0;

async function worker(queue) {
  while (queue.length) {
    const [src, sources] = queue.shift();
    const status = await checkOne(src);
    done++;
    if (status !== 200) {
      broken.push({ src, status, sources });
      console.log(`  ❌ [${status}] ${src}`);
    }
    if (done % 50 === 0) console.log(`... ${done}/${entries.length} kontrol edildi`);
  }
}

const queue = [...entries];
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue)));

console.log(`\n=== SONUÇ: ${broken.length}/${entries.length} görsel kırık ===`);
for (const b of broken) {
  console.log(`  ${b.src}  [${b.status}]  (örn. sayfa: ${b.sources[0]}, toplam ${b.sources.length} sayfa)`);
}
