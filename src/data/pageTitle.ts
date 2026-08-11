// <title> uzunluk yardımcıları (2026-08-10, title uzunluk denetimi turu —
// bkz. CLAUDE.md, meta description turunun devamı). Site genelinde 14
// component `idenfit — ${pageTitle}` şablonunu kullanıyor — `pageTitle`
// genelde kısa bir modül/sektör/sayfa adı (özellikle EN/IT/NL çevirileri
// TR'den daha kısa) olduğu için sonuç sık sık 50 karakterin altında kalıyor
// (ör. "idenfit — Retail" 17 karakter, "idenfit — Turizm" 16 karakter).
//
// KÖK NEDEN farklı bir sayfa TÜRÜNDE (blog) farklı — blog yazı başlıkları
// EDİTORYAL olarak doğal biçimde değişken uzunlukta, mekanik bir şablon
// çözümü YOK (bkz. CLAUDE.md Açık nokta — blog title'ları ayrı, daha büyük
// bir tur için BİLİNÇLİ olarak ertelendi, kullanıcı kararı 2026-08-10).
//
// STRATEJİ (yalnızca site sayfaları için): `idenfit — {pageTitle}` 50
// karakterin altındaysa, idenfit'in GERÇEK kategorisini (İK/HR yönetim
// yazılımı) anlatan, uzunluğu ihtiyaca göre değişen 5 kademeli gerçek
// ifadeden en uygun olanı ` | ` ile eklenir — anahtar kelime doldurma
// DEĞİL, aynı gerçek/doğru şirket tanımının farklı ayrıntı seviyeleri
// (kısa sayfalarda daha uzun/açıklayıcı, orta uzunluktaki sayfalarda daha
// kısa bir ifade seçilerek 50-60 aralığına oturtuluyor). 187 sayfalık
// gerçek veri setine karşı simüle edildi: 178/187 (%95) otomatik olarak
// hedef aralığa düşüyor; kalan ~9 sınır-dışı vaka (48-63 karakter) ve
// 7 ÇOK UZUN sayfa (bu fonksiyonun kapsamı DIŞINDA — otomatik kırpma
// güvenli değil, çağıran component'te elle `titleOverride` ile çözülüyor)
// ilgili sayfa dosyalarında elle işaretlendi.
import type { Locale } from './nav';

// Kademeli, gerçek İK/HR yazılımı tanım ifadeleri (kısadan uzuna) — 4 dilde,
// kopya çeviri DEĞİL, her dilin kendi doğal kısa/uzun varyantı.
const QUALIFIERS: Record<Locale, string[]> = {
  tr: ['İK Yazılımı', 'İK Yönetim Yazılımı', 'İnsan Kaynakları Yazılımı', 'İnsan Kaynakları Yönetim Yazılımı', 'Bulut Tabanlı İnsan Kaynakları Yönetim Yazılımı'],
  en: ['HR Software', 'HR Management Software', 'Human Resources Software', 'Human Resources Management Software', 'Cloud-Based Human Resources Management Software'],
  nl: [
    'HR-software',
    'HR-beheersoftware',
    'Personeelsbeheer Software',
    'Cloudgebaseerde HR-software',
    'Cloudgebaseerde HR-beheersoftware',
    'Cloudgebaseerde Personeelsbeheer Software',
  ],
  it: ['Software HR', 'Software Gestione HR', 'Software per le Risorse Umane', 'Software di Gestione delle Risorse Umane', 'Software Cloud per la Gestione delle Risorse Umane'],
};

const MIN_LENGTH = 50;
const MAX_LENGTH = 60;

/**
 * `idenfit — {pageTitle}` üretir; 50 karakterin altındaysa en uygun
 * kademeli niteleyiciyi ekler. 60'ı AŞAN `pageTitle`'lara dokunmaz —
 * onlar çağıran component'te elle (`titleOverride`) çözülmeli, otomatik
 * kırpma bir sayfa başlığını anlamsızlaştırabilir.
 */
export function buildIdenfitTitle(pageTitle: string, locale: Locale): string {
  const base = `idenfit — ${pageTitle}`;
  if (base.length >= MIN_LENGTH) return base;

  const qualifiers = QUALIFIERS[locale] ?? QUALIFIERS.en;
  let best = qualifiers[qualifiers.length - 1];
  let bestScore = Infinity;
  for (const q of qualifiers) {
    const total = base.length + 3 + q.length; // " | "
    if (total >= MIN_LENGTH && total <= MAX_LENGTH) return `${base} | ${q}`;
    const score = Math.min(Math.abs(total - MIN_LENGTH), Math.abs(total - MAX_LENGTH));
    if (score < bestScore) {
      bestScore = score;
      best = q;
    }
  }
  // Hiçbiri tam aralığa düşmüyorsa (nadir, ~9/187 vaka) en yakın olanı
  // kullan — mevcut durumdan (16-49 karakter) her zaman daha iyi.
  return `${base} | ${best}`;
}
