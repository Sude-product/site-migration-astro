// reCAPTCHA v3 istemci entegrasyonu (2026-09-04) — `src/pages/api/lead.ts`'in
// `verifyRecaptcha()` iskeleti artık gerçek bir token alıyor.
//
// **Site key GİZLİ DEĞİL** — reCAPTCHA'nın tasarımı gereği HTML'e gömülür ve
// herkes tarafından görülebilir; gizli olan tarafı sunucudaki
// `RECAPTCHA_SECRET_KEY`. Bu yüzden burada sabit tutuluyor: `PUBLIC_*` bir
// env değişkeni Astro'da BUILD zamanında okunur, ama Cloudflare secret'ları
// RUNTIME'da enjekte ediliyor — ikisi aynı ana denk gelmediği için env
// yoluna gitmek gereksiz kırılganlık olurdu.
const SITE_KEY = '6LfCsKgtAAAAAIeA4X6wnUA25VmkosHjZfEs-v4Z';

const SCRIPT_SRC = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;

interface Grecaptcha {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

/** Script yalnızca BİR kez yüklenir — 6 formun hepsi aynı promise'i paylaşır. */
let loader: Promise<Grecaptcha | null> | null = null;

function loadRecaptcha(): Promise<Grecaptcha | null> {
  if (loader) return loader;

  loader = new Promise<Grecaptcha | null>((resolve) => {
    if (window.grecaptcha) {
      resolve(window.grecaptcha);
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    // Script yüklenemezse (reklam/izleme engelleyici, ağ hatası, Google'a
    // erişilemeyen ağ) `null` döner — çağıran taraf bunu token'sız gönderime
    // çevirmez, bkz. `getRecaptchaToken()` yorumu.
    script.onerror = () => resolve(null);
    script.onload = () => {
      const g = window.grecaptcha;
      if (!g) {
        resolve(null);
        return;
      }
      g.ready(() => resolve(g));
    };
    document.head.appendChild(script);
  });

  return loader;
}

/**
 * Bir form gönderimi için reCAPTCHA v3 token'ı üretir.
 *
 * `action` Google konsolunda gönderimleri ayırt etmek için kullanılıyor
 * (her formun kendi adı) — skor analizinde hangi formun ne kadar bot
 * trafiği aldığını görmeyi sağlar.
 *
 * **Token alınamazsa `null` döner.** Sunucu tarafı (`lead.ts`) secret
 * tanımlıyken token'sız isteği REDDEDER — yani reCAPTCHA'yı engelleyen bir
 * ziyaretçi formu gönderemez. Bu, reCAPTCHA kullanmanın kabul edilen
 * ödünü: alternatifi (token yoksa geç) korumayı tamamen anlamsız kılardı.
 */
export async function getRecaptchaToken(action: string): Promise<string | null> {
  try {
    const grecaptcha = await loadRecaptcha();
    if (!grecaptcha) return null;
    return await grecaptcha.execute(SITE_KEY, { action });
  } catch {
    return null;
  }
}
