## Proje Özeti

idenfit.com (İK/HR SaaS) WordPress'ten Astro'ya migrasyon. Astro + React
island mimarisi, i18n (tr/en/nl/it + **az** — ana sayfa/tekil sayfalar/
sektörler/ürünler/hub'lar dahil büyük ölçüde tamamlandı, SSS/hukuki aile
TR'ye fallback ediyor, bkz. §Açık noktalar #37), Tailwind v4. **2026-08-27'de
`output:'static'` → `output:'server'` + `@astrojs/cloudflare` adapter'a
geçildi** (Keystatic CMS geçişinin ADIM 1'i, bkz. aşağıdaki "KEYSTATIC
GEÇİŞİ" bölümü) — Cloudflare Pages yerine artık Cloudflare Workers+Assets
deploy modeli hedefleniyor. Genel durum: ana sayfa, mega-menü, tüm ürün/modül
sayfaları (18 modül + Puantaj + 2 hub + Demirbaş/Seyahat), 12 sektör
sayfası, 622 blog yazısı (622/622 Markdown, `posts.json` göçü 2026-08-29'da
tamamlandı), Müşteriler,
Destek Talebi, Hesaplama Araçları, Dijital İK Olgunluk Testi, Fiyatlar,
Hakkımızda, İletişim, SSS, KVKK/hukuki sayfa ailesi (+ KVK Protokol),
Footer/Header tamamlandı. Site denetim raporu (14 madde) + kapsamlı URL
denetimi (853 canlı URL karşılaştırması) kapandı. Landing Page (/demo)
tamamlandı (2026-08-11, f21f863). Ana sayfa interaktif Ürün Önizleme
widget'ı (11/11 sekme + üst header'ın 9/9 ikon paneli) tamamlanıp commit
edildi, sonrasında birden fazla iyileştirme turu (renk/boyut/dashboard
içeriği) geçirip **commit edildi (0c1e67a, 2026-08-18/19)**. Blog CMS
göçü (Decap→Keystatic) tamamlandı — 629 yazı Markdown'da, Keystatic Cloud
paneli CANLI ve pazarlama ekibi oradan yazı yayınlıyor (`keystatic-cloud[bot]`
doğrudan `master`'a commit atıyor, Workers Builds otomatik deploy ediyor).
**Site CANLIDA** (`site: 'https://idenfit.com'` dolu, canonical + hreflang
aktif). **Şu anki odak (2026-10-02/04): JSON-LD şema turu** — 8 PR sırayla
canlıya alındı (ürün/modül sayfalarının `SoftwareApplication`'ı dahil, Açık
nokta #29'un asıl boşluğu kapandı; blog yazılarının `articleSection`'ı da
canlıda), 9.'su (blog liste sayfaları `CollectionPage`) PR olarak bekliyor.
Sıradaki açık uçlar: **Fiyatlar sayfası** (orada hâlâ HİÇ JSON-LD yok ve
`offers` kararı oraya ait) ve **`check-json-ld.mjs`'in `WebPage` kuralları**
(255 blok hiç doğrulanmıyor — bkz. §Güncel durum PR 9 ve §Açık noktalar #29).

**Geçmiş günlük detayları (tarih damgalı arşivler, nadiren gerekir):**
**`docs/claude-md-archive-2026-10-03.md` (2026-08-19→2026-10-02 tam
günlük + kapanmış 32 açık noktanın TAM anlatımı — bu dosyanın bir önceki
sadeleştirilmeden önceki hali; widget i18n turları, az locale
genişletmesi, BreadcrumbList/Organization JSON-LD kurulumu, hotlink
temizliği, Keystatic image-field göçü, pentest turu, D1 lead
kalıcılığı)**, `docs/claude-md-archive-2026-08-18.md`
(2026-08-13→2026-08-19 tam günlük — 13 turluk widget iterasyon serisi,
header ikon panelleri pixel-compare turu, DOM boyutu/heading-hierarchy/
hreflang/GEO denetim turlarının TAM anlatımı),
`docs/claude-md-archive-2026-08-13.md` (2026-08-06→2026-08-13),
`docs/claude-md-archive-2026-08-06.md` (2026-07-21→2026-08-06),
`docs/claude-md-archive-2026-07-31.md`, `docs/claude-md-archive-2026-07-28.md`,
`docs/claude-md-archive-2026-07-23.md`.

---

## 🟢 İK Dijital Olgunluk Testi — 5 ADIM TAMAMLANDI (2026-09-03/04)

İK Dijital Olgunluk Testi özelliği (ADIM 1-5: lead-capture formu genişletme,
radar grafik, dinamik öneri motoru + firma büyüklüğü filtresi, Cloudflare
Browser Rendering ile PDF üretimi, SendGrid ile PDF'in hem ekibe hem testi
dolduran kişinin kendisine e-posta eki olarak gönderilmesi) tamamlandı.

**Güvenlik ağı:** `ik-olgunluk-testi-oncesi-yedek` dalı hem `origin` hem
`idenfit` remote'unda, özellik öncesi duruma dokunulmadan duruyor. **Canlıda
ciddi/çözülemeyen bir sorun çıkarsa bu dala dönülerek özelliğin TAMAMI geri
alınabilir.** Küçük/izole sorunlar için (örn. yalnızca PDF şablonu, yalnızca
radar grafik gibi) doğrudan o parçayı düzeltmek tercih edilmeli — tüm
özelliği geri almaya GEREK YOK, dal yalnızca büyük/kurtarılamaz bir
regresyon senaryosu için son çare.

**GÜVENLİK SERTLEŞTİRMESİ (2026-09-04, deploy öncesi) — 3 kritik bulgu
düzeltildi.**
1. **HTML/script enjeksiyonu (kritik):** `parseLeadPayload`/
   `parseMaturityPdfData` `categoryScores`/`groupScores`'un yalnızca "bir
   obje" olduğunu kontrol ediyordu, DEĞERLERİN sayı olduğunu HİÇ
   doğrulamıyordu — bir saldırgan bu alanlara HTML/script içeren string
   gönderirse, `renderMaturityReportHtml()` bunu kaçışlamadan doğrudan PDF
   şablonuna yerleştiriyordu; PDF üretimi `page.setContent()` ile bu HTML'i
   GERÇEK bir headless Chromium'da (Cloudflare Browser Rendering) render
   ettiği için enjekte edilen script SUNUCU TARAFINDA ÇALIŞIRDI. Düzeltme:
   paylaşılan `isValidScoreRecord()` (`maturity-pdf.ts`, `lead.ts` bunu
   import ediyor) HER değerin 0-100 arası GERÇEK bir sayı olduğunu
   zorluyor, aksi halde istek 400 ile reddediliyor. **Defense in depth:**
   `maturityReportTemplate.mjs`'teki TÜM interpolasyonlar (yalnızca
   companyName/level değil — score, totalScore, ve hatta içsel/güvenli
   sabitler: `tag.color`, `block.statusColor`, roadmap indeksi) `escapeHtml()`'e
   sarıldı — doğrulama bir gün atlanır/unutulursa bile şablon katmanı TEK
   BAŞINA güvenli.
2. **`/api/maturity-pdf` halka açık, kimliksizdi:** bu endpoint yalnızca
   deploy-sonrası MANUEL pilot testi için (bkz. dosya başı yorumu) — halka
   açık kalırsa hem ucuz bir kaynak-tüketim vektörü (her istek gerçek bir
   headless Chromium başlatıyor) hem doğrulama atlanırsa render motoruna
   doğrudan erişim riski taşıyordu. Paylaşılan bir secret
   (`MATURITY_PDF_PILOT_SECRET`, `.dev.vars.example`) `X-Pilot-Secret`
   header'ında eşleşmezse — veya env'de HİÇ TANIMLI DEĞİLSE (varsayılan) —
   404 dönüyor (endpoint'in varlığını bile açığa çıkarmamak için 403
   DEĞİL).
3. **`/api/lead` için geçici IP bazlı hız sınırı** eklendi (60sn'de 10
   istek) — reCAPTCHA site key gelene kadar tek savunma katmanı yoktu.
   **Dürüst sınır:** Workers isolate'ı İÇİNDE tutulan basit bir sabit-
   pencere sayaç, Cloudflare'ın edge ağında DAĞITIK/GARANTİLİ bir sınır
   DEĞİL (aynı istemci farklı isolate'lara denk gelebilir) — yalnızca
   ucuz bir ilk savunma katmanı, kalıcı çözüm Cloudflare Rate Limiting
   kuralı (dashboard) veya reCAPTCHA v3.

**Doğrulama:** `astro check` 0 hata, `astro build` temiz, 9 regresyon
script'i sıfır yeni sorun (bilinen 5 H1→H3 hariç). Enjeksiyon senaryosu
İKİ bağımsız katmanda test edildi: (a) `/api/lead`'e kötü niyetli
`categoryScores` (`<script>...`) POST edildi → 400 `invalid_payload` (API
katmanı), (b) `renderMaturityReportHtml()` doğrulama HİÇ ÇAĞIRILMADAN
doğrudan kötü niyetli değerlerle çağrıldı → çıktıda ham `<script>`/
`<img onerror>`/`<svg onload>` YOK, yalnızca kaçışlanmış metin (şablon
katmanı). Ayrıca doğrulandı: geçerli/meşru payload hâlâ kabul ediliyor
(regresyon yok), `/api/maturity-pdf` hem secret'sız hem yanlış secret'la
404 dönüyor, 12 ardışık `/api/lead` isteğinin 5'i 429 ile sınırlandı.

---

## 🔶 KEYSTATIC GEÇİŞİ — devam ediyor, karar bekleniyor (2026-08-27'de başladı)

Blog CMS aracı Decap CMS'ten Keystatic'e geçiriliyor. Projenin temel render
mimarisini (`astro.config.mjs`) etkileyen bir değişiklik olduğu için ADIM
ADIM, her adım sonrası doğrulama + kullanıcı onayıyla ilerleniyor —
927+ sayfalık SEO/GEO emeğinin KORUNMASI öncelik. **Güvenlik ağı:**
`keystatic-oncesi-yedek` dalı hem `origin` hem `idenfit` remote'unda,
`ef3666b` commit'inde duruyor — bu turdaki HERHANGİ bir değişiklikten geri
dönüş her zaman mümkün.

**ADIM 0 (referans nokta) — ✅ TAMAMLANDI.** Değişiklik öncesi `astro
build` çıktısı referans alındı: `dist/` toplam **3114 HTML dosyası** (3113
gerçek içerik sayfası + 1 `admin/index.html` Decap kabuğu). 8
`check-*.mjs` regresyon script'i çalıştırılıp sonuçlar kayıt altına
alındı — hepsi bilinen/kabul edilmiş taban çizgisiyle uyumluydu (heading
6 sorunlu [5'i bilinen ana sayfa H1→H3 + 1 admin], hreflang 0 [site alanı
boş, beklenen], html-lang 0 sorunlu gerçek sayfa, image-alt 0, json-ld
2630 blok/0 geçersiz, link-accessibility 0, meta-description 1 sorunlu
[admin], title-length 1 sorunlu [admin]).

**ADIM 1 (output modu değişikliği) — ✅ TAMAMLANDI.**
- `astro.config.mjs`: `output:'server'` + `@astrojs/cloudflare` adapter
  eklendi (Astro 5+'ta `hybrid` kaldırıldığı doğrulandı, modern eşdeğeri
  budur). **201/201 mevcut sayfa dosyasına** `export const prerender =
  true;` script ile eklendi (config seviyesinde toplu seçenek yok, tek
  tek eklenmesi şart) — hiçbiri yanlışlıkla server-render'a kaymadı.
- `npm install` → `npm ci` temiz kurulum doğrulandı, `astro build` exit 0.
- **Referans sayı karşılaştırması, kullanıcı onayıyla kriter güncellendi:**
  3114 → **3091** HTML dosyası (23 azaldı). Fark TAM açıklanıyor, regresyon
  DEĞİL: Cloudflare adapter, `astro.config.mjs`'teki 23 manuel `redirects`
  girdisini artık statik meta-refresh HTML yerine native Cloudflare
  `_redirects` dosyasında GERÇEK 301 kuralı olarak yazıyor (`wrangler dev`
  ile `/suprema`→301→`/donanim` doğrulandı) — SEO açısından ÖNCEKİNDEN
  DAHA İYİ bir mekanizma. Otomatik i18n fallback stub'ları (2163 sayfa)
  hiç değişmeden statik kaldı. **928 gerçek içerik sayfası birebir
  korundu.**
- 8 regresyon script'i `DIST_DIR=dist/client` ile (script dosyalarına
  DOKUNULMADAN, zaten var olan env değişkeniyle) yeniden çalıştırıldı —
  ADIM 0 taban çizgisiyle birebir aynı, sıfır yeni regresyon.
- **Açık nokta olarak kaydedildi (bkz. §Açık noktalar #40) — düşük
  öncelik, ayrı bir turda ele alınacak:** var olmayan `/en/`, `/nl/`,
  `/it/`, `/az/` URL'lerinde HTTP status kodu her zaman doğru 404
  dönüyor (SEO sinyali sağlam) ama içerik artık HER ZAMAN TR gösteriliyor
  (kök neden: Astro'nun i18n `fallback` mekanizması `output:'server'`'da
  bilinmeyen yollar için de dinamik yönlendirme davranışına sahip oldu,
  2 çözüm denendi ikisi de bu önceliğe yenildi — detay CLAUDE.md #40'ta).
  **927+ gerçek sayfa ETKİLENMİYOR.**

**ADIM 2 (Keystatic kurulumu) — 🔶 YARIDA, KARAR BEKLİYOR.**
- `@keystatic/core` + `@keystatic/astro` kuruldu, `astro.config.mjs`'e
  `keystatic()` integration'ı eklendi.
- **BÜYÜK BULGU — Keystatic'in `storage:{kind:'local'}` modu Cloudflare
  Workers runtime'ıyla (workerd) MİMARİ OLARAK UYUMSUZ.** `local` mod
  git çalışma dizinine doğrudan `fs` (dosya sistemi) erişimi gerektiriyor
  — Workers (hem `astro dev` hem `wrangler dev`'de, hatta prod'da) bunu
  sağlamıyor. Kanıt: `wrangler dev` üzerinde gerçek build'i test ederken
  Keystatic'in kendi API'si açıkça şu hatayı döndürdü: *"The Keystatic
  API route is running in a non-Node.js environment which is not
  supported with `storage: { kind: 'local' }`"*. (`astro dev`'de ayrıca
  farklı bir "exports is not defined" Vite SSR/CJS-bundling çökmesi de
  vardı — muhtemelen aynı kök nedenin farklı bir belirtisi, `nodejs_compat`
  ve `vite.ssr.external` denendi, ikisi de çözmedi.) Bu, config'le
  düzeltilemeyecek bir mimari sınır.
- **İki gerçek seçenek belirlendi, kullanıcı ekibiyle görüşüp KARAR
  VERDİ (2026-08-28): (A) Keystatic Cloud.** Seçenekler:
  - **(A) `storage:{kind:'cloud'}` + `cloud:{project:'takım/proje'}`**
    — Keystatic Cloud'un ücretsiz katmanı (takım başına 3 kullanıcıya
    kadar, sınırsız takım/proje). Keystatic'in kendi ifadesiyle: *"No
    need to deal with environment variables and a custom GitHub app."*
    Manuel GitHub OAuth App kurulumu GEREKMİYOR — ama üçüncü taraf bir
    kimlik doğrulama/aracı bağımlılığı yaratıyor (İÇERİK'in kendisi HİÇBİR
    ZAMAN Keystatic'in sunucularında durmuyor, yalnızca giriş/token
    değişimi oradan geçiyor — asıl veri her zaman GitHub'da kalıyor).
    Cloudflare Workers runtime'ıyla uyumlu olması BEKLENİYOR (saf
    HTTP/API çağrıları, `local` modun fs sorunu burada yok) — henüz
    CANLI test edilmedi.
  - **(B) `storage:{kind:'github'}`** — kendi GitHub OAuth App'imiz,
    sıfır üçüncü taraf bağımlılığı, ama Decap'te kaçınılmaya çalışılan
    AYNI yükü taşıyor (client ID/secret env değişkenleri, kendi
    token-exchange backend route'u) — Cloudflare adapter zaten kurulu
    olduğu için bu backend route'u barındırmak artık daha az ek iş
    (ADIM 1 sayesinde zaten SSR var), ama yine de manuel kurulum şart.
  - İlk yanlış öneri (düz "GitHub moduna geç") kullanıcı tarafından
    doğru şekilde sorgulandı — 2 modun (`github` vs `cloud`) OAuth App
    gereksinimi bakımından TAMAMEN FARKLI olduğu netleştirildi, kesin
    cevap kurulu paketin TypeScript tip tanımları (`config.d.ts`) +
    Keystatic'in resmi `/docs/cloud` sayfası okunarak doğrulandı.
  - **KARAR NETLİĞİ (kullanıcı notu, 2026-08-28):** (A) Cloud, KALICI bir
    mimari karar DEĞİL — geçici bir tercih. Canlıya çıkış sonrası, iş
    yükü azaldığında (B)'ye (kendi GitHub OAuth App'imiz) geçiş
    PLANLANIYOR. Bu geçiş düşük risklidir — yalnızca `keystatic.config.ts`'in
    `storage`/`cloud` satırlarını ve yeni bir OAuth App kurulumunu
    etkiler, sitenin geri kalanına (şema, sayfalar, veri) dokunmaz.
- **Uygulandı (2026-08-28):** `keystatic.config.ts`'e `storage:{kind:'cloud'}`
  + `cloud:{project:'idenfit/idenfit-astro'}` yazıldı — **proje adı
  PLACEHOLDER**, kullanıcı keystatic.cloud'da gerçek hesap/proje
  oluşturunca gerçek `takım-slug/proje-slug` ile değiştirilecek. Şu anki
  kod durumu (commit EDİLMEDİ): `.keystatic-scratch-test/` hâlâ geçici
  test koleksiyonu taşıyor (gerçek blog şeması bir sonraki adımda proje
  adı netleşince yazılacak). `wrangler.json` (`compatibility_flags:
  ["nodejs_compat"]`) + `astro.config.mjs`'teki `keystatic()` integration'ı
  + `package.json`'daki `@keystatic/core`/`@keystatic/astro` bağımlılığı
  ADIM 2'nin önceki turundan aynen duruyor.

**ADIM 2 devamı — ✅ TAMAMLANDI (2026-08-28).**
1. **keystatic.cloud proje kurulumu doğrulandı.** `keystatic.config.ts`'teki
   `cloud:{project:'idenfit/idenfit-astro'}` kullanıcının GERÇEK
   kurulumuyla birebir eşleşti (placeholder değil). `localhost:4321/keystatic`
   → otomatik `127.0.0.1` loopback'e yönlenip "Log in with Keystatic
   Cloud" ile sorunsuz giriş yapıldı — **dashboard'daki "Primary URL"
   alanı yalnızca kozmetik/bilgi amaçlı**, OAuth `redirect_uri`'si
   `window.location.origin`'e (o anki origin, ne olursa olsun) dayanıyor
   — kanıt: `@keystatic/core`'un kendi `keystatic-core-ui.js` kaynağı,
   `redirect_uri: \`${window.location.origin}/keystatic/cloud/oauth/callback\``.
2. **Gerçek blog şeması yazıldı**, `scratchTest` koleksiyonu kaldırıldı.
   Şema, eski Decap config.yml'nin (`public/admin/config.yml`) alan
   seçimini birebir taşıyor + `content.config.ts`'in zod şemasındaki
   TÜM alanları kapsıyor (`slug`/`title`/`metaTitle`/`date`/
   `modifiedDate`/`excerpt`/`featuredImage`{url,alt,width,height}/
   `categories`/`tags`/`authorName`/`content`). **Not: ayrı bir
   "description" alanı YOK** — `excerpt` hem blog listesinde hem
   `<meta name="description">`/`og:description`'da kullanılıyor
   (`[slug].astro:90,115`), bu tasarım gereği tek alan.
3. **Cloud modda canlı git commit testi yapıldı ve onaylandı.**
   `idenfit-yatirim-duyurusu.md`'nin Özet alanına test metni eklenip
   Save'e basıldı → gerçek commit `66fea5e` (`keystatic-cloud[bot]`,
   `idenfit/idenfit.com` reposu — yerel `master` dalının zaten takip
   ettiği repo) doğru dosyayı değiştirdi. **3 istenmeyen yan etki
   bulundu** (yalnızca excerpt'e dokunulmuştu): (a) gövdede 2 çift
   boşluk sessizce `&nbsp;`'ye döndü, (b) `date` `'2024-10-02T09:30:00'`
   (tırnaklı/naive) → `2024-10-02T09:30:00.000Z` (UTC "Z" damgalı,
   3 saatlik anlamsal kayma riski, bugün görünür etkisi yok çünkü saat
   gösterilmiyor), (c) YAML biçimi değişti (uzun string'ler `>-` katlanmış
   bloğa döndü, frontmatter sonrası boş satır kayboldu) — **kalıcı ders:
   Keystatic'in markdoc editörü SAVE'de dokunulmayan alanları bile
   yeniden serileştiriyor.** `date`/`datetime` alanı ayrıca saniye
   içeren mevcut değerlerde (`^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$` regex'i,
   saniye YOK) "is not a valid datetime" hatası verip Save'i
   engelliyordu — saat alanına dokunup (değer aynı kalacak şekilde)
   onChange tetiklenerek aşıldı. Test commit'i `git revert 66fea5e`
   ile (Keystatic panelinden TEKRAR düzenleme DEĞİL — o da aynı
   yeniden-biçimlendirmeyi tekrar tetiklerdi) byte-byte orijinale
   döndürülüp `idenfit` remote'una push edildi (`74e3fca`). **Not:**
   `origin` (Sude-product/site-migration-astro) bu commit çiftini
   almadı, iki remote arasında senkron açık nokta olarak kaldı — bkz.
   Açık nokta #41.
4. **`featuredImage: null` riski bulunup DÜZELTİLDİ.** Görseli olmayan
   tek yazı (`zirve-katilim-ix-kurumsal-egitim-ve-gelisim-zirvesi.md`)
   panelde hatasız açıldı ama Keystatic'in `fields.object()`'i asla
   `null` YAZAMIYOR — SAVE edilirse boş-string'li ama TRUTHY bir objeye
   dönüşüp `<img src="">` kırık etiketi render edebilirdi.
   `fields.conditional` izole bir scratch-test'te denendi
   (`.keystatic-scratch-image-test/`, sonra temizlendi) — YAML'a düz
   `null` DEĞİL `{discriminant, value}` sarmalayıcısı yazdığı görüldü,
   mevcut zod şemasıyla uyuşmuyor. Bunun yerine **render tarafı
   sağlamlaştırıldı**: `src/pages/blog/[slug].astro`'daki 2 truthy
   kontrolü (hero görseli + "Benzer Yazılar" kartları)
   `featuredImage &&` → `featuredImage?.url &&`'e çevrildi — hem `null`
   hem boş-string'li obje için doğru çalışıyor, commit EDİLMEDİ (diğer
   Keystatic değişiklikleriyle birlikte bekliyor).

**ADIM 3 (son doğrulama) — henüz başlanmadı**, ADIM 2 tamamlandı, sıradaki
adım kullanıcının bu turu gözden geçirip commit onayı vermesi.

**✅ TAMAMLANDI (2026-08-29) — Kademeli blog göçü (Açık nokta #21'in ilk
maddesi) bitti: 622/622 yazı artık `.md`.** `posts.json`'da kalan 618
yazı 4 grup halinde (151+151+151+151, `scripts/migrate-blog-to-markdown.mjs`)
taşındı — grup öncesi her seferinde pilot turda bulunan 3 bug'ın (aşağıda)
kalıcılığı doğrulandı, grup sonrası `astro build` + 8 regresyon script'i
+ 8 rastgele yazının satır satır orijinaliyle karşılaştırması yapıldı.
**Sıfır veri kaybı, sıfır regresyon** — `check-json-ld` boyunca
`BlogPosting: 622` sabit kaldı, `check-link-accessibility` her turda 0.
`posts.json` şu an boş dizi. 4 commit (`8a53134`, `7ac70ce`, `f077f43`,
`f47e313`), hem `origin` hem `idenfit` remote'una push edildi.

**Süreçte migrasyon script'inde bulunup düzeltilen 3 sessiz veri kaybı
(pilot turda, gerçek migrasyon başlamadan önce yakalandı):**
1. `scripts/lib/html-to-markdown.mjs` — Turndown `<cite>`/`<sup>`
   etiketlerini unwrap ediyordu (19 cite'lı yazının GEO atıf işaretlemesi
   + KPMG `<sup>` dipnotu migrasyonda tamamen silinirdi). Düzeltme:
   `td.keep(['iframe','cite','sup'])`.
2. `scripts/migrate-blog-to-markdown.mjs`'in frontmatter builder'ı
   `metaTitle`/`modifiedDate`/`authorName`'i hiç kopyalamıyordu (431/618
   yazının `<title>` SEO optimizasyonu + JSON-LD `dateModified` kaybolurdu).
3. `fixLinkAccessibility()`'nin eklediği `aria-label`, Turndown'ın
   varsayılan link kuralında (`[metin](url)`) taşınamadığı için sessizce
   atılıyordu — hem `fixLinkAccessibility()` migrasyona eklendi hem
   `aria-label` taşıyan `<a>`'lar ham HTML olarak korunacak yeni bir
   Turndown kuralı yazıldı.

---

## ✅ ÇÖZÜLDÜ — İki bağımsız git geçmişi birleştirildi (2026-08-25)

**2026-08-24'te tespit edilen** iki bağımsız `git init` geçmişi sorunu
(`origin/master` ile `degisikliklerim-2-bilgisayar-2` arasında ortak
commit atası yoktu) **2026-08-25'te çözüldü.**

**Bulgu:** İnceleme, `origin/master`'ın bu bilgisayardan 3 saat önce
(2026-08-21 09:09) donmuş, hiç yeni commit almamış bir "bilgisayar 1"
geçmişi olduğunu; bu daldaki 27 ek commit'in (SEO/GEO turu + carousel
yeniden tasarımı vb.) origin/master'ın içerdiği HER dosyayı koruyarak
üzerine eklendiğini gösterdi (`git diff origin/master
degisikliklerim-2-bilgisayar-2 --name-status`'ta sıfır silinen dosya —
bu dal net bir üst küme). Tek gerçek çakışma riski taşıyan alan —
`CustomerStoryCarousel` — canlı ekran görüntüsüyle karşılaştırıldı:
origin/master'da carousel'in ilk/sade hali, bu dalda ise kasıtlı
yeniden tasarımı (kırmızı tema, otomatik video döngü, yeni müşteri
logoları) vardı. Kullanıcı bu dalın tasarımının kalmasına karar verdi.

**Uygulanan çözüm:**
```
git merge --allow-unrelated-histories -X ours origin/master
```
Merge çakışmasız tamamlandı, sonuç ağacı merge-öncesi bu dalla birebir
aynı kaldı (doğrulandı: `git diff <merge-öncesi-commit> HEAD` boş
döndü) — yani hiçbir içerik kaybı olmadı, sadece origin/master'ın
gerçek 67 commit'lik geçmişi artık bu dalın atası. Hem
`degisikliklerim-2-bilgisayar-2` hem `master` origin'e push edildi
(`master` fast-forward, force GEREKMEDİ). Artık GitHub'da tek, birleşik
geçmiş var.

---

## Yarın için plan (2026-08-25, kullanıcı notu 2026-08-24'te düşüldü)

1. **Blog CMS (Decap CMS) — kalan adımlar:**
   - IT'ye GitHub OAuth App onayının durumu soruldu (2026-08-24).
   - Onaylandıysa: Client ID/Secret alınıp kendi Cloudflare Pages
     Functions tabanlı OAuth token-exchange endpoint'imiz kurulacak
     (tahmini 1-2 saat, Netlify'ın paylaşılan servisi KULLANILMAYACAK).
   - Site en azından bir Cloudflare Pages test URL'sine (`xxx.pages.dev`)
     deploy edilecek (tahmini 1-2 saat, ilk deploy olduğu için
     konfigürasyon sürprizleri çıkabilir).
   - Marketing ekibinden erişecek kişiler netleştirilip GitHub
     hesapları Sude-product organizasyonuna eklenecek.
   - Uçtan uca test edilecek.
2. ~~Açık nokta #28 (Title tag uzunluk optimizasyonu)~~ — 2026-08-25'te
   kapandı, yukarıdaki madde 28'e bkz.
3. ~~İki bağımsız git geçmişinin birleştirilmesi~~ — 2026-08-25'te
   çözüldü, yukarıdaki "✅ ÇÖZÜLDÜ" bölümüne bkz.

---

## Güncel durum (son güncelleme: 2026-10-04)

### ✅ JSON-LD şema turu — 9 PR (2026-10-02/04)

Her PR tek tek push edilip merge edildi ve **merge'den sonra canlıda
doğrulandı**, ancak ondan sonra sıradakine geçildi (kullanıcı kararı).

| Sıra | PR | Dal | Commit | Merge | İçerik |
|---|---|---|---|---|---|
| 1 | #15 | `feat/jsonld-organization` | `ab889d1` | `ea3c596` | `Organization`'a `@id` + `description`/`telephone`/`email`/`areaServed`/`addressLocality` |
| 2 | #16 | `feat/jsonld-publisher-id` | `daf02e3` | `7c9b31c` | `BlogPosting.publisher`/`author` + yeni `WebPage.publisher` → `@id` referansı |
| 3 | #17 | `feat/jsonld-webpage-unconditional` | `8d46c75` | `d4be4ad` | `WebPage` koşulsuz, `dateModified` opsiyonel alan — 146 sayfa kimlik kazandı |
| 4 | — | `feat/jsonld-inlanguage` | — | — | `WebPage` + `BlogPosting`'e `inLanguage` |
| 5 | #22 | `feat/jsonld-softwareapplication` | `f448164` | `8e4d096` | Ürün/modül sayfalarına `SoftwareApplication` — 111 sayfa (Açık nokta #29) |
| 6 | #24 | `feat/jsonld-featurelist-temizligi` | `903d2c0` | `6dcb013` | `featureList` temizliği (10 girdi) + 5 uzun `name` kısaltıldı — PR 5 ÜZERİNE kuruldu |
| 7 | #25 | `feat/jsonld-webapplication` | `3e99a1d` | `99e283f` | Hesaplama Araçları'na `WebApplication` + `offers` 0 TRY (1 sayfa) |
| 8 | #27 | `feat/jsonld-articlesection` | `ddd76f9` | `9dd7ede` | Blog yazılarına `articleSection` — 640 sayfa |
| 9 | — | `feat/jsonld-collectionpage` | `3391a35` | — | Blog liste sayfaları `WebPage`→`CollectionPage` + `mainEntity: ItemList` — 54 sayfa (bu tur) |

Üçü GitHub'da **merge commit**'le alındı (squash DEĞİL), bu yüzden her
PR'ın diff'i yalnızca kendi commit'ini gösterdi.

**Sıra neden zorunluydu:** PR #16, PR #15'in tanımladığı `@id`'ye REFERANS
veriyor — önce merge edilse 803 sayfada **tanımsız bir düğüme atıf** oluşurdu
ve bu JSON-LD'de **hata vermez**, sessizce yanlış olurdu. PR #17 de #16'nın
eklediği satırı içeren bloğu değiştiriyor. Üçü `BaseLayout.astro`'nun AYNI
bölgesine dokunuyor.

**PR 4 (`inLanguage`) daha eski bir master'dan (`e844680`) dallanmıştı** ve
AYNI `WebPage` bloğuna dokunduğu için çakışması kesindi. GitHub editöründe
değil, YERELDE rebase edilip çözüldü (kullanıcı kararı: "üç tuzaktan biri
gözden kaçarsa 146 sayfa sessizce şemasız kalır, hata vermeden"), sonra
build + byte diff ile doğrulandı. **Çözümün nihai alan sırası:**

```js
url: pageUrl,
inLanguage: lang,                                                     // PR 4
...(IDENFIT_ORG_ID ? { publisher: { '@id': IDENFIT_ORG_ID } } : {}),  // PR #16
...(dateModified ? { dateModified } : {}),                            // PR #17
```

**Benzer bir çakışmada tekrar düşülecek ÜÇ TUZAK** (üçü de sessiz
regresyon üretir, hiçbiri hata vermez):
1. Koşul `{ogType !== 'article' && (` KALMALI — eski dalın
   `&& dateModified &&` hâli alınırsa PR #17 sessizce geri alınır ve
   146 sayfa yine şemasız kalır.
2. `dateModified` SPREAD kalmalı — eski dalın düz `dateModified,` satırı
   alınırsa tarihi olmayan sayfalarda `"dateModified": undefined` riski
   doğar.
3. `inLanguage` `url`'den hemen sonra (anahtar sırası schema.org açısından
   anlamsız, yalnızca okunurluk).

**🟢 2026-10-04 — JSON-LD şema turu PR 9: blog liste sayfaları `WebPage`→`CollectionPage` + `mainEntity: ItemList` (54 sayfa).**
Blog listesinin 54 sayfası (`/blog/` + `/blog/page/2..54/`) şema seviyesinde
jenerik `WebPage` tipindeydi: bir LİSTELEME sayfası oldukları ve hangi
yazıları listeledikleri hiç söylenmiyordu.
**⚠️ AYRI BİR BLOK EKLENMEDİ — mevcut bloğun TİPİ değişti. Bu, turun şeklini
ve dolayısıyla ÖLÇÜTÜNÜ değiştiren bir karar (kullanıcı onaylı, 2026-10-04):**
`CollectionPage` schema.org'da `WebPage`'in **ALT TİPİ**. İkisini aynı sayfaya
birlikte basmak aynı URL için İKİ sayfa-seviyesi düğüm üretirdi
(`name`/`description`/`url` birebir aynı) — ve bu, projenin ZATEN uyguladığı
kuralın tersi olurdu: blok `ogType !== 'article'` koşuluyla basılıyor ki blog
YAZILARI `WebPage` + `BlogPosting` ikilisini ALMASIN (PR 4'ün kaydı). Aynı
ilke PR 3'ün "aynı varlığı yeniden tanımlamayı bırak, referans ver"
kararının da temeli. Tip DEĞİŞİMİ hiçbir alanı kaybettirmiyor (bir
`CollectionPage` bir `WebPage`'dir) ve tek tutarlı düğüm bırakıyor.
**Sonuç: blok SAYISI değişmedi (3065), bu yüzden PR 5/PR 7'nin dörtlü
ölçütü UYGULANAMADI — PR 6 tipi ölçüt kullanıldı.**
**`BaseLayout`'a yeni opt-in `collection` prop'u — ve BİLİNÇLİ olarak TEK
prop.** İki ayrı prop (tip + öğeler) bir gün sessizce ayrışırdı: biri
verilip diğeri unutulduğunda ya tipsiz bir liste ya öğesiz bir koleksiyon
oluşur, **ikisi de hata vermez**. Bu projenin tekrar tekrar ısırıldığı sınıf
(PR 6'nın iki dönüş noktası, Açık nokta #64'ün passthrough'u) — tek anahtar
bunu yapısal olarak imkânsız kılıyor. Prop verilmeyen TÜM sayfalarda
davranış DEĞİŞMEZ (255 `WebPage` bloğu birebir korundu, ölçüldü).
**`mainEntity: ItemList`** — sayfanın GERÇEKTEN listelediği öğeler, render
SIRASIYLA. Kaynak, görünür kart döngüsünün (`items.map`) kullandığı AYNI
dizi; ikinci bir liste kurulmadı ve `url` kartın `href`'iyle aynı ifadeden
üretiliyor. Üç tasarım kararı: (a) öğe URL'leri **MUTLAK**
(`toAbsoluteUrl`) — göreli olanları Google yok sayıyor, `image`/
`mainEntityOfPage` ile aynı kural; (b) `numberOfItems` TÜM koleksiyonun
değil **BU SAYFANIN** öğe sayısı — `ItemList` tam olarak bu sayfanın
listesini tarif ediyor, 640 yazmak her sayfada aynı yanlış sayıyı iddia
etmek olurdu; (c) boş listede alan **HİÇ basılmıyor** (liste sayfasının
"henüz yazı yok" durumu) — boş bir `ItemList` iddia etmek yanlış olurdu.
**`check-json-ld.mjs`'e İKİ şey eklendi:** `CollectionPage` flat kuralları
(`name`/`url` ZORUNLU; `description`/`inLanguage`/`mainEntity` ÖNERİLEN) ve
**`ItemList` İÇ YAPISI için derin kontrol** (FAQPage'in AYNI deseni — flat
alan listesi iç yapıyı ifade edemiyor): `mainEntity.@type` ItemList mi,
`numberOfItems` gerçek uzunlukla uyuşuyor mu, `position` 1'den artan mı,
`name` dolu mu, `url` MUTLAK mı. **Yakaladığı sınıf gerçek:** dizi
`position: i + 1` ile ÜRETİLİYOR ve öğeler sayfanın render sırasından
geliyor — sıralama/dilimleme mantığı değişirse position'lar kayar,
`numberOfItems` ayrışır veya URL'ler göreli kalır; **üçü de JSON-LD'de
HATA VERMEZ, sessizce yanlış olur.** 8 senaryolu negatif testle kanıtlandı:
6 geçersiz (`name` yok / sayı yanlış / position kaymış / göreli url /
yanlış tip / boş liste) + 1 uyarı (`mainEntity` yok), sağlam kopya temiz.
**Doğrulama — PR 6 tipi ölçüt, indeks bazlı hash KULLANILMADI.** Blok
dağılımı: `WebPage` 309→**255**, `CollectionPage` 0→**54**, toplam blok
3065 DEĞİŞMEDİ. (1) 54 dosyanın tam dosya sha256'sı değişti; (2) blok
sayısı **0** dosyada değişti; (3) değişen küme **==** blog liste sayfası
kümesi (birebir); (4) blok tipi bazında yalnızca 54 `WebPage` bloğu
değişti ve 54'ünün de TİPİ değişti, diğer TÜM tipler **0** değişti
(`Organization` 949, `BreadcrumbList` 939, `BlogPosting` 640,
`SoftwareApplication` 111, `FAQPage` 116, `WebApplication` 1); (5)
alan-alan 54/54: `@type` DIŞINDA değişen alan **0**, silinen **0**,
eklenen TAM **1** (`mainEntity`); (6) liste DIŞI kalan **255/255**
`WebPage` bloğunun ham metni birebir aynı; (7) **KESİN KANIT —
3176/3176** HTML'de bloklar baseline metnine geri konunca sha256
baseline'a eşit, yani JSON-LD DIŞINDA sitede **0 bayt** değişti.
**İÇERİK doğrulaması (bu PR'ın ASIL kontrolü — şema sayfanın görünenini
doğru tarif ediyor mu):** 54/54 sayfada ItemList'in URL'i **+ SIRASI**
görünür kartlarla BİREBİR, 54/54'te `name` görünür kart başlığıyla
BİREBİR, 54/54'te `position` 1..N; tüm ItemList'lerde **640 BENZERSİZ**
yazı URL'i — her yazı TAM 1 kez (53×12 + 1×4), ne tekrar ne boşluk.
`astro check` 431 dosya 0 hata/0 uyarı/27 hint, `astro build` temiz
(3176 HTML). 11 regresyon script'inden **10'u baseline ile BİREBİR
aynı**; farklı olan TEK script `check-json-ld` ve farkı TAM OLARAK
beklenen iki satır (`WebPage: 309`→`255`, `CollectionPage: 54`) —
**0 geçersiz, 0 uyarı**. `safeJsonLd()`: 54 blokta çıplak `<`/`>`/`&`
YOK, hepsi geçerli JSON, göreli kalmış öğe URL'i **0**.
`public/_headers` değişmedi.
**Boyut maliyeti ÖLÇÜLDÜ (bu turun gerçek ödünü):** 54 sayfada toplam
**+98,2 KB** (sayfa başına min 618 / ortalama 1862 / max 2573 bayt).
Site genelinde başka hiçbir sayfa büyümedi. Kabul edildi çünkü
`ItemList` bu PR'ın asıl değeri.
**⚠️ BU TURDA BULUNAN, BİLİNÇLİ OLARAK KAPSAM DIŞI BIRAKILAN BOŞLUK —
`check-json-ld.mjs`'in `WebPage` kuralı HİÇ YOK.** `REQUIRED_BY_TYPE`/
`RECOMMENDED_BY_TYPE`'da `WebPage` girdisi olmadığı için **255 `WebPage`
bloğu `required=[]`/`recommended=[]` ile hiç doğrulanmıyor** — PR 5'in
`SoftwareApplication` için tespit ettiği "boş güvence" sorununun
birebir aynısı. Bu tur kapatılmadı (kapsam `CollectionPage`'di ve
`WebPage` kuralı eklemek 255 bloğu ilk kez doğrulamaya sokacağı için
ayrı bir ölçüm turu gerektirir); not script'in kendi yorumuna da
yazıldı. **Ayrı bir tur.**
**⚠️ ARAÇ DERSİ (bu turda yaşandı, tekrar düşülmemesi için) — baseline
build'i KOŞARKEN kaynak dosya düzenlendi.** Baseline arka planda
build edilirken `BaseLayout.astro`'ya ilk (tip-seviyesi) düzenleme
yapıldı; PR 4'ün dersi tam bu sınıf (kirli baseline yanıltıcı "0 fark"
üretir). Baseline ATILMADI ama GEÇERLİLİĞİ VARSAYILMADI, **kanıtlandı:**
(a) baseline'da `CollectionPage` bloğu **0** — değişikliğin TEK runtime
etkisi bu, olsaydı görünürdü; (b) 54 liste sayfası beklenen
`Organization + WebPage + BreadcrumbList` imzasında; (c)
`/blog/page/7/`'nin `WebPage` bloğu, düzenleme ÖNCESİ ayrı bir dist'ten
ölçülen hâliyle **byte-birebir** aynı. **Kural: arka plan build'i
koşarken kaynak dosyaya DOKUNULMAZ** — kanıtlamak mümkün oldu ama
şansa bağlıydı (düzenleme tip-seviyesiydi, runtime çıktısı yoktu).

**🟢 2026-10-04 — JSON-LD şema turu PR 8: blog yazılarına `articleSection` eklendi (640 sayfa).**
`BlogPosting` bloğu bir yazının hangi bölüme/rubriğe ait olduğunu şema
seviyesinde HİÇ söylemiyordu. Alan, sayfada H1'in üstünde **GÖRÜNEN** kategori
şeridinin (`categoryLabel`) beslendiği AYNI `categories` dizisinden
türetiliyor — görünen ad `CATEGORY_LABELS` (`content.config.ts`) üzerinden,
ham slug DEĞİL. Yeni metin yazılmadı, ikinci bir "bölüm" kavramı uydurulmadı
(KARAR 1). Bu PR, bir önceki maddedeki "Uncategorized" temizliğinin ÜZERİNE
kuruldu (o temizlik olmadan 8 yazının şemasına `"Uncategorized"` basılacaktı).
**Veri ölçümü (640 `.md`, kaynaktan):** kategorisiz 0, 10 benzersiz slug →
9 görünen ad; dağılım bir önceki maddenin taksonomi ölçümüyle BİREBİR aynı.
`articleSection` girdi sayısı: 576 yazı 1, 57 yazı 2, 7 yazı 3 bölüm.
**İKİ bilinçli tasarım kararı:**
- **DEDUPE var ama bugün NO-OP — ve bu ölçüldü, varsayılmadı.**
  `guncel-bilgiler` + `guncel-bilgiler-tr` AYNI görünen adı taşıyan 2 WP
  kategori ID'si. 640 yazının tamamı tarandı: **hiçbir yazı aynı görünen adı
  iki kez taşımıyor (0 yazı)**, ve panelin `CATEGORY_OPTIONS`'ında
  (`keystatic.config.ts`) `guncel-bilgiler-tr` ZATEN yok (9 seçenek, 9 ayrı
  etiket) — yani panelden tekrar üretmek de mümkün değil. Dedupe yalnızca
  kalan tek yol (bir `.md`'nin elle düzenlenmesi) için duruyor.
  **Görünür `categoryLabel` BİLİNÇLİ olarak dedupe EDİLMEDİ** — bu PR'ın
  diff'i yalnızca JSON-LD; istenirse tek satırla paylaşılan tek kaynağa
  indirilebilir (bugün çıktı birebir aynı olurdu, 0 yazı etkilendiği için).
- **⚠️ Alan BOŞ kategoride HİÇ BASILMIYOR (düz `[]` DEĞİL, spread ile
  yokluk) — ve bu bir zorunluluk, üslup tercihi değil.**
  `check-json-ld.mjs`'in önerilen-alan kontrolü `!block[field]` kullanıyor ve
  **JavaScript'te boş dizi TRUTHY**: `[]` basılsa kontrol sessizce geçerdi.
  Ampirik olarak kanıtlandı (aşağıdaki negatif test, senaryo c).
  İki taraf birlikte anlamlı — biri değişirse diğeri boşa düşer.
**`check-json-ld.mjs`'e kalıcı kontrol eklendi** (`articleSection`,
BlogPosting/Article'ın ÖNERİLEN listesine). **Yorumda açıkça yazılı ki
ileride yanlış okunmasın: bu bir Google önerisi DEĞİL** — Google'ın Article
dokümantasyonunda `articleSection` hiç yok; buraya bir PROJE DEĞİŞMEZİ olarak
yazıldı (kategorisiz yazı = veri kusuru, Açık nokta #70'in sınıfı).
Kuralın çalıştığı ÜÇ senaryolu negatif testle kanıtlandı: alan yok → **1
uyarı**, alan var → 0, `[]` → **0** (gate kırılmıyor, uyarı hata değil).
**⚠️ DÜRÜST BEKLENTİ:** `articleSection` arama sonucunda bir rich result
ÜRETMEYECEK — Google bu alanı kullanmıyor. Kazanç daha dar ama gerçek:
yazının bölümü makine-okunur ve LLM tabanlı araçlar için okunabilir.
(PR 5'teki `SoftwareApplication` ve `FAQPage` notlarıyla AYNI dürüstlük
deseni.)
**Doğrulama — bu tur blok EKLEMİYOR, mevcut bloğa ALAN ekliyor**, bu yüzden
PR 5/PR 7'nin "blok kazandı + boyut muhasebesi" dörtlüsü değil PR 6 tipi
ölçüt uygulandı; indeks bazlı hash KULLANILMADI (PR 4'ün dersi). Baseline
proje ağacının DIŞINDA, kod değişikliğinden ÖNCE temiz `master`'dan
(`0209e5e`) alındı. (1) 640 dosyanın tam dosya sha256'sı değişti; (2) blok
sayısı **0** dosyada değişti; (3) değişen küme **==** `BlogPosting` taşıyan
küme (birebir); (4) `BlogPosting` DIŞINDAKİ blokların ham metni **0** değişti
(`Organization` 949, `BreadcrumbList` 939, `WebPage` 309,
`SoftwareApplication` 111, `FAQPage` 116, `WebApplication` 1); (5) **KESİN
KANIT — 3176/3176** HTML'de bloklar baseline metnine geri konunca dosyanın
sha256'sı baseline'a EŞİT, yani JSON-LD DIŞINDA sitede **0 bayt** değişti
(görünür kategori şeridi dahil; şablona HTML yorumu da sızmadı — PR 2'nin
dersi); (6) alan-alan: 640/640 dosyada TAM 1 eklenen anahtar
(`articleSection`), 0 silinen, 0 değişen, 0 tekrarlı değer, boyut muhasebesi
640/640 tam tutuyor. **Ölçüm aracı notu:** ölçütün (5). maddesi ilk turda
boyut tabanlıydı (kabuk baytı) — aynı-uzunlukta ikameyi kaçırabileceği için
blok-geri-koyma + sha256 eşitliğine yükseltildi; PR 2'nin yöntemi budur ve
blok DEĞİŞTİREN turlarda doğru ölçüt de bu.
`astro check` 431 dosya 0 hata/0 uyarı/27 hint, `astro build` temiz (3176
HTML, baseline ile aynı sayı), **11 regresyon script'i baseline ile BİREBİR
aynı** (bilinen 4 taban çizgisi değişmedi: `check-csp-sync` CRLF/#78,
`check-heading-hierarchy` 5/#36, `check-title-length` 5 +
`check-meta-description-length` 1/#70), `check-json-ld` **0 geçersiz ve 0
uyarı**. `safeJsonLd()` kaçışı doğrulandı: 640 blokta çıplak `<`/`>`/`&`
YOK ve hepsi geçerli JSON. `public/_headers` değişmedi.
**Yan teyit:** `pdks-nedir`'in değeri `["İK Akademi","İK Trendleri"]` —
bir önceki maddedeki "Uncategorized" temizliğinin şemaya da doğru aktığını
gösteriyor.
**⚠️ Araç notu (tekrar düşülmemesi için):** negatif testin ilk kurulumu
yanlıştı — `ld+json` regex'i `g` bayrağı olmadan dosyanın İLK bloğunu
yakalıyor ve blog sayfalarında ilk blok `Organization`, `BlogPosting` DEĞİL.
Sonuç "0 uyarı" çıktı ve kural çalışmıyor sanılabilirdi; `@type`'a bakarak
bloğu açıkça seçmek gerekiyor.

**🟢 2026-10-04 — "Uncategorized" kategorisi 8 blog yazısından KAYNAĞINDA silindi (şema turu öncesi veri temizliği).**
Blog şema turu (`articleSection`) için yapılan taksonomi ölçümünde çıktı;
kullanıcı "kaynağında düzelt" dedi, yani kodda dışlama listesi YOK — veri
temizlendi.
**Ölçüm (640 `.md`, kaynaktan):** `categories` 640/640 DOLU (0 eksik, 0
boş), 11 benzersiz slug → `CATEGORY_LABELS` ile **9 görünen ad** (çünkü
`guncel-bilgiler` + `guncel-bilgiler-tr` ikisi de "Güncel Bilgiler"e
eşleniyor — Polylang `-tr` kopyası etiket düzeyinde zaten birleşmiş).
Bölüm dağılımı: İK Akademi 337, İK Trendleri 163, Güncel Bilgiler 140,
Dijital İK 45, Geçmiş Etkinlikler 14, İK Röportajları 4, Öğretici
Bilgiler 3, Yaklaşan Etkinlikler 3, Yenilikler 2.
**`uncategorized-tr` 8 yazıdaydı ve `CATEGORY_LABELS` onu `'Uncategorized'`
diye etiketliyordu — bu etiket CANLIDA GÖRÜNÜYORDU** (`[slug].astro:182`,
H1'in üstündeki kırmızı/büyük harf şerit; ör. `pdks-nedir` "İK AKADEMİ,
İK TRENDLERİ, UNCATEGORIZED" gösteriyordu). Liste kartları
`categories[0].name` kullandığı için etkilenmemişti (8 yazının hepsinde
`uncategorized-tr` SON sıradaydı).
**Silme öncesi kullanıcının istediği kontrol yapıldı: 8 yazının
HİÇBİRİNDE tek kategori DEĞİLDİ** — her birinin en az 1 gerçek
kategorisi var (en az 1: `avans-yonetimi` → İK Akademi; en çok 3:
`2026-ik-yazilimlari-fiyatlari`). Ayrı karar gerektiren yazı çıkmadı,
silme sonrası kategorisiz kalan yazı 0.
**Panel bunu geri ALAMAZ:** `uncategorized-tr`, `keystatic.config.ts`'in
`CATEGORY_OPTIONS` listesinde ZATEN yok (dosya başındaki yorumda gerekçesi
yazılı). **Yan fayda (test EDİLMEDİ ama mantıken geçerli):** o 8 yazı
panelde açıldığında `fields.multiselect` listede olmayan bir değerle
karşılaşıyordu — #68'de datetime alanında birebir aynı durum Save'i
ENGELLEMİŞTİ; bu temizlik o riski de kaldırıyor.
**Doğrulama:** `astro check` 0 hata/0 uyarı/27 hint, `astro build` temiz.
Diff **0 eklenen / 8 silinen satır** (dosya başına TAM 1 satır, başka
hiçbir şey). Build karşılaştırması: 3176 HTML'in **8'i** değişti, **blog
DIŞI 0 dosya**; 8 sayfanın görünür etiketinden yalnızca "Uncategorized"
gitti, diğer kategoriler birebir korundu (metin metin doğrulandı); **JSON-LD
bloklarının ham metni BİREBİR aynı** (bu tur şemaya hiç dokunmuyor —
`articleSection` henüz eklenmedi); sitede "Uncategorized" geçen sayfa
**8 → 0**. 10 regresyon script'i baseline ile birebir aynı.
**`keywords` kararı (aynı ölçümden):** `tags` alanı 640/640 yazıda VAR ama
**602'sinde BOŞ** — yalnızca 38 yazıda (%5,9) dolu. `reference/wordpress-export/blog-tags.json`
(129 kayıt) gerçek görünen adları taşıyor ve kullanılan 64 tag'in 63'ü
temiz eşleşiyor (anahtar-kelime yığını 0, slug kalıntısı 0), ama
`content.config.ts` `tags`'i DÖNÜŞTÜRMÜYOR (`categories`'i dönüştürüyor),
yani kodda ham slug. **Kullanıcı kararı: `keywords` ŞİMDİLİK EKLENMEYECEK**
— %5,9 kapsam için `TAG_LABELS` haritası kurmaya değmez. **Yapısal bulgu:**
eşleşmeyen tek tag `"Puantaj Takibi"` ZATEN bir görünen ad, slug değil —
kaynağı `sessiz-tukenmislik-vardiya-puantaj-verileri.md`, commit sahibi
`keystatic-cloud[bot]`. Yani panelden yazılan yazılar `tags`'e görünen ad,
WP'den göçenler slug yazıyor; **aynı alanda iki uyumsuz konvansiyon**
(#70'in sınıfı — panel konvansiyonları atlıyor). `keywords` ileride
istenirse ÖNCE bu ayrışma çözülmeli.

**🟢 2026-10-03 — JSON-LD şema turu PR 7: Hesaplama Araçları sayfasına `WebApplication` eklendi (1 sayfa) — ve PR 5'ten BİLİNÇLİ olarak ayrışan bir `offers` kararı.**
Bu sayfa (`/hesaplama-araclari/`) ÖNCEDEN hiç JSON-LD taşımıyordu
(yalnızca `BaseLayout`'un site geneli `Organization`/`WebPage`/
`BreadcrumbList` blokları). **Kapsam beklenenden küçük: TEK sayfa** —
`CalculatorsPage.astro`'yu yalnızca `src/pages/hesaplama-araclari.astro`
kullanıyor ve sayfa TR-only (diğer diller KARAR 2 gereği TR'ye düşüyor,
`hreflangLocales={['tr']}`).
**Alanlar (hepsi sayfanın KENDİ içeriğinden, KARAR 1):** `name` =
`hero.title`, `description` = `hero.text` (meta description ile AYNI tek
kaynak), `url`/`inLanguage`, `featureList` = 8 aracın GERÇEK adları
(`CALCULATOR_DEFINITIONS`, sayfada da bu adlarla render ediliyorlar),
`publisher` = PR 3'ün paylaşılan `organizationId()` referansı.
**⚠️ `offers` + `isAccessibleForFree` BURADA VAR, ürün/modül sayfalarında
(PR 5) YOK — çelişki DEĞİL, ölçülmüş bir FARK.** PR 5'te `offers`
eklenmedi çünkü modüller Fiyatlar sayfasının paketlerine ait ve KOBİ/Pro
2026-09-22'den beri ikisi de "Teklif Al", yani herkese açık fiyatı yok.
Buradaki 8 araç ise GERÇEKTEN bedelsiz ve kayıt istemiyor — doğrulandı:
`CalculatorAccordion` saf istemci tarafı bir React island'ı
(`client:visible`), `fetch`/`api/`/giriş yolu YOK. Yani "ücretsiz"
iddiası burada olgusal olarak DOĞRU. Kullanıcı kararı (2026-10-03):
`offers: {price:"0", priceCurrency:"TRY"}` + `isAccessibleForFree: true`.
**Bunun somut getirisi:** Google'ın "Software App" rich result'ı `name`
YANINDA `offers` VEYA `aggregateRating`/`review` şart koşuyor — PR 5'te üç
eksik yüzünden rich result imkânsızdı, **burada `name` + `offers` şartı
karşılandığı için GERÇEK bir rich result mümkün hale geldi.** (Üretilip
üretilmeyeceği Google'ın kararı, bizim tarafta şart tamam.)
`applicationCategory: 'FinanceApplication'` (kullanıcı kararı) — 8 aracın
tamamı vergi/maaş/tazminat hesabı, bu `BusinessApplication`'dan daha
özgül. Ürün/modül sayfaları `BusinessApplication` kullanmaya devam ediyor;
ikisi de geçerli schema.org enumerasyon değeri.
`softwareVersion` yine YOK (kalıcı karar), `aggregateRating`/`review` de
yok (gerçek derecelendirme verimiz hiç yok).
**Sayfa metninden birebir ALINMAYAN tek alan: `browserRequirements:
'JavaScript gerekir'`** — doğrulanabilir teknik bir olgu (araçlar
`client:visible` island, JS olmadan çalışmıyorlar) ve Google'ın
`WebApplication` için önerdiği alanlardan biri. "Uydurma yok" normuna
harfiyen uymak istenirse tek satırla çıkarılabilir; kullanıcıya açıkça
bildirildi.
**`check-json-ld.mjs`'e `WebApplication` kuralı eklendi** — ve İÇİNDE
BİLİNÇLİ BİR ASİMETRİ var: `offers` `WebApplication`'ın ÖNERİLEN
listesinde VAR, `SoftwareApplication`'ınkinde YOK. Gerekçe yukarıdaki
farkın aynısı ve script'in içinde de yazılı: ürün/modül sayfalarında
`offers` önermek yanlış bir fiyat iddiasına teşvik olurdu. `featureList`
sezgisel uyarısı (PR 6) da `WebApplication`'ı kapsayacak şekilde
genişletildi. Kuralın çalıştığı negatif testle kanıtlandı: `name`'siz blok
→ 1 GEÇERSİZ, `offers`'sız blok → 1 UYARI (gate'i kırmıyor).
**Doğrulama — blok EKLEYEN tur, dörtlü ölçüm** (indeks bazlı hash
KULLANILMADI, PR 4'ün dersi): (1) tam dosya sha256 → **1 dosya**;
(2) değişen küme == blok kazanan küme; (3) TAM +1 blok, tipi
`WebApplication`; (4) boyut farkı eklenen bloğun tam baytına eşit.
Diğer tipler birebir aynı: `Organization` 949, `BreadcrumbList` 939,
`BlogPosting` 640, `WebPage` 309, `SoftwareApplication` 111, `FAQPage`
116. `astro check` 0 hata/0 uyarı/27 hint, `astro build` temiz (3176
HTML), 10 regresyon script'i baseline'a karşı BİREBİR aynı,
`check-json-ld` 0 geçersiz **ve 0 uyarı** (yani blok TÜM önerilen
alanları taşıyor). `safeJsonLd()` kaçışı render'da ayrıca doğrulandı:
blokta çıplak `<`/`>`/`&` YOK (0/0/0) ve metin yine de geçerli JSON.
**Baseline tasarrufu (yöntem notu):** PR 7'nin baseline'ı yeniden build
EDİLMEDİ — PR 6'nın çıktısı yeniden kullanıldı. Geçerliliği varsayılmadı,
ÖLÇÜLDÜ: `git diff 903d2c0 idenfit/master --name-only` tek fark olarak
`CLAUDE.md` gösterdi, o da build çıktısına girmiyor. ~6 dakikalık bir
build'den tasarruf edildi; aynı numara yalnızca bu koşul doğrulanınca
güvenli.

**🟢 2026-10-03 — JSON-LD şema turu PR 6: `featureList`'ten özellik olmayan 10 girdi çıkarıldı + 5 uzun `name` kısaltıldı.**
PR 5'in iki açık ucu kapatıldı. **Dal `master`'dan DEĞİL, PR 5'in dalından
çıktı** (düzeltilen kod yalnızca orada var — PR 2→PR 3 emsalinin aynısı);
**merge sırası PR 5 → PR 6.**
**(a) `featureList` temizliği — gerçek sayı 2 değil 10.** PR 5'in raporunda
"2 girdi" yazmıştım; geniş bir ağla yeniden tarayınca 5 dilde **10 girdi**
çıktı: `pdks-modulu` ailesinin [0] bölümü (Neden idenfit / Niyə idenfit /
Why Idenfit Time and Attendance System? / Perché idenfit / Waarom idenfit)
ve `ise-alim-modulu` ailesinin [4] kapanış CTA'sı (Şimdi Başlayın / İndi
Başlayın / Start Now / Inizia Ora / Begin nu).
**Mekanizma: İNDEKS, metin eşleştirme DEĞİL** (`NON_FEATURE_SECTION_INDEXES`,
`productContent.ts`, `trSlug` ile anahtarlı, locale'den bağımsız — tek
bildirim 5 dili kapsıyor). Gerekçe ölçüldü: başlıklar 5 dilde 5 farklı metin,
bir dize/regex listesi her dil için ayrı girdi isteyip ilk eklenen yeni dilde
sessizce boşa düşerdi. Bölüm SIRASININ tüm locale'lerde birebir aynı olduğu
tek tek doğrulandı (pdks her dilde 9 bölüm/[0], ise-alim her dilde 5
bölüm/[4]). `getProductContent()`'in **İKİ** dönüş noktasına da eklendi
(az yolu + ana yol) — birini atlamak #64'te yakalanan sessiz-düşme hatası
olurdu. **Yalnızca şemayı etkiler, GÖRÜNÜR render değişmez** (bölümler
sayfada aynen duruyor).
**(b) Kalıcı kontrol — CLAUDE.md notu DEĞİL, script.** Not kaçırılabilir
(projenin kendi #50/#52 dersleri), script her doğrulama turunda koşuyor:
`check-json-ld.mjs` artık `featureList` girdilerini sezgisel bir ağdan
geçirip **UYARI** veriyor (hata DEĞİL — gate'i kırmaz, ve sezgisel olduğu
için yanlış pozitif verebilir). Bu aynı zamanda indeks kaymasının güvenlik
ağı: bir bölüm eklenir/çıkarılırsa indeks kayar ama uyarı görünür.
**⚠️ İKİ YÖNLÜ "i" TUZAĞI — ikisi de bu turda ölçülerek yakalandı, KALICI
DERS:** (1) varsayılan `toLowerCase()`/`/i` bayrağı Türkçe büyük **"İ"**
(U+0130) ile `i`'yi eşleştirmez → ilk geniş ağ `"İndi Başlayın"`ı kaçırdı
ve bulguyu 10 yerine **2** girdi sandım; (2) düzeltmek için
`toLocaleLowerCase('tr')` kullanınca bu kez ASCII büyük **"I"** NOKTASIZ
**"ı"**ya (U+0131) döndü → `"Inizia Ora"` ve `"Why Idenfit …"` kaçtı,
gerçek veriyle test edince 10 girdinin yalnızca **8**'i yakalandı. Çözüm:
karşılaştırmadan önce HER İKİ Türkçe "i" varyantını düz ASCII `i`'ye katla,
sonra locale'den bağımsız `toLowerCase()` (kalıp listesi de aynı katlamadan
geçiyor). **Doğrulama sentetik değil GERÇEK veriyle:** PR 6 ÖNCESİ build'e
karşı 10/10 uyarı, PR 6 SONRASI 0.
**(c) 5 uzun `name` kısaltıldı** — `az/donanim`, `en/hardware`,
`it/hardware`, `nl/hardware`, `az/demirbas-yonetimi-modulu`'na
`breadcrumbLabel={ctaKeyword}` geçirildi. Yeni metin UYDURULMADI: o
sayfalar zaten kısa gerçek adı `ctaKeyword` sabitinde taşıyordu, aynı
sabit yeniden kullanıldı.
**⚠️ `breadcrumbLabel` ÜÇ şeyi birden değiştiriyor** (bu turda ölçülerek
netleşti, ileride şaşırtmaması için): görünür breadcrumb + `BreadcrumbList`
JSON-LD'sinin son kırıntısının `name`'i + `SoftwareApplication.name`. Yani
bu PR'ın diff'i "yalnızca JSON-LD" DEĞİL — 5 sayfada görünür breadcrumb da
kısaldı (kullanıcı onaylı). `Organization`/`WebPage` blokları dokunulmadı.
**Doğrulama — bu tur blok EKLEMİYOR, mevcut bloğu DEĞİŞTİRİYOR**, bu yüzden
PR 5'in "blok kazandı + boyut muhasebesi" dörtlüsü BURAYA UYGULANAMAZ;
ölçüt bu turun şekline göre yazıldı: (1) 15 dosya değişti = 10 featureList
+ 5 breadcrumbLabel (örtüşme yok); (2) blok SAYISI hiçbir sayfada
değişmedi; (3) 10 sayfada SADECE `featureList` kısaldı, her birinde TAM 1
girdi ve çıkan girdi beklenen metin, bloğun diğer TÜM alanları birebir;
(4) 5 sayfada yalnızca `name` + `BreadcrumbList`'in SON kırıntısının `name`'i
değişti (alan alan doğrulandı — başka hiçbir alan/kırıntı değil);
(5) `SoftwareApplication` dışındaki bloklardan yalnızca `BreadcrumbList`
değişti, o da yalnızca bu 5 sayfada ve yalnızca beklenen alanda.
`astro check` 0 hata/0 uyarı/27 hint, `astro build` temiz (3176 HTML),
9 regresyon script'i baseline'a karşı BİREBİR aynı (heading 5/#36,
meta-description 1 + title-length 5/#70 — `breadcrumbLabel` `<title>`'ı
ETKİLEMİYOR, `title` override'ı zaten ayrı), `check-json-ld` 0 geçersiz/
0 uyarı.
**Not:** TR `donanim` sayfası kapsam DIŞINDA bırakıldı — `name`'i 47
karakter, 60 sınırının altında. Ama bu, TR'nin breadcrumb'ının diğer 4
dilden farklı bir üslupta (uzun tanıtım cümlesi) kalması anlamına geliyor;
tutarlılık istenirse ona da `breadcrumbLabel` geçirilebilir (sayfa zaten
`ctaKeyword = 'Donanım Entegrasyonu'` taşıyor).

**🟢 2026-10-03 — JSON-LD şema turu PR 5: ürün/modül sayfalarına `SoftwareApplication` eklendi (111 sayfa) — Açık nokta #29'un asıl boşluğu kapandı.**
Bu sayfalar ÖNCEDEN yalnızca jenerik `WebPage` (+ site geneli
`Organization`/`BreadcrumbList`, varsa `FAQPage`) taşıyordu; şema
seviyesinde bir "İK yazılım modülü" oldukları hiç söylenmiyordu. Tek
component değişikliği (`ProductPage.astro`) tüm aileyi kapsıyor.
**Alanların hepsi sayfanın KENDİ içeriğinden türetiliyor, yeni metin
YAZILMADI (KARAR 1):** `name` = breadcrumb'ın kullandığı AYNI kaynak
(`breadcrumbLabel ?? pageTitle`, ikinci bir isim kaynağı kurulmadı),
`description` = meta description ile AYNI tek kaynak, `url` =
`BaseLayout.astro:214`'teki aynı ifade, `inLanguage` = sayfa locale'i,
`applicationCategory` = `'BusinessApplication'` (schema.org enumerasyonu,
uydurma içerik değil), `featureList` = sayfanın kendi bölüm başlıkları
(`content.sections`, yani override'lar UYGULANDIKTAN sonraki gerçek render
içeriği; etiketler/`&nbsp;` temizlenip boşluk daraltılıyor, boş başlık hiç
eklenmiyor), `publisher` = `organizationId()` ile `@id` REFERANSI (PR 3'te
kurulan paylaşılan tek kaynak, `site` yoksa alan hiç basılmıyor).
**ÜÇ BİLİNÇLİ EKSİK (kullanıcı kararı, 2026-10-03):**
- **`offers` HİÇ EKLENMEDİ.** Bir modül sayfası satın alma birimi DEĞİL;
  fiyat Fiyatlar sayfasının paketlerine ait. Mikro gerçekten ücretsiz
  (5 locale'de doğrulandı: ÜCRETSİZ/FREE/GRATIS/Gratis/PULSUZ) ama KOBİ ve
  Pro 2026-09-22'den beri İKİSİ DE "Teklif Al" (eski Açık nokta #74), yani
  herkese açık fiyatı yok. 111 modül sayfasına `price: "0"` basmak,
  22 modülün 19'u için **olgusal olarak yanlış** bir fiyat iddiası olurdu.
  Mikro=0 TRY / KOBİ-Pro offers-yok kararı **Fiyatlar sayfası turuna**
  bırakıldı (orada şu an HİÇ JSON-LD yok — ayrı bir fırsat).
- **`softwareVersion` ASLA eklenmeyecek** — SaaS sürekli dağıtılıyor,
  sabit bir sürüm numarası yok.
- **`aggregateRating`/`review` yok** — gerçek, doğrulanabilir bir
  derecelendirme verimiz hiç yok (uydurulsa Google'ın yapılandırılmış veri
  politikalarını da ihlal ederdi).
**⚠️ DÜRÜST BEKLENTİ:** Google'ın "Software App" rich result'ı `name`
YANINDA `offers` VEYA `aggregateRating`/`review` ZORUNLU kılıyor — yukarıdaki
üç eksik yüzünden bu blok arama sonucunda uygulama kartı ÜRETMEYECEK. Kazanç
daha dar ama gerçek: sayfanın bir yazılım uygulaması olduğu ve hangi kuruluşa
ait olduğu makine-okunur, `featureList` LLM tabanlı araçlar için okunabilir.
(`FAQPage` bloğundaki AYNI dürüstlük notu deseni.)
**⚠️ BU TURDA YAKALANAN GERÇEK KAPSAM HATASI — `ProductPage.astro`'yu
yalnızca ürün/modül sayfaları KULLANMIYOR.** "Hedef Global Marka" (5 dil) ve
"Neden idenfit" (5 dil) aileleri aynı DÜZENİ paylaştıkları için bu
component'i kullanıyor, ama yazılım uygulaması değil — şirketin 2027
hedefini/değer önerisini anlatan kurumsal sayfalar. İlk build'de bu 10 sayfa
da blok aldı; **ipucu `featureList`'in 3 sayfada BOŞ çıkmasıydı**
(`hedef-global-marka`/`global-brand`/`marchio-globale` — hiç bölümleri yok).
Düzeltme: yeni `softwareApplication?: boolean` prop'u (varsayılan `true`),
o 10 sayfaya `={false}`. Kapsam 121 → **111**. **`Donanım` ailesi bilinçli
olarak DIŞARIDA BIRAKILMADI** — o sayfa PDKS yazılımının donanım entegrasyon
YETENEĞİNİ anlatıyor ve `featureList`'i 7 gerçek ürün yeteneği taşıyor; bu
bir yargı kararı, tek satırla geri alınabilir.
**`check-json-ld.mjs`'e `SoftwareApplication` kuralı eklendi** (`name`
zorunlu; `applicationCategory`/`description`/`url` önerilen). Bu olmadan
script bilinmeyen tipe `required=[]` verip bloğu **hiç doğrulamadan**
"0 geçersiz" raporluyordu — boş bir güvence. `offers` BİLİNÇLİ olarak
"önerilen" listesine YAZILMADI: doğru ve kasıtlı bir kararı her build'de
111 sayfalık uyarı gürültüsüne çevirirdi. Kuralın gerçekten çalıştığı
negatif testle kanıtlandı (`name`'siz blok → 1 geçersiz, 
`applicationCategory`'siz → 1 uyarı).
**Doğrulama — blok EKLEYEN tur olduğu için indeks bazlı hash ölçütü
KULLANILMADI** (PR 4'ün dersi: araya blok girince `LD0`/`LD1`/… indeksleri
kayar ve ham baytlar hiç değişmese bile hash değişir — 146 yanlış pozitif
üretmişti). Dörtlü ölçüm, baseline proje ağacının DIŞINA alındı
(kod değişikliğinden ÖNCE, çalışma ağacı temizken):
(1) tam dosya sha256 → **111 dosya değişti**; (2) küme eşitliği → değişen
küme **==** blok kazanan küme; (3) her dosya TAM +1 blok, tipi
`SoftwareApplication`; (4) boyut farkı her dosyada eklenen bloğun
`<script>` sarmalayıcısıyla tam baytına eşit. Ayrıca `SoftwareApplication`
DIŞINDAKİ blokların ham metni birebir aynı: `Organization` 949,
`BreadcrumbList` 939, `BlogPosting` 640, `WebPage` 309, `FAQPage` 116 —
hiçbiri değişmedi. `astro check` 0 hata/0 uyarı/27 hint, `astro build`
temiz (3176 HTML, baseline ile aynı sayı), 10 regresyon script'i
baseline'a karşı BİREBİR aynı (heading 5/#36, meta-description 1 +
title-length 5/#70 — üçü de baseline'da da aynı sayıda), `check-csp-sync`
#78'in Windows CRLF yanlış alarmı (diff `_headers`/`csp.ts`'e dokunmuyor).
Render doğrulaması: 111/111 blokta `publisher @id` + `inLanguage` +
`applicationCategory`, **`offers` 0, `softwareVersion` 0**, `featureList`
boş olan 0 sayfa (min 1, max 9, ortalama 3,3).
**Şablona HTML yorumu EKLENMEDİ** — Astro `.astro` şablonundaki `<!-- -->`
yorumlarını çıktıya basıyor (PR 2'nin dersi), gerekçeler frontmatter'ın
`//` yorumlarında ve burada.
**İki küçük açık uç, bilinçli olarak DÜZELTİLMEDİ (karar bekliyor):**
(a) `featureList`'te özellik OLMAYAN 2 girdi — `"Neden idenfit"`
(`pdks-modulu`) ve `"Şimdi Başlayın"` (`ise-alim-modulu`'nün kapanış CTA
bölümü); ~370 girdinin 2'si, saf türetmeyi bozmamak için filtrelenmedi.
(b) 60 karakteri aşan 5 `name` (`donanim` ailesi + `az/demirbas-yonetimi-modulu`)
— sayfanın kendi uzun tanıtım cümlesi; o sayfalar `title` override'ı
kullanıyor ama `breadcrumbLabel` geçirmiyor, geçirilirse `name` de kısalır.

**🟢 2026-10-02 — JSON-LD şema turu PR 4: `WebPage` koşulsuz basılıyor, `dateModified` opsiyonel ALAN oldu — 146 sayfa şema kimliği kazandı.**
`dateModified` prop'u ESKİDEN bloğun TAMAMININ ön koşuluydu: gerçek bir WP
`modified` tarihi olmayan sayfa türleri (ana sayfa ×5 locale, hub'lar, SSS,
404'ler, az/it sayfalarının büyük kısmı) HİÇBİR `WebPage` şeması almıyordu.
Sayım: 949 BaseLayout sayfası − 640 blog (`ogType='article'`) − 163 zaten
`WebPage` taşıyan = **146**.
- Blok hâlâ YALNIZCA `ogType !== 'article'` iken basılıyor (blog kendi
  `BlogPosting`'ini üretiyor, çift blok olmasın diye).
- **146'nın 5'i `noindex`** (`404.html` + 4 locale `not-found`).
  `Organization` bloğu bu sayfalarda ZATEN basılıyordu, `WebPage` de aynı
  muameleyi görüyor. İstenirse koşula `!noindex` eklemek TEK SATIR —
  `canonical`/`hreflang` için zaten uygulanan desen.
**Doğrulama — "mevcut 163 sayfa değişmeyecek" şartı:** `astro check` 0
hata/0 uyarı/27 hint, `astro build` temiz, 11 regresyon script'i PR 2/PR 3
ile BİREBİR aynı, `_headers` değişmedi, `check-json-ld.mjs` 0 geçersiz
blok. Byte diff (baseline = PR 3'ün çıktısı, proje ağacının dışında):
**3176 HTML'in yalnızca 146'sının tam dosya sha256'sı değişti ve bu küme
blok kazanan 146 dosyayla BİREBİR AYNI**; önceden `WebPage` taşıyan
**163 sayfanın 0'ı değişti**; her kazanan dosya TAM +1 blok aldı, türü
`WebPage`, konumu her seferinde indeks 1 (Organization'dan hemen sonra);
146 dosyanın tamamında boyut farkı eklenen bloğun kendisi + `<script>`
sarmalayıcısıyla (≤80 bayt) tam olarak açıklanıyor.
**⚠️ ÖLÇÜM ARACI DERSİ (bu turda yakalandı):** önceki turların
`restSha` ölçütü blokları `LD0`/`LD1`/… diye NUMARALANDIRIYOR — araya
yeni bir blok girince sonraki indeksler kayıyor ve gerçek baytlar hiç
değişmese bile hash değişiyor. PR 4'te bu 146 YANLIŞ POZİTİF üretti.
Blok EKLENEN turlarda doğru ölçüt indeks bazlı hash DEĞİL, yukarıdaki
"tam dosya sha + küme eşitliği + blok başına +1 + boyut muhasebesi"
dörtlüsü. **İkinci ders:** baseline build'i alınırken dalın commit
EDİLMİŞ olduğu doğrulanmalı — `git checkout` commit edilmemiş
değişiklikleri karşı dala TAŞIYOR; bu turda ilk baseline denemesi tam
olarak bu yüzden PR 4 kodunu build etti ve "0 fark" diye yanıltıcı bir
sonuç verdi (sayılar kontrol edilince yakalandı).

**🟢 2026-10-02 — JSON-LD şema turu PR 3: `publisher`/`author` artık kuruluşu YENİDEN TANIMLAMIYOR, `@id` ile REFERANS veriyor.**
PR 2'nin eklediği `@id`'nin asıl getirisi bu adımda alınıyor: aynı sayfada
kuruluş İKİ-ÜÇ kez tanımlanıyordu (Organization bloğu + `BlogPosting.publisher`
+ `BlogPosting.author`'ın Organization dalı), tüketici bunların aynı varlık
olduğunu bilemiyordu.
- **Paylaşılan tek kaynak:** `src/data/jsonLd.ts`'e `organizationId(site)`
  eklendi; `BaseLayout.astro` ve `blog/[slug].astro` AYNI fonksiyonu
  çağırıyor. İki dosya dizeyi ayrı ayrı kurarsa bir gün sessizce ayrışır
  ve referans boşa düşer — JSON-LD'de kırık bir `@id` HATA VERMEZ, tüketici
  onu tanımsız apayrı bir düğüm sanar.
- **`BlogPosting.publisher`** (640 yazı) → `{'@id': …}`.
- **`BlogPosting.author`'ın Organization dalı** → `{'@id': …}`. **Yan
  fayda:** satır içi hâli `url: 'https://idenfit.com'` (sondaki eğik çizgi
  YOK) yazıyordu, Organization bloğunun kendi `url`'i ise `Astro.site.href`
  (`https://idenfit.com/`) — aynı varlık için iki farklı URL biçimi; bu
  tutarsızlık da kalktı. `Person` dalı (gerçek ad-soyadı olan 25 yazı)
  DOKUNULMADI.
- **`WebPage.publisher`** (163 sayfa) — ESKİDEN HİÇ YOKTU, bu turda
  eklendi (`{'@id': …}`). Yeni veri değil, var olan kuruluşa referans.
- **Güvenli geri düşme:** `organizationId()` `site` yoksa `undefined`
  döner; o durumda `publisher`/`author` eski satır-içi tanıma düşüyor,
  `WebPage.publisher` ise hiç basılmıyor — tanımsız bir düğüme atıf
  yapmaktansa alanı hiç yazmamak doğru. (`site` 2026-09-02'de dolduruldu,
  pratikte bu dal yalnızca yapılandırma kazasında devreye girer.)
**Doğrulama:** `astro check` 0 hata/0 uyarı/27 hint, `astro build` temiz.
Byte diff (baseline = PR 2'nin çıktısı, proje ağacının dışında):
**JSON-LD dışında SIFIR bayt değişti**; 803 sayfa değişti = `BlogPosting`
640 + `WebPage` 163; `Organization` (949), `BreadcrumbList` (939),
`FAQPage` (116) birebir aynı; blok sayısı değişmedi; `_headers`
değişmedi. `check-json-ld.mjs` **0 geçersiz blok** — `publisher`
"önerilen alan" kontrolünü referans biçiminde de geçiyor. 11 regresyon
script'i PR 2 ile BİREBİR aynı sonucu verdi.
**⚠️ MERGE SIRASI: PR 2 → PR 3.** PR 3 dalı `feat/jsonld-organization`
ÜZERİNE kuruldu (master'dan değil): referans verdiği `@id` PR 2'de
tanımlanıyor, master'dan dallanmış bir PR 3 ya kırık bir referans ya da
PR 2'nin kopyası olurdu.

**🟢 2026-10-02 — JSON-LD şema turu PR 2: `Organization` bloğuna `@id` + 5 eksik alan eklendi (site geneli, 3176 sayfa).**
Blok 2026-08-22'de kurulmuştu ama sabit bir kimliği yoktu ve Google'ın
`Organization` dokümantasyonunun beklediği birkaç alanı taşımıyordu.
Eklenenler, hepsi SİTEDE ZATEN VAR OLAN gerçek veriden (KARAR 1 — yeni
metin yazılmadı):
- **`@id`** = `https://idenfit.com/#organization` (`IDENFIT_ORG_ID`,
  `url` ile AYNI `Astro.site` koşuluna bağlı). 3176 sayfadaki blok artık
  tüketiciler için TEK bir varlık; ileride `BlogPosting.publisher` /
  `WebPage.publisher`'ın kuruluşu yeniden tanımlamak yerine
  `{'@id': …}` ile referans vermesini mümkün kılıyor — **o bağlama işi
  bu PR'ın KAPSAMINDA DEĞİL, ayrı bir tur.**
- **`description`** = `t.hero.description` — ana sayfanın ZATEN canlı olan
  `<meta name="description">` metni, sayfanın kendi dilinde (5 dilin
  hepsinde gerçek çeviri). İkinci bir "kurumsal açıklama" kaynağı
  uydurulmadı; o iki metnin zamanla ayrışmasını engelliyor.
- **`telephone` / `email`** üst seviyede — `contactPoint` içindekiyle
  AYNI `FOOTER_CONTACT` kaynağından, ikinci bir yerde tutulmuyor.
- **`address.addressLocality`** = `İstanbul` — `FOOTER_CONTACT`'a eklenen
  yeni alan (footer'da GÖRÜNEN tek alan hâlâ `address`, render
  değişmedi). **`streetAddress` KASITLI olarak bölünmedi:** footer
  "…, Teknopark, İstanbul" derken `/iletisim/` aynı ofis için "Pendik"
  diyor — ilçe adında kaynak kendi içinde tutarsız, bir ayrıştırma
  uydurulmadı.
- **`areaServed`** = `['TR','NL','IT','AZ']` — İKİ farklı kanıt türünden:
  (1) **fiziksel ofis**, `/iletisim/` sayfasında doğrulanabilir (TR:
  Ümraniye + Teknopark/Pendik; NL: Den Haag "Lahey Global Satış Ofisi");
  (2) **gerçek satış faaliyeti, ofis yok** — IT ve AZ. **⚠️ (2) kod
  tabanından TÜRETİLEMEZ** — kullanıcının 2026-10-02'de verdiği ticari
  bilgiye dayanıyor ("o ülkelerde gerçek müşterilerimiz var, ofis yok
  ama satış faaliyeti var"). Sitedeki dolaylı izler (tam yerelleştirilmiş
  IT/AZ sayfaları + € fiyat) bununla TUTARLI ama tek başlarına kanıt
  değil. Değiştirilmeden önce iş tarafına sorulmalı.
  **Dışarıda bırakılanlar (kullanıcı onaylı):** "MENA" (kaynakta yalnızca
  bir ofis ADI, schema.org karşılığı olmayan serbest metin) ve
  "Worldwide"/3 kıta (`hedef-global-marka` bunu açıkça **2027 HEDEFİ**
  olarak anlatıyor, bugünkü gerçek değil). Tam gerekçeler
  `BaseLayout.astro`'daki `IDENFIT_AREA_SERVED` yorumunda.

**Doğrulama:** `astro check` 0 hata / 0 uyarı / 27 hint (taban çizgisiyle
birebir aynı), `astro build` temiz. **Byte seviyesinde before/after HTML
diff** — baseline, değiştirilmemiş `idenfit/master`'dan (`92973b3`) alınıp
PROJE AĞACININ DIŞINA yazıldı; 3176 HTML'in her biri için tam dosya
sha256'sı, TÜM `ld+json` blokları yer tutucuyla değiştirildikten sonraki
sha256 ve blokların ham metni kaydedildi. Sonuç: 3176/3176 dosyada
**JSON-LD ve tek satırlık HTML yorumu dışında SIFIR bayt değişti**; 949
sayfa değişti, hepsinde değişen tek blok `Organization`;
`BreadcrumbList` (939), `BlogPosting` (640), `WebPage` (163), `FAQPage`
(116) bloklarının TAMAMI birebir aynı kaldı; blok SAYISI hiçbir sayfada
değişmedi; `Organization`'ın 5 benzersiz varyantı var (locale başına bir
`description`: tr 752, en 56, it 52, az 47, nl 42 sayfa). `_headers`
değişmedi (CSP üreticisi `application/ld+json`'u zaten atlıyor).
Serileştirme `safeJsonLd()` üzerinden — ham `JSON.stringify` YOK;
çıktıda çıplak `<`/`>`/`&` olmadığı ve yine de geçerli JSON olduğu
ayrıca doğrulandı.

**⚠️ KALICI DERS (bu turda ölçülerek öğrenildi) — Astro, `.astro`
ŞABLONUNDAKİ `<!-- -->` yorumlarını ÇIKTIYA BASIYOR** (frontmatter'daki
`//` yorumlarının aksine). İlk denemede Organization bloğunun üstüne
yazılan 3 satırlık açıklayıcı yorum, 949 sayfanın HER BİRİNE **+119 bayt**
ekledi (~113 KB) ve diff gate'inde "JSON-LD dışında değişiklik" olarak
yakalandı. Yorum tek satıra indirildi (`sameAs notu` → `notu`, −10 bayt);
detaylı gerekçeler frontmatter'daki `//` yorumlarına ve bu dosyaya
taşındı. **Kural: şablon içine uzun açıklama yazılmaz** — projenin mevcut
"tek satır + detay CLAUDE.md'de" konvansiyonunun sebebi tam olarak budur.

**Daha eski günlük (2026-08-19 → 2026-09-02) arşive taşındı** —
widget i18n turları, az locale genişletmesi, Müşteri Hikayeleri
carousel'i, BreadcrumbList kurulumu, Organization JSON-LD + `sameAs`,
Speakable, mobil düzeltmeler (Fiyatlar/Online Sunum Talebi), Online
Sunum Talebi'nin yeniden tasarımı — TAM anlatım:
`docs/claude-md-archive-2026-10-03.md`. Kısa kronolojik özet
için bkz. §Tamamlanan işler. Bu turlardan çıkan KALICI mimari kurallar
(`breadcrumb`/`heroBackground` prop'ları, `scroll-reveal.js`'in elle
yüklenmesi, widget'ın container-query mimarisi) §Mimari'ye taşındı.

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
   fiyat/online-sunum-talep-et/destek-talebi/teşekkürler) artık sade bir
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
2. **İSKELET TAMAMLANDI (2026-09-02) — kod hazır, yalnızca SendGrid
   anahtarı bekleniyor.** Eski durum (backend yok, 6 form etkileniyor,
   KVKK hukuki risk notu) artık CLAUDE.md'deki "🔶 AÇIK NOKTA (2026-08-30)"
   bloğunda GÜNCEL haliyle kayıtlı, bkz. orası (bu blok kapatılmadı,
   yalnızca güncellendi — anahtar gelene kadar hukuki risk notu hâlâ
   TEKNİK olarak geçerli, formlar hâlâ hiçbir yere gerçek e-posta
   göndermiyor, yalnızca artık DOĞRU bir hata mesajı gösteriyorlar).
6. Mesafeli Satış Sözleşmesi'nin kobi/mikro TR varyantları kurulmadı.
   **GÜNCELLEME (2026-09-04):** cutover-öncesi sitemap denetiminde EN
   karşılıkları da (`/en/customer-sales-agreement-micro/`,
   `/en/customer-sales-agreement-sme/`) canlıda bulundu — kapsam yalnızca
   TR değil, aynı açık nokta EN'i de kapsıyor.
8. Puantaj modülünün gerçek YouTube `video_url`'i var ama bilinçli
   olarak embed edilmedi.
9. İzin Yönetimi modülünün testimonial bloğu veride var ama PDKS
   şablonuna sadık kalmak için render edilmiyor.
10. **İÇERİK TAMAMLANDI (2026-08-29), BAĞLANTI Faz 2'yi bekliyor —
    `tesekkurler-destek` (id 16712) migrate edildi.** Destek Talebi
    formunun (`/destek-talebi/`) teşekkür sayfası — KARIŞTIRILMASIN,
    `/tesekkurler/`'deki (Online Sunum Talebi'nin teşekkür sayfası,
    `thankYouContent.ts`) BAMBAŞKA bir sayfa. Yeni dosyalar:
    `src/data/supportThankYouContent.ts`, `src/components/SupportThankYouPage.astro`,
    `src/pages/tesekkurler-destek.astro` (TR), `src/pages/en/thank-you.astro`
    (EN). TR/EN gerçek WP sayfaları (id 16712/16742) — IT/NL kaynakta hiç
    yok, IT/AZ genel `it:'tr'`/`az:'tr'` fallback'iyle otomatik bare TR'ye
    düşüyor, NL'de per-locale slug FARKLI olduğu için `astro.config.mjs`'e
    elle `'/nl/tesekkurler-destek': '/en/thank-you'` redirect'i eklendi
    (KVKK/`tesekkurler`/`destek-talebi` sınıfının aynısı). **URL doğrulaması
    yapıldı — 1 gerçek bug bulunup düzeltildi:** `astro.config.mjs`'te
    ÖNCEDEN var olan `'/en/thank-you': '/en/thanks'` girdisi (2026-08-05
    URL denetiminden kalma) YANLIŞTI — canlı sitede `idenfit.com/en/thank-you/`
    doğrudan ziyaret edilip doğrulandı: bu, Online Sunum Talebi'nin
    "thanks" sayfasının bir takma adı DEĞİL, tamamen ayrı ve GERÇEK bir
    sayfa (id 16742, içerik birebir eşleşti). Yanlış redirect KALDIRILDI,
    yeni EN sayfamız artık kendi gerçek URL'inde. **`<title>` uzunluk
    düzeltmesi:** EN başlığı (`buildIdenfitTitle()`'ın otomatik niteleyicisi
    60 karakteri aşıyordu) `SupportThankYouPage.astro`'ya eklenen `title`
    override prop'uyla (`ProductPage.astro`'daki AYNI desen) kısaltıldı, H1
    DEĞİŞMEDİ. `astro check` 0 hata, `astro build` 3097 sayfa, 8 regresyon
    script'i (json-ld/link-accessibility/heading-hierarchy/image-alt-text/
    meta-description/title-length/html-lang/hreflang) bilinen taban
    çizgisiyle birebir aynı — sıfır yeni regresyon. Chrome'da TR+EN görsel
    doğrulandı (görsel/breadcrumb/linkler/Son Güncelleme tarihi hepsi
    canlı kaynakla eşleşiyor). **⚠️ BİLEREK YAPILMADI —
    `SupportRequestForm.tsx`'in bu sayfaya yönlendirilmesi:** form hâlâ
    backend'siz (`console.log` stub, Faz 2/Cloudflare Pages Functions
    bekliyor) — "başarılı" bir onay sayfasına yönlendirmek, form aslında
    hiçbir yere gitmediği için kullanıcıya YANLIŞ bilgi verirdi. Form
    gerçek submit işlevine kavuştuğunda (Faz 2) bağlantı eklenecek — bkz.
    `ThankYouPage.astro`'daki (Online Sunum Talebi'nin teşekkür sayfası)
    AYNI bekleyen-durum, madde 2/12 ile aynı kategori.
13. **BULGU — site geneli sabit WhatsApp/Ara widget'ı yok, kaynakta
    var.** Kapsam dışı, istenirse eklenebilir.
15. **YARIM KALAN — İK Olgunluk Testi'nde 2 açık uç:** Section 2 rozet
    boyutu (yalnızca ilk kart pilot), Section 3 checklist ikon rengi
    (kullanıcıdan DevTools hex kodu bekleniyor).
20. **SÜREÇ — `npm audit` periyodik hale getirildi** (`npm run audit`,
    her önemli değişiklik/deploy öncesi). **GÜNCELLEME (2026-09-04):**
    `@cloudflare/puppeteer` kurulumundan beri (ADIM 4, İK Olgunluk Testi PDF
    üretimi) 3 yüksek önem seviyeli açık var — hepsi transitif bağımlılık
    `extract-zip`'te (`@puppeteer/browsers` üzerinden), düzeltmesi
    (`npm audit fix --force`) paketi 1.4.0'dan eski/kararsız 0.0.11'e
    düşürdüğü için bilinçli olarak UYGULANMADI — açığın kendisi yalnızca
    yerel bir tarayıcı ikilisini indirip zip'ten çıkarırken tetikleniyor,
    production kod yolumuz (`puppeteer.launch(env.BROWSER)`, Cloudflare'ın
    uzak Browser Rendering binding'ine bağlanıyor) bu kod yolunu hiç
    çağırmıyor. **Aynı gün, ayrı bir bulgu:** `npm audit` (hem doğrudan hem
    `npm run audit` sarmalayıcısı üzerinden) bu oturumda ISRARLA ağ
    kısıtına takıldı — `registry.npmjs.org`'un audit endpoint'ine
    (`/-/npm/v1/security/audits/quick`) giden POST isteği 3 ayrı denemede
    (30sn/90sn/120sn+) hiç yanıt vermedi, sıradan `GET` istekleri ise
    sorunsuz çalıştı — bu ortama özgü GEÇİCİ bir ağ kısıtı (kod/proje
    tarafında düzeltilecek bir şey yok). Yukarıdaki bilinen 3 açık (ve
    başka yeni bir açık OLMADIĞI) bir önceki BAŞARILI `npm audit`
    çalıştırmasından teyitli — geçerliliğini koruyor, yalnızca bu turda
    yeniden DOĞRULANAMADI.
21. **Blog CMS — kalan 2 açık uç (ilk madde 2026-08-29'da KAPANDI):**
    ~~Kademeli üretim (kalan 618 yazı `scripts/migrate-blog-to-markdown.mjs
    <slug...>` ile)~~ — 622/622 tamamlandı, bkz. yukarıdaki "KEYSTATIC
    GEÇİŞİ" bölümünün kapanış notu. Kalanlar: `verify-blog-posts.mjs`
    göç etmiş `.md` yazıları görmüyor, güncel değil; `/admin/`
    trailing-slash davranışı Cloudflare Pages'te henüz doğrulanmadı
    (Decap zaten Keystatic'e geçtiği için bu madde muhtemelen artık
    ilgisiz, ayrı bir turda değerlendirilmeli).
22. **YENİ — Kategori arşiv sayfaları (`/category/<slug>/`, 12 taksonomi
    sayfası) migrate edilmedi**, ayrı bir yapısal karar bekliyor.
25. **YENİDEN ARAŞTIRILDI (2026-08-31), AYNI SONUÇ — MegaMenu'nün 4
    panelinin DOM'da her zaman var olması (gerçek ölçüm: 364 element,
    sayfanın %21.8'i) performans maliyeti yaratıyor** ama kaldırılırsa
    geçmiş bir focus/kapanma bug'ı geri gelebilir. Bilinçli olarak
    ertelendi (2026-08-10) — `MegaMenu.tsx` satır 241-253'teki yorum kök
    neden bug'ının tam anlatımını taşıyor.
    **2026-08-31 turu — önce yanlışlıkla uygulanıp geri alınan bir
    deneme, sonra 3 alternatifin sistematik testi:**
    1. `MobileMenu.tsx`'teki `hasOpened` deseni (Açık nokta #24) MegaMenu'ye
       BİREBİR uygulandı, `astro check`/`astro build`/8 regresyon script'i
       hepsi temiz göründü — ama bu YANILTICIYDI. Build çıktısı elle
       incelenince (`dist/client/index.html`'de `<astro-island>`'ın light
       DOM'u) panel içeriğinin `client:load` SSR'ında da `hasOpened=false`
       olduğu, yani TÜM ürün/sektör/hub linklerinin statik HTML'den TAMAMEN
       kaybolup yalnızca hydration `props` JSON'unda (gerçek `<a href>`
       DEĞİL) kaldığı görüldü — regresyon script'leri bunu YAKALAYAMADI
       çünkü onlar da aynı (artık boş) statik HTML'i tarıyor, "kontrol
       edecek link kalmadığı için" 0 sorun raporladılar. **Değişiklik
       tamamen geri alındı** (`MegaMenu.tsx`/`MobileMenu.tsx`, `git
       checkout` ile, çalışma ağacı temiz doğrulandı) — bu, `MobileMenu`'nün
       AKSİNE MegaMenu'nün bu linklerin BİRİNCİL/TEK statik kaynağı olması
       yüzünden (MobileMenu'nünki zaten masaüstü MegaMenu'de var olan
       linklerin bir MOBİL KOPYASI, o yüzden güvenli).
    2. **Kullanıcı talimatıyla 3 alternatif sistematik test edildi, kod
       YAZILMADAN önce kanıt istendi:**
       - **(1) CSS-only aç/kapa, linkler her zaman DOM'da:** bu zaten
         MEVCUT/orijinal kodun davranışı (panel hiçbir zaman JS ile
         mount/unmount edilmiyor, yalnızca `opacity`/`pointer-events`
         değişiyor) — yeni bir kazanım SAĞLAMIYOR, yalnızca güvenli
         taban çizgisini tanımlıyor.
       - **(2) `client:load`→`client:visible`/`client:idle` (hydration
         zamanlamasını ertele):** ampirik test edildi — `client:visible`
         ile build alınıp Playwright'la yeniden ölçüldü, **sonuç
         `client:load` ile BİREBİR AYNI** (1666 toplam element, aynı
         29/12/5/14 anchor dağılımı). Kanıt: Astro'nun hydration
         direktifleri yalnızca istemci JS'inin NE ZAMAN çalışacağını
         belirliyor, sunucu tarafında üretilen statik HTML'i
         ETKİLEMİYOR — MegaMenu zaten header'da (katlanmadan üstte)
         olduğu için `client:visible` de anında tetikleniyor. **DOM
         boyutunu HİÇ değiştirmiyor.**
       - **(3) Footer'da yedekli link var mı (güvenlik ağı):** kontrol
         edildi — `footer.ts`'in ÜRÜNLER kolonu yalnızca 8 link (29'dan),
         SEKTÖRLER için 0, KEŞFET'in rapor kartları için 0. Footer
         kapsamlı bir yedek DEĞİL, bu yaklaşım güvenlik ağı olarak
         kullanılamaz.
    3. **Kesin sonuç:** "DOM'da var olma" ile "statik HTML'de crawl
       edilebilir `<a href>` olma" bu içerik için AYNI ölçümün iki adı —
       hydration zamanlaması bunu ayıramıyor (kanıtlandı), yalnızca
       içeriği (link/kolon SAYISINI) fiilen azaltmak DOM'u küçültür ki bu
       teknik değil bir IA/tasarım kararı. **Kod tabanında hiçbir iz
       bırakılmadı** — hem deneme hem 3 test tamamen geri alındı, sıfır
       commit. 2026-08-10'daki erteleme kararı doğrulandı, gizli/kaçırılan
       bir güvenli optimizasyon YOK.
27. **BULGU (bilgi notu, aksiyon GEREKMİYOR) — site ~1492 redirect stub
    sayfası içeriyor** (i18n fallback + elle `redirects`'in ürettiği
    `<meta http-equiv="refresh">` sayfaları + 4 özel 404 sayfası), hepsi
    kasıtlı `noindex` VE hiç `<html lang>` taşımıyor (Astro'nun kendi
    framework-içi redirect şablonu, bizim kodumuzda düzeltilecek bir şey
    yok). SEO araçlarında "çok fazla noindex/lang-eksik sayfa" uyarısı
    tetikleyebilir ama gerçek sorun değil.
29. **BÜYÜK ÖLÇÜDE KAPANDI (2026-10-03) — ürün/modül sayfaları artık
    tip-özel `SoftwareApplication` şeması taşıyor (111 sayfa).**
    Maddenin asıl boşluğu ("ürün sayfaları için ZENGİN/tip-özel bir şema
    hâlâ YOK") bu turda kapandı — tam anlatım, alan seçimi, üç bilinçli
    eksik (`offers`/`softwareVersion`/`aggregateRating`) ve dörtlü byte
    ölçümü için bkz. §Güncel durum, "PR 5". `featureList`'in iki açık ucu
    (özellik olmayan girdiler + uzun `name`'ler) PR 6'da kapandı. Daha eski
    kısmi kapanış (2026-08-19, `BaseLayout`'un sade `WebPage` şeması,
    ~161 sayfa) yerinde duruyor.
    **KALAN 2 AÇIK UÇ:**
    - **Fiyatlar sayfasında HİÇ JSON-LD yok** ve kullanıcının plan
      seviyesi kararı oraya ait — modül sayfalarına fiyat basılmadı çünkü
      modül bir satın alma birimi değil. **Ayrı bir tur.**
      **Karar NET (kullanıcı, 2026-10-03): Mikro `offers:
      {price:"0", priceCurrency:"TRY"}`, KOBİ ve Pro offers ALMAYACAK.**
      Para birimi sorusu YOK: **Mikro TÜM dillerde ücretsiz**, EN/NL/IT'de
      görünen € fiyatlar KOBİ ve Pro'ya ait — o ikisi de "Teklif Al"
      olduğu için zaten offers almıyor. Yani tek `offers` locale'den
      bağımsız yazılabilir. (Önceki turda bunu "netleşmedi" diye
      kaydetmiştim — yanlıştı, kullanıcı düzeltti.)
    - `Product`/`Service` tipleri BİLİNÇLİ olarak seçilmedi:
      idenfit bir SaaS, `SoftwareApplication` doğru/daha özel tip.
      Fiyat/teklif bilgisi gerekirse `Offer`, `SoftwareApplication`'a
      da eklenebilir (tip değiştirmek gerekmez).
30. **TODO — `public/_redirects`'in (404 sayfası) gerçek Cloudflare
    Pages davranışı henüz DOĞRULANMADI.** Faz 1 deploy'unda ilk kontrol
    edilmesi gerekenlerden biri.
36. **YENİ (2026-08-20) — Ana sayfanın 4 dilinde de `H1→H3` başlık
    seviye atlaması var** (`check-heading-hierarchy.mjs` bulgusu, HRTech
    bölümü kaldırılırken tesadüfen fark edildi, o kaldırmayla İLGİSİZ,
    önceden de vardı). Hero H1'inden hemen sonra `ProductPreviewWidget`
    içindeki `SectionMiniHeader` H3 kullanıyor, aralarında H2 yok.
    Düzeltme kapsam dışı bırakıldı (yalnızca fark edildi), ayrı bir
    karar/tur bekliyor.
37. **BÜYÜK ÖLÇÜDE TAMAMLANDI (2026-08-21) — Azerbaycan dili (az), tam
    site kapsamına genişletildi.** Faz 0+1 (altyapı+ana sayfa) sonrası
    kullanıcı "diğer sayfalarda da olsun, TR harici diğer diller nasıl
    davranıyorsa az de öyle davranmalı" dedi — aynı oturumda Faz 2-5'in
    hepsi tamamlandı: **8 tekil sayfa** (Hakkımızda/İletişim/Hedef Global
    Marka/Neden İdenfit/Donanım/Online Sunum Talebi/Fiyatlar/Müşteriler —
    Fiyatlar dahil TAM fiyat tablosu çevirisi, `pricingContent.ts`'e
    `PRICING_AZ_OVERRIDE` eklendi), **12 sektör sayfası** (yeni
    `src/data/sectorTranslationOverrides.ts` — sektörler için İLK KEZ
    kurulan override altyapısı, `SECTOR_AZ_SLUGS` ile elle atanmış
    Azerice route'lar), **22 ürün/modül sayfası** (yeni
    `src/data/productTranslationOverridesAz.ts`, mevcut 19 trSlug'lık
    `PRODUCT_OVERRIDES` iç içe yapısını bozmadan `productContent.ts`'e
    AYRI bir öncelik olarak eklendi — hero+sections+FAQ'ın TAMAMI, bazı
    ürünlerde 20 SSS sorusu dahil), **2 hub sayfası** (yeni
    `src/data/hubTranslationOverridesAz.ts`, 16+7 kart). **Mimari karar:**
    az ürün/sektör/hub sayfaları TR ile BİREBİR AYNI bare slug'ı
    kullanıyor (yeni Azerice slug icat edilmedi) — Azerice/Türkçe dil
    yakınlığından faydalanan bilinçli bir sadeleştirme, sektör
    sayfalarının "Bu Sektöre Özel Modüller" CTA linklerinin doğru ürün
    sayfasına gitmesini garanti ediyor. Tüm çeviriler TR kaynaktan
    (`dist/*/index.html` render çıktısı + ham `reference/wordpress-export/*.json`)
    gerçek/profesyonel olarak üretildi (KARAR 1). **Kapsam dışı bırakılan
    (bilinçli, NL'nin AYNI sayfalarda kaynakta hiç var olmaması emsaline
    dayanıyor):** KVKK, KVK Protokol, Tüketici Hakları, Mesafeli Satış,
    Gizlilik ve Güvenlik Politikası, Güvenlik (guvenlik — 6 hukuki PDF
    linki), Destek Talebi, Teşekkürler, SSS (90 soru) — hepsi az'de TR'ye
    fallback eder (`az: 'tr'` genel fallback kuralı), gerçek az sayfası
    YOK. Blog + Hesaplama Araçları + İK Dijital Olgunluk Testi de aynı
    şekilde kalıcı TR fallback (KARAR 2, diğer 3 dille aynı). **Doğrulama:**
    `astro check` 0 hata (379 dosya), `astro build` 927 sayfa (883'ten
    +44: 8 tekil+12 sektör+22 ürün+2 hub), `check-html-lang-attribute`/
    `check-link-accessibility`/`check-image-alt-text`/`check-json-ld`
    sıfır yeni ihlal, `check-meta-description-length`/`check-title-length`
    ilk turda 3 az-kaynaklı ihlal buldu (2 kısa sektör meta description'ı
    + 1 uzun "Niyə İdenfit?" title — ikincisi IT'nin `perche-idenfit.astro`'sundaki
    AYNI `buildIdenfitTitle()` kısa-başlık deseniyle düzeltildi) →
    düzeltilip sıfırlandı, `check-title-length`'in toplam 409 ihlal sayısı
    (mevcut BİLİNEN temel çizgi, Açık nokta #28) DEĞİŞMEDİ — sıfır yeni
    regresyon. Chrome'da PDKS/Qida sektörü/İnsan Resursları hub/Fiyatlar
    sayfaları görsel doğrulandı, konsol hatasız. **Kalan (kullanıcıya
    bildirildi, ayrı bir karar/tur gerektirir):** yukarıdaki "kapsam dışı"
    9 sayfa ailesi için gerçek az çevirisi istenirse (özellikle SSS'nin 90
    sorusu ve hukuki metinlerin uzunluğu nedeniyle) ayrı, büyük bir tur
    olarak ele alınmalı.
38. **DIŞ BAĞIMLILIK, AKSİYON GEREKMİYOR (2026-08-24) — Organization
    JSON-LD'de Wikipedia/Wikidata `sameAs` girdisi yok.** "Low readiness
    for Google Gemini" bulgusunun bir parçası — YouTube dahil 7 sosyal
    profil zaten `sameAs`'te (`curl` ile doğrulandı, bkz. Güncel durum).
    Wikipedia/Wikidata farklı: idenfit'in bir Wikipedia sayfası YOK,
    Wikipedia'nın kendi notability/editoryal kurallarına tabi olduğu
    için biz kod tarafında tek taraflı bir sayfa oluşturamayız/link
    ekleyemeyiz (varsa uydurma bir URL olurdu). Şirket gerçekten bir
    Wikipedia sayfası edinirse `data/footer.ts`'teki `FOOTER_SOCIAL`
    deseniyle `sameAs`'e eklenebilir — o zamana kadar kapsam dışı.
39. **YENİ (2026-08-26) — `/donanim/` sayfası SEO/GEO denetimi, plan
    onaylandı, KOD DEĞİŞİKLİĞİ HENÜZ YAPILMADI, yarın devam.**
    Kullanıcının yeni bir SEO/GEO denetim belgesinden gelen bulgular,
    tek tek araştırılıp onaylandı ama hiçbiri uygulanmadı:
    1. **Heading düzeltmesi (6 paragraf, yanlışlıkla H2 → düz P
       olmalı)** — metinler kullanıcı tarafından sağlandı ve
       eşleştirme onaylandı, İÇERİK DEĞİŞMEYECEK sadece etiket
       düzelecek. Uygulanmadı.
    2. **Yeni "QR Kod Sistemi" bölümü** — kaynak `pdks-modulu` ürün
       sayfasının 8. section'ı (`Personel Takip Sisteminde Karekod -
       QR Kod Okutma Nasıl Çalışır?`, idenfit mobil PDKS uygulamasının
       karekod/QR okutarak giriş-çıkış + anlık konum kaydı özelliği,
       kartlı geçiş sistemlerinde de kullanılabiliyor). ÖNEMLİ NÜANS:
       bu içerik "QR donanımı" değil idenfit'in KENDİ yazılım
       özelliği — donanım sayfasının diğer bölümleri (biyometrik/
       RFID/turnike/GPRS) "3. parti marka donanımıyla entegrasyon"
       formatındayken bu "ek donanıma gerek yok" diyor. Çerçeveleme
       kararı verildi: başlık **"Ek Donanım Gerektirmeyen QR/Karekod
       Alternatifi"**, dürüst fark vurgusuyla yazılacak, uydurma
       teknik detay eklenmeyecek. Uygulanmadı.
    3. **7 mevcut bölüm başlığının (biyometrik/bluetooth/platform/
       rfid/gprs/turnikeler/markalar) SEO için kısaltılması** — YENİ
       bölüm gerekmiyor, önerilen 7 başlık mevcut 7 section'la birebir
       eşleşiyor, sadece metin kısaltma/yeniden yazım. Not: rfid/gprs/
       turnikeler başlıklarında satır içi `<br>` var, kısaltılan
       metinde korunup korunmayacağı teyit edilmeli. Uygulanmadı.
    4. **FAQ (6 soru), `content.faq` şu an bilinçli olarak boş dizi**
       (`donanim.astro:11`, `ProductPage.astro` FAQ bloğunu yalnızca
       `faq.length > 0` iken render ediyor) — plan: 3 soru genel FAQ
       havuzundan (id 12596/12677/12678, "PDKS cihaz/donanımlara
       entegre olabilir mi", biyometrik cihaz/marka soruları), kalan 3
       soru sayfanın kendi bölüm metinlerinden (RFID/Bluetooth/GPRS
       paragrafları) türetilecek — kaynak FAQ havuzunda RFID/
       Bluetooth/GPRS/turnike/QR'a özel soru YOK. Uygulanmadı.
    5. **KAPANDI (2026-08-26) — CTA/anchor text ("Hemen Başvur" →
       "Donanım Entegrasyonu için Başvur"), local dev server ile
       DOĞRULANDI.** Kod 2026-08-12 CTA/anchor-text turunda zaten
       yapılmıştı (`donanim.astro:25` `ctaKeyword = 'Donanım
       Entegrasyonu'`, `pageTitle.ts:131` TR şablonu `${keyword} için
       Başvur`). `idenfit.com` curl'ü bunu doğrulayamadı çünkü o domain
       hâlâ ESKİ WordPress kaynak sitesi (`elementor-button-text`
       class'ı) — Astro build henüz Cloudflare Pages'e deploy edilmedi.
       `npm run dev` ile local dev server açılıp (`http://localhost:4321`)
       `curl http://localhost:4321/donanim/` ile gerçek render kontrol
       edildi: `<a href="/online-sunum-talep-et/" class="btn-cta ...">
       Donanım Entegrasyonu için Başvur</a>` — birebir doğru. TAMAMEN
       KAPANDI.
    6. **KAPANDI (2026-08-26) — Görsel lazy load, local dev server ile
       DOĞRULANDI.** `ProductSectionBlock.astro:30` TÜM section
       görsellerinde koşulsuz `loading="lazy"`, hero görseli bilinçli
       `loading="eager"` (`ProductPage.astro:147`, LCP için). Aynı curl
       ile teyit edildi: hero'nun `<img>`'i `loading="eager"` (1 adet),
       donanım sayfasındaki diğer tüm görseller `loading="lazy"`.
       Donanım sayfasında hero hariç **7** section var (brief'te "6"
       deniyordu, gerçek sayı 7 — sayım farkı, sonuç aynı: hepsi zaten
       lazy). TAMAMEN KAPANDI.
    **Dev server:** kullanıcı isteğiyle açık bırakıldı
    (`http://localhost:4321`, pid 20612, `npm run dev`).
    **Yarın planı:** 5/6 kapandı, sırada 1/2/3/4 (heading düzeltmesi,
    QR bölümü, H2 rename, FAQ) kod uygulaması var.
40. **YENİ (2026-08-27, Keystatic geçişi ADIM 1) — Locale'e özel 404 sayfası
    İÇERİĞİ (en/nl/it/az) `output:'server'`'a geçişten SONRA çalışmıyor,
    kullanıcı onayıyla ERTELENDİ.** `astro.config.mjs` `output:'static'`
    (adapter yok) → `output:'server'` + `@astrojs/cloudflare` adapter'a
    geçti (Keystatic'in kendi dokümantasyonu: admin panelinin dosya-sistemi
    işlemleri Node.js API'lerine ihtiyaç duyduğu için adapter ZORUNLU;
    Astro 5+'ta eski `output:'hybrid'` KALDIRILDI, modern eşdeğeri
    `output:'server'` + her sayfada ayrı `export const prerender = true`
    — mevcut 201 sayfa dosyasının TAMAMINA bu export script ile eklendi).
    **Bulgu:** 2026-08-11'de kurulan locale-özel 404 mekanizması
    (`public/_redirects`'in `/en/* /en/not-found/ 404` gibi 4 satırı,
    Cloudflare Pages'in ESKİ statik-hosting `_redirects` "404" status
    konvansiyonuna dayanıyordu) yeni Workers+Assets deploy modelinde
    geçersiz status kodu hatası verip sessizce devre dışı kaldı — TÜM
    locale'lerde jenerik TR 404 içeriğine düşülüyordu (`wrangler dev` ile
    yerel testte yakalandı, `astro build`'in kendi check-*.mjs script'leri
    bunu YAKALAMAZ — dinamik/runtime davranış, statik dist/ dosyası
    taraması değil). **2 alternatif denendi, ikisi de ÇALIŞMADI:**
    (a) Cloudflare'in statik-varlık seviyesi "en yakın 404.html" araması
    (`assets.not_found_handling`) — `output:'server'`'da eşleşmeyen
    route'lar statik varlık katmanına hiç uğramıyor, Astro/Cloudflare
    adapter'ının `entry.mjs`'i doğrudan kendi dahili TEK/global
    prerendered-hata-sayfası fetch'ine (`prerenderedErrorPageFetch`, her
    zaman kökteki `404.astro`'yu/TR'yi bulur) düşüyor. (b) her locale'de
    gerçek bir `src/pages/<locale>/[...path].astro` (`prerender=false`)
    catch-all route'u — Astro'nun i18n `fallback` mekanizması
    (`fallback:{en:'tr',...}`) `output:'server'`'da BİLİNMEYEN/rastgele
    yollar için de ARTIK dinamik bir "üst locale'e yönlendir" davranışına
    sahip ve bu, kendi catch-all route'umuzdan DAHA YÜKSEK önceliğe sahip
    — `/en/rastgele/` gibi bir istek `/rastgele/`'ye (bare TR) 302 ile
    düşüp oradan TR'nin kendi 404'üne varıyor, catch-all'a hiç ulaşmıyor.
    **Etki (kullanıcı onayıyla değerlendirildi, düşük öncelik):** HTTP
    status kodu HER ZAMAN doğru 404 (SEO'yu etkileyen asıl sinyal sağlam),
    yalnızca içerik dili şu an TÜM locale'lerde TR'ye düşüyor — **927+
    gerçek sayfa ETKİLENMİYOR**, yalnızca var olmayan URL'lerin 404
    içeriği (düşük trafikli, yalnızca kırık link/typo senaryosu).
    **Uygulama durumu:** eski 4 satır + denenen catch-all dosyaları
    (`src/pages/{en,nl,it,az}/[...path].astro`) GERİ ALINDI, kod
    tabanında iz bırakmıyor. `public/_redirects`'in başına bu bulgunun
    tam teknik dökümü yorum olarak yazıldı (dosyanın gerçek redirect
    kuralları — 23 manuel `astro.config.mjs` girdisi, build sırasında
    adapter tarafından otomatik ekleniyor — etkilenmedi, doğrulandı).
    **Kalıcı çözüm için muhtemel yön (ayrı bir turda):** Astro'nun i18n
    `fallback`'ini bu spesifik/bilinmeyen-yol senaryosu için bypass eden
    özel bir middleware, veya `fallback` haritasından geçici çıkarma.
    **Ayrıca aynı turda doğrulanan, regresyon OLMAYAN bir davranış
    değişikliği:** `dist/` artık `dist/client/`+`dist/server/` alt
    klasörlerine ayrıldı (Cloudflare adapter çıktısı) — 8 `check-*.mjs`
    script'i zaten sahip olduğu `DIST_DIR` env değişkeniyle (script
    dosyalarına DOKUNULMADAN) `dist/client`'a yönlendirildi. Toplam HTML
    sayısı 3114→3091 (23 azaldı) — 23 manuel `redirects` girdisi artık
    statik meta-refresh stub DEĞİL, native Cloudflare `_redirects`
    dosyasında gerçek 301 kuralı (adapter'ın kendi davranışı, SEO açısından
    DAHA İYİ) — 928 gerçek içerik sayfası + 2163 i18n-fallback stub'ı
    BİREBİR korundu, 8 script de ADIM 0 taban çizgisiyle birebir aynı
    sonucu verdi (sıfır yeni regresyon).
41. **YENİ (2026-08-28, Keystatic ADIM 2 test turu) — `origin`
    (Sude-product/site-migration-astro) ve `idenfit` (idenfit/idenfit.com)
    remote'ları artık senkron DEĞİL, düşük öncelik.** Keystatic Cloud'un
    canlı commit testi + revert'i (2 commit: `66fea5e`+`74e3fca`) yalnızca
    `idenfit` remote'una gitti (yerel `master` dalının zaten takip ettiği
    repo) — `origin` bu 2 commit'i almadı. Net içerik farkı YOK (test
    edit zaten revert edildi) ama commit GEÇMİŞİ artık iki remote arasında
    farklı. Kalıcı çözüm: Keystatic Cloud projesinin hangi tek repoyu
    kaynak alacağı netleşince (muhtemelen `idenfit`), `origin`'in bu
    repo'ya senkronize edilip edilmeyeceğine karar verilmeli.

42. **YENİ (2026-08-28) — Blog `date`/`modifiedDate` saat dilimi düzeltmesi
    (`src/content.config.ts`) uygulandı, ama 622 yazının 60'ında (%9.6)
    HALA yanlış değer üretiyor, ayrı bir karar gerektiriyor.** Kullanıcının
    doğruladığı Cloudflare bilgisi ("Pages/Workers build ortamı HER ZAMAN
    UTC") üzerine, naive tarih string'lerinin (`'2024-10-02T09:30:00'`
    gibi, saat dilimsiz) yerel makine (Türkiye, UTC+3) ile Cloudflare
    build ortamı (UTC) arasında SESSİZ 3 saatlik kaymaya yol açtığı
    kesinleşti (bkz. yukarıdaki KALICI GOTCHA maddesi). Çözüm:
    `content.config.ts`'e `normalizeNaiveDateToTurkeyOffset()` +
    `z.preprocess()` eklendi — Z/ofset damgası TAŞIMAYAN her `date`/
    `modifiedDate` string'ine açıkça `+03:00` ekleniyor, bu da
    `new Date()` yorumunu ÇALIŞTIĞI MAKİNEDEN TAMAMEN BAĞIMSIZ hale
    getiriyor (ECMAScript spesifikasyonu gereği). **Çift ortam testiyle
    doğrulandı:** yerel Europe/Istanbul build VE `TZ=UTC` zorlanmış build
    aynı yazı için BİREBİR AYNI `datePublished` ürettü
    (`idenfit-yatirim-duyurusu`: ikisinde de `2024-10-02T06:30:00.000Z`,
    WP'nin gerçek `date_gmt`'iyle birebir eşleşiyor — TAM DOĞRU).
    **AMA:** 622 yazının **60'ında** (WP'nin ham `posts.json`'ında
    `date`=`date_gmt`, ör. `calisan-performans-iyilestirme-plani-nasil-
    hazirlanir`) bu +03:00 varsayımı YANLIŞ — bu yazılar için ham veri
    zaten UTC-eşdeğeri olabilir, +03:00 eklemek YENİ bir 3 saatlik hataya
    yol açıyor (test edildi: `calisan-performans-...` için üretilen
    değer `12:18:47Z`, WP'nin gerçek `date_gmt`'i `15:18:47` — 3 saat
    erken). **Bilinçli olarak DÜZELTİLMEDİ** — şema seviyesinde hangi
    kaydın bu 60 anomaliden biri olduğunu ayırt etmenin bir yolu yok
    (yalnızca tek bir naive string görülüyor, `date_gmt`'e erişim yok).
    **Kazanç:** önceden bu 60 yazının değeri HANGİ MAKİNEDE build
    edildiğine göre RASTGELE yanlıştı (deterministik bile değildi);
    şimdi en azından HER ZAMAN aynı (tutarlı) yanlış değeri üretiyor.
    **Kalıcı çözüm için öneri (ayrı bir tur):** `extract-blog-posts.mjs`
    60 anomali slug'ı için WP'nin `date_gmt`/`modified_gmt` alanını
    doğrudan (ofset eklemeden, zaten UTC) kullanacak şekilde
    güncellenmeli — hangi alanın (`date` mi `date_gmt` mi) o 60 kayıt
    için "doğru" kabul edileceğine kullanıcıyla karar verilmesi
    gerekiyor.
43. **YENİ (2026-08-28) — Ürün/sektör/fiyat/donanım/hukuki sayfaların
    "Son Güncelleme" (`dateModified`) sistemi AYNI naive-tarih riskini
    taşıyor ama bu turun KAPSAMI DIŞINDA bırakıldı, kanıtlanamıyor.**
    `productContent.ts`/`sectorContent.ts`/`hardwareContent.ts`/
    `pricingContent.ts`/`miscPagesContent.ts`'in hepsi AYNI
    `new Date(rawNaiveString)` desenini kullanıyor (~161 sayfa,
    2026-08-19 turunda eklenen `dateModified` JSON-LD'si). **Ama** bu
    dosyaların kaynağı olan `products.json`/`sectors.json`/`pricing.json`/
    `hardware.json`/`misc-pages.json`'ın extraction script'leri
    `_gmt` karşılığını HİÇ saklamamış — yalnızca naive `modified` var,
    karşılaştıracak bir referans yok. En yakın kıyaslanabilir ham kaynak
    (`pages.json`, 170 sayfanın TAMAMINDA `date`=`date_gmt`) bu grubun
    MUHTEMELEN zaten UTC-eşdeğeri olduğuna işaret ediyor — yani #42'deki
    +03:00 düzeltmesini buraya da uygulamak muhtemelen YANLIŞ olurdu.
    **Bilinçli olarak dokunulmadı:** Keystatic bu sistemlere hiç
    dokunmuyor (aktif bir bozulma kaynağı yok, yalnızca teorik/ölçülemeyen
    bir risk), doğru düzeltmenin ne olduğu kanıtlanamıyor. Ayrı bir
    araştırma turu gerektiriyor (muhtemelen kaynak WP'nin ilgili custom
    post type'ları için `_gmt` alanının yeniden çekilmesi).
44. **DÜŞÜK ÖNCELİK (2026-08-29) — `content.config.ts`'teki composite
    loader mimarisi artık gereksiz karmaşıklık taşıyor, sadeleştirilebilir.**
    Blog'un tüm 622 yazısı `.md`'ye göç ettiği için (bkz. yukarıdaki
    "KEYSTATIC GEÇİŞİ" kapanış notu) `legacyJsonLoader` artık boş bir
    `posts.json`'ı okuyor — işlevsel bir sorun YOK (boş dizide döngü hiç
    çalışmıyor, `astro build` sorunsuz) ama `glob()`+`file()` sıralamasına
    dikkat eden özel loader, `fixLinkAccessibility()`/`demoteBodyH1s()`/
    `normalizeHeadingLevels()` render-time çağrıları gibi tüm o karmaşıklık
    artık kullanılmayan bir kod yolu. **Acil değil, isteğe bağlı bir
    temizlik turu:** `content.config.ts` saf `glob()` koleksiyonuna
    indirgenebilir, `posts.json` + `legacyJsonLoader` kaldırılabilir.
    Dokunulmadı — kullanıcı isteğiyle bilinçli olarak ertelendi.
46. **GÜNCELLENDİ (2026-09-14) — CSP altyapısı yeniden kuruldu, mod HÂLÂ
    Report-Only; enforcing için go/no-go listesi `docs/csp-rollout.md`'de.**
    Kullanıcının "enforcing yapmalı mıyız" sorusu üzerine yapılan inceleme,
    #46'nın 2. koşulunun (otomatik rapor toplama) hiç kurulmamış olduğunu
    ve bu yüzden 3. koşulun (1-2 hafta gözlem) takvimde geçmiş ama
    KANITTA hiç başlamamış olduğunu ortaya çıkardı — politikada
    `report-uri`/`report-to` HİÇ YOKTU, ihlaller yalnızca tek tek
    ziyaretçilerin DevTools Console'unda görünüyordu. (Canlıdaki
    `report-to` başlığı Cloudflare'ın NEL'i, CSP'nin değil.)
    **Bu turda yapılanlar:**
    1. **Tek kaynak:** politika artık yalnızca `src/data/csp.ts`'te.
       `public/_headers` bundan ÜRETİLİYOR
       (`node scripts/check-csp-sync.mjs --fix`), `src/middleware.ts`
       doğrudan import ediyor. Sapmayı YENİ kalıcı
       `scripts/check-csp-sync.mjs` yakalıyor (exit 1) — önceki "iki
       kopyayı elle birebir tut" disiplini bir kez gerçekten ayrışmıştı.
       **Bu script `dist/` DEĞİL kaynak dosyaları okur, `astro build`
       gerektirmez.**
    2. **Rapor toplama:** `src/pages/api/csp-report.ts` (SSR, kimliksiz —
       tarayıcı raporları doğrulanamaz, bu yüzden veri yalnızca insan
       incelemesi için bir sinyal, otomatik karar buna dayanmıyor) +
       politikada `report-uri` ve `report-to` + `Reporting-Endpoints`
       başlığı + `wrangler.json`'da `observability`. Üç katmanlı gürültü
       kontrolü (gövde boyutu / ihlal sınıfı tekilleştirme / isolate başına
       log tavanı), `document-uri`'nin query string'i loglanmıyor (form
       sayfaları e-posta taşıyabiliyor).
    3. **Enforcing'e bugün geçilse kırılacak 4 boşluk** tarama+canlı
       doğrulamayla bulunup kapatıldı: `frame-src`←`docs.google.com`
       (bir blog yazısındaki çalışan Google Forms embed'i),
       `img-src`←`lh3.googleusercontent.com` (bkz. TODO-1),
       `connect-src`←`google.com/recaptcha/` (reCAPTCHA v3 canlı;
       izinsizse token üretimi düşer ve `api/lead.ts` gönderimi reddeder
       → 6 form birden çalışmaz), `frame-src`←`googletagmanager.com`
       (GTM Preview / Tag Assistant).
    4. **`script-src`'te `'unsafe-inline'` kaldırıldı**, yerine build
       sonrası üretilen SHA256 hash listesi geldi
       (`scripts/generate-csp-headers.mjs`, `npm run build` zincirinde;
       12 benzersiz inline script). `application/ld+json` bilinçli
       atlanıyor (JS olmayan tip → tarayıcı çalıştırmıyor → CSP inline
       kontrolüne varmıyor) — **bu varsayım canlıda doğrulanmadı**, yanlışsa
       Report-Only raporları anında gösterecek ve geri alınacak.
       Generator `'unsafe-inline'`ı tam 1 kez bulamazsa dosyaya
       DOKUNMUYOR (fail-safe); `public/_headers` kaynakta
       `'unsafe-inline'` ile duruyor, yani generator hiç çalışmazsa site
       bugünkü çalışan politikayla yayına gider.
    **`style-src 'unsafe-inline'` KALICI** — React island'ları değeri
    çalışma zamanında hesaplanan `style="..."` ÖZNİTELİKLERİ yazıyor;
    hash'ler yalnızca `<style>` bloklarını kapsar, öznitelikler için
    `'unsafe-hashes'` + her tekil değerin hash'i gerekir ki dinamik
    değerlerde imkânsız. Bu yüzden enforcing klasik XSS korumasının
    TAMAMINI vermeyecek — kazanç daha dar ama gerçek (dış `<script src>`
    enjeksiyonu, `connect-src` ile sızdırma, `object-src`/`base-uri`/
    `form-action`/`frame-ancestors`).
    **YENİ 4. koşul — GTM.** #46 yazıldığında GTM canlı değildi. Artık
    pazarlama koda dokunmadan herhangi bir host'tan etiket ekleyebiliyor;
    enforcing altında hepsi SESSİZCE engellenir. Enforcing'den önce GTM
    etiket envanteri alınmalı (bkz. `docs/csp-rollout.md` ADIM 4). Reklam
    host'ları (`stats.g.doubleclick.net`, `google.com/ads/ga-audiences`,
    Meta/LinkedIn) TAHMİNLE allowlist'e YAZILMADI — gerçekten
    kullanılıyorlarsa raporlarda görünecekler.
    **Gözlem penceresi bu değişiklik canlıya çıktığı gün BAŞLAR.** Geçiş
    tek satır (`CSP_MODE = 'enforce'` + `--fix`), ama go/no-go listesi
    geçilmeden yapılmamalı. **Geri dönüş anlık DEĞİL** — `_headers`
    deploy'a bağlı ve yanıtlar Cloudflare'da cache'leniyor; geçiş düşük
    trafikli bir saatte yapılmalı.
    **TODO-1 (açık):** `surdurulebilir-kalkinma-kapsaminda-yesil-yonetim`
    yazısındaki `lh3.googleusercontent.com` görseli yerelleştirilmeli —
    bu turda İNDİRİLEMEDİ (geliştirme ortamının ağ politikası o host'a
    çıkışı 403 ile reddediyor, dosyanın hâlâ 200 döndüğü bile
    doğrulanamadı). Yerelleşince `img-src` izni KALDIRILMALI.

48. **YENİ (2026-08-31) — Görsel optimizasyonu (`astro:assets`/`<Image>`),
    kesin SIRALAMA kararı verildi, henüz başlanmadı.** Bir denetim
    bulgusu "60 raw `<img>`, format/srcset/CLS optimizasyonu yok" dedi —
    gerçek kapsam çok daha büyük çıktı (~83 elle yazılmış `<img>` +
    ürün/sektör/hub/misc/donanım JSON'larından üretilen **780 uzak görsel
    referansı**, Açık nokta #45'in 293 benzersiz dosyasıyla ÖRTÜŞÜYOR).
    **Mimari bulgu:** `@astrojs/cloudflare` adapter'ı VARSAYILAN olarak
    (`cloudflare()`, parametresiz) Cloudflare'ın gerçek IMAGES binding'ini
    kullanan ÇALIŞIR bir görsel dönüştürme hattı kuruyor (Sharp'a gerek
    yok, "bozuk" değil — yalnızca `astro:assets` hiç kullanılmadığı için
    şu ana dek devre dışı durdu). Ama bu, Cloudflare Images ürününü
    (olası maliyet) devreye sokmak anlamına geliyor — kullanıcı onayı
    olmadan aktive EDİLMEDİ. **Kesin sıralama (kullanıcı kararı,
    2026-08-31):**
    1. **Önce Açık nokta #45 (hotlink temizliği) tamamlanmalı** —
       optimize edilecek görsellerin taşınacağı zaten biliniyorken önce
       optimize edip sonra taşımak anlamsız.
    2. **Sonra Cloudflare Images maliyet araştırması** — Cloudflare
       Dashboard'dan hesabın gerçek fiyatlandırma/plan durumu kontrol
       edilmeli (kod içinden/dokümantasyondan kesin rakam çıkarılamadı).
    3. **En son mimari karar** — Cloudflare Images binding'i kullan
       (gerçek sunucu-taraflı WebP/AVIF+resize, adapter zaten hazır) vs.
       build-time ön-dönüşüm (Node/Sharp ile statik WebP üretimi, sıfır
       Cloudflare maliyeti ama daha az esnek/responsive).
    **Bu turda YAPILAN (mimari karara bağlı DEĞİL, bağımsız/güvenli
    CLS düzeltmesi — pilot):** `TRUST_BADGE_LOGOS` (`footer.ts`) ve
    `CUSTOMER_LOGOS`'un (`LogoStrip.astro`'nun statik dalı, veri zaten
    `homeContent.ts`'te vardı, tek satır) eksik `width`/`height`'ı
    dosyaların gerçek piksel boyutlarından/mevcut veriden dolduruldu +
    blog öne çıkan görseline (622 yazı, `[slug].astro`) `loading="eager"`
    eklendi (LCP, `ProductPage.astro`'daki AYNI kurala uydu). `astro
    check` 0 hata, `astro build` temiz, 8 regresyon script'i sıfır yeni
    sorun, Chrome'da footer rozetleri + logo şeridi görsel doğrulandı.
    **Kalan iş — BİLİNÇLİ OLARAK ERTELENDİ (kullanıcı kararı, 2026-08-31):**
    `CertificationBadges.astro` (`homeContent.ts:44-50`), `ThankYouPage.astro`
    (`thankYouContent.ts:77-78`, `CIVIL_LOGO_URL`/`FEMAS_LOGO_URL`),
    `CustomerStoriesPage.astro` (`customerStories.ts:169-170`,
    `CUSTOMER_STORIES_HERO_IMAGE`) — üçü de doğrulandı, hepsi
    `idenfit.com/wp-content/...` hotlink'i, yani Açık nokta #45'in
    ZATEN kapsamındaki 293 dosyanın bir parçası (`homeContent.ts`/
    `customerStories.ts`/`thankYouContent.ts` #45'in kendi 19 dosyalık
    envanterinde kayıtlı). **Karar: şimdi uzaktan fetch ile ölçüp
    width/height eklemek YERİNE, #45 tamamlanıp bu görseller yerelleştiği
    ZAMAN yapılsın** — o noktada gerçek boyutlar yerel dosyadan doğrudan
    okunabilir, şimdi fetch edip sonra tekrar iş yapmaya gerek kalmaz.
49. **DÜŞÜK ÖNCELİK, GELECEK PLANLAMASI (2026-08-31) — blog yazı sayısı
    arttıkça `astro build` süresi izlenmeli.** Şu an 622 yazı, `astro
    build` ~100-120s (gürültülü ölçüm, bkz. `getAllBlogPosts()`
    önbellekleme turu). **Eşikler:** build süresi 2 dakikayı aşarsa
    ÖNCE Astro'nun incremental build seçenekleri araştırılmalı (tam
    yeniden derleme yerine yalnızca değişen içerik); 5000+ yazıya
    yaklaşılırsa blogun statik (`prerender=true`, şu anki model) yerine
    hybrid/SSR modele geçişi değerlendirilmeli — `@astrojs/cloudflare`
    adapter'ı (Keystatic geçişi için ADIM 1'de kurulmuştu) bu geçişi
    teknik olarak zaten mümkün kılıyor, yeni bir adapter kurulumu
    gerekmeyecek. Kod değişikliği YOK, yalnızca ileriye dönük bir eşik/
    hatırlatma notu.
54. **AÇIK RİSK (2026-08-31'de bulundu, hâlâ geçerli) — `dates.ts` SİTE
    GENELİNDE runtime `Intl`'e dayanıyor ve `az-AZ` tarayıcıda BOZUK.**
    `formatLocalizedDate()` (`src/data/dates.ts:17`) hâlâ
    `Intl.DateTimeFormat(BCP47_LOCALE[locale], {month:'long'})` çağırıyor;
    tarayıcı konsolunda `az-AZ`'ın hem KISA hem UZUN ay formatının jenerik
    ICU fallback'ine (`"M01".."M12"`) düştüğü, `Intl.NumberFormat('az-AZ')`'ın
    ondalık ayracı olarak virgül değil NOKTA verdiği ölçülerek doğrulandı
    (tr/en/nl/it AYNI tarayıcıda sorunsuz — bu yalnızca `az`'a özgü bir
    CLDR kapsam boşluğu). **İki katmanlı:** build/Node ICU çıktısı DOĞRU,
    bozulma yalnızca hydration SONRASI tarayıcıda oluyor — yani SSR HTML'i
    ile hydrate edilmiş DOM arasında tutarsızlık da var. Etki: `az`
    sayfalarındaki blog tarihleri + "Son Güncelleme" şeritleri tarayıcıda
    yanlış görünüyor olabilir. **Kanıtlanmış çözüm deseni ZATEN elimizde:**
    `productPreviewWidgetData.ts`'teki `MONTH_ABBREV`/`WEEKDAY_ABBREV`/
    `formatDecimal()` tam bu sorun yüzünden runtime `Intl`'den Node'un tam
    ICU'suyla üretilip doğrulanmış SABİT TABLOLARA çevrildi (uydurma değil,
    gerçek CLDR verisi) — `dates.ts` için de aynı yol izlenmeli. Widget
    tarafı KAPANDI (bkz. arşiv), açık olan yalnızca site-geneli `dates.ts`.
    **Kalıcı kural:** yeni bir tarih/sayı biçimlendirmesi eklenirken runtime
    `Intl`'e GÜVENİLMEMELİ — `az` için önce ölçülmeli, gerekiyorsa sabit
    tablo yazılmalı.
69. **KAPANDI (2026-09-16) — yetkili pentest turunun 4 KOD bulgusu; kalan 3
    madde YALNIZCA panelden yapılabiliyor, adımları `docs/guvenlik-duzeltmeleri-2026-09.md`'de.**
    - **K3 — JSON-LD script kaçışı.** 8 `<script type="application/ld+json">`
      sink'i ham `JSON.stringify()` basıyordu. `<script>` HTML'de ham metin
      bağlamı: içerikteki ilk `</script` dizisi elementi KAPATIR, JSON söz
      dizimine bakılmaz — yani bir blog başlığı/SSS sorusu/breadcrumb etiketi
      script elementinden ÇIKIP çalışan script enjekte edebilirdi (`set:html`
      bu bağlamda kaçışlama yapmaz). Yeni paylaşılan `src/data/jsonLd.ts`'in
      `safeJsonLd()`'si `<`/`>`/`&`/U+2028/U+2029'u `\uXXXX`'e çeviriyor —
      JSON DEĞERİ birebir aynı kalıyor (`JSON.parse` eşitliği testle
      doğrulandı), yalnızca HTML ayrıştırıcısı tetiklenmiyor.
    - **K4 — blog gövdesindeki ham HTML temizlenmiyordu.** Astro'nun markdown
      hattı `remarkRehype({allowDangerousHtml:true})` → `rehypeRaw` →
      `rehypeStringify({allowDangerousHtml:true})`; hiçbir katmanda sanitizer
      YOKTU. Keystatic panelinden yazı yazan herkes siteye kalıcı XSS
      koyabiliyordu — ve o script bizim origin'imizde çalıştığı için aynı
      origin'in `localStorage`'ındaki Keystatic editör token'ını okuyup
      `master`'a commit atabilir, Workers Builds da otomatik deploy ederdi
      (blog yazısı → tam deploy erişimi). `astro.config.mjs`'in
      `markdown.processor`'ına `rehypeRaw` + `rehypeSanitize` (allowlist:
      `src/data/markdownSanitizeSchema.mjs`) + `rehypeRestrictIframeSrc`
      eklendi. **SIRA KRİTİK:** Astro'nun KENDİ `rehypeRaw`'ı kullanıcı
      eklentilerinden SONRA çalışıyor (`@astrojs/markdown-remark/dist/index.js`
      :77 vs :83) — kendi `rehypeRaw`'ımızı çağırmasaydık sanitizer ham HTML'i
      element olarak GÖRMEZ, `raw` düğümlerini atıp meşru `<iframe>`/`<cite>`
      işaretlemesini de silerdi. Mevcut 2 başlık eklentisi listede ÖNDE
      bırakıldı ki bugünkü çıktıları birebir korunsun.
      **Ampirik doğrulama (tahmin DEĞİL):** sanitize ÖNCESİ/SONRASI tam build
      alınıp 686 blog HTML'i `diff`lendi — **685'i byte-birebir aynı**, tek
      fark bir Google Forms iframe'inin `marginheight`/`marginwidth`
      öznitelikleri (HTML Living Standard'da olmayan, tarayıcıların yıllardır
      yok saydığı HTML4 kalıntısı). `<script>`/`onerror`/`onload`/`javascript:`
      payload'ları gerçek hatta test edilip elendiği, YouTube iframe'i/
      `<cite>`/`<sup>`/yerel `<img>`/`aria-label` korunduğu doğrulandı.
      **Bu turda ÇIKAN ve kapatılan ikinci bulgu:** `hast-util-sanitize`'ın
      `protocols` kontrolü, ilk `:` bir `/`'tan sonraysa değeri "göreli"
      sayıp geçiriyor — yani `protocols:{src:['https']}` ayarına RAĞMEN
      protokole-göreli `//evil.example/x` elenmiyordu. `rehypeRestrictIframeSrc`
      host allowlist'i (CSP `frame-src` ile KASITLI olarak aynı liste)
      bunu kapatıyor. CSP hâlâ Report-Only olduğu için bu ikinci katman şart.
    - **K2 — `/api/lead` istemci payload'ına fazla güveniyordu.**
      `maturityResult.levelTitle`/`levelSubtitle` yalnızca "string mi" diye
      kontrol edilip doğrudan PDF şablonuna (gerçek headless Chromium'da
      render ediliyor) ve İKİ e-postaya geçiyordu. Artık istemcinin gönderdiği
      değer HİÇ okunmuyor: doğrulanmış `totalScore`'dan `getLevel()`
      (`maturityTestDefinitions.ts`, bu tur `export` edildi) ile sunucuda
      hesaplanıp EZİLİYOR. Ayrıca: alan başına uzunluk tavanı
      (`MAX_FIELD_LENGTH`), gerçek e-posta biçim doğrulaması
      (`isValidEmail()` — SendGrid `to`/`replyTo`'suna CR/LF başlık
      enjeksiyonunu da kesiyor), ve `formType in REQUIRED_STRING_FIELDS` →
      `Object.hasOwn()` (`in` prototip zincirini de tarıyordu: `formType:
      'toString'` kontrolü GEÇİP zorunlu alanların hiçbiri olmadan kabul
      edilirdi).
    - **Y2 — hero e-postası URL'de taşınıyordu.** Ana sayfanın tek-alanlı
      formu `method="get"` olduğu için e-posta `?email=...` olarak adres
      çubuğuna giriyordu; oradan `Referer` başlığıyla hedef sayfadaki HER
      dış isteğe (GTM/GA4/YouTube/Cookie-Script), GA4'ün `page_location`
      kaydına, tarayıcı geçmişine, paylaşılan linklere ve sunucu/CDN
      loglarına sızıyordu — hiçbiri KVKK aydınlatma metninin kapsadığı bir
      işleme değil. Yeni `src/data/emailHandoff.ts` + `src/scripts/
      hero-email-handoff.js`: e-posta `sessionStorage`'a yazılıp query
      string OLMADAN gezinme yapılıyor. **Dürüst sınır:** JS'siz veya
      depolaması engelli tarayıcıda `preventDefault()` hiç çağrılmıyor, form
      eski GET davranışına düşüyor ve `takeHandoffEmail()` query
      parametresini fallback olarak okuyor — o dar senaryoda eski URL
      davranışı geçerli (alternatif, özelliğin o tarayıcılarda tamamen
      çalışmaması olurdu).
    **Doğrulama (tümü):** `astro check` 0 hata (429 dosya), `astro build`
    temiz, `generate-csp-headers.mjs` 400 şablon sayfası/12 hash + 2744 CMS
    sayfası doğrulandı, `check-csp-sync` senkron, 10 regresyon script'inden
    7'si sıfır sorun. Sıfır olmayan 3'ü de BU TURDAN BAĞIMSIZ:
    `check-heading-hierarchy` bilinen 5 sayfalık taban çizgisi (Açık nokta
    #36); `check-title-length`/`check-meta-description-length`'in TEK
    ortak bulgusu `blog/vardiya-degisikligi-riskleri` (66 karakterlik
    `<title>` — sonda çift boşluk var — + 226 karakterlik excerpt), bu
    yazı `keystatic-cloud[bot]`'un `2bfcf6b` commit'iyle 2026-09-13'te
    panelden yayınlandı ve sanitize ÖNCESİ referans build'de de BİREBİR
    aynı — bkz. Açık nokta #70.
70. **YENİ (2026-09-16), DÜŞÜK ÖNCELİK — panelden yayınlanan yazılar SEO
    uzunluk kurallarını atlıyor.** `blog/vardiya-degisikligi-riskleri`
    (`keystatic-cloud[bot]`, `2bfcf6b`) hem `<title>` (66 karakter, üstelik
    sonda çift boşluk) hem meta description (226 karakter) sınırını aşıyor —
    Açık nokta #28'in 2026-08-25'te sıfırladığı taban çizgisi böylece yeniden
    kirlendi. **Yapısal nokta:** Keystatic panelinin `metaTitle`/`excerpt`
    alanlarında uzunluk uyarısı YOK ve PR gate de olmadığı için (bkz.
    §Deployment) hiçbir otomatik kontrol devreye girmiyor. İki olası çözüm,
    ikisi de ayrı bir tur: (a) `keystatic.config.ts`'in ilgili alanlarına
    `validation:{length:{max:...}}` eklemek (panelde anında görünür,
    editörü kaynağında durdurur); (b) 10 `check-*.mjs` script'ini bir PR/
    deploy gate'ine bağlamak — ama bu önce Açık nokta #50'deki
    `check-heading-hierarchy` istisnasının çözülmesini gerektirir. Bu turda
    içeriğe DOKUNULMADI (CMS bot'uyla çakışma riski + bu tur güvenlik
    kapsamındaydı).

71. **YENİ (2026-09-16) — K1 (origin fallthrough) CANLI Cloudflare API'siyle
    araştırıldı; ilk tarif YANLIŞTI, gerçek sorun DAHA CİDDİ ve HÂLÂ AÇIK.
    Y1 (hız sınırı) API'den UYGULANDI.** Kullanıcı "bunları neden sen
    yapamıyorsun" diye sorunca env'deki `CLOUDFLARE_API_TOKEN` denendi.
    **DÜZELTME (Fable doğrulama turu, aynı gün) — ilk teşhisim YANLIŞTI.**
    "Değişkende boşluk/newline var, trim edilince çalıştı" demiştim; ölçüldü:
    token ham haliyle de trim sonrası da **53 bayt**, boşluk YOK. Gerçek neden
    YANLIŞ ENDPOINT: bu bir HESAP-sahipli (`cfat_` önekli) token, `/user/tokens/verify`
    ona her zaman `Invalid API Token` döner; doğru uç `/accounts/{id}/tokens/verify`
    (denendi: ham token + doğru uç → `status: active`). `tr -d` bir şey düzeltmedi,
    aynı anda endpoint de değiştiği için öyle sanılmış.
    - **K1 — ilk tarif yanlıştı.** "Route'u `idenfit.com/*` yap" demiştim;
      o route ZATEN VAR (`782f68fb...` → `idenfit-com`). Gerçek sorun:
      zone'da `script: null` taşıyan **5 route** (`/wp-includes/*`,
      `/wp-login.php*`, `/wp-admin*`, `/wp-json/*`,
      `/wp-content/plugins/*`) — Cloudflare'da daha SPESİFİK route
      kazandığı için bu yollar Worker'a HİÇ uğramayıp doğrudan eski
      origin'e (`92.204.25.71`, DNS'te hâlâ apex'in A kaydı) gidiyor.
      **`curl` ile canlı doğrulandı: eski WordPress AYAKTA** —
      `/wp-admin/` 302, `/wp-login.php` 404 ama 27.705 baytlık gerçek WP
      HTML'i + `Link: <.../wp-json/>` başlığı, `/wp-json/wp/v2/users`
      **401** (gerçek WP REST API), hepsinde `X-Powered-By: PHP/8.4.23`
      ve **CSP başlığı YOK**. Yani production alan adının altında
      denetlenmemiş bir WP yönetim yüzeyi duruyor.
      **Silmek güvenli — ölçülerek gösterildi:** (a) `www.idenfit.com`'da
      bu null-route'ların hiçbiri yok ve aynı yollar orada 301 dönüyor
      (istenen son durum zaten bir hostname'de canlı), (b) `dist/client`'ta
      `wp-json`/`wp-admin`/`wp-content/plugins` referansı 0, kaynakta tek
      eşleşme `HrMaturityTest.tsx:683`'te bir YORUM, (c)
      `/wp-content/uploads/*` listede DEĞİL (site görselleri etkilenmiyor).
      **UYGULANAMADI:** `DELETE .../workers/routes/<id>` çağrısını bu
      ortamın güvenlik sınıflandırıcısı "DNS / Domain / Cert Changes"
      kategorisinde engelledi. 5 route ID'si + hazır curl komutu + panel
      adımları `docs/guvenlik-duzeltmeleri-2026-09.md`'de.
    - **Y1 — UYGULANDI.** `http_ratelimit` entrypoint ruleset'ine
      (`88d72fe1...`) yeni kural `aac50a461a56472cb86b8f82c91b556f`
      eklendi: `POST /api/lead`, IP başına 10 istek/60sn, block 60sn.
      Mevcut `assign.idenfit.com` kuralına DOKUNULMADI (PUT değil, rules
      endpoint'ine POST). **Doğrulanamadı, dürüst sınır:** 18 ardışık POST
      429 vermedi — ama kural bozuk olduğu için değil: bu ortamın çıkış
      IP'si her istekte havuzdan değişiyor (`160.79.106.128–137` ölçüldü),
      kural IP başına saydığı için eşiğe ulaşılamıyor. İzole kontrol
      deneyi (geçici `/robots.txt` 2/10sn kuralı) aynı nedenle tetiklenmedi,
      hemen geri alındı ve canlı durum yeniden doğrulandı. Tek IP'li normal
      bir makineden 12 POST ile doğrulanabilir. **İkinci sınır:** Free/Pro
      planda `cf.colo.id` karakteristiği zorunlu → sayım colo başına,
      global değil.
    - **YAN BULGU (yeni, ayrı karar bekliyor):** `test.idenfit.com` DNS
      kaydı proxy'siz (gri bulut) ve apex ile AYNI origin'e gidiyor —
      `curl -I` `Server: Apache` + `PHP/8.4.23` döndürüyor ve `cf-ray`
      başlığı YOK, yani istek Cloudflare'a hiç uğramıyor. Sonuç: apex'e
      uygulanan CSP/WAF/hız sınırı bu hostname (veya doğrudan IP) üzerinden
      TAMAMEN atlanabilir ve origin IP'si açığa çıkmış oluyor. Şu an `/`
      500 dönüyor ama sunucu ayakta.

72. **YENİ (2026-09-16) — #69/#71'in Fable ile bağımsız doğrulaması: 1 GÜVENLİK
    OLAYI, 2 düzeltilmiş hatam, 1 kaçırdığım HIGH bulgu, + açık kalan liste.**
    - **⚠️ GÜVENLİK OLAYI — Cloudflare API token'ı bir alt-ajanın transkriptinde
      kısmen açığa çıktı.** Ajana "token DEĞERİNİ hiçbir yere yazdırma" talimatı
      verilmişti; ajan token'ın bayt yapısını incelerken yetersiz maskeyle
      `od -c` çalıştırıp ~50 karakterini transkripte düşürdü. Token ID
      `f9deb06d62e5624b6f3ebd7b94da6875` (`cfat_` önekli, hesap-sahipli).
      **ROTASYON GEREKİYOR.** Ders: bir secret'ı "yazdırma" talimatı yeterli
      değil — alt-ajanlara secret'a erişim vermek yerine, gereken çağrıları
      ana oturumda yapıp SONUÇLARI vermek gerekiyor.
    - **DÜZELTİLDİ — kurduğum hız sınırı kuralı sondaki slash ile atlatılabiliyordu.**
      `http.request.uri.path eq "/api/lead"` ifadesi `/api/lead/`'i KAÇIRIYOR;
      `astro.config.mjs`'te `trailingSlash` tanımlı olmadığı için (varsayılan
      `ignore`) Astro her iki yolu da işliyor — bağımsız olarak doğrulandı
      (`POST /api/lead/` → 400, yani gerçekten işleniyor). İfade
      `http.request.uri.path in {"/api/lead" "/api/lead/"}` yapıldı. **Method
      koşulu da KALDIRILDI:** Cloudflare'ın kendi doküman tablosu `Method`
      alanını Business ve üstü olarak listeliyor (zone Pro) — API kabul etmişti
      ama kural sessizce etkisiz olabilirdi; `GET /api/lead` zaten 404 olduğu
      için method koşulu gereksizdi. **Ayrıca:** Pro planda hız sınırı kotası
      **2 kural** ve ikisi de artık dolu (`assign.idenfit.com` + bu) — üçüncü
      bir kurala yer YOK.
    - **DÜZELTİLDİ — #71'deki "www kanıtı" YANLIŞTI.** "www'de aynı yollar 301
      dönüyor, demek ki Worker işliyor" demiştim; gerçekte o 301'ler
      `http_request_dynamic_redirect` ruleset'indeki bir Redirect Rule'dan
      geliyor ve Worker'dan ÖNCE çalışıyor — üstelik hedefleri AÇIK olan apex
      yollarına götürüyor (`www/wp-json/wp/v2/users` → sonunda apex'te 401
      origin). Yani o argüman geçersiz. **Silme kararının kendisi hâlâ geçerli**
      ama gerekçesi (b) ve (c): `dist/client`'ta 0 referans, sitemap'te 0
      wp-* URL, `/wp-content/uploads/*` listede değil, silme sonrası Worker'ın
      404'üne düşüyor (`/xmlrpc.php` bugün zaten öyle).
    - **KAÇIRDIĞIM HIGH — `ftp.idenfit.com`.** #71'de yalnızca
      `test.idenfit.com`'u yazmıştım; `ftp.idenfit.com` de proxy'siz CNAME ve
      AYNI origin'e çözülüyor (DNS ile doğrulandı: `92.204.25.71`). Ajanın
      raporuna göre `test`'ten FARKLI olarak WordPress'i fiilen SERVİS EDİYOR
      (`/wp-login.php` → 27.754 baytlık WP HTML, `/wp-json/wp/v2/users` → 401,
      `cf-ray` yok). **Bu ikinci kısmı BEN doğrulayamadım** — bu ortamdan
      istek CONNECT tünelinden sonra düştü (muhtemelen origin sertifikası
      `ftp.` adını kapsamıyor). DNS/IP gerçeği kesin, servis ettiği kısım
      TEK KAYNAKLI. Önemi: 5 route silinse bile bu kapı açık kalır.
      Zone ayarları bunu ağırlaştırıyor: SSL modu `full` (strict DEĞİL),
      Authenticated Origin Pulls KAPALI — origin, önünde Cloudflare olmasını
      şart koşmuyor.
    - **Apex'teki WP yüzeyi rapor ettiğimden GENİŞ:** `/wp-json/` indeksi 21
      namespace/385 route açığa çıkarıyor (aralarında `code-snippets/v1` — PHP
      çalıştıran eklenti, `redirection/v1`, `wordfence/v1`, ve
      `hr-maturity/generate` — `HrMaturityTest.tsx:683`'teki yorumun bahsettiği
      ESKİ backend, kimliksiz POST); Application Passwords açık (yani
      `wp-login.php` gizlenmiş olsa da REST üzerinden credential stuffing
      mümkün); `admin-ajax.php` canlı; 630 yazı/170 sayfa/2243 medya + eklenti
      sürümleri sayılabiliyor. Hafifletici: `wp-login.php` WPS Hide Login ile
      gizlenmiş, Wordfence kurulu, zone WAF managed ruleset bu yollarda aktif.
    - **Kayda değer ek:** 5 route silindikten SONRA edge cache temizlenmeli
      (`/wp-includes/*` altındaki origin varlıkları HIT dönüyor); ve silmeden
      önce origin erişim loglarında `/wp-json/hr-maturity/generate` gibi
      yollara MEŞRU trafik olup olmadığına bakılmalı.
    - **`/api/lead` incelemesinin açık bıraktıkları (ayrı bir tur):** (1) PDF
      üretimi çökerse ekip bildirimi de sessizce düşüyor — lead kayboluyor ama
      kullanıcı "başarılı" görüyor (`processMaturityReportAsync` tek `try`);
      (2) `categoryScores` ANAHTARLARI sınırsız ve ekip e-postasına giriyor —
      209 KB istek → 1,56 MB e-posta ölçüldü (kaçışlanıyor, XSS yok, ama
      amplifikasyon); (3) `fullName` CR/LF içerebiliyor ve SendGrid
      `reply_to.name`'e HAM gidiyor; (4) `Content-Type` kontrolü yok →
      `text/plain` cross-site form gövdesi kabul ediliyor (reCAPTCHA secret'ı
      kuruluysa etkisiz); (5) gövde boyutu sınırsız; (6) `pageUrl` ekip
      e-postasında HERHANGİ bir host'a tıklanabilir link oluyor. Bunların
      hiçbiri bu turda DÜZELTİLMEDİ.
    - **SANITIZER (K4) — script çalıştırma yolu YOK, 4 sertleştirme UYGULANDI.**
      Adversaryal tur 50+ payload'ı GERÇEK eklenti dizisinden geçirdi:
      `<script>`, her yazım/kodlamada `on*`, `<svg onload>`, `xlink:href`,
      `<math>`, `<template>`, `<noscript>`, `srcdoc`, `<base>`,
      `<meta refresh>`, `formaction`, `<object>`/`<embed>`, raw-text mXSS,
      `javascript:`'in 12 varyantı, `rehypeRestrictIframeSrc`'ye 40 host
      varyantı (userinfo `@`, backslash, fullwidth IDNA, `%2F`, trailing dot)
      — **hepsi elendi.** `safeJsonLd` 11 düşmanca girdide temiz.
      **Ama 4 gerçek bulgu vardı, dördü de düzeltildi:**
      1. **`style`/`class` tam-ekran kaplama primitifi.** Script yok ama bir
         yazar `position:fixed;inset:0;z-index:...` ile header'ı (ve "Giriş
         Yap" linkini) sahte içerikle örtebiliyor, görünmez tam-ekran `<a>`
         ile her tıklamayı kaçırabiliyordu. Yalnızca `style`'ı kısıtlamak
         işe yaramazdı: Tailwind sınıfları derlenmiş CSS'te var, yani
         `class="fixed inset-0 z-50 bg-white"` aynı etkiyi veriyordu.
         İkisine de DEĞER allowlist'i eklendi (`SAFE_STYLE`/`SAFE_CLASS`).
      2. **`clobberPrefix: ''` — benim yanlış varsayımım.** "Mevcut `#...`
         çapalarını kırar" diye DOM-clobbering korumasını kapatmıştım;
         ÖLÇÜLDÜ: 633 yazıda ham `id=` **0**, ham `name=` **0**. Çapalar
         markdown `](#...)` ve hedefleri `rehypeHeadingIds`'in ürettiği
         id'ler — o eklenti sanitizer'dan SONRA çalışıyor. Koruma bedavaymış,
         override kaldırıldı.
      3. **`rel="opener"` + `target="_blank"`** ters tabnabbing'e izin
         veriyordu (`rel` benim eklediğim bir öznitelikti) — değer
         allowlist'ine alındı. Korpustaki tek değer `noreferrer noopener`.
      4. **Sanitizer'ın iframe host listesi CSP `frame-src` ile AYNI
         DEĞİLDİ** — koddaki yorumum "kasıtlı olarak aynı" diyordu ama
         `www.youtube-nocookie.com` yalnızca sanitizer'da vardı; CSP
         enforcing'e geçtiği gün o embed'ler sessizce kırılacaktı. Korpusta
         hiç kullanılmadığı doğrulanıp (0/633) listeden çıkarıldı.
      **Maliyet ölçüldü, sıfır:** sertleştirme öncesi/sonrası tam build
      alınıp 686 blog sayfası diff'lendi — **686/686 byte-birebir aynı**.
      `astro check` 0 hata, 10 regresyon script'i aynı bilinen 3 taban
      çizgisi (#36 + #70), sıfır yeni sorun.
      **Düzeltilmedi, bilinçli:** `accessKey`/`tabIndex`/`itemProp`/`name`/
      `id` `defaultSchema`'dan (GitHub'ın kendi allowlist'i) geliyor —
      ondan sapmak ayrı bir karar. `docs.google.com/viewer?url=` ile
      saldırgan-kontrollü PDF gömme mümkün (CSP zaten o host'a izin
      veriyor). Bir yazar `__ASTRO_IMAGE_="null"` metniyle BUILD'İ
      kırabiliyor (Astro'nun kendi render-sonrası regex'i; sanitizer'ın
      işi değil, deploy'u durdurur ama canlıyı bozmaz).
    - **Hero e-posta aktarımında (Y2) açık kalan:** handoff script'i modül
      script'i olarak belgenin SONUNDA çalışıyor; yavaş bağlantıda kullanıcı
      formu daha erken gönderirse eski `?email=` GET'ine düşüyor. Ayrıca
      fallback yolunda `?email` hâlâ GA4 `page_location`'a giriyor. **Not:**
      `Referrer-Policy: strict-origin-when-cross-origin` canlıda zaten aktif,
      yani Y2'nin gerekçesindeki "Referer" kanalı aslında zaten kapalıymış —
      gerçek kanallar GA4/geçmiş/paylaşılan link/loglar.

73. **KAPANDI (2026-09-22) — form lead'leri artık Cloudflare D1'e KALICI
    olarak yazılıyor; ayrıca istemcinin sessizce ATTIĞI 3 alan + 20 cevap
    kurtarıldı.** Kullanıcı bulgusu: İK Olgunluk Testi'ni dolduranların
    verisi hiçbir yerde saklanmıyor, eski WordPress'teki Google Sheet
    bağlantısı göçte koptu. İnceleme sorunu tarif edilenden GENİŞ buldu:
    1. `/api/lead` HİÇBİR yere yazmıyordu (`wrangler.json`'da veritabanı
       binding'i yoktu — yalnızca Astro session KV'si + BROWSER).
    2. `HrMaturityTest.tsx`'in `EmailReportForm`'u, testin BAŞINDAKİ
       formun topladığı 6 alanın yalnızca 3'ünü gönderiyordu —
       **`phone`/`employeeCount`/`sector` tarayıcıdan hiç ÇIKMIYORDU**,
       ekip bildirimi e-postasında bile yoklardı.
    3. 20 sorunun tek tek cevapları hiç gönderilmiyordu (yalnızca
       toplulaştırılmış skorlar) — soru bazlı analiz imkânsızdı.
    **Uygulanan (kullanıcı kararı: "Cloudflare D1 ile başla"):** D1
    veritabanı `idenfit-leads` (WEUR) + `migrations/0001_create_leads.sql`
    + yeni `src/data/leadStore.ts` + `scripts/export-leads.mjs` (CSV,
    UTF-8 BOM'lu, formül-enjeksiyonu korumalı). Operatör dokümanı:
    **`docs/lead-storage-d1.md`**.
    **Kritik tasarım kararı — kayıt e-postadan ÖNCE.** SendGrid
    yapılandırma kontrolünden önce yazılıyor, yani anahtar HÂLÂ YOKKEN
    bile (bugünkü durum) lead kaybolmuyor; kullanıcı yine dürüst bir 503
    görüyor ama satır D1'de `email_status='failed'` olarak duruyor.
    `leadStore` ASLA throw etmez — veritabanı erişilemezse form akışı
    aynen devam eder. Kapsam TEK form değil, `/api/lead`'in TAMAMI
    (6 form türü, `form_type` kolonuyla ayrışıyor).
    **Yan kazanç:** `processMaturityReportAsync`'in tek `try` bloğu
    (Açık nokta #72'nin ilk maddesi) artık sessiz değil — PDF üretimi
    çökerse satır `'failed'` işaretleniyor, lead elle takip edilebiliyor.
    **Aynı turda kapatılan ikinci #72 maddesi:** `isValidScoreRecord()`
    (`maturity-pdf.ts`, `lead.ts` ile paylaşımlı) önceden yalnızca
    DEĞERLERİ doğruluyordu, anahtar sayısı/uzunluğu serbestti — 64 anahtar
    / 100 karakter tavanı eklendi (bu bloblar artık D1'e de yazıldığı için
    amplifikasyon yalnızca e-postayı değil veritabanı satırını da
    şişirirdi).
    **Doğrulama — gerçek worker build'iyle, mock DEĞİL:** `wrangler dev`
    (yerel D1) üzerinde `/api/lead`'e gerçek POST atıldı → HTTP 503
    (SendGrid yok, beklenen) AMA satır yazıldı; `phone`/`employee_count`/
    `sector`/`maturity_answers` dolu, Türkçe karakterler bozulmamış,
    `email_status='failed'`/`email_error='email_service_unavailable'`.
    **K2 sertleştirmesi yeni alanlarla birlikte HÂLÂ çalışıyor:** istemci
    `levelTitle` olarak "İSTEMCİDEN GELEN SAHTE BAŞLIK" gönderdi, kayıtta
    sunucunun `getLevel(62)`'den hesapladığı "Dijital İK" var. Reddetme
    senaryoları tek tek test edildi (geçersiz cevap değeri/anahtarı, 21+
    cevap, 120+ karakter sektör, 65 skor anahtarı, 101 karakterlik anahtar
    → hepsi 400; `answers` GÖNDERİLMEYEN eski istemci payload'ı → hâlâ
    kabul, geriye dönük uyumlu). CSV export script'i yerel veriye karşı
    çalıştırılıp çıktısı gözden geçirildi. **Canlı D1'de 0 satır** —
    tüm testler yerel kopyaya gitti, üretim verisi kirletilmedi.
    Adapter'ın ürettiği `dist/server/wrangler.json`'ın D1 binding'ini
    taşıdığı doğrulandı (deploy'da düşmüyor).
    **BİLİNÇLİ OLARAK YAPILMAYAN — testi bitirip "raporu gönder"e
    BASMAYANLAR hâlâ kaydedilmiyor.** Kişi iletişim bilgisini testin
    BAŞINDA veriyor ama `/api/lead` isteği yalnızca sondaki butona
    basılırsa atılıyor. Daha erken kayıt açmak, o noktada gösterilen bir
    onay metni OLMADIĞI için yapılmadı — bkz. bir sonraki madde.
    **KVKK açığı (yeni bulgu, ürün/hukuk kararı bekliyor):** İK Olgunluk
    Testi formunda HİÇ KVKK metni yok (`grep -ci kvkk HrMaturityTest.tsx`
    → 0), diğer 5 formun hepsinde var (`kvkkNotice`). Veri artık kalıcı
    saklandığı için bu boşluk daha kritik. Ayrıca saklama süresi/silme
    politikası tanımlı DEĞİL — tablo süresiz büyür. IP/user-agent
    bilinçli olarak saklanmıyor (yeni kişisel veri kategorisi eklememek
    için).
    **Google Sheets aynası KURULMADI** — kararlaştırılan sıra önce D1
    (kayıt defteri) sonra istenirse Sheet (görünüm), böylece Sheet'in
    çalışması lead'in kaybolmamasının ŞARTI olmuyor. Eski kurulumun zaafı
    tam da buydu.

75. **ARALIKLI / YENİDEN ÜRETİLEMİYOR (2026-10-01'de açıldı, 2026-10-02'de
    ölçülerek yeniden yazıldı) — `astro check` bir kez heap OOM ile çöktü;
    deploy'u tehdit eden bir sorun DEĞİL, ama marj dar (%35).**
    - **2026-10-01 gözlemi (olduğu gibi duruyor):** `npx astro check`
      "Getting diagnostics for Astro files…" satırından sonra V8'in
      `FATAL ERROR: Reached heap limit` / `Ineffective mark-compacts near
      heap limit` hatasıyla düştü, **exit 134** (SIGABRT) — hem varsayılan
      heap'te hem `NODE_OPTIONS=--max-old-space-size=8192` ile. JSON-LD
      `inLanguage` turunda (PR 1) keşfedildi; değişiklik `git stash` ile
      geri alınıp temiz baseline'da tekrarlandı, aynı şekilde çöktü — yani
      PR 1 ile İLGİSİ YOK.
    - **2026-10-02 ölçümleri — ÇÖKME YENİDEN ÜRETİLEMEDİ.** Aynı makine,
      aynı dal, üç ayrı çalıştırma, üçü de **431 dosya / 0 hata / 0 uyarı
      / 27 hint** ile geçti:

      | Heap limiti | Süre | Tepe node bellek |
      |---|---|---|
      | varsayılan (4288 MB) | 80,6 s | **2790 MB** |
      | 12288 MB | 106,2 s | 2757 MB |
      | 16384 MB | 101,9 s | — |

      Yani 2026-10-01'de 8 GB'ı dolduran iş, 2026-10-02'de 2,8 GB'ta
      bitiyor. **Aradaki farkın nedeni BULUNAMADI** — tekrarlarsa o anki
      `FreePhysicalMemory`, eşzamanlı `astro dev`/`astro build` olup
      olmadığı ve `.astro/` sync durumu not edilmeli; bugün çökmemesinin
      sebebi büyük ihtimalle bunlardan biri ama **kanıtlanamadı**.
    - **Asıl risk marj, çökme değil:** 2790 MB tepe / 4288 MB varsayılan
      limit = yalnızca **%35 boşluk**. 639 `.md` yazı var ve Keystatic'ten
      eklenmeye devam ediyor.
    - **Deploy hattı SAĞLAM — kanıtlandı.** Cloudflare Workers Builds
      `npm run build:ci` (= `astro check && npm run build`) çalıştırıyor ve
      geçiyor: `a3b2896` (KOBİ → "Teklif Al"/"Başvur") ve master'ın son
      commit'i `fbe82c6` (2026-09-24 tarihli Keystatic yazısı) ikisi de
      canlıda doğrulandı. Konteyner limitleri (resmî dok): **8 GB RAM**,
      2 vCPU (free) / 4 vCPU (paid), 20 GB disk, **20 dk build timeout**,
      Ubuntu 24.04, Node varsayılan 24.18.0.
      **Doğrulanmamış, panelden bakılmalı:** (a) `.nvmrc`'nin (`22`)
      okunup okunmadığı — bkz. `docs/cloudflare-workers-builds.md:68-71`;
      (b) `astro check` adımının CI'daki SÜRESİ — yerelde `astro build`
      ~5-6 dk + `astro check` ~1,5 dk, 20 dk tavanı bellekten daha yakın
      bir risk olabilir. Build logundaki bellek doğrudan okunamıyor
      (Workers Builds bellek telemetrisi yayınlamıyor) ve bu oturumda
      Cloudflare kimlik bilgisi YOK (`wrangler whoami` → not authenticated).
    - **Mekanizma (kaynak koddan doğrulandı), neden `tsc`'den pahalı:**
      `@astrojs/language-server/dist/check.js:66-116` — `lint()`,
      `getRootFileNames()`'teki **her dosya için sırayla** `linter.check(file)`
      çağırıyor. Bu bir tek-seferlik `ts.Program` değil, **Volar + TS
      LanguageService**: hesaplanan her şey (semantik tanılar, tip
      instantiation'ları, her `.astro` için üretilen sanal TSX + source
      map) iterasyonlar arasında cache'te CANLI kalıyor. "Ineffective
      mark-compacts" imzası tam olarak bu — heap çöp değil, erişilebilir
      nesnelerle doluyor. Karşılaştırma: `tsc --noEmit` AYNI tsconfig ile
      (`.astro` hariç, 1467 program / 168 kök dosya) **997 MB / 28 s**;
      `astro check` (431 dosya) **2790 MB / 81 s**. Volar katmanı tek
      başına **+1,8 GB**.
      431 = 168 TS kök dosyası + 263 `.astro` (CLAUDE.md'nin "429 dosya"
      kaydıyla tutarlı).
    - **Üst akışta bilinen, HÂLÂ AÇIK bir sorun:** withastro/astro#16718
      (Astro 6.3.1 + Node 24 + `@astrojs/cloudflare` — bizim kurulumumuza
      çok yakın, "fix pending"), #14663 ("closed as not planned", "P2: has
      workaround"), language-tools#699, language-tools#721.
      **`@astrojs/language-server` 2.16.13→2.17.1 changelog'unda bellek
      düzeltmesi YOK** (kurulu: 2.16.12, son: 2.17.1). Dahası 2.16.13 ve
      2.16.16 "atlanan dosyalar" düzeltmeleri DAHA ÇOK dosya kontrol
      ettirir → bellek artabilir; 2.17.0 ise `.astro`→TSX motorunu Biome
      tabanlı yeni `astro2tsx` ile baştan yazıyor ("daha doğru tipler")
      → 263 `.astro` dosyasında YENİ tip hataları çıkarabilir. **Yükseltme
      şimdilik önerilmiyor**, faydası kanıtsız/riski gerçek.
    - **⚠️ `typescript` 7'ye YÜKSELTİLMEMELİ.** `check.js:161-168` açıkça
      reddediyor: TS 7+ native derleyici `astro check`'in dayandığı
      programatik API'yi (`ts.sys`, `ts.findConfigFile`, `LanguageServiceHost`)
      sunmuyor, paket "6.x kullanın" diye hata fırlatıyor. Takip:
      withastro/roadmap#1321. (Kurulu: `typescript@6.0.3`.)
    - **Kapanış kararı (kullanıcı, 2026-10-02):** bellek konusu şimdilik
      KAPALI, aksiyon alınmıyor. Tekrarlarsa bu madde yeniden açılır.
      Azaltma seçenekleri Açık nokta #76'da.
76. **ERTELENDİ (2026-10-02, kullanıcı kararı: "ayrı bir tur olarak not et,
    şimdi yapma") — `astro check` bellek marjını genişletecek iki düşük
    riskli temizlik.** Açık nokta #75'in araştırmasında ölçüldü; ikisi
    birlikte tepe kullanımı ~2,8 GB'tan muhtemelen ~2 GB'ın altına indirir,
    görünür davranışı değiştirmez.
    - **(C) tsconfig kapsamını daralt.** `tsconfig.json` şu an
      `include: [".astro/types.d.ts", "**/*"]` + `exclude: ["dist"]` ve
      `astro/tsconfigs/base` `allowJs: true` veriyor — sonuç: **63
      `scripts/*.mjs`** (168 kök dosyanın %38'i, kontrol edilen 431
      dosyanın %15'i) programa giriyor. Bunlar tek seferlik migrasyon/
      denetim script'leri, siteye hiç girmiyorlar ve JSDoc taşımadıkları
      için bugün de gerçek bir tip kontrolü almıyorlar. `exclude`'a
      `scripts`, `.wrangler`, `dist-check` eklenebilir.
      **`astro.config.mjs` ve `keystatic.config.ts` DIŞARIDA
      BIRAKILMAMALI** — ikisi de gerçek değer sağlıyor.
      **Risk/doğrulama şartı:** `exclude` yanlış yazılırsa `astro check`
      sessizce daha az dosya kontrol edip "0 hata" der (Açık nokta #25'teki
      MegaMenu olayının AYNI tuzağı) — değişiklikten sonra
      `Result (N files)` sayısı 431'den **tam beklenen kadar** düşmeli.
    - **(D) İki büyük JSON import'unu tipten kurtar (~0,5 GB).** İzole
      ölçüm: boş baseline **61 MB** → `src/data/pagesJsonModified.ts`
      (→ `pages.json` 9,7 MB) **266 MB / 38.432 tip** →
      `src/data/contentLinkAccessibility.ts` (→ `pages.json` + `posts.json`
      15 MB) **592 MB / 142.630 tip / 5,3 s**. İroni: iki tüketici de
      import'u anında dar bir arayüze cast ediyor
      (`as Array<{link; title}>`, `as unknown as RawPage[]`) — TypeScript
      24,7 MB'lık yapıyı **hesaplayıp sonra atıyor**.
      Çözüm: bu İKİ dosyada `import … from '*.json'` yerine
      `readFileSync` + `JSON.parse` + mevcut dar arayüz.
      **Riskler:** (a) build-time okuma yolu `@astrojs/cloudflare`
      prerender worker'ında dosya yolu/`import.meta.url` çözümlemesi
      gerektirir, GERÇEK build ile doğrulanmalı; (b) **diğer 8 küçük JSON
      için AYNI ŞEY YAPILMAMALI** (`products.json` 501 KB, `sectors.json`,
      `misc-pages.json`, `hubs.json`, `faq.json`, `hardware.json`,
      `pricing.json`, `calculators.json`) — onların çıkarsanan tipleri
      gerçekten kullanılıyor; (c) 3172 HTML'in byte seviyesinde aynı
      kaldığı diff ile kanıtlanmalı.
    - **Kapsam dışı/yapılmayacak olarak kaydedildi:** `astro check`'i
      `build:ci`'dan çıkarmak (tip hataları sessizce canlıya çıkar, PR
      gate zaten yok — bkz. #70; i18n'in `Record<Locale,X>` derleme-zamanı
      güvenlik ağı kaybolur) ve `NODE_OPTIONS` ile tavanı yükseltmek
      (yerelde varsayılan zaten geçiyor, CF konteyneri toplam 8 GB —
      yüksek değerler OOM-killer'a davetiye).
    - **Not:** `media.json` (10,9 MB) ve `.astro/data-store.json`
      (11,8 MB) programa GİRMİYOR — hiç import edilmiyorlar ve TypeScript
      wildcard `include` ile `.json` toplamıyor. Bu ikisi için bir şey
      yapmaya gerek yok.
77. **BÜYÜK ÖLÇÜDE KAPANDI (2026-10-02, iki tur) — `/guvenlik/` TR
    sayfasının 2/3/4/5. maddeleri düzeltildi (5/6 madde artık
    başlık↔belge olarak TAM eşleşiyor); YALNIZCA 6. madde AÇIK kaldı —
    gerçek TR "İş Ortağı Aydınlatma Metni" PDF'i repoda hiç yok,
    sağlanması + hukuk onayı gerekiyor.**
    Kullanıcı yeni bir "PO-YN-01 Bilgi Güvenliği Politikası" PDF'i verip
    madde 2'nin güncellenmesini istedi. **Keşifte beklenmedik bir durum
    çıktı: ham veride madde başlıkları ile bağlı PDF dosya adları
    uyuşmuyor.** Dosya ADLARINA değil, her PDF'in kendi Info sözlüğündeki
    kaynak `.docx` adına + sayfa sayısına bakılarak gerçek içerik
    belirlendi — **yöntem kalıcı olarak kayda değer:** bu PDF'lerin metin
    katmanı CID-kodlu font kullanıyor, bu yüzden ham metin çıkarımı
    güvenilir DEĞİL, ama Info sözlüğündeki kaynak `.docx` adı belgeyi
    kesin olarak tanımlıyor.

    | # | Görünen başlık | Bağlı dosya | Dosyanın GERÇEK içeriği | Durum |
    |---|---|---|---|---|
    | 2 | Bilgi Güvenliği Politikası | `..._İs_Ortagi_Aydinlatma_Metni_v3.pdf` | PO-YN-01 Bilgi_Guvenligi_Politikası (1 sf) | içerik ✓, ad yanıltıcı |
    | 3 | Çerez Politikası ve Çerez Aydınlatma Metni | `..._Calisan_ve_Calisan_Adayi_..._v3.pdf` | Çalışan/Çalışan Adayı Aydınlatma Metni | ❌ yanlış belge |
    | 5 | Çalışan ve Çalışan Adayı Aydınlatma Metni | `cerez_politikasi_ve_aydinlatma.pdf` | Çerez Aydınlatma Metni v4 | ❌ yanlış belge |
    | 6 | İş Ortağı Aydınlatma Metni | `bilgi_guvenligi.pdf` | PL.01 Kalite ve Bilgi Güvenliği YS Politikası (ESKİ) | ❌ yanlış belge |

    *(Yukarıdaki tablo keşif anındaki ÖNCE durumunu gösteriyor.)* Yani
    **3↔5 yer değiştirmiş**, **6 eski bir Bilgi Güvenliği belgesi
    gösteriyor** ve **TR "İş Ortağı Aydınlatma Metni" PDF'i repoda HİÇ YOK**
    (yalnızca `-EN` sürümü var, 5 sayfa). Hatalar canlıda da aynen vardı
    (`curl` ile doğrulandı) — bu turda ORTAYA ÇIKARILDI, bir regresyon
    DEĞİL. İlk turda hukuki belge oldukları için kullanıcı kararıyla
    DOKUNULMAMIŞTI; **3/4/5 aynı gün ikinci turda düzeltildi (aşağıda),
    6 hâlâ açık.**
    **İKİNCİ TUR (aynı gün, kullanıcı talimatı) — 3/4/5. maddeler de
    düzeltildi; artık YALNIZCA 6. madde hatalı.** Kullanıcı 3 ve 5'in
    BAŞLIKLARININ takas edilmesini istedi — bu, bağlı dosyalara
    DOKUNMADAN eşleşmeyi DOĞRU kuran çözümdür (madde 3'ün dosyası gerçekten
    "Çalışan ve Çalışan Adayı Aydınlatma Metni v3", madde 5'inki gerçekten
    "İdenfit Çerez Aydınlatma Metni v4" — Info sözlüğüyle teyit edildi).
    Ayrıca madde 4'ün "Basvuru" → "Başvuru" yazım hatası düzeltildi ve
    PDF'i v1'den v2'ye güncellendi (**EN/IT zaten v2 kullanıyordu, TR
    böylece hizalandı** — TR'nin v1'de kalmış olması ayrı bir sessiz
    tutarsızlıktı). **Yan etki, bilinçli:** 3↔5 başlık takası sayfadaki
    KONU SIRASINI değiştiriyor (artık Çalışan 3., Çerez 5.), bu yüzden TR
    ile EN/IT'nin madde sırası farklılaştı — her başlık kendi doğru
    belgesiyle eşleştiği için kabul edildi.
    **Uygulanan (yalnızca TR — kullanıcı kararı):**
    - 2 yeni PDF temiz/ASCII adlarla eklendi (Görsel bağımlılık kuralı —
      hotlink YOK, göreli URL):
      `public/wp-content/uploads/2026/10/bilgi-guvenligi-politikasi.pdf`
      (2 sf) ve `.../2026/10/veri-sahibi-basvuru-formu.pdf` (5 sf).
    - **TR listesi ARTIK ham `misc-pages.json`'dan DEĞİL, açık bir
      `SECURITY_TR_OVERRIDE` dizisinden geliyor** (`miscPagesTranslationOverrides.ts`,
      `SECURITY_IT_OVERRIDE`'ın AYNI kanıtlanmış deseni). Gerekçe: 6
      maddenin 4'ü düzeltme gerektiriyordu — nokta nokta yama yerine
      listeyi tamamen açık yazmak hem daha güvenli hem gözden geçirilebilir.
      Ham `misc-pages.json` DEĞİŞTİRİLMEDİ (proje ilkesi: ham export kaynak
      veri, düzeltme kodda).
    - **İlk turun `SECURITY_ITEM_URL_REPLACEMENTS` haritası KALDIRILDI** ve
      `resolveSecurityItemUrl()` eski sade hâline döndü. Açık listeye
      geçince gerek kalmadı — **ve NFD tuzağı da tamamen ortadan kalktı:**
      nihai 6 URL'in HİÇBİRİ Türkçe "İ" içermiyor (hepsi ASCII), oysa ham
      veride bu harf PARÇALANMIŞ (NFD: `I` + U+0307) biçimdeydi ve
      Açık nokta #45'teki kırılganlığı taşıyordu.
    - Eski dosyalar SİLİNMEDİ (`..._İs_Ortagi_..._v3.pdf` ve
      `veri_sahibi_basvuru_formu.pdf` artık öksüz, 0 referans) — 6. madde
      turunda gerekebilir.
    EN/IT'nin 2. maddesi (`information_security.pdf`, `bilgi_guvenligi.pdf`
    ile byte-birebir aynı ESKİ PL.01 belgesi) kullanıcı kararıyla
    DOKUNULMADI; İngilizce sürüm geldiğinde ayrı bir turda ele alınacak.
    **Nihai TR durumu — 5/6 madde başlık↔belge olarak TAM eşleşiyor,
    tek kalan 6. madde** (başlık "İş Ortağı Aydınlatma Metni", belge
    "PL.01 Kalite ve Bilgi Güvenliği YS Politikası"); gerçek TR İş Ortağı
    PDF'i repoda hâlâ YOK, sağlanması + hukuk onayı gerekiyor.
    **Doğrulama:** `astro check` 0 hata (431 dosya), `astro build` temiz
    (3164 HTML, ayrı `dist-check` çıktısına — çalışan önizlemeye
    dokunulmadı), 11 regresyon script'inden 8'i sıfır sorun. Sıfır olmayan
    3'ü de BU TURDAN BAĞIMSIZ bilinen taban çizgileri:
    `check-heading-hierarchy` 5 (Açık nokta #36), `check-title-length` 3 +
    `check-meta-description-length` 1 (Açık nokta #70/#74'ün Keystatic
    yazıları). Build çıktısında TR'nin 6 maddesi + EN/IT'nin 6'şar maddesi
    tek tek listelenip yalnızca madde 2'nin değiştiği, diğer 17
    bağlantının BİREBİR aynı kaldığı doğrulandı; yeni PDF'in `dist`'teki
    kopyası kaynakla aynı (113.228 bayt, 2 sayfa, m156). Cache notu: yeni
    URL sıfırdan oluştuğu için bayat kopya riski YOK, Cloudflare cache
    temizlemeye gerek kalmadı (`/guvenlik/` yanıtı zaten
    `max-age=0, must-revalidate`).
    **PR öncesi `idenfit/master` merge'i sonrası TAM doğrulama TEKRARLANDI**
    (master 14 commit öndeydi — JSON-LD `inLanguage`/Organization `@id`
    turu + 3 Keystatic blog yazısı; merge ÇATIŞMASIZ, bu turun
    dosyalarına hiç dokunulmamıştı): `astro check` 0 hata, `astro build`
    temiz (3176 HTML — artış merge'in getirdiği 3 yazıdan),
    `check-json-ld` **0 geçersiz blok** (merge'in JSON-LD değişiklikleri
    bu turla uyumlu), 3 Güvenlik sayfasının 18 bağlantısı yeniden tek tek
    listelendi — yalnızca TR madde 2 değişik. `check-title-length` taban
    çizgisi 3→5'e çıktı ama **ikisi de merge'in getirdiği blog yazısı**
    (`dogum-izni-24-hafta-teklifi-ik-hazirlik` 45 karakter,
    `biyometrik-kart-mobil-giris-yontemi-secimi` 70 karakter) — Güvenlik
    sayfalarından hiçbiri listede YOK, Açık nokta #70'in yapısal
    noktasının bir kez daha tekrarı.
    **İkinci tur doğrulaması (3/4/5 + açık liste refactor'ü sonrası):**
    `astro check` 0 hata (431 dosya), `astro build` temiz (3176 HTML —
    sayfa sayısı DEĞİŞMEDİ), 11 regresyon script'i taban çizgisiyle
    BİREBİR aynı (aynı 4 bilinen bulgu: csp-sync CRLF/#78,
    heading-hierarchy 5/#36, title-length 5 + meta-description 1/#70) —
    **sıfır yeni regresyon**; 8 script'in bulgu listeleri tek tek tarandı,
    3 Güvenlik sayfasının HİÇBİRİ hiçbir listede YOK. Asıl doğrulama:
    her maddenin BAŞLIĞI ile bağlı PDF'in Info sözlüğündeki GERÇEK belge
    adı yan yana basıldı — TR'de 5/6 tam eşleşme, EN/IT'nin 12 maddesi
    birebir değişmemiş. "Basvuru" (şapkasız) TR sayfasının TAMAMINDA 0 kez
    geçiyor. **`audit-remote-hotlinks.mjs` 950 sayfa/64 URL raporluyor ama
    bu bir REGRESYON DEĞİL** (#45'in "0/0" ölçümü `site` alanı BOŞKEN
    alınmıştı): ölçüldü — sitede `<img src>` hotlinki olan **0 sayfa** var,
    64 URL'in tamamı JSON-LD `logo` ve OG/Twitter `image` meta
    etiketlerinde, yani mutlak URL'in schema.org/OG tarafından ZORUNLU
    kılındığı bağlamlarda; referans edilen dosyaların hepsi
    `public/wp-content/uploads/` altında AYNI yolda mevcut, dolayısıyla DNS
    geçişinden sonra kendi sitemize çözülecekler. **Gelecek oturumlar için
    not:** bu script literal çalışıyor (`idenfit.com/wp-content` geçen her
    dizeyi işaretliyor), bulgu çıktığında önce `<img src>` mi yoksa
    JSON-LD/OG mu olduğuna bakılmalı.
78. **YENİ (2026-10-02), ORTAM KAYNAKLI YANLIŞ ALARM — `check-csp-sync.mjs`
    bu Windows checkout'unda HER ZAMAN exit 1 veriyor, gerçek bir CSP
    sapması YOK.** Script `public/_headers`'ı `src/data/csp.ts`'ten üretilen
    metinle HAM string olarak karşılaştırıyor, satır sonlarını normalize
    ETMİYOR. `git config core.autocrlf` = **true** olduğu için checkout
    dosyayı CRLF'e çeviriyor (diskte 33 CRLF satır), üretilen beklenen
    metin ise LF — sonuç: **33 satırın TAMAMI "ayrışmış" raporlanıyor**,
    ama satır sonu normalize edilince içerik BİREBİR AYNI (doğrulandı:
    HEAD blob'u 33 yalnız-LF satır, `git diff -- public/_headers` BOŞ).
    **Canlı ETKİLENMİYOR** — deploy edilen, commit'teki LF sürümü.
    **`--fix` ÇALIŞTIRILMAMALI:** dosyayı yeniden yazsa bile autocrlf
    sonraki checkout'ta tekrar CRLF'e çevirir, yani sorun geri gelir ve
    arada gereksiz bir diff oluşur. **Kalıcı çözüm için öneri (ayrı tur):**
    ya `check-csp-sync.mjs`'in karşılaştırmasını `.replace(/\r\n/g,'\n')`
    ile normalize etmek, ya da `.gitattributes`'a `public/_headers text
    eol=lf` eklemek (ikincisi `generate-csp-headers.mjs` ile de tutarlı
    olur). **Pratik sonuç:** bu script bir CI/PR gate'ine bağlanırsa
    Windows'ta gate'i KIRAR — Açık nokta #50'deki `check-heading-hierarchy`
    istisnasıyla AYNI sınıf.
79. **YENİ (2026-10-03), İÇERİK/VERİ SORUSU — müşteri sayısı rakamı
    netleşmedi; şimdilik "1.000+" KALIYOR, rakama DOKUNULMAYACAK.**
    Sitede onaylı rakam **"1.000+"**. 2026-08-29/30 turunda bir ara
    **"5.000+"** denmişti ama kaynağı/doğruluğu netleşmedi; o turda
    KARAR 1 gereği uydurma rakam yazılmayıp "1.000+" ile devam edilmişti.
    **Karar (kullanıcı, 2026-10-03): "1.000+" kalsın, güncelleme TALEP
    GELİRSE yapılacak.** Bir hata kaydı DEĞİL, bilinçli bekleme durumu.
    **Rakam gerçekten güncellenecekse MERKEZİ BİR SABİT YOK — 4 ayrı
    yerde, toplam 12 noktada geçiyor** (bu tur ölçüldü):
    - `hero.presentationTrustCaption` — `src/i18n/{tr,en,nl,it,az}.ts`
      (5 dil, Online Sunum Talebi'nin güven cümlesi).
    - `home.logoStrip.caption` — `src/i18n/{tr,en,nl,it,az}.ts` (5 dil,
      ana sayfa logo şeridi).
    - `LandingPage.astro:57` — hardcoded TÜRKÇE dize (`/demo`, i18n'e
      hiç bağlı değil, sayfa `noindex`).
    - `LandingStatStrip.astro:17` — hardcoded `target: 1000` (animasyonlu
      sayaç; metin değil SAYI, bul-değiştir ile yakalanmaz).
    **⚠️ Rakamın YAZIMI şu an kendi içinde tutarsız** (ayrı/küçük bir
    bulgu, bu turda düzeltilmedi): `logoStrip.caption` tr/it/az'da
    ayırıcısız **"1000"**, nl'de **"1.000"**, en'de **"1,000"**;
    `presentationTrustCaption` ise tr/nl/az/it'te **"1.000"**, en'de
    **"1,000"**. Yani aynı rakam aynı dilde iki farklı biçimde
    görünebiliyor — rakam turu yapılırsa biçim de birlikte
    standartlaştırılmalı.
80. **YENİ (2026-10-04), ÖLÇÜLDÜ AMA KÖK NEDEN KANITLANMADI — blog
    `.md` dosyalarının ÇALIŞMA KOPYASINDA satır sonları karışık
    (465/640 dosya), #78'in aynı sınıfı.** `uncategorized-tr`
    temizliği turunda tesadüfen fark edildi (o düzeltmenin SEBEP
    OLMADIĞI izole edilerek kanıtlandı — dokunulmayan dosyalarda da
    aynı durum var).
    **Ölçüm (çalışma kopyası, 640 blog `.md`):** karışık (CRLF+LF)
    **465**, saf CRLF **175**, saf LF 0. Karışık dosyaların HER
    BİRİNDE tam **1** yalnız LF var ve konumu HER ZAMAN aynı:
    `featuredImage:` bloğundaki `image:` satırının sonu. Bu, Açık
    nokta #68'in (Keystatic self-hosted `fields.image()` göçü,
    2026-09-06) `scripts/migrate-featured-image-to-keystatic-field.mjs`
    script'inin `url:` → `image:` satırını yazarken `\r\n` yerine `\n`
    kullandığına işaret ediyor.
    **⚠️ AMA MEKANİZMA TAM OLARAK KANITLANMADI, çelişkili ölçüm var:**
    `git show HEAD:<dosya>` ile bakıldığında 640/640 blob TEK TİP
    görünüyor (karışık yok) — `core.autocrlf=true` commit'te normalize
    ettiği için beklenen de bu. Ama blob tek tip LF ise checkout'un
    TAMAMINI CRLF'e çevirmesi gerekirdi; 465 dosyanın kısmen çevrilmiş
    olması bu açıklamayla UYUŞMUYOR. Yani ya blob ölçümüm (toplu
    `execSync` döngüsü, hata yakalama yoktu) yanıltıcı ya da git'in
    checkout dönüşümünde hesaba katmadığım bir koşul var. **Sonraki
    tur önce bunu netleştirmeli**, düzeltmeye geçmeden.
    **Bugünkü ETKİ — canlıyı etkilemiyor, ama bir tuzak:** commit
    edilen hal temiz (`git diff --numstat` satır-sonu gürültüsü
    göstermiyor, repo LF saklıyor), site çıktısı etkilenmiyor. Risk
    ARAÇLARDA: `check-csp-sync.mjs` gibi HAM STRING karşılaştıran bir
    araç blog dosyalarına bakacak şekilde genişletilirse #78'in
    birebir aynısı sahte "sapma" raporu üretir. Ayrıca bir script
    blog `.md`'lerini yeniden yazarken satır sonlarını normalize
    EDERSE, 465 dosyada gerçek değişiklik olmadan devasa bir diff
    oluşur.
    **Muhtemel kalıcı çözüm (ayrı tur):** `.gitattributes`'a
    `src/content/blog/*.md text eol=lf` (veya proje genelinde `* text=auto
    eol=lf`) eklemek — hem checkout'u deterministik yapar hem #78'in
    `public/_headers` sorununu da aynı mekanizmayla çözer. Kapsam
    geniş olduğu için (465+ dosya tek seferde yeniden checkout edilir)
    bilinçli olarak ayrı bir tura bırakıldı.

### Kapanmış maddeler — tek satır özet (tam anlatım arşivde)

Numaralar KORUNDU çünkü yukarıdaki açık maddeler bunlara atıfta bulunuyor.
Tam anlatım: `docs/claude-md-archive-2026-10-03.md` (ve daha eski maddeler
için önceki tarihli arşivler).

**3,4,5,7,11,17,18,23,26** (daha eski arşivlerde): promo görsel bulundu,
blog 622/622 tamamlandı, Podcastler kaldırıldı, Gizlilik ve Güvenlik
Politikası migrate edildi, HR Olgunluk Testi kuruldu, Online Sunum Talebi
onaylandı, navbar BLOG linki kaldırıldı, Demirbaş/Seyahat mega-menüye
bilinçli eklenmedi, erişilebilir adı olmayan `<a>` linkleri düzeltildi.

| # | Kapanış | Özet |
|---|---|---|
| 12 | 2026-10-03 | HR Maturity Test PDF gönderimi — BAYAT kayıt; `src/pages/api/maturity-pdf.ts` + SendGrid akışı çalışıyor (bkz. §İK Dijital Olgunluk Testi). |
| 14 | 2026-08-30 | 622 blog yazısının 976 görseli indirilip yerelleştirildi + 1039 URL göreliye çevrildi; blog artık `idenfit.com` domainine SIFIR bağımlı. Script'ler: `download-blog-images.mjs`, `relativize-blog-image-urls.mjs`, `download-report-assets.mjs`. |
| 16 | 2026-09-02 | Blog "yeni yazı senkronizasyonu" artık otomatik DEĞİL — yeni yazılar Keystatic panelinden ekleniyor, `post-sitemap.xml` karşılaştırma zinciri kullanılmıyor (bkz. #66). |
| 19 | 2026-10-03 | "Faz 2 CMS: Decap" — BAYAT karar; Keystatic canlı ve panelden yazı yayınlanıyor (bkz. §KEYSTATIC GEÇİŞİ, #68). |
| 24 | 2026-08-17 | DOM boyutu: `MobileMenu` masaüstünde+mobilde lazy-mount (`hasOpened`), 1587→1327 element (−%16,4). MegaMenu bilinçli ertelendi → #25. |
| 28 | 2026-08-25 | Blog `<title>` uzunluğu: 409 → 1 sorunlu sayfa (yalnızca kasıtlı kapsam dışı `admin/index.html`). 404 yazıya `metaTitle`, 25'lik pilot onaylı + script destekli üretim, benzerlik taramasıyla 2 gerçek hata yakalandı. **Panelden yayınlanan yeni yazılar bu taban çizgisini yeniden kirletiyor → #70.** |
| 31 | 2026-10-03 | Canonical URL — BAYAT kayıt; `astro.config.mjs:167` `site: 'https://idenfit.com'` dolu, canonical+hreflang aktif (248 sayfa, #53'te ölçüldü). |
| 32 | 2026-08-19 | 3 küçük "No H2 subheadings" bulgusu (hukuki sözleşme, SSS, `nl/wereldwijd-merk`) kapandı. |
| 33 | — | Başlık SEVİYE ATLAMASI (44 sayfa): 38 blog (`normalizeHeadingLevels()`, cb35dac) + 2 hub + 1 hukuki sayfa. **Ana sayfanın 5 dildeki H1→H3'ü AYRI ve hâlâ açık → #36.** |
| 34 | 2026-08-14 | "No H3 subheadings": ~%49'u bizde hiç olmayan WP arşiv URL'leri. Gerçek düzeltmeler `ProductPage` SSS accordion (`<span>`→`<h3>`, ~96 sayfa), `BlogListPage`/`BlogSidebar`, `ContactPage`. `AboutPage`/`SecurityPage`'e bilinçli EKLENMEDİ. |
| 35 | 2026-08-20 | TR ana sayfasındaki çift `ProductPreviewWidget` — alttaki "Panelinizde Sizi Neler Bekliyor?" bölümü kaldırıldı (bfa6c15), hero'daki kaldı. |
| 45 | 2026-09-02 | Blog+navigation DIŞINDAKİ 293 benzersiz hotlink (307 sayfa) temizlendi → **0/0**. Yol (A) 19 sabit-kodlu dosya (`localize-remaining-hotlinks.mjs`), yol (B) paylaşılan `src/data/relativizeWpUrls.ts`'in `deepRelativizeWpUrls()`'ü ham JSON ağacını import anında göreliye çeviriyor. Unicode NFD/NFC tuzağı: uzak istek `encodeURI(path.normalize('NFC'))`, YEREL ad normalize EDİLMEZ. **Denetim script'i bugün 64 URL raporluyor ama regresyon DEĞİL — hepsi JSON-LD `logo`/OG `image`, mutlak URL zorunlu; bkz. #77'nin kapanış notu.** |
| 47 | 2026-09-02 | 5 form dosyasının `console.log`'u kaldırılıp gerçek `/api/lead`'e bağlandı. |
| 50 | 2026-08-31 | "pipefail eksikliği": projede pipe kullanan script YOK, düzeltilecek hedef yoktu. **Kalıcı disiplin §Proje kuralları'na taşındı** (build çıktısı `tail`/`grep`'e yönlendirilecekse `set -o pipefail` şart; 8 `check-*.mjs`'in exit kodu konusu → #36/#78). |
| 51 | 2026-08-31 | Widget i18n Tier 1 (yapısal arayüz metni) 5 dilde: `productPreviewWidgetLabels.ts`, `LabelsContext`/`useLabels()`, `buildTabs(labels)`. `Partial<Record<Locale,X>>` kullanıldı (KARAR 1 — uydurma çeviri yok). Tier 2 → #55–#59. |
| 52 | 2026-08-31 | `check-html-lang-attribute.mjs`'in 196 "sorunlu sayfa"sı GERÇEK regresyon değil, script bug'ıydı: `output:'server'` geçişinde çıktı `dist/client/` altına sarıldı, `parts[0]` her zaman `"client"` olup beklenen locale `tr`'ye düşüyordu. `DIST_DIR` varsayılanı `dist/client` yapıldı. |
| 53 | 2026-10-03 | `check-hreflang.mjs`'in "dormant" bug'ı — tetikleyici koşul (`site` dolu) gerçekleşti, **build+script ile doğrulandı: 248 hreflang sayfası, 0 sorun, exit 0.** Script'te `DIST_DIR ?? 'dist/client'` zaten uygulanmış. |
| 54 | kısmen | Widget tarafı kapandı (sabit `MONTH_ABBREV`/`WEEKDAY_ABBREV`/`formatDecimal()` tablolarına geçildi). **Site-geneli `dates.ts` riski HÂLÂ AÇIK — yukarıdaki #54'e bkz.** |
| 55–59 | 2026-08-31/09-01 | Widget i18n Tier 2, sekme sekme 5 dilde: İzin Yönetimi (#55), İnsan Kaynakları (#56), Performans Yönetimi (#57), Veri Analizi (#58), paylaşılan header panelleri (#59). Desen: yapısal veri sabitlerde kalır, çeviri İNDEKS SIRASIYLA render'da birleşir (`getXLabels(locale)`, `LocaleContext`). |
| 60 | 2026-09-01 | Duyuru barı artık yalnızca `scrollY === 0` iken görünüyor (kaynağın davranışı), scroll YÖNÜ mantığı kaldırıldı. |
| 61 | 2026-09-01 | 2 İK hub'ının hero görseli eksikti — `HubBlock`'a `image` alanı + `getHeroImage(trSlug, locale)` + `HERO_IMAGE_ALT` (4 dil, gerçek açıklayıcı alt metin). Görseller yerelleştirildi. |
| 62 | 2026-09-02 | Dil değiştiricide az/it için sistemik 404: `localeUrls`'te locale hiç yoksa `computeGenericLocaleUrls()` anlamsız URL üretiyordu. 5 dosyada `if (!result.az) result.az = result.tr;` deseni (NL'nin 2026-07-22'deki düzeltmesinin az/it'e genişletilmiş hali). |
| 63 | 2026-09-02 | İşe Alım Modülü canlı siteyle uyumsuzdu — sayfa Hiringoz'a yeniden markalanmış; TR/EN/IT verbatim toplandı, NL/AZ profesyonel çeviriyle üretildi, 8 görsel yerelleştirildi. |
| 64 | 2026-09-02 | #63'ün devamı: hero `background-image` + "hiringoz" rozeti kaçırılmıştı, bölüm görselleri bir kaydırma hatasıyla yanlış atanmıştı. `ProductBlock`'a `reverse`/`backgroundImage`, `ProductPage`'e `heroLayout`/`heroPartnerLogo` (opt-in). **Yakalanan gerçek bug:** `resolveBlock()` yeni alanları passthrough etmiyordu. |
| 65 | 2026-09-02 | Tek gecede birçok küçük/orta bulgu: homepage font büyütme, Destek Talebi hero gradyanı+yıldızlar, Teşekkürler sayfası (autoplay opt-in, AZ sayfası eklendi), **yeni "Partnerlerimiz" bölümü** (13 logo, kendi resmi sitelerinden), mobil menüde dil değiştiricinin yukarı taşınması, Online Sunum Talebi'nin 2 hardcoded-Türkçe component'inin i18n'e bağlanması. |
| 66 | 2026-09-02 | Son blog senkronizasyonu: 622→629 yazı. **2 gerçek bug:** (a) WP'nin ZAMANLANMIŞ yayın akışında `modified < date` kalabiliyor → `effectiveModifiedDate` (JSON-LD/OG/görünür banner tek kaynaktan); (b) 7 yazının `<title>`'ı aşıyordu → `metaTitle`. |
| 67 | 2026-09-02 | Mobil widget: Seçenek A (mobil düzeni ölçekle) önce uygulandı, sonra kullanıcı ısrarıyla **Seçenek B** (masaüstü düzenini küçült) benimsendi. Güvenlik ağı: `mobil-widget-secenek-a-yedek` dalı. **Mimari §Mimari'ye taşındı** (container-query, 3 katman, alt sınır yok). |
| 68 | 2026-09-06 | Keystatic self-hosted `fields.image()`: 628 yazının görseli `public/img/blog-featured/<slug>/`'a taşındı, frontmatter `url:`→`image:` (dosya başına 1 satır). **Windows MAX_PATH sınırı canlı yakalandı** → sabit `featured.<uzantı>` adı. Keystatic asset alanları yolu entry slug'ıyla ad alanına ayırıyor (`getSrcPrefix()`). Panelde 2 uçtan uca test. *Kapsam dışı: gövde içindeki eski `![](...)` referansları migrate edilmedi — göreli yollar çalışıyor, yalnızca panel image alanıyla yönetilmiyorlar.* |
| 74 | 2026-09-22 | Fiyatlar: KOBİ paketi sabit fiyat yerine Pro gibi "Teklif Al" + "Başvur" formuna yönlendiriyor, **5 locale'in hepsinde**. `PRO_QUOTE_TEXT`→`QUOTE_TEXT`, `SME_PRICE_OVERRIDE`→`SME_CTA_OVERRIDE`. Son yayınlanmış fiyatlar kayıt için: TR 7.999 ₺/ay, EN/NL/IT/AZ 149 €. |

---

## Tamamlanan işler — kısa kronolojik özet

Tam süreç/kök-neden/ölçüm anlatıları için tarihli arşiv dosyalarına
bakılabilir (nadiren gerekir): `docs/claude-md-archive-2026-08-18.md`
(2026-08-13→08-19 tam günlük), `docs/claude-md-archive-2026-08-13.md`
(2026-08-06→08-13), `docs/claude-md-archive-2026-08-06.md`
(2026-07-21→08-06), `-07-31.md`, `-07-28.md`, `-07-23.md` — ve
**`docs/claude-md-archive-2026-10-03.md` (2026-08-19→2026-10-02 tam
günlük + kapanmış 32 açık noktanın TAM anlatımı).**

- **2026-09-02:** Lead kalıcılığı Cloudflare D1'e bağlandı (#73); Fiyatlar
  KOBİ paketi "Teklif Al"a çevrildi (#74); son blog senkronizasyonu,
  622→629 yazı (#66); mobil widget container-query mimarisine geçti (#67);
  dil değiştiricinin az/it 404 bug'ı düzeltildi (#62); İşe Alım Modülü
  Hiringoz içeriğiyle yeniden yazıldı (#63/#64); tek gecede ~10 küçük/orta
  UI bulgusu (#65); 6 formun tamamı gerçek `/api/lead` backend'ine
  bağlandı (#47) — SendGrid anahtarı hâlâ bekleniyor.
- **2026-09-01:** Widget i18n Tier 2 tamamlandı (Performans Yönetimi,
  Veri Analizi, paylaşılan header panelleri — #57/#58/#59); duyuru barı
  kaynağın `scrollY === 0` davranışına çevrildi (#60); 2 İK hub'ının
  eksik hero görseli eklendi (#61).
- **2026-08-31:** Widget i18n Tier 1 + Tier 2'nin ilk 3 sekmesi 5 dile
  genişletildi (#51/#55/#56); `check-html-lang-attribute.mjs`'in 196
  sahte bulgusu script bug'ı olarak çözüldü (#52); runtime `Intl`'in
  `az-AZ`'da bozuk olduğu ölçülüp sabit tablolara geçildi (#54);
  `pipefail` denetimi (#50); MegaMenu DOM boyutu 3 alternatifle yeniden
  araştırılıp aynı sonuca varıldı (#25).
- **2026-08-30:** Blog + mega-menü görselleri TAMAMEN yerelleştirildi,
  976 görsel + 1039 URL (#14); sitenin geri kalanındaki 293 hotlink'in
  kapsamı netleştirildi (#45, 2026-09-02'de kapandı).
- **2026-08-29/30:** Online Sunum Talebi sayfası 6 geri bildirim turunda
  baştan tasarlandı (2 adımlı form, timeline + özellik grid'i, logo
  şeridi). Bu turdan çıkan site-geneli `heroBackground` prop'u → §Mimari.
- **2026-08-29:** Blog göçü tamamlandı — 622/622 yazı `.md`'ye taşındı,
  `posts.json` boşaldı; migrasyon script'inde 3 sessiz veri kaybı
  (cite/sup unwrap, eksik `metaTitle`/`modifiedDate`/`authorName`,
  düşen `aria-label`) pilot turda yakalanıp düzeltildi.
- **2026-08-24:** BreadcrumbList altyapısı kuruldu (19 şablon, görünür
  `<nav>` + JSON-LD tek kaynaktan → §Mimari); "İdenfit ile Fark
  Yaratanlar" carousel'i çok turlu revizyondan geçti (video kartları
  arka planda sessiz döngü, 9 kart); GEO bulgu ailesi (author
  attribution `Person`/`Organization`, 4 H2 soru formatına, 35 dış
  kaynak `<cite>` ile işaretlendi); ürün sayfalarının bölüm CTA'ları
  gerçek butona çevrildi; hero'ya Personio referanslı kırmızı alt-ton.
- **2026-08-23:** Blog yazılarına `SpeakableSpecification` eklendi (622
  yazı, `#post-title` + `.post-content` hook'ları); Fiyatlar ve Online
  Sunum Talebi sayfalarının mobil görünümü düzeltildi (akordeon deseni,
  sıra/kontrast bug'ları); "viewport meta" ve "og:description" SEO
  bulguları incelenip ZATEN KAPALI bulundu (kod değişikliği yok).
- **2026-08-22:** `Organization` JSON-LD sıfırdan kuruldu, `sameAs` 7
  gerçek sosyal profili `FOOTER_SOCIAL`'dan TEK kaynaktan alıyor
  (LinkedIn'in kanonik `/company/idenfithr/` adresi de bu turda
  düzeltildi); blog "zamirle başlayan bağımlı ilk paragraf" denetimi
  14/14 madde kapandı.
- **2026-08-21:** Azerbaycan dili (az) 5. locale olarak eklendi ve aynı
  oturumda tüm site kapsamına genişletildi (#37) — 44 yeni sayfa, yeni
  `sectorTranslationOverrides.ts`/`productTranslationOverridesAz.ts`/
  `hubTranslationOverridesAz.ts`; widget'a otomatik sekme gezinmesi.
- **2026-08-20:** Ürün Önizleme widget'ının dış boyutu Personio
  referansına göre kısaltıldı (paylaşımlı `min-h`→sabit `max-h`+iç
  scroll) + TR ana sayfasındaki tekrarlı ikinci widget kaldırıldı, Açık
  nokta #35 kapandı. Ayrıca HRTech Alliance partner bölümü ana
  sayfadan (4 dil) kaldırıldı, yan bulgu olarak Açık nokta #36 açıldı.
  Ayrıca "Neden idenfit?" videosu + 4'lü özellik kartı yazıları canlı
  idenfit.com'da ölçülen gerçek px değerlerine göre büyütüldü, ve
  "Kullanıcı Dostu Panel" bölümündeki 2. lead-capture form kaldırıldı
  — bkz. yukarıdaki "Güncel durum".
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
  (`Astro.site` 2026-09-02'de dolduruldu, artık aktif — eski Açık nokta
  #31/#53). "Large DOM size" bulgusu KAPANDI (MobileMenu mobilde de
  lazy-mount, eski Açık nokta #24). "Multiple H1 tags" incelendi,
  sorun yok. "No visible content dates" GEO bulgusu kapandı
  (`LastUpdated` component, 91+ ürün/48 sektör/14 hukuki/Donanım/
  Fiyatlar/Destek Talebi/Teşekkürler sayfası, sayfa ALTINA yerleştirildi).
  "Few H2 subheadings" kapandı (SSS kategori panelleri, 12 sektör "Bu
  Sektöre Özel Modüller" başlığı, Hesaplama Araçları).
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
  stray `<h1>` için 2 katmanlı render-time güvenlik ağı kuruldu.
- **2026-08-11:** İletişim sayfası 6 eksik bölümle tamamlanıp 5 takip
  turunda pixel-doğrulamalı düzeltildi. Özel 404 sayfası (4 dil).
  KVKK/hukuki sayfa ailesi (14 sayfa) canlı siteyle eşleştirildi.
  Header/marquee container bug'ı + boyut/renk/sonsuz-döngü düzeltmesi.
  Site geneli `alt` metni denetimi tamamlandı.
- **2026-08-10:** JSON-LD sıfırdan kuruldu (yalnızca blog, 622 yazı).
  `<title>` uzunluk denetimi (194 blog-dışı sayfa). Meta description
  uzunluk denetimi (43 sayfa). Erişilebilir-ad-yok `<a>` link denetimi
  (19 ihlal, blog içeriği). Site geneli DOM boyutu taraması +
  `MobileMenu` masaüstü düzeltmesi. Landing Page (`/demo`) geliştirme
  turu.
- **2026-08-06/07:** Landing Page (`/demo`) pilot iskeleti kurulup gerçek
  ürün içeriğiyle zenginleştirildi, sonra görsel olarak yükseltildi
  (f21f863 ile 08-11'de tamamlandı).
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
   bizim canonical slug'ımıza (`online-sunum-talep-et`, `DEMO_CTA_URL`
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
- **`BaseLayout`'un 2 opsiyonel prop'u — ikisi de OPT-IN, verilmezse
  diğer TÜM sayfalarda davranış DEĞİŞMEZ:**
  - **`breadcrumb?: BreadcrumbItem[]`** (`BaseLayout.astro:102`) —
    çağıran yalnızca "Ana Sayfa" SONRASI izi geçirir; `t.common.home` +
    `getRelativeLocaleUrl()` BaseLayout içinde OTOMATİK eklenir (tek
    kaynaktan besleme). Görünür `<nav aria-label="Breadcrumb">` H1'in
    üstünde, `BreadcrumbList` JSON-LD AYNI `breadcrumbTrail`'den üretilir
    — ikinci bir veri kaynağı YOK. 19 şablon kullanıyor. **Hiyerarşi 2
    seviyeli** (Ana Sayfa > [Sayfa]); **blog istisna** (Ana Sayfa > Blog >
    [Yazı]) çünkü yalnızca `/blog/` gerçek/tıklanabilir bir sayfa.
    "Ürünler"/"Sektörler" gibi gerçek landing sayfası OLMAYAN ara
    segmentler EKLENMEZ (kırık/işlevsiz link üretmemek için — kaynaktaki
    aynı gerekçe). `NotFoundPage`/`LandingPage` (`noindex`) bilinçli
    olarak breadcrumb'sız. Leaf etiketi YENİ metin İCAT EDİLMEDEN
    sayfanın zaten sahip olduğu gerçek başlıktan türetilir.
  - **`heroBackground?: string`** (`BaseLayout.astro:117`) — breadcrumb'ı
    saran kutuya DÜZ renk uygular. Breadcrumb her sayfada beyaz zeminde
    render edildiği için, altında renkli/gradyanlı bir hero varsa
    aralarında görünür bir "dikiş" kalıyordu. Hero gradyanının TAMAMI
    değil yalnızca **0% rengi** verilir — iki ayrı kutuda aynı gradyanı
    hizalamaya çalışmak kırılgandır. Kullananlar:
    `PresentationRequestPage`/`SupportRequestPage` (`#FFDCDC`).
- **`.reveal` scroll-fade script'i OTOMATİK YÜKLENMEZ.** `BaseLayout`
  `src/scripts/scroll-reveal.js`'i HİÇ eklemiyor (içinde yalnızca
  JS-kapalı durumu için bir `noscript` notu var) — onu kullanan her sayfa
  `<script src="../scripts/scroll-reveal.js">` satırını ELLE ekler (5
  ana sayfa, blog, Landing, Müşteriler, Online Sunum Talebi, Blog
  listesi…). **`.reveal` kullanan yeni bir bölüm eklenip bu script
  eklenmezse bölüm KALICI GÖRÜNMEZ kalır** — sessiz hata, `astro build`
  ve regresyon script'leri YAKALAMAZ.

### Mobil ölçekleme — `ProductPreviewWidget` container-query mimarisi (kalıcı)
Widget mobilde yeniden AKMIYOR (reflow); masaüstü düzeninin KÜÇÜLTÜLMÜŞ
hali gösteriliyor (kullanıcı kararı, okunabilirlik ödünü bilerek kabul
edildi). Bu yüzden widget'ın iç kurallarının HİÇBİRİ viewport medya
sorgusu (`lg:`/`sm:`) DEĞİL, **Tailwind v4 container query'si**
(`@min-[1024px]:`/`@min-[640px]:` — arbitrary-value söz dizimi, çünkü
v4'ün varsayılan `@lg`/`@sm` container eşikleri viewport eşiklerinden
FARKLI). ÜÇ katman zorunlu (CSS containment: bir eleman kendi container
query'sinin hedefi OLAMAZ): `outerRef` (gerçek viewport'a bağlı konteyner
genişliğini ölçer; `items-start` şart — Flexbox'ın `align-items:stretch`
varsayılanı içeriği kırpıyordu) → `containerRef` (`@container` + sabit
`DESKTOP_NATURAL_WIDTH=1280` + `transform:scale()` + `flexShrink:0`) →
`innerRef` (asıl düzen; container query'leri burada). Ölçek yalnızca
ÜSTTEN sınırlı (`Math.min(1, widthScale)`) — **alt sınır YOK**, 1280px
tabanda bir alt sınır hiçbir telefona sığmaz ve `overflow-hidden`
tarafından kırpılır. **Yeni bir sekme/kart eklenirken `lg:`/`sm:`
KULLANILMAMALI** — mobilde sessizce yanlış düzen üretir. Tam gerekçe
`ProductPreviewWidget.tsx`'in ~2843. satırındaki yorum bloğunda.

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
(`kvk-protokol`/`kvk-protocol`), Online Sunum Talebi (`online-sunum-talep-et`,
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
  boşken 0 sayfa bulup bilgi amaçlı çıkar).
  **`check-blog-alt-text.mjs` (KALICI, 2026-09-10 — TEK İSTİSNA: `dist/`
  DEĞİL doğrudan `src/content/blog/*.md` frontmatter'ını tarar).** Öne çıkan
  görseli OLUP alt metni olmayan/boş yazıları listeler. Ayrı bir script
  olmasının nedeni: alt metni eksikse render yazının BAŞLIĞINA düşüyor,
  yani çıktıda `alt` her zaman dolu — `check-image-alt-text.mjs` bu sınıfı
  ASLA yakalayamaz.
  **`check-csp-sync.mjs` (KALICI, 2026-09-14 — `dist/` DEĞİL kaynak okur).**
  `public/_headers`'ın `src/data/csp.ts` ile ayrışmadığını doğrular; `--fix`
  ile `_headers`'ı yeniden üretir. CSP iki yerden servis edilmek zorunda
  (statik varlık katmanı + Worker middleware) ve bu iki kopya bir kez
  gerçekten ayrışmıştı.
  **`generate-csp-headers.mjs` (KALICI, 2026-09-14 — build SONRASI adım,
  `npm run build` zincirinde).** `dist/client/_headers`'taki script-src
  `'unsafe-inline'` iznini, sitede gerçekten bulunan inline script'lerin
  SHA256 hash'leriyle değiştirir. Bir check script'i DEĞİL, üretici.
  **Not:** bu SEKİZ
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
- **Exit code / `pipefail` disiplini (kalıcı, 2026-08-31'de ölçülerek
  öğrenildi — eski Açık nokta #50):** build/test çıktısı `tail`/`grep`
  gibi bir komuta YÖNLENDİRİLECEKSE önce `set -o pipefail` verilmeli.
  Canlı kanıtlandı: kasıtlı bozuk bir sayfayla `astro build 2>&1 | tail -5`
  build GERÇEKTEN çökerken `$?` **0** (başarılı!) döndü; `pipefail` açıkken
  AYNI komut doğru şekilde başarısız döndü. Alternatif: exit code'u pipe'tan
  ÖNCE `; echo $?` ile okumak. **Yalnızca son komutun durumuna
  GÜVENİLMEMELİ.** Aynı tuzağın somut bedeli: bu alışkanlık yüzünden
  `check-html-lang-attribute.mjs`'in 196 sahte bulgusu günlerce "sıfır
  regresyon" diye raporlandı (eski #52).
  **İlgili:** 8 kalıcı `check-*.mjs` script'i sıfır sorunda `exit 0`,
  HERHANGİ bir sorunda (bilinen/kabul edilmiş bir açık nokta olsa BİLE)
  `exit 1` veriyor. Bir CI/PR gate'i kurulacaksa bugün gate'i KIRACAK
  3 bilinen taban çizgisi var: `check-heading-hierarchy` (#36),
  `check-title-length`/`check-meta-description-length` (#70),
  `check-csp-sync` (Windows CRLF, #78) — ya bunlar kapatılmalı ya gate
  mantığı istisnaları hesaba katmalı.
- **Satır sonu kuralı (`public/_headers` ve CLAUDE.md gibi üretilen/
  karşılaştırılan dosyalar):** repo `core.autocrlf=true` ile checkout
  ediliyor; bir dosyayı script'le yeniden yazarken satır sonlarını
  KARIŞTIRMAMAK gerekiyor (karışık CRLF/LF, `check-csp-sync.mjs` gibi ham
  string karşılaştıran araçlarda sahte "sapma" üretir — bkz. #78).
  Doğrulama: `node -e "const s=require('fs').readFileSync(F,'utf8');
  console.log((s.match(/(?<!\r)\n/g)||[]).length)"` → 0 olmalı.
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
- **Görsel bağımlılık kuralı (2026-08-30'da GÜNCELLENDİ — eski
  "hotlink kabul edilebilir" yaklaşımının YERİNE geçti):** Önceden
  (`docs/remaining-work-report.md`'nin eski notu, bkz. Açık nokta #45)
  "ihtiyaç duyulan görsel canlı idenfit.com'dan hotlink ile bulunabilir,
  `uploads.zip`'i açmaya somut bir ihtiyaç yok" denilen bilinçli bir
  tolerans vardı. **Bu tolerans artık GEÇERSİZ.** Kural: yeni eklenen/
  düzenlenen HİÇBİR içerik `https://idenfit.com/wp-content/...`
  adresine hotlink YAPMAMALI — DNS geçişinden sonra `idenfit.com` YENİ
  siteye işaret edeceği için eski sunucudan görsel çekmeye güvenmek
  kendi kendini kıran bir bağımlılıktır (bkz. Açık nokta #14'ün kapanış
  günlüğü, ilk somut örnek). Yeni bir görsel eklenirken: dosya
  `public/wp-content/uploads/<YYYY>/<AA>/...` altına (WP'nin kendi
  yol yapısı korunarak) yerleştirilmeli, kaynakta `url:` alanı GÖRELİ
  (`/wp-content/uploads/...`) yazılmalı. Blog + mega-menü bu kurala göre
  TAMAMEN temizlendi (Açık nokta #14); sitenin geri kalanındaki mevcut
  ihlaller (~307 sayfa/293 benzersiz dosya) Açık nokta #45'te kayıtlı,
  kademeli olarak aynı kurala getirilecek. Doğrulama:
  `DIST_DIR=dist/client node scripts/audit-remote-hotlinks.mjs` (yeni,
  kalıcı — `astro build` sonrası sıfır sonuç vermesi hedef).
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
- **KALICI GOTCHA (2026-08-28) — Keystatic'in markdoc editörü SAVE anında
  DOKUNULMAYAN alanları bile yeniden yazıyor, bu SÜRPRİZ OLMAMALI.**
  Gerçek bir canlı test turunda (`idenfit-yatirim-duyurusu.md`'nin yalnızca
  `excerpt`'ine bir kelime eklenip Save'e basıldı) commit diff'i (`66fea5e`,
  git seviyesinde `74e3fca` ile revert edildi) 3 istenmeyen yan etki
  gösterdi:
  1. **Gövdede `&nbsp;` sızıntısı** — Markdown'daki 2 çift-boşluk sessizce
     `&nbsp;`'ye dönüştü (editör hiç dokunulmayan paragrafları da
     yeniden serileştiriyor).
  2. **`date`/`modifiedDate` saat dilimi damgası değişti** —
     `'2024-10-02T09:30:00'` (tırnaklı, saat dilimsiz/"naive") →
     `2024-10-02T09:30:00.000Z` (tırnaksız, UTC "Z" damgalı).
  3. **YAML biçimi değişti** (uzun string'ler `>-` katlanmış bloğa
     döndü, frontmatter kapanışından sonraki boş satır kayboldu) —
     `astro build`'i bozmuyor ama git diff'lerini kirletiyor.

  **#2'nin GERÇEK boyutu, Keystatic'in ötesinde site-geneli bir risk:**
  Node'un `new Date(string)`'i saat dilimsiz ("naive") bir string'i
  ÇALIŞTIĞI MAKİNENİN sistem saat dilimine göre yorumluyor — ampirik
  olarak doğrulandı (`node -e "new Date('2024-10-02T09:30:00').toISOString()"`
  bu makinede/Europe-Istanbul'da `2024-10-02T06:30:00.000Z` veriyor,
  UTC "Z" damgalı hali ise DOĞRUDAN `2024-10-02T09:30:00.000Z` — **tam 3
  saatlik fark**, `[slug].astro`'nun `date.toISOString()` çağırdığı HER
  yerde (JSON-LD `datePublished`/`dateModified`, OG `article:published_time`/
  `modified_time`, görünür `<time datetime>`) aynen yansıyor). Bu, yalnızca
  Keystatic'in bir yan etkisi DEĞİL — **`posts.json`'daki 618 legacy yazının
  TAMAMI hâlâ naive tarih formatı kullanıyor** (bkz. örnek: `date:
  '2026-07-03T15:18:47'`), yani bu yazıların SEO/GEO'ya giden gerçek UTC
  tarihleri, `astro build`'in ÇALIŞTIĞI ortamın sistem saat dilimine göre
  DEĞİŞKEN — yerel geliştirme makinesi (Türkiye, UTC+3) ile gerçek
  deploy/CI ortamı (Cloudflare Pages/Workers build container'ları
  TİPİK OLARAK UTC) FARKLI sonuç üretebilir. **Doğrulanmadı, kontrol
  edilmeli:** gerçek Cloudflare Pages build ortamının sistem saat dilimi
  — eğer UTC ise, 622 yazının TAMAMININ canlıdaki JSON-LD `datePublished`'i
  şu an bu makinedeki önizlemeden 3 saat farklı olabilir (İÇERİK
  değişmiyor, yalnızca makine-okunur tarih damgası — düşük ama gerçek bir
  SEO/GEO doğruluk riski). **Kalıcı çözüm için öneri (ayrı bir tur):**
  yeni/düzenlenen yazılarda tarih her zaman açık UTC ("Z" damgalı) veya
  açık ofsetli (`+03:00`) yazılmalı, naive format hiç kullanılmamalı.
  **`check-json-ld.mjs` bu sınıfı YAKALAMAZ** — yalnızca ISO 8601 SÖZ
  DİZİMİNİ doğruluyor (`^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|
  [+-]\d{2}:\d{2})$`), hem naive-yorumlanmış hem UTC-yorumlanmış değer
  `.toISOString()`'tan geçtikten SONRA HER ZAMAN "Z" damgalı çıkıyor —
  yani script FORMAT açısından ikisini de geçerli görür, DEĞER kaymasını
  (saat dilimi belirsizliğinden kaynaklanan) hiç fark edemez — bu KÖR
  NOKTA elle test edilip doğrulandı (bozuk hâli geçici olarak `astro
  build`'e sokup `check-json-ld.mjs` çalıştırıldı: **0 geçersiz blok**,
  ne `&nbsp;` sızıntısı ne tarih kayması yakalandı).

  **Sonuç — editörler panelden düzenleme yapmaya başladığında beklenmesi
  gerekenler:** (a) SAVE sonrası git diff'i "beklenenden büyük" görünebilir
  (yalnızca dokunulan alan değil, TÜM dosya yeniden biçimleniyor) — bu
  BOZULMA değil, editörün normal davranışı; (b) çift boşluk kullanan eski
  içerik `&nbsp;`'ye dönüşebilir — görsel etkisi yok (tarayıcı ikisini de
  aynı gösterir) ama kaynak metin değişir; (c) naive tarihli eski
  yazılar SAVE edilirse tarihleri UTC'ye kayabilir — yayın tarihini/saatini
  KORUMAK için editör Save'den ÖNCE tarih/saat alanını gözden geçirip
  gerekiyorsa elle düzeltmeli.
- **Vite bağımlılık önbelleği bozulması — KALICI ÇÖZÜM:**
  `astro.config.mjs`'in `vite.optimizeDeps`'i şu an ÜÇ katmanlı: `force: true`
  (her başlangıçta önbelleği sıfırdan kurar) + `include: ['react',
  'react-dom', 'react-dom/client', 'lucide-react', 'lottie-web',
  'astro/virtual-modules/i18n.js', 'astro/logger/json']`. **Elle
  `node_modules/.vite` silme adımı artık hiçbir senaryoda GEREKMİYOR.**
  **ÜÇÜNCÜ KATMAN (2026-08-29 eklendi) — canlı/runtime keşif kaynaklı YENİ
  bir alt sınıf bulundu:** `astro/virtual-modules/i18n.js` ve
  `astro/logger/json` (framework-içi sanal modüller, kullanıcı kodundan
  statik `import` ile hiç erişilemiyor — yalnızca `getRelativeLocaleUrl()`
  gibi runtime çağrılarıyla İLK GERÇEK sayfa isteğinde keşfediliyordu) `include`
  listesinde YOKTU. Sonuç: ana sayfaya (veya i18n kullanan HERHANGİ bir
  sayfaya) gelen İLK istek Vite'ın dev server ÇALIŞIRKEN "optimized
  dependencies changed, reloading" tetiklemesine yol açıyor, bu da SSR modül
  kaydını invalidate edip zaten yüklenmiş React-tüketen island'ların
  (`MegaMenu`/`LanguageSwitcher`/`MobileMenu`/`ProductPreviewWidget`/
  `CustomerStoryCarousel`/`YoutubeClickToPlay`) İKİ FARKLI React kopyası
  arasında kalmasına, "Invalid hook call"/`Cannot read properties of null
  (reading 'useState')` hatasıyla çökmesine yol açıyordu — **3 art arda
  `npm run dev:clean` denemesinde bile KENDİLİĞİNDEN düzelmedi** (önceki
  bilinen sınıfların aksine), kök nedeni `.astro/dev.log`'da ana sayfaya
  TEK bir `curl` isteği atılıp reload zincirinin canlı yakalanmasıyla
  bulundu. **Çözüm:** bu 2 modül de `include`'a eklendi, cold start'ta
  önceden paketleniyor — canlı yeniden-optimizasyon artık hiç tetiklenmiyor
  (temiz restart sonrası ana sayfa + 3 farklı sayfa `curl` ile ayrı ayrı
  denenip loglarda sıfır yeni "[optimizer]"/"Invalid hook call" olduğu
  doğrulandı). Kalan sınıf için iki kalıcı disiplin kuralı şart:
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

- **Git akışı — master'a DOĞRUDAN push YOK, PR üzerinden gidilir
  (kullanıcı kararı, 2026-09-06).** Değişiklikler bir dalda geliştirilip
  `master`'a **pull request** olarak açılır; merge kararı kullanıcıya/ekibe
  aittir. Gerekçe: bu turda 12 commit'lik bir iş (form backend'i, reCAPTCHA,
  e-posta şablonu, favicon, deploy altyapısı) master'a doğrudan fast-forward
  edilmişti — inceleme adımı atlanmış oldu, geriye dönük PR açmak da force
  push gerektirdiği için (Keystatic Cloud botu doğrudan bu repoya commit
  atıyor) yapılmadı. **İki pratik not:** (1) Keystatic panelinden yayınlanan
  yazılar `master`'a bot tarafından commit edildiği için, PR açmadan ÖNCE
  dala `master` merge edilip güncel tutulmalı; (2) canlıya çıkan build'in
  master ile aynı commit'te olduğu `git rev-parse` ile doğrulanmalı —
  canlıdaki worker'ın master'dan ayrışması bu turda gerçek bir risk olarak
  yaşandı (master 11 commit geriden geliyordu, o hâliyle build alınsa
  formlar/e-postalar sessizce kaybolurdu).
- **Analitik: GTM + doğrudan GA4, İKİSİ BİRDEN + Google Consent Mode v2
  (kullanıcı kararı, 2026-09-11).** `src/components/Analytics.astro` hem
  GTM konteynerini (`GTM-W5VTWD2`) hem GA4'ü (`G-ED2NJPGPD3`) yüklüyor.
  İki kimlik de KODA GÖMÜLÜ (gizli değer değil, kaynak kodda zaten görünür;
  gömülü olması build ortamında elle değişken tanımlama adımını ve o adım
  unutulursa analitiğin sessizce çalışmaması riskini ortadan kaldırıyor).
  Yalnızca `import.meta.env.PROD`'da yükleniyor, `astro dev` trafiği ölçüme
  karışmıyor.
  - **⚠️ ÇİFT SAYIM KOŞULU — kodla önlenemez, panelde korunmalı.** İkisinin
    yan yana durması tek başına sorun DEĞİL. Sorun yalnızca GTM
    konteynerinin İÇİNE de AYNI kimlikle (`G-ED2NJPGPD3`) bir "GA4
    Configuration" etiketi konursa çıkar — o zaman her sayfa görüntüleme
    iki kez sayılır. **GA4 yapılandırması kodda duruyor; GTM panelinde
    aynı kimlikle ikinci bir GA4 config etiketi OLUŞTURULMAMALI.** GTM,
    GA4 dışındaki etiketler (Ads dönüşüm, Meta, LinkedIn, özel event)
    için kullanılmalı.
  - **Kapsam:** bileşen `BaseLayout` VE `LandingLayout`'ın `<head>`'inde,
    yani 941 gerçek sayfanın TAMAMI kapsanıyor — tek tek sayfalara ekleme
    gerekmiyor (canlıda ana sayfa/fiyatlar/ürün/blog/EN/iletişim üzerinde
    doğrulandı).
  - **Yükleme sırası kritik:** `<meta charset>` → consent default (hepsi
    `denied`) → `gtag.js` → GTM → Cookie-Script. Tek `consent default`
    bloğu ikisini birden bağlıyor (aynı `dataLayer`/`gtag` kuyruğu).
  - **Dürüst sınır:** `wait_for_update: 500` yarışı DARALTIR, kapatmaz.
    Banner geç gelir veya bir reklam engelleyici durdurursa etiketler
    "denied"da ateşlenir: çerez yazmaz ama çerezsiz ping gider (Google'ın
    "advanced consent mode" davranışı). Ayrıca Consent Mode yalnızca
    Google etiketlerini bağlar — GTM'e Meta/LinkedIn eklenirse o etikette
    "Require additional consent for tag to fire" ELLE işaretlenmeli.
  - **⚠️ Elle adım:** Cookie-Script panelinde Consent Mode v2 AÇIK olmalı.
    Kapalıysa banner hiç `consent update` göndermez, ölçüm kalıcı olarak
    "denied"da kalır ve sessizce hiç veri toplamaz.
  - CSP (`public/_headers` + `src/middleware.ts`, İKİSİ BİREBİR AYNI
    tutulmalı) `googletagmanager` (script) ve `google-analytics`/
    `analytics.google.com` (img/connect) izinlerini zaten taşıyor. GTM'in
    `<body>` noscript iframe'i bilerek eklenmedi (Consent Mode'a uyamaz);
    istenirse CSP'ye `frame-src googletagmanager` gerekir.
- **Deploy OTOMATİK, `master`'a her push'ta — Cloudflare Workers Builds
  (kullanıcı kararı, 2026-09-10; önceki elle `npx wrangler deploy` kuralının
  yerine geçti).** Build komutu `npm run build:ci` (= `astro check && npm run build`, ve
  `build` = `astro build && node scripts/generate-csp-headers.mjs` — CSP
  inline-script hash'leri bu son adımda üretiliyor, bkz. Açık nokta #46), deploy komutu `npx wrangler deploy`. Bir PR merge edildiğinde
  `master`'a düşen push bunu tetikliyor; Keystatic panelinden yayınlanan
  yazılar da (`keystatic-cloud[bot]` doğrudan `master`'a commit atıyor) aynı
  yoldan canlıya çıkıyor. **Elle deploy artık gerekmiyor.**
  - **Bağlantının kendisi Cloudflare panelinden elle kurulur** — API ile
    yapılamıyor (`/accounts/{id}/builds/*` 401 veriyor, ayrıca repo bağlamak
    Cloudflare GitHub uygulamasının tarayıcıdan onaylanmasını gerektiriyor).
    Girilecek TÜM ayarlar + ilk build sonrası doğrulama listesi:
    **`docs/cloudflare-workers-builds.md`**.
  - **GitHub Actions DEĞİL.** 2026-09-10'da önce Actions ile kurulmuş ve
    çalıştığı doğrulanmıştı; kullanıcı kararıyla tamamen kaldırıldı
    (`.github/` silindi). Yeniden Actions eklenmemeli.
  - **PR gate YOK.** Workers Builds yalnızca deploy eder. 9 `check-*.mjs`
    regresyon script'i + `check-blog-alt-text.mjs` artık yalnızca ELLE
    çalıştırılıyor — bir PR gate istenirse ayrı bir karar gerekir.
  - **Saat dilimi ayarı GEREKMİYOR.** Açık nokta #43'ün "build makinesinin
    saat dilimine göre kayma" riski ÖLÇÜLEREK ÇÜRÜTÜLDÜ: prerender host
    Node'unda değil, adapter'ın prerender worker'ında (workerd, her zaman
    UTC) çalışıyor — host TZ çıktıyı hiç etkilemiyor. Kanıt tablosu
    `docs/cloudflare-workers-builds.md`'de.
  - **Dal build'inden deploy edilmez.** Doğrulanmış bir dal build'inden elle
    deploy etmek canlıdaki worker'ı master'dan ayrıştırıyor (2026-09-06'da
    gerçek bir risk olarak yaşandı, master 11 commit geriden geliyordu).
    Panelde non-production (preview) branch build'leri de KAPALI olmalı.

## Development
Dev server'ı arka planda başlat: `astro dev --background`. Yönetim:
`astro dev stop`, `astro dev status`, `astro dev logs`.

**`npm install`/`npm uninstall` çalıştırdıktan sonra** (dev server açık
olsun olmasın) `npm run dev:clean` ile yeniden başlatın. Üretim build
testi (`astro build`) sonrası dev server'a dönerken de aynı komut
kullanılabilir (`dist/` çıktısını da temizler).

## 🔶 AÇIK NOKTA (2026-08-30, 2026-09-02'de GÜNCELLENDİ) — Sitedeki 6 form
artık gerçek bir backend'e BAĞLI (kod tarafı tamam) ama SendGrid API
anahtarı HENÜZ YOK — bu yüzden pratikte hâlâ hiçbir e-posta göndermiyorlar,
yalnızca artık `console.log` yerine DÜRÜST bir hata mesajı gösteriyorlar.

**2026-09-02'de yapılan hazırlık (Açık nokta #2):**
- Yeni `src/pages/api/lead.ts` (`prerender:false`, gerçek SSR route) — 6
  formun TAMAMININ ortak varış noktası. Doğrulama, e-posta içeriği
  oluşturma, hata kodları TAM ve çalışır durumda; SendGrid'e gerçek
  istek yalnızca `SENDGRID_API_KEY` (+`SENDGRID_FROM_EMAIL`+
  `LEAD_NOTIFICATION_EMAIL`) tanımlıysa atılıyor, tanımlı DEĞİLSE 503
  dönüyor (sahte bir "başarılı" görüntüsü YARATILMIYOR).
- Cloudflare Workers runtime'ında Node'un `@sendgrid/mail` SDK'sı DEĞİL,
  SendGrid'in v3 REST API'sine doğrudan `fetch()` (yeni bir npm
  bağımlılığı eklenmedi). Env erişimi `Astro.locals.runtime.env` DEĞİL
  (bu adapter sürümünde — `^14.2.5` — KALDIRILMIŞ) — `import { env } from
  'cloudflare:workers'` (adapter'ın kendisinin de kullandığı güncel
  resmi desen, `npx astro check` ile bulunup düzeltildi). Yerel
  geliştirme için `.dev.vars.example` şablonu + `.gitignore`'a `.dev.vars`
  eklendi.
- Yeni paylaşılan `src/data/formLead.ts` (`submitLead()`) — 6 formun
  TAMAMI aynı `fetch()` mantığını tekrar YAZMIYOR, bunu çağırıyor.
- 5 form component'i (`HeroForm.tsx` [Hero+İletişim ikisi de],
  `LandingRequestForm.tsx`, `SupportRequestForm.tsx`,
  `PresentationRequestForm.tsx`, `HrMaturityTest.tsx`'in
  `EmailReportForm`'u) `console.log` çağrıları kaldırılıp gerçek
  `submitLead()` ile bağlandı — gönderim sırasında buton devre dışı +
  "Gönderiliyor…" metni, başarısız olunca GERÇEK bir hata mesajı
  (`common.formSubmitError`, yeni `Translations.common` alanı, 5 dilin
  hepsinde çevrildi). `SupportRequestForm.tsx` daha önce hiçbir yere
  yönlendirmiyordu (gerçek bir eksiklik) — artık `redirectHref` prop'u
  eklenip zaten VAR olan ama hiç bağlanmamış `SupportThankYouPage.astro`'ya
  bağlandı.
- reCAPTCHA v3 İSKELETİ: sunucu tarafı `verifyRecaptcha()` tam yazıldı
  (secret yoksa doğrulama atlanır, form akışı bozulmaz) — istemci tarafı
  widget'ı BİLİNÇLİ olarak eklenmedi (site key yok, CSP'ye
  `google.com/recaptcha`/`gstatic.com` eklemenin faydası yok), token her
  zaman `null` gönderiliyor. Site key gelince: (1) widget yükle,
  `grecaptcha.execute()` sonucu `submitLead()`'e geçir, (2) CSP'ye
  `recaptcha`/`gstatic` domain'lerini ekle — ikisi de `lead.ts`'in kendi
  yorumunda adım adım yazılı.
- **Doğrulama:** `astro build` + `npx astro check` (0 hata) temiz, 8/9
  regresyon script'i sıfır sorun (aynı ilgisiz heading-hierarchy taban
  çizgisi), gerçek tarayıcıda İletişim formu dolduruldu/gönderildi —
  gerçek `POST /api/lead` isteği (503, anahtar yok) + kullanıcıya gerçek
  hata mesajı gösterildiği doğrulandı.
- **SendGrid anahtarı gelince yapılacak TEK şey:** `.dev.vars`/Cloudflare
  Pages'e `SENDGRID_API_KEY`/`SENDGRID_FROM_EMAIL`/`LEAD_NOTIFICATION_EMAIL`
  yazmak — kod DEĞİŞMEYECEK.

Açık nokta #2'nin ("Faz 2 backend yok") eski, eksik listesi
(yalnızca Hero formu + HR Maturity Test'ten bahsediyordu) bu turda tam
taranıp genişletildi/güncellendi — kaynak kodda doğrulandı
(`grep console.log src/components/*.tsx`):

| Form (component) | Kullanıldığı sayfa(lar) | Durum |
|---|---|---|
| `HeroForm.tsx` | Ana Sayfa hero **VE** İletişim sayfası (ikisi de AYNI component'i reuse ediyor, `ContactPage.astro:66,183`) | `console.log`, backend yok |
| `LandingRequestForm.tsx` | `/demo` (Landing Page) | `console.log`, "raporunuz e-postanıza gönderildi" mesajı gösteriyor ama hiçbir yere gönderilmiyor |
| `SupportRequestForm.tsx` | Destek Talebi (`/destek-talebi/`) | `console.log`; teşekkür sayfasına (`tesekkurler-destek`) bağlantı da bilinçli olarak kurulmadı (bkz. Açık nokta #10) |
| `HrMaturityTest.tsx` | Dijital İK Olgunluk Testi sonuç ekranı | `console.log('HR Maturity Test — rapor talebi:', ...)`, "raporu e-postama gönder" butonu |
| `PresentationRequestForm.tsx` | Online Sunum Talebi | `console.log('Online Sunum Talebi formu gönderildi:', ...)` — **kullanıcının orijinal 5'lik listesinde yoktu, bu taramada bulunup eklendi** |

**Hukuki risk notu (kullanıcı bulgusu):** Bu 6 formun HEPSİ, gönderim
öncesi kullanıcıya gerçek bir KVKK onay metni gösteriyor (`src/i18n/
tr.ts`'teki `kvkkNotice`: *"İletişim Web KVKK İbaresi ve Kullanım
Koşullarını kabul ediyorum."*, kaynak koddaki yorumlarda "AYNI dürüst
desen" olarak anılıyor — bkz. `LandingRequestForm.tsx:47-48`,
`SupportRequestForm.tsx:24-25`). Kullanıcı bu onayı verip formu
gönderdiğinde, sistem KİŞİSEL VERİYİ (ad/telefon/e-posta/firma) fiilen
HİÇBİR YERE göndermiyor/saklamıyor — yalnızca tarayıcı konsoluna
yazıyor. Yani kullanıcıya biçimsel bir KVKK/veri işleme onayı
sunulurken, o onayın konu ettiği veri işleme fiilen HİÇ gerçekleşmiyor
— gösterilen hukuki metinle sistemin gerçek davranışı arasında bir
TUTARSIZLIK var. (Bu bir hukuki görüş DEĞİL, yalnızca kod davranışının
tespitidir — nihai değerlendirme için hukuk danışmanına başvurulmalı.)

**GÜNCELLEME (2026-09-02):** Yukarıdaki tablodaki TÜM `console.log(...)`
çağrıları kaldırıldı, 5 form component'i gerçek `submitLead()`/`/api/lead`
akışına bağlandı — bkz. yukarıdaki güncel özet. Bu madde SendGrid
anahtarı gelip gerçek e-posta gönderimi doğrulanana kadar açık kalıyor.

**TODO (kalan, yalnızca anahtar gelince):**
- [ ] `.dev.vars`/Cloudflare Pages env değişkenlerine
      `SENDGRID_API_KEY`/`SENDGRID_FROM_EMAIL`/`LEAD_NOTIFICATION_EMAIL`
      yazılacak.
- [ ] Gerçek bir uçtan uca test: bir form gönderilip idenfit'in
      `LEAD_NOTIFICATION_EMAIL` kutusuna e-posta düştüğü doğrulanacak.
- [ ] reCAPTCHA site key alınırsa, istemci widget'ı + CSP güncellemesi
      (bkz. `lead.ts`'teki `verifyRecaptcha()` yorumundaki adım adım not).

---

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
