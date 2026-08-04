import type { Translations } from './types';

export const en: Translations = {
  nav: {
    products: 'PRODUCTS',
    whyIdenfit: 'WHY IDENFIT',
    sectors: 'INDUSTRIES',
    pricing: 'PRICING',
    customers: 'CUSTOMERS',
    company: 'COMPANY',
    discover: 'EXPLORE',
  },
  cta: {
    login: 'Log In',
    requestDemo: 'Request a Demo',
    submit: 'Submit',
  },
  hero: {
    // ⚠️ DÜZELTME (2026-08-04): önceki değerler TR'nin çevirisiydi (ör.
    // "Digitize All Your HR Processes Now!") — kaynak EN sayfasının kendi
    // GERÇEK native metni farklı çıktı (element-ID `0c8eb2b`/`4ec6dae`,
    // `idenfit.com/en/` canlı doğrulandı). Aşağıdaki tüm alanlar (title'dan
    // supportRequestLink'e) bu turda birebir canlı kaynaktan ölçüldü.
    title: 'Digitize All Human\nResources Processes Now!',
    description:
      'Manage all your HR processes on a single platform, from performance management to payroll and leave tracking, as well as asset and inventory management.',
    formName: 'Full Name',
    formPhone: 'Phone Number',
    formPhoneError: 'Enter a valid phone number (e.g. 555 123 45 67)',
    formPhoneCountryLabel: 'Select country code',
    formPhoneCountrySearchPlaceholder: 'Search country...',
    formPhoneCountryNoResults: 'No results found',
    formCompany: 'Company Name',
    formEmail: 'Email',
    formSubmit: 'Get Started',
    kvkkNotice: {
      prefix: 'I accept the ',
      kvkkLinkText: 'Contact Web GDPR Statement',
      middle: ' and the ',
      termsLinkText: 'Terms of Use',
      suffix: '.',
    },
    sideTitle: 'Holistic HR Applications',
    sideSubtitle: 'A Real-Time Bridge Between Employees and Human Resources',
    supportRequestLink: 'Click here to request support!',
    whatsappLabel: 'Message us on WhatsApp',
    callLabel: 'Call us now',
    presentationForm: {
      name: 'Full Name',
      phone: 'Phone Number',
      email: 'E-mail',
      company: 'Company Name',
    },
  },
  footer: {
    columnTitles: {
      about: 'ABOUT',
      products: 'PRODUCTS',
      general: 'GENERAL',
    },
    links: {
      about: {
        story: 'Our Story',
        contact: 'Contact',
        blog: 'Blog',
        kvkk: 'Data Protection Notice',
        security: 'Security',
        globalBrand: 'Global Brand Goal',
      },
      products: {
        employeeRecords: 'Employee Records',
        recruitment: 'Recruitment',
        performance: 'Performance',
        training: 'Training',
        timesheet: 'Timesheet Tracking',
        leaveManagement: 'Leave Management',
        hardware: 'Hardware',
        timeAttendance: 'Time & Attendance',
      },
      general: {
        pricing: 'Pricing & Modules',
        advantages: 'idenfit Advantages',
        successStories: 'Success Stories',
        faq: 'Frequently Asked Questions',
        consumerRights: 'Consumer Rights Agreement',
        securityPolicy: 'Privacy and Security Policy',
        distanceSalesAgreement: 'Distance Sales Agreement',
      },
    },
    copyright: '© idenfit, {year}',
    privacy: 'Privacy Policy',
    kvkk: 'Data Protection Notice',
    paymentMethodsAlt: 'Secure payment methods: iyzico, Troy, Visa, Mastercard, American Express',
  },
  mega: {
    urunler: {
      intro: {
        title: '360° Human Resources Program',
        description:
          "idenfit brings a holistic approach to human resources management, helping HR departments save time and focus on high-value work. Manage your entire HR process from A to Z on a single platform.",
        faqLink: 'Frequently Asked Questions',
      },
      employeeManagement: {
        title: 'Employee Management',
        overview: 'Overview',
        personalFile: 'Employee Records',
        corporateCalendar: 'Corporate Calendar',
        documents: 'Documents',
        expenseManagement: 'Expense Management',
        training: 'Training',
        assetManagement: 'Asset Management',
        messages: 'Messages',
        notes: 'Notes',
        shuttleServices: 'Shuttle Services',
        occupationalHealth: 'Occupational Health',
      },
      workforceManagement: {
        title: 'Workforce Management',
        overview: 'Overview',
        timeAttendance: 'Time & Attendance',
        timesheetTracking: 'Timesheet Tracking',
        leaveManagement: 'Leave Management',
        payroll: 'Payroll',
      },
      talentManagement: {
        title: 'Talent Management',
        onboarding: 'Onboarding',
        offboarding: 'Offboarding',
        employeeExperience: 'Employee Experience',
        survey: 'Survey',
        performanceOkr: 'Performance/OKR',
        recruitmentAts: 'Recruitment/ATS',
      },
      hardwareManagement: {
        title: 'Hardware Management',
        overview: 'Hardware Management',
        integratedDevices: 'Integrated Devices',
        biometricDevices: 'Biometric Devices',
        rfidDevices: 'RFID Devices',
        turnstiles: 'Turnstiles',
      },
      promo: {
        titleLines: ['LATER', 'IS', 'NEVER'],
        description: 'Get free HR digitalization consulting right now!',
        ctaText: 'GET STARTED NOW',
        imageAlt: 'HR digitalization consulting',
      },
    },
    sektorler: {
      title: 'Industries',
      food: 'Food',
      services: 'Services',
      tourism: 'Tourism',
      retail: 'Retail',
      energy: 'Energy',
      healthcare: 'Healthcare',
      education: 'Education',
      security: 'Security',
      facilityManagement: 'Facility Management',
      industryAutomotive: 'Industry & Automotive',
      legalConsulting: 'Legal & Consulting',
      logisticsDistribution: 'Logistics & Distribution',
    },
    kurumsal: {
      title: 'Company',
      about: 'About Us',
      contact: 'Contact',
      faq: 'FAQ',
      globalBrand: 'Global Brand Goal',
      promo: {
        category: 'CORPORATE',
        title: 'Meet the idenfit Team',
        imageAlt: 'idenfit team',
      },
    },
    kesfet: {
      contentTitle: 'Content',
      blog: 'Blog',
      blogDescription: 'Discover the latest developments in HR, and take your knowledge one step further.',
      digitalMaturityTest: 'Digital HR Maturity Test',
      digitalMaturityTestDescription: 'Learn your score in 3 minutes and get your free roadmap.',
      calculatorsTitle: 'Calculators',
      overtimePay: 'Overtime Pay Calculator',
      incomeTax: 'Income Tax Calculator',
      employerCost: 'Employer Cost Calculator',
      severancePay: 'Severance Pay Calculator',
      salaryRaise: 'Salary Raise Calculator',
      corporateTax: 'Corporate Tax Calculator',
      mealAllowance: 'Meal Allowance Calculator',
      noticePeriod: 'Notice Period & Compensation Calculator',
      reportsTitle: 'Reports',
      generationsWorkforce: {
        category: 'HR Trends',
        title: 'The Impact of Generations on the Workforce',
        imageAlt: 'The Impact of Generations on the Workforce report cover',
      },
      dataDrivenRecruitment: {
        category: 'Data-Driven',
        title: 'Data-Driven Recruitment Guide',
        imageAlt: 'Data-Driven Recruitment Guide cover',
      },
      digitalTransformation: {
        category: 'HR Transformation',
        title: '10-Step Digitalization Guide',
        imageAlt: '10-Step Digitalization Guide cover',
      },
      strategicHr: {
        category: 'HR Trends',
        title: 'Strategic Human Resources Guide',
        imageAlt: 'Strategic Human Resources Guide cover',
      },
    },
    ui: {
      nextReports: 'Next reports',
      prevReports: 'Previous reports',
    },
  },
  headerUi: {
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    brandHome: 'idenfit home',
    mainNav: 'Main menu',
    langLabel: 'Language switcher',
  },
  customerStories: {
    heroTitle: 'Customer\nSuccess Stories',
    heroDescription:
      'We share the success stories of some of the businesses that love working with us and have grown together with us.',
    ctaLabel: 'Apply Now',
    videoComingSoon: 'Video coming soon',
    videoPlayLabel: 'Play video',
    femas: {
      description:
        "With idenfit's software support, we made it easy for Femaş Group — active on 5 continents and in more than 100 countries — to manage its human resources and workforce processes digitally. Femaş Group now manages the shift planning and paperwork of its 3,000 employees accurately and easily from a single idenfit panel, saving both time and workload.",
      employeeCount: '3,000 employees',
    },
    civil: {
      description:
        "Our Civil journey began in 1996 in a 50 m² store in Kartal, Istanbul. Today, in our 29th year, we continue to reach millions of families through more than 100 stores and over 3,000 teammates.\n\nIn the mother & expectant mother, baby and child categories, we carefully curate clothing, footwear, toys, gear, baby care and fast-moving consumer products under one roof, so we can be there for families whenever they need us.\n\nGuided by our principles of quality, trust and accessible pricing, we remain a preferred choice in Turkey and abroad — proud to accompany a new family's story every day.",
      // 2026-07-27: live site now shows 3,000 (was 2,600 at export time).
      employeeCount: '3,000 employees',
      secondaryStat: '112 stores',
    },
    civilSecondary: {
      quote: {
        text:
          "The greatest asset that has carried the Civil family to success over our 29-year journey is our more than 3,000 colleagues. As we continue this powerful journey, we partnered with idenfit to digitalize our connection with our employees and create a more transparent, efficient work environment.\n\nWe moved all official paperwork and approval processes into the digital space — from shift schedules to leave tracking, from payroll signatures to overtime management. This makes it far easier for our employees to access their rights and obligations.\n\nThanks to the self-service HR structure, our employees can track their career development, view their benefits, and access meal and shuttle route information. Company procedures and internal correspondence are also shared transparently through idenfit.\n\nWe thank idenfit for this partnership, which has helped us offer every member of the Civil family an effective, accessible and sustainable human resources experience — strengthening our employees' satisfaction and loyalty.",
        name: 'Mustafa Yıldıran',
        role: 'Civil Chairman of the Board',
      },
    },
    // 2026-07-27: Yatsan's entire description + quote were rewritten on the
    // live site (mentions "six years ago", new named reference person with
    // her own photo) — the old export text is gone. Re-translated from the
    // current TR source.
    yatsan: {
      description:
        'As Yatsan, we started our digital transformation journey with idenfit six years ago to manage the HR processes we run across our factory and stores more efficiently and quickly.\n\nWith the idenfit application, we\'ve moved many processes into the digital space — from leave management to payroll, from check-in/check-out tracking to document management — reducing our operational workload.\n\nIn addition, we make information such as announcements, surveys, and meal menus easily accessible to our employees through the idenfit mobile app. Thanks to the complaint and suggestion feature, our employees can quickly share their ideas with us.',
      employeeCount: '900 employees',
      secondaryStat: '40 stores',
      quote: {
        text:
          "With this solution partnership, we've made our HR processes more transparent, accessible and user-friendly, while also increasing employee satisfaction.",
        name: 'Müzeyyen Kıran Mergen',
        role: 'Payroll, Personnel Records & Administrative Affairs Manager',
      },
    },
    dogSer: {
      employeeCount: '250 employees',
      secondaryStat: '10 locations',
      quote: {
        text:
          "In our project-based business, our HR processes changed for the better from the moment we started working with idenfit. Their openness to innovation and development, and their customer-focused approach in meeting our requests, fully matched our needs and expectations. Their solution-oriented support for every problem we encountered while digitalizing our HR processes was also a major factor in our long-term partnership with idenfit. Thanks to idenfit, we started managing timesheets and leave tracking easily in a digital environment, and our processes continue smoothly and enjoyably.",
        name: 'Cem Çolak',
        role: 'Administrative & Financial Affairs',
      },
    },
    tugbaKuruyemis: {
      employeeCount: '1,200 employees',
      secondaryStat: '111 stores',
      quote: {
        text:
          "With idenfit's software support, we helped Tuğba Kuruyemiş — which began its journey in 1980 and today serves customers through more than 100 stores across Turkey — manage its human resources and workforce processes easily in a digital environment. By managing routine paperwork digitally from a single idenfit panel, Tuğba Kuruyemiş also saves on workload as it digitalizes its HR processes.",
        name: 'Nevzat Atmaca',
      },
    },
  },
  home: {
    logoStrip: {
      caption: 'Over 1,000 happy customers have achieved digital HR transformation with us.',
    },
    dividers: {
      afterLogos: 'Eliminate Manual Processes, Simplify Your HR Operations!',
      afterFeatures: 'Save Time, Manage Your HR Processes Smarter!',
    },
    featureGrid: {
      title: 'Smart HR Solutions for Efficient Businesses',
      intro:
        'Discover human resources management that enhances productivity, strengthens employee engagement, and builds future-focused strategies by understanding how long your employees work, in which role, and in what state of mind.',
      timeLeave: {
        title: 'Time & Leave Management',
        text: 'Easily manage working hours and leaves to boost productivity and employee satisfaction.',
      },
      performance: {
        title: 'Performance Management',
        text: 'Empower your teams with fair and measurable performance tracking.',
      },
      employeeExperience: {
        title: 'Employee Experience',
        text: 'Create a people-focused workplace that enhances motivation and loyalty.',
      },
      analytics: {
        title: 'HR Analytics',
        text: 'Optimize your HR processes with data-driven decisions.',
      },
    },
    certifications: {
      titleLine1: 'Cloud Technology',
      titleLine2: '& Quality Standards',
      text:
        'Idenfit is a cloud-based platform that helps you manage your workforce more easily and securely. Backed by over 20 years of industry experience, all our products and services comply with ISO (27001 and 9001) standards, guaranteeing reliability and customer satisfaction.',
    },
    video: {
      title: 'Why Choose Idenfit?',
      ctaText: 'Learn More',
      videoTitle: 'idenfit introduction video',
      playLabel: 'Play video',
    },
    efficiency: {
      title: '5 Questions That Measure Productivity',
      text:
        'Ensure your employees are at the right place, at the right time, doing the right tasks with quality. Our cloud-based SaaS technology, with its powerful infrastructure and secure database, enables you to manage your employees and operations anytime, anywhere with internet access.',
      imageAlt: '5 questions that measure productivity — idenfit dashboard screenshot',
    },
    panel: {
      title: 'User-Friendly Dashboard',
      text:
        'Idenfit provides you with a clean, simple, and intuitive interface to access all HR data in one place throughout the employee lifecycle. The dynamic dashboard is designed to let you easily add new modules as your business evolves.',
      features: ['Real-Time Insights', 'Reminders', 'Live Monitoring'],
      formHeading: 'Apply now for an online demo!',
      formSubmit: 'Get Started',
      imageAlt: 'idenfit user-friendly dashboard screenshot',
    },
    suprema: {
      title: 'Contactless Identification & Access Systems',
      text:
        "With Idenfit's integration to face recognition and fingerprint devices, employee identity verification can be done in real-time. Entry-exit tracking and break times can also be managed with ease.",
      partnerLabel: 'Hardware partner',
    },
    testimonials: {
      title: 'Enhance Employee Experience',
      intro:
        'We provide people-centric solutions to help businesses improve their workplace perception and elevate the employee experience.',
      prevLabel: 'Previous testimonial',
      nextLabel: 'Next testimonial',
      ismailUnal: {
        quote:
          'Idenfit stood out for us with its ability to design end-to-end timekeeping processes, its user-friendly interface, and its versatile solutions that meet different HR needs through a single application.',
        jobTitle: 'Zsa Zsa Zsu - People & Culture Manager',
      },
      emreOzcan: {
        quote:
          "What impressed me most when we first met Idenfit was its practicality and ability to bring different functions together on a single platform. Its simple interface made it clear that our employees could adapt quickly. For companies like ours, operating with intensive and shift-based schedules, seeing a truly 'employee-friendly digital solution' was invaluable.",
        jobTitle: 'HAVAİST - Corporate Communications Manager',
      },
    },
    hrtech: {
      title: 'One-Stop Solution for All HR Needs',
      text:
        'Hrtech-Alliance is a next-generation HR platform designed to simplify and streamline HR processes. Accessible via the Idenfit app, Hrtech-Alliance brings together leading HR technology providers, offering HR professionals an integrated solution that saves time and reduces costs.',
    },
  },
  faqPage: {
    pdfLabel: 'PDF DOWNLOAD',
  },
};
