/**
 * Hero e-posta aktarımı — PAYLAŞILAN anahtar + okuyucu.
 *
 * GÜVENLİK (Y2): ana sayfa hero'sundaki tek-alanlı form, e-postayı Online
 * Sunum Talebi sayfasına ARTIK `?email=...` query string'iyle DEĞİL,
 * `sessionStorage` üzerinden taşıyor — gerekçenin tamamı
 * `src/scripts/hero-email-handoff.js` dosya başı yorumunda.
 *
 * Bu dosya hem o script (yazan taraf) hem `HeroForm.tsx`/
 * `PresentationRequestForm.tsx` (okuyan taraf) tarafından import ediliyor —
 * anahtar adı tek yerde tanımlı, iki kopya arasında sessiz bir uyuşmazlık
 * oluşamaz.
 */
export const HANDOFF_EMAIL_KEY = 'idenfit:handoff-email';

/**
 * Aktarılan e-postayı BİR KEZ okur ve hemen siler (geri/ileri gezinmede
 * tekrar doldurmasın).
 *
 * `sessionStorage` boşsa URL query string'ine düşer: JS'siz veya depolamayı
 * engelleyen tarayıcılarda form native GET davranışına düştüğü için e-posta
 * yine `?email=` ile gelir (bkz. handoff script'indeki fallback notu).
 * O dar senaryoda eski URL davranışı geçerli — bilinçli bir ödün, yoksa
 * özellik o tarayıcılarda tamamen çalışmaz olurdu.
 *
 * Yalnızca CLIENT'ta çağrılmalı (`useEffect` içinde) — SSR'da `window` yok.
 */
export function takeHandoffEmail(): string | null {
  try {
    const stored = window.sessionStorage.getItem(HANDOFF_EMAIL_KEY);
    if (stored) {
      window.sessionStorage.removeItem(HANDOFF_EMAIL_KEY);
      return stored;
    }
  } catch {
    // Depolama engelli (private mode, site verisi kapalı) — fallback'e düş.
  }
  return new URLSearchParams(window.location.search).get('email');
}
