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

// Başlık SEVİYE ATLAMASI normalize etme (2026-08-17, "Heading hierarchy is
// not sequential" SEO bulgusu — bkz. CLAUDE.md Açık nokta #33a). KÖK NEDEN
// `demoteBodyH1s()`'inkiyle AYNI aile (WordPress Gutenberg editöründe
// yazarlar ara başlıklar için rastgele/yanlış "Heading N" seviyesi
// seçmiş — H2'den doğrudan H4/H5/H6'ya atlamak gibi) ama FARKLI bir
// hata sınıfı: burada geçersiz bir etiket (H1 tekrarı) YOK, yalnızca
// seviyeler SIRALI DEĞİL (WCAG 1.3.1 ihlali — ekran okuyucu kullanıcıları
// için "H2'den sonra H4 geldi, aradaki H3 nerede?" kafa karışıklığı).
//
// GERÇEK ÖRNEK 1 — `puantaj-takibi` yazısı: `<h2>Excel Örnekleri</h2>`
// altında `<h4>Excel Puantaj Cetveli Yapımı</h4>` — gerçek, mantıklı bir
// alt-bölüm ama bir seviye derin yazılmış (H3 olmalıydı).
// GERÇEK ÖRNEK 2 — `kadinlar-gunu` röportaj yazısı: H1'in hemen altında
// ardışık 4 tane `<h6>` — bunlar gerçek alt-bölüm DEĞİL, yazarın röportaj
// SORULARINI küçük/kalın METİN STİLİ için başlık etiketiyle kötüye
// kullanması (Gutenberg'in "Heading 6" bloğu görsel olarak küçük/kalın
// render ediyor). Her yazıda "doğru" seviye farklı olduğu için EDİTORYAL
// bir karar yerine, MEKANİK/GÜVENLİ bir kural kullanılıyor: her başlık
// `min(ham_seviye, ebeveynin_yeni_seviyesi + 1)`'e normalize edilir
// (yığın/stack tabanlı) — bu kural:
// - MATEMATİKSEL OLARAK yeni bir atlama üretemez (her yeni seviye ebeveyn+1
//   ile sınırlı).
// - İçerik UYDURMAZ — yalnızca var olan başlık etiketlerini yeniden
//   numaralandırır, metin/sıra/iç içe geçme değişmez.
// - Zaten SIRALI olan belgelerde NO-OP'tur (mapped === raw her zaman) —
//   584/622 yazı (bu bulguda sorunlu olmayanlar) bu fonksiyondan HİÇ
//   etkilenmez, matematiksel olarak kanıtlanabilir (bkz. CLAUDE.md'deki
//   ispat notu).
// - AYNI ham seviyedeki KARDEŞ başlıklar (ör. kadinlar-gunu'nun 4 ardışık
//   H6'sı) yığının pop-to-same-raw mantığı sayesinde AYNI yeni seviyeye
//   düşer — artan bir "merdiven" oluşmaz (her biri H2, H3, H4... gibi
//   giderek derinleşmez, hepsi H2 kardeş kalır).
//
// `demoteBodyH1s()`'TEN SONRA çağrılmalı (bu fonksiyon çağrıldığında
// gövdede artık gerçek `<h1>` OLMAMALI) — aksi halde bir gövde-H1
// (ham seviye 1) kök sentinel'le (`{raw:1}`) çakışıp YİNE bir H1 üretirdi,
// `demoteBodyH1s()`'in çözdüğü sorunu geri getirirdi.
export function normalizeHeadingLevels(html: string): string {
  if (!html || !/<h[1-6][\s>]/i.test(html)) return html;
  // Kök: sayfanın kendi GERÇEK `<h1>`'i (yazı başlığı, `blog/[slug].astro`
  // basıyor) — bu fonksiyonun aldığı `html` parametresinde YOK, yalnızca
  // ilk gövde başlığının ebeveyni/bağlamı olarak temsil ediliyor.
  const stack: { raw: number; mapped: number }[] = [{ raw: 1, mapped: 1 }];
  return html.replace(/<h([1-6])((?:\s[^>]*)?)>([\s\S]*?)<\/h\1>/gi, (_match, rawLevelStr, attrs, inner) => {
    const raw = Number(rawLevelStr);
    while (stack.length > 1 && stack[stack.length - 1].raw >= raw) stack.pop();
    const mapped = stack[stack.length - 1].mapped + 1;
    stack.push({ raw, mapped });
    return `<h${mapped}${attrs ?? ''}>${inner}</h${mapped}>`;
  });
}
