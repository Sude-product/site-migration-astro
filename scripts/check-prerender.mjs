// `export const prerender = true` denetimi (2026-09-02) — diğer
// `check-*.mjs` script'leriyle AYNI desen (bkz. `check-title-length.mjs`
// vb.), tek fark: bu script `dist/`'i DEĞİL `src/pages/`'i tarıyor (kaynak
// kodun kendisi, build çıktısı değil).
//
// KÖK OLAY: `astro.config.mjs`'in `output:'server'` + `@astrojs/cloudflare`
// adapter'ına geçişi (Keystatic entegrasyonu için ZORUNLU, bkz. CLAUDE.md)
// Astro 5+'ta artık `output:'hybrid'` (varsayılan statik + opt-in dinamik)
// KALDIRILDIĞI için, HER sayfanın kendi dosyasında AYRI AYRI
// `export const prerender = true` taşıması gerekiyor — config seviyesinde
// toplu bir "varsayılan statik" seçeneği YOK. Bu satır eksik/`false` olan
// bir sayfa, fark edilmeden gerçek bir SSR route'a (bu projenin mimarisinde
// hiç istenmeyen, backend'siz `console.log` formlarının/927+ statik SEO
// sayfasının modeliyle çelişen bir davranış) kayabilir — bu script bu
// regresyon sınıfını yakalamak için var.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

// `readdir(dir, { recursive: true })` GÜVENİLMEZ bulundu (2026-08-10,
// diğer check-*.mjs script'lerinin hepsinde AYNI not) — bu proje
// OneDrive-senkronize bir klasörde, Node'un recursive readdir'i bazen
// (görünürde rastgele) eksik dosya döndürdü. Elle recursive tarama
// (alt dizin başına ayrı `readdir`) bu ortamda istikrarlı.
const PAGES_DIR = process.env.PAGES_DIR ?? 'src/pages';

async function findAstroFiles(dir) {
  const results = [];
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(fullPath);
      else if (entry.isFile() && entry.name.endsWith('.astro')) results.push(fullPath);
    }
  }
  await walk(dir);
  return results;
}

const files = await findAstroFiles(PAGES_DIR);
if (files.length === 0) {
  console.error(`❌ '${PAGES_DIR}/' içinde .astro dosyası bulunamadı.`);
  process.exit(2);
}

const missing = [];

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const rel = path.relative(PAGES_DIR, file).replace(/\\/g, '/');
  if (!/export\s+const\s+prerender\s*=\s*true\s*;?/.test(source)) {
    missing.push(rel);
  }
}

console.log(`\n=== prerender Denetimi ===`);
console.log(`Taranan dosya: ${files.length}`);
console.log(`\n--- 'export const prerender = true' EKSİK (${missing.length}) ---`);
for (const f of missing) console.log(`  ${f}`);

const ok = files.length - missing.length;
console.log(`\n=== ÖZET: ${ok}/${files.length} sayfa doğru işaretli, ${missing.length} sorunlu ===`);

process.exit(missing.length === 0 ? 0 : 1);
