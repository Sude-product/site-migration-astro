// Her sayfa açılışında ziyaretçinin ilk-giriş kaynağını (utm/gclid/geldiği
// site/ilk sayfa) sekmenin sessionStorage'ına yazar; form gönderilirken
// `formLead.ts` bunu okuyup lead'e ekler. Kurallar ve kapsam (çerez yok, IP
// yok, yalnız gönüllü form gönderiminde sunucuya gider):
// `src/data/leadAttribution.ts` dosya başı yorumu.
//
// BaseLayout ve LandingLayout'a bağlı — formların bulunduğu her sayfa bu iki
// şablondan birini kullanıyor. Yeni bir layout eklenirse oraya da eklenmeli,
// yoksa o şablonla açılan sayfadan gelen ziyaretçinin kaynağı kaybolur.
import { captureLeadAttribution } from '../data/leadAttribution';

captureLeadAttribution();
