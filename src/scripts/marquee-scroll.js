// Marquee bar'ı scroll yönüne göre gösterip gizler (aşağı kaydırırken
// gizlenir, yukarı kaydırırken/sayfanın en üstündeyken tekrar görünür).
//
// 2026-07-31 (5. tur) — bu özellik 4. turda TAMAMEN kaldırılmıştı (3 ayrı
// düzeltme denemesi titremeyi gideremediği için, bkz. CLAUDE.md'nin o
// günlüğü) ama kullanıcı marquee'nin GERÇEKTEN scroll'da gizlenmesini
// istediğini netleştirdi — geri getirildi. Bu turda AYRICA bulunup
// düzeltilen gerçek kök neden (`<header>`'ın `backdrop-blur`'ü, bkz.
// Header.astro) artık kaldırılmış durumda — önceki 3 deneme SIRASINDA
// backdrop-blur hâlâ vardı ve sticky+backdrop-filter+layout-değişikliği
// üçlüsü asıl jank kaynağıydı. Playwright ile ÖLÇÜLDÜ (frame-timing,
// yalnızca CLS değil): backdrop-blur olmadan aynı `grid-template-rows`
// tekniği artık gerçek frame-drop/jank ÜRETMİYOR (bkz. CLAUDE.md günlüğü,
// `scripts/verify-marquee-scroll.mjs`) — CLS'in kendisi (Web Vitals'ın
// "ne kadar hareket etti" ölçümü) hâlâ sıfır değil çünkü bu KASITLI,
// smooth bir animasyon (250ms, her frame'i zamanında teslim ediliyor) —
// bu, "titreme" (dropped frame/jank) ile "beklenen görsel hareket" (CLS)
// arasındaki farkı gösteriyor: ilki koddu, ikincisi doğal/beklenen.
//
// State/hysteresis mantığı (2026-07-31, önceki turdan korunan gerçek
// bug düzeltmeleri):
// - `isHidden` bayrağı: `setHidden()` hedef değer MEVCUT durumla aynıysa
//   DOM'a hiç dokunmuyor (önceden sayfa en üstündeyken her scroll
//   frame'inde aynı değer boşuna yeniden yazılıyordu).
// - `MIN_TOGGLE_INTERVAL_MS` (250ms, geçiş süresiyle birebir): devam eden
//   bir geçiş bitmeden yeni bir GERÇEK toggle'a izin verilmiyor — yarıda
//   kesilen/tersine dönen bir geçiş görünür bir "sıçrama"ya yol açardı.
//
// EŞİK (12px): momentum/inertial scroll TEK bir "aşağı kaydırma"
// hareketinde bile onlarca küçük (1-3px) scroll event'i üretebiliyor —
// eşiksiz haliyle bar bunlara tepki verip arka arkaya aç/kapa yapardı.
// `lastY` yalnızca eşiği aşan GERÇEK bir yön değişiminde güncelleniyor.
const wrap = document.getElementById('marquee-wrap');

if (wrap) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const THRESHOLD = 12;
  const MIN_TOGGLE_INTERVAL_MS = 250;
  let lastY = window.scrollY;
  let ticking = false;
  let isHidden = false;
  let lastToggleAt = 0;
  // Test/ölçüm amaçlı — Playwright bu sayacı okuyarak gerçek DOM yazımı
  // sayısını doğruluyor (bkz. scripts/verify-marquee-scroll.mjs).
  window.__marqueeToggleCount = 0;

  const setHidden = (hidden) => {
    if (hidden === isHidden) return; // state gerçekten değişmiyorsa DOM'a HİÇ dokunma
    const now = performance.now();
    if (now - lastToggleAt < MIN_TOGGLE_INTERVAL_MS) return; // devam eden geçiş kesilmesin
    isHidden = hidden;
    lastToggleAt = now;
    window.__marqueeToggleCount++;
    wrap.style.gridTemplateRows = hidden ? '0fr' : '1fr';
  };

  const handleScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const currentY = window.scrollY;
      if (currentY <= 0) {
        setHidden(false);
        lastY = currentY;
      } else if (Math.abs(currentY - lastY) > THRESHOLD) {
        setHidden(currentY > lastY);
        lastY = currentY;
      }
      ticking = false;
    });
  };

  if (!prefersReducedMotion) {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
}
