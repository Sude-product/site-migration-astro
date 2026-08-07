// Hero panelinin dekoratif nabız/halka bileşeni (2026-08-07) — eski tek
// Lottie halkanın (`MaturityArcDecoration.tsx`) YERİNE geçti (karar
// netleşti, bkz. CLAUDE.md). Kırmızı panelin ortasında, form kartının
// ARKASINDA (`z-0`, form kartı `z-10`) render edilir.
//
// Önceki tur bu component'e 4 özellik kartı da render ettiriyordu (izole
// pilot önizlemesi için) — o kartlar artık gerçek ürün modülleriyle
// dolu Bento Grid'e taşındığı için (`LandingBentoGrid.astro`) buradan
// kaldırıldı, tekrar oluşmasın diye. Bu component artık SADECE dekorasyon.
//
// Renkler kullanıcı tarafından verildi (marka kırmızısının koyu/orta/açık
// tonları, mevcut `--color-brand` ailesiyle aynı renk grubu — yeni bir
// renk ailesi icat edilmedi): #791F1F merkez daire zemini, #E24B4A halka
// rengi, #F09595 merkez dairenin açık kenarlığı.
//
// Yıldız path'i `IdenfitLogo.tsx`'teki GERÇEK son path elemanından
// (kaynak SVG'nin sağ üst köşesindeki yıldız aksanı) birebir kopyalandı.
//
// Performans: sürekli döngüdeki halka animasyonu yalnızca CSS
// transform/opacity kullanıyor (layout tetiklemiyor) — header flicker
// dersinin (bkz. CLAUDE.md 2026-07-31, backdrop-filter+position:sticky
// kombinasyonu) burada da uygulanması. `.lp-ring` keyframe'i +
// `prefers-reduced-motion: reduce` override'ı `global.css`'te.
//
// 2026-08-07 GÜÇLENDİRME (kullanıcı isteği — "daha görünür/etkileyici"):
// boyut büyütüldü (h-80→h-96 lg), halka kalınlığı 2px→3px, dış halka
// canlı marka kırmızısına (`var(--color-brand)`) çekildi (iç 2 halka
// kullanıcı onaylı `#E24B4A` tonunda kaldı — tam tek renk yerine kademeli
// bir canlılık geçişi) + merkez daireye `box-shadow` glow eklendi.
export default function LandingPulseDecoration() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 z-0 flex h-72 w-72 -translate-x-1/2 -translate-y-1/2 items-center justify-center lg:h-96 lg:w-96"
    >
      {[0, 0.8, 1.6].map((delay, i) => (
        <span
          key={delay}
          className="lp-ring absolute inset-0 rounded-full border-[3px]"
          style={{ borderColor: i === 2 ? 'var(--color-brand)' : '#E24B4A', animationDelay: `${delay}s` }}
        />
      ))}
      <div
        className="relative flex h-32 w-32 items-center justify-center rounded-full border-2 lg:h-40 lg:w-40"
        style={{ backgroundColor: '#791F1F', borderColor: '#F09595', boxShadow: '0 0 60px 10px rgba(255,0,0,0.35)' }}
      >
        <svg
          viewBox="85 1 13 13"
          className="h-14 w-14 lg:h-16 lg:w-16"
          style={{ transform: 'rotate(-12deg)' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M95.0963 13.2725C94.9391 13.2725 94.7844 13.2209 94.6529 13.1436L91.7629 11.3724L88.8729 13.1436C88.5867 13.3266 88.2232 13.3008 87.9345 13.1178C87.6483 12.909 87.5168 12.5712 87.5968 12.2335L88.3779 8.92588L85.7999 6.71391C85.5395 6.47931 85.4363 6.14158 85.5395 5.80386C85.6426 5.46613 85.9288 5.25731 86.2691 5.23153L89.6798 4.94536L90.9817 1.82077C91.1106 1.50882 91.4252 1.3 91.7629 1.3C92.1006 1.3 92.4126 1.50882 92.544 1.82077L93.846 4.94536L97.2309 5.23153C97.5687 5.25731 97.8548 5.49191 97.9605 5.80386C98.0636 6.14158 97.9605 6.48188 97.7001 6.71391L95.1479 8.92588L95.929 12.2335C96.0064 12.5712 95.8775 12.9115 95.5913 13.1178C95.4624 13.2209 95.2794 13.2751 95.0963 13.2751V13.2725Z"
            fill="var(--color-brand)"
          />
        </svg>
      </div>
    </div>
  );
}
