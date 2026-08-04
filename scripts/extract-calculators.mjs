// Hesaplama Araçları sayfası (/hesaplama-araclari/) — TEK Elementor sayfası,
// 8 hesap makinesi akordeon içinde. Kaynak sitede yalnızca TÜRKÇE var
// (pages.json id 22563, `pll_translations` yalnızca {"tr":22563}) — EN/IT
// /en//it/ önekli URL'leri 301 ile bare TR sayfasına yönleniyor, gerçek
// çevirisi yok (kullanıcı kararıyla bu turda EN/IT ERTELENDİ, bkz. CLAUDE.md
// KARAR 2). Bu script yalnızca METİN içeriğini (başlık/alt başlık, her
// aracın adı/ikonu/not metni) çıkarır — form alanlarının yapısı ve
// hesaplama FORMÜLLERİ elle incelenip `src/data/calculatorDefinitions.ts`'e
// TypeScript olarak yazıldı (kaynağın jQuery/DOM'a bağımlı JS'i doğrudan
// çalıştırılamaz/parse edilemez güvenle — bu projede CTA çözümleme,
// slug eşleme gibi TÜM davranışsal mantık hep elle TS'e taşınır, ham JS
// hiç import/eval edilmez).
//
// Network YOK — `reference/wordpress-export/pages.json`'daki `content.rendered`
// (Elementor HTML) zaten yerel ve tam. Çalıştırma: `node scripts/extract-calculators.mjs`
import { readFileSync, writeFileSync } from 'node:fs';

const pages = JSON.parse(readFileSync('reference/wordpress-export/pages.json', 'utf-8'));
const page = pages.find((p) => p.id === 22563);
if (!page) throw new Error('Hesaplama Araçları sayfası (id 22563) pages.json içinde bulunamadı');

const html = page.content.rendered;

function decodeEntities(s) {
  return s
    .replace(/&#8217;/g, '’')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8211;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

const heroTitleMatch = html.match(/<h1 class="elementor-heading-title[^"]*">([^<]*)<\/h1>/);
const heroTextMatch = html.match(/<p class="paragraph-\d+">([^<]*)<\/p>/);

// `<details id="title-N">` sınırlarına göre BÖLEREK her aracı kendi
// diliminde ayrı ayrı ara — düz sıralı regex (title[i]/note[i] eşleştirme)
// YANLIŞ ÇIKTI: Gelir Vergisi aracının `.note` div'i hiç yok (kaynakta
// gerçekten eksik), bu da sıralı eşleştirmeyi bir kaydırıp sonraki TÜM
// notları yanlış araca bağlıyordu (son araç da notsuz kalıyordu). Bölüm
// bazlı arama, eksik bir alanın diğerlerini kaydırmasını engelliyor.
const sectionStarts = [...html.matchAll(/<details id="title-\d+"/g)].map((m) => m.index);
const sections = sectionStarts.map((start, i) => html.slice(start, sectionStarts[i + 1] ?? html.length));

if (sections.length !== 8) {
  console.warn(`UYARI: beklenen 8 araç yerine ${sections.length} <details> bölümü bulundu.`);
}

const tools = sections.map((section) => {
  const titleMatch = section.match(/accordion-item-title-text"> <p><span>([^<]*)<\/span>/);
  const iconMatch = section.match(/icon: "([^"]*)"/);
  const noteMatch = section.match(/class="note"><p>ⓘ ([^<]*)<\/p>/);
  return {
    title: titleMatch ? decodeEntities(titleMatch[1]) : null,
    icon: iconMatch ? iconMatch[1] : null,
    note: noteMatch ? decodeEntities(noteMatch[1]) : null,
  };
});

const output = {
  _source: 'reference/wordpress-export/pages.json (id 22563, network YOK)',
  _note:
    'Yalnızca metin içeriği (başlık/ikon/not). Form alanları + hesaplama formülleri elle src/data/calculatorDefinitions.ts\'e taşındı — bkz. dosya başındaki not.',
  _fetchedAt: new Date().toISOString(),
  slug: page.slug,
  link: page.link,
  hero: {
    title: heroTitleMatch ? decodeEntities(heroTitleMatch[1]) : null,
    text: heroTextMatch ? decodeEntities(heroTextMatch[1]) : null,
  },
  tools,
};

writeFileSync('reference/wordpress-export/calculators.json', JSON.stringify(output, null, 2) + '\n');
console.log(`✅ ${tools.length} araç çıkarıldı → reference/wordpress-export/calculators.json`);
tools.forEach((t) => console.log(`  - ${t.title}`));
