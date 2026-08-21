// Site genelinde dil değiştirici tutarlılığı: her sayfanın embedded
// LanguageSwitcher `urls` prop'unu çözüp (a) her hedefin gerçekten var
// olan bir path'e (sayfa VEYA redirect stub) gittiğini, (b) AYNI "sayfa
// ailesi"ndeki (birbirine switcher ile bağlı) sayfaların NL/diğer
// hedefler konusunda TUTARLI olduğunu doğrular (KVKK'da bulunan
// "hangi sayfadan başladığına göre değişen" sınıf hatayı sistematik arar).
//
// Çalıştırma: AUDIT_OUT=<path> node scripts/audit-lang-consistency.mjs

import { readFileSync } from 'node:fs';

const IN = process.env.AUDIT_OUT || 'audit-data.json';
const pages = JSON.parse(readFileSync(IN, 'utf-8'));
const validPaths = new Set(pages.map((p) => p.url));
const realPages = pages.filter((p) => !p.isRedirect);

function unwrap(node) {
  if (!Array.isArray(node)) return node;
  const [tag, value] = node;
  if (tag === 0) return value;
  if (tag === 1) return value.map(unwrap);
  return value;
}

function parseSwitcherUrls(raw) {
  if (!raw) return null;
  const decoded = raw.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  try {
    const parsed = JSON.parse(decoded);
    const urlsRaw = unwrap(parsed.urls);
    const urls = {};
    for (const [locale, val] of Object.entries(urlsRaw)) urls[locale] = unwrap(val);
    return urls;
  } catch {
    return null;
  }
}

console.log(`\n=== DİL DEĞİŞTİRİCİ HEDEF GEÇERLİLİĞİ (${realPages.length} sayfa) ===`);
const badTargets = [];
const perPageUrls = new Map();
for (const p of realPages) {
  const urls = parseSwitcherUrls(p.langSwitcherPropsRaw);
  if (!urls) {
    badTargets.push({ url: p.url, issue: 'switcher props parse edilemedi' });
    continue;
  }
  perPageUrls.set(p.url, urls);
  for (const [locale, target] of Object.entries(urls)) {
    if (!validPaths.has(target)) {
      badTargets.push({ url: p.url, issue: `urls['${locale}']='${target}' geçersiz (ne sayfa ne redirect)` });
    }
  }
}
console.log(`Bulunan sorun: ${badTargets.length}`);
for (const b of badTargets) console.log(`  - ${b.url} :: ${b.issue}`);

console.log(`\n=== TUTARLILIK: AYNI SAYFA AİLESİNDE FARKLI SONUÇ ===`);
// "Aile" = birbirine switcher ile bağlı sayfalar. Basit yaklaşım: her sayfanın
// KENDİ switcher'ındaki 'tr' hedefini "aile anahtarı" olarak kullan (TR
// bare path her locale'in aynı ailesine işaret eder).
const familyByTrTarget = new Map();
for (const [url, urls] of perPageUrls.entries()) {
  const key = urls.tr ?? url;
  if (!familyByTrTarget.has(key)) familyByTrTarget.set(key, []);
  familyByTrTarget.get(key).push({ url, urls });
}

let inconsistentFamilies = 0;
for (const [key, members] of familyByTrTarget.entries()) {
  if (members.length < 2) continue;
  // Her locale hedefi için tüm üyelerin AYNI değeri üretip üretmediğini kontrol et.
  const localesSeen = new Set(members.flatMap((m) => Object.keys(m.urls)));
  for (const locale of localesSeen) {
    const values = new Set(members.map((m) => m.urls[locale]).filter(Boolean));
    if (values.size > 1) {
      inconsistentFamilies++;
      console.log(`  ❌ Aile (tr='${key}') — '${locale}' hedefi tutarsız: ${[...values].join(' vs ')}`);
      for (const m of members) console.log(`       ${m.url} → ${locale}='${m.urls[locale]}'`);
    }
  }
}
console.log(`Tutarsız aile sayısı: ${inconsistentFamilies}`);
