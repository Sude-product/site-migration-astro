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

/**
 * `style` DEĞER allowlist'i. Önceden `style` sınırsız serbestti; bu,
 * script çalıştırmasa da gerçek bir yetenek veriyordu: bir yazar
 * `position:fixed;inset:0;z-index:...` ile TÜM sayfayı kaplayıp header'ı
 * (ve "Giriş Yap" linkini) sahte içerikle örtebilir, ya da görünmez bir
 * tam-ekran `<a>` ile her tıklamayı kaçırabilirdi (clickjacking/kimlik avı).
 *
 * İzin verilen 4 özellik ölçülerek seçildi, tahminle değil:
 *  • `width`/`height` — 633 yazının TAMAMINDA geçen TEK style kullanımı
 *    (6 benzersiz değer, hepsi `width:NNNpx;height:NNNpx`);
 *  • `background-color`/`color` — shiki'nin kod bloklarına yazdığı
 *    `<pre style="background-color:#...;color:#...">` içindir. Bugün hiçbir
 *    yazıda kod bloğu YOK (0/633) ama shiki bu hattan ÖNCE çalışıyor, yani
 *    ileride eklenecek bir kod bloğu aksi halde stilsiz kalırdı.
 * Konumlandırma/katman/dönüşüm (`position`/`inset`/`z-index`/`transform`/
 * `opacity`/`pointer-events`) ve `url(...)` (`:` ve `/` karakter sınıfında
 * YOK) bilinçli olarak dışarıda.
 */
const SAFE_STYLE = /^(?:\s*(?:width|height|background-color|color)\s*:\s*[#\w.,%\s-]+;?\s*)+$/i;

/**
 * `class` DEĞER allowlist'i. Gerekçe `style` ile AYNI — Tailwind sınıfları
 * derlenmiş CSS'te mevcut olduğu için `class="fixed inset-0 z-50 bg-white"`
 * da `style` ile birebir aynı kaplama etkisini veriyordu; yalnızca `style`'ı
 * kısıtlamak hiçbir şey çözmezdi.
 * Korpusta geçen TEK desen `wp-image-NNNN` / `alignnone wp-image-NNNN`
 * (28 kullanım); geri kalanı shiki (`astro-code`/`github-*`/`line`) ve
 * GFM görev listeleri için.
 */
const SAFE_CLASS = /^(?:wp-[\w-]+|align(?:none|left|right|center)|astro-code|github-(?:dark|light)|line|contains-task-list|task-list-item)$/;

/** `rel` DEĞER allowlist'i — `rel="opener"` + `target="_blank"` saldırgan
 * sayfaya `window.opener` verip sekmemizi başka bir adrese yönlendirmesine
 * izin veriyordu (ters tabnabbing). Korpusta geçen tek değer
 * `noreferrer noopener`. */
const SAFE_REL = ['noopener', 'noreferrer', 'nofollow', 'sponsored', 'ugc', 'me'];

/** Ortak sunum öznitelikleri — hiçbiri kod çalıştırmıyor. */
const PRESENTATION_ATTRS = [['className', SAFE_CLASS], 'id', ['style', SAFE_STYLE], 'title', 'dir', 'lang'];

export const blogSanitizeSchema = {
  ...defaultSchema,
  // NOT: `clobberPrefix` BİLİNÇLİ olarak override EDİLMİYOR —
  // `defaultSchema`'nın `user-content-` öneki (DOM clobbering koruması)
  // AYNEN geçerli. Bir önceki turda "mevcut yazılardaki `#...` çapalarını
  // kırar" gerekçesiyle kapatılmıştı; bu VARSAYIM ÖLÇÜLDÜ ve YANLIŞ çıktı:
  // 633 yazının tamamında ham `id=` sayısı 0, ham `name=` sayısı 0. Sayfa
  // içi çapalar markdown `](#...)` linkleri ve hedefleri Astro'nun
  // `rehypeHeadingIds`'inin ürettiği id'ler — o eklenti bu sanitizer'dan
  // SONRA çalışıyor, yani önek onlara hiç dokunmuyor. Koruma bedava.
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
      ['rel', ...SAFE_REL],
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
// NOT: `www.youtube-nocookie.com` bir önceki turda buraya eklenmişti ama
// `csp.ts`'in `frame-src`'inde YOK — yani "liste CSP ile birebir aynı"
// yorumu gerçeği yansıtmıyordu ve CSP enforcing'e geçtiği gün bu host'tan
// gelen embed'ler SESSİZCE kırılacaktı. Korpusta hiç kullanılmadığı
// doğrulandı (0/633), bu yüzden listeden çıkarıldı — iki liste artık
// gerçekten aynı. Nocookie embed'i istenirse İKİSİNE BİRDEN eklenmeli.
const ALLOWED_IFRAME_HOSTS = new Set(['www.youtube.com', 'docs.google.com']);

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
