// TEK SEFERLİK düzeltme script'i — `migrate-blog-to-markdown.mjs`'in ilk
// pilot turunda (4 yazı) HTML→Markdown dönüşümü YAPILMADAN ham WP HTML'i
// doğrudan `.md` gövdesine yazılmıştı (bkz. CLAUDE.md göç günlüğü, Decap
// Rich Text editörünün bunu kod gibi gösterdiği bulgusu). Bu script o 4
// dosyanın (veya benzer şekilde etkilenmiş başka bir dosyanın) MEVCUT
// gövdesini ham HTML kabul edip `htmlToMarkdown()` ile yeniden işler,
// frontmatter'a dokunmaz.
//
// ⚠️ Bu script YALNIZCA `migrate-blog-to-markdown.mjs`'in düzeltmeden
// ÖNCEKİ haliyle üretilmiş (gövdesi hâlâ ham HTML olan) dosyalar için
// güvenlidir. Düzeltmeden SONRA göç eden yazılar zaten temiz Markdown
// içeriyor — bu script'i onlara çalıştırmak (gövde artık HTML olmadığı
// için) içeriği bozar. Kalıcı bir günlük iş akışı adımı DEĞİL.
//
// Kullanım: node scripts/reprocess-migrated-blog-html.mjs <slug1> [slug2 ...]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { htmlToMarkdown } from './lib/html-to-markdown.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const BLOG_DIR = path.join(ROOT, 'src/content/blog');

const slugs = process.argv.slice(2);
if (slugs.length === 0) {
  console.error('Kullanım: node scripts/reprocess-migrated-blog-html.mjs <slug1> [slug2 ...]');
  process.exit(1);
}

for (const slug of slugs) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!existsSync(filePath)) {
    console.warn(`Uyarı: ${slug}.md bulunamadı, atlandı.`);
    continue;
  }

  const raw = readFileSync(filePath, 'utf-8');
  const frontmatterMatch = raw.match(/^(---\n[\s\S]*?\n---\n\n)([\s\S]*)$/);
  if (!frontmatterMatch) {
    console.warn(`Uyarı: ${slug}.md'de frontmatter ayrıştırılamadı, atlandı.`);
    continue;
  }
  const [, frontmatterBlock, body] = frontmatterMatch;

  const markdownBody = htmlToMarkdown(body);
  writeFileSync(filePath, `${frontmatterBlock}${markdownBody}\n`, 'utf-8');
  console.log(`✓ ${slug}.md yeniden işlendi (HTML → Markdown)`);
}
