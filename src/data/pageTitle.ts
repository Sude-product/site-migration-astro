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

// CTA/anchor text optimizasyonu (2026-08-12, kullanıcı talimatıyla — SEO/GEO
// faydası: her sayfaya özel, anahtar kelime içeren benzersiz link metni).
// KÖK OLAY: `ProductPage.astro`/`SectorPage.astro`/`HubPage.astro`'nun hero
// CTA'sı (`hero.ctaText`) doğrudan WP kaynağından basılıyordu — kaynak
// verinin kendisi son derece tekrarlı: ~150 gerçek sayfa (96 ürün/modül +
// 48 sektör + 6 hub) tarandığında "Hemen Başvur"(TR)/"Get Started"(EN)/
// "Aan de slag"(NL)/"Invia Richiesta"(IT) gibi birkaç jenerik metin
// onlarca sayfada BİREBİR tekrar ediyordu (keşif turunda doğrulandı).
//
// Bu set'teki metinler jenerik/tekrarlayan kabul edilir — `hero.ctaText`
// bunlardan biriyse `buildCtaAnchorText()` çıktısına düşülür, DEĞİLSE
// (kaynak zaten benzersiz/anlamlı bir metin taşıyorsa, ör. "Detaylı Bilgi
// Al" gibi bazı ürün sayfalarında) DOKUNULMAZ. "Online Sunum Talebi"
// BİLİNÇLİ OLARAK bu sete dahil EDİLMEDİ — Header'ın kalıcı nav CTA'sıyla
// AYNI ilke (kullanıcı kararı, 2026-08-12): bu, vurgu için tekrarlanan
// belirsiz bir dolgu metni değil, spesifik bir eylemi adlandıran gerçek
// bir ifade (bir sitenin navbar'ında "İletişime Geç" gibi).
const GENERIC_CTA_TEXTS = new Set([
  'Hemen Başvur',
  'Get Started',
  'Get Started1', // kaynağın kendi veri hatası (WP'de yazım hatası, ham veride birebir böyle) — aynı jenerik metin olarak ele alınır
  'Aan de slag',
  'Aan de Slag',
  'Invia Richiesta',
  // İlk taramada (`reference/wordpress-export/products.json`/`sectors.json`)
  // kaçırılan, uygulama SONRASI ikinci bir doğrulama taramasıyla (881
  // sayfalık gerçek `dist` çıktısı) bulunan ek jenerik metinler — ilk
  // tarama yalnızca HAM WP verisini taradı, `productTranslationOverrides.ts`/
  // `hardwareTranslationOverrides.ts`/`miscPagesTranslationOverrides.ts`'in
  // (KARAR 1 gereği IT'de özellikle yoğun) RUNTIME'da uyguladığı override
  // metinlerini görmüyordu — bu yüzden IT'nin "Richiedi Subito"su (12
  // sayfa, TEK başına en büyük kalan tekrar) ilk turda atlanmıştı.
  'Richiedi Subito',
  'Richiedi Ora',
  'Direct Aanvragen',
  'Apply Now',
  'Aanmelden',
  // `HeroForm.tsx`'in submit butonu — `t.hero.formSubmit` (site genelinde
  // 3 form: Hero/İletişim/Online Sunum Talebi, HER BİRİ AYNI metni taşıyor
  // — 2026-08-20'de kaldırılan "Kullanıcı Dostu Panel" formu 4. bir
  // kullanıcıydı) — NL/IT'nin kendi metni yukarıdakilerden FARKLI (ayrı
  // bir i18n anahtarı), aynı "tekrarlayan/jenerik" mantığıyla buraya
  // eklendi.
  'Nu Aanvragen',
  'Inizia Ora',
]);

export function isGenericCtaText(text: string): boolean {
  return GENERIC_CTA_TEXTS.has(text.trim());
}

// Her dilin kendi doğal CTA fiil kalıbı — kopya çeviri DEĞİL (KARAR 1),
// TR'nin "için Başvur"u EN'de "Get Started with", NL'de "Start met", IT'de
// "Richiedi Info su" gibi o dilin kendi doğal/profesyonel eylem çağrısı
// yapısını kullanıyor (hepsi "bu konu için harekete geç" anlamını taşıyor,
// birebir kelime çevirisi değil).
const CTA_TEMPLATES: Record<Locale, (keyword: string) => string> = {
  tr: (keyword) => `${keyword} için Başvur`,
  en: (keyword) => `Get Started with ${keyword}`,
  nl: (keyword) => `Start met ${keyword}`,
  it: (keyword) => `Richiedi Info su ${keyword}`,
};

/**
 * Sayfaya özel, anahtar kelime içeren CTA anchor text'i üretir. `keyword`
 * genelde `pageTitle` (bkz. `ProductPage.astro`/`SectorPage.astro`/
 * `HubPage.astro`'nun `<title>` için ZATEN kullandığı AYNI değer) —
 * bazı ürün/modül sayfalarında `pageTitle` kendisi uzun bir cümle olduğu
 * (hero'nun kaynak metni bir tanıtım sloganı) durumlarda çağıran sayfa
 * `ctaKeyword` prop'uyla daha kısa, elle seçilmiş bir anahtar kelime
 * geçirebilir (bkz. `ProductPage.astro`'daki `title`/`description`
 * override'larıyla AYNI kurulmuş desen). Uzunluk sınırı `<title>`
 * kadar katı değil (anchor text `<title>` gibi arama sonucunda
 * kırpılmıyor) ama 60 karakter civarı hedef olarak korunuyor.
 */
export function buildCtaAnchorText(keyword: string, locale: Locale): string {
  const template = CTA_TEMPLATES[locale] ?? CTA_TEMPLATES.en;
  return template(keyword);
}
