// Blog Content Collection tanımı — `posts.json`'dan (WordPress export, 618
// yazı, tümü TR) `scripts/extract-blog-posts.mjs` ile işlenip
// `src/content/blog/posts.json`'a yazılan veriyi okur (bkz. o script'in
// başındaki not: TEK bir toplu script DEĞİL, slug bazlı, gözden geçirerek
// işleniyor — pilot yazıyla başlandı, bkz. CLAUDE.md "Blog migrasyonu").
//
// Projenin geri kalanındaki `get*Content()` + düz `.ts` deseninden FARKLI
// bir yaklaşım (Content Collections) — 618 kayıt ölçeğinde built-in
// şema doğrulama/tip güvenliği için bilinçli olarak seçildi.
import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const taxonomyTerm = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
});

const blog = defineCollection({
  loader: file('src/content/blog/posts.json'),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    date: z.coerce.date(),
    modifiedDate: z.coerce.date(),
    // WP'nin otomatik excerpt'i (başlığı tekrar eden, `[&hellip;]` ile
    // kesilen) kullanılmıyor — extraction script'i temizlenmiş gövdenin
    // ilk paragrafından kendi excerpt'ini üretiyor (bkz. `buildExcerpt()`).
    excerpt: z.string(),
    // Bazı yazılarda `featured_media` id'si `media.json`'da bulunamayabilir
    // (bkz. CLAUDE.md "617/618 geçerli featured_media") — nullable.
    featuredImage: z
      .object({
        url: z.string(),
        width: z.number(),
        height: z.number(),
        alt: z.string(),
      })
      .nullable(),
    categories: z.array(taxonomyTerm),
    tags: z.array(taxonomyTerm),
    // Temizlenmiş Gutenberg HTML'i — `set:html` ile render edilir (site
    // genelindeki `ProductBlock`/hero.text ile aynı desen).
    content: z.string(),
  }),
});

export const collections = { blog };
