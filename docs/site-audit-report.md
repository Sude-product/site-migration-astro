# Site Denetim Raporu — Blog Migrasyonu Öncesi Genel Kontrol

**Tarih:** 2026-07-22
**Kapsam:** 184 gerçek sayfa + 36 NL-fallback redirect stub (220 URL, 4 dil) — `astro build` çıktısı + dev server üzerinden sistematik tarama.
**Yöntem:** Bu turda yazılan 6 yeniden-kullanılabilir denetim script'i (`scripts/audit-*.mjs`) + gerçek HTTP istekleriyle (idenfit.com'un canlı WP medya sunucusu dahil) doğrulama. **Hiçbir düzeltme yapılmadı** — bu rapor yalnızca bulguları listeler, önceliklendirme kullanıcıya bırakılmıştır.

Kullanılan script'ler (tekrar çalıştırılabilir): `audit-site.mjs` (crawl + ara veri), `audit-analyze.mjs` (title/description/kırık link), `audit-lang-consistency.mjs` (dil değiştirici tutarlılığı), `audit-entities.mjs` (HTML entity), `audit-images.mjs` (kırık görsel), `audit-http-status.mjs` (220 URL için gerçek HTTP durumu).

---

## Özet tablo

| Bulgu | Ciddiyet | Etki alanı |
|---|---|---|
| 1. Fiyatlar sayfası: Mikro/KOBİ CTA'ları kırık | 🔴 Kritik | 4 dil × Fiyatlar sayfası (satın alma/kayıt akışı) |
| 2. Footer ÜRÜNLER kolonu: 7/8 link kırık | 🔴 Kritik | Her EN/NL/IT sayfası (footer her yerde) |
| 3. Mobil menü: ana kategoriler kırık sayfaya gidiyor | 🔴 Kritik | Her sayfa, mobil görünüm, 4 dil |
| 4. Ana sayfa Suprema linki kırık (EN/NL/IT) | 🟠 Yüksek | Ana sayfa × 3 dil |
| 5. Ana sayfa Video "Daha Fazla" linki kırık (EN/NL/IT) | 🟠 Yüksek | Ana sayfa × 3 dil |
| 6. 2 İK Hub sayfası: dil değiştirici NL'de tutarsız + kırık | 🟠 Yüksek | 2 sayfa × dil değiştirici |
| 7. Şirket Takvimi + Sağlık IT görselleri kırık (bizim hatamız) | 🟠 Yüksek | 2 sayfa (IT) |
| 8. Özlük Dosyası TR+IT görselleri kaynakta kırık | 🟠 Yüksek | 2 sayfa (TR, IT) |
| 9. 2 sektör sayfası: IT başlığı "Contenuti della Pagina" | 🟠 Yüksek | 2 sayfa (IT) |
| 10. Güvenlik sayfası meta description çok kısa | 🟡 Orta | 3 dil |
| 11. Turizm sektörü IT H1'i İngilizce ("Tourism") | 🟡 Orta | 1 sayfa (IT) — bilinen, önceden kullanıcı kararı |
| 12. "Security" başlığı iki farklı sayfada aynı | 🟡 Orta | 2 sayfa (EN) |
| 13. React hydration konsol uyarıları | ⚪ Bilgi | Site geneli — kod hatası değil |
| 14. Bilinen/dokümante içerik boşlukları | ⚪ Bilgi | blog, hesaplama-araçları, vb. |

**Temiz çıkan kontroller:** 220/220 URL doğru HTTP durumu (200 veya 301/302), 0 kırık redirect hedefi, 265/274 görsel çalışıyor, 0 site-dışı (idenfit.com) yanlış link, 0 çift-kaçışlı HTML entity (FAQ düzeltmesi kalıcı + başka sayfada tekrarı yok), 4 ana regresyon script'i (108/108, 56/56, 36/36, 9/9, 12/12) hâlâ geçiyor.

---

## 🔴 KRİTİK

### 1. Fiyatlar sayfası — Mikro ve KOBİ planlarının CTA butonları kırık (4 dilde)

**Sayfa:** `/fiyatlar/`, `/en/pricing/`, `/nl/prijzen/`, `/it/prezzi/`

**Bulgu:** "Hemen Başla" (Mikro) ve "Satın Al" (KOBİ) butonlarının `href`'i `/register/micro/` ve `/register/sme/` — **site içi, var olmayan relative path'ler**. Olması gereken: `https://app.idenfit.com/register/micro/?lang=tr` (gerçek, dış kayıt sayfası, dile göre `?lang=` parametresi).

**Kök neden:** `src/data/pricingContent.ts`'in `resolvePlan()` fonksiyonu `localizeCtaUrl()`'ü **her 3 plana da** (Mikro/KOBİ/Pro) körü körüne uyguluyor. `localizeCtaUrl()` yalnızca `idenfit.com` uzantılı URL'leri kendi site içi slug'larımıza çevirmek için tasarlandı — ama Mikro/KOBİ'nin gerçek CTA hedefi **farklı bir domain** (`app.idenfit.com`). Fonksiyon bu domaini tanımadığı için URL'in path kısmını (`register/micro`) sanki bizim bir sayfa slug'ımızmış gibi işleyip `getRelativeLocaleUrl()`'e veriyor — sonuç, domain VE `?lang=` query param'ı tamamen kaybolmuş kırık bir link. Yalnızca **Pro** planının CTA'sı (`online-sunum-talep-et` → bizim gerçek sayfamız) bu dönüşümü DOĞRU şekilde gerektiriyor.

**Önerilen düzeltme yönü:** `hubContent.ts`'teki `resolveTileCta()`'nın zaten kullandığı desen (hostname `idenfit.com` ile bitmiyorsa URL'i OLDUĞU GİBİ bırak) burada da uygulanmalı — yalnızca `pro.ctaUrl`'e `localizeCtaUrl()` uygulanmalı, `micro`/`sme`'ye değil.

---

### 2. Footer ÜRÜNLER kolonu — 8 linkten 7'si EN/NL/IT'de kırık

**Etki alanı:** Footer her sayfada göründüğü için bu, **EN/NL/IT'deki HER SAYFAYI** etkiliyor (48 EN + 40 NL + 48 IT sayfa).

**Bulgu:** Footer'ın "ÜRÜNLER" kolonundaki 8 linkin (Özlük Dosyası, İşe Alım, Performans, Eğitim, Puantaj, İzin Yönetimi, Donanım, PDKS) **7'si** EN/NL/IT'de 404 veriyor. Örnek: `/en/calisan-ozluk-yonetimi-modulu/` (404) — olması gereken `/en/employee-file-module/`. Yalnızca TR'de doğru çalışıyor (TR'nin bare slug'ı zaten bizim iç referans anahtarımızla aynı olduğu için).

**Kök neden:** `src/components/Footer.astro`'nun PRODUCT kolonu render bloğu hâlâ eski, generic `l(item.slug)` kullanıyor:
```astro
{FOOTER_PRODUCT_LINKS.map((item) => (
  <a href={l(item.slug)}>...
```
Bu, `ABOUT`/`GENEL` kolonlarının (bu proje boyunca birkaç turda) aldığı `SPECIAL_HREFS` per-locale çözümleme düzeltmesini **hiç almadı** — muhtemelen dikkat "misc pages" (KVKK/İletişim/vb.) sayfalarına kaydığı için bu kolon gözden kaçtı. Oysa bu 8 ürünün gerçek per-locale slug'ları `productContent.ts`'in `getProductSlug()`/`SLUG_INDEX`'inde ZATEN mevcut ve doğru (mega-menünün ÜRÜNLER linkleri bunu doğru kullanıyor — `navigation.ts`'teki `productHref()` — yalnızca footer bu fonksiyonu kullanmıyor).

**Önerilen düzeltme yönü:** Footer'ın PRODUCT kolonu da `getProductSlug(item.slug, locale)` (veya `donanim`/`pdks-modulu` gibi özel isimlendirilenler için `getHardwareSlug`) üzerinden çözülmeli — `navigation.ts`'teki `productHref()` deseni buraya da taşınabilir.

---

### 3. Mobil menü — ÜRÜNLER/SEKTÖRLER/KURUMSAL/KEŞFET kırık sayfaya gidiyor

**Etki alanı:** Her sayfa, her locale, yalnızca **mobil görünümde** (hamburger menü).

**Bulgu:** `MobileMenu.tsx` masaüstündeki gibi bir mega-menü/alt-kategori göstermiyor — `NAV_ITEMS`'ın HER birini (mega-menüsü olanlar dahil) düz bir `<a href>` olarak render ediyor. Masaüstünde "ÜRÜNLER"/"SEKTÖRLER"/"KURUMSAL"/"KEŞFET" bir `<button>` (mega-menü tetikleyici, hiç navigate etmiyor) iken, **mobilde bu 4 öğe gerçek link oluyor ve** `/urunler/`, `/sektorler/`, `/kurumsal/`, `/kesfet/` **sayfalarına gidiyor — bunların HİÇBİRİ var değil (4'ü de 404)**.

**Kök neden:** `Header.astro`, `MobileMenu`'ye yalnızca düz `{slug, label, href}` listesi geçiyor — mega-menü içeriğini (kolonlar/alt-linkler) MobileMenu'ye hiç aktarmıyor, bu yüzden mobilde bu 4 kategori için gösterilecek bir alt-menü yapısı yok, yalnızca kırık bir bare-slug href kalıyor.

**Not:** Bu, migrasyon sırasında girmiş yeni bir regresyon değil — muhtemelen mobil menü ilk kurulduğundan beri böyle (mega-menü içeriği o zaman henüz yoktu). Ama bugün itibariyle **mobilde ürün/sektör/kurumsal/keşfet kategorilerine dokunan bir ziyaretçi 404 ile karşılaşıyor** — sitenin en temel gezinme yollarından biri mobilde çalışmıyor demek. Düzeltmesi (mobilde de bir akordeon/alt-liste göstermek) bu turun basit bir "link düzeltmesi"nden daha büyük bir iş (component yeniden tasarımı) — bu yüzden ayrı değerlendirilmesi gerekebilir.

---

## 🟠 YÜKSEK

### 4. Ana sayfa — Suprema partner bölümünün linki EN/NL/IT'de kırık

**Sayfa:** `/en/`, `/nl/`, `/it/` (ana sayfa, "Temassız Tanımlama" / Suprema bölümü)

**Bulgu:** `SupremaSection.astro`, linki `getRelativeLocaleUrl(locale, 'donanim')` ile hesaplıyor — TR'de doğru (`/donanim/`) ama EN/NL/IT'nin gerçek slug'ı `hardware` (`/en/hardware/` vb.). `/en/donanim/`, `/nl/donanim/`, `/it/donanim/` üçü de 404.

**Kök neden:** `hardwareContent.ts`'te zaten `getHardwareSlug(locale)` var ve doğru çalışıyor (Donanım sayfasının kendisi + mega-menü bunu kullanıyor) — ama `SupremaSection.astro` bu fonksiyonu çağırmak yerine bare slug'ı hardcode etmiş.

---

### 5. Ana sayfa — Video bölümünün "Daha Fazla" linki EN/NL/IT'de kırık

**Sayfa:** `/en/`, `/nl/`, `/it/` (ana sayfa, "Neden idenfit?" video bölümü)

**Bulgu:** `VideoSection.astro`, `getRelativeLocaleUrl(locale, 'neden-idenfit')` kullanıyor — gerçek EN/NL/IT slug'ları sırasıyla `why-idenfit`/`waroom-idenfit`/`perche-idenfit`. Bu kod, Neden İdenfit sayfası henüz kurulmadan önce yazılmış (o zamanlar zaten 404 veriyordu, "bilinen durum" diye not edilmişti) — sayfa sonradan kuruldu ama bu link hiç güncellenmedi.

**Kök neden:** `miscPagesContent.ts`'te zaten `getWhyIdenfitSlug(locale)` var — `VideoSection.astro` bunu kullanmıyor.

---

### 6. İki İK Hub sayfası — dil değiştirici NL'de tutarsız (KVKK'daki AYNI hata sınıfı)

**Sayfalar:** `insan-kaynaklari-yonetimi-modulu` ve `insan-kaynaklari-isgucu-yonetimi` (TR/EN/IT var, NL kaynakta yok)

**Bulgu:** Bu iki sayfanın dil değiştiricisindeki "NL" hedefi, **hangi sayfadan (TR/EN/IT) tıklandığına göre FARKLI VE HER ÜÇÜ DE KIRIK**:
- TR'den: `/nl/insan-kaynaklari-yonetimi-modulu/` (yok)
- EN'den: `/nl/human-resources-management-modules/` (yok)
- IT'den: `/nl/moduli-gestione-risorse-umane/` (yok)

**Kök neden:** Bu, geçen turda KVKK/Tüketici Hakları/Mesafeli Satış/Güvenlik'te bulunup `miscPagesContent.ts`'in `localeUrlsFor()`'unda düzeltilen **AYNI hata sınıfı** — ama hub sayfaları o düzeltmeyi kullanmıyor, kendi ayrı `hubContent.ts`'indeki `getHubLocaleUrls()` fonksiyonuna sahip. O fonksiyon `SLUG_INDEX[trSlug]`'ın yalnızca var olan locale'leri (`tr`/`en`/`it`) döndürüyor, `nl` hiç set edilmiyor — Header'ın generic (path-bağımlı, yanlış) hesaplaması sızıyor. Kullanıcının "başka sayfalarda da tekrarlanmış olabilir" hipotezi **doğrulandı** — tüm site tarandı, yalnızca bu 2 sayfa etkileniyor (KVKK ailesi zaten düzeltilmişti).

**Önerilen düzeltme yönü:** `getHubLocaleUrls()`'a `miscPagesContent.ts`'teki `localeUrlsFor()`'a eklenen aynı satır eklenmeli: `if (!result.nl && result.en) result.nl = result.en;`.

---

### 7. Şirket Takvimi + Sağlık modüllerinin IT çevirisi kırık görsel kullanıyor (bizim hatamız)

**Sayfalar:** `/it/modulo-calendario-aziendale/`, `/it/modulo-gestione-salute-dipendenti/`

**Bulgu:** Bu 2 modülün IT çeviri override'ları (`productTranslationOverrides.ts`, önceki bir KARAR 1 turunda yazıldı) görsel URL'i olarak Türkçe karakterli, **404 veren** dosya adlarını kullanıyor (`şirket-tak.webp`, `sağlik1@2x.png` vb.) — oysa bu modüllerin kendi ham IT/EN verisinde zaten ÇALIŞAN, ASCII isimli görseller var (`1@2x-3.png`, `1@2x.png` vb.). Override yazılırken görsel URL'i muhtemelen TR'den yanlışlıkla kopyalanmış.

**Kök neden:** İnsan hatası (override yazımı sırasında). Kolay düzeltilir — override'daki `image` alanları IT'nin kendi ham verisindeki (veya EN'in, ikisi identik) çalışan URL'lerle değiştirilmeli.

---

### 8. Özlük Dosyası modülünün TR+IT görselleri kaynakta zaten kırık

**Sayfalar:** `/calisan-ozluk-yonetimi-modulu/` (TR), `/it/modulo-fascicolo-personale/` (IT)

**Bulgu:** 4 görsel (`özlükdos1-4@2x.png`) canlı idenfit.com'un WP medya sunucusunda **404** veriyor. Bu görseller TR VE IT'nin HAM (override edilmemiş) kaynak verisinde zaten bu şekilde kayıtlı — **bizim hatamız değil**, WP kaynağının kendi veri bütünlüğü sorunu (muhtemelen bu dosyalar sunucudan silinmiş/taşınmış). EN ve NL aynı modülün **farklı, ÇALIŞAN** görsellerini (`1-4@2x.png`, 2025/09 klasörü) kullanıyor — muhtemelen bir noktada yeniden yüklenip EN/NL'ye bağlanmış ama TR/IT'ye hiç yansıtılmamış.

**Önerilen düzeltme yönü:** TR/IT'nin görsel URL'lerini EN/NL'nin kullandığı çalışan görsellerle değiştirmek (proje genelinde zaten kullanılan "çalışmayan görsel yerine kardeş dilin çalışan görselini kullan" deseniyle tutarlı).

---

### 9. İki sektör sayfasının IT başlığı gerçek içerik yerine "Contenuti della Pagina" placeholder'ı gösteriyor

**Sayfalar:** `/it/soluzioni-hr-settore-alimentare-bevande/` (Gıda), `/it/soluzioni-hr-settore-servizi/` (Hizmet)

**Bulgu:** Bu 2 sayfanın H1 başlığı (ve `<title>` etiketi) kelimesi kelimesine **"Contenuti della Pagina"** ("Sayfa İçeriği" — jenerik bir CMS placeholder metni) gösteriyor, gerçek sektör adı değil. Sayfanın GERİ KALAN tüm içeriği (hero açıklaması, "neden idenfit" bölümü) gerçek, kaliteli İtalyanca — yalnızca bu tek alan (ACF `section_1_title`) bu placeholder'ı taşıyor.

**Kök neden:** Kaynak WP verisinin kendi hatası (Turizm sektörünün IT başlığının boş olması gibi, aynı sınıf bir "yayına hazırlanırken unutulmuş alan" örneği) — muhtemelen canlı idenfit.com'da da aynı şekilde görünüyor. Bizim extraction/render pipeline'ımız kaynağı olduğu gibi yansıtıyor.

---

## 🟡 ORTA

### 10. Güvenlik sayfasının meta description'ı aşırı kısa

`/guvenlik/`, `/en/security-policy/`, `/it/politica-di-sicurezza/` — description sırasıyla yalnızca `"Güvenlik"`, `"Security"`, `"Sicurezza"` (tek kelime). Diğer tüm sayfalarda description en az bir cümle. `SecurityPage.astro`'nun `description={title}` satırından geliyor — başlık metnini description olarak kullanıyor, ayrı bir açıklama metni yok.

### 11. Turizm sektörünün IT H1'i İngilizce "Tourism" gösteriyor

`/it/soluzioni-hr-settore-turismo/` — bu **daha önce bilinen ve kullanıcı kararıyla bilinçli olarak dokunulmamış** bir durum (bkz. CLAUDE.md "Sektör sayfaları — GERÇEK İÇERİK UYGULANDI" bölümü, "IT Turizm başlık hatası — kullanıcı talimatına göre aynen bırakıldı"). Genel temizlik turunda yeniden gündeme getirmek isterseniz diye not edildi — madde 9'daki YENİ bulgularla (Gıda/Hizmet) aynı kök nedene sahip, üçü birlikte ele alınabilir.

### 12. "Security" başlığı iki farklı sayfada birebir aynı

`/en/security-policy/` ve `/en/security-sector-hr-solutions/` ikisi de `<title>idenfit — Security</title>` — biri Güvenlik POLİTİKASI sayfası, diğeri Güvenlik SEKTÖRÜ sayfası. Fonksiyonel bir hata değil (linkler doğru yerlere gidiyor) ama arama sonuçlarında/tarayıcı sekmelerinde ayırt edici değil.

---

## ⚪ BİLGİ (aksiyon gerektirmiyor)

### 13. React hydration konsol uyarıları

Dev server loglarında sürekli görülen `"A tree hydrated but some attributes... didn't match"` uyarıları (`fdprocessedid` attribute'u) — bu, bir **tarayıcı eklentisinin** (muhtemelen bir şifre yöneticisi, LastPass benzeri) form alanlarına DOM yüklenmeden önce müdahale etmesinden kaynaklanıyor. Kodumuzla ilgisi yok, gerçek bir fonksiyonel hataya yol açmıyor, yalnızca konsol gürültüsü. Bu oturumda yapılan temiz curl-tabanlı testlerde (tarayıcı eklentisi olmadan) bu uyarılar hiç oluşmadı — doğrulandı.

### 14. Bilinen, zaten dokümante edilmiş içerik boşlukları

Şu sayfalar header/footer/mega-menüde linkleniyor ama henüz migrate edilmedi — **bunlar bu turun bulgusu değil, CLAUDE.md'de zaten TODO olarak kayıtlı**:
- `/blog/` (+ `/en/blog/`, `/it/blog/`, `/nl/blog/`) — **blog migrasyonu zaten bir sonraki planlanan adım**.
- `/hesaplama-araclari/`, `/ik-dijital-olgunluk-testi/` — KEŞFET mega-menüsünden linkleniyor, henüz kurulmadı.
- `/sozlesme/gizlilik-ve-guvenlik-politikasi/` — footer alt barından ve Güvenlik sayfasından linkleniyor, sayfası henüz yok.

---

## Test edilen ve TEMİZ çıkan alanlar (referans için)

- **HTTP durumu:** 220/220 URL doğru kod (184 gerçek sayfa → 200, 36 redirect stub → 301/302).
- **Redirect hedefleri:** 36/36 NL-fallback redirect'i geçerli bir sayfaya gidiyor.
- **Görseller:** 274 benzersiz `<img>` src'sinin 265'i çalışıyor (9 kırık — madde 7+8'de detaylı).
- **Dış link sızıntısı:** 0 (bir önceki turda kurulan `test-no-external-idenfit-links.mjs` ile teyit edildi).
- **HTML entity (çift kaçış):** 0 — FAQ'daki düzeltme kalıcı, site genelinde başka bir sayfada tekrarı yok.
- **IT=EN kopya içerik:** Ham JSON'larda birçok alan hâlâ birebir eşleşiyor GÖRÜNSE de (`products.json`/`hubs.json`/`misc-pages.json`), bunların HEPSİ zaten bilinen ve override mekanizmasıyla düzeltilmiş alanlar — gerçek RENDER EDİLMİŞ HTML karşılaştırıldığında (6 örnek sayfa: 2 hub + İletişim + Neden İdenfit + Hakkımızda + Hedef Global Marka) hepsi gerçek, farklı İtalyanca içerik gösteriyor. Yeni/kaçırılmış bir IT=EN kopyası bulunamadı (madde 9'un placeholder'ı hariç, ki o farklı bir sınıf sorun).
- **Dil değiştirici tutarlılığı:** 184 sayfanın switcher'ı analiz edildi, yalnızca madde 6'daki 2 hub sayfası sorunlu çıktı — KVKK ailesi (bir önceki turda düzeltilen) dahil geri kalan HER sayfa tutarlı.
- **Regresyon script'leri:** `test-urunler-menu-links.mjs` 108/108, `test-product-language-switch.mjs` 56/56, `test-sector-language-switch.mjs` 36/36, `test-faq-language-switch.mjs` 9/9, `test-legal-nl-consistency.mjs` 12/12 — hepsi hâlâ geçiyor.
