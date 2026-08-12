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

// Yarım kopya (aşağıdaki `sequence`'ın YARISI, `-50%` kaymanın hedefi)
// tek bir `MODULES` turundan ibaretse (~850px) geniş masaüstü
// viewport'larında (>~900px) track'in kalan genişliği viewport'tan önce
// biter — döngü sıfırlanana kadar zemin (boş) görünür, "duraklama/boşluk"
// hissi verir (2026-08-11'de bulunan gerçek kök neden, bkz. `global.css`
// `@keyframes marquee` yorumu). Her yarı `MODULES`'ı `HALF_REPEAT` kez
// tekrarlayarak (~4×~850px≈3400px) gerçekçi her masaüstü genişliğini
// aşıyor — 2-yarı/`-50%` matematiği aynı kalıyor, yalnızca her yarının
// kendi içeriği büyüyor.
const HALF_REPEAT = 5;
const HALF = Array.from({ length: HALF_REPEAT }, () => MODULES).flat();

function Star() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
    </svg>
  );
}

export default function MarqueeBar() {
  // 2 yarı (her biri HALF_REPEAT kez `MODULES`) arka arkaya → sonsuz
  // döngüde boşluk oluşmaz (yeterince geniş her iki yarı için de).
  const sequence = [...HALF, ...HALF];

  return (
    <div
      className="group flex h-[50px] items-center overflow-hidden border-b-[1.5px] border-marquee-border bg-marquee-bg"
      role="region"
      aria-label="Modül duyurusu"
    >
      <div className="flex w-max items-center gap-5 whitespace-nowrap will-change-transform animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {sequence.map((module, i) => (
          <span
            key={i}
            // İlk tur dışındaki tüm kopyalar yalnızca görsel; ekran
            // okuyucudan gizle (içerik zaten bir kez duyurulmuş oluyor).
            aria-hidden={i >= MODULES.length ? true : undefined}
            className="inline-flex items-center gap-2 text-sm font-semibold text-marquee-text"
          >
            <Star />
            {module}
          </span>
        ))}
      </div>
    </div>
  );
}
