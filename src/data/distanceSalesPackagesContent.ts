// Mesafeli Satış Sözleşmesi'nin PAKET BAZLI varyantları (Mikro + KOBİ,
// TR ve EN) — 2026-09-28, Açık nokta #6.
//
// KÖK OLAY: bu 4 sayfa eski WordPress sitesinde gerçekten yayındaydı
// (`v81yvf_posts`, id 20193/20206/20212/20223) ama migrasyona hiç
// girmemişti — `/mesafeli-satis-sozlesmesi-kobi/` ve kardeşleri canlıda
// 404 veriyor, Google Search Console'un 225 "Bulunamadı" kaydının dördü
// bunlar. Genel Mesafeli Satış Sözleşmesi'ne 301 YÖNLENDİRİLEMEZLER:
// içerikleri gerçekten farklı (Mikro 10 madde, KOBİ 11 — fazladan olan
// "Madde 5 — Lisans ve Hizmet Bedelleri ve Ödeme Koşulları"; ayrıca
// kullanıcı sayısı 25 vs 50, Mikro'da implementasyon/ödeme hükümleri hiç
// yok). Pakete özel hukuki metinler, birbirinin yerine geçemez.
//
// NEDEN `miscPagesContent.ts` DEĞİL: oradaki `getLegalContent()` içeriği
// `reference/wordpress-export/misc-pages.json`'dan okuyor, bu 4 sayfa o
// export'ta HİÇ YOK (orijinal export yalnızca `page` post type'ını çekmiş).
// Ham export'u geriye dönük değiştirmek yerine (mevcut 14 hukuki sayfanın
// veri kaynağına dokunmak) içerik AYRI bir JSON'a
// (`distanceSalesPackages.json`) alındı ve `LegalPage.astro`'ya doğrudan
// besleniyor — mevcut hiçbir dosya değişmiyor, mevcut hiçbir sayfa
// etkilenmiyor.
//
// İÇERİĞE UYGULANAN DÖNÜŞÜMLER (hukuki metne DOKUNULMADI — madde
// numaraları, cümleler, terimler, tablo içerikleri birebir; yazım hataları
// bile korundu, ör. KOBİ Madde 5.3'teki `MUŞ̈TERİ` ve Madde 3.10'daki
// `Kullanıcılar’ Yazılım’ın`):
//   1. Ham `post_content`'in dış `<section>` sarmalayıcısı kaldırıldı
//      (`LegalPage.astro` kendi `<section>`'ını zaten sarıyor).
//   2. Sarmalayıcının içinde ÇIPLAK METİN olarak duran belge başlığı
//      (`IDENFIT TIMEWARE LİSANS SÖZLEŞMESİ` / `... SOFTWARE LICENSE
//      AGREEMENT`) `documentHeading` alanına ayrıldı ve gövdenin başında
//      `<h2>` olarak render ediliyor (aşağıdaki H1/H2 notuna bkz.).
//   3. `http://www.idenfit.com[/]` → `https://idenfit.com/` (yalnızca
//      `href` değerlerinde geçiyordu; görünür metin `www.idenfit.com`
//      şemasız olduğu için bu desene uymuyor ve DEĞİŞTİRİLMEDİ).
//   4. Kişisel veri aydınlatma metni linkleri gerçek yollara çevrildi —
//      hem `href` hem GÖRÜNÜR METİN (kullanıcı onayı, 2026-09-28; görünür
//      metin URL'in kendisi olduğu için yalnızca href'i düzeltmek ekranda
//      yanlış adres bırakırdı):
//        TR: `idenfit.com/tr/kisisel-verilerin-korunmasi` (yanlış `/tr/`
//            öneki — TR varsayılan dil, prefix'siz)
//            → `https://idenfit.com/kisisel-verilerin-korunmasi/`
//        EN: `idenfit.com/data-use-policy` (eksik `/en/` öneki)
//            → `https://idenfit.com/en/data-use-policy/`
//      Her iki hedef de gerçek sayfa olarak doğrulandı
//      (`src/pages/kisisel-verilerin-korunmasi.astro`,
//      `src/pages/en/data-use-policy.astro`).
//   `style="color: #3498db"` nitelikleri BURADA silinmedi — runtime'da
//   paylaşılan `cleanRichText()` siliyor, yani diğer 14 hukuki sayfayla
//   BİREBİR aynı yol (linkler sitenin kendi `[&_a]:text-brand` temasını
//   kullanıyor).
//
// H1/H2 KARARI (kullanıcı onayı, 2026-09-28 — "Seçenek 2"): `LegalPage.astro`
// `<h1>`'i `content.title`'dan basıyor, bu yüzden belgenin ALL-CAPS başlığını
// da `<h1>` yapmak sayfada İKİ `<h1>` bırakırdı (`check-heading-hierarchy`
// ihlali). Mevcut 14 hukuki sayfanın deseni izlendi: `title` = kısa/ayırt
// edici SAYFA adı (ör. genel sözleşmede "Mesafeli Satış Sözleşmesi"),
// belgenin kendi başlığı gövdenin içinde tekrar ediyor. Buradaki `title`
// değerleri UYDURULMADI — WP veritabanındaki gerçek `post_title` alanları
// (kullanıcı tarafından sağlandı). Sonuç hiyerarşi: H1(sayfa adı) →
// H2(belge başlığı) → H2(Madde 1) … — seviye atlaması yok, mikro/KOBİ
// çiftinin `<title>`/`<h1>`/breadcrumb'ı benzersiz.
//
// `fixLinkAccessibility()` BİLİNÇLİ OLARAK UYGULANMADI (`getLegalContent()`
// uyguluyor): bu içerikteki TÜM linklerin görünür metni ya bir URL ya bir
// e-posta adresi, yani hiçbiri "erişilebilir adı yok"/jenerik sınıfına
// girmiyor — fonksiyon semantik olarak no-op kalırdı ama HTML'i parse5 ile
// YENİDEN SERİLEŞTİRİRDİ. Hukuki bir belgenin işaretlemesini gereksiz bir
// normalizasyondan geçirmemek için atlandı; `check-link-accessibility.mjs`
// 4 sayfada da 0 bulgu vererek bunu ampirik olarak doğruluyor.
import { getRelativeLocaleUrl } from 'astro:i18n';
import packagesExport from './distanceSalesPackages.json';
import { cleanRichText } from './productContent';
import type { LegalContent } from './miscPagesContent';
import { LOCALES, type Locale } from './nav';

interface RawPackageLocale {
  id: number;
  slug: string;
  title: string;
  modified: string;
  documentHeading: string;
  contentHtml: string;
}
interface RawPackageGroup {
  trSlug: string;
  locales: Partial<Record<Locale, RawPackageLocale>>;
}

const DATA = packagesExport as { packages: RawPackageGroup[] };

export const DISTANCE_SALES_MICRO_TR_SLUG = 'sozlesme/mesafeli-satis-sozlesmesi-mikro';
export const DISTANCE_SALES_SME_TR_SLUG = 'sozlesme/mesafeli-satis-sozlesmesi-kobi';

/** Bu 4 sayfanın GERÇEK içeriği olan diller — `LegalPage.astro`'nun
 * `hreflangLocales` prop'una geçirilir. IT/NL/AZ'de bu paket sözleşmeleri
 * kaynakta HİÇ YAYINLANMAMIŞ (yalnızca genel sözleşmenin IT karşılığı var),
 * bu yüzden onlar için hreflang üretilmemeli — `localeUrls`'in ham
 * anahtarlarını kullanmak YANLIŞ sinyal olurdu (bkz. `BaseLayout.astro`'nun
 * `hreflangLocales` yorumu: dil değiştirici eksik dilleri EN/TR'ye
 * "alias"lıyor). */
export const DISTANCE_SALES_PACKAGE_HREFLANG_LOCALES: Locale[] = ['tr', 'en'];

function findGroup(trSlug: string): RawPackageGroup | undefined {
  return DATA.packages.find((g) => g.trSlug === trSlug);
}

export function getDistanceSalesPackageContent(trSlug: string, locale: Locale): LegalContent | undefined {
  const entry = findGroup(trSlug)?.locales[locale];
  if (!entry) return undefined;
  // Belge başlığı gövdenin ilk `<h2>`'si olarak basılıyor (bkz. dosya başı
  // H1/H2 kararı). `cleanRichText()` yalnızca `class`/`style` niteliklerini
  // siler — metne dokunmaz.
  const contentHtml = `<h2>${entry.documentHeading}</h2>\n${cleanRichText(entry.contentHtml)}`;
  return { title: entry.title, contentHtml };
}

/** Dil değiştirici URL'leri. `miscPagesContent.ts`'in `localeUrlsFor()`
 * fonksiyonuyla AYNI fallback disiplini (bkz. oradaki 2026-07-22/2026-09-02/
 * 2026-09-07 bug yorumları): gerçek sayfası OLMAYAN her dil açıkça
 * doldurulur, aksi halde `Header.astro`'nun generic "aktif path'in bare
 * slug'ı + dil öneki" hesaplaması sızıp GERÇEK 404 üretir (ör. EN
 * sayfasından IT'ye geçerken `/it/contract/customer-sales-agreement-micro/`). */
export function getDistanceSalesPackageLocaleUrls(trSlug: string): Partial<Record<Locale, string>> {
  const group = findGroup(trSlug);
  if (!group) return {};
  const result: Partial<Record<Locale, string>> = {};
  for (const [locale, entry] of Object.entries(group.locales) as [Locale, RawPackageLocale][]) {
    result[locale] = getRelativeLocaleUrl(locale, entry.slug);
  }
  // NL kaynakta hiç yok → EN'in gerçek URL'i (genel hukuki aile ile aynı ilke).
  if (!result.nl && result.en) result.nl = result.en;
  // AZ kapsam dışı (Açık nokta #37) → bare TR URL'i, gereksiz redirect adımı yok.
  if (!result.az) result.az = result.tr;
  // Kalan her dil (IT) → EN, yoksa TR.
  for (const locale of LOCALES) if (!result[locale]) result[locale] = result.en ?? result.tr;
  return result;
}

/** WP `post_modified` (kullanıcı tarafından veritabanından sağlandı,
 * 2026-09-28). Tarihler AÇIK `+03:00` ofsetiyle saklanıyor — CLAUDE.md'nin
 * "naive tarih" gotcha'sı gereği (saat dilimsiz bir string'i `new Date()`
 * ÇALIŞTIĞI MAKİNENİN saat dilimine göre yorumlar, yani yerel build ile
 * Cloudflare'ın UTC build ortamı 3 saat FARKLI değer üretirdi).
 *
 * Dürüst sınır: elimizde `post_modified` (WP'nin site-yerel saati) var,
 * `post_modified_gmt` YOK — ofset, sitenin Türkiye yerelinde çalıştığı
 * varsayımına dayanıyor. Görünen etkisi yalnızca "Son güncelleme" tarih
 * damgası; yanlışsa en fazla 3 saatlik bir kayma olur, GÜN değişmez
 * (en erken damga 08:24, ofset hatası günü kaydırmaz). */
export function getDistanceSalesPackageModifiedDate(trSlug: string, locale: Locale): Date | undefined {
  const raw = findGroup(trSlug)?.locales[locale]?.modified;
  return raw ? new Date(raw) : undefined;
}

/** Meta description'lar (70-160 karakter, `check-meta-description-length.mjs`).
 * `LegalPage.astro`'nun varsayılanı (içeriğin ilk 160 karakteri) bu sayfalarda
 * KULLANILAMAZ — belge "Madde 1 - Taraflar / İşbu İdenfit Timeware Lisans
 * Sözleşmesi…" ile başlıyor, yani çıkan metin bir özet değil ham şirket
 * ünvanı olurdu (bkz. `LegalPage.astro`'daki kök neden yorumu). Her açıklama
 * sayfanın KENDİ gerçek hükümlerinden türetildi (kullanıcı sayısı, yenileme
 * periyodu, madde konuları) — uydurma iddia yok, dört tanesi de benzersiz. */
const META_DESCRIPTIONS: Record<string, Partial<Record<Locale, string>>> = {
  [DISTANCE_SALES_MICRO_TR_SLUG]: {
    tr: 'idenfit Timeware Mikro paket lisans sözleşmesi: 25 kullanıcıya kadar kullanım hakkı, süre ve fesih, fikri mülkiyet ve kişisel verilerin korunması koşulları.',
    en: 'idenfit Timeware Micro package license agreement: right of use for up to 25 users, term and termination, intellectual property and personal data terms.',
  },
  [DISTANCE_SALES_SME_TR_SLUG]: {
    tr: 'idenfit Timeware KOBİ paket lisans sözleşmesi: 50 kullanıcı, aylık yenileme, lisans ve hizmet bedelleri, ödeme koşulları ve implementasyon hizmetleri.',
    en: 'idenfit Timeware SME package license agreement: 50 users, monthly renewal, license and service fees, payment terms and online implementation services.',
  },
};

export function getDistanceSalesPackageMetaDescription(trSlug: string, locale: Locale): string | undefined {
  return META_DESCRIPTIONS[trSlug]?.[locale];
}
