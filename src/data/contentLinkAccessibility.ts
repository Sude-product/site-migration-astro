// Ham WP HTML içeriğindeki (blog `posts.json` VE hukuki sayfa ailesinin
// `content_block`'u — bkz. `content.config.ts`/`LegalPage.astro`) erişilebilir
// adı olmayan/jenerik `<a>` linklerini render-time'da otomatik düzeltir
// (2026-08-10 — kullanıcı talimatıyla, CLAUDE.md'deki erişilebilirlik
// denetimi turu; 2026-08-19'da "Links without descriptive text" turunda
// hukuki sayfaları da kapsayacak şekilde genişletildi + dosya adı
// `blogContentAccessibility.ts`'ten `contentLinkAccessibility.ts`'e
// değiştirildi — artık blog'a özgü değil).
//
// KÖK NEDEN (2 AYRI alt sınıf, ikisi de bizim migrasyon hatamız DEĞİL —
// `scripts/check-link-accessibility.mjs` ile tüm site tarandığında site
// bileşenlerinin [Footer/FloatingContactButtons/MegaMenu] TAMAMEN temiz
// çıktığı doğrulandı):
// (a) ERİŞİLEBİLİR ADI HİÇ YOK — bazı görsel-CTA linkleri `<a href="...">
//     <img alt="" ...></a>` şeklinde (resmin `alt`'ı WP'nin kendisi
//     tarafından boş bırakılmış) veya tamamen boş (`<a href="...">​</a>`,
//     muhtemelen bir HTML→metin temizleme adımından kalma).
// (b) ERİŞİLEBİLİR ADI VAR AMA JENERİK/AÇIKLAYICI-DEĞİL — eski WP
//     yazarlarının editoryal alışkanlığı: "...blog yazımıza **buradan**
//     ulaşabilirsiniz" gibi cümlelerde link metni yalnızca "buradan"/
//     "buraya"/"tıklayın" (2026-08-19'da bulundu, bkz. CLAUDE.md — 622
//     yazının en az 8'inde + 3 hukuki sayfada [KVKK ailesi PDF linki]
//     doğrulandı). Ekran okuyucu kullanıcısı bu linki sayfa içi bağlamdan
//     KOPARIP bir link listesi olarak dinlerse ("buradan, buradan,
//     buraya, ...") hangi linkin nereye gittiğini ayırt edemez.
//
// STRATEJİ (öncelik sırasıyla, HER İKİ alt sınıf için de aynı):
// 1. `manualLabels` (çağıran taraftan verilen, href'e göre TAM eşleşen
//    elle yazılmış etiketler) — yalnızca slug-türetiminin doğal
//    okunmayacağı BİLİNEN durumlar için (ör. bir PDF dosya adı gibi
//    insan tarafından yazılmamış bir slug).
// 2. Aynı `<figure>` içinde bir `<figcaption>` varsa (WP'nin
//    `wp-block-image` kalıbı — görsel-CTA'ların neredeyse tamamı bu
//    kalıbı kullanıyor, doğrulandı) onun metni `aria-label` olarak
//    kullanılır — kaynağın KENDİ yazdığı, o linke en yakın bağlamsal metin.
// 3. Hedef idenfit.com içi bir blog yazısı/sayfa ise, `posts.json`/
//    `pages.json`'daki GERÇEK (Türkçe aksan işaretli) başlık kullanılır
//    (2026-08-19 eklendi — ilk pilot turunda slug-humanization'ın "Isten
//    Cikis Kodu Nedir" gibi aksansız/"makine çevirisi" hissi veren
//    etiketler ürettiği görüldü, kullanıcı "doğal okunmalı" dedi). Bu ham
//    export dosyaları zaten projede başka veri katmanlarınca (`pricingContent.ts`
//    vb.) doğrudan JSON import'uyla okunuyor — YENİ bir bağımlılık/network
//    çağrısı YOK.
// 4. Ne figcaption ne başlık eşleşmesi varsa, `href`'ten türetilen bir
//    etiket kullanılır: idenfit.com içi bilinmeyen bir yola gidiyorsa
//    slug'dan okunur bir başlık üretilir (ör. `/pdks-modulu/` → "Pdks
//    Modulu sayfası" — Türkçe aksan işaretleri slug'da zaten yok, tam
//    imla garanti EDİLMİYOR ama ekran okuyucu için anlaşılır kalıyor);
//    dış bir siteye gidiyorsa hostname kullanılır (ör. "Dış kaynak:
//    connecteam.com").
// 5. `href` YOKSA (tamamen boş `<a></a>`, hiçbir gerçek işlevi yok) —
//    sahte bir etiket UYDURMAK yerine anchor UNWRAP edilir (etiket
//    kaldırılır, olası çocukları yerinde bırakılır) — hedefsiz bir linke
//    "buraya git" demek yanlış/yanıltıcı olurdu. Bu yalnızca (a) alt
//    sınıfında olur — (b)'de href ZATEN var, metin sorunlu.
//
// (b) alt sınıfında GÖRÜNÜR METİN HİÇ DEĞİŞTİRİLMİYOR — yalnızca
// `aria-label` ekleniyor (kullanıcının "görsel olarak hiçbir şeyi
// etkilememeli" kısıtlaması). Yayınlanmış editoryal cümle olduğu gibi
// kalıyor, ekran okuyucu/SEO tarayıcısı için ek bir bağlam katmanı
// eklenmiş oluyor.
import { parseFragment, serialize } from 'parse5';
import postsExport from '../../reference/wordpress-export/posts.json';
import pagesExport from '../../reference/wordpress-export/pages.json';

// `posts.json`/`pages.json`'ın WP `title.rendered` alanı bazen numerik/
// named HTML entity taşıyor (`&#8217;` = kesme işareti gibi) — `faqContent.ts`'in
// AYNI `decodeEntities()`'i (kısa olduğu için kasıtlı, dokümante bir tekrar,
// bkz. o dosyadaki yorum — iki farklı veri katmanını TEK bir paylaşılan
// fonksiyona indirmek gereksiz bir bağımlılık yaratırdı).
function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function barePathOf(link: string): string | undefined {
  try {
    return new URL(link).pathname;
  } catch {
    return undefined;
  }
}

// Blog yazısı başlıkları (TR-only, `posts.json`'ın kendisi zaten TR-only —
// bkz. CLAUDE.md §Mimari "Blog dil stratejisi").
const BLOG_TITLE_BY_PATH = new Map<string, string>(
  (postsExport as Array<{ link: string; title: { rendered: string } }>)
    .map((p) => {
      const path = barePathOf(p.link);
      return path ? ([path, decodeEntities(p.title.rendered)] as const) : undefined;
    })
    .filter((x): x is readonly [string, string] => x !== undefined),
);

// Sayfa başlıkları, dile göre ayrı harita (2026-08-19'da eklenen bu
// mekanizma hukuki sayfa ailesi [Kategori B] üzerinden EN/IT içeriğe de
// uygulanabildiği için — yanlış dilde bir başlık enjekte etmemek adına
// `deriveHrefLabel()`'e `locale` parametresiyle geçiriliyor).
const PAGE_TITLE_BY_PATH_AND_LOCALE = new Map<string, Map<string, string>>();
for (const p of pagesExport as Array<{ link: string; title: { rendered: string }; pll_language?: string }>) {
  const path = barePathOf(p.link);
  const lang = p.pll_language;
  if (!path || !lang) continue;
  if (!PAGE_TITLE_BY_PATH_AND_LOCALE.has(lang)) PAGE_TITLE_BY_PATH_AND_LOCALE.set(lang, new Map());
  PAGE_TITLE_BY_PATH_AND_LOCALE.get(lang)!.set(path, decodeEntities(p.title.rendered));
}

// parse5'in kendi TS tipleri karmaşık generic'ler kullanıyor (tree adapter
// map'e bağlı) — burada yalnızca ihtiyaç duyulan minimal alanlarla (attrs/
// childNodes/tagName/nodeName/value) çalışılıyor, tam tip güvenliği yerine
// bilinçli olarak `any` tercih edildi (parse5'in kendi iç ağaç yapısını
// yeniden modellemek gereksiz karmaşıklık katardı).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyNode = any;

function getAttr(node: AnyNode, name: string): string | undefined {
  return node.attrs?.find((a: { name: string; value: string }) => a.name === name)?.value;
}

function setAttr(node: AnyNode, name: string, value: string): void {
  const existing = node.attrs?.find((a: { name: string; value: string }) => a.name === name);
  if (existing) existing.value = value;
  else node.attrs.push({ name, value });
}

function collectText(node: AnyNode, out: string[]): void {
  if (node.nodeName === '#text') {
    out.push(node.value);
    return;
  }
  if (node.tagName === 'script' || node.tagName === 'style') return;
  for (const child of node.childNodes ?? []) collectText(child, out);
}

function textOf(node: AnyNode): string {
  const out: string[] = [];
  collectText(node, out);
  return out.join('').replace(/\s+/g, ' ').trim();
}

// `check-link-accessibility.mjs`'teki AYNI erişilebilir-ad kontrolü —
// tek kaynak olması için o script bu mantığı ayrı tutuyor (biri build
// çıktısını statik tarıyor, diğeri ham içerik string'i üzerinde çalışıyor,
// ikisini TEK bir paylaşılan fonksiyona indirmek iki farklı çalışma zamanı
// (Astro content loader vs bağımsız Node script) arasında gereksiz bir
// bağımlılık yaratırdı — mantık kısa olduğu için kasıtlı, dokümante bir
// tekrar).
function hasAccessibleDescendant(node: AnyNode): boolean {
  let found = false;
  function walk(n: AnyNode) {
    if (found) return;
    if (n.tagName === 'img' && (getAttr(n, 'alt') ?? '').trim() !== '') {
      found = true;
      return;
    }
    if (n.tagName === 'svg') {
      for (const c of n.childNodes ?? []) {
        if (c.tagName === 'title' && textOf(c) !== '') {
          found = true;
          return;
        }
      }
    }
    for (const c of n.childNodes ?? []) walk(c);
  }
  walk(node);
  return found;
}

function hasAccessibleName(anchor: AnyNode): boolean {
  const ariaLabel = (getAttr(anchor, 'aria-label') ?? '').trim();
  const ariaLabelledby = (getAttr(anchor, 'aria-labelledby') ?? '').trim();
  return ariaLabel !== '' || ariaLabelledby !== '' || textOf(anchor) !== '' || hasAccessibleDescendant(anchor);
}

// Eski WP yazarlarının bağlam-bağımlı ("...yazımıza **buradan**
// ulaşabilirsiniz") CTA kalıbı — TAM eşleşme (kısmi/içerir DEĞİL), aksi
// halde gerçekten açıklayıcı ama tesadüfen bu kelimelerden birini içeren
// bir link metni (ör. "Buradan Anadolu'ya" gibi bir başlık) yanlışlıkla
// eşleşirdi. Küçük harfe çevirirken `toLocaleLowerCase('tr')` kullanılıyor
// (bkz. `AppTile`'ın "LATER IS NEVER" dersi — CSS/JS'in Türkçe locale'de
// "İ"/"I" harflerini yanlış çevirmesiyle AYNI kalıcı ders, burada JS
// tarafında tekrar etmemesi için).
const GENERIC_LINK_TEXTS = new Set([
  'buradan',
  'buraya',
  'burada',
  'tıkla',
  'tıklayın',
  'tıklayınız',
  'buradan tıklayın',
  'buraya tıklayın',
  'devamını oku',
  'devamını okuyun',
  'here',
  'click here',
  'qui',
  'clicca qui',
]);
function isGenericLinkText(text: string): boolean {
  return GENERIC_LINK_TEXTS.has(text.toLocaleLowerCase('tr'));
}

// Alt çizgi de tire gibi kelime ayıracı sayılıyor (2026-08-19 eklendi) —
// dosya adlarında (`Veri_Sahibi_Basvuru_Formu` gibi) tire yerine alt
// çizgi kullanılıyor, önceki sürüm bunu TEK bir kelime olarak bırakıp
// okunmaz bir etiket üretiyordu.
function humanizeSlugSegment(segment: string): string {
  return segment
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Bilinen belge uzantıları (2026-08-19 eklendi) — bir link bir sayfaya
// değil indirilebilir bir DOSYAYA gidiyorsa "... sayfası" yanlış/yanıltıcı
// olur (ör. bir PDF için "Veri Sahibi Basvuru Formu V2 sayfası" DEĞİL,
// "... (PDF)" doğru). `v2`/sürüm numaraları ve dil kodu eki (`-EN`) zaten
// `humanizeSlugSegment()`'in tire/alt-çizgi bölmesiyle ayrı kelime olarak
// çıkıyor, ekstra bir temizlik GEREKMİYOR.
const DOCUMENT_EXTENSIONS: Record<string, string> = {
  pdf: 'PDF',
  doc: 'Word belgesi',
  docx: 'Word belgesi',
  xls: 'Excel dosyası',
  xlsx: 'Excel dosyası',
};

// Locale'e göre "yazı"/"sayfa" kelimesinin doğru dilde karşılığı — yalnızca
// GERÇEK başlık bulunduğunda (adım 3) kullanılıyor, slug-türetiminde
// (adım 4) HER ZAMAN Türkçe "sayfası" kalıyor (o zaten yalnızca TR blog
// içeriği için devreye giriyor, bkz. dosya başı strateji notu).
const ARTICLE_SUFFIX_BY_LOCALE: Record<string, string> = {
  tr: 'yazısı',
  en: 'article',
  nl: 'artikel',
  it: 'articolo',
};
const PAGE_SUFFIX_BY_LOCALE: Record<string, string> = {
  tr: 'sayfası',
  en: 'page',
  nl: 'pagina',
  it: 'pagina',
};

function deriveHrefLabel(href: string, locale: string): string {
  let url: URL;
  try {
    url = new URL(href, 'https://idenfit.com');
  } catch {
    return 'Bağlantı';
  }
  const isInternal = url.hostname === 'idenfit.com' || url.hostname === 'www.idenfit.com';
  if (!isInternal) {
    return `Dış kaynak: ${url.hostname.replace(/^www\./, '')}`;
  }
  const blogTitle = BLOG_TITLE_BY_PATH.get(url.pathname);
  if (blogTitle) return `${blogTitle} ${ARTICLE_SUFFIX_BY_LOCALE[locale] ?? ARTICLE_SUFFIX_BY_LOCALE.tr}`;
  const pageTitle = PAGE_TITLE_BY_PATH_AND_LOCALE.get(locale)?.get(url.pathname);
  if (pageTitle) return `${pageTitle} ${PAGE_SUFFIX_BY_LOCALE[locale] ?? PAGE_SUFFIX_BY_LOCALE.tr}`;
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length === 0) return 'idenfit ana sayfası';
  const lastSegment = segments[segments.length - 1];
  const extMatch = /\.([a-z0-9]+)$/i.exec(lastSegment);
  const ext = extMatch?.[1]?.toLowerCase();
  if (ext && DOCUMENT_EXTENSIONS[ext]) {
    const nameWithoutExt = lastSegment.slice(0, -(ext.length + 1));
    return `${humanizeSlugSegment(nameWithoutExt)} (${DOCUMENT_EXTENSIONS[ext]})`;
  }
  return `${humanizeSlugSegment(lastSegment)} sayfası`;
}

function findClosestFigcaptionText(anchor: AnyNode, parentMap: Map<AnyNode, AnyNode>): string | undefined {
  let current = parentMap.get(anchor);
  while (current) {
    if (current.tagName === 'figure') {
      let captionText: string | undefined;
      const search = (n: AnyNode) => {
        if (captionText) return;
        if (n.tagName === 'figcaption') {
          const t = textOf(n);
          if (t) captionText = t;
          return;
        }
        for (const c of n.childNodes ?? []) search(c);
      };
      search(current);
      if (captionText) return captionText;
    }
    current = parentMap.get(current);
  }
  return undefined;
}

/**
 * Ham WP HTML içeriğindeki erişilebilir adı olmayan VEYA metni jenerik
 * ("buradan"/"buraya"/"tıklayın" vb.) `<a>` linklerini düzeltir (bkz.
 * dosya başındaki strateji notu). Hiçbir değişiklik gerekmiyorsa girdi
 * string'i BİREBİR (yeniden serialize edilmeden) döner — gereksiz
 * whitespace/attribute-sırası farkları önlenir.
 *
 * @param manualLabels href'e göre TAM eşleşen, elle yazılmış etiketler —
 *   yalnızca slug-türetiminin doğal okunmayacağı BİLİNEN durumlar için
 *   (ör. KVKK PDF linki, bkz. `miscPagesContent.ts`). Verilmezse yalnızca
 *   otomatik türetme (figcaption/slug) kullanılır.
 */
export function fixLinkAccessibility(html: string, manualLabels?: Record<string, string>, locale = 'tr'): string {
  if (!html || !html.includes('<a')) return html;

  const fragment = parseFragment(html);

  const parentMap = new Map<AnyNode, AnyNode>();
  const buildParentMap = (node: AnyNode) => {
    for (const c of node.childNodes ?? []) {
      parentMap.set(c, node);
      buildParentMap(c);
    }
  };
  buildParentMap(fragment);

  const toLabel: Array<{ node: AnyNode; label: string }> = [];
  const toUnwrap: AnyNode[] = [];

  const walk = (node: AnyNode) => {
    for (const child of node.childNodes ?? []) {
      if (child.tagName === 'a') {
        const hasName = hasAccessibleName(child);
        const ariaLabel = (getAttr(child, 'aria-label') ?? '').trim();
        const ariaLabelledby = (getAttr(child, 'aria-labelledby') ?? '').trim();
        // Zaten AÇIKÇA etiketlenmiş bir link (aria-label/aria-labelledby
        // elle verilmiş) dokunulmadan bırakılıyor — yalnızca görünür
        // metnin KENDİSİ jenerikse (ve başka bir etiket YOKSA) devreye
        // giriyoruz, elle verilmiş bilinçli bir etiketin üzerine YAZILMAZ.
        const isUnlabeledGeneric =
          hasName && ariaLabel === '' && ariaLabelledby === '' && isGenericLinkText(textOf(child));
        if (!hasName || isUnlabeledGeneric) {
          const href = getAttr(child, 'href');
          if (!href) {
            if (!hasName) toUnwrap.push(child);
          } else {
            const label =
              manualLabels?.[href] ?? findClosestFigcaptionText(child, parentMap) ?? deriveHrefLabel(href, locale);
            toLabel.push({ node: child, label });
          }
        }
      }
      walk(child);
    }
  };
  walk(fragment);

  if (toLabel.length === 0 && toUnwrap.length === 0) return html;

  for (const { node, label } of toLabel) setAttr(node, 'aria-label', label);
  for (const node of toUnwrap) {
    const parent = parentMap.get(node);
    if (!parent) continue;
    const idx = parent.childNodes.indexOf(node);
    if (idx !== -1) parent.childNodes.splice(idx, 1, ...(node.childNodes ?? []));
  }

  return serialize(fragment);
}
