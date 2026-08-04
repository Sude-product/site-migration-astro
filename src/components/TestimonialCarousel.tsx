import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TestimonialItem {
  quote: string;
  name: string;
  jobTitle: string;
  photoUrl: string;
}

export interface TestimonialCarouselProps {
  testimonials: TestimonialItem[];
  prevLabel: string;
  nextLabel: string;
}

const AUTOPLAY_INTERVAL_MS = 6000;

// Ana sayfanın testimonial bölümü — kaynak sitede Elementor'un
// "testimonial-carousel" widget'ı, ok butonlarıyla 2 tanık arasında geçiş
// yapılıyor (bkz. docs/homepage-sections-report.md §11). Bu, `/musteriler/`
// sayfasındaki 5 müşteri hikayesinden TAMAMEN FARKLI 2 yeni tanık.
//
// 2026-07-27: fade+slide geçişi, sabit panel yüksekliği, dot geçiş
// animasyonu, `prefers-reduced-motion` desteği ve hover/focus'ta
// duraklayan otomatik geçiş eklendi (bkz. CLAUDE.md).
//
// Sabit yükseklik CSS Grid "stack" tekniğiyle sağlanıyor — JS ile hiçbir
// şey ölçülmüyor: tüm slaytlar `grid-area`si aynı olan (col-start-1
// row-start-1) elemanlar olarak render edilir, tarayıcı konteyneri
// otomatik olarak EN UZUN slaytın yüksekliğine göre boyutlandırır; yalnızca
// aktif slayt opacity/translate ile görünür kılınır. Bu, farklı tanıkların
// metin uzunluğu farklı olsa bile layout shift olmamasını garantiler.
export default function TestimonialCarousel({ testimonials, prevLabel, nextLabel }: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;

  const goPrev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + total) % total);
  };
  const goNext = () => {
    setDirection(1);
    setIndex((i) => (i + 1) % total);
  };

  // Otomatik geçiş — kart hover/focus edilince VEYA `prefers-reduced-motion`
  // tercih edilmişse durur (2 sn içinde döngü index her değiştiğinde
  // yeniden başlar, böylece manuel bir tıklamadan hemen sonra beklenmedik
  // bir otomatik atlama olmaz).
  useEffect(() => {
    if (total <= 1 || paused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [total, paused, index]);

  if (total === 0) return null;

  const inactiveOffsetClass = direction === 1 ? '-translate-x-3' : 'translate-x-3';

  return (
    <div
      className="rounded-2xl border border-gray-100 bg-surface p-6 shadow-sm sm:p-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="grid">
        {testimonials.map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            aria-hidden={i !== index}
            className={`col-start-1 row-start-1 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:duration-0 ${
              i === index ? 'opacity-100 translate-x-0' : `pointer-events-none opacity-0 ${inactiveOffsetClass}`
            }`}
          >
            <blockquote>
              <p className="text-base leading-relaxed text-body">&ldquo;{t.quote}&rdquo;</p>
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <img src={t.photoUrl} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-heading">{t.name}</p>
                <p className="text-sm text-muted">{t.jobTitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2" aria-hidden="true">
          {testimonials.map((t, i) => (
            <span
              key={`${t.name}-dot-${i}`}
              className={`h-1.5 rounded-full transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:duration-0 ${
                i === index ? 'w-4 bg-brand' : 'w-1.5 bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label={prevLabel}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-body transition-colors hover:border-brand hover:text-brand"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label={nextLabel}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-body transition-colors hover:border-brand hover:text-brand"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
