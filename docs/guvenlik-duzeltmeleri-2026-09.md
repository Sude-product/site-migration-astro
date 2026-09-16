# Güvenlik düzeltmeleri — 2026-09 pentest turu

Bu tur, kullanıcının kendi sitesi üzerinde YETKİLİ bir güvenlik incelemesinin
(black/red/white hat) bulgularını kapatıyor. Bulgu başına seçilen çözüm
kullanıcı tarafından tek tek onaylandı.

| Bulgu | Seçilen çözüm | Nerede yapılır | Durum |
|---|---|---|---|
| **K1** — Worker route kapsamı | (b) Route `idenfit.com/*`, origin fallthrough kapalı | Cloudflare paneli | ⬜ ELLE |
| **K2** — `/api/lead` payload güveni | (a) Seviye metni sunucuda hesaplansın + e-posta/uzunluk doğrulaması | Kod | ✅ |
| **K3** — JSON-LD script kaçışı | (a) Paylaşılan `safeJsonLd()` | Kod | ✅ |
| **K4** — Blog gövdesinde ham HTML | (a) `rehype-raw` + `rehype-sanitize` allowlist | Kod | ✅ |
| **Y1** — `/api/lead` hız sınırı | (a) Cloudflare Rate Limiting Rule | Cloudflare paneli | ⬜ ELLE |
| **Y2** — E-posta URL'de taşınıyor | (a) `sessionStorage` ile aktarım | Kod | ✅ |
| **Zincir** — Blog XSS → deploy | (A) GitHub ruleset + Keystatic yol kısıtı | GitHub paneli | ⬜ ELLE |

Kod tarafındaki 4 madde bu depoda; kalan 3'ü YALNIZCA panelden yapılabiliyor
(kod karşılığı yok). Adımları aşağıda.

---

## K1-b — Worker route'unu `idenfit.com/*` yap, origin fallthrough'u kapat

**Sorun:** Worker yalnızca bir alt küme yolda çalışıyorsa, eşleşmeyen istekler
eski origin'e düşer — CSP/`_headers`/middleware'in HİÇ uygulanmadığı,
denetlenmemiş bir ikinci yüzey kalır.

1. Cloudflare Dashboard → **Workers & Pages** → ilgili Worker → **Settings** →
   **Domains & Routes**.
2. Route'un **tam olarak** `idenfit.com/*` (ve gerekiyorsa `www.idenfit.com/*`)
   olduğunu doğrula. Daha dar bir desen (`idenfit.com/api/*` gibi) varsa
   genişlet.
3. Aynı ekranda route'un **"Fail open / Fail closed"** ayarını **Fail closed**
   yap — Worker hata verirse istek origin'e DÜŞMESİN.
4. **Doğrulama:** `curl -sI https://idenfit.com/ | grep -i content-security-policy`
   — `Content-Security-Policy-Report-Only` başlığı DÖNMELİ. Aynısını bir blog
   yazısı ve `/fiyatlar/` için tekrarla.

---

## Y1-a — `POST /api/lead` için Cloudflare Rate Limiting Rule

**Sorun:** Mevcut hız sınırı Worker **isolate'ının İÇİNDE** tutulan bir sayaç
(bkz. `src/pages/api/lead.ts`) — aynı istemci farklı isolate'lara denk
gelebildiği için dağıtık/garantili DEĞİL. Gerçek sınır edge'de olmalı.

1. Cloudflare Dashboard → `idenfit.com` → **Security** → **WAF** →
   **Rate limiting rules** → **Create rule**.
2. **If incoming requests match:**
   - Field `URI Path` — Operator `equals` — Value `/api/lead`
   - `And` → Field `Request Method` — Operator `equals` — Value `POST`
3. **Characteristics:** `IP` (ücretsiz planda tek seçenek).
4. **Rate:** `10` istek / `1 minute` (Worker içindeki mevcut sınırla aynı —
   meşru bir kullanıcı tek formu bir kez gönderir, 10 fazlasıyla yeterli).
5. **Then take action:** `Block`, **Duration:** `1 minute`.
6. **Doğrulama:** aynı IP'den art arda 12 POST at, 11.'den itibaren `429`
   (veya kuralın döndürdüğü blok yanıtı) gelmeli.

> Worker içindeki sayaç KALDIRILMADI — ucuz bir ikinci katman olarak duruyor.

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
