// ÜRÜNLER mega-menüsünün 4 kolonundaki (Çalışan Yönetimi, İş Gücü Yönetimi,
// Yetenek Yönetimi, Donanım Yönetimi) TÜM linklerini, 4 dilin her birinin
// ana sayfasında render edilen gerçek MegaMenu.tsx astro-island prop'undan
// okuyup her birine gerçek bir HTTP isteği atarak 200 döndüklerini doğrular.
// Anchor'lı linkler (`#rfid` gibi) için ayrıca hedef sayfanın HTML'inde o
// `id`'nin gerçekten var olduğunu da doğrular (fetch fragment'ı sunucuya
// göndermediği için salt HTTP status kontrolü yetersiz kalır).
//
// ÜRÜNLER island'ı diğer üç mega-menüden (Sektörler/Kurumsal/Keşfet) ayırt
// etmek için `"source":"idenfit"` ikon işareti kullanılır — yalnızca ÜRÜNLER
// kolonlarının ikonları bu kaynağı kullanır (bkz. navigation.ts), bu yüzden
// dil bağımsız güvenilir bir ayraç (buton metni/başlık dile göre değişir).
//
// Donanım Yönetimi kolonu artık KAPSAM İÇİNDE (`/donanim/` gerçek içerikle
// kuruldu, bkz. `hardwareContent.ts`) — diğer 20 modül linkiyle aynı
// şekilde 200 + (varsa) anchor id doğrulaması bekleniyor.
//
// Çalışan Yönetimi ve İş Gücü Yönetimi kolonlarının en üstündeki "Genel
// Bakış" linkleri (2 İK hub sayfasına gider, bkz. `hubContent.ts`) de
// dahil — NL'de bu 2 hub sayfası kaynakta yok (KARAR 2), NL linki EN
// slug'ına düşüyor ve Astro'nun statik NL→EN fallback redirect'i üzerinden
// çözülüyor; `fetch()` varsayılan olarak redirect'i takip ettiği için bu
// iki link de burada normal şekilde 200 olarak doğrulanır.
//
// Gereksinim: dev server ayakta olmalı (`astro dev --background`).
// Çalıştırma: node scripts/test-urunler-menu-links.mjs

const BASE = 'http://localhost:4321';
const HOME_PATHS = { tr: '/', en: '/en/', nl: '/nl/', it: '/it/' };

function decodeEntities(s) {
  return s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}

/** Sayfadaki TÜM MegaMenu.tsx astro-island'larından yalnızca ÜRÜNLER'e ait
 * olanının ham (decode edilmiş) `props` string'ini döner. */
function extractUrunlerPropsRaw(html) {
  const marker = 'component-url="/src/components/MegaMenu.tsx"';
  let searchFrom = 0;
  while (true) {
    const idx = html.indexOf(marker, searchFrom);
    if (idx === -1) return null;
    const propsStart = html.indexOf('props="', idx);
    const propsValueStart = propsStart + 'props="'.length;
    const propsValueEnd = html.indexOf('"', propsValueStart);
    const raw = decodeEntities(html.slice(propsValueStart, propsValueEnd));
    if (raw.includes('"idenfit"')) return raw;
    searchFrom = propsValueEnd;
  }
}

/** `"columns":[1,[ ... ]],"promo":` arasındaki bölümden yalnızca kolon
 * link'lerinin {label, href} çiftlerini çıkarır (intro.linkHref / promo.ctaHref
 * farklı anahtar adı kullandığı için ["href"] deseniyle çakışmaz). */
function extractColumnLinks(propsRaw) {
  const columnsStart = propsRaw.indexOf('"columns"');
  const promoStart = propsRaw.indexOf('"promo"', columnsStart);
  const segment = propsRaw.slice(columnsStart, promoStart === -1 ? undefined : promoStart);
  const linkRe = /"label":\[0,"([^"]*)"\],"href":\[0,"([^"]*)"\]/g;
  const links = [];
  let m;
  while ((m = linkRe.exec(segment))) {
    links.push({ label: m[1], href: m[2] });
  }
  return links;
}

async function fetchPath(path) {
  const res = await fetch(`${BASE}${path}`);
  const html = await res.text();
  return { status: res.status, html };
}

async function main() {
  const allResults = [];
  const pageCache = new Map();

  for (const [locale, homePath] of Object.entries(HOME_PATHS)) {
    const home = await fetchPath(homePath);
    if (home.status !== 200) {
      console.log(`❌ ${locale} ana sayfa ${home.status} döndü — atlanıyor`);
      continue;
    }
    const propsRaw = extractUrunlerPropsRaw(home.html);
    if (!propsRaw) {
      console.log(`❌ ${locale}: ÜRÜNLER MegaMenu island'ı bulunamadı`);
      continue;
    }
    const links = extractColumnLinks(propsRaw);
    console.log(`\n--- ${locale} (${links.length} link) ---`);
    for (const { label, href } of links) {
      const [path, anchor] = href.split('#');
      if (!pageCache.has(path)) pageCache.set(path, await fetchPath(path));
      const { status, html } = pageCache.get(path);
      let anchorOk = true;
      if (status === 200 && anchor) {
        anchorOk = new RegExp(`id="${anchor}"`).test(html);
      }
      const ok = status === 200 && anchorOk;
      allResults.push({ locale, label, href, status, anchor, anchorOk });
      const icon = ok ? '✅' : '❌';
      const anchorNote = anchor ? (anchorOk ? ` (#${anchor} bulundu)` : ` (#${anchor} SAYFADA YOK!)`) : '';
      console.log(`  ${icon} [${status}] ${label} → ${href}${anchorNote}`);
    }
  }

  const fail = allResults.filter((r) => r.status !== 200 || !r.anchorOk);
  console.log(`\n=== SONUÇ ===`);
  console.log(`${allResults.length - fail.length}/${allResults.length} link (durum + anchor) doğrulandı`);

  if (fail.length > 0) {
    console.log('\nBaşarısız linkler:');
    for (const f of fail) {
      console.log(
        `  - ${f.locale}: ${f.label} → ${f.href} (status ${f.status}${f.anchor && !f.anchorOk ? `, #${f.anchor} bulunamadı` : ''})`,
      );
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
