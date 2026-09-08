// FAQPage JSON-LD üreticisi — `ProductPage`/`HubPage`/`FaqPage`/`HomeFaqSection`
// tarafından paylaşılıyor (2026-09-07).
//
// NEDEN PAYLAŞILAN: aynı blok dört yere kopyalanmıştı ve kopyaların üçünde
// bir hata vardı (aşağıya bkz.). Tek yerde toplamak hatanın tekrarını önlüyor.
//
// ⚠️ DÜRÜST BEKLENTİ: Google FAQ rich result'larını önce Ağustos 2023'te
// devlet/sağlık sitelerine kısıtladı, 7 Mayıs 2026'da tamamen kaldırdı. Bu
// şema arama sonucunda açılır soru-cevap kutusu ÜRETMEYECEK. Yine de
// tutuluyor: FAQPage geçerli bir schema.org tipi ve LLM tabanlı arama
// araçları soru-cevap yapısını bu işaretlemeden okuyor. Fayda ÖLÇÜLMÜŞ
// değil, spekülatif.

/** HTML entity'lerini çözer. `contentLinkAccessibility.ts`'teki aynı
 *  fonksiyonun eşdeğeri — orada da dokümante edilmiş, kasıtlı bir tekrar. */
function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/**
 * Zengin metni JSON-LD'ye uygun DÜZ metne çevirir.
 *
 * ⚠️ Etiket soyma TEK BAŞINA YETMİYOR: kaynak WordPress içeriği HTML
 * entity'leri taşıyor (`&amp;`, `&#8217;`). Yalnızca `<...>` soyulduğunda bu
 * diziler JSON-LD'ye ham haliyle sızıyor ve makine tarafında "idenfit &amp;
 * Datassist" gibi okunuyor. 2026-09-07 denetiminde 14 sayfada 26 soru-cevapta
 * ölçüldü. Sıra önemli: ÖNCE etiketler soyulur, SONRA entity'ler çözülür —
 * tersi olsaydı `&lt;b&gt;` gerçek bir etikete dönüşüp soyulmadan kalırdı.
 */
export function toPlainText(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

export interface FaqJsonLdItem {
  question: string;
  answer: string;
}

/** Boş listede `null` döner — çağıran taraf `JSON.stringify(null)` basmamalı. */
export function buildFaqJsonLd(items: FaqJsonLdItem[]) {
  if (items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: toPlainText(item.question),
      acceptedAnswer: { '@type': 'Answer', text: toPlainText(item.answer) },
    })),
  };
}
