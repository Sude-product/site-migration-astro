// KVKK/Tüketici Hakları/Mesafeli Satış/Güvenlik sayfalarının NL'de kendi
// içeriği yok — dil değiştiricideki "NL" seçeneği her zaman EN'in gerçek
// URL'ine gitmeli, HANGİ sayfadan (TR/EN/IT) tıklanırsa tıklansın AYNI
// (tutarlı) sonucu vermeli. Bulunan bug: `nl` anahtarı `localeUrlsFor()`'da
// hiç set edilmiyordu, bu yüzden TR sayfasından NL'e geçiş `astro.config.mjs`'teki
// elle redirect'e denk gelip çalışıyordu ama EN/IT sayfasından NL'e geçiş
// GERÇEK 404 veriyordu — "bazen İngilizce'ye düşüyor, bazen hata veriyor"
// tutarsızlığı. Bu script HER giriş sayfasından NL'e geçişi test eder.
//
// Gereksinim: dev server ayakta olmalı (`astro dev --background`).
// Çalıştırma: node scripts/test-legal-nl-consistency.mjs

const BASE = 'http://localhost:4321';

const PAGES = [
  { name: 'KVKK', entries: ['/kisisel-verilerin-korunmasi/', '/en/data-use-policy/', '/it/protezione-dati-personali/'] },
  {
    name: 'Tüketici Hakları',
    entries: ['/sozlesme/tuketici-haklari/', '/en/contract/consumer-rights/', '/it/contratto/diritti-dei-consumatori/'],
  },
  {
    name: 'Mesafeli Satış',
    entries: [
      '/sozlesme/mesafeli-satis-sozlesmesi/',
      '/en/contract/distance-sales-contract/',
      '/it/contratto/contratto-di-vendita-a-distanza/',
    ],
  },
  { name: 'Güvenlik', entries: ['/guvenlik/', '/en/security-policy/', '/it/politica-di-sicurezza/'] },
  {
    // Site denetim raporu madde 3 (2026-07-23) — `hubContent.ts`'in kendi
    // `getHubLocaleUrls()`'ü KVKK ailesindeki aynı `nl` eksikliğini
    // tekrarlıyordu, ayrıca düzeltildi.
    name: 'İK Hub — Çalışan Yönetimi',
    entries: [
      '/insan-kaynaklari-yonetimi-modulu/',
      '/en/human-resources-management-modules/',
      '/it/moduli-gestione-risorse-umane/',
    ],
  },
  {
    name: 'İK Hub — İşgücü Yönetimi',
    entries: [
      '/insan-kaynaklari-isgucu-yonetimi/',
      '/en/human-resources-workforce-management-module/',
      '/it/modulo-gestione-risorse-umane-forza-lavoro/',
    ],
  },
];

function unwrap(node) {
  if (!Array.isArray(node)) return node;
  const [tag, value] = node;
  if (tag === 0) return value;
  if (tag === 1) return value.map(unwrap);
  return value;
}

function extractLanguageSwitcherUrls(html) {
  const marker = 'component-url="/src/components/LanguageSwitcher.tsx"';
  const idx = html.indexOf(marker);
  if (idx === -1) return null;
  const propsStart = html.indexOf('props="', idx);
  if (propsStart === -1) return null;
  const valueStart = propsStart + 'props="'.length;
  const valueEnd = html.indexOf('"', valueStart);
  const raw = html
    .slice(valueStart, valueEnd)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
  const parsed = JSON.parse(raw);
  const urlsRaw = unwrap(parsed.urls);
  const urls = {};
  for (const [locale, val] of Object.entries(urlsRaw)) urls[locale] = unwrap(val);
  return urls;
}

async function fetchPage(url) {
  const res = await fetch(url, { redirect: 'follow' });
  return { status: res.status, html: await res.text() };
}

async function main() {
  console.log('KVKK/Tüketici Hakları/Mesafeli Satış/Güvenlik/İK Hub — NL tutarlılık testi\n');
  let total = 0;
  let ok = 0;
  const failures = [];
  /** @type {Record<string,string>} her sayfa için ilk görülen 'nl' hedefi — tüm giriş noktalarında AYNI olmalı */
  const seenNlTarget = {};

  for (const page of PAGES) {
    console.log(`== ${page.name} ==`);
    for (const entry of page.entries) {
      total++;
      const { status, html } = await fetchPage(`${BASE}${entry}`);
      if (status !== 200) {
        console.log(`  ❌ ${entry} → giriş sayfası ${status}`);
        failures.push({ page: page.name, entry, reason: `giriş sayfası ${status}` });
        continue;
      }
      const urls = extractLanguageSwitcherUrls(html);
      const nlTarget = urls?.nl;
      if (!nlTarget) {
        console.log(`  ❌ ${entry} → switcher'da 'nl' yok`);
        failures.push({ page: page.name, entry, reason: "urls['nl'] eksik" });
        continue;
      }
      const target = await fetchPage(`${BASE}${nlTarget}`);
      const prevTarget = seenNlTarget[page.name];
      const consistent = prevTarget === undefined || prevTarget === nlTarget;
      if (!consistent) {
        console.log(`  ❌ ${entry} → nl='${nlTarget}' ama başka bir sayfadan '${prevTarget}' bulunmuştu (TUTARSIZ)`);
        failures.push({ page: page.name, entry, reason: `tutarsız hedef: ${nlTarget} vs ${prevTarget}` });
        continue;
      }
      seenNlTarget[page.name] = nlTarget;
      if (target.status === 200) {
        ok++;
        console.log(`  ✅ ${entry} → nl='${nlTarget}' (200)`);
      } else {
        console.log(`  ❌ ${entry} → nl='${nlTarget}' hedefi ${target.status} döndü`);
        failures.push({ page: page.name, entry, reason: `${nlTarget} → ${target.status}` });
      }
    }
  }

  console.log(`\n=== SONUÇ: ${ok}/${total} giriş noktası tutarlı + çalışıyor ===`);
  if (failures.length > 0) {
    console.log('\nBaşarısız:');
    for (const f of failures) console.log(`  - ${f.page} (${f.entry}): ${f.reason}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
