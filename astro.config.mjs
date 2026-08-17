// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';

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

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  markdown: {
    processor: unified({ rehypePlugins: [rehypeDemoteBodyH1s] }),
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
      include: ['react', 'react-dom', 'react-dom/client', 'lucide-react', 'lottie-web'],
    },
  },
  i18n: {
    locales: ['tr', 'en', 'nl', 'it'],
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
    '/en/thank-you': '/en/thanks',
    '/suprema': '/donanim',
    '/en/suprema-tools': '/en/hardware',
    '/it/dispositivi-suprema': '/it/hardware',
  },
});
