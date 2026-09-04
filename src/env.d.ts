/// <reference types="astro/client" />

// Form backend hazırlığı (2026-09-02, Açık nokta #2) — `src/pages/api/lead.ts`
// endpoint'inin okuduğu Cloudflare Workers RUNTIME secret'ları.
//
// ⚠️ DÜZELTME: İlk sürüm `Astro.locals.runtime.env` (eski @astrojs/cloudflare
// deseni) kullanıyordu — `npx astro check` bunu GERÇEK bir hata olarak
// yakaladı: kurulu adapter sürümünde (`^14.2.5`) bu erişim yolu KALDIRILDI
// (`node_modules/@astrojs/cloudflare/dist/utils/cf-helpers.js`'in kendi
// runtime uyarısı: "Astro.locals.runtime.env has been removed in Astro v6.
// Use 'import { env } from \"cloudflare:workers\"' instead."). Adapter'ın
// KENDİSİ de (`dist/fetch.js`, `dist/entrypoints/image-*-endpoint.js` vb.)
// artık bu yeni deseni kullanıyor — `lead.ts` buna göre güncellendi.
//
// `cloudflare:workers` resmi `@cloudflare/workers-types` paketiyle
// tiplenir ama bu proje o paketi KURMUYOR (tek bir sanal modül için yeni
// bir bağımlılık eklemek yerine, yalnızca gerçekten kullanılan `env`
// alanları için minimal bir ambient modül bildirimi yeterli).
//
// Yerelde (`astro dev`/`astro preview`) bu değerler proje kökündeki
// `.dev.vars` dosyasından (gitignore'da, bkz. `.dev.vars.example` şablonu)
// wrangler'ın standart mekanizmasıyla otomatik okunur. Canlıda (Cloudflare
// Pages) `wrangler secret put <ad>` veya Pages panelinden ayarlanır.
declare module 'cloudflare:workers' {
  export const env: {
    /** SendGrid Mail Send API anahtarı — HENÜZ YOK (2026-09-02, kullanıcı
     * bekleniyor). Anahtar gelince yalnızca `.dev.vars`/Cloudflare Pages
     * env değişkenine yazılması yeterli, kod DEĞİŞMEZ (bkz. `lead.ts`). */
    SENDGRID_API_KEY?: string;
    /** SendGrid'de "gönderen" olarak doğrulanmış (Sender Authentication)
     * e-posta adresi — SendGrid, doğrulanmamış bir `from` adresini
     * reddeder, bu yüzden anahtarla BİRLİKTE ayarlanması gerekir. */
    SENDGRID_FROM_EMAIL?: string;
    /** Form bildirimlerinin gideceği gerçek idenfit e-posta kutusu. */
    LEAD_NOTIFICATION_EMAIL?: string;
    /** reCAPTCHA v3 (skeleton, bkz. `lead.ts`'teki `verifyRecaptcha()`
     * yorumu) — sunucu tarafı doğrulama secret'ı. */
    RECAPTCHA_SECRET_KEY?: string;
    /** Cloudflare Browser Rendering binding (`wrangler.json`'daki
     * `browser.binding`) — İK Dijital Olgunluk Testi PDF üretimi (ADIM 4)
     * `@cloudflare/puppeteer`'ın `launch(env.BROWSER)`'ına geçiriliyor.
     * Tip `any` — yalnızca bu tek binding için `@cloudflare/workers-types`
     * kurmak yerine minimal bırakıldı (dosyanın stated ilkesi). */
    BROWSER: any;
    /** GÜVENLİK (2026-09-04) — `/api/maturity-pdf`'in paylaşılan pilot
     * secret'ı. Bu endpoint yalnızca deploy-sonrası manuel test içindir;
     * tanımlı DEĞİLSE endpoint tamamen 404 döner (varsayılan/güvenli
     * durum). Kullanıcı kendi güçlü/rastgele bir değer üretip
     * `.dev.vars`/Cloudflare Pages env'e yazacak, aynı değeri
     * `X-Pilot-Secret` header'ında göndermeli. */
    MATURITY_PDF_PILOT_SECRET?: string;
  };
}
