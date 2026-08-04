## Proje Durumu (son güncelleme: 2026-07-27, üçüncü tur)

**Devam: iki konu daha derinlemesine ele alındı — telefon ülke kodu listesi
site genelinde Türkçe kalmıştı (gerçek bug, düzeltildi), Müşteriler sayfası
kaynakla GERÇEKTEN karşılaştırılıp baştan tasarlandı (önceki turun kart
grid'i yanlış çıktı).**

### KONU 2 (yeniden) — Destek Talebi çevirisi: doğru çıktı, AMA site geneli
### bir bug bulundu ve düzeltildi

Kullanıcı EN/IT'nin TR kopyası kalıp kalmadığını sordu. `title`/meta/H1/
form etiketleri/buton/KVKK metni/after-form metni tek tek Playwright ile
tarandı — **hepsi zaten doğru çevrilmişti** (önceki turda doğru
yapılmıştı). Ama tarama sırasında **gerçek, site geneli bir bug** bulundu:
telefon ülke kodu seçicisindeki (`phoneCountries.ts`) **45 ülkenin adı
TÜMÜYLE sabit TÜRKÇE yazılmıştı** ("Türkiye", "Almanya", "Fransa"...) —
`PhoneCountrySelect.tsx` locale'e bakmadan bu metni doğrudan gösteriyordu.
Bu, Destek Talebi'ne özel değil, **bu component'i kullanan HER form**
(Hero formu, PanelFeatureSection'ın 2. formu, Online Sunum Talebi,
İletişim, Destek Talebi) için EN/NL/IT sitelerinde geçerliydi. Düzeltme:
`CountryPhoneDef.name` `string`'den `Record<Locale,string>`'e çevrildi, 45
ülkenin 4 dildeki gerçek adı yazıldı; `PhoneCountrySelect.tsx`'e `locale`
prop'u eklendi (+ liste artık aktif dile göre alfabetik sıralanıyor).
Playwright ile 4 dilin hepsinde (hem Destek Talebi'nde hem ana sayfa hero
formunda) ülke listesinin doğru dilde render edildiği ve TR kelime
sızması olmadığı doğrulandı.

### KONU 1 (yeniden) — Müşteriler sayfası: sistematik kaynak karşılaştırması

Kullanıcı önceki turun (3 kolonlu kart grid'i + scroll-reveal) yetersiz
kaldığını belirtip adım adım süreç istedi. Süreç:

**1. Adım — canlı siteyi Playwright ile GERÇEKTEN incele.** İlk denemede
`elementor-invisible[data-settings]` (Elementor'un scroll-animasyon
mekanizması) sayfada SIFIR bulundu — kaynakta kart/bölüm girişinde HİÇBİR
animasyon yok. Video widget'ları (`elementor-widget-video`,
`elementor-open-inline`) incelenince Femaş'ın VE Civil'in referans
videosunun kutusunun **kademeli scroll + 3sn bekleme sonrasında bile TAMAMEN
BOŞ/BOZUK** olduğu görüldü (ne thumbnail ne play butonu — kaynağın kendi
bug'ı). İlk tam sayfa ekran görüntüsünde Yatsan/Doğ-Ser/Tuğba'nın görselleri
de GÖRÜNMÜYORDU — ikinci bir denemede GERÇEK kademeli scroll (200px
adımlarla, her adımda bekleme) uygulanınca WP'nin lazy-load kütüphanesinin
düzgün tetiklendiği ve görsellerin aslında VAR olduğu ortaya çıktı.

**2. Adım — yan yana karşılaştırma, somut fark listesi:**
1. **Düzen 3 kolonlu grid DEĞİL, dönüşümlü (zigzag) tek-kolonlu bir
   dizilim** — her müşteri bloğunda görsel/video SOLDA ya da SAĞDA,
   müşteriden müşteriye değişiyor.
2. **Görseller DAİRESEL kırpılmış**, bizim `aspect-video` dikdörtgenimiz
   DEĞİL.
3. **Videolar tıkla-oynat** (Elementor'un native widget'ı) — bizim canlı
   iframe'imiz gibi DEĞİL. Kaynağın kendi kutusu bozuk/boş çıktı.
4. **Scroll-reveal animasyonu kaynakta YOK** (bizim eklediğimiz bir
   iyileştirmeydi, sourced değil — bilgi amaçlı not edildi, kaldırılmadı
   çünkü kullanıcı zaten bunu istemişti).
5. **Parallax/motion-fx YOK.**
6. **İstatistik rozetleri gerçek marka ikon GÖRSELLERİ kullanıyor**
   (`working@2x.png`/`branch@2x.png`), bizim generic SVG'imiz DEĞİL.
7. **İÇERİK, `pages.json` export'undan SONRA canlı sitede güncellenmiş**
   (büyük bulgu): Civil'in çalışan sayısı 2600→3000; **Yatsan'ın TÜM
   açıklaması + alıntısı baştan yazılmış** (yeni referans kişisi "Müzeyyen
   Kıran Mergen", yeni fotoğrafı, "6 yıl önce" ifadesi — export'taki eski
   metinle hiçbir ilgisi yok); Yatsan'ın ana görseli de yeni bir dosyaya
   değişmiş; Civil'in kendi AYRI bir ana görseli olduğu (`civil-2.png`,
   önceden hiç kullanılmıyordu — video'nun aslında Civil'in ayrı bir
   "liderlik testimonial" bloğuna ait olduğu, ana görsele değil)
   keşfedildi; Doğ-Ser'in referans kişisinin (Cem Çolak) küçük bir profil
   fotoğrafı olduğu ilk kez görüldü.

**3. Adım — her farkı tek tek kapatma (yapılan somut değişiklikler):**
- `customerStories.ts` TAMAMEN yeniden yazıldı: her müşteri artık
  `mediaSide` ('left'/'right', kaynaktaki GERÇEK sırayla elle atandı),
  `media` (image/video), opsiyonel `quotePhotoUrl`, Civil için ayrı
  `secondary` bloğu (kendi `mediaSide`/`media`/`quotePhotoUrl`'iyle).
- Yeni `src/components/YoutubeClickToPlay.tsx` (React, `client:visible`) —
  gerçek YouTube thumbnail'i (`img.youtube.com/vi/<id>/hqdefault.jpg`) +
  ortalanmış kırmızı play butonu + hover'da görsel büyütme + tıklayınca
  gerçek `autoplay=1` iframe'ine geçiş. **Kaynağın kendi kutusu bozuk
  olduğu için birebir kopyalanmadı — bilinçli bir iyileştirme** (kullanıcıya
  anlamsız boş kutu yerine ÇALIŞAN bir video kartı).
- Eski `CustomerStoryCard.astro` SİLİNDİ, yerine `CustomerStoryRow.astro`
  (zigzag satır: dairesel görsel/rounded-rectangle video SOLDA ya da
  SAĞDA + şirket adı/açıklama/alıntı/istatistik rozetleri SAĞDA/SOLDA,
  `.reveal` ile scroll-reveal korundu).
- `CustomerStoriesPage.astro` grid'den satır listesine çevrildi, Civil için
  ana blok + ayrı `secondary` bloğu art arda render ediliyor.
- i18n şeması genişletildi: `CustomerStoryLabels`'a `secondaryStat` +
  `quote: {text,name?,role?}` eklendi, yeni `civilSecondary: {quote}`
  üst-seviye anahtarı (Civil'in ayrı bloğu için), yeni `videoPlayLabel`.
  **Yatsan'ın YENİ içeriği 4 dile gerçek, kaliteli çeviriyle yazıldı**
  (KARAR 1), Civil'in çalışan sayısı 4 dilde 2600→3000 güncellendi,
  Doğ-Ser/Tuğba'nın "— İsim, Rol" olarak metne gömülü eski deseni temiz
  `quote` alanına taşındı (avatar artık düzgün render edilebiliyor).
- **Test (Playwright, geçici kurulum, iş bitince kaldırıldı):** 4
  dairesel görsel doğrulandı (Civil/Yatsan/Tuğba/Doğ-Ser), 2 play butonu
  bulundu (Femaş + Civil-secondary), tıklama sonrası gerçek YouTube
  iframe'inin yüklendiği doğrulandı, tüm görsellerin `naturalWidth>0` ile
  gerçekten yüklendiği teyit edildi, 4 dilin hepsinde H1/istatistik
  metninin doğru dilde render edildiği doğrulandı.
- **Test (genel):** `astro check` 0 hata, `astro build` 864 sayfa hatasız
  (sayfa sayısı değişmedi). Regresyon: `test-urunler-menu-links.mjs`
  108/108, `test-legal-nl-consistency.mjs` 18/18,
  `test-no-external-idenfit-links.mjs` 2320 dosyada 0 sorun.

---

**İki konu — Destek Talebi sayfası oluşturuldu (3 dil), Müşteriler sayfası
zenginleştirildi (2026-07-27, aynı gün).**

1. **KONU 1 — Destek Talebi (`/destek-talebi/`) migrate edildi.**
   Envanterde C-İKİNCİL kategorisinde (tr/en/it, NL yok) not edilmişti,
   hiç kurulmamıştı. Kaynak: `pages.json` id 16607 (tr)/16688 (en)/23686
   (it) — ACF kısmen dolu (`page_title`/`form_description`/
   `after_form_text`/`page_button_*`), form alan etiketleri + KVKK onay
   metni yalnızca Elementor `content.rendered`'da (Teşekkürler/Online Sunum
   Talebi'yle AYNI durum) — elle transkripsiyon yapıldı.
   - **Yeni component'ler:** `SupportRequestForm.tsx` (HeroForm.tsx'ten
     BİLİNÇLİ ayrı — kaynakta GERÇEKTEN farklı stillenmiş: dolu açık gri
     input `#F5F5F5`/`13px` köşe/`#E4E4E4` kenarlık, HeroForm'un beyaz/
     `3px`/`rgba(0,0,0,.6)`'sinden farklı; `textarea` alanı var; buton
     **YEŞİL** `#60A344` — sitenin kırmızı CTA konvansiyonunun kaynaktaki
     BİLİNÇLİ istisnası, olduğu gibi korundu, hepsi Playwright ile
     ölçülerek doğrulandı). Telefon alanı HeroForm'un bir önceki turda
     kurulan ülke kodu seçicisini (`phoneCountries.ts`/
     `PhoneCountrySelect.tsx`) AYNEN paylaşıyor — kod tekrarı yok.
     `SupportRequestPage.astro` (tam genişlik kırmızı hero + ortada
     `rounded-[30px]` beyaz kart, kaynakta birebir bu görsel yapı).
   - **Bulunan gerçek içerik farkı:** TR'nin KVKK onay metni kaynakta
     GERÇEKTEN 2 paragraf ("...kabul ediyorum." + "Ayrıntılı bilgi için
     KVKK sayfamızı ziyaret edebilirsiniz.", 3. bir KVKK linkiyle) — EN/IT'de
     yalnızca 1 paragraf var, 2. satır YOK (3 dilin `content.rendered`'ı
     karşılaştırılarak doğrulandı). Bu fark olduğu gibi korundu
     (`SupportKvkkNoticeLabels.secondLine` opsiyonel alan, yalnızca TR'de
     dolu) — uydurma bir 2. satır EN/IT'ye eklenmedi.
   - **"Kullanım Koşullarını"/"KVKK" linkleri kaynakta JS popup'ıydı**
     (`<span class="open-popup-terms">`, Elementor Popup Builder ile
     modal açıyor) — bizim popup builder eşdeğerimiz yok, projenin
     HeroForm'daki KVKK onay metni deseniyle AYNI şekilde GERÇEK sayfa
     linklerine (`getKvkkAndTermsHrefs()`) bağlandı.
   - **NL fallback:** `astro.config.mjs`'e `/nl/destek-talebi` →
     `/en/support-request` elle redirect'i eklendi (per-locale slug'lar
     farklı olduğu için otomatik `i18n.fallback` yetersiz — Tüketici
     Hakları/Güvenlik ailesindeki aynı desen).
   - **Ana sayfadaki "Destek Talebi İçin Tıklayın" linki — ÖNEMLİ
     BULGU: kaynakta da bizim eski sitemizde de HİÇ YOKTU** (2026-07-27'de
     idenfit.com'un anasayfası + footer'ı ham HTML'den arandı, hiçbir
     eşleşme çıkmadı — kullanıcının "muhtemelen kırık veya yanlış yerde"
     varsayımı yanlıştı, düzeltilecek bir link değil, YENİ eklenen bir
     giriş noktasıydı). Hero formunun altına (`HeroSection.astro`) yeni bir
     i18n anahtarıyla (`hero.supportRequestLink`, 4 dil) eklendi.
   - **Test:** `astro check` 0 hata, `astro build` 864 sayfa hatasız
     (+3: TR/EN/IT). Playwright (geçici kurulum, iş bitince kaldırıldı)
     ile 3 dilin hepsinde H1/buton rengi (`rgb(96,163,68)`)/hero bg
     (`rgb(255,0,0)`)/ülke kodu seçici/textarea doğrulandı, NL'in
     `/en/support-request`'e yönlendiği, ana sayfadaki yeni linkin doğru
     hedefe (`/destek-talebi/`) gittiği teyit edildi.
2. **KONU 2 — Müşteriler sayfası (`/musteriler/`) zenginleştirildi.**
   - **Scroll-reveal + hover:** Projenin mevcut `.reveal`/`scroll-reveal.js`
     mekanizması (BlogListPage.astro'dakiyle AYNI desen, index bazlı
     stagger) hero bloğuna VE 5 müşteri kartına eklendi. Kartlara
     `hover:-translate-y-1 hover:shadow-lg` (hafif yükselme + gölge artışı)
     eklendi.
   - **Görsel kırpma düzeltmesi — gerçek bir sorun bulundu.** Yatsan/
     Doğ-Ser'in ACF fotoğrafları GERÇEKTEN kare (960×960, 960×961) — kartın
     `aspect-video` (16:9) kutusuna `object-cover` ile ciddi kırpılıyordu
     (piksel boyutları indirilip ölçülerek doğrulandı). Düzeltme:
     `object-cover` → `object-contain` (yalnızca FOTOĞRAF dalında; video
     iframe'leri etkilenmedi) — ÜRÜNLER promo görselinde bu turdan önce
     uygulanan AYNI ilke (kutu sabit kalır, görsel hiç kırpılmadan
     letterbox ile gösterilir).
   - **Bulunan gerçek, önceden hiç render edilmemiş içerik: Civil ve
     Yatsan'ın ayrı referans/testimonial alıntıları.** idenfit.com/musteriler/
     canlı sitesi incelenirken (Playwright, tam sayfa ekran görüntüsü) her
     müşterinin İKİ ayrı bloktan oluştuğu görüldü: şirket açıklaması +
     AYRICA isimli bir müşteri alıntısı (ör. Civil için "Mustafa Yıldıran,
     Civil Yönetim Kurulu Başkanı" + kendi fotoğrafı + 4 paragraflık alıntı).
     Kaynağın ACF'inde bu alanlar (`civil_reference_text`/`_image`/`_`/`_role`,
     `yatsan_reference_text`/`_role`) GERÇEKTEN vardı ama önceki turlarda
     hiç extract edilmemiş/render edilmemişti (Doğ-Ser/Tuğba Kuruyemiş'in
     referans metni zaten `description`'ın kendisiydi, ayrı gösterilmiyordu
     — o ikisi doğruydu; Femaş'ta kaynakta referans alanı hiç yok — o da
     doğruydu; yalnızca Civil ve Yatsan'ın GERÇEKTEN eksik olduğu ortaya
     çıktı). **KARAR 1 (gerçek çeviri kuralı) uygulandı:** kaynağın EN/IT
     ACF metni incelendiğinde IT'nin metninin İngilizce'nin BİREBİR
     kopyası olduğu (çevrilmemiş) VE EN metninin TR'den farklı/tutarsız
     rakamlar içerdiği (ör. "2600 çalışan, 1997, 20 mağaza" vs TR'nin
     "3000+ çalışma arkadaşı, 29. yıl") görüldü — kaynağın kendi EN/IT
     metni KULLANILMADI, TR'nin zengin/doğru metninden EN/NL/IT'ye gerçek,
     kaliteli çeviri yazıldı (4 dilin hepsi). `CustomerStoryCard.astro`'ya
     opsiyonel bir `reference` bloğu eklendi (alıntı ikonu + italik metin +
     opsiyonel avatar/isim + rol) — Yatsan'ın kaynakta kişi ismi/fotoğrafı
     boş olduğu için (`yatsan_reference_name: ""`, `_image: false`)
     yalnızca departman rolüyle ("Yatsan İnsan Kaynakları") anonim
     gösteriliyor, uydurma bir isim eklenmedi.
   - **Bilinen küçük görsel etki:** Civil'in yeni 4 paragraflık alıntısı
     kartını belirgin şekilde uzattığı için (grid satırları en uzun
     kartın yüksekliğine göre eşitlendiği için) aynı satırdaki Femaş
     kartının altında biraz boşluk oluşuyor — bilinçli bir ödün (tam
     masonry/zigzag düzen kaynakta olduğu gibi kopyalanmadı, kapsam
     dışı bırakıldı, bkz. altta).
   - **Kapsam dışı bırakılan (bilinçli):** Kaynaktaki tam "zigzag" sayfa
     düzeni (her müşteri için değişen sol/sağ görsel+metin yerleşimi) —
     kullanıcının isteği görsel/animasyon iyileştirmesiydi, tam bir sayfa
     yeniden tasarımı DEĞİL; mevcut 3 kolonlu kart grid'i korundu, yalnızca
     eksik İÇERİK (referans alıntıları) eklendi.
   - **Test:** `astro check` 0 hata, `astro build` 864 sayfa hatasız
     (sayfa sayısı değişmedi — bu bir içerik/tasarım güncellemesi).
     Playwright ile: 5/5 kart bulundu, hero + kartların scroll'da
     `is-visible` olduğu, hover'da `box-shadow`'un gerçekten değiştiği,
     Civil/Yatsan'da referans alıntısının render edildiği (Civil'de isim
     "Mustafa Yıldıran" dahil), Yatsan'ın görselinin `object-fit:contain`
     olduğu doğrulandı.
- **Regresyon (her iki konu için ortak):** `test-urunler-menu-links.mjs`
  108/108, `test-legal-nl-consistency.mjs` 18/18,
  `test-no-external-idenfit-links.mjs` 2320 dosyada 0 sorun (yeni 3 Destek
  Talebi sayfası dahil) — hiçbiri etkilenmedi.

---

**Üç konu birlikte — telefon alanına çoklu ülke desteği, mega-menü rengi
kaynağa sadıklaştırıldı, TestimonialCarousel'e animasyon eklendi
(2026-07-27, aynı gün).**

1. **KONU 1 — Telefon alanı çoklu ülke desteği.** Önceki turda eklenen
   sabit "+90" öneki, idenfit.com 4 dilde (TR/EN/NL/IT) hizmet verdiği için
   TAM interaktif bir ülke kodu seçiciye genişletildi. **Kütüphane
   KURULMADI** (`react-phone-number-input`/`libphonenumber-js` — kullanıcı
   "sen karar ver" demişti): gerekçe `src/data/phoneCountries.ts`'in
   başında belgelendi — bu proje boyunca benzer durumlarda hep aynı ilke
   izlendi (bkz. bir önceki tur, `intl-tel-input` kaynakta bile var olsa
   kurulmadı), `libphonenumber-js`'in ~140KB meta verisi bir lead-capture
   formu için orantısız ağır.
   - **Yeni dosyalar:** `src/data/phoneCountries.ts` (45 ülke — dial code,
     min/max hane, TR için özel `5` ile başlama kuralı KORUNDU, diğerleri
     için yalnızca hane aralığı — kullanıcı isteği: "genel bir minimum/
     maksimum aralığı kullanılsın"), `src/components/PhoneCountrySelect.tsx`
     (`LanguageSwitcher.tsx`'teki AYNI buton+liste deseni + arama kutusu).
   - **Varsayılan ülke site diline göre:** TR→TR(+90), EN→GB(+44),
     NL→NL(+31), IT→IT(+39) — kullanıcının önerdiği eşleme birebir
     uygulandı. `HeroForm`'a yeni `locale: Locale` prop'u eklendi.
   - **Bulunan gerçek bir CSS bug'ı, düzeltildi:** Telefon kutusunun
     `overflow-hidden` sınıfı (önceki turdan, köşe yuvarlaklığını temiz
     tutmak için) ülke seçicinin absolute-positioned dropdown panelini
     KIRPIYORDU (Playwright ekran görüntüsüyle yakalandı — dropdown açık
     durumda yalnızca birkaç piksel yükseklikte görünüyordu). Düzeltme:
     `overflow-hidden` kaldırıldı (gerekli değildi — iç elemanların kendi
     arka planı yok, wrapper'ın `rounded-[3px]`i zaten temiz görünüyor).
   - **4 form da güncellendi** (bir önceki turda bulunan aynı 4 call site —
     HeroSection/PanelFeatureSection/PresentationRequestPage/ContactPage).
2. **KONU 2 — Mega-menü paneli kaynağa sadık renk aldı.** `bg-surface`
   (düz beyaz `#FFFFFF`) → yeni `--color-menu-surface: #f2f2f2` token'ı.
   Kaynak: idenfit.com'un canlı `#mega-menu` container'ının GERÇEK computed
   `background-color`'ı Playwright ile okundu — hover mekanizması headless
   modda güvenilir tetiklenmediği için (bilinen bir kısıt, bu oturumda
   keşfedildi) panel `el.style.display='block'` ile zorla görünür kılınıp
   stil okundu. **Not:** kullanıcının tahmin ettiği "krem/sıcak ton" değil,
   nötr açık gri (`rgb(242,242,242)`) — yine de düz beyazdan farklı olduğu
   için istenen "daha sıcak/davetkar" hissi veriyor. Panelin üzerindeki
   küçük kartlara (Raporlar kartları, KURUMSAL promo kartı) yeni tonun
   içinde "yüzen" bir görünüm versin diye `bg-surface` (beyaz) eklendi —
   kaynakta bu ayrım yok, katmanlı derinlik için bilinçli bir tasarım
   kararı.
3. **KONU 3 — TestimonialCarousel'e animasyon.** Fade+slide geçişi
   (300ms ease-in-out), sabit panel yüksekliği (**JS ölçüm YOK** — CSS
   Grid "stack" tekniği: tüm slaytlar `col-start-1 row-start-1` ile aynı
   hücrede üst üste, tarayıcı konteyneri otomatik en uzun slayta göre
   boyutlandırıyor), dot'ların genişlik+renk geçişi, `motion-reduce:`
   varyantı (projenin MegaMenu.tsx'te zaten kullandığı desenle birebir
   aynı), ve hover/focus'ta duraklayan 6 saniyelik otomatik geçiş
   (`prefers-reduced-motion` aktifken tamamen kapalı).
- **Test:** `astro check` 0 hata (bir kez transient Windows dosya kilidi
  hatası — `EPERM: rename .astro/content-assets.mjs.tmp` — tekrar
  denemede geçti, kalıcı bir kod sorunu değil), `astro build` 861 sayfa
  hatasız. Playwright (geçici kurulum, iş bitince kaldırıldı) ile: 4
  dilin hepsinde doğru varsayılan ülke kodu, "Hollanda" araması + seçimi
  + yeni ülkenin hane sınırının (9) doğru uygulandığı, ÜRÜNLER panelinin
  `rgb(242,242,242)` render ettiği, testimonial geçişinde panel
  yüksekliğinin BİREBİR sabit kaldığı (350px→350px), `motion-reduce`
  sınıflarının varlığı, hover sırasında + `prefers-reduced-motion`
  aktifken otomatik geçişin durduğu doğrulandı. Regresyon:
  `test-urunler-menu-links.mjs` 108/108, `test-legal-nl-consistency.mjs`
  18/18 — etkilenmedi.

---

**HeroForm.tsx'in Telefon alanına giriş kısıtlamaları + validasyon +
"+90" öneki eklendi (2026-07-27, aynı gün).** Kullanıcı 5 madde istedi;
madde 3 için önce idenfit.com'un HERO formunun (widget `43e32bd`) ülke kodu
seçici olup olmadığı canlı HTML'den kontrol edildi — **başka bir gerçek
kaynak çelişkisi bulundu**: hero formunda YOK, ama aynı sayfadaki 2. formda
(`b10b9e1`, "Kullanıcı Dostu Panel") "Country Code Field for Elementor
Form" eklentisi ile GERÇEKTEN var (`data-default-country="tr"`,
`intl-tel-input` kütüphanesi, bayrak+dial-code seçici). Bu, bir önceki
turdaki form-stili çelişkisiyle (bkz. altta) AYNI deseni tekrarladı — iki
form kaynakta farklı donatılmış. Bu kez kullanıcıya SORULMADI (önceki
turda zaten "ikisi arasında paylaşılan component, 2. formun zengin
özelliği esas alınsın" kararı verilmişti) — tutarlılık için aynı ilke
uygulandı, ama TAM intl-tel-input kütüphanesini (çok-ülkeli bayrak
seçici, yeni bağımlılık) KURMAK yerine SABİT "+90" etiketi eklendi:
gerekçe, validasyonun (madde 2) zaten yalnızca TR mobil formatını kabul
etmesi — çok-ülkeli bir seçici validasyon kapsamıyla tutarsız olurdu.
1. **Rakam-dışı filtre.** `normalizeTrPhoneDigits()` her `onChange`'de
   `\D` ile temizliyor — harf/özel karakter state'e hiç girmiyor (yazılsa
   bile anında kayboluyor, "önce görünüp sonra silinme" değil, hiç
   görünmüyor).
2. **TR format sınırı.** Aynı fonksiyon baştaki tek `0`'ı atıp 10 haneyle
   sınırlıyor — kullanıcının belirttiği HER İKİ girdi şekli de (10 hane
   `0`sız VEYA 11 hane `0`lı) aynı temiz 10 haneli state'e normalize
   oluyor (çünkü `+90` öneki zaten ülke kodunu karşılıyor, `0` gereksiz).
3. **Sabit "+90" öneki** — input'un solunda, aynı kutunun içinde ayrı bir
   segment (`<span>`), kaynaktaki plugin'in GERÇEK varsayılan ülkesiyle
   (TR) tutarlı ama kütüphanesiz/statik.
4. **Otomatik boşluklu gruplama** — `formatTrPhoneDigits()`, `555 123 45 67`
   (3-3-2-2), state'te ham rakamlar tutulup yalnızca GÖRÜNEN `value`
   formatlanıyor (klasik "controlled input formatting" deseni, kütüphane
   gerektirmedi — madde 4'ün "basitse ekle" şartı karşılandı).
5. **Submit-öncesi validasyon.** `isValidTrMobile()` (`/^5\d{9}$/`) —
   `attemptedSubmit` state'i ile İLK submit denemesine kadar hata
   gösterilmiyor (kullanıcı daha yazarken rahatsız edilmiyor), geçersizse
   `e.preventDefault()` sonrası submit engelleniyor + kırmızı kenarlık
   (`border-red-500`) + hata mesajı (`role="alert"`, yeni i18n anahtarı
   `hero.formPhoneError`, 4 dilde) gösteriliyor; kullanıcı düzelttikçe
   canlı kayboluyor.
- **Bulunan ek kapsam — HeroForm.tsx TOPLAM 4 sayfada kullanılıyor**
  (yalnızca hero + PanelFeatureSection değil): `HeroSection.astro`,
  `PanelFeatureSection.astro` (2. form), **`PresentationRequestPage.astro`**
  (Online Sunum Talebi sayfasının formu) ve **`ContactPage.astro`**
  (İletişim sayfasının formu) — hepsi aynı paylaşılan component'i
  kullandığından yeni `phoneError` label alanı `astro check`'in art arda
  yakaladığı 4 ayrı call site'a da eklendi (TypeScript'in `HeroFormLabels`
  interface'i zorunlu kıldığı için tek tek atlanmadan hepsi bulundu) —
  bu 4 sayfanın TAMAMI artık aynı telefon kısıtlamalarına/validasyonuna
  sahip.
- **Test:** `astro check` 0 hata, `astro build` 861 sayfa hatasız.
  Playwright (geçici kurulum, iş bitince kaldırıldı) ile gerçek
  tarayıcıda 8 senaryo doğrulandı: harf/özel karakter filtreleme, 14
  haneli aşırı girdinin 10 haneye kırpılması, `0`'lı 11 hanenin
  normalize edilmesi, eksik haneyle submit'in hatayı gösterip
  engellemesi (kırmızı kenarlık + mesaj), düzeltince hatanın kaybolması,
  geçerli submit'in konsola `+905551234567` biçiminde tam numara
  loglaması, `+90` önekinin göründüğü, VE **2. formun (PanelFeatureSection,
  `client:visible`) da aynı filtrelemeyi yaptığı** (ilk denemede hydration
  gecikmesi yüzünden yanlış-negatif çıktı, 1sn bekleme sonrası PASS).
  4 dilin hepsinde `+90` öneki ve doğru dildeki hata metni `curl` ile
  doğrulandı. Regresyon: `test-urunler-menu-links.mjs` 108/108,
  `test-legal-nl-consistency.mjs` 18/18 — etkilenmedi.

---

**Ana sayfa hero bölümünde iki iyileştirme — kırmızı panel genişletildi,
form alanları kaynaktaki gerçek "dolgun" stille değiştirildi (2026-07-27,
aynı gün).** Kullanıcı 2 konu istedi; KONU 2 için önce canlı idenfit.com
Playwright ile (geçici kurulum) computed style üzerinden incelendi —
**önemli bir kaynak çelişkisi bulundu ve kullanıcıya soruldu**: hero formu
ile aynı component'i paylaşan PanelFeatureSection'daki 2. form ("Kullanıcı
Dostu Panel" bölümü) kaynakta GERÇEKTEN farklı stillenmiş — hero'nun kendisi
şeffaf zemin + yalnızca alt çizgi (`border-bottom:2px #D9D9D9`) kullanırken,
2. form dolu beyaz zemin + tam ince kenarlık (`1px solid rgba(0,0,0,.6)`)
kullanıyor. Kullanıcı **2. formun ("dolgun") stilini** seçti (3 seçenekten:
kaynağa-tam-sadık/hero-stili, panel-formu-stili, kullanıcının orijinal
"gri zemin" tarifi) — hem kaynakta gerçekten var olan bir desen hem
kullanıcının "dolgun/şık" hedefiyle örtüşüyordu.

1. **KONU 1 — kırmızı panel genişletildi.** `HeroSection.astro`'daki
   `lg:grid-cols-2` (eşit 50/50 — kaynakta da GERÇEKTEN 640/640px eşit,
   Playwright ile doğrulandı) → `lg:grid-cols-[1fr_1.25fr]` (sağ panel
   sol formdan %25 daha geniş) — **kaynaktan BİLİNÇLİ sapma**, kullanıcının
   "daha etkileyici görünsün" talebiyle. Dashboard mockup görselinin
   `max-w-sm` (384px) sınırı `max-w-lg`'ye (512px) çıkarıldı ki panel
   büyüyünce görsel de onunla orantılı büyüsün (aksi halde yalnızca
   etrafında boşluk artardı). Mobilde (`lg` altı) etkisiz — tek kolon
   yığılma değişmedi.
2. **KONU 2 — form alanları "dolgun" (2. formun gerçek) stiline
   çevrildi.** `HeroForm.tsx`'in paylaşılan `inputClass`'ı:
   `rounded-md border border-gray-300` (6px köşe, açık gri kenarlık, şeffaf
   zemin) → `rounded-[3px] border border-[rgba(0,0,0,0.6)] bg-white`
   (kaynağın birebir ölçüleri: 3px köşe, %60 opak siyah kenarlık, beyaz
   dolgu). Padding `px-4 py-3` → `px-3.5 py-2.5` (kaynağın `14px`
   yatayına yakın, dikeyde kaynağın aşırı sıkışık `5px`'i yerine sitenin
   14px font ölçeğiyle orantılı bir değer — birebir kopyalama font boyutu
   uyuşmazlığından dolayı kötü görünürdü). Focus rengi değişimi
   (`focus:border-brand` + halka) korundu — kaynakta bu mikro-detay
   neredeyse yok (yalnızca çok hafif iç gölge) ama mevcut UX iyileştirmesi
   kaynaktan sapma değil, bilinçli bir ekleme olarak bırakıldı.
   `PanelFeatureSection`'daki 2. form (`idPrefix` ile aynı component'i
   kullanıyor) **otomatik güncellendi** — kontrol edildi, kaynaktaki
   kendi gerçek stiliyle şimdi birebir örtüşüyor (tesadüf değil, zaten o
   formun stili esas alındı).
- **Test:** `astro check` 0 hata, `astro build` 861 sayfa hatasız
  (sayfa sayısı değişmedi). Playwright (geçici kurulum, iş bitince
  kaldırıldı) ile 4 dilin (TR/EN/NL/IT) hepsinde grid oranının tam `1.25`
  olduğu, input'ların `1px solid rgba(0,0,0,0.6)` + `3px` köşe + beyaz
  zemin render edildiği doğrulandı; hem hero formu hem PanelFeatureSection'daki
  2. form (`input[name=fullName]` × 2 bulundu) aynı stile sahip. Mobil
  (390px) ekran görüntüsüyle responsive'in bozulmadığı (tek kolon yığılma,
  form kutuları düzgün) teyit edildi. Regresyon: `test-urunler-menu-links.mjs`
  108/108, `test-legal-nl-consistency.mjs` 18/18 — etkilenmedi.

---

**İki görsel iyileştirme daha — ÜRÜNLER promo görseli büyütüldü, SEKTÖRLER'in
12 ikonu rozet stiline çevrildi (2026-07-27, aynı gün).**

1. **ÜRÜNLER promo görseli büyütüldü.** `h-24 w-24 rounded-full object-cover`
   (96px, CSS'in kendisi görseli daireye zorlayarak kırpıyordu) →
   `aspect-square w-full object-contain` (220px'e çıktı, kutunun oranı
   görselin gerçek 1:1 oranıyla (590×590) birebir eşleştiği için hem TAM
   görsel görünüyor hem letterbox boşluğu yok). Yakın çekimle doğrulandı:
   görselin KENDİSİ zaten dairesel bir portre fotoğrafı (pembe köşe
   arkaplanıyla) — CSS artık bu içeriği KIRPMIYOR, olduğu gibi gösteriyor.
2. **SEKTÖRLER'in 12 ikonu ÜRÜNLER'in ikon-kutu stiliyle tutarlı hale
   getirildi.** Önceden düz, arkaplansız küçük lucide-react ikonlardı
   (`h-4 w-4 text-brand`) — artık ÜRÜNLER'in `UserIcon`/`ClockIcon` vb.
   ikonlarındaki dolu marka-kırmızısı daire + beyaz ikon deseniyle BİREBİR
   tutarlı bir rozet içinde (`h-9 w-9 rounded-full bg-brand text-white`,
   ikon boyutu `h-4 w-4`→`h-5 w-5`e büyütüldü). `MegaMenu.tsx`'in Column
   bileşeninde (masaüstü) VE `MobileMenu.tsx`'in akordeon panelinde
   (`h-7 w-7`, mobil için biraz küçük) uygulandı — yalnızca SEKTÖRLER'in
   link-seviyesi ikonlarını etkiliyor (ÜRÜNLER'in modül linklerinde
   link-seviyesi ikon hiç yok, yalnızca kolon-seviyesi ikonlar var, o
   ayrı render ediliyor, etkilenmedi).
- **Test:** `astro check` 0 hata, `astro build` 861 sayfa hatasız. Playwright
  (geçici kurulum, iş bitince kaldırıldı) ile 4 dilin (TR/EN/NL/IT) hepsinde
  ÜRÜNLER promo görselinin `220×220` render edildiği (`object-fit:contain`,
  natural `590×590` ile birebir oranlı), SEKTÖRLER'de 12/12 rozetin
  bulunduğu ve arkaplan renginin `rgb(255,0,0)` (marka kırmızısı) olduğu
  doğrulandı; mobil akordeonda da rozet stilinin doğru göründüğü ekran
  görüntüsüyle teyit edildi. Regresyon: `test-urunler-menu-links.mjs`
  108/108, `test-legal-nl-consistency.mjs` 18/18 — etkilenmedi.

---

**⚠️ DÜZELTME — KURUMSAL promo kartının görseli üstten kırpılıyordu, aynı gün
düzeltildi (2026-07-27).** Aşağıdaki günlükte kurulan `promoCardMode`'un
görseli `h-24 w-full object-cover` kullanıyordu — sabit 96px yükseklik,
görselin gerçek oranından (900×809, ~1,11:1) çok daha geniş/kısa bir kutuya
zorluyordu, bu da `object-cover`'ın kutuyu doldururken görseli üstten/alttan
ağır kırpmasına yol açtı (kullanıcı bulgusu — logo ve karakterlerin üst
kısmı kesiliyordu). **Düzeltme:** `MegaMenu.tsx`'teki promo kart görseline
sabit yükseklik yerine görselin gerçek oranıyla birebir eşleşen
`aspect-[900/809]` + `object-contain` verildi — kutu artık görselin doğal
oranına göre şekilleniyor, hiç kırpma YOK, oranlar birebir eşleştiği için
letterbox boşluğu da yok. Playwright ile (geçici kurulum, iş bitince
kaldırıldı) doğrulandı: render edilen kutunun aspect oranı (1,1125) görselin
natural oranıyla (1,1125) birebir eşleşiyor, `object-fit: contain`
doğrulandı, yakın çekim ekran görüntüsünde görselin TAMAMI (ayakkabılardan
sağ üstteki idenfit logosuna kadar) görünüyor. `astro check` 0 hata.

**KURUMSAL mega-menüsüne sağ tarafta görsel+kategori+başlıklı bir promo kart
eklendi — kaynakta YOK, kullanıcının kendi sağladığı görselle bilinçli yeni
özellik (2026-07-27).** 2026-07-24'te KURUMSAL "kompakt dropdown"a
çevrilmişti (bkz. aşağıdaki "⚠️ Önceki DÜZELTME" günlüğü — kaynakta zengin
kolon içeriği/promo olmadığı için). Bu turda kullanıcı, ÜRÜNLER'in promo
panelini REFERANS alarak (aynı bileşen değil, aynı YERLEŞİM fikri) KURUMSAL'a
kendi görseliyle (`C:\idenfit\idenfit-image.png`, kullanıcının kendi sağladığı
bir illüstrasyon — iki 3D karakter + idenfit logosu) bir promo kart eklenmesini
istedi: sağ tarafta görsel + kategori etiketi + başlık + ilgili sayfaya link.
- **Hedef sayfa + metin kararı:** Kullanıcıya soruldu — kart Hakkımızda
  sayfasına link veriyor (kullanıcı seçimi, 3 seçenek arasından: Hakkımızda/
  Hedef Global Marka/Neden idenfit). Kategori etiketi + başlık metni Claude
  tarafından önerildi (kullanıcı onayı gerekmeden, "ben yazayım" seçildi):
  TR "KURUMSAL" / "idenfit Ailesiyle Tanışın", EN "CORPORATE" / "Meet the
  idenfit Team", NL "ZAKELIJK" / "Maak kennis met het idenfit-team", IT
  "AZIENDALE" / "Conosci il team idenfit".
- **Görsel optimizasyonu:** Orijinal PNG 4,2 MB idi (2050×1842) — `sharp` ile
  elle 900px genişliğe küçültülüp webp'e (q82) çevrildi, `src/assets/
  kurumsal-promo-team.webp` (~28 KB, >%99 küçülme). Proje genelindeki
  hotlink edilmiş uzak görsellerden (idenfit.com) FARKLI olarak bu YEREL bir
  asset — `navigation.ts`'te (plain `.ts` dosyası, `.astro` değil) doğrudan
  import edilip Vite/Astro'nun asset pipeline'ından geçiyor (`.src` alanı
  kullanılıyor, `ImageMetadata` tipi — `astro/client` tipleri sayesinde).
  `astro build` sonrası `dist/_astro/kurumsal-promo-team.<hash>.webp` olarak
  doğru şekilde hash'lenip bundle edildiği doğrulandı (dev'deki `/@fs/...`
  yolunun prod'a sızmadığı teyit edildi).
- **Mimari — yeni bir üçüncü mega-menü modu.** `promoCard` alanı (`ReportCard`
  tipiyle AYNI şekli kullanıyor — kategori+başlık+görsel+href — Raporlar
  kartlarıyla aynı desen, ÜRÜNLER'in `promo` alanından FARKLI/bağımsız).
  `MegaMenu.tsx`'e üçüncü bir render modu eklendi (`promoCardMode`): KURUMSAL
  gibi tek düz link listesi kolonuna sahip bir menüde `promoCard` de
  tanımlıysa, ne 2026-07-24'ün dar kompakt dropdown'u (`singleLinksColumn`)
  ne ÜRÜNLER'in tam-viewport-genişliği paneli kullanılıyor — `<li>`'ye göre
  konumlanan (`inset-x-0` DEĞİL), 420px sabit genişlikte, sol linkler+sağ
  kart yan yana yerleşimli ORTA boy bir dropdown. `MobileMenu.tsx`'in
  akordeon paneline de eklendi (Raporlar kartlarıyla aynı kompakt satır
  tasarımı) — önceki günlükte ÜRÜNLER'in promo kutusunun "kendi sayfasına
  özgü linki olmadığı için" mobilde kasıtlı render edilmediği not edilmişti,
  ama bu YENİ kart GERÇEK bir sayfaya (Hakkımızda) link taşıyor, bu yüzden
  masaüstü/mobil parite bilinçli olarak korundu (yarım özellik bırakılmadı).
- **Test:** `astro check` 0 hata, `astro build` 861 sayfa hatasız (sayfa
  sayısı DEĞİŞMEDİ, bu bir menü güncellemesi). Playwright (geçici kurulum,
  iş bitince kaldırıldı) ile masaüstü (TR+EN, gerçek hover ile açılıp
  görselin `naturalWidth>0` yüklendiği, kart href'inin doğru sayfaya
  gittiği, tıklayınca GERÇEK Hakkımızda sayfasına (`/hakkimizda/`,
  `/en/about/`) navigate ettiği) ve mobil (TR, akordeon içinde görsel
  yükleniyor) gerçek tarayıcıda doğrulandı; ÜRÜNLER panelinin hâlâ tam
  genişlikte (1280px, regresyon yok) kaldığı ayrıca kontrol edildi. `curl`
  ile 4 dilin hepsinde (TR/EN/NL/IT) doğru görsel yolu+kategori+başlık+href
  render edildiği teyit edildi. Regresyon: `test-urunler-menu-links.mjs`
  108/108, `test-legal-nl-consistency.mjs` 18/18 — etkilenmedi.

---

**3 görsel ince işçilik maddesi daha — marquee bar inceltildi, Suprema
bölümüne gerçek tilt-shape-divider bant eklendi, hero'ya şerit
eklenMEDİ (kaynakta yok) (2026-07-24).** Kullanıcı 3 estetik iyileştirme
istedi; her biri için önce canlı idenfit.com incelendi (`curl` + derlenmiş
Elementor CSS), sonra uygulandı.

1. **Marquee bar inceltildi.** `MarqueeBar.tsx`'teki her modül span'inin
   `py-2` (16px dikey padding) → `py-1.5`'e (12px) düşürüldü, font boyutu
   değişmedi. Kaynak sitede bu barın kendi CSS'i incelenmedi (basit bir
   estetik tercih talebiydi, kaynak-bağımlı bir doğrulama gerektirmiyordu).
2. **Hero'ya şerit EKLENMEDİ — kaynakta yok, doğrulandı.** Canlı ana
   sayfanın hero bölümünü saran container'ın (`elementor-element-955e842`,
   `hero-banner-section`) derlenmiş CSS'i (`post-25148.css`) incelendi:
   arka plan düz `background-color:#F8F8F8`, `background-image` YOK,
   `elementor-shape`/shape-divider YOK. Kaynakta hero'nun arkasında
   hiçbir dekoratif şerit/bant/renk geçişi bulunmuyor — bu yüzden
   uydurma bir şerit eklenmedi (bkz. bir önceki turdaki "kaynak
   dürüstlüğü" dersi — var olmayan bir şeyi "muhtemelen vardır" diye
   eklemek yerine, yokluğu doğrulayıp kullanıcıya raporlamak tercih
   edildi).
3. **Suprema bölümüne gerçek tilt-shape-divider bant eklendi.** Canlı
   sitede "Temassız Tanımlama & Geçiş Sistemleri" (Suprema) bölümünü
   saran container'ın (`elementor-element-c831f91`, `id="section-tilt"`)
   derlenmiş CSS'i (`post-9.css` — asıl Ana Sayfa post'u, `post-25148.css`
   yalnızca hero'yu içeren AYRI bir gömülü şablon) incelendi: tam
   genişlikte açık gri (`#EDEDED`) bir zemin + üstte VE altta 20px
   yükseklikte "tilt" (eğik kesim) shape divider (`M0,6V0h1000v100L0,6z`
   path'i, Elementor varsayılanı beyaz dolgu, alt divider üsttekinin
   180° döndürülmüş hali). Kaynağın kendi custom CSS'i
   (`@media(max-width:1024px){ #section-tilt .elementor-shape{display:none} }`)
   bu divider'ı yalnızca masaüstünde gösteriyor — Tailwind'in `lg`
   breakpoint'i (1024px) ile birebir örtüştüğü için `hidden lg:block`
   kullanıldı. `SupremaSection.astro` tam genişlikte (`relative
   overflow-hidden bg-[#EDEDED]`) bir `<section>`'a sarıldı, iki mutlak
   konumlu SVG divider (üstte/altta) eklendi, iç içerik (grid + form
   linkleri) aynı kaldı.

**Test:** `astro check` 0 hata, `astro build` 861 sayfa hatasız,
`test-no-external-idenfit-links.mjs` 2313 dosyada 0 sorun. `curl` ile
TR/EN/NL/IT'nin dördünde de (SupremaSection paylaşılan component
olduğundan) tam olarak 2 tilt-path + `bg-[#EDEDED]` render edildiği
doğrulandı; marquee'nin yeni `py-1.5` sınıfı 10 span'in hepsinde
(5 modül × 2 kopya) görüldü. Dev server logları temiz.

**⚠️ DÜZELTME — bir önceki turda footer'ın "Gizlilik Politikası" linki
YANLIŞ sayfaya bağlanmıştı; gerçek sayfa migrate edilip düzeltildi
(2026-07-24, aynı gün).** Aşağıdaki "Footer ... tam sadık" girdisindeki
KONU 1 ve KONU 2, **Güvenlik sayfasıyla (`/guvenlik/`, 6 hukuki belgeye
link veren LİSTE sayfası) Gizlilik ve Güvenlik Politikası makalesini
(`/sozlesme/gizlilik-ve-guvenlik-politikasi/`, gerçek paragraf içerikli
AYRI bir sayfa) yanlışlıkla AYNI sayfa sanmıştı** — kullanıcı canlı
sitede ikisine de tıklayıp FARKLI başlık/içerik gösterdiklerini
kanıtlayarak düzeltti. Kök hata: "kaynak dürüstlüğü" ilkesini yanlış
uyguladım — bir linkin 404 vermeyip GEÇERLİ bir sayfaya gitmesini
(`/guvenlik/`, H1 "Güvenlik") "doğru sayfaya gidiyor" ile eş tuttum,
oysa varış sayfasının GERÇEK İÇERİĞİNİ kaynaktaki makaleyle
karşılaştırmadım. **Gerçek durum:** `/sozlesme/gizlilik-ve-guvenlik-politikasi/`
hiç migrate edilmemiş, gerçekten eksik bir sayfaymış (CLAUDE.md'nin daha
ESKİ bir sürümünde bu zaten "§Açık noktalar" altında doğru şekilde not
edilmişti — "footer'da linkleniyor ama sayfası henüz yok" — bu notu
gözden kaçırıp konuyu yanlış kapatmışım).
- **Gerçek düzeltme:** Sayfa `reference/wordpress-export/pages.json`'da
  bulundu (id 16258/tr, 16265/en, 23634/it — NL yok), standart `page` post
  type'ında, tek bir ACF `content_block` alanı (KVKK/Tüketici Hakları'yla
  AYNI `legal` şeması) — gerçek, TAM (6-6.5KB) 3 dilde paragraf içeriği
  (Kişisel Verilerin Toplanması / Kredi Kartı Güvenliği / SSL Güvenliği /
  Çerezler vb. 12 alt başlık). `scripts/extract-misc-pages.mjs`'e
  `group('sozlesme/gizlilik-ve-guvenlik-politikasi', 'legal', extractLegal)`
  eklenip yeniden çalıştırıldı, `miscPagesContent.ts`'e KVKK'yla aynı
  desende `getPrivacySecurityContent()`/`getPrivacySecuritySlug()`/
  `getPrivacySecurityLocaleUrls()` eklendi (IT'nin ham WP `title` alanı
  junk — "Privacy and Security Policy_IT" — KVKK_IT_TITLE'daki aynı
  düzeltme burada da uygulandı, `content_block`'un kendisi zaten gerçek
  İtalyanca). 3 yeni route (`sozlesme/gizlilik-ve-guvenlik-politikasi`,
  `en/contract/privacy-and-security-policy`,
  `it/contratto/politica-privacy-e-sicurezza`, `LegalPage.astro`
  yeniden kullanıldı) + NL için elle redirect
  (`astro.config.mjs` → `/en/contract/privacy-and-security-policy`, aynı
  KVKK/Tüketici Hakları deseni). Footer'ın `securityPolicy` (GENEL kolonu)
  VE alt bar `privacy` linkleri artık ikisi de `getPrivacySecuritySlug()`'a
  bağlı; About kolonundaki kısa "Güvenlik" linki değişmedi, hâlâ doğru
  şekilde `getSecuritySlug()` (`/guvenlik/`) kullanıyor.
- **Site geneli tarama:** `getSecuritySlug`/`SECURITY_TR_SLUG`/`Gizlilik`
  için grep yapıldı — form KVKK onay metinleri (`getKvkkAndTermsHrefs()`,
  `HeroForm.tsx`) zaten KVKK+Tüketici Hakları'na gidiyor, bu ikisiyle hiç
  karışmamış; `navigation.ts`'teki tek "güvenlik" eşleşmesi tamamen
  ilgisiz bir sektör sayfası (`guvenlik-sektoru-ik-cozumleri`); Güvenlik
  listesinin kendi 6 maddesi (PDF'ler) bu sayfaya hiç link vermiyor —
  başka bir karışıklık bulunmadı, yalnızca footer'ın 2 linki etkiliydi.
- **Test:** `astro check` 0 hata, `astro build` 861 sayfa hatasız
  (3 yeni sayfa: TR/EN/IT). `curl` ile 3 yeni route 200, NL 301 ile doğru
  EN hedefine gidiyor doğrulandı; TR/EN/IT sayfalarının `<title>`/`<h1>`'i
  ("Gizlilik ve Güvenlik Politikası" / "Privacy and Security Policy" /
  "Politica sulla Privacy e Sicurezza") ve gerçek paragraf içeriği
  (`Kişisel Verilerin Toplanması` vb.) doğrulandı. TR anasayfa footer'ında
  `/guvenlik/`'e tam olarak 1 (About kolonu), `/sozlesme/gizlilik-ve-guvenlik-politikasi/`'ye
  tam olarak 2 (GENEL kolonu + alt bar) href sayıldı — karışıklık kalmadı.
  Regresyon: `test-legal-nl-consistency.mjs` 18/18,
  `test-no-external-idenfit-links.mjs` 2313 dosyada 0 sorun,
  `test-urunler-menu-links.mjs` 108/108 — hiçbiri etkilenmedi. `astro.config.mjs`
  düzenlendiği için `npm run dev:clean` ile tam restart yapıldı (soft-restart'a
  güvenilmedi), loglar temiz.
- **Ders (kalıcı):** "Link 404 vermiyor, geçerli bir sayfaya gidiyor"
  YETERLİ doğrulama DEĞİL — iki sayfanın GERÇEKTEN aynı içerik olduğunu
  iddia etmeden önce başlık/H1/gövde metnini karşılaştırmak gerekir,
  özellikle kullanıcının kendisi "bunlar iki farklı sayfa" diye net bir
  ayrım tarif ettiğinde. Ayrıca CLAUDE.md'nin "Açık noktalar" bölümündeki
  eski bir notu ("sayfası henüz yok") yeni bir çalışmaya başlamadan önce
  yeniden kontrol etmeden "zaten çözülmüş" varsaymak bu hataya yol açtı.

**Footer, idenfit.com'un canlı footer'ına tam sadık hale getirildi — 5
konu, hepsi çözüldü (2026-07-24).** Kullanıcı canlı sitenin footer'ıyla
birebir karşılaştırma istedi. Canlı `<footer>` yeniden çekilip (`curl`)
tam olarak incelendi — 5 gerçek bulgu/eksik çıktı, hepsi düzeltildi:

1. **⚠️ BU MADDE YANLIŞTI, aynı gün düzeltildi — bkz. yukarıdaki "⚠️
   DÜZELTME" girdisi.** KIRIK "Gizlilik Politikası" linki — kök neden
   bulundu ve düzeltildi (İDDİA EDİLEN, gerçekte YANLIŞ):
   `FOOTER_BOTTOM_LINKS.privacy` sabit bir bare slug'a
   (`sozlesme/gizlilik-ve-guvenlik-politikasi`) sahipti — bu, kaynak
   WordPress sitesinin HAM URL yapısıydı (`idenfit.com/sozlesme/...`),
   ama BİZİM migrasyonumuzda bu içerik farklı/kısa bir route'a
   (`guvenlik`/`security-policy`/`politica-di-sicurezza`, `SecurityPage.astro`)
   taşınmıştı — link bu yüzden 404 veriyordu. Düzeltme: `FOOTER_BOTTOM_LINKS`
   objesi tamamen kaldırıldı (zaten kısmen ölü kodtu — KVKK linki her
   zaman `SPECIAL_HREFS.kvkk`'yı kullanıyordu, `privacy` ise hiç doğru
   çözülmüyordu), her iki alt bar linki de doğrudan `SPECIAL_HREFS.security`/
   `SPECIAL_HREFS.kvkk`'ye (`getSecuritySlug()`/`getKvkkSlug()`, zaten var
   olan doğru per-locale çözücüler) bağlandı. Playwright ile GERÇEK tıklama
   testiyle doğrulandı: TR'de `/guvenlik/` (H1: "Güvenlik"), EN'de
   `/en/security-policy/` (H1: "Security") açılıyor.
2. **GENEL kolonuna eksik link eklendi (madde başlığı doğru, HEDEF
   YANLIŞTI — düzeltildi, bkz. yukarıdaki "⚠️ DÜZELTME").** Canlı GENEL
   kolonu tam olarak 7 link içeriyor (sıraya göre: Fiyatlar ve Modüller,
   idenfit Avantajları, Başarı Hikayeleri, SSS, Tüketici Hakları
   Sözleşmesi, **Gizlilik ve Güvenlik Politikası**, Mesafeli Satış
   Sözleşmesi) — bizim kolonumuzda 6.'sı eksikti. Yeni `securityPolicy`
   anahtarı eklendi (`FooterGeneralLinks` i18n tipi + 4 dil) — ~~About
   kolonundaki kısa "Güvenlik" linkiyle AYNI sayfaya gidiyor~~ (YANLIŞ
   varsayım, gerçekte ayrı bir sayfa, artık `getPrivacySecuritySlug()`'a
   bağlı).
3. **Eksik sosyal medya ikonları + YANLIŞ sıra düzeltildi.** Kaynakta 7
   platform var (bizde 5'i vardı, sırası da FARKLIYDI): gerçek sıra
   Facebook → YouTube → X → Instagram → LinkedIn → **Pinterest** →
   **Medium**. Pinterest (`pinterest.com/idenfit`) ve Medium
   (`medium.com/@idenfit`) gerçek hesap URL'leri + gerçek Font Awesome
   SVG path'leri (canlı HTML'den birebir çıkarıldı) eklendi, `FOOTER_SOCIAL`
   dizisi kaynak sırayla yeniden yazıldı.
4. **Uygulama mağazası rozetleri eklendi.** Kaynakta sosyal ikonların hemen
   altında, aynı stilde (küçük dairesel ikon rozeti, büyük "Download on
   the App Store" grafiği DEĞİL) Apple + Android ikonları var. Gerçek
   linkler bulundu: Android → `play.google.com/.../com.globme.timeware`
   (idenfit'in kendi PDKS/zaman-takip uygulaması, "Globme" isimli yazılım
   sağlayıcısının paketi altında yayınlanmış); iOS → kaynakta da bir
   "developer" profili linkine gidiyor (`apps.apple.com/tr/developer/globme/...`)
   — App Store'da uygulamanın kendi ayrı sayfası yok, bu kaynağın kendi
   davranışı, bizim hatamız değil. Yeni `FOOTER_APPS` + `APP_ICON_PATHS`
   (çok-path'li SVG desteği, `SOCIAL_ICON_PATHS`'ten ayrı tutuldu).
5. **Ödeme yöntemi ikonları eklendi.** Kaynakta GENEL kolonunun sağında
   (kullanıcının tarifiyle örtüşüyor) ayrı bir bölümde iyzico/Troy/Visa/
   Mastercard/American Express rozetleri TEK bir görsel olarak duruyor.
   Kaynakta biri yatay (mobil, 718×57) biri dikey (masaüstü, 386×800) iki
   versiyon var — dikey versiyon footer'da aşırı dikey yer kaplayacağı
   için BİLİNÇLİ olarak yalnızca yatay/kompakt versiyon kullanıldı (her
   iki görünümde de). Gerçek görsel hotlink edildi
   (`Group-1365420300-2.webp`), GENEL kolonunun altına eklendi (5 kolonlu
   bir grid'e geçmeden "sağ tarafta" hissini koruyacak şekilde — kaynakta
   teknik olarak AYRI bir 5. flex-child ama görsel olarak GENEL'in
   sağında/altında).

**Test:** `astro check` 0 hata, `astro build` 858 sayfa hatasız,
`test-no-external-idenfit-links.mjs` 2306 dosyada 0 sorun, tüm regresyon
testleri (108/18/36/9/56) geçti. Playwright (geçici kurulum, iş bitince
kaldırıldı) ile masaüstü + mobil footer görsel olarak doğrulandı, TR/EN
bottom-bar linklerinin GERÇEKTEN doğru sayfaya gittiği tıklama testiyle
kanıtlandı. Tüm yeni dış URL'ler (Pinterest/Medium/App Store/Google
Play/ödeme görseli) canlı doğrulandı — Medium'un `curl`'e 403 dönmesi
yalnızca bot-engelleme (tarayıcı User-Agent'ıyla 301, gerçek kullanıcılar
için sorunsuz).

**⚠️ Önceki DÜZELTME — müşteri kartlarındaki logo değişikliği GERİ ALINDI
(yanlış varsayımdı) + KURUMSAL mega-menüsü kompakt dropdown'a çevrildi
(2026-07-24).**

- **KONU 1 (geri alma):** Bir önceki turda "ACF görselleri mağaza/şantiye
  fotoğrafı, gerçek logo değil" tespiti YAPILMIŞTI ve bunun üzerine
  YANLIŞ bir varsayımla (bu fotoğrafların "hata" olduğu, logo konması
  gerektiği) idenfit.com'un medya kütüphanesinden ayrıca bulunan gerçek
  logo dosyaları (`yatsan.webp`, `dogser-makina.webp`) konmuştu. Kullanıcı
  bunun yanlış bir varsayım olduğunu, o gerçek fotoğrafları istediğini
  belirtti — **geri alındı.** `customerStories.ts`'teki `logoUrl` alanı
  `photoUrl`'e çevrildi, değerleri /musteriler/ sayfasının kendi ACF
  görsellerine (`yatsan_image`→`2@2x-4-1.png`, `dog-ser_image`→
  `dogser@2x.png`, `tugba_kuruyemis_image`→`tugbakuruyemis.jpeg`) geri
  döndürüldü. `CustomerStoryCard.astro`'nun render tarzı da fotoğrafa
  uygun hale getirildi (`object-contain` + `p-10` padding yerine
  video-kartlarıyla TUTARLI `object-cover`, tam kare dolduruyor — logo
  değil gerçek fotoğraf olduğu için görsel nefes payı gerekmiyor).
  Femaş/Civil'in video kartlarına dokunulmadı. **Ders:** kaynak veriyi
  "hatalı/yanlış konmuş" varsaymadan önce kullanıcıya sorulmalı — burada
  veri hiç yanlış değildi, yalnızca beklenmedik bir içerik türüydü
  (fotoğraf, logo değil).
- **KONU 2 (yeni özellik):** KURUMSAL menüsü (4 basit link — Hakkımızda/
  İletişim/S.S.S/Hedef Global Marka, zengin kolon içeriği yok) artık
  ÜRÜNLER/SEKTÖRLER gibi tam genişlik mega-menü panel DEĞİL, tetikleyici
  butonun hemen altında, yalnızca içerik kadar geniş (`min-w-[200px]`)
  küçük bir dropdown. `MegaMenu.tsx`'e yeni bir "kompakt mod" eklendi —
  koşul: `intro`/`promo` yok VE tek kolon VE o kolon `type:'links'` VE
  `layout` `'list'` (veya tanımsız, yani varsayılan). Bu koşulla site
  genelinde TARANDI — yalnızca KURUMSAL uydu. SEKTÖRLER de tek kolon ama
  `layout:'grid-3'` (12 öğelik grid) olduğu için KASITLI OLARAK tam
  genişlikte bırakıldı (grid'in nefes almak için gerçekten genişliğe
  ihtiyacı var). ÜRÜNLER/KEŞFET zaten çok kolonlu, etkilenmedi. NEDEN
  IDENFIT/FİYATLAR/MÜŞTERİLER'in zaten mega-menüsü yok (düz link).
  Playwright ile ölçüldü: KURUMSAL paneli tam `200px` genişlik (viewport
  içinde taşmadan), ÜRÜNLER/SEKTÖRLER hâlâ `1280px` (tam viewport
  genişliği, değişmedi).
- **Test:** `astro check` 0 hata, `astro build` 858 sayfa hatasız,
  `test-no-external-idenfit-links.mjs` 2306 dosyada 0 sorun, tüm
  regresyon testleri geçti. Playwright ile (geçici kurulum, iş bitince
  kaldırıldı) hem geri alınan fotoğrafların doğru yüklendiği
  (`naturalWidth` kontrolü) hem KURUMSAL'ın kompakt/ÜRÜNLER-SEKTÖRLER'in
  tam genişlik kaldığı görsel olarak doğrulandı.

**KONU 1 — Müşteri kartlarındaki "Video yakında" gerçek logolarla
değiştirildi; KONU 2 — mobil hamburger menüsü zaten doğru çalışıyordu,
test kanıtıyla doğrulandı (2026-07-24).**

- **KONU 1:** Yatsan/Doğ-Ser Makina/Tuğba Kuruyemiş kartlarındaki "Video
  yakında" yazısı kaldırılıp yerine gerçek marka logoları (video alanının
  boyutunda, `object-contain`) eklendi. `/musteriler/` sayfasının kendi
  ACF görselleri (`yatsan_image`/`dog-ser_image`/`tugba_kuruyemis_image`)
  **GERÇEK LOGO DEĞİL** çıktı — görsel olarak incelenince mağaza/şantiye
  FOTOĞRAFI oldukları görüldü (ör. Yatsan'ınki bir mobilya mağazası iç
  mekan fotoğrafı) — bu yüzden idenfit.com'un WP medya kütüphanesi
  ayrıca aranıp (`search=yatsan`/`search=dogser`) gerçek, izole logo
  dosyaları bulundu (`yatsan.webp`, `dogser-makina.webp`). Tuğba'nın
  logosu zaten `homeContent.ts`'teki ana sayfa logo şeridinde vardı,
  tekrar aranmadı. Femaş/Civil'in gerçek video kartlarına dokunulmadı.
- **KONU 2 — kod ZATEN doğruydu, Playwright ile kanıtlandı.** Kullanıcı
  mobil menünün "TÜM EKRANI kapladığını" bildirmişti — ama
  `MobileMenu.tsx` incelendiğinde kodun ZATEN `w-3/4 max-w-sm` (sağdan
  kayan, ekranın %75'i) + ayrı bir `bg-black/50` overlay (tıklanınca
  kapanan) uyguladığı görüldü. Körü körüne "düzeltmek" yerine geçici
  olarak Playwright kurulup (proje kuralına uyularak: dev server
  durdurulup kuruldu, `dev:clean`, iş bitince kaldırılıp tekrar
  `dev:clean`) 3 farklı telefon boyutunda (375, 360, 430px) gerçek
  tarayıcıda ölçüldü — **panel HER ZAMAN tam olarak %75 genişlikte**
  (ör. 390px viewport'ta panel 292.5px — 390×0.75), overlay'e tıklayınca
  kapandığı da doğrulandı (3/3 boyutta). Ekran görüntüsü kanıtla birlikte
  kullanıcıya raporlandı — kod tarafında HİÇBİR değişiklik yapılmadı
  (zaten doğruydu, aktif bir hata değildi).
- **Test:** `astro check` 0 hata, `astro build` 858 sayfa hatasız,
  `test-no-external-idenfit-links.mjs` 2306 dosyada 0 sorun, tüm
  regresyon testleri geçti. Playwright ile hem masaüstü hem mobil
  görünümde (375-430px aralığı) yeni logoların doğru yüklendiği
  (`naturalWidth` kontrolüyle) ayrıca doğrulandı.

**Podcastler menüden kaldırıldı — kaynak sitede URL'i hiç bulunamamıştı,
gelecekte içerik hazır olursa geri eklenebilir (2026-07-24).** Kullanıcı
KEŞFET menüsündeki soluk/tıklanamaz "Podcastler" öğesinin yarım bir görüntü
verdiğini fark etti — yarım bir öğe göstermek yerine tamamen kaldırıldı.
`comingSoon`/`comingSoonTitle` mekanizması site genelinde YALNIZCA
Podcastler için kullanılıyordu — kaldırılınca tamamen ölü kod haline
geldiği için (proje ilkesi: kullanılmayan kod tamamen silinir) `LinksColumn`/
`ResolvedLinksColumn` arayüzlerinden, `MegaMenu.tsx`/`MobileMenu.tsx`'in
render mantığından ve `mega.kesfet.podcasts`/`mega.ui.comingSoonTitle`
i18n anahtarlarından (4 dilin hepsinden) da tamamen çıkarıldı — yarım bir
özellik iskeleti bırakılmadı. Kullanıcının ayrıca istediği "başka yarım
kalmış öğe var mı" taraması sonucu **1 yeni benzer bulgu** çıktı — ✅
**sonraki turda (KONU 1, yukarıya bkz.) gerçek logolarla çözüldü**:
**Müşteriler sayfasının 5 kartından 3'ü ("Yatsan", "Doğ-Ser Makina",
"Tuğba Kuruyemiş") "Video yakında" yazısı gösteriyordu** — kaynakta bu 3
müşteri için video alanı hiç yoktu. Podcastler'dan FARKI: kartın geri
kalanı (isim/alıntı/çalışan sayısı) gerçek içerik, kartı tamamen
kaldırmak gerçek içerik kaybı olurdu — bu yüzden Podcastler gibi tek
taraflı kaldırılmadı, kullanıcıya
raporlandı. Diğer (görünmez, "yarım görüntü" değil) dormant veri
örnekleri: Puantaj'ın embed edilmeyen `video_url`'i, İzin Yönetimi'nin
render edilmeyen testimonial'ı — bunlar hiç render edilmediği için
kullanıcıyı yanıltan bir görüntü oluşturmuyor, farklı bir kategori.
**Test:** `astro check` 0 hata, `astro build` 858 sayfa hatasız,
`test-no-external-idenfit-links.mjs` 2306 dosyada 0 sorun (+ "Podcast"/
"Yakında" metninin hiçbir üretilmiş sayfada kalmadığı ayrıca doğrulandı),
tüm regresyon testleri geçti.

**Görsel ince işçilik madde 1+2 düzeltildi (2026-07-24).** Kullanıcı
`docs/design-polish-opportunities.md`'nin ilk 2 maddesiyle başladı.
(1) Blog kartlarının `rounded-lg`'si site standardı `rounded-2xl`'e
çevrildi (2 dosya). (2) Hover geçişi eksikliği düzeltilirken bulgu
GENİŞLETİLDİ: ilk rapor dosya-seviyesinde tarama yapmıştı (Footer.astro
gibi aynı dosyada hem geçişli hem geçişsiz hover barındıran dosyaları
kaçırıyordu) — düzeltme sırasında her `class` attribute'unu tek tek
inceleyen kesin bir script yazıldı, gerçek toplam **10 instance, 8 dosya**
çıktı (ilk rapordaki 8'den farklı dosyalar). Ayrıca ilk rapordaki 8
dosyanın **7'sinin aslında `hover:underline` kullandığı** (renk değişimi
yok, `text-decoration-line` CSS'te animasyonlanamıyor) fark edildi — bu
7 dosyaya dokunulmadı (görünür hiçbir etkisi olmazdı + site genelindeki
13+ aynı deseniyle zaten tutarlı). Detaylar için
`docs/design-polish-opportunities.md`'ye bakın (madde 1-2 artık ✅
işaretli). **Sıradaki adım: kullanıcı onayı sonrası madde 3 (H1
tipografisi) + madde 4 (padding/genişlik standardı).**

**Eksikler ve gelecek planlama — 2 keşif raporu yazıldı, HENÜZ HİÇBİR
DÜZELTME YAPILMADI (2026-07-24).** Kullanıcı "eksikler ve gelecek
planlama" aşamasına geçilmesini istedi — salt keşif, kod değişikliği yok.
`docs/remaining-work-report.md` (Faz 2 backend işleri, görsel eksikleri,
KARAR 2, Dijital Olgunluk Testi, envanterdeki tamamlanmamış İkincil/Düşük
sayfalar — yalnızca Destek Talebi formu ailesi gerçek bir boşluk çıktı,
gerisi ya tamamlandı ya kasıtlı atlandı — + 5 bilinçli tasarım kapsam-dışı
maddesi) ve `docs/design-polish-opportunities.md` (kod taraması ile
bulunan somut bulgular: Blog kartlarının köşe yuvarlaklığı tutarsız,
8 bileşende hover geçişi eksik, H1 tipografisi 3 varyantta, sayfa padding/
genişliği iki-üç farklı değerde, scroll-reveal animasyonu YALNIZCA ana
sayfada — öncelik sırasıyla, kolay→karmaşık). **Sıradaki adım: kullanıcı
iki raporu inceleyip hangi maddelerle/öncelikle ilerleneceğine karar
verecek.**

**Logo gerçek kaynak SVG'siyle değiştirildi (2026-07-24).** Kullanıcı
"idenfit" yazısının fontunun kaynakla uyuşmadığını fark etti (font olarak
Paytone One tahmin etmişti). Canlı sitenin header'ı incelenince asıl
gerçek çıktı: logo bir font DEĞİL, tamamen elle vektörleştirilmiş
(harfleri path'e çevrilmiş) bir SVG — `idenfit-logo.svg`, canlı `<header>`'da
birebir bu dosya kullanılıyor. Font tahmini bu yüzden doğrulanamadı (kaynakta
canlı bir font-family yok) ama daha iyi bir sonuç bulundu: gerçek path
verisi `IdenfitLogo.tsx`'e taşındı, Header/Footer/MobileMenu'nün üçü de
artık bu bileşeni kullanıyor. Detaylar için §"Tamamlanan işler"e bakın.

**Şu an burada duruyoruz:** `docs/site-audit-report.md`'deki 14 bulgunun
tamamı ele alındı — **🎉 SİTE DENETİM RAPORU KAPANDI.** 11 madde
düzeltildi (3 Kritik + 6 Yüksek + 2 Orta), 1 madde (Turizm IT H1'i)
kullanıcı kararıyla bilinçli olarak dokunulmadan bırakıldı, 2 madde
(hydration konsol uyarısı + bilinen içerik boşlukları) zaten aksiyon
gerektirmiyordu. Detaylar için §"Tamamlanan işler — özet günlüğü"ne bakın.

**Blog'a geçmeden önce 4 küçük düzeltme yapıldı (2026-07-24)** — Dijital
İK Olgunluk Testi linki geçici olarak ana sayfaya yönlendirildi (TODO,
bkz. madde 11), EN/IT'de yalnızca TR'de var olan sayfalar artık sessizce
404 vermiyor (`i18n.fallback`'e `en: 'tr'`/`it: 'tr'` eklendi), ÜRÜNLER
promo panelinin gerçek görseli bulunup eklendi. Donanım ikonunun soluk
rengi kaynakta doğrulandı (canlı `#mega-menu` HTML'inde literal
`fill="#F4CCCE"` — kasıtlı/gerçek bir kaynak tutarsızlığı, bug değil) ve
kullanıcı kararıyla görsel tutarlılık için yine de marka rengine
çevrildi. Detaylar için §"Tamamlanan işler"e bakın.

**🎉 BLOG MİGRASYONU TAMAMLANDI — 618/618 yazı üretildi, doğrulandı, tüm
regresyon testleri temiz (2026-07-24).** FAZ A (tasarım — sidebar, okuma
süresi, kategori dedupe, 2 kolonlu düzen) onaylandıktan sonra FAZ B'de
`extract-blog-posts.mjs --all` ile kalan ~603 yazı toplu işlendi. Bu ölçekte
2 YENİ gerçek bug daha bulunup düzeltildi (bir yazıda ara-başlık için
yanlışlıkla kullanılmış `<h1>`, başka bir yazıda kopyala-yapıştır hatasıyla
kendi içinde İKİ KEZ tekrarlanmış bir link URL'si) — script'in ADIM 1/FAZ
A'da bulunan tüm düzeltmeleri (excerpt temizliği, kategori dedupe, iç link
çözümleme, alt metni düzeltmesi) otomatik uyguladığı doğrulandı. Yeni
`scripts/verify-blog-posts.mjs` 6 boyutta (sayfa 200/görsel 200/excerpt/H1/
alt metni/kategori tekrarı) tarama yapıyor — **618/618 sayfa 200, 617/617
görsel 200, 0 kalıntı H1, 0 kategori tekrarı**; yalnızca 4 yazıda alt metni
UYARISI çıktı ama bunlar YANLIŞ POZİTİF (çıktı zaten doğru, bkz. §"Tamamlanan
işler"). `astro build` 858 sayfa hatasız, `test-no-external-idenfit-links.mjs`
2306 dosyada 0 sorun, tüm dil-değiştirici/menü regresyon testleri geçti.
**Blog artık 4 fazlı bir sonraki büyük iş değil — kapandı.** Detaylar için
§"Tamamlanan işler"e bakın.

**Blog migrasyonu devam ediyor — pilot ONAYLANDI + 14 çeşitlilik yazısı
daha işlendi (toplam 15/618), KULLANICI ONAYI BEKLENİYOR (2026-07-24).**
Content Collection altyapısı (`src/content.config.ts` + `src/content/blog/posts.json`)
+ blog listesi (`/blog/`, artık gerçek sayfalama — 15 yazıyla `totalPages=2`
oldu, `/blog/page/2/` üretildi) + tekil yazı şablonu kuruldu, pilot
onaylandı. Kullanıcının "en güvenli yoldan ilerleyelim" talimatıyla
**ADIM 1**: 6 farklı kategoriden (Güncel Bilgiler, İK Röportajları,
Öğretici Bilgiler, Yaklaşan/Geçmiş Etkinlikler, çoklu-kategori örnekleri),
görseli OLMAYAN 1 yazı dahil, 14 yazı daha işlendi — bu turda script'te
**3 gerçek bug bulunup düzeltildi** (boş excerpt, bağlamsız kısa excerpt,
dosya-adından-üretilmiş anlamsız alt metni) + iç link çözümleme kaynakta
görülmeyen `/tr/` önekli biçimi karşılayacak şekilde genelleştirildi —
tam liste için §"Tamamlanan işler"e bakın. **DİĞER ~603 yazıya
DOKUNULMADI. Sıradaki adım: kullanıcı bu 15 yazıyı inceleyip onaylarsa
ADIM 2 (kalan yazıların toplu üretimi + `verify-blog-posts.mjs` doğrulama
script'i) başlayacak.**

**Bugünkü dev server sorunu ÇÖZÜLDÜ.** Tekrarlayan `_jsxDEV is not a
function`/navbar kaybı sorunu bugün nihai olarak kapatıldı: `astro`
`7.0.9` → `7.1.3`'e güncellendi VE asıl tetikleyicilerden biri (config
dosyası dev server çalışırken düzenlenince Astro'nun kendi soft-restart'ı
aynı bug'a düşüyordu) bulunup kalıcı kural olarak kaydedildi (bkz.
§"Tamamlanan işler" — "ÜÇÜNCÜ GÜNCELLEME" ve §"Proje kuralları"). Sunucu
şu an `npm run dev:clean` ile temiz halde, doğrulandı.

**Sıradaki adım: Blog migrasyonu (618 yazı) — HENÜZ BAŞLANMADI.**
Araştırma tamamlandı (bkz. madde 3 aşağıda, mimari önerisi ve pilot yazı
belirlendi), ama hiçbir sayfa/route üretilmedi. Kullanıcı hangi fazın
(pilot yazı mı, tüm "Güncel Bilgiler" kategorisi mi) Faz 1'de yapılacağına
karar verecek. **Yarın buradan devam edilecek.**

Denetim script'leri (tekrar çalıştırılabilir, `scripts/` altında):
`audit-site.mjs`, `audit-analyze.mjs`, `audit-lang-consistency.mjs`,
`audit-entities.mjs`, `audit-images.mjs`, `audit-http-status.mjs`.

### Açık noktalar / bekleyen kararlar
1. **KARAR 2 — kaynakta olmayan çeviriler için yeni sayfa üretimi**
   (seyahat modülünün NL/IT'si, demirbaş modülünün IT'si gibi) ekiple
   görüşülüp netleşmeyi bekliyor; şimdilik bu diller için sayfa
   üretilmiyor, mevcut diller normal üretiliyor.
2. Hero formunun backend/CRM entegrasyonu yok (şimdilik `console.log`) —
   **Faz 2 (Cloudflare Pages Functions):** form başarıyla gönderildiğinde
   kullanıcı artık gerçek bir Teşekkürler sayfasına (`tesekkurler.astro`/
   `en/thanks.astro`/`it/grazie.astro`, bkz. `thankYouContent.ts`)
   yönlendirilecek şekilde bağlanmalı — sayfa migrate edildi ama form
   gönderimiyle ARASINDA henüz otomatik bir bağlantı YOK (bilinçli, backend
   olmadan yapılamaz).
3. ~~Blog migrasyonu — pilot ONAYLANDI + 14 çeşitlilik yazısı işlendi,
   ADIM 2 için kullanıcı onayı bekleniyor~~ — **✅ TAMAMLANDI (2026-07-24):**
   618/618 yazı üretildi, `verify-blog-posts.mjs` ile doğrulandı, tüm
   regresyon testleri temiz. Mimari: Astro Content Collections
   (`src/content.config.ts` + `src/content/blog/posts.json`, `file()`
   loader) — projenin geri kalanındaki `get*Content()` deseninden FARKLI,
   ilk kez kullanılan bir yaklaşım. Tam detay için bkz. §"Tamamlanan
   işler" — "🎉 BLOG MİGRASYONU TAMAMLANDI".
4. ~~Ana sayfanın hero görseli artık gerçek ... ÜRÜNLER mega-menüsünün promo
   banner görseli hâlâ placeholder olabilir~~ — **çözüldü (2026-07-24):**
   promo panelinin gerçek görseli (`header-image.webp`, 590×590) bulundu,
   bkz. §"Tamamlanan işler".
5. KEŞFET mega-menüsündeki "Podcastler" için kesin URL yok, atlandı.
6. Mesafeli Satış Sözleşmesi'nin kobi/mikro TR varyantları kurulmadı
   (Elementor `content.rendered` parse'ı gerektiriyor).
7. ~~Gizlilik ve Güvenlik Politikası (`sozlesme/gizlilik-ve-guvenlik-politikasi`)
   footer'da linkleniyor ama sayfası henüz yok.~~ — **çözüldü (2026-07-24):**
   bu not gözden kaçırılıp önce yanlışlıkla Güvenlik sayfasıyla aynı
   sanılmıştı (kullanıcı düzeltmesiyle fark edildi) — gerçek sayfa
   TR/EN/IT migrate edildi, bkz. §"Tamamlanan işler"in en üstündeki "⚠️
   DÜZELTME" girdisi.
8. Puantaj modülünün gerçek bir YouTube `video_url`'i var ama **bilinçli
   olarak embed edilmedi** (site genelinde başka hiçbir ürün sayfası video
   embed kullanmıyor, tutarlılık için) — veri `products.json`'da duruyor,
   ileride eklenmek istenirse hazır.
9. İzin Yönetimi modülünün bir testimonial/referans bloğu (Double Tree by
   Hilton alıntısı) veride var ama **PDKS şablonuna sadık kalmak için
   render edilmiyor** — ileride kullanılabilir.
10. `tesekkurler-destek` (Destek Talebi Teşekkürler, id 16712, TR+EN,
    `/tesekkurler-destek/`) araştırma sırasında bulundu ama migrate
    EDİLMEDİ — kullanıcının tarif ettiği (video/müşteri kartlı) sayfa
    farklıydı (`/tesekkurler/`, id 15810). Gerekirse ayrıca ele alınabilir.
11. **TODO — "Dijital İK Olgunluk Testi" migrate edilmedi, geçici olarak
    ana sayfaya yönlendiriliyor (2026-07-24).** Kaynakta gerçekten var
    (`https://idenfit.com/ik-dijital-olgunluk-testi/`, id 23868, TR-only,
    `pages.json`'da doğrulandı — 200 döndü) ama ACF alanlarının tamamı BOŞ
    (Teşekkürler sayfasındaki aynı desen), gerçek içerik/mantık Elementor
    `content.rendered`'da: (1) bir Elementor Form widget'ı ile
    Firma Adı/Sektör/Çalışan Sayısı toplayan bir **lead-capture adımı**,
    (2) muhtemelen JS/HTML widget'larıyla render edilen 8 soruluk quiz,
    (3) skor hesaplayıp ayrı bir sonuç sayfasına
    (`ik-dijital-olgunluk-testi-sonucu`, id 24317, o da ACF'i boş) götüren
    akış. Bu, `HeroForm`'la AYNI blokerı taşıyor — **backend/lead-capture
    olmadan (Faz 2, bkz. madde 2) fonksiyonel bir migrasyon mümkün değil**
    — bu yüzden şimdilik yalnızca kırık link önlendi
    (`src/data/navigation.ts`'teki `digitalMaturityTest` linki `href: ''`
    ile ana sayfaya yönlendiriliyor). Faz 2'de HeroForm'la birlikte ele
    alınabilir; o zaman quiz widget'ının tam JS/HTML yapısı (`elementor-widget-html`
    bloklarındaki olası inline JS dahil) yeniden incelenmeli.

---

## Tamamlanan işler — özet günlüğü

Bu bölüm, geçmiş oturumlarda tamamlanan işlerin **yalnızca sonucunu**
özetler (süreç/komut detayları için `docs/claude-md-archive-2026-07-23.md`
arşivine bakılabilir — nadiren gerekir). Kalıcı mimari kurallar burada
tekrarlanmıyor, bkz. §"Mimari".

**Logo — gerçek kaynak SVG'si bulundu, font tahmini (Paytone One) elendi
(2026-07-24).** Kullanıcı header'daki "idenfit" yazısının düz bir font
kullandığını, gerçek sitenin özel tipografisiyle uyuşmadığını fark etti;
font olarak Paytone One'ı tahmin etti.

- **Araştırma:** Canlı `idenfit.com` ana sayfası çekilip incelendi.
  Sayfadaki JSON-LD (`Organization` şeması) `"logo"` alanı gerçek dosyayı
  işaret ediyordu: `https://idenfit.com/wp-content/uploads/2025/07/idenfit-logo.svg`
  — bu URL doğrudan çekilip incelendi VE canlı `<header>`'ın kendi HTML'inde
  (`<img width="98" height="36" src=".../idenfit-logo.svg">`) BİREBİR aynı
  dosyanın kullanıldığı doğrulandı (varsayım değil, iki bağımsız kaynaktan
  teyit). **Sonuç: logo bir font DEĞİL** — "idenfit" yazısının 7 harfi
  (6 `<path>` elemanına dağılmış, "i" harfi nokta+gövde için tek path içinde
  2 alt-path kullanıyor) tamamen elle vektörleştirilmiş/kontura çevrilmiş
  bir logotype. Bu yüzden "font-family doğrula" adımı kaynakta canlı bir
  font OLMADIĞI için sonuçsuz kaldı — ama daha iyi bir sonuç bulundu: font
  tahmin etmek yerine kaynağın KENDİSİNİ (gerçek path verisi) kullanmak.
- **Yıldızın konumu — kaynak path koordinatlarından KESİN olarak doğrulandı**
  (yorum/tahmin gerekmedi, path verisi birebir kopyalandığı için otomatik
  doğru): SVG'nin `viewBox="0 0 98 36"` sisteminde son (ve tek kırmızı,
  `fill="#FF0000"`) path x≈85.5–98 (genişliğin sağ ~%13'ü) ve y≈1.3–13.3
  (yüksekliğin üst ~%37'si) aralığında — "i" harfi (İLK path, x:0–5.7)
  ile UZAKTAN bile ilgisi yok. **Yıldız, "i" harfinin noktası YERİNE
  DEĞİL, tüm "idenfit" kelimesinin sağ üst köşesinde bağımsız bir
  yıldız/asterisk aksanı** olarak duruyor.
- **Uygulama:** Yeni `src/components/icons/IdenfitLogo.tsx` (React, ama
  Header.astro/Footer.astro'da HİÇBİR `client:*` direktifi OLMADAN
  kullanılıyor — Astro bunu derleme zamanında düz statik HTML'e render
  ediyor, sıfır ekstra JS; MobileMenu.tsx zaten React olduğu için
  doğrudan import edildi) — kaynaktaki 6 harf path'inin `fill="black"`'i
  `fill="currentColor"`'a çevrildi (bağlama göre uyarlanabilsin diye:
  Header/MobileMenu'de `text-heading`, Footer'da `text-white`), yıldız
  path'i ise `fill="var(--color-brand)"` (projenin marka kırmızısı
  token'ı, kaynağın `#FF0000`'ıyla zaten birebir aynı değer) — bu,
  `IdenfitIcons.tsx`'teki mega-menü ikonlarıyla AYNI ilke (gerçek path
  verisi + bağlama uyarlanabilir renk). Header.astro/Footer.astro/
  MobileMenu.tsx'teki eski düz metin logo (`iden<span
  class="text-brand">fit</span>`, varsayılan Quicksand fontuyla render
  ediliyordu) bu component'le değiştirildi.
- **Google Fonts'a Paytone One eklenmedi** — kaynakta hiçbir yerde canlı
  bir font olarak kullanılmadığı doğrulandığı için gereksiz olurdu
  (kullanılmayan bir font yüklemek yalnızca performans maliyeti getirirdi).
- **Test:** `astro check` 0 hata, `astro build` 858 sayfa hatasız (sayfa
  sayısı değişmedi). Logonun TR/EN/NL/IT ana sayfalarının hepsinde (Header
  + Footer, `curl` ile SSR HTML üzerinden) doğru render edildiği
  doğrulandı — MobileMenu'deki 3. kopya `createPortal` + `mounted` state
  ile yalnızca client-side mount edildiği için (bkz. §Mimari
  "`position:fixed` dialog kuralı") statik `curl` çıktısında görünmüyor,
  bu BEKLENEN bir durum (var olan portal mimarisinin doğal sonucu, logo
  değişikliğiyle ilgisiz). `test-no-external-idenfit-links.mjs` 2306
  dosyada 0 sorun, tüm dil-değiştirici/menü regresyon testleri
  (`test-urunler-menu-links` 108/108 dahil) etkilenmedi.

**🎉 Blog migrasyonu FAZ B — kalan ~603 yazı toplu üretildi, 618/618
tamamlandı + doğrulandı (2026-07-24).** FAZ A onayından sonra kullanıcı
"kalan yazıların tamamını toplu üret" dedi. `extract-blog-posts.mjs`'e
`--all` bayrağı eklendi (`posts.json`'daki TÜM `publish` yazıları işler —
618 slug'ı CLI argümanı olarak tek tek geçirmenin pratik/OS limitlerinden
kaçınmak için) + performans için `Array.find()` yerine `Map` bazlı id
lookup'lara geçildi (media/kategori/tag, 618×N karşılaştırma yerine O(1)).

- **Toplu çalıştırmadan ÖNCE bulunan bir altyapı eksikliği: tag önbelleği
  eksikti.** `fetch-blog-taxonomy.mjs` yalnızca `per_page=100` ile TEK
  sayfa çekiyordu — ama site genelinde 129 tag var (100'ü aşıyor), ilk
  sürüm sessizce 16 tag'i (posts.json'da GERÇEKTEN kullanılan) eksik
  bırakmıştı. 618 yazının tamamı taranıp her `categories`/`tags` ID'sinin
  önbellekte karşılığı olup olmadığı kontrol edilerek (toplu işlemeden
  ÖNCE, riski erkenden ortadan kaldırmak için) bulundu — script artık
  `X-WP-TotalPages` header'ını okuyup TÜM sayfaları çekiyor (129/129 tag,
  19/19 kategori doğrulandı).
- **Toplu çalıştırma sonrası `verify-blog-posts.mjs` (yeni script) ile 6
  boyutlu tarama yapıldı, 2 YENİ gerçek bug bulunup düzeltildi:**
  1. **Ara-başlık için yanlışlıkla `<h1>` kullanımı.**
     `2026-sgk-tesvikleri-rehberi-neler-degisti` yazısının gövdesinde,
     başlıktan TAMAMEN FARKLI bir metinle (bir ALT BÖLÜM başlığı olarak)
     kullanılan gerçek bir `<h1>` vardı — mevcut `stripDuplicateLeadingH1()`
     yalnızca gövdenin EN BAŞINDAKİ, başlıkla BİREBİR aynı H1'i yakaladığı
     için bunu (konumu/metni eşleşmediğinden) yakalayamamıştı. Yeni
     `downgradeStrayH1sToH2()` — sayfa şablonu zaten kendi TEK `<h1>`'ini
     bastığı için gövdede kalan HERHANGİ bir `<h1>` (kaldırılmıyor,
     hâlâ anlamlı bir bölüm başlığı olduğu için) `<h2>`'ye indirgeniyor.
  2. **Kendi içinde ikiye katlanmış link URL'si.** `dijital-ik-donusumu-
     chro-oncelikleri` yazısında bir link, muhtemelen bir link-ekleme
     aracındaki kopyala-yapıştır hatasıyla, AYNI URL'nin sonuna yeniden
     yapıştırılmış hâldeydi (`.../calisan-performans-degerlendirme-sistemi-
     modulu/https://idenfit.com/tr/calisan-performans-degerlendirme-sistemi-
     modulu/`) — `resolveInternalLinks()` bunu ham haliyle (origin'i
     yalnızca EN BAŞTAN bir kez temizleyip) geçirdiği için sonuçta hem
     relative hem embedded-absolute karışık, geçersiz bir href üretmişti.
     Bu, **`test-no-external-idenfit-links.mjs`'in `astro build` SONRASI**
     347→2306 dosyalık tam taramasında yakalandı (dev server bazlı
     `verify-blog-posts.mjs` yalnızca sayfa/görsel HTTP durumuna bakıyor,
     href içeriğini incelemiyor — bu ikisinin FARKLI şeyleri yakaladığı,
     ikisinin de gerekli olduğu bir kez daha doğrulanmış oldu). Düzeltme:
     `toRelativePath()` artık `rawHref` içinde `https://idenfit.com`'un
     SON occurrence'ını arayıp ondan öncesini atıyor (kopyala-yapıştır
     hatasıyla katlanmış herhangi bir URL'i genel olarak kapsar).
  - Her iki düzeltme de `extract-blog-posts.mjs --all` yeniden
    çalıştırılarak TÜM 618 yazıya (yalnızca bu 2 yazı etkilendi, upsert
    id-bazlı olduğu için diğer 616'ya dokunulmadı) uygulandı.
  - **`verify-blog-posts.mjs`'in bulduğu ama YANLIŞ POZİTİF çıkan 4 bulgu**
    (`imposter-sendromu`, `personel-takibi`, `parlayan-nesne-sendromu`,
    `kurumsal-sosyal-sorumluluk`): bu yazıların görsellerinin dosya adı
    (ör. `Imposter-Sendromu.jpg`) tesadüfen post başlığıyla ("Imposter
    Sendromu") ÖRTÜŞÜYOR — `looksAutoGeneratedFromFilename()` bunu "dosya
    adından türetilmiş" sayıp fallback'e (post başlığı) düşürdü, ama
    fallback zaten ORİJİNAL alt metniyle AYNI metin olduğu için ÇIKTIDA
    hiçbir fark yok (görünen alt metni hem önce hem sonra "Imposter
    Sendromu"). Bu 4 bulgu gerçek bir kusur değil, yalnızca doğrulama
    script'inin heuristic'inin nadir bir zararsız false-positive'i —
    kod değişikliği gerektirmedi, burada şeffaflık için not düşülüyor.
- **Nihai istatistikler:** `src/content/blog/posts.json` 6,2 MB, 618 yazı.
  Kategori dağılımı: İK Akademi 337, İK Trendleri 159, Güncel Bilgiler 126,
  Dijital İK 41, Geçmiş Etkinlikler 14, Uncategorized 7, İK Röportajları 4,
  Yaklaşan Etkinlikler 3, Öğretici Bilgiler 3, Yenilikler 2 (bir yazı birden
  fazla kategoride sayılabildiği için toplam 618'i aşar). 513 yazıda en az
  1 iç link var. Sayfalama: `Math.ceil(618/12)` = 52 sayfa (`/blog/page/2/`
  … `/blog/page/52/`) — 53. sayfa doğru şekilde 404 veriyor, doğrulandı.
- **Test (tam kapsamlı):** `astro check` 0 hata. `astro build` **858 sayfa**
  hatasız (188 baz + 1 blog index + 618 yazı + 51 sayfalama sayfası).
  `verify-blog-posts.mjs`: **618/618 sayfa 200, 617/617 görsel 200 (1 yazının
  kaynakta da görseli yok), 618/618 excerpt yeterli uzunlukta, 0 kalıntı H1,
  0 kategori tekrarı, 4 yanlış-pozitif alt metni uyarısı** (yukarıda
  açıklandı). `test-no-external-idenfit-links.mjs` **2306 dosyada 0 sorun**
  (2 düzeltmeden SONRA — düzeltmeden ÖNCE 1 gerçek sorun yakalamıştı).
  `test-urunler-menu-links.mjs` 108/108, `test-legal-nl-consistency.mjs`
  18/18, `test-sector/faq/product-language-switch` testlerinin hepsi
  etkilenmedi. Dev server `npm run dev:clean` ile birden fazla kez temiz
  yeniden başlatıldı (büyük `astro build` sonrası + FAZ B'nin iki
  düzeltme turu arasında).
- **Not (transient ağ hatası, gerçek bug değil):** İlk `verify-blog-posts.mjs`
  çalıştırmasında 617 görselin TAMAMI "fetch failed" verdi — idenfit.com'a
  ağır bir istek yoğunluğu (bu oturumdaki önceki canlı-site taramalarının
  toplamı) geçici bir darboğaza yol açmış olabilir. Küçük bir örneklemle
  (concurrency 3/5/8) tekrar test edilince sorun görülmedi, tam koşu tekrar
  çalıştırılınca 617/617 sorunsuz geçti — kalıcı bir kod/limit sorunu
  DEĞİL, tek seferlik bir ağ dalgalanmasıydı.

**Blog tasarımı FAZ A — sidebar, okuma süresi, 2 kolonlu düzen; kategori
rozeti "tekrarı" aslında kaynağın kendi bug'ı çıktı (2026-07-24).**
Kullanıcı "önce şablon seviyesinde tasarımı düzeltelim, otomatik olarak
tüm gelecek yazılara yansır" dedi — idenfit.com/blog/'un hem liste hem
tekil yazı sayfası canlı HTML'i çekilip (`curl`) incelendi.

- **Sağ sidebar (`src/components/BlogSidebar.astro`, yeni):** Kaynakta
  `<aside id="secondary" class="uicore-sidebar">` içinde sırasıyla
  breadcrumb (bu turda kapsam dışı bırakıldı — henüz var olmayan
  `/category/...` arşiv sayfalarına link gerektiriyordu, projenin "kırık
  link üretme" ilkesine aykırı olurdu), **"Popüler İçerikler"**, **"Yaklaşan
  Etkinlikler"** vardı.
  - "Popüler İçerikler" GERÇEK bir popülerlik metriği DEĞİL — kaynakta da
    WP'nin "Son Yazılar" (Latest Posts) Gutenberg bloğu, sitedeki en son 5
    yayınlanan yazı (kategori/bağlamdan bağımsız). Kaynakta GÖRÜNTÜLENEN
    yazının KENDİSİ bile bu listede çıkıyordu (dışlanmamış) — kasıtlı
    olarak biz de dışlamadık, kaynağa sadakat. `getPopularPosts()`
    (`blogContent.ts`) `allPosts.slice(0, 5)`.
  - "Yaklaşan Etkinlikler" kullanıcının tahmin ettiği gibi gerçekten
    `yaklasan-etkinlikler` kategorisinden geliyor — kaynakta 3 yazının
    3'ü de gösteriliyordu (5'e kırpılmamış, kategoride kaç yazı varsa
    hepsi). `getUpcomingEventPosts()` filtreliyor, kategori boşsa (henüz
    o kategoriden yazı işlenmediyse) bölüm hiç render edilmiyor.
  - Her iki bölüm de küçük kare thumbnail (40px) + başlık + tarih —
    kaynakta da böyle (38px, `wp-block-latest-posts` stili), excerpt/okuma
    süresi YOK (yalnızca ana liste kartlarında ve "Benzer Yazılar"da var).
- **Kategori rozeti "tekrarı" — GERÇEK bulgu: kaynağın kendi bug'ı.**
  Kullanıcı "GÜNCEL BİLGİLER, GÜNCEL BİLGİLER" gibi iki kez göründüğünü
  bildirmişti. Canlı `idenfit.com/blog/<slug>/` sayfası incelenince bunun
  BİZİM sitemizde DEĞİL, idenfit.com'un KENDİSİNDE olan gerçek bir hata
  olduğu görüldü: `<div class="uicore-post-category">` tekil yazı
  sayfasında yazının TÜM kategorilerini virgülle birleştirip gösteriyor,
  ama dedupe YAPMIYOR — `guncel-bilgiler` (id 328) ve `guncel-bilgiler-tr`
  (id 1162) aynı görünen isme ("Güncel Bilgiler") sahip iki AYRI WP
  kategorisi olduğu için canlı sitede pilot yazının başlığının altında
  "Güncel Bilgiler, Güncel Bilgiler" yazıyordu (doğrulandı, ekran
  görüntüsü değil ham HTML üzerinden). Bizim `extract-blog-posts.mjs`'teki
  `resolveTerms()` bunu ZATEN isim bazlı dedupe ediyordu (bkz. pilot
  günlüğü) — bu yüzden **kaynağı olduğu gibi KOPYALAMADIK**, önceden
  zaten doğru olan veri katmanının üstüne yalnızca ÖNCEDEN eksik olan
  "tüm kategorileri göster" davranışını (`categories.map(c=>c.name).join(', ')`,
  `src/pages/blog/[slug].astro`) ekledik — sonuç kaynaktaki gibi TAM
  kategori listesi ama tekrarsız (ör. `pdks-nedir` → "İK Akademi, İK
  Trendleri, Uncategorized"). Liste/"Benzer Yazılar" kartları kaynakta da
  yalnızca TEK (ilk) kategori gösteriyordu (`categories[0]`) — o davranış
  değiştirilmedi, yalnızca TEKİL YAZI sayfasının kendi başlık alanı
  düzeltildi.
- **"X dakikalık okuma" göstergesi.** Yeni `estimateReadingMinutes()`
  (`blogContent.ts`) — 200 kelime/dakika varsayımıyla (`Math.ceil(kelime/200)`,
  en az 1). Kaynakta İKİ farklı sayı görüldü: temanın kendi göstergesi
  ("8 dakikalık okuma") ve Yoast SEO'nun meta etiketi ("Tahmini okuma
  süresi: 6 dakika") — ikisi FARKLI formül kullanıyor. Pilot yazının kelime
  sayısı (1093) 200 kelime/dakika ile TAM 6 dakika veriyor — yani bizim
  formülümüz Yoast'ınkiyle birebir örtüşüyor (kullanıcının istediği
  varsayım zaten buydu). Hem liste kartlarında hem tekil yazı başlığında
  tarihin yanında gösteriliyor.
- **Genel düzen — kaynakla örtüşecek şekilde yeniden yapılandırıldı.**
  Kaynakta blog listesi TEK KOLON (`uicore-col-lg-12`, yatay kart — görsel
  solda/üstte + metin sağda), sidebar sağda sabit genişlikte
  (`uicore-sidebar-right`); "Benzer Yazılar" (kaynaktaki GERÇEK başlık,
  önceki "İlgili Yazılar" bu isimle değiştirildi) ise sidebar'ın ALTINDA
  değil, ana içerik+sidebar alanının TAMAMEN ALTINDA tam genişlikte 3
  kolonlu bir kart grid'i (`uicore-col-md-6 uicore-col-lg-4`, bizde
  `sm:grid-cols-2 lg:grid-cols-3`). Önceki 3 kolonlu kart grid'i (liste
  sayfası) tek kolonlu yatay karta çevrildi — sidebar eklenince daralan
  ana kolonda 3 kolonlu kartların sıkışacağı da ayrıca bir neden.
  `BlogListPage.astro`/`src/pages/blog/[slug].astro` artık `flex
  flex-col lg:flex-row` ile ana içerik (flex-1) + `<BlogSidebar>`
  (`lg:w-[300px] lg:shrink-0`) yan yana.
- **Test:** `astro check` 0 hata, `astro build` 205 sayfa hatasız (sayfa
  sayısı DEĞİŞMEDİ — bu tasarım güncellemesi, yeni sayfa üretmedi).
  `test-no-external-idenfit-links.mjs` 347 dosyada 0 sorun. Pilot
  sayfasının kategori rozetinde artık tekrar OLMADIĞI (`"Güncel Bilgiler"`
  tek), `pdks-nedir`'in 3 kategorisinin virgülle doğru birleştiği
  ("İK Akademi, İK Trendleri, Uncategorized"), okuma süresinin pilot için
  6 dakika (Yoast'la eşleşiyor) hesaplandığı, sidebar'ın "Popüler
  İçerikler"de 5, "Yaklaşan Etkinlikler"de mevcut 1 yazıyı (henüz
  işlenmemiş diğer 2'si olmadan) doğru gösterdiği ham HTML üzerinden
  doğrulandı. Tüm regresyon testleri (`test-urunler-menu-links` 108/108,
  `test-legal-nl-consistency` 18/18, `test-sector/faq/product-language-switch`)
  etkilenmedi.

**Blog migrasyonu ADIM 1 — pilot onaylandı, 14 çeşitlilik yazısı daha
işlendi + script'te 3 gerçek bug bulunup düzeltildi (2026-07-24).**
Kullanıcı "en güvenli yoldan ilerleyelim — kademeli + otomatik
doğrulamalı" talimatıyla, script'in farklı senaryoları doğru yönettiğini
kanıtlamak için kasıtlı çeşitlilikte 14 yazı seçilip işlendi: Güncel
Bilgiler (pilot zaten oradaydı), İK Röportajları (2 yazı — biri iki
kategorili: İK Röportajları+Yenilikler), Öğretici Bilgiler, Yaklaşan
Etkinlikler, Geçmiş Etkinlikler (+ Güncel Bilgiler ile çoklu-kategori),
İK Akademi/İK Trendleri/Dijital İK'nin hem TEK kategori hem 3-4 kategorili
örnekleri (`pdks-nedir` 3, `2026-ik-yazilimlari-fiyatlari` 4 kategori),
görseli OLMAYAN 1 yazı (`featured_media:0`), ve iç link YOĞUNLUKLU
yazılar (en fazlası `isten-cikis-yonetimi-metrikleri` — 24 link, kendi
başlıklarına giden bir "İçindekiler" tablosu dahil).

- **Bulunan ve düzeltilen 3 gerçek bug (`scripts/extract-blog-posts.mjs`'te):**
  1. **Boş excerpt.** `ihbar-suresi-nedir-nasil-hesaplanir`'in gövdesi
     tamamen boş bir `<p></p>` ile başlıyordu (WP editör artığı) —
     `buildExcerpt()` bunu "ilk paragraf" sayıp boş string üretiyordu.
     Düzeltme: yeni `stripEmptyParagraphs()` böyle blokları gövdeden
     tamamen kaldırıyor (görsel olarak da gereksiz bir boşluk satırı
     bırakıyordu).
  2. **Bağlamsız/kötü excerpt.** `insan-kaynaklarinin-dijital-donusumu-
     zirvesi-bursa`'nın ilk paragrafı boş DEĞİLDİ ama öznesi eksik, bağlam
     dışı bir cümle parçasıydı ("Balkantürksiad'ın desteğiyle
     gerçekleştirilecektir.", 52 karakter) — gerçek giriş cümlesi ikinci
     paragraftaydı. `buildExcerpt()` artık yalnızca "boş değil" değil, en
     az 100 karakterlik İLK paragrafı arıyor (bu projedeki tüm gerçek giriş
     paragraflarının 120+ karakter olduğu doğrulandı, 100 eşiği güvenli);
     hiçbiri eşiği geçmezse yine de boş olmayan ilk paragrafa düşüyor.
  3. **Dosya-adından-üretilmiş anlamsız alt metni.** `2026-memur-maaslari`'nin
     görseli `Seffaf-maas-politikas─▒.jpg` — dosya adının KENDİSİ kaynakta
     bozuk encoding'li (muhtemelen orijinal yükleme sırasında oluşmuş bir
     mojibake) ve **canlı sunucuda GERÇEKTEN bu bozuk isimle duruyor**
     (`curl` ile 200 doğrulandı — hem `media.json`'daki hem WP REST
     API'sinden taze çekilen kayıtta aynı) — URL'e dokunulmadı, hotlink
     doğru. Ama medyanın kendi `alt_text` alanı da AYNI bozuk metni
     taşıyordu (WP dosya adından otomatik üretmiş) — yeni
     `looksAutoGeneratedFromFilename()` bunu (alt metni normalize edip
     dosya adıyla karşılaştırarak) tespit edip gerçek yazı başlığına
     düşüyor.
- **İç link çözümleme genelleştirildi (`resolveInternalLinks()`/
  `toRelativePath()`).** Pilotta hiç iç link yoktu, bu turda gerçek link
  içeren yazılarla test edilince kaynağın ilk taramada görülmeyen bir
  deseni ortaya çıktı: bloglar arası linkler `/tr/blog/<slug>/` (Polylang'ın
  varsayılan-dil öneki — bizim sitemizde TR prefix'siz) biçiminde,
  bazıları da öneksiz. Yeni `toRelativePath()` hem `/tr/` önekli hem
  öneksiz mutlak idenfit.com linklerini doğru relative path'e çeviriyor;
  ayrıca üç özel durumu da kapsıyor: (1) "Online Sunum Talebi" CTA'sının
  ham slug'ı (`online-sunum-talep-et`, bazen UTM query string'iyle) —
  `resolveCtaUrl()`'deki `DEMO_CTA_URL` sentinel'iyle AYNI ilkeyle bizim
  canonical slug'ımıza (`online-sunum-talebi`) çevriliyor, UTM parametreleri
  korunuyor; (2) blog yazılarının kendi başlıklarına giden "İçindekiler"
  TOC linkleri (`#h-...` fragment'lı, bazen tam URL bazen zaten relative
  fragment) — path çözümü fragment'ı olduğu gibi koruyor; (3) `#:~:text=...`
  (tarayıcı metin-vurgulama fragment'ı) — opak string olarak dokunulmadan
  taşınıyor. **Not:** henüz işlenmemiş 603 yazıya giden blog-içi linkler
  (ör. `/blog/e-learning/`) doğru slug'a çözülüyor ama o sayfa henüz
  yayında değil — bu, ADIM 2'ye kadar BEKLENEN bir geçiş-dönemi durumu
  (kalıcı bug değil), ADIM 2 tamamlanınca kendiliğinden çözülecek.
- **Rank Math'in TOC'undan kaynaklanan tekrarlı heading id'si bulundu ve
  düzeltildi.** `isten-cikis-yonetimi-metrikleri`'nde kaynağın kendisi bir
  bölümü (3 başlık) kopyala-yapıştır hatasıyla tekrarlamış — aynı
  `id="h-..."` iki farklı başlıkta tekrar ediyordu (geçersiz HTML + TOC
  linkinin YANLIŞ başlığa atlama riski). Yeni `dedupeHeadingIds()` İLK
  oluşumu koruyup sonrakilere `-2`/`-3` soneki ekliyor — TOC zaten ilk
  (asıl) başlığı hedeflediği için davranış doğru kalıyor.
- **Yapısal/tipografik entity çözme ayrıştırıldı (önemli, genel bir bug'ı
  önledi).** İlk script sürümü `&amp;`/`&lt;`/`&gt;`/`&quot;`/`&apos;` gibi
  YAPISAL HTML escape'lerini de "tipografik" entity'lerle (`&hellip;` vb.)
  aynı torbada çözüyordu — bu, pilotta fark edilmedi (o yazıda hiç `&amp;`
  yoktu) ama bu turda `.../online-sunum-talep-et?utm_source=blog&amp;
  utm_medium=...` gibi UTM query string'li linklerde `&amp;`'i `&`'e
  çözüp geçersiz/belirsiz bir `&` bırakacaktı (`content` alanı GERÇEK HTML
  olarak `set:html` ile gömülüyor, düz metne çevrilmiyor). Düzeltme: iki
  ayrı fonksiyon — `decodeTypographicEntities()` (HTML gövdesi için,
  yalnızca tipografik + numerik entity'ler) ve `decodeAllEntities()`
  (yalnızca `title`/`excerpt` gibi düz metne çevrilen alanlar için, yapısal
  olanlar dahil tümü).
- **Test:** `astro check` 0 hata. `astro build` 205 sayfa hatasız (188 baz
  + `/blog/` + 15 yazı + `/blog/page/2/` — 15 yazıyla `totalPages=2`
  olduğu için sayfalamanın 2. sayfası İLK KEZ gerçekten üretildi, bu da
  sayfalama mantığının >12 yazıda doğru çalıştığını kanıtladı). 14 öne
  çıkan görselin TÜMÜ canlı sunucudan `HEAD` isteğiyle 200 doğrulandı
  (bozuk-dosya-adlı olan dahil). `test-no-external-idenfit-links.mjs` 347
  dosyada (+45: 15 yazı × TR/EN-redirect/IT-redirect) 0 sorun — tüm
  çözümlenen iç linklerin gerçekten relative olduğu doğrulandı.
  `test-urunler-menu-links.mjs` 108/108, `test-legal-nl-consistency.mjs`
  18/18, `test-sector/faq/product-language-switch` testlerinin hepsi
  etkilenmedi. "İlgili Yazılar" bölümü artık GERÇEK verilerle (3 yazı
  "Güncel Bilgiler" paylaşıyor) doğrulandı — pilot yazının altında doğru
  3 ilgili yazı (kendisi hariç) listelendiği curl ile teyit edildi.

**Blog migrasyonu başladı — Content Collection altyapısı + 1 pilot yazı
(2026-07-24).**

- **Altyapı:** `src/content.config.ts` (kullanıcı `src/content/config.ts`
  istemişti ama bu proje Astro 7'de — Astro 6'dan beri o eski konum
  `LegacyContentConfigError` ile TAMAMEN kaldırılmış, `astro check` ile
  anında yakalandı — güncel/zorunlu konum `src/content.config.ts`'e
  taşındı). `blog` collection'ı `file()` loader ile
  `src/content/blog/posts.json`'ı okuyor; zod şeması `slug`/`title`/`date`/
  `modifiedDate`/`excerpt`/`featuredImage` (nullable)/`categories`/`tags`
  (`{id,slug,name}[]`)/`content` (temizlenmiş HTML string) alanlarını
  zorunlu kılıyor.
- **Extraction script'leri (2 yeni, `scripts/` altında, proje kuralı gereği
  `.mjs`):** `fetch-blog-taxonomy.mjs` (kategori/tag id→slug/name
  eşlemesini canlı WP REST API'sinden çekip `reference/wordpress-export/
  blog-{categories,tags}.json`'a önbelleğe alıyor — `posts.json`'daki
  `categories`/`tags` alanları yalnızca ID dizisi, isim export'a hiç dahil
  değilmiş). `extract-blog-posts.mjs <slug1> [slug2 ...]` — **TOPLU
  DEĞİL, slug bazlı çalışıyor** (kullanıcının "diğer 617 yazıya dokunma"
  talimatına mimari olarak uyacak şekilde tasarlandı — script'i 618 kez
  ayrı ayrı çağırmadan tüm yazıları işlemek mümkün değil, bu kasıtlı bir
  sürtünme). `src/content/blog/posts.json`'a id bazlı upsert yapıyor (var
  olan yazılara dokunmadan yeni slug ekliyor/günceliyor).
- **Bulunan veri temizleme ihtiyaçları (script içinde otomatik ele
  alındı):** (1) `content.rendered` başlıkla BİREBİR aynı metni tekrar
  eden bir `<h1>` ile başlıyor — sayfa şablonu başlığı zaten kendi `<h1>`
  olarak render ettiği için bu yinelenen H1 (metni başlıkla eşleşiyorsa)
  gövdeden çıkarılıyor. (2) WP'nin otomatik `excerpt.rendered`'ı başlığı
  tekrar edip `[&hellip;]` ile kesiyor — kullanılmadı, temizlenmiş
  gövdenin ilk paragrafından (160 karaktere kırpılarak) kendi excerpt'i
  üretiliyor. (3) Pilot yazının 2 kategorisi (`guncel-bilgiler` id 328 +
  `guncel-bilgiler-tr` id 1162) FARKLI slug ama AYNI görünen isme
  ("Güncel Bilgiler") sahip — `resolveTerms()` isimde dedupe yapıyor, tek
  bir kategori rozeti gösteriliyor. (4) Blog-içi mutlak linkleri
  (`https://idenfit.com/blog/<slug>/` → `/blog/<slug>/`) relative'e
  çeviren `resolveInternalLinks()` yazıldı — pilot yazıda hiç iç link
  yoktu (doğrulandı), bu yüzden şu an no-op ama gelecek yazılar için hazır.
- **Sayfalar:** `src/data/blogContent.ts` (`getAllBlogPosts`/`paginate`/
  `formatBlogDate`/`getRelatedPosts` — sayfa-tipinden bağımsız yardımcılar).
  `src/components/BlogListPage.astro` (grid + sayfalama nav, hem
  `src/pages/blog/index.astro` hem `src/pages/blog/page/[page].astro`
  tarafından paylaşılıyor — **kasıtlı olarak `/blog/page/N/`** altında,
  `/blog/[slug]/` ile aynı dizin seviyesinde `[page]`/`[slug]` çakışması
  riskini baştan eleyecek şekilde). `src/pages/blog/[slug].astro` — başlık/
  tarih (`Intl.DateTimeFormat('tr-TR', ...)`)/kategori rozeti/öne çıkan
  görsel (hotlink, `wp-content/uploads/...` — proje genelindeki görsel
  hotlink kuralıyla tutarlı)/içerik (`set:html`, Tailwind arbitrary child
  selector'larla h2/h3/p/ul/ol/a stillendirildi, `@tailwindcss/typography`
  eklentisi eklenmedi)/"İlgili Yazılar" (aynı kategoriyi paylaşan, kendisi
  hariç son 3 yazı — şu an koleksiyonda tek yazı olduğu için boş, bölüm
  hiç render edilmiyor, beklenen davranış).
- **Bonus/otomatik kazanım:** Bugün daha erken eklenen `i18n.fallback`
  (`en:'tr'`, `it:'tr'`) sayesinde `/en/blog/` ve `/it/blog/` (ve tekil
  yazı sayfaları) hiçbir ek kod olmadan otomatik olarak TR'nin bare
  sayfasına redirect oluyor — "Blog dil stratejisi" mimari kararıyla
  (§Mimari) birebir örtüşüyor.
- **Test:** `astro check` 0 hata. `astro build` 190 sayfa hatasız (188 + 2
  yeni: `/blog/` + pilot yazı — `/blog/page/2/` gibi ek sayfalar
  ÜRETİLMEDİ, çünkü tek yazıyla `totalPages=1`). Üretilen `/blog/<slug>/`
  HTML'inde tek bir `<h1>` olduğu (duplicate H1 giderildi), öne çıkan
  görselin/kategori rozetinin göründüğü, "İlgili Yazılar"ın render
  edilmediği doğrulandı. `test-no-external-idenfit-links.mjs` 302 dosyada
  (6 yeni: blog index + pilot yazı × TR/EN-redirect/IT-redirect) 0 sorun.
  `test-urunler-menu-links.mjs` 108/108, `test-legal-nl-consistency.mjs`
  18/18, `test-sector-language-switch.mjs` 36/36,
  `test-faq-language-switch.mjs` 9/9, `test-product-language-switch.mjs`
  56/56 — hiçbiri etkilenmedi. `/en/blog/`'in gerçekten `/blog/`'e
  redirect olduğu hem dev server hem prod build çıktısında curl ile
  doğrulandı.

**Blog öncesi 4 küçük düzeltme (2026-07-24).**

- **"Dijital İK Olgunluk Testi" linki geçici olarak ana sayfaya
  yönlendirildi** — sayfa kaynakta gerçekten var ama tam bir lead-capture
  formu + quiz + skorlu sonuç sayfası kombinasyonu, `HeroForm` ile aynı
  backend blokerını taşıyor. Detaylı bulgu ve TODO için bkz. §"Açık
  noktalar" madde 11.
- **EN/IT → TR i18n fallback eklendi.** `/en/hesaplama-araclari/` ve
  `/it/hesaplama-araclari/` (Hesaplama Araçları sayfası KARAR 2 gereği
  yalnızca TR'de kurulu) önceden sessizce 404 veriyordu. `astro.config.mjs`'in
  `i18n.fallback`'ine (NL→EN'le aynı mekanizma) `en: 'tr'`/`it: 'tr'`
  eklendi — artık TR'nin bare sayfasına statik redirect üretiliyor. Site
  genelinde TR ile aynı bare slug'ı paylaşan ama EN/IT'de hiç route'lanmamış
  BAŞKA sayfa olmadığı doğrulandı (TR/EN/IT `src/pages/` kök dosyaları
  karşılaştırıldı — Hesaplama Araçları TEK istisnaydı), bu yüzden bu
  değişiklik başka hiçbir sayfanın per-locale slug'ını (ör. `fiyatlar`
  → `pricing` gibi FARKLI slug'lı sayfaları) etkilemedi/kırmadı.
- **ÜRÜNLER mega-menü promo panelinin gerçek görseli bulundu ve eklendi.**
  Önceki taramalarda (ana sayfanın `content.rendered`'ı + derlenmiş CSS)
  bulunamamıştı çünkü mega-menü içeriği ayrı bir Elementor header/footer
  template parçası (`elementor_library` post type) — ana sayfanın kendi
  içeriğinde değil. idenfit.com'un canlı HTML'i doğrudan çekilip `#mega-menu`
  container'ı içinde aranarak "LATER IS NEVER" bloğunun hemen üstünde
  `header-image.webp` (590×590, `wp-content/uploads/2025/08/`) bulundu —
  canlı URL doğrulandı (200). `MegaMenuPromo`/`ResolvedPromo` arayüzlerine
  yeni `image: string` alanı eklendi, `MegaMenu.tsx`'teki kesikli-çizgili
  "Görsel" placeholder kutusu gerçek `<img>` ile değiştirildi.
- **Donanım Yönetimi ikonunun soluk rengi — kaynak kontrolü yapıldı,
  BUG DEĞİL çıktı.** İlk bakışta diğer 3 ikona (canlı marka kırmızısı daire)
  göre soluk duran plug ikonunun arkaplan rengi (`#F4CCCE`, açık pembe)
  kullanıcı tarafından tutarsızlık olarak bildirildi. idenfit.com'un canlı
  ana sayfa HTML'i indirilip `<header>` içindeki gerçek `#mega-menu`
  bloğu incelendi: aynı ikonun (aynı SVG path'i, aynı `data-id`) kaynakta
  da literal `fill="#F4CCCE"` kullandığı doğrulandı (diğer iki dairesel
  ikon `#F50103` kullanıyor) — ilgili Elementor CSS dosyaları (`post-12302.css`,
  `post-24918.css`) bu elemente yönelik hiçbir fill override'ı içermiyor,
  yani bu CSS'le ezilen bir varsayılan değil, kaynağın kendi tasarım
  tutarsızlığı/kararı. **Koddaki mevcut yorum zaten bunu önceden not
  etmişti** (`IdenfitIcons.tsx`) — bulgu kullanıcıya raporlandı, kullanıcı
  diğer 3 ikonla görsel tutarlılık için **bilinçli olarak kaynaktan
  sapılıp** `PlugIcon`'un daire rengini `var(--color-brand)`'a çevirmeye
  karar verdi (`#F4CCCE` → marka kırmızısı, diğer iki dairesel ikonla
  aynı token).
- **Test:** `astro check` 0 hata, `astro build` 188 sayfa hatasız.
  `test-urunler-menu-links.mjs` 108/108, `test-legal-nl-consistency.mjs`
  18/18, `test-sector-language-switch.mjs` 36/36, `test-faq-language-switch.mjs`
  9/9, `test-product-language-switch.mjs` 56/56, `test-no-external-idenfit-links.mjs`
  296 dosyada 0 sorun — hiçbiri etkilenmedi. `/en/hesaplama-araclari/` ve
  `/it/hesaplama-araclari/` hem dev server hem prod build çıktısında
  doğru TR hedefine redirect olduğu curl ile doğrulandı, NL'in mevcut
  fallback zinciri (`/nl/tesekkurler/` → `/en/thanks/`) regresyon
  yaşamadı. `astro.config.mjs` değiştiği için proje kuralı gereği
  `npm run dev:clean` ile tam restart yapıldı (soft-restart'a
  güvenilmedi).

**Hesaplama Araçları — 2 küçük düzeltme: hero illüstrasyonu + akordeon
varsayılan durumu (2026-07-23).**

- **Hero illüstrasyonu bulundu ve eklendi.** Önceki taramada (`content.rendered`
  + canlı sayfanın tam HTML'i) bulunamamıştı çünkü WP REST API yalnızca
  HTML döndürüyor — asıl görsel sayfaya özel DERLENMİŞ Elementor CSS
  dosyasında (`wp-content/uploads/elementor/css/post-22563.css`, post
  ID'siyle eşleşiyor) `.elementor-element-01c9f6a` seçicisine
  `background-image` olarak tanımlıydı. Bu CSS dosyası ayrıca çekilip
  içinde aranarak bulundu (`header-bg-2x.png`, 1110×1046, doğrulanmış
  çalışan URL). `CalculatorsPage.astro`'ya kaynaktaki gibi dekoratif bir
  arka plan olarak eklendi (`alt` gerekmiyor) — yalnızca `lg:` ve üstü
  genişlikte sağda gösteriliyor (dar ekranda metinle çakışmaması için,
  kaynağın kendisinde de muhtemelen böyle bir uyarlama var ama tam mobil
  CSS'i incelenmedi). URL, bir Tailwind arbitrary-value sınıfı DEĞİL bilerek
  inline `style` ile veriliyor — JS değişkenine enterpolasyon içeren
  `bg-[url('${...}')]` gibi bir sınıfı Tailwind'in derleme-zamanı salt METİN
  tarayıcısı tanıyamaz (kaynak dosyada gerçek URL değil yalnızca değişken
  adı görünür) — bu ilk denemede fark edilip düzeltildi.
- **Akordeon varsayılan durumu — gerçek bir bug bulundu ve düzeltildi.**
  `calculator-anchor.js`'in ilk sürümü yalnızca hash VARSA akordeon
  AÇIYORDU, hash YOKKEN hiçbir şey KAPATMIYORDU. Bu, "anchor'lı bir linkten
  gel (ör. mega-menüden) → sonra tarayıcı geri tuşuyla ya da hash'siz bir
  linke tıklayarak anchor'sız hale dön" senaryosunda önceden açılmış
  akordeonun kapanmadan kalmasına yol açıyordu — bu geçiş AYNI SAYFA
  içinde hash'in kaldırılmasıdır (tarayıcı tam sayfa yeniden yükleme
  YAPMADAN `hashchange` olayıyla ele alır), bu yüzden anchor'sız bir
  ziyaret bile önceki bir gezinme adımından kalan açık akordeonu
  gösterebiliyordu. **Düzeltme:** script artık her çağrıda TÜM
  akordeonların durumunu hash'e göre YENİDEN SENKRONİZE ediyor (yalnızca
  eşleşen açık, gerisi kapalı; hash boşsa hepsi kapalı) — tek yönlü "aç"
  yerine simetrik "senkronize et" mantığı. Düzeltme sırasında İKİNCİ bir
  hata daha bulundu: yeni selector (`> div > details`, doğrudan çocuk)
  hiçbir şey eşleştirmiyordu çünkü `<details>` React'in `<astro-island>`
  sarmalayıcısı İÇİNDE render ediliyor — `.querySelector('details')`
  (ara elemanlardan bağımsız) ile düzeltildi.
- **Test (Playwright, geçici kurulum, iş bitince kaldırıldı):** 4 senaryo
  gerçek tarayıcıda doğrulandı — (1) anchor'sız giriş → 0 akordeon açık,
  (2) `#gelir-vergisi` ile giriş → yalnızca o açık, (3) hash aynı-doküman
  temizlenince → kapanıyor (bulunan asıl bug), (4) `#fazla-mesai`'den
  `#kidem-tazminati`'ye aynı-doküman geçiş → öncekisi kapanıp yenisi
  açılıyor. Hero illüstrasyonu masaüstü genişlikte görünür doğrulandı.
  KEŞFET menüsünün Hesaplamalar linklerinin `target="_blank"` almadığı
  (aynı sekmede kaldığı, zaten doğruydu) teyit edildi. `astro check` 0
  hata, `astro build` 188 sayfa hatasız, regresyon testleri temiz.

**Vite bağımlılık önbelleği bozulması — kök neden bulundu, KALICI çözüm
uygulandı (2026-07-23).** Bu proje boyunca en az 3-4 kez tekrarlayan
"navbar/modüller kayboldu, elle temizleyip yeniden başlatınca düzeliyor"
sorunu artık yalnızca not edilmedi, gerçek kök nedeni bulunup otomatik bir
önlemle kapatıldı.

- **Yakalanan hata:** Dev server logları `astro:server-app.js` yükleme
  hatasıyla başlayan bir "program reload" zinciri gösterdi, ardından
  SİTE GENELİNDEKİ TÜM React component'leri (`MarqueeBar`, `HeroForm`,
  `LanguageSwitcher`, `MegaMenu`, `MobileMenu`) `TypeError: _jsxDEV is not
  a function` hatasıyla çöktü — bir component'e özel değil, JSX runtime'ının
  KENDİSİ bozulmuştu.
- **Kök neden:** Bu, bilinen bir Astro/Vite hatası
  ([withastro/astro#15952](https://github.com/withastro/astro/issues/15952)) —
  Vite'ın `optimizeDeps` mekanizması dev server ÇALIŞIRKEN yeni/değişmiş
  bir bağımlılık algılarsa canlı süreçte "optimized dependencies changed,
  reloading" tetikleyip kendi kendine yeniden derleme yapıyor; bu döngü
  bazen yarım kalıp JSX runtime'ını kalıcı olarak bozuyor. **Bu projede asıl
  tetikleyici: `npm install`/`npm uninstall` (ör. Playwright'ı geçici
  kurup kaldırmak, bu oturumda ve önceki turlarda birkaç kez yapıldı) dev
  server ÇALIŞIRKEN yapılıyordu** — bu işlemler paylaşılan bağımlılıkları
  (`esbuild` — hem Vite'ın hem Playwright'ın postinstall log'larında ortak
  çıktığı doğrulandı) yeniden kurup canlı Vite sürecinin önbellek/modül
  grafiğini tutarsız bırakıyordu. Önceki turlarda yalnızca "elle
  `node_modules/.vite` sil + yeniden başlat" ile GEÇİCİ olarak çözülüyordu
  — ama bu, sonraki bir npm install/uninstall'da tekrar tetikleniyordu,
  kalıcı değildi.
- **Kalıcı çözüm — iki katmanlı:**
  1. `astro.config.mjs`'e `vite.optimizeDeps.force: true` eklendi — dev
     server HANGİ yöntemle başlatılırsa başlatılsın HER başlangıçta
     bağımlılık önbelleğini otomatik sıfırdan kurar (stale disk önbelleği
     sınıfının TAMAMINI, elle müdahale gerekmeden ortadan kaldırır; bedeli
     her başlangıçta ~1-3 saniye ekstra optimize süresi).
  2. Yeni `scripts/dev-clean-restart.mjs` + `npm run dev:clean` (durdur +
     `dist`/`node_modules/.vite` temizle + arka planda yeniden başlat, TEK
     komut) + `predev` npm hook'u (yalnızca `npm run dev` için önbellek
     temizliği) — özellikle **npm install/uninstall SONRASI** (canlı
     sürece dokunmadan ÖNCE server'ı durdurma disiplini artık zorunlu
     kural, bkz. §"Proje kuralları") kullanılacak tek komutluk güvence.
- **Doğrulama:** Sorunu tetikleyen TAM senaryo bilerek tekrarlandı — dev
  server durdurulup Playwright kuruldu, `npm run dev:clean` ile yeniden
  başlatıldı, Playwright'ın KENDİSİYLE (4 ardışık sayfa ziyareti + gerçek
  mega-menü tıklaması + hero form input testi) **0 hata** doğrulandı;
  Playwright kaldırılıp `npm run dev:clean` tekrar çalıştırıldı, yine 0
  hata. `astro build` sonrası `npm run dev:clean` ile dönüş de ayrıca
  test edildi (`dist` temizliği dahil). `astro check` 0 hata, `astro
  build` 188 sayfa hatasız, `test-urunler-menu-links.mjs` 108/108 —
  regresyon yok.

**⚠️ GÜNCELLEME — yukarıdaki çözüm YETERSİZ çıktı, gerçek/tam kök neden
bulundu ve KESİN olarak kapatıldı (2026-07-23, aynı gün).** Sorun kısa
süre sonra **npm install/uninstall OLMADAN, hiçbir müdahale yapılmamışken**
kendiliğinden tekrarladı — bu, `optimizeDeps.force: true`'nun (yalnızca
SOĞUK BAŞLANGIÇTAKİ disk önbelleğini düzeltir) sorunun yalnızca BİR
tetikleyicisini (npm install sonrası bayat önbellek) kapattığını, asıl
genel kök nedeni kapatmadığını ortaya çıkardı.

- **Gerçek/tam kök neden:** Vite'ın bağımlılık TARAYICISI varsayılan olarak
  yalnızca ZİYARET EDİLEN sayfalardan erişilebilen import'ları keşfeder
  ("lazy discovery"). Bu projede 10 ayrı React island giriş noktası
  (her sayfa kendi component kombinasyonunu kullanıyor) olduğu için, dev
  server ÇALIŞIRKEN o oturumda HENÜZ HİÇ ziyaret edilmemiş bir sayfaya
  (ör. `/hesaplama-araclari/`) ilk girildiğinde, Vite o sayfanın
  kullandığı bir paketi "yeni keşfedilen bağımlılık" sayıp CANLI SÜREÇTE
  "optimized dependencies changed, reloading" tetikliyordu — bu, `force:
  true`'nun etki alanının TAMAMEN DIŞINDA bir olay (sunucu zaten
  çalışırken gerçekleşiyor, başlangıç önbelleğiyle ilgisi yok) ve
  withastro/astro#15952 hatasını yine aynı şekilde tetikleyip JSX
  runtime'ını bozuyordu. Loglarla doğrulandı: hatasız bir başlangıçtan
  hemen sonra, tam olarak `/hesaplama-araclari/`'ye (o oturumda ilk kez
  ziyaret edilen sayfa) yapılan istekte "program reload" tetiklendi.
- **Kalıcı çözüm — üçüncü katman:** `vite.optimizeDeps.include: ['react',
  'react-dom', 'react-dom/client', 'lucide-react']` eklendi — bu proje
  yalnızca bu 4 harici paketi kullanıyor (`astro:i18n` hariç, o Astro'nun
  kendi sanal modülü), hepsi artık HANGİ SAYFA önce ziyaret edilirse
  edilsin dev server BAŞLANGICINDA koşulsuz pre-bundle ediliyor — "sürpriz
  mid-session keşfi" için hiçbir paket kalmadı.
- **Denenip TERK EDİLEN bir alternatif (önemli ders):** Önce
  `optimizeDeps.entries: ['src/**/*.{astro,ts,tsx}']` ile TÜM proje kaynak
  dosyalarını başlangıçta tarayıp `include`'a hiç gerek kalmadan otomatik
  keşfetmek denendi — bu KIRILGAN çıktı: Vite'ın `.astro` dosyalarını
  tarama eklentisi, `FaqPage.astro`'daki sıradan bir TÜRKÇE YORUM satırını
  (`.classList.add(...)` örneği içeren metin, gerçek kod DEĞİL) yanlış
  ayrıştırıp TÜM taramayı `[PARSE_ERROR]` ile başarısız kıldı (Vite bu
  hatayı tolere edip `include` listesine düştü, ama `entries` kendi
  başına güvenilmez olduğunu kanıtladı). `entries` konfigürasyondan
  kaldırıldı, yalnızca `include` (parse/tarama gerektirmeyen, doğrudan
  paket-adı listesi) kullanılıyor. Kırılgan yoruma neden olan satır da
  ayrıca düzeltildi (kod-benzeri metin içeren yorumlardan kaçınmak genel
  bir iyi pratik olarak not edildi).
- **Ek bulgu (ilgisiz ama temizlendi):** Kök neden araştırması sırasında
  önceki bir oturumdan kalma zombi bir `astro preview --port 4322` süreci
  bulundu (farklı port, dev server'la doğrudan ilgisiz ama gereksiz
  kaynak kullanıyordu) — `Stop-Process` ile öldürüldü.
- **Doğrulama — tam sıfırdan kurulum + 3 ardışık durdur/başlat/kontrol
  döngüsü:** Dev server süreci PowerShell'den `Get-CimInstance`/`Stop-Process`
  ile TAMAMEN öldürüldü (yalnızca `astro dev stop` değil), `node_modules`
  + `dist` + `.astro` TAMAMEN silindi, `npm install` server KAPALIYKEN
  sıfırdan çalıştırıldı (önceki kök nedenin TAM TERSİ senaryo — npm
  install'ın canlı sürece etki etmediğinden emin olmak için). Ardından 3
  döngü: (1) temiz başlangıç → **daha önce hiç ziyaret edilmemiş**
  `/hesaplama-araclari/`'ye ilk istek → loglarda "program reload" YOK; (2)
  Playwright kurulumu (server durdurulmuş halde) → `dev:clean` → gerçek
  tarayıcıda hero formu dolduruldu + ekran görüntüsü alındı (MarqueeBar +
  tam navbar + hero form hepsi görünür/işlevsel) → 0 hata; (3) Playwright
  kaldırıldı → `dev:clean` → her iki sayfa yine 0 hatayla 200. `astro
  check` 0 hata, `astro build` 188 sayfa hatasız, regresyon testleri
  temiz. **Bu üçüncü doğrulama turunda hiçbir aşamada `_jsxDEV`/`astro:
  server-app.js` hatası bir daha görülmedi.**

**⚠️ İKİNCİ GÜNCELLEME — sorun ÜÇÜNCÜ kez, hiçbir bilinen tetikleyici
olmadan tekrarladı; kalıcı çözüm `astro` sürüm güncellemesiyle sağlandı
(2026-07-23, aynı gün).** Yukarıdaki `force`+`include` çözümü 3 doğrulama
turunu geçmesine rağmen, bir SONRAKİ oturumda (kullanıcının "ÜRÜNLER/
SEKTÖRLER/KURUMSAL/KEŞFET menüden kayboldu" raporuyla) **npm install YOK,
yeni sayfa ziyareti YOK** — sunucu başlangıcından hemen sonra, ilk `/`
isteği başarıyla dönmesine RAĞMEN kendiliğinden bir "program reload"
tetiklendiği log'larda görüldü. Bu, `include` listesinin (4 bilinen paket)
KAPSAMADIĞI bir tetikleyicinin de var olduğunu kanıtladı — üç config
katmanı da (force, include, terk edilen entries) sorunun SIKLIĞINI azalttı
ama Vite'ın kendi mekanizmasındaki (withastro/astro#15952) asıl hatayı
proje-seviyesi config'le tam kapatmak mümkün değildi.

- **İlk adım — teşhis (kullanıcı talimatı: önce git'e bak):** `git status`/
  `git diff` ile `navigation.ts`/`Header.astro`/`MegaMenu.tsx` kontrol
  edildi — üçü de `??` (untracked). `git ls-files` ile doğrulandı:
  `src/` altında yalnızca projenin İLK Astro iskeletinden 5 dosya
  (`src/assets/astro.svg`, `background.svg`, `Welcome.astro`,
  `layouts/Layout.astro`, `pages/index.astro`) tracked — **sitenin gerçek
  kodunun neredeyse tamamı (Header.astro dahil ~150+ dosya) hiç commit
  edilmemiş**, bu yüzden `git diff` bu soruyu cevaplayamıyor (not: bu proje
  boyunca hiç commit atılmadı, tek commit "Initial commit from Astro").
  Kaynak kodun kendisi doğrudan okunarak (`nav.ts`) 8 menü öğesinin
  eksiksiz olduğu, ayrıca o anki SSR çıktısının (`curl`) da tam ve doğru
  olduğu doğrulandı — **kod hiçbir zaman bozulmamıştı**, yalnızca
  bug'ın vurduğu ANDAKİ client hydration'ı bozuktu (log'larda
  `_jsxDEV is not a function` + `program reload` kanıtlandı).
- **Kalıcı çözüm — config katmanı yerine kaynağı düzeltme:** `npm view
  astro version` ile `7.1.3`'ün mevcut olduğu görüldü (proje `7.0.9`'daydı,
  minor/patch fark). Bu sınıfta canlı-yeniden-derleme hataları genelde
  upstream'de patch'lenir; kullanıcı onayıyla **`astro` `7.0.9` → `7.1.3`**
  güncellendi (`npm install astro@7.1.3`, ardından `esbuild`'in postinstall
  script'i `npm approve-scripts esbuild` ile onaylandı — `.npmrc`'nin
  `allow-scripts` ayarı yeni/değişen native bağımlılıkları otomatik
  onaylamıyor).
- **Doğrulama — 3 ardışık durdur/temizle/başlat/kontrol döngüsü (güncelleme
  SONRASI, sıfırdan):** Her döngüde `npm run dev:clean` ile tam temiz
  başlangıç + o döngüde **daha önce hiç ziyaret edilmemiş** 5-7 farklı
  sayfa (`/hesaplama-araclari/`, `/gida-sektoru-ik-cozumleri/`, `/it/`,
  `/musteriler/`, `/fiyatlar/`, `/sss/`, `/pdks-modulu/`, `/nl/`,
  `/donanim/`, `/hakkimizda/`, `/kurumsal-takvim-modulu/`, `/it/faq/`,
  `/en/hardware/`, `/iletisim/` — 3 turda toplam 17 farklı sayfa) ziyaret
  edildi, her turda `astro dev logs` "program reload"/`_jsxDEV` hatası
  içermediği doğrulandı. **3/3 döngü tamamen temiz** — `astro v7.1.3
  ready` log'u + hiçbir reload olayı yok. Son olarak ana sayfanın SSR
  çıktısı tekrar doğrulandı: 25 astro-island, hero form + marquee (8
  occurrence) eksiksiz.
- **Ders/kural:** Bu sınıf bug (Vite'ın canlı optimize-deps yeniden
  yüklemesi) proje-seviyesi `optimizeDeps` config'iyle YALNIZCA
  hafifletilebiliyor, kaynağı bir upstream Astro/Vite hatası olduğu için
  kalıcı/tam çözüm için **güncel Astro sürümünü takip etmek** gerekiyor.
  Bundan sonra bu sınıf bir reload/hydration hatası tekrar görülürse,
  önce `npm outdated astro` / `npm view astro version` ile güncel bir
  sürüm olup olmadığı kontrol edilmeli — config'e dördüncü bir katman
  eklemeye çalışmak yerine.

**⚠️ ÜÇÜNCÜ GÜNCELLEME — asıl tetikleyici bulundu: `astro.config.mjs`'i dev
server ÇALIŞIRKEN düzenlemek Astro'nun DAHİLİ "soft restart"ını tetikliyor,
bu da AYNI bug'a düşüyor (2026-07-23, aynı gün).** `astro@7.1.3`
güncellemesi + 3 temiz doğrulama döngüsünden HEMEN SONRA, aynı sunucu
(server yeniden başlatılmadan) `astro.config.mjs`'e bu güncellemeyi
belgeleyen bir yorum eklendi (bkz. yukarıdaki `optimizeDeps` bloğunun
üstündeki yorum) — dosya diskte değişince Astro'nun kendi dahili
config-watcher'ı `"Configuration file updated. Restarting..."` log'uyla
OTOMATİK bir "soft restart" yaptı. Bu soft restart, `npm run dev:clean`'in
yaptığı TAM process kill + yeniden başlatmadan **farklı, daha zayıf bir
kod yolu** — ve loglarda kanıtlandığı gibi AYNI `program reload` →
`astro:server-app.js` yükleme hatasına düştü. Bu kez sonuç daha da
kötüydü: restart "tamamlandıktan" SONRA bile (`"server restarted."` log'u
görüldükten sonra) React modülünün kendisi bozuk kaldı
(`TypeError: Cannot read properties of null (reading 'useState')` —
`_jsxDEV is not a function`'dan farklı, daha derin bir modül-çakışması
hatası) — ve kullanıcı fark edip bildirene kadar (~20 dakika, uptime log'u
ile doğrulandı) sunucu bu bozuk durumda kalmaya devam etti, HİÇ kendi
kendine düzelmedi.
- **Kalıcı kural (yeni, kritik):** `astro.config.mjs` (Astro'nun izlediği
  herhangi bir config dosyası) dev server ÇALIŞIRKEN düzenlenirse,
  Astro'nun kendi otomatik "Configuration file updated. Restarting..."
  soft-restart'ına GÜVENİLMEMELİ — bu yol da `withastro/astro#15952`
  sınıfı bug'a açık ve kendi kendine toparlanmıyor. **Config dosyasını
  düzenledikten SONRA mutlaka `npm run dev:clean` ile TAM bir process
  kill+restart yapılmalı** (soft-restart'ın "server restarted." log'una
  güvenip bırakılmamalı). Bu, `npm install`/`uninstall` kuralıyla aynı
  disipline ekleniyor (bkz. §"Proje kuralları").
- **Doğrulama:** `npm run dev:clean` ile tam restart sonrası `/`, `/en/`,
  `/hesaplama-araclari/`, `/musteriler/` — 4 istek, 0 hata, loglar temiz.

**Hesaplama Araçları sayfası (`/hesaplama-araclari/`) gerçek içerikle
kuruldu — 8 hesap makinesi, tamamı client-side (2026-07-23).** Kaynak
sitede `/hesaplama-araclari/` **yalnızca TR'de var** (`pages.json` id
22563, `pll_translations: {"tr":22563}` — `/en/`/`/it/` önekli URL'ler
301 ile bare TR sayfasına yönleniyor, gerçek çevirisi yok). **Kullanıcı
kararıyla bu turda yalnızca TR kuruldu, EN/IT KARAR 2 kapsamında
ertelendi.**
- **Kaynak inceleme:** Sayfa tek bir Elementor `<details>` akordeonu, her
  aracın kendi `<script>` bloğunda saf jQuery/DOM formülü var —
  **backend/API çağrısı YOK**, "Hesapla" butonu `e.preventDefault()` ile
  yakalanıp sonuç bir modal'da (`window.idResultModal`) gösteriliyor.
  `scripts/extract-calculators.mjs` (network YOK, `pages.json`'dan) yalnızca
  METİN içeriğini (başlık/ikon/not, `<details id="title-N">` sınırlarına
  göre bölüm bazlı ayrıştırılarak — düz sıralı regex bir aracın notunun
  eksik olmasından dolayı YANLIŞ hizalanmıştı, düzeltildi) çıkarıp
  `reference/wordpress-export/calculators.json`'a yazıyor; **form alanları
  ve hesaplama FORMÜLLERİ** kaynağın jQuery koduna tek tek bakılıp elle
  `src/data/calculatorDefinitions.ts`'e TypeScript olarak taşındı (ham JS
  hiç import/eval edilmedi — projedeki CTA/slug çözümleme mantığıyla aynı
  ilke).
- **Bulunan gerçek kaynak veri karakteristikleri (düzeltilmedi, olduğu gibi
  taşındı):** Gelir Vergisi'nin "Ücret dışı gelirler" seçeneği kaynakta BOŞ
  bir vergi dilimi tablosuna sahip (seçilirse sonuç her zaman 0 çıkar);
  Kurumlar Vergisi'nin yıl seçimi 2006-2025 arası (2026 seçeneği YOK);
  İşveren Maliyeti'nde "Asgari Ücretli"/"Diğer Ücretli" SGK oranı açısından
  aynı hesaplanıyor. Yıl-bağımlı sabitler (asgari ücret, vergi dilimleri,
  SGK oranları, kıdem tavanı `46655.43`) `YEAR_CONSTANTS` altında TEK
  yerde toplandı (yıl değişince — idenfit'in kendisi de canlı API'den
  çekmiyor, elle güncelliyor — tek dosyadan güncellenir).
- **Mimari:** `CalculatorAccordion.tsx` (React, `client:visible`) —
  `slug: string` prop alıp `CALCULATOR_DEFINITIONS`'tan kendi tanımını
  bulur. **Bulunan gerçek bug:** ilk sürüm tam `CalculatorDefinition`
  nesnesini (içinde `calculate`/`visibleWhen` FONKSİYONLARI olan) prop
  olarak geçiriyordu — Astro'nun astro-island prop serileştirmesi (SSR→
  client JSON) fonksiyonları TAŞIYAMIYOR, client'ta bu alanlar `undefined`
  olup sunucudakinden FARKLI bir görünür-alan kümesi hesaplanıyor, bu da
  React hydration mismatch'ine yol açıyordu. Düzeltme: yalnızca `slug`
  (düz string) prop olarak geçiriliyor, tanım (fonksiyonlar dahil) her iki
  tarafta da kendi `import`'undan çözülüyor. Sonuç modalı `document.body`'ye
  `createPortal` ile taşınıyor (mobil menüdeki `backdrop-filter` dersi
  baştan uygulandı). Tarih alanları kaynaktaki DD/MM/YYYY maskeleme yerine
  native `<input type="date">` (daha güvenilir parse, aynı sonuç).
- **KEŞFET mega-menüsü:** "Hesaplamalar" kolonu önceden 8 düz metin öğesi +
  TEK paylaşılan href'ti (`sublist` tipi) — artık `links` tipine çevrilip
  her biri kendi aracının anchor'ına bağlandı (`hesaplama-araclari#fazla-mesai`
  vb., Donanım'daki `lWithHash()` deseniyle aynı yöntem). Anchor'a
  gelindiğinde ilgili `<details>`'ı otomatik açan küçük bir vanilla script
  eklendi (`src/scripts/calculator-anchor.js`, `faq-tabs.js`/`scroll-reveal.js`
  ile aynı desen).
- **Test (Playwright, geçici kurulum, iş bitince kaldırıldı):** 8 aracın
  6'sı gerçek girdilerle elle hesaplanıp doğrulandı (Fazla Mesai standart+
  under-45 varyantı, Maaş Zammı, Kurumlar Vergisi, İşveren Maliyeti, Gelir
  Vergisi'nin "ücret dışı" 0-sonuç davranışı, İhbar Süresi, Kıdem
  Tazminatı) — **hepsi elle hesaplanan beklenen değerlerle birebir
  eşleşti**. Koşullu alan görünürlüğü (Fazla Mesai'nin 45-saat-altı
  alanları, Yemek Ücreti'nin nakit-ödemede KDV alanını gizlemesi) 
  doğrulandı. Bu süreçte **2 gerçek bug** bulunup düzeltildi: yukarıdaki
  hydration mismatch'i, ve K.G.V.M alanının "(opsiyonel)" etiketlenmesine
  rağmen zorunlu sayılması (yeni `CalculatorField.optional` bayrağı
  eklendi). `astro check` 0 hata, `astro build` 188 sayfa hatasız,
  `test-urunler-menu-links.mjs` 108/108, `test-no-external-idenfit-links.mjs`
  0 sorun — regresyon yok.
- **Bilinen küçük eksik:** Hero illüstrasyonu için doğrulanmış bir görsel
  URL'i bulunamadı (muhtemelen harici Elementor CSS dosyasında,
  `content.rendered`'da yok) — icat edilmedi, sayfa başlık+açıklama ile
  kuruldu, görsel yok.

**Hero form Vite cache sorunu (2026-07-23).** Ana sayfadaki hero formu
(İsim Soyisim/Telefon/Firma Adı/Mail) görsel olarak kaybolmuş görünüyordu.
HTML'de tam ve doğru render edildiği doğrulandı (kaynak kodda sorun
yoktu) — standart çözüm (`node_modules/.vite` + `dist` temizlenip dev
server temiz yeniden başlatıldı) uygulandı, kullanıcı tarafından
doğrulandı.

**Teşekkürler sayfası migrate edildi (2026-07-23).** Online Sunum Talebi
formu gönderildikten sonra kaynak sitede gösterilen "Demo – Teşekkürler"
sayfası (`pages.json` id 15810/en 15856/it 23535, `/tesekkurler/`) 3 dilde
(TR/EN/IT, NL kaynakta yok) kuruldu. ACF'i TAMAMEN BOŞ (391 alanın hepsi
null) — gerçek içerik Elementor `content.rendered`'da, bu yüzden diğer
sayfalardaki gibi bir extraction script'i değil, Ana Sayfa bölümleriyle
aynı yaklaşım (elle transkripsiyon → `src/data/thankYouContent.ts`,
i18n şemasına DOKUNULMADI — `SECURITY_META` ile aynı desen, yalnızca
tr/en/it anahtarlı düz bir kayıt) kullanıldı. İçerik: başlık+metin+2 CTA
(Anasayfa/Neden İdenfit) + hero görseli + YouTube kanalı daveti + marka
şeridi + **2 müşteri video kartı (Civil + Femaş — `/musteriler/`deki AYNI
2 gerçek YouTube videosu, ama alıntı metni bu sayfaya özel/daha kısa bir
versiyon)**. **Bulunan kaynak veri hatası:** EN/IT'de "Why idenfit?"/"Perché
idenfit?" linkinin METNİ doğruyken HEDEFİ yanlışlıkla Müşteriler sayfasına
(`/customers/`/`/clienti/`) gidiyordu (yalnızca TR doğruydu) — ham href'e
güvenilmeyip `getWhyIdenfitSlug()` üzerinden doğru hedefe bağlandı (projenin
CTA çözümleme ilkesiyle tutarlı). Per-locale slug'lar FARKLI (`tesekkurler`/
`thanks`/`grazie`) — `astro.config.mjs`'e `/nl/tesekkurler` → `/en/thanks`
elle redirect'i eklendi (KVKK ailesindeki aynı desen), `getThankYouLocaleUrls()`
NL'i EN'e eşitliyor. **⚠️ Form gönderiminden bu sayfaya OTOMATİK yönlendirme
YOK** (kullanıcının açık talimatı — `HeroForm.tsx` backend'siz olduğu için
bağlanamaz, Faz 2 TODO'su, bkz. §"Açık noktalar" madde 2).

**Test:** `astro check` 0 hata, `astro build` 187 sayfa hatasız. 3 dilin
`<title>`/H1/"Neden idenfit?" linkinin doğru hedefe gittiği + 2 video
iframe'inin render edildiği curl ile doğrulandı. NL hem `301` redirect
hem dil değiştirici üzerinden `/en/thanks/`e gidiyor. Regresyon:
`test-no-external-idenfit-links.mjs` (225 dosya, 0 sorun),
`test-urunler-menu-links.mjs` 108/108 — etkilenmedi.

**`app.idenfit.com` CTA'ları artık aynı sekmede açılıyor (2026-07-23,
kullanıcı düzeltmesi).** Fiyatlar sayfasının Mikro/KOBİ CTA'ları (dış
domain `app.idenfit.com`'a gidiyor) yanlışlıkla `target="_blank"` alıyordu
— kaynak idenfit.com'da bu linkler AYNI SEKMEDE devam ediyor. Kök neden:
`resolveCtaUrl()`'ün `external` alanı hem "URL dönüştürülmedi" hem "yeni
sekmede aç" anlamına geliyordu, ikisi aslında FARKLI şeyler. Yeni `newTab`
alanı eklendi — `app.idenfit.com` (`SAME_TAB_EXTERNAL_HOSTNAMES`) dış link
sayılır ama `newTab:false`; workmana.com/HRTech Alliance gibi tamamen ayrı
marka/sitelere giden GERÇEK dış linkler `newTab:true` kalır (değişmedi).
`pricingContent.ts`/`hubContent.ts`'in `ctaExternal` alanları artık
`newTab`'dan besleniyor. Bkz. §"Mimari — CTA URL çözümleme" için güncel
alan tanımı.

**Test:** `astro check` 0 hata, `astro build` 184 sayfa hatasız. 4 dilin
Fiyatlar sayfasında Mikro/KOBİ linklerinin `target`/`rel` almadığı, Pro
planının hâlâ iç link olduğu, workmana.com/HRTech Alliance linklerinin
hâlâ `target="_blank"` aldığı curl ile (hem dev server hem prod build
çıktısı üzerinden) doğrulandı. Regresyon: `test-no-external-idenfit-links.mjs`
0 sorun, `test-urunler-menu-links.mjs` 108/108 — etkilenmedi.

**🎉 Site denetim raporu tamamen kapandı — kalan Orta 2 madde düzeltildi
(2026-07-23).** Güvenlik sayfası (`SecurityPage.astro`) hem `<title>` hem
meta description hem de (dolaylı olarak) sektör sayfasıyla çakışan başlık
sorunu için tek kaynaklı `t.footer.links.about.security` ("Güvenlik"/
"Security"/"Sicurezza" — kısa footer menü etiketi) kullanıyordu. Yeni
`getSecurityMeta(locale)` (`miscPagesContent.ts`) sayfanın gerçek
içeriğinden (6 madde: KVKK/GDPR, Bilgi Güvenliği Politikası, Çerez
Politikası, Veri Sahibi Başvuru Formu, çalışan/iş ortağı aydınlatma
metinleri) türetilmiş, 3 dilde gerçek `pageTitle`/`description` döndürüyor
— `SecurityPage.astro`'ya yeni opsiyonel `pageTitle`/`description` prop'ları
eklendi (verilmezse eski `title` davranışına düşer), 3 route dosyası
(`guvenlik.astro`, `en/security-policy.astro`, `it/politica-di-sicurezza.astro`)
güncellendi. H1 kasıtlı olarak kısa etiket olarak KALDI (yalnızca `<title>`/
description zenginleştirildi) — sonuç: `/en/security-policy/`'nin `<title>`'ı
artık `/en/security-sector-hr-solutions/`'dan (sektör sayfası, "Security")
ayırt edici ("Security & Data Protection Policies"), description'lar 3
dilde de anlamlı birer cümle. **Denetim raporundaki 14 maddenin tamamı
artık kapalı** — 11'i düzeltildi, 1'i (Turizm IT H1'i) kullanıcı kararıyla
bilinçli bırakıldı, 2'si zaten aksiyon gerektirmiyordu (hydration konsol
uyarısı, bilinen içerik boşlukları).

**Test:** `astro check` 0 hata, `astro build` 184 sayfa hatasız. 3 dilin
`<title>`/description'ı curl ile doğrulandı, sektör sayfasıyla title
çakışmasının kalktığı doğrulandı, H1'in değişmediği doğrulandı.
Regresyon: `test-legal-nl-consistency.mjs` 18/18, `test-no-external-idenfit-links.mjs`
0 sorun, `test-sector-language-switch.mjs` 36/36 — hiçbiri etkilenmedi.
Dev server temizlenip yeniden başlatıldı, loglar hatasız.

**Site denetim raporunun Kritik 3 + Yüksek 6 maddesi düzeltildi (2026-07-23).**
`docs/site-audit-report.md`'deki 14 bulgunun 9'u (tüm Kritik+Yüksek)
düzeltildi, her biri regresyon testleriyle doğrulandı — kalan 5 madde
(Orta/Bilgi) için bkz. §"Açık noktalar" madde 1.

- **Fiyatlar CTA'ları:** `productContent.ts`'e paylaşılan `resolveCtaUrl()`
  eklendi — hostname tam `idenfit.com` değilse (ör. `app.idenfit.com`,
  `my.idenfit.com`) URL'i dokunmadan dış link (`external:true`) sayar.
  `pricingContent.ts` bunu kullanıyor, Mikro/KOBİ CTA'ları artık 4 dilde
  doğru `app.idenfit.com/register/{micro,sme}/?lang=xx` hedefine
  `target=_blank` ile gidiyor. `hubContent.ts`'in `resolveTileCta()`'sı da
  bu paylaşılan fonksiyona geçirildi (aynı zamanda oradaki
  `.endsWith('idenfit.com')` — alt domainleri yanlışlıkla iç link sayan,
  henüz tetiklenmemiş — bug'ını da düzeltti).
- **Footer ÜRÜNLER kolonu:** `Footer.astro`'ya mega-menünün
  `productHref()`/`hardwareHref()` mantığının aynısı (`productFooterHref()`)
  taşındı — Özlük Dosyası'nın `-2` sonekli trSlug istisnası + Donanım'ın
  ayrı slug fonksiyonu dahil. 8 link × 4 dil = 32/32 artık 200.
- **Mobil menü akordeonu:** `Header.astro`'daki mega-menü çözümleme
  mantığı artık tek yerde hesaplanıp hem masaüstü `<MegaMenu>` hem
  `<MobileMenu>`'ye aynı veriyle besleniyor. `MobileMenu.tsx` yeniden
  yazıldı — ÜRÜNLER/SEKTÖRLER/KURUMSAL/KEŞFET gerçek, tıklanınca açılıp
  kapanan bir akordeon (links/sublist/cards kolon tiplerinin hepsi
  destekleniyor). **Ayrıca bulunan, önceden var olan bir bug:**
  `Header.astro`'nun `backdrop-blur` sınıfı (`backdrop-filter`), CSS
  spesifikasyonu gereği altındaki `position:fixed` elemanlar için
  containing block'u viewport yerine header'ın kendisi yapıyordu — mobil
  menünün overlay'i ve paneli header'ın ~100px'lik yüksekliğine
  sıkışıyordu (kısa link listesiyle fark edilmiyordu, akordeon içeriği
  uzayınca ortaya çıktı). **Düzeltme: overlay+panel artık `createPortal`
  ile `document.body`'ye taşınıyor** (`mounted` state'i ile SSR/hydration
  uyumsuzluğu olmadan) — bu, bu projede **kalıcı bir kural**: bundan sonra
  `backdrop-blur`/`filter`/`transform` içeren bir ata elemanın altına
  `position:fixed` bir dialog/modal/overlay eklenirse, `document.body`'ye
  portal'lanmalı.
- **2 İK Hub sayfası NL dil değiştirici:** `hubContent.ts`'in
  `getHubLocaleUrls()`'üne KVKK ailesindeki `localeUrlsFor()` düzeltmesinin
  aynısı eklendi (`nl` eksikse `en`'e eşitlenir). `test-legal-nl-consistency.mjs`
  genişletilip 2 hub sayfası da eklendi (kalıcı regresyon testi) — **18/18
  giriş noktası tutarlı**.
- **Ana sayfa Suprema + Video linkleri:** `SupremaSection.astro` artık
  `getHardwareSlug(locale)`, `VideoSection.astro` artık
  `getWhyIdenfitSlug(locale)` kullanıyor (ikisi de bare slug hardcode
  ediyordu) — EN/NL/IT'de doğru sayfaya gidiyor.
- **Şirket Takvimi + Sağlık IT görselleri:** `productTranslationOverrides.ts`'teki
  IT override'ları yazılırken TR'nin Türkçe karakterli (404 veren) dosya
  adları yanlışlıkla kopyalanmıştı — EN/NL/IT'nin ham verisinde zaten
  duran ASCII isimli çalışan dosyalarla değiştirildi (boyutlar doğrulandı,
  Şirket Takvimi'nin 1. görseli için TR'den yanlış kopyalanan boyut da
  düzeltildi: 1042×666 → gerçek 1032×668).
- **Özlük Dosyası TR+IT görselleri:** Kaynakta (`2025/08/özlükdos*@2x.png`)
  gerçekten kırık (canlı WP medya sunucusunda 404, bizim hatamız değil).
  EN/NL aynı görsellerin çalışan kopyasını (`2025/09/{1,2,3,4}@2x.png`)
  kullanıyor — TR'ye yeni bir override eklendi (metin ham veriyle aynı,
  yalnızca görseller), IT'nin mevcut override'ındaki görseller de
  düzeltildi.
- **Gıda + Hizmet sektörlerinin IT başlığı:** ACF `section_1_title` alanı
  gerçek sektör adı yerine WP'nin editör placeholder metnini ("Contenuti
  della Pagina") taşıyordu (Turizm'in boş H1'iyle aynı sınıf kaynak veri
  hatası, ama bu kez gerçek bir dil bile değil). `sectorContent.ts`'e
  küçük bir düzeltme haritası (`IT_HERO_TITLE_FIX`, `pricingContent.ts`'in
  `FEATURES_TITLE_FIX` deseniyle aynı) eklendi — TR kaynaktan gerçek
  İtalyanca: "Alimentare e Bevande" / "Servizi".

**Test (tamamı):** `astro check` 0 hata, `astro build` 184 sayfa hatasız.
Tüm regresyon script'leri geçti: `test-urunler-menu-links.mjs` 108/108,
`test-product-language-switch.mjs` 56/56, `test-sector-language-switch.mjs`
36/36, `test-faq-language-switch.mjs` 9/9, `test-legal-nl-consistency.mjs`
18/18 (2 hub dahil), `test-no-external-idenfit-links.mjs` 220 dosyada 0
sorun. Görsel URL'lerinin tümü canlı idenfit.com medya sunucusundan curl
ile 200 doğrulandı (eski kırık URL'lerin 404 verdiği de ayrıca teyit
edildi). Mobil menü akordeonu Playwright ile (geçici kurulum, iş bitince
kaldırıldı) gerçek tıklama+navigasyon senaryosuyla test edildi — 3
kategoride de aria-expanded doğru değişiyor, gerçek linkler görünüyor,
tıklama doğru sayfaya (gerçek H1 içerikli) gidiyor, konsol hatası yok.
Dev server her düzeltme turunda `node_modules/.vite` + `dist` temizlenip
temiz yeniden başlatıldı.

**KVKK/hukuki sayfalar + dış link taraması + FAQ entity hatası (2026-07-22).**
`miscPagesContent.ts`'in `localeUrlsFor()` fonksiyonu (KVKK/Tüketici
Hakları/Mesafeli Satış/Güvenlik'in ortak temeli) NL kaynağı olmayan
sayfalarda NL'i EN'e eşitleyecek şekilde düzeltildi — daha önce Header'ın
generic fallback'i sızıp giriş sayfasına göre değişen tutarsız/kırık NL
hedefleri üretiyordu. Site genelinde dış linke (idenfit.com) yanlışlıkla
giden linkler için production build taraması yapıldı
(`test-no-external-idenfit-links.mjs`) — 1 gerçek bug bulundu:
`sanayi-otomotiv-ik-cozumleri` sektörünün bir CTA'sında kaynak veri
hatasından (`#https://...`) kırık href; `bareSlugFromUrl()` artık baştaki
`#` karakterlerini temizliyor. IT/TR SSS'de numerik HTML entity'lerin
(`&#8217;` vb.) ham metin görünmesi `decodeEntities()`'in genelleştirilmesiyle
düzeltildi (yalnızca `&amp;` çözüyordu, artık tüm yaygın entity'ler).
Testler: `test-legal-nl-consistency.mjs` 12/12, `test-no-external-idenfit-links.mjs`
0 şüpheli link, FAQ entity düzeltmeleri curl ile doğrulandı.

**6 kritik hata bulundu ve düzeltildi (2026-07-22):**
- Hero formunun KVKK/Gizlilik onay metni gerçek kaynağa (ana sayfanın
  `banner_kvkk_metin` ACF alanı) dayanmıyordu, hiç link yoktu → yeni
  `KvkkNoticeLabels` şeması + `getKvkkAndTermsHrefs()` ile gerçek 2 linkli
  metin 3 form kullanan sayfaya eklendi.
- Hero'nun sağ kolon görseli placeholder'dı → gerçek ACF görseli
  (`HOME_HERO_IMAGE`, 4 dilde farklı) eklendi.
- **KVKK sayfası (`kisisel-verilerin-korunmasi`) hiç migrate edilmemişti**
  → TR/EN/IT route'landı (NL yok, elle redirect). Güvenlik sayfasının KVKK
  linki yanlışlıkla dış link sayılıyordu, düzeltildi.
- **"Online Sunum Talebi" CTA'sı — sitenin en kritik butonu — 404
  veriyordu** (hedef sayfa hiç kurulmamıştı). `PresentationRequestPage.astro`
  ile TR/EN/IT route'landı (canonical slug: `online-sunum-talebi`, tüm
  locale'lerde aynı — kaynaktaki farklı slug'lara rağmen bilinçli karar).
  Bu tek sayfa eklenmesiyle `localizeCtaUrl()` kullanan SİTEDEKİ HER CTA
  (20+ ürün, 12 sektör, hub, donanım, ana sayfa) otomatik düzeldi.
- **Fiyatlar sayfası (`fiyatlar`/`pricing`/`prijzen`/`prezzi`) hiç migrate
  edilmemişti** → `PricingPage.astro` ile 4 dilde route'landı (Mikro/KOBİ/Pro
  3 katmanlı tablo, `<details>` tabanlı JS'siz aç/kapa). Header/Footer
  "Fiyatlar" linkleri `getPricingSlug()`'a bağlandı.
- "Modüller" için ayrı sayfa yok — footer'ın "Fiyatlar ve Modüller" linki
  aynı `fiyatlar` slug'ına gidiyor, Fiyatlar sayfası düzelince otomatik
  çalıştı.

**SSS dil değiştirici + Hakkımızda migrasyonu (2026-07-22).** SSS'in NL
switcher hedefi (`getFaqLocaleUrls()`) EN yerine yanlış bare-slug
üretiyordu → NL artık doğrudan EN'in gerçek URL'ine eşitleniyor (KVKK'daki
aynı düzeltme paterni). **Hakkımızda sayfası da hiç migrate edilmemişti**
(yalnızca menü/footer linkleri vardı, arkasında sayfa yoktu) → 4 dilde
route'landı; EN'in tarihçe paragrafı kaynakta boştu (TR'den çevrilip
eklendi), IT tamamen EN kopyasıydı (TR'den gerçek İtalyanca çeviri
yazıldı).

**SSS sayfası yeniden tasarlandı (accordion → sekmeli) + KURUMSAL 4/4
tamamlandı (2026-07-22).** SSS artık canlı sitenin gerçek tasarımıyla
uyumlu: sol kolonda 6 kategori butonu + sağda seçili kategorinin tüm
soru/cevapları doğrudan açık (accordion yok) + PDF indir butonu
(`src/scripts/faq-tabs.js`, vanilla JS). Aynı turda KURUMSAL menüsünün
eksik 2 linki (İletişim, Hedef Global Marka) + 4 yeni sayfa grubu daha
kuruldu: **İletişim** (4 dil, NL dahil — önceki "NL'de yok" tespiti
yanlıştı, gerçek slug `mededelingen`), **Tüketici Hakları Sözleşmesi**
(TR/EN/IT), **Mesafeli Satış Sözleşmesi** (TR/EN/IT, temel varyant),
**Güvenlik** (TR/EN/IT), **Hedef Global Marka** (4 dil), **Neden İdenfit**
(4 dil). Bulunan ek bug: Astro'nun otomatik `i18n.fallback`'i, per-locale
slug'ı TR'den FARKLI olan sayfalarda (bare path eşleşmediği için) kırık
redirect üretiyordu → bu 3 sayfa (Tüketici Hakları/Mesafeli Satış/Güvenlik)
için `astro.config.mjs`'e elle `redirects` girdisi eklendi. **Kural:**
per-locale slug'lar locale'ler arasında FARKLIYSA ve bir locale'de sayfa
yoksa, otomatik fallback'e güvenilmeden hedef slug'ın bare path'le
eşleştiği doğrulanmalı.

**Footer alt bar düzeltmesi + SSS/`faq` CPT kurulumu (2026-07-22).**
Kaynak sitede footer alt barında ayrı bir yasal-link satırı yok (yalnızca
copyright) — bizim eklediğimiz `terms` linki kaldırıldı (kaynakta yok),
`privacy` linki gerçek slug'a düzeltildi (`sozlesme/gizlilik-ve-guvenlik-politikasi`),
`kvkk` zaten doğruydu. SSS içeriğinin kaynağı sayfanın kendi ACF alanları
değil, ayrı bir **`faq` custom post type** (90 kayıt, TR/EN/IT 30'ar, NL
yok) olduğu keşfedildi — `fetch-faq.mjs` ile çekildi, `faqContent.ts` +
`FaqPage.astro` ile 3 dilde route'landı (NL → otomatik fallback). Mega-menü/
footer'ın SSS linkleri sabit `'sss'` slug'ı kullandığından EN/IT'de kırıktı
→ `faqHref()` yardımcı fonksiyonuyla düzeltildi.

**Ana sayfa TAMAMLANDI — 12/12 bölüm (2026-07-22).** Kaynak sitedeki hiçbir
bölüm eksik kalmadı. Sıra: Hero → LogoStrip → Divider → Video → FeatureGrid
→ Divider → Efficiency → PanelFeature(2. form) → Suprema → CertificationBadges
→ TestimonialCarousel → HRTech Alliance. Notlar:
- GRUP 1 (Logo şeridi/FeatureGrid/rozetler/2 ayraç): kullanıcı ekran
  görüntüsüyle 3 tasarım sadakati sorunu bildirdi (kırmızı banner ayraç
  yerine düz metin, logo grayscale, rozetler çıplak) — kaynağın gerçek
  CSS'i (`post-9.css`) incelenip düzeltildi. Kaynaktaki dekoratif "+"/"="
  bağlayıcı ikonlar (FeatureGrid kartları arası) **bilinçli olarak
  eklenmedi** (salt dekoratif, karmaşıklığı faydasına değmiyor) — eksik
  değil, kasıtlı bir kapsam dışı bırakma.
- GRUP 2 (Video/"5 Soru"/Kullanıcı Dostu Panel+2.form): `HeroForm.tsx`'e
  `idPrefix` prop'u eklenerek aynı sayfada 2. form (id çakışması olmadan)
  eklendi.
- GRUP 3 (Suprema/Testimonial Carousel/HRTech): Suprema linki kaynaktaki
  boş Suprema alt sayfaları yerine gerçek `/donanim/` sayfasına gidiyor
  (kullanıcı kararı). Testimonial yeni bir React component
  (`TestimonialCarousel.tsx`, `client:visible`).
- **Kritik mimari not — bu sitede 4 ayrı `index.astro` dosyası var**
  (getStaticPaths tabanlı tek dinamik route DEĞİL) — locale-özel bir sayfa
  güncellenirken TR dosyasını güncellemek YETMİYOR, 4 dosyanın hepsi elle
  güncellenmeli (bir turda yalnızca TR güncellenip 3 dilde sessizce eksik
  render bulunmuştu).

**⏸️ Ana sayfa GRUP 3 dahil kullanıcı onayı bekleniyor** — onay sonrası
ana sayfa migrasyonu resmen kapanacak.

**ÜRÜNLER mega-menüsü TAMAMEN KAPANDI (2026-07-22).** 2 İK hub sayfası
kendi kolonlarının üstünde "Genel Bakış" linki olarak eklendi
(`MegaMenuLink.overview` bayrağı, ince ayraç+kalın font ile ayrı render).
NL'de hub sayfası yok — `hubHref()` EN'in slug'ına düşüp mevcut
`i18n.fallback` mekanizmasını tetikliyor. **Sonuç: ÜRÜNLER menüsündeki 27
link × 4 dil = 108 link, hepsi doğru per-locale hedefe gidiyor — bu menüde
artık açık nokta yok.**

**Donanım sayfası (`/donanim/`) gerçek içerikle kuruldu (2026-07-22).**
Donanım Yönetimi kolonunun 5 linki 5 ayrı sayfa DEĞİL, **tek bir sayfanın**
(hero + 7 blok: Biyometrik/Bluetooth/Platform/RFID/GPRS/Turnikeler/Onaylı
Markalar) anchor'larına işaret ediyor — `ProductPage.astro` yeniden
kullanıldı (`ProductBlock.id` anchor desteği eklendi). IT içeriği tamamen
EN kopyasıydı, TR'den çevrildi. Bulunan bug: mega-menünün `#anchor` içeren
linkleri (`l()` fonksiyonu) fragment'ın sonuna yanlışlıkla trailing slash
ekliyordu (`/donanim#rfid/`) → `lWithHash()` yardımcı fonksiyonuyla
düzeltildi.

**ÜRÜNLER mega-menü linkleri per-locale slug'lara bağlandı (2026-07-22).**
20 ürün modülünün linkleri, sektörlerdeki `buildMegaMenus(mega, locale)`
paterniyle `productHref()` üzerinden gerçek slug'lara bağlandı (önceden
hepsi tek TR slug varsayımıyla hardcoded'du). Donanım kolonu bu turda
kasıtlı atlandı (sayfa henüz yoktu, sonraki turda eklendi). 2 İK hub
sayfası bu turda menüde hiç linklenmiyordu (sonraki turda eklendi).

**Puantaj (Şema E) + 2 İK Hub sayfası tamamlandı (2026-07-21).** Puantaj
sayfası önceki 4 şemadan hiçbirine uymuyordu — 6. bir ACF şeması
(`product_tit`/`module_text`) bulunup `extractSchemaE()` eklendi. 2 İK hub
sayfası (`insan-kaynaklari-yonetimi-modulu`, `insan-kaynaklari-isgucu-yonetimi`)
standart `section_N_*` düzenine uymuyordu — gerçek yapı hero + tanıtım +
**N adet "ürün tile"** (`HubPage.astro` + `HubTileCard.astro`, yeni
`hubContent.ts` mimarisi). Kaynak veri hataları bulundu ve **uydurma
veriyle doldurulmadı**: 2 tile'ın CTA'sı boş bırakıldı (yetim alanlara
güvenilmeyip atlandı), "evraklar" tile'ı (migrate edilmemiş bir modüle
işaret ediyordu) tamamen kaldırıldı, Güvenlik/Görev/Denetim tile'ları
(hub B) bilinçli olarak kardeş ürüne (workmana.com) giden gerçek dış
linkler olarak bırakıldı. IT içeriği (her iki hub'ın tamamı) EN
kopyasıydı, çevrildi. NL'de hub sayfaları kaynakta hiç yok (atlandı).
Bu turla **KARAR 3 tamamen kapandı — 21 sayfa grubunun (18 modül + Puantaj
+ 2 hub) tamamı üretildi.**

**Üç kalıcı karar alındı (2026-07-21):**
- **KARAR 1 — SSS her yerde gösteriliyor.** Önceki "SSS'yi gizle" kararı
  geri alındı; kaynak sitede ne varsa (PDKS'in bilinen yanlış-eşleşmiş 20
  sorusu dahil) olduğu gibi taşınıyor, içerik müdahalesi yapılmıyor.
- **KARAR 2 — kaynakta olmayan çeviriler için yeni sayfa üretimi
  ERTELENDİ.** Bir dil kaynakta hiç yoksa artık varsayılan olarak sıfırdan
  sayfa üretilmiyor (İşe Alım NL istisnası hariç, KARAR 1 — gerçek çeviri
  kuralı — kapsamında zaten üretilmişti); ekiple netleşmeyi bekliyor.
- **KARAR 3 — hiçbir modül kapsam dışı bırakılmayacak.** Özel yaklaşım
  gerektirenler (Puantaj, hub sayfaları) dahil 12 modülün tamamı migrasyon
  kapsamında tutuldu.

**7 "temiz" modül üretildi (2026-07-21):** Doküman, Masraf, Mesaj, Zimmet,
Servis/Shuttle, Özlük Dosyası, Eğitim — 4 dilde (28 sayfa). KARAR 1 (gerçek
çeviri) kuralı geriye dönük uygulandı: birkaç modülün IT'si EN kopyasıydı,
Zimmet'in EN/IT'si ham Türkçe duruyordu — hepsi TR'den çevrildi.

**Aşama 3.0 — kalan 12 modül taraması (2026-07-21, salt keşif, üretim
yok).** `scan-remaining-modules.mjs` ile 12 modülün şema/dil/SSS durumu
raporlandı (`docs/remaining-modules-report.md`) — Puantaj'ın 5. bir şema
gerektirdiği, 2 hub sayfasının ACF değil Elementor-ağırlıklı hub yapısı
olduğu bu taramada tespit edildi (sonraki turlarda çözüldü, yukarıya bkz.).

**KARAR 1 — Gerçek çeviri kuralı kondu (2026-07-21, kalıcı kural).**
**Kural: bir dilin içeriği eksik/boş/başka dilin kopyasıysa, TR kaynaktan
gerçek profesyonel çeviri üretilir — ham kopyalama veya boş bırakma kabul
edilmez.** Bu turda geriye dönük olarak 12 modülün IT'si çevrildi, İzin
Yönetimi'nin eksik 6. bloğu 3 dile eklendi, İşe Alım'ın EN/IT'si
çevrildi, NL'si sıfırdan yazıldı. Ek bug: `ProductPage.astro`'da
`hero.text` düz metin render ediliyordu (`<b>` etiketleri `&lt;b&gt;`
kaçıyordu) → `set:html`'e çevrildi. Mimari detay için bkz. §"Mimari —
Ürün/modül çeviri override sistemi".

**Aşama 2.5 — şema çeşitliliği testi (2026-07-21).** 6 modül daha (Sağlık,
Offboarding, Anket, Geri Bildirim, Şirket Takvimi, Notlar) kasıtlı olarak
farklı ACF şemalarını kapsayacak şekilde eklendi (24 sayfa). Şirket
Takvimi'nde 4. bir örüntü bulundu: aynı sayfada 3 farklı hero şeması bir
arada (yalnızca biri dolu) — extraction'ın öncelik sırası bunu otomatik
çözdü.

**Ürün/modül sayfaları — Aşama 2 (2026-07-21):** Bordro, İzin, Performans,
Onboarding, İşe Alım — 19 sayfa (NL İşe Alım hariç, kaynakta yoktu, KARAR 1
kapsamında sonradan sıfırdan yazıldı). **Kritik keşif: modül sayfaları TEK
bir ACF şeması kullanmıyor** — bu turda 3 ek şema (A/B/C) + tutarsız alan
adları (`sectin_3_title` yazım hatası, `_copy` sonekli gerçek ikinci
bloklar) bulundu; `extract-products.mjs` bunları otomatik tespit edip
normalize edecek şekilde genelleştirildi.

**Ürün/modül sayfaları — Aşama 1: PDKS pilotu (2026-07-21, onaylandı).**
İlk modül sayfası (PDKS) 4 dilde route'landı, 9 içerik bloğu + 20 SSS
şeması (`section_1..10_*`) bulundu. PDKS'in SSS'i aslında Performans
Değerlendirme modülüne ait (kaynak sitenin kendi hatası, izole vaka) —
KARAR 1 (SSS her yerde gösterilsin) kapsamında olduğu gibi bırakıldı. Bu
aşama, ürün sayfaları için kullanılan `productContent.ts`/`ProductPage.astro`
mimarisinin temelini attı (bkz. §"Mimari").

**Müşteri Başarı Hikayeleri sayfası (`/musteriler/`, 2026-07-21).** Önce
yanlışlıkla ayrı, içeriksiz bir placeholder kurulmuştu — silindi. Gerçek
içerik `musteriler` sayfasının ACF alanlarında (5 müşteri: Femaş/Civil/
Yatsan/Doğ-Ser/Tuğba Kuruyemiş) bulundu, 4 dilde route'landı. WP'nin kendi
EN/NL/IT çevirileri düşük kaliteli makine çevirisiydi — kullanılmadı, TR
kaynaktan yeniden, kaliteli çeviri yazıldı (mega-menü/footer'daki aynı
standart). Yalnızca Femaş ve Civil'de gerçek YouTube video URL'si var,
diğer 3 kart "Video yakında" gösteriyor.

**Sektör sayfaları — DÜZELTME ve gerçek içerik (2026-07-21).** "Sektör
sayfaları WP'de hiç yok" tespiti yanlıştı — içerik `pages`/`posts` değil
ayrı bir **custom post type**'ta (`sectors`) duruyordu, export'a hiç
dahil edilmemişti. `fetch-sectors.mjs` ile 48 sayfa (12 sektör × 4 dil)
çekildi, 12 placeholder route gerçek içerikle değiştirildi. Bulunan veri
hataları: `hizmet-sektoru` sektörünün WP `slug` alanı `link`'ten farklıydı
(gruplama hatasına yol açmıştı, düzeltildi); IT Turizm'in `post_title`'ı
kaynakta boş (H1 ACF'ten geldiği için sayfa kırık değil, dokunulmadı,
kullanıcı talimatı); NL'nin çapraz-sektör promo bloğu yanlış slug
kullanıyordu (kendi verimiz üzerinden yeniden çözülerek düzeltildi). Aynı
gün, `LanguageSwitcher`'ın "aynı slug + farklı prefix" varsayımı sektör
sayfalarında (her dilin GERÇEKTEN farklı slug'ı olduğu için) yanlış URL
üretiyordu → `Header.astro`'ya opsiyonel `localeUrls` prop'u eklenip
`getSectorLocaleUrls()` ile besleniyor (opt-in override, diğer sayfalar
etkilenmedi).

**NL içerik fallback'i + (artık tarihi) sektör placeholder'ı (2026-07-21).**
NL'de KVKK/Gizlilik/Güvenlik/SSS/İletişim/Online Sunum Talebi/Teşekkürler/
Destek Talebi sayfalarının kaynakta hiç olmadığı tespit edilip
Astro'nun yerleşik `i18n.fallback: { nl: 'en' }` + `fallbackType: 'redirect'`
mekanizması kuruldu (statik build'de otomatik redirect, middleware/SSR
gerekmez, bkz. §"Mimari"). O sırada sektör sayfaları için de aynı
nedenle basit bir placeholder kurulmuştu — **sonradan yanlış çıktı ve
gerçek içerikle değiştirildi** (yukarıya bkz.), placeholder component'leri
silindi.

**Sayfa envanteri çıkarıldı (2026-07-21).** 170 sayfa + 618 yazının
tamamı kategorize edildi (`docs/page-inventory.md`,
`scripts/page-inventory.mjs` ile yeniden üretilebilir). Öne çıkan
bulgular NL boşlukları (yukarıda çözüldü), Suprema alt sayfalarının boş
`content.rendered`'ı (henüz kurtarılmadı, `themes.zip` açılmalı), sektör
ve müşteri hikayesi sayfalarının export'ta hiç olmaması (sonradan
çözüldü) idi.

**Temel kurulum (tamamlandı, tarihsiz):** Astro + React island mimarisi,
i18n routing (tr/en/nl/it), Tailwind v4 tasarım sistemi, Header (mega-menü
+ dil değiştirici + mobil menü + marquee), Hero bölümü, Footer (4 kolon),
merkezi i18n metin sistemi (`nav`/`cta`/`hero`/`footer`/`mega`/`headerUi`),
mega-menü alt içeriğinin i18n'e taşınması, WordPress export'unun ilk
analizi.

---

## Mimari (Astro + React Island Architecture)

TypeScript kullanılır. `output: 'static'` (adapter yok, Cloudflare Pages'e
statik deploy edilecek — bkz. §Deployment).

- **Statik/içerik odaklı kısımlar** `.astro` dosyaları olarak yazılır.
- **İnteraktif kısımlar** (form, slider, menü, modal, dil değiştirici vb.)
  **React** (`.tsx`) ile, hydration direktifleriyle (`client:load`,
  `client:visible`, `client:idle`) kullanılır.
- Varsayılan `.astro` tercih edilir; React yalnızca gerçek client-side
  etkileşim gerektiğinde eklenir (gereksiz JS gönderilmez).

### i18n (Astro built-in routing)
`astro.config.mjs`: `locales: ["tr","en","nl","it"]`, `defaultLocale: "tr"`,
`routing.prefixDefaultLocale: false` (TR prefix'siz `/`, diğerleri `/en/`
vb.).

**NL içerik fallback'i (mimari karar):** `i18n.fallback: { nl: 'en' }` +
`routing.fallbackType: 'redirect'`. Kaynak sitede NL'de olmayan sayfalar
için build zamanında otomatik statik redirect sayfası üretilir
(`dist/nl/<slug>/index.html` → `<meta refresh>` ile `/en/<slug>/`'e).
Middleware DEĞİL — bu proje statik build olduğu için middleware
production'da çalışmaz. Sessiz redirect (bildirim banner'ı yok) — bilinçli
UX kararı. **Önemli istisna:** per-locale slug'lar locale'ler arasında
FARKLIYSA (TR'nin bare slug'ı EN'inkiyle örtüşmüyorsa) otomatik fallback
YANLIŞ hedefe (var olmayan bir bare-path kombinasyonuna) düşüp kırık
redirect üretir — bu durumda `astro.config.mjs`'e elle `redirects` girdisi
gerekir (Tüketici Hakları/Mesafeli Satış/Güvenlik'te uygulandı).

### i18n metin sistemi (src/i18n/)
Sayfa/component metinleri koda gömülmez, merkezi tutulur:
- `src/i18n/types.ts` — `Translations` şeması (`nav`, `cta`, `hero`,
  `footer`, `mega`, `headerUi`, `customerStories` vb.).
- `src/i18n/{tr,en,nl,it}.ts` — her biri aynı şemaya uyar; bir dilde
  anahtar eksik/fazlaysa **TypeScript derleme zamanında hata verir**
  (`tr.ts` ana kaynak, `astro check` ile doğrulanır).
- `src/i18n/index.ts` — `getTranslations(locale)`.
- Astro tarafı: `const t = getTranslations(Astro.currentLocale ?? 'tr')`.
  React island'lara çeviri STRING prop olarak geçirilir (component kendi
  `getTranslations` çağırmaz).
- `src/data/nav.ts`/`navigation.ts` yalnızca YAPI (href/icon/layout) tutar;
  metin `key: keyof Translations['nav']` referansıyla i18n'den gelir.

### Veri çıkarma kuralı — `link` her zaman otoriter, `slug` değil
WP export'unda `slug` alanı birden fazla kez yanıltıcı çıktı (`hizmet-sektoru`
vs gerçek `hizmet-sektoru-ik-cozumleri`, `pdks-module-2`, `calisan-ozluk-yonetimi-modulu-2`
gibi eski/çakışan kalıntılar). **Kural: route/slug/gruplama için her zaman
`link` alanından türetilen bare slug kullanılır, WP'nin `slug` alanına asla
güvenilmez.** Tüm extraction script'leri (`extract-*.mjs`, `fetch-*.mjs`)
bu kurala uyar.

### CTA URL çözümleme — `resolveCtaUrl()`/`localizeCtaUrl()` (productContent.ts, paylaşılan)
Ham ACF CTA URL'leri locale başına tutarsız slug kullanıyor. `resolveCtaUrl(rawUrl,
locale)` bir `{ url, external, newTab }` döner (`localizeCtaUrl()` yalnızca
`.url`'ü döndüren ince bir sarmalayıcı). Dört durum:
1. **"Online Sunum Talebi" hedefi** — kaynakta 3 farklı slug (TR/EN/IT) var,
   hepsi bizim canonical slug'ımıza (`online-sunum-talebi`, `DEMO_CTA_URL`
   sentinel'i ile tanınır) çevriliyor.
   `getKvkkAndTermsHrefs()`/`getPricingSlug()` gibi tüm modüller CTA
   yazarken gerçek slug bilmek zorunda değil, sentinel yeterli.
2. **Çapraz-sektör/hub tanıtım linkleri** — ham metne güvenilmez, kendi
   veri setimiz üzerinden (bareSlug → trSlug ters-eşleme → doğru locale'in
   gerçek slug'ı) yeniden çözülür (kaynakta NL gibi bazı dillerde yanlış/
   eksik locale önekli linkler bulunmuştu).
3. **Ürün/modül sayfası linkleri** — kaynaktaki per-locale slug aynen
   taşınır (`l(bareSlug)`).
4. **Dış linkler** (hostname tam `idenfit.com` değilse) — `external:true`,
   URL dönüştürülmeden bırakılır. **`external` ≠ "yeni sekmede aç"**:
   `newTab` ayrı bir alan — `app.idenfit.com` (`SAME_TAB_EXTERNAL_HOSTNAMES`,
   kendi ekosistemimiz: kayıt/uygulama girişi) `newTab:false` alır, kaynak
   sitedeki gibi AYNI SEKMEDE açılır (Fiyatlar'ın Mikro/KOBİ CTA'ları);
   `my.idenfit.com`/workmana.com/HRTech Alliance gibi tamamen ayrı marka/
   sitelere giden GERÇEK dış linkler `newTab:true` kalır, `target="_blank"`
   alır. Tüketici olan `pricingContent.ts`/`hubContent.ts` `ctaExternal`
   (template'lerdeki `target` kararı) alanını `.external` DEĞİL `.newTab`'dan
   besler (2026-07-23 düzeltmesi — `PricingPage.astro`/`HubTileCard.astro`).

### Ürün/modül çeviri override sistemi (KARAR 1 — gerçek çeviri kuralı)
**Kalıcı kural:** bir dilin içeriği eksik/boş/başka dilin ham kopyasıysa,
TR kaynaktan gerçek profesyonel çeviri üretilir — kopyalama/boş bırakma
kabul edilmez.

`src/data/productTranslationOverrides.ts`:
```ts
interface ProductOverride {
  hero?: ProductBlock;             // ham hero'nun YERİNE geçer
  sections?: ProductBlock[];       // ham sections'ın YERİNE geçer
  appendSections?: ProductBlock[]; // ham/override sections'a EKLENİR
  faq?: ProductFaqItem[];
}
```
- **Tam değişim** (`hero`+`sections`): kaynak bir dilde tamamen yanlış/kopya.
- **Ekleme** (`appendSections`): yalnızca belirli bir blok eksik, geri kalan
  doğru.
- **Sıfırdan yeni sayfa** (kaynakta o dil hiç yoksa): `entry` (ham veri)
  olmasa bile `override.hero` doluysa içerik üretilir; slug için
  `SYNTHETIC_SLUGS` ile elle atanır (yalnızca İşe Alım NL'de kullanıldı).
- Aynı desen `miscPagesTranslationOverrides.ts` (KVKK/İletişim/Güvenlik/
  Hedef Global Marka/Neden İdenfit/Online Sunum Talebi/Fiyatlar/Hakkımızda)
  ve `hubTranslationOverrides.ts`/`hardwareTranslationOverrides.ts` için de
  kullanılır.

### ACF şema çeşitliliği (ürün/modül sayfaları)
Modül sayfaları TEK bir ACF şeması kullanmıyor — bugüne kadar **6 farklı
şema** bulundu (Şema A: `module_title`, B: `hero_title`, C: `section_title_N`
ters sıralı, D: `section_1_title`\[PDKS\], E: `product_tit`/`module_text`\[Puantaj\],
+ Şirket Takvimi'nde 3 şemanın aynı sayfada bir arada bulunduğu 4.
varyant). `scripts/extract-products.mjs` bunların hepsini regex tabanlı,
alan-adı-sabit-varsaymayan bir yaklaşımla (`collectBlockIndexFirst`/
`collectBlockFieldFirst`) otomatik tespit edip normalize ediyor; tanınmayan
bir şemayla karşılaşırsa konsola uyarı basıyor. Bilinen alan adı
tutarsızlıkları (`sectin_3_title` yazım hatası, `section_2_Text` büyük
harf, `_copy`/`_copy2..15` soneki gerçek ek bloklar olabilir) script
içinde ele alınıyor.

### Sayfa mimarisi kalıpları
- **Ürün/modül sayfaları:** `ProductPage.astro` + `ProductSectionBlock.astro`
  — hero + N içerik bloğu (veri kaynaklı sayı) + SSS (`<details>` accordion,
  KARAR 1 gereği her zaman gösterilir). Başlıklar/hero.text `set:html` ile
  render edilir (TR kaynağındaki `<b>` gibi ham HTML kaçmasın diye).
  Genelde **statik `.astro` dosyaları** (4 dil × 1 dosya), `getStaticPaths()`
  tabanlı dinamik route DEĞİL — bu, onaysız sayfa üretimini mimari olarak
  engelliyor.
- **Sektör sayfaları:** `SectorPage.astro` + `SectorFeatureCard.astro`,
  `getStaticPaths()` ile `sectorContent.ts`'teki `listSectorSlugs()`'tan
  üretilir (48 gerçek sayfa). Modül vurgu blok sayısı veri kaynaklı (2-4
  arası, aynı sektörün farklı dillerinde bile farklı olabilir).
- **Hub sayfaları** (İK genel bakış): `HubPage.astro` + `HubTileCard.astro`
  — hero + tanıtım + N "ürün tile" (ikon+başlık+metin+CTA).
- **Ana sayfa:** `getStaticPaths()` YOK — 4 ayrı statik dosya
  (`index.astro`, `en/index.astro`, `nl/index.astro`, `it/index.astro`).
  Bir bölüm eklenirken **4 dosyanın da** güncellenmesi gerekir.
- **Tekil özel sayfalar** (Hakkımızda, İletişim, Güvenlik, KVKK, Tüketici
  Hakları, Fiyatlar, Online Sunum Talebi, Hedef Global Marka, Neden
  İdenfit, Donanım, Müşteriler, SSS): her biri kendi component'i + veri
  dosyası, `miscPagesContent.ts`/`pricingContent.ts`/`hardwareContent.ts`/
  `faqContent.ts`/`customerStories.ts` altında.
- **Dil değiştirici override'ı** (`Header.astro`'nun `localeUrls?:
  Partial<Record<Locale,string>>` prop'u): varsayılan davranış "aynı slug +
  farklı prefix" hesaplar; per-locale slug'lar GERÇEKTEN farklıysa (sektör/
  ürün/misc sayfalar) ilgili `get*LocaleUrls()` fonksiyonuyla override
  edilir. Opt-in — override verilmeyen sayfalar eski davranışta kalır.

### `position:fixed` dialog/modal/overlay kuralı (kalıcı, 2026-07-23)
`<header>` `backdrop-blur` (`backdrop-filter`) kullanıyor — CSS
spesifikasyonu gereği bu, altındaki `position:fixed` elemanlar için
containing block'u viewport yerine **header'ın kendisi** yapar (`filter`/
`perspective`/`contain`/`will-change:transform` de aynı etkiye sahiptir).
`MobileMenu.tsx`'in overlay+paneli header'ın içine nested olduğundan bu,
paneli header'ın yüksekliğine sıkıştırıyordu (bkz. §Tamamlanan işler,
2026-07-23 — kısa içerikle fark edilmiyordu). **Kural: `<header>`'ın (veya
başka bir `backdrop-filter`/`filter`/`transform` içeren atanın) altına
`position:fixed` bir dialog/modal/overlay eklenirse, `createPortal` ile
`document.body`'ye taşınmalı** (`mounted` state + `useEffect`ile SSR/
hydration uyumsuzluğu olmadan — bkz. `MobileMenu.tsx`'teki uygulama).

### Footer (src/components/Footer.astro, src/data/footer.ts)
4 kolon (marka/iletişim/sosyal + HAKKINDA 6 link + ÜRÜNLER 8 link + GENEL
6 link) + alt bar (copyright + Gizlilik Politikası + KVKK). Yapı `footer.ts`'de,
metin i18n'de. Per-locale slug'ı generic `l(slug)`'la çözülemeyen anahtarlar
(`contact`/`security`/`globalBrand`/`faq`/`consumerRights`/
`distanceSalesAgreement`/`pricing`/`kvkk`/`story` vb.) `SPECIAL_HREFS`
haritasından çözülür. Sosyal ikonlar (LinkedIn/X/Instagram/YouTube/
Facebook) inline SVG, client JS göndermez.

### Blog dil stratejisi (mimari karar)
Tüm blog yazıları Türkçe (618 yazı, sadece TR). Diğer dillerdeki
sayfalardan da blog linki görünür ama içerik otomatik çevrilmez, Türkçe
gösterilir. Blog listesi/tekil yazı sayfaları dil-nötr tek yapıda tutulur
(`src/pages/blog/`, locale prefix'i yok — TR'nin prefix'siz URL alanına
zaten oturuyor). `/en/blog/`, `/nl/blog/`, `/it/blog/` (ve tekil yazı
eşdeğerleri) `i18n.fallback`'in `en:'tr'`/`it:'tr'`/`nl:'en'` zinciri
sayesinde otomatik olarak bare TR sayfasına redirect olur — blog için
ayrıca bir kod yazılmadı, bu genel mekanizmanın doğal bir sonucu (bkz.
CLAUDE.md "Blog migrasyonu başladı" günlük girdisi).

### Blog Content Collection (astro:content, ilk kullanım — 2026-07-24)
Blog, projenin geri kalanındaki `get*Content()` + düz `.ts` deseninden
BİLİNÇLİ olarak FARKLI bir yaklaşım kullanır: Astro Content Collections
(618 kayıt ölçeğinde built-in şema doğrulama/tip güvenliği/sayfalama
avantajı için). Yapı:
- `src/content.config.ts` — koleksiyon şeması (zod). **Dikkat:** Astro 6+'da
  eski `src/content/config.ts` konumu tamamen kaldırıldı
  (`LegacyContentConfigError`) — yeni/zorunlu konum `src/content.config.ts`
  (src kökünde, `content/` klasörünün YANINDA, İÇİNDE değil).
- `src/content/blog/posts.json` — asıl veri, `file()` loader ile okunuyor.
  `scripts/extract-blog-posts.mjs <slug1> [slug2 ...]` ile üretilir/güncellenir
  — TOPLU bir "hepsini işle" modu YOK, kasıtlı: her yazı slug bazlı, tek
  tek işlenip gözden geçirilir (bkz. §"Sayfa/İçerik envanteri" — blog
  migrasyon fazlaması). `scripts/fetch-blog-taxonomy.mjs` önce bir kez
  çalıştırılıp kategori/tag id→isim eşlemesini önbelleğe alır
  (`reference/wordpress-export/blog-{categories,tags}.json`) — `posts.json`
  export'unda kategori/tag İSİMLERİ yok, yalnızca ID.
- `src/data/blogContent.ts` — sayfa-tipinden bağımsız yardımcılar
  (`getAllBlogPosts`/`paginate`/`formatBlogDate`/`getRelatedPosts`).
- Sayfalar: `src/pages/blog/index.astro` (liste, sayfa 1) +
  `src/pages/blog/page/[page].astro` (2+, **kasıtlı olarak** `/blog/[slug]/`
  ile aynı dizin seviyesinde bir `[page]`/`[slug]` route çakışması riskini
  baştan elemek için ayrı bir `page/` alt yoluna konuldu) +
  `src/pages/blog/[slug].astro` (tekil yazı).
- İçerik gövdesi (Gutenberg HTML) `set:html` ile render edilir (proje
  genelindeki `hero.text` deseniyle aynı ilke) — `@tailwindcss/typography`
  eklentisi eklenmedi, h2/h3/p/ul/ol/a Tailwind arbitrary child selector'larla
  (`[&_h2]:...` vb.) stillendirildi.

---

## Sayfa/İçerik envanteri

Detaylı tablo/liste: **`docs/page-inventory.md`** (170 sayfa + 618 yazı,
kategorize + önceliklendirilmiş; `node scripts/page-inventory.mjs` ile
yeniden üretilebilir).

**Sayfalar (170):** A-KRİTİK 126 (Ana Sayfa/Hakkımızda/İletişim/Fiyatlar/
KVKK-Gizlilik-Sözleşmeler/Online-Sunum-Talebi-CTA/Ürün-Modül — 89 modül
sayfası), B-ÖNEMLİ 34, C-İKİNCİL 3, D-DÜŞÜK 7. Bu kategorilerin migrasyon
durumu için §"Tamamlanan işler — özet günlüğü"ne bakın (çoğu artık
tamamlandı).

**Blog (618 yazı):** ✅ TAMAMLANDI (2026-07-24) — tümü `/blog/<slug>/`
altında yayında, `verify-blog-posts.mjs` ile doğrulandı. Detaylar için
§"Tamamlanan işler" — "🎉 Blog migrasyonu FAZ B".

**Sektör sayfaları — per-locale gerçek slug tablosu** (TR slug soldaki
sütun, `SECTOR_ITEMS`'takiyle birebir; EN/NL/IT `link` alanından):

| Sektör (TR) | EN | NL | IT |
|---|---|---|---|
| gida-sektoru-ik-cozumleri | food-and-beverages-sector-hr-solutions | eten-dranken | soluzioni-hr-settore-alimentare-bevande |
| guvenlik-sektoru-ik-cozumleri | security-sector-hr-solutions | beveiliging | soluzioni-hr-settore-sicurezza |
| hizmet-sektoru-ik-cozumleri | service-sector-hr-solutions | dienstverlening | soluzioni-hr-settore-servizi |
| turizm-sektoru-ik-cozumleri | tourism-sector-hr-solutions | toerisme | soluzioni-hr-settore-turismo |
| perakende-sektoru-ik-cozumleri | retail-sector-hr-solutions | detailhandel | soluzioni-hr-settore-retail |
| enerji-sektoru-ik-cozumleri | energy-sector-hr-solutions | energie | soluzioni-hr-settore-energia |
| saglik-sektoru-ik-cozumleri | health-sector-hr-solutions | gezondheid | soluzioni-hr-settore-sanitario |
| egitim-sektoru-ik-cozumleri | education-sector-hr-solutions | onderwijs | soluzioni-hr-settore-istruzione |
| tesis-yonetimi-ik-cozumleri | facility-management-sector-hr-solutions | facilitair-beheer | soluzioni-hr-settore-facility-management |
| sanayi-otomotiv-ik-cozumleri | industry-automotive-sector-hr-solutions | industrie-automotive | soluzioni-hr-settore-industria-automotive |
| hukuk-danismanlik-burolari-ik-cozumleri | law-consultancy-offices-sector-hr-solutions | advocaten-consultancykantoren | soluzioni-hr-settore-legale-consulenza |
| dagitim-lojistik-ik-cozumleri | logistics-and-distribution-sector-hr-solutions | logistiek-distributie | soluzioni-hr-settore-logistica-distribuzione |

**Ürün/modül sayfaları — per-locale slug'lar (özet):** tüm gerçek slug'lar
`src/data/productContent.ts` + ilgili `src/pages/*.astro` dosyalarında
tanımlı; kaynak: `reference/wordpress-export/products.json`. 21 sayfa
grubu (18 modül + Puantaj + 2 hub) tamamlandı, tam liste için ilgili route
dosyalarına veya `products.json`'a bakın.

**Diğer tekil sayfaların route'ları:** KVKK (`kisisel-verilerin-korunmasi`
/`data-use-policy`/IT kendi slug'ı, NL→EN redirect), Online Sunum Talebi
(`online-sunum-talebi`, 4 dilde AYNI slug), Fiyatlar (`fiyatlar`/`pricing`/
`prijzen`/`prezzi`), İletişim (`iletisim`/`contact`/`contatti`/`mededelingen`),
Tüketici Hakları/Mesafeli Satış/Güvenlik/Gizlilik ve Güvenlik Politikası
(TR/EN/IT, NL→EN elle redirect — Güvenlik `guvenlik`/`security-policy`/
`politica-di-sicurezza` LİSTE sayfası; Gizlilik ve Güvenlik Politikası
`sozlesme/gizlilik-ve-guvenlik-politikasi`/`en/contract/privacy-and-security-policy`/
`it/contratto/politica-privacy-e-sicurezza` — AYRI, paragraf içerikli
makale sayfası, ikisi birbirine karıştırılmamalı),
Hedef Global Marka/Neden İdenfit (4 dil), Hakkımızda (`hakkimizda`/`about`/
`over`/`chi-siamo`), SSS (`sss`/`faq`/`faq`, NL→EN fallback), Donanım
(`donanim`/`hardware`/`hardware`/`hardware`, tek sayfa + anchor'lar),
Müşteriler (`musteriler`, 4 dilde aynı slug), Destek Talebi
(`destek-talebi`/`support-request`/`richiesta-supporto`, NL→EN elle
redirect — 2026-07-27'de eklendi).

---

## Tasarım sistemi (Tailwind CSS)

Renk paleti ve fontlar idenfit.com'un Elementor global kit'inden (kit
9561) birebir alındı; placeholder değildir.

### Renk paleti
| Token (Tailwind) | Hex | Kullanım |
|---|---|---|
| `brand` | `#FF0000` | Ana marka rengi — CTA butonları |
| `brand-light` | `#FFF2F2` | Açık kırmızı zemin/vurgu |
| `secondary` | `#6F2C90` | İkincil (mor) vurgu |
| `heading` | `#070707` | Başlıklar |
| `body` | `#333333` | Paragraf gövde metni |
| `muted` | `#808080` | İkincil/meta metin |
| `surface` | `#FFFFFF` | Arka plan |
| `menu-surface` | `#F2F2F2` | Mega-menü panel zemini (kaynaktan, 2026-07-27) |

Not: Paragraf gövdesi için kit'in açık grisi (`#808080`) yerine
okunabilirlik/WCAG kontrastı için `#333333` seçildi; `#808080` yalnızca
`muted` metin için.

### Font
**Quicksand** (Google Fonts) — başlık ve gövde dahil her yerde
(`Layout.astro` head'inde `preconnect` + `<link>`). Fallback:
`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
Tailwind utility: `font-sans`. **İstisna: "idenfit" logosu bir font
DEĞİL** — `src/components/icons/IdenfitLogo.tsx`, kaynağın kendi elle
vektörleştirilmiş SVG'sinden (`idenfit-logo.svg`) birebir çıkarılmış path
verisi (bkz. §"Tamamlanan işler" — "Logo" günlüğü, 2026-07-24).

### Tailwind kullanım kuralı
**Tailwind v4** (`@tailwindcss/vite` plugin). **`tailwind.config.mjs`
YOKTUR** — v4 yapılandırmayı CSS içinde yapar. Tema token'ları
`src/styles/global.css`'teki `@theme { … }` bloğunda tanımlı, otomatik
utility'lere dönüşür (`bg-brand`, `text-heading` vb.). Stil için Tailwind
utility'leri tercih edilir; token değişikliği `global.css`'teki `@theme`'de
yapılır.

---

## Mega-menü (src/data/navigation.ts, src/components/MegaMenu.tsx)

idenfit.com'un canlı header'ından çıkarılan veri. Kaynak dürüstlüğü:
- **ÜRÜNLER:** gerçek 6-kolonlu mega-menü (intro + 4 kategori + promo),
  ikonlar birebir kaynaktan (`src/components/icons/IdenfitIcons.tsx`).
  **27 link × 4 dil = 108 link, tamamı doğru per-locale/anchor hedefe
  gidiyor** (bkz. §Tamamlanan işler).
- **SEKTÖRLER, KURUMSAL:** kaynakta tek kolonlu basit dropdown'lar
  (ikon/promo yok) — gerçek yapıyla eşleşecek şekilde sade tutuldu.
  SEKTÖRLER'in `grid-cols-3` + lucide-react ikonları **bilinçli tasarım
  kararı** (kaynakta yok, kaynakta bağımsız bir `/sektorler/` genel bakış
  sayfası da yok/404 — ama 12 sektörün KENDİ sayfaları gerçek içerikli).
  **KURUMSAL'a 2026-07-27'de sağ tarafta bir promo kart (görsel+kategori+
  başlık+link) eklendi** — bu da kaynakta YOK, kullanıcının kendi sağladığı
  görselle (`src/assets/kurumsal-promo-team.webp`) bilinçli bir yeni özellik,
  fabrikasyon/varsayım DEĞİL (kullanıcı talimatı + kendi görseli). `promoCard`
  alanı (`MegaMenuContent.promoCard`, `ReportCard` şeması) — `MegaMenu.tsx`'te
  üçüncü bir render modu (`promoCardMode`, 420px'lik orta-boy `<li>`-anchored
  dropdown). Detay için bkz. §"Tamamlanan işler" (2026-07-27 günlüğü).
- **KEŞFET:** kaynakta blog-kartı ağırlıklı karmaşık bir içerik merkezi;
  bilinçli olarak sadeleştirildi (yalnızca URL'si doğrulanmış öğeler).
  Şema: `MegaMenuColumn` üç tipten biri — `'links'` (sade liste + opsiyonel
  `comingSoon` metni), `'sublist'` (tek "gör tümü" linki + alt öğeler, hepsi
  aynı hedefe), `'cards'` (yatay kaydırmalı görsel kartlar). İçerikler:
  Bloglar/Dijital İK Olgunluk Testi (+ Podcastler "yakında"), Hesaplamalar
  (8 araç, hepsi `/hesaplama-araclari`'na), Raporlar (4 gerçek kart, gerçek
  görsel+PDF).
- **NEDEN IDENFIT, FİYATLAR, MÜŞTERİLER:** kaynakta dropdown yok, düz link
  — burada da mega-menü fabrike edilmedi.
- Masaüstü nav breakpoint `lg` (mega-menü spec'i gereği `xl`'den
  düşürüldü); `MobileMenu.tsx` de `lg:hidden`.
- **i18n:** `navigation.ts` yalnızca YAPI tutar; tüm METİN `src/i18n/*.ts`'in
  `mega` şemasından `buildMegaMenus(t.mega, locale)` ile enjekte edilir.
  İstisna: promo'nun "LATER IS NEVER" sloganı (marka sloganı, 4 dilde aynı
  bırakıldı, bilinçli).

### Bilinen düzeltmeler (kalıcı, tekrar bozulmaması gereken davranışlar)
- **z-index/genişlik:** mega-menü paneli `<li>`'ye göre değil `<header>`'e
  (`position: relative`, `sticky`) göre `absolute` + `inset-x-0`
  konumlanıyor — viewport genişliğine yayılması için. `<li>`'de
  `position: relative` YOK.
- **Anchor linkler** (`#rfid` gibi) `lWithHash()` ile çözülüyor — path/
  fragment ayrılıp yalnızca path'e locale prefix'i uygulanıyor (aksi halde
  `l()` fragment'ın sonuna trailing slash ekleyip anchor'ı kırıyor).

---

## Proje kuralları

- **Script'ler:** Tüm yardımcı/analiz script'leri **Node.js (`.mjs`)** ile
  yazılır, **Python kullanılmaz** (proje JS/TS tabanlı, tutarlılık ve
  taşınabilirlik için). Konum: `scripts/`. Çalıştırma: `node scripts/<ad>.mjs`.
  Başlıca script'ler: `page-inventory.mjs`, `fetch-sectors.mjs`,
  `fetch-faq.mjs`, `extract-products.mjs`, `extract-hubs.mjs`,
  `extract-hardware.mjs`, `extract-pricing.mjs`, `extract-misc-pages.mjs`,
  `scan-remaining-modules.mjs`, `audit-site.mjs` + `audit-analyze.mjs` +
  `audit-lang-consistency.mjs` + `audit-entities.mjs` + `audit-images.mjs`
  + `audit-http-status.mjs`, test script'leri (`test-*-language-switch.mjs`,
  `test-urunler-menu-links.mjs`, `test-legal-nl-consistency.mjs`,
  `test-no-external-idenfit-links.mjs`, `test-faq-language-switch.mjs`).
- **Tip güvenliği:** `npx astro check` — i18n şemasının (ve genel
  TypeScript'in) hatasız derlendiğini doğrular; VS Code'un canlı
  diagnostics'i zaman zaman stale olabilir, `astro check` güncel sonuçtur.
- **Test yaklaşımı:** Yeni bir dil değiştirici/CTA/link değişikliğinden
  sonra ilgili `test-*.mjs` script'i (gerçek HTTP istekleriyle, dev server
  ayakta olmalı) + regresyon için mevcut diğer `test-*.mjs`'ler
  çalıştırılır.
- **Vite bağımlılık önbelleği bozulması — KALICI ÇÖZÜM, iki turlu araştırma
  sonrası (2026-07-23):** Bu proje boyunca birden fazla kez (dev server
  "navbar/modüller kayboldu" görünümüyle) tekrarlayan bir sorun **iki
  ayrı kök nedene** sahip çıktı — bkz. §"Tamamlanan işler"deki tam analiz
  (ilk çözüm + "YETERSİZ ÇIKTI" güncellemesi). **Artık `astro.config.mjs`'in
  `vite.optimizeDeps`'i ÜÇ katmanlı:**
  1. `force: true` — dev server HANGİ yöntemle başlatılırsa başlatılsın
     HER başlangıçta bağımlılık önbelleğini sıfırdan kurar (soğuk
     başlangıç/bayat disk önbelleği sınıfını kapatır).
  2. `include: ['react', 'react-dom', 'react-dom/client', 'lucide-react']`
     — projenin kullandığı TEK TEK 4 harici paket, HANGİ SAYFA önce
     ziyaret edilirse edilsin başlangıçta koşulsuz pre-bundle edilir
     (canlı süreçte "yeni bağımlılık keşfi" tetiklenmesi sınıfını kapatır
     — bu, ilk turda GÖZDEN KAÇAN asıl genel kök nedendi: Vite'ın lazy
     dependency discovery'si, henüz o oturumda ziyaret edilmemiş bir
     sayfaya ilk girildiğinde canlı yeniden-optimize tetikliyordu).
  3. ~~`entries` ile tüm proje dosyalarını tarama~~ — DENENDİ, KIRILGAN
     çıktığı için TERK EDİLDİ (bir yorum satırındaki kod-benzeri metin
     Vite'ın tarayıcısını `[PARSE_ERROR]`'a düşürdü).
  Elle `node_modules/.vite` silme adımı artık hiçbir senaryoda GEREKMİYOR.
  **Kalıcı kurallar (ikisi de aynı sınıf bug'ı hedefliyor):**
  1. `npm install`/`npm uninstall` (ör. Playwright gibi geçici bir araç)
     çalıştırılmadan ÖNCE dev server durdurulmalı, sonrasında
     `npm run dev:clean` (`scripts/dev-clean-restart.mjs` — durdur +
     `dist`/`.vite` temizle + arka planda yeniden başlat, TEK komut) ile
     yeniden başlatılmalı.
  2. **`astro.config.mjs` (veya Astro'nun izlediği başka bir config dosyası)
     dev server ÇALIŞIRKEN düzenlenirse**, Astro'nun kendi otomatik
     `"Configuration file updated. Restarting..."` soft-restart'ına
     GÜVENİLMEMELİ (2026-07-23'te bizzat yaşandı — bkz. §"Tamamlanan
     işler"deki "ÜÇÜNCÜ GÜNCELLEME") — o da aynı bug'a düşüyor ve kendi
     kendine toparlanmıyor. Config dosyası düzenlendikten SONRA mutlaka
     `npm run dev:clean` ile TAM bir process kill+restart yapılmalı.
  3. **Sık karşılaşılan sorun: navbar/marquee/form kayboluyor (React
     hydration hatası).** Kullanıcı "dev:clean ile düzelt" dediğinde,
     Claude Code otomatik olarak (1) `npm run dev:clean` çalıştırır, (2)
     `npx astro dev logs` ile `_jsxDEV`/`program reload`/`TypeError`
     hatası olmadığını doğrular, (3) `curl` ile ana sayfayı çekip
     React island'ların (`MarqueeBar`/`HeroForm`/`MegaMenu`/`MobileMenu`/
     `LanguageSwitcher`) hepsinin `<astro-island>` olarak render
     edildiğini doğrular, (4) kullanıcıya "düzeldi, sert yenile" der —
     ek onay/soru sormadan.
- **Proje temposu:** Haftalık hedeflerle ilerlenir, toplam süre önceden
  belirlenmez. Her hafta sonu değerlendirme yapılır. **Kalite > Hız.**

## Development
Dev server'ı arka planda başlat: `astro dev --background`. Yönetim:
`astro dev stop`, `astro dev status`, `astro dev logs`.

**`npm install`/`npm uninstall` çalıştırdıktan sonra** (dev server açık
olsun olmasın) `npm run dev:clean` ile yeniden başlatın — bkz. yukarıdaki
"Vite bağımlılık önbelleği bozulması" kuralı. Üretim build testi
(`astro build`) sonrası dev server'a dönerken de aynı komut kullanılabilir
(`dist/` çıktısını da temizler).

## Deployment
**Faz 1 (mevcut):** Tüm statik içerik Astro ile migrate edilip Cloudflare
Pages'e static olarak deploy edilecek.
**Faz 2 (ileride):** Dinamik/interaktif kısımlar (form backend'i, olası
arama/kullanıcı işlemleri) Cloudflare Pages Functions ile eklenecek.
Şu anki mimari (`output: 'static'`, `HeroForm`'un backend'siz `console.log`
hali) bu plana zaten uyumlu.

---

## WordPress Kaynak Sitesi (reference/wordpress-export/)

Kaynak site: `idenfit.com` (İK/HR SaaS). WordPress REST API export'u.
İçerik: `posts.json` (618 yazı, tümü TR), `pages.json` (170 sayfa, 4 dil),
`media.json` (2211 medya kaydı — `[[wp-media-export-count]]` hafıza
kaydına bkz., 2230 ile fark tasarlanmış davranış), `sectors.json` (48
sayfa, ayrı fetch), `faq.json` planlanan ama henüz çekilmedi (bkz. aşağı).

Eklentiler: **Elementor** (page builder), **ACF** (custom field), **Yoast
SEO** (`yoast_head_json`), **Polylang** (`pll_language`, `pll_translations`).

### Custom post type'lar (standart export'a dahil DEĞİLDİ — 2026-07-21 keşfi)
Orijinal export yalnızca `page`/`post`/`media` çekmiş, `wp/v2/types` hiç
sorgulanmamıştı. Gerçekte var olan ek CPT'ler:
- **`sectors`** — 12 sektörün 4 dildeki tam sayfaları (✅ çekildi,
  `sectors.json`, bkz. §Mimari/§Sayfa envanteri).
- **`faq`** — 90 kayıt (TR/EN/IT 30'ar, NL yok), gerçek destek/SSS soruları
  (✅ çekildi, `faq.json`, `sss`/`faq` sayfalarında kullanılıyor).
- **`portfolio`** — amacı/kullanımı doğrulanmadı, düşük öncelik, henüz
  araştırılmadı.

**Ders:** bir içeriğin "WP'de yok" sonucuna varmadan önce `wp/v2/types` ile
TÜM post type'lar kontrol edilmeli, yalnızca `pages.json`/`posts.json`'a
bakılmamalı — bu projede en az bir kez (sektörler) yanlış negatife yol
açtı. **89 ürün/modül sayfası için bu kontrol tekrar yapıldı ve TEMİZ
çıktı** — hepsi zaten standart `page` post type'ında, `pages.json`'da,
tam içerikle mevcut; ekstra CPT yok.

### Dil dağılımı
- **Posts:** `pll_language` yok, 618 yazının tümü Türkçe (diğer dillerde
  post export edilmemiş/gelmemiş).
- **Pages:** `pll_language` var — `tr`=55, `en`=48, `it`=40, `nl`=27.

### Sayfa şablonları
`` (varsayılan): 97, `elementor_header_footer`: 65,
`pricing/template-pricing.php`: 4, `suprema/suprema.php`: 2,
`suprema-it/suprema.php`: 1, `elementor_theme`: 1. Post'ların tamamı (618)
varsayılan şablon.

### Kategoriler (post'larda, 11 adet)
`ik-akademi` (337), `ik-trendleri` (159), `guncel-bilgiler` (117),
`dijital-ik` (41), `gecmis-etkinlikler` (14), `guncel-bilgiler-tr` (11),
`uncategorized-tr` (7), `ik-roportajlari` (4), `yaklasan-etkinlikler` (3),
`ogretici-bilgiler` (3), `yenilikler-tr` (2). 63 tag var (SGK/bordro/mesai/
izin/İK odaklı — tam liste `node scripts/analyze-wp.mjs` ile). Sayfalarda
kategori/tag yok.

### Custom field / meta anahtarları (sayfalarda, ~500+ farklı anahtar)
Başlıca gruplar: SSS (`question_N`/`answer_N`, `faq_question_N`/
`faq_answer_N`), Hero/başlık (`page_title`, `hero_title`, `hero_image`,
`video_url`), Bölümler (`section_N_{title,text,image,cta_text,cta_url}`),
İletişim (`call_title`, `e-mail_*`, `office_1..3`), Sosyal medya
(`social_media_icon_N`/`social_media_url_N`), Referans/müşteri blokları
(`civil_*`, `yatsan_*`, `dog-ser_*`, `tugba_kuruyemis_*`, `femas_*`), Ürün
listeleri (`N_product_*` + `_copy`/`_copyN` klonları), Fiyatlandırma
(`mikro_*`, `sme_*`, `Pro_*`). Aynı anlamı taşıyan tekrar/typo'lu anahtarlar
var (`sectin_3_title`, `section_2_Text` vs `section_2_text`) — extraction
script'lerinde normalize ediliyor (bkz. §Mimari — ACF şema çeşitliliği).

### Açılmamış arşivler
`themes.zip` (~22 MB) — mevcut WP teması, açılmadı (Suprema alt
sayfalarının boş `content.rendered`'ını kurtarmak için gerekebilir).
`uploads.zip` (~1.4 GB) — tüm görseller, açılmadı.

---

## Documentation

Full documentation: https://docs.astro.build

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
