// WP'nin ham Gutenberg HTML'ini (`<p class="wp-block-paragraph">`,
// `<strong>`, `<a rel="noreferrer noopener">` vb.) Decap CMS'in Rich Text
// editörünün (markdown-it tabanlı) gerçekten anlayacağı temiz Markdown'a
// çeviren paylaşılan modül. `migrate-blog-to-markdown.mjs` (yeni göçler)
// ve `reprocess-migrated-blog-html.mjs` (zaten göç etmiş pilot dosyaları
// yeniden işlemek için) tarafından ortak kullanılır — tek merkezi kural
// seti, iki ayrı turndown yapılandırması olmasın diye.
import TurndownService from 'turndown';

// WP editörünün kendi hatası: aynı metin bazen `<strong><strong>...
// </strong></strong>` olarak İKİ KEZ sarılmış geliyor (kopyala-yapıştır
// artığı). Turndown'a olduğu gibi verilirse `****metin**` gibi geçersiz/
// tuhaf Markdown üretir (iç içe eşit-öncelikli emphasis delimiter'ları
// birleşmez) — dönüştürmeden ÖNCE tek katmana indiriliyor, anlam
// kaybı yok (nested strong zaten tek strong ile aynı görsel sonucu verir).
function collapseNestedStrong(html) {
  let prev;
  do {
    prev = html;
    html = html.replace(/<strong>(\s*)<strong>/gi, '<strong>$1').replace(/<\/strong>(\s*)<\/strong>/gi, '$1</strong>');
  } while (html !== prev);
  return html;
}

// Boş `<p><br></p>` blokları (WP editöründe "boş satır bırak" için
// kullanılan bir alışkanlık) dönüşümden sonra anlamsız tek başına `\`
// karakterleri üretiyordu — dönüşümden ÖNCE temizleniyor.
function stripEmptyParagraphs(html) {
  return html.replace(/<p[^>]*>(\s|<br\s*\/?>)*<\/p>/gi, '');
}

function createTurndownService() {
  const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

  // WP'nin gömdüğü embed'ler (Google Form iframe'i gibi) Markdown'da
  // temsil edilemez — içerik kaybı yaşanmaması için ham HTML olarak
  // KORUNUYOR (CommonMark'ın raw-HTML-block geçirme kuralı sayesinde
  // Markdown dosyasının içinde geçerli kalır, yalnızca bu tek blok CMS'in
  // Rich Text görünümünde HTML olarak kalmaya devam eder — dokümante
  // edilmiş, bilinçli bir sınır).
  // `<cite>` (dış kaynak atfı, 2026-08-24 GEO turu) ve `<sup>` (dipnot,
  // ör. KPMG) Turndown'ın tanımadığı etiketler — varsayılan davranış
  // bunları SESSİZCE unwrap eder (metin kalır, etiket kaybolur). Markdown'da
  // karşılığı olmadığı için ham HTML olarak KORUNUYOR (CommonMark
  // raw-HTML-inline geçirme kuralı, `iframe`'le aynı ilke).
  td.keep(['iframe', 'cite', 'sup']);

  // `<mark>` yalnızca WP'nin inline vurgu/renk stilini taşıyor
  // (background-color/color) — Markdown'da karşılığı yok, kaldırılıp
  // metin içeriği korunuyor (rengi/vurgusu kaybolur, bilinçli bir sınır).
  td.addRule('stripMark', {
    filter: 'mark',
    replacement: (content) => content,
  });

  // `aria-label` taşıyan `<a>` etiketleri (2026-08-10/19 erişilebilirlik
  // turlarının `fixLinkAccessibility()` çıktısı, ör. boş/jenerik linklere
  // eklenen ekran-okuyucu etiketi) — Markdown link söz dizimi
  // (`[metin](url)`) `aria-label` gibi rastgele HTML nitelikleri
  // TAŞIYAMAZ. Varsayılan link kuralına bırakılırsa etiket SESSİZCE
  // kaybolur (`href`/görünür metin dışındaki her şeyi atar) — bu yüzden
  // bu tür linkler ham HTML olarak KORUNUYOR (`cite`/`sup`/`iframe`'le
  // aynı ilke).
  td.addRule('keepAriaLabelledLinks', {
    filter: (node) => node.nodeName === 'A' && !!node.getAttribute('aria-label'),
    replacement: (_content, node) => node.outerHTML,
  });

  // Varsayılan `<br>` kuralı (iki boşluk + satır sonu) git/editör
  // araçlarının trailing-whitespace temizlemesiyle sessizce kaybolabilir
  // — bunun yerine görünür bir ters eğik çizgi (`\`) + satır sonu
  // kullanılıyor, aynı CommonMark "hard break" anlamına geliyor ama
  // whitespace-trim'e karşı dayanıklı.
  td.addRule('hardBreak', {
    filter: 'br',
    replacement: () => '\\\n',
  });

  return td;
}

const turndownService = createTurndownService();

/**
 * @param {string} html - WP'nin ham Gutenberg HTML gövdesi
 * @returns {string} temiz Markdown
 */
export function htmlToMarkdown(html) {
  const cleaned = stripEmptyParagraphs(collapseNestedStrong(html ?? ''));
  const markdown = turndownService.turndown(cleaned);
  // Fazla boş satırları (3+) 1'e indir, baştaki/sondaki boşluğu kırp.
  return markdown.replace(/\n{3,}/g, '\n\n').trim();
}
