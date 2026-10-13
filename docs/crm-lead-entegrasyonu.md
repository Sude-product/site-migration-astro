# Web formu lead'lerinin Satış CRM'e aktarımı

**Durum (2026-10-09):** kod üç depoda hazır, canlıya alma adımları aşağıda.
Canlıya alınana kadar site eskisi gibi çalışır: CRM secret'ları tanımlı
değilken aktarım hiç denenmez.

## Ne yapar

- sales@'e giden **5 formun** (Ana sayfa, İletişim, Demo `/demo`, Online
  Sunum Talebi, İK Olgunluk Testi) her gönderimi
  `app.idenfit.com/sales-crm/leads`'e **yeni lead** olarak düşer.
  **Destek Talebi** (cx@) satış lead'i olmadığı için gitmez.
- Lead'in **Kaynak** alanına kanal yazılır: `Web - ChatGPT`, `Web - Google Ads`,
  `Web - Organik Arama`, `Web - LinkedIn`, `Web - Doğrudan` … (15 kanal).
  Listede "ChatGPT'den gelenler" tek filtreyle görülür.
- Ayrıntılar (utm_source/medium/campaign/term/content, gclid, geldiği site,
  ilk girdiği sayfa) lead'in düzenleme penceresinde **"Web sitesi kaynağı"**
  bölümünde, salt okunur.
- Lead, **Satış CRM → Ayarlar → Web Lead Havuzu**'ndaki satışçılardan birine
  **rastgele** atanır. Havuz boşsa lead yine açılır, sahipsiz kalır.
- sales@ e-postasına da "Kaynak" satırı eklendi (CRM'den bağımsız).

## Akış

```
Tarayıcı                     idenfit.com Worker (/api/lead)                idenfit-api
─────────                    ─────────────────────────────                 ───────────
sayfa açılışı → kaynak
sessionStorage'a yazılır
form gönderimi ────────────▶ doğrula → D1'e yaz → kaynağı işle
(kaynak gövdede)             yanıt döner (CRM'i beklemez)
                             waitUntil:
                               OAuth2 token (client_credentials) ─────────▶ /api/v1/oauth2/token
                               POST lead (Bearer) ────────────────────────▶ /api/v1/integrations/website/leads
                                                                            doğrula → tekrar mı? → havuzdan
                                                                            rastgele satışçı → crm_lead
                               D1 crm_status ◀──────────────────────────── 201/200 + leadId
```

| Parça | Yer |
|---|---|
| Kaynak yakalama | `src/data/leadAttribution.ts`, `src/scripts/lead-attribution.js` (BaseLayout + LandingLayout) |
| Aktarım | `src/data/crmLeadSync.ts` (çağıran: `src/pages/api/lead.ts`) |
| D1 kolonları | `migrations/0002_lead_attribution_crm.sql` |
| API ucu | idenfit-api `api/crm/websitelead/WebsiteLeadIngestController` + `WebsiteLeadIngestService` |
| Atama havuzu | idenfit-api `WebsiteLeadAssigneePool` + `CrmWebsiteLeadSettingsController`; UI `pages/sales-crm/settings/website-leads.vue` |
| Kanal listesi | üç yerde **birebir aynı** tutulmalı: API `WebsiteLeadChannel`, site `LEAD_CHANNEL_LABELS`, UI `CrmSourceSelect.SOURCE_OPTIONS` |

## Güvenlik kontrolleri

- **Herkese açık uç YOK.** Tarayıcı API'ye hiç istek atmaz; kimlik bilgisi
  yalnız Worker secret'ında (`IDENFIT_CRM_CLIENT_ID/SECRET`) durur ve
  `crmLeadSync.ts` istemci paketine girmez (build çıktısında doğrulandı).
- **Dar yetkili makine kimliği:** OAuth2 client_credentials, kapsam
  `crm.leads.write`; client **globme organizasyonuna bağlı** olmak zorunda
  (global client reddedilir). Pasifleştirilen client'ın token'ı bir sonraki
  istekte reddedilir (`OAuth2ResourceFilter` her istekte client'a bakar).
- **Uç yalnız lead OLUŞTURUR** — okuma, güncelleme, silme yok.
- **İstek sınırı:** client başına dakikada 60 (Redis).
- **CRM aktarımı reCAPTCHA'ya bağlı:** `/api/lead` kimliksiz bir uç; her
  kabul edilen gönderim CRM'de lead + iş akışı + satışçı ataması demek.
  `RECAPTCHA_SECRET_KEY` tanımlı değilse lead D1'e ve e-postaya yine düşer
  ama CRM'e **gitmez** (`isCrmSyncConfigured()`, log uyarır).
- **HTTPS zorunlu:** `OAuth2HttpsEnforcementFilter` bu uca da uygulanıyor
  (düz HTTP isteği 403).
- **API tarafında doğrulama:** alan uzunlukları, e-posta biçimi, form türü
  beyaz listesi (destek talebi reddedilir), kanal kodu sabit listeden, kaynak
  anahtarları sabit listeden. Serbest metindeki kontrol karakterleri
  (sekme, satır sonu) **reddedilmez, temizlenir** — Excel'den kopyalanan bir
  sekme yüzünden lead düşmesin; temizlenen değer kontrol karakteri taşımadığı
  için başlık/log enjeksiyonu yine kapalı. Site tarafı kaynak bilgisini
  ayrıca temizliyor.
- **Zorunlu özel alan web lead'ini düşürmez:** CRM'de LEAD için zorunlu bir
  özel alan tanımlanırsa web lead'i yine açılır (varsayılan değerler
  uygulanır), alan lead ekrandan kaydedilirken istenir
  (`CrmCustomFieldValidator.Mode.WITHOUT_REQUIRED`).
- **Havuz pasif çalışanı atlar:** işten ayrılmış (pasif) çalışan CRM erişimi
  kaldırılmamış olsa da lead almaz ve havuza eklenemez.
- **Tekrar güvenli (idempotent):** `crm_lead (organization_id,
  external_source, external_id)` benzersiz indeksi — aynı D1 kaydı ikinci
  lead açmaz; CRM'de silinmiş bir lead otomasyonla geri gelmez (409).
- **IP kısıtı yok, bilinçli:** Cloudflare Worker'ların çıkış IP'si sabit değil.
- **Gerçek HTTP durum kodları** (idenfit'in "200 + error" zarfı değil): site
  başarısızlığı durum koduyla anlar. Site ayrıca 200/201'de gövdede `leadId`
  arar; yoksa (ör. API'nin uç dışında "200 + error" dönen bir hata yolu)
  kayıt `sent` değil `failed` olur.
- **Loglarda kişisel veri yok** (iki tarafta da yalnız kayıt numarası + durum).
- Kaynak alanları CRM'de **salt okunur**: ekrandan kaydetme bunları
  değiştiremez (`CrmLeadMapper` gövdeden okumaz).

## Canlıya alma (bir kerelik, sırayla)

1. **idenfit-api** PR'ları: `env/dev` → `env/prod` → `env/preprod`. Migration
   iki parça: `crm_lead` kolonları + benzersiz indeks, `oauth2_scope`
   satırı `crm.leads.write` (Liquibase kapalıysa `devops/migrations/pg/`
   altındaki `2026-10-09_*` ikizleri elle).
2. **idenfit-ui** PR'ları (API'den SONRA): `dev` → `master` → `preprod`.
3. **Canlı API'de OAuth2 istemcisi** — `env/prod` PR'ı deploy edildikten
   SONRA (kapsam satırı ondan önce yok, istek
   `Unknown or inactive scope(s): [crm.leads.write]` ile reddedilir).
   Çağrı **globme organizasyonunda "Admin"/"Yönetici" rolündeki** bir
   kullanıcının app.idenfit.com oturum token'ıyla yapılır
   (`@RequireGlobmeAdmin`); token tarayıcının DevTools → Network sekmesinde
   `api.idenfit.com`'a giden herhangi bir isteğin `Authorization: Bearer …`
   başlığından alınır.

   ```bash
   # Secret'ı yerelde üret; hiçbir yere yapıştırma, 5. adımda Cloudflare'e girilecek
   CLIENT_SECRET=$(openssl rand -base64 48 | tr -d '/+=\n' | cut -c1-48)
   read -rs ADMIN_TOKEN   # app.idenfit.com oturum token'ı ("Bearer " olmadan)

   curl -sS -X POST https://api.idenfit.com/api/v1/oauth2/clients \
     -H "Authorization: Bearer $ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d @- <<EOF
   {
     "clientId": "idenfit-website",
     "clientName": "idenfit.com web formları",
     "description": "Web formu lead'lerini Satış CRM'e yazar",
     "clientSecret": "$CLIENT_SECRET",
     "redirectUri": "https://idenfit.com/",
     "scopes": ["openid", "crm.leads.write"],
     "grantTypes": ["client_credentials"],
     "organizationId": "07ab0e73-f8ea-429e-9a35-76b3e25fa2ac",
     "globalAccess": false
   }
   EOF
   ```

   - **`openid` zorunlu:** API her istemcide ister (`CreateClientRequest`
     doğrulaması); yalnız `crm.leads.write` gönderilirse 400 döner. Token
     isteğinde ise site yalnız `scope=crm.leads.write` ister.
   - **Yanıtta `organizationId` = `07ab0e73-…` olduğunu kontrol edin.** API
     kuruluşu bulamazsa alanı sessizce boş bırakıyor; o durumda istemci
     hiçbir kuruluşa bağlı olmaz ve lead ucu her isteğe 403 döner.
   - `redirectUri` bu akışta kullanılmaz ama alan zorunlu. Secret API'de
     BCrypt ile saklanır, bir daha okunamaz — yalnız 5. adımda Cloudflare'e
     girilir, başka hiçbir yere yazılmaz.
   - İsteğe bağlı token denemesi (lead açmaz):
     `curl -sS -X POST https://api.idenfit.com/api/v1/oauth2/token -d grant_type=client_credentials -d client_id=idenfit-website --data-urlencode "client_secret=$CLIENT_SECRET" -d scope=crm.leads.write`
     → yanıtta `access_token` olmalı.
4. **D1 migration** (site deploy'undan önce):
   `npx wrangler d1 migrations apply idenfit-leads --remote`
   (Unutulursa lead kaydı yine çalışır, yalnız kaynak/CRM kolonları yazılmaz.)
5. **Cloudflare secret'ları:** Workers & Pages → `idenfit-com` → Settings →
   Variables and Secrets → **Add** → tür **Secret** (Variable DEĞİL) →
   `IDENFIT_CRM_CLIENT_ID` = `idenfit-website` ve
   `IDENFIT_CRM_CLIENT_SECRET` = 3. adımdaki değer. (Komut satırından:
   `npx wrangler secret put IDENFIT_CRM_CLIENT_ID` /
   `… IDENFIT_CRM_CLIENT_SECRET`.) Secret, her deploy'da korunur; panelden
   eklenen düz "Variable" ise `wrangler.json`'da yoksa sonraki deploy'da
   silinebilir.
   `IDENFIT_CRM_API_URL` zaten `wrangler.json`'da (`https://api.idenfit.com`).
   `RECAPTCHA_SECRET_KEY`'in de canlıda tanımlı olduğunu doğrulayın — yoksa
   aktarım çalışmaz (bkz. Güvenlik kontrolleri).
6. **Site PR'ı** merge → Workers Builds deploy eder.
7. **Satış CRM → Ayarlar → Web Lead Havuzu**'ndan satışçıları seçin.
8. **Deneme:** `https://idenfit.com/?utm_source=chatgpt&utm_medium=test`
   ile girip bir sayfa gezin, Online Sunum formunu doldurun. Lead CRM'de
   "Web - ChatGPT" kaynağıyla görünmeli; D1'de satırın `crm_status`'u `sent`.

## İşletim

- **Takılanlar:** `node scripts/export-leads.mjs --crm-failed`.
  `failed` = geçici sorun, yeniden denenir; `skipped` = CRM kalıcı reddetti
  (`crm_error` nedenini yazar), elle bakılmalı.
- **Yeniden deneme:** ayrı bir zamanlanmış iş yok. Her yeni lead geldiğinde,
  en az 10 dakikadır bekleyen en fazla 3 başarısız kayıt da yeniden denenir
  (kayıt başına en fazla 5 deneme). Hepsi `waitUntil`'in ~30 sn sınırı içinde
  25 sn'lik bir bütçeyle koşar; deneme sayacı deneme BAŞLARKEN artar, yani
  isolate kesildiği için `pending`'de kalan kayıt da tavana takılır.
- **Secret yenileme:** API'de client secret'ı değiştirin → aynı değeri
  `wrangler secret put IDENFIT_CRM_CLIENT_SECRET` ile girin.
- **Kapatma:** API'de client'ı pasifleştirin (anında etkili) ya da
  Cloudflare secret'larını silin. Lead'ler D1'e ve e-postaya gitmeye devam eder.

## Bilinçli sınırlar

- **Geçmiş lead'ler aktarılmadı** — yalnız yayından sonra gelenler. İstenirse
  D1'den tek seferlik bir aktarım yazılabilir (kaynak bilgisi onlarda zaten yok).
- **Kaynak sekme bazlı:** bugün ChatGPT'den gelip sekmeyi kapatan, üç gün
  sonra Google'dan dönen kişi "Google" görünür. Günler arası takip çerez
  gerektirir (çerez onayı + hukuk kararı). Aynı sekmede başka bir dış siteye
  çıkıp oradan (ya da yeni bir kampanya linkiyle) geri dönen kişide kaynak
  **son dış geliş** olur; site içi gezinme ve doğrudan girişler kaydı değiştirmez.
- **Kaynak alanı serbest metin:** CRM kullanıcısı ekrandan da "Web - ChatGPT"
  seçebilir. Bir lead'in gerçekten web formundan geldiğinin kanıtı
  `externalSource = website` (ve "Web sitesi kaynağı" bölümü); raporlar
  etikete değil buna dayanmalı.
- **Ad/soyad bölme** son kelimeyi soyad sayar; tam ad D1'de ve e-postada.
- **Mesaj** CRM açıklamasına (512 karakter) kırpılarak girer; tamamı D1'de ve
  e-postada.
- **Atama tekdüze rastgele;** kısa vadede biri arka arkaya birkaç lead
  alabilir. Eşit dağılım istenirse API'de sıralı seçime çevrilebilir.
- **E-postaya göre birleştirme yok:** aynı kişi iki form doldurursa iki lead.

## KVKK

- Kaynak bilgisi çerez değil, sekmenin oturum deposunda; IP saklanmaz;
  sunucuya yalnız kişi formu gönderirse gider. Yine de **aydınlatma
  metnine** "siteye hangi kanaldan geldiğiniz" ve "satış ekibimizin CRM
  sisteminde işlenmesi" eklenmeli (hukuk).
- Ürün veritabanı AWS İrlanda'da; mevcut yurt dışı aktarım dayanağının
  web lead'lerini de kapsadığı hukukça teyit edilmeli.
- Silme talebinde üç yer: D1 `leads`, CRM `crm_lead`, CRM denetim günlüğü
  (lead oluşturma kaydı e-posta/telefonun kopyasını tutar).
- İK Olgunluk Testi formunda hâlâ KVKK metni yok (bkz. `lead-storage-d1.md`).
