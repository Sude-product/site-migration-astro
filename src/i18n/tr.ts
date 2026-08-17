import type { Translations } from './types';

// Ana kaynak dil — sayfalardan/component'lerden çıkarılan gerçek metinler.
export const tr: Translations = {
  common: {
    lastUpdated: 'Son güncelleme',
  },
  nav: {
    products: 'ÜRÜNLER',
    whyIdenfit: 'NEDEN IDENFIT',
    sectors: 'SEKTÖRLER',
    pricing: 'FİYATLAR',
    customers: 'MÜŞTERİLER',
    company: 'KURUMSAL',
    discover: 'KEŞFET',
  },
  cta: {
    login: 'Giriş Yap',
    requestDemo: 'Online Sunum Talebi',
    submit: 'Gönder',
  },
  hero: {
    title: 'Tüm İK Süreçlerinizi\nHemen Dijitalleştirin!',
    // ⚠️ DÜZELTME (2026-08-04): kaynak site bu metni migrasyon snapshot'ından
    // SONRA güncellemiş (element-ID `4ec6dae`, canlı `idenfit.com` ile
    // doğrulandı) — eski metin "bütüncül yaklaşım/işe alımdan bordroya"
    // temalıydı, yeni metin PDKS/yapay zeka destekli işe alım/zimmet
    // yönetimini vurguluyor.
    description:
      'PDKS\'den performans yönetimine, yapay zeka destekli işe alım ve izin takibinden zimmet ve varlık yönetimine kadar tüm İK tek bir platformdan yönetin.',
    formName: 'İsim Soyisim',
    formPhone: 'Telefon',
    formPhoneError: 'Geçerli bir telefon numarası girin (örn. 555 123 45 67)',
    formPhoneCountryLabel: 'Ülke kodu seç',
    formPhoneCountrySearchPlaceholder: 'Ülke ara...',
    formPhoneCountryNoResults: 'Sonuç bulunamadı',
    formCompany: 'Firma Adı',
    formEmail: 'Mail',
    formMessage: 'Mesajınız',
    formSubmit: 'Hemen Başvur',
    ctaKeyword: 'Ücretsiz Demo',
    kvkkNotice: {
      prefix: '',
      kvkkLinkText: 'İletişim Web KVKK İbaresi',
      middle: ' ve ',
      termsLinkText: 'Kullanım Koşullarını',
      suffix: ' kabul ediyorum.',
    },
    sideTitle: 'Bütüncül İK Uygulamaları',
    sideSubtitle: 'Online tanıtım için hemen başvurun!',
    supportRequestLink: 'Destek Talebi İçin Tıklayın',
    whatsappLabel: "WhatsApp'tan yazın",
    callLabel: 'Hemen arayın',
    presentationForm: {
      name: 'Adınız Soyadınız',
      phone: 'Telefon Numarası',
      email: 'Şirket E-postanız',
      company: 'Firmanızın Adı',
    },
  },
  footer: {
    columnTitles: {
      about: 'HAKKINDA',
      products: 'ÜRÜNLER',
      general: 'GENEL',
    },
    links: {
      about: {
        story: 'Hikayemiz',
        contact: 'İletişim',
        blog: 'Blog',
        kvkk: 'KVKK',
        security: 'Güvenlik',
        globalBrand: 'Hedef Global Marka',
      },
      products: {
        employeeRecords: 'Özlük Dosyası',
        recruitment: 'İşe Alım',
        performance: 'Performans',
        training: 'Eğitimler',
        timesheet: 'Puantaj Takibi',
        leaveManagement: 'İzin Yönetimi',
        hardware: 'Donanımlar',
        timeAttendance: 'PDKS',
      },
      general: {
        pricing: 'Fiyatlar ve Modüller',
        advantages: 'idenfit Avantajları',
        successStories: 'Başarı Hikayeleri',
        faq: 'Sıkça Sorulan Sorular',
        consumerRights: 'Tüketici Hakları Sözleşmesi',
        securityPolicy: 'Gizlilik ve Güvenlik Politikası',
        distanceSalesAgreement: 'Mesafeli Satış Sözleşmesi',
      },
    },
    copyright: '© idenfit, {year}',
    privacy: 'Gizlilik Politikası',
    kvkk: 'KVKK',
    paymentMethodsAlt: 'Güvenli ödeme yöntemleri: iyzico, Troy, Visa, Mastercard, American Express',
  },
  mega: {
    urunler: {
      intro: {
        title: '360 İnsan Kaynakları Programı',
        description:
          "idenfit; insan kaynakları yönetimine bütüncül bir yaklaşım getiren yazılımıyla, İK departmanlarının zamandan tasarruf etmesini sağlayarak değer yaratan işlerin ortaya çıkmasına zemin hazırlar. İK süreçlerinizi tek bir platform altında A'dan Z'ye yönetmenizi sağlar.",
        faqLink: 'Sıkça Sorulan Sorular',
      },
      employeeManagement: {
        title: 'Çalışan Yönetimi',
        overview: 'Genel Bakış',
        personalFile: 'Özlük Dosyası',
        corporateCalendar: 'Kurumsal Takvim',
        documents: 'Dokümanlar',
        expenseManagement: 'Harcama-Masraf',
        training: 'Eğitim',
        assetManagement: 'Zimmet Yönetimi',
        messages: 'Mesajlar',
        notes: 'Notlar',
        shuttleServices: 'Servisler',
        occupationalHealth: 'Sağlık',
      },
      workforceManagement: {
        title: 'İş Gücü Yönetimi',
        overview: 'Genel Bakış',
        timeAttendance: 'Zaman Yönetimi/PDKS',
        timesheetTracking: 'Puantaj Takibi',
        leaveManagement: 'İzin Yönetimi',
        payroll: 'Bordro',
      },
      talentManagement: {
        title: 'Yetenek Yönetimi',
        onboarding: 'Onboarding',
        offboarding: 'Offboarding',
        employeeExperience: 'Çalışan Deneyimi',
        survey: 'Anket',
        performanceOkr: 'Performans/OKR',
        recruitmentAts: 'İşe Alım/ATS',
      },
      hardwareManagement: {
        title: 'Donanım Yönetimi',
        overview: 'Donanım Yönetimi',
        integratedDevices: 'Entegre Cihazlar',
        biometricDevices: 'Biometrik Cihazlar',
        rfidDevices: 'RFID Cihazlar',
        turnstiles: 'Turnikeler',
      },
      promo: {
        titleLines: ['LATER', 'IS', 'NEVER'],
        description: 'Hemen ücretsiz İK dijitalleştirme danışmanlığını alın!',
        ctaText: 'HAYDİ ŞİMDİ',
        imageAlt: 'İK dijitalleştirme danışmanlığı',
      },
    },
    sektorler: {
      title: 'Sektörler',
      food: 'Gıda',
      services: 'Hizmet',
      tourism: 'Turizm',
      retail: 'Perakende',
      energy: 'Enerji',
      healthcare: 'Sağlık',
      education: 'Eğitim',
      security: 'Güvenlik',
      facilityManagement: 'Tesis Yönetimi',
      industryAutomotive: 'Sanayi ve Otomotiv',
      legalConsulting: 'Hukuk ve Danışmanlık',
      logisticsDistribution: 'Dağıtım ve Lojistik',
    },
    kurumsal: {
      title: 'Kurumsal',
      about: 'Hakkımızda',
      contact: 'İletişim',
      faq: 'S.S.S',
      globalBrand: 'Hedef Global Marka',
      promo: {
        category: 'KURUMSAL',
        title: 'idenfit Ailesiyle Tanışın',
        imageAlt: 'idenfit ekibi',
      },
    },
    kesfet: {
      contentTitle: 'İçerikler',
      blog: 'Bloglar',
      blogDescription: 'İK dünyasındaki yenilikleri keşfedin, bilginizi bir adım öteye taşıyın.',
      digitalMaturityTest: 'Dijital İK Olgunluk Testi',
      digitalMaturityTestDescription: '3 dakikada skorunuzu öğrenin ve ücretsiz yol haritanızı alın.',
      calculatorsTitle: 'Hesaplamalar',
      overtimePay: 'Fazla Mesai Ücreti Hesaplama',
      incomeTax: 'Gelir Vergisi Hesaplama',
      employerCost: 'İşveren Maliyeti Hesaplama',
      severancePay: 'Kıdem Tazminatı Hesaplama',
      salaryRaise: 'Maaş Zammı Hesaplama',
      corporateTax: 'Kurumlar Vergisi Hesaplama',
      mealAllowance: 'Yemek Ücreti Hesaplama',
      noticePeriod: 'İhbar Süresi ve Tazminatı Hesaplama',
      reportsTitle: 'Raporlar',
      generationsWorkforce: {
        category: 'İK Trendleri',
        title: 'Kuşakların İş Gücüne Etkisi',
        imageAlt: 'Kuşakların İş Gücüne Etkisi raporu kapağı',
      },
      dataDrivenRecruitment: {
        category: 'Veri Odaklı',
        title: 'Veri Odaklı İşe Alım Rehberi',
        imageAlt: 'Veri Odaklı İşe Alım Rehberi kapağı',
      },
      digitalTransformation: {
        category: 'İK Dönüşüm',
        title: '10 Adımda Dijitalleşme Rehberi',
        imageAlt: '10 Adımda Dijitalleşme Rehberi kapağı',
      },
      strategicHr: {
        category: 'İK Trendleri',
        title: 'Stratejik İnsan Kaynakları Rehberi',
        imageAlt: 'Stratejik İnsan Kaynakları Rehberi kapağı',
      },
    },
    ui: {
      nextReports: 'Sonraki raporlar',
      prevReports: 'Önceki raporlar',
    },
  },
  headerUi: {
    openMenu: 'Menüyü aç',
    closeMenu: 'Menüyü kapat',
    brandHome: 'idenfit ana sayfa',
    mainNav: 'Ana menü',
    langLabel: 'Dil seçici',
  },
  customerStories: {
    heroTitle: 'Müşteri\nBaşarı Hikayeleri',
    heroDescription:
      'Bizimle çalışmayı seven, beraber büyüdüğümüz bazı işletmelerin başarı hikâyelerini sizlerle paylaşıyoruz.',
    ctaLabel: 'Hemen Başvur',
    videoComingSoon: 'Video yakında',
    videoPlayLabel: 'Videoyu oynat',
    femas: {
      description:
        "idenfit olarak sağladığımız yazılım desteğiyle, 5 kıtada ve 100'den fazla ülkede faaliyet gösteren Femaş Grup'un insan kaynakları ve iş gücü yönetimi süreçlerini dijital ortamda kolayca yönetmesini sağladık. Femaş Grup, 3000 çalışanının vardiya planlamalarını ve tüm evrak işlerini idenfit ile tek bir panelden doğru ve kolay şekilde yönetirken, zamandan ve iş yükünden de tasarruf ediyor.",
      employeeCount: '3000 çalışan',
    },
    civil: {
      description:
        "1996 yılında İstanbul Kartal'da 50 m²'lik bir mağazada başlayan Civil yolculuğumuz, bugün 29. yılında 100'ü aşkın mağaza ve 3000'den fazla çalışma arkadaşı ile milyonlarca aileye ulaşmaya devam ediyor.\n\nAnne & hamile, bebek ve çocuk kategorilerinde; giyim, ayakkabı, oyuncak, araç-gereç, bebek bakımı ve hızlı tüketim ürünlerini tek çatı altında bir araya getirerek ailelerin ihtiyaç duyduğu her an yanlarında olmak için ürünlerimizi özenle seçiyoruz.\n\nKalite, güven ve ulaşılabilir fiyat ilkelerimizle Türkiye'de ve yurt dışında tercih edilmeye devam ediyor; her gün yeni bir ailenin hikâyesine eşlik etmenin mutluluğunu taşıyoruz.",
      // 2026-07-27: canlı sitede 2600 → 3000 olarak güncellenmiş (kaynak
      // export'tan SONRA değişmiş), doğrulanıp güncellendi.
      employeeCount: '3000 çalışan',
      secondaryStat: '112 mağaza',
    },
    civilSecondary: {
      quote: {
        text:
          "29 yıllık yolculuğumuzda Civil ailesini başarıya taşıyan en büyük değerimiz, 3000'den fazla çalışma arkadaşımızdır. Bu güçlü yolculuğu sürdürürken, çalışanlarımızla olan bağımızı dijitalleştirmek ve daha şeffaf, verimli bir çalışma ortamı yaratmak için idenfit ile iş birliği yaptık.\n\nVardiya çizelgelerinden izin takibine, bordro imzalarından mesai yönetimine kadar tüm resmi evrak ve onay süreçlerini dijitale taşıdık. Böylece çalışanlarımız hak ve yükümlülüklerine çok daha kolay erişebiliyor.\n\nSelf servis İK yapısı sayesinde çalışanlarımız; kariyer gelişimlerini takip edebiliyor, yan haklarını görüntüleyebiliyor, yemek ve servis güzergâh bilgilerine ulaşabiliyor. Güncel prosedürler ve şirket içi yazışmalar da yine idenfit üzerinden paylaşılarak şeffaf bir şekilde erişilebilir hale geliyor.\n\nCivil ailesinin her bireyine etkin, erişilebilir ve sürdürülebilir bir insan kaynakları deneyimi sunmamıza katkı sağlayan; çalışanlarımızın memnuniyetini ve bağlılığını güçlendiren bu iş birliği için idenfit'e teşekkür ederiz.",
        name: 'Mustafa Yıldıran',
        role: 'Civil Yönetim Kurulu Başkanı',
      },
    },
    // 2026-07-27: Yatsan'ın TÜM açıklaması + alıntısı canlı sitede baştan
    // yazılmış (kaynak export'taki eski metinle alakası yok — "6 yıl önce"
    // ifadesi, yeni isimli referans kişisi + fotoğrafı dahil). Canlı
    // siteden yeniden, kelimesi kelimesine doğrulanarak alındı.
    yatsan: {
      description:
        'Yatsan olarak fabrikamızda ve mağazalarımızda yürüttüğümüz insan kaynakları süreçlerini daha verimli ve hızlı yönetebilmek adına idenfit ile dijital dönüşüm sürecimizi 6 yıl önce başlattık.\n\nidenfit uygulamasıyla izin süreçlerinden bordroya, giriş-çıkış takibinden evrak yönetimine kadar pek çok süreci dijital ortama taşıyarak operasyonel iş yükünü azaltıyoruz.\n\nBununla birlikte, idenfit mobil uygulaması üzerinden duyuru, anket, yemek listeleri vb. bilgileri çalışanlarımıza kolay erişilebilir hale getiriyoruz. Şikayet ve öneri butonu sayesinde çalışanlarımız fikirlerini hızlıca bize ulaştırabiliyor.',
      employeeCount: '900 çalışan',
      secondaryStat: '40 şube',
      quote: {
        text:
          'Bu çözüm ortaklığı ile İK süreçlerimizi daha şeffaf, erişilebilir ve kullanıcı dostu bir yapıya kavuştururken çalışan memnuniyetini de arttırmış oluyoruz.',
        name: 'Müzeyyen Kıran Mergen',
        role: 'Bordro Özlük ve İdari İşler Yöneticisi',
      },
    },
    dogSer: {
      employeeCount: '250 çalışan',
      secondaryStat: '10 Lokasyon',
      quote: {
        text:
          "Proje bazlı çalıştığımız işletmemizde insan kaynakları süreçlerimiz idenfit ile temas ettiğimiz andan itibaren olumlu yönde değişti. Yeniliğe ve geliştirmelere açık olmaları, müşteri odaklı olup taleplerimizi gerçekleştirmeleri ihtiyaçlarımızı beklentilerimiz doğrultusunda tam olarak karşıladı. Ayrıca İK süreçlerimizi dijitale taşırken karşılaştığımız her türlü probleme çözüm odaklı yaklaşıp destek vermeleri idenfit'le uzun dönemli çalışıyor olmamızda büyük etken oldu. idenfit sayesinde puantaj ve izin takibini dijital ortamda kolaylıkla yönetmeye başladık ve süreçlerimiz keyifle devam ediyor.",
        name: 'Cem Çolak',
        role: 'İdari & Mali İşler',
      },
    },
    tugbaKuruyemis: {
      employeeCount: '1200 çalışan',
      secondaryStat: '111 Şube',
      quote: {
        text:
          "idenfit olarak sunduğumuz yazılım desteğiyle 1980 yılında yolculuğuna başlayan ve günümüzde Türkiye genelinde 100'ün üstünde mağaza ile hizmet sunan Tuğba Kuruyemiş'in insan kaynakları ve iş gücü yönetimi süreçlerini dijital ortamda kolayca yönetmesini sağladık. Rutin evrak işlerini idenfit ile tek bir panel üzerinden dijital ortamda yöneten Tuğba Kuruyemiş, İKY süreçlerini dijitale taşırken iş yükünden de tasarruf ediyor.",
        name: 'Nevzat Atmaca',
      },
    },
  },
  home: {
    logoStrip: {
      caption: "1000’den fazla mutlu müşteri, dijital İK dönüşümünü bizimle gerçekleştirdi.",
    },
    dividers: {
      afterLogos: 'Manuel Süreçlerden Kurtulun, İK Operasyonlarınızı Kolaylaştırın!',
      afterFeatures: 'Zamandan Tasarruf Edin, İK Süreçlerinizi Akıllıca Yönetin!',
    },
    featureGrid: {
      title: 'Verimli İşletmeler İçin Akıllı İK Çözümleri',
      intro:
        'Çalışanlarınızın ne kadar süre, hangi görevde ve hangi ruh haliyle çalıştığını anlayarak, verimliliği artıran, bağlılığı güçlendiren ve geleceğe yönelik stratejiler geliştiren insan kaynakları yönetimini keşfedin.',
      timeLeave: {
        title: 'Zaman ve İzin Yönetimi',
        text: 'Çalışma saatleri ve izinleri kolayca yönetin, verimliliği ve çalışan memnuniyetini artırın.',
      },
      performance: {
        title: 'Performans Yönetimi',
        text: 'Adil ve ölçülebilir performans takibi ile ekiplerinizi güçlendirin.',
      },
      employeeExperience: {
        title: 'Çalışan Deneyimi',
        text: 'Motivasyonu ve bağlılığı artıran, çalışan odaklı bir iş ortamı yaratın.',
      },
      analytics: {
        title: 'İnsan Kaynakları Analitiği',
        text: 'Veriyle desteklenen kararlarla İK süreçlerinizi optimize edin.',
      },
    },
    certifications: {
      titleLine1: 'Bulut Teknolojisi',
      titleLine2: '& Kalite Standartları',
      text:
        'idenfit, çalışanlarınızı ve iş gücünüzü daha kolay ve güvenilir bir şekilde yönetmenizi sağlayan bulut tabanlı bir platformdur. Kullanıcılarımıza, sektörde edindiğimiz 20 yıllık deneyimle oluşturduğumuz tüm ürün ve hizmetlerimizi, ISO (27001 ve 9001) standartlarına uygun olarak ve müşteri memnuniyetini esas alarak sunmayı garanti ediyoruz.',
    },
    video: {
      title: 'Neden idenfit?',
      ctaText: 'Daha Fazla',
      videoTitle: 'idenfit tanıtım videosu',
      playLabel: 'Videoyu oynat',
    },
    efficiency: {
      title: 'Verimliliği Ölçen 5 Soru',
      text:
        'Çalışanlarınızın doğru yerde, doğru zamanda, doğru işleri kaliteli yaptığından emin olun. Her türlü işletmeye uygulanabilen bulut teknolojisi (SaaS), güçlü altyapısı ve güvenilir veritabanıyla, çalışanlarınızı ve operasyonlarınızı internet erişimi olan her yerden, dilediğiniz zaman yönetmenize olanak sağlar.',
      imageAlt: 'Verimliliği ölçen 5 soru — idenfit panel ekran görüntüsü',
    },
    panel: {
      title: 'Kullanıcı Dostu Panel',
      text:
        'idenfit, sade, net ve kullanımı kolay özellikleriyle insan kaynakları yönetimi boyunca elde edilen tüm verileri aynı panelde bulmanızı sağlar. Dinamik panel, farklı modüller içerisine eklemeler yapmanıza olanak tanıyacak şekilde tasarlanmıştır.',
      features: ['Anlık Bilgiler', 'Hatırlatmalar', 'Gerçek Zamanlı Monitör'],
      formHeading: 'Online tanıtım için hemen başvurun!',
      formSubmit: 'Hemen Başvur',
      imageAlt: 'idenfit kullanıcı dostu panel ekran görüntüsü',
    },
    suprema: {
      title: 'Temassız Tanımlama & Geçiş Sistemleri',
      text:
        'İdenfit, yüz tanıma ve parmak okuma cihazlarına entegre sistem sayesinde çalışanların kimlik doğrulaması gerçek zamanlı yapılabilir. Aynı zamanda giriş-çıkış ve mola süreleri takibi kolaylıkla yönetilebilir.',
      partnerLabel: 'Hardware partner',
    },
    testimonials: {
      title: 'Geliştirilebilir Çalışan Deneyimi',
      intro:
        'Çalışan algısında daha iyi bir yer edinmek ve çalışan deneyimini geliştirmek adına işletmelere insan odaklı çözümler sunuyoruz.',
      prevLabel: 'Önceki görüş',
      nextLabel: 'Sonraki görüş',
      ismailUnal: {
        quote:
          'idenfit, özellikle puantaj süreçlerini uçtan uca kurgulayabilmesi, kullanıcı dostu arayüzü ve İK\'nın farklı ihtiyaçlarına tek uygulama üzerinden sunduğu çok yönlü çözümlerle bizim için öne çıkan bir tercih oldu.',
        jobTitle: 'Zsa Zsa Zsu - People & Culture Manager',
      },
      emreOzcan: {
        quote:
          'idenfit ile ilk tanıştığımızda beni en çok etkileyen şey, idenfit\'in pratikliği ve farklı disiplinleri aynı platformda birleştirebilmesiydi. Arayüzünün sadeliği, çalışanlarımızın hızla adapte olabileceği bir sistem olduğunu gösteriyordu. Özellikle vardiyalı ve yoğun operasyon yürüten bizim gibi şirketler için, "çalışan dostu bir dijital çözüm" görmek çok kıymetliydi.',
        jobTitle: 'HAVAİST - Kurumsal İletişim Yöneticisi',
      },
    },
    hrtech: {
      title: 'Tüm İK İhtiyaçları İçin Tek Noktadan Çözüm',
      text:
        'Hrtech-Alliance, İnsan Kaynakları süreçlerini kolaylaştırmak ve sadeleştirmek için tasarlanmış son teknoloji bir İK platformudur. Idenfit uygulaması üzerinden erişilebilen Hrtech-Alliance, önde gelen İK teknoloji sağlayıcılarını bir araya getirerek, İK profesyonellerine zaman ve maliyet tasarrufu sağlayan birleşik bir çözüm sunar.',
    },
    faq: {
      viewAllLink: 'Tüm Soruları Görüntüleyin',
    },
  },
  faqPage: {
    pdfLabel: 'PDF İNDİR',
    metaDescription: 'Genel, ödeme, kurulum, müşteri deneyimi, veri güvenliği ve üyelik konularında idenfit hakkında sıkça sorulan soruların yanıtlarını bulun.',
  },
  sectorPage: {
    modulesHeading: 'Bu Sektöre Özel Modüller',
  },
  notFound: {
    pageTitle: 'Sayfa Bulunamadı',
    metaDescription:
      'Aradığınız sayfa bulunamadı. idenfit ana sayfasına dönün veya Blog, İletişim, Fiyatlar gibi popüler sayfalarımızı keşfedin.',
    heading: 'Sayfa Bulunamadı',
    description:
      'Aradığınız sayfa taşınmış, kaldırılmış olabilir ya da hiç var olmamış olabilir. Ana sayfaya dönebilir veya aşağıdaki popüler sayfalarımızdan birine göz atabilirsiniz.',
    backHomeButton: 'Ana Sayfaya Dön',
    popularLinksTitle: 'Popüler Sayfalar',
  },
};
