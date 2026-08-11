## Proje Özeti

idenfit.com (İK/HR SaaS) WordPress'ten Astro'ya migrasyon. Astro + React
island mimarisi, i18n (tr/en/nl/it), Tailwind v4, `output:'static'` →
Cloudflare Pages. Genel durum: ana sayfa, mega-menü, tüm ürün/modül
sayfaları (18 modül + Puantaj + 2 hub + Demirbaş/Seyahat), 12 sektör
sayfası, 622 blog yazısı (618 JSON + 4 Markdown pilot), Müşteriler,
Destek Talebi, Hesaplama Araçları, Dijital İK Olgunluk Testi, Fiyatlar,
Hakkımızda, İletişim, SSS, KVKK/hukuki sayfa ailesi (+ KVK Protokol),
Footer/Header tamamlandı. Site denetim raporu (14 madde) + kapsamlı URL
denetimi (853 canlı URL karşılaştırması) kapandı. Şu anki odak: Landing
Page (reklam trafiği) + Blog CMS (Decap) kademeli üretimi.

**Eski günlük detayları (tarih damgalı arşivler, nadiren gerekir):**
`docs/claude-md-archive-2026-08-06.md` (2026-07-21→2026-08-06 tam günlük,
bu dosyanın sadeleştirilmeden önceki hali), `docs/claude-md-archive-2026-07-31.md`,
`docs/claude-md-archive-2026-07-28.md`, `docs/claude-md-archive-2026-07-23.md`.

---

## Proje Durumu (son güncelleme: 2026-08-11)

**🟢 SİTE GENELİ — GÖRSEL `alt` METNİ DENETİMİ TAMAMLANDI (2026-08-11,
2026-08-10'da yarım kalan bir turun devamı).** Önceki oturumda
`scripts/check-image-alt-text.mjs` (5. kalıcı `check-*.mjs` aracı — bkz.
title/meta-description/link-accessibility/json-ld) yazılmış ama hiç
sonuca bağlanmamıştı; yanında `_tmp-investigate-icons.mjs` adlı bitmemiş
bir keşif script'i kalmıştı. Bu tur ikisini de kapattı.

**İki ayrı ihlal sınıfı test edildi (WCAG 1.1.1 / axe-core ile aynı
mantık, script'in kendi yorumunda dokümante):** `alt` özniteliği TAMAMEN
YOK (her zaman ihlal) vs. `alt=""` (boş string, dekoratif görsel için
GEÇERLİ/bilinçli, ihlal DEĞİL). `check-image-alt-text.mjs` → **0/2368
dosyada eksik `alt`** (3 kez art arda çalıştırılıp istikrar doğrulandı,
bkz. §Proje kuralları OneDrive `readdir` flakiness notu) — sert ihlal
sınıfı zaten temizdi.

**Asıl bulgu, yumuşak bir ihlal sınıfındaydı:** `_tmp-investigate-icons.mjs`
`alt` DOLU ama WP dosya adından türeyen anlamsız metin taşıyan görselleri
arıyordu (ör. `alt="sektor vardiya icon"`, `alt="sektor pdks icon 1 1"`)
— **14 benzersiz görsel**, hepsi `SectorFeatureCard.astro`'nun modül
ikonları (`sektor-*-icon.svg`, 12 sektör sayfası × 4 dilde tekrarlı).
Kök neden: `image.alt={image.alt}` ham WP kaynağını olduğu gibi
basıyordu. **Düzeltme:** bu ikonlar her zaman görünür bir
`<h3>{title}</h3>`'ün hemen yanında (ekran okuyucu için tekrar/gürültü),
component'in kendi SVG fallback dalı zaten `aria-hidden="true"` ile aynı
dekoratif muameleyi yapıyordu — tutarlılık için `alt=""`'e çevrildi
(script'in kendi kuralına göre GEÇERLİ dekoratif işaret). Kapsam yalnızca
`SectorFeatureCard.astro`'nun küçük modül ikonlarıyla sınırlı — aynı
component dosyasındaki hero/`whyIdenfit` fotoğrafları (`SectorPage.astro`
satır 61/83, ayrı render noktaları) taramada hiç işaretlenmedi, gerçek/
anlamlı alt metinleri olduğu için dokunulmadı.

**Kanıt:** düzeltme sonrası hem `check-image-alt-text.mjs` (0 eksik) hem
`_tmp-investigate-icons.mjs` (14→0) doğrulandı, geçici script artık
gereksiz olduğu için silindi. `astro check` 0 hata (319 dosya), `astro
build` 877 sayfa, `check-link-accessibility.mjs` 0 ihlal (regresyon yok).
Tek satırlık, görsel etkisi olmayan bir değişiklik (alt metni ekranda
görünmez) — Chrome doğrulaması gerekmedi.

---

## Proje Durumu — 2026-08-10 girdisi, JSON-LD turu (tarihsel, o turda doğruydu)

**🟢 SİTE GENELİ — JSON-LD (STRUCTURED DATA) SIFIRDAN KURULDU, 622 BLOG
YAZISINA `dateModified` DAHİL (2026-08-10, title turunun devamı).**
Kullanıcı "mevcut JSON-LD'ye `dateModified` ekle" istedi — tarama sitede
**HİÇBİR JSON-LD olmadığını** ortaya çıkardı (`BaseLayout.astro` dahil
hiçbir component'te `application/ld+json` yoktu). Kullanıcıya soruldu,
**yalnızca blog (`BlogPosting` şeması) şimdi kurulsun** kararı alındı
(ürün/sektör/kurumsal sayfalar ayrı bir karara bırakıldı).

**Veri kaynağı (kullanıcının hipotezi doğruydu, yalnızca hiç
kullanılmıyordu):** legacy yazılarda (`posts.json`) WP'nin gerçek
`modified` alanı zaten `modifiedDate` olarak çıkarılıyordu
(`extract-blog-posts.mjs`) — ama `content.config.ts`'in
`legacyJsonLoader`'ı bu alanı `modifiedDate: _modifiedDate` ile BİLİNÇLİ
OLARAK atıyordu (discard). Şema (`blogSchema`) `modifiedDate: z.coerce.date().optional()`
ile genişletildi, loader artık atmıyor. Göç etmiş `.md` yazılarında
(Decap CMS, henüz düzenleme-tarihi takibi YOK) bu alan hiç yok —
`[slug].astro`'da `modifiedDate ?? date` ile yayın tarihine düşüyor
("hiç düzenlenmemişse mantıklı bir varsayım", kullanıcı kararı).

**`src/pages/blog/[slug].astro`'ya eklenen `BlogPosting` şeması:**
`headline`/`description`/`image`/`datePublished`/`dateModified`/
`author`/`publisher`/`mainEntityOfPage`. `mainEntityOfPage.@id` göreli
bir yol (`Astro.url.pathname`) — proje henüz kalıcı bir prod domain'e
sahip değil (`astro.config.mjs`'in `site` alanı boş), mutlak bir URL
İCAT EDİLMEDİ. `publisher.logo`/eksik `image` fallback'i gerçek, canlı
idenfit.com barındırılan logo dosyası (`idenfit-logo.svg`) — uydurulmadı.
**Yan bulgu:** 1 yazı (`zirve-katilim-ix-...`) `featuredImage: null`
taşıyordu (kaynağın kendi "617/618 geçerli featured_media" eksikliği,
zaten bilinen) — Google'ın Article/BlogPosting rich result'ları `image`i
ZORUNLU kıldığı için aynı logo fallback'ine düştü.

**Yeni kalıcı araç — `scripts/check-json-ld.mjs`:** internet erişimi
olmadan Google Rich Results Test/schema.org validator'ının kurallarını
YEREL uyguluyor (`@context`/`@type` zorunlu alanları, `BlogPosting` için
`headline`/`image`/`datePublished` zorunlu + `dateModified`/`author`/
`publisher` önerilen, ISO 8601 format doğrulaması, `dateModified >=
datePublished` mantık kontrolü). **Kanıt:** 622/622 blog yazısı geçerli
`BlogPosting` bloğu üretiyor, 0 geçersiz, 0 uyarı (3 kez art arda
çalıştırılıp istikrar doğrulandı — bkz. OneDrive `readdir` flakiness
notu, §Proje kuralları). Regresyon: `astro check` 0 hata, `astro build`
877 sayfa, 6 regresyon script'i + `check-link-accessibility`/
`check-meta-description-length`/`check-title-length` (hepsi önceki
turlardaki AYNI, regresyonsuz sonuçları verdi) geçti. Chrome'da JSON-LD
tarayıcıda doğru parse edildiği + sayfada görsel fark olmadığı
doğrulandı (bu arada bilinen Vite bağımlılık önbelleği hydration hatası
bir kez daha görüldü, `dev:clean` ile standart prosedürle düzeldi —
JSON-LD değişikliğiyle İLGİSİZ).

---

## Proje Durumu — 2026-08-10 girdisi, title uzunluk turu (tarihsel, o turda doğruydu)

**🟢 SİTE GENELİ — `<title>` UZUNLUK DENETİMİ + 194 BLOG-DIŞI SAYFA
DÜZELTİLDİ (2026-08-10, meta description turunun devamı).** Kullanıcının
verdiği örnek ("Çalışma Hayatında Tükenmişlik Sendromu - idenfit", 48
karakter, hedef 50-60) bir BLOG yazısıydı — sistematik tarama blog
title'larının kapsamının beklenenden ÇOK daha büyük olduğunu ortaya
çıkardı: **yeni `scripts/check-title-length.mjs` (kalıcı araç) 2368 HTML
dosyasını taradı, toplam 629 sorunlu sayfa buldu (436 kısa, 193 uzun) —
bunun %69'u (435/629) blog yazıları (622 yazının 435'i!).** Blog'un kök
nedeni MEKANİK değil (`${başlık} — idenfit Blog`, başlık uzunluğu doğal
olarak değişken) — kullanıcıya net sorulup **blog title'ları BİLİNÇLİ
olarak ayrı, daha büyük bir tura ERTELENDİ** (bkz. Açık nokta #28).
**Bu turda yalnızca 194 blog-dışı sayfa (187 kısa + 7 uzun) düzeltildi**
— kök neden MEKANİK: 14 component `idenfit — ${pageTitle}` şablonunu
kullanıyor, `pageTitle` genelde kısa bir modül/sektör adı (özellikle
EN/IT/NL çevirileri TR'den kısa, ör. "idenfit — Retail" 17 karakter).

**Çözüm — `src/data/pageTitle.ts` → `buildIdenfitTitle()`:** `idenfit —
{pageTitle}` 50 karakterin altındaysa, idenfit'in gerçek kategorisini
(İK/HR yönetim yazılımı) anlatan 5 kademeli gerçek ifadeden (kısadan
uzuna, 4 dilde kopya çeviri DEĞİL) en uygun olanı ` | ` ile ekleniyor —
187 sayfalık gerçek veri setine karşı simüle edildi, **%95'i (178/187)
otomatik olarak 50-60 aralığına düştü.** 14 component (`ProductPage`/
`SectorPage`/`FaqPage`/`ContactPage`/`PresentationRequestPage`/
`PricingPage`/`LegalPage`/`HubPage`/`AboutPage`/`SecurityPage`/
`SupportRequestPage`/`ThankYouPage`/`CustomerStoriesPage`/
`CalculatorsPage`) + ana sayfa (4 dil) + `LandingPage`/`HrMaturityTestPage`
bu fonksiyona geçirildi. **7 ÇOK UZUN sayfa** (Donanım'ın EN/IT/NL uzun
hero cümlesi, IT ana sayfa, IT "Neden idenfit", Demirbaş TR, Güvenlik TR)
elle kısa, gerçek başlıklarla değiştirildi (`title` override prop'u,
H1 DEĞİŞMEDİ). **Yan bulgu (gerçek içerik bug'ı):** IT'nin Tüketici
Hakları/Mesafeli Satış sayfalarının kaynak WP title'ı İngilizce + anlamsız
"_IT" soneki taşıyordu ("Consumer Rights Agreement_IT") — `PRIVACY_SECURITY_IT_TITLE`'daki
AYNI, daha önce bilinen kaynak hatası, şimdi gerçek İtalyanca başlıklarla
düzeltildi (hem H1 hem `<title>`).

**Kanıt:** 187 kısa → 1 kaldı (yalnızca `/admin/`, Decap paneli, bilinçli
kapsam dışı), 7 uzun → 4 kaldı (61-63 karakter, hedefin yalnızca 1-3
karakter üzerinde — "PDKS" gibi doğal olarak uzun modül adları, kabul
edilebilir sınır-yakını sonuç). **Yan bulgu:** üç check script'inin
(`check-title-length`/`check-meta-description-length`/`check-link-accessibility`)
`readdir(dir, {recursive:true})` kullanımı bu OneDrive-senkronize
klasörde GÜVENİLMEZ çıktı (bazen 2368 yerine 1 dosya döndürdü) — elle
recursive taramaya çevrilip 3 kez art arda çalıştırılarak istikrar
doğrulandı (bkz. §Proje kuralları). Regresyon: `astro check` 0 hata,
`astro build` 877 sayfa, 6 regresyon script'i + `check-link-accessibility.mjs`
(0 ihlal) + `check-meta-description-length.mjs` (yalnızca `/admin/`)
geçti — önceki iki SEO/erişilebilirlik turundan regresyon YOK. Chrome'da
görsel fark olmadığı doğrulandı (H1 aynı, yalnızca `<title>` etiketi
değişti).

---

## Proje Durumu — 2026-08-10 girdisi, meta description turu (tarihsel, o turda doğruydu)

**🟢 SİTE GENELİ — META DESCRIPTION UZUNLUK DENETİMİ + 43 SAYFA DÜZELTİLDİ
(2026-08-10, erişilebilirlik turundan SONRAKİ, ayrı bir SEO turu).**
Kullanıcının verdiği örnek ("KVKK Aydınlatma Metni", 21 karakter)
tarama sonucunda BİREBİR bulunamadı (o sayfanın description'ı zaten
160 karakterdi) — **ama tam da o örneğin işaret ettiği KÖK NEDEN bug'ı
bulundu ve daha geniş kapsamlı çıktı.** Yeni `scripts/check-meta-description-length.mjs`
(kalıcı araç, `parse5` tabanlı, redirect stub'larını hariç tutuyor —
bkz. Açık nokta #27) 878 gerçek içerik sayfasını taradı: **25 sayfa <70
karakter, 4 sayfa >160 karakter, 1 eksik** (`/admin/`, Decap CMS paneli,
bilinçli olarak kapsam dışı — SEO'ya konu olan bir içerik sayfası değil).

**Kök neden #1 (asıl bug, KVKK örneğiyle aynı sınıf):** `LegalPage.astro`
description'ı `content.contentHtml`'in HAM ilk 160 karakterinden
üretiyordu — hukuki belgeler şirket ünvanı/adresiyle BAŞLADIĞI için sonuç
bir özet değil, ham adres bloğuydu (ör. "Ünvanı : Idenfit Bilişim
Hizmetleri..."), 14 sayfanın (8 hukuki belge × 3-4 dil varyantı: KVKK,
KVK Protokol, Gizlilik ve Güvenlik Politikası, Mesafeli Satış Sözleşmesi,
Tüketici Hakları) TAMAMINDA. `description` prop'u eklendi, her sayfa artık
gerçek, elle yazılmış bir açıklama geçiriyor (verilmezse eski davranışa
düşer — bkz. component'teki kök neden yorumu).

**Kök neden #2 (title-as-description bug'ı, 4 component):** `FaqPage.astro`/
`ContactPage.astro`/`PresentationRequestPage.astro`/`PricingPage.astro`
sayfa BAŞLIĞINI (H1'in kendisini) description olarak kullanıyordu (ör.
SSS "Sıkça Sorulan Sorular" 21 karakter, EN Contact "Contact Us" 10
karakter) — sayfa başlığı H1 için DOKUNULMADI, yalnızca meta description
için ayrı, gerçek içerikten türetilen bir alan eklendi (FAQ'nin 6 gerçek
kategorisi, Contact'ın gerçek başlık+alt başlığı, Presentation'ın gerçek
madde metinleri, Pricing'in gerçek Mikro/KOBİ/Pro paket isimleri).

**Kök neden #3 (gerçek ama kısa içerik, 2 component):** `SectorPage.astro`/
`ProductPage.astro`'nun `hero.text` fallback'i bazı sayfalarda (7 sektör
kombinasyonu, 7 ürün sayfası) 70 karakterin altında kaldı — ikisine de
opsiyonel `description` override prop'u eklendi (`SecurityPage.astro`
ile AYNI desen), her açıklama o sayfanın KENDİ `whyIdenfit.text`/
`sections`'ından sentezlendi, kopya çeviri YOK.

**Kök neden #4 (paylaşılan, görünür metinden türetilen, 2+2 sayfa):**
Ana sayfanın NL/IT description'ı `t.hero.description`'dan (görünür hero
alt başlığıyla PAYLAŞILAN, canlı siteyle doğrulanmış gerçek metin)
geliyordu ve 160'ı aşıyordu — yeni `truncateAtWord()` yardımcısı (`src/data/metaDescription.ts`)
YALNIZCA meta etiketi için kelime sınırında kırpıyor, görünür hero metni
DEĞİŞMEDİ. `guvenlik`(TR)/`it/politica-di-sicurezza`'nın (Güvenlik hub
sayfası, `SECURITY_META`) description'ları da aynı sebeple (169/173
karakter) kısaltıldı.

**Kanıt:** düzeltme sonrası `check-meta-description-length.mjs` → 0 kısa,
0 uzun (yalnızca beklenen `/admin/` "eksik" kalıyor). Chrome'da
`kisisel-verilerin-korunmasi` sayfası doğrulandı: yeni description (136
karakter) doğru render ediliyor, H1/gövde içeriği BİREBİR aynı kaldı
(aria-label gibi, meta description da görsel etkisi olmayan bir etiket).
Regresyon: `astro check` 0 hata, `astro build` 877 sayfa, 6 regresyon
script'i + `check-link-accessibility.mjs` (0 ihlal, önceki turdan
regresyon yok) geçti. `parse5` zaten kalıcı devDependency'ydi (bir
önceki erişilebilirlik turundan), bu tur için ek bağımlılık gerekmedi.

---

## Proje Durumu — 2026-08-10 girdisi, erişilebilirlik turu (tarihsel, o turda doğruydu)

**🟢 SİTE GENELİ — ERİŞİLEBİLİR ADI OLMAYAN `<a>` LİNKLERİ BULUNDU +
DÜZELTİLDİ (2026-08-10, DOM boyutu turundan SONRAKİ, ayrı bir erişilebilirlik
turu).** Kullanıcının başlangıç hipotezi ("6 icon-only link — WhatsApp/
telefon/sosyal medya butonları") bu kod tabanı için **yanlış çıktı**:
`Footer.astro`/`FloatingContactButtons.astro`/`MegaMenu.tsx` kodu
okunarak zaten `aria-label` taşıdıkları doğrulandı, ana sayfanın 116
`<a>`'sı sıfır ihlalle tarandı. **Gerçek sorun farklı bir yerdeydi:**
yeni `scripts/check-link-accessibility.mjs` (kalıcı araç, `parse5`
tabanlı — bkz. §Proje kuralları "Erişilebilirlik") ile tüm site (2368
HTML) tarandığında 19 benzersiz sorunlu link bulundu, TAMAMI blog yazısı
İÇERİĞİNDE (legacy WP HTML, `posts.json`), site bileşenlerinde DEĞİL:
13'ü `<a href="..."><img alt="" ...></a>` (WP'nin kendi boş bıraktığı
banner-CTA görselleri), 4'ü tamamen boş dış link, 2'si yalnızca boşluk
karakteri. **Düzeltme (kullanıcı onayıyla "render-time otomatik"
seçeneği alındı):** yeni `src/data/blogContentAccessibility.ts`'in
`fixLinkAccessibility()`'i `content.config.ts`'in `legacyJsonLoader`'ına
(`renderMarkdown()`'dan HEMEN ÖNCE) bağlandı — üç kademeli strateji: (1)
aynı `<figure>` içinde bir `<figcaption>` varsa metni `aria-label` olarak
kullanılıyor (13/19, kaynağın KENDİ yazdığı en doğru bağlamsal metin),
(2) yoksa `href`'ten türetiliyor (idenfit.com içi → slug'dan okunur
başlık, ör. "Calisan Ozluk Yonetimi Modulu sayfası"; dış site →
"Dış kaynak: {hostname}"), (3) `href` bile YOKSA (tamamen boş `<a></a>`,
hiçbir işlevi yok) sahte bir etiket UYDURMAK yerine anchor UNWRAP
ediliyor. **Genel/kalıcı bir mekanizma** — yalnızca bulunan 19'u değil,
618 yazının HERHANGİ birinde gelecekte çıkabilecek benzer sorunları da
otomatik kapsıyor (kademeli blog göçü tamamlanana kadar geçerli, bkz.
Açık nokta #21). `parse5` bu tur için KALICI bir `devDependency` olarak
eklendi (`playwright`'ın diagnostik script'ler için kullanılan geçici-
kurulum deseninden BİLİNÇLİ olarak farklı — bu script projede kalıcı
kalacak bir araç). Yeni proje kuralı: "yeni eklenen her ikon-only link/
buton mutlaka `aria-label` içermeli" (bkz. §Proje kuralları).

**Kanıt:** düzeltme sonrası `check-link-accessibility.mjs` → 0 ihlal
(19→0). Normal/etiketli linkler bire bir korundu (`gig-ekonomisi`
yazısının 51 linki spot-check edildi, hepsi aynı). Chrome'da hem
`javascript_tool` ile (`aria-label` doğru render edildi) hem ekran
görüntüsüyle görsel fark OLMADIĞI doğrulandı (aria-label ekran okuyucu
için, DOM'a görünür bir etki yapmaz). Regresyon: `astro check` 0 hata,
`astro build` 877 sayfa, 6 regresyon script'i (link/dil geçişi) geçti.

---

## Proje Durumu — 2026-08-10 girdisi, site geneli DOM turu (tarihsel, o turda doğruydu)

**🟢 SİTE GENELİ — DOM BOYUTU (Chrome "1501 element" uyarısı) TESPİT
EDİLDİ + MobileMenu DÜZELTİLDİ (2026-08-10, site geneli tur — landing
page turlarından AYRI, tüm site geneli etkiliyor).** Kullanıcı talebiyle
sistematik bir DOM boyutu taraması yapıldı (bkz. §Açık noktalar #24-25
tam detay için). Özet: `scripts/measure-dom-size.mjs` (yeni) 15 temsili
sayfayı taradı, 14/15'i >1000 element çıktı — kök neden site geneli
`Header.astro`'nun 4 `MegaMenu.tsx` island'ı (447 element) + her sayfada
her zaman mount'lu `MobileMenu.tsx` off-canvas paneli (408 element,
masaüstünde de) idi, toplam ~855 elementlik sayfa-bağımsız sabit bir
"vergi". **Yalnızca MobileMenu düzeltildi** (kullanıcı kararı — MegaMenu
geçmiş bir focus-bug'ı riske attığı için BİLİNÇLİ olarak ertelendi, bkz.
madde 25): `matchMedia`'ya göre panel artık masaüstünde (`>=1024px`) hiç
mount edilmiyor. **Kanıt:** şüpheli sayfa sayısı 14→0, ortalama element
1130→747 (%34 azalma). Yeni `test-mobile-menu.mjs` (12 kontrol) mobilde
tam işlevselliği (aç/kapa/akordeon/Escape/focus-trap/resize geçişleri)
doğruladı. `astro check` 0 hata, `astro build` 877 sayfa, 6 regresyon
script'i geçti. `playwright` bu tur için `npm install --no-save
playwright` ile geçici kuruldu (kalıcı devDependency değil).

---

## Proje Durumu — 2026-08-10 girdisi, 5. tur (tarihsel, o turda doğruydu)

**🟢 LANDING PAGE (`/demo`) SOSYAL KANIT LOGOLARI SÜREKLİ KAYAN BİR
MARQUEE'YE ÇEVRİLDİ (2026-08-10, 5. tur — 4. tur, "Civil, Femaş,
Kellogg's ve 1000+ şirketin tercihi" satırının kaldırılması, aşağıdaki
tarihsel girdide).** Kullanıcı talimatıyla `LogoStrip.astro`'ya opt-in
`animated` prop'u eklendi:

- **Tek component, iki mod:** `animated` (varsayılan `false`) statik
  wrap-grid yerine `CustomerLogoMarquee.astro`'nun (Müşteriler sayfası)
  KANITLANMIŞ marquee desenini uyguluyor (`animate-marquee` utility, 2x
  tekrar eden `sequence`, full-bleed `left-1/2 -mx-[50vw]`). Ayrı bir
  component açmak yerine mevcut `LogoStrip.astro`'ya opt-in prop olarak
  eklendi — kod tekrarı yok. 4 ana sayfa (`tr`/`en`/`nl`/`it`) hâlâ
  `<LogoStrip />` (animasyonsuz) çağırıyor, YALNIZCA `LandingPage.astro`
  `<LogoStrip animated />` kullanıyor — homepage'in davranışı DEĞİŞMEDİ
  (build sonrası `dist/index.html`'de marquee bölge işareti yok,
  `dist/demo/index.html`'de var, elle doğrulandı).
- **CLS/jump bug'ından kaçınma:** `CustomerLogoMarquee.astro`'nun kendi
  yorumundaki dokümante kök-neden dersi (width/height'sız `<img>`
  animasyon sırasında container genişliğini kaydırıp görünür bir sıçrama
  yaratıyordu) burada da uygulandı — `homeContent.ts`'teki `CustomerLogo`
  arayüzüne `width`/`height` eklendi, 7 logonun GERÇEK intrinsic boyutu
  (SVG `viewBox`, PNG `IHDR`, WebP `VP8` header'ı doğrudan indirilip
  okunarak) ölçüldü, uydurulmadı.
- **Hız:** 42s (7 logo × ~6s/logo) — Müşteriler sayfasının 84s/14
  logo'sundaki (2026-07-30'da kaynağın gerçek Swiper widget JS'inden
  ölçülmüş) AYNI per-logo temposu, farklı logo sayısına ölçeklendi, yeni
  bir tahmin değil. `prefers-reduced-motion` + hover-pause aynı kanıtlanmış
  davranışı koruyor.

**Test:** `astro check` 0 hata (308 dosya), `astro build` 877 sayfa
hatasız, `test-no-external-idenfit-links.mjs` 2368/0. `dev:clean` +
Chrome'da doğrulandı: `/demo`'da logolar edge-to-edge kayıyor (3sn arayla
alınan 2 ekran görüntüsünde farklı logo seti görünür durumda), homepage'de
(`/`) hâlâ statik grid, konsolda hata yok.

**Sıradaki adım:** kullanıcı ekran görüntüsüyle görsel onay verecek
(`http://localhost:4321/demo`, dev server ayakta).

---

## Proje Durumu — 2026-08-10 girdisi, 4. tur (tarihsel, o turda doğruydu)

**🟢 LANDING PAGE (`/demo`) "CIVIL, FEMAŞ, KELLOGG'S VE 1000+ ŞİRKETİN
TERCİHİ" SATIRI KALDIRILDI.** Kullanıcı talimatıyla `LandingPage.astro`'daki
ayrı sosyal kanıt `<p>` satırı silindi — `LogoStrip.astro`'nun kendi
`t.home.logoStrip.caption`'ı ("1000'den fazla mutlu müşteri, dijital İK
dönüşümünü bizimle gerçekleştirdi.") zaten aynı mesajı taşıdığı için
içerik tekrarı önlendi. Test: `astro check` 0 hata, `astro build` 877
sayfa, `test-no-external-idenfit-links.mjs` 2368/0.

---

## Proje Durumu — 2026-08-10 girdisi, 3. tur (tarihsel, o turda doğruydu)

**🟢 LANDING PAGE (`/demo`) HESAPLAYICI KARTININ ARKA PLANI ZENGİNLEŞTİRİLDİ
(2026-08-10, 3. tur).** `LandingSavingsCalculator.tsx`'in (2. tur'da
"mini deneyim"e dönüştürülen) kartına, kullanıcı talimatıyla salt
dekoratif bir arka plan katmanı eklendi:

1. **İnce nokta-grid dokusu:** inline SVG data URI ile 18x18px aralıklı,
   1.25px yarıçaplı nokta deseni (`global.css` `.lp-calc-dots`, opacity
   0.45). `LandingLayout.astro`'nun sayfa geneli `radial-gradient`
   dokusundan BİLİNÇLİ olarak farklı bir teknik (kullanıcı özellikle SVG
   pattern istedi). Renk `#DDDDDD` — projede `--border` diye bir tema
   token'ı YOK, kartın kendi input kenarlıklarında zaten kullanılan açık
   griyle tutarlı tutuldu (uydurulmuş yeni bir renk değil).
2. **3 süzülen İK ikonu** (lucide-react `Heart`/`Clock`/`BarChart3`,
   kartın 3 köşesinde) — her biri farklı süre (3.5s/4s/5s) + farklı
   yön/genlik (`global.css` `.lp-calc-icon-a/b/c`, yalnızca `transform`),
   aynı anda hareket etmiyor. `text-brand/20` (soluk marka kırmızısı).
3. **`prefers-reduced-motion: reduce`** → ikon animasyonları duruyor
   (`.lp-value-pulse`/`.landing-float`/`.lp-ring` ile AYNI kalıcı desen).
4. **Katman sırası:** kart `relative overflow-hidden`, dekorasyon katmanı
   `absolute inset-0 z-0 pointer-events-none`, gerçek içerik (başlık/
   slider/sonuç/CTA) `relative z-10` sarmalayıcıya taşındı — dekorasyon
   hiçbir zaman slider'ın tıklama/sürükleme etkileşimine karışmıyor.

**Test:** `astro check` 0 hata (308 dosya), `astro build` 877 sayfa
hatasız, `test-no-external-idenfit-links.mjs` 2368/0. `dev:clean` +
Chrome'da doğrulandı: nokta dokusu + 3 ikon görünür ve kart köşelerinde
kalıyor (zoom ile teyit edildi), slider sürükleme dekorasyon katmanının
ÜZERİNDEN sorunsuz çalışıyor (25→153 çalışan, Pro tier mesajı doğru
tetiklendi), konsolda hata yok.

**Sıradaki adım:** kullanıcı ekran görüntüsüyle görsel onay verecek
(`http://localhost:4321/demo`, dev server ayakta).

---

## Proje Durumu — 2026-08-10 girdisi, 2. tur (tarihsel, o turda doğruydu)

**🟢 LANDING PAGE (`/demo`) TASARRUF HESAPLAYICISI "MİNİ DENEYİM"E
DÖNÜŞTÜRÜLDÜ (2026-08-10, 2. tur).** `LandingSavingsCalculator.tsx`
(2026-08-07'nin sade metin-input'lu hali) kullanıcı talimatıyla 5 eksende
zenginleştirildi:

1. **Başlık:** "Kaç çalışanınız var?" yerine kullanıcının verdiği davetkâr
   soru — "Ekibinizin büyüklüğünü söyleyin, size ne kadar zaman
   kazandıracağımızı gösterelim."
2. **Serbest metin input → marka renkli `<input type="range">` slider**
   (1-300 çalışan, varsayılan 25). Slider'ın kendi CSS'i (`global.css`
   `.lp-range`) `appearance:none` ile sıfırlanıp track/thumb elle
   çizildi — dolu/boş oranı `--range-progress` custom property'siyle
   inline hesaplanıyor.
3. **Dinamik paket eşiği mesajı:** çalışan sayısına göre 3 farklı
   pazarlama cümlesi ("Mikro paketle bugün ücretsiz başlayın." /
   "KOBİ paketiyle büyümenize ayak uydurun." / "Pro paketle kurumsal
   ölçekte yönetin."). Eşikler UYDURULMADI — `pricingContent.ts` →
   `reference/wordpress-export/pricing.json`'daki GERÇEK paket
   sınırlarından (Mikro "1-25 Çalışan", KOBİ "1-100 Çalışan", Pro'nun
   üst sınırı yok) türetildi, Mikro'nun "ücretsiz" iddiası da kaynağın
   gerçek `price: "ÜCRETSİZ"` alanından doğrulandı.
4. **Sonuç cümlesi ikiye bölündü:** "Ayda tahmini X saat..." (birincil)
   + "Bu, yaklaşık Y iş gününe denk geliyor — ekibinize geri
   kazandırdığınız zaman." (ikincil, saat→iş günü dönüşümünü daha somut
   çerçeveliyor). "Tahmini" ibaresi korunuyor — kesin istatistik gibi
   sunulmuyor, hesaplama yöntemi (çalışan başına ayda 2 saat) 2026-08-07'de
   kullanıcı onaylı basit bir varsayım olarak zaten dokümante, DEĞİŞMEDİ.
5. **Görsel canlılık:** paket eşiği (tier) değiştiğinde büyük sayı + rozet
   kısa bir "seviye atladı" pulse animasyonu alıyor (`global.css`
   `.lp-value-pulse`, `prefers-reduced-motion` ile duruyor) — her slider
   notch'ında DEĞİL, yalnızca Mikro/KOBİ/Pro sınırı geçildiğinde
   (React `key={tier}` remount tetikleyicisi), sürekli titreşim önlendi.
6. **CTA bağlantısı:** hesaplayıcının altına "Bu tasarrufu gerçeğe
   dönüştürün →" linki eklendi, `LandingRequestForm`'un kartına eklenen
   yeni `id="landing-form"`e `scrollIntoView({behavior:'smooth'})` ile
   scroll ediyor.

**Dil kararı (kullanıcı sordu, Claude karar verdi):** bölüm TÜRKÇE
kaldı. Gerekçe — yalnızca hero H1/alt açıklaması BİLİNÇLİ olarak
İngilizce (bu turdan bir önceki karar, üstteki "1. tur" girdisine bakın);
sayfanın geri kalanı (form, dashboard, istatistik şeridi, bento grid, "3
Adımda idenfit") kullanıcı onayıyla TÜRKÇE kalıyor. Hesaplayıcı bu "geri
kalan" kümenin bir parçası — hero dışında yeni bir İngilizce ada
açmaktansa mevcut TR tutarlılığına uyması tercih edildi. Ekip nihai dil
kararını (TR/EN/karışık) verdiğinde bu bölüm de birlikte güncellenecek.

**Test:** `astro check` 0 hata (308 dosya), `astro build` 877 sayfa
hatasız, `test-no-external-idenfit-links.mjs` 2368/0. `dev:clean` +
Chrome'da uçtan uca doğrulandı: slider sürüklemesi (25→238 çalışan),
tier geçişi (Mikro→Pro mesajı + pulse), track dolgu oranı doğru takip
ediyor, saat/iş günü hesaplaması doğru (238 çalışan → 476 saat / 59,5 iş
günü), CTA linki hatasız tıklanıyor (konsolda hata yok). 11 React island
sorunsuz.

**Sıradaki adım:** kullanıcı ekran görüntüsüyle görsel onay verecek
(`http://localhost:4321/demo`, dev server ayakta).

---

## Proje Durumu — 2026-08-10 girdisi, 1. tur (tarihsel, o turda doğruydu)

**🟢 LANDING PAGE (`/demo`) HERO BAŞLIK/AÇIKLAMA İNGİLİZCE METİNLE
DEĞİŞTİRİLDİ (2026-08-10).** Kullanıcı talimatıyla `LandingPage.astro`'daki
`HERO_TITLE`/`HERO_SUBTITLE` sabitleri kullanıcının verdiği İngilizce
metinle değiştirildi: başlık "People first. Everything else, simplified."
(ana başlık/H1 olarak, önceki geçici TR sloganın yerine), alt açıklama
"Idenfit brings HR, workforce management, payroll and employee experience
together—so your teams can focus on people, not processes." **Kapsam
BİLİNÇLİ olarak yalnızca hero başlık/açıklama** — sayfanın geri kalanı
(form etiketleri, dashboard paneli, istatistik şeridi, bento grid, "3
Adımda idenfit") TÜRKÇE kalıyor, kullanıcı bunun şimdilik karışık dilli
bir sayfa olacağını bilerek onayladı (ekip henüz nihai dil kararını
vermedi). Önceki "ana sayfa sloganını kullan, TODO" notu artık geçersiz —
`LandingPage.astro`'daki yorum güncellendi: hero artık kendi İngilizce
metnini kullanıyor, ekip nihai dil kararı (TR/EN/karışık) verdiğinde tüm
sayfa buna göre güncellenecek.

**Test:** `astro check` 0 hata (308 dosya), `astro build` 877 sayfa
hatasız, `test-no-external-idenfit-links.mjs` 2368/0. `dev:clean` sonrası
`curl` ile doğrulandı: yeni İngilizce başlık/açıklama render ediliyor,
"Canlı Devam Takibi"/"Ücretsiz Demo Talep Edin" gibi TR metinler
değişmeden kaldı, 11 React island (`astro-island`) sorunsuz. **Sıradaki
adım:** kullanıcı ekran görüntüsüyle görsel onay verecek
(`http://localhost:4321/demo`, dev server ayakta).

---

## Proje Durumu — 2026-08-07 girdisi, 2. tur (tarihsel, o turda doğruydu)

**🟢 LANDING PAGE (`/demo`) GÖRSEL OLARAK YÜKSELTİLDİ (2026-08-07, 2. tur
— aynı günün ilk turu "gerçek ürün içeriğiyle zenginleştirme" aşağıda,
bu YENİ girdi onun üzerine inşa edildi).** Kullanıcı geri bildirimi:
sayfa "çok klasik/sıradan" duruyordu — 5 konuda hedefli görsel yükseltme
yapıldı, hiçbiri kaynaktan yeni bir pazarlama iddiası İCAT ETMEDİ (bkz.
madde notları).

**1) Renk uyumu (bold kırmızı, pastelden kaçınma):** Ana sayfa hero'sunun
+ Online Sunum Talebi'nin flat `bg-brand` (#FF0000, gradyansız/desensiz)
diliyle hizalandı. Yeni `LandingProductShowcase` + güncellenmiş
`LandingStatStrip` artık TAM kırmızı panel (önceden `bg-brand-light`
soluk pembe zemindi). `LandingSavingsCalculator`'ın pastel kutusu beyaz
kart + kalın kırmızı sol kenarlığa çevrildi. `LandingBentoGrid`'in ikon
rozetleri soluk daireden dolu kırmızı daire + beyaz ikona çevrildi.

**2) Gerçek ürün paneli — `LandingProductShowcase.astro` (yeni):** Ana
sayfanın "Kullanıcı Dostu Panel" bölümündeki (`PanelFeatureSection.astro`)
AYNI gerçek ekran görüntüsü (`HOME_PANEL_IMAGE`, gerçek WP medya) + AYNI
onaylı başlık/metin/özellik rozetleri (`t.home.panel`) yeniden kullanıldı
— yeni metin YAZILMADI. Sahte tarayıcı çerçevesi (sekme çubuğu + gerçek
ekosistem hostname'i `app.idenfit.com`, bkz. CLAUDE.md §Mimari "CTA URL
çözümleme" — uydurma alan adı DEĞİL) + hafif 3D perspektif tilt + yavaş
süzülme animasyonu (`.landing-float`, `global.css`, yalnızca `transform`,
`prefers-reduced-motion` ile duruyor) eklendi.

**3) İstatistik şeridi zenginleştirildi:** 3→5 istatistik. 2 yeni rakam
GERÇEK/doğrulanabilir: "18 modül" (bkz. §Proje Özeti — "18 modül +
Puantaj + 2 hub + Demirbaş/Seyahat", 18 doğrudan oradan) ve "4 dil"
(`astro.config.mjs`'in `locales: ["tr","en","nl","it"]`'i, 4 rakamı
uydurulmadı). Her istatistiğe lucide ikon + beyaz kart (gölgeli) eklendi,
zemin bold kırmızıya çevrildi. 4 sayı artık animasyonlu (yalnızca ISO
sabit — bileşik rozet metni, tek sayı olmadığı için), kartların kendisi
artık `.reveal` ile staggered giriyor.

**4) "3 Adımda idenfit" — `LandingTimeline.astro` (yeni):** Bento
Grid'den ÖNCE eklendi. 3 adımın metni bu SAYFADA ZATEN yazılmış/onaylı
temaları yeniden anlatıyor, yeni iddia YOK — Adım 1 "48 saat" (hero alt
açıklamasıyla AYNI), Adım 2 "Excel toplu veri aktarımı" (Bento'daki
"Toplu İşlem Esnekliği" kartıyla AYNI), Adım 3 "canlı panel" (Canlı
Devam Takibi bölümüyle AYNI). Bağlayıcı ok ikonları `FeatureGrid.astro`'nun
("+"/"=" ikonlu) `grid-cols-[1fr_auto_1fr_auto_1fr...]` desenini birebir
izliyor (3 adım için kısaltılmış hâli).

**5) Genel görsel zenginlik:** `LandingLayout.astro`'ya çok hafif nokta-grid
doku eklendi (`:global(body)` scoped `<style>` — yalnızca `/demo`'ya
bundle ediliyor, diğer `BaseLayout` sayfalarını ETKİLEMİYOR, marka
kırmızısı %4 opaklık). `global.css`'teki paylaşılan `.reveal` kuralı
`translateY(var(--reveal-y, 16px))`e çevrildi — varsayılan 16px
DEĞİŞMEDİ (site geneli mevcut kullanımlar birebir aynı), yalnızca
`LandingProductShowcase`'in görsel bloğu `--reveal-y: 32px` ile daha
belirgin bir hareket alıyor. `LandingBentoGrid`/`LandingFeatureHighlights`/
Dashboard Preview/Sosyal kanıt satırına ÖNCEDEN HİÇ olmayan `.reveal` +
staggered `transition-delay` eklendi. `LandingPulseDecoration` büyütüldü
(h-80→h-96 lg) + halka kalınlığı 2px→3px + dış halka canlı marka
kırmızısına çekildi + merkez daireye `box-shadow` glow eklendi.

**Test:** `astro check` 0 hata (308 dosya — bir gerçek hata bulundu ve
düzeltildi: `LandingSavingsCalculator.tsx`'te `return (` içine JSX
yorumu `{/* ... */}` root element'ten ÖNCE konmuştu, geçersiz syntax,
normal JS yorumuna çevrildi), `astro build` 877 sayfa hatasız, 6
regresyon script'i tümü geçti (`test-no-external-idenfit-links` 2368/0
dahil). `dev:clean` ile Chrome'da uçtan uca doğrulandı: hero (büyümüş
pulse halka), Product Showcase (float animasyonu + tarayıcı çerçevesi +
gerçek panel görseli), Canlı Devam Takibi, 5 istatistik kartı (sayaçlar
+ ikonlar), sosyal kanıt + LogoStrip (nokta-grid doku arka planda
görünür), 3 Adımda idenfit (ok bağlayıcılar), Bento Grid (dolu kırmızı
ikon rozetleri + staggered reveal), hesaplayıcı (120 çalışan → "240
saat (~30 iş günü)" doğru hesaplandı, hydration sağlam). Konsolda
`fdprocessedid` içerikli bir hydration uyarısı görüldü — React'in kendi
hata mesajı bunun bir tarayıcı uzantısının (form-autofill) HTML'e
müdahalesinden kaynaklanabileceğini belirtiyor, kod kaynaklı değil.

**Sıradaki adım:** kullanıcı ekran görüntüsüyle görsel onay verecek
(`http://localhost:4321/demo`, dev server ayakta).

---

## Proje Durumu — 2026-08-07 girdisi, 1. tur (tarihsel, o turda doğruydu)

**🟢 LANDING PAGE (`/demo`) GERÇEK ÜRÜN İÇERİĞİYLE ZENGİNLEŞTİRİLDİ.**
2026-08-06'nın pilot iskeleti (başlık + fayda listesi + form Adım 1)
üzerine kullanıcı talimatıyla 7 yeni bölüm eklendi. Eski geçici "pilot
önizleme" section'ı (izole nabız/halka + 4 kart) ve ikonsuz 2x2
FEATURE_CARDS grid'i KALDIRILDI — yerlerini gerçek entegrasyonlar aldı,
içerik tekrarı bırakılmadı.

**Slogan (TODO — kullanıcı kararı):** H1 artık ana sayfanın gerçek
sloganını (`t.hero.title`, "Tüm İK Süreçlerinizi Hemen Dijitalleştirin!")
kullanıyor. Bu GEÇİCİ — ileride landing page'e özel bir varyantla
değiştirilecek (`LandingPage.astro`'daki TODO yorumuna bakılabilir).

**Yeni bölümler (sayfa sırasıyla, üstten alta):**
- Hero alt açıklaması: kullanıcı tarafından verilen yeni metin (biyometrik/
  RFID donanım + yapay zeka destekli işe alım — ana sayfa hero'sundaki
  AYNI doğrulanmış ifade, `t.hero.description`, uydurulmadı).
- `LandingSavingsCalculator.tsx` (yeni, React `client:visible`) — çalışan
  sayısına göre tahmini aylık zaman tasarrufu. **Formül kullanıcı onaylı
  basit bir varsayım** (çalışan başına ayda 2 saat) — kaynakta bu
  hesaplama için veri YOK (mevcut 8 hesaplayıcı, `calculatorDefinitions.ts`,
  tamamen farklı kapsam: fazla mesai/gelir vergisi/kıdem tazminatı vb.,
  bkz. §Mimari). Sonuç her zaman "tahmini" ibaresiyle gösteriliyor, kesin
  istatistik gibi sunulmuyor.
- `LandingPulseDecoration.tsx` — 2026-08-06'nın izole pilotu ÜRETİME
  alındı: eski Lottie halkanın (`MaturityArcDecoration`) YERİNE hero
  panelinde kullanılıyor (karar netleşti). Önceki turun 4 kartlı grid
  kısmı KALDIRILDI (içerik Bento Grid'e taşındı) — component artık
  yalnızca merkez yıldız + 3 katmanlı radar halkası, form kartının
  arkasında (`z-0`).
- `LandingDashboardPreview.astro` (yeni) — "Devam Takibi" mockup kartı
  (Toplam çalışan/Geç kalan/Bekleyen izin, İLLÜSTRATİF örnek rakamlar,
  gerçek müşteri verisi DEĞİL) + Suprema biyometrik notu (gerçek hardware
  partner, bkz. `t.home.suprema`) + bordro bildirim kartı. Statik build
  olduğu için tarihe bağlı bir alan ("Şubat 2026" gibi) BİLİNÇLİ olarak
  kullanılmadı (build anında donup ziyaret anında bayatlamış görünürdü)
  — "bugün"/"bu ayki" gibi bağıl ifadeler tercih edildi.
- `LandingStatStrip.astro` + `src/scripts/landing-stat-counter.js` (yeni)
  — scroll-triggered sayı sayma (1.000+ müşteri, 48 saat kurulum). ISO
  sertifikası tek bir sayı olmadığı için (bileşik rozet metni) animasyon
  UYGULANMADI — sabit rozet olarak gösteriliyor. `prefers-reduced-motion`
  açıksa ara adımlar oynatılmadan doğrudan hedef değere atlanıyor
  (`scroll-reveal.js` ile aynı IntersectionObserver deseni).
- Sosyal kanıt satırı ("Civil, Femaş, Kellogg's ve 1000+ şirketin
  tercihi") + mevcut `LogoStrip` altına yerleştirildi — 3 isim de gerçek/
  doğrulanmış müşteri adları (`customerStories.ts`/`CUSTOMER_LOGOS`),
  uydurulmadı.
- `LandingBentoGrid.astro` (yeni) — 6 gerçek platform modülü özeti
  (kullanıcı tarafından verildi), 3'lü grid'de span-2/span-1 dönüşümlü
  yerleşim (her satır tam doluyor, boş hücre yok — "farklı boyutlarda"
  isteğiyle tutarlı gerçek bir bento hissi). Eski ikonsuz 2x2
  FEATURE_CARDS grid'i BU YÜZDEN kaldırıldı (içerik tekrarı olmasın).
- `LandingFeatureHighlights.astro` (yeni) — 4 maddelik küçük ikon+metin
  şeridi (mobil erişim/veri güvenliği/hatırlatıcılar/özel raporlama).
- Tüm yeni dekoratif ikonlar (Bento/Dashboard/StatStrip) lucide-react
  SERVER-ONLY render ediliyor (`client:*` YOK) — hiç JS göndermiyor,
  proje kuralıyla tutarlı (React yalnızca gerçek etkileşim gerektiğinde
  hydrate edilir; yalnızca hesaplayıcı `client:visible`, form `client:load`
  kalıyor).

**Yan düzeltme (bug, bu turda bulundu):** `LandingPage.astro`'da
`scroll-reveal.js` script include'ı hiç yoktu — `LogoStrip`'in `.reveal`
sınıflı logoları `/demo`'da `opacity:0` donuk kalıyordu (script hiç
çalışmadığı için `is-visible` sınıfı asla eklenmiyordu, homepage'in
`index.astro`'su bu script'i zaten include ediyor). Şimdi eklendi.

**Test:** `astro check` 0 hata (306 dosya), `astro build` 877 sayfa
hatasız, 6 regresyon script'i (`test-faq-language-switch`,
`test-legal-nl-consistency`, `test-no-external-idenfit-links` 2368/0,
`test-product-language-switch`, `test-sector-language-switch`,
`test-urunler-menu-links`) tümü geçti. `dev:clean` sırasında BİLİNEN Vite
bağımlılık önbelleği hydration hatası (§Proje kuralları madde 3 — React
island'lar hydrate olmadı, form/hesaplayıcı input'ları state'e
bağlanmadı) bir kez daha görüldü, dokümante edilmiş kalıcı çözümle
(ikinci `dev:clean` + log doğrulaması) düzeldi. Chrome'da uçtan uca
doğrulandı: hero (gerçek slogan + alt açıklama + pulse halka arkada),
hesaplayıcı (75 çalışan → "150 saat (~18,8 iş günü)" doğru hesaplandı),
dashboard kartı, istatistik şeridi (scroll'da sayıyor), sosyal kanıt
satırı, bento grid (6 kutu + hover), özellik şeridi.

**Sıradaki adım:** kullanıcı ekran görüntüsüyle görsel onay verecek
(`http://localhost:4321/demo`, dev server ayakta). Onay sonrası ele
alınabilecekler: (1) slogan TODO'su ayrı bir kararla kapatılabilir, (2)
form Adım 2 (telefon+şirket) + backend bağlantısı (Faz 2, hâlâ bilinçli
olarak ertelendi) ayrı bir turda tamamlanabilir.

---

## Proje Durumu — 2026-08-06 girdisi (tarihsel, o tarihte doğruydu)

**🟡 PİLOT İSKELETİ KURULDU — Landing Page (reklam trafiği, Faz 6 öncelik
#1, `/demo`).** Kullanıcı slug (`/demo`) + noindex kararını 2026-08-06'da
verdi ("geri alınabilir bir ayar, güvenli tarafta başlıyoruz") — onaylanan
pilot kapsamı (başlık + fayda listesi + form Adım 1) kuruldu ve doğrulandı.
**Adım 2 (telefon+şirket) + gerçek backend bağlantısı BİLİNÇLİ olarak bu
turda kurulmadı**, kullanıcı görsel onayı sonrası ayrı bir turda
tamamlanacak.

**Kurulan dosyalar:**
- `src/pages/demo.astro` → `src/components/LandingPage.astro` (bespoke,
  WP kaynağı yok, TR-only pilot — KARAR 2 ile aynı ilke).
  `BaseLayout`'a yeni `noindex` prop'u eklendi (`<meta name="robots"
  content="noindex, nofollow">`, varsayılan `false`, mevcut sayfalar
  etkilenmedi).
- `src/components/LandingRequestForm.tsx` — 2 adımlı form mimarisinin
  Adım 1'i (ad soyad + e-posta). `step` state'i Adım 2 eklenince
  genişletilmek üzere bırakıldı, şu an her zaman 1. Submit
  `HeroForm.tsx`'in backend'siz `console.log` deseniyle AYNI. KVKK onay
  metni yeni yazılmadı — `t.hero.kvkkNotice` (site genelinde zaten
  onaylı, HeroForm'un kullandığı AYNI metin) yeniden kullanıldı.
- `src/components/MaturityArcDecoration.tsx` — kırmızı Lottie glow/arc
  animasyonu (`hr-maturity-arc.json`) `HrMaturityTest.tsx`'ten paylaşılan
  bir component'e çıkarıldı (kod tekrarı yerine), her ikisi de bunu
  import ediyor.
- Fayda listesi (4 madde) + form alan placeholder'ları uydurulmadı —
  sitenin diğer bölümlerinde zaten var olan doğrulanmış ifadeler
  (`t.home.featureGrid`, `t.home.logoStrip.caption`, `t.hero.formName/
  formEmail`) yeniden kullanıldı.
- Tasarım: mevcut marka paleti (kırmızı `bg-brand` panel + beyaz form
  kartı, Online Sunum Talebi'nin "kırmızı zemin üzerinde beyaz kart"
  deseniyle aynı ilke) — kullanıcının referans görselindeki bordo/turuncu
  (Track B) kullanılmadı.

**Test:** `astro check` 0 hata (296 dosya), `astro build` 877 sayfa
hatasız (876→877, yeni `/demo`), `test-no-external-idenfit-links.mjs`
2368/0, `dev:clean` + `curl` ile noindex meta/h1/4 fayda maddesi/form
alanları (yalnızca fullName+email, phone/company YOK — Adım 2 kapsamı
bilinçli olarak eksik)/KVKK-Sözleşme linkleri/3 React island
(`LandingRequestForm`, `MaturityArcDecoration`, + Header'ın mevcut
island'ları) doğrulandı.

**Sıradaki adım (kullanıcı görsel onayı bekliyor):** kullanıcı pilotu
inceleyip onaylarsa Adım 2 (telefon+şirket alanları, `LandingRequestForm`'un
`step` state'i genişletilecek) + backend bağlantısı (ayrı kapsamlı,
Faz 2 ile aynı kategori) tamamlanacak. **Dürüst sınır:** Chrome uzantısı
bu turda da bağlı değildi — gerçek görsel sonuç (Lottie animasyonun
davranışı, form kartının kırmızı panel üzerindeki hizası) kullanıcı
tarafından doğrulanmalı.

**📍 Blog CMS (Decap) — kademeli üretim aşaması, açık uç.** Mimari kuruldu
(composite loader: `glob()` göç etmiş `.md` + `file()` legacy `posts.json`,
bkz. §Mimari). Pilot 4 yazı Markdown'a göç etti, HTML→Markdown dönüşümü
(`scripts/lib/html-to-markdown.mjs`, turndown) 2026-08-05'te düzeltildi —
göç script'i artık gerçek Markdown üretiyor (önceki bug: ham WP HTML
hiç dönüştürülmeden yazılıyordu). **Kalan 618 yazı**
`scripts/migrate-blog-to-markdown.mjs <slug...>` ile gruplar halinde
taşınmalı (her grup sonrası `astro build` + regresyon) — bkz. Açık nokta
#21. OAuth App onayı IT'den bekleniyor.

**2026-08-05 — Kapsamlı URL denetimi tamamlandı (canlı `sitemap_index.xml`
853 URL vs proje çıktısı).** Bulunan ve düzeltilen eksikler:
- 9 sayfa "aynı içerik farklı slug, redirect yok" (Müşteriler EN/IT/NL,
  Online Sunum Talebi EN/IT, Teşekkürler EN, Donanım TR/EN/IT) →
  `astro.config.mjs` redirects'e eklendi.
- **2 modül sayfası tamamen kaçırılmıştı:** Demirbaş Yönetimi Modülü +
  Seyahat ve Görevlendirme Yönetimi Modülü (TR+EN, canlıda kendi
  title'ları var, "Zimmet Yönetimi" ile karıştırılmıştı). Kök neden:
  `extract-products.mjs`'in `MODULE_TR_SLUGS` listesine hiç eklenmemişlerdi.
  4 yeni sayfa `zimmet-yonetimi-modulu.astro` ile birebir aynı desenle
  kuruldu. Demirbaş'ın TR'sinde SSS alanları boş (kaynağın kendi
  asimetrisi, uydurulmadı). **Mega-menüye bilinçli olarak eklenmedi** —
  canlı sitenin kendisi de bu 2 sayfayı menüde göstermiyor (kaynağa
  sadakat, bkz. Açık nokta #23, kapandı).
- **KVK Protokol (TR+EN) eklendi** — ana KVKK metninden ayrı bir hukuki
  belge, ACF alanı yok, ham `content.rendered`'daki Elementor HTML
  widget'ından yeni `extractLegalFromRenderedHtml()` ile çıkarıldı
  (TR kaydı `<section>` etiketini kapatmıyor — kaynağın kendi
  tutarsızlığı, iki yöntemle de div dengesi doğrulandı). Yan düzeltme:
  `LegalPage.astro`'ya eksik h2/h3/h4 stilleri eklendi (tüm legal
  sayfaları etkiliyor, risksiz).
- **4 sayfa bilinçli atlandı** (kullanıcı kararı): `/kampanya/` (süresi
  geçmiş promosyon), `/slider-form/` + EN'i (Elementor şablonu), `/sample-page/`
  + `/test-tr/` (WP test çöpü).
- **Kategori arşiv sayfaları (12, `/category/*/`) bu turda ele alınmadı**
  — yeni açık nokta (#22).
- Test: `astro check` 0 hata, `astro build` 876 sayfa, `test-no-external-idenfit-links.mjs`
  2365/0, `test-urunler-menu-links.mjs` 108/108.

**2026-08-05 — Blog Markdown pilot dosyalarında gerçek bug bulundu ve
düzeltildi.** Kök neden: `migrate-blog-to-markdown.mjs` ham WP HTML'i
hiçbir dönüşümden geçirmeden `.md` gövdesine yazıyordu — sitede
"kazara çalışıyordu" (CommonMark'ın ham HTML passthrough'u sayesinde)
ama Decap'in Rich Text editörü gerçek Markdown bekliyor, ham HTML'i
gösteriyordu. **Düzeltme:** `turndown` eklendi, paylaşılan
`scripts/lib/html-to-markdown.mjs` yazıldı (`<strong>`→`**`,
`<a href>`→`[metin](url)`, `<h2/h3>`→`##`/`###`, iç içe `<strong>`
tekilleştirme, boş `<p><br></p>` temizliği, `<br>`→görünür `\`+satır sonu,
`<iframe>` bilinçli olarak ham HTML korunuyor, `<mark>` kaldırılıp metni
korunuyor). 4 pilot dosya yeniden işlendi (`reprocess-migrated-blog-html.mjs`).
Test: `astro check` 0 hata, `astro build` 870 sayfa, `test-no-external-idenfit-links.mjs`
2341/0. **Dürüst sınır:** Chrome uzantısı bağlı değildi, Decap panelinin
görsel doğrulaması kullanıcı tarafından yapılmalı.

**2026-08-04 — Blog CMS entegrasyonu (Decap CMS) başladı: keşif + pilot +
yerel panel kurulumu.** GitHub OAuth App onayı IT'den bekleniyor (yalnızca
PROD kimlik doğrulamasını etkiliyor). **Mimari karar:** per-file Markdown'a
KADEMELİ göç (622 yazı tek seferde değil) — `content.config.ts` artık
`glob()` (göç etmiş `.md`) + `file()` (legacy `posts.json`) birleştiren
composite loader kullanıyor (glob ÖNCE senkronize olmalı, `file()` loader
`store.clear()` çağırdığı için sıra kritik). Legacy yazılar
`context.renderMarkdown()` ile aynı `RenderedContent` şekline çevriliyor.
Şema sadeleştirmeleri: `categories`/`tags`'teki WP `id` alanı kaldırıldı,
`featuredImage.width/height` opsiyonel oldu, `modifiedDate` kaldırıldı.
Yerel Decap paneli kuruldu (`public/admin/`, `decap-server` proxy,
`local_backend:true`). **Bilinen quirk:** `astro dev`/`preview` `/admin/`
için örtük index çözümlemesi yapmıyor (`/admin/index.html` açık gerekiyor)
— Cloudflare Pages'te henüz doğrulanmadı (Açık nokta #21).

**Genel not:** Aşağıdaki "Tamamlanan işler" bölümü artık kısa bir özet
listesidir — adım adım kök-neden/ölçüm anlatıları yukarıdaki tarihli
arşiv dosyalarında saklı. Doğrulama konvansiyonu (her madde
Playwright/`astro check`/`astro build`/`dev:clean` ile test edildi,
config değişikliğinde `npm run dev:clean` şart) tüm günlük için geçerli,
madde başına tekrarlanmıyor.

---

### Açık noktalar / bekleyen kararlar

1. **KARAR 2 — kaynakta olmayan çeviriler için yeni sayfa üretimi**
   (seyahat modülünün NL/IT'si, demirbaş modülünün IT'si gibi) ekiple
   görüşülüp netleşmeyi bekliyor; şimdilik üretilmiyor. **İstisna:**
   Online Sunum Talebi'nin NL versiyonu kullanıcının açık talimatıyla
   eklendi (`PRESENTATION_NL_OVERRIDE`) — genel karar hâlâ geçerli.
2. **Faz 2 backend yok** — Hero formu + HR Maturity Test sonuç sayfasının
   "raporu e-postama gönder" butonu şu an `console.log` stub/devre dışı.
   Faz 2'de (Cloudflare Pages Functions) gerçek backend'e bağlanacak,
   form gönderiminde kullanıcı gerçek Teşekkürler sayfasına yönlendirilecek.
6. Mesafeli Satış Sözleşmesi'nin kobi/mikro TR varyantları kurulmadı
   (Elementor `content.rendered` parse'ı gerektiriyor).
8. Puantaj modülünün gerçek YouTube `video_url`'i var ama site geneli
   tutarlılık için bilinçli olarak embed edilmedi.
9. İzin Yönetimi modülünün testimonial bloğu veride var ama PDKS
   şablonuna sadık kalmak için render edilmiyor.
10. `tesekkurler-destek` (id 16712) bulundu ama migrate edilmedi —
    kullanıcının istediği `/tesekkurler/` (id 15810) farklıydı.
12. **TODO — HR Maturity Test sonuç sayfasının PDF rapor gönderimi
    backend'siz** (madde 2 ile aynı Faz 2 kategorisi, `POST
    /wp-json/hr-maturity/generate` özel WP endpoint'i, bizde karşılığı yok).
13. **BULGU — site geneli sabit WhatsApp/Ara widget'ı yok, kaynakta var**
    (`wa.me/905375265307` + `tel:02162950927`). Kapsam dışı bırakıldı,
    istenirse `BaseLayout.astro` seviyesinde `position:fixed` component
    olarak eklenebilir.
14. **Görsel yerelleştirme kısmen tamamlandı** (`uploads.zip` işlendi) —
    yalnızca İK Olgunluk Testi + `pdks-nedir` blog yazısı yerelleştirildi
    (`public/wp-content/uploads/`). **Kalan ~1260 görsel (618 blog yazısı
    + 10 veri dosyası) hâlâ hotlink** — kademeli üretim onayı bekliyor.
    Script: `scripts/localize-images.mjs`.
15. **YARIM KALAN — İK Olgunluk Testi'nde 2 açık uç:**
    - Section 2 rozet boyutu pilot kodda (yalnızca ilk kart büyütülmüş,
      `index===0` özel durumu) — onay gelirse kalan 4 karta + Section 5'e
      uygulanacak, koşul kaldırılacak.
    - Section 3 checklist ikon rengi — kullanıcıdan DevTools hex kodu
      bekleniyor (statik CSS araştırması hiçbir override bulamadı, ham
      SVG'ler `stroke="black"`, kod DEĞİŞTİRİLMEDİ, tahmin edilmedi).
16. **KARAR BEKLİYOR — blog "yeni yazı senkronizasyonu" periyodik kontrol
    haline getirilsin mi?** Kaynak site migrasyon sonrası da yeni yazı
    yayınlamaya devam ediyor (yöntem kanıtlandı: `post-sitemap.xml` vs
    `posts.json` diff'i) — sıklık/tetikleme şekli henüz kararlaştırılmadı.
19. **KARAR — Faz 2 CMS: Decap CMS** (GitHub OAuth, git'te Markdown,
    sunucu/API gerektirmiyor). Kurulum devam ediyor, bkz. madde 21.
20. **SÜREÇ — `npm audit` periyodik hale getirildi** (`npm run audit`,
    her önemli değişiklik/deploy öncesi). Şu an 0 açık. Düşük/orta
    seviye bulgu çıkarsa buraya yeni madde olarak not düşülüp iş
    listesine eklenmeli; kritik/yüksek bulunduğu anda düzeltilmeli.
21. **Blog CMS (Decap) — 3 açık uç (2026-08-04, güncel):**
    - Kademeli üretim: kalan 618 yazı `scripts/migrate-blog-to-markdown.mjs
      <slug...>` ile gruplar halinde (script artık otomatik HTML→Markdown
      dönüşümü uyguluyor, bkz. 2026-08-05 günlüğü). Tamamlanınca
      `content.config.ts`'teki `legacyJsonLoader` basit `glob()`'a
      indirgenebilir, `posts.json` silinebilir.
    - `verify-blog-posts.mjs` güncel değil — yalnızca `posts.json`'ı
      okuyor, göç etmiş `.md` yazıları görmüyor.
    - `/admin/` trailing-slash davranışı Cloudflare Pages'te henüz
      doğrulanmadı (yerelde yalnızca `/admin/index.html` çalışıyor).
    - OAuth App onayı IT'den bekleniyor — geldiğinde `config.yml`'in
      `base_url`/`auth_endpoint`'i doldurulacak + Cloudflare Pages
      Functions OAuth proxy'si kurulacak.
22. **YENİ — Kategori arşiv sayfaları (`/category/<slug>/`, 12 taksonomi
    sayfası) migrate edilmedi, ayrı bir yapısal karar bekliyor
    (2026-08-05).** Blog mimarisi kategori bazlı filtreleme/sayfalama
    içermiyor — eklemek 12+ yeni route + Content Collection'da yeni bir
    özellik demek, küçük bir düzeltme değil. Kullanıcı kararıyla bu
    turda ele alınmadı.
24. **KISMEN KAPANDI — DOM boyutu (Chrome "1501 element" uyarısı):
    MobileMenu düzeltildi, MegaMenu BİLİNÇLİ olarak ertelendi
    (2026-08-10).** `scripts/measure-dom-size.mjs` ile 15 sayfalık
    temsili bir örneklem tarandı — kök neden `Header.astro`'nun 4
    `MegaMenu.tsx` island'ı (447 element, HER SAYFADA) + `MobileMenu.tsx`'in
    `document.body`'ye portal'lanan off-canvas panel'i (408 element, HER
    SAYFADA, `open` state'inden VE `lg:hidden` viewport'undan BAĞIMSIZ
    her zaman DOM'da) — toplam ~855 element'lik sayfa içeriğinden
    BAĞIMSIZ sabit bir "vergi" olarak bulundu (bkz. görev geçmişi,
    2026-08-10 DOM taraması turu, tam analiz orada).
    **Uygulanan düzeltme (yalnızca MobileMenu):** `MobileMenu.tsx`'e
    `matchMedia('(min-width: 1024px)')` tabanlı bir `isDesktop` state'i
    eklendi — off-canvas panel artık masaüstünde (`>=1024px`) HİÇ
    mount edilmiyor (`{mounted && !isDesktop && createPortal(...)}`),
    yalnızca mobil viewport'ta normal çalışıyor. Viewport `lg` eşiğini
    geçerken panel doğru mount/unmount oluyor, açıkken masaüstüne
    büyütülürse otomatik kapanıyor (`setOpen(false)`). Bu güvenliydi
    çünkü tetikleyici zaten `lg:hidden` — masaüstünde hiçbir zaman
    erişilebilir değildi, "aç/kapa sırasında odaklı eleman kaybolur mu"
    riski YOK (bkz. madde 25'teki MegaMenu'nün AKSİNE).
    **Kanıt (önce/sonra, `measure-dom-size.mjs`):** 15 sayfalık
    örneklemde şüpheli (>1000 element) sayfa sayısı 14→**0**, ortalama
    1130→**747** element (%34 azalma), en yüksek 1324→914. `test-mobile-menu.mjs`
    (yeni, 12 kontrol) masaüstünde panelin DOM'da hiç olmadığını +
    mobilde tam işlevsel kaldığını (aç/kapa, linkler, akordeon, Escape,
    focus trap, resize geçişleri) doğruladı. Regresyon: `astro check`
    0 hata, `astro build` 877 sayfa, 6 mevcut regresyon script'i geçti.
25. **TODO — MegaMenu'nün 4 panelinin DOM'da her zaman var olması (447
    element) performans maliyeti yaratıyor ama kaldırılırsa geçmiş bir
    focus/kapanma bug'ı geri gelebilir.** Daha güvenli bir çözüm (örn.
    yalnızca hover edilen panelin DOM'da tutulması, diğerlerinin
    lazy-mount edilmesi, ama focus event'lerinin doğru yönetilmesi)
    ileride ayrı bir dikkatli turda değerlendirilecek. Bilinçli olarak bu
    turda ELE ALINMADI (kullanıcı kararı, 2026-08-10) — `MegaMenu.tsx`
    satır 241-253'teki yorum kök neden bug'ının tam anlatımını taşıyor.
27. **BULGU (bilgi notu, aksiyon GEREKMİYOR) — site 1490 redirect stub
    sayfası içeriyor** (NL→EN/EN→bare-TR gibi i18n fallback mekanizmasının
    ve `astro.config.mjs`'teki elle eklenmiş `redirects`'in ürettiği
    `<meta http-equiv="refresh">` yönlendirme sayfaları, 1348'i blog TR-only
    olduğu için `/en/blog/*`+`/it/blog/*`) + `/demo` ve `/admin` (bilinçli
    kampanya/panel sayfaları, bkz. §Deployment "Decap CMS") — **hepsi
    kasıtlı olarak `noindex`** (2026-08-10 sistematik taramada doğrulandı,
    878 gerçek içerik sayfasının yalnızca 2'si noindex, kalan 876'sı
    indekslenebilir). Bu, SEO araçlarında "çok fazla noindex sayfa"
    uyarısı tetikleyebilir ama gerçek bir sorun DEĞİL, mimarinin beklenen
    bir sonucu.
28. **TODO — Blog yazılarının `<title>` uzunluğu (622 yazının 435'i,
    %70, 50-60 aralığı dışında) BİLİNÇLİ olarak ayrı bir tura ertelendi
    (kullanıcı kararı, 2026-08-10).** Kök neden site sayfalarınınkinden
    (`scripts/check-title-length.mjs`'in 194 blog-dışı düzeltmesi, bkz.
    Proje Durumu) FARKLI — format `${başlık} — idenfit Blog` (sabit ek),
    başlık uzunluğu EDİTORYAL olarak doğal biçimde değişken, mekanik bir
    şablon çözümü YOK. 249 yazı <50 karakter (doğal bir alt ifade
    eklenmeli, ör. "Başlık: Alt İfade — idenfit Blog"), 186 yazı >60
    karakter (kısaltılmalı). Bu, önceki turdaki 194 sayfalık düzeltmeden
    ~2 kat daha büyük bir içerik yazım işi — hazır olduğunda
    `node scripts/check-title-length.mjs` çıktısının `blog/` ile
    başlayan satırları başlangıç noktası.
29. **TODO — JSON-LD yalnızca blog'a (`BlogPosting`) kuruldu; ürün/modül,
    sektör ve kurumsal (Hakkımızda/İletişim/Fiyatlar vb.) sayfalarına
    structured data eklenmesi BİLİNÇLİ olarak ayrı bir karara bırakıldı
    (kullanıcı kararı, 2026-08-10).** Veri kaynağı kısmen hazır —
    `productContent.ts`/`sectorContent.ts`'in ara veri tipleri (WP export'tan)
    zaten bir `modified` alanı taşıyor ama public `getProductContent()`/
    `getSectorContent()` fonksiyonları bunu döndürdükleri objeye dahil
    ETMİYOR (blog'daki `modifiedDate` ile AYNI "veri var ama atılıyor"
    deseni) — ileride bu kapsam açılırsa önce bu iki fonksiyonun `modified`
    alanını expose etmesi gerekecek. Muhtemel şema: ürün/modül sayfaları
    için `Product` veya `Service`, sektör sayfaları için `Article`,
    kurumsal sayfalar için `Organization`/`WebPage`. Doğrulama script'i
    (`check-json-ld.mjs`) zaten genel (yalnızca `BlogPosting` değil,
    `Article` için de zorunlu/önerilen alan listesi tanımlı) — yeni bir
    tür eklenirse `REQUIRED_BY_TYPE`/`RECOMMENDED_BY_TYPE`'a satır eklemek
    yeterli.

**Kapanmış maddeler (3,4,5,7,11,17,18,23,26,27) arşivde** — özet: promo
görsel bulundu, blog 622/622 tamamlandı, Podcastler kaldırıldı, Gizlilik
ve Güvenlik Politikası migrate edildi, HR Olgunluk Testi kuruldu, Online
Sunum Talebi 7 tur sonunda onaylandı, navbar BLOG linki kaldırıldı,
Demirbaş/Seyahat mega-menüye bilinçli eklenmedi (kaynak da gizliyor),
erişilebilir adı olmayan `<a>` linkleri bulunup düzeltildi (2026-08-10,
tam detay Proje Durumu arşivinde/görev geçmişinde).

---

## Tamamlanan işler — kısa kronolojik özet

Tam süreç/kök-neden/ölçüm anlatıları için tarihli arşiv dosyalarına
bakılabilir (nadiren gerekir): `docs/claude-md-archive-2026-08-06.md`
(2026-07-21→08-06 tam günlük), `-07-31.md`, `-07-28.md`, `-07-23.md`.

- **2026-07-31:** Marquee scroll-hide titremesi kalıcı çözüldü (kök
  neden: `backdrop-filter`+`position:sticky` kombinasyonu — Playwright
  ölçümüyle kanıtlandı, header'dan `backdrop-blur` kaldırıldı, jank
  %58.8→%0.3). Online Sunum Talebi baştan kuruldu (element-ID doğrulamalı
  gerçek DOM yapısı, kırmızı panel tüm hero arkasında, form
  `variant="presentation"`). Navbar "BLOG" linki kaldırıldı.
- **2026-07-30:** Header scroll flicker 2 turda düzeltildi. İK Olgunluk
  Testi Section 2/3/5 genişletildi. Müşteriler sayfasına 14 logoluk
  marquee eklendi (hız kaynağın gerçek widget JS'inden hesaplandı, 84s).
  Blog 618/618→622/622 (kaynak sürekli büyüyor, periyodik senkron kararı
  bekliyor, Açık nokta #16).
- **2026-07-29:** `uploads.zip` işlendi, 2 alan pilot yerelleştirildi
  (kalan ~1260 görsel hotlink, Açık nokta #14). İK Olgunluk Testi'ne 5
  bölüm eklendi (kaynaktan ölçülerek). Sektör sayfalarındaki bozuk
  "Turizm Sektörü" çapraz-tanıtımı kaldırıldı (kaynağın kendi bug'ıydı).
- **2026-07-28:** Dijital İK Olgunluk Testi migrate edildi (3 ayrı WP
  sayfası, client-side skor hesaplama). `nl→en→tr` fallback zincirleme
  bug'ı düzeltildi (statik build SSR gibi zincirlemiyor — kalıcı ders:
  hem `astro dev` hem `astro preview` ile doğrulanmalı). Header logo
  50px'e düzeltildi, hero kırmızı panel padding'i düzeltildi. Navbar
  fontu element-ID ile kesin ölçüldü (13px/500/`#C1272D`, önceki 2 turun
  ölçümü yanlış CSS dosyasından okunmuştu — kalıcı ders: aynı jenerik
  Elementor class adı farklı template'lerde farklı kural taşıyabilir,
  `data-elementor-id` çapraz doğrulaması şart).
- **2026-07-27:** Müşteriler sayfası baştan tasarlandı (zigzag layout,
  dairesel görseller, tıkla-oynat video). Destek Talebi migrate edildi.
  Telefon ülke kodu site geneli bug'ı düzeltildi (45 ülke adı sabit
  Türkçe'ydi, 5 formu etkiliyordu). Testimonial Carousel'e geçiş
  animasyonu eklendi. KURUMSAL mega-menüsüne promo kart eklendi (kaynakta
  yok, bilinçli yeni özellik).
- **2026-07-24:** Blog migrasyonu FAZ B tamamlandı (618/618, Content
  Collections mimarisi kuruldu — `astro:content`, `file()` loader).
  Logo gerçek kaynak SVG'sine geçirildi (font değil). Site denetim
  raporu için 2 keşif raporu (`docs/remaining-work-report.md`,
  `docs/design-polish-opportunities.md`).
- **2026-07-21/23:** Temel modül migrasyonu (89 sayfa, 6 farklı ACF şema
  keşfedildi/normalize edildi — `extract-products.mjs`), sektör sayfaları
  (48 sayfa, ayrı `sectors` CPT keşfedildi), site denetim raporu 14/14
  kapandı (Kritik 3 + Yüksek 6 madde — mobil menü `createPortal` fix'i
  dahil, bkz. §Mimari "`position:fixed` kuralı"), Vite bağımlılık
  önbelleği bozulmasına kalıcı çözüm (`optimizeDeps.force+include`).
  **Üç kalıcı karar:** KARAR 1 (gerçek çeviri kuralı — eksik/kopya dil
  içeriği TR'den profesyonel çeviriyle üretilir), KARAR 2 (kaynakta
  olmayan çeviriler için yeni sayfa üretimi ertelendi, Açık nokta #1),
  KARAR 3 (hiçbir modül kapsam dışı bırakılmadı, 89 sayfayla kapandı).
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
§Proje Durumu).

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
  `measure-dom-size.mjs` (2026-08-10, DOM boyutu taraması — bkz. §Açık
  noktalar #24; `verify-navbar-jank.mjs`/`verify-marquee-scroll.mjs` ile
  AYNI desen, `playwright` kalıcı devDependency DEĞİL, `npm install
  --no-save playwright` ile geçici kurulur), `test-mobile-menu.mjs`
  (2026-08-10, `MobileMenu.tsx`'in masaüstünde hiç mount edilmediğini +
  mobilde tam işlevsel kaldığını doğrular — bkz. §Açık noktalar #24),
  `check-link-accessibility.mjs` (2026-08-10, KALICI erişilebilirlik
  aracı — erişilebilir adı olmayan `<a>` linklerini `dist/**/*.html`
  üzerinde tarar, `parse5`'e dayanır — bkz. §Proje kuralları
  "Erişilebilirlik" maddesi, yeni bir component/sayfa eklendiğinde
  tekrar çalıştırılabilir), `check-meta-description-length.mjs`
  (2026-08-10, KALICI SEO aracı — `<meta name="description">` 70-160
  karakter aralığının dışındaki VEYA eksik sayfaları `dist/**/*.html`
  üzerinde tarar, redirect stub'larını hariç tutar, `parse5`'e dayanır —
  yeni bir sayfa/component eklendiğinde tekrar çalıştırılabilir),
  `check-title-length.mjs` (2026-08-10, KALICI SEO aracı — `<title>`
  50-60 karakter aralığının dışındaki sayfaları tarar, AYNI desen),
  `check-image-alt-text.mjs` (2026-08-10 başlangıç/2026-08-11
  tamamlandı, KALICI erişilebilirlik aracı — `<img>` etiketlerinde `alt`
  özniteliğinin TAMAMEN eksik olduğu durumları tarar, `alt=""` dekoratif
  görsel için GEÇERLİ sayılır/ihlal DEĞİLDİR, AYNI desen; bkz. Proje
  Durumu — bu tur `SectorFeatureCard.astro`'nun 14 ikonundaki WP
  dosya-adı kaynaklı anlamsız `alt` metnini de buldu/düzeltti, ayrı bir
  yumuşak ihlal sınıfı olduğu için `check-image-alt-text.mjs`'in kendisi
  BUNU yakalamaz — yalnızca "alt hiç yok mu" sorusuna cevap verir),
  `check-json-ld.mjs` (2026-08-10, KALICI structured-data aracı —
  `application/ld+json` bloklarının geçerli JSON olduğunu, `@context`/
  `@type` + tipine göre zorunlu/önerilen alanları (`BlogPosting` için
  `headline`/`image`/`datePublished` zorunlu, `dateModified`/`author`/
  `publisher` önerilen) taşıdığını, tarih alanlarının ISO 8601 olduğunu
  ve `dateModified >= datePublished` mantığını doğrular — internet
  erişimi olmadan Google Rich Results Test/schema.org validator
  kurallarını YEREL uygular). **Not:** bu BEŞ `check-*.mjs` script'i
  (title/description/link-accessibility/json-ld/image-alt-text) `readdir(dir,
  {recursive:true})` yerine ELLE recursive tarama kullanıyor — bu proje
  OneDrive-senkronize bir klasörde, `recursive:true` bazen (görünürde
  rastgele) 2368 yerine 1 (hatta bazen 57) dosya döndürdü (2026-08-10'da
  defalarca bulundu, elle-taramaya geçildikten SONRA bile ara sıra
  tekrarladı). Yeni bir `check-*.mjs` script'i yazılırken AYNI
  elle-tarama desenine uyulmalı, `{recursive:true}` KULLANILMAMALI —
  VE herhangi bir tarama sonucunu güvenmeden ÖNCE en az 2 kez art arda
  çalıştırıp aynı sayıyı verdiği doğrulanmalı (tek seferlik bir "0
  sonuç" veya beklenmedik düşük sayı çıktısı GERÇEK olmayabilir).
- **Tip güvenliği:** `npx astro check` — i18n şemasının (ve genel
  TypeScript'in) hatasız derlendiğini doğrular; VS Code'un canlı
  diagnostics'i zaman zaman stale olabilir, `astro check` güncel sonuçtur.
- **Test yaklaşımı:** Yeni bir dil değiştirici/CTA/link değişikliğinden
  sonra ilgili `test-*.mjs` script'i (dev server ayakta olmalı) +
  regresyon için mevcut diğer `test-*.mjs`'ler çalıştırılır.
- **Erişilebilirlik — ikon-only link kuralı (2026-08-10):** Yeni eklenen
  her ikon-only link/buton (görünür metni olmayan, yalnızca bir SVG/ikon
  barındıran `<a>`) **mutlaka `aria-label` içermeli.** Site bileşenlerinin
  kendisi (Footer sosyal ikonları, `FloatingContactButtons`, mega-menü)
  bu kurala zaten uyuyor — asıl risk YENİ eklenecek bir icon-only CTA'nın
  bu adımı atlaması. `npm run` içinde bir script YOK, elle
  `node scripts/check-link-accessibility.mjs` (önce `astro build` şart,
  `dist/**/*.html`'i tarar) ile doğrulanabilir — büyük bir bileşen/sayfa
  eklendikten sonra çalıştırılması önerilir. **Not:** blog yazısı
  İÇERİĞİNDEKİ (legacy WP HTML, `posts.json`) benzer sorunlar ayrı bir
  mekanizmayla (`src/data/blogContentAccessibility.ts`, render-time
  otomatik düzeltme — bkz. §Açık noktalar #26) ele alınıyor, bu kural
  yalnızca EL İLE YAZILAN component/sayfa kodu için geçerli.
- **SEO — meta description kuralı (2026-08-10):** Yeni eklenen her sayfa
  **70-160 karakter aralığında, gerçek içerikten türetilmiş bir meta
  description taşımalı** — sayfa BAŞLIĞINI (title/H1) description olarak
  KULLANMAK YASAK (bu turda bulunan asıl bug sınıfıydı, bkz. Proje
  Durumu arşivi). Elle `node scripts/check-meta-description-length.mjs`
  (önce `astro build` şart) ile doğrulanabilir — büyük bir sayfa/component
  eklendikten sonra çalıştırılması önerilir.
- **SEO — `<title>` uzunluk kuralı (2026-08-10):** Yeni eklenen her sayfa
  **50-60 karakter aralığında bir `<title>` taşımalı.** Site sayfaları
  (blog HARİÇ) için `idenfit — {pageTitle}` şablonunu kullanan
  component'ler `src/data/pageTitle.ts`'in `buildIdenfitTitle(pageTitle,
  locale)`'ini ÇAĞIRMALI — 50'nin altında kalan başlıklara otomatik
  gerçek bir niteleyici ekliyor, ELLE `idenfit — ${x}` template literal'ı
  YAZILMAMALI (yeni bir kısa-title bug'ı yaratır). 60'ı aşan başlıklar
  otomatik KIRPILMAZ (`buildIdenfitTitle` yalnızca <50 durumunu ele alır)
  — bu durumda component'e `title` override prop'u (bkz. `ProductPage.astro`
  örneği) ile elle kısa bir başlık geçirilmeli. Elle
  `node scripts/check-title-length.mjs` (önce `astro build` şart) ile
  doğrulanabilir. **Blog yazıları bu kuralın DIŞINDA** — bkz. Açık
  nokta #28, ayrı/ertelenmiş bir kapsam.
- **JSON-LD `dateModified` güncelleme kuralı (2026-08-10):** Bir blog
  yazısının GERÇEK içeriği (metin/görsel/başlık — küçük yazım
  düzeltmeleri hariç) düzenlendiğinde, `BlogPosting` JSON-LD'sinin
  `dateModified` alanı da güncellenmelidir — AI arama motorları ve
  Google Rich Results bu alanı içerik tazeliği sinyali olarak kullanıyor
  (bu turun kendi motivasyonu). **Şu an OTOMATİK bir mekanizma YOK**
  (bilinçli, kullanıcı kararı — Faz 2 kapsamına girebilir): legacy
  yazılar (`posts.json`) için `scripts/extract-blog-posts.mjs` yeniden
  çalıştırılıp kaynağın WP `modified` alanı tekrar çekilirse otomatik
  güncellenir; göç etmiş `.md` yazıları (Decap CMS) için ise editörün
  frontmatter'a elle bir `modifiedDate:` alanı eklemesi/güncellemesi
  gerekir (şema zaten destekliyor, `z.coerce.date().optional()`) — Decap
  arayüzünde bu alan için henüz bir widget YOK, config.yml'e eklenmesi
  ayrı bir görev. Doğrulama: `node scripts/check-json-ld.mjs`.
- **Vite bağımlılık önbelleği bozulması — KALICI ÇÖZÜM (2026-07-23):**
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
     kendi otomatik soft-restart'ına GÜVENİLMEMELİ (restart "tamamlandı"
     dese bile React modülü bozuk kalabiliyor). Config dosyası
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
- **Proje temposu:** Haftalık hedeflerle ilerlenir, toplam süre önceden
  belirlenmez. Her hafta sonu değerlendirme yapılır. **Kalite > Hız.**
- **Güvenlik taraması alışkanlığı (2026-08-03):** `npm run audit`
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

