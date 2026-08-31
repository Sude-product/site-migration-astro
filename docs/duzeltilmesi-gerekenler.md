# Düzeltilmesi Gereken Konular

**Son doğrulama:** 2026-08-31 · `master` @ `b3a95ff`
**Yöntem:** Temiz `npm ci` + `npx astro build` + `astro check` + 8 denetim script'i + kaynak incelemesi.
Tüm sayısal değerler bu turda fiilen ölçüldü.

> **Önceki tur (2026-08-27, `c82e64b`) ile fark:** 44 commit geldi.
> **9 madde kapandı, 2'si kısmi, 3'ü açık kaldı, 4 yeni madde eklendi.**
> Kapananların listesi en altta — tekrar araştırılmasın.

---

## Özet

| # | Konu | Durum | Öncelik | Efor |
|---|---|---|---|---|
| 1 | `site` tanımsız → canonical/hreflang/sitemap/robots yok | ❌ Açık | 🔴 P0 | 1-2 saat |
| 2 | 6 form backend'siz — lead'ler kayboluyor | ❌ Açık | 🟠 P1 | 0.5-1 gün |
| 3 | Formlarda PII konsola yazılıyor | ❌ Açık | 🟠 P1 | 15 dk |
| 4 | CSP hâlâ Report-Only — hiçbir şeyi engellemiyor | 🟡 Kısmi | 🟡 P2 | Koşullu |
| 5 | Görsel optimizasyonu (`astro:assets`) yok | 🟡 Kısmi | 🟡 P2 | 1-2 gün |
| 6 | Ana sayfa DOM'u ~1.672 element | 🟡 Değişmedi | 🟢 P3 | Araştırma |
| 7 | **YENİ** — `prerender = true` unutma riski | ⚠️ Yeni | 🟠 P1 | 1 saat |
| 8 | **YENİ** — Decap artıkları (ölü bağımlılık) | ⚠️ Yeni | 🟢 P3 | 5 dk |
| 9 | **YENİ** — CSP `img-src`'te gereksiz `idenfit.com` izni | ⚠️ Yeni | 🟢 P3 | 5 dk |
| 10 | **YENİ** — Build süresi 46s → 150s | ℹ️ Bilgi | — | — |

---

## 🔴 P0 — Cutover öncesi zorunlu

### 1. `site` tanımsız → canonical / hreflang / sitemap / robots yok

Önceki turdan beri **değişmedi**, ve artık listedeki en kritik açık madde
(build ve görseller kapandığı için).

`astro.config.mjs`'de `site` alanı yok. Doğrulandı:

```
site: YOK
sitemap entegrasyonu YOK
public/robots.txt YOK
check-hreflang.mjs → "Faz 2'de prod domain bağlanınca otomatik aktifleşecek"
```

Sonuçları:

- `<link rel="canonical">` **hiç basılmıyor** (`BaseLayout.astro:153` — `{Astro.site && !noindex && ...}`)
- hreflang etiketleri basılmıyor — **5 dilli sitede ciddi kayıp**
- `og:url` göreli kalıyor (spec mutlak istiyor → paylaşım önizlemeleri bozuk)
- `@astrojs/sitemap` kurulu değil, `robots.txt` yok

622 yazılık bir SEO migrasyonunu sitemap'siz yapmayın.

**İyi haber:** kod `Astro.site` dolar dolmaz doğru davranacak şekilde yazılmış —
canonical/hreflang/JSON-LD `url` hepsi aynı bayrağa bağlı. Tek satır açıyor.

- [ ] `site: 'https://idenfit.com'` ekle
- [ ] `npx astro add sitemap`
- [ ] `public/robots.txt` (+ sitemap referansı)
- [ ] `node scripts/check-hreflang.mjs` → artık gerçek çıktı vermeli
- [ ] ⚠️ **Açık nokta #53:** `check-hreflang.mjs` hâlâ `DIST_DIR` varsayılanı `'dist'`
      kullanıyor; `output:'server'`'da çıktı `dist/client/` altında. `site` doldurulmadan
      **hemen önce** aynı `dist/client` düzeltmesi bu script'e de uygulanmalı
      (`check-html-lang-attribute.mjs`'e `e37694c`'de uygulandı) — yoksa doğru hreflang
      çıktısı yüzlerce sahte hatayla raporlanır

---

## 🟠 P1 — Yayın kalitesi

### 2. 6 form backend'siz — gönderilen veri kayboluyor

Önceki turdan beri **değişmedi**. `58d16c6` durumu kayda geçirdi ama kod aynı.

Doğrulandı: `src/pages/api` dizini yok, hiçbir formda `fetch` yok.

| Form | Sayfa |
|---|---|
| `HeroForm.tsx` | Ana sayfa hero **+** İletişim |
| `LandingRequestForm.tsx` | `/demo` |
| `SupportRequestForm.tsx` | `/destek-talebi/` |
| `HrMaturityTest.tsx` | İK Olgunluk Testi sonuç ekranı |
| `PresentationRequestForm.tsx` | Online Sunum Talebi |

Hepsi `console.log` + "Teşekkürler" sayfasına yönlendirme. Kullanıcı başarılı sandığı
her talep sessizce kayboluyor.

**Hukuki not (CLAUDE.md'de de kayıtlı):** 6 formun hepsi gönderim öncesi gerçek bir
KVKK onay metni gösteriyor. Kullanıcı onay verip gönderiyor, ama onayın konu ettiği
veri işleme **fiilen hiç gerçekleşmiyor** — gösterilen hukuki metinle sistemin davranışı
tutarsız. (Hukuki görüş değil, kod davranışının tespiti.)

> **`output:'server'` geçişi bunu kolaylaştırdı:** Worker runtime artık hazır.
> Eskiden ayrı bir Cloudflare Pages Function gerekiyordu; şimdi
> `src/pages/api/lead.ts` (+ `export const prerender = false`) yeterli.

- [ ] `src/pages/api/lead.ts` endpoint'i
- [ ] CRM / e-posta entegrasyonu
- [ ] Spam koruması (reCAPTCHA deseni diğer projede zaten var)
- [ ] Hata durumunda kullanıcıya geri bildirim (şu an her durumda "başarılı")

---

### 3. Formlarda PII konsola yazılıyor

Ad / e-posta / telefon tarayıcı konsoluna basılıyor — yukarıdaki 5 dosyada devam ediyor.

```js
console.log('Hero form gönderildi:', { ...data, phone: `+${country.dialCode}${data.phone}` });
```

- [ ] Backend bağlanırken (madde 2) bu satırları kaldır

---

### 7. 🆕 `prerender = true` unutma riski

`output:'static'` → `output:'server'` geçişinin getirdiği **yeni ve sessiz** bir tuzak.

Şu an **203/203 sayfa** `export const prerender = true` taşıyor — bu turda tek tek
doğrulandı, kazara SSR olan route **yok**. Sağlıklı durum.

**Ama:** Astro'da config seviyesinde toplu bir seçenek olmadığı için bu satır her yeni
sayfaya **elle** eklenmek zorunda. Unutulursa sayfa sessizce SSR'a düşer:

- Her istek Worker'ı çalıştırır → gereksiz maliyet + latency
- `public/_headers` uygulanmaz (statik varlık katmanına hiç uğramaz) →
  o sayfa güvenlik başlıklarını **middleware'den** alır; ikisi ayrı kaynak olduğu için
  sessizce farklılaşabilir
- Build çıktısında fark edilmesi zor

- [ ] `scripts/check-prerender.mjs` ekle — `src/pages/**/*.astro` içinde
      `prerender = true` taşımayan dosyaları raporlasın, bulursa exit 1
- [ ] Diğer `check-*.mjs`'lerle aynı desende yazılsın (elle recursive tarama)

---

## 🟡 P2 — Önemli

### 4. CSP hâlâ Report-Only

`public/_headers` + `src/middleware.ts` ile başlıklar **eklendi** (X-Frame-Options,
X-Content-Type-Options, Referrer-Policy, HSTS doğrulandı) — bu kısım kapandı.

Ama CSP `Content-Security-Policy-Report-Only` olarak duruyor: **hiçbir şeyi engellemiyor**,
yalnızca DevTools konsoluna rapor ediyor.

CLAUDE.md Açık nokta #46'da enforcing'e geçiş için 3 koşul tanımlanmış (site canlı olmalı,
`report-uri` toplayıcı kurulmalı, 1-2 hafta sessiz gözlem). Bu koşullar makul — madde
burada yalnızca **unutulmaması için** duruyor.

- [ ] `report-uri` endpoint'i (küçük bir Worker route)
- [ ] 1-2 hafta gözlem
- [ ] `-Report-Only` ekini kaldır
- [ ] ⚠️ İki CSP string'i (`_headers` + `middleware.ts`) elle senkron tutuluyor —
      biri değişirse diğeri de güncellenmeli

---

### 5. Görsel optimizasyonu (`astro:assets`) yok

Doğrulandı: `astro:assets` / `<Image>` kullanımı **0**.

Bu turda bir **CLS pilotu** yapılmış (`22dbbc9`): footer rozetleri + logo şeridine
`width`/`height`, blog öne çıkan görseline `loading="eager"`. Kaynakta 79 `width=`
sayıldı. Faydalı ama kısmi.

Kalan: WebP/AVIF dönüşümü yok, `srcset` yok. 978 blog görseli artık **yerelde**
(Açık nokta #14 kapandı) — yani `astro:assets`'in önündeki engel kalktı, dosyalar
build zamanında erişilebilir.

`@astrojs/cloudflare` adapter'ı varsayılan olarak Cloudflare IMAGES binding'ini
kullanan çalışır bir hat kuruyor. CLAUDE.md Açık nokta #48'de sıralama zaten
kararlaştırılmış: önce maliyet araştırması, sonra binding vs build-time ön-dönüşüm kararı.

- [ ] Cloudflare Images maliyet araştırması
- [ ] Mimari karar: IMAGES binding vs Sharp ile build-time WebP üretimi
- [ ] `astro:assets`'e geçiş

---

## 🟢 P3 — Düşük öncelik

### 6. Ana sayfa DOM'u ağır

| Sayfa | Ham | Gzip | Açılış etiketi |
|---|---|---|---|
| `/` | 288 KB | 60.0 KB | **1.672** |
| Blog yazısı (ort.) | 171 KB | ~46 KB | ~1.059 |

Önceki tura göre pratikte değişmedi (1.689 → 1.672). Chrome'un uyarı eşiği ~1.500.

`6f3ab7d`'de yeniden araştırılmış ve **aynı sonuca varılmış**: MegaMenu'nün 4 paneli
(364 element, sayfanın %21.8'i) DOM'da sürekli duruyor; `hasOpened` lazy-mount denendi
ama panel içeriği SSR HTML'inden tamamen kaybolduğu için (crawl edilebilir `<a href>`
kaybı) geri alındı. `client:visible`/`client:idle` de DOM'u değiştirmiyor — kanıtlandı.

**Sonuç:** güvenli bir teknik optimizasyon kalmadı; DOM'u küçültmek ancak menüdeki
link/kolon **sayısını** azaltmakla olur — bu bir IA/tasarım kararı.

- [ ] Karar: mega-menü içeriği sadeleştirilsin mi? (tasarım tarafı)

---

### 8. 🆕 Decap artıkları — ölü bağımlılık

Decap CMS kaldırıldı (`db38013`, `public/admin/` silindi, unpkg referansı kalmadı)
ama `package.json`'da izleri duruyor:

```json
"scripts":        { "cms:proxy": "decap-server" },
"devDependencies": { "decap-server": "^3.10.0" }
```

- [ ] İkisini de kaldır, `npm install` ile lockfile'ı güncelle

---

### 9. 🆕 CSP `img-src`'te gereksiz `idenfit.com` izni

`src/middleware.ts` + `public/_headers`:

```
img-src 'self' data: https://img.youtube.com https://idenfit.com
```

`https://idenfit.com` izni, blog görselleri hotlink'liyken gerekliydi. Açık nokta #14
kapandığı için (978/978 görsel yerelde, tüm URL'ler göreli) bu izin artık gereksiz —
politikayı gereksiz yere gevşetiyor.

- [ ] Her iki dosyadan kaldır (senkron tutulmalı)
- [ ] Kaldırmadan önce doğrula: `dist/client` genelinde kalan uzak referans var mı?
      (`scripts/audit-remote-hotlinks.mjs` — Açık nokta #45 sitenin geri kalanında
      hâlâ hotlink olduğunu söylüyor; **önce #45 kapanmalı**, sonra bu izin kaldırılmalı)

---

### 10. ℹ️ Build süresi 46s → 150s (bilgi)

`output:'server'` + 622 Markdown + Cloudflare adapter derlemesi. Kabul edilebilir,
aksiyon gerekmiyor — ama CLAUDE.md Açık nokta #49'daki eşik takibi artık daha erken
anlamlı hale geldi (2 dk eşiği fiilen aşıldı).

Bilgi olarak diğer ölçümler: `dist/` 392 MB (390 MB client — 1013 yerel görsel dahil,
1.8 MB server worker). JS toplamı 3.580 KB görünüyor ama **2.712 KB'ı
`keystatic-page.js`** ve yalnızca `/keystatic`'te yükleniyor — ana sayfanın
referansladığı JS 0.1 KB, genel sayfalar etkilenmedi.

---

## ✅ Bu turda kapanan maddeler

Doğrulandı, tekrar araştırılmasın:

| Eski # | Konu | Kanıt |
|---|---|---|
| 1 | `astro build` kırıktı | `npx astro build` → **exit 0**, 150s · `astro check` 394 dosya **0 hata** |
| 2 | 973 blog görseli eski WP'ye bağlıydı | **978/978** referans yerelde · `idenfit.com` hotlink **0** · `public/wp-content` 1013 dosya |
| 3 | Decap yanlış depoyu gösteriyordu | Decap kaldırıldı, Keystatic Cloud'a geçildi |
| 4 | CMS OAuth proxy'si yoktu | Keystatic Cloud üstleniyor — kendi proxy'nize gerek kalmadı |
| 7 | 618 yazı `posts.json`'da sıkışmıştı | **622 `.md`** · `posts.json` 3 byte (boş dizi) |
| 8 | Decap unpkg'den kayan sürümle yükleniyordu | `public/admin/` silindi, unpkg referansı yok |
| 9 | Güvenlik başlığı yoktu | `_headers` + `middleware.ts` — X-Frame/nosniff/Referrer/HSTS doğrulandı |
| 11 | Google Fonts hotlink (KVKK/GDPR) | Quicksand `public/fonts/` altında self-host |
| 14 | `getAllBlogPosts()` memoize değildi | `88b0f6d` — modül seviyesi promise cache |
| 15 | README / package.json / repo şişkinliği | `name: idenfit-com`, README güncel, `media.json` git'ten çıktı |
| 16 | CI'da `pipefail` yoktu | `7c3f321` — denetlendi, `check-*.mjs` exit-code bulgusu da kaydedildi |

**Ek olarak bu turda kapanan (rapor dışı):** blog `<title>` uzunluğu 409 → **0** sorunlu
sayfa · `check-html-lang-attribute.mjs`'in `dist/client` false-positive'i (196 sahte hata)
düzeltildi.

---

## Doğrulama komutları

```bash
npm ci
npx astro check                              # 394 dosya, 0 hata bekleniyor
set -o pipefail; npx astro build             # exit 0 olmalı — pipefail ŞART
node scripts/check-json-ld.mjs               # 0 geçersiz
node scripts/check-link-accessibility.mjs    # 0
node scripts/check-image-alt-text.mjs        # 0
node scripts/check-title-length.mjs          # 0
node scripts/check-meta-description-length.mjs  # 0
node scripts/check-html-lang-attribute.mjs   # 0
node scripts/check-heading-hierarchy.mjs     # 5 (bilinen taban çizgisi)
node scripts/check-hreflang.mjs              # madde 1 sonrası anlamlı
npm audit                                    # 0 açık
```

**Bilinen temel çizgi (regresyon değil):** `check-heading-hierarchy` → ana sayfanın
5 dilinde H1→H3 atlaması (Açık nokta #36). Bu script **exit 1** döndürür — ileride CI
gate'i kurulursa ya #36 kapatılmalı ya da gate bu istisnayı hesaba katmalı.

---

## Önerilen sıra

```
1  → site + sitemap + robots        (madde 1)  ─┐
     └ önce check-hreflang'in dist/client fix'i │ cutover
2  → form backend + PII temizliği   (madde 2,3) ┘ öncesi
3  → prerender guard script'i       (madde 7)
4  → Decap artıkları                (madde 8)   ← 5 dakika, hemen
5  → Açık nokta #45 (kalan hotlink'ler)
6  → CSP img-src daraltma           (madde 9)   ← #45'ten SONRA
7  → görsel optimizasyonu           (madde 5)
8  → CSP enforcing                  (madde 4)   ← site canlı olduktan sonra
9  → DOM / mega-menü kararı         (madde 6)
```

---

## Kapsam dışı — bilinçli kararlar

İncelendi, **sorun değil**:

- `target="_blank"` — 300 dosya / 278 link tarandı, **`rel` eksiği yok**
- `npm audit` → **0 açık**. Kaynakta secret/API anahtarı yok
- **203/203 sayfa** `prerender = true` taşıyor — kazara SSR route yok (bkz. madde 7,
  bu bir gelecek riski, mevcut hata değil)
- Blog gövdesindeki ham WP HTML `set:html` ile basılıyor ama build-time'da sabitlenen,
  kendi kontrolünüzdeki içerik — ziyaretçi girdisi değil, XSS vektörü yok
- Keystatic'in 2.7 MB'lık admin bundle'ı yalnızca `/keystatic`'te yükleniyor —
  genel sayfa performansını etkilemiyor
- ~2.163 i18n fallback redirect stub'ının `noindex` olması ve `<html lang>` taşımaması
  Astro'nun kendi framework şablonu (Açık nokta #27)
