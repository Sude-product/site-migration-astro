// /musteriler/ ("Müşteri Başarı Hikayeleri") sayfasının müşteri blokları.
//
// ⚠️ 2026-07-27 (aynı gün, ikinci tur) — BÜYÜK REVİZYON. Kullanıcı önceki
// turun (3 kolonlu kart grid'i + scroll-reveal) yetersiz kaldığını belirtip
// canlı siteyle adım adım karşılaştırma istedi. Playwright ile idenfit.com/musteriler/
// GERÇEKTEN incelenince (kademeli scroll + tıklama testleriyle):
//
// 1. **Sayfa 3 kolonlu bir grid DEĞİL — dönüşümlü (zigzag) tek-kolonlu bir
//    dizilim.** Her müşteri bloğu görsel/video SOLDA ya da SAĞDA, metin
//    karşı tarafta; taraf müşteriden müşteriye değişiyor (bkz. her öğenin
//    `mediaSide` alanı, gerçek sıraya göre elle atandı).
// 2. **Görseller DAİRESEL kırpılmış**, bizim önceki `aspect-video`
//    dikdörtgenimiz gibi değil.
// 3. **Videolar Elementor'un "tıkla-oynat" widget'ı** — sayfa yüklendiğinde
//    KUTU BOŞ (ne thumbnail ne play butonu), tıklanınca gerçek YouTube
//    iframe'i yükleniyor. Femaş'ın VE Civil'in referans videosunun kutusu
//    tam olarak BOŞ/BOZUK çıktı (kademeli scroll + 3sn bekleme sonrası bile)
//    — kaynağın kendi bug'ı. Biz bunu birebir kopyalamadık (kullanıcıya
//    anlamsız bir boş kutu göstermek yerine gerçek YouTube thumbnail'iyle
//    ÇALIŞAN bir tıkla-oynat kartı kurduk — bilinçli bir iyileştirme, bkz.
//    CLAUDE.md).
// 4. **Sayfa içeriği `reference/wordpress-export/pages.json` anlık
//    görüntüsünden GÜNCELLENMİŞ** (kaynak site export'tan sonra
//    değişmiş): Civil'in çalışan sayısı 2600→3000; Yatsan'ın TÜM açıklama
//    metni + referans alıntısı baştan yazılmış (yeni isim: "Müzeyyen Kıran
//    Mergen", yeni fotoğraf, "6 yıl önce" ifadesi — eskisiyle alakası yok);
//    Yatsan'ın ana görseli de yeni bir dosyaya değişmiş
//    (`yatsan-magaza.png`, 2025/10 — eski `2@2x-4-1.png`, 2025/08, artık
//    sayfada kullanılmıyor). Doğ-Ser'in kendi referans kişisinin
//    (Cem Çolak) küçük bir profil fotoğrafı olduğu da ilk kez görüldü
//    (önceki turda atlanmıştı). Tüm bu değerler CANLI SİTEDEN yeniden
//    doğrulanıp güncellendi — artık `pages.json`'daki durumdan farklı,
//    daha güncel.
// 5. **İkon rozetleri** ("X çalışan"/"X mağaza" vb.) kaynakta gerçek marka
//    ikon GÖRSELLERİ kullanıyor (`working@2x.png`/`branch@2x.png`), bizim
//    önceki generic SVG ikonumuz değil — gerçek görsellere çevrildi.
//
// Bu dosya yalnızca dile bağlı OLMAYAN yapıyı tutar (görsel/video URL'leri,
// taraf, özel isimler). Açıklama/alıntı METNİ `src/i18n/*.ts`'in
// `customerStories` şemasında (dile göre değişir).
//
// GÜNCELLEME (2026-08-24, kullanıcı isteği): `emreOzcan`/`ismailUnal` —
// eski (ayrı) ana sayfa `TestimonialSection` widget'ından bu sayfaya da
// TAŞINDI (aynı gerçek alıntı metni, `home.testimonials` şemasıyla
// birebir aynı — ikinci kez YAZILMADI). `media.image` kullanıcının
// paylaştığı gerçek şirket fotoğrafları (HAVAİST otobüsü/Zsa Zsa Zsu
// mağazası); kişi portreleri (`TESTIMONIAL_PEOPLE`, `homeContent.ts`)
// diğer tüm bloklarla (Yatsan/Doğ-Ser/Beyaz Fırın) AYNI desende küçük
// alıntı-yazarı rozetine (`quotePhotoUrl`) yerleştirildi.
import { TESTIMONIAL_PEOPLE } from './homeContent';

export type CustomerStoryKey = 'femas' | 'civil' | 'yatsan' | 'dogSer' | 'tugbaKuruyemis' | 'beyazFirin' | 'emreOzcan' | 'ismailUnal';

export interface StoryMedia {
  image?: string;
  /** `youtu.be/...` kısa linki. */
  video?: string;
}

export interface StoryQuotePerson {
  /** Bazı alıntılarda isim yok (ör. Tuğba Kuruyemiş — kaynakta yalnızca rol/isim
   * kısmı farklı biçimde, bkz. i18n). */
  name?: string;
  photoUrl?: string;
}

export interface CustomerStoryItem {
  key: CustomerStoryKey;
  /** Şirket adı — özel isim, dile göre çevrilmez. */
  name: string;
  /** Ana blokta görsel/video hangi tarafta — kaynakta GERÇEKTEN dönüşümlü
   * (zigzag), sıra formülle değil elle, gerçek sırayla atandı. */
  mediaSide: 'left' | 'right';
  media: StoryMedia;
  /** Ana bloktaki alıntının kişisi (fotoğraf) — isim METNİ i18n'de
   * (`quote.name`, bazı dillerde farklı sırayla yazılabildiği için). Yalnızca
   * Yatsan ve Doğ-Ser'de fotoğraf var; Tuğba'da isim var ama fotoğraf yok. */
  quotePhotoUrl?: string;
  /** Civil'in kaynakta GERÇEKTEN AYRI bir ikinci bloğu var (şirket tanıtımı +
   * ayrı bir "liderlik testimonial'ı", kendi videosu + kişi fotoğrafıyla). */
  secondary?: {
    mediaSide: 'left' | 'right';
    media: StoryMedia;
    quotePhotoUrl?: string;
  };
}

export const CUSTOMER_STORIES: CustomerStoryItem[] = [
  {
    key: 'femas',
    name: 'Femaş',
    mediaSide: 'right',
    media: { video: 'https://youtu.be/cakFopJJ-pE' },
  },
  {
    key: 'civil',
    name: 'Civil',
    mediaSide: 'left',
    media: { image: 'https://idenfit.com/wp-content/uploads/2025/10/civil-2.png' },
    secondary: {
      mediaSide: 'right',
      media: { video: 'https://youtu.be/-MxZWA99a20' },
      quotePhotoUrl: 'https://idenfit.com/wp-content/uploads/2025/08/mustafa-yildiran@2x.png',
    },
  },
  {
    key: 'yatsan',
    name: 'Yatsan',
    mediaSide: 'left',
    media: { image: 'https://idenfit.com/wp-content/uploads/2025/10/yatsan-magaza.png' },
    quotePhotoUrl: 'https://idenfit.com/wp-content/uploads/2025/10/Muzeyyen-Kiran-Mergen.png',
  },
  {
    key: 'tugbaKuruyemis',
    name: 'Tuğba Kuruyemiş',
    mediaSide: 'right',
    media: { image: 'https://idenfit.com/wp-content/uploads/2025/08/tugbakuruyemis.jpeg' },
    // Kaynakta Nevzat Atmaca'nın fotoğrafı YOK — yalnızca isim.
  },
  {
    key: 'dogSer',
    name: 'Doğ-Ser Makina',
    mediaSide: 'left',
    media: { image: 'https://idenfit.com/wp-content/uploads/2025/08/dogser@2x.png' },
    quotePhotoUrl: 'https://idenfit.com/wp-content/uploads/2025/08/dogser-cemcolak@2x.png',
  },
  {
    // 2026-08-20: kullanıcının doğrudan sağladığı 2 gerçek fotoğraf —
    // mağaza görseli (`moi.jpg`, Beyaz Fırın'ın kendi resmi sitesinden
    // kullanıcının indirdiği Moi şubesi fotoğrafı) + Nuri Sütlüoğlu'nun
    // portresi. İkisi de `public/images/`'e yerelleştirildi (About sayfası
    // ekip fotoğrafıyla AYNI hotlink-yerine-yerel ilke, bkz. CLAUDE.md).
    // Çalışan sayısı/mağaza sayısı gibi bir istatistik PAYLAŞILMADI —
    // uydurulmadı (KARAR 1), bu yüzden `employeeCount` bilinçli olarak
    // BOŞ bırakıldı (`CustomerStoryLabels.employeeCount` bu yüzden
    // opsiyonel yapıldı, bkz. i18n/types.ts).
    key: 'beyazFirin',
    name: 'Beyaz Fırın',
    mediaSide: 'right',
    media: { image: '/images/customer-beyaz-firin-moi-magaza.jpg' },
    quotePhotoUrl: '/images/customer-beyaz-firin-nuri-sutluoglu.jpg',
  },
  {
    // 2026-08-24 — kullanıcı isteği: eski (ayrı) ana sayfa `TestimonialSection`
    // widget'ındaki 2 tanık (bkz. dosya başı yorumu) bu sayfaya da eklendi.
    // 2026-08-24 (ikinci tur): kullanıcının paylaştığı gerçek HAVAİST
    // fotoğrafı (durak/otobüs) ana medya oldu — Emre Özcan'ın portresi
    // artık diğer bloklarla (Yatsan/Doğ-Ser/Beyaz Fırın) AYNI desende
    // küçük alıntı-yazarı rozetine (`quotePhotoUrl`) taşındı.
    key: 'emreOzcan',
    name: 'HAVAİST',
    mediaSide: 'left',
    media: { image: '/images/customer-havaist.jpg' },
    quotePhotoUrl: TESTIMONIAL_PEOPLE.emreOzcan.photoUrl,
  },
  {
    // 2026-08-24 (ikinci tur): kullanıcının paylaştığı gerçek Zsa Zsa Zsu
    // mağaza fotoğrafı ana medya oldu — İsmail Ünal'ın portresi de AYNI
    // şekilde küçük alıntı-yazarı rozetine taşındı.
    key: 'ismailUnal',
    name: 'Zsa Zsa Zsu',
    mediaSide: 'right',
    media: { image: '/images/customer-zsazsazsu.jpg' },
    quotePhotoUrl: TESTIMONIAL_PEOPLE.ismailUnal.photoUrl,
  },
];

/** Hero'daki dekoratif illüstrasyon — idenfit.com'dan gerçek, doğrulanmış URL. */
export const CUSTOMER_STORIES_HERO_IMAGE =
  'https://idenfit.com/wp-content/uploads/2025/08/1@2x-3-1.png';

/** İstatistik rozetlerinin (X çalışan / X mağaza vb.) gerçek marka ikon
 * görselleri — kaynakta generic SVG değil, bu iki görsel kullanılıyor. */
export const STAT_ICONS = {
  employee: 'https://idenfit.com/wp-content/uploads/2025/08/working@2x.png',
  branch: 'https://idenfit.com/wp-content/uploads/2025/08/branch@2x.png',
} as const;

/**
 * Hero'nun HEMEN ALTINDAKİ sürekli kayan müşteri logosu şeridi
 * (2026-07-30) — idenfit.com/musteriler/'in gerçek Elementor widget'ı
 * (`elementor-widget-uicore-logo-carousel`, `data-settings.animation_style:
 * "marquee"`) canlı sayfadan çekilip 14 logonun TAMAMI (sıra dahil)
 * birebir çıkarıldı — WP Rocket'ın lazy-load placeholder'ları (`data-lazy-src`)
 * atlanıp gerçek dosya adları alındı. Ana sayfanın `CUSTOMER_LOGOS`'undan
 * (LogoStrip.astro, `2025/09/` klasörü, STATİK wrap grid) FARKLI, ayrı bir
 * set (`2025/11/` klasörü) — aynı logo/bileşen DEĞİL, karıştırılmamalı.
 * Kaynağın kendisi Swiper.js tabanlı bir JS carousel kullanıyor
 * (`logo-carousel.css`: `.ui-e-animation-marquee .swiper-wrapper{transition-
 * timing-function:linear}`) — yeni bir kütüphane (Swiper) eklemek yerine
 * projenin zaten kurulu CSS marquee tekniği (`animate-marquee` utility,
 * `global.css`, Header'ın duyuru barında da kullanılıyor) yeniden
 * kullanıldı, bkz. `CustomerLogoMarquee.astro`.
 */
// `width`/`height`: her SVG'nin kendi kök `<svg width=".." height="..">`
// attribute'undan (2026-07-30, `curl` ile tek tek doğrulandı) — marquee'de
// bunlar olmadan tarayıcı görsel yüklenene kadar yer ayırmıyor, bu da
// `w-max` track genişliğinin animasyon SIRASINDA değişip aralıklı bir
// kaymaya (glitch) yol açıyordu (bkz. `CustomerLogoMarquee.astro`'daki
// düzeltme notu). Neredeyse hepsi 100×50 — yalnızca Acun Medya 101×50.
export const CUSTOMER_LOGO_MARQUEE: { name: string; url: string; width: number; height: number }[] = [
  { name: 'Acun Medya', url: '/wp-content/uploads/2025/11/acunmedya-2-2.svg', width: 101, height: 50 },
  { name: 'Civil', url: '/wp-content/uploads/2025/11/civil-2-1.svg', width: 100, height: 50 },
  { name: 'Ferre', url: '/wp-content/uploads/2025/11/ferre-2-1.svg', width: 100, height: 50 },
  { name: 'Beyaz Fırın', url: '/wp-content/uploads/2025/11/beyaz-firin-2-1.svg', width: 100, height: 50 },
  { name: 'Havaist', url: '/wp-content/uploads/2025/11/havaist-2-1.svg', width: 100, height: 50 },
  { name: 'ZSA', url: '/wp-content/uploads/2025/11/zsa-2.svg', width: 100, height: 50 },
  { name: 'LG', url: '/wp-content/uploads/2025/11/lg-2-1.svg', width: 100, height: 50 },
  { name: 'Yatsan', url: '/wp-content/uploads/2025/11/yatsan-2-1.svg', width: 100, height: 50 },
  { name: 'Lujo', url: '/wp-content/uploads/2025/11/lujo-3.svg', width: 100, height: 50 },
  { name: 'letgo', url: '/wp-content/uploads/2025/11/letgo-2-1.svg', width: 100, height: 50 },
  { name: 'Tuğba', url: '/wp-content/uploads/2025/11/tugba-2-1.svg', width: 100, height: 50 },
  { name: 'Migros One', url: '/wp-content/uploads/2025/11/migros-one-2-1.svg', width: 100, height: 50 },
  { name: "Kellogg's", url: '/wp-content/uploads/2025/11/kellogs-2-1.svg', width: 100, height: 50 },
  { name: 'Caribou', url: '/wp-content/uploads/2025/11/caribou-2-1.svg', width: 100, height: 50 },
];

/** `youtu.be/<id>` kısa linkinden yalnızca video ID'sini çıkarır. */
export function youtubeId(url: string): string {
  return url.split('/').pop() ?? '';
}

/** `youtu.be/<id>` kısa linkini embed URL'ine çevirir (otomatik oynatmalı —
 * yalnızca kullanıcı tıkladıktan SONRA render edilen iframe için). */
export function toYoutubeEmbedUrl(url: string): string {
  return `https://www.youtube.com/embed/${youtubeId(url)}?autoplay=1`;
}

/** Gerçek YouTube thumbnail — tıkla-oynat kartının kapanış görseli
 * (kaynağın kendi widget'ı bunu göstermiyor/bozuk, bkz. yukarıdaki not —
 * biz gerçek bir görsel gösteriyoruz). */
export function toYoutubeThumbnailUrl(url: string): string {
  return `https://img.youtube.com/vi/${youtubeId(url)}/hqdefault.jpg`;
}
