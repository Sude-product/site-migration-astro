// İlk-giriş kaynağı (attribution) — "bu kişi bizi nereden buldu?" (2026-10-09).
//
// NEDEN: form yalnızca formun BULUNDUĞU sayfanın adresini kaydediyordu
// (`pageUrl`). Ziyaretçi ChatGPT'den bir blog yazısına `?utm_source=...` ile
// iniyor, sonra "Online Sunum Talep Et"e tıklıyordu; etiket bu geçişte
// kayboluyordu. 2026-10-08 ölçümü: D1'deki 64 lead'in yalnız 1'inde kaynak
// izi vardı, oysa GA4 aynı dönemde ChatGPT'den dönüşüm gösteriyordu.
//
// AKIŞ: (1) `src/scripts/lead-attribution.js` her sayfa açılışında
// `captureLeadAttribution()`'ı çağırır, kaynak sekmenin sessionStorage'ına
// yazılır; (2) `formLead.ts` form gönderilirken `readStoredAttribution()` ile
// okuyup gövdeye ekler; (3) `api/lead.ts` gelen değeri `sanitizeAttribution()`
// ile temizler (istemciye GÜVENİLMEZ) ve kanalı `deriveLeadChannel()` ile
// SUNUCUDA hesaplar.
//
// KAPSAM — bilinçli olarak dar:
// * sessionStorage: sekme kapanınca silinir, çerez YOK, IP YOK. Günler arası
//   takip (bugün ChatGPT, üç gün sonra Google) bilinçli olarak yapılmıyor —
//   o, çerez onayı gerektiren bir izleme olurdu.
// * Sunucuya YALNIZCA kişi formu kendi isteğiyle gönderirse gider.
// * Tam referrer adresi DEĞİL yalnız alan adı (adres arama terimi/kişisel
//   veri taşıyabilir); ilk sayfanın da yalnız YOLU (sorgu dizesi eski
//   `?email=` aktarımını taşıyabilir, bkz. `emailHandoff.ts`).
//
// Bu dosya hem tarayıcıda (capture/read) hem Worker'da (sanitize/derive)
// çalışır; tarayıcıya özgü fonksiyonlar `window` yoksa sessizce hiçbir şey
// yapmaz.

export interface LeadAttribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  referrerHost?: string;
  landingPath?: string;
}

/** Alan başına uzunluk tavanı. idenfit-api'deki
 * `WebsiteLeadIngestService.ATTRIBUTION_LIMITS` ile AYNI değerler — biri
 * değişirse diğeri de değişmeli, yoksa CRM aktarımı 400 ile reddedilir. */
export const ATTRIBUTION_LIMITS: Record<keyof LeadAttribution, number> = {
  utmSource: 200,
  utmMedium: 200,
  utmCampaign: 200,
  utmTerm: 200,
  utmContent: 200,
  gclid: 200,
  referrerHost: 253,
  landingPath: 512,
};

const ATTRIBUTION_KEYS = Object.keys(ATTRIBUTION_LIMITS) as (keyof LeadAttribution)[];

export const ATTRIBUTION_STORAGE_KEY = 'idenfit.leadAttribution.v1';

/** Kendi alan adlarımız: buradan gelen geçiş "dış kaynak" sayılmaz. */
const OWN_HOSTS = /(^|\.)idenfit\.com$/;

const HOST_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

function clean(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.replace(CONTROL_CHARS, '').trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

/**
 * İstemciden gelen kaynak bilgisini temizler. ASLA throw etmez ve lead'i
 * REDDETTİRMEZ: kaynak bilgisi ikincil — bozuk bir değer yüzünden form
 * gönderimi düşmemeli. Tanınmayan anahtarlar, string olmayan değerler ve
 * kontrol karakterleri atılır; uzun değerler kırpılır. Geriye hiçbir şey
 * kalmazsa `null`.
 */
export function sanitizeAttribution(raw: unknown): LeadAttribution | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const source = raw as Record<string, unknown>;
  const result: LeadAttribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = clean(source[key], ATTRIBUTION_LIMITS[key]);
    if (value !== undefined) result[key] = value;
  }
  if (result.referrerHost !== undefined) {
    const host = result.referrerHost.toLowerCase();
    if (HOST_PATTERN.test(host)) result.referrerHost = host;
    else delete result.referrerHost;
  }
  if (result.landingPath !== undefined) {
    const path = result.landingPath.split(/[?#]/)[0];
    if (path.startsWith('/')) result.landingPath = path;
    else delete result.landingPath;
  }
  return Object.keys(result).length > 0 ? result : null;
}

/**
 * Kanal kodları. idenfit-api'deki `WebsiteLeadChannel` enum'unun kodlarıyla
 * BİREBİR aynı olmalı — API bilinmeyen kodu 400 ile reddeder. Etiketler de
 * aynı (CRM'deki "Kaynak" alanına yazılan değer ve idenfit-ui'daki
 * `CrmSourceSelect.SOURCE_OPTIONS`).
 */
export const LEAD_CHANNEL_LABELS = {
  chatgpt: 'Web - ChatGPT',
  gemini: 'Web - Gemini',
  perplexity: 'Web - Perplexity',
  copilot: 'Web - Copilot',
  claude: 'Web - Claude',
  ai_other: 'Web - Yapay Zeka (Diğer)',
  google_ads: 'Web - Google Ads',
  paid_other: 'Web - Ücretli Reklam',
  organic_search: 'Web - Organik Arama',
  linkedin: 'Web - LinkedIn',
  social: 'Web - Sosyal Medya',
  email: 'Web - E-posta',
  campaign: 'Web - Kampanya',
  referral: 'Web - Yönlendiren Site',
  direct: 'Web - Doğrudan',
} as const;

export type LeadChannel = keyof typeof LEAD_CHANNEL_LABELS;

// Sıra önemli: yapay zeka kaynakları ÖNCE — "chatgpt / paid" gibi etiketli
// bir link de ChatGPT sayılır (asıl soru "ChatGPT'den mi geldi?"); ortam
// bilgisi (paid) ayrıca utmMedium olarak saklanıyor.
const AI_SOURCES: [RegExp, LeadChannel][] = [
  [/chatgpt|openai/, 'chatgpt'],
  [/gemini|bard\.google/, 'gemini'],
  [/perplexity/, 'perplexity'],
  [/copilot/, 'copilot'],
  [/claude|anthropic/, 'claude'],
  [/deepseek|phind|you\.com|poe\.com|meta\.ai|grok|mistral|chat\.qwen/, 'ai_other'],
];
const PAID_MEDIUMS = /^(cpc|ppc|paid|paidsearch|paid_search|paid-search|paid_social|paidsocial|display|cpm|cpv|banner|retargeting)$/;
const SEARCH_HOSTS = /(^|\.)(google\.[a-z.]+|bing\.com|yandex\.[a-z.]+|duckduckgo\.com|yahoo\.com|ecosia\.org|baidu\.com|search\.brave\.com|startpage\.com)$/;
const SOCIAL = /facebook|instagram|fb\.com|^t\.co$|twitter|(^|\.)x\.com$|youtube|tiktok|threads\.net|pinterest|reddit/;
const LINKEDIN = /linkedin|lnkd\.in/;

/** Kaynak bilgisinden kanal kodu. Bilgi yoksa `direct`. Sunucuda hesaplanır;
 * istemcinin gönderdiği bir kanal değeri hiç okunmaz. */
export function deriveLeadChannel(attribution: LeadAttribution | null): LeadChannel {
  if (!attribution) return 'direct';
  const source = (attribution.utmSource ?? '').toLowerCase();
  const medium = (attribution.utmMedium ?? '').toLowerCase();
  const host = (attribution.referrerHost ?? '').toLowerCase();

  for (const [pattern, channel] of AI_SOURCES) {
    if (pattern.test(source) || pattern.test(host)) return channel;
  }
  if (attribution.gclid || (/google/.test(source) && PAID_MEDIUMS.test(medium))) return 'google_ads';
  if (PAID_MEDIUMS.test(medium)) return 'paid_other';
  if (LINKEDIN.test(source) || LINKEDIN.test(host)) return 'linkedin';
  if (medium === 'email' || medium === 'e-mail' || /newsletter|mailchimp|sendgrid|bulten|bülten/.test(source)) return 'email';
  if (SOCIAL.test(source) || SOCIAL.test(host) || medium === 'social') return 'social';
  if (medium === 'organic' || (!source && SEARCH_HOSTS.test(host))) return 'organic_search';
  if (source || medium || attribution.utmCampaign) return 'campaign';
  if (host) return 'referral';
  return 'direct';
}

/** Ekip e-postası ve CSV için tek satırlık özet. */
export function describeLeadSource(attribution: LeadAttribution | null, channel: LeadChannel): string {
  const parts: string[] = [LEAD_CHANNEL_LABELS[channel]];
  if (attribution?.utmSource || attribution?.utmMedium) {
    parts.push(`${attribution.utmSource ?? '(yok)'} / ${attribution.utmMedium ?? '(yok)'}`);
  }
  if (attribution?.utmCampaign) parts.push(`kampanya: ${attribution.utmCampaign}`);
  return parts.join(' · ');
}

// ---------------------------------------------------------------------------
// Tarayıcı tarafı

/** Dış kaynaktan geliş mi? Kendi alan adlarımız VE sayfanın o anki alan adı
 * (önizleme/workers.dev gibi) iç geçiş sayılır — yoksa site içi bir tıklama
 * kaydı "yönlendiren site" olarak ezerdi. */
function externalReferrerHost(referrer: string, currentHost: string): string | undefined {
  if (!referrer) return undefined;
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (!host || host === currentHost.toLowerCase() || OWN_HOSTS.test(host)) return undefined;
    return host;
  } catch {
    return undefined;
  }
}

/**
 * Sayfa açılışında kaynağı kaydeder. Kural (GA4'ün "oturum kaynağı" mantığına
 * yakın): sekmede kayıt yoksa yazılır; kayıt varsa YALNIZCA bu açılış yeni bir
 * dış sinyal taşıyorsa (utm/gclid ya da başka bir siteden geliş) üzerine
 * yazılır. Site içi gezinme kaydı asla değiştirmez.
 *
 * Depolama engelliyse (gizli mod, kapalı site verisi) sessizce hiçbir şey
 * yapmaz — form yine çalışır, yalnız kaynak boş gider.
 */
export function captureLeadAttribution(): void {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl: LeadAttribution = {
      utmSource: params.get('utm_source') ?? undefined,
      utmMedium: params.get('utm_medium') ?? undefined,
      utmCampaign: params.get('utm_campaign') ?? undefined,
      utmTerm: params.get('utm_term') ?? undefined,
      utmContent: params.get('utm_content') ?? undefined,
      gclid: params.get('gclid') ?? undefined,
      referrerHost: externalReferrerHost(document.referrer, window.location.hostname),
    };
    const hasExternalSignal = Object.values(fromUrl).some(Boolean);
    const existing = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (existing && !hasExternalSignal) return;

    const value = sanitizeAttribution({ ...fromUrl, landingPath: window.location.pathname });
    if (value) window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Depolama erişimi engelli — kaynak kaydedilmez, başka hiçbir şey etkilenmez
  }
}

/** Form gönderilirken çağrılır. Kayıt yoksa ya da okunamazsa `null`. */
export function readStoredAttribution(): LeadAttribution | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    return raw ? sanitizeAttribution(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}
