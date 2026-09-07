// Blog öne çıkan görsellerini WebP'ye çevirip frontmatter referansını günceller
// (2026-09-07, denetim bulgusu SEO-08).
//
// NEDEN: bu görseller `blog/[slug].astro`'da `loading="eager"` ile yükleniyor,
// yani 629 yazının çoğunda LCP elemanı onlar. Ölçüm: referans edilen 1259
// görselin 190'ı 300KB üstü, 10'u 1MB üstü; en büyüğü 2 MB'lık bir PNG.
// LCP doğrudan bir sıralama sinyali (Core Web Vitals) — mobilde bu boyutlar
// eşiği aşırıyor.
//
// KAPSAM KASITLI OLARAK DAR: yalnızca `public/img/blog-featured/**`. Bu
// dosyaların her birine TEK bir yerden (yazının kendi frontmatter'ındaki
// `featuredImage.image`) referans veriliyor, dolayısıyla uzantı değişimi
// güvenle izlenebilir. `/wp-content/uploads/**` görselleri ise ham WordPress
// JSON'larından runtime'da okunuyor (bkz. `deepRelativizeWpUrls`) — orada
// uzantı değiştirmek çok daha geniş ve riskli bir iş, AYRI ele alınmalı.
//
// GÜVENLİK: dönüşüm yalnızca kazanç MIN_SAVING'i aşarsa kabul edilir; boyut
// (genişlik/yükseklik) korunur, yani frontmatter'daki `width`/`height`
// değerleri geçerli kalır — script bunu dönüşüm sonrası TEKRAR ölçüp
// doğruluyor, uyuşmazsa dosyayı geri alıyor. Orijinaller siliniyor ama git
// geçmişinde duruyor (geri dönüş her zaman mümkün).
//
// Kullanım:
//   npm install --no-save sharp
//   node scripts/optimize-blog-featured-images.mjs --dry-run
//   node scripts/optimize-blog-featured-images.mjs
import { readdir, readFile, writeFile, stat, unlink } from 'node:fs/promises';
import path from 'node:path';

const DRY = process.argv.includes('--dry-run');
const BLOG_DIR = 'src/content/blog';
const MIN_BYTES = 300 * 1024; // bu boyutun altındakiler zaten sorun değil
const MIN_SAVING = 0.25;      // %25'ten az kazanç varsa dokunma
const WEBP_QUALITY = 82;

const sharp = (await import('sharp')).default;

const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith('.md'));
let converted = 0, skipped = 0, before = 0, after = 0;
const failures = [];

for (const name of files) {
  const mdPath = path.join(BLOG_DIR, name);
  const md = await readFile(mdPath, 'utf8');
  const m = md.match(/^(\s*image:\s*)(\/img\/blog-featured\/[^\s"']+)\s*$/m);
  if (!m) continue;
  const publicPath = decodeURI(m[2]);
  if (publicPath.endsWith('.webp')) continue; // zaten webp
  const filePath = 'public' + publicPath;

  let st;
  try { st = await stat(filePath); } catch { failures.push(`${name}: dosya yok -> ${filePath}`); continue; }
  if (st.size < MIN_BYTES) { skipped++; continue; }

  const outPublic = publicPath.replace(/\.(png|jpe?g)$/i, '.webp');
  if (outPublic === publicPath) { skipped++; continue; }
  const outPath = 'public' + outPublic;

  try {
    const src = sharp(filePath);
    const meta = await src.metadata();
    const buf = await src.webp({ quality: WEBP_QUALITY }).toBuffer();
    const saving = 1 - buf.length / st.size;
    if (saving < MIN_SAVING) { skipped++; continue; }

    if (!DRY) {
      await writeFile(outPath, buf);
      // boyut doğrulaması — frontmatter'daki width/height geçerli kalmalı
      const outMeta = await sharp(outPath).metadata();
      if (outMeta.width !== meta.width || outMeta.height !== meta.height) {
        await unlink(outPath);
        failures.push(`${name}: boyut değişti (${meta.width}x${meta.height} -> ${outMeta.width}x${outMeta.height}), geri alındı`);
        continue;
      }
      await writeFile(mdPath, md.replace(m[0], `${m[1]}${outPublic}`));
      await unlink(filePath);
    }
    before += st.size; after += buf.length; converted++;
    if (converted <= 10 || DRY) {
      console.log(`  ${String(Math.round(st.size / 1024)).padStart(5)} KB -> ${String(Math.round(buf.length / 1024)).padStart(5)} KB  (%${Math.round(saving * 100)})  ${path.basename(path.dirname(publicPath))}`);
    }
  } catch (e) {
    failures.push(`${name}: ${e.message}`);
  }
}

console.log(`\n${DRY ? '[DRY RUN] ' : ''}dönüştürülen: ${converted} | atlanan: ${skipped} | hata: ${failures.length}`);
console.log(`toplam: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB  (kazanç ${((1 - after / (before || 1)) * 100).toFixed(0)}%, ${((before - after) / 1048576).toFixed(1)} MB)`);
if (failures.length) { console.log('\nhatalar:'); failures.forEach((f) => console.log('  ' + f)); }
