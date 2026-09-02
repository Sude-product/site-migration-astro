// SSS sayfasının içeriğini tipli bir forma sokan veri katmanı. Kaynak:
// `reference/wordpress-export/faq.json` (`scripts/fetch-faq.mjs` ile
// `faq` custom post type'ından çekildi — bkz. KARAR 2, CLAUDE.md).
//
// idenfit.com'un canlı `/sss/` sayfası bu CPT'den besleniyor (kendi ACF
// `question_N`/`answer_N` alanları boş/kullanılmıyor) — bu yüzden
// `pages.json`'daki `sss`/`faq`/`faq-3` sayfalarının ACF'i DEĞİL, bu CPT
// asıl gerçek kaynak. NL hiç yok (CPT'de NL girdisi yok).
import { getRelativeLocaleUrl } from 'astro:i18n';
import faqExport from '../../reference/wordpress-export/faq.json';
import type { Locale } from './nav';

type FaqLocale = 'tr' | 'en' | 'it';
const FAQ_LOCALES: readonly FaqLocale[] = ['tr', 'en', 'it'];

interface FaqCategoryRaw {
  id: number;
  slug: string;
  name: string;
  count: number;
}
interface FaqItemRaw {
  id: number;
  slug: string;
  link: string;
  question: string;
  answer: string;
  categoryId: number | null;
  categorySlug: string | null;
}
interface FaqExportRaw {
  localeSlugs: Record<FaqLocale, string>;
  categories: Record<FaqLocale, FaqCategoryRaw[]>;
  faq: Record<FaqLocale, FaqItemRaw[]>;
}

const DATA = faqExport as unknown as FaqExportRaw;

export interface FaqItem {
  question: string;
  answer: string;
}
export interface FaqCategory {
  name: string;
  items: FaqItem[];
}

// BULUNAN BUG (2026-07-22): önceki hali yalnızca `&amp;` çözüyordu.
// `question` alanı (`<h3>{item.question}</h3>` ile DÜZ METİN olarak,
// `set:html` DEĞİL render ediliyor — bkz. FaqPage.astro) bazı sorularda
// numerik HTML entity'leri (`&#8217;` = sağ tek tırnak/kesme işareti)
// içeriyor (TR 1, IT 4 soru — ör. "Cos'è Idenfit?" tam olarak
// "Cos&#8217;è Idenfit?" olarak duruyordu, tarayıcıda HAM METİN görünüyordu).
// `answer` `set:html` ile render edildiği için tarayıcı entity'leri zaten
// doğru çözüyordu (bu yüzden yalnızca soru başlıklarında fark edilmişti) —
// ama tutarlılık için `answer`/kategori adları da aynı fonksiyondan geçiyor.
// Yaygın named + numerik (decimal/hex) entity'lerin TAMAMINI çözen genel
// bir decoder — yalnızca `&amp;` gibi tek bir vakayı listelemek yerine.
function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function isFaqLocale(locale: Locale): locale is FaqLocale {
  return (FAQ_LOCALES as readonly string[]).includes(locale);
}

/** SSS'nin gerçek per-locale slug'ı (`sss`/`faq`/`faq`, `pages.json`'daki
 * `sss`/`faq`/`faq-3` sayfalarının GERÇEK `link` alanından — WP `slug`
 * alanı değil, ör. IT'nin ham slug'ı yanıltıcı şekilde `faq-3`). NL için
 * `undefined` — çağıran taraf (`navigation.ts`/`footer.ts`) EN'e düşürür
 * (KARAR 1'deki NL fallback mekanizmasıyla aynı ilke). */
export function getFaqSlug(locale: Locale): string | undefined {
  return isFaqLocale(locale) ? DATA.localeSlugs[locale] : undefined;
}

// "PDF İNDİR" butonu — canlı sitede TR kendi PDF'i (`sss-1.pdf`), EN/IT
// AYNI PDF'i (`faq.pdf`) paylaşıyor (IT kendi PDF'i yok, gerçek kaynak
// hatası değil — muhtemelen bilinçli, tek İngilizce PDF ile idare
// ediliyor). Her ikisi de curl ile 200 doğrulandı.
const FAQ_PDF_URLS: Record<FaqLocale, string> = {
  tr: '/wp-content/uploads/2025/08/sss-1.pdf',
  en: '/wp-content/uploads/2025/08/faq.pdf',
  it: '/wp-content/uploads/2025/08/faq.pdf',
};

export function getFaqPdfUrl(locale: Locale): string | undefined {
  return isFaqLocale(locale) ? FAQ_PDF_URLS[locale] : FAQ_PDF_URLS.en;
}

export function getFaqLocaleUrls(): Partial<Record<Locale, string>> {
  const result: Partial<Record<Locale, string>> = {};
  for (const locale of FAQ_LOCALES) {
    result[locale] = getRelativeLocaleUrl(locale, DATA.localeSlugs[locale]);
  }
  // NL'nin kendi gerçek slug'ı yok — TR'nin bare slug'ı (`sss`) EN/IT'ninkinden
  // (`faq`) FARKLI olduğu için Header.astro'nun generic "aynı slug + prefix"
  // hesaplaması burada YANLIŞ bir URL üretir (`/nl/sss/`) ve bu, Astro'nun
  // otomatik i18n.fallback'inin (nl→en, aynı bare path varsayımıyla) var
  // olmayan `/en/sss/`'e yönlenip 404 vermesine yol açar (bkz. CLAUDE.md'deki
  // Tüketici Hakları/Mesafeli Satış/Güvenlik'teki aynı sınıf bug). Burada da
  // aynı düzeltme: NL için EN'in gerçek URL'i doğrudan kullanılıyor (kaynakta
  // NL sayfası yok, ziyaretçi zaten EN içeriğe düşecek — bu artık dil
  // değiştiriciden de görünür/doğru şekilde gerçekleşiyor, kırık ara adım yok).
  result.nl = result.en;
  // AYNI bug sınıfı, az için (2026-09-02, kullanıcı bulgusu — bkz.
  // `supportRequestContent.ts`'teki eşdeğer düzeltmenin yorumu). SSS
  // az'de KAPSAM DIŞI (Açık nokta #37) — `result.tr` (bare TR URL'i,
  // `sss`) doğrudan kullanılıyor.
  if (!result.az) result.az = result.tr;
  return result;
}

/** Kategori başına gruplanmış SSS listesi — kategori sırası kaynaktaki
 * gerçek görünüm sırasıyla aynı (bkz. `fetch-faq.mjs`'teki not, term id
 * artan sırası = gerçek sayfa sırası). Boş kategori (hiç sorusu olmayan)
 * çıkmaz — bu 30/30/30 veri setinde hiç olmuyor ama savunmacı. */
export function getFaqCategories(locale: Locale): FaqCategory[] {
  if (!isFaqLocale(locale)) return [];
  const categories = DATA.categories[locale] ?? [];
  const items = DATA.faq[locale] ?? [];
  return categories
    .map((c) => ({
      name: decodeEntities(c.name),
      items: items
        .filter((i) => i.categoryId === c.id)
        .map((i) => ({ question: decodeEntities(i.question), answer: decodeEntities(i.answer) })),
    }))
    .filter((c) => c.items.length > 0);
}

// Ana sayfa SSS (FAQ) bölümü (2026-08-12) — bkz. `HomeFaqSection.astro`.
// Kullanıcı talimatıyla 90 sorudan (`/sss/`'de zaten var) en genel/
// başlangıç-seviyesi 7 soru elle seçildi ("idenfit nedir", fiyatlandırma,
// kurulum, sözleşme, güvenlik gibi — çok teknik/destek-spesifik sorular
// DEĞİL, ör. "Bu Cihaz Size Ait Değildir Uyarısı" gibi maddeler bilinçli
// olarak dışarıda bırakıldı).
//
// **ÖNEMLİ BULGU:** kategori SAYISI/SIRASI 3 dilde aynı olsa da (bkz.
// `getFaqCategories()`'in kendi yorumu) bir kategori İÇİNDEKİ soru SIRASI
// dilden dile FARKLI (ör. IT'de "Quanto costa Idenfit?" TR/EN'in aksine
// "Genel" kategorisinin hemen içine, id sırasına göre değil farklı bir
// menu_order'a göre serpiştirilmiş) — düz `DATA.faq[locale][i]` indeksi
// dilller arasında AYNI SORUYU işaret ETMİYOR. Bu yüzden aşağıdaki
// index'ler TEK TEK elle, her dilin kendi 30 sorusu okunup GERÇEK aynı
// soru bulunarak doğrulandı (bazı index'ler [0,11,12,14,23] 3 dilde de
// aynı çıktı, bazıları [4/4/5, 7/6/6] dilden dile kaydı).
const HOME_FAQ_INDICES: Record<FaqLocale, number[]> = {
  tr: [0, 4, 7, 11, 12, 14, 23],
  en: [0, 4, 6, 11, 12, 14, 23],
  it: [0, 5, 6, 11, 12, 14, 23],
};

// az (2026-08-21, kullanıcı bulgusu — "azerice seçince ingilizce geliyor"):
// az, 90 sorunun TAMAMININ çevrildiği bir `FaqLocale` DEĞİL (`/sss/`
// sayfasının kendisi hâlâ bilinçli olarak kapsam dışı, TR/EN/IT dışındaki
// diller EN'e düşer) — ama ana sayfa yalnızca bu 7 seçilmiş soruyu
// gösteriyor, bunları elle çevirmek 90 sorunun tamamını çevirmekten çok
// daha küçük bir iş. TR'nin `HOME_FAQ_INDICES.tr` sırasındaki AYNI 7 soru,
// TR kaynaktan profesyonel Azerice çeviri (`i18n/az.ts`'teki AYNI çeviri
// ilkesi, kopya/otomatik çeviri değil).
const HOME_FAQ_AZ: FaqItem[] = [
  {
    question: 'idenfit nədir?',
    answer:
      '<p>idenfit, insan resursları idarəçiliyinə bütöv bir yanaşma gətirən bulud əsaslı, istifadəçi dostu insan resursları və işçi qüvvəsi proqram təminatıdır. İnsan resursları departamentlərinin vaxta qənaət etməsini təmin edərək, dəyər yaradan işlərin ortaya çıxmasına zəmin hazırlayır. Bütün insan resursları proseslərini idenfit ilə başdan-sona tək bir platforma altında idarə edə bilərsiniz.</p>',
  },
  {
    question: 'idenfit İK proseslərindəki manual işləri azaldıb, işlərin rəqəmsal aparılmasına imkan verirmi?',
    answer:
      '<p>idenfit bütün insan resursları proseslərini bulud saxlanması, biometrik imza, onlayn sənədləşdirmə kimi funksiyalarla rəqəmsallaşdıraraq, İK departamentlərini lazımsız kağız işlərindən və manual iş yükündən qurtarır.</p>',
  },
  {
    question: 'Modul qiymətləndirilməsi necə tətbiq olunur?',
    answer:
      '<p>İstifadə etdiyiniz modullar ayrı-ayrılıqda qiymətləndirilir, birdən çox modul istifadə etdiyiniz halda müəssisənizə xüsusi endirimlər tətbiq olunur.</p>',
  },
  {
    question: 'İdenfit’i hansı müəssisələr istifadə edə bilər? Kiçik ölçülü şirkətlər üçün uyğundurmu?',
    answer:
      '<p>idenfit parametrik və dinamik strukturu ilə kiçik ölçülü müəssisələrdən böyük ölçülü müəssisələrə qədər xidmət göstərə bilər. Əməkdaş sayına uyğun həllər mövcuddur.</p>',
  },
  {
    question: 'Müqavilə müddəti minimum neçə ay olaraq planlaşdırılır?',
    answer: '<p>Müqavilə müddəti minimum 12 ay olaraq planlaşdırılır.</p>',
  },
  {
    question: 'Quraşdırma prosesi necədir? Yerində quraşdırma tələb olunurmu?',
    answer:
      '<p>Adınıza açılan hesabla idenfit İK proqram təminatından dərhal istifadə etməyə başlaya bilərsiniz. Biometrik cihaz quraşdırılması istisna olmaqla, yerində quraşdırma tələb edən bir mərhələ yoxdur.</p>',
  },
  {
    question: 'idenfit şəxsi məlumatların qorunması qanunvericiliyinə uyğun bir proqram təminatıdırmı?',
    answer:
      '<p>idenfit şəxsi məlumatların qorunması qaydalarına uyğun fəaliyyət göstərir. Ətraflı məlumat üçün müvafiq səhifəmizi ziyarət edə bilərsiniz.</p>',
  },
];

/** Ana sayfa SSS bölümü için 7 seçilmiş soru — NL için kendi verisi
 * olmadığından (bkz. dosya başındaki yorum) EN'in AYNI 7 sorusuna düşer
 * (`getFaqLocaleUrls()`/`getFaqSlug()` ile AYNI NL→EN ilkesi). az için ise
 * gerçek çeviri var (yukarıdaki `HOME_FAQ_AZ`) — `/sss/` sayfasının
 * tamamından FARKLI olarak burada EN fallback YOK. */
export function getHomeFaqItems(locale: Locale): FaqItem[] {
  if (locale === 'az') return HOME_FAQ_AZ;
  const effectiveLocale: FaqLocale = isFaqLocale(locale) ? locale : 'en';
  const indices = HOME_FAQ_INDICES[effectiveLocale];
  const items = DATA.faq[effectiveLocale] ?? [];
  return indices
    .map((i) => items[i])
    .filter((i): i is FaqItemRaw => Boolean(i))
    .map((i) => ({ question: decodeEntities(i.question), answer: decodeEntities(i.answer) }));
}
