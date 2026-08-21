// Destek Talebi (`/destek-talebi/`) sayfasının veri katmanı. Kaynak:
// `reference/wordpress-export/pages.json` — id 16607 (tr, slug
// `destek-talebi`), 16688 (en, slug `support-request`), 23686 (it, slug
// `richiesta-supporto`). NL kaynakta YOK (envanterde C-İKİNCİL kategorisi,
// tr/en/it — bkz. CLAUDE.md).
//
// ACF (`page_title`/`form_description`/`after_form_text`/`page_button_text`/
// `page_button_url`) TR'de kısmen dolu ama form alan etiketleri + KVKK onay
// metni ACF'te YOK — yalnızca Elementor `content.rendered`'da (Form widget
// placeholder'ları + `gdpr-text` paragrafları). Bu yüzden diğer "ACF boş/
// eksik" sayfalarla (Teşekkürler, Online Sunum Talebi) AYNI yöntem
// kullanıldı: elle transkripsiyon, script-tabanlı extraction YOK.
//
// BULUNAN GERÇEK İÇERİK FARKI (2026-07-27, 3 dilin content.rendered'ı
// karşılaştırılarak doğrulandı): TR'nin KVKK onay metni 2 PARAGRAF
// ("...kabul ediyorum." + "Ayrıntılı bilgi için KVKK sayfamızı ziyaret
// edebilirsiniz.", 3. bir KVKK linkiyle) — EN/IT'de yalnızca 1 paragraf
// var, 2. satır YOK. Bu fark olduğu gibi korundu (uydurma 2. satır EN/IT'ye
// eklenmedi).
import { getRelativeLocaleUrl } from 'astro:i18n';
import { getFaqSlug } from './faqContent';
import { getPageModifiedDateById } from './pagesJsonModified';
import type { Locale } from './nav';

// bkz. dosya başı yorumu — pages.json id'leri (tr 16607/en 16688/it 23686).
const SUPPORT_REQUEST_PAGE_IDS: Partial<Record<Locale, number>> = {
  tr: 16607,
  en: 16688,
  it: 23686,
};
import type { SupportKvkkNoticeLabels, SupportRequestFormLabels } from '../components/SupportRequestForm';

export interface SupportRequestContent {
  pageTitle: string;
  /** `form_description` ACF alanı — kısa açıklama, iki cümle. */
  description: string;
  formLabels: Omit<SupportRequestFormLabels, 'kvkkNotice'>;
  kvkkNotice: SupportKvkkNoticeLabels;
  /** Formun altındaki "SSS'yi ziyaret et" bloğu (`after_form_text` +
   * `page_button_text`/`page_button_url` ACF alanları — TR'de ACF'te
   * dolu, EN'de de ACF'te dolu, IT'de ACF boş ama content.rendered'da
   * aynı metin gerçek İtalyanca olarak var). */
  afterFormText: string;
  faqButtonText: string;
}

const SUPPORT_REQUEST_SLUGS: Partial<Record<Locale, string>> = {
  tr: 'destek-talebi',
  en: 'support-request',
  it: 'richiesta-supporto',
};

export function getSupportRequestSlug(locale: Locale): string | undefined {
  return SUPPORT_REQUEST_SLUGS[locale];
}

export function getSupportRequestLocaleUrls(): Partial<Record<Locale, string>> {
  const result: Partial<Record<Locale, string>> = {};
  for (const [locale, slug] of Object.entries(SUPPORT_REQUEST_SLUGS) as [Locale, string][]) {
    result[locale] = getRelativeLocaleUrl(locale, slug);
  }
  // NL'de kaynak sayfa yok — EN'in gerçek URL'ine eşitleniyor (KVKK/Tüketici
  // Hakları/Güvenlik ailesindeki aynı desen, bkz. miscPagesContent.ts).
  if (!result.nl && result.en) result.nl = result.en;
  return result;
}

/** Sayfanın GERÇEK WP `modified` tarihi ("No visible content dates" GEO
 * bulgusu, 2026-08-17). NL'de kaynak sayfa hiç olmadığı için `undefined`. */
export function getSupportRequestModifiedDate(locale: Locale): Date | undefined {
  const id = SUPPORT_REQUEST_PAGE_IDS[locale];
  return id ? getPageModifiedDateById(id) : undefined;
}

const CONTENT: Partial<Record<Locale, SupportRequestContent>> = {
  tr: {
    pageTitle: 'Destek Talebi',
    description:
      'Lütfen destek talebinizi eksiksiz ve detaylı bir şekilde yazın,\nDestek talepleriniz mesai saatleri içerisinde ve e-mail üzerinden cevaplanmaktadır',
    formLabels: {
      name: 'ADINIZ SOYADINIZ',
      phone: 'CEP TELEFONU',
      phoneError: 'Geçerli bir telefon numarası girin (örn. 555 123 45 67)',
      phoneCountryLabel: 'Ülke kodu seç',
      phoneCountrySearchPlaceholder: 'Ülke ara...',
      phoneCountryNoResults: 'Sonuç bulunamadı',
      email: 'E-MAIL',
      company: 'FİRMA ADI',
      message: 'DESTEK TALEBİNİZİ YAZINIZ',
      submit: 'DESTEK TALEP ET',
    },
    kvkkNotice: {
      prefix: '"Destek Talep Et’ butonuna tıklayarak ',
      kvkkLinkText: 'İletişim Web KVKK İbaresi',
      middle: ' ve ',
      termsLinkText: 'Kullanım Koşullarını',
      suffix: ' kabul ediyorum."',
      secondLine: {
        prefix: 'Ayrıntılı bilgi için ',
        kvkkLinkText: 'KVKK',
        suffix: ' sayfamızı ziyaret edebilirsiniz.',
      },
    },
    afterFormText:
      'Destek talebinizle ilgili sorular Sıkça Sorulan Sorular sayfasında yer alabilir.\nSıkça Sorulan Sorular sayfamızı ziyaret edebilirsiniz.',
    faqButtonText: 'Sıkça Sorulan Sorular',
  },
  en: {
    pageTitle: 'Support Request',
    description:
      'Please write your support request completely and in detail.\nSupport requests are answered during working hours via e-mail.',
    formLabels: {
      name: 'YOUR FULL NAME',
      phone: 'MOBILE PHONE',
      phoneError: 'Enter a valid phone number (e.g. 555 123 45 67)',
      phoneCountryLabel: 'Select country code',
      phoneCountrySearchPlaceholder: 'Search country...',
      phoneCountryNoResults: 'No results found',
      email: 'E-MAIL',
      company: 'COMPANY NAME',
      message: 'WRITE YOUR SUPPORT REQUEST',
      submit: 'SUBMIT SUPPORT REQUEST',
    },
    kvkkNotice: {
      prefix: 'By clicking the "Submit Support Request" button, I accept the ',
      kvkkLinkText: 'Contact Web GDPR Statement',
      middle: ' and the ',
      termsLinkText: 'Terms of Use',
      suffix: '.',
      // Kaynakta EN'de 2. satır YOK (TR'den farklı, doğrulandı) —
      // `secondLine` bilinçli olarak tanımlanmadı.
    },
    afterFormText:
      'Questions related to your support request may be available on the Frequently Asked Questions page.\nYou can visit our FAQ page for more details.',
    faqButtonText: 'Frequently Asked Questions',
  },
  it: {
    pageTitle: 'Richiesta di Supporto',
    description:
      'Per favore scrivi la tua richiesta di supporto in modo completo e dettagliato.\nLe richieste di supporto ricevono risposta via e-mail durante l’orario di lavoro.',
    formLabels: {
      name: 'IL TUO NOME COMPLETO',
      phone: 'TELEFONO CELLULARE',
      phoneError: 'Inserisci un numero di telefono valido (es. 555 123 45 67)',
      phoneCountryLabel: 'Seleziona il prefisso',
      phoneCountrySearchPlaceholder: 'Cerca un paese...',
      phoneCountryNoResults: 'Nessun risultato trovato',
      email: 'E-MAIL',
      company: 'NOME AZIENDA',
      message: 'SCRIVI LA TUA RICHIESTA DI SUPPORTO',
      submit: 'INVIA RICHIESTA DI SUPPORTO',
    },
    kvkkNotice: {
      prefix: 'Cliccando sul pulsante "Invia Richiesta di Supporto", accetto l’',
      kvkkLinkText: 'Informativa GDPR Web Contatti',
      middle: ' e le ',
      termsLinkText: 'Condizioni d’Uso',
      suffix: '.',
      // Kaynakta IT'de de 2. satır YOK (EN'le aynı, TR'den farklı).
    },
    afterFormText:
      'Le domande relative alla tua richiesta di supporto potrebbero essere disponibili nella pagina delle Domande Frequenti.\nPuoi visitare la nostra pagina FAQ per maggiori dettagli.',
    faqButtonText: 'Domande Frequenti',
  },
};

export function getSupportRequestContent(locale: Locale): SupportRequestContent | undefined {
  return CONTENT[locale];
}

/** SSS sayfasının gerçek per-locale slug'ı — ham kaynak URL'ine güvenilmez
 * (`faqContent.ts`'teki `getFaqSlug()`, projenin genel CTA çözümleme
 * ilkesiyle tutarlı). NL'de SSS de yok, `getFaqSlug('en')`'e düşülür. */
export function getSupportFaqHref(locale: Locale): string {
  const slug = getFaqSlug(locale) ?? getFaqSlug('en') ?? 'sss';
  return getRelativeLocaleUrl(locale, slug);
}
