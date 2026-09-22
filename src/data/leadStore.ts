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
