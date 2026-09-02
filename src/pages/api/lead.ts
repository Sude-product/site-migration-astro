// Form backend'i (Açık nokta #2 — 6 formun tamamı şimdiye kadar yalnızca
// `console.log` yapıp gerçek bir yere göndermiyordu, bkz. CLAUDE.md). Bu
// endpoint TÜM formların (HeroForm/İletişim, LandingRequestForm,
// SupportRequestForm, PresentationRequestForm, HrMaturityTest'in
// `EmailReportForm`'u) ORTAK varış noktası — `src/data/formLead.ts`'teki
// paylaşılan `submitLead()` istemci yardımcısı buraya POST atıyor.
//
// **SendGrid anahtarı HENÜZ YOK (2026-09-02, kullanıcı bekleniyor)** —
// bu dosya bilinçli olarak İSKELET: mantığın TAMAMI (doğrulama, e-posta
// içeriği oluşturma, hata kodları, reCAPTCHA doğrulama akışı) tam ve
// çalışır durumda, YALNIZCA gerçek SendGrid isteği `SENDGRID_API_KEY`
// yoksa 503 döner (sahte bir "başarılı" görüntüsü YARATILMAZ — formlar
// bu durumda gerçek hata mesajını gösterir, bkz. her form component'indeki
// `formSubmitError` kullanımı). Anahtar `.dev.vars`/Cloudflare Pages env
// değişkenine yazılınca kod DEĞİŞMEDEN çalışmaya başlar.
//
// Cloudflare Workers runtime'ında Node'un `@sendgrid/mail` SDK'sı yerine
// SendGrid'in v3 REST API'sine DOĞRUDAN `fetch()` ile istek atılıyor —
// resmi SDK Node-özel varsayımlar taşıyabilir (bkz. `wrangler.json`'daki
// `nodejs_compat` notu), REST API her ortamda birebir aynı şekilde çalışır
// ve yeni bir npm bağımlılığı EKLENMEZ.
export const prerender = false;

import type { APIRoute } from 'astro';
// `Astro.locals.runtime.env` DEĞİL — bu adapter sürümünde (`^14.2.5`)
// KALDIRILDI, bkz. `src/env.d.ts`'in tam yorumu. `cloudflare:workers`,
// @astrojs/cloudflare'ın KENDİSİNİN de kullandığı güncel resmi desen.
import { env } from 'cloudflare:workers';

type FormType = 'hero' | 'contact' | 'landing' | 'support' | 'presentation' | 'hrMaturityReport';

interface MaturityResultPayload {
  totalScore: number;
  levelTitle: string;
  categoryScores: Record<string, number>;
}

interface LeadPayload {
  formType: FormType;
  locale?: string;
  pageUrl?: string;
  fullName?: string;
  phone?: string;
  company?: string;
  email?: string;
  message?: string;
  maturityResult?: MaturityResultPayload;
  /** reCAPTCHA v3 istemci token'ı — skeleton aşamasında widget hiç
   * render edilmediği için her zaman `null`/`undefined` gelir, bkz.
   * `verifyRecaptcha()` yorumu. */
  recaptchaToken?: string | null;
}

// Her form türü için ZORUNLU string alanlar — `maturityResult` (nesne)
// ayrıca kontrol ediliyor, burada listelenmiyor.
const REQUIRED_STRING_FIELDS: Record<FormType, (keyof LeadPayload)[]> = {
  hero: ['fullName', 'phone', 'company', 'email'],
  contact: ['fullName', 'phone', 'company', 'email', 'message'],
  landing: ['fullName', 'phone', 'company', 'email'],
  support: ['fullName', 'phone', 'company', 'email', 'message'],
  presentation: ['fullName', 'phone', 'company', 'email'],
  hrMaturityReport: ['email'],
};

const FORM_TYPE_TITLES: Record<FormType, string> = {
  hero: 'Ana Sayfa / Panel Formu',
  contact: 'İletişim Formu',
  landing: 'Landing Page (/demo) Formu',
  support: 'Destek Talebi Formu',
  presentation: 'Online Sunum Talebi Formu',
  hrMaturityReport: 'İK Dijital Olgunluk Testi — Rapor Talebi',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function parseLeadPayload(body: unknown): LeadPayload | null {
  if (!isRecord(body)) return null;
  const formType = body.formType;
  if (typeof formType !== 'string' || !(formType in REQUIRED_STRING_FIELDS)) return null;

  const required = REQUIRED_STRING_FIELDS[formType as FormType];
  for (const field of required) {
    if (!isNonEmptyString(body[field as string])) return null;
  }

  if (formType === 'hrMaturityReport') {
    const result = body.maturityResult;
    if (
      !isRecord(result) ||
      typeof result.totalScore !== 'number' ||
      typeof result.levelTitle !== 'string' ||
      !isRecord(result.categoryScores)
    ) {
      return null;
    }
  }

  return body as unknown as LeadPayload;
}

// reCAPTCHA v3 doğrulaması — SKELETON. İstemci tarafında henüz hiçbir
// yerde reCAPTCHA widget'ı YÜKLENMİYOR (site key yok), bu yüzden
// `recaptchaToken` her zaman boş gelir. `secret` (env'den) tanımlı
// DEĞİLSE doğrulama tamamen ATLANIR (`true` döner) — bu SAYEDE formlar
// reCAPTCHA hiç kurulmadan da bugün ÇALIŞIR durumda kalıyor. Site key +
// secret key ayarlanınca yapılacaklar: (1) ilgili form component'ine
// `react-google-recaptcha-v3` YA DA ham `<script src="https://www.google.com/recaptcha/api.js?render=SITE_KEY">`
// eklenip `grecaptcha.execute()` ile token üretilip `submitLead()`'e
// geçirilir, (2) `public/_headers` + `src/middleware.ts`'in CSP'sine
// `https://www.google.com/recaptcha/` (script-src+frame-src) ve
// `https://www.gstatic.com/recaptcha/` (script-src) eklenir — İKİSİ DE
// bu turun kapsamı DIŞINDA bırakıldı (site key yokken eklemenin faydası
// yok).
async function verifyRecaptcha(token: string | null | undefined, secretKey: string | undefined): Promise<boolean> {
  if (!secretKey) return true;
  if (!isNonEmptyString(token)) return false;

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: secretKey, response: token }),
    });
    const data = (await res.json()) as { success?: boolean; score?: number };
    // v3 skor eşiği — Google'ın kendi önerdiği varsayılan (0.5). Gerçek
    // trafikle kalibre edilene kadar bu turda sabit bırakıldı.
    return data.success === true && (data.score === undefined || data.score >= 0.5);
  } catch (err) {
    console.error('[api/lead] reCAPTCHA doğrulaması başarısız (ağ hatası):', err);
    // Google'ın kendisi erişilemezse formu KİLİTLEMİYORUZ — spam koruması
    // devre dışı bir üçüncü tarafa bağımlı hale gelmemeli.
    return true;
  }
}

function buildEmailContent(payload: LeadPayload): { subject: string; text: string } {
  const title = FORM_TYPE_TITLES[payload.formType];
  const lines: string[] = [`Form: ${title}`, `Site dili: ${payload.locale ?? 'bilinmiyor'}`];
  if (payload.pageUrl) lines.push(`Sayfa: ${payload.pageUrl}`);
  lines.push('');

  if (payload.formType === 'hrMaturityReport' && payload.maturityResult) {
    lines.push(`E-posta: ${payload.email}`);
    lines.push('');
    lines.push(`Toplam skor: ${payload.maturityResult.totalScore}/100`);
    lines.push(`Seviye: ${payload.maturityResult.levelTitle}`);
    lines.push('Kategori bazlı skorlar:');
    for (const [category, score] of Object.entries(payload.maturityResult.categoryScores)) {
      lines.push(`  - ${category}: %${score}`);
    }
  } else {
    if (payload.fullName) lines.push(`Ad Soyad: ${payload.fullName}`);
    if (payload.phone) lines.push(`Telefon: ${payload.phone}`);
    if (payload.company) lines.push(`Firma: ${payload.company}`);
    if (payload.email) lines.push(`E-posta: ${payload.email}`);
    if (payload.message) lines.push(`Mesaj: ${payload.message}`);
  }

  return { subject: `[idenfit.com] ${title}`, text: lines.join('\n') };
}

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

export const POST: APIRoute = async ({ request }) => {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  const payload = parseLeadPayload(rawBody);
  if (!payload) {
    return jsonResponse({ ok: false, error: 'invalid_payload' }, 400);
  }

  const recaptchaOk = await verifyRecaptcha(payload.recaptchaToken, env.RECAPTCHA_SECRET_KEY);
  if (!recaptchaOk) {
    return jsonResponse({ ok: false, error: 'recaptcha_failed' }, 400);
  }

  if (!env.SENDGRID_API_KEY || !env.SENDGRID_FROM_EMAIL || !env.LEAD_NOTIFICATION_EMAIL) {
    console.error(
      '[api/lead] SENDGRID_API_KEY/SENDGRID_FROM_EMAIL/LEAD_NOTIFICATION_EMAIL henüz ayarlanmadı — e-posta gönderilmedi.',
      { formType: payload.formType },
    );
    return jsonResponse({ ok: false, error: 'email_service_unavailable' }, 503);
  }

  const { subject, text } = buildEmailContent(payload);

  try {
    const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: env.LEAD_NOTIFICATION_EMAIL }], subject }],
        from: { email: env.SENDGRID_FROM_EMAIL, name: 'idenfit.com' },
        ...(payload.email ? { reply_to: { email: payload.email, name: payload.fullName || undefined } } : {}),
        content: [{ type: 'text/plain', value: text }],
      }),
    });

    if (!sgRes.ok) {
      const errText = await sgRes.text().catch(() => '');
      console.error('[api/lead] SendGrid isteği başarısız:', sgRes.status, errText);
      return jsonResponse({ ok: false, error: 'email_send_failed' }, 502);
    }

    return jsonResponse({ ok: true }, 200);
  } catch (err) {
    console.error('[api/lead] Beklenmedik hata:', err);
    return jsonResponse({ ok: false, error: 'unexpected_error' }, 500);
  }
};
