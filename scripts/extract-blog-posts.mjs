// Blog yazılarını `posts.json`'dan (WordPress export) alıp
// `src/content/blog/posts.json`'a (Astro Content Collection veri kaynağı)
// işler. KASITLI OLARAK toplu değil — komut satırından verilen slug'ları
// tek tek işler, böylece her yazı gözden geçirilip onaylanabilir (bkz.
// CLAUDE.md "Blog migrasyonu" — pilot yazıyla başlanıp kullanıcı onayı
// bekleniyor).
//
// Çalıştırma: node scripts/extract-blog-posts.mjs <slug1> [slug2 ...]
//         VEYA (FAZ B, tümü): node scripts/extract-blog-posts.mjs --all
// Önkoşul: node scripts/fetch-blog-taxonomy.mjs (kategori/tag isimleri için)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const REF_DIR = 'reference/wordpress-export';
const OUT_DIR = 'src/content/blog';
const OUT_FILE = `${OUT_DIR}/posts.json`;

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Kullanım: node scripts/extract-blog-posts.mjs <slug1> [slug2 ...] | --all');
  process.exit(1);
}

const posts = JSON.parse(readFileSync(`${REF_DIR}/posts.json`, 'utf-8'));
const media = JSON.parse(readFileSync(`${REF_DIR}/media.json`, 'utf-8'));
const categoryTerms = JSON.parse(readFileSync(`${REF_DIR}/blog-categories.json`, 'utf-8'));
const tagTerms = JSON.parse(readFileSync(`${REF_DIR}/blog-tags.json`, 'utf-8'));

// `--all` (FAZ B) 618 slug'ı komut satırı argümanı olarak geçirmenin
// pratik/OS-limitleri sorunlu olacağı (ve tek tek listelemenin anlamsız
// olacağı) için ayrı bir bayrak — `posts.json`'daki TÜM `publish`
// durumundaki yazıları işler.
const slugs = args[0] === '--all' ? posts.filter((p) => p.status === 'publish').map((p) => p.slug) : args;

const postsBySlug = new Map(posts.map((p) => [p.slug, p]));
const mediaById = new Map(media.map((m) => [m.id, m]));
const categoryById = new Map(categoryTerms.map((t) => [t.id, t]));
const tagById = new Map(tagTerms.map((t) => [t.id, t]));

// --- HTML entity çözme -------------------------------------------------------
//
// İKİ ayrı fonksiyon var, kasıtlı: `content` alanı gerçek HTML olarak
// `set:html` ile yeniden gömülüyor, `title`/`excerpt` ise düz metin. Yapısal
// escape'leri (`&amp;`/`&lt;`/`&gt;`/`&quot;`/`&apos;`) HTML gövdesinde
// ÇÖZMEK bir bug'a yol açıyor — ör. blog-içi linklerin UTM query string'leri
// `?utm_source=blog&amp;utm_medium=...` gibi `&amp;` ile escape edilmiş
// durumda; bunu `&`'e çözmek attribute içinde ambiguous/geçersiz bir `&`
// bırakır. Bu yüzden HTML gövdesinde SADECE tipografik entity'ler
// (`&hellip;`, `&rsquo;` vb. + numerik `&#8217;` gibi) çözülüyor; düz metne
// (`title`/`excerpt`) çevrilirken (`stripTags()`) TÜMÜ çözülüyor.
const TYPOGRAPHIC_NAMED = {
  hellip: '…', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’',
  ldquo: '“', rdquo: '”', nbsp: ' ',
};
const STRUCTURAL_NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

function decodeNumericEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

// HTML olarak kalacak metin için güvenli — yapısal escape'lere dokunmaz.
function decodeTypographicEntities(html) {
  return decodeNumericEntities(html).replace(
    /&(hellip|ndash|mdash|lsquo|rsquo|ldquo|rdquo|nbsp);/g,
    (_, name) => TYPOGRAPHIC_NAMED[name],
  );
}

// Düz metne (title/excerpt) çevrilen, artık markup OLMAYAN metin için.
function decodeAllEntities(text) {
  return decodeTypographicEntities(text).replace(
    /&(amp|lt|gt|quot|apos);/g,
    (_, name) => STRUCTURAL_NAMED[name],
  );
}

function stripTags(html) {
  return decodeAllEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

// WP export'unda gövde (`content.rendered`) genelde başlıkla BİREBİR aynı
// metni tekrar eden bir `<h1>` ile başlıyor (pilot yazıda doğrulandı) —
// sayfa şablonu başlığı zaten kendi `<h1>` olarak render edeceği için bu
// yinelenen H1 (varsa) gövdeden çıkarılır.
function stripDuplicateLeadingH1(html, title) {
  const match = html.match(/^\s*<h1[^>]*>([\s\S]*?)<\/h1>\s*/i);
  if (!match) return html;
  const h1Text = stripTags(match[1]).toLowerCase();
  const titleText = stripTags(title).toLowerCase();
  if (h1Text !== titleText) return html;
  return html.slice(match[0].length);
}

// Rank Math'in "İçindekiler" (TOC) bloğu her başlığa `id="h-..."` atıyor —
// bazı yazılarda (ör. bir bölümün kopyala-yapıştır hatasıyla tekrarlanması)
// AYNI id birden fazla başlıkta tekrar ediyor (isten-cikis-yonetimi-metrikleri'nde
// bulundu) — geçersiz HTML (id benzersiz olmalı) + TOC linkinin YANLIŞ
// (ilk yerine son) başlığa atlamasına yol açabilir. İlk oluşum id'sini
// korur, sonrakilere `-2`/`-3` soneki ekler — TOC linkleri zaten İLK
// (asıl) başlığı hedeflediği için bu davranış doğru olanı korur.
function dedupeHeadingIds(html) {
  const seen = new Map();
  return html.replace(/(<h[1-6][^>]*\sid=")([^"]+)(")/gi, (match, pre, id, post) => {
    const count = (seen.get(id) ?? 0) + 1;
    seen.set(id, count);
    if (count === 1) return match;
    return `${pre}${id}-${count}${post}`;
  });
}

// idenfit.com'a giden mutlak bir href'i site-local relative path'e çevirir.
// Kaynak yazılarda görülen tüm biçimler: `/tr/` önekli (Polylang'ın
// varsayılan-dil öneki, bizim sitemizde TR prefix'siz) VEYA öneksiz, blog
// yazılarına (`/tr/blog/<slug>/`, bazen `#h-...`/`#:~:text=...` fragment'ıyla),
// ürün/modül sayfalarına, ana sayfaya (`/tr/`) ve "Online Sunum Talebi"
// CTA'sına (`online-sunum-talep-et`, bazen UTM query string'iyle) giden
// linkler. `resolveCtaUrl()`'deki (productContent.ts) DEMO_CTA_URL
// sentinel'iyle AYNI ilke: WP'nin ham slug'ı yerine bizim canonical
// slug'ımıza ('online-sunum-talebi') çevriliyor.
function toRelativePath(rawHref) {
  // 618 yazının tamamı işlenirken (FAZ B) bulundu: kaynakta bazı linkler
  // yanlışlıkla URL'nin SONUNA aynı URL'nin ikinci bir kopyasını
  // yapıştırılmış halde barındırıyor (`dijital-ik-donusumu-chro-oncelikleri`'nde
  // `.../calisan-performans-degerlendirme-sistemi-modulu/https://idenfit.com/tr/
  // calisan-performans-degerlendirme-sistemi-modulu/` — muhtemelen link
  // ekleme aracında bir kopyala-yapıştır hatası). SON (en son yapıştırılan)
  // URL asıl doğru/güncel hedef kabul edilip ondan öncesi atılıyor.
  const lastOccurrence = rawHref.lastIndexOf('https://idenfit.com');
  if (lastOccurrence > 0) rawHref = rawHref.slice(lastOccurrence);

  let rest = rawHref.slice('https://idenfit.com'.length);
  if (rest === '') return '/';
  if (rest.startsWith('/tr/')) rest = rest.slice(3);
  else if (rest === '/tr') return '/';

  const tailIndex = rest.search(/[?#]/);
  const hasTail = tailIndex !== -1;
  let path = hasTail ? rest.slice(0, tailIndex) : rest;
  const tail = hasTail ? rest.slice(tailIndex) : '';

  if (path === '') path = '/';
  else if (!path.endsWith('/')) path += '/';

  if (path === '/online-sunum-talep-et/') path = '/online-sunum-talebi/';

  return path + tail;
}

function resolveInternalLinks(html) {
  return html.replace(/href="(https:\/\/idenfit\.com[^"]*)"/g, (_, rawHref) => `href="${toRelativePath(rawHref)}"`);
}

// WP editörü zaman zaman tamamen boş `<p></p>` blokları bırakıyor (ör.
// `ihbar-suresi-nedir-nasil-hesaplanir`'de gövdenin İLK bloğu bu türdendi) —
// görsel olarak yalnızca gereksiz bir boşluk satırı bırakıyor, kaldırılıyor.
function stripEmptyParagraphs(html) {
  return html.replace(/<p[^>]*>(?:\s|&nbsp;)*<\/p>/gi, '');
}

// `stripDuplicateLeadingH1()` yalnızca gövdenin EN BAŞINDAKİ, başlıkla
// BİREBİR aynı metne sahip H1'i yakalıyor. FAZ B'nin 618 yazılık taramasında
// (`verify-blog-posts.mjs`) bulunan farklı bir örnek: `2026-sgk-tesvikleri-
// rehberi-neler-degisti` — yazar bir ARA BÖLÜM başlığı için (gövdenin
// ortasında, başlıktan FARKLI bir metinle) yanlışlıkla `<h1>` kullanmış.
// Bu, konumu/metni eşleşmediği için yukarıdaki fonksiyon tarafından
// yakalanmıyor ama sayfa şablonu zaten kendi TEK `<h1>`'ini bastığı için
// gövdede kalan HERHANGİ bir `<h1>` her zaman yanlıştır (birden fazla H1,
// geçersiz HTML semantiği) — kaldırmak yerine (bir bölüm başlığı olarak
// hâlâ anlamlı) `<h2>`'ye indirgeniyor.
function downgradeStrayH1sToH2(html) {
  return html
    .replace(/<h1(\s[^>]*)?>/gi, (_match, attrs = '') => `<h2${attrs ?? ''}>`)
    .replace(/<\/h1>/gi, '</h2>');
}

function cleanContent(rawHtml, title) {
  let html = stripDuplicateLeadingH1(rawHtml.trim(), title);
  html = downgradeStrayH1sToH2(html);
  html = stripEmptyParagraphs(html);
  html = dedupeHeadingIds(html);
  html = resolveInternalLinks(html);
  html = decodeTypographicEntities(html);
  html = html.replace(/\n{3,}/g, '\n\n').trim();
  return html;
}

// Yalnızca "boş değil" yeterli değil — bazı yazılarda ilk paragraf gerçek
// bir giriş cümlesi değil, bağlamsız kısa bir parça oluyor (ör.
// `insan-kaynaklarinin-dijital-donusumu-zirvesi-bursa`'da ilk paragraf
// yalnızca "Balkantürksiad'ın desteğiyle gerçekleştirilecektir." — 52
// karakter, önceki cümlenin öznesi eksik). Bu yüzden en az 100 karakterlik
// İLK paragraf aranıyor; hiçbiri bu eşiği geçmezse (nadiren) yine de en az
// boş olmayan ilk paragrafa düşülüyor (tamamen boş excerpt'ten iyidir).
const MIN_EXCERPT_SOURCE_LENGTH = 100;

function buildExcerpt(cleanedHtml) {
  const paragraphs = [...cleanedHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => stripTags(m[1]));
  const text = paragraphs.find((p) => p.length >= MIN_EXCERPT_SOURCE_LENGTH) ?? paragraphs.find((p) => p.length > 0) ?? '';
  if (text.length <= 160) return text;
  const truncated = text.slice(0, 160);
  return `${truncated.slice(0, truncated.lastIndexOf(' '))}…`;
}

// JSON-LD `BlogPosting.author` için (2026-08-24, "No author attribution"
// GEO bulgusu). Kaynağın `yoast_head_json.author`'ı 6 farklı yazar taşıyor
// ama 4'ü ya jenerik ("idenfit editör", 544 yazı) ya da WP kullanıcı adı
// formatında (`gozen.yesil`/`doruk.gulsever`/`furkan.ergelmis`, toplam 53
// yazı) — kullanıcı kararıyla bunlar için gerçek bir görünen ad UYDURULMUYOR,
// eşlemede yer almayan her yazar `[slug].astro`'daki `Organization`
// fallback'ine düşer. Yalnızca burada listelenen 2 yazarın (24+1 yazı) gerçek
// ad-soyadı var — büyük/küçük harf düzeltmesi dışında (kaynakta ikisi de
// tutarsız yazılmış) isim İCAT EDİLMEDİ.
const AUTHOR_DISPLAY_NAMES = {
  'neslihan gültekin': 'Neslihan Gültekin',
  'Aysegul Topcu': 'Ayşegül Topçu',
};

function resolveAuthorName(yoastAuthor) {
  return AUTHOR_DISPLAY_NAMES[yoastAuthor];
}

function resolveTerms(ids, termsById) {
  const seenNames = new Set();
  const resolved = [];
  for (const id of ids) {
    const term = termsById.get(id);
    if (!term) {
      console.error(`  ⚠ taksonomi id ${id} bulunamadı (kategori/tag önbelleği eksik olabilir)`);
      continue;
    }
    if (seenNames.has(term.name)) continue;
    seenNames.add(term.name);
    resolved.push({ id: term.id, slug: term.slug, name: term.name });
  }
  return resolved;
}

// WP, yükleyen kişi gerçek bir alt metin girmediğinde `alt_text`'i dosya
// adından OTOMATİK üretiyor (ör. `2026-memur-maaslari` yazısının görseli
// `Seffaf-maas-politikas─▒.jpg` — dosya adının KENDİSİ kaynakta bozuk
// encoding'li, canlı sunucuda GERÇEKTEN bu isimle duruyor/200 dönüyor,
// bu yüzden URL'e dokunulmadı — ama `alt_text` de aynı bozuk metni
// birebir taşıyor). Böyle bir alt metin hem anlamsız hem erişilebilirlik
// açısından zararlı — dosya adından türetildiği (normalize edilince
// eşleştiği) tespit edilirse, gerçek başlığa düşülüyor.
function looksAutoGeneratedFromFilename(altText, sourceUrl) {
  const filename = sourceUrl.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') ?? '';
  const normalize = (s) => s.toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  return normalize(altText) === normalize(filename);
}

function resolveFeaturedImage(mediaId, fallbackAlt) {
  const item = mediaById.get(mediaId);
  if (!item) return null;
  const rawAlt = item.alt_text?.trim();
  const alt = rawAlt && !looksAutoGeneratedFromFilename(rawAlt, item.source_url) ? rawAlt : fallbackAlt;
  return {
    url: item.source_url,
    width: item.media_details?.width ?? 0,
    height: item.media_details?.height ?? 0,
    alt,
  };
}

// --- İşleme -----------------------------------------------------------------

mkdirSync(OUT_DIR, { recursive: true });
const existing = existsSync(OUT_FILE) ? JSON.parse(readFileSync(OUT_FILE, 'utf-8')) : [];
const byId = new Map(existing.map((p) => [p.id, p]));

let processed = 0;
let skipped = 0;
const isBulk = slugs.length > 20;

for (const slug of slugs) {
  const post = postsBySlug.get(slug);
  if (!post) {
    console.error(`❌ '${slug}' posts.json'da bulunamadı, atlandı.`);
    skipped++;
    continue;
  }
  if (post.status !== 'publish') {
    console.error(`❌ '${slug}' 'publish' durumunda değil (${post.status}), atlandı.`);
    skipped++;
    continue;
  }

  const title = stripTags(post.title.rendered);
  const content = cleanContent(post.content.rendered, title);

  byId.set(slug, {
    id: slug,
    slug,
    title,
    date: post.date,
    modifiedDate: post.modified,
    excerpt: buildExcerpt(content),
    featuredImage: resolveFeaturedImage(post.featured_media, title),
    categories: resolveTerms(post.categories, categoryById),
    tags: resolveTerms(post.tags, tagById),
    authorName: resolveAuthorName(post.yoast_head_json?.author),
    content,
  });

  processed++;
  // Toplu modda (FAZ B, 618 yazı) her birini tek tek loglamak yerine
  // ilerleme aralıklarla basılıyor — tek tek modda (pilot/ADIM 1) her
  // yazı ayrı ayrı gözden geçirilebilsin diye eskisi gibi tek tek basılıyor.
  if (isBulk) {
    if (processed % 50 === 0) console.log(`  ... ${processed}/${slugs.length}`);
  } else {
    console.log(`✅ ${slug}`);
  }
}

writeFileSync(OUT_FILE, JSON.stringify([...byId.values()], null, 2));
console.log(`\n${OUT_FILE} güncellendi — toplam ${byId.size} yazı (bu çalıştırmada ${processed} işlendi, ${skipped} atlandı).`);
