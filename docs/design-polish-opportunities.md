# Görsel İnce İşçilik (Polish) Fırsatları

**Tarih:** 2026-07-24
**Kapsam:** Mevcut tasarım DEĞİŞTİRİLMEDİ — bu rapor salt keşif, kod
tabanı incelenerek (grep/dosya okuma) toplanan somut, doğrulanmış
bulgular. Öncelik sırası: kolay/hızlı → karmaşık. Hiçbir madde bu turda
düzeltilmedi.

---

## 🟢 Kolay/Hızlı (tek dosya veya birkaç satırlık değişiklik)

### 1. ✅ ÇÖZÜLDÜ (2026-07-24) — Blog kartlarının köşe yuvarlaklığı site geneliyle uyuşmuyordu
Site genelinde kart bileşenleri (`PricingPage`, `HubTileCard`,
`SectorFeatureCard`, `CustomerStoryCard`) hepsi **aynı** stili kullanıyor:
`rounded-2xl border border-gray-100 ... shadow-sm`. Blog'un liste
kartları (`BlogListPage.astro`) ve tekil yazı sayfasındaki öne çıkan
görsel (`src/pages/blog/[slug].astro`) ise `rounded-lg` (daha küçük
yarıçap) kullanıyordu — düzeltildi, ikisi de artık `rounded-2xl`.

### 2. ✅ ÇÖZÜLDÜ (2026-07-24) — Hover durumlarında geçiş (transition) eksikti
**Bulgu düzeltilirken genişletildi:** ilk taramada dosya-seviyesinde
("bu dosyada hiç transition yok mu") 8 bileşen bulunmuştu, ama bu yöntem
Footer.astro gibi AYNI dosyada hem geçişli hem geçişsiz hover'ları bir
arada barındıran dosyaları kaçırıyordu. Düzeltme sırasında her `class`
attribute'unu tek tek inceleyen daha kesin bir tarama yapıldı (bkz.
CLAUDE.md) — gerçek toplam **10 instance, 8 dosyada**:
- `ContactPage.astro` (2 — telefon/e-posta)
- `Footer.astro` (4 — telefon, e-posta, "Gizlilik Politikası"/"KVKK" alt
  bar linkleri — ilk taramada dosya genelinde BAŞKA yerlerde zaten
  `transition-colors` olduğu için gözden kaçmıştı)
- `HeroForm.tsx` (2 — KVKK/Şartlar onay metni linkleri)
- `MegaMenu.tsx` (2 — "Sonraki raporlar" ok butonu + "gör tümü" sublist linki)
- `MobileMenu.tsx` (1 — panel kapatma butonu)
- `CalculatorAccordion.tsx` (1 — sonuç modalının kapatma butonu)

**Önemli bir netleştirme:** ilk rapordaki 8 dosyadan **7'si aslında
`hover:underline` kullanıyordu** (renk değişimi YOK, yalnızca alt çizgi
görünüyor) — `HrtechSection`, `HubTileCard`, `ProductSectionBlock`,
`SectorFeatureCard`, `SecurityPage`, `ThankYouPage`, `VideoSection`.
`text-decoration-line` CSS'te interpolasyona uygun bir özellik DEĞİL
(tarayıcılar bunu animasyonlu geçiremiyor) — yani bu 7 dosyaya
`transition-colors` eklemenin GÖRÜNÜR hiçbir etkisi olmazdı (renk zaten
değişmiyor, alt çizgi zaten anlık beliriyor — bu, site genelinde AYNI
`hover:underline` deseninin kullanıldığı 13+ başka yerle de zaten
tutarlı). Bu yüzden bu 7 dosyaya DOKUNULMADI — gerçek/görünür sorun
yalnızca yukarıdaki **renk değiştiren** 10 hover'daydı, hepsine
`transition-colors` eklenerek düzeltildi.

### 3. H1 tipografisi 3 farklı varyantta — tutarsız
Sitede H1 başlıkları üç farklı sınıf kombinasyonuyla render ediliyor:

| Grup | Class | Kullanan sayfalar |
|---|---|---|
| A (en büyük) | `...leading-tight tracking-tight ... sm:text-4xl lg:text-5xl` | `HeroSection` (ana sayfa), `HubPage`, `SectorPage`, `ProductPage` |
| B (orta) | `...leading-tight tracking-tight ... sm:text-4xl` (lg:5xl YOK) | `PricingPage`, `src/pages/blog/[slug].astro` |
| C (düz) | `...sm:text-4xl` (leading-tight/tracking-tight YOK, lg:5xl YOK) | `CalculatorsPage`, `ContactPage`, `FaqPage`, `LegalPage`, `SecurityPage`, `ThankYouPage`, `BlogListPage` |

Aynı görsel ağırlıkta olması beklenen sayfa başlıkları (ör. İletişim ile
Sektör sayfası) farklı büyüklük/satır-yüksekliğinde görünüyor.
- **Öneri:** Tek bir standart seçilip (muhtemelen Grup B — ürün/sektör
  sayfaları kadar "büyük vurgu" gerektirmeyen içerik sayfaları için makul
  bir orta nokta) Grup C'deki 7 sayfaya uygulanmalı. Grup A'nın (ürün/
  sektör/hub/hero) neden daha büyük olduğu muhtemelen kasıtlı (bu sayfalar
  "iniş sayfası" ağırlığında) — o yüzden A'yı olduğu gibi bırakıp yalnızca
  B/C'yi birleştirmek daha güvenli bir kapsam olabilir.

---

## 🟡 Orta (birkaç dosya, bir standart kararı gerektirir)

### 4. Sayfa üst bölümünün dikey padding'i iki farklı değerde
Sayfaların ana `<section>`/`<div>` sarmalayıcısının `lg:py-*` değeri
tutarsız:

| Değer | Kullanan sayfalar |
|---|---|
| `lg:py-20` | `ProductPage`, `SectorPage`, `HubPage`, `CustomerStoriesPage` |
| `lg:py-16` | `PricingPage`, `FaqPage`, `LegalPage`, `SecurityPage`, `PresentationRequestPage`, `ThankYouPage`, `ContactPage`, `BlogListPage`, Blog tekil yazı |

- **Not:** Bu muhtemelen kısmen kasıtlı — Ürün/Sektör/Hub sayfaları daha
  "zengin"/uzun içerikli, biraz daha nefes payına ihtiyaç duyabilir.
  Yine de fark (20 vs 16 = 16px fark her taraftan) yan yana
  karşılaştırıldığında fark ediliyor. Karar: ya iki grup bilinçli olarak
  KORUNUR (ve bir yorum satırıyla "neden farklı" belgelenir), ya da tek
  değere (muhtemelen 16, çoğunluk) indirgenir.

### 5. Sayfa içerik genişliği (`max-w-*`) üç farklı değerde
| Değer | Kullanan sayfalar |
|---|---|
| `max-w-7xl` | `ProductPage`, `SectorPage`, `HubPage`, `CustomerStoriesPage` |
| `max-w-6xl` | `PricingPage`, `FaqPage`, `ThankYouPage`, `ContactPage`, `PresentationRequestPage`, `BlogListPage` |
| `max-w-3xl` | `LegalPage`, `SecurityPage`, Blog tekil yazı makalesi |

- **Not:** `max-w-3xl` kısmı muhtemelen KASITLI (uzun metin bloklarının
  okunabilirliği için dar tutulması standart bir tasarım pratiği — KVKK/
  Güvenlik/blog yazısı gibi metin-ağırlıklı sayfalar). 7xl/6xl ayrımı ise
  daha az gerekçeli görünüyor (madde 4'teki aynı sayfa grubuyla örtüşüyor)
  — muhtemelen madde 4 ile BİRLİKTE tek bir "sayfa genişliği standardı"
  kararına bağlanabilir.

### 6. Scroll-reveal animasyonu YALNIZCA ana sayfada var
`src/scripts/scroll-reveal.js` yalnızca `src/pages/{index,en/index,nl/index,it/index}.astro`
dosyalarına `<script src="../scripts/scroll-reveal.js">` ile dahil
ediliyor; `.reveal` class'ı da yalnızca ana sayfaya özel bileşenlerde
kullanılıyor (`EfficiencySection`, `FeatureGrid`, `HrtechSection`,
`LogoStrip`, `PanelFeatureSection`, `SupremaSection`, `TestimonialSection`,
`VideoSection`). **Ürün, sektör, blog, fiyatlandırma, SSS sayfalarının
HİÇBİRİNDE scroll-reveal animasyonu yok** — kullanıcı sezgisi doğru
çıktı, tutarsız.
- **Kapsam notu:** Bu, madde 1-5'ten daha büyük bir iş — her sayfa
  tipinin hangi bloklarına `reveal` class'ı ekleneceğine karar vermek
  (ör. ürün sayfasının her `ProductSectionBlock`'u mu, yoksa yalnızca
  hero mu?) tasarım kararı gerektiriyor, mekanik bir class ekleme değil.
  Ayrıca script zaten `BaseLayout.astro`'da DEĞİL sayfa bazında dahil
  ediliyor — genişletmek için ya `BaseLayout`'a taşınıp global hale
  getirilmeli ya da her sayfa tipine ayrı ayrı eklenmeli (mimari karar).

---

## 🔴 Karmaşık / daha fazla araştırma gerektirir

### 7. Kart tasarımlarının gölge (shadow) stili karışık
Sitede 3 farklı gölge yaklaşımı bir arada: Tailwind'in hazır `shadow-sm`/
`shadow-md`/`shadow-lg`/`shadow-2xl` (17 kullanım) VE özel bir arbitrary
value `shadow-[0_4px_34px_rgba(0,0,0,0.07)]` (yalnızca `FeatureGrid`'de,
4 kullanım — kaynaktan birebir alınmış gerçek bir CSS değeri). Bu ikisi
görsel olarak birbirine yakın ama birebir aynı değil. Bunun bir sorun mu
yoksa kasıtlı bir kaynak-sadakati mi olduğunu belirlemek için `FeatureGrid`
dışındaki kartların da kaynakta gerçekte hangi gölge değerini kullandığı
araştırılmalı (kaynak CSS dosyaları tekrar incelenmeli) — bu yüzden
"karmaşık" kategorisinde: mevcut haliyle DEĞİŞTİRMEK kaynak-sadakatini
bozma riski taşıyor, önce doğrulama gerekiyor.

### 8. Mobilde sıkışıklık/taşma — kontrol edildi, ACİL bir sorun BULUNAMADI
Tüm sabit piksel genişlikleri (`w-[...]`/`min-w-[...]`) tarandı:
`BlogSidebar` (`lg:w-[300px]`), `CalculatorsPage` (`w-[420px]`, zaten
`hidden ... lg:block` ile korunuyor), `FaqPage` (`lg:w-[30%]`/`lg:w-[70%]`,
toplamı %100, `lg:` altında `flex-col` varsayılanına düşüyor),
`PricingPage` tabloları (`min-w-[560px]`, zaten `overflow-x-auto`
sarmalayıcı içinde) — **hepsi doğru şekilde responsive breakpoint'lerle
korunuyor, gözle görülür bir taşma riski YOK.** Bu maddeyi "karmaşık"
kategorisine koymamın nedeni: statik kod incelemesi taşma riski
bulamadı ama gerçek bir tarayıcıda (özellikle çok uzun ürün/sektör
başlıkları, Türkçe'nin İngilizce'den ortalama %20 daha uzun olma eğilimi
göz önüne alınırsa) görsel bir doğrulama yapılmadan **kesin** "sorun yok"
denemez — bir sonraki round'da gerçek tarayıcı/ekran görüntüsü ile
teyit edilmesi önerilir.

---

## Özet — önerilen uygulama sırası

1. ✅ Blog kart köşe yuvarlaklığı (`rounded-lg` → `rounded-2xl`) — TAMAMLANDI (2026-07-24).
2. ✅ Renk değiştiren hover'lara `transition-colors` eklemek — TAMAMLANDI (2026-07-24, 10 instance/8 dosya).
3. H1 tipografisini Grup B/C için birleştirmek — 7 dosya, tek class değişikliği her birinde. **← sıradaki**
4. Sayfa padding/genişlik standardını netleştirmek (madde 4+5 birlikte) — bir karar + ~10 dosya. **← sıradaki**
5. Scroll-reveal'i diğer sayfa tiplerine yaymak — mimari karar + çok sayıda dosya, en büyük kapsam.
6. Gölge stili araştırması (madde 7) ve mobil görsel doğrulama (madde 8) — sonraki round'da ele alınabilir.
