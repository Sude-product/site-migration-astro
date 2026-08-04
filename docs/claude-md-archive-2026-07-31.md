## Proje Durumu (son güncelleme: 2026-07-30)

**Genel durum:** Ana sayfa, mega-menü (ÜRÜNLER/SEKTÖRLER/KURUMSAL/KEŞFET),
tüm ürün/modül sayfaları (18 modül + Puantaj + 2 hub), 12 sektör sayfası,
622 blog yazısı, Müşteriler, Destek Talebi, Hesaplama Araçları, Dijital İK
Olgunluk Testi, Fiyatlar, Hakkımızda, İletişim, SSS, KVKK/hukuki sayfa
ailesi, Footer ve Header tamamlandı. Site denetim raporu (14 madde)
kapandı. Şu anki odak: küçük görsel/UX ince işçilik turları (bkz. altta
en son maddeler) — her tur canlı idenfit.com ile Playwright üzerinden
birebir karşılaştırılarak yapılıyor.

**2026-07-30 günlüğü (uzun bir gün, çok sayıda küçük düzeltme —
hepsi Tamamlanan işler'de ayrı ayrı loglandı):** Header scroll
flicker'ı İKİ turda düzeltildi (kök sebep `contain-layout`'un tek
başına yetersiz kalması, gerçek çözüm backdrop-filter'ın geçiş
süresince kapatılması). İK Olgunluk Testi'nin genişlet/boşluk-artır
turu (Section 2/3/5) tamamlandı. KEŞFET → İçerikler bölümü (Bloglar +
Dijital İK Olgunluk Testi) gerçek kaynak rozet stiline çevrildi,
Raporlar carousel'inin mega-menüyü kapatan bug'ı düzeltildi. Ana
sayfanın video thumbnail'i gerçek kaynak illüstrasyonuyla değiştirildi.
Müşteriler sayfasına 14 logoluk sürekli-kayan şerit eklendi (3 ince
ayar turu: hız, full-bleed, glitch/seamless-loop düzeltmesi — hız artık
kaynağın gerçek widget JS'inden hesaplanıyor, 84s). Blog "618/618"
kapanışı sonrası bulunan 5 URL farkı çözüldü (622/622'ye güncellendi,
1 slug rename + 4 yeni yazı), `/blog/sgk/` redirect'i eklendi (önceki
turda unutulmuştu). Online Sunum Talebi sayfasında slug/içerik-tazeliği
soruları çözüldü (redirect + güncel logo görseli). **Yarım kalan 2
madde var, yarın oradan devam edilecek — bkz. Açık noktalar #15 (İK
Olgunluk Testi rozet/ikon rengi) ve #17 (Online Sunum Talebi
zenginleştirmesi, pilot onayı bekliyor).**

**Not (doğrulama konvansiyonu, aşağıdaki tüm günlük için geçerli):**
Hemen her madde, geçici kurulup iş bitince kaldırılan Playwright ile
gerçek tarayıcıda + `astro check`/`astro build` ile doğrulanmış, config
dosyası değiştiğinde `npm run dev:clean` ile tam restart yapılmıştır
(bkz. §Proje kuralları). Bu doğrulama artık madde başına tekrarlanmıyor;
yalnızca DİKKAT ÇEKİCİ/farklı test sonuçları not düşülüyor.

### Açık noktalar / bekleyen kararlar
1. **KARAR 2 — kaynakta olmayan çeviriler için yeni sayfa üretimi**
   (seyahat modülünün NL/IT'si, demirbaş modülünün IT'si gibi) ekiple
   görüşülüp netleşmeyi bekliyor; şimdilik bu diller için sayfa
   üretilmiyor, mevcut diller normal üretiliyor.
2. Hero formunun backend/CRM entegrasyonu yok (şimdilik `console.log`) —
   **Faz 2 (Cloudflare Pages Functions):** form başarıyla gönderildiğinde
   kullanıcı gerçek Teşekkürler sayfasına (`tesekkurler.astro`/
   `en/thanks.astro`/`it/grazie.astro`) yönlendirilecek şekilde
   bağlanmalı — sayfa migrate edildi ama form gönderimiyle ARASINDA
   henüz otomatik bir bağlantı YOK (bilinçli, backend olmadan yapılamaz).
3. ~~Blog migrasyonu~~ — **✅ TAMAMLANDI:** 622/622 yazı üretildi
   (2026-07-30'da +4 — kaynak site migrasyon sonrası da yeni yazı
   yayınlamaya devam ediyor, bkz. madde 16), `verify-blog-posts.mjs` ile
   doğrulandı. Mimari: Astro Content Collections (bkz. §Mimari — "Blog
   Content Collection").
4. ~~ÜRÜNLER promo banner görseli placeholder~~ — **çözüldü:** gerçek
   görsel (`header-image.webp`, 590×590) bulundu ve eklendi.
5. KEŞFET mega-menüsündeki "Podcastler" için kesin URL yok, kalıcı
   olarak menüden kaldırıldı (bkz. Tamamlanan işler).
6. Mesafeli Satış Sözleşmesi'nin kobi/mikro TR varyantları kurulmadı
   (Elementor `content.rendered` parse'ı gerektiriyor).
7. ~~Gizlilik ve Güvenlik Politikası footer'da linkleniyor ama sayfası
   yok~~ — **çözüldü:** TR/EN/IT migrate edildi (bkz. Tamamlanan işler,
   "Footer" maddeleri). **Ders:** iki farklı sayfa (Güvenlik listesi vs.
   Gizlilik ve Güvenlik Politikası makalesi) birbirine karıştırılmıştı —
   bir linkin 404 vermemesi "doğru sayfaya gidiyor" anlamına gelmez,
   varış sayfasının GERÇEK içeriği kaynakla karşılaştırılmalı.
8. Puantaj modülünün gerçek bir YouTube `video_url`'i var ama **bilinçli
   olarak embed edilmedi** (site genelinde tutarlılık için) — veri
   `products.json`'da duruyor, ileride eklenebilir.
9. İzin Yönetimi modülünün bir testimonial/referans bloğu veride var ama
   **PDKS şablonuna sadık kalmak için render edilmiyor** — ileride
   kullanılabilir.
10. `tesekkurler-destek` (Destek Talebi Teşekkürler, id 16712, TR+EN)
    araştırma sırasında bulundu ama migrate EDİLMEDİ — kullanıcının
    tarif ettiği sayfa (`/tesekkurler/`, id 15810) farklıydı. Gerekirse
    ayrıca ele alınabilir.
11. ~~"Dijital İK Olgunluk Testi" migrate edilmedi~~ — **✅ TAMAMLANDI
    (2026-07-28):** `/ik-dijital-olgunluk-testi/` (TR-only, KARAR 2).
    Detaylar için §Tamamlanan işler — "Dijital İK Olgunluk Testi" günlüğü.
12. **TODO — HR Maturity Test sonuç sayfasındaki PDF rapor gönderimi
    backend'siz.** Kaynakta sonuç sayfasının "raporu e-postama gönder"
    butonu özel bir WP REST endpoint'ine (`POST /wp-json/hr-maturity/generate`
    — core WordPress değil, siteye özel küçük bir plugin/route) email +
    cevaplar + firma bilgisi + skoru gönderip dönen `url`'i (muhtemelen bir
    PDF) yeni sekmede açıyordu. Bizim tarafımızda bu backend yok —
    `HrMaturityTest.tsx`'in `ResultStep`'indeki e-posta alanı/buton
    bilinçli olarak devre dışı, "Yakında" rozetiyle işaretli, hiçbir yere
    istek atmıyor. **Faz 2'de** (Cloudflare Pages Functions) kendi PDF
    üretim/e-posta çözümümüzle değiştirilecek — `HeroForm`'un backend
    TODO'suyla (madde 2) aynı kategoride, muhtemelen birlikte ele alınabilir.
13. **BULGU — sitede genel bir sabit WhatsApp/Ara widget'ı yok, kaynakta
    var.** 2026-07-28'de araştırılırken idenfit.com'un HER sayfasında
    sağ-altta sabit duran gerçek bir WhatsApp (`wa.me/905375265307`) +
    Ara (`tel:02162950927`) buton çifti olduğu görüldü — bizim sitemizde
    bu site-geneli widget hiç yok (yalnızca hero'nun altına, kullanıcı
    isteğiyle, KONU-özel 2 küçük ikon eklendi, bkz. Tamamlanan işler).
    Kapsam dışı bırakıldı (istenmedi) — ileride istenirse `Layout.astro`/
    `BaseLayout.astro` seviyesinde tek bir `position:fixed` component
    olarak eklenebilir (aynı gerçek görsel+numaralar hazır, bkz. altta).
14. **KARAR — `uploads.zip` işleme başladı, site geneli hotlink kararı
    KISMEN geri alınıyor (bkz. Tamamlanan işler, 2026-07-29).** Yalnızca
    2 pilot alan (İK Olgunluk Testi'nin 2 görseli + `pdks-nedir` blog
    yazısının 2 görseli) yerelleştirildi (`public/wp-content/uploads/`).
    **Kalan ~1260 görsel (618 blog yazısının geri kalanı + 10 `src/data/*.ts`
    dosyası) hâlâ hotlink** — kademeli üretim onayı bekliyor, ayrıca ele
    alınacak. Yeni script: `scripts/localize-images.mjs`.
15. **YARIM KALAN (2026-07-29 sonunda) — İK Olgunluk Testi'nde 2 açık uç,
    yarın buradan devam:**
    - **Section 2 rozet boyutu — PİLOT kodda duruyor, onay bekliyor.**
      `HrMaturityTest.tsx`'in `FiveAreasSection`'ında `index === 0` özel
      durumu VAR (yalnızca ilk kart — "Dijital Altyapı & Özlük" — rozeti
      70px→112px, ikonu 38px→64px büyütülmüş halde; diğer 4 kart hâlâ eski
      70px/38px). Kullanıcı ekran görüntüsüyle pilotu onaylarsa: (1) bu
      büyük boyutu (badge `h-28 w-28 rounded-[45px]`, ikon `h-16 w-16`)
      kalan 4 karta da uygula, (2) Section 5'in 4 sonuç kartındaki rozeti
      (`h-[70px] w-[70px]`/ikon `h-11 w-11`) da AYNI oranla büyüt, (3)
      `index === 0` koşulunu kaldırıp tüm kartları tek bir stile indir.
    - **Section 3'ün checklist ikon rengi — kullanıcıdan DevTools hex kodu
      bekleniyor.** Kullanıcı canlı sitede bu 4 ikonun (rozet/el/rapor/
      yıldız) kırmızımsı/bordo göründüğünü bildirdi; kapsamlı statik CSS
      araştırması (post-23868.css + uicore-global.css + widget'a özel
      `icon-list.css` + Elementor'ın `widget-icon-list.min.css` + tema
      `style.css` — 4 dosyanın TAMAMI) hiçbir `stroke` override'ı
      bulamadı, ham SVG'ler `stroke="black"` taşıyor — mevcut kod hâlâ
      `currentColor`/`text-heading` (siyah) kullanıyor, DEĞİŞTİRİLMEDİ.
      Kullanıcıdan idenfit.com'da ikona sağ tık→İncele→Styles/Computed
      panelinden gerçek `stroke`/`color` hex değerini paylaşması istendi,
      henüz yanıt gelmedi. Chrome uzantısı bu oturum boyunca hiç bağlı
      olmadığı için kendim ölçemedim — tahmin ETMEDİM.
16. **KARAR BEKLİYOR — blog "yeni yazı senkronizasyonu" periyodik bir
    kontrol haline getirilsin mi?** 2026-07-30'da `/blog/sgk/` 404
    şikayeti araştırılırken kaynak sitenin (idenfit.com) blog'unun
    migrasyon SONRASI da (ham export'umuzun snapshot tarihi olan
    2026-07-11'den bu yana) düzenli yeni yazı yayınlamaya devam ettiği
    görüldü (bu turda 4 yeni yazı + 1 slug değişikliği bulunup eklendi,
    bkz. Tamamlanan işler). Bu, TEK SEFERLİK bir "kaçan yazı" değil,
    **blog'un doğası gereği sürekli büyümeye devam edeceği** anlamına
    geliyor — kullanıcı bunu periyodik bir kontrol (ör. haftalık/aylık,
    `post-sitemap.xml` vs `posts.json` diff'i) haline getirmek isteyip
    istemediğimizi konuşmak istedi, henüz KARAR VERİLMEDİ. Yöntem zaten
    bu turda kanıtlandı (canlı `post-sitemap.xml` çekilip slug listesi
    `posts.json`'la karşılaştırılıyor, fark varsa `wp-json/wp/v2/posts`
    + `/media`'dan REST ile çekilip `reference/wordpress-export/`'a
    eklenip `extract-blog-posts.mjs <slug>` çalıştırılıyor) — yalnızca
    bunun ne sıklıkla/nasıl tetikleneceği (kullanıcı isteğiyle mi, yoksa
    otomatik bir hatırlatma/görev mi) netleşmedi.
17. **YARIM KALAN (2026-07-30 sonunda) — Online Sunum Talebi
    zenginleştirmesi, yarın buradan devam:** Kullanıcı onayladığı 4
    maddelik zenginleştirme listesinden yalnızca **madde 1 (kırmızı
    dekoratif arkaplan bloğu, "Siz de bize güvenen" bölümü)** PİLOT
    olarak uygulandı (bkz. Tamamlanan işler — `PresentationRequestPage.astro`).
    **Kullanıcı bu pilotu GÖRSEL OLARAK henüz onaylamadı** — onay
    beklenirken konu araya giren slug/görsel-tazeliği sorularına kaydı
    (ayrıca çözüldü, bkz. Tamamlanan işler). Onay gelince sıradaki adım:
    **madde 2 — scroll-reveal (`.reveal` + `scroll-reveal.js`) + kart
    hover efektleri** (sitenin genelinde zaten kullanılan pattern,
    `PresentationRequestPage.astro`'da şu an HİÇ scroll-reveal yok).
    Madde 3 (kırmızı gradyan panel/Entegrasyonlar kartı) ve madde 4
    (CustomerLogoMarquee/Lottie arc) kullanıcı isteğiyle kapsam dışı
    bırakılmıştı, gündeme gelmedi.

---

## Tamamlanan işler — özet günlüğü

Bu bölüm geçmiş oturumlarda tamamlanan işlerin **sonucunu ve kalıcı
kararlarını** özetler (adım adım süreç/komut detayları için
`docs/claude-md-archive-2026-07-28.md` ve `docs/claude-md-archive-2026-07-23.md`
arşivlerine bakılabilir — nadiren gerekir). En yeni en üstte.

**[2026-07-30] Online Sunum Talebi sayfası — kullanıcı kaynakla (gerçek
`/online-sunum-talep-et/`) karşılaştırıp 2 soru sordu: slug uyuşmazlığı
bug mu, ve "ayrı logo grid'i" iddiası doğru mu? İkisi de araştırılıp
netleştirildi + 2 küçük düzeltme yapıldı.**

- **Slug — BİLİNÇLİ karar, hata DEĞİL (koda zaten yazılıydı):**
  `miscPagesContent.ts`'teki yorum netti — kaynağın 3 dilde TAMAMEN
  FARKLI slug'ları var, ama bu sayfa migrate edilmeden ÇOK ÖNCE proje
  genelinde onlarca CTA çağrı noktası ZATEN `online-sunum-talebi`
  canonical slug'ına göre kurulmuştu; o turda bulunan gerçek bug slug
  uyuşmazlığı değil, bu slug'a hiç sayfa dosyası olmamasıydı (site
  geneli 404). Route'u kaynağın gerçek TR slug'ına çevirmek onlarca
  mevcut çağrı noktasını değiştirmeyi gerektirirdi — kullanıcı onayıyla
  route DEĞİŞTİRİLMEDİ, yalnızca SEO/dış link güvenliği için
  `/online-sunum-talep-et`→`/online-sunum-talebi` redirect'i eklendi
  (aynı `redirects` mekanizması, 2025-issizlik-maasi/`/blog/sgk`
  ile aynı desen).
- **"Ayrı logo grid'i/marquee" iddiası — kodla ÖRTÜŞMÜYORDU.**
  `PresentationRequestPage.astro` yeniden okunup doğrulandı: HER İKİ
  bölüm de (Entegrasyonlar + Referanslar) ZATEN tek statik `<img>`
  olarak render ediliyordu — önceki turda yalnızca Referanslar'ın
  KONUMU/arkaplanı değişmişti, görsel render mantığına dokunulmamıştı.
  Görseller indirilip gözle doğrulandı: Entegrasyonlar'ın görseli
  (`79d119e.webp`) hâlâ canlıyla birebir aynı. **Ama gerçek bir bulgu
  çıktı:** Referanslar'ın görseli (`onlinerequest.png`, 7 logo, 2025-08)
  ESKİYMİŞ — canlı site bunu `customer-brands.jpeg`'e (12 logo, 2026-01)
  güncellemiş. Bu, blog yazılarındaki "export sonrası içerik güncellenmiş"
  durumunun aynısı — yapısal bir karar sorunu değil, saf içerik tazeliği.
- **Düzeltme:** `customer-brands.jpeg` `uploads.zip`'te bulunup
  `localize-images.mjs` ile yerelleştirildi (`/wp-content/uploads/2026/01/`).
  `reference/wordpress-export/misc-pages.json`'daki TR/EN kayıtları VE
  `miscPagesTranslationOverrides.ts`'teki IT override'ı yeni görsele
  (relative path, 1000×982, güncellenmiş `alt` metni 3 dilde) güncellendi.
- **Test:** `astro check` 0 hata, `astro build` 869→870 sayfa hatasız
  (+1, yeni redirect sayfası), `dev:clean` yapıldı. `curl` ile eski
  slug'ın 301 döndüğü, yeni görselin 3 dilde de (TR/EN/IT) doğru
  render edildiği doğrulandı. Regresyon:
  `test-no-external-idenfit-links.mjs` 2340 dosyada 0 sorun.

---

**[2026-07-30] Header scroll flicker — İKİNCİ tur, gerçek kök sebep
bulundu: `contain-layout` tek başına yetersizmiş, asıl suçlu
`backdrop-filter`'ın geçiş SÜRESİNCE her frame'de arkasını yeniden
örneklemesiymiş.**

- **Kullanıcı netleştirmesi:** Flicker'ın TAM OLARAK ne zaman olduğu
  netleşti — sayfa yüklenirken/durağan haldeyken değil, marquee'nin
  gizlenme/gösterilme GEÇİŞİ (300ms) SÜRERKEN, header VE navbar birlikte
  titriyordu. Önceki turun düzeltmesi (`will-change-transform` +
  `contain-layout`) azaltmış ama TAM çözmemiş.
- **Gerçek kök sebep:** `contain:layout`, "`#marquee-wrap`'in İÇİNDEKİ
  reflow dışarıyı etkilemez" garantisi verir — ama bu KUTUNUN KENDİ
  boyutunun (`grid-template-rows`) her frame değiştiğini ve bunun
  altındaki nav satırını her frame yeniden konumlandırdığını
  ENGELLEMEZ. Bu, `<header>`'ın `backdrop-blur`'üyle üst üste binince
  (backdrop-filter her frame arkasını yeniden örneklemek zorunda
  kalıyor) tam olarak kullanıcının tarif ettiği "yalnızca geçiş
  sırasında" titremeyi üretiyordu.
- **Düzeltme (cerrahi, mimariyi değiştirmeden):**
  1. `global.css`'e `.is-transitioning-marquee { backdrop-filter: none; }`
     eklendi.
  2. `marquee-scroll.js`: geçiş BAŞLARKEN (`setHidden()` içinde) bu class
     header'a ekleniyor, `transitionend` (`grid-template-rows`)
     event'inde kaldırılıp blur geri geliyor — sabit bir `setTimeout`
     yerine gerçek transition bitişini dinliyor (motion-reduce'ta hiç
     transition olmayabileceğinden daha sağlam). Header `bg-surface/95`
     (%95 opak) olduğundan blur'un 250ms'lik yokluğu görsel olarak fark
     edilmiyor, ama "her frame arkasını yeniden örnekle" pahalı işlemi
     tamamen ortadan kalkıyor.
  3. `#marquee-wrap`'e `contain-paint` eklendi (`contain-layout`'un
     yanına, KEŞİF #2'nin önerdiği gibi) — ek bir containment katmanı,
     tarayıcının komşu alanları yeniden boyama kararını daraltmaya
     yardımcı.
  4. Geçiş süresi 300ms→250ms (kullanıcının "süreyi kısalt" önerisi,
     ince bir ayar — asıl düzeltme #1/#2).
- **KEŞİF #3 (grid-template-rows'u tamamen terk etme) BİLİNÇLİ OLARAK
  YAPILMADI:** Marquee'nin gizlenirken header'ın TOPLAM yüksekliğinin
  gerçekten küçülüp nav satırının yukarı kayması isteniyor — bu, doğası
  gereği bir layout değişikliği (saf `transform`/`opacity` ile
  ATLANAMAZ, çünkü transform elemanı görsel olarak küçültür ama
  DOKÜMAN AKIŞINDAKİ yerini korur, altındaki nav yukarı kaymaz).
  `max-height`/`height` animasyonu da AYNI kategoride (layout-tetikleyen)
  olduğundan `grid-template-rows`'tan daha iyi değil. Asıl pahalı işlem
  (backdrop-filter'ın tekrarlanan repaint'i) #1/#2 ile giderildiği için
  bu köklü değişiklik gerekmedi.
- **Test:** `astro check` 0 hata, `astro build` 869 sayfa hatasız (sayı
  değişmedi). Derlenmiş CSS'te 3 yeni utility'nin gerçek karşılığı
  doğrulandı (`duration-250`→`transition-duration:.25s`,
  `contain-paint`→`--tw-contain-paint:paint`,
  `.is-transitioning-marquee`→`backdrop-filter:none`), `curl` ile
  `#marquee-wrap`'in tüm class'ları taşıdığı ve `marquee-scroll.js`'in
  yeni `transitionend`/`classList` mantığını içerdiği doğrulandı.
  `dev:clean` yapıldı, regresyon temiz (2339 dosyada 0 sorun). **Dürüst
  sınır:** Chrome uzantısı bu oturumda da bağlı değildi — kullanıcının
  istediği Playwright tabanlı scroll simülasyonu/frame-by-frame
  reflow-paint ölçümü YAPILAMADI, düzeltme güçlü bir teorik gerekçeye
  (backdrop-filter + sticky + layout-tetikleyen transition'ın bilinen
  Chromium etkileşimi) dayanıyor ama fiili görsel sonuç kullanıcı
  tarafından geçiş ANINA özellikle odaklanarak ayrıca doğrulanmalı.

---

**[2026-07-30] ⚠️ Düzeltme — `/blog/sgk/` için önceki turda "raporlanan"
redirect aslında hiç EKLENMEMİŞTİ, şimdi eklendi + dev/build/preview
üçünde de doğrulandı.**

- Önceki turda `/blog/sgk/`'nin canlıda `sgk-ceza-ve-denetimleri`'ye 301
  yönlendiği BULUNMUŞTU ama `astro.config.mjs`'e bir redirect girdisi
  hiç EKLENMEMİŞTİ (yalnızca `2025→2026-issizlik-maasi` girdisi
  eklenmişti, `/blog/sgk` ayrı bir konuydu ve gözden kaçmıştı) — kullanıcı
  tekrar test edince hâlâ 404 verdiğini bildirdi, bu gerçek bir eksiklikti.
  `redirects`'e `/blog/sgk`→`/blog/sgk-ceza-ve-denetimleri` eklendi.
- **Üç ortamda da doğrulandı (kullanıcının istediği gibi):** (1) dev
  server: gerçek HTTP 301/308 status kodu dönüyor (`curl -I` ile). (2)
  `astro build`: `dist/blog/sgk/index.html` statik meta-refresh sayfası
  (HTTP 200 + `<meta http-equiv="refresh">`) doğru üretiliyor — bu,
  `output:'static'` (Cloudflare Pages, sunucu YOK) için beklenen/doğru
  mekanizma, NL/EN fallback'lerinde de kullanılan AYNI teknik. (3) `astro
  preview` (statik `dist/` çıktısını servis eder, gerçek deploy
  davranışına en yakın): aynı meta-refresh sayfası HTTP 200 ile
  dönüyor — `curl -L` meta-refresh'i TAKİP ETMEZ (yalnızca gerçek
  `Location` header'ını takip eder, tarayıcı davranışından farklı),
  bu yüzden `curl`'de "son URL değişmedi" görünmesi normal/beklenen,
  gerçek tarayıcıda anında yönlenir.

---

**[2026-07-30] Blog "618/618 tamamlandı" kapanışı sonrası bulunan 5 URL
farkı araştırılıp çözüldü — hiçbiri gerçek migrasyon hatası çıkmadı: 1
slug yeniden adlandırması + 4 migrasyon SONRASI yayınlanmış yeni yazı.
622/622'ye güncellendi.**

- **Tetikleyici:** Kullanıcı `/blog/sgk/`'nin 404 verdiğini bildirdi.
  **Bulgu — bu bir migrasyon hatası DEĞİLDİ:** canlıda `/blog/sgk/` bir
  **301 yönlendirme** (`/blog/sgk-ceza-ve-denetimleri/`'ye — o yazı zaten
  `posts.json`'da mevcuttu), muhtemelen o yazının eski slug'ı.
- **Kapsamlı keşif:** Canlının `post-sitemap.xml`'i (Yoast, 622 blog URL'i)
  çekilip `posts.json`'daki 618 slug'la BİREBİR karşılaştırıldı — 5 fark
  bulundu, hepsi araştırıldı:
  - `2026-issizlik-maasi` — **gerçek içerik kaybı DEĞİL, slug yeniden
    adlandırması.** Ham export'umuzda (`reference/wordpress-export/posts.json`)
    bu yazı `2025-issizlik-maasi` slug'ıyla kayıtlıydı (başlık zaten
    "2026..." idi — WP'nin kendi slug'ı sonradan güncellenmiş). Bizde
    zaten `/blog/2025-issizlik-maasi/`'de mevcuttu.
  - Kalan 4'ü (`yaz-yogunlugunda-perakendede-vardiya-ve-mesai-planlama`,
    `turizm-ve-restoranlarda-sezonluk-personel-yonetimi`,
    `calisan-yillik-izin-hakki-nasil-hesaplanir-2026-rehberi`,
    `pdks-kvkk-uyumlu-personel-devam-takibi`) — canlı sayfaların
    `schema.org` `datePublished` alanı kontrol edilince hepsi ham
    export'umuzun en yeni yazısından (2026-07-11) SONRA (2026-07-20 ile
    2026-07-27 arası) yayınlanmış — yani **migrasyon snapshot'ından
    SONRA eklenen, doğal blog büyümesi**, atlanan bir yazı değil.
- **Düzeltme 1 (slug rename + redirect):** `posts.json`'daki kaydın
  slug'ı `2025-issizlik-maasi`→`2026-issizlik-maasi`'ye çevrildi
  (`getStaticPaths()` doğrudan `post.data.slug`'ı kullandığından route
  otomatik güncellendi). Eski URL'e gelen trafik kaybolmasın diye
  `astro.config.mjs`'in mevcut `redirects` haritasına (projenin zaten
  kullandığı NL/EN fallback mekanizmasıyla AYNI, yeni bir sistem
  kurulmadı) `/blog/2025-issizlik-maasi`→`/blog/2026-issizlik-maasi`
  eklendi.
- **Düzeltme 2 (4 yeni yazı):** Bu 4 yazı ham export'ta (`reference/
  wordpress-export/posts.json`) YOKTU (`extract-blog-posts.mjs` yalnızca
  ham export'tan okuyor) — önce WP REST API'den (`wp-json/wp/v2/posts?slug=...`
  + `/media/<id>`) tam post + featured_media verisi çekilip ham export'a
  (posts.json 618→622, media.json 2211→2215) eklendi, kategori/tag ID'leri
  önceden önbelleklenmiş olduğu doğrulandı (yeni taksonomi terimi yok,
  `fetch-blog-taxonomy.mjs` tekrar çalıştırmaya gerek kalmadı), sonra
  normal akışla (`extract-blog-posts.mjs <4 slug>`) işlendi.
- **Test:** `astro check` 0 hata, `astro build` 869 sayfa hatasız (+4,
  beklenen), `verify-blog-posts.mjs` 622/622 sayfa/excerpt/H1/kategori
  temiz (tek bulgu — `pdks-nedir`'in kırık görseli — bu turdan ÖNCEKİ,
  bilinen bir sorun, yeni eklenenlerle ilgisi yok). `curl` ile yeni
  slug'ın 200, eski slug'ın 301 döndüğü hem dev server'da hem `astro
  build`'in statik `dist/` çıktısında (meta-refresh redirect sayfası)
  doğrulandı. Regresyon: `test-no-external-idenfit-links.mjs` 2338
  dosyada 0 sorun, `test-urunler-menu-links.mjs` 108/108. **Kalıcı
  bulgu:** blog migrasyonu SONRASI da kaynak sitede düzenli yeni yazı
  yayınlanmaya devam ediyor — bu tek seferlik bir "kaçan yazı" değil,
  sürekli bir drift; periyodik senkronizasyon KARARI bekliyor (bkz. Açık
  noktalar #16).

---

**[2026-07-30] `CustomerLogoMarquee.astro`'nun ARALIKLI kayma (glitch)
bug'ı bulunup düzeltildi + hız artık TAHMİN DEĞİL, kaynağın gerçek
widget JS'inden hesaplandı (84s).**

- **Glitch — kök neden:** Kullanıcı sürekli değil ARALIKLI bir kayma
  bildirdi — bu, önceki turda "matematik doğru" diye doğrulanan sabit/
  deterministik seamless-loop hesabıyla ÇELİŞİYORDU (deterministik bir
  hata her turda aynı yerde olurdu). Gerçek neden: 28 `<img>`'in
  HİÇBİRİNDE `width`/`height` yoktu — tarayıcı görsel ağdan gelene kadar
  yer AYIRMIYORDU. 28 görsel farklı boyutlarda (1.6KB-846KB) ve FARKLI
  zamanlarda yüklendiğinden, biri yüklenip gerçek genişliğini alınca
  `w-max` container'ın TOPLAM genişliği animasyon SIRASINDA değişiyor,
  bu da %-tabanlı `translateX(-50%)`'nin hedefini kaydırıp görünür bir
  sıçrama yaratıyordu — ağ zamanlamasına bağlı olduğundan "arada bir"
  olması BEKLENEN bir davranıştı. Sekme arka plan senaryosu ELENDİ (CSS
  `animation` monotonik zaman çizelgesiyle çalışır, JS `rAF` gibi
  arka plan dönüşünde sıçramaz). **Düzeltme:** her logonun kendi gerçek
  intrinsic `width`/`height`'ı (`customerStories.ts`'e eklendi — 13'ü
  100×50, Acun Medya 101×50, `curl` ile tek tek doğrulandı) `<img>`'e
  eklendi, tarayıcı artık görsel yüklenmeden önce doğru alanı ayırıyor.
- **Hız — artık ÖLÇÜLDÜ, tahmin değil:** Kullanıcı "tahmin etme, gerçek
  kaynağı ölç" deyince Chrome uzantısı hâlâ bağlı olmadığından canlı
  stopwatch yapılamadı — bunun yerine kaynağın GERÇEK widget JS dosyası
  (`global-carousel.js`) indirilip okundu: `case"marquee"` bloğu
  `speed: Math.abs(marquee_speed - 1e4) || 5e3` + `autoplay:{delay:0}`
  (Swiper.js). Widget'ın `marquee_speed:4000` ayarıyla: `speed=6000ms`
  (HER slide geçişinin süresi, delay:0 ile aralıksız). 14 gerçek logo ×
  6000ms = **84 saniye** tam döngü — kod okuma yoluyla kesin hesaplanmış
  bir değer, tahmin değil. Bu, önceki iki tahmini değerden (22s/28s) ÇOK
  daha yavaş — kullanıcının önceki turlarda ifade ettiği hız hissiyatıyla
  açıkça çelişiyor, kod içinde bilinçli bir uyarı olarak not düşüldü.
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız,
  `dev:clean` yapıldı. `curl` ile 84s süresi + 28 görselin TAMAMINDA
  `width`/`height` attribute'u render edildiği doğrulandı. Regresyon:
  `test-no-external-idenfit-links.mjs` 2325 dosyada 0 sorun. **Not:**
  Chrome uzantısı bu oturumda da bağlı değildi — 84s'nin gerçekten doğru
  hissettirip hissettirmediği ve glitch'in tamamen geçip geçmediği
  kullanıcı tarafından canlı doğrulanmalı.

---

**[2026-07-30] `CustomerLogoMarquee.astro`'ya 3 ince ayar: hız 22s→28s
(hâlâ Header'ın 40s'inden bağımsız), full-bleed (viewport kenarına
kadar), seamless loop matematiği doğrulandı + lazy-load kaldırıldı.**

- **Hız:** 22s kullanıcıya fazla hızlı geldi, ~%27 artırılıp 28s'e
  çekildi (yine yalnızca inline `animation-duration`, global
  `--animate-marquee` 40s'de sabit/Header'da dokunulmadı).
- **Full-bleed:** Klasik "break-out" tekniği (`relative left-1/2
  right-1/2 w-screen -mx-[50vw]`) uygulandı — projenin ÖNCEKİ full-bleed
  denemesinden (`mr-[calc(50%-50vw)]`, paddingli bir ata içinde hizalama
  sorunu çıkarmıştı, bkz. HeroSection.astro geçmişi) BİLİNÇLİ olarak
  farklı/daha sağlam bir teknik. Matematiksel olarak doğrulandı: bu
  teknik ata GENİŞLİĞİNDEN bağımsız çalışıyor ama atanın KENDİ yatay
  padding'i kalıntı bir offset bırakıyor — bu yüzden `CustomerStoriesPage.astro`'daki
  sarmalayıcı `<section class="max-w-7xl px-4...">` tamamen kaldırıldı,
  component artık padding'siz bir bağlamda doğrudan render ediliyor.
- **Seamless loop:** Matematik doğrulandı (kod yorumunda gerekçelendirildi)
  — `sequence`'ın 2 kopyası birebir aynı içerik+gap taşıdığından
  `translateX(-50%)` ikinci kopyanın tam başlangıcına iniyor, kayma
  yok. Tek gerçek risk `loading="lazy"`'nin marquee'nin İLK (görünür)
  kopyasındaki görselleri geç yükleyip `w-max` genişliğini animasyon
  başladıktan sonra değiştirmesiydi — sürekli-görünür bir şerit için
  zaten yanlış bir optimizasyondu, kaldırıldı (28 öğe de artık eager).
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız,
  `dev:clean` yapıldı. `curl` ile 28s süresi + full-bleed class'ları +
  0 `loading` attribute'u (marquee'nin 28 img'inde) doğrulandı, Header'ın
  40s'inin etkilenmediği ayrıca teyit edildi. Regresyon:
  `test-no-external-idenfit-links.mjs` 2325 dosyada 0 sorun.

---

**[2026-07-30] Müşteriler sayfasına (`/musteriler/`) hero'nun altında
eksik olan sürekli-kayan müşteri logosu şeridi eklendi — 14 logo, gerçek
kaynak sıra/görsellerle; pilot sonrası bulunan "eksik logo" bulgusu
aslında dosya hatası değil, yavaş animasyon süresinden kaynaklanan bir
gözlem yanılgısıymış.**

- **KEŞİF:** Ana sayfanın `LogoStrip.astro`'su marquee DEĞİL, statik
  `flex-wrap` grid — gerçek marquee tekniği Header'ın duyuru barında
  (`MarqueeBar.tsx`, `global.css`'teki `animate-marquee` utility)
  zaten kuruluydu, yeniden kullanıldı. Kaynağın gerçek widget'ı
  (`elementor-widget-uicore-logo-carousel`, Swiper.js tabanlı,
  `logo-carousel.css`: `.ui-e-animation-marquee .swiper-wrapper{transition-
  timing-function:linear}`) `idenfit.com/musteriler/`'den çekilip 14
  logonun TAMAMI (sıra dahil — Acun Medya/Civil/Ferre/Beyaz Fırın/
  Havaist/ZSA/LG/Yatsan/Lujo/letgo/Tuğba/Migros One/Kellogg's/Caribou)
  WP Rocket'ın lazy-load placeholder'ları (`data-lazy-src`) atlanarak
  birebir çıkarıldı — ana sayfanın `CUSTOMER_LOGOS`'undan (`2025/09/`
  klasörü) FARKLI, ayrı bir set (`2025/11/`). 14/14 dosya `uploads.zip`'te
  bulunup `localize-images.mjs` ile yerelleştirildi.
- **Uygulama:** Yeni `CustomerLogoMarquee.astro` (React DEĞİL, `MarqueeBar`
  gibi hydration'sız) + `customerStories.ts`'e `CUSTOMER_LOGO_MARQUEE`
  (14 logo). Swiper.js gibi yeni bir kütüphane eklenmedi — projenin
  zaten kurulu CSS-only tekniği (`animate-marquee`, `will-change-transform`,
  header flicker düzeltmesinden gelen aynı performans idiyomu) yeniden
  kullanıldı. Pilot: önce yalnızca ilk 4 logo eklenip onay alındı.
- **⚠️ Pilot sonrası "eksik logo" bulgusu — KÖK NEDEN ARAŞTIRMASI:**
  Kullanıcı, pilot onayından sonra eklenen 10 logonun (Havaist/ZSA/LG/
  Yatsan/Lujo/letgo/Tuğba/Migros One/Kellogg's/Caribou) görünmediğini
  bildirdi. **14 dosyanın TAMAMI `curl` ile tek tek test edildi — hepsi
  200 döndü**, şüpheli olanlar (en küçük/en büyük boyutlu 9 dosya) içerik
  olarak da elle açılıp gerçek, geçerli SVG path verisi taşıdığı
  doğrulandı (bozuk/boş dosya YOK). Gerçek neden: kullanıcının "eksik"
  dediği 10 logo, dizide tam olarak ilk 4'ten SONRA geliyordu — 40s'lik
  (Header'ın kısa metin şeridi için doğru olan, ama artık 28 öğelik çok
  daha geniş bir track'e sahip bu şerit için) yavaş döngüde, kullanıcının
  kısa gözlem penceresi bu 10 logo ekrana gelmeden kapanmıştı. Dosya/path
  hatası DEĞİLDİ.
- **Yan bulgu (raporlandı, dokunulmadı):** `tugba-2-1.svg` 846KB — diğer
  13 logo 1.6-15KB aralığındayken bu dosya gömülü bir base64 PNG
  (`xlink:href="data:image/png;base64,..."`) taşıdığı için orantısız
  büyük. Render'ı BOZMUYOR (geçerli SVG, tarayıcı doğru gösteriyor) —
  yalnızca performans açısından verimsiz, kaynağın kendi export'undan
  gelen bir durum, kullanıcı isterse ayrıca optimize edilebilir.
- **Süre düzeltmesi:** Global `--animate-marquee` (40s, Header'da hâlâ
  kullanılıyor) DEĞİŞTİRİLMEDİ — yalnızca bu component'e özel inline
  `style="animation-duration: 22s"` eklendi (Tailwind utility'sinin
  `animation` shorthand'ını, yalnızca `animation-duration` longhand'ını
  override ederek, global token'a dokunmadan hızlandırıyor).
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız (sayı
  değişmedi), `dev:clean` yapıldı. 14 logonun tamamı `curl` ile 200 +
  gerçek SVG içeriği doğrulandı, sayfada 28 öğenin (14×2, sonsuz döngü)
  render edildiği, `22s` süresinin yalnızca Müşteriler'de olduğu (ana
  sayfada YOK, Header'ın 40s'i etkilenmedi) teyit edildi. Regresyon:
  `test-no-external-idenfit-links.mjs` 2325 dosyada 0 sorun. **Not:**
  Chrome uzantısı bu oturumda da bağlı değildi — animasyonun fiili
  akıcılığı/hızı kullanıcı tarafından ayrıca doğrulanmalı.

---

**[2026-07-30] KEŞFET → "İçerikler" bölümü (Bloglar + Dijital İK Olgunluk
Testi) canlı sitenin gerçek dairesel-rozet stiline çevrildi — pilot
(yalnızca Bloglar) onaylandıktan sonra ikinci öğeye de uygulandı;
"Raporlar" carousel'inin ok-butonu tıklamasının mega-menüyü kapatan
bug'ı da bu turda bulunup düzeltildi.**

- **Bug (Raporlar carousel):** Ok butonları `{!atStart && (...)}`/
  `{!atEnd && (...)}` ile sınıra ulaşınca DOM'dan tamamen kaldırılıyordu.
  O an odaklı olan buton (kullanıcı tıklamıştı) aynı render'da DOM'dan
  silinince tarayıcı `relatedTarget:null` ile bir `focusout` tetikliyor,
  `MegaMenu`'nün "dışarı odaklanınca kapat" listener'ı bunu yakalayıp
  (`rootRef.current.contains(null)`→`false`) mega-menüyü KAPATIYORDU —
  `stopPropagation` eksikliği DEĞİL, click'ten bağımsız ayrı bir focus
  event'i. **Düzeltme:** butonlar artık her zaman DOM'da, görünürlük/
  odaklanabilirlik yalnızca CSS (`opacity`/`pointer-events`) +
  `aria-hidden`/`tabIndex={-1}` ile kontrol ediliyor — odaklı eleman asla
  kaldırılmıyor.
- **İçerikler stili — KEŞİF:** Referans, `idenfit.com/online-sunum-talep-et/`
  sayfasındaki gömülü `#explore-menu`'nün "İçerikler" bölümüydü (element
  ID `6aaeea4`/`4208f72`, `post-24918.css` ile çapraz doğrulandı). Ölçülen
  gerçek değerler: rozet arkaplanı **`#F4CCCE`** (projenin `brand-light`
  token'ından `#FFF2F2` FARKLI, yeni bir renk — token'a eklenmedi, tek
  kullanım yeri olduğu için `bg-[#F4CCCE]` arbitrary class kullanıldı),
  rozet çapı **52px** (`font-size:32px + padding:10px×2`), ikon rengi
  `#FF0000` (projenin `brand` kırmızısıyla birebir), başlık `14px/500`,
  açıklama `14px/400/line-height 1.5`. Projede zaten var olan
  `HubTileCard.astro`/`SectorFeatureCard.astro`'nun benzer görünümlü
  fallback rozeti (`bg-brand-light`, jenerik yıldız ikonu) kontrol edildi
  ama YANLIŞ renk/ikon taşıdığı için kullanılmadı — kullanıcı onayıyla
  gerçek kaynak ayrıca ölçüldü.
- **Bulgu — "Hesaplamalar" başlığına DOKUNULMADI:** Kaynakta bu başlığın
  ikonu (`36f2e78`) `elementor-view-default` — yani rozetsiz, düz kırmızı
  glyph (44px, `#FF0000`). Mevcut lucide `Calculator` implementasyonumuz
  zaten bu deseni doğru yansıtıyordu; rozet eklemek kaynaktan SAPARDI —
  kullanıcıya bulgu raporlanıp dokunulmaması onaylandı.
- **Uygulama:** Yeni `ExploreIcons.tsx` (`BlogIcon`/`DigitalMaturityTestIcon`,
  kaynaktan birebir SVG, hardcoded `#FF0000`/`#F4CCCE` — CalculatorIcons.tsx
  ilkesiyle tutarlı). `navigation.ts`: yeni `MegaMenuIcon` kaynağı
  (`'explore'`), `MegaMenuLink.description?`, `LinksColumn.linkIconStyle`'a
  üçüncü seçenek `'content-card'`. `MegaMenu.tsx`: `Column`'un link
  render'ına üçüncü ternary dalı (52px rozet + başlık + açıklama), `<ul>`
  gap'i bu stildeyken `gap-2`→`gap-4`. `Header.astro`'nun `resolveLink()`'i
  `description` alanını da geçiriyor. i18n: `blogDescription`/
  `digitalMaturityTestDescription` 4 dile gerçek çeviriyle eklendi.
  **Pilot disiplini:** önce yalnızca Bloglar'a uygulanıp onay alındı,
  sonra Dijital İK Olgunluk Testi'ne aynı stil + kendi gerçek ikonu
  eklendi.
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız (sayı
  değişmedi), `curl` ile 4 dilde rozet/ikon/açıklama render'ı + Raporlar
  butonlarının artık her zaman DOM'da olduğu doğrulandı. Regresyon:
  `test-urunler-menu-links.mjs` 108/108, `test-no-external-idenfit-links.mjs`
  2325 dosyada 0 sorun. **Not:** Chrome uzantısı bu oturumda da bağlı
  değildi — carousel bug'ının fiili tıklama testi ve rozet stilinin gerçek
  görsel sonucu kullanıcı tarafından ayrıca doğrulandı/onaylandı.

---

**[2026-07-30] Header'da scroll sırasında ARA SIRA oluşan flicker
bulunup düzeltildi — React re-render/throttle sorunu DEĞİL, CSS
compositing çakışmasıymış.**

- **Bulgu:** Kullanıcı raporu, CLAUDE.md'de kayıtlı statik hydration
  sorunundan (dev:clean ile çözülen) FARKLI bir belirtiydi — yalnızca
  scroll sırasında, sayfa yüklenirken değil. Keşif: Header ağacında
  (Header/MegaMenu/MobileMenu/LanguageSwitcher) scroll'a bağlı hiçbir
  React state yok (duyuru barının göster/gizle mantığı 2026-07-28'de
  zaten vanilla JS'e taşınmıştı, `marquee-scroll.js` zaten `rAF` ile
  throttle'lı + 12px eşikli) — yani React re-render/throttle tarafı
  ZATEN optimize, bu turun konusu değildi. **Gerçek kök neden:**
  `#marquee-wrap`'in `grid-template-rows` (1fr↔0fr) `transition`'ı
  layout-tetikleyen bir property (compositor-only DEĞİL) — her
  gösterme/gizlemede (scroll yönü 12px eşiğini aştığında) 300ms boyunca
  tekrarlanan reflow üretiyor, bu da `<header>`'ın `position:sticky` +
  `backdrop-blur`'üyle üst üste binince (sticky her scroll frame'inde
  yeniden konumlanıyor + backdrop-filter her paint'te arkasını yeniden
  örnekliyor) Chromium'da bilinen bir flicker kaynağı oluşturuyordu.
  "Ara sıra" olması tutarlı — yalnızca yön değişimi eşiği aşıldığında
  tetikleniyor, frame düşürme GPU/CPU yüküne bağlı.
- **Düzeltme (`Header.astro`, 2 utility class, mantık DEĞİŞMEDİ):**
  `<header>`'a `will-change-transform` (kendi compositor layer'ına
  alıp sticky+backdrop-filter repaint maliyetini izole ediyor —
  `MarqueeBar.tsx`'in zaten kullandığı aynı idiyom), `#marquee-wrap`'e
  `contain-layout` (grid-template-rows geçişinin reflow'unu kendi alt
  ağacına hapsedip ata/kardeş elemanların yeniden ölçülmesini önlüyor).
  Mevcut marquee mekanizması (grid-template-rows tekniği, vanilla JS,
  12px eşik — 2026-07-28'de araştırılıp karara bağlanmıştı)
  DEĞİŞTİRİLMEDİ.
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız
  (sayı değişmedi). Derlenmiş CSS'te iki utility'nin gerçek kurala
  karşılık geldiği doğrulandı (`will-change:transform`, `contain:...
  layout...`). 4 sayfa tipinde (ana sayfa, blog yazısı, ürün sayfası,
  Müşteriler) `curl` ile class'ların render edildiği + dev server
  loglarının temiz olduğu teyit edildi. **Kullanıcı sert yenileme +
  birkaç sayfada scroll ile doğruladı: flicker düzeldi.**

---

**[2026-07-30] İK Olgunluk Testi Section 2/3/5 — GENİŞLET + BOŞLUK
ARTIR turu (Section 3 pilot, onay sonrası Section 2/5'e uygulandı).**

- **İstek:** İkon/görsel grupları merkeze sıkışık duruyordu — container
  genişliğinin daha iyi kullanılması + elemanlar arası gap/margin'in
  büyütülmesi istendi (kesin px verilmedi, "makul %30-50 artış" örneği).
- **Pilot (Section 3, `ChecklistSection`) — onaylandı:** container
  `max-w-6xl`→`max-w-7xl`, kolon gap `gap-10 lg:gap-16`→`gap-14 lg:gap-24`
  (~%40-50), checklist madde arası `space-y-[10px]`→`space-y-[14px]`
  (~%40, kaynağın ölçülen 10px değerinden bilinçli UX sapması), ikon-metin
  arası `gap-2.5`→`gap-3.5` (~%40). Görsel boyutuna (581px, önceki turda
  kaynaktan özenle ölçülüp doğrulanmıştı) DOKUNULMADI — "yayılma" etkisi
  boşluk/genişlik artışıyla sağlandı.
- **Section 2 (`FiveAreasSection`, 5 kart) — aynı mantık, kendi oranıyla:**
  `max-w-6xl→7xl`, grid gap `gap-5→gap-7` (20→28px, +40%), kart içi gap
  `gap-4→gap-6` (+50%), `mt-10→mt-14` (+40%).
- **Section 5 (`ResultCardsSection`, 4 sonuç kartı) — aynı mantık:**
  `max-w-6xl→7xl`, kolon gap `gap-10 lg:gap-[60px]`→`gap-14 lg:gap-20`
  (+40%/+33%), kart içi gap `gap-4→gap-6` (+50%), `mt-6→mt-8`,
  `space-y-4→space-y-6` (+50%).
- **Dokunulmayan:** rozet/ikon boyutları (Section 2'nin `index===0`
  pilotu, Section 5'in 44px ikonu) — bu turun kapsamı DEĞİL, hâlâ ayrı
  bekleyen bir karar (bkz. Açık noktalar #15/1).
- **Test:** Her adımdan sonra `astro check` 0 hata + `dev:clean` +
  `curl` ile yeni class'ların render edildiği doğrulandı. Regresyon:
  dev server logları temiz.

---

**[2026-07-29] İK Olgunluk Testi'nin Section 3/5 görselleri gerçek
kaynak boyutuna büyütüldü — önceki tahmini `max-w` değerleri küçük
kalmıştı.**

- **Bulgu:** `post-23868.css`'te Section 3'ün görseli (widget `01116f0`)
  masaüstünde **581px** (bizim önceki `max-w-[420px]`'imiz tahminen
  küçüktü), Section 5'in görseli (widget `9e245c9`) masaüstünde
  **432px** (bizim önceki sabit `max-w-[350px]`'imiz yalnızca mobil/
  tablet değeriydi, masaüstünde de aynı kalıyordu). ≤1024px için ikisi
  de zaten doğru ölçülmüştü (350px).
- **Düzeltme:** İkisi de `max-w-[350px] lg:max-w-[581px]` /
  `max-w-[350px] lg:max-w-[432px]`'e çevrildi (`lg:` = Tailwind'in 1024px
  eşiği, kaynağın kendi `min-width:1024px` breakpoint'ine birebir
  uyuyor), `sizes` attribute'ları da tutarlı güncellendi. `srcSet`/
  `width`/`height`/görsel dosyaları DOKUNULMADI (zaten doğruydu, yalnızca
  CSS max-width sınırı büyütüldü — hiçbir başka sayfa/component bu
  değişiklikten etkilenmedi).
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız (sayı
  değişmedi), `curl` ile yeni class'ların render edildiği doğrulandı.
  Regresyon: `test-no-external-idenfit-links.mjs` 2325 dosyada 0 sorun.

---

**[2026-07-29] `uploads.zip` işleme — KEŞİF + 2 alanlık pilot (onaylı).
Site genelindeki "her görsel hotlink" kararı (kullanıcı talimatı #6)
KISMEN geri alınıyor; kalan ~1260 görsel için kademeli üretim onayı
bekleniyor.**

- **Keşif bulguları:** `uploads.zip` (`reference/wordpress-export/`, 1.4GB,
  20.933 dosya, WP'nin `wp-content/uploads/YYYY/MM/` yapısı korunmuş)
  incelendi. **Kritik context:** proje şu ana kadar TÜM görselleri
  bilinçli olarak `idenfit.com`'a hotlink ediyordu (`sectorContent.ts`'teki
  "kullanıcı talimatı #6" notu, `docs/claude-md-archive-2026-07-23.md`'de
  teyitli) — yani "placeholder/kırık görsel" aslında SIK karşılaşılan bir
  hata DEĞİLDİ, yalnızca İK Olgunluk Testi'nin 2 YENİ (henüz hiç hotlink
  edilmemiş) görseli placeholder'dı. URL→zip yolu eşleştirmesi gerçek
  veriyle test edildi: blog (`posts.json`, 618 yazı) **1076/1076 (%100)**
  otomatik eşleşti (yalnızca `https://idenfit.com/wp-content/` prefix'i
  atılıp geri kalan yol zip'teki `uploads/...` yoluyla birebir örtüşüyor,
  manuel harita GEREKMİYOR), `src/data/*.ts` **188/189 (%99.5)** eşleşti
  (1 PDF eksik — export sonrası siteye eklenmiş, engelleyici değil).
  Toplam gerçekten kullanılan görsel: ~1265 dosya/~230MB (zip'in yalnızca
  ~%15'i — geri kalanı font/css/php/wp-file-manager önbelleği, hiç
  gerekmiyor).
- **Karar — organizasyon: `public/wp-content/uploads/...`, `src/assets`
  DEĞİL.** Gerekçe: mevcut TEK yerel asset örneği (`kurumsal-promo-team.webp`)
  elle-küratörlü, tek-seferlik bir istisna; 1000+ dosya için `src/assets`+
  import-pipeline ölçeklenmez (her biri için import satırı gerekir).
  `public/`'a WP'nin AYNI göreli yolu korunarak kopyalanırsa, veri
  katmanında yalnızca `https://idenfit.com` prefix'i `''` (relative) ile
  değiştirilir — **hiçbir render component'inin (ProductPage/SectorPage/
  BlogListPage/blog/[slug] vb.) değişmesi gerekmez** (zaten `<img
  src={...url}>`, URL formatını umursamıyor; `content.config.ts`'teki
  `url: z.string()` de mutlak URI zorunluluğu taşımıyor).
- **Yeni script — `scripts/localize-images.mjs`:** `uploads.zip`'ten
  belirtilen yolları `yauzl` (yeni devDependency, yalnızca build-time
  Node script'inde kullanılıyor — `lottie-web`'den FARKLI olarak client
  bundle'a girmediği için `astro.config.mjs`'in `optimizeDeps`'ine
  eklenmesi GEREKMEDİ) ile tek tek okuyup `public/wp-content/uploads/`
  altına (WP'nin AYNI göreli yoluyla) yazar. `unzip` CLI yerine tercih
  edildi — Windows'ta PowerShell'den de (yalnızca Git Bash'ten değil)
  güvenilir çalışması ve ileride 1000+ dosya için CLI arg-length limitine
  takılmaması için.
- **Pilot (onaylı, KADEMELİ ÜRETİM henüz başlamadı):** (1) İK Olgunluk
  Testi'nin Section 3/5 placeholder'ları (`Group-1365421288`/`-1389`, 4
  boyut varyantıyla `srcSet`) gerçek `<img>`'e çevrildi. (2) `pdks-nedir`
  blog yazısının `featuredImage.url`'i VE `content` HTML'i içindeki 1
  inline görselin URL'i relative'e çevrildi — bu, hem basit alan
  swap'ını (featuredImage) HEM `content` HTML rewrite'ını (inline img,
  `set:html` ile render ediliyor) test etti, ikisi de sorunsuz çalıştı.
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız, 4
  pilot görselin `dist/wp-content/uploads/...`'a kopyalandığı ve `curl`
  ile 200 döndüğü doğrulandı, iki sayfada da (`/ik-dijital-olgunluk-testi/`,
  `/blog/pdks-nedir/`) artık `idenfit.com` hotlink'i KALMADIĞI teyit
  edildi. Regresyon: `test-no-external-idenfit-links.mjs` 2325 dosyada 0
  sorun. **Sıradaki adım (onay bekliyor):** kalan ~617 blog yazısı + 10
  `src/data/*.ts` dosyasının kademeli/toplu işlenmesi.

---

**[2026-07-29] Önceki turun 5-bölüm eklemesine 4 maddelik düzeltme turu —
placeholder'lar sadeleştirildi, hover eklendi, section 5'in ikon boyutu
düzeltildi, font yapısal olarak zaten doğru çıktı.**

1. **Placeholder'lar:** Kesikli-çizgili + "(yakında)" metinli kutular
   (Section 3/5) kaldırılıp kullanıcının istediği gibi düz, nötr,
   doğru en-boy oranlı boş kutulara (`bg-gray-100`, metin/kenarlık yok)
   çevrildi. **Keşif sonucu:** iki placeholder da hiçbir zaman gerçek bir
   `<img>` etiketi DEĞİLDİ (salt stil kutusu) — "kırık görsel" hissi
   muhtemelen dashed-border+"yakında" yazısının kendisinin taslak/eksik
   görünmesinden kaynaklanıyordu, bir path/import hatası değildi (kod
   incelemesiyle doğrulandı, `<img src>` hiç yok). `uploads.zip` hâlâ
   açılmadı (`reference/wordpress-export/uploads.zip`, ~1.4GB) —
   `Group-1365421288`/`Group-1365421389` ne `src/assets` ne `public`
   altında mevcut, **placeholder durumu hâlâ geçerli**, Faz 2'yi bekliyor.
2. **Hover eklendi (Section 2'nin 5 kartı + Section 5'in 4 kartı):**
   **Keşif sonucu — ⚠️ kaynakta bu kartlara/rozetlere özel bir hover
   kuralı YOK** (`post-23868.css`'te hiç, `uicore-global.css`'te yalnızca
   genel/inert bir `.elementor-icon:hover{color:...}` var — ikonların
   `stroke`'u hardcoded hex olduğundan bu kural görsel olarak hiçbir şey
   değiştirmiyor; ham HTML'de de `elementor-animation-*`/motion-effect
   ayarı yok). Bu yüzden birebir "ölçülüp uygulanan" bir değer DEĞİL —
   sitenin başka yerlerinde zaten kullanılan AYNI desenle (`.btn-cta-solid
   :hover`, KEŞFET Raporlar carousel kartları — hafif yükselme/büyüme +
   gölge artışı) tutarlı, bilinçli bir UX eklentisi: kart gölgesi artıyor
   (`shadow-[0_0_10px_rgba(0,0,0,.07)]`→`shadow-[0_10px_30px_rgba(0,0,0,.12)]`),
   rozet `scale-110`'a büyüyor, `duration-300` ile.
3. **Section 5'in ikon boyutu düzeltildi (38px → 44px):** Önceki turda
   section 2'nin ölçülen ikon boyutu (38px) section 5'e de yanlışlıkla
   kopyalanmıştı — canlı kaynakta section 5'in kendi ikonları
   (`ae8a310` vb.) `.elementor-icon{font-size:44px}` ile GERÇEKTEN daha
   büyük. `h-[38px] w-[38px]` → `h-11 w-11` (44px) düzeltildi. Section
   2/3/4'ün ölçülen boyutları (70px rozet/38px ikon, 24px check-icon,
   70px numara rozeti) yeniden kontrol edildi, hepsi zaten doğruydu.
4. **Font tutarsızlığı — yapısal bir bug BULUNAMADI.** `global.css`'te
   `html{font-family:var(--font-sans)}` (Quicksand) zaten TÜM sayfaya
   (dolayısıyla bu React island'ın içine) miras yoluyla uygulanıyor;
   yeni eklenen 5 bölümün hiçbirinde font-family override eden bir kural
   yok, derlenmiş CSS'te de `.font-sans{font-family:var(--font-sans)}`
   kuralı doğru üretiliyor. Yine de her ihtimale karşı (zararsız, garantili
   uygulama) `font-sans` class'ı doğrudan component'in kök `<div>`'ine de
   eklendi. **Kullanıcıya not:** eğer görsel fark hâlâ varsa muhtemelen
   önceki (bu turdan önceki) dev server oturumunun eski/önbellekli CSS'i
   görülüyordu — bu turda `dev:clean` ile tam temiz yeniden başlatıldı,
   sert yenileme (Ctrl+Shift+R) sonrası tekrar kontrol edilmeli.
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız (sayı
  değişmedi), `curl` ile 4 maddenin hepsi doğrulandı ("yakında" metni artık
  hiçbir yerde yok, 2 placeholder kutusu doğru boyutta, 4 sonuç kartı
  ikonu `h-11 w-11`, 9 `group-hover:scale-110` — 5+4 kart — render
  ediliyor, kök `<div>`'de `font-sans` var). Regresyon:
  `test-no-external-idenfit-links.mjs` 2325 dosyada 0 sorun. **Not:**
  Chrome uzantısı bu oturumda da bağlı değildi — hover/font'un gerçek
  görsel sonucu kullanıcı tarafından ekran görüntüsüyle ayrıca teyit
  edilmeli.

---

**[2026-07-29] İK Dijital Olgunluk Testi'ne hero'nun altında eksik olan 5
bölüm eklendi (5 kritik alan kartı, check-list+görsel, 3 adım süreç, 4
sonuç kartı, kapanış CTA) — kademeli, her bölüm ayrı onaylanarak.**

- **Keşif:** Canlı sayfanın tamamı (`post-23868.css` + ham HTML, template
  id 23868) element-ID bazında ölçüldü. 5 yeni bölüm + gerçek CSS
  değerleri (padding/renk/font/breakpoint) çıkarıldı.
- **Section 2 — "5 Kritik Alanda Netleştirin" (onaylandı, ✅ değiştirilmedi):**
  5 kart, her biri kaynağın kendi imza renginde ikon+rozet (yeşil/kırmızı/
  amber/mor/bordo — `MaturityAreaIcons.tsx`). **Bilinçli sadeleştirme
  (onaylı):** kaynakta mobilde ok-butonlu yatay scroll-carousel var,
  bunun yerine basit responsive grid (`grid-cols-1→sm:2→lg:5`) kullanıldı.
- **Section 3 — "3 Dakikada Dijital İK Raporunuzu Oluşturun":** solda 4
  maddelik check-list, sağda **PLACEHOLDER** (gerçek görsel
  `Group-1365421288`, `uploads.zip`'te — Faz 2). **Bulgu:** 4 madde AYNI
  checkmark'ı TEKRARLAMIYOR, her biri kendi anlamlı ikonuna sahip (rozet/
  skor, büyüteç/analiz, onaylı-rapor, yıldız/yol-haritası —
  `ChecklistIcons.tsx`), kaynaktan birebir çıkarıldı.
- **Section 4 — "Basit, Hızlı ve Veri Odaklı":** 3 numaralı adım (70px
  pembemsi rozet + rakam), kırmızımsı-şeffaf gradyan panel (`linear-gradient
  (180deg,#FF000021,#FF00000000)`, kaynaktan birebir). **⚠️ Kullanıcı
  sorusu ile netleşen bulgu:** bu bölümde kaynakta HİÇ görsel widget'ı yok
  (kullanıcı onayıyla görselsiz bırakıldı — kullanıcının ilk talimatındaki
  "yanında görsel" varsayımı canlı HTML ile doğrulanamadı). **Ayrı bir
  kaynak veri hatası düzeltildi:** 2. adımın ham metni ("...hazırlanır.6
  ana başlıkta...") 1. adımın cümlesinin yanlışlıkla tekrarlanmış hali +
  gerçek 2. adım metninin birleşimiydi (WP'nin kendi kopyala-yapıştır
  hatası) — yalnızca gerçek/anlamlı kısım ("6 ana başlıkta, 20 kısa soruya
  yanıt verin.") kullanıldı, bug taşınmadı.
- **Section 5 — "Test Sonucunda Sizi Neler Bekliyor":** solda **PLACEHOLDER**
  (gerçek görsel `Group-1365421389`, `uploads.zip`'te — Faz 2), sağda 4
  kart. **Bilinçli kaynaktan sapma (kullanıcı talebiyle):** kaynakta bu
  kartlar düz beyaz/gölgesiz/tek-renk siyah ikon (section 2'den FARKLI,
  daha sade bir stil) — kullanıcı "section 2'deki kart stiliyle tutarlı
  olsun" istediği için `rounded-2xl`/gölge/renkli-rozet buraya da
  UYGULANDI; kaynakta per-kart renk verisi olmadığından (hepsi aynı siyah
  ikon) 4 kart TEK bir tema rengiyle (`--color-brand-light`) rozetlendi —
  section 2'nin 5 farklı rengi gibi uydurma bir renk ataması yapılmadı.
- **Section 6 — kapanış CTA:** "İK Dijital Olgunluk Skorunu Hemen Hesapla"
  (siyah/heading rengi — diğer bölüm başlıklarının aksine bu KIRMIZI
  DEĞİL). **Yeni implementasyon yazılmadı** — kaynakta bu bölümün formu
  hero'dakiyle (`bc81c1b`/`8039718`) BİREBİR AYNI (3 alan + buton,
  kaynağın kendi `sessionStorage` senkron script'i iki formu "aynı"
  gösteriyor) — bu yüzden ortak `CompanyForm({ onSubmit, idPrefix })`
  component'i çıkarılıp hem hero (`CompanyStep`) hem kapanış CTA'sı
  (`ClosingCtaSection`) aynı component'i kendi bağımsız state'iyle iki kez
  render ediyor; `idPrefix` çakışan DOM id'lerini önlüyor. Buton hero'daki
  ile AYNI `onSubmit={() => setStep('quiz')}` akışını tetikliyor —
  mevcut 20 soruluk ankete bağlı, ayrı bir akış yazılmadı.
- **Genel arka plan:** Araştırma sonucu — bu şablonda (post-23868.css)
  sayfa/body seviyesinde gizli bir alternatif gri/beyaz section-arkaplanı
  DESENİ YOK; tek iki gerçek renk sapması zaten Section 4'ün kırmızımsı
  gradyanı ve Section 6'nın gri form paneliydi (`CompanyForm`'un
  `bg-black/14` kuralıyla zaten paylaşılıyor) — ikisi de bu turda
  uygulandı, ayrı bir "genel arka plan" değişikliği gerekmedi. Kart
  arka planları proje konvansiyonuyla (`FeatureGrid.astro`'nun
  `bg-surface`'i) tutarlı olsun diye `bg-white`'tan `bg-surface`'e
  çevrildi (aynı hex, token tutarlılığı için).
- **PLACEHOLDER kullanılan 2 yer (Faz 2/`uploads.zip` işlenince
  değiştirilecek):** Section 3'ün rapor mockup görseli (`Group-1365421288`,
  1000×821 en-boy oranı korunuyor) ve Section 5'in sonuç ekranı görseli
  (`Group-1365421389`, 864×988 en-boy oranı korunuyor) — ikisi de kesikli
  çizgili, "(yakında)" etiketli kutular, gerçek görsel eklenince yalnızca
  bu placeholder `<img>`'e çevrilecek.
- **Test:** Her bölümden sonra ayrı ayrı `astro check` (0 hata) + dev
  server `curl` doğrulaması yapıldı. Son turda `astro build` 865 sayfa
  hatasız (sayı değişmedi), iki `CompanyForm` instance'ının benzersiz
  DOM id'leri taşıdığı (`maturity-hero-*`/`maturity-closing-*`)
  doğrulandı. Regresyon: `test-no-external-idenfit-links.mjs` 2325
  dosyada 0 sorun. **Not:** Chrome uzantısı bu oturumda da bağlı değildi
  — tüm doğrulama element-ID çapraz referanslı CSS okuması + `curl` ile
  yapıldı, gerçek görsel sonuç kullanıcı tarafından ekran görüntüsüyle
  ayrıca teyit edilmeli.

---

**[2026-07-29] İK Dijital Olgunluk Testi hero'su gerçek kaynak CSS'iyle
düzeltildi — kayıp H1, gri form paneli, solid buton, padding + `lottie-web`
ile birebir dekoratif arc animasyonu eklendi.**

- **Keşif:** `src/components/HrMaturityTest.tsx`'in `CompanyStep`'i
  bulundu. Kaynağın template id'si (`23868`, canlı `ik-dijital-olgunluk-testi/`
  HTML'i) üzerinden `post-23868.css` çekilip element-ID çapraz doğrulamalı
  ölçüldü: **H1** ("İK Dijital Olgunluk Testi", id `0cf74fb`) bizde HİÇ
  render edilmiyordu (yalnızca küçük kırmızı eyebrow vardı) — kaynakta
  56/42/32px (masaüstü/tablet/mobil) kalın siyah. **H2** ("3 Dakikada
  Skorunuzu Öğrenin", id `a337850`) 36/28/22px, "3 Dakikada" kısmı
  `font-weight:400` (bizde yanlışlıkla kalın kalıyordu). **Form paneli**
  (id `47d9ea6`) kaynakta gerçek bir gri kart: `background-color:#00000024`
  (~%14 siyah), `border:1px solid #FFFFFFCC`, `border-radius:10px`,
  masaüstünde `flex-direction:row` (%30/%25/%25/%20 kolonlar) → `≤767px`'te
  `column` — bizde panel yoktu, alanlar hep dikeydi. **Buton:** global kit
  kuralı (`uicore-global.css`: `.elementor-button{color:#FFF;background-color:
  var(--e-global-color-uicore_primary)}`) → solid kırmızı zemin/beyaz yazı,
  `border-radius:10px` — bizde `.btn-cta` (outline/beyaz-zemin) yanlış
  uygulanmıştı. **Padding:** dış section (`dc9ac2c`) 100/100px masaüstü →
  75/75px tablet → 34/50px mobil (bizim `py-12 lg:py-16`'dan belirgin
  fazla). **Dekoratif "yay":** SVG/background-image/pseudo-element DEĞİL —
  gerçek bir **Lottie animasyonu** (`uzun.json`, 9KB, 8 katman, kırmızıdan
  şeffafa geçen radyal gradyan glow, 10sn döngü), `elementor-widget-lottie`
  ile absolute konumlu/tam genişlik/`z-index:0`/`opacity:0.9` render
  ediliyordu.
- **Pilot:** Yalnızca başlık yapısı (ayrı H1+H2, doğru font-size/weight)
  düzeltilip kullanıcıya gösterildi, onay alındıktan sonra kalan maddelere
  geçildi.
- **Kullanıcı kararı (arc animasyonu):** statik CSS yaklaşıklaması yerine
  **`lottie-web` (~28KB) eklenip kaynağın kendi `uzun.json`'ı birebir
  kullanılsın** istendi (proje varsayılan tercihi olan "yeni bağımlılık
  ekleme" karşıtı ilkeden bilinçli bir sapma, açıkça kullanıcı onaylı).
  `npm install lottie-web` (dev server DURDURULARAK, kurallara uygun) →
  `astro.config.mjs`'in `vite.optimizeDeps.include` listesine eklendi
  (bkz. "Vite bağımlılık önbelleği bozulması" kalıcı kuralı — yeni bir
  client-side paket eklenince bu adım ZORUNLU). Ham JSON
  `public/lottie/hr-maturity-arc.json`'a kopyalandı (kaynağın kendi
  yaklaşımıyla tutarlı — `path:` ile runtime'da URL'den fetch ediliyor,
  `animationData` ile JS bundle'ına gömülmüyor). Yeni `MaturityArcDecoration`
  component'i (`useRef`+`useEffect`, `lottie.loadAnimation`) yalnızca
  "company" adımında, absolute/`-z-10`/`pointer-events-none` olarak
  render ediliyor.
- **Uygulama:** Form paneli gerçek ölçülen değerlerle (`bg-black/14
  border border-white/80 rounded-[10px] p-5`) kuruldu, `flex-col
  md:flex-row` (kaynağın `≤767px` eşiği Tailwind'in `md:`sine en yakın
  düşüyor) + `md:basis-[30/25/25/20%]` kolonları. Input stili
  (`inputClass`) kaynağın gerçek `.elementor-field` kuralına (`bg-white
  rounded-[10px] border-white`) güncellendi — HeroForm'un "dolgun" stiliyle
  KARIŞTIRILMADI, bu sayfaya özgü ayrı ölçüm. Buton `.btn-cta`'dan
  `bg-brand text-white rounded-[10px]`e (solid) çevrildi — header'ın
  `.btn-cta-solid`'i (11px font, pill, header'a özgü) DOĞRUDAN reuse
  edilmedi, çünkü bu sayfanın kendi ölçülen köşe/boyutu farklı (10px,
  15px font). Hero padding'i yalnızca "company" adımına taşındı (quiz/sonuç
  adımları kendi sade `py-12 lg:py-16`'sını korudu).
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız (sayfa
  sayısı değişmedi). `curl` ile H1/H2/panel/buton class'larının render
  edildiği, `/lottie/hr-maturity-arc.json`'ın 200 + 9179 byte (kaynakla
  birebir aynı boyut) döndüğü, `dist/lottie/hr-maturity-arc.json`'ın
  build çıktısına dahil olduğu doğrulandı. Regresyon:
  `test-no-external-idenfit-links.mjs` 2325 dosyada 0 sorun. **Not:**
  Chrome uzantısı bu oturumda da bağlı değildi — gerçek görsel/pixel-perfect
  sonuç (özellikle Lottie animasyonunun gerçek tarayıcıda beklenen konum/
  opaklıkta oynadığı) kullanıcı tarafından ekran görüntüsüyle ayrıca
  doğrulanmalı.

---

**[2026-07-29] Sektör sayfalarındaki sabit "Turizm Sektörü" çapraz-tanıtım
bloğu kaldırıldı — kaynağın kendi (idenfit.com'un canlı sitesinin) ACF
hatası olduğu doğrulanıp bilinçli olarak kaldırıldı.**

- **Keşif:** Footer'ın hemen üstündeki ikon+başlık+açıklama+"daha fazlası>"
  bloğu `SectorPage.astro`'nun `relatedSectorPromo` render'ından (ACF
  `section_3_*` alanı, `scripts/fetch-sectors.mjs`'te "section_3_* gerçekte
  BU sektörün içeriği değil — başka bir sektöre çapraz-tanıtım" diye
  ZATEN belgelenmiş bir alan) geliyordu. `reference/wordpress-export/sectors.json`
  taranınca **12 sektörün 12'sinde de** bu alanın "Turizm Sektörü"ne sabit
  olduğu görüldü (Turizm'in kendi sayfası bile kendine link veriyordu) —
  bizim extraction/filtreleme hatamız değildi. Canlı idenfit.com'da
  (`curl` ile Perakende + Dağıtım sayfaları) AYNI bloğun AYNI şekilde
  bozuk olduğu doğrulandı — yani bu, KAYNAK SİTENİN KENDİ bug'ı (muhtemelen
  bu ACF alanı hiç per-sektör doldurulmamış, tek bir kopya-yapıştır
  şablondan kalmış), bizim tarafımızda render/filtreleme hatası değil.
- **Pilot:** `getSectorContent()`'e geçici olarak yalnızca
  `perakende-sektoru-ik-cozumleri` için `relatedSectorPromo: null` koşulu
  eklendi, `curl` ile Perakende'nin 4 dilinde bloğun kaybolduğu, kontrol
  grubu (Gıda, Dağıtım) dahil diğer 11 sektörün etkilenmediği doğrulandı.
- **Kullanıcı onayı sonrası tam kaldırma:** `relatedSectorPromo` hem
  `SectorPage.astro`'nun JSX'inden (çapraz-sektör tanıtım kartı `<section>`'ı)
  hem `sectorContent.ts`'in `SectorContent` interface'inden/`getSectorContent()`
  return'ünden tamamen çıkarıldı (pilot koşulu da kaldırıldı, kalıcı silme).
  Ham JSON (`sectors.json`) ve onu üreten `fetch-sectors.mjs` DOKUNULMADI —
  proje konvansiyonuyla tutarlı (bkz. Puantaj'ın kullanılmayan `video_url`'i,
  madde 8), veri kaynakta duruyor, yalnızca render edilmiyor.
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız (sayfa
  sayısı değişmedi). `dist/`'teki tüm 48 sektör sayfası (12×4 dil) dosya
  bazında var olduğu ve promo bloğunun kendine özgü `<h3>` sarmalayıcısının
  HİÇBİR sayfada kalmadığı script ile doğrulandı. Regresyon:
  `test-sector-language-switch.mjs` 36/36, `test-urunler-menu-links.mjs`
  108/108, `test-no-external-idenfit-links.mjs` 2325 dosyada 0 sorun.

---

**[2026-07-28] Sekizinci düzeltme turu — KEŞFET → Hesaplamalar kolonu:
kaynakta düz metin DEĞİL, her linkin KENDİ küçük/renkli ikonu varmış,
8 ikon birebir çıkarılıp eklendi; hover rengi kırmızı değil mor (kaynağın
genel `a:hover` kuralı) olduğu bulundu.**

- **Araştırma:** KEŞFET menüsünün gerçek kaynağı (`/online-sunum-talep-et/`
  sayfasındaki gömülü `#explore-menu`, `navigation.ts`'in başındaki nottan
  biliniyordu) yeniden çekilip "Hesaplamalar" listesinin element ID'si
  (`1eaf004`, `elementor-widget-icon-list`) bulundu. Canlı HTML'de HER 8
  linkin (`Fazla Mesai Ücreti Hesaplama` vb.) kendi 16×16 inline SVG
  ikonunu taşıdığı görüldü — kullanıcının "düz metin listesi" gözlemi
  DOĞRUYDU (bizim tarafımızda eksikti), ama kaynakta bu ikonlar TEK bir
  renkte (marka kırmızısı) DEĞİL: her biri KENDİ imza rengini taşıyor —
  Fazla Mesai `#FF0000` (kırmızı), Gelir Vergisi `#F5AD1F` (amber),
  İşveren Maliyeti `#772BAE` (mor), Kıdem Tazminatı `#842438` (bordo),
  Maaş Zammı `#008EDF` (mavi), Kurumlar Vergisi `#00CFC5` (turkuaz), Yemek
  Ücreti `#FF00D0` (magenta), İhbar Süresi `#74BE1F` (yeşil) — kaynağın
  kendi çok-renkli tasarım kararı, kullanıcının "muhtemelen marka
  kırmızısı" tahmini KISMEN doğruydu (yalnızca 1/8'i kırmızı). Metin rengi
  için ilgili CSS dosyası (`post-24918.css`, element ID çapraz doğrulamalı)
  incelendi — `.elementor-icon-list-text`'in KENDİSİ hiçbir `color`
  taşımıyor (yalnızca font-family/size/weight); hover için de bu widget'a
  özel bir kural YOK. Bulunan gerçek davranış: sitenin GENEL `a:hover{
  color:var(--uicore-secondary-color)}` kuralı (`uicore-global.css`) devreye
  giriyor — bu değişken `#6F2C90` (bizim `secondary`/mor token'ımızla
  BİREBİR aynı), yani hover'da KIRMIZI DEĞİL MOR'a dönüyor. Bu, kullanıcının
  "muhtemelen kırmızı" tahminiyle çelişen ama element-ID + CSS
  archaeology'siyle YÜKSEK güvenilirlikte doğrulanmış bir bulgu.
- **Uygulama:** 8 ikon birebir (path verisi + kendi stroke renkleri)
  `src/components/icons/CalculatorIcons.tsx`'e taşındı (ÜRÜNLER/SEKTÖRLER'in
  `IdenfitIcons.tsx`'iyle aynı desen — yeni bir ikon kütüphanesi kurulmadı).
  `navigation.ts`'teki `MegaMenuIcon` union'a yeni bir `{source:'calc';
  name:CalculatorIconName}` varyantı eklendi, 8 Hesaplamalar linkinin her
  birine kendi `icon` alanı verildi. **Görsel dil kararı (kullanıcının
  3. maddesiyle bilinçli bir gerilim):** SEKTÖRLER'in dolu kırmızı daire +
  beyaz ikon ROZETİ burada ZORLANMADI — kaynakta bu liste rozetsiz, küçük
  (16px) ikonlar kullanıyor, rozet dayatmak kaynaktan sapardı. Bunun yerine
  yeni bir `LinksColumn.linkIconStyle?:'badge'|'inline'` alanı eklendi
  (`navigation.ts`+`MegaMenu.tsx`, varsayılan `'badge'` SEKTÖRLER'i hiç
  etkilemedi) — Hesaplamalar `'inline'` alıyor: küçük ikon + metin yan
  yana, ikonun kendi rengi korunuyor (badge yok), hover `hover:text-brand`
  (kırmızı) yerine `hover:text-secondary` (mor, kaynaktan doğrulanan gerçek
  renk). **Tutarlı görsel dil** (kullanıcının 3. maddesi) böylece YAPISAL
  seviyede sağlandı (aynı `flex items-center gap-X` ikon+metin satır
  düzeni, aynı `text-sm` boyutu, aynı transition) — ama ikonun KENDİ
  stili (rozetli/rozetsiz, tek-renk/çok-renk) kaynaktaki gerçek farkı
  yansıtıyor, zorla tek kalıba sokulmadı. Kolon başlığındaki büyük (46px,
  kırmızı, kaynakta da bulunan) hesap-makinesi ikonu bu turda dokunulmadı —
  mevcut lucide `Calculator` ikonu zaten kavramsal olarak yeterince yakın,
  kullanıcı yalnızca 8 link ikonunu sordu.
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız (sayfa
  sayısı değişmedi). 4 dilde (`curl`) 8 SVG'nin (`viewBox="0 0 16 16"`)
  render edildiği, her linkin kendi `stroke` rengini taşıdığı, `hover:
  text-secondary` sınıfının uygulandığı, href'lerin `/hesaplama-araclari/#…`
  anchor'larına doğru şekilde per-locale çözüldüğü doğrulandı. Regresyon:
  `test-urunler-menu-links.mjs` 108/108, `test-no-external-idenfit-links.mjs`
  2325 dosyada 0 sorun. **Not:** Chrome uzantısı bu oturumda da bağlı
  değildi — tüm doğrulama element-ID çapraz referanslı CSS/HTML
  okumasıyla yapıldı, gerçek görsel sonuç (özellikle 8 farklı rengin
  yan yana nasıl durduğu) kullanıcının ekran görüntüsüyle teyit edilmeli.

---

**[2026-07-28] Yedinci düzeltme turu — header logosu 32px'ten kaynağın
GERÇEK render boyutu 50px'e büyütüldü (font değil, elle vektörleştirilmiş
SVG olduğu yeniden doğrulandı), kırmızı paneldeki görselin "üste yakın/
panelin çoğunu kaplıyor" görünümünün kök nedeni bulundu: kaynağın paneli
SIFIR padding taşıyor, bizim `px-8 py-12/16` yapay boşluk yaratıyordu.**

- **KONU 1 — Header logosu: font DEĞİL, SVG'nin render boyutu yanlıştı.**
  Kullanıcı "font-family/font-weight/letter-spacing" ölçümü istedi ama
  canlı HTML'de logo widget'ının (element ID `87adeaf`, `data-widget_type=
  "image.default"`) düz bir `<img src=".../idenfit-logo.svg">` olduğu
  yeniden doğrulandı (2026-07-24'teki "font değil, elle vektörleştirilmiş
  logotype" bulgusuyla tutarlı — bu turda TEKRAR canlı HTML'den teyit
  edildi, varsayılmadı). Font kavramları (letter-spacing vb.) bu yüzden
  UYGULANAMAZ — asıl fark RENDER BOYUTUYDU: `post-9695.css`'te `87adeaf
  img{width:136px;height:50px;}` bulundu (SVG'nin kendi `viewBox="0 0 98
  36"` oranıyla, 50×2.722=136.1, birebir tutarlı) — bizim `h-8` (32px)
  gerçek boyuttan **%56 KÜÇÜKTÜ**. `h-[50px] w-auto`'ya düzeltildi
  (`Header.astro`). Küçük boyutta harflerin "daha ince/farklı aralıklı"
  görünmesi optik bir yanılsamaydı (tek SVG, tek viewBox, yıldız dahil her
  şey orantılı büyüdü/küçüldü — yıldızın panel içi KONUMU, viewBox'ın sağ
  üst köşesi, değişmedi, 2026-07-24'te zaten doğrulanmıştı). **Kapsam
  dışı (bilinçli):** Footer/MobileMenu'nün kendi logo kullanımları bu
  turda dokunulmadı — kullanıcı özellikle "header'ındaki logo" dedi,
  Footer kaynakta zaten `idenfit-logo.svg`'yi HİÇ kullanmıyor (ayrı bir
  incelemeyi gerektirir, bu turun kapsamı dışında), MobileMenu bizim kendi
  ürettiğimiz off-canvas menü (literal 1:1 kaynaklı değil).
- **KONU 2 — Kırmızı paneldeki görselin kök nedeni: SIFIR padding vs bizim
  yapay boşluğumuz.** `post-25148.css` yeniden, satır satır okundu (önceki
  turlarda özetlenen bulgu eksikti). Kaynağın kırmızı paneli (`efc5a57`)
  `--padding-top:0px;--padding-bottom:0px` — yani masaüstünde DIŞ PADDING
  SIFIR, tüm boşluk yalnızca flex `justify-content:center`'dan geliyor;
  `<1023px`'te bile yalnızca `padding-top:20px;padding-bottom:20px` (küçük).
  Bizim önceki `px-8 py-12 lg:py-16` bu boşluğu YAPAY olarak büyütüp
  görseli göreceli küçük/fazla ortada gösteriyordu — kaldırıldı (yerine
  kaynağın kendi küçük mobil boşluğuna yakın `px-6 py-5 lg:px-0 lg:py-0`).
  İç sarmalayıcı `max-w-xl`(576px) → kaynağın GERÇEK `content-width:615px`
  değerine (`max-w-[615px]`) düzeltildi. Görsel `max-w-md/lg` (sabit px,
  önceki turun tahmini) → kaynağın GERÇEK `max-width:90%` (NİSPİ, `91360f4`
  widget'ının kendi custom CSS'i) kuralına (`max-w-[90%]`) geçirildi —
  artık sarmalayıcı büyüdükçe görsel de orantılı büyüyor, birebir. Ayrıca
  aynı dosyada bulunan iki küçük ama kesin değer de düzeltildi: başlığın
  (`f10512a`) `margin-top:20px !important` (bizim `mt-8`/32px → `mt-5`/
  20px) ve `text-2xl lg:text-[32px]` (kaynak: mobil 24px/masaüstü 32px,
  önceki turun sabit `text-[32px]`'i yalnızca masaüstü değeriydi); alt
  yazının (`68737fd`) `font-size:16px;font-weight:500` masaüstü/`14px`
  mobil + `color:#F8F8F8` (bizim `text-white/90` opaklık tahminimiz yerine
  kaynağın TAM rengi) → `text-sm lg:text-base font-medium text-[#F8F8F8]`.
  **Araştırılıp ELENEN bir hipotez:** `955e842` (hero section'ın kendisi)
  `min-width:1024px`'te `min-height:calc(100vh - 120px) !important` taşıyor
  — ilk bakışta "panel neredeyse tam viewport yüksekliğinde" gibi görünse
  de, kullanıcının "görsel panelin ÇOĞUNU kaplıyor" tarifiyle ÇELİŞİYOR
  (viewport-yüksekliğinde bir panelde görece küçük görsel çoğunu kaplayamaz)
  — bu yüzden bu satır UYGULANMADI, gerçek görsel kök neden SIFIR padding
  + nispi `max-width:90%` olarak belirlendi (yukarıya bkz.). Bu min-height
  satırı ileride ayrı bir konu olarak (hero'nun genel dikey ölçeği)
  gündeme gelirse referans olarak not düşüldü, bu turda dokunulmadı.
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız (sayfa
  sayısı değişmedi). `curl` ile 4 dilin hepsinde (TR/EN/NL/IT): logo
  sınıfının `h-[50px] w-auto` olduğu, kırmızı panelin `px-6 py-5 lg:px-0
  lg:py-0` (eski `px-8 py-12 lg:py-16` yok) taşıdığı, iç sarmalayıcının
  `max-w-[615px]` ve görselin `max-w-[90%] object-contain` olduğu
  doğrulandı. Regresyon: `test-urunler-menu-links.mjs` 108/108,
  `test-no-external-idenfit-links.mjs` 2325 dosyada 0 sorun. **Not:**
  Chrome uzantısı bu oturumda da bağlı değildi — tüm doğrulama element-ID
  çapraz referanslı CSS okumasıyla (canlı HTML → gerçek widget ID →
  `post-25148.css`/`post-9695.css`'te o ID'ye bağlı kural) yapıldı,
  tahmin edilmedi; gerçek görsel sonuç kullanıcının yan yana ekran
  görüntüsüyle teyit edilmeli (aşağıya bkz.).

---

**[2026-07-28] Altıncı düzeltme turu — hero'nun %50/%50 hizalaması gerçek
kök nedeniyle düzeltildi, kırmızı paneldeki görsel büyütüldü, header'ın
"Online Sunum Talebi" butonu element-ID ile çapraz doğrulanıp GERÇEKTEN
solid kırmızı olduğu bulundu (ayrı `.btn-cta-solid` sınıfı eklendi), dil
değiştiricideki "TR TR" bug'ı Windows'un emoji bayrak render sorunundan
kaynaklandığı bulunup elle SVG'ye geçilerek düzeltildi.**

- **KONU 1 — Hero'nun %50/%50 hizalama bug'ının GERÇEK kök nedeni bulundu.**
  Önceki (beşinci) turda satır `mx-auto max-w-7xl` (1280px'e sınırlı) grid
  içindeydi AMA kırmızı panel AYRICA `lg:mr-[calc(50%-50vw)]` ile viewport
  kenarına kadar taşıyordu — bu ikisi ÇAKIŞIYORDU: grid kendi %50/%50'sini
  dar (1280px) genişliğe göre hesaplarken, kırmızı panel bunun ÖTESİNE
  taşıp gerçek bölünme noktasını viewport'un GERÇEK ortasından kaydırıyordu
  (kullanıcının "tam ortadan ikiye bölünmüş gibi durmuyor" bulgusunun kök
  nedeni). Kaynağın kendisi zaten `e-con-full` (sınırsız, önceki turda
  doğrulanmıştı) olduğu için çözüm satırı BAŞTAN sınırsız yapmak oldu:
  `max-w-7xl` kaldırıldı, `grid-cols-2` artık viewport'un GERÇEK yarısını
  hesaplıyor, eski `lg:mr-[calc(50%-50vw)]` bleed hilesine hiç gerek
  kalmadı (kaldırıldı). Ayrıca dördüncü turda BİLİNÇLİ olarak sağ paneli
  sol formdan geniş tutan `[1fr_1.25fr]` oranı (kaynaktan sapma) da bu
  turda kullanıcının açık "tam %50/%50" talimatıyla geri alındı — artık
  gerçek `grid-cols-2`.
- **KONU 2 — Kırmızı paneldeki görsel büyütüldü + ortalandı.** İç
  sarmalayıcı `max-w-[420px]`'den `max-w-xl`'e büyütüldü (panel artık
  gerçekten viewport'un yarısı kadar geniş olduğundan eski dar sarmalayıcı
  orantısız küçük kalıyordu), görsel `max-w-[90%]` sınırından `max-w-md`
  (`lg:max-w-lg`)'e büyütüldü, `object-contain` korunarak (kırpılma yok).
  **Çözünürlük kontrolü:** `HOME_HERO_IMAGE` zaten kaynağın kendi yüksek
  çözünürlüklü dosyasını kullanıyor (TR: `Group-1365418917-1.png`
  1427×976, EN/NL/IT: `Group-1365418980-1*.png` 1422×946) — YENİ/daha
  yüksek çözünürlüklü bir kaynak aramaya gerek kalmadı, mevcut dosya CSS
  render boyutunun (512-576px) çok üzerinde, kalite sorunu yok, sorun
  yalnızca CSS'in görseli küçük tutmasıydı.
- **KONU 3 — Header'ın "Online Sunum Talebi" butonu element-ID ile çapraz
  doğrulandı: GERÇEKTEN solid kırmızı, beyaz-çerçeveli DEĞİL.** Kullanıcının
  ekran görüntüsü şüphesi (mevcut buton beyaz-iç/kırmızı-çerçeve, ama
  gerçek sitede solid olabilir) doğru çıktı. Yöntem: canlı idenfit.com
  ana sayfasının HTML'i çekilip "Online Sunum Talebi" linkinin GERÇEK
  widget ID'si bulundu (`57d3049`, `data-widget_type="button.default"`,
  `elementor-button-link` class'ı — bu ID `post-9695.css`'te (doğru header
  dosyası, önceki turda doğrulanmıştı) tek bir yerde geçiyor ve YALNIZCA
  boyut/gölge/köşe override'ı içeriyor
  (`font-size:11px;font-weight:400;line-height:15px;box-shadow:4px 5px 5px
  0px rgba(0,0,0,.2);border-radius:19px;padding:10px`) — background-color/
  color HİÇ override edilmemiş, yani global kit varsayılanından geliyor.
  Kit CSS'i bulmak ayrı bir araştırma gerektirdi (`kit-9561.css` diye
  tahmin edilen dosya 404 verdi) — gerçek dosya `<link id='uicore_global-css'
  href='.../uploads/uicore-global.css'>` olarak bulundu, içinde
  `--e-global-color-uicore_primary:red` + global `.elementor-button{color:
  #FFF;background-color:var(--e-global-color-uicore_primary)}` (SOLID
  KIRMIZI zemin + BEYAZ metin) doğrulandı. **Sonuç:** header'ın butonu ile
  Hero formunun kendi "Hemen Başvur" gönder butonu (widget `43e32bd`,
  önceki turda AYRI doğrulanmış, GERÇEKTEN beyaz-zemin/kırmızı-çerçeve bir
  per-widget override) birbirinden BAMBAŞKA stiller — `.btn-cta` (mevcut
  beyaz+çerçeve sınıf, form gönder butonuna ait, DOKUNULMADI, site
  genelinde 10+ farklı CTA'da hâlâ kullanılıyor, kapsam dışı) yerine
  header için yeni, ayrı `.btn-cta-solid` sınıfı eklendi (`global.css`) —
  solid kırmızı zemin, beyaz metin, `border-radius:9999px` (pill),
  `font-size:11px`, `padding:10px`, kaynağın gölgesi (`box-shadow:4px 5px
  5px rgba(0,0,0,.2)`). Kaynağın `:hover`/`:focus` kuralı arka planı AYNI
  kırmızıya tekrar atıyor (görünür bir renk değişimi YOK, kaynağın kendi
  davranışı) — kullanılabilirlik için hafif bir kaldırma/gölge artışı
  eklendi (renk DEĞİŞMİYOR, yalnızca ince bir etkileşim ipucu, kaynaktan
  çelişen bir renk uydurulmadı). `Header.astro`'nun masaüstü CTA'sı
  `.btn-cta`'dan `.btn-cta-solid`'e geçirildi. `MobileMenu.tsx`'in kendi
  CTA'sı (mobil off-canvas menü zaten kaynakta yok, bizim kendi ürettiğimiz
  akordeon) RENK olarak aynı mantığa (solid kırmızı/beyaz metin) getirildi
  ama `.btn-cta-solid`'in tam boyutu (11px font/10px padding) BİLİNÇLİ
  olarak kullanılmadı — mobilde bu kadar küçük bir tam-genişlik buton
  dokunma hedefi/okunabilirlik açısından kötü olurdu, bunun yerine doğrudan
  Tailwind utility'leriyle (`bg-brand text-white rounded-full`, rahat
  `px-4 py-3`) aynı renk mantığı korunarak mobil için rahat boyut verildi.
  **Not (`display` çakışması):** `.btn-cta-solid`'e ilk taslakta
  `display:inline-flex` eklenmişti — bu, Tailwind v4'ün katman önceliği
  kuralı gereği (bkz. §Mimari "Tailwind v4 CSS layering") çağrı yerindeki
  `hidden sm:inline-flex` (responsive görünürlük) utility'lerini geçersiz
  kılacaktı; `display` sınıftan çıkarılıp yalnızca `align-items`/
  `justify-content` bırakıldı, görünürlük çağrı yerinin utility'lerine
  bırakıldı.
- **KONU 4 — Dil değiştiricideki "TR TR" tekrarı: kod hatası DEĞİL, Windows
  Chrome'un emoji render sınırlaması.** Önceki (beşinci) turda eklenen
  bayrak emoji'si (`flagEmoji()`, Unicode regional-indicator kod noktaları)
  kullanıcının Windows/Chrome ortamında tek bir bayrak glyph'inde
  BİRLEŞMİYOR — iki harf (🇹+🇷) ayrı ayrı render ediliyor, bu da yanındaki
  "TR" kısa koduyla birlikte görsel bir tekrar izlenimi veriyor. Bu, kod
  mantığında bir çiftleme/hata DEĞİL, salt platform-bazlı font render
  sınırlaması. **Düzeltme:** yeni `src/components/icons/FlagIcon.tsx` —
  yalnızca ihtiyaç duyulan 4 bayrağın (TR/GB/NL/IT) elle çizilmiş, sıfır
  bağımlılıklı küçük SVG'leri (ayrı bir `flag-icons` kütüphanesi KURULMADI
  — yalnızca 4 ülke gerektiği için tüm dünya bayraklarını içeren bir paket
  orantısız olurdu). `LanguageSwitcher.tsx` `flagEmoji()`'den bu yeni
  component'e geçirildi (hem masaüstü header dropdown'ı hem MobileMenu'nün
  dil seçicisi AYNI component'i paylaştığı için otomatik ikisinde de
  düzeldi). **Kapsam dışı (bilinçli):** `PhoneCountrySelect.tsx` (45
  ülkelik telefon kodu seçici) hâlâ `flagEmoji()` kullanıyor — kullanıcı
  yalnızca dil seçiciyi bildirdi, 45 ülke için elle SVG çizmek orantısız
  olurdu, farklı bir bug yüzeyi (aynı platform sınırlaması orada da teorik
  olarak var ama kullanıcı raporlamadı, dokunulmadı).
- **KONU 5 — WhatsApp/Ara ikonlarının "yarım kesilmiş" görünmesi — yapısal
  kök neden muhtemelen KONU 1 ile aynıydı, yan etki olarak düzeldi.**
  İkonlar `HeroSection.astro`'nun sol kolonunda, hero `<section>`'ın
  `overflow-hidden` sınıfıyla sarmalıydı (önceki turun `lg:mr-[calc(50%-
  50vw)]` bleed hilesinin olası yatay scrollbar'ına karşı eklenmişti).
  KONU 1'in düzeltmesiyle bleed hilesi tamamen kaldırıldığından
  `overflow-hidden`'a da artık gerek kalmadı — kaldırıldı. Bu, hizalama
  bozukluğunun yarattığı olası taşma/kırpılma kombinasyonunu ortadan
  kaldırıyor. **Not:** Chrome uzantısı bu oturumda da bağlı değildi, bu
  yüzden "kesilme" gerçekten görsel olarak doğrulanamadı — kullanıcının
  ekran görüntüsüyle tekrar kontrol etmesi gerekiyor (aşağıdaki test
  adımlarına bkz.); eğer sorun DEVAM ederse, bu muhtemelen site-geneli
  sabit `FloatingContactButtons.astro` widget'ıyla (sağ-alt, ayrı bir
  bileşen, bu turda dokunulmadı) karıştırılmış olabilir, ikisi ayrı
  elemanlar.
- **Yapısal düzeltme (yan not):** KONU 1/2/5 değişiklikleri sırasında
  `HeroSection.astro`'da bir `<div>` kapanış etiketi eksikliği (sol
  kolonun iç `max-w-xl` sarmalayıcısı hiç kapatılmamıştı) fark edilip
  düzeltildi — `astro build`'in HTML parse aşamasında sessizce yanlış
  iç içe geçme üretebilirdi, `astro check`/`build` her ikisi de 0 hata
  ile geçti, div açılış/kapanış sayısı (7/7) elle doğrulandı.
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız (sayfa
  sayısı değişmedi). `curl` ile 4 dilin hepsinde (TR/EN/NL/IT): grid'in
  `grid-cols-2` (eski `[1fr_1.25fr]` yok) olduğu, `mr-[calc`'in hiçbir
  class attribute'unda kalmadığı (yalnızca açıklayıcı HTML yorumlarında,
  zararsız), header CTA'nın `btn-cta-solid hidden sm:inline-flex`
  sınıfını taşıdığı, hero görselinin gerçek yüksek-çözünürlüklü kaynak
  dosyasını (1427×976 TR, 1422×946 EN/NL/IT) kullandığı, dil seçicide
  emoji YERİNE SVG bayrak render edildiği (0 emoji byte'ı) doğrulandı.
  Regresyon: `test-urunler-menu-links.mjs` 108/108,
  `test-no-external-idenfit-links.mjs` 2325 dosyada 0 sorun (yeni
  `.btn-cta-solid`/`FlagIcon.tsx` hiçbir linki etkilemedi). **Not:**
  Chrome uzantısı bu oturumda da bağlı değildi — tüm doğrulama `curl` +
  element-ID çapraz referanslı CSS okumasıyla yapıldı, gerçek görsel
  sonuç (özellikle KONU 5'in "kesilme" iddiası) kullanıcının ekran
  görüntüsüyle teyit edilmeli.

---

**[2026-07-28] Beşinci düzeltme turu — dil değiştiriciye bayrak, hero'nun
kırmızı paneli BAŞTAN kuruldu (gerçek kaynak yapısı), form input'ları
alt-çizgili stile geri döndü (element-ID doğrulamalı), Destek Talebi
altındaki WhatsApp/Ara ikonları geri eklendi.**

- **KONU 1 — Dil değiştiriciye bayrak emoji eklendi.** `LanguageSwitcher.tsx`
  (Header masaüstü dropdown VE MobileMenu'nün mobil dil seçicisi AYNI
  component'i paylaşıyor — tek dosya, iki yer otomatik tutarlı). Yeni SVG
  kütüphanesi KURULMADI — `PhoneCountrySelect.tsx`'in zaten kullandığı
  `flagEmoji(iso)` (`phoneCountries.ts`, ISO kodundan Unicode regional-
  indicator emoji üreten genel fonksiyon) yeniden kullanıldı, kod tekrarı
  yok. EN için İngiltere (GB) bayrağı — `phoneCountries.ts`'in EN→GB
  varsayılan ülke eşlemesiyle tutarlı.
- **KONU 2 — Hero'nun kırmızı paneli GERÇEK kaynak yapısına göre BAŞTAN
  kuruldu.** Element ID'leriyle çapraz doğrulama (`post-25148.css`,
  `data-elementor-id="25148"`) net bir yapı ortaya çıkardı: hero'nun
  KENDİSİ (`955e842`) düz `#F8F8F8` (açık gri) arka plana sahip, edge-to-
  edge; içindeki iki `%50` genişlik flex çocuğundan biri (`efc5a57`)
  KENDİ `#FF0101` (kırmızı) arka planını taşıyor — aralarında `gap:0`,
  YUVARLAK KÖŞE YOK, DIŞ PADDING YOK, iki renk doğrudan bitişik, tam
  yükseklik. Kırmızı panelin İÇİNDE ayrı, dar (`615px`) bir alt-kapsayıcı
  var — görsel+başlık+alt yazı BURADA, hem dikey HEM yatay ortalanmış
  (`justify-content:center;align-items:center`), görsel `object-fit:contain`.
  Önceki turların "card" görünümü (`rounded-2xl`, `min-h-[420px]`, `p-8`
  — kırmızının yalnızca ortada yüzen bir kutu gibi durması, kullanıcının
  "hâlâ yanlış" bulduğu asıl sebep) BU YÜZDEN tamamen kaldırıldı — artık
  kırmızı tam blok, köşesiz, görsel gerçekten ortalanmış. Başlık
  `text-2xl`(24px)'ten gerçek `32px/700/beyaz`'a düzeltildi. Önceki
  turdaki sağ-kenara-bleed kararı (`lg:mr-[calc(50%-50vw)]`) korundu.
- **KONU 3 — Form input'ları alt-çizgili (underline) stile GERİ
  DÖNDÜRÜLDÜ, element-ID doğrulamalı.** `post-25148.css`'te hero form
  widget'ının (`43e32bd`) KENDİ `.elementor-field` kuralı bulundu:
  `border-width:0px 0px 2px 0px` (yalnızca 2px ALT kenarlık, kutulu
  DEĞİL), `border-color:#D9D9D9`, arka plan YOK (şeffaf),
  `font-size:20px;font-weight:500`, metin rengi `#ADADAD`. Bu, 2026-07-27'de
  kullanıcı kararıyla BİLİNÇLİ olarak "2. formun dolgun stiline" (dolu
  beyaz zemin + tam kenarlık) geçirilmişti — bu turda kullanıcının
  "gerçek siteyle birebir eşitle" talimatıyla o karar geri alınıp
  hero'nun kendi GERÇEK stiline dönüldü. **Bilinçli tek sapma:**
  `#ADADAD` yalnızca placeholder'a uygulandı (yazılan değer okunaklı
  `text-heading` kaldı) — kaynağın ayrı bir `::placeholder` kuralı yok,
  birebir uygulansa yazılan metin de aşırı soluk görünürdü, kullanılabilirlik
  önceliği (`YoutubeClickToPlay`'deki AYNI ilke). `PhoneCountrySelect.tsx`'in
  ülke-kodu/numara ayırıcı kenarlığı da aynı gri tona (`#D9D9D9`) çekildi.
  Bu component `HeroForm.tsx` üzerinden Hero/PanelFeatureSection(2. form)/
  PresentationRequestPage/ContactPage'in HEPSİNDE paylaşıldığından 4 sayfa
  da otomatik güncellendi.
- **KONU 4 — ⚠️ Regresyon değil, kasıtlı bir konsolidasyon kararının geri
  alınması.** Araştırıldı: WhatsApp/Ara ikonlarının "kaybolması" bir CSS
  üzerine-yazılması/component değişikliği DEĞİLDİ — dördüncü turda BİLİNÇLİ
  olarak, site-geneli `FloatingContactButtons.astro` eklenince "gereksiz
  tekrar" gerekçesiyle hero'dan KALDIRILMIŞTI (bkz. o turun günlüğü).
  Kullanıcı Destek Talebi linkinin altında da AYRICA görünmesini istediği
  için geri eklendi — artık HEM site-geneli sabit widget (her sayfada)
  HEM bu satır-içi çift (yalnızca ana sayfanın hero'sunda) birlikte var,
  kasıtlı. Stil `FloatingContactButtons.astro` ile TUTARLI (beyaz+kırmızı
  kenarlık WhatsApp, dolu kırmızı+beyaz Ara) — kalıcı kural: bundan sonra
  ikisi arasında stil DEĞİŞİKLİĞİ yapılırsa iki dosyada da uygulanmalı.
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız. 4 dilde
  `curl` ile 4 konu da doğrulandı (bayrak emoji'leri UTF-8 aware `Grep`
  ile, diğer HeroForm sayfaları — Online Sunum Talebi/İletişim — dahil).
  Regresyon: `test-urunler-menu-links.mjs` 108/108,
  `test-no-external-idenfit-links.mjs` 2325 dosyada 0 sorun. **Not:**
  Chrome uzantısı bu oturumda da bağlı değildi — KONU 2/3'ün düzeltmeleri
  element-ID çapraz doğrulamasıyla YÜKSEK güvenilirlikte ama gerçek
  tarayıcıda pixel-perfect görsel sonuç kullanıcı tarafından ekran
  görüntüsüyle doğrulanmalı.

**[2026-07-28] Dördüncü düzeltme turu — navbar fontunda YANLIŞ CSS
dosyası okunduğu keşfedildi (kritik düzeltme), sabit WhatsApp/Ara
widget'ı site geneline taşındı, Müşteriler kartları büyütüldü, footer
rengi siyahtan gerçek soft griye çevrildi.**

- **KONU 1 — ⚠️ KRİTİK BULGU: navbar fontu için İKİ TURDUR YANLIŞ CSS
  dosyası okunuyormuş.** Element ID çapraz doğrulaması (canlı HTML'deki
  gerçek nav widget ID'si, `5b6c029`, hangi CSS dosyasında GEÇTİĞİ
  aranarak) yapılınca `post-12302.css`'in (önceki iki turda okunan dosya)
  bu ID'yi HİÇ İÇERMEDİĞİ ortaya çıktı — o dosya header'a değil, sitenin
  başka bir bölümüne ait, tesadüfen aynı jenerik `.elementor-item`
  class'ını kullanıyormuş. Gerçek header `<header data-elementor-id="9695">`
  → `post-9695.css` içinde `elementor-element-5b6c029`'a bağlı kural
  bulunup ID eşleşmesiyle doğrulandı: **`font-size:13px` (14 değil),
  `font-weight:500` (400 değil), `color:#C1272D`** (bir tuğla-kırmızısı —
  önceki iki turda "siyah" sonucuna varmıştım, YANLIŞTI; kullanıcının İKİ
  TUR ÖNCEKİ "kırmızımsı" izlenimi aslında DOĞRUYMUŞ). `.nav-link-text`
  bu gerçek değerlere güncellendi; ayrıca `.nav-link-text:hover/:focus-visible`
  için AYRI bir kural eklendi (bulunan ek bug: Tailwind v4'ün `hover:text-brand`
  utility'si `@layer utilities` içinde olduğundan, layer'sız düz
  `.nav-link-text{color:...}` kuralını ASLA override edemiyordu — hover
  efekti sessizce çalışmıyordu, düzeltildi). 4 çağrı yerindeki (Header/
  MegaMenu/MobileMenu×2) artık gereksiz `text-heading`/`hover:text-brand`
  sınıfları temizlendi. **Ders:** aynı jenerik Elementor class adının
  (`.elementor-item`) FARKLI template'lerde FARKLI değerlerle
  tanımlanabildiği — element ID'siyle çapraz doğrulama yapılmadan "doğru
  dosyayı okuduğumu" varsaymak hataya yol açtı, bundan sonra bu tür
  ölçümlerde önce hedef elementin gerçek `data-elementor-id`'sini (veya
  widget ID'sini) bulup İLGİLİ `post-{id}.css`'i indirmek gerekiyor.
- **KONU 2 — Sabit WhatsApp/Ara widget'ı site geneline taşındı.** Yeni
  `FloatingContactButtons.astro` — `BaseLayout.astro`'ya eklendi (proje
  genelinde TEK gerçek layout, `Layout.astro` hiç kullanılmıyor — 20
  sayfanın 20'si de `BaseLayout` import ediyor, tek noktadan TÜM sayfalara
  otomatik yayıldı). Kaynağın gerçek konumu (`right:20px`, Ara
  `bottom:75px`/WhatsApp `bottom:20px`) + gerçek numaralar korundu, renk
  KONU 4'ün (bir önceki tur) kararıyla marka kırmızısı/beyaz. **Konsolidasyon:**
  hero formunun altına gömülü küçük WhatsApp/Ara ikonları KALDIRILDI — artık
  floating widget ana sayfada da göründüğünden ikisi aynı anda gereksiz
  tekrar olurdu; kaynakta zaten yalnızca sabit widget var, hero'ya gömülü
  bir kopyası hiç yoktu, bu konsolidasyon kaynağa daha yakın.
- **KONU 3 — Müşteriler sayfası kartları büyütüldü.** Container `max-w-5xl`
  (1024px) → `max-w-7xl` (1280px, hero bölümüyle TUTARLI). `CustomerStoryRow.astro`:
  dikey boşluk `py-10/14`→`py-12/20`, satır arası `gap-8/16`→`gap-10/20`,
  medya kutusu `max-w-sm/w-2/5`→`max-w-md/w-[45%]`. Mevcut görsel hover'ı
  (`hover:scale-105`) dokunulmadan korundu, büyüyen kartla birlikte hâlâ
  çalışıyor.
- **KONU 4 — Footer rengi siyahtan gerçek soft griye çevrildi.** Footer'ın
  template ID'si (`data-elementor-id="10095"`) bulunup `post-10095.css`
  içinde en dıştaki container'ın (`<footer>`'ın DOĞRUDAN ilk çocuğu)
  arka planı doğrulandı: **`#949494`** — soft/orta ton gri, SİYAH DEĞİL
  (önceden `bg-heading`/#070707 kullanılıyordu). Yeni `--color-footer-bg`
  token'ı eklendi. Metin rengi BEYAZ kalıyor (kaynağın kendi başlık
  widget'ları da `uicore_white` kullanıyor — bilinçli/kaynaktan, kontrast
  düşük olsa da SOURCE'UN KENDİ tasarım kararı, "düzeltilmedi").
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız. 4 dilde
  `curl` ile 4 konu da doğrulandı — floating widget özellikle 5 farklı
  sayfa TÜRÜnde (ana sayfa, ürün, sektör, blog, KVKK/hukuki) test edildi,
  hepsinde göründüğü teyit edildi. Derlenmiş CSS'te gerçek
  `font-size:13px;font-weight:500;color:#c1272d` ve `#949494`
  değerlerinin var olduğu doğrulandı. Regresyon: `test-urunler-menu-links.mjs`
  108/108, `test-no-external-idenfit-links.mjs` 2325 dosyada 0 sorun.
  **Not:** Chrome uzantısı bu oturumda da bağlı değildi — KONU 1'in
  düzeltmesi element-ID çapraz doğrulamasıyla YÜKSEK güvenilirlikte ama
  yine de gerçek tarayıcıda pixel-perfect görsel sonuç kullanıcı
  tarafından ekran görüntüsüyle doğrulanmalı.

**[2026-07-28] Üçüncü düzeltme turu — video click-to-play+boyut, navbar
font BİREBİR kaynak değerleriyle, sitedeki tüm H2 başlıkları gerçek
ölçümle, WhatsApp ikonu yeşilden marka renklerine geri alındı.**

- **KONU 1 — Video: autoplay YOK, kutu %80 genişlikte, ikinci turda YANLIŞ
  yönde düzeltilmişti.** Canlı HTML'in video widget'ının `data-settings`'i
  doğrulandı: `"show_image_overlay":"yes"` — kaynak gerçek thumbnail + play
  butonu gösterip TIKLANINCA YouTube'u yüklüyor (autoplay yok), tıpkı
  `/musteriler/`'in video kartları gibi. `post-9.css`: video widget'ının
  kendi genişliği yalnızca `%80` (`width:80%;max-width:80%`), köşeleri
  `10px` yuvarlak, yumuşak gölgeli — **tam genişlik/full-bleed DEĞİL**.
  Önceki (ikinci) turda "full-bleed görseller" isteği bu bölüme de
  yanlışlıkla uygulanmıştı — geri alındı. **Uygulama:** ham `<iframe>`
  yerine `YoutubeClickToPlay.tsx` (zaten Müşteriler sayfasında kullanılan
  AYNI component) yeniden kullanıldı — kod tekrarı yok; kutu tekrar
  `max-w-2xl` içinde, yuvarlak köşeli/gölgeli, full-bleed kaldırıldı.
- **KONU 2 — Navbar font, BİREBİR kaynak (tahmin YOK).** `kit-9561.css`
  (global font token'ları) + `post-12302.css`'in `.elementor-item` kuralı
  satır satır okundu, sayfanın `<head>`'indeki gerçek font linkiyle
  (`elementor-gf-local-quicksand-css` — sayfada YÜKLENEN TEK font)
  çapraz doğrulandı. **KESİN DOĞRULANAN:** `font-family:"Quicksand"`
  (kit'in 4 global tipografi ön ayarının HEPSİ Quicksand —
  `Euclid Circular A` hiçbir dosyada yok), `font-size:14px` (15px değil),
  `font-weight:400`, `line-height:22px`, `letter-spacing`/`text-transform`
  kaynakta HİÇ tanımlı değil (menü etiketleri WordPress'te zaten düz
  büyük harfle YAZILMIŞ — bizim `nav.ts`'teki etiketler de öyle, görsel
  fark yok). İkinci turda kullanıcı isteğiyle eklenmiş olan 15px/uppercase/
  0.5px letter-spacing bu turda kaldırılıp gerçek değerlerle değiştirildi.
  **Yan bulgu:** global buton stili (`.elementor-button` + TÜM buton
  seçicileri) AYRI ve GERÇEKTEN `font-size:15px;font-weight:700` — önceki
  turda "15px" istendiğinde muhtemelen bu BUTON metni ölçülmüştü, nav
  LİNKLERİ değil. `.btn-cta`'ya bu doğrulanmış 15px/700 değerleri eklendi
  (Tailwind'in `@layer utilities`'i altında olduğu için düz/layer'sız
  `.btn-cta` kuralı her çağrı yerindeki eski `text-sm`/`font-semibold`
  sınıflarını otomatik geçersiz kılıyor, ayrı ayrı temizlemeye gerek
  kalmadı).
- **KONU 3 — Site genelindeki H2 başlıkları gerçek ölçümle düzeltildi.**
  Hero'nun H1'i (`post-25148.css`) BİREBİR okundu: mobil `20px`, `lg:`
  `35px`/`font-weight:600`/`line-height:45px`, `HeroSection.astro`'ya
  uygulandı. Hero paragrafının rengi kaynakta TAM OLARAK `#808080` çıktı
  — bu bizim `--color-muted` token'ımızla birebir aynı (önceden yanlışlıkla
  `text-body`/#333333 kullanılıyordu, düzeltildi), boyutu mobil `16px`/`lg:`
  `20px`. **H2 için site genelinde tekrarlanan `text-2xl font-bold
  sm:text-3xl` (24→30px) deseni** (13 component'te aynı) İKİ BAĞIMSIZ
  kaynak örneğiyle (Ana sayfanın "Neden idenfit?" H2'si VE FeatureGrid'in
  H2'si — TAM AYNI değerler: masaüstü `40px/600/48px`, kaynağın kendi daha
  küçük ekran media query'sinde `34px/40px`) karşılaştırılıp yanlış
  çıktı — gerçek değer kaynakta neredeyse 1.5× daha büyük. Yeni `global.css`
  → `.h2-section` sınıfı (34px→lg:40px, weight 600) tüm 13 call site'a
  uygulandı (`CertificationBadges`/`EfficiencySection`/`FeatureGrid`/
  `HrtechSection`/`HubPage`×2/`PanelFeatureSection`/`ProductPage`/
  `ProductSectionBlock`/`SectorPage`/`SupremaSection`/`TestimonialSection`/
  `VideoSection`) — yalnızca ana sayfa değil, ürün/sektör/hub sayfalarının
  H2'leri de kapsandı (aynı paylaşılan class kullanıyorlardı). **Dürüst
  sınır:** Elementor'da TEK bir evrensel "H2 stili" yok, her widget kendi
  override'ını taşıyabiliyor (ör. HRTech'in kendi H2'si özel olarak
  `50px/mor` — bu İKİ örnekten farklı bir istisna, dokunulmadı) — bu
  yüzden "her başlık piksel-piksel eşleşiyor" iddiası yapılmıyor, yalnızca
  DOĞRULANMIŞ, tekrar eden standart değer sistemimize taşındı.
- **KONU 4 — ⚠️ Düzeltme: WhatsApp ikonu yeşilden marka renklerine geri
  alındı.** Önceki turda WhatsApp'a kendi resmi yeşilini (`#25D366`)
  vermiştim — kullanıcı bunun yanlış olduğunu, sitenin TAMAMEN kırmızı/
  beyaz kalması gerektiğini belirtti. İkonun şekli (WhatsApp logosu)
  korundu, rengi kaldırıldı: artık beyaz zemin + kırmızı ikon/kenarlık
  (`.btn-cta`'nın outline ilkesiyle tutarlı), Telefon zaten dolu kırmızı
  zemin + beyaz ikondu (değişmedi) — iki buton görsel çeşitlilik için
  birbirinin tersi ama ikisi de yalnızca marka kırmızısı/beyaz kullanıyor.
  Site genelinde başka bir yeşil/WhatsApp referansı bulunamadı (grep ile
  doğrulandı).
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız (sayfa
  sayısı değişmedi). 4 dilde `curl` ile 4 konunun da yapısal olarak
  render edildiği (video thumbnail'i, `nav-link-text`/`h2-section`
  sınıfları, WhatsApp'ta `#25D366` YOK) doğrulandı, derlenmiş CSS'te
  gerçek `font-size:14px;font-weight:400;line-height:22px` ve
  `font-size:34px;font-weight:600;line-height:40px` kurallarının var
  olduğu teyit edildi. Regresyon: `test-urunler-menu-links.mjs` 108/108,
  `test-no-external-idenfit-links.mjs` 2325 dosyada 0 sorun. **Not:**
  Chrome uzantısı bu oturumda da bağlı değildi — CSS archaeology'si
  (kit-9561.css/post-*.css'in satır satır okunması) ile "computed style"
  eşdeğeri elde edildi; gerçek tarayıcıda pixel-perfect görsel sonuç
  kullanıcı tarafından ayrıca doğrulanmalı.

**[2026-07-28] Önceki turun 4 maddesine ikinci düzeltme turu: mor şerit
tam genişlik+konum, marquee jank düzeltmesi, WhatsApp/Ara butonları
büyütüldü, navbar font detayları.**

- **KONU 1 — Mor şerit gerçekten kısaymış, kök neden bulundu.** Önceki
  turda `border-t-[27px] border-secondary`'yi `max-w-7xl` (1280px) içeren
  `<section>`'ın kendisine koymuştum — kaynakta bu kenarlığı taşıyan
  container (`elementor-element-131cd29`) `e-con-boxed` (`--content-width:
  1440px`), yani zaten kaynakta da tam viewport değil, AMA bizim
  `max-w-7xl`'imiz kaynaktan da dar olduğu için geniş ekranlarda hem
  kaynaktan kısa hem "belirsiz" duruyordu. **Düzeltme:** şerit artık ayrı,
  bağımsız bir `<div>` — `<main>`'in kendisi paddingsiz olduğu için ek bir
  "full-bleed" hilesi gerekmeden `w-full` ile GERÇEK viewport kenarlarına
  kadar uzanıyor; üstüne `mt-8 lg:mt-12` eklenerek testimonial bölümünden
  daha ayrışık bir boşluk bırakıldı ("konumu aşağıda olmalı" bulgusu).
- **KONU 2 — Marquee'nin scroll-hide'ı titriyordu, kök neden: React
  state'i her scroll tick'inde re-render tetikliyordu.** Mantık React'ten
  (`MarqueeBar.tsx`) vanilla JS'e (`src/scripts/marquee-scroll.js`,
  projenin `scroll-reveal.js`/`faq-tabs.js` deseniyle tutarlı) taşındı —
  React reconciliation maliyeti tamamen ortadan kalktı. `MarqueeBar.tsx`
  artık `client:load` bile GEREKTİRMİYOR (salt CSS animasyonu), Header.astro'da
  hydration'sız render ediliyor. Animasyon `max-height`/`opacity` yerine
  modern `grid-template-rows` (1fr↔0fr) tekniğiyle — `#marquee-wrap`
  script tarafından `style.gridTemplateRows` mutasyonuyla kontrol ediliyor
  (React state yok, tek bir DOM property yazımı). **12px eşik** eklendi —
  gerçek bulunan neden: momentum/inertial scroll TEK bir kaydırma
  hareketinde onlarca 1-3px'lik scroll event'i üretiyor, eşiksiz haliyle
  bar bunlara tepki verip arka arkaya aç/kapa yapıp titriyordu; `lastY`
  yalnızca eşiği aşan GERÇEK yön değişiminde güncelleniyor.
- **KONU 3 — WhatsApp/Ara butonları büyütülüp renklendirildi.** `h-9 w-9`
  (36px) → `h-12 w-12` (48px), kaynağın kendi webp ikonları yerine (olası
  düşük-kontrast/renk çakışması riski) temiz inline SVG'ler: WhatsApp
  kendi marka yeşili (`#25D366`, resmi renk) + beyaz ikon, telefon site
  marka kırmızısı (`bg-brand`) + beyaz ikon (telefon ikonu, projenin
  `PresentationRequestPage.astro`'daki "Hemen Ara" ikonuyla AYNI path —
  tutarlılık), hover'da hafif yükselme + gölge artışı (`motion-reduce`
  varyantlı).
- **KONU 4 — Navbar font detayları, kaynak tekrar dikkatlice ölçüldü,
  KISMEN kullanıcının tahminiyle örtüşmedi.** `kit-9561.css` (global renk/
  font token'ları) + `post-12302.css` (`.elementor-item`) yeniden
  indirilip incelendi. **DOĞRULANAN gerçek değerler:** `font-size:14px`
  (kullanıcının 15px'i değil, ama çok yakın), `font-weight:400` (kullanıcının
  tahminiyle TAM eşleşti), `font-family` HİÇ override edilmiyor — kit'in
  varsayılanı "Quicksand" miras alınıyor (kullanıcının "Euclid Circular A"
  tahmini kaynakta yok — bizim `--font-sans`'ımız zaten Quicksand, YENİ
  BİR FONT EKLENMEDİ), `letter-spacing`/`text-transform` kaynakta HİÇ
  tanımlı değil (menü etiketleri WordPress'te doğrudan büyük harfle
  YAZILMIŞ, CSS `text-transform` değil). **Kullanıcının açık isteği
  üzerine yine de uygulanan** (kaynaktan bilinçli sapma, kalıcı bir kural
  değil, kullanıcı kararı): `font-size:15px`, `text-transform:uppercase`
  (i18n güvenliği için makul bir gerekçeyle), `letter-spacing:0.5px`.
  Yeni `global.css` → `.nav-link-text` sınıfı (tek merkezi nokta, `.btn-cta`
  ile aynı ilke) — `Header.astro`'nun düz nav linki + `MegaMenu.tsx`'in
  tetikleyici butonu + `MobileMenu.tsx`'in HEM akordeon tetikleyicisi HEM
  düz linki (kullanıcı "varsa MobileMenu'de" dedi, ikisi de bulundu)
  olmak üzere 4 call site'a uygulandı.
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız. 4 dilde
  `curl` ile 4 konunun da yapısal olarak render edildiği + dev server
  loglarının temiz olduğu doğrulandı. Regresyon: `test-urunler-menu-links.mjs`
  108/108, `test-no-external-idenfit-links.mjs` 2325 dosyada 0 sorun.
  **Not:** Chrome uzantısı bu oturumda da bağlı değildi — mor şeridin
  piksel-hassas konumu, marquee'nin gerçekten pürüzsüz olup olmadığı ve
  font değişikliklerinin görsel etkisi kullanıcı tarafından ekran
  görüntüsü/video ile ayrıca doğrulanmalı.

**[2026-07-28] Dört tasarım/UX iyileştirmesi: marquee scroll-hide, CTA
butonları yeniden tasarımı, WhatsApp/Ara ikonları, full-bleed görseller.**

- **KONU 1 — Marquee bar scroll-direction davranışı (kaynakta yok,
  bilinçli yeni özellik).** `MarqueeBar.tsx`'e `scroll` event listener
  eklendi (rAF ile throttle'lı): aşağı kaydırırken `max-height`/`opacity`
  0'a iniyor, yukarı kaydırırken veya `scrollY<=0`'da tekrar açılıyor
  (300ms `ease-in-out`, `motion-reduce:transition-none`). `<header>`'ın
  kendisi hâlâ `position:sticky` — dokunulmadı; bar'ın yüksekliği
  küçülünce altındaki nav satırı kendiliğinden `top:0`'a oturuyor, ayrı
  bir restructure gerekmedi.
- **KONU 2 — TÜM kırmızı CTA butonları merkezi `.btn-cta` sınıfına
  taşındı.** Önce `bg-brand`+`text-white` kombinasyonu taşıyan HER
  gerçek metin-CTA'sı taranıp bulundu (12 call site — Header/MobileMenu'nün
  Online Sunum Talebi'si, HeroForm/HrMaturityTest'in submit'leri,
  CustomerStories/Hub/Product/Sector'ın "Hemen Başvur"u, PricingPage'in
  öne çıkan plan CTA'sı, CalculatorAccordion'ın "Hesapla"sı, MegaMenu'nün
  ÜRÜNLER promo CTA'sı). **Kapsam dışı bırakılan (bilinçli, gerçek CTA
  değil):** ikon-rozetleri (mega-menü/mobil menünün dairesel ikon
  kutuları, metin taşımıyor), Hero'nun kırmızı arka plan paneli, Footer
  sosyal medya ikonları, Destek Talebi'nin YEŞİL butonu (kullanıcı
  istisnası). Yeni `global.css` → `.btn-cta` (beyaz zemin + kırmızı metin/
  2px kenarlık + `rounded-full`, hover'da dolgu/metin yer değiştirir,
  `:disabled` durumu da tanımlı) — Tailwind v4'ün CSS-tabanlı yaklaşımıyla
  tutarlı tek bir gerçek merkezi nokta, hem `.astro` hem `.tsx`'te
  `class`/`className="btn-cta ..."` ile kullanılıyor; boyut (padding/
  font-size) her çağrı yerinde kendi Tailwind utility'leriyle kalıyor.
- **KONU 3 — Hero formunun altına WhatsApp/telefon ikonları eklendi.**
  Bu TAM konum (Destek Talebi linkinin altı) kaynakta yok (linkin kendisi
  de sourced değil, bkz. madde 3 aşağıda) ama ikonlar/numaralar UYDURMA
  DEĞİL — idenfit.com'un HER sayfasında sağ-altta sabit duran gerçek
  WhatsApp (`wa.me/905375265307`)/Ara (`tel:02162950927`) butonlarından
  birebir alındı (gerçek görsel + gerçek numara, `HeroSection.astro`'ya
  eklendi). **Yan bulgu:** bu sabit widget'ın kendisi SİTE GENELİNDE bizde
  hiç yok — kapsam dışı bırakıldı, bkz. Açık noktalar madde 13.
- **KONU 4 — Hero kırmızı paneli + video full-bleed; Suprema zaten
  öyleydi.** Kaynak incelenince Suprema'nın (`SupremaSection.astro`)
  ZATEN tam-genişlik arka plana sahip olduğu görüldü (değişiklik
  gerekmedi). Hero'nun kırmızı paneli (kaynakta 640/640px kutulu, bilinçli
  sapma) ve Video bölümü (kaynakta `max-w-3xl` dar) `lg:` ve üstünde
  viewport'un kenarına kadar genişletildi — `calc(50%-50vw)` CSS
  tekniğiyle (child'ın containing block'u paddingsiz `max-w-7xl`/section
  olduğunda matematiksel olarak temiz çalışıyor, bkz. component'lerdeki
  kod yorumları). `lg` altında (mobil/tablet) bu kural devreye girmiyor —
  panel/video zaten doğal grid genişliğinde kalıyor, taşma riski yok.
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız (sayfa
  sayısı değişmedi). 4 dilde (TR/EN/NL/IT) `curl` ile 4 konunun da
  yapısal olarak render edildiği doğrulandı. Regresyon:
  `test-urunler-menu-links.mjs` 108/108, `test-legal-nl-consistency.mjs`
  18/18, `test-no-external-idenfit-links.mjs` 2325 dosyada 0 sorun.
  **Not:** Chrome uzantısı bu oturumda bağlı değildi — full-bleed CSS
  tekniğinin (KONU 4) pixel-perfect görsel sonucu kullanıcı tarafından
  ekran görüntüsüyle ayrıca doğrulanmalı.

**[2026-07-28] Dört tasarım ince işçiliği: HRTech üst şeridi, header menü
tipografisi, FeatureGrid +/= bağlayıcıları, KEŞFET Raporlar carousel'i.**

- **KONU 1 — HRTech Alliance bölümünün üstüne mor şerit.** Kaynak
  incelenince (`post-9.css`) bölümü saran container'ın tam genişlik bir
  arka plan DEĞİL, **27px kalınlığında `uicore_secondary` (#6F2C90,
  projemizin `secondary` moru) renkli bir üst kenarlığa** sahip olduğu
  görüldü. `HrtechSection.astro`'ya `border-t-[27px] border-secondary`
  eklendi.
- **KONU 2 — Header menü tipografisi, beklenmedik bir sonuçla.** Kaynağın
  global kit CSS'i (`kit-9561.css`) indirilip renk token'ları çözüldü:
  `uicore_primary`/`uicore_accent` = `#FF0000` (bizim `brand`),
  `uicore_secondary` = `#6F2C90`, **`uicore_body`/`uicore_headline` =
  `#000000`**. Ana nav linklerinin (`.elementor-item`) varsayılan rengi
  **SİYAH** çıktı — kırmızı yalnızca `:focus` durumunda (klavye Tab)
  devreye giriyor, hover'da bile kırmızı yok. Font boyutu 14px (bizim o
  anki `text-xs`/12px'imizden büyük). Kullanıcıya bu bulgu net bir soru
  ile iletildi; kullanıcının yanıtı net bir renk kararı içermediği için
  **kaynağa sadık, düşük riskli seçenek** uygulandı: `Header.astro`'daki
  düz linkler VE `MegaMenu.tsx`'in tetikleyici butonu `text-xs
  text-body` → `text-sm text-heading`'e çevrildi, mevcut `hover:text-brand`
  (kaynağın `:focus`'una ruhen yakın) korundu — kaynakta olmayan bir
  varsayılan kırmızı rengi İCAT EDİLMEDİ.
- **KONU 3 — FeatureGrid'e "+"/"=" bağlayıcı ikonları eklendi (önceki
  turun "eklenmedi" kararı tersine çevrildi).** Kaynakta (`post-9.css`)
  3 karta (`elementor-element-7a111a4`/`ccfc630`: `.plus-box`,
  `elementor-element-7afe023`: `.equals-box`) uygulanan bir
  `::after{content:url(plus.svg|equals.svg)}` bulundu — gerçek SVG'ler
  (24×24, siyah, `stroke-width:2.5`) indirilip birebir taşındı (1-2
  arası "+", 2-3 arası "+", 3-4 arası "="). Kaynağın kendi konumlandırması
  (`position:absolute; top:50%; right:-16%`, `transform` YOK — dikey
  ortalaması yaklaşık, mobilde ayrı/farklı bir yüzde kuralı) kırılgan bir
  hack olduğu için BİLİNÇLİ OLARAK taklit edilmedi — bunun yerine grid'e
  (yalnızca `lg:`, 4 kart tek satırdayken) kartlar arasına gerçek dar bir
  grid kolonu eklenip ikon oraya ortalanarak yerleştirildi
  (`lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]`) — aynı görsel sonuç,
  kırılgan mutlak-konumlama olmadan. `sm`/mobilde (`hidden lg:flex`)
  bağlayıcılar gizli — kaynağın mobil kuralı bizim breakpoint'lerimizle
  birebir örtüşmediği için bilinçli bir sadeleştirme.
- **KONU 4 — KEŞFET → Raporlar carousel'i geliştirildi.** `MegaMenu.tsx`'in
  `CardsRow`'u native `scrollBy({behavior:'smooth'})`'dan tam kontrollü
  bir `transform: translateX()` carousel'e çevrildi: 300ms `ease-out`
  geçiş (`motion-reduce:transition-none` ile `prefers-reduced-motion`
  desteği), kart+ok butonlarında hover efekti (hafif yükselme/büyüme +
  gölge, `motion-reduce:` varyantlarıyla), eksik olan SOL ok butonu
  eklendi (`ChevronLeft`), her iki ok da gerçek DOM ölçümüyle (`scrollWidth`/
  `clientWidth`, `resize` dinleyicili) uçlarda otomatik gizleniyor. i18n'e
  `mega.ui.prevReports` eklendi (4 dil). **Test sırasında bulunan gerçek
  bug:** `maxOffset`'in başlangıç değeri `0` olduğu için ilk render'da
  `atEnd` (offset≥maxOffset) her zaman `true` çıkıp "İleri" oku hiç
  görünmeden kalıyordu — `maxOffset` `null` (henüz ölçülmedi) olarak
  başlatılıp `atEnd`'in ölçüm tamamlanana kadar `false` sayılması
  sağlanarak düzeltildi, curl ile SSR çıktısında butonun gerçekten
  render edildiği 4 dilde doğrulandı.
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız (sayfa
  sayısı değişmedi — tasarım güncellemesi). 4 dilde (TR/EN/NL/IT)
  `curl` ile: HRTech üst kenarlığı, header nav'ın yeni `text-sm
  text-heading` sınıfı, FeatureGrid'in 3 bağlayıcı ikonu (2 "+" + 1 "="),
  ve Raporlar carousel'inin "İleri" okunun SSR çıktısında gerçekten
  render edildiği (yukarıdaki bug düzeltmesinden sonra) doğrulandı.
  Regresyon: `test-urunler-menu-links.mjs` 108/108,
  `test-no-external-idenfit-links.mjs` 2325 dosyada 0 sorun.

**[2026-07-28] Dijital İK Olgunluk Testi migrate edildi — kaynağın JS'i
taklit edilmedi, temiz baştan React ile yazıldı.** Önce kaynağın gerçek
mimarisi araştırıldı (`curl` ile 3 sayfanın da ham HTML/JS'i çekildi,
ACF'i kontrol edildi — hepsi boş, tıpkı diğer Elementor-ağırlıklı
sayfalar gibi). **Bulgular:** akış 3 AYRI WP sayfasından oluşuyor
(`/ik-dijital-olgunluk-testi/` lead-capture → `/ik-dijital-test/` 20
soruluk quiz, **önceden hiç not edilmemiş bir sayfa** → `/ik-dijital-olgunluk-testi-sonucu/`
sonuç) — üçü de TR-only. Her adımın submit'i `e.preventDefault()` ile
backend'e hiç gitmeden `sessionStorage`'a yazıp bir sonraki URL'e
yönlendiriyor; skor hesaplama TAMAMEN client-side (`result-script.js`
içinde tam algoritma açık: 20 cevap → 10 alt-grup → 5 ağırlıklı kategori
→ 0-100 skor → 4 seviyeden biri). **Tek gerçek backend bağımlılığı:**
sonuç sayfasındaki opsiyonel "raporu e-postama gönder" butonu, özel bir
WP REST route'una (`POST /wp-json/hr-maturity/generate`) istek atıp
dönen URL'i (muhtemelen PDF) yeni sekmede açıyor. **Ayrıca bulunan
tutarsızlık:** kaynağın "bir soru göster" JS mekanizması `.e-form__step`
adlı bir class'a bağımlı ama bu class raw HTML'in HİÇBİR yerinde yok
(yalnızca script'in kendi selector'ünde geçiyor, 0 eşleşme) — kaynağın
kendi step-navigasyonu curl ile doğrulanamayan/güvenilmez bir davranışa
dayanıyordu, bu yüzden kaynağın JS'i taklit edilmedi.
- **Uygulama:** `src/data/maturityTestDefinitions.ts` (20 soru + `GROUPS`/
  `CATEGORY_WEIGHTS`/`MATURITY_LEVELS` — kaynağın `result-script.js`'inden
  birebir taşınan puanlama formülü, `calculatorDefinitions.ts`'teki AYNI
  ilkeyle: ham JS import/eval edilmiyor). `HrMaturityTest.tsx` (React,
  `client:load`) — TEK sayfa, `useState` ile 3 iç adım (lead-capture/quiz/
  sonuç), `sessionStorage` YOK. Quiz adımı: bir soru bir ekranda +
  ilerleme çubuğu + Geri/İleri navigasyonu (son soruda "Testi Bitir").
  Sonuç adımı: animasyonlu dairesel skor göstergesi (kaynağın fikri, sıfırdan
  yazıldı) + seviye başlık/alt başlık/açıklama + **kategori bazlı skor
  dökümü** (5 kategori — kaynağın kendi pazarlama bölümündeki "İK Dijital
  Dönüşümünüzü 5 Kritik Alanda Netleştirin" kart başlıklarıyla birebir
  aynı isimler, uydurma değil; kaynağın result-script.js'i bunu
  GÖSTERMİYORDU ama zaten hesaplanan veriyle bilinçli bir zenginleştirme).
  "Raporu e-postama gönder" alanı bilinçli olarak devre dışı + "Yakında"
  rozetiyle işaretli (bkz. CLAUDE.md TODO madde 12).
- **Route:** `/ik-dijital-olgunluk-testi/` — yalnızca TR (KARAR 2,
  Hesaplama Araçları'yla aynı ilke), EN mevcut `en:'tr'` fallback'iyle
  (ek config gerekmedi) otomatik TR'ye yönlendiriliyor.
- **⚠️ Bulunan GERÇEK, önceden var olan bir bug (Hesaplama Araçları'nı da
  etkiliyordu):** `astro dev`'in canlı SSR yönlendirmesi `nl:'en'`+`en:'tr'`
  fallback'ini ZİNCİRLEYEREK çalıştırıyor (`curl` ile 200 görünüyordu) ama
  gerçek `astro build` çıktısında (`astro preview` ile doğrulandı — bu,
  Cloudflare Pages'in gerçekte servis edeceği davranış) ZİNCİRLENMİYOR:
  `en` hedefi kendisi de sentetik bir fallback sayfası olduğundan `nl`
  için ikinci bir statik redirect üretilmiyor, `/nl/hesaplama-araclari/`
  VE yeni `/nl/ik-dijital-olgunluk-testi/` sessizce 404 veriyordu. Bu,
  Hesaplama Araçları'nın 2026-07-24'ten beri fark edilmemiş bir açığıydı.
  **Düzeltme:** `astro.config.mjs`'in elle `redirects` haritasına her iki
  sayfa için de doğrudan TR hedefine tek-hop girdi eklendi
  (`/nl/hesaplama-araclari` → `/hesaplama-araclari`,
  `/nl/ik-dijital-olgunluk-testi` → `/ik-dijital-olgunluk-testi`) —
  `astro preview` ile yeniden doğrulandı, ikisi de artık 200 + doğru
  meta-refresh hedefi veriyor. **Ders:** bu sınıf (`fallback` zinciri)
  bir bug'ı yalnızca `astro dev` ile test etmek yeterli değil — statik
  build çıktısı `astro preview` ile ayrıca doğrulanmalı, dev server'ın
  SSR yönlendirmesi production'daki statik dosya davranışını birebir
  yansıtmıyor.
- **KEŞFET mega-menüsü:** `digitalMaturityTest` linki (önceden `href:''`
  ile ana sayfaya düşüyordu) artık `ik-dijital-olgunluk-testi`'ye bağlı.
  Site genelinde başka hiçbir "Neden İdenfit"/olgunluk testiyle ilgili
  kırık referans bulunamadı (grep ile doğrulandı) — kullanıcının
  belirttiği "yanlış giden yerler" bu tek linkti.
- **Test:** `astro check` 0 hata, `astro build` 865 sayfa hatasız (+1).
  `astro preview` ile TR/EN/NL route'ları + yukarıdaki NL düzeltmesi
  doğrulandı. Regresyon: `test-urunler-menu-links.mjs` 108/108,
  `test-legal-nl-consistency.mjs` 18/18, `test-no-external-idenfit-links.mjs`
  2325 dosyada 0 sorun. Dev server `npm run dev:clean` ile temiz
  bırakıldı — kullanıcı görsel doğrulamayı kendisi yapacak (bu oturumda
  Chrome uzantısı bağlı değildi).

**[2026-07-27] Telefon ülke kodu listesi — site geneli bug bulundu ve
düzeltildi; Destek Talebi çevirisi doğru çıktı.** Kullanıcı EN/IT'nin
Destek Talebi'nde TR kopyası kalıp kalmadığını sordu — taranınca hepsi
zaten doğru çıktı, ama tarama sırasında telefon ülke kodu seçicisindeki
(`phoneCountries.ts`) **45 ülke adının TÜMÜYLE sabit Türkçe** yazıldığı
bulundu (`PhoneCountrySelect.tsx` locale'e bakmadan gösteriyordu) — bu,
component'i paylaşan TÜM formları (Hero, PanelFeatureSection'ın 2.
formu, Online Sunum Talebi, İletişim, Destek Talebi) etkiliyordu.
**Düzeltme:** `CountryPhoneDef.name` `Record<Locale,string>`'e çevrildi,
45 ülkenin 4 dildeki gerçek adı yazıldı; `PhoneCountrySelect.tsx`'e
`locale` prop'u eklendi (liste artık aktif dile göre alfabetik sıralı).
4 dilde, hem Destek Talebi'nde hem hero formunda doğrulandı.

**[2026-07-27] Müşteriler sayfası (`/musteriler/`) baştan tasarlandı —
sistematik kaynak karşılaştırması.** Önceki turun 3 kolonlu kart grid'i
kaynakla karşılaştırılınca yetersiz çıktı. Canlı site gerçek kademeli
scroll (200px adım, WP lazy-load'ın düzgün tetiklenmesi için) ile
incelenince kaynağın gerçek yapısı ortaya çıktı:
1. Düzen 3 kolonlu grid DEĞİL, **zigzag tek-kolonlu dizilim** (görsel/
   video her müşteride sol/sağ değişiyor).
2. Görseller **DAİRESEL kırpılmış**, dikdörtgen `aspect-video` değil.
3. Videolar **tıkla-oynat** (Elementor native widget) — Femaş'ın VE
   Civil'in kaynak video kutuları kendi başına bozuk/boş çıkıyor
   (kaynağın kendi bug'ı).
4. Scroll-reveal animasyonu kaynakta yok (bizim eklediğimiz bir
   iyileştirme, sourced değil — korundu, kullanıcı zaten istemişti).
5. Parallax/motion-fx yok.
6. İstatistik rozetleri gerçek marka ikon görselleri kullanıyor (generic
   SVG değil).
7. **İçerik export'tan SONRA canlı sitede güncellenmiş:** Civil
   2600→3000 çalışan; Yatsan'ın TÜM açıklaması+alıntısı baştan yazılmış
   (yeni kişi "Müzeyyen Kıran Mergen", yeni foto, yeni ana görsel);
   Civil'in kendi ayrı ana görseli (`civil-2.png`) + ayrı "liderlik
   testimonial" bloğu olduğu keşfedildi; Doğ-Ser'in referans kişisinin
   (Cem Çolak) küçük profil fotoğrafı ilk kez görüldü.

**Uygulanan değişiklikler:** `customerStories.ts` tamamen yeniden
yazıldı (`mediaSide` left/right elle kaynaktan atandı, `media`
image/video, opsiyonel `quotePhotoUrl`, Civil için ayrı `secondary`
bloğu). Yeni `YoutubeClickToPlay.tsx` (React, `client:visible`) — gerçek
YouTube thumbnail + play butonu + tıklayınca `autoplay=1` iframe'e geçiş
(kaynağın bozuk kutusu birebir kopyalanmadı, bilinçli iyileştirme). Eski
`CustomerStoryCard.astro` silindi, yerine `CustomerStoryRow.astro`
(zigzag satır, `.reveal` korunuyor). i18n şeması genişletildi
(`secondaryStat`, `quote{text,name?,role?}`, `civilSecondary`,
`videoPlayLabel`). Yatsan'ın yeni içeriği 4 dile gerçek çeviriyle
yazıldı, Civil'in çalışan sayısı 4 dilde güncellendi, Doğ-Ser/Tuğba'nın
metne gömülü "— İsim, Rol" deseni temiz `quote` alanına taşındı.
**Test:** 4 dairesel görsel + 2 play butonu + tıklama sonrası gerçek
YouTube iframe + 4 dilde H1/istatistik render'ı doğrulandı. `astro
build` 864 sayfa hatasız (sayfa sayısı değişmedi).

**[2026-07-27] Destek Talebi sayfası (`/destek-talebi/`) migrate edildi
(3 dil) + Müşteriler sayfası zenginleştirildi (önceki tur, sonradan
KONU 1'de baştan tasarlandı).**
- **Destek Talebi:** Envanterde eksik olarak not edilmişti. Kaynak:
  `pages.json` id 16607(tr)/16688(en)/23686(it), ACF kısmen dolu, form
  alanları/KVKK metni elle transkribe edildi. Yeni `SupportRequestForm.tsx`
  (HeroForm'dan bilinçli ayrı — kaynakta gerçekten farklı stillenmiş:
  açık gri input, **YEŞİL** buton `#60A344` — sitenin kırmızı CTA
  konvansiyonunun kaynaktaki bilinçli istisnası, korundu) + telefon
  alanı HeroForm'un ülke kodu seçicisini paylaşıyor. **Bulunan gerçek
  içerik farkı:** TR'nin KVKK metni kaynakta GERÇEKTEN 2 paragraf,
  EN/IT'de yalnızca 1 — olduğu gibi korundu (uydurma 2. satır
  eklenmedi). "Kullanım Koşulları"/"KVKK" linkleri kaynakta JS popup'ıydı
  (karşılığımız yok) — projenin `getKvkkAndTermsHrefs()` desenine
  bağlandı. NL yok → `/en/support-request`'e elle redirect.
  **Önemli bulgu:** ana sayfadaki "Destek Talebi İçin Tıklayın" linki
  kaynakta da eski sitede de HİÇ YOKTU — kırık bir link değil, yeni
  eklenen bir giriş noktası (hero formunun altına eklendi).
- **Müşteriler (bu turdaki hali, sonradan KONU 1'de tamamen yeniden
  yazıldı):** scroll-reveal + hover eklendi, kare fotoğrafların
  `object-cover`→`object-contain` kırpma düzeltmesi, **Civil ve
  Yatsan'ın ayrı referans/testimonial alıntılarının** (ACF'de var ama
  hiç render edilmemiş) eklenmesi — TR'den 4 dile gerçek çeviri.

**[2026-07-27] Telefon çoklu ülke desteği + mega-menü rengi + Testimonial
Carousel animasyonu.**
1. Sabit "+90" öneki tam interaktif ülke kodu seçiciye genişletildi.
   **Kütüphane kurulmadı** (`libphonenumber-js` ~140KB, orantısız ağır) —
   `src/data/phoneCountries.ts` (45 ülke) + `PhoneCountrySelect.tsx`
   (LanguageSwitcher'daki aynı buton+liste deseni) elle yazıldı.
   Varsayılan ülke site diline göre (TR→TR, EN→GB, NL→NL, IT→IT).
   Bulunan CSS bug'ı: telefon kutusunun `overflow-hidden`'ı dropdown
   panelini kırpıyordu, kaldırıldı.
2. Mega-menü paneli `bg-surface` (beyaz) → yeni `--color-menu-surface:
   #f2f2f2` token'ı — kaynağın canlı `#mega-menu` container'ının GERÇEK
   computed rengi (Playwright ile okundu).
3. `TestimonialCarousel`'e fade+slide geçişi, CSS Grid "stack" tekniğiyle
   sabit panel yüksekliği (JS ölçüm yok), `motion-reduce:` varyantı,
   hover/focus'ta duraklayan 6sn otomatik geçiş eklendi.

**[2026-07-27] HeroForm telefon alanına giriş kısıtlamaları + validasyon
+ "+90" öneki (kütüphanesiz).** 5 madde: (1) rakam-dışı karakterler
`onChange`'de anında filtreleniyor, (2) TR format sınırı (0'lı/0'sız her
iki girdi de temiz 10 haneye normalize), (3) sabit "+90" öneki (kaynaktaki
`intl-tel-input` yerine statik — validasyon zaten yalnızca TR formatını
kabul ettiği için çok-ülkeli seçici tutarsız olurdu, bu karar sonraki
turda tam çoklu-ülke seçiciye genişletildi), (4) otomatik boşluklu
gruplama (3-3-2-2), (5) submit-öncesi validasyon (`/^5\d{9}$/`, ilk
denemeye kadar hata gösterilmiyor). HeroForm 4 sayfada paylaşıldığı için
(Hero/PanelFeatureSection/Online Sunum Talebi/İletişim) hepsi etkilendi.

**[2026-07-27] Hero paneli genişletildi + form alanları kaynağın
"dolgun" stiline çevrildi.** Kırmızı panel `grid-cols-2` (eşit 50/50) →
`grid-cols-[1fr_1.25fr]` (kaynaktan bilinçli sapma, kullanıcı talebiyle).
Form input stili: HeroForm'un kendi şeffaf/ince-kenarlıklı hali yerine,
**aynı component'i paylaşan 2. formun** (PanelFeatureSection, "Kullanıcı
Dostu Panel") kaynakta GERÇEKTEN farklı ve daha dolgun stili
(`rounded-[3px] border border-[rgba(0,0,0,0.6)] bg-white`) esas alındı —
kullanıcı 3 seçenekten bunu seçti (kaynakta iki formun farklı
stillendiği bir kaynak çelişkisiydi).

**[2026-07-27] ÜRÜNLER promo görseli büyütüldü + SEKTÖRLER'in 12 ikonu
rozet stiline çevrildi.** Promo görseli `h-24 w-24 rounded-full
object-cover` (96px, kırpıyordu) → `aspect-square object-contain`
(220px, görsel gerçek 1:1 oranıyla tam eşleşiyor, kırpma yok). SEKTÖRLER
ikonları ÜRÜNLER'in dolu marka-kırmızısı daire+beyaz ikon rozet stiliyle
tutarlı hale getirildi (masaüstü + mobil akordeon).

**[2026-07-27] ⚠️ Düzeltme — KURUMSAL promo kartının görseli üstten
kırpılıyordu.** Sabit `h-24 object-cover` görselin gerçek oranını
(900×809) bozup üst kısmı (logo/karakterler) kırpıyordu → `aspect-[900/809]
object-contain`'e çevrildi, kırpma sıfırlandı, letterbox boşluğu da yok
(oranlar birebir eşleştiği için).

**[2026-07-27] KURUMSAL mega-menüsüne promo kart eklendi — kaynakta YOK,
kullanıcının kendi görseliyle bilinçli yeni özellik.** Sağ tarafta
görsel+kategori+başlık+link (Hakkımızda'ya, kullanıcı seçimiyle).
Kullanıcının sağladığı görsel (`idenfit-image.png`, 4,2MB/2050×1842)
`sharp` ile 900px/webp q82'ye küçültüldü (~28KB, `src/assets/
kurumsal-promo-team.webp`, yerel asset — Vite pipeline'ından geçiyor).
`MegaMenu.tsx`'e üçüncü bir render modu (`promoCardMode`, 420px sabit
genişlik) eklendi, mobil akordeonda parite korundu.

**[2026-07-27] 3 görsel ince işçilik maddesi.** (1) Marquee bar
`py-2`→`py-1.5` inceltildi. (2) Hero'ya dekoratif şerit **eklenmedi** —
kaynağın derlenmiş CSS'i incelenince arkaplanının düz renk olduğu,
hiçbir shape-divider olmadığı doğrulandı (uydurma bir öğe eklenmedi).
(3) Suprema bölümüne kaynakta GERÇEKTEN var olan tilt-shape-divider bant
eklendi (üst+alt, yalnızca `lg:` üstünde — kaynağın kendi custom CSS'i
de aynı breakpoint'te gizliyor).

**[2026-07-24] ⚠️ Düzeltme — footer'ın "Gizlilik Politikası" linki YANLIŞ
sayfaya bağlanmıştı.** Kök hata: Güvenlik sayfası (`/guvenlik/`, liste)
ile Gizlilik ve Güvenlik Politikası (`/sozlesme/gizlilik-ve-guvenlik-politikasi/`,
paragraf içerikli AYRI makale) yanlışlıkla aynı sayfa sanılmıştı —
kullanıcı ikisine tıklayıp farklı olduklarını kanıtladı. Gerçek sayfa
(TR/EN/IT, `pages.json` id 16258/16265/23634) hiç migrate edilmemiş
çıktı, kuruldu (`LegalPage.astro` yeniden kullanıldı). NL → EN'e elle
redirect. **Ders (kalıcı):** bir linkin 404 vermemesi yetmez, varış
sayfasının GERÇEK içeriği (başlık/H1/gövde) kaynakla karşılaştırılmalı.

**[2026-07-24] Footer, canlı footer'a tam sadık hale getirildi — 5 madde.**
(1) Yukarıdaki Gizlilik Politikası düzeltmesi. (2) GENEL kolonuna eksik
6. link eklendi (`securityPolicy`). (3) Eksik/yanlış sıralı sosyal medya
ikonları düzeltildi — kaynakta 7 platform (Pinterest+Medium eklendi),
gerçek sıra: Facebook→YouTube→X→Instagram→LinkedIn→Pinterest→Medium.
(4) Uygulama mağazası rozetleri (Apple/Android, gerçek linkler)
eklendi. (5) Ödeme yöntemi ikonları (iyzico/Troy/Visa/Mastercard/Amex,
kaynağın yatay/kompakt görseli) GENEL kolonunun altına eklendi.

**[2026-07-24] ⚠️ Önceki düzeltme geri alındı — müşteri kartlarının
logosu YANLIŞ bir varsayımla değiştirilmişti.** Önceki turda "ACF
görselleri hatalı, gerçek logo değil" varsayımıyla ayrıca bulunan logo
dosyaları konmuştu — kullanıcı bunun yanlış olduğunu, orijinal
fotoğrafları istediğini belirtti, geri alındı. **Ders:** kaynak veriyi
"hatalı" varsaymadan önce kullanıcıya sorulmalı.

**[2026-07-24] KURUMSAL mega-menüsü kompakt dropdown'a çevrildi.**
4 basit link, zengin kolon içeriği yok → tam-genişlik mega-menü yerine
içerik kadar geniş (`min-w-[200px]`) küçük dropdown. Koşul: intro/promo
yok + tek kolon + `type:'links'` + `layout:'list'` — SEKTÖRLER (grid-3)
ve ÜRÜNLER/KEŞFET (çok kolonlu) etkilenmedi.

**[2026-07-24] Müşteri kartlarındaki "Video yakında" gerçek logolarla
değiştirildi; mobil hamburger menüsü zaten doğru çalışıyordu (kod
değişmedi).** Yatsan/Doğ-Ser/Tuğba kartlarındaki placeholder metin
kaldırılıp gerçek marka logoları eklendi (idenfit.com medya
kütüphanesinden bulundu). Kullanıcı mobil menünün "tüm ekranı
kapladığını" bildirmişti — kod incelenince ZATEN `w-3/4 max-w-sm` +
overlay kullandığı, Playwright ile 3 telefon boyutunda (375/360/430px)
panelin HER ZAMAN tam %75 genişlikte olduğu kanıtlandı — aktif bir hata
değildi, kod değişmedi.

**[2026-07-24] Podcastler menüden kaldırıldı — kaynakta URL'i hiç
bulunamamıştı.** Yarım/tıklanamaz bir öğe göstermek yerine tamamen
çıkarıldı; bununla birlikte tek kullanıcısı kalan `comingSoon` mekanizması
de (LinksColumn arayüzü + i18n anahtarları dahil) tamamen silindi (ölü
kod bırakılmadı). Aynı taramada bulunan Müşteriler sayfasının 3
"Video yakında" kartı FARKLI kategori sayıldı (içeriğin geri kalanı
gerçekti) — kullanıcıya raporlanıp sonraki turda gerçek logolarla
çözüldü (yukarıya bkz.).

**[2026-07-24] Görsel ince işçilik madde 1+2 — blog kartı köşe
yuvarlaklığı + hover geçişleri.** Blog kartlarının `rounded-lg`'si site
standardı `rounded-2xl`'e çevrildi. Hover geçişi taraması dosya-seviyesi
değil class-seviyesi kesin bir script'le tekrarlandı — gerçek toplam 10
instance/8 dosya (ilk rapordan farklı), bunların 7'sinin `hover:underline`
kullandığı (animasyonlanamaz, dokunulmadı) fark edildi. Detaylar
`docs/design-polish-opportunities.md`'de (madde 1-2 ✅).

**[2026-07-24] Eksikler/gelecek planlama — 2 keşif raporu yazıldı (salt
keşif, kod değişikliği yok).** `docs/remaining-work-report.md` ve
`docs/design-polish-opportunities.md` — öncelik sıralı bulgu listeleri.

**[2026-07-24] Logo gerçek kaynak SVG'siyle değiştirildi.** "idenfit"
yazısının bir font (Paytone One tahmini) DEĞİL, kaynağın kendi elle
vektörleştirilmiş SVG'si (`idenfit-logo.svg`, JSON-LD + canlı `<header>`'da
doğrulandı) olduğu bulundu. Path verisi `src/components/icons/
IdenfitLogo.tsx`'e taşındı (`fill="currentColor"` harfler için,
`var(--color-brand)` yıldız için — yıldız SVG koordinatlarına göre "i"
harfinin noktası DEĞİL, kelimenin sağ üst köşesinde bağımsız bir aksan).
Header/Footer/MobileMenu üçü de bu component'i kullanıyor. Google
Fonts'a Paytone One eklenmedi (kaynakta canlı kullanılmıyor).

**[2026-07-24] 🎉 Blog migrasyonu FAZ B — kalan ~603 yazı toplu üretildi,
618/618 tamamlandı.** `extract-blog-posts.mjs --all` bayrağı eklendi
(Map bazlı id lookup'larla performans). Toplu çalıştırmadan önce
**tag önbelleğinin eksik olduğu bulundu** (129 tag'in yalnızca ilk 100'ü
çekiliyordu, `X-WP-TotalPages` okunmadığı için 16 kullanılan tag
kayıptı) — düzeltildi, tüm sayfalar çekiliyor artık. Sonrasında
`verify-blog-posts.mjs` (yeni, 6 boyutlu tarama script'i) ile **2 yeni
gerçek bug** bulunup düzeltildi: (1) bir yazının gövdesinde ara-başlık
için yanlışlıkla kullanılan `<h1>` — yeni `downgradeStrayH1sToH2()` bunu
genel olarak `<h2>`'ye indiriyor; (2) bir linkin URL'i kopyala-yapıştır
hatasıyla kendi içinde ikiye katlanmıştı — `toRelativePath()` artık
`https://idenfit.com`'un SON occurrence'ını arayarak genel olarak
düzeltiyor (bu, `test-no-external-idenfit-links.mjs`'in `astro build`
sonrası tam taramasıyla yakalandı, dev-server bazlı `verify-blog-posts.mjs`
href içeriğine bakmıyor — ikisi farklı şeyleri yakalıyor, ikisi de
gerekli). **Nihai:** 618 yazı, 6,2MB `posts.json`, 52 sayfalama sayfası.
**Test:** 618/618 sayfa 200, 617/617 görsel 200, 0 kalıntı H1, 0 kategori
tekrarı; `astro build` 858 sayfa hatasız; `test-no-external-idenfit-links.mjs`
2306 dosyada 0 sorun (düzeltmeden önce 1 gerçek sorun yakalamıştı).

**[2026-07-24] Blog tasarımı FAZ A — sidebar, okuma süresi, 2 kolonlu
düzen.** Kaynağın gerçek yapısı (tek kolon yatay kart + sağ sidebar +
"Benzer Yazılar" tam genişlik altta) `BlogSidebar.astro` (Popüler
İçerikler = son 5 yazı, kaynakta da gerçek popülerlik metriği değil;
Yaklaşan Etkinlikler = kategori filtresi) ile kuruldu. **"Kategori rozeti
tekrarı" kullanıcı bulgusu araştırılınca kaynağın KENDİ bug'ı çıktı**
(idenfit.com'un kendisi dedupe yapmıyor, biz zaten yapıyorduk) — kaynak
kopyalanmadı, yalnızca "tüm kategorileri göster" davranışı (dedupe'lı
haliyle) eklendi. "X dakikalık okuma" (`estimateReadingMinutes()`, 200
kelime/dk) Yoast'ın rakamıyla birebir örtüştüğü doğrulandı.

**[2026-07-24] Blog migrasyonu ADIM 1 — pilot onaylandı + 14 çeşitlilik
yazısı işlendi (toplam 15/618).** Script'te 3 gerçek bug bulunup
düzeltildi: boş excerpt (`stripEmptyParagraphs()`), bağlamsız kısa
excerpt (100 karakter eşiği eklendi), dosya-adından-üretilmiş anlamsız
alt metni (`looksAutoGeneratedFromFilename()`). İç link çözümleme
(`resolveInternalLinks()`/`toRelativePath()`) `/tr/` önekli ve öneksiz
mutlak linkleri + Online Sunum Talebi CTA'sının ham slug'ını + TOC
fragment linklerini kapsayacak şekilde genelleştirildi. Yapısal
(`&amp;` vb.) ile tipografik entity çözümü ayrıştırıldı (UTM query
string'lerindeki `&amp;`'in yanlışlıkla `&`'e çözülmesini önledi).
Rank Math TOC'unun tekrarlı heading id'si `dedupeHeadingIds()` ile
düzeltildi.

**[2026-07-24] Blog migrasyonu başladı — Content Collection altyapısı +
1 pilot yazı.** `src/content.config.ts` (Astro 6+'da zorunlu konum,
eski `src/content/config.ts` kaldırılmış) + `file()` loader ile
`posts.json` okunuyor. `fetch-blog-taxonomy.mjs` (kategori/tag id→isim
önbelleği) + `extract-blog-posts.mjs <slug...>` (TOPLU DEĞİL, slug
bazlı — kasıtlı sürtünme). Sayfalar: `blogContent.ts` + `BlogListPage.astro`
+ `blog/[slug].astro`. Kaynak veri temizliği: yinelenen H1 kaldırma,
kendi excerpt üretimi, kategori isim-bazlı dedupe.

**[2026-07-24] Blog öncesi 4 küçük düzeltme.** Dijital İK Olgunluk Testi
linki geçici olarak ana sayfaya yönlendirildi (bkz. Açık noktalar #11).
EN/IT→TR `i18n.fallback` eklendi (Hesaplama Araçları için). ÜRÜNLER
promo panelinin gerçek görseli bulundu (ayrı Elementor header template
parçasında). Donanım ikonunun soluk rengi kaynak-doğrulandı (kaynağın
kendi tutarsızlığı, bug değil) — kullanıcı kararıyla yine de marka
rengine çevrildi.

**[2026-07-23] Hesaplama Araçları — 2 küçük düzeltme.** Hero
illüstrasyonu (`header-bg-2x.png`) sayfaya özel derlenmiş Elementor CSS
dosyasında bulunup eklendi. Akordeon varsayılan durumunda gerçek bir bug
bulundu: script yalnızca hash VARSA açıyordu, hash kalkınca KAPATMIYORDU
— artık her çağrıda tüm akordeonlar hash'e göre yeniden senkronize
ediliyor.

**[2026-07-23] Vite bağımlılık önbelleği bozulması — kalıcı çözüm
(3 araştırma turu).** Tekrarlayan "navbar/modüller kayboldu, `_jsxDEV is
not a function`" sorunu (bilinen Astro/Vite hatası, withastro/astro#15952)
üç ayrı tetikleyiciye sahip çıktı: (1) `npm install`/`uninstall` dev
server açıkken çalıştırılması, (2) Vite'ın lazy dependency discovery'si
o oturumda ilk kez ziyaret edilen bir sayfada canlı yeniden-optimize
tetiklemesi, (3) `astro.config.mjs`'in dev server açıkken düzenlenmesinin
Astro'nun kendi "soft restart"ını tetikleyip AYNI bug'a düşmesi (en
kötüsü — restart "tamamlandı" dese bile React modülü bozuk kalabiliyor,
kendi kendine düzelmiyor). **Kalıcı çözüm — kod + disiplin:**
`astro.config.mjs`'e `vite.optimizeDeps.force:true` +
`include:['react','react-dom','react-dom/client','lucide-react']`
eklendi (1. ve 2. tetikleyiciyi kapatır); `entries` ile tüm proje
dosyalarını tarama YÖNTEMİ denenip TERK EDİLDİ (bir yorumdaki kod-benzeri
metin taramayı `[PARSE_ERROR]`'a düşürdü). 3. tetikleyici için tam kod
çözümü yok — **kalıcı kural: `npm install`/`uninstall` VEYA
`astro.config.mjs` değişikliğinden SONRA mutlaka `npm run dev:clean`
(tam process kill+restart) çalıştırılmalı, Astro'nun otomatik
soft-restart'ına GÜVENİLMEMELİ** (bkz. §Proje kuralları — bu artık
zorunlu bir adım, tekrar açıklanmıyor).

**[2026-07-23] Hesaplama Araçları sayfası (`/hesaplama-araclari/`)
gerçek içerikle kuruldu — 8 hesap makinesi, TAMAMEN client-side.**
Yalnızca TR'de var (KARAR 2 kapsamında EN/IT ertelendi). Metin içeriği
`extract-calculators.mjs` ile, form alanları+formüller kaynağın jQuery
kodundan elle `calculatorDefinitions.ts`'e taşındı (ham JS import
edilmedi). Yıl-bağımlı sabitler (`YEAR_CONSTANTS`) tek yerde toplandı.
**Bulunan gerçek bug:** ilk sürüm `calculate`/`visibleWhen`
FONKSİYONLARINI içeren tam nesneyi prop olarak geçiriyordu — Astro'nun
SSR→client JSON serileştirmesi fonksiyon taşıyamadığı için hydration
mismatch oluşuyordu; düzeltme: yalnızca `slug` (string) prop, tanım her
iki tarafta da kendi import'undan çözülüyor. KEŞFET menüsünün
"Hesaplamalar" kolonu 8 aracın kendi anchor'larına bağlandı + anchor'a
gelince ilgili akordeonu otomatik açan script eklendi. 6/8 araç elle
hesaplanan değerlerle doğrulandı, hepsi eşleşti.

**[2026-07-23] Teşekkürler sayfası (`/tesekkurler/`) migrate edildi
(TR/EN/IT, NL yok).** Online Sunum Talebi formu sonrası gösterilen
sayfa — ACF tamamen boş, içerik Elementor `content.rendered`'dan elle
transkribe edildi (`thankYouContent.ts`). **Bulunan kaynak veri hatası:**
EN/IT'de "Why idenfit?" linkinin metni doğru ama hedefi yanlışlıkla
Müşteriler sayfasına gidiyordu — ham href'e güvenilmeyip
`getWhyIdenfitSlug()` ile doğru hedefe bağlandı. NL → `/en/thanks`'e
elle redirect. **Form gönderiminden bu sayfaya otomatik yönlendirme
YOK** (Faz 2 TODO'su, bkz. Açık noktalar #2).

**[2026-07-23] `app.idenfit.com` CTA'ları aynı sekmede açılacak şekilde
düzeltildi.** Fiyatlar'ın Mikro/KOBİ CTA'ları yanlışlıkla `target="_blank"`
alıyordu. Kök neden: `external` alanı hem "URL dönüştürülmedi" hem "yeni
sekmede aç" anlamına geliyordu — bunlar farklı şeyler. Yeni `newTab`
alanı eklendi (`SAME_TAB_EXTERNAL_HOSTNAMES`: `app.idenfit.com` dış link
ama `newTab:false`; workmana.com/HRTech Alliance gibi gerçek dış siteler
`newTab:true` kalır).

**[2026-07-23] 🎉 Site denetim raporu tamamen kapandı (14/14 madde).**
Kalan 2 Orta madde: Güvenlik sayfasının `<title>`/description'ı sektör
sayfasıyla çakışıyordu → `getSecurityMeta()` ile sayfanın gerçek
içeriğinden türetilmiş 3 dilde zengin meta eklendi (H1 kısa etiket
olarak kasıtlı kaldı). **Sonuç: 11 madde düzeltildi, 1 madde (Turizm
IT'nin boş H1'i) kullanıcı kararıyla bilinçli bırakıldı, 2 madde zaten
aksiyon gerektirmiyordu.**

**[2026-07-23] Site denetim raporunun Kritik 3 + Yüksek 6 maddesi
düzeltildi.** Özet: Fiyatlar CTA'ları (`resolveCtaUrl()` paylaşıldı,
hostname tam `idenfit.com` değilse dış link sayılıyor) → Footer ÜRÜNLER
kolonu (8×4=32 link düzeltildi) → mobil menü akordeonu gerçek
tıklanabilir hale getirildi (**bulunan bug: `backdrop-blur` içeren
`<header>`, altındaki `position:fixed` overlay'in containing block'unu
bozuyordu — `createPortal` ile `document.body`'ye taşındı, bu artık
kalıcı bir proje kuralı, bkz. §Mimari**) → 2 İK hub sayfasının NL
switcher'ı düzeltildi → Suprema/Video bölümlerinin hardcoded slug'ları
`getHardwareSlug()`/`getWhyIdenfitSlug()`'a bağlandı → Şirket
Takvimi/Sağlık/Özlük Dosyası'nın kırık TR/IT görselleri (yanlış
kopyalanmış Türkçe karakterli dosya adları) düzeltildi → Gıda/Hizmet
sektörlerinin IT başlığı (kaynakta WP editör placeholder metni
"Contenuti della Pagina" kalmıştı) gerçek İtalyanca'yla düzeltildi.

**[2026-07-22] KVKK/hukuki sayfalar + dış link taraması + FAQ entity
hatası.** `localeUrlsFor()` NL fallback'i düzeltildi. Site geneli dış
link taraması (`test-no-external-idenfit-links.mjs`, o zamandan beri
her turda regresyon testi olarak kullanılıyor) 1 gerçek bug buldu
(`bareSlugFromUrl()`'ün baştaki `#` karakterini temizlememesi). Numerik
HTML entity'leri (`&#8217;` vb.) `decodeEntities()` genelleştirilerek
düzeltildi.

**[2026-07-22] 6 kritik hata bulundu ve düzeltildi.** Hero formunun
KVKK onay metni gerçek kaynağa bağlanmamıştı → `getKvkkAndTermsHrefs()`
eklendi. Hero'nun sağ kolon görseli placeholder'dı → gerçek ACF görseli
eklendi. **KVKK sayfası hiç migrate edilmemişti** → TR/EN/IT kuruldu.
**"Online Sunum Talebi" CTA'sı — sitenin en kritik butonu — 404
veriyordu** → `PresentationRequestPage.astro` ile route'landı (canonical
slug `online-sunum-talebi`, `localizeCtaUrl()` kullanan HER CTA otomatik
düzeldi). **Fiyatlar sayfası hiç migrate edilmemişti** → 4 dilde
kuruldu. "Modüller" ayrı sayfa değil, aynı Fiyatlar slug'ına gidiyor.

**[2026-07-22] SSS dil değiştirici + Hakkımızda migrasyonu.** SSS'in NL
switcher hedefi düzeltildi. Hakkımızda hiç migrate edilmemişti → 4 dilde
kuruldu (EN tarihçesi TR'den çevrildi, IT tamamen EN kopyasıydı, gerçek
çeviri yazıldı).

**[2026-07-22] SSS sayfası yeniden tasarlandı (accordion→sekmeli) +
KURUMSAL 4/4 tamamlandı.** SSS artık kaynağın gerçek tasarımı (sol
kategori butonları + sağda açık liste + PDF). KURUMSAL'ın eksik 2 linki
+ 4 yeni sayfa grubu kuruldu: İletişim (4 dil, NL dahil), Tüketici
Hakları Sözleşmesi, Mesafeli Satış Sözleşmesi, Güvenlik, Hedef Global
Marka, Neden İdenfit (TR/EN/IT + gerekenlerde 4 dil). **Bulunan bug:**
Astro'nun otomatik `i18n.fallback`'i per-locale slug'ı farklı sayfalarda
kırık redirect üretiyordu → `astro.config.mjs`'e elle `redirects`
eklendi. **Kural: per-locale slug'lar farklıysa ve bir locale'de sayfa
yoksa, otomatik fallback'e güvenilmeden bare-path eşleşmesi doğrulanmalı.**

**[2026-07-22] Footer alt bar düzeltmesi + SSS/`faq` CPT kurulumu.**
Kaynakta olmayan `terms` linki kaldırıldı, `privacy` gerçek slug'a
düzeltildi. SSS içeriğinin ayrı bir **`faq` custom post type**'ta (90
kayıt, NL yok) olduğu keşfedildi, çekilip route'landı.

**[2026-07-22] Ana sayfa TAMAMLANDI — 12/12 bölüm.** Hero→LogoStrip→
Divider→Video→FeatureGrid→Divider→Efficiency→PanelFeature(2. form)→
Suprema→CertificationBadges→TestimonialCarousel→HRTech Alliance.
~~Kaynağın dekoratif "+"/"=" bağlayıcı ikonları bilinçli olarak
eklenmedi~~ — **eklendi (2026-07-28), bkz. §Tamamlanan işler "KONU 3".**
Suprema linki kaynaktaki boş alt sayfalar yerine
gerçek `/donanim/`'e gidiyor (kullanıcı kararı). **Kritik mimari not:
bu sitede 4 ayrı `index.astro` dosyası var** (dinamik route değil) — bir
bölüm eklenirken 4 dosyanın da elle güncellenmesi gerekir.

**[2026-07-22] ÜRÜNLER mega-menüsü TAMAMEN KAPANDI (108/108 link doğru).**
2 İK hub sayfası "Genel Bakış" linki olarak kolonların üstüne eklendi.
Donanım sayfası (`/donanim/`) tek sayfa + 7 blok/anchor olarak kuruldu
(bulunan bug: anchor linklerine trailing slash ekleniyordu, `lWithHash()`
ile düzeltildi). 20 ürün modülünün linkleri per-locale slug'lara
bağlandı (önceden TR slug varsayımıyla hardcoded'du).

**[2026-07-21] Puantaj (6. ACF şeması) + 2 İK Hub sayfası tamamlandı —
KARAR 3 kapandı (21 sayfa grubu, tamamı).** Puantaj standart şemalara
uymuyordu, `extractSchemaE()` eklendi. 2 hub sayfası standart
`section_N_*` düzenine uymuyordu, `HubPage.astro`/`hubContent.ts`
mimarisi kuruldu — kaynak veri hataları (yetim CTA'lar, migrate
edilmemiş modüle işaret eden tile) **uydurma veriyle doldurulmadı**,
bilinçli olarak atlandı/kaldırıldı.

**Üç kalıcı karar (2026-07-21):**
- **KARAR 1 — gerçek çeviri kuralı.** Bir dilin içeriği eksik/boş/başka
  dilin kopyasıysa, TR kaynaktan gerçek profesyonel çeviri üretilir —
  ham kopyalama/boş bırakma kabul edilmez. (Mimari detay: §Mimari —
  "Ürün/modül çeviri override sistemi".)
- **KARAR 2 — kaynakta olmayan çeviriler için yeni sayfa üretimi
  ERTELENDİ**, ekiple netleşmeyi bekliyor (bkz. Açık noktalar #1).
- **KARAR 3 — hiçbir modül kapsam dışı bırakılmayacak.** Özel yaklaşım
  gerektirenler dahil 12 modülün tamamı migrasyon kapsamında tutuldu
  (yukarıdaki maddeyle kapandı).

**[2026-07-21] 7 "temiz" modül üretildi (28 sayfa):** Doküman, Masraf,
Mesaj, Zimmet, Servis/Shuttle, Özlük Dosyası, Eğitim. KARAR 1 geriye
dönük uygulandı (birkaç modülün IT'si EN kopyasıydı, Zimmet'in EN/IT'si
ham Türkçeydi — çevrildi).

**[2026-07-21] Aşama 2.5 — 6 modül daha (Sağlık, Offboarding, Anket,
Geri Bildirim, Şirket Takvimi, Notlar), şema çeşitliliği testi.** Şirket
Takvimi'nde aynı sayfada 3 hero şemasının bir arada bulunduğu 4. bir
varyant bulundu, extraction öncelik sırasıyla otomatik çözüldü.

**[2026-07-21] Aşama 2 — Bordro, İzin, Performans, Onboarding, İşe Alım
(19 sayfa).** **Kritik keşif: modül sayfaları TEK bir ACF şeması
kullanmıyor** — 3 ek şema (A/B/C) + tutarsız alan adları bulundu,
`extract-products.mjs` bunları otomatik normalize edecek şekilde
genelleştirildi.

**[2026-07-21] Aşama 1 — PDKS pilotu (onaylandı).** İlk modül sayfası,
9 blok + 20 SSS. PDKS'in SSS'i aslında Performans modülüne ait (kaynağın
kendi hatası, KARAR 1 kapsamında olduğu gibi bırakıldı) — bu turda
`productContent.ts`/`ProductPage.astro` mimarisinin temeli atıldı.

**[2026-07-21] Müşteri Başarı Hikayeleri sayfası ilk kez kuruldu**
(sonradan 2026-07-27'de KONU 1 kapsamında tamamen yeniden tasarlandı,
yukarıya bkz.). WP'nin EN/NL/IT çevirileri düşük kaliteli makine
çevirisiydi, kullanılmadı — TR'den gerçek çeviri yazıldı.

**[2026-07-21] Sektör sayfaları — düzeltme ve gerçek içerik.** "Sektör
sayfaları WP'de hiç yok" tespiti yanlıştı — içerik ayrı bir **`sectors`
custom post type**'taydı, standart export'a dahil değildi. **Ders: bir
içeriğin "WP'de yok" sonucuna varmadan önce `wp/v2/types` ile TÜM post
type'lar kontrol edilmeli** (bu proje boyunca bu hataya bir kez daha
düşüldü — bkz. yukarıda faq CPT). 48 sayfa (12×4 dil) çekilip
route'landı; birkaç veri hatası (yanlış `slug` alanı, boş IT başlığı,
yanlış promo slug'ı) düzeltildi.

**[2026-07-21] NL içerik fallback'i kuruldu** (`i18n.fallback: {nl:'en'}`,
statik redirect — bkz. §Mimari) — KVKK/Gizlilik/Güvenlik/SSS/İletişim/
Online Sunum Talebi/Teşekkürler/Destek Talebi'nin NL'de kaynakta hiç
olmadığı tespit edilince.

**[2026-07-21] Sayfa envanteri çıkarıldı.** 170 sayfa + 618 yazı
kategorize edildi (`docs/page-inventory.md`, `scripts/page-inventory.mjs`
ile yeniden üretilebilir).

**Temel kurulum (tamamlandı, tarihsiz):** Astro + React island mimarisi,
i18n routing (tr/en/nl/it), Tailwind v4 tasarım sistemi, Header
(mega-menü + dil değiştirici + mobil menü + marquee), Hero bölümü,
Footer (4 kolon), merkezi i18n metin sistemi, WordPress export'unun ilk
analizi.

---

## Mimari (Astro + React Island Architecture)

TypeScript kullanılır. `output: 'static'` (adapter yok, Cloudflare Pages'e
statik deploy edilecek — bkz. §Deployment).

- **Statik/içerik odaklı kısımlar** `.astro` dosyaları olarak yazılır.
- **İnteraktif kısımlar** (form, slider, menü, modal, dil değiştirici vb.)
  **React** (`.tsx`) ile, hydration direktifleriyle (`client:load`,
  `client:visible`, `client:idle`) kullanılır.
- Varsayılan `.astro` tercih edilir; React yalnızca gerçek client-side
  etkileşim gerektiğinde eklenir (gereksiz JS gönderilmez).

### i18n (Astro built-in routing)
`astro.config.mjs`: `locales: ["tr","en","nl","it"]`, `defaultLocale: "tr"`,
`routing.prefixDefaultLocale: false` (TR prefix'siz `/`, diğerleri `/en/`
vb.).

**NL içerik fallback'i (mimari karar):** `i18n.fallback: { nl: 'en' }` +
`routing.fallbackType: 'redirect'`. Kaynak sitede NL'de olmayan sayfalar
için build zamanında otomatik statik redirect sayfası üretilir
(`dist/nl/<slug>/index.html` → `<meta refresh>` ile `/en/<slug>/`'e).
Middleware DEĞİL — bu proje statik build olduğu için middleware
production'da çalışmaz. Sessiz redirect (bildirim banner'ı yok) — bilinçli
UX kararı. **Önemli istisna:** per-locale slug'lar locale'ler arasında
FARKLIYSA (TR'nin bare slug'ı EN'inkiyle örtüşmüyorsa) otomatik fallback
YANLIŞ hedefe (var olmayan bir bare-path kombinasyonuna) düşüp kırık
redirect üretir — bu durumda `astro.config.mjs`'e elle `redirects` girdisi
gerekir (Tüketici Hakları/Mesafeli Satış/Güvenlik'te uygulandı).

### i18n metin sistemi (src/i18n/)
Sayfa/component metinleri koda gömülmez, merkezi tutulur:
- `src/i18n/types.ts` — `Translations` şeması (`nav`, `cta`, `hero`,
  `footer`, `mega`, `headerUi`, `customerStories` vb.).
- `src/i18n/{tr,en,nl,it}.ts` — her biri aynı şemaya uyar; bir dilde
  anahtar eksik/fazlaysa **TypeScript derleme zamanında hata verir**
  (`tr.ts` ana kaynak, `astro check` ile doğrulanır).
- `src/i18n/index.ts` — `getTranslations(locale)`.
- Astro tarafı: `const t = getTranslations(Astro.currentLocale ?? 'tr')`.
  React island'lara çeviri STRING prop olarak geçirilir (component kendi
  `getTranslations` çağırmaz).
- `src/data/nav.ts`/`navigation.ts` yalnızca YAPI (href/icon/layout) tutar;
  metin `key: keyof Translations['nav']` referansıyla i18n'den gelir.

### Veri çıkarma kuralı — `link` her zaman otoriter, `slug` değil
WP export'unda `slug` alanı birden fazla kez yanıltıcı çıktı (`hizmet-sektoru`
vs gerçek `hizmet-sektoru-ik-cozumleri`, `pdks-module-2`, `calisan-ozluk-yonetimi-modulu-2`
gibi eski/çakışan kalıntılar). **Kural: route/slug/gruplama için her zaman
`link` alanından türetilen bare slug kullanılır, WP'nin `slug` alanına asla
güvenilmez.** Tüm extraction script'leri (`extract-*.mjs`, `fetch-*.mjs`)
bu kurala uyar.

### CTA URL çözümleme — `resolveCtaUrl()`/`localizeCtaUrl()` (productContent.ts, paylaşılan)
Ham ACF CTA URL'leri locale başına tutarsız slug kullanıyor. `resolveCtaUrl(rawUrl,
locale)` bir `{ url, external, newTab }` döner (`localizeCtaUrl()` yalnızca
`.url`'ü döndüren ince bir sarmalayıcı). Dört durum:
1. **"Online Sunum Talebi" hedefi** — kaynakta 3 farklı slug (TR/EN/IT) var,
   hepsi bizim canonical slug'ımıza (`online-sunum-talebi`, `DEMO_CTA_URL`
   sentinel'i ile tanınır) çevriliyor.
   `getKvkkAndTermsHrefs()`/`getPricingSlug()` gibi tüm modüller CTA
   yazarken gerçek slug bilmek zorunda değil, sentinel yeterli.
2. **Çapraz-sektör/hub tanıtım linkleri** — ham metne güvenilmez, kendi
   veri setimiz üzerinden (bareSlug → trSlug ters-eşleme → doğru locale'in
   gerçek slug'ı) yeniden çözülür (kaynakta NL gibi bazı dillerde yanlış/
   eksik locale önekli linkler bulunmuştu).
3. **Ürün/modül sayfası linkleri** — kaynaktaki per-locale slug aynen
   taşınır (`l(bareSlug)`).
4. **Dış linkler** (hostname tam `idenfit.com` değilse) — `external:true`,
   URL dönüştürülmeden bırakılır. **`external` ≠ "yeni sekmede aç"**:
   `newTab` ayrı bir alan — `app.idenfit.com` (`SAME_TAB_EXTERNAL_HOSTNAMES`,
   kendi ekosistemimiz: kayıt/uygulama girişi) `newTab:false` alır, kaynak
   sitedeki gibi AYNI SEKMEDE açılır (Fiyatlar'ın Mikro/KOBİ CTA'ları);
   `my.idenfit.com`/workmana.com/HRTech Alliance gibi tamamen ayrı marka/
   sitelere giden GERÇEK dış linkler `newTab:true` kalır, `target="_blank"`
   alır. Tüketici olan `pricingContent.ts`/`hubContent.ts` `ctaExternal`
   (template'lerdeki `target` kararı) alanını `.external` DEĞİL `.newTab`'dan
   besler (2026-07-23 düzeltmesi — `PricingPage.astro`/`HubTileCard.astro`).

### Ürün/modül çeviri override sistemi (KARAR 1 — gerçek çeviri kuralı)
**Kalıcı kural:** bir dilin içeriği eksik/boş/başka dilin ham kopyasıysa,
TR kaynaktan gerçek profesyonel çeviri üretilir — kopyalama/boş bırakma
kabul edilmez.

`src/data/productTranslationOverrides.ts`:
```ts
interface ProductOverride {
  hero?: ProductBlock;             // ham hero'nun YERİNE geçer
  sections?: ProductBlock[];       // ham sections'ın YERİNE geçer
  appendSections?: ProductBlock[]; // ham/override sections'a EKLENİR
  faq?: ProductFaqItem[];
}
```
- **Tam değişim** (`hero`+`sections`): kaynak bir dilde tamamen yanlış/kopya.
- **Ekleme** (`appendSections`): yalnızca belirli bir blok eksik, geri kalan
  doğru.
- **Sıfırdan yeni sayfa** (kaynakta o dil hiç yoksa): `entry` (ham veri)
  olmasa bile `override.hero` doluysa içerik üretilir; slug için
  `SYNTHETIC_SLUGS` ile elle atanır (yalnızca İşe Alım NL'de kullanıldı).
- Aynı desen `miscPagesTranslationOverrides.ts` (KVKK/İletişim/Güvenlik/
  Hedef Global Marka/Neden İdenfit/Online Sunum Talebi/Fiyatlar/Hakkımızda)
  ve `hubTranslationOverrides.ts`/`hardwareTranslationOverrides.ts` için de
  kullanılır.

### ACF şema çeşitliliği (ürün/modül sayfaları)
Modül sayfaları TEK bir ACF şeması kullanmıyor — bugüne kadar **6 farklı
şema** bulundu (Şema A: `module_title`, B: `hero_title`, C: `section_title_N`
ters sıralı, D: `section_1_title`\[PDKS\], E: `product_tit`/`module_text`\[Puantaj\],
+ Şirket Takvimi'nde 3 şemanın aynı sayfada bir arada bulunduğu 4.
varyant). `scripts/extract-products.mjs` bunların hepsini regex tabanlı,
alan-adı-sabit-varsaymayan bir yaklaşımla (`collectBlockIndexFirst`/
`collectBlockFieldFirst`) otomatik tespit edip normalize ediyor; tanınmayan
bir şemayla karşılaşırsa konsola uyarı basıyor. Bilinen alan adı
tutarsızlıkları (`sectin_3_title` yazım hatası, `section_2_Text` büyük
harf, `_copy`/`_copy2..15` soneki gerçek ek bloklar olabilir) script
içinde ele alınıyor.

### Sayfa mimarisi kalıpları
- **Ürün/modül sayfaları:** `ProductPage.astro` + `ProductSectionBlock.astro`
  — hero + N içerik bloğu (veri kaynaklı sayı) + SSS (`<details>` accordion,
  KARAR 1 gereği her zaman gösterilir). Başlıklar/hero.text `set:html` ile
  render edilir (TR kaynağındaki `<b>` gibi ham HTML kaçmasın diye).
  Genelde **statik `.astro` dosyaları** (4 dil × 1 dosya), `getStaticPaths()`
  tabanlı dinamik route DEĞİL — bu, onaysız sayfa üretimini mimari olarak
  engelliyor.
- **Sektör sayfaları:** `SectorPage.astro` + `SectorFeatureCard.astro`,
  `getStaticPaths()` ile `sectorContent.ts`'teki `listSectorSlugs()`'tan
  üretilir (48 gerçek sayfa). Modül vurgu blok sayısı veri kaynaklı (2-4
  arası, aynı sektörün farklı dillerinde bile farklı olabilir).
- **Hub sayfaları** (İK genel bakış): `HubPage.astro` + `HubTileCard.astro`
  — hero + tanıtım + N "ürün tile" (ikon+başlık+metin+CTA).
- **Ana sayfa:** `getStaticPaths()` YOK — 4 ayrı statik dosya
  (`index.astro`, `en/index.astro`, `nl/index.astro`, `it/index.astro`).
  Bir bölüm eklenirken **4 dosyanın da** güncellenmesi gerekir.
- **Tekil özel sayfalar** (Hakkımızda, İletişim, Güvenlik, KVKK, Tüketici
  Hakları, Fiyatlar, Online Sunum Talebi, Hedef Global Marka, Neden
  İdenfit, Donanım, Müşteriler, SSS): her biri kendi component'i + veri
  dosyası, `miscPagesContent.ts`/`pricingContent.ts`/`hardwareContent.ts`/
  `faqContent.ts`/`customerStories.ts` altında.
- **Dil değiştirici override'ı** (`Header.astro`'nun `localeUrls?:
  Partial<Record<Locale,string>>` prop'u): varsayılan davranış "aynı slug +
  farklı prefix" hesaplar; per-locale slug'lar GERÇEKTEN farklıysa (sektör/
  ürün/misc sayfalar) ilgili `get*LocaleUrls()` fonksiyonuyla override
  edilir. Opt-in — override verilmeyen sayfalar eski davranışta kalır.

### `position:fixed` dialog/modal/overlay kuralı (kalıcı, 2026-07-23)
`<header>` `backdrop-blur` (`backdrop-filter`) kullanıyor — CSS
spesifikasyonu gereği bu, altındaki `position:fixed` elemanlar için
containing block'u viewport yerine **header'ın kendisi** yapar (`filter`/
`perspective`/`contain`/`will-change:transform` de aynı etkiye sahiptir).
`MobileMenu.tsx`'in overlay+paneli header'ın içine nested olduğundan bu,
paneli header'ın yüksekliğine sıkıştırıyordu (bkz. §Tamamlanan işler,
2026-07-23 — kısa içerikle fark edilmiyordu). **Kural: `<header>`'ın (veya
başka bir `backdrop-filter`/`filter`/`transform` içeren atanın) altına
`position:fixed` bir dialog/modal/overlay eklenirse, `createPortal` ile
`document.body`'ye taşınmalı** (`mounted` state + `useEffect`ile SSR/
hydration uyumsuzluğu olmadan — bkz. `MobileMenu.tsx`'teki uygulama).

### Footer (src/components/Footer.astro, src/data/footer.ts)
4 kolon (marka/iletişim/sosyal + HAKKINDA 6 link + ÜRÜNLER 8 link + GENEL
6 link) + alt bar (copyright + Gizlilik Politikası + KVKK). Yapı `footer.ts`'de,
metin i18n'de. Per-locale slug'ı generic `l(slug)`'la çözülemeyen anahtarlar
(`contact`/`security`/`globalBrand`/`faq`/`consumerRights`/
`distanceSalesAgreement`/`pricing`/`kvkk`/`story` vb.) `SPECIAL_HREFS`
haritasından çözülür. Sosyal ikonlar (LinkedIn/X/Instagram/YouTube/
Facebook) inline SVG, client JS göndermez.

### Blog dil stratejisi (mimari karar)
Tüm blog yazıları Türkçe (618 yazı, sadece TR). Diğer dillerdeki
sayfalardan da blog linki görünür ama içerik otomatik çevrilmez, Türkçe
gösterilir. Blog listesi/tekil yazı sayfaları dil-nötr tek yapıda tutulur
(`src/pages/blog/`, locale prefix'i yok — TR'nin prefix'siz URL alanına
zaten oturuyor). `/en/blog/`, `/nl/blog/`, `/it/blog/` (ve tekil yazı
eşdeğerleri) `i18n.fallback`'in `en:'tr'`/`it:'tr'`/`nl:'en'` zinciri
sayesinde otomatik olarak bare TR sayfasına redirect olur — blog için
ayrıca bir kod yazılmadı, bu genel mekanizmanın doğal bir sonucu.

### Blog Content Collection (astro:content, ilk kullanım — 2026-07-24)
Blog, projenin geri kalanındaki `get*Content()` + düz `.ts` deseninden
BİLİNÇLİ olarak FARKLI bir yaklaşım kullanır: Astro Content Collections
(618 kayıt ölçeğinde built-in şema doğrulama/tip güvenliği/sayfalama
avantajı için). Yapı:
- `src/content.config.ts` — koleksiyon şeması (zod). **Dikkat:** Astro 6+'da
  eski `src/content/config.ts` konumu tamamen kaldırıldı
  (`LegacyContentConfigError`) — yeni/zorunlu konum `src/content.config.ts`
  (src kökünde, `content/` klasörünün YANINDA, İÇİNDE değil).
- `src/content/blog/posts.json` — asıl veri, `file()` loader ile okunuyor.
  `scripts/extract-blog-posts.mjs <slug1> [slug2 ...]` ile üretilir/güncellenir
  — TOPLU bir "hepsini işle" modu YOK (`--all` bayrağı toplu koşum için var,
  ama günlük iş akışı yine de gözden geçirmeli kalıyor).
  `scripts/fetch-blog-taxonomy.mjs` önce bir kez çalıştırılıp kategori/tag
  id→isim eşlemesini önbelleğe alır (`reference/wordpress-export/blog-{categories,tags}.json`,
  `X-WP-TotalPages` header'ı okunarak TÜM sayfalar çekilir).
- `src/data/blogContent.ts` — sayfa-tipinden bağımsız yardımcılar
  (`getAllBlogPosts`/`paginate`/`formatBlogDate`/`getRelatedPosts`).
- Sayfalar: `src/pages/blog/index.astro` (liste, sayfa 1) +
  `src/pages/blog/page/[page].astro` (2+, **kasıtlı olarak** `/blog/[slug]/`
  ile aynı dizin seviyesinde bir `[page]`/`[slug]` route çakışması riskini
  baştan elemek için ayrı bir `page/` alt yoluna konuldu) +
  `src/pages/blog/[slug].astro` (tekil yazı).
- İçerik gövdesi (Gutenberg HTML) `set:html` ile render edilir (proje
  genelindeki `hero.text` deseniyle aynı ilke) — `@tailwindcss/typography`
  eklentisi eklenmedi, h2/h3/p/ul/ol/a Tailwind arbitrary child selector'larla
  (`[&_h2]:...` vb.) stillendirildi.

---

## Sayfa/İçerik envanteri

Detaylı tablo/liste: **`docs/page-inventory.md`** (170 sayfa + 618 yazı,
kategorize + önceliklendirilmiş; `node scripts/page-inventory.mjs` ile
yeniden üretilebilir).

**Sayfalar (170):** A-KRİTİK 126 (Ana Sayfa/Hakkımızda/İletişim/Fiyatlar/
KVKK-Gizlilik-Sözleşmeler/Online-Sunum-Talebi-CTA/Ürün-Modül — 89 modül
sayfası), B-ÖNEMLİ 34, C-İKİNCİL 3, D-DÜŞÜK 7. Bu kategorilerin migrasyon
durumu için §"Tamamlanan işler — özet günlüğü"ne bakın (çoğu artık
tamamlandı).

**Blog (618 yazı):** ✅ TAMAMLANDI (2026-07-24) — tümü `/blog/<slug>/`
altında yayında, `verify-blog-posts.mjs` ile doğrulandı. Detaylar için
§"Tamamlanan işler" — "🎉 Blog migrasyonu FAZ B".

**Sektör sayfaları — per-locale gerçek slug tablosu** (TR slug soldaki
sütun, `SECTOR_ITEMS`'takiyle birebir; EN/NL/IT `link` alanından):

| Sektör (TR) | EN | NL | IT |
|---|---|---|---|
| gida-sektoru-ik-cozumleri | food-and-beverages-sector-hr-solutions | eten-dranken | soluzioni-hr-settore-alimentare-bevande |
| guvenlik-sektoru-ik-cozumleri | security-sector-hr-solutions | beveiliging | soluzioni-hr-settore-sicurezza |
| hizmet-sektoru-ik-cozumleri | service-sector-hr-solutions | dienstverlening | soluzioni-hr-settore-servizi |
| turizm-sektoru-ik-cozumleri | tourism-sector-hr-solutions | toerisme | soluzioni-hr-settore-turismo |
| perakende-sektoru-ik-cozumleri | retail-sector-hr-solutions | detailhandel | soluzioni-hr-settore-retail |
| enerji-sektoru-ik-cozumleri | energy-sector-hr-solutions | energie | soluzioni-hr-settore-energia |
| saglik-sektoru-ik-cozumleri | health-sector-hr-solutions | gezondheid | soluzioni-hr-settore-sanitario |
| egitim-sektoru-ik-cozumleri | education-sector-hr-solutions | onderwijs | soluzioni-hr-settore-istruzione |
| tesis-yonetimi-ik-cozumleri | facility-management-sector-hr-solutions | facilitair-beheer | soluzioni-hr-settore-facility-management |
| sanayi-otomotiv-ik-cozumleri | industry-automotive-sector-hr-solutions | industrie-automotive | soluzioni-hr-settore-industria-automotive |
| hukuk-danismanlik-burolari-ik-cozumleri | law-consultancy-offices-sector-hr-solutions | advocaten-consultancykantoren | soluzioni-hr-settore-legale-consulenza |
| dagitim-lojistik-ik-cozumleri | logistics-and-distribution-sector-hr-solutions | logistiek-distributie | soluzioni-hr-settore-logistica-distribuzione |

**Ürün/modül sayfaları — per-locale slug'lar (özet):** tüm gerçek slug'lar
`src/data/productContent.ts` + ilgili `src/pages/*.astro` dosyalarında
tanımlı; kaynak: `reference/wordpress-export/products.json`. 21 sayfa
grubu (18 modül + Puantaj + 2 hub) tamamlandı, tam liste için ilgili route
dosyalarına veya `products.json`'a bakın.

**Diğer tekil sayfaların route'ları:** KVKK (`kisisel-verilerin-korunmasi`
/`data-use-policy`/IT kendi slug'ı, NL→EN redirect), Online Sunum Talebi
(`online-sunum-talebi`, 4 dilde AYNI slug), Fiyatlar (`fiyatlar`/`pricing`/
`prijzen`/`prezzi`), İletişim (`iletisim`/`contact`/`contatti`/`mededelingen`),
Tüketici Hakları/Mesafeli Satış/Güvenlik/Gizlilik ve Güvenlik Politikası
(TR/EN/IT, NL→EN elle redirect — Güvenlik `guvenlik`/`security-policy`/
`politica-di-sicurezza` LİSTE sayfası; Gizlilik ve Güvenlik Politikası
`sozlesme/gizlilik-ve-guvenlik-politikasi`/`en/contract/privacy-and-security-policy`/
`it/contratto/politica-privacy-e-sicurezza` — AYRI, paragraf içerikli
makale sayfası, ikisi birbirine karıştırılmamalı),
Hedef Global Marka/Neden İdenfit (4 dil), Hakkımızda (`hakkimizda`/`about`/
`over`/`chi-siamo`), SSS (`sss`/`faq`/`faq`, NL→EN fallback), Donanım
(`donanim`/`hardware`/`hardware`/`hardware`, tek sayfa + anchor'lar),
Müşteriler (`musteriler`, 4 dilde aynı slug), Destek Talebi
(`destek-talebi`/`support-request`/`richiesta-supporto`, NL→EN elle
redirect — 2026-07-27'de eklendi), Dijital İK Olgunluk Testi
(`ik-dijital-olgunluk-testi`, yalnızca TR — KARAR 2, Hesaplama
Araçları'yla aynı slug altında EN'e + elle NL redirect'ine sahip —
2026-07-28'de eklendi).

---

## Tasarım sistemi (Tailwind CSS)

Renk paleti ve fontlar idenfit.com'un Elementor global kit'inden (kit
9561) birebir alındı; placeholder değildir.

### Renk paleti
| Token (Tailwind) | Hex | Kullanım |
|---|---|---|
| `brand` | `#FF0000` | Ana marka rengi — CTA butonları |
| `brand-light` | `#FFF2F2` | Açık kırmızı zemin/vurgu |
| `secondary` | `#6F2C90` | İkincil (mor) vurgu |
| `heading` | `#070707` | Başlıklar |
| `body` | `#333333` | Paragraf gövde metni |
| `muted` | `#808080` | İkincil/meta metin |
| `surface` | `#FFFFFF` | Arka plan |
| `menu-surface` | `#F2F2F2` | Mega-menü panel zemini (kaynaktan, 2026-07-27) |

Not: Paragraf gövdesi için kit'in açık grisi (`#808080`) yerine
okunabilirlik/WCAG kontrastı için `#333333` seçildi; `#808080` yalnızca
`muted` metin için.

### Font
**Quicksand** (Google Fonts) — başlık ve gövde dahil her yerde
(`Layout.astro` head'inde `preconnect` + `<link>`). Fallback:
`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
Tailwind utility: `font-sans`. **İstisna: "idenfit" logosu bir font
DEĞİL** — `src/components/icons/IdenfitLogo.tsx`, kaynağın kendi elle
vektörleştirilmiş SVG'sinden (`idenfit-logo.svg`) birebir çıkarılmış path
verisi (bkz. §"Tamamlanan işler" — "Logo" günlüğü, 2026-07-24).

### Tipografi ölçeği — gerçek ölçülen değerler (2026-07-28, dördüncü tur)
Aşağıdaki değerler TAHMİN DEĞİL — idenfit.com'un derlenmiş Elementor
CSS'inden (`kit-9561.css` global tipografi token'ları + sayfa/widget'a
özel `post-*.css` kuralları) satır satır okunarak doğrulandı (Chrome
uzantısı bu tur da bağlı değildi, gerçek "computed style" yerine CSS
archaeology'si kullanıldı — ayrıntı için §Tamamlanan işler). **Kesin
sonuç: kaynak sitede TEK yüklenen font "Quicksand"** (kit'in 4 global
tipografi ön ayarının HEPSİ Quicksand; `elementor-gf-local-quicksand-css`
linkiyle doğrulandı) — `Euclid Circular A` hiçbir CSS dosyasında,
hiçbir `@font-face`'te yok, bizim `--font-sans`'ımız zaten doğruydu.
**⚠️ Nav linkleri satırı dördüncü turda düzeltildi** — üçüncü turdaki
14px/400/siyah değerleri element-ID çapraz doğrulamasıyla YANLIŞ CSS
dosyasından (`post-12302.css`, gerçek nav widget'ına (`5b6c029`) ait
DEĞİLMİŞ) okunduğu anlaşılınca `post-9695.css`'teki (gerçek header,
`data-elementor-id="9695"`) doğru kuralla değiştirildi — bkz. §Tamamlanan
işler, "KONU 1" (dördüncü tur) için tam kök-neden anlatısı.

| Öğe | Font-size | Weight | Line-height | Diğer | Kaynak/sınıf |
|---|---|---|---|---|---|
| Nav linkleri (ÜRÜNLER vb.) | 13px | 500 | — | renk `#C1272D` (tuğla-kırmızısı, siyah DEĞİL); padding kaynakta `26px/16px` (uygulanmadı, `h-16` header'la çakışırdı) | `.nav-link-text` |
| Butonlar (TÜM `.elementor-button`) | 15px | 700 | 1em | letter-spacing:0, text-transform:None | `.btn-cta` |
| H1 (Hero) | mobil 20px / `lg:` 35px | 600 | `lg:` 45px | renk `#101010` (≈bizim `heading`) | `HeroSection.astro` |
| H1 alt paragrafı (Hero) | mobil 16px / `lg:` 20px | — | — | renk TAM `#808080` = bizim `muted` token'ı | `HeroSection.astro` |
| H2 (standart bölüm başlığı) | 34px / `lg:` 40px | 600 | 40px / `lg:` 48px | 2 bağımsız örnekle doğrulandı | `.h2-section` |
| Footer zemini | — | — | — | `#949494` (soft gri, SİYAH DEĞİL), metin beyaz (kaynağın kendi kararı) | `--color-footer-bg` |

**Dürüst sınır:** Elementor'da widget-bazlı override serbest olduğu için
TEK bir evrensel "H2/H3/body" kuralı yok — bazı özel başlıklar (ör.
HRTech'in 50px/mor H2'si) bu tablodaki standarttan bilinçli olarak
farklı ve dokunulmadı. Tablo, TEKRAR EDEN/DOĞRULANMIŞ kalıpları
yansıtıyor; sitedeki HER tekil metin öğesinin piksel-piksel eşleştiği
iddia edilmiyor.

### Tailwind kullanım kuralı
**Tailwind v4** (`@tailwindcss/vite` plugin). **`tailwind.config.mjs`
YOKTUR** — v4 yapılandırmayı CSS içinde yapar. Tema token'ları
`src/styles/global.css`'teki `@theme { … }` bloğunda tanımlı, otomatik
utility'lere dönüşür (`bg-brand`, `text-heading` vb.). Stil için Tailwind
utility'leri tercih edilir; token değişikliği `global.css`'teki `@theme`'de
yapılır. **Paylaşılan tipografi/buton sınıfları** (`@theme` DIŞINDA, düz
CSS olarak `global.css`'in altında tanımlı — Tailwind'in `@layer
utilities`'inden önceliklidir): `.btn-cta` (kırmızı CTA butonları),
`.nav-link-text` (ana nav menü öğeleri), `.h2-section` (standart bölüm
başlıkları) — hepsi gerçek ölçülen kaynak değerleriyle, tek merkezi
noktadan yönetiliyor.

---

## Mega-menü (src/data/navigation.ts, src/components/MegaMenu.tsx)

idenfit.com'un canlı header'ından çıkarılan veri. Kaynak dürüstlüğü:
- **ÜRÜNLER:** gerçek 6-kolonlu mega-menü (intro + 4 kategori + promo),
  ikonlar birebir kaynaktan (`src/components/icons/IdenfitIcons.tsx`).
  **27 link × 4 dil = 108 link, tamamı doğru per-locale/anchor hedefe
  gidiyor** (bkz. §Tamamlanan işler).
- **SEKTÖRLER, KURUMSAL:** kaynakta tek kolonlu basit dropdown'lar
  (ikon/promo yok) — gerçek yapıyla eşleşecek şekilde sade tutuldu.
  SEKTÖRLER'in `grid-cols-3` + lucide-react ikonları **bilinçli tasarım
  kararı** (kaynakta yok, kaynakta bağımsız bir `/sektorler/` genel bakış
  sayfası da yok/404 — ama 12 sektörün KENDİ sayfaları gerçek içerikli).
  **KURUMSAL'a 2026-07-27'de sağ tarafta bir promo kart (görsel+kategori+
  başlık+link) eklendi** — bu da kaynakta YOK, kullanıcının kendi sağladığı
  görselle (`src/assets/kurumsal-promo-team.webp`) bilinçli bir yeni özellik,
  fabrikasyon/varsayım DEĞİL (kullanıcı talimatı + kendi görseli). `promoCard`
  alanı (`MegaMenuContent.promoCard`, `ReportCard` şeması) — `MegaMenu.tsx`'te
  üçüncü bir render modu (`promoCardMode`, 420px'lik orta-boy `<li>`-anchored
  dropdown). Detay için bkz. §"Tamamlanan işler" (2026-07-27 günlüğü).
- **KEŞFET:** kaynakta blog-kartı ağırlıklı karmaşık bir içerik merkezi;
  bilinçli olarak sadeleştirildi (yalnızca URL'si doğrulanmış öğeler).
  Şema: `MegaMenuColumn` üç tipten biri — `'links'` (sade liste + opsiyonel
  `comingSoon` metni), `'sublist'` (tek "gör tümü" linki + alt öğeler, hepsi
  aynı hedefe), `'cards'` (yatay kaydırmalı görsel kartlar). İçerikler:
  Bloglar/Dijital İK Olgunluk Testi, Hesaplamalar (8 araç, hepsi
  `/hesaplama-araclari`'na), Raporlar (4 gerçek kart, gerçek görsel+PDF).
  Podcastler 2026-07-24'te kaynakta URL'i bulunamadığı için kalıcı olarak
  kaldırıldı (mekanizmasıyla birlikte, bkz. §Tamamlanan işler).
- **NEDEN IDENFIT, FİYATLAR, MÜŞTERİLER:** kaynakta dropdown yok, düz link
  — burada da mega-menü fabrike edilmedi.
- Masaüstü nav breakpoint `lg` (mega-menü spec'i gereği `xl`'den
  düşürüldü); `MobileMenu.tsx` de `lg:hidden`.
- **i18n:** `navigation.ts` yalnızca YAPI tutar; tüm METİN `src/i18n/*.ts`'in
  `mega` şemasından `buildMegaMenus(t.mega, locale)` ile enjekte edilir.
  İstisna: promo'nun "LATER IS NEVER" sloganı (marka sloganı, 4 dilde aynı
  bırakıldı, bilinçli).

### Bilinen düzeltmeler (kalıcı, tekrar bozulmaması gereken davranışlar)
- **z-index/genişlik:** mega-menü paneli `<li>`'ye göre değil `<header>`'e
  (`position: relative`, `sticky`) göre `absolute` + `inset-x-0`
  konumlanıyor — viewport genişliğine yayılması için. `<li>`'de
  `position: relative` YOK.
- **Anchor linkler** (`#rfid` gibi) `lWithHash()` ile çözülüyor — path/
  fragment ayrılıp yalnızca path'e locale prefix'i uygulanıyor (aksi halde
  `l()` fragment'ın sonuna trailing slash ekleyip anchor'ı kırıyor).

---

## Proje kuralları

- **Script'ler:** Tüm yardımcı/analiz script'leri **Node.js (`.mjs`)** ile
  yazılır, **Python kullanılmaz** (proje JS/TS tabanlı, tutarlılık ve
  taşınabilirlik için). Konum: `scripts/`. Çalıştırma: `node scripts/<ad>.mjs`.
  Başlıca script'ler: `page-inventory.mjs`, `fetch-sectors.mjs`,
  `fetch-faq.mjs`, `extract-products.mjs`, `extract-hubs.mjs`,
  `extract-hardware.mjs`, `extract-pricing.mjs`, `extract-misc-pages.mjs`,
  `extract-blog-posts.mjs`, `fetch-blog-taxonomy.mjs`, `verify-blog-posts.mjs`,
  `extract-calculators.mjs`, `scan-remaining-modules.mjs`, `dev-clean-restart.mjs`,
  `audit-site.mjs` + `audit-analyze.mjs` + `audit-lang-consistency.mjs`
  + `audit-entities.mjs` + `audit-images.mjs` + `audit-http-status.mjs`,
  test script'leri (`test-*-language-switch.mjs`, `test-urunler-menu-links.mjs`,
  `test-legal-nl-consistency.mjs`, `test-no-external-idenfit-links.mjs`,
  `test-faq-language-switch.mjs`).
- **Tip güvenliği:** `npx astro check` — i18n şemasının (ve genel
  TypeScript'in) hatasız derlendiğini doğrular; VS Code'un canlı
  diagnostics'i zaman zaman stale olabilir, `astro check` güncel sonuçtur.
- **Test yaklaşımı:** Yeni bir dil değiştirici/CTA/link değişikliğinden
  sonra ilgili `test-*.mjs` script'i (gerçek HTTP istekleriyle, dev server
  ayakta olmalı) + regresyon için mevcut diğer `test-*.mjs`'ler
  çalıştırılır.
- **Vite bağımlılık önbelleği bozulması — KALICI ÇÖZÜM (2026-07-23,
  bkz. §Tamamlanan işler için araştırma özeti):** `astro.config.mjs`'in
  `vite.optimizeDeps`'i iki katmanlı: `force: true` (her başlangıçta
  önbelleği sıfırdan kurar) + `include: ['react', 'react-dom',
  'react-dom/client', 'lucide-react']` (projenin kullandığı 4 harici
  paket, koşulsuz pre-bundle edilir). `entries` ile tüm proje dosyalarını
  tarama YÖNTEMİ denenip TERK EDİLDİ (kırılgan — bir yorumdaki kod-benzeri
  metin taramayı bozdu). **Elle `node_modules/.vite` silme adımı artık
  hiçbir senaryoda GEREKMİYOR.** Bu iki katman bilinen tetikleyicilerin
  BİR KISMINI kapatır — kalan sınıf için iki kalıcı disiplin kuralı şart:
  1. `npm install`/`npm uninstall` çalıştırılmadan ÖNCE dev server
     durdurulmalı, sonrasında `npm run dev:clean` (durdur + `dist`/`.vite`
     temizle + arka planda yeniden başlat, TEK komut) ile yeniden
     başlatılmalı.
  2. **`astro.config.mjs` (veya Astro'nun izlediği başka bir config
     dosyası) dev server ÇALIŞIRKEN düzenlenirse**, Astro'nun kendi
     otomatik `"Configuration file updated. Restarting..."` soft-restart'ına
     GÜVENİLMEMELİ (bizzat yaşandı — restart "tamamlandı" dese bile React
     modülü bozuk kalabiliyor, kendi kendine toparlanmıyor). Config
     dosyası düzenlendikten SONRA mutlaka `npm run dev:clean` ile TAM bir
     process kill+restart yapılmalı.
  3. **Sık karşılaşılan sorun: navbar/marquee/form kayboluyor (React
     hydration hatası).** Kullanıcı "dev:clean ile düzelt" dediğinde,
     Claude Code otomatik olarak (1) `npm run dev:clean` çalıştırır, (2)
     `npx astro dev logs` ile `_jsxDEV`/`program reload`/`TypeError`
     hatası olmadığını doğrular, (3) `curl` ile ana sayfayı çekip
     React island'ların (`MarqueeBar`/`HeroForm`/`MegaMenu`/`MobileMenu`/
     `LanguageSwitcher`) hepsinin `<astro-island>` olarak render
     edildiğini doğrular, (4) kullanıcıya "düzeldi, sert yenile" der —
     ek onay/soru sormadan.
- **Proje temposu:** Haftalık hedeflerle ilerlenir, toplam süre önceden
  belirlenmez. Her hafta sonu değerlendirme yapılır. **Kalite > Hız.**

## Development
Dev server'ı arka planda başlat: `astro dev --background`. Yönetim:
`astro dev stop`, `astro dev status`, `astro dev logs`.

**`npm install`/`npm uninstall` çalıştırdıktan sonra** (dev server açık
olsun olmasın) `npm run dev:clean` ile yeniden başlatın — bkz. yukarıdaki
"Vite bağımlılık önbelleği bozulması" kuralı. Üretim build testi
(`astro build`) sonrası dev server'a dönerken de aynı komut kullanılabilir
(`dist/` çıktısını da temizler).

## Deployment
**Faz 1 (mevcut):** Tüm statik içerik Astro ile migrate edilip Cloudflare
Pages'e static olarak deploy edilecek.
**Faz 2 (ileride):** Dinamik/interaktif kısımlar (form backend'i, olası
arama/kullanıcı işlemleri) Cloudflare Pages Functions ile eklenecek.
Şu anki mimari (`output: 'static'`, `HeroForm`'un backend'siz `console.log`
hali) bu plana zaten uyumlu.

---

## WordPress Kaynak Sitesi (reference/wordpress-export/)

Kaynak site: `idenfit.com` (İK/HR SaaS). WordPress REST API export'u.
İçerik: `posts.json` (618 yazı, tümü TR), `pages.json` (170 sayfa, 4 dil),
`media.json` (2211 medya kaydı — `[[wp-media-export-count]]` hafıza
kaydına bkz., 2230 ile fark tasarlanmış davranış), `sectors.json` (48
sayfa, ayrı fetch), `faq.json` (90 kayıt, ayrı fetch).

Eklentiler: **Elementor** (page builder), **ACF** (custom field), **Yoast
SEO** (`yoast_head_json`), **Polylang** (`pll_language`, `pll_translations`).

### Custom post type'lar (standart export'a dahil DEĞİLDİ — 2026-07-21 keşfi)
Orijinal export yalnızca `page`/`post`/`media` çekmiş, `wp/v2/types` hiç
sorgulanmamıştı. Gerçekte var olan ek CPT'ler:
- **`sectors`** — 12 sektörün 4 dildeki tam sayfaları (✅ çekildi,
  `sectors.json`, bkz. §Mimari/§Sayfa envanteri).
- **`faq`** — 90 kayıt (TR/EN/IT 30'ar, NL yok), gerçek destek/SSS soruları
  (✅ çekildi, `faq.json`, `sss`/`faq` sayfalarında kullanılıyor).
- **`portfolio`** — amacı/kullanımı doğrulanmadı, düşük öncelik, henüz
  araştırılmadı.

**Ders:** bir içeriğin "WP'de yok" sonucuna varmadan önce `wp/v2/types` ile
TÜM post type'lar kontrol edilmeli, yalnızca `pages.json`/`posts.json`'a
bakılmamalı — bu projede en az bir kez (sektörler) yanlış negatife yol
açtı. **89 ürün/modül sayfası için bu kontrol tekrar yapıldı ve TEMİZ
çıktı** — hepsi zaten standart `page` post type'ında, `pages.json`'da,
tam içerikle mevcut; ekstra CPT yok.

### Dil dağılımı
- **Posts:** `pll_language` yok, 618 yazının tümü Türkçe (diğer dillerde
  post export edilmemiş/gelmemiş).
- **Pages:** `pll_language` var — `tr`=55, `en`=48, `it`=40, `nl`=27.

### Sayfa şablonları
`` (varsayılan): 97, `elementor_header_footer`: 65,
`pricing/template-pricing.php`: 4, `suprema/suprema.php`: 2,
`suprema-it/suprema.php`: 1, `elementor_theme`: 1. Post'ların tamamı (618)
varsayılan şablon.

### Kategoriler (post'larda, 11 adet)
`ik-akademi` (337), `ik-trendleri` (159), `guncel-bilgiler` (117),
`dijital-ik` (41), `gecmis-etkinlikler` (14), `guncel-bilgiler-tr` (11),
`uncategorized-tr` (7), `ik-roportajlari` (4), `yaklasan-etkinlikler` (3),
`ogretici-bilgiler` (3), `yenilikler-tr` (2). 63 tag var (SGK/bordro/mesai/
izin/İK odaklı — tam liste `node scripts/analyze-wp.mjs` ile). Sayfalarda
kategori/tag yok.

### Custom field / meta anahtarları (sayfalarda, ~500+ farklı anahtar)
Başlıca gruplar: SSS (`question_N`/`answer_N`, `faq_question_N`/
`faq_answer_N`), Hero/başlık (`page_title`, `hero_title`, `hero_image`,
`video_url`), Bölümler (`section_N_{title,text,image,cta_text,cta_url}`),
İletişim (`call_title`, `e-mail_*`, `office_1..3`), Sosyal medya
(`social_media_icon_N`/`social_media_url_N`), Referans/müşteri blokları
(`civil_*`, `yatsan_*`, `dog-ser_*`, `tugba_kuruyemis_*`, `femas_*`), Ürün
listeleri (`N_product_*` + `_copy`/`_copyN` klonları), Fiyatlandırma
(`mikro_*`, `sme_*`, `Pro_*`). Aynı anlamı taşıyan tekrar/typo'lu anahtarlar
var (`sectin_3_title`, `section_2_Text` vs `section_2_text`) — extraction
script'lerinde normalize ediliyor (bkz. §Mimari — ACF şema çeşitliliği).

### Açılmamış arşivler
`themes.zip` (~22 MB) — mevcut WP teması, açılmadı (Suprema alt
sayfalarının boş `content.rendered`'ını kurtarmak için gerekebilir).
`uploads.zip` (~1.4 GB) — tüm görseller, açılmadı.

---

## Documentation

Full documentation: https://docs.astro.build

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
