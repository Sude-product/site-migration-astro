// Görsel `alt` metni onarımı (2026-09-07, denetim bulgusu SEO-23).
//
// Ham WordPress verisinde `alt` çoğu zaman DOSYA ADINDAN türetilmiş:
// "1@2x 3", "5@2x", "time attendance system1@2x 1" gibi. Ekran okuyucu için
// anlamsız, görsel araması için değersiz. Denetimde 121 benzersiz böyle metin
// / 442 geçiş ölçüldü. `scripts/check-image-alt-text.mjs` bunları YAKALAMIYOR:
// yalnızca `alt` özniteliğinin VARLIĞINI kontrol ediyor, kalitesini değil.
//
// Düzeltme uydurma metin ÜRETMİYOR — görselin içinde bulunduğu bloğun KENDİ
// başlığına düşüyor, yani sayfada zaten görünen gerçek içeriğe. İdeal alt
// metni görselin kendisini betimler; bu bir yaklaşım, ama "1@2x 3"e kıyasla
// hem erişilebilirlik hem bağlam açısından kesin bir kazanç.
//
// KAPSAM: yalnızca bloğun TEK `image` alanı. Çok görselli bloklar (`images[]`,
// ör. marka logosu ızgaraları) bilinçli olarak DIŞARIDA — hepsine aynı blok
// başlığını vermek sayfa içinde yinelenen alt metni üretirdi ve logolar için
// doğru cevap zaten marka adı, blok başlığı değil.

/** `alt` boş mu ya da dosya adından mı türemiş? */
const FILENAME_DERIVED_ALT = /^[\s\w@.\-]*(?:@\d+x|\d{2,}x\d{2,})[\s\w@.\-]*$/i;

export function isFilenameDerivedAlt(alt: string | undefined | null): boolean {
  if (!alt) return true;
  const a = alt.trim();
  if (!a) return true;
  return FILENAME_DERIVED_ALT.test(a);
}

/**
 * Görselin `alt`'ı dosya adından türemişse bloğun kendi başlığına düşer.
 * Başlık da boşsa görsel olduğu gibi bırakılır (uydurma metin üretilmez).
 */
export function withMeaningfulAlt<T extends { alt: string } | null | undefined>(
  image: T,
  blockTitle: string | undefined,
): T {
  if (!image) return image;
  if (!isFilenameDerivedAlt(image.alt)) return image;
  const fallback = (blockTitle ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return fallback ? ({ ...image, alt: fallback } as T) : image;
}
