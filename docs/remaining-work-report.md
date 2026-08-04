# Eksikler ve Gelecek Planlama — Açık Noktalar Raporu

**Tarih:** 2026-07-24
**Kapsam:** CLAUDE.md'deki tüm açık nokta/TODO'ların tek listede toplanması. Bu rapor salt keşif — hiçbir madde bu turda düzeltilmedi.

---

## 1. Faz 2 kapsamındaki işler (backend gerektiren)

Bu proje `output: 'static'` (Cloudflare Pages'e statik deploy) — backend
gerektiren her şey bilinçli olarak Faz 2'ye (Cloudflare Pages Functions)
ertelendi. Şu an **3 ayrı özellik** bu blokerı taşıyor:

| # | Özellik | Şu anki durum | Faz 2'de yapılması gereken |
|---|---|---|---|
| 1 | **Hero formu** (İsim/Telefon/Firma/Mail, ana sayfa + 2. form) | `console.log`'a düşüyor, hiçbir yere gönderilmiyor | CRM/e-posta entegrasyonu + başarılı gönderimde gerçek Teşekkürler sayfasına (`tesekkurler`/`en/thanks`/`it/grazie`) yönlendirme |
| 2 | **"Dijital İK Olgunluk Testi"** | Kırık link önlendi, ana sayfaya yönlendiriliyor | Firma Adı/Sektör/Çalışan Sayısı toplayan lead-capture formu + 8 soruluk quiz + skorlu sonuç sayfası (`ik-dijital-olgunluk-testi-sonucu`) — **HeroForm'la aynı blokerı taşıyor, muhtemelen birlikte ele alınmalı** |
| 3 | **Teşekkürler sayfası → form bağlantısı** | Sayfa migrate edildi ama form gönderimiyle arasında otomatik yönlendirme yok | Form başarıyla gönderilince kullanıcı gerçek Teşekkürler sayfasına düşmeli (madde 1'le aynı iş) |

**Not:** Puantaj modülünün gerçek bir YouTube `video_url`'i var ama site
genelinde hiçbir ürün sayfası video embed kullanmadığı için bilinçli
olarak embed edilmedi (backend'le ilgisi yok, tasarım tutarlılığı kararı
— bkz. §6).

---

## 2. Görsel eksikleri

| Görsel | Durum | Not |
|---|---|---|
| ÜRÜNLER mega-menü promo paneli | ✅ **Çözüldü** (2026-07-24) | `header-image.webp` bulundu, artık gerçek görsel var |
| Hesaplama Araçları hero illüstrasyonu | ✅ **Çözüldü** (2026-07-23) | `header-bg-2x.png`, derlenmiş Elementor CSS'inden bulundu |
| Ana sayfa hero görseli | ✅ Zaten gerçek (4 dilde farklı) | — |
| **Suprema alt sayfaları** (`suprema-2`, `suprema-tools`, `dispositivi-suprema`) | ❌ **Hâlâ işlenmedi** | `content.rendered` 0 kelime — özel PHP şablonu (`suprema/suprema.php`) kullanıyor, içerik export'a hiç düşmemiş. **`uploads.zip`/`themes.zip` açılmadan kurtarılamaz.** Kullanıcı kararıyla bu sayfalara link vermek yerine mega-menüdeki Suprema linki gerçek `/donanim/` sayfasına yönlendiriliyor — **bilinçli bir atlama, aktif bir hata değil.** |
| `uploads.zip` (~1.4 GB, tüm görseller) | Açılmadı | Şu ana kadar ihtiyaç duyulan HER görsel canlı `idenfit.com` sunucusundan hotlink ile bulundu — arşivi açmayı gerektiren somut bir ihtiyaç henüz çıkmadı. Yalnızca Suprema içeriği kurtarılacaksa gerekebilir. |
| `themes.zip` (~22 MB, WP teması) | Açılmadı | Aynı gerekçe — Suprema şablon kodu için gerekebilir. |

---

## 3. KARAR 2 — kaynakta olmayan çeviriler için yeni sayfa üretimi

**Henüz ekiple netleşmedi, hâlâ bekliyor.** Şu an etkilenen somut sayfalar:

- **Hesaplama Araçları** — yalnızca TR'de var. EN/IT ziyaretçileri artık
  sessizce 404 almıyor (bugün eklenen `i18n.fallback` sayesinde TR
  sayfasına yönleniyor), ama gerçek EN/IT çevirisi yok.
- Kaynakta bazı modüllerin (ör. bazı sektör/ürün kombinasyonları) belirli
  dillerde hiç sayfası yoktu — KARAR 1 (gerçek çeviri kuralı) kapsamında
  geriye dönük olarak çoğu zaten TR'den çevrilip dolduruldu (İşe Alım NL,
  12 modülün IT'si vb.), bu yüzden bu kategori büyük ölçüde kapandı.
  KARAR 2 asıl olarak **"kaynakta o dil için sayfa yoksa sıfırdan yeni
  sayfa üretilsin mi"** sorusuna odaklanıyor (var olan ama kötü çeviri
  sorunundan farklı) — bu haliyle yalnızca Hesaplama Araçları/Dijital
  Olgunluk Testi gibi "yalnızca TR'de mevcut araç" sınıfı sayfalar için
  hâlâ açık.

---

## 4. Dijital İK Olgunluk Testi

Bkz. §1 madde 2 — özet: kaynakta gerçekten var (TR-only, doğrulandı) ama
tam bir lead-capture formu + 8 soruluk quiz + skorlu sonuç sayfası
kombinasyonu. Şu an `src/data/navigation.ts`'teki `digitalMaturityTest`
linki (`href: ''`) ana sayfaya yönlendiriyor. Faz 2'de HeroForm'la
birlikte ele alınmalı; o zaman quiz widget'ının tam JS/HTML yapısı
yeniden incelenmesi gerekecek.

---

## 5. Envanterdeki tamamlanmamış İkincil/Düşük öncelik sayfalar

`docs/page-inventory.md`'nin C) İKİNCİL ve D) DÜŞÜK ÖNCELİK
kategorilerinden, blog migrasyonu tamamlandıktan SONRAKİ güncel durum:

### C) İKİNCİL — gerçek bir boşluk
- **Destek Talebi / Support Request formu** (`destek-talebi`/
  `support-request`/`richiesta-supporto`, TR/EN/IT, NL yok) — **hiç migrate
  edilmedi, hiç denenmedi.** Bu, önceki bir oturumda bulunan
  `tesekkurler-destek` (TR, id 16712) ve envanterdeki `thank-you` (EN, 33
  kelime) sayfalarının KAYNAK formu — yani "Destek Talebi Teşekkürler"
  sayfası varlığını sürdürüyor ama onu tetikleyen asıl FORM sayfası site
  üzerinde yok. Muhtemelen HeroForm'a benzer bir backend'e ihtiyaç duyar
  (Faz 2 kapsamına girebilir).

### B) ÖNEMLİ kategorisinden kalan tek gerçek boşluk
- **`tesekkurler-destek` (TR) + `thank-you` (EN)** — Destek Talebi'nin
  teşekkür sayfaları. Bilinçli olarak migrate edilmedi (kullanıcının
  tarif ettiği teşekkür sayfası farklıydı — `/tesekkurler/`, video/müşteri
  kartlı — id 15810, o migrate edildi). Destek Talebi formu (yukarıya
  bkz.) migrate edilmeden bu sayfaların da bir önceliği yok.

### D) DÜŞÜK ÖNCELİK / ATILABİLİR — kasıtlı olarak atlanmalı
Bunlar migrate EDİLMEMELİ, envanterin kendi önerisi de bu yönde:
- **Kampanya** (`kampanya`, "Aralık Kampanyası") — zamana bağlı, geçmiş bir
  ay için hazırlanmış promosyon, artık geçersiz.
- **Test/taslak/WP varsayılan sayfalar (6):** `form-test`, `sample-page`
  (WP'nin düzenlenmemiş varsayılan sayfası), `test-tr`, `slider-form` +
  `slider-form-en`, `ik-dijital-test` (muhtemelen terk edilmiş bir taslak
  — `ik-dijital-olgunluk-testi` ile karıştırılmamalı).

**Sonuç: envanterdeki gerçek/aktif bir boşluk yalnızca Destek Talebi
formu ailesi (3+2 sayfa) — geri kalan hepsi ya tamamlandı ya da kasıtlı
olarak atlanmalı.**

---

## 6. Bilinen küçük tasarım/hizalama sorunları ("ince işçilik sonra")

Önceki oturumlarda bilinçli olarak ertelenen/kapsam dışı bırakılan
maddeler:

1. **FeatureGrid kartları arası "+"/"=" bağlayıcı ikonlar** — kaynakta var
   (salt dekoratif), bizim sitemizde eklenmedi. Karmaşıklığı faydasına
   değmiyor kararıyla bilinçli bir kapsam dışı bırakma.
2. **Blog sidebar'ının breadcrumb widget'ı** — kaynakta var ("Bu
   sayfadasınız: Blog > Kategori > Yazı"), bizim sidebar'ımıza eklenmedi
   çünkü `/category/...` arşiv sayfaları sitede yok — eklemek kırık link
   üretirdi.
3. **Puantaj'ın YouTube `video_url`'i** — veri `products.json`'da duruyor
   ama render edilmiyor (site genelinde başka hiçbir ürün sayfası video
   embed kullanmıyor, tutarlılık kararı).
4. **İzin Yönetimi'nin Double Tree by Hilton testimonial bloğu** — veride
   var ama PDKS şablonuna sadık kalmak için render edilmiyor.
5. ~~KEŞFET mega-menüsündeki "Podcastler"~~ — **✅ kaldırıldı (2026-07-24):**
   soluk/tıklanamaz görünmesi yerine menüden tamamen çıkarıldı,
   `comingSoon` mekanizması (yalnızca bunun için vardı) tüm kod tabanından
   temizlendi. İçeriği hazır olursa gelecekte geri eklenebilir.
6. ~~Müşteriler sayfasının 3 kartı "Video yakında" gösteriyordu~~ — **✅
   çözüldü (2026-07-24):** "Video yakında" yazısı yerine, /musteriler/
   sayfasının kendi ACF fotoğrafları (Yatsan/Doğ-Ser Makina/Tuğba
   Kuruyemiş'in mağaza/şantiye fotoğrafları) render ediliyor. **Not:**
   ilk denemede bu fotoğrafların yerine YANLIŞLIKLA idenfit.com'un medya
   kütüphanesinden bulunan gerçek logo dosyaları konmuştu (fotoğrafların
   "hata" olduğu varsayılmıştı) — kullanıcı bunun yanlış bir varsayım
   olduğunu belirtip gerçek fotoğrafların geri konmasını istedi, geri
   alındı. Femaş/Civil'in gerçek video kartlarına dokunulmadı.

Bu 6 madde şu ana kadar (5 ve 6 zaten çözüldü) hepsi **bilinçli/onaylı kararlar** — aktif hata
değil, ama kullanıcı isterse ileride (ör. podcast URL'i bulunursa, ya da
tasarım tamlığı için "+"/"=" ikonları eklenmek istenirse) gündeme
gelebilir.

---

## Özet — öncelik sırasıyla gerçek açık noktalar

| Öncelik | Madde | Blokaj |
|---|---|---|
| 🔴 Yüksek | Hero form + Dijital Olgunluk Testi + Teşekkürler bağlantısı | Faz 2 backend gerekiyor |
| 🟡 Orta | Destek Talebi formu ailesi (3+2 sayfa) | Muhtemelen Faz 2 backend gerekiyor |
| 🟡 Orta | KARAR 2 — Hesaplama Araçları EN/IT çevirisi | Ekip kararı bekliyor |
| ⚪ Düşük | Suprema alt sayfaları (3 sayfa) | `uploads.zip`/`themes.zip` açılması gerekiyor, düşük değer |
| ⚪ Düşük | 5 bilinçli tasarım kapsam-dışı maddesi (§6) | Karar zaten verildi, yalnızca fikir değişirse gündeme gelir |
