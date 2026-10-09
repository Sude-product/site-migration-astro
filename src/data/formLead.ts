// Form backend'i (Açık nokta #2) — TÜM formların (bkz. `src/pages/api/lead.ts`
// dosya başı yorumu) PAYLAŞTIĞI tek istemci-taraflı gönderim yardımcısı.
// Kod tekrarı olmasın diye her form component'i kendi `fetch()`'ini
// YAZMIYOR, bu fonksiyonu çağırıyor.
import { getRecaptchaToken } from './recaptcha';
import { readStoredAttribution } from './leadAttribution';

export type LeadFormType = 'hero' | 'contact' | 'landing' | 'support' | 'presentation' | 'hrMaturityReport';

export interface MaturityResultPayload {
  totalScore: number;
  levelTitle: string;
  /** ADIM 5 — PDF şablonunun (`maturityReportTemplate.mjs`) alt başlık
   * satırı için gerekiyor (`level.subtitle`), önceki turda taşınmıyordu. */
  levelSubtitle: string;
  categoryScores: Record<string, number>;
  /** ADIM 5 — PDF'in "Yetkinlik Karnesi" sayfası için 10 alt-grup skoru. */
  groupScores: Record<string, number>;
  /** 20 sorunun TEK TEK cevabı (2026-09-22). Yalnızca kalıcı kayda (D1)
   * gidiyor — e-postaya ve PDF'e girmiyor. Önceden hiç gönderilmiyordu,
   * yani soru bazlı analiz imkânsızdı. */
  answers?: Record<string, string>;
}

export interface LeadSubmission {
  formType: LeadFormType;
  locale: string;
  fullName?: string;
  phone?: string;
  company?: string;
  /** İK Olgunluk Testi'nin kendi formunun topladığı iki ek alan
   * (2026-09-22). Bu iki alan formda HEP vardı ama gönderime hiç
   * konmuyordu — ne ekip e-postasına ne de bir kayda ulaşıyordu. */
  employeeCount?: string;
  sector?: string;
  email?: string;
  message?: string;
  maturityResult?: MaturityResultPayload;
}

export type LeadSubmitResult = { ok: true } | { ok: false; error: string };

export async function submitLead(data: LeadSubmission): Promise<LeadSubmitResult> {
  try {
    // reCAPTCHA v3 (2026-09-04) — iskelet KAPANDI, artık gerçek token
    // üretiliyor. Altı formun hepsi bu fonksiyondan geçtiği için tek
    // çağrı hepsini kapsıyor; `action` olarak form türü geçiliyor, böylece
    // Google konsolunda hangi formun ne kadar bot trafiği aldığı ayrı ayrı
    // görülebiliyor. Token alınamazsa `null` gider ve sunucu isteği
    // reddeder (bkz. `recaptcha.ts`'in `getRecaptchaToken()` yorumu).
    const recaptchaToken = await getRecaptchaToken(data.formType);

    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        pageUrl: window.location.href,
        // Ziyaretçinin siteye bu sekmede ilk nereden geldiği (utm/gclid/geldiği
        // site/ilk sayfa) — `pageUrl` yalnız formun bulunduğu sayfayı söylüyor.
        // Sunucu bunu temizler ve kanalı kendisi hesaplar, bkz. leadAttribution.ts.
        attribution: readStoredAttribution(),
        recaptchaToken,
      }),
    });
    const body: unknown = await res.json().catch(() => null);
    const ok = res.ok && typeof body === 'object' && body !== null && (body as { ok?: unknown }).ok === true;
    if (ok) return { ok: true };
    const error =
      typeof body === 'object' && body !== null && typeof (body as { error?: unknown }).error === 'string'
        ? (body as { error: string }).error
        : `http_${res.status}`;
    return { ok: false, error };
  } catch {
    return { ok: false, error: 'network_error' };
  }
}
