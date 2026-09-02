// Güvenlik başlıkları — `public/_headers`'ın SSR/dinamik karşılığı.
//
// `output:'server'` + Cloudflare Workers+Assets modelinde, `prerender=true`
// taşıyan (sitenin neredeyse tamamı, 927+ sayfa) rotalar STATİK varlık
// katmanından servis ediliyor — bu istekler Worker'ın fetch handler'ına
// (dolayısıyla bu middleware'e) HİÇ uğramıyor, yalnızca `public/_headers`
// uygulanıyor. Ama Keystatic'in admin paneli (`/keystatic/*`) gerçekten
// dinamik/SSR (bkz. CLAUDE.md "KEYSTATIC GEÇİŞİ" ADIM 1 — `output:'server'`
// geçişinin asıl nedeni buydu) — `dist/client/`'da hiç HTML dosyası taşımıyor,
// yalnızca `dist/server/`'da Worker kodu olarak var. Cloudflare'ın statik
// `_headers` dosyası dinamik Worker yanıtlarına UYGULANMIYOR (canlı testle
// doğrulandı: /keystatic/* `_headers`'taki kendi bloğuna rağmen hiç başlık
// almıyordu) — bu yüzden aynı başlıklar burada, response nesnesine
// programatik olarak ekleniyor.
//
// **Kalıcı disiplin:** buradaki iki CSP string'i `public/_headers`'taki
// karşılıklarıyla BİREBİR aynı tutulmalı — biri değişirse diğeri de
// güncellenmeli (iki ayrı kaynak, otomatik senkron değil).
import type { MiddlewareHandler } from 'astro';

// Quicksand 2026-08-31'de self-host edildi (bkz. global.css'in @font-face
// yorumu) — style-src/font-src'te fonts.googleapis.com/fonts.gstatic.com'a
// artık gerek yok, font-src 'self' yeterli (Keystatic'in KENDİ font
// yüklemesi ayrı, KEYSTATIC_CSP'ye dokunulmadı).
const PUBLIC_CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.youtube.com https://*.cookie-script.com; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https://img.youtube.com https://idenfit.com; frame-src https://www.youtube.com; frame-ancestors 'self'; connect-src 'self' https://*.cookie-script.com; object-src 'none'; base-uri 'self'; form-action 'self'";

const KEYSTATIC_CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://keystatic.cloud https://api.keystatic.cloud; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://keystatic.cloud https://api.keystatic.cloud wss://live.keystatic.cloud https://api.github.com https://github.com https://raw.githubusercontent.com; frame-src https://github.com https://keystatic.cloud; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self' https://github.com";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next();
  const isKeystatic = context.url.pathname.startsWith('/keystatic');

  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('Content-Security-Policy-Report-Only', isKeystatic ? KEYSTATIC_CSP : PUBLIC_CSP);

  return response;
};
