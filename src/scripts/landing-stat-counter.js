// İstatistik şeridi (Landing Page /demo) — scroll-tetiklemeli sayı sayma.
// `scroll-reveal.js` ile AYNI IntersectionObserver deseni (bkz. o dosya);
// ayrı script çünkü bu yalnızca opacity/transform değil gerçek sayısal
// içeriği (`textContent`) güncelliyor. `prefers-reduced-motion` açıksa
// (veya IntersectionObserver desteklenmiyorsa) ara adımlar oynatılmadan
// doğrudan hedef değere atlanır.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const counters = document.querySelectorAll('[data-stat-counter]');

function formatValue(el, value) {
  const suffix = el.dataset.suffix ?? '';
  return `${value.toLocaleString('tr-TR')}${suffix}`;
}

function setFinalValue(el) {
  const target = Number(el.dataset.target ?? '0');
  el.textContent = formatValue(el, target);
}

function animateCounter(el) {
  const target = Number(el.dataset.target ?? '0');
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatValue(el, Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  counters.forEach(setFinalValue);
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.4 },
  );
  counters.forEach((el) => observer.observe(el));
}
