// BUILD SONRASI adım — `dist/client/_headers`'taki script-src'in
// `'unsafe-inline'` iznini, sitede GERÇEKTEN bulunan inline script'lerin
// SHA256 hash'leriyle değiştirir.
//
// `npm run build` zincirinin parçası; elle de çalıştırılabilir:
//   node scripts/generate-csp-headers.mjs
//
// **Neden build sonrası:** hash'lenen içerik bundler ÇIKTISI (Astro'nun
// island yükleyicisi, hydration script'leri, Analytics.astro'nun define:vars
// blokları). İçerik her build'de değişebildiği için kaynağa sabit hash
// yazmak mümkün değil.
//
// **Yalnızca ÇALIŞTIRILABİLİR script'ler hash'leniyor.**
// `type="application/ld+json"` (sitede ~940 sayfada, her biri farklı) ve
// benzeri JS-olmayan tipler atlanıyor: HTML spesifikasyonunda bir script
// elemanının tipi geçerli bir JS tipi değilse eleman HİÇ çalıştırılmaz ve
// CSP inline kontrolü o noktaya varmadan çıkılır — yani JSON-LD script-src
// tarafından engellenmez. **Bu davranış canlı olarak DOĞRULANMADI**; eğer
// varsayım yanlışsa Report-Only turu bunu anında gösterir (~940 sayfadan
// `script-src` ihlal raporu yağar) ve hash yaklaşımı geri alınır. Politika
// şu an Report-Only olduğu için bu testin maliyeti SIFIR.
//
// **Fail-safe:** `'unsafe-inline'` bulunamazsa dosyaya DOKUNULMAZ ve script
// exit 1 ile çıkar — yarım/bozuk bir politika yayına gitmez.
import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { loadCspModule } from './lib/load-csp.mjs';

const DIST_DIR = process.env.DIST_DIR ?? 'dist/client';
const HEADERS_FILE = join(DIST_DIR, '_headers');

// Bir script elemanının ÇALIŞTIRILABİLİR sayıldığı tipler (HTML spec).
// Boş/eksik `type` = klasik script.
const EXECUTABLE_TYPES = new Set([
  '',
  'module',
  'text/javascript',
  'application/javascript',
  'text/ecmascript',
  'application/ecmascript',
  'text/jscript',
  'module',
]);

// NOT: `readdir(dir,{recursive:true})` BİLEREK kullanılmıyor — bu proje
// OneDrive-senkronize bir klasörde ve o seçenek zaman zaman sessizce daha
// az dosya döndürüyor (bkz. CLAUDE.md, check-*.mjs desen notu).
async function collectHtmlFiles(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await collectHtmlFiles(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function scriptType(attrs) {
  const match = attrs.match(/\btype\s*=\s*["']([^"']*)["']/i);
  return (match?.[1] ?? '').trim().toLowerCase();
}

function collectHashes(html, hashes, skipped) {
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    const [, attrs, body] = match;
    if (/\bsrc\s*=/i.test(attrs)) continue; // dış script — host allowlist'i kapsar
    const type = scriptType(attrs);
    if (!EXECUTABLE_TYPES.has(type)) {
      skipped.add(type);
      continue;
    }
    if (body.length === 0) continue;
    // Tarayıcı, elemanın METİN İÇERİĞİNİ olduğu gibi (trim etmeden,
    // UTF-8 olarak) hash'ler.
    hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
  }
}

const csp = await loadCspModule();

let headers;
try {
  headers = await readFile(HEADERS_FILE, 'utf8');
} catch {
  console.error(`❌ ${HEADERS_FILE} yok — önce \`astro build\` çalıştırın.`);
  process.exit(1);
}

const files = await collectHtmlFiles(DIST_DIR);
const hashes = new Set();
const skippedTypes = new Set();
for (const file of files) collectHashes(await readFile(file, 'utf8'), hashes, skippedTypes);

if (hashes.size === 0) {
  console.error('❌ Hiç inline script bulunamadı — tarama büyük olasılıkla hatalı, dosyaya dokunulmadı.');
  process.exit(1);
}

const hashList = [...hashes].sort().join(' ');

// Politikanın YALNIZCA genel (`/*`) bloğundaki script-src değiştiriliyor.
// `/keystatic/*` bloğu kendi `'unsafe-inline' 'unsafe-eval'` iznini
// KORUYOR: admin panelinin bundle'ı çalışma zamanında script üretiyor,
// hash'lenmesi mümkün değil ve o rota halka açık değil.
let replaced = 0;
const out = headers
  .split('\n')
  .map((line) => {
    if (!line.includes(`${csp.cspHeaderName()}:`)) return line;
    if (line.includes("'unsafe-eval'")) return line; // keystatic bloğu
    if (!line.includes(csp.INLINE_SCRIPT_TOKEN)) return line;
    replaced++;
    return line.replace(csp.INLINE_SCRIPT_TOKEN, hashList);
  })
  .join('\n');

if (replaced !== 1) {
  console.error(
    `❌ Genel CSP bloğunda script-src '${csp.INLINE_SCRIPT_TOKEN}' tam 1 kez beklenirken ${replaced} kez bulundu — dosyaya dokunulmadı.`,
  );
  process.exit(1);
}

await writeFile(HEADERS_FILE, out, 'utf8');

console.log(`✅ ${HEADERS_FILE} güncellendi (mod: ${csp.CSP_MODE}).`);
console.log(`   ${files.length} HTML tarandı, ${hashes.size} benzersiz inline script hash'lendi.`);
if (skippedTypes.size > 0) {
  console.log(`   Atlanan (çalıştırılabilir olmayan) script tipleri: ${[...skippedTypes].join(', ')}`);
}
