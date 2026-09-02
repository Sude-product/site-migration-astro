// Azerbaycan dili (az) — sektör sayfaları için TR kaynaktan gerçek/
// profesyonel çeviri (KARAR 1, 2026-08-21). Kaynakta (`sectors.json`)
// az hiç yok — bu dosya `sectorContent.ts`'in `getSectorContent()`'i
// tarafından `it` hero-title-fix'iyle AYNI ilkeyle tüketiliyor. Görsel
// URL'leri/boyutları TR ile BİREBİR aynı (paylaşılan/lokalden bağımsız
// dekoratif varlıklar, kaynakta da öyle — bkz. CLAUDE.md "Görseller
// kasıtlı olarak dokunulmadan bırakılır" ilkesi).
import type { SectorContent } from './sectorContent';

const DEMO_CTA_URL = 'https://idenfit.com/tr/online-sunum-talep-et/';

/** trSlug -> az bare route slug (kaynakta yok, elle atandı — SYNTHETIC_SLUGS ilkesi). */
export const SECTOR_AZ_SLUGS: Record<string, string> = {
  'gida-sektoru-ik-cozumleri': 'qida-sektoru-ik-helleri',
  'guvenlik-sektoru-ik-cozumleri': 'tehlukesizlik-sektoru-ik-helleri',
  'hizmet-sektoru-ik-cozumleri': 'xidmet-sektoru-ik-helleri',
  'turizm-sektoru-ik-cozumleri': 'turizm-sektoru-ik-helleri',
  'perakende-sektoru-ik-cozumleri': 'perakende-sektoru-ik-helleri',
  'enerji-sektoru-ik-cozumleri': 'enerji-sektoru-ik-helleri',
  'saglik-sektoru-ik-cozumleri': 'saglamliq-sektoru-ik-helleri',
  'egitim-sektoru-ik-cozumleri': 'tehsil-sektoru-ik-helleri',
  'tesis-yonetimi-ik-cozumleri': 'obyekt-idareciliyi-ik-helleri',
  'sanayi-otomotiv-ik-cozumleri': 'senaye-avtomobil-ik-helleri',
  'hukuk-danismanlik-burolari-ik-cozumleri': 'huquq-meslehet-burolari-ik-helleri',
  'dagitim-lojistik-ik-cozumleri': 'paylama-logistika-ik-helleri',
};

export const SECTOR_AZ_OVERRIDES: Record<string, SectorContent> = {
  'gida-sektoru-ik-cozumleri': {
    hero: {
      title: 'Qida',
      text: 'İxrac baxımından böyük əhəmiyyətə malik qida sektorunda insanları idarə edin!',
      ctaText: 'İndi Müraciət Et',
      ctaUrl: DEMO_CTA_URL,
      image: { url: '/wp-content/uploads/2025/08/1@2x-2-1.webp', alt: '1@2x 2 1', width: 1240, height: 962 },
    },
    whyIdenfit: {
      title: 'Yerli və beynəlxalq səviyyədə böyük əhəmiyyətə malik qida sektorunda niyə idenfit?',
      text:
        'Qida sektorunda rəqabətin çox yüksək olması və ixtisaslı işçi sayının kifayət qədər olmaması ilə yanaşı, sektorda müəssisələrin iş görmə üsullarına paralel olaraq kənar mənbə və subpodratçı istifadəsinin yaygın olması insan resursları idarəçiliyinin düzgün şəkildə ələ alınmasını tələb edir. idenfit, doğru şəxsin doğru işə yerləşdirilməsindən işçi bağlılığının təməlini təşkil edən onboarding idarəçiliyinə, istedad idarəçiliyindən sonra performans qiymətləndirməsinə qədər uzanan müəssisələrin bütün insan resursları proseslərini tək bir proqram təminatı üzərindən problemsiz idarə etməsinə imkan verir.',
      image: { url: '/wp-content/uploads/2025/08/2@2x-2.webp', alt: '2@2x 2', width: 1381, height: 998 },
    },
    features: [
      {
        title: 'Qida Sektorunda PDKS',
        text: 'Qida sektorunda fəaliyyət göstərən və çoxlu işçiyə malik fabriklərin, istehsal müəssisələrinin və ya soyuq zəncir paylama komandalarının işçi və ya nəqliyyat vasitəsi giriş-çıxış məlumatlarını, icazə, növbə, fasilə qeydlərini və əlavə iş saatlarını əl ilə qeyd etmək çətindir. idenfit ilə bütün personal izləmə prosesini avadanlıq/cihaz dəstəyi ilə asanlıqla idarə edir, hesabat çıxarışları ala bilir, təsdiq proseslərini və davamiyyət izləməsini sürətlə edirsiniz.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/pdks-modulu/',
        image: { url: '/wp-content/uploads/2025/08/sektor-pdks-icon-1.svg', alt: 'sektor pdks icon 1', width: 280, height: 280 },
      },
      {
        title: 'Qida Sektorunda Təlim',
        text: 'Günümüzdə qida sektorunun əhəmiyyəti yerli olduğu qədər ixracatla da yaxından əlaqədardır. Qida sektorunda, növbəli işləyən istehsal işçisindən qida mühəndisinə ən önəmli ünsür istehsal edən, nəzarət edən və paylayan insan resurslarıdır. Sektor yalnız ticarət deyil, sağlamlıq və gigiyena mövzularını da əhatə etdiyindən işçilərin təlim planlamasının diqqətlə edilməsi lazımdır. idenfit təlim modulu ilə çoxlu işçinin fərqli fabrik və müəssisələrdə olsa da təlimlərini planlaya və lazımi təkmilləşdirmələri təşkil edə bilərsiniz.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/calisan-egitim-yonetimi-modulu/',
        image: { url: '/wp-content/uploads/2025/08/sektor-isgucu-icon.svg', alt: 'sektor isgucu icon', width: 280, height: 280 },
      },
      {
        title: 'Qida Sektorunda Növbə İdarəçiliyi',
        text: 'Qida sektoru bir mənada davamlı istehsal etməyi, dolayısilə növbəli işləməyi və buna görə istehsal komandalarının növbələrinin müntəzəm şəkildə planlanmasını tələb edir. idenfit növbə idarəçiliyində, təqvim üzərində növbə planlamasını bütün işçilər üçün görərək növbə üst-üstə düşməsinin qarşısını alırsınız. Lazım olduqda ikili növbə təyin edə və sistemdən hansı növbəyə gəlindiyi məlumatını əldə edə bilərsiniz.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/insan-kaynaklari-isgucu-yonetimi/',
        image: { url: '/wp-content/uploads/2025/08/sektor-pdks-icon-1-1.svg', alt: 'sektor pdks icon 1 1', width: 280, height: 280 },
      },
    ],
  },
  'guvenlik-sektoru-ik-cozumleri': {
    hero: {
      title: 'Təhlükəsizlik Sektoru',
      text: "Müəssisənizin təhlükəsizliyini idenfit-in təqdim etdiyi texnologiya ilə təmin edin!",
      ctaText: 'İndi Müraciət Et',
      ctaUrl: DEMO_CTA_URL,
      image: { url: '/wp-content/uploads/2025/08/1@2x-1-1.png', alt: '1@2x 1 1', width: 1230, height: 965 },
    },
    whyIdenfit: {
      title: 'Texnologiya ilə iç-içə təhlükəsizlik sektorunda niyə idenfit?',
      text:
        "Təhlükəsizlik sektoruna olan ehtiyac xüsusilə son illərdə daha da ayrı bir ehtiyac olaraq qarşımıza çıxır. Təhlükəsizlik sektorunda yetişmiş insan resursları qədər istifadə olunan texnologiya da böyük əhəmiyyət daşıyır. idenfit başdan-başa xidmət təqdim etdiyi insan resursları idarəetmə proqram təminatının yanında, təhlükəsizlik tur nəzarət sistemi Guard ilə də ən yeni texnologiyaları izləyən bir təhlükəsizlik proqramı olaraq bazarda mövcud olan və ya yeni çıxan bir çox avadanlıq və cihaza tam inteqrasiya olur.",
      image: { url: '/wp-content/uploads/2025/08/2@2x-3.png', alt: '2@2x 3', width: 1693, height: 1005 },
    },
    features: [
      {
        title: 'Təhlükəsizlik Sektorunda Növbə İdarəçiliyi',
        text: 'Təhlükəsizlik sektorunda iş gecə-gündüz davam etdiyi üçün effektiv bir növbə planlaması şərtdir. Növbələrin nəzarəti və üst-üstə düşməsini əl ilə əngəlləmək isə olduqca çətindir. idenfit növbə idarəçiliyində, təqvim üzərində növbə planlamasını bütün işçilər üçün görərək növbə üst-üstə düşməsinin qarşısını alırsınız. Lazım olduqda ikili növbə təyin edə və sistemdən hansı növbəyə gəlindiyi məlumatını əldə edə bilərsiniz.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/insan-kaynaklari-isgucu-yonetimi/',
        image: { url: '/wp-content/uploads/2025/08/sektor-vardiya-icon.svg', alt: 'sektor vardiya icon', width: 280, height: 280 },
      },
      {
        title: 'Təhlükəsizlik Sektorunda Tur Nəzarət Sistemləri',
        text: 'Təhlükəsizlik sektorunda patrullar və tur nəzarətlərinin son texnologiya cihazları ilə edilməsi təhlükəsizlik baxımından olduqca əhəmiyyətlidir. idenfit təhlükəsizlik tur nəzarət sistemi Guard ilə, menecerlər hansı personalın, hansı turda olduğunu, əskik atılan turları, yarımçıq qalan turları real zamanlı olaraq görə bilər. Beləliklə sahədəki bütün hadisələrdən xəbərdar ola bilər, hadisələri anlıq olaraq izləyər və idarə edərlər.',
        ctaText: 'baxın >',
        ctaUrl: 'https://guardware.co/',
        image: { url: '/wp-content/uploads/2025/08/sektor-guvenlik-icon.svg', alt: 'sektor guvenlik icon', width: 280, height: 280 },
      },
    ],
  },
  'hizmet-sektoru-ik-cozumleri': {
    hero: {
      title: 'Xidmət',
      text: 'Xidmət keyfiyyətinin müştəri məmnunluğu demək olduğu xidmət sektorunda insan resurslarını idenfit ilə idarə edin!',
      ctaText: 'İndi Müraciət Et',
      ctaUrl: DEMO_CTA_URL,
      image: { url: '/wp-content/uploads/2025/08/1@2x-1.png', alt: '1@2x 1', width: 1460, height: 1203 },
    },
    whyIdenfit: {
      title: 'Müştəri məmnunluğu demək olan xidmət sektorunda niyə idenfit?',
      text:
        'Xidmət sektorundakı hər iş müştəri məmnunluğuna, dolayısilə bu xidməti göstərən təlimli və xoşbəxt işçilərə bağlıdır. Xidmət keyfiyyətinin yüksəlməsində doğru şəxsin işə götürülməsi, doğru işə yerləşdirilməsi, işçi təlimi və performans qiymətləndirməsi kimi bir çox mövzuda sürətli olub rəqabət üstünlüyü əldə edilməlidir. idenfit xidmət sektorunda insan resursları proseslərini işə qəbuldan vaxt & icazə idarəçiliyinə qədər başdan-başa idarə etməyinizi təmin edir.',
      image: { url: '/wp-content/uploads/2025/08/2@2x-2.png', alt: '2@2x 2', width: 1773, height: 984 },
    },
    features: [
      {
        title: 'Xidmət Sektorunda PDKS',
        text: 'Xidmət sektorunda fəaliyyət göstərən və çoxlu işçiyə malik iş yerlərinin və emalatxanaların işçi giriş-çıxış məlumatlarını, icazə, növbə, fasilə qeydlərini və əlavə iş saatlarını əl ilə qeyd etmək çətindir. idenfit ilə bütün personal izləmə prosesini avadanlıq/cihaz dəstəyi ilə asanlıqla idarə edir, hesabat çıxarışları ala bilir, təsdiq proseslərini və davamiyyət izləməsini sürətlə edirsiniz.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/puantaj-takip-programi-modulu/',
        image: { url: '/wp-content/uploads/2025/08/sektor-pdks-icon-2.svg', alt: 'sektor pdks icon 2', width: 280, height: 280 },
      },
      {
        title: 'Xidmət Sektorunda Təlim',
        text: 'Günümüzdə xidmət sektorunun əhəmiyyəti yerli olduğu qədər turizm kimi sektorlarda işçilər ölkə markasını təmsil etdiyindən beynəlxalq əhəmiyyəti də böyükdür. Xidmət sektorunda, növbəli işləyən xidmət işçisindən daha ixtisaslı işçi olan gəmi kapitanına qədər ən önəmli ünsür əmək verən və nəzarət edən insan resurslarıdır. Sektor yalnız gəlir olaraq deyil, nüfuz və keyfiyyət kimi mövzuları da əhatə etdiyindən işçilərin təlim planlamasının diqqətlə edilməsi lazımdır. idenfit təlim modulu ilə çoxlu işçinin fərqli xidmət sahələrində olsa da təlimlərini planlaya və lazımi təkmilləşdirmələri təşkil edə bilərsiniz.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/calisan-egitim-yonetimi-modulu/',
        image: { url: '/wp-content/uploads/2025/08/sektor-ise-alim-icon.svg', alt: 'sektor ise alim icon', width: 280, height: 280 },
      },
      {
        title: 'Xidmət Sektorunda Növbə İdarəçiliyi',
        text: 'Xidmət sektoru bir mənada davamlı işlər olmağı, əmək-tutumlu olması dolayısilə növbəli işləməyi və buna görə xidmət komandalarının növbələrinin müntəzəm şəkildə planlanmasını tələb edir. idenfit növbə idarəçiliyində, təqvim üzərində növbə planlamasını bütün işçilər üçün görərək növbə üst-üstə düşməsinin qarşısını alırsınız. Lazım olduqda ikili növbə təyin edə və sistemdən hansı növbəyə gəlindiyi məlumatını əldə edə bilərsiniz.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/insan-kaynaklari-isgucu-yonetimi/',
        image: { url: '/wp-content/uploads/2025/08/sektor-egitim-icon.svg', alt: 'sektor egitim icon', width: 280, height: 280 },
      },
      {
        title: 'Xidmət Sektorunda İşə Qəbul',
        text: 'Məşğulluğun və işə qəbulun çox yoğun olduğu xidmət sektorunda çox mərhələli bir iş prosesi olan işə qəbul mövzusunda insan resursları departamentlərinin üzərindəki yük fazladır. idenfit ilə işə qəbul prosesində CV hovuzlarının yaradılmasından son mərhələ olan əmək müqaviləsinə qədər bütün mərhələləri problemsiz planlaya bilərsiniz.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/ise-alim-modulu/',
        image: { url: '/wp-content/uploads/2025/08/sektor-boarding-icon.svg', alt: 'sektor boarding icon', width: 280, height: 280 },
      },
    ],
  },
  'turizm-sektoru-ik-cozumleri': {
    hero: {
      title: 'Turizm',
      text: 'Turizm sektorunun əsl gücü olan "insan resurslarını" idenfit ilə idarə edin!',
      ctaText: 'İndi Müraciət Et',
      ctaUrl: DEMO_CTA_URL,
      image: { url: '/wp-content/uploads/2025/08/1@2x-1-2.png', alt: '1@2x 1 2', width: 1264, height: 952 },
    },
    whyIdenfit: {
      title: 'Əsas gücü insan resursları olan turizm sektorunda niyə idenfit?',
      text:
        'idenfit, personal dövriyyəsi yüksək, işə qəbul həcminin çox olduğu, dolayısilə təlim və inkişafın böyük əhəmiyyət qazandığı, insan yönümlü turizm sektorundakı otellərin, istirahət kəndlərinin insan resurslarını işə qəbuldan təlim planlamasına, icazə & vaxt idarəçiliyindən performans qiymətləndirməsinə qədər başdan-başa idarə etməyinizi təmin edir.',
      image: { url: '/wp-content/uploads/2025/08/2@2x-1-1.png', alt: '2@2x 1 1', width: 1756, height: 1173 },
    },
    features: [
      {
        title: 'Turizm Sektorunda İşə Qəbul',
        text: 'Turizm sektorunda işə qəbul insan resursları departamentlərindəki iş yükünün böyük bir hissəsini təşkil edir. İşə qəbul prosesi çox mərhələli əməliyyatları əhatə etdiyi üçün bu qədər yüksək həcmli personal qəbulunu əl ilə sistemlərlə etmək olduqca çətindir. idenfit işə qəbul prosesində başdan-sona əldə edilən bütün məlumatları eyni paneldə tapmağınızı təmin edəcək şəkildə dizayn edilmişdir.',
        ctaText: '',
        ctaUrl: '',
        image: { url: '/wp-content/uploads/2025/08/sektor-ise-alim-icon.svg', alt: 'sektor ise alim icon', width: 280, height: 280 },
      },
      {
        title: 'Turizm Sektorunda Təlim',
        text: 'Turizm sektorunda işə qəbul həcminin yüksək olması bərabərində müntəzəm bir təlim planlamasını da gətirir. idenfit işə qəbul edilən personalın təlimlərinin planlanması, təlimçilərin müvafiq təlimə təyin edilməsi kimi əməliyyatları müntəzəm şəkildə etməyinizi təmin edir.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/calisan-egitim-yonetimi-modulu/',
        image: { url: '/wp-content/uploads/2025/08/sektor-egitim-icon.svg', alt: 'sektor egitim icon', width: 280, height: 280 },
      },
      {
        title: 'Turizm Sektorunda Vaxt & İcazə İdarəçiliyi',
        text: 'Böyük bir insan resurslarını idarə etmək məcburiyyətində qalan otel müəssisələrinin və istirahət kəndlərinin, personallarının növbə və icazə idarəçiliklərini daha asan və sürətli edə bilmək üçün avtomatlaşdırılmış sistemlərə ehtiyacı var. idenfit, toplu əməliyyatları asanlıqla idarə edə biləcəyiniz vaxt & icazə idarəçiliyini tək proqramda istifadəçilərin xidmətinə təqdim edir.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/yillik-izin-takip-programi/',
        image: { url: '/wp-content/uploads/2025/08/sektor-pdks-icon-2.svg', alt: 'sektor pdks icon 2', width: 280, height: 280 },
      },
      {
        title: 'Turizm Sektorunda Tapşırıq & Nəzarət',
        text: 'Ağ yaxalının yanında mavi yaxalının da çox olduğu turizm sektorunda doğru işə doğru şəxslərin yerləşdirilməsi, tapşırıq təyinatlarının uyğun şəkildə edilməsi və edilən tapşırıqların yerində və ya sübutlarla nəzarət edilməsi iş axınının problemsiz irəliləməsi baxımından əhəmiyyətlidir. idenfit tapşırıq və nəzarət modulları ilə iş axınının başdan-sona vaxtında və keyfiyyətli olmasını təmin edir.',
        ctaText: '',
        ctaUrl: '',
        image: { url: '/wp-content/uploads/2025/08/sektor-task-icon.svg', alt: 'sektor task icon', width: 280, height: 280 },
      },
    ],
  },
  'perakende-sektoru-ik-cozumleri': {
    hero: {
      title: 'Pərakəndə',
      text: 'Pərakəndə sektorundakı sürətə və dəyişikliyə idenfit ilə uyğunlaşın!',
      ctaText: 'İndi Müraciət Et',
      ctaUrl: DEMO_CTA_URL,
      image: { url: '/wp-content/uploads/2025/08/1@2x-2.png', alt: '1@2x 2', width: 1384, height: 1072 },
    },
    whyIdenfit: {
      title: 'Rəqabət Yönümlü Pərakəndə Sektorunda Niyə idenfit?',
      text:
        'idenfit pərakəndə sektorunda fəaliyyət göstərən köklü şirkət və KOB-ların; PDKS, icazə & vaxt idarəçiliyi, işə qəbul və personal təlimi kimi sürətli və dinamik olması lazım olan əməliyyatları əhatə edərək insan resurslarını tək platforma altında başdan-başa idarə etmələrini təmin edir. Qidadan kosmetikaya, supermarket zəncirlərindən tekstilə qədər pərakəndə sektorunun bir çox şirkətində idenfit İK proseslərini nizamlayır, sürətləndirir və rəqabət üstünlüyünü artırır.',
      image: { url: '/wp-content/uploads/2025/08/2@2x-2-1.png', alt: '2@2x 2 1', width: 1828, height: 870 },
    },
    features: [
      {
        title: 'Pərakəndə Sektorunda Onboarding & Offboarding',
        text: 'Dinamik strukturu ilə öndə gedən pərakəndə sektoru, gənc əhalinin dövriyyəsinin çox olması səbəbiylə işə girişin, işdən çıxışın və şirkət dəyişdirmənin ən çox görüldüyü sektorlardandır. Bu prosesi idenfit ilə avtomatlaşdıraraq lazımsız iş yükündən qurtulursunuz.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/onboarding-modulu/',
        image: { url: '/wp-content/uploads/2025/08/sektor-boarding-icon.svg', alt: 'sektor boarding icon', width: 280, height: 280 },
      },
      {
        title: 'Pərakəndə Sektorunda İşə Qəbul',
        text: 'Xüsusilə 18-30 yaş qrupu namizədlərin üstünlük verdiyi pərakəndə sektorunda gənc istedadların kəşf edilməsi, müəssisəyə qəbul edilməsi və fərdiləşdirilmiş imkan paketləri ilə müəssisədə saxlanılması mövzuları olduqca əhəmiyyətlidir. İşə qəbulun bütün mərhələlərində idenfit prosesi problemsiz idarə etməyinizi təmin edir.',
        ctaText: '',
        ctaUrl: '',
        image: { url: '/wp-content/uploads/2025/08/sektor-egitim-icon.svg', alt: 'sektor egitim icon', width: 280, height: 280 },
      },
      {
        title: 'Pərakəndə Sektorunda PDKS',
        text: 'Pərakəndə sektoru mağazaçılıqdan AVM idarəçiliyinə qədər uzanan geniş bir sahəni əhatə edir. idenfit fərqli lokasiyalardakı mağazalarda PDKS ilə işçilərin giriş-çıxış məlumatları, icazə, növbə, fasilə qeydləri və əlavə iş saatları qeyd altına alına bilər və davamiyyət izləməsi bu məlumatlar daxilində sürətlə edilə bilər.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/pdks-modulu/',
        image: { url: '/wp-content/uploads/2025/08/sektor-vardiya-icon.svg', alt: 'sektor vardiya icon', width: 280, height: 280 },
      },
    ],
  },
  'enerji-sektoru-ik-cozumleri': {
    hero: {
      title: 'Enerji Sektoru',
      text: 'Enerjisini işçidən alan insan yönümlü enerji sektorunda insan resurslarını və işçi qüvvəsini idenfit ilə planlayın!',
      ctaText: 'İndi Müraciət Et',
      ctaUrl: DEMO_CTA_URL,
      image: { url: '/wp-content/uploads/2025/08/1@2x-1-1-1.png', alt: '1@2x 1 1 1', width: 1157, height: 1011 },
    },
    whyIdenfit: {
      title: 'Hər keçən gün strateji əhəmiyyət qazanan enerji sektorunda niyə idenfit?',
      text:
        'Enerji sektoru həm strateji, həm də iqtisadi baxımdan ölkələrin sahib olduğu ən önəmli sektorların başında gəlir. Buna görə, enerji sektorunu ayaqda saxlayan insan resurslarının və işçi qüvvəsinin də ən səmərəli şəkildə mövqeləndirilməsi lazımdır. idenfit ilə işçilərin İK proseslərini başdan-başa idarə edərkən növbə planlamalarını, vaxt & icazə idarəçiliklərini də eyni proqram üzərindən edə bilərsiniz.',
      image: { url: '/wp-content/uploads/2025/08/2@2x-3-1.png', alt: '2@2x 3 1', width: 1488, height: 1131 },
    },
    features: [
      {
        title: 'Enerji Sektorunda Növbə İdarəçiliyi',
        text: 'Növbəli sistemlə işləyən enerji müəssisələrində ən böyük problemlərdən olan üst-üstə düşən növbələr və iş saatları, işçi sayı da çox olduqda içindən çıxılmaz bir hal ala bilər. idenfit ilə ağıllı növbə idarəçiliyində, növbələr sabit və çevik növbə olaraq kateqoriyalaşdırıla bilər və bir işçiyə eyni gün ərzində birdən çox dövriyyəli növbə təyinatı edilə bilər.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/insan-kaynaklari-isgucu-yonetimi/',
        image: { url: '/wp-content/uploads/2025/08/sektor-vardiya-icon.svg', alt: 'sektor vardiya icon', width: 280, height: 280 },
      },
      {
        title: 'Enerji Sektorunda Növbə İdarəçiliyi',
        text: 'Növbəli sistemlə işləyən enerji müəssisələrində ən böyük problemlərdən olan üst-üstə düşən növbələr və iş saatları, işçi sayı da çox olduqda içindən çıxılmaz bir hal ala bilər. idenfit ilə ağıllı növbə idarəçiliyində, növbələr sabit və çevik növbə olaraq kateqoriyalaşdırıla bilər və bir işçiyə eyni gün ərzində birdən çox dövriyyəli növbə təyinatı edilə bilər.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/calisan-performans-degerlendirme-sistemi-modulu/',
        image: { url: '/wp-content/uploads/2025/08/sektor-performans-icon.svg', alt: 'sektor performans icon', width: 280, height: 280 },
      },
      {
        title: 'Enerji Sektorunda PDKS',
        text: 'Enerji sektorunda fəaliyyət göstərən və çoxlu işçiyə malik müəssisələrin işçi giriş-çıxış məlumatlarını, icazə, növbə, fasilə qeydlərini və əlavə iş saatlarını əl ilə qeyd altına alması çətindir. idenfit ilə bütün personal izləmə prosesini asanlıqla idarə edir, hesabat çıxarışları ala bilir, təsdiq proseslərini və davamiyyət izləməsini sürətlə edirsiniz.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/pdks-modulu/',
        image: { url: '/wp-content/uploads/2025/08/sektor-pdks-icon-2.svg', alt: 'sektor pdks icon 2', width: 280, height: 280 },
      },
      {
        title: 'Enerji Sektorunda İşə Qəbul',
        text: 'Məşğulluğun və işə qəbulun çox yoğun olduğu enerji sektorunda çox mərhələli bir iş prosesi olan işə qəbul mövzusunda insan resursları departamentlərinin üzərindəki yük fazladır. idenfit ilə işə qəbul prosesində CV hovuzlarının yaradılmasından son mərhələ olan əmək müqaviləsinə qədər bütün mərhələləri problemsiz planlaya bilərsiniz.',
        ctaText: '',
        ctaUrl: '',
        image: { url: '/wp-content/uploads/2025/08/sektor-ise-alim-icon.svg', alt: 'sektor ise alim icon', width: 280, height: 280 },
      },
    ],
  },
  'saglik-sektoru-ik-cozumleri': {
    hero: {
      title: 'Sağlamlıq Sektoru',
      text: 'İstehsaldan son istehlakçıya qədər hər mərhələdə gücünü insandan alıb insana verən sağlamlıq sektorundakı işçi qüvvəsini idenfit ilə idarə edin!',
      ctaText: 'İndi Müraciət Et',
      ctaUrl: DEMO_CTA_URL,
      image: { url: '/wp-content/uploads/2025/08/1@2x-3.png', alt: '1@2x 3', width: 1300, height: 821 },
    },
    whyIdenfit: {
      title: 'Rəqabətin ən yüksək yaşandığı sektorlardan olan sağlamlıq sektorunda niyə idenfit?',
      text:
        'Xəstəxana, əczaçılıq, tibbi ləvazimatlar kimi bir çox sahədə fəaliyyət göstərən sağlamlıq sektorunda, insan resursları idarəçiliyi böyük əhəmiyyət daşıyır. Xüsusilə ixtisaslı işçi tapmağın çətin olduğu, işçi dövriyyəsinin və tükənmişlik sindromunun çox olduğu sağlamlıq sektorunda İK departamentlərinə böyük məsuliyyətlər düşür. idenfit artıq iş yükü çox olan İK departamentinin proseslərini əl üsulundan rəqəmsala daşıyaraq İK prosesi idarəçiliyini asanlaşdırır.',
      image: { url: '/wp-content/uploads/2025/08/2@2x-4.png', alt: '2@2x 4', width: 1495, height: 830 },
    },
    features: [
      {
        title: 'Sağlamlıq Sektorunda İnsan Resursları İdarəçiliyi',
        text: 'idenfit ilə performans qiymətləndirməsindən, icazə izləməsinə və əlavə haqlara qədər bütün insan resursları proseslərini tək bir platformada idarə edə bilərsiniz. idenfit, insan resursları idarəçiliyində bütün ehtiyaclarınızı qarşılayacaq şəkildə dizayn edilmişdir.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/insan-kaynaklari-yonetimi-modulu/',
        image: { url: '/wp-content/uploads/2025/08/sektor-ik-icon.svg', alt: 'sektor ik icon', width: 280, height: 280 },
      },
      {
        title: 'Sağlamlıq Sektorunda PDKS',
        text: 'Sağlamlıq sektorunda fəaliyyət göstərən və çoxlu işçiyə malik xəstəxanaların və ya xüsusi müəssisələrin işçi giriş-çıxış məlumatlarını, icazə, növbə, fasilə qeydlərini və əlavə iş saatlarını əl ilə qeyd altına almaq çətindir. idenfit ilə bütün personal izləmə prosesini avadanlıq/cihaz dəstəyi ilə asanlıqla idarə edir, hesabat çıxarışları ala bilir, təsdiq proseslərini və davamiyyət izləməsini sürətlə edirsiniz.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/pdks-modulu/',
        image: { url: '/wp-content/uploads/2025/08/sektor-isgucu-icon.svg', alt: 'sektor isgucu icon', width: 280, height: 280 },
      },
    ],
  },
  'egitim-sektoru-ik-cozumleri': {
    hero: {
      title: 'Təhsil Sektoru',
      text: 'Təhsil sektorunda rəqabət üstünlüyünü idenfit ilə əldə edin!',
      ctaText: 'İndi Müraciət Et',
      ctaUrl: DEMO_CTA_URL,
      image: { url: '/wp-content/uploads/2025/08/1@2x-4.png', alt: '1@2x 4', width: 1347, height: 872 },
    },
    whyIdenfit: {
      title: 'Gənc əhali ilə böyüyən və məşğulluğun yoğun olduğu təhsil sektoru üçün niyə idenfit?',
      text:
        'Gənc əhaliyə paralel olaraq böyüyən və insan resursları idarəçiliyində rəqabətin yoğun olduğu təhsil sektorunda gənc istedadların kəşf edilməsi və işə qəbullar, onboarding-offboarding prosesləri, performans idarəçiliyi kimi mövzular rəqabət üstünlüyü baxımından əhəmiyyət qazanır. idenfit təhsil sektorunda insan resursları proseslərini şəxsi fayl saxlamaqdan vaxt & icazə idarəçiliyinə qədər başdan-başa idarə etməyinizi təmin edir.',
      image: { url: '/wp-content/uploads/2025/08/2@2x-5.png', alt: '2@2x 5', width: 1516, height: 920 },
    },
    features: [
      {
        title: 'Təhsil Sektorunda PDKS',
        text: 'Təhsil sektoru ibtidai təhsildən universitetə, xüsusi təhsil müəssisələrindən istedad mərkəzlərinə qədər həyatımızın hər sahəsində iç-içə olduğumuz bir sektordur. Məşğulluğun bu qədər yoğun olduğu bir sektorda personal izləməsi də böyük əhəmiyyət daşıyır. idenfit personal davamiyyət nəzarət sistemi ilə işçilərin giriş-çıxış məlumatlarını, icazə, növbə, fasilə qeydlərini və əlavə iş saatlarını qeyd altına ala bilər, hesabat çıxarışları ala bilər, təsdiq proseslərini və davamiyyət izləməsini asanlıqla idarə edirsiniz.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/pdks-modulu/',
        image: { url: '/wp-content/uploads/2025/08/sektor-pdks-icon-2.svg', alt: 'sektor pdks icon 2', width: 280, height: 280 },
      },
      {
        title: 'Təhsil Sektorunda İK İdarəçiliyi',
        text: 'Məşğulluğun daim artdığı və işə qəbul həcminin çox olduğu təhsil sektorunda idenfit ilə şəxsi fayl saxlamaqdan işə qəbula, təlim planlamasından performans qiymətləndirməsinə qədər bütün İK proseslərini başdan-başa asanlıqla idarə edə bilərsiniz.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/insan-kaynaklari-isgucu-yonetimi/',
        image: { url: '/wp-content/uploads/2025/08/sektor-ik-icon.svg', alt: 'sektor ik icon', width: 280, height: 280 },
      },
    ],
  },
  'tesis-yonetimi-ik-cozumleri': {
    hero: {
      title: 'Obyekt İdarəçiliyi',
      text: 'Obyekt idarəçiliyinin hərəkətverici gücü olan insan resurslarını və işçi qüvvəsini idenfit ilə idarə edin!',
      ctaText: 'İndi Müraciət Et',
      ctaUrl: DEMO_CTA_URL,
      image: { url: '/wp-content/uploads/2025/08/1@2x-5.png', alt: '1@2x 5', width: 1478, height: 864 },
    },
    whyIdenfit: {
      title: 'Lokomotiv gücü insan olan müasir obyekt idarəçiliyində niyə idenfit?',
      text:
        'İnvestisiya qərarının verilməsi mərhələsindən başlayaraq obyektin bütün həyat dövrü boyunca ağla gələ biləcək hər növ proses və ünsür ki, bunlar, təchizat zənciri və ehtiyat idarəçiliyi, enerji planlaması, informasiya texnologiyaları və texniki xidmətlər ilə baxım-təmir fəaliyyətləri, ətraf mühit və landşaft düzənləməsi, təmizlik və tullantı idarəçiliyi, yanğın planlaması, təhlükəsizlik, böhran idarəçiliyi, nəqliyyat və avtodayanacaqlar, catering xidmətləri, insan resursları tətbiqləri, əməyin mühafizəsi və təhlükəsizliyi fəaliyyətlərinin hamısı müasir obyekt idarəçiliyinə daxildir. Bu geniş çeşidlilik, bütün bu proseslərdə yer alan insan resurslarının doğru və problemsiz şəkildə planlanmasını tələb edir.',
      image: { url: '/wp-content/uploads/2025/08/2@2x-6.png', alt: '2@2x 6', width: 1766, height: 1024 },
    },
    features: [
      {
        title: 'Obyekt İdarəçiliyində Təhlükəsizlik',
        text: 'Obyektlər üçün ən önəmli digər bir mövzu da təhlükəsizlik idarəçiliyidir. idenfit təhlükəsizlik tur nəzarət sistemi Guard menecerlərin hansı personalın, hansı turda olduğunu, əskik atılan turları, yarımçıq qalan turları real zamanlı olaraq görməsini təmin edir. Beləliklə menecerlər sahədəki bütün hadisələrdən xəbərdar ola bilər və hadisələrə anında müdaxilə edə bilərlər.',
        ctaText: 'baxın >',
        ctaUrl: 'https://guardware.co/',
        image: { url: '/wp-content/uploads/2025/08/sektor-pdks-icon-2.svg', alt: 'sektor pdks icon 2', width: 280, height: 280 },
      },
      {
        title: 'Obyekt İdarəçiliyində Tapşırıq & Nəzarət',
        text: 'Obyekt idarəçiliyində çətin mövzulardan bir digəri də çox fərqli sahələrdə edilən tapşırıq təyinatları, edilən tapşırıqların keyfiyyəti və bu tapşırıqların nəzarətidir. idenfit Tapşırıq (Task) və Nəzarət (Audit) proqramları ilə personal tapşırıq təyinatlarını və nəzarətlərini əlavə proqramlara ehtiyac duymadan bulud platformasından idarə edərkən, vaxtdan və əməliyyat xərclərindən qənaət edərsiniz.',
        ctaText: '',
        ctaUrl: '',
        image: { url: '/wp-content/uploads/2025/08/sektor-isgucu-icon.svg', alt: 'sektor isgucu icon', width: 280, height: 280 },
      },
    ],
  },
  'sanayi-otomotiv-ik-cozumleri': {
    hero: {
      title: 'Sənaye & Avtomobil',
      text: 'Fərqli ölçülərdə çoxlu müəssisəni özündə barındıran sənaye və avtomobil sektorlarında insan resurslarını idenfit ilə idarə edin!',
      ctaText: 'İndi Müraciət Et',
      ctaUrl: DEMO_CTA_URL,
      image: { url: '/wp-content/uploads/2025/08/1@2x-3.webp', alt: '1@2x 3', width: 1144, height: 954 },
    },
    whyIdenfit: {
      title: 'Qlobal rəqabətin yoğun yaşandığı sənaye və avtomobil sektorlarında niyə idenfit?',
      text:
        'Sənaye və avtomobil sektorları, qlobal rəqabətin yoğun yaşandığı sektorlardandır. Məhsulların texnoloji yeniliyi və dizayn uğuru ilə yanaşı təşkilat, işçilər və təlim sektorun ən önəmli mövzularının başında gəlir. Sənaye və avtomobil sektorlarında xüsusilə istehsal və baxım tərəfində məşğulluq nisbəti yüksəkdir, dolayısilə işçi sayı da fazladır. idenfit bu qədər böyük təşkilat strukturlarında, işə qəbuldan təlim planlamasına, personal izləməsindən performans qiymətləndirməsinə qədər insan resursları idarəçiliyini tək platformada başdan-başa etməyinizə imkan verir.',
      image: { url: '/wp-content/uploads/2025/08/2@2x-4.webp', alt: '2@2x 4', width: 1494, height: 842 },
    },
    features: [
      {
        title: 'Sənaye Sektorunda İnsan Resursları İdarəçiliyi',
        text: 'Sənaye sektoru kimi böyük miqyaslı təşkilat strukturlarında idenfit ilə tək proqramla insan resurslarını və işçi qüvvəsini başdan-başa idarə edə bilərsiniz.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/insan-kaynaklari-yonetimi-modulu/',
        image: { url: '/wp-content/uploads/2025/08/sektor-ik-icon.svg', alt: 'sektor ik icon', width: 280, height: 280 },
      },
      {
        title: 'Sənaye Sektorunda İşçi Qüvvəsi İdarəçiliyi',
        text: 'idenfit, vaxt və növbə idarəçiliyini, icazə və davamiyyət hesablamalarını ən asan və effektiv şəkildə etməyinizi təmin edən proqramı ilə işçi qüvvəsi idarəçiliyinizi daha səmərəli şəkildə planlamağınızı təmin edir.',
        ctaText: 'baxın >',
        ctaUrl: '#https://idenfit.com/tr/insan-kaynaklari-isgucu-yonetimi/',
        image: { url: '/wp-content/uploads/2025/08/sektor-isgucu-icon.svg', alt: 'sektor isgucu icon', width: 280, height: 280 },
      },
    ],
  },
  'hukuk-danismanlik-burolari-ik-cozumleri': {
    hero: {
      title: 'Hüquq - Məsləhət Büroları',
      text: 'Departamentləşmənin yayıldığı hüquq bürolarında insan resursları idarəçiliyini idenfit ilə planlayın!',
      ctaText: 'İndi Müraciət Et',
      ctaUrl: DEMO_CTA_URL,
      image: { url: '/wp-content/uploads/2025/08/1@2x-1-3.png', alt: '1@2x 1 3', width: 1230, height: 970 },
    },
    whyIdenfit: {
      title: 'İK idarəçiliyində avtomatlaşmaya keçən hüquq bürolarında niyə idenfit?',
      text:
        'Son illərdə geniş kadrlarla işləməyə başlayan və sayları sürətlə artan hüquq bürolarında, insan resursları idarəçiliyi olduqca vaxt alan bir iş yükünə çevrilməyə başlamışdır. Öz İK idarəçilikləri yanında məsləhət verdikləri müəssisələrin də İK idarəçiliyi ilə maraqlanan hüquq bürolarında əl ilə iş yükünü azaltmaq üçün İK proqramı istifadə etmək məcburi hala gəlir. idenfit İK proqramı, işə qəbuldan təlim planlamasına, personal izləməsindən performans qiymətləndirməsinə qədər insan resursları idarəçiliyini tək platformada başdan-başa etməyinizə imkan verir.',
      image: { url: '/wp-content/uploads/2025/08/2@2x-1-2.png', alt: '2@2x 1 2', width: 1562, height: 966 },
    },
    features: [
      {
        title: 'Hüquq Bürolarında Sənəd İdarəçiliyi',
        text: 'Hüquq bürolarında İK sahəsində ən çox iş yükü yaradan sahə şübhəsiz şəxsi fayllar və sənəd idarəçiliyidir. idenfit şəxsi fayl modulu ilə, işçiyə aid; əmək müqaviləsi, işə qəbul və icazə sənədləri, maliyyə sənədləri, iş müddətində aldığı sənədlər kimi bütün rəsmi sənəd və qeydləri onlayn sistemdə biometrik imza ilə təsdiqlənmiş olaraq saxlanıla bilər.',
        ctaText: '',
        ctaUrl: '',
        image: { url: '/wp-content/uploads/2025/08/sektor-evrak-icon.svg', alt: 'sektor evrak icon', width: 280, height: 280 },
      },
      {
        title: 'Hüquq Bürolarında İşə Qəbul',
        text: 'Hüquq şirkətlərinin məsləhət verdikləri müəssisələrin məsləhət çərçivəsində gözlədiyi xidmətlərdən biri də işə qəbuldur. Fərqli miqyaslarda çoxlu müəssisəyə xidmət göstərən hüquq bürolarının çox mərhələli bir proses olan işə qəbulu əl ilə idarə etməsi çox çətindir. idenfit işə qəbul modulu, işə qəbul prosesində başdan-sona əldə edilən bütün məlumatları eyni paneldə tapmağınızı və əlavələr etməyinizi təmin edəcək şəkildə dizayn edilmişdir.',
        ctaText: '',
        ctaUrl: '',
        image: { url: '/wp-content/uploads/2025/08/sektor-egitim-icon.svg', alt: 'sektor egitim icon', width: 280, height: 280 },
      },
    ],
  },
  'dagitim-lojistik-ik-cozumleri': {
    hero: {
      title: 'Paylama & Logistika',
      text: 'Fərqli məhsul qruplarının, fərqli lokasiyalardakı təchizat, anbarlama, paylama və satış proseslərində işçi qüvvəsini idenfit ilə idarə edin!',
      ctaText: 'İndi Müraciət Et',
      ctaUrl: DEMO_CTA_URL,
      image: { url: '/wp-content/uploads/2025/08/1@2x-1-1-2.png', alt: '1@2x 1 1 2', width: 1434, height: 960 },
    },
    whyIdenfit: {
      title: 'Fərqli Lokasiyalarda İşləməyi Tələb Edən Paylama və Logistika Sektorlarında Niyə idenfit?',
      text:
        'Paylama və logistika sektorları fərqli lokasiyalarda və davamlı hərəkət halında olan işçilər deməkdir. Bu sektorlarda vəzifə alan İK departamentləri üçün üst-üstə düşən növbələr, vaxt & icazə idarəçiliyində meydana gələn problemlər, təlim çatışmazlığı mövzuları olduqca çətindir. idenfit, fərqli yerlərdə olan və bir çox filialla işləyən paylama sektorunda işçi qüvvəsini problemsiz idarə etməyinizə imkan verir.',
      image: { url: '/wp-content/uploads/2025/08/2@2x-1-1.webp', alt: '2@2x 1 1', width: 1593, height: 1008 },
    },
    features: [
      {
        title: 'Paylama Sektorunda Növbə İdarəçiliyi',
        text: 'Paylama sektoru bir mənada davamlı yolda olmağı, dolayısilə növbəli işləməyi və buna görə paylama komandasının növbələrinin müntəzəm şəkildə planlanmasını tələb edir. idenfit növbə idarəçiliyində, təqvim üzərində növbə planlamasını bütün işçilər üçün görərək növbə üst-üstə düşməsinin qarşısını alırsınız. Lazım olduqda ikili növbə təyin edə və sistemdən hansı növbəyə gəlindiyi məlumatını əldə edə bilərsiniz.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/insan-kaynaklari-isgucu-yonetimi/',
        image: { url: '/wp-content/uploads/2025/08/sektor-vardiya-icon.svg', alt: 'sektor vardiya icon', width: 280, height: 280 },
      },
      {
        title: 'Paylama Sektorunda Təlim',
        text: 'Günümüzdə e-ticarətin əhəmiyyəti paylama sektorunun da əhəmiyyətini müəyyən edir. Karqolar və paylama şirkətlərinin ən önəmli nümayəndələri isə karqo işçiləri, yəni insan resurslarıdır. Marka qavrayışına birbaşa təsir edən paylama işçilərinin təlim planlamasının diqqətlə edilməsi lazımdır. idenfit təlim modulu ilə çoxlu işçinin fərqli filiallarda olsa da təlimlərini planlaya və lazımi təkmilləşdirmələri təşkil edə bilərsiniz.',
        ctaText: 'baxın >',
        ctaUrl: 'https://idenfit.com/tr/calisan-egitim-yonetimi-modulu/',
        image: { url: '/wp-content/uploads/2025/08/sektor-egitim-icon.svg', alt: 'sektor egitim icon', width: 280, height: 280 },
      },
    ],
  },
};
