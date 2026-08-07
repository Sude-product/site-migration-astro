import { useEffect, useState } from 'react';
import MaturityArcDecoration from './MaturityArcDecoration.tsx';
import {
  MATURITY_QUESTIONS,
  MATURITY_CATEGORY_LABELS,
  calculateMaturityResult,
  type MaturityAnswerValue,
  type MaturityCategoryKey,
  type MaturityResult,
} from '../data/maturityTestDefinitions';
import {
  DigitalInfrastructureIcon,
  TimeAndLeaveIcon,
  PerformanceIcon,
  RecruitmentIcon,
  AnalyticsIcon,
} from './icons/MaturityAreaIcons';
import { ScoreBadgeIcon, InsightIcon, ApprovedReportIcon, RoadmapIcon } from './icons/ChecklistIcons';
import { MaturityScoreIcon, CategoryAnalysisIcon, RiskAnalysisIcon, RoadmapResultIcon } from './icons/ResultCardIcons';

// Dijital İK Olgunluk Testi — kaynağın 3 AYRI sayfa + sessionStorage'a
// dayanan akışının (bkz. maturityTestDefinitions.ts başındaki not) temiz,
// tek-sayfalık React karşılığı. Adım yönetimi tamamen `useState` — hiçbir
// yerde `sessionStorage`/URL değişikliği yok, kullanıcı sayfayı yenilerse
// baştan başlar (bilinçli basitleştirme, kaynağın kırılgan step-DOM
// mekanizmasına bağımlı kalınmadı).

type Step = 'company' | 'quiz' | 'result';

interface CompanyInfo {
  name: string;
  sector: string;
  employeeCount: string;
}

const EMPTY_COMPANY: CompanyInfo = { name: '', sector: '', employeeCount: '' };

const ANSWER_OPTIONS: { value: MaturityAnswerValue; label: string }[] = [
  { value: 'evet', label: 'Evet' },
  { value: 'kısmen', label: 'Kısmen' },
  { value: 'hayır', label: 'Hayır' },
];

// Kaynağın kendi ölçülen alan stiline göre (post-23868.css, form widget'ı
// `bc81c1b`): `.elementor-field{background-color:#fff;border-radius:10px;
// border-color:var(--e-global-color-uicore_white)}` — uicore_white
// #FFFFFF olduğundan kenarlık beyaz zemin üzerinde görünmez, tek görünen
// şey rounded-10px beyaz kutu (bkz. CLAUDE.md 2026-07-29 günlüğü).
const inputClass =
  'h-full w-full rounded-[10px] border border-white bg-white px-3.5 py-2.5 text-sm text-heading shadow-sm placeholder:text-muted transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';

// Hero'nun altındaki 2. bölüm ("İK Dijital Dönüşümünüzü 5 Kritik Alanda
// Netleştirin", template id 23868, container `68cfe75`). 5 kartın her biri
// kaynağın kendi imza rengini taşıyor (bkz. `MaturityAreaIcons.tsx` başı) —
// `CalculatorIcons.tsx`'teki çok-renkli ilkeyle tutarlı. **Bilinçli
// sadeleştirme:** kaynakta mobilde (≤767px) kartlar `scroll-snap` ile yatay
// kaydırmalı bir carousel'e dönüşüyor (ayrı ok butonlarıyla, `cfe6835`) —
// bunun yerine daha basit/erişilebilir bir responsive grid (`grid-cols-1
// sm:grid-cols-2 lg:grid-cols-5`) kullanıldı; içerik/renk/sıra birebir,
// yalnızca mobil düzen mekanizması basitleştirildi.
const MATURITY_AREAS: {
  title: string;
  text: string;
  badgeBg: string;
  Icon: (props: { className?: string }) => React.JSX.Element;
}[] = [
  {
    title: 'Dijital Altyapı & Özlük',
    text: 'İK altyapınızın dijitalleşme ve entegrasyon seviyesini ölçün.',
    badgeBg: '#E3F2D2',
    Icon: DigitalInfrastructureIcon,
  },
  {
    title: 'Zaman & İzin Yönetimi',
    text: 'Zaman ve izin süreçlerinizin ne kadar verimli yönetildiğini görün.',
    badgeBg: '#FFE6E6',
    Icon: TimeAndLeaveIcon,
  },
  {
    title: 'Performans & Yetkinlik',
    text: 'Performans ve yetkinlik süreçlerinizin olgunluk düzeyini değerlendirin.',
    badgeBg: '#FFEECE',
    Icon: PerformanceIcon,
  },
  {
    title: 'İşe Alım (ATS)',
    text: 'İşe alım süreçlerinizin hız ve ölçülebilirlik seviyesini analiz edin.',
    badgeBg: '#E4D5EF',
    Icon: RecruitmentIcon,
  },
  {
    title: 'Analitik & Raporlama',
    text: 'İK verilerinizin karar alma gücünü ne kadar desteklediğini keşfedin.',
    badgeBg: '#EDDEE1',
    Icon: AnalyticsIcon,
  },
];

function FiveAreasSection() {
  return (
    <section className="py-[60px] md:py-20 lg:py-[100px]">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-[29px] font-semibold text-brand md:text-[34px] lg:text-[36px]">
          İK Dijital Dönüşümünüzü 5 Kritik Alanda Netleştirin
        </h2>
        <p className="mt-4 text-base text-body md:text-lg lg:text-xl">
          İnsan kaynakları süreçlerinizin dijital olgunluğunu ölçerek güçlü ve gelişime açık alanlarınızı görün. Test
          sonuçları, dönüşüm yolculuğunuz için net bir yol haritası sunar.
        </p>
      </div>

      {/* GENİŞLET/BOŞLUK ARTIR (2026-07-30, Section 3 pilotunun onayı sonrası
          uygulandı): `max-w-6xl`→`max-w-7xl`, grid gap `gap-5`→`gap-7` (kartlar
          arası ~%40), `mt-10`→`mt-14` (~%40) — kaynaktan bilinçli UX sapması,
          aynı mantık Section 5'e de uygulandı (kendi grid yapısına uygun oranla,
          birebir aynı px değil). */}
      <div className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-5">
        {MATURITY_AREAS.map(({ title, text, badgeBg, Icon }, index) => (
          // **Hover:** kaynakta (post-23868.css + uicore-global.css) bu kart/rozet
          // için ÖZEL bir hover kuralı bulunamadı (yalnızca hardcoded stroke
          // renklerini görsel olarak etkilemeyen genel/inert bir
          // `.elementor-icon:hover{color:...}` kuralı var) — bu yüzden birebir
          // "ölçülüp uygulanan" bir değer DEĞİL, sitenin başka yerlerinde de
          // kullanılan aynı desenle (`.btn-cta-solid:hover`, KEŞFET carousel
          // kartları — hafif yükselme + gölge artışı) tutarlı, bilinçli bir UX
          // eklentisi.
          <div
            key={title}
            className="group flex flex-col items-start gap-6 rounded-2xl bg-surface p-8 shadow-[0_0_10px_rgba(0,0,0,0.07)] transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
          >
            {/* PİLOT (geçici, yalnızca ilk kart): rozet 70px→112px, ikon
                38px→64px büyütüldü — kullanıcı onayı bekleniyor, onay
                sonrası kalan 4 karta da uygulanacak. */}
            {index === 0 ? (
              <div
                className="flex h-28 w-28 shrink-0 items-center justify-center rounded-[45px] transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: badgeBg }}
              >
                <Icon className="h-16 w-16" />
              </div>
            ) : (
              <div
                className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-[28px] transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: badgeBg }}
              >
                <Icon className="h-[38px] w-[38px]" />
              </div>
            )}
            <h3 className="text-lg font-semibold text-heading">{title}</h3>
            <p className="text-sm text-body">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// 3. bölüm ("3 Dakikada Dijital İK Raporunuzu Oluşturun", `cbd76d3`) — solda
// 4 maddelik check-list, sağda rapor mockup görseli. **Bulgu:** 4 madde
// AYNI checkmark'ı TEKRARLAMIYOR, her biri kendi ikonuna sahip (bkz.
// `ChecklistIcons.tsx` başı). **PLACEHOLDER:** kaynağın gerçek rapor mockup
// görseli (`Group-1365421288`, `uploads.zip`'te, henüz işlenmedi — Faz 2)
// yerine kırık-çizgili bir placeholder kutu kullanıldı, gerçek görsel
// eklenince yalnızca bu placeholder `<img>`'e çevrilecek.
const REPORT_HIGHLIGHTS: { text: string; Icon: (props: { className?: string }) => React.JSX.Element }[] = [
  { text: 'Dijital olgunluk skorunuzu anında öğrenin.', Icon: ScoreBadgeIcon },
  { text: 'Güçlü ve kritik alanlarınızı net görün.', Icon: InsightIcon },
  { text: 'Yönetimle paylaşılabilir profesyonel rapor alın.', Icon: ApprovedReportIcon },
  { text: 'Size özel dijital dönüşüm yol haritasını edinin.', Icon: RoadmapIcon },
];

function ChecklistSection() {
  return (
    <section className="py-5 md:py-[100px]">
      {/* PİLOT (2026-07-30, kullanıcı onayı bekliyor): kaynaktan bilinçli bir
          UX sapması — container `max-w-6xl`→`max-w-7xl`'e (sitenin diğer
          bölümlerinde de kullanılan genişlik), kolon arası boşluk
          `gap-10 lg:gap-16`→`gap-14 lg:gap-24`'e (~%40-50 artış) büyütüldü;
          amaç ikon/görsel gruplarının merkeze sıkışık durmayıp container
          genişliğini daha iyi kullanması. Onay sonrası Section 2/5'e de
          uygulanacak. */}
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-24 lg:px-8">
        <div>
          <h2 className="text-center text-[30px] font-semibold text-brand md:text-[32px] lg:text-left lg:text-[36px]">
            3 Dakikada Dijital İK Raporunuzu Oluşturun
          </h2>
          <p className="mt-4 text-center text-base text-body md:text-lg lg:text-left lg:text-xl">
            Bu test sadece bir skor üretmez. İK operasyonlarınızın bugünkü durumunu gösterir ve bir sonraki adımı
            netleştirir.
          </p>
          {/* Madde arası boşluk: kaynağın gerçek ölçümü 10px'ti (`--ui-e-grid-gap`,
              widget `21c6b56`) — PİLOT (2026-07-30) kapsamında kullanıcı
              talebiyle bilinçli olarak ~%40 büyütüldü (14px), kaynaktan
              sapma. İkon-metin arası da aynı oranda büyütüldü (gap-2.5→gap-3.5). */}
          <ul className="mt-8 space-y-[14px]">
            {REPORT_HIGHLIGHTS.map(({ text, Icon }) => (
              <li key={text} className="flex items-start gap-3.5 text-heading">
                <Icon className="mt-0.5 h-6 w-6 shrink-0" />
                <span className="text-base md:text-lg lg:text-xl">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* uploads.zip'ten çıkarılıp public/wp-content/uploads/'a yerleştirilen
            gerçek kaynak görseli (bkz. CLAUDE.md "uploads.zip işleme" günlüğü,
            2026-07-29 pilot). Boyut: kaynağın kendi ölçülen değerleri
            (`post-23868.css`, widget `01116f0`) — masaüstünde 581px,
            ≤1024px'te 350px; önceki `max-w-[420px]` tahminen küçük
            bırakılmıştı, gerçek ölçümle düzeltildi. */}
        <img
          src="/wp-content/uploads/2026/03/Group-1365421288.png"
          srcSet="/wp-content/uploads/2026/03/Group-1365421288-300x246.png 300w, /wp-content/uploads/2026/03/Group-1365421288-650x534.png 650w, /wp-content/uploads/2026/03/Group-1365421288-768x631.png 768w, /wp-content/uploads/2026/03/Group-1365421288-1024x841.png 1024w, /wp-content/uploads/2026/03/Group-1365421288.png 1162w"
          sizes="(max-width: 1024px) 100vw, 581px"
          width={1000}
          height={821}
          alt=""
          loading="lazy"
          className="mx-auto aspect-[1000/821] w-full max-w-[350px] rounded-2xl object-contain lg:max-w-[581px]"
        />
      </div>
    </section>
  );
}

// 4. bölüm ("Basit, Hızlı ve Veri Odaklı", `746a656`) — 3 numaralı adım,
// kırmızımsı-şeffaf bir gradyan panel içinde. **Bulgu:** kaynakta bu
// bölümde HİÇ görsel widget'ı yok (kullanıcı onayıyla doğrulandı, bkz.
// CLAUDE.md 2026-07-29 günlüğü) — yalnızca gradyan + başlık + 3 adım,
// bilinçli olarak görselsiz bırakıldı. **Bulunan kaynak veri hatası:** 2.
// adımın ham metni ("Firma büyüklüğü ve sektör bilgisiyle analiziniz size
// özel hazırlanır.6 ana başlıkta, 20 kısa soruya yanıt verin.") 1. adımın
// cümlesinin kopyala-yapıştırla yanlışlıkla tekrarlanmış hali + gerçek 2.
// adım metninin birleşimiydi (WP editöründe düzeltilmemiş bir hata) —
// yalnızca gerçek/anlamlı kısım kullanıldı.
const PROCESS_STEPS: { number: number; title: string; text: string }[] = [
  {
    number: 1,
    title: 'Bilgilerinizi Girin',
    text: 'Firma büyüklüğü ve sektör bilgisiyle analiziniz size özel hazırlanır.',
  },
  {
    number: 2,
    title: 'Soruları Yanıtlayın',
    text: '6 ana başlıkta, 20 kısa soruya yanıt verin.',
  },
  {
    number: 3,
    title: 'Skorunuzu ve Yol Haritanızı Görün',
    text: 'Dijital olgunluk seviyeniz anında hesaplanır, detaylı rapor e-postanıza gönderilir.',
  },
];

function ThreeStepsSection() {
  return (
    <section className="px-4 py-[50px] sm:px-6 md:py-20 lg:px-8 lg:py-[100px]">
      <div
        className="mx-auto max-w-[1080px] rounded-[10px] px-4 py-10 sm:px-8"
        style={{ backgroundImage: 'linear-gradient(180deg, #FF000021 0%, #FF000000 100%)' }}
      >
        <h2 className="text-center text-[36px] font-semibold text-brand">Basit, Hızlı ve Veri Odaklı</h2>
        <div className="mt-10 flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-between">
          {PROCESS_STEPS.map(({ number, title, text }) => (
            <div key={number} className="flex flex-col items-center gap-5 text-center lg:w-1/3">
              <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-[30px] bg-[#FBD7D4]">
                <span className="text-4xl font-normal text-heading">{number}</span>
              </div>
              <h3 className="text-2xl font-semibold text-heading">{title}</h3>
              <p className="text-base text-heading">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 5. bölüm ("Test Sonucunda Sizi Neler Bekliyor", `205ac9c`) — solda sonuç
// ekranı görseli (PLACEHOLDER, `Group-1365421389`, `uploads.zip`'te —
// Faz 2), sağda 4 kart. **Bilinçli kaynaktan sapma (kullanıcı talebiyle):**
// kaynakta bu kartlar aslında DÜZ beyaz, gölgesiz, rozetsiz/tek-renk siyah
// ikon (section 2'nin renkli-rozetli kartlarından FARKLI bir stil) —
// kullanıcı özellikle "Section 2'deki kart stiliyle tutarlı olsun" istediği
// için `rounded-2xl`/gölge/renkli-rozet buraya da UYGULANDI. Kaynakta
// per-kart bir renk verisi olmadığından (hepsi aynı siyah ikon) 4 kart TEK
// bir tema rengiyle (`--color-brand-light`, sitenin zaten kullandığı açık
// kırmızı token'ı) rozetlendi — section 2'nin 5 FARKLI rengi gibi uydurma
// bir renk ataması yapılmadı.
const RESULT_CARDS: { title: string; text: string; Icon: (props: { className?: string }) => React.JSX.Element }[] = [
  {
    title: 'Dijital Olgunluk Skoru',
    text: '100 üzerinden net ve karşılaştırılabilir bir skor.',
    Icon: MaturityScoreIcon,
  },
  {
    title: 'Kategori Bazlı Analiz',
    text: 'Hangi alan güçlü, hangisi kritik?',
    Icon: CategoryAnalysisIcon,
  },
  {
    title: 'Kayıp & Risk Analizi',
    text: 'Manuel süreçlerin zaman ve maliyet etkisi.',
    Icon: RiskAnalysisIcon,
  },
  {
    title: 'Size Özel Yol Haritası',
    text: 'İlk 30–90 gün için net aksiyonlar.',
    Icon: RoadmapResultIcon,
  },
];

function ResultCardsSection() {
  return (
    <section className="px-4 py-[50px] sm:px-6 lg:px-8 lg:py-[100px]">
      {/* GENİŞLET/BOŞLUK ARTIR (2026-07-30, Section 3 pilotunun onayı sonrası
          uygulandı): `max-w-6xl`→`max-w-7xl`, kolon gap `gap-[60px]`→`gap-20`
          (~%33), mobil `gap-10`→`gap-14` (~%40) — kaynaktan bilinçli UX sapması. */}
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* uploads.zip'ten çıkarılıp public/wp-content/uploads/'a yerleştirilen
            gerçek kaynak görseli (bkz. CLAUDE.md "uploads.zip işleme" günlüğü,
            2026-07-29 pilot). Boyut: kaynağın kendi ölçülen değerleri
            (`post-23868.css`, widget `9e245c9`) — masaüstünde 432px,
            ≤1024px'te 350px; önceki sabit `max-w-[350px]` yalnızca mobil/
            tablet değeriydi, masaüstü gerçek ölçümle düzeltildi. */}
        <img
          src="/wp-content/uploads/2026/03/Group-1365421389.png"
          srcSet="/wp-content/uploads/2026/03/Group-1365421389-262x300.png 262w, /wp-content/uploads/2026/03/Group-1365421389-568x650.png 568w, /wp-content/uploads/2026/03/Group-1365421389-768x878.png 768w, /wp-content/uploads/2026/03/Group-1365421389.png 864w"
          sizes="(max-width: 1024px) 100vw, 432px"
          width={864}
          height={988}
          alt=""
          loading="lazy"
          className="mx-auto aspect-[864/988] w-full max-w-[350px] rounded-2xl object-contain lg:max-w-[432px]"
        />

        <div>
          <h2 className="text-center text-[30px] font-semibold text-brand lg:text-left lg:text-[36px]">
            Test Sonucunda Sizi Neler Bekliyor
          </h2>
          <div className="mt-8 space-y-6">
            {RESULT_CARDS.map(({ title, text, Icon }) => (
              // Hover: FiveAreasSection'daki AYNI not geçerli — kaynakta bu
              // kartlara özel bir hover kuralı yok, sitenin diğer bölümleriyle
              // tutarlı bilinçli bir UX eklentisi.
              <div
                key={title}
                className="group flex items-center gap-6 rounded-2xl bg-surface p-6 shadow-[0_0_10px_rgba(0,0,0,0.07)] transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
              >
                {/* İkon 44px — kaynağın kendi ölçüsü (`.elementor-icon{font-size:44px}`,
                    bkz. CLAUDE.md 2026-07-29 düzeltme günlüğü — önceki turda
                    yanlışlıkla section 2'nin 38px'i kopyalanmıştı). */}
                <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-[28px] bg-brand-light transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-11 w-11 text-brand" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-heading">{title}</h3>
                  <p className="mt-1 text-sm text-body">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Firma bilgisi yalnızca bu adımda toplanıp sonrasında kullanılmıyor —
// kaynakta bu veri yalnızca (şu an bizde devre dışı olan) "raporu
// e-postama gönder" isteğine eklenmek için tutuluyordu (bkz. ResultStep'in
// altındaki not). Backend bağlanınca burada `onSubmit(company)`'ye
// dönüştürülüp üst state'e taşınabilir.
//
// **Kaynakta bu form İKİ YERDE var** (hero'da `bc81c1b`, kapanış CTA'sında
// `8039718` — birebir aynı 3 alan + buton, ayrı `sessionStorage` senkron
// script'iyle "aynı" gösteriliyorlar, bkz. CLAUDE.md 2026-07-29 günlüğü) —
// bu yüzden burada da PAYLAŞILAN tek bir `CompanyForm` component'i olarak
// çıkarıldı, hero (`CompanyStep`) VE kapanış CTA'sı (`ClosingCtaSection`)
// aynı component'i kendi bağımsız state'iyle iki kez render ediyor.
// `idPrefix` çakışan DOM id'lerini (iki form aynı sayfada) önlüyor.
function CompanyForm({ onSubmit, idPrefix }: { onSubmit: () => void; idPrefix: string }) {
  const [company, setCompany] = useState<CompanyInfo>(EMPTY_COMPANY);

  const update = (field: keyof CompanyInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCompany((c) => ({ ...c, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    // Form paneli — kaynağın kendi gri kartı (post-23868.css, `47d9ea6`/
    // `8993565` — ikisi de AYNI değerleri kullanıyor): bg ~%14 siyah (beyaz
    // zeminde açık gri görünüyor), %80 beyaz kenarlık, 10px köşe. Masaüstünde
    // yatay (flex-row, %30/%25/%25/%20 kolonlar), ≤767px'te dikey (kaynağın
    // kendi breakpoint'i, Tailwind'in `md:` eşiğine en yakın düşen).
    <div className="relative rounded-[10px] border border-white/80 bg-black/14 p-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left md:flex-row md:items-stretch">
        <div className="md:basis-[30%]">
          <label htmlFor={`${idPrefix}-name`} className="sr-only">Firma Adı</label>
          <input
            id={`${idPrefix}-name`}
            type="text"
            required
            value={company.name}
            onChange={update('name')}
            placeholder="Firma Adı"
            className={inputClass}
          />
        </div>
        <div className="md:basis-[25%]">
          <label htmlFor={`${idPrefix}-sector`} className="sr-only">Sektör</label>
          <input
            id={`${idPrefix}-sector`}
            type="text"
            required
            value={company.sector}
            onChange={update('sector')}
            placeholder="Sektör"
            className={inputClass}
          />
        </div>
        <div className="md:basis-[25%]">
          <label htmlFor={`${idPrefix}-employees`} className="sr-only">Çalışan Sayısı</label>
          <input
            id={`${idPrefix}-employees`}
            type="number"
            min="1"
            required
            value={company.employeeCount}
            onChange={update('employeeCount')}
            placeholder="Çalışan Sayısı"
            className={inputClass}
          />
        </div>
        <div className="md:basis-[20%]">
          {/* Global `.elementor-button` kit kuralı (uicore-global.css):
              solid kırmızı zemin + beyaz yazı, 10px köşe — `.btn-cta`
              (outline) DEĞİL, ayrı bir solid stil (bkz. CLAUDE.md
              2026-07-29 KEŞİF notu). */}
          <button
            type="submit"
            className="h-full w-full rounded-[10px] bg-brand px-4 py-2.5 text-[15px] font-bold text-white transition hover:brightness-110"
          >
            Testi Başlat
          </button>
        </div>
      </form>
    </div>
  );
}

function CompanyStep({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="mx-auto max-w-[844px] text-center">
      <div className="mx-auto max-w-xl">
        <h1 className="text-[32px] font-bold leading-[1.1] text-heading md:text-[42px] lg:text-[56px]">
          İK Dijital Olgunluk Testi
        </h1>
        <h2 className="mt-2 text-[22px] font-bold leading-tight text-heading md:text-[28px] lg:text-[36px]">
          <span className="font-normal text-brand">3 Dakikada</span> Skorunuzu Öğrenin
        </h2>
        <p className="mt-4 text-[15px] text-body md:text-base lg:text-xl">
          Operasyonel süreçlerinizi verimliliğinizi ölçün, <strong>size özel dijital dönüşüm raporunuzu hemen alın.</strong>
        </p>
      </div>

      <div className="mt-8">
        <CompanyForm onSubmit={onSubmit} idPrefix="maturity-hero" />
      </div>
    </div>
  );
}

// 6. bölüm — kapanış CTA (`3d265a3`/`8993565`). Kaynağın kendi ikinci
// (birebir aynı) form kopyası — bkz. `CompanyForm`'un başındaki not.
function ClosingCtaSection({ onSubmit }: { onSubmit: () => void }) {
  return (
    <section className="px-4 py-[50px] sm:px-6 md:py-20 lg:px-8 lg:py-[100px]">
      <div className="mx-auto max-w-[844px] text-center">
        <h2 className="text-[30px] font-semibold text-heading md:text-[32px] lg:text-[36px]">
          İK Dijital Olgunluk Skorunu Hemen Hesapla
        </h2>
        <div className="mt-8">
          <CompanyForm onSubmit={onSubmit} idPrefix="maturity-closing" />
        </div>
      </div>
    </section>
  );
}

function QuizStep({
  answers,
  onAnswer,
  onFinish,
}: {
  answers: Record<number, MaturityAnswerValue>;
  onAnswer: (questionId: number, value: MaturityAnswerValue) => void;
  onFinish: (answers: Record<number, MaturityAnswerValue>) => void;
}) {
  const [index, setIndex] = useState(0);
  const question = MATURITY_QUESTIONS[index];
  const selected = answers[question.id];
  const isLast = index === MATURITY_QUESTIONS.length - 1;
  const percent = ((index + 1) / MATURITY_QUESTIONS.length) * 100;

  const goNext = () => {
    if (!selected) return;
    if (isLast) {
      onFinish(answers);
      return;
    }
    setIndex((i) => i + 1);
  };

  const goBack = () => setIndex((i) => Math.max(0, i - 1));

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>{question.category}</span>
        <span>{index + 1}/{MATURITY_QUESTIONS.length}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: `${percent}%` }} />
      </div>

      <h2 className="mt-8 text-xl font-semibold leading-snug text-heading sm:text-2xl">{question.text}</h2>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {ANSWER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onAnswer(question.id, opt.value)}
            aria-pressed={selected === opt.value}
            className={`rounded-[3px] border px-4 py-3 text-sm font-semibold transition-colors ${
              selected === opt.value
                ? 'border-brand bg-brand-light text-brand'
                : 'border-[rgba(0,0,0,0.6)] bg-white text-heading hover:border-brand'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goBack}
          disabled={index === 0}
          className="rounded-md px-5 py-2.5 text-sm font-semibold text-heading transition-colors hover:text-brand disabled:cursor-not-allowed disabled:opacity-0"
        >
          Geri
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!selected}
          className="btn-cta px-6 py-2.5 text-sm font-semibold"
        >
          {isLast ? 'Testi Bitir' : 'İleri'}
        </button>
      </div>
    </div>
  );
}

// Dairesel skor göstergesi — kaynağın `progress-ring` SVG'siyle aynı fikir
// (stroke-dasharray/dashoffset ile ilerleme çemberi), ama kaynağın
// `requestAnimationFrame` script'i taklit edilmeden, sıfırdan yazıldı.
function ScoreRing({ score }: { score: number }) {
  const [animated, setAnimated] = useState(0);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let frame: number;
    const duration = 900;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setAnimated(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="relative mx-auto h-[220px] w-[220px]">
      <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
        <circle cx="110" cy="110" r={radius} fill="none" stroke="currentColor" strokeWidth="14" className="text-gray-100" />
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-brand transition-[stroke-dashoffset] duration-100"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-heading">{animated}</span>
        <span className="text-xs text-muted">/ 100</span>
      </div>
    </div>
  );
}

// E-posta doğrulaması — kaynağın kendi `isValidEmail()`'iyle birebir aynı
// basit regex (bkz. sonuç sayfasının ham script'i, `wp-json/hr-maturity/generate`
// çağrısından önce kaynakta da yalnızca bu kontrol yapılıyor).
const EMAIL_PATTERN = /\S+@\S+\.\S+/;

// "Detaylı raporu e-postama gönder" — kaynakta bu buton `/wp-json/hr-maturity/generate`
// adlı özel bir WP REST endpoint'ine POST atıp dönen URL'de bir PDF açıyordu
// (bkz. CLAUDE.md TODO #12). Bizim tarafımızda bu backend henüz yok — bu yüzden
// GERÇEK bir rapor/e-posta göndermiyoruz (yanlış bir başarı iması olmasın diye),
// yalnızca kullanıcının niyetini kaydedip (`console.log`, `HeroForm`'un backend'siz
// hâliyle AYNI ilke) siteye zaten var olan genel Teşekkürler sayfasına
// yönlendiriyoruz (`/tesekkurler/`, "size en kısa sürede ulaşacağız" gibi
// gerçek bir e-posta gönderimi iddia ETMEYEN genel bir mesaj — kullanıcı
// onayıyla, yeni/özel bir sayfa yerine bu mevcut sayfa yeniden kullanıldı).
function EmailReportForm({ result }: { result: MaturityResult }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setError('Geçerli bir e-posta adresi giriniz.');
      return;
    }
    console.log('HR Maturity Test — rapor talebi:', { email, result });
    window.location.href = '/tesekkurler/';
  };

  return (
    <div className="mx-auto mt-10 max-w-sm rounded-2xl border border-gray-100 p-6">
      <h3 className="text-sm font-semibold text-heading">Detaylı raporu e-postama gönder</h3>
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          placeholder="E-posta adresinizi yazınız"
          className="w-full rounded-[3px] border border-brand px-3.5 py-2.5 text-sm text-heading placeholder:text-[rgba(0,0,0,0.4)] focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Gönder
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-brand">{error}</p>}
    </div>
  );
}

function ResultStep({ result }: { result: MaturityResult }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <ScoreRing score={result.totalScore} />

      <h2 className="mt-6 text-2xl font-bold text-heading sm:text-3xl">{result.level.title}</h2>
      <p className="mt-1 text-base font-semibold text-brand">{result.level.subtitle}</p>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-body">{result.level.description}</p>

      <div className="mt-10 text-left">
        <h3 className="text-center text-lg font-semibold text-heading">Kategori Bazlı Sonuçlarınız</h3>
        <div className="mt-4 space-y-4">
          {(Object.keys(MATURITY_CATEGORY_LABELS) as MaturityCategoryKey[]).map((key) => (
            <div key={key}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-body">{MATURITY_CATEGORY_LABELS[key]}</span>
                <span className="font-semibold text-heading">%{result.categoryScores[key]}</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-brand transition-all duration-700"
                  style={{ width: `${result.categoryScores[key]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <EmailReportForm result={result} />

      {/* "Ana Sayfa" / "Hemen Başvur" — kaynakta e-posta kutusunun ALTINDA
          bir ayırıcı çizgiyle ayrılmış 2 ek buton daha var (`post-24317.css`,
          `.secondary`/`.primary-outline` — ikisi de canlı ölçülen değerler,
          `.primary-outline` adına rağmen kaynakta DOLU kırmızı zemin
          taşıyor, gerçek outline değil). Önceki turda bu 2 buton hiç
          taşınmamıştı — bulunup eklendi. */}
      <div className="mx-auto mt-10 h-px w-[120px] bg-[rgba(0,0,0,0.8)]" />
      <div className="mt-8 flex items-center justify-center gap-3">
        <a
          href="/"
          className="rounded-lg border border-[rgba(0,0,0,0.6)] px-[18px] py-2.5 text-sm font-semibold text-heading transition hover:border-brand hover:text-brand sm:text-base"
        >
          Ana Sayfa
        </a>
        <a
          href="/online-sunum-talebi/"
          className="rounded-lg bg-brand px-[18px] py-2.5 text-sm font-semibold text-white transition hover:brightness-110 sm:text-base"
        >
          Hemen Başvur
        </a>
      </div>
    </div>
  );
}

export default function HrMaturityTest() {
  const [step, setStep] = useState<Step>('company');
  const [answers, setAnswers] = useState<Record<number, MaturityAnswerValue>>({});
  const [result, setResult] = useState<MaturityResult | null>(null);

  const handleAnswer = (questionId: number, value: MaturityAnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleFinish = (finalAnswers: Record<number, MaturityAnswerValue>) => {
    setResult(calculateMaturityResult(finalAnswers));
    setStep('result');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 font-sans sm:px-6 lg:px-8">
      {step === 'company' && (
        <>
          {/* Hero bölümünün gerçek dikey padding'i (post-23868.css, `dc9ac2c`):
              34/50px mobil, 75/75px tablet (≤1024px), 100/100px masaüstü —
              önceki genel `py-12 lg:py-16` bu bölümde belirgin şekilde azdı
              (bkz. CLAUDE.md 2026-07-29 günlüğü). Quiz/Sonuç adımları kendi
              (daha sade) padding'ini koruyor, yalnızca bu adım kaynağın
              ölçülen hero değerlerini alıyor. */}
          <div className="relative overflow-hidden pb-[50px] pt-[34px] md:pb-[75px] md:pt-[75px] lg:pb-[100px] lg:pt-[100px]">
            <MaturityArcDecoration />
            <CompanyStep onSubmit={() => setStep('quiz')} />
          </div>
          <FiveAreasSection />
          <ChecklistSection />
          <ThreeStepsSection />
          <ResultCardsSection />
          <ClosingCtaSection onSubmit={() => setStep('quiz')} />
        </>
      )}
      {step === 'quiz' && (
        <div className="py-12 lg:py-16">
          <QuizStep answers={answers} onAnswer={handleAnswer} onFinish={handleFinish} />
        </div>
      )}
      {step === 'result' && result && (
        <div className="py-12 lg:py-16">
          <ResultStep result={result} />
        </div>
      )}
    </div>
  );
}
