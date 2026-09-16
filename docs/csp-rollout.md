# CSP: Report-Only → Enforcing geçiş planı

**Durum (2026-09-14): hâlâ Report-Only. Hiçbir şey engellenmiyor.**
Geçiş kararının verilebilmesi için gereken ölçüm altyapısı bu turda kuruldu;
karar hâlâ verilmedi ve aşağıdaki go/no-go listesi geçilmeden verilmemeli.

## Neden henüz enforcing değil

CLAUDE.md Açık nokta #46 üç koşul koymuştu. 2026-09-14 itibarıyla:

| Koşul | Durum |
|---|---|
| 1. Site gerçekten canlı olmalı | ✅ sağlandı |
| 2. Otomatik ihlal raporu toplama kurulmalı | ✅ **bu turda kuruldu** (önceden politikada `report-uri` HİÇ YOKTU) |
| 3. 1-2 hafta sessiz gözlem | ❌ **fiilen hiç başlamadı** — takvimde 2 hafta geçti ama rapor toplanmadığı için sıfır veri var |

Koşul 2'nin eksikliği koşul 3'ü de geçersiz kılıyordu: Report-Only
2026-08-31'den beri açıktı ama ihlaller yalnızca tek tek ziyaretçilerin
DevTools Console'unda görünüyordu, kimse bakmıyordu. **Gözlem penceresi bu
PR canlıya çıktığı gün başlar.**

### Bu turdan sonra eklenen dördüncü koşul: GTM

#46 yazıldığında GTM canlı değildi. Artık pazarlama **koda dokunmadan**
herhangi bir host'tan etiket ekleyebiliyor (Meta pixel → `connect.facebook.net`,
LinkedIn Insight → `snap.licdn.com`, Ads dönüşüm → `googleads.g.doubleclick.net`,
Hotjar…). Enforcing CSP altında bunların **hepsi sessizce engellenir** ve
pazarlama tarafındaki belirti yalnızca "etiket çalışmıyor" olur — sebebi
görünmez. Bu yüzden ADIM 4 (envanter) enforcing'in ön koşuludur.

---

## Bu turda yapılanlar

1. **Tek kaynak.** Politika artık yalnızca `src/data/csp.ts`'te yazılı.
   `public/_headers` bundan **üretiliyor** (`node scripts/check-csp-sync.mjs --fix`),
   `src/middleware.ts` doğrudan **import ediyor**. Sapmayı
   `node scripts/check-csp-sync.mjs` yakalıyor (exit 1).
2. **Rapor toplama.** `src/pages/api/csp-report.ts` + politikada
   `report-uri` **ve** `report-to` + `Reporting-Endpoints` başlığı.
   `wrangler.json`'da `observability` açıldı.
3. **Somut boşluklar kapatıldı** — enforcing'e bugün geçilse kırılacak
   olanlar (taramayla bulundu, canlıda doğrulandı):
   - `frame-src` ← `https://docs.google.com`
     (`blog/zirve-katilim-ix-kurumsal-egitim-ve-gelisim-zirvesi` içindeki
     çalışan Google Forms embed'i)
   - `img-src` ← `https://lh3.googleusercontent.com` (bkz. TODO-1)
   - `connect-src` ← `https://www.google.com/recaptcha/` (reCAPTCHA v3 canlı;
     izin verilmezse token üretimi başarısız olur ve `api/lead.ts` gönderimi
     reddeder → 6 form birden çalışmaz)
   - `frame-src` ← `https://www.googletagmanager.com` (GTM Preview / Tag Assistant)
4. **`script-src`'te `'unsafe-inline'` kaldırıldı**, yerine build sonrası
   üretilen SHA256 hash listesi geldi
   (`scripts/generate-csp-headers.mjs`, `npm run build` zincirinde).
   Report-Only olduğu için bu değişikliğin **riski şu an sıfır** — işe
   yaramazsa raporlarda görünür.

### `style-src 'unsafe-inline'` neden kaldırılmadı

Kaldırılamaz. React island'ları (ProductPreviewWidget'ın ölçekleme
transform'u, PricingPage karşılaştırma tablosu, MarqueeBar) değeri çalışma
zamanında hesaplanan `style="..."` **öznitelikleri** yazıyor. CSP hash'leri
yalnızca `<style>` bloklarını kapsar; style öznitelikleri için
`'unsafe-hashes'` + her tekil değerin hash'i gerekir ki dinamik değerlerde
bu imkânsız.

### Enforcing'in gerçekte ne kazandıracağı — dürüst sınır

`style-src`'te `'unsafe-inline'` kaldığı ve `script-src`'te nonce
kullanılmadığı için enforcing **klasik XSS korumasının tamamını vermez**.
Gerçek kazanç daha dar ama gerçek: dış host'tan `<script src>` enjeksiyonunu
engeller, `connect-src` ile veri sızdırmayı sınırlar, `object-src 'none'` /
`base-uri 'self'` / `form-action 'self'` / `frame-ancestors 'self'` fiilen
devreye girer.

---

## Raporları okuma

```bash
npx wrangler tail --format pretty | grep csp-violation
```
Panelden geçmişe dönük: **Workers & Pages → idenfit-com → Logs**.

Log satırları iki biçimde:
```
[csp-violation] YENİ   directive=… blocked=… page=… disposition=report
[csp-violation] TEKRAR ×N directive=… blocked=… page=…
```
Aynı ihlal sınıfı isolate başına bir kez loglanıp tekrarları sayılıyor —
hacim kontrolü için (detay: `src/pages/api/csp-report.ts`).

> **Endpoint halka açık ve kimliksiz** (tarayıcı CSP raporlarını kimliksiz
> gönderir, doğrulanamaz) — yani herkes sahte rapor POST edebilir. Loglanan
> veri yalnızca insan incelemesi için bir sinyaldir; hiçbir otomatik karar
> buna dayanmamalı.

---

## Açık işler

### TODO-1 — `lh3.googleusercontent.com` görselini yerelleştir

`src/content/blog/surdurulebilir-kalkinma-kapsaminda-yesil-yonetim.md:47`
"Şekil 1: Sürdürülebilir Kalkınma Bileşenleri" görseli Google barındırmalı
bir URL'den geliyor. Bu tur içinde **indirilemedi** — geliştirme ortamının
ağ politikası `lh3.googleusercontent.com`'a çıkışı reddediyor (403), dosyanın
hâlâ 200 döndüğü bile doğrulanamadı. Google'ın bu URL'leri kalıcı değil.

Yapılacak: dosyayı indir → `public/wp-content/uploads/…` altına koy →
markdown'daki URL'i göreliye çevir → `src/data/csp.ts`'teki `img-src`
izninden `https://lh3.googleusercontent.com`'u **kaldır** →
`node scripts/check-csp-sync.mjs --fix`.

### ADIM 4 — GTM etiket envanteri (pazarlamadan)

Enforcing'den önce pazarlamadan şunlar istenmeli:

- GTM konteynerinde (`GTM-W5VTWD2`) **yayında olan tüm etiketlerin listesi**
  ve her birinin çağırdığı **host adları**.
- Yeni bir etiket eklendiğinde haber verilmesi — CSP allowlist'i kod
  değişikliği gerektiriyor.
- Doğrulama: GTM'de **`G-ED2NJPGPD3` ile ikinci bir GA4 Configuration
  etiketi OLMAMALI** (GA4 zaten `Analytics.astro`'da doğrudan yükleniyor;
  ikisi birden olursa her sayfa görüntüleme iki kez sayılır).
- Google dışı her etikette "Require additional consent for tag to fire"
  işaretli olmalı (Consent Mode yalnızca Google etiketlerini otomatik bağlar).

Envanter geldikçe host'lar `src/data/csp.ts`'e eklenir. **Tahminle önden
allowlist yazılmadı** — GA4'ün Signals/Ads uçları (`stats.g.doubleclick.net`,
`google.com/ads/ga-audiences`) dahil hiçbir reklam host'u eklenmedi;
gerçekten kullanılıyorlarsa Report-Only raporlarında görünecekler.

### ADIM 5 — Enforcing'e geçiş

**Go/no-go — hepsi ✅ olmadan geçilmez:**

- [ ] En az **2 hafta** gerçek trafikle rapor toplandı.
- [ ] Son 1 haftada **beklenmedik** ihlal raporu gelmedi (yeni bir ihlal
      sınıfı çıkarsa allowlist güncellenir ve süre **sıfırdan** başlar).
- [ ] `script-src` hash yaklaşımı doğrulandı — raporlarda JSON-LD veya
      Astro hydration script'i kaynaklı `script-src` ihlali **yok**.
      (Varsa: `src/data/csp.ts`'te `INLINE_SCRIPT_TOKEN`'ı
      `'unsafe-inline'` olarak bırakıp `scripts/generate-csp-headers.mjs`
      çağrısını `package.json`'daki `build`'den çıkarmak yeterli.)
- [ ] ADIM 4 envanteri alındı, GTM host'ları allowlist'te.
- [ ] TODO-1 kapandı.
- [ ] 6 formun tamamı canlıda test edildi (reCAPTCHA token'ı üretiliyor).

**Geçiş:**
1. `src/data/csp.ts` → `CSP_MODE = 'enforce'`
2. `node scripts/check-csp-sync.mjs --fix`
3. PR → merge → Workers Builds otomatik deploy eder.

**Geri dönüş anlık DEĞİL.** `_headers` deploy'a bağlı ve yanıtlar
Cloudflare'da cache'leniyor (`cf-cache-status: HIT`) — geri almak yeni bir
deploy gerektirir (birkaç dakika). Bu yüzden geçiş **düşük trafikli bir
saatte** yapılmalı ve sonrasında en az 30 dakika canlı izlenmeli.

> Anlık geri dönüş için CSP başlığı Cloudflare **Response Header Transform
> Rule** ile panelden de verilebilir — ama bu, kaynağı üçüncü bir yere
> böler ve `check-csp-sync.mjs`'in denetimi dışına çıkar. **Önerilmiyor.**
