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
göçü (Decap→Keystatic, 2026-08-27'de başladı) ADIM 1/2 tamamlandı, 622/622
yazı Markdown'a taşındı (2026-08-29) — ADIM 3 (son doğrulama/commit onayı)
kullanıcıyı bekliyor, bkz. aşağıdaki "KEYSTATIC GEÇİŞİ" bölümü. **Şu anki
odak (2026-08-29/30): Online Sunum Talebi sayfasının baştan tasarımı**
(bkz. aşağıdaki "Güncel durum" — çok turlu bir yeniden tasarım süreci,
kullanıcı geri bildirimiyle ilerledi, hâlâ devam edebilir); ardından SEO/
erişilebilirlik/GEO takip turlarına (bkz. §Açık noktalar #28) geri
dönülecek.

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

## Güncel durum (son güncelleme: 2026-08-29/30)

**🟡 2026-08-29/30, en son — Online Sunum Talebi sayfası baştan tasarlandı, çok turlu bir süreç, TAMAMLANMADI/devam edebilir.**
Kaynağın (idenfit.com/online-sunum-talep-et/) BİREBİR DOM yapısına
(şeffaf sol kolon + kırmızı arka plan + sağ form kartı) sadık kalan eski
tasarım kullanıcı isteğiyle TAMAMEN terk edildi. Yeni tasarım kullanıcının
paylaştığı bir mockup + `/demo` (Landing Page) sayfasının birkaç
parçasının harmanı — **içerik hiçbir yerde uydurulmadı**, tüm metin/görsel
zaten onaylı gerçek veri (`misc-pages.json`, Müşteriler sayfasının logo
şeridi, `/demo`'nun "3 Adımda idenfit"/"Öne Çıkan Özellikler" metinleri),
yalnızca YENİDEN DÜZENLENDİ. Kronolojik özet (aynı gün 6 geri bildirim
turu):
1. **Baştan kurulum:** Ortalanmış hero (radyal gradyan, ana sayfanın
   `#FFDCDC→#FFF3F3→#FFFFFF` tonlarıyla AYNI) + form kartı (`/demo`'nun
   nabız/halka dekorasyonu `LandingPulseDecoration.tsx` arkasında) + form
   2 ADIMA bölündü (Adım 1: e-posta+firma, Adım 2: telefon+ad soyad —
   kullanıcı talimatıyla bu sıra, `/demo`'nun `LandingRequestForm.tsx`
   iskeleti temel alınıp yeni `PresentationRequestForm.tsx` yazıldı,
   `t.hero.presentationForm.next`/`back` 5 dilde eklendi).
2. Başlık-form arası "chip" şeridi + sayfa altındaki 2 logo şeridi
   (referanslar/entegrasyonlar) kaldırıldı (sadeleştirme).
3. `/demo`'nun "3 Adımda idenfit"/"Öne Çıkan Özellikler" bölümleri, bu
   sayfaya özel daha zarif bir tasarımla eklendi (`PresentationTimeline.astro`/
   `PresentationFeatureGrid.astro`) — kart yüzeyleri + idenfit'in gerçek
   logo yıldızı her kartın köşesinde dönüyor (`IdenfitStar` +
   `idenfit-star-spin`, Müşteri Hikayeleri carousel'indeki AYNI, zaten
   onaylı animasyon deseni yeniden kullanıldı). **Yan bulgu, aynı turda
   düzeltildi:** `BaseLayout.astro` `.reveal` scroll-fade script'ini
   (`scroll-reveal.js`) OTOMATİK yüklemiyor — yalnızca `/demo`/ana sayfa
   gibi onu elle ekleyen sayfalarda çalışıyor, bu yeni sayfaya da eklendi
   (aksi halde yeni bölümler kalıcı görünmez kalırdı).
4. Yıldız dokusu çoğaltılıp KARIŞIK/asimetrik yerleştirildi + üstten
   kesilme sorunu (`overflow-hidden`) düzeltildi; "Hemen Ara" satırı
   kaldırıldı; H1 kırmızıya çevrildi; Müşteriler sayfasının GERÇEK 14
   logoluk şeridi (`CustomerLogoMarquee.astro`) + yeni bir güven cümlesi
   form kartının altına eklendi. **Rakam notu:** kullanıcı "5.000+" dedi,
   ama sitenin HER YERİNDE (ana sayfa `logoStrip.caption`, `/demo`
   BENEFITS) onaylı rakam "1.000+" — çelişki bildirildi, netleşene kadar
   "1.000+" ile yazıldı (`t.hero.presentationTrustCaption`, 5 dilde,
   rakam UYDURULMADI).
5. Form kartı içindeki "Online Sunum Talebi" başlığı kırmızı yapıldı,
   hero'ya 2 yıldız daha eklendi, sayfa altındaki LastUpdated şeridine
   `#FAFAFA` arka planı verilip footer'a kesintisiz akması sağlandı
   (önceden şeffaf/beyazdı, gri footer'dan önce kopuk bir şerit gibi
   duruyordu).
6. **Site geneli bir mimari düzeltme:** breadcrumb ("Ana Sayfa / ...")
   HER sayfada düz beyaz zeminde render ediliyor, hemen altındaki renkli/
   gradyanlı bir hero varsa aralarında görünür bir "dikiş" bırakıyordu —
   kullanıcı bunun sitedeki GENEL bir sorun olduğunu belirtti.
   `BaseLayout.astro`'ya YENİ, opsiyonel bir `heroBackground` prop'u
   eklendi (breadcrumb'ı saran kutuya düz renk uygular — hero'nun
   gradyanının TAMAMINI değil, yalnızca 0% rengini, iki ayrı kutuda aynı
   gradyanı hizalamaya çalışmak kırılgan olurdu). Verilmezse (varsayılan)
   TÜM diğer sayfalarda DAVRANIŞ DEĞİŞMEZ — spot-check + tam regresyon
   suite'iyle doğrulandı. Bu sayfa `heroBackground="#FFDCDC"` kullanıyor.
   Güven cümlesi/logo şeridi de bu turda bir kez daha aşağı kaydırıldı.

**Doğrulama (her turda tekrarlandı):** `astro check` 0 hata, `astro
build` 3097 dosya, 8 regresyon script'i (json-ld/link-accessibility/
heading-hierarchy/image-alt-text/meta-description/title-length/html-lang/
hreflang) HER SEFERİNDE bilinen taban çizgisiyle birebir aynı — sıfır yeni
regresyon. Chrome'da her turda görsel doğrulama yapıldı. Yeni dosyalar:
`PresentationRequestForm.tsx`, `PresentationTimeline.astro`,
`PresentationFeatureGrid.astro`. Commit'ler (kronolojik):
`ba25806`→`81b2edc`→`f570d9b`→`75e9803`→`34c3f14`, her biri hem `origin`
hem `idenfit` remote'una push edildi — **çalışma ağacı şu an TEMİZ,
bekleyen commit yok.** Kullanıcı "yarın devam ederiz" dedi — sayfa muhtemelen
daha fazla ince ayar geçirecek, bu KAPANMIŞ bir iş değil, bir sonraki
oturumda bu günlüğün devamı beklenmeli.

Aynı gün, ayrıca ana sayfanın hero headline'ı (`t.hero.headline`, TÜM
locale'lerin PAYLAŞTIĞI `HeroSection.astro`) `text-heading`'den
`text-brand`'a (kırmızı) çevrildi — kullanıcı talimatı, içerik değişmedi.

**🟡 2026-08-24, ayrıca — "Low readiness for Microsoft Bing Copilot" bulgusu KISMEN kapalı, doğrulama-only tur, kod değişikliği YOK.**
`curl` ile `dist/index.html`'de tekrar doğrulandı: LinkedIn `sameAs`'te
(`linkedin.com/company/idenfithr/`, kanonik adres, bkz. 2026-08-22 notu).
`check-meta-description-length.mjs`: 927/928 sayfa tamam, tek istisna
bilinen `admin/index.html` (Decap CMS kabuğu, kasıtlı kapsam dışı, bkz.
2026-08-23 notu). `check-title-length.mjs`: `<title>` etiketi HİÇBİR
sayfada eksik DEĞİL (0/928) ama **UZUNLUK optimizasyonu hâlâ tamamlanmadı
— 409 sayfa (220 kısa, 189 uzun) bekliyor**, bu YENİ bir bulgu değil,
zaten takip edilen Açık nokta #28'in aynısı (kademeli iş, 31/622 blog
yazısı tamamlanmıştı). **Sonuç: sameAs + meta description tamamen kapalı,
title UZUNLUĞU kapalı DEĞİL** — bulgunun tamamı "kapandı" diye
raporlanmadı, yalnızca doğrulanan 2 alt-parça kapalı işaretlendi, title
uzunluğu Açık nokta #28'in kapsamında kalmaya devam ediyor.

**🟢 2026-08-24, ayrıca — "Low readiness for Google AI Overviews/Perplexity/Gemini" bulgu ailesi 3 ayrı turda ele alındı.**
1. **Author attribution** — `BlogPosting.author` artık kaynakta gerçek
   ad-soyadı olan 2 yazar için (`Neslihan Gültekin` 24 yazı, `Ayşegül
   Topçu` 1 yazı) `Person`, geri kalanı (jenerik "idenfit editör" + WP
   kullanıcı-adı-formatlı 3 yazar, kullanıcı kararıyla isim
   UYDURULMADI) `Organization` fallback'inde. Görünür byline YOK
   (bilinçli karar). `content.config.ts`'e yeni `authorName?: string`
   alanı, `extract-blog-posts.mjs`'e kalıcı `AUTHOR_DISPLAY_NAMES`
   çözünürleştirmesi eklendi. (4369088)
2. **4 blog H2 başlığı soru formatına çevrildi** (anlamı zorlamadan,
   yalnızca doğal soru-cevap yapısına uygun olanlar seçildi):
   `bulut-tabanli-insan-kaynaklari-yazilimi`, `ik-ekibiniz`,
   `is-sagligi-ve-guvenligi`, `gida-sektorunde-insan-kaynaklari-yonetimi`.
   (4369088)
3. **35 dış kaynak atfı `<cite>` ile işaretlendi** (19 blog yazısı,
   Deloitte/Gartner/PwC/IDC/McKinsey/EY/Michael Page/KPMG/Statista/World
   Economic Forum/Harvard Business Review/Randstad/LinkedIn/Forbes) —
   `<blockquote>` KULLANILMADI (kaynaklar paraphrase edilmiş, birebir
   alıntı değil — `<blockquote>` yanlış semantik + telif açısından
   yanıltıcı olurdu). Yalnızca kurum adı etiketlendi, iyelik eki/rapor
   adı/kısaltma dışarıda kaldı. Özel durumlar: KPMG'nin bitişik
   `<sup>` dipnotu, Statista/LinkedIn'in zaten `<a>` içinde olması (cite
   linkin İÇİNE sarmalandı), aynı paragrafta 2 kez geçen Deloitte/Forbes
   (ikisi de işaretlendi). `blog/[slug].astro`'nun içerik sarmalayıcısına
   `[&_cite]:not-italic` eklendi (tarayıcının varsayılan italic
   stilini nötrler — "görsel stil değişmeyecek" kullanıcı şartı).
   (6d5a6bf)
4. **"Low readiness for Google Gemini" — doğrulama, kod değişikliği
   YOK.** `Organization.sameAs`'teki YouTube linki (`FOOTER_SOCIAL`'dan,
   2026-08-22 LinkedIn turunda kurulan 7 platformluk listeden) `curl`
   ile `dist/index.html`'de doğrulandı — zaten mevcut. Wikipedia/Wikidata
   linkleri hâlâ yok — bkz. Açık nokta #38 (dış bağımlılık, idenfit'in
   bir Wikipedia sayfası yok, biz tek taraflı oluşturamayız).
5. Her turda `astro check` 0 hata, `astro build` 927 sayfa,
   `check-heading-hierarchy`/`check-json-ld`/`check-link-accessibility`
   sıfır yeni regresyon (yalnızca bilinen 5 H1→H3 temel çizgisi),
   `dist/**/*.html`'de `curl`/`grep` ile tek tek doğrulandı.

**🟢 2026-08-24, ayrıca — İki küçük son-dokunuş değişikliği.**
1. **Hero başlığı (`t.hero.headline`, sadece TR):** "Önce insan. Gerisi
   kolaylaşsın." → "Önce İnsan gerisi bizde." Kullanıcının açık isteği
   üzerine YALNIZCA `src/i18n/tr.ts` değişti — EN/NL/IT/AZ dosyaları
   bilinçli olarak DOKUNULMADI (curl ile 5 dilin de anasayfa H1'i
   karşılaştırılıp doğrulandı).
2. **Carousel altı boşluk daraltıldı** (`CustomerStoryCarouselSection.astro`):
   kullanıcının paylaştığı ekran görüntüsünde ok butonları ile altındaki
   logo şeridi arasında fazla boşluk vardı — üst boşluk (widget'tan ayrım
   için) korunup yalnızca `pb-*` azaltıldı (`py-12/py-16` → `pt-12 pb-4
   lg:pt-16 lg:pb-6`).

`astro check` 0 hata, `astro build` 927 sayfa, link/heading regresyon
sıfır yeni sorun (bilinen 5 H1→H3 taban çizgisi hariç), Chrome'da görsel
doğrulama yapıldı.

**🟢 2026-08-24, ayrıca — "İdenfit ile Fark Yaratanlar" carousel'i çok
turlu bir revizyon serisinden geçti (Personio referansı derinleşti +
eski `TestimonialSection` widget'ı tamamen bu carousel'e taşındı).**
Sıralı özet:
1. **Video kartları arka planda sessiz/otomatik döngüye çevrildi.**
   Kullanıcı Civil/Beyaz Fırın/Femaş videoları için gerçek YouTube
   linkleri + döngü saniye aralıkları verdi (Femaş 18-32sn, Beyaz Fırın
   5-10sn, Civil 20-24sn). `VideoCarouselCard.loopStart/loopEnd`
   (opsiyonel) verilmiş kartlar artık tıkla-oynat DEĞİL — sayfa
   yüklenir yüklenmez `autoplay=1&mute=1&loop=1&playlist=<id>&start=
   <s>&end=<e>` embed parametreleriyle o aralıkta sessiz döngüde
   oynuyor, kart TAMAMEN görünmez bir `<a target="_blank">` ile
   kaplanıp tıklanınca gerçek `youtube.com/watch?v=<id>` sayfasına
   gidiyor (`BackgroundLoopVideo`, `CustomerStoryCarousel.tsx`) — DOM
   inceleme + gerçek tıklama testiyle (yeni sekme açıldığı) doğrulandı.
2. **Femaş yeni bir kart olarak eklendi** — kullanıcının sağladığı
   gerçek logo (`logo-white.png` → `public/images/customer-femas-logo.png`).
3. **HAVAİST (Emre Özcan) ve Zsa Zsa Zsu (İsmail Ünal) carousel'e
   eklendi** — eski (ayrı) ana sayfa `TestimonialSection` widget'ından
   TAŞINDI (aynı gerçek alıntı metni `home.testimonials`'dan, ikinci
   kez YAZILMADI). Bu ikisinin `/musteriler/` sayfasında gerçek bir
   hedefi olmadığı için "Devamını Oku" bu 2 kartta hiç render edilmiyor
   (`readMoreLabel`/`readMoreHref` artık opsiyonel).
4. **`TestimonialSection` ("Geliştirilebilir Çalışan Deneyimi") ana
   sayfanın 5 dilinin (TR/EN/NL/IT/AZ) hepsinden KALDIRILDI** — içeriği
   madde 3'e taşındığı için tekrar gerekmiyordu. Component dosyaları
   (`TestimonialSection.astro`/`TestimonialCarousel.tsx`) bilinçli
   olarak SİLİNMEDİ (yalnızca kullanım kaldırıldı, kullanıcı dosya
   silmeyi istemedi).
5. **Doğ-Ser Makina (Cem Çolak alıntısı) hem carousel'e HEM
   `/musteriler/` sayfasına eklendi.** Logosu kaynağın kendi CANLI
   sitesinden (dog-ser.com/assets/img/dog-ser-logo.png) çekilip
   yerelleştirildi. HAVAİST/Zsa Zsa Zsu de AYNI turda `/musteriler/`
   sayfasına gerçek birer blok olarak eklendi — alıntı metni ikinci kez
   yazılmadı, `customerStories` i18n şemasına (5 dil) `home.testimonials`
   ile BİREBİR aynı metin kopyalandı (yalnızca `role` alanı şirket adı
   önekinden ayrıldı, "Devamını Oku" için gereken).
6. **Kart-içi düzeltme:** HAVAİST/Zsa Zsa Zsu'nun `/musteriler/`
   bloklarında BÜYÜK dairesel görsel önce kişi portresiydi (tutarsız,
   diğer bloklar şirket fotoğrafı kullanıyor) — kullanıcının paylaştığı
   gerçek şirket fotoğrafları (otobüs/mağaza) ana medya oldu, portreler
   diğer bloklarla AYNI desende küçük alıntı-yazarı rozetine taşındı.
7. **Sıralama** iki kez güncellendi: önce "1 video 1 yazı" sonra
   kullanıcı iki yeni yazı kartı eklenince "1 video 2 yazı" istedi —
   şu an: Civil(video)→Yatsan→HAVAİST→Beyaz Fırın(video)→Tuğba→
   Zsa Zsa Zsu→Femaş(video)→Beyaz Fırın(yazı)→Doğ-Ser.
8. **Renk rotasyonu** da iki kez güncellendi: kırmızı/beyaz/gri →
   GRİ/BEYAZ/KIRMIZI (kullanıcı isteği), "kırmızı" gerçek marka
   kırmızısı (`bg-brand`).
9. **İdenfit yıldızı** (`IdenfitStar.tsx`, `IdenfitLogo.tsx`'in son
   path'inden izole edilmiş kırpılmış viewBox) her kartın sağ üst
   köşesinde yavaşça dönüyor (`idenfit-star-spin`, `prefers-reduced-motion`'da
   duruyor).

Her adımda `astro check` 0 hata, `astro build` 927 sayfa,
`check-link-accessibility`/`check-heading-hierarchy`/`check-image-alt-text`
sıfır yeni regresyon, Chrome'da görsel doğrulama tekrarlandı (Personio.com
canlı referansıyla da karşılaştırıldı). Commit: `a3dc41b`.

**🟢 2026-08-24, ayrıca — Hero bölümüne (`HeroSection.astro`, 5 dilin
paylaştığı TEK component) Personio referanslı yumuşak kırmızı alt-ton
eklendi.** Kullanıcı ekran görüntüsünde üst bölümü (başlık/form/CTA)
işaretleyip "Personio web sayfası tasarımına benzer" bir alt-ton istedi
— Personio.com canlı incelendi (dashboard mockup'ının ALTINDAN yükselip
metne doğru sızan yumuşak mor parıltı deseni). Düz `bg-[#F8F8F8]`
yerine, HEMEN ALTINDAKİ widget çerçevesinin ZATEN kullandığı AYNI
kırmızı ton ailesinden (`#FFDCDC→#FFF3F3→#FFFFFF`) radyal bir gradyan
(`radial-gradient(120% 90% at 50% 100%, ...)`) — yeni bir renk İCAT
EDİLMEDİ, widget'ın gradyanıyla kesintisiz birleşiyor. `astro check` 0
hata, `astro build` 927 sayfa, `check-link-accessibility`/
`check-heading-hierarchy` sıfır yeni regresyon, Chrome'da görsel
doğrulandı.

**🟢 2026-08-24, ayrıca — Ürün/modül sayfalarındaki bölüm-seviyesi
("Başlayın" vb.) CTA linkleri düz metin linkinden gerçek butona
çevrildi.** Kullanıcı "sadece link görünümünden yuvarlak kenarlı kırmızı
çerçeveli butona çevir" dedi. `ProductSectionBlock.astro`'daki CTA'lar
(`text-brand hover:underline` — düz metin) hero'nun ZATEN kullandığı
`.btn-cta` sınıfına (yuvarlak, 2px kırmızı çerçeve, beyaz zemin, hover'da
dolgulu kırmızıya döner — `global.css`) geçirildi, yalnızca
`px-6 py-2.5` ile hero'dan (`px-8 py-3`) biraz daha küçük/ikincil boyut
verildi. Bu component yalnızca `ProductPage.astro` tarafından kullanıldığı
için (21 ürün/modül grubu × dil) değişiklik SİTE GENELİNDE tüm ürün
sayfalarının bölüm CTA'larını kapsıyor — tek component değişikliği.
`astro check` 0 hata, `astro build` 927 sayfa, `check-link-accessibility`/
`check-heading-hierarchy` sıfır yeni regresyon, Chrome'da (`pdks-modulu`,
"Satış Ekibi İle Görüşün" butonu) görsel doğrulandı. **Çalışma ağacı
temiz DEĞİL** — commit kullanıcı onayı bekliyor.

**🟢 2026-08-24, ayrıca — "No BreadcrumbList schema" GEO/SEO bulgusu
KAPANDI: hem görünür breadcrumb şeridi hem BreadcrumbList JSON-LD, tüm
sitede (19 şablon) canlı.** Keşif: hiçbir sayfa türünde hiyerarşik bir
breadcrumb YOKTU (blog'daki `← Blog` yalnızca geri-linkiydi, hiyerarşi
değil). Kaynak WP sitesindeki blog sidebar breadcrumb widget'ı
(`docs/remaining-work-report.md` madde 2) `/category/...` arşiv sayfaları
olmadığı için bilinçli olarak migrate edilmemişti — kullanıcıya iki
kapsam sorusu soruldu, ikisinde de önerilen seçenek onaylandı: (1)
**2 seviyeli hiyerarşi** — Ana Sayfa > [Sayfa Başlığı]; **blog istisna**
Ana Sayfa > Blog > [Yazı Başlığı] (yalnızca `/blog/` gerçek/tıklanabilir
bir sayfa olduğu için) — "Ürünler"/"Sektörler" gibi gerçek bir landing
sayfası olmayan ara segmentler EKLENMEDİ (kırık/işlevsiz link
üretmemek için, kaynaktaki AYNI gerekçe); (2) **görünür + JSON-LD
birlikte** — yalnızca görünmez veri Google'ın "yapılandırılmış veri
görüneni yansıtmalı" kuralına aykırı olurdu. **Mimari:** `BaseLayout.astro`'ya
tek bir `breadcrumb?: BreadcrumbItem[]` prop'u eklendi ("Ana Sayfa"
SONRASI iz) — "Ana Sayfa" (`common.home`, 5 dilde yeni çeviri: Ana
Sayfa/Home/Startpagina/Home/Əsas səhifə) + `getRelativeLocaleUrl()`
BaseLayout içinde OTOMATİK ekleniyor, çağıran sayfa yalnızca kendi
izini geçiriyor — tek kaynaktan besleme (`dateModified`/OG tarihleriyle
AYNI ilke). Görünür `<nav aria-label="Breadcrumb">` H1'in hemen üstünde,
JSON-LD AYNI `breadcrumbTrail`'den üretiliyor (ikinci bir veri kaynağı
YOK). **19 şablon** güncellendi: `ProductPage`/`SectorPage`/
`blog/[slug].astro`/`BlogListPage` (pilot, kullanıcı onayı sonrası) +
`AboutPage`/`ContactPage`/`FaqPage`/`HubPage`/`LegalPage`/`PricingPage`/
`CustomerStoriesPage`/`SecurityPage`/`SupportRequestPage`/`ThankYouPage`/
`PresentationRequestPage`/`CalculatorsPage`/`HrMaturityTestPage` — her
birinde breadcrumb leaf etiketi YENİ bir metin İCAT EDİLMEDEN, sayfanın
ZATEN sahip olduğu gerçek başlıktan (`content.title`/`pageTitle`/
component'in kendi `title` prop'undan, bazılarında footer/mega-menü
etiketinden — ör. Fiyatlar için `footer.links.general.pricing`="Fiyatlar
ve Modüller", SSS için `footer.links.general.faq`="Sıkça Sorulan
Sorular") türetildi. `ProductPage`/`blog/[slug].astro` PAYLAŞIMLI
component/template olduğu için (89 ürün sayfası × dil / 622 blog yazısı)
"pilot" fiilen TÜM o şablon türüne yayıldı — kullanıcıya bu mimari
gerçek AÇIKÇA bildirildi, onay sonrası kalan 15 şablona geçildi. NotFoundPage/
LandingPage (`/demo`, `noindex`) bilinçli olarak breadcrumb'sız bırakıldı.
**Doğrulama:** `astro check` 0 hata (378 dosya), `astro build` 927 sayfa,
`check-link-accessibility` 0 bulgu, `check-json-ld` **916 BreadcrumbList
bloğu, 0 geçersiz** (622 blog + ~294 diğer sayfa), `check-heading-hierarchy`
yalnızca bilinen 5 ana sayfa H1→H3 atlaması (Açık nokta #36, ilgisiz) —
sıfır regresyon. `dist/**/*.html`'de TR/EN karışık örneklem (ürün/sektör/
hub/hukuki/blog listesi/Fiyatlar/SSS/Hakkımızda/Güvenlik/Hesaplama
Araçları/İK Olgunluk Testi) tek tek `grep` ile hem görsel `<nav>` hem
JSON-LD doğrulandı — EN'de "Home"+`/en/` doğru locale-aware çalışıyor.
`npm run dev:clean` ile temiz restart + Chrome'da canlı görsel doğrulama
yapıldı.

**Aynı gün, ayrı bir bulgu — `puantaj-takip-programi-modulu` TR sayfasının
H1'i canlı idenfit.com ile UYUŞMUYORDU, düzeltildi.** Kullanıcı iki
sayfayı (localhost + idenfit.com) yan yana görüp tutarsızlık bildirdi.
Kök neden: WP'nin `product_tit` ACF alanı ("Zaman ve Devamsızlık
Yönetimi") `extract-products.mjs` tarafından `hero.title`'a DOĞRU
eşlenmişti, ama canlı sayfanın Elementor başlık widget'ı bu alana değil
elle girilmiş sabit bir metne bağlı — gerçek `<h1>` (`curl` ile
doğrulandı) "Puantaj Takip Modülü". (WP'nin post `title` alanı da
"Puantaj Takibi Modülü" — üçüncü, yine farklı bir varyant; kaynağın
kendi iç tutarsızlığı.) EN locale'de (`time-attendance-module`) bu üç
alan BİRBİRİYLE TUTARLI çıktı (`wp-json` ile doğrulandı) — bulgu
yalnızca TR'ye özgü, düzeltme yalnızca TR'ye uygulandı. **Uygulama:**
`productTranslationOverrides.ts`'e `puantaj-takip-programi-modulu.tr.hero`
override'ı eklendi — yalnızca `title` düzeltildi, `text`/`ctaText`/
`ctaUrl`/`image` ham `products.json`'daki `hero` alanıyla BİREBİR AYNI
(override mekanizması tam blok değişimi gerektiriyor). Sayfanın 4 CTA
metnini kişiselleştiren önceki karar (2026-08-12, `ctaTextOverride`/
`sectionCtaOverrides`, "Puantaj Takibine Başlayın" vb.) BİLİNÇLİ VE
AYRI bir karardı — bu turda dokunulmadı, yalnızca H1/`<title>`/breadcrumb
etkileyen `hero.title` düzeltildi. `astro check` 0 hata, `astro build`
927 sayfa, `check-link-accessibility`/`check-json-ld`/`check-heading-hierarchy`
sıfır yeni regresyon, `dist/puantaj-takip-programi-modulu/index.html`'de
H1/`<title>`/breadcrumb'ın hepsi "Puantaj Takip Modülü" gösterdiği
doğrulandı, Chrome'da görsel olarak da canlı sayfayla eşleştiği
onaylandı. **Çalışma ağacı temiz DEĞİL** — bu turun tüm değişiklikleri
(BaseLayout/i18n/15+ component + Puantaj override) commit edilmeyi
bekliyor.

**🟢 2026-08-24, ayrıca — "Few data points/statistics" GEO bulgusu için
3 blog yazısındaki rakamsız iddiaya, AYNI yazı içinde zaten var olan
gerçek istatistik eklendi (`pdks-nedir`, `dijital-ik`,
`ise-alim-surecinde-yapay-zeka-kullanimi`).** Kullanıcı isteğiyle önce
keşif yapıldı (kod yazılmadan): 4 Markdown blog yazısının tamamı +
`posts.json`'daki 618 legacy yazının geneli rakamsız genel-geçer iddia
kalıpları için tarandı ("önemli ölçüde", "çoğu şirket", "zamandan
tasarruf sağlar" vb.), + `reference/wordpress-export/products.json`'daki
**21 ürün/modül sayfası grubunun TAMAMI** aynı kalıplarla tarandı.
**Kalıcı disiplin (KARAR 1'in bir uzantısı — paragraf alıntılanabilirliği
turunda uygulanan aynı kural):** hiçbir uydurma rakam eklenmedi, yalnızca
AYNI yazı içinde zaten geçen gerçek kaynaklı istatistikler (Deloitte/IDC/
Gartner) ilgili rakamsız cümleye taşındı. **Genel bulgu — kalıcı not:**
ürün/modül sayfalarında bu sorun neredeyse YOK (21 sayfa grubunun
tamamı tarandı, yalnızca 2 eşleşme çıktı — `notlar-modulu`/
`demirbas-yonetimi-modulu`, ikisinde de sayfa+SSS'i tek tek kontrol
edilip hiç destekleyici rakam bulunamadığı için DOKUNULMADI); ürün
kopyası özellik-açıklaması ağırlıklı, istatistik iddiası taşımıyor.
Sorun büyük ölçüde blog içeriğinde yoğunlaşıyor. Kullanıcıya ayrıca 6
aday daha raporlandı (`hr-yazilimi-isletmenize-nasil-fayda-saglar`,
`2025-ik-teknolojisi-trendleri`, `hibrit-calisma-modeli-nedir`,
`turnover-rate-nedir-nasil-hesaplanir`, `calisma-hayatinin-yeni-aktorleri-z-kusagi`
+ yukarıdaki 2 ürün sayfası) — hepsinde ya hiç rakam yoktu ya da var
olan rakam konuyla eşleşmiyordu (ör. Z kuşağı demografi rakamları
"verimlilik artışı" iddiasını değil, tamamen farklı bir konuyu
destekliyordu — zorlama eşleştirme yapılmadı), kullanıcı onayıyla
DOKUNULMADI. `astro check` 0 hata (378 dosya), `astro build` 927 sayfa,
`check-link-accessibility` 0 bulgu, `check-json-ld` 0 geçersiz blok (622
`BlogPosting` dahil), `check-heading-hierarchy` yalnızca bilinen 5 ana
sayfa H1→H3 atlaması (Açık nokta #36, bu turla tamamen ilgisiz) — sıfır
yeni regresyon. `dist/blog/*/index.html` üzerinde `grep` ile 3 yazının
da render edilmiş metninde yeni cümleler tek tek doğrulandı. **Çalışma
ağacı temiz DEĞİL** — yalnızca `src/content/blog/posts.json` değişti,
commit kullanıcı onayı bekliyor.

**🟡 2026-08-23, ayrıca — Bu bilgisayarda (ikinci cihaz) push edilmemiş
commit'ler var, remote hâlâ bağlı değil.** Kullanıcı "bugünlük burada
duruyoruz, push'u yarın çözeceğiz" dedi. `git log e374cfd..HEAD`
(`e374cfd` — bu cihazdaki son bilinen ortak nokta) şu an **5 commit**
gösteriyor: `058db79` (blog paragraf düzeltmeleri), `8ad3673`
(Organization JSON-LD + LinkedIn), `3528dcb` (Fiyatlar sayfası mobil
düzeltmeleri), `70941c6` (Online Sunum Talebi mobil sıra+renk
düzeltmesi), `a84f216` (Speakable markup) — kullanıcının kendi
saydığı "3 commit" muhtemelen yalnızca ilk/son üçünü hatırlıyordu, tam
liste burada. `git remote -v` BOŞ (bu oturumda da hiç remote
eklenmedi, bkz. 2026-08-21 notu — aynı durum hâlâ devam ediyor).
**Yarın kalıcı bir senkronizasyon çözümü belirlenecek** (muhtemel
seçenekler: bu cihaza remote eklenip push edilir; ya da "birinci
cihaz"daki repo referans alınıp oradan senkronize edilir — hangisinin
kaynak-doğru kabul edileceği kullanıcıyla netleşmeli). **Çalışma ağacı
TEMİZ**, bekleyen değişiklik yok — yalnızca push bekliyor. Güncel
`git log` her zaman otoriter kaynak, bu not listeyi tekrar
ETMİYOR.

**🟢 2026-08-23, ayrıca — "No Speakable markup" GEO bulgusu için blog
yazılarına `SpeakableSpecification` eklendi (622 yazı, tek şablon).**
Kullanıcı kapsam/fayda tartışmasını ("Google'ın Speakable desteği
pratikte ABD'deki onaylı haber yayıncılarıyla sınırlı — fayda düşük ama
risk sıfır") onayladıktan sonra `blog/[slug].astro`'daki mevcut
`BlogPosting` JSON-LD'sine `speakable: {'@type':'SpeakableSpecification',
cssSelector:['#post-title','.post-content > p:first-of-type']}` eklendi.
İki küçük, salt işaretleme amaçlı hook eklendi (görsel etki YOK): `<h1>`'e
`id="post-title"`, içerik sarmalayıcı `<div>`'e (zaten var olan Tailwind
utility class'larına ek) `post-content` class'ı. Yalnızca blog'a eklendi
— Speakable semantik olarak Article/BlogPosting içindir, ürün/sektör
sayfalarının `WebPage` şemasına eklenmedi. `astro check` 0 hata, `astro
build` 927 sayfa, `check-json-ld.mjs`: 622 `BlogPosting` bloğunun hepsi
hâlâ geçerli (0 geçersiz — doğrulayıcı bilinmeyen ek alanları
reddetmiyor), `check-link-accessibility`/`check-heading-hierarchy`
mevcut temel çizgiyle birebir aynı. Kullanıcıya 3 farklı yazıda (1 göç
etmiş Markdown + 2 legacy JSON) `curl` ile gerçek JSON-LD çıktısı +
`.post-content > p:first-of-type`'ın gerçekten ilk paragrafa denk
geldiği gösterilip onaylandı.

**🟢 2026-08-23, ayrıca — Online Sunum Talebi sayfası mobil görünümde
2 turda düzeltildi (kullanıcının paylaştığı canlı site ekran
görüntülerine göre).** (1) **Sıra değişikliği:** `PresentationRequestPage.astro`'da
iki sütunlu grid (`sol: başlık+telefon+entegrasyonlar`, `sağ: form
kartı`) mobilde her zaman DOM sırasıyla (sol önce) render ediliyordu —
kaynağın mobil görünümünde form kartı ÖNCE, başlık/telefon/entegrasyonlar
SONRA geliyor. DOM sırası değişmedi, yalnızca `order-2 lg:order-1` (sol
sütun) / `order-1 lg:order-2` (form kartı) ile `lg` altında görsel sıra
tersine çevrildi; eski mobil `min-h-[528px]` kaldırıldı (artık kırmızı
şeridin üstünde değil, gereksiz boşluk yaratıyordu). (2) **Renk kontrastı
bug'ı:** sıra değişikliği sonrası sol sütun artık kırmızı şerit yerine
DÜZ BEYAZ zemine düşüyordu ama metin hâlâ `text-white` idi — beyaz
zeminde beyaz yazı tamamen görünmezdi (kullanıcının ikinci ekran
görüntüsüyle yakalandı). Başlık/madde işaretleri/"Hemen Ara"/telefon
numarası `lg` altında koyu/marka kırmızısına çevrildi, `lg:` üzerinde
(kolon hâlâ kırmızı şeridin üstünde) eski beyaz renkler AYNEN korundu;
telefon ikonu artık `lg` altında kırmızı çemberli. Her iki turda da
`astro check` 0 hata, `astro build` 927 sayfa, `check-link-accessibility`/
`check-heading-hierarchy` sıfır yeni regresyon, mobil+masaüstü
(iframe-viewport tekniğiyle) görsel doğrulama kullanıcının ekran
görüntüleriyle birebir eşleşti.

**🟢 2026-08-22/23, ayrıca — Fiyatlar sayfası mobil görünümünde 3 ayrı
bulgu düzeltildi.** (1) **Boşluk bug'ı:** "1-25Çalışan" gibi bitişik
görünen çalışan-sayısı metni — kök neden `<b>1-25</b> Çalışan` içeriğinin
doğrudan bir `flex` konteynerin çocuğu olması (flexbox flex item'lar
arasındaki boşluğu yutuyordu), içerik tek bir `<span>`'e sarmalanarak
düzeltildi (veri zaten doğruydu, hiç değişmedi). (2) **Suprema rozeti
çakışması:** Pro kartının üstüne mutlak konumla (`-top-[50px]`) taşan
rozet, kartlar mobilde tek sütuna indiğinde bir üstteki KOBİ kartıyla
çakışıyordu — `lg` altında normal akışa (`relative`+`mb-4`) alındı,
kaynağın gerçek mobil görünümüyle eşleşti. (3) **Satır taşması:**
Özellikler/Eklentiler karşılaştırma tablosunda sabit `h-[42px]` satır
yüksekliği, mobildeki dar sütunda (110px) 3 satıra sarmaya ihtiyaç duyan
uzun etiketleri ("Telefon/Çevrimiçi Destek") sığdıramıyor, metin
komşu satırlarla görsel olarak çakışıyordu — mobilde `h-16`'ya
çıkarılıp `sm:h-[42px]`'e geri dönecek şekilde düzeltildi (DOM'da
programatik olarak 0/56 satırın taştığı doğrulandı). **Ayrıca (kullanıcının
ayrı ekran görüntüleriyle istediği büyük değişiklik):** mobil/tablette
paylaşımlı yatay-kaydırmalı karşılaştırma tablosu YERİNE, kaynağın
`.mobile-only` akordeon deseni (önceki bir turda BİLİNÇLİ kapsam dışı
bırakılmıştı) uygulandı — her kartın kendi "Daha Fazla/Daha Az"
`<details>` accordion'u (native HTML), kendi Özellikler+Eklentiler
listesini tek sütun gösteriyor; paylaşımlı tablo artık yalnızca `lg:`.
Toggle metni (`mobileDetailsMoreText`/`LessText`) `pricingContent.ts`'e
`SUPREMA_BADGE_TEXT` ile AYNI desende eklendi — kaynakta hiç yoktu
(mobil-only blok extraction'a hiç yakalanmamıştı), 4+1 dilin (tr/en/nl/it/az)
hepsi için gerçek çeviri yazıldı (KARAR 1). Her turda `astro check` 0
hata, `astro build` 927 sayfa, `check-link-accessibility`/
`check-heading-hierarchy` sıfır yeni regresyon, mobil+masaüstü görsel
doğrulama (iframe-viewport tekniği + DOM ölçümü) kullanıcının ekran
görüntüleriyle eşleşti.

**🟢 2026-08-23, ayrıca — "Missing viewport meta tag" SEO bulgusu
incelendi, ZATEN KAPALI bulundu, kod değişikliği YAPILMADI.**
`<meta name="viewport" content="width=device-width, initial-scale=1">`
`BaseLayout.astro` (satır 116) VE `LandingLayout.astro`'da (satır 46)
ZATEN vardı. `curl` ile 6 farklı sayfa türünde (ana sayfa/ürün/blog/EN
locale/fiyatlar/Landing Page `/demo/`) gerçek HTML çıktısında tek tek
doğrulandı. `dist/**/*.html` üzerinde tam site taraması (928 gerçek
sayfa, redirect stub'ları hariç — ilk taramada stub'lar dahil edilince
2186 "eksik" çıkmıştı, hepsi Astro'nun kendi framework-içi i18n-fallback
`<meta refresh>` şablonu, Açık nokta #27'nin AYNI bilinen sınıfı, gerçek
bir eksiklik DEĞİL): **0/928 sayfada eksik** — `/admin/` (Decap CMS
kabuğu) dahil hepsinde mevcut. Bulgu muhtemelen `og:description`
bulgusuyla AYNI kökenden (eski/güncel olmayan bir tarama). Kullanıcı
onayıyla kapatıldı, kod değişikliği YOK.

**🟢 2026-08-23, ayrıca — "Missing og:description" SEO bulgusu incelendi,
ZATEN KAPALI bulundu, kod değişikliği YAPILMADI.** Kullanıcının bir SEO
tarama aracından gelen bulgusu araştırıldı: `BaseLayout.astro` (satır
134-138) ve `LandingLayout.astro` (satır 59-63) ikisi de `og:description`'ı
2026-08-13'teki "og:image eksik" turunda EKLEMİŞTİ — hem `<meta
name="description">` hem `og:description` AYNI `{description}` prop'unu
kullanıyor (ayrı bir metin YAZILMADI, tek kaynaktan geliyor — kullanıcının
önerdiği yaklaşım zaten uygulanmıştı). `dist/**/*.html` üzerinde script ile
tam tarama (928 sayfa, redirect stub'ları hariç, diğer `check-*.mjs`'lerle
AYNI desen): 927/928 sayfada `og:description` mevcut ve dolu, sıfır boş
içerik. **Tek istisna: `admin/index.html`** (Decap CMS'in kendi bundle'ladığı
statik admin panel kabuğu, `BaseLayout` kullanmıyor, zaten `noindex,
nofollow`) — bir içerik sayfası değil, sosyal paylaşım/SEO ihtiyacı yok,
bilinçli olarak dokunulmadı. Bulgu muhtemelen 2026-08-13 düzeltmesinden
ÖNCEKİ eski bir tarama sonucu. Kullanıcı onayıyla kapatıldı, kod
değişikliği YOK.

**🟢 2026-08-22, ayrıca — Organization JSON-LD eklendi + `sameAs`'e
LinkedIn dahil 7 gerçek sosyal profil bağlandı, site genelinde 926
sayfada aktif.** Kullanıcı "LinkedIn'i sameAs'a ekle" dedi; keşifte
projede hiç Organization/`sameAs` şeması OLMADIĞI görüldü (yalnızca
sade `WebPage`/`BlogPosting` blokları vardı) — sıfırdan `BaseLayout.astro`'ya
eklendi (`{name:'idenfit', sameAs:[...]}`, `Astro.site` tanımlıysa `url`
de eklenir). **Beklenmedik bulgu:** `data/footer.ts`'teki (2026-07-24'te
canlı siteden çıkarılmış, 7 platformluk gerçek) `FOOTER_SOCIAL`
listesindeki LinkedIn href'i (`/company/idenfit/`) LinkedIn tarafında
301 ile kanonik `/company/idenfithr/`'e yönleniyordu (WebFetch ile
doğrulandı — hedef sayfa gerçek/aktif, 8.712 takipçi, idenfit.com'a
bağlı). Kullanıcı onayıyla: (1) `footer.ts`'teki href kanonik adrese
düzeltildi (footer'da GÖRÜNEN link de artık doğru), (2) yeni Organization
bloğunun `sameAs`'i uydurma/yeni bir liste OLUŞTURMADAN `FOOTER_SOCIAL`'ı
aynen yeniden kullanıyor — sosyal linkler tek kaynaktan geliyor, iki
ayrı listeye bölünmedi. `astro check` 0 hata, `astro build` 927 sayfa,
`check-json-ld.mjs`: 926/928 sayfada (önceden 788) `Organization` bloğu
+ mevcut `WebPage`(161)/`BlogPosting`(622)/`FAQPage`(5) YANINDA, 0
geçersiz blok. **Kalan 2 sayfa netleştirildi (kasıtlı, eksik DEĞİL):**
`admin/index.html` (Decap CMS'in kendi bundle'ladığı statik admin
kabuğu — `BaseLayout` hiç kullanmıyor, zaten `noindex,nofollow`) ve
`demo/index.html` (Landing Page — ayrı/minimal `LandingLayout.astro`,
`noindex:true` varsayılanı, bu değişiklikten ÖNCE de hiç JSON-LD
taşımıyordu — regresyon değil, önceden var olan kapsam dışı bırakma).
İkisi de zaten noindex olduğu için SEO etkisi yok. `check-link-accessibility`/
`check-heading-hierarchy` mevcut temel çizgiyle birebir aynı, sıfır yeni
regresyon. `curl` ile ana sayfa/ürün sayfası/blog yazısında `sameAs`
içinde temiz LinkedIn URL'i (`/posts/?feedView=all` gibi bir alt-görünüm
YOK) + footer'daki güncellenmiş `<a href>` tek tek doğrulandı. Commit
edildi — **push HÂLÂ BEKLİYOR** (repo'nun remote'u yok, bkz. aşağıdaki
2026-08-21 notu — kullanıcıdan remote URL isteniyor).

**🟢 2026-08-22, ayrıca — Blog "zamirle başlayan bağımlı ilk paragraf"
denetimi TAMAMLANDI, 14/14 madde kapandı.** Kullanıcı isteğiyle blog +
ürün/modül sayfalarında her H2/H3 başlığı altındaki İLK paragrafın
"Bu/Bunlar/O" gibi bir zamirle başlayıp önceki cümleye/başlığa bağımlı
olup olmadığı denetlendi. **Kapsam (script ile TAM tarama, örneklem
DEĞİL):** 23/23 ürün/modül sayfası (`reference/wordpress-export/products.json`
TR, 55 bölüm başlığı + 97 SSS sorusu) — **sıfır bulgu**, bu sayfaların
metni zaten konuyu ilk cümlede netleştiriyor; 618/618 legacy blog yazısı
(`src/content/blog/posts.json`) — 42 aday paragraf/35 yazı bulundu, 10
farklı yazıdan 14 tanesi seçilip kullanıcıya raporlandı, kullanıcı
2 turda TEK TEK onayladı (11 madde ilk turda, kalan 3 madde — 7/12/14 —
raporun ilk halinde markdown `**` kalın işaretleri karışıklık
yarattığı için düz metin olarak yeniden sunulup ikinci turda onaylandı).
4 pilot Markdown blog yazısı da elle okunup temiz bulundu. **Uygulama:**
tüm 14 düzeltme yalnızca ilgili yazının `content` alanındaki mevcut
`<p>` metni içinde yapıldı — hiçbir HTML etiketi eklenmedi/kaldırılmadı,
yapı değişmedi. Script tabanlı uygulandı (`old→new` string eşleşmesi
önce `--dry-run` ile her düzenlemenin ilgili yazıda TAM 1 kez geçtiği
doğrulanıp, sonra gerçek dosyaya yazıldı) — 10 yazı etkilendi: 
`2026-vergi-affi-hakkinda-bilmeniz-gerekenler` (1), 
`2026-gunluk-yemek-ve-yol-ucreti-istisna-tutarlari` (3),
`performans-degerlendirme-hatalari` (2), `performans-degerlendirme-sorulari` (1),
`olum-izni` (1), `stratejik-yonetimde-benchmarking` (2),
`insan-kaynaklari-gorevleri-nelerdir` (1), `2025-stajyer-maaslari` (1),
`avans-yonetimi` (1), `is-arama-izni` (1). Mümkün olan yerlerde
(6/14 madde) sitede zaten var olan gerçek rakamlar ilk cümleye
eklendi — uydurma DEĞİL, aynı yazıda zaten geçen değerler: 300 TL/240 TL
günlük yemek istisnası + bundan hesaplanan ~%25 artış, 3 gün/7 gün ölüm
izni, %5 stajyer istihdam oranı, günde 2 saat + 28-112 saat iş arama
izni. **Doğrulama (2 turda, her ikisinde de tekrarlandı):** `astro build`
927 sayfa hatasız, `check-heading-hierarchy`/`check-link-accessibility`/
`check-json-ld` mevcut bilinen temel çizgiyle birebir aynı (sıfır yeni
regresyon — tek kalıcı bulgu ana sayfanın 4+1 dilindeki bilinen H1→H3
atlaması, Açık nokta #36, bu turla ilgisiz), `curl` ile toplam 7 yazının
10 paragrafında (14 madde, bazıları aynı yazıda) gerçek render edilmiş
metin tek tek doğrulandı. **Çalışma ağacı temiz DEĞİL** — yalnızca
`src/content/blog/posts.json` değişti, commit kullanıcı onayı
bekliyor (bu oturumda commit YAPILMADI, yalnızca istenirse).

**🟡 2026-08-21, en son — git commit'leri yerelde hazır, push BEKLİYOR
(remote yok).** Bu oturumda yapılan tüm işler (az locale genişletmeleri,
az görsel URL Unicode NFD/NFC bug düzeltmesi, site-geneli link/görsel
denetimi ile bulunan `/az/faq/`+`/nl/blog/` kırık route'ları, ana sayfa
SSS bölümü tasarımı + az çevirisi, "Manuel Süreçlerden Kurtulun"
şeridinin yuvarlatılması, `/donanim/`'daki "çekirdek platform"
görselinin kırmızı zemin düzeltmesi, canlı dashboard'un üst şeridinin
beyazlatılması + çizgi grafik taşma düzeltmesi) commit edildi, çalışma
ağacı TEMİZ (`git status` doğrulandı). **Ama repo'nun hiç remote'u YOK**
— `git init` bu oturumda SIFIRDAN yapılmıştı (proje daha önce hiç git
altında değildi), bir GitHub/GitLab adresi hiç eklenmedi. Kullanıcı
"pushla" dediğinde bu netleşti — kullanıcı remote URL'i vermek yerine
"sonra yaparız" dedi, push ERTELENDİ. **Sıradaki adım (kullanıcı devam
ettiğinde):** kullanıcıdan remote URL iste (veya kendisi ekleyeceğini
söylerse bekle), `git remote add origin <url>` + `git push -u origin
master`. En son commit: `e428869` ("Whiten dashboard browser-chrome
bar, fix chart line overflow"). Tam commit geçmişi için `git log
--oneline` çalıştırılabilir — bu not listeyi TEKRARLAMIYOR, güncel
`git log` her zaman otoriter kaynak.

**🟢 2026-08-21, en son — Azerbaycan dili (az) 5. locale olarak eklendi,
Faz 0+1 (altyapı + ana sayfa) tamamlandı.** Kullanıcı isteğiyle mevcut
tr(varsayılan)/en/nl/it'nin yanına gerçek/profesyonel Azerice çeviriyle
(fallback değil) 5. bir dil eklenmeye başlandı — kapsam çok büyük olduğu
için (~45 yeni sayfa dosyası + ~24 ürün/modül + 12 sektör + 2 hub + ~16
tekil sayfa) kullanıcı onayıyla fazlara bölündü, bu turda yalnızca
altyapı + ana sayfa tamamlandı. **Yapılanlar:** (1) `astro.config.mjs`
`i18n.locales`'e `az` eklendi, `fallback: {..., az: 'tr'}` — henüz gerçek
az sayfası oluşturulmamış HER route (blog, hesaplama araçları, İK
Olgunluk Testi, ve sonraki fazlara kadar ürün/sektör/tekil sayfalar)
otomatik TR'ye redirect stub'ı üretiyor, aynı NL/EN/IT fallback
mekanizması; (2) `src/data/nav.ts`'in `LOCALES` dizisine `az` eklendi
(app genelinde asıl kullanılan `Locale` tipi); (3) `src/i18n/az.ts`
sıfırdan oluşturuldu — `tr.ts` (423 satır) kaynak alınıp `Translations`
şemasının TAMAMI gerçek Azerice çeviriyle dolduruldu (KARAR 1), `astro
check` şema uyumunu derleme zamanında doğruladı; (4) `FlagIcon.tsx`'e
elle çizilmiş Azerbaycan bayrağı SVG'si (mavi/kırmızı/yeşil bant +
hilal/yıldız) + `LanguageSwitcher.tsx`'in `LABELS`'ine `az` eklendi —
dil seçici artık 5 dili listeliyor; (5) `src/pages/az/not-found.astro` +
`public/_redirects`'e `/az/*` kuralı (mevcut `en/nl/it` 404 deseninin
birebir tekrarı); (6) `scripts/check-html-lang-attribute.mjs`'in
`VALID_LOCALES`'i + `miscPagesContent.ts`'in `bareSlugFromAbsoluteUrl()`'ü
güncellendi; (7) `astro check`'in ortaya çıkardığı **plan dışı** 8 ek
`Record<Locale,X>` haritası da (`homeContent.ts` 5 görsel/video URL'i,
`dates.ts` BCP47 kodu, `miscPagesContent.ts` Neden idenfit meta
description'ı, `pageTitle.ts` CTA şablonu + title niteleyicileri,
`phoneCountries.ts` 45 ülke adı + varsayılan ülke haritası,
`pricingContent.ts` 3 fiyatlandırma metni) az girdisiyle dolduruldu —
TypeScript'in `Record<Locale,X>` (Partial DEĞİL) güvenlik ağı sayesinde
`astro check` bunları derleme zamanında tek tek yakaladı; (8)
`src/pages/az/index.astro` (ana sayfa, `en/index.astro`'nun birebir
aynısı, yalnızca `getTranslations(Astro.currentLocale ?? 'az')`).
**Doğrulama:** `astro check` 0 hata (342 dosya), `astro build` 883
sayfa (881 + `az/index.html` + `az/not-found/index.html`),
`check-html-lang-attribute`/`check-link-accessibility`/
`check-image-alt-text`/`check-json-ld` sıfır yeni ihlal,
`check-meta-description-length` ilk turda az hero description'ı
160 karakteri aştığı için 1 ihlal verdi → 183→159 karaktere kısaltılıp
düzeltildi, `check-title-length`/`check-heading-hierarchy`'nin
(409 kısa/uzun title + H1→H3 seviye atlaması) mevcut BİLİNEN
temel çizgiyle birebir aynı olduğu doğrulandı (az/index.html ikisinde de
YOK — sıfır yeni regresyon, diğer 4 locale homepage'in zaten paylaştığı
H1→H3 durumu az'da da aynen var, Açık nokta #36'nın kapsamı). Chrome'da
görsel doğrulama: `/az` hatasız açılıyor (ilk yüklemede bir kez geçici
Vite modül-runner hatası çıktı, `npm run dev:clean` ile düzeldi — bilinen
sınıf, kodla ilgisiz), hero+canlı dashboard widget'ı+Müşteri Hikayeleri
carousel'i doğru render oluyor, dil seçici 5 dili (TR/EN/NL/IT/AZ)
listeliyor ve TR→AZ geçişi çalışıyor, `/az/sss/` gibi henüz gerçek
az sayfası olmayan bir route TR'nin bare sayfasına doğru redirect
ediyor (beklenen davranış). **Çalışma ağacı temiz DEĞİL** — bu turun
tüm değişiklikleri commit edilmeyi bekliyor. **Sonraki fazlar** (ayrı
onaylarla): tekil sayfalar (Hakkımızda/İletişim/Fiyatlar/SSS/Hukuki
aile) → sektör sayfaları (önce `sectorTranslationOverrides.ts`
oluşturulmalı, henüz yok) → ürün/modül sayfaları → hub sayfaları —
bkz. Açık nokta #37. Plan dosyası: `az` altyapı planı bu oturumda
onaylanıp uygulandı (plan mode → ExitPlanMode akışı).

**🟢 2026-08-21, ayrıca — Ürün Önizleme widget'ına (hero'daki canlı dashboard)
otomatik sekme gezinmesi eklendi, bir önceki oturumdan yarım kalan iş
tamamlandı.** `ProductPreviewWidget.tsx`'e, Personio.com'un ana
sayfasındaki gibi widget'ın kendi kendine sekmeler arası gezinmesi
eklendi — yalnızca FONKSİYONEL 5 sekme arasında (Zaman Yönetimi/İzin/
İnsan Kaynakları/Performans Yönetimi/Veri Analizi) 6 saniyede bir döngü
yapıyor, "Yakında" rozetli pasif sekmeler atlanıyor. Desen projede zaten
kanıtlanmış `TestimonialCarousel.tsx`'in otomatik geçiş mantığıyla
BİREBİR aynı: hover/focus'ta duraklıyor (`onMouseEnter`/`onMouseLeave`/
`onFocus`/`onBlur`), `prefers-reduced-motion` tercih edilmişse hiç
başlamıyor, aynı 6000ms aralığı kullanıyor. Kullanıcının elle bir
sekmeye tıklaması döngüyü DURDURMUYOR — yalnızca kaldığı yerden devam
ediyor (bilinçli: "kendi kendine gezinen" bir demo bir tıklamada kalıcı
duracaksa amacına aykırı olur). `astro check` 0 hata (339 dosya),
`astro build` 881 sayfa, `check-image-alt-text`/`check-link-accessibility`
0 eksik. **Çalışma ağacı temiz DEĞİL** — bu turun + bir önceki oturumun
Müşteri Hikayeleri carousel'inin (aşağıdaki madde) hepsi hâlâ commit
edilmeyi bekliyor.

**🟢 2026-08-21, ayrıca — kullanıcı "müşteri deneyimleri kartları yok"
dedi, kök neden bulunup düzeltildi.** İlk `dev:clean` bu turda `astro
build` İLE ARAYA GİRİNCE (dev server açıkken build çalıştırılıp dist/
üretildi) yeniden bozulmuş — Chrome konsolunda tam CLAUDE.md'nin zaten
belgelediği bilinen hata: `TypeError: _jsxDEV is not a function`
(`CustomerStoryCarousel.tsx`+`YoutubeClickToPlay.tsx`'te). Sonuç: SSR
HTML'i (`curl` ile doğrulandı) kartların TAM içeriğini taşıyordu ama
React hydration'da island'ın içi TAMAMEN boşalıyordu (`innerHTML.length
0`) — `.reveal` sarmalayıcı görünür/opaklığı doğruydu, sorun scroll-reveal
DEĞİLDİ, saf hydration çökmesiydi. İKİNCİ bir `npm run dev:clean`
(bu kez `astro build` araya girmeden) sorunu kalıcı çözdü, `astro dev
logs`'ta `_jsxDEV` hatası bir daha çıkmadı, Chrome'da 5 kartın hepsi
(Civil video, Yatsan/Beyaz Fırın alıntı, Tuğba/Beyaz Fırın video-2)
doğru render olduğu doğrulandı, konsol hatasız. **Yeni ders (mevcut
Vite önbellek kuralına ek):** `astro build` dev server AÇIKKEN
çalıştırılırsa da aynı `_jsxDEV` bozulmasını tetikleyebiliyor — build
sonrası dev server'a dönülüyorsa MUTLAKA `npm run dev:clean` ile
yeniden başlatılmalı (bu zaten CLAUDE.md'nin §Development bölümünde
yazılıydı, ama bu turda pratikte doğrulandı/pekiştirildi).

**🟢 2026-08-20, ayrıca — Ana sayfaya, hero'daki dashboard widget'ının
HEMEN ALTINA, Personio tarzı bir "Müşteri Hikayeleri" carousel'i eklendi
(4 dil).** Önce keşif yapıldı: `/musteriler/`'in `CUSTOMER_STORIES`'inde
5 gerçek hikaye (+ Civil'in ayrı ikinci bloğu) olduğu, ama istenen video/
istatistik kart başlığı formatındaki ("Firma X'in Y sorununu Z%
azalttığını izleyin") somut sonuç cümlesinin hiçbir veride bulunmadığı
tespit edildi — kullanıcı onayıyla **nötr başlık** kullanıldı (uydurma
yüzde yok, KARAR 1). Ayrıca yalnızca `CUSTOMER_LOGO_MARQUEE`'de GERÇEK
logosu olan firmalar dahil edildi — Femaş/Doğ-Ser'in logosu yok,
kullanıcı onayıyla bu turda **hariç tutuldu**. Sonuç: 3 kart, 3 farklı
tip — Civil (video, ikincil blok/Mustafa Yıldıran), Yatsan (alıntı/
Müzeyyen Kıran Mergen), Tuğba Kuruyemiş (istatistik). Kart metni
YENİDEN YAZILMADI — mevcut `customerStories.ts`/i18n'in
`customerStories` şemasından aynen yeniden kullanıldı, yalnızca 2 yeni
nötr başlık cümlesi + carousel UI metni (`home.customerCarousel`, 4 dil)
eklendi. "Devamını Oku" `/musteriler/#<anchor>`'a gidiyor —
`CustomerStoryRow.astro`'ya yeni `id` prop'u eklenip
`CustomerStoriesPage.astro`'da her bloğa (`story.key`/`${story.key}
-secondary`) atandı. Video kartı mevcut `YoutubeClickToPlay.tsx`'i
DEĞİŞİKLİKSİZ yeniden kullanıyor. Yeni dosyalar: `customerStoryCarousel.ts`
(locale-bağımsız kart tanımı), `CustomerStoryCarousel.tsx` (React,
`client:visible`, native `scroll-snap` + ok butonları — kartlar TÜRE
göre farklı yükseklik taşıdığı için `TestimonialCarousel.tsx`'in sabit
panel yükseklikli grid-stack tekniği DEĞİL), `CustomerStoryCarouselSection.astro`
(sarmalayıcı). `astro check` 0 hata (341 dosya), `astro build` 881
sayfa, `check-image-alt-text`/`check-link-accessibility` 0 eksik,
Chrome'da 4 dilin hepsinde (TR/EN/NL/IT) görsel doğrulandı — video
tıkla-oynat çalışıyor, "Devamını Oku" doğru bloğa scroll ediyor, konsol
hatasız. **Bilinçli açık nokta:** yalnızca 3 kart var (carousel'in
"sonsuz döngü" hissi için ince — istenirse Femaş/Doğ-Ser'e logo
bulunup eklenebilir, ayrı bir karar).

**Aynı gün, dördüncü tur — Beyaz Fırın'a AYRICA bir video kartı eklendi
(5. carousel kartı).** Kullanıcının paylaştığı YouTube linki (`ru4gVy9-sOQ`)
Civil'in video kartıyla AYNI desende (`YoutubeClickToPlay`, gerçek
`maxresdefault.jpg` thumbnail + tıkla-oynat) yeni bir karta çevrildi —
Beyaz Fırın artık carousel'de 2 kez var (video + alıntı), ikisi de
`/musteriler/#beyazFirin`'e gidiyor (o blok yalnızca alıntıyı gösteriyor,
video ayrıca embed edilmedi). **2 teknik düzeltme gerekti:** (1)
`CustomerStoryCarouselSection.astro`'nun `base.key`'i önceden yalnızca
`storyKey`'di — aynı firmanın 2. kartı eklenince React key çakışması
oluşurdu, `${storyKey}-${type}`'a çevrildi; (2) video başlığı önceden
TÜM video kartları için sabit `cc.civilVideo.headline` kullanıyordu
(yalnızca 1 video kartı olduğu için fark edilmemişti) — `storyKey`'e
göre başlık seçen bir `VIDEO_HEADLINES` haritasına çevrildi. Yeni i18n
anahtarı `home.customerCarousel.beyazFirinVideo.headline` (4 dil, nötr
başlık — Civil'inkiyle aynı kalıp). `astro check` 0 hata, `astro build`
881 sayfa, erişilebilirlik script'leri 0 eksik, Chrome'da DOM üzerinden
(`querySelector`) 5 kartın da doğru sırada/içerikte render olduğu +
video kartının gerçekten oynatıldığı doğrulandı.

**Aynı gün, üçüncü tur — Beyaz Fırın 4. carousel/Müşteriler kartı olarak
eklendi + kartlar tekrar büyütüldü.** Kullanıcı gerçek bir alıntı (Nuri
Sütlüoğlu, İnsan Kaynakları Müdürü) + 2 gerçek fotoğraf (kendi portresi +
Beyaz Fırın'ın Moi şubesi vitrin fotoğrafı, ikisi de `public/images/`'e
yerelleştirildi) paylaştı. Kapsam: (1) `CustomerStoryLabels.employeeCount`
opsiyonel yapıldı (Beyaz Fırın'da çalışan sayısı YOK, uydurulmadı — KARAR
1) + `CustomerStoriesPage.astro`'nun stats-oluşturma mantığı buna göre
korundu; (2) `/musteriler/` sayfasına Doğ-Ser/Tuğba'yla aynı desende
(yalnızca alıntı) YENİ bir blok eklendi (`customerStories.ts` + 4 dil
i18n); (3) carousel'e 4. kart (alıntı tipi) eklendi. **Yan bulgu:**
Tuğba Kuruyemiş kartının "Devamını Oku" anchor'ı yanlışlıkla kebab-case
(`tugba-kuruyemis`) yazılmıştı, sayfadaki gerçek id camelCase
(`tugbaKuruyemis`) — bu turda fark edilip düzeltildi. Kullanıcı AYRICA
"kartların boyutları ve puntoları biraz daha büyüsün" dedi — 420px→480px,
tüm iç yazı boyutları bir kademe daha büyütüldü (üçüncü size-up turu).
`astro check` 0 hata, `astro build` 881 sayfa, `check-image-alt-text`/
`check-link-accessibility` 0 eksik (2 kez doğrulandı), Chrome'da TR'de
4. kart + "Devamını Oku"nun doğru anchor'a (`#beyazFirin`) gittiği + yeni
Müşteriler bloğu görsel doğrulandı.

**Aynı gün, ikinci tur — kartlar büyütüldü + tonu hero widget'ıyla
eşleştirildi.** Kullanıcı "daha büyük canlı ve arka planının tonu bizim
isteğimize uyacak şekilde" dedi: kart genişliği 340px→420px, iç boşluk/
yazı boyutları büyütüldü (istatistik sayısı `text-3xl`→`text-5xl`), ve
ÜÇ kart tipinin de arka planı — önceki turda video/alıntı beyaz, yalnızca
istatistik pembeydi (tutarsız) — hero'daki dashboard widget'ının
ÇERÇEVESİYLE (`HeroSection.astro`, `#FFDCDC→#FFF3F3→#FFFFFF→#FFF3F3→#FFDCDC`
gradyanı) AYNI kırmızı tonlu gradyan ailesine (`CustomerStoryCarousel.tsx`'in
`CARD_BG_GRADIENT` sabiti) çevrildi + hover'da hafif kalkma efekti eklendi.
`astro check` 0 hata, `astro build` 881 sayfa, `check-image-alt-text`/
`check-link-accessibility` 0 eksik, Chrome'da TR'de görsel doğrulandı.

**🟢 2026-08-20, ayrıca — "Kullanıcı Dostu Panel" bölümündeki 2.
lead-capture form kaldırıldı (4 dil).** Kullanıcı ekran görüntüsü
paylaşıp "başvuru butonunu kaldır, dashboard ve açıklama kalsın" dedi:
`PanelFeatureSection.astro`'daki `HeroForm.tsx` reuse'u (İsim/Telefon/
Firma/Email + "Hemen Başvur" formu, hero'daki ile aynı alanlara sahipti)
tamamen kaldırıldı — dashboard görseli (sol) + başlık/açıklama/checklist
(sağ, "Anlık Bilgiler/Hatırlatmalar/Gerçek Zamanlı Monitör") aynen kaldı.
Artık kullanılmayan `HomePanelLabels.formHeading`/`formSubmit` i18n
alanları da 4 dilde temizlendi (4f3b880). `astro check` 0 hata, `astro
build` 881 sayfa, `check-image-alt-text`/`check-link-accessibility` 0
eksik, Chrome'da TR ana sayfasında görsel doğrulandı (form yok, geri
kalan içerik sağlam). **Not:** bu turda da dev server aynı bilinen Vite
modül-runner hatasını verdi (`npm run dev:clean` ile düzeldi, kodla
ilgisiz — bkz. bir önceki maddedeki aynı not).

**🟢 2026-08-20, ayrıca — "Neden idenfit?" videosu + 4'lü özellik kartı
yazıları canlı idenfit.com'a göre büyütüldü.** Kullanıcı iki ekran
görüntüsü paylaşıp "puntoyu büyüt" + "videoyu ana sitedekine benzer
şekilde büyüt" dedi; canlı sitede `getComputedStyle`/`getBoundingClientRect`
ile ölçüldü: video 788.8px (1536px viewport, bizimki `max-w-2xl`=672px'e
sıkışmıştı), kart başlığı 24px/600/leading 29px (bizimki `text-lg`=18px),
kart açıklaması 16px/400/leading 20px (bizimki `text-sm`=14px).
`VideoSection.astro`'da `max-w-2xl` kaldırılıp video dış `max-w-3xl`
konteynerini (768px, canlıya %2.6 farkla yakın) dolduruyor;
`FeatureGrid.astro`'nun 4 kartında ölçülen kesin px değerleri birebir
uygulandı (6cd430c). `astro check` 0 hata, `astro build` 881 sayfa,
`check-image-alt-text` 0 eksik, Chrome'da TR ana sayfasında görsel
doğrulandı (video belirgin şekilde büyüdü, kart yazıları okunaklı
büyüklükte). **Not:** dev server bu turda bir Vite modül-runner hatası
verdi (`node/module-runner.js`, "undefined is not a function") —
kodla ilgisizdi, `npm run dev:clean` ile düzeldi (kalıcı çözüm zaten
CLAUDE.md'de belgeli).

**🟢 2026-08-20, ayrıca — HRTech Alliance partner bölümü ana sayfadan
kaldırıldı (4 dil).** Kullanıcı isteğiyle `HrtechSection.astro`
("Tüm İK İhtiyaçları İçin Tek Noktadan Çözüm") ve 4 locale
`index.astro`'daki kullanımı kaldırıldı; artık kullanılmayan i18n
`hrtech` çeviri blokları (`HomeHrtechLabels` tipi dahil) +
`homeContent.ts`'teki `HRTECH_ALLIANCE_URL`/`HRTECH_LOGO_URL`/
`HOME_HRTECH_IMAGE` export'ları da temizlendi (a5dab4b). `astro check`
0 hata (336 dosya), `astro build` 881 sayfa, `check-image-alt-text` 0
eksik, Chrome'da TR ana sayfasında SSS'ten (Sıkça Sorulan Sorular)
doğrudan footer'a geçtiği doğrulandı. **Yan bulgu (aksiyon alınmadı,
kapsam dışı bırakıldı):** `check-heading-hierarchy.mjs` ana sayfanın
4 dilinde de `H1→H3` seviye atlaması raporluyor (hero H1'inden hemen
sonra Ürün Önizleme widget'ının `SectionMiniHeader`'ı H3 kullanıyor,
aralarında H2 yok) — bu turdan ÖNCE de aynı şekilde vardı (`git stash`
ile doğrulandı, Hrtech kaldırmayla İLGİSİZ, önceden fark edilmemiş bir
bulgu). Bkz. Açık nokta #36.

**🟢 2026-08-20 — Ürün Önizleme widget'ının dış boyutu Personio
referansına göre kısaltıldı + TR ana sayfasındaki tekrarlı ikinci widget
kaldırıldı, Açık nokta #35 KAPANDI.** Kullanıcı Personio.com'un ana
sayfasındaki dashboard mockup'ıyla karşılaştırıp "dış boyut benzer olsun,
daha kısa ve anasayfada gezinirken rahat okunsun" dedi: sekme içeriği
stratejisi paylaşımlı `min-h`'ten (6 turluk ayar geçmişi, dış yükseklik
~1453px) **sabit `max-h-[620px]` + `overflow-y-auto`'ya** çevrildi —
header/sidebar her zaman tam görünür kalıyor, yalnızca kart listesi
gerektiğinde kendi içinde kayıyor (`ProductPreviewWidget.tsx`); hiçbir
kart/veri kaldırılmadı. Ardından, hero'daki canlı widget artık tek başına
yeterli görüldüğü için sayfanın aşağısındaki tekrarlı "Panelinizde Sizi
Neler Bekliyor?" bölümü (`HomeProductPreview.astro`) ve `index.astro`'daki
kullanımı tamamen kaldırıldı — Açık nokta #35'in bekleyen kararı bu turda
verildi (aşağı bölüm kaldırıldı, hero'daki kaldı). Sayfa akışı
FeatureGrid'den doğrudan EfficiencySection'a geçiyor, aradaki divider
metni korunduğu için geçiş sorunsuz. `astro check` 0 hata (337 dosya),
`astro build` 881 sayfa, `check-image-alt-text` 0 eksik, Chrome'da
TR ana sayfasında görsel doğrulandı (widget'ın iç kaydırması header/
sidebar'ı etkilemiyor, widget'tan sonra tekrar YOK). Commit edildi
(a85929d resize, bfa6c15 kaldırma). **Çalışma ağacı temiz, bekleyen
commit YOK.**

**🟢 Aynı gün (2026-08-19), ayrıca — bağımlılık sağlığı denetimi +
temizliği.** Kullanıcı "güvenlik açığı/kullanılamaz paket var mı"
denetimi istedi: `npm run audit` 0 açık döndü, ama `npm ls --all`
gerçek bir `node_modules`/lockfile drift'i ortaya çıkardı
(`yargs-parser@21.1.1 invalid` — lockfile 22.0.0 istiyordu — + 5 öksüz
`extraneous` paket, `playwright`/`playwright-core` dahil). Kullanıcı
onayıyla: dev server durduruldu → `npm ci` (lockfile'la birebir temiz
kurulum, drift tamamen giderildi) → `npm run dev:clean`. Ardından 4
güvenli minor/patch paket güncellendi (`@astrojs/markdown-remark`
7.2.2→7.2.4, `@astrojs/react` 6.0.2→6.0.4, `astro` 7.2.2→7.2.4,
`lucide-react` 1.32.0→1.33.0 — `typescript` yine BİLİNÇLİ atlandı, major
sıçrama). Her adımda `astro check`/`astro build`(881 sayfa)/`npm audit`
tekrarlanıp 0 hata/0 açık doğrulandı, dev server temiz restart sonrası
hydration hatasız (11 `astro-island`, log'da `TypeError`/`_jsxDEV` yok).
Commit edilip push edildi (669e401). **Çalışma ağacı temiz, dev server
şu an ayakta (`localhost:4321`) — bir sonraki oturum doğrudan devam
edebilir, bekleyen bir adım yok.**

**🟢 Aynı gün (2026-08-19), ayrıca — Hakkımızda sayfasının ekip fotoğrafı
(`ABOUT_TEAM_PHOTO_IMAGE`) `wp-content/uploads` hotlink'inden yerel
`public/images/about-team-photo.jpg`'ye taşındı (kullanıcının sağladığı
aynı kolaj görseli, 4096×2235 — Açık nokta #14'ün genel kapsamı dışında,
tek seferlik bir istekle kapatıldı). TR/EN/IT'nin üçü de aynı sabiti
paylaştığı için tek değişiklik yeterliydi. `astro check` 0 hata, `astro
build` 881 sayfa, `check-image-alt-text` 0 eksik, Chrome'da TR+EN görsel
doğrulandı (9087db0).**

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
tarayıcı bar'ı içinde gerçek/etkileşimli widget render ediliyor (o an
`locale === 'tr'` koşuluyla YALNIZCA TR'de — ON BİRİNCİ turda, aşağıda,
bu koşul kaldırılıp 4 dile genişletildi). **BİLİNÇLİ AÇIK NOKTA:** sayfanın aşağısındaki
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

**🟢 Aynı gün (2026-08-19) ON BİRİNCİ tur — canlı widget artık 4 dilin
HEPSİNDE gösteriliyor, TR-only kısıtı KALDIRILDI.** Kullanıcı "diğer
dillerde canlı dashboard görünmüyor, düzelt" dedi: DOKUZUNCU turdaki
`locale === 'tr'` koşulu (widget/statik-görsel dallanması) tamamen
kaldırıldı, widget artık koşulsuz render ediliyor. Statik
`HOME_HERO_IMAGE`/`heroImage`/`sideTitle`/`sideSubtitle` dalı `HeroSection.astro`'dan
KALDIRILDI (kullanılmayan import da temizlendi) — i18n şemasındaki
`sideTitle`/`sideSubtitle` alanlarına dokunulmadı (başka yerde
kullanılmıyorlar ama şema değişikliği bu turun kapsamı dışında).
**Widget'ın içeriği hâlâ Türkçe** (kurgusal veri/etiketler) — bu artık
BİLİNÇLİ bir kullanıcı kararı (i18n kapsamı sorusu fiilen kapandı, TR
harici sayfalarda da Türkçe dashboard gösterme kararı verildi), Açık
nokta olarak işaretlenmiyor. Chrome'da 4 dilin hepsinde widget'ın
render edildiği + hydrate olduğu doğrulandı, `astro check` 0 hata,
`astro build` 881 sayfa, `check-image-alt-text` 0 eksik (regresyon yok).

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
2. **İSKELET TAMAMLANDI (2026-09-02) — kod hazır, yalnızca SendGrid
   anahtarı bekleniyor.** Eski durum (backend yok, 6 form etkileniyor,
   KVKK hukuki risk notu) artık CLAUDE.md'deki "🔶 AÇIK NOKTA (2026-08-30)"
   bloğunda GÜNCEL haliyle kayıtlı, bkz. orası (bu blok kapatılmadı,
   yalnızca güncellendi — anahtar gelene kadar hukuki risk notu hâlâ
   TEKNİK olarak geçerli, formlar hâlâ hiçbir yere gerçek e-posta
   göndermiyor, yalnızca artık DOĞRU bir hata mesajı gösteriyorlar).
6. Mesafeli Satış Sözleşmesi'nin kobi/mikro TR varyantları kurulmadı.
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
12. **TODO — HR Maturity Test sonuç sayfasının PDF rapor gönderimi
    backend'siz** (madde 2 ile aynı Faz 2 kategorisi).
13. **BULGU — site geneli sabit WhatsApp/Ara widget'ı yok, kaynakta
    var.** Kapsam dışı, istenirse eklenebilir.
14. **TAMAMEN KAPANDI (2026-08-30) — 622 blog yazısının TÜM görselleri
    yerelleştirildi VE `.md`'lerdeki URL'ler göreliye çevrildi, blog
    artık `idenfit.com` domainine hiç bağımlı değil.** Kullanıcının
    paylaştığı bir denetim raporu "973 blog görseli eski WordPress'e
    mutlak URL'yle bağlı, DNS geçişinde hepsi 404 verir" bulgusunu
    getirdi, 2 turda kapatıldı:
    1. **Yerelleştirme:** 976 benzersiz görsel dosyası doğrulandı (622
       `.md`'de, `public/wp-content/uploads/`'da 0'ı mevcuttu).
       `reference/wordpress-export/uploads.zip` bu makinede YOK
       (gitignore'da, hiç commit edilmemiş) — `scripts/localize-images.mjs`
       bu yüzden kullanılamadı. Bunun yerine eski WP sitesinin
       (`idenfit.com`) hâlâ canlı olduğu doğrulanıp yeni
       `scripts/download-blog-images.mjs` yazıldı — 622 `.md`'yi tarayıp
       benzersiz görselleri doğrudan HTTP ile indirip AYNI göreli yola
       yazıyor, her dosya için 0-byte + magic-byte (PNG/JPEG/GIF/WEBP/SVG
       imzası) doğrulaması yapıyor. **976/976 indirildi, 0 hata** (25'lik
       pilot + 951'lik toplu tur).
    2. **URL göreliye çevirme:** yeni `scripts/relativize-blog-image-urls.mjs`
       ile 620 `.md` dosyasındaki `https://idenfit.com/wp-content/uploads/`
       önekleri `/wp-content/uploads/`'a çevrildi (25'lik pilot + 595'lik
       toplu tur, **toplam 1039 URL, 0 kalan mutlak referans**).
    **Doğrulama (her iki turda da tekrarlandı):** `astro build` (3097
    sayfa) + `check-image-alt-text`/`check-json-ld`/`check-link-accessibility`
    sıfır regresyon. `dist/`'teki TÜM `/wp-content/uploads/` referansları
    (URL-decode edilerek) dosya varlığına karşı tek tek doğrulandı:
    981/991 gerçek blog-görseli referansı sağlam, kalan 10'u blog
    içeriğiyle İLGİSİZ (`src/data/navigation.ts`'teki KEŞFET mega-menü
    "Raporlar" kartlarının PDF/PNG'leri — muhtemelen bu maddenin eski
    "10 veri dosyası" notuna karşılık geliyor, AYRI/dokunulmamış bir
    kapsam, bilinçli olarak bu turun dışında bırakıldı). Chrome'da
    `astro preview` ile 4 yazı (mojibake dosya adı içeren
    `is-gorusmesinde-ne-giyilmeli` dahil) `read_network_requests` ile
    tek tek doğrulandı — TÜM görsel istekleri artık `localhost:4321`'e
    gidiyor, `idenfit.com`'a HİÇ istek atılmıyor (URL göreli
    olduğu için domain'e bağımlılık tamamen kalktı). Script'ler:
    `scripts/download-blog-images.mjs` + `scripts/relativize-blog-image-urls.mjs`
    (ikisi de yeni, kalıcı/yeniden kullanılabilir). `scripts/localize-images.mjs`
    (eski, zip tabanlı) hâlâ duruyor ama artık kullanılmıyor.
    **Ek tur (2026-08-30, aynı gün) — `src/data/navigation.ts`'teki
    KEŞFET mega-menü "Raporlar" kartları (9 URL) + `src/pages/blog/
    [slug].astro`'daki site logosu (OG/JSON-LD publisher fallback'i, 1
    URL) da AYNI yöntemle (yeni `scripts/download-report-assets.mjs`,
    PNG/SVG/PDF magic-byte doğrulamalı) yerelleştirildi ve göreliye
    çevrildi — 10/10 dosya, 0 hata.** Artık **blog + mega-menü, eski
    idenfit.com'a SIFIR bağımlı** — `astro build` +
    `check-image-alt-text`/`check-json-ld`/`check-link-accessibility`
    sıfır regresyon, Chrome'da KEŞFET menüsü açılıp 4 rapor kartının
    `localhost:4321`'den yüklendiği `read_network_requests` ile
    doğrulandı. **YENİ bulgu (bu turda keşfedildi, KAPSAM DIŞI
    bırakıldı) — bkz. Açık nokta #45:** `dist/` genelinde
    TARANDIĞINDA, blog+navigation dışında **~300 sayfada yüzlerce**
    başka `idenfit.com/wp-content/uploads/...` hotlink'i daha var
    (ürün/sektör sayfası bölüm görselleri, Müşteri Hikayeleri
    carousel'inin bazı portreleri, hesaplama araçları ikonları, KVKK/
    güvenlik PDF'leri, 404 sayfası arka planı vb.) — bu maddenin
    kapsamına hiç girmemiş, çok daha büyük ve AYRI bir iş.
15. **YARIM KALAN — İK Olgunluk Testi'nde 2 açık uç:** Section 2 rozet
    boyutu (yalnızca ilk kart pilot), Section 3 checklist ikon rengi
    (kullanıcıdan DevTools hex kodu bekleniyor).
16. **KAPANDI (2026-09-02) — blog "yeni yazı senkronizasyonu" artık
    periyodik/otomatik DEĞİL.** Kullanıcı kararı: cutover öncesi yapılan
    tur (bkz. §Tamamlanan işler, "Son blog senkronizasyonu") bu sürecin
    SON otomatik toplu senkronizasyonuydu. **Bundan sonra yeni yazılar
    Keystatic panelinden ekleniyor, otomatik senkronizasyon
    kullanılmıyor** — `post-sitemap.xml` vs yerel `.md` karşılaştırma
    yöntemi (kanıtlanmış, bkz. `extract-blog-posts.mjs`/
    `migrate-blog-to-markdown.mjs`/`download-blog-images.mjs`/
    `relativize-blog-image-urls.mjs` zinciri) artık kullanılmayacak.
19. **KARAR — Faz 2 CMS: Decap CMS.** Kurulum devam ediyor, bkz. madde 21.
20. **SÜREÇ — `npm audit` periyodik hale getirildi** (`npm run audit`,
    her önemli değişiklik/deploy öncesi). Şu an 0 açık.
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
24. **KAPANDI — DOM boyutu (Chrome "1587/1501 element" uyarısı):**
    MobileMenu masaüstünde 2026-08-10'da, MOBİLDE 2026-08-17'de
    düzeltildi (`hasOpened` state, ilk tıklamaya kadar hiç mount
    edilmiyor). Son ölçüm: 1587→1327 element (-%16.4). MegaMenu hâlâ
    BİLİNÇLİ olarak ertelenmiş durumda, bkz. madde 25.
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
28. **KAPANDI (2026-08-25) — Blog yazılarının `<title>` uzunluğu.**
    Kalan 404 blog yazısı (219 kısa + 185 uzun, + 31 zaten tamamlanmıştı)
    ve 4 site sayfası (1 TR + 1 EN + 2 IT, `buildIdenfitTitle()`'ın
    otomatik niteleyicisi 61-63 karaktere taşmıştı) düzeltildi.
    `check-title-length.mjs`: 409 → **1 sorunlu sayfa** (yalnızca kasıtlı
    kapsam dışı `admin/index.html`, Decap CMS kabuğu).
    **Yöntem:** 25 örneklik pilot kullanıcıya sunulup onaylandı (2 düzeltme
    talebiyle: gerçek içeriği aynı olan 2 "gelir vergisi" yazısının
    başlıkları birbirinden uzaklaştırıldı; "X Rehberi Nedir?" gibi doğal
    olmayan Türkçe kalıplardan kaçınıldı), ardından kalan ~379 kayıt
    script-destekli (içerik başlıklarından/excerpt'ten beslenen kural
    tabanlı üretim + uzunluk doğrulama) toplu üretildi. **Üretim sonrası
    kalite taraması** (tüm 435 metaTitle — 404 yeni + 31 eski — arasında
    kelime-örtüşme benzerliği) 2 gerçek hata yakaladı: `truncateAtWord`
    iki yazıda ayırt edici yılı (`ihbar-tazminati-hesaplama-2020`,
    `...-2023`) kesip atmıştı, elle düzeltildi. Ayrıca kaynak WP
    verisinde birebir aynı başlığı taşıyan 2 gerçek çift bulundu
    (`bordro-ve-yan-hak-yonetimi` / `...-sirketler-icin-kapsamli-rehber`
    — aynı içeriğin ~5 ay arayla güncellenmiş hali; `reskilling-upskilling`
    / `upskilling-ve-reskilling` — aynı konunun 2022'de 4 ay arayla
    yayımlanmış 2 versiyonu), her ikisinde de içerik/heading'lere bakılıp
    gerçek bir farka (FAQ bölümü var/yok, "dijital dönüşüm" çerçevesi)
    dayanan ayrı başlıklar verildi — uydurma bir fark İCAT edilmedi.
    Site-sayfası 4 kenar durumu için `HubPage.astro`'ya `ProductPage`'teki
    AYNI `title` override prop'u eklendi (`moduli-gestione-risorse-umane`
    hub'ı için gerekiyordu, önceden yoktu). Uygulama: `posts.json`'a 400
    kayıt, 4 markdown pilot yazıya frontmatter, 4 site sayfasına
    `titleOverride`. `git diff --stat` ile `posts.json` değişikliğinin
    yalnızca +2 satır/yazı (mevcut içeriğe dokunmadan) olduğu doğrulandı.
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
35. **KAPANDI (2026-08-20) — TR ana sayfasında `ProductPreviewWidget`
    İKİ kez render ediliyordu** (2026-08-19, DOKUZUNCU tur: hero'da VE
    sayfanın aşağısındaki "Panelinizde Sizi Neler Bekliyor?" bölümünde).
    Karar verildi: hero'daki widget tek başına yeterli, alt bölüm
    (`HomeProductPreview.astro`) ve kullanımı tamamen kaldırıldı
    (bfa6c15).
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
       edildi: `<a href="/online-sunum-talebi/" class="btn-cta ...">
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
45. **KAPSAMI NETLEŞTİRİLDİ (2026-08-30) — Blog+navigation DIŞINDA,
    sitenin geri kalanında hâlâ 307 sayfada 293 benzersiz
    `idenfit.com/wp-content/...` hotlink'i var, henüz DOKUNULMADI.**
    Yeni kalıcı denetim script'i (`scripts/audit-remote-hotlinks.mjs`,
    `dist/`'i tarar, indirme/değiştirme YAPMAZ) ile tam site taraması
    yapıldı. **Sonuç:** 3097 HTML dosyasının 307'sinde (%9.9) toplam 293
    benzersiz uzak dosya referansı — 119 PNG, 93 WEBP, 59 SVG, 14 PDF,
    7 JPG, 1 JPEG. En sık geçen tekil dosya `pnl-img-1024x644.webp`
    (`homeContent.ts`, 111 sayfada — ürün/modül sayfalarının paylaştığı
    "Verimlilik" CTA paneli + blog liste/sayfalama sayfaları); 6 sektör
    ikonu (`sektor-*-icon.svg`) 8-25 sayfa arasında tekrarlanıyor.
    **İki farklı kaynak/düzeltme yolu var:**
    (A) **19 TypeScript dosyasında LİTERAL mutlak URL** (~392 tekil
    occurrence, çoğu tekrarlayan ikon): `productTranslationOverrides.ts`
    (107) + `...OverridesAz.ts` (70), `sectorTranslationOverrides.ts`
    (56), `homeContent.ts` (37), `miscPagesTranslationOverrides.ts` (24),
    `hubTranslationOverrides.ts` (24) + `...OverridesAz.ts` (23),
    `hardwareTranslationOverrides.ts` (16), `customerStories.ts` (10),
    `calculatorDefinitions.ts` (8), `thankYouContent.ts` (4),
    `miscPagesContent.ts` (3), `faqContent.ts` (3),
    `customerStoryCarousel.ts` (2), `supportThankYouContent.ts` (1),
    `PricingPage.astro` (1), `NotFoundPage.astro` (1),
    `IdenfitLogo.tsx` (1), `CalculatorsPage.astro` (1) — bunlar Açık
    nokta #14'teki blog/navigation'la BİREBİR AYNI yöntemle (indir +
    göreliye çevir) düzeltilebilir.
    (B) **Ham WordPress export JSON'larından RUNTIME'da okunan `image`
    alanları** (literal string DEĞİL, `b.image` gibi pass-through) —
    `productContent.ts`←`products.json`, `sectorContent.ts`←`sectors.json`,
    `hardwareContent.ts`←`hardware.json`, `hubContent.ts`←`hubs.json`,
    `miscPagesContent.ts`←`misc-pages.json`. Bunlar bul-değiştir ile
    düzeltilemez — ya (i) her `*Content.ts`'te alanı okurken tek satırlık
    bir `.replace(/^https:\/\/idenfit\.com\/wp-content\//, '/wp-content/')`
    dönüşümü eklenir (blog `date`'in `+03:00` normalizasyonuyla AYNI
    desen, düşük risk) ya da (ii) ham JSON dosyalarının kendisi
    güncellenir (5 dosya, çok daha büyük/riskli bir diff). **(i) önerilir.**
    Ayrıca `404.html`'in arka plan görseli `wp-content/themes/vault/...`
    yoluna gidiyor — bu `uploads/` bile değil, farklı bir WP tema
    varlığı, ayrı ele alınmalı (muhtemelen tek dosya, `NotFoundPage.astro`).
    **Tahmini efor:** (A) yolu blog/navigation turlarıyla aynı ölçekte
    (~1-2 saat, script zaten hazır — yalnızca kaynak dosya listesi
    genişletilip yeniden çalıştırılır). (B) yolu kod olarak küçük (5
    dosyada birer satır) ama önce 293 benzersiz dosyanın TAMAMININ
    indirilip doğrulanması gerekir (aynı `download-*.mjs` deseniyle,
    tahmini 30-60 dk) + build/regresyon/Chrome doğrulaması (~1 saat).
    **Toplam kaba tahmin: 3-5 saat, tek turda yapılabilir.** Kod
    değişikliği HENÜZ YAPILMADI — yalnızca kapsam netleştirildi,
    kullanıcı onayı bekliyor. **Sıradaki oturum için plan (kullanıcı
    kararı, 2026-08-30):** ÖNCE (A) yolu (19 sabit-kodlu dosya, ~1-2
    saat, daha hızlı/düşük riskli) tamamlanıp SONUÇ GÖSTERİLECEK —
    kullanıcı onayı alınmadan (B) yoluna (5 JSON-kaynaklı dosya, ~1-2
    saat) GEÇİLMEYECEK. İki yol birbirinden bağımsız çalışıyor, aynı
    turda art arda yapılabilir ama onay noktası (A) ile (B) arasında.
    **TAMAMEN KAPANDI (2026-09-02) — 293/293 hotlink temizlendi, sitede
    idenfit.com'a giden SIFIR hotlink kaldı.**
    - **Yol (A):** Yeni `scripts/localize-remaining-hotlinks.mjs`
      (`download-report-assets.mjs` + `relativize-blog-image-urls.mjs`
      ile AYNI indirme/doğrulama mantığı, tek script'te birleşik + CLI'dan
      pilot/tam liste seçimi). Önce 6 küçük dosyayla PİLOT yapılıp
      kullanıcıya diff gösterildi, onay alındı; sonra kalan 12 dosya
      (`NotFoundPage.astro` hariç, o ayrı ele alındı — aşağıda) aynı
      script'le tamamlandı. **232 benzersiz görsel** indirildi (çoğu
      blog/navigation turundan zaten mevcuttu), **379 URL** göreliye
      çevrildi, 0 başarısız indirme.
    - **Yol (B):** 5 dosyada (`productContent.ts`, `sectorContent.ts`,
      `hardwareContent.ts`, `hubContent.ts`, `miscPagesContent.ts`) her
      birinin onlarca farklı okuma noktasını (`image`/`images[]`/
      `backgroundImage`/`heroImage`/`officesImage`/`mapImage` vb.) tek tek
      avlamak yerine (yüksek kaçırma riski), yeni PAYLAŞILAN
      `src/data/relativizeWpUrls.ts`'in `deepRelativizeWpUrls()`'ü —
      ham JSON `DATA` sabiti import edilir edilmez TÜM ağacı derinlemesine
      gezip (zengin metin/HTML'e gömülü `<img src>` dahil) mutlak
      `idenfit.com/wp-content/` önekini göreliye çeviriyor. Blog'un `date`
      `+03:00` normalizasyonuyla AYNI ilke: kaynakta değil, ithal edildiği
      TEK merkezi noktada dönüştürülüyor — mevcut VE ileride eklenecek
      TÜM getter'lar otomatik olarak zaten-göreli veri okuyor.
      `hubContent.ts`'te 2026-09-01'den kalma yerel `relativizeWpUrl()`
      (yalnızca hero görseline uygulanıyordu) artık gereksiz, kaldırıldı.
      Yeni `scripts/download-json-source-images.mjs` (JSON ağacını
      gezip TÜM görsel/dosya referanslarını toplar) **262 benzersiz
      dosya** indirdi (183'ü zaten mevcuttu).
    - **Bulunan ve düzeltilen gerçek bir indirme hatası:** bir dosya adı
      Türkçe büyük "İ" taşıyordu, kaynak JSON'da PARÇALANMIŞ Unicode
      biçiminde (`I` + U+0307 birleştirme noktası) ama canlı sunucudaki
      GERÇEK dosya BİRLEŞİK biçimde (`İ`, U+0130) — ham (encode edilmemiş,
      normalize edilmemiş) `fetch()` isteği 404 veriyordu. Düzeltme: uzak
      istek URL'i `encodeURI(relPath.normalize('NFC'))` ile kuruluyor;
      YEREL dosya adı/göreli URL KASITLI OLARAK normalize EDİLMEDİ (kaynak
      JSON'un/`deepRelativizeWpUrls()`'ün üreteceği GERÇEK metinle birebir
      eşleşmesi gerekiyor, aksi halde kendi sitemizde 404 oluşurdu).
    - **404 arka plan görseli** (`NotFoundPage.astro`, `wp-content/themes/vault/...`
      — `uploads/` bile değil, farklı bir WP tema yolu, script'lerin
      kapsamı DIŞINDA bırakılmıştı) elle indirilip
      `public/wp-content/themes/vault/assets/img/bg-404.png`'e yerleştirildi,
      referans göreliye çevrildi.
    - **Doğrulama (her adımdan sonra ayrı `--outDir dist-check` ile,
      çalışan `localhost:4321` önizlemesine HİÇ dokunulmadan):** `astro
      build` temiz, 8/9 regresyon script'i sıfır sorun (aynı ilgisiz
      heading-hierarchy taban çizgisi), `audit-remote-hotlinks.mjs` ile
      azalan sayı her adımda kanıtlandı: 293/307 (başlangıç) → 285/304
      (pilot) → 235/133 (yol A tamamlandı) → 1/5 (yol B tamamlandı,
      yalnızca 404 kaldı) → **0/0 (404 de düzeltilince, TAMAMEN TEMİZ)**.
46. **YENİ (2026-08-31) — CSP Enforcing Mod Geçişi, canlıya çıkış sonrası
    ele alınacak.** Şu an CSP Report-Only modda (`public/_headers` +
    `src/middleware.ts`, bkz. commit `db38013`) — hiçbir şeyi
    ENGELLEMİYOR, yalnızca ihlalleri tarayıcı konsoluna logluyor.
    Enforcing moda (`Content-Security-Policy`, `-Report-Only` olmadan)
    geçmeden önce **3 koşul sağlanmalı:**
    1. Site gerçekten canlıya alınmış olmalı — gerçek ziyaretçi trafiği
       olmadan Report-Only'nin gözlem amacı yerine gelmiyor.
    2. Otomatik CSP ihlal raporu toplama (`report-uri`, küçük bir
       Cloudflare Pages Function) kurulmalı — şu an ihlaller yalnızca
       elle, tarayıcı konsolundan görülebiliyor, otomatik/uzaktan izleme
       yok.
    3. En az 1-2 haftalık sessiz gözlem süresi geçmeli (hiç beklenmedik
       ihlal raporu gelmemeli) — gelirse allowlist güncellenip süre
       sıfırdan başlar.
    Bu 3 koşul sağlanmadan enforcing moda GEÇİLMEYECEK.
47. **KAPANDI (2026-09-02) — 5 form dosyasının `console.log`'u kaldırıldı,
    gerçek `/api/lead` backend'ine bağlandı.** Ad/e-posta/telefon artık
    tarayıcı konsoluna yazılmıyor — SendGrid anahtarı gelene kadar hâlâ
    hiçbir yere GÖNDERİLMİYOR ama en azından artık DENENİYOR ve
    başarısızlık kullanıcıya dürüstçe gösteriliyor (bkz. yukarıdaki
    "🔶 AÇIK NOKTA" bloğunun güncel hali).
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
50. **TAMAMLANDI (2026-08-31) — "pipefail eksikliği" denetimi, kod
    değişikliği GEREKMEDİ; ileriye dönük Cloudflare Pages notu eklendi.**
    Kapsamlı tarama: `package.json`'ın 8 script'i (build/dev/dev:clean/
    audit/vb.) VE bunların çağırdığı `scripts/dev-clean-restart.mjs`/
    `scripts/run-audit.mjs` dosyaları — hiçbirinde shell pipe (`|`)
    kullanımı YOK, hepsi tekil komut. Repo'da `.sh` dosyası veya CI YAML
    config'i de yok. **Yani düzeltilecek bozuk bir script mevcut değildi**
    — `set -o pipefail` eklemek için gerçek bir hedef yoktu.
    **Gerçek risk, projenin kendi kod tabanında DEĞİL, build'i elle
    doğrularken kullanılan `komut 2>&1 | tail -N` deseninde** (bu
    projenin çalışma tarihi boyunca doğrulama turlarında sıkça kullanıldı)
    — canlı olarak kanıtlandı: kasıtlı bozuk bir sayfa eklenip `astro
    build 2>&1 | tail -5` çalıştırıldığında build GERÇEKTEN çöktü (stack
    trace görünür) ama `$?` **0** (başarılı!) döndü — `pipefail`
    açıkken AYNI komut doğru şekilde **127** (başarısız) döndü. Test
    dosyası hemen kaldırıldı, temiz build + regresyon script'leriyle
    doğrulandı. **Kalıcı disiplin:** bundan sonra build/test çıktısı
    `tail`/`grep` gibi bir komuta yönlendirilecekse önce `set -o
    pipefail` (veya exit code'u pipe'tan ÖNCE ayrıca `; echo $?` ile
    kontrol etmek) kullanılmalı — yalnızca son komutun durumuna
    güvenilmemeli.
    **İleriye dönük not:** Cloudflare Pages'e henüz bir build komutu
    YAPILANDIRILMADI (site henüz deploy edilmedi). Deploy ayarlarında
    build komutu girilirken, komut bir pipe içeriyorsa exit code'un
    gerçek build sonucunu yansıttığından emin olunmalı (`pipefail` ile) —
    aksi halde başarısız bir build Cloudflare tarafından "başarılı"
    sanılıp eski/bozuk bir sürüm sessizce yayında kalabilir.
    **Ek bulgu (aynı gün, `pipefail` disiplinini gerçekten uygulayınca
    ortaya çıktı):** projenin 8 kalıcı `check-*.mjs` script'i hepsi AYNI
    kalıbı izliyor — `process.exit(0)` sıfır sorunda, `process.exit(1)`
    HERHANGİ bir sorun bulunursa (bilinen/kabul edilmiş bir açık nokta
    olsa BİLE). Şu an yalnızca `check-heading-hierarchy.mjs` **exit 1**
    veriyor — Açık nokta #36'daki 5 bilinen "ana sayfa H1→H3" sorunu
    yüzünden (YENİ bir regresyon DEĞİL, sayı değişmedi). Bu script'i bu
    konuşma boyunca hep `| tail -N` ile çalıştırıp yalnızca İÇERİĞE
    bakıldığı için exit code'un aslında sürekli 1 olduğu hiç fark
    edilmemişti — tam da yukarıdaki pipefail dersinin somut kanıtı.
    **Sonuç/hatırlatma:** bu script'ler ileride bir CI gate'i olarak
    kullanılacaksa, `check-heading-hierarchy.mjs` Açık nokta #36
    kapanana kadar gate'i KIRACAK — ya #36 önce kapatılmalı ya da gate
    mantığı bu bilinen istisnayı hesaba katmalı.
51. **TAMAMLANDI (2026-08-31) — "Canlı dashboard" widget'ı (`ProductPreviewWidget.tsx`)
    site locale'ine göre dil değiştiriyor artık (Tier 1: yapısal arayüz
    metni), + aynı dosyadaki mobil "tek parça" düzeltmesiyle birlikte
    commit edildi.** Kullanıcı isteği: "anasayfada dil değişimi yapınca
    dashboardın da dilinin değişmesi lazım". Widget 2753 satır, 30+
    kurgusal veri sabiti taşıyor (her biri içine gömülü Türkçe etiketli,
    ör. `{ label: 'İşe Giren', value: '42' }`) — TAMAMININ çevrilmesi
    çok büyük bir iş olduğundan kullanıcı onayıyla İKİ AŞAMAYA bölündü:
    **Tier 1 (bu turda YAPILDI)** — sekme adları, header panel
    başlıkları/aria-label'ları, arama placeholder'ı, görünürlük/avatar/
    bildirim/görev menü öğeleri gibi yapısal arayüz metni; **Tier 2
    (BİLİNÇLİ ERTELENDİ)** — her sekmenin kart içeriğindeki kurgusal
    veri etiketleri, şimdilik TÜM locale'lerde Türkçe kalıyor. **Dil
    kapsamı:** önce TR+EN (kullanıcı seçimi "Önce TR+EN, sonra
    kademeli"), NL/IT/AZ ayrı bir turda eklenecek. **Mimari:**
    `src/data/productPreviewWidgetLabels.ts` (YENİ dosya) —
    `ProductPreviewWidgetLabels` arayüzü + `tr`/`en` implementasyonları,
    `getProductPreviewWidgetLabels(locale)` eksik locale için `tr`'ye
    düşüyor. `Partial<Record<Locale,X>>` KULLANILDI (KARAR 1'in "uydurma
    çeviri yok" kuralı yüzünden `Record<Locale,X>` DEĞİL — TypeScript
    nl/it/az'ı da doldurmaya ZORLARDI). `ProductPreviewWidget.tsx`'e
    `locale: Locale` prop'u eklendi, mevcut `ThemeContext`/`useTheme()`
    kalıbı mirror edilerek yeni `LabelsContext`/`useLabels()` eklendi
    (59 alt bileşen boyunca prop-drilling'den kaçınmak için), modül
    seviyesi `TABS` sabiti `buildTabs(labels)` fonksiyonuna çevrildi.
    `HeroSection.astro`'da `<ProductPreviewWidget client:visible
    locale={locale} />` (zaten scope'ta olan `locale` değişkeni
    yeniden kullanıldı). Kişi adları ("Deniz Aydın"), marka adı
    ("HRTECHTOOLS"), kasıtlı İngilizce slogan ("LATER IS NEVER") ve
    dil seçicinin 11 dilinin isimleri (dekoratif, Tier 1 kapsamı
    dışı) ÇEVRİLMEDİ. **Doğrulama:** `astro check` 0 hata, `astro
    build` 3096 sayfa temiz, 8 regresyon script'inden 6'sı temiz;
    `check-heading-hierarchy` (5, bilinen #36) ve
    `check-html-lang-attribute` (196, bkz. Açık nokta #52) hataları bu
    turdan ÖNCE de aynen vardı — `git stash` ile doğrulandı, bu turun
    değişikliğiyle İLGİSİZ. Chrome'da görsel doğrulama: TR anasayfa
    değişmedi, `/en/` sayfasında sekme adları/placeholder/avatar
    menüsü/bildirimler/görünürlük ayarları İngilizce, Tier 2 veri
    içeriği (grafik başlıkları, kişi adları) plana uygun şekilde
    Türkçe kaldı; iframe-viewport tekniğiyle 387px mobil görünümde
    yatay sekme çubuğu + İngilizce etiketler birlikte doğru çalıştı.
    **GÜNCELLEME (2026-08-31, 2. tur) — Tier 1 NL/IT/AZ'a genişletildi,
    TAMAMLANDI.** Kullanıcı isteği: "diğer diller içinde yap". Terminoloji
    UYDURULMADI — `src/i18n/{nl,it,az}.ts`'in kendi nav/hero içeriğinde
    ZATEN kullandığı gerçek modül adları birebir yeniden kullanıldı (ör.
    NL "Verlofbeheer"/"Salarisadministratie", IT "Gestione Ferie e
    Permessi"/"Buste Paga"/"Controllo Accessi" [site'ın kendi seçtiği
    "Zaman Yönetimi" karşılığı], AZ "İcazə İdarəçiliyi"/"Əmək Haqqı");
    `jobTitle` alanı IT/AZ'da o dildeki gerçek "İK Müdürü" ifadesiyle
    (`it.ts`'in "Responsabile Risorse Umane", `az.ts`'in "İnsan
    Resursları Müdiri" — ikisi de customer-story rolü olarak zaten
    vardı) BİREBİR eşleşti. Karşılığı olmayan birkaç alan ("Veri
    Analizi"/"Eğitim Akademisi") için KARAR 1'e uygun profesyonel çeviri
    üretildi. **Doğrulama:** `astro check` 0 hata, `astro build` temiz,
    8 regresyon script'i (yalnızca bilinen 5 H1→H3 taban çizgisi hariç)
    sıfır yeni sorun, Chrome'da `/nl/`/`/it/`/`/az/` üzerinde sekme
    adları + arama placeholder'ı + jobTitle doğrulandı.
    **Kapsam netleştirmesi (Tier 2 için) — kullanıcı aynı turda "canlı
    dashboard içindeki modüller de çevrilmeli" dedi, kapsam ölçüldü:**
    Tier 2 önceden düşünülenden ÇOK daha büyük — ~30 modül-seviyesi
    kurgusal veri sabiti (`SHIFTS`/`BRANCHES`/`TIME_KPIS`/`HR_EVENTS`/
    `PERFORMANCE_GOALS`/vb.) + render ağacına gömülü ~40 `WidgetCard`
    title/subtitle gibi JSX metni — toplam tahmini 250-300 ayrı çevrilebilir
    alan × 4 eksik dil (EN dahil, Tier 2 EN de ERTELENMİŞTİ) = ~1000-1200
    string. Ayrıca ay/gün kısaltmaları (`Oca`/`Şub`/`Pzt`/`Sal` vb., 6
    farklı sabitte tekrarlanıyor) için elle çeviri yerine `dates.ts`'teki
    `BCP47_LOCALE` ile `Intl.DateTimeFormat(...,{month:'short'})` kullanımı
    planlanıyor (uydurma riski yok, tarayıcının kendi ICU verisi).
    Henüz KOD DEĞİŞİKLİĞİ yapılmadı — mimari + kapsam kullanıcıya
    sunulup onay bekleniyor (bkz. bir sonraki tur).
    **TUR 1 TAMAMLANDI (2026-08-31, 3. tur) — mimari kuruldu + "Zaman
    Yönetimi" sekmesi 4 dilde (EN/NL/IT/AZ) çevrildi.** Kullanıcı "sekme
    sekme, EN önce" seçeneğini onayladı. **Mimari:** `src/data/
    productPreviewWidgetData.ts` (YENİ dosya) — her sekme için ayrı
    `getXLabels(locale)` fonksiyonu (Tier 1'in TEK `ProductPreviewWidgetLabels`
    şeklinden FARKLI olarak, her sekmenin kendi tipi var). Widget'taki
    modül-seviyesi sabitler (`SHIFTS`/`BRANCHES`/`TIME_KPIS`/vb.) metin
    alanlarından ARINDIRILIP yalnızca yapısal veriye (renk/sayı/ikon)
    indirgendi, render'da İNDEKS SIRASIYLA çeviriyle birleştiriliyor.
    Yeni `LocaleContext`/`useWidgetLocale()` eklendi (`LabelsContext`'in
    YANINDA, onu DEĞİŞTİRMEDEN — Tier 1'in ~8 tüketicisinin şeklini
    bozmamak için) — ham `locale`'i taşıyor, her sekme kendi `getXLabels
    (locale)`'ini bu context'ten türetiyor. Ay/hafta günü kısaltmaları
    (`MONTH_ABBREV`/`WEEKDAY_ABBREV`) `Intl.DateTimeFormat`'tan ÜRETİLDİ
    (elle çeviri DEĞİL) — doğrulandı: tr çıktısı widget'ın ÖNCEDEN
    hardcoded değerleriyle (Oca/Şub/.../Ara, Pzt/Sal/.../Paz) BİREBİR
    aynı. `dates.ts`'in `BCP47_LOCALE`'i `export` edildi (ikinci bir
    locale-kodu haritası İCAT EDİLMEDİ). "Detaya Git →" (TÜM sekmelerde
    paylaşılan, `SectionMiniHeader`) Tier 2'ye DEĞİL, Tier 1'e
    (`productPreviewWidgetLabels.ts`'in `detailsLinkText` alanı, 5 dilin
    hepsi dolduruldu) eklendi. **Çevrilen içerik:** sekme başlığı ("Zaman"),
    4 kart (Vardiya Devam Oranı/Fazla Mesai Özeti/Devam Takibi/Ortalama
    Çalışma Saati) başlık+alt başlık, 5 vardiya adı, 4 şube adı (İzin
    Yönetimi sekmesi de AYNI diziyi bir sonraki turda yeniden kullanacak),
    3 KPI alt metni, 4+4 mini istatistik/lejant etiketi, saat kısaltması
    (`hourAbbrev`: EN "h"/NL "u"/IT "h"/AZ "saat" — AZ'de tek harfli
    yaygın kısaltma OLMADIĞI için tam kelime kullanıldı, belirsizliğe
    yol açmasın diye). **Doğrulama:** `astro check` 0 hata (395 dosya),
    `astro build` temiz, 8 regresyon script'i (bilinen 5 H1→H3 taban
    çizgisi hariç) sıfır yeni sorun, Chrome'da TR/EN/NL/IT/AZ'ın
    TAMAMINDA Zaman Yönetimi sekmesi tek tek açılıp KPI kartları/mini
    istatistikler/Devam Takibi/Ortalama Çalışma Saati/Vardiya Devam
    Oranı/Fazla Mesai Özeti görsel olarak doğrulandı (ay/gün
    kısaltmaları, saat birimleri, şube/vardiya adları dahil). **Kalan
    sekmeler (henüz BAŞLANMADI, sıradaki turlar):** İzin Yönetimi →
    İnsan Kaynakları → Performans Yönetimi → Veri Analizi + paylaşılan
    panel metinleri (kullanıcı onaylı sıra).
52. **KAPANDI (2026-08-31) — `check-html-lang-attribute.mjs`'in 196
    "sorunlu sayfa" raporu GERÇEK bir site regresyonu DEĞİLDİ, script'in
    kendi bug'ıydı; kök neden bulunup düzeltildi.** (İlk kayıtta "yalnızca
    nl, 196 sayfa, henüz araştırılmadı" yazılmıştı — bu YANLIŞTI, örnekler
    `tail`'in son 20 satırına rastladığı için yalnızca nl görünüyordu;
    gerçekte 4 locale'in TAMAMI etkileniyordu: 46 az + 56 en + 52 it + 42
    nl.) **Kök neden:** `expectedLocaleFor()` beklenen locale'i, `DIST_DIR`
    (varsayılan `'dist'`) köküne göre relatif yolun İLK segmentinden
    (`parts[0]`) çıkarıyordu. `output:'static'` döneminde bu doğruydu
    (`dist/<locale>/...`). Ama commit `b73428a`'nın (2026-08-28, "Migrate
    to output:server + Cloudflare adapter") `output:'server'`'a geçişiyle
    `@astrojs/cloudflare` adapter'ı TÜM statik çıktıyı `dist/client/`
    altına sarmaya başladı — artık her sayfanın yolu `client/<locale>/...`
    ile başlıyor, `parts[0]` HER ZAMAN `"client"` (asla `VALID_LOCALES`
    içinde değil), fonksiyon her sayfa için `'tr'`'ye düşüyordu. Bulunan
    değerler (`"az"`/`"en"`/`"it"`/`"nl"`) her zaman DOĞRUYDU — canlı
    dosyalardan doğrudan doğrulandı (`grep '<html lang' dist/client/
    {nl,en,az,it}/.../index.html`) — yalnızca yanlış bir "beklenen" ile
    karşılaştırılıyordu. **Ne zaman başladı:** commit `b73428a`
    (2026-08-28 17:30:34 +0300). **Neden günlerce fark edilmedi:** Açık
    nokta #50'deki aynı alışkanlık — script'in ÖZET satırı hep doğru
    sayıyı veriyordu ama doğrulama turlarında `tail`/göz atma ile
    okunduğu için kaçırıldı; ilk yanlış "sıfır yeni regresyon" iddiası
    2026-08-29 tarihli (Destek/Teşekkürler sayfası) turda görülüyor.
    İlginç not: proje bu `dist/client/` değişikliğini BİR KEZ zaten
    keşfetmişti — `scripts/audit-remote-hotlinks.mjs` (2026-08-30, hotlink
    denetimi) kendi başında `DIST_DIR=dist/client` çağrı kalıbını
    belgeliyordu, ama bu düzeltme `check-html-lang-attribute.mjs`'e geri
    uygulanmamıştı. **Düzeltme (uygulandı):** `check-html-lang-attribute.mjs`'te
    `DIST_DIR` varsayılanı `'dist'` yerine `'dist/client'` yapıldı (tek
    satır, `audit-remote-hotlinks.mjs`'teki emsalin birebir aynısı) — bu
    otomatik olarak `dist/server/`'ı (SSR worker kodu, HTML sayfası değil)
    taramadan da hariç bırakıyor. **Kapsam kontrolü:** diğer 7
    `check-*.mjs` script'i relatif yolu YALNIZCA raporlamada (hangi
    dosyada sorun var) kullanıyor, locale'e bağlı bir "beklenen değer"
    hesaplamıyor — bu yüzden mantıkları etkilenmedi, DOKUNULMADI (bkz.
    Açık nokta #53'teki TEK istisna). **Doğrulama:** düzeltme sonrası
    script 0 sorunlu sayfa raporladı (exit 0); script'in gerçek bir
    sorunu hâlâ yakaladığını kanıtlamak için `dist/client/en/about/
    index.html`'e kasıtlı bozuk `lang="xx-BROKEN"` enjekte edilip script
    tekrar çalıştırıldı — 1 sorun + exit 1 doğru şekilde raporlandı,
    test değişikliği hemen geri alındı (Açık nokta #50'deki disiplinin
    aynısı). Diğer 7 regresyon script'i + `astro check`/`astro build`
    yeniden çalıştırılıp bu değişiklikten etkilenmedikleri doğrulandı.
53. **YENİ, DORMANT/ETKİSİZ (2026-08-31) — `check-hreflang.mjs`'de
    AYNI KÖKENLİ bir bug pusuda bekliyor, Faz 2'de hreflang aktifleşince
    patlayacak.** Açık nokta #52'nin araştırması sırasında bulundu.
    `check-hreflang.mjs`'in `hrefToDistRelPath()`'i hreflang `<link>`
    etiketlerinin `href` URL'sini (`new URL(href).pathname`, ör.
    `nl/over/index.html`) sayfanın KENDİ disk-relatif yoluyla (`rel`,
    `DIST_DIR='dist'` köküne göre — düzeltilmezse `client/nl/over/
    index.html`) karşılaştırıyor/`Map`'te arıyor (`pages.get(targetRel)`,
    satır 87). Bu ikisi `client/` önekiyle ASLA eşleşmeyecek — Faz 2'de
    `astro.config.mjs`'in `site` alanı doldurulup hreflang üretilmeye
    başlandığı AN, bu script'in "kendi kendine referans eksik" +
    "geçersiz hedefe işaret ediyor (dosya bulunamadı)" bulguları HER
    hreflang'lı sayfa için sahte şekilde patlayacak (`check-html-
    attribute.mjs`'in düzeltilmeden önceki haliyle birebir aynı hata
    sınıfı). **Şu an ETKİSİZ** çünkü `pagesWithHreflang === 0` erken
    çıkışı (satır 121-129) bu mantığa hiç girmiyor — `check-hreflang`
    hâlâ 0 ile çıkıyor, kod değişikliği bu turda YAPILMADI (kullanıcı
    onayı yalnızca `check-html-lang-attribute.mjs`'i kapsıyordu).
    **Aksiyon:** Faz 2'de `site` alanı doldurulmadan HEMEN ÖNCE (veya
    o turun bir parçası olarak) `check-hreflang.mjs`'e de aynı
    `DIST_DIR ?? 'dist/client'` düzeltmesi uygulanmalı — aksi halde
    Faz 2 doğrulama turu, gerçekte doğru olan hreflang çıktısını
    yüzlerce sahte hatayla raporlayacak.
54. **KRİTİK BULGU + DÜZELTİLDİ (2026-08-31, 4. tur) — `Intl.DateTimeFormat`/
    `Intl.NumberFormat`'a runtime'da güvenmek GÜVENSİZ çıktı, `az-AZ`
    locale'i için hem SUNUCU/TARAYICI ARASI hem de TARAYICI İÇİ tutarsız
    sonuç veriyordu; tüm locale'ler için sabit/doğrulanmış tablolara
    geçildi.** Açık nokta #51'in Tier 2 mimarisinde (ay/hafta günü
    kısaltmaları için) `Intl` kullanma kararı verilmişti ("uydurma riski
    yok" gerekçesiyle) — bu YANLIŞ çıktı. **Kanıt:** İzin Yönetimi
    sekmesi Chrome'da doğrulanırken AZ'de "Aylıq İcazə Trendi" grafiğinin
    ay eksen etiketleri "M03/M04/.../M08" (jenerik ICU fallback) olarak
    göründü, "Nəfər başına orta" değerleri "2.1" (nokta, virgül DEĞİL)
    çıktı. `javascript_tool` ile tarayıcı konsolunda doğrudan test
    edildi: `Intl.DateTimeFormat('az-AZ',{month:'short'}).format(...)`
    hem KISA hem UZUN ay formatında "M01".."M12" veriyor (locale doğru
    çözülüyor — `resolvedOptions().locale === 'az-AZ'` — ama stil verisi
    ICU'da YOK), `Intl.NumberFormat('az-AZ',...)` ondalık ayracı "."
    veriyor (virgül değil). tr/en/nl/it AYNI tarayıcıda sorunsuzdu — bu
    yalnızca `az`'a özgü bir ICU/CLDR kapsam boşluğu. **İlginç ikinci
    katman:** `dist/client/az/...` (build/Node ICU) çıktısı DOĞRUYDU
    (`grep`'te "M03" hiç bulunamadı) — yalnızca tarayıcıda hydration
    SONRASI (client-side JS, widget `client:visible`) bozuluyordu, yani
    SSR HTML ile hydrate edilmiş DOM arasında bir tutarsızlık da vardı.
    **Düzeltme:** `productPreviewWidgetData.ts`'teki `MONTH_ABBREV`/
    `WEEKDAY_ABBREV`/`formatDecimal()` artık HİÇBİR runtime `Intl`
    çağrısı yapmıyor — Node'un tam ICU'suyla üretilip doğrulanmış gerçek
    değerler (uydurma DEĞİL, gerçek CLDR takvim/sayı verisi, `node -e`
    ile ayrıca doğrulandı) sabit tablo olarak koda gömüldü; az hafta
    kısaltmaları gerçek Azerbaycan takvim formatını (B.e/Ç.a/Ç/C.a/C/
    Ş/B) kullanıyor. **Doğrulama:** düzeltme sonrası tüm 5 locale
    yeniden build edilip Chrome'da (özellikle AZ, hydration sonrası
    sekme tıklamasıyla) tekrar test edildi — "mar apr may iyn iyl avq"
    + "2,1 gün" doğru çıktı; tr/en/nl/it etkilenmedi (aynı doğrulanmış
    değerler, yalnızca kaynak `Intl`'den sabit tabloya taşındı).
    **⚠️ İleriye dönük not:** `dates.ts`'in `formatLocalizedDate()`'i
    (SİTE GENELİNDE blog tarihleri/"Son Güncelleme" için kullanılıyor)
    HÂLÂ `Intl.DateTimeFormat(...,{month:'long'})`'a dayanıyor — tarayıcı
    konsolunda `az-AZ` UZUN ay formatının da AYNI şekilde bozuk olduğu
    (`"M01".."M12"`) doğrulandı. Bu, bu turun kapsamı DIŞINDA (widget'a
    özel değil, site geneli) ama gerçek bir risk — az sayfalarındaki
    tarihler tarayıcıda yanlış görünüyor olabilir. Ayrı bir turda
    incelenmeli/aynı "sabit tabloya geç" ilkesiyle düzeltilmeli.
55. **TAMAMLANDI (2026-08-31, 4. tur) — "İzin Yönetimi" sekmesi 4 dilde
    (EN/NL/IT/AZ) çevrildi (kullanıcı onaylı sıra: Zaman → İzin → İK →
    Performans → Veri Analizi).** `productPreviewWidgetData.ts`'e
    `getLeaveManagementLabels(locale)` eklendi (Zaman Yönetimi'yle AYNI
    mimari desen). Şube isimleri (`Merkez/Teknopark/Anadolu/Avrupa Şube`)
    Zaman Yönetimi'nin `getTimeManagementLabels(locale).branches`'İNDEN
    PAYLAŞILDI — ikinci bir isim seti İCAT EDİLMEDİ. "Kişi başı ortalama"
    değerleri (`2,1 gün` vb.) sayıya çevrilip `formatDecimal()` + `dayUnit`
    ile birleştiriliyor. Çevrilen: sekme başlığı, 6 kart başlık/alt
    başlık, 4 KPI etiketi, 2 izin türü, 3 onay durumu, "gün" birimi,
    boş-durum metni ("İzin çakışması verisi yok"), dekoratif "Şube"
    rozeti. **Doğrulama:** `astro check` 0 hata, `astro build` temiz, 8
    regresyon script'i (bilinen 5 H1→H3 taban çizgisi hariç) sıfır yeni
    sorun, Chrome'da TR/EN/NL/IT/AZ'ın TAMAMINDA İzin Yönetimi sekmesi
    (tüm 6 kart + şube paylaşımı + ondalık format) görsel doğrulandı —
    bu doğrulama sırasında #54'teki kritik `Intl`/az bulgusu ortaya
    çıktı ve AYNI turda düzeltildi.
56. **TAMAMLANDI (2026-08-31, 5. tur) — "İnsan Kaynakları" sekmesi 4
    dilde (EN/NL/IT/AZ) çevrildi.** `getHumanResourcesLabels(locale)`
    eklendi (Zaman/İzin Yönetimi'yle AYNI mimari). `HEADCOUNT_MONTHS`/
    `TURNOVER_MONTHS` ay-adı dizilerinden `monthIndex` dizilerine
    çevrildi (`MONTH_ABBREV[locale][mi]` — #54'ün SABİT tablosunu
    kullanıyor). `CALENDAR_WEEKDAYS` sabiti tamamen KALDIRILDI —
    `WEEKDAY_ABBREV[locale].toUpperCase()` ile TÜRETİLİYOR (hiçbir
    dilin kısaltmasında küçük "i" harfi olmadığı doğrulandığı için
    Türkçe büyütme bug'ı riski YOK). `PROBATION_TRACKING`/
    `CONTRACT_TRACKING` sayı+birim olarak ayrıştırıldı (`primaryValue`/
    `primaryUnit`/`secondaryDays`), `monthUnit`/`yearUnit`/`dayUnit`
    ile render'da birleştiriliyor. `HR_EVENTS`'in kişi adları
    ÇEVRİLMEDİ (özel isim), yalnızca `description` ("Doğum Günü —
    Bugün!" vb.). **Gramer düzeltmesi (Chrome doğrulamasında
    yakalandı):** İlk yazımda `monthUnit` EN "Month"/NL "Maand"/IT
    "Mese" TEKİL'di — ama `PROBATION_TRACKING`'te bu birim yalnızca
    2/6 (>1) değerleriyle kullanılıyor, "2 Month" gibi dilbilgisel
    olarak yanlış bir çıktı verdi. TR/AZ'da (Türkçe/Azerice sayı+isim
    yapısında çoğul eki gerekmez) sorun YOKTU. EN "Months"/NL
    "Maanden"/IT "Mesi" (çoğul) olarak düzeltildi — `yearUnit`
    değişmedi (yalnızca 1 değeriyle kullanılıyor, zaten tekil doğru).
    **Doğrulama:** `astro check` 0 hata, `astro build` temiz, 8
    regresyon script'i (bilinen 5 H1→H3 taban çizgisi hariç) sıfır
    yeni sorun, Chrome'da TR/EN/NL/IT/AZ'ın TAMAMINDA İnsan Kaynakları
    sekmesi (7 kart: Headcount/Doğum Günü/Çalışan Devir/Onay Bekleyen/
    Takvim/Deneme Süresi/Sözleşme) görsel doğrulandı — IT/AZ için
    widget'ın kendi `AUTO_TAB_INTERVAL_MS` (6sn) otomatik sekme
    döngüsü ekran görüntüsü almayı zorlaştırdığından, doğrulama
    `javascript_tool` ile doğrudan DOM metni okunarak (`innerText`)
    yapıldı — aynı derecede güvenilir, ekran görüntüsüne muhtaç değil.
    **Kalan sekmeler:** Performans Yönetimi → Veri Analizi + paylaşılan
    panel metinleri (sıradaki turlar).
57. **TAMAMLANDI (2026-09-01, 6. tur) — "Performans Yönetimi" sekmesi 4
    dilde (EN/NL/IT/AZ) çevrildi.** `getPerformanceManagementLabels(locale)`
    eklendi (önceki sekmelerle AYNI mimari — yapısal veri `PERFORMANCE_KPI_STATS`/
    `PERFORMANCE_GOALS_STRUCTURE`/`GOAL_KEY_RESULTS_STRUCTURE`'da kaldı,
    render'da İNDEKS SIRASIYLA `t.kpiStats`/`t.goals`/`t.keyResults`'la
    birleştiriliyor). Yeni genel yardımcı `formatPercent(value, locale)`
    eklendi (`productPreviewWidgetData.ts`) — tr/az "%29", en/nl/it "29%"
    (2026-08-31'in `kpiSubtext` emsalinin genellenmiş hali). Çevrilen:
    4 KPI kartı, 4 hedef (OKR) satırı (ad/kapsam/kategori/durum — "Sales"/
    "Marketing" kategorileri TR kaynakta da İngilizce olduğu için ÇEVRİLMEDİ,
    bilinçli), "anahtar sonuç" birimi, 2 Anahtar Sonuç satırı (ad/son
    check-in/durum/güncel-başlangıç-hedef değerleri — para birimi ₺ TÜM
    locale'lerde AYNI kaldı, kurgusal şirket Türkiye merkezli), "Son
    check-in:"/"Güncel:"/"Takvime göre beklenen"/"planın önünde"/"planın
    gerisinde" önekleri. **Yan bulgu, AYNI turda düzeltildi:**
    `GoalProgressRing`'in halka içi yüzde metni (`%{percent}`) hardcoded
    TR biçimindeydi, locale'den bağımsızdı — `formatPercent()`'e
    çevrildi (artık EN/NL/IT'de "31%", TR/AZ'da "%31" gösteriyor).
    **Kapsam dışı bırakılan, AYRI bir bulgu olarak kaydedildi:** İnsan
    Kaynakları sekmesindeki `TURNOVER_STATS`'ın "%18.4" değeri (madde 56)
    AYNI hardcoded-TR-biçim sorununu taşıyor ama bu turun kapsamı
    DIŞINDA (önceden tamamlanmış/onaylanmış bir sekme) — düzeltilmedi,
    istenirse ayrı bir mikro-tur olarak ele alınabilir.
    **Doğrulama:** `astro check` 0 hata, `astro build` 3097 sayfa temiz,
    8 regresyon script'i (bilinen 5 H1→H3 taban çizgisi hariç) sıfır
    yeni sorun, Chrome'da TR/EN/NL/IT/AZ'ın TAMAMINDA Performans Yönetimi
    sekmesi (4 KPI kartı + 4 hedef satırı + 2 Anahtar Sonuç satırı)
    görsel doğrulandı. **Teknik not (yeni bilgi, ileriki turlar için
    yararlı):** widget'ın sekme butonlarına JS'ten `.click()`/
    `dispatchEvent(...)` ile PROGRAMATIK tıklama bu ortamda ÇALIŞMIYOR
    (React'in tıklamayı işlememesi — hem TR hem EN'de doğrulandı, sekmeye
    özgü değil, genel bir kısıt). Gerçek/güvenilir yöntem: `computer`
    aracıyla GERÇEK fare tıklaması (OS-seviyesi sentetik olay) + tıklama
    SONRASI screenshot'ı MÜMKÜN OLDUĞUNCA hızlı almak (widget'ın kendi
    `AUTO_TAB_INTERVAL_MS`=6sn otomatik döngüsü, ardışık tool-call
    round-trip'leri arasında geçen süre 6sn'yi aşarsa sekmeyi tekrar
    ileri kaydırabilir).
    **Kalan sekmeler:** Veri Analizi + paylaşılan panel metinleri
    (sıradaki turlar).
58. **TAMAMLANDI (2026-09-01, 7. tur) — "Veri Analizi" sekmesi 4 dilde
    (EN/NL/IT/AZ) çevrildi — widget'ın 5 FONKSİYONEL sekmesinin TAMAMI
    artık 5 dilde.** `getDataAnalysisLabels(locale)` eklendi (önceki
    sekmelerle AYNI mimari — yapısal veri `DEPARTMENT_ABSENTEEISM_STRUCTURE`/
    `DAILY_MOVEMENTS_STRUCTURE`/`ACTIVE_EMPLOYEE_TREND_WEEKS_STRUCTURE`'da
    kaldı, render'da İNDEKS SIRASIYLA `t.departments`/`t.dailyMovements`
    ile birleştiriliyor). Ay/gün etiketleri (Temmuz-Ağustos haftaları,
    Ocak-Haziran trend ayları, 12-18 Ağustos günleri) ARTIK sabit dizi
    DEĞİL — `{day, monthIndex}` yapısal çiftinden `MONTH_ABBREV[locale]`
    ile TÜRETİLİYOR (Zaman/İzin/İK sekmelerinin AYNI ilkesi, #54'ün
    sabit-tablo kuralına uyuyor — runtime `Intl` YOK). Çevrilen: "Tarih
    Aralığı"/"Verileri Hesapla" (2 kullanım yeri), 6 departman adı (İK/
    Satış/Operasyon/Finans/Üretim/Destek), "Departman Bazlı Devamsızlık
    Oranı"/"Aylık Devamsızlık Trendi"/"Aktif Çalışan Sayısı Trendi"
    (+"Haftalık"/"Aylık" rozetleri), 4 mini-hareket etiketi (Gelenler/
    Geç Gelenler/Erken Çıkanlar/Devamsızlık — Zaman Yönetimi'nin
    `miniStats`inden BİLİNÇLİ olarak FARKLI kelimeler, TR kaynağın kendi
    ayrımı korundu), "Çalışan Gelenler/Geç Gelenler Sayısı" + "12–18
    Ağustos 2026" tarih aralığı metni (tek literal string, tam ay adı
    gerektirdiği için `MONTH_ABBREV`'den türetilmedi). Tarih SAYILARI
    (`01.01.2026` gibi) ve para birimi/departman ROZET renkleri TÜM
    locale'lerde AYNI kaldı (mockup verisi, önceki sekmelerin ilkesiyle
    tutarlı). **Doğrulama:** `astro check` 0 hata, `astro build` 3097
    sayfa temiz, 8 regresyon script'i (bilinen 5 H1→H3 taban çizgisi
    hariç) sıfır yeni sorun, Chrome'da TR/EN/NL/IT/AZ'ın TAMAMINDA Veri
    Analizi sekmesinin HEM üst (Tarih Aralığı/Departman/Trend) HEM alt
    (mini-hareketler/Gelenler/Geç Gelenler tam grafikleri) bölümleri
    görsel doğrulandı. **Kalan iş:** yalnızca paylaşılan panel metinleri
    (header'daki Kısayollar/Bildirimler/HRTECHTOOLS gibi Tier 2 dışı
    kalan parçalar, bkz. Açık nokta #51'in orijinal kapsam notu) — widget
    çevirisinin son adımı.
59. **TAMAMLANDI (2026-09-01, 8. tur) — Paylaşılan üst header panelleri
    4 dilde (EN/NL/IT/AZ) çevrildi — `ProductPreviewWidget.tsx`'in TÜM
    çeviri işi bitti.** Panel BAŞLIKLARI (`labels.shortcuts.title` vb.)
    zaten Tier 1'de çevrilmişti — bu turda yalnızca panel İÇERİĞİ
    çevrildi: `getSharedPanelLabels(locale)` eklendi
    (`productPreviewWidgetData.ts`). Çevrilen: "Kısayollar" panelinin 6
    kısayolu (Çalışan Oluştur/İzin Oluştur/Rapor Oluştur/Mesaj Gönder/
    Günlük Puantaj/Vardiya Takvimi), "Görevler" (2. zil) panelinin 3
    bekleyen görev metni, "Bugünün Özeti" (Analiz ikonu) panelinin 3
    satır etiketi + "Ortalama Çalışma Süresi" değerinin saat/dakika
    biçimi (tr "7s 42dk" / en "7h 42m" / nl "7u 42m" / it "7h 42min" /
    az "7 saat 42 dəq" — sabit sayı "7"/"42", yalnızca birim gösterimi
    dile göre değişiyor), "Dil Seçin" panelinin 11 dil adı (dekoratif
    dil listesi — Türkçe/İngilizce/Almanca/... her locale'de kendi
    dilinde: `Turkish/English/German/...`, `Turks/Engels/Duits/...`,
    `Turco/Inglese/Tedesco/...`, `Türk/İngilis/Alman/...`).
    **HRTECHTOOLS paneli + dil seçicideki dil isimlerinin KENDİLERİ
    (bayrak/kod listesi) bilinçli olarak ÇEVRİLMEDİ** — marka adları
    (HiringOz/DataAssist/Anzera/vb.) gerçek üçüncü taraf ürün adları,
    "Sales"/"Marketing" kategorileri gibi (madde 57) İngilizce kalması
    doğal. **Yan bulgu, AYNI turda düzeltildi:** Dil Seçin panelindeki
    "aktif" onay işareti önceden `lang.code === 'TR'` diye SABİTTİ —
    widget'ın geri kalanı artık gerçek `locale` prop'una duyarlı
    olduğundan, bu sabitlik (EN sayfasında "Türkçe ✓" görünmesi gibi)
    tutarsız hale gelmişti. `LOCALE_TO_LANGUAGE_LIST_CODE` haritasıyla
    artık gerçek widget locale'ine göre doğru dil işaretleniyor (EN
    sayfasında "English ✓", vb.) — gerçek `LanguageSwitcher.tsx`'in
    davranışıyla tutarlı. **Doğrulama:** `astro check` 0 hata, `astro
    build` 3097 sayfa temiz, 8 regresyon script'i (bilinen 5 H1→H3 taban
    çizgisi hariç) sıfır yeni sorun, Chrome'da TR/EN/NL/IT/AZ'ın
    TAMAMINDA Kısayollar/Görevler/Bugünün Özeti/Dil Seçin panelleri
    (aktif dil işareti dahil) tek tek açılıp görsel doğrulandı.
    **Sonuç: widget'ın TÜM içeriği (5 fonksiyonel sekme + paylaşılan
    header panelleri) artık 5 dilde** — bkz. `widget-i18n-progress.md`
    memory'sinin kapanış notu.
60. **KAPANDI (2026-09-01) — Duyuru barı (marquee) artık idenfit.com'daki
    GİBİ yalnızca sayfanın EN ÜSTÜNDEYKEN görünüyor.** Kullanıcı bulgusu:
    önceki davranış scroll YÖNÜNE göreydi (aşağı kaydırınca gizlenip
    yukarı kaydırınca — sayfanın ortasında bile olsa — geri geliyordu),
    canlı sitede ise bar yalnızca `scrollY === 0` iken görünüyor, en ufak
    bir aşağı kaydırmada kayboluyor ve YUKARI kaydırmakla GERİ GELMİYOR
    (yalnızca sayfanın gerçek en üstüne dönünce). `src/scripts/marquee-scroll.js`
    sadeleştirildi: `lastY`/`THRESHOLD`/yön karşılaştırması tamamen
    kaldırıldı, tek kural `setHidden(window.scrollY > 0)`. Mevcut
    debounce/dedupe altyapısı (`isHidden` state kontrolü,
    `MIN_TOGGLE_INTERVAL_MS`=250ms, `grid-template-rows` geçiş tekniği)
    AYNEN korundu — 2026-07-31'de bulunup düzeltilen asıl jank kaynağı
    (`<header>`'ın `backdrop-blur`'ü) zaten kalıcı olarak kaldırılmıştı,
    bu turda yalnızca GÖSTERME KURALI değişti. `astro build` temiz, 7
    regresyon script'i (JSON-LD hariç, ilgisiz — saf JS davranış
    değişikliği, HTML/içerik dokunulmadı) sıfır yeni sorun, Chrome'da
    doğrulandı: sayfanın en üstünde görünür → 1 tık aşağı kaydırınca
    kayboluyor → yukarı kaydırılıp sayfanın ortasında durulsa bile
    GİZLİ kalıyor → yalnızca gerçek en üste dönülünce geri geliyor.
61. **KAPANDI (2026-09-01) — İki İK hub sayfasının (İnsan Kaynakları
    Modülleri + İşgücü Yönetimi) hero görseli eksikti, kullanıcı
    WhatsApp'tan paylaştığı ekran görüntüsüyle fark etti.** Kök neden:
    `hero.image` alanı ham `hubs.json`'da HER ZAMAN vardı ama
    `hubContent.ts`'in `getHubContent()`'i hiçbir zaman aktarmıyordu —
    `HubBlock` tipinde `image` alanı hiç YOKTU — `HubPage.astro`'nun hero
    grid'i de (`lg:grid-cols-2`) buna rağmen ikinci sütunu hiç
    doldurmuyordu (`ProductPage.astro`'nun aynı grid'inin YANINDA,
    resim bloğu unutulmuş bir kopyası). **Uygulama:** `HubBlock`'a
    `image: {url,alt,width,height}|null` eklendi; yeni `getHeroImage(trSlug)`
    yardımcı fonksiyonu HER ZAMAN TR taban girdisinden okuyor (görsel
    dile göre değişmiyor, ham veride tr/en/it üçü de AYNI URL'i
    kullanıyor — doğrulandı) — bu yüzden `HUB_OVERRIDES`/`HUB_OVERRIDES_AZ`'ın
    metin-odaklı hero bloklarına EKLENMEDİ, tipleri `Omit<HubBlock,'image'>`
    oldu. `HubPage.astro`'ya `ProductPage.astro` ile BİREBİR aynı hero
    görsel bloğu (`loading="eager"`, `rounded-2xl object-cover`) + `image`
    prop'u `BaseLayout`'a (OG) eklendi. **Görsel bağımlılık kuralı**
    (2026-08-30) gereği idenfit.com'a hotlink YAPILMADI — 2 görsel
    (`workforce-banner-en@2x.png` 1453×795, `hr-banner-en@2x.webp`
    1122×905) indirilip magic-byte doğrulamasıyla `public/wp-content/uploads/`
    altına yerleştirildi, `hubContent.ts`'te göreliye çevrildi.
    **Doğrulama:** `astro check` 0 hata, `astro build` 3097 sayfa temiz,
    7 regresyon script'i (bilinen 5 H1→H3 taban çizgisi hariç) sıfır yeni
    sorun, `audit-remote-hotlinks.mjs`'de bu 2 dosya ARTIK listede yok
    (yerelleştirme doğrulandı), Chrome'da TR/EN/AZ'ın ÜÇÜNDE de HEM
    İşgücü Yönetimi HEM İnsan Kaynakları Modülleri hub'ında görsel doğru
    render edildi doğrulandı (tek component değişikliği iki hub'ı da
    kapsadı). **Kapsam dışı bırakılan (kasıtlı, ayrı bir bulgu — Açık
    nokta #45'in parçası):** her iki hub'ın tile kartlarındaki görseller
    hâlâ hotlink (7+16 referans, `audit-remote-hotlinks.mjs` çıktısında
    görünüyor) — bu turun kapsamı yalnızca HERO görseliydi, tile
    görselleri #45'in bekleyen genel temizliğinde ele alınacak.
    **Aynı gün, ek tur — kullanıcı `alt` metninin gerçek/anlamlı olup
    olmadığını sordu, DOĞRULANDI + DÜZELTİLDİ.** Ham veride her iki
    görselin `alt`'ı dosya adından türetilmiş, anlamsızdı ("workforce
    banner en@2x" / "hr banner en@2x") — sitenin GERİ KALANINDAKİ tüm
    hero görselleri de aynı ham-geçiş kuralını izliyor (`hero.image.alt`
    hiçbir yerde işlenmiyor), AMA `productTranslationOverrides.ts`'teki
    ELLE-YAZILMIŞ override görselleri ("sistemi a tornello"/"leave
    management" gibi) zaten gerçek/açıklayıcı, dile göre yazılmış alt
    taşıyor — bu turda AYNI ilke uygulandı: her iki görsel TEKRAR
    izlenip (workforce: laptop paneli + GPS/beacon/wifi/NFC/QR doğrulamalı
    mobil PDKS uygulaması; HR: performans/mesajlaşma/masraf takibi mobil
    ekranları) UYDURMA içerik EKLENMEDEN gerçek açıklama yazıldı, 4 dilde
    (tr/en/it/az — NL hub sayfaları hiç render edilmiyor, EN'e
    yönleniyor). Yeni `getHeroImage(trSlug, locale)` artık `locale`
    parametresi alıyor, `HERO_IMAGE_ALT` haritasından okuyor. `astro
    check` 0 hata, `astro build` temiz, 7 regresyon script'i sıfır yeni
    sorun, `dist/client/**/index.html`'de 4 dilin hepsinde yeni `alt`
    metni `grep` ile doğrulandı.
62. **KAPANDI (2026-09-02) — Dil değiştiricide az/it için sistemik bir
    404 bug'ı vardı, kullanıcı `/az/richiesta-supporto/`'nun 404
    verdiğini bulunca ortaya çıktı, TÜM benzer sayfalar için düzeltildi.**
    Kök neden: `Header.astro`'nun dil değiştiricisi, bir sayfanın
    `localeUrls` prop'unda BİR locale hiç YOKSA (`Object.entries` o
    anahtarı hiç üretmediği için, `undefined` bile değil, tamamen YOK),
    `computeGenericLocaleUrls()`'in (`src/i18n/localeUrls.ts`) "aktif
    path'in bare slug'ını yeni locale önekiyle birleştir" varsayımına
    sessizce düşüyordu — bu, slug'ın locale'ler arasında GERÇEKTEN aynı
    olmadığı sayfalarda (IT'nin "richiesta-supporto"su TR'nin
    "destek-talebi"sinden FARKLI) anlamsız bir URL (`/az/richiesta-supporto/`)
    üretip Astro'nun `az:'tr'` fallback'i üzerinden GERÇEK 404'e
    düşüyordu. **Bu AYNI bug sınıfı, 2026-07-22'de NL için bulunup
    yalnızca NL'de düzeltilmişti (bkz. `miscPagesContent.ts`'teki
    `localeUrlsFor()` yorumu) — az eklendiğinde (2026-08-21) bu düzeltme
    az'e GENİŞLETİLMEMİŞTİ.** Etkilenen TÜM fonksiyonlar taranıp (aynı
    "az kapsam dışı" — Açık nokta #37 — sayfa ailesi) tek seferde
    düzeltildi:
    - `miscPagesContent.ts`'in paylaşılan `localeUrlsFor()`'u (KVKK/KVK
      Protokol/Tüketici Hakları/Mesafeli Satış/Gizlilik ve Güvenlik
      Politikası/Güvenlik'in TAMAMI bunu kullanıyor — tek düzeltme 6+
      sayfayı kapsadı).
    - `supportRequestContent.ts` → `getSupportRequestLocaleUrls()`
      (Destek Talebi — kullanıcının bulduğu ORİJİNAL örnek).
    - `thankYouContent.ts` → `getThankYouLocaleUrls()` (Online Sunum
      Talebi'nin Teşekkürler sayfası).
    - `faqContent.ts` → `getFaqLocaleUrls()` (SSS).
    - `supportThankYouContent.ts` → `getSupportThankYouLocaleUrls()` —
      buradaki eski yorum ("bare slug TR ile aynı olduğu için elle bir
      şey gerekmez") YANLIŞTI: yalnızca TR sayfasından geçiliyorsa
      doğruydu, EN sayfasından (`thank-you`) geçilirse aynı sınıf 404
      geçerliydi — **az YANINDA IT için de** aynı düzeltme eklendi (bu
      sayfanın `SLUGS` haritasında `it` hiç yoktu, aynı risk).
    Düzeltme deseni HER YERDE aynı: `if (!result.az) result.az =
    result.tr;` (döngüde zaten hesaplanmış bare TR URL'i doğrudan
    kullanılıyor — `/az/<slug>/` üzerinden gereksiz bir redirect adımına
    gerek yok, NL'nin `result.en`'e eşitlenmesiyle AYNI ilke).
    **Doğrulama:** `astro check` 0 hata, `astro build` temiz, 8 regresyon
    script'i sıfır yeni sorun, `dist/client/it/**/index.html`'de
    `LanguageSwitcher` props'unun `az` alanı `grep` ile tek tek
    doğrulandı (`/guvenlik/`, `/sss/`, `/destek-talebi/` — hepsi bare TR),
    Chrome'da GERÇEK tıklama testi yapıldı: IT Destek Talebi sayfasında
    dil değiştiriciden "Azərbaycan"a tıklanınca artık `/destek-talebi/`'ne
    (200, gerçek içerik) gidiyor — düzeltmeden ÖNCE bu aynı tıklama
    `/az/richiesta-supporto/`'ya (404) giderdi. **Not:** kullanıcı aynı
    mesajda "Hollanda dili de İngilizce veriliyor" da dedi — bu AYRI ve
    KASITLI bir davranış (KARAR 2, `astro.config.mjs`'in `fallback:{nl:'en'}`'i
    — kaynak WordPress sitesinde NL içeriği birçok sayfada hiç yok,
    sessiz/bildirimsiz EN'e düşme bilinçli bir UX kararı) — bug OLARAK
    ele alınmadı, kullanıcıya AÇIKLANDI.
63. **KAPANDI (2026-09-02) — İşe Alım Modülü sayfası canlı siteyle
    UYUMSUZDU, kök neden: canlı TR/EN/IT tamamen Hiringoz'a yeniden
    markalanmış, IT/EN'in gerçek çevirisi ilk kez eklenmiş, ama bizim
    override'ımız hâlâ ESKİ/genel "ATS" içeriğini taşıyordu (NL de
    kaynakta hiç yoktu).** Kullanıcı canlı (`idenfit.com/ise-alim-modulu/`)
    ile local'i (`localhost:4321/ise-alim-modulu/`) yan yana verip
    "uyumlu değil" dedi. Canlı siteyi ziyaret edince tüm sayfanın
    (hero+5 bölüm+6 SSS) baştan yazıldığı görüldü — artık idenfit'in
    "Hiringoz" adlı bir kardeş ürününe (AI destekli işe alım/ATS asistanı)
    atıfta bulunuyor; bu ürünün gerçekliği zaten `ProductPreviewWidget.tsx`'in
    `HRTECHTOOLS` panelindeki `HIRINGOZ` girdisinden BİLİNİYORDU (Açık
    nokta #59'un dokunmadığı kısım). **Uygulama:** `productTranslationOverrides.ts`'teki
    `ise-alim-modulu` bloğu sıfırdan yazıldı — artık `tr`/`en`/`it`/`nl`
    DÖRDÜ de var (öncekinde yalnızca en/it/nl vardı, TR ham JSON'u da
    eskiydi). TR/EN/IT metni canlı sitenin `curl`+DOM taramasıyla (SSS
    accordion'u UICore Elementor widget'ı olduğu için `.ui-e-accordion-item`
    seçicileriyle) birebir/verbatim toplandı — HİÇBİR içerik UYDURULMADI
    (KARAR 1). NL'nin gerçek bir canlı karşılığı YOK (kaynakta hiç
    yayınlanmamış) — TR'den profesyonel çeviriyle YENİDEN üretildi
    (`productTranslationOverridesAz.ts`'teki AZ de aynı şekilde). **8 yeni
    görsel** (`ise-alim-{2,3,4,5}.png` TR/AZ için, `hiring-{2,3,4,5}.png`
    EN/IT/NL için — EN/IT byte-birebir aynı dosyalar, `diff` ile
    doğrulandı) idenfit.com'dan indirilip magic-byte doğrulamasıyla
    `public/wp-content/uploads/2025/11/`'e yerleştirildi (Görsel bağımlılık
    kuralı — hotlink YOK). Canlı sitenin "Şimdi Başlayın" bölümündeki
    `hiringoz-logo-1.svg` kendisi de 404 veriyor (curl ile doğrulandı) —
    bu kırık görsel BİLEREK migrate edilmedi, bölüm yalnızca metin+buton
    olarak kaldı. Hero artık uzun bir pazarlama cümlesi olduğu için
    (`en/hardware.astro`'nun AYNI deseni) 5 sayfaya (`ise-alim-modulu.astro`,
    `en/hiring-module.astro`, `it/modulo-reclutamento.astro`,
    `az/ise-alim-modulu.astro`, `nl/wervingsmodule.astro`) `title`/
    `ctaKeyword` override prop'u eklendi — `<title>`/CTA kısa gerçek isim
    kullanıyor, H1/breadcrumb uzun cümleyi aynen gösteriyor. **Doğrulama:**
    `astro check` 0 hata, `astro build` 3097 sayfa temiz, 8 regresyon
    script'i çalıştırıldı — ilk turda `nl/wervingsmodule/index.html`
    `<title>` 119 karakterle YAKALANDI (`title`/`ctaKeyword` override'ı
    eksikti, `find src/pages -iname "*wervingsmodule*"` ile bulunup
    eklendi), ikinci tur tamamen temiz. `audit-remote-hotlinks.mjs`'de
    yeni görseller hotlink olarak GÖRÜNMÜYOR (yerelleştirme doğrulandı).
    Chrome'da TR/EN/IT/NL/AZ'ın TAMAMINDA hero (görsel+istatistikler:
    "Total Applicants 16"/"Qualified Applicants 4"/"453 AI Calls"/
    "Assessment Rate %87,6"/"Qualification Rate %33,2") + TR'de ayrıca
    5 bölüm+FAQ accordion+"Son güncelleme" şeridi görsel doğrulandı.
64. **KAPANDI (2026-09-02, madde 63'ün DEVAMI) — kullanıcı "hâlâ en üstte
    olan hiringoz.com'a yönlendirmesi olan kısım eksik" + "aşağıdaki
    görsellerde de eksik ve yerlerinden kayma var" dedi; madde 63'teki
    hero ve bölüm-görsel eşleşmesi CANLI SİTENİN GÜNCEL/YENİDEN
    TASARLANMIŞ halini yansıtmıyormuş — kullanıcının paylaştığı ekran
    görüntüsü + kullanıcının kaydettiği TAM sayfa HTML'i (`İşe Alım
    Modülü - idenfit.html` + `..._files/`) kullanılarak yeniden
    incelendi.** Kök neden: madde 63'teki DOM taraması hero'nun ASIL
    görsel elemanlarını kaçırmıştı — (1) hero'nun "chairs" illüstrasyonu
    bir `<img>` DEĞİL, `.elementor-motion-effects-layer`'ın CSS
    `background-image`'ı (`ise-alim-hero-2.png`) — normal `<img>`
    taramasında hiç görünmüyordu; (2) hero'daki "hiringoz →" marka
    logosu (`hiringoz-logo-en.svg`, bir LİNK değil, dekoratif rozet)
    ekran görüntüsünün alt kısmında kalmıştı, taramaya hiç dahil
    edilmemişti; (3) bölüm görselleri madde 63'te BİR KAYDIRMA hatasıyla
    yanlış bölüme atanmıştı — kaynağın kaydedilmiş HTML'i satır satır
    incelenince gerçek eşleşme çıktı: hero=`ise-alim-hero-2.png`
    (dekoratif), section0("İşe Alımda Hız...")=`ise-alim-2.png`
    (önceden YANLIŞLIKLA hero'daydı), section1("Daha Akıllı...")=
    `ise-alim-3.png`, section2("Doğru Aday...")=`ise-alim-4.png`,
    section3("Güvenilir Yetenek Doğrulaması")=`ise-alim-5.png` (önceden
    `image:null` idi — MADDE 63'ÜN "eksik görsel" BULGUSU BUYDU),
    section4("Şimdi Başlayın")=görselsiz (kaynakta da yalnızca metin+buton,
    yanındaki `hiringoz-logo-1.svg` HÂLÂ 404 — `curl` ile yeniden
    doğrulandı, BİLEREK migrate edilmedi). Ayrıca canlı sitede sütun
    sırası ALTERNE ediyor ama `ProductPage.astro`'nun varsayılan
    `i % 2 === 1` formülünün TAM TERSİ fazda başlıyor (section0/2:
    metin-sol/görsel-sağ, section1/3: görsel-sol/metin-sağ). **Mimari
    eklemeler (opt-in, diğer 22 ürün sayfası grubunu ETKİLEMİYOR):**
    (a) `ProductBlock`'a `reverse?: boolean` eklendi,
    `ProductPage.astro`'nun bölüm döngüsü `effectiveSection.reverse ??
    i % 2 === 1` kullanıyor — verilmezse eski davranış AYNEN kalıyor;
    (b) `ProductBlock`'a `backgroundImage?: string` eklendi (kapanış
    bölümünün `#EDEDED` zemin + `ise-alim-footer.png` dekoratif
    deseni için, canlı sitede AYNI teknik); (c) `ProductPage.astro`'ya
    `heroLayout?: 'side'|'stacked'` + `heroPartnerLogo?: {...}` prop'ları
    eklendi — `'stacked'` (yalnızca bu sayfa kullanıyor) ortalanmış
    H1/paragraf + ALTINDA görsel + ALTINDA marka logosu/CTA satırı
    render ediyor, verilmezse (`'side'`, varsayılan, diğer TÜM sayfalar)
    davranış DEĞİŞMİYOR. **Yakalanıp düzeltilen GERÇEK bir bug (bu turun
    kendi içinde):** `productContent.ts`'in `getProductContent()`'indeki
    `resolveBlock()` yardımcı fonksiyonu her `ProductBlock`'u yalnızca
    `title/text/ctaText/ctaUrl/image` alanlarıyla YENİDEN inşa ediyordu
    — yeni eklenen `reverse`/`backgroundImage` (ve zaten var olan ama
    aynı şekilde sessizce düşen `id`/`images`) alanları override
    verisinde YAZILI olsa bile render'a hiç ULAŞMIYORDU. İlk build+Chrome
    doğrulamasında (`reverse` etkisiz, kapanış bölümünün zemin deseni
    hiç görünmüyor) yakalanıp `resolveBlock()`'un hem `az` hem
    `tr/en/it/nl` dalına `id`/`images`/`reverse`/`backgroundImage` passthrough'u
    eklenerek düzeltildi — İKİNCİ build+Chrome turunda hepsi doğru
    çalıştı. **Görseller:** `ise-alim-hero-2.png` (2093×1416),
    `ise-alim-footer.png` (1662×732), `hiringoz-logo-en.svg` — üçü de
    idenfit.com'dan indirilip magic-byte doğrulamasıyla
    `public/wp-content/uploads/2025/11/`'e eklendi. **`curl` ile
    doğrulanan önemli bulgu:** bu 3 dosyanın hepsi TR/EN/IT'nin ÜÇÜNDE
    de AYNI (locale'e özel kopya YOK, `hiringoz-logo-en.svg` adı "en"
    içerse de TR sayfasında da kullanılıyor) — NL/AZ için de aynı
    paylaşılan dosyalar kullanıldı. **Doğrulama:** `astro check` 0 hata,
    `astro build` 3097 sayfa temiz (2 turda — `resolveBlock` düzeltmesi
    sonrası yeniden), 8 regresyon script'i sıfır yeni sorun (bilinen 5
    H1→H3 taban çizgisi hariç), `audit-remote-hotlinks.mjs`'de 3 yeni
    dosya hotlink olarak GÖRÜNMÜYOR. Chrome'da TR (tam sayfa, hero'dan
    footer'a) + EN (hero) görsel doğrulandı — hero'nun sandalye
    illüstrasyonu + "hiringoz →" rozeti + CTA satırı, section0-3'ün
    doğru görsel/sütun sırası, section3'ün artık dolu görseli, kapanış
    bölümünün gri zemin deseni hepsi canlı siteyle eşleşiyor.
65. **KAPANDI (2026-09-02, aynı gece — tek turda birçok küçük/orta bulgu)
    — oturum özeti, sabah devam edilecek.** Kullanıcı ardışık olarak
    şunları bildirdi/istedi, hepsi ayrı commit'lerle kapatıldı (hepsi
    push edildi, `df087ff`'e kadar):
    - **Homepage font büyütme:** `FeatureGrid`/`EfficiencySection`/
      `SupremaSection`/`CertificationBadges`'in H2 altındaki intro
      paragrafları 16px→18px (`984c6e9`).
    - **Destek Talebi (`/destek-talebi/`) görsel tutarlılığı:** hero
      zemini düz kırmızıdan (`bg-brand`) Online Sunum Talebi'yle AYNI
      radyal pembe→beyaz gradyana çevrildi + `heroBackground` eklendi
      (`21754ee`), 4 dekoratif `IdenfitStar` eklendi (`fc27b6e`), "Sıkça
      Sorulan Sorular" link'i 14px→16px büyütüldü (`81516fb`).
    - **Teşekkürler (`/tesekkurler/`) sayfası 3 bulgu:** `toYoutubeEmbedUrl()`
      `?autoplay=1`'i HER ZAMAN ekliyordu (tek çağrı yeri bu sayfaydı) —
      artık opt-in, varsayılan otomatik oynatma YOK; kullanıcının
      istemediği koyu "idenfit" marka şeridi kaldırıldı; birkaç metin
      büyütüldü (`702df5e`). **Ayrıca kullanıcı "az'a geçmiyor" dedi** —
      kök neden: az için gerçek içerik hiç YOKTU, dil değiştirici sessizce
      bare TR URL'ine düşüyordu (görünürde hiçbir şey değişmiyordu) — TR'den
      gerçek/profesyonel AZ çevirisi eklenip `/az/tesekkurler/` sayfası
      oluşturuldu (`34dd691`, yan etki: `ContactPage.astro`'nun az için
      kırık `/az/thanks/` linkini de düzeltti).
    - **YENİ — Anasayfaya "Partnerlerimiz" bölümü eklendi**
      (`SupremaSection`'ın/donanım entegrasyonu vurgusunun HEMEN ALTINA,
      AYNI minimal `HARDWARE_BRAND_LOGOS` deseniyle) — kullanıcının
      verdiği liste: Turnike (Tansa/Özak), Bordro (SAP/Oracle/Mikro/
      Logo/Datassist), LMS (Anzera/Enocta), Görev Yönetimi (Jira), SSO
      (Google/Microsoft/Amazon). 13 logo hepsinin KENDİ resmi sitesinden
      indirildi (magic-byte doğrulamalı, hotlink YOK), 5 dilde başlık/alt
      metin/kategori etiketi çevrildi (`0903f6b`). **Takip turu:**
      kullanıcı "CAME diye bir firma yok, kaldır" dedi — Özak'ın güncel
      logosu satın alma sonrası "CAME ÖZAK" ortak markalı çıktı, `sharp`
      ile sağdaki saf "ÖZAK" wordmark'ı kırpılıp CAME kısmı çıkarıldı;
      ayrıca TÜM logolar `h-10 w-24` sabit kutuya (`object-contain`)
      alınıp "benzer boyuta" getirildi (`1acfc88`). Sonra AYRICA
      "Bulut Teknolojisi & Kalite Standartları" (`CertificationBadges`)
      paragrafı `max-w-2xl`→`max-w-4xl` genişletildi, 18px büyütmeden
      sonra çok dar/üst üste stack olmuştu (`7108999`).
    - **Mobil menü:** kullanıcı ekran görüntüsüyle "dili değiştiremiyorum,
      giriş yap/online sunum talebi/dil butonunu yukarı al, giriş yap'ı
      butonla sarmala" dedi — dil değiştirici/Giriş Yap/Online Sunum
      Talebi bloğu panelin EN ALTINDAN başlığın HEMEN ALTINA taşındı
      (önceki konumda ekran altına çok yakındı), "Giriş Yap" artık düz
      metin değil `.btn-cta` (beyaz+kırmızı çerçeve) gerçek bir buton
      (`ca05733`). Chrome'da mobil viewport'ta GERÇEK doğrulama yapıldı
      (dropdown artık tam açılıyor, dil değişimi çalışıyor — test
      sırasında ilk denemede YANLIŞLIKLA `ProductPreviewWidget`'ın kendi
      dekoratif "Dil Seçin" panelindeki AYNI metinli "TR" butonu
      hedeflenmişti, o bir kod hatası DEĞİLDİ, salt test-script hatasıydı).
    - **Online Sunum Talebi'nde (`/en/online-sunum-talebi/` dahil 4 dil)
      "panelden sonraki yerler çeviri olmuyor" bulgusu:** kök neden,
      2026-08-29'da eklenen `PresentationTimeline.astro`
      ("3 Adımda idenfit") ve `PresentationFeatureGrid.astro`
      ("Öne Çıkan Özellikler") hiç i18n ALTYAPISI OLMADAN tamamen
      hardcoded Türkçe yazılmıştı (`/demo`'dan içerik taşınırken
      atlanmış). `t.hero.presentationTimeline`/`presentationFeatures`
      eklenip 5 dilde gerçek çeviri yazıldı (KARAR 1), iki component
      `getTranslations()`'a bağlandı — ikonlar/`wide` bayrağı sabit
      kalıp INDEX'e göre eşleşiyor (`df087ff`). Chrome'da EN sayfasında
      doğrulandı.
    **Her turda:** `astro check` 0 hata, `astro build` temiz, ilgili
    regresyon script'leri (`check-heading-hierarchy`/`check-image-alt-text`/
    `check-json-ld`/`check-link-accessibility`/`check-meta-description-length`/
    `check-title-length`/`check-html-lang-attribute`, çoğu turda tam 8'i)
    bilinen taban çizgisiyle (5 H1→H3 hariç) birebir aynı — sıfır yeni
    regresyon. **Sabah devam için özel bir yarım iş YOK** — bu gece
    bildirilen HER madde kapatıldı ve push edildi; bir sonraki oturum
    kullanıcının yeni bir bulgu/isteğiyle başlayabilir.
66. **KAPANDI (2026-09-02) — Son blog senkronizasyonu, cutover öncesi.**
    Canlı `post-sitemap.xml` (629 URL) yerel 622 `.md` yazıyla karşılaştırıldı
    — **7 yeni yazı** bulundu (2026-07-31→2026-09-01 arası yayınlanmış,
    hepsi "Güncel Bilgiler" kategorisinde), 0 kaldırılmış/slug değiştirmiş
    yazı. Standart zincirle işlendi: ham WP REST verisi (7 yazı + 7 öne
    çıkan görsel medya kaydı) `reference/wordpress-export/posts.json`/
    `media.json`'a eklendi → `extract-blog-posts.mjs` → `migrate-blog-to-
    markdown.mjs` → `download-blog-images.mjs`/`relativize-blog-image-
    urls.mjs` (7 görsel, hepsi yalnızca öne çıkan görsel — gövdede hiç
    ek görsel yok). **Sonuç: 622→629 yazı, `check-json-ld.mjs`
    `BlogPosting: 629` doğruladı.**
    **Süreçte 2 gerçek bug bulunup düzeltildi:**
    1. **`dateModified < datePublished` (6/7 yazıda, `check-json-ld.mjs`
       6 geçersiz blok raporladı).** Kök neden: WP'nin ZAMANLANMIŞ
       (scheduled) yayın akışında `modified` taslağın son kaydedildiği
       anı (ör. sabah), `date` ise ileri ayarlanmış yayın anını (ör. aynı
       günün öğleden sonrası) taşıyor — `modified` `date`'ten önce
       kalabiliyor, önceki 622 yazıda hiç rastlanmamış bir desen.
       `src/pages/blog/[slug].astro`'ya `effectiveModifiedDate` (yalnızca
       `modifiedDate > date` iken kullanılır, aksi halde `date`'e düşülür)
       eklenip JSON-LD `dateModified`, OG `article:modified_time` VE
       görünür "Güncellendi" banner'ının HEPSİ bu tek kaynağa bağlandı —
       6 yazıda artık banner hiç görünmüyor (46/618 yazıda `modifiedDate`
       `date`'le aynıyken zaten uygulanan AYNI ilkeye genişletildi).
    2. **7 yazının `<title>`'ı 50-60 karakter aralığını aştı (`check-
       title-length.mjs`, 61-105 karakter)** — başlıklar orijinal
       WP başlığı kadar uzun/betimleyici. Açık Nokta #28'in metodolojisiyle
       (kısa/gerçek başlıktan türetme, uydurma yok) 7 `metaTitle` eklendi.
    **Yan not (tek seferlik yardımcı script, commit EDİLMEDİ):** ham WP
    verisini çekmek için kullanılan script `reference/wordpress-export/
    posts.json`'ı yanlışlıkla pretty-print'e çevirmişti (1 satır → ~198k
    satır, devasa/gürültülü diff) — commit'ten ÖNCE fark edilip dosya
    orijinal tek-satır/compact formatına geri döndürüldü (`JSON.stringify`
    indentsiz), gerçek diff 1 satır değişikliğe indi.
    **Doğrulama:** `astro check` 0 hata, `astro build` temiz, 9 regresyon
    script'inin 8'i (yeni `check-prerender.mjs` dahil) sıfır sorun, yalnızca
    `check-heading-hierarchy` bilinen 5 sayfalık taban çizgisinde (ilgisiz).
    `curl` ile yeni bir yazının 200 döndüğü, `<title>`'ının `metaTitle`
    kullandığı, öne çıkan görselin `idenfit.com`'a hiç hotlink YAPMADIĞI
    (yerelden 200) doğrulandı.
    **KARAR (kullanıcı, 2026-09-02): bu, projenin SON otomatik toplu blog
    senkronizasyonuydu.** Bundan sonra yeni yazılar Keystatic panelinden
    ekleniyor, otomatik senkronizasyon (`post-sitemap.xml` karşılaştırma +
    `extract-blog-posts.mjs`/`migrate-blog-to-markdown.mjs` zinciri) artık
    KULLANILMIYOR — bkz. Açık nokta #16'nın kapanışı.
67. **TAMAMLANDI (2026-09-02) — Canlı dashboard widget'ı (`ProductPreviewWidget.tsx`)
    mobilde artık bir bütün olarak ölçeklenip küçültülüyor.** Kullanıcı
    bulgusu: "mobil görünümde tüm olarak bütün durmalı, ekrana sığacak
    boyutta küçültülmeli, kullanıcı webdeki halinin küçültülmüş versiyonunu
    görmeli." İki uygulama seçeneği sunuldu, kullanıcı düşük riskli olanı
    onayladı:
    - **(A) Seçilen/uygulanan — mevcut mobil-optimize düzeni ölçekle.**
      `lg` altında (mevcut mobil kırılım noktasıyla AYNI) widget SABİT bir
      "doğal" genişlikte (`NATURAL_MOBILE_WIDTH=480px`) render edilir —
      bu, halihazırda ayarlanmış mobil düzenin (sidebar→yatay sekme
      çubuğu, kartlar alt alta, Açık nokta #24/#31'in mobil optimizasyonu)
      DEĞİŞMEDEN çizilmesini sağlar (`lg:` medya sorgusu viewport'a bakar,
      bu sabit genişlik onu etkilemez) — sonra TÜMÜ `transform: scale()`
      ile mevcut konteynerin genişliğine küçültülür (`[0.5,1]` aralığında
      sınırlı, asla büyütülmez). `ResizeObserver` dış konteyner + iç
      içerik (sekmeler arası otomatik geçişte yükseklik değişir) için
      dinliyor, dış sarmalayıcının yüksekliği ölçeklenmiş değere eşitlenip
      fazladan boşluk bırakılmıyor. Yeni `useMobileScale()` hook'u,
      widget'ın ~2750 satırlık iç koduna (her sekmenin kendi `lg:`
      kurallarına) HİÇ dokunmadan eklendi.
    - **(B) İstendi ama ERTELENDİ — gerçek masaüstü düzenini mobilde
      küçültme.** Kullanıcının orijinal ifadesi ("web'deki hali") aslında
      buna daha yakın — mobilde de masaüstündeki BİREBİR aynı görünüm
      (sol sidebar + kartlar yan yana grid) render edilip küçültülür.
      Bunun için widget'ın `lg:` kurallarının CSS container query'lere
      (Tailwind v4'ün yerleşik `@container` özelliği) çevrilmesi gerekir
      — büyük, riskli bir değişiklik (aylarca özenle ayarlanmış widget'ı
      bozma ihtimali). **Kullanıcı kararı: canlıya çıkış zaman baskısı
      nedeniyle ERTELENDİ** — canlıya çıkış sonrası, bol zamanla, dikkatli
      test edilerek ele alınabilir.
    **Doğrulama:** `astro check` 0 hata, `astro build` temiz, 8/9 regresyon
    script'i sıfır sorun (yalnızca bilinen 5 sayfalık heading-hierarchy
    taban çizgisi). **Canlı mobil viewport'ta uçtan uca GÖRSEL doğrulama
    YAPILAMADI** — bu oturumdaki tarayıcı otomasyon aracı gerçek bir dar
    viewport'a küçülemiyor (pencere hep masaüstü genişliğinde kaldı,
    bilinen bir araç kısıtı) ve `matchMedia` override'ı enjekte etmek için
    de çok geç kalıyor (widget `client:visible` ile sayfa yüklenir
    yüklenmez hydrate oluyor, override script'i her zaman ondan SONRA
    çalışıyor). Bunun yerine: (1) ölçekleme MATEMATİĞİ gerçek DOM'da
    doğrudan hesaplanıp doğrulandı (360px konteyner + 480px doğal genişlik
    → 0.75 ölçek, 808px doğal yükseklik → 606px ölçeklenmiş yükseklik,
    doğru), (2) masaüstü davranışının DEĞİŞMEDİĞİ doğrulandı (gerçek
    masaüstü viewport'ta hiçbir satır-içi stil uygulanmıyor, `isMobile`
    doğru şekilde false kalıyor). Kod derleniyor, mantık doğru — canlıya
    çıkış sonrası gerçek bir telefonda/DevTools'un cihaz modunda son bir
    görsel kontrol önerilir.
    **Takip turu (aynı gün) — kullanıcı gerçek cihazda 2 geri bildirim
    daha verdi:**
    1. "Çok ince uzun olmuş, biraz daha kısa ve geniş olsun" — kök neden:
       `sm:`/`lg:` Tailwind sınıfları VIEWPORT'a bakıyor, ölçekleme
       kutusunun kendi genişliğine değil — telefonlar her zaman `sm:`
       (640px) eşiğinin altında olduğu için küçük KPI/mini-istatistik
       kartları (`TrendKpiCard`/`StatCard`/`MiniTrendStatCard`) tek
       sütuna düşüp dikey olarak uzuyordu, `transform:scale()` bu oranı
       KORUYARAK küçültüyordu. 5 kompakt kart grid'i (Zaman/İzin/
       Performans/Veri Analizi sekmelerinde) `sm:` beklemeden mobilde de
       2 sütuna zorlandı (`lg:` üstü davranış AYNEN korundu) — grafik
       içeren zengin kart çiftlerine (Devam Takibi vb.) bilinçli olarak
       dokunulmadı, dar telefonda sıkışabilirdi.
    2. "Ekrana sığmıyor, ekrana baktığımda hepsini görebilmeliyim" — kök
       neden: `useMobileScale()`'in İLK sürümü yalnızca KONTEYNER
       GENİŞLİĞİNE göre ölçekliyordu, `window.innerHeight`'ı hiç hesaba
       katmıyordu — widget'ın alt kısmı ekranın dışında kalabiliyordu.
       Ölçek artık İKİ adaydan (genişliğe sığdıran VE `window.innerHeight
       × 0.85` hedef yüksekliğe sığdıran) KÜÇÜK olanı seçiyor — widget
       artık HER ZAMAN hem yatayda hem dikeyde tek ekrana sığıyor.
       `%85` payı (kullanıcının widget'a kaydırdığında başka içerik de
       kısmen görünsün diye) ilk tahmin — kullanıcı hâlâ sığmadığını
       söylerse bu oran düşürülebilir.
    **Aynı doğrulama sınırı geçerli** — bu turlarda da canlı mobil
    viewport'ta görsel doğrulama YAPILAMADI (AYNI araç kısıtı), yalnızca
    `astro check`/8-9 regresyon script'i/masaüstü-değişmedi kontrolleri
    tekrarlandı.
    **Son tur (aynı gün) — Seçenek B araştırıldı, test edildi, REDDEDİLDİ;
    Seçenek A'da gerçek bir kırpma hatası bulunup düzeltildi; bu kez
    GERÇEK mobil viewport'ta görsel doğrulama da yapıldı:**
    - **Seçenek B (masaüstü düzenini birebir mobilde küçültme) test edilip
      REDDEDİLDİ — kod sorunu değil, tasarım/okunabilirlik kısıtı.**
      Kullanıcı riski bilerek istedi; önce ucuz bir ön-test yapıldı:
      widget'ın gerçek masaüstü DOM'u (1296×762px doğal boyut) tarayıcıda
      canlı olarak 375px genişliğe `transform:scale()` ile küçültülüp
      ekran görüntüsü alındı (kod değişikliği yok, yalnızca geçici DOM
      manipülasyonu, sayfa sonra yeniden yüklenerek temizlendi). Sonuç:
      büyük KPI sayıları okunabilir, ama ikincil metinler/trend
      rozetleri/tarih-yüzde etiketleri/liste metadata'sı gerçekten
      okunaksız (bulanık piksel yığını). **Bu, container query ile de
      çözülemez** — sorun "CSS nasıl yazıldığı" değil, masaüstü bilgi
      yoğunluğunun fiziksel olarak ~375-480px'e sığmaması. 24 dosya/satır
      risklik dönüşüm bu nedenle yapılmadı.
    - **Seçenek A'da bulunan gerçek kırpma hatası düzeltildi.** Aynı
      ön-test sırasında, dış sarmalayıcının (`outerRef`, `flex
      justify-center overflow-hidden`) `align-items` için Flexbox
      varsayılanı (`stretch`) kullandığı fark edildi — bu, `scaledHeight`
      ile sınırlanan dış kutunun yüksekliğini, `transform:scale()` ile
      ölçeklenen `inner`'ın GERÇEK layout yüksekliğine (görsel değil,
      DOM ölçüsü) dayatıp içeriği kırpıyordu (`inner.offsetHeight` dış
      kutunun yüksekliğine sıkışıyor, `scrollHeight` çok daha büyük
      kalıyordu). **Düzeltme:** `outerRef` div'inin className'ine
      `items-start` eklendi (`ProductPreviewWidget.tsx`, ~satır 2963).
    - **Bu kez gerçek mobil viewport'ta uçtan uca GÖRSEL doğrulama
      YAPILDI** (önceki turlardaki araç kısıtı bu seferki denemede
      aşıldı — yeni bir sekme açılıp `resize_window` ÖNCE, `navigate`
      SONRA çağrıldığında pencere gerçekten 558px genişliğe küçüldü;
      önceki turlarda mevcut bir sekmeyi sonradan yeniden boyutlandırma
      işe yaramamıştı). 558px < 1024px mobil eşiği olduğu için widget
      gerçekten hydrate olup `isMobile=true` durumuna geçti (doğrulandı:
      `inner` üzerinde gerçek satır-içi `width:480px; transform:
      scale(0.721)` stili göründü). Ölçüm: `inner.offsetHeight` (870px)
      artık `inner.scrollHeight`'a (869px) eşit — kırpma YOK. Ekran
      görüntüsü + yakın çekim: sekme çubuğu, KPI kartları, grafik başlığı
      ve eksen etiketleri net okunabilir, içerik tam ve bütün görünüyor.
    - ~~Kalıcı karar: Seçenek A benimsendi, Seçenek B bir daha gündeme
      alınmayacak~~ — **BU KARAR AYNI GÜN GERİ ALINDI, bkz. aşağıdaki
      BEŞİNCİ tur.** Kullanıcı okunabilirlik riskini bilerek yine de
      Seçenek B'yi istedi.
    **Doğrulama (bu tur):** `astro build` temiz, 8/9 regresyon script'i
    sıfır sorun (aynı bilinen 5 sayfalık heading-hierarchy taban çizgisi,
    bu değişiklikten bağımsız — yalnızca `ProductPreviewWidget.tsx` ve bu
    dosya değişti).
    **BEŞİNCİ tur (aynı gün) — Seçenek B UYGULANDI, kullanıcı riski
    bilerek ısrar etti: "Kullanıcı, okunabilirlik riskini bilerek Seçenek B
    (masaüstü düzeninin birebir mobilde küçültülmüş hali) ile devam etmek
    istiyor kararlı."**
    - **Güvenlik ağı:** Seçenek A'nın son çalışan hali (yukarıdaki dördüncü
      tur — `items-start` kırpma düzeltmesi + genişlik-öncelikli ölçekleme +
      StickyDemoBar kompaktlaştırma dahil, commit `314f04f`) `master`'da
      commit edildi VE `mobil-widget-secenek-a-yedek` dalına (her iki
      remote'a da push edildi) işaretlendi — geri dönüş gerekirse bu dal
      kullanılabilir. `master` bu commit'in ÜZERİNE Seçenek B'yi inşa etti
      (checkout edip geri dönmek yerine — StickyDemoBar düzeltmesi gibi
      widget-mekanizmasından BAĞIMSIZ iyileştirmeler kaybolmasın diye).
    - **Teknik uygulama:** `ProductPreviewWidget.tsx`'teki TÜM `lg:`/`sm:`
      (viewport medya sorgusu) sınıfları `@min-[1024px]:`/`@min-[640px]:`
      (Tailwind v4 container query, arbitrary-value söz dizimi — v4'ün
      `@lg`/`@sm` varsayılan container eşikleri viewport eşiklerinden farklı
      olduğu için bilinçli tercih) ile değiştirildi (~30 site). Widget artık
      ÜÇ katmanlı: `outerRef` (gerçek viewport genişliğini ölçer) →
      `containerRef` (`@container` + SABİT `DESKTOP_NATURAL_WIDTH=1280px` +
      `transform:scale()` + `flexShrink:0`) → `innerRef` (asıl `flex-col
      @min-[1024px]:flex-row` düzeni + tüm alt bileşenlerin container query
      kuralları). CSS containment kısıtı (bir eleman kendi container
      query'sinin hedefi olamaz) üç-katman yapısını ZORUNLU kıldı. `isMobile`/
      `matchMedia` durumu TAMAMEN kaldırıldı — ölçek artık yalnızca genişlik
      oranına bağlı, HER ZAMAN hesaplanıyor (masaüstünde doğal olarak ~1).
    - **`align-items:stretch` kırpma hatası** (Seçenek A'dan miras, `outerRef`
      className'inde `items-start` zaten vardı) — AYNEN korundu, hâlâ gerekli.
    - **Bu turda YENİ bulunan bir ölçek-tabanı hatası düzeltildi:** Seçenek
      A'nın `[0.5,1]` ölçek aralığı `NATURAL_MOBILE_WIDTH=480` içindi (0.5
      tabanı → min 240px render, telefona sığar). `DESKTOP_NATURAL_WIDTH=1280`
      ile AYNI 0.5 tabanı min 640px render demek — HİÇBİR telefonda
      `outerRef`'e sığmaz, `overflow-hidden` tarafından KIRPILIR. Gerçek DOM
      testinde doğrulandı (278px konteynerde 0.5 taban ile widget 640px
      render edip taştı) — alt sınır TAMAMEN kaldırıldı, ölçek yalnızca üstten
      (`Math.min(1, widthScale)`) sınırlı, her zaman tam genişliğe sığıyor.
    - **Doğrulama:** `astro build` temiz, derlenen CSS'te `container-type:
      inline-size` + `@container (width>=1024px)` kuralları doğrulandı
      (gerçek container query üretildi). 8/9 regresyon script'i sıfır sorun
      (aynı bilinen, ilgisiz heading-hierarchy taban çizgisi). **Gerçek
      ürünüm koduyla (mock/DOM taklidi DEĞİL) canlı doğrulama yapıldı:**
      widget'ın gerçek ata konteyneri (`HeroSection.astro`'nun `max-w-[88rem]`
      sarmalayıcısı) geçici olarak 390px'e daraltıldı (tarayıcı
      `resize_window` aracı bu oturumda güvenilmez çıktı, gerçek viewport
      genişliği değişmedi — bu yüzden ata elemanın kendi genişliği
      daraltılıp gerçek `ResizeObserver`'ın tepki vermesi izlendi), sonuç:
      `outerRef` 278px'e küçüldü, `containerRef` `scale(0.217)` ile TAM
      278px'e ölçeklendi (taşma/kırpma YOK), ekran görüntüsünde masaüstü
      sidebar+2×2 grid düzeni (mobil-reflow DEĞİL, GERÇEK masaüstü hali)
      bozulmadan, kesilmeden, üst üste binmeden göründü — yalnızca küçük
      (kabul edilen okunabilirlik ödünü). Masaüstü viewport'ta (gerçek
      geniş pencere) `scale(1)` doğrulandı, hiç değişmedi.

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
