// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';

// Blog gövdesinde yanlışlıkla kullanılmış `<h1>` başlıklarını render-time'da
// `<h2>`'ye indirger (2026-08-12, SEO uyarısı: "2026-sgk-tesvikleri-rehberi-
// neler-degisti" yazısında canlı idenfit.com'da 7 H1 bulundu — WordPress
// Gutenberg editöründe bazı yazarlar ara başlıklar için yanlışlıkla
// "Heading 1" blok stilini seçmiş). Sayfa şablonu (`src/pages/blog/
// [slug].astro`) zaten kendi TEK `<h1>`'ini basıyor, gövdede kalan herhangi
// bir `<h1>` her zaman geçersiz HTML semantiği (birden fazla H1).
//
// Bu, `src/data/blogHeadingSanitizer.ts`'in (legacy JSON — ham WP HTML
// passthrough — için kullanılan regex tabanlı `demoteBodyH1s()`) İKİNCİ,
// TAMAMLAYICI katmanı: göç etmiş `.md` yazılar (Decap CMS) `astro:content`'in
// "deferred render" mekanizmasıyla render ediliyor (bkz. `content.config.ts`
// git geçmişi — `store.entries()` üzerinden loader-time müdahale bu yazılar
// için ÇALIŞMIYOR, HTML henüz üretilmemiş oluyor) — gerçek render bu
// `markdown.processor` boru hattından geçiyor, tek doğru müdahale noktası
// burası. **Astro 7.1'de varsayılan Markdown işleyicisi artık "Sätteri"**
// (`markdown.rehypePlugins` doğrudan kullanılırsa deprecation uyarısı
// veriyor + `@astrojs/markdown-remark` paketinin kurulu olmasını
// gerektiriyor, bkz. bu paketin `package.json`'a eklenmesi) — bu yüzden
// eski `unified` işleyicisi `@astrojs/markdown-remark`'tan İÇE AKTARILIP
// `markdown.processor`'a elle atanıyor (aşağıda). Projede blog DIŞINDA
// Markdown-render edilen tek bir sayfa/koleksiyon yok (doğrulandı), yani
// bu global görünen ayar pratikte yalnızca blog'u etkiliyor.
function rehypeDemoteBodyH1s() {
  return (/** @type {any} */ tree) => {
    /** @param {any} node */
    function walk(node) {
      if (node.tagName === 'h1') node.tagName = 'h2';
      for (const child of node.children ?? []) walk(child);
    }
    walk(tree);
  };
}

// Başlık SEVİYE ATLAMASI normalize etme (2026-08-17, "Heading hierarchy is
// not sequential" SEO bulgusu — bkz. CLAUDE.md Açık nokta #33a). AYNI kök
// neden ailesi (Gutenberg'de yazarlar ara başlıklar için rastgele/yanlış
// "Heading N" seviyesi seçmiş — H2'den doğrudan H4/H5/H6'ya atlamak gibi)
// ama farklı hata sınıfı: geçersiz bir etiket (H1 tekrarı) yok, yalnızca
// seviyeler SIRALI DEĞİL. `src/data/blogHeadingSanitizer.ts`'in
// `normalizeHeadingLevels()`'inin (legacy JSON — regex tabanlı) AST
// karşılığı — TAM AYNI mantık (yığın/stack tabanlı `min(ham, ebeveyn+1)`
// kuralı, bkz. o dosyadaki tam ispat/örnek yorumu), yalnızca HAST
// düğümleri üzerinde çalışıyor. `rehypeDemoteBodyH1s`'TEN SONRA
// çalışmalı (array sırası önemli — aşağıya bakın) — o zamana kadar
// gövdede gerçek `<h1>` kalmamış olmalı, aksi halde bir gövde-H1 kök
// sentinel'le (`{raw:1}`) çakışıp yine bir H1 üretirdi. Zaten SIRALI
// olan belgelerde NO-OP'tur (matematiksel ispat: `normalizeHeadingLevels()`
// yorumuna bkz.) — bu turda göç etmiş yalnızca 4 Markdown pilot yazının
// (bkz. CLAUDE.md) 1'i (`zirve-katilim-ix-kurumsal-egitim-ve-gelisim-zirvesi`,
// H1→H3 atlaması) etkileniyordu, diğer 3'ü zaten sıralıydı/dokunulmadı.
function rehypeNormalizeHeadingLevels() {
  return (/** @type {any} */ tree) => {
    const stack = [{ raw: 1, mapped: 1 }];
    /** @param {any} node */
    function walk(node) {
      const match = /^h([1-6])$/.exec(node.tagName ?? '');
      if (match) {
        const raw = Number(match[1]);
        while (stack.length > 1 && stack[stack.length - 1].raw >= raw) stack.pop();
        const mapped = stack[stack.length - 1].mapped + 1;
        stack.push({ raw, mapped });
        node.tagName = `h${mapped}`;
      }
      for (const child of node.children ?? []) walk(child);
    }
    walk(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  // DÜZELTME (2026-08-27, Keystatic geçişi ADIM 1) — önceki `output:'static'`
  // (adapter yok) yerine `output:'server'` + Cloudflare adapter. Keystatic'in
  // kendi dokümantasyonu: admin panelinin dosya-sistemi işlemleri Node.js
  // API'lerine ihtiyaç duyuyor, bu yüzden bir adapter ZORUNLU. Astro 5+'ta
  // eski `output:'hybrid'` KALDIRILDI — modern eşdeğeri `output:'server'` +
  // her sayfada AYRI AYRI `export const prerender = true` (config seviyesinde
  // toplu bir "varsayılan statik" seçeneği YOK, Astro'nun kendi dokümantasyonu
  // bunu teyit ediyor). Mevcut 201 sayfa dosyasının TAMAMINA bu export
  // eklendi (bkz. git diff) — hiçbiri yanlışlıkla server-render'a KAYMADI.
  //
  // BİLİNÇLİ MİMARİ DEĞİŞİKLİK (kullanıcı onayıyla, 2026-08-27): aşağıdaki
  // `redirects` bloğu ve i18n `fallback` mekanizmasının ürettiği ~2186
  // redirect sayfası artık `output:'static'`'te olduğu gibi statik
  // `<meta http-equiv="refresh">` HTML dosyası ÜRETMİYOR — Astro'nun kendi
  // dokümantasyonu: bu davranış yalnızca `output:'static'`'e özgü, adapter'lı
  // `server` modunda TÜM redirect'ler adapter'ın runtime'ında gerçek HTTP
  // 301/308 olarak işleniyor. Bu bir regresyon DEĞİL (meta-refresh'ten daha
  // güvenilir bir SEO mekanizması) ama `dist/` dosya sayısı bu yüzden
  // yapısal olarak düşüyor — bkz. Keystatic geçiş günlüğü ADIM 1 raporu.
  output: 'server',
  adapter: cloudflare(),
  integrations: [react(), keystatic()],
  markdown: {
    processor: unified({ rehypePlugins: [rehypeDemoteBodyH1s, rehypeNormalizeHeadingLevels] }),
  },
  vite: {
    plugins: [tailwindcss()],
    // KALICI ÇÖZÜM (2026-07-23) — bkz. CLAUDE.md "Vite bağımlılık önbelleği
    // bozulması" bölümü. Kök neden: Vite'ın `optimizeDeps` mekanizması,
    // dev server ÇALIŞIRKEN yeni/değişmiş bir bağımlılık algılarsa (ör.
    // `npm install`/`uninstall` — Playwright gibi geçici bir paket
    // kurup kaldırmak `esbuild` gibi PAYLAŞILAN bağımlılıkları da yeniden
    // kurabiliyor) canlı süreçte "optimized dependencies changed,
    // reloading" tetikleyip kendi kendine yeniden derleme yapıyor — bu
    // döngü bazen `astro:server-app.js` (Astro'nun internal modülü) yükleme
    // hatasıyla yarım kalıp TÜM React island'ların JSX runtime'ını
    // (`_jsxDEV is not a function`) kalıcı olarak bozuyor (bilinen bir
    // Astro/Vite hatası — withastro/astro#15952). Önceki turlarda bu
    // yalnızca elle `node_modules/.vite` silinip dev server yeniden
    // başlatılarak (geçici) çözülüyordu — sorun defalarca tekrarladı.
    // `optimizeDeps.force: true`, dev server'ın NASIL başlatıldığından
    // bağımsız olarak (doğrudan `astro dev`, `npm run dev`, veya bu
    // projedeki `astro dev --background` sarmalayıcısı — hepsi aynı Vite
    // yapılandırmasını okur) HER başlangıçta disk önbelleğini (`node_modules/.vite`)
    // güvenilmeyip SIFIRDAN yeniden oluşturur — stale/bozuk önbellek
    // sınıfının TAMAMINI kalıcı olarak ortadan kaldırır. Bedeli: her
    // `astro dev` başlangıcında ~1-3 saniyelik ekstra yeniden-optimize
    // süresi — bu projenin ölçeğinde ihmal edilebilir, tekrar eden manuel
    // müdahaleden çok daha ucuz.
    //
    // İKİNCİ KATMAN (2026-07-23, `force` YETERSİZ ÇIKTIĞI için eklendi) —
    // `force: true` yalnızca SOĞUK BAŞLANGIÇTAKİ disk önbelleğini düzeltir;
    // Vite'ın bağımlılık TARAYICISI varsayılan olarak SADECE ZİYARET EDİLEN
    // sayfalardan erişilebilen import'ları keşfeder ("lazy discovery") —
    // henüz hiç açılmamış bir sayfaya (ör. `/hesaplama-araclari/`) dev
    // server ÇALIŞIRKEN ilk kez girildiğinde, o sayfanın kullandığı bir
    // paket "yeni" sayılıp CANLI SÜREÇTE "optimized dependencies changed,
    // reloading" tetikleniyordu — yukarıdaki withastro/astro#15952 hatası
    // TAM OLARAK bu anda devreye girip JSX runtime'ı kalıcı olarak
    // bozuyordu (`force: true` bunu ÖNLEYEMEZ, çünkü tetikleyici olay
    // sunucu zaten çalışırken gerçekleşiyor).
    //
    // Çözüm: `include` ile bu projenin kullandığı 5 harici paketin
    // (`react`, `react-dom`, `react-dom/client`, `lucide-react`,
    // `lottie-web` [2026-07-29, HR Olgunluk Testi hero'sunun dekoratif arc
    // animasyonu için eklendi] — `astro:i18n` Astro'nun kendi sanal
    // modülü, optimize edilmesi gerekmiyor) HANGİ SAYFA ziyaret edilirse
    // edilsin baştan, KOŞULSUZ pre-bundle edilmesi garanti edildi —
    // "sürpriz"/mid-session keşif için artık hiçbir paket kalmadı.
    // **DENENİP TERK EDİLEN alternatif:**
    // `optimizeDeps.entries` ile TÜM proje dosyalarını (`src/**/*.{astro,ts,tsx}`)
    // baştan tarayıp `include`'a hiç gerek kalmadan otomatik keşfetmeyi
    // denedik — bu KIRILGAN çıktı: Vite'ın `.astro` tarama eklentisi bir
    // dosyadaki (`FaqPage.astro`) sıradan bir TÜRKÇE YORUM satırını
    // (`.classList.add(...)` örneği içeren, kod DEĞİL) yanlış ayrıştırıp
    // TÜM taramayı `[PARSE_ERROR]` ile başarısız kıldı — proje büyüdükçe
    // benzer bir yorum her an aynı sınıf hatayı tekrar tetikleyebilirdi.
    // `include` (parse/tarama gerektirmez, doğrudan paket adı listesi) bu
    // riski taşımadığı için tercih edildi.
    //
    // ÜÇÜNCÜ KATMAN, KAYNAK DÜZEYİNDE (2026-07-23) — yukarıdaki iki config
    // katmanı sorunun SIKLIĞINI azalttı ama tamamen kapatmadı: bug bir kez
    // daha, hiçbir bilinen tetikleyici (npm install, yeni sayfa ziyareti)
    // olmadan kendiliğinden tekrarladı. Bu, sorunun projeye özgü bir
    // config eksikliği değil, `astro`nun kendisindeki bir hata olduğunu
    // (withastro/astro#15952) doğruladı — kalıcı çözüm `astro`yu `7.0.9`
    // → `7.1.3`'e güncellemek oldu (bkz. CLAUDE.md "İKİNCİL GÜNCELLEME"
    // bölümü, 3 döngülük doğrulama). Bundan sonra bu sınıf bir hata tekrar
    // görülürse ÖNCE `npm view astro version` ile güncel sürüm kontrol
    // edilmeli, config'e dördüncü bir katman eklemeden önce.
    optimizeDeps: {
      force: true,
      // `astro/virtual-modules/i18n.js`/`astro/logger/json` (2026-08-29
      // eklendi): Vite'ın başlangıç taraması bunları KAÇIRIYOR (framework-
      // içi sanal modüller, kullanıcı kodundan statik `import` ile
      // ERİŞİLEMİYOR — yalnızca `getRelativeLocaleUrl()` gibi runtime
      // çağrılarıyla ilk gerçek sayfa isteğinde keşfediliyor). Bu YAŞAYAN
      // (dev server ayaktayken) keşif, yukarıdaki `force`'un önlediği sınıfın
      // AYNISI bir "optimized dependencies changed, reloading" döngüsü
      // tetikleyip SSR modül kaydını invalidate ediyor — zaten yüklenmiş
      // React tüketen island'lar (`MegaMenu`/`LanguageSwitcher`/`MobileMenu`
      // vb.) İKİ FARKLI React kopyası arasında kalıp "Invalid hook call"
      // hatasıyla çöküyordu (ana sayfaya İLK isteğin bile tetiklediği
      // doğrulandı). Bu iki modül de `include`'a eklenerek COLD START'ta
      // önceden paketleniyor, canlı yeniden-optimizasyon hiç tetiklenmiyor.
      include: ['react', 'react-dom', 'react-dom/client', 'lucide-react', 'lottie-web', 'astro/virtual-modules/i18n.js', 'astro/logger/json'],
    },
  },
  i18n: {
    locales: ['tr', 'en', 'nl', 'it', 'az'],
    defaultLocale: 'tr',
    routing: {
      // Türkçe (defaultLocale) prefix'siz köke oturur: /
      // Diğer diller prefix'li: /en/, /nl/, /it/
      prefixDefaultLocale: false,
      // NL fallback (KARAR 1, bkz. CLAUDE.md): `fallback` haritasındaki bir
      // locale için sayfa yoksa Astro build sırasında otomatik redirect
      // sayfası üretir. Middleware/SSR gerekmez, statik build'de çalışır.
      fallbackType: 'redirect',
    },
    // NL'de WordPress kaynağında da hiç olmayan sayfalar var (KVKK, Gizlilik,
    // Güvenlik, SSS, İletişim, Teşekkürler, Destek Talebi — bkz.
    // docs/page-inventory.md §3.6). Bu sayfalar `src/pages/nl/` altında
    // oluşturulmadığı sürece /nl/<slug>/ isteği otomatik olarak /en/<slug>/
    // adresine yönlendirilir. NL'de gerçek bir sayfa eklendiği an (aynı slug
    // altında) bu fallback o sayfa için otomatik devre dışı kalır. ⚠️ Online
    // Sunum Talebi 2026-08-04'te bu listeden ÇIKARILDI — kaynakta hâlâ yok
    // (canlı `idenfit.com/nl/`'in kendi CTA'sı bile EN'e gidiyor), ama
    // kullanıcının açık talimatıyla gerçek bir NL sayfası eklendi
    // (`PRESENTATION_NL_OVERRIDE`, TR kaynaktan profesyonel çeviri).
    //
    // EN/IT → TR fallback (2026-07-24 eklendi): KARAR 2 gereği kaynakta
    // gerçek çevirisi olmayan bazı sayfalar (şu an tek örnek: Hesaplama
    // Araçları, `/hesaplama-araclari/` yalnızca TR'de var) EN/IT'de hiç
    // route'lanmıyor — bu sayfalardan birine `/en/<slug>/` veya `/it/<slug>/`
    // ile gelen bir ziyaretçi önceden SESSİZCE 404 alıyordu. Aynı NL
    // mekanizmasıyla artık TR'nin (defaultLocale, prefix'siz) bare sayfasına
    // otomatik statik redirect üretiliyor. Yalnızca AYNI bare slug altında
    // gerçekten eksik olan sayfaları etkiler — per-locale slug'ı FARKLI olan
    // sayfalar (ör. Tüketici Hakları) zaten kendi TR slug'ında EN/IT sayfası
    // olmadığından bu fallback'i tetiklemez, onlar hâlâ aşağıdaki elle
    // `redirects` girdileriyle çözülüyor.
    fallback: {
      nl: 'en',
      en: 'tr',
      it: 'tr',
      // az (Azerbaycan dili, 2026-08-21 eklendi): gerçek çeviri fazlı
      // olarak ilerliyor (bkz. CLAUDE.md) — henüz az sayfası oluşturulmamış
      // her route TR'ye (defaultLocale) fallback eder, aynen en/it gibi.
      // Gerçek bir az sayfası eklendiği an o sayfa için bu fallback
      // kendiliğinden devre dışı kalır.
      az: 'tr',
    },
  },
  // Yukarıdaki otomatik `fallback` mekanizması yalnızca TR/EN'in AYNI bare
  // slug'ı paylaştığı sayfalarda doğru çalışır (nl/<slug> → en/<slug>).
  // Tüketici Hakları/Mesafeli Satış/Güvenlik sayfalarının EN slug'ı TR'den
  // FARKLI (ör. `sozlesme/tuketici-haklari` → EN'de `contract/consumer-rights`)
  // — otomatik mekanizma bunu bilmediği için var olmayan
  // `/en/sozlesme/tuketici-haklari/`'e yönlendirip 404 üretiyordu. Bu 3
  // sayfa için doğru EN hedefine giden elle redirect tanımlandı (aynı NL
  // fallback politikası, doğru hedefle).
  redirects: {
    '/nl/sozlesme/tuketici-haklari': '/en/contract/consumer-rights',
    '/nl/sozlesme/mesafeli-satis-sozlesmesi': '/en/contract/distance-sales-contract',
    '/nl/guvenlik': '/en/security-policy',
    '/nl/kisisel-verilerin-korunmasi': '/en/data-use-policy',
    '/nl/sozlesme/gizlilik-ve-guvenlik-politikasi': '/en/contract/privacy-and-security-policy',
    '/nl/tesekkurler': '/en/thanks',
    '/nl/destek-talebi': '/en/support-request',
    '/nl/tesekkurler-destek': '/en/thank-you',
    // 2026-07-28'de bulunan bir bug'ın düzeltmesi: `nl:'en'` + `en:'tr'`
    // fallback ZİNCİRİ yalnızca Astro'nun dev server SSR yönlendirmesinde
    // çalışıyor — statik `astro build` çıktısında (`astro preview` ile
    // doğrulandı, Cloudflare Pages'in gerçekte servis edeceği budur) `en`
    // hedefi KENDİSİ de sentetik bir fallback sayfası olduğundan `nl`
    // için ikinci bir zincir üretilmiyor, `/nl/<slug>/` sessizce 404
    // veriyordu. Aynı bare slug'ı TR-only paylaşan HER sayfa için (KARAR 2)
    // elle bir `nl` girdisi gerekiyor — yalnızca yeni sayfa değil, önceden
    // beri var olan Hesaplama Araçları'nın AYNI gizli açığı da burada
    // düzeltildi.
    '/nl/hesaplama-araclari': '/hesaplama-araclari',
    '/nl/ik-dijital-olgunluk-testi': '/ik-dijital-olgunluk-testi',
    // 2026-08-21: `audit-analyze.mjs` ile bulundu — KARAR 2'nin ÜÇÜNCÜ
    // TR-only sayfası olan Blog, yukarıdaki iki kardeşiyle (Hesaplama
    // Araçları/İK Dijital Olgunluk Testi) AYNI "nl:'en'+en:'tr' zinciri
    // statik build'de çalışmıyor" bug'ına sahipti ama o turda eklenmesi
    // unutulmuştu — `/nl/blog/` sessizce 404 veriyordu (dist'te hiç dosya
    // üretilmemiş), ~42 NL sayfasındaki footer/mega-menü linkini kırıyordu.
    '/nl/blog': '/blog',
    // 2026-08-17: hreflang denetim turunda bulundu — SSS'nin TR bare slug'ı
    // (`sss`) EN/IT'nin `faq`'ından FARKLI, bu yüzden otomatik `fallback:
    // {nl:'en'}` mekanizması `/nl/sss/`'i var olmayan `/en/sss/`'e düşürüp
    // sessiz 404 üretiyordu (Tüketici Hakları/Güvenlik'teki AYNI sınıf bug,
    // yukarıdaki elle-redirect deseniyle düzeltildi).
    '/nl/sss': '/en/faq',
    // 2026-07-30: kaynak sitede (idenfit.com) bu yazının slug'ı sonradan
    // `2025-issizlik-maasi`'den `2026-issizlik-maasi`'ye değiştirilmiş
    // (başlık zaten "2026..." idi, WP export'umuzun snapshot'ı eski
    // slug'ı yakalamıştı — bkz. CLAUDE.md "sitemap karşılaştırması"
    // günlüğü). Bizim tarafımızda da slug aynı şekilde güncellendi
    // (`posts.json`), eski slug'a gelen linkler/trafik kaybolmasın diye
    // buraya redirect eklendi.
    '/blog/2025-issizlik-maasi': '/blog/2026-issizlik-maasi',
    // 2026-07-30: `/blog/sgk/` kaynak sitede (idenfit.com) 301 ile
    // `/blog/sgk-ceza-ve-denetimleri/`'ye yönleniyor — muhtemelen o
    // yazının eski slug'ı. İçerik zaten `posts.json`'da bu slug altında
    // mevcut (bkz. CLAUDE.md "sitemap karşılaştırması" günlüğü); önceki
    // turda bu bulgu raporlanmış ama redirect eklenmemişti — burada
    // düzeltildi.
    '/blog/sgk': '/blog/sgk-ceza-ve-denetimleri',
    // 2026-07-30: "Online Sunum Talebi" sayfasının route'u BİLİNÇLİ olarak
    // kaynağın gerçek TR slug'ından (`online-sunum-talep-et`) farklı bir
    // canonical slug (`online-sunum-talebi`) kullanıyor — bkz.
    // `miscPagesContent.ts`'teki "Online Sunum Talebi" bölümünün başındaki
    // ayrıntılı gerekçe (proje genelinde onlarca CTA çağrı noktası bu
    // canonical slug'a göre ZATEN kurulmuştu, kaynağın gerçek slug'ına
    // geçmek büyük bir refactor gerektirirdi). Bu, o kararı GERİ ALMIYOR —
    // yalnızca kaynağın gerçek URL'ine (dış linkler/SEO/yer imleri
    // olabilir) gelen bir ziyaretçinin 404 almaması için ucuz bir
    // güvenlik ağı.
    '/online-sunum-talep-et': '/online-sunum-talebi',
    // 2026-08-05: kapsamlı URL denetimi (canlı sitemap_index.xml'in 4 alt
    // sitemap'i ile `astro build` çıktısının tam karşılaştırması) 9 sayfa
    // için AYNI kalıbı buldu — içerik bizde zaten var, ama canlının gerçek
    // slug'ı bizimkinden farklı ve redirect'i unutulmuş (yalnızca TR'nin
    // Online Sunum Talebi'i için böyle bir güvenlik ağı vardı, EN/IT'si
    // hiç eklenmemişti). Dış link/SEO/yer imi trafiği 404 almasın diye:
    '/en/customers': '/en/musteriler',
    '/it/clienti': '/it/musteriler',
    '/nl/klanten': '/nl/musteriler',
    '/en/request-online-presentation': '/en/online-sunum-talebi',
    '/it/richiedi-presentazione-online': '/it/online-sunum-talebi',
    // ⚠️ DÜZELTME (2026-08-29): yukarıdaki 2026-08-05 denetiminin
    // `/en/thank-you` → `/en/thanks` eşlemesi YANLIŞ ÇIKTI — canlı sitede
    // `curl`/tarayıcı ile doğrulandı: `/en/thank-you/` Online Sunum
    // Talebi'nin "thanks" sayfası DEĞİL, tamamen AYRI ve GERÇEK bir sayfa
    // (Destek Talebi'nin teşekkür sayfası, WP id 16742 — bkz.
    // `supportThankYouContent.ts`). 2026-08-05 denetimi muhtemelen bu
    // sayfanın o an henüz migrate edilmediğini (Açık nokta #10) bir
    // "unutulmuş redirect" sanıp yanlışlıkla `/en/thanks`'e eşlemişti. Artık
    // `src/pages/en/thank-you.astro` kendi gerçek içeriğini sunuyor, bu
    // yanlış redirect KALDIRILDI.
    '/suprema': '/donanim',
    '/en/suprema-tools': '/en/hardware',
    '/it/dispositivi-suprema': '/it/hardware',
  },
});
