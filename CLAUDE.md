## Proje Durumu (son güncelleme: 2026-08-04)

**📍 YARIN BURADAN DEVAM — 2026-08-04'ün özeti ve açık uç.** Bugün sırayla:
paket güvenlik taraması (`npm audit` alışkanlığı + Decap CMS kararı, bkz.
§Proje kuralları), Hero formu metin oranları + telefon seçici (sağa alma +
gerçek SVG bayrak), Online Sunum Talebi (EN çevirisi/gramer + NL'nin
gerçek bir sayfaya kavuşması + telefon araması IT'ye kadar + logo
konumlandırma — 5 tur), Fiyatlar sayfası (kart altı bölümlerin `<table>`→
kutulu-sütun revizyonu + sticky/senkronize vurgulama JS'i — 2 tur), Müşteriler
sayfası (font/renk + video çözünürlüğü/boyutu — 3 tur), Hakkımızda sayfası
(bespoke component'e geçiş + ekip fotoğrafı güncellemesi) ele alındı — hepsi
aşağıda ayrı ayrı loglu, tam gerekçe/ölçüm detayları için ilgili günlük
maddesine bakılabilir.
**Açık uç — Fiyatlar sayfası ADIM 3 (kullanıcı onayı bekliyor, henüz
başlanmadı):** parantez içi metinlerin soluk rengi (`.parenthetical
{opacity:0.7}`, ör. "Dijital Sicil (Mikro)"), `employee-range` kutusunun
gerçek stili (`border:1px solid rgba(0,0,0,.1);border-radius:4px`) +
kullanıcının ekran görüntüsüyle son kontrolü — bkz. aşağıdaki "Fiyatlar
sayfası, kart altı bölümlerin büyük revizyonu" günlüğünün sonu.
**Araç kısıtı (tüm gün geçerliydi, muhtemelen yarın da geçerli olacak):**
Chrome uzantısı bu oturumda hiç bağlanmadı, Playwright bu sandbox'ta
tarayıcı process'i başlatamadı (`spawn UNKNOWN`, hem Bash hem PowerShell'de
denendi) — bugünün TÜM doğrulamaları element-ID doğrulamalı canlı CSS/HTML
okuması (`curl` + ham `post-*.css` analizi) + `curl` ile derlenen HTML
çıktısı karşılaştırması üzerinden yapıldı, gerçek piksel/görsel doğrulama
YOK — kullanıcının ekran görüntüsü geri bildirimi bu yüzden özellikle
değerli, birçok madde ("bu sefer çok aşağı inmiş" gibi) yalnızca bu
geri bildirimle düzeltilebildi.

**2026-08-04 günlüğü (7) — Hakkımızda sayfası BAŞTAN kuruldu (bespoke
component) + ekip fotoğrafı güncellendi.** Kullanıcı yazı stillerinin ana
siteden farklı göründüğünü + görselin güncellenmesi gerektiğini bildirdi.
Element-ID doğrulamalı (`post-9739.css`, TR/EN/IT'nin AYNI element ID'lerini
paylaştığı doğrulandı) inceleme KÖKTEN bir mimari sorun ortaya çıkardı: bu
sayfa o zamana kadar generic `ProductPage.astro`'yu (ürün/modül sayfaları
şablonu) yeniden kullanıyordu, ama kaynağın GERÇEK yapısı o şablondan
tamamen farklı — (1) Hero büyük bir ürün-başlığı DEĞİL, küçük alıntı-tarzı
bir H1 (26px/600 kırmızı, ProductPage'in 30-48px/700'ünden ÇOK küçük) +
"idenfit Ekibi" altyazısı (16px/400 gri) + küçük solid-dolgu buton
(16px/500/4px köşe, `.btn-cta`'nın pill stilinden farklı); (2) "tarihimiz"
bölümü resimsiz, İKİ paragraf YAN YANA (kaynakta 2 ayrı widget); (3)
"Burada olmaktan mutluyuz =)" bölümü metinsiz, ORTALANMIŞ başlık + ALT ALTA
tam-genişlik görsel. ProductSectionBlock'un tek "resim|metin yan yana"
şablonu bu 2 bölümün HİÇBİRİNE uymuyordu — bu, "font farklı" şikayetinin
kısmen YÜZEYSEL bir belirti olduğunu, asıl sorunun YANLIŞ ŞABLON KULLANIMI
olduğunu gösterdi. **Çözüm:** yeni bespoke `AboutPage.astro` (projenin
PricingPage/CustomerStoriesPage/PresentationRequestPage'de izlediği AYNI
ilke — kaynak yapı genel şablondan sapıyorsa özel component) — veri modeli
(`ProductContent`/`getAboutContent()`) DEĞİŞMEDİ, yalnızca render farklı.
"tarihimiz"in 2 yan-yana paragrafı veri modelini bozmadan CSS
`lg:columns-2` ile çözüldü (kaynağın 2 ayrı widget'ının görsel eşdeğeri).
**Görsel güncellemesi:** "Burada olmaktan mutluyuz" bölümünün ekip fotoğrafı
kaynak sitede 2026-05'te değişmiş (`hakkimizda-1-1.png`→
`Group-1365418971.png`, 4096×2232 — TR/EN/IT'nin ÜÇÜ de aynı yeni görseli
kullanıyor, doğrulandı) — görsel Read tool ile GERÇEKTEN görüntülenip
içeriği teyit edildi (idenfit çalışanlarının fotoğraflarından kırmızı/siyah
bir kolaj + "GREAT PEOPLE GREAT COMPANY"/"LATER IS NEVER" sloganları) —
yeni `ABOUT_TEAM_PHOTO_IMAGE` sabiti (`miscPagesTranslationOverrides.ts`)
TR/NL'nin (raw sections üzerinden merge) + EN/IT'nin (zaten override
dizileri) hepsine uygulandı. **Test:** `astro check` 0 hata (283 dosya,
yeni component), `astro build` 870 sayfa hatasız (değişmedi),
`test-no-external-idenfit-links.mjs` 2340/0, `dev:clean` + loglar temiz,
TR/EN/IT/NL `curl` ile tek tek doğrulandı.

**2026-08-04 günlüğü (6, kısa) — Müşteriler sayfası, video/görsel BİLİNÇLİ
kaynak-ötesi büyütme.** 5. günlükte kaynağın gerçek ölçülen değerlerine
(%50 medya sütunu, %80 hero görseli) düzeltilmişti — kullanıcı "biraz daha
büyüt" dedi, yani asıl istek kaynağa sadakat değil kişisel tercihmiş. Bu
turda kullanıcının AÇIK isteğiyle BİLİNÇLİ olarak kaynağın ötesine
çıkıldı: medya sütunu %50→%60 (`lg:w-3/5`, metin sütunu otomatik %40'a
küçülüyor), hero görseli %80→%100 (`w-full`). Test: `astro check` 0 hata,
`astro build` 870 sayfa hatasız, `dev:clean` + loglar temiz.

**2026-08-04 günlüğü (5, kısa) — Müşteriler sayfası, video/görsel boyutu +
hizalama.** Bir önceki turda metin boyutları büyütülünce (14→16px,
24→36px) video sütunu (`lg:w-[45%]`) yanındaki metne göre küçük kalmaya
başladı — kullanıcı "video/yazı aynı boyda olsun" + hero görselinin
"okunmadığını" bildirdi. Element-ID doğrulamalı (`d82235f`/`25d8e19`/
`7118d76`) canlı ölçüm İKİ gerçek sapma buldu: (1) hikaye satırlarının
medya sütunu kaynakta `lg:w-[45%]` değil TAM `--width:50%` (2026-07-28'de
eyeball tahminiyle seçilmiş 45%, şimdi gerçek değerle düzeltildi) — hem
kaynağa sadakat hem "video büyüsün" isteğini birlikte çözdü. (2) hero
görseli `max-w-sm`(384px SABİT tavan) değil kaynakta `img{width:80%}`
(kendi sütununun payı, ekran büyüdükçe büyüyen ORANSAL bir değer) —
sabit tavan kaldırılıp `w-4/5`'e çevrildi. Hizalama (`items-center`,
kaynağın `align-items:center`'ıyla zaten eşleşiyordu) değişmedi, yalnızca
görsel büyüyünce doğal olarak daha dengeli görünecek. Test: `astro check`
0 hata, `astro build` 870 sayfa hatasız, `test-no-external-idenfit-links.mjs`
2340/0, `dev:clean` + loglar temiz, TR/EN `curl` ile doğrulandı.

**2026-08-04 günlüğü (4) — Müşteriler sayfası, font/renk + video kalitesi
düzeltmesi.** Kullanıcı sayfadaki yazıların ana siteden farklı göründüğünü
+ 2 videonun (Femaş/Civil) küçük/düşük çözünürlüklü kaldığını bildirdi.
Element-ID doğrulamalı (`post-13119.css`, TR/EN/IT/NL'nin HEPSİ AYNI
element ID'lerini paylaşıyor — farklı post ID'lerinde bile — doğrulandı)
inceleme HEMEN HER metin bloğunda sapma buldu: H1 `font-bold`(700) değil
500, açıklama/quote `text-body`(#333333) değil `text-muted`(#808080,
`--e-global-color-629b0de` ile birebir) + 14px değil 16px, quote metni
İTALİK DEĞİLMİŞ (kaynakta hiç yok), quote yazarının adı/rolü `text-heading`
DEĞİL yine `text-muted` + 12px değil 18px, istatistik etiketi
(`.elementor-image-box-title`) 14px değil 23px, firma adı 700/sm:30px değil
500/sabit 36px. **Video kök nedeni:** `YoutubeClickToPlay.tsx`
`hqdefault.jpg` (YouTube'un DÜŞÜK çözünürlüklü 480×360, 4:3 thumbnail'i)
kullanıyordu — kaynağın gerçek video widget'ı 16:9 oranında
(`--video-aspect-ratio:1.77777`). `maxresdefault.jpg`'ye (1280×720, 16:9)
geçildi (her iki video ID için de gerçekten var olduğu `curl` ile
doğrulandı) + kart oranı `aspect-[4/3]`→`aspect-video`(16:9) — hem
çözünürlük hem "tam ekrana sığma" tek hamlede çözüldü (4:3↔16:9 uyumsuzluğu
zaten görsel kırpılma/küçük görünme hissinin kök nedeniydi). Köşe yarıçapı
da ölçülen gerçek `14px`'e (`rounded-2xl`=16px değil) + gerçek gölgeye
düzeltildi. **Test:** `astro check` 0 hata, `astro build` 870 sayfa
hatasız, `test-no-external-idenfit-links.mjs` 2340/0, `dev:clean` + loglar
temiz, TR/EN/IT/NL `curl` ile tek tek doğrulandı.

**2026-08-04 günlüğü (3) — Fiyatlar sayfası, kart altı bölümlerin büyük
revizyonu (ADIM 1 keşif → ADIM 2 pilot).** Kullanıcı kartların ALTINDAKİ
bölümleri (Özellikler/Eklentiler) canlı kaynakla karşılaştırmamı istedi —
önce kod yazmadan bir keşif raporu sundum, onay üzerine uygulandı.
**Keşif bulguları:** (1) Özellikler/Eklentiler `<table>` DEĞİL — sol
tarafta sabit 220px'lik isim sütunu + kartlarla AYNI görsel dili paylaşan
(`border:1.5px solid #FFCCCC; border-radius:10px`) 3 ayrı "kutulu sütun",
Eklentiler'in ALTINDA her sütunun kendi CTA butonu var. (2)
`.btn-start`/`.btn-buy`/`.btn-pro` TEK paylaşılan buton ailesi (açık pembe
`#fed9d9` varsayılan → kart/sütun "seçili" olunca düz kırmızı `#e60000`+
beyaz metin) — kart bazlı kasıtlı bir fark YOKMUŞ, önceki turun
`.btn-cta`/gri-çerçeve ayrımı yanlıştı. (3) Kart boyut/renk/font'unda da
(bir önceki turda hiç değinilmemiş) büyük sapmalar vardı: sayfa arka planı
`#f8f8f8` (bizde beyazdı), container 1440px+100px padding (bizde
max-w-6xl), kart h3 `38px/700` (bizde 20px), kart kenarlığı `#FFCCCC`
(bizde gri), fiyat `38px/500` (bizde 30px/700). (4) Dinamik davranış:
`activateColumn()` — kart/tablo sütunu tıklamak HEM o öğeyi kırmızı
kenarlıklı yapıyor HEM diğer 2 bölümdeki KARŞILIK GELEN sütunu senkronize
ediyor, + sayfa kaydırılıp kartlar ekrandan çıkınca sticky bir
"Mikro/KOBİ/Pro" başlık şeridi beliriyor. (5) Masaüstü/mobil TAMAMEN AYRI
HTML (`.desktop-only`/`.mobile-only`, mobilde ~28KB'lık ayrı akordeon
markup).

**Kullanıcı kararları:** sticky başlık + senkronize vurgulama (madde 4)
EKLE (vanilla JS, `marquee-scroll.js` pattern'i, React gerekmez); mobil
akordeon (madde 5) EKLEME — mevcut responsive Tailwind yaklaşımı
BİLİNÇLİ olarak korundu (aynı veri, breakpoint'le uyarlanmış: isim
sütunu sabit/pinned kalıyor, yalnızca 3 değer sütunu yatay kaydırılıyor —
kaynağın ayrı akordeon HTML'ine göre daha basit ama erişilebilir bir
alternatif).

**Uygulama:** `PricingPage.astro` baştan yazıldı (bölüm 1-3 tamamen
uygulandı) — kartlar artık ölçülen gerçek boyut/renk/font'ları kullanıyor
(`#f8f8f8` arka plan, 1440px container, `border-[1.5px]` + `#FFCCCC`/
`#e60000` — proje genelinin `--color-brand`(#FF0000) token'ından BİLİNÇLİ
sapma, bu sayfanın kendi ölçülen paleti), Özellikler/Eklentiler `<table>`
yerine kutulu-sütun düzenine çevrildi + Eklentiler'e CTA butonları eklendi,
TÜM butonlar (kart + eklenti sütunu) `.pricing-btn` paylaşılan sınıfına
taşındı. Yeni `src/scripts/pricing-interactivity.js` (vanilla JS,
`marquee-scroll.js` pattern'i) sticky bar + `activatePlan()` senkronizasyonunu
kuruyor — SSR HTML'de `is-active` class'ı YOK (kaynakta da öyle, JS
`DOMContentLoaded`'da index 0'ı/Mikro'yu aktif yapıyor), dinamik renk
durumu Astro'nun scoped `<style>` bloğunda (bu sayfaya özel, unlayered CSS,
Tailwind utility'leriyle çakışmıyor çünkü hiç Tailwind class'ı kullanmıyor).
**BİLİNÇLİ KAPSAM DIŞI (bu turda istenmedi, ayrı kararlar gerektirir):**
çalışan-sayısına göre dinamik fiyat hesaplama (`fake-select` dropdown,
Pro/KOBİ'nin `proOptions`/`smeOptions` mantığı), satır hover vurgulaması
(`highlightRow()`), mobil akordeon (yukarıda kalıcı karar olarak
belgelendi).

**Test:** `astro check` 0 hata (282 dosya), `astro build` 870 sayfa
hatasız, `test-no-external-idenfit-links.mjs` 2340/0, `dev:clean` + loglar
temiz, TR/EN/IT/NL `curl` ile yapısal doğrulama (data-plan-* attribute'ları
3'er kez, script inline bundle edilmiş — `marquee-scroll.js` ile aynı Vite
davranışı, `src=` ile değil doğrudan minified inline `<script type="module">`
olarak). **Build sırasında bir kez `EPERM` hatası alındı** (dev server
açıkken `.astro/content-assets.mjs` dosya kilidi, Windows'a özgü) — dev
server durdurulup `dist`/`.astro` elle temizlenerek çözüldü, kalıcı bir kod
sorunu değil. **Sıradaki adım (ADIM 3, onay bekliyor):** kalan detaylar
(parantez içi metinlerin soluk rengi `.parenthetical{opacity:0.7}`,
`employee-range` kutu stili) + ekran görüntüsüyle son kontrol.

**2026-08-04 günlüğü (2) — Fiyatlar sayfası 6 farklı düzeltme.** Kullanıcı
canlı siteyle karşılaştırıp 6 fark bildirdi, hepsi `pricing.css`/ham HTML
element-ID doğrulamalı (canlı sayfa aslında `template-pricing.php`'nin
KENDİ ayrı `<body>`'si + `pricing-tr.js`, standart Elementor widget'ı
DEĞİL) doğrulanıp düzeltildi: (1) Suprema donanım rozeti (logo+"DONANIMLAR
İLE TAM ENTEGRASYON" — TR/EN/IT/NL 4 dilde de GERÇEK, birbirinin çevirisi
DEĞİL, EN "Fully Integrated" gibi çok daha kısa — `pricingContent.ts`'e
`SUPREMA_BADGE_TEXT` map'i eklendi) Pro kartının üstüne eklendi. (2) Kart
içi sıra düzeltildi: gerçek sıra başlık→çalışan-aralığı→ÖZELLİK LİSTESİ→
fiyat→buton — bizim eski sıramız (fiyat→buton→liste) yanlıştı. (3)
"Paketler" etiketi (`content.packagesTitle`, veri zaten vardı ama hiç
render edilmiyordu) kartların soluna eklendi. (4) **Gerçek bug:** öne
çıkan/kırmızı kenarlıklı kart KOBİ (sme) olarak işaretlenmişti — kaynağın
kendi JS'i (`pricing-tr.js`, `activateColumn(0)`, sayfa yüklenince İLK
kartı `.active` yapıyor) + DOM sırası (Mikro→KOBİ→Pro) doğru varsayılanın
Mikro olduğunu kanıtladı, düzeltildi. (5) Pro kartının altındaki fazladan
"Sorunuz" metni kaldırıldı — `pro.getQuoteText` alanı `pricing.json`
çıkarımında yanlışlıkla dolmuş, canlı sayfada bu metin HİÇ yok (aranıp
doğrulandı), muhtemelen bir extraction artığı. (6) Liste işaretleri
checkmark SVG'den kaynağın gerçek düz nokta işaretine (`content:"•"`)
çevrildi. Test: `astro check` 0 hata, `astro build` 870 sayfa hatasız,
`test-no-external-idenfit-links.mjs` 2340/0, `dev:clean` + loglar temiz,
TR/EN/IT/NL `curl` ile tek tek doğrulandı.

**Genel durum:** Ana sayfa, mega-menü (ÜRÜNLER/SEKTÖRLER/KURUMSAL/KEŞFET),
tüm ürün/modül sayfaları (18 modül + Puantaj + 2 hub), 12 sektör sayfası,
622 blog yazısı, Müşteriler, Destek Talebi, Hesaplama Araçları, Dijital İK
Olgunluk Testi, Fiyatlar, Hakkımızda, İletişim, SSS, KVKK/hukuki sayfa
ailesi, Footer ve Header tamamlandı. Site denetim raporu (14 madde)
kapandı. Şu anki odak: küçük görsel/UX ince işçilik turları (bkz. altta
en son maddeler) — her tur canlı idenfit.com ile Playwright üzerinden
birebir karşılaştırılarak yapılıyor.

**2026-08-04 günlüğü — Online Sunum Talebi, 5 turluk düzeltme dizisi.**
**5. tur (kısa):** kullanıcı IT'de de telefon araması eksik dedi —
`PRESENTATION_IT_OVERRIDE`'ın callText/phoneNumber/phoneNumberLink'i
AYNI gerekçeyle (idenfit'in ayrı bir İtalyanca destek hattı yok, site
geneli tek numara) dolduruldu ("Chiama Ora" + `+90 216 295 09 27`).
Sayfanın render mantığı zaten generic olduğu için (`content.phoneNumber
&& (...)`) ve önceki turda margin artık dile göre değil sabit `min-height`
ile kontrol edildiği için (bkz. 3. tur) EK bir layout değişikliği
GEREKMEDİ — 3. turun kalıcı çözümünün gerçekten dilden bağımsız
çalıştığının doğrulaması oldu. Test: `astro check` 0 hata, `astro build`
870 sayfa hatasız, `dev:clean` + loglar temiz, IT sayfası `curl` ile
doğrulandı.
1. tur: kullanıcı EN sayfasında (`/en/online-sunum-talebi/`) çeviri
sorunları + eksik telefon araması bildirdi. Element-ID doğrulamalı
inceleme sayfanın görünür metninin canlı kaynakla birebir eşleştiğini
gösterdi — "çeviri yanlış" değil, kaynağın KENDİ İngilizcesi 3 yerde
gramer hatası taşıyordu (kullanıcıya `AskUserQuestion` ile soruldu,
düzeltme onaylandı): "Pay per as many employees as you want"→"Pay only
for the employees you need", "Free update"→"Free updates", "taking THE
advantage of"→"taking advantage of", "Work integrated"→"Integrate
With". Telefon araması gerçekten kaynakta yoktu (canlı sayfada `tel:`
linki hiç bulunamadı) — site genelinde zaten kullanılan TEK numara
(`+90 216 295 09 27`) eklendi (`PRESENTATION_EN_OVERRIDE`,
`miscPagesTranslationOverrides.ts`). **2. tur (aynı gün, kullanıcı
"hâlâ yanlış + NL çevrilmemiş + EN'de logolar yine üste kaymış" dedi):**
NL için KARAR 2'nin ("kaynakta olmayan çeviriler için sayfa üretimi
ertelendi") istisnası — kullanıcının bu SAYFA için açık talimatıyla
gerçek bir NL sayfası kuruldu (`PRESENTATION_NL_OVERRIDE`, TR kaynaktan
profesyonel çeviri, IT_OVERRIDE'ın izlediği AYNI yöntem — canlı
`idenfit.com/nl/`'in KENDİ "Demo Aanvragen" CTA'sının bile EN'e gittiği
doğrulanıp KARAR 2'nin hâlâ geçerli olduğu, ama bu sayfa için kullanıcı
istisnası tanındığı not düşüldü). "Logolar üste kaymış" bulgusu KALICI
bir kök neden ortaya çıkardı: `content.phoneNumber` doluluğuna göre
seçilen sabit margin-top (`mt-16` vs `mt-[200px]`, 2026-07-31'den kalma,
7 tur boyunca "biraz daha aşağı" eyeball düzeltmeleriyle sürdürülmüştü)
YANLIŞ proxy kullanıyordu — asıl değişken dile göre FARKLI H1 uzunluğuydu
(TR'nin uzun tek cümlesi 3 satıra sarıyor, EN'in kısa `<br>`'lı başlığı
2 satırda kalıyor), telefon bloğu eklenince bile EN hâlâ "yüksek" kaldı
çünkü kök neden hiç telefon bloğu değildi. **Kalıcı çözüm:** sabit
margin-top tahmini TAMAMEN kaldırıldı, yerine `items-stretch` (grid) +
`flex h-full flex-col` (sol kolon) + `mt-auto` (entegrasyon bloğu) —
artık blok dilden BAĞIMSIZ olarak sol kolonun (sağ kolonla eşit
yüksekliğe getirilmiş) alt kenarına yaslanıyor, gelecekte yeni bir dil
eklenince tekrar magic-number ayarlamaya gerek kalmayacak. **Test:**
`astro check` 0 hata, `astro build` 870 sayfa hatasız (869→870, yeni NL
sayfası), `test-no-external-idenfit-links.mjs` 2340/0,
`test-legal-nl-consistency.mjs` 18/18, `test-urunler-menu-links.mjs`
108/108, `dev:clean` + loglar temiz, TR/EN/IT/NL'nin hepsi `curl` ile
tek tek doğrulandı (NL'nin gerçek sayfa olduğu, meta-refresh fallback
OLMADIĞI dosya boyutuyla da teyit edildi). **Dürüst sınır:** Chrome
uzantısı bu oturumda da bağlı değildi, Playwright bu sandbox'ta tarayıcı
process'i spawn edemedi (`spawn UNKNOWN`, hem Bash hem PowerShell'de
denendi, kurulum geri alındı) — `mt-auto` çözümünün gerçek piksel sonucu
kullanıcı tarafından görsel olarak doğrulanmalı. **⚠️ 3. tur (aynı gün,
kullanıcı "bu sefer çok aşağı inmiş, kırmızı şeridin hemen altında olsun"
dedi) — `mt-auto` YANLIŞ referans noktası seçmişti.** `items-stretch` +
`mt-auto`, entegrasyon bloğunu sol kolonu SAĞ KOLONUN (form kartı, kırmızı
şeritten çok daha uzun) alt kenarına yaslıyordu — kullanıcının asıl
istediği nokta (kırmızı şeridin, yani `min-h-[600px]`'lik dekoratif
bloğun, bittiği yer) değildi. Kök neden analizi YARIM doğruydu (dile göre
değişen üst içerik yüksekliği gerçekten sorunun kaynağıydı) ama çözüm
YANLIŞ referansa (sağ kolonun altı) bağlanmıştı. **Düzeltme:**
`items-stretch`/`flex h-full flex-col`/`mt-auto` tamamen geri alındı,
yerine üst gruba (başlık+liste+telefon) bir `min-height` verildi
(`min-h-[528px] lg:min-h-[472px]`, masaüstü padding-top 120px + bu değer
+ altındaki `mt-6`≈616px ≈ kırmızı şeridin bitişi 600px + 16px nefes
payı — mobilde padding-top 64px olduğu için min-height daha büyük).
İçerik bu tabanı AŞARSA (TR'de muhtemel) min-height devre dışı kalıp
doğal akış korunuyor — yalnızca KISA içerik için bir taban. **Test:**
`astro check` 0 hata, `astro build` 870 sayfa hatasız, `dev:clean` +
loglar temiz, TR/EN/IT/NL `curl` ile yeni class'ın render edildiği
doğrulandı. **Dürüst sınır (değişmedi):** Chrome/Playwright bu oturumda
kullanılamadı, `min-height` değerleri element-ID ölçümü değil hesaplanmış
tahmin — kullanıcı görsel olarak doğrulamalı, gerekirse bir tur daha ince
ayar beklenebilir.

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

**2026-07-31 günlüğü:** Online Sunum Talebi (`/online-sunum-talebi/`)
baştan kuruldu — kullanıcının canlı siteyle piksel karşılaştırması, önceki
turun DOM yapısı varsayımının (kırmızı arkaplan + "Siz de bize güvenen"
bölümünün konumu) YANLIŞ olduğunu ortaya çıkardı; element-ID çapraz
doğrulamasıyla gerçek yapı bulunup tamamen yeniden yazıldı (kırmızı artık
TÜM hero'nun arkasında, logo görseli formla AYNI beyaz kartın içinde,
buton yeşil `#289C0F`, placeholder'lar büyük harf, form alan sırası
düzeltildi). 3 küçük düzeltme turu daha (dev server'ın tekrarlayan Vite
bozulması + "Entegre Çalışabileceğimiz Sistemler" bloğunun boşluğu) sonrası
**kullanıcı GÖRSEL OLARAK onayladı** — bkz. Açık noktalar #17 (kapandı).
Marquee bar'ın scroll-hide titremesi (2026-07-30'da İKİ tur "düzeltilmiş"
ama kullanıcı 3. kez "hâlâ titriyor" dedi) Playwright ile ÖLÇÜLEREK
(deterministik jitter simülasyonu + CLS/Web-Vitals) araştırıldı — gizle/
göster mekanizmasının KENDİSİ ölçülebilir titremenin kaynağı gibi
görünüyordu, geçici olarak TAMAMEN kaldırılıp marquee sabit yapıldı.
Ayrıca, marquee sabitken bile navbar'ın kendisi scroll'da titriyordu —
Playwright Chrome trace + frame-timing ölçümüyle kök neden `backdrop-blur`
olarak KESİN teşhis edildi (jank frame oranı %17.4→%0.3, `will-change`
kaldırmanın etkisi YOKTU) — `<header>`'dan KALICI olarak kaldırıldı
(kaynakta da hiç kullanılmıyor, sadece performans değil kaynak-sadakati
kazancı da). **Sonra kullanıcı marquee'nin gizlenmesini GERÇEKTEN
istediğini netleştirdi** (bir önceki "hiç istemedim" açıklaması yanlış
bir netleştirmeymiş, `AskUserQuestion` ile teyit edildi) — gizle/göster
mekanizması GERİ GETİRİLDİ. Bu kez `backdrop-blur` artık kaldırılmış
olduğundan aynı teknik Playwright'ta ölçülüp gerçekten çalıştığı
kanıtlandı: blur VARKEN %58.8 frame jank, blur YOKKEN %6-9'a düşüyor
(~%85-90 azalma) — bkz. Tamamlanan işler.

**2026-08-03 günlüğü:** Paket güvenlik taraması yapıldı — `npm audit`
**0 açık** (kritik/yüksek/orta/düşük hiçbiri yok, 14 üst-seviye paket
temiz). Bu alışkanlığı kalıcı hale getirmek için `package.json`'a `npm run
audit` script'i eklendi (bkz. §Proje kuralları — "Güvenlik taraması
alışkanlığı"). **Kurulum sırasında gerçek bir bug bulundu:** script ilk
halinde (`"audit": "npm audit"`) `npm run audit` olarak çağrılınca
`EALLOWSCRIPTS` hatasıyla çöküyordu — güvenlik açığı DEĞİL, bu sandbox
ortamının kendine özgü bir npm config kalıtım sorunu: `npm run`, ana
npm process'inin çözümlediği `allow-scripts` config'ini (kullanıcının
global `.npmrc`'sinden, `@anthropic-ai/claude-code`) `npm_config_allow_scripts`
env değişkeni olarak alt process'e sızdırıyor, bu da projenin kendi
`allowScripts` alanıyla (package.json) çakışıp hataya yol açıyor. Çözüm:
`scripts/run-audit.mjs` (cross-platform, bu env değişkenini silip gerçek
`npm audit`'i spawn ediyor). CMS güvenlik hazırlığı (Faz 2 için) — bkz.
Açık nokta #19.

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
   üretilmiyor, mevcut diller normal üretiliyor. **İstisna (2026-08-04):**
   Online Sunum Talebi'nin NL versiyonu kullanıcının bu SAYFA için açık
   talimatıyla eklendi (kaynakta hâlâ yok, `PRESENTATION_NL_OVERRIDE`)
   — genel karar hâlâ geçerli, bu yalnızca tek bir sayfaya özel, ayrıca
   istenmiş bir istisna.
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
17. ~~Online Sunum Talebi zenginleştirmesi~~ — **2026-07-31'de BAŞTAN
    kuruldu, kullanıcı GÖRSEL OLARAK onayladı ("Şimdi iyi").** 2026-07-30'daki
    "madde 1" pilotu (kırmızı arkaplanı "Siz de bize güvenen" bölümünün
    ALTINA koymak) kaynağın element-ID'leriyle çapraz doğrulanınca yanlış
    çıktı — gerçek yapı: kırmızı (`f04cc27`) TÜM hero satırının (başlık+
    form) arkasında, "Siz de bize güvenen"+logo görseli ise ayrı bir bölüm
    DEĞİL, formun kendisiyle AYNI beyaz kartın içinde. Bkz. Tamamlanan
    işler — "Online Sunum Talebi baştan kuruldu" günlüğü. Sonraki 3 tur
    (aynı gün) "Entegre Çalışabileceğimiz Sistemler" bloğunun kaymış
    görünmesini düzeltti — kök neden çoğunlukla dev server'ın tekrarlayan
    Vite "program reload" bozulmasıydı (bkz. o günlüğün 3-4. maddeleri),
    son adımda kullanıcının "birazcık aşağı kaydır" isteğiyle üstteki
    telefon bloğuyla arasındaki boşluk artırıldı (`mt-16 lg:mt-[140px]`,
    kaynağın ölçülen 100px'inden BİLİNÇLİ bir sapma, kullanıcı tercihiyle).
    **2026-07-31 (6. tur) — bu boşluk yalnızca TR'de yeterliymiş, EN/IT'de
    "Entegre Çalışabileceğimiz Sistemler" hâlâ üstte/sıkışık duruyordu.**
    Kök neden: bu margin-top üstündeki telefon bloğuna GÖRELİ, ama
    `content.phoneNumber` yalnızca TR'de dolu (EN/IT'nin kaynak verisinde
    boş — bkz. dosya başı yorumu) — yani EN/IT'de telefon bloğu (başlık+
    link, ~95-115px) HİÇ render edilmiyor, aynı sabit margin bu durumda
    daha az mutlak boşluk bırakıyordu. Düzeltme: margin artık koşullu —
    `content.phoneNumber` varsa `mt-16 lg:mt-[140px]` (TR), yoksa `mt-40
    lg:mt-[250px]` (EN/IT, eksik telefon bloğu kadar ekstra boşlukla).
    **2026-07-31 (7. tur) — kullanıcı EN/IT/NL'de (NL zaten EN'e redirect)
    bloğun HÂLÂ yeterince aşağı olmadığını bildirdi, kullanıcı GÖRSEL OLARAK
    onaylayıp KAPATTI ("yeterli teşekkürler").** Chrome uzantısı bağlı
    değildi, piksel ölçümü yapılamadı — kullanıcının "biraz daha aşağı"
    yönlendirmesiyle bilinçli bir ek bump uygulandı: EN/IT'nin margin'i
    `mt-40 lg:mt-[250px]` → `mt-[200px] lg:mt-[290px]` (mobil +40px,
    masaüstü +40px). TR'nin `mt-16 lg:mt-[140px]`'i değişmedi. **Madde
    tamamen kapandı, ek bir tur beklenmiyor.**
    **Sıradaki adım (henüz istenmedi, kullanıcı gündeme getirirse):
    scroll-reveal + kart hover efektleri** (sitenin genelinde kullanılan
    `.reveal`/`scroll-reveal.js` pattern'i, bu sayfada hâlâ yok). Kırmızı
    gradyan panel/Entegrasyonlar kartı ve CustomerLogoMarquee/Lottie arc
    kullanıcı isteğiyle kapsam dışı kalmaya devam ediyor.
18. **YENİ — navbar'daki ayrı üst-seviye "BLOG" linki kaldırıldı, kalan 7
    öğenin arası kaynağa göre düzeltildi (2026-07-31).** Bkz. Tamamlanan
    işler — "Navbar 'BLOG' linki kaldırıldı" günlüğü. Kapandı.
19. **KARAR — Faz 2 CMS seçimi: Decap CMS.** İçerik yönetim paneli için
    Decap CMS (eski adıyla Netlify CMS) seçildi — en düşük saldırı
    yüzeyine sahip seçenek çünkü kendi sunucu/API/veritabanı gerektirmiyor,
    kimlik doğrulama için GitHub OAuth (endüstri standardı) kullanıyor,
    içerik git deposunda Markdown olarak tutuluyor (bu projenin statik
    `output:'static'` mimarisiyle doğal uyum — bkz. §Deployment). Kurulum
    henüz yapılmadı, **Faz 2'de** (Cloudflare Pages Functions ile birlikte,
    madde 2/12'deki backend TODO'larıyla aynı fazda) ele alınacak.
20. **SÜREÇ — paket güvenlik taraması periyodik hale getirildi (2026-08-03).**
    `npm audit` **0 açık** ile temiz (14 üst-seviye paket) — şu an
    raporlanacak/CLAUDE.md'ye not düşülecek düşük/orta seviye bir açık
    YOK. `npm run audit` script'i eklendi, kural §Proje kuralları'na
    kodifiye edildi (her önemli değişiklik/deploy öncesi çalıştırılmalı).
    İleride bir tarama düşük/orta seviye açık bulursa, hemen müdahale
    gerekmiyorsa buraya (yeni bir madde olarak) not düşülüp iş listesine
    eklenmeli — kritik/yüksek seviye açıklar ise bulunduğu anda (bu
    maddeyi beklemeden) düzeltilip regresyon testleriyle doğrulanmalı.

---

## Tamamlanan işler — özet günlüğü

Bu bölüm geçmiş oturumlarda tamamlanan işlerin **sonucunu ve kalıcı
kararlarını** özetler — adım adım süreç/komut/kök-neden anlatısı
2026-07-31'de sıkıştırıldı (tam süreç detayları için
`docs/claude-md-archive-2026-07-31.md`, `docs/claude-md-archive-2026-07-28.md`
ve `docs/claude-md-archive-2026-07-23.md` arşivlerine bakılabilir — nadiren
gerekir). Verifikasyon konvansiyonu (Playwright/`astro check`/`astro build`/
`dev:clean`, madde başına tekrar edilmiyor) yukarıdaki §Proje Durumu'nda
zaten not düşülü. En yeni en üstte.

**[2026-07-31] Navbar'daki ayrı üst-seviye "BLOG" linki kaldırıldı + kalan
7 öğenin arası kaynağa göre düzeltildi.** Kullanıcı bulgusu: KEŞFET'in
hemen yanında ayrı bir "BLOG" linki duruyordu — blog zaten KEŞFET
mega-menüsünün "İçerikler" kolonunda "Bloglar" olarak linkliydi, ayrı bir
üst-seviye giriş noktası fazlalıktı.

- **Kod:** `src/data/nav.ts`'teki `NAV_ITEMS`'tan `{slug:'blog',key:'blog'}`
  girdisi silindi (mega-menü/footer'daki "Bloglar"/"Blog" linkleri AYRI
  alanlar — `MegaKesfetLabels.blog`/`FooterAboutLinks.blog` — dokunulmadı).
  `NavLabels.blog` (`i18n/types.ts`) + 4 dil dosyasındaki (`tr/en/nl/it.ts`)
  artık kullanılmayan `nav.blog` anahtarı da kaldırıldı (ölü kod
  bırakılmadı).
- **Aralık düzeltmesi — TAHMİN değil, ölçüldü:** canlı
  `https://idenfit.com/wp-content/uploads/elementor/css/post-9695.css`
  (gerçek header nav widget'ı, `data-elementor-id="9695"`) çekilip
  okundu — `.elementor-nav-menu--main .elementor-item{padding-left:16px;
  padding-right:16px}` bulundu (`gap` DEĞİL, her linkin kendi padding'i),
  yani komşu iki link arası GERÇEK mesafe 16+16=**32px**. `Header.astro`'daki
  `<ul>`'un `gap-4`(16px)'i `gap-8`(32px)'e düzeltildi. Dikey
  `padding-top/bottom:26px` BİLİNÇLİ olarak uygulanmadı (bizim `h-16`
  header'ımızla çakışır — önceki turlardan miras kalan bir karar, bkz.
  logo yorumu).
- **Test:** `astro check` 0 hata, `astro build` 869 sayfa hatasız,
  regresyon (`test-urunler-menu-links.mjs` 108/108,
  `test-no-external-idenfit-links.mjs` 2340/0) temiz, `dev:clean` ile
  `curl` doğrulaması (standalone "BLOG" `<li>` artık yok, `gap-8` TR/EN'de
  render ediliyor).

**[2026-07-31] Marquee bar scroll-hide titremesi — KALICI ÇÖZÜM: gizle/göster
mekanizması tamamen kaldırıldı, ölçümle kanıtlandı.** 2026-07-30'da İKİ ayrı
tur (`contain-layout`/`contain-paint`, `backdrop-filter` geçici kapatma)
"düzeltildi" denmişti ama kullanıcı 3. kez "hâlâ titriyor" bildirdi. Bu turda:

- **Önce hedefli JS düzeltmesi denendi:** `marquee-scroll.js`'te 2 gerçek
  bug bulundu — (1) `setHidden()` state gerçekten değişmese bile (özellikle
  sayfa en üstündeyken) her scroll frame'inde çağrılıp aynı değeri yeniden
  yazıyordu (`isHidden` bayrağıyla no-op'a çevrildi), (2) hızlı/jitterli
  scroll'da devam eden 250ms'lik geçiş yarıda kesilip tersine dönebiliyordu
  (`MIN_TOGGLE_INTERVAL_MS` cooldown'u eklendi). `#marquee-wrap`'e ayrıca
  `will-change-transform` eklendi (kullanıcı isteğiyle — dürüst not: asıl
  animasyon `grid-template-rows`, layout-tetikleyen bir property, bu hint
  animasyonun kendisini compositor-only yapamaz).
- **Chrome uzantısı bu oturumda da bağlı değildi — Playwright geçici olarak
  kurulup (`npm install -D playwright`, iş bitince kaldırıldı, proje
  konvansiyonu) GERÇEK ölçüm yapıldı** (`scripts/verify-marquee-scroll.mjs`):
  deterministik (sabit seed) jitterli scroll simülasyonu + `PerformanceObserver
  ('layout-shift')` ile CLS (Cumulative Layout Shift, Web Vitals metriği)
  ölçüldü — tahmin değil. **Bulgu:** hedefli JS düzeltmesi (yukarıdaki 2
  bug fix'i) AYNI deterministik testte "öncesi" ile İSTATİSTİKSEL OLARAK
  AYNI CLS'i (~0.034, 49 layout-shift event'i) verdi — yani state/hysteresis
  düzeltmeleri gerçek bug'lardı ama CLS'i ölçülebilir şekilde azaltmadı,
  çünkü kök sorun YAPISALDI: `grid-template-rows` scroll SIRASINDA hiçbir
  şekilde tamamen compositor-only hâle getirilemez (layout-tetikleyen bir
  property, "flicker'sız" garantisi teknik olarak imkansız).
- **Kullanıcının önceden onayladığı fallback'e geçildi ve ÖLÇÜLEREK
  doğrulandı: marquee artık scroll'da HİÇ gizlenmiyor, her zaman sabit.**
  Aynı deterministik testte: CLS 0.034→0.019, layout-shift event sayısı
  49→1 (kalan tek event marquee'yle ilgisiz — büyük ihtimalle font/görsel
  yükleme kaynaklı, sayfa geneli bir artifact). Header yüksekliği (97px)
  scroll boyunca (aşağı/yukarı/5× hızlı yön değişimi) TEK bir değerde sabit
  kaldığı ayrıca doğrulandı.
- **Kod tarafı:** `src/scripts/marquee-scroll.js` tamamen silindi,
  `Header.astro`'daki `<script src="../scripts/marquee-scroll.js">` referansı
  ve `#marquee-wrap`'in tüm animasyon/containment class'ları (`grid`,
  `contain-layout`, `contain-paint`, `transition-[grid-template-rows]`,
  inline `style`) kaldırıldı — artık `<MarqueeBar />` doğrudan render
  ediliyor. `global.css`'teki `.is-transitioning-marquee` kuralı (ölü kod)
  silindi. `<header>`'ın kendi `will-change-transform`'u (sticky+backdrop-blur
  için genel bir perf hint'i, marquee'den bağımsız) KORUNDU. `MarqueeBar.tsx`'in
  kendi iç metin animasyonu (`animate-marquee`, saf `transform`, GPU-composite)
  DOKUNULMADI — yalnızca dış gizle/göster katmanı kaldırıldı.
- **Video kanıtı:** `docs/verification/marquee-scroll-final-static-2026-07-31.webm`
  (Playwright kaydı, jitterli scroll simülasyonu boyunca marquee'nin hiç
  hareket etmediğini gösteriyor).
- **Test:** `astro check` 0 hata, `astro build` 869 sayfa hatasız (sayı
  değişmedi), regresyon (`test-no-external-idenfit-links.mjs` 2340 dosyada
  0 sorun, `test-urunler-menu-links.mjs` 108/108, `test-legal-nl-consistency.mjs`
  18/18) temiz. Playwright kaldırıldı (`npm uninstall playwright`),
  `dev:clean` ile temiz restart yapıldı, `curl` ile ne `marquee-wrap` id'sinin
  ne `<script src=".../marquee-scroll.js">` referansının kaldığı doğrulandı.
  **Kalıcı ders:** iki ayrı "düzeltilmiş" tur bir titreme raporunu
  gerçekten gidermeyi başaramadıysa, üçüncü ince ayar denemek yerine ÖLÇMEK
  (Playwright/CLS gibi objektif bir metrikle) ve kullanıcının önceden
  verdiği "basitleştir" iznini kullanmak daha güvenilir — bu vaka, hedefli
  bir kod düzeltmesinin GERÇEK bug'ları giderdiği ama YAPISAL kök sorunu
  (layout-tetikleyen bir property'yi flicker-sız animasyonlu yapma imkansızlığı)
  çözemediği somut bir örnek. **Düzeltme (aynı gün, hemen sonraki tur):**
  kullanıcı, marquee'nin scroll'da gizlenmesi özelliğinin BAŞTAN kendi
  isteği olmadığını, önceki bir oturumda YANLIŞLIKLA önerilmiş bir özellik
  olduğunu belirtti — yukarıdaki "kalıcı karar" (marquee'nin sabit kalması)
  zaten bu isteğe birebir uyuyordu, ek bir değişiklik gerekmedi.

**[2026-07-31] Navbar (header) scroll titremesi — AYRI bir kök neden
bulunup ölçülerek düzeltildi: `backdrop-blur`.** Marquee sabitlendikten
sonra bile navbar'ın kendisinin scroll sırasında titrediği bildirildi.
Chrome uzantısı bağlı değildi — Playwright ile (`scripts/verify-navbar-jank.mjs`)
gerçek bir Chrome trace (`context.tracing`, DevTools Performance paneliyle
aynı format) + `requestAnimationFrame` frame-timing ölçümü yapıldı:

- **Baseline** (mevcut kod, `backdrop-blur` + `will-change-transform`):
  ortalama frame süresi 19.68ms (60fps bütçesi: 16.67ms), p95 33.4ms,
  **%17.4 frame "jank"** (>32ms).
- **`will-change` KALDIRILINCA** (test varyantı): fark YOK (%19.6 jank,
  hatta biraz daha kötü) — bu değişken suçlu değilmiş.
- **`backdrop-blur` KALDIRILINCA** (test varyantı): ortalama 16.71ms
  (neredeyse tam 60fps), p95 16.8ms, **%0.2 jank** — kesin kanıt: asıl
  suçlu `backdrop-blur`. Sticky bir elemanın arkasını her scroll frame'inde
  yeniden örneklemesi (Chromium'da bilinen bir maliyet) titremenin gerçek
  kaynağıydı.
- **Yan bulgu:** canlı idenfit.com'da `backdrop-filter` hiç kullanılmıyor
  (HTML/CSS'te aranıp bulunamadı) — bu kaldırma yalnızca performans değil,
  kaynak-sadakati açısından da doğru yönde bir düzeltme.
- **Uygulama:** `Header.astro`'nun `<header>`'ından `backdrop-blur` class'ı
  kaldırıldı, `bg-surface/95` (%95 opak) korundu. `will-change-transform`
  zararsız olduğu için (genel sticky+scroll perf hint'i) bırakıldı.
  Gerçek dosyaya uygulanan düzeltme AYNI script'le yeniden ölçüldü:
  ortalama 16.80ms, p95 16.7ms, %0.3 jank — test varyantıyla birebir
  tutarlı sonuç.
- **Video kanıtı:** `docs/verification/navbar-scroll-fixed-2026-07-31.webm`.
- **Test:** `astro check` 0 hata, `astro build` 869 sayfa hatasız, regresyon
  temiz (`test-no-external-idenfit-links.mjs` 2340/0, `test-urunler-menu-links.mjs`
  108/108, `test-legal-nl-consistency.mjs` 18/18). Playwright kaldırıldı,
  `dev:clean` ile temiz restart yapıldı. **Kalıcı ders:** `backdrop-filter`
  + `position:sticky` kombinasyonu bu projede artık İKİNCİ kez (marquee
  turunda da bir kez) scroll-performans sorununa yol açtığı doğrulandı —
  ileride benzer bir "sticky element" eklenirse `backdrop-filter`
  kullanmadan önce bu maliyet göz önünde bulundurulmalı.

**[2026-07-31] ⚠️ Düzeltme — marquee bar'ın scroll'da gizlenmesi GERİ
GETİRİLDİ, kullanıcı bu özelliği hiç istemediğini söylemişti ama bu YANLIŞ
bir netleştirmeymiş.** Yukarıdaki "kalıcı karar" (marquee'nin tamamen
sabit kalması) kullanıcının "bu özelliği hiç istemedim" açıklamasına
dayanıyordu — kullanıcı hemen sonraki mesajında tam tersini söyleyince
(marquee'nin GERÇEKTEN gizlenmesi gerektiği) net bir çelişki oluştu.
`AskUserQuestion` ile doğrudan soruldu ("sabit mi kalsın, yoksa gizlensin
mi?") — kullanıcı GİZLENSİN dedi, netleşti. **Bu, önceki "kalıcı karar"ı
GERİ ALIYOR** — marquee-scroll.js + `#marquee-wrap` + `grid-template-rows`
mekanizması AYNEN geri getirildi (state/hysteresis düzeltmeleri — `isHidden`
no-op guard'ı + `MIN_TOGGLE_INTERVAL_MS` cooldown — korunarak).

- **Kritik fark — bu kez backdrop-blur YOK.** Önceki 3 başarısız düzeltme
  denemesinin (2026-07-30) HEPSİ `<header>`'ın `backdrop-blur`'ü HÂLÂ
  VARKEN yapılmıştı. Bu turda `backdrop-blur` zaten (yukarıdaki navbar
  jank turunda) kalıcı olarak kaldırılmış durumda. Playwright ile
  (frame-timing, yalnızca CLS değil) AYNI `grid-template-rows` tekniği
  A/B test edildi (`scripts/verify-marquee-scroll.mjs --with-blur` ile
  sayfa-içi CSS enjeksiyonuyla blur geçici geri eklenip karşılaştırıldı):
  - **`backdrop-blur` VARKEN** (önceki 3 denemenin koşulu): ortalama frame
    süresi 26.90ms, **%58.8 frame jank** (>32ms).
  - **`backdrop-blur` YOKKEN** (şu anki gerçek durum): ortalama 17.76-18.39ms
    (60fps bütçesine çok yakın), **%6.2-9.1 jank** — **~%85-90 azalma**.
  - Her iki durumda da özellik doğru ÇALIŞIYOR (3 aşağı+3 yukarı döngüde
    tam 6 gerçek toggle, ne eksik ne fazla).
  - Kalan küçük jank (%6-9) muhtemelen `grid-template-rows`'un doğası
    gereği hâlâ layout-tetikleyen olmasından (matematiksel olarak
    tamamen sıfırlanamaz, bkz. önceki günlük) — ama artık KULLANILABİLİR
    seviyede, önceki %58.8'in çok altında.
- **Kod:** `src/scripts/marquee-scroll.js` yeniden oluşturuldu (state/
  hysteresis düzeltmeleriyle), `Header.astro`'da `#marquee-wrap` +
  `<script src="../scripts/marquee-scroll.js">` geri geldi, `MarqueeBar.tsx`'in
  yorum notu eski hâline döndürüldü. `backdrop-blur` GERİ EKLENMEDİ (ayrı,
  kalıcı bir düzeltmeydi, bu geri alma ile ilgisi yok).
- **Video kanıtı:** `docs/verification/marquee-hide-restored-2026-07-31.webm`
  (eski `marquee-scroll-final-static-...webm` artık geçersiz olduğu için
  silindi).
- **Test:** `astro check` 0 hata, `astro build` 869 sayfa hatasız, regresyon
  temiz. Playwright kaldırıldı, `dev:clean` ile temiz restart yapıldı.
  **Kalıcı ders:** kullanıcının "bunu hiç istemedim" gibi geçmişe dönük
  netleştirmeleri bile, hemen ardından çelişkili bir talimat gelirse
  ("gizlenmesi lazım") körü körüne uygulanmamalı — büyük bir mimari
  kararı (bir özelliği TAMAMEN kaldırmak) tersine çevirebilecek bir
  çelişki fark edilince `AskUserQuestion` ile doğrudan sorulmalı, tahmin
  edilmemeli. Bu vaka ayrıca gösterdi ki önceki 3 başarısız denemenin
  "yapısal olarak çözülemez" sonucu YARIM DOĞRUYMUŞ — asıl karışan
  faktör (backdrop-blur) kaldırılınca aynı teknik kabul edilebilir
  performansla çalışabiliyor; "imkansız" sonucuna varmadan önce TÜM
  değişkenleri (yalnızca marquee'nin kendi kodu değil, sarıldığı
  `<header>`'ın diğer stilleri) izole etmek gerekiyormuş.

**[2026-07-31] Online Sunum Talebi (`/online-sunum-talebi/`) BAŞTAN
kuruldu — kullanıcının canlı siteyle piksel karşılaştırması sonucu 4
somut fark bildirdi, araştırma önceki turun DOM yapısı varsayımının
YANLIŞ olduğunu ortaya çıkardı, gerçek yapıyla tamamen yeniden yazıldı.**

- **Kök bulgu — element-ID çapraz doğrulaması önceki turun yapısını
  çürüttü.** Kaynağın (`idenfit.com/online-sunum-talep-et/`, template
  15441) `post-15441.css`'i + ham HTML'i satır satır okunup gerçek DOM
  ağacı çıkarıldı: **sol kolon (`a338640`) HİÇBİR arka plan taşımıyor**
  (h1 → info bullet listesi → "Hemen Ara" başlığı → telefon numarası →
  100px boşluk → "Entegre Çalışabileceğimiz Sistemler" başlığı+görseli);
  **sağ kolon (`eabfe75`) TEK bir dolu BEYAZ kart** (form başlığı → form
  açıklaması → form → "Siz de bize güvenen..." başlığı + `customer-brands.jpeg`
  — SONUNCUSU ayrı bir bölüm DEĞİL, formla AYNI kartın içinde, hemen
  altında). Kırmızı dekoratif blok (`f04cc27`, `position:absolute;
  top:0; min-height:600px; background-color:var(--e-global-color-uicore_primary)`)
  hero satırıyla AYNI seviyede bir kardeş — en yakın `position:relative`
  atası sayesinde TÜM hero satırının arkasında duruyor. Sol kolon şeffaf
  olduğu için kırmızı ORADA görünüyor, sağ kolonun opak beyaz kartı
  kırmızıyı ÖRTÜYOR — kullanıcının "sol taraf tam kırmızı, yalnızca form
  kartı beyaz" gözleminin birebir açıklaması. **Önceki (2026-07-30) turun
  "Entegrasyonlar = ayrı pembe panel" ve "Referanslar = hero'nun ALTINDA
  ayrı kırmızı bölüm" varsayımları YANLIŞTI** — ikisi de kaynakta hiç
  yoktu, DOM'u element-ID ile doğrulamadan yapılan bir varsayımdı.
- **Kullanıcının 4 maddesi, hepsi bu kök bulguyla açıklanıp düzeltildi:**
  (1) sol taraf artık gerçekten `bg-brand` (tam kırmızı, `f04cc27`'nin
  ölçülen `min-h-[600px]` full-bleed tekniğiyle), yalnızca sağ form kartı
  beyaz. (2) Buton `#289C0F` (ölçülen GERÇEK yeşil — Destek Talebi'nin
  `#60A344`'ünden FARKLI bir ton, karıştırılmamalı) solid oldu. (3)
  Placeholder'lar `placeholder:uppercase` (CSS) ile büyük harfe çevrildi
  — kaynakta placeholder metninin kendisi literal uppercase yazılmış,
  paylaşılan i18n string'leri (ör. "İsim Soyisim") DEĞİŞTİRİLMEDİ, yalnızca
  bu sayfaya özel CSS transform uygulandı. (4) "İkinci logo şeridi" aslında
  KAYNAKTA DA gerçek bir marquee/carousel DEĞİL, tek bir statik composite
  görsel (`customer-brands.jpeg`, 12 logo — TAV Airports/Franke/Migros
  ONE/Civil/Bluemint/Altınyıldız Classics/flormar/Deichmann/Acun Medya/
  Caribou Coffee/Beyaz Fırın/Mövenpick) — bu görsel zaten
  `referencesImage` olarak KODDA MEVCUTTU ve render ediliyordu, ama YANLIŞ
  yerde (hero'nun altında ayrı kırmızı bölüm) — kullanıcı "hiç yok"
  algılamasının nedeni bu yanlış konum/stildi. Artık doğru yerde (form
  kartının içinde, formun hemen altında).
- **(5) URL — BİLİNÇLİ olarak DEĞİŞTİRİLMEDİ, kullanıcının kendi
  önerdiği düşük-riskli seçenek zaten uygulanmış durumdaydı:** canonical
  slug (`online-sunum-talebi`) proje genelinde onlarca CTA çağrı noktasına
  zaten gömülü; kaynağın gerçek slug'ından (`online-sunum-talep-et`) gelen
  trafik için `astro.config.mjs`'te zaten bir redirect var (bkz. 2026-07-30
  günlüğü). Bu turda ek bir değişiklik gerekmedi.
- **Diğer bulunan/düzeltilen küçük farklar (element-ID doğrulamalı, kullanıcı
  "diğer kısımları da karşılaştır" dediği için):** form alan SIRASI —
  kaynakta bu sayfada isim→telefon→**e-posta→firma** (Hero/PanelFeatureSection/
  İletişim'in kullandığı isim→telefon→firma→e-posta sırasından FARKLI) —
  `HeroForm.tsx`'e yeni `variant` prop'u eklenip yalnızca `'presentation'`
  varyantında bu iki alan yer değiştirdi, diğer 3 sayfa etkilenmedi. H1/H2
  font boyutları kesin ölçülen değerlere düzeltildi (H1 36px/700 masaüstü,
  24px mobil — önceki `text-5xl` tahmininden belirgin küçük). Info listesinin
  ikonu (kontrol listesi checkmark'ı) kaynakta aslında 6px'lik küçük dolu
  bir NOKTA (bullet) — checkmark'a ait değildi, düzeltildi. Telefon bloğu
  tek bir satır inline link yerine iki ayrı öğeye ayrıldı ("Hemen Ara"
  başlığı + altında kalın beyaz numara), numaranın ikonu kaynakta mor
  (`--e-global-color-uicore_secondary`, bizim `text-secondary` token'ımız)
  — kırmızı/beyaz değil, bilinçli bir kaynak detayı.
- **Mimari:** `HeroForm.tsx`'e `variant?: 'underline' | 'presentation'`
  prop'u eklendi (varsayılan `'underline'`, Hero/PanelFeatureSection/
  İletişim'in mevcut davranışını DEĞİŞTİRMEDİ) — yalnızca Online Sunum
  Talebi `'presentation'` kullanıyor (dolu beyaz pill input'lar, yeşil
  buton, büyük harf placeholder, email/firma sırası ters). Kod tekrarı
  yerine tek component'te koşullu class/sıra tercih edildi (Destek
  Talebi'nin ayrı `SupportRequestForm.tsx`'ine gerek kalmadı — form
  DAVRANIŞI/validasyonu birebir aynı, yalnızca görsel stil ve 2 alanın
  sırası farklıydı).
- **Test:** `astro check` 0 hata, `astro build` 869 sayfa hatasız (sayı
  değişmedi), `dev:clean` yapıldı. `curl` ile 3 dilde (TR/EN/IT — NL zaten
  `i18n.fallback` ile EN'e 302 yönleniyor, değişmedi) yeni class'ların
  (`bg-[#289C0F]`, `placeholder:uppercase`, `rounded-[20px]`, `min-h-[600px]`)
  render edildiği, "Siz de bize güvenen" + `customer-brands.jpeg`'in beyaz
  kartın İÇİNDE (form island'ından SONRA, aynı DOM dalında) geldiği, ve
  `presentation` varyantında email/firma sırasının (homepage'in Hero
  formu ETKİLENMEDEN) doğru yer değiştirdiği doğrulandı. Regresyon:
  `test-no-external-idenfit-links.mjs` 2340 dosyada 0 sorun,
  `test-urunler-menu-links.mjs` 108/108, `test-legal-nl-consistency.mjs`
  18/18. **Dürüst sınır:** Chrome uzantısı bu oturumda da bağlı değildi —
  tüm doğrulama element-ID çapraz referanslı CSS/HTML okuması + `curl`
  ile yapıldı (gerçek "computed style" ölçümü değil), kullanıcının kendisi
  `/online-sunum-talebi/` (TR), `/en/online-sunum-talebi/`,
  `/it/online-sunum-talebi/` adreslerini ekran görüntüsüyle ayrıca
  doğrulamalı — özellikle kırmızı/beyaz geçişinin ve yeşil butonun gerçek
  görsel sonucu.

**[2026-07-31] ⚠️ Düzeltme (aynı gün, 2. tur) — "Entegre Çalışabileceğimiz
Sistemler" bloğu (Logo/Mikro/Luca/Zirve/SAP/Link/Netsis/Nebim, sol kolon)
küçük/ortalanmamış duruyordu, yukarıdaki rebuild'de 2 gerçek hata bulundu.**

- **Görsel küçüktü:** `max-w-[240px]` keyfi bir tahmindi — kaynakta bu
  widget'a (`59c4865`) HİÇBİR genişlik kısıtı yok, doğal boyutunda
  (394×210) render ediliyor → `max-w-[394px]`'e büyütüldü.
- **Başlık font-size'ı yanlıştı:** `text-lg` (18px) yazılmıştı, `post-15441.css`'te
  ölçülen gerçek değer 22px'ti → `text-[22px]`'e düzeltildi.
- **Ortalama artık açık:** `text-center`/`mx-auto` yerine (davranışça aynı
  ama örtük) `flex flex-col items-center justify-center text-center` ile
  hem yatay hem dikey ortalama kesinleştirildi.
- **Kullanıcının "pembe/açık kutu" tarifi araştırıldı — kodda/kaynakta
  böyle bir renkli panel YOK.** Hem güncel render (`bg-brand-light`
  yalnızca Header'ın mega-menüsünde/KURUMSAL promo kartında geçiyor, bu
  sayfanın içeriğinde değil) hem `post-15441.css` (d886ed3/59c4865 için
  `background-color` kuralı yok) çift kontrol edildi — böyle bir kutu
  eklenmedi, kaynağa sadık kalındı. Görsel zaten TEK bir dosyada (8 logo
  birleşik) — ayrı bir "logo grid'i" kaynakta da yok, icat edilmedi.
- **Test:** `astro check` 0 hata, `astro build` 869 sayfa hatasız,
  `dev:clean` yapıldı, `curl` ile yeni class'lar (`max-w-[394px]`,
  `text-[22px]`, `flex flex-col items-center justify-center`) 3 dilde
  doğrulandı. Regresyon: `test-no-external-idenfit-links.mjs` 2340
  dosyada 0 sorun, `test-urunler-menu-links.mjs` 108/108. **Not:** Chrome
  uzantısı hâlâ bağlı değil — gerçek görsel sonuç kullanıcı tarafından
  doğrulanmalı.

**[2026-07-31] ⚠️ Düzeltme (aynı gün, 3. tur) — kullanıcı "ciddi layout
bozukluğu" bildirdi (kırmızı blok içeriğin üzerine binmiş, form 2 alana
inmiş) — KÖK NEDEN kod DEĞİL, dev server'ın bozulmuş Vite state'iymiş.**

- **Keşif:** `npx astro dev logs` incelenince gerçek neden bulundu: bir
  önceki turun `dev:clean`'inden SONRA, arka planda kendiliğinden bir
  `"program reload"` tetiklenmiş ve BAŞARISIZ olmuş —
  `Failed to load url astro:server-app.js ... Does the file exist?`
  hatası. Bu, `§Proje kuralları`'nda zaten belgelenmiş "Vite bağımlılık
  önbelleği bozulması" sınıfının BİREBİR aynı belirtisi (`_jsxDEV is not
  a function` ailesiyle aynı kök neden — Astro'nun otomatik soft-restart'ı
  bozuk kalabiliyor, kendi kendine düzelmiyor) — kullanıcının "bağlantı
  kopması" hipotezi YÖN olarak doğruydu, ama dosya/kod tarafında değil
  dev server'ın kendi state'indeydi.
- **Kod TARAFI baştan sona kontrol edildi, hiçbir eksik/yarım değişiklik
  bulunamadı:** `PresentationRequestPage.astro` tam ve tutarlıydı — 4
  form alanı (`presentation-fullName/-phone/-company/-email`) HTML'de
  MEVCUTTU, kırmızı blok `-z-10` ile doğru katmandaydı (negatif z-index +
  `isolate` sayesinde CSS stacking kuralları gereği İÇERİĞİN ARKASINDA
  kalması garanti — üstüne binme riski yok), yeşil buton (`#289C0F`)
  KASITLI bir önceki turun kararıydı (kullanıcının kendi isteğiyle,
  "Destek Talebi'ninkinden farklı, ölçülen gerçek yeşil"). **KEŞİF
  sorusu #1'in varsayımı ("Siz de bize güvenen'i hero altına tam
  genişliğe taşıma") zaten YANLIŞ bir öncül** — bu, 2026-07-30'un ESKİ
  (yanlış) yaklaşımıydı; 2026-07-31'in rebuild'i bunu BİLİNÇLİ olarak
  TERSİNE çevirip görseli formla AYNI beyaz kartın içine (kaynağa sadık)
  taşımıştı — "yarım kalmış taşıma" değil, tamamlanmış bir düzeltme.
- **KEŞİF #3 (başka sayfa etkilendi mi):** kod genelinde grep'lendi — bu
  büyük (`min-h-[600px]`), tüm-hero-arkası, negatif z-index'li absolute
  dekoratif blok deseni yalnızca bu sayfada var. `SupremaSection.astro`'nun
  kendi absolute dekorasyonu (5px'lik shape-divider şeridi) tamamen farklı
  ölçek/amaç — etkilenmedi.
- **Düzeltme:** yalnızca `npm run dev:clean` (tam kill+restart) —
  kod hiç değiştirilmedi. Sonrasında `astro dev logs` temiz, `curl` ile
  4 form alanının HTML'de tam sırayla geldiği, kırmızı/buton/entegrasyon/
  referans class'larının hepsinin doğru olduğu tek tek doğrulandı.
- **Test:** `astro check` 0 hata, `astro build` 869 sayfa hatasız,
  `dev:clean` sonrası loglar temiz. Regresyon: `test-no-external-idenfit-links.mjs`
  2340 dosyada 0 sorun, `test-urunler-menu-links.mjs` 108/108,
  `test-legal-nl-consistency.mjs` 18/18. **Kalıcı ders (mevcut kurala
  ek doğrulama):** bu vaka, "config değişikliğinden SONRA dev:clean
  şart" kuralının yalnızca config dosyası düzenlemeleriyle sınırlı
  olmadığını gösterdi — arka planda KENDİLİĞİNDEN tetiklenen bir soft-restart
  da aynı şekilde bozulabiliyor; "layout bozuk" gibi görsel raporlarda
  KOD incelemesinden ÖNCE `astro dev logs`'a bakmak (bir "program reload"/
  hata var mı) hızlı ve ucuz bir ilk adım.

**[2026-07-31] ⚠️ Düzeltme (aynı gün, 4. tur) — kullanıcı AYNI bloğun
(Entegre Çalışabileceğimiz Sistemler) hâlâ kaymış/hizasız göründüğünü
bildirdi, `astro dev logs`'ta AYNI "program reload" hatası ÜÇÜNCÜ kez
görüldü.** Kod tarafı yeniden kontrol edildi, yapısal olarak sağlamdı
(bkz. önceki 2 giriş) — yine de, flex-tabanlı ortalamanın herhangi bir
kırılgan bağımlılığa dayanmaması için başlık+görsele EK bir güvenlik
katmanı (`mx-auto block`, block-level kendiliğinden ortalama — hiçbir
utility derleme sırasına bağımlı değil, tarayıcı desteği evrensel)
redundant olarak eklendi; flex kaldırılmadı. `npm run dev:clean` ile
yeniden başlatıldı, bu turda `astro dev logs` art arda 5 istekte de
temiz kaldı (önceki turlarda görülen reload hatası bu seferki restart'ta
TEKRARLANMADI). `astro check` 0 hata, `astro build` 869 sayfa hatasız,
regresyon temiz. **Not:** bu bloğun 3 kez üst üste raporlanması, kod
tarafında GERÇEK bir gizli hata olma ihtimalini tamamen ekarte etmiyor
— kullanıcının hard-refresh (Ctrl+Shift+R) sonrası hâlâ sorun bildirmesi
durumunda, Chrome uzantısı bağlanabilirse gerçek computed-style ile
(curl/element-ID okuması değil) doğrudan ölçüm yapılmalı.

**[2026-07-31] ⚠️ Düzeltme (5. tur) — kullanıcının "birazcık aşağı kaydır"
isteğiyle telefon bloğu/"Entegre Çalışabileceğimiz Sistemler" arası
boşluk artırıldı (`mt-16 lg:mt-[140px]`, kaynağın ölçülen 100px'inden
BİLİNÇLİ bir sapma).**

**[2026-07-31] ⚠️ Düzeltme (6. tur) — bu boşluk yalnızca TR'de yeterliymiş,
EN/IT'de hâlâ üstte/sıkışık duruyordu.** Kök neden: margin-top üstündeki
"Hemen Ara" telefon bloğuna GÖRELİ, ama `content.phoneNumber` yalnızca
TR'de dolu (EN/IT'nin kaynak verisinde boş) — EN/IT'de telefon bloğu HİÇ
render edilmiyor, aynı sabit margin bu durumda daha az mutlak boşluk
bırakıyordu. Margin koşullu yapıldı: `content.phoneNumber` varsa
`mt-16 lg:mt-[140px]` (TR), yoksa `mt-40 lg:mt-[250px]` (EN/IT).

**[2026-07-31] ⚠️ Düzeltme (7. tur) — kullanıcı EN/IT/NL'de bloğun HÂLÂ
yeterince aşağı olmadığını bildirdi, kullanıcı GÖRSEL OLARAK onaylayıp
KAPATTI.** Chrome uzantısı bağlı değildi, piksel ölçümü yapılamadı —
kullanıcının "biraz daha aşağı" yönlendirmesiyle bilinçli bir ek bump
uygulandı: EN/IT'nin margin'i `mt-40 lg:mt-[250px]` → `mt-[200px]
lg:mt-[290px]` (mobil +40px, masaüstü +40px). TR değişmedi. `astro check`
0 hata, `dev:clean` sonrası `curl` ile EN/IT'de yeni class doğrulandı.
**Madde (Açık nokta #17) tamamen kapandı.**

---

**[2026-07-30] Online Sunum Talebi — slug sorusu + logo iddiası.** Slug
uyuşmazlığı bug değildi (canonical slug zaten proje geneli kullanılıyordu);
gerçek bug bu slug'a hiç sayfa dosyası olmamasıydı → redirect eklendi.
"Ayrı logo grid'i" iddiası da kodla örtüşmüyordu (her iki bölüm zaten tek
statik `<img>`) — ama gerçek bir bulgu çıktı: Referanslar görseli
(`onlinerequest.png`, 7 logo, 2025-08) canlıda güncellenmiş
(`customer-brands.jpeg`, 12 logo, 2026-01) → yerelleştirilip güncellendi.

**[2026-07-30] Header scroll flicker — 2. tur, gerçek kök neden.**
`contain-layout` tek başına yetersizdi; asıl suçlu `backdrop-filter`'ın
marquee gizlenme/gösterilme geçişi SÜRESİNCE her frame arkasını yeniden
örneklemesiydi. Düzeltme: `.is-transitioning-marquee` class'ı geçiş
boyunca `backdrop-filter:none` yapıyor (`transitionend` ile kaldırılıyor),
`contain-paint` eklendi, geçiş süresi 300ms→250ms. **Bilinçli karar:**
`grid-template-rows`'tan `transform`/`opacity`'ye geçilmedi — marquee
gizlenirken header'ın gerçekten küçülüp nav'ın yukarı kayması isteniyor,
bu doğası gereği layout-tetikleyen bir değişiklik.

**[2026-07-30] `/blog/sgk/` redirect eksikliği düzeltildi.** Önceki turda
"eklendi" denmişti ama `astro.config.mjs`'e hiç girmemişti — eklendi, dev/
build/preview üçünde de doğrulandı (`astro preview`'da meta-refresh
mekanizması, `curl -L` meta-refresh'i takip etmediği için "değişmedi"
görünmesi normal).

**[2026-07-30] Blog "618/618" kapanışı sonrası 5 URL farkı → 622/622.**
1 slug rename (`2025-issizlik-maasi`→`2026-issizlik-maasi`, redirect
eklendi) + 4 yazı migrasyon snapshot'ından SONRA yayınlanmış (REST'ten
çekilip ham export'a eklendi, normal akışla işlendi) — gerçek migrasyon
hatası değil, doğal blog büyümesi. **Kalıcı bulgu:** blog migrasyon
sonrası da düzenli büyümeye devam ediyor, periyodik senkronizasyon kararı
bekliyor (Açık nokta #16).

**[2026-07-30] `CustomerLogoMarquee` glitch düzeltildi + hız ölçüldü.**
Glitch kök nedeni: 28 `<img>`'de `width`/`height` yoktu, farklı zamanda
yüklenen görseller container genişliğini animasyon sırasında kaydırıyordu
(ağ zamanlamasına bağlı, bu yüzden "arada bir") → gerçek intrinsic
boyutlar eklendi. Hız artık TAHMİN değil — kaynağın gerçek widget JS'i
okunup hesaplandı (Swiper `marquee_speed:4000`→6000ms/slide × 14 logo =
**84s**, önceki 22s/28s tahminlerinden çok daha yavaş). Yan bulgu
(dokunulmadı): `tugba-2-1.svg` 846KB (gömülü base64 PNG, render bozuk
değil, yalnızca verimsiz).

**[2026-07-30] `CustomerLogoMarquee` 3 ince ayar.** Hız 22s→28s,
full-bleed (break-out tekniği, önceki başarısız `mr-[calc]` denemesinden
bilinçli farklı), `loading="lazy"` kaldırıldı (sürekli-görünür şerit için
yanlış optimizasyon).

**[2026-07-30] Müşteriler sayfasına logo marquee eklendi.** 14 logo,
gerçek kaynak sırası/görselleri, mevcut `MarqueeBar` CSS-only tekniği
yeniden kullanıldı (yeni kütüphane yok). "Eksik logo" raporu araştırma
sonunda dosya hatası değil, 40s'lik yavaş döngüde kullanıcının kısa
gözlem penceresinin sonraki logolara ulaşmadan kapanması çıktı (14
dosyanın tamamı `curl` ile tek tek doğrulandı, hepsi geçerli).

**[2026-07-30] KEŞFET → İçerikler rozet stiline çevrildi + Raporlar
carousel bug'ı.** Bulunan bug: sınırda DOM'dan kaldırılan ok butonu
`focusout` tetikleyip mega-menüyü kapatıyordu (click'le ilgisiz) →
butonlar artık her zaman DOM'da, görünürlük yalnızca CSS/aria ile
kontrol ediliyor. Bloglar + Dijital İK Olgunluk Testi öğeleri gerçek
kaynak rozet stiline (`#F4CCCE` bg, `#FF0000` ikon, 52px) çevrildi —
"Hesaplamalar" bilinçli olarak rozetsiz bırakıldı (kaynakta da öyle).

**[2026-07-30] Header scroll flicker — 1. tur (kısmi çözüm, 2. turda
tam çözüldü).** Kök neden: `grid-template-rows` geçişi (layout-tetikleyen)
header'ın sticky+backdrop-blur'üyle çakışıp tekrarlanan reflow üretiyordu.
`will-change-transform` (header) + `contain-layout` (`#marquee-wrap`)
eklendi — kullanıcı sert yenilemeyle "düzeldi" dedi ama sonradan
yetersiz çıktı (bkz. yukarıdaki 2. tur).

**[2026-07-30] İK Olgunluk Testi Section 2/3/5 genişlet+boşluk artır.**
Section 3 pilot (`max-w-6xl→7xl`, gap'ler +%40-50) onaylanıp Section 2 (5
kart) ve Section 5'e (4 kart) aynı oranla uygulandı. Rozet/ikon boyutları
dokunulmadı (ayrı, bekleyen karar — Açık nokta #15).

**[2026-07-29] İK Olgunluk Testi Section 3/5 görselleri büyütüldü.**
`post-23868.css`'ten ölçülen gerçek masaüstü değerleri: Section 3 görseli
581px (önceki `max-w-420px` küçüktü), Section 5 görseli 432px (önceden
yalnızca mobil değeri 350px her breakpoint'te kullanılıyordu) →
`max-w-[350px] lg:max-w-[581px/432px]`'e düzeltildi.

**[2026-07-29] `uploads.zip` işlendi — keşif + 2 alan pilot.** Proje o
ana kadar TÜM görselleri idenfit.com'a hotlink ediyordu (bilinçli
karar) — `uploads.zip` (1.4GB, 20.933 dosya) açılıp ~1265 gerçekten
kullanılan dosya (~230MB) tespit edildi. **Karar:** `public/wp-content/
uploads/...` altına WP'nin aynı göreli yoluyla kopyalanacak (yalnızca
veri katmanında URL prefix'i değişiyor, hiçbir component değişmiyor).
Yeni script `scripts/localize-images.mjs` (`yauzl`, yalnızca build-time,
`optimizeDeps`'e eklenmedi). Pilot (İK Olgunluk Testi 2 görsel + 1 blog
yazısı) başarılı. **Kalan ~617 blog yazısı + 10 veri dosyası kademeli
üretim onayı bekliyor** (Açık nokta #14).

**[2026-07-29] Placeholder/hover/ikon-boyutu düzeltme turu (4 madde).**
(1) Kesikli-çizgili placeholder'lar düz gri kutuya sadeleştirildi (gerçek
görsel hâlâ `uploads.zip`'i bekliyor). (2) Section 2/5 kartlarına hover
eklendi (bilinçli UX eklentisi, kaynakta bu kartlara özel hover kuralı
yok). (3) Section 5 ikon boyutu 38px→44px düzeltildi (önceki turda
Section 2'den yanlışlıkla kopyalanmıştı). (4) Font tutarsızlığı
araştırıldı, yapısal bug bulunamadı (Quicksand zaten miras yoluyla
uygulanıyordu).

**[2026-07-29] İK Dijital Olgunluk Testi'ne 5 bölüm eklendi.** 5-alan
kartları, checklist+görsel, 3 adımlı süreç, 4 sonuç kartı, kapanış CTA —
kaynağın template'inden (23868) ölçülerek eklendi. 2 gerçek placeholder
kaldı (Section 3 rapor mockup'ı, Section 5 sonuç ekranı — doğru en-boy
oranı korunarak, `uploads.zip` işlenince değiştirilecek). Kapanış CTA
hero ile AYNI form component'ini paylaşıyor (`CompanyForm` ortak
component'e çıkarıldı, `idPrefix` ile DOM id çakışması önlendi) — kaynak
da iki formu `sessionStorage` ile "aynı" gösteriyor. Transkripsiyon
sırasında bulunan bir veri hatası (2. adımın metni 1. adımdan yanlışlıkla
kopyalanmıştı) düzeltildi.

**[2026-07-29] İK Dijital Olgunluk Testi hero'su düzeltildi.**
`post-23868.css`'ten ölçülen gerçek değerlerle: kayıp H1 eklendi
(56/42/32px), gri form paneli eklendi (`bg-black/14`, `border-white/80`),
buton outline'dan solid'e çevrildi, padding düzeltildi (100px→34-100px
responsive), kaynağın gerçek dekoratif "yay"ı (Lottie animasyonu,
`uzun.json`, 9KB) eklendi — kullanıcı onayıyla `lottie-web` (~28KB) yeni
bağımlılık olarak kuruldu, `optimizeDeps.include`'a eklendi.

**[2026-07-29] Sektör sayfalarındaki "Turizm Sektörü" çapraz-tanıtımı
kaldırıldı.** Bu blok **kaynağın kendi sitesinde de bozuktu** (12
sektörün 12'sinde de `relatedSectorPromo` ACF alanı sabit "Turizm
Sektörü"ne işaret ediyordu, Turizm'in kendi sayfası bile kendine
linkliyordu — canlı sitede de aynı bug doğrulandı) — bizim extraction
hatamız değildi. `relatedSectorPromo` tamamen kaldırıldı (ham JSON/fetch
script'i dokunulmadı).

**[2026-07-28] 8. tur — KEŞFET Hesaplamalar 8 ikonu.** Kaynakta her 8
linkin KENDİ renkli ikonu olduğu bulundu (düz metin değil, tek renk de
değil) — birebir `CalculatorIcons.tsx`'e taşındı. Hover rengi kırmızı
değil mor (`#6F2C90`, sitenin genel `a:hover` kuralı) çıktı — kullanıcının
"muhtemelen kırmızı" tahmini yanlıştı. Yeni `LinksColumn.linkIconStyle:
'inline'` varyantı eklendi (SEKTÖRLER'in rozet stilini buraya zorlamadı,
kaynakta rozet yok).

**[2026-07-28] 7. tur — header logo 50px, kırmızı panel padding.**
İki gerçek bug element-ID çapraz doğrulamasıyla bulundu: (1) header
logosu 32px render ediliyordu, kaynağın gerçek boyutu 136×50px (font
DEĞİL, SVG olduğu tekrar doğrulandı) → `h-[50px]`. (2) Hero'nun kırmızı
paneli yapay padding taşıyordu (`px-8 py-12/16`), kaynakta SIFIRA yakın
→ `px-6 py-5 lg:px-0 lg:py-0`, iç sarmalayıcı `max-w-[615px]`, görsel
nispi `max-w-[90%]`'e çevrildi (görselin küçük/tuhaf ortalı görünmesinin
asıl nedeni buydu). **Kalıcı ders:** aynı jenerik Elementor class adı
farklı template'lerde farklı kural taşıyabiliyor — `data-elementor-id`
ile çapraz doğrulama yapmadan bir CSS dosyasını "doğru" varsaymamalı.

**[2026-07-28] 6. tur — hero %50/%50, buton solid kırmızı, dil bayrağı.**
(1) Hero 50/50 hizalama bug'ının kök nedeni: `max-w-7xl` sarmalayıcı
panelin kendi viewport-bleed hilesiyle çakışıyordu → `max-w-7xl` ve eski
`mr-[calc]` hilesi tamamen kaldırıldı, önceki `[1fr_1.25fr]` oranı da
kullanıcı isteğiyle gerçek 50/50'ye geri alındı. (2) Kırmızı paneldeki
görsel büyütüldü (mevcut yüksek-çözünürlüklü kaynak dosyalar yeterliydi).
(3) Header'ın "Online Sunum Talebi" butonu element-ID ile GERÇEKTEN solid
kırmızı/beyaz olduğu doğrulandı (outline değil) → yeni `.btn-cta-solid`
sınıfı (form'un `.btn-cta`'sından ayrı, ikisi de kaynakta doğru). (4) Dil
seçicideki "TR TR" tekrarı Windows Chrome'un emoji-bayrak render
sınırlamasıydı (kod hatası değil) → `flagEmoji()`'den elle çizilmiş
`FlagIcon.tsx` SVG'lerine geçildi (4 dil).

**[2026-07-28] 5. tur — dil bayrağı, kırmızı panel baştan, form
alt-çizgili, WA/Ara geri.** Kırmızı panel element-ID doğrulamalı baştan
kuruldu: hero'nun kendisi düz gri (`#F8F8F8`), panel kendi `#FF0101`
arka planını taşıyor, SIFIR gap/köşe/dış padding (önceki "kart" görünümü
— `rounded-2xl`/`p-8` — tamamen kaldırıldı), iç 615px sarmalayıcı hem
dikey hem yatay ortalıyor. Form input'ları "dolgun" stilden (önceki
turun kullanıcı kararı) kaynağın gerçek alt-çizgili stiline (element-ID
doğrulamalı) geri döndürüldü — 4 sayfayı etkiledi. WhatsApp/Ara ikonları
Destek Talebi linkinin altına geri eklendi (önceki turda site-geneli
widget eklenince kaldırılmıştı, kullanıcı ikisini de istedi).

**[2026-07-28] 4. tur — ⚠️ KRİTİK: navbar fontu YANLIŞ CSS dosyasından
okunmuştu.** İki turdur okunan `post-12302.css` gerçek nav widget'ına
(`5b6c029`) ait DEĞİLMİŞ — yalnızca aynı jenerik `.elementor-item`
class'ını tesadüfen paylaşıyormuş. Doğru dosya (`post-9695.css`,
`data-elementor-id="9695"` ile doğrulandı) gerçek değerleri verdi:
`font-size:13px`(14 değil), `weight:500`(400 değil), `color:#C1272D`
(tuğla-kırmızısı — önceki iki turun "siyah" sonucu YANLIŞTI). Ayrıca
layer'sız CSS kuralının Tailwind'in `hover:text-brand` utility'sini
override ettiği (hover'ı sessizce kırdığı) bulunup düzeltildi. Site-geneli
`FloatingContactButtons.astro` `BaseLayout`'a eklendi (tek nokta, 20
sayfa). Müşteriler kartları büyütüldü. Footer arka planı siyahtan
kaynağın gerçek `#949494` soft-grisine çevrildi. **Kalıcı ders:** aynı
jenerik Elementor class adı farklı template'lerde farklı kural
taşıyabilir — `data-elementor-id` çapraz doğrulaması şart (7. turda
tekrar doğrulandı).

**[2026-07-28] 3. tur — video click-to-play, navbar font birebir, H2
boyutları, WA rengi.** (1) Video autoplay/full-bleed yanlıştı — kaynak
tıkla-oynat + %80 genişlik kullanıyor → mevcut `YoutubeClickToPlay`
component'i yeniden kullanıldı. (2) Navbar fontu kesin ölçüldü: Quicksand
(tek yüklenen font, "Euclid Circular A" tahmini yanlış), nav linkleri
14px/400 — BUTONLAR ayrı ve 15px/700 (muhtemelen önceki "15px" ölçümü
bu). (3) Site geneli H2 deseni (13 component, `text-2xl/sm:text-3xl`) 2
bağımsız kaynak örneğiyle doğrulanıp küçük çıktı → gerçek `34px/lg:40px/600`,
yeni `.h2-section` sınıfı 13 yere uygulandı. Hero H1/alt paragraf da
kesin ölçülen değerlere (alt paragraf rengi TAM `#808080`=`muted` token'ı)
düzeltildi. (4) WhatsApp ikonu resmi yeşilden marka kırmızı/beyazına geri
alındı (kullanıcı düzeltmesi — site TAMAMEN kırmızı/beyaz kalmalı).

**[2026-07-28] 2. tur — mor şerit, marquee jank, WA/Ara büyütme, navbar
font (ilk deneme, 4. turda düzeltildi).** Mor şeridin kısa görünmesinin
kök nedeni: kenarlık `max-w-7xl` (1280px) container'a konmuştu, kaynağın
kendi container'ı 1440px → bağımsız, sınırsız `<div>`'e taşındı. Marquee
scroll-hide jank'ının kök nedeni: her scroll tick'inde React re-render →
vanilla JS'e taşındı (`marquee-scroll.js`, `grid-template-rows` +12px eşik
momentum-scroll mikro-eventlerini filtrelemek için). WA/Ara ikonları
36px→48px büyütüldü (WA yeşili sonradan 3. turda geri alındı). Navbar font
ilk ölçümü (14px/400, Quicksand) kısmen doğruydu ama renk/kaynak dosyası
YANLIŞTI (4. turda düzeltildi); 15px/uppercase kullanıcı isteğiyle
kaynaktan bilinçli sapma olarak uygulandı.

**[2026-07-28] 4 tasarım/UX iyileştirmesi — marquee scroll-hide (ilk
versiyon), CTA merkezi sınıf, WA/Ara ilk ekleme, full-bleed.** Marquee
scroll-hide'ın ilk (React state tabanlı, sonradan vanilla JS'e taşınan)
versiyonu eklendi. 12 gerçek kırmızı CTA butonu merkezi `.btn-cta`
sınıfına taşındı (ikon rozetleri/hero paneli/footer sosyal ikonları/
Destek Talebi'nin bilinçli yeşil butonu hariç tutuldu). WA/Ara ikonları
ilk kez hero formunun altına eklendi (gerçek numaralar, ama bu TAM konum
kaynakta yok — site-geneli sabit widget henüz yoktu). Hero kırmızı paneli
+ video `calc(50%-50vw)` ile full-bleed yapıldı (yalnızca `lg:`).

**[2026-07-28] 4 ince işçilik — HRTech şerit, header font (ilk ölçüm,
kısmen yanlış), FeatureGrid +/= ikonları, Raporlar carousel.** HRTech
bölümüne kaynağın gerçek 27px mor üst kenarlığı eklendi. Header nav
renginin İLK ölçümü kaynakta varsayılan SİYAH (kırmızı yalnızca `:focus`)
olduğunu buldu — kullanıcıya bildirilip düşük riskli bir güncelleme
uygulandı (4. turda gerçek 13px/#C1272D değeriyle düzeltildi). FeatureGrid'e
kaynağın gerçek "+"/"=" bağlayıcı SVG'leri eklendi (kaynağın kırılgan
mutlak-konumlamasını taklit etmeden, grid kolonuyla). Raporlar carousel'i
native `scrollBy`'dan kontrollü transform-tabanlı carousel'e çevrildi,
eksik sol ok eklendi, `maxOffset` başlangıç değeri bug'ı (0 olduğu için
"ileri" oku ilk render'da hiç görünmüyordu) düzeltildi.

**[2026-07-28] Dijital İK Olgunluk Testi migrate edildi.** Kaynağın
gerçek mimarisi araştırıldı: 3 ayrı WP sayfası (lead-capture → önceden
hiç not edilmemiş 20-soruluk quiz sayfası → sonuç), skor hesaplama
TAMAMEN client-side (kaynağın `result-script.js`'inden birebir
taşındı), tek gerçek backend bağımlılığı opsiyonel "raporu e-postama
gönder" butonu (bizde yok, TODO #12). Kaynağın kendi JS'i var olmayan bir
class'a bağımlıydı (güvenilmez) — taklit edilmeden sıfırdan React ile
yazıldı (`HrMaturityTest.tsx`). **Kalıcı bug bulundu (Hesaplama
Araçları'nı da etkiliyordu):** `astro dev`'in canlı SSR'ı `nl→en→tr`
fallback'ini zincirliyor ama statik `astro build` çıktısı ZİNCİRLEMİYOR
(sessizce 404) → her iki sayfa için `astro.config.mjs`'e doğrudan tek-hop
redirect eklendi. **Kalıcı ders:** bu bug sınıfı yalnızca `astro dev` ile
değil `astro preview` (statik çıktı) ile de doğrulanmalı.

**[2026-07-27] Telefon ülke kodu — site geneli bug.** 45 ülke adının
TAMAMEN sabit Türkçe olduğu bulundu (locale'e bakmıyordu), 5 formu
(Hero/PanelFeatureSection/Online Sunum Talebi/İletişim/Destek Talebi)
etkiliyordu → `name` alanı `Record<Locale,string>`'e çevrildi.

**[2026-07-27] Müşteriler sayfası baştan tasarlandı.** Önceki 3-kolonlu
grid kaynakla karşılaştırılınca yetersiz çıktı — gerçek yapı: zigzag
tek-kolon (sol/sağ dönüşümlü), DAİRESEL kırpılmış görseller, tıkla-oynat
video (yeni `YoutubeClickToPlay.tsx`). Export SONRASI güncellenen içerik
bulundu (Civil'in çalışan sayısı, Yatsan'ın tüm testimonial'ı yeni
kişi/fotoğrafla, Civil'in ayrı 2. testimonial bloğu) — hepsi eklendi.

**[2026-07-27] Destek Talebi migrate edildi (ilk versiyon, sonra
Müşteriler ayrı turda baştan yazıldı).** TR/EN/IT + NL→EN redirect. Yeni
`SupportRequestForm.tsx` bilinçli olarak `HeroForm`'dan ayrı (kaynak
gerçekten farklı stillenmiş — açık gri input, YEŞİL buton `#60A344`,
sitenin kırmızı CTA konvansiyonunun bilinçli istisnası). Ana sayfadaki
"Destek Talebi İçin Tıklayın" linki kaynakta hiç yoktu — kırık link
değil, yeni eklenen giriş noktası.

**[2026-07-27] Telefon çoklu ülke + mega-menü rengi + Testimonial
Carousel animasyonu.** "+90" sabit öneki tam interaktif 45 ülkelik
seçiciye genişletildi (kütüphane kurulmadı, elle yazıldı). Mega-menü
paneli beyazdan kaynağın gerçek `#f2f2f2`'sine (`--color-menu-surface`)
çevrildi. `TestimonialCarousel`'e CSS Grid "stack" tekniğiyle fade+slide
geçişi eklendi.

**[2026-07-27] HeroForm telefon validasyonu + "+90" öneki.** Rakam-dışı
filtreleme, TR format normalizasyonu, "+90" öneki (sonraki turda tam
ülke seçiciye genişledi), otomatik gruplama, submit-öncesi regex
validasyonu — 4 sayfayı (HeroForm paylaşımı) etkiledi.

**[2026-07-27] Hero paneli genişletildi + form "dolgun" stil.** Kırmızı
panel `[1fr_1.25fr]`'e genişletildi (6. turda gerçek 50/50'ye geri
alındı). Form input'ları PanelFeatureSection'ın "dolgun" stiline
çevrildi (kaynakta iki form gerçekten farklı stillenmiş bir çelişkiydi —
kullanıcı 3 seçenekten seçti, 5. turda gerçek ölçümle geri alındı).

**[2026-07-27] ÜRÜNLER promo görseli büyütüldü + SEKTÖRLER 12 ikonu
rozet stiline.** ÜRÜNLER promo görseli `aspect-square object-contain`'e
düzeltildi (kırpma kalktı). SEKTÖRLER'in 12 ikonu ÜRÜNLER'in dolu
kırmızı-daire+beyaz-ikon rozet stiliyle tutarlı hale getirildi.

**[2026-07-27] ⚠️ Düzeltme — KURUMSAL promo kartı görseli üstten
kırpılıyordu.** Sabit `h-24 object-cover` (900×809 oranını bozuyordu) →
`aspect-[900/809] object-contain`, kırpma sıfırlandı.

**[2026-07-27] KURUMSAL mega-menüsüne promo kart eklendi.** Kaynakta
YOK — kullanıcının kendi görseliyle (`kurumsal-promo-team.webp`, sharp
ile ~28KB'a küçültüldü) bilinçli yeni özellik, Hakkımızda'ya link.

**[2026-07-27] 3 görsel ince işçilik.** Marquee bar inceltildi
(`py-2→py-1.5`). Hero'ya dekoratif şerit EKLENMEDİ (kaynakta olmadığı
doğrulandı, uydurulmadı). Suprema bölümüne kaynağın gerçek tilt
shape-divider'ı eklendi.

**[2026-07-24] ⚠️ Düzeltme — footer "Gizlilik Politikası" linki YANLIŞ
sayfaya bağlıydı.** Kök hata: Güvenlik (liste) ile Gizlilik ve Güvenlik
Politikası (ayrı makale) karıştırılmıştı — gerçek sayfa (TR/EN/IT) hiç
migrate edilmemiş çıktı, kuruldu. **Kalıcı ders:** bir linkin 404
vermemesi "doğru sayfaya gidiyor" anlamına gelmez, varış sayfasının
GERÇEK içeriği kaynakla karşılaştırılmalı.

**[2026-07-24] Footer canlı footer'a tam sadık — 5 madde.** Yukarıdaki
Gizlilik Politikası düzeltmesi + GENEL kolonuna eksik 6. link + doğru
sıralı 7 sosyal medya ikonu (Pinterest+Medium eklendi) + uygulama mağazası
rozetleri + ödeme yöntemi ikonları (iyzico/Troy/Visa/Mastercard/Amex).

**[2026-07-24] ⚠️ Düzeltme geri alındı — müşteri kartı logosu yanlış
varsayımla değiştirilmişti.** "ACF görselleri hatalı" varsayımıyla
değiştirilen logolar, kullanıcının orijinal fotoğrafları istediği
anlaşılınca geri alındı. **Kalıcı ders:** kaynak veriyi "hatalı"
varsaymadan önce kullanıcıya sorulmalı.

**[2026-07-24] KURUMSAL mega-menüsü kompakt dropdown'a çevrildi.** 4
basit link, zengin kolon yok → `min-w-[200px]` küçük dropdown (SEKTÖRLER/
ÜRÜNLER/KEŞFET etkilenmedi).

**[2026-07-24] Müşteri kartı "Video yakında"→gerçek logolar + mobil menü
zaten doğruydu.** 3 placeholder gerçek marka logolarıyla değiştirildi.
Kullanıcının "mobil menü tüm ekranı kaplıyor" raporu araştırılıp kod
ZATEN doğru (`w-3/4 max-w-sm` + overlay) çıktı, değişiklik gerekmedi.

**[2026-07-24] Podcastler menüden kaldırıldı.** Kaynakta URL'i hiç
bulunamadı — tamamen kaldırıldı, tek kullanıcısı kalan `comingSoon`
mekanizması de silindi (ölü kod bırakılmadı).

**[2026-07-24] Blog kartı köşe yuvarlaklığı + hover geçişleri.**
`rounded-lg`→`rounded-2xl`. Hover taraması gerçek 10 instance/8 dosya
buldu (7'si `hover:underline`, animasyonlanamaz, dokunulmadı). Detaylar
`docs/design-polish-opportunities.md`.

**[2026-07-24] Eksikler/gelecek planlama — 2 keşif raporu.** Salt
araştırma, kod değişikliği yok — `docs/remaining-work-report.md`,
`docs/design-polish-opportunities.md`.

**[2026-07-24] Logo gerçek kaynak SVG'siyle değiştirildi.** "idenfit"
yazısı bir font DEĞİL, kaynağın elle vektörleştirilmiş SVG'si —
`IdenfitLogo.tsx`'e taşındı (yıldız "i" noktası değil, ayrı bir köşe
aksanı). Header/Footer/MobileMenu paylaşıyor.

**[2026-07-24] 🎉 Blog migrasyonu FAZ B — 618/618 tamamlandı.** `--all`
toplu bayrağı eklendi. Tag önbelleği bug'ı (129 tag'in yalnızca ilk
100'ü, `X-WP-TotalPages` okunmuyordu) düzeltildi. `verify-blog-posts.mjs`
2 gerçek bug buldu (yazı içi yanlış `<h1>`→`<h2>` indirgeme genelleştirildi;
kopyala-yapıştırdan ikiye katlanmış bir link URL'i genel çözümle
düzeltildi). Nihai: 618 yazı, 6,2MB `posts.json`, 52 sayfalama sayfası.

**[2026-07-24] Blog tasarımı FAZ A — sidebar, okuma süresi, 2 kolon.**
`BlogSidebar.astro` kaynağın gerçek yapısıyla kuruldu. "Kategori rozeti
tekrarı" kullanıcı bulgusu araştırılınca KAYNAĞIN KENDİ bug'ı çıktı
(biz zaten dedupe yapıyorduk) — kopyalanmadı. Okuma süresi (200 kelime/
dk) Yoast'ın rakamıyla birebir örtüştü.

**[2026-07-24] Blog migrasyonu ADIM 1 — pilot + 14 çeşitlilik yazısı.**
3 gerçek script bug'ı düzeltildi (boş excerpt, kısa excerpt eşiği,
dosya-adından-üretilmiş anlamsız alt metin). İç link çözümleme
genelleştirildi, entity çözümü yapısal/tipografik olarak ayrıştırıldı
(UTM query string'lerini korudu). TOC'un tekrarlı heading id'si düzeltildi.

**[2026-07-24] Blog migrasyonu başladı — Content Collection altyapısı.**
`src/content.config.ts` (Astro 6+'da zorunlu yeni konum) + `file()`
loader. `fetch-blog-taxonomy.mjs` + `extract-blog-posts.mjs <slug...>`
(bilinçli TOPLU DEĞİL, sürtünme için). Kaynak temizliği: yinelenen H1
kaldırma, kendi excerpt üretimi, isim-bazlı kategori dedupe.

**[2026-07-24] Blog öncesi 4 küçük düzeltme.** Dijital İK Olgunluk Testi
linki geçici ana sayfaya yönlendirildi (sonra düzgün kuruldu). EN/IT→TR
`i18n.fallback` eklendi. ÜRÜNLER promo panelinin gerçek görseli bulundu.
Donanım ikonunun soluk rengi kaynak-doğrulandı (bug değil) ama kullanıcı
kararıyla marka rengine çevrildi.

**[2026-07-23] Hesaplama Araçları — 2 küçük düzeltme.** Hero
illüstrasyonu sayfaya özel CSS'te bulunup eklendi. Akordeon bug'ı
(hash kalkınca kapanmıyordu) düzeltildi.

**[2026-07-23] Vite bağımlılık önbelleği bozulması — kalıcı çözüm.**
Tekrarlayan `_jsxDEV is not a function` hatası 3 tetikleyiciye
bağlandı: `npm install/uninstall` dev server açıkken, Vite'ın lazy
dependency discovery'si, `astro.config.mjs` dev server açıkken
düzenlenmesi. Kod düzeltmesi: `vite.optimizeDeps.force:true` +
`include:[...]` (1. ve 2. tetikleyiciyi kapatır). **Kalıcı kural**
(§Proje kuralları'nda kodifiye, madde başına tekrar anlatılmıyor):
`npm install/uninstall` veya `astro.config.mjs` değişikliğinden SONRA
mutlaka `npm run dev:clean` (tam process kill+restart), Astro'nun
otomatik soft-restart'ına güvenilmemeli.

**[2026-07-23] Hesaplama Araçları sayfası kuruldu — 8 hesap makinesi.**
TR-only (KARAR 2). Form alanları/formüller kaynağın jQuery'sinden elle
`calculatorDefinitions.ts`'e taşındı. Gerçek bug bulundu: `calculate`/
`visibleWhen` FONKSİYONLARI prop olarak geçiriliyordu (SSR→client JSON
serileştirme fonksiyon taşıyamaz, hydration mismatch) → yalnızca `slug`
string prop'a çevrildi. 6/8 araç elle doğrulandı.

**[2026-07-23] Teşekkürler sayfası migrate edildi.** TR/EN/IT (NL yok).
Gerçek kaynak veri hatası bulundu: EN/IT'nin "Why idenfit?" linki yanlış
sayfaya (Müşteriler) gidiyordu → `getWhyIdenfitSlug()`'a bağlandı. Form
gönderiminden bu sayfaya otomatik yönlendirme YOK (Faz 2 TODO, Açık
nokta #2).

**[2026-07-23] `app.idenfit.com` CTA'ları aynı sekmede açılacak şekilde
düzeltildi.** `external` alanının iki farklı anlamı (URL dönüştürülmedi
vs yeni sekmede aç) ayrıştırıldı — yeni `newTab` alanı eklendi.

**[2026-07-23] Site denetim raporu tamamen kapandı (14/14).** Son 2 Orta
madde kapatıldı (Güvenlik sayfasının meta'sı). **Sonuç: 11 madde
düzeltildi, 1 madde bilinçli bırakıldı, 2 madde aksiyon gerektirmedi.**

**[2026-07-23] Site denetim raporu Kritik 3 + Yüksek 6 madde.** Fiyatlar
CTA'ları, Footer ÜRÜNLER kolonu (32 link), mobil menü akordeonu
(**bulunan bug: `backdrop-blur` içeren `<header>`, altındaki
`position:fixed` overlay'in containing block'unu bozuyordu →
`createPortal` ile `document.body`'ye taşındı, kalıcı proje kuralı, bkz.
§Mimari**), 2 hub NL switcher'ı, Suprema/Video hardcoded slug'ları,
Şirket Takvimi/Sağlık/Özlük Dosyası'nın kırık görselleri, Gıda/Hizmet'in
IT placeholder metni düzeltildi.

**[2026-07-22] KVKK/hukuki sayfalar + dış link taraması + FAQ entity
hatası.** NL fallback düzeltildi. Site geneli dış link taraması
(`test-no-external-idenfit-links.mjs`, o zamandan beri her turda
regresyon testi) 1 gerçek bug buldu. Numerik HTML entity'leri
genelleştirildi.

**[2026-07-22] 6 kritik hata bulundu ve düzeltildi.** Hero formunun KVKK
onayı gerçek kaynağa bağlanmadı → düzeltildi. Hero sağ kolon görseli
placeholder'dı → gerçek görsel eklendi. **KVKK sayfası hiç migrate
edilmemişti** → TR/EN/IT kuruldu. **"Online Sunum Talebi" CTA'sı — en
kritik buton — 404 veriyordu** → route'landı (canonical slug, her CTA
otomatik düzeldi). **Fiyatlar sayfası hiç migrate edilmemişti** → 4 dilde
kuruldu.

**[2026-07-22] SSS dil değiştirici + Hakkımızda migrasyonu.** SSS'in NL
switcher hedefi düzeltildi. Hakkımızda hiç migrate edilmemişti → 4 dilde
kuruldu (gerçek çeviriyle).

**[2026-07-22] SSS yeniden tasarlandı + KURUMSAL 4/4 tamamlandı.** SSS
kaynağın gerçek sekmeli tasarımına çevrildi. KURUMSAL'ın eksik 2 linki +
4 yeni sayfa grubu kuruldu (İletişim, Tüketici Hakları, Mesafeli Satış,
Güvenlik, Hedef Global Marka, Neden İdenfit). **Kalıcı kural:** per-locale
slug'lar farklıysa ve bir locale'de sayfa yoksa, otomatik `i18n.fallback`'e
güvenilmeden bare-path eşleşmesi elle doğrulanmalı (`astro.config.mjs`'e
elle `redirects` gerekir).

**[2026-07-22] Footer alt bar + SSS/`faq` CPT kurulumu.** Kaynakta
olmayan `terms` linki kaldırıldı. SSS içeriğinin ayrı bir **`faq` custom
post type**'ta (90 kayıt, NL yok) olduğu keşfedilip route'landı.

**[2026-07-22] Ana sayfa TAMAMLANDI — 12/12 bölüm.** Hero→LogoStrip→
Divider→Video→FeatureGrid→Divider→Efficiency→PanelFeature(2. form)→
Suprema→CertificationBadges→TestimonialCarousel→HRTech Alliance. **Kritik
mimari not: 4 ayrı `index.astro` dosyası var** (dinamik route değil) —
bölüm eklerken 4 dosya da elle güncellenmeli.

**[2026-07-22] ÜRÜNLER mega-menüsü TAMAMEN KAPANDI (108/108 link).** 2
İK hub sayfası "Genel Bakış" olarak eklendi. Donanım sayfası (`/donanim/`)
tek sayfa + 7 anchor olarak kuruldu (bulunan bug: anchor linklerine
trailing slash ekleniyordu, düzeltildi). 20 ürün modülü linki per-locale
slug'lara bağlandı.

**[2026-07-21] Puantaj + 2 İK Hub sayfası — KARAR 3 kapandı (21 sayfa
grubu, tamamı).** Puantaj standart şemalara uymadı, `extractSchemaE()`
eklendi. 2 hub sayfası `HubPage.astro`/`hubContent.ts` mimarisiyle
kuruldu — kaynak veri hataları uydurma veriyle DOLDURULMADI, atlandı.

**Üç kalıcı karar (2026-07-21):**
- **KARAR 1 — gerçek çeviri kuralı.** Eksik/boş/kopya dil içeriği TR
  kaynaktan gerçek profesyonel çeviriyle üretilir (bkz. §Mimari — override
  sistemi).
- **KARAR 2 — kaynakta olmayan çeviriler için yeni sayfa üretimi
  ERTELENDİ** (Açık nokta #1).
- **KARAR 3 — hiçbir modül kapsam dışı bırakılmayacak** (89 sayfayla
  kapandı).

**[2026-07-21] 7 "temiz" modül üretildi (28 sayfa):** Doküman, Masraf,
Mesaj, Zimmet, Servis/Shuttle, Özlük Dosyası, Eğitim. KARAR 1 geriye
dönük uygulandı (Zimmet'in EN/IT'si ham Türkçeydi, çevrildi).

**[2026-07-21] Aşama 2.5 — 6 modül daha, şema çeşitliliği testi.**
Sağlık, Offboarding, Anket, Geri Bildirim, Şirket Takvimi, Notlar.
Şirket Takvimi 4. bir ACF şeması varyantı ortaya çıkardı (3 hero şeması
aynı sayfada), extraction öncelik sırasıyla otomatik çözüldü.

**[2026-07-21] Aşama 2 — Bordro, İzin, Performans, Onboarding, İşe Alım
(19 sayfa).** Modül sayfalarının TEK bir ACF şeması kullanmadığı
keşfedildi (3 ek şema + tutarsız alan adları), `extract-products.mjs`
genelleştirildi.

**[2026-07-21] Aşama 1 — PDKS pilotu (onaylandı).** İlk modül sayfası, 9
blok + 20 SSS. PDKS'in SSS'i aslında Performans modülüne ait (kaynağın
kendi hatası, KARAR 1 kapsamında olduğu gibi bırakıldı) — bu turda
`productContent.ts`/`ProductPage.astro` mimarisi kuruldu.

**[2026-07-21] Müşteri Başarı Hikayeleri ilk kez kuruldu** (sonradan
2026-07-27'de tamamen yeniden tasarlandı). WP'nin EN/NL/IT çevirileri
düşük kaliteli makine çevirisiydi, kullanılmadı — TR'den gerçek çeviri
yazıldı.

**[2026-07-21] Sektör sayfaları — düzeltme ve gerçek içerik.** "Sektör
sayfaları WP'de hiç yok" tespiti yanlıştı — içerik ayrı bir **`sectors`
custom post type**'taydı. **Kalıcı ders:** bir içeriğin "WP'de yok"
sonucuna varmadan önce `wp/v2/types` ile TÜM post type'lar kontrol
edilmeli (bu hataya `faq` CPT'de bir kez daha düşüldü). 48 sayfa (12×4
dil) çekilip route'landı, birkaç veri hatası düzeltildi.

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
(`online-sunum-talebi`, 4 dilde AYNI slug — **NL artık GERÇEK bir sayfa**,
2026-08-04'te KARAR 2'nin istisnası olarak eklendi, bkz. §Proje Durumu
günlüğü; kaynakta hâlâ yok, `PRESENTATION_NL_OVERRIDE` ile TR'den
profesyonel çeviri), Fiyatlar (`fiyatlar`/`pricing`/
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
- **Güvenlik taraması alışkanlığı (2026-08-03):** `npm run audit`
  (`package.json`, `scripts/run-audit.mjs`'i çağırır) **her önemli
  değişiklik öncesi/deploy öncesi** çalıştırılmalı. Kritik/yüksek seviye
  bulunursa `npm audit fix` (veya gerekiyorsa manuel paket güncellemesi)
  uygulanıp **mutlaka** regresyon testleri (`test-*.mjs` + `astro check`
  + `astro build`) tekrar koşulmalı — bir güncelleme site fonksiyonlarını
  sessizce bozabilir. Düşük/orta seviye bulgular hemen müdahale
  gerektirmiyorsa §Açık noktalar'a yeni bir madde olarak not düşülüp
  periyodik takibe alınır (bkz. Açık nokta #20). **Not:** düz `npm audit`
  (`npm run audit` DEĞİL, doğrudan) her zaman çalışır; `npm run audit`
  script'inin `scripts/run-audit.mjs` sarmalayıcısına ihtiyaç duymasının
  nedeni bu sandbox ortamına özgü bir `npm_config_allow_scripts` env
  kalıtım çakışması (bkz. §Tamamlanan işler, 2026-08-03 günlüğü) —
  gerçek bir güvenlik açığı değil, yalnızca `npm run` üzerinden çağrıldığında
  ortaya çıkan bir tooling quirk'ü.

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
hali) bu plana zaten uyumlu. **İçerik yönetim paneli için Decap CMS
seçildi** (2026-08-03, bkz. §Açık noktalar #19) — en düşük saldırı
yüzeyine sahip seçenek çünkü kendi sunucu/API/veritabanı gerektirmiyor,
GitHub OAuth (endüstri standardı) kullanıyor, içerik git deposunda
Markdown olarak tutuluyor. Kurulum Faz 2'de yapılacak.

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
