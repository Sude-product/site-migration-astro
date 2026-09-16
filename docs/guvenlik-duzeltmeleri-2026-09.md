# Güvenlik düzeltmeleri — 2026-09 pentest turu

Bu tur, kullanıcının kendi sitesi üzerinde YETKİLİ bir güvenlik incelemesinin
(black/red/white hat) bulgularını kapatıyor. Bulgu başına seçilen çözüm
kullanıcı tarafından tek tek onaylandı.

| Bulgu | Seçilen çözüm | Nerede yapılır | Durum |
|---|---|---|---|
| **K1** — Worker route kapsamı | (b) Origin fallthrough kapatılsın | Cloudflare paneli | ⬜ ELLE — *tarif DÜZELTİLDİ, aşağı bkz.* |
| **K2** — `/api/lead` payload güveni | (a) Seviye metni sunucuda hesaplansın + e-posta/uzunluk doğrulaması | Kod | ✅ |
| **K3** — JSON-LD script kaçışı | (a) Paylaşılan `safeJsonLd()` | Kod | ✅ |
| **K4** — Blog gövdesinde ham HTML | (a) `rehype-raw` + `rehype-sanitize` allowlist | Kod | ✅ |
| **Y1** — `/api/lead` hız sınırı | (a) Cloudflare Rate Limiting Rule | Cloudflare API | ✅ UYGULANDI |
| **Y2** — E-posta URL'de taşınıyor | (a) `sessionStorage` ile aktarım | Kod | ✅ |
| **Zincir** — Blog XSS → deploy | (A) GitHub ruleset + Keystatic yol kısıtı | GitHub paneli | ⬜ ELLE |

Kod tarafındaki 4 madde bu depoda; kalan 3'ü YALNIZCA panelden yapılabiliyor
(kod karşılığı yok). Adımları aşağıda.

---

## K1-b — Origin fallthrough'u kapat  ⬜ HÂLÂ AÇIK

> **⚠️ İLK TARİF YANLIŞTI.** "Route'u `idenfit.com/*` yap" demiştim — o route
> **ZATEN VAR** (`782f68fb...` → `idenfit-com`). Canlı Cloudflare API'si
> okununca gerçek sorun çıktı ve DAHA CİDDİ: zone'da `script: null` taşıyan
> **5 route** var. Cloudflare'da daha SPESİFİK route kazandığı için bu yollar
> Worker'a HİÇ uğramıyor, doğrudan eski origin'e (`92.204.25.71`) gidiyor.

**Canlı kanıt (2026-09-16, `curl`):** eski WordPress bu yollarda AYAKTA —

| Yol | Yanıt | Kanıt |
|---|---|---|
| `/wp-admin/` | 302 | `X-Powered-By: PHP/8.4.23` |
| `/wp-login.php` | 404 ama **27.705 bayt WP HTML** | `Link: <https://idenfit.com/wp-json/>` |
| `/wp-json/wp/v2/users` | **401** | gerçek WP REST API |
| `/wp-content/plugins/` | 200 | PHP |
| `/wp-includes/` | 403 | — |

Bu sayfaların HİÇBİRİNDE CSP başlığı yok (Astro sayfalarında var). Yani
migrasyonu tamamlanmış production alan adının altında, denetlenmemiş,
eski bir WordPress yönetim yüzeyi duruyor: wp-login brute-force, eklenti
açıkları, `wp-json` üzerinden kullanıcı/içerik numaralandırması.

**Silinecek 5 route (ID'ler canlıdan alındı):**

```
cbeb932cf5d34a0aa097c06f1fab5601   idenfit.com/wp-includes/*
31cd33f6aecb4ccd9dbabaeb51fdf9d1   idenfit.com/wp-login.php*
e55af70a584649ff8238d847ae67907e   idenfit.com/wp-admin*
563d96d71638436dbaeb66816787c329   idenfit.com/wp-json/*
bd68d513390c48a3b0c656c368aa25b5   idenfit.com/wp-content/plugins/*
```

**Neden silmek güvenli — varsayım değil, ölçüldü:**
1. `www.idenfit.com` tarafında bu null-route'ların HİÇBİRİ yok ve aynı
   yollar orada **301** dönüyor (Worker işliyor) — yani istenen son durum
   zaten bir hostname'de canlı ve bir şeyi bozmuyor.
2. Kendi kod tabanımız bu yollara bağımlı değil: `dist/client` içinde
   `wp-json`/`wp-admin`/`wp-content/plugins` referansı **0**; kaynakta tek
   eşleşme `HrMaturityTest.tsx:683`'te bir **yorum satırı**.
3. `/wp-content/uploads/*` bu listede DEĞİL — site görselleri etkilenmiyor.
4. Silme geri alınabilir: aynı pattern + `script: null` ile yeniden yaratılır.
   Yedek: bu turda `routes-backup.json` alındı (geçici dizinde).

**Panelden:** Workers & Pages → `idenfit-com` → Settings → Domains & Routes →
yukarıdaki 5 route'u sil. (Ya da zone: Workers Routes listesinden.)

**API ile (eşdeğeri):**
```bash
Z=f8a19f6da3e055f00bc3510a4b15f3e0
for id in cbeb932cf5d34a0aa097c06f1fab5601 31cd33f6aecb4ccd9dbabaeb51fdf9d1 \
          e55af70a584649ff8238d847ae67907e 563d96d71638436dbaeb66816787c329 \
          bd68d513390c48a3b0c656c368aa25b5; do
  curl -s -X DELETE "https://api.cloudflare.com/client/v4/zones/$Z/workers/routes/$id" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
done
```

**Doğrulama:** `curl -sI https://idenfit.com/wp-json/wp/v2/users` →
`X-Powered-By: PHP` KAYBOLMALI, yanıt bizim Worker'ımızın 404'ü olmalı.

**Neden bu turda BEN yapamadım:** yetenek eksikliği değil — API token'ı
çalışıyor ve route'ları okuyabildim. `DELETE .../workers/routes/...`
çağrısını bu ortamın kendi güvenlik sınıflandırıcısı **"DNS / Domain /
Cert Changes"** kategorisinde engelledi. İzin verilirse tek komutla
uygulanabilir.

---

## Y1-a — `POST /api/lead` hız sınırı  ✅ UYGULANDI (2026-09-16)

Cloudflare API ile oluşturuldu, panelden bir şey yapmaya gerek YOK.

| Alan | Değer |
|---|---|
| Zone | `f8a19f6da3e055f00bc3510a4b15f3e0` (idenfit.com, **Pro** plan) |
| Ruleset | `88d72fe1a02a43f9a752a548092de40e` (`http_ratelimit` entrypoint) |
| Kural ID | `aac50a461a56472cb86b8f82c91b556f` |
| İfade | `(http.request.method eq "POST" and http.request.uri.path eq "/api/lead")` |
| Limit | 10 istek / 60 sn, karakteristik `ip.src` + `cf.colo.id` |
| Aksiyon | `block`, 60 sn |

Zone'da önceden var olan `assign.idenfit.com` kuralına DOKUNULMADI —
yeni kural `POST` ile ruleset'e EKLENDİ (PUT ile tüm kural listesi
değiştirilmedi).

**İki dürüst sınır:**
1. **Doğrulanamadı.** 18 ardışık POST atıldı, 429 GÖRÜLMEDİ — ama bu
   kuralın bozuk olduğunu göstermiyor: bu geliştirme ortamının çıkış IP'si
   her istekte bir havuzdan değişiyor (`160.79.106.128–137` ölçüldü), kural
   ise IP başına saydığı için eşiğe hiç ulaşılamıyor. İzole bir kontrol
   deneyi de (geçici `/robots.txt` 2/10sn kuralı) aynı nedenle tetiklenmedi
   ve hemen geri alındı. **Tek IP'li normal bir makineden `for i in $(seq 1 12);
   do curl -s -o /dev/null -w "%{http_code}\n" -X POST https://idenfit.com/api/lead \
   -H 'Content-Type: application/json' --data '{}'; done` ile 1 dakika içinde
   doğrulanabilir** — 11. istekten itibaren 429 beklenir.
2. **Sayım colo başına.** Free/Pro planlarda `cf.colo.id` karakteristiği
   zorunlu (mevcut `assign` kuralı da öyle) — yani sınır global değil, her
   Cloudflare veri merkezi kendi sayacını tutar. Dağıtık bir saldırgan için
   gerçek tavan 10 × (kullandığı colo sayısı). Yine de tek kaynaklı
   kötüye kullanıma karşı gerçek bir katman.

Worker içindeki mevcut sayaç (`src/pages/api/lead.ts`) KALDIRILMADI — ucuz
bir ikinci katman olarak duruyor.

---

## Zincir-A — GitHub ruleset + Keystatic yol kısıtı

**Sorun (zincirin tamamı):** blog gövdesine yazılan bir script bizim
origin'imizde çalışıyordu → aynı origin'in `localStorage`'ındaki Keystatic
editör token'ı okunabiliyordu → o token'la `master`'a commit atılabiliyordu →
Workers Builds otomatik deploy ediyordu → Worker secret'larının tamamı.
K4 zincirin GİRİŞİNİ kapattı; bu adım ÇIKIŞINI kapatıyor (savunmanın iki ucu).

### 1. `master` üzerinde ruleset

1. GitHub → `idenfit/idenfit.com` → **Settings** → **Rules** → **Rulesets** →
   **New branch ruleset**.
2. **Name:** `master-korumasi`, **Enforcement status:** `Active`.
3. **Target branches:** `Include default branch`.
4. Aşağıdakileri işaretle:
   - ✅ **Require a pull request before merging** → `Required approvals: 1`
   - ✅ **Block force pushes**
   - ✅ **Restrict deletions**
5. **Bypass list:** BOŞ bırak. (Buraya bir kimlik eklenirse kural o kimlik
   için hiç uygulanmaz — zincirin çıkışı açık kalır.)

> **Dikkat — Keystatic'i kırar:** `keystatic-cloud[bot]` bugün `master`'a
> DOĞRUDAN commit atıyor. Ruleset açılınca pazarlama ekibinin "Save"i
> başarısız olur. İki seçenek, ikisi de ekip kararı:
> - **(i)** Keystatic'i bir içerik dalına (`content`) yazacak şekilde
>   yapılandırıp `content → master` PR'larını otomatik/haftalık merge etmek;
> - **(ii)** Bot'u bypass listesine almak — AMA o zaman zincirin çıkışı
>   kapanmaz, yalnızca İNSAN push'ları kısıtlanmış olur. Bu durumda 2. adım
>   (yol kısıtı) tek gerçek koruma olarak kalır, dolayısıyla ZORUNLU olur.

### 2. Keystatic GitHub App'ini yalnızca içerik yollarına kısıtla

Amaç: token çalınsa bile saldırganın `astro.config.mjs`/`src/pages/api/*`
gibi ÇALIŞAN koda commit atamaması.

1. GitHub → **Settings** → **Integrations** → **GitHub Apps** →
   Keystatic Cloud → **Configure**.
2. **Repository access** zaten `Only select repositories` / `idenfit.com`
   olmalı; değilse öyle yap.
3. GitHub App izinleri **yol bazlı kısıtlamayı desteklemiyor** — bu yüzden
   kısıt depo tarafında uygulanır: **Settings → Rules → New branch ruleset**
   ile ikinci bir ruleset oluştur:
   - **Name:** `keystatic-yol-kisiti`, **Enforcement:** `Active`
   - **Target branches:** `Include default branch`
   - ✅ **Restrict file paths** → **Add restricted path**:
     `astro.config.mjs`, `package.json`, `package-lock.json`,
     `wrangler.json`, `src/pages/api/**`, `src/middleware.ts`,
     `src/data/csp.ts`, `scripts/**`, `public/_headers`, `.github/**`
   - **Bypass list:** yalnızca kod yazan insan geliştiriciler (bot DEĞİL).
4. **Doğrulama:** Keystatic panelinden bir yazı kaydet — başarılı olmalı.
   Ardından bot kimliğiyle `astro.config.mjs`'e bir değişiklik denenirse
   reddedilmeli.

---

## YENİ BULGU (2026-09-16) — origin IP korumasız ve doğrudan erişilebilir

K1 araştırmasının yan ürünü. `test.idenfit.com` DNS kaydı **proxy'siz**
(gri bulut) ve apex ile AYNI origin'e (`92.204.25.71`) gidiyor.
`curl -I https://test.idenfit.com/` → `Server: Apache`, `X-Powered-By:
PHP/8.4.23`, **`cf-ray` başlığı YOK** — yani istek Cloudflare'a hiç
uğramıyor.

**Sonuç:** apex'e uyguladığımız her Cloudflare katmanı (CSP, WAF, yukarıdaki
hız sınırı, bot koruması) bu hostname üzerinden veya doğrudan IP'ye giderek
TAMAMEN atlanabilir. Ayrıca origin IP'si böylece herkese açık — apex'e
yapılacak bir DDoS/WAF korumasının anlamı kalmaz.

Şu an `/` için 500 dönüyor (site orada tam çalışmıyor) ama PHP çalışıyor,
sunucu ayakta. **Öneri (ayrı bir karar):** eski WP tamamen kapatılana kadar
`test.idenfit.com` ya proxy'ye alınmalı (turuncu bulut) ya da kaldırılmalı;
origin sunucusu yalnızca Cloudflare IP aralıklarından gelen isteği kabul
edecek şekilde kısıtlanmalı. Aynı origin'e işaret eden başka kayıt olup
olmadığı da taranmalı.

---

## Doğrulanmış ama KAPSAM DIŞI bırakılanlar

- **`/_image` endpoint'i** — bir ajan "günlük ~$2.000 fatura kötüye kullanımı"
  iddia etti; CANLI test bunu DOĞRULAMADI (yerel bir görsel için HTTP 500,
  uzak `href` için 403). Yüzey var, sömürülebilirliği KANITLANMADI.
- **Astro GHSA-26w7-cxv4-gfx2 (CVSS 9.8)** — sürüm (astro 7.2.4) etkilenen
  aralıkta AMA kod yolu ERİŞİLEBİLİR DEĞİL: `astro:assets`/`<Image>` bu
  projede hiç kullanılmıyor, production Cloudflare görsel servisini kullanıyor
  (sharp değil).
- **`lh3.googleusercontent.com` görselinin yerelleştirilmesi** — bu ortamın
  ağ politikası o host'a çıkışı 403 ile reddettiği için İNDİRİLEMEDİ, bkz.
  `docs/csp-rollout.md` TODO-1.
