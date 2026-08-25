// Ana sayfanın hero'sundaki dashboard widget'ının HEMEN ALTINDAKİ "Müşteri
// Hikayeleri" carousel'i (2026-08-20) — Personio tarzı, 3 kart türü karışık
// (video/alıntı/istatistik). Kart metni (alıntı/istatistik sayıları) YENİDEN
// ÜRETİLMEDİ — `customerStories.ts`'teki `CUSTOMER_STORIES` ve i18n'in
// `customerStories` şemasından aynen tekrar kullanılıyor, burada yalnızca
// hangi hikayenin hangi kart tipinde gösterileceği + firma logosu (dile
// bağlı olmayan) tutuluyor.
//
// GÜNCELLEME (2026-08-24, kullanıcı isteği): Femaş VE Doğ-Ser Makina'nın
// artık GERÇEK logoları var (Femaş kullanıcının kendi sağladığı dosya;
// Doğ-Ser'in kendi canlı sitesinden — dog-ser.com — çekildi), ikisi de
// carousel'e eklendi. `TestimonialSection`'ın (ayrı, ana sayfadaki eski
// widget) 2 tanığı (İsmail Ünal/Emre Özcan) da BİLİNÇLİ olarak buraya
// TAŞINDI — o widget kaldırıldığı için artık "iki kez gösterme" endişesi
// yok (bkz. `src/pages/index.astro` ve locale eşdeğerlerindeki
// `TestimonialSection` kaldırma notu).
export type CustomerCarouselCardType = 'video' | 'quote' | 'stat';

interface CarouselLogo {
  url: string;
  width: number;
  height: number;
}

interface CarouselCardBase {
  /** `customerStories` şemasındaki anahtarla (Femaş/Civil/Yatsan/Tuğba/
   * Beyaz Fırın/Doğ-Ser) YA DA `home.testimonials` şemasındaki anahtarla
   * (emreOzcan/ismailUnal, eski `TestimonialSection`'dan taşınan 2 tanık)
   * birebir eşleşir — hangi kaynaktan okunacağı `CustomerStoryCarouselSection.astro`'daki
   * `HOME_TESTIMONIAL_KEYS` kümesiyle ayrıştırılıyor. */
  storyKey: 'femas' | 'civil' | 'yatsan' | 'tugbaKuruyemis' | 'beyazFirin' | 'dogSer' | 'emreOzcan' | 'ismailUnal';
  companyName: string;
  logo: CarouselLogo;
  /** `/musteriler/` sayfasındaki ilgili bloğun `id`'si — "Devamını Oku"
   * bu anchor'a gider (bkz. `CustomerStoryRow.astro`'nun `id` prop'u).
   * `emreOzcan`/`ismailUnal` için VERİLMEZ — bu iki tanık `/musteriler/`
   * sayfasında hiç yok (eski `TestimonialSection`'a özeldi), gitmeleri
   * gereken gerçek bir sayfa/anchor olmadığı için "Devamını Oku" butonu
   * bu iki kartta hiç render edilmez (uydurma link YOK). */
  anchorId?: string;
}

export interface VideoCarouselCard extends CarouselCardBase {
  type: 'video';
  /** `youtu.be/...` kısa linki — Civil'in AYRI ikinci bloğundaki (liderlik
   * testimonial'ı) video, `customerStories.ts`'teki `secondary.media.video`
   * ile birebir aynı. */
  videoUrl: string;
  /** Arka planda otomatik/sessiz döngü aralığı — saniye cinsinden
   * (2026-08-24, kullanıcı isteği). İKİSİ de verilmişse kart artık
   * tıkla-oynat DEĞİL, sayfa yüklenir yüklenmez sessiz+otomatik döngüde
   * oynayan bir arka plan videosu olur (tıklanınca gerçek YouTube izleme
   * sayfasına gider) — bkz. `CustomerStoryCarousel.tsx`'in `VideoCard`
   * bileşeni. Verilmemişse (Civil/Beyaz Fırın, saniyeleri henüz
   * paylaşılmadı) eski tıkla-oynat davranışı DEĞİŞMEDEN kalır. */
  loopStart?: number;
  loopEnd?: number;
}

export interface QuoteCarouselCard extends CarouselCardBase {
  type: 'quote';
  quotePhotoUrl?: string;
}

export interface StatCarouselCard extends CarouselCardBase {
  type: 'stat';
  // `emreOzcan`/`ismailUnal` (home.testimonials) hiç istatistik alanı
  // taşımıyor — bu tür yalnızca `customerStories` şemasından okuyabildiği
  // için `storyKey` burada bilinçli olarak DAHA DAR (derleme zamanında da
  // yanlış eşleştirmeyi engeller, bkz. `CustomerStoryCarouselSection.astro`'nun
  // `cs[card.storyKey]` erişimi).
  storyKey: 'femas' | 'civil' | 'yatsan' | 'tugbaKuruyemis' | 'beyazFirin' | 'dogSer';
}

export type CustomerCarouselCard = VideoCarouselCard | QuoteCarouselCard | StatCarouselCard;

// SIRALAMA (2026-08-24, kullanıcı isteği — ÖNCE "bir video bir yazı", SONRA
// "1 video 2 yazı" olarak güncellendi): 3 video kartı (Civil/Beyaz Fırın/
// Femaş) artık her biri İKİ metin (alıntı/istatistik) kartıyla ayrılıyor —
// video, metin, metin, video, metin, metin, video, metin, metin.
export const CUSTOMER_CAROUSEL_CARDS: CustomerCarouselCard[] = [
  {
    type: 'video',
    storyKey: 'civil',
    companyName: 'Civil',
    logo: { url: '/wp-content/uploads/2025/11/civil-2-1.svg', width: 100, height: 50 },
    anchorId: 'civil-secondary',
    videoUrl: 'https://youtu.be/-MxZWA99a20',
    // DÜZELTME (2026-08-25, kullanıcı bulgusu: "yazılar kesiliyor") —
    // 20-24sn, 15-19sn ve 34-50sn aralıklarının HEPSİNDE rahatsız edici
    // yazı kalmıştı. Kullanıcı kendi izleyip 41-59sn aralığını BİZZAT
    // verdi (son/güncel karar) — bu turda saniye seçimi elle
    // doğrulanmadı, doğrudan kullanıcı kararı uygulandı.
    loopStart: 41,
    loopEnd: 59,
  },
  {
    type: 'quote',
    storyKey: 'yatsan',
    companyName: 'Yatsan',
    logo: { url: '/wp-content/uploads/2025/11/yatsan-2-1.svg', width: 100, height: 50 },
    anchorId: 'yatsan',
    quotePhotoUrl: 'https://idenfit.com/wp-content/uploads/2025/10/Muzeyyen-Kiran-Mergen.png',
  },
  {
    // 2026-08-24 — eski (ayrı) `TestimonialSection` widget'ından taşınan
    // tanık (bkz. dosya başı yorumu). Metin/unvan `home.testimonials.emreOzcan`'dan,
    // isim/foto `TESTIMONIAL_PEOPLE.emreOzcan`'dan (`homeContent.ts`) —
    // `customerStories` şemasından DEĞİL, bu yüzden `CustomerStoryCarouselSection.astro`
    // özel bir dal ile okuyor. `anchorId` YOK — `/musteriler/`'de bu tanığa
    // ait bir blok hiç olmadı, "Devamını Oku" bu kartta render edilmiyor.
    // Logo: HAVAİST, `CUSTOMER_LOGO_MARQUEE`'de zaten gerçek/var olan dosya.
    type: 'quote',
    storyKey: 'emreOzcan',
    companyName: 'HAVAİST',
    logo: { url: '/wp-content/uploads/2025/11/havaist-2-1.svg', width: 100, height: 50 },
  },
  {
    // 2026-08-20 (aynı gün, dördüncü tur): kullanıcının paylaştığı YouTube
    // linki — Beyaz Fırın'ın ALINTI kartından AYRI, ikinci bir carousel
    // kartı (aynı firma artık carousel'de 2 kez var: video + alıntı).
    // `/musteriler/` sayfasında Beyaz Fırın'ın videosu embed edilmiyor
    // (o blok yalnızca alıntıyı gösteriyor) — bu yüzden `anchorId` yine
    // AYNI bloğa (`beyazFirin`) gidiyor, ayrı bir video bloğu YOK.
    type: 'video',
    storyKey: 'beyazFirin',
    companyName: 'Beyaz Fırın',
    logo: { url: '/wp-content/uploads/2025/11/beyaz-firin-2-1.svg', width: 100, height: 50 },
    anchorId: 'beyazFirin',
    videoUrl: 'https://youtu.be/ru4gVy9-sOQ',
    // DÜZELTME (2026-08-25, kullanıcı bulgusu) — 5-10sn ("Yüzyıllık
    // Marka" rozeti + "Nuri Sütlüoğlu" alt-yazısı) ve ardından denenen
    // 25-30sn aralıklarının İKİSİNDE de rahatsız edici yazı kalmıştı.
    // Kullanıcı kendi izleyip 46sn-1dk15sn (75sn) aralığını BİZZAT verdi.
    loopStart: 46,
    loopEnd: 75,
  },
  {
    type: 'stat',
    storyKey: 'tugbaKuruyemis',
    companyName: 'Tuğba Kuruyemiş',
    logo: { url: '/wp-content/uploads/2025/11/tugba-2-1.svg', width: 100, height: 50 },
    // DÜZELTME (2026-08-20): `CustomerStoriesPage.astro`'nun `id={story.key}`'i
    // camelCase üretiyor ("tugbaKuruyemis") — önceki turda burada YANLIŞLIKLA
    // kebab-case ('tugba-kuruyemis') yazılmıştı, "Devamını Oku" var olmayan
    // bir anchor'a gidiyordu. Beyaz Fırın kartı eklenirken fark edilip
    // düzeltildi.
    anchorId: 'tugbaKuruyemis',
  },
  {
    // 2026-08-24 — eski `TestimonialSection` widget'ından taşınan 2. tanık,
    // yukarıdaki `emreOzcan` ile AYNI ilke. Logo: ZSA (Zsa Zsa Zsu),
    // `CUSTOMER_LOGO_MARQUEE`'de zaten gerçek/var olan dosya.
    type: 'quote',
    storyKey: 'ismailUnal',
    companyName: 'Zsa Zsa Zsu',
    logo: { url: '/wp-content/uploads/2025/11/zsa-2.svg', width: 100, height: 50 },
  },
  {
    // 2026-08-24 — kullanıcının YouTube linki + arka plan döngü aralığı
    // (18-32sn) paylaştığı YENİ kart. Video, `/musteriler/`'deki Femaş
    // bloğunun ANA medyasıyla BİREBİR AYNI (`customerStories.ts`'in
    // `femas.media.video`'su). Logo kullanıcının kendi sağladığı gerçek
    // dosya (`public/images/customer-femas-logo.png`, RGBA/şeffaf zemin) —
    // önceki turda Femaş'ın `CUSTOMER_LOGO_MARQUEE`'de logosu OLMADIĞI
    // için carousel'e hiç dahil edilmemişti (bkz. dosya başı yorumu),
    // artık logo geldiği için eklendi.
    type: 'video',
    storyKey: 'femas',
    companyName: 'Femaş',
    logo: { url: '/images/customer-femas-logo.png', width: 200, height: 32 },
    anchorId: 'femas',
    videoUrl: 'https://youtu.be/cakFopJJ-pE',
    // DÜZELTME (2026-08-25, kullanıcı bulgusu) — 18-32sn ("Figen
    // Orhanoğlu" alt-yazısı + "Bulut Tabanlı"/"Hızlı Kurulum" pazarlama
    // kelimeleri) ve ardından denenen 50-54sn aralıklarının İKİSİNDE de
    // rahatsız edici yazı kalmıştı. Kullanıcı kendi izleyip 37-55sn
    // aralığını BİZZAT verdi.
    loopStart: 37,
    loopEnd: 55,
  },
  {
    type: 'quote',
    storyKey: 'beyazFirin',
    companyName: 'Beyaz Fırın',
    logo: { url: '/wp-content/uploads/2025/11/beyaz-firin-2-1.svg', width: 100, height: 50 },
    anchorId: 'beyazFirin',
    quotePhotoUrl: '/images/customer-beyaz-firin-nuri-sutluoglu.jpg',
  },
  {
    // 2026-08-24 — kullanıcının paylaştığı canlı site ekran görüntüsündeki
    // (Cem Çolak alıntısı, 250 çalışan/10 Lokasyon) YENİ kart. Logo
    // kaynağın KENDİ canlı sitesinden (dog-ser.com/assets/img/dog-ser-logo.png)
    // çekilip yerelleştirildi (`public/images/customer-dogser-logo.png`) —
    // önceki turda Doğ-Ser'in `CUSTOMER_LOGO_MARQUEE`'de logosu OLMADIĞI
    // için carousel'e hiç dahil edilmemişti (bkz. dosya başı yorumu).
    // `employeeCount`/`secondaryStat` (250 çalışan/10 Lokasyon) bu kart
    // tipinde (quote) gösterilmiyor — quote kartının şeması bunu taşımıyor,
    // Yatsan/Beyaz Fırın'ın alıntı kartlarıyla AYNI tutarlı yapı korundu.
    type: 'quote',
    storyKey: 'dogSer',
    companyName: 'Doğ-Ser Makina',
    logo: { url: '/images/customer-dogser-logo.png', width: 200, height: 73 },
    anchorId: 'dogSer',
    quotePhotoUrl: 'https://idenfit.com/wp-content/uploads/2025/08/dogser-cemcolak@2x.png',
  },
];
