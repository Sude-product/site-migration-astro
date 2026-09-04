// İK Dijital Olgunluk Testi — PDF üretimi (ADIM 4). Cloudflare'ın Browser
// Rendering API'sini (`@cloudflare/puppeteer`, `wrangler.json`'daki
// `browser.binding: "BROWSER"`) kullanarak `maturityReportTemplate.mjs`'in
// ÜRETTİĞİ AYNI HTML'i (yerel pilot script'iyle — `scripts/render-maturity-
// pdf-pilot.mjs` — birebir aynı şablon fonksiyonu) gerçek bir PDF'e çeviriyor.
//
// **Bu endpoint'in kendisi SENKRON** (PDF hazır olana kadar bekletir) —
// bilerek böyle: amaç, deploy SONRASI (Browser Rendering yerelde test
// EDİLEMEZ, gerçek bir Workers ortamı gerektirir) doğrudan bu URL'e istek
// atıp gerçek bir PDF dosyası indirip pilot/kabul testi yapmak.
//
// **ASENKRONLUK GEREKSİNİMİ (kullanıcının ADIM 4 şartı) buraya DEĞİL,
// ADIM 5'e ait** — testi dolduran gerçek kullanıcı bu 5-15sn'lik süreyi
// ASLA beklememeli. ADIM 5'te `src/pages/api/lead.ts`'in
// `hrMaturityReport` dalı, bu dosyadaki `generateMaturityReportPdf()`'i
// + SendGrid'e 2 e-posta gönderimini (ekip bildirimi + kullanıcının kendi
// e-postasına PDF eki) `locals.cfContext.waitUntil(...)` İÇİNE alacak —
// `Astro.locals.cfContext` bu adapter sürümünün (`^14.2.5`) gerçek
// `ExecutionContext`'i (`waitUntil` metodu dahil, bkz.
// `node_modules/@astrojs/cloudflare/dist/utils/cf-helpers.js`'in
// `createLocals()`'ı — `Astro.locals.runtime.ctx` KALDIRILDI). Bu sayede
// `/api/lead` isteği PDF/e-posta işi bitmeden HEMEN döner, kullanıcı
// "Teşekkürler, raporunuz birkaç dakika içinde e-postanıza gelecek"
// mesajını anında görür.
export const prerender = false;

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import puppeteer from '@cloudflare/puppeteer';
import { renderMaturityReportHtml } from '../../data/maturityReportTemplate.mjs';

export interface MaturityPdfData {
  companyName: string;
  totalScore: number;
  level: { title: string; subtitle: string };
  categoryScores: Record<string, number>;
  groupScores: Record<string, number>;
}

/** ADIM 5'in `lead.ts`'ten `locals.cfContext.waitUntil()` içinde
 * çağıracağı paylaşılan üretim fonksiyonu — HTTP request/response'tan
 * bağımsız, doğrudan PDF byte'larını döner. */
export async function generateMaturityReportPdf(data: MaturityPdfData): Promise<Uint8Array> {
  const html = renderMaturityReportHtml({ ...data, generatedAt: new Date() });
  const browser = await puppeteer.launch(env.BROWSER);
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    return await page.pdf({ format: 'A4', printBackground: true });
  } finally {
    await browser.close();
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFiniteScore(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100;
}

// GÜVENLİK (2026-09-04) — `categoryScores`/`groupScores`'un HER değerinin
// GERÇEKTEN 0-100 arası bir sayı olduğunu doğrular. Önceki sürüm yalnızca
// `isRecord()` (bir obje mi?) kontrol ediyordu, DEĞERLERİN tipini hiç
// denetlemiyordu — bir istemci `categoryScores.temel` yerine HTML/script
// içeren bir STRING gönderirse, bu değer `renderMaturityReportHtml()`
// tarafından hiç kaçışlanmadan (bkz. o dosyanın ADIM 4/5 sürümü) doğrudan
// PDF şablonuna yerleştiriliyordu — PDF üretimi `page.setContent()` ile
// bu HTML'i GERÇEK bir headless Chromium'da render ettiği için, bu
// enjekte edilen script Cloudflare Browser Rendering oturumu İÇİNDE
// ÇALIŞIRDI (sunucu tarafı kod çalıştırma riski). Bu fonksiyon, `lead.ts`
// (ADIM 5) ile PAYLAŞILAN TEK doğrulama noktası — ikinci bir kopya
// YAZILMADI.
export function isValidScoreRecord(value: unknown): value is Record<string, number> {
  if (!isRecord(value)) return false;
  return Object.values(value).every(isFiniteScore);
}

function parseMaturityPdfData(body: unknown): MaturityPdfData | null {
  if (!isRecord(body)) return null;
  const { companyName, totalScore, level, categoryScores, groupScores } = body;
  if (typeof companyName !== 'string' || companyName.trim().length === 0) return null;
  if (!isFiniteScore(totalScore)) return null;
  if (!isRecord(level) || typeof level.title !== 'string' || typeof level.subtitle !== 'string') return null;
  if (!isValidScoreRecord(categoryScores) || !isValidScoreRecord(groupScores)) return null;
  return body as unknown as MaturityPdfData;
}

// GÜVENLİK (2026-09-04) — bu endpoint yalnızca deploy-sonrası MANUEL pilot/
// kabul testi içindir (bkz. dosya başı yorumu), gerçek test-taker akışının
// parçası DEĞİL — halka açık, kimliksiz bırakılırsa (a) her istek gerçek
// bir headless Chromium başlattığı için ucuz bir kaynak-tüketim/DoS
// vektörü olur, (b) doğrulama gelecekte bir yerde atlanırsa render
// motoruna doğrudan erişim sağlar. Paylaşılan bir secret
// (`MATURITY_PDF_PILOT_SECRET`, `.dev.vars.example`) `X-Pilot-Secret`
// header'ında eşleşmezse — veya env'de HİÇ TANIMLI DEĞİLSE (varsayılan,
// anahtar ayarlanana kadar endpoint TAMAMEN devre dışı) — 404 dönülüyor
// (403 DEĞİL, endpoint'in var olduğunu bile açığa çıkarmamak için).
function isPilotRequestAuthorized(request: Request): boolean {
  const secret = env.MATURITY_PDF_PILOT_SECRET;
  return !!secret && request.headers.get('x-pilot-secret') === secret;
}

// Yalnızca deploy SONRASI manuel pilot/kabul testi içindir (bkz. dosya
// başındaki yorum) — gerçek test-taker akışının parçası DEĞİL.
export const POST: APIRoute = async ({ request }) => {
  if (!isPilotRequestAuthorized(request)) {
    return new Response(null, { status: 404 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = parseMaturityPdfData(rawBody);
  if (!data) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const pdf = await generateMaturityReportPdf(data);
    return new Response(new Blob([new Uint8Array(pdf)]), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="ik-dijital-olgunluk-raporu.pdf"',
      },
    });
  } catch (err) {
    console.error('[api/maturity-pdf] PDF üretimi başarısız:', err);
    return new Response(JSON.stringify({ ok: false, error: 'pdf_generation_failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
