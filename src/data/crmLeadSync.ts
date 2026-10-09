// Web formu lead'lerini idenfit Satış CRM'ine (app.idenfit.com/sales-crm/leads)
// aktarır (2026-10-09).
//
// AKIŞ: `api/lead.ts` lead'i D1'e yazdıktan sonra `syncLeadToCrm()`'ı
// `waitUntil` ile ARKA PLANDA başlatır — kullanıcı yanıtı CRM'i beklemez, CRM
// kapalıysa form yine çalışır. Gövde her zaman D1 satırından kurulur
// (`getLeadForCrm`), böylece ilk gönderim ile yeniden deneme aynı veriyi yollar.
//
// GÜVENLİK:
// * Kimlik: idenfit-api'nin OAuth2 client_credentials akışı. client_id/secret
//   yalnız Worker secret'ında (`IDENFIT_CRM_CLIENT_ID/SECRET`); bu modül
//   sunucuya özgü — tarayıcıya giden hiçbir koddan import EDİLMEMELİ
//   (`formLead.ts` dahil).
// * API tarafında kapsam `crm.leads.write`, client globme organizasyonuna bağlı;
//   uç yalnız lead OLUŞTURUR (okuma/güncelleme/silme yok).
// * Tekrar güvenli: aynı D1 kaydı (externalId = leads.id) ikinci lead açmaz.
// * Loglarda kişisel veri yok: yalnız lead numarası ve durum.
//
// YENİDEN DENEME: zamanlanmış iş (cron) YOK — her yeni lead geldiğinde, başarısız
// kalmış en fazla `RETRY_BATCH` eski kayıt da yeniden denenir (en az
// `RETRY_MIN_AGE_MINUTES` aralıkla, en fazla `MAX_ATTEMPTS` kez). Takılan kayıtlar
// `node scripts/export-leads.mjs --crm-failed` ile görülür.

import { env } from 'cloudflare:workers';
import { findLeadsForCrmRetry, getLeadForCrm, markLeadCrmStatus, type StoredLeadForCrm } from './leadStore';
import { LEAD_CHANNEL_LABELS, type LeadAttribution } from './leadAttribution';

/** sales@'e giden formlar. Destek talebi (cx@) satış lead'i değil, CRM'e gitmez. */
export const CRM_FORM_TYPES: ReadonlySet<string> = new Set(['hero', 'contact', 'landing', 'presentation', 'hrMaturityReport']);

const SCOPE = 'crm.leads.write';
const MAX_ATTEMPTS = 5;
const RETRY_MIN_AGE_MINUTES = 10;
const RETRY_BATCH = 3;
const REQUEST_TIMEOUT_MS = 10_000;

export function isCrmSyncConfigured(): boolean {
  return Boolean(env.IDENFIT_CRM_API_URL && env.IDENFIT_CRM_CLIENT_ID && env.IDENFIT_CRM_CLIENT_SECRET);
}

function apiBase(): string {
  return String(env.IDENFIT_CRM_API_URL).replace(/\/+$/, '');
}

// Isolate belleğinde token önbelleği: her lead için yeni token alınmasın.
// İsolate'lar arası paylaşılmaz; en kötü durumda isolate başına bir token.
let cachedToken: { value: string; expiresAt: number } | null = null;

class CrmSyncError extends Error {
  constructor(
    message: string,
    readonly permanent: boolean,
  ) {
    super(message);
  }
}

async function accessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const res = await fetch(`${apiBase()}/api/v1/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: String(env.IDENFIT_CRM_CLIENT_ID),
      client_secret: String(env.IDENFIT_CRM_CLIENT_SECRET),
      scope: SCOPE,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) {
    // Yanıt gövdesi loglanmaz/saklanmaz: hata açıklaması client bilgisini yansıtabilir
    throw new CrmSyncError(`token isteği başarısız (HTTP ${res.status})`, false);
  }
  const body = (await res.json().catch(() => null)) as { access_token?: unknown; expires_in?: unknown } | null;
  if (!body || typeof body.access_token !== 'string') {
    throw new CrmSyncError('token yanıtı geçersiz', false);
  }
  const ttlSeconds = typeof body.expires_in === 'number' && body.expires_in > 0 ? body.expires_in : 300;
  cachedToken = { value: body.access_token, expiresAt: Date.now() + ttlSeconds * 1000 };
  return cachedToken.value;
}

function toRequestBody(row: StoredLeadForCrm): Record<string, unknown> {
  const attribution: LeadAttribution = {};
  const put = (key: keyof LeadAttribution, value: string | null) => {
    if (value) attribution[key] = value;
  };
  put('utmSource', row.utm_source);
  put('utmMedium', row.utm_medium);
  put('utmCampaign', row.utm_campaign);
  put('utmTerm', row.utm_term);
  put('utmContent', row.utm_content);
  put('gclid', row.gclid);
  put('referrerHost', row.referrer_host);
  put('landingPath', row.landing_path);
  const channel = row.channel && Object.hasOwn(LEAD_CHANNEL_LABELS, row.channel) ? row.channel : 'direct';
  return {
    externalId: String(row.id),
    formType: row.form_type,
    locale: row.locale,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    employeeCount: row.employee_count,
    sector: row.sector,
    message: row.message,
    channel,
    attribution,
  };
}

async function pushOne(row: StoredLeadForCrm): Promise<void> {
  await markLeadCrmStatus(row.id, 'pending');
  try {
    const send = async () =>
      fetch(`${apiBase()}/api/v1/integrations/website/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await accessToken()}` },
        body: JSON.stringify(toRequestBody(row)),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    let res = await send();
    if (res.status === 401) {
      // Önbellekteki token iptal edilmiş/süresi dolmuş olabilir: bir kez taze token ile dene
      cachedToken = null;
      res = await send();
    }
    const body = (await res.json().catch(() => null)) as { leadId?: unknown; error?: unknown; error_description?: unknown } | null;
    if (res.status === 200 || res.status === 201) {
      await markLeadCrmStatus(row.id, 'sent', { crmLeadId: typeof body?.leadId === 'string' ? body.leadId : null });
      return;
    }
    const reason = `HTTP ${res.status}${typeof body?.error === 'string' ? ` ${body.error}` : ''}${
      typeof body?.error_description === 'string' ? `: ${body.error_description}` : ''
    }`;
    // 400/409/422: CRM bu kaydı kalıcı olarak reddetti; yeniden denemek düzeltmez, elle bakılmalı.
    // 401/403/429/5xx: yapılandırma ya da geçici sorun; deneme tavanına kadar yeniden denenir.
    const permanent = res.status === 400 || res.status === 409 || res.status === 422;
    await markLeadCrmStatus(row.id, permanent ? 'skipped' : 'failed', { error: reason });
    console.warn('[crmLeadSync] Lead CRM\'e aktarılamadı:', { leadId: row.id, status: res.status, permanent });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await markLeadCrmStatus(row.id, 'failed', { error: message });
    console.warn('[crmLeadSync] Lead CRM\'e aktarılamadı:', { leadId: row.id, error: message });
  }
}

/**
 * Yeni lead'i CRM'e aktarır, ardından takılmış birkaç eski kaydı yeniden dener.
 * ASLA throw etmez (waitUntil içinde koşar; hata yalnız D1'deki durum
 * kolonlarına ve loga düşer).
 */
export async function syncLeadToCrm(leadId: number | null, formType: string): Promise<void> {
  if (leadId === null || !CRM_FORM_TYPES.has(formType) || !isCrmSyncConfigured()) return;
  try {
    const row = await getLeadForCrm(leadId);
    if (row) await pushOne(row);
    const stale = await findLeadsForCrmRetry(MAX_ATTEMPTS, RETRY_MIN_AGE_MINUTES, RETRY_BATCH);
    for (const candidate of stale) {
      if (candidate.id !== leadId && CRM_FORM_TYPES.has(candidate.form_type)) await pushOne(candidate);
    }
  } catch (err) {
    console.error('[crmLeadSync] Beklenmeyen hata:', { leadId }, err);
  }
}
