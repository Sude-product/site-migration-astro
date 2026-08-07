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

## Proje Durumu (son güncelleme: 2026-08-07)

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

**Kapanmış maddeler (3,4,5,7,11,17,18,23) arşivde** — özet: promo görsel
bulundu, blog 622/622 tamamlandı, Podcastler kaldırıldı, Gizlilik ve
Güvenlik Politikası migrate edildi, HR Olgunluk Testi kuruldu, Online
Sunum Talebi 7 tur sonunda onaylandı, navbar BLOG linki kaldırıldı,
Demirbaş/Seyahat mega-menüye bilinçli eklenmedi (kaynak da gizliyor).

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
  `test-no-external-idenfit-links.mjs`, `test-faq-language-switch.mjs`).
- **Tip güvenliği:** `npx astro check` — i18n şemasının (ve genel
  TypeScript'in) hatasız derlendiğini doğrular; VS Code'un canlı
  diagnostics'i zaman zaman stale olabilir, `astro check` güncel sonuçtur.
- **Test yaklaşımı:** Yeni bir dil değiştirici/CTA/link değişikliğinden
  sonra ilgili `test-*.mjs` script'i (dev server ayakta olmalı) +
  regresyon için mevcut diğer `test-*.mjs`'ler çalıştırılır.
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

