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
      // Kaynakta bu animasyon metin kolonundan (924px) BAĞIMSIZ, sabit
      // 1220px genişlikte render ediliyor (`e-lottie__container`, canlı
      // sayfada `getComputedStyle` ile ölçüldü). İlk denemede bunu
      // `scale-[1.35]` (kapsayıcının kendi ~960px genişliğini büyüten bir
      // transform) ile taklit ettik — ama üst bloğun `overflow-hidden`'ı
      // büyüyen kısmı YANLARDAN KIRPIYORDU (kullanıcı bulgusu: "yandan
      // kesik duruyor"). Kök neden: transform kutunun GERÇEK genişliğini
      // değiştirmiyor, yalnızca GÖRSEL olarak taşırıyor — kırpma açık
      // olduğu sürece kaçınılmazdı. Düzeltme: `overflow-hidden` üst
      // bloktan kaldırıldı (bkz. o dosyadaki not) VE burada artık gerçek
      // genişlik `w-screen` + `left-1/2 -translate-x-1/2` ("full-bleed"
      // deseni — bu blok kendi mx-auto'lu üst konteynerinde ortalı
      // olduğu için, bu ortalama viewport ortalamasıyla ÇAKIŞıYOR, ekstra
      // bir viewport-genişliği hesaplamasına gerek yok) ile viewport'a
      // göre ortalanıyor, `max-w-[1220px]` kaynağın kendi sabit
      // genişliğini üst sınır olarak koruyor (büyük ekranlarda aşırı
      // genişlemeyi önler, küçük ekranlarda `w-screen` doğal olarak
      // daralır — hiçbir zaman kırpılmaz).
      className="pointer-events-none absolute left-1/2 top-0 -z-10 w-screen max-w-[1220px] -translate-x-1/2 opacity-90"
    />
  );
}
