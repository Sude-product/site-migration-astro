# Ana Sayfa — Bölüm Envanteri Raporu (SADECE KEŞİF, hiçbir kod yazılmadı)

Kaynak: `reference/wordpress-export/pages.json`, id 9 (TR). `pll_translations`
ile EN (9818) / NL (20333) / IT (22786) bulundu — 4 dilin 4'ü de mevcut,
KARAR 2 tetiklenmedi.

| | Slug | Link | `content.rendered` uzunluğu |
|---|---|---|---|
| TR | `home` | `https://idenfit.com/` | 75.629 karakter |
| EN | `home-en` | `https://idenfit.com/en/` | 75.324 karakter |
| NL | `home-nl` | `https://idenfit.com/nl/` | 75.253 karakter |
| IT | `home-it` | `https://idenfit.com/it/` | 77.033 karakter |

**Template:** `elementor_theme` (tam Elementor sayfa şablonu — `pricing`/
`suprema` gibi özel PHP şablonlarının aksine, içerik tamamen Elementor
page builder JSON/HTML çıktısında).

## ACF şeması incelemesi — SONUÇ: Hero DIŞINDA hiçbir içerik ACF'de değil

388 ACF alanı var (Donanım sayfasıyla birebir aynı sayı — bu, ACF field
group'larının bu WP kurulumunda **global/tüm sayfalara eklenmiş** olduğunu
doğruluyor, sayfaya özgü değil). Bunların yalnızca **82'si dolu**, ve
dolu olanların neredeyse tamamı iki kategoriden biri:

1. **Gerçekten kullanılan (hero):** `banner_baslik`, `banner_aciklama`,
   `banner_buton_metin`, `banner_gorsel_dashboard`, `banner_kvkk_metin`,
   `banner_destek_metin/link`, `banner_tel_link`, `banner_wp_link`,
   `banner_form_*_label`, `hero_image_title`, `hero_image_subtitle`,
   `banner_redirect_link` — bunlar **zaten** `HeroSection.astro`/
   `HeroForm.tsx`'te kullanılıyor (bkz. CLAUDE.md "Hero bölümü").
2. **Kullanılmayan gürültü:** geri kalan ~300 alan (tüm `section_N_*`,
   `1_product_*`/`2_product_*_copyN`, `mct1_*`/`mct4_*`, `femas_*`/`civil_*`/
   `yatsan_*`/`dog-ser_*`/`tugba_kuruyemis_*`, `office_*`, `social_media_*`,
   `logo` vb.) **TAMAMI `false` veya boş** — Donanım/Şirket Takvimi'nde
   görülen "başka şablonlardan kalma ACF kalıntısı" örüntüsünün bir
   tekrarı, bu sayfada hiç kullanılmıyor.

**Sonuç: Bu, PDKS'in Şema D'si (`section_1_title..section_N_title`) DEĞİL,
Donanım'ın şeması da DEĞİL — ana sayfanın hero'su kendine özgü bir
`banner_*` alan grubu kullanıyor (zaten migrate edilmiş), ve hero'nun
ALTINDAKİ 11 bölümün TAMAMI ACF'de YOK.** İçerik tamamen
`content.rendered`'daki Elementor HTML'inde — yeni bir ACF şeması
tespiti yapılacak bir durum değil, çünkü extract edilecek bir ACF şeması
yok. Bu bölümler için (ileride üretime geçilirse) mega-menü KEŞFET
içeriğinde zaten bir kez yapıldığı gibi, Elementor HTML'den elle
transkripsiyon gerekecek.

## Bölüm envanteri — toplam 12 üst-seviye bölüm (hero dahil)

Elementor'un yeni "container" (`e-con e-parent`) modelini kullanıyor
(eski `section`/`column` değil). Basit bir regex ilk denemede yanlış
sonuç verdi (13 bölüm) — sebebi, hero'nun aslında ayrı, yeniden
kullanılabilir bir Elementor şablonunun (`id=25148`) `[elementor-template]`
shortcode'uyla `#hp-slider` container'ının İÇİNE gömülü olması; shortcode
render edilmiş HTML'de kendi `e-con e-parent` sınıfını koruyor, bu da
sahte bir "13. üst-seviye bölüm" gibi görünüyordu. Doğru sonuç için
DOM derinliği takip edilerek (yalnızca gerçek kök'ün DOĞRUDAN çocukları
sayıldı) 4 dilin 4'ünde de **tutarlı şekilde 12 gerçek üst-seviye bölüm**
bulundu.

| # | Başlık (TR) | Tür | İçerik |
|---|---|---|---|
| 1 | *(hero — "Tüm İK Süreçlerinizi Hemen Dijitalleştirin!")* | **Hero** | ✅ Zaten migrate edildi (`HeroSection.astro`) — başlık, açıklama, lead-capture form (İsim/Telefon/Firma/Email + KVKK onayı + "Hemen Başvur"), 1 görsel, "Bütüncül İK Uygulamaları" alt-metni. `#hp-slider` container'ı içinde, ayrı bir Elementor şablonundan (`id=25148`) shortcode ile geliyor. |
| 2 | "1000'den fazla mutlu müşteri, dijital İK dönüşümünü bizimle gerçekleştirdi." | **Müşteri logo şeridi** | Başlık yok (sadece bu tek cümle) + **7 logo**: Migros One, Acun Medya, Kellogg's, Ferre, Tuğba, Civil, Caribou. Buton/link yok. |
| 3 | "Manuel Süreçlerden Kurtulun, İK Operasyonlarınızı Kolaylaştırın!" | **Ayraç/bölüm başlığı** | Yalnızca bir `<heading>` — görsel/buton yok. Bir sonraki bölüme (video) giriş cümlesi gibi duruyor. |
| 4 | "Neden idenfit?" | **Video bölümü** | Gerçek YouTube video'su (`youtu.be/N4cuH5AdDmg`, poster görseli var) + "Daha Fazla" linki → `/tr/neden-idenfit/`. |
| 5 | "Verimli İşletmeler İçin Akıllı İK Çözümleri" | **4'lü özellik kartı grid'i** | İkon+başlık+açıklama kartları: **Zaman ve İzin Yönetimi**, **Performans Yönetimi**, **Çalışan Deneyimi**, **İnsan Kaynakları Analitiği**. Buton/link yok (bilgilendirici kart, tıklanamaz). |
| 6 | "Zamandan Tasarruf Edin, İK Süreçlerinizi Akıllıca Yönetin!" | **Ayraç/bölüm başlığı** | Yalnızca başlık — bir sonraki bölüme (5 Soru) giriş. |
| 7 | "Verimliliği Ölçen 5 Soru" | **Metin + görsel (ürün ekran görüntüsü)** | Açıklama metni + 1 görsel (`home-efficiency*.webp` — muhtemelen bir dashboard/değerlendirme ekran görüntüsü). Buton/link yok — isme rağmen tıklanabilir bir teste bağlanmıyor. |
| 8 | "Kullanıcı Dostu Panel" | **Özellik + 2. lead-capture form** | Açıklama + 3 öğelik liste (Anlık Bilgiler, Hatırlatmalar, Gerçek Zamanlı Monitör) + 1 görsel (panel ekran görüntüsü) + **hero'daki ile AYNI alanlara sahip İKİNCİ bir form** ("Online tanıtım için hemen başvurun!" — İsim/Telefon/Firma/Email + KVKK + "Hemen Başvur"). |
| 9 | "Temassız Tanımlama & Geçiş Sistemleri" | **Donanım partner vurgusu** | Suprema logosu + "Hardware partner" etiketi + 1 ürün görseli (2 kez, muhtemelen responsive varyant) + link → `/tr/suprema/` (CLAUDE.md'de daha önce not edilen, `content.rendered`'ı boş Suprema alt-sayfasına gidiyor). |
| 10 | "Bulut Teknolojisi & Kalite Standartları" | **Sertifika/rozet şeridi** | ISO 27001 ve ISO 9001'den bahseden metin + **7 ikon/rozet** (dosya adları jenerik `icon5.svg`..`icon11.svg` — muhtemelen ISO/güvenlik sertifika rozetleri, kesin kimlikleri görsel incelemeden anlaşılamıyor). Link yok. |
| 11 | "Geliştirilebilir Çalışan Deneyimi" | **Testimonial carousel** | ⚠️ **`/musteriler/`'deki 5 müşteri hikayesinden TAMAMEN FARKLI** 2 yeni testimonial: **İsmail Ünal** (Zsa Zsa Zsu — People & Culture Manager), **Emre Özcan** (HAVAİST — Kurumsal İletişim Yöneticisi). Ayrıca 2 dekoratif görsel. Link/buton yok. |
| 12 | "Tüm İK İhtiyaçları İçin Tek Noktadan Çözüm" | **Partner/entegrasyon vurgusu** | HRTech Alliance ortaklığından bahsediyor, dış link → `https://www.hrtech-alliance.com/` (yeni sekme). 3 görsel (2 logo + 1 ürün görseli). Muhtemelen footer'dan hemen önceki son bölüm. |

**Toplam:** 12 bölüm (1 hero + 11 içerik bölümü). 2 bölüm (#3, #6) yalnızca
başlık — kendi başına bölüm değil, bir sonraki bölüme görsel "giriş"
işlevi görüyor gibi duruyor (Elementor'da ayrı container olarak
modellenmiş olsalar da).

## 4 dil karşılaştırması

**Yapısal tutarlılık:** ✅ 4 dilin 4'ünde de **tam olarak 12 bölüm**,
aynı sırada, aynı başlık temalarıyla (EN/NL/IT başlıkları curl ile
karşılaştırıldı — hepsi birbirinin gerçek çevirisi, sayısal/yapısal
sapma yok).

**Çeviri kalitesi — İYİ SÜRPRİZ:** Bu projede alışıldık "IT = EN kopyası"
örüntüsünün AKSİNE, ana sayfanın **12 başlığının 12'si de** EN/NL/IT'de
gerçek, birbirinden farklı, kaliteye sahip çeviriler (spot-check curl ile
doğrulandı — ör. IT "Perché Idenfit?", NL "Waarom kiezen voor Idenfit?",
EN "Why Choose Idenfit?" — üçü de gerçek, farklı metin, hiçbiri kopya
değil). **Not:** bu yalnızca BAŞLIK seviyesinde bir kontrol — gövde
metinlerinin tamamının kelime kelime kalitesi bu turda incelenmedi
(sadece keşif istendi), ileride üretime geçilirse KARAR 1 kuralı gereği
yine de tam bir kontrol yapılmalı.

**Bulunan 2 gerçek içerik/veri tutarsızlığı (kaynağın kendi hataları):**
1. **Video farklı dillerde farklı, ama tutarsız gruplanmış:** TR ve IT
   AYNI videoyu kullanıyor (`youtu.be/N4cuH5AdDmg` — Türkçe video), EN ve
   NL AYNI (farklı) videoyu kullanıyor (`youtu.be/iEQ_lep-ZY8`). IT'nin
   Türkçe video kullanması muhtemelen bir hata (İtalyanca'ya özel bir
   video yok, TR'ye düşülmüş) — NL'nin EN videosunu kullanması muhtemelen
   kasıtlı/makul bir fallback.
2. **"5 Soru" bölümünün (#7) görseli IT'de yanlış:** IT sayfası TR'nin
   ekran görüntüsünü (`home-efficiency-1024x641.webp`) kullanıyor, üstelik
   `alt` metni de hâlâ **"efficiency tr"** (Türkçe etiket kaçmış) — EN
   kendi görselini kullanıyor (`home-efficiency-en-*.webp`), NL de kendi
   farklı bir görselini kullanıyor. IT burada gerçekten atlanmış/unutulmuş
   görünüyor.

Bu iki bulgu **düzeltilmedi** — talimat gereği bu turda yalnızca keşif
yapıldı, kod/veri değişikliği yok.

## Genel özet

- **Toplam bölüm sayısı:** 12 (1 hero + 11 içerik bölümü), 4 dilde tutarlı.
- **2 form var:** hero'da 1, "Kullanıcı Dostu Panel" bölümünde (#8) bir
  tane daha — ikisi de aynı alan setine sahip (İsim/Telefon/Firma/Email +
  KVKK onayı), muhtemelen aynı `HeroForm.tsx`-tarzı component 2 kez
  kullanılabilir.
- **1 video, 1 testimonial carousel (2 tanık, `/musteriler/`'dekilerden
  farklı), 1 müşteri logo şeridi (7 logo), 1 sertifika rozet şeridi
  (7 rozet), 2 dış/donanım-partner vurgusu (Suprema + HRTech Alliance).**
- **Hiçbir bölüm ACF'de değil** (hero hariç) — tamamı Elementor
  `content.rendered` HTML'inden elle çıkarılmayı bekliyor (mega-menü
  KEŞFET içeriğinde zaten uygulanmış olan yöntemin aynısı).
- **Çeviri kalitesi genel olarak iyi** (bu projede alışılmadık bir
  şekilde IT dahil tüm başlıklar gerçek çeviri) — yalnızca 2 küçük
  veri hatası (IT'nin videosu ve #7 görseli) bulundu.

## Sıradaki adım (öneri, henüz karar değil)

Kullanıcı onayı ile üretime geçilirse, her bölüm muhtemelen kendi
component'iyle (`CustomerLogos.astro`, `BrandVideoSection.astro`,
`FeatureCardsGrid.astro`, `PanelFeatureSection.astro` + form, `PartnerHighlight.astro`,
`CertificationBadges.astro`, `HomeTestimonialCarousel.astro` gibi) veri
dosyası (`src/data/homeContent.ts`) üzerinden inşa edilebilir — ama bu
kod yazımı bu turun kapsamı dışında, yalnızca keşif istendi.
