// idenfit.com üst duyuru barı — 5 modül sağdan sola sürekli akar.
// Modül isimleri uluslararası (i18n gerekmez). Tüm dillerde aynı görünür.
//
// Salt CSS animasyonu (`animate-marquee`, `group-hover` ile duraklama) —
// hiçbir React state/etkileşim gerektirmiyor. Scroll'a göre gösterip
// gizleme mantığı BİLİNÇLİ OLARAK burada DEĞİL, vanilla JS script'te
// (`src/scripts/marquee-scroll.js`) — React state'in her scroll tick'inde
// re-render tetiklemesi jank'a yol açtığı için taşındı (bkz. Header.astro'daki
// `#marquee-wrap` sarmalayıcı + script notu).
const MODULES = [
  'Performance Management',
  'People Services',
  'Self HR Services',
  'OKR/KPI',
  'AI Agents',
] as const;

function Star() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
    </svg>
  );
}

export default function MarqueeBar() {
  // 2 kez arka arkaya → sonsuz döngüde boşluk oluşmaz.
  const sequence = [...MODULES, ...MODULES];

  return (
    <div className="group overflow-hidden bg-marquee-bg" role="region" aria-label="Modül duyurusu">
      <div className="flex w-max items-center whitespace-nowrap will-change-transform animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {sequence.map((module, i) => (
          <span
            key={i}
            // İkinci kopya yalnızca görsel; ekran okuyucudan gizle.
            aria-hidden={i >= MODULES.length ? true : undefined}
            className="flex items-center gap-2 px-6 py-1.5 text-sm font-semibold text-brand"
          >
            <Star />
            {module}
          </span>
        ))}
      </div>
    </div>
  );
}
