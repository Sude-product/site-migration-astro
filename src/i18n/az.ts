import type { Translations } from './types';

// Azerbaycan dili (az) — TR kaynaktan gerçek, profesyonel çeviri (KARAR 1).
// Ana kaynak `tr.ts`'in birebir aynı şemasını takip eder.
export const az: Translations = {
  common: {
    lastUpdated: 'Son yenilənmə',
    home: 'Əsas səhifə',
  },
  nav: {
    products: 'MƏHSULLAR',
    whyIdenfit: 'NİYƏ IDENFIT',
    sectors: 'SEKTORLAR',
    pricing: 'QİYMƏTLƏR',
    customers: 'MÜŞTƏRİLƏR',
    company: 'KORPORATİV',
    discover: 'KƏŞF ET',
  },
  cta: {
    login: 'Daxil ol',
    requestDemo: 'Onlayn Təqdimat Tələbi',
    submit: 'Göndər',
  },
  hero: {
    title: 'Bütün İK Proseslərinizi\nİndi Rəqəmsallaşdırın!',
    description:
      'Davamiyyət nəzarətindən performans idarəçiliyinə, işə qəbuldan icazə izləməsinə və əmlak idarəçiliyinə qədər bütün İK proseslərini tək platformadan idarə edin.',
    headline: 'Əvvəlcə insan. Qalanı asanlaşsın.',
    subheadline:
      'idenfit; İK, işçi qüvvəsi idarəçiliyi, əmək haqqı hesablanması və işçi təcrübəsini tək platformada birləşdirir — komandalarınız proseslərlə deyil, insanla məşğul olsun.',
    emailPlaceholder: 'Şirkət E-poçtunuz',
    formName: 'Ad Soyad',
    formPhone: 'Telefon',
    formPhoneError: 'Düzgün telefon nömrəsi daxil edin (məs. 555 123 45 67)',
    formPhoneCountryLabel: 'Ölkə kodunu seçin',
    formPhoneCountrySearchPlaceholder: 'Ölkə axtar...',
    formPhoneCountryNoResults: 'Nəticə tapılmadı',
    formCompany: 'Şirkət Adı',
    formEmail: 'E-poçt',
    formMessage: 'Mesajınız',
    formSubmit: 'İndi Müraciət Et',
    ctaKeyword: 'Pulsuz Demo',
    kvkkNotice: {
      prefix: '',
      kvkkLinkText: 'Əlaqə Veb Şəxsi Məlumatların Qorunması Bəyanatı',
      middle: ' və ',
      termsLinkText: 'İstifadə Şərtlərini',
      suffix: ' qəbul edirəm.',
    },
    sideTitle: 'Bütöv İK Tətbiqləri',
    sideSubtitle: 'Onlayn təqdimat üçün indi müraciət edin!',
    supportRequestLink: 'Dəstək Tələbi üçün Klikləyin',
    whatsappLabel: 'WhatsApp-dan yazın',
    callLabel: 'İndi zəng edin',
    presentationForm: {
      name: 'Adınız Soyadınız',
      phone: 'Telefon Nömrəniz',
      email: 'Şirkət E-poçtunuz',
      company: 'Şirkətinizin Adı',
      next: 'Davam Et',
      back: 'Geri',
    },
    presentationTrustCaption: 'idenfit-ə güvənən 1.000-dən çox müştəriyə qoşulun.',
  },
  footer: {
    columnTitles: {
      about: 'HAQQIMIZDA',
      products: 'MƏHSULLAR',
      general: 'ÜMUMİ',
    },
    links: {
      about: {
        story: 'Hekayəmiz',
        contact: 'Əlaqə',
        blog: 'Bloq',
        kvkk: 'Şəxsi Məlumatların Qorunması',
        security: 'Təhlükəsizlik',
        globalBrand: 'Qlobal Marka Hədəfi',
      },
      products: {
        employeeRecords: 'Şəxsi Fayl',
        recruitment: 'İşə Qəbul',
        performance: 'Performans',
        training: 'Təlimlər',
        timesheet: 'Davamiyyət İzləmə',
        leaveManagement: 'İcazə İdarəçiliyi',
        hardware: 'Avadanlıqlar',
        timeAttendance: 'PDKS',
      },
      general: {
        pricing: 'Qiymətlər və Modullar',
        advantages: 'idenfit Üstünlükləri',
        successStories: 'Uğur Hekayələri',
        faq: 'Tez-tez Verilən Suallar',
        consumerRights: 'İstehlakçı Hüquqları Müqaviləsi',
        securityPolicy: 'Məxfilik və Təhlükəsizlik Siyasəti',
        distanceSalesAgreement: 'Məsafəli Satış Müqaviləsi',
      },
    },
    copyright: '© idenfit, {year}',
    privacy: 'Məxfilik Siyasəti',
    kvkk: 'KVKK',
    trustBadges: {
      ssl: 'SSL Təhlükəsizlik Sertifikatı',
      iso: 'ISO 27001 İnformasiya Təhlükəsizliyi İdarəetmə Sistemi Sertifikatı',
      peryon: 'Peryön Üzvlüyü',
      gdpr: 'GDPR Uyğunluğu',
    },
  },
  mega: {
    urunler: {
      intro: {
        title: '360 dərəcə İnsan Resursları Proqramı',
        description:
          "idenfit; insan resursları idarəçiliyinə bütöv yanaşma gətirən proqram təminatı ilə İK departamentlərinin vaxta qənaət etməsini təmin edərək dəyər yaradan işlərin ortaya çıxmasına zəmin hazırlayır. İK proseslərinizi tək platforma altında A-dan Z-yə idarə etməyə imkan verir.",
        faqLink: 'Tez-tez Verilən Suallar',
      },
      employeeManagement: {
        title: 'İşçi İdarəçiliyi',
        overview: 'Ümumi Baxış',
        personalFile: 'Şəxsi Fayl',
        corporateCalendar: 'Korporativ Təqvim',
        documents: 'Sənədlər',
        expenseManagement: 'Xərc İdarəçiliyi',
        training: 'Təlim',
        assetManagement: 'Əmlak İdarəçiliyi',
        messages: 'Mesajlar',
        notes: 'Qeydlər',
        shuttleServices: 'Servislər',
        occupationalHealth: 'Sağlamlıq',
      },
      workforceManagement: {
        title: 'İşçi Qüvvəsi İdarəçiliyi',
        overview: 'Ümumi Baxış',
        timeAttendance: 'Vaxt İdarəçiliyi/PDKS',
        timesheetTracking: 'Davamiyyət İzləmə',
        leaveManagement: 'İcazə İdarəçiliyi',
        payroll: 'Əmək Haqqı',
      },
      talentManagement: {
        title: 'İstedad İdarəçiliyi',
        onboarding: 'Onboarding',
        offboarding: 'Offboarding',
        employeeExperience: 'İşçi Təcrübəsi',
        survey: 'Sorğu',
        performanceOkr: 'Performans/OKR',
        recruitmentAts: 'İşə Qəbul/ATS',
      },
      hardwareManagement: {
        title: 'Avadanlıq İdarəçiliyi',
        overview: 'Avadanlıq İdarəçiliyi',
        integratedDevices: 'İnteqrasiya Olunmuş Cihazlar',
        biometricDevices: 'Biometrik Cihazlar',
        rfidDevices: 'RFID Cihazlar',
        turnstiles: 'Turniketlər',
      },
      promo: {
        titleLines: ['LATER', 'IS', 'NEVER'],
        description: 'İndi pulsuz İK rəqəmsallaşdırma məsləhətini alın!',
        ctaText: 'İNDİ BAŞLA',
        imageAlt: 'İK rəqəmsallaşdırma məsləhəti',
      },
    },
    sektorler: {
      title: 'Sektorlar',
      food: 'Qida',
      services: 'Xidmət',
      tourism: 'Turizm',
      retail: 'Pərakəndə',
      energy: 'Enerji',
      healthcare: 'Sağlamlıq',
      education: 'Təhsil',
      security: 'Təhlükəsizlik',
      facilityManagement: 'Obyekt İdarəçiliyi',
      industryAutomotive: 'Sənaye və Avtomobil',
      legalConsulting: 'Hüquq və Məsləhət',
      logisticsDistribution: 'Paylama və Logistika',
    },
    kurumsal: {
      title: 'Korporativ',
      about: 'Haqqımızda',
      contact: 'Əlaqə',
      faq: 'T.V.S.',
      globalBrand: 'Qlobal Marka Hədəfi',
      promo: {
        category: 'KORPORATİV',
        title: 'idenfit Ailəsi ilə Tanış Olun',
        imageAlt: 'idenfit komandası',
      },
    },
    kesfet: {
      contentTitle: 'Məzmunlar',
      blog: 'Bloqlar',
      blogDescription: 'İK dünyasındakı yenilikləri kəşf edin, bilikinizi bir addım irəli aparın.',
      digitalMaturityTest: 'Rəqəmsal İK Yetkinlik Testi',
      digitalMaturityTestDescription: '3 dəqiqədə xalınızı öyrənin və pulsuz yol xəritənizi əldə edin.',
      calculatorsTitle: 'Hesablamalar',
      overtimePay: 'Əlavə İş Haqqı Hesablama',
      incomeTax: 'Gəlir Vergisi Hesablama',
      employerCost: 'İşəgötürən Xərci Hesablama',
      severancePay: 'İşdənçıxma Kompensasiyası Hesablama',
      salaryRaise: 'Maaş Artımı Hesablama',
      corporateTax: 'Korporativ Vergi Hesablama',
      mealAllowance: 'Yemək Haqqı Hesablama',
      noticePeriod: 'Xəbərdarlıq Müddəti və Kompensasiyası Hesablama',
      reportsTitle: 'Hesabatlar',
      generationsWorkforce: {
        category: 'İK Trendləri',
        title: 'Nəsillərin İşçi Qüvvəsinə Təsiri',
        imageAlt: 'Nəsillərin İşçi Qüvvəsinə Təsiri hesabatının üz qabığı',
      },
      dataDrivenRecruitment: {
        category: 'Məlumat Yönümlü',
        title: 'Məlumat Yönümlü İşə Qəbul Bələdçisi',
        imageAlt: 'Məlumat Yönümlü İşə Qəbul Bələdçisinin üz qabığı',
      },
      digitalTransformation: {
        category: 'İK Transformasiyası',
        title: '10 Addımda Rəqəmsallaşma Bələdçisi',
        imageAlt: '10 Addımda Rəqəmsallaşma Bələdçisinin üz qabığı',
      },
      strategicHr: {
        category: 'İK Trendləri',
        title: 'Strateji İnsan Resursları Bələdçisi',
        imageAlt: 'Strateji İnsan Resursları Bələdçisinin üz qabığı',
      },
    },
    ui: {
      nextReports: 'Növbəti hesabatlar',
      prevReports: 'Əvvəlki hesabatlar',
    },
  },
  headerUi: {
    openMenu: 'Menyunu aç',
    closeMenu: 'Menyunu bağla',
    brandHome: 'idenfit əsas səhifə',
    mainNav: 'Əsas menyu',
    langLabel: 'Dil seçicisi',
  },
  customerStories: {
    heroTitle: 'Müştəri\nUğur Hekayələri',
    heroDescription:
      'Bizimlə işləməyi sevən, birlikdə böyüdüyümüz bəzi müəssisələrin uğur hekayələrini sizinlə paylaşırıq.',
    ctaLabel: 'İndi Müraciət Et',
    videoComingSoon: 'Video tezliklə',
    videoPlayLabel: 'Videonu oynat',
    femas: {
      description:
        "idenfit olaraq təqdim etdiyimiz proqram dəstəyi ilə, 5 qitədə və 100-dən çox ölkədə fəaliyyət göstərən Femaş Qrupun insan resursları və işçi qüvvəsi idarəçiliyi proseslərini rəqəmsal mühitdə asanlıqla idarə etməsini təmin etdik. Femaş Qrup, 3000 işçisinin növbə planlamasını və bütün sənəd işlərini idenfit ilə tək bir paneldən düzgün və asan şəkildə idarə edərkən, vaxta və iş yükünə də qənaət edir.",
      employeeCount: '3000 işçi',
    },
    civil: {
      description:
        "1996-cı ildə İstanbulun Kartal rayonunda 50 m²-lik bir mağazada başlayan Civil yolçuluğumuz, bu gün 29-cu ilində 100-dən çox mağaza və 3000-dən artıq iş yoldaşı ilə milyonlarla ailəyə çatmağa davam edir.\n\nAna & hamilə, körpə və uşaq kateqoriyalarında; geyim, ayaqqabı, oyuncaq, ləvazimat, körpə baxımı və sürətli istehlak məhsullarını tək dam altında bir araya gətirərək ailələrin ehtiyac duyduğu hər an yanlarında olmaq üçün məhsullarımızı diqqətlə seçirik.\n\nKeyfiyyət, etibar və əlçatan qiymət prinsiplərimizlə Türkiyədə və xaricdə seçilməyə davam edir; hər gün yeni bir ailənin hekayəsinə yoldaşlıq etməkdən məmnunluq duyuruq.",
      employeeCount: '3000 işçi',
      secondaryStat: '112 mağaza',
    },
    civilSecondary: {
      quote: {
        text:
          "29 illik yolçuluğumuzda Civil ailəsini uğura daşıyan ən böyük dəyərimiz, 3000-dən çox iş yoldaşımızdır. Bu güclü yolçuluğu davam etdirərkən, işçilərimizlə olan bağımızı rəqəmsallaşdırmaq və daha şəffaf, səmərəli bir iş mühiti yaratmaq üçün idenfit ilə əməkdaşlıq etdik.\n\nNövbə cədvəllərindən icazə izləməsinə, əmək haqqı imzalarından iş vaxtı idarəçiliyinə qədər bütün rəsmi sənəd və təsdiq proseslərini rəqəmsallaşdırdıq. Beləliklə, işçilərimiz hüquq və öhdəliklərinə daha asanlıqla çata bilirlər.\n\nÖzünəxidmət İK strukturu sayəsində işçilərimiz; karyera inkişaflarını izləyə bilir, əlavə haqlarını görə bilir, yemək və servis marşrut məlumatlarına çata bilirlər. Güncəl prosedurlar və şirkətdaxili yazışmalar da yenə idenfit vasitəsilə paylaşılaraq şəffaf şəkildə əlçatan olur.\n\nCivil ailəsinin hər bir üzvünə effektiv, əlçatan və davamlı bir insan resursları təcrübəsi təqdim etməyimizə töhfə verən; işçilərimizin məmnunluğunu və bağlılığını gücləndirən bu əməkdaşlığa görə idenfit-ə təşəkkür edirik.",
        name: 'Mustafa Yıldıran',
        role: 'Civil İdarə Heyəti Sədri',
      },
    },
    yatsan: {
      description:
        'Yatsan olaraq fabrikimizdə və mağazalarımızda həyata keçirdiyimiz insan resursları proseslərini daha səmərəli və sürətli idarə edə bilmək üçün idenfit ilə rəqəmsal transformasiya prosesimizi 6 il əvvəl başlatdıq.\n\nidenfit tətbiqi ilə icazə proseslərindən əmək haqqına, giriş-çıxış izləməsindən sənəd idarəçiliyinə qədər bir çox prosesi rəqəmsal mühitə daşıyaraq əməliyyat iş yükünü azaldırıq.\n\nBununla yanaşı, idenfit mobil tətbiqi vasitəsilə elan, sorğu, yemək siyahıları və s. məlumatları işçilərimiz üçün asanlıqla əlçatan edirik. Şikayət və təklif düyməsi sayəsində işçilərimiz fikirlərini sürətlə bizə çatdıra bilirlər.',
      employeeCount: '900 işçi',
      secondaryStat: '40 filial',
      quote: {
        text:
          'Bu həll tərəfdaşlığı ilə İK proseslərimizi daha şəffaf, əlçatan və istifadəçi dostu bir struktura qovuşdururkən işçi məmnunluğunu da artırmış oluruq.',
        name: 'Müzeyyen Kıran Mergen',
        role: 'Əmək Haqqı, Şəxsi Heyət və İnzibati İşlər Meneceri',
      },
    },
    dogSer: {
      employeeCount: '250 işçi',
      secondaryStat: '10 Lokasiya',
      quote: {
        text:
          "Layihə əsaslı işlədiyimiz müəssisəmizdə insan resursları proseslərimiz idenfit ilə təmasda olduğumuz andan etibarən müsbət istiqamətdə dəyişdi. Yeniliyə və inkişafa açıq olmaları, müştəri yönümlü olub tələblərimizi həyata keçirmələri ehtiyaclarımızı gözləntilərimizə uyğun tam olaraq qarşıladı. Bundan əlavə, İK proseslərimizi rəqəmsallaşdırarkən qarşılaşdığımız hər cür problemə həll yönümlü yanaşıb dəstək verməsi idenfit ilə uzunmüddətli işləməyimizdə böyük amil oldu. idenfit sayəsində davamiyyət və icazə izləməsini rəqəmsal mühitdə asanlıqla idarə etməyə başladıq və proseslərimiz məmnuniyyətlə davam edir.",
        name: 'Cem Çolak',
        role: 'İnzibati & Maliyyə İşləri',
      },
    },
    tugbaKuruyemis: {
      employeeCount: '1200 işçi',
      secondaryStat: '111 Filial',
      quote: {
        text:
          "idenfit olaraq təqdim etdiyimiz proqram dəstəyi ilə 1980-ci ildə yolçuluğuna başlayan və bu gün Türkiyə üzrə 100-dən çox mağaza ilə xidmət göstərən Tuğba Kuruyemişin insan resursları və işçi qüvvəsi idarəçiliyi proseslərini rəqəmsal mühitdə asanlıqla idarə etməsini təmin etdik. Rutin sənəd işlərini idenfit ilə tək bir panel üzərindən rəqəmsal mühitdə idarə edən Tuğba Kuruyemiş, İRİ proseslərini rəqəmsallaşdırarkən iş yükündən də qənaət edir.",
        name: 'Nevzat Atmaca',
      },
    },
    beyazFirin: {
      quote: {
        text:
          'idenfit, bizim istəklərimizin belə qabağında xidmət göstərdi və bizi bu mövzuda inkişaf etdirdi. Ən mühüm xüsusiyyətlərindən biri, tələblərimizin qarşılığını tapmasıdır. İş həyatından gələn bütün tələblər qiymətləndirilib proqram yenidən təkmilləşdirilir, buradakı inkişaf həqiqətən çox sürətlidir.',
        name: 'Nuri Sütlüoğlu',
        role: 'İnsan Resursları Müdiri',
      },
    },
    emreOzcan: {
      quote: {
        text:
          'idenfit ilə ilk tanışdığımızda məni ən çox təsirləndirən şey, idenfit\'in praktikliyi və fərqli sahələri eyni platformada birləşdirə bilməsi idi. İnterfeysinin sadəliyi, işçilərimizin sürətlə adaptasiya ola biləcəyi bir sistem olduğunu göstərirdi. Xüsusilə növbəli və yoğun əməliyyat aparan bizim kimi şirkətlər üçün, "işçi dostu rəqəmsal həll" görmək çox dəyərli idi.',
        name: 'Emre Özcan',
        role: 'Korporativ Əlaqələr Meneceri',
      },
    },
    ismailUnal: {
      quote: {
        text:
          "idenfit, xüsusilə davamiyyət proseslərini başdan-başa qura bilməsi, istifadəçi dostu interfeysi və İK'nın fərqli ehtiyaclarına tək tətbiq üzərindən təqdim etdiyi çoxtərəfli həllərlə bizim üçün seçilən bir seçim oldu.",
        name: 'İsmail Ünal',
        role: 'People & Culture Manager',
      },
    },
  },
  home: {
    logoStrip: {
      caption: '1000’dən çox məmnun müştəri rəqəmsal İK transformasiyasını bizimlə həyata keçirdi.',
    },
    dividers: {
      afterLogos: 'Manual Proseslərdən Qurtulun, İK Əməliyyatlarınızı Asanlaşdırın!',
      afterFeatures: 'Vaxta Qənaət Edin, İK Proseslərinizi Ağıllı Şəkildə İdarə Edin!',
    },
    featureGrid: {
      title: 'Səmərəli Müəssisələr üçün Ağıllı İK Həlləri',
      intro:
        'İşçilərinizin nə qədər müddət, hansı vəzifədə və hansı əhval-ruhiyyə ilə işlədiyini anlayaraq, səmərəliliyi artıran, bağlılığı gücləndirən və gələcəyə yönəlik strategiyalar hazırlayan insan resursları idarəçiliyini kəşf edin.',
      timeLeave: {
        title: 'Vaxt və İcazə İdarəçiliyi',
        text: 'İş saatlarını və icazələri asanlıqla idarə edin, səmərəliliyi və işçi məmnunluğunu artırın.',
      },
      performance: {
        title: 'Performans İdarəçiliyi',
        text: 'Ədalətli və ölçülə bilən performans izləməsi ilə komandalarınızı gücləndirin.',
      },
      employeeExperience: {
        title: 'İşçi Təcrübəsi',
        text: 'Motivasiyanı və bağlılığı artıran, işçi yönümlü bir iş mühiti yaradın.',
      },
      analytics: {
        title: 'İnsan Resursları Analitikası',
        text: 'Məlumatla dəstəklənən qərarlarla İK proseslərinizi optimallaşdırın.',
      },
    },
    certifications: {
      titleLine1: 'Bulud Texnologiyası',
      titleLine2: '& Keyfiyyət Standartları',
      text:
        'idenfit, işçilərinizi və işçi qüvvənizi daha asan və etibarlı şəkildə idarə etməyinizi təmin edən bulud əsaslı bir platformdur. İstifadəçilərimizə, sektorda əldə etdiyimiz 20 illik təcrübə ilə yaratdığımız bütün məhsul və xidmətlərimizi, ISO (27001 və 9001) standartlarına uyğun olaraq və müştəri məmnunluğunu əsas alaraq təqdim etməyi zəmanət veririk.',
    },
    video: {
      title: 'Niyə idenfit?',
      ctaText: 'Daha Çox',
      ctaAriaLabel: 'Niyə idenfit səhifəsində daha çox məlumat əldə edin',
      videoTitle: 'idenfit təqdimat videosu',
      playLabel: 'Videonu oynat',
    },
    efficiency: {
      title: 'Səmərəliliyi Ölçən 5 Sual',
      text:
        'İşçilərinizin doğru yerdə, doğru vaxtda, doğru işləri keyfiyyətli gördüyünə əmin olun. Hər növ müəssisəyə tətbiq oluna bilən bulud texnologiyası (SaaS), güclü infrastrukturu və etibarlı verilənlər bazası ilə, işçilərinizi və əməliyyatlarınızı internet girişi olan hər yerdən, istədiyiniz vaxt idarə etməyə imkan verir.',
      imageAlt: 'Səmərəliliyi ölçən 5 sual — idenfit panel ekran görüntüsü',
    },
    panel: {
      title: 'İstifadəçi Dostu Panel',
      text:
        'idenfit, sadə, aydın və istifadəsi asan xüsusiyyətləri ilə insan resursları idarəçiliyi boyunca əldə edilən bütün məlumatları eyni paneldə tapmağınızı təmin edir. Dinamik panel, fərqli modullara əlavələr etməyinizə imkan verəcək şəkildə dizayn edilmişdir.',
      features: ['Anlıq Məlumatlar', 'Xatırlatmalar', 'Real Zamanlı Monitor'],
      imageAlt: 'idenfit istifadəçi dostu panel ekran görüntüsü',
    },
    suprema: {
      title: 'Bütün Avadanlıqlarla İnteqrasiya Olunmuş PDKS Platforması',
      text:
        'idenfit, üz tanıma və barmaq oxuma cihazlarına inteqrasiya olunmuş sistem sayəsində işçilərin kimlik doğrulaması real zamanlı aparıla bilər. Eyni zamanda giriş-çıxış və fasilə vaxtlarının izlənməsi asanlıqla idarə oluna bilər.',
    },
    partners: {
      title: 'Partnyorlarımız',
      text: 'idenfit-in inteqrasiya olunduğu etibarlı texnologiya və biznes tərəfdaşları.',
      categories: {
        turnstile: 'Turniket',
        payroll: 'Əmək Haqqı',
        lms: 'LMS',
        task: 'Tapşırıq İdarəçiliyi',
        sso: 'SSO',
      },
    },
    testimonials: {
      title: 'İnkişaf Etdirilə Bilən İşçi Təcrübəsi',
      intro:
        'İşçi qavrayışında daha yaxşı bir yer əldə etmək və işçi təcrübəsini inkişaf etdirmək üçün müəssisələrə insan yönümlü həllər təqdim edirik.',
      prevLabel: 'Əvvəlki rəy',
      nextLabel: 'Növbəti rəy',
      ismailUnal: {
        quote:
          "idenfit, xüsusilə davamiyyət proseslərini başdan-başa qura bilməsi, istifadəçi dostu interfeysi və İK'nın fərqli ehtiyaclarına tək tətbiq üzərindən təqdim etdiyi çoxtərəfli həllərlə bizim üçün seçilən bir seçim oldu.",
        jobTitle: 'Zsa Zsa Zsu - People & Culture Manager',
      },
      emreOzcan: {
        quote:
          'idenfit ilə ilk tanışdığımızda məni ən çox təsirləndirən şey, idenfit\'in praktikliyi və fərqli sahələri eyni platformada birləşdirə bilməsi idi. İnterfeysinin sadəliyi, işçilərimizin sürətlə adaptasiya ola biləcəyi bir sistem olduğunu göstərirdi. Xüsusilə növbəli və yoğun əməliyyat aparan bizim kimi şirkətlər üçün, "işçi dostu rəqəmsal həll" görmək çox dəyərli idi.',
        jobTitle: 'HAVAİST - Korporativ Əlaqələr Meneceri',
      },
    },
    customerCarousel: {
      title: 'Müştəri Hekayələri',
      intro: 'idenfit ilə İK proseslərini transformasiya edən şirkətlərdən real təcrübələr.',
      prevLabel: 'Əvvəlki hekayə',
      nextLabel: 'Növbəti hekayə',
      readMoreLabel: 'Daha Çox Oxu',
      civilVideo: { headline: 'Civil-in idenfit ilə İK proseslərini necə transformasiya etdiyini izləyin' },
      femasVideo: { headline: 'Femaş-ın idenfit ilə İK proseslərini necə transformasiya etdiyini izləyin' },
      tugbaKuruyemis: { headline: 'Tuğba Kuruyemiş idenfit ilə İK proseslərini tək paneldən idarə edir' },
      beyazFirinVideo: { headline: 'Beyaz Fırının idenfit ilə İK proseslərini necə transformasiya etdiyini izləyin' },
      ibisStylesVideo: { headline: 'ibis Styles Hotels-in idenfit ilə İK proseslərini necə transformasiya etdiyini izləyin' },
      ibisStylesQuote: {
        text: 'Otelimiz açıldığı gündən idenfit tətbiqindən istifadə edir. İdenfit tətbiqində məni ən çox cəlb edən və seçim səbəbim olan şeylərdən biri idenfitin ortaya qoyduğu fikir idi. İş həyatında alışdığımız kart oxutma, turniket sistemi və ya imza atma üsulunun hamısını bir kənara qoydu. Əməkdaşlarımızın mobil tətbiq üzərindən giriş-çıxış əməliyyatını edə bilmələri və bizim bunu anlıq və mobil olaraq hər yerdən izləyə bilməyimiz performansımızı da artırdı.',
        name: 'Tolga Avcı',
        jobTitle: 'ibis Styles Hotels - Ümumi Direktor',
      },
    },
    faq: {
      viewAllLink: 'Bütün Sualları Görüntülə',
    },
  },
  faqPage: {
    pdfLabel: 'PDF YÜKLƏ',
    metaDescription: 'Ümumi, ödəniş, quraşdırma, müştəri təcrübəsi, məlumat təhlükəsizliyi və üzvlük mövzularında idenfit haqqında tez-tez verilən sualların cavablarını tapın.',
  },
  sectorPage: {
    modulesHeading: 'Bu Sektora Xas Modullar',
  },
  notFound: {
    pageTitle: 'Səhifə Tapılmadı',
    metaDescription:
      'Axtardığınız səhifə tapılmadı. idenfit əsas səhifəsinə qayıdın və ya Bloq, Əlaqə, Qiymətlər kimi populyar səhifələrimizi kəşf edin.',
    heading: 'Səhifə Tapılmadı',
    description:
      'Axtardığınız səhifə köçürülmüş, silinmiş ola bilər və ya heç mövcud olmayıb. Əsas səhifəyə qayıda bilər və ya aşağıdakı populyar səhifələrimizdən birinə baxa bilərsiniz.',
    backHomeButton: 'Əsas Səhifəyə Qayıt',
    popularLinksTitle: 'Populyar Səhifələr',
  },
};
