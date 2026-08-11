// Legacy blog içeriğindeki (WP HTML, `posts.json`) erişilebilir adı olmayan
// `<a>` linklerini render-time'da otomatik düzeltir (2026-08-10, kullanıcı
// talimatıyla — bkz. CLAUDE.md, erişilebilirlik denetimi turu).
//
// KÖK NEDEN: kaynak WordPress içeriğinde (bizim migrasyon hatamız DEĞİL —
// `scripts/check-link-accessibility.mjs` ile tüm site tarandığında site
// bileşenlerinin (Footer/FloatingContactButtons/MegaMenu) TAMAMEN temiz
// çıktığı doğrulandı) bazı görsel-CTA linkleri `<a href="..."><img alt=""
// ...></a>` şeklinde — resmin `alt` metni WP'nin kendisi tarafından boş
// bırakılmış, link için hiçbir erişilebilir ad kalmıyor. Bazı dış linkler
// de (muhtemelen bir HTML→metin dönüşüm/temizleme adımında) tamamen boş
// kalmış (`<a href="https://...">​</a>`).
//
// STRATEJİ (öncelik sırasıyla):
// 1. Aynı `<figure>` içinde bir `<figcaption>` varsa (WP'nin `wp-block-image`
//    kalıbı — görsel-CTA'ların neredeyse tamamı bu kalıbı kullanıyor,
//    doğrulandı) onun metni `aria-label` olarak kullanılır — kaynağın
//    KENDİ yazdığı, o linke en yakın bağlamsal metin.
// 2. Yoksa, `href`'ten türetilen bir etiket kullanılır: idenfit.com içi
//    bir yola gidiyorsa slug'dan okunur bir başlık üretilir (ör.
//    `/pdks-modulu/` → "Pdks Modulu sayfası" — Türkçe aksan işaretleri
//    slug'da zaten yok, tam imla garanti EDİLMİYOR ama ekran okuyucu için
//    anlaşılır kalıyor); dış bir siteye gidiyorsa hostname kullanılır
//    (ör. "Dış kaynak: connecteam.com").
// 3. `href` YOKSA (tamamen boş `<a></a>`, hiçbir gerçek işlevi yok) —
//    sahte bir etiket UYDURMAK yerine anchor UNWRAP edilir (etiket
//    kaldırılır, olası çocukları yerinde bırakılır) — hedefsiz bir linke
//    "buraya git" demek yanlış/yanıltıcı olurdu.
//
// Bu fonksiyon YALNIZCA erişilebilir adı OLMAYAN linklere dokunuyor —
// zaten metinli/etiketli linkler (ki blog içeriğindeki linklerin ezici
// çoğunluğu bu durumda) BİREBİR aynı kalıyor.
import { parseFragment, serialize } from 'parse5';

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

function humanizeSlugSegment(segment: string): string {
  return segment
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function deriveHrefLabel(href: string): string {
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
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length === 0) return 'idenfit ana sayfası';
  return `${humanizeSlugSegment(segments[segments.length - 1])} sayfası`;
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
 * Ham WP HTML içeriğindeki erişilebilir adı olmayan `<a>` linklerini
 * düzeltir (bkz. dosya başındaki strateji notu). Hiçbir değişiklik
 * gerekmiyorsa girdi string'i BİREBİR (yeniden serialize edilmeden)
 * döner — gereksiz whitespace/attribute-sırası farkları önlenir.
 */
export function fixLinkAccessibility(html: string): string {
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
      if (child.tagName === 'a' && !hasAccessibleName(child)) {
        const href = getAttr(child, 'href');
        if (!href) {
          toUnwrap.push(child);
        } else {
          const label = findClosestFigcaptionText(child, parentMap) ?? deriveHrefLabel(href);
          toLabel.push({ node: child, label });
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
