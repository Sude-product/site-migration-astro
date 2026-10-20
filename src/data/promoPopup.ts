/**
 * Ana sayfa "2027 performans" promosyon pop-up'ının TEK yapılandırma kaynağı.
 *
 * Hem `src/components/PromoPopup.astro` (script'i sayfaya eklemeli mi?) hem
 * `src/scripts/promo-popup.js` (metin/URL/zamanlama) bu dosyayı import ediyor —
 * iki kopya arasında sessiz bir uyuşmazlık oluşamaz (`emailHandoff.ts` ile
 * AYNI desen).
 *
 * KAPSAM: yalnızca TR ana sayfası (`src/pages/index.astro`). Diğer 4 locale'in
 * ana sayfası ve sitenin geri kalanı bu bileşeni HİÇ import etmiyor — kullanıcı
 * kararı (2026-10-20). i18n'e bağlanmamasının nedeni de bu: metinler tek dilde,
 * tek sayfada yaşıyor; `src/i18n/*.ts`'in 5 dilli şemasına girseydi 4 dilde
 * KULLANILMAYAN çeviri üretmek gerekirdi (KARAR 1'e aykırı).
 *
 * `enabled: false` yapıldığında `index.astro` bileşeni HİÇ render etmiyor,
 * yani harici script de sayfaya eklenmiyor (sıfır bayt).
 */
export const PROMO_POPUP = {
  /** Tek kapatma anahtarı — `false` olunca pop-up hiç yüklenmez. */
  enabled: true,

  /** GA4/dataLayer olaylarında gönderilen kampanya kimliği. */
  promoId: 'performans-2027',

  /**
   * Zamanlama. `delayMs` HEM çerez kararından sonra HEM (karar zaten
   * verilmişse) sayfa yüklendikten sonra geçerli olan tek gecikme.
   */
  delayMs: 5000,

  /**
   * GÜVENLİK AĞI — Cookie-Script hiç yüklenmezse (reklam engelleyici,
   * ağ hatası) ne banner çıkar ne de karar olayı gelir; bu süre sonunda
   * banner DOM'da da yoksa pop-up yine de gösterilir. Banner duruyorsa
   * beklemeye devam edilir (üstüne binmesin).
   */
  noBannerFallbackMs: 15000,

  /** Kapatıldıktan sonra kaç gün gösterilmeyecek. */
  dismissDays: 7,

  /** `localStorage` anahtarı — değeri kapatma anındaki `Date.now()` damgası. */
  dismissStorageKey: 'idenfit:promo-performans-2027-dismissed',

  /**
   * Cookie-Script'in karar anında `window`'a gönderdiği olaylar.
   * Dördü de "banner artık ekranda değil" anlamına geliyor.
   */
  consentEvents: [
    'CookieScriptAccept',
    'CookieScriptAcceptAll',
    'CookieScriptReject',
    'CookieScriptClose',
  ],

  /** Karar DAHA ÖNCE verilmişse bu çerez zaten yazılmış olur. */
  consentCookieName: 'CookieScriptConsent',

  /** Cookie-Script banner'ının kapsayıcı element id'si (fallback kontrolü). */
  bannerElementId: 'cookiescript_injected',

  text: {
    /** `<aside aria-label>` — ekran okuyucu için bölgenin adı. */
    regionLabel: 'Performans modülü önerisi',
    closeLabel: 'Kapat',
    eyebrow: '2026 → 2027 · PERFORMANS',
    title: 'Performans verileriniz farklı Excel’lerde mi?',
    /** Yalnızca masaüstü. */
    subtitle: '2026’yı hızla değerlendirin, 2027’yi birlikte tasarlayalım!',
    /** Yalnızca masaüstü. */
    body: 'İdenfit’in hazır hedef ve yetkinlik kütüphaneleriyle başlayın. Hedeflerinizi ve 360° değerlendirmelerinizi tek platformda yönetin; şirket ve çalışan karneleriyle sonuçları görünür kılın.',
  },

  /**
   * Hedef şemasının üç düğümü. `short` yalnızca mobil mini şemada,
   * `title`/`text` yalnızca masaüstü kartlarında kullanılıyor — ikisi de AYNI
   * diziden besleniyor, yani iki görünüm arasında sıra/içerik ayrışamaz.
   */
  nodes: [
    { short: 'Şirket', title: 'Şirket hedefi', text: 'Ortak öncelikleri belirleyin.' },
    { short: 'Takım', title: 'Takım hedefi', text: 'Ekiplerin katkısını netleştirin.' },
    { short: 'Bireysel', title: 'Bireysel hedef', text: 'Sorumluluğu görünür kılın.' },
  ],

  /** UTM YOK (kullanıcı kararı) — ölçüm dataLayer olaylarıyla yapılıyor. */
  cta: {
    primary: { label: 'Birlikte tasarlayalım', href: '/online-sunum-talep-et/', id: 'birlikte-tasarlayalim' },
    secondary: { label: 'Modülü incele', href: '/calisan-performans-degerlendirme-sistemi-modulu/', id: 'modulu-incele' },
  },
} as const;
