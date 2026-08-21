# Sayfa Envanteri — WordPress → Astro Migration

Kaynak: `reference/wordpress-export/pages.json` (170 sayfa) ve `posts.json`
(618 yazı). Üretim script'i: `scripts/page-inventory.mjs` (çıktısı:
`scripts/_page-inventory-data.json`, ham veri — git'e commit edilmez,
yeniden üretilebilir).

Amaç: 170 sayfa + 618 yazıyı kategorilere ayırıp migration önceliklendirmesi
yapmak. Kategoriler slug/başlık bazında elle gözden geçirilerek oluşturuldu
(170 sayfanın tamamı tek tek okundu), otomatik anahtar kelime tahmini değil.

---

## 1. Sayfalar — özet tablo

| Kategori | Grup | Sayfa sayısı | Dil dağılımı |
|---|---|---|---|
| A · KRİTİK | Ana Sayfa | 4 | tr 1, en 1, it 1, nl 1 |
| A · KRİTİK | Hakkımızda / About | 4 | tr 1, en 1, it 1, nl 1 |
| A · KRİTİK | İletişim / Contact | 4 | tr 1, en 1, nl 1, it 1 |
| A · KRİTİK | Fiyatlar / Pricing | 4 | tr 1, en 1, nl 1, it 1 |
| A · KRİTİK | KVKK / Gizlilik / Sözleşmeler | 18 | tr 7, en 7, it 4, **nl 0** |
| A · KRİTİK | Online Sunum Talebi (ana CTA hedefi) | 3 | tr 1, en 1, it 1, **nl 0** |
| A · KRİTİK | Ürün / Modül sayfaları | 89 | nl 19, en 24, tr 24, it 22 |
| **A toplam** | | **126** | |
| B · ÖNEMLİ | Müşteriler / Customers | 4 | tr 1, en 1, nl 1, it 1 |
| B · ÖNEMLİ | Neden İdenfit / Why Idenfit | 4 | tr 1, en 1, it 1, nl 1 |
| B · ÖNEMLİ | Güvenlik / Security | 3 | tr 1, en 1, it 1, **nl 0** |
| B · ÖNEMLİ | Donanım / Hardware / Suprema | 7 | tr 2, en 2, nl 1, it 2 |
| B · ÖNEMLİ | Global Marka / Unicorn | 4 | en 1, tr 1, it 1, nl 1 |
| B · ÖNEMLİ | SSS / FAQ | 3 | tr 1, en 1, it 1, **nl 0** |
| B · ÖNEMLİ | Hesaplama Araçları + Dijital Olgunluk Testi | 3 | tr 3 (tek dil) |
| B · ÖNEMLİ | Blog (liste sayfası) | 1 | tr 1 |
| B · ÖNEMLİ | Teşekkürler sayfaları (form/demo akışı) | 5 | tr 2, it 1, en 2, **nl 0** |
| **B toplam** | | **34** | |
| C · İKİNCİL | Destek Talebi / Support Request | 3 | tr 1, en 1, it 1, **nl 0** |
| **C toplam** | | **3** | |
| D · DÜŞÜK/ATILABİLİR | Kampanya (geçmiş) | 1 | tr 1 |
| D · DÜŞÜK/ATILABİLİR | Test / taslak / WP varsayılan | 6 | en 2, tr 4 |
| **D toplam** | | **7** | |
| **GENEL TOPLAM** | | **170** | tr 55, en 48, it 40, nl 27 |

**Dikkat çeken örüntü:** neredeyse her B-kategorisinde (Güvenlik, SSS,
Teşekkürler, Destek Talebi) ve A-kategorisinde (KVKK/Gizlilik, Online Sunum
Talebi) **NL dilinde hiç sayfa yok**. Bu tesadüf değil — bkz. §3, madde 6.

---

## 2. Kategori detayları (ilk 10 sayfa)

### A) KRİTİK

**Ana Sayfa (4)**
| Dil | Path | Başlık | Kelime | Güncelleme |
|---|---|---|---|---|
| tr | `/` | Home | 497 | 2026-07-07 |
| en | `/en/` | Home – EN | 537 | 2026-06-12 |
| it | `/it/` | Home_IT | 671 | 2026-06-12 |
| nl | `/nl/` | Home NL | 615 | 2026-06-12 |

**Hakkımızda / About (4)** — `hakkimizda`, `about`, `chi-siamo`, `over` — hepsi 88-139 kelime, 2026-05-08'de güncellenmiş.

**İletişim / Contact (4)** — `iletisim`, `contact`, `contact-2`(⚠️ bkz §3.1), `contatti` — 2026-05-14'te güncellenmiş.

**Fiyatlar / Pricing (4)** — `fiyatlar`, `pricing`, `pricing-2`, `prezzi` — hepsi `pricing/template-pricing.php` şablonu, içerik ~9-10 kelime (gerçek fiyat tabloları ACF alanlarında/şablonda, `content.rendered`'da değil — CLAUDE.md'deki `mikro_*`/`sme_*`/`Pro_*` ACF grubuna bakılmalı).

**KVKK / Gizlilik / Sözleşmeler (18)** — en uzun/yoğun kategori (500-3000+ kelime arası hukuki metin). İlk 10:
1. tr `/kisisel-verilerin-korunmasi/` — Kişisel Veriler Kapsamında Aydınlatma Metni (2143 kelime, 2025-10-03)
2. tr `/sozlesme/gizlilik-ve-guvenlik-politikasi/` — Gizlilik ve Güvenlik Politikası (536, 2025-08-27)
3. en `/en/data-use-policy/` — Information Text Regarding Personal Data (2437, 2025-10-03)
4. en `/en/contract/privacy-and-security-policy/` — Privacy and Security Policy (682, 2026-02-06)
5. it `/it/protezione-dati-personali/` — Information Text Regarding Personal Data&IT (2608, 2026-02-10)
6. it `/it/contratto/politica-privacy-e-sicurezza/` — Privacy and Security Policy_IT (749, 2026-02-10)
7. tr `/kvk-protokol/` — KVK PROTOKOL (2488, 2025-11-05)
8. en `/en/kvk-protocol/` — KVK Protocol (3080, 2025-11-05)
9. tr `/sozlesme/mesafeli-satis-sozlesmesi/` — Mesafeli Satış Sözleşmesi (625, 2025-08-27)
10. tr `/mesafeli-satis-sozlesmesi-kobi/` — Mesafeli Satış Sözleşmesi Kobi (2150, 2025-11-05)

(+ kalan 8: mikro varyantı, tüketici hakları TR/EN/IT, distance sales contract EN/IT — bkz. ham veri.)

**Online Sunum Talebi — ana CTA hedefi (3)** — `online-sunum-talep-et` (tr, 89 kelime), `request-online-presentation` (en, "Get Started", 82), `richiedi-presentazione-online` (it, "Get Started_IT", 81). **NL karşılığı yok.**

**Ürün / Modül sayfaları (89)** — en büyük kategori, tüm envanterin yarısından fazlası. Payroll, PDKS, İzin, Performans, Onboarding/Offboarding, Doküman, Masraf, Demirbaş, Anket, Eğitim, Sağlık, Servis/Shuttle, Seyahat, Şirket Takvimi, Mesajlaşma, Notlar, İşe Alım, İK Yönetimi/İş Gücü Yönetimi gibi ~20 modülün 4 dildeki karşılıkları (nl 19, en 24, tr 24, it 22 — nl'de 5 modül eksik). İlk 10:
1. nl `/nl/documenten/` — Documents Module_NL (335, 2026-01-30)
2. nl `/nl/bedrijfskalender/` — Company Calendar_NL (151, 2026-01-23)
3. en `/en/corporate-calender-module/` — Company Calendar_EN (164, 2026-01-23)
4. tr `/anket-modulu/` — Anket Modülü (318, 2025-10-01)
5. tr `/bordo-onay-modulu/` — Bordro Modülü (216, 2025-09-09)
6. tr `/calisan-egitim-yonetimi-modulu/` — Eğitim Modülü (164, 2025-08-27)
7. tr `/calisan-ozluk-yonetimi-modulu/` — Employee Information Module_TR (349, 2026-05-08)
8. tr `/calisan-performans-degerlendirme-sistemi-modulu/` — Performans Yönetimi Modülü (837, 2025-11-11)
9. tr `/demirbas-yonetimi-modulu/` — Demirbaş Modülü (215, 2025-08-15)
10. tr `/dokuman-yonetim-sistemi-modulu/` — Documents Module_TR (271, 2026-05-08)

(Tam 89'luk liste `scripts/_page-inventory-data.json` → `CATEGORIES.A_modules` altında.)

### B) ÖNEMLİ

**Müşteriler / Customers (4)** — `musteriler`(tr,544), `customers`(en,642), `customers-2`→`/nl/klanten/`(nl,556), `clienti`(it,705). Not: CLAUDE.md'de bahsedilen `civil_*`/`yatsan_*`/`dog-ser_*`/`tugba_kuruyemis_*`/`femas_*` ACF referans blokları büyük ihtimalle bu sayfaların içinde gömülü — ayrı "müşteri hikayesi" sayfaları olarak **mevcut değil**.

**Neden İdenfit / Why Idenfit (4)** — `neden-idenfit`, `why-idenfit`, `perche-idenfit`, `waroom-idenfit` (NL) — 314-366 kelime.

**Güvenlik / Security (3)** — `guvenlik`(tr,39), `security-policy`(en,44), `politica-di-sicurezza`(it,51) — çok kısa, muhtemelen tek paragraf + rozet/logo görselleri. **NL yok.**

**Donanım / Hardware / Suprema (7)** — `donanim`/`hardware`×3 (340-470 kelime) + `suprema`/`suprema-tools`/`dispositivi-suprema` (3 sayfa, **0 kelime** — bkz §3.2). NL'de sadece hardware var, Suprema karşılığı yok.

**Global Marka / Unicorn (4)** — `global-brand`, `hedef-global-marka`, `marchio-globale`, `wereldwijd-merk` — 142-187 kelime.

**SSS / FAQ (3)** — `sss`(tr,3060), `faq`(en,3060), `faq`(it,3062) — kategorinin en uzun/en zengin sayfaları, muhtemelen accordion widget. **NL yok.**

**Hesaplama Araçları + Dijital Olgunluk Testi (3)** — sadece TR: `hesaplama-araclari`(354), `ik-dijital-olgunluk-testi`(250), `ik-dijital-olgunluk-testi-sonucu`(13 — sonuç şablonu, içerik dinamik). Mega-menü KEŞFET'ten linkleniyor, lead-gen aracı.

**Blog liste sayfası (1)** — `blog` (tr, 0 kelime — dinamik post listesi, statik içerik yok, beklenen durum).

**Teşekkürler sayfaları (5)** — `tesekkurler`(tr,110), `grazie`(it,154), `thanks`(en,141), `tesekkurler-destek`(tr,26), `thank-you`(en,33). Demo/destek formu akışının son adımı. **NL yok** — NL demo formu şu an teşekkür sayfası olmadan mı bitiyor, teyit gerekir.

### C) İKİNCİL

**Destek Talebi / Support Request (3)** — `destek-talebi`(tr,73), `support-request`(en,82), `richiesta-supporto`(it,93), 2026-05-14 güncel. **NL yok.**

### D) DÜŞÜK ÖNCELİK / ATILABİLİR

**Kampanya (1)** — `kampanya` — "Aralık Kampanyası" (135 kelime, 2025-12-10). Zamana bağlı, geçmiş bir ay için hazırlanmış promosyon.

**Test / taslak / WP varsayılan (6)** — `form-test`(en,4 kelime), `sample-page`(tr, WP varsayılan "Sample Page", 157 kelime — hiç düzenlenmemiş görünüyor), `test-tr`(tr,34), `slider-form`+`slider-form-en`(tr/en, 40/45 kelime — form builder'ın kendi test çıktısı olabilir), `ik-dijital-test`(tr,86 — bkz §3.3).

---

## 3. Şüpheli / dikkat gerektiren sayfalar

1. **`contact-2` (NL) gerçekte iletişim sayfası DEĞİL.** Slug "contact-2" olsa
   da gerçek path `/nl/mededelingen/` ("duyurular") ve başlık "mededeling"
   ("duyuru"). Yani **NL dilinde gerçek bir İletişim sayfası export'ta yok**
   — bu KRİTİK kategoride gerçek bir içerik boşluğu, migration'da atlanacak
   bir "yedek" değil, yeni yazılması gereken bir sayfa.

2. **Suprema sayfaları (`suprema-2`, `suprema-tools`, `dispositivi-suprema`)
   `content.rendered` içinde 0 kelime.** Bu 3 sayfa özel PHP şablonu kullanıyor
   (`suprema/suprema.php`, `suprema-it/suprema.php`) — içerik muhtemelen
   şablon kodunun kendisinde, REST export'a düşmemiş. İçeriği kurtarmak için
   **`themes.zip` açılıp şablon dosyasına bakılması gerekiyor** (CLAUDE.md'de
   "AÇILMADI" olarak not edilmişti). Ayrıca NL'de Suprema karşılığı hiç yok.

3. **`ik-dijital-test` muhtemelen terk edilmiş bir taslak.** `ik-dijital-olgunluk-testi`
   ile aynı gün (2026-04-13) güncellenmiş ama sadece 86 kelime, başka dilde
   karşılığı yok, ve gerçek akıştaki (`ik-dijital-olgunluk-testi` →
   `-sonucu`) isimlendirme desenine uymuyor. Migration öncesi kaynak sitede
   canlı linki olup olmadığı teyit edilmeli; muhtemelen atlanabilir.

4. **`contratto-contratto-di-vendita-a-distanza` (IT) slug'ında kelime
   tekrarı var** ("contratto-contratto") — WP'nin otomatik slug üretiminden
   kaynaklanan kozmetik bir hata, içerik sorunu değil. Migration'da temiz
   slug'a (`contratto-vendita-a-distanza` gibi) normalize edilmesi önerilir.

5. **`fiyatlar`/`pricing`/`pricing-2`/`prezzi` sayfalarının `content.rendered`
   içeriği neredeyse boş (~9-10 kelime).** Gerçek fiyat/paket verisi
   CLAUDE.md'de belirtilen `mikro_*`/`sme_*`/`Pro_*`/`packages_title` ACF
   alanlarında — bu 4 sayfa migration'da normal içerik kopyalama akışına
   girmeyecek, ayrı ACF-çıkarım işi gerektirecek.

6. **Sistemik NL boşluğu:** KVKK/Gizlilik (0/18), Online Sunum Talebi CTA
   (0/3), Güvenlik (0/3), SSS (0/3), Teşekkürler (0/5), Destek Talebi (0/3)
   kategorilerinin **hiçbirinde NL sayfası yok** — toplam 6 kritik/önemli
   kategoride sistemik bir boşluk. Bu, NL pazarının kaynak sitede eksik
   kurulduğu anlamına geliyor; migration bunu "kayıp veri" olarak değil,
   **NL lansmanı için net-new içerik ihtiyacı** olarak ele almalı.

7. **"Sektör sayfaları" ve "müşteri hikayesi" sayfaları pages.json'da yok.**
   CLAUDE.md'nin mega-menü notlarıyla tutarlı: idenfit.com'da bağımsız bir
   `/sektorler/` sayfası zaten 404 veriyor. Header'daki 12 sektör ve
   müşteri referansları yalnızca mega-menü/Müşteriler sayfası içinde metin
   olarak var, ayrı WP sayfası olarak yok — bu iki alt-kategori için
   migrate edilecek gerçek kaynak sayfa **yok**, sıfırdan yazılacak.

   > **⚠️ DÜZELTME (2026-07-21):** "Sektör sayfaları" kısmı yanlıştı.
   > Bu envanter yalnızca `pages.json`/`posts.json` export'una (yalnızca
   > `page`/`post` post type'ları) dayanıyordu — sektör sayfaları ayrı
   > bir custom post type'ta (`sectors`, WP REST API `/wp-json/wp/v2/sectors`)
   > duruyor ve export'a hiç dahil edilmemişti. Gerçekte 12 sektörün
   > **tamamı 4 dilde** (48 sayfa) dolu içerikle mevcut — hero + "neden
   > idenfit" bloğu + çapraz-sektör tanıtımı + 2-4 modül vurgu bloğu.
   > Gerçek veri: `reference/wordpress-export/sectors.json` (üretim script'i:
   > `scripts/fetch-sectors.mjs`). **Güncelleme (aynı gün):** bu içerik
   > artık 48 sayfanın tamamında canlı (`SectorPage.astro`,
   > `getStaticPaths()` ile üretiliyor) — bkz. CLAUDE.md §"Sektör
   > sayfaları — DÜZELTME" ve §"Sektör sayfaları — GERÇEK İÇERİK
   > UYGULANDI". "Müşteri hikayesi" kısmı ise doğruydu — bkz.
   > CLAUDE.md §"Müşteri Başarı Hikayeleri sayfası" (`/musteriler/`
   > sayfasının kendisi ACF alanlarında gerçek içerik barındırıyor, ayrı
   > "hikaye" sayfaları olarak değil).

---

## 4. Blog yazıları (posts.json) — kategori özeti ve migration sırası

CLAUDE.md'deki kategori sayıları (11 kategori, 618 yazı — bir yazı birden
fazla kategoride olabilir) burada güncellik (en eski/en yeni `modified`)
bilgisiyle zenginleştirildi:

| Kategori | Sayı | En eski güncelleme | En yeni güncelleme | Durum |
|---|---|---|---|---|
| İK Akademi (`ik-akademi`) | 337 | 2025-08-23 | 2026-03-26 | Evergreen, büyük hacim |
| İK Trendleri (`ik-trendleri`) | 159 | 2025-08-23 | 2026-03-18 | Evergreen |
| Güncel Bilgiler (`guncel-bilgiler`) | 117 | 2025-08-23 | **2026-07-11** | **Hâlâ aktif güncelleniyor** |
| Dijital İK (`dijital-ik`) | 41 | 2025-08-23 | 2026-03-18 | Ürünle doğrudan örtüşüyor |
| Geçmiş Etkinlikler (`gecmis-etkinlikler`) | 14 | 2025-08-23 | 2025-09-26 | Statik arşiv, ~10 ay donmuş |
| Güncel Bilgiler TR ek (`guncel-bilgiler-tr`) | 11 | 2026-05-18 | **2026-07-11** | En taze kategori |
| Kategorisiz TR (`uncategorized-tr`) | 7 | 2025-09-29 | 2026-04-28 | Elle triaj gerekli |
| İK Röportajları (`ik-roportajlari`) | 4 | 2025-08-23 | 2025-08-24 | Küçük, durgun |
| Yaklaşan Etkinlikler (`yaklasan-etkinlikler`) | 3 | 2025-08-23 | 2025-09-05 | **Artık "yaklaşan" değil — bayat** |
| Öğretici Bilgiler (`ogretici-bilgiler`) | 3 | 2025-08-23 | 2025-09-29 | Küçük |
| Yenilikler TR (`yenilikler-tr`) | 2 | 2025-08-23 | 2025-08-23 | Küçük, ~11 ay donmuş |

**Önerilen migration sırası:**

1. **Güncel Bilgiler + Güncel Bilgiler TR ek (128 yazı toplam)** — en son
   2026-07-11'de güncellenmiş, yani içerik ekibi hâlâ buraya yazıyor. Canlıya
   en yakın/en "hareketli" kategori; bu yüzden ilk sırada olmalı ki migration
   sırasında kaynak sitede yeni eklenen içerik kaybolmasın.
2. **Dijital İK (41 yazı)** — ürün konumlandırmasıyla (dijital İK olgunluk
   testi, mega-menü KEŞFET) doğrudan örtüşüyor; pazarlama açısından yüksek
   öncelik, hacmi de yönetilebilir.
3. **İK Akademi (337 yazı)** — en büyük hacim, SEO değeri yüksek evergreen
   içerik ama tek seferde taşınamayacak kadar büyük. Birkaç haftaya
   bölünmeli (haftada ~80-100 yazı gibi); önce en yeni `modified` tarihli
   yazılardan başlanması önerilir (en son bakım görmüş = en güncel/en doğru
   içerik olma ihtimali yüksek).
4. **İK Trendleri (159 yazı)** — İK Akademi'ye benzer profil, ardından.
5. **Kategorisiz TR (7 yazı)** — küçük ama önce elle bakılmalı: hangi
   kategoriye ait olmaları gerektiği belirlenmeli, sonra ilgili gruba dahil
   edilmeli.
6. **İK Röportajları + Öğretici Bilgiler (7 yazı)** — küçük, hızlı kazanım,
   ana kategorilerle birlikte herhangi bir haftaya sıkıştırılabilir.
7. **Yenilikler TR (2 yazı)** — düşük öncelik, ~11 aydır dokunulmamış.
8. **Yaklaşan Etkinlikler (3 yazı)** — migrate etmeden önce **içerik gözden
   geçirilmeli**: son güncelleme 2025-09-05, yani bugünün (2026-07-21)
   gözünden bu etkinlikler artık "yaklaşan" değil, geçmiş. Ya güncellenip
   taşınmalı ya da Geçmiş Etkinlikler'e devredilmeli.
9. **Geçmiş Etkinlikler (14 yazı)** — en düşük öncelik, tanımı gereği arşiv;
   SEO/trafik değeri düşük, tam içerik migrasyonu yerine basit bir
   arşiv listesi/redirect yeterli olabilir.

---

## 5. Önerilen migration sırası (haftalık)

Proje temposu haftalık hedeflerle ilerliyor (bkz. CLAUDE.md "Proje temposu").
Buna göre kaba bir sıralama:

- **Hafta 1:** A-kritik statik sayfalar — Ana Sayfa (zaten yapıldı),
  Hakkımızda, İletişim (NL boşluğu dahil ele alınmalı), Fiyatlar (ACF
  çıkarımı gerekiyor), KVKK/Gizlilik/Sözleşmeler (18 sayfa, hukuki metin —
  çeviri değil birebir aktarım), Online Sunum Talebi CTA hedefi.
- **Hafta 2-4:** Ürün/Modül sayfaları (89 sayfa, 4 dil) — modül bazında
  gruplanarak (ör. önce Bordro/PDKS/İzin/Performans gibi çekirdek modüller,
  sonra Anket/Notlar/Servis gibi ikincil modüller) haftalara bölünmeli.
- **Hafta 5:** B-önemli sayfalar — Müşteriler, Neden İdenfit, SSS, Güvenlik,
  Donanım/Suprema (önce `themes.zip` açılıp Suprema içeriği kurtarılmalı),
  Global Marka, Teşekkürler sayfaları.
- **Paralel, ayrı bir iş kolu:** Blog migration'ı (§4'teki sıra) — hacmi
  büyük olduğu için sayfa migrasyonundan bağımsız, kendi haftalık temposunda
  ilerlemeli; önce Güncel Bilgiler, sonra Dijital İK, sonra İK
  Akademi/Trendleri fazlar halinde.
- **Son sırada / gerekirse atlanır:** Destek Talebi (C), Kampanya ve
  Test/taslak sayfalar (D) — Kampanya arşivlenip yönlendirilebilir, Test
  sayfaları migrate edilmeden atılabilir.

---

## 6. Yeniden üretme

```
node scripts/page-inventory.mjs
```

Konsola kategori boyutları + kategorisiz kalan sayfa sayısını basar (0
olmalı) ve `scripts/_page-inventory-data.json` dosyasını (ham veri, bu
raporun kaynağı) yeniden üretir.
