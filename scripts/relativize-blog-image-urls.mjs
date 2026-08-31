// 622 blog yazısının .md dosyalarındaki mutlak
// `https://idenfit.com/wp-content/uploads/...` görsel URL'lerini
// göreli `/wp-content/uploads/...`e çevirir (protokol+domain kaldırılır).
// Görsel dosyaların kendisi `scripts/download-blog-images.mjs` ile
// önceden `public/wp-content/uploads/...`e yerelleştirilmiş olmalı
// (Açık nokta #14, 2026-08-30). Yalnızca metin değişir, dosya
// taşınmaz/indirilmez.
//
// Kullanım:
//   node scripts/relativize-blog-image-urls.mjs --limit 25   (pilot)
//   node scripts/relativize-blog-image-urls.mjs                (tüm kalan dosyalar)

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const BLOG_DIR = 'src/content/blog';
const ABS_PREFIX_RE = /https?:\/\/idenfit\.com\/wp-content\/uploads\//g;

const args = process.argv.slice(2);
const limitIdx = args.indexOf('--limit');
const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;

function main() {
  const files = readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort();

  const withMatches = files.filter((f) => {
    const text = readFileSync(join(BLOG_DIR, f), 'utf-8');
    return text.includes('idenfit.com/wp-content/uploads/');
  });

  const todo = withMatches.slice(0, limit);
  console.log(`Mutlak URL içeren dosya: ${withMatches.length}, bu turda işlenecek: ${todo.length}\n`);

  let totalReplacements = 0;
  for (const f of todo) {
    const path = join(BLOG_DIR, f);
    const text = readFileSync(path, 'utf-8');
    const matches = text.match(ABS_PREFIX_RE);
    const count = matches ? matches.length : 0;
    if (count === 0) continue;
    const newText = text.replace(ABS_PREFIX_RE, '/wp-content/uploads/');
    writeFileSync(path, newText);
    totalReplacements += count;
    console.log(`✓ ${f} — ${count} URL göreli hale getirildi`);
  }

  console.log(`\n=== SONUÇ: ${todo.length} dosya işlendi, ${totalReplacements} URL değiştirildi ===`);
  console.log(`Kalan (bu turda işlenmeyen): ${withMatches.length - todo.length} dosya`);
}

main();
