-- İlk-giriş kaynağı + Satış CRM aktarım durumu (2026-10-09).
--
-- KAYNAK (attribution): ziyaretçinin siteye bu sekmede ilk nereden geldiği.
-- Tarayıcıda sessionStorage'da tutulup yalnız form gönderilince gelir; sunucu
-- temizler ve kanalı (`channel`) kendisi hesaplar. Ayrıntı:
-- `src/data/leadAttribution.ts`. Tam referrer adresi DEĞİL yalnız alan adı,
-- ilk sayfanın da yalnız yolu saklanır (sorgu dizesi kişisel veri taşıyabilir).
--
-- CRM AKTARIMI: sales@'e giden formların lead'i idenfit-api'ye
-- (`POST /api/v1/integrations/website/leads`) arka planda iletilir.
-- `crm_status`: NULL = denenmedi (form türü kapsam dışı ya da entegrasyon
-- yapılandırılmamış) | 'pending' | 'sent' | 'failed' | 'skipped' (CRM kalıcı
-- olarak reddetti, yeniden denenmez). Ayrıntı: `src/data/crmLeadSync.ts`.
--
-- SIRA BAĞIMSIZ: kod bu kolonlara ayrı UPDATE'lerle yazar (INSERT değişmedi);
-- migration uygulanmadan kod canlıya çıkarsa UPDATE'ler sessizce düşer, lead
-- kaydı ETKİLENMEZ. Yine de önce bu dosya uygulanmalı:
--   npx wrangler d1 migrations apply idenfit-leads --remote

ALTER TABLE leads ADD COLUMN utm_source TEXT;
ALTER TABLE leads ADD COLUMN utm_medium TEXT;
ALTER TABLE leads ADD COLUMN utm_campaign TEXT;
ALTER TABLE leads ADD COLUMN utm_term TEXT;
ALTER TABLE leads ADD COLUMN utm_content TEXT;
ALTER TABLE leads ADD COLUMN gclid TEXT;
ALTER TABLE leads ADD COLUMN referrer_host TEXT;
ALTER TABLE leads ADD COLUMN landing_path TEXT;
-- `deriveLeadChannel()` kodu (chatgpt, google_ads, organic_search, direct ...)
ALTER TABLE leads ADD COLUMN channel TEXT;

ALTER TABLE leads ADD COLUMN crm_status TEXT;
-- idenfit-api'deki crm_lead.id (UUID)
ALTER TABLE leads ADD COLUMN crm_lead_id TEXT;
ALTER TABLE leads ADD COLUMN crm_error TEXT;
ALTER TABLE leads ADD COLUMN crm_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN crm_last_attempt_at TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_channel ON leads (channel, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_crm_status ON leads (crm_status, crm_last_attempt_at);
