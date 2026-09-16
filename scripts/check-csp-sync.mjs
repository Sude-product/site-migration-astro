// KALICI güvenlik/regresyon aracı — `public/_headers` ile `src/data/csp.ts`
// arasındaki sapmayı yakalar.
//
// CSP politikası İKİ yerden servis edilmek ZORUNDA (bkz. `src/data/csp.ts`
// başındaki açıklama): prerender edilmiş ~940 sayfa Cloudflare'ın statik
// varlık katmanından `_headers` ile, `/keystatic/*` + `/api/*` ise Worker'dan
// middleware ile. `_headers` bir veri dosyası — TypeScript import edemez.
// Bu script o iki kopyanın ayrışmadığını garanti ediyor.
//
// Kullanım:
//   node scripts/check-csp-sync.mjs          → doğrular (sapma varsa exit 1)
//   node scripts/check-csp-sync.mjs --fix    → `public/_headers`'ı yeniden üretir
//
// NOT: bu script `dist/` DEĞİL, KAYNAK dosyaları okur — `astro build`
// çalıştırılmış olması GEREKMEZ.
import { readFile, writeFile } from 'node:fs/promises';
import { loadCspModule } from './lib/load-csp.mjs';

const HEADERS_PATH = 'public/_headers';
const fix = process.argv.includes('--fix');

const SHARED_HEADERS = [
  'X-Frame-Options: SAMEORIGIN',
  'X-Content-Type-Options: nosniff',
  'Referrer-Policy: strict-origin-when-cross-origin',
  'Strict-Transport-Security: max-age=31536000; includeSubDomains',
];

function render(csp) {
  const name = csp.cspHeaderName();
  const block = (extra) =>
    [...SHARED_HEADERS, `Reporting-Endpoints: ${csp.REPORTING_ENDPOINTS_HEADER}`, extra]
      .map((line) => `  ${line}`)
      .join('\n');

  return `# ⚠️ BU DOSYA ÜRETİLİYOR — ELLE DÜZENLEMEYİN.
# Kaynak: src/data/csp.ts  ·  Yeniden üret: node scripts/check-csp-sync.mjs --fix
# Doğrula:  node scripts/check-csp-sync.mjs   (sapma varsa exit 1)
#
# Cloudflare Workers+Assets \`_headers\` formatı. Bu dosya YALNIZCA statik
# varlık katmanından servis edilen (prerender=true) sayfalara uygulanır;
# dinamik/SSR rotaların (\`/keystatic/*\`, \`/api/*\`) aynı başlıkları
# \`src/middleware.ts\` üzerinden alır.
#
# Politikanın gerekçeleri (hangi izin neden var, neyin bilerek DIŞARIDA
# bırakıldığı, style-src 'unsafe-inline'ın neden kaldırılamadığı) tek tek
# src/data/csp.ts'te yorum olarak yazılı — burada TEKRARLANMIYOR.
#
# script-src'teki 'unsafe-inline' bir FAIL-SAFE varsayılan:
# \`scripts/generate-csp-headers.mjs\` build sonrası bunu dist/client/_headers'ta
# gerçek SHA256 hash listesiyle değiştiriyor. Generator çalışmazsa site
# bugünkü çalışan politikayla yayına gider, bozuk bir direktifle değil.

/*
${block(`${name}: ${csp.PUBLIC_CSP}`)}

/keystatic/*
${block(`${name}: ${csp.KEYSTATIC_CSP}`)}
`;
}

const csp = await loadCspModule();
const expected = render(csp);

if (fix) {
  await writeFile(HEADERS_PATH, expected, 'utf8');
  console.log(`✅ ${HEADERS_PATH} yeniden üretildi (mod: ${csp.CSP_MODE}).`);
  process.exit(0);
}

let actual = '';
try {
  actual = await readFile(HEADERS_PATH, 'utf8');
} catch {
  console.error(`❌ ${HEADERS_PATH} bulunamadı.`);
  process.exit(1);
}

if (actual === expected) {
  console.log(`✅ CSP senkron: ${HEADERS_PATH} ↔ src/data/csp.ts (mod: ${csp.CSP_MODE}).`);
  process.exit(0);
}

console.error(`❌ ${HEADERS_PATH} ile src/data/csp.ts AYRIŞMIŞ.`);
const a = actual.split('\n');
const e = expected.split('\n');
for (let i = 0; i < Math.max(a.length, e.length); i++) {
  if (a[i] !== e[i]) {
    console.error(`\n  satır ${i + 1}:`);
    console.error(`    dosyada : ${a[i] ?? '(yok)'}`);
    console.error(`    olmalı  : ${e[i] ?? '(yok)'}`);
  }
}
console.error('\nDüzeltmek için: node scripts/check-csp-sync.mjs --fix');
process.exit(1);
