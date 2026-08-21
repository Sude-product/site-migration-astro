// Donanım sayfasının (`idenfit.com/donanim/`) 4 dildeki ACF içeriğini YEREL
// `pages.json`'dan çıkarıp `reference/wordpress-export/hardware.json`'a
// normalize eder. Sektörlerin/modüllerin aksine bu TEK bir sayfa (5 ayrı
// modül sayfası DEĞİL) — farklı donanım/teknoloji türleri (Biyometrik,
// Bluetooth, RFID, GPRS, Turnikeler, Onaylı Markalar) birer bölüm/blok
// olarak art arda sıralanıyor, anchor id'lerle (`#rfid` gibi) o bölüme
// atlanabiliyor.
//
// ACF şeması PDKS'in Şema D'siyle (section_N_title/text/cta_text/cta_url/
// image, N=1 hero) BİREBİR AYNI — `collectBlockIndexFirst` burada da
// çalışıyor, yeni bir şema tespiti gerekmedi. TR sayfasında (id 11715)
// ayrıca 300+ KULLANILMAYAN ACF alanı var (banner_*, femas_*, civil_*,
// office_* vb. — başka şablonlardan kalma gürültü, Şirket Takvimi'nde
// görülen aynı örüntü) — `collectBlockIndexFirst`'ün regex'i bunları
// otomatik eler, yalnızca `section_N_*` alanlarını toplar.
//
// Anchor id'ler kaynak sitenin GERÇEK `content.rendered` HTML'indeki id
// niteliklerinden alındı (`entegrasyon`, `biyometrik`, `bluetooth`, `rfid`,
// `gprs`, `turnikeler`, `markalar` — section_4/"Donanım çekirdek platform"
// için kaynakta isimli bir id yoktu, `platform` biz atadık).
//
// Çalıştırma: node scripts/extract-hardware.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const PAGES_PATH = join('reference', 'wordpress-export', 'pages.json');
const OUT_PATH = join('reference', 'wordpress-export', 'hardware.json');

const TR_SLUG = 'donanim';

// section index -> anchor id (bkz. yukarıdaki not).
const SECTION_ANCHORS = {
  1: 'entegrasyon',
  2: 'biyometrik',
  3: 'bluetooth',
  4: 'platform',
  5: 'rfid',
  6: 'gprs',
  7: 'turnikeler',
  8: 'markalar',
};

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

/** `extract-products.mjs`'teki Şema D toplayıcısıyla aynı mantık —
 * "section_N_field" alanlarını regex ile toplar, alan adını sabit varsaymaz. */
function collectBlockIndexFirst(acf, i) {
  const keyRe = new RegExp(`^section_${i}_(.+)$`);
  const relevant = Object.keys(acf).filter((k) => keyRe.test(k));

  const titleKey = relevant.find((k) => /title/i.test(k));
  const imageKey = relevant.find((k) => /image/i.test(k));
  const ctaUrlKey = relevant.find((k) => /cta.*url/i.test(k));
  const ctaTextKey = relevant.find((k) => /cta_text/i.test(k) && k !== ctaUrlKey);
  const textKeys = relevant.filter((k) => ![titleKey, imageKey, ctaUrlKey, ctaTextKey].includes(k)).sort();
  const text = textKeys.map((k) => acf[k]).filter((v) => typeof v === 'string' && v.trim()).join('');

  return {
    title: (titleKey && acf[titleKey]) || '',
    text,
    ctaText: (ctaTextKey && acf[ctaTextKey]) || '',
    ctaUrl: (ctaUrlKey && acf[ctaUrlKey]) || '',
    image: slimImage(imageKey ? acf[imageKey] : null),
    id: SECTION_ANCHORS[i],
  };
}

function extractHeroAndSections(acf) {
  const hero = collectBlockIndexFirst(acf, 1);
  const sections = [];
  for (let i = 2; i <= 8; i++) {
    const b = collectBlockIndexFirst(acf, i);
    if (b.title || b.text) sections.push(b);
  }
  return { hero, sections };
}

function main() {
  const pages = JSON.parse(readFileSync(PAGES_PATH, 'utf-8'));
  const byId = new Map(pages.map((p) => [p.id, p]));

  const trEntry = pages.find((p) => p.slug === TR_SLUG && p.pll_language === 'tr');
  if (!trEntry) {
    console.error(`HATA: '${TR_SLUG}' TR sayfası pages.json'da bulunamadı.`);
    process.exit(1);
  }

  const translations = trEntry.pll_translations || {};
  const perLocale = {};
  for (const [locale, id] of Object.entries(translations)) {
    const entry = byId.get(id);
    if (!entry) continue;
    const { hero, sections } = extractHeroAndSections(entry.acf || {});
    perLocale[locale] = {
      id: entry.id,
      slug: entry.slug,
      link: entry.link,
      title: stripHtml(entry.title?.rendered),
      modified: entry.modified,
      hero,
      sections,
    };
  }

  mkdirSync(join('reference', 'wordpress-export'), { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify(
      {
        _source: 'reference/wordpress-export/pages.json (yerel export, `page` post type)',
        _fetchedAt: new Date().toISOString(),
        _note:
          'Donanım TEK bir sayfa (5 ayrı modül DEĞİL) — bölümler section_N_* (Şema D, PDKS ile aynı) alanlarından çıkarıldı, anchor id\'ler kaynak HTML\'in gerçek id niteliklerinden (section_4/"platform" hariç, biz atadık).',
        hardware: { trSlug: TR_SLUG, locales: perLocale },
      },
      null,
      2,
    ),
  );

  console.log(`✅ ${OUT_PATH} yazıldı.`);
  for (const [locale, entry] of Object.entries(perLocale)) {
    console.log(`  ${locale}: hero + ${entry.sections.length} blok (${entry.link})`);
  }
}

main();
