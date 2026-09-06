import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import YoutubeClickToPlay from './YoutubeClickToPlay';
import IdenfitStar from './icons/IdenfitStar';

interface CardBase {
  key: string;
  companyName: string;
  logoUrl: string;
  logoWidth: number;
  logoHeight: number;
  /** "Devamını Oku" (2026-08-25, kullanıcı isteği — HER kartta olmalı) —
   * çağıran taraf (`CustomerStoryCarouselSection.astro`) artık bunu HER
   * karta dolduruyor: gerçek bir `/musteriler/` bloğu olan kartlarda o
   * bloğa (`#anchorId`), olmayanlarda (eski `TestimonialSection`'dan
   * taşınan 2 tanık) düz `/musteriler/`'e. Yine de opsiyonel bırakıldı
   * (savunmacı `&&` kontrolü — çağıran taraf boş string geçirmez). */
  readMoreLabel?: string;
  readMoreHref?: string;
}

export interface VideoCardData extends CardBase {
  type: 'video';
  videoUrl: string;
  headline: string;
  playLabel: string;
  /** Arka planda otomatik/sessiz döngü aralığı (saniye) — bkz.
   * `customerStoryCarousel.ts`'in `VideoCarouselCard.loopStart/loopEnd`
   * yorumu. İkisi de verilmişse `VideoCard` tıkla-oynat YERİNE sürekli
   * oynayan bir arka plan videosu render eder. */
  loopStart?: number;
  loopEnd?: number;
  /** Verilmişse (2026-09-06) YouTube IFrame Player DEĞİL, düz bir yerel
   * `<video>` etiketi render edilir — bkz. `customerStoryCarousel.ts`'in
   * `VideoCarouselCard.loopVideoUrl` yorumu. */
  loopVideoUrl?: string;
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
// kullanılıyor.
//
// DÜZELTME (2026-08-24, kullanıcı isteği — Personio.com referansı): video
// kartı artık küçük/dolgulu bir aspect-video kutusu DEĞİL, kaynak görselin
// TAMAMI kartın arka planını dolduruyor (tam-kaplama), başlık/"Devamını
// Oku"/logo görselin ÜZERİNE bindirilmiş beyaz metin olarak konumlanıyor
// (Personio'nun video kartı deseniyle birebir). Ayrıca kartlar artık TEK
// bir soluk pembe-gradyan yerine index'e göre kırmızı/beyaz/gri arasında
// DÖNÜYOR (`CARD_VARIANTS`) — "kırmızı" artık gerçek marka kırmızısı
// (`bg-brand`, önceki turun soluk `#FFDCDC` tonundan ÇOK daha belirgin).
// idenfit'in gerçek logo yıldızı (`IdenfitStar`, `IdenfitLogo.tsx`'ten
// izole edildi) her kartın sağ üst köşesinde yavaşça dönerek ("hareketli")
// duruyor.
const CARD_SCROLL_AMOUNT = 512;
const CARD_HEIGHT = 'h-[520px]';
const CARD_SHADOW = 'shadow-[0_10px_34px_rgba(138,0,0,0.12)]';

type CardVariant = 'red' | 'white' | 'gray';
// Kartlar bu sırayla DÖNGÜYE giriyor (index % 3) — kullanıcı isteği
// (2026-08-24, GÜNCELLENDİ): "gri beyaz kırmızı şeklinde olsun".
const CARD_VARIANTS: CardVariant[] = ['gray', 'white', 'red'];

const VARIANT_STYLES: Record<CardVariant, { bg: string; heading: string; body: string; muted: string; star: string; scrimFrom: string }> = {
  red: { bg: 'bg-brand', heading: 'text-white', body: 'text-white', muted: 'text-white/75', star: 'text-white', scrimFrom: 'from-black/70' },
  white: { bg: 'bg-surface', heading: 'text-heading', body: 'text-body', muted: 'text-muted', star: 'text-brand', scrimFrom: 'from-black/75' },
  gray: { bg: 'bg-menu-surface', heading: 'text-heading', body: 'text-body', muted: 'text-muted', star: 'text-brand', scrimFrom: 'from-black/75' },
};

function CardStar({ tone }: { tone: string }) {
  return (
    <span className={`idenfit-star-spin pointer-events-none absolute right-5 top-5 z-10 ${tone}`} aria-hidden="true">
      <IdenfitStar className="h-6 w-6 drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)]" />
    </span>
  );
}

// Kart içeriği (alıntı uzunluğu, kişi bilgisi, ikincil istatistik var/yok)
// karta göre değişince logo normal akışta FARKLI bir yükseklikte kalıyordu
// (2026-08-25, kullanıcı bulgusu: "bazıları dolda durunca hoş görünmüyor")
// — artık akıştan çıkarılıp her kartın (relative konumlu) sağ-alt köşesine
// MUTLAK konumla sabitleniyor, içerik miktarından bağımsız olarak.
function CardLogo({
  url,
  width,
  height,
  alt,
  offset = 'p-6',
}: {
  url: string;
  width: number;
  height: number;
  alt: string;
  offset?: 'p-6' | 'p-8';
}) {
  // Firma logoları (`civil-2-1.svg` vb.) kendi İÇİNDE opak beyaz bir zemin
  // taşıyor (kaynağın kendi dosyası, `<rect fill="white">`) — bu yüzden
  // koyu kartlarda (kırmızı varyant/video scrim'i) ayrıca bir `invert`
  // filtresi GEREKMİYOR: logo zaten kendi beyaz "rozet" zemininde net
  // görünüyor. Önceki denemede `brightness-0 invert` bu beyaz zemini de
  // tersine çevirip logoyu tamamen görünmez (düz beyaz kutu) yapmıştı.
  return (
    <img
      src={url}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      className={`absolute ${offset === 'p-8' ? 'bottom-8 right-8' : 'bottom-6 right-6'} h-8 w-auto object-contain opacity-90`}
    />
  );
}

function ReadMoreLink({ href, label, tone, variant }: { href: string; label: string; tone: 'brand' | 'white'; variant?: CardVariant }) {
  if (tone === 'white') {
    // 2026-08-25, kullanıcı isteği — arka plandaki siyah/40 "hap" zemini
    // (video üzerinde sarmalanmış görünüyordu) kaldırıldı, düz metin
    // oldu. Alttaki `scrimFrom` gradyanı (video karartma katmanı) zaten
    // okunabilirliği sağlıyor — üstteki `headline`'ın da hiç zemini yok.
    return (
      <a href={href} className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-white">
        {label}
        <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-200 group-hover/link:translate-x-1" />
      </a>
    );
  }
  // Kırmızı varyant kartında (`bg-brand`) `text-brand` görünmez olurdu
  // (kırmızı üstünde kırmızı) — 2026-08-25, "Devamını Oku" HER kartta
  // zorunlu hale gelince fark edildi. `primaryStat`/`heading` metninin
  // AYNI kuralını izliyor (bkz. `StatCard`'daki `variant === 'red' ?
  // 'text-white' : 'text-brand'` deseni).
  const color = variant === 'red' ? 'text-white' : 'text-brand';
  return (
    <a href={href} className={`group/link mt-6 inline-flex items-center gap-1.5 text-lg font-semibold ${color}`}>
      {label}
      <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-200 group-hover/link:translate-x-1" />
    </a>
  );
}

// YouTube IFrame Player API'nin GERÇEK yükleme durumunu tüm kartlar
// arasında PAYLAŞAN tek bir promise (2026-08-25, `loop=1&playlist=<aynı
// video>` + `start`/`end` yöntemi terk edilince eklendi — bkz.
// `BackgroundLoopVideo` yorumu). Script yalnızca BİR KEZ enjekte edilir;
// `window.onYouTubeIframeAPIReady` zaten başka bir kod tarafından
// tanımlanmışsa (bu sayfada aynı anda birden fazla döngülü video kartı
// var) ZİNCİRLENİR, üzerine YAZILMAZ.
let youtubeApiPromise: Promise<void> | null = null;
function loadYoutubeIframeApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  const w = window as unknown as { YT?: { Player: unknown }; onYouTubeIframeAPIReady?: () => void };
  if (w.YT?.Player) return Promise.resolve();
  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve) => {
      const previous = w.onYouTubeIframeAPIReady;
      w.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve();
      };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    });
  }
  return youtubeApiPromise;
}

// Arka planda sessiz/otomatik döngüde oynayan YouTube videosu (2026-08-24,
// kullanıcı isteği — Femaş'ın videosu, 18-32sn aralığı).
//
// DÜZELTME (2026-08-25, kullanıcı bulgusu — "istediğim aralıkta
// durmuyor, sürekli tekrarlanan bir döngü gibi olsun"): önceki
// `loop=1&playlist=<AYNI video ID>` + `start`/`end` URL parametresi
// yöntemi YouTube'un KENDİ bilinen kısıtı yüzünden güvenilmezdi —
// `end`'e ulaşınca döngü çoğu zaman `start`'a DEĞİL, videonun en
// BAŞINA (0. saniye) dönüyordu, bu yüzden zamanla seçilen "yazısız"
// aralığın dışına (rahatsız edici alt-yazı/pazarlama metni olan
// bölümlere) kayıyordu. Artık gerçek YouTube IFrame Player API
// (`YT.Player`) kullanılıyor: oynatıcı hazır olunca `start`'a
// `seekTo` ile atlanıyor, sonra her 500ms'de `getCurrentTime()`
// kontrol edilip `end`'e ulaşıldığında YENİDEN `start`'a `seekTo`
// yapılıyor — döngü artık ASLA `[start, end]` aralığının dışına
// çıkmıyor. `mute=1` hem tarayıcıların otomatik oynatma politikası
// GEREĞİ zorunlu hem kullanıcının "sessiz modda" isteğiyle örtüşüyor.
// Video, kartın TAMAMINI dolduracak şekilde (16:9 oranı korunarak,
// `aspect-video`+`h-full`+ortalanmış) büyütülüp taşan kısımlar
// `overflow-hidden` ile kırpılıyor — dar/portre kart oranında bile
// letterbox (siyah şerit) OLMAZ. `pointer-events-none` iframe'in kendi
// oynatıcı arayüzüyle etkileşimi engeller; kartın TAMAMINI kaplayan
// görünmez `<a>` tıklamayı GERÇEK YouTube izleme sayfasına yönlendirir
// (kullanıcı isteği: "tıklayınca da o videoya gidecek youtube üzerinde").
function BackgroundLoopVideo({ videoId, start, end, title }: { videoId: string; start: number; end: number; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // DÜZELTME (2026-08-25) — önceki `Math.random()` içeren id SSR/CSR
  // hydration uyuşmazlığına yol açıyordu (`videoId` zaten kart başına
  // benzersiz, rastgele bir ek GEREKMİYORDU).
  const frameId = `yt-loop-${videoId}`;
  // DÜZELTME (2026-08-25, kullanıcı bulgusu — "YouTube'un kendi başlık/
  // 'diğer videolar' arayüzü kartın üzerine sızıyor"): `modestbranding`/
  // `rel` YALNIZCA logo/ilgili-video ÖNERİLERİNİ etkiler — oynatıcı henüz
  // BAŞLAMAMIŞKEN (yükleniyor/`autoplay` bir sebeple gecikmişken) YouTube
  // kendi "başlık + önerilen videolar" boş-durum ekranını YİNE gösterir,
  // bu parametrelerle GİZLENEMEZ. Çözüm: gerçek `<iframe>` oynatmaya
  // BAŞLAYANA kadar (`onStateChange`'te `PLAYING`) üzerinde kartın kendi
  // YouTube thumbnail'i (`YoutubeClickToPlay`'in kullandığı AYNI
  // `hqdefault.jpg` deseni) opak şekilde durur — YouTube'un kendi boş-
  // durum arayüzü hiçbir zaman görünür olmaz, yalnızca thumbnail'den
  // gerçek videoya YUMUŞAK bir geçiş olur.
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let player: {
      getCurrentTime: () => number;
      seekTo: (s: number, allowSeekAhead: boolean) => void;
      mute: () => void;
      playVideo: () => void;
      destroy: () => void;
      unloadModule: (module: string) => void;
    } | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    loadYoutubeIframeApi().then(() => {
      if (cancelled || !containerRef.current) return;
      const YT = (window as unknown as { YT: { Player: new (el: HTMLElement, opts: Record<string, unknown>) => typeof player } }).YT;
      player = new YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          disablekb: 1,
          iv_load_policy: 3,
          cc_load_policy: 0,
          start,
        },
        events: {
          onReady: (e: { target: NonNullable<typeof player> }) => {
            e.target.mute();
            // `cc_load_policy:0` YouTube'un kendi dokümantasyonuna göre
            // yalnızca "kullanıcı tercihine göre davran" demek — bazı
            // videolarda (yükleyicinin zorladığı/otomatik çeviri altyazı)
            // ALTYAZIYI ZORLA KAPATMIYOR (kullanıcı bulgusu, 2026-09-06:
            // altyazı metni videonun altında GERÇEKTEN yanıyordu).
            // `unloadModule('captions')` altyazı modülünü oynatıcıdan
            // TAMAMEN çıkarıyor — playerVars'ın aksine kesin/zorlayıcı.
            e.target.unloadModule('captions');
            e.target.playVideo();
            intervalId = setInterval(() => {
              if (e.target.getCurrentTime() >= end) e.target.seekTo(start, true);
            }, 500);
          },
          // `1` = `YT.PlayerState.PLAYING` (henüz API script yüklenmeden
          // sabit kullanılamadığı için sayısal literal — resmi YouTube
          // IFrame API sabiti).
          onStateChange: (e: { data: number; target: NonNullable<typeof player> }) => {
            if (e.data === 1) {
              setStarted(true);
              // Altyazı modülü `seekTo` sonrası (özellikle döngünün başa
              // sardığı her an) sessizce YENİDEN yüklenebiliyor — her
              // `PLAYING` durumunda tekrar kapatılıyor, tek seferlik
              // `onReady` çağrısı döngü boyunca yeterli olmuyordu.
              e.target.unloadModule('captions');
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      player?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, start, end]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div className="absolute left-1/2 top-1/2 aspect-video h-full -translate-x-1/2 -translate-y-1/2">
        <div ref={containerRef} id={frameId} title={title} className="pointer-events-none h-full w-full" />
        <img
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt=""
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${started ? 'opacity-0' : 'opacity-100'}`}
        />
      </div>
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={title}
        className="absolute inset-0"
      />
    </div>
  );
}

// Yerel, önceden kesilmiş sessiz döngü videosu (2026-09-06) —
// `BackgroundLoopVideo`'nun (gerçek YouTube IFrame Player) YERİNE geçer.
// Artık üçüncü taraf bir oynatıcı/iframe YOK — bu yüzden YouTube'un kendi
// başlık/altyazı/kontrol arayüzünün sızması mimari olarak imkansız (önceki
// turlarda `cc_load_policy`/`unloadModule('captions')`/CSS karartma ile
// uğraşılan sorunun kökten çözümü). Video dosyası zaten `loopStart`/
// `loopEnd` aralığına kare-doğru kesilmiş halde geliyor — burada ayrıca
// bir `start`/`end`/`seekTo` mantığına GEREK YOK, düz `loop` yeterli.
// DÜZELTME (2026-09-06, kullanıcı düzeltmesi — "tıklayınca YouTube'a
// yönlendirecek, SADECE BUTON KOYMAMANI istemiştim"): tıklama davranışı
// (kartın tamamını kaplayan görünmez `<a>`, gerçek YouTube izleme
// sayfasına yeni sekmede götürüyor) GERİ EKLENDİ — bir önceki turda
// yanlış anlaşılıp tamamen kaldırılmıştı. Kaldırılması gereken yalnızca
// GÖRÜNÜR ipucuydu (hover'daki "▶ YouTube'da izle" rozeti) — o rozet
// kalıcı olarak kaldırıldı, tıklanabilirlik SESSİZCE duruyor (kullanıcı
// tıklarsa gider, görsel bir çağrı/rozet YOK).
// TEMBEL YÜKLEME (2026-09-06, kullanıcı bulgusu — carousel'deki 4 video
// kartı da, ekranda görünsün görünmesin, sayfa yüklenir yüklenmez AYNI ANDA
// yükleniyordu; `<video src>` DOM'a hemen konduğu için tarayıcı hiç
// görünmeyen 3 kartın videosunu da indirmeye başlıyordu). Çözüm:
// `IntersectionObserver` — bir kez görünüp yüklendikten SONRA `shouldLoad`
// kalıcı `true` kalıyor — kullanıcı kartı kaydırıp geri gelirse video
// YENİDEN İNDİRİLMİYOR (tarayıcı zaten önbelleğe aldı).
// DÜZELTME (2026-09-06, kullanıcı şartı — "SADECE dosyanın indirilmesi
// ertelensin, `<video>` ETİKETİ statik HTML'den hiç kaybolmamalı"): önceki
// sürüm `{shouldLoad && <video .../>}` şeklindeydi — `shouldLoad`'ın
// SUNUCU/BUILD zamanındaki başlangıç değeri her zaman `false` olduğu için
// (İntersectionObserver yalnızca tarayıcıda var), `<video>` etiketinin
// TAMAMI `dist/`'teki statik HTML'den TAMAMEN kayboluyordu — JS hiç
// çalışmasa/gecikse bile (crawler, JS kapalı kullanıcı, yavaş hydration)
// içerik boş kalırdı. Artık `<video>` etiketi HER ZAMAN render ediliyor
// (`preload="none"`, `src` YOK) — yalnızca `src` özniteliği `shouldLoad`
// `true` olunca EKLENİYOR. Tarayıcı, `src` özniteliği hiç yokken hiçbir
// medya isteği ATMAZ (indirme ertelemesi burada gerçekleşiyor), ama
// `<video>` elemanının kendisi baştan beri DOM'da/statik HTML'de var.
function LocalLoopVideo({ src, videoId, title }: { src: string; videoId: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || shouldLoad) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // `autoplay` HTML özniteliği tek başına yeterli olmayabiliyor (tarayıcının
  // kendi arka-plan-sekme/görünürlük sezgiselleri devreye girip videoyu
  // sessizce duraklatabiliyor) — `BackgroundLoopVideo`'nun `playVideo()`'yu
  // AÇIKÇA çağırdığı AYNI dayanıklılık deseni: mount'ta (artık `shouldLoad`
  // true olunca) ve her `pause` olayında (kullanıcı bir şey yapmadan,
  // tarayıcı kendi kendine durdurduysa) yeniden `play()` deneniyor.
  useEffect(() => {
    if (shouldLoad) videoRef.current?.play().catch(() => {});
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={shouldLoad ? src : undefined}
        preload="none"
        autoPlay
        muted
        loop
        playsInline
        onPause={(e) => {
          e.currentTarget.play().catch(() => {});
        }}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={title}
        className="absolute inset-0"
      />
    </div>
  );
}

function VideoCard({ card, variant }: { card: VideoCardData; variant: CardVariant }) {
  const v = VARIANT_STYLES[variant];
  // 2026-08-24, kullanıcı isteği — `loopStart`/`loopEnd` verilmiş kartlar
  // (Femaş) artık tıkla-oynat DEĞİL, sayfa yüklenir yüklenmez sessiz +
  // otomatik döngüde oynayan bir arka plan videosu; tıklanınca gerçek
  // YouTube izleme sayfasına gider. Bu iki alan verilmemiş kartlar
  // (Civil/Beyaz Fırın — döngü saniyeleri henüz paylaşılmadı) eski
  // tıkla-oynat davranışını AYNEN korur.
  const hasLoop = card.loopStart != null && card.loopEnd != null;
  const videoId = card.videoUrl.split('/').pop() ?? '';
  return (
    <div
      className={`group relative ${CARD_HEIGHT} overflow-hidden rounded-[1.75rem] ring-1 ring-white/70 transition-transform duration-300 hover:-translate-y-1 ${CARD_SHADOW}`}
    >
      <div className="absolute inset-0">
        {card.loopVideoUrl ? (
          <LocalLoopVideo src={card.loopVideoUrl} videoId={videoId} title={card.companyName} />
        ) : hasLoop ? (
          <BackgroundLoopVideo videoId={videoId} start={card.loopStart!} end={card.loopEnd!} title={card.companyName} />
        ) : (
          <YoutubeClickToPlay videoUrl={card.videoUrl} title={card.companyName} playLabel={card.playLabel} />
        )}
      </div>
      {/* Üst/alt karartma — video görseli üzerindeki beyaz metnin okunabilirliği için.
          Üstteki karartma İKİ FARKLI moda sahip: hâlâ YouTube tabanlı oynatılan
          kartlarda (`BackgroundLoopVideo`/`YoutubeClickToPlay`, `loopVideoUrl` YOK)
          0-40% aralığında BİLEREK TAM OPAK kalıyor (kullanıcı bulgusu, 2026-09-06:
          `controls=0` YouTube'un kendi video başlığını/CC simgesini engellemiyor,
          oynatıcı `PLAYING`'e geçmeden YouTube bu overlay'i kısa süreliğine
          gösterebiliyor — resmi bir URL parametresi yok, tam opak karartma TEK
          güvenilir gizleme yöntemi). Yerel video dosyasına taşınmış kartlarda
          (`loopVideoUrl` VAR) bu risk mimari olarak yok — kullanıcı isteğiyle
          (2026-09-06, ikinci tur) karartma KISMEN ŞEFFAF bir gradyana çevrildi,
          video arkada hafifçe görünüyor, metin hâlâ okunabilir kalıyor. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-36"
        style={{
          background: card.loopVideoUrl
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)'
            : 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
        }}
      />
      <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t ${v.scrimFrom} to-transparent`} />
      <CardStar tone="text-white" />
      <p className="pointer-events-none absolute left-6 right-16 top-6 text-lg font-semibold leading-snug text-white">{card.headline}</p>
      {/* "Devamını Oku" bu 4 videolu karttan TAMAMEN kaldırıldı (2026-09-06,
          kullanıcı isteği — yalnızca video kartları, diğer alıntı/istatistik
          kartlarında `ReadMoreLink` AYNEN kalıyor, bkz. `QuoteCard`/`StatCard`). */}
      <CardLogo url={card.logoUrl} width={card.logoWidth} height={card.logoHeight} alt={card.companyName} />
    </div>
  );
}

function QuoteCard({ card, variant }: { card: QuoteCardData; variant: CardVariant }) {
  const v = VARIANT_STYLES[variant];
  return (
    <div
      className={`relative flex ${CARD_HEIGHT} flex-col rounded-[1.75rem] p-8 ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1 ${v.bg} ${CARD_SHADOW}`}
    >
      <CardStar tone={v.star} />
      {card.photoUrl && (
        <img src={card.photoUrl} alt="" loading="lazy" className="h-20 w-20 rounded-full object-cover ring-2 ring-white" />
      )}
      <blockquote className="mt-6 flex-1">
        <p className={`line-clamp-6 text-lg leading-relaxed ${v.body}`}>&ldquo;{card.quoteText}&rdquo;</p>
      </blockquote>
      {(card.personName || card.personRole) && (
        <div className="mt-6">
          {card.personName && <p className={`text-lg font-bold ${v.heading}`}>{card.personName}</p>}
          {card.personRole && <p className={`text-base ${v.muted}`}>{card.personRole}</p>}
        </div>
      )}
      {card.readMoreHref && card.readMoreLabel && (
        <div className="pr-16">
          <ReadMoreLink href={card.readMoreHref} label={card.readMoreLabel} tone="brand" variant={variant} />
        </div>
      )}
      <CardLogo url={card.logoUrl} width={card.logoWidth} height={card.logoHeight} alt={card.companyName} offset="p-8" />
    </div>
  );
}

function StatCard({ card, variant }: { card: StatCardData; variant: CardVariant }) {
  const v = VARIANT_STYLES[variant];
  return (
    <div
      className={`relative flex ${CARD_HEIGHT} flex-col rounded-[1.75rem] p-8 ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1 ${v.bg} ${CARD_SHADOW}`}
    >
      <CardStar tone={v.star} />
      {/* Mobilde kart 360px'e daralıyor (`w-[360px] sm:w-[480px]`, aşağıda)
          — sabit `text-6xl` bazı dillerde (ör. NL "medewerkers", 11 harf)
          kartın yuvarlak kenarından TAŞIP kırpılıyordu (kullanıcı ekran
          görüntüsüyle bulundu). `text-5xl sm:text-6xl` mobilde küçültüp
          kartın genişlediği `sm:` üzerinde ESKİ boyutu aynen koruyor;
          `break-words` tek bir uzun kelime yine de sığmazsa (çok dar bir
          ekranda) satır içinde kırılmasını sağlıyor, taşma YERİNE. */}
      <p className={`break-words text-5xl font-bold leading-tight sm:text-6xl ${variant === 'red' ? 'text-white' : 'text-brand'}`}>{card.primaryStat}</p>
      {card.secondaryStat && <p className={`mt-2 text-2xl font-medium ${v.heading}`}>{card.secondaryStat}</p>}
      <p className={`mt-6 flex-1 text-lg leading-relaxed ${v.body}`}>{card.headline}</p>
      {card.readMoreHref && card.readMoreLabel && (
        <div className="pr-16">
          <ReadMoreLink href={card.readMoreHref} label={card.readMoreLabel} tone="brand" variant={variant} />
        </div>
      )}
      <CardLogo url={card.logoUrl} width={card.logoWidth} height={card.logoHeight} alt={card.companyName} offset="p-8" />
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
        {cards.map((card, i) => {
          const variant = CARD_VARIANTS[i % CARD_VARIANTS.length];
          return (
            <div key={card.key} className="w-[360px] shrink-0 snap-start sm:w-[480px]">
              {card.type === 'video' && <VideoCard card={card} variant={variant} />}
              {card.type === 'quote' && <QuoteCard card={card} variant={variant} />}
              {card.type === 'stat' && <StatCard card={card} variant={variant} />}
            </div>
          );
        })}
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
