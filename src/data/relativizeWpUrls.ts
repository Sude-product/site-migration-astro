// Açık nokta #45, yol (B) — `reference/wordpress-export/*.json`'dan
// RUNTIME'da okunan `image.url`/`images[].url`/`backgroundImage`/
// `heroImage`/`officesImage`/`mapImage` gibi alanlar LİTERAL string
// DEĞİL, `b.image` gibi pass-through okunuyor (yol (A)'nın bul-değiştir
// yöntemiyle düzeltilemez, bkz. CLAUDE.md Açık nokta #45). Bu alanların
// TAMAMINI tek tek avlamak yerine (5 dosyada onlarca farklı okuma
// noktası, birini kaçırma riski yüksek), ham JSON `DATA` sabiti
// OLUŞTURULDUĞU ANDA (her `*Content.ts`'in kendi `import ... from
// '../../reference/wordpress-export/*.json'` satırının hemen ardından)
// TEK bir derin-gezinme ile TÜM string alanlar denetleniyor — hangi
// alanda olursa olsun (zengin metin/HTML içine gömülü bir `<img
// src="https://idenfit.com/...">` dahil) mutlak `idenfit.com/wp-content/`
// öneki varsa göreliye çevriliyor. Böylece her `*Content.ts`'teki TÜM
// getter fonksiyonu (mevcut VE ileride eklenecek olanlar) otomatik
// olarak zaten-göreli veri okur — okuma noktası bazında ayrı ayrı
// düzeltme GEREKMEZ.
//
// `blog`'un `date`/`modifiedDate` normalizasyonuyla (`content.config.ts`,
// naive tarih string'ine `+03:00` ekleme) AYNI ilke: kaynak veri ithal
// edilir edilmez, tek merkezi bir yerde normalize edilir.
const ABS_WP_PREFIX_RE = /https:\/\/idenfit\.com\/wp-content\//g;

export function deepRelativizeWpUrls<T>(value: T): T {
  if (typeof value === 'string') {
    return (value.includes('idenfit.com/wp-content/') ? value.replace(ABS_WP_PREFIX_RE, '/wp-content/') : value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((v) => deepRelativizeWpUrls(v)) as T;
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = deepRelativizeWpUrls(v);
    }
    return out as T;
  }
  return value;
}
