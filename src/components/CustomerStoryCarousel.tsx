import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import YoutubeClickToPlay from './YoutubeClickToPlay';

interface CardBase {
  key: string;
  companyName: string;
  logoUrl: string;
  logoWidth: number;
  logoHeight: number;
  readMoreLabel: string;
  readMoreHref: string;
}

export interface VideoCardData extends CardBase {
  type: 'video';
  videoUrl: string;
  headline: string;
  playLabel: string;
}

export interface QuoteCardData extends CardBase {
  type: 'quote';
  quoteText: string;
  personName?: string;
  personRole?: string;
  photoUrl?: string;
}

export interface StatCardData extends CardBase {
  type: 'stat';
  headline: string;
  primaryStat: string;
  secondaryStat?: string;
}

export type CustomerCarouselCardData = VideoCardData | QuoteCardData | StatCardData;

export interface CustomerStoryCarouselProps {
  cards: CustomerCarouselCardData[];
  regionLabel: string;
  prevLabel: string;
  nextLabel: string;
}

// Personio tarzı, kart genişliği + gap'e göre bir "sayfa" kadar kaydıran ok
// butonlu carousel (2026-08-20). `TestimonialCarousel.tsx`'in aksine kartlar
// TÜRE göre farklı içerik/boyut taşıdığı için (video/alıntı/istatistik) sabit
// panel yükseklikli grid-stack DEĞİL, native `scroll-snap` ile yatay kaydırma
// kullanılıyor — her kart kendi doğal yüksekliğinde kalabiliyor.
//
// DÜZELTME (2026-08-20, kullanıcı isteği: "daha büyük canlı ve arka planının
// tonu bizim isteğimize uyacak şekilde"): kartlar büyütüldü (340→420px) +
// arka plan, hero'daki dashboard widget'ının ÇERÇEVESİYLE (`HeroSection.astro`,
// `linear-gradient(#FFDCDC→#FFF3F3→#FFFFFF→#FFF3F3→#FFDCDC)`) AYNI kırmızı
// tonlu gradyan ailesine çevrildi — widget'ın HEMEN ALTINDAki bu carousel'in
// üç kart tipi de artık aynı marka tonunu paylaşıyor (önceki turda video/
// alıntı beyaz, yalnızca istatistik pembe idi — tutarsızdı).
//
// DÜZELTME (2026-08-20, İKİNCİ tur — Beyaz Fırın kartı eklenirken aynı
// mesajda gelen "kartların boyutları ve puntoları biraz daha büyüsün"
// isteği): 420→480px + tüm iç yazı boyutları bir kademe daha büyütüldü.
const CARD_SCROLL_AMOUNT = 512;
const CARD_BG_GRADIENT = 'linear-gradient(160deg, #FFFFFF 0%, #FFF3F3 55%, #FFDCDC 100%)';
const CARD_SHADOW = 'shadow-[0_10px_34px_rgba(138,0,0,0.12)]';

function CardLogo({ url, width, height, alt }: { url: string; width: number; height: number; alt: string }) {
  return <img src={url} alt={alt} width={width} height={height} loading="lazy" className="h-8 w-auto object-contain opacity-80" />;
}

function ReadMoreLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="group/link mt-6 inline-flex items-center gap-1.5 text-lg font-semibold text-brand">
      {label}
      <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-200 group-hover/link:translate-x-1" />
    </a>
  );
}

function VideoCard({ card }: { card: VideoCardData }) {
  return (
    <div
      className={`flex h-full flex-col rounded-[1.75rem] p-7 ring-1 ring-white/70 transition-transform duration-300 hover:-translate-y-1 ${CARD_SHADOW}`}
      style={{ background: CARD_BG_GRADIENT }}
    >
      <div className="aspect-video w-full overflow-hidden rounded-[16px] shadow-[0_5px_15px_rgba(0,0,0,0.2)]">
        <YoutubeClickToPlay videoUrl={card.videoUrl} title={card.companyName} playLabel={card.playLabel} />
      </div>
      <p className="mt-6 flex-1 text-lg leading-relaxed text-body">{card.headline}</p>
      <div className="mt-3 flex items-center justify-between">
        <CardLogo url={card.logoUrl} width={card.logoWidth} height={card.logoHeight} alt={card.companyName} />
      </div>
      <ReadMoreLink href={card.readMoreHref} label={card.readMoreLabel} />
    </div>
  );
}

function QuoteCard({ card }: { card: QuoteCardData }) {
  return (
    <div
      className={`flex h-full flex-col rounded-[1.75rem] p-8 ring-1 ring-white/70 transition-transform duration-300 hover:-translate-y-1 ${CARD_SHADOW}`}
      style={{ background: CARD_BG_GRADIENT }}
    >
      {card.photoUrl && (
        <img src={card.photoUrl} alt="" loading="lazy" className="h-20 w-20 rounded-full object-cover ring-2 ring-white" />
      )}
      <blockquote className="mt-6 flex-1">
        <p className="line-clamp-6 text-lg leading-relaxed text-body">&ldquo;{card.quoteText}&rdquo;</p>
      </blockquote>
      {(card.personName || card.personRole) && (
        <div className="mt-6">
          {card.personName && <p className="text-lg font-bold text-heading">{card.personName}</p>}
          {card.personRole && <p className="text-base text-muted">{card.personRole}</p>}
        </div>
      )}
      <div className="mt-6 flex items-center justify-between">
        <CardLogo url={card.logoUrl} width={card.logoWidth} height={card.logoHeight} alt={card.companyName} />
      </div>
      <ReadMoreLink href={card.readMoreHref} label={card.readMoreLabel} />
    </div>
  );
}

function StatCard({ card }: { card: StatCardData }) {
  return (
    <div
      className={`flex h-full flex-col rounded-[1.75rem] p-8 ring-1 ring-white/70 transition-transform duration-300 hover:-translate-y-1 ${CARD_SHADOW}`}
      style={{ background: CARD_BG_GRADIENT }}
    >
      <p className="text-6xl font-bold leading-tight text-brand">{card.primaryStat}</p>
      {card.secondaryStat && <p className="mt-2 text-2xl font-medium text-heading">{card.secondaryStat}</p>}
      <p className="mt-6 flex-1 text-lg leading-relaxed text-body">{card.headline}</p>
      <div className="mt-6 flex items-center justify-between">
        <CardLogo url={card.logoUrl} width={card.logoWidth} height={card.logoHeight} alt={card.companyName} />
      </div>
      <ReadMoreLink href={card.readMoreHref} label={card.readMoreLabel} />
    </div>
  );
}

// Otomatik kaydırma aralığı (ms) — `TestimonialCarousel.tsx`'in 6sn'lik
// otomatik geçişiyle AYNI değer (projede zaten kanıtlanmış bir süre).
const AUTOPLAY_INTERVAL_MS = 6000;
// Son karta ne kadar yaklaşınca "sona gelindi" sayılıp başa sarılacağı —
// kart genişliği + gap'ten (`w-[480px]`+`gap-10`=40px) daha küçük bir pay,
// yuvarlama hatalarına karşı tolerans.
const LOOP_THRESHOLD_PX = 20;

export default function CustomerStoryCarousel({ cards, regionLabel, prevLabel, nextLabel }: CustomerStoryCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const scrollBy = (amount: number) => {
    trackRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // Otomatik kaydırma (2026-08-20, kullanıcı isteği: "slider kendi kendine
  // kayacak şekilde tasarlansın") — `TestimonialCarousel.tsx`'in AYNI
  // duraklama/erişilebilirlik ilkesi: hover/focus'ta VEYA
  // `prefers-reduced-motion` tercihinde durur. Sona gelinince (son kartın
  // sağ kenarına ulaşılınca) başa smooth-scroll ile sarılır — sonsuz döngü
  // hissi.
  useEffect(() => {
    (window as any).__csc_effect_runs = ((window as any).__csc_effect_runs || 0) + 1;
    (window as any).__csc_paused = paused;
    if (paused || cards.length <= 1) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      (window as any).__csc_ticks = ((window as any).__csc_ticks || 0) + 1;
      const track = trackRef.current;
      if (!track) return;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - LOOP_THRESHOLD_PX;
      if (atEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: CARD_SCROLL_AMOUNT, behavior: 'smooth' });
      }
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, cards.length]);

  if (cards.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        role="region"
        aria-label={regionLabel}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(e) => {
          // `relatedTarget` kartların İÇİNDE kalıyorsa (ör. bir linkten
          // komşu linke Tab ile geçiş) duraklama devam etmeli — yalnızca
          // odak GERÇEKTEN carousel'in dışına çıktığında devam etsin.
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
        }}
        className="flex snap-x snap-mandatory gap-10 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <div key={card.key} className="w-[360px] shrink-0 snap-start sm:w-[480px]">
            {card.type === 'video' && <VideoCard card={card} />}
            {card.type === 'quote' && <QuoteCard card={card} />}
            {card.type === 'stat' && <StatCard card={card} />}
          </div>
        ))}
      </div>

      {cards.length > 1 && (
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-CARD_SCROLL_AMOUNT)}
            aria-label={prevLabel}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-body transition-colors hover:border-brand hover:text-brand"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(CARD_SCROLL_AMOUNT)}
            aria-label={nextLabel}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-body transition-colors hover:border-brand hover:text-brand"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
