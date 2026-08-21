// Erişilebilirlik denetimi — erişilebilir adı olmayan <a> linkleri
// (2026-08-10). Chrome DevTools'un "Links do not have a discernible name"
// denetimiyle AYNI kuralı uyguluyor: bir link'in erişilebilir adı olması
// için şunlardan EN AZ biri gerekli — görünür metin, `aria-label`,
// `aria-labelledby`, içinde `alt` dolu bir `<img>`, veya içinde metinli bir
// `<svg><title>`. Hiçbiri yoksa (ör. yalnızca `aria-hidden` bir ikon SVG
// içeren link) ekran okuyucu kullanıcısı için link "isimsiz" kalır.
//
// `dist/**/*.html` (build çıktısı) taranır — canlı bir sunucu/tarayıcı
// GEREKMİYOR, `npm run build` sonrası doğrudan çalıştırılabilir. `parse5`
// (Astro'nun kendi Markdown/HTML işleme zincirinde zaten kullandığı,
// projeye 2026-08-10'da AYRICA `devDependency` olarak eklenen kütüphane —
// `playwright` geçici tanılama script'lerinin AKSİNE bu script KALICI bir
// araç olduğu için kalıcı bir dependency'ye ihtiyaç duyuyor, hoisting'e
// güvenilmedi) ile gerçek bir HTML ağacı kuruluyor — regex tabanlı bir
// tarama nested/self-closing/entity-encoded etiketlerde güvenilmez olurdu.
//
// 877 sayfanın çoğu AYNI paylaşılan Header/Footer/FloatingContactButtons'ı
// taşıdığı için ham bulgu sayısı yüzlerce OLABİLİR — rapor `href`'e göre
// TEKİLLEŞTİRİLMİŞ benzersiz sorunlu linkleri gösterir (kaç sayfada
// tekrarlandığı bilgisiyle), site genelinde "kaç FARKLI bileşen/link
// düzeltilmeli" sorusuna cevap verir.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'parse5';

const DIST_DIR = process.env.DIST_DIR ?? 'dist';

function getAttr(node, name) {
  return node.attrs?.find((a) => a.name === name)?.value;
}

function collectText(node, out) {
  if (node.nodeName === '#text') {
    out.push(node.value);
    return;
  }
  if (node.tagName === 'script' || node.tagName === 'style') return;
  for (const child of node.childNodes ?? []) collectText(child, out);
}

function textOf(node) {
  const out = [];
  collectText(node, out);
  return out.join('').replace(/\s+/g, ' ').trim();
}

// Link'in İÇİNDE erişilebilir ad taşıyabilecek bir `<img alt="...">` veya
// metinli bir `<svg><title>` var mı — varsa link "sadece ikon" olsa da
// zaten erişilebilir sayılır (yanlış-pozitif üretmemek için).
function hasAccessibleDescendant(node) {
  let found = false;
  function walk(n) {
    if (found) return;
    if (n.tagName === 'img' && (getAttr(n, 'alt') ?? '').trim() !== '') {
      found = true;
      return;
    }
    if (n.tagName === 'svg') {
      for (const c of n.childNodes ?? []) {
        if (c.tagName === 'title' && textOf(c) !== '') {
          found = true;
          return;
        }
      }
    }
    for (const c of n.childNodes ?? []) walk(c);
  }
  walk(node);
  return found;
}

function outerSummary(node) {
  const attrs = (node.attrs ?? [])
    .filter((a) => ['href', 'class', 'aria-hidden'].includes(a.name))
    .map((a) => `${a.name}="${a.value.length > 60 ? a.value.slice(0, 60) + '…' : a.value}"`)
    .join(' ');
  return `<a ${attrs}>`;
}

// `readdir(dir, { recursive: true })` GÜVENİLMEZ bulundu (2026-08-10) —
// bu proje OneDrive-senkronize bir klasörde, Node'un recursive readdir'i
// bazen (görünürde rastgele) yalnızca 1 dosya döndürdü (gerçek sayı 2368).
// Elle recursive tarama (alt dizin başına ayrı `readdir`) bu ortamda
// istikrarlı — `check-title-length.mjs`/`check-meta-description-length.mjs`
// ile AYNI düzeltme.
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

function scanDocument(root, filePath, violations) {
  function walk(node) {
    if (node.tagName === 'a') {
      const ariaLabel = (getAttr(node, 'aria-label') ?? '').trim();
      const ariaLabelledby = (getAttr(node, 'aria-labelledby') ?? '').trim();
      const visibleText = textOf(node);
      const hasAccessibleName =
        ariaLabel !== '' || ariaLabelledby !== '' || visibleText !== '' || hasAccessibleDescendant(node);
      if (!hasAccessibleName) {
        violations.push({
          file: filePath,
          href: getAttr(node, 'href') ?? '(href yok)',
          summary: outerSummary(node),
        });
      }
    }
    for (const c of node.childNodes ?? []) walk(c);
  }
  walk(root);
}

const files = await findHtmlFiles(DIST_DIR);
if (files.length === 0) {
  console.error(`❌ '${DIST_DIR}/' içinde .html dosyası bulunamadı — önce 'npx astro build' çalıştırın.`);
  process.exit(2);
}

const allViolations = [];
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const doc = parse(html);
  scanDocument(doc, path.relative(DIST_DIR, file).replace(/\\/g, '/'), allViolations);
}

// href'e göre tekilleştir.
const byHref = new Map();
for (const v of allViolations) {
  if (!byHref.has(v.href)) {
    byHref.set(v.href, { href: v.href, summary: v.summary, files: [], count: 0 });
  }
  const entry = byHref.get(v.href);
  entry.count++;
  if (entry.files.length < 3) entry.files.push(v.file);
}

console.log(`\n=== Erişilebilirlik Denetimi: Erişilebilir Adı Olmayan <a> Linkleri ===`);
console.log(`Taranan dosya: ${files.length}`);
console.log(`Ham bulgu (tüm sayfalarda toplam): ${allViolations.length}`);
console.log(`Benzersiz sorunlu link (href'e göre): ${byHref.size}\n`);

let i = 1;
for (const entry of [...byHref.values()].sort((a, b) => b.count - a.count)) {
  console.log(`${i}. ${entry.summary}`);
  console.log(`   href: ${entry.href}`);
  console.log(`   Görüldüğü sayfa sayısı: ${entry.count} (ör. ${entry.files.join(', ')}${entry.count > entry.files.length ? ', …' : ''})`);
  console.log('');
  i++;
}

if (byHref.size === 0) {
  console.log('✅ Erişilebilir adı olmayan link bulunamadı.');
  process.exit(0);
} else {
  console.log(`❌ ${byHref.size} benzersiz link erişilebilir ad taşımıyor (yukarıda listelendi).`);
  process.exit(1);
}
