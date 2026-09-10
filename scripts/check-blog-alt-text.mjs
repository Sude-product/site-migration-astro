/**
 * Blog öne çıkan görsellerinin alt metni denetimi — KAYNAK SEVİYESİ.
 *
 * NEDEN AYRI BİR SCRIPT: `check-image-alt-text.mjs` derlenmiş `dist/`'i
 * tarıyor ve `alt` özniteliğinin VAR olup olmadığına bakıyor. Blog öne
 * çıkan görselinde alt metni eksikse render tarafı yazının kendi
 * BAŞLIĞINA düşüyor (`blog/[slug].astro`, `BlogListPage.astro`,
 * `BlogSidebar.astro`) — yani çıktıda `alt` her zaman dolu, o script bu
 * sınıfı ASLA yakalayamaz. Eksiklik sessizce yayınlanır.
 *
 * Bu script bu yüzden `dist/`'e değil, doğrudan frontmatter'a bakıyor:
 * görseli OLUP alt metni olmayan (anahtar yok, `null`, ya da yalnızca
 * boşluk) yazıları listeliyor.
 *
 * Görseli HİÇ OLMAYAN yazılar (`featuredImage: null`) sorun DEĞİL —
 * alt metni istemek anlamsız olurdu. Keystatic panelinde alanı zorunlu
 * yapma girişimi tam bu yüzden geri alındı (bkz. keystatic.config.ts'in
 * `alt` alanındaki yorum).
 *
 * Çalıştırma: `node scripts/check-blog-alt-text.mjs`
 * Çıkış kodu: sorun yoksa 0, en az bir sorun varsa 1.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load as loadYaml } from 'js-yaml';

const BLOG_DIR = process.env.BLOG_DIR ?? 'src/content/blog';

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md')).sort();

const missing = [];
const unparsable = [];
let withImage = 0;
let withoutImage = 0;

for (const file of files) {
  const raw = readFileSync(join(BLOG_DIR, file), 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    unparsable.push(`${file} (frontmatter bloğu yok)`);
    continue;
  }

  let data;
  try {
    data = loadYaml(match[1]);
  } catch (err) {
    unparsable.push(`${file} (${err.message.split('\n')[0]})`);
    continue;
  }

  const featured = data?.featuredImage;
  // `featuredImage` hiç yok / `null` / görselsiz obje → kapsam dışı.
  const image = featured && typeof featured === 'object' ? featured.image : null;
  if (typeof image !== 'string' || image.trim() === '') {
    withoutImage += 1;
    continue;
  }

  withImage += 1;
  const alt = featured.alt;
  if (typeof alt !== 'string' || alt.trim() === '') {
    missing.push(file);
  }
}

console.log('\n=== Blog Öne Çıkan Görsel Alt Metni Denetimi ===');
console.log(`Taranan yazı: ${files.length} (${withImage} görselli, ${withoutImage} görselsiz)`);
console.log('Kural: görseli OLAN her yazının boş olmayan bir `featuredImage.alt` metni olmalı.\n');

console.log(`--- ALT METNİ EKSİK/BOŞ (${missing.length}) ---`);
for (const file of missing) console.log(`  ${file}`);
if (missing.length === 0) console.log('  (yok)');

if (unparsable.length > 0) {
  console.log(`\n--- FRONTMATTER OKUNAMADI (${unparsable.length}) ---`);
  for (const entry of unparsable) console.log(`  ${entry}`);
}

const problems = missing.length + unparsable.length;
console.log(`\n=== ÖZET: ${problems} sorunlu yazı (${missing.length} alt eksik, ${unparsable.length} okunamadı) ===\n`);

process.exit(problems === 0 ? 0 : 1);
