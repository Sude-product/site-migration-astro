// `audit-site.mjs`'in ürettiği ara veriyi analiz eder: boş/şüpheli
// title-description, kırık iç link, redirect hedeflerinin geçerliliği.
// Çalıştırma: AUDIT_OUT=<path> node scripts/audit-analyze.mjs

import { readFileSync } from 'node:fs';

const IN = process.env.AUDIT_OUT || 'audit-data.json';
const pages = JSON.parse(readFileSync(IN, 'utf-8'));

const realPages = pages.filter((p) => !p.isRedirect);
const redirectPages = pages.filter((p) => p.isRedirect);
const validPaths = new Set(pages.map((p) => p.url));

console.log(`\n=== 1) TITLE / DESCRIPTION KONTROLÜ (${realPages.length} sayfa) ===`);
const titleIssues = [];
for (const p of realPages) {
  if (!p.title || p.title.trim() === '' || p.title.trim() === 'idenfit') {
    titleIssues.push({ url: p.url, issue: 'title boş/jenerik', value: p.title });
  }
  if (!p.description || p.description.trim() === '') {
    titleIssues.push({ url: p.url, issue: 'description boş', value: p.description });
  } else if (p.description.length < 10) {
    titleIssues.push({ url: p.url, issue: 'description çok kısa', value: p.description });
  }
  if (p.title && /undefined|NaN|\[object/.test(p.title)) {
    titleIssues.push({ url: p.url, issue: 'title bozuk (undefined/NaN)', value: p.title });
  }
  if (p.description && /undefined|NaN|\[object/.test(p.description)) {
    titleIssues.push({ url: p.url, issue: 'description bozuk (undefined/NaN)', value: p.description });
  }
}
console.log(`Bulunan sorun: ${titleIssues.length}`);
for (const t of titleIssues) console.log(`  - ${t.url} :: ${t.issue} :: ${JSON.stringify(t.value)}`);

console.log(`\n=== 2) KIRIK İÇ LİNK KONTROLÜ ===`);
const brokenLinks = [];
const linkToSources = new Map();
for (const p of realPages) {
  for (const href of p.internalHrefs) {
    const bare = href.split('#')[0].split('?')[0];
    if (!bare) continue;
    if (!linkToSources.has(bare)) linkToSources.set(bare, []);
    linkToSources.get(bare).push(p.url);
  }
}
for (const [href, sources] of linkToSources.entries()) {
  if (!validPaths.has(href)) {
    brokenLinks.push({ href, count: sources.length, sampleSources: sources.slice(0, 3) });
  }
}
console.log(`Bulunan benzersiz kırık link hedefi: ${brokenLinks.length}`);
for (const b of brokenLinks) {
  console.log(`  - ${b.href}  (${b.count} sayfadan referans, örn: ${b.sampleSources.join(', ')})`);
}

console.log(`\n=== 3) REDIRECT HEDEFİ GEÇERLİLİĞİ (${redirectPages.length} redirect) ===`);
const brokenRedirects = [];
for (const r of redirectPages) {
  if (!r.redirectTo || !validPaths.has(r.redirectTo)) {
    brokenRedirects.push(r);
  }
}
console.log(`Bulunan kırık redirect: ${brokenRedirects.length}`);
for (const r of brokenRedirects) console.log(`  - ${r.url} -> ${r.redirectTo}`);

console.log(`\n=== 4) BENZERSİZ GÖRSEL SAYISI ===`);
const allImgs = new Set();
for (const p of realPages) for (const src of p.imgSrcs) allImgs.add(src);
console.log(`Toplam benzersiz <img> src: ${allImgs.size}`);

console.log(`\n=== 5) DİL DEĞİŞTİRİCİSİ OLMAYAN SAYFALAR ===`);
const noSwitcher = realPages.filter((p) => !p.hasLangSwitcher);
console.log(`Switcher'sız sayfa: ${noSwitcher.length}`);
for (const p of noSwitcher) console.log(`  - ${p.url}`);
