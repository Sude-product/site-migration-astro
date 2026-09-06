// Blog `featuredImage.url` (elle URL yapıştırma, `fields.url()`) →
// `featuredImage.image` (self-hosted yükleme, `fields.image()`) göçü.
//
// Keystatic'in `fields.image()`'ı asset'i HER ZAMAN
// `<publicPath>/<entry-slug>/<dosya-adı>` yoluna göre bulmaya çalışıyor
// (`getSrcPrefix()`, entry'nin `slug` alanıyla otomatik ad alanına
// ayrılıyor — bkz. keystatic.config.ts'in 2026-09-06 tarihli yorumu).
// Bu yüzden mevcut 628 yazının (629'un 1'i `featuredImage: null`) görseli,
// panelde doğru görüntülenip yeniden kaydedilebilmesi için bu yapıya
// KOPYALANIYOR — eski `public/wp-content/uploads/...` dosyaları SİLİNMİYOR
// (yalnızca kopyalanıyor, geri dönüş her zaman mümkün).
//
// Kullanım:
//   node scripts/migrate-featured-image-to-keystatic-field.mjs --dry-run
//   node scripts/migrate-featured-image-to-keystatic-field.mjs
import fs from 'node:fs';
import path from 'node:path';

const DRY_RUN = process.argv.includes('--dry-run');
const BLOG_DIR = 'src/content/blog';
const TARGET_BASE = 'public/img/blog-featured';
const TARGET_PUBLIC_PATH = '/img/blog-featured';

const files = fs
  .readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith('.md'))
  .sort();

let skippedNull = 0;
let migrated = 0;
let alreadyMigrated = 0;
const errors = [];

// YAML'a düz (tırnaksız) yazılabilir mi — mevcut tüm legacy `url:` değerleri
// zaten tırnaksız, yeni değer de aynı karakter kümesini (harf/rakam/`-`/`_`/
// `.`/`@`/`/`) kullanıyor, ama garanti altına almak için kontrol ediyoruz.
function needsYamlQuoting(value) {
  return /^[\s'"[{#&*!|>%@`]/.test(value) || /:\s|#/.test(value) || value.trim() !== value;
}

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const fmMatch = raw.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);
  if (!fmMatch) {
    errors.push({ file, reason: 'frontmatter bloğu bulunamadı' });
    continue;
  }
  const [, fmOpen, fm, fmClose] = fmMatch;

  if (/^featuredImage:\s*null\s*$/m.test(fm)) {
    skippedNull++;
    continue;
  }

  // Zaten migrate edilmiş mi (yeniden çalıştırılabilirlik için)?
  if (/^featuredImage:\r?\n(?:.*\r?\n)*?\s+image:\s*/m.test(fm)) {
    alreadyMigrated++;
    continue;
  }

  const slugMatch = fm.match(/^slug:\s*(.+)\s*$/m);
  const urlLineMatch = fm.match(/^(\s+)url:\s*(.+?)\s*$/m);
  if (!slugMatch || !urlLineMatch) {
    errors.push({ file, reason: 'slug veya featuredImage.url satırı bulunamadı' });
    continue;
  }
  const slug = slugMatch[1].trim();
  const indent = urlLineMatch[1];
  let rawUrlValue = urlLineMatch[2].trim();
  if (
    (rawUrlValue.startsWith("'") && rawUrlValue.endsWith("'")) ||
    (rawUrlValue.startsWith('"') && rawUrlValue.endsWith('"'))
  ) {
    rawUrlValue = rawUrlValue.slice(1, -1);
  }

  let decodedRelPath = rawUrlValue;
  try {
    decodedRelPath = decodeURI(rawUrlValue);
  } catch {
    // decode edilemezse ham değeri kullan
  }
  const relNoLeadingSlash = decodedRelPath.replace(/^\//, '');
  const candidates = [
    path.join('public', relNoLeadingSlash),
    path.join('public', relNoLeadingSlash.normalize('NFC')),
    path.join('public', relNoLeadingSlash.normalize('NFD')),
  ];
  const sourcePath = candidates.find((c) => fs.existsSync(c));
  if (!sourcePath) {
    errors.push({ file, reason: `kaynak dosya bulunamadı: ${rawUrlValue}` });
    continue;
  }

  // Sabit/kısa dosya adı — orijinal WP dosya adı DEĞİL. Bazı slug'lar 89
  // karaktere kadar çıkıyor; orijinal (bazen 90+ karakter) WP dosya adıyla
  // birleşince Windows'un 260 karakterlik MAX_PATH sınırını aşıp `git add`'i
  // "Filename too long" ile çökertiyordu (canlı olarak yakalandı, ilk
  // migrasyon denemesinde). Uzantı korunuyor (doğru içerik tipi/render için).
  const ext = path.extname(sourcePath).toLowerCase() || '.jpg';
  const targetFilename = `featured${ext}`;
  const targetDir = path.join(TARGET_BASE, slug);
  const targetPath = path.join(targetDir, targetFilename);
  const newValue = `${TARGET_PUBLIC_PATH}/${slug}/${targetFilename}`;

  if (needsYamlQuoting(newValue)) {
    errors.push({ file, reason: `YAML tırnak gerektiriyor, elle kontrol et: ${newValue}` });
    continue;
  }

  if (!DRY_RUN) {
    fs.mkdirSync(targetDir, { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);
  }

  const newFm = fm.replace(/^(\s+)url:\s*(.+?)\s*$/m, `${indent}image: ${newValue}`);
  if (!DRY_RUN) {
    const newRaw = raw.slice(0, fmMatch.index) + fmOpen + newFm + fmClose + raw.slice(fmMatch.index + fmMatch[0].length);
    fs.writeFileSync(filePath, newRaw, 'utf-8');
  }
  migrated++;
}

console.log(
  JSON.stringify(
    {
      dryRun: DRY_RUN,
      totalFiles: files.length,
      migrated,
      skippedNull,
      alreadyMigrated,
      errors: errors.length,
    },
    null,
    2
  )
);
if (errors.length) {
  console.log('HATALAR:', JSON.stringify(errors, null, 2));
  process.exit(1);
}
