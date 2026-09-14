// CSP ihlal raporu toplayıcı (2026-09-14).
//
// **Neden var:** CSP 2026-08-31'den beri Report-Only modda ama politikada
// `report-uri`/`report-to` HİÇ YOKTU — yani ihlaller yalnızca tek tek
// ziyaretçilerin DevTools Console'unda görünüyor, hiçbir yere ulaşmıyordu.
// "1-2 hafta sessiz gözlem" koşulu (CLAUDE.md Açık nokta #46, madde 3)
// takvimde geçmiş ama KANITTA hiç başlamamıştı. Bu endpoint o boşluğu
// kapatıyor: enforcing'e geçiş kararı artık tahmine değil veriye dayanacak.
//
// **Nereye yazıyor:** Cloudflare Workers observability log'ları
// (`wrangler tail` ile canlı, panelden "Workers & Pages → idenfit-com →
// Logs" ile geçmişe dönük). `wrangler.json`'da `observability.enabled`
// AÇIK olmalı — kapalıysa buraya gelen raporlar sessizce kaybolur.
// Kalıcı depolama (KV/D1/Logpush) bilinçli olarak KULLANILMADI: CSP
// raporları yüksek hacimli ve büyük ölçüde tekrarlı, kalıcı yazma hem
// maliyet hem gürültü olurdu; karar için gereken şey "hangi ihlal sınıfları
// var" bilgisi, tekil olayların arşivi değil.
//
// **Gürültü kontrolü (3 katman):**
//  1. Gövde boyutu sınırı — devasa payload'lar hiç ayrıştırılmıyor.
//  2. İhlal SINIFI bazında tekilleştirme — aynı (direktif + engellenen
//     kaynak + sayfa) üçlüsü isolate başına yalnızca BİR kez loglanıyor,
//     tekrarlar sayılıp periyodik olarak özetleniyor.
//  3. Isolate başına mutlak log tavanı.
//
// **Bilinçli olarak yapılmayanlar:** kimlik doğrulama YOK (tarayıcı CSP
// raporlarını kimliksiz gönderir, doğrulanamaz) ve gelen içeriğe GÜVENİLMİYOR
// — endpoint halka açık olduğu için herkes sahte rapor POST edebilir.
// Bu yüzden loglanan alanlar kısaltılıyor/temizleniyor ve rapor verisi
// yalnızca İNSAN İNCELEMESİ için bir sinyal; hiçbir otomatik karar buna
// dayanmıyor.
export const prerender = false;

import type { APIRoute } from 'astro';

/** Tarayıcı raporları küçüktür; bunun üstü ya bozuk ya kötü niyetli. */
const MAX_BODY_BYTES = 16_000;

/** Bir isolate ömrü boyunca yazılacak en fazla log satırı. */
const MAX_LOGS_PER_ISOLATE = 200;

/** Aynı ihlal sınıfının tekrarları bu aralıkta bir kez özetlenir. */
const SUMMARY_INTERVAL_MS = 60_000;

/** Loglanan tekil alanların üst uzunluğu (URL'ler çok uzun olabiliyor). */
const MAX_FIELD_LENGTH = 200;

interface NormalizedReport {
  directive: string;
  blockedUri: string;
  documentPath: string;
  disposition: string;
}

interface SeenEntry {
  count: number;
  lastLoggedAt: number;
}

const seen = new Map<string, SeenEntry>();
let logsWritten = 0;

function clip(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) return '-';
  // Satır sonu/kontrol karakterleri log satırını bölüp sahte kayıt
  // üretebilir (log injection) — temizleniyor.
  const cleaned = value.replace(/[\r\n\t]/g, ' ').trim();
  return cleaned.length > MAX_FIELD_LENGTH ? `${cleaned.slice(0, MAX_FIELD_LENGTH)}…` : cleaned;
}

/**
 * Sayfa URL'inden yalnızca yolu alır. Query string BİLEREK atılıyor —
 * form sayfalarının URL'i e-posta/ad gibi kişisel veri taşıyabilir
 * (ör. ana sayfa hero formu e-postayı query param ile taşıyor), bunun
 * log'a düşmesi istenmiyor.
 */
function toPath(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) return '-';
  try {
    return clip(new URL(value, 'https://idenfit.com').pathname);
  } catch {
    return clip(value);
  }
}

/**
 * İki farklı rapor formatını tek şekle indirger:
 *  - `application/csp-report`   → `{ "csp-report": {...} }`  (Firefox/Safari)
 *  - `application/reports+json` → `[{ type:'csp-violation', body:{...} }]` (Chrome)
 * Alan adları da farklı (`blocked-uri` vs `blockedURL`) — ikisi de okunuyor.
 */
function normalize(payload: unknown): NormalizedReport[] {
  const bodies: Record<string, unknown>[] = [];

  if (Array.isArray(payload)) {
    for (const item of payload) {
      if (item && typeof item === 'object') {
        const entry = item as Record<string, unknown>;
        if (entry.type && entry.type !== 'csp-violation') continue;
        if (entry.body && typeof entry.body === 'object') {
          bodies.push(entry.body as Record<string, unknown>);
        }
      }
    }
  } else if (payload && typeof payload === 'object') {
    const legacy = (payload as Record<string, unknown>)['csp-report'];
    if (legacy && typeof legacy === 'object') bodies.push(legacy as Record<string, unknown>);
  }

  return bodies.map((b) => ({
    directive: clip(b['effective-directive'] ?? b.effectiveDirective ?? b['violated-directive']),
    blockedUri: clip(b['blocked-uri'] ?? b.blockedURL),
    documentPath: toPath(b['document-uri'] ?? b.documentURL),
    disposition: clip(b.disposition ?? 'report'),
  }));
}

function record(report: NormalizedReport): void {
  const key = `${report.directive}|${report.blockedUri}|${report.documentPath}`;
  const now = Date.now();
  const entry = seen.get(key);

  if (!entry) {
    // Uzun ömürlü bir isolate'ta Map'in sınırsız büyümesini önle.
    if (seen.size > 500) seen.clear();
    seen.set(key, { count: 1, lastLoggedAt: now });
    if (logsWritten < MAX_LOGS_PER_ISOLATE) {
      logsWritten++;
      console.log(
        `[csp-violation] YENİ directive=${report.directive} blocked=${report.blockedUri} page=${report.documentPath} disposition=${report.disposition}`,
      );
    }
    return;
  }

  entry.count++;
  if (now - entry.lastLoggedAt >= SUMMARY_INTERVAL_MS && logsWritten < MAX_LOGS_PER_ISOLATE) {
    logsWritten++;
    entry.lastLoggedAt = now;
    console.log(
      `[csp-violation] TEKRAR ×${entry.count} directive=${report.directive} blocked=${report.blockedUri} page=${report.documentPath}`,
    );
  }
}

// Her durumda 204 dönülüyor — hatalı/kötü niyetli bir gövdede bile.
// Tarayıcı rapor gönderimini yeniden denemez ve hata kodu döndürmek
// endpoint'in davranışı hakkında gereksiz bilgi verir.
const noContent = () => new Response(null, { status: 204 });

export const POST: APIRoute = async ({ request }) => {
  try {
    const declaredLength = Number(request.headers.get('content-length') ?? '0');
    if (declaredLength > MAX_BODY_BYTES) return noContent();

    const raw = await request.text();
    if (raw.length === 0 || raw.length > MAX_BODY_BYTES) return noContent();

    for (const report of normalize(JSON.parse(raw))) record(report);
  } catch {
    // Bozuk JSON / okunamayan gövde — sessizce yut.
  }
  return noContent();
};

/** GET ile ziyaret edilirse (elle/yanlışlıkla) hiçbir şey açığa vurma. */
export const GET: APIRoute = () => new Response(null, { status: 405 });
