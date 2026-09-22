-- Form lead'lerinin KALICI kaydı (2026-09-22, Açık nokta #2'nin devamı).
--
-- NEDEN: `/api/lead` bugüne kadar HİÇBİR yere yazmıyordu — yalnızca
-- SendGrid'e e-posta atıyordu. E-posta bir kayıt defteri DEĞİL: gönderim
-- başarısız olursa (SendGrid arızası, anahtar eksikliği, İK Olgunluk
-- Testi akışında PDF üretiminin çökmesi) lead GERİ DÖNÜLEMEZ şekilde
-- kayboluyordu. Eski WordPress sitesinde bu veriyi toplayan Google Sheet
-- bağlantısı da Astro'ya geçişte koptu.
--
-- KAPSAM: tek tablo, `/api/lead`'in TAMAMI (6 form türü) — yalnızca İK
-- Olgunluk Testi değil. Endpoint zaten paylaşımlı, ayrıştırma
-- `form_type` kolonuyla yapılıyor.
--
-- KVKK NOTU: IP adresi ve user-agent BİLİNÇLİ OLARAK saklanmıyor —
-- formun kendi topladığı alanların ötesinde yeni kişisel veri kategorisi
-- eklememek için. Saklama süresi/silme politikası ürün tarafının kararı.

CREATE TABLE IF NOT EXISTS leads (
  id                       INTEGER PRIMARY KEY AUTOINCREMENT,
  -- ISO 8601, her zaman UTC ("Z" damgalı). Workers runtime'ı (workerd)
  -- her zaman UTC — bkz. CLAUDE.md'nin naive-tarih GOTCHA maddesi.
  created_at               TEXT    NOT NULL,
  form_type                TEXT    NOT NULL,
  locale                   TEXT,
  page_url                 TEXT,

  full_name                TEXT,
  email                    TEXT    NOT NULL,
  phone                    TEXT,
  company                  TEXT,
  -- Yalnızca İK Olgunluk Testi'nin kendi formu topluyor (diğer 5 formda NULL).
  employee_count           TEXT,
  sector                   TEXT,
  message                  TEXT,

  -- form_type = 'hrMaturityReport' dışında hepsi NULL.
  maturity_total_score     INTEGER,
  maturity_level_title     TEXT,
  maturity_category_scores TEXT,  -- JSON: { kategori: 0-100 }
  maturity_group_scores    TEXT,  -- JSON: { grup: ham skor }
  maturity_answers         TEXT,  -- JSON: { soruNo: 'evet'|'kısmen'|'hayır' }

  -- E-posta gönderiminin SONUCU. Kayıt e-postadan ÖNCE atıldığı için
  -- 'pending' ile başlar; gönderim bitince güncellenir. 'failed' satırlar
  -- "lead geldi ama ekibe/kullanıcıya ulaşmadı" demektir — elle takip
  -- edilmesi gereken tek sınıf budur.
  email_status             TEXT    NOT NULL DEFAULT 'pending',
  email_error              TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_form_type  ON leads (form_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email      ON leads (email);
-- Takip edilmesi gereken başarısız gönderimleri ucuza bulmak için.
CREATE INDEX IF NOT EXISTS idx_leads_email_status ON leads (email_status, created_at DESC);
