/**
 * Blog yazar adı denetimi — KAYNAK SEVİYESİ (2026-10-21).
 *
 * NEDEN VAR: `authorName` 2026-10-21'de görünür hale geldi (yazı başlığının
 * altındaki byline) ve AYNI değer JSON-LD `author`ına `Person.name` olarak
 * basılıyor. Keystatic panelindeki alan serbest metin — doğrulaması YOK ve
 * bir yazım varyantı hiçbir yerde hata vermez, sessizce yanlış olur:
 * gerçekten yaşandı, aynı kişi hem "Sude Özdemir" (18 yazı) hem "sude
 * özdemir" (3 yazı) olarak kaydedilmiş ve şemaya İKİ AYRI `Person` olarak
 * gidiyordu. Bir CLAUDE.md notu bunu engellemezdi (projenin #50/#52 dersi);
 * bu yüzden kontrol bir script.
 *
 * KURAL: `authorName` ya hiç olmamalı/boş olmalı (→ sayfada ve şemada kurum
 * adı `idenfit` kullanılır) ya da aşağıdaki `ALLOWED_AUTHOR_NAMES` listesinde
 * BİREBİR (büyük/küçük harf dahil) yer almalı.
 *
 * ⚠️ İZİNLİ LİSTE BU DOSYADA, TEK YERDE tutulur. Yeni bir yazar eklenecekse
 * yapılacak tek şey bu diziye adı eklemek. `keystatic.config.ts` ve
 * `src/content.config.ts` buraya ATIFTA bulunur, listeyi KOPYALAMAZ — iki
 * kopya bir gün sessizce ayrışırdı.
 *
 * ⚠️ BU SCRIPT BUILD'İ DURDURUR: `package.json`'daki `build` zincirinin İLK
 * adımı (kullanıcı kararı, 2026-10-21). Yani panelden listede olmayan bir
 * adla yazı yayınlanırsa Cloudflare build'i başarısız olur ve o deploy
 * (sitenin tamamı) canlıya çıkmaz. Kasıtlı bir ödün: yanlış atıf yapılmış
 * bir yazının yayınlanmasındansa deploy'un durması tercih edildi. Çözüm her
 * zaman tek satır — adı listeye eklemek.
 *
 * Çalıştırma: `node scripts/check-blog-author-name.mjs`
 * Çıkış kodu: sorun yoksa 0, en az bir sorun varsa 1.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load as loadYaml } from 'js-yaml';

/** İzinli yazar adları — TEK KAYNAK. Birebir eşleşme aranır. */
export const ALLOWED_AUTHOR_NAMES = ['Sude Özdemir'];

const BLOG_DIR = process.env.BLOG_DIR ?? 'src/content/blog';

const files = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith('.md'))
  .sort();

const allowed = new Set(ALLOWED_AUTHOR_NAMES);
const violations = [];
const unparsable = [];
const counts = new Map();
let withoutAuthor = 0;

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

  const value = data?.authorName;
  // Alan yok / null / yalnızca boşluk → kurum adına atfedilir, kapsam dışı.
  if (typeof value !== 'string' || value.trim() === '') {
    withoutAuthor += 1;
    continue;
  }

  counts.set(value, (counts.get(value) ?? 0) + 1);
  if (!allowed.has(value)) violations.push({ file, value });
}

console.log('\n=== Blog Yazar Adı Denetimi ===');
console.log(`Taranan yazı: ${files.length} (${files.length - withoutAuthor - unparsable.length} yazar adı dolu, ${withoutAuthor} boş → "idenfit")`);
console.log(`İzinli adlar: ${ALLOWED_AUTHOR_NAMES.map((n) => `"${n}"`).join(', ')}\n`);

console.log('--- KULLANILAN ADLAR ---');
const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
for (const [name, count] of sorted) {
  console.log(`  ${String(count).padStart(4)}  "${name}"${allowed.has(name) ? '' : '   <-- İZİNLİ DEĞİL'}`);
}
if (sorted.length === 0) console.log('  (hiçbir yazıda yazar adı yok)');

console.log(`\n--- İZİNLİ LİSTEDE OLMAYAN (${violations.length}) ---`);
for (const v of violations) console.log(`  ${v.file}  ->  "${v.value}"`);
if (violations.length === 0) console.log('  (yok)');

if (unparsable.length > 0) {
  console.log(`\n--- FRONTMATTER OKUNAMADI (${unparsable.length}) ---`);
  for (const entry of unparsable) console.log(`  ${entry}`);
}

const problems = violations.length + unparsable.length;
console.log(`\n=== ÖZET: ${problems} sorun (${violations.length} izinsiz ad, ${unparsable.length} okunamadı) ===`);
if (problems > 0) {
  console.log('Düzeltme: adı doğru yazıma çevirin ya da gerçekten yeni bir yazarsa');
  console.log('bu dosyadaki ALLOWED_AUTHOR_NAMES dizisine ekleyin.\n');
} else {
  console.log('');
}

process.exit(problems === 0 ? 0 : 1);
