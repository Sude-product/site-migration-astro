// Güvenlik başlıkları — `public/_headers`'ın SSR/dinamik karşılığı.
//
// `output:'server'` + Cloudflare Workers+Assets modelinde, `prerender=true`
// taşıyan (sitenin neredeyse tamamı, ~940 sayfa) rotalar STATİK varlık
// katmanından servis ediliyor — bu istekler Worker'ın fetch handler'ına
// (dolayısıyla bu middleware'e) HİÇ uğramıyor, yalnızca `public/_headers`
// uygulanıyor. Ama Keystatic'in admin paneli (`/keystatic/*`) ve `/api/*`
// rotaları gerçekten dinamik/SSR — Cloudflare'ın statik `_headers` dosyası
// dinamik Worker yanıtlarına UYGULANMIYOR (canlı testle doğrulandı:
// /keystatic/* `_headers`'taki kendi bloğuna rağmen hiç başlık almıyordu) —
// bu yüzden aynı başlıklar burada programatik olarak ekleniyor.
//
// Politika metni artık burada DEĞİL, `src/data/csp.ts`'te (tek kaynak).
// `public/_headers`'taki kopyayla eşitliği `scripts/check-csp-sync.mjs`
// doğruluyor.
//
// **Inline script hash'leri bilerek burada YOK.** Build sonrası hash üreten
// `scripts/generate-csp-headers.mjs` yalnızca `dist/client/_headers`'ı
// (prerender edilmiş HTML'in politikası) işliyor; middleware'in kapsadığı
// rotalar ya JSON döndürüyor (`/api/*`) ya da kendi ayrı politikasına sahip
// (`/keystatic/*`), yani hash'lenecek bir inline script taşımıyorlar.
import type { MiddlewareHandler } from 'astro';
import {
  KEYSTATIC_CSP,
  PUBLIC_CSP,
  REPORTING_ENDPOINTS_HEADER,
  cspHeaderName,
} from './data/csp';

const CSP_HEADER_NAME = cspHeaderName();

export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next();
  const isKeystatic = context.url.pathname.startsWith('/keystatic');

  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('Reporting-Endpoints', REPORTING_ENDPOINTS_HEADER);
  response.headers.set(CSP_HEADER_NAME, isKeystatic ? KEYSTATIC_CSP : PUBLIC_CSP);

  return response;
};
