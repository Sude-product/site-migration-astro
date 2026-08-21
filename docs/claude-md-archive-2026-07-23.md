## Proje Durumu — İlerleme Özeti (son güncelleme: 2026-07-22, kapsamlı site denetim raporu hazır — `docs/site-audit-report.md`, henüz düzeltme yapılmadı)

### 📋 Blog migrasyonu öncesi genel site denetimi tamamlandı — rapor kullanıcı önceliklendirmesini bekliyor (2026-07-22)

Blog migrasyonuna geçmeden önce 184 sayfa/4 dil üzerinde kapsamlı bir
denetim yapıldı (HTTP durumu, title/description, kırık iç link, dil
değiştirici tutarlılığı, IT=EN kopya içerik taraması, HTML entity, kırık
görsel, CTA zinciri, konsol hataları). **Hiçbir düzeltme uygulanmadı —
bu kullanıcının açık talimatıydı.** Tam bulgu listesi, ciddiyet
sıralaması (kritik/yüksek/orta/bilgi) ve her bulgunun kök nedeni:
**`docs/site-audit-report.md`**.

**Öne çıkan bulgular (özet — detay raporda):** Fiyatlar sayfasının Mikro/KOBİ
CTA'ları 4 dilde kırık; Footer ÜRÜNLER kolonunun 7/8 linki EN/NL/IT'de
kırık (mega-menü bu sınıf sorunu geçen turlarda çözmüştü, footer hiç
düzeltilmemiş); mobil menüde ÜRÜNLER/SEKTÖRLER/KURUMSAL/KEŞFET kırık
sayfalara gidiyor; ana sayfanın Suprema/Video linkleri EN/NL/IT'de kırık;
2 İK Hub sayfasında KVKK'da bulunanla AYNI `localeUrlsFor()` eksikliği
tekrarlanmış; birkaç modülün IT görselleri kırık (biri bizim override
hatamız, biri kaynak veri sorunu); 2 sektör sayfasının IT başlığı
"Contenuti della Pagina" placeholder'ı gösteriyor.

Kullanılan denetim script'leri (tekrar çalıştırılabilir, `scripts/`
altında): `audit-site.mjs`, `audit-analyze.mjs`, `audit-lang-consistency.mjs`,
`audit-entities.mjs`, `audit-images.mjs`, `audit-http-status.mjs`.

**⏸️ DURULDU — kullanıcı raporu inceleyip önceliklendirecek.** Bir
sonraki oturumda önce bu raporun hangi maddelerinin ele alınacağına karar
verilecek, ardından (veya paralel olarak) blog migrasyonuna geçilecek.


### ✅ Üç konu düzeltildi: KVKK/hukuki sayfalarda NL tutarsızlığı + dış link taraması + FAQ entity hatası (2026-07-22)

**SORUN 1 — KVKK sayfasında (ve 3 benzer sayfada) dil değiştiriciden NL'e
geçiş TUTARSIZDI (bazen İngilizce'ye düşüyor, bazen 404):** Kök neden
`miscPagesContent.ts`'in paylaşılan `localeUrlsFor()` fonksiyonuydu —
KVKK/Tüketici Hakları/Mesafeli Satış/Güvenlik gruplarının hiçbirinde NL
kaynak sayfası yok, bu yüzden `result.nl` hiç set edilmiyordu. `Header.astro`'nun
merge mantığı (`{...generic, ...override}`) bu durumda NL için kendi
GENERIC (yanlış, "aktif path'in bare slug'ı + nl prefix'i" varsayan)
hesaplamasını sızdırıyordu. Bu, **TR sayfasından NL'e geçerken** (TR'nin
bare slug'ı zaten `astro.config.mjs`'teki elle tanımlı redirect'le eşleştiği
için) ÇALIŞIYORDU, ama **EN/IT sayfasından NL'e geçerken** (o path için
redirect tanımlı DEĞİL) GERÇEK 404 veriyordu — kullanıcının tarif ettiği
"bazen İngilizce'ye düşüyor, bazen hata veriyor" tutarsızlığının tam
sebebi buydu (hangi sayfadan başladığınıza bağlı).
- **Düzeltme (merkezi, TEK yerde):** `localeUrlsFor()`'a `getFaqLocaleUrls()`'te
  (bir önceki turda) uygulanan aynı kural eklendi — `nl` eksikse ve `en`
  varsa, `nl` doğrudan `en`'in gerçek URL'ine eşitleniyor. Bu fonksiyon
  KVKK/Tüketici Hakları/Mesafeli Satış (`getLegalLocaleUrls()` üzerinden)
  VE Güvenlik (`getSecurityLocaleUrls()` üzerinden) tarafından ORTAK
  kullanıldığı için tek bir değişiklik 4 sayfayı da düzeltti.
- **Yeni test — `scripts/test-legal-nl-consistency.mjs`:** 4 sayfanın her
  birini 3 farklı giriş noktasından (TR/EN/IT) test edip NL hedefinin HER
  ZAMAN aynı (ve çalışan) URL'e gittiğini doğruluyor. **Sonuç: 12/12
  giriş noktası tutarlı + çalışıyor.**

**SORUN 2 — Site genelinde dış linke (canlı idenfit.com) yanlışlıkla
giden başka linkler arandı:** Güvenlik sayfasının KVKK linkindeki bilinen
hatadan yola çıkılarak sistematik bir tarama yapıldı.
- **Yeni script — `scripts/test-no-external-idenfit-links.mjs`:** kaynak
  kodu grep'lemek YETERSİZ (çünkü `localizeCtaUrl()`/`resolveTileCta()`
  gibi fonksiyonlar birçok ham `idenfit.com` URL'ini render zamanında
  relative'e çeviriyor) — bu yüzden `astro build` çıktısındaki
  (`dist/**/*.html`) GERÇEKTEN render edilmiş `href`'ler taranıyor.
  İzin verilen istisnalar: `app.idenfit.com` (canlı uygulama girişi),
  `my.idenfit.com` (Şirket Takvimi metnindeki gerçek, `target=_blank`
  müşteri portalı referansı), `mailto:`, ve `/wp-content/uploads/...`
  (gerçek PDF/görsel hotlink'leri, proje genelinde bilinçli).
- **İlk tarama 761 "eşleşme" buldu — hepsi PDF hotlink'i (yanlış
  pozitif), istisna listesine `/wp-content/uploads/` eklenince 4 GERÇEK
  bulguya indi:**
  1. **`kurumsal-takvim-modulu` sayfasının `my.idenfit.com` linki** (3
     locale) — incelendi, GERÇEK ve zaten `target=_blank` ile doğru
     işaretli bir dış link (Şirket Takvimi'nin mobil/web hesabı
     referansı) — bug değil, istisna listesine eklendi.
  2. **`sanayi-otomotiv-ik-cozumleri` sektörünün "İş Gücü Yönetimi"
     özellik kartı — GERÇEK bir bug:** kaynak ACF alanının `ctaUrl`'ü
     `#https://idenfit.com/tr/insan-kaynaklari-isgucu-yonetimi/` (başında
     yanlışlıkla bir `#` karakteri — hub tile'larındaki (bkz. CLAUDE.md,
     offboarding) AYNI sınıf WP veri hatasının bir tekrarı, bu kez sektör
     tarafında). `sectorContent.ts`'in `bareSlugFromUrl()`'ü bunu `new URL()`'e
     veremeyip (protokol yok) ham string'i OLDUĞU GİBİ (baştaki `#` dahil)
     döndürüyordu, sonuç kırık bir `/#https://idenfit.com/...` href'iydi.
     **Düzeltme:** `bareSlugFromUrl()` artık `new URL()`'e geçmeden önce
     baştaki `#` karakter(ler)ini temizliyor — kaynakta aynı hata tekrar
     çıkarsa elle müdahale gerekmeden otomatik düzelir. Diğer tüm ürün/
     sektör/hub JSON'ları (`products.json`/`hubs.json`/`misc-pages.json`/
     `pricing.json`) aynı desen için taranıp temiz çıktı (yalnızca bu tek
     sektör kaydı etkileniyordu).
- **Son tarama: 220 HTML dosyasında 0 şüpheli dış link.**

**SORUN 3 — İtalyanca (ve Türkçe) SSS'de HTML entity hatası
(`&#8217;` ham metin olarak görünüyordu):** `FaqPage.astro`'nun soru
başlığı `{item.question}` DÜZ METİN olarak render ediliyor (`set:html`
DEĞİL, bilinçli — sorular formatsız düz metin) — ama `faqContent.ts`'in
eski `decodeEntities()` fonksiyonu yalnızca `&amp;`'i çözüyordu, numerik
HTML entity'lerini (`&#8217;` = sağ tek tırnak/kesme işareti) HİÇ
çözmüyordu. `answer` alanı `set:html` ile render edildiği için tarayıcı
entity'leri zaten doğru gösteriyordu (bu yüzden yalnızca SORU
başlıklarında fark edilmişti).
- **Kapsamlı tarama — `faq.json`'da (3 dilin 3'ünde) kaç soru etkileniyor:**
  TR 1 soru (`idenfit'ten alacağım destek...`), EN 0, **IT 4 soru**
  (`Cos'è Idenfit?`, `Com'è il processo di configurazione?`, `C'è una
  tassa di configurazione e formazione?`, `Come riceverò supporto... l'accordo?`).
- **Düzeltme:** `decodeEntities()` genelleştirildi — artık numerik
  (decimal `&#8217;` VE hex `&#x2019;`), `&nbsp;`, `&quot;`, `&#039;`/`&apos;`,
  `&lt;`/`&gt;`, `&amp;` dahil TÜM yaygın entity'leri çözüyor (öncekinde
  yalnızca `&amp;` vardı). Hem `question` hem `answer` hem kategori `name`
  alanına uygulanıyor (savunmacı — `answer`/`name` zaten `set:html`/kısmi
  çözme sayesinde görsel olarak doğruydu, ama merkezi/tutarlı olması için
  hepsi aynı fonksiyondan geçiyor).
- **Başka yerlerde de arandı mı? Evet — sistemik bir tarama yapıldı:**
  `reference/wordpress-export/*.json`'daki TÜM alanlar recursive olarak
  entity pattern'i için tarandı (`faq.json`, `hubs.json`, `misc-pages.json`,
  `products.json`, `sectors.json`, `pricing.json`, `hardware.json`).
  Entity içeren TEK alan sınıfı `faq.json`'ın `question`/`answer`'ıydı
  (düzeltildi) — diğer tüm dosyalarda entity içeren alanlar (`sections[].text`,
  `hero.text`, `content_block`, `tiles[].text` vb.) zaten `set:html` ile
  render ediliyor (tarayıcı otomatik çözüyor, gerçek bir görsel bug yok).
  `sectors.json`/`pricing.json`'da (ki bu ikisinin `hero.title`/`planTitle`
  gibi bazı alanları DÜZ METİN render ediliyor, `SectorPage.astro`/
  `PricingPage.astro`) hiç entity bulunamadı — şu an için gizli bir bug
  yok, ama aynı sınıf risk yapısal olarak orada da mevcut (ileride kaynak
  veri değişirse gündeme gelebilir, not edildi).

**Test (tamamı):** `astro check` 0 hata. SORUN 1: yeni
`test-legal-nl-consistency.mjs` 12/12 (4 sayfa × 3 giriş noktası).
SORUN 2: yeni `test-no-external-idenfit-links.mjs` 220 dosyada 0 dış
link (production build sonrası). SORUN 3: TR/IT'nin etkilenen sorularının
tümü curl ile doğrulandı (`idenfit'ten`, `Cos'è Idenfit?` — artık gerçek
apostrof karakteri, ham `&#8217;` yok). Regresyon: `test-urunler-menu-links.mjs`
108/108, `test-product-language-switch.mjs` 56/56, `test-sector-language-switch.mjs`
36/36, `test-faq-language-switch.mjs` 9/9 — hiçbiri etkilenmedi. `astro
build` 184 sayfa hatasız. `node_modules/.vite` + `dist` temizlenip dev
server temiz yeniden başlatıldı, `_jsxDEV` hata kontrolü doğrulandı (0).

**Test URL'leri:**
- NL tutarlılığı: `/kisisel-verilerin-korunmasi/`, `/en/data-use-policy/`,
  `/it/protezione-dati-personali/` (hangisinden başlarsanız başlayın, dil
  değiştiricide NL artık her zaman `/en/data-use-policy/`'e gidiyor) —
  aynısı Tüketici Hakları/Mesafeli Satış/Güvenlik için de geçerli.
- Düzeltilen sektör linki: `http://localhost:4321/sanayi-otomotiv-ik-cozumleri/`
  ("İş Gücü Yönetimi" kartının "inceleyin>" linki artık `/insan-kaynaklari-isgucu-yonetimi/`'e gidiyor)
- FAQ entity düzeltmesi: `http://localhost:4321/sss/` (TR),
  `http://localhost:4321/it/faq/` (IT — "Cos'è Idenfit?" vb. 4 soru)

### ✅ 6 gerçek hata bulundu ve düzeltildi (2026-07-22)

Kullanıcı 6 ayrı hata rapor etti, hepsi araştırılıp kök nedeni bulunarak
düzeltildi. Üçü ("Online Sunum Talebi" CTA'sı, Fiyatlar sayfası, KVKK
sayfası) **hiç migrate edilmemiş sayfalara giden kırık linkler** olduğu
ortaya çıktı — sitenin en kritik CTA'sı (Header'daki kırmızı buton, TÜM
sayfalardaki "Online Sunum Talebi" linkleri) baştan beri 404 veriyordu.

**HATA 1 — Hero formunun KVKK/Gizlilik onay metninde link yoktu:**
`HeroForm.tsx`'in `kvkkNotice` metni düz string olarak render ediliyordu,
hiç `<a>` etiketi yoktu. Araştırma sırasında daha büyük bir sorun ortaya
çıktı: mevcut metnin kendisi ("...KVKK Aydınlatma Metni ve Gizlilik
Politikası kapsamında...") **hiçbir zaman gerçek kaynağa dayanmıyordu** —
ana sayfanın gerçek ACF alanı `banner_kvkk_metin` incelenince (4 dilin
4'ünde de gerçek, WP'nin kendi ürettiği HTML + gerçek linkler içeren bir
alan) tamamen farklı bir metin ve hedef çift olduğu görüldü: **"İletişim
Web KVKK İbaresi" → KVKK sayfası + "Kullanım Koşullarını" → Tüketici
Hakları Sözleşmesi** (Gizlilik Politikası değil!). Aynı metin `Online
Sunum Talebi` sayfasının `content.rendered`'ında da birebir aynı ifadeyle
doğrulandı — tek seferlik bir yanlış değil, sitenin gerçek, tutarlı
konvansiyonu.
- **Düzeltme:** `src/i18n/types.ts`'e yeni `KvkkNoticeLabels` şeması
  (`prefix`/`kvkkLinkText`/`middle`/`termsLinkText`/`suffix` — 4 dilin
  4'ünde de cümle bu kalıba uyuyor: `[prefix][LİNK1][middle][LİNK2][suffix]`),
  `hero.kvkkNotice` artık bu tip. 4 dil dosyasına gerçek WP metni (TR/EN/NL/IT,
  hepsi ana sayfanın kendi ACF alanından) yazıldı. `HeroForm.tsx`'e
  `kvkkHref`/`termsHref` prop'ları eklendi, notice artık 2 gerçek
  `<a target="_blank">` içeriyor.
- **Yeni yardımcı — `getKvkkAndTermsHrefs(locale)`** (`miscPagesContent.ts`):
  KVKK + Tüketici Hakları'nın per-locale gerçek URL'lerini tek yerden
  hesaplıyor (NL için bare slug + `getRelativeLocaleUrl`, zaten kurulu
  `redirects` mekanizmasına düşüyor). 3 form kullanan sayfaya da
  (`HeroSection.astro`, `PanelFeatureSection.astro`/"Kullanıcı Dostu
  Panel", `ContactPage.astro`) eklendi — üçü de aynı `t.hero.kvkkNotice`'i
  paylaşıyordu, üçü de düzeldi.

**HATA 2 — Hero'nun sağ kolon görseli hiç yoktu (placeholder kutuydu):**
`HeroSection.astro` kesikli çizgili bir "Görsel yakında" kutusu
gösteriyordu (CLAUDE.md'nin "🟡 Yarım kalanlar" notunda zaten biliniyordu).
Ana sayfanın ACF alanı incelenince gerçek görsel bulundu:
`banner_gorsel_dashboard` (4 dilin 4'ü de KENDİ farklı dashboard mockup
görselini kullanıyor, id 9/9818/20333/22786 üzerinden). `src/data/homeContent.ts`'e
`HOME_HERO_IMAGE` eklendi, `HeroSection.astro` artık gerçek `<img>`
render ediyor. Kullanılmayan `t.hero.imageComingSoon` i18n anahtarı
(4 dil dosyası + `types.ts`) temizlendi.

**HATA 3 — KVKK sayfası hiç migrate edilmemişti:** `/kisisel-verilerin-korunmasi/`
için `src/pages/`'de hiçbir dosya yoktu — yalnızca footer/güvenlik
sayfasındaki linkler bu slug'a işaret ediyordu. `pages.json`'da standart
`page` post type'ında bulundu (id 15547 tr → pll_translations ile en
15656/it 23549, **NL yok**). İçerik tek bir `content_block` alanı — TAM,
gerçek, birbirinden FARKLI 3 dilde 16-18 KB'lık düz metin (KARAR 1 sorunu
YOK, hiçbiri kopya değil) — tek istisna IT'nin ham `<title>` alanı
("Information Text Regarding Personal Data&IT" — İngilizce + anlamsız
"&IT" soneki, `GlobalBrand`/`Hakkımızda`'daki "About_IT" ile aynı sınıf
junk) gerçek İtalyanca başlıkla değiştirildi.
- **Yeni mimari:** `extract-misc-pages.mjs`'e 8. grup olarak eklendi
  (`kisisel-verilerin-korunmasi`, `legal` tipi — Tüketici Hakları/Mesafeli
  Satış'la AYNI `LegalPage.astro` yeniden kullanıldı). `miscPagesContent.ts`'e
  `getKvkkContent/Slug/LocaleUrls()`.
- **Route'lar:** `kisisel-verilerin-korunmasi.astro` (tr) + `en/data-use-policy.astro`
  + `it/protezione-dati-personali.astro` (gerçek per-locale slug'lar,
  `link` alanından). NL yok — `astro.config.mjs`'e elle redirect eklendi
  (`/nl/kisisel-verilerin-korunmasi` → `/en/data-use-policy`, EN/IT slug'ı
  TR'den farklı olduğu için otomatik `i18n.fallback` tek başına yetmezdi —
  Tüketici Hakları/Mesafeli Satış/Güvenlik'teki aynı sınıf düzeltme).
- **Bulunan ek bug — Güvenlik sayfasının KVKK linki YANLIŞLIKLA dış link
  sayılıyordu:** `guvenlik` sayfasının 1. maddesinin kaynak URL'i (TR/EN
  ikisi de) TAM (mutlak) bir `https://idenfit.com/...` URL'i taşıyor —
  `SecurityPage.astro`'nun `isExternal()` kontrolü bunu dış link sanıp
  GERÇEK idenfit.com'a `target=_blank` ile gönderiyordu (artık bizim kendi
  sayfamız var, oraya gitmeli). `miscPagesContent.ts`'e `resolveSecurityItemUrl()`
  eklendi — TR/EN/IT'nin 3 farklı KVKK kaynak URL'ini tanıyıp
  `getKvkkSlug(locale)`'e yeniden çözüyor (IT'nin override'ındaki
  `KVKK_BARE_SLUG` sentinel'i de dahil).
- **Footer düzeltmesi:** ABOUT kolonunun `kvkk` anahtarı + alt bar'ın ayrı
  `kvkk` linki artık `SPECIAL_HREFS` haritasından (`getKvkkSlug`) çözülüyor
  — ikisi de önceden sabit `kisisel-verilerin-korunmasi` slug'ını TÜM
  locale'lerde kullanıyordu (EN/IT'de yanlış).

**HATA 4 — "Online Sunum Talebi" butonu 404 veriyordu (sitenin EN
KRİTİK CTA'sı):** Header'ın kırmızı CTA butonu (+ tüm ürün/sektör/hub/donanım
sayfalarının `localizeCtaUrl()` ile çözülen CTA'ları) `online-sunum-talebi`
slug'ına gidiyordu — ama bu slug'a karşılık gelen HİÇBİR sayfa hiçbir
turda kurulmamıştı. **Kök neden ayrıca ilginç bir keşif açığa çıkardı:**
gerçek WP sayfasının TR slug'ı `online-sunum-talep-et` (FARKLI yazım —
"talebi" değil "talep-et") — önceki bir oturum bilinçli olarak TÜM
locale'ler için TEK bir canonical slug (`online-sunum-talebi`) kullanma
kararı almış (`productContent.ts`'in `localizeCtaUrl()`'ü, `sectorContent.ts`,
`hardwareTranslationOverrides.ts` vb. — ONLARCA çağrı noktası) ama sayfanın
KENDİSİNİ hiç kurmamış. Ayrıca gerçek WP verisinde **TR'nin `pll_translations`'ı
EN/IT'ye hiç bağlı değil** (id 15441 yalnızca `{tr:15441}` diyor) — EN/IT
kendi aralarında ayrı, bağlı bir grup (15861/23650, `nl:22735`'i de
işaret ediyor ama o kayıt yerel export'ta yok) — gerçek bir Polylang
bağlantı kopukluğu, `extract-misc-pages.mjs`'in genel `group()` fonksiyonu
bunu yakalayamayacağından ID'ler elle eşlendi (`buildPresentationGroup()`).
- **İçerik:** TR gerçek (page_title/3 bilgi rozeti/"Hemen Ara" telefon
  bloğu/form/entegrasyonlar/referanslar). EN gerçek ama telefon bloğu YOK
  (bilinçli, Türkiye ofis numarası göstermiyor — çeviri eksikliği değil).
  **IT tamamen BOŞTU** (yalnızca page_title/form_title İngilizce, geri
  kalan HER ŞEY boş string) — TR kaynaktan tam İtalyanca çeviri yazıldı
  (`PRESENTATION_IT_OVERRIDE`, `miscPagesTranslationOverrides.ts`).
- **Yeni component — `PresentationRequestPage.astro`:** hero (başlık + 3
  bilgi rozeti + opsiyonel telefon CTA'sı + form, `HeroForm.tsx` yeniden
  kullanıldı) + Entegrasyonlar bloğu + Referanslar bloğu.
- **Route'lar — bilinçli olarak 4 locale'de de AYNI slug (`online-sunum-talebi`):**
  `online-sunum-talebi.astro` + `en/online-sunum-talebi.astro` +
  `it/online-sunum-talebi.astro` (NL kaynakta hiç yok, KARAR 2 gereği yeni
  sayfa üretilmedi — ama bare slug her locale'de AYNI olduğu için otomatik
  `i18n.fallback` (nl→en) manuel redirect gerekmeden doğru çalışıyor,
  Tüketici Hakları'nın aksine).
- **Sonuç:** bu düzeltmeyle birlikte, `localizeCtaUrl()`'ü kullanan
  SİTEDEKİ HER CTA (20+ ürün sayfası, 12 sektör sayfası, hub sayfaları,
  donanım sayfası, ana sayfa, Hedef Global Marka/Neden İdenfit) artık
  gerçekten çalışan bir sayfaya gidiyor — tek bir sayfa eklenerek onlarca
  önceden kırık link düzeldi.

**HATA 5 — Fiyatlar sayfası hiç migrate edilmemişti:** page-inventory'nin
eski notu doğru çıktı — `fiyatlar`/`pricing`/`prijzen`/`prezzi` (4 dilin
4'ü de var, `template-pricing.php` şablonu) hiç route'lanmamıştı. ACF'te
Mikro/KOBİ/Pro 3 katmanlı gerçek bir fiyat tablosu bulundu (fiyatlar,
çalışan aralığı, modül listeleri, 8 özellik + 6 eklenti karşılaştırma
satırı — hepsi gerçek, 4 dilde birbirinden FARKLI kaliteli çeviri,
kopya YOK). Tek gerçek veri hatası: EN/NL/IT'nin `features_title` alanı
yanlışlıkla `packages_title` ile AYNI metni taşıyor ("Packages"/"Pakketten"/
"Pacchetti" — TR'de "Özellikler" (Features) ile "Paketler" (Packages)
doğru ayrı iken, diğer 3 dilde ikisi de "Packages" ailesinden) — düzeltildi.
- **Yeni script — `scripts/extract-pricing.mjs`:** alan adı TUTARSIZLIĞI
  (SME/Pro'nun bazı eklenti/özellik alanları farklı sayfalarda farklı
  adlarla saklanmış — ör. `sme_-_telefoncevrimici_destek` boşken asıl veri
  `sme_-_telefoncevrimici`'de, `sme_-_ai_ise_alim` yerine `sme_-_ai_alim`,
  `sme_bordro`/`sme-lms` alt çizgi yerine tire kullanıyor) `firstDefined()`
  ile TÜM bilinen varyantları sırayla deneyerek çözülüyor.
- **Yeni mimari:** `src/data/pricingContent.ts` — `getPricingContent/Slug/LocaleUrls()`,
  Pro planının CTA'sı `localizeCtaUrl()`'den geçip artık gerçek Online
  Sunum Talebi sayfasına gidiyor (HATA 4'ün düzeltmesiyle otomatik
  çalışıyor). `src/components/PricingPage.astro` — 3 fiyat kartı + özellik/eklenti
  karşılaştırma tabloları + Pro'nun "Tüm Modülleri Gör" aç/kapa'sı **JS
  gerektirmeyen** yerel `<details>/<summary>` ile (projenin "gereksiz JS
  gönderme" ilkesine uygun).
- **Route'lar:** `fiyatlar.astro` + `en/pricing.astro` + `nl/prijzen.astro`
  + `it/prezzi.astro` (4'ü de kaynakta mevcut, gerçek `link` slug'ları).
- **Menü bağlantısı:** `Header.astro`'nun üst-menü "FİYATLAR" linki artık
  `getPricingSlug()` ile per-locale çözülüyor (`neden-idenfit`'teki aynı
  desen, `NAV_SLUG_OVERRIDES` haritasına genelleştirildi). Footer'ın GENEL
  kolonundaki `pricing` anahtarı da `SPECIAL_HREFS`'e eklendi.

**HATA 6 — "Modüller" sayfası araştırıldı: ayrı bir sayfa YOK, HATA 5 ile
aynı sorunun bir parçası.** Kod tabanında bağımsız bir "Modüller"/"Tüm
Modülleri Gör" sayfası/linki aranıp bulunamadı. Gerçek kaynak: footer'ın
GENEL kolonundaki link metni 4 dilde de **"Fiyatlar ve Modüller"/"Pricing
& Modules"/"Prijzen & Modules"/"Prezzi e Moduli"** (`footer.links.general.pricing`)
— "Modüller" kelimesi ayrı bir sayfaya değil, AYNI `fiyatlar` slug'ına
giden link metninin bir parçası. HATA 5 düzeltilince bu link de otomatik
çalışır hale geldi — ayrıca bir işlem gerekmedi. (Fiyatlar sayfasının
kendi içinde Pro planının "Tüm Modülleri Gör" aç/kapa butonu da var, ama o
ayrı bir sayfa değil, `<details>` toggle'ı — HATA 5'in parçası olarak
zaten kuruldu.)

**Test (tamamı):** `astro check` 0 hata. Yeni/düzeltilen 15 URL curl ile
doğrulandı: hero KVKK linkleri 4 dilde doğru hedeflere gidiyor (TR/EN/IT
doğrudan, NL bare-slug+redirect üzerinden), hero görseli gerçek `<img>`
olarak render ediliyor, KVKK sayfası 3 dilde 200 (NL 301→EN), Güvenlik
sayfasının KVKK linki artık internal (dış link değil), Online Sunum
Talebi 3 dilde 200 (NL 302→EN) + Header CTA'sı + tüm sektör/ürün
CTA'larının artık buraya gittiği doğrulandı, Fiyatlar 4 dilde 200 +
EN/IT'nin `featuresTitle` düzeltmesi + footer "Fiyatlar ve Modüller"
linki doğrulandı. Regresyon: `test-urunler-menu-links.mjs` 108/108,
`test-product-language-switch.mjs` 56/56, `test-sector-language-switch.mjs`
36/36, `test-faq-language-switch.mjs` 9/9 — hiçbiri etkilenmedi. `astro
build` 184 sayfa (170 önceki + 3 KVKK + 3 Online Sunum Talebi + 4 Fiyatlar
+ 4 Hakkımızda zaten önceki turdan) hatasız; NL redirect'lerinin
(`dist/nl/kisisel-verilerin-korunmasi/`, `dist/nl/online-sunum-talebi/`)
gerçek `<meta refresh>` ürettiği doğrulandı. `node_modules/.vite` + `dist`
temizlenip dev server temiz yeniden başlatıldı, `_jsxDEV` hata kontrolü
doğrulandı (0).

**Test URL'leri:**
- Ana sayfa (KVKK linki + hero görseli): `http://localhost:4321/`
- KVKK: `/kisisel-verilerin-korunmasi/`, `/en/data-use-policy/`,
  `/it/protezione-dati-personali/` (NL → 301 → EN)
- Online Sunum Talebi: `/online-sunum-talebi/`, `/en/online-sunum-talebi/`,
  `/it/online-sunum-talebi/` (NL → 302 → EN)
- Fiyatlar: `/fiyatlar/`, `/en/pricing/`, `/nl/prijzen/`, `/it/prezzi/`

### ✅ İki bug düzeltildi: SSS dil değiştirici kırığı + Hakkımızda sayfasının hiç migrate edilmemiş olması (2026-07-22)

**HATA 1 — SSS'te dil değiştiriciden EN/IT'ye (gerçekte NL'e) geçince
hata.** Kök neden `dev server logs`'ta (`astro dev logs`) görülen
`[404] /en/sss/` zincirinden bulundu: `/sss/` sayfasındayken switcher'ın
embedded `urls` prop'u incelendiğinde `en`/`it` doğruydu (`/en/faq/`,
`/it/faq/`) ama **`nl` yanlıştı** (`/nl/sss/`). Sebep: `FaqPage.astro`,
`Header.astro`'nun generic "aktif path'in locale önekini soy, hedef
locale'inkiyle değiştir" mantığına `localeUrls` override'ı geçiyor
(`getFaqLocaleUrls()`) — ama bu fonksiyon yalnızca `tr`/`en`/`it` anahtarlarını
set ediyordu (`FAQ_LOCALES` NL'i hiç içermiyor, CPT'de NL kaydı yok).
Merge (`{...generic, ...override}`) sırasında override'da `nl` olmadığı
için Header'ın YANLIŞ generic değeri (`/nl/sss/` — TR'nin bare slug'ı
`sss`, ama gerçek EN/IT slug'ı `faq`, ikisi FARKLI) sızdı. Bu, `/nl/sss/`'e
tıklanınca Astro'nun otomatik `i18n.fallback`'inin (nl→en, aynı bare path
varsayımıyla) var OLMAYAN `/en/sss/`'e yönlenip 404 vermesine yol açıyordu
— Tüketici Hakları/Mesafeli Satış/Güvenlik'teki aynı sınıf bug'ın bir
tekrarı (bkz. aşağıdaki eski bölüm), farklı bir sayfada. **Kullanıcının
"EN veya IT'ye geçince" tarifi muhtemelen NL'i de içeren daha geniş bir
switcher denemesiydi** — EN/IT'nin kendisi hiçbir zaman bozuk değildi,
curl ile doğrulandı.

**Düzeltme:** `src/data/faqContent.ts`'in `getFaqLocaleUrls()`'ü artık
`result.nl = result.en` atıyor — NL'in kendi sayfası olmadığı için (kaynakta
`faq` CPT'sinde NL kaydı yok) dil değiştiricide NL seçeneği doğrudan EN'in
gerçek URL'ine gidiyor, kırık ara-adım (`/nl/sss/` → `/en/sss/` 404) yok.

**Yeni test — `scripts/test-faq-language-switch.mjs`:** SSS tek sayfa
olduğu için zincir yerine TAM MATRİS test ediyor — TR/EN/IT'nin HER
BİRİNİN kendi switcher'ından diğer 3 locale'e (NL dahil) giden URL 200
dönüyor mu. **Sonuç: 9/9 geçiş başarılı.**

**HATA 2 — Hakkımızda sayfası hiç migrate edilmemişti.** `src/pages/`'de
`hakkimizda` için hiçbir dosya yoktu — yalnızca `navigation.ts` (KURUMSAL
kolonu) ve `footer.ts` (ABOUT kolonu, `story` anahtarı) sabit `'hakkimizda'`
slug'ına link veriyordu, arkasında sayfa hiç kurulmamıştı (`astro dev logs`'ta
`[404] /hakkimizda/` doğrulandı). CLAUDE.md'nin önceki turlarda "Hakkımızda
zaten çalışıyor" diye kaydetmesi **yanlıştı** — gerçekte hiç üretilmemiş.

**İçerik araştırması:** `pages.json`'da standart `page` post type'ında
bulundu (CPT değil) — id 9739 (tr) → `pll_translations` ile en (9820)/nl
(20544)/it (23517), 4 dilin 4'ü de var. Şema, Hedef Global Marka/Neden
İdenfit'teki Şema D'yle birebir aynı (`section_1_title/subtitle/cta_text/
cta_url/image` = hero, `section_2_title/text(+text_3)` = tarihçe bloğu,
`section_3_title/image` = ekip fotoğrafı, metin yok) — `extract-misc-pages.mjs`'e
network gerekmeden 7. grup olarak eklendi (`group('hakkimizda', 'productLike',
extractProductLike, 3)`).

**Çeviri kalitesi bulguları (KARAR 1 uygulandı):**
- **TR:** gerçek, tam (tarihçe: Johann Meyer/1878/Berlin/İstanbul anlatısı).
- **NL:** gerçek, tam, kaliteli Hollandaca çeviri — dokunulmadı.
- **EN:** hero gerçekti ama "Our story" bölümünün TARİHÇE paragrafı
  (`section_2_text`) kaynakta TAMAMEN BOŞTU — yalnızca ikinci, gelecek
  odaklı paragraf (`section_2_text_3`) doluydu. TR'nin tarihçe paragrafı
  İngilizce'ye çevrilip başa eklendi (`ABOUT_EN_SECTIONS` override).
- **IT:** TÜM sayfa (hero dahil) kelimesi kelimesine EN'in kopyasıydı
  ("Our goal to become...", "We love being here!" — hiç İtalyanca
  değildi) VE aynı zamanda EN'deki tarihçe-boşluğunu da taşıyordu. TR
  kaynaktan tam İtalyanca çeviri yazıldı (`ABOUT_IT_HERO`/`ABOUT_IT_SECTIONS`).
  Sayfa başlığı (`<title>`) için de WP'nin anlamsız ham başlığı ("About_IT")
  yerine gerçek "Chi Siamo" kullanıldı.

**Yeni mimari:** `src/data/miscPagesContent.ts`'e `getAboutContent/Slug/
LocaleUrls/Title()` eklendi — Hedef Global Marka/Neden İdenfit'teki aynı
desen (`ProductPage.astro` doğrudan yeniden kullanıldı, `faq: []`), ama
generic `getProductLikeContent()` helper'ı yerine bağımsız yazıldı çünkü
yalnızca IT'nin değil EN'in de (kısmi, tek bir bloğun içindeki eksik
paragraf) düzeltilmesi gerekiyordu. Çeviriler
`miscPagesTranslationOverrides.ts`'e eklendi (`ABOUT_EN_SECTIONS`,
`ABOUT_IT_HERO`, `ABOUT_IT_SECTIONS`).

**Route'lar:** `src/pages/hakkimizda.astro` (tr) + `en/about.astro` +
`nl/over.astro` + `it/chi-siamo.astro` (4'ü de kaynakta mevcut, gerçek
`link`'ten türetilen slug'lar — NL'in ham WP slug'ı `over`, "over ons"un
kısaltılmışı, kısa ama gerçek).

**Menü/footer bağlantısı:** `navigation.ts`'e `aboutHref()` yardımcısı
eklendi (mevcut `contactHref()`/`globalBrandHref()` deseniyle aynı),
KURUMSAL kolonundaki "Hakkımızda" linki artık buna bağlı. `Footer.astro`'nun
`SPECIAL_HREFS` haritasına `story: getAboutSlug(...)` eklendi (ABOUT
kolonundaki "Hikayemiz" linki).

**Test:** `astro check` 0 hata. 4 yeni URL curl ile 200 doğrulandı
(`/hakkimizda/`, `/en/about/`, `/nl/over/`, `/it/chi-siamo/`). İçerik
kalitesi spot-check edildi: EN artık Johann Meyer tarihçesini içeriyor,
IT hero/section başlıkları gerçek İtalyanca (EN kopyası değil), NL
dokunulmadan gerçek Hollandaca. KURUMSAL menü + footer ABOUT kolonu 4
dilde de doğru slug'a gidiyor (curl ile ana sayfalardan doğrulandı).
Regresyon: `test-urunler-menu-links.mjs` 108/108, `test-product-language-switch.mjs`
56/56, `test-sector-language-switch.mjs` 36/36 — hiçbiri etkilenmedi.
`astro build` 174 sayfa (170 önceki + 4 Hakkımızda) hatasız; NL'in FAQ
redirect'i (`dist/nl/faq/index.html`) ve 4 yeni Hakkımızda dosyası
(`dist/hakkimizda/`, `dist/en/about/`, `dist/nl/over/`, `dist/it/chi-siamo/`)
gerçekten üretildiği doğrulandı. `node_modules/.vite` + `dist` temizlenip
dev server temiz yeniden başlatıldı, `_jsxDEV` hata kontrolü doğrulandı (0).

**Test URL'leri:**
- SSS dil değiştirici: `http://localhost:4321/sss/` üzerinden EN/NL/IT'ye
  geçiş artık hepsi çalışıyor (NL → `/en/faq/`'e gidiyor, kendi sayfası yok).
- Hakkımızda: `/hakkimizda/`, `/en/about/`, `/nl/over/`, `/it/chi-siamo/`

### ✅ SSS sayfası yeniden tasarlandı (accordion → sekmeli) + KURUMSAL 4/4 + 6 yeni sayfa (2026-07-22)

Aynı gün içinde önce `faq` CPT'sinden accordion tabanlı bir SSS sayfası
kurulmuştu (bkz. hemen aşağıdaki "Footer alt bar düzeltildi + SSS sayfası
`faq` CPT'sinden kuruldu" bölümü — **artık kısmen tarihi**, SSS'in
component/render kısmı bu turda değiştirildi, veri katmanı/route'lar aynı
kaldı). Kullanıcı gerçek `idenfit.com/sss/` sayfasının tasarımını daha
yakından inceleyip iki düzeltme + kalan sayfalar planı istedi.

**DÜZELTME 1 — SSS: accordion kaldırıldı, gerçek sekmeli tasarıma
geçildi.** Canlı sayfanın CSS/JS'i incelenip birebir mantığı çıkarıldı:
- **Sol kolon:** 6 kategori butonu (Genel/Ödeme/Kurulum ve Sözleşme/
  Müşteri Deneyimi Merkezi/Data Güvenliği/Üyelik ve Cayma Hakkı), her biri
  gerçek bir inline SVG ikonla; aktif buton `group-[.is-active]:text-brand`
  (Tailwind arbitrary-variant) ile vurgulanıyor — React state değil, salt
  CSS class toggle.
- **Sağ kolon:** seçili kategorinin TÜM soru/cevapları **doğrudan açık**
  gösteriliyor (accordion/`<details>` yok, direkt okunabilir liste) —
  `<details>` tamamen kaldırıldı.
- **Üstte:** "PDF İNDİR" butonu — TR/EN/IT'nin gerçek, kaynak sitede var
  olan PDF URL'lerini kullanıyor (`sss-1.pdf`/`faq.pdf`/`faq.pdf`).
- **JS:** yeni `src/scripts/faq-tabs.js` (vanilla, React değil — projenin
  "gereksiz JS gönderme" ilkesine uygun), canlı sitenin
  `classList.add("active")` mantığının birebir portu. `FaqPage.astro`
  tamamen yeniden yazıldı; `getFaqCategories()`/`getFaqSlug()`/
  `getFaqLocaleUrls()` (veri katmanı, `faqContent.ts`) **değişmedi**.
- Yeni i18n anahtarı: `t.faqPage.pdfLabel` (4 dilde gerçek çeviri — "PDF
  İNDİR"/"PDF DOWNLOAD"/"PDF DOWNLOADEN"/"Scarica PDF").
- **Test:** 3 dilin (tr/en/it) hepsinde `<details>` sayısı 0, 6
  `faq-tab-btn` (occurrence-count ile doğrulandı — `grep -c` minifiye
  tek-satır HTML'de yanıltıcı "1" veriyor, `grep -o | wc -l` kullanıldı),
  doğru PDF linki curl ile doğrulandı.

**DÜZELTME 2 + KALAN SAYFALAR — KURUMSAL menüsü artık 4/4 tamamlandı.**
KURUMSAL'ın 4 linkinden (Hakkımızda, İletişim, S.S.S, Hedef Global Marka)
önceden yalnızca 2'si (Hakkımızda + S.S.S, SSS aynı gün içinde önceki
adımda kurulmuştu) çalışıyordu. Bu turda **İletişim** ve **Hedef Global
Marka** kuruldu — KURUMSAL artık **4/4**. Ayrıca kullanıcının istediği
öncelik sırasıyla 4 sayfa daha (toplam 6 yeni sayfa grubu) üretildi:

1. **İletişim** (`iletisim`) — tr/en/it/**nl** (4 dilin hepsi kaynakta
   gerçekten var, bkz. aşağıdaki NL bulgusu). Yeni `ContactPage.astro`:
   hero + telefon/e-posta + ofis listesi + form (`HeroForm.tsx` yeniden
   kullanıldı, `idPrefix="contact"`, `t.cta.submit` genel "Gönder" etiketi
   — hero'nun demo'ya özel CTA'sından bilinçli olarak ayrı). Hero
   görseli/harita/video **kapsam dışı bırakıldı** (basitleştirme kararı,
   component içinde yorum olarak not düşüldü).
   - **Önemli düzeltme (önceki bir turun yanlış tespiti):** CLAUDE.md'de
     daha önce NL İletişim "sistemik boşluk" (yalnızca "duyurular" sayfası,
     gerçek iletişim değil) diye kaydedilmişti. Bu turda canlı
     `/nl/mededelingen/` sayfası hem ACF hem gerçek render edilmiş metin
     üzerinden yeniden incelendi: **tam, kaliteli, gerçek bir Hollandaca
     iletişim sayfası** ("Neem contact met ons op", gerçek telefon
     "+31 6 27436201", çevrilmiş ofis adları/adresleri) — sadece WP'nin
     slug'ı yanıltıcıydı (`iletisim` değil `mededelingen`). Bu, projenin
     "önce yanlış negatif, sonra düzeltme" örüntüsünün bir tekrarı daha
     (sektörler/Puantaj/hub sayfalarıyla aynı sınıf). **Kaynak: `link`
     alanı, `slug` değil** — kural burada da doğrulandı.
2. **Tüketici Hakları Sözleşmesi** (`sozlesme/tuketici-haklari`) —
   tr/en/it (**NL kaynakta yok**, KARAR 2 gereği yeni sayfa üretilmedi).
   Yeni `LegalPage.astro` (başlık + `set:html={content.contentHtml}`,
   prose-benzeri Tailwind child-selector'ları — `ProductPage.astro`'ya
   zorla uydurulmadı, kullanıcının açık talimatı buydu). Footer'ın
   `consumerRights` linki artık buraya bağlı.
3. **Mesafeli Satış Sözleşmesi** (`sozlesme/mesafeli-satis-sozlesmesi`) —
   tr/en/it (NL yok). Aynı `LegalPage.astro`. **Kobi/mikro TR
   varyantları bu turda YAPILMADI** (Elementor `content.rendered`
   parse'ı gerektiriyor, `content_block` ACF alanı yok — kullanıcının
   önceliklendirdiği kapsamın dışında bırakıldı, TODO'ya eklendi).
4. **Güvenlik** (`guvenlik`) — tr/en/it (NL yok). Yeni `SecurityPage.astro`
   (numaralı `<ol>`, her madde opsiyonel bir linke gidiyor — internal
   linkler `getRelativeLocaleUrl()` ile, external PDF'ler `target=_blank`).
   İlk madde TR'de KVKK Aydınlatma Metni'ne (`kisisel-verilerin-korunmasi`)
   linkliyor — **bu sayfa henüz kurulmadı**, link şimdilik 404 verecek
   (projenin "henüz kurulmamış sayfaya referans" öngörülen deseniyle
   tutarlı, TODO'ya not edildi).
5. **Hedef Global Marka** (`hedef-global-marka`) — tr/en/**nl**/it (4 dilin
   hepsi kaynakta var). `ProductPage.astro` **yeniden kullanıldı**
   (hero+sections şeması zaten uyuyordu, `faq: []` ile SSS'siz) — KURUMSAL
   menüsündeki eksik son link buydu, artık **KURUMSAL 4/4 tamamlandı**.
6. **Neden İdenfit** (`neden-idenfit`) — tr/en/nl/it (4 dilin hepsi var).
   Aynı desen, `ProductPage.astro` yeniden kullanıldı (hero + 6 section).
   Ana sayfanın Video bölümünün CTA'sı zaten buraya link veriyordu, artık
   gerçek sayfa var. Header'ın üst-menü "NEDEN İDENFİT" linki de
   per-locale gerçek slug'a bağlandı (`getWhyIdenfitSlug()`).

**Yeni script — `scripts/extract-misc-pages.mjs`:** network yok (6 sayfa
grubu da standart `pages.json`'da), Şema D (`section_N_title/text/image`)
extraction'ı yeniden kullanıldı. Çıktı: `reference/wordpress-export/misc-pages.json`.

**Yeni mimari:**
- `src/data/miscPagesContent.ts` — `getContactContent/Slug/LocaleUrls()`,
  `getLegalContent/Slug/LocaleUrls(trSlug, locale)` (+ `CONSUMER_RIGHTS_TR_SLUG`/
  `DISTANCE_SALES_TR_SLUG` sabitleri), `getSecurityItems/Slug/LocaleUrls()`,
  `getGlobalBrandContent/Slug/LocaleUrls/Title()`, `getWhyIdenfitContent/Slug/LocaleUrls/Title()`.
  Tüm CTA URL'leri `productContent.ts`'in `localizeCtaUrl()`'ünden geçiyor
  (kod tekrarı yok, aynı `DEMO_CTA_URL` sentinel deseni).
- `src/data/miscPagesTranslationOverrides.ts` — KARAR 1 kuralına göre
  gerçek IT çevirisi: İletişim (ofis adları dahil), Güvenlik (6 madde),
  Hedef Global Marka (hero+section), Neden İdenfit (hero+6 section) —
  hepsi EN'in ham kopyasıydı, TR kaynaktan yeniden çevrildi. Tüketici
  Hakları/Mesafeli Satış'ın IT'si **zaten gerçekti**, override
  gerekmedi.

**Footer/mega-menü/nav güncellemeleri (KURUMSAL/GENEL/ABOUT linkleri
artık per-locale doğru slug'a gidiyor):**
- `navigation.ts` — KURUMSAL kolonuna `contactHref()`/`globalBrandHref()`
  yardımcıları eklendi (mevcut `faqHref()` deseniyle aynı).
- `Header.astro` — üst-menü "Neden İdenfit" linki `getWhyIdenfitSlug()`
  ile çözülüyor.
- `Footer.astro` — önceki tek-özel-durum (`faqHref`, yalnızca GENEL
  kolonunun `faq` anahtarı için) yerine ölçeklenebilir bir
  `SPECIAL_HREFS: Partial<Record<string, string>>` haritası kondu —
  `contact`/`security`/`globalBrand` (ABOUT kolonu) + `faq`/`consumerRights`/
  `distanceSalesAgreement`/`advantages` (GENEL kolonu) hepsi bu haritadan
  çözülüyor, geri kalan linkler (PRODUCT kolonu, ABOUT'un `story`/`blog`/
  `kvkk`'ı vb.) hâlâ generic `l(item.slug)` kullanıyor — yalnızca gerçek
  per-locale slug'ı farklı olan anahtarlar haritaya eklendi.

**⚠️ Bulunan ve düzeltilen bug — Astro'nun otomatik `i18n.fallback`'i,
per-locale slug'ı FARKLI sayfalarda kırık redirect üretiyordu:** Tüketici
Hakları/Mesafeli Satış/Güvenlik'in NL'i yok, otomatik `fallback: {nl:'en'}`
devreye girmesi bekleniyordu — ama bu 3 sayfanın EN slug'ı TR'den FARKLI
(ör. Tüketici Hakları TR'de `sozlesme/tuketici-haklari`, EN'de
`contract/consumer-rights`). Astro'nun otomatik fallback mekanizması
locale'ler arasında AYNI bare path'i varsayıyor — bu yüzden
`/nl/sozlesme/tuketici-haklari/`'i var OLMAYAN `/en/sozlesme/tuketici-haklari/`'e
yönlendirip zincirleme 404 üretiyordu (curl ile doğrulandı, düzeltmeden
önce). **Çözüm:** `astro.config.mjs`'e Astro'nun statik `redirects`
config'i eklendi — bu 3 sayfa için doğru gerçek EN hedefine giden elle
redirect tanımlandı (`/nl/sozlesme/tuketici-haklari` → `/en/contract/consumer-rights`
vb.). Diğer tüm NL fallback'leri (slug'lar locale'ler arasında aynı
olduğu için) hâlâ otomatik mekanizmayla çalışıyor, bu üç istisna dışında
hiçbir şey değişmedi. **Ders:** bundan sonra bir sayfanın per-locale
slug'ları birbirinden FARKLIYSA ve bir locale'de o sayfa hiç yoksa,
otomatik `i18n.fallback`'e güvenilmeden önce hedef locale'in gerçek
slug'ının bare path'le eşleştiği doğrulanmalı — eşleşmiyorsa elle
`redirects` girdisi gerekir.

**Test (tamamı):** `astro check` 0 hata. 21 yeni URL'nin tamamı (6 sayfa
grubu × ortalama 3.5 dil) curl ile 200 doğrulandı. 3 NL-fallback
redirect'i (Tüketici Hakları/Mesafeli Satış/Güvenlik) artık doğru gerçek
EN hedefine 301 dönüyor (curl + `dist/nl/.../index.html`'in gerçek
`<meta refresh>` hedefiyle doğrulandı). NL İletişim/Hedef Global
Marka/Neden İdenfit'in kendi gerçek NL içerikleriyle (redirect değil)
render edildiği doğrulandı. İçerik kalitesi curl ile spot-check edildi:
NL İletişim gerçek Hollandaca telefon/başlık, IT Güvenlik/Hedef Global
Marka/Neden İdenfit/İletişim hepsi gerçek İtalyanca (EN kopyası değil).
Regresyon: `test-urunler-menu-links.mjs` 108/108,
`test-product-language-switch.mjs` 56/56, `test-sector-language-switch.mjs`
36/36 — hiçbiri etkilenmedi. `astro build` 170 sayfa hatasız; ardından
`node_modules/.vite` + `dist` temizlenip dev server temiz yeniden
başlatıldı, `_jsxDEV` hata kontrolü doğrulandı (0).

**Test URL'leri (yeni 6 sayfa grubu):**
- İletişim: `/iletisim/`, `/en/contact/`, `/it/contatti/`, `/nl/mededelingen/`
- Tüketici Hakları: `/sozlesme/tuketici-haklari/`, `/en/contract/consumer-rights/`,
  `/it/contratto/diritti-dei-consumatori/` (NL → 301 → EN)
- Mesafeli Satış: `/sozlesme/mesafeli-satis-sozlesmesi/`,
  `/en/contract/distance-sales-contract/`,
  `/it/contratto/contratto-di-vendita-a-distanza/` (NL → 301 → EN)
- Güvenlik: `/guvenlik/`, `/en/security-policy/`, `/it/politica-di-sicurezza/`
  (NL → 301 → EN)
- Hedef Global Marka: `/hedef-global-marka/`, `/en/global-brand/`,
  `/nl/wereldwijd-merk/`, `/it/marchio-globale/`
- Neden İdenfit: `/neden-idenfit/`, `/en/why-idenfit/`, `/nl/waroom-idenfit/`,
  `/it/perche-idenfit/`

**Sayfa envanteri durumu (güncellenmiş özet):** page-inventory.md'nin
170 sayfalık A/B/C/D kategorilerinden artık şunlar tamamlandı: Ana Sayfa
(12/12 bölüm), 21 modül/ürün sayfası (PDKS+Bordro+İzin+Performans+
Onboarding+İşe Alım+7 "temiz"+Puantaj+2 hub), 12 sektör sayfası, Müşteriler,
Hakkımızda, SSS, ve şimdi **İletişim + Tüketici Hakları + Mesafeli Satış
(temel varyant) + Güvenlik + Hedef Global Marka + Neden İdenfit**.
**KURUMSAL menüsü artık 4/4 tamamlandı** (Hakkımızda/İletişim/S.S.S/Hedef
Global Marka). Kalan bilinen açık kalemler: KVKK Aydınlatma Metni
(`kisisel-verilerin-korunmasi` — Güvenlik sayfasının 1. maddesi buna
linkliyor), Mesafeli Satış'ın kobi/mikro TR varyantları, Gizlilik ve
Güvenlik Politikası (`sozlesme/gizlilik-ve-guvenlik-politikasi` — footer
alt barında zaten linkleniyor ama sayfası henüz yok), Fiyatlar, ve
blog/İK Akademi gibi büyük içerik kütleleri — bkz. `docs/page-inventory.md`.

### ✅ Footer alt bar düzeltildi + SSS sayfası `faq` CPT'sinden kuruldu (2026-07-22)

**KARAR 1 — Footer alt bar "Kullanım Koşulları" araştırması sonucu
uygulandı:** idenfit.com'un canlı `<footer>` elementi baştan sona
incelendi (yalnızca "Copyright" satırının çevresi değil, TÜM anchor'lar).
Sonuç: **kaynak sitede alt barda AYRI bir yasal-link satırı hiç yok** —
gerçek footer yalnızca düz "© Copyright idenfit, 2026" metni gösteriyor.
Önceki `privacy`/`kvkk`/`terms` 3'lüsü tamamen bizim eklediğimiz bir
konvansiyondu (CLAUDE.md'de zaten şüphelenilmişti, şimdi kesinleşti):
- **`terms` ("Kullanım Koşulları") kaldırıldı** — kaynakta bu isimle ayrı
  bir sayfa/link yok, ayrıca GENEL kolonunda zaten "Tüketici Hakları
  Sözleşmesi" (`consumerRights`) var — ikisini de göstermek kafa
  karıştırıcı olurdu (kullanıcının önceden işaret ettiği risk, doğrulandı).
- **`privacy` ("Gizlilik Politikası") KALDIRILMADI, düzeltildi** — bu,
  `terms`'ten farklı bir durum: gerçek, ayrı bir "Gizlilik ve Güvenlik
  Politikası" sayfası kaynakta VAR (`sozlesme/gizlilik-ve-guvenlik-politikasi`),
  yalnızca slug'ımız yanlıştı (`gizlilik-politikasi` diye bir sayfa yok).
  Gerçek slug'a düzeltildi.
- **`kvkk`** zaten doğruydu (kaynakta ABOUT kolonunda var), dokunulmadı.

`src/data/footer.ts`, `src/components/Footer.astro`, `src/i18n/types.ts`
+ 4 dil dosyasından `terms` alanı temizlendi. Alt bar artık 2 link
gösteriyor: Gizlilik Politikası (doğru slug) + KVKK.

**KARAR 2 — SSS yapısı araştırması + uygulaması:** Canlı `idenfit.com/sss/`
incelendi (tam gövde metni + JSON-LD + widget tipleri). Kesin sonuç:
sayfanın kendi ACF `question_N`/`answer_N` alanları TAMAMEN BOŞ — TÜM
görünen sorular **`faq` custom post type'ından** geliyor (90 kayıt, TR/EN/IT
30'ar, kategorilere göre gruplanmış düz liste — Elementor accordion
widget'ı YOK). Kanıt: sayfadaki soruların 29/30'u (TR) `faq` CPT'sindeki
kayıtlarla birebir metin eşleşmesiyle doğrulandı (ör. "idenfit nedir?" →
CPT id 12585, slug ilginç şekilde `test`). Kategori başlıkları (Genel/
Ödeme/Kurulum ve Sözleşme/Müşteri Deneyimi Merkezi/Data Güvenliği/Üyelik
ve Cayma Hakkı) `faq-category` taxonomy'sinin gerçek terimleriyle
(`wp/v2/faq-category`) birebir örtüşüyor.

**Yeni script — `scripts/fetch-faq.mjs`:** `wp/v2/faq` (90 kayıt) +
`wp/v2/faq-category` (18 terim, 6×3 dil) çekip
`reference/wordpress-export/faq.json`'a yazıyor. `faq` CPT'sinde Polylang
REST alanları (`pll_language`) AÇIK DEĞİL (pages/sectors'ın aksine) — dil,
`link` URL'sinin locale önekinden türetiliyor. Kategori sırası: her dilde
term id'leri artan sırada gerçek sitedeki görünüm sırasıyla birebir
örtüşüyor (TR 158→168, EN 170→181, IT 1085→1099), bu yüzden `id`'ye göre
sıralanıyor. **NL hiç yok** (CPT'de NL girdisi yok, sistemik boşluk
örüntüsüyle tutarlı).

**Yeni mimari:**
- `src/data/faqContent.ts` — `getFaqCategories(locale)` (kategori adı +
  soru/cevap listesi), `getFaqSlug(locale)`, `getFaqLocaleUrls()`.
- `src/components/FaqPage.astro` — kategori başlığı + altında
  `<details>`/`<summary>` accordion listesi (ProductPage.astro'nun SSS
  bölümüyle AYNI görsel dil — kaynak düz liste kullansa da, 30 soruluk
  bir sayfada accordion daha kullanılabilir, kullanıcı esneklik vermişti).
  **⚠️ Bu component artık tarihi — aynı gün, hemen yukarıdaki "SSS sayfası
  accordion'dan sekmeli tasarıma geçti" bölümünde tamamen yeniden
  yazıldı** (accordion kaldırıldı, sol kategori sekmesi + sağ doğrudan-açık
  liste + PDF butonuna geçildi). Veri katmanı (`faqContent.ts`) ve
  route'lar değişmedi, yalnızca bu component.
- **Route'lar:** `src/pages/sss.astro` (tr) + `en/faq.astro` + `it/faq.astro`
  — NL için ayrı dosya YOK, `i18n.fallback` mekanizması otomatik
  `/nl/faq/` → `/en/faq/` redirect'i üretiyor (build'de doğrulandı:
  `dist/nl/faq/index.html` gerçek bir `<meta refresh>` redirect sayfası).

**Bulunan ve düzeltilen ek bug — mega-menü/footer'ın SSS linkleri
sabit `'sss'` slug'ı kullanıyordu:** ÜRÜNLER intro'sunun "Sıkça Sorulan
Sorular" linki, KURUMSAL kolonunun "S.S.S" linki ve footer'ın GENEL
kolonundaki "Sıkça Sorulan Sorular" linki — üçü de daha önce tüm
locale'lerde aynı `'sss'` slug'ını kullanıyordu (EN/IT'de gerçek slug
`faq`, bu yüzden `/en/sss/` gibi var olmayan bir URL üretiyorlardı).
`navigation.ts`'e `faqHref()` yardımcı fonksiyonu (hub'lardaki desenle
aynı, NL için EN'e düşüyor), `Footer.astro`'ya da GENEL kolonunun `faq`
anahtarı için özel bir çözümleme eklendi — üçü de artık doğru per-locale
slug'a gidiyor.

**Test:** `astro check` 0 hata, `astro build` 149 sayfa (146 önceki + 3
yeni SSS route) hatasız. 3 dilin 3'ünde de (tr/en/it) 6 kategori + 30
`<details>` doğrulandı — kategori adları doğru dilde. NL `/nl/faq/` 302
ile `/en/faq/`'e yönleniyor (curl + `dist/nl/faq/index.html` ile
doğrulandı). Mega-menü + footer SSS linkleri 4 dilde de doğru slug'a
çözülüyor (`/sss/`, `/en/faq/`, `/it/faq/`, `/nl/faq/`→redirect).
Regresyon: `test-urunler-menu-links.mjs` 108/108, `test-product-language-switch.mjs`
56/56, `test-sector-language-switch.mjs` 36/36, ana sayfa 12/12 bölüm —
hiçbiri etkilenmedi. `node_modules/.vite` temizlenip dev server temiz
yeniden başlatıldı, `_jsxDEV` hata kontrolü doğrulandı (0).

**Test URL'leri:**
- TR: `http://localhost:4321/sss/`
- EN: `http://localhost:4321/en/faq/`
- IT: `http://localhost:4321/it/faq/`
- NL: `http://localhost:4321/nl/faq/` (302 → `/en/faq/`)

### ✅ Ana sayfa TAMAMLANDI — 12/12 bölüm (GRUP 3: Suprema + Testimonial Carousel + HRTech Alliance) (2026-07-22)
`docs/homepage-sections-report.md`'deki 12 bölümlük keşif raporunun
SONUNCU 3 bölümü de üretildi. **Ana sayfa artık hero dahil 12/12 bölümüyle
tamamen migrate edildi** — kaynak sitedeki hiçbir bölüm eksik kalmadı.

1. **`SupremaSection.astro`** — "Temassız Tanımlama & Geçiş Sistemleri" +
   Suprema logosu + "Hardware partner" etiketi + ürün görseli (per-locale).
   **Link kararı:** kaynak sitede `/suprema/` (TR/EN) veya
   `/it/dispositivi-suprema/` (IT) sayfalarına gidiyordu — bunların
   `content.rendered`'ı hâlâ BOŞ (bkz. CLAUDE.md'nin daha önceki "Suprema
   sayfalarının content.rendered'ı boş" notu, migrate edilmedi). Kullanıcı
   kararıyla link artık **gerçekten var olan `/donanim/` sayfasına**
   gidiyor (o sayfa zaten Suprema'yı "Onaylı Markalar" bölümünde marka
   olarak listeliyor, bkz. `hardwareContent.ts`) — per-locale doğru
   çözülüyor (`/en/hardware/`, `/nl/hardware/`, `/it/hardware/`).
2. **`TestimonialCarousel.tsx` + `TestimonialSection.astro`** —
   `/musteriler/`'deki 5 müşteri hikayesinden **tamamen farklı** 2 yeni
   tanık (İsmail Ünal — Zsa Zsa Zsu, Emre Özcan — HAVAİST). Yeni bir
   React component'i yazıldı (`useState` ile index, ok butonlarıyla —
   `lucide-react`'in `ChevronLeft`/`ChevronRight`'ı, MegaMenu.tsx'teki
   gibi — ileri/geri geçiş, alttaki nokta göstergeleri). Sayfanın altında
   olduğu için `client:visible` (hero'nun `client:load`'ının aksine).
   İsim/fotoğraf `homeContent.ts`'de (dile bağlı değil, `customerStories.ts`
   ile aynı ilke), alıntı metni + unvan `i18n`'de (Emre Özcan'ın unvanı
   dile göre gerçekten farklı çevriliyor, ör. EN "Corporate Communications
   Manager").
3. **`HrtechSection.astro`** — "Tüm İK İhtiyaçları İçin Tek Noktadan
   Çözüm" + HRTech Alliance logosu + dış link (`hrtech-alliance.com`,
   4 dilde aynı, yeni sekme) + per-locale görsel.

**Ayrıca (kullanıcının GRUP 2 onayı sırasında bıraktığı açık karar):**
`FeatureGrid.astro`'nun kart stili kaynağın gerçek CSS'ine (`post-9.css`)
göre düzeltildi — görünür `border` + `rounded-2xl` YERİNE yumuşak gölge
(`0 4px 34px rgba(0,0,0,.07)`) + `6px` (`rounded-md`) radius. Kartlar
arasındaki dekoratif "+"/"=" bağlayıcı ikonlar (kaynakta `.plus-box`/
`.equals-box` custom CSS'i, mobilde farklı konumlanan absolute-positioned
SVG'ler) **bilinçli olarak eklenmedi** — salt dekoratif, karmaşıklığı
faydasına değmiyor.

**Ana sayfa artık TAM 12 bölüm:** Hero → LogoStrip → Divider(kırmızı
banner) → Video → FeatureGrid → Divider(kırmızı banner) → Efficiency →
PanelFeature(2. form) → **Suprema** → CertificationBadges →
**TestimonialCarousel** → **HRTech Alliance**.

**Test:** `astro check` 0 hata, `astro build` 146 sayfa (yeni route yok)
hatasız. 4 dilin 4'ünde de curl ile doğrulandı: **12/12 `<section>`**,
Suprema linki doğru per-locale `/donanim/` slug'ına gidiyor, testimonial
carousel'in her iki tanığı da (props JSON'da) mevcut + prev/next label'ları
doğru dilde, HRTech dış linki (3 yerde — logo + başlık altı link + görsel
alanı) doğru. Regresyon: `test-urunler-menu-links.mjs` 108/108,
`test-product-language-switch.mjs` 56/56, `test-sector-language-switch.mjs`
36/36 — hiçbiri etkilenmedi. `node_modules/.vite` temizlenip dev server
temiz yeniden başlatıldı, `_jsxDEV` hata kontrolü doğrulandı (0).

**Test URL'leri:**
- TR: `http://localhost:4321/`
- EN: `http://localhost:4321/en/`
- NL: `http://localhost:4321/nl/`
- IT: `http://localhost:4321/it/`

**⏸️ DURULDU — kullanıcı onayı bekleniyor.** Ana sayfa migrasyonu artık
tamamlandığı için sıradaki adım kullanıcının GRUP 3'ü test edip onaylaması
— onay sonrası ana sayfa migrasyonu resmen kapanacak.

### ✅ Ana sayfa — GRUP 1 tasarım düzeltmeleri + GRUP 2 tamamlandı: Video + "5 Soru" + Kullanıcı Dostu Panel/2. form (2026-07-22)
Kullanıcı ekran görüntüsüyle GRUP 1'in "eksik/düzensiz" göründüğünü
bildirdi. Araştırma (`curl` ile HTML/CSS doğrulaması + idenfit.com'un
GERÇEK canlı CSS'inin — `post-9.css` — indirilip incelenmesi) 3 gerçek
tasarım sadakati sorunu buldu, kullanıcı onayladı, düzeltildi:

1. **`SectionDivider.astro`** — düz koyu metin DEĞİL, kaynaktaki gibi
   TAM GENİŞLİK marka kırmızısı (`bg-brand`) zemin + beyaz, 36px/24px
   (mobil), font-weight 400 metin oldu (`--e-global-color-uicore_accent`
   canlı CSS'te bizim `--color-brand`'ımızla birebir aynı çıktı).
2. **`LogoStrip.astro`** — `grayscale`/`opacity-70` kaldırıldı, kaynakta
   logolar TAM RENKLİ — bizim eklediğimiz soluklaştırma kaynakta hiç
   yoktu, muhtemelen "logolar eksik/gelmemiş" izlenimine yol açıyordu.
3. **`CertificationBadges.astro`** — 7 rozet artık açık pembe (`#FFE5E5`
   — FeatureGrid'in 1. kart ikonuyla AYNI ton, canlı CSS'te doğrulandı),
   `10px` yuvarlak köşeli, padding'li bir kutu İÇİNDE (kaynakta öyleydi,
   ilk implementasyon ikonları çıplak zeminde + gereksiz `opacity-80` ile
   göstermişti).

(FeatureGrid kartlarının border/shadow stili ile kaynaktaki dekoratif
"+"/"=" bağlayıcı ikonları — bkz. aşağıdaki not — kullanıcı tarafından
onaylanmadığı için BU TURDA dokunulmadı, bilinçli olarak ertelendi.)

**GRUP 2 — 3 yeni bölüm üretildi ve TÜM 4 `index.astro` dosyasına eklendi:**
1. **`VideoSection.astro`** — "Neden idenfit?" + gerçek YouTube embed'i
   (`toYoutubeEmbedUrl()`, `customerStories.ts`'ten yeniden kullanıldı —
   `/musteriler/`'deki video kartlarıyla aynı desen, kod tekrarı yok) +
   "Daha Fazla" linki → `neden-idenfit` (nav.ts'teki mevcut slug, sayfa
   henüz migrate edilmedi — üst menüdeki gibi şimdilik 404, bilinen durum).
2. **`EfficiencySection.astro`** — "Verimliliği Ölçen 5 Soru" + per-locale
   ekran görüntüsü.
3. **`PanelFeatureSection.astro`** — "Kullanıcı Dostu Panel" + 3 öğelik
   ikon listesi + dashboard mockup görseli + **hero'yla AYNI alanlara
   sahip 2. bir lead-capture form**. Yeni component YAZILMADI —
   `HeroForm.tsx` doğrudan yeniden kullanıldı, yalnızca yeni bir
   `idPrefix?: string` prop'u eklendi (varsayılan `'hf'`, eski davranış
   korunur) — bu olmadan aynı sayfada 2. form aynı `id="hf-fullName"` vb.
   üretip `<label htmlFor>` eşleşmesini kırardı. Panel formu sayfanın
   altında olduğu için `client:visible` kullanıldı (hero'nun `client:load`'ının
   aksine, gecikmeli hydrate — performans).

**Kullanıcının raporladığı 2 küçük veri hatası da düzeltildi
(`src/data/homeContent.ts`):**
- **IT'nin videosu** TR'ninkiyle (Türkçe) aynıydı → artık EN/NL ile aynı
  (İngilizce, en azından anlaşılır) videoyu kullanıyor.
- **"5 Soru" bölümünün IT görseli** TR'nin ekran görüntüsünü
  `alt="efficiency tr"` ile kullanıyordu (canlı idenfit.com/it/'de HÂLÂ
  böyle — kaynağın kendi hatası) → artık EN'in görseli + gerçek İtalyanca
  alt metniyle düzeltildi.

**Ana sayfa artık 9 bölüm:** Hero → LogoStrip → Divider(kırmızı banner) →
Video → FeatureGrid → Divider(kırmızı banner) → Efficiency → PanelFeature
(2. form) → CertificationBadges. Suprema partner vurgusu, testimonial
carousel, HRTech Alliance hâlâ GRUP 3'e ertelendi.

**Test:** `astro check` 0 hata, `astro build` 146 sayfa (yeni route yok,
yalnızca 4 index.astro + yeni component'ler) hatasız. 4 dilin 4'ünde de
curl ile doğrulandı: 9 `<section>`, video embed ID'leri doğru
(IT artık `iEQ_lep-ZY8`, TR hâlâ `N4cuH5AdDmg`), efficiency görseli doğru
(IT artık `home-efficiency-en-*`), 8 form input id'si çakışmasız
(`hf-*` × 4 + `panel-*` × 4), kırmızı banner ayraçlar + tam renkli logo
şeridi + pembe rozet kutusu render ediliyor. Regresyon:
`test-urunler-menu-links.mjs` 108/108, `test-product-language-switch.mjs`
56/56, `test-sector-language-switch.mjs` 36/36 — hiçbiri etkilenmedi.
`node_modules/.vite` temizlenip dev server temiz yeniden başlatıldı,
`_jsxDEV` hata kontrolü doğrulandı (0).

**Test URL'leri:**
- TR: `http://localhost:4321/`
- EN: `http://localhost:4321/en/`
- NL: `http://localhost:4321/nl/`
- IT: `http://localhost:4321/it/`

**⏸️ DURULDU — kullanıcı onayı bekleniyor.** GRUP 3'e (Suprema partner
vurgusu, testimonial carousel, HRTech Alliance) onay olmadan geçilmeyecek.
Ayrıca FeatureGrid kartlarının kaynaktaki tam stiliyle (border yerine
yumuşak gölge, 6px radius, "+"/"=" dekoratif bağlayıcı ikonlar)
hizalanıp hizalanmayacağı da kullanıcıyla netleşmeli.

### ✅ Ana sayfa — GRUP 1 tamamlandı: Logo şeridi + Özellik Grid'i + Sertifika Rozetleri + 2 Ayraç (2026-07-22)
`docs/homepage-sections-report.md`'deki 12 bölümlük keşiften sonra,
kullanıcının seçtiği en basit/güvenli 4 bölüm (GRUP 1) kademeli rollout'un
ilk turu olarak üretildi: **Müşteri logo şeridi** (§2), **4'lü özellik
kartı grid'i** (§5), **Sertifika/kalite rozet şeridi** (§10), **2 ayraç
başlığı** (§3, §6). Video (§4), "5 Soru" (§7), "Kullanıcı Dostu Panel" +
2. form (§8), Donanım partner vurgusu (§9), testimonial carousel (§11),
HRTech Alliance (§12) **kasıtlı olarak bu turda YAPILMADI** — sonraki
gruplarda ele alınacak (bkz. §"Yapılacaklar (TODO)").

**İçerik sırası (index.astro'da, hero'dan sonra):** LogoStrip →
SectionDivider (#3'ün metni) → FeatureGrid → SectionDivider (#6'nın metni)
→ CertificationBadges. Ayraçlar orijinal sıradaki komşu içerik bloklarının
(video, "5 Soru") hemen önünde duruyordu — bu bloklar bu turda atlandığı
için ayraçlar bir sonraki GERÇEKTEN üretilen bloğun önüne "serpiştirildi"
(kullanıcının talimatı), orijinal bağıl sıra bozulmadı.

**Yeni component'ler (hepsi `src/components/`):**
- `LogoStrip.astro` — başlık cümlesi + 7 müşteri logosu (Migros One, Acun
  Medya, Kellogg's, Ferre, Tuğba, Civil, Caribou — grayscale, hover'da
  renkleniyor).
- `FeatureGrid.astro` — başlık + intro + 4 kart (Zaman ve İzin Yönetimi /
  Performans Yönetimi / Çalışan Deneyimi / İnsan Kaynakları Analitiği).
  İkonlar idenfit.com'dan birebir kopyalanan 4 GERÇEK inline SVG (pembe/
  yeşil/sarı/mor daire zeminli marka ikonları) — ayrı bir dosyaya
  çıkarılmadı, yalnızca bu component içinde kullanıldığı için.
- `CertificationBadges.astro` — 2 satırlı başlık ("Bulut Teknolojisi &
  Kalite Standartları") + ISO 27001/9001'den bahseden paragraf + 7 rozet
  ikonu.
- `SectionDivider.astro` — tek satır ayraç başlığı, 2 kez kullanıldı.

**Sertifika rozetlerinin `alt` metni — bilinçli karar:** 7 rozetin
(`icon5.svg`..`icon11.svg`) kaynak sitedeki `alt` metni zaten anlamsız
(`"icon5"` vb.) ve SVG path'leri fetch edilip incelendiğinde (gerçek
internet erişimiyle, `curl idenfit.com/wp-content/uploads/...`) hangi
spesifik sertifika/teknolojiyi temsil ettikleri güvenilir şekilde teşhis
edilemedi (ör. `icon5` bir "+MORE" yazısı+ok gibi duruyor, `icon6` bir
kilit ikonu+dönük metin gibi duruyor — kesin marka/standart adı okunamıyor).
**Karar: uydurma bir sertifika adı yazmak yerine (`alt="ISO 27001 rozeti"`
gibi doğrulanamamış bir iddia) rozetler dekoratif kabul edildi (`alt=""`,
`aria-hidden="true"`)** — ISO 27001/9001 bilgisi zaten yanındaki gerçek
paragraf metninde erişilebilir şekilde duruyor. `FeatureGrid`'in 4 ikonu
bu kategoriye girmiyor çünkü onlar path/renk bazında anlamı net kartlarla
(başlık+metin) eşleşen gerçek illüstrasyonlar, isimsiz üçüncü taraf
rozetleri değil.

**Bulunan ve düzeltilen gerçek bug — 4 ayrı `index.astro` dosyası
var, yalnızca TR'sini güncellemek yetmedi:** Bu proje ana sayfa için
`getStaticPaths()` tabanlı TEK bir dinamik route KULLANMIYOR — sitenin
geri kalanındaki (`musteriler.astro` vb.) desenle aynı şekilde, **4 ayrı
statik dosya var**: `src/pages/index.astro` (tr), `en/index.astro`,
`nl/index.astro`, `it/index.astro`. İlk implementasyonda yalnızca TR
dosyası güncellenip dev server test edildiğinde TR'de 6 bölüm (Hero+4 yeni)
görünürken EN/NL/IT'de hâlâ yalnızca Hero (1 bölüm) render edildiği fark
edildi — hiçbir hata/500 yoktu, sayfalar sessizce eksik render ediliyordu
çünkü o 3 dosya hâlâ eski (yalnızca `<HeroSection />`) içeriği taşıyordu.
Üç dosya da aynı 5 import + 5 component çağrısıyla güncellenip düzeltildi.
**Ders:** bu sitede locale-özel bir sayfa güncellenirken TEK dosya (TR)
değil, o sayfanın 4 dildeki TÜM kopyaları güncellenmeli — bu proje ana
sayfa/`musteriler` gibi sayfalarda `getStaticPaths()` kullanmıyor, her
locale kendi dosyasını tutuyor.

**Çeviri:** Yeni `src/i18n/types.ts`'in `HomeLabels` şeması
(`logoStrip`/`dividers`/`featureGrid`/`certifications`) — 4 dilde de
`content.rendered` Elementor HTML'inden elle transkripsiyon edildi (KEŞFET
mega-menüsünde uygulanan yöntemin aynısı). Görsel URL'leri/logo isimleri
gibi dile bağlı olmayan veri `src/data/homeContent.ts`'de (`CUSTOMER_LOGOS`,
`CERTIFICATION_BADGE_URLS` — 4 dilde aynı, WP medya kütüphanesinde ayrı
görsel yok).

**Test:** `astro check` 0 hata, `astro build` 146 sayfa (yeni route yok,
yalnızca 4 index.astro güncellendi) hatasız. Düzeltmeden SONRA 4 dilin
4'ünde de curl ile doğrulandı: 6 `<section>` (Hero+LogoStrip+Divider+
FeatureGrid+Divider+CertBadges), 7 logo, 7 rozet ikonu, ayraç başlıklarının
gerçek çevirileri. Regresyon: `scripts/test-urunler-menu-links.mjs` 108/108,
`test-product-language-switch.mjs` 56/56, `test-sector-language-switch.mjs`
36/36 — hiçbiri etkilenmedi. `node_modules/.vite` temizlenip dev server
temiz yeniden başlatıldı, `astro-island` sayısı (21, regresyon yok) +
`_jsxDEV` hata kontrolü doğrulandı.

**Test URL'leri (ekran görüntüsü için):**
- TR: `http://localhost:4321/`
- EN: `http://localhost:4321/en/`
- NL: `http://localhost:4321/nl/`
- IT: `http://localhost:4321/it/`

**⏸️ DURULDU — kullanıcı onayı bekleniyor.** GRUP 2'ye (video bölümü,
"5 Soru", "Kullanıcı Dostu Panel" + 2. form, Donanım partner vurgusu,
testimonial carousel, HRTech Alliance) kullanıcı onayı olmadan
geçilmeyecek.

### ✅ ÜRÜNLER mega-menüsü TAMAMEN KAPANDI — 2 İK hub sayfası "Genel Bakış" linkiyle eklendi (2026-07-22)
Bu, ÜRÜNLER mega-menüsü üzerindeki son açık noktaydı. **2 İK hub sayfası
(`insan-kaynaklari-yonetimi-modulu`, `insan-kaynaklari-isgucu-yonetimi`)
artık kendi ilgili kolonlarının ("Çalışan Yönetimi" / "İş Gücü Yönetimi")
EN ÜSTÜNDE "Genel Bakış" linki olarak menüde.** Bununla birlikte **ÜRÜNLER
mega-menüsündeki TÜM linkler (27 × 4 dil = 108) artık gerçek, doğru
per-locale hedeflere gidiyor — bu menü tamamen kapandı, kalan bir eksik
yok.**

- **Çeviri:** `mega.urunler.employeeManagement.overview` /
  `workforceManagement.overview` yeni i18n anahtarları — TR "Genel Bakış",
  EN "Overview", NL "Overzicht", IT "Panoramica" (4 dilde de "genel bakış/
  overview" ailesinden, "tümünü gör" değil — çünkü hedef sayfa gerçekten
  bir tanıtım+tile-grid genel bakış sayfası, düz bir "tüm modülleri
  listele" sayfası değil).
- **Görsel ayrım (kullanıcı kararı — ince ayraç + kalın font):**
  `MegaMenuLink`'e yeni `overview?: boolean` alanı eklendi.
  `MegaMenu.tsx`'in `Column` bileşeni artık `overview: true` olan link(ler)i
  listenin ÜSTÜNDE, `<ul>` dışında, `border-b` (ince alt çizgi) + `font-bold`
  ile ayrı render ediyor — geri kalan modül linkleri her zamanki gibi
  `<ul>` içinde normal ağırlıkta kalıyor.
- **NL'de hub sayfası yok (KARAR 2) — nasıl çözüldü:** hub'ların NL
  karşılığı kaynakta hiç yok (yalnızca TR+EN+IT). `navigation.ts`'teki
  yeni `hubHref()` yardımcı fonksiyonu NL için **EN'in slug'ına düşüyor**
  (`getHubSlug(trSlug, locale) ?? getHubSlug(trSlug, 'en')`) — bu, rastgele
  bir fallback DEĞİL, sitenin zaten kurulu `astro.config.mjs`'teki
  `i18n.fallback: { nl: 'en' }` + `fallbackType: 'redirect'` mekanizmasını
  bilerek tetikliyor: aynı slug `/nl/<slug>/` olarak istenince, o path'te
  gerçek bir NL dosyası olmadığı için Astro build sırasında otomatik statik
  bir redirect sayfası üretiyor (`dist/nl/human-resources-management-modules/index.html`
  → `/en/human-resources-management-modules/`'e `<meta refresh>` + kanonik
  link ile yönlendiriyor, doğrulandı). Sonuç: NL ziyaretçisi "Genel Bakış"a
  tıklayınca sessizce EN sayfasına düşüyor — kırık link yok, KARAR 1'deki
  NL fallback politikasıyla birebir tutarlı.
- **`Header.astro`/`resolveLink`** artık `overview` bayrağını da
  `MegaMenu.tsx`'e taşıyor (yalnızca `label`/`href`/`icon` taşıyordu).

**Test:** `scripts/test-urunler-menu-links.mjs` güncellendi (artık 25
değil 27 link/dil × 4 dil = **108/108 link doğrulandı**, NL'nin 2 hub
linki `fetch()`'in varsayılan redirect-takibi sayesinde 200 olarak
görünüyor — gerçek davranışı doğru yansıtıyor). Ayrıca doğrudan curl ile:
TR/EN/IT hub sayfaları 200, NL'nin 2 linki 302 + doğru `Location` header'ı
(`/en/...`) doğrulandı; `astro build` sonrası `dist/nl/.../index.html`
dosyalarının gerçekten statik redirect ürettiği teyit edildi. Regresyon:
`astro check` 0 hata, `astro build` 146 sayfa (yeni route yok, yalnızca
menü/i18n değişikliği), `test-product-language-switch.mjs` 56/56,
`test-sector-language-switch.mjs` 36/36 — hiçbiri etkilenmedi.
`node_modules/.vite` temizlenip dev server temiz yeniden başlatıldı,
`astro-island` sayısı (21, regresyon yok) + `_jsxDEV` hata kontrolü
doğrulandı.

**Artık kapsam dışı kalan tek konu KARAR 2'nin ekiple netleşmesi** (bkz.
"Yapılacaklar (TODO)") — ÜRÜNLER mega-menüsüyle ilgili başka açık nokta yok.

### ✅ Donanım sayfası (`/donanim/`) gerçek içerikle kuruldu — TEK sayfa, 5 modül DEĞİL (2026-07-22)
Kullanıcı önemli bir düzeltme getirdi: Donanım Yönetimi kolonunun 5 linki
5 ayrı modül sayfası değil, **TEK bir sayfanın** (`idenfit.com/donanim/`)
farklı bölümlerine (anchor id'lerle) işaret ediyor. Araştırıldı ve
doğrulandı.

**Kaynak & şema:** `pages.json`'da TR id 11715 (`pll_translations` ile
EN 11820, NL 20287, IT 23428 bağlı — 4 dilin 4'ü de mevcut, KARAR 2
tetiklenmedi). ACF şeması PDKS'in Şema D'siyle (`section_N_title/text/
cta_text/cta_url/image`, N=1 hero) **birebir aynı** — yeni bir şema tespiti
gerekmedi, `extract-products.mjs`'teki `collectBlockIndexFirst` mantığı
aynen yeniden kullanıldı. TR sayfasında ayrıca 300+ KULLANILMAYAN ACF alanı
var (banner_*, femas_*, office_* vb. — başka şablonlardan kalma gürültü,
Şirket Takvimi'nde görülen aynı örüntünün bir tekrarı), regex tabanlı
toplayıcı bunları otomatik eliyor.

**8 blok bulundu (hero + 7 içerik bloğu), anchor id'ler kaynak HTML'in
gerçek `id` niteliklerinden alındı:**
1. Hero — "Farklı donanımlara entegre tanımlama sistemleri" (`#entegrasyon`)
2. Biyometrik — yüz/parmak izi tanıma (`#biyometrik`)
3. Bluetooth — anlık geçiş takip (`#bluetooth`)
4. Donanım çekirdek platform — kaynakta isimli id yoktu, `#platform` biz atadık
5. RFID — gerçek zamanlı konum takibi (`#rfid`)
6. GPRS — kablosuz iletişim (`#gprs`)
7. Turnikeler — geçiş sistemleri (`#turnikeler`)
8. Onaylı markalar — Suprema/ZKTeco/Bab marka listesi (`#markalar`)

Mega-menünün ÖNCEDEN var olan (ama sayfa yokken 404 veren) anchor'ları
(`donanim#markalar`, `#biyometrik`, `#rfid`, `#turnikeler`) **kaynaktaki
gerçek bölümlerle isabetli eşleşti** — kullanıcı deneyimi kararı olarak
her link kendi bölümüne derin-link vermeye devam ediyor (sayfanın başına
atıp gezinmeye bırakmak yerine), yalnızca temel slug artık doğru
per-locale slug'a çözülüyor.

**Çeviri durumu — IT yine tamamen çevrilmemiş (EN kopyası):** TR gerçek,
EN gerçek/kaliteli farklı bir çeviri, NL gerçek/kaliteli farklı bir çeviri.
**IT'nin hero'su ve 8 bloğun TAMAMI kelimesi kelimesine EN'in kendisi**
(3 blokta HTML sarmalaması hafifçe farklı olduğu için `===` karşılaştırması
`false` dönüyordu ama metin hâlâ İngilizceydi) — KARAR 1 gereği TR kaynaktan
gerçek İtalyanca çeviri yazıldı (`hardwareTranslationOverrides.ts`, hero+7
blok tam override).

**Yeni mimari:**
- `scripts/extract-hardware.mjs` → `reference/wordpress-export/hardware.json`
  (tek sayfa, `products.json`/`hubs.json` gibi bir grup dizisi değil).
- `src/data/hardwareContent.ts` — `ProductBlock` tipini (hero+sections şekli
  birebir aynı) doğrudan yeniden kullanır, `getHardwareContent(locale)` /
  `getHardwareSlug(locale)` / `getHardwareLocaleUrls()`.
- `src/data/hardwareTranslationOverrides.ts` — IT için tam override.
- **Yeni component YAZILMADI** — içerik şekli (hero + N blok, SSS yok) ürün
  sayfalarıyla birebir aynı olduğu için `ProductPage.astro` doğrudan
  yeniden kullanıldı. Tek ekleme: `ProductBlock`'a opsiyonel `id?: string`
  alanı (anchor desteği için, diğer 20 ürün sayfasını etkilemiyor — hepsi
  `id: undefined` ile çalışmaya devam ediyor) + `ProductPage.astro`'nun
  hero/section `<section>` sarmalayıcılarına `id={...}` eklendi.
- **Route'lar:** `donanim.astro` + `en/hardware.astro` + `nl/hardware.astro`
  + `it/hardware.astro` (4'ü de kaynakta mevcut).

**Bulunan ve düzeltilen gerçek bug — mega-menü anchor linkleri
kırıktı:** `Header.astro`'nun `l()` fonksiyonu (`getRelativeLocaleUrl`)
`#anchor` içeren bir slug'ı (`donanim#rfid` gibi) yol gibi işleyip
SONUNA trailing slash ekliyordu (`/donanim#rfid/`) — bu, fragment'ı
`rfid/` yapıp tarayıcının `getElementById('rfid/')` araması yapmasına
(bulamayıp scroll etmemesine) yol açardı. Yeni `lWithHash()` yardımcı
fonksiyonu path/fragment'ı ayırıp `l()`'i yalnızca path'e uygulayıp
fragment'ı ham haliyle sona ekliyor (`/donanim/#rfid`, doğru). Bu hata
daha önce fark edilmemişti çünkü Donanım sayfası hiç kurulu değildi (link
zaten 404 veriyordu) — gerçek içerik eklenince ortaya çıktı.

**ÜRÜNLER menüsü artık 21/21 gerçek grup için doğru link içeriyor**
(20 ürün modülü + Donanım — 2 İK hub sayfası hâlâ menüde değil, bkz. TODO).

**Yeni test — `scripts/test-urunler-menu-links.mjs` genişletildi:**
Artık yalnızca HTTP status değil, `#anchor` içeren linkler için hedef
sayfanın HTML'inde o `id`'nin gerçekten var olduğunu da doğruluyor
(fetch fragment'ı sunucuya göndermediği için salt status kontrolü
yetersizdi). **Sonuç: 100/100 link (status + anchor) doğrulandı** (4 dil
× 25 link, Donanım'ın 5 linki dahil).

**Regresyon:** `astro check` 0 hata, `astro build` 146 sayfa (142 önceki +
4 Donanım), `test-product-language-switch.mjs` 56/56,
`test-sector-language-switch.mjs` 36/36 — hiçbiri etkilenmedi.
Donanım'ın kendi `LanguageSwitcher`'ı da curl ile doğrulandı (TR/EN/NL/IT
4 gerçek URL). `node_modules/.vite` temizlenip dev server temiz yeniden
başlatıldı, `astro-island` sayısı (21, regresyon yok) + `_jsxDEV` hata
kontrolü doğrulandı.

### ✅ ÜRÜNLER mega-menü linkleri gerçek per-locale slug'lara bağlandı (2026-07-22)
`navigation.ts`'teki ÜRÜNLER mega-menüsü, sektör sayfalarında kurulan
`buildMegaMenus(mega, locale)` deseniyle (bkz. §"Sektör sayfalarında dil
değiştirici düzeltmesi") aynı şekilde düzeltildi. Önceden 3 kolonun
(Çalışan Yönetimi, İş Gücü Yönetimi, Yetenek Yönetimi) 20 linki hepsi TEK
canonical TR slug varsayımıyla hardcoded'du (ör. `/en/pdks-modulu/` gibi
var olmayan bir URL) — artık her biri `productContent.ts`'teki
`getProductSlug(trSlug, locale)` ile çözülüyor (yeni `productHref()`
yardımcı fonksiyonu, `navigation.ts` içinde, savunmacı fallback'i eski
hardcoded TR slug).

- **20 modülün 20'si de** doğru şekilde eşleşti — `products.json`'daki
  20 trSlug'ın tamamı zaten ÜRÜNLER menüsünde bir yere bağlıydı (Puantaj
  dahil, CLAUDE.md'nin "henüz eklenmedi" notu güncel değilmiş). Tek
  incelik: **Özlük Dosyası** — `trSlug` anahtarı `calisan-ozluk-yonetimi-modulu-2`
  (WP'nin ham `slug` alanından türediği için gerçek route slug'ından farklı,
  bkz. daha önceki not), `productHref('calisan-ozluk-yonetimi-modulu-2',
  'calisan-ozluk-yonetimi-modulu')` ile doğru çözüldü.
- **Donanım Yönetimi kolonu (5 link) kasıtlı olarak DOKUNULMADI** — `donanim`
  sayfası (ve Suprema alt sayfaları) bu migrasyonun hiçbir turunda
  kurulmadı, TR'de bile 404. Bu KARAR 3'ün atladığı bir modül değil,
  page-inventory'nin B-ÖNEMLİ/Donanım-Suprema kategorisinde zaten "henüz
  migrate edilmedi" olarak işaretli ayrı bir iş kalemi — dokunulmadı,
  linkler olduğu gibi (`donanim`, `donanim#markalar` vb.) bırakıldı.
- **Bulunan ama düzeltilmeyen boşluk — 2 İK hub sayfası ÜRÜNLER'de hiç
  linklenmiyor.** `insan-kaynaklari-yonetimi-modulu` ve
  `insan-kaynaklari-isgucu-yonetimi` (`hubContent.ts`, gerçek içerikli, 3
  dilde canlı) şu an mega-menünün hiçbir kolonunda bir link olarak
  görünmüyor — bunları eklemek yeni bir i18n etiketi/sütun kararı
  gerektireceğinden (mevcut 4 kolon şemasına doğal olarak oturmuyorlar,
  overview/dizin sayfaları) bu turun kapsamı dışında bırakıldı, kullanıcıya
  ayrıca raporlandı.
- **Yeni test — `scripts/test-urunler-menu-links.mjs`:** ÜRÜNLER
  MegaMenu.tsx astro-island'ını diğer üç mega-menüden (`"source":"idenfit"`
  ikon işaretiyle, dil bağımsız) ayırt edip 4 dilin ana sayfasından TÜM
  kolon linklerini okur, her birine gerçek HTTP isteği atar. **Sonuç:
  ürün/hub linkleri 80/80 200 (4 dil × 20 modül), Donanım linkleri 0/20
  200 (beklenen — kapsam dışı, ayrı raporlanıyor, FAIL sayılmıyor).**
- **Regresyon:** `astro check` 0 hata, `astro build` 142 sayfa hatasız,
  `scripts/test-product-language-switch.mjs` 56/56, `scripts/test-sector-language-switch.mjs`
  36/36 — ikisi de bu değişiklikten etkilenmedi. `node_modules/.vite`
  temizlenip dev server temiz yeniden başlatıldı, `astro-island` sayısı
  (21, regresyon yok) + `_jsxDEV` hata kontrolü doğrulandı.

### ✅ Aşama 3 (kısım 2) — Puantaj (Şema E) + 2 İK Hub sayfası tamamlandı (2026-07-21)
KARAR 3 gereği ertelenen son 3 sayfa da tamamlandı — **artık 12/12 modül
migrasyon kapsamında, hiçbiri kalıcı olarak atlanmadı.** Her ikisinde de
Aşama 3.0 taramasının ilk tahmini (Puantaj'da "kullanılabilir içerik yok",
hub sayfalarında "içerik Elementor HTML'de, ACF'de değil") **yanlış
çıktı** — sektörlerde/ürünlerde daha önce görülen "önce yanlış negatif,
sonra düzeltme" örüntüsünün üçüncü tekrarı.

**Puantaj (`puantaj-takip-programi-modulu`) — 6. bir ACF şeması (Şema E)
bulundu, gerçek içerik var:** Önceki 5 şema tespiti (`module_title`/
`hero_title`/`section_title_1`/`section_1_title`) bu sayfada hiç eşleşmedi
çünkü hero alanları TAMAMEN FARKLI adlarla saklanıyor: `product_tit`
(başlık) + `module_text` (metin). İçerik blokları `section_2`, `section_4`
..`section_8` (index 1 hero, **index 3 kasıtlı atlanıyor** — orada
başlıksız, isimsiz/şirketsiz bir müşteri alıntısı var, normal blok değil).
4 dilde de 6 gerçek içerik bloğu + 5 konuyla tutarlı SSS çifti + gerçek bir
YouTube video URL'i bulundu. `extract-products.mjs`'e `extractSchemaE()` +
dispatch'e `acf.product_tit` kontrolü eklendi (PDKS regresyon testiyle
doğrulandı — diğer 18 modül hâlâ doğru şemalarını kullanıyor).

- **Testimonial (section_3) render edilmiyor:** `company_name`/`name`/
  `job_title` hepsi boş — anonim, atıfsız bir alıntı. İzin Yönetimi'nin
  testimonial'ıyla aynı politika uygulandı (`extractTestimonial()` Şema E
  için `section_3_text`'i kontrol edecek şekilde genişletildi, ama
  `ProductPage.astro`/`getProductContent()` bunu hiç render etmiyor —
  veri `products.json`'da duruyor, ileride kullanılabilir).
- **Video embed EKLENMEDİ (kullanıcı kararı):** Gerçek bir YouTube
  `video_url`'i var ama hiçbir başka ürün sayfası video embed
  kullanmıyor — tutarlılık için atlandı, veri yine de `products.json`'da.
- **IT çeviri kalitesi:** Hero zaten doğru İtalyanca'ydı. `s0`/`s2`/`s3`/`s4`
  tamamen EN kopyasıydı; `s1`/`s5`'in METNİ zaten doğru İtalyanca'ydı ama
  BAŞLIKLARI İngilizce kalmıştı (Şirket Takvimi'nde görülen "satır satır
  karışık çeviri" örüntüsünün tekrarı); FAQ'ın 5 çifti tamamen EN
  kopyasıydı. Hepsi `productTranslationOverrides.ts`'e eklendi.
- **Yeni mimari — override'larda FAQ desteği:** `ProductOverride`
  arayüzüne `faq?: ProductFaqItem[]` eklendi (`getProductContent()` artık
  `override?.faq ?? entry?.faq` önceliğiyle çözüyor) — Puantaj'dan önce
  hiçbir modülün SSS'i override gerektirmemişti, bu ilk kullanım.
- **Route'lar:** `puantaj-takip-programi-modulu.astro` +
  `en/time-attendance-module.astro` + `nl/tijdregistratie.astro` +
  `it/modulo-gestione-presenze.astro` (4'ü de kaynakta mevcut, KARAR 2
  tetiklenmedi).

**2 İK Hub sayfası (`insan-kaynaklari-yonetimi-modulu`,
`insan-kaynaklari-isgucu-yonetimi`) — Elementor HTML değil, 7. bir ACF
düzeni (hero + tanıtım + "ürün tile grid") bulundu:** Aşama 3.0'ın "ACF
neredeyse boş, gerçek içerik 20-54 KB'lık Elementor `content.rendered`'da"
tahmini yanlıştı — ACF'de 101 (hub A) ve 40 (hub B) dolu alan var, sadece
standart `section_N_*` düzenine uymuyorlar. Gerçek yapı: hero
(`section_1_*`) + tek bir tanıtım bloğu (`section_2_*`) + **N adet "ürün
tile"** (`<index>_product_title/text/cta_text/cta_url/image`,
`_copy`/`_copy2`..`_copy15` sonekleriyle çoğaltılmış, her biri ikon+başlık+
metin+CTA — CTA genelde başka bir idenfit modül sayfasına link veriyor).
Hub A'da 17 tile, hub B'de 7 tile bulundu.

- **Yeni script — `scripts/extract-hubs.mjs`:** Tile'ları alan adı SAYISAL
  ÖNEK+SONEK kombinasyonuna göre topluyor (önek tek başına güvenilmez —
  hub A'da HEM `1_product_title` HEM `2_product_title` aynı '' sonekini
  paylaşıyor). Her tile'a locale-bağımsız bir `key` (ör. `"2_copy2"`)
  atanıyor — başlık metni dile göre değiştiği için (TR "evraklar" / EN
  "papers") filtreleme başlığa değil bu `key`'e göre yapılıyor.
- **Bulunan veri hataları (WP'nin kendi kalıntıları, düzeltilmedi/atlandı,
  aşırı-yorumlanmadı):**
  1. Hub A'nın "servis" (`2_copy15`) ve "Bordrolar modülü..." (`2_copy14`)
     tile'larının CTA alanları TAMAMEN BOŞ; ayrıca alakasız,
     hiçbir tile'ın sonek'iyle örtüşmeyen `17_product_cta_text_copy`/
     `17_product_cta_url_copy2` adında iki yetim alan var (muhtemelen
     WP'de elle veri girişi kalıntısı). İlk denemede bu yetim alanları
     "aynı sonek'e sahip başka bir index'te ara" mantığıyla otomatik
     eşleştirmeye çalışıldı — **yanlış sonuca vardı** ("evraklar" tile'ına
     `servis`'in URL'i yanlışlıkla atandı, çünkü sonekler karışıktı).
     Bu fallback TAMAMEN KALDIRILDI — servis/bordrolar tile'ları artık
     CTA'sız (tıklanamaz kart) kalıyor, veri uydurulmuyor.
  2. EN/IT'de bir tile'ın (`2_copy13`, offboarding) CTA URL'inin başında
     yanlışlıkla bir `#` karakteri vardı (`#https://idenfit.com/...`) —
     TR'de yok, temizlendi.
  3. Hub B'nin EN `intro.title`'ı ("Workforce Management") section_1
     başlığının tembel tekrarıydı, TR'nin gerçek çevirisi ("Verimli
     İşgücü Planlama & Yönetimi") değil — intro.text ise gerçek, farklı
     İngilizce içerikti, dokunulmadı — yalnızca title düzeltildi.
- **Kullanıcı kararlarıyla çözülen 3 içerik durumu:**
  1. **"evraklar" tile'ı (hub A) — kart tamamen çıkarıldı.** Bu modül
     kaynak sitede hiç migrate edilmemiş, export'ta da (hiçbir post
     type'ta) bulunamadı — gerçek bir içerik boşluğu (evraklar-modulu
     araması sıfır sonuç verdi).
  2. **Güvenlik/Görev/Denetim tile'ları (hub B) — olduğu gibi bırakıldı.**
     Bunlar idenfit değil, kardeş bir ürüne (workmana.com — Guard/Task/
     Audit) gerçek, çalışan dış linkler. `resolveTileCta()` host
     `idenfit.com` ile bitmiyorsa URL'i hiç dönüştürmeden (dış link,
     `target=_blank`) bırakıyor.
  3. **Puantaj'ın video embed'i — eklenmedi** (yukarıya bkz.).
- **IT çeviri kalitesi:** Her iki hub'ın da TÜM IT içeriği (hero, tanıtım,
  tüm tile'lar, hub A'nın 6 SSS'i) EN'in birebir kopyasıydı — hepsi
  `hubTranslationOverrides.ts`'e gerçek İtalyanca çeviriyle eklendi.
- **Yeni mimari — `src/data/hubContent.ts` + `hubTranslationOverrides.ts`:**
  `productContent.ts`/`productTranslationOverrides.ts` ile aynı desen
  (`link` alanı otoriter, `HUB_OVERRIDES` aynı override felsefesi) ama
  ayrı bir tip sistemi (`HubContent` = hero+intro+tiles+faq, `ProductPage`in
  section şemasına ZORLANMADI). `localizeCtaUrl()` `productContent.ts`'ten
  export edilip tile CTA'larında yeniden kullanıldı (kod tekrarı yok).
- **Yeni component'ler:** `HubPage.astro` (hero + tanıtım + tile grid +
  SSS, `ProductPage.astro` ile aynı FAQ/`set:html` deseni) + `HubTileCard.astro`
  (ikon+başlık+metin+CTA, dış link ise `target=_blank`).
- **Route'lar:** NL kaynakta hiç yok (KARAR 2 — atlandı), yalnızca TR+EN+IT
  × 2 hub = 6 dosya: `insan-kaynaklari-yonetimi-modulu.astro` +
  `en/human-resources-management-modules.astro` +
  `it/moduli-gestione-risorse-umane.astro`;
  `insan-kaynaklari-isgucu-yonetimi.astro` +
  `en/human-resources-workforce-management-module.astro` +
  `it/modulo-gestione-risorse-umane-forza-lavoro.astro`.

**Kasıtlı olarak dokunulmayanlar:** Puantaj ve 2 hub sayfası da
`navigation.ts`'teki ÜRÜNLER mega-menüsüne henüz eklenmedi (diğer 18
modülle aynı, ayrı bir turda ele alınacak).

**Test (her ikisi için):** `astro check` 0 hata. Puantaj'ın 4 URL'i + hub
sayfalarının 6 URL'i (toplam 10 yeni) curl ile 200 doğrulandı. Hub A'nın
tile sayısı 17→16 (evraklar hariç) doğrulandı, "evraklar" kelimesinin
sayfada yalnızca BAŞKA tile'ların metninde (İzin evrakları, bordro evrak
menüsü gibi) geçtiği, kendi kartı olarak ÇIKMADIĞI doğrulandı. Workmana
dış linkleri + `target="_blank"` (12 adet, hub B'nin 3 workmana linkinin
her locale'de göründüğü kadar) doğrulandı. IT çevirileri (hero/intro/FAQ)
curl ile spot-check edildi. `scripts/test-product-language-switch.mjs`
Puantaj dahil **19 modülde 56/56 geçiş başarılı**. `astro build` 142 sayfa
(132 önceki + 10 yeni) hatasız; ardından her zamanki `rm -rf dist
node_modules/.vite` + `astro dev --background` temiz yeniden başlatma,
`astro-island` sayısı (21, regresyon yok) + `_jsxDEV` hata kontrolü
doğrulandı.

### ✅ Üç karar alındı ve uygulandı (2026-07-21, Aşama 3.0 raporu sonrası)

**KARAR 1 — SSS artık her yerde gösteriliyor (önceki gizleme kararı geri
alındı):** Daha önce (aynı gün, PDKS pilotunda) SSS'nin yanlış modülle
eşleştiği görülünce tüm ürün sayfalarında SSS gizlenmişti. Bu karar geri
alındı: **SSS bölümü artık TÜM ürün/modül sayfalarında gösteriliyor**
(PDKS'in bilinen yanlış-eşleşmiş 20 sorusu dahil) — kaynak sitede ne varsa
olduğu gibi taşınıyor, biz içerik müdahalesi yapmıyoruz.
`ProductPage.astro`'daki SSS render bloğu (accordion/`<details>`) geri
açıldı, `showFAQ`/gizleme mantığı yok. Doğrulama: PDKS TR/EN/NL/IT'de
20/20/20/20 `<details>`, yeni 7 modülde de FAQ'lar render ediliyor (bkz.
aşağı). Detay için "Ürün/modül sayfaları" bölümündeki güncellenmiş nota
bakın.

**KARAR 2 — Kaynakta olmayan çeviriler için yeni sayfa üretimi ERTELENDİ:**
Daha önce (İşe Alım NL) kaynak sitede hiç olmayan bir dil için sıfırdan
yeni sayfa oluşturulmuştu (`SYNTHETIC_SLUGS` mekanizmasıyla). Bu artık
**varsayılan davranış DEĞİL** — kaynakta bir modülün bir dili yoksa
(401/404, `pll_translations`'ta referans yok — ör. seyahat modülünün
NL/IT'si, demirbaş modülünün IT'si), o spesifik dil/sayfa için **yeni
sayfa ÜRETİLMEZ**, atlanır; modülün var olan diğer dilleri normal
üretilir. Bu konu ekiple netleşene kadar geçerli.
**TODO:** Kaynakta olmayan çeviriler (seyahat NL/IT, demirbaş IT gibi)
için yeni sayfa oluşturma kararı ekiple görüşülecek, şimdilik atlandı.

**KARAR 3 — Hiçbir modül kapsam dışı bırakılmayacak:** Rapordaki (bkz.
Aşama 3.0 bölümü aşağıda) 12 modülün tamamı (Puantaj + 2 İK hub sayfası
dahil) migrasyon kapsamında kalıyor — hiçbiri kalıcı olarak atlanmıyor,
yalnızca özel yaklaşım gerektirenler (Puantaj'ın 5. şeması, hub
sayfalarının Elementor-tabanlı içeriği) ayrı bir adımda, daha dikkatli
ele alınacak.

### ✅ Aşama 3 (kısım 1) — 7 "temiz" modül üretildi (2026-07-21)
KARAR 2/3 sonrası, Aşama 3.0 raporundaki 12 modülden yapısal olarak
sorunsuz olan 7'si üretildi: **Doküman** (`dokuman-yonetim-sistemi-modulu`),
**Masraf** (`masraf-yonetimi-modulu`), **Mesaj**
(`ofis-ici-mesajlasma-modulu`), **Zimmet** (`zimmet-yonetimi-modulu`),
**Servis/Shuttle** (`personel-servisi-yonetimi-modulu`), **Özlük Dosyası**
(`calisan-ozluk-yonetimi-modulu` — bkz. not aşağıda), **Eğitim**
(`calisan-egitim-yonetimi-modulu`). Puantaj ve 2 İK hub sayfasına
**dokunulmadı** (KARAR 3 gereği ayrı bir adımda ele alınacaklar).

**KARAR 1 kuralı (gerçek çeviri, ham kopya/boş kabul yok) uygulanan
bulgular:**
- **Doküman IT** — tamamen EN'in kopyasıydı → EN'in gerçek içeriğinden
  İtalyanca'ya çevrildi.
- **Masraf IT** — EN kopyası + yapıştırma artığı ("1" gibi anlamsız
  karakterler) → EN'den yeniden çevrildi.
- **Mesaj IT** — tamamen EN kopyası (1 blokta metin de boştu) → çevrildi.
- **Zimmet EN VE IT** — ikisi de **ham Türkçe** duruyordu (kopya bile
  değil) → TR'den hem İngilizce hem İtalyanca'ya sıfırdan çevrildi. NL
  zaten doğruydu, dokunulmadı.
- **Servis/Shuttle NL** — `hero.title` İngilizce kalmıştı ("Shuttle
  Module") → Hollandaca bileşik-kelime konvansiyonuna uydurulup
  "Shuttlemodule" yapıldı; 1 blokta boş metin dolduruldu. **IT** — EN
  kopyasıydı → çevrildi.
- **Özlük Dosyası EN/NL** — 1 blokta metin boştu (TR'de doluydu) → ikisi
  de çevrildi. **IT** — hero zaten doğruydu (dokunulmadı), ama 1 başlık +
  1 blok metni ham Türkçe, 1 blok metni boştu → yalnızca o 3 alan
  düzeltildi (tüm sayfa değiştirilmedi).
- **Eğitim NL** — 1 blokta metin boştu → dolduruldu. **IT** — EN kopyası
  (2 blokta metin de boştu) → tamamen çevrildi. Not: EN/IT'de TR/NL'de
  olmayan fazladan bir 3. blok var ("Evaluate training success") — KARAR
  1 kuralı TR→diğer-dil eksiklerini hedeflediği için bu blok TR/NL'ye
  GERİ AKTARILMADI (kasıtlı, kapsam dışı).

**Slug notu — `calisan-ozluk-yonetimi-modulu`:** WP'nin ham `slug` alanı
yanıltıcı şekilde `calisan-ozluk-yonetimi-modulu-2` idi (muhtemelen eski
bir slug çakışması kalıntısı) — gerçek `link` alanı `-2` içermiyor. Daha
önce kurulan "slug alanı değil, her zaman `link` esas alınır" kuralı
(`hizmet-sektoru`, `pdks-module-2` ile aynı sınıf) burada da geçerli:
route dosyası gerçek `link`'ten türetilen `calisan-ozluk-yonetimi-modulu`
adını kullanıyor, yalnızca `productContent.ts`'in iç `trSlug` anahtarı
(veri dosyalarında/override'da) `-2` sonekini taşıyor (salt iç referans,
URL'ye yansımıyor).

**Gerçek per-locale slug'lar (`link`'ten, 4'ü de kaynakta mevcut, KARAR 2
tetiklenmedi):**
| Modül | EN | NL | IT |
|---|---|---|---|
| Doküman | `hr-document-management-module` | `documenten` | `modulo-gestione-documentale-hr` |
| Masraf | `expense-management-module` | `onkostenmodule` | `modulo-gestione-spese` |
| Mesaj | `employee-internal-communication-module` | `berichten-module` | `modulo-comunicazione-interna-dipendenti` |
| Zimmet | `employee-records-management-module` | `incassos` | `modulo-gestione-fascicolo-dipendenti` |
| Servis/Shuttle | `employee-shuttle-management-module` | `shuttle-module` | `modulo-gestione-navette-dipendenti` |
| Özlük Dosyası | `employee-file-module` | `medewerkersinformatie` | `modulo-fascicolo-personale` |
| Eğitim | `employee-training-management-module` | `training` | `modulo-gestione-formazione-dipendenti` |

**Test:** `astro check` 0 hata. 28 yeni URL'nin tamamı curl ile 200
doğrulandı. `scripts/test-product-language-switch.mjs` — artık 18 modül
üzerinde çalışıyor (7 yenisi dahil), **53/53 zincir geçişi başarılı**.
Çeviri kalitesi curl ile spot-check edildi (İtalyanca/İngilizce/Hollandaca
başlıklar doğru dilde çıkıyor, `&lt;b&gt;` kaçış hatası yok). PDKS'in 20
SSS'i hâlâ 4 dilde de görünüyor (KARAR 1 doğrulaması). `astro build` 132
sayfa hatasız tamamlandı; ardından kurulu workflow gereği
`rm -rf dist node_modules/.vite` + `astro dev --background` ile dev server
temiz yeniden başlatıldı, ana sayfa ve React island hydration'ı
(`astro-island` sayısı, `_jsxDEV` hata kontrolü) regresyon yok diye
doğrulandı.

**Kasıtlı olarak dokunulmayanlar:** Bu 7 modül de `navigation.ts`'teki
ÜRÜNLER mega-menüsüne henüz eklenmedi (PDKS'teki aynı nottaki gibi — mega
menü linkleri hâlâ eski varsayımı kullanıyor, ayrı bir turda ele
alınacak).

### ✅ Aşama 3.0 — kalan 12 modül tarandı (sayfa üretilmedi), rapor kullanıcı incelemesinde
Aşama 3'e (kalan ~77 sayfa/12 benzersiz modül) geçmeden önce daha güvenli
bir yöntem istendi: önce SADECE keşif/tarama, üretim yok. Yapıldı —
`scripts/scan-remaining-modules.mjs` (salt okunur, route/sayfa dosyası
YAZMAZ) her kalan modül için şema/dil-varlığı/blok-tutarlılığı/SSS/canlı-API
kontrolü yaptı. Tam rapor: **`docs/remaining-modules-report.md`**. Bu
oturumda `src/pages/`'e hiçbir yeni dosya eklenmedi — kullanıcı raporu
inceleyip nasıl devam edileceğine karar verecek.

**Öne çıkan bulgular:** 12 modülün 9'unda çeviri kalitesi sorunu (KARAR 1
kuralı bunlara da uygulanacak, sürpriz değil) — ama 3 sayfa GERÇEKTEN
farklı bir müdahale gerektiriyor:
- `puantaj-takip-programi-modulu` — **5. bir ACF şeması**, mevcut 4 şema
  tespiti onu ÇÖZEMİYOR (hiçbir standart hero alanı dolu değil, başlık
  yalnızca WP post title'ında var, sayfa yıllarca birikmiş alakasız ACF
  kalıntısı taşıyor — testimonial alanları, iletişim alanları, 15 kopyaya
  varan bir ürün-listesi deseni).
- `insan-kaynaklari-yonetimi-modulu` ve `insan-kaynaklari-isgucu-yonetimi`
  — muhtemelen tekil modül sayfası değil, **HUB/genel bakış sayfası**
  (ACF blokları neredeyse boş ama Elementor `content.rendered` 20-54 KB) —
  bizim ACF-tabanlı extraction yöntemimiz gerçek içeriklerini yakalayamaz.

Detaylı tablo, kategori bazlı listeler ve her bulgunun gerekçesi için
rapora bakın.

### ✅ KARAR 1 — Gerçek çeviri kuralı kondu ve geriye dönük uygulandı (2026-07-21)
**KURAL (kalıcı, bundan sonraki her ürün sayfası için geçerli):** Ürün/modül
sayfalarında bir dilin içeriği eksik, boş veya başka bir dilin ham kopyası
çıkarsa, **TR kaynak metinden gerçek, profesyonel bir çeviri üretilir —
ham kopyalama veya boş bırakma kabul edilmez.** Bu, önceki turlarda
"olduğu gibi bırakıldı, düzeltilmedi" diye not edilen bulguların artık
GEÇERSİZ olduğu, kalıcı bir politika değişikliğidir.

**Mimari:** `src/data/productTranslationOverrides.ts` — `products.json`'daki
ham (bazen bozuk) veriyi ez/tamamlayan elle yazılmış gerçek çeviriler.
`productContent.ts`'in `getProductContent()`'i her sayfa için önce bir
override olup olmadığına bakar (`hero`/`sections` = tam sayfa değişimi,
`appendSections` = yalnızca eksik bir bloğu tamamlama). Detay için bkz.
§"Ürün/modül sayfaları — Gerçek çeviri kuralı" (Mimari bölümü altında).

**Bu turda düzeltilenler (PDKS + Aşama 2'nin 5 modülü + Aşama 2.5'in 6
modülü = 12 modül):**
- **12 modülün IT içeriği baştan çevrildi** (11'i EN'in ham kopyasıydı,
  1'i — Şirket Takvimi — kısmen çevrilmişti, yalnızca eksik kısım tamamlandı).
- **İzin Yönetimi'nin EN/NL/IT'de eksik olan 6. bloğu** TR'den 3 dile de
  çevrilip eklendi (`appendSections`).
- **İşe Alım Modülü'nün EN ve IT sayfaları** (ham Türkçe duruyordu)
  gerçek İngilizce/İtalyanca'ya çevrildi.
- **İşe Alım Modülü'nün NL sayfası sıfırdan oluşturuldu** — kaynak sitede
  hiç yoktu (401 rest_forbidden), TR'den Hollandaca'ya çevrilerek yeni bir
  sayfa (`/nl/wervingsmodule/`) kuruldu; artık 4 dilde de tutarlı.
- **Ayrıca bulunan bir gerçek bug düzeltildi:** `ProductPage.astro`'da
  `hero.text` `set:html` DEĞİL düz metin olarak render ediliyordu — TR
  kaynağında `<b>` etiketi geçen hero metinleri (İzin, Performans,
  Onboarding, İşe Alım) `&lt;b&gt;` olarak kaçmış görünüyordu. Başlıklarda
  (`hero.title`/section title'ları) bu daha önce (PDKS pilotunda)
  düzeltilmişti, hero.text'te aynı hata kaçmıştı — şimdi düzeltildi.

### ✅ KARAR 2 — Aşama 2.5 tamamlandı: 6 yeni modül, şema çeşitliliği testi (2026-07-21)
Sağlık, Offboarding, Anket, Geri Bildirim, Şirket Takvimi, Notlar modülleri
— kasıtlı olarak farklı ACF şemalarını kapsayacak şekilde seçildi. Toplam
24 yeni sayfa (6 modül × 4 dil, hepsinde 4 dil de mevcut — bu turda NL
boşluğu çıkmadı). Detay için bkz. §"Ürün/modül sayfaları — Aşama 2.5"
(Mimari bölümü altında).

**Şema çeşitliliği doğrulandı — YENİ bir örüntü daha bulundu:**
`kurumsal-takvim-modulu` (Şirket Takvimi) sayfası **hem `module_title`
HEM `hero_title` HEM `section_1_title` alanlarını aynı anda içeriyordu**
(muhtemelen zaman içinde birden fazla Elementor/ACF şablonu denenmiş,
eskileri temizlenmemiş) — yalnızca `module_title` grubu doldurulmuştu,
diğerleri boştu. `extract-products.mjs`'in şema tespiti (ilk dolu olanı
seçme, boş string'leri "yok" sayma) bunu doğru şekilde çözdü, ekstra
müdahale gerekmedi. Ayrıca bu sayfa **kısmi çeviri** örneği de sundu:
hero tamamen doğru İtalyanca'ydı, ama section başlıklarından biri
çevrilmiş biri değildi, section metinlerinden biri de İngilizce kalmıştı
— "tamamı kopya" değil, "satır satır karışık" bir kalite sorunu. Bu da
KARAR 1 kuralına göre düzeltildi.

**Kontrol sonuçları (kullanıcı talebiyle, 6 yeni modülün hepsi için):**
- **SSS-konu eşleşmesi:** ✅ 6 modülün de SSS'i kendi konusuyla doğru
  eşleşiyor (Sağlık→sağlık soruları, Offboarding→offboarding soruları vb.)
  — PDKS'teki izole hata bir daha tekrarlanmadı.
- **Dil değiştirici:** ✅ Genişletilen `scripts/test-product-language-switch.mjs`
  ile tüm 11 modül (PDKS hariç, o ayrıca test edilmişti) yeniden test
  edildi — **32/32 geçiş başarılı**.
- **Çeviri gerçekliği:** ✅ Tüm IT sayfaları curl ile tek tek doğrulandı —
  hiçbiri artık EN kopyası değil, gerçek İtalyanca gösteriyor.
- **Şema tespiti:** ✅ `extract-products.mjs` 4. bir şema varyasyonuyla
  (üç field group'un aynı sayfada bir arada, ikisi boş) karşılaştı ve
  doğru çözdü — script'in genelleme yaklaşımı bu turda da sağlam çıktı.

### ⏭️ Sıradaki adım — 🎉 ana sayfa 12/12 tamamlandı, kullanıcı onayı bekleniyor
**KARAR 3 tamamen kapandı** — Aşama 3.0 raporundaki 12 modülün tamamı
(18 modül + Puantaj + 2 hub = **21 sayfa grubu**) artık üretildi ve test
edildi. **🎉 ÜRÜNLER mega-menüsü TAMAMEN KAPANDI (2026-07-22)** — 20 ürün
linki + Donanım Yönetimi'nin 5 linki (`/donanim/`, tek gerçek sayfa) + 2
İK hub sayfasının "Genel Bakış" linki, toplam 27 link × 4 dil = 108 link,
hepsi doğru per-locale slug/anchor'a gidiyor. **Bu menüyle ilgili artık
hiçbir açık nokta yok.**

**🎉 Ana sayfa migrasyonu TAMAMLANDI (2026-07-22) — hero dahil 12/12
bölüm.** `docs/homepage-sections-report.md`'deki keşif raporundan
GRUP 1 (logo/özellik/rozet) → kullanıcı ekran görüntüsüyle 3 tasarım
sadakati sorunu bildirdi (kırmızı banner ayraç, logo renkleri, rozet
kutuları) → düzeltildi → GRUP 2 (video + "5 Soru" + Kullanıcı Dostu
Panel/2. form) → GRUP 3 (Suprema + testimonial carousel + HRTech
Alliance) sırasıyla üretildi ve test edildi (bkz. yukarıdaki bölümler).
**Ana sayfada artık kaynak sitedeki hiçbir bölüm eksik değil.**
**⏸️ Şu an kullanıcının GRUP 3'ü (dolayısıyla tüm ana sayfayı) onaylaması
bekleniyor** — onay sonrası ana sayfa migrasyonu resmen kapanacak.

Diğer açık nokta:
1. KARAR 2 (kaynakta olmayan çeviriler için yeni sayfa üretimi — seyahat
   NL/IT, demirbaş IT gibi) ekiple görüşülüp netleşmeyi bekliyor — bkz.
   "Yapılacaklar (TODO)" bölümü.

Bu bölüm, hesap/oturum geçişlerinde hiçbir şeyin unutulmaması için tutulur.
Detaylar aşağıdaki ilgili bölümlerde; burası sadece "nerede kaldık" özeti.

### ✅ Tamamlanan işler
- **Astro + React island architecture** kurulumu (`@astrojs/react`, TypeScript).
- **i18n routing:** `tr` (varsayılan, prefix'siz) / `en` / `nl` / `it`,
  `astro.config.mjs`'de yapılandırıldı.
- **Tasarım sistemi:** Tailwind v4 (`@theme` tabanlı, config dosyası yok),
  idenfit.com'un gerçek renk paleti (`#FF0000` marka kırmızısı) ve fontu
  (Quicksand) — bkz. "Tasarım sistemi" bölümü.
- **Header:** logo, üst-seviye navigasyon, **mega-menü** (ÜRÜNLER — tam
  6-kolon; SEKTÖRLER/KURUMSAL — basit dropdown; KEŞFET — links/sublist/
  cards karışık), dil değiştirici (`LanguageSwitcher.tsx`), mobil hamburger
  menü (focus-trap + scroll-lock), üstte marquee duyuru barı.
- **Hero bölümü:** `HeroSection.astro` — tek component, 4 dilde de gerçek
  (placeholder değil) metinle çalışıyor; React form (`HeroForm.tsx`,
  `useState`, submit şimdilik `console.log`).
- **Footer:** 4 kolon (marka/iletişim/sosyal + HAKKINDA + ÜRÜNLER + GENEL),
  idenfit.com'dan gerçek link/sosyal medya/e-posta çıkarıldı.
- **i18n metin sistemi (`src/i18n/`):** `nav`, `cta`, `hero`, `footer`, `mega`,
  `headerUi` şemaları; 4 dilde dolu; `astro check` ile tip güvenliği
  doğrulandı (0 hata).
- **Mega-menü ALT içeriği i18n'e taşındı** (`src/data/navigation.ts`):
  ÜRÜNLER'in 4 kolon başlığı + tüm link metinleri + promo başlığı/CTA,
  SEKTÖRLER'in 12 sektör adı, KURUMSAL'ın alt öğeleri, KEŞFET'in tüm alt
  içeriği (İçerikler/Hesaplamalar 8 araç/Raporlar 4 kart — kategori+başlık+
  imageAlt) artık `src/i18n/*.ts`'in `mega` şemasında, 4 dilde profesyonel
  İK/SaaS terminolojisiyle çevrildi (Bordro=Payroll/Salarisadministratie/
  Buste Paga vb.). `navigation.ts` artık yalnızca YAPI (href/icon/layout)
  tutuyor; metinler `buildMegaMenus(t.mega)` fonksiyonuyla enjekte ediliyor
  — bkz. "Mega-menü" bölümü. `MegaMenu.tsx`'teki iki kalan hardcoded metin
  (rapor oku aria-label'ı, "yakında" tooltip'i) de `mega.ui`'den çekiliyor.
  Not: promo'nun "LATER IS NEVER" sloganı bilinçli olarak çevrilmedi (marka
  sloganı, tüm dillerde aynı).
- `HEADER_UI` aria-label'ları (openMenu/closeMenu/brandHome/mainNav/
  langLabel) i18n şemasına taşındı — `src/i18n/*.ts`'in `headerUi` şeması,
  `nav.ts`'den kaldırıldı.
- **WordPress export analizi:** `posts.json`/`pages.json`/`media.json`
  incelendi — kategori/tag listesi, custom field haritası, dil dağılımı
  (blog sadece TR, sayfalar 4 dilde) çıkarıldı.

### 🟡 Yarım kalanlar
- Hero formunun backend/CRM entegrasyonu yok (şimdilik `console.log`).
- Gerçek görseller yerleştirilmedi (hero sağ kolon + ÜRÜNLER promo banner
  hâlâ placeholder) — `uploads.zip` işlenmeyi bekliyor.
- KEŞFET'te "Podcastler" için kesin URL yok, atlandı.
- Navigasyon/footer'daki menü slug'ları henüz gerçek sayfa içeriğine
  bağlanmadı (route'lar var ama sayfalar boş/iskelet).
- ✅ **Sektör sayfaları artık gerçek içerikle çalışıyor (2026-07-21).**
  Önceki "WP'de yok" tespiti yanlıştı (ayrı bir custom post type'taydı,
  bkz. §"Sektör sayfaları — DÜZELTME"); placeholder route'lar gerçek
  içerikle (48 sayfa, doğru per-locale slug'larla) değiştirildi. Detay
  için bkz. §"Sektör sayfaları — GERÇEK İÇERİK UYGULANDI" (Mimari bölümü
  altında).
- Diğer 4 müşteri kartının (Civil/Yatsan/Doğ-Ser/Tuğba Kuruyemiş) video
  embed'i yok, sadece Femaş ve Civil'de kaynakta gerçek YouTube URL'si var
  — diğerleri "Video yakında" gösteriyor (bkz. "Müşteri Başarı Hikayeleri
  sayfası" bölümü). Gerçek video eklenirse `src/data/customerStories.ts`'e
  `videoUrl` eklemek yeterli.

### ✅ Sayfa envanteri çıkarıldı (bkz. docs/page-inventory.md)
170 sayfa + 618 yazının tamamı kategorize edildi, migration önceliği
belirlendi. Üretim script'i: `scripts/page-inventory.mjs`
(`node scripts/page-inventory.mjs` ile yeniden üretilebilir).

**Sayfalar (170):** A-KRİTİK 126 (Ana Sayfa/Hakkımızda/İletişim/Fiyatlar/
KVKK-Gizlilik-Sözleşmeler/Online-Sunum-Talebi-CTA/Ürün-Modül sayfaları —
89'u modül sayfası), B-ÖNEMLİ 34 (Müşteriler/Neden-İdenfit/Güvenlik/
Donanım-Suprema/Global-Marka/SSS/Hesaplama-Araçları/Blog-liste/
Teşekkürler), C-İKİNCİL 3 (Destek Talebi), D-DÜŞÜK/ATILABİLİR 7
(Kampanya + test/taslak sayfalar).

**Önemli bulgular:** (1) NL dilinde KVKK/Gizlilik, Online-Sunum-Talebi-CTA,
Güvenlik, SSS, Teşekkürler, Destek-Talebi kategorilerinin **hiçbirinde
sayfa yok** — sistemik boşluk, net-new içerik gerektiriyor. (2) Suprema
sayfalarının (3 adet) `content.rendered`'ı boş — içerik özel PHP şablonunda,
kurtarmak için `themes.zip` açılmalı. (3) `contact-2` (NL) slug'ı yanıltıcı,
gerçekte iletişim sayfası değil ("duyurular"). (4) Sektör sayfaları ve
müşteri hikayesi sayfaları export'ta hiç yok, sıfırdan yazılacak.

**Blog (618 yazı) migration sırası:** Güncel Bilgiler (hâlâ aktif
güncelleniyor, en son 2026-07-11) → Dijital İK (ürünle örtüşüyor) →
İK Akademi (337, en büyük, fazlara bölünmeli) → İK Trendleri (159) →
küçük kategoriler → Yaklaşan Etkinlikler (bayat, önce içerik gözden
geçirilmeli) → Geçmiş Etkinlikler (arşiv, en düşük öncelik).

Detaylı tablo/liste/gerekçe için: **`docs/page-inventory.md`**.

### ✅ İki mimari karar uygulandı: NL fallback + Sektör placeholder'ı (⚠️ ikincisinin öncülü sonradan yanlış çıktı, bkz. aşağıdaki iki düzeltme notu)
Sayfa envanterinde tespit edilen (biri gerçek, biri yanlış çıkan) iki
boşluğa — NL'de kritik sayfa eksikliği (gerçek), sektör sayfalarının WP'de
hiç var olmadığı sanılması (yanlış çıktı) — karşı somut yapı kuruldu —
detaylı gerekçe için bkz. "NL içerik fallback'i" ve "Sektör placeholder'ı"
bölümleri (aşağıda, Mimari bölümünün altında).

**KARAR 1 — NL fallback:** `astro.config.mjs`'e Astro'nun **yerleşik**
`i18n.fallback` + `routing.fallbackType: 'redirect'` özelliği eklendi
(`fallback: { nl: 'en' }`). NL'de bir sayfa yoksa (KVKK, Gizlilik, Güvenlik,
SSS, İletişim, Online Sunum Talebi, Teşekkürler, Destek Talebi — bkz.
page-inventory §3.6) `/nl/<slug>/` isteği build zamanında üretilen statik
bir redirect sayfası üzerinden otomatik olarak `/en/<slug>/`'e yönlendirilir
— **sessiz redirect**, bildirim banner'ı yok (bkz. gerekçe aşağıda).
Middleware/SSR gerekmedi, statik build'de sorunsuz çalışıyor — `astro dev`
üzerinde geçici bir test sayfasıyla (`/nl/fallback-test-temp/` →
302 → `/en/fallback-test-temp/`) doğrulandı, test dosyası silindi.

**KARAR 2 — Sektör placeholder'ı:** 12 sektör sayfası (4 dilde,
`src/pages/[sectorSlug].astro` + `en/nl/it` eşdeğerleri, tek
`getStaticPaths()` ile `src/data/navigation.ts`'teki `SECTOR_ITEMS`'tan
üretiliyor — mega-menü de aynı listeyi kullanıyor, tek kaynak) oluşturuldu.
Ortak `PlaceholderPage.astro` component'i: başlık + "yakında içerik
eklenecek" mesajı (`t.placeholder.comingSoon`, yeni i18n anahtarı, 4 dilde
dolduruldu) + Online Sunum Talebi CTA'sı (mevcut `t.cta.requestDemo`
metni yeniden kullanıldı, yeni çeviri gerekmedi). `BaseLayout` kullanıyor,
header/footer görünür. Test edildi: `/gida-sektoru-ik-cozumleri/` (tr),
`/en/gida-sektoru-ik-cozumleri/`, `/it/sanayi-otomotiv-ik-cozumleri/` —
hepsi 200, doğru başlıkla render ediliyor.

**Düzeltme (2026-07-21, aynı gün):** İlk turda "Müşteri Hikayeleri" için
ayrı, içeriksiz bir `musteri-hikayeleri.astro` placeholder'ı da
oluşturulmuştu — bu **yanlış bir kurguydu**, silindi. Gerçek durum:
idenfit.com'da MÜŞTERİLER menüsü `/musteriler/`'e gidiyor ve orada ACF
alanlarında (`femas_*`, `civil_*`, `yatsan_*`, `dog-ser_*`,
`tugba_kuruyemis_*` — CLAUDE.md ACF analizinde zaten belirtilmişti)
**gerçek, dolu içerik** var — placeholder değil, migrate edilecek gerçek
bir sayfa. `/musteriler/` artık bu gerçek içerikle 4 dilde kuruldu — bkz.
"Müşteri Başarı Hikayeleri sayfası (/musteriler/)" bölümü. `nav.ts` ve
`footer.ts` zaten `musteriler` slug'ına doğru bağlıydı, değişiklik
gerekmedi.

**İkinci düzeltme (2026-07-21, aynı gün):** KARAR 2'nin kendisi de yanlış bir
öncüle dayanıyordu — "sektör sayfaları WP'de hiç yok" tespiti hatalıydı.
Gerçekte 12 sektörün 4 dilde (48 sayfa) tam içeriği var, ama ayrı bir custom
post type'ta (`sectors`, `pages.json`/`posts.json`'da değil).

**✅ Üçüncü adım (2026-07-21, aynı gün): 12 placeholder route gerçek
içerikle değiştirildi.** `reference/wordpress-export/sectors.json`'daki
48 gerçek sayfa artık `SectorPage.astro` (tek component, veri-kaynaklı) +
`getStaticPaths()` üzerinden üretiliyor; EN/NL/IT rotaları TR ile aynı
slug'ı VARSAYMIYOR, her locale'in gerçek WP slug'ını kullanıyor (ör. EN
`food` sektörü `/en/food-and-beverages-sector-hr-solutions/`); mega-menü
SEKTÖRLER linkleri de aynı gerçek slug'larla güncellendi. Detay için bkz.
§"Sektör sayfaları — GERÇEK İÇERİK UYGULANDI" (Mimari bölümü altında).

Detaylı teknik gerekçe (neden middleware değil, neden sessiz redirect, WP'nin
kendi EN/IT/NL çevirilerinin neden kullanılmadığı, sektör içeriğinin gerçekte
nerede olduğu, CTA URL'lerinin nasıl yeniden çözüldüğü vb.) için bkz.
§"NL içerik fallback'i", §"Sektör placeholder'ı" (artık tarihi — supersede
edildi), §"Sektör sayfaları — DÜZELTME", §"Sektör sayfaları — GERÇEK İÇERİK
UYGULANDI" ve §"Müşteri Başarı Hikayeleri sayfası" (Mimari bölümü altında).

### ⏭️ Sıradaki adım
Sayfa envanterine göre migration'a başlamak — CLAUDE.md §"Önerilen
migration sırası (haftalık)"ndaki plana göre Hafta 1 kritik statik
sayfalardan (Hakkımızda, İletişim, Fiyatlar, KVKK) başlanabilir. NL fallback
kurulduğu için bu sayfalar hangi sırayla eklenirse eklensin site
kırılmayacak (NL boşlukları otomatik EN'e düşüyor). Sektör sayfaları artık
gerçek içerikle canlı; kalan tek TODO, feature bloklarının linklediği ürün
modül sayfaları gerçekten kurulduğunda hangi slug konvansiyonunun
kullanılacağına karar vermek (bkz. §"Sektör sayfaları — GERÇEK İÇERİK
UYGULANDI" içindeki not).

## Mimari (Astro + React Island Architecture)

Bu proje **Astro + React island architecture** kullanır. TypeScript kullanılır.

- **Statik / içerik odaklı kısımlar** `.astro` dosyaları olarak yazılır.
- **İnteraktif kısımlar** (form, arama, filtreleme, slider, menü, modal, dil
  değiştirici vb.) **React** (`.jsx` veya `.tsx`) ile yazılır.
- React component'leri Astro sayfalarında **hydration direktifleriyle**
  kullanılır: `client:load`, `client:visible`, `client:idle` vb.
- Varsayılan olarak `.astro` tercih edilir; React yalnızca client-side
  etkileşim gerektiğinde eklenir (gereksiz JS gönderme).

### i18n (Astro built-in routing)
`astro.config.mjs` içinde yapılandırıldı:
- `locales: ["tr", "en", "nl", "it"]`, `defaultLocale: "tr"`
- `routing.prefixDefaultLocale: false` → Türkçe prefix'siz kökte (`/`),
  diğer diller prefix'li (`/en/`, `/nl/`, `/it/`).

### i18n metin sistemi (src/i18n/) — merkezi çeviri sözlüğü
Sayfa/component metinleri **koda gömülmez**, `src/i18n/` altında merkezi
tutulur:
- `src/i18n/types.ts` — şema: `Translations = { nav, cta, hero, footer, mega,
  headerUi }` (`NavLabels`, `CtaLabels`, `HeroLabels`, `FooterLabels`,
  `MegaLabels`, `HeaderUiLabels`).
- `src/i18n/{tr,en,nl,it}.ts` — her biri `export const xx: Translations = {...}`
  ile **aynı şemaya** uyar. Bir dilde anahtar eksik/fazlaysa **TypeScript
  derleme zamanında hata verir** (tip güvenliği — `tr.ts` "ana kaynak").
- `src/i18n/index.ts` — `getTranslations(locale)` → ilgili dilin sözlüğünü
  döner (bilinmeyen/eksik locale'de `tr`'ye düşer).

**Kullanım deseni (Astro tarafı, sunucu):**
```astro
---
import { getTranslations } from '../i18n';
const t = getTranslations(Astro.currentLocale ?? 'tr');
---
<h1>{t.hero.title}</h1>
```
**React island'lara** çeviri STRING olarak prop'la geçirilir (React
component'i `getTranslations`'ı kendi çağırmaz — bu sunucu/Astro
tarafının işi); bkz. `HeroForm.tsx`'in `labels` prop'u, `MegaMenu.tsx`'in
resolved metin prop'ları.

**Taşınanlar (tamamlandı):** `nav` (8 üst-menü etiketi — ÜRÜNLER vb.),
`cta` (login/requestDemo/submit), `hero` (başlık/açıklama/form
etiketleri/KVKK notu/yan panel metinleri), `footer` (4 kolon), `mega`
(mega-menü ALT içeriği — bkz. aşağı), `headerUi` (aria-label'lar).
`src/data/nav.ts`'teki `NAV_ITEMS` artık metin değil, `key: keyof
Translations['nav']` referansı tutar — gerçek metin `src/i18n/*.ts`'den
gelir. `src/data/navigation.ts`'teki `buildMegaMenus(mega)` fonksiyonu da
aynı desenle çalışır: yapı (href/icon/layout) burada sabit, metin
`mega`'dan enjekte edilir (bkz. "Mega-menü" bölümü).

### Tip güvenliği doğrulaması: `astro check`
`@astrojs/check` + `typescript` dev bağımlılık olarak eklendi. i18n
şemasının gerçekten hata yakaladığını doğrulamak (ör. bir dilde eksik
anahtar) için `npx astro check` çalıştırılabilir — VS Code'un canlı dil
sunucusu diagnostics'i zaman zaman önbellekten stale sonuç dönebiliyor,
`astro check` gerçek/güncel derleme sonucudur.

### NL içerik fallback'i (mimari karar, 2026-07-21)
Sayfa envanterinde (`docs/page-inventory.md` §3.6) NL dilinde KVKK,
Gizlilik, Güvenlik, SSS, İletişim, Online Sunum Talebi, Teşekkürler, Destek
Talebi sayfalarının **hiçbirinin** WordPress kaynağında var olmadığı tespit
edildi — bu bir migration eksiği değil, kaynak sitede zaten eksik. Karar:
NL'de bu sayfalar yazılana kadar `/nl/<slug>/` istekleri otomatik olarak
`/en/<slug>/`'e düşsün.

**Nasıl kuruldu:** Middleware/custom redirect listesi YAZILMADI — Astro'nun
kendi yerleşik `i18n.fallback` + `i18n.routing.fallbackType` özelliği
kullanıldı (`astro.config.mjs`):
```js
i18n: {
  routing: { prefixDefaultLocale: false, fallbackType: 'redirect' },
  fallback: { nl: 'en' },
}
```
Bu, tamamen **statik build'de** çalışır (SSR/adapter gerekmez) — Astro,
`src/pages/nl/<slug>.astro` yoksa ama `src/pages/en/<slug>.astro` varsa,
build sırasında `dist/nl/<slug>/index.html`'i otomatik bir redirect sayfası
olarak üretir. NL'de gerçek bir sayfa eklendiği an (aynı slug'la) fallback
o sayfa için kendiliğinden devre dışı kalır — elle bakım gerektiren bir
liste yok.

**Neden middleware değil:** Bu proje `output: 'static'` (adapter yok, bkz.
"Mimari" bölümü başı). Astro middleware yalnızca `astro dev` ve SSR
çıktısında çalışır; saf statik build'de deploy edilen dosyalar sunucusuz
sunulduğu için middleware'in production'da hiçbir etkisi olmaz — dev'de
çalışıyor gibi görünüp production'da sessizce hiçbir şey yapmayan bir
çözüm inşa etmemek için middleware'den kaçınıldı. `i18n.fallback` bunun
resmi, statik-build'e uygun karşılığı.

**Neden sessiz redirect (bildirim banner'ı yok):** Astro'nun otomatik
ürettiği redirect sayfasına "NL kullanıcısı EN'e düştü" bilgisini taşıyacak
bir hook (query param, state) yok — bunu eklemek için ya Astro'nun
otomatik mekanizmasını bypass edip elle redirect sayfaları yazmak ya da
SSR'a geçmek gerekirdi; ikisi de bu basit UX iyileştirmesi için orantısız
altyapı maliyeti. Kullanıcı "sessiz yönlendirme de olur" demişti, o karar
kullanıldı. İleride SSR'a geçilirse (ör. başka bir nedenle) bu karar gözden
geçirilebilir.

**Test:** Geçici `src/pages/en/fallback-test-temp.astro` oluşturulup
`/nl/fallback-test-temp/` istendi → `302 Found`, `Location: /en/fallback-test-temp/`
doğrulandı, test dosyası silindi.

### Sektör placeholder'ı (mimari karar, 2026-07-21 — ⚠️ ÖNCÜLÜ YANLIŞ ÇIKTI, bkz. aşağıdaki "DÜZELTME" bölümü)
12 Sektör sayfası için WordPress kaynağında hiç içerik **olmadığı
düşünülmüştü** (idenfit.com'da bağımsız bir `/sektorler/` genel bakış
sayfası da yok — 404, bkz. "Mega-menü" bölümü — bu kısım hâlâ doğru, ama
her sektörün KENDİ sayfasının içeriksiz olduğu varsayımı yanlıştı, bkz.
aşağı). O sırada verilen karar: gerçek içerik gelene kadar basit, 4 dilde
çalışan placeholder sayfalar.

- **Ortak component:** `src/components/PlaceholderPage.astro` — `BaseLayout`
  (header/footer görünür) + `PlaceholderSection.astro` (başlık + mesaj +
  CTA). Mesaj: yeni `t.placeholder.comingSoon` i18n anahtarı (tek satır, 4
  dilde çevrildi — çeviri yükü minimum). CTA: **yeni çeviri eklenmedi**,
  mevcut `t.cta.requestDemo` ("Online Sunum Talebi") yeniden kullanıldı,
  hedef `online-sunum-talebi` (Header.astro'daki ana CTA ile aynı).
- **Sektörler:** `src/data/navigation.ts`'teki `SECTOR_ITEMS` (slug + i18n
  anahtarı + ikon) artık **tek kaynak** — hem mega-menünün SEKTÖRLER
  dropdown'u hem de placeholder sayfalar aynı listeyi kullanıyor (önceden
  mega-menüde hardcoded 12 satırdı, buildMegaMenus() da bu listeye
  refactor edildi). Route'lar: `src/pages/[sectorSlug].astro` (tr) +
  `en/nl/it` eşdeğerleri, `getStaticPaths()` ile 12 slug'ı statik olarak
  üretiyor (build-time'da 12 gerçek HTML dosyası, catch-all/wildcard
  DEĞİL — ileride bu slug'lardan biri gerçek içerikle değiştirilmek
  istenirse ilgili dinamik route'tan çıkarılıp ayrı bir statik sayfa
  yazılabilir, çakışma olmaz).

**Test (o zamanki placeholder için):** `/gida-sektoru-ik-cozumleri/`,
`/en/gida-sektoru-ik-cozumleri/`, `/it/sanayi-otomotiv-ik-cozumleri/` —
hepsi `200`, doğru dilde başlık + CTA ile render edildiği doğrulandı.

> **⚠️ Bu bölüm artık tarihi.** `PlaceholderPage.astro`/`PlaceholderSection.astro`
> ve `t.placeholder` i18n şeması **silindi** — sektör sayfaları gerçek
> içerikle değiştirildiği için placeholder'a ihtiyaç kalmadı (bkz. hemen
> altındaki §"Sektör sayfaları — GERÇEK İÇERİK UYGULANDI"). `/en/gida-sektoru-ik-cozumleri/`
> gibi eski varsayılan slug'lar artık **404** — gerçek slug'lar farklı.

### Sektör sayfaları — DÜZELTME: içerik var, yanlış yerde arandı (2026-07-21)
Kullanıcı idenfit.com'da `gida-sektoru-ik-cozumleri` sayfasının canlıda
gerçekten açıldığını bildirince araştırıldı: **"sektör sayfaları WP'de hiç
yok" tespiti (hem ilk page-inventory'de hem KARAR 2'de) yanlıştı.**

**Kök sebep:** Sektör sayfaları `page` veya `post` post type'ında değil,
ayrı bir **custom post type**'ta (`sectors`, WP REST API'de
`/wp-json/wp/v2/sectors`) duruyor. Elimizdeki `pages.json`/`posts.json`
export'u yalnızca `page` ve `post` endpoint'lerini çekmiş — `sectors` CPT'si
export'a hiç dahil edilmemiş (export'u alan script muhtemelen yalnızca
`wp/v2/pages` ve `wp/v2/posts`'u sorgulamış, `wp/v2/types` ile mevcut tüm
post type'ları keşfetmemiş). Aynı export'ta gözden kaçmış olabilecek başka
CPT'ler de var: `faq` (rest_base `faq`) ve `portfolio` — bunlar bu oturumda
araştırılmadı, ileride kontrol edilmeli.

**Doğrulama adımları (sırasıyla denendi):**
1. `wp/v2/pages?slug=gida-sektoru-ik-cozumleri` → `[]` (boş)
2. `wp/v2/posts?slug=gida-sektoru-ik-cozumleri` → `[]` (boş)
3. `wp/v2/types` → yanıtta `sectors` (custom post type, rest_base `sectors`) bulundu — ayrıca `faq` CPT'si de fark edildi
4. `wp/v2/sectors?slug=gida-sektoru-ik-cozumleri` → **gerçek, dolu içerik** (ACF alanları dolu)
5. `wp/v2/sectors?per_page=100` → tüm 49 kayıt (12 sektör × 4 dil = 48 + 1 öksüz taslak) tek seferde çekildi

**Gerçek kapsam:** 12 sektörün **tamamı 4 dilde de var** (48 gerçek sayfa,
hiçbiri eksik değil) — `pll_translations` alanı her sektör grubunu 4 dile
bağlıyor. Ayrıca `id 20347`, slug `sectors`, yalnızca EN'de, TR/NL/IT
karşılığı yok, başlığı düz küçük harf "sectors" — taslak/öksüz bir kayıt,
12'lik gruba dahil edilmedi, ayrıca not edildi.

**İçerik yapısı (ACF, `section_N_*` + `feature_N_*` alanları):**
- **Hero** (`section_1_*`): başlık, metin, CTA metni/URL'si, görsel.
- **"Neden idenfit?" bloğu** (`section_2_*`): başlık, uzun açıklama metni, görsel.
- **Çapraz-sektör tanıtımı** (`section_3_*`): ⚠️ bu blok o sayfanın KENDİ
  içeriği DEĞİL — başka bir sektöre link veren bir tanıtım kartı (ör.
  Gıda sayfasında "Turizm Sektörü" kartı görünüyor, `/turizm-sektoru-ik-cozumleri/`'ne
  gidiyor). Muhtemelen "ilgili sektörlere göz atın" tarzı bir widget.
- **Özellik/modül vurgu blokları** (`feature_title/text/cta_text/cta_url/image_{1..4}`):
  sektöre özel 2-4 modül vurgusu, her biri gerçek bir idenfit modül sayfasına
  linkliyor (ör. Gıda sayfasında PDKS/Eğitim/Vardiya Yönetimi — PDKS modülü
  `/pdks-modulu/`'ne, Eğitim `/calisan-egitim-yonetimi-modulu/`'ne gidiyor).
  Blok sayısı **sabit değil** — bazı sektörlerde 2, bazılarında 4; hatta
  **aynı sektörün farklı dillerindeki versiyonları bile farklı sayıda blok**
  içerebiliyor (ör. `dagitim-lojistik`: TR'de 2 blok, EN/NL/IT'de 3 blok —
  TR versiyonu daha eksik; `hizmet-sektoru`: tam tersi, TR'de 4 blok,
  diğer 3 dilde 2 blok).
- **Bilinen içerik boşluğu (kaynakta, migration'dan bağımsız):** Turizm
  sektörünün IT versiyonunda (`/it/soluzioni-hr-settore-turismo/`) sayfa
  başlığı (`title.rendered`) tamamen **boş** — idenfit.com'un kendi
  sitesinde var olan bir eksiklik, export/migration hatası değil.

**Kaydedildiği yer:** `scripts/fetch-sectors.mjs` (Node, proje kuralına
uygun) → `reference/wordpress-export/sectors.json` (233 KB, 12 sektör grubu
× 4 dil, medya nesneleri sadeleştirilmiş — yalnızca `url`/`alt`/`width`/`height`).
Script yeniden çalıştırılabilir: `node scripts/fetch-sectors.mjs`.

**Önemli ek bulgu — locale slug'ları TR ile aynı DEĞİL:** Şu anki 12
placeholder route'u (`SECTOR_ITEMS`, `src/data/navigation.ts`) tüm
locale'lerde AYNI TR-kökenli slug'ı kullanıyor (ör.
`/en/gida-sektoru-ik-cozumleri/`) — bu, sitenin genelindeki "tek canonical
slug, `l()` ile prefixlenir" konvansiyonuyla tutarlıydı. Ama gerçek
idenfit.com'da her dilin **kendi, tamamen farklı slug'ı** var:

| Sektör (TR slug) | EN gerçek path | NL gerçek path | IT gerçek path |
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

(TR slug'ları zaten `SECTOR_ITEMS`'takiyle birebir eşleşiyor — TR route'larda
değişiklik gerekmiyor, yalnızca EN/NL/IT'ninkiler farklı.) Bu, sitenin
"tek canonical slug" konvansiyonunu ihlal ediyor. **Bu bulgu aynı gün,
hemen aşağıdaki bölümde gerçek uygulamaya dönüştürüldü** — route'lar artık
bu tabloyu değil, `sectors.json`'ın kendi `link` alanından türetilen
gerçek slug'ları kullanıyor (elle transkripsiyon hatası riski olmadan).

### Sektör sayfaları — GERÇEK İÇERİK UYGULANDI (2026-07-21, aynı gün)
Yukarıdaki DÜZELTME'de bulunan 48 gerçek sayfa, 12 placeholder route'un
yerine gerçek içerikle uygulandı.

**Veri katmanı — `src/data/sectorContent.ts`:** `reference/wordpress-export/sectors.json`'ı
(`resolveJsonModule` zaten Astro'nun strict tsconfig preset'inde açık,
ekstra config gerekmedi) tipli bir forma sokan tek dosya. Üç önemli
fonksiyon:
- `listSectorSlugs(locale)` — `getStaticPaths()` için {trSlug, localeSlug}
  listesi, `sectors.json`'daki her locale girdisinin **`link` alanından**
  türetilir (WP'nin `slug` alanı güvenilmez — bkz. aşağıdaki `hizmet-sektoru`
  vakası).
- `getSectorSlug(trSlug, locale)` — bir sektörün belirli dildeki gerçek
  route slug'ı.
- `getSectorContent(trSlug, locale)` — tam içerik + **yeniden çözülmüş CTA
  URL'leri** (aşağıda).

**Bulunan ikinci veri hatası — `fetch-sectors.mjs`'in kendi hatası:**
Script ilk halinde sektör gruplarını WP'nin `slug` alanına göre grupluyordu
(`tr.slug`). "Hizmet Sektörü" için bu alan `hizmet-sektoru` idi ama gerçek
`link` `.../hizmet-sektoru-ik-cozumleri/` idi (diğer 11 sektörde ikisi
tesadüfen aynıydı, bu yüzden fark edilmedi). Sonuç: mega-menüde Hizmet
Sektörü linki eksik kalıyordu (`SECTOR_ITEMS`'taki slug `sectors.json`'daki
grup anahtarıyla eşleşmiyordu). **Düzeltme:** `fetch-sectors.mjs` artık
`trSlug`'ı da `link`'ten türetiyor (`bareSlugFromLink()`), script yeniden
çalıştırıldı, `sectors.json` yeniden üretildi. Ders: bu proje boyunca WP'nin
`slug` alanına ne zaman güvenilse (hem sayfa/dil bazında hem CPT-gruplama
bazında) bir tutarsızlık çıktı — **`link` her zaman otoriter, `slug` hiçbir
zaman değil.**

**CTA URL çözümleme — üç ayrı durum (`localizeCtaUrl()`):** ACF'ten gelen
ham CTA URL'leri (ör. `https://idenfit.com/tr/pdks-modulu/`) doğrudan
kullanılamazdı çünkü WP kaynağı locale başına **tutarsız** slug'lar
kullanıyor — gerçek örnekler:
1. **"Online Sunum Talebi" hedefi** — TR'de `online-sunum-talep-et`, EN'de
   `request-online-presentation` (bazen locale önekisiz), IT'de
   `richiedi-presentazione-online`. Bunların hiçbiri bizim sitenin
   kullandığı canonical slug'la (`online-sunum-talebi`) eşleşmiyor →
   üçü de tanınıp bizim slug'ımıza çevriliyor.
2. **Çapraz-sektör tanıtımı (`relatedSectorPromo`)** — kaynakta **12
   sektör sayfasının TAMAMI, kendisi dahil, her zaman "Turizm/Tourism"u
   tanıtıyor** (bariz bir statik/hiç özelleştirilmemiş Elementor widget'ı,
   gerçek "ilgili sektör" mantığı değil — Turizm'in kendi sayfası bile
   kendini tanıtıyor). Daha da kötüsü, **NL sayfalarındaki bu blok yanlış
   slug kullanıyor** — NL'in kendi `toerisme` slug'ı yerine İngilizce
   `tourism-sector-hr-solutions`'ı (locale öneki bile eksik) referans
   alıyor. Ham metne güvenmek yerine, bu link **her zaman** kendi
   `sectors.json` verimiz üzerinden (bareSlug → trSlug ters-eşleme →
   doğru locale'in gerçek slug'ı) çözülüyor — NL vakası dahil doğru
   sonuç garantili. Kullanıcının "aynen bırak" dediği tek hata sayfa
   BAŞLIĞıydı (IT Turizm), bu linkler DEĞİL — bu yüzden linkler
   düzeltildi, başlık dokunulmadan bırakıldı (aşağıda).
3. **Ürün/modül sayfası linkleri (feature blokları)** — kaynaktaki
   per-locale slug aynen taşınıyor (`l(bareSlug)`). Bunlar henüz bizim
   sitede **hiçbir konvansiyonla** kurulmadı (module sayfaları
   page-inventory'nin Hafta 2-4 planında) — **TODO:** modül sayfaları
   gerçekten inşa edilirken şu ikilem çözülmeli: bizim sitenin genelinde
   zaten kurulu "tek TR-kökenli canonical slug, her locale'de aynı"
   konvansiyonu mu (Header/Footer/MegaMenu'nün ÜRÜNLER linkleri gibi)
   kullanılacak, yoksa WP'nin gerçek per-locale slug'ları mı (ör. EN PDKS
   modülü gerçekte `time-attendance-module`, bizim sitede şu an
   `pdks-modulu`)? Bu karar bu oturumun kapsamı dışında bırakıldı.

**IT Turizm başlık hatası — kullanıcı talimatına göre aynen bırakıldı:**
WP'nin `post_title` (title.rendered) alanı IT Turizm'de boş — kaynak
sitenin kendi hatası (bkz. DÜZELTME bölümü). Bu **düzeltilmedi**. Ama
görünen sayfa kırık değil: gerçek H1 başlığı ACF `section_1_title`
alanından geliyor (bu alan "Tourism" ile dolu) — `getSectorContent()`'teki
`pageTitle` mantığı önce ACF hero başlığına bakıyor, post_title'a değil
(bu, "boş bırak ama sayfayı kırma" talimatını doğal olarak karşılıyor;
post_title alanına ayrıca dokunulmadı/yamanmadı).

**Görseller:** Talimat #6 gereği tamamen dokunulmadı — `sectors.json`'daki
gerçek idenfit.com WP `wp-content/uploads` URL'leri hotlink olarak
kullanılıyor (`SectorPage.astro`/`SectorFeatureCard.astro`). Görsel yoksa
(nadiren) basit bir ikon placeholder'ı gösteriliyor.

**Component'ler:** `SectorPage.astro` (hero + "Neden idenfit?" bloğu +
modül vurgu kartları grid'i + çapraz-sektör promo kartı, hepsi `BaseLayout`
içinde) + `SectorFeatureCard.astro` (tekrar kullanılan kart). Modül vurgu
blok sayısı **veri kaynaklı, sabit değil** — kaynakta 2 ile 4 arasında
değişiyor, hatta **aynı sektörün farklı dillerinde bile farklı sayıda**
(ör. `dagitim-lojistik`: TR'de 2, EN/NL/IT'de 3 — TR versiyonu eksik;
`hizmet-sektoru`: tam tersi, TR'de 4, diğer 3 dilde 2).

**Route'lar:** `src/pages/[sectorSlug].astro` (tr) + `en/nl/it` eşdeğerleri,
`getStaticPaths()` artık `listSectorSlugs(locale)`'dan geliyor (48 gerçek
slug, `SECTOR_ITEMS`'ın varsayılan tek-slug'ı DEĞİL). Mega-menü:
`buildMegaMenus(mega, locale)` artık `locale` parametresi alıyor,
SEKTÖRLER linkleri `getSectorSlug(s.slug, locale)` ile çözülüyor
(`Header.astro`'daki çağrı güncellendi: `buildMegaMenus(t.mega, currentLocale)`).

**Temizlik:** Artık kullanılmayan `PlaceholderPage.astro`,
`PlaceholderSection.astro` ve i18n `placeholder` şeması (4 dil dosyası +
`types.ts`) silindi.

**Test:** `astro check` 0 hata, `astro build` 56 sayfa (48 sektör dahil)
hatasız üretti. curl ile doğrulananlar: `/gida-sektoru-ik-cozumleri/` (tr,
200), `/en/food-and-beverages-sector-hr-solutions/` (200, gerçek EN slug),
`/en/gida-sektoru-ik-cozumleri/` (eski varsayım — artık **404**, beklenen),
`/nl/eten-dranken/` (200), `/it/soluzioni-hr-settore-turismo/` (200, H1
"Tourism" — boş değil), tüm 12 sektörün EN mega-menü linkleri (12/12 doğru
gerçek slug, `hizmet-sektoru` düzeltmesi dahil), TR/EN hero CTA'ları doğru
`online-sunum-talebi` hedefine gidiyor, NL'deki çapraz-sektör promosu
kaynaktaki hatalı slug'a rağmen doğru `/nl/toerisme/`'e çözülüyor.
`astro build` sonrası (production build test'inin bilinen yan etkisi
olarak, bkz. daha önceki oturumdaki `_jsxDEV` regresyonu) `node_modules/.vite`
temizlenip dev server temiz yeniden başlatıldı, loglar hatasız.

### Sektör sayfalarında dil değiştirici düzeltmesi (2026-07-21, aynı gün)
Sektör sayfaları gerçek içerikle uygulandıktan hemen sonra bulunan bug:
`Header.astro`'daki `LanguageSwitcher`, her locale için **"aynı slug +
farklı prefix"** varsayımıyla URL üretiyordu (`/nl/` gibi bir prefix ekleyip
geri kalan path'i aynen koruyarak) — sektör sayfalarında bu **yanlış URL**
üretiyordu, çünkü her dilin slug'ı gerçekten farklı (bkz. yukarıdaki
tablo). Ör. `/gida-sektoru-ik-cozumleri/`'deyken EN'e geçmek, var olmayan
`/en/gida-sektoru-ik-cozumleri/`'ye gidiyordu — gerçek EN sayfası
`/en/food-and-beverages-sector-hr-solutions/`.

**Çözüm — genel mekanizmaya dokunmadan, opt-in override:**
- `Header.astro`'ya opsiyonel `localeUrls?: Partial<Record<Locale, string>>`
  prop'u eklendi. Verilmezse (site genelindeki tüm diğer sayfalarda olduğu
  gibi) eskisi gibi otomatik "aynı slug + prefix" hesaplanır — **hiçbir
  başka sayfa etkilenmedi** (ana sayfa, `/musteriler/` vb. hâlâ eski
  mantıkla çalışıyor, ikisi de test edildi). Verilirse, override edilen
  locale'ler için otomatik hesaplananın yerini alır (`{ ...generic,
  ...override }` — kısmi override de mümkün).
- `BaseLayout.astro` aynı prop'u kabul edip `Header`'a iletiyor.
- `sectorContent.ts`'e yeni `getSectorLocaleUrls(trSlug)` eklendi — bir
  sektörün 4 dildeki TAM (locale-prefix'li) gerçek URL'lerini
  `SLUG_INDEX`'ten (zaten `link` alanından türetilmiş, otoriter) üretir.
- `SectorPage.astro` yeni `localeUrls` prop'unu alıp `BaseLayout`'a iletiyor;
  4 route dosyası (`[sectorSlug].astro` + `en/nl/it`) `getSectorLocaleUrls(trSlug)`'ı
  hesaplayıp geçiyor.

**Test:** `scripts/test-sector-language-switch.mjs` (Node, proje kuralına
uygun) — dev server'a gerçek HTTP istekleri atarak her sektör için
TR→EN→NL→IT zincirini test ediyor: TR sayfasını çeker, o sayfanın SSR
HTML'ine gömülü `LanguageSwitcher` astro-island'ının `urls` prop'unu
(Astro'nun `[0, value]` serileştirme formatını çözerek) okur, EN URL'ine
gider, ORADAN gelen switcher'ın NL URL'ine gider, ordan da IT'ye — gerçek
tarayıcı davranışını birebir taklit eder (sabit bir slug listesi değil,
her adımda sayfanın kendi ürettiği switcher verisini kullanır).
**Sonuç: 36/36 geçiş başarılı** (12 sektör × 3 geçiş). Çalıştırma:
`node scripts/test-sector-language-switch.mjs` (dev server ayakta olmalı).
Ayrıca ana sayfa ve `/musteriler/`'in generic switcher'ının bozulmadığı
ayrıca curl ile doğrulandı. Bonus: `MobileMenu.tsx`'in kendi dil
değiştiricisi de aynı `localeUrls` değişkenini `Header.astro`'dan aldığı
için otomatik düzeldi — ayrı bir prop akışı kurmaya gerek kalmadı.

### Ürün/modül sayfaları — Aşama 1 (PDKS, ✅ ONAYLANDI)
89 ürün/modül sayfası (Bordro, PDKS, İzin vb.) için 3 aşamalı, onay
kapılı bir rollout planlandı: **Aşama 1** — 1 sayfa pilot (bu bölüm,
**onaylandı**), **Aşama 2** — 5 sayfa daha (✅ tamamlandı, bkz. aşağıdaki
ayrı bölüm), **Aşama 3** — kalan ~83 sayfa, onay bekliyor.

**Kaynak yapı (`pdks-modulu`, id 11364) — sektörlerden farklı bir ACF
şeması:** `section_1_*` (hero: başlık/metin/CTA/görsel) + `section_2_*`
ile `section_10_*` arası **9 içerik bloğu** (her biri başlık + zengin
metin — bazen HTML `<p>`/`<strong>`/`<ul>` içeriyor, sektörlerin aksine
düz metin değil — + opsiyonel CTA + opsiyonel görsel) + `question_1..20`/
`answer_1..20` **20 SSS çifti**. Alan adları tutarsız (`section_3_text_-_1`,
`section_9_text_2` gibi — CLAUDE.md'nin ACF analizinde zaten "normalize
edilmeli" diye not edilmişti) — `extractSections()` bunu regex ile
(`section_N_text*` desenine uyan TÜM alanları toplayıp birleştirerek)
sağlam şekilde çözüyor, tek bir sabit alan adı varsaymıyor.

**4 dil karşılaştırması — yapı tutarlı, içerik kalitesi değil:**
`pll_translations` üzerinden TR (11364) / EN (11482) / NL (20310) / IT
(23287) bulundu. 4 dilin de **9 içerik bloğu + 20 SSS** ile yapısal
olarak birebir aynı olduğu doğrulandı. Ama iki gerçek içerik kalitesi
sorunu bulundu (kaynak sitenin kendi hataları, migration hatası değil):
1. **SSS bölümü YANLIŞ modülün sorularını gösteriyor.** PDKS sayfasının
   20 SSS'inin **tamamı** ("idenfit performans değerlendirme ölçeği
   nedir?", "360 derece performans değerlendirme nedir?" vb.) aslında
   **Performans Değerlendirme modülüne** ait — muhtemelen o sayfadan
   copy-paste edilmiş ve hiç değiştirilmemiş. Bu 4 dilin hepsinde aynı
   (EN: "What is the Idenfit performance evaluation scale?" vb.) — yani
   çeviri sırasında da fark edilmemiş, kaynak hatası tüm dillere yayılmış.
   **Bu sistemik bir sorun DEĞİL** — kontrol edilen diğer 2 modül sayfası
   (`bordo-onay-modulu`, `ise-alim-modulu`) kendi konularıyla tutarlı,
   doğru SSS'lere sahip. Yani bu PDKS'e özel, izole bir hata — ama Aşama
   2/3'te her sayfa için tek tek kontrol edilmesi gerekecek (89 sayfanın
   hepsinde SSS'nin doğru konuyla eşleştiğini varsaymak güvenli değil).
   **✅ Kullanıcı kararı (2026-07-21, İLK karar — SONRADAN GERİ ALINDI,
   bkz. aşağıdaki 2026-07-21 tarihli "KARAR 1 — SSS geri açıldı" notu):**
   SSS bölümü önce tüm ürün sayfalarında gizlenmişti. **Bu karar aynı gün
   içinde geri alındı** — SSS ARTIK HER YERDE (PDKS dahil) gösteriliyor,
   kaynak sitede ne varsa (doğru ya da yanlış eşleşmiş olsun) olduğu gibi
   taşınıyor, içerik müdahalesi yapılmıyor. PDKS'in yukarıda açıklanan
   yanlış-eşleşmiş 20 SSS'i de dahil olmak üzere, bilinçli olarak
   düzeltilmiyor/gizlenmiyor.
2. **IT içeriği gerçekte çevrilmemiş.** IT sayfasının `section_1_title`/`section_2_title`
   metni kelimesi kelimesine İngilizce ("Why Idenfit Time and Attendance
   System?") — sektör sayfalarında da görülen "IT çevirisi bazen sadece
   İngilizce'nin kopyası" örüntüsünün bir tekrarı (bkz. `clienti` sayfası
   notu). Aynen bırakıldı, düzeltilmedi.
3. **NL'in hero CTA URL'i yanlış locale'e işaret ediyor** (TR'nin
   `online-sunum-talep-et` sayfasına) — sektörlerdeki aynı sınıf hatayla
   aynı, `localizeCtaUrl()`'ün `REQUEST_DEMO_SOURCE_SLUGS` eşlemesi bunu
   otomatik doğru çözüyor (bkz. aşağı), ekstra işlem gerekmedi.

**Yeni dosyalar:**
- `scripts/extract-products.mjs` — **network fetch YOK** (sektörlerin
  aksine, bu içerik zaten yerel `pages.json`'da — bkz. "Ürün/modül
  sayfaları için CPT kontrolü"). `MODULE_TR_SLUGS` listesi şu an yalnızca
  `['pdks-modulu']` — Aşama 2/3 onayı geldiğinde bu listeye eklenip script
  yeniden çalıştırılacak, script'in kendisi zaten herhangi bir modül
  slug'ını işleyebilecek şekilde genel yazıldı. Çıktı:
  `reference/wordpress-export/products.json`.
- `src/data/productContent.ts` — `sectorContent.ts` ile birebir aynı desen
  (`link` alanı otoriter, CTA URL'leri `localizeCtaUrl()` ile yeniden
  çözülüyor, `getProductLocaleUrls()` sektörlerdeki dil değiştirici
  düzeltmesini buraya da taşıyor). Ek olarak `cleanRichText()` (WP zengin
  metnindeki `class`/`style` niteliklerini temizler — kaynak Bootstrap
  benzeri sınıflar bizim Tailwind sistemimizde anlamsız) ve `stripTags()`
  (yalnızca `<title>` etiketi gibi düz metin GEREKEN yerler için — bazı
  ACF başlık alanları ham `<b>` HTML'i içeriyor, bkz. `section_10_title`
  = `"İdenfit PDKS Programı <b>Genel Özellikler</b>"`).
- `src/components/ProductPage.astro` + `ProductSectionBlock.astro` — Hero
  + N içerik bloğu (veri kaynaklı, sabit sayı değil, alternatif zeminle
  art arda). Başlıklar `set:html` ile render ediliyor (ham HTML güvenle
  gösterilsin diye, düz metin interpolasyonu `&lt;b&gt;` gibi kaçmış
  karakterler üretiyordu — bu bulunup düzeltildi). **SSS bölümü her zaman
  render edilir** (`<details>`/`<summary>` accordion — bkz. güncel
  "KARAR 1 — SSS geri açıldı" notu; kaynak sitedeki içerik, doğru ya da
  yanlış eşleşmiş olsun, olduğu gibi gösterilir, biz içerik müdahalesi
  yapmayız).
- 4 statik route dosyası — **bilinçli olarak `getStaticPaths()` tabanlı
  dinamik route DEĞİL** (sektörlerdeki gibi), düz statik `.astro` dosyaları:
  `src/pages/pdks-modulu.astro`, `en/pdks-module.astro`,
  `nl/pdks-module.astro`, `it/modulo-rilevazione-presenze.astro`. Bunun
  nedeni: "SADECE PDKS'i route'la" talimatını mimari olarak da net kılmak
  — bir `getStaticPaths()` listesi yanlışlıkla genişletilip onaysız başka
  sayfalar üretemez. Gerçek per-locale slug'lar (WP `slug` alanı değil,
  `link`'ten): NL `pdks-module` (WP `slug` alanı yanıltıcı şekilde
  `pdks-module-2` diyordu — sektörlerdeki `hizmet-sektoru` hatasıyla aynı
  sınıf sorun, `link` kullanılarak atlatıldı).

**Kasıtlı olarak dokunulmayanlar (onay bekliyor):** `navigation.ts`'teki
ÜRÜNLER mega-menüsünün PDKS linki hâlâ eski "tek canonical TR slug"
varsayımını kullanıyor (`/en/pdks-modulu/` gibi, gerçek `/en/pdks-module/`
değil) — sektörlerde yapılan `buildMegaMenus(mega, locale)` düzeltmesi
BURAYA henüz uygulanmadı, çünkü ÜRÜNLER kolonunun 24 linkinden yalnızca
1'ini (PDKS) düzeltmek tek başına anlamlı değil; kalan 23'ü zaten
kurulmadı. Bu, Aşama 2/3 onayıyla birlikte ele alınacak.

**Test:** `astro check` 0 hata, `astro build` 60 sayfa (4 PDKS route dahil)
hatasız. curl ile doğrulananlar: `/pdks-modulu/` (tr, 200, H1 doğru),
`/en/pdks-module/` (200, EN içerik doğru), `/nl/pdks-module/` (200),
`/it/modulo-rilevazione-presenze/` (200), yanlış tahmin edilen
`/nl/pdks-module-2/` NL-fallback üzerinden `/en/pdks-module-2/`'e
yönlendirilip orada gerçek 404 alıyor (beklenen — gerçek sayfa değil).
Hero CTA'sı doğru `/online-sunum-talebi/`'e gidiyor, LanguageSwitcher
4 dilin gerçek URL'lerini içeriyor (aynı sektör mekanizması, ayrı kod
gerekmedi). SSS gizlendikten SONRA da yeniden test edildi: `astro check`
0 hata, `astro build` 60 sayfa hatasız, tüm 4 URL hâlâ 200, sayfada
`<details>` etiketi hiç yok (SSS gerçekten render edilmiyor), 9 içerik
bloğu bozulmadan duruyor. `astro build` sonrası her zamanki gibi
`node_modules/.vite` temizlenip dev server temiz başlatıldı.

**Kasıtlı olarak dokunulmayan diğer sayfalar (Aşama 1 sırasında):** O
oturumda PDKS dışında hiçbir ürün/modül sayfası route'lanmamıştı — bkz.
hemen aşağıdaki bölüm, bu artık Aşama 2 ile değişti.

### Ürün/modül sayfaları — Aşama 2: Bordro, İzin, Performans, Onboarding, İşe Alım (2026-07-21, ✅ tamamlandı, Aşama 3 onayı bekliyor)
Kullanıcının seçtiği 5 modül, PDKS'teki onaylanmış şablonla (SSS gizli)
4 dilde route'landı — toplam 19 gerçek sayfa (NL İşe Alım hariç, bkz. aşağı).

**Kritik keşif — modül sayfaları TEK bir ACF şeması KULLANMIYOR.** PDKS'in
`section_1_title..section_10_title` düzeni yalnızca kendi şemasıydı. Bu 5
sayfayı incelerken en az 3 farklı EK düzen bulundu:
- **Şema A** (`module_title`/`module_subtitle` + `hero_cta_text/url` +
  `hero_image` hero'su, `section_2_*..section_N_*` içerik blokları) —
  Bordro, Performans, Onboarding.
- **Şema B** (`hero_title`/`hero_subtitle` hero'su, A ile aynı içerik
  düzeni) — İzin Yönetimi.
- **Şema C** (`section_title_N`/`section_text_N`/`section_cta_text_N`/
  `section_cta_url_N`/`section_image_N` — alan adı sırası TERS, index
  önce değil SONRA geliyor; hero = index 1) — İşe Alım.

Ayrıca A/B şemasında şu tutarsızlıklar bulundu (CLAUDE.md'nin ACF
analizinde zaten öngörülmüştü — "normalize edilmeli" notu şimdi somut
örneklerle doğrulandı):
- **Yazım hatası:** `sectin_3_title` (Bordro/Performans/Onboarding'in
  hepsinde — "section" değil "sectin" yazılmış, muhtemelen bir
  copy-paste/tema hatası).
- **Büyük harf tutarsızlığı:** `section_2_Text` (büyük T) vs diğer
  yerlerdeki `section_N_text` (küçük t).
- **CTA URL alanı yanlış adlandırılmış:** `section_3_cta_text_url`
  (Bordro/Onboarding) — gerçekte bu CTA'nın URL'i, ama alan adı
  "cta_text" ile "cta_url"un birleşimi gibi yazılmış.
- **`_copy` sonekiyle GERÇEK, farklı ikinci bir blok:** Performans
  modülünün `section_3`'ü aslında **2 ayrı, farklı içerikli blok**
  ("360 Derece Performans Değerlendirme" + "Çalışanlarınız hedeflerine
  ulaşsın!" — farklı başlık/metin/görsel/CTA) — biri düz `section_3_*`
  alanlarında, diğeri `section_3_*_copy` alanlarında saklanmış. Bu bir
  duplikasyon/atılacak veri DEĞİL, iki gerçek içerik parçası — ikisi de
  render ediliyor (TR sayfasında 4 blok görünüyor: section_2, section_3
  [düz], section_3 [copy], section_5 [`sectin_5_title` — hem "sectin"
  yazım hatası HEM `_copy` karışık: section_5'in cta_text alanı SADECE
  `section_5_cta_text_copy` olarak var, düz `section_5_cta_text` hiç yok]).

**`scripts/extract-products.mjs` bu 3 şemayı + tüm tutarsızlıkları
otomatik tespit edip normalize edecek şekilde yeniden yazıldı** (PDKS'i
bozmadan — regresyon testiyle doğrulandı, PDKS hâlâ 9/9/9/9 blok +
20/20/20/20 SSS üretiyor). `collectBlockIndexFirst(acf, i, variant)`
(Şema A/B/D için, `variant='_copy'` ile ikinci blok ayrıca toplanıyor,
CTA alanları için `_copy`'li fallback dahil) + `collectBlockFieldFirst(acf, i)`
(Şema C için) — ikisi de alan adını SABİT varsaymıyor, regex ile ilgili
index'e ait TÜM alanları toplayıp title/image/cta_url/cta_text/geri kalan
(text) olarak sınıflandırıyor.

**Testimonial/referans bloğu (yalnızca İzin Yönetimi'nde):**
`company_name`/`job_title`/`logo`/`name`/`banner_text` alanları (Double
Tree by Hilton'dan gerçek bir müşteri alıntısı) bulundu — `musteriler`
sayfasındaki referans blok deseniyle aynı aile. **PDKS şablonu birebir
kullanılma kararına uygun olarak bu RENDER EDİLMİYOR** — `extract-products.mjs`
yine de `testimonial` alanı olarak `products.json`'a kaydediyor (ileride
kullanılmak üzere, `productContent.ts`'in TS katmanına henüz bağlanmadı).

**Kontrol sonuçları (kullanıcı talebiyle):**
- **SSS-konu eşleşmesi:** ✅ 5 modülün SSS'i de kendi konusuyla doğru
  eşleşiyor — Bordro Q1 bordro hakkında, İzin Q1 izin hakkında, Performans
  Q1 performans hakkında (ki PDKS'in yanlış SSS'i TAM OLARAK bu sayfadan
  kopyalanmıştı — döngü kapandı, kaynağı da doğru), Onboarding ve İşe Alım
  da kendi konularıyla tutarlı. PDKS'teki hata gerçekten izole bir vakaydı.
- **Dil değiştirici:** ✅ `scripts/test-product-language-switch.mjs`
  (sektörlerdeki test script'inin aynısı, `products.json` üzerinden
  çalışıyor) ile otomatik test edildi — **14/14 geçiş başarılı** (4
  modül × TR→EN→NL→IT 3'er geçiş + İşe Alım × TR→EN→IT 2 geçiş, NL'siz).
- **4 dil yapı tutarlılığı — 3 gerçek bulgu:**
  1. **IT sistemik olarak çevrilmemiş.** Kontrol edilen 6 modülün (PDKS
     dahil) HEPSİNDE IT hero başlığı EN'le birebir aynı. Artık izole
     değil, doğrulanmış bir sitewide örüntü.
  2. **İzin Yönetimi'nin 6. içerik bloğu EN/NL/IT'de tamamen boş** (TR: 6
     blok, diğerleri: 5) — `section_7_title`/`section_7_text` alanları
     bu 3 dilde gerçekten boş string, extraction hatası değil, doğrulandı.
  3. **İşe Alım Modülü'nün EN VE IT sayfaları da çevrilmemiş** — ikisi de
     ham Türkçe gösteriyor (`section_title_1` = "işe alım modülü" EN
     sayfasında bile aynen duruyor) — "IT genelde İngilizce'yi kopyalıyor"
     örüntüsünden farklı, burada EN'in KENDİSİ çevrilmemiş. **Ayrıca NL
     sayfası kaynak sitede hiç mevcut değil** — `pll_translations` id
     20296'ya işaret ediyor ama `wp-json/wp/v2/pages/20296` **401
     rest_forbidden** döndürüyor (yayınlanmamış/taslak — bkz. "WP media
     export count" hafıza kaydındaki aynı sınıf bulgu: DB'de var, publicly
     invisible). `src/pages/ise-alim-modulu.astro` ve `en/hiring-module.astro`/
     `it/modulo-reclutamento.astro` dosyalarına bu üç bulgu birer yorum
     olarak da not düşüldü.
  Talimata uygun olarak **hiçbiri düzeltilmedi**.

**Route'lar:** PDKS'teki desenle birebir, 4'er statik dosya (dinamik
`getStaticPaths()` değil) × 5 modül = 19 dosya (NL İşe Alım hariç, kaynakta
yok):
- Bordro: `bordo-onay-modulu.astro`, `en/payroll-management-module.astro`,
  `nl/salarisadministratie.astro`, `it/modulo-gestione-paghe.astro`
- İzin: `yillik-izin-takip-programi.astro`, `en/leave-management-module.astro`,
  `nl/verlofbeheer-module.astro`, `it/modulo-gestione-ferie-e-permessi.astro`
- Performans: `calisan-performans-degerlendirme-sistemi-modulu.astro`,
  `en/performance-management.astro`, `nl/prestatiebeoordelingsmodule.astro`,
  `it/modulo-gestione-performance.astro`
- Onboarding: `onboarding-modulu.astro`, `en/employee-onboarding-module.astro`,
  `nl/onboarding-module.astro`, `it/modulo-onboarding-dipendenti.astro`
- İşe Alım: `ise-alim-modulu.astro`, `en/hiring-module.astro`,
  `it/modulo-reclutamento.astro` (NL yok)

Tüm slug'lar `link` alanından türetildi (`slug` alanına güvenilmedi —
hiçbirinde `hizmet-sektoru`/NL-PDKS tarzı bir sürpriz çıkmadı, ama yöntem
tutarlı uygulandı).

**Kasıtlı olarak dokunulmayanlar (Aşama 3 onayı bekliyor):**
`navigation.ts`'teki ÜRÜNLER mega-menüsü hâlâ bu 5 modül için de eski "tek
canonical TR slug" varsayımını kullanıyor (sektörlerdeki `buildMegaMenus(mega,
locale)` düzeltmesi ÜRÜNLER'e henüz uygulanmadı — 24 linkten 6'sını (PDKS +5)
düzeltmek, kalan 18'i kurulmadan anlamlı olmayacağından ertelendi).

**Test:** `astro check` 0 hata, `astro build` 79 sayfa (60 önceki + 19 yeni)
hatasız, `node_modules/.vite` temizlenip dev server temiz başlatıldı, tüm
19 URL curl ile 200 doğrulandı, dil değiştirici script'i 14/14 geçiş
gösterdi.

**⚠️ Aşama 3 için öneri (kısmen artık uygulandı — bkz. aşağıdaki iki
bölüm):** ~83 kalan sayfada bilinen şemaların dışında YENİ varyasyonlar
çıkması hâlâ olası. Tam otomatik/gözetimsiz toplu üretime geçmeden önce,
her sayfa için `hero.title`'ın boş olmadığını doğrulayan basit bir
otomatik kontrol script'i (extraction sonrası `products.json`'ı tarayıp
boş/şüpheli girdileri raporlayan) eklemek riski azaltır — `extractHeroAndSections()`
zaten tanınmayan şemalar için konsola uyarı basıyor (`UYARI: ... tanınan
bir ACF şeması bulunamadı`), ama bu yalnızca script çalışırken görülüyor,
kalıcı bir rapor değil. **Bu öneri Aşama 2.5'te henüz uygulanmadı** (12/12
modül tanınan şemalarla çözüldü, ihtiyaç olmadı) — Aşama 3'ün ölçeği
(~77 sayfa) düşünüldüğünde hâlâ değerli bir yatırım.

### Ürün/modül sayfaları — Gerçek çeviri kuralı (KARAR, 2026-07-21)
Aşama 2'de bulunan çeviri kalitesi sorunları (IT'nin EN kopyası olması,
İzin Yönetimi'nin eksik bloğu, İşe Alım'ın hiç çevrilmemiş olması, NL'in
kaynakta hiç var olmaması) üzerine kullanıcı kalıcı bir kural koydu:
**eksik/kopya/boş çeviri bulunduğunda TR kaynaktan gerçek çeviri üretilir,
"olduğu gibi bırak" artık seçenek değil.** Önceki turlarda "kullanıcı
talimatına göre düzeltilmedi, olduğu gibi bırakıldı" diye kaydedilen tüm
bulgular (PDKS IT, İzin'in eksik bloğu, İşe Alım'ın 3 dili) bu kararla
**geriye dönük olarak düzeltildi**.

**Mimari — `src/data/productTranslationOverrides.ts`:**
```ts
export interface ProductOverride {
  hero?: ProductBlock;             // verilirse ham hero'nun YERİNE geçer
  sections?: ProductBlock[];       // verilirse ham sections dizisinin YERİNE geçer
  appendSections?: ProductBlock[]; // verilirse ham/override sections'a EKLENİR
}
export const PRODUCT_OVERRIDES: Record<string, Partial<Record<Locale, ProductOverride>>> = { ... };
```
- **Tam değişim** (`hero`+`sections`): kaynak bir dilde TAMAMEN yanlış/kopya
  olduğunda (ör. IT geneli, İşe Alım'ın EN/IT'si). `hero` verilmezse ham
  veri (zaten doğruysa) kullanılmaya devam eder — ör. `kurumsal-takvim-modulu`'nun
  IT hero'su zaten doğruydu, yalnızca `sections` override edildi.
- **Ekleme** (`appendSections`): yalnızca belirli bir blok eksik/boşken,
  geri kalan içerik zaten doğruyken kullanılır — ör. İzin Yönetimi'nin
  EN/NL'de eksik 6. bloğu; TR'nin ilk 5 bloğunun zaten doğru çevirisi olan
  EN/NL verisine dokunulmadı, yalnızca 6.'sı eklendi.
- **Sıfırdan yeni sayfa** (kaynakta o dil hiç yoksa — ör. İşe Alım NL):
  `entry` (ham veri) `undefined` olsa da `override.hero` doluysa
  `getProductContent()` yine de içerik üretir. Route/slug için de
  `productContent.ts`'e `SYNTHETIC_SLUGS` eklendi (`SLUG_INDEX`'in ham
  `products.json`'dan türetemeyeceği, elle atanmış bir slug — İşe Alım NL
  için `wervingsmodule`, diğer NL modül sayfalarıyla aynı isimlendirme
  konvansiyonunda).
- **Görseller özel çeviri gerektirmez** — WP medya kütüphanesinde dile
  göre ayrı görsel yok, override'larda TR'deki gerçek görsel URL'leri
  aynen kullanıldı.
- CTA URL'leri override'larda da `localizeCtaUrl()`'den geçiyor — override
  yazarken gerçek bir slug bilmek gerekmiyor, `DEMO_CTA_URL` sentinel'i
  (`https://idenfit.com/tr/online-sunum-talep-et/`) kullanmak yeterli,
  fonksiyon bunu tanıyıp doğru locale'in canonical URL'ine çeviriyor.

**Ayrıca bulunan gerçek bug:** `ProductPage.astro`'da `hero.text`
`{hero.text}` ile düz metin olarak interpole ediliyordu, `set:html` DEĞİL.
TR kaynağında `<b>` içeren hero metinleri (İzin: "idenfit ile izinleri,
`<b>akıllı</b>` ve..." gibi) canlıda `&lt;b&gt;akıllı&lt;/b&gt;` olarak
kaçmış görünüyordu — curl ile doğrulanıp düzeltildi (`set:html={hero.text}`,
`cleanRichText()` ile temizlenmiş). Başlıklarda aynı sınıf hata PDKS
pilotunda zaten bulunup düzeltilmişti (`section_10_title`), bu kez hero
metninde de aynısı çıktı.

**Çevrilen içerik (özet):** 12 modülün IT'si (PDKS, Bordro, İzin, Performans,
Onboarding, İşe Alım, Sağlık, Offboarding, Anket, Geri Bildirim, Şirket
Takvimi [kısmi], Notlar) + İzin'in EN/NL/IT eksik 6. bloğu + İşe Alım'ın
EN/IT tam sayfası + İşe Alım'ın NL sayfası sıfırdan. Tüm çeviriler
profesyonel İK/SaaS terminolojisiyle, TR kaynak metne sadık, elle yazıldı
(mega-menü/footer/müşteri hikayeleri çevirilerinde kullanılan aynı kalite
standardıyla — bkz. CLAUDE.md'nin ilgili bölümleri).

**Test:** `astro check` 0 hata, tüm IT sayfaları curl ile tek tek
doğrulandı (artık EN kopyası değil), İzin'in 4 dilde de 6 blok gösterdiği
doğrulandı (`grep -o | wc -l` ile — `grep -c` tek satırlık minifiye HTML'de
yanıltıcı "1" sonucu veriyor, bu turda fark edilip doğru yönteme
geçildi), İşe Alım'ın 4 dilinin hepsi (NL dahil, yeni sayfa) 200 ve
LanguageSwitcher'da doğru URL'lerle görünüyor.

### Ürün/modül sayfaları — Aşama 2.5: şema çeşitliliği testi (2026-07-21, ✅ tamamlandı, Aşama 3 onayı bekliyor)
Kullanıcı kararıyla 6 yeni modül eklendi — kasıtlı olarak farklı ACF
şemalarını/kalite sorunlarını kapsayacak şekilde seçildi:
- **Sağlık Modülü** (`isyeri-saglik-yonetimi-modulu`) — Şema D (PDKS'in
  `section_1_title` düzeni) tekrar doğrulaması.
- **Offboarding, Anket, Geri Bildirim, Notlar** — Şema A (`module_title`),
  farklı içerik hacimleriyle (2-3 blok).
- **Şirket Takvimi** (`kurumsal-takvim-modulu`) — **4. bir örüntü**:
  `module_title`, `hero_title` VE `section_1_title` alanlarının HEPSİ aynı
  sayfada mevcut (muhtemelen zaman içinde denenip terk edilmiş birden
  fazla Elementor şablonu) — yalnızca `module_title` grubu doluydu,
  diğerleri boş string. `extractHeroAndSections()`'ın öncelik sırası
  (`module_title` önce kontrol edilir, boşsa sıradakine geçilir) bunu
  otomatik doğru çözdü. Bu sayfa ayrıca **satır satır karışık çeviri**
  kalitesi de sergiledi (hero tam doğru İtalyanca, bir section başlığı
  çevrilmiş bir diğeri değil, section metinlerinden biri İngilizce kalmış)
  — "tümü kopya" değil daha ince taneli bir bozukluk, yine de KARAR 1
  kapsamında düzeltildi.

**Route'lar:** 24 yeni statik dosya (6 modül × 4 dil, hepsi tam — bu turda
NL boşluğu çıkmadı):
`isyeri-saglik-yonetimi-modulu`→`en/employee-health-management-module`/`nl/gezondheidsbeheer`/`it/modulo-gestione-salute-dipendenti`;
`offboarding-modulu`→`en/employee-offboarding-module`/`nl/offboarding-module`/`it/modulo-offboarding-dipendenti`;
`anket-modulu`→`en/employee-surveys-module`/`nl/enquetes`/`it/modulo-sondaggi-dipendenti`;
`organizasyonel-geri-bildirim-modulu`→`en/employee-feedback-module`/`nl/feedbackmodule`/`it/modulo-feedback-dipendenti`;
`kurumsal-takvim-modulu`→`en/corporate-calender-module`/`nl/bedrijfskalender`/`it/modulo-calendario-aziendale`;
`notlar-modulu`→`en/notes-module`/`nl/notitie-module`/`it/modulo-note`.

**Test:** `astro check` 0 hata, `astro build` 104 sayfa hatasız, tüm 24
URL curl ile 200, genişletilen `scripts/test-product-language-switch.mjs`
ile 11 modülün (PDKS hariç, önceden test edilmişti) TAMAMI yeniden test
edildi — **32/32 geçiş başarılı**. `node_modules/.vite` temizlenip dev
server temiz başlatıldı.

### Müşteri Başarı Hikayeleri sayfası (/musteriler/, 2026-07-21)
İlk turda "Müşteri Hikayeleri" için ayrı, içeriksiz bir placeholder
kurulmuştu — bu **yanlış bir kurguydu ve silindi**. Gerçek durum: idenfit.com'da
MÜŞTERİLER (nav.ts'de zaten `musteriler` slug'ına bağlı) `/musteriler/`'e
gidiyor ve orada **gerçek, dolu içerik** var — `pages.json`'da `musteriler`
(tr, id 13119) sayfasının ACF alanlarında (`femas_*`, `civil_*`, `yatsan_*`,
`dog-ser_*`, `tugba_kuruyemis_*` — CLAUDE.md'nin WP ACF analizinde zaten
listelenmişti) 5 müşteri kartının tam metni, gerçek YouTube video URL'leri
ve çalışan sayıları duruyordu. Bu artık migrate edildi; page-inventory.md'de
B-ÖNEMLİ/Hafta 5'e planlanan `musteriler` sayfası bu adımla önden alınmış
oldu.

- **Yapı:** Hero (başlık + açıklama + "Hemen Başvur" CTA'sı + dekoratif
  illüstrasyon) + 5 müşteri kartı grid'i (`CustomerStoryCard.astro`): isim,
  açıklama paragrafı, YouTube video embed'i veya "Video yakında", "X
  çalışan" rozeti (inline SVG ikon — Footer'daki sosyal ikon deseniyle
  aynı, client JS göndermez). Ortak `CustomerStoriesPage.astro`
  component'i 4 locale route dosyası (`musteriler.astro` + `en/nl/it`
  eşdeğerleri) tarafından sarmalanıyor — Sektör placeholder'ıyla aynı
  "ince route dosyası + paylaşılan component" deseni.
- **Video kapsamı:** Kaynakta yalnızca **Femaş** (`femas_video_url`) ve
  **Civil** (`civil_reference_video`) için gerçek YouTube URL'si vardı;
  Yatsan/Doğ-Ser Makina/Tuğba Kuruyemiş'te video alanı kaynakta hiç
  yoktu — kullanıcının talimatına uygun şekilde bu 3 kart embed olmadan
  "Video yakında" gösteriyor. Veri: `src/data/customerStories.ts` →
  `CUSTOMER_STORIES` (`videoUrl` opsiyonel).
- **İçerik normalizasyonu:** Kaynakta her müşterinin ACF alan seti
  farklıydı — Femaş/Civil/Yatsan'da 3.-şahıs şirket açıklaması (`_text`
  alanı) vardı; Doğ-Ser ve Tuğba Kuruyemiş'te böyle bir alan yoktu,
  yalnızca 1.-şahıs müşteri referans/testimonial metni (`_reference_text`)
  vardı. Kart açıklaması için önce `_text`, o yoksa `_reference_text`
  kullanıldı; ikinci durumda metin bir alıntı olduğu için sonuna gerçek
  referans ismi eklendi (ör. "— Cem Çolak, İdari & Mali İşler").
  Şirket adları (Femaş, Civil, Yatsan, Doğ-Ser Makina, Tuğba Kuruyemiş)
  özel isim olduğu için i18n'e değil `customerStories.ts`'e kondu (Footer'daki
  `FOOTER_CONTACT` adresinin çevrilmemesiyle aynı mantık).
- **Önemli bulgu — WP'nin kendi EN/IT/NL çevirileri kullanılmadı:**
  `customers` (en), `clienti` (it), `customers-2` (nl) sayfalarında aynı
  ACF alanları dolu görünüyordu, ama içerik **düşük kaliteli makine
  çevirisiydi** — ör. `clienti` (IT) sayfasının `intro_title`'ı bile hâlâ
  İngilizce'ydi ("Customer Success Stories"), `femas_text`'in İngilizcesi
  "idenfit olarak" ifadesini kelimesi kelimesine "as identity" diye
  çevirmişti (anlamsız). Bu proje boyunca kurulan i18n içeriğinin tamamı
  (mega-menü, footer, hero) profesyonel, elle çevrilmiş metin olduğu için
  — CLAUDE.md'nin i18n bölümünde defalarca vurgulandığı üzere — burada da
  aynı standart uygulandı: TR kaynak metin esas alınıp EN/NL/IT için
  **yeniden, kaliteli çeviri yazıldı**, WP'nin bozuk makine çevirisi
  kullanılmadı. Yeni i18n şeması: `src/i18n/types.ts` → `CustomerStoryLabels`
  + `CustomerStoriesLabels`, `Translations.customerStories` — 4 dilde dolu.
- **Hero CTA metni farklı:** Bu sayfadaki gerçek CTA metni ("Hemen
  Başvur"/"Apply Now"/"Direct aanvragen"/"Richiedi Ora",
  `t.customerStories.ctaLabel`) sitenin genel CTA'sından ("Online Sunum
  Talebi", `t.cta.requestDemo`) **bilinçli olarak farklı** tutuldu — gerçek
  kaynakta idenfit bu sayfada farklı mikro-metin kullanıyordu, hedef URL
  aynı (`online-sunum-talebi`).

**Test:** `/musteriler/`, `/en/musteriler/`, `/nl/musteriler/`,
`/it/musteriler/` — hepsi `200`; 5 müşteri adı, "Video yakında" (3 kart),
2 gerçek YouTube embed (Femaş + Civil), 4 dilde doğru başlık/CTA metni
curl ile doğrulandı. Eski `/musteri-hikayeleri/` artık `404`. `astro check`:
0 hata.

### Footer (src/components/Footer.astro, src/data/footer.ts)
idenfit.com'un canlı footer'ından çıkarıldı: **4 kolon** — marka/iletişim/
sosyal medya (metin değil, yapısal veri — adres çevrilmez), **HAKKINDA**
(6 link), **ÜRÜNLER** (8 link), **GENEL** (6 link) + alt bar (telif hakkı +
Gizlilik/KVKK/Kullanım Koşulları).
- **Metinler** `src/i18n/*.ts`'in yeni `footer` şemasında (`columnTitles`,
  `links.{about,products,general}`, `copyright` — `{year}` placeholder'ı
  render'da gerçek yılla değiştirilir —, `privacy`, `kvkk`, `terms`).
- **Yapı/URL'ler** `src/data/footer.ts`'de (`FOOTER_ABOUT_LINKS` vb. —
  `nav.ts`/`navigation.ts` ile aynı "yapı burada, metin i18n'de" deseni).
- **Sosyal medya:** idenfit.com'dan gerçek 5 URL çıkarıldı (LinkedIn, X/
  Twitter, Instagram, YouTube, Facebook). Not: gerçek sitede ayrıca
  Pinterest/Medium/App Store/Play Store ikonları da var, kullanıcının
  istediği 5 platformla sınırlı tutuldu.
- **İkonlar:** lucide-react marka/logo ikonu içermediği için (yalnızca
  jenerik arayüz ikonları var) 5 sosyal ikon `Footer.astro` içinde inline
  SVG olarak — hiç client JS göndermez (statik `.astro` mimari kuralı).
- **Bottom-bar linkleri** (`gizlilik-politikasi`, `kullanim-kosullari`)
  idenfit.com'da bu tam isimle yok (kaynakta yalnızca "© Copyright idenfit,
  2026" var) — kullanıcının istediği bottom-bar yapısı için bizim site
  konvansiyonumuzla eklendi.

### Blog dil stratejisi (mimari karar)
- Tüm blog yazıları **Türkçe içeriklidir** (618 yazı, sadece TR).
- Diğer dillerdeki sayfalardan (en/nl/it) de **blog linki görünür**;
  ziyaretçi blog listesine ve tekil yazılara her dilden erişebilir.
- İçerik **Türkçe olarak gösterilir** — **otomatik çeviri YAPILMAZ**.
- Blog listesi ve tekil yazı sayfaları **tek bir dil-nötr yapıda** tutulur;
  navigasyonda hangi dilde olunursa olunsun aynı (tek) blog yapısına gelinir.

## Tasarım sistemi (Tailwind CSS)

Renk paleti ve fontlar **idenfit.com'un Elementor global kit'inden (kit 9561)**
birebir alındı; placeholder değildir.

### Renk paleti
| Token (Tailwind) | Hex | Kullanım |
|---|---|---|
| `brand` | `#FF0000` | Ana marka rengi — CTA butonları ("Online Sunum Talebi") |
| `brand-light` | `#FFF2F2` | Açık kırmızı zemin/vurgu |
| `secondary` | `#6F2C90` | İkincil (mor) vurgu |
| `heading` | `#070707` | Başlıklar (siyaha yakın koyu) |
| `body` | `#333333` | Paragraf gövde metni |
| `muted` | `#808080` | İkincil/meta metin (açık gri) |
| `surface` | `#FFFFFF` | Arka plan (beyaz) |

Not: Marka kırmızısı gerçek değeriyle `#FF0000` (kit'te `uicore_primary` =
`uicore_accent`). Paragraf gövdesi için kit'in açık grisi (`#808080`) yerine
okunabilirlik/WCAG kontrastı için `#333333` seçildi; `#808080` yalnızca
ikincil `muted` metin için.

### Font
- **Quicksand** (Google Fonts) — başlık ve gövde dahil her yerde.
  `Layout.astro` head'inde `preconnect` + Google Fonts `<link>` ile yükleniyor.
- Fallback stack: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Tailwind utility: `font-sans` (varsayılan) Quicksand'e map'li.

### Tailwind kullanım kuralı
- **Tailwind v4** kurulu (`@tailwindcss/vite` plugin, `astro.config.mjs`
  `vite.plugins` içinde). **`tailwind.config.mjs` YOKTUR** — v4 yapılandırmayı
  CSS içinde yapar.
- Tema token'ları `src/styles/global.css` içinde `@theme { … }` bloğunda
  tanımlıdır ve otomatik utility'lere dönüşür: `bg-brand`, `text-heading`,
  `text-body`, `text-muted`, `bg-surface`, `font-sans` vb.
- `global.css`, `Layout.astro` içinde import edilir (tüm sayfalara uygulanır).
- Stil için **Tailwind utility'leri** tercih edilir; token değişikliği
  gerektiğinde `global.css`'teki `@theme` güncellenir (ayrı config dosyası aranmaz).

## Mega-menü (src/data/navigation.ts, src/components/MegaMenu.tsx)

idenfit.com'un canlı header'ından çıkarılan mega-menü verisi. Kaynak
dürüstlüğü için önemli notlar:
- **ÜRÜNLER:** gerçek 6-kolonlu mega-menü (intro + 4 kategori + promo),
  ikonlar dahil birebir idenfit.com'dan çıkarıldı (`src/components/icons/IdenfitIcons.tsx`).
- **SEKTÖRLER, KURUMSAL:** idenfit.com'da bunlar tek kolonlu basit
  dropdown'lar (ikon/promo yok) — gerçek yapıyla eşleşecek şekilde sade.
- **KEŞFET:** idenfit.com'da gerçek yapı blog-kartı ağırlıklı, karmaşık bir
  içerik merkezi; bizim şemaya uymuyor. **Bilinçli olarak sadeleştirildi**
  (yalnızca URL'si doğrulanmış öğeler). İkonlar `lucide-react`'ten (idenfit
  kaynaklı değil).
- **NEDEN IDENFIT, FİYATLAR, MÜŞTERİLER:** idenfit.com'da dropdown'u YOK,
  düz link — burada da mega-menü fabrike edilmedi.
- Masaüstü nav breakpoint `xl`'den `lg`'ye düşürüldü (mega-menü spec'i
  gereği); `MobileMenu.tsx` da tutarlılık için `lg:hidden`'e güncellendi.
- **i18n:** `navigation.ts` yalnızca YAPI tutar (href/icon/layout/görsel
  URL'leri); tüm METİN (kolon başlıkları, link isimleri, promo, rapor
  kartları) `src/i18n/*.ts`'in `mega` şemasından `buildMegaMenus(t.mega)`
  fonksiyonuyla enjekte edilir — `Header.astro` bu fonksiyonu çağırır.
  Tek istisna: promo'nun "LATER IS NEVER" sloganı (marka sloganı, bilinçli
  olarak 4 dilde de aynı bırakıldı).

### Şema: esnek kolon tipleri (src/data/navigation.ts)
`MegaMenuColumn` üç tipten biri olabilir: `'links'` (sade link listesi,
opsiyonel `comingSoon` düz-metin öğeleri — ör. Podcastler), `'sublist'`
(tek "gör tümü" linki + altında hepsi aynı hedefe giden düz-metin alt
öğeler — ör. Hesaplamalar/8 hesaplama aracı), `'cards'` (yatay kaydırmalı
görsel kart listesi, sağ ok butonuyla — ör. Raporlar/4 PDF).

### z-index / opaklık / tam-genişlik düzeltmesi (MegaMenu.tsx)
İlk düzeltme (`z-[100]` + opak `bg-surface`) yeterli değildi — asıl kök
neden, panelin `left-1/2 -translate-x-1/2` ile **tetikleyici `<li>`'ye**
göre ortalanmasıydı. ÜRÜNLER nav'da soldaki ilk öğe olduğundan, viewport
genişliğindeki panel viewport MERKEZİNE değil, ÜRÜNLER butonuna göre
ortalanıyor, bu da sağ tarafın (hero'daki kırmızı promo kutusu) panelin
sağ kenarının dışında kalıp görünür olmasına yol açıyordu.

Kalıcı çözüm: `<li>`'den `position: relative` kaldırıldı; panel artık
`position: absolute` + `inset-x-0` ile **en yakın positioned ata olan
`<header>`'e** (zaten `sticky`) göre konumlanıyor — `header` `w-full`
olduğu için bu, paneli gerçek viewport genişliğine yayıyor. `Header.astro`'ya
ayrıca `isolate` eklendi (stacking-context güvencesi). İçerik `mx-auto
max-w-6xl` ile ortalanmış kalıyor, ama arkaplan artık uçtan uca opak.

### KEŞFET — ikinci, derinlemesine çıkarım
`idenfit.com/online-sunum-talep-et/` sayfasındaki `#explore-menu`'den
tekrar, daha kapsamlı çıkarıldı: **İçerikler** (Bloglar, Dijital İK
Olgunluk Testi, + Podcastler düz metin/"yakında" — gerçek sitede hedefi
yok), **Hesaplamalar** (sublist, 8 hesaplama aracı, hepsi
`/hesaplama-araclari`'na gider — gerçek HTML'de tek container, kullanıcının
ilk ekran görüntüsü yorumundaki "Kaynaklar + Hesaplamalar" ayrımı kaynakta
YOK, tek kolon olarak birleştirildi), **Raporlar** (cards, 4 gerçek rapor
kartı — kategori etiketi + başlık + **idenfit.com'dan gerçek, doğrulanmış
görsel URL'leri** hotlink olarak kullanıldı, placeholder DEĞİL; PDF
linkleri de gerçek ve dış/`target=_blank`).

### SEKTÖRLER — çoklu kolon + ikonlar (tasarım kararı, kaynak sadakati değil)
idenfit.com'da bağımsız bir `/sektorler/` genel bakış sayfası **yok**
(404) — gerçek sitede SEKTÖRLER hâlâ tek kolonlu basit dropdown. Bu
yüzden 12 sektörü `grid-cols-3` düzeninde ve her birine lucide-react
ikonu (Utensils, Briefcase, Plane, ShoppingBag, Zap, Heart,
GraduationCap, Shield, Building, Factory, Scale, Truck) ekleyerek daha
okunur hale getirmek **bilinçli bir tasarım kararı**, kaynaktan
çıkarılmış bir veri değil. `LinksColumn.layout` ('list'|'grid-2'|'grid-3')
ve `MegaMenuLink.icon` (link-seviyesi ikon) şema alanları bunun için eklendi.

Not: genel bakış/hub sayfasının yokluğu ile 12 sektörün KENDİ sayfalarının
içeriği ayrı şeyler — hub gerçekten yok, ama 12 sektör sayfasının hepsinde
4 dilde gerçek içerik var (ayrı bir custom post type'ta, `page`/`post`'ta
değil) — bkz. §"Sektör sayfaları — DÜZELTME".

## Yapılacaklar (TODO)

Güncel/canlı liste dosyanın en başındaki **"Proje Durumu — İlerleme Özeti"**
bölümündedir (🟡 Yarım kalanlar + ⏭️ Sıradaki adım). Buradaki madde detayları
o özetle çelişirse özet esas alınsın (en son güncellenen odur).

Ek, daha spesifik not: KEŞFET mega-menüsü gerçek sitede blog-kartı tabanlı
zengin bir yapı; bizimki bilinçli sadeleştirilmiş — ileride ayrı bir
bileşenle (görsel kartlar) daha sadık şekilde yeniden yapılabilir.

**Kaynakta olmayan çeviriler (KARAR 2, 2026-07-21):** Kaynakta olmayan
çeviriler (seyahat NL/IT, demirbaş IT gibi) için yeni sayfa oluşturma
kararı ekiple görüşülecek, şimdilik atlandı. Bkz. yukarıdaki "Üç karar
alındı ve uygulandı" bölümü.

## Proje temposu (çalışma felsefesi)
- **Haftalık hedeflerle** ilerlenir; toplam süre önceden belirlenmez.
- Her **hafta sonu değerlendirme** yapılır, sonraki hafta ona göre planlanır.
- **Kalite > Hız.**

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Deployment

**Faz 1 (mevcut):** Tüm statik içerik Astro ile migrate edilip Cloudflare
Pages'e static olarak deploy edilecek.

**Faz 2 (ileride):** Dinamik/interaktif kısımlar (form backend'i, olası
arama/kullanıcı işlemleri) Cloudflare Pages Functions ile eklenecek.

Şu anki mimari (`output: 'static'`, `HeroForm`'un backend'siz `console.log`
hali — bkz. "🟡 Yarım kalanlar") bu plana zaten uyumlu, Faz 1 tamamlanana
kadar ek hazırlık gerekmiyor.

## Script'ler

Tüm yardımcı script'ler Node.js (`.mjs`) ile yazılır, Python kullanılmaz.
Proje JavaScript/TypeScript tabanlı olduğu için tutarlılık ve taşınabilirlik
amacıyla bu kurala uyulur. Mevcut analiz script'leri `scripts/` altında
(ör. `scripts/analyze-wp.mjs`, `scripts/lang-count.mjs`). Çalıştırma:
`node scripts/<ad>.mjs`.

## WordPress Kaynak Sitesi (reference/wordpress-export/)

Kaynak site: `idenfit.com` (İK/HR SaaS). WordPress REST API export'u.
İçerik: `posts.json` (618 yazı, tümü `publish`), `pages.json` (170 sayfa,
tümü `publish`), `media.json` (2211 medya kaydı), `sectors.json` (12 sektör
× 4 dil = 48 sayfa — **⚠️ orijinal export'a dahil değildi**, bkz. aşağı).

Kullanılan eklentiler (alanlardan tespit): **Elementor** (sayfa builder),
**ACF** (custom field'lar), **Yoast SEO** (`yoast_head_json`),
**Polylang** (`pll_language`, `pll_translations` — çok dilli).

### ⚠️ Export eksikliği: custom post type'lar dahil değildi (2026-07-21 keşfi)
Orijinal `pages.json`/`posts.json`/`media.json` export'u yalnızca WP'nin
**standart** `page` ve `post` post type'larını (+ `media`) çekmiş —
`wp/v2/types` ile mevcut TÜM post type'lar hiç keşfedilmemiş. Gerçekte
idenfit.com'da bunların dışında en az şu custom post type'lar var:
- **`sectors`** (rest_base `sectors`) — 12 sektörün 4 dildeki tam
  sayfaları burada duruyor (`/wp-json/wp/v2/sectors`). Bu yüzden
  page-inventory'nin "sektör sayfaları WP'de yok" tespiti yanlıştı —
  içerik gerçekten var, sadece export'un baktığı yerde değildi. Ayrıca
  çekilip `sectors.json`'a kaydedildi — bkz. §"Sektör sayfaları — DÜZELTME"
  (Mimari bölümü altında) ve `scripts/fetch-sectors.mjs`.
- **`faq`** (rest_base `faq`, taxonomy `faq-category`) — **✅ kontrol
  edildi (2026-07-21): gerçek, dolu içerik.** 90 kayıt — 30 TR + 30 EN +
  30 IT (**NL yok**, sitedeki tanıdık dil-boşluğu deseniyle tutarlı).
  Gerçek destek/SSS soruları (fiyatlandırma, güvenlik/KVKK-GDPR,
  biyometrik cihaz entegrasyonu, kurulum süreci vb.) — `sss`/`faq`
  sayfasının ACF accordion'undan (question_1..20) **ayrı, daha geniş**
  bir soru havuzu; URL kalıbı `/blog/faq/<slug>/` (muhtemelen SEO/FAQPage
  schema amaçlı, her soru kendi sayfası). Bir tuhaflık: TR'de
  `id:12585, slug:"test"` (başlık "idenfit nedir?") — muhtemelen unutulmuş
  bir test girdisi. **Henüz çekilip kaydedilmedi** (kullanıcı talebiyle bu
  turda yalnızca keşif yapıldı) — gerektiğinde `sectors.json` deseniyle
  (`scripts/fetch-sectors.mjs` benzeri bir script) `faq.json`'a alınabilir.
- **`portfolio`** (rest_base `portfolio`, `has_archive: true`) — amacı
  belirsiz, muhtemelen kullanılmıyor (sitede görünür bir "portfolio" bölümü
  yok), ama teyit edilmedi. Düşük öncelik.

**Ders çıkarımı:** Bundan sonra bir içeriğin "WP'de yok" sonucuna varmadan
önce önce `wp/v2/types` ile TÜM post type'lar kontrol edilmeli, yalnızca
`pages.json`/`posts.json`'a bakıp "yok" denmemeli — bu proje boyunca en az
bir kez (sektör sayfaları) yanlış negatif sonuca yol açtı.

**✅ Ürün/modül sayfaları için bu kontrol tekrar yapıldı (2026-07-21,
aynı gün) — bu sefer TEMİZ çıktı, ekstra CPT yok.** Sektör sayfalarındaki
hatadan sonra aynı riskin 89 ürün/modül sayfası (Bordro, PDKS, İzin vb.)
için de geçerli olup olmadığı kontrol edildi:
1. `wp/v2/types` **tekrar** sorgulandı — listede `sectors`/`faq`/`portfolio`
   dışında, `products`/`modules`/`urunler` gibi ürünle ilgili yeni bir
   custom post type **YOK**. Tam liste aynı kaldı (post, page, attachment,
   nav_menu_item, wp_block, wp_template*, wp_navigation, wp_font_*,
   e-floating-buttons, elementor_library, elementor_snippet, faq, sectors,
   portfolio, uicore-tb).
2. Örnek modül sayfaları doğrudan `wp/v2/pages` üzerinden sorgulandı —
   `pdks-modulu` (id 11364), `bordo-onay-modulu` (id 11558), EN karşılığı
   `pdks-module` (id 11482) — üçü de **`"type":"page"`** olarak dönüyor,
   sektörlerdeki gibi ayrı bir CPT'de değil.
3. Bu ID'ler yerel `pages.json`'daki kayıtlarla **birebir eşleşiyor**
   (aynı ID, aynı slug) ve içerik gerçekten dolu (`content.rendered`
   22-85 KB arası HTML, boş değil) — `calisan-egitim-yonetimi-modulu`,
   `onboarding-modulu`, `payroll-management-module` (en),
   `modulo-gestione-paghe` (it), `leave-management-module` (en),
   `pdks-module-2` (nl) gibi örnekler 4 dilde de doğrulandı.

**Sonuç: 89 ürün/modül sayfası zaten `pages.json`'da, standart `page`
post type'ında, tam içerikle mevcut.** Önceki envanter (`docs/page-inventory.md`
§A_modules) bu kategori için **doğruydu** — sektörlerdeki gibi bir export
eksikliği yok, ekstra çekme/kaydetme işi gerekmiyor. `faq` CPT'si de artık
kontrol edildi (yukarıya bkz.) — 90 gerçek kayıt (TR/EN/IT, NL yok), henüz
çekilmedi. `portfolio` tek gerçek araştırılmamış CPT olarak kalıyor
(muhtemelen düşük öncelik/kullanılmıyor).

### Dil dağılımı (site 4 dil: TR ana, EN, NL, IT)
- **Posts:** `pll_language` alanı export'ta **hiç yok**; 618 yazının tümü
  Türkçe (link'lerde dil öneki yok). Diğer dillerde (en/nl/it) **post
  gelmemiş** → sadece Türkçe blog içeriği export edilmiş.
- **Pages:** `pll_language` alanı var, 170 sayfa şöyle dağılıyor:
  `tr`=55, `en`=48, `it`=40, `nl`=27.

Not: Sayfalar 4 dilde de mevcut, ancak blog yazıları yalnızca Türkçe.
Migration'da diğer dillerdeki post'ların eksikliği göz önünde tutulmalı.

### 1. Kategoriler (11 adet — sadece post'larda)
`ik-akademi` (337), `ik-trendleri` (159), `guncel-bilgiler` (117),
`dijital-ik` (41), `gecmis-etkinlikler` (14), `guncel-bilgiler-tr` (11),
`uncategorized-tr` (7), `ik-roportajlari` (4), `yaklasan-etkinlikler` (3),
`ogretici-bilgiler` (3), `yenilikler-tr` (2).

### 1b. Tag'ler (63 adet — sadece post'larda)
SGK/bordro/mesai/izin/İK odaklı; örn. `sgk-primleri`, `dijital-bordro-tr`,
`izin-yonetimi-tr`, `mesai-takibi-tr`, `performans-yonetimi-tr`,
`fazla-mesai-tr`, `calisan-bagliligi-tr`. Sayfalarda kategori/tag yok.
(Tam liste `node scripts/analyze-wp.mjs` ile üretilebilir.)

### 2. Sayfa şablonları (page template)
- `` (varsayılan): 97 sayfa
- `elementor_header_footer`: 65
- `pricing/template-pricing.php`: 4
- `suprema/suprema.php`: 2
- `suprema-it/suprema.php`: 1
- `elementor_theme`: 1

Post'ların tamamı (618) varsayılan (boş) şablon kullanıyor.

### 3. Custom field / meta anahtarları
- **WP core meta (her kayıtta):** `_acf_changed`, `footnotes`.
- **Post'lar:** ACF alanı boş (özel field yok).
- **Sayfalar:** yoğun ACF kullanımı — ~500+ farklı anahtar. Başlıca
  gruplar (sayfa başına tekrar eden şablon blokları):
  - SSS: `question_1..20` / `answer_1..20`, `faq_question_1..8` / `faq_answer_1..8`
  - Hero/başlık: `page_title`, `page_subtitle`, `hero_title`, `hero_image`, `video_url`
  - Bölümler: `section_1..10_{title,text,image,cta_text,cta_url,subtitle}`
  - İletişim: `call_title`, `e-mail_*`, `offices_title`, `office_1..3`, `address_1..3`, `map_image`
  - Sosyal medya: `social_media_icon_1..4` / `social_media_url_1..4`
  - Referans/müşteri blokları: `civil_*`, `yatsan_*`, `dog-ser_*`, `tugba_kuruyemis_*`, `femas_*`
  - Ürün listeleri: `1_product_*`, `2_product_*` + çok sayıda `_copy` / `_copyN` klonu
  - Modül şablonları: `mct1_*`, `mct4_*`
  - Fiyatlandırma (4 sayfa): `mikro_*`, `sme_*`, `Pro_*`, `micro_modules`, `packages_title`
  - Banner (25 sayfa): `banner_baslik`, `banner_aciklama`, `banner_gorsel_*`, `banner_form_*`

  Not: Aynı anlamı taşıyan tekrar/typo'lu anahtarlar var
  (`sectin_3_title`, `section_2_Text` vs `section_2_text`, `_copy1..15`) —
  migration'da normalize edilmeli.

### 4. themes.zip — AÇILMADI
`reference/wordpress-export/themes.zip` (~22 MB) mevcut. Mevcut WP teması;
şimdilik açılmadı, gerektiğinde incelenecek.

### 5. uploads.zip — AÇILMADI
`reference/wordpress-export/uploads.zip` (~1.4 GB) mevcut. Tüm görseller;
açılmadı, sadece not alındı.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
