/**
 * JSON-LD serileştirme — `<script type="application/ld+json">` için GÜVENLİ
 * çıktı üretir.
 *
 * NEDEN GEREKLİ: `JSON.stringify()` bir JSON dizesi üretir, ama HTML'in
 * `<script>` ELEMENTİ ham metin (raw text) bağlamıdır — tarayıcı içindeki
 * ilk `</script` dizisini gördüğü anda elementi KAPATIR, JSON söz dizimine
 * hiç bakmaz. Yani JSON-LD'ye giren herhangi bir alan (blog başlığı, SSS
 * sorusu, breadcrumb etiketi, meta description) `</script><script>...`
 * içeriyorsa, `JSON.stringify()` bunu OLDUĞU GİBİ basar ve script
 * elementinden ÇIKIP gerçek, çalışan bir script enjekte edilir.
 *
 * `set:html` bu bağlamda kaçışlama YAPMAZ (adı üstünde: ham HTML basar) —
 * yani Astro tarafında da bir koruma yok.
 *
 * Kaçışlanan karakterler:
 *  - `<` `>` → `<` `>`: `</script`, `<!--` ve `<script` dizilerini
 *    parçalar. JSON dize DEĞERİ olarak `<` ile `<` birebir aynı şeydir,
 *    yani `JSON.parse()` (ve Google'ın ayrıştırıcısı) AYNI metni görür —
 *    anlam hiç değişmez, yalnızca HTML ayrıştırıcısı artık tetiklenmez.
 *  - `&` → `&`: `&lt;script&gt;` gibi entity tabanlı varyantları kapatır.
 *  - U+2028 / U+2029 (satır/paragraf ayırıcı): JSON'da geçerli ama eski
 *    JS ayrıştırıcılarında satır sonu sayılır; kaçışlamak her zaman güvenli.
 *
 * KULLANIM: `<script type="application/ld+json">` içine giden HER
 * `JSON.stringify()` çağrısı bunun YERİNE `safeJsonLd()` kullanmalı.
 */
/**
 * `Organization` düğümünün KANONİK `@id`'si — PAYLAŞILAN tek kaynak
 * (2026-10-02, PR 3).
 *
 * `BaseLayout.astro` kuruluşu TANIMLIYOR (`@id` + name/logo/address/…),
 * `blog/[slug].astro` ise `BlogPosting.publisher`/`author` içinde ona
 * REFERANS veriyor. İki dosya aynı dizeyi ayrı ayrı üretirse bir gün
 * sessizce ayrışır ve referans boşa düşer (JSON-LD'de kırık bir `@id`
 * hata vermez — tüketici onu TANIMSIZ, apayrı bir düğüm sanar), bu
 * yüzden dize TEK yerde kuruluyor.
 *
 * `site` verilmezse `undefined` döner: mutlak bir kimlik üretilemez ve
 * göreli bir `@id` kimlik olarak işe yaramaz. Çağıranlar bu durumda
 * referans YERİNE kuruluşu satır içinde tanımlamaya geri dönmeli —
 * aksi halde hiçbir yerde tanımlanmayan bir düğüme atıf yapılmış olur.
 * (`astro.config.mjs`'in `site` alanı 2026-09-02'de dolduruldu, yani
 * pratikte bu dal yalnızca bir yapılandırma kazasında devreye girer.)
 */
export function organizationId(site: URL | undefined): string | undefined {
  return site ? `${site.href}#organization` : undefined;
}

export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
