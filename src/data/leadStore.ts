// Form lead'lerinin KALICI kaydı — Cloudflare D1 (2026-09-22).
//
// NEDEN: `/api/lead` bu değişikliğe kadar hiçbir yere YAZMIYORDU, yalnızca
// SendGrid'e e-posta atıyordu. E-posta bir kayıt defteri değil — gönderim
// başarısız olursa (anahtar eksik, SendGrid arızası, İK Olgunluk Testi
// akışında PDF üretiminin çökmesi) lead geri dönülemez şekilde
// kayboluyordu. Şema: `migrations/0001_create_leads.sql`.
//
// TASARIM İLKESİ — bu modüldeki HİÇBİR fonksiyon THROW ETMEZ. Kalıcı
// kayıt bir "en iyi çaba" katmanı: veritabanı erişilemezse form akışı
// AYNEN devam etmeli (e-posta yine gitsin), kullanıcı bir altyapı
// sorunundan dolayı formu tekrar doldurmak zorunda kalmasın. Hatalar
// yalnızca loglanır.
//
// LOGLAMA SINIRI: hata durumunda payload'ın KENDİSİ loglanmaz (ad/e-posta/
// telefon Workers loglarına düşmesin) — yalnızca form türü + hata mesajı.
// Bu, `api/csp-report.ts`'in query string'i loglamama kararıyla aynı ilke.

import { env } from 'cloudflare:workers';
import type { LeadAttribution, LeadChannel } from './leadAttribution';

export type LeadEmailStatus = 'pending' | 'sent' | 'failed';

/** `lead.ts`'in `LeadPayload`'ı bu şekle YAPISAL olarak uyumlu — ikinci bir
 * birlik tanımı tutulmuyor, store yalnızca gerçekten yazdığı alanları
 * tanımlıyor. */
export interface LeadRecordInput {
  formType: string;
  locale?: string;
  pageUrl?: string;
  fullName?: string;
  phone?: string;
  company?: string;
  employeeCount?: string;
  sector?: string;
  email?: string;
  message?: string;
  maturityResult?: {
    totalScore: number;
    levelTitle: string;
    categoryScores: Record<string, number>;
    groupScores: Record<string, number>;
    answers?: Record<string, string>;
  };
}

const INSERT_SQL = `INSERT INTO leads (
  created_at, form_type, locale, page_url,
  full_name, email, phone, company, employee_count, sector, message,
  maturity_total_score, maturity_level_title,
  maturity_category_scores, maturity_group_scores, maturity_answers
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

/** D1'in `bind()`'ı `undefined` KABUL ETMEZ — açıkça `null`'a çevriliyor. */
function nullable(value: string | undefined | null): string | null {
  return value === undefined || value === '' ? null : value;
}

/**
 * Lead'i D1'e yazar ve satır id'sini döner.
 *
 * `null` dönmesi "kaydedilemedi" demektir (binding yok ya da yazma hata
 * verdi) — çağıran bunu bir hata olarak DEĞERLENDİRMEMELİ, yalnızca
 * sonraki `markLeadEmailStatus()` çağrısını atlamalı.
 */
export async function insertLead(input: LeadRecordInput): Promise<number | null> {
  const db = env.LEADS_DB;
  if (!db) {
    // Yerel `astro dev`'de binding yoksa beklenen durum; canlıda
    // görülüyorsa `wrangler.json`'daki `d1_databases` girdisi eksiktir.
    console.warn('[leadStore] LEADS_DB binding yok — lead kalıcı olarak KAYDEDİLMEDİ.', {
      formType: input.formType,
    });
    return null;
  }

  const m = input.maturityResult;
  try {
    const result = await db
      .prepare(INSERT_SQL)
      .bind(
        new Date().toISOString(),
        input.formType,
        nullable(input.locale),
        nullable(input.pageUrl),
        nullable(input.fullName),
        input.email ?? '',
        nullable(input.phone),
        nullable(input.company),
        nullable(input.employeeCount),
        nullable(input.sector),
        nullable(input.message),
        m ? m.totalScore : null,
        m ? m.levelTitle : null,
        m ? JSON.stringify(m.categoryScores) : null,
        m ? JSON.stringify(m.groupScores) : null,
        m?.answers ? JSON.stringify(m.answers) : null,
      )
      .run();

    const id = result?.meta?.last_row_id;
    return typeof id === 'number' ? id : null;
  } catch (err) {
    console.error('[leadStore] Lead kaydedilemedi:', { formType: input.formType }, err);
    return null;
  }
}

/**
 * E-posta gönderiminin sonucunu ilgili satıra işler. `insertLead()` `null`
 * döndüyse çağrılmamalı (çağrılırsa sessizce hiçbir şey yapmaz).
 *
 * `'failed'` satırlar "lead geldi ama ekibe/kullanıcıya ulaşmadı" demek —
 * elle takip edilmesi gereken tek sınıf bu.
 */
export async function markLeadEmailStatus(
  leadId: number | null,
  status: LeadEmailStatus,
  errorMessage?: string,
): Promise<void> {
  if (leadId === null) return;
  const db = env.LEADS_DB;
  if (!db) return;

  try {
    await db
      .prepare('UPDATE leads SET email_status = ?, email_error = ? WHERE id = ?')
      // Hata metni SendGrid/Chromium çıktısı olabilir — satırı şişirmemek
      // için kırpılıyor.
      .bind(status, errorMessage ? errorMessage.slice(0, 500) : null, leadId)
      .run();
  } catch (err) {
    console.error('[leadStore] E-posta durumu güncellenemedi:', { leadId, status }, err);
  }
}

// ---------------------------------------------------------------------------
// İlk-giriş kaynağı + Satış CRM aktarım durumu (2026-10-09, şema
// `migrations/0002_lead_attribution_crm.sql`).
//
// INSERT'e EKLENMEDİ, ayrı UPDATE'lerle yazılıyor — bilinçli: 0002 migration'ı
// uygulanmadan kod canlıya çıkarsa yalnız bu UPDATE'ler düşer, lead kaydının
// kendisi (yukarıdaki INSERT) etkilenmez. Aynı "asla throw etme" ilkesi.

/** Kaynak bilgisini lead satırına yazar. `leadId` null ise hiçbir şey yapmaz. */
export async function recordLeadAttribution(
  leadId: number | null,
  attribution: LeadAttribution | null,
  channel: LeadChannel,
): Promise<void> {
  if (leadId === null) return;
  const db = env.LEADS_DB;
  if (!db) return;
  const a = attribution ?? {};
  try {
    await db
      .prepare(
        `UPDATE leads SET utm_source = ?, utm_medium = ?, utm_campaign = ?, utm_term = ?, utm_content = ?,
           gclid = ?, referrer_host = ?, landing_path = ?, channel = ? WHERE id = ?`,
      )
      .bind(
        nullable(a.utmSource),
        nullable(a.utmMedium),
        nullable(a.utmCampaign),
        nullable(a.utmTerm),
        nullable(a.utmContent),
        nullable(a.gclid),
        nullable(a.referrerHost),
        nullable(a.landingPath),
        channel,
        leadId,
      )
      .run();
  } catch (err) {
    console.error('[leadStore] Kaynak bilgisi yazılamadı:', { leadId }, err);
  }
}

/** CRM aktarımı için okunan satır. Aktarım gövdesi hep bu satırdan kurulur —
 * ilk gönderim de yeniden deneme de AYNI veriyi gönderir. */
export interface StoredLeadForCrm {
  id: number;
  form_type: string;
  locale: string | null;
  full_name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  employee_count: string | null;
  sector: string | null;
  message: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  referrer_host: string | null;
  landing_path: string | null;
  channel: string | null;
  crm_status: string | null;
  crm_attempts: number | null;
}

const CRM_ROW_COLUMNS = `id, form_type, locale, full_name, email, phone, company, employee_count, sector, message,
  utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, referrer_host, landing_path, channel,
  crm_status, crm_attempts`;

export async function getLeadForCrm(leadId: number): Promise<StoredLeadForCrm | null> {
  const db = env.LEADS_DB;
  if (!db) return null;
  try {
    return await db.prepare(`SELECT ${CRM_ROW_COLUMNS} FROM leads WHERE id = ?`).bind(leadId).first<StoredLeadForCrm>();
  } catch (err) {
    console.error('[leadStore] Lead CRM için okunamadı:', { leadId }, err);
    return null;
  }
}

/**
 * Yeniden denenecek CRM aktarımları: 'failed' (ya da yarıda kalmış 'pending')
 * satırlar, deneme tavanının altında ve son denemeden en az `minAgeMinutes`
 * geçmiş olanlar. En eskiden yeniye, en fazla `limit` adet.
 */
export async function findLeadsForCrmRetry(
  maxAttempts: number,
  minAgeMinutes: number,
  limit: number,
): Promise<StoredLeadForCrm[]> {
  const db = env.LEADS_DB;
  if (!db) return [];
  const cutoff = new Date(Date.now() - minAgeMinutes * 60_000).toISOString();
  try {
    const result = await db
      .prepare(
        `SELECT ${CRM_ROW_COLUMNS} FROM leads
          WHERE crm_status IN ('failed', 'pending') AND crm_attempts < ?
            AND (crm_last_attempt_at IS NULL OR crm_last_attempt_at < ?)
          ORDER BY id ASC LIMIT ?`,
      )
      .bind(maxAttempts, cutoff, limit)
      .all<StoredLeadForCrm>();
    return result.results ?? [];
  } catch (err) {
    console.error('[leadStore] CRM yeniden deneme listesi okunamadı:', err);
    return [];
  }
}

export type LeadCrmStatus = 'pending' | 'sent' | 'failed' | 'skipped';

/** Bir aktarım denemesinin sonucunu yazar; her çağrı deneme sayacını artırır
 * ('pending' hariç — o, denemenin BAŞLADIĞINI işaretler). */
export async function markLeadCrmStatus(
  leadId: number,
  status: LeadCrmStatus,
  details: { crmLeadId?: string | null; error?: string | null } = {},
): Promise<void> {
  const db = env.LEADS_DB;
  if (!db) return;
  try {
    await db
      .prepare(
        `UPDATE leads SET crm_status = ?, crm_lead_id = COALESCE(?, crm_lead_id), crm_error = ?,
           crm_attempts = crm_attempts + ?, crm_last_attempt_at = ? WHERE id = ?`,
      )
      .bind(
        status,
        details.crmLeadId ?? null,
        details.error ? details.error.slice(0, 500) : null,
        status === 'pending' ? 0 : 1,
        new Date().toISOString(),
        leadId,
      )
      .run();
  } catch (err) {
    console.error('[leadStore] CRM durumu güncellenemedi:', { leadId, status }, err);
  }
}
