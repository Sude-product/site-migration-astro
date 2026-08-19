## Proje Özeti

idenfit.com (İK/HR SaaS) WordPress'ten Astro'ya migrasyon. Astro + React
island mimarisi, i18n (tr/en/nl/it), Tailwind v4, `output:'static'` →
Cloudflare Pages. Genel durum: ana sayfa, mega-menü, tüm ürün/modül
sayfaları (18 modül + Puantaj + 2 hub + Demirbaş/Seyahat), 12 sektör
sayfası, 622 blog yazısı (618 JSON + 4 Markdown pilot), Müşteriler,
Destek Talebi, Hesaplama Araçları, Dijital İK Olgunluk Testi, Fiyatlar,
Hakkımızda, İletişim, SSS, KVKK/hukuki sayfa ailesi (+ KVK Protokol),
Footer/Header tamamlandı. Site denetim raporu (14 madde) + kapsamlı URL
denetimi (853 canlı URL karşılaştırması) kapandı. Landing Page (/demo)
tamamlandı (2026-08-11, f21f863). Ana sayfa interaktif Ürün Önizleme
widget'ı (11/11 sekme + üst header'ın 9/9 ikon paneli) tamamlanıp commit
edildi, sonrasında birden fazla iyileştirme turu (renk/boyut/dashboard
içeriği) geçirip **commit edildi (0c1e67a, 2026-08-18/19)**. Şu anki
odak: Blog CMS (Decap) kademeli üretimi + SEO/erişilebilirlik/GEO takip
turları (bkz. §Açık noktalar #28).

**Geçmiş günlük detayları (tarih damgalı arşivler, nadiren gerekir):**
`docs/claude-md-archive-2026-08-18.md` (2026-08-13→2026-08-19 tam
günlük — 13 turluk widget iterasyon serisi, header ikon panelleri
pixel-compare turu, DOM boyutu/heading-hierarchy/hreflang/GEO denetim
turlarının TAM anlatımı, bu dosyanın bir önceki sadeleştirilmeden önceki
hali), `docs/claude-md-archive-2026-08-13.md` (2026-08-06→2026-08-13),
`docs/claude-md-archive-2026-08-06.md` (2026-07-21→2026-08-06),
`docs/claude-md-archive-2026-07-31.md`, `docs/claude-md-archive-2026-07-28.md`,
`docs/claude-md-archive-2026-07-23.md`.

---

## Güncel durum (son güncelleme: 2026-08-19)

**🟢 Ana sayfa Ürün Önizleme widget'ı — 2026-08-19'da 6 turluk İKİNCİ bir
genişletme serisi geçirdi (0c1e67a'dan SONRA, bu turda commit edildi).**
2026-08-13→14'te 11/11 sekme + 9/9 header ikon paneli tamamlanıp ilk kez
commit edildi (808412a+b9f713d), 2026-08-18/19'da "Zaman Yönetimi"
sekmesine dashboard kartları eklenip 0c1e67a'da commit edildi. Aynı gün
(2026-08-19), AYNI ilkeyle (gerçek app.idenfit.com ekran görüntüleriyle
karşılaştırıp eksik kartları ekleme, kurgusal-ama-tutarlı veri) **4 sekme
daha genişletildi:** İzin (Aylık İzin Trendi/Birim Bazlı İzin Kullanımı/
İzin Çakışma Uyarısı/En Çok İzin Kullanan Birimler), İnsan Kaynakları
(Çalışan Devir Hızı/Onay Bekleyen İşlemler/Takvim/Deneme Süresi Takibi/
Sözleşme Takibi), Performans Yönetimi (Görevlerim 5'li durum rozeti +
görev listesi), Veri Analizi (Aktif Çalışan Sayısı Trendi/Günlük Personel
Hareketleri + 2 tam-boy grafik). Paylaşılan sekme `min-h`'i 6 turda
1040px'ten 1215px'e ayarlandı (İK'nin Takvim kartı en büyük itici güçtü,
sonra kullanıcı isteğiyle küçültülüp dengelendi). Işık/karanlık modda
Chrome'da tüm 4 yeni sekme görsel doğrulandı, `astro check` 0 hata,
`astro build` 881 sayfa, `check-image-alt-text` 0 eksik — **çalışma
ağacı temiz, bekleyen commit YOK.** Detaylı iterasyon geçmişi (gradyan
yönü denemeleri, "ağ" deseninin terk edilmesi, z-index dersleri, boyut
küçültme/büyütme turları) arşivde.

**🟢 Aynı gün (2026-08-19) footer'a güven rozetleri şeridi eklendi.**
SSL/ISO 27001/Peryön/GDPR — kullanıcının sağladığı 4 görsel
(`public/images/trust-badge-*`, `wp-content/uploads` hotlink DEĞİL),
`TRUST_BADGE_LOGOS` (`src/data/footer.ts`) + `Footer.astro`'nun alt
bar'ında beyaz kartlar içinde, kullanıcının verdiği sırayla. `iso27001.webp`
uzantısı düzeltildi (ham baytlar WebP ama kaynak dosya `.jpg` adıyla
paylaşılmıştı). 4 dilde gerçek çeviri `alt` metni (`FooterLabels.trustBadges`).
Chrome'da görsel doğrulandı, `check-image-alt-text` 0 eksik.

**🟢 Aynı gün (2026-08-19) hero (`HeroSection.astro`) SEKİZİNCİ tur —
2-kolonlu düzen (sol metin/sağ kırmızı görsel paneli) tamamen kaldırıldı.**
Kullanıcı isteğiyle: metin/form artık TEK KOLON, ortalanmış; "dashboard"
bölümü aralarında `mt-12 lg:mt-16` boşluk bırakılarak ALTINA taşındı.
Önceki `grid-cols-2`/full-bleed sağ panel mimarisi (7 turun konusu
olmuştu, arşivde) bilinçli olarak terk edildi.

**🟢 Aynı gün (2026-08-19) DOKUZUNCU tur — hero'daki statik dashboard
görseli TR'de GERÇEK/canlı `ProductPreviewWidget`'a çevrildi.** Kullanıcı
"statik resim değil, yaptığımız canlı dashboard'u koy" dedi. TR hero'sunda
artık `HomeProductPreview.astro` ile BİREBİR aynı çerçeve/gradyan/sahte
tarayıcı bar'ı içinde gerçek/etkileşimli widget render ediliyor
(`locale === 'tr'` koşullu). EN/NL/IT hâlâ
statik görseli kullanıyor (widget TR-only pilot, bkz. Açık nokta —
i18n kapsamı onay bekliyor). **BİLİNÇLİ AÇIK NOKTA:** sayfanın aşağısındaki
mevcut "Panelinizde Sizi Neler Bekliyor?" bölümü (`HomeProductPreview`)
AYNI widget'ı bir kez daha gösteriyor — kullanıcıya soruldu, "sonra
karar verelim" dedi, bilerek DOKUNULMADI (iki widget aynı anda TR
ana sayfasında var). `astro check` 0 hata, `astro build` 881 sayfa,
Chrome'da hem hero widget'ının etkileşimi (sekme tıklama) hem EN
fallback görseli doğrulandı.

**🟢 Aynı gün (2026-08-19) ONUNCU tur — hero'daki canlı widget yana
doğru genişletildi, boyu bir miktar kısaltıldı.** Kullanıcı "yana doğru
biraz daha genişlet, boyundan azıcık eksilt, çok aşağı doğru duruyor"
dedi: dış sarmalayıcı `max-w-6xl`(1152px)'ten `HomeProductPreview.astro`
ile AYNI, zaten kanıtlanmış `max-w-[88rem]`(1408px) değerine genişletildi
(genişlik 1088px→1344px, +%23.5) — widget'ın kendi grid'i fluid olduğu
için içerik de orantılı genişledi. Üst boşluk (`mt-16`→`mt-10`) ve
çerçeve dolgusu (`p-8`→`p-6`) küçültülerek yükseklik 1514.6px→1453px'e
indi (-%4). Widget'ın PAYLAŞILAN iç `min-h`'ine (`HomeProductPreview`
ile ORTAK, birden fazla turda özenle ayarlanmış) bilinçli olarak
DOKUNULMADI — o değeri değiştirmek diğer kullanım yerini de etkilerdi.
Chrome'da yatay taşma YOK (`scrollWidth` 1521 < viewport 1536)
doğrulandı, `astro check` 0 hata, `astro build` 881 sayfa.

**🟢 Aynı gün (2026-08-19) iki büyük ana sayfa değişikliği de commit
edildi:**
- **Sabit "Demo Talep Et" alt bar'ı** (`StickyDemoBar.astro`, kaynakta
  yok — kullanıcının referans görüntüsüne dayanan yeni özellik),
  kaydırma-tetiklemeli görünürlük + hover efekti + gerçek fotoğraf ile
  (cd9300c).
- **Hero köklü revize edildi** — çok-alanlı form yerine tek-alanlı
  (yalnızca e-posta) form + yeni marka sloganı ("People first.
  Everything else, simplified." / TR-NL-IT gerçek çeviri), 4 dilin
  hepsinde. E-posta query param ile Online Sunum Talebi sayfasına
  taşınıp ön-dolduruluyor. `<title>`/meta description SEO nedeniyle
  DEĞİŞTİRİLMEDİ, yeni `headline`/`subheadline` alanları eklendi
  (3b0fc1f).

**🟢 Bağımlılık güncellemesi:** 10 güvenli paket minor/patch güncellendi
(typescript hariç, kasıtlı — major sürüm atlaması riskli), regresyon
yok (8698627).

**Kalan:** Blog `metaTitle` kademeli üretimi (Açık nokta #28, 220 yazı
kaldı) + görsel yerelleştirme (Açık nokta #14, ~1260 görsel) — ikisi de
kademeli/kullanıcı onayına bağlı arka plan işleri.

---

## Bugünkü SEO/GEO turu özeti (2026-08-19)

Kullanıcının bir SEO/GEO denetim aracından gelen bulgu listesi tek tek
araştırılıp kapatıldı veya (gerçek bir sorun olmadığı durumlarda)
gerekçeli olarak kapalı işaretlendi. Sıra ve commit'ler:

1. **"Missing HTML lang attribute"** — araştırıldı, **bizim projede
   sorun YOK** (kod değişikliği gerekmedi). `<html lang>` her sayfada
   doğru; bulgu muhtemelen Açık nokta #27'deki noindex redirect
   stub'larından (hiç `<html>` üretmiyorlar, Astro framework şablonu)
   geliyor. (fc0cf15 — yalnızca CLAUDE.md güncellemesi)
2. **"No Open Graph article date tags"** — KAPANDI. Blog yazılarına
   (622) `article:published_time`/`article:modified_time` eklendi,
   `BaseLayout.astro`'ya yeni prop'lar, yalnızca `ogType==='article'`
   iken basılıyor. (f969af0)
3. **"No dateModified in structured data"** — KAPANDI, Açık nokta #29
   kısmen yeniden açıldı. `BaseLayout.astro`'ya genel `dateModified`
   prop'u eklendi, 7 shared component (~161 sayfa: ürün/sektör/hukuki/
   fiyat/online-sunum-talebi/destek-talebi/teşekkürler) artık sade bir
   `WebPage` JSON-LD'si taşıyor. Ürün-özel zengin şema (`Product`/
   `Service`) hâlâ AYRI, daha büyük bir karar (Açık nokta #29'da açık
   kaldı). (5289eda)
4. **"No H2 subheadings"** — KAPANDI, Açık nokta #32 TAMAMEN kapandı.
   14 sıfır-H2 sayfadan 13'ü zaten bilinçli karardı (404/Destek
   Talebi/Teşekkürler/Güvenlik); tek gerçek boşluk `nl/wereldwijd-merk`
   idi — TR kaynaktan gerçek Hollandaca çeviri + anlamlı bir H2
   eklendi. (c0f041f)
5. **"Title tag too short"** — Açık nokta #28'in kademeli üretimi
   BAŞLADI, 30/250 kısa blog yazısına `metaTitle` eklendi (220 kaldı,
   arka plan işi olarak devam edecek). (4c59698)
6. **"No visible content dates"** — araştırıldı, **zaten kapalıydı**
   (2026-08-17'de `LastUpdated` component'iyle kurulmuştu), bu turda
   yeniden doğrulandı, kod değişikliği gerekmedi.

**Ayrı bir SEO bulgusu (aynı gün, GEO listesinin dışında):** "Links
without descriptive text" — KAPANDI. Kök neden erişilebilir-ad-yok
linkler DEĞİL, görünür metni jenerik ("buradan"/"tıklayın") linklerdi —
ana sayfa video CTA'sı, KVKK PDF linki, blog gövdesinde ~8+ yazıda aynı
desen (`contentLinkAccessibility.ts`, eski `blogContentAccessibility.ts`'in
genişletilmiş hali) `aria-label` ile düzeltildi, görünür metin
değiştirilmedi. (11dda0b)

**Kanıt (her madde için tekrarlandı):** `astro check` 0 hata, `astro
build` 881 sayfa, `check-link-accessibility`/`check-heading-hierarchy`/
`check-html-lang-attribute`/`check-json-ld` script'leri önceki bilinen
temel çizgiyle birebir aynı (sıfır regresyon), Chrome'da görsel/DOM
doğrulama.

---

## Açık noktalar / bekleyen kararlar

*(Bazı maddeler artık bu dosyada görünmeyen tarihli anlatımlara atıfta
bulunuyor — tam detay `docs/claude-md-archive-2026-08-18.md` ve
`docs/claude-md-archive-2026-08-13.md`'de, madde numaraları/içerikleri
hâlâ geçerli.)*

1. **KARAR 2 — kaynakta olmayan çeviriler için yeni sayfa üretimi**
   ekiple görüşülüp netleşmeyi bekliyor; şimdilik üretilmiyor.
   **İstisna:** Online Sunum Talebi'nin NL versiyonu kullanıcının açık
   talimatıyla eklendi (`PRESENTATION_NL_OVERRIDE`).
2. **Faz 2 backend yok** — Hero formu + HR Maturity Test sonuç
   sayfasının "raporu e-postama gönder" butonu `console.log` stub/devre
   dışı. Faz 2'de (Cloudflare Pages Functions) gerçek backend'e
   bağlanacak.
6. Mesafeli Satış Sözleşmesi'nin kobi/mikro TR varyantları kurulmadı.
8. Puantaj modülünün gerçek YouTube `video_url`'i var ama bilinçli
   olarak embed edilmedi.
9. İzin Yönetimi modülünün testimonial bloğu veride var ama PDKS
   şablonuna sadık kalmak için render edilmiyor.
10. `tesekkurler-destek` (id 16712) bulundu ama migrate edilmedi.
12. **TODO — HR Maturity Test sonuç sayfasının PDF rapor gönderimi
    backend'siz** (madde 2 ile aynı Faz 2 kategorisi).
13. **BULGU — site geneli sabit WhatsApp/Ara widget'ı yok, kaynakta
    var.** Kapsam dışı, istenirse eklenebilir.
14. **Görsel yerelleştirme kısmen tamamlandı** — yalnızca İK Olgunluk
    Testi + `pdks-nedir` blog yazısı yerelleştirildi. **Kalan ~1260
    görsel (618 blog yazısı + 10 veri dosyası) hâlâ hotlink** — kademeli
    üretim onayı bekliyor. Script: `scripts/localize-images.mjs`.
    **Karar (2026-08-12):** Faz 2'ye geçmeden hemen önce ele alınacak.
15. **YARIM KALAN — İK Olgunluk Testi'nde 2 açık uç:** Section 2 rozet
    boyutu (yalnızca ilk kart pilot), Section 3 checklist ikon rengi
    (kullanıcıdan DevTools hex kodu bekleniyor).
16. **KARAR BEKLİYOR — blog "yeni yazı senkronizasyonu" periyodik
    kontrol haline getirilsin mi?** Yöntem kanıtlandı (`post-sitemap.xml`
    vs `posts.json` diff'i), sıklık/tetikleme henüz kararlaştırılmadı.
19. **KARAR — Faz 2 CMS: Decap CMS.** Kurulum devam ediyor, bkz. madde 21.
20. **SÜREÇ — `npm audit` periyodik hale getirildi** (`npm run audit`,
    her önemli değişiklik/deploy öncesi). Şu an 0 açık.
21. **Blog CMS (Decap) — 3 açık uç:** Kademeli üretim (kalan 618 yazı
    `scripts/migrate-blog-to-markdown.mjs <slug...>` ile); `verify-blog-posts.mjs`
    göç etmiş `.md` yazıları görmüyor, güncel değil; `/admin/`
    trailing-slash davranışı Cloudflare Pages'te henüz doğrulanmadı;
    OAuth App onayı IT'den bekleniyor.
22. **YENİ — Kategori arşiv sayfaları (`/category/<slug>/`, 12 taksonomi
    sayfası) migrate edilmedi**, ayrı bir yapısal karar bekliyor.
24. **KAPANDI — DOM boyutu (Chrome "1587/1501 element" uyarısı):**
    MobileMenu masaüstünde 2026-08-10'da, MOBİLDE 2026-08-17'de
    düzeltildi (`hasOpened` state, ilk tıklamaya kadar hiç mount
    edilmiyor). Son ölçüm: 1587→1327 element (-%16.4). MegaMenu hâlâ
    BİLİNÇLİ olarak ertelenmiş durumda, bkz. madde 25.
25. **TODO — MegaMenu'nün 4 panelinin DOM'da her zaman var olması (447
    element) performans maliyeti yaratıyor** ama kaldırılırsa geçmiş bir
    focus/kapanma bug'ı geri gelebilir. Bilinçli olarak ertelendi
    (2026-08-10) — `MegaMenu.tsx` satır 241-253'teki yorum kök neden
    bug'ının tam anlatımını taşıyor.
27. **BULGU (bilgi notu, aksiyon GEREKMİYOR) — site ~1492 redirect stub
    sayfası içeriyor** (i18n fallback + elle `redirects`'in ürettiği
    `<meta http-equiv="refresh">` sayfaları + 4 özel 404 sayfası), hepsi
    kasıtlı `noindex` VE hiç `<html lang>` taşımıyor (Astro'nun kendi
    framework-içi redirect şablonu, bizim kodumuzda düzeltilecek bir şey
    yok). SEO araçlarında "çok fazla noindex/lang-eksik sayfa" uyarısı
    tetikleyebilir ama gerçek sorun değil.
28. **DEVAM EDİYOR (kademeli) — Blog yazılarının `<title>` uzunluğu.
    31/622 yazı tamamlandı** (`stratejik-yaklasimi` pilot + 30 yazı
    2026-08-19'da "Title tag too short" GEO turunda), **220 kısa + 189
    uzun (409 toplam) hâlâ bekliyor.** Altyapı hazır —
    `content.config.ts`'in `blogSchema`'sındaki `metaTitle?: string`
    alanı, `posts.json`'da ilgili yazıya eklenince H1/JSON-LD
    `headline`'ı DEĞİŞTİRMEDEN yalnızca `<title>`'ı değiştiriyor. Devam
    için: `node scripts/check-title-length.mjs` çıktısının `blog/` ile
    başlayan satırları başlangıç noktası, her yazının GERÇEK içeriği
    okunup konuyla ilgili elle bir uzatma/kısaltma yazılmalı.
29. **KISMEN KAPANDI (2026-08-19) — JSON-LD artık blog DIŞINDA da var**
    (`BaseLayout.astro`'nun genel `dateModified` prop'u, 7 shared
    component/~161 sayfa, sade `WebPage` şeması). **Kalan gerçek
    boşluk:** ürün sayfaları için `Product`/`Service` gibi ZENGİN/
    tip-özel bir şema (fiyat, modül listesi, rich result potansiyeli)
    hâlâ YOK — ayrı, daha büyük bir karar.
30. **TODO — `public/_redirects`'in (404 sayfası) gerçek Cloudflare
    Pages davranışı henüz DOĞRULANMADI.** Faz 1 deploy'unda ilk kontrol
    edilmesi gerekenlerden biri.
31. **KISMEN KAPANDI (2026-08-17) — Canonical URL etiketi KODLANDI,
    yalnızca AKTİVASYONU Faz 2'yi (domain bağlanması) bekliyor.**
    `astro.config.mjs`'e `site: 'https://idenfit.com'` girilince hreflang
    ile birlikte otomatik aktifleşecek, ek kod değişikliği gerekmeyecek.
32. **TAMAMEN KAPANDI (2026-08-19)** — 3 küçük H2 bulgusu (hukuki
    sözleşme 2026-08-13, SSS 2026-08-17, `nl/wereldwijd-merk`
    2026-08-19) hepsi kapandı.
33. **TAMAMEN KAPANDI — Başlık SEVİYE ATLAMASI, 44 sayfa.** 3 alt
    kategorinin hepsi kapandı: 38 blog yazısı (2026-08-17,
    `normalizeHeadingLevels()`, commit cb35dac), 2 hub sayfası + 1
    hukuki sayfa (2026-08-13).
34. **KAPANDI — "No H3 subheadings" SEO bulgusu, ~250 canlı-site URL'i
    (2026-08-14).** ~%49'u (blog tag/category/author arşivleri) bizim
    projede hiç yok — eski canlı WP sitesinden taranmış, aksiyon
    gerekmiyor. Gerçek düzeltmeler: `ProductPage.astro` SSS accordion'u
    (`<span>`→`<h3>`, ~96 sayfa), `BlogListPage.astro`/`BlogSidebar.astro`
    (popüler yazı listesi), `ContactPage.astro` (ofis kayıtları).
    `AboutPage`/`SecurityPage`'de bilinçli olarak H3 EKLENMEDİ (zorlama
    başlık olurdu, gerekçe kaydedildi).
35. **KARAR BEKLİYOR — TR ana sayfasında `ProductPreviewWidget` artık İKİ
    kez render ediliyor** (2026-08-19, DOKUZUNCU tur): hero'da (yeni) VE
    sayfanın aşağısındaki "Panelinizde Sizi Neler Bekliyor?" bölümünde
    (`HomeProductPreview.astro`, eski). Kullanıcıya soruldu, "sonra karar
    verelim" dedi — aşağıdaki bölümü kaldırıp kaldırmama kararı BEKLİYOR.

**Kapanmış maddeler (3,4,5,7,11,17,18,23,26) arşivde** — özet: promo
görsel bulundu, blog 622/622 tamamlandı, Podcastler kaldırıldı, Gizlilik
ve Güvenlik Politikası migrate edildi, HR Olgunluk Testi kuruldu, Online
Sunum Talebi onaylandı, navbar BLOG linki kaldırıldı, Demirbaş/Seyahat
mega-menüye bilinçli eklenmedi, erişilebilir adı olmayan `<a>` linkleri
düzeltildi.

---

## Tamamlanan işler — kısa kronolojik özet

Tam süreç/kök-neden/ölçüm anlatıları için tarihli arşiv dosyalarına
bakılabilir (nadiren gerekir): `docs/claude-md-archive-2026-08-18.md`
(2026-08-13→08-19 tam günlük), `docs/claude-md-archive-2026-08-13.md`
(2026-08-06→08-13), `docs/claude-md-archive-2026-08-06.md`
(2026-07-21→08-06), `-07-31.md`, `-07-28.md`, `-07-23.md`. İlgili
turların çoğu için ayrıca `memory/` dosyaları da var (aşağıda işaretli).

- **2026-08-19:** SEO/GEO denetim turu — bkz. yukarıdaki "Bugünkü
  SEO/GEO turu özeti". Ayrıca: sabit "Demo Talep Et" alt bar'ı (yeni
  özellik), hero'nun tek-alanlı forma + yeni marka sloganına köklü
  revizyonu, Fiyatlar sayfası fiyat güncellemesi (KOBİ zam, Pro→"Teklif
  Al"), 10 bağımlılık minor/patch güncellendi, Ürün Önizleme widget'ının
  5 turluk revizyon serisi (arka plan/renk/boyut/"Zaman Yönetimi"
  dashboard içeriği) commit edildi. **Aynı gün, ayrı bir 6 turluk ikinci
  seri:** Ürün Önizleme widget'ının İzin/İnsan Kaynakları/Performans
  Yönetimi/Veri Analizi sekmelerine gerçek app.idenfit.com dashboard
  ekran görüntülerine göre yeni kartlar eklendi (bkz. yukarıdaki widget
  durumu). Footer'a güven rozetleri şeridi eklendi (SSL/ISO 27001/
  Peryön/GDPR).
- **2026-08-18:** Ürün Önizleme widget'ı idenfit kırmızısıyla boyandı +
  genişletildi + tüm modülleri büyütüldü (referans SaaS dashboard
  görüntüsüne göre) — bu turda `EvaluationRow`'da isim kırpma
  regresyonu bulunup düzeltildi (`sm:flex-row` kaldırıldı, konteyner
  genişliği viewport breakpoint'inden dar kalıyordu).
- **2026-08-17:** hreflang + canonical altyapısı sıfırdan kuruldu
  (`Astro.site` tanımlanana kadar uykuda, Açık nokta #31) — bkz.
  `hreflang-canonical-audit.md` memory. "Large DOM size" bulgusu KAPANDI
  (MobileMenu mobilde de lazy-mount, Açık nokta #24) — bkz.
  `dom-size-mobile-menu-fix.md` memory. "Multiple H1 tags" incelendi,
  sorun yok. "No visible content dates" GEO bulgusu kapandı
  (`LastUpdated` component, 91+ ürün/48 sektör/14 hukuki/Donanım/
  Fiyatlar/Destek Talebi/Teşekkürler sayfası, sayfa ALTINA yerleştirildi)
  — bkz. `geo-content-dates-audit.md` memory. "Few H2 subheadings"
  kapandı (SSS kategori panelleri, 12 sektör "Bu Sektöre Özel Modüller"
  başlığı, Hesaplama Araçları).
- **2026-08-14:** Header'ın kalan 6 ikon paneli (Analiz/Göz/Dil seçici/
  2. zil/HRTECHTOOLS/Avatar) `IconDropdown` deseniyle tamamlandı (9/9).
  HRTECHTOOLS gerçek app.idenfit.com ekran görüntüsüyle pixel-compare
  edilip monokrom tasarıma çevrildi, 7 kutusu gerçek dış linklere
  (idenfit.com/conectohub/hiringoz/dakika/anzera/accessonkey/workmana)
  bağlandı. Dil seçici 11 dil (4'ü mevcut `FlagIcon`, TIKLANINCA GERÇEK
  DİL DEĞİŞTİRMİYOR — bilinçli). "Later is never" / `lang="tr"` CSS
  `uppercase` Türkçe İ bug'ı bulunup düzeltildi (kalıcı ders:
  literal İngilizce string'ler CSS transform yerine kaynakta büyük harf
  yazılmalı). Icon boldness/opaklık turu (3 gerçek kaynak düzeltildi).
- **2026-08-13:** Ana sayfa Ürün Önizleme widget'ı sıfırdan kuruldu —
  sidebar+dashboard mockup'ı, 11/11 sekme (Zaman Yönetimi/İzin/İnsan
  Kaynakları/Performans Yönetimi/Veri Analizi fonksiyonel, 6 pasif
  "Yakında"), fonksiyonel karanlık/aydınlık mod, header ikon panellerinin
  ilk 2'si (Kısayollar/Bildirimler) pilot olarak dolduruldu — commit
  808412a+b9f713d. Başlık seviye atlaması bulgusu (44 sayfa) 2 alt
  kategoride kapandı (2 hub + KVKK TR). OG + Twitter Card paketi 881
  sayfaya kuruldu. Blog `metaTitle` override altyapısı kuruldu. Hukuki
  sözleşme ailesine (11 sayfa) merkezi dönüşüm fonksiyonuyla H2/H3
  hiyerarşisi eklendi.
- **2026-08-12:** Puantaj/Donanım/Doküman/Masraf/Şirket Takvimi/Özlük
  Dosyası CTA takip turları. Site geneli CTA/anchor-text optimizasyonu
  (~150 sayfa, `GENERIC_CTA_TEXTS`/`buildCtaAnchorText()`). Ana sayfaya
  SSS bölümü + `FAQPage` JSON-LD. Site geneli hero görseli
  `loading="lazy"` LCP bug'ı düzeltildi (143 sayfa). Blog gövdesinde
  stray `<h1>` için 2 katmanlı render-time güvenlik ağı kuruldu — bkz.
  `blog-h1-heading-audit.md` memory.
- **2026-08-11:** İletişim sayfası 6 eksik bölümle tamamlanıp 5 takip
  turunda pixel-doğrulamalı düzeltildi — bkz. `contact-page-gap-audit.md`
  memory. Özel 404 sayfası (4 dil) — bkz. `404-page-astro-i18n-gotcha.md`
  memory. KVKK/hukuki sayfa ailesi (14 sayfa) canlı siteyle eşleştirildi
  — bkz. `legal-page-font-design-audit.md` memory. Header/marquee
  container bug'ı + boyut/renk/sonsuz-döngü düzeltmesi — bkz.
  `header-marquee-audit.md` memory. Site geneli `alt` metni denetimi
  tamamlandı — bkz. `image-alt-text-audit.md` memory.
- **2026-08-10:** JSON-LD sıfırdan kuruldu (yalnızca blog, 622 yazı) —
  bkz. `json-ld-audit.md` memory. `<title>` uzunluk denetimi (194
  blog-dışı sayfa) — bkz. `title-length-audit.md` memory. Meta
  description uzunluk denetimi (43 sayfa) — bkz. `meta-description-audit.md`
  memory. Erişilebilir-ad-yok `<a>` link denetimi (19 ihlal, blog
  içeriği) — bkz. `link-accessibility-audit.md` memory. Site geneli DOM
  boyutu taraması + `MobileMenu` masaüstü düzeltmesi — bkz.
  `dom-size-investigation.md` memory. Landing Page (`/demo`) geliştirme
  turu — bkz. `landing-page-status.md` memory.
- **2026-08-06/07:** Landing Page (`/demo`) pilot iskeleti kurulup gerçek
  ürün içeriğiyle zenginleştirildi, sonra görsel olarak yükseltildi —
  bkz. `landing-page-status.md` memory (f21f863 ile 08-11'de tamamlandı).
- **2026-07-31:** Marquee scroll-hide titremesi kalıcı çözüldü (kök
  neden: `backdrop-filter`+`position:sticky`). Online Sunum Talebi
  baştan kuruldu. Navbar "BLOG" linki kaldırıldı.
- **2026-07-30:** Header scroll flicker düzeltildi. İK Olgunluk Testi
  genişletildi. Müşteriler sayfasına marquee eklendi.
- **2026-07-29:** `uploads.zip` işlendi, 2 alan pilot yerelleştirildi
  (Açık nokta #14). İK Olgunluk Testi'ne 5 bölüm eklendi.
- **2026-07-28:** Dijital İK Olgunluk Testi migrate edildi. `nl→en→tr`
  fallback zincirleme bug'ı düzeltildi. Navbar fontu element-ID ile
  kesin ölçüldü.
- **2026-07-27:** Müşteriler sayfası baştan tasarlandı. Destek Talebi
  migrate edildi. Telefon ülke kodu site geneli bug'ı düzeltildi (45
  ülke, 5 form). KURUMSAL mega-menüsüne promo kart eklendi.
- **2026-07-24:** Blog migrasyonu FAZ B tamamlandı (618/618, Content
  Collections mimarisi kuruldu). Logo gerçek kaynak SVG'sine geçirildi.
- **2026-07-21/23:** Temel modül migrasyonu (89 sayfa, 6 farklı ACF
  şema), sektör sayfaları (48 sayfa), site denetim raporu 14/14 kapandı
  (mobil menü `createPortal` fix'i dahil). Vite bağımlılık önbelleği
  bozulmasına kalıcı çözüm. **Üç kalıcı karar:** KARAR 1 (gerçek çeviri
  kuralı), KARAR 2 (kaynakta olmayan çeviriler için yeni sayfa üretimi
  ertelendi, Açık nokta #1), KARAR 3 (hiçbir modül kapsam dışı
  bırakılmadı).
- **Temel kurulum (tarihsiz):** Astro + React island mimarisi, i18n
  routing, Tailwind v4 tasarım sistemi, Header/Footer, Hero, merkezi
  i18n metin sistemi.

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
FARKLIYSA otomatik fallback YANLIŞ hedefe düşüp kırık redirect üretir —
bu durumda `astro.config.mjs`'e elle `redirects` girdisi gerekir.

### i18n metin sistemi (src/i18n/)
Sayfa/component metinleri koda gömülmez, merkezi tutulur:
- `src/i18n/types.ts` — `Translations` şeması.
- `src/i18n/{tr,en,nl,it}.ts` — her biri aynı şemaya uyar; bir dilde
  anahtar eksik/fazlaysa **TypeScript derleme zamanında hata verir**
  (`tr.ts` ana kaynak, `astro check` ile doğrulanır).
- `src/i18n/index.ts` — `getTranslations(locale)`.
- Astro tarafı: `const t = getTranslations(Astro.currentLocale ?? 'tr')`.
  React island'lara çeviri STRING prop olarak geçirilir.
- `src/data/nav.ts`/`navigation.ts` yalnızca YAPI (href/icon/layout) tutar;
  metin `key: keyof Translations['nav']` referansıyla i18n'den gelir.

### Veri çıkarma kuralı — `link` her zaman otoriter, `slug` değil
WP export'unda `slug` alanı birden fazla kez yanıltıcı çıktı (eski/çakışan
kalıntılar). **Kural: route/slug/gruplama için her zaman `link` alanından
türetilen bare slug kullanılır, WP'nin `slug` alanına asla güvenilmez.**
Tüm extraction script'leri (`extract-*.mjs`, `fetch-*.mjs`) bu kurala uyar.

### CTA URL çözümleme — `resolveCtaUrl()`/`localizeCtaUrl()` (productContent.ts, paylaşılan)
Ham ACF CTA URL'leri locale başına tutarsız slug kullanıyor. `resolveCtaUrl(rawUrl,
locale)` bir `{ url, external, newTab }` döner. Dört durum:
1. **"Online Sunum Talebi" hedefi** — kaynakta 3 farklı slug var, hepsi
   bizim canonical slug'ımıza (`online-sunum-talebi`, `DEMO_CTA_URL`
   sentinel'i ile tanınır) çevriliyor.
2. **Çapraz-sektör/hub tanıtım linkleri** — ham metne güvenilmez, kendi
   veri setimiz üzerinden yeniden çözülür.
3. **Ürün/modül sayfası linkleri** — kaynaktaki per-locale slug aynen
   taşınır (`l(bareSlug)`).
4. **Dış linkler** (hostname tam `idenfit.com` değilse) — `external:true`.
   **`external` ≠ "yeni sekmede aç"**: `newTab` ayrı bir alan — kendi
   ekosistemimiz (`app.idenfit.com`, `SAME_TAB_EXTERNAL_HOSTNAMES`)
   `newTab:false` alır (aynı sekmede açılır); gerçek dış markalara
   (`my.idenfit.com`/workmana.com/HRTech Alliance) `newTab:true` kalır.

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
- **Ekleme** (`appendSections`): yalnızca belirli bir blok eksik.
- **Sıfırdan yeni sayfa** (kaynakta o dil hiç yoksa): `override.hero`
  doluysa `entry` olmadan da içerik üretilir, slug `SYNTHETIC_SLUGS` ile
  elle atanır.
- Aynı desen `miscPagesTranslationOverrides.ts`, `hubTranslationOverrides.ts`,
  `hardwareTranslationOverrides.ts` için de kullanılır.

### ACF şema çeşitliliği (ürün/modül sayfaları)
Modül sayfaları TEK bir ACF şeması kullanmıyor — **6 farklı şema**
bulundu (Şema A: `module_title`, B: `hero_title`, C: `section_title_N`
ters sıralı, D: `section_1_title`[PDKS], E: `product_tit`/`module_text`[Puantaj],
+ Şirket Takvimi'nde 3 şemanın aynı sayfada bir arada bulunduğu 4.
varyant). `scripts/extract-products.mjs` bunları regex tabanlı, alan-adı-
sabit-varsaymayan bir yaklaşımla otomatik tespit edip normalize ediyor.

### Sayfa mimarisi kalıpları
- **Ürün/modül sayfaları:** `ProductPage.astro` + `ProductSectionBlock.astro`
  — hero + N içerik bloğu + SSS (`<details>` accordion, her zaman
  gösterilir). Genelde statik `.astro` dosyaları (4 dil × 1 dosya),
  `getStaticPaths()` tabanlı dinamik route DEĞİL.
- **Sektör sayfaları:** `SectorPage.astro` + `SectorFeatureCard.astro`,
  `getStaticPaths()` ile `sectorContent.ts`'teki `listSectorSlugs()`'tan
  üretilir (48 gerçek sayfa).
- **Hub sayfaları** (İK genel bakış): `HubPage.astro` + `HubTileCard.astro`.
- **Ana sayfa:** `getStaticPaths()` YOK — 4 ayrı statik dosya
  (`index.astro`, `en/index.astro`, `nl/index.astro`, `it/index.astro`).
  Bir bölüm eklenirken **4 dosyanın da** güncellenmesi gerekir.
- **Tekil özel sayfalar** (Hakkımızda, İletişim, Güvenlik, KVKK, Tüketici
  Hakları, Fiyatlar, Online Sunum Talebi, Hedef Global Marka, Neden
  İdenfit, Donanım, Müşteriler, SSS): her biri kendi component'i + veri
  dosyası, `miscPagesContent.ts`/`pricingContent.ts`/`hardwareContent.ts`/
  `faqContent.ts`/`customerStories.ts` altında.
- **Dil değiştirici override'ı** (`Header.astro`'nun `localeUrls?:
  Partial<Record<Locale,string>>` prop'u): per-locale slug'lar
  GERÇEKTEN farklıysa ilgili `get*LocaleUrls()` fonksiyonuyla override
  edilir. Opt-in.

### `position:fixed` dialog/modal/overlay kuralı (kalıcı)
`<header>` `backdrop-blur` kullanıyor — CSS spesifikasyonu gereği bu,
altındaki `position:fixed` elemanlar için containing block'u viewport
yerine **header'ın kendisi** yapar. **Kural: `<header>`'ın (veya başka
bir `backdrop-filter`/`filter`/`transform` içeren atanın) altına
`position:fixed` bir dialog/modal/overlay eklenirse, `createPortal` ile
`document.body`'ye taşınmalı** (bkz. `MobileMenu.tsx`'teki uygulama).

### z-index/stacking context kuralı (kalıcı, 2026-08-13'te bulunan derse dayanır)
Sayfa genelinde absolute/fixed-positioned bir dropdown/popover/overlay
eklenirken, komşu bir elemente göre "yeterli" görünen düşük bir
z-index İLE YETİNİLMEMELİ — sayfanın TAMAMINDA güvenle üstte kalacak
yüksek bir değer (`z-40`+) baştan seçilmeli (bkz. `IconDropdown`'ın
`z-50`'si, Hero'nun dekoratif görselinin altında kalan ilk denemenin
düzeltmesi).

### Footer (src/components/Footer.astro, src/data/footer.ts)
4 kolon (marka/iletişim/sosyal + HAKKINDA 6 link + ÜRÜNLER 8 link +
GENEL 6 link) + alt bar. Yapı `footer.ts`'de, metin i18n'de. Per-locale
slug'ı generic `l(slug)`'la çözülemeyen anahtarlar `SPECIAL_HREFS`
haritasından çözülür.

### Blog dil stratejisi (mimari karar)
Tüm blog yazıları Türkçe (622 yazı). Diğer dillerdeki sayfalardan blog
linki görünür ama içerik çevrilmez. `/en/blog/`, `/nl/blog/`, `/it/blog/`
`i18n.fallback` zinciri sayesinde otomatik bare TR sayfasına redirect olur.

### Blog Content Collection (astro:content)
Blog, projenin geri kalanındaki `get*Content()` deseninden BİLİNÇLİ
olarak farklı bir yaklaşım kullanır: Astro Content Collections. Yapı:
- `src/content.config.ts` — koleksiyon şeması (zod). **Dikkat:** Astro
  6+'da eski `src/content/config.ts` konumu kaldırıldı, yeni konum
  `src/content.config.ts` (src kökünde).
- **Composite loader (2026-08-04):** `glob()` (göç etmiş `.md` dosyaları)
  ile `file()` tabanlı bir `posts.json` okuyucusunu (henüz göç etmemiş
  kalıntı) AYNI collection'da birleştiriyor. Sıra kritik: `file()`
  loader her senkronizasyonda `store.clear()` çağırıyor (glob'un
  entry'lerini SİLERDİ), `glob()` ise `untouchedEntries` mekanizmasıyla
  store'u temizlemeden senkronize oluyor — glob ÖNCE, JSON ekleme SONRA.
  Legacy yazılar `context.renderMarkdown()` ile `render(entry)`'nin
  okuyabileceği aynı `RenderedContent` şekline çevriliyor.
- `src/content/blog/posts.json` — legacy veri, `scripts/extract-blog-posts.mjs
  <slug1> [slug2 ...]` ile üretilir (toplu "hepsini işle" modu yok,
  `--all` var ama günlük iş akışı gözden geçirmeli kalıyor). Göç etmiş
  yazılar `scripts/migrate-blog-to-markdown.mjs <slug...>` ile
  `src/content/blog/<slug>.md`'ye taşınıyor (otomatik HTML→Markdown).
  `scripts/fetch-blog-taxonomy.mjs` kategori/tag id→isim eşlemesini
  önbelleğe alır.
- `src/data/blogContent.ts` — sayfa-tipinden bağımsız yardımcılar.
- Sayfalar: `src/pages/blog/index.astro` + `src/pages/blog/page/[page].astro`
  (bilinçli olarak `[slug]` ile route çakışmasını önlemek için ayrı
  `page/` alt yolu) + `src/pages/blog/[slug].astro`.
- İçerik gövdesi hem legacy (JSON, `set:html`) hem göç etmiş (Markdown,
  `render(entry)`+`<Content />`) TEK render boru hattından geçiyor.

---

## Sayfa/İçerik envanteri

Detaylı tablo/liste: **`docs/page-inventory.md`** (170 sayfa + 622 yazı,
kategorize + önceliklendirilmiş; `node scripts/page-inventory.mjs` ile
yeniden üretilebilir).

**Sayfalar (170+):** A-KRİTİK 126 (Ana Sayfa/Hakkımızda/İletişim/Fiyatlar/
KVKK-Gizlilik-Sözleşmeler/Online-Sunum-Talebi-CTA/Ürün-Modül — 89+ modül
sayfası), B-ÖNEMLİ 34, C-İKİNCİL 3, D-DÜŞÜK 7 — tamamı tamamlandı (bkz.
§Güncel durum/Açık noktalar).

**Blog (622 yazı):** ✅ TAMAMLANDI, `/blog/<slug>/` altında yayında
(618 legacy JSON + 4 Markdown pilot, kademeli göç devam ediyor, Açık
nokta #21).

**Sektör sayfaları — per-locale gerçek slug tablosu** (TR slug soldaki
sütun, EN/NL/IT `link` alanından):

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
tanımlı; kaynak: `reference/wordpress-export/products.json`. 23 sayfa
grubu (18 modül + Puantaj + 2 hub + Demirbaş + Seyahat) tamamlandı.

**Diğer tekil sayfaların route'ları:** KVKK (`kisisel-verilerin-korunmasi`
/`data-use-policy`/IT kendi slug'ı, NL→EN redirect) + KVK Protokol
(`kvk-protokol`/`kvk-protocol`), Online Sunum Talebi (`online-sunum-talebi`,
4 dilde aynı slug — NL gerçek sayfa, `PRESENTATION_NL_OVERRIDE`), Fiyatlar
(`fiyatlar`/`pricing`/`prijzen`/`prezzi`), İletişim
(`iletisim`/`contact`/`contatti`/`mededelingen`), Tüketici
Hakları/Mesafeli Satış/Güvenlik/Gizlilik ve Güvenlik Politikası (TR/EN/IT,
NL→EN elle redirect), Hedef Global Marka/Neden İdenfit (4 dil), Hakkımızda
(`hakkimizda`/`about`/`over`/`chi-siamo`), SSS (`sss`/`faq`/`faq`, NL→EN
fallback), Donanım (`donanim`/`hardware`/`hardware`/`hardware`), Müşteriler
(`musteriler`, 4 dilde aynı slug), Destek Talebi
(`destek-talebi`/`support-request`/`richiesta-supporto`, NL→EN redirect),
Dijital İK Olgunluk Testi (`ik-dijital-olgunluk-testi`, yalnızca TR —
KARAR 2), Demirbaş Yönetimi Modülü (`demirbas-yonetimi-modulu`/
`en/fixed-asset-management-module`), Seyahat ve Görevlendirme Yönetimi
Modülü (`seyahat-ve-gorevlendirme-yonetimi-modulu`/
`en/travel-and-assignment-management-module`).

**404 sayfası (2026-08-11):** TR kökte `src/pages/404.astro` (Astro'nun
özel muamelesiyle bare `/404.html`'e derlenir). EN/NL/IT'de AYNI isimde
(`en/404.astro`) bir dosya İ18N FALLBACK ile çakıştığı için `src/pages/en/
not-found.astro` (route: `/en/not-found/`, aynı desen NL/IT'de) +
`public/_redirects`'in (Cloudflare Pages formatı) `/en/* /en/not-found/
404` kurallarıyla bağlı — bkz. Açık nokta #30 (canlıda henüz
doğrulanmadı) ve §Mimari.

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
| `menu-surface` | `#F2F2F2` | Mega-menü panel zemini |

Not: Paragraf gövdesi için kit'in açık grisi (`#808080`) yerine
okunabilirlik/WCAG kontrastı için `#333333` seçildi; `#808080` yalnızca
`muted` metin için.

### Font
**Quicksand** (Google Fonts) — başlık ve gövde dahil her yerde. Fallback:
`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
Tailwind utility: `font-sans`. **İstisna: "idenfit" logosu bir font
DEĞİL** — `src/components/icons/IdenfitLogo.tsx`, kaynağın kendi elle
vektörleştirilmiş SVG'sinden birebir çıkarılmış path verisi.

### Tipografi ölçeği — gerçek ölçülen değerler
Aşağıdaki değerler kaynağın derlenmiş Elementor CSS'inden (`kit-9561.css`
global token'ları + sayfa/widget'a özel `post-*.css`) okunarak
doğrulandı. **Kesin sonuç: kaynak sitede TEK yüklenen font "Quicksand"**
— `Euclid Circular A` hiçbir CSS dosyasında yok.

| Öğe | Font-size | Weight | Line-height | Diğer | Kaynak/sınıf |
|---|---|---|---|---|---|
| Nav linkleri (ÜRÜNLER vb.) | 13px | 500 | — | renk `#C1272D` (tuğla-kırmızısı) | `.nav-link-text` |
| Butonlar (TÜM `.elementor-button`) | 15px | 700 | 1em | letter-spacing:0 | `.btn-cta` |
| H1 (Hero) | mobil 20px / `lg:` 35px | 600 | `lg:` 45px | renk `#101010` | `HeroSection.astro` |
| H1 alt paragrafı (Hero) | mobil 16px / `lg:` 20px | — | — | renk TAM `#808080`=`muted` | `HeroSection.astro` |
| H2 (standart bölüm başlığı) | 34px / `lg:` 40px | 600 | 40px / `lg:` 48px | 2 bağımsız örnekle doğrulandı | `.h2-section` |
| Footer zemini | — | — | — | `#949494` (soft gri), metin beyaz | `--color-footer-bg` |

**Dürüst sınır:** Elementor'da widget-bazlı override serbest olduğu için
TEK bir evrensel "H2/H3/body" kuralı yok — bazı özel başlıklar bu
tablodaki standarttan bilinçli olarak farklı. Tablo, TEKRAR EDEN/
DOĞRULANMIŞ kalıpları yansıtıyor.

### Tailwind kullanım kuralı
**Tailwind v4** (`@tailwindcss/vite` plugin). **`tailwind.config.mjs`
YOKTUR** — v4 yapılandırmayı CSS içinde yapar. Tema token'ları
`src/styles/global.css`'teki `@theme { … }` bloğunda tanımlı. Stil için
Tailwind utility'leri tercih edilir; token değişikliği `global.css`'teki
`@theme`'de yapılır. **Paylaşılan tipografi/buton sınıfları** (`@theme`
DIŞINDA, düz CSS, `global.css`'in altında): `.btn-cta`, `.nav-link-text`,
`.h2-section`.

---

## Mega-menü (src/data/navigation.ts, src/components/MegaMenu.tsx)

idenfit.com'un canlı header'ından çıkarılan veri. Kaynak dürüstlüğü:
- **ÜRÜNLER:** gerçek 6-kolonlu mega-menü (intro + 4 kategori + promo),
  ikonlar birebir kaynaktan (`src/components/icons/IdenfitIcons.tsx`).
  27 link × 4 dil = 108 link, tamamı doğru per-locale/anchor hedefe
  gidiyor. **Demirbaş/Seyahat sayfaları bilinçli olarak menüye
  eklenmedi** — canlı site de bu 2 sayfayı menüde göstermiyor.
- **SEKTÖRLER, KURUMSAL:** kaynakta tek kolonlu basit dropdown'lar.
  SEKTÖRLER'in `grid-cols-3` + lucide-react ikonları bilinçli tasarım
  kararı (kaynakta yok). KURUMSAL'a sağ tarafta promo kart eklendi
  (kaynakta yok, kullanıcının kendi görseliyle bilinçli yeni özellik).
- **KEŞFET:** kaynakta blog-kartı ağırlıklı karmaşık bir içerik merkezi;
  bilinçli olarak sadeleştirildi. Şema: `MegaMenuColumn` üç tipten biri
  — `'links'`, `'sublist'`, `'cards'`. İçerikler: Bloglar/Dijital İK
  Olgunluk Testi, Hesaplamalar (8 araç), Raporlar (4 gerçek kart).
  Podcastler kaynakta URL'i bulunamadığı için kalıcı olarak kaldırıldı.
- **NEDEN IDENFIT, FİYATLAR, MÜŞTERİLER:** kaynakta dropdown yok, düz link.
- Masaüstü nav breakpoint `lg`; `MobileMenu.tsx` de `lg:hidden`.
- **i18n:** `navigation.ts` yalnızca YAPI tutar; tüm METİN
  `src/i18n/*.ts`'in `mega` şemasından `buildMegaMenus(t.mega, locale)`
  ile enjekte edilir.

### Bilinen düzeltmeler (kalıcı, tekrar bozulmaması gereken davranışlar)
- **z-index/genişlik:** mega-menü paneli `<li>`'ye göre değil `<header>`'e
  göre `absolute` + `inset-x-0` konumlanıyor.
- **Anchor linkler** (`#rfid` gibi) `lWithHash()` ile çözülüyor.

---

## Proje kuralları

- **Script'ler:** Tüm yardımcı/analiz script'leri **Node.js (`.mjs`)** ile
  yazılır, **Python kullanılmaz**. Konum: `scripts/`. Çalıştırma:
  `node scripts/<ad>.mjs`. Başlıca script'ler: `page-inventory.mjs`,
  `fetch-sectors.mjs`, `fetch-faq.mjs`, `extract-products.mjs`,
  `extract-hubs.mjs`, `extract-hardware.mjs`, `extract-pricing.mjs`,
  `extract-misc-pages.mjs`, `extract-blog-posts.mjs`,
  `migrate-blog-to-markdown.mjs`, `fetch-blog-taxonomy.mjs`,
  `verify-blog-posts.mjs`, `extract-calculators.mjs`,
  `scan-remaining-modules.mjs`, `dev-clean-restart.mjs`, `localize-images.mjs`,
  `run-audit.mjs`, `audit-site.mjs` + `audit-analyze.mjs` +
  `audit-lang-consistency.mjs` + `audit-entities.mjs` + `audit-images.mjs`
  + `audit-http-status.mjs`, test script'leri (`test-*-language-switch.mjs`,
  `test-urunler-menu-links.mjs`, `test-legal-nl-consistency.mjs`,
  `test-no-external-idenfit-links.mjs`, `test-faq-language-switch.mjs`),
  `measure-dom-size.mjs` (DOM boyutu taraması — `playwright` kalıcı
  devDependency DEĞİL, `npm install --no-save playwright` ile geçici
  kurulur), `test-mobile-menu.mjs` (`MobileMenu.tsx`'in masaüstünde/
  mobilde doğru lazy-mount davrandığını doğrular),
  `check-link-accessibility.mjs` (KALICI erişilebilirlik aracı —
  erişilebilir adı olmayan `<a>` linklerini `dist/**/*.html` üzerinde
  tarar, `parse5`'e dayanır), `check-meta-description-length.mjs`
  (KALICI SEO aracı — 70-160 karakter aralığı), `check-title-length.mjs`
  (KALICI SEO aracı — 50-60 karakter aralığı), `check-image-alt-text.mjs`
  (KALICI erişilebilirlik aracı — eksik `alt` taraması, `alt=""` dekoratif
  görsel için GEÇERLİ), `check-json-ld.mjs` (KALICI structured-data
  aracı — geçerli JSON + tipine göre zorunlu/önerilen alan + ISO 8601
  tarih + `dateModified >= datePublished` doğrulaması),
  `check-heading-hierarchy.mjs` (KALICI SEO/erişilebilirlik aracı — her
  sayfada TAM 1 `<h1>` + seviye atlaması yok), `check-html-lang-attribute.mjs`
  (KALICI SEO/erişilebilirlik aracı — `<html lang>` var + URL yoluna
  göre beklenen locale'le eşleşiyor, redirect stub'larını ayrı/bilgi-amaçlı
  raporlar), `check-hreflang.mjs` (KALICI SEO aracı — kendi kendine
  referans + karşılıklılık + redirect/noindex hedef yok; `site` alanı
  boşken 0 sayfa bulup bilgi amaçlı çıkar). **Not:** bu SEKİZ
  `check-*.mjs` script'i `readdir(dir, {recursive:true})` yerine ELLE
  recursive tarama kullanıyor — bu proje OneDrive-senkronize bir
  klasörde, `recursive:true` bazen (görünürde rastgele) çok daha az
  dosya döndürdü. Yeni bir `check-*.mjs` script'i yazılırken AYNI
  elle-tarama desenine uyulmalı, VE herhangi bir tarama sonucunu
  güvenmeden ÖNCE en az 2 kez art arda çalıştırıp aynı sayıyı verdiği
  doğrulanmalı.
- **Tip güvenliği:** `npx astro check` — i18n şemasının (ve genel
  TypeScript'in) hatasız derlendiğini doğrular; VS Code'un canlı
  diagnostics'i zaman zaman stale olabilir, `astro check` güncel sonuçtur.
- **Test yaklaşımı:** Yeni bir dil değiştirici/CTA/link değişikliğinden
  sonra ilgili `test-*.mjs` script'i (dev server ayakta olmalı) +
  regresyon için mevcut diğer `test-*.mjs`'ler çalıştırılır.
- **Erişilebilirlik — ikon-only link kuralı:** Yeni eklenen her ikon-only
  link/buton (görünür metni olmayan, yalnızca bir SVG/ikon barındıran
  `<a>`) **mutlaka `aria-label` içermeli.** Elle
  `node scripts/check-link-accessibility.mjs` (önce `astro build` şart)
  ile doğrulanabilir. **Not:** blog yazısı İÇERİĞİNDEKİ (legacy WP HTML)
  benzer sorunlar `contentLinkAccessibility.ts` ile (render-time otomatik
  düzeltme) ayrı ele alınıyor, bu kural yalnızca EL İLE YAZILAN
  component/sayfa kodu için geçerli.
- **SEO — meta description kuralı:** Yeni eklenen her sayfa **70-160
  karakter aralığında, gerçek içerikten türetilmiş bir meta description
  taşımalı** — sayfa BAŞLIĞINI (title/H1) description olarak KULLANMAK
  YASAK. Elle `node scripts/check-meta-description-length.mjs` (önce
  `astro build` şart) ile doğrulanabilir.
- **SEO — `<title>` uzunluk kuralı:** Yeni eklenen her sayfa **50-60
  karakter aralığında bir `<title>` taşımalı.** Site sayfaları (blog
  HARİÇ) için `idenfit — {pageTitle}` şablonunu kullanan component'ler
  `src/data/pageTitle.ts`'in `buildIdenfitTitle(pageTitle, locale)`'ini
  ÇAĞIRMALI — 50'nin altında kalan başlıklara otomatik gerçek bir
  niteleyici ekliyor, ELLE `idenfit — ${x}` template literal'ı
  YAZILMAMALI. 60'ı aşan başlıklar otomatik KIRPILMAZ — bu durumda
  component'e `title` override prop'u (bkz. `ProductPage.astro` örneği)
  ile elle kısa bir başlık geçirilmeli. Elle
  `node scripts/check-title-length.mjs` (önce `astro build` şart) ile
  doğrulanabilir. **Blog yazıları bu kuralın DIŞINDA** — bkz. Açık
  nokta #28, ayrı/kademeli bir kapsam.
- **CTA/anchor text kuralı:** Yeni bir ürün/modül/sektör/hub sayfası
  eklendiğinde hero CTA'sı (`hero.ctaText`) OTOMATİK kontrol edilir —
  `src/data/pageTitle.ts`'in `isGenericCtaText()`'i jenerik bulursa
  `buildCtaAnchorText(ctaKeyword ?? pageTitle, locale)`'a düşülür. Elle
  bir aksiyon GENELDE GEREKMEZ — yalnızca `pageTitle` kendisi 45+
  karakterlik uzun bir tanıtım cümlesiyse, sonuç 60 karakteri aşabilir;
  bu durumda `ProductPage.astro`'ya `ctaKeyword` prop'uyla kısa, gerçek
  bir anahtar kelime geçirilmeli. Yeni bir jenerik/tekrarlayan metin
  kalıbı keşfedilirse `GENERIC_CTA_TEXTS` set'ine eklenmeli.
- **Open Graph görsel kuralı:** Yeni bir sayfa/component eklendiğinde,
  sayfanın gerçek/temsili bir görseli varsa (`hero.image`,
  `featuredImage` gibi) `<BaseLayout>`/`<LandingLayout>` çağrısına
  `image={...url}` prop'uyla geçirilmeli — verilmezse otomatik
  `HOME_PANEL_IMAGE` fallback'ine düşer (SORUN DEĞİL). Blog yazıları için
  `ogType="article"` geçirilir, diğer HER ŞEY varsayılan `website` kalır.
  Doğrulama: elle `dist/**/*.html`'de `<meta property="og:` araması.
- **JSON-LD `dateModified` güncelleme kuralı:** Bir blog yazısının
  GERÇEK içeriği düzenlendiğinde, `BlogPosting` JSON-LD'sinin
  `dateModified` alanı da güncellenmelidir. **Şu an OTOMATİK bir
  mekanizma YOK** (bilinçli, Faz 2 kapsamına girebilir): legacy yazılar
  için `scripts/extract-blog-posts.mjs` yeniden çalıştırılıp kaynağın WP
  `modified` alanı tekrar çekilirse otomatik güncellenir; göç etmiş
  `.md` yazıları için editörün frontmatter'a elle bir `modifiedDate:`
  alanı eklemesi/güncellemesi gerekir (şema destekliyor, Decap
  arayüzünde henüz widget yok). Doğrulama: `node scripts/check-json-ld.mjs`.
- **Vite bağımlılık önbelleği bozulması — KALICI ÇÖZÜM:**
  `astro.config.mjs`'in `vite.optimizeDeps`'i iki katmanlı: `force: true`
  (her başlangıçta önbelleği sıfırdan kurar) + `include: ['react',
  'react-dom', 'react-dom/client', 'lucide-react']`. **Elle
  `node_modules/.vite` silme adımı artık hiçbir senaryoda GEREKMİYOR.**
  Kalan sınıf için iki kalıcı disiplin kuralı şart:
  1. `npm install`/`npm uninstall` çalıştırılmadan ÖNCE dev server
     durdurulmalı, sonrasında `npm run dev:clean` (durdur + `dist`/`.vite`
     temizle + arka planda yeniden başlat, TEK komut) ile yeniden
     başlatılmalı.
  2. **`astro.config.mjs` dev server ÇALIŞIRKEN düzenlenirse**, Astro'nun
     kendi otomatik soft-restart'ına GÜVENİLMEMELİ. Config dosyası
     düzenlendikten SONRA mutlaka `npm run dev:clean` ile TAM bir
     process kill+restart yapılmalı.
  3. **Sık karşılaşılan sorun: navbar/marquee/form kayboluyor (React
     hydration hatası).** Kullanıcı "dev:clean ile düzelt" dediğinde,
     Claude Code otomatik olarak (1) `npm run dev:clean` çalıştırır, (2)
     `npx astro dev logs` ile `_jsxDEV`/`program reload`/`TypeError`
     hatası olmadığını doğrular, (3) `curl` ile ana sayfayı çekip React
     island'ların hepsinin `<astro-island>` olarak render edildiğini
     doğrular, (4) kullanıcıya "düzeldi, sert yenile" der — ek onay
     sormadan.
  4. **`npm install`/paket güncellemesi SONRASI VS Code'un Problems
     panelinde onlarca sahte hata çıkabilir.** Kök neden VS Code'un
     kendi TypeScript/Astro dil sunucusunun bayat önbelleği. `npx astro
     check` HER ZAMAN doğru sonucu verir — IDE'nin Problems panelindeki
     sayıya güvenmeden önce mutlaka `astro check` ile çapraz
     doğrulanmalı. **Çözüm kod tarafında DEĞİL, kullanıcının
     editöründe:** Command Palette → `TypeScript: Restart TS Server`
     (veya `Astro: Restart Language Server` / `Developer: Reload
     Window`). Claude Code bunu kendisi tetikleyemez, kullanıcıya
     talimat olarak iletilmeli.
- **Proje temposu:** Haftalık hedeflerle ilerlenir, toplam süre önceden
  belirlenmez. Her hafta sonu değerlendirme yapılır. **Kalite > Hız.**
- **Güvenlik taraması alışkanlığı:** `npm run audit`
  (`scripts/run-audit.mjs`'i çağırır) **her önemli değişiklik öncesi/
  deploy öncesi** çalıştırılmalı. Kritik/yüksek seviye bulunursa `npm
  audit fix` uygulanıp **mutlaka** regresyon testleri tekrar koşulmalı.
  Düşük/orta seviye bulgular §Açık noktalar'a not düşülüp periyodik
  takibe alınır. **Not:** `npm run audit` script'inin sarmalayıcıya
  ihtiyaç duymasının nedeni bu sandbox ortamına özgü bir
  `npm_config_allow_scripts` env kalıtım çakışması — gerçek bir güvenlik
  açığı değil, yalnızca `npm run` üzerinden çağrıldığında ortaya çıkan
  bir tooling quirk'ü.

## Development
Dev server'ı arka planda başlat: `astro dev --background`. Yönetim:
`astro dev stop`, `astro dev status`, `astro dev logs`.

**`npm install`/`npm uninstall` çalıştırdıktan sonra** (dev server açık
olsun olmasın) `npm run dev:clean` ile yeniden başlatın. Üretim build
testi (`astro build`) sonrası dev server'a dönerken de aynı komut
kullanılabilir (`dist/` çıktısını da temizler).

## Deployment
**Faz 1 (mevcut):** Tüm statik içerik Astro ile migrate edilip Cloudflare
Pages'e static olarak deploy edilecek.
**Faz 2 (ileride):** Dinamik/interaktif kısımlar (form backend'i, olası
arama/kullanıcı işlemleri) Cloudflare Pages Functions ile eklenecek.
Şu anki mimari (`output: 'static'`, `HeroForm`'un backend'siz `console.log`
hali) bu plana zaten uyumlu. **İçerik yönetim paneli için Decap CMS
seçildi** (bkz. §Açık noktalar #19) — en düşük saldırı yüzeyine sahip
seçenek çünkü kendi sunucu/API/veritabanı gerektirmiyor, GitHub OAuth
kullanıyor, içerik git deposunda Markdown olarak tutuluyor. Kurulum Faz
2'de yapılacak.

---

## WordPress Kaynak Sitesi (reference/wordpress-export/)

Kaynak site: `idenfit.com` (İK/HR SaaS). WordPress REST API export'u.
İçerik: `posts.json` (622 yazı, tümü TR), `pages.json` (170+ sayfa, 4
dil), `media.json` (2211 medya kaydı), `sectors.json` (48 sayfa), `faq.json`
(90 kayıt).

Eklentiler: **Elementor** (page builder), **ACF** (custom field), **Yoast
SEO** (`yoast_head_json`), **Polylang** (`pll_language`, `pll_translations`).

### Custom post type'lar (standart export'a dahil DEĞİLDİ)
Orijinal export yalnızca `page`/`post`/`media` çekmiş, `wp/v2/types` hiç
sorgulanmamıştı. Gerçekte var olan ek CPT'ler:
- **`sectors`** — 12 sektörün 4 dildeki tam sayfaları (✅ çekildi).
- **`faq`** — 90 kayıt (TR/EN/IT 30'ar, NL yok) (✅ çekildi).
- **`portfolio`** — amacı/kullanımı doğrulanmadı, düşük öncelik.

**Ders:** bir içeriğin "WP'de yok" sonucuna varmadan önce `wp/v2/types`
ile TÜM post type'lar kontrol edilmeli, yalnızca `pages.json`/`posts.json`'a
bakılmamalı.

### Dil dağılımı
- **Posts:** `pll_language` yok, tüm yazılar Türkçe.
- **Pages:** `pll_language` var — `tr`=55, `en`=48, `it`=40, `nl`=27.

### Custom field / meta anahtarları (sayfalarda, ~500+ farklı anahtar)
Başlıca gruplar: SSS (`question_N`/`answer_N`), Hero/başlık (`page_title`,
`hero_title`, `hero_image`, `video_url`), Bölümler
(`section_N_{title,text,image,cta_text,cta_url}`), İletişim, Sosyal
medya, Referans/müşteri blokları, Ürün listeleri, Fiyatlandırma. Aynı
anlamı taşıyan tekrar/typo'lu anahtarlar var — extraction script'lerinde
normalize ediliyor (bkz. §Mimari — ACF şema çeşitliliği).

### Açılmamış arşivler
`themes.zip` (~22 MB) — açılmadı. `uploads.zip` (~1.4 GB) — kısmen işlendi
(bkz. Açık nokta #14).

---

## Documentation

Full documentation: https://docs.astro.build

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
