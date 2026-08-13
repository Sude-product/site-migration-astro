// Blog Content Collection tanımı.
//
// [2026-08-04] Decap CMS entegrasyonu için per-file Markdown'a KADEMELİ göç
// başladı (bkz. CLAUDE.md "Blog CMS Entegrasyonu"): pazarlama ekibinin tek
// tek yazı düzenleyebilmesi için Decap'in doğal çalıştığı biçim (her yazı
// kendi `.md` dosyası, `src/content/blog/<slug>.md`) gerekiyor — eski tek
// parça `posts.json` (622 yazı, ~6MB) bu modele uymuyordu. Göç TEK SEFERDE
// değil gruplar halinde yapılıyor, bu yüzden collection İKİ kaynağı BİR
// ARADA okumak zorunda: zaten göç etmiş `.md` dosyaları + henüz göç
// etmemiş `posts.json` kalıntısı. `legacyJsonLoader` bunu sağlıyor (altta).
import { defineCollection, z } from 'astro:content';
import { glob, type Loader } from 'astro/loaders';
import { existsSync, promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { fixLinkAccessibility } from './data/blogContentAccessibility';
import { demoteBodyH1s } from './data/blogHeadingSanitizer';

// Kaynağın 11 gerçek kategorisi (posts.json'daki 622 kaydın TAMAMI
// taranarak çıkarılan gerçek slug→isim eşlemesi, tahmin değil).
// `guncel-bilgiler`/`guncel-bilgiler-tr` aynı görünen ismi taşıyan 2 farklı
// WP kategori ID'si (kaynağın kendi hatası, bkz. CLAUDE.md) — slug bazında
// ayrı tutuluyor, isim çakışması sorun değil.
export const CATEGORY_LABELS: Record<string, string> = {
  'guncel-bilgiler': 'Güncel Bilgiler',
  'guncel-bilgiler-tr': 'Güncel Bilgiler',
  'ik-akademi': 'İK Akademi',
  'ik-trendleri': 'İK Trendleri',
  'dijital-ik': 'Dijital İK',
  'gecmis-etkinlikler': 'Geçmiş Etkinlikler',
  'ik-roportajlari': 'İK Röportajları',
  'yaklasan-etkinlikler': 'Yaklaşan Etkinlikler',
  'ogretici-bilgiler': 'Öğretici Bilgiler',
  'yenilikler-tr': 'Yenilikler',
  'uncategorized-tr': 'Uncategorized',
};

const blogSchema = z.object({
  slug: z.string(),
  title: z.string(),
  // `<title>` etiketi için isteğe bağlı, daha kısa bir alternatif
  // (2026-08-13, "H2 eksik" turlarının ardından ilk blog title-uzunluk
  // takip turu — bkz. CLAUDE.md Açık nokta #28). H1/JSON-LD `headline`
  // HER ZAMAN `title`'ın TAMAMINI kullanır (editoryal içerik DEĞİŞMEZ) —
  // yalnızca tarayıcı sekmesi/SERP'teki `<title>` etiketi, verilmişse bu
  // alanı kullanır. 622 yazının 435'i 50-60 karakter hedefinin dışında
  // (622 için TEK TEK dolduracak bir alan değil, kademeli/tek-tek takip
  // turlarında ihtiyaç oldukça eklenecek — bkz. `[slug].astro`).
  metaTitle: z.string().optional(),
  date: z.coerce.date(),
  // JSON-LD `BlogPosting.dateModified` için (2026-08-10, structured data
  // turu) — legacy yazılarda WP'nin gerçek `modified` alanından geliyor
  // (`extract-blog-posts.mjs`, bkz. §Proje kuralları "JSON-LD/dateModified
  // güncelleme kuralı"). Göç etmiş `.md` yazılarında (Decap CMS, henüz
  // düzenleme-tarihi takibi YOK) bu alan hiç yok — `.optional()`,
  // `[slug].astro` yoksa `date`'e (yayın tarihi) düşüyor ("hiç
  // düzenlenmemişse mantıklı bir varsayım", kullanıcı kararı 2026-08-10).
  modifiedDate: z.coerce.date().optional(),
  // WP'nin otomatik excerpt'i (başlığı tekrar eden, `[&hellip;]` ile
  // kesilen) kullanılmıyor — extraction script'i temizlenmiş gövdenin
  // ilk paragrafından kendi excerpt'ini üretiyor (bkz. `buildExcerpt()`).
  excerpt: z.string(),
  // Bazı yazılarda `featured_media` id'si `media.json`'da bulunamayabilir
  // (bkz. CLAUDE.md "617/618 geçerli featured_media") — nullable.
  // width/height artık OPSİYONEL — Decap'in image widget'ı editöre piksel
  // boyutu sordurmuyor (anlamsız bir form alanı olurdu); eski 622 yazı bu
  // değerleri WP'den taşıyor, yeni yazılarda görsel etiketi bu alanlar
  // olmadan render edilir (küçük bir CLS ödünü, otomatik boyut ölçümü
  // olmadan kabul edilebilir).
  featuredImage: z
    .object({
      url: z.string(),
      alt: z.string(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    // `.nullish()` (`.nullable()` DEĞİL) — Decap'in "object" widget'ı boş
    // bırakılırsa alanı frontmatter'dan tamamen ATLAR (null YAZMAZ), yani
    // hem `null` (legacy JSON'un her zaman yazdığı değer) hem `undefined`
    // (CMS'ten boş bırakılan yeni yazılar) kabul edilmeli.
    .nullish(),
  // Decap'te bir `select` (kategoriler, sabit 11 seçenek) ve `list`
  // (etiketler, serbest metin) widget'ı yalnızca DÜZ STRING dizisi
  // üretebilir — WP'den miras kalan `{id,slug,name}` şekli hem gereksiz
  // (`id` hiçbir yerde kullanılmıyor, grep ile doğrulandı) hem CMS
  // formuyla uyumsuzdu. `categories` ham veride slug dizisi olarak
  // tutulup burada `{slug,name}`'e dönüştürülüyor — `blogContent.ts`/
  // `[slug].astro`/`BlogListPage.astro`'daki `.slug`/`.name` kullanımı
  // DEĞİŞMEDEN çalışmaya devam ediyor.
  categories: z.array(z.string()).transform((slugs) => slugs.map((slug) => ({ slug, name: CATEGORY_LABELS[slug] ?? slug }))),
  tags: z.array(z.string()).default([]),
});

const BLOG_DIR = './src/content/blog';
const POSTS_JSON_PATH = 'src/content/blog/posts.json';

const mdLoader = glob({ pattern: '**/*.md', base: BLOG_DIR });

/**
 * `glob()` kendi senkronizasyonunu `store.clear()` ÇAĞIRMADAN yapıyor
 * (yalnızca kendi taradığı id'lerden "dokunulmamış" olanları siliyor —
 * bkz. `node_modules/astro/dist/content/loaders/glob.js`
 * `untouchedEntries` mekanizması). `file()` loader'ı ise TERSİNE her
 * senkronizasyonda `store.clear()` çağırıyor — yani glob+file'ı sırayla
 * çağırmak file'ın clear'ı glob'un entry'lerini SİLER. Bu yüzden burada
 * `file()` kullanılmıyor; `posts.json` elle, `store.clear()` OLMADAN,
 * glob'dan SONRA okunuyor (sıra önemli — glob önce çalışmalı, aksi halde
 * onun "dokunulmamış" temizliği bu adımda eklenen JSON entry'lerini de
 * silebilir).
 */
const legacyJsonLoader: Loader = {
  name: 'blog-legacy-json-loader',
  load: async (context) => {
    await mdLoader.load(context);

    const { config, store, parseData, renderMarkdown, logger } = context;

    const jsonUrl = new URL(POSTS_JSON_PATH, config.root);
    if (!existsSync(jsonUrl)) return;

    const raw: Array<Record<string, unknown>> = JSON.parse(await fs.readFile(jsonUrl, 'utf-8'));
    const filePath = fileURLToPath(jsonUrl);
    let loaded = 0;
    for (const item of raw) {
      const id = String(item.slug);
      // Zaten .md'ye göç etmiş bir yazının posts.json'daki eski kopyası —
      // yok say (göç script'i posts.json'dan da kaldırıyor, bu yalnızca
      // bir güvenlik ağı).
      if (store.get(id)) continue;

      // `modifiedDate` ARTIK atılmıyor (2026-08-10 öncesi burada
      // discard ediliyordu, bkz. git geçmişi) — JSON-LD `dateModified`
      // için gerekiyor, `rest`'e dahil kalıp şemaya geçiyor.
      const { content, categories, tags, id: _wpId, ...rest } = item as {
        content?: string;
        categories?: Array<{ slug: string }>;
        tags?: Array<{ slug: string }>;
        [key: string]: unknown;
      };
      const data = await parseData({
        id,
        data: {
          ...rest,
          categories: (categories ?? []).map((c) => c.slug),
          tags: (tags ?? []).map((t) => t.slug),
        },
        filePath,
      });
      // Legacy yazılar ham WP HTML'i taşıyor (markdown değil) — `render()`in
      // (astro:content) okuyabileceği aynı `RenderedContent` şeklini
      // üretmek için `context.renderMarkdown()` kullanılıyor. CommonMark
      // blok-seviyeli HTML'i (aralarında boş satır olan `<p>`/`<h2>`/`<ul>`
      // gibi etiketler) olduğu gibi geçirir, yani ham HTML pratikte
      // değişmeden `Content` component'ine ulaşıyor — gerçek bir yazıyla
      // `curl` diff'iyle doğrulandı (bkz. göç günlüğü).
      // `fixLinkAccessibility()` (2026-08-10) — kaynak WP içeriğinde
      // erişilebilir adı olmayan `<a>` linklerini (bkz. o dosyanın kendi
      // yorumu) `renderMarkdown()`'a ulaşmadan ÖNCE düzeltiyor; zaten
      // etiketli/metinli linklere DOKUNMUYOR. `demoteBodyH1s()` (2026-08-12)
      // — `extract-blog-posts.mjs`'in extraction-anındaki AYNI düzeltmesinin
      // render-time ikinci katmanı (bkz. o dosyanın kendi yorumu) —
      // `posts.json` elle düzenlenirse/extraction atlanırsa güvenlik ağı.
      const rendered = await renderMarkdown(demoteBodyH1s(fixLinkAccessibility(content ?? '')));
      store.set({ id, data, filePath, body: content, rendered });
      loaded++;
    }
    logger.info(`${loaded} yazı posts.json kalıntısından yüklendi (kademeli göç devam ediyor).`);
  },
};

const blog = defineCollection({
  loader: legacyJsonLoader,
  schema: blogSchema,
});

export const collections = { blog };
