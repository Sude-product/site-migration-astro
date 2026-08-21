import { useEffect, useRef, useState } from 'react';

export interface YoutubeClickToPlayProps {
  /** `youtu.be/<id>` kısa linki. */
  videoUrl: string;
  title: string;
  /** Play butonunun erişilebilir etiketi (i18n'den). */
  playLabel: string;
  /**
   * Kaynağın kendi "custom image overlay" illüstrasyonu (yalnızca ana
   * sayfanın "Neden idenfit?" videosunda kullanılıyor — bkz. VideoSection.astro).
   * Verilmezse (Müşteriler sayfasının video kartları gibi) YouTube'un
   * otomatik ürettiği gerçek thumbnail (`hqdefault.jpg`) + düz kırmızı
   * dairesel play butonu kullanılmaya devam eder — DAVRANIŞ DEĞİŞMEDİ.
   */
  posterUrl?: string;
}

// idenfit.com'un Müşteriler sayfasındaki video kartları Elementor'un
// "tıkla-oynat" widget'ını kullanıyor (`elementor-open-inline`) — sayfa
// yüklendiğinde kutu BOŞ, tıklanınca gerçek YouTube iframe'i yükleniyor.
// 2026-07-27'de canlı sitede doğrulandı: Femaş VE Civil'in video kutuları
// GERÇEKTEN boş/bozuk çıktı (kademeli scroll + bekleme sonrası bile hiçbir
// thumbnail/play butonu render olmadı — kaynağın kendi bug'ı). Biz bunu
// birebir kopyalamadık — kullanıcıya anlamsız bir boş kutu göstermek yerine
// GERÇEK YouTube thumbnail'i + play butonu + hover büyütme efektiyle
// ÇALIŞAN bir tıkla-oynat kartı kurduk (bilinçli iyileştirme, bkz. CLAUDE.md).
export default function YoutubeClickToPlay({ videoUrl, title, playLabel, posterUrl }: YoutubeClickToPlayProps) {
  const [playing, setPlaying] = useState(false);
  // `maxresdefault.jpg` YouTube tarafından HER video için üretilmiyor (bkz.
  // aşağıdaki <img>'in yorumu) — 2026-08-21 site-geneli görsel taramasında
  // `ru4gVy9-sOQ` (Müşteri Hikayeleri carousel'i, ana sayfada 5 dilde de
  // görünüyor) için gerçekten 404 verdiği doğrulandı. Elle her yeni video
  // eklendiğinde `curl` ile doğrulamaya güvenmek yerine (bu bug'ın kendisi
  // tam o varsayımın kırılganlığını gösteriyor) `hqdefault.jpg`'ye otomatik
  // düşen bir fallback eklendi. **`onError` DEĞİL** — YouTube, olmayan bir
  // maxres için HTTP 404 İLE BİRLİKTE hâlâ geçerli/çözümlenebilir küçük bir
  // placeholder JPEG (120×90, ~1KB gri kare) döndürüyor; tarayıcı bunu
  // başarıyla decode ettiği için `<img onError>` hiç tetiklenmiyor
  // (doğrulandı: `fetch` ile 404 + 1097 byte gövde). Bu yüzden `onLoad`'da
  // gerçek boyutu kontrol edilip placeholder'ın kendine özgü 120px genişliği
  // yakalanıyor. **İKİNCİ bir kontrol daha gerekti** — `loading="lazy"` ile
  // sunucudan gelen `<img>` HTML'i React hydrate OLMADAN ÖNCE tarayıcı
  // tarafından zaten yüklenebiliyor (özellikle carousel `client:visible`
  // gibi geç hydrate olan adalarda); bu durumda native `load` event'i React
  // event listener'ı henüz bağlanmadan ateşleniyor, `onLoad` hiç
  // tetiklenmiyor (`naturalWidth` doluyor ama `complete` React'in görmesi
  // İÇİN geç kalıyor — canlı testte doğrulandı). Bu yüzden mount anında
  // `imgRef.current.complete` da ayrıca kontrol ediliyor.
  const [maxresFailed, setMaxresFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth === 120) setMaxresFailed(true);
  }, []);
  const id = videoUrl.split('/').pop() ?? '';

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    );
  }

  // 2026-07-30: `posterUrl` verildiğinde kaynağın kendi custom overlay
  // illüstrasyonu + kendi play-butonu SVG'si kullanılıyor (canlı ana
  // sayfanın `content.rendered` HTML'inden birebir çıkarıldı — `<svg
  // viewBox="0 0 100 100">` iki path: %50 opak siyah daire + beyaz üçgen,
  // `#home-vid .elementor-custom-embed-play svg{width:43.42px}` ile
  // ölçülmüş, en yakın Tailwind ölçeği `h-11 w-11`/44px — bkz.
  // VideoSection.astro). `posterUrl` yoksa (Müşteriler kartları) eski
  // YouTube-thumbnail + düz kırmızı daire davranışı DEĞİŞMEDİ.
  if (posterUrl) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={playLabel}
        className="group relative block h-full w-full overflow-hidden bg-surface"
      >
        <img
          src={posterUrl}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-11 w-11 items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" aria-hidden="true" className="h-full w-full">
              <path
                d="M0 50C0 14.81 14.81 0 50 0C85.19 0 100 14.81 100 50C100 85.19 85.19 100 50 100C14.81 100 0 85.19 0 50Z"
                fill="black"
                fillOpacity="0.5"
              />
              <path
                d="M40.1333 38.3849C40.1333 36.0345 42.7136 34.597 44.7122 35.834L63.4785 47.4491C65.3733 48.6219 65.3733 51.3781 63.4785 52.5509L44.7122 64.166C42.7136 65.403 40.1333 63.9655 40.1333 61.6151V38.3849Z"
                fill="white"
              />
            </svg>
          </span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={playLabel}
      className="group relative block h-full w-full overflow-hidden bg-brand-light"
    >
      {/* ⚠️ DÜZELTME (2026-08-04): `hqdefault.jpg` YouTube'un düşük
          çözünürlüklü (480×360, 4:3) thumbnail'i — kaynağın gerçek video
          widget'ı 16:9 oranında (`--video-aspect-ratio:1.77777`,
          element-ID doğrulamalı) render ediyor. `maxresdefault.jpg`
          (1280×720, 16:9) hem çözünürlük hem oran olarak kaynakla
          birebir eşleşiyor — Müşteriler sayfasının 2 videosu için
          gerçekten var olduğu doğrulandı (`curl`, ikisi de 200 + gerçek
          dosya boyutu). YouTube HER videoda maxres üretmiyor — bu satırı
          yeni bir videoya taşırken önce mevcudiyeti doğrulanmalı. */}
      <img
        ref={imgRef}
        src={`https://img.youtube.com/vi/${id}/${maxresFailed ? 'hqdefault' : 'maxresdefault'}.jpg`}
        alt={title}
        loading="lazy"
        onError={() => setMaxresFailed(true)}
        onLoad={(e) => {
          if (e.currentTarget.naturalWidth === 120) setMaxresFailed(true);
        }}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-300 group-hover:bg-black/25">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-1">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
