# Düzeltilmesi Gereken Konular

**Tarih:** 2026-08-27
**Kapsam:** `idenfit/idenfit.com` — `master` @ `c82e64b`
**Yöntem:** Temiz klon + `npm install` (lockfile'a sadık) + `npx astro build` + kaynak kod incelemesi.
Tüm sayısal bulgular bu ortamda fiilen ölçüldü, tahmin değil.

---

## Özet

| # | Konu | Öncelik | Efor |
|---|---|---|---|
| 1 | `astro build` tamamen kırık — deploy edilemiyor | 🔴 P0 | 1 satır |
| 2 | 973 blog görselinin tamamı eski WordPress'e bağlı | 🔴 P0 | 0.5-1 gün |
| 3 | Decap CMS yanlış depoyu gösteriyor | 🟠 P1 | 1 satır |
| 4 | CMS OAuth proxy'si kurulmamış — login çalışmıyor | 🟠 P1 | 1-2 saat |
| 5 | `site` tanımsız → canonical/hreflang/sitemap/robots yok | 🟠 P1 | 1-2 saat |
| 6 | 5 lead formu sahte — gönderilen veri kayboluyor | 🟠 P1 | 0.5-1 gün |
| 7 | 618 blog yazısı CMS'ten görünmüyor | 🟡 P2 | 0.5 gün |
| 8 | Decap CDN'den kayan sürümle yükleniyor (SRI yok) | 🟡 P2 | 30 dk |
| 9 | Güvenlik başlıkları / CSP yok | 🟡 P2 | 1 saat |
| 10 | Formlarda PII konsola yazılıyor | 🟡 P2 | 15 dk |
| 11 | Google Fonts dış kaynaktan (KVKK/GDPR) | 🟡 P2 | 1 saat |
| 12 | Görsel optimizasyonu hiç yok (`astro:assets` kullanılmıyor) | 🟢 P3 | 1-2 gün |
| 13 | Ana sayfa DOM'u ağır (~1.689 element) | 🟢 P3 | Araştırma |
| 14 | `getAllBlogPosts()` memoize değil | 🟢 P3 | 15 dk |
| 15 | README / package.json / repo şişkinliği | 🟢 P3 | 30 dk |
| 16 | CI'da `pipefail` yok — hata maskeleniyor | 🟢 P3 | 1 satır |

---

## 🔴 P0 — Launch blocker

### 1. `astro build` tamamen kırık

Temiz kurulumda build **exit 1** veriyor ve `dist/` hiç oluşmuyor:

```
$ npx astro build
11:47:25 [content] Syncing content
File path must be relative to the site root. Got: /home/user/idenfit.com/src/content/blog/posts.json
  at Object.set (node_modules/astro/dist/content/mutable-data-store.js:297:19)
→ exit 1
```

**Kök neden:** `src/content.config.ts:131` mutlak yol veriyor; Astro göreli yol şart koşuyor
(`mutable-data-store.js:297` → `if (filePath.startsWith("/")) throw`).

**Düzeltme** — `POSTS_JSON_PATH` sabiti zaten göreli, doğrudan kullanılmalı:

```diff
- const filePath = fileURLToPath(jsonUrl);
+ const filePath = POSTS_JSON_PATH;
```

`fileURLToPath` import'u başka yerde kullanılmıyorsa o da temizlenebilir.

**Doğrulandı:** düzeltme uygulandığında `927 sayfa, 45.74 sn, exit 0`.

> `package-lock.json` astro'yu **7.2.4**'e sabitliyor ve kurulu sürüm de 7.2.4 — yani bu hata
> her temiz kurulumda, her geliştiricide ve Cloudflare Pages'te aynı şekilde çıkar.
> Lokalde çalışıyor görünmesinin sebebi eski `node_modules` / `.astro` önbelleği olabilir.

- [ ] Düzeltmeyi uygula
- [ ] `rm -rf node_modules .astro dist && npm ci && npx astro build` ile temiz doğrula
- [ ] `echo $?` → 0 ve `dist/` dolu olmalı

---

### 2. 973 blog görselinin tamamı eski WordPress'e bağlı

Blog içeriğindeki her görsel mutlak URL ile `https://idenfit.com/wp-content/uploads/...` gösteriyor:

```
Farklı görsel referansı:            976
→ idenfit.com/wp-content'e:         973
   yerelde mevcut:                    0   ← sıfır
   EKSİK:                           973
```

`public/wp-content/` altında yalnızca **27 dosya** var (pazarlama sayfaları için).
`uploads.zip` `.gitignore`'da, *"kullanılan görseller zaten public'te"* notuyla — ama
blog görselleri hiç çıkarılmamış.

**Etki:** DNS `idenfit.com`'u yeni siteye çevirdiğiniz anda bu URL'ler **yeni siteyi**
göstermeye başlar; dosyalar orada olmadığı için 973 görsel aynı anda 404 verir.
Kendi kendini kıran bir bağımlılık.

**Düzeltme:**
1. `uploads.zip`'ten 973 dosyayı çıkarıp `public/wp-content/uploads/...` altına yerleştir
   (mevcut `scripts/localize-images.mjs` bu iş için var)
2. Veya tercih edilen yol: görselleri yerelleştirirken URL'leri **göreli** hale getir
   (`/wp-content/uploads/...`) — böylece domain'e hiç bağımlı kalmaz
3. `posts.json` + 4 `.md` dosyasındaki referansları güncelle

- [ ] Görselleri çıkar/yerleştir
- [ ] URL'leri göreli yap
- [ ] Doğrula: build sonrası `dist/` içinde kırık referans kalmadığını kontrol et

> **Not:** Bu iş madde 12 (görsel optimizasyonu) ile birlikte yapılırsa iki kat kazanç sağlar —
> görseller zaten elden geçiyorken `astro:assets`'e almak ek maliyet çıkarmaz.

---

## 🟠 P1 — Cutover / CMS açılışı öncesi zorunlu

### 3. Decap CMS yanlış depoyu gösteriyor

`public/admin/config.yml:3`:

```yaml
repo: Sude-product/site-migration-astro   # ❌ kod artık idenfit/idenfit.com'da
```

Düzeltilmezse CMS yanlış depoya yazar veya yetki hatası verir.

```diff
- repo: Sude-product/site-migration-astro
+ repo: idenfit/idenfit.com
```

- [ ] Düzelt

---

### 4. CMS OAuth proxy'si kurulmamış — login çalışmıyor

`config.yml:10`'da `base_url` yorum satırında. Decap'in varsayılanı `https://api.netlify.com`
olduğu için bugün "Login with GitHub" butonu başarısız olur.

GitHub OAuth App'leri PKCE desteklemediğinden **proxy zorunlu** (client secret tarayıcıda tutulamaz).

**Yapılacaklar:**
1. GitHub OAuth App oluştur — callback: `https://idenfit.com/api/callback`
2. İki Cloudflare Pages Function: `functions/api/auth.js` + `functions/api/callback.js`
   (callback, `authorization:github:success:{"token":"..."}` mesajını `postMessage` ile döndürmeli)
3. `CLIENT_ID` / `CLIENT_SECRET` → Cloudflare encrypted env vars (repoya asla)
4. `config.yml`'e ekle:
   ```yaml
   base_url: https://idenfit.com
   auth_endpoint: api/auth
   ```

- [ ] OAuth App
- [ ] Function'lar
- [ ] Secret'lar
- [ ] `config.yml`
- [ ] Uçtan uca test

> **Yetki notu:** Decap'in tek yetki kontrolü `hasWriteAccess()` → `permissions.push`.
> Rol sistemi **yok** — push yetkisi olan herkes tüm yazıları oluşturur/düzenler/siler.
> İki rol isteniyorsa: `publish_mode: editorial_workflow` + `master`'da branch protection.
> Token `scope=repo` olduğu için marketing hesaplarına **yalnızca bu repoda** yetki verin,
> org geneli erişim vermeyin.

---

### 5. `site` tanımsız → canonical / hreflang / sitemap / robots yok

`astro.config.mjs`'de `site` alanı yok. Kod `Astro.site` dolu olduğunda doğru davranacak
şekilde yazılmış ama şu an hepsi bastırılıyor:

- `<link rel="canonical">` hiç basılmıyor (`BaseLayout.astro:153` — `{Astro.site && !noindex && ...}`)
- hreflang etiketleri basılmıyor — **5 dilli sitede ciddi kayıp**
- `og:url` göreli kalıyor (spec mutlak istiyor → paylaşım önizlemeleri bozuk)
- `@astrojs/sitemap` **kurulu değil**, `robots.txt` **yok**

622 yazılık bir SEO migrasyonunu sitemap'siz yapmayın.

- [ ] `site: 'https://idenfit.com'` ekle
- [ ] `npx astro add sitemap`
- [ ] `public/robots.txt` (+ sitemap referansı)
- [ ] `node scripts/check-hreflang.mjs` ile doğrula (bu script `site` boşken 0 sayfa buluyor)

---

### 6. 5 lead formu sahte — gönderilen veri kayboluyor

`HeroForm` · `LandingRequestForm` · `SupportRequestForm` · `HrMaturityTest` · İletişim —
hepsi aynı desende:

```js
console.log('Hero form gönderildi:', { ...data, phone: `+${country.dialCode}${data.phone}` });
window.location.href = '/tesekkurler/';
```

Ad/e-posta/telefon konsola yazılıp atılıyor, kullanıcı "Teşekkürler" sayfası görüyor.
Bir pazarlama sitesi için bu, **sitenin asıl işini yapmaması** demek — her demo talebi
sessizce kayboluyor. Ayrıca KVKK aydınlatma metni onaylatılıp hiç işlenmeyen veri toplanıyor.

- [ ] Cloudflare Pages Function ile gerçek endpoint (`functions/api/lead.js`)
- [ ] CRM / e-posta entegrasyonu
- [ ] Spam koruması (env'de zaten `GOOGLE_RECAPTCHA_SITE_KEY` deseni var)
- [ ] Hata durumunda kullanıcıya geri bildirim (şu an sessizce "başarılı" sayılıyor)

---

## 🟡 P2 — Önemli

### 7. 618 blog yazısı CMS'ten görünmüyor

Decap yalnızca `src/content/blog/*.md` dosyalarını görür. Şu an **4** `.md` var,
kalan **618 yazı `posts.json`** içinde (6.3 MB). Marketing panele girdiğinde listede
4 yazı görecek; mevcut yazıları düzenleyemeyecek.

- [ ] `node scripts/migrate-blog-to-markdown.mjs <slug...>` ile toplu göç
- [ ] Göç sonrası `posts.json` ve `legacyJsonLoader` kaldırılabilir (madde 1'i de gereksiz kılar)
- [ ] `scripts/verify-blog-posts.mjs` güncel değil — `.md` yazıları görmüyor, düzeltilmeli

---

### 8. Decap CDN'den kayan sürümle yükleniyor (SRI yok)

`public/admin/index.html:12`:

```html
<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
```

Kayan sürüm aralığı + SRI yok + üçüncü taraf CDN. unpkg veya paketin ele geçirilmesi
durumunda saldırgan, panele giren kullanıcının GitHub token'ını çalar. Token `scope=repo`
olduğu için bu, kullanıcının erişebildiği **tüm private repoları** kapsar — sitedeki en
yüksek etkili senaryo.

- [ ] Sürümü tam sabitle (`decap-cms@3.x.y`) **ve** `integrity` hash ekle
- [ ] Tercihen: bundle'ı `public/admin/vendor/` altına indirip self-host et *(test edildi, çalışıyor)*

---

### 9. Güvenlik başlıkları / CSP yok

`public/_headers` dosyası yok — Cloudflare Pages'te hiçbir güvenlik başlığı tanımlı değil.

```
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: ...
```

CSP, madde 8'deki CDN senaryosunun etkisini de daraltır.

- [ ] `public/_headers` ekle
- [ ] CSP'yi önce `Content-Security-Policy-Report-Only` ile test et (YouTube/Fonts/Decap allowlist gerekir)

---

### 10. Formlarda PII konsola yazılıyor

Ad/e-posta/telefon `console.log` ile tarayıcı konsoluna basılıyor (madde 6'daki 5 dosya).

- [ ] Backend bağlanırken bu satırları kaldır

---

### 11. Google Fonts dış kaynaktan (KVKK/GDPR)

`BaseLayout.astro:252-255`, `Layout.astro`, `LandingLayout.astro` — Quicksand 5 ağırlık
Google'dan çekiliyor, ziyaretçi IP'leri Google'a gidiyor. Almanya'da GDPR ihlali sayılan
bir uygulama; NL/IT dilleriyle AB'ye hitap eden ve KVKK sayfası olan bir sitede riskli.

- [ ] Fontları self-host et (`public/fonts/`, `@font-face`, `font-display: swap`)
- [ ] Kritik ağırlığı `preload` et
- [ ] Yan fayda: render-blocking istek kalkar (~100-200 ms)

---

## 🟢 P3 — İyileştirme

### 12. Görsel optimizasyonu hiç yok

`astro:assets` / `<Image>` kullanımı **0**; 60 ham `<img>` var.
WebP/AVIF dönüşümü yok, `srcset` yok, boyut verilmediği için CLS riski.
Blog görselleri WordPress'ten tam boy geliyor — **LCP'nin ana maliyeti**.

- [ ] Madde 2 ile birlikte `astro:assets`'e geçir
- [ ] `content.config.ts`'te `featuredImage.width/height` zaten opsiyonel — doldurulursa CLS düzelir

---

### 13. Ana sayfa DOM'u ağır

| Sayfa | Ham | Gzip | Açılış etiketi |
|---|---|---|---|
| `/` | 292 KB | 59 KB | ~1.689 |
| Blog yazısı (ort.) | 172 KB | ~46 KB | ~1.059 |

Chrome'un uyarı eşiği ~1.500 element. `CLAUDE.md` Açık nokta #25 zaten MegaMenu'nün
4 panelinin DOM'da sürekli durduğunu (447 element) işaretlemiş ve bilinçli ertelemiş.

- [ ] MegaMenu panellerini lazy-mount et (MobileMenu'deki `hasOpened` deseni)
- [ ] Regresyon riski: `MegaMenu.tsx:241-253`'teki focus/kapanma bug'ı — o yorumu okumadan dokunmayın

---

### 14. `getAllBlogPosts()` memoize değil

`src/data/blogContent.ts` — her çağrıda `getCollection('blog')` + 622 kaydın yeniden
sıralanması. `[slug].astro` bunu `getStaticPaths()` içinde bir, sayfa gövdesinde bir daha
çağırıyor (622 sayfa × N).

Şu ölçekte önemsiz (build 46 sn) ama blog büyüdükçe kareli büyür.

- [ ] Modül seviyesinde bir promise cache ekle

---

### 15. README / package.json / repo şişkinliği

- [ ] `README.md` hâlâ **Astro starter template'i** — proje hakkında tek kelime yok
- [ ] `package.json` adı `site-migration` → `idenfit-com`
- [ ] `reference/wordpress-export/*.json` ~31 MB ham export git'te izleniyor
      (`posts.json` 14 MB, `pages.json` 9.4 MB, `media.json` 7.8 MB) — göç bitince
      arşivlenip depodan çıkarılabilir

---

### 16. CI'da `pipefail` yok — hata maskeleniyor

`npm run build | tail` gibi pipe'lı kullanımda exit kodu son komuttan gelir, build
hatası **sessizce başarılı görünür**. Madde 1'in fark edilmemesinin muhtemel sebebi bu.

- [ ] CI script'lerinde `set -o pipefail`
- [ ] Cloudflare Pages build komutunun exit kodunu doğrula

---

## Doğrulama komutları

Projede zaten kalıcı denetim script'leri var — her turdan sonra çalıştırın
(**önce `astro build` şart**, hepsi `dist/` üzerinde çalışır):

```bash
npx astro check                              # tip güvenliği
npx astro build                              # exit kodunu kontrol edin!
node scripts/check-json-ld.mjs
node scripts/check-hreflang.mjs              # madde 5 sonrası anlamlı olur
node scripts/check-link-accessibility.mjs
node scripts/check-image-alt-text.mjs
node scripts/check-heading-hierarchy.mjs
node scripts/check-title-length.mjs
node scripts/check-meta-description-length.mjs
node scripts/check-html-lang-attribute.mjs
npm run audit                                # şu an 0 açık
```

**Bilinen temel çizgi (regresyon değil):**
- `check-heading-hierarchy` → ana sayfanın 5 dilinde H1→H3 atlaması (Açık nokta #36)
- `check-title-length` → `admin/index.html` (Decap kabuğu, kasıtlı kapsam dışı)

---

## Önerilen sıra

```
1  → build fix                    (her şeyin ön koşulu)
2  → pages.dev'e ilk deploy       (madde 3-6 test edilebilir hale gelir)
3  → CMS config + OAuth           (madde 3, 4)
4  → görseller                    (madde 2 + 12 birlikte)
5  → site + sitemap + robots      (madde 5)      ─┐ cutover
6  → form backend                 (madde 6)      ─┘ öncesi
7  → güvenlik sertleştirme        (madde 8, 9, 10, 11)
8  → blog göçü                    (madde 7)
9  → performans + hijyen          (madde 13-16)
```

---

## Kapsam dışı / bilinçli kararlar

Aşağıdakiler incelendi ve **sorun değil** — tekrar araştırılmasın:

- `local_backend: true` prod'da zararsız — Decap bunu yalnızca `localhost` hostname'inde
  devreye sokar. Yine de kurulum bitince temizlenebilir (hijyen).
- `target="_blank"` linkleri — 400 dosya / 266 link tarandı, **`rel` eksiği yok**.
- Blog gövdesindeki ham WP HTML `set:html` ile basılıyor ama build-time'da sabitlenen,
  kendi kontrolünüzdeki içerik. Ziyaretçi girdisi değil — gerçek bir XSS vektörü yok.
- `npm audit` → **0 açık**. Kaynakta secret/API anahtarı yok.
- ~1.492 redirect stub'ının `noindex` olması ve `<html lang>` taşımaması Astro'nun kendi
  framework şablonu (Açık nokta #27) — düzeltilecek bir şey yok.
