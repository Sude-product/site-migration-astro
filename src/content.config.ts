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
import { fixLinkAccessibility } from './data/contentLinkAccessibility';
import { demoteBodyH1s, normalizeHeadingLevels } from './data/blogHeadingSanitizer';

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

// **KALICI GOTCHA (2026-08-28) — naive (saat dilimsiz) tarih string'leri
// MAKİNEDEN BAĞIMSIZ hale getiriliyor.** Kaynak WP'nin `date`/`modified`
// alanı saat dilimi damgası TAŞIMIYOR ("naive", ör. `'2024-10-02T09:30:00'`).
// Node'un `new Date(naiveString)`'i (z.coerce.date()'in altında çağırdığı)
// bu tür string'leri ÇALIŞTIĞI MAKİNENİN sistem saat dilimine göre
// yorumluyor — yerel geliştirme (Türkiye, UTC+3) ile Cloudflare Pages/
// Workers build ortamı (Cloudflare'in resmi topluluğunda doğrulandı: HER
// ZAMAN UTC, sabit) arasında SESSİZ bir 3 saatlik kaymaya yol açıyordu.
// Bu, JSON-LD `datePublished`/`dateModified`, OG `article:published_time`/
// `modified_time` ve görünür `<time datetime>`'a DOĞRUDAN yansıyor (bkz.
// `[slug].astro`, hepsi `date.toISOString()` çağırıyor) — SEO/GEO'ya giden
// gerçek bir doğruluk riski. Ampirik olarak doğrulandı: WP'nin ham
// `posts.json`'ındaki `date`/`date_gmt` çifti karşılaştırıldığında 622
// yazının 562'si (%90) tam 3 saatlik Türkiye-ofseti deseni gösteriyor
// (`date_gmt` = `date` - 3sa) — kaynak veri GERÇEKTEN Türkiye yerel
// saatini taşıyor, tahmin değil.
//
// **Çözüm:** `date`/`modifiedDate` alanına ulaşan naive (Z/ofset damgası
// TAŞIMAYAN) her string'e açıkça `+03:00` (Türkiye, 2016'dan beri DST
// kullanmıyor — sabit UTC+3, bu veri setindeki TÜM tarihler zaten 2016
// sonrası) eklenip Date'e ÖYLE çevriliyor — bir ofset/"Z" damgası
// EKLENMİŞ string'in `new Date()` yorumu ECMAScript spesifikasyonu
// gereği SİSTEM SAAT DİLİMİNDEN TAMAMEN BAĞIMSIZDIR, bu yüzden bu normalize
// adımından SONRA hangi makinede/hangi TZ ortam değişkeniyle çalışılırsa
// çalışılsın AYNI mutlak UTC anını üretir (yerel Europe/Istanbul VE
// `TZ=UTC` zorlanmış ortamda `astro build` ile çapraz doğrulandı).
// Zaten bir "Z"/ofset damgası TAŞIYAN string'lere (Keystatic panelinin
// kendi `fields.datetime`'ının SAVE'de her zaman yazdığı biçim)
// DOKUNULMUYOR.
//
// **BİLİNÇLİ OLARAK KAPSAM DIŞI (Açık nokta #42/#43, ayrı bir turda ele
// alınacak):** 622 yazının **60'ında (%9.6)** `date` ile `date_gmt`
// HAM VERİDE BİREBİR AYNI (ör. `calisan-performans-iyilestirme-plani-
// nasil-hazirlanir`, `date_gmt` hiç 3 saat çıkarılmamış) — bu 60 yazı
// için ham veri GERÇEKTEN Türkiye yerel saati mi yoksa zaten UTC mi
// belirsiz (WP kaynağının kendi tutarsızlığı, muhtemelen API/programatik
// oluşturma sırasında `date_gmt` hiç hesaplanmadan `date`'in birebir
// kopyalanması). Bu normalize adımı BU 60 YAZIYA DA aynı +03:00'ü
// uyguluyor — bu 60 için YANLIŞ olabilir ama şema seviyesinde hangi
// kaydın "anomali" olduğunu ayırt etmenin bir yolu yok (yalnızca tek bir
// naive string görüyor, `date_gmt`'e erişimi yok). Aynı sebeple
// products/sectors/pricing/hardware/misc-pages'in KENDİ "Son Güncelleme"
// sistemleri (`new Date(raw)`, `productContent.ts` vb.) de BİLİNÇLİ
// OLARAK bu turda DOKUNULMADI — Keystatic bunlara hiç dokunmuyor (aktif
// bozulma riski yok) ve `_gmt` karşılığı extraction script'lerinde hiç
// saklanmadığı için +03:00'ün doğru olup olmadığı KANITLANAMIYOR (en
// yakın kıyaslanabilir kaynak `pages.json`'da `date`=`date_gmt` HER ZAMAN
// aynı — bu grubun muhtemelen zaten UTC-eşdeğeri olduğuna işaret ediyor).
const TURKEY_OFFSET = '+03:00';
const HAS_TZ_DESIGNATOR_RE = /[Zz]$|[+-]\d{2}:?\d{2}$/;
function normalizeNaiveDateToTurkeyOffset(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  return HAS_TZ_DESIGNATOR_RE.test(value) ? value : `${value}${TURKEY_OFFSET}`;
}

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
  date: z.preprocess(normalizeNaiveDateToTurkeyOffset, z.coerce.date()),
  // JSON-LD `BlogPosting.dateModified` için (2026-08-10, structured data
  // turu) — legacy yazılarda WP'nin gerçek `modified` alanından geliyor
  // (`extract-blog-posts.mjs`, bkz. §Proje kuralları "JSON-LD/dateModified
  // güncelleme kuralı"). Göç etmiş `.md` yazılarında (Decap CMS, henüz
  // düzenleme-tarihi takibi YOK) bu alan hiç yok — `.optional()`,
  // `[slug].astro` yoksa `date`'e (yayın tarihi) düşüyor ("hiç
  // düzenlenmemişse mantıklı bir varsayım", kullanıcı kararı 2026-08-10).
  modifiedDate: z.preprocess(normalizeNaiveDateToTurkeyOffset, z.coerce.date()).optional(),
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
  // JSON-LD `BlogPosting.author` için (2026-08-24, "No author attribution"
  // GEO bulgusu). Yalnızca kaynağın (WP `yoast_head_json.author`) GERÇEK bir
  // ad-soyad taşıdığı yazılarda dolu (bkz. `extract-blog-posts.mjs`
  // `AUTHOR_DISPLAY_NAMES`) — kullanıcı kararıyla WP kullanıcı adı formatındaki
  // (`gozen.yesil` gibi) ve jenerik "idenfit editör" yazılarda BOŞ bırakılıyor,
  // bunlar `[slug].astro`'da mevcut `Organization` fallback'ine düşüyor.
  // KASITLI OLARAK sayfada görünür bir "Yazar: X" satırı YOK — yalnızca
  // görünmez JSON-LD alanı (kullanıcı kararı, yazar ismi ekranda hiç
  // görünmesin).
  authorName: z.string().optional(),
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
    // `mutable-data-store.js`'in `store.set()`'i `filePath`'in site kökÜNE
    // GÖRELİ olmasını şart koşuyor (mutlak/`/`ile başlayan yol reddediliyor
    // — bkz. hata: "File path must be relative to the site root"). Önceki
    // `fileURLToPath(jsonUrl)` MUTLAK bir yol üretiyordu (ör.
    // `/home/user/idenfit.com/src/content/blog/posts.json`) — build'i
    // TAMAMEN kırıyordu (`dist/` hiç oluşmuyordu). `POSTS_JSON_PATH` zaten
    // göreli olduğu için doğrudan kullanılmalı.
    const filePath = POSTS_JSON_PATH;
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
      // `normalizeHeadingLevels()` (2026-08-17, "Heading hierarchy is not
      // sequential" SEO bulgusu — bkz. CLAUDE.md Açık nokta #33a) —
      // `demoteBodyH1s()`'TEN SONRA çalışmalı (gövdede artık gerçek `<h1>`
      // kalmamış olmalı, bkz. o fonksiyonun kendi yorumu).
      const rendered = await renderMarkdown(normalizeHeadingLevels(demoteBodyH1s(fixLinkAccessibility(content ?? ''))));
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
