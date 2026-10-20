// Ana sayfa "2027 performans" promosyon pop-up'ı — sol alt köşe kartı.
//
// NEDEN JS İLE GEÇ OLUŞTURULUYOR: kart hiçbir zaman sunucu HTML'inde
// bulunmuyor, yani ilk boyamada DOM'a hiç girmiyor. Bu üç şeyi birden
// garantiliyor: (a) CLS = 0 (eleman `position:fixed`, üstelik ancak
// gösterilirken ekleniyor — düzen akışını hiç etkilemiyor), (b) kapatılmış
// ziyaretçi için hiç DOM/CSS maliyeti yok, (c) `astro build` çıktısındaki
// ana sayfa HTML'i büyümüyor.
//
// GÖRSEL YOK: üç ikon ve oklar satır içi SVG — ayrı bir dosya isteği yok.
//
// ZAMANLAMA: Cookie-Script kararından (4 olaydan biri) 5 sn sonra; karar
// daha önce verilmişse (banner hiç çıkmaz) script çalıştıktan 5 sn sonra.
// Script `type="module"` olarak yüklendiği için zaten defer davranışında,
// yani "sayfa yüklendikten sonra" ile pratikte aynı an.
//
// ⚠️ TASARIMDA OLMAYAN AMA ZORUNLU İKİ KONUM DÜZELTMESİ (ölçülerek bulundu):
//  1. Ana sayfada ZATEN bir `#sticky-demo-bar` var (fixed, bottom-0, 400px
//     kaydırmadan sonra görünür). Mobilde iki satırlı olduğu için ~112px
//     yükseklikte ve tasarımın `bottom:84px` değerinin üstüne biniyor.
//     CSS'teki `body:has(#sticky-demo-bar[data-state='visible'])` kuralı bu
//     durumda kartı 124px'e yükseltiyor. `:has()` canlı değerlendirilir,
//     yani bar kaydırmayla görününce/kapatılınca kart kendiliğinden uyar.
//  2. Sağ alttaki telefon/WhatsApp butonları (`FloatingContactButtons`,
//     mobilde 40px genişlik + 12px kenar boşluğu) — mobil genişlik
//     `min(292px, 100vw - 76px)`, yani sağda 64px rezerv bırakılıyor.
//     320px'lik bir ekranda bile binişme olmuyor.
import { PROMO_POPUP as C } from '../data/promoPopup';

if (C.enabled) boot();

/* -------------------------------------------------------------- zamanlama */

function boot() {
  if (dismissedRecently()) return;

  // Karar zaten verilmiş (banner çıkmayacak) → doğrudan geri sayım.
  if (document.cookie.indexOf(C.consentCookieName + '=') !== -1) {
    window.setTimeout(show, C.delayMs);
    return;
  }

  var fired = false;
  var fallbackId = 0;

  function onDecision() {
    if (fired) return;
    fired = true;
    window.clearTimeout(fallbackId);
    C.consentEvents.forEach(function (name) {
      window.removeEventListener(name, onDecision);
    });
    window.setTimeout(show, C.delayMs);
  }

  C.consentEvents.forEach(function (name) {
    window.addEventListener(name, onDecision);
  });

  // Cookie-Script hiç yüklenmediyse (engelleyici/ağ hatası) ne olay gelir ne
  // çerez yazılır — banner da DOM'da olmadığına göre beklemenin anlamı yok.
  fallbackId = window.setTimeout(function () {
    if (fired || document.getElementById(C.bannerElementId)) return;
    onDecision();
  }, C.noBannerFallbackMs);
}

function dismissedRecently() {
  try {
    var raw = window.localStorage.getItem(C.dismissStorageKey);
    if (!raw) return false;
    var ts = parseInt(raw, 10);
    if (!ts) return false;
    return Date.now() - ts < C.dismissDays * 86400000;
  } catch {
    // Depolama engelli (private mode / site verisi kapalı) — bastırma
    // hatırlanamıyor, pop-up gösterilir. Sessizce hiç göstermemektense
    // bilinçli olarak gösterme tarafına düşülüyor.
    return false;
  }
}

function remember() {
  try {
    window.localStorage.setItem(C.dismissStorageKey, String(Date.now()));
  } catch {
    /* depolama yok — bu oturumda kapanmış olması yeterli */
  }
}

/* ------------------------------------------------------------------ ölçüm */

function track(event, cta) {
  window.dataLayer = window.dataLayer || [];
  var payload = { event: event, promo_id: C.promoId };
  if (cta) payload.promo_cta = cta;
  window.dataLayer.push(payload);
}

/* ------------------------------------------------------------------ ikonlar */

// Üç ikon HEM masaüstü kartlarında HEM mobil çiplerde kullanılıyor; yalnızca
// boyut/çizgi kalınlığı değişiyor, bu yüzden path verisi tek yerde duruyor.
var ICONS = [
  '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="#fff"/>',
  '<circle cx="9" cy="8" r="3.2"/><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17" cy="9" r="2.6"/><path d="M16 13.6c2.9 .2 5 2.2 5 5.4"/>',
  '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c0-3.8 3.1-6.2 7-6.2s7 2.4 7 6.2"/>',
];

function icon(i, size, width) {
  return (
    '<svg width="' +
    size +
    '" height="' +
    size +
    '" viewBox="0 0 24 24" fill="none" stroke="' +
    (i === 0 ? '#fff' : '#FF6A5E') +
    '" stroke-width="' +
    width +
    '" stroke-linecap="round" aria-hidden="true">' +
    ICONS[i] +
    '</svg>'
  );
}

var CHEVRON =
  '<svg class="ipp-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#D60000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 5l7 7-7 7"/></svg>';

/* ------------------------------------------------------------------ görünüm */

function markup() {
  var n = C.nodes;

  // Masaüstü: bağlayıcı eğriler + üç konumlanmış kart (366×214 tuval).
  var map =
    '<div class="ipp-map">' +
    '<svg width="366" height="214" viewBox="0 0 366 214" fill="none" aria-hidden="true">' +
    // İki bağlayıcı AYRI `<g>` içinde: kısa ekran kuralında kutular kısalınca
    // her biri FARKLI bir miktar yukarı kayıyor (−20 / −40). Kutu aralığı
    // (17px) iki düzende de AYNI tutulduğu için eğrilerin kendisi hiç
    // deforme olmuyor — saf öteleme, ölçekleme DEĞİL (ölçekleme uçlardaki
    // daireleri elips yapardı).
    '<g class="ipp-c1"><path d="M150 60 C150 70 170 67 170 77" stroke="#D60000" stroke-width="2.2" stroke-linecap="round"/>' +
    '<circle cx="160" cy="68.5" r="7" fill="#D60000" opacity=".3"/><circle cx="160" cy="68.5" r="3.5" fill="#fff"/></g>' +
    '<g class="ipp-c2"><path d="M220 137 C220 147 130 144 130 154" stroke="#D60000" stroke-width="2.2" stroke-linecap="round"/>' +
    '<circle cx="175" cy="145.5" r="7" fill="#D60000" opacity=".3"/><circle cx="175" cy="145.5" r="3.5" fill="#fff"/></g>' +
    '</svg>';
  for (var i = 0; i < 3; i++) {
    map +=
      '<div class="ipp-node ipp-n' +
      (i + 1) +
      '"><span class="ipp-ic">' +
      icon(i, 18, 2) +
      '</span><span><span class="ipp-nt">' +
      n[i].title +
      '</span><span class="ipp-ns">' +
      n[i].text +
      '</span></span></div>';
  }
  map += '</div>';

  // Mobil: Şirket → Takım → Bireysel yatay mini şeması.
  var row = '<div class="ipp-row">';
  for (var j = 0; j < 3; j++) {
    if (j > 0) row += CHEVRON;
    row +=
      '<span class="ipp-chip ipp-chip-' +
      (j + 1) +
      '"><span class="ipp-cic">' +
      icon(j, 13, 2.2) +
      '</span><span class="ipp-ct">' +
      n[j].short +
      '</span></span>';
  }
  row += '</div>';

  return (
    '<div class="ipp-head"><div class="ipp-top">' +
    '<span class="ipp-eyebrow">' +
    C.text.eyebrow +
    '</span>' +
    '<button type="button" class="ipp-x" aria-label="' +
    C.text.closeLabel +
    '"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></span></button>' +
    '</div>' +
    map +
    row +
    '</div>' +
    '<div class="ipp-body">' +
    '<p class="ipp-title">' +
    C.text.title +
    '</p>' +
    '<p class="ipp-sub">' +
    C.text.subtitle +
    '</p>' +
    '<p class="ipp-text">' +
    C.text.body +
    '</p>' +
    '<div class="ipp-cta">' +
    '<a class="ipp-a1" href="' +
    C.cta.primary.href +
    '" data-cta="' +
    C.cta.primary.id +
    '">' +
    C.cta.primary.label +
    '</a>' +
    '<a class="ipp-a2" href="' +
    C.cta.secondary.href +
    '" data-cta="' +
    C.cta.secondary.id +
    '">' +
    C.cta.secondary.label +
    '</a>' +
    '</div></div>'
  );
}

var CSS =
  '#ipp{position:fixed;left:28px;bottom:100px;z-index:45;width:410px;color:#1F1F24;background:#fff;border:1px solid #ECECEF;border-radius:20px;box-shadow:0 18px 48px rgba(20,20,30,.18);overflow:hidden;opacity:0;transform:translateY(14px);transition:opacity .3s ease-out,transform .3s ease-out}' +
  '#ipp[data-open]{opacity:1;transform:none}' +
  '#ipp *{box-sizing:border-box}' +
  '.ipp-head{background:#111114;padding:20px 22px}' +
  '.ipp-top{display:flex;align-items:center;justify-content:space-between;gap:8px}' +
  '.ipp-eyebrow{font-size:12px;font-weight:700;letter-spacing:1.4px;color:#FF8A8A}' +
  '.ipp-x{flex:0 0 auto;width:36px;height:36px;margin:-2px -2px -2px 0;padding:0;border:0;background:0 0;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer}' +
  '.ipp-x>span{width:32px;height:32px;border-radius:999px;background:#2C2C33;display:flex;align-items:center;justify-content:center;transition:background .15s}' +
  '.ipp-x:hover>span{background:#3F3F4A}' +
  '.ipp-x svg{width:14px;height:14px}' +
  '.ipp-map{position:relative;width:366px;height:214px;margin-top:16px}' +
  '.ipp-map>svg{position:absolute;left:0;top:0}' +
  '.ipp-node{position:absolute;height:60px;border-radius:14px;padding:10px 12px;display:flex;align-items:center;gap:10px}' +
  '.ipp-n1{left:0;top:0;width:236px;background:#D60000;box-shadow:0 10px 26px rgba(214,0,0,.38)}' +
  '.ipp-n2{left:80px;top:77px;width:286px;background:#23232A;border:1px solid #3A3A44}' +
  '.ipp-n3{left:0;top:154px;width:236px;background:#23232A;border:1px solid #3A3A44}' +
  '.ipp-ic{flex:0 0 34px;height:34px;border-radius:10px;background:#34343D;display:flex;align-items:center;justify-content:center}' +
  '.ipp-n1 .ipp-ic{background:rgba(255,255,255,.2)}' +
  '.ipp-nt{display:block;font-size:15px;font-weight:700;color:#fff}' +
  '.ipp-ns{display:block;margin-top:1px;font-size:12px;color:#B9B9C4}' +
  '.ipp-n1 .ipp-ns{color:rgba(255,255,255,.88)}' +
  '.ipp-row{display:none;align-items:center;gap:2px;margin-top:9px}' +
  '.ipp-chip{flex:1 1 0;min-width:0;height:34px;border-radius:10px;padding:0 5px;display:flex;align-items:center;gap:4px;background:#23232A;border:1px solid #3A3A44}' +
  '.ipp-chip-1{background:#D60000;border-color:#D60000;box-shadow:0 6px 16px rgba(214,0,0,.35)}' +
  '.ipp-cic{flex:0 0 20px;height:20px;border-radius:6px;background:#34343D;display:flex;align-items:center;justify-content:center}' +
  '.ipp-chip-1 .ipp-cic{background:rgba(255,255,255,.2)}' +
  '.ipp-ct{font-size:11px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
  '.ipp-arrow{flex:0 0 auto}' +
  '.ipp-body{padding:20px 22px 22px}' +
  '.ipp-title{margin:0;font-size:22px;line-height:1.25;font-weight:700}' +
  '.ipp-sub{margin:12px 0 0;font-size:16px;line-height:1.4;font-weight:700;color:#C40000}' +
  '.ipp-text{margin:12px 0 0;font-size:14px;line-height:1.55;color:#4A4A55}' +
  '.ipp-cta{display:flex;align-items:center;gap:16px;margin-top:16px}' +
  '.ipp-a1{background:#D60000;color:#fff;font-size:15px;font-weight:700;padding:12px 20px;border-radius:999px;text-decoration:none;transition:background .15s}' +
  '.ipp-a1:hover{background:#B00000;color:#fff}' +
  '.ipp-a2{color:#1F1F24;font-size:15px;font-weight:700;text-decoration:underline}' +
  '.ipp-a2:hover{color:#B00000}' +
  // ≤480px — "Mobil 1" panosu: kompakt kart, yatay mini şema, uzun metin yok.
  '@media(max-width:480px){' +
  '#ipp{left:12px;bottom:84px;width:min(292px,calc(100vw - 76px));border-radius:16px;box-shadow:0 14px 36px rgba(20,20,30,.22)}' +
  '.ipp-head{padding:10px 12px 12px}' +
  '.ipp-eyebrow{font-size:10.5px;letter-spacing:1.2px}' +
  '.ipp-x{margin:-6px -6px -6px 0}' +
  '.ipp-x>span{width:26px;height:26px}' +
  '.ipp-x svg{width:12px;height:12px}' +
  '.ipp-map{display:none}' +
  '.ipp-row{display:flex}' +
  '.ipp-body{padding:11px 12px 12px}' +
  '.ipp-title{font-size:15px;line-height:1.3}' +
  '.ipp-sub,.ipp-text{display:none}' +
  '.ipp-cta{gap:14px;margin-top:10px}' +
  '.ipp-a1{font-size:13px;padding:9px 14px}' +
  '.ipp-a2{font-size:13px}' +
  '}' +
  // KISA MASAÜSTÜ EKRAN (1366×768 ve benzeri). Yükseklik 820px'in altına
  // düşünce tam kart ekranın ~%80'ini kaplıyordu. Burada uzun açıklama
  // paragrafı ve düğümlerin alt satırları gizleniyor, şema kompaktlaşıyor;
  // hedef kart yüksekliği ≤420px. Kutu YÜKSEKLİĞİ 60→40, ama kutular ARASI
  // boşluk 17px olarak KORUNUYOR — bağlayıcı eğriler bu yüzden yalnızca
  // ötelenerek doğru yere oturuyor (bkz. `.ipp-c1`/`.ipp-c2` notu).
  // `min-width:481px` şart: ≤480px zaten kendi kompakt düzenini kullanıyor.
  '@media(min-width:481px) and (max-height:820px){' +
  '.ipp-text{display:none}' +
  '.ipp-ns{display:none}' +
  '.ipp-head{padding:14px 22px}' +
  '.ipp-map{height:154px;margin-top:10px}' +
  '.ipp-node{height:40px;padding:6px 10px}' +
  '.ipp-ic{flex:0 0 28px;height:28px;border-radius:8px}' +
  '.ipp-n2{top:57px}' +
  '.ipp-n3{top:114px}' +
  '.ipp-c1{transform:translateY(-20px)}' +
  '.ipp-c2{transform:translateY(-40px)}' +
  '.ipp-body{padding:14px 22px 16px}' +
  '.ipp-title{font-size:19px}' +
  '.ipp-sub{margin-top:10px;font-size:15px}' +
  '.ipp-cta{margin-top:12px}' +
  '.ipp-a1{padding:10px 18px;font-size:14px}' +
  '.ipp-a2{font-size:14px}' +
  '}' +
  // Ana sayfanın mevcut `#sticky-demo-bar`'ı mobilde ~112px yükseklikte —
  // görünürken kart onun üstüne çıkıyor (bkz. dosya başı notu).
  '@media(max-width:480px){body:has(#sticky-demo-bar[data-state="visible"]) #ipp{bottom:124px}}' +
  '@media(prefers-reduced-motion:reduce){#ipp,.ipp-x>span,.ipp-a1{transition:none}}';

/* ------------------------------------------------------------------ davranış */

function show() {
  if (document.getElementById('ipp')) return;

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var el = document.createElement('aside');
  el.id = 'ipp';
  el.setAttribute('aria-label', C.text.regionLabel);
  // İçeriğin TAMAMI bu depodaki sabitlerden geliyor (kullanıcı girdisi yok),
  // bu yüzden `innerHTML` güvenli ve en küçük yol.
  el.innerHTML = markup();
  document.body.appendChild(el);

  function close() {
    document.removeEventListener('keydown', onKey);
    remember();
    el.removeAttribute('data-open');
    window.setTimeout(function () {
      el.remove();
      style.remove();
    }, 300);
  }

  function onKey(e) {
    if (e.key === 'Escape') {
      track('promo_popup_close');
      close();
    }
  }

  el.querySelector('.ipp-x').addEventListener('click', function () {
    track('promo_popup_close');
    close();
  });

  el.querySelectorAll('[data-cta]').forEach(function (link) {
    link.addEventListener('click', function () {
      track('promo_popup_click', link.getAttribute('data-cta'));
      // CTA'ya tıklayan ziyaretçi geri döndüğünde kart tekrar çıkmasın —
      // kapatmayla aynı bastırma penceresi uygulanıyor.
      remember();
    });
  });

  document.addEventListener('keydown', onKey);

  // Geçiş animasyonunun başlangıç durumundan çalışması için bir kare bekle.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      el.setAttribute('data-open', '');
      track('promo_popup_view');
    });
  });
}
