// DOM boyutu sistematik tarama scripti (2026-08-10) — Chrome DevTools'un
// "1501 element" büyük DOM uyarısına hangi sayfa türü/türlerinin sebep
// olduğunu bulmak için. Tek bir "etkilenen sayfa" bilgisi YOKTU, bu
// yüzden site genelinden TEMSİLİ bir örneklem alınıyor (hepsi değil —
// 877 sayfanın tamamını taramak bu aşamada gereksiz, sayfa TÜRLERİ arası
// karşılaştırma yeterli kök neden sinyali veriyor).
//
// `playwright` projede kalıcı bir devDependency DEĞİL — `verify-navbar-jank.mjs`/
// `verify-marquee-scroll.mjs` ile AYNI kalıcı desen: `npx` her çalıştırmada
// geçici kurulur (bkz. o script'lerdeki AYNI yorum).
//
// Ölçüm: `document.querySelectorAll('*').length` — Chrome DevTools'un
// "Elements panelinde X node" uyarısıyla BİREBİR aynı sayım yöntemi.
// Eşik: Chrome'un kendi "aşırı DOM boyutu" uyarısı >1400-1500 node'da
// tetikleniyor (kaynak: Lighthouse "Avoid an excessive DOM size" denetimi,
// 1500 node varsayılan eşiği) — bu script 1000'i "şüpheli" eşiği olarak
// kullanıyor (Lighthouse'un kendi "uyarı" bandı 800-1400 arası, 1500 üstü
// "hata" — 1000 bu iki bandın ortasında, erken sinyal vermek için bilinçli
// olarak temkinli seçildi).
import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4321';
const SUSPICIOUS_THRESHOLD = 1000;

// { label, path, category } — category yalnızca raporlama/gruplama için.
const PAGES = [
  { category: 'Ana sayfa / Landing', label: 'Ana sayfa (TR)', path: '/' },
  { category: 'Ana sayfa / Landing', label: 'Landing page (/demo)', path: '/demo/' },

  { category: 'Blog listesi', label: 'Blog listesi (sayfa 1)', path: '/blog/' },
  { category: 'Blog listesi', label: 'Blog listesi (sayfa 2)', path: '/blog/page/2/' },
  { category: 'Blog listesi', label: 'Blog listesi (sayfa 25)', path: '/blog/page/25/' },
  { category: 'Blog listesi', label: 'Blog listesi (son sayfa, 52)', path: '/blog/page/52/' },

  // Kategori arşiv sayfaları (`/category/<slug>/`) bu projede migrate
  // EDİLMEDİ (bkz. CLAUDE.md Açık nokta #22) — route yok, örneklem dışı.

  { category: 'Tekil blog yazısı', label: 'Blog yazısı (kısa, legacy JSON, ~2,2K karakter)', path: '/blog/serbest-zaman-izni/' },
  { category: 'Tekil blog yazısı', label: 'Blog yazısı (uzun, legacy JSON, ~30,9K karakter)', path: '/blog/gig-ekonomisi/' },
  {
    category: 'Tekil blog yazısı',
    label: 'Blog yazısı (göç etmiş Markdown pilot)',
    path: '/blog/zirve-katilim-ix-kurumsal-egitim-ve-gelisim-zirvesi/',
  },

  { category: 'Ürün/modül sayfası', label: 'Ürün sayfası (PDKS modülü)', path: '/pdks-modulu/' },
  { category: 'Ürün/modül sayfası', label: 'Ürün sayfası (Puantaj, Şema E)', path: '/puantaj-takip-programi-modulu/' },
  { category: 'Ürün/modül sayfası', label: 'Hub sayfası (İK & İşgücü Yönetimi)', path: '/insan-kaynaklari-isgucu-yonetimi/' },

  { category: 'Sektör sayfası', label: 'Sektör sayfası (Gıda)', path: '/gida-sektoru-ik-cozumleri/' },
  { category: 'Sektör sayfası', label: 'Sektör sayfası (Dağıtım/Lojistik)', path: '/dagitim-lojistik-ik-cozumleri/' },

  { category: 'Hesaplama Araçları', label: 'Hesaplama Araçları (8 akordeon)', path: '/hesaplama-araclari/' },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

const results = [];

for (const entry of PAGES) {
  const url = `${BASE_URL}${entry.path}`;
  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const status = response?.status() ?? 0;
    if (status >= 400) {
      results.push({ ...entry, elementCount: null, error: `HTTP ${status}` });
      continue;
    }
    const elementCount = await page.evaluate(() => document.querySelectorAll('*').length);
    results.push({ ...entry, elementCount, error: null });
  } catch (err) {
    results.push({ ...entry, elementCount: null, error: err.message });
  }
}

await context.close();
await browser.close();

// --- Rapor ---
console.log('\n=== DOM Boyutu Taraması ===');
console.log(`Taban URL: ${BASE_URL}`);
console.log(`Şüpheli eşik: >${SUSPICIOUS_THRESHOLD} element\n`);

let currentCategory = null;
for (const r of results) {
  if (r.category !== currentCategory) {
    currentCategory = r.category;
    console.log(`\n--- ${currentCategory} ---`);
  }
  if (r.error) {
    console.log(`  ⚠️  ${r.label.padEnd(48)} ${r.path.padEnd(45)} HATA: ${r.error}`);
    continue;
  }
  const flag = r.elementCount > SUSPICIOUS_THRESHOLD ? '🔴 ŞÜPHELİ' : '🟢';
  console.log(`  ${flag}  ${r.label.padEnd(48)} ${r.path.padEnd(45)} ${String(r.elementCount).padStart(6)} element`);
}

const measured = results.filter((r) => r.elementCount != null);
const suspicious = measured.filter((r) => r.elementCount > SUSPICIOUS_THRESHOLD).sort((a, b) => b.elementCount - a.elementCount);

console.log('\n=== ÖZET ===');
console.log(`Toplam taranan sayfa: ${results.length} (${measured.length} başarılı, ${results.length - measured.length} hata)`);
if (measured.length > 0) {
  const sorted = [...measured].sort((a, b) => b.elementCount - a.elementCount);
  console.log(`En yüksek: ${sorted[0].label} (${sorted[0].path}) — ${sorted[0].elementCount} element`);
  console.log(`En düşük: ${sorted[sorted.length - 1].label} (${sorted[sorted.length - 1].path}) — ${sorted[sorted.length - 1].elementCount} element`);
  const avg = measured.reduce((sum, r) => sum + r.elementCount, 0) / measured.length;
  console.log(`Ortalama: ${avg.toFixed(0)} element`);
}
console.log(`\nŞüpheli (>${SUSPICIOUS_THRESHOLD}) sayfa sayısı: ${suspicious.length}`);
for (const r of suspicious) {
  console.log(`  - ${r.label} (${r.path}): ${r.elementCount} element`);
}

if (suspicious.length === 0) {
  console.log('\n✅ Örneklemdeki hiçbir sayfa şüpheli eşiği aşmadı.');
  process.exit(0);
} else {
  process.exit(1);
}
