// Ürün/modül sayfalarının (Bordro, PDKS, İzin vb.) 4 dildeki ACF içeriğini
// YEREL `pages.json`'dan (network fetch YOK — CLAUDE.md'nin doğruladığı gibi
// bu içerik zaten `page` post type'ında, export'ta eksik değil, bkz.
// "Ürün/modül sayfaları için CPT kontrolü") çıkarıp
// `reference/wordpress-export/products.json`'a normalize eder.
//
// ÖNEMLİ: PDKS pilotundan sonra keşfedildi — modül sayfaları TEK bir ACF
// şeması KULLANMIYOR. En az 3 farklı düzen var (bkz. CLAUDE.md "Ürün/modül
// sayfaları — Aşama 2"):
//   A) `module_title`/`module_subtitle` + `hero_cta_text/url` + `hero_image`
//      hero'su, `section_2_*..section_10_*` içerik blokları (Bordro,
//      Performans, Onboarding).
//   B) `hero_title`/`hero_subtitle` hero'su (A ile aynı section_N_* içerik
//      düzeni) (İzin Yönetimi).
//   C) `section_title_N`/`section_text_N`/`section_cta_text_N`/
//      `section_cta_url_N`/`section_image_N` — alan adı sırası TERS
//      (index önce, alan adı sonra), hero = index 1 (İşe Alım).
//   D) `section_N_title` (PDKS'in kendi şeması, index 1 = hero).
// Ayrıca A/B/D şemasında alan adı YAZIM HATALARI var: "sectin_N_title"
// ("section" değil), "section_N_Text" (büyük T), "section_N_cta_text_url"
// (URL alanı "cta_url" değil "cta_text_url" olarak adlandırılmış) VE bazı
// bloklar `_copy` sonekiyle DUPLICATE edilmiş ama farklı içerik taşıyor
// (ör. performans modülünün section_3'ü aslında 2 ayrı blok: biri düz,
// biri "_copy" — ikisi de gerçek, farklı içerik, atlanmıyor).
//
// `collectBlockIndexFirst`/`collectBlockFieldFirst` bu varyasyonları REGEX
// ile (alan adını sabit varsaymadan) toplayıp normalize ediyor.
//
// Çalıştırma: node scripts/extract-products.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const PAGES_PATH = join('reference', 'wordpress-export', 'pages.json');
const OUT_PATH = join('reference', 'wordpress-export', 'products.json');

// Aşama 2 (PDKS + 5 modül) + Aşama 2.5 (6 yeni modül, şema çeşitliliğini
// test etmek için seçildi — bkz. CLAUDE.md).
const MODULE_TR_SLUGS = [
  'pdks-modulu',
  'bordo-onay-modulu',
  'yillik-izin-takip-programi',
  'calisan-performans-degerlendirme-sistemi-modulu',
  'onboarding-modulu',
  'ise-alim-modulu',
  // --- Aşama 2.5 ---
  'isyeri-saglik-yonetimi-modulu', // Şema D (PDKS ile aynı) doğrulaması
  'offboarding-modulu', // Şema A, küçük
  'anket-modulu', // Şema A, küçük
  'organizasyonel-geri-bildirim-modulu', // Şema A, orta
  'kurumsal-takvim-modulu', // Şema A ama çok sayıda KULLANILMAYAN ekstra ACF alan grubu (387 alan) — gürültüye dayanıklılık testi
  'notlar-modulu', // Şema A, küçük
  // --- Aşama 3 (kısım 1) — docs/remaining-modules-report.md'deki 7 "temiz" modül ---
  'dokuman-yonetim-sistemi-modulu',
  'masraf-yonetimi-modulu',
  'ofis-ici-mesajlasma-modulu',
  'zimmet-yonetimi-modulu',
  'personel-servisi-yonetimi-modulu',
  'calisan-ozluk-yonetimi-modulu-2',
  'calisan-egitim-yonetimi-modulu',
  // --- Aşama 3 (kısım 2) — Puantaj (Şema E, bkz. extractSchemaE()) ---
  'puantaj-takip-programi-modulu',
  // NOT: insan-kaynaklari-yonetimi-modulu ve insan-kaynaklari-isgucu-yonetimi
  // (hub/dizin sayfaları, "product tile grid" düzeni) BİLİNÇLİ OLARAK bu
  // script'e eklenmedi — bunlar standart hero+section düzenine uymuyor,
  // ayrı bir script (scripts/extract-hubs.mjs) ile çıkarılıyor.
];

function slimImage(img) {
  if (!img || typeof img !== 'object') return null;
  return { url: img.url, alt: img.alt || img.title || '', width: img.width, height: img.height };
}

function stripHtml(html) {
  return (html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#8211;/g, '-')
    .replace(/&#038;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

const emptyBlock = () => ({ title: '', text: '', ctaText: '', ctaUrl: '', image: null });

/** "section_N_field" / "sectin_N_field" (yazım hatası) sırasını çözer.
 * `variant` '' (asıl blok) veya '_copy' (aynı index'te ikinci, farklı
 * içerikli blok) olabilir. */
function collectBlockIndexFirst(acf, i, variant) {
  const keyRe = new RegExp(`^(?:section|sectin)_${i}_(.+)$`);
  const relevant = Object.keys(acf).filter((k) => {
    const m = k.match(keyRe);
    if (!m) return false;
    const isCopyKey = /_copy$/.test(m[1]);
    return variant === '_copy' ? isCopyKey : !isCopyKey;
  });

  const titleKey = relevant.find((k) => /title/i.test(k));
  const imageKey = relevant.find((k) => /image/i.test(k));
  const ctaUrlKey = relevant.find((k) => /cta.*url/i.test(k));
  const ctaTextKey = relevant.find((k) => /cta_text/i.test(k) && k !== ctaUrlKey);
  const textKeys = relevant.filter((k) => ![titleKey, imageKey, ctaUrlKey, ctaTextKey].includes(k)).sort();
  const text = textKeys.map((k) => acf[k]).filter((v) => typeof v === 'string' && v.trim()).join('');

  let ctaText = ctaTextKey ? acf[ctaTextKey] : '';
  let ctaUrl = ctaUrlKey ? acf[ctaUrlKey] : '';
  // Bazı blokların CTA alanı YALNIZCA "_copy" sonekiyle var (ör. performans
  // modülünün section_5'i) — asıl blokta CTA bulunamazsa bu istisnai
  // fallback'e bakılır (yalnızca asıl blok için, "_copy" bloğu için değil).
  if (variant === '' && !ctaText) {
    const fk = Object.keys(acf).find((k) => new RegExp(`^(?:section|sectin)_${i}_cta_text_copy$`).test(k));
    if (fk) ctaText = acf[fk];
  }
  if (variant === '' && !ctaUrl) {
    const fk = Object.keys(acf).find((k) => new RegExp(`^(?:section|sectin)_${i}_cta.*url.*_copy$`).test(k));
    if (fk) ctaUrl = acf[fk];
  }

  return {
    title: (titleKey && acf[titleKey]) || '',
    text,
    ctaText: ctaText || '',
    ctaUrl: ctaUrl || '',
    image: slimImage(imageKey ? acf[imageKey] : null),
  };
}

/** "section_field_N" sırasını çözer (İşe Alım modülünde görüldü — alan adı
 * önce, index sonra). `_copy` varyasyonu bu şemada görülmedi. */
function collectBlockFieldFirst(acf, i) {
  const titleKey = `section_title_${i}`;
  const ctaTextKey = `section_cta_text_${i}`;
  const ctaUrlKey = `section_cta_url_${i}`;
  const imageKey = `section_image_${i}`;
  const textKeys = Object.keys(acf)
    .filter((k) => k.startsWith(`section_text_${i}`))
    .sort();
  const text = textKeys.map((k) => acf[k]).filter((v) => typeof v === 'string' && v.trim()).join('');

  return {
    title: acf[titleKey] || '',
    text,
    ctaText: acf[ctaTextKey] || '',
    ctaUrl: acf[ctaUrlKey] || '',
    image: slimImage(acf[imageKey]),
  };
}

/** Şema E — yalnızca Puantaj sayfasında görülen 6. ACF düzeni: hero
 * `product_tit` (başlık) + `module_text` (metin) + `hero_cta_text/url` +
 * `hero_image`. İçerik blokları `section_2`, `section_4`..`section_8`
 * (index 1 hero, index 3 ATLANIYOR — orada başlıksız, isimsiz/şirketsiz bir
 * müşteri alıntısı var, normal içerik bloğu değil; bkz. extractTestimonial()
 * — aynı "veri çıkarılır ama render edilmez" politikası İzin Yönetimi'nin
 * testimonial'ıyla aynı). */
function extractSchemaE(acf) {
  const hero = {
    title: acf.product_tit || '',
    text: acf.module_text || '',
    ctaText: acf.hero_cta_text || '',
    ctaUrl: acf.hero_cta_url || '',
    image: slimImage(acf.hero_image),
  };
  const sections = [];
  for (const i of [2, 4, 5, 6, 7, 8]) {
    const b = collectBlockIndexFirst(acf, i, '');
    if (b.title || b.text) sections.push(b);
  }
  return { hero, sections };
}

/** Sayfanın hangi ACF şemasını kullandığını tespit edip hero + içerik
 * bloklarını normalize eder. Şema öncelik sırası: module_title (A) >
 * hero_title (B) > section_title_1 (C, "field-first") > section_1_title
 * (D, PDKS) > product_tit (E, Puantaj). Hiçbiri yoksa boş hero + boş
 * bloklar döner (uyarı loglanır). */
function extractHeroAndSections(acf, trSlug) {
  if (acf.module_title || acf.hero_title) {
    const hero = {
      title: acf.module_title || acf.hero_title,
      text: acf.module_subtitle || acf.hero_subtitle || '',
      ctaText: acf.hero_cta_text || '',
      ctaUrl: acf.hero_cta_url || '',
      image: slimImage(acf.hero_image),
    };
    const sections = [];
    for (let i = 2; i <= 10; i++) {
      const base = collectBlockIndexFirst(acf, i, '');
      if (base.title || base.text) sections.push(base);
      const copy = collectBlockIndexFirst(acf, i, '_copy');
      if (copy.title || copy.text) sections.push(copy);
    }
    return { hero, sections };
  }
  if (acf.section_title_1 || acf.section_text_1) {
    const hero = collectBlockFieldFirst(acf, 1);
    const sections = [];
    for (let i = 2; i <= 10; i++) {
      const b = collectBlockFieldFirst(acf, i);
      if (b.title || b.text) sections.push(b);
    }
    return { hero, sections };
  }
  if (acf.section_1_title) {
    const hero = collectBlockIndexFirst(acf, 1, '');
    const sections = [];
    for (let i = 2; i <= 10; i++) {
      const b = collectBlockIndexFirst(acf, i, '');
      if (b.title || b.text) sections.push(b);
    }
    return { hero, sections };
  }
  if (acf.product_tit) {
    return extractSchemaE(acf);
  }
  console.warn(`UYARI: '${trSlug}' için tanınan bir ACF şeması bulunamadı — hero/bloklar boş kalacak, elle incelenmeli.`);
  return { hero: emptyBlock(), sections: [] };
}

function extractFaq(acf) {
  const faq = [];
  for (let i = 1; i <= 20; i++) {
    const question = acf[`question_${i}`];
    if (!question || !question.trim()) continue;
    faq.push({ question, answer: acf[`answer_${i}`] || '' });
  }
  return faq;
}

/** Bazı sayfalarda (ör. İzin Yönetimi) hero/section blokları dışında bir
 * müşteri referans/testimonial bloğu var (company_name/job_title/logo/name/
 * banner_text). Şu an ProductPage.astro bunu RENDER ETMİYOR (bkz. CLAUDE.md
 * — PDKS şablonunu birebir kullanma kararı) — yalnızca ileride kullanılmak
 * üzere ham veri olarak saklanıyor. */
function extractTestimonial(acf) {
  if (acf.product_tit) {
    // Şema E (Puantaj) — alıntı `section_3_text`'te duruyor, banner_text/
    // company_name (diğer şemalardaki testimonial alanları) burada hep boş.
    if (!acf.section_3_text) return null;
    return {
      quote: acf.section_3_text,
      name: acf.name || '',
      jobTitle: acf.job_title || '',
      companyName: acf.company_name || '',
      logo: slimImage(acf.logo),
    };
  }
  if (!acf.banner_text && !acf.company_name) return null;
  return {
    quote: acf.banner_text || '',
    name: acf.name || '',
    jobTitle: acf.job_title || '',
    companyName: acf.company_name || '',
    logo: slimImage(acf.logo),
  };
}

function main() {
  const pages = JSON.parse(readFileSync(PAGES_PATH, 'utf-8'));
  const byId = new Map(pages.map((p) => [p.id, p]));

  const products = [];
  for (const trSlug of MODULE_TR_SLUGS) {
    const trEntry = pages.find((p) => p.slug === trSlug && p.pll_language === 'tr');
    if (!trEntry) {
      console.warn(`UYARI: '${trSlug}' TR sayfası pages.json'da bulunamadı, atlanıyor.`);
      continue;
    }
    const translations = trEntry.pll_translations || {};
    const perLocale = {};
    for (const [locale, id] of Object.entries(translations)) {
      const entry = byId.get(id);
      if (!entry) continue;
      const { hero, sections } = extractHeroAndSections(entry.acf || {}, `${trSlug} (${locale})`);
      perLocale[locale] = {
        id: entry.id,
        slug: entry.slug,
        link: entry.link,
        title: stripHtml(entry.title?.rendered),
        modified: entry.modified,
        hero,
        sections,
        faq: extractFaq(entry.acf || {}),
        testimonial: extractTestimonial(entry.acf || {}),
      };
    }
    products.push({ trSlug, locales: perLocale });
  }

  mkdirSync(join('reference', 'wordpress-export'), { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify(
      {
        _source: 'reference/wordpress-export/pages.json (yerel export, `page` post type — sectors.json gibi ayrı bir CPT DEĞİL, bkz. CLAUDE.md)',
        _fetchedAt: new Date().toISOString(),
        _note:
          'Aşamalı rollout: MODULE_TR_SLUGS listesi henüz 89 modülün tamamını kapsamıyor, yalnızca onaylanan sayfaları içerir. ACF şeması sayfa/modüle göre değişiyor (bkz. CLAUDE.md) — extractHeroAndSections() şema tespiti yapıyor.',
        products,
      },
      null,
      2,
    ),
  );

  console.log(`Wrote ${products.length} ürün grubu (x4 dil, mevcut olduğu kadar) -> ${OUT_PATH}`);
  for (const p of products) {
    const langs = Object.keys(p.locales);
    const sectionCounts = langs.map((l) => `${l}:${p.locales[l].sections.length}`);
    const faqCounts = langs.map((l) => `${l}:${p.locales[l].faq.length}`);
    console.log(`- ${p.trSlug} — diller: [${langs.join(', ')}] — içerik blok sayısı: ${sectionCounts.join(', ')} — SSS sayısı: ${faqCounts.join(', ')}`);
  }
}

main();
