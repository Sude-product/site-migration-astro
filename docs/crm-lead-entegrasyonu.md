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
- **API tarafında doğrulama:** alan uzunlukları, kontrol karakteri yasağı
  (CR/LF başlık enjeksiyonu dahil), e-posta biçimi, form türü beyaz listesi
  (destek talebi reddedilir), kanal kodu sabit listeden, kaynak anahtarları
  sabit listeden. Site tarafı da aynı değerleri ayrıca temizliyor.
- **Tekrar güvenli (idempotent):** `crm_lead (organization_id,
  external_source, external_id)` benzersiz indeksi — aynı D1 kaydı ikinci
  lead açmaz; CRM'de silinmiş bir lead otomasyonla geri gelmez (409).
- **IP kısıtı yok, bilinçli:** Cloudflare Worker'ların çıkış IP'si sabit değil.
- **Gerçek HTTP durum kodları** (idenfit'in "200 + error" zarfı değil): site
  başarısızlığı durum koduyla anlar.
- **Loglarda kişisel veri yok** (iki tarafta da yalnız kayıt numarası + durum).
- Kaynak alanları CRM'de **salt okunur**: ekrandan kaydetme bunları
  değiştiremez (`CrmLeadMapper` gövdeden okumaz).

## Canlıya alma (bir kerelik, sırayla)

1. **idenfit-api** PR'ları: `env/dev` → `env/prod` → `env/preprod`. Migration
   iki parça: `crm_lead` kolonları + benzersiz indeks, `oauth2_scope`
   satırı `crm.leads.write` (Liquibase kapalıysa `devops/migrations/pg/`
   altındaki `2026-10-09_*` ikizleri elle).
2. **idenfit-ui** PR'ları (API'den SONRA): `dev` → `master` → `preprod`.
3. **Canlı API'de OAuth2 istemcisi** — globme yöneticisi
   `POST https://api.idenfit.com/api/v1/oauth2/clients`:

   ```json
   {
     "clientId": "idenfit-website",
     "clientName": "idenfit.com web formları",
     "description": "Web formu lead'lerini Satış CRM'e yazar",
     "clientSecret": "<güçlü rastgele değer — en az 32 karakter>",
     "redirectUri": "https://idenfit.com/",
     "grantTypes": ["client_credentials"],
     "scopes": ["crm.leads.write"],
     "organizationId": "07ab0e73-f8ea-429e-9a35-76b3e25fa2ac",
     "globalAccess": false
   }
   ```

   `redirectUri` bu akışta kullanılmaz ama alan zorunlu. Secret API'de
   BCrypt ile saklanır, bir daha okunamaz — yalnız bir sonraki adımda
   Cloudflare'e girilir, başka hiçbir yere yazılmaz.
4. **D1 migration** (site deploy'undan önce):
   `npx wrangler d1 migrations apply idenfit-leads --remote`
   (Unutulursa lead kaydı yine çalışır, yalnız kaynak/CRM kolonları yazılmaz.)
5. **Cloudflare secret'ları:**
   `npx wrangler secret put IDENFIT_CRM_CLIENT_ID` ve
   `npx wrangler secret put IDENFIT_CRM_CLIENT_SECRET`.
   `IDENFIT_CRM_API_URL` zaten `wrangler.json`'da (`https://api.idenfit.com`).
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
  (kayıt başına en fazla 5 deneme).
- **Secret yenileme:** API'de client secret'ı değiştirin → aynı değeri
  `wrangler secret put IDENFIT_CRM_CLIENT_SECRET` ile girin.
- **Kapatma:** API'de client'ı pasifleştirin (anında etkili) ya da
  Cloudflare secret'larını silin. Lead'ler D1'e ve e-postaya gitmeye devam eder.

## Bilinçli sınırlar

- **Geçmiş lead'ler aktarılmadı** — yalnız yayından sonra gelenler. İstenirse
  D1'den tek seferlik bir aktarım yazılabilir (kaynak bilgisi onlarda zaten yok).
- **Kaynak sekme bazlı:** bugün ChatGPT'den gelip sekmeyi kapatan, üç gün
  sonra Google'dan dönen kişi "Google" görünür. Günler arası takip çerez
  gerektirir (çerez onayı + hukuk kararı).
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
