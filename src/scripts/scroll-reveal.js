// Ana sayfanın GRUP 1/2/3 bölümlerindeki scroll-triggered fade-up animasyonu
// (`.reveal` sınıfı olan öğeler, bkz. global.css). Bir ES module olduğu
// için birden fazla component'te `<script src="../scripts/scroll-reveal.js">`
// ile import edilse bile tarayıcı aynı URL'i yalnızca BİR KEZ çalıştırır
// (module dedupe) — ayrı bir "başlatıcı" component'e gerek yok.
//
// `prefers-reduced-motion: reduce` açıksa (işletim sistemi düzeyinde
// "hareketi azalt") IntersectionObserver hiç kurulmuyor — CSS zaten
// `.reveal`'ı bu durumda tam görünür/animasyonsuz yapıyor (bkz.
// global.css), burada da gözlemci kurulmayarak gereksiz iş yapılmıyor.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealElements = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  // Hareket azaltılmış veya tarayıcı IntersectionObserver desteklemiyor —
  // tüm öğeleri doğrudan görünür yap.
  revealElements.forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
  );

  revealElements.forEach((el) => observer.observe(el));
}
