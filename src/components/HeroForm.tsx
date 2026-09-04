import { useEffect, useState } from 'react';
import PhoneCountrySelect from './PhoneCountrySelect.tsx';
import {
  formatPhoneDigits,
  getDefaultCountryForLocale,
  isValidPhoneForCountry,
  normalizePhoneDigits,
  type CountryPhoneDef,
} from '../data/phoneCountries';
import { buildCtaAnchorText, isGenericCtaText } from '../data/pageTitle';
import type { Locale } from '../data/nav';
import { submitLead } from '../data/formLead';

interface FormData {
  fullName: string;
  /** Yalnızca normalize edilmiş rakamlar — başında `0` YOK, seçili ülkenin
   * azami hanesiyle sınırlı (ülke kodu hariç yerel kısım). Görünen
   * (boşluklu) biçim `formatPhoneDigits()` ile türetilir, state her zaman
   * temiz rakam dizisi olarak tutulur. */
  phone: string;
  company: string;
  email: string;
  /** Yalnızca `showMessage` true olan kullanımlarda (İletişim sayfası,
   * 2026-08-11 KARAR) dolduruluyor — Hero/Presentation formlarında hiç
   * render edilmiyor, her zaman boş kalıyor. */
  message: string;
}

const EMPTY: FormData = { fullName: '', phone: '', company: '', email: '', message: '' };

export interface KvkkNoticeLabels {
  prefix: string;
  kvkkLinkText: string;
  middle: string;
  termsLinkText: string;
  suffix: string;
}

export interface HeroFormLabels {
  name: string;
  phone: string;
  /** Telefon alanı geçersiz/eksikken gösterilen hata metni. */
  phoneError: string;
  /** Ülke kodu seçicinin erişilebilir etiketi + arama kutusu metinleri. */
  phoneCountryLabel: string;
  phoneCountrySearchPlaceholder: string;
  phoneCountryNoResults: string;
  company: string;
  email: string;
  submit: string;
  kvkkNotice: KvkkNoticeLabels;
  /** `showMessage` true'yken zorunlu — İletişim sayfasının "Mesajınız"
   * textarea placeholder'ı. */
  message?: string;
}

export interface HeroFormProps {
  labels: HeroFormLabels;
  /** Aynı sayfada birden fazla form kullanıldığında (ör. ana sayfanın
   * "Kullanıcı Dostu Panel" bölümündeki 2. form) `id` çakışmasını önler
   * (`<label htmlFor>` iki forma da aynı id ile bağlanmasın diye).
   * Verilmezse eski davranış korunur (`hf-*`). */
  idPrefix?: string;
  /** Aktif site dili — telefon ülke kodu seçicinin varsayılan ülkesini
   * belirler (bkz. `getDefaultCountryForLocale()`, 2026-07-27). */
  locale: Locale;
  /** KVKK/GDPR sayfamızın gerçek per-locale URL'i (Astro tarafında
   * `getKvkkSlug()`'tan hesaplanır). */
  kvkkHref: string;
  /** Tüketici Hakları Sözleşmesi (Kullanım Koşulları) sayfamızın gerçek
   * per-locale URL'i. */
  termsHref: string;
  /** Görsel stil varyantı. `'underline'` (varsayılan) Hero/PanelFeatureSection/
   * İletişim'in paylaştığı gerçek kaynak stili (alt çizgili, şeffaf zemin,
   * kırmızı `.btn-cta` butonu — bkz. 2026-07-28 BEŞİNCİ tur notu). `'presentation'`
   * Online Sunum Talebi'nin (`online-sunum-talep-et`, template 15441)
   * element-ID doğrulamalı KENDİ gerçek stili: dolu beyaz/gri-kenarlıklı pill
   * input'lar (`border-color:#DDDDDD; border-radius:30px`), placeholder'lar
   * BÜYÜK HARF (kaynakta placeholder metninin kendisi literal uppercase
   * yazılmış — `text-transform` değil), ve YEŞİL solid buton
   * (`background-color:#289C0F`, ölçülen — Destek Talebi'nin `#60A344`'ünden
   * FARKLI bir yeşil, karıştırılmamalı). */
  variant?: 'underline' | 'presentation';
  /** `true` ise e-posta/firma alanlarının altına bir "Mesajınız" textarea'sı
   * eklenir (2026-08-11, KARAR: İletişim sayfasının gerçek kaynak formunda
   * 5. bir serbest-metin alanı var — `pages.json`'daki `iletisim` ACF
   * grubunda ayrı bir alan olarak YOK, kaynağın form widget'ının kendi
   * built-in alanı, bkz. CLAUDE.md). Yalnızca İletişim sayfası bunu
   * `true` geçiyor — Hero/PanelFeatureSection/Online Sunum Talebi
   * ETKİLENMEDİ, varsayılan `false` ile eski davranış birebir korunuyor. */
  showMessage?: boolean;
  /** `'stacked'` (varsayılan) — Hero/PanelFeatureSection/Online Sunum
   * Talebi'nin bugüne kadarki DAVRANIŞI, her alan tek sütunda alt alta.
   * `'grid'` — İletişim sayfasının gerçek kaynak formu (2026-08-11,
   * element-ID doğrulamalı ölçüldü: `.elementor-form-fields-wrapper{
   * display:flex;flex-wrap:wrap}`, her alan konteynerin ~1/3'ü genişliğinde
   * [3'lü satır, kalan 2 alan bir sonraki satıra taşıyor], `Mesajınız`
   * textarea'sı ise SABİT 1/3 DEĞİL, satırındaki kalan boşluğu dolduruyor
   * [ölçülen: diğerleri 448px, mesaj 709px] — burada `flex-1` ile
   * taklit edildi). Yalnızca İletişim sayfası `'grid'` geçiyor. */
  layout?: 'stacked' | 'grid';
  /** `'default'` (varsayılan) — mevcut `.btn-cta btn-cta-form` (kırmızı) ya
   * da `presentation` varyantının yeşil pill'i (`variant` tarafından
   * belirlenir). `'green'` — İletişim sayfasının GERÇEK submit butonu
   * (2026-08-11, element-ID doğrulamalı ölçüldü, `variant`'tan BAĞIMSIZ —
   * İletişim'in input'ları `'underline'` KALIYOR ama butonu `presentation`
   * pill'inden FARKLI: `background-color:#289C0F` [AYNI yeşil, ölçüldü],
   * `border-radius:6px` [pill DEĞİL], `font-weight:700`, `font-size:15px`,
   * metin literal BÜYÜK HARF ["HEMEN BAŞVUR"] — `labels.submit` normal
   * case kalıyor, `uppercase` CSS ile uygulanıyor, `presentation`
   * varyantının placeholder-uppercase deseniyle AYNI ilke). */
  submitStyle?: 'default' | 'green';
  /** Verilirse, GERÇEK gönderim (`/api/lead` 200 döndü) başarılı olduktan
   * SONRA kullanıcı bu URL'e yönlendirilir (2026-08-11, KARAR; 2026-09-02'de
   * gerçek backend'e bağlandı — artık sahte bir "başarılı" izlenimi değil,
   * gönderim GERÇEKTEN başarılıysa yönlendirir). Verilmezse (Hero/
   * PanelFeatureSection/Online Sunum Talebi) eski davranış (yönlendirme
   * yok) korunuyor. */
  redirectHref?: string;
  /** `true` ise mount olduktan sonra `window.location.search`'teki `email`
   * parametresi okunup e-posta alanına yazılır (2026-08-19, KARAR — ana
   * sayfanın yeni tek-alanlı hero formu, `HeroEmailCaptureForm.astro`, GET
   * metoduyla `?email=...` query string'i taşıyarak buraya yönlendiriyor;
   * kullanıcı e-postayı burada TEKRAR yazmasın diye otomatik dolduruluyor).
   * `output:'static'` build zamanında `window` yok — bu yüzden Astro
   * frontmatter'ında (`Astro.url.searchParams`) DEĞİL, `useEffect` ile
   * yalnızca CLIENT tarafında okunuyor (SSR/hydration uyumsuzluğu
   * olmasın diye, ilk render her zaman boş/EMPTY kalır). Yalnızca
   * `PresentationRequestPage.astro` bu prop'u `true` geçiriyor — diğer
   * kullanımlar (Hero/Contact/Panel) etkilenmiyor. */
  prefillEmailFromQuery?: boolean;
  /** CTA/anchor text optimizasyonu (2026-08-12, kullanıcı talimatıyla) —
   * `labels.submit` jenerik bir metinse (`isGenericCtaText()`, bkz.
   * `pageTitle.ts`) VE bu prop verilmişse, buton metni
   * `buildCtaAnchorText(ctaKeyword, locale)`'a düşülür (ör. TR: "Ücretsiz
   * Demo için Başvur"). **Yalnızca ana sayfanın hero formu**
   * (`HeroSection.astro`, `t.hero.ctaKeyword`) ve "Kullanıcı Dostu Panel"
   * formu (`PanelFeatureSection.astro`, `t.home.panel.title`) bu prop'u
   * geçiyor. İletişim/Online Sunum Talebi'nin butonu BİLİNÇLİ olarak
   * DOKUNULMADI — "{X} için Başvur" kalıbı bir ürün/modül adıyla doğal
   * okunuyor ("Doküman Modülü için Başvur") ama "İletişim"/"Online Sunum
   * Talebi" gibi bu formların KENDİ amacını adlandıran bir kelimeyle
   * zorlanınca ("İletişim için Başvur") doğal bir Türkçe/İngilizce/
   * Hollandaca/İtalyanca ifade üretmiyor — verilmezse (bu iki form)
   * `labels.submit` DEĞİŞMEDEN kalır. */
  ctaKeyword?: string;
  /** Backend hazırlığı (2026-09-02, Açık nokta #2) — `src/pages/api/lead.ts`'e
   * giden gönderimde hangi form olduğunu ayırt eder (idenfit ekibine giden
   * bildirim e-postasının konusunu/gövdesini belirler). `'hero'` (varsayılan)
   * — genel kullanım. `'contact'` — yalnızca İletişim sayfası (`showMessage`
   * ile AYNI anda `true`). */
  formType?: 'hero' | 'contact';
  /** Gönderim SIRASINDA/BAŞARISIZ olunca gösterilen paylaşılan metinler
   * (bkz. `src/data/formLead.ts`, `Translations.common`). */
  common: { formSubmitting: string; formSubmitError: string };
}

// idenfit.com hero başvuru formu. Metinler i18n'den (src/i18n/*.ts) `labels`
// prop'uyla geliyor — component'te dile özel hardcoded string yok.
// Gönderim (2026-09-02, Açık nokta #2) — `src/data/formLead.ts`'in
// `submitLead()`'i üzerinden `src/pages/api/lead.ts`'e POST atılıyor.
// SendGrid anahtarı henüz yoksa endpoint 503 döner, kullanıcı GERÇEK bir
// hata mesajı görür (bkz. `common.formSubmitError`) — sahte bir "başarılı"
// izlenimi verilmez.
export default function HeroForm({
  labels,
  idPrefix = 'hf',
  locale,
  kvkkHref,
  termsHref,
  variant = 'underline',
  showMessage = false,
  layout = 'stacked',
  submitStyle = 'default',
  redirectHref,
  prefillEmailFromQuery = false,
  ctaKeyword,
  formType = 'hero',
  common,
}: HeroFormProps) {
  const isPresentation = variant === 'presentation';
  const isGrid = layout === 'grid';
  const isGreenSubmit = submitStyle === 'green';
  // CTA/anchor text optimizasyonu (2026-08-12) — bkz. `HeroFormProps.ctaKeyword`
  // yorumu.
  const submitLabel = ctaKeyword && isGenericCtaText(labels.submit) ? buildCtaAnchorText(ctaKeyword, locale) : labels.submit;
  const [data, setData] = useState<FormData>(EMPTY);
  // `prefillEmailFromQuery` — bkz. `HeroFormProps` yorumu. `useEffect`
  // (yalnızca CLIENT'ta, mount SONRASI) kullanılıyor ki statik build
  // sırasında (`window` yok) veya hydration'ın ilk render'ında bir
  // uyuşmazlık OLUŞMASIN — ilk boyama her zaman EMPTY, e-posta bir sonraki
  // an dolduruluyor.
  useEffect(() => {
    if (!prefillEmailFromQuery) return;
    const email = new URLSearchParams(window.location.search).get('email');
    if (email) setData((d) => ({ ...d, email }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Ülke kodu — site diline göre makul bir varsayılanla başlıyor (TR→TR,
  // EN→GB, NL→NL, IT→IT, bkz. `getDefaultCountryForLocale()`), kullanıcı
  // dropdown'dan değiştirebilir (2026-07-27, kullanıcı isteği: idenfit.com
  // 4 dilde hizmet verdiği için form yalnızca TR'ye kilitli kalmamalı).
  const [country, setCountry] = useState<CountryPhoneDef>(() => getDefaultCountryForLocale(locale));
  // İlk submit denemesinden ÖNCE telefon hatası gösterilmez (kullanıcı henüz
  // yazarken rahatsız edici olmasın) — yalnızca bir kez submit denenince
  // (geçersizse) devreye girer, kullanıcı düzelttikçe canlı güncellenir.
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const update = (field: 'fullName' | 'company' | 'email') => (e: React.ChangeEvent<HTMLInputElement>) =>
    setData((d) => ({ ...d, [field]: e.target.value }));

  const updateMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setData((d) => ({ ...d, message: e.target.value }));

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((d) => ({ ...d, phone: normalizePhoneDigits(e.target.value, country) }));
  };

  const handleCountryChange = (next: CountryPhoneDef) => {
    setCountry(next);
    // Ülke değişince mevcut rakamlar YENİ ülkenin azami hanesine göre
    // yeniden normalize edilir (ör. daha kısa haneli bir ülkeye geçilirse
    // fazlalık kırpılır) — kullanıcı yeniden yazmak zorunda kalmaz.
    setData((d) => ({ ...d, phone: normalizePhoneDigits(d.phone, next) }));
  };

  const phoneValid = isValidPhoneForCountry(data.phone, country);
  const showPhoneError = attemptedSubmit && !phoneValid;
  // Form backend'i (2026-09-02, Açık nokta #2) — `submitting` çift
  // gönderimi engelliyor (buton devre dışı), `submitError` başarısız
  // denemede gösteriliyor, bir sonraki denemede temizleniyor.
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    if (!phoneValid) return; // eksik/yanlış telefon — gönderme, hata görünür kalır.
    setSubmitError(false);
    setSubmitting(true);
    const result = await submitLead({
      formType,
      locale,
      fullName: data.fullName,
      phone: `+${country.dialCode}${data.phone}`,
      company: data.company,
      email: data.email,
      message: showMessage ? data.message : undefined,
    });
    setSubmitting(false);
    if (!result.ok) {
      setSubmitError(true);
      return;
    }
    // `redirectHref` verilmişse (yalnızca İletişim, 2026-08-11) gerçek
    // gönderim başarılı olduktan SONRA yönlendirilir (bkz. `HeroFormProps`
    // yorumu — akış artık gerçek, sahte bir "başarılı" iması değil).
    if (redirectHref) window.location.href = redirectHref;
  };

  // ⚠️ DÜZELTME (2026-07-28, BEŞİNCİ tur): önceki tur (2026-07-27) hero
  // formunun (`43e32bd`) 2. formun ("Kullanıcı Dostu Panel", `b10b9e1`)
  // "dolgun" (dolu beyaz zemin + tam kenarlık) stiline BİLİNÇLİ olarak
  // geçirilmişti — kullanıcının o turdaki seçimiydi. Bu turda element
  // ID'siyle çapraz doğrulanan (`post-25148.css`,
  // `.elementor-element-43e32bd .elementor-field-group .elementor-field`)
  // KESİN sonuç hero formunun kendi GERÇEK stilinin ALT ÇİZGİLİ (underline)
  // olduğunu doğruladı: `border-width:0px 0px 2px 0px` (yalnızca alt
  // kenarlık), `border-color:#D9D9D9`, arka plan YOK (şeffaf),
  // `font-size:20px;font-weight:500`. Kullanıcının bu turdaki "gerçek
  // siteyle birebir eşitle" talimatı üzerine ESKİ "dolgun" kararı GERİ
  // ALINIP gerçek underline stiline dönüldü. **Bilinçli tek sapma:**
  // kaynağın `.elementor-field{color:#ADADAD}` kuralı hem placeholder HEM
  // yazılan metne uygulanıyor gibi görünüyor (ayrı bir `::placeholder`
  // kuralı YOK) — ama yazılan metni bu kadar soluk göstermek okunabilirliği
  // gerçekten bozar, bu yüzden `#ADADAD` yalnızca placeholder'a uygulandı,
  // yazılan değer normal okunaklı `text-heading` kaldı (kullanılabilirlik
  // önceliği, YoutubeClickToPlay'deki AYNI ilke — kaynağın bozuk/sorunlu
  // bir davranışı birebir kopyalanmaz).
  // ⚠️ DÜZELTME (2026-08-03): font-size sabit 20px'ti — `post-25148.css`'in
  // gerçek responsive breakpoint'leri (>1024px:20px / 768-1024px:18px /
  // ≤767px:14px, element `43e32bd`) element-ID doğrulamalı okunup
  // `text-sm md:text-lg lg:text-xl`'e (14/18/20px) düzeltildi.
  const inputClass = isPresentation
    ? // Online Sunum Talebi (`online-sunum-talep-et`) — post-15441.css'ten
      // element-ID doğrulamalı: dolu beyaz zemin, açık gri kenarlık, pill
      // köşe (30px), placeholder BÜYÜK HARF (kaynakta metnin kendisi
      // literal uppercase — burada paylaşılan i18n string'leri normal-case
      // kaldığından `placeholder:uppercase` ile CSS'te uygulanıyor).
      'w-full rounded-full border border-[#DDDDDD] bg-white px-6 py-3 text-base font-normal text-heading placeholder:text-heading placeholder:uppercase transition-colors focus:border-brand focus:outline-none'
    : 'w-full rounded-none border-0 border-b-2 border-[#D9D9D9] bg-transparent px-0 py-2.5 text-sm md:text-lg lg:text-xl font-medium text-heading placeholder:text-[#ADADAD] transition-colors focus:border-brand focus:outline-none';

  // Form alanları arası boşluk: `presentation` (Online Sunum Talebi,
  // post-15441.css) `space-y-3` (12px) korunuyor — `underline` varyantı
  // 2026-08-03'te element-ID doğrulamalı gerçek değere (`43e32bd`
  // `.elementor-field-group{margin-bottom:10px}`) düzeltildi. `isGrid`
  // durumunda bu boşluk artık FORM'un değil, alanları saran iç wrapper'ın
  // sorumluluğu (bkz. `fieldsWrapperClass`) — form seviyesinde yalnızca
  // wrapper/buton/KVKK metni arası kalır.
  const fieldsWrapperClass = isGrid ? 'flex flex-wrap gap-x-6 gap-y-5' : isPresentation ? 'space-y-3' : 'space-y-2.5';
  const fieldColClass = isGrid ? 'w-full sm:w-[calc(33.333%-1rem)]' : '';
  const messageColClass = isGrid ? 'w-full sm:min-w-[280px] sm:flex-1' : '';

  return (
    <form onSubmit={handleSubmit} className={isGrid ? 'space-y-6' : isPresentation ? 'space-y-3' : 'space-y-2.5'} aria-label={submitLabel}>
    <div className={fieldsWrapperClass}>
      <div className={fieldColClass}>
        <label htmlFor={`${idPrefix}-fullName`} className="sr-only">{labels.name}</label>
        <input
          id={`${idPrefix}-fullName`}
          name="fullName"
          type="text"
          required
          value={data.fullName}
          onChange={update('fullName')}
          placeholder={labels.name}
          className={inputClass}
        />
      </div>
      <div className={fieldColClass}>
        <label htmlFor={`${idPrefix}-phone`} className="sr-only">{labels.phone}</label>
        {/* Ülke kodu seçici — idenfit.com'un HERO formunda (43e32bd) YOK,
            ama aynı sayfadaki 2. formda (b10b9e1, "Kullanıcı Dostu Panel")
            GERÇEKTEN var (Country Code Field for Elementor Form eklentisi,
            varsayılan ülke TR). 2026-07-27: kullanıcı isteğiyle idenfit.com
            4 dilde hizmet verdiği için (TR/EN/NL/IT) TAM interaktif bir
            seçiciye genişletildi — kütüphane KURULMADI (`phoneCountries.ts`
            başındaki gerekçeye bkz.), yerel/basit bir dropdown.
            ⚠️ DÜZELTME (2026-08-03): seçici SOLDAN SAĞA taşındı — solda
            olduğunda telefon input'unun yazısı seçicinin genişliği kadar
            (~70-80px) sağa kayıyordu, diğer 3 alanın (isim/firma/e-posta)
            flush-left metniyle hizasız duruyordu. Artık input İLK render
            ediliyor, seçici SONRA — input'un metni de diğer alanlarla AYNI
            sol kenardan başlıyor, tüm form dikey olarak hizalı. Seçicinin
            kendi iç stili (`PhoneCountrySelect.tsx`: kenarlık artık
            `border-l`, dropdown artık `right-0`'dan açılıyor) buna göre
            güncellendi. */}
        <div
          className={
            isPresentation
              ? `flex items-stretch rounded-full border bg-white transition-colors ${
                  showPhoneError ? 'border-red-500' : 'border-[#DDDDDD] focus-within:border-brand'
                }`
              : `flex items-stretch rounded-none border-0 border-b-2 bg-transparent transition-colors ${
                  showPhoneError ? 'border-red-500' : 'border-[#D9D9D9] focus-within:border-brand'
                }`
          }
        >
          <input
            id={`${idPrefix}-phone`}
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            required
            value={formatPhoneDigits(data.phone, country)}
            onChange={handlePhoneChange}
            placeholder={labels.phone}
            aria-invalid={showPhoneError}
            aria-describedby={showPhoneError ? `${idPrefix}-phone-error` : undefined}
            className={
              isPresentation
                ? 'w-full rounded-full bg-white px-6 py-3 text-base font-normal text-heading placeholder:text-heading placeholder:uppercase focus:outline-none'
                : 'w-full bg-transparent px-0 py-2.5 text-sm md:text-lg lg:text-xl font-medium text-heading placeholder:text-[#ADADAD] focus:outline-none'
            }
          />
          <PhoneCountrySelect
            value={country}
            onChange={handleCountryChange}
            idPrefix={idPrefix}
            hasError={showPhoneError}
            ariaLabel={labels.phoneCountryLabel}
            searchPlaceholder={labels.phoneCountrySearchPlaceholder}
            noResultsText={labels.phoneCountryNoResults}
            locale={locale}
          />
        </div>
        {showPhoneError && (
          <p id={`${idPrefix}-phone-error`} role="alert" className="mt-1 text-xs text-red-600">
            {labels.phoneError}
          </p>
        )}
      </div>
      {/* Alan sırası: Hero/PanelFeatureSection/İletişim'de (kaynağın kendi
          gerçek sırası) isim→telefon→FİRMA→e-posta. Online Sunum Talebi
          (`online-sunum-talep-et`, template 15441) ham HTML'i BAŞKA bir sıra
          kullanıyor — isim→telefon→E-POSTA→firma (`form_fields[email]`
          `form_fields[company_name]`'den ÖNCE geliyor) — bu yüzden
          `presentation` varyantında ikisi yer değiştiriyor, diğer
          kullanımlar etkilenmiyor. */}
      {isPresentation ? (
        <>
          <div className={fieldColClass}>
            <label htmlFor={`${idPrefix}-email`} className="sr-only">{labels.email}</label>
            <input
              id={`${idPrefix}-email`}
              name="email"
              type="email"
              required
              value={data.email}
              onChange={update('email')}
              placeholder={labels.email}
              className={inputClass}
            />
          </div>
          <div className={fieldColClass}>
            <label htmlFor={`${idPrefix}-company`} className="sr-only">{labels.company}</label>
            <input
              id={`${idPrefix}-company`}
              name="company"
              type="text"
              required
              value={data.company}
              onChange={update('company')}
              placeholder={labels.company}
              className={inputClass}
            />
          </div>
        </>
      ) : (
        <>
          <div className={fieldColClass}>
            <label htmlFor={`${idPrefix}-company`} className="sr-only">{labels.company}</label>
            <input
              id={`${idPrefix}-company`}
              name="company"
              type="text"
              required
              value={data.company}
              onChange={update('company')}
              placeholder={labels.company}
              className={inputClass}
            />
          </div>
          <div className={fieldColClass}>
            <label htmlFor={`${idPrefix}-email`} className="sr-only">{labels.email}</label>
            <input
              id={`${idPrefix}-email`}
              name="email"
              type="email"
              required
              value={data.email}
              onChange={update('email')}
              placeholder={labels.email}
              className={inputClass}
            />
          </div>
        </>
      )}

      {showMessage && labels.message && (
        <div className={messageColClass}>
          <label htmlFor={`${idPrefix}-message`} className="sr-only">{labels.message}</label>
          <textarea
            id={`${idPrefix}-message`}
            name="message"
            rows={3}
            value={data.message}
            onChange={updateMessage}
            placeholder={labels.message}
            className={`${inputClass} resize-none`}
          />
        </div>
      )}
    </div>

      <button
        type="submit"
        disabled={submitting}
        className={
          (isGreenSubmit
            ? // İletişim sayfasının GERÇEK submit butonu (bkz. `HeroFormProps.submitStyle`
              // yorumu) — AYNI #289C0F yeşili ama `presentation`'ın pill'inden
              // FARKLI: 6px radius, 700 kalınlık, 15px, literal büyük harf.
              'w-full rounded-md bg-[#289C0F] px-6 py-3 text-[15px] font-bold uppercase text-white transition-opacity hover:opacity-90'
            : isPresentation
              ? // Ölçülen gerçek renk: #289C0F — Destek Talebi'nin (`SupportRequestForm.tsx`)
                // #60A344'ünden FARKLI bir yeşil, birbirine karıştırılmamalı.
                'w-full rounded-full bg-[#289C0F] px-6 py-3 text-base font-normal text-white transition-opacity hover:opacity-90'
              : // `.btn-cta-form` renk/kenarlık/köşeyi `.btn-cta`'dan miras alıp
                // yalnızca font-size/weight'i bu widget'ın ölçülen gerçek
                // değerine (16/18/21px, 500) override ediyor — bkz. global.css.
                'btn-cta btn-cta-form w-full px-6 py-3') + (submitting ? ' cursor-not-allowed opacity-70' : '')
        }
      >
        {submitting ? common.formSubmitting : submitLabel}
      </button>

      {/* Form backend'i (2026-09-02) — gönderim başarısız olunca (bkz.
          `handleSubmit`) gerçek bir hata mesajı gösterilir, sahte bir
          "başarılı" izlenimi VERİLMEZ. */}
      {submitError && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {common.formSubmitError}
        </p>
      )}

      <p className="text-xs leading-relaxed text-muted">
        {labels.kvkkNotice.prefix}
        <a href={kvkkHref} target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-brand">
          {labels.kvkkNotice.kvkkLinkText}
        </a>
        {labels.kvkkNotice.middle}
        <a href={termsHref} target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-brand">
          {labels.kvkkNotice.termsLinkText}
        </a>
        {labels.kvkkNotice.suffix}
      </p>
    </form>
  );
}
