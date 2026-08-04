// Blog listesi/tekil yazı sayfalarının paylaştığı yardımcılar — asıl veri
// `astro:content`'in `blog` collection'ından gelir (bkz. `src/content.config.ts`,
// `src/content/blog/posts.json`). Bu dosya yalnızca sıralama/sayfalama/tarih
// biçimlendirme gibi sayfa-tipinden bağımsız mantığı tutar; projenin geri
// kalanındaki `get*Content()` dosyalarıyla aynı "veri katmanı" ilkesi.
import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

/** Sayfa başına yazı sayısı (kullanıcı talebi: 12). */
export const BLOG_PAGE_SIZE = 12;

/** Tüm yazılar, en yeniden en eskiye sıralı. */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export interface PaginatedResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export function paginate<T>(items: T[], page: number, pageSize = BLOG_PAGE_SIZE): PaginatedResult<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    currentPage,
    totalPages,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
  };
}

export type PaginationItem = number | 'dots';

/**
 * Numaralı sayfalama için gösterilecek sayfa/`dots` dizisi — idenfit.com'un
 * canlı `/blog/page/N/` sayfalarının kendi `paginate_links()` çıktısıyla
 * (WordPress varsayılanı: `end_size=1, mid_size=2`) BİREBİR aynı algoritma
 * (2026-07-24, canlı HTML karşılaştırılarak doğrulandı — sayfa 1: `1 2 3 …
 * 52`, sayfa 5: `1 … 3 4 5 6 7 … 52`). Her zaman ilk/son sayfa + aktif
 * sayfanın ±2 komşusu gösterilir, aradaki boşluk `'dots'` ile kısaltılır.
 */
export function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  const endSize = 1;
  const midSize = 2;
  const items: PaginationItem[] = [];
  let pendingDots = false;
  for (let n = 1; n <= totalPages; n++) {
    const isEnd = n <= endSize || n > totalPages - endSize;
    const isMid = n >= currentPage - midSize && n <= currentPage + midSize;
    if (isEnd || isMid) {
      items.push(n);
      pendingDots = true;
    } else if (pendingDots) {
      items.push('dots');
      pendingDots = false;
    }
  }
  return items;
}

/** "11 Temmuz 2026" gibi TR tarih biçimi. */
export function formatBlogDate(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

/**
 * Bir yazıyla aynı kategorilerden en az birini paylaşan, kendisi hariç en
 * güncel N yazı. "Benzer Yazılar" bölümünde kullanılır (idenfit.com'daki
 * gerçek başlık da bu — bkz. CLAUDE.md).
 */
export function getRelatedPosts(allPosts: BlogPost[], current: BlogPost, limit = 3): BlogPost[] {
  const currentCategorySlugs = new Set(current.data.categories.map((c) => c.slug));
  return allPosts
    .filter((p) => p.id !== current.id && p.data.categories.some((c) => currentCategorySlugs.has(c.slug)))
    .slice(0, limit);
}

/**
 * Ortalama 200 kelime/dakika okuma hızı varsayımıyla tahmini okuma süresi
 * (dakika, en az 1). idenfit.com'un kendi teması farklı bir formül kullanıyor
 * (o sayfada "8 dakikalık okuma" gösteriyordu) ama Yoast'ın SEO meta'sındaki
 * "Tahmini okuma süresi" alanı AYNI yazı için "6 dakika" diyordu — bu da
 * tam olarak 200 kelime/dakika ile eşleşiyor (kullanıcının istediği varsayım).
 */
export function estimateReadingMinutes(html: string): number {
  const wordCount = html
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * idenfit.com'un blog sayfalarındaki sağ sidebar'ın "Popüler İçerikler"
 * bölümüyle aynı — canlı sitede bu da gerçek bir popülerlik metriği DEĞİL,
 * WP'nin "Son Yazılar" (Latest Posts) bloğu: sitedeki en son yayınlanan N
 * yazı, güncel sayfadan/kategoriden bağımsız (görüntülenen yazının kendisi
 * bile listede çıkabiliyor — canlı sitede doğrulandı, kasıtlı olarak
 * filtrelenmedi, kaynağa sadakat).
 */
export function getPopularPosts(allPosts: BlogPost[], limit = 5): BlogPost[] {
  return allPosts.slice(0, limit);
}

/**
 * idenfit.com'un sidebar'ındaki "Yaklaşan Etkinlikler" bölümü — `yaklasan-
 * etkinlikler` kategorisindeki TÜM yazılar (canlı sitede 3 yazının 3'ü de
 * gösteriliyordu, 5'e kırpılmıyordu — bkz. CLAUDE.md). Kategori boşsa
 * (henüz hiç yaklaşan etkinlikler yazısı işlenmediyse) boş dizi döner,
 * sidebar bölümü hiç render edilmez.
 */
export function getUpcomingEventPosts(allPosts: BlogPost[]): BlogPost[] {
  return allPosts.filter((p) => p.data.categories.some((c) => c.slug === 'yaklasan-etkinlikler'));
}
