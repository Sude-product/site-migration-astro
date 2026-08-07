import { useEffect, useRef } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';

// Kaynakta (`uzun.json`) 8 katmanlı, kırmızıdan şeffafa geçen radyal
// gradyan glow'lardan oluşan bir Lottie animasyonu — hero'nun arkasında
// dekoratif bir "yay" oluşturuyor (bkz. CLAUDE.md 2026-07-29 KEŞİF notu,
// İK Dijital Olgunluk Testi hero'sunda ilk kullanımı). `lottie-web` ile
// birebir, kaynağın kendi JSON dosyası kullanılarak
// (public/lottie/hr-maturity-arc.json, aynı `uzun.json`) oynatılıyor.
// `HrMaturityTest.tsx` ile Landing Page arasında paylaşılan component
// (2026-08-06, bkz. CLAUDE.md — landing page'in dekoratif paneli için
// kullanıcı onaylı fallback referansı).
export default function MaturityArcDecoration() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let anim: AnimationItem | undefined;
    anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/lottie/hr-maturity-arc.json',
    });
    return () => anim?.destroy();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 opacity-90"
    />
  );
}
