// Form bildirim e-postalarının HTML/düz metin şablonu (2026-09-04).
//
// Neden ayrı bir dosya: `src/pages/api/lead.ts` bir API route'u — istek
// doğrulama/hız sınırı/SendGrid çağrısı orada, SUNUM burada. Aynı ayrım
// PDF raporunda da var (`maturityReportTemplate.mjs`), bu onun e-posta
// karşılığı.
//
// **GÜVENLİK — buradaki HER interpolasyon kaçışlanır.** Bu şablona giren
// değerlerin TAMAMI (ad/telefon/firma/mesaj/sayfa URL'i) ziyaretçinin
// yazdığı serbest metin; kaçışlanmazsa e-posta istemcisinde HTML enjekte
// edilebilirdi. `escapeHtml()` ikinci kez YAZILMADI — PDF şablonunun
// (`maturityReportTemplate.mjs`) 2026-09-04 güvenlik turunda kanıtlanmış
// fonksiyonu export edilip burada yeniden kullanılıyor.
import { escapeHtml } from './maturityReportTemplate.mjs';
// Kategori etiketleri de İKİNCİ KEZ YAZILMADI — testin kendi tanım
// dosyasından geliyor. (PDF şablonu bunları kopyalamak ZORUNDA çünkü saf
// .mjs olarak düz Node'dan da çalıştırılıyor ve bir .ts dosyasını import
// edemiyor; bu dosya TypeScript olduğu için o kısıt burada YOK.)
import { MATURITY_CATEGORY_LABELS, type MaturityCategoryKey } from './maturityTestDefinitions';
export { IDENFIT_LOGO_PNG_BASE64 } from './leadEmailLogo';

/**
 * E-posta başlığındaki logonun `Content-ID`'si. Gönderim tarafı (`lead.ts`)
 * PNG'yi bu kimlikle `disposition:"inline"` ekliyor, şablon da
 * `<img src="cid:…">` ile buradan çağırıyor — iki taraf AYNI sabiti
 * paylaşsın diye export edildi (yazım hatası = kırık görsel).
 */
export const IDENFIT_LOGO_CID = 'idenfit-logo';

export type LeadFormType = 'hero' | 'contact' | 'landing' | 'support' | 'presentation' | 'hrMaturityReport';

export interface LeadEmailMaturityResult {
  totalScore: number;
  levelTitle: string;
  levelSubtitle: string;
  categoryScores: Record<string, number>;
  groupScores: Record<string, number>;
}

export interface LeadEmailPayload {
  formType: LeadFormType;
  locale?: string;
  pageUrl?: string;
  fullName?: string;
  phone?: string;
  company?: string;
  email?: string;
  message?: string;
  maturityResult?: LeadEmailMaturityResult;
}

export const FORM_TYPE_TITLES: Record<LeadFormType, string> = {
  hero: 'Ana Sayfa / Panel Formu',
  contact: 'İletişim Formu',
  landing: 'Landing Page (/demo) Formu',
  support: 'Destek Talebi Formu',
  presentation: 'Online Sunum Talebi Formu',
  hrMaturityReport: 'İK Dijital Olgunluk Testi — Rapor Talebi',
};

/** Rozet metni — hangi ekibin işine yaradığını konu satırına bakmadan
 * ayırt edebilmek için (destek talebi bir satış lead'i DEĞİL). */
const FORM_TYPE_BADGES: Record<LeadFormType, string> = {
  hero: 'Yeni Lead',
  contact: 'İletişim Mesajı',
  landing: 'Yeni Lead',
  support: 'Destek Talebi',
  presentation: 'Sunum Talebi',
  hrMaturityReport: 'Test Sonucu',
};

const LOCALE_LABELS: Record<string, string> = {
  tr: 'Türkçe',
  en: 'İngilizce',
  nl: 'Hollandaca',
  it: 'İtalyanca',
  az: 'Azerbaycanca',
};

// Tasarım sistemi (`src/styles/global.css`'in `@theme` token'larıyla AYNI
// hex değerleri — e-posta istemcileri CSS değişkeni/harici stil dosyası
// desteklemediği için satır içi yazılmak zorunda).
const BRAND = '#FF0000';
const BRAND_LIGHT = '#FFF2F2';
const HEADING = '#070707';
const BODY = '#333333';

// ⚠️ Gri tonları sitenin `@theme` token'larından BİLİNÇLİ olarak farklı
// (2026-09-04 düzeltmesi). İlk sürüm sayfa `#F4F4F5` / kart `#FFFFFF` /
// alan kutusu `#FAFAFA` / çerçeve `#ECECEC` kullanıyordu — dört katman
// arasında en fazla 6 puanlık parlaklık farkı vardı ve gerçek gönderimde
// (Outlook) "gri üstüne gri" olarak okundu. Şimdi hiyerarşi ÜÇ net
// kademe: belirgin gri sayfa → saf beyaz kart → hafif dolgulu ama GÖRÜNÜR
// çerçeveli alan kutusu.
const MUTED = '#6E7378'; // meta/alt metin — sitenin #808080'i e-postada soluk kalıyordu
const FOOTER_TEXT = '#8A8F94';
const LABEL = '#6B7280'; // alan etiketleri (11px, büyük harf) — kutu dolgusunda 4.6:1
const SURFACE_ALT = '#F4F6F9';
const BORDER = '#DDE1E7'; // alan kutusu çerçevesi — kutuyu dolgudan bağımsız tanımlıyor
const CARD_BORDER = '#D3D8DF';
const DIVIDER = '#E6E9ED';
const PAGE_BG = '#E7EAEE';

// Quicksand (sitenin fontu) e-posta istemcilerinin ÇOĞUNDA yüklenmez —
// Apple Mail/iOS gibi `<link>`'i onurlandıranlarda marka fontu, geri
// kalanında sistem yığını görünür. Bilinçli bir progressive enhancement.
const FONT = "'Quicksand','Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

/**
 * Türkiye saatiyle `04.09.2026 17:32`.
 *
 * `Intl` KULLANILMIYOR — hem Workers runtime'ında ICU verisi ortama göre
 * değişebiliyor (bkz. CLAUDE.md Açık nokta #54), hem `new Date()` Workers'ta
 * HER ZAMAN UTC. Türkiye 2016'dan beri yaz saati uygulamıyor, sabit
 * +03:00 — bu yüzden elle ofset eklemek deterministik ve doğru.
 */
function formatIstanbul(date: Date): string {
  const t = new Date(date.getTime() + 3 * 60 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(t.getUTCDate())}.${p(t.getUTCMonth() + 1)}.${t.getUTCFullYear()} ${p(t.getUTCHours())}:${p(t.getUTCMinutes())}`;
}

/**
 * `pageUrl` ziyaretçinin POST gövdesinden geliyor — DOĞRUDAN `href`'e
 * konulamaz (`javascript:` şeması XSS'e açık olurdu). Yalnızca gerçek
 * http/https URL'leri linke çevriliyor, geri kalan her şey düz metin
 * olarak (kaçışlanmış) gösteriliyor.
 */
function safeHttpUrl(raw: string | undefined): URL | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url : null;
  } catch {
    return null;
  }
}

/** `tel:` bağlantısı yalnızca telefon numarası GÖRÜNÜMÜNDEKİ değerler için. */
function safeTelHref(phone: string | undefined): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/[\s()\-.]/g, '');
  return /^\+?\d{7,15}$/.test(cleaned) ? cleaned : null;
}

/** Basit e-posta görünümü kontrolü — `mailto:` üretmeden önce. */
function safeMailtoHref(email: string | undefined): string | null {
  if (!email) return null;
  const trimmed = email.trim();
  return /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(trimmed) ? trimmed : null;
}

/**
 * Konu satırı / görünen ad gibi BAŞLIK alanlarına giren serbest metin.
 * Satır sonları temizleniyor (bir e-posta başlığına satır sonu enjekte
 * etmek klasik header-injection vektörü) ve uzunluk sınırlanıyor —
 * gelen kutusunda konu zaten kırpılıyor.
 */
function sanitizeHeader(value: string, maxLength = 60): string {
  const flat = value.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  return flat.length > maxLength ? `${flat.slice(0, maxLength - 1).trimEnd()}…` : flat;
}

/** Etiketli bir alan kutusu. `href` verilirse değer tıklanabilir olur. */
function fieldBlock(label: string, value: string, href?: string | null): string {
  const safeValue = escapeHtml(value);
  const rendered = href
    ? `<a href="${escapeHtml(href)}" style="color:${HEADING};text-decoration:none;border-bottom:1px solid ${BORDER};">${safeValue}</a>`
    : safeValue;
  return `
    <tr>
      <td style="padding:14px 16px;background-color:${SURFACE_ALT};border:1px solid ${BORDER};border-radius:10px;">
        <p style="margin:0 0 5px;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.9px;text-transform:uppercase;color:${LABEL};">${escapeHtml(label)}</p>
        <p style="margin:0;font-family:${FONT};font-size:16px;font-weight:500;line-height:1.5;color:${HEADING};word-break:break-word;">${rendered}</p>
      </td>
    </tr>
    <tr><td style="height:10px;font-size:0;line-height:0;">&nbsp;</td></tr>`;
}

/** Yüzde çubuğu — nested tablo, `div`+CSS yerine (Outlook desteği). */
function scoreBar(label: string, score: number): string {
  const pct = Math.max(0, Math.min(100, Math.round(score)));
  return `
    <tr>
      <td style="padding:0 0 14px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="font-family:${FONT};font-size:13px;font-weight:600;color:${BODY};">${escapeHtml(label)}</td>
            <td align="right" style="font-family:${FONT};font-size:13px;font-weight:700;color:${BRAND};">%${pct}</td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:6px;background-color:#E6E9ED;border-radius:99px;">
          <tr>
            <td style="font-size:0;line-height:0;">
              <table role="presentation" width="${pct}%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND};border-radius:99px;">
                <tr><td style="height:8px;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

/** Dolgulu kırmızı buton — `<a>` + tablo (Outlook'ta `padding`'li `<a>`
 * tıklama alanı olarak çalışmıyor, hücre dolgusu gerekiyor). */
function buttonCell(href: string, label: string, variant: 'solid' | 'outline'): string {
  const solid = variant === 'solid';
  return `
    <td style="padding-right:10px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color:${solid ? BRAND : '#FFFFFF'};border:2px solid ${BRAND};border-radius:999px;">
        <tr>
          <td align="center" style="padding:11px 22px;">
            <a href="${escapeHtml(href)}" style="font-family:${FONT};font-size:14px;font-weight:700;color:${solid ? '#FFFFFF' : BRAND};text-decoration:none;display:inline-block;">${escapeHtml(label)}</a>
          </td>
        </tr>
      </table>
    </td>`;
}

/** Ortak dış kabuk — başlık şeridi, gövde, altbilgi. */
function shell(options: { preheader: string; badge: string; title: string; meta: string; body: string; footer: string }): string {
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>${escapeHtml(options.title)}</title>
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:${PAGE_BG};-webkit-font-smoothing:antialiased;">
<div style="display:none;font-size:1px;color:${PAGE_BG};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(options.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PAGE_BG};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#FFFFFF;border:1px solid ${CARD_BORDER};border-radius:16px;overflow:hidden;">
        <tr><td style="height:5px;background-color:${BRAND};font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr>
          <td style="padding:26px 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="left" style="line-height:0;">
                  <!-- Görselleri engelleyen istemcilerde alt metni görünür; bu yüzden
                       alt niteliği de marka tipografisiyle biçimlendirildi, çıplak/gri
                       bir "idenfit" yazısı yerine logonun yerini tutuyor. -->
                  <img src="cid:${IDENFIT_LOGO_CID}" alt="idenfit" width="96" height="35" style="display:block;border:0;outline:none;text-decoration:none;width:96px;height:35px;font-family:${FONT};font-size:22px;font-weight:700;letter-spacing:-0.5px;color:${HEADING};" />
                </td>
                <td align="right" style="font-family:${FONT};font-size:12px;font-weight:500;color:${MUTED};">${escapeHtml(formatIstanbul(new Date()))}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:22px 32px 0;">
            <span style="display:inline-block;background-color:${BRAND_LIGHT};color:${BRAND};font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px 13px;border-radius:999px;">${escapeHtml(options.badge)}</span>
            <h1 style="margin:14px 0 0;font-family:${FONT};font-size:23px;font-weight:600;line-height:1.3;color:${HEADING};">${escapeHtml(options.title)}</h1>
            <p style="margin:8px 0 0;font-family:${FONT};font-size:13px;font-weight:400;line-height:1.6;color:${MUTED};">${options.meta}</p>
          </td>
        </tr>
        ${options.body}
        <tr>
          <td style="padding:26px 32px 30px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="border-top:1px solid ${DIVIDER};padding-top:16px;font-family:${FONT};font-size:12px;font-weight:400;line-height:1.7;color:${FOOTER_TEXT};">${options.footer}</td></tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/**
 * Ekibe giden bildirim e-postası (6 formun tamamı).
 *
 * Düz metin sürümü KALDIRILMADI — SendGrid'e her iki parça birlikte
 * gönderiliyor (`text/plain` + `text/html`), HTML'i render etmeyen/
 * engelleyen istemcilerde okunabilir hâli görünsün diye.
 */
export function renderLeadNotificationEmail(payload: LeadEmailPayload): { subject: string; text: string; html: string } {
  const title = FORM_TYPE_TITLES[payload.formType];
  const badge = FORM_TYPE_BADGES[payload.formType];
  const localeLabel = payload.locale ? (LOCALE_LABELS[payload.locale] ?? payload.locale) : 'bilinmiyor';
  const pageUrl = safeHttpUrl(payload.pageUrl);
  const mailto = safeMailtoHref(payload.email);
  const tel = safeTelHref(payload.phone);

  // Konu satırı gelen kutusunda TEK BAŞINA anlamlı olmalı — kim/hangi
  // firma olduğu görünsün ki e-postayı açmadan önceliklendirilebilsin.
  const who = sanitizeHeader(payload.company?.trim() || payload.fullName?.trim() || '');
  const subject = who ? `[idenfit.com] ${title} — ${who}` : `[idenfit.com] ${title}`;

  // ---- düz metin ----
  const lines: string[] = [title, '='.repeat(title.length), '', `Site dili: ${localeLabel}`];
  if (pageUrl) lines.push(`Sayfa: ${pageUrl.toString()}`);
  lines.push(`Tarih: ${formatIstanbul(new Date())} (TSİ)`, '');

  if (payload.formType === 'hrMaturityReport' && payload.maturityResult) {
    const result = payload.maturityResult;
    if (payload.company) lines.push(`Firma: ${payload.company}`);
    if (payload.fullName) lines.push(`Ad Soyad: ${payload.fullName}`);
    lines.push(`E-posta: ${payload.email}`, '');
    lines.push(`Toplam skor: ${result.totalScore}/100 — ${result.levelTitle}`, '', 'Kategori bazlı skorlar:');
    for (const [category, score] of Object.entries(result.categoryScores)) {
      const label = MATURITY_CATEGORY_LABELS[category as MaturityCategoryKey] ?? category;
      lines.push(`  - ${label}: %${score}`);
    }
  } else {
    if (payload.fullName) lines.push(`Ad Soyad: ${payload.fullName}`);
    if (payload.phone) lines.push(`Telefon: ${payload.phone}`);
    if (payload.company) lines.push(`Firma: ${payload.company}`);
    if (payload.email) lines.push(`E-posta: ${payload.email}`);
    if (payload.message) lines.push('', `Mesaj:`, payload.message);
  }
  lines.push('', '—', 'Bu e-posta idenfit.com üzerindeki form gönderimiyle otomatik oluşturuldu.');

  // ---- HTML ----
  let fields = '';
  let extra = '';

  if (payload.formType === 'hrMaturityReport' && payload.maturityResult) {
    const result = payload.maturityResult;
    if (payload.company) fields += fieldBlock('Firma', payload.company);
    if (payload.fullName) fields += fieldBlock('Ad Soyad', payload.fullName);
    if (payload.email) fields += fieldBlock('E-posta', payload.email, mailto ? `mailto:${mailto}` : null);

    const bars = Object.entries(result.categoryScores)
      .map(([category, score]) => scoreBar(MATURITY_CATEGORY_LABELS[category as MaturityCategoryKey] ?? category, score))
      .join('');

    extra = `
        <tr>
          <td style="padding:6px 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND_LIGHT};border-radius:12px;">
              <tr>
                <td style="padding:18px 20px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-family:${FONT};font-size:38px;font-weight:700;line-height:1;color:${BRAND};white-space:nowrap;">${escapeHtml(Math.round(result.totalScore))}<span style="font-size:16px;font-weight:600;color:${MUTED};">/100</span></td>
                      <td align="right" style="font-family:${FONT};font-size:15px;font-weight:700;color:${HEADING};">${escapeHtml(result.levelTitle)}<br /><span style="font-size:12px;font-weight:500;color:${MUTED};">${escapeHtml(result.levelSubtitle)}</span></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:22px 32px 0;">
            <p style="margin:0 0 14px;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.9px;text-transform:uppercase;color:${LABEL};">Kategori bazlı skorlar</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${bars}</table>
          </td>
        </tr>`;
  } else {
    if (payload.fullName) fields += fieldBlock('Ad Soyad', payload.fullName);
    if (payload.phone) fields += fieldBlock('Telefon', payload.phone, tel ? `tel:${tel}` : null);
    if (payload.company) fields += fieldBlock('Firma', payload.company);
    if (payload.email) fields += fieldBlock('E-posta', payload.email, mailto ? `mailto:${mailto}` : null);
    if (payload.message) {
      // Mesaj serbest metin — satır sonları korunmalı, ama `<br />`
      // KAÇIŞLAMADAN SONRA ekleniyor (önce eklenseydi kaçışlanıp düz metin
      // olarak görünürdü).
      const safeMessage = escapeHtml(payload.message).replace(/\r?\n/g, '<br />');
      fields += `
    <tr>
      <td style="padding:14px 16px;background-color:${SURFACE_ALT};border:1px solid ${BORDER};border-radius:10px;">
        <p style="margin:0 0 5px;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.9px;text-transform:uppercase;color:${LABEL};">Mesaj</p>
        <p style="margin:0;font-family:${FONT};font-size:15px;font-weight:400;line-height:1.65;color:${BODY};word-break:break-word;">${safeMessage}</p>
      </td>
    </tr>
    <tr><td style="height:10px;font-size:0;line-height:0;">&nbsp;</td></tr>`;
    }
  }

  const buttons = [
    mailto ? buttonCell(`mailto:${mailto}`, 'E-posta gönder', 'solid') : '',
    tel ? buttonCell(`tel:${tel}`, 'Hemen ara', 'outline') : '',
  ].join('');

  const metaParts = [`Site dili: <strong style="color:${BODY};">${escapeHtml(localeLabel)}</strong>`];
  if (pageUrl) {
    // Görünen metin olarak TAM URL yerine yolu gösteriyoruz — hem daha
    // okunaklı, hem SendGrid'in link yeniden yazımı (Click Tracking) düz
    // metindeki URL'i bozarken `<a>`'nın GÖRÜNEN metnine dokunamaz.
    const label = `${pageUrl.pathname}${pageUrl.search}` || '/';
    metaParts.push(`Sayfa: <a href="${escapeHtml(pageUrl.toString())}" style="color:${BRAND};text-decoration:none;font-weight:600;">${escapeHtml(label)}</a>`);
  }

  const html = shell({
    preheader: [who, payload.email, payload.phone].filter(Boolean).join(' · ') || title,
    badge,
    title,
    meta: metaParts.join(' &nbsp;·&nbsp; '),
    body: `
        <tr>
          <td style="padding:24px 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${fields}</table>
          </td>
        </tr>${extra}${
          buttons
            ? `
        <tr>
          <td style="padding:14px 32px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${buttons}</tr></table>
          </td>
        </tr>`
            : ''
        }`,
    footer:
      'Bu e-posta idenfit.com üzerindeki form gönderimiyle otomatik oluşturuldu.' +
      (mailto ? ' <strong>Yanıtla</strong> dediğinizde doğrudan gönderen kişiye ulaşır.' : ''),
  });

  return { subject, text: lines.join('\n'), html };
}

/**
 * Testi dolduran KİŞİYE giden e-posta (PDF eki ile birlikte). Ekip
 * bildiriminden ayrı bir tonu var: bu bir pazarlama teması değil, kişinin
 * kendi istediği raporun teslimi.
 */
export function renderMaturityApplicantEmail(params: {
  fullName?: string;
  totalScore: number;
  levelTitle: string;
  levelSubtitle: string;
}): { subject: string; text: string; html: string } {
  const greeting = params.fullName?.trim() ? `Merhaba ${params.fullName.trim()},` : 'Merhaba,';
  const score = Math.round(params.totalScore);

  const text = [
    greeting,
    '',
    'İK Dijital Olgunluk Testi sonuç raporunuz bu e-postanın ekinde (PDF) yer alıyor.',
    '',
    `Toplam skorunuz: ${score}/100 — ${params.levelTitle}`,
    params.levelSubtitle,
    '',
    'Raporunuzdaki önerileri birlikte değerlendirmek isterseniz ücretsiz bir online sunum planlayabiliriz:',
    'https://idenfit.com/online-sunum-talebi/',
    '',
    '—',
    'idenfit — Önce İnsan',
  ].join('\n');

  const html = shell({
    preheader: `Toplam skorunuz ${score}/100 — ${params.levelTitle}. Raporunuz ekte.`,
    badge: 'Sonuç Raporu',
    title: 'İK Dijital Olgunluk Testi sonucunuz hazır',
    meta: 'Raporunuzun tamamı bu e-postanın ekinde <strong style="color:' + BODY + ';">PDF</strong> olarak yer alıyor.',
    body: `
        <tr>
          <td style="padding:24px 32px 0;">
            <p style="margin:0 0 18px;font-family:${FONT};font-size:15px;font-weight:400;line-height:1.7;color:${BODY};">${escapeHtml(greeting)}</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND_LIGHT};border-radius:12px;">
              <tr>
                <td align="center" style="padding:26px 20px;">
                  <p style="margin:0;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${MUTED};">Toplam skorunuz</p>
                  <p style="margin:8px 0 0;font-family:${FONT};font-size:48px;font-weight:700;line-height:1;color:${BRAND};">${escapeHtml(score)}<span style="font-size:20px;font-weight:600;color:${MUTED};">/100</span></p>
                  <p style="margin:12px 0 0;font-family:${FONT};font-size:17px;font-weight:700;color:${HEADING};">${escapeHtml(params.levelTitle)}</p>
                  <p style="margin:4px 0 0;font-family:${FONT};font-size:13px;font-weight:500;line-height:1.6;color:${MUTED};">${escapeHtml(params.levelSubtitle)}</p>
                </td>
              </tr>
            </table>
            <p style="margin:20px 0 0;font-family:${FONT};font-size:15px;font-weight:400;line-height:1.7;color:${BODY};">Raporunuzdaki önerileri birlikte değerlendirmek isterseniz, ekibimizle ücretsiz bir online sunum planlayabilirsiniz.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${buttonCell('https://idenfit.com/online-sunum-talebi/', 'Online sunum planla', 'solid')}</tr></table>
          </td>
        </tr>`,
    footer: 'Bu e-postayı, idenfit.com üzerindeki İK Dijital Olgunluk Testi’ni tamamlayıp raporunuzu talep ettiğiniz için aldınız.',
  });

  return { subject: 'İK Dijital Olgunluk Testi — Sonuç Raporunuz', text, html };
}
