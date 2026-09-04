// hreflang denetimi (2026-08-17, "No hreflang tags" SEO bulgusu) —
// `check-html-lang-attribute.mjs`/`check-heading-hierarchy.mjs` ile AYNI
// desen (`dist/**/*.html` taranır, ELLE recursive tarama — bkz. o
// script'lerdeki OneDrive-flakiness notu, `{recursive:true}` KULLANILMAZ).
//
// ÖNEMLİ — bu script İKİ FARKLI durumu doğru şekilde ele almalı:
// 1. **`Astro.site` boşken (şu anki durum, Faz 2'ye kadar):** hiçbir sayfada
//    hreflang/canonical <link> üretilmiyor (bkz. `BaseLayout.astro`'nun
//    "hazır ama uykuda" ilkesi). Bu HATA DEĞİL — script bunu bilgi amaçlı
//    raporlayıp 0 ile çıkar.
// 2. **`Astro.site` dolduktan sonra (Faz 2):** her sayfa için 3 kuralı
//    doğrular — (a) kendi kendine referans dahil mi, (b) karşılıklı
//    (reciprocal) mı — A sayfası B'ye hreflang veriyorsa B de A'ya vermeli,
//    (c) hiçbir hreflang hedefi bir redirect stub'a veya `noindex` sayfaya
//    İŞARET ETMİYOR (Google'ın kuralı — geçersiz sayılıp yok sayılır,
//    bkz. `hreflang.ts`'in dosya başı yorumu).
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

// DÜZELTME (2026-09-02, Açık nokta #53) — varsayılan `'dist'` DEĞİL
// `'dist/client'`: `@astrojs/cloudflare` adapter'ı (server modu,
// b73428a'dan beri) statik sayfaları `dist/client/` altına sarıyor.
// `check-html-lang-attribute.mjs`'in AYNI kökten gelen bug'ı (Açık
// nokta #52) düzeltildiğinde bu script'e de UYGULANMASI gerektiği not
// edilmiş ama o turda `site` alanı hâlâ boş olduğu için `pagesWithHreflang
// === 0` erken çıkışı devreye girip hata gizli kalıyordu — bu script
// hiçbir zaman gerçek path karşılaştırmasına ulaşmıyordu. Şimdi `site`
// dolduruluyor, düzeltme burada da uygulanıyor.
const DIST_DIR = process.env.DIST_DIR ?? 'dist/client';

async function findHtmlFiles(dir) {
  const results = [];
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(fullPath);
      else if (entry.isFile() && entry.name.endsWith('.html')) results.push(fullPath);
    }
  }
  await walk(dir);
  return results;
}

// `href` -> path'e normalize et (dist köküne göre, trailing slash farkını
// yok say) ki aynı sayfaya işaret eden farklı yazımlar (`/foo/`/`/foo`)
// eşleşsin.
function hrefToDistRelPath(href) {
  const url = new URL(href);
  let p = url.pathname.replace(/\/+$/, '') || '/';
  if (p === '/') return 'index.html';
  return `${p.slice(1)}/index.html`;
}

const files = await findHtmlFiles(DIST_DIR);
if (files.length === 0) {
  console.error(`❌ '${DIST_DIR}/' içinde .html dosyası bulunamadı — önce 'npx astro build' çalıştırın.`);
  process.exit(2);
}

// dist-relative path -> { html, isStub, isNoindex }
const pages = new Map();
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  const isStub = /<meta\s+http-equiv="refresh"/i.test(html);
  const isNoindex = /<meta\s+name="robots"\s+content="noindex/i.test(html);
  pages.set(rel, { html, isStub, isNoindex });
}

let pagesWithHreflang = 0;
const selfRefMissing = [];
const reciprocityBroken = [];
const pointsToInvalidTarget = [];
const missingXDefault = [];

for (const [rel, page] of pages) {
  if (page.isStub) continue;
  const linkMatches = [...page.html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"\s*\/?>/gi)];
  if (linkMatches.length === 0) continue;
  pagesWithHreflang++;

  const entries = linkMatches.map((m) => ({ locale: m[1], href: m[2] }));
  const nonDefault = entries.filter((e) => e.locale !== 'x-default');
  const xDefault = entries.find((e) => e.locale === 'x-default');

  if (nonDefault.length >= 2 && !xDefault) missingXDefault.push(rel);

  // (a) Kendi kendine referans — bu sayfanın kendi href'i, entries içinde
  // bu sayfanın kendi path'ine işaret eden bir kayıt olmalı.
  const selfHrefs = nonDefault.map((e) => hrefToDistRelPath(e.href));
  if (!selfHrefs.includes(rel)) selfRefMissing.push(rel);

  for (const e of nonDefault) {
    const targetRel = hrefToDistRelPath(e.href);
    const target = pages.get(targetRel);

    // (c) Geçersiz hedef — redirect stub veya noindex.
    if (!target) {
      pointsToInvalidTarget.push({ file: rel, locale: e.locale, href: e.href, reason: 'dosya bulunamadı' });
      continue;
    }
    if (target.isStub) {
      pointsToInvalidTarget.push({ file: rel, locale: e.locale, href: e.href, reason: 'redirect stub' });
      continue;
    }
    if (target.isNoindex) {
      pointsToInvalidTarget.push({ file: rel, locale: e.locale, href: e.href, reason: 'noindex sayfa' });
      continue;
    }

    // (b) Karşılıklılık — hedef sayfa da AYNI href setini (kendi
    // hreflang listesinde) taşımalı.
    const targetLinkMatches = [...target.html.matchAll(/<link\s+rel="alternate"\s+hreflang="[^"]+"\s+href="([^"]+)"\s*\/?>/gi)];
    const targetHrefsNormalized = new Set(targetLinkMatches.map((m) => hrefToDistRelPath(m[1])));
    const sourceHrefsNormalized = new Set(nonDefault.map((x) => hrefToDistRelPath(x.href)));
    const reciprocal =
      targetHrefsNormalized.size === sourceHrefsNormalized.size &&
      [...sourceHrefsNormalized].every((h) => targetHrefsNormalized.has(h));
    if (!reciprocal) {
      reciprocityBroken.push({ file: rel, targetFile: targetRel, locale: e.locale });
    }
  }
}

console.log(`\n=== hreflang Denetimi ===`);
console.log(`Toplam HTML sayfası: ${files.length}`);
console.log(`hreflang taşıyan sayfa: ${pagesWithHreflang}`);

if (pagesWithHreflang === 0) {
  console.log(
    `\nℹ️  Hiçbir sayfada hreflang bulunamadı — BEKLENEN davranış, 'astro.config.mjs'in 'site' alanı henüz boş\n` +
      `   (Faz 2'de prod domain bağlanınca otomatik aktifleşecek, bkz. CLAUDE.md Açık nokta #31 + hreflang.ts).\n` +
      `   Gerçek çıktıyı test etmek için 'site' alanına GEÇİCİ bir değer girip 'astro build' + bu script\n` +
      `   çalıştırılabilir, ama commit'ten önce MUTLAKA geri alınmalı.`,
  );
  process.exit(0);
}

console.log(`\n--- Kendi kendine referans EKSİK (${selfRefMissing.length}) ---`);
for (const f of selfRefMissing) console.log(`  ${f}`);

console.log(`\n--- x-default EKSİK (2+ alternatifi olup x-default'u olmayan) (${missingXDefault.length}) ---`);
for (const f of missingXDefault) console.log(`  ${f}`);

console.log(`\n--- KARŞILIKLI DEĞİL (reciprocity broken) (${reciprocityBroken.length}) ---`);
for (const e of reciprocityBroken) console.log(`  ${e.file} --[${e.locale}]--> ${e.targetFile} (hedef aynı seti geri döndürmüyor)`);

console.log(`\n--- GEÇERSİZ HEDEFE İŞARET EDİYOR (redirect stub/noindex/yok) (${pointsToInvalidTarget.length}) ---`);
for (const e of pointsToInvalidTarget) console.log(`  ${e.file} --[${e.locale}]--> ${e.href} (${e.reason})`);

const totalIssues = selfRefMissing.length + missingXDefault.length + reciprocityBroken.length + pointsToInvalidTarget.length;
console.log(`\n=== ÖZET: ${totalIssues} sorun (${pagesWithHreflang} hreflang taşıyan sayfa arasında) ===`);

process.exit(totalIssues === 0 ? 0 : 1);
