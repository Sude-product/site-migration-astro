// Blog RSS feed'i (2026-09-07, denetim bulgusu SEO-20/B10 — sitede hiç feed
// yoktu, eski WordPress'in `/feed/` adresi 404 dönüyordu).
//
// NEDEN ELLE YAZILDI: `@astrojs/rss` paketi yalnızca bu tek dosya için yeni
// bir bağımlılık ekleyecekti. Feed'in ihtiyacı olan her şey (XML kaçışlama +
// RFC-822 tarih) 30 satırda karşılanıyor, bu yüzden bağımlılık eklenmedi
// (projenin `npm audit` disiplini: her yeni paket kalıcı bir yüzey).
//
// NEDEN ÖNEMLİ: Bing, haber/içerik toplayıcıları ve bazı AI ingest hatları
// feed okuyor. Blog'un tarama derinliği ayrıca çok kötü (629 yazının 582'si
// ana sayfadan 4+ tık uzakta) — feed, yeni içeriğin keşfi için sayfalama
// zincirinden BAĞIMSIZ ikinci bir yol açıyor.
//
// KAPSAM: son 50 yazı. Feed bir arşiv değil "ne yeni?" kanalı; 629 yazının
// tamamını basmak dosyayı megabaytlara çıkarır ve okuyucuya fayda sağlamaz.
// Tam arşiv zaten sitemap'te (933 URL, artık `lastmod`'lu).
import type { APIContext } from 'astro';
import { getAllBlogPosts } from '../data/blogContent';

export const prerender = true;

const FEED_SIZE = 50;

/** XML metin düğümü/öznitelik kaçışlaması — CDATA yerine açık kaçışlama
 *  tercih edildi: içerikte `]]>` geçmesi ihtimaline karşı daha güvenli. */
const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export async function GET({ site }: APIContext) {
  // `site` tanımsızsa mutlak URL üretilemez — feed spesifikasyonu mutlak
  // <link> zorunlu kılıyor, uydurma bir domain yazmaktansa 404 dönmek doğru.
  if (!site) return new Response('site yapılandırılmamış', { status: 404 });

  const posts = (await getAllBlogPosts()).slice(0, FEED_SIZE);
  const abs = (path: string) => new URL(path, site).href;
  const now = new Date();

  const items = posts
    .map((post) => {
      const url = abs(`/blog/${post.data.slug}/`);
      return `    <item>
      <title>${esc(post.data.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
      <description>${esc(post.data.excerpt)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>idenfit Blog</title>
    <link>${esc(abs('/blog/'))}</link>
    <description>İnsan kaynakları yönetimi, dijitalleşme ve çalışan deneyimi üzerine idenfit'in blog yazıları.</description>
    <language>tr</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <atom:link href="${esc(abs('/rss.xml'))}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
