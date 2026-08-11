// Meta description yardımcıları (2026-08-10, meta description uzunluk
// denetimi turu — bkz. CLAUDE.md). Bazı sayfalarda meta description,
// sayfanın PAYLAŞILAN/görünür bir metnine bağlı (ör. ana sayfanın
// `t.hero.description`'ı — hem hero alt başlığı hem meta description
// olarak kullanılıyor). Bu alan doğrulanmış, canlı siteyle element-ID
// eşleşmeli ölçülmüş gerçek pazarlama metni — İÇERİĞİNİ DEĞİŞTİRMEDEN
// yalnızca META ETİKETİ için 160 karaktere kırpmak gerekiyor (görünür
// hero metni ETKİLENMİYOR, yalnızca `<meta name="description">` kısalıyor).
const DEFAULT_MAX_LENGTH = 160;

/**
 * Bir metni verilen maksimum uzunluğa, kelime ortasından KESMEDEN kırpar.
 * Meta description'ın SEO'da garip yarım kelimeyle bitmesini önler.
 */
export function truncateAtWord(text: string, maxLength = DEFAULT_MAX_LENGTH): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  const cut = trimmed.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim();
}
