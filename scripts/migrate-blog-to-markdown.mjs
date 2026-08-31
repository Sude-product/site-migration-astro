// Blog CMS entegrasyonu (Decap CMS) için kademeli göç script'i — bkz.
// CLAUDE.md "Blog CMS Entegrasyonu". `src/content/blog/posts.json`'daki
// belirtilen slug'ları `src/content/blog/<slug>.md` dosyalarına taşır
// (YAML frontmatter + ham WP HTML gövdesi) ve posts.json'dan kaldırır.
//
// TOPLU DEĞİL — `extract-blog-posts.mjs` ile aynı ilke: slug bazlı,
// gözden geçirerek, gruplar halinde. Her çalıştırmadan sonra `astro build`
// + regresyon testleriyle doğrulanmalı (bkz. content.config.ts'teki
// `legacyJsonLoader` — göç etmemiş yazılar posts.json'da kalıp aynı
// collection'da render edilmeye devam eder).
//
// Kullanım: node scripts/migrate-blog-to-markdown.mjs <slug1> [slug2 ...]
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { dump } from 'js-yaml';
import { htmlToMarkdown } from './lib/html-to-markdown.mjs';
import { fixLinkAccessibility } from '../src/data/contentLinkAccessibility.ts';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const POSTS_JSON = path.join(ROOT, 'src/content/blog/posts.json');
const BLOG_DIR = path.join(ROOT, 'src/content/blog');

const slugs = process.argv.slice(2);
if (slugs.length === 0) {
  console.error('Kullanım: node scripts/migrate-blog-to-markdown.mjs <slug1> [slug2 ...]');
  process.exit(1);
}

const posts = JSON.parse(readFileSync(POSTS_JSON, 'utf-8'));
const wantedSlugs = new Set(slugs);
const remaining = [];
const notFound = new Set(slugs);
let migrated = 0;

for (const post of posts) {
  if (!wantedSlugs.has(post.slug)) {
    remaining.push(post);
    continue;
  }
  notFound.delete(post.slug);

  const frontmatter = {
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage
      ? {
          url: post.featuredImage.url,
          alt: post.featuredImage.alt,
          width: post.featuredImage.width,
          height: post.featuredImage.height,
        }
      : null,
    categories: post.categories.map((c) => c.slug),
    tags: post.tags.map((t) => t.slug),
  };
  // `content.config.ts`'in zod şemasındaki opsiyonel alanlar — yalnızca
  // kaynakta gerçekten varsa yazılıyor (yoksa frontmatter'da hiç
  // görünmemeli, `undefined` yazılıp js-yaml'e güvenilmiyor).
  if (post.metaTitle) frontmatter.metaTitle = post.metaTitle;
  if (post.modifiedDate) frontmatter.modifiedDate = post.modifiedDate;
  if (post.authorName) frontmatter.authorName = post.authorName;

  const yamlText = dump(frontmatter, { lineWidth: -1 });
  // `post.content` posts.json'da ham WP/Gutenberg HTML'i olarak duruyor —
  // Decap'in Rich Text editörü gerçek Markdown bekliyor, ham HTML'i
  // (`<p class="wp-block-paragraph">` vb.) olduğu gibi yazarsak editörde
  // kod gibi görünüyor (bkz. CLAUDE.md göç günlüğü). `htmlToMarkdown()`
  // ile temiz Markdown'a çevriliyor.
  // `fixLinkAccessibility()` — `content.config.ts`'in `legacyJsonLoader`'ının
  // JSON'da kalan yazılara render-time'da uyguladığı AYNI erişilebilirlik
  // düzeltmesi (boş `<a></a>`/jenerik "buradan" linkleri). Göç etmiş `.md`
  // yazıları o render yolundan GEÇMEZ (Astro'nun kendi glob() loader'ı
  // kullanılır) — bu yüzden düzeltme burada, dönüşümden ÖNCE, kalıcı
  // olarak markdown kaynağına gömülüyor (aksi halde migrasyon anında
  // sessizce kaybolurdu, bkz. göç günlüğü).
  const markdownBody = htmlToMarkdown(fixLinkAccessibility(post.content));
  const fileContent = `---\n${yamlText}---\n\n${markdownBody}\n`;
  writeFileSync(path.join(BLOG_DIR, `${post.slug}.md`), fileContent, 'utf-8');
  migrated++;
  console.log(`✓ ${post.slug}.md yazıldı`);
}

if (notFound.size > 0) {
  console.warn(`Uyarı: posts.json'da bulunamayan slug(lar): ${[...notFound].join(', ')}`);
}
if (migrated === 0) {
  console.error('Hiçbir eşleşen slug bulunamadı, posts.json değiştirilmedi.');
  process.exit(1);
}

writeFileSync(POSTS_JSON, `${JSON.stringify(remaining, null, 2)}\n`, 'utf-8');
console.log(`${migrated} yazı göç etti, ${remaining.length} yazı posts.json'da kaldı.`);
