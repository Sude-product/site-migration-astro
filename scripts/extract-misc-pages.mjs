// Sayfa envanterinin kalan öncelikli sayfalarını (İletişim, Tüketici
// Hakları Sözleşmesi, Mesafeli Satış Sözleşmesi, Güvenlik, Hedef Global
// Marka, Neden İdenfit) YEREL `pages.json`'dan çıkarıp
// `reference/wordpress-export/misc-pages.json`'a normalize eder. Hepsi
// standart `page` post type'ında (sectors/donanim gibi ayrı bir CPT
// DEĞİL) — network fetch YOK.
//
// Her sayfa türü kendi doğal şeklinde tutulur (tek bir zorlama şema yok):
// - contact: hero + call/email blokları + ofis listesi (form alanları
//   ayrı değil, hero'dakiyle aynı — HeroForm.tsx yeniden kullanılacak)
// - legal (tuketici-haklari, mesafeli-satis): tek `content_block` alanı
//   (zaten TAM, gerçek 3 dilde çeviri — extraction'da yalnızca temizleniyor)
// - security: numaralı madde listesi (başlık + link, bazıları PDF bazıları
//   iç sayfa)
// - productLike (global-brand, neden-idenfit): PDKS'in Şema D'siyle aynı
//   (`section_N_title/text/image`, N=1 hero) — `ProductBlock` uyumlu.
//
// Çalıştırma: node scripts/extract-misc-pages.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const PAGES_PATH = join('reference', 'wordpress-export', 'pages.json');
const OUT_PATH = join('reference', 'wordpress-export', 'misc-pages.json');

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

function bareSlugFromLink(link) {
  const { pathname } = new URL(link);
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length && ['tr', 'en', 'nl', 'it'].includes(parts[0])) parts.shift();
  return parts.join('/');
}

/** PDKS'in Şema D'siyle aynı toplayıcı (bkz. extract-products.mjs) —
 * `section_N_title/text/image` alanlarını regex ile toplar. */
function collectBlockIndexFirst(acf, i) {
  const keyRe = new RegExp(`^section_${i}_(.+)$`);
  const relevant = Object.keys(acf).filter((k) => keyRe.test(k));
  const titleKey = relevant.find((k) => /title/i.test(k));
  const imageKey = relevant.find((k) => /image/i.test(k));
  const ctaUrlKey = relevant.find((k) => /cta.*url/i.test(k));
  const ctaTextKey = relevant.find((k) => /cta_text/i.test(k) && k !== ctaUrlKey);
  const subtitleKey = relevant.find((k) => /subtitle/i.test(k));
  const textKeys = relevant
    .filter((k) => ![titleKey, imageKey, ctaUrlKey, ctaTextKey, subtitleKey].includes(k))
    .sort();
  const textParts = [];
  if (subtitleKey && acf[subtitleKey]?.trim()) textParts.push(`<p><strong>${acf[subtitleKey]}</strong></p>`);
  for (const k of textKeys) if (typeof acf[k] === 'string' && acf[k].trim()) textParts.push(acf[k]);

  return {
    title: (titleKey && acf[titleKey]) || '',
    text: textParts.join(''),
    ctaText: (ctaTextKey && acf[ctaTextKey]) || '',
    ctaUrl: (ctaUrlKey && acf[ctaUrlKey]) || '',
    image: slimImage(imageKey ? acf[imageKey] : null),
  };
}

function extractProductLike(acf, maxSections = 8) {
  const hero = collectBlockIndexFirst(acf, 1);
  const sections = [];
  for (let i = 2; i <= maxSections; i++) {
    const b = collectBlockIndexFirst(acf, i);
    if (b.title || b.text) sections.push(b);
  }
  return { hero, sections };
}

function extractContact(acf) {
  const offices = [];
  for (let i = 1; i <= 3; i++) {
    if (acf[`office_${i}`]) offices.push({ name: acf[`office_${i}`], address: acf[`address_${i}`] || '' });
  }
  return {
    pageTitle: acf.page_title || '',
    pageSubtitle: acf.page_subtitle || '',
    callTitle: acf.call_title || '',
    callText: acf.call_text || '',
    callLinkUrl: acf.call_link_url || '',
    emailTitle: acf['e-mail_title'] || '',
    emailLinkUrl: acf['e-mail_link_url'] || '',
    formTitle: acf.form_title || '',
    officesTitle: acf.offices_title || '',
    offices,
  };
}

function extractSecurity(acf) {
  const items = [];
  for (let i = 1; i <= 10; i++) {
    if (!acf[`item_title_${i}`]) continue;
    items.push({
      title: stripHtml(acf[`item_title_${i}`]).replace(/^\d+\.?\s*/, ''),
      linkText: acf[`item_link_text_${i}`] || '',
      url: acf[`item_link_${i}`] || '',
    });
  }
  return { items };
}

function cleanRichText(html) {
  return (html || '').replace(/\s(class|style)="[^"]*"/g, '');
}

/** KVK Protokol (2026-08-05, kapsamlı URL denetimiyle bulunan kaçırılmış
 * sayfa) diğer "legal" sayfalar gibi bir ACF `content_block` alanı
 * KULLANMIYOR — ham belge doğrudan bir Elementor "HTML" widget'ına
 * (`widget_type="html.default"`) yapıştırılmış, yani yalnızca
 * `content.rendered`'da var. Kaynağın TR kaydı `<section class="contract-body">`
 * etiketini hiç KAPATMAMIŞ (well-formed değil, tarayıcı toleranslı olduğu
 * için canlıda sorun çıkmıyor) — EN kaydı ise kapatmış, iki dil arasında
 * bile tutarsız. Bu yüzden önce gerçek `</section>` aranır (varsa, EN gibi,
 * en güvenilir sınır); yoksa (TR gibi) Elementor'un kendi wrapper
 * div'lerinin ardışık/saf kapanış zincirinden yalnızca içeriğe ait SON
 * gerçek kapanış (`highlight` bloğu) geri bırakılıp gerisi atılır. */
function extractLegalFromRenderedHtml(entry) {
  const html = entry.content?.rendered || '';
  const startMarker = '<section class="contract-body">';
  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) {
    console.warn(`UYARI: '${entry.slug}' (${entry.id}) içinde 'contract-body' bulunamadı, boş içerik.`);
    return { contentHtml: '' };
  }
  let body = html.slice(startIdx + startMarker.length);
  const sectionCloseIdx = body.indexOf('</section>');
  if (sectionCloseIdx !== -1) {
    body = body.slice(0, sectionCloseIdx);
  } else {
    const trailingCloseChain = /(?:\s*<\/div>)+\s*$/;
    const m = body.match(trailingCloseChain);
    if (m) body = body.slice(0, m.index) + '\n</div>';
  }
  // Belgenin kendi başlığı (`div.contract-title`) sayfanın `<h1>`'iyle
  // (page_title) örtüşen bir tekrar — semantik bir alt başlığa (`h2`)
  // çevrilip LegalPage.astro'nun mevcut `[&_h2]` stiliyle render ediliyor.
  body = body.replace(/<div class="contract-title">([\s\S]*?)<\/div>/, (_, inner) => `<h2>${inner.trim()}</h2>`);
  return { contentHtml: cleanRichText(body.trim()) };
}

function extractLegal(acf) {
  return { contentHtml: cleanRichText(acf.content_block || '') };
}

function extractPresentation(acf) {
  return {
    pageTitle: acf.page_title || '',
    info: [acf.info_1, acf.info_2, acf.info_3].filter((v) => v && v.trim()),
    callText: acf.call_text || '',
    phoneNumber: (acf.phone_number || '').trim(),
    phoneNumberLink: acf.phone_number_link || '',
    formTitle: acf.form_title || '',
    formText: acf.form_text || '',
    integrationsText: acf.integrations_text || '',
    integrationsImage: slimImage(acf.integrations_image),
    referencesText: acf.references_text || '',
    referencesImage: slimImage(acf.references_image),
  };
}

const byId = new Map(JSON.parse(readFileSync(PAGES_PATH, 'utf-8')).map((p) => [p.id, p]));
const pages = [...byId.values()];

// "Online Sunum Talebi" (Request Online Presentation) sayfasının TR
// kaydının (id 15441) KENDİ `pll_translations`'ı yalnızca `{tr:15441}` —
// EN/IT (15861/23650, ki ikisi de birbirine doğru bağlı, `nl:22735`'i de
// içeriyor ama o kayıt yerel export'ta yok) TR'ye bağlı DEĞİL. Bu, WP
// tarafında gerçek bir Polylang bağlantı kopukluğu (genel `group()`
// fonksiyonu TR'nin `pll_translations`'ına güvendiği için bunu
// YAKALAYAMAZ) — bu yüzden bu tek sayfa için ID'ler elle eşleniyor.
const PRESENTATION_IDS = { tr: 15441, en: 15861, it: 23650 };
function buildPresentationGroup() {
  const locales = {};
  for (const [locale, id] of Object.entries(PRESENTATION_IDS)) {
    const entry = byId.get(id);
    if (!entry) continue;
    locales[locale] = {
      id: entry.id,
      slug: bareSlugFromLink(entry.link),
      title: stripHtml(entry.title?.rendered),
      modified: entry.modified,
      content: extractPresentation(entry.acf || {}),
    };
  }
  return { trSlug: 'online-sunum-talep-et', kind: 'presentation', locales };
}

function group(trSlug, kind, extractFn, maxSections) {
  const trEntry = pages.find((p) => p.pll_language === 'tr' && bareSlugFromLink(p.link) === trSlug);
  if (!trEntry) {
    console.warn(`UYARI: '${trSlug}' TR sayfası bulunamadı, atlanıyor.`);
    return null;
  }
  const translations = trEntry.pll_translations || {};
  const locales = {};
  for (const [locale, id] of Object.entries(translations)) {
    const entry = byId.get(id);
    if (!entry) continue;
    locales[locale] = {
      id: entry.id,
      slug: bareSlugFromLink(entry.link),
      title: stripHtml(entry.title?.rendered),
      modified: entry.modified,
      content:
        kind === 'productLike'
          ? extractFn(entry.acf || {}, maxSections)
          : kind === 'legalRendered'
            ? extractFn(entry)
            : extractFn(entry.acf || {}),
    };
  }
  return { trSlug, kind, locales };
}

const groups = [
  group('iletisim', 'contact', extractContact),
  group('sozlesme/tuketici-haklari', 'legal', extractLegal),
  group('sozlesme/mesafeli-satis-sozlesmesi', 'legal', extractLegal),
  group('sozlesme/gizlilik-ve-guvenlik-politikasi', 'legal', extractLegal),
  group('guvenlik', 'security', extractSecurity),
  group('hedef-global-marka', 'productLike', extractProductLike, 3),
  group('neden-idenfit', 'productLike', extractProductLike, 8),
  group('hakkimizda', 'productLike', extractProductLike, 3),
  group('kisisel-verilerin-korunmasi', 'legal', extractLegal),
  // 2026-08-05 — kapsamlı URL denetimiyle bulunan, önceki turlarda
  // kaçırılmış sayfa (bkz. extractLegalFromRenderedHtml() yorumu).
  group('kvk-protokol', 'legalRendered', extractLegalFromRenderedHtml),
  buildPresentationGroup(),
].filter(Boolean);

mkdirSync(join('reference', 'wordpress-export'), { recursive: true });
writeFileSync(
  OUT_PATH,
  JSON.stringify(
    {
      _source: 'reference/wordpress-export/pages.json (yerel export, `page` post type)',
      _fetchedAt: new Date().toISOString(),
      _note:
        'Her grup kendi doğal şeklinde: contact (hero+ofis listesi), legal (tek content_block), security (madde listesi), productLike (Şema D — ProductBlock uyumlu, ProductPage.astro ile render edilebilir).',
      pages: groups,
    },
    null,
    2,
  ),
);

console.log(`Wrote ${groups.length} page groups to ${OUT_PATH}`);
for (const g of groups) {
  console.log(`- ${g.trSlug} (${g.kind}): diller = [${Object.keys(g.locales).join(', ')}]`);
}
