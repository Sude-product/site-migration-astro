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
// ADIM 5 — aynı PDF üretim fonksiyonunu (ADIM 4'te `/api/maturity-pdf`
// endpoint'i için yazılmıştı) burada da çağırıyoruz, ikinci bir kopya
// YAZILMADI. Bu import `maturity-pdf.ts`'in kendi `POST` route export'unu
// da beraberinde getiriyor ama Astro yalnızca dosyanın kendi route'unda
// (`/api/maturity-pdf`) bunu bir endpoint olarak ele alıyor — buradan
// import etmek `/api/lead`'i ikinci bir route yapmıyor.
// `isValidScoreRecord` — GÜVENLİK (2026-09-04): `maturityResult.categoryScores`/
// `groupScores`'un HER değerinin GERÇEKTEN 0-100 arası bir sayı olduğunu
// doğrulayan TEK/paylaşılan fonksiyon, bkz. `maturity-pdf.ts`'teki tam
// yorum (HTML/script enjeksiyonu — bu değerler `renderMaturityReportHtml()`
// tarafından PDF şablonuna yerleştiriliyor, PDF üretimi bunu gerçek bir
// headless Chromium'da render ediyor).
import { generateMaturityReportPdf, isValidScoreRecord } from './maturity-pdf';
// E-posta SUNUMU (HTML + düz metin şablonu) ayrı bir dosyada — bu route
// istek doğrulama/hız sınırı/SendGrid çağrısından sorumlu, biçimlendirmeden
// değil. Bkz. `src/data/leadEmailTemplate.ts` dosya başı yorumu.
// K2 — `levelTitle`/`levelSubtitle` ARTIK istemciden alınmıyor, doğrulanmış
// `totalScore`'dan sunucuda hesaplanıyor. Bkz. `parseLeadPayload()`.
import { getLevel } from '../../data/maturityTestDefinitions';
import {
  renderLeadNotificationEmail,
  renderMaturityApplicantEmail,
  IDENFIT_LOGO_CID,
  IDENFIT_LOGO_PNG_BASE64,
  type LeadFormType,
} from '../../data/leadEmailTemplate';
// KALICI KAYIT (2026-09-22) — lead artık e-postadan ÖNCE D1'e yazılıyor.
// E-posta bir kayıt defteri değil: gönderim başarısız olursa lead
// kaybolmasın diye. Bu modül ASLA throw etmez, bkz. dosya başı yorumu.
import { insertLead, markLeadEmailStatus } from '../../data/leadStore';

// Tek kaynak `leadEmailTemplate.ts` — ikinci bir birlik (union) tanımı
// tutulmuyor, biri değişirse diğeri sessizce eskimesin diye.
type FormType = LeadFormType;

interface MaturityResultPayload {
  totalScore: number;
  levelTitle: string;
  levelSubtitle: string;
  categoryScores: Record<string, number>;
  groupScores: Record<string, number>;
  /** 20 sorunun TEK TEK cevabı (2026-09-22). Opsiyonel — yalnızca kalıcı
   * kayda (D1) gidiyor, e-postaya/PDF'e girmiyor. Önceden bu veri hiç
   * sunucuya ULAŞMIYORDU (yalnızca toplulaştırılmış skorlar geliyordu),
   * yani "hangi soruda kim takılıyor" analizi imkânsızdı. */
  answers?: Record<string, string>;
}

interface LeadPayload {
  formType: FormType;
  locale?: string;
  pageUrl?: string;
  fullName?: string;
  phone?: string;
  company?: string;
  /** İK Olgunluk Testi'nin kendi formu topluyor (diğer 5 formda yok).
   * 2026-09-22'ye kadar istemci bu iki alanı TOPLAYIP GÖNDERMİYORDU. */
  employeeCount?: string;
  sector?: string;
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
  // ADIM 5 — `company` (Firma Adı) artık ZORUNLU: PDF şablonunun
  // `companyName` alanı boş kalmamalı. `CompanyForm` (testin başı) bu alanı
  // zaten `required` tutuyor, bu yalnızca API seviyesinde bir güvenlik ağı.
  hrMaturityReport: ['email', 'company'],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

// GÜVENLİK (K2) — alan başına uzunluk tavanı. Bu değerler e-posta
// şablonuna (`leadEmailTemplate.ts`) ve `hrMaturityReport` akışında PDF
// şablonuna giriyor; tavan olmadan tek bir istek megabaytlarca metin
// gönderip hem SendGrid çağrısını hem headless Chromium render'ını
// şişirebilirdi. Değerler gerçek form alanlarının makul üst sınırı —
// meşru hiçbir gönderim bunlara yaklaşmıyor.
const MAX_FIELD_LENGTH: Partial<Record<keyof LeadPayload, number>> = {
  fullName: 120,
  phone: 40,
  company: 200,
  employeeCount: 40,
  sector: 120,
  email: 254, // RFC 5321 pratik üst sınırı
  message: 5000,
  locale: 8,
  pageUrl: 2048,
};

/** Tek satırlık, tek `@` içeren, boşluksuz bir adres. Tam RFC 5322
 * ayrıştırıcısı DEĞİL (o pratikte gereksiz) — amaç, SendGrid'e giden
 * `to`/`replyTo` alanına başlık enjeksiyonu (CR/LF) veya çok uzun/biçimsiz
 * bir değerin geçmesini engellemek. */
function isValidEmail(value: string): boolean {
  const v = value.trim();
  if (v.length > 254) return false;
  return /^[^\s@<>,;:"\\]+@[^\s@<>,;:"\\]+\.[^\s@<>,;:"\\]{2,}$/.test(v);
}

// İK Olgunluk Testi'nin 20 sorusunun tek tek cevapları. Anahtar 1-20
// arası bir soru numarası, değer `MaturityAnswerValue`'nun üç sabitinden
// biri olmalı — bu blob D1'e JSON olarak yazıldığı için hem anahtar sayısı
// hem değer kümesi SIKI tutuluyor (serbest bırakılsa tek istek veritabanına
// megabaytlarca çöp yazdırabilirdi).
const MATURITY_ANSWER_VALUES = new Set(['evet', 'kısmen', 'hayır']);
const MATURITY_QUESTION_KEY = /^([1-9]|1[0-9]|20)$/;

function isValidAnswerRecord(value: unknown): value is Record<string, string> {
  if (!isRecord(value)) return false;
  const entries = Object.entries(value);
  if (entries.length > 20) return false;
  return entries.every(
    ([key, v]) => MATURITY_QUESTION_KEY.test(key) && typeof v === 'string' && MATURITY_ANSWER_VALUES.has(v),
  );
}

function parseLeadPayload(body: unknown): LeadPayload | null {
  if (!isRecord(body)) return null;
  const formType = body.formType;
  // `Object.hasOwn` — `in` DEĞİL: `in` prototip zincirini de tarar, yani
  // `formType: 'toString'` gibi bir değer bu kontrolü GEÇERDİ (ardından
  // `REQUIRED_STRING_FIELDS[formType]` bir fonksiyon döner, `for...of`
  // hiç dönmez ve payload zorunlu alanların HİÇBİRİ olmadan kabul edilirdi).
  if (typeof formType !== 'string' || !Object.hasOwn(REQUIRED_STRING_FIELDS, formType)) return null;

  const required = REQUIRED_STRING_FIELDS[formType as FormType];
  for (const field of required) {
    if (!isNonEmptyString(body[field as string])) return null;
  }

  // GÜVENLİK (K2) — uzunluk tavanı GÖNDERİLEN her string alana uygulanır
  // (yalnızca zorunlu olanlara değil: `message` çoğu formda opsiyonel ama
  // e-posta gövdesine giriyor).
  for (const [field, max] of Object.entries(MAX_FIELD_LENGTH)) {
    const value = body[field];
    if (value === undefined || value === null) continue;
    if (typeof value !== 'string' || value.length > max) return null;
  }

  if (!isValidEmail(String(body.email ?? ''))) return null;

  if (formType === 'hrMaturityReport') {
    const result = body.maturityResult;
    if (
      !isRecord(result) ||
      typeof result.totalScore !== 'number' ||
      !Number.isFinite(result.totalScore) ||
      result.totalScore < 0 ||
      result.totalScore > 100 ||
      !isValidScoreRecord(result.categoryScores) ||
      !isValidScoreRecord(result.groupScores) ||
      (result.answers !== undefined && !isValidAnswerRecord(result.answers))
    ) {
      return null;
    }

    // GÜVENLİK (K2) — seviye METNİ artık istemciden ALINMIYOR. Önceden
    // `levelTitle`/`levelSubtitle` yalnızca "string mi" diye kontrol edilip
    // doğrudan PDF şablonuna (gerçek headless Chromium'da render ediliyor)
    // ve iki e-postaya geçiriliyordu; saldırgan buraya istediği metni
    // yazabiliyordu. Artık doğrulanmış `totalScore`'dan sunucuda
    // hesaplanıyor — istemcinin ne gönderdiği HİÇ okunmuyor (aşağıdaki
    // atama, gelen değeri ne olursa olsun EZER).
    const level = getLevel(result.totalScore);
    result.levelTitle = level.title;
    result.levelSubtitle = level.subtitle;
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

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

// GEÇİCİ HIZ SINIRLAMASI (2026-09-04) — reCAPTCHA site key gelene kadar
// (bkz. `verifyRecaptcha()` yorumu) tek başına yeterli bir spam/kötüye
// kullanım engeli yok. Bu, Workers ISOLATE'I İÇİNDE tutulan basit bir
// sabit-pencere sayaç — **dürüst sınır:** Cloudflare'ın edge ağı aynı
// istemciyi farklı coğrafi PoP'lara/isolate kopyalarına dağıtabilir, bu
// yüzden bu sayaç DAĞITIK/GARANTİLİ bir sınır DEĞİL — yalnızca ucuz, ilk
// savunma katmanı. Kalıcı/gerçek çözüm: Cloudflare Rate Limiting kuralı
// (dashboard, kod dışı) VEYA reCAPTCHA v3 (iskeleti zaten hazır).
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const rateLimitLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  // Ucuz periyodik temizlik — pencere dışına çıkmış TÜM kayıtları at,
  // uzun ömürlü bir isolate'ta Map'in sınırsız büyümesini önler.
  if (rateLimitLog.size > 2000) {
    for (const [key, timestamps] of rateLimitLog) {
      if (timestamps.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) rateLimitLog.delete(key);
    }
  }
  const recent = (rateLimitLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitLog.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateLimitLog.set(ip, recent);
  return false;
}

// `Buffer` yerine (nodejs_compat açık olsa da) taşınabilir/saf Workers
// API'siyle — `btoa` global olarak var, ama tek seferde tüm PDF byte'larını
// `String.fromCharCode(...bytes)`'e vermek 400KB+ dosyalarda call-stack
// taşmasına yol açabildiği için 32KB'lık parçalar halinde işleniyor.
function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

// Form başına bildirim adresi (2026-09-04) — her formun lead'i FARKLI bir
// ekibe gidiyor (satış / destek / pazarlama vb.), tek bir kutu yetmiyor.
//
// Her form türünün KENDİ env değişkeni var; tanımlı değilse genel
// `LEAD_NOTIFICATION_EMAIL`'e düşülür. Bu sayede yalnızca ayrıştırmak
// istediğiniz formlar için değişken tanımlamanız yeterli — geri kalanı
// eskisi gibi çalışmaya devam eder, hiçbir form sessizce alıcısız kalmaz.
//
// Her değişken VİRGÜLLE AYRILMIŞ birden fazla adres alabilir
// (`satis@…,mudur@…`) — SendGrid'in `personalizations[].to` alanı zaten
// dizi. Adresler `to` içinde birlikte görünür (Cc/Bcc değil).
const FORM_TYPE_RECIPIENT_ENV: Record<FormType, keyof typeof env> = {
  hero: 'LEAD_EMAIL_HERO',
  contact: 'LEAD_EMAIL_CONTACT',
  landing: 'LEAD_EMAIL_LANDING',
  support: 'LEAD_EMAIL_SUPPORT',
  presentation: 'LEAD_EMAIL_PRESENTATION',
  hrMaturityReport: 'LEAD_EMAIL_HR_MATURITY',
};

/**
 * Bir form türünün bildirim alıcıları. Sırasıyla: forma özel değişken →
 * genel `LEAD_NOTIFICATION_EMAIL`. Hiçbiri yoksa BOŞ dizi döner (çağıran
 * taraf bunu 503'e çevirir — sahte "başarılı" üretilmez).
 */
function resolveRecipients(formType: FormType): string[] {
  const specific = env[FORM_TYPE_RECIPIENT_ENV[formType]];
  const raw = (typeof specific === 'string' && specific.trim()) || env.LEAD_NOTIFICATION_EMAIL || '';
  return raw
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);
}

interface SendGridMailParams {
  to: string[];
  toName?: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: { email: string; name?: string };
  attachment?: { filename: string; contentBase64: string };
}

/**
 * SendGrid v3 `mail/send` gövdesi — TEK yerde kuruluyor, iki gönderim yolu
 * (senkron form bildirimi + asenkron olgunluk raporu) da bunu kullanıyor.
 *
 * **`tracking_settings` neden kapalı (2026-09-04):** SendGrid varsayılan
 * olarak Click Tracking uyguluyor — gövdedeki HER URL'i kendi izleme
 * alan adına (`url….idenfit.com/ls/click?upn=…`) yeniden yazıyor. Bu
 * e-postalar İÇ BİLDİRİM/işlemsel teslim; tıklama istatistiği hiçbir işe
 * yaramıyor, buna karşılık düz metin sürümündeki "Sayfa: …" URL'i okunamaz
 * hâle geliyordu (kullanıcının bildirdiği ilk gerçek gönderimde tam olarak
 * bu oldu). Aynı gerekçeyle `open_tracking` (izleme pikseli) ve
 * `subscription_tracking` (işlemsel e-postaya abonelikten-çık dipnotu
 * eklemek yanıltıcı olurdu) da kapatıldı.
 */
function buildSendGridBody(params: SendGridMailParams): Record<string, unknown> {
  return {
    personalizations: [
      { to: params.to.map((email, i) => ({ email, name: i === 0 ? params.toName : undefined })), subject: params.subject },
    ],
    from: { email: env.SENDGRID_FROM_EMAIL, name: 'idenfit.com' },
    ...(params.replyTo ? { reply_to: params.replyTo } : {}),
    // Sıra ÖNEMLİ: SendGrid `content` dizisinin artan MIME karmaşıklığında
    // olmasını şart koşuyor — `text/plain` ÖNCE, `text/html` SONRA.
    content: [
      { type: 'text/plain', value: params.text },
      { type: 'text/html', value: params.html },
    ],
    tracking_settings: {
      click_tracking: { enable: false, enable_text: false },
      open_tracking: { enable: false },
      subscription_tracking: { enable: false },
    },
    // Logo HER e-postaya gömülü (inline) ek olarak gidiyor — uzak bir
    // `<img src="https://…">` yerine, bkz. `leadEmailLogo.ts`. `content_id`
    // gövdedeki `cid:` referansıyla eşleşmek zorunda, ikisi de AYNI sabitten.
    attachments: [
      {
        content: IDENFIT_LOGO_PNG_BASE64,
        filename: 'idenfit-logo.png',
        type: 'image/png',
        disposition: 'inline',
        content_id: IDENFIT_LOGO_CID,
      },
      ...(params.attachment
        ? [
            {
              content: params.attachment.contentBase64,
              filename: params.attachment.filename,
              type: 'application/pdf',
              disposition: 'attachment',
            },
          ]
        : []),
    ],
  };
}

async function sendSendGridEmail(params: SendGridMailParams): Promise<void> {
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildSendGridBody(params)),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`SendGrid isteği başarısız (${res.status}): ${errText}`);
  }
}

// ADIM 5 — PDF üretimi (Browser Rendering, 5-15sn sürebilir) + 2 e-posta
// gönderimi (ekip bildirimi + testi dolduran kişinin KENDİSİNE PDF eki).
// POST handler bu fonksiyonu `locals.cfContext.waitUntil()` İÇİNE verip
// AWAIT ETMEDEN hemen yanıt döner — kullanıcı bu süreyi asla beklemez
// (ADIM 4'ün asenkronluk şartı). Hata olursa yalnızca konsola düşer, zaten
// kullanıcıya dönecek bir yanıt YOK (istek çoktan yanıtlandı).
async function processMaturityReportAsync(payload: LeadPayload, leadId: number | null): Promise<void> {
  const result = payload.maturityResult;
  if (!result) return;

  try {
    const pdfBytes = await generateMaturityReportPdf({
      companyName: payload.company ?? 'Bilinmiyor',
      totalScore: result.totalScore,
      level: { title: result.levelTitle, subtitle: result.levelSubtitle },
      categoryScores: result.categoryScores,
      groupScores: result.groupScores,
    });
    const pdfBase64 = uint8ArrayToBase64(new Uint8Array(pdfBytes));
    const team = renderLeadNotificationEmail(payload);
    const applicant = renderMaturityApplicantEmail({
      fullName: payload.fullName,
      totalScore: result.totalScore,
      levelTitle: result.levelTitle,
      levelSubtitle: result.levelSubtitle,
    });

    await Promise.all([
      sendSendGridEmail({
        to: resolveRecipients('hrMaturityReport'),
        subject: team.subject,
        text: team.text,
        html: team.html,
        replyTo: payload.email ? { email: payload.email, name: payload.fullName || undefined } : undefined,
      }),
      sendSendGridEmail({
        to: [payload.email!],
        toName: payload.fullName || undefined,
        subject: applicant.subject,
        text: applicant.text,
        html: applicant.html,
        attachment: { filename: 'ik-dijital-olgunluk-raporu.pdf', contentBase64: pdfBase64 },
      }),
    ]);
    await markLeadEmailStatus(leadId, 'sent');
  } catch (err) {
    console.error('[api/lead] hrMaturityReport asenkron işlem (PDF/e-posta) başarısız:', err);
    // Bu blok ÖNCEDEN sessizdi: PDF üretimi çökerse ekip bildirimi de
    // düşüyor, kullanıcı yine de "başarılı" görüyordu ve lead'den geriye
    // HİÇBİR iz kalmıyordu. Artık satır D1'de duruyor ve 'failed' olarak
    // işaretleniyor — elle takip edilebilir.
    await markLeadEmailStatus(leadId, 'failed', err instanceof Error ? err.message : String(err));
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const clientIp = request.headers.get('cf-connecting-ip') ?? 'unknown';
  if (isRateLimited(clientIp)) {
    return jsonResponse({ ok: false, error: 'rate_limited' }, 429);
  }

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

  // KALICI KAYIT (2026-09-22) — SendGrid yapılandırma kontrolünden ÖNCE.
  // Sıra KASITLI: e-posta gönderilemese bile (anahtar eksik, SendGrid
  // arızalı) lead'in KENDİSİ kaybolmamalı. `insertLead()` throw etmez;
  // başarısız olursa `null` döner ve akış aynen devam eder.
  const leadId = await insertLead(payload);

  // Alıcı, forma özel değişkenden ya da genel `LEAD_NOTIFICATION_EMAIL`'den
  // çözülür (bkz. `resolveRecipients()`); ikisi de yoksa bu form için
  // gidecek adres YOK demektir — sahte bir "başarılı" döndürmek yerine 503.
  const recipients = resolveRecipients(payload.formType);
  if (!env.SENDGRID_API_KEY || !env.SENDGRID_FROM_EMAIL || recipients.length === 0) {
    console.error(
      '[api/lead] SendGrid yapılandırması eksik — e-posta gönderilmedi.',
      { formType: payload.formType, hasKey: !!env.SENDGRID_API_KEY, hasFrom: !!env.SENDGRID_FROM_EMAIL, recipientCount: recipients.length },
    );
    // Lead YUKARIDA kaydedildi — kullanıcıya hâlâ dürüst bir hata dönüyor
    // (e-posta gerçekten gitmedi) ama veri artık kaybolmuyor.
    await markLeadEmailStatus(leadId, 'failed', 'email_service_unavailable');
    return jsonResponse({ ok: false, error: 'email_service_unavailable' }, 503);
  }

  // ADIM 5 — HR Olgunluk Testi raporu (PDF üretimi + 2 e-posta) her zaman
  // ASENKRON işlenir: kullanıcı testi bitirdiğinde bu 5-15sn'lik süreci
  // ASLA beklememeli (ADIM 4'ün şartı). `waitUntil` Worker'ın yanıt
  // döndükten SONRA da bu iş bitene kadar canlı kalmasını sağlıyor —
  // `locals.cfContext` bu adapter sürümünün gerçek `ExecutionContext`'i
  // (bkz. `src/pages/api/maturity-pdf.ts`'in dosya başı yorumu). Yerel
  // `astro dev`'de bu alan yoksa iş yine de (await edilmeden) başlatılır —
  // yalnızca yerel ortamda erken kapanma riski taşır, üretimde sorun yok.
  if (payload.formType === 'hrMaturityReport') {
    const cfContext = (locals as { cfContext?: { waitUntil: (promise: Promise<unknown>) => void } }).cfContext;
    const work = processMaturityReportAsync(payload, leadId);
    if (cfContext?.waitUntil) {
      cfContext.waitUntil(work);
    } else {
      void work;
    }
    return jsonResponse({ ok: true }, 202);
  }

  const { subject, text, html } = renderLeadNotificationEmail(payload);

  try {
    const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        buildSendGridBody({
          to: recipients,
          subject,
          text,
          html,
          replyTo: payload.email ? { email: payload.email, name: payload.fullName || undefined } : undefined,
        }),
      ),
    });

    if (!sgRes.ok) {
      const errText = await sgRes.text().catch(() => '');
      console.error('[api/lead] SendGrid isteği başarısız:', sgRes.status, errText);
      await markLeadEmailStatus(leadId, 'failed', `SendGrid ${sgRes.status}: ${errText}`);
      return jsonResponse({ ok: false, error: 'email_send_failed' }, 502);
    }

    await markLeadEmailStatus(leadId, 'sent');
    return jsonResponse({ ok: true }, 200);
  } catch (err) {
    console.error('[api/lead] Beklenmedik hata:', err);
    await markLeadEmailStatus(leadId, 'failed', err instanceof Error ? err.message : String(err));
    return jsonResponse({ ok: false, error: 'unexpected_error' }, 500);
  }
};
