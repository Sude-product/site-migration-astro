import { config, fields, collection } from '@keystatic/core';

// Kategoriler — kaynağın 11 gerçek WP kategorisinden (bkz.
// src/content.config.ts CATEGORY_LABELS) `guncel-bilgiler-tr` ve
// `uncategorized-tr` YENİ yazılarda seçenek olarak SUNULMUYOR — ikisi de
// WP'nin kendi kopya/kategorisiz artığı (bkz. o dosyanın kendi yorumu),
// aynı istisna zaten eski Decap config.yml'de de vardı (public/admin/config.yml).
const CATEGORY_OPTIONS = [
  { label: 'Güncel Bilgiler', value: 'guncel-bilgiler' },
  { label: 'İK Akademi', value: 'ik-akademi' },
  { label: 'İK Trendleri', value: 'ik-trendleri' },
  { label: 'Dijital İK', value: 'dijital-ik' },
  { label: 'Geçmiş Etkinlikler', value: 'gecmis-etkinlikler' },
  { label: 'İK Röportajları', value: 'ik-roportajlari' },
  { label: 'Yaklaşan Etkinlikler', value: 'yaklasan-etkinlikler' },
  { label: 'Öğretici Bilgiler', value: 'ogretici-bilgiler' },
  { label: 'Yenilikler', value: 'yenilikler-tr' },
] as const;

export default config({
  storage: { kind: 'cloud' },
  cloud: { project: 'idenfit/idenfit-astro' },
  collections: {
    blog: collection({
      label: 'Blog Yazıları',
      slugField: 'slug',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      previewUrl: '/blog/{slug}/',
      schema: {
        // `slug` her zaman URL/dosya adının kaynağı — routing bu alana
        // dayanıyor (bkz. src/pages/blog/[slug].astro `post.data.slug`),
        // dosya adına DEĞİL. Editör buraya doğrudan lowercase-tire slug'ı
        // yazar (Decap'teki elle "Slug (URL)" alanının aynısı, yalnızca
        // Keystatic'in doğrulama+otomatik-öneri widget'ıyla).
        slug: fields.slug({
          name: {
            label: 'Slug (URL)',
            description: 'Yazının adres çubuğunda görüneceği kısım, örn. yaz-tatili-izin-yonetimi',
            validation: {
              isRequired: true,
              pattern: {
                regex: /^[a-z0-9-]+$/,
                message: 'Yalnızca küçük harf, rakam ve tire kullanılabilir',
              },
            },
          },
        }),
        title: fields.text({
          label: 'Başlık',
          validation: { isRequired: true },
        }),
        // Opsiyonel — bkz. src/content.config.ts metaTitle yorumu (50-60
        // karakter hedefi, kademeli/isteğe bağlı bir SEO ayarı).
        metaTitle: fields.text({
          label: 'Meta Title (opsiyonel)',
          description: '<title> etiketi için daha kısa bir alternatif — boş bırakılırsa Başlık kullanılır. Hedef: 50-60 karakter.',
        }),
        date: fields.datetime({
          label: 'Yayın Tarihi',
          validation: { isRequired: true },
        }),
        // Opsiyonel — bkz. src/content.config.ts modifiedDate yorumu
        // (JSON-LD dateModified, editör elle güncellemezse date'e düşer).
        modifiedDate: fields.datetime({
          label: 'Son Güncelleme Tarihi (opsiyonel)',
          description: 'İçerik önemli ölçüde güncellendiğinde doldurulmalı (bkz. CLAUDE.md "dateModified güncelleme kuralı").',
        }),
        excerpt: fields.text({
          label: 'Özet (Excerpt)',
          multiline: true,
          validation: { isRequired: true },
          description: 'Blog listesinde ve arama sonuçlarında görünür, 1-2 cümle yeterli.',
        }),
        // width/height editöre vurgulu SUNULMUYOR (Decap'teki emsalle AYNI
        // karar, bkz. src/content.config.ts featuredImage yorumu) ama
        // ŞEMADAN da çıkarılamaz — eski 629 yazının WP'den miras kalan
        // `featuredImage.width/height` alanları Keystatic'in objectfield'ı
        // STRICT olduğu için (bilinmeyen anahtar reddediliyor) şemada
        // bulunmalı, yalnızca opsiyonel bırakılıyor.
        //
        // **2026-09-06 — `url: fields.url()` (elle URL yapıştırma) yerine
        // `image: fields.image()` (self-hosted sürükle-bırak yükleme,
        // Cloud Images ücretli olduğu için — bkz. CLAUDE.md Açık nokta
        // #68) getirildi.** Kritik bulgu: Keystatic'in asset alanları
        // (`fields.image()`) her zaman `directory`/`publicPath`'i
        // ENTRY'NİN KENDİ `slug` alanıyla otomatik ad alanına ayırıyor
        // (`getSrcPrefix()`, node_modules'ta doğrulandı) — yani panelde
        // GÖRÜNTÜLENEBİLMESİ/yeniden kaydedilebilmesi için her görsel
        // fiilen `public/img/blog-featured/<slug>/<dosya>` yolunda
        // BULUNMALI. **`directory` kısa tutuldu VE migrasyonda dosya adı
        // sabit `featured.<uzantı>`'ya normalize edildi** (orijinal WP
        // dosya adı DEĞİL) — bazı slug'lar 89 karaktere kadar çıkıyor,
        // orijinal WP dosya adlarıyla (bazıları da 90+ karakter) birleşince
        // Windows'un 260 karakterlik MAX_PATH sınırını aşıp `git add`'i
        // "Filename too long" ile çökertiyordu (canlı olarak yakalandı).
        // Mevcut 628 yazının görseli (629'un 1'i `featuredImage: null`)
        // `scripts/migrate-featured-image-to-keystatic-field.mjs` ile bu
        // yapıya KOPYALANDI (eski `public/wp-content/uploads/...`
        // dosyaları SİLİNMEDİ, yalnızca kopyalandı — geri dönüş her zaman
        // mümkün) ve frontmatter'daki `url:` alanı `image:` alanına
        // (yeni yola işaret edecek şekilde) çevrildi. Bu artık `fields.
        // conditional` denemesindeki (2026-08-28) `{discriminant,value}`
        // sorununu da ORTADAN KALDIRIYOR — `fields.image()` DOĞRUDAN
        // `null` yazabiliyor (asset alanları bunun için özel olarak
        // nullable), görselsiz tek yazının (`featuredImage: null`)
        // SAVE'de bozulma riski yok.
        featuredImage: fields.object(
          {
            image: fields.image({
              label: 'Görsel',
              directory: 'public/img/blog-featured',
              publicPath: '/img/blog-featured/',
            }),
            alt: fields.text({ label: 'Alt Metin (görme engelliler ve SEO için)' }),
            width: fields.integer({ label: 'Genişlik (px, opsiyonel — genelde boş bırakılır)' }),
            height: fields.integer({ label: 'Yükseklik (px, opsiyonel — genelde boş bırakılır)' }),
          },
          { label: 'Öne Çıkan Görsel' }
        ),
        categories: fields.multiselect({
          label: 'Kategoriler',
          options: CATEGORY_OPTIONS,
        }),
        tags: fields.array(
          fields.text({ label: 'Etiket' }),
          {
            label: 'Etiketler',
            itemLabel: (props) => props.value || 'Etiket',
          }
        ),
        // Opsiyonel, görünmez JSON-LD alanı — bkz. src/content.config.ts
        // authorName yorumu (sayfada görünür bir "Yazar: X" satırı YOK,
        // kullanıcı kararı).
        authorName: fields.text({ label: 'Yazar (opsiyonel, yalnızca JSON-LD için — sayfada görünmez)' }),
        // `options.image` (2026-09-06) — varsayılan olarak KAPALI olan
        // markdoc gövde-içi görsel yükleme desteği açıldı (editördeki
        // "görsel ekle" ikonu artık gerçek sürükle-bırak/dosya-seç
        // yükleme yapıyor, `featuredImage.image` ile AYNI slug-bazlı ad
        // alanı mekanizmasını kullanıyor ama ayrı bir dizinde — ikisi
        // karışmasın). Mevcut yazıların gövdesindeki eski
        // `![alt](/wp-content/uploads/...)` referansları BU turda migrate
        // EDİLMEDİ (kapsam yalnızca yeni yükleme desteği eklemekti) —
        // onlar zaten göreli URL'ler olarak (Açık nokta #14/#45) çalışmaya
        // devam ediyor, yalnızca YENİ eklenen görseller bu mekanizmayı
        // kullanacak.
        content: fields.markdoc({
          label: 'İçerik',
          extension: 'md',
          options: {
            image: {
              directory: 'public/img/blog-content',
              publicPath: '/img/blog-content/',
            },
          },
        }),
      },
    }),
  },
});
