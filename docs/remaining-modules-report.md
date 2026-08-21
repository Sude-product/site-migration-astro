# Aşama 3.0 — Kalan Modüller Tarama Raporu (SADECE KEŞİF, hiçbir sayfa üretilmedi)

Üretim script'i: `scripts/scan-remaining-modules.mjs` (yalnızca okur, hiçbir
route/sayfa dosyası yazmaz). Ham veri: `scripts/_remaining-modules-scan.json`.
Yeniden üretmek için: `node scripts/scan-remaining-modules.mjs`.

**Kapsam:** page-inventory.mjs'in `A_modules` listesinden, Aşama 1/2/2.5'te
zaten tamamlanan 12 modül (PDKS, Bordro, İzin, Performans, Onboarding, İşe
Alım, Sağlık, Offboarding, Anket, Geri Bildirim, Şirket Takvimi, Notlar)
çıkarıldıktan sonra kalan **12 aday modül**. (Not: kullanıcının tahmini
"~19-20" idi; gerçek TR-kökenli benzersiz modül sayısı 12 çıktı — page-inventory'nin
89 rakamı 4 dilin TOPLAMI, TR-kökenli grup sayısı değil.)

## Özet tablo

| Modül (TR slug) | Şema | TR | EN | NL | IT |
|---|---|---|---|---|---|
| calisan-egitim-yonetimi-modulu | A | ✅ 2 blok/2 SSS | ⚠️ 3 blok (fazla) | ✅ 2 blok | ⚠️ IT=EN kopya, 3 blok |
| calisan-ozluk-yonetimi-modulu-2 | A | ✅ | ⚠️ başlık farklı ama gövde şüpheli | ⚠️ başlık farklı ama gövde şüpheli | ❌ gövde metni TR kopyası |
| demirbas-yonetimi-modulu | A | ⚠️ SSS yok, başlık pazarlama cümlesi | ✅ | ❌ export dışı (401) | ❌ kaynakta hiç yok |
| dokuman-yonetim-sistemi-modulu | A | ✅ | ✅ | ✅ | ⚠️ IT=EN kopya |
| insan-kaynaklari-isgucu-yonetimi | D | 🔶 muhtemelen hub sayfası | ⚠️ IT=EN kopya olabilir | ❌ hiç yok | ⚠️ IT=EN kopya |
| insan-kaynaklari-yonetimi-modulu | D | 🔶 muhtemelen hub sayfası | ⚠️ IT=EN kopya olabilir | ❌ hiç yok | ⚠️ IT=EN kopya |
| masraf-yonetimi-modulu | A | ✅ | ✅ | ✅ | ⚠️ IT=EN kopya |
| ofis-ici-mesajlasma-modulu | A | ✅ | ✅ | ✅ | ⚠️ IT=EN kopya |
| personel-servisi-yonetimi-modulu | A | ✅ | ✅ | ❌ NL=EN kopya | ⚠️ IT=EN kopya |
| **puantaj-takip-programi-modulu** | **❌ TANINMIYOR** | 🔴 hero yok | 🔴 hero yok | 🔴 hero yok | 🔴 hero yok |
| seyahat-ve-gorevlendirme-yonetimi-modulu | A | ✅ | ✅ (gerçek çeviri) | ❌ hiç yok | ❌ hiç yok |
| zimmet-yonetimi-modulu | A | ✅ | ❌ ham Türkçe (çevrilmemiş) | ✅ | ❌ ham Türkçe (çevrilmemiş) |

Lejant: ✅ sorun yok görünüyor · ⚠️ çeviri kalitesi sorunu (kopya/kısmi) ·
❌ eksik/yok · 🔶 yapı şüpheli (muhtemelen farklı sayfa türü) · 🔴 kritik/tanınmayan.

---

## 1. Standart şemada, YAPISAL OLARAK sorunsuz modüller

Blok/SSS sayıları 4 dilde tutarlı, tanınan bir şema (hepsi Şema A —
`module_title` hero'lu) kullanıyor. **Önemli:** bu yalnızca YAPISAL
temizlik — çeviri KALİTESİ ayrı bir eksen (bkz. §3, hemen hepsi orada da
listeleniyor). Hiçbiri "tamamen hazır, dokunmadan route'lanabilir" değil.

- **dokuman-yonetim-sistemi-modulu** (Doküman) — 2 blok / 4 SSS, 4 dilde tutarlı.
- **masraf-yonetimi-modulu** (Masraf) — 3 blok / 4 SSS, 4 dilde tutarlı.
- **ofis-ici-mesajlasma-modulu** (Mesaj) — 3 blok / 5 SSS, 4 dilde tutarlı.
- **zimmet-yonetimi-modulu** (Zimmet) — 2 blok / 2 SSS, 4 dilde tutarlı.
- **personel-servisi-yonetimi-modulu** (Servis/Shuttle) — 1 blok / 5 SSS, 4 dilde tutarlı.
- **calisan-ozluk-yonetimi-modulu-2** (Özlük Dosyası) — 3 blok / 4 SSS, 4 dilde tutarlı.
- **calisan-egitim-yonetimi-modulu** (Eğitim) — TR/NL 2 blok, EN/IT 3 blok
  (küçük bir tutarsızlık — EN'de TR'de olmayan ekstra bir `section_2_title`
  bulundu: "Have efficient training results". Bug değil, muhtemelen EN
  editörü fazladan bir blok eklemiş; yalnızca EN/IT'yi etkiliyor).

**SSS-konu eşleşmesi:** Bu 7 modülün TR SSS'i (Q1) kendi konusuyla tutarlı
görünüyor (ör. Özlük→"dijital özlük dosyası", Masraf→"harcama yönetim
sistemi", Mesaj→"şirket içi haberleşme", Zimmet→"kurumsal varlık yönetimi",
Servis→"servis takip programı") — PDKS'teki gibi bir çapraz-kontaminasyon
işareti YOK.

---

## 2. Özel/tuhaf durumu olan modüller

### 🔴 `puantaj-takip-programi-modulu` (Puantaj Takibi) — 5. bir ACF şeması, extraction script'i ÇÖZEMİYOR
4 dilin **hiçbirinde** bilinen 4 hero alanından (`module_title`,
`hero_title`, `section_1_title`, `section_title_1`) hiçbiri dolu değil.
Gerçek başlık yalnızca WP post title'ında var (`title.rendered`:
"Puantaj Takibi Modülü", Yoast title'da da aynı). Gerçek içerik
`section_2`, `section_4`, `section_5`, `section_6`, `section_7`,
`section_8`'de duruyor (section_1 ve section_3 boş/yok — numaralandırmada
boşluklar var). Bu sayfa ayrıca yıllar içinde birikmiş **çok sayıda
alakasız ACF alanı** taşıyor: `musteriler` sayfasının testimonial alanları
(`civil_*`, `femas_*`, `yatsan_*`, `dog-ser_*`, `tugba_kuruyemis_*`),
iletişim/ofis/sosyal medya alanları, VE `2_product_title_copy` ile
`2_product_title_copy15`'e kadar (15 kopya!) giden tuhaf bir ürün-listesi
deseni. **`extract-products.mjs`'in mevcut 4 şema tespiti bu sayfa için
YETERSİZ — elle özel bir extraction fonksiyonu ve hero için
`title.rendered` fallback'i gerekecek.**

### 🔶 `insan-kaynaklari-yonetimi-modulu` ve `insan-kaynaklari-isgucu-yonetimi` — muhtemelen tekil modül sayfası değil, HUB/genel bakış sayfası
İkisi de Şema D (`section_1_title`) ile eşleşiyor ama ACF içerik blokları
son derece ince (yalnızca section_1 dolu, section_2+ tamamen boş) —
buna karşın `content.rendered` (Elementor serbest içerik) sırasıyla
**54 KB ve 20 KB** — yani gerçek görünen içerik ACF alanlarında değil,
doğrudan Elementor widget'larında (muhtemelen diğer modüllere link veren
kart/liste yapıları, başlıkları da çoğul: "İnsan Kaynakları **Modülleri**",
"İşgücü Yönetimi"). **Bizim ACF-tabanlı extraction yöntemimiz bu sayfaların
gerçek içeriğini YAKALAYAMAZ** — bunlar muhtemelen "modül detay sayfası"
değil "modül grubu/hub sayfası" olarak farklı ele alınmalı (belki hiç
migrate edilmemeli, belki mega-menü linkleri zaten yeterli). Ayrıca
ikisinde de **NL kaynakta hiç yok**.

### ⚠️ `demirbas-yonetimi-modulu` — editoryal stil tutarsızlığı + veri boşlukları
`module_title` diğer modüllerdeki gibi kısa bir etiket değil, tam bir
pazarlama cümlesi ("Demirbaşları dijital ortama taşıyın, kontrolü
kolaylaştırın!") — bug değil ama sitedeki genel konvansiyondan sapıyor
(EN'i kısa bir başlık kullanıyor: "Asset Management Module" — bu da
kendi içinde bir tutarsızlık). Ayrıca: **TR'de hiç SSS yok** (0/0, diğer
tüm modüllerde en az 2 SSS var), **NL export dışı** (`pll_translations`
id 20269'a işaret ediyor ama canlı WP REST API `401 rest_forbidden`
döndürüyor — İşe Alım NL'deki AYNI sınıf bulgu), **IT kaynakta hiç yok**
(`pll_translations`'ta referans bile yok).

---

## 3. Çeviri eksikliği/kopya olan modül-dil kombinasyonları

**IT = EN'in birebir kopyası (başlık düzeyinde doğrulandı):**
- calisan-egitim-yonetimi-modulu → IT: "Staff Training Module" (=EN)
- dokuman-yonetim-sistemi-modulu → IT: "Documents Module" (=EN)
- insan-kaynaklari-isgucu-yonetimi → IT: "Workforce Management" (=EN)
- insan-kaynaklari-yonetimi-modulu → IT: "Human Resources Management Modules" (=EN)
- masraf-yonetimi-modulu → IT: "Expenses Module" (=EN)
- ofis-ici-mesajlasma-modulu → IT: "Message Module" (=EN)
- personel-servisi-yonetimi-modulu → IT: "Shuttle Module" (=EN)

**NL = EN'in birebir kopyası (YENİ bir örüntü — önceki aşamalarda yalnızca IT'de görülmüştü):**
- personel-servisi-yonetimi-modulu → NL: "Shuttle Module" (=EN, Hollandaca değil)

**Gövde metni TR kopyası (başlık çevrilmiş ama içerik değil — `kurumsal-takvim-modulu`'nda görülen "satır satır karışık" örüntünün tekrarı):**
- calisan-ozluk-yonetimi-modulu-2 → IT: `section_2_title`/`section_2_text`
  TR ile birebir aynı ("Güncel ve eksiksiz özlük dosyası tutun!") — hero
  başlığı gerçekten çevrilmiş olsa da ("Modulo Fascicolo Personale") en
  az bir içerik bloğu hiç çevrilmemiş. **Diğer bloklar da tek tek
  kontrol edilmeli.**

**Tamamen çevrilmemiş, EN/IT'nin kendisi ham Türkçe (İşe Alım'daki en ciddi
örüntünün tekrarı):**
- zimmet-yonetimi-modulu → EN VE IT ikisi de `module_title`: "Zimmet
  Yönetimi" (Türkçe, çevrilmemiş) ve `section_2_title`: tam bir Türkçe
  cümle ("Demirbaşları ve atadığınız zimmetleri dijital ortamda kolaylıkla
  takip edin!") — yalnızca NL gerçekten çevrilmiş ("Zimmetbeheer").

---

## 4. Kaynak sitede hiç olmayan / erişilemeyen sayfalar

**`pll_translations`'ta referans bile yok (o dil hiç oluşturulmamış):**
- demirbas-yonetimi-modulu → IT yok
- insan-kaynaklari-isgucu-yonetimi → NL yok
- insan-kaynaklari-yonetimi-modulu → NL yok
- seyahat-ve-gorevlendirme-yonetimi-modulu → **NL VE IT ikisi de yok**
  (yalnızca TR + EN var — bu modülün en az kapsamlı çeviri desteği)

**`pll_translations`'ta referans var ama sayfa export'ta/canlıda yok (yayınlanmamış/taslak, İşe Alım NL'deki aynı sınıf bulgu):**
- demirbas-yonetimi-modulu → NL (id 20269, canlı WP REST API: `401 rest_forbidden`)

---

## Aşama 3'e dair genel gözlem

12 modülün **9'unda** en az bir dilde ciddi bir çeviri kalitesi sorunu var
(kopya, kısmi çeviri veya tamamen çevrilmemiş) — bu, Aşama 2/2.5'te
gördüğümüz oranla tutarlı (12/12 modülde IT sorunu çıkmıştı). **KARAR 1
kuralı (gerçek çeviri, kopya/boş kabul yok) bu 12 modülün tamamına da
uygulanacak** — üretim aşamasına geçildiğinde şaşırtıcı olmayacak, zaten
beklenen bir iş yükü.

**Gerçek sürpriz:** `puantaj-takip-programi-modulu` (tanınmayan şema) ve
iki "hub" şüpheli sayfa (`insan-kaynaklari-yonetimi-modulu`,
`insan-kaynaklari-isgucu-yonetimi`) — bu 3 sayfa mevcut
`extract-products.mjs` mantığıyla DOĞRU işlenemez, üretime geçilmeden
önce ya elle özel kod yazılmalı ya da kapsam dışı bırakılmalı (özellikle
2 hub sayfası için: gerçekten "modül detay sayfası" listesine ait
olduklarından emin olunmalı — belki bunlar migration'da hiç
gerekmiyordur, mega-menü zaten aynı bilgiyi başka şekilde sunuyor).
