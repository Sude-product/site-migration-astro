# Otomatik deploy — Cloudflare Workers Builds

**Durum:** 2026-09-10'da kurulmasına karar verildi. Repo tarafındaki hazırlık
TAMAM (aşağıdaki "Repo tarafı" bölümü); **bağlantının kendisi Cloudflare
panelinden elle yapılmalı** — bkz. "Neden panelden".

**Neden gerekli:** içerik Keystatic panelinden yayınlanıyor ve
`keystatic-cloud[bot]` doğrudan `master`'a commit atıyor. Otomatik bir
build/deploy zinciri olmadan pazarlama ekibi yayın yapsa bile site
güncellenmiyor — panel fiilen "kör" çalışıyor
(`docs/duzeltilmesi-gerekenler.md` §2.3).

**Kapsam:** bir PR `master`'a merge edildiğinde VE Keystatic bot bir yazı
yayınladığında otomatik build + deploy.

---

## Neden panelden (API ile kurulamadı)

Bu oturumdaki Cloudflare API token'ı ile denendi:

```
GET /accounts/{account_id}/builds/repos/connections   -> 401 (Invalid token)
GET /accounts/{account_id}/builds/triggers            -> 401 (Invalid token)
GET /accounts/{account_id}/workers/services/idenfit-com -> 200
```

Yani token Workers/KV işlemlerine yetiyor ama Workers Builds kapsamına
yetmiyor. Bundan bağımsız olarak, bir git deposunu bağlamak Cloudflare'ın
GitHub uygulamasının repoya kurulmasını gerektiriyor — bu, tarayıcıda
onaylanan bir OAuth akışı, API'den tek başına yapılamaz.

**Sonuç:** aşağıdaki ayarlar panelden bir kez elle girilir. Bu dosya o
ayarların repodaki tek kaydı — `docs/cloudflare-dashboard-rules.md` ile AYNI
gerekçe: yalnızca panelde yaşayan yapılandırma, bir hesap değişikliğinde veya
panel temizliğinde sessizce kaybolur.

---

## Panelde girilecek ayarlar

Workers & Pages → **idenfit-com** → Settings → Build → *Connect repository*

| Ayar | Değer |
|---|---|
| Repository | `idenfit/idenfit.com` |
| Production branch | `master` |
| Root directory | `/` |
| Build command | `npm run build:ci` |
| Deploy command | `npx wrangler deploy` |
| Build variables | (gerekmiyor — aşağıya bkz.) |

**Non-production (preview) branch build'leri KAPATILMALI.** Açık kalırsa her
dal için halka açık bir kopya üretilir; sitenin `astro.config.mjs`'teki `site`
alanı sabit `https://idenfit.com` olduğu için o kopyalar da production
canonical/hreflang/sitemap üretir — taranabilir bir ikiz site riski
(`docs/duzeltilmesi-gerekenler.md` §2.4 ile aynı gerekçe).

### Build variables neden gerekmiyor

Sitede artık hiç `PUBLIC_*` build-time değişkeni yok — GA4 ölçüm kimliği
`src/components/Analytics.astro`'ya gömülü. Çalışma zamanı secret'ları
(`SENDGRID_API_KEY` vb.) `wrangler secret`/panel tarafında ayrı yaşıyor,
build ortamıyla ilgisi yok.

### Node sürümü

`package.json` `engines.node: ">=22.12.0"` istiyor. Repoya `.nvmrc` (`22`)
eklendi. **Workers Builds'in `.nvmrc`'yi okuduğu bu oturumda DOĞRULANAMADI**
(build ortamına erişim yok) — ilk build'in log'unda kullanılan Node sürümü
kontrol edilmeli; 22'den küçükse panele `NODE_VERSION=22` build variable'ı
eklenmeli.

---

## Repo tarafı (hazır)

- **`npm run build:ci`** (`package.json`) = `astro check && astro build`.
  Tip hatası deploy'u durdurur — `astro build`'in tolere ettiği bazı tip
  hatalarını `astro check` yakalıyor.
- Deploy, build sırasında adapter'ın ürettiği `dist/server/wrangler.json`'ı
  `.wrangler/deploy/config.json` üzerinden otomatik buluyor; `--config`
  vermek gerekmiyor.
- `wrangler` doğrudan bağımlılık DEĞİL, `@astrojs/cloudflare` üzerinden
  geliyor ve `package-lock.json`'da 4.127.0 olarak sabit. Adapter bir gün
  wrangler'ı bırakırsa `npx wrangler` sessizce registry'den rastgele bir
  sürüm indirip canlıya onunla deploy eder — ilk build'den sonra log'daki
  wrangler sürümü bir kez kontrol edilmeli.

---

## Saat dilimi — ayar GEREKMİYOR (ölçülerek doğrulandı)

Önce "runner'lar UTC, yerel makine UTC+3, ürün/sektör sayfalarının 'Son
Güncelleme' damgası kayar" (Açık nokta #43) varsayımıyla bir `TZ` ayarı
planlanmıştı. **Ölçüm bu varsayımı ÇÜRÜTTÜ:**

| Ortam | `pdks-modulu` `dateModified` |
|---|---|
| Yerel build, host TZ = Europe/Istanbul | `2025-09-09T07:54:41.000Z` |
| `TZ=UTC` zorlanmış build | `2025-09-09T07:54:41.000Z` |
| Saf Node, aynı kabuk, `new Date(raw).toISOString()` | `2025-09-09T04:54:41.000Z` |

Ham veri saat dilimsiz (`"2025-09-09T07:54:41"`). İki build de AYNI değeri,
üstelik saf Node'dan FARKLI olarak UTC yorumuyla üretiyor — yani prerender
host Node'unda değil, `@astrojs/cloudflare` adapter'ının prerender
worker'ında (`dist/server/.prerender/`, workerd) çalışıyor ve workerd her
zaman UTC. **Host saat dilimi çıktıyı etkilemiyor**, dolayısıyla build
ortamında `TZ` ayarlamanın bir etkisi de olmayacak.

Blog tarihleri zaten ayrı: `src/content.config.ts` saat dilimsiz değerlere
açıkça `+03:00` ekliyor (Açık nokta #42), o yol makineden bağımsız.

---

## İlk build'den sonra doğrulanacaklar

- [ ] Deploy edilen sürüm `master` ile aynı commit'te mi:
      `git rev-parse origin/master` ile panel/`wrangler deployments list`
      karşılaştırılmalı.
- [ ] `wrangler deploy` panelde elle tanımlı route'ları silmiyor
      (`/tr/*`, `/sitemap_index.xml`, `/wp-*` — bkz.
      `docs/cloudflare-dashboard-rules.md`).
- [ ] Build log'unda Node ve wrangler sürümleri beklenen değerlerde mi.
- [ ] Keystatic panelinden yayınlanan bir yazının build'i gerçekten
      tetiklediği görülmeli.

---

## Bu kurulumun KAPSAMADIĞI şey

Workers Builds yalnızca deploy eder — **PR'larda bloklayıcı bir doğrulama
çalıştırmaz.** Projenin 9 kalıcı `check-*.mjs` regresyon script'i +
`check-blog-alt-text.mjs` artık yalnızca ELLE çalıştırılıyor:

```
npm run build:ci
DIST_DIR=dist/client node scripts/check-json-ld.mjs        # vb.
node scripts/check-blog-alt-text.mjs
```

Bir PR gate'i istenirse ayrı bir karar gerekir (Workers Builds bunu
yapmıyor).
