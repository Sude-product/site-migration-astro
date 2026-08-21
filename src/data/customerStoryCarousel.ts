// Ana sayfanın hero'sundaki dashboard widget'ının HEMEN ALTINDAKİ "Müşteri
// Hikayeleri" carousel'i (2026-08-20) — Personio tarzı, 3 kart türü karışık
// (video/alıntı/istatistik). Kart metni (alıntı/istatistik sayıları) YENİDEN
// ÜRETİLMEDİ — `customerStories.ts`'teki `CUSTOMER_STORIES` ve i18n'in
// `customerStories` şemasından aynen tekrar kullanılıyor, burada yalnızca
// hangi hikayenin hangi kart tipinde gösterileceği + firma logosu (dile
// bağlı olmayan) tutuluyor.
//
// BİLİNÇLİ KAPSAM SINIRI (kullanıcı onayı, 2026-08-20): yalnızca
// `CUSTOMER_LOGO_MARQUEE`'de GERÇEK logosu olan firmalar dahil edildi —
// Femaş ve Doğ-Ser Makina'nın logosu yok, bu turda hariç tutuldu (istenirse
// sonraki bir turda logo bulunup eklenebilir). `/musteriler/`'in
// `TestimonialSection`'daki 2 AYRI tanığı (İsmail Ünal/Emre Özcan) BİLEREK
// buraya alınmadı — aynı sayfada iki kez aynı kişiyi göstermemek için (bkz.
// Açık nokta #35'in "duplikasyon istenmiyor" dersi).
export type CustomerCarouselCardType = 'video' | 'quote' | 'stat';

interface CarouselLogo {
  url: string;
  width: number;
  height: number;
}

interface CarouselCardBase {
  /** i18n'in `customerStories` şemasındaki anahtarla birebir eşleşir. */
  storyKey: 'civil' | 'yatsan' | 'tugbaKuruyemis' | 'beyazFirin';
  companyName: string;
  logo: CarouselLogo;
  /** `/musteriler/` sayfasındaki ilgili bloğun `id`'si — "Devamını Oku"
   * bu anchor'a gider (bkz. `CustomerStoryRow.astro`'nun `id` prop'u). */
  anchorId: string;
}

export interface VideoCarouselCard extends CarouselCardBase {
  type: 'video';
  /** `youtu.be/...` kısa linki — Civil'in AYRI ikinci bloğundaki (liderlik
   * testimonial'ı) video, `customerStories.ts`'teki `secondary.media.video`
   * ile birebir aynı. */
  videoUrl: string;
}

export interface QuoteCarouselCard extends CarouselCardBase {
  type: 'quote';
  quotePhotoUrl?: string;
}

export interface StatCarouselCard extends CarouselCardBase {
  type: 'stat';
}

export type CustomerCarouselCard = VideoCarouselCard | QuoteCarouselCard | StatCarouselCard;

export const CUSTOMER_CAROUSEL_CARDS: CustomerCarouselCard[] = [
  {
    type: 'video',
    storyKey: 'civil',
    companyName: 'Civil',
    logo: { url: '/wp-content/uploads/2025/11/civil-2-1.svg', width: 100, height: 50 },
    anchorId: 'civil-secondary',
    videoUrl: 'https://youtu.be/-MxZWA99a20',
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
    type: 'quote',
    storyKey: 'beyazFirin',
    companyName: 'Beyaz Fırın',
    logo: { url: '/wp-content/uploads/2025/11/beyaz-firin-2-1.svg', width: 100, height: 50 },
    anchorId: 'beyazFirin',
    quotePhotoUrl: '/images/customer-beyaz-firin-nuri-sutluoglu.jpg',
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
  },
];
