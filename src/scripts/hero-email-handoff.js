// Ana sayfa hero'sunun tek-alanlı e-posta formu (`HeroEmailCaptureForm.astro`)
// → Online Sunum Talebi sayfası aktarımı.
//
// GÜVENLİK (Y2) — e-posta ARTIK URL'ye yazılmıyor. Önceden form düz bir
// `method="get"` formuydu, yani tarayıcı e-postayı `?email=...` olarak
// adres çubuğuna koyuyordu. Bu, kişisel veriyi şu kanallara sızdırıyordu:
//   • `Referer` başlığı — hedef sayfadaki HER dış istek (GTM, GA4, YouTube
//     embed'i, Cookie-Script) tam URL'i, dolayısıyla e-postayı alıyordu;
//   • analitik sayfa görüntüleme kaydı (GA4 `page_location` tam URL'i tutar);
//   • tarayıcı geçmişi, paylaşılan/yer imine eklenen linkler, sunucu erişim
//     logları, proxy/CDN logları.
// Bunların hiçbiri KVKK aydınlatma metninin kapsadığı bir işleme değil.
//
// Çözüm: e-posta `sessionStorage`'a yazılıp URL'siz gezinme yapılıyor.
// `sessionStorage` sekmeye özel, sunucuya HİÇ gönderilmiyor, `Referer`'da
// görünmüyor ve sekme kapanınca siliniyor.
//
// JS'siz/`sessionStorage` engelli tarayıcı: `preventDefault()` HİÇ
// çağrılmıyor, form eski GET davranışına düşüyor (hedef sayfa query
// parametresini hâlâ okuyabiliyor, bkz. `emailHandoff.ts`) — yani özellik
// bozulmuyor, yalnızca o dar senaryoda eski URL davranışı geçerli oluyor.
import { HANDOFF_EMAIL_KEY } from '../data/emailHandoff';

const form = document.getElementById('hero-email-capture-form');

if (form instanceof HTMLFormElement) {
  form.addEventListener('submit', (event) => {
    const input = form.elements.namedItem('email');
    if (!(input instanceof HTMLInputElement) || !input.value) return;
    // Tarayıcının kendi `type="email"`/`required` doğrulaması geçmediyse
    // hiç karışma — native akış hata mesajını gösterir.
    if (!form.checkValidity()) return;

    try {
      window.sessionStorage.setItem(HANDOFF_EMAIL_KEY, input.value);
    } catch {
      return; // Depolama yok/engelli → native GET fallback'i çalışsın.
    }

    event.preventDefault();
    window.location.assign(form.action);
  });
}
