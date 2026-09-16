// GÜVENLİK (K4) — blog gövdesi için HTML allowlist şeması.
//
// KÖK NEDEN: Astro'nun markdown hattı `remarkRehype({allowDangerousHtml:true})`
// + `rehypeRaw` + `rehypeStringify({allowDangerousHtml:true})` zincirini
// kullanıyor (bkz. `node_modules/@astrojs/markdown-remark/dist/index.js`)
// — yani bir `.md` dosyasının GÖVDESİNE yazılan HAM HTML olduğu gibi
// render ediliyordu, hiçbir katmanda temizlenmeden. Blog içeriğini
// Keystatic panelinden pazarlama ekibi (ve panele erişimi olan herkes)
// yazdığı için bu, siteye kalıcı (stored) XSS yazabilen bir yoldu.
//
// Neden ciddi: enjekte edilen script bizim origin'imizde çalışıyor, yani
// aynı origin'in `localStorage`'ındaki Keystatic editör token'ını okuyup
// depoya commit atabilir → commit `master`'a düşer → Workers Builds
// otomatik deploy eder. Yani "blog yazısına script" = deploy zincirinin
// tamamına erişim. Bu yüzden allowlist DAR tutuldu.
//
// ŞEMA KARARI: `hast-util-sanitize`'ın `defaultSchema`'sı temel alındı
// (GitHub'ın kendi markdown allowlist'i) ve SİTEDE GERÇEKTEN KULLANILAN
// işaretleme eklendi — uydurma/ihtimalli bir liste DEĞİL, 629 yazının
// render çıktısı sanitize ÖNCESİ/SONRASI diff'lenerek doğrulandı:
//   • `iframe` — YouTube embed'leri + bir yazıdaki Google Forms embed'i.
//     `src` protokolü `https:` ile sınırlı; host kısıtı CSP'nin
//     `frame-src` direktifinde ZATEN var (iki katman: sanitizer neyin
//     yazılabileceğini, CSP neyin yüklenebileceğini sınırlar).
//   • `cite`/`sup` — GEO atıf işaretlemesi (19 yazı) + KPMG dipnotu;
//     `scripts/lib/html-to-markdown.mjs`'in `td.keep()` listesiyle aynı.
//   • `class`/`id`/`style` — WP'den göç eden gövdelerde yaygın; script
//     çalıştırmıyorlar.
// KASITLI OLARAK DIŞARIDA: `script`, `style` ELEMENTİ, `object`, `embed`,
// `form`, `input`, `link`, `meta`, `base` ve TÜM `on*` olay öznitelikleri
// (defaultSchema zaten hiçbirine izin vermiyor — burada eklenmedikleri
// için dışarıda kalıyorlar).
// `defaultSchema` doğrudan `rehype-sanitize`'tan — `hast-util-sanitize`
// yalnızca TRANSİTİF bir bağımlılık, doğrudan import etmek onu sessizce
// kırılabilir bir varsayım yapardı.
import { defaultSchema } from 'rehype-sanitize';

/** Ortak sunum öznitelikleri — hiçbiri kod çalıştırmıyor. */
const PRESENTATION_ATTRS = ['className', 'id', 'style', 'title', 'dir', 'lang'];

export const blogSanitizeSchema = {
  ...defaultSchema,
  // `defaultSchema` varsayılan olarak `id`/`name` değerlerinin başına
  // `user-content-` ekler (DOM clobbering koruması). Bu, mevcut yazılardaki
  // iç bağlantı çapalarını (`#...`) SESSİZCE kırardı — kapatıldı.
  clobberPrefix: '',
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'iframe',
    'cite',
    'sup',
    'sub',
    'figure',
    'figcaption',
    'picture',
    'source',
    'u',
    'small',
    'mark',
    'abbr',
    'time',
  ],
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), ...PRESENTATION_ATTRS],
    a: [
      ...(defaultSchema.attributes?.a ?? []),
      'target',
      'rel',
      'ariaLabel',
      // `contentLinkAccessibility.ts` render sırasında `aria-label` ekliyor;
      // hast özniteliği `ariaLabel` olarak adlandırılıyor, ham HTML'de
      // `aria-label` yazan yazılar için ikisi de listede.
      'aria-label',
    ],
    img: [...(defaultSchema.attributes?.img ?? []), 'loading', 'width', 'height', 'srcSet', 'sizes', 'decoding'],
    iframe: [
      'src',
      'width',
      'height',
      'title',
      'frameBorder',
      'allow',
      'allowFullScreen',
      'loading',
      'referrerPolicy',
      ...PRESENTATION_ATTRS,
    ],
    source: ['src', 'srcSet', 'type', 'media', 'sizes'],
    td: [...(defaultSchema.attributes?.td ?? []), 'colSpan', 'rowSpan'],
    th: [...(defaultSchema.attributes?.th ?? []), 'colSpan', 'rowSpan', 'scope'],
  },
  protocols: {
    ...defaultSchema.protocols,
    // `iframe src` YALNIZCA https — `javascript:`/`data:` bir iframe'de
    // doğrudan script çalıştırabilirdi.
    src: ['https'],
  },
};

/**
 * `<iframe src>` host allowlist'i — sanitizer'ın protokol kontrolünün
 * KAPATAMADIĞI boşluğu kapatır.
 *
 * BULGU (bu turda ampirik testle çıktı): `hast-util-sanitize`'ın
 * `protocols` kontrolü, URL'de ilk `:` bir `/`'tan SONRA geliyorsa değeri
 * "protokolsüz/göreli" sayıp GEÇİRİYOR. Yani `protocols: {src:['https']}`
 * ayarına rağmen **protokole-göreli** bir adres (`//evil.example/x`)
 * elenmiyor — tarayıcı bunu `https://evil.example/x` olarak çözüyor.
 * Sonuç: rastgele bir üçüncü tarafın sayfamız içinde iframe olarak
 * görünmesi (kimlik avı/clickjacking yüzeyi).
 *
 * Aynı adresler CSP'nin `frame-src` direktifinde ZATEN sınırlı — ama CSP
 * şu an Report-Only (bkz. `csp.ts`'teki `CSP_MODE`), yani bugün hiçbir
 * şeyi ENGELLEMİYOR. Bu yüzden ikinci ve bağımsız bir katman olarak host
 * kontrolü burada, üretim zamanında yapılıyor.
 *
 * Liste `PUBLIC_CSP`'nin `frame-src`'iyle KASITLI olarak aynı — biri
 * genişletilirse diğeri de gözden geçirilmeli.
 */
const ALLOWED_IFRAME_HOSTS = new Set([
  'www.youtube.com',
  'www.youtube-nocookie.com',
  'docs.google.com',
]);

/** @returns {boolean} */
function isAllowedIframeSrc(value) {
  if (typeof value !== 'string') return false;
  try {
    // Taban URL yalnızca göreli adresleri çözmek için; `//host/x` gibi
    // protokole-göreli adresler tabanın protokolünü (https) alır ve
    // GERÇEK host'u burada görünür olur.
    const url = new URL(value, 'https://idenfit.com/');
    return url.protocol === 'https:' && ALLOWED_IFRAME_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

/**
 * `rehypeSanitize`'TAN SONRA çalışan son süzgeç: host'u allowlist'te
 * olmayan her `<iframe>`'i ağaçtan tamamen çıkarır.
 */
export function rehypeRestrictIframeSrc() {
  /** @param {any} tree */
  return (tree) => {
    /** @param {any} node */
    const walk = (node) => {
      if (!node || !Array.isArray(node.children)) return;
      node.children = node.children.filter(
        (child) => !(child?.type === 'element' && child.tagName === 'iframe' && !isAllowedIframeSrc(child.properties?.src)),
      );
      for (const child of node.children) walk(child);
    };
    walk(tree);
  };
}
