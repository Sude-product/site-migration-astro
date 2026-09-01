// Ana sayfanın hero-altı bölümleri için dile bağlı OLMAYAN yapısal veri
// (logo/rozet/görsel URL'leri, marka isimleri) — metinler `src/i18n/*.ts`'in
// `home` şemasında (bkz. o dosyalardaki yorum). Kaynak: `docs/homepage-sections-report.md`,
// idenfit.com ana sayfasının `content.rendered` Elementor HTML'inden elle
// çıkarıldı (KEŞFET mega-menüsünde uygulanan yöntemin aynısı).
// GRUP 1: müşteri logo şeridi + 4'lü özellik grid'i + sertifika rozet şeridi.
// GRUP 2: video bölümü + "5 Soru" + "Kullanıcı Dostu Panel" (+ 2. form).
// GRUP 3: Suprema donanım-partner vurgusu + testimonial carousel + HRTech Alliance.
import type { Locale } from './nav';

export interface CustomerLogo {
  name: string;
  url: string;
  /** Gerçek intrinsic boyut (2026-08-10, `LogoStrip.astro`'nun `animated`
   * varyantı için eklendi — `CustomerLogoMarquee.astro`'daki AYNI
   * ders: `width`/`height` olmadan tarayıcı görsel yüklenene kadar yer
   * ayırmıyor, kayan şeritte görünür bir sıçrama/kayma yaratıyor. Her
   * dosya doğrudan indirilip SVG `viewBox`/PNG `IHDR`/WebP `VP8` header'ı
   * okunarak ölçüldü, tahmin edilmedi. */
  width: number;
  height: number;
}

// 4 dilde de AYNI (WP medya kütüphanesinde dile göre ayrı logo yok, hero'daki
// diğer görsellerle aynı ilke — bkz. productTranslationOverrides.ts'teki not).
export const CUSTOMER_LOGOS: CustomerLogo[] = [
  { name: 'Migros One', url: 'https://idenfit.com/wp-content/uploads/2025/09/migros-one.svg', width: 81, height: 48 },
  { name: 'Acun Medya', url: 'https://idenfit.com/wp-content/uploads/2025/09/Frame-1365419597.svg', width: 123, height: 51 },
  { name: "Kellogg's", url: 'https://idenfit.com/wp-content/uploads/2025/09/kelloggs.svg', width: 121, height: 42 },
  { name: 'Ferre', url: 'https://idenfit.com/wp-content/uploads/2025/09/ferre_15112021175937-1-1.png', width: 307, height: 96 },
  { name: 'Tuğba', url: 'https://idenfit.com/wp-content/uploads/2025/09/tugba.webp', width: 301, height: 125 },
  { name: 'Civil', url: 'https://idenfit.com/wp-content/uploads/2025/09/civil.svg', width: 101, height: 38 },
  { name: 'Caribou', url: 'https://idenfit.com/wp-content/uploads/2025/09/caribou.svg', width: 123, height: 36 },
];

// Kaynak sitede bu 7 rozetin `alt` metni zaten anlamsız (`icon5`..`icon11`)
// — hangi spesifik sertifika/teknolojiyi temsil ettikleri SVG path'lerinden
// güvenilir şekilde teşhis edilemedi (bkz. CLAUDE.md notu). Metin içeriği
// zaten yan paragrafta var (ISO 27001/9001, 20 yıllık deneyim) — bu yüzden
// rozetler CertificationBadges.astro'da dekoratif kabul edilip `alt=""`
// ile render ediliyor (uydurma bir sertifika adı yazmaktansa doğru
// erişilebilirlik pratiği).
export const CERTIFICATION_BADGE_URLS: string[] = [
  'https://idenfit.com/wp-content/uploads/2025/06/icon5.svg',
  'https://idenfit.com/wp-content/uploads/2025/06/icon6.svg',
  'https://idenfit.com/wp-content/uploads/2025/06/icon7.svg',
  'https://idenfit.com/wp-content/uploads/2025/06/icon8.svg',
  'https://idenfit.com/wp-content/uploads/2025/06/icon9.svg',
  'https://idenfit.com/wp-content/uploads/2025/06/icon10.svg',
  'https://idenfit.com/wp-content/uploads/2025/06/icon11.svg',
];

// "Neden idenfit?" video bölümü — `youtu.be/...` formatı, `customerStories.ts`'in
// `toYoutubeEmbedUrl()`'ü ile aynı şekilde embed URL'ine çevrilir (kod tekrarı
// yok, o fonksiyon buradan da import edilip kullanılıyor).
//
// BULUNAN VERİ HATASI (bkz. CLAUDE.md, docs/homepage-sections-report.md):
// kaynak sitede TR ve IT AYNI (Türkçe) videoyu kullanıyordu — IT'ninki
// muhtemelen hiç çevrilmemiş bir video, İtalyanca konuşulmuyor. Düzeltme:
// IT artık EN/NL ile aynı (İngilizce, en azından anlaşılır) videoyu kullanıyor.
export const HOME_VIDEO_URLS: Record<Locale, string> = {
  tr: 'https://youtu.be/N4cuH5AdDmg',
  en: 'https://youtu.be/iEQ_lep-ZY8',
  nl: 'https://youtu.be/iEQ_lep-ZY8',
  it: 'https://youtu.be/iEQ_lep-ZY8', // düzeltildi — TR'nin (Türkçe) videosu kullanılıyordu
  az: 'https://youtu.be/N4cuH5AdDmg', // az için ayrı bir kaynak videosu yok, TR'ninkiyle aynı
};

export interface LocaleImage {
  url: string;
  width: number;
  height: number;
}

// Hero bölümünün sağ kolonundaki dashboard/mockup görseli — önceki
// implementasyon burada gerçek görsel yerine kesikli çizgili bir
// placeholder kutusu gösteriyordu (bkz. CLAUDE.md "🟡 Yarım kalanlar").
// Gerçek görsel `pages.json`'daki ana sayfa ACF alanı `banner_gorsel_dashboard`'da
// duruyormuş (id 9/9818/20333/22786, `pll_translations` ile 4 dilin 4'ü de
// bağlı) — 4 dilin 4'ü de KENDİ farklı görselini kullanıyor (gerçek,
// düzeltilecek bir hata değil).
export const HOME_HERO_IMAGE: Record<Locale, LocaleImage> = {
  tr: { url: 'https://idenfit.com/wp-content/uploads/2026/04/Group-1365418917-1.png', width: 1427, height: 976 },
  en: { url: 'https://idenfit.com/wp-content/uploads/2026/06/Group-1365418980-1.png', width: 1422, height: 946 },
  nl: { url: 'https://idenfit.com/wp-content/uploads/2026/06/Group-1365418980-1-1.png', width: 1422, height: 946 },
  it: { url: 'https://idenfit.com/wp-content/uploads/2026/06/Group-1365418980-1-2.png', width: 1422, height: 946 },
  az: { url: 'https://idenfit.com/wp-content/uploads/2026/04/Group-1365418917-1.png', width: 1427, height: 976 }, // az için ayrı bir kaynak görseli yok, TR'ninkiyle aynı
};

// "Verimliliği Ölçen 5 Soru" bölümünün ekran görüntüsü.
//
// BULUNAN VERİ HATASI: kaynak sitede IT, TR'nin ekran görüntüsünü
// (`home-efficiency-1024x641.webp`) `alt="efficiency tr"` ile birlikte
// kullanıyordu (canlı idenfit.com/it/'de de HÂLÂ böyle — kaynağın kendi
// hatası, export'un değil). Düzeltme: IT artık EN'in görselini kullanıyor
// (TR'nin Türkçe arayüz görüntüsünden daha anlaşılır bir fallback).
export const HOME_EFFICIENCY_IMAGE: Record<Locale, LocaleImage> = {
  tr: { url: 'https://idenfit.com/wp-content/uploads/2025/09/home-efficiency-1024x641.webp', width: 1000, height: 626 },
  en: { url: 'https://idenfit.com/wp-content/uploads/2025/09/home-efficiency-en-1024x663.webp', width: 1000, height: 647 },
  nl: { url: 'https://idenfit.com/wp-content/uploads/2025/12/Group-1365420329-1024x582.png', width: 1000, height: 568 },
  it: { url: 'https://idenfit.com/wp-content/uploads/2025/09/home-efficiency-en-1024x663.webp', width: 1000, height: 647 }, // düzeltildi — TR'nin görseli + "efficiency tr" alt'ı kullanılıyordu
  az: { url: 'https://idenfit.com/wp-content/uploads/2025/09/home-efficiency-1024x641.webp', width: 1000, height: 626 }, // az için ayrı bir kaynak görseli yok, TR'ninkiyle aynı
};

// "Kullanıcı Dostu Panel" bölümünün dashboard mockup görseli — TR/EN/IT
// kaynakta zaten AYNI görseli paylaşıyor (gerçek, bilinçli — düzeltilecek
// bir hata değil), yalnızca NL kendi farklı görselini kullanıyor.
export const HOME_PANEL_IMAGE: Record<Locale, LocaleImage> = {
  tr: { url: 'https://idenfit.com/wp-content/uploads/2025/09/pnl-img-1024x644.webp', width: 1000, height: 629 },
  en: { url: 'https://idenfit.com/wp-content/uploads/2025/09/pnl-img-1024x644.webp', width: 1000, height: 629 },
  nl: { url: 'https://idenfit.com/wp-content/uploads/2025/12/Group-1365420439-1024x589.png', width: 1000, height: 575 },
  it: { url: 'https://idenfit.com/wp-content/uploads/2025/09/pnl-img-1024x644.webp', width: 1000, height: 629 },
  az: { url: 'https://idenfit.com/wp-content/uploads/2025/09/pnl-img-1024x644.webp', width: 1000, height: 629 }, // az için ayrı bir kaynak görseli yok, TR'ninkiyle aynı
};

// Suprema donanım-partner vurgusu — TR/IT aynı ürün görselini paylaşıyor,
// EN/NL kendi farklı görsellerini kullanıyor (kaynakta gerçek, düzeltilecek
// bir hata değil). Suprema logosu 4 dilde aynı.
export const SUPREMA_LOGO_URL = 'https://idenfit.com/wp-content/uploads/2025/08/suprema-logo.png';

// "Donanım Özgürlüğü" mini-bölümü (2026-08-27, kullanıcının verdiği
// referans görsel/metin) — Suprema'nın YANINA eklenen 3 yeni marka logosu.
// Kaynak sitede bu 4'lü liste hiç yoktu (yalnızca düz metin "Suprema/
// ZKTeco/Bab" listesi vardı, `/donanim/`'in "Onaylı Markalar" bölümünde) —
// kullanıcı GÜNCEL/doğru markaları (Suprema/Hikvision/ZKTeco/Dahua) verdi.
// Suprema: `SUPREMA_LOGO_URL` ile AYNI (tek kaynaktan, ikinci bir dosya
// YOK). Hikvision/Dahua: Wikimedia Commons'tan (CC0/public domain, basit
// geometrik logo — telif korumasına tabi değil) indirilip yerelleştirildi.
// ZKTeco: Wikimedia Commons'ta yok, resmi `zkteco.com` sitesinin kendi
// header logosu (`/en/public/static/modules/cms/images/logo.png`)
// yerelleştirildi — gerçek/güncel marka logosu, kaynak Wikimedia'daki
// diğer ikisiyle AYNI "resmi kaynak" ilkesini izliyor.
// `width`/`height` her logonun GERÇEK oranını yansıtıyor (24px ortak
// yükseklikte ölçeklendi — `SupremaSection.astro`'nun `h-6 w-auto
// object-contain` render kuralıyla, `CUSTOMER_LOGO_MARQUEE`'nin AYNI
// ilkesiyle) — CLS'i önlemek için gerçek en-boy oranı korunmalı.
export const HARDWARE_BRAND_LOGOS: { name: string; url: string; width: number; height: number }[] = [
  { name: 'Suprema', url: SUPREMA_LOGO_URL, width: 170, height: 24 },
  { name: 'Hikvision', url: '/images/brand-hikvision.svg', width: 179, height: 24 },
  { name: 'ZKTeco', url: '/images/brand-zkteco.png', width: 104, height: 24 },
  { name: 'Dahua', url: '/images/brand-dahua.svg', width: 77, height: 24 },
];

export interface PartnerLogo {
  name: string;
  url: string;
  width: number;
  height: number;
}

export interface PartnerCategory {
  /** `t.home.partners.categories`'in anahtarlarından biri. */
  key: 'turnstile' | 'payroll' | 'lms' | 'task' | 'sso';
  logos: PartnerLogo[];
}

// "Partnerlerimiz" bölümü (2026-09-02, kullanıcı isteği) — `SupremaSection`'ın
// (donanım entegrasyonu) HEMEN ALTINDA, AYNI minimal marka-logosu-satırı
// deseniyle (`HARDWARE_BRAND_LOGOS`). Her logo ilgili firmanın KENDİ resmi
// web sitesinden indirildi (magic-byte doğrulaması yapıldı, hotlink YOK —
// Görsel bağımlılık kuralı). Dile bağlı değil, `PARTNER_CATEGORIES` tüm
// locale'lerde AYNI (yalnızca kategori ETİKETLERİ `t.home.partners.categories`'de
// çevriliyor). `anzera.svg` kaynakta beyaz-dolgulu (koyu zemin için
// tasarlanmış) — açık zeminde görünür olması için `#1A1A1A`'ya yeniden
// renklendirildi (markanın ŞEKLİ/İÇERİĞİ değişmedi, yalnızca kontrast
// düzeltmesi). `ozak.png` — kaynak dosya artık "CAME ÖZAK" ortak markalı
// (2023 satın alma sonrası) ama kullanıcının listesinde yalnızca "ÖZAK"
// vardı, "CAME" adında bir firma YOK — `sharp` ile sağ taraftaki saf
// "ÖZAK" wordmark'ı (T-ikonu + ÖZAK) kırpılıp CAME kısmı çıkarıldı
// (markanın kendi şekli/rengi DEĞİŞMEDİ, yalnızca kadraj).
export const PARTNER_CATEGORIES: PartnerCategory[] = [
  {
    key: 'turnstile',
    logos: [
      { name: 'Tansa', url: '/images/partners/tansa.png', width: 107, height: 60 },
      { name: 'ÖZAK', url: '/images/partners/ozak.png', width: 1370, height: 355 },
    ],
  },
  {
    key: 'payroll',
    logos: [
      { name: 'SAP', url: '/images/partners/sap.svg', width: 412, height: 204 },
      { name: 'Oracle', url: '/images/partners/oracle.svg', width: 231, height: 30 },
      { name: 'Mikro', url: '/images/partners/mikro.svg', width: 87, height: 46 },
      { name: 'Logo', url: '/images/partners/logo-yazilim.svg', width: 93, height: 34 },
      { name: 'Datassist', url: '/images/partners/datassist.png', width: 400, height: 68 },
    ],
  },
  {
    key: 'lms',
    logos: [
      { name: 'Anzera', url: '/images/partners/anzera.svg', width: 127, height: 30 },
      { name: 'Enocta', url: '/images/partners/enocta.svg', width: 120, height: 74 },
    ],
  },
  {
    key: 'task',
    logos: [{ name: 'Jira', url: '/images/partners/jira.svg', width: 124, height: 48 }],
  },
  {
    key: 'sso',
    logos: [
      { name: 'Google', url: '/images/partners/google.svg', width: 75, height: 24 },
      { name: 'Microsoft', url: '/images/partners/microsoft.png', width: 216, height: 46 },
      { name: 'Amazon', url: '/images/partners/amazon.svg', width: 603, height: 182 },
    ],
  },
];

export const HOME_SUPREMA_IMAGE: Record<Locale, LocaleImage> = {
  tr: { url: 'https://idenfit.com/wp-content/uploads/2025/09/systems-desktop-1-1024x996.webp', width: 1000, height: 973 },
  en: { url: 'https://idenfit.com/wp-content/uploads/2025/09/temassiz-1-1024x996.webp', width: 1000, height: 973 },
  nl: { url: 'https://idenfit.com/wp-content/uploads/2025/12/Mask-group-1024x996.png', width: 1000, height: 973 },
  it: { url: 'https://idenfit.com/wp-content/uploads/2025/09/systems-desktop-1-1024x996.webp', width: 1000, height: 973 },
  az: { url: 'https://idenfit.com/wp-content/uploads/2025/09/systems-desktop-1-1024x996.webp', width: 1000, height: 973 }, // az için ayrı bir kaynak görseli yok, TR'ninkiyle aynı
};

// Testimonial carousel — /musteriler/'deki 5 müşteri hikayesinden TAMAMEN
// FARKLI 2 yeni tanık (bkz. docs/homepage-sections-report.md §11). İsim/
// fotoğraf dile bağlı olmadığı için burada (Footer/customerStories.ts'teki
// şirket-adı ilkesiyle aynı); alıntı metni + unvan `src/i18n/*.ts`'in
// `home.testimonials` şemasında (unvan dile göre değişiyor, ör. Emre
// Özcan'ın unvanı EN'de "Corporate Communications Manager").
export interface TestimonialPerson {
  name: string;
  photoUrl: string;
}

export const TESTIMONIAL_PEOPLE = {
  ismailUnal: {
    name: 'İsmail Ünal',
    photoUrl: 'https://idenfit.com/wp-content/uploads/2025/09/ismail-unal.webp',
  },
  emreOzcan: {
    name: 'Emre Özcan',
    photoUrl: 'https://idenfit.com/wp-content/uploads/2025/09/emre-ozcan.webp',
  },
} satisfies Record<string, TestimonialPerson>;

