// Form backend'i (Açık nokta #2) — TÜM formların (bkz. `src/pages/api/lead.ts`
// dosya başı yorumu) PAYLAŞTIĞI tek istemci-taraflı gönderim yardımcısı.
// Kod tekrarı olmasın diye her form component'i kendi `fetch()`'ini
// YAZMIYOR, bu fonksiyonu çağırıyor.
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
}

export interface LeadSubmission {
  formType: LeadFormType;
  locale: string;
  fullName?: string;
  phone?: string;
  company?: string;
  email?: string;
  message?: string;
  maturityResult?: MaturityResultPayload;
}

export type LeadSubmitResult = { ok: true } | { ok: false; error: string };

export async function submitLead(data: LeadSubmission): Promise<LeadSubmitResult> {
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        pageUrl: window.location.href,
        // reCAPTCHA SKELETON (bkz. `lead.ts`'teki `verifyRecaptcha()` tam
        // yorumu) — istemci tarafında henüz hiçbir yerde widget YÜKLENMİYOR
        // (site key yok), bu yüzden token her zaman `null`. Site key
        // eklenince buraya gerçek `grecaptcha.execute()` sonucu geçirilir.
        recaptchaToken: null,
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
