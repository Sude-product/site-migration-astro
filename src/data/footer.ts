// Footer yapısı — idenfit.com'un canlı footer'ından çıkarıldı.
// METİNLER burada değil, src/i18n/*.ts'in `footer` şemasında (bkz. anahtar
// eşlemeleri aşağıda). Bu dosya yalnızca slug/URL/sıra bilgisini tutar.

import type { Translations } from '../i18n';

export interface FooterLinkItem<K extends string> {
  /** Site-local slug (dil öneki hariç). */
  slug: string;
  /** i18n `footer.links.*` şemasındaki karşılık gelen anahtar. */
  key: K;
}

export const FOOTER_ABOUT_LINKS: FooterLinkItem<keyof Translations['footer']['links']['about']>[] = [
  { slug: 'hakkimizda', key: 'story' },
  { slug: 'iletisim', key: 'contact' },
  { slug: 'blog', key: 'blog' },
  { slug: 'kisisel-verilerin-korunmasi', key: 'kvkk' },
  { slug: 'guvenlik', key: 'security' },
  { slug: 'hedef-global-marka', key: 'globalBrand' },
];

export const FOOTER_PRODUCT_LINKS: FooterLinkItem<keyof Translations['footer']['links']['products']>[] = [
  { slug: 'calisan-ozluk-yonetimi-modulu', key: 'employeeRecords' },
  { slug: 'ise-alim-modulu', key: 'recruitment' },
  { slug: 'calisan-performans-degerlendirme-sistemi-modulu', key: 'performance' },
  { slug: 'calisan-egitim-yonetimi-modulu', key: 'training' },
  { slug: 'puantaj-takip-programi-modulu', key: 'timesheet' },
  { slug: 'yillik-izin-takip-programi', key: 'leaveManagement' },
  { slug: 'donanim', key: 'hardware' },
  { slug: 'pdks-modulu', key: 'timeAttendance' },
];

// Sıra + 7. madde (`securityPolicy`) idenfit.com'un canlı GENEL kolonundan
// birebir (2026-07-24 doğrulandı) — kaynakta "Gizlilik ve Güvenlik
// Politikası" burada AYRI bir link olarak duruyor (yalnızca alt barda
// değil). **Bu, About kolonundaki `security` (Güvenlik — 6 hukuki belgeye
// link veren LİSTE sayfası) girdisiyle AYNI sayfa DEĞİL** — gerçek paragraf
// içerikli ayrı bir makale (`sozlesme/gizlilik-ve-guvenlik-politikasi`,
// `getPrivacySecuritySlug()`). Önceki bir turda bu ikisi yanlışlıkla aynı
// sayfa sanılıp `securityPolicy` de `SPECIAL_HREFS.security`'ye
// bağlanmıştı — kullanıcı düzeltmesiyle (2026-07-24) ayrıştırıldı, bkz.
// CLAUDE.md. `slug` alanı per-locale slug farklı olduğu için boş
// bırakıldı, Footer.astro'daki render mantığı `key==='securityPolicy'`
// için `SPECIAL_HREFS.securityPolicy`'ye (`getPrivacySecuritySlug()`) düşüyor.
export const FOOTER_GENERAL_LINKS: FooterLinkItem<keyof Translations['footer']['links']['general']>[] = [
  { slug: 'fiyatlar', key: 'pricing' },
  { slug: 'neden-idenfit', key: 'advantages' },
  { slug: 'musteriler', key: 'successStories' },
  { slug: 'sss', key: 'faq' },
  { slug: 'sozlesme/tuketici-haklari', key: 'consumerRights' },
  { slug: '', key: 'securityPolicy' },
  { slug: 'sozlesme/mesafeli-satis-sozlesmesi', key: 'distanceSalesAgreement' },
];

/** İletişim bilgileri — adres/telefon/email dil-nötr (adres çevrilmez). */
export const FOOTER_CONTACT = {
  address: 'Teknopark Bulvarı 1/1A Blok No:109, Teknopark, İstanbul',
  phoneHref: 'tel:+902162950927',
  phoneLabel: '+90 216 295 09 27',
  emailHref: 'mailto:hello@idenfit.com',
  emailLabel: 'hello@idenfit.com',
};

// Sosyal medya — idenfit.com footer'ından gerçek URL'ler VE gerçek SIRA
// (2026-07-24'te canlı `<footer>` yeniden incelenip düzeltildi — önceki
// sürüm 5 platformu FARKLI bir sırayla listeliyordu ve Pinterest/Medium'u
// hiç içermiyordu; kaynakta 7 platform var). Bu liste `BaseLayout.astro`'nun
// Organization JSON-LD `sameAs` alanı tarafından da AYNEN yeniden kullanılıyor
// (2026-08-22) — sosyal linkler iki yerde ayrı ayrı tutulmuyor.
// **2026-08-22 düzeltme:** LinkedIn href'i eski/artık geçerli olmayan
// `/company/idenfit/` slug'ından kanonik `/company/idenfithr/`'e
// güncellendi — eski slug hâlâ çalışıyordu ama LinkedIn tarafında 301 ile
// yeni slug'a yönleniyordu (doğrulandı), `sameAs` bir yönlendirmeyi değil
// sayfanın kendisini işaret etmeli.
// **2026-08-27 düzeltme (kullanıcı isteği):** X (Twitter) ve Pinterest
// kaldırıldı — kalan 5 platform (Facebook/YouTube/Instagram/LinkedIn/
// Medium). Bu liste `BaseLayout.astro`'nun Organization JSON-LD
// `sameAs` alanınca da PAYLAŞILDIĞI için (dosya başı yorumu) o şema da
// otomatik olarak 5 platforma indi — ikinci bir yerde ayrıca
// güncellenmesi GEREKMEDİ.
export const FOOTER_SOCIAL = [
  { platform: 'facebook', href: 'https://www.facebook.com/idenfit', label: 'Facebook' },
  { platform: 'youtube', href: 'https://www.youtube.com/channel/UCE-4lk4QsU71NfTI7vxPCJQ/', label: 'YouTube' },
  { platform: 'instagram', href: 'https://www.instagram.com/idenfitcom/', label: 'Instagram' },
  { platform: 'linkedin', href: 'https://www.linkedin.com/company/idenfithr/', label: 'LinkedIn' },
  { platform: 'medium', href: 'https://medium.com/@idenfit', label: 'Medium' },
] as const;

// Mobil uygulama linkleri — idenfit.com footer'ında sosyal ikonların hemen
// altında, aynı stilde (ikon rozeti) 2 link olarak duruyor. Gerçek
// hedefler: Android linki doğrudan idenfit'in kendi uygulamasına gidiyor
// (paket adı "com.globme.timeware" — Globme, idenfit'i geliştiren yazılım
// şirketi/altyapı sağlayıcısı); iOS linki ise doğrudan bir uygulama sayfası
// DEĞİL, Globme'nin App Store geliştirici profili (kaynakta da böyle,
// bizim hatamız değil — App Store'da bu uygulamanın ayrı bir sayfası
// bulunamadı, geliştirici profili en yakın gerçek hedef).
export const FOOTER_APPS = [
  { platform: 'apple', href: 'https://apps.apple.com/tr/developer/globme/id1459343988?l=tr', label: 'App Store' },
  {
    platform: 'android',
    href: 'https://play.google.com/store/apps/details?id=com.globme.timeware&pcampaignid=web_share',
    label: 'Google Play',
  },
] as const;

// Güven rozetleri şeridi (SSL/ISO 27001/Peryön/GDPR) — kullanıcının kendi
// sağladığı 4 AYRI görsel (`public/images/trust-badge-*`, `demo-bar-avatar.jpg`'deki
// AYNI ilke: wp-content/uploads hotlink değil, yerel dosya). Sıra
// kullanıcının verdiği sırayla (SSL→ISO→Peryön→GDPR) — alfabetik/dosya
// adı sırası DEĞİL.
// DÜZELTME (2026-08-27, kullanıcı isteği: "soldaki logoları beyaz alt
// tabanlı değil de transparan yapmayı dene") — SSL/ISO ham dosyaları
// (`.webp`) opak beyaz zeminli DÜZ görsellerdi (gerçek alfa kanalı YOK,
// lossy VP8), Peryön/GDPR'nin aksine (ikisi zaten gerçek RGBA şeffaflığa
// sahipti, `sharp` ile doğrulandı). SSL/ISO, `scripts/`de kalıcı
// olmayan tek seferlik bir Node/`sharp` script'iyle luminans-tabanlı
// chroma-key uygulanıp (beyaza yakın piksel→şeffaf, koyu mürekkep→opak)
// gerçek alfa kanallı `.png`'ye çevrildi — görsel İÇERİK (metin/ikon)
// DEĞİŞMEDİ, yalnızca beyaz zemin şeffaflaştı. `Footer.astro`'daki
// beyaz kart sarmalayıcısı (`bg-white/95`) bu yüzden kaldırılabildi.
// `width`/`height` PNG dosyalarının kendi IHDR chunk'ından ölçüldü (2026-08-31,
// CLS önleme turu) — `class="h-10 w-auto"` yalnızca yüksekliği sabitliyor,
// genişlik görsel yüklenene kadar tarayıcı için bilinmiyordu.
export const TRUST_BADGE_LOGOS: { key: 'ssl' | 'iso' | 'peryon' | 'gdpr'; src: string; width: number; height: number }[] = [
  { key: 'ssl', src: '/images/trust-badge-ssl.png', width: 800, height: 400 },
  { key: 'iso', src: '/images/trust-badge-iso27001.png', width: 600, height: 600 },
  { key: 'peryon', src: '/images/trust-badge-peryon.png', width: 720, height: 360 },
  { key: 'gdpr', src: '/images/trust-badge-gdpr.png', width: 1574, height: 1574 },
];
