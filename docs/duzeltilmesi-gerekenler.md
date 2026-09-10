# Düzeltilmesi Gereken Konular

**Son doğrulama:** 2026-09-04 · `master` @ `a643794`
**Yöntem:** Temiz `npm ci` + `npx astro build` (pipefail'li) + `astro check` + 9 denetim script'i
+ build çıktısının doğrudan analizi + canlı Cloudflare API sorguları (salt-okunur).
Tüm sayısal değerler bu turda fiilen ölçüldü.

> **Önceki tur (`b3a95ff`) ile fark:** 48 commit geldi.
> Güvenlik açıklarının **tamamı kapandı**, SEO aktivasyonu **tamamlandı**, form backend'i **bağlandı**.
> Buna karşılık **deploy hazırlığı** yeni bir iş kalemi olarak açıldı ve 2 yeni SEO bulgusu tespit edildi.
> Kapananların listesi §5'te — tekrar araştırılmasın.

---

## Özet

| # | Konu | Durum | Öncelik |
|---|---|---|---|
| 1 | ~~KV `SESSION` binding'inin `id`'si yok~~ | ✅ Kapandı | — |
| 2 | ~~Sitemap'te 141 noindex stub'ı~~ | ✅ Kapandı | — |
| 3 | ~~`_redirects` trailing slash → 301+307 zinciri~~ | ✅ Kapandı | — |
| 4 | SendGrid anahtarı yok — formlar 503 dönüyor | ❌ Açık | 🟠 P1 |
| 5 | CI yok — Keystatic yayını canlıya yansımaz | ⚠️ Yeni | 🟠 P1 |
| 6 | Test ortamının indekslenme koruması | ⚠️ Yeni | 🟠 P1 |
| 7 | `idenfit.com` zone'unda WordPress dönemi ayarları | ⚠️ Yeni | 🟠 P1 |
| 8 | `npm audit` 3 high (puppeteer zinciri) | 🟡 Kabul | 🟡 P2 |
| 9 | CSP hâlâ Report-Only | 🟡 Kısmi | 🟡 P2 |
| 10 | Görsel optimizasyonu (`astro:assets`) yok | 🟡 Kısmi | 🟡 P2 |
| 11 | Ana sayfa DOM'u ~1.735 element | 🟢 Değişmedi | 🟢 P3 |
| 12 | reCAPTCHA iskelet — doğrulama fiilen kapalı | 🟡 Kısmi | 🟢 P3 |

---

## 1. 🔴 Deploy engelleri

### 1.1 ~~KV `SESSION` binding'inin `id`'si yok~~ — ✅ KAPANDI (2026-09-04)

`SESSION` namespace'i Cloudflare'da oluşturuldu ve kök `wrangler.json`'a eklendi:

```json
"kv_namespaces": [{ "binding": "SESSION", "id": "b2f65634236940da87f397afb29b0406" }]
```

Adapter'ın ürettiği `dist/server/wrangler.json`'a `id` ile birlikte geçtiği doğrulandı.

**`wrangler deploy --dry-run` ile deploy'un kabul edileceği teyit edildi** (yükleme YAPILMADI):

```
env.SESSION (b2f65634236940da87f397afb29b0406)   KV Namespace
env.BROWSER                                      Browser Run
env.IMAGES                                       Images
env.ASSETS                                       Assets

Worker: 2478 KiB → gzip 523 KiB   (Free limiti 3 MB — %17)
Statik: 4.568 dosya               (limit 20.000 — %22)
```

`Astro.session` kodda hiç kullanılmıyor; namespace boş kalacak, KV kotasına dokunmaz.

---

### 1.2 ~~Sitemap'te 141 noindex stub'ı~~ — ✅ KAPANDI (2026-09-04)

`astro.config.mjs`'e `isRedirectStub()` eklendi: sitemap `filter`'ı artık üretilmiş HTML'i
okuyup Astro'nun i18n fallback redirect şablonunu (`<meta http-equiv="refresh">` +
`robots noindex`) eliyor. Dosya okunamazsa sayfa **dahil edilir** — fail-safe, bir yol/zamanlama
değişikliği gerçek sayfaları sessizce düşüremez.

```
öncesi : 1073 URL — 932 gerçek + 141 STUB
sonrası:  932 URL — 932 gerçek +   0 stub   ✅
```

932 gerçek sayfanın **tamamı korundu**, tek bir sayfa kaybedilmedi.

---

## 2. 🟠 Cutover öncesi

### 2.1 ~~`_redirects` trailing slash~~ — ✅ KAPANDI (2026-09-04)

`astro.config.mjs`'in `redirects` bloğundaki **25 hedefe** trailing slash eklendi (anahtarlara
dokunulmadı). Adapter bunlardan 50 kural üretiyor:

```
öncesi : /suprema  →  /donanim     301  →  /donanim/  307   (iki sekme)
sonrası: /suprema  →  /donanim/    301                      (tek sekme)

slash'sız hedef: 50 → 0 ✅   |   50/50 kuralın hedefi dist'te MEVCUT
```

---

### 2.2 SendGrid anahtarı yok — formlar 503 dönüyor

Kod tarafı **tamam**: `/api/lead` doğrulama, e-posta oluşturma, hata kodları, hız sınırı hepsi
çalışır durumda. Anahtar yoksa sahte "başarılı" üretmiyor, dürüstçe **503** dönüyor.

Eksik: `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `LEAD_NOTIFICATION_EMAIL`.

⚠️ **Teslim edilebilirlik riski:** `idenfit.com` SPF kaydı
`v=spf1 include:_spf.google.com include:emaileuc.freshservice.com ~all` — **SendGrid yok**.
`em6359.idenfit.com` MX'i alan doğrulamasının kısmen kurulu olduğunu gösteriyor ama
uçtan uca test edilmeden canlıya çıkılmamalı; aksi halde lead e-postaları spam'e düşer.

- [ ] Secret'ları Cloudflare'a gir (`wrangler secret put` — repoya asla)
- [ ] SendGrid domain authentication'ı tamamla/doğrula
- [ ] Gerçek form gönderip gelen kutusuna düştüğünü teyit et

---

### 2.3 CI — GitHub Actions ile kuruldu (2026-09-10)

Keystatic Cloud `master`'a commit atıyor. Otomatik build/deploy zinciri olmadan pazarlama
ekibi panelden yayın yapsa bile site güncellenmiyordu — panel fiilen "kör" çalışıyordu.

**Workers Builds YERİNE GitHub Actions seçildi.** İkisi de aynı işi yapar; Actions üç
nedenle tercih edildi: (a) yapılandırma repoda görünür ve PR'da incelenebilir — bu projede
yalnızca panelde yaşayan kuralların yarattığı sorun zaten belgeli (bkz.
`docs/cloudflare-dashboard-rules.md`), ikinci bir görünmez katman eklemek istenmedi;
(b) PR'larda ayrı ve daha sıkı bir doğrulama koşulabiliyor; (c) her dal için otomatik
preview build'i üretmiyor, yani halka açık kopya riski baştan yok.

**`.github/workflows/deploy.yml`** — `master`'a her push'ta (PR merge'leri ve Keystatic bot
commit'leri dahil) `npm ci` → `astro check` → `astro build` → `npx wrangler deploy`.
Deploy'u yalnızca tip hatası veya build hatası durduruyor; SEO/erişilebilirlik script'leri
burada rapor üretiyor ama bloklamıyor — panelden yayınlanan bir yazının başlığı 3 karakter
uzun diye tüm sitenin güncellenmesini durdurmak, kimsenin izlemediği bir log'da sessizce
takılı kalmak olurdu.

**`.github/workflows/pr-checks.yml`** — PR'larda aynı build + 8 regresyon script'i,
bu kez **bloklayıcı**. `check-heading-hierarchy` bilinen taban çizgisi (Açık nokta #36)
yüzünden her zaman exit 1 verdiği için bilgi amaçlı ayrı bir adımda; #36 kapandığında
bloklayıcı listeye taşınmalı.

**Saat dilimi bilinçli sabitlendi (`TZ: Europe/Istanbul`).** Runner'lar UTC; site bugüne
kadar Türkiye'deki bir makineden elle deploy edildi. Sabitlenmeseydi ilk CI deploy'unda
Açık nokta #43'teki naive tarihlerden beslenen ~161 sayfanın "Son Güncelleme" damgası
sessizce 3 saat kayardı. Blog tarihleri bu riskin dışında (Açık nokta #42, şema `+03:00`
ekliyor). #43 çözülürse bu satır kaldırılabilir.

- [ ] Repo Settings > Secrets and variables > Actions altına `CLOUDFLARE_API_TOKEN` ve
      `CLOUDFLARE_ACCOUNT_ID` gir. Token izinleri: Workers Scripts:Edit,
      Workers KV Storage:Edit, Account Settings:Read.
- [ ] İlk CI deploy'undan sonra doğrula: `wrangler deploy` dashboard'daki route'ları
      silmiyor (`/tr/*`, `/sitemap_index.xml`, `/wp-*` — bkz.
      `docs/cloudflare-dashboard-rules.md`).
- [ ] İlk CI deploy'undan sonra doğrula: `git rev-parse origin/master` ile canlıya çıkan
      commit aynı mı.

---

### 2.4 Test ortamının indekslenme koruması

`astro.config.mjs`'te `site: 'https://idenfit.com'` **sabit kodlu**. Build çıktısındaki her URL
production domainini gösteriyor:

```
canonical  → https://idenfit.com/
og:url     → https://idenfit.com/
hreflang   → https://idenfit.com/
robots.txt → Allow: /  +  Sitemap: https://idenfit.com/sitemap-index.xml
```

Test domaininde (`idenfit.com.tr`) yayınlanırsa site **taranabilir** olur ve canonical'ı şu an
canlı olan eski WordPress'e işaret eder.

**Katmanlı koruma (kod değişikliği gerekmez):**
1. **Cloudflare Access** (Zero Trust, ≤50 kullanıcı ücretsiz) — birincil kilit. Crawler, link
   paylaşımı, tesadüfi ziyaret hepsi giriş ekranında biter
2. **Transform Rule** → `X-Robots-Tag: noindex, nofollow, noarchive` — ikinci emniyet
3. GSC'ye eklenmez, hiçbir yerden link verilmez, ömrü kısa tutulur

> **Kabul edilen sınır:** canonical/hreflang/sitemap doğruluğu test fazında **doğrulanamaz** —
> hepsi `idenfit.com` diyecek. Bunlar ancak cutover sonrası test edilebilir. Test kapsamı
> dışında olduğu baştan kabul edilmeli.

---

### 2.5 `idenfit.com` zone'unda WordPress dönemi ayarları

Zone yıllardır WordPress'e hizmet ediyor. Cutover'dan **önce** denetlenmeli:

| Ayar | Neden |
|---|---|
| **Always Online** | ⚠️ En kritik. Worker hata verdiğinde eski WP anlık görüntüsünü servis eder — hatayı gizler |
| **APO for WordPress** | Varsa kapatılmalı |
| Rocket Loader / Auto Minify / Mirage / Polish | Yeni siteyi bozabilir |
| wp-admin Page Rule'ları / Cache Rules | Artık anlamsız |
| HSTS `includeSubDomains` | `idenfit.com`'un TÜM alt alanları HTTPS'e hazır değilse bozar — envanter çıkarılmalı |
| MX / SPF / DKIM / SendGrid CNAME'leri | **Hiç dokunulmaz** — cutover yalnızca A/HTTP yönlendirmesini değiştirir |

Ayrıca eklenmesi önerilenler:
- **WAF:** `/wp-login.php`, `/xmlrpc.php`, `/wp-admin/*`, `*.php` → Block. Eski WP'ye yönelik bot
  gürültüsü aksi halde Worker'a düşüp kotayı yakar
- **Redirect Rules:** `www → apex`, eski Yoast sitemap'leri → `/sitemap-index.xml`,
  `/feed/`, `/category/*`, `/tag/*` → `/blog/`
- **Rate Limiting:** `/api/lead` için (Worker içi sayaç dağıtık değil, gerçek savunma bu)

---

## 3. 🟡 Orta öncelik

### 3.1 `npm audit` 3 high — bilinçli kabul

```
extract-zip  (symlink path traversal, GHSA-jmr9-qjv8-65gv)
└─ @puppeteer/browsers
   └─ @cloudflare/puppeteer
```

`extract-zip` yalnızca **yerel tarayıcı binary'si indirip açmak** için kullanılıyor. Workers'ta
tarayıcı `env.BROWSER` binding'inden geliyor — bu kod yolu production'da hiç çalışmıyor.
`npm audit fix --force` paketi 1.4.0 → 0.0.11'e düşürüyor (breaking), bu yüzden uygulanmadı.

- [ ] Bilinçli kabul olarak kaydet, yukarı akımı periyodik izle
- [ ] "Deploy öncesi 0 açık" disiplini bu istisnayı hesaba katmalı

---

### 3.2 CSP hâlâ Report-Only

Başlıklar (`X-Frame-Options`, `nosniff`, `Referrer-Policy`, HSTS) **basılıyor** — bu kısım kapandı.
CSP ise `Content-Security-Policy-Report-Only`: hiçbir şeyi engellemiyor.

CLAUDE.md Açık nokta #46'daki 3 koşul makul (site canlı olmalı, `report-uri` toplayıcı kurulmalı,
1-2 hafta sessiz gözlem). Madde burada unutulmaması için duruyor.

⚠️ İki CSP string'i (`public/_headers` + `src/middleware.ts`) **elle senkron** tutuluyor —
biri değişirse diğeri de güncellenmeli.

---

### 3.3 Görsel optimizasyonu yok

`astro:assets` / `<Image>` kullanımı **0**. Yapılan: CLS pilotu (79 `width`/`height`, blog hero
`loading="eager"`). Kalan: WebP/AVIF, `srcset`.

978 blog görseli artık yerelde — engel kalktı. Adapter `images: {binding:"IMAGES"}` tanımlıyor;
bu binding şu an **atıl** ama `astro:assets`'e geçilirse **Cloudflare Images devreye girer ve
ayrıca faturalanır**. Karar bilinçli verilmeli: IMAGES binding'i mi, build-time Sharp mı
(ikincisi $0).

---

## 4. 🟢 Düşük öncelik

### 4.1 Ana sayfa DOM'u

| Sayfa | Ham | Gzip | Element |
|---|---|---|---|
| `/` | 300 KB | 62 KB | **1.735** |

Chrome eşiği ~1.500. Açık nokta #25'te yeniden araştırılmış, aynı sonuca varılmış: MegaMenu'nün
4 paneli lazy-mount edilemiyor (SSR HTML'inden crawl edilebilir linkler kaybolur), `client:visible`
DOM'u değiştirmiyor. Kalan tek yol menü içeriğini azaltmak — teknik değil IA/tasarım kararı.

### 4.2 reCAPTCHA iskelet

```ts
if (!secretKey) return true;   // secret yoksa doğrulama atlanıyor
```

Site key henüz yok. Şu anki tek koruma IP bazlı hız sınırı (10 istek/dk) — Workers isolate'ı
içinde tutuluyor, **dağıtık garanti vermiyor**. Kalıcı çözüm: Cloudflare Rate Limiting kuralı
(§2.5) veya reCAPTCHA'yı aktifleştirmek.

---

## 5. ✅ Bu turda kapanan maddeler

Doğrulandı, tekrar araştırılmasın:

| Konu | Kanıt |
|---|---|
| **PDF şablonuna HTML enjeksiyonu** | İki katman: `isValidScoreRecord()` (0-100 sayı zorunlu) + şablonda her interpolasyona `escapeHtml`. **Saldırı yeniden çalıştırıldı → escape edildi**; string/101 skor **reddediliyor** |
| **`/api/maturity-pdf` korumasız** | `X-Pilot-Secret` zorunlu; secret yoksa **404** (fail-closed) |
| **Hız sınırı yok** | 10 istek/dk/IP, `cf-connecting-ip` bazlı |
| `site` / canonical / hreflang / sitemap / robots | `site` tanımlı · canonical basılıyor · **6 hreflang** (az dahil) · `check-hreflang` **248 sayfa 0 sorun** · `sitemap-index.xml` üretiliyor · `robots.txt` (`Disallow: /keystatic/`) |
| Form backend'i | `/api/lead` gerçek endpoint (anahtar bekliyor, bkz. §2.2) |
| PII konsola yazılması | Form `console.log`'ları tamamen kaldırıldı |
| `prerender` guard'ı | `check-prerender.mjs` eklendi — **204/204 doğru** |
| Decap artıkları | `package.json`'dan çıktı |
| CSP `img-src`'te `idenfit.com` | Kaldırıldı (Açık nokta #45 kapandığı için) |
| `check-hreflang` DIST_DIR | `dist/client`'a düzeltildi |
| Açık nokta #45 | Site geneli hotlink **293 → 0** |
| Build kırıklığı · 973 kırık görsel · 618 yazı JSON'da · Decap/unpkg · fontlar · memoize · README | Önceki turda kapandı |

---

## 6. Doğrulama komutları

```bash
npm ci
npx astro check                                 # 0 hata
set -o pipefail; npx astro build                # exit 0 — pipefail ŞART
node scripts/check-prerender.mjs                # 204/204
node scripts/check-json-ld.mjs                  # 0 geçersiz
node scripts/check-hreflang.mjs                 # 248 sayfa, 0 sorun
node scripts/check-link-accessibility.mjs       # 0
node scripts/check-image-alt-text.mjs           # 0
node scripts/check-title-length.mjs             # 0
node scripts/check-meta-description-length.mjs  # 0
node scripts/check-html-lang-attribute.mjs      # 0
node scripts/check-heading-hierarchy.mjs        # 5 (bilinen taban çizgisi)
npm audit                                       # 3 high (bkz. §3.1)
```

**Bilinen temel çizgi (regresyon değil):** `check-heading-hierarchy` → ana sayfanın 5 dilinde
H1→H3 atlaması (Açık nokta #36). Bu script **exit 1** döndürür — CI gate'i kurulursa ya #36
kapatılmalı ya da gate bu istisnayı hesaba katmalı.

---

## 7. Deploy — doğrulanmış Cloudflare durumu

Canlı API'den okundu (2026-09-04):

```
Hesap Idenfit : Workers script 0 · KV namespace 0 · Pages projesi 0
                idenfit.workers.dev kayıtlı
Abonelik      : pro $240/yıl (idenfit.com) · Workers Paid YOK
idenfit.com   : aktif, Pro · apex A 92.204.25.71 (eski WP) proxied · www aynı
                MX Google Workspace + SendGrid
idenfit.com.tr: aktif, Free · APEX KAYDI YOK · tek kayıt: *.idenfit.com.tr → 213.250.146.30
```

Deploy edilecek yük: `dist/client` 441 MB / 4.568 dosya · worker 2.5 MB (gzip ~0.5 MB) —
20.000 dosya ve 10 MB limitlerinin altında.

**Aylık ek maliyet ≈ $5** (Workers Paid). Statik dosya + bant genişliği $0; Browser Rendering
Paid planda 10 saat/ay dahil ≈ 2.400-3.600 PDF — bu hacimde ücretsiz kotada kalır.

### Önerilen sıra

```
Faz 0  KV namespace + secret'lar + Workers Paid
       + kod düzeltmeleri: sitemap filtresi (§1.2), redirect slash'ları (§2.1)
Faz A  workers.dev smoke → bitince workers.dev route'unu KAPAT
Faz B  test.idenfit.com.tr + Cloudflare Access + X-Robots-Tag + CI kurulumu (§2.3, §2.4)
Faz C  T-7 zone denetimi (§2.5) → Worker ROUTE ile cutover → rollback = route sil
```

> **Cutover'da Custom Domain DEĞİL Worker Route kullanın.** Custom Domain apex A kaydını
> değiştirir; Route ise `92.204.25.71` kaydını **yerinde bırakır**, Worker sadece araya girer.
> Rollback = route'u silmek: saniyeler, DNS'e hiç dokunmadan. Cutover öncesi
> "route ekle → doğrula → sil" provası da yapılabilir.

---

## 8. Kapsam dışı — bilinçli kararlar

İncelendi, **sorun değil**:

- `target="_blank"` — 300 dosya / 278 link, `rel` eksiği yok
- Kaynakta secret/API anahtarı yok
- **204/204 sayfa** `prerender = true`; `check-prerender.mjs` bunu artık otomatik koruyor
- Blog gövdesindeki ham WP HTML `set:html` ile basılıyor ama build-time'da sabitlenen, kendi
  kontrolünüzdeki içerik — ziyaretçi girdisi değil, XSS vektörü yok
- Keystatic'in 2.7 MB admin bundle'ı yalnızca `/keystatic`'te yükleniyor — ana sayfanın
  referansladığı JS 0.1 KB, genel sayfa performansı etkilenmiyor
- İK raporu `payload.email`'e gidiyor ("isteyen istediği adrese rapor isteyebilir") — PDF içeriği
  artık saldırgan kontrolünde olmadığı için bu ürünün amaçlanan davranışı
- i18n fallback redirect stub'larının `noindex` olması Astro'nun kendi şablonu (Açık nokta #27) —
  ama **sitemap'e girmemeleri gerekiyor**, bkz. §1.2
