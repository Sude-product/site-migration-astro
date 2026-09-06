// Mega-menü içerik şeması — idenfit.com'un canlı header'ından çıkarıldı.
//
// KAYNAK NOTU (dürüstlük için önemli):
// - ÜRÜNLER: idenfit.com'da GERÇEK 6-kolonlu mega-menü (#mega-menu container).
//   İkonlar, kategori başlıkları, link metinleri ve promosyon banner'ı
//   (görsel hariç) birebir kaynaktan çıkarıldı.
// - SEKTÖRLER ve KURUMSAL: idenfit.com'da bunlar TEK KOLONLU basit dropdown'lar
//   (ikon yok, promosyon yok). Gerçek yapıyla eşleşecek şekilde sade tutuldu.
// - KEŞFET: idenfit.com/online-sunum-talep-et/ sayfasındaki #explore-menu'den
//   ikinci kez, daha derinlemesine çıkarıldı (bkz. aşağıdaki 3 kolon).
//   Podcastler öğesi menüden TAMAMEN KALDIRILDI (2026-07-24) — kaynak
//   sitede aktif bir hedefi (href) hiç bulunamamıştı, önceden "yakında"
//   notuyla düz metin olarak bırakılmıştı ama kullanıcı kararıyla soluk/
//   tıklanamaz bir öğe göstermek yerine hiç gösterilmemesi tercih edildi.
//   İçeriği hazır olursa gelecekte geri eklenebilir.
// - NEDEN IDENFIT, FİYATLAR, MÜŞTERİLER: idenfit.com'da bunların dropdown'u
//   YOK — düz link. Burada da mega-menü tanımlanmadı (fabrikasyon yapılmadı).
//
// i18n NOTU: Bu dosya yalnızca YAPIYI tutar (href/icon/layout/görsel URL'leri).
// Görünen METİNLER (başlıklar, link isimleri, promo, rapor kartları) burada
// hardcoded DEĞİL — `src/i18n/*.ts`'in `mega` şemasından `buildMegaMenus()`
// ile enjekte edilir (bkz. `src/components/Header.astro`'daki çağrı).

import type { Translations } from '../i18n';
import type { Locale } from './nav';
import { getSectorSlug } from './sectorContent';
import { getProductSlug } from './productContent';
import { getHardwareSlug } from './hardwareContent';
import { getHubSlug } from './hubContent';
import { getFaqSlug } from './faqContent';
import { getContactSlug, getGlobalBrandSlug, getAboutSlug } from './miscPagesContent';
// KURUMSAL promo kartının görseli — kaynak sitede YOK, kullanıcının kendi
// sağladığı görsel. **2026-09-02: değiştirildi** — eski "takım fotoğrafı"
// (`kurumsal-promo-team.webp`, 2026-07-27) kullanıcının paylaştığı yeni bir
// mockup'a (`kurumsalpanel.png`) göre güvenlik/dijital-çözüm temalı bir
// illüstrasyona geçirildi. Kaynak PNG'nin sol kenarında yarım kalmış bir
// dekoratif şekil parçası vardı (muhtemelen daha büyük bir kompozisyondan
// kırpılmış) — `sharp` ile o dilim kesilip (`extract`, 32px'ten başlayarak)
// temiz bir sol kenar elde edildi, sonra webp'e (q90, ~15 KB) dönüştürüldü.
// Proje genelindeki hotlink edilmiş görsellerden FARKLI olarak yerel bir
// asset, bu yüzden `astro:assets`/Vite'ın import pipeline'ından geçiyor.
import kurumsalPromoImage from '../assets/kurumsal-promo-security.webp';

/**
 * Sektör slug + i18n anahtar eşlemesi — tek kaynak. `buildMegaMenus()` (mega-menü
 * dropdown'u) VE sektör placeholder sayfalarını üreten `getStaticPaths()`
 * (bkz. `src/pages/[sectorSlug].astro` ve locale eşdeğerleri) burayı kullanır,
 * iki yerde ayrı ayrı slug listesi tutulmaz.
 */
export const SECTOR_ITEMS: {
  slug: string;
  labelKey: keyof Translations['mega']['sektorler'];
  icon: LucideIconName;
}[] = [
  { slug: 'gida-sektoru-ik-cozumleri', labelKey: 'food', icon: 'Utensils' },
  { slug: 'hizmet-sektoru-ik-cozumleri', labelKey: 'services', icon: 'Briefcase' },
  { slug: 'turizm-sektoru-ik-cozumleri', labelKey: 'tourism', icon: 'Plane' },
  { slug: 'perakende-sektoru-ik-cozumleri', labelKey: 'retail', icon: 'ShoppingBag' },
  { slug: 'enerji-sektoru-ik-cozumleri', labelKey: 'energy', icon: 'Zap' },
  { slug: 'saglik-sektoru-ik-cozumleri', labelKey: 'healthcare', icon: 'Heart' },
  { slug: 'egitim-sektoru-ik-cozumleri', labelKey: 'education', icon: 'GraduationCap' },
  { slug: 'guvenlik-sektoru-ik-cozumleri', labelKey: 'security', icon: 'Shield' },
  { slug: 'tesis-yonetimi-ik-cozumleri', labelKey: 'facilityManagement', icon: 'Building' },
  { slug: 'sanayi-otomotiv-ik-cozumleri', labelKey: 'industryAutomotive', icon: 'Factory' },
  { slug: 'hukuk-danismanlik-burolari-ik-cozumleri', labelKey: 'legalConsulting', icon: 'Scale' },
  { slug: 'dagitim-lojistik-ik-cozumleri', labelKey: 'logisticsDistribution', icon: 'Truck' },
];

export type IdenfitIconName = 'user' | 'clock' | 'award' | 'plug';
export type LucideIconName =
  | 'Newspaper'
  | 'ClipboardCheck'
  | 'Calculator'
  | 'FileDown'
  | 'Utensils'
  | 'Briefcase'
  | 'Plane'
  | 'ShoppingBag'
  | 'Zap'
  | 'Heart'
  | 'GraduationCap'
  | 'Shield'
  | 'Building'
  | 'Factory'
  | 'Scale'
  | 'Truck';
/** KEŞFET → Hesaplamalar kolonunun 8 linki — idenfit.com'un canlı
 * `/online-sunum-talep-et/` sayfasındaki gerçek icon-list widget'ından
 * (`elementor-element-1eaf004`) birebir çıkarılan, her biri KENDİ imza
 * rengini taşıyan 8 ayrı ikon (bkz. `CalculatorIcons.tsx`). */
/** KEŞFET → İçerikler kolonunun 2 öğe ikonu — idenfit.com'un canlı
 * `/online-sunum-talep-et/` sayfasındaki gerçek #explore-menu HTML'inden
 * birebir çıkarıldı (bkz. `ExploreIcons.tsx`). */
export type ExploreIconName = 'blog' | 'digitalMaturityTest';
export type CalculatorIconName =
  | 'overtimePay'
  | 'incomeTax'
  | 'employerCost'
  | 'severancePay'
  | 'salaryRaise'
  | 'corporateTax'
  | 'mealAllowance'
  | 'noticePeriod';

export type MegaMenuIcon =
  | { source: 'idenfit'; name: IdenfitIconName }
  | { source: 'lucide'; name: LucideIconName }
  | { source: 'calc'; name: CalculatorIconName }
  | { source: 'explore'; name: ExploreIconName };

export interface MegaMenuLink {
  label: string;
  /** Site-local slug (dil öneki hariç) veya PDF gibi tam dış URL. */
  href: string;
  /** true ise `href` mutlak bir dış URL'dir (locale prefix uygulanmaz). */
  external?: boolean;
  /** Link-seviyesi ikon (ör. SEKTÖRLER'de her sektörün kendi ikonu). */
  icon?: MegaMenuIcon;
  /** true ise bu link kolonun "Genel Bakış" (hub sayfası) linkidir —
   * `MegaMenu.tsx` bunu listenin en üstünde, altında bir ayraçla ve daha
   * kalın font'la, diğer modül linklerinden görsel olarak ayırır (bkz.
   * `insan-kaynaklari-yonetimi-modulu`/`insan-kaynaklari-isgucu-yonetimi`). */
  overview?: boolean;
  /** Yalnızca `linkIconStyle:'content-card'` kolonlarında (KEŞFET →
   * İçerikler) kullanılır — büyük dairesel rozet ikonun altında kısa bir
   * açıklama cümlesi (bkz. `LinksColumn.linkIconStyle` yorumu). */
  description?: string;
}

/** Sade link listesi kolonu (ör. ÜRÜNLER kategorileri, SEKTÖRLER, KURUMSAL). */
export interface LinksColumn {
  type: 'links';
  title: string;
  icon?: MegaMenuIcon;
  links: MegaMenuLink[];
  /** Uzun listeler için (ör. SEKTÖRLER, 12 öğe) çok kolonlu grid. Varsayılan: 'list'. */
  layout?: 'list' | 'grid-2' | 'grid-3';
  /** Link-seviyesi ikonların render stili (2026-07-28). Varsayılan `'badge'`
   * — SEKTÖRLER'in dolu kırmızı daire + beyaz ikon rozeti (ÜRÜNLER'in ikon
   * kutularıyla tutarlı görsel dil). `'inline'` — KEŞFET → Hesaplamalar
   * için: kaynakta bu liste rozetsiz, küçük (16px), ÇOK RENKLİ çizgi
   * ikonlar kullanıyor (her aracın kendi imza rengi, bkz. `CalculatorIcons.tsx`
   * yorumu) — rozet zorlanırsa kaynaktan sapmış olurdu, bu yüzden ayrı bir
   * stil eklendi. `'content-card'` (2026-07-30) — KEŞFET → İçerikler için:
   * kaynağın `/online-sunum-talep-et/` sayfasındaki gerçek #explore-menu
   * HTML'inde her öğe büyük (52px) dairesel rozet + başlık + kısa açıklama
   * cümlesinden oluşuyor (bkz. `MegaMenu.tsx`'teki `Column` render'ı ve
   * `MegaMenuLink.description`). */
  linkIconStyle?: 'badge' | 'inline' | 'content-card';
}

/** Tek bir "gör tümü" linki + altında düz metin alt-öğe listesi (ör. Hesaplamalar). */
export interface SublistColumn {
  type: 'sublist';
  title: string;
  icon?: MegaMenuIcon;
  href: string;
  external?: boolean;
  items: string[];
}

export interface ReportCard {
  /** Üstteki kategori etiketi (ör. "İK Trendleri"). */
  category: string;
  title: string;
  /** Yalnızca KURUMSAL'ın promo kartında kullanılır (2026-09-02) — Raporlar
   * kartlarında yok, gerçek görsel alan yok. */
  description?: string;
  image: string;
  imageAlt: string;
  href: string;
  external?: boolean;
}

/** Yatay kaydırmalı görsel kart listesi (ör. Raporlar). */
export interface CardsColumn {
  type: 'cards';
  title: string;
  icon?: MegaMenuIcon;
  cards: ReportCard[];
  /** "Sonraki raporlar"/"Önceki raporlar" ok butonlarının aria-label'ı. */
  nextAriaLabel: string;
  prevAriaLabel: string;
}

export type MegaMenuColumn = LinksColumn | SublistColumn | CardsColumn;

export interface MegaMenuIntro {
  title: string;
  description: string;
  linkLabel?: string;
  linkHref?: string;
}

export interface MegaMenuPromo {
  /** "LATER IS NEVER" gibi çok satırlı başlık. */
  titleLines: string[];
  description: string;
  ctaText: string;
  ctaHref: string;
  /** Promo panelinin görseli — kaynakta aynı `#mega-menu` header template'i
   * içinde, "LATER IS NEVER" bloğunun hemen üstünde bulundu (bkz. yukarıdaki
   * `promo` tanımı). */
  image: string;
  imageAlt: string;
}

export interface MegaMenuContent {
  intro?: MegaMenuIntro;
  columns: MegaMenuColumn[];
  promo?: MegaMenuPromo;
  /** Sağ tarafta gösterilen küçük promo kart (görsel + kategori etiketi +
   * başlık + link) — `ReportCard`'la (Raporlar kartları) AYNI şekli
   * kullanır, kaynakta yok, KURUMSAL menüsü için kullanıcı talimatıyla
   * eklendi (bkz. `buildMegaMenus()`'teki `kurumsal.promoCard`). `promo`
   * (ÜRÜNLER'in büyük "LATER IS NEVER" paneli) ile FARKLI/bağımsız bir alan. */
  promoCard?: ReportCard;
}

/**
 * slug -> mega-menü içeriği. Aktif dilin çeviri sözlüğü (`t.mega`) ve aktif
 * `locale` verilerek çağrılır; hrefs/icon/layout gibi yapısal alanlar burada
 * sabit, metinler `mega`'dan gelir. Yalnızca gerçekten dropdown'u olan
 * öğeler burada. `locale` parametresi SEKTÖRLER linklerinin gerçek
 * per-locale slug'larını çözmek için gerekli — bkz. `sectorContent.ts`
 * ve CLAUDE.md "Sektör sayfaları — DÜZELTME" (EN/NL/IT slug'ları TR'den
 * tamamen farklı, tek canonical slug varsayımı burada geçerli değil).
 */
export function buildMegaMenus(mega: Translations['mega'], locale: Locale): Record<string, MegaMenuContent> {
  // ÜRÜNLER kolonlarındaki link'ler artık `productContent.ts`'teki gerçek
  // per-locale slug'lara çözülüyor (SEKTÖRLER'deki `getSectorSlug` düzeltmesiyle
  // aynı desen) — `trSlug` her zaman `products.json`'ın grup anahtarı (bazı
  // modüllerde WP'nin ham `slug` alanından türediği için gerçek route slug'ıyla
  // birebir aynı DEĞİL, ör. Özlük Dosyası: trSlug `calisan-ozluk-yonetimi-modulu-2`,
  // gerçek TR route slug'ı `calisan-ozluk-yonetimi-modulu` — bkz. CLAUDE.md).
  // `fallback` yalnızca savunmacı: slug indekste bulunamazsa (olmamalı, 20
  // modülün 20'si de kurulu) eski hardcoded TR slug'a düşer.
  const productHref = (trSlug: string, fallback: string) => getProductSlug(trSlug, locale) ?? fallback;

  // Donanım sayfası TEK bir sayfa (5 ayrı modül DEĞİL) — farklı teknoloji
  // türleri (Biyometrik, RFID, Turnikeler, Onaylı Markalar) o sayfanın
  // içinde birer anchor id'li bölüm (bkz. `hardwareContent.ts`,
  // `scripts/extract-hardware.mjs`). Anchor'lar zaten kaynak sitedeki
  // bölümlerle isabetli eşleşiyordu (ör. "RFID Cihazlar" → `#rfid`) — o
  // yüzden her link kendi bölümüne derin-link veriyor (kullanıcıyı sayfanın
  // başına atıp gezinmeye bırakmak yerine), yalnızca temel slug artık
  // gerçek per-locale slug'a (`hardware` EN/NL/IT'de, `donanim` TR'de) çözülüyor.
  const hardwareHref = (anchor?: string) => {
    const base = getHardwareSlug(locale) ?? 'donanim';
    return anchor ? `${base}#${anchor}` : base;
  };

  // İK hub sayfaları (`insan-kaynaklari-yonetimi-modulu`,
  // `insan-kaynaklari-isgucu-yonetimi`) NL'de kaynakta hiç yok (KARAR 2 —
  // atlandı, bkz. hubContent.ts). NL için EN'in slug'ına düşülür — bu,
  // `astro.config.mjs`'teki `i18n.fallback: { nl: 'en' }` mekanizmasıyla
  // aynı slug üzerinden otomatik `/nl/<slug>/` → `/en/<slug>/` statik
  // redirect'ini tetikler (bkz. CLAUDE.md "NL içerik fallback'i") — NL
  // ziyaretçisi kırık bir linke değil, sessizce EN sayfasına yönlenir.
  const hubHref = (trSlug: string) => getHubSlug(trSlug, locale) ?? getHubSlug(trSlug, 'en') ?? trSlug;

  // SSS sayfası da hub'larla aynı sınıf: NL'de kaynakta hiç yok, EN'in
  // slug'ına ('faq') düşülüyor ki `i18n.fallback` otomatik redirect'i
  // tetiklensin (bkz. `faqContent.ts`, `src/pages/sss.astro`). AZ'de de
  // kaynakta hiç yok, AMA az'ın `astro.config.mjs`teki `i18n.fallback`
  // hedefi NL'inki (`en`) gibi DEĞİL, `tr` — bu yüzden EN'in slug'ına
  // ('faq') düşmek YANLIŞ statik hedef üretiyordu: `/az/faq/` için
  // fallback stub'ı TR'nin GERÇEK slug'ı olan `sss`'i değil, var olmayan
  // bare `faq`'ı arıyor, hiçbir stub üretilmiyor → tüm az sayfalarındaki
  // mega-menü SSS linki kırıktı (audit-analyze.mjs ile bulundu, 2026-08-21).
  // Düzeltme: az için TR'nin slug'ına düşülüyor (fallback hedefiyle tutarlı).
  const faqHref = () => getFaqSlug(locale) ?? getFaqSlug(locale === 'az' ? 'tr' : 'en') ?? 'sss';

  // İletişim ve Hedef Global Marka NL'de de GERÇEK içerikle var (bkz.
  // miscPagesContent.ts — İletişim'in NL slug'ı `mededelingen`, WP'nin
  // kendi yanlış/kafa karıştırıcı isimlendirmesi, ama içerik gerçek) —
  // EN fallback'ine gerek yok, doğrudan çözülüyor.
  const contactHref = () => getContactSlug(locale) ?? 'iletisim';
  const globalBrandHref = () => getGlobalBrandSlug(locale) ?? 'hedef-global-marka';
  const aboutHref = () => getAboutSlug(locale) ?? 'hakkimizda';

  return {
    urunler: {
      intro: {
        title: mega.urunler.intro.title,
        description: mega.urunler.intro.description,
        linkLabel: mega.urunler.intro.faqLink,
        linkHref: faqHref(),
      },
      columns: [
        {
          type: 'links',
          title: mega.urunler.employeeManagement.title,
          icon: { source: 'idenfit', name: 'user' },
          links: [
            {
              label: mega.urunler.employeeManagement.overview,
              href: hubHref('insan-kaynaklari-yonetimi-modulu'),
              overview: true,
            },
            {
              label: mega.urunler.employeeManagement.personalFile,
              href: productHref('calisan-ozluk-yonetimi-modulu-2', 'calisan-ozluk-yonetimi-modulu'),
            },
            {
              label: mega.urunler.employeeManagement.corporateCalendar,
              href: productHref('kurumsal-takvim-modulu', 'kurumsal-takvim-modulu'),
            },
            {
              label: mega.urunler.employeeManagement.documents,
              href: productHref('dokuman-yonetim-sistemi-modulu', 'dokuman-yonetim-sistemi-modulu'),
            },
            {
              label: mega.urunler.employeeManagement.expenseManagement,
              href: productHref('masraf-yonetimi-modulu', 'masraf-yonetimi-modulu'),
            },
            {
              label: mega.urunler.employeeManagement.training,
              href: productHref('calisan-egitim-yonetimi-modulu', 'calisan-egitim-yonetimi-modulu'),
            },
            {
              label: mega.urunler.employeeManagement.assetManagement,
              href: productHref('zimmet-yonetimi-modulu', 'zimmet-yonetimi-modulu'),
            },
            {
              label: mega.urunler.employeeManagement.messages,
              href: productHref('ofis-ici-mesajlasma-modulu', 'ofis-ici-mesajlasma-modulu'),
            },
            {
              label: mega.urunler.employeeManagement.notes,
              href: productHref('notlar-modulu', 'notlar-modulu'),
            },
            {
              label: mega.urunler.employeeManagement.shuttleServices,
              href: productHref('personel-servisi-yonetimi-modulu', 'personel-servisi-yonetimi-modulu'),
            },
            {
              label: mega.urunler.employeeManagement.occupationalHealth,
              href: productHref('isyeri-saglik-yonetimi-modulu', 'isyeri-saglik-yonetimi-modulu'),
            },
          ],
        },
        {
          type: 'links',
          title: mega.urunler.workforceManagement.title,
          icon: { source: 'idenfit', name: 'clock' },
          links: [
            {
              label: mega.urunler.workforceManagement.overview,
              href: hubHref('insan-kaynaklari-isgucu-yonetimi'),
              overview: true,
            },
            {
              label: mega.urunler.workforceManagement.timeAttendance,
              href: productHref('pdks-modulu', 'pdks-modulu'),
            },
            {
              label: mega.urunler.workforceManagement.timesheetTracking,
              href: productHref('puantaj-takip-programi-modulu', 'puantaj-takip-programi-modulu'),
            },
            {
              label: mega.urunler.workforceManagement.leaveManagement,
              href: productHref('yillik-izin-takip-programi', 'yillik-izin-takip-programi'),
            },
            {
              label: mega.urunler.workforceManagement.payroll,
              href: productHref('bordo-onay-modulu', 'bordo-onay-modulu'),
            },
          ],
        },
        {
          type: 'links',
          title: mega.urunler.talentManagement.title,
          icon: { source: 'idenfit', name: 'award' },
          links: [
            {
              label: mega.urunler.talentManagement.onboarding,
              href: productHref('onboarding-modulu', 'onboarding-modulu'),
            },
            {
              label: mega.urunler.talentManagement.offboarding,
              href: productHref('offboarding-modulu', 'offboarding-modulu'),
            },
            {
              label: mega.urunler.talentManagement.employeeExperience,
              href: productHref('organizasyonel-geri-bildirim-modulu', 'organizasyonel-geri-bildirim-modulu'),
            },
            {
              label: mega.urunler.talentManagement.survey,
              href: productHref('anket-modulu', 'anket-modulu'),
            },
            {
              label: mega.urunler.talentManagement.performanceOkr,
              href: productHref(
                'calisan-performans-degerlendirme-sistemi-modulu',
                'calisan-performans-degerlendirme-sistemi-modulu',
              ),
            },
            {
              label: mega.urunler.talentManagement.recruitmentAts,
              href: productHref('ise-alim-modulu', 'ise-alim-modulu'),
            },
          ],
        },
        {
          type: 'links',
          title: mega.urunler.hardwareManagement.title,
          icon: { source: 'idenfit', name: 'plug' },
          links: [
            { label: mega.urunler.hardwareManagement.overview, href: hardwareHref() },
            { label: mega.urunler.hardwareManagement.integratedDevices, href: hardwareHref('markalar') },
            { label: mega.urunler.hardwareManagement.biometricDevices, href: hardwareHref('biyometrik') },
            { label: mega.urunler.hardwareManagement.rfidDevices, href: hardwareHref('rfid') },
            { label: mega.urunler.hardwareManagement.turnstiles, href: hardwareHref('turnikeler') },
          ],
        },
      ],
      promo: {
        titleLines: mega.urunler.promo.titleLines,
        description: mega.urunler.promo.description,
        ctaText: mega.urunler.promo.ctaText,
        // NOT: idenfit.com'da gerçek slug "online-sunum-talep-et"; sitemizde
        // Header.astro'daki CTA ile tutarlı olması için "online-sunum-talep-et"
        // kullanıldı (bkz. CLAUDE.md).
        ctaHref: 'online-sunum-talep-et',
        // idenfit.com'un canlı `#mega-menu` header template'inde (homepage
        // HTML'i üzerinden doğrulandı, 2026-07-24) "LATER IS NEVER" bloğunun
        // hemen üstünde bulunan gerçek görsel (590×590, alt="header image") —
        // önceki taramada bulunamamıştı çünkü mega-menü içeriği ayrı bir
        // Elementor header template parçası, ana sayfanın `content.rendered`'ında
        // değil.
        image: '/wp-content/uploads/2025/08/header-image.webp',
        imageAlt: mega.urunler.promo.imageAlt,
      },
    },

    sektorler: {
      // idenfit.com'da bağımsız bir /sektorler/ genel bakış sayfası yok
      // (404) — bu yüzden çoklu-kolon + ikon düzeni kaynağa sadakat değil,
      // 12 öğelik tek-kolon listeyi daha okunur kılmak için tasarım kararı.
      columns: [
        {
          type: 'links',
          title: mega.sektorler.title,
          layout: 'grid-3',
          links: SECTOR_ITEMS.map((s) => ({
            label: mega.sektorler[s.labelKey],
            // TR slug'ı VARSAYILAN olarak DEĞİL, o dildeki GERÇEK route
            // slug'ı kullanılıyor (bkz. sectorContent.ts / CLAUDE.md).
            href: getSectorSlug(s.slug, locale) ?? s.slug,
            icon: { source: 'lucide' as const, name: s.icon },
          })),
        },
      ],
    },

    kurumsal: {
      columns: [
        {
          type: 'links',
          title: mega.kurumsal.title,
          links: [
            { label: mega.kurumsal.about, href: aboutHref() },
            { label: mega.kurumsal.contact, href: contactHref() },
            { label: mega.kurumsal.faq, href: faqHref() },
            { label: mega.kurumsal.globalBrand, href: globalBrandHref() },
          ],
        },
      ],
      // Kullanıcının kendi sağladığı görselle (bkz. `kurumsalPromoImage`
      // importu yukarıda) — Hakkımızda sayfasına link veriyor (kullanıcı
      // kararı, 2026-07-27: takım görseli en doğal Hakkımızda'yla eşleşiyor).
      promoCard: {
        category: mega.kurumsal.promo.category,
        title: mega.kurumsal.promo.title,
        description: mega.kurumsal.promo.description,
        image: kurumsalPromoImage.src,
        imageAlt: mega.kurumsal.promo.imageAlt,
        href: aboutHref(),
      },
    },

    kesfet: {
      // idenfit.com/online-sunum-talep-et/ üzerinden ikinci kez, derinlemesine
      // çıkarıldı. Gerçek HTML'de "Hesaplamalar >" başlığı ve altındaki 8 öğe
      // TEK bir kolon/container'dır (kullanıcının ilk ekran görüntüsü
      // yorumundaki "Kaynaklar" + "Hesaplamalar" ayrımı, kaynağa bakınca aynı
      // kolon olduğu görüldüğü için burada TEK sublist kolonu olarak birleştirildi).
      columns: [
        {
          type: 'links',
          title: mega.kesfet.contentTitle,
          icon: { source: 'lucide', name: 'Newspaper' },
          // 2026-07-30: her iki öğe de `content-card` stilinde (52px
          // dairesel rozet + başlık + açıklama, bkz.
          // `LinksColumn.linkIconStyle` yorumu) — pilot (yalnızca Bloglar)
          // onaylandıktan sonra Dijital İK Olgunluk Testi'ne de aynı stil +
          // kendi gerçek ikonu uygulandı.
          linkIconStyle: 'content-card',
          links: [
            {
              label: mega.kesfet.blog,
              href: 'blog',
              icon: { source: 'explore', name: 'blog' },
              description: mega.kesfet.blogDescription,
            },
            // 2026-07-28: gerçek migrasyon tamamlandı — kaynağın 3 sayfalık
            // (lead-capture/quiz/sonuç) + sessionStorage akışı, backend
            // gerektirmeyen tek sayfalık bir React akışına (useState ile 3
            // iç adım) çevrildi, bkz. `HrMaturityTest.tsx` +
            // `maturityTestDefinitions.ts`. Yalnızca TR'de var (KARAR 2,
            // Hesaplama Araçları'yla aynı ilke) — EN/IT/NL mevcut
            // `en:'tr'`/`it:'tr'`/`nl:'en'` fallback zinciriyle otomatik TR'ye
            // yönlendirilir.
            {
              label: mega.kesfet.digitalMaturityTest,
              href: 'ik-dijital-olgunluk-testi',
              icon: { source: 'explore', name: 'digitalMaturityTest' },
              description: mega.kesfet.digitalMaturityTestDescription,
            },
          ],
        },
        {
          // Önceden TEK paylaşılan href'e (`hesaplama-araclari`, sublist tipi)
          // giden 8 düz metin öğesiydi — sayfa gerçek içerikle kurulunca
          // (bkz. CalculatorsPage.astro) her biri kendi aracının anchor'ına
          // bağlandı (Donanım sayfasındaki `#rfid` deseniyle aynı yöntem,
          // `lWithHash()` üzerinden çözülüyor). Anchor slug'ları
          // `calculatorDefinitions.ts`'teki `CALCULATOR_DEFINITIONS[].slug`
          // ile birebir eşleşmeli. Sayfa yalnızca TR'de var (KARAR 2, bkz.
          // CLAUDE.md) — EN/IT'de bu linkler şimdilik kırık kalıyor
          // (sayfa hiç kurulmadığı için zaten önceden de kırıktı).
          type: 'links',
          title: mega.kesfet.calculatorsTitle,
          icon: { source: 'lucide', name: 'Calculator' },
          // 2026-07-28: kullanıcı kaynakla piksel-seviyesinde karşılaştırma
          // istedi — canlı `/online-sunum-talep-et/` sayfasındaki (KEŞFET'in
          // gerçek kaynağı) icon-list widget'ı (`1eaf004`) incelenince her
          // linkin KENDİ küçük (16px), renkli ikonu olduğu görüldü (düz metin
          // DEĞİLMİŞ). 8 ikon birebir çıkarılıp `CalculatorIcons.tsx`'e
          // taşındı, `linkIconStyle:'inline'` ile SEKTÖRLER'in rozet
          // stilinden farklı, kaynağa sadık küçük-ikon+metin düzeni
          // uygulandı (bkz. MegaMenu.tsx).
          linkIconStyle: 'inline',
          links: [
            { label: mega.kesfet.overtimePay, href: 'hesaplama-araclari#fazla-mesai', icon: { source: 'calc', name: 'overtimePay' } },
            { label: mega.kesfet.incomeTax, href: 'hesaplama-araclari#gelir-vergisi', icon: { source: 'calc', name: 'incomeTax' } },
            { label: mega.kesfet.employerCost, href: 'hesaplama-araclari#isveren-maliyeti', icon: { source: 'calc', name: 'employerCost' } },
            { label: mega.kesfet.severancePay, href: 'hesaplama-araclari#kidem-tazminati', icon: { source: 'calc', name: 'severancePay' } },
            { label: mega.kesfet.salaryRaise, href: 'hesaplama-araclari#maas-zammi', icon: { source: 'calc', name: 'salaryRaise' } },
            { label: mega.kesfet.corporateTax, href: 'hesaplama-araclari#kurumlar-vergisi', icon: { source: 'calc', name: 'corporateTax' } },
            { label: mega.kesfet.mealAllowance, href: 'hesaplama-araclari#yemek-ucreti', icon: { source: 'calc', name: 'mealAllowance' } },
            { label: mega.kesfet.noticePeriod, href: 'hesaplama-araclari#ihbar-suresi', icon: { source: 'calc', name: 'noticePeriod' } },
          ],
        },
        {
          type: 'cards',
          title: mega.kesfet.reportsTitle,
          icon: { source: 'lucide', name: 'FileDown' },
          nextAriaLabel: mega.ui.nextReports,
          prevAriaLabel: mega.ui.prevReports,
          cards: [
            {
              category: mega.kesfet.generationsWorkforce.category,
              title: mega.kesfet.generationsWorkforce.title,
              image: '/wp-content/uploads/2026/04/Group-1365421434.png',
              imageAlt: mega.kesfet.generationsWorkforce.imageAlt,
              href: '/wp-content/uploads/2026/04/Kusaklarin-is-Gucune-Etkisi.pdf',
              external: true,
            },
            {
              category: mega.kesfet.dataDrivenRecruitment.category,
              title: mega.kesfet.dataDrivenRecruitment.title,
              image: '/wp-content/uploads/2026/04/Veri-Odakli-Ise-Alim-Rehberi-1-1.png',
              imageAlt: mega.kesfet.dataDrivenRecruitment.imageAlt,
              href: '/wp-content/uploads/2026/04/Veri-Odakli-Ise-Alim-Rehberi.pdf',
              external: true,
            },
            {
              category: mega.kesfet.digitalTransformation.category,
              title: mega.kesfet.digitalTransformation.title,
              image:
                '/wp-content/uploads/2026/04/2026ya-Hazirlik-10-Adimda-Dijital-IK-Donusum-Rehberi-1-1.png',
              imageAlt: mega.kesfet.digitalTransformation.imageAlt,
              href: '/wp-content/uploads/2026/04/2026ya-Hazirlik-10-Adimda-Dijital-IK-Donusum-Rehberi.pdf',
              external: true,
            },
            {
              category: mega.kesfet.strategicHr.category,
              title: mega.kesfet.strategicHr.title,
              image: '/wp-content/uploads/2026/04/2026-Stratejik-IK-Rehberi-1-1-1.png',
              imageAlt: mega.kesfet.strategicHr.imageAlt,
              href: '/wp-content/uploads/2026/04/2026-Stratejik-IK-Rehberi-1.pdf',
              external: true,
            },
          ],
        },
      ],
    },
  };
}
