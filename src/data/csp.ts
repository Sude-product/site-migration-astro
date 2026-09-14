// CSP politikasının TEK yazılı kaynağı (2026-09-14).
//
// Önceden politika İKİ yerde elle kopyalanıyordu (`public/_headers` +
// `src/middleware.ts`) ve "birebir aynı tutulmalı" disiplini yalnızca bir
// yorum satırıyla korunuyordu — pratikte bir kez gerçekten ayrıştı. Artık:
//
//   1. Bu dosya kaynak.                  (middleware doğrudan import ediyor)
//   2. `public/_headers` elle yazılı kopya. (statik varlık katmanı için ŞART —
//      Cloudflare `_headers`'ı bir dosya olarak okur, TS import edemez)
//   3. `scripts/check-csp-sync.mjs` ikisinin eşit olduğunu DOĞRULAR.
//      Ayrışırlarsa exit 1 — diğer `check-*.mjs` regresyon script'leriyle
//      aynı desen.
//
// Neden ikisi birden gerekiyor: `prerender=true` taşıyan ~940 sayfa
// Cloudflare'ın statik varlık katmanından servis ediliyor ve Worker'a HİÇ
// uğramıyor (yalnızca `_headers` uygulanır); `/keystatic/*` ve `/api/*` ise
// gerçek SSR (yalnızca middleware uygulanır).

/**
 * `report-only` → ihlaller yalnızca raporlanır, HİÇBİR ŞEY engellenmez.
 * `enforce`     → politika gerçekten uygulanır.
 *
 * **Bu değeri değiştirmeden önce `docs/csp-rollout.md`'deki go/no-go
 * kontrol listesini okuyun.** Değiştirildiğinde `public/_headers`'taki
 * başlık adı da (`Content-Security-Policy-Report-Only` ↔
 * `Content-Security-Policy`) elle güncellenmeli —
 * `scripts/check-csp-sync.mjs` bunu zorunlu kılıyor.
 */
export const CSP_MODE: 'report-only' | 'enforce' = 'report-only';

/** CSP ihlal raporlarının POST edildiği kendi SSR endpoint'imiz. */
export const CSP_REPORT_PATH = '/api/csp-report';

/**
 * `Reporting-Endpoints` başlığı — modern Reporting API (Chrome/Edge).
 * CSP'deki `report-to csp-endpoint` bu grubu işaret ediyor.
 * Eski `report-uri` de AYRICA veriliyor (Firefox/Safari hâlâ onu kullanıyor);
 * ikisini destekleyen tarayıcılar `report-to`yu tercih eder, çift rapor olmaz.
 */
export const REPORTING_ENDPOINTS_HEADER = `csp-endpoint="${CSP_REPORT_PATH}"`;

/**
 * script-src'teki inline izni. `scripts/generate-csp-headers.mjs` build
 * SONRASI bu token'ı `dist/client/_headers`'ta gerçek SHA256 hash listesiyle
 * DEĞİŞTİRİR. Kaynakta `'unsafe-inline'` olarak kalması bilinçli bir
 * fail-safe: generator çalışmazsa/başarısız olursa site bugünkü çalışan
 * politikayla yayına gider, bozuk bir direktifle DEĞİL.
 */
export const INLINE_SCRIPT_TOKEN = "'unsafe-inline'";

// ---------------------------------------------------------------------------
// Genel site politikası
// ---------------------------------------------------------------------------
//
// style-src'te `'unsafe-inline'` KALICI — hash'e çevrilemez. Sebep: React
// island'ları (ProductPreviewWidget'ın ölçekleme transform'u, PricingPage
// karşılaştırma tablosu, MarqueeBar) DEĞERİ ÇALIŞMA ZAMANINDA HESAPLANAN
// `style="..."` ÖZNİTELİKLERİ yazıyor. CSP hash'leri yalnızca `<style>`
// bloklarını kapsar; style ÖZNİTELİKLERİ için `'unsafe-hashes'` + her tekil
// değerin hash'i gerekir ki dinamik değerlerde bu imkânsız.
//
// img-src'teki `lh3.googleusercontent.com`: TEK bir eski blog yazısındaki
// (`surdurulebilir-kalkinma-kapsaminda-yesil-yonetim`) Google barındırmalı
// bir şema görseli için. **GEÇİCİ** — görsel `public/wp-content/`'e
// indirilince bu izin KALDIRILMALI (bkz. docs/csp-rollout.md, TODO-1).
//
// frame-src'teki `docs.google.com`: `zirve-katilim-ix-kurumsal-egitim-ve-
// gelisim-zirvesi` yazısındaki gerçek/çalışan Google Forms embed'i.
// frame-src'teki `googletagmanager.com`: GTM Preview / Tag Assistant.
//
// connect-src'teki `google.com/recaptcha/`: reCAPTCHA v3 canlı (6 formun
// hepsinde, gerçek site key). Token üretimi çoğu sürümde `api2/anchor`
// iframe'i İÇİNDEN yapılıyor (o durumda üst sayfanın connect-src'i devreye
// girmez) ama üst frame'den yapıldığı senaryolar da raporlanmış. İzin
// verilmezse zincir: XHR engellenir → execute() reject → token null →
// `api/lead.ts` (secret tanımlıysa) isteği REDDEDER → 6 form birden çalışmaz.
// Riski ölçmek yerine kapatmak tercih edildi; maliyeti bir host izni.
//
// **Bilinçli olarak EKLENMEYENLER:** GA4'ün Google Signals/Ads bağlantısı
// açıkken kullandığı `stats.g.doubleclick.net` ve `google.com/ads/
// ga-audiences`, ve GTM'e sonradan eklenebilecek pazarlama etiketleri
// (Meta `connect.facebook.net`, LinkedIn `snap.licdn.com`, Hotjar…).
// Bunlar TAHMİNLE allowlist'e yazılmadı — Report-Only turu bunların
// GERÇEKTEN kullanılıp kullanılmadığını raporlayacak, karar veriye
// dayanacak (bkz. docs/csp-rollout.md, ADIM 4).
export const PUBLIC_CSP = [
  "default-src 'self'",
  `script-src 'self' ${INLINE_SCRIPT_TOKEN} https://www.googletagmanager.com https://www.youtube.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://*.cookie-script.com`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  'img-src \'self\' data: https://img.youtube.com https://lh3.googleusercontent.com https://*.google-analytics.com https://*.googletagmanager.com',
  'frame-src https://www.youtube.com https://www.google.com/recaptcha/ https://docs.google.com https://www.googletagmanager.com',
  "frame-ancestors 'self'",
  "connect-src 'self' https://www.google.com/recaptcha/ https://*.cookie-script.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'report-to csp-endpoint',
  `report-uri ${CSP_REPORT_PATH}`,
].join('; ');

// ---------------------------------------------------------------------------
// Keystatic admin paneli (`/keystatic/*`) — genel siteden TAMAMEN farklı
// ihtiyaçlar (OAuth/GitHub + keystatic.cloud API + canlı işbirliği
// websocket'i). Kaynak: @keystatic/core'un UI bundle'ındaki hardcoded
// origin'ler. Yalnızca içerik editörleri görüyor, halka açık değil.
// ---------------------------------------------------------------------------
export const KEYSTATIC_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://keystatic.cloud https://api.keystatic.cloud",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https:",
  'connect-src \'self\' https://keystatic.cloud https://api.keystatic.cloud wss://live.keystatic.cloud https://api.github.com https://github.com https://raw.githubusercontent.com',
  'frame-src https://github.com https://keystatic.cloud',
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://github.com",
  'report-to csp-endpoint',
  `report-uri ${CSP_REPORT_PATH}`,
].join('; ');

/** Moda göre doğru CSP başlık adı. */
export function cspHeaderName(mode: 'report-only' | 'enforce' = CSP_MODE): string {
  return mode === 'enforce' ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only';
}
