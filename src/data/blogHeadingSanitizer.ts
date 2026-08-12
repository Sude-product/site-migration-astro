// Blog gövde içeriğindeki yanlış kullanılmış `<h1>` etiketlerini render-time'da
// otomatik `<h2>`'ye çevirir (2026-08-12, kullanıcı talimatıyla — SEO uyarısı:
// "2026-sgk-tesvikleri-rehberi-neler-degisti" yazısında 7 H1 bulundu).
//
// KÖK NEDEN: canlı idenfit.com'da doğrulandı (`idenfit.com/blog/2026-sgk-
// tesvikleri-rehberi-neler-degisti/`de gerçekten 7 `<h1>` var) — WordPress
// Gutenberg editöründe yazar bazı ara başlıklar için yanlışlıkla "Heading 1"
// blok stilini seçmiş (`wp-block-heading` class'ı H2/H3 ile birebir aynı,
// yalnızca etiket farklı). Sayfa şablonu (`src/pages/blog/[slug].astro`)
// zaten kendi TEK `<h1>`'ini (yazı başlığı) bastığı için gövdede kalan
// HERHANGİ bir `<h1>` her zaman geçersiz HTML semantiğidir (birden fazla
// H1, WCAG/SEO ihlali) — kaldırmak yerine (bir bölüm başlığı olarak hâlâ
// anlamlı) `<h2>`'ye indirgenir.
//
// SİTE GENELİ TARAMA (622 yazı, hem `reference/wordpress-export/posts.json`
// ham kaynağı hem çıkarılmış `src/content/blog/posts.json` + göç etmiş
// `.md` dosyaları): ham kaynakta yalnızca 2 yazı hiç `<h1>` içeriyordu
// (bu SGK yazısı, 6 adet; `yaz-aylarinda-yillik-izin-yogunlugunu-
// yonetmenin-yollari`, 1 adet) — ikisi de `scripts/extract-blog-posts.mjs`'in
// KENDİ `downgradeStrayH1sToH2()`'si sayesinde ÇIKARMA ANINDA zaten
// düzeltilmiş durumda (extraction script'in kendi yorumunda dokümante,
// bu SGK yazısı örnek olarak orada da anılıyor). Yani bu fonksiyon o
// düzeltmeyi TEKRARLAMIYOR — asıl kapattığı boşluk farklı:
//
// 1. `content.config.ts`'in legacy JSON yolu — `posts.json` elle
//    düzenlenirse veya extraction script'i atlanarak bir kayıt eklenirse
//    yine de güvenli (defense-in-depth, ikinci bir katman).
// 2. `content.config.ts`'in göç etmiş `.md` yazılar yolu (Decap CMS,
//    `glob()` loader) — extraction script'i BU dosyalar için HİÇ
//    ÇALIŞMIYOR (Markdown doğrudan editör tarafından yazılıyor/düzenleniyor,
//    Faz 2'de OAuth onayı sonrası pazarlama ekibi Decap panelinde bir
//    editör `# Başlık` yazarsa Markdown derleyicisi bunu `<h1>`'e çevirir)
//    — bu durum için extraction script'inin H1 koruması YOKTUR, tek
//    koruma katmanı budur.
export function demoteBodyH1s(html: string): string {
  if (!html || !/<h1[\s>]/i.test(html)) return html;
  return html.replace(/<h1(\s[^>]*)?>/gi, (_match, attrs = '') => `<h2${attrs ?? ''}>`).replace(/<\/h1>/gi, '</h2>');
}
