// Destek Talebi/Teşekkürler gibi elle transkribe edilen (script-tabanlı
// extraction'a girmemiş, kendi curated JSON grubu olmayan) sayfaların
// GERÇEK WP `modified` tarihini `pages.json`'daki (170+ sayfa, HAM WP
// export'u) bilinen id'sinden okur. "No visible content dates" GEO
// bulgusu (2026-08-17) — bkz. CLAUDE.md, `productContent.ts`'teki
// `getProductModifiedDate()` yorumu. Yalnızca GERÇEKTEN elimizde olan
// veri kullanılır, uydurma tarih YOK.
import pagesExport from '../../reference/wordpress-export/pages.json';

interface RawPage {
  id: number;
  modified: string;
}

const PAGES = pagesExport as unknown as RawPage[];

export function getPageModifiedDateById(id: number): Date | undefined {
  const raw = PAGES.find((p) => p.id === id)?.modified;
  return raw ? new Date(raw) : undefined;
}
