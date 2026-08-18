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
tamamlanıp commit edildi (2026-08-11, f21f863). Ana sayfa interaktif
Ürün Önizleme widget'ı (11/11 sekme + üst header'ın 9/9 ikon paneli)
tamamlanıp commit edildi (2026-08-13, 808412a+b9f713d). Şu anki odak:
Blog CMS (Decap) kademeli üretimi + SEO/erişilebilirlik takip turları.

**Eski günlük detayları (tarih damgalı arşivler, nadiren gerekir):**
`docs/claude-md-archive-2026-08-13.md` (2026-08-06→2026-08-13 tam günlük,
bu dosyanın bir önceki sadeleştirilmeden önceki hali — Landing Page/
Contact/404/SEO-erişilebilirlik denetim turlarının TAM anlatımı),
`docs/claude-md-archive-2026-08-06.md` (2026-07-21→2026-08-06),
`docs/claude-md-archive-2026-07-31.md`, `docs/claude-md-archive-2026-07-28.md`,
`docs/claude-md-archive-2026-07-23.md`.

---

## Proje Durumu (son güncelleme: 2026-08-18 — Ürün Önizleme widget'ı "çalışmıyor" bulgusu + kırmızı/genişletilmiş yeniden tasarım, kod commit EDİLMEDİ)

**🟢 Kullanıcının "dashboard çalışmıyor" bulgusu araştırıldı — gerçek bir kod
hatası DEĞİLDİ, bilinen Vite bağımlılık önbelleği bozulmasıydı.** Chrome'da
widget'ın tamamen katı kırmızı bir blokla kaplı göründüğü teyit edildi —
kök neden `[astro-island] Error hydrating ... TypeError: _jsxDEV is not a
function` (§Proje kuralları'ndaki bilinen "Vite bağımlılık önbelleği
bozulması" quirk'ü) — `ProductPreviewWidget` hiç hydrate olmadığı için
`WidgetAccentBackdrop`'ın arkasındaki kırmızı katman çıplak görünüyordu.
İki kez `npm run dev:clean` gerekti (ilk seferinde OneDrive'ın `dist/`
üzerindeki dosya kilidi `ENOTEMPTY` hatası verdi, elle tekrar denenip
düzeltildi). Kod tarafında düzeltme GEREKMEDİ.

**Kullanıcı isteği: "idenfit kırmızısıyla boya" + "dashboardı genişlet,
içindeki modülleri de genişlet iyileştir"** (referans olarak mor/pembe
degrade zeminli, ferah bir SaaS dashboard ekran görüntüsü paylaşıldı).
**Renk:** `HomeProductPreview.astro`'ya widget çerçevesinin arkasına
idenfit kırmızısı tonlarında yumuşak bir radyal gradyan "tuval" eklendi
(`#FFDCDC→#FFF3F3→#FFFFFF`, sabit padding/border-radius — önceki terk
edilmiş "ağ" deseninin yüzde-tabanlı taşma riski YOK) + çerçeve gölgesi
nötr siyahtan kırmızı tonlu bir gölgeye çevrildi
(`shadow-[...rgba(138,0,0,0.16)]`) + `WidgetAccentBackdrop`'ın "kayık
kart" ofseti büyütüldü (8px→12px, hover 12px→16px).

**Büyütme:** `ProductPreviewWidget.tsx`'teki TÜM kart/grafik/boşluk/ikon/
font değerleri (2026-08-14, 3. tur'daki "tek bakışta görülebilir"
küçültmenin TERSİ yönde) bir kademe büyütüldü — sidebar `lg:w-64`→
`lg:w-72`, içerik paddingi `p-3 sm:p-4`→`p-4 sm:p-6 lg:p-8`, grafik
yükseklikleri `h-28/h-36`→`h-36/h-44`, `WidgetCard`/`StatCard` paddingi
bir kademe arttı, sidebar nav/header ikon butonları büyüdü (`h-8 w-8`→
`h-9 w-9`). Toplam ~30 ayrı Tailwind class değişikliği.

**⚠️ Bu turda bulunup düzeltilen GERÇEK bir regresyon —
`EvaluationRow`'da (Performans Yönetimi sekmesi) isimler agresif şekilde
kırpılıyordu** (ör. "2026 Yıl Sonu 360° Değe..."). Kök neden: satır
`sm:flex-row` ile viewport genişliğine göre (640px) yatay düzene
geçiyordu, ama widget'ın GERÇEK konteyner genişliği (sidebar + sayfa
dolgusu düşülünce ~780-950px) her zaman bu viewport breakpoint'inden DAR
kaldığı için, büyütülmüş Dönem/Süre sütunu + 3 eylem butonu satırdan pay
kapıp isim için neredeyse hiç yer bırakmıyordu. **Düzeltme:** `sm:flex-row`
TAMAMEN kaldırıldı, satır HER genişlikte dikey/yığın düzende kalıyor —
Tailwind'in viewport-tabanlı breakpoint'lerinin, bir konteynerin GERÇEK
(sayfa içi sidebar/dolgu düşülmüş) genişliğinden farklı bir şeyi ölçtüğü
kalıcı bir ders. Bu değişiklik Performans sekmesinin doğal yüksekliğini
354px→822px'e çıkardı, `min-h-[580px]`→`min-h-[830px]`'e güncellendi.

**Kanıt:** `astro check` 0 hata (337 dosya), `astro build` 881 sayfa,
`check-link-accessibility.mjs` 0 ihlal (2375 dosya), `check-heading-hierarchy.mjs`
1 sorunlu sayfa (yalnızca bilinen `admin/index.html` H1-yok istisnası —
Açık nokta #33'ün 08-17'de kapanmış 0 seviye-atlaması durumuyla BİREBİR
aynı, sıfır yeni regresyon). Chrome'da 5 fonksiyonel sekmenin TAMAMI +
karanlık/aydınlık mod + yatay taşma yokluğu (`scrollWidth` ≤ `innerWidth`)
görsel/sayısal olarak doğrulandı. **Bilinen test metodolojisi notu (tekrar
karşılaşıldı, §Tamamlanan işler 2026-08-13'te de not düşülmüştü):**
`scrollIntoView()` + hemen ardından DOM `.click()` çağrısı `client:visible`
hydration'ından ÖNCE gerçekleşip sessizce hiçbir şey yapmıyor (hata YOK,
yalnızca React henüz bağlanmamış) — gerçek fare tekerleği scroll'u (veya
yeterli bekleme) güvenilir şekilde çalıştı.

**Kalan:** kullanıcının nihai görsel onayı + commit kararı. Bu turda
commit YAPILMADI, `HomeProductPreview.astro`/`ProductPreviewWidget.tsx`/
`WidgetAccentBackdrop.astro` hâlâ working tree'de.

---

## Proje Durumu (son güncelleme: 2026-08-17, 6. tur — Açık nokta #33a KAPANDI: 38 blog yazısındaki başlık seviye atlaması mekanik normalize ile düzeltildi, kod commit EDİLMEDİ)

**🟢 Başlık SEVİYE ATLAMASI bulgusunun son/en büyük parçası (38 blog yazısı,
Açık nokta #33a — 2026-08-13'ten beri "ayrı bir turda ele alınacak" diye
bilinçli ertelenmişti) kapandı.** Kök neden AYNI aileden ama `demoteBodyH1s()`'ten
(stray `<h1>`) FARKLI bir hata sınıfı: kaynağın Gutenberg editöründe
yazarlar ara başlıklar için rastgele/yanlış "Heading N" seviyesi seçmiş
(H2'den doğrudan H4/H5/H6'ya atlamak, veya `kadinlar-gunu` röportaj
yazısındaki gibi H1'in hemen altında ardışık 4 tane H6 — gerçek alt-bölüm
DEĞİL, yazarın Gutenberg'in "Heading 6" bloğunu küçük/kalın METİN STİLİ
için kötüye kullanması). Her yazıda "doğru" seviye farklı olduğu için
editoryal bir karar yerine MEKANİK/GÜVENLİ bir kural seçildi: her başlık
`min(ham_seviye, ebeveynin_yeni_seviyesi + 1)`'e normalize edilir (yığın/
stack tabanlı) — matematiksel olarak yeni bir atlama ÜRETEMEZ, içerik
UYDURMAZ (yalnızca etiket seviyesini değiştirir), zaten sıralı belgelerde
NO-OP'tur, aynı ham seviyedeki kardeş başlıklar (4 H6 gibi) aynı yeni
seviyeye düşer (artan bir "merdiven" oluşmaz).

**İki paralel uygulama gerekti (blog'un composite loader mimarisi
nedeniyle, bkz. §Mimari "Blog Content Collection"):**
1. **Legacy JSON yazılar (618)** — `blogHeadingSanitizer.ts`'e yeni
   `normalizeHeadingLevels()` (regex+stack tabanlı, `demoteBodyH1s()`'in
   AYNI dosyasında) eklendi, `content.config.ts`'in `legacyJsonLoader`'ında
   `demoteBodyH1s()`'TEN SONRA zincire eklendi (sıra kritik — gövdede
   gerçek `<h1>` kalmamış olmalı, aksi halde kök sentinel'le çakışıp
   yeniden bir H1 üretirdi).
2. **Göç etmiş Markdown pilotları (4)** — `astro.config.mjs`'e AYNI
   mantığın HAST (rehype AST) karşılığı `rehypeNormalizeHeadingLevels()`
   eklendi, `markdown.processor`'ın `rehypePlugins` dizisinde
   `rehypeDemoteBodyH1s`'TEN SONRA sıralandı (blog-h1-heading-audit.md
   memory'sindeki bilinen kısıtın — `glob()` loader'ının render'ı
   ERTELEDİĞİ için loader-time düzeltmelerin `.md` dosyalarına
   ULAŞMADIĞI — doğal bir devamı, bu yüzden `.md` için AYRI bir rehype
   plugin gerekti, legacy'nin regex'i yeterli olmadı).

**Kanıt:** `astro check` 0 hata (337 dosya), `astro build` 881 sayfa.
`check-heading-hierarchy.mjs` (2 kez art arda çalıştırılıp aynı sonuç
doğrulandı — OneDrive `readdir` güvenilirlik kuralı, bkz. §Proje kuralları)
**41→0 seviye atlaması** (yalnızca bilinen `admin/index.html` H1-yok
istisnası kaldı, kalan TÜM sayfalarda 0 sorun). `check-link-accessibility.mjs`
0 ihlal, `check-html-lang-attribute.mjs` 0 sorun, `check-json-ld.mjs` 0
geçersiz blok — sıfır yeni regresyon. 3 örnek elle `dist/**/*.html`'de
doğrulandı: `kadinlar-gunu`'nun 4 ardışık H6'sı artık H2 kardeşlere
normalize olmuş, `puantaj-takibi`'nin H4'ü ("Excel Puantaj Cetveli
Yapımı") artık doğru H3, göç etmiş Markdown pilotu
(`zirve-katilim-ix-kurumsal-egitim-ve-gelisim-zirvesi`) H1→H2 sıralı.

**Açık nokta #33 (Başlık seviye atlaması, tüm alt kategorileriyle)
TAMAMEN KAPANDI** — (a) 38 blog artık bu turda, (b) 2 hub + (c) 1 hukuki
sayfa zaten 2026-08-13'te kapanmıştı.

**Kullanıcı onayıyla commit edildi: cb35dac.** **Not (bu turda düzeltilen
eski bir CLAUDE.md yanlışlığı):** ana sayfa Ürün Önizleme widget'ı (11/11
sekme + 9/9 header paneli, bkz. 4. tur/2026-08-13 28. tur girdileri)
önceki turların notunun aksine ASLINDA ZATEN commit edilmiş durumdaydı
(`808412a`/`b9f713d`, `git log` ile doğrulandı) — dosyanın o bölümlerindeki
"henüz commit edilmedi" ifadeleri güncel değildi, düzeltildi.

---

## Proje Durumu (son güncelleme: 2026-08-17, 5. tur — "Large DOM size" bulgusu KAPANDI: MobileMenu mobilde de lazy-mount'a çevrildi, 1587→1327 element (-%16.4), commit edildi: 20b3465)

**🟢 Gerçek Chromium (Playwright) ölçümüyle kanıtlandı: yeni dashboard
widget'ı (11 sekme + 9 header paneli) SUÇLU DEĞİL — zaten optimal
yazılmış.** Kullanıcı "eski WP sitesi diye kapatmaya çalışma, gerçek
ölç" dediği için `astro build` + `astro preview` üzerinde gerçek
Chromium ile ölçüldü (spekülasyon yok):

- **9 header paneli** (`IconDropdown` component'i) — `{isOpen && (...)}` 
  ile koşullu render, yalnızca tıklanınca mount ediliyor (kaynak kodda
  doğrulandı). Widget'ın toplam DOM katkısı 251 element (masaüstü
  toplamının %18.9'u) — bir aktif sekme + kapalı header ikonları için
  makul.
- **5 sekme** (`ProductPreviewWidget.tsx`) — `{activeTab === 'zaman' &&
  <TimeManagementTab />}` deseniyle yalnızca AKTİF sekme mount ediliyor,
  diğer 4'ü DOM'da yok.

**Gerçek kaynaklar bulundu (ikisi de site geneli, Header her sayfada):**
1. **MegaMenu (4 panel, masaüstü toplamının %28'i / 372 element)** —
   `open ? 'opacity-100' : 'pointer-events-none opacity-0'` deseniyle
   HER ZAMAN DOM'da, yalnızca CSS'le gizleniyor. **YENİ bir sorun DEĞİL
   — Açık nokta #25'te 2026-08-10'da zaten bulunmuş, focus/kapanma bug
   riski nedeniyle bilinçli olarak ertelenmişti.** Bu turda TEKRAR
   dokunulmadı (kullanıcı kararı — ayrı, dikkatli bir tur gerektiriyor).
2. **MobileMenu off-canvas panel (mobilde +409/410 element, masaüstünde
   0)** — **DÜZELTİLDİ.** 2026-08-10'daki düzeltme yalnızca masaüstünde
   hiç mount edilmemesini sağlamıştı; mobil/tablet (<1024px) viewport'ta
   panel `open` state'inden BAĞIMSIZ, hydration'dan hemen sonra tam
   içeriğiyle mount oluyordu (yalnızca `translate-x-full` ile ekran
   dışına gizleniyordu) — kullanıcı hiç açmasa bile DOM'da tam ağırlığıyla
   duruyordu.

**Uygulanan düzeltme (`MobileMenu.tsx`):** panel artık `hasOpened` state'i
`true` olana kadar (kullanıcı hamburger'e TIKLAYANA kadar) hiç mount
edilmiyor — ilk açılıştan sonra BİLEREK bir daha unmount edilmiyor
(basit/düşük riskli tasarım: Lighthouse/DevTools'un DOM boyutu denetimi
SAYFA YÜKLENİRKEN ölçülür, kullanıcı etkileşiminden SONRAKİ büyüme bu
denetimi etkilemez — kapanışta yeniden unmount eden bir zamanlayıcı
gereksiz karmaşıklık/risk olurdu). **Görsel davranış riski (ilk açılışta
kayma animasyonunun kaybolması) ayrı bir `entered` state'iyle çözüldü**
— panel ilk mount'ta "kapalı" pozisyonda doğup bir `requestAnimationFrame`
sonra "açık" pozisyona geçiyor, böylece CSS transition'ın interpolasyon
yapacağı gerçek bir önceki/sonraki durum çifti oluşuyor (aksi halde panel
kaymadan aniden belirirdi). **İkinci bir gerçek risk** (odak-yönetimi
`useEffect`'i `panelRef.current`'ın ilk açılışta henüz mount edilmemiş
olabileceği bir yarış durumu) `hasOpened`'ın o effect'in bağımlılık
dizisine eklenmesiyle önlendi — aksi halde "açılınca ilk odaklanabilir
öğeye odaklan" davranışı SESSİZCE bozulurdu.

**Kalıcı test script'i güncellendi:** `test-mobile-menu.mjs` (2026-08-10'dan
kalma) — eski "panel başlangıçta DOM'da mevcut" varsayımı artık YANLIŞ
olduğu için ilgili assertion tersine çevrildi + ilk açılışta gerçek
animasyon oynadığını (mount anı ≠ 0px, 500ms sonra = 0px) + kapandıktan
sonra panelin BİLEREK DOM'da kaldığını doğrulayan 3 yeni kontrol eklendi.

**Kanıt (gerçek Chromium ölçümü, production build):**
```
Masaüstü toplam: 1327 element (değişmedi)
Mobil, DÜZELTME ÖNCESİ: 1737 element (1327 + 409/410 panel)
Mobil, DÜZELTME SONRASI (ilk açılıştan önce): 1327 element — masaüstüyle
  BİREBİR aynı, panel gerçekten mount edilmiyor
```
8 adımlı fonksiyonel doğrulama (mount öncesi yokluk, ilk açılışta
animasyonlu giriş, `aria-modal`, link render, akordeon aç/kapa, Escape,
kapandıktan sonra DOM'da kalma, 2. açılışta animasyonun yine oynaması,
dışarı tıklama) + güncellenmiş `test-mobile-menu.mjs`'in TÜM testleri
GEÇTİ. `astro check` 0 hata, `astro build` 881 sayfa (değişmedi),
`check-link-accessibility.mjs`/`check-heading-hierarchy.mjs`/
`check-html-lang-attribute.mjs` sıfır yeni regresyon (heading-hierarchy'nin
38 bilinen blog seviye-atlaması AYNI kaldı).

**🏁 KAPANIŞ NOTU — düzeltme sonrası SON rakam ölçüldü, "Large DOM size"
bulgusu KAPANDI.** Taze bir `astro build` + `astro preview` üzerinde,
ana sayfa, mobil viewport (375×812), off-canvas menü KAPALI (dokunulmamış
başlangıç durumu — kullanıcının orijinal bulgusuyla doğrudan
karşılaştırılabilir hâl) tekrar ölçüldü:

```
Kullanıcının bildirdiği orijinal bulgu: 1587 element
Düzeltme SONRASI, mobil (menü kapalı): 1327 element
Fark: -260 element (-%16.4)
```

(Bu turun kendi ÖNCE/SONRA ölçümüyle de tutarlı: 1737→1327, yani
MobileMenu'nün kendi mobil viewport üzerindeki katkısı tam olarak
-410 element/-%23.6 — kullanıcının orijinal 1587 rakamıyla aradaki
küçük fark muhtemelen ölçüm anındaki viewport genişliği/sayfa
durumu farkından kaynaklanıyor, kök neden ve düzeltme aynı.) Mobil
rakam artık **masaüstüyle birebir aynı (1327)** — off-canvas panel
kullanıcı hiç açmadığı sürece DOM'a hiçbir element eklemiyor,
doğrulandı (`body > div[role="dialog"]` sorgusu `false` döndü).
**Kalan bilinen/bilinçli kaynak yalnızca MegaMenu'nün 4 paneli
(Açık nokta #25, ayrı bir tur bekliyor)** — bu turun kapsamı dışında.

---

## Proje Durumu (son güncelleme: 2026-08-17, 4. tur — "Multiple H1 tags" SEO bulgusu incelendi: bizim projede YOK, kod değişikliği gerekmedi)

**🟢 "Multiple H1 tags" (7 H1 bulunmuş) bulgusu araştırıldı — projede
bu sorun YOK, kapatıldı.** Örnek URL verilmemişti, önceki H2/H3
turlarındaki AYNI yöntemle (şablon bazlı tarama + kalıcı otomatik
denetim aracı) ele alındı, kod DEĞİŞTİRİLMEDİ.

**Kanıt 1 — otomatik denetim (kesin):** taze bir `astro build`
sonrası `check-heading-hierarchy.mjs` (Header/Footer dahil TÜM HTML
çıktısında H1 sayan, yalnızca `<main>` değil) 882 gerçek içerik
sayfasının (881 build + admin paneli) **hiçbirinde** birden fazla H1
bulamadı — `admin/index.html`'in bilinen H1-yok istisnası dışında 0
sorun.

**Kanıt 2 — elle şablon taraması:** tüm sayfa component'leri (ProductPage/
SectorPage/LegalPage/HubPage/FaqPage/CalculatorsPage/BlogListPage/blog
`[slug]`/SecurityPage/ContactPage/AboutPage/HeroSection/NotFoundPage/
LandingPage/CustomerStoriesPage/ThankYouPage/SupportRequestPage/
PresentationRequestPage/PricingPage) çok satırlı `<h1\n class=...>`
yazımını da yakalayan bir regex'le tek tek grep'lendi — HEPSİ tam 1 H1.
`HrMaturityTest.tsx`'in tek H1'i yalnızca `CompanyStep` (giriş ekranı)
fonksiyonunda, diğer wizard adımlarıyla çakışma riski yok.

**Özellikle kontrol edilen riskli/yeni bileşenler (0 H1, temiz):**
`ProductPreviewWidget.tsx` (ana sayfa interaktif dashboard widget'ı),
`HomeProductPreview.astro`, `LandingHeader.astro`/`LandingDashboardPreview.astro`
(`/demo` bileşenleri), `Header.astro`/`Footer.astro`/`BaseLayout.astro`.
`Welcome.astro` (Astro starter kalıntısı) projede hiçbir yerde import
edilmiyor — ölü kod, risk değil.

**Blog gövdesi:** 622 yazının hiçbirinde birden fazla H1 yok — önceki
turda kurulan 2 katmanlı güvenlik ağının (`blogHeadingSanitizer.ts` +
`rehypeDemoteBodyH1s`, bkz. Tamamlanan işler 2026-08-12) hâlâ doğru
çalıştığının kanıtı.

**Sonuç:** bulgu muhtemelen eski canlı WordPress sitesinden (domain
henüz Cloudflare'e bağlanmadı, Açık nokta #31) geliyor — Açık nokta
#34'teki "No H3 subheadings" bulgusunda bulunanla AYNI kök neden
sınıfı. Kod tarafında hiçbir aksiyon gerekmiyor.

---

## Proje Durumu (son güncelleme: 2026-08-17, 3. tur — "No visible content dates" GEO bulgusu kapandı, commit edildi: e766bf5)

**🟢 Gerçek WP `modified` tarihi olan HER sayfa türüne görünür, semantik
`<time datetime>` eklendi — uydurma/varsayılan tarih HİÇBİR YERDE
kullanılmadı.** Keşif turunda blog yazılarının (622) zaten doğru `<time
datetime>` kullandığı doğrulandı (kod değişikliği gerekmedi) — asıl
eksik, ürün/sektör/hukuki/Donanım/Fiyatlar/Destek Talebi/Teşekkürler/
Online Sunum Talebi sayfalarının HİÇBİRİNİN `modified` tarihini
göstermemesiydi, oysa ham WP export'larının (`products.json`/
`sectors.json`/`misc-pages.json`/`hardware.json`/`pricing.json`/
`pages.json`) HEPSİNDE per-locale gerçek ISO tarih zaten vardı (Açık
nokta #29'daki "veri var, atılıyor" deseninin aynısı).

**Yeni altyapı:** `src/data/dates.ts` (`formatLocalizedDate()`, 4 dil
için BCP47 eşlemesi) + `src/components/LastUpdated.astro` (yalnızca
GERÇEK bir `date` prop'u verilmişse render eder, verilmezse HİÇBİR ŞEY
basmaz). Veri katmanına `get*ModifiedDate()` fonksiyonları eklendi
(`productContent.ts`/`sectorContent.ts`/`miscPagesContent.ts`/
`hardwareContent.ts`/`pricingContent.ts`/yeni `pagesJsonModified.ts`
[Destek Talebi/Teşekkürler için `pages.json`'daki bilinen id'den
okuyor]) — **GlobalBrand/WhyIdenfit/Hakkımızda/Online Sunum Talebi'nin
IT/NL içeriği TAMAMEN bizim elle yazdığımız çeviri override'ı olduğu
sayfalarda bu fonksiyonlar BİLEREK `undefined` döner** (ham WP tarihi o
metne karşılık gelmiyor, yanıltıcı olurdu).

**Kapsam:** 91+ ürün/modül sayfası (TR+EN+NL+IT, tekrarlayan 62 dosya
`add-modified-product.mjs` geçici script'iyle mekanik olarak işlendi —
kalıcı script DEĞİL, scratchpad'te), 48 sektör sayfası (`[sectorSlug].astro`
dinamik route'u tek noktadan tüm dilleri kapsıyor), 14 hukuki sayfa,
Donanım (4 dil), Fiyatlar (4 dil), Teşekkürler (3 dil, NL yok), Online
Sunum Talebi (4 dil, NL'de override olduğu için `undefined`).

**⚠️ Kullanıcı geri bildirimiyle konum DEĞİŞTİRİLDİ (aynı turda).** İlk
uygulamada tarih hero CTA butonunun/başlığın HEMEN ALTINA
yerleştirilmişti (görünürlüğü artırmak için) — kullanıcı bunun yerine
dikkat çekmeyen, sayfanın EN ALTINA taşınmasını istedi. Tüm 7 paylaşılan
component'te (`ProductPage`/`SectorPage`/`LegalPage`/`SupportRequestPage`/
`ThankYouPage`/`PricingPage`/`PresentationRequestPage`) `<LastUpdated>`
çağrısı hero/CTA'dan çıkarılıp `</BaseLayout>`'tan hemen önceki son
bloğa taşındı — `<main>` içeriğinin %94-99'luk noktasında (ölçülüp
doğrulandı) render ediliyor artık, hâlâ gerçek DOM'da/HTML'de mevcut
(GEO/arama motoru tarayıcıları görüyor) ama sayfanın ilk ekranında
GÖRÜNMÜYOR.

**Dokunulmayan sayfalar (kullanıcı kararıyla, bilinçli — gerçek veri
YOK, uydurulmadı):** Hub sayfaları (2 aile, `hubs.json`'da `modified`
alanı hiç yok), SSS (FAQ CPT'sinin 90 kaydında tarih alanı yok, sayfa
zaten çoklu-öğe agregasyonu), Müşteriler/Ana sayfa/Hesaplama Araçları/İK
Dijital Olgunluk Testi/Landing (`/demo`) — hiçbiri bir WP sayfasına 1:1
karşılık gelmiyor.

**Kanıt:** `astro check` 0 hata (337 dosya), `astro build` 881 sayfa
(değişmedi). Konum değişikliği sonrası 7 sayfa türünün HEPSİNDE tarihin
`<main>` içeriğinin son %1-6'lık diliminde render edildiği ölçülüp
doğrulandı. `check-link-accessibility.mjs` 0 ihlal, `check-heading-hierarchy.mjs`
39 (38 bilinen blog seviye atlaması + 1 bilinen `admin/index.html`
H1-yok — ÖNCEKİ turla birebir aynı, sıfır yeni regresyon),
`check-html-lang-attribute.mjs` 0 sorun. Pilot turda (`bordo-onay-modulu`/
`gida-sektoru-ik-cozumleri`/`kisisel-verilerin-korunmasi`/`destek-talebi`/
blog `google-dsc-fest-nazim-onur-bayindir-roportaj` — 5 yıllık gerçek
düzenleme farkı) + genel rollout sonrası dev server'da kullanıcı
tarafından canlı doğrulandı.

---

## Proje Durumu (son güncelleme: 2026-08-17, 2. tur — "Few H2 subheadings" SEO bulgusu kapandı, commit edildi)

**🟢 3 aile için gerçek/adlandırılmış içerik bloklarına eksik h2 eklendi
— mekanik bir "her sayfada en az N h2" kuralı DEĞİL, H3/FAQ turlarındaki
AYNI disiplin (sahte başlık yok, yalnızca gerçekten var olan içerik
etiketleniyor).** Keşif turunda TÜM sayfa şablonları tek tek incelendi
(ProductPage/SectorPage/HubPage/LegalPage/ContactPage/AboutPage/
PricingPage/CustomerStoriesPage/SupportRequestPage/ThankYouPage/
SecurityPage/FaqPage/HrMaturityTestPage/CalculatorsPage/BlogListPage/
blog `[slug]`/ana sayfa) — çoğu ZATEN iyi yapılandırılmış (ProductPage
her section'ı kendi h2'si, ana sayfa 8 h2, Contact 5, Pricing ~5 vb.).
LegalPage ailesi (14 sayfa) ZATEN 2026-08-13'te ayrı bir turda kapatılmış
(`legalHeadingSanitizer.ts`) — tekrar dokunulmadı. Kısa/tek-amaçlı
sayfalarda (Destek Talebi/Teşekkürler/Güvenlik) az h2 BİLİNÇLİ olarak
DOĞRU kabul edildi, zorlanmadı (Güvenlik zaten H3 turunda "H2 bile yok,
kasıtlı" diye karara bağlanmıştı).

**Düzeltilen 3 gerçek aile:**
1. **SSS sayfaları (sss/en/faq/it/faq)** — 6 kategori paneli DOM'da
   gerçekten var (yalnızca CSS `hidden` ile gizli), ama kategori adı
   önceden yalnızca sol sekme butonundaki bir `<span>`'dı, sağ panelde
   hiç heading yoktu. `FaqPage.astro`'ya her panelin başına
   `category.name` ile gerçek bir `<h2>` eklendi (sorular zaten `<h3>`,
   doğru H2→H3 hiyerarşisi kuruldu).
2. **Sektör sayfaları (12 sayfa × 4 dil)** — "Modül vurgu blokları"
   (`SectorFeatureCard` grid'i, kartlar zaten h3) hiç sarmalayıcı h2
   taşımıyordu. Yeni bir i18n anahtarı (`sectorPage.modulesHeading`,
   4 dilde gerçek çeviri — TR: "Bu Sektöre Özel Modüller", EN: "Modules
   Built for This Sector", NL: "Modules Speciaal voor Deze Sector", IT:
   "Moduli Dedicati a Questo Settore") `SectorPage.astro`'ya eklendi.
3. **Hesaplama Araçları** — 8 gerçek/farklı hesap makinesi (`CalculatorAccordion`,
   her biri zaten h3) hiç sarmalayıcı h2 olmadan hero h1'inin altında
   duruyordu. TR-only (KARAR 2) olduğu için elle kısa bir h2
   ("Hesaplama Araçları", H1'in uzun tanıtım cümlesinden FARKLI metin)
   `CalculatorsPage.astro`'ya eklendi.

**⚠️ Kendi kendine yanıltma bulunup düzeltildi — HTML yorumu içindeki
`<h2>`/`<h3>` metinleri (gerçek etiket değil, açıklama amaçlı) sahte bir
seviye-atlaması raporuna yol açtı.** `FaqPage.astro`'ya eklenen ilk
yorum "...Sorular zaten `<h3>` (birebir kaynak yapı) — ... gerçek bir
`<h2>` olarak eklendi..." diye köşeli parantezli yazılmıştı — Astro HTML
yorumları build çıktısında KORUNUYOR (JS yorumları gibi silinmiyor), ve
`check-heading-hierarchy.mjs`'in naif regex'i (`<h([1-6])`, gerçek DOM
parse değil) bu yorum metnindeki "<h3>"/"<h2>" alt-dizelerini GERÇEK
başlık sanıp `[H1→H3]` diye sahte bir atlama raporladı. Düzeltme: yorum
köşeli parantezsiz yazıldı ("H2"/"H3", `<` olmadan) — **kalıcı ders:**
`check-*.mjs` script'lerinin taradığı `dist/**/*.html` çıktısına giden
herhangi bir `.astro` dosyasına HTML yorumu eklenirken, yorum metninin
KENDİSİ ilgili script'in regex'ini tetikleyebilecek literal bir alt-dize
(`<h2>`, `<a href`, vb.) İÇERMEMELİ.

**🎁 Yan kazanım — bu turun SSS düzeltmesi, Açık nokta #33a'nın (Başlık
seviye atlaması) bekleyen bir parçasını da kapattı.** O turun notu zaten
"FAQ sayfalarındaki H1→H3 atlaması AYNI kök nedenin BİR PARÇASI" diye
işaretlemişti — SSS'ye gerçek h2 eklenince bu 3 sayfanın (tr/en/it)
H1→H3 atlaması da GERÇEKTEN düzeldi, ayrı bir iş gerekmedi
(`check-heading-hierarchy.mjs`'in seviye-atlaması sayısı 41→38'e düştü).

**Kanıt:** `astro check` 0 hata (334 dosya), `astro build` 881 sayfa
(değişmedi). `check-heading-hierarchy.mjs` 39 sorunlu sayfa (1 bilinen
`admin/index.html` H1-yok + 38 seviye atlaması, ÖNCEKİ 41'den 3 azaldı —
SSS'nin 3 dili düzeldi, YENİ hiçbir atlama YOK). `check-link-accessibility.mjs`
0 ihlal, `check-html-lang-attribute.mjs` 0 sorun, `check-json-ld.mjs` 0
geçersiz blok, `check-hreflang.mjs` hâlâ uykuda (0, beklenen). Pilot HTML
çıktısı `dist/sss/`, `dist/gida-sektoru-ik-cozumleri/`, `dist/hesaplama-araclari/`,
`dist/en/energy-sector-hr-solutions/`, `dist/nl/energie/` üzerinde
doğrulandı (doğru h1→h2 sırası, doğru çeviri). **Yan not (regresyon
DEĞİL):** `check-title-length.mjs` bu turda 431→439 sonucu verdi ama
farkın TAMAMI blog yazılarında (dokunulmayan Açık nokta #28 backlog'u) —
düzeltilen 3 ailenin (SSS/sektör/hesaplama) HİÇBİRİ raporda yok, sayı
farkı bu turun konusuyla ilgisiz.

**Dokunulmayan maddeler (kullanıcı kararıyla, bilinçli):** kısa/tek-amaçlı
sayfalar (Destek Talebi/Teşekkürler/Güvenlik), Hub sayfaları (intro+FAQ
zaten 2 gerçek h2, tile grid'e ekstra h2 GEREKMİYOR), LegalPage ailesi
(zaten kapalı), `nl/wereldwijd-merk` (ayrı bir NL içerik eksikliği,
şablon sorunu değil — Açık nokta #32'nin ikinci yarısı hâlâ açık).

---

## Proje Durumu (son güncelleme: 2026-08-17, 1. tur — "No hreflang tags" SEO bulgusu kapandı, canonical de aynı turda eklendi, commit edildi: 34e5366 + bbd5e11)

**🟢 hreflang + canonical altyapısı sıfırdan kuruldu, "hazır ama uykuda"
ilkesiyle.** Kullanıcının bildirdiği "No hreflang tags" SEO bulgusu
araştırıldı — keşif turunda 2 kritik bulgu netleşti (uygulamaya geçmeden
önce kullanıcıya raporlanıp onay alındı):
1. **Mutlak URL bloker'ı.** Google'ın hreflang dokümantasyonu `href`'in
   fully-qualified olmasını zorunlu kılıyor, göreli yol GEÇERSİZ sayılıyor
   — ama `astro.config.mjs`'in `site` alanı hâlâ boş (Açık nokta #31'in
   AYNI gerekçesi: `idenfit.com` domain'i hâlâ eski WordPress sitesine
   ait). **Kullanıcı kararı:** hem hreflang hem canonical şimdi kodlanıp
   `Astro.site` tanımlıysa aktif, tanımlı DEĞİLSE HİÇ `<link>` üretmeyecek
   şekilde kuruldu (`BaseLayout.astro`'nun `pageUrl`'i zaten bu ilkeyi
   taşıyordu) — Faz 2'de domain bağlanınca **ikisi de otomatik aynı anda
   aktifleşecek**, ek kod değişikliği gerekmeyecek.
2. **Fallback/redirect sayfalara hreflang YASAK.** Google'ın rehberi:
   hreflang hedefleri geçerli/indexlenebilir sayfalar olmalı, redirect'e
   veya `noindex` sayfaya işaret eden hreflang GEÇERSİZ sayılıp yok
   sayılıyor. Projenin fallback redirect stub'ları (Açık nokta #27) zaten
   `noindex` — bu yüzden yalnızca GERÇEK içeriği olan diller için hreflang
   üretiliyor, fallback/alias'lı diller için HİÇ.

**Mimari:** `src/i18n/localeUrls.ts` (Header'ın `genericLocaleUrls`
hesaplaması buraya taşındı, DRY) + `src/i18n/hreflang.ts`
(`buildHreflangAlternates()`). `BaseLayout.astro`/`LandingLayout.astro`'ya
yeni `hreflangLocales?: Locale[]` prop'u — verilmezse TÜM diller
varsayılır (sayfaların çoğu için doğru), GERÇEKTEN kısıtlı sayfalar
(NL'i olmayanlar, TR-only olanlar) elle geçiriyor.

**⚠️ Gerçek bir mimari tuzak bulunup düzeltildi — `get*LocaleUrls()`
fonksiyonlarının çoğu (dil değiştirici için) eksik NL'yi EN'in URL'ine
"alias"lıyor.** `miscPagesContent.ts`'in `localeUrlsFor()`'ı (KVKK/KVK
Protokol/Tüketici Hakları/Mesafeli Satış/Gizlilik-Güvenlik/Güvenlik/
GlobalBrand/WhyIdenfit/Hakkımızda/İletişim için paylaşılan) + ayrı
kopyaları (`faqContent.ts`/`hubContent.ts`/`supportRequestContent.ts`/
`thankYouContent.ts`) — `nl` eksikse `result.nl = result.en` yaparak
switcher'da kırık ara-adım/404'ü önlüyor (2026-07-22'den beri bilinen,
BİLİNÇLİ bir düzeltme). Bu hreflang için TAM TERSİ yönde yanlış bir sinyal
— hreflang="nl" hiç var olmayan bir NL sayfası yerine EN sayfasına işaret
ederdi. **Çözüm:** hreflang bu fonksiyonların ham `localeUrls` anahtarlarını
KULLANMIYOR, her sayfa `hreflangLocales` ile GERÇEK diller listesini
açıkça beyan ediyor (NL'i gerçekten olmayan 10 sayfa ailesi: KVKK/KVK
Protokol/Tüketici Hakları/Mesafeli Satış/Gizlilik-Güvenlik/Güvenlik/SSS/
2 Hub/Destek Talebi/Teşekkürler).

**⚠️ İKİNCİ bir gerçek bug — dosya adına göre "dil eksik" varsayımı YANLIŞ
çıktı, doğrulama script'i yakaladı.** İlk denemede Puantaj'a
(`puantaj-takip-programi-modulu.astro`) `hreflangLocales={['tr']}`
verildi (dosya listesinde "puantaj" içeren en/nl/it dosyası
BULUNAMADIĞI için) — ama gerçekte `en/time-attendance-module.astro`/
`nl/tijdregistratie.astro`/`it/modulo-gestione-presenze.astro` ÜÇÜ DE
`trSlug='puantaj-takip-programi-modulu'` kullanıyor (dosya adları PDKS'i
çağrıştırsa da, PDKS `pdks-modulu.astro` TAMAMEN AYRI bir aile) — CLAUDE.md'nin
kendi "slug değil, gerçek veriye güven" ilkesinin (bkz. §Mimari "Veri
çıkarma kuralı") TAM ÖRNEĞİ. `check-hreflang.mjs`'in karşılıklılık
(reciprocity) kontrolü bunu ANINDA yakaladı (EN sayfası TR'ye hreflang
veriyordu ama TR geri vermiyordu) — override kaldırılıp varsayılana
(4 dilin hepsi, `localeUrls`'un kendi anahtarlarından) dönüldü, sorun
kapandı. **Ders:** yeni bir `hreflangLocales` kısıtlaması eklenirken dosya
ADI değil, `grep -r "<trSlug>" src/pages` ile GERÇEK referans kontrol
edilmeli.

**Yan bulgu düzeltildi — `SupportRequestPage.astro`'nun `localeUrls`'i
HİÇ BaseLayout'a geçmiyordu** (dil değiştirici bu sayfada generic/yanlış
fallback'e düşüyordu, `getSupportRequestLocaleUrls()` zaten
`HeroSection.astro`'da kullanılıyordu ama buraya hiç bağlanmamıştı) —
düzeltildi, artık hem switcher hem hreflang doğru 3 dili (tr/en/it)
gösteriyor.

**Yan bulgu düzeltildi — `/nl/sss` sessiz 404.** SSS'nin TR bare slug'ı
(`sss`) EN/IT'nin (`faq`) FARKLI olduğu için otomatik `fallback` mekanizması
`/nl/sss/`'i var olmayan `/en/sss/`'e düşürüyordu — `astro.config.mjs`'e
elle `/nl/sss → /en/faq` redirect'i eklendi (Tüketici Hakları/Güvenlik'teki
AYNI bug sınıfı).

**Doğrulama script'i — `scripts/check-hreflang.mjs`** (KALICI, diğer
`check-*.mjs`'lerle AYNI desen). 3 kural: (a) her sayfa kendi kendine
referans veriyor mu, (b) karşılıklı mı (A→B varsa B→A da olmalı), (c)
hiçbir hedef redirect stub/noindex sayfa DEĞİL. `site` boşken (şu anki
durum) 0 sayfa bulup bilgi amaçlı mesaj basıyor (hata DEĞİL) — gerçek
çıktı GEÇİCİ bir `site` değeriyle test edildi (881 sayfa, 200 hreflang
taşıyan sayfa, 0 sorun bulundu Puantaj düzeltmesi sonrası), sonra `site`
KESİN olarak geri alındı (commit'e girmedi, yalnızca yerel doğrulama).

**Kanıt:** `astro check` 0 hata (334 dosya), `astro build` 881 sayfa
(hem `site` boşken hem GEÇİCİ dolu haldeyken denendi, ikisinde de sayfa
sayısı değişmedi). Geçici `site` build'inde: `check-hreflang.mjs` 0 sorun
(200 sayfa), `check-link-accessibility.mjs` 0 ihlal, `check-html-lang-attribute.mjs`
0 sorun, `check-heading-hierarchy.mjs` 42 (41 bilinen seviye atlaması +
1 bilinen `admin/index.html` H1-yok — SIFIR yeni regresyon), `check-json-ld.mjs`
0 geçersiz blok. Nihai (site boş) build'de aynı regresyon script'leri
tekrar 0/temiz.

---

## Proje Durumu (son güncelleme: 2026-08-14 — ÜST HEADER'IN 9/9 İKON PANELİ TAMAMLANDI, kod commit EDİLMEDİ)

**🟢 Kalan 6 ikon** (Analiz/Göz/Dil seçici/2. zil/HRTECHTOOLS/Avatar — bir
önceki turun "kalan 7 ikon" listesindeki gerçek 6 kalem, bkz. aşağıdaki
28. tur girdisi) `AppHeaderBar`'a **aynı `IconDropdown` desende** eklendi:
- **HRTECHTOOLS** (Grid3x3) — kullanıcının verdiği TAM spesifikasyon
  birebir: 2x3 ızgara + altta ortalanmış Workforce/Workmana + kırmızı
  "LATER IS NEVER". **GÜNCELLEME (aynı gün, bkz. aşağıdaki "pixel karşılaştırma"
  addendumu):** ilk sürümün renkli daire ikonları/Title-Case etiketleri
  gerçek ürünle karşılaştırılıp MONOKROM tasarıma çevrildi — bu madde
  ARTIK GEÇERLİ DEĞİL, güncel görsel açıklama için addendume bakın.
- **Dil seçici** (TR bayrağı) — Türkçe✓ + 10 dil, kullanıcının verdiği
  sırayla. **Beklenmedik bulgu:** önceki turun "7 dil için yeni SVG
  çizilmesi gerekecek" notu GÜNCEL DEĞİLDİ — `CountryFlagIcon.tsx`
  (telefon ülke kodu seçicisinden, 45+ ülke) GB/DE/ES/PT/IT/FR/NL/SA
  (Arapça)/RU/AZ dahil TÜM gereken bayrakları zaten içeriyordu, yeni SVG
  çizmeye gerek kalmadı. Tıklama gerçek dil değişikliği tetiklemiyor.
- **2. zil** ("Görevler") — Claude kararı: Bildirimler'in boş durumundan
  FARKLI, dolu bir "bekleyen onaylar" listesi (3 izin talebi/1 rapor/
  performans değerlendirmesi), kırmızı sayı rozeti — iki zilin ayrı bir
  amacı olduğunu gösteriyor.
- **Avatar menüsü** — Profil/Ayarlar/Çıkış Yap, 3 satır.
- **Analiz** — "Bugünün Özeti" (3 KPI satırı). **Göz** — "Görünürlük
  Ayarları" (3 dekoratif aç/kapa anahtarı).

**⚠️ Gerçek bug bulunup düzeltildi — Türkçe locale'de CSS `uppercase`
büyük/küçük harf dönüşümü:** HRTECHTOOLS'un "Later is never" metni CSS
`uppercase` ile büyütülüyordu — sayfa `lang="tr"` taşıdığı için tarayıcı
Türkçe büyütme kuralını uyguladı, "is" → "İS" (noktalı büyük İ) oldu,
Chrome'da görsel doğrulamada yakalandı. Bu literal bir İngilizce slogan
olduğu için düzeltme CSS `uppercase`'i KALDIRIP metni doğrudan `LATER IS
NEVER` (ASCII büyük harf) yazmak oldu — **kalıcı ders:** `lang="tr"`
altında CSS `uppercase`/`lowercase` İngilizce/kod metnine uygulanırsa
"i"/"I" harfleri Türkçe kurallarına göre (noktalı/noktasız) yanlış
dönüşebilir, literal İngilizce string'ler CSS transform yerine kaynakta
doğrudan büyük harf yazılmalı.

**IconDropdown genelleştirildi:** `icon` (yuvarlak ikon buton, mevcut
davranış) YA DA `trigger` (dil seçici/avatar gibi kendi düzeni olan bir
tetikleyici — flag+metin+chevron, DA dairesi+isim) kabul ediyor.
`HeaderPanelKey` 8 anahtara genişledi (`shortcuts`/`notifications`
+ `analytics`/`visibility`/`language`/`tasks`/`apps`/`avatar`).

**Kanıt:** `astro check` 0 hata (330 dosya), `astro build` 881 sayfa,
`check-link-accessibility.mjs` 0 ihlal (2374 dosya, regresyon yok).
Chrome'da 6 panelin TAMAMI açık/karanlık modda tek tek görsel
doğrulandı (HRTECHTOOLS'ta bug bulundu/düzeltildi, düzeltme sonrası
tekrar doğrulandı), tek-panel-açık davranışı (yeni bir ikona tıklamak
öncekini kapatıyor) + `Escape` ile kapanma + dışarı tıklama doğrulandı,
konsol yalnızca bilinen `fdprocessedid` tarayıcı-uzantısı gürültüsü
(ProductPreviewWidget'a özgü hiçbir hata yok).

**🟢 ADDENDUM (aynı gün) — HRTECHTOOLS paneli gerçek app.idenfit.com
ekran görüntüsüyle PİKSEL KARŞILAŞTIRILDI, kökten yeniden tasarlandı.**
Kullanıcı gerçek ürünün ekran görüntüsünü paylaştı — ilk sürüm (renkli
daire ikonlar, Title Case etiketler) gerçek ürünle HİÇ eşleşmiyordu.
Bulunan farklar ve düzeltmeler:
- **Tetikleyici ikon** — düz çerçeveli buton yerine dolu mor kare +
  beyaz ikon (projenin var olan `secondary` #6F2C90 token'ı yeniden
  kullanıldı, yeni renk İCAT EDİLMEDİ).
- **İkon stili kökten değişti — MONOKROM:** idenfit'in kendi uygulamaları
  (HR/Performance/Hiring) artık düz siyah outline ikon, arka plansız
  (`Star`/`Target`/`Sparkles`); 3. parti entegrasyonlar (Payroll/Access)
  koyu dolu kare (`#27272A`) + beyaz ikon (`Lock`/`KeyRound`); Workforce
  koyu DAİRE DEĞİL ALTIGEN (`clip-path: polygon(...)`) + beyaz `Zap`
  ikonu. Eski renkli daire arka planlar (kırmızı/mavi/yeşil/mor/amber/
  cyan) TAMAMEN kaldırıldı.
- **LMS kutusu** — generic ikon yerine "Anzera" kelimesi büyük/kalın bir
  "wordmark" olarak gösteriliyor (`AppTileData.wordmark` alanı, yeni
  `style:'wordmark'` varyantı).
- **Etiketler** — hem app adı hem marka adı artık TAMAMEN BÜYÜK HARF,
  LİTERAL olarak kaynakta yazıldı (CSS `uppercase` KULLANILMADI —
  "IDENFIT"/"HIRINGOZ" gibi içinde "i" geçen kelimeler `lang="tr"`
  altında CSS `uppercase` ile "İ"ye döner, "LATER IS NEVER" bug'ıyla
  AYNI kalıcı ders). Marka adı yazımı gerçek ekran görüntüsüne göre
  düzeltildi: "DataAssist"→"DATASSIST" (tek A), "A.Onkey"→"A. ONKEY"
  (boşluklu) — kullanıcıya bu değişiklik ayrıca bildirildi.
- **Panel** — `w-80`(320px)→`w-[26rem]`(416px), tek kart yerine başlık +
  içi ayrı `rounded-xl border` "iç kart" (gerçek üründeki 2 katmanlı
  kart hissine yakınsandı), "LATER IS NEVER" 10px→14px (`text-sm`).
- **Bilinçli sınır (kullanıcıya açıkça belirtildi):** Hiring/Payroll/
  Access/Workforce/LMS ikonları gerçek ekran görüntüsünde büyük
  ihtimalle o firmaların KENDİ marka işaretleri/logoları (özellikle
  "AnzerA" wordmark'ı belirgin bir logotype) — piksel piksel
  KOPYALANMADI (3. parti marka kimliğini taklit etmemek için), yalnızca
  genel STİL (monokrom, şekil ayrımı) jenerik lucide ikonlarla
  yakınsandı. Gerçek logo dosyaları sağlanırsa değiştirilebilir.

**Kanıt (addendum):** `astro check` 0 hata, `astro build` 881 sayfa,
`check-link-accessibility.mjs` 0 ihlal, Chrome'da açık/karanlık modda
yeniden doğrulandı (mor tetikleyici, monokrom ikonlar, altıgen Workforce,
"Anzera" wordmark, büyük harf etiketler — hepsi görsel olarak teyit
edildi).

**🟢 2. ADDENDUM (aynı gün) — HRTECHTOOLS'un 7 kutusu GERÇEK dış linklere
bağlandı.** Kullanıcının verdiği URL eşleştirmesi AYNEN kullanıldı (HR→
idenfit.com, Performance→app.conectohub.com, Hiring→hiringoz.com,
Payroll→login.dakika.com.tr, LMS→anzera.com.tr, Access→accessonkey.com,
Workforce→workmana.com), `target="_blank" rel="noopener noreferrer"`.
**Mimari değişiklik:** `AppTile` artık dekoratif `<span role="button"
aria-hidden>` DEĞİL, gerçek `<a href>` — `aria-hidden` kaldırıldı
(görünür app/marka metni doğal erişilebilir ad sağlıyor), ikon `<span>`'ları
`aria-hidden="true"` ile dekoratif işaretlendi. Tıklama hem yeni sekme
açıyor hem `onNavigate` callback'i (`AppHeaderBar`'dan `AppsPanelContent`'e
prop olarak geçiriliyor) paneli kapatıyor — ikisi bağımsız, çakışmıyor.
**Doğrulama yöntemi notu:** bu linkler `IconDropdown`'ın `{isOpen && ...}`
koşulu içinde olduğu için (panel varsayılan kapalı) `astro build`'in ürettiği
STATİK HTML'de HİÇ görünmüyor — yalnızca client-side hydration+kullanıcı
tıklaması sonrası DOM'da oluşuyorlar. Bu yüzden `check-link-accessibility.mjs`/
`test-no-external-idenfit-links.mjs` (ikisi de `dist/**/*.html` tarıyor) bu
linkleri GÖRMÜYOR — regresyon kontrolü için hâlâ çalıştırıldı (0 ihlal) ama
gerçek doğrulama Chrome'da `javascript_tool` ile DOM'dan 7 `href`/`target`/
`rel` değeri okunarak + 1 link gerçekten tıklanıp yeni sekmenin doğru adrese
gittiği + orijinal sekmede panelin kapandığı teyit edilerek yapıldı.

**Kanıt:** `astro check` 0 hata, `astro build` 881 sayfa. Chrome'da: 7
linkin TAMAMI DOM'dan okunup href/target/rel doğrulandı (7/7 doğru), "HR"
linkine tıklanıp gerçekten `idenfit.com`'da yeni sekme açıldığı + orijinal
sekmede HRTECHTOOLS panelinin otomatik kapandığı doğrulandı.

**🟢 3. ADDENDUM (aynı gün) — "İkonlar hâlâ soluk/pasif görünüyor" geri
bildirimi araştırıldı, 3 gerçek kök neden bulunup düzeltildi.**
`getComputedStyle()` ile DOM'dan ölçülünce HRTECHTOOLS'un ana ikonlarının
(HR/Performance/Hiring vb.) rengi/opaklığı ZATEN doğruydu (`rgb(7,7,7)`,
opacity 1 — hiçbir `opacity-50`/`text-muted` kalıntısı YOKTU) — ama 3
GERÇEK sorun bulundu:
1. **Avatar menüsü ikonları** (`AvatarPanelContent`) `text-body` (#333333,
   görece soluk gri) kullanıyordu — diğer panellerin `text-heading`
   (#070707) standardından SAPMIŞ, tek istisnaydı. `text-heading`'e
   çevrildi.
2. **HRTECHTOOLS tetikleyici butonu** `hover:opacity-90` taşıyordu —
   hover'da gerçekten hafifçe soluklaşıyordu. Diğer ikon butonlarının
   `hover:bg-*` (arka plan tonu) ilkesiyle tutarlı `hover:brightness-90`'a
   çevrildi — opaklık artık hover'da da SABİT %100.
3. **İkon stroke kalınlığı** — lucide'ın varsayılan `strokeWidth={2}`'si
   özellikle dolgusuz/outline ikonlarda (Star/Target/Sparkles/Lock/
   KeyRound/Zap/EyeOff) küçük boyutta ince/"soluk" bir izlenim
   veriyordu (renk doğru olsa da). `strokeWidth={2.5}`'e çıkarıldı —
   AppTile'ın 3 ikon varyantı (plain/dark-square/dark-hexagon) + Avatar
   menüsü ikonları + Görünürlük Ayarları başlığındaki `EyeOff`.
4. **Dil seçici paneli** — `max-h-72 overflow-y-auto` kaldırıldı,
   kullanıcı isteğiyle artık iç scrollbar YOK, 11 dilin tamamı panel
   doğal yüksekliğinde gösteriliyor (gerekirse SAYFA kaydırılıyor, panel
   kendi içinde kaymıyor).

**Kanıt:** `astro check` 0 hata, `astro build` 881 sayfa,
`check-link-accessibility.mjs` 0 ihlal. Chrome'da açık/karanlık modda
HRTECHTOOLS (ikonlar belirgin şekilde daha kalın/net), Avatar menüsü
(artık `text-heading` + kalın stroke) ve Dil paneli (scroll yok, 11 dil
sayfa akışında) `getComputedStyle()` ile SAYISAL olarak + görsel
zoom ile doğrulandı.

---

**🟡 YENİ ALT-İŞ (aynı gün) — WIDGET ÇERÇEVESİNİN ARKA PLANINA DEKORATİF
"AĞ" DESENİ EKLENDİ (yalnızca MASAÜSTÜ, PİLOT — mobil uyarlaması AYRI bir
turda). GÜNCELLEME: bu madde ARTIK GEÇERLİ DEĞİL — aşağıdaki "3. ADDENDUM"da
kullanıcı isteğiyle TAMAMEN TERK EDİLDİ, `WidgetNetworkBackground.astro`
SİLİNDİ, yerine çok daha basit bir "kayık kart" arka planı kondu. Bu
madde yalnızca o kararın GEREKÇESİ/geçmişi için tutuluyor.** Kullanıcı gerçek app.idenfit.com giriş ekranındaki dekoratif
deseni referans verdi: açık pembe/kırmızı radyal gradyan + nokta-grid
zemin, widget çerçevesinin etrafında kesikli kırmızı çizgilerle bağlı
6-8 ikon+etiket kutucuğu, köşe noktalarında küçük kırmızı daireler.

**Yeni component — `WidgetNetworkBackground.astro`** (statik, React
DEĞİL — widget'ın kendi içeriğine hiç dokunmuyor, salt görsel katman).
8 kutucuk (kullanıcının verdiği AYNI isimler — idenfit'in gerçek erişim
yöntemleri/modülleri): MOBİL/LAPTOP/YÜZ TANIMA/KART-NFC/PERFORMANS/İŞE
ALIM/QR OKUYUCU/PC, her biri elle çizilmiş sade bir SVG ikonla (üçüncü
parti ikon paketi KURULMADI, `FlagIcon.tsx`'in ilkesiyle AYNI).

**Teknik:** gradyan+nokta-grid zemin kendi `overflow-hidden`'ı olan AYRI
bir "hale" katmanı (`-inset-6 lg:-inset-8`); bağlantı çizgileri TEK bir
`overflow:visible` SVG'de, viewBox KULLANILMADI (doğrudan yüzde birimi —
container'ın gerçek boyutuna göre `preserveAspectRatio` bozulması/
letterbox riski olmadan hizalanıyor), `vector-effect="non-scaling-stroke"`
ile kesikli çizgi kalınlığı en/boy oranından bağımsız sabit. Kutucuklar
SVG değil sade HTML/CSS (gerçek font-rendering için).

**⚠️ Gerçek bug bulunup düzeltildi — yatay sayfa taşması:** ilk sürümde
yan kutucuklar (%113/-13 gibi) `document.documentElement.scrollWidth`'i
viewport'tan 177px taşırıp SAYFA GENELİNDE yatay scrollbar'a yol açtı —
çerçeve `max-w-7xl`'i neredeyse tamamen kapladığı için kenarlarda gerçek
boşluk yalnızca section'ın kendi padding'i kadardı. **İki katmanlı
düzeltme:** (1) yüzdeler mütevazı değerlere çekildi (%106/-3 gibi), (2)
`HomeProductPreview.astro`'daki section'a `overflow-x-hidden` eklendi
(savunma katmanı — olası bir kenar durumu sayfayı kırmak yerine sessizce
kırpılır). **İkinci bir bug:** sağ kutucuklar (KART/NFC, PERFORMANS)
çerçevenin İÇİNE 20px taşıyordu — çerçeve `z-10` (opak) olduğu için o
kısım görünmez oluyordu (metin "PERI" gibi kırpılmış görünüyordu) — Chrome'da
`getBoundingClientRect()` ile hem viewport hem çerçeve sınırlarına karşı
TEK TEK doğrulanıp yüzdeler (%103→%106) ayarlandı, her iki sorun da
kapandı (0 taşma, 0 çerçeve-üstü-binme, 8 kutucuğun TAMAMI için).

**Kanıt:** `astro check` 0 hata, `astro build` 881 sayfa,
`check-link-accessibility.mjs` 0 ihlal. Chrome'da: `document.documentElement.scrollWidth`
viewport'a EŞİT (taşma yok, doğrulandı), 8 kutucuğun `getBoundingClientRect()`'i
hem viewport hem çerçeve sınırlarına karşı SAYISAL olarak kontrol edildi
(hepsi temiz), `hidden lg:block` class'larının doğru uygulandığı
doğrulandı (mobilde bu katman TAMAMEN gizli — CSS mekanizması kontrol
edildi, gerçek dar viewport ekran görüntüsü bu oturumdaki bir araç
kısıtlaması nedeniyle alınamadı, ama Tailwind'in bu standart `hidden/lg:`
deseni site genelinde zaten kanıtlanmış).

---

**🟢 3. ADDENDUM (aynı gün) — "ağ" deseni TAMAMEN TERK EDİLDİ + 3 ayrı
bug düzeltmesi.** Kullanıcı "scroll kesinlikle olmamış" dedi — bir önceki
addendumun yatay-taşma düzeltmesi kullanıcının kendi ortamında YETERLİ
OLMAMIŞTI. Kullanıcı KENDİSİ karmaşık "ağ" desenini (nokta-grid+8 kutucuk)
terk etmeye açık olduğunu belirtti, yerine çok daha basit bir istek
verdi: koyu kırmızı bir "kayık kart" (offset shadow-card) arka planı,
hover'da kayma artan. Aynı mesajda 2 AYRI sorun daha bildirdi.

- **`WidgetNetworkBackground.astro` SİLİNDİ**, yerine `WidgetAccentBackdrop.astro`
  (yeni, çok daha basit) — widget çerçevesinin arkasında `#8A0000`
  (brand kırmızısı #FF0000'dan koyu) düz bir renk bloğu, `translate-x-2
  translate-y-2` ile hafifçe kaydırılmış (çerçevenin sağ/alt kenarından
  ince bir şerit halinde taşıyor), `group-hover:translate-x-3
  group-hover:translate-y-3` ile üzerine gelince kayma artıyor. Sabit
  piksel offset'leri (8px→12px) kullanıldığı için önceki turların
  yüzde-tabanlı taşma riski YAPISAL OLARAK YOK — bu yeni katman HER
  ZAMAN çerçeveyle birebir aynı boyutta (`inset-0`), yalnızca birkaç
  piksel kayıyor.
  **⚠️ Gerçek bug bulunup düzeltildi:** ilk denemede `-z-10` (negatif
  z-index) katmanı TAMAMEN GÖRÜNMEZ yaptı — negatif z-index'li bir
  absolute öğe, en yakın stacking-context kuran atanın (`<section>`)
  kendi opak sayfa arka planının ALTINA düşüyor. Düzeltme: negatif
  z-index KULLANILMADI, bunun yerine DOM sırası (katman çerçeveden ÖNCE)
  + çerçevenin kendi `z-10`'u yeterli oldu.
  **Hover doğrulaması:** `getComputedStyle().translate` ile hover
  ÖNCESİ "8px 8px" / hover SIRASINDA "12px 12px" ölçüldü (`--tw-translate-x/y`
  CSS custom property'leri üzerinden), gerçek çalıştığı SAYISAL olarak
  kanıtlandı.
- **Dashboard boyutu sekme değişiminde ARTIK SABİT.** Kullanıcı: "Modüller
  değişirken dashboardımızın boyutu değişmesin, bazen büyüyor bazen
  küçülüyor." Chrome'da 5 fonksiyonel sekmenin gerçek yüksekliği ölçüldü:
  İnsan Kaynakları 352px (en kısa) → Veri Analizi 576px (en uzun), 224px
  fark. `role="tabpanel"` içeriğine `min-h-[590px]` eklendi (en uzun
  sekme + küçük tampon) — artık 5 sekmenin TAMAMI 590px panel/760px
  çerçeve yüksekliğinde, ölçülüp doğrulandı (regresyon: kısa sekmeler
  altta biraz boş alan bırakıyor, bilinçli ödün).
- **Icon boldness — "bazı ikonlar hala soluk" bulgusu, 3 gerçek kaynak
  bulundu ve düzeltildi** (bir önceki turun HRTECHTOOLS/Avatar
  düzeltmesi widget'ın TAMAMINI kapsamıyordu): (1) `DateRangeCard`'ın
  (Veri Analizi sekmesi) tarih alanı ikonları `text-body`/`text-gray-300`
  miras alıyordu → `text-heading`/`text-gray-100`'e çevrildi; (2) sidebar
  modül listesinin ETKİN-AMA-SEÇİLİ-OLMAYAN sekmeleri (ör. aktif değilken
  "İzin"/"Veri Analizi") AYNI soluk `text-body` sorununu taşıyordu →
  `text-heading`'e çevrildi (gerçekten DEVRE DIŞI/"Yakında" sekmeler
  BİLİNÇLİ olarak dokunulmadı, o soluklaştırma doğru/kasıtlı bir sinyal);
  (3) TÜM ikon render noktalarına (`AppTileData`/`TabDef`/`StatCard`'ın
  `icon` tipleri genişletildi) `strokeWidth={2.5}` eklendi (lucide'ın
  varsayılan `strokeWidth=2`'si ince/pale görünüyordu, renk doğru olsa
  bile) — HRTECHTOOLS+Avatar'daki AYNI turun ilkesiyle, artık widget
  genelinde tutarlı.

**Kanıt:** `astro check` 0 hata, `astro build` 881 sayfa,
`check-link-accessibility.mjs` 0 ihlal. Chrome'da: 5 sekmenin panel
yüksekliği SAYISAL olarak (590px, hepsi eşit) doğrulandı, backdrop
katmanının `translate` değeri hover öncesi/sonrası (8px→12px) SAYISAL
olarak doğrulandı, `DateRangeCard` ikonlarının artık koyu render
edildiği görsel olarak teyit edildi.

---

**🟢 4. ADDENDUM (aynı gün) — Widget "tek bakışta görülebilecek" boyuta
küçültüldü + dashboard genelinde hover efekti + pasif sekme yazıları
koyulaştırıldı.** Kullanıcının 3 isteği:

1. **Küçültme.** Sidebar/header/kart/grafik/satır boşlukları ve
   boyutları sistematik olarak küçültüldü (`p-5`→`p-4`/`p-3`, ikon
   butonları `h-9 w-9`→`h-8 w-8`, grafik yükseklikleri `h-40`/`h-48`→
   `h-28`/`h-36`, sidebar genişliği `lg:w-72`→`lg:w-64`, `gap-5`→`gap-3`
   gibi ~25 ayrı değişiklik). **Sekme sabit-boyut mekanizması (bir
   önceki addendum) yeniden ölçüldü:** 5 sekmenin doğal yüksekliği artık
   308px–464px (önceki 352px–576px'ten belirgin küçük), `min-h`
   470px'e güncellendi. Chrome'da ölçüldü: widget artık TEK ekran
   görüntüsüne (709px yükseklik) SIĞIYOR — üst tarayıcı çerçevesinden
   alt köşesine kadar hiç sayfa kaydırmadan görünüyor.
2. **Hover efekti — dashboard'daki NEREDEYSE TÜM görsel öğelere
   eklendi:** `WidgetCard` (merkezi paylaşılan kart — gölge büyür +
   kenarlık kırmızıya döner, TÜM içerik kartlarını otomatik kapsıyor),
   `StatCard` (İzin KPI kartları — hafif yukarı kalkma + gölge),
   `EvaluationRow` (360° satırları — gölge + 3 eylem butonu `scale-105`),
   `ShiftAttendanceCard`/`BirthdayAnniversaryCard`/`ApprovalStatusCard`
   satırları (arka plan tonu), `DateRangeCard` alanları (kenarlık rengi),
   `RecalculateButton`/"Detaya Git" (scale/gölge), header ikon butonları
   (`hover:scale-105` eklendi, mevcut `hover:bg-*`ye ek). Sidebar
   sekmeleri ve `SectionMiniHeader`'ın linki ZATEN hover taşıyordu,
   dokunulmadı.
3. **Pasif sekme yazıları koyulaştırıldı — BİLİNÇLİ bir önceki karardan
   DÖNÜŞ.** Önceki turda "gerçekten devre dışı sekmeler (Bordro/İşe
   Alım/Çalışan Deneyimi/Modüller/Raporlar/Eğitim Akademisi) soluk
   kalmalı, bu kasıtlı bir sinyal" denilmişti — kullanıcı bu turda
   AÇIKÇA bunu istemedi, "diğerleri gibi koyu yap" dedi. `text-muted/50`/
   `text-gray-600` → `text-heading`/`text-gray-100` (enabled-inactive
   sekmelerle AYNI renk). `cursor-not-allowed` + tıklanamazlık
   KORUNDU — yalnızca RENK değişti, işlevsellik aynı.

**Kanıt:** `astro check` 0 hata, `astro build` 881 sayfa,
`check-link-accessibility.mjs` 0 ihlal. Chrome'da: 5 sekmenin yeni
doğal yükseklikleri tek tek ölçüldü (Zaman 329/İzin 333/İK 308/
Performans 390/Veri Analizi 464), widget'ın TEK ekran görüntüsüne
sığdığı doğrulandı, `WidgetCard`+satır hover'ları görsel olarak
(zoom ile) doğrulandı, karanlık modda pasif sekmelerin okunaklı
olduğu doğrulandı. **Yan not:** bu turda React'in synthetic
`dispatchEvent(new MouseEvent(...))` tekniği tutarsız çalıştı (bazen
tab değiştirmedi) — gerçek `computer` aracı fare tıklaması HER ZAMAN
güvenilir çalıştı, ölçümler o yöntemle yapıldı.

**Kalan:** kullanıcının nihai onayı + commit kararı (widget'ın TAMAMI
için — 11/11 sekme + 9/9 ikon paneli + sabit/küçültülmüş boyut + hover
efektleri + basit arka plan katmanı). Bu turda commit YAPILMADI, tüm
değişiklikler hâlâ working
tree'de.

---

## Proje Durumu (son güncelleme: 2026-08-13, 28. tur — TÜM SEKMELER TAMAMLANDI + header ikon panelleri PİLOT ONAYLANDI (2/9), kalan 7 ikon YARINA ERTELENDİ, kod commit EDİLMEDİ)

**🟡 ANA SAYFA — İNTERAKTİF "ÜRÜN ÖNİZLEME" WIDGET'I (Landing Page/Blog
CMS'in dışında, YENİ bir iş — kullanıcı gerçek app.idenfit.com ekran
görüntüleri gönderip anasayfaya sidebar+dashboard mockup'ı istedi).**
Yeni dosyalar: `src/components/ProductPreviewWidget.tsx` (React,
`client:visible`) + `src/components/HomeProductPreview.astro` (statik
sarmalayıcı) — `index.astro`'ya `FeatureGrid`/`SectionDivider` ile
`EfficiencySection` ARASINA eklendi (yalnızca TR ana sayfa, i18n kapsamı
ERTELENDİ). `global.css`'e sekme geçiş animasyonu (`ppwFadeSlide`/
`.ppw-tab-enter`) eklendi.

**Bu ana kadar biten (kullanıcı onaylı), sırayla:**
1. Gerçek sidebar düzeni — logo + modül listesi SOL sütun, içerik
   (KPI/grafik kartları) YANINDA (önceki "logo üstte, sekmeler altında
   tek sütun" hatası düzeltildi).
2. Marka çerçevesi — sahte tarayıcı bar'ı (`app.idenfit.com`) +
   widget İÇERİĞİNİN sol üstünde büyük siyah "idenfit" logosu (gerçek
   `IdenfitLogo.tsx` SVG'si, Header/Footer'la aynı).
3. **"Zaman Yönetimi" sekmesi** — Vardiya Devam Oranı (progress bar
   listesi) + Fazla Mesai Özeti (6 aylık stacked bar chart, 4 şube).
4. **"İzin" sekmesi** (kullanıcı sağladığı gerçek İzin dashboard ekran
   görüntüsüyle 2. kez revize edildi) — 4 renkli-üst-kenarlıklı KPI
   kartı (Bugün İzinli/Onay Bekleyen/Bu Ay Kullanılan Gün/Reddedilen) +
   İzin Türü Dağılımı (donut chart, "15 gün") + Onay Durumu Özeti
   (segmentli progress bar + 3 istatistik kutusu, sayılar KPI'larla
   TUTARLI).
5. **"İnsan Kaynakları" sekmesi** — Headcount Trendi (12 aylık çizgi
   grafik, SVG) + Doğum Günü & Yıldönümü listesi (emoji + renkli avatar).
6. **Sidebar modül listesi 11'e genişletildi** (kullanıcının gönderdiği
   tam ekran görüntüsüne sadık): 3 fonksiyonel (Zaman Yönetimi/İzin/
   İnsan Kaynakları) + Bordro/İşe Alım (gerçekten "Yakında" rozetli,
   kaynakta da öyle) + Performans Yönetimi/Çalışan Deneyimi/Modüller/
   Raporlar/Veri Analizi/Eğitim Akademisi (pasif, ROZETSİZ — gerçekte
   var oldukları için "Yakında" yazmak yanlış bilgi olurdu). Tüm pasif
   sekmelere hover efekti var.
7. **Üst uygulama header'ı** (`AppHeaderBar`, gönderdiği ekran görüntüsü
   referans) — analitik ikonu + "Personel ara..." arama kutusu (dekoratif)
   + göz ikonu + TR rozeti + ay/güneş ikonu + 2 bildirim/uygulama ikonu +
   "DA" (kurgusal, gerçek test hesabı adı KULLANILMADI) avatar.
8. **Fonksiyonel karanlık/aydınlık mod** — `ThemeContext` (React Context,
   YALNIZCA bu widget'a izole, site genelinde dark-mode altyapısı YOK/
   kurulmadı) ile ay/güneş ikonuna tıklanınca sidebar/header/kartlar/
   grafikler/metin tam bir koyu temaya geçiyor, sekmeler arası state
   korunuyor.
9. **"Performans Yönetimi" sekmesi** — 360° Değerlendirme liste görünümü,
   4 örnek satır (`PERFORMANCE_EVALUATIONS`): solda renkli daire+2 harfli
   avatar + değerlendirme adı, ortada "Dönem/Süre" tarih aralığı, sağda 3
   dekoratif eylem butonu (yeşil "Değerlendirmeyi Başlat" `#289C0F` —
   İletişim formunun submit butonuyla AYNI gerçek yeşil, mor "Önizleme"
   `bg-secondary` token'ı, kırmızı "Kopya Oluştur" `bg-brand`). Sidebar'da
   `enabled:true`'ya çevrildi. **Bir düzen bug'ı ilk taslakta bulunup
   düzeltildi:** isim bloğunun `flex-1` almaması nedeniyle isimler
   gereğinden erken/agresif kırpılıyordu (ör. "2026 Yıl Sonu 360°
   Değe...") — satırın orta/sağ bloklarının `shrink-0` olması isim
   bloğunu varsayılan `flex-shrink:1` ile sıkıştırıyordu, `flex-1`
   eklenip Dönem/Süre sütunu `sm:w-56`→`sm:w-48`'e daraltılınca isimler
   normal genişlikte render olmaya başladı (Chrome'da zoom ile öncesi/
   sonrası karşılaştırıldı).
10. **"Veri Analizi" sekmesi** — tema: departman/aylık devamsızlık analizi
    ("Zaman Yönetimi"nin vardiya devam oranlarıyla AYNI konu ailesinden,
    farklı bir kesit — içerik tekrarı değil). "Tarih Aralığı" kartı (2
    dekoratif tarih alanı + kırmızı "Verileri Hesapla" butonu) + 2 grafik
    kartı yan yana (`DEPARTMENT_ABSENTEEISM`: 6 departmanlı tek-seri kırmızı
    dolgu sütun grafiği, yeni paylaşılan `SimpleBarChart` component'i —
    `OvertimeSummaryCard`'ın çok-şubeli/stacked tekniğinin tek-serili
    sadeleştirilmiş hâli; `ABSENTEEISM_TREND_DATA`: 6 aylık kırmızı çizgi
    grafiği, mevcut `LineChart` component'i `color="#FF0000"` ile yeniden
    kullanıldı) + grafiklerin altında AYNI "Verileri Hesapla" butonunun
    2. tekrarı (`RecalculateButton`, kullanıcının belirttiği "×2" deseni
    — üstte tarih kontrolünün yanında + altta bir "yeniden hesapla"
    kısayolu). "Detaya Git →" linki `/hesaplama-araclari/`'a (TR-only
    Hesaplama Araçları hub'ı, en yakın gerçek eşleşme — bu sekmenin özel
    bir ürün/modül sayfası yok). Sidebar'da `enabled:true`'ya çevrildi.

**TÜM veri (isimler, sayılar, şube/departman adları) KURGUSAL** — gerçek
çalışan/müşteri verisi hiçbir yerde kullanılmadı (bilinçli ilke, tüm
tab'larda tutarlı). Kanıt (her adımdan sonra tekrarlandı): `astro check`
0 hata, `astro build` 881 sayfa, `check-link-accessibility.mjs` 0 ihlal
(2374 dosya, regresyon yok), `check-heading-hierarchy.mjs` 41 sorun (Açık
nokta #33'ün ÖNCEDEN bilinen/değişmeyen blog+FAQ sayısı, ana sayfa
listede YOK — regresyon yok), Chrome'da her sekme + karanlık/aydınlık mod
tek tek görsel doğrulandı, konsol hatasız (yalnızca bilinen
`fdprocessedid` tarayıcı-uzantısı gürültüsü).

**⚠️ Bu oturumda BİRDEN FAZLA kez BİLİNEN Vite bağımlılık önbelleği
hydration hatasıyla karşılaşıldı** ("Cannot read properties of null
(reading 'useState')" / "_jsxDEV is not a function") — HER SEFERİNDE
`npm run dev:clean` ile (bazen 2. bir `dev:clean` gerekti) düzeldi,
kodla İLGİSİZ, §Proje kuralları'nda zaten dokümante edilmiş kalıcı bir
quirk. Ayrıca: widget `client:visible` olduğu için scroll+hemen-tıklama
bazen hydration'dan ÖNCE gerçekleşip ilk tıklamayı kaçırıyor — ikinci
tıklama her zaman çalıştı, gerçek bir bug değil, test metodolojisi notu.

**🏁 TÜM SEKMELER TAMAMLANDI (11/11):**
1. ~~"Performans Yönetimi" sekmesi~~ — YAPILDI (bkz. madde 9 yukarıda).
2. ~~"Veri Analizi" sekmesi~~ — YAPILDI (bkz. madde 10 yukarıda).
3. ~~Kalan pasif sekmeler~~ (Bordro/İşe Alım/Çalışan Deneyimi/Modüller/
   Raporlar/Eğitim Akademisi) — kullanıcı bu turda "de ekle" dedi, ANCAK
   Chrome'da doğrulanınca bunların **6. maddede (bir önceki turda) zaten
   sidebar'a eklenmiş** olduğu görüldü (`TABS` dizisinde `enabled:false`
   + doğru "Yakında" rozeti/rozetsizlik + `cursor-not-allowed` +
   hover efekti) — yeni bir kod değişikliği GEREKMEDİ, yalnızca doğrulandı
   (İşe Alım sekmesi hover'da hafif gri vurgu aldığı, tıklanamadığı
   Chrome'da teyit edildi). İçerik hâlâ GEREKMİYOR, zaten pasif/dolgu
   olarak kalıyorlar (bilinçli — gerçekte var oldukları için "Yakında"
   yazmak yanlış bilgi olurdu).
4. Her adımdan sonra `dev:clean` ile doğrulanıp gösterildi, onay alındı
   (kullanıcının ısrarla istediği iteratif desen — "kod değişikliğine tek
   seferde geçme" — 5 fonksiyonel sekme boyunca korundu).

**🟡 SONRAKİ ALT-İŞ — ÜST HEADER İKONLARINA AÇILIR PANEL EKLENMESİ (11/11
sekme bittikten SONRA başlayan, AYRI bir iş — kullanıcı 5 referans
görüntü + 1 ekran görüntüsü (WhatsApp) gönderip `AppHeaderBar`'ın HER
ikonuna gerçekçi görünümlü bir dropdown istedi, arkasında GERÇEK işlev
GEREKMİYOR).** Kullanıcının kendi isteğiyle PİLOT desen uygulandı — 9
ikondan yalnızca 2'si bu turda dolduruldu, **PİLOT ONAYLANDI, kalan 7
ikon için "bugünlük duruyoruz" denildi.**

**✅ Tamamlanan altyapı + 2 panel (bu turun kalıcı sonucu):**
- **Genel dropdown mekanizması** (`HeaderPanelKey` tip + `IconDropdown`
  component'i, `AppHeaderBar.tsx` içinde) — tek bir `openPanel` state'i
  (`AppHeaderBar`'da), aynı anda yalnızca 1 panel açık kalabiliyor (yeni
  bir ikona tıklamak öncekini otomatik kapatıyor, state tekilliği
  sayesinde), `headerRef`'e bağlı TEK bir `useEffect` dışarı
  tıklama+`Escape` ile kapatmayı yönetiyor (her ikon kendi listener'ını
  KURMUYOR — performans/tekrar önlendi). `HeaderPanelKey` BİLİNÇLİ olarak
  yalnızca `'shortcuts' | 'notifications'` tanımlı — kalan 7 anahtarı
  şimdiden eklemek ölü kod olurdu, onay geldikçe genişletilecek.
- **"Kısayollar" paneli** (2x2 ızgara ikonu) — `HEADER_SHORTCUTS` (6
  kısayol, kullanıcının verdiği AYNI sıra/isim): Çalışan Oluştur/İzin
  Oluştur/Rapor Oluştur/Mesaj Gönder/Günlük Puantaj/Vardiya Takvimi, 2x3
  grid, her biri renkli ikon dairesi (%10 opaklık arka plan + dolu renk
  ikon) + etiket. İçerik `EvaluationRow`/`RecalculateButton`'ın AYNI
  ilkesiyle dekoratif (`role="button" aria-hidden="true"`, gerçek hedef
  YOK).
- **"Bildirimler" paneli** (İLK zil ikonu) — sade "Henüz bildirim yok"
  boş-durum metni + soluk zil ikonu, kullanıcının tarif ettiği referans
  görüntüyle birebir. **İKİNCİ zil BİLİNÇLİ olarak dokunulmadı** — hâlâ
  eski düz/tıklanamaz `<span>`, kullanıcının "7 kalan ikon" listesinde.

**⚠️ Kalıcı ders — z-index/stacking context (bu turda bulunup düzeltildi,
gelecekte benzer bir absolute-positioned overlay eklenirse hatırlanmalı):**
İlk denemede panel `z-20` kullanıyordu — ana sayfanın Hero bölümündeki
dekoratif "floating phone" görseli (`ref` bulgusu: "Bütüncül İK
Uygulamaları" görseli, Hero section'ın kendi stacking context'i) panelin
İKİNCİ satırını görsel olarak KAPATIYORDU (`z-20` bu görselin efektif
z-index'inden düşük kaldı). **Kök neden widget'ın kod DEĞİL, sayfa
GENELİNDE dropdown/popover gibi absolute-positioned öğelerin, kendi
component ağacındaki KOMŞULARDAN değil, SAYFA GENELİNDEKİ TÜM
stacking context'lerden yüksek olması gerektiği** — düzeltme `z-20`→
`z-50` (kalıcı, `IconDropdown`'ın panel className'inde). **Kural:** bu
widget'a (veya site genelinde) yeni bir absolute/fixed-positioned
overlay/dropdown/tooltip eklenirse, komşu bir elemente göre "yeterli"
görünen düşük bir z-index İLE YETİNİLMEMELİ — sayfanın TAMAMINDA
güvenle üstte kalacak yüksek bir değer (`z-40`+) baştan seçilmeli.

**Kanıt:** `astro check` 0 hata (330 dosya), `astro build` 881 sayfa,
`check-link-accessibility.mjs` 0 ihlal (2374 dosya, regresyon yok).
Chrome'da: Kısayollar paneli açık/karanlık modda tek tek görsel
doğrulandı (6 kısayolun HEPSİ görünür, z-index düzeltmesi sonrası
telefon görselinin ARKASINDA kalmıyor), Bildirimler paneli açılıp
`Escape` ile kapandığı doğrulandı, dışarı tıklamanın (bir grafik
kartına tıklama) açık paneli kapattığı DOLAYLI olarak doğrulandı
(bir tıklama hem eski paneli kapattı hem outside-click mantığının
çalıştığını kanıtladı), konsol hatasız.

**📋 Kalan 7 ikon (henüz dropdown YOK, kullanıcı kararıyla ERTELENDİ —
yarın devam edilecek, her biri için önerilen içerik CLAUDE.md'de
kullanıcının kendi mesajından kayıtlı, aşağıda özetlendi):**
1. **Analiz** (mini bar-chart ikonu, sol grup) — kullanıcı "sen öner"
   dedi, referans görüntüde net değildi. Öneri (henüz UYGULANMADI):
   kısa bir "Bugünün Özeti" panel'i (2-3 KPI satırı, widget'ın kurgusal
   veri ilkesiyle tutarlı).
2. **Göz ikonu** — kullanıcı "sen öner" dedi, referans görüntüde net
   değildi. Öneri (henüz UYGULANMADI): basit bir görünürlük/tooltip
   ayarı paneli.
3. **TR bayrağı + dil seçici** — kullanıcı TAM liste verdi: "Türkçe ✓"
   işaretli en üstte, altında İngilizce/Almanca/İspanyolca/Portekizce/
   İtalyanca/Fransızca/Flemenkçe/Arapça/Rusça/Azerbaycanca, HER BİRİ
   kendi bayrağıyla. **TIKLANINCA GERÇEKTEN DİL DEĞİŞTİRMEMELİ** (kritik
   kısıtlama — yalnızca görsel liste). Projede yalnızca 4 dilin
   `FlagIcon`'u var (TR/GB/NL/IT, bkz. `src/components/icons/
   FlagIcon.tsx`) — kalan 7 dil (Almanca/İspanyolca/Portekizce/
   Fransızca/Flemenkçe[NL zaten var]/Arapça/Rusça/Azerbaycanca) için
   YENİ bayrak SVG'leri elle çizilmesi gerekecek (`FlagIcon.tsx`'in
   KENDİ yorumundaki "yalnızca ihtiyaç duyulan bayrak, sıfır bağımlılık"
   ilkesiyle tutarlı — üçüncü parti bayrak paketi KURULMAMALI).
4. **2. zil** — kullanıcı "aynı Bildirimler panelini açabilir veya
   farklı içerik, sen karar ver" dedi. Öneri (henüz UYGULANMADI):
   muhtemelen farklı bir başlık ("Görevler"/"Onay Bekleyenler" gibi,
   İzin sekmesindeki "Onay Bekleyen" temasıyla tutarlı olabilir) —
   kesin karar verilmedi.
5. **HRTECHTOOLS** (3x3 ızgara ikonu) — kullanıcı TAM spesifikasyon
   verdi, "birebir kopyala" dedi: başlık "HRTECHTOOLS", 2 satır 3 sütun
   ikon grid'i — HR (idenfit), Performance (idenfit), Hiring
   (HiringOz), Payroll (DataAssist), LMS (Anzera), Access (A.Onkey),
   altta ortada Workforce (Workmana), en altta kırmızı "LATER IS NEVER"
   yazısı. **Bu idenfit'in kendi entegrasyon ekosistemi/kardeş
   ürünleri** — gerçek marka isimleri (HiringOz/DataAssist/Anzera/
   A.Onkey/Workmana), UYDURULMAMALI, kullanıcının verdiği isimler
   AYNEN kullanılmalı. İkon kaynağı belirsiz (her marka için gerçek
   logo mu, jenerik ikon mu kullanılacağı netleşmedi) — uygulama
   turunda kullanıcıya sorulmalı veya lucide jenerik ikonlarla
   başlangıç yapılıp onay istenmeli.
6. **Avatar** — kullanıcı "basit bir kullanıcı menüsü (Profil, Çıkış
   Yap gibi 2-3 satır), sen öner" dedi. Öneri (henüz UYGULANMADI):
   Profil / Ayarlar / Çıkış Yap, 3 satır, `EvaluationRow`'un dekoratif
   liste deseniyle tutarlı.

**Teknik hatırlatma (yarın için):** yeni panel eklenirken (1) `HeaderPanelKey`
tipine yeni anahtar eklenmeli, (2) ilgili ikon `<span aria-hidden>`'dan
`<IconDropdown>`'a çevrilmeli (`iconBtnClass`/`align`/`hiddenSm` prop'ları
mevcut ikonlarla AYNI desende geçirilmeli), (3) panel içeriği için yeni
bir `*PanelContent()` component'i yazılmalı, (4) `z-50` (veya daha
yükseği) KORUNMALI — bkz. yukarıdaki z-index dersi.

**Kalan:** kullanıcının nihai görsel onayı + commit kararı (widget'ın
TAMAMI için, yalnızca bu alt-iş için değil). Bu turda HİÇBİR commit
YAPILMADI (kullanıcı istemedi/gerek olmadı — tüm değişiklikler hâlâ
working tree'de, `git status`: `CLAUDE.md` + `src/pages/index.astro` +
`src/styles/global.css` (M) + `src/components/HomeProductPreview.astro`
+ `src/components/ProductPreviewWidget.tsx` (untracked)). Onay gelirse
tek bir commit'te toplanabilir.

---

### Açık noktalar / bekleyen kararlar

*(Aşağıdaki bazı maddeler "Proje Durumu N. tur" gibi artık bu dosyada
görünmeyen tur numaralarına atıfta bulunuyor — bu detaylı anlatımlar
`docs/claude-md-archive-2026-08-13.md`'e taşındı, madde numaraları/
içerikleri hâlâ geçerli.)*

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
    Script: `scripts/localize-images.mjs`. **Karar (2026-08-12, kullanıcı
    onayı ile):** Görsel yerelleştirme işi, Faz 2'ye geçmeden hemen önce
    ele alınacak — öncelik sırası bu tarihte netleşti.
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
    MobileMenu masaüstünde 2026-08-10'da, MOBİLDE 2026-08-17'de
    düzeltildi; MegaMenu HÂLÂ BİLİNÇLİ olarak ertelenmiş durumda.**
    **2026-08-17 güncellemesi:** 2026-08-10'daki düzeltme yalnızca
    masaüstünü kapsıyordu — mobil/tablet'te panel `open` state'inden
    BAĞIMSIZ, hydration'dan hemen sonra tam içeriğiyle (~409/410 element,
    gerçek Chromium ölçümüyle doğrulandı) mount olmaya devam ediyordu.
    "Large DOM size" bulgusu turunda `hasOpened` state'i eklenip panel
    artık MOBİLDE de kullanıcı hamburger'e tıklayana kadar hiç mount
    edilmiyor (bkz. Proje Durumu 2026-08-17, 5. tur — tam teknik detay,
    `entered` animasyon çözümü, `test-mobile-menu.mjs` güncellemesi
    orada). Aşağıdaki 2026-08-10 anlatımı yalnızca O TURUN (masaüstü
    kapsamı) tarihsel kaydı için tutuluyor. `scripts/measure-dom-size.mjs` ile 15 sayfalık
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
    bir sonucu. **Güncelleme (2026-08-11):** 4 yeni özel 404 sayfası
    (`/404`, `en/nl/it`'in `not-found` route'ları) da BİLİNÇLİ olarak
    `noindex` — toplam noindex sayfa sayısı 2→6 oldu, aynı gerekçe (404
    zaten indekslenmemeli) geçerli. **Güncelleme (2026-08-12):** bu
    stub'ların TAMAMI (1492, site büyüdükçe 1490'dan artmış) `<html>`
    etiketini HİÇ içermiyor (dolayısıyla `lang` özniteliği de yok) —
    kullanıcının bildirdiği "`<html>` etiketinde lang özniteliği eksik"
    uyarısının kaynağı. Bu, Astro'nun KENDİ framework-içi redirect
    şablonundan geliyor (`node_modules/astro/dist/core/routing/3xx.js`'in
    `redirectTemplate()`'i — `<!doctype html><title>...<meta refresh>...
    <body>`, hiç `<html>` üretmiyor) — bizim `src/` kodumuzda düzeltilecek
    bir şey YOK, Astro'nun kendisinin sunduğu bir config hook'u da yok.
    Aynı "noindex zaten var, gerçek bir sorun değil" ilkesiyle kapsam
    dışı bırakıldı, doğrulama script'i (`check-html-lang-attribute.mjs`)
    bu 1492'yi "hata" değil "bilgi amaçlı" olarak ayrı raporluyor.
28. **TODO — Blog yazılarının `<title>` uzunluğu (622 yazının ~434'ü
    hâlâ 50-60 aralığı dışında, 1'i 2026-08-13'te düzeltildi) BİLİNÇLİ
    olarak toplu değil KADEMELİ/talep geldikçe ele alınıyor (kullanıcı
    kararı, 2026-08-10, ilk takip turu 2026-08-13).** Kök neden site
    sayfalarınınkinden (`scripts/check-title-length.mjs`'in 194 blog-dışı
    düzeltmesi, bkz. Proje Durumu) FARKLI — format
    `${metaTitle ?? başlık} — idenfit Blog` (sabit ek), başlık uzunluğu
    EDİTORYAL olarak doğal biçimde değişken, mekanik bir şablon çözümü
    YOK. **Altyapı artık hazır** — `content.config.ts`'in `blogSchema`'sına
    eklenen `metaTitle?: string` alanı, `posts.json`'da ilgili yazıya bu
    alan eklenince H1/JSON-LD `headline`'ı DEĞİŞTİRMEDEN yalnızca `<title>`
    etiketini kısaltıyor (bkz. Proje Durumu 23. tur, `stratejik-yaklasimi`
    örneği). ~249 yazı <50 karakter (doğal bir alt ifade eklenmeli, ör.
    "Başlık: Alt İfade — idenfit Blog"), ~185 yazı >60 karakter
    (kısaltılmalı). Bu, önceki turdaki 194 sayfalık düzeltmeden ~2 kat
    daha büyük bir içerik yazım işi — hazır olduğunda
    `node scripts/check-title-length.mjs` çıktısının `blog/` ile
    başlayan satırları başlangıç noktası, her biri için `posts.json`'a
    `metaTitle` eklenmesi yeterli (H1'e DOKUNULMAZ).
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
30. **TODO — `public/_redirects`'in (404 sayfası, 2026-08-11) gerçek
    Cloudflare Pages davranışı henüz DOĞRULANMADI.** `astro dev`/`astro
    preview` bu dosyayı yorumlamıyor (yalnızca Astro'nun kendi 404
    fallback'i test edilebildi, bkz. Proje Durumu) — proje `wrangler`
    içermiyor. Faz 1 deploy'unda ilk kontrol edilmesi gereken şeylerden
    biri: `/en/<var-olmayan-bir-slug>/` gibi bir URL'in gerçekten
    `en/not-found/`'un İngilizce içeriğini (TR'ye değil) 404 HTTP status
    koduyla döndürdüğü canlıda doğrulanmalı.
31. **KISMEN KAPANDI (2026-08-17) — Canonical URL etiketi artık KODLANDI,
    yalnızca AKTİVASYONU Faz 2'yi bekliyor.** Önceki karar (2026-08-12)
    canonical'ı TAMAMEN ertelemişti; hreflang turunda (bkz. Proje Durumu)
    kullanıcı ikisinin AYNI anda, otomatik aktifleşmesini istedi —
    `BaseLayout.astro`/`LandingLayout.astro`'ya `{Astro.site && !noindex &&
    <link rel="canonical" href={pageUrl} />}` eklendi (`pageUrl` zaten
    `Astro.site` tanımlıysa mutlak, değilse göreli hesaplıyordu). `site`
    alanı hâlâ boş olduğu için ŞU AN hiçbir sayfada canonical YOK — Faz
    2'de domain bağlanınca (`astro.config.mjs`'e `site: 'https://idenfit.com'`
    girilince) EK KOD DEĞİŞİKLİĞİ GEREKMEDEN otomatik aktifleşecek, hreflang
    ile birlikte (bkz. Proje Durumu 2026-08-17 girdisi + `src/i18n/hreflang.ts`).
32. **KISMEN KAPANDI — 2 küçük H2 bulgusu (madde #32'nin hukuki sözleşme
    kısmı 2026-08-13'te, SSS kısmı 2026-08-17'de KAPANDI, bkz. Proje
    Durumu 2026-08-17 2. tur).** SSS sayfalarının (3: `sss`/`en/faq`/
    `it/faq`) kategori TAB başlıkları artık gerçek `<h2>` (`FaqPage.astro`,
    "Few H2 subheadings" SEO turu). **Kalan tek açık uç:** `nl/wereldwijd-merk`
    (Hedef Global Marka NL) TR karşılığına göre belirgin kısaltılmış (43
    vs 143 kelime) + H2 kaybetmiş — bu bir ŞABLON sorunu değil, ayrı bir
    NL İÇERİK eksikliği (Açık nokta #34.5 turu bilerek dokunmadı, ayrı bir
    NL içerik incelemesi gerektiriyor), henüz ele alınmadı.
33. **TAMAMEN KAPANDI — Başlık SEVİYE ATLAMASI, 44 sayfa (2026-08-13,
    "Başlık hiyerarşisi sıralı değil" SEO uyarısı — bkz. Proje Durumu 26.
    tur keşif + 27. tur düzeltme).** 3 alt kategoriden 2'si (b, c) 27.
    turda KAPANDI (44→41). **(a) 38 blog yazısı — 2026-08-17 6. turda
    KAPANDI** (`normalizeHeadingLevels()` — `blogHeadingSanitizer.ts`
    regex/stack tabanlı + `astro.config.mjs`'in `rehypeNormalizeHeadingLevels()`
    HAST karşılığı, `min(ham, ebeveyn+1)` mekanik kuralı, bkz. Proje
    Durumu 2026-08-17 6. tur tam detay, commit edildi: cb35dac).
    **(b) 2 hub sayfası** (`en/human-resources-management-modules`,
    `it/moduli-gestione-risorse-umane`) — KAPANDI: `hubTranslationOverrides.ts`'e
    TR kaynaktan çevrilmiş gerçek EN/IT `intro.title`/`intro.text`
    eklendi, `HubPage.astro`/`HubTileCard.astro`'ya koşullu
    `headingLevel` mekanizması eklendi. **(c) 1 hukuki sayfa**
    (`kisisel-verilerin-korunmasi`, KVKK TR) — KAPANDI:
    `legalHeadingSanitizer.ts`'in Kural 3'ü koşulsuz hale getirildi (her
    H4 → H2, diğer 11 legal sayfayı etkilemiyor). FAQ sayfalarındaki
    (Açık nokta #32) H1→H3 atlaması AYNI kök nedenin BİR PARÇASI — ayrı
    listelenmedi, hâlâ küçük/isteğe bağlı kategoride.
34. **KAPANDI — "No H3 subheadings" SEO bulgusu, ~250 canlı-site
    URL'i (2026-08-14).** Kullanıcının verdiği ham URL listesi 9
    kategoriye ayrılıp proje kaynak dosyalarından doğrulandı (tahmin
    edilmedi). **Kritik bulgu:** listenin ~%49'u (blog `/tag/` 67 +
    `/category/` 51 + `/blog/author/` 20 = 138 URL) bizim Astro
    projesinde HİÇ YOK — `src/pages` içinde bu route'lar için sıfır
    dosya (kategori arşivi zaten Açık nokta #22'de biliniyordu, etiket/
    yazar arşivleri için de AYNI durum bu turda doğrulandı). Bu URL'ler
    muhtemelen `idenfit.com`'un hâlâ canlı olan ESKİ WordPress sitesinden
    taranmış (domain henüz Cloudflare'e bağlanmadı, Açık nokta #31) —
    Astro migrasyonu canlıya alındığında bu 138 URL zaten var olmayacak,
    kod tarafında hiçbir aksiyon GEREKMİYOR (SEO aracına bildirmek
    kullanıcının kendi işi). Ayrıca 4 test/çöp URL (Grup 9) zaten bilinçli
    olarak migrate edilmemişti (dokunulmadı). **Yapılan düzeltme
    (`ProductPage.astro`, ~96 modül/ürün sayfasını TEK component
    değişikliğiyle kapsıyor):** SSS accordion'undaki `<summary>` içindeki
    soru metni `<span>`'dan gerçek `<h3 class="m-0 text-base
    font-semibold text-heading">`'e çevrildi (görsel/stil hiç değişmeden
    — `<summary>`'nin HTML5 içerik modeli tek bir heading elemanını ilk
    çocuk olarak kabul ediyor). Zimmet Yönetimi'nde pilot olarak
    doğrulandı, onay sonrası tüm siteye (`astro build` 881 sayfa) uygulandı.
    **Kanıt:** `astro check` 0 hata, `check-link-accessibility.mjs` 0
    ihlal (2374 dosya), `check-heading-hierarchy.mjs` 41 sorunlu sayfa —
    Açık nokta #33a'nın ÖNCEDEN bilinen/değişmeyen 38 blog+3 FAQ sayısıyla
    BİREBİR aynı (yalnızca `admin/index.html`'in bilinen H1-yok durumu
    ayrı), yani bu değişiklik SIFIR yeni seviye-atlaması üretti —
    `<h3>` her zaman bir `<h2>`'nin (SSS başlığı) altında, sıralı.
    **`BlogListPage.astro` (Grup 6) — KAPANDI, kasıtlı sınırlı kapsamla
    (2026-08-14, 2. tur).** Kart seviyesinde (kategori rozeti/tarih/okuma
    süresi) H3 eklemek BİLİNÇLİ olarak REDDEDİLDİ — bunlar bir içerik
    bölümünü TANITMIYOR, salt metaveri etiketi; heading yapmak sahte bir
    başlık üretip ekran okuyucu gezinme deneyimini bozardı (WCAG başlık
    kullanım ilkesine aykırı). Bunun yerine gerçekten anlamlı bir yer
    bulundu: `BlogSidebar.astro` (hem `/blog/` liste hem 622 tekil yazı
    sayfasında ORTAK kullanılan component) zaten 2 gerçek `<h2>` taşıyordu
    ("Popüler İçerikler"/"Yaklaşan Etkinlikler"), altlarındaki listede her
    satır kendi başlığı olan AYRI bir yazıyı adlandırıyordu —
    `ProductPage.astro`'nun SSS `<h2>→<h3>` deseniyle AYNI ilke. Post
    başlığı `<span>`'ı `<h3 class="m-0 text-sm font-semibold ...">`'e
    çevrildi (görsel/stil hiç değişmeden). **Kanıt:** `astro check` 0
    hata, `astro build` 881 sayfa, `check-link-accessibility.mjs` 0
    ihlal, `check-heading-hierarchy.mjs` 41 sorunlu sayfa — ProductPage
    turuyla BİREBİR aynı liste, SIFIR yeni seviye-atlaması (sidebar'ın
    H3'ü her zaman kendi H2'sinin altında). Grup 2'nin kurumsal alt
    kümesi (Hakkımızda/İletişim/Güvenlik, `AboutPage`/`ContactPage`/
    `SecurityPage.astro`) — 2026-08-14, 3. tur, TAMAMEN KAPANDI.**
    Her üç component TEK TEK incelendi (Hakkımızda/İletişim/Güvenlik'in
    TR/EN/IT hepsi aynı 3 shared component'i kullanıyor, tek yerden
    kapsıyor):
    - **`AboutPage.astro` — H3 EKLENMEDİ, gerekçe kaydedildi.** İki
      bölümü de ("tarihimiz" serbest metin/2 sütun paragraf, "Burada
      olmaktan mutluyuz" tek görsel+ortalanmış başlık) H2'nin altında
      AYRIŞTIRILABİLİR, adlandırılmış alt-öğeler taşımıyor — yalnızca
      düz metin/tek görsel. Zorlama bir H3 eklemek sahte başlık olurdu,
      bu sayfa türü için H3 GEREKMİYOR.
    - **`SecurityPage.astro` — H3 EKLENMEDİ, gerekçe kaydedildi.** Sayfada
      H2 bile YOK (yalnızca H1 + numaralı belge/link listesi) — H3'ü
      doğrudan H1'in altına eklemek YENİ bir H1→H3 seviye-atlaması
      üretirdi (bu turun asıl düzeltmeye çalıştığı sorun sınıfının
      AYNISI). Liste öğeleri zaten birer link (belge/KVKK'ya), her
      öğenin altında ayrıca içerik YOK — heading'e ihtiyaç duyan bir
      "bölüm" yapısı değil, düz bir link dizini. Bu sayfa türü için H3
      GEREKMİYOR.
    - **`ContactPage.astro` — GERÇEK bir yer bulundu, UYGULANDI.**
      "Ofislerimiz" H2'sinin altında `content.offices` — her biri
      kendi adı+adresi olan GERÇEK, adlandırılmış ofis kayıtları (TR: 3
      ofis — İstanbul Merkez/Ar-Ge, Lahey Global Satış; EN/IT'de kendi
      gerçek karşılıkları) — `ProductPage`'in SSS/`BlogSidebar`'ın
      popüler-yazı deseniyle AYNI ilke: gerçek adlandırılmış alt-varlık,
      zorlama değil. `office.name`'i taşıyan `<p>` → `<h3 class="m-0
      text-[22px] font-medium text-body">`'e çevrildi (görsel/stil hiç
      değişmeden).
    **Kanıt:** `astro check` 0 hata, `astro build` 881 sayfa,
    `check-heading-hierarchy.mjs` 41 sorunlu sayfa — ÖNCEKİ turla
    BİREBİR aynı liste, SIFIR yeni seviye-atlaması/regresyon. 3 dilde
    (TR/EN/IT) `dist/**/*.html`'den H3'lerin doğru ofis adlarıyla
    render olduğu doğrulandı. **Açık nokta #34 bu turla TAMAMEN
    KAPANDI** — SEO bulgusundaki tüm kategoriler (gerçek sayfa
    olmayanlar dahil) ele alındı/gerekçelendirildi.

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
bakılabilir (nadiren gerekir): `docs/claude-md-archive-2026-08-13.md`
(2026-08-06→08-13 tam günlük — Landing Page, İletişim sayfası,
404, SEO/erişilebilirlik/JSON-LD/başlık-hiyerarşisi denetim
turlarının TAM anlatımı; ilgili turların çoğu için ayrıca
`memory/` dosyaları da var, aşağıdaki özette işaretli),
`docs/claude-md-archive-2026-08-06.md` (2026-07-21→08-06),
`-07-31.md`, `-07-28.md`, `-07-23.md`.

- **2026-08-13:** Başlık seviye atlaması bulgusu (44 sayfa) 2 alt kategoride
  kapandı — 2 hub sayfası (EN/IT `intro` eklendi, koşullu `headingLevel`
  mekanizması) + KVKK TR (H4→H2 koşulsuz yükseltme) — kalan 38 blog yazısı
  bilinçli ertelendi (Açık nokta #33a). OG + Twitter Card paketi 881
  sayfaya sıfırdan kuruldu (3 katmanlı görsel hiyerarşisi: blog kendi
  görseli, ürün/sektör/hakkımızda/iletişim kendi hero'su, geri kalanı ana
  sayfa panel görseli fallback'i — Yoast'ın kürasyonsuz `og_image`'i
  BİLİNÇLİ kullanılmadı). Blog yazısı yazar atıfı eklenmemesi kararı
  (3 seçenek sunuldu, kullanıcı hiçbirini istemedi — kaynağın kendi WP
  kullanıcı adı kalitesi kusurlu). Blog `metaTitle` override altyapısı
  kuruldu (ilk kullanım: `stratejik-yaklasimi`), kalan ~434 yazı Açık
  nokta #28'de kademeli bekliyor. Hukuki sözleşme ailesine (11 sayfa)
  merkezi bir dönüşüm fonksiyonuyla (`legalHeadingSanitizer.ts`) gerçek
  H2/H3 hiyerarşisi eklendi. H2-eksik + başlık-seviye-atlaması için 2 ayrı
  site geneli keşif/raporlama turu yapıldı (bkz. Açık nokta #32/#33).
- **2026-08-12:** Puantaj sayfasına bölüm-seviyesi CTA override mekanizması
  eklendi (4 "Başlayın" CTA'sı tek tek çözüldü). CTA/anchor-text takip
  turları (Donanım/Doküman/Masraf/Şirket Takvimi/Özlük Dosyası tek tek
  doğrulandı). Site geneli CTA/anchor-text optimizasyonu (~150 ürün/
  sektör/hub sayfası, jenerik "Hemen Başvur" → sayfaya özel metin,
  `GENERIC_CTA_TEXTS`/`buildCtaAnchorText()`). Ana sayfaya SSS bölümü +
  `FAQPage` JSON-LD eklendi (7 soru, dil başına ayrı index eşlemesi — bir
  kategori içi soru sırası dilden dile farklı çıktı). Site geneli hero
  görseli `loading="lazy"` bug'ı düzeltildi (143 sayfa, LCP anti-pattern —
  ters yönde bir performans hatasıydı). Donanım sayfası lazy-loading+CTA
  takip turu. Blog gövdesinde stray `<h1>` için 2 katmanlı render-time
  güvenlik ağı kuruldu (`blogHeadingSanitizer.ts` + `rehypeDemoteBodyH1s`)
  — bkz. `blog-h1-heading-audit.md` memory.
- **2026-08-11:** İletişim sayfası 6 eksik bölümle tamamlandı (hero
  illüstrasyonu, form mesaj alanı, sosyal medya, video, ofis fotoğrafı,
  harita) sonra 5 takip turunda element-ID doğrulamalı ölçümle düzeltildi
  (full-bleed konteyner, tipografi, form grid, harita geri alma, submit
  butonu+Teşekkürler yönlendirmesi) — bkz. `contact-page-gap-audit.md`
  memory. Özel 404 sayfası kuruldu (4 dil — Astro'nun `404` dosya-adı
  özel muamelesi i18n fallback ile çakıştığı için `not-found.astro`+
  `_redirects` çözümü) + gerçek kaynak illüstrasyonu eklendi — bkz.
  `404-page-astro-i18n-gotcha.md` memory. KVKK/hukuki sayfa ailesi font/
  tasarım canlı siteyle eşleştirildi (14 sayfa) — bkz.
  `legal-page-font-design-audit.md` memory. Header/navbar konteyner bug'ı
  (Contact/Legal'daki AYNI `max-w-7xl`+`mx-auto` bug sınıfının 3.
  tekrarı) + marquee boyut/renk/sonsuz-döngü düzeltmesi — bkz.
  `header-marquee-audit.md` memory. Site geneli `alt` metni denetimi
  tamamlandı (14 sektör ikonundaki WP dosya-adı kaynaklı anlamsız `alt`
  düzeltildi) — bkz. `image-alt-text-audit.md` memory.
- **2026-08-10:** JSON-LD sıfırdan kuruldu (yalnızca blog, `BlogPosting`,
  622 yazı + `dateModified`, site önceden HİÇ structured data
  taşımıyordu) — bkz. `json-ld-audit.md` memory. `<title>` uzunluk
  denetimi (194 blog-dışı sayfa `buildIdenfitTitle()` ile düzeltildi, 435
  blog yazısı bilinçli ertelendi, Açık nokta #28) — bkz.
  `title-length-audit.md` memory. Meta description uzunluk denetimi (43
  sayfa, 4 ayrı kök neden — LegalPage'in ham-adres kırpması dahil) —
  bkz. `meta-description-audit.md` memory. Erişilebilir-ad-yok `<a>` link
  denetimi (19 ihlal, hepsi blog içeriğinde, render-time otomatik
  düzeltme kuruldu) — bkz. `link-accessibility-audit.md` memory. Site
  geneli DOM boyutu taraması + `MobileMenu` düzeltmesi (masaüstünde artık
  hiç mount edilmiyor, 14/15→0/15 şüpheli sayfa; `MegaMenu` bilinçli
  ertelendi, Açık nokta #25) — bkz. `dom-size-investigation.md` memory.
  Landing Page (`/demo`): sosyal kanıt logoları marquee'ye çevrildi,
  tasarruf hesaplayıcısının arka planı zenginleştirildi, hero İngilizce
  metne çevrildi, hesaplayıcı "mini deneyime" dönüştürüldü (slider +
  dinamik paket eşiği mesajı) — bkz. `landing-page-status.md` memory.
- **2026-08-07:** Landing Page gerçek ürün içeriğiyle zenginleştirildi
  (tasarruf hesaplayıcısı, dashboard preview mockup'ı, stat strip,
  sosyal kanıt satırı, bento grid, feature highlights) sonra görsel
  olarak yükseltildi (bold kırmızı renk uyumu ana sayfa/Online Sunum
  Talebi'yle hizalandı, gerçek ürün paneli mockup'ı + tarayıcı çerçevesi,
  "3 Adımda idenfit" timeline) — bkz. `landing-page-status.md` memory.
- **2026-08-06:** Landing Page (`/demo`) pilot iskeleti kuruldu (başlık +
  fayda listesi + form Adım 1, `noindex`, backend'siz `console.log`
  stub) — bkz. `landing-page-status.md` memory. (Landing Page daha sonra
  2026-08-11'de commit f21f863 ile tamamlandı.)
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
  kurallarını YEREL uygular), `check-heading-hierarchy.mjs` (2026-08-12,
  KALICI SEO/erişilebilirlik aracı — her sayfada TAM 1 `<h1>` olduğunu
  doğrular, AYNI desen; bkz. Proje Durumu — kullanıcının bildirdiği bir
  SEO uyarısından çıktı, blog gövdesinde WordPress kaynaklı stray `<h1>`
  bulguları için `src/data/blogHeadingSanitizer.ts` + `astro.config.mjs`'in
  `rehypeDemoteBodyH1s`'i render-time'da otomatik `<h2>`'ye indirgiyor),
  `check-html-lang-attribute.mjs` (2026-08-12, KALICI SEO/erişilebilirlik
  aracı — gerçek içerik sayfalarında `<html lang>`'in var olduğunu VE
  URL yoluna göre BEKLENEN locale'le eşleştiğini doğrular, redirect
  stub'larını AYRI/bilgi-amaçlı raporlar; bkz. Proje Durumu — kullanıcının
  bildirdiği bir uyarıdan çıktı, gerçek sayfalar zaten doğruydu, bulgu
  Astro'nun kendi framework-içi redirect şablonundaydı, kod değişikliği
  GEREKMEDİ), `check-hreflang.mjs` (2026-08-17, KALICI SEO aracı — her
  sayfanın kendi kendine referans verdiğini, karşılıklı (reciprocal)
  olduğunu VE hiçbir hedefin redirect stub/`noindex` sayfa olmadığını
  doğrular; bkz. Proje Durumu — `astro.config.mjs`'in `site` alanı boşken
  hiç hreflang üretilmediği için script bu durumda 0 sayfa bulup bilgi
  amaçlı çıkar, gerçek doğrulama GEÇİCİ bir `site` değeriyle yapılıp
  sonra geri alındı). **Not:** bu SEKİZ `check-*.mjs` script'i (title/
  description/link-accessibility/json-ld/image-alt-text/heading-hierarchy/
  html-lang/hreflang)
  `readdir(dir, {recursive:true})` yerine ELLE recursive tarama kullanıyor
  — bu proje
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
- **CTA/anchor text kuralı (2026-08-12):** Yeni bir ürün/modül/sektör/hub
  sayfası eklendiğinde hero CTA'sı (`hero.ctaText`) OTOMATİK kontrol
  edilir — `src/data/pageTitle.ts`'in `isGenericCtaText()`'i jenerik
  bulursa `buildCtaAnchorText(ctaKeyword ?? pageTitle, locale)`'a düşülür
  (bkz. Proje Durumu, CTA/anchor text optimizasyonu turu). Elle bir aksiyon
  GENELDE GEREKMEZ — yalnızca `pageTitle` kendisi 45+ karakterlik uzun bir
  tanıtım cümlesiyse (ör. Donanım/Demirbaş gibi), sonuç 60 karakteri
  aşabilir; bu durumda `ProductPage.astro`'ya `ctaKeyword` prop'uyla
  (`title`/`description` override'larıyla AYNI desen) kısa, gerçek bir
  anahtar kelime geçirilmeli. Kaynağın `hero.ctaText`'i ZATEN benzersiz/
  anlamlıysa (jenerik listede yoksa) HİÇBİR ŞEY yapılmaz. Yeni bir
  jenerik/tekrarlayan metin kalıbı keşfedilirse (kaynak WP verisi veya
  `*TranslationOverrides.ts` dosyaları büyüdükçe olası) `GENERIC_CTA_TEXTS`
  set'ine eklenmeli.
- **Open Graph görsel kuralı (2026-08-13):** Yeni bir sayfa/component
  eklendiğinde, sayfanın gerçek/temsili bir görseli varsa (`hero.image`,
  `featuredImage` gibi) `<BaseLayout>`/`<LandingLayout>` çağrısına
  `image={...url}` prop'uyla geçirilmeli (`title`/`description`
  override'larıyla AYNI desen) — verilmezse otomatik `HOME_PANEL_IMAGE`
  fallback'ine düşer (SORUN DEĞİL, yalnızca sayfaya özgü bir görsel
  varsa AKTARILMASI daha iyi bir paylaşım önizlemesi sağlar). Blog
  yazıları için `ogType="article"` geçirilir, diğer HER ŞEY varsayılan
  `website` kalır. Doğrulama: `node scripts/check-json-ld.mjs` OG'yi
  KAPSAMIYOR — elle `dist/**/*.html`'de `<meta property="og:` araması
  yeterli (bkz. Proje Durumu 25. tur).
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

