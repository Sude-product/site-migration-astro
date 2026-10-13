# Form lead'lerinin kalıcı kaydı (Cloudflare D1)

**Durum:** canlı. `2026-09-22` itibarıyla `/api/lead`'e düşen HER form
gönderimi Cloudflare D1'e yazılıyor.

## Neden

`/api/lead` bu değişikliğe kadar **hiçbir yere yazmıyordu** — yalnızca
SendGrid'e e-posta atıyordu. E-posta bir kayıt defteri değil:

- SendGrid anahtarı yokken (bugünkü durum) endpoint 503 dönüyordu ve
  lead'den geriye **hiçbir iz kalmıyordu**;
- İK Olgunluk Testi akışında PDF üretimi çökerse ekip bildirimi de
  düşüyordu, kullanıcı yine "başarılı" görüyordu;
- eski WordPress sitesindeki Google Sheet bağlantısı Astro'ya geçişte
  kopmuştu, Sheet boş kalıyordu.

## Nerede ne var

| Parça | Yol |
|---|---|
| Veritabanı | Cloudflare D1, `idenfit-leads` (`86e77b2d-0d00-47e6-be44-5663da85c3ea`, WEUR) |
| Binding | `wrangler.json` → `d1_databases[].binding = "LEADS_DB"` |
| Şema | `migrations/0001_create_leads.sql`, `migrations/0002_lead_attribution_crm.sql` (kaynak + CRM aktarımı) |
| Yazma katmanı | `src/data/leadStore.ts` |
| Çağrıldığı yer | `src/pages/api/lead.ts` (POST handler) |
| CSV dışa aktarım | `scripts/export-leads.mjs` |
| İlk-giriş kaynağı | `src/data/leadAttribution.ts`, `src/scripts/lead-attribution.js` |
| Satış CRM aktarımı | `src/data/crmLeadSync.ts` — ayrıntı `docs/crm-lead-entegrasyonu.md` |

## Akış

1. İstek doğrulanır (hız sınırı → JSON → payload → reCAPTCHA).
2. **Lead D1'e yazılır** (`email_status = 'pending'`), ardından ilk-giriş
   kaynağı (`utm_*`, `gclid`, `referrer_host`, `landing_path`, `channel`)
   ayrı bir UPDATE ile işlenir.
3. sales@'e giden formlarda lead **arka planda Satış CRM'e** iletilir
   (`crm_status`) — e-posta adımlarından bağımsız.
4. SendGrid yapılandırması kontrol edilir. Eksikse satır `'failed'`
   işaretlenir ve kullanıcıya **dürüst** bir 503 döner — veri yine de durur.
5. E-posta gönderilir; sonuç `email_status`'a işlenir (`sent` / `failed`).
   İK Olgunluk Testi'nde bu adım `waitUntil` içinde, PDF üretimiyle birlikte.

**Sıra kasıtlı:** kayıt e-postadan ÖNCE. `leadStore` hiçbir zaman throw
etmez — veritabanı erişilemezse form akışı aynen devam eder (e-posta yine
gider), kullanıcı altyapı sorunundan dolayı formu tekrar doldurmaz.

## Kolonlar

`created_at` her zaman UTC ("Z" damgalı) — Workers runtime'ı (workerd)
her zaman UTC çalışır.

`form_type` altı değerden biri: `hero`, `contact`, `landing`, `support`,
`presentation`, `hrMaturityReport`.

`employee_count` / `sector` yalnızca İK Olgunluk Testi'nde dolu.
`maturity_*` kolonları yalnızca `form_type = 'hrMaturityReport'` satırlarda
dolu; `maturity_answers` 20 sorunun tek tek cevabı (JSON).

`email_status`:

- `pending` — gönderim sonucu henüz işlenmedi (normalde saniyeler sürer;
  kalıcı olarak `pending` kalan satır Worker'ın yanıt sonrası kesildiğini
  gösterir),
- `sent` — gitti,
- **`failed` — lead geldi ama ekibe/kullanıcıya ULAŞMADI.** Elle takip
  edilmesi gereken tek sınıf bu; `email_error` nedenini taşır.

İlk-giriş kaynağı (2026-10-09, `0002`): `utm_source`/`utm_medium`/`utm_campaign`/
`utm_term`/`utm_content`, `gclid`, `referrer_host` (yalnız alan adı),
`landing_path` (yalnız yol, sorgu dizesi atılır) ve sunucuda hesaplanan
`channel` kodu (`chatgpt`, `google_ads`, `organic_search`, `direct` …).
Önceki satırlarda boştur — kaynak geriye dönük doldurulamaz.

`crm_status`: `NULL` (denenmedi: destek talebi ya da entegrasyon kapalı),
`pending`, `sent`, `failed` (yeniden denenir), `skipped` (CRM kalıcı reddetti,
elle bakılmalı). `crm_lead_id` CRM'deki lead'in UUID'si.

## Kullanım

```bash
# Hepsi (varsayılan: son 5000 kayıt, tarihe göre yeniden eskiye)
node scripts/export-leads.mjs

# Yalnızca İK Olgunluk Testi
node scripts/export-leads.mjs --form-type hrMaturityReport

# Tarih aralığı + hedef dosya
node scripts/export-leads.mjs --since 2026-09-01 --out eylul-leadler.csv

# E-postası gitmeyenler (takip listesi)
node scripts/export-leads.mjs --failed

# Satış CRM'e aktarılamayanlar
node scripts/export-leads.mjs --crm-failed
```

CSV UTF-8 BOM'lu — Excel Türkçe karakterleri doğrudan doğru açar.
Formül enjeksiyonuna karşı `=`/`+`/`-`/`@` ile başlayan hücrelere `'`
öneki eklenir; bu önek Excel ve Google Sheets'te görünmez (bkz. script
içindeki not).

Tek seferlik SQL için:

```bash
npx wrangler d1 execute idenfit-leads --remote \
  --command "SELECT COUNT(*), form_type FROM leads GROUP BY form_type;"
```

Gereksinim: `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` ortam
değişkenleri ya da `wrangler login`.

## KVKK

**IP adresi ve user-agent bilinçli olarak saklanmıyor** — formun kendi
topladığı alanların ötesinde yeni bir kişisel veri kategorisi eklememek
için. Hata durumunda payload'ın kendisi de loglanmaz (yalnızca form türü +
hata mesajı), `api/csp-report.ts`'in query string'i loglamama kararıyla
aynı ilke.

**Açık kalan iki nokta (ürün/hukuk tarafının kararı):**

1. **İK Olgunluk Testi formunda hiç KVKK metni yok** — diğer 5 formun
   hepsinde var (`kvkkNotice`). Veri artık kalıcı olarak saklandığı için
   bu boşluk daha kritik hale geldi.
2. **Saklama süresi / silme politikası tanımlı değil.** Tablo süresiz
   büyür; bir saklama süresi belirlenirse periyodik silme eklenmeli.

## Bilinçli olarak yapılmayanlar

- **Testi bitirip "raporu gönder"e BASMAYANLAR hâlâ kaydedilmiyor.**
  Kişi iletişim bilgisini testin *başında* veriyor, ama `/api/lead`
  isteği yalnızca sondaki butona basılırsa atılıyor. Daha erken bir
  noktada kayıt açmak, o noktada gösterilen bir onay metni olmadığı için
  (yukarıdaki KVKK maddesi) **kasıtlı olarak yapılmadı**.
- **Google Sheets aynası kurulmadı.** Kararlaştırılan sıra: önce D1 (kayıt
  defteri), sonra istenirse Sheet (görünüm) — Sheet'in çalışması lead'in
  kaybolmamasının şartı olmasın diye. Eski kurulumun zaafı tam da buydu.
