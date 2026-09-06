// Kalan öncelikli sayfaların (İletişim, Tüketici Hakları Sözleşmesi,
// Mesafeli Satış Sözleşmesi, Güvenlik, Hedef Global Marka, Neden İdenfit)
// veri katmanı. Kaynak: `reference/wordpress-export/misc-pages.json`
// (`scripts/extract-misc-pages.mjs` ile yerel `pages.json`'dan). `link`
// alanı otoriter (WP `slug` değil) — bu dosyada da aynı ilke.
import { getRelativeLocaleUrl } from 'astro:i18n';
import miscExport from '../../reference/wordpress-export/misc-pages.json';
import { deepRelativizeWpUrls } from './relativizeWpUrls';
import { cleanRichText, localizeCtaUrl, type ProductBlock, type ProductContent } from './productContent';
import { fixLinkAccessibility } from './contentLinkAccessibility';
import {
  CONTACT_IT_OVERRIDE,
  CONTACT_AZ_OVERRIDE,
  SECURITY_IT_OVERRIDE,
  GLOBAL_BRAND_IT_HERO,
  GLOBAL_BRAND_IT_SECTIONS,
  GLOBAL_BRAND_NL_HERO,
  GLOBAL_BRAND_NL_SECTIONS,
  GLOBAL_BRAND_AZ_HERO,
  GLOBAL_BRAND_AZ_SECTIONS,
  WHY_IDENFIT_IT_HERO,
  WHY_IDENFIT_IT_SECTIONS,
  WHY_IDENFIT_AZ_HERO,
  WHY_IDENFIT_AZ_SECTIONS,
  ABOUT_EN_SECTIONS,
  ABOUT_IT_HERO,
  ABOUT_IT_SECTIONS,
  ABOUT_AZ_HERO,
  ABOUT_AZ_SECTIONS,
  ABOUT_TEAM_PHOTO_IMAGE,
  PRESENTATION_IT_OVERRIDE,
  PRESENTATION_EN_OVERRIDE,
  PRESENTATION_NL_OVERRIDE,
  PRESENTATION_AZ_OVERRIDE,
  AZ_SLUGS,
  type SecurityItem,
  type PresentationContent,
} from './miscPagesTranslationOverrides';

export type { SecurityItem, PresentationContent };
import type { Locale } from './nav';

interface RawGroup {
  trSlug: string;
  kind: 'contact' | 'legal' | 'security' | 'productLike';
  locales: Partial<
    Record<
      Locale,
      { id: number; slug: string; title: string; modified: string; content: unknown }
    >
  >;
}
// Açık nokta #45, yol (B) — bkz. `relativizeWpUrls.ts` yorumu.
const DATA = deepRelativizeWpUrls(miscExport as unknown as { pages: RawGroup[] });

function findGroup(trSlug: string): RawGroup | undefined {
  return DATA.pages.find((g) => g.trSlug === trSlug);
}

/** Sayfanın GERÇEK WP `modified` tarihi ("No visible content dates" GEO
 * bulgusu, 2026-08-17 — bkz. CLAUDE.md, `productContent.ts`'teki AYNI
 * fonksiyonun yorumu). Bu ham tarih yalnızca RAW WP içeriği gösterilen
 * locale'ler için anlamlı — GlobalBrand/WhyIdenfit/About'un TAM İtalyanca
 * override'ı (`GLOBAL_BRAND_IT_HERO` vb.) gibi içerik TAMAMEN bizim elle
 * yazdığımız bir çeviriyse, çağıran fonksiyon bu locale için BİLEREK
 * `undefined` döndürmeli (bkz. `getGlobalBrandModifiedDate()` vb.) — aksi
 * halde ekranda "Son güncelleme: [eski WP tarihi]" yazıp altında bizim
 * çok daha yeni yazdığımız bir metin göstermek yanıltıcı olurdu. */
function getMiscModifiedDate(trSlug: string, locale: Locale): Date | undefined {
  const raw = findGroup(trSlug)?.locales[locale]?.modified;
  return raw ? new Date(raw) : undefined;
}

function localeUrlsFor(trSlug: string): Partial<Record<Locale, string>> {
  const group = findGroup(trSlug);
  if (!group) return {};
  const result: Partial<Record<Locale, string>> = {};
  for (const [locale, entry] of Object.entries(group.locales) as [Locale, { slug: string }][]) {
    result[locale] = getRelativeLocaleUrl(locale, entry.slug);
  }
  // BULUNAN BUG (2026-07-22): bu gruplardan bazılarının (KVKK, Tüketici
  // Hakları, Mesafeli Satış, Güvenlik) NL'de kaynak sayfası hiç yok —
  // `result.nl` burada hiç set edilmiyordu. `Header.astro`'nun
  // `localeUrls` merge mantığı (`{...generic, ...override}`) bu durumda
  // NL için kendi GENERIC (yanlış, "aktif path'in bare slug'ı + nl
  // prefix'i" varsayan) hesaplamasını sızdırıyordu — bu da TR sayfasından
  // NL'e geçerken (bare slug TR'ninkiyle aynı olduğu için) `astro.config.mjs`'teki
  // elle redirect'e denk gelip ÇALIŞIYOR, ama EN/IT sayfasından NL'e
  // geçerken (bare slug farklı, o path için redirect tanımlı değil) GERÇEK
  // 404 veriyordu — "bazen İngilizce'ye düşüyor, bazen hata veriyor"
  // tutarsızlığının kök nedeni buydu. Düzeltme: `nl` eksikse (ve `en`
  // varsa) doğrudan EN'in gerçek URL'ine eşitleniyor — `getFaqLocaleUrls()`'te
  // (bkz. faqContent.ts) daha önce uygulanan aynı düzeltme, artık bu
  // paylaşılan fonksiyonda TÜM `legal`/`security` tipi sayfalar için
  // merkezi olarak yapılıyor. Sonuç: NL seçeneği HER ZAMAN (hangi
  // sayfadan tıklanırsa tıklansın) doğrudan EN'in gerçek URL'ine gider —
  // tutarsız ara-adım/404 riski kalmadı.
  if (!result.nl && result.en) result.nl = result.en;
  // AYNI bug sınıfı, az için (2026-09-02, kullanıcı bulgusu —
  // `/az/richiesta-supporto/` 404 veriyordu, bkz. `supportRequestContent.ts`'teki
  // eşdeğer düzeltmenin yorumu). Bu sayfa ailesi (KVKK/Tüketici Hakları/
  // Mesafeli Satış/Güvenlik) az'de KAPSAM DIŞI (Açık nokta #37) — gerçek
  // az içeriği yok, `result.tr` (bare TR URL'i, zaten yukarıdaki döngüde
  // hesaplandı) doğrudan kullanılıyor, `/az/...` üzerinden gereksiz bir
  // redirect adımına GEREK YOK.
  if (!result.az) result.az = result.tr;
  return result;
}

function slugFor(trSlug: string, locale: Locale): string | undefined {
  return findGroup(trSlug)?.locales[locale]?.slug;
}

// ============================== İletişim ==============================
export interface ContactOffice {
  name: string;
  address: string;
}
export interface ContactImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}
export interface ContactContent {
  pageTitle: string;
  pageSubtitle: string;
  callTitle: string;
  callText: string;
  callLinkUrl: string;
  emailTitle: string;
  emailLinkUrl: string;
  formTitle: string;
  officesTitle: string;
  offices: ContactOffice[];
  /** Bisikletli kişi illüstrasyonu — kaynakta 4 dilde AYNI görsel
   * (2026-08-11 eklendi, bkz. CLAUDE.md "İletişim sayfası eksik-bölüm
   * turu"). Dekoratif — render'da `alt=""` kullanılır (kaynağın ham
   * `alt`'i dosya-adı kaynaklı anlamsız metin, `check-image-alt-text.mjs`
   * turundaki AYNI düzeltme ilkesi). */
  heroImage: ContactImage | null;
  /** Gerçek ofis fotoğrafı (kolaj), 4 dilde AYNI görsel. */
  officesImage: ContactImage | null;
  /** Kaynağın statik dünya haritası illüstrasyonu (taralı desen + kırmızı
   * yıldız pin'ler — GERÇEK bir sokak/uydu haritası DEĞİL, "global ofis
   * varlığı" temalı bir illüstrasyon). 2026-08-11'de bir tur canlı/
   * interaktif bir Google Maps embed'iyle DEĞİŞTİRİLMİŞTİ (KARAR 1) —
   * kullanıcı geri bildirimiyle aynı gün kaynağa sadık statik görsele
   * GERİ DÖNÜLDÜ. TR kendi dosyasını kullanıyor, EN/NL/IT paylaşılan
   * AYNI dosyayı (kaynakta da öyle). */
  mapImage: ContactImage | null;
  socialMediaTitle: string;
  /** Locale'e özel gerçek YouTube linki (TR farklı, EN/NL/IT aynı video) —
   * kaynakta boş bir tıkla-oynat kutusu, biz zaten var olan
   * `YoutubeClickToPlay.tsx`'i yeniden kullanıyoruz. */
  videoUrl: string;
}

const CONTACT_TR_SLUG = 'iletisim';

export function getContactContent(locale: Locale): ContactContent | undefined {
  if (locale === 'it') return CONTACT_IT_OVERRIDE;
  if (locale === 'az') return CONTACT_AZ_OVERRIDE;
  const raw = findGroup(CONTACT_TR_SLUG)?.locales[locale]?.content as ContactContent | undefined;
  return raw;
}
export function getContactSlug(locale: Locale): string | undefined {
  if (locale === 'az') return AZ_SLUGS.contact;
  return slugFor(CONTACT_TR_SLUG, locale);
}
export function getContactLocaleUrls(): Partial<Record<Locale, string>> {
  return { ...localeUrlsFor(CONTACT_TR_SLUG), az: getRelativeLocaleUrl('az', AZ_SLUGS.contact) };
}
/** az'de içerik TAMAMEN bizim çevirimiz (`CONTACT_AZ_OVERRIDE`) — ham WP
 * `modified` tarihi o metne karşılık GELMİYOR (bkz. `getGlobalBrandModifiedDate()`'in
 * AYNI ilkesi). */
export function getContactModifiedDate(locale: Locale): Date | undefined {
  if (locale === 'az') return undefined;
  return getMiscModifiedDate(CONTACT_TR_SLUG, locale);
}

// Meta description override (2026-08-10, meta description uzunluk denetimi)
// — `ContactPage.astro` önceden `content.pageTitle`'ı description olarak
// kullanıyordu (TR "Her türlü iletişime açığız", 26 karakter; EN "Contact
// Us", 10 karakter). Sayfanın kendi başlık+alt başlık gerçek metninden
// (`pageTitle`/`pageSubtitle`) sentezlendi, kopya çeviri değil. NL kendi
// gerçek İletişim sayfasına sahip (bkz. `nl/mededelingen.astro`'daki
// yorum — WP'nin YANLIŞ slug'ına rağmen gerçek içerik), bu yüzden NL'nin
// de kendi açıklaması var (EN'e fallback DEĞİL).
const CONTACT_META_DESCRIPTION: Partial<Record<Locale, string>> = {
  tr: "Her türlü iletişime açığız — sınırsız destek ve bilgi için her zaman yanınızdayız. Telefon, e-posta ve ofislerimizle idenfit'e ulaşın.",
  en: "Contact idenfit for any assistance you need — reach us by phone, email or visit one of our offices, we're ready to help.",
  nl: 'Neem contact met ons op — als u verdere hulp nodig heeft, staan we voor u klaar via telefoon, e-mail of onze kantoren.',
  it: 'Siamo aperti a qualsiasi tipo di comunicazione: contatta idenfit per telefono, e-mail o presso i nostri uffici, siamo sempre al tuo fianco.',
  az: "Hər cür əlaqəyə açığıq — telefon, e-poçt və ofislərimiz vasitəsilə idenfit-ə çatın, hər zaman yanınızdayıq.",
};
export function getContactMetaDescription(locale: Locale): string | undefined {
  return CONTACT_META_DESCRIPTION[locale];
}

// ==================== Tüketici Hakları / Mesafeli Satış ====================
// İkisi de aynı şekilde: tek `contentHtml` alanı, 3 dilde de (tr/en/it)
// zaten gerçek/kaliteli çeviri — override GEREKMEDİ.
export interface LegalContent {
  title: string;
  contentHtml: string;
}

// "Links without descriptive text" turu (2026-08-19) — KVKK ailesinin
// "başvuru formumuza **buradan**/**here**/**qui** ulaşabilirsiniz" cümlesi
// TR/EN/IT'de aynı deseni taşıyor (NL bu sayfada yok). `deriveHrefLabel()`'in
// otomatik slug-türetimi bir PDF dosya adı için ("Veri_Sahibi_Basvuru_Formu_v2")
// yine de OKUNABİLİR bir sonuç verirdi ama gerçek belgenin NE OLDUĞUNU
// (bir başvuru formu) söylemez — bu yüzden elle yazılmış, doğru dilde bir
// etiket verildi. Yalnızca `href`'e TAM eşleşen linkler etkileniyor,
// `fixLinkAccessibility()` başka HİÇBİR linke dokunmuyor (zaten metinli/
// açıklayıcı linkler bu fonksiyonun genel jenerik-metin/isimsiz-link
// stratejisiyle değişmeden kalıyor).
const LEGAL_MANUAL_LINK_LABELS: Partial<Record<Locale, Record<string, string>>> = {
  tr: {
    '/wp-content/uploads/2025/09/Veri_Sahibi_Basvuru_Formu_v2.docx.pdf':
      'Veri sahibi başvuru formunu indir (PDF)',
  },
  en: {
    '/wp-content/uploads/2025/09/Veri_Sahibi_Basvuru_Formu_v2-EN.docx.pdf':
      'Download the data subject application form (PDF)',
  },
  it: {
    '/wp-content/uploads/2025/09/Veri_Sahibi_Basvuru_Formu_v2-EN.docx.pdf':
      "Scarica il modulo di domanda dell'interessato (PDF)",
  },
};

export function getLegalContent(trSlug: string, locale: Locale): LegalContent | undefined {
  const entry = findGroup(trSlug)?.locales[locale];
  if (!entry) return undefined;
  const raw = entry.content as { contentHtml: string };
  const contentHtml = fixLinkAccessibility(cleanRichText(raw.contentHtml), LEGAL_MANUAL_LINK_LABELS[locale], locale);
  return { title: entry.title, contentHtml };
}
export function getLegalSlug(trSlug: string, locale: Locale): string | undefined {
  return slugFor(trSlug, locale);
}
export function getLegalLocaleUrls(trSlug: string): Partial<Record<Locale, string>> {
  return localeUrlsFor(trSlug);
}
export function getLegalModifiedDate(trSlug: string, locale: Locale): Date | undefined {
  return getMiscModifiedDate(trSlug, locale);
}

export const CONSUMER_RIGHTS_TR_SLUG = 'sozlesme/tuketici-haklari';
export const DISTANCE_SALES_TR_SLUG = 'sozlesme/mesafeli-satis-sozlesmesi';

// ==================== Gizlilik ve Güvenlik Politikası ====================
// Güvenlik sayfasından (SECURITY_TR_SLUG, `guvenlik` — 6 hukuki belgeye
// link veren bir LİSTE sayfası) TAMAMEN AYRI bir sayfa: gerçek paragraf
// içerikli bir gizlilik politikası makalesi (`content_block`, KVKK'yla
// aynı `legal` şeması). Önceki bir turda bu ikisi yanlışlıkla AYNI sayfa
// sanılıp footer linki `guvenlik`'e yönlendirilmişti — kullanıcı
// düzeltmesiyle (2026-07-24) bu sayfa gerçekten migrate edildi. IT'nin ham
// WP `title` alanı junk ("Privacy and Security Policy_IT" — İngilizce +
// anlamsız "_IT" soneki, `content_block`'un kendisi gerçek İtalyanca) —
// KVKK_IT_TITLE'daki aynı düzeltme burada da uygulanıyor.
export const PRIVACY_SECURITY_TR_SLUG = 'sozlesme/gizlilik-ve-guvenlik-politikasi';
const PRIVACY_SECURITY_IT_TITLE = 'Politica sulla Privacy e Sicurezza';

export function getPrivacySecurityContent(locale: Locale): LegalContent | undefined {
  const content = getLegalContent(PRIVACY_SECURITY_TR_SLUG, locale);
  if (!content) return undefined;
  if (locale === 'it') return { ...content, title: PRIVACY_SECURITY_IT_TITLE };
  return content;
}
export function getPrivacySecuritySlug(locale: Locale): string | undefined {
  return getLegalSlug(PRIVACY_SECURITY_TR_SLUG, locale);
}
export function getPrivacySecurityLocaleUrls(): Partial<Record<Locale, string>> {
  return getLegalLocaleUrls(PRIVACY_SECURITY_TR_SLUG);
}
export function getPrivacySecurityModifiedDate(locale: Locale): Date | undefined {
  return getMiscModifiedDate(PRIVACY_SECURITY_TR_SLUG, locale);
}

// ============================== KVKK Aydınlatma Metni ==============================
// TR/EN/IT'nin üçü de zaten gerçek, tam, birbirinden farklı çeviri (18KB/16KB/18KB
// düz metin — kaynak sitede sıkça görülen "IT = EN kopyası" örüntüsü BURADA
// YOK, kontrol edildi). Tek istisna: IT'nin ham WP `<title>` alanı
// ("Information Text Regarding Personal Data&IT" — İngilizce + anlamsız
// "&IT" soneki) — GlobalBrand/Hakkımızda'daki "About_IT" ile aynı sınıf
// junk, yalnızca bu tek alan gerçek İtalyanca'yla değiştirildi.
export const KVKK_TR_SLUG = 'kisisel-verilerin-korunmasi';
const KVKK_IT_TITLE = 'Informativa sulla Protezione dei Dati Personali';

export function getKvkkContent(locale: Locale): LegalContent | undefined {
  const content = getLegalContent(KVKK_TR_SLUG, locale);
  if (!content) return undefined;
  if (locale === 'it') return { ...content, title: KVKK_IT_TITLE };
  return content;
}
export function getKvkkSlug(locale: Locale): string | undefined {
  return getLegalSlug(KVKK_TR_SLUG, locale);
}
export function getKvkkLocaleUrls(): Partial<Record<Locale, string>> {
  return getLegalLocaleUrls(KVKK_TR_SLUG);
}
export function getKvkkModifiedDate(locale: Locale): Date | undefined {
  return getMiscModifiedDate(KVKK_TR_SLUG, locale);
}

// ============================== KVK Protokol ==============================
// Ana KVKK Aydınlatma Metni'nden AYRI bir sayfa — 2026-08-05'te kapsamlı
// URL denetimiyle bulunan, önceki modül/sayfa migrasyon turlarında
// kaçırılmış bir hukuki doküman (yalnızca TR+EN, kaynakta NL/IT hiç yok).
// İçerik `content_block` ACF alanından değil, doğrudan `content.rendered`
// içindeki bir Elementor "HTML" widget'ından geliyor (bkz.
// `scripts/extract-misc-pages.mjs`'teki `extractLegalFromRenderedHtml()`
// yorumu) — ama çıktısı aynı `{contentHtml}` şeklinde olduğu için
// `getLegalContent()` değişmeden yeniden kullanılabiliyor.
export const KVK_PROTOCOL_TR_SLUG = 'kvk-protokol';

export function getKvkProtocolContent(locale: Locale): LegalContent | undefined {
  return getLegalContent(KVK_PROTOCOL_TR_SLUG, locale);
}
export function getKvkProtocolSlug(locale: Locale): string | undefined {
  return getLegalSlug(KVK_PROTOCOL_TR_SLUG, locale);
}
export function getKvkProtocolLocaleUrls(): Partial<Record<Locale, string>> {
  return getLegalLocaleUrls(KVK_PROTOCOL_TR_SLUG);
}
export function getKvkProtocolModifiedDate(locale: Locale): Date | undefined {
  return getMiscModifiedDate(KVK_PROTOCOL_TR_SLUG, locale);
}

// Hero/Panel/İletişim formlarındaki KVKK onay metninin 2 linki (HeroForm.tsx)
// için tek yerden hesaplanan URL çifti. NL'in kendi KVKK/Tüketici Hakları
// sayfası yok — bare slug + `getRelativeLocaleUrl` kullanılıyor, bu da
// `astro.config.mjs`'teki elle tanımlı `redirects` girdilerine düşüyor
// (`/nl/kisisel-verilerin-korunmasi` → `/en/data-use-policy`,
// `/nl/sozlesme/tuketici-haklari` → `/en/contract/consumer-rights`).
export function getKvkkAndTermsHrefs(locale: Locale): { kvkkHref: string; termsHref: string } {
  return {
    kvkkHref: getRelativeLocaleUrl(locale, getKvkkSlug(locale) ?? KVKK_TR_SLUG),
    termsHref: getRelativeLocaleUrl(locale, getLegalSlug(CONSUMER_RIGHTS_TR_SLUG, locale) ?? CONSUMER_RIGHTS_TR_SLUG),
  };
}

// ============================== Güvenlik ==============================
const SECURITY_TR_SLUG = 'guvenlik';

// Güvenlik sayfasının 1. maddesi (KVKK/GDPR) kaynakta TAM (mutlak) bir
// idenfit.com URL'i taşıyor (ör. `https://idenfit.com/tr/kisisel-verilerin-korunmasi/`)
// — `SecurityPage.astro`'nun `isExternal()` kontrolü bunu YANLIŞLIKLA dış
// link sayıp gerçek idenfit.com'a `target=_blank` ile gönderiyordu (artık
// bizim kendi KVKK sayfamız var, oraya gitmeli). Bu 3 bare slug'ın her
// biri KVKK sayfamızın gerçek per-locale slug'ına karşılık geliyor — hangi
// dilde karşımıza çıkarsa çıksın `getKvkkSlug(locale)`'e yeniden çözülüyor.
const KVKK_SOURCE_BARE_SLUGS = new Set(['kisisel-verilerin-korunmasi', 'data-use-policy', 'protezione-dati-personali']);

function bareSlugFromAbsoluteUrl(url: string): string {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length && ['tr', 'en', 'nl', 'it', 'az'].includes(parts[0])) parts.shift();
    return parts.join('/');
  } catch {
    return url;
  }
}

function resolveSecurityItemUrl(rawUrl: string, locale: Locale): string {
  const bare = bareSlugFromAbsoluteUrl(rawUrl);
  if (KVKK_SOURCE_BARE_SLUGS.has(bare)) return getKvkkSlug(locale) ?? KVKK_TR_SLUG;
  return rawUrl;
}

export function getSecurityItems(locale: Locale): SecurityItem[] {
  const items =
    locale === 'it'
      ? SECURITY_IT_OVERRIDE
      : ((findGroup(SECURITY_TR_SLUG)?.locales[locale]?.content as { items: SecurityItem[] } | undefined)?.items ?? []);
  return items.map((item) => ({ ...item, url: resolveSecurityItemUrl(item.url, locale) }));
}
export function getSecuritySlug(locale: Locale): string | undefined {
  return slugFor(SECURITY_TR_SLUG, locale);
}
export function getSecurityLocaleUrls(): Partial<Record<Locale, string>> {
  return localeUrlsFor(SECURITY_TR_SLUG);
}
export function getSecurityModifiedDate(locale: Locale): Date | undefined {
  return getMiscModifiedDate(SECURITY_TR_SLUG, locale);
}

// Sayfa daha önce `<title>`/meta description için footer'ın kısa menü
// etiketini ("Güvenlik"/"Security"/"Sicurezza") kullanıyordu — bu hem tek
// kelimelik bir meta description üretiyordu (site denetim raporu madde 10)
// hem de EN'de `/en/security-sector-hr-solutions/` sektör sayfasıyla AYNI
// `<title>`'ı paylaşmasına yol açıyordu (madde 12). Sayfanın kendi
// içeriğinden (6 madde: KVKK/GDPR, Bilgi Güvenliği Politikası, Çerez
// Politikası, Veri Sahibi Başvuru Formu, çalışan/iş ortağı aydınlatma
// metinleri) gerçek, ayırt edici bir başlık + açıklama yazıldı. NL yok
// (KVKK ailesiyle aynı — sayfa hiç render edilmiyor, `en`'e fallback
// düşüyor), bu yüzden `nl` anahtarı gerekmiyor.
const SECURITY_META: Record<'tr' | 'en' | 'it', { pageTitle: string; description: string }> = {
  tr: {
    // 2026-08-10: 52→36 karaktere kısaltıldı (title uzunluk denetimi —
    // "idenfit — " ile birlikte 62 karaktere çıkıp 60 sınırını aşıyordu).
    // `buildIdenfitTitle()` bu 36 karakterlik hâli otomatik olarak
    // "İK Yazılımı" ile 50-60 aralığına tamamlıyor — bkz. `SecurityPage.astro`.
    pageTitle: 'Güvenlik ve Veri Koruma Politikaları',
    // 2026-08-10: 169→143 karaktere kısaltıldı (meta description denetimi,
    // hedef aralık 70-160) — anlam DEĞİŞMEDİ, yalnızca "ve aydınlatma
    // metinlerine" ibaresi çıkarıldı (veri sahibi başvuru formu zaten
    // aydınlatma metinlerini de kapsayan bir şemsiye ifade).
    description:
      "idenfit'in KVKK kapsamındaki kişisel veri koruma, bilgi güvenliği ve çerez politikalarına, veri sahibi başvuru formuna buradan ulaşabilirsiniz.",
  },
  en: {
    pageTitle: 'Security & Data Protection Policies',
    description:
      "Access idenfit's GDPR data protection, information security and cookie policies, along with the data subject request form and information notices.",
  },
  it: {
    pageTitle: 'Sicurezza e Protezione dei Dati Personali',
    // 2026-08-10: 173→150 karaktere kısaltıldı (meta description denetimi) —
    // TR'deki AYNI kısaltma mantığı, "alle informative" ibaresi çıkarıldı.
    description:
      'Consulta le politiche di idenfit su protezione dei dati (GDPR), sicurezza delle informazioni e cookie, e il modulo di richiesta del titolare dei dati.',
  },
};
export function getSecurityMeta(locale: Locale): { pageTitle: string; description: string } {
  return SECURITY_META[locale as 'tr' | 'en' | 'it'] ?? SECURITY_META.en;
}

// ================= Hedef Global Marka / Neden İdenfit =================
// Her ikisi de Şema D (ProductBlock uyumlu) — ProductPage.astro doğrudan
// yeniden kullanılıyor (Donanım'da yapıldığı gibi).
function resolveBlock(b: ProductBlock, locale: Locale): ProductBlock {
  return {
    title: cleanRichText(b.title),
    text: cleanRichText(b.text),
    ctaText: b.ctaText,
    ctaUrl: b.ctaUrl ? localizeCtaUrl(b.ctaUrl, locale) : '',
    image: b.image,
  };
}

export const GLOBAL_BRAND_TR_SLUG = 'hedef-global-marka';
export const WHY_IDENFIT_TR_SLUG = 'neden-idenfit';

function getProductLikeContent(
  trSlug: string,
  locale: Locale,
  itHero: ProductBlock,
  itSections: ProductBlock[],
  nlOverride?: { hero: ProductBlock; sections: ProductBlock[] },
  azOverride?: { hero: ProductBlock; sections: ProductBlock[] },
): ProductContent | undefined {
  if (locale === 'it') {
    return {
      hero: resolveBlock(itHero, locale),
      sections: itSections.map((s) => resolveBlock(s, locale)),
      faq: [],
    };
  }
  if (locale === 'nl' && nlOverride) {
    return {
      hero: resolveBlock(nlOverride.hero, locale),
      sections: nlOverride.sections.map((s) => resolveBlock(s, locale)),
      faq: [],
    };
  }
  if (locale === 'az' && azOverride) {
    return {
      hero: resolveBlock(azOverride.hero, locale),
      sections: azOverride.sections.map((s) => resolveBlock(s, locale)),
      faq: [],
    };
  }
  const entry = findGroup(trSlug)?.locales[locale];
  if (!entry) return undefined;
  const raw = entry.content as { hero: ProductBlock; sections: ProductBlock[] };
  return {
    hero: resolveBlock(raw.hero, locale),
    sections: raw.sections.map((s) => resolveBlock(s, locale)),
    faq: [],
  };
}

export function getGlobalBrandContent(locale: Locale): ProductContent | undefined {
  return getProductLikeContent(
    GLOBAL_BRAND_TR_SLUG,
    locale,
    GLOBAL_BRAND_IT_HERO,
    GLOBAL_BRAND_IT_SECTIONS,
    { hero: GLOBAL_BRAND_NL_HERO, sections: GLOBAL_BRAND_NL_SECTIONS },
    { hero: GLOBAL_BRAND_AZ_HERO, sections: GLOBAL_BRAND_AZ_SECTIONS },
  );
}
export function getGlobalBrandSlug(locale: Locale): string | undefined {
  if (locale === 'az') return AZ_SLUGS.globalBrand;
  return slugFor(GLOBAL_BRAND_TR_SLUG, locale);
}
export function getGlobalBrandLocaleUrls(): Partial<Record<Locale, string>> {
  return { ...localeUrlsFor(GLOBAL_BRAND_TR_SLUG), az: getRelativeLocaleUrl('az', AZ_SLUGS.globalBrand) };
}
/** IT/NL/az'de içerik TAMAMEN bizim çevirimiz (`GLOBAL_BRAND_IT_HERO`/
 * `..._IT_SECTIONS`, `GLOBAL_BRAND_NL_HERO`/`..._NL_SECTIONS`,
 * `GLOBAL_BRAND_AZ_HERO`/`..._AZ_SECTIONS`) — ham WP `modified` tarihi o
 * metne karşılık GELMİYOR, bu yüzden üçü için de BİLEREK `undefined`
 * (bkz. `getMiscModifiedDate()` yorumu). */
export function getGlobalBrandModifiedDate(locale: Locale): Date | undefined {
  if (locale === 'it' || locale === 'nl' || locale === 'az') return undefined;
  return getMiscModifiedDate(GLOBAL_BRAND_TR_SLUG, locale);
}
export function getGlobalBrandTitle(locale: Locale): string {
  if (locale === 'it') return GLOBAL_BRAND_IT_HERO.title;
  if (locale === 'nl') return GLOBAL_BRAND_NL_HERO.title;
  if (locale === 'az') return GLOBAL_BRAND_AZ_HERO.title;
  return findGroup(GLOBAL_BRAND_TR_SLUG)?.locales[locale]?.title ?? '';
}

export function getWhyIdenfitContent(locale: Locale): ProductContent | undefined {
  return getProductLikeContent(
    WHY_IDENFIT_TR_SLUG,
    locale,
    WHY_IDENFIT_IT_HERO,
    WHY_IDENFIT_IT_SECTIONS,
    undefined,
    { hero: WHY_IDENFIT_AZ_HERO, sections: WHY_IDENFIT_AZ_SECTIONS },
  );
}
export function getWhyIdenfitSlug(locale: Locale): string | undefined {
  if (locale === 'az') return AZ_SLUGS.whyIdenfit;
  return slugFor(WHY_IDENFIT_TR_SLUG, locale);
}
export function getWhyIdenfitLocaleUrls(): Partial<Record<Locale, string>> {
  return { ...localeUrlsFor(WHY_IDENFIT_TR_SLUG), az: getRelativeLocaleUrl('az', AZ_SLUGS.whyIdenfit) };
}
/** IT/az'de içerik TAMAMEN bizim çevirimiz — bkz. `getGlobalBrandModifiedDate()`'in
 * AYNI yorumu. */
export function getWhyIdenfitModifiedDate(locale: Locale): Date | undefined {
  if (locale === 'it' || locale === 'az') return undefined;
  return getMiscModifiedDate(WHY_IDENFIT_TR_SLUG, locale);
}
export function getWhyIdenfitTitle(locale: Locale): string {
  if (locale === 'it') return WHY_IDENFIT_IT_HERO.title;
  if (locale === 'az') return WHY_IDENFIT_AZ_HERO.title;
  return findGroup(WHY_IDENFIT_TR_SLUG)?.locales[locale]?.title ?? '';
}

// Meta description override (2026-08-10, meta description uzunluk denetimi)
// — `hero.text` 4 dilin hepsinde 70 karakterden kısa (ör. TR "birbirini
// destekleyen, kolay, dinamik & esnek modüller", 54 karakter). Kaynağın
// KENDİ sayfa gövdesindeki gerçek temalardan (4 dilde de tekrarlanan "40
// iyi neden"/"20 yıllık sektör deneyimi"/"1. sınıf hizmet garantisi"
// başlıkları, `dist/*/neden-idenfit veya karşılığı` içeriğinden okunarak)
// türetildi — KOPYA ÇEVİRİ değil, her dil kendi gerçek vurgusuyla ayrı
// yazıldı (NL altyapı/güvenliği öne çıkarıyor, EN hizmet garantisini).
const WHY_IDENFIT_META_DESCRIPTION: Record<Locale, string> = {
  tr: "idenfit'i seçmek için 40'tan fazla neden var: 20 yıllık sektör deneyimi, esnek modüller ve 1. sınıf hizmet garantisiyle işletmenizi büyütün.",
  en: 'Discover 40 reasons to choose idenfit: 20 years of industry experience, flexible modules and a first-class service guarantee.',
  nl: 'Ontdek 40 redenen om voor idenfit te kiezen: 20 jaar sectorervaring, flexibele modules en een sterke, veilige infrastructuur.',
  it: 'Scopri 40 motivi per scegliere idenfit: 20 anni di esperienza nel settore, moduli flessibili e un servizio di prima classe.',
  az: "idenfit'i seçmək üçün 40-dan çox səbəb var: 20 illik sektor təcrübəsi, çevik modullar və birinci dərəcəli xidmət təminatı ilə müəssisənizi böyüdün.",
};
export function getWhyIdenfitMetaDescription(locale: Locale): string {
  return WHY_IDENFIT_META_DESCRIPTION[locale];
}

// ============================== Hakkımızda ==============================
// Aynı Şema D (ProductBlock uyumlu) — ProductPage.astro yeniden kullanılıyor.
// EN'in "Our story" bölümünde tarihçe paragrafı eksikti (KARAR 1 →
// `ABOUT_EN_SECTIONS`), IT'nin TÜMÜ (hero dahil) EN'in ham kopyasıydı
// (KARAR 1 → `ABOUT_IT_HERO`/`ABOUT_IT_SECTIONS`). TR/NL zaten gerçek,
// dokunulmadı.
export const ABOUT_TR_SLUG = 'hakkimizda';

export function getAboutContent(locale: Locale): ProductContent | undefined {
  if (locale === 'it') {
    return {
      hero: resolveBlock(ABOUT_IT_HERO, locale),
      sections: ABOUT_IT_SECTIONS.map((s) => resolveBlock(s, locale)),
      faq: [],
    };
  }
  if (locale === 'az') {
    return {
      hero: resolveBlock(ABOUT_AZ_HERO, locale),
      sections: ABOUT_AZ_SECTIONS.map((s) => resolveBlock(s, locale)),
      faq: [],
    };
  }
  const entry = findGroup(ABOUT_TR_SLUG)?.locales[locale];
  if (!entry) return undefined;
  const raw = entry.content as { hero: ProductBlock; sections: ProductBlock[] };
  const sections = locale === 'en' ? ABOUT_EN_SECTIONS : raw.sections;
  return {
    hero: resolveBlock(raw.hero, locale),
    // TR/NL'nin ham `sections[1].image`'ı (misc-pages.json'daki eski
    // snapshot) kaynak site 2026-05'te güncellediği için artık YANLIŞ —
    // `ABOUT_TEAM_PHOTO_IMAGE` ile ezilir (bkz. o sabitin yorumu,
    // miscPagesTranslationOverrides.ts). EN/IT zaten kendi override
    // dizilerinde aynı sabiti kullanıyor.
    sections: sections.map((s, i) =>
      resolveBlock(i === 1 && s.image ? { ...s, image: ABOUT_TEAM_PHOTO_IMAGE } : s, locale),
    ),
    faq: [],
  };
}
export function getAboutSlug(locale: Locale): string | undefined {
  if (locale === 'az') return AZ_SLUGS.about;
  return slugFor(ABOUT_TR_SLUG, locale);
}
export function getAboutLocaleUrls(): Partial<Record<Locale, string>> {
  return { ...localeUrlsFor(ABOUT_TR_SLUG), az: getRelativeLocaleUrl('az', AZ_SLUGS.about) };
}
/** IT/az'de içerik TAMAMEN bizim çevirimiz (`ABOUT_IT_HERO`/`..._IT_SECTIONS`,
 * `ABOUT_AZ_HERO`/`..._AZ_SECTIONS`) — bkz. `getGlobalBrandModifiedDate()`'in
 * AYNI yorumu. TR/EN ham WP içeriği kullanıyor (EN'in `ABOUT_EN_SECTIONS`
 * KISMİ override'ı sayfanın geri kalanını değiştirmiyor, ham tarih hâlâ
 * makul). */
export function getAboutModifiedDate(locale: Locale): Date | undefined {
  if (locale === 'it' || locale === 'az') return undefined;
  return getMiscModifiedDate(ABOUT_TR_SLUG, locale);
}
export function getAboutTitle(locale: Locale): string {
  // IT'nin ham WP başlığı ("About_IT") anlamsız bir kalıntı — gerçek
  // İtalyanca başlıkla değiştirildi. TR/EN/NL'nin gerçek başlıkları
  // (Hakkımızda/About/Over) zaten kısa ve doğru, dokunulmadı.
  if (locale === 'it') return 'Chi Siamo';
  if (locale === 'az') return 'Haqqımızda';
  return findGroup(ABOUT_TR_SLUG)?.locales[locale]?.title ?? '';
}

// ========================= Online Sunum Talebi =========================
// Kaynaktaki gerçek slug 3 dilde birbirinden TAMAMEN FARKLI (`online-sunum-talep-et`/
// `request-online-presentation`/`richiedi-presentazione-online`) — ama
// proje GENELİNDE (bkz. `productContent.ts`'in `localizeCtaUrl()`'ü,
// `sectorContent.ts`, `hardwareTranslationOverrides.ts` vb. — ONLARCA
// mevcut CTA çağrı noktası) bu sayfaya giden her CTA zaten TEK bir
// canonical slug'a (`online-sunum-talep-et`) çözülecek şekilde kurulmuştu.
// **Bulunan gerçek bug:** bu slug'a hiçbir zaman karşılık gelen bir SAYFA
// kurulmamıştı — `online-sunum-talep-et` her yerde referans alınıyordu ama
// `src/pages/`'de hiç dosyası yoktu (Header'ın kırmızı CTA butonu dahil,
// tüm sitedeki "Online Sunum Talebi" butonları 404 veriyordu). Bu artık
// düzeltiliyor — mevcut onlarca çağrı noktasını değiştirmek yerine, route
// da bu yerleşik canonical slug'ı kullanıyor (4 dilde AYNI — sektör/ürün
// sayfalarındaki "per-locale farklı slug" deseninin bilinçli bir
// istisnası). NL'in kaynakta sayfası hiç yok (id 22735 export'ta
// bulunamadı, muhtemelen taslak/yayımlanmamış) — ama bare slug her
// locale'de aynı olduğu için Astro'nun otomatik `i18n.fallback`'i (nl→en)
// manuel bir `redirects` girdisi gerekmeden doğru çalışıyor (KARAR 2 —
// kaynakta olmayan dil için yeni sayfa üretilmedi).
export const PRESENTATION_CANONICAL_SLUG = 'online-sunum-talep-et';
// Yalnızca `misc-pages.json`'daki gruba erişmek için — GERÇEK route slug'ı
// DEĞİL (bkz. yukarıdaki not).
const PRESENTATION_TR_SLUG = 'online-sunum-talep-et';

export function getPresentationContent(locale: Locale): PresentationContent | undefined {
  if (locale === 'it') return PRESENTATION_IT_OVERRIDE;
  // Kaynakta NL versiyonu hiç yok (canlı `idenfit.com/nl/`'in kendi CTA'sı
  // bile EN'e gidiyor, bkz. `PRESENTATION_NL_OVERRIDE` yorumu) — kullanıcının
  // açık talimatıyla gerçek bir NL sayfası eklendi.
  if (locale === 'nl') return PRESENTATION_NL_OVERRIDE;
  // az'de de kaynakta hiç sayfa yok — NL/IT ile AYNI ilke, TR kaynaktan
  // gerçek profesyonel çeviri (KARAR 1, 2026-08-21).
  if (locale === 'az') return PRESENTATION_AZ_OVERRIDE;
  const entry = findGroup(PRESENTATION_TR_SLUG)?.locales[locale];
  const content = entry?.content as PresentationContent | undefined;
  // EN'in kaynakta boş olan callText/phoneNumber/phoneNumberLink'i + 3
  // gramer hatalı alanı (bkz. `PRESENTATION_EN_OVERRIDE` yorumu,
  // miscPagesTranslationOverrides.ts) düzeltiyor.
  if (content && locale === 'en') return { ...content, ...PRESENTATION_EN_OVERRIDE };
  return content;
}

/** IT/NL'de içerik TAMAMEN bizim elle yazdığımız override (`PRESENTATION_IT_OVERRIDE`/
 * `PRESENTATION_NL_OVERRIDE`) — ham WP `modified` tarihi o metne karşılık
 * GELMİYOR, bu locale'ler için BİLEREK `undefined` (bkz.
 * `getGlobalBrandModifiedDate()`'in AYNI ilkesi). TR/EN ham içerik
 * kullanıyor (EN'in `PRESENTATION_EN_OVERRIDE` KISMİ düzeltmesi sayfanın
 * geri kalanını değiştirmiyor). */
export function getPresentationModifiedDate(locale: Locale): Date | undefined {
  if (locale === 'it' || locale === 'nl' || locale === 'az') return undefined;
  return getMiscModifiedDate(PRESENTATION_TR_SLUG, locale);
}

// Meta description override (2026-08-10, meta description uzunluk denetimi)
// — `PresentationRequestPage.astro` `content.pageTitle`'ı hem H1 hem meta
// description olarak kullanıyor; TR/IT'nin `pageTitle`'ı zaten 70+ karakter
// ama NL (56) ve EN (24, "Get started with Idenfit") kısa kaldı.
// `pageTitle`'IN KENDİSİ değiştirilmedi (H1 için hâlâ doğru/onaylı) — bu
// yalnızca META ETİKETİ için sayfanın kendi gerçek madde metinlerinden
// (48 saatte kurulum/onboarding/veri güvenliği için NL, ücretsiz
// güncellemeler/kullanıma göre ödeme için EN — ikisi FARKLI gerçek
// vurgular taşıyor, kopya çeviri değil) türetilen ayrı bir alan.
const PRESENTATION_META_DESCRIPTION: Partial<Record<Locale, string>> = {
  nl: 'Ervaar snelheid en efficiëntie in HR-beheer met idenfit — binnen 48 uur klaar, met moeiteloze onboarding en veilige gegevensmigratie.',
  en: 'Get started with idenfit — no credit card needed, pay only for the employees you need, with free updates included.',
};
export function getPresentationMetaDescription(locale: Locale): string | undefined {
  return PRESENTATION_META_DESCRIPTION[locale];
}
