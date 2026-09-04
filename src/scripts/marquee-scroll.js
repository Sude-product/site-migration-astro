// Marquee bar'ı yalnızca sayfanın EN ÜSTÜNDEYKEN gösterir, en ufak bir
// aşağı kaydırmada gizler — idenfit.com'un canlı davranışı budur (kullanıcı
// isteği, 2026-09-01). Önceki sürüm scroll YÖNÜNE göre çalışıyordu (aşağı
// kaydırınca gizlenip yukarı kaydırınca geri geliyordu) — bu davranış
// KALDIRILDI, artık tek kural: `scrollY <= 0` mi değil mi.
//
// `grid-template-rows` geçiş tekniği (`Header.astro`'daki `#marquee-wrap`)
// ve `<header>`'ın `backdrop-blur`'ünün kaldırılmış olması (2026-07-31'de
// bulunan asıl jank kaynağı) aynen korunuyor — bu ikisi olmadan geçiş
// titrerdi, bkz. `scripts/verify-marquee-scroll.mjs`.
const wrap = document.getElementById('marquee-wrap');

if (wrap) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MIN_TOGGLE_INTERVAL_MS = 250; // geçiş süresiyle (250ms) birebir — yarıda kesilen bir geçiş görünür sıçramaya yol açar
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
      setHidden(window.scrollY > 0);
      ticking = false;
    });
  };

  if (!prefersReducedMotion) {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
}
