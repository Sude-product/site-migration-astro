// "Canlı dashboard" widget'ının (ProductPreviewWidget.tsx) yapısal/arayüz
// metinleri — 2026-08-31, kullanıcı isteği: "dil değişince dashboard'un da
// dili değişsin". Widget 2800+ satır, 30+ kurgusal veri sabiti (her biri
// içine Türkçe etiket gömülü, ör. `{ label: 'İşe Giren', value: '42' }`)
// taşıyor — TAMAMININ 5 dile çevrilmesi çok büyük bir iş, kullanıcı
// onayıyla İKİ AŞAMAYA bölündü:
// - TIER 1 (BU DOSYA) — sekme adları, header panel başlıkları/aria-label'ları,
//   arama placeholder'ı, görünürlük/avatar menü öğeleri gibi YAPISAL
//   arayüz metni. Kurgusal veriye (sayı/renk ile aynı objede) BAĞLI DEĞİL.
//   TR/EN/NL/IT/AZ'ın TAMAMI dolu (2026-08-31, 2. tur).
// - TIER 2 (AYRI bir tur, henüz başlanmadı) — her sekmenin kart içeriğindeki
//   kurgusal veri etiketleri ("İşe Giren"/"Ayrılan"/ay-gün kısaltmaları vb.)
//   — şimdilik TÜM locale'lerde Türkçe kalıyor (bilinçli, ertelenmiş eksiklik,
//   kapsamı bu dosyadakinden çok daha büyük — bkz. CLAUDE.md).
//
// Kişi adları ("Elif Demir" vb.) ve marka isimleri (HiringOz/Anzera vb.)
// özel isim — hiçbir zaman çevrilmiyor, bu dosyanın kapsamı DIŞINDA.
//
// NL/IT/AZ terminolojisi UYDURULMADI — `src/i18n/{nl,it,az}.ts`'in kendi
// nav/hero içeriğinde ZATEN kullandığı gerçek modül adları birebir yeniden
// kullanıldı (ör. NL "Verlofbeheer"/"Salarisadministratie", IT "Gestione
// Ferie e Permessi"/"Buste Paga", AZ "İcazə İdarəçiliyi"/"Əmək Haqqı") —
// bu üç dosyada karşılığı olmayan birkaç alan (ör. "Veri Analizi", "Eğitim
// Akademisi") için KARAR 1'e uygun profesyonel çeviri üretildi (EN'de aynı
// turda "Data Analysis"/"Training Academy" için yapılanın aynısı).
import type { Locale } from './nav';

export interface ProductPreviewWidgetLabels {
  navAriaLabel: string;
  tabs: {
    ik: string;
    izin: string;
    zaman: string;
    performans: string;
    bordro: string;
    iseAlim: string;
    calisanDeneyimi: string;
    moduller: string;
    raporlar: string;
    veriAnalizi: string;
    egitimAkademisi: string;
  };
  comingSoonBadge: string;
  searchPlaceholder: string;
  lightModeAriaLabel: string;
  darkModeAriaLabel: string;
  analytics: { ariaLabel: string; title: string };
  shortcuts: { ariaLabel: string; title: string };
  visibility: {
    ariaLabel: string;
    title: string;
    toggles: { pendingApprovals: string; hideInactive: string; compactView: string };
  };
  languageSelector: { ariaLabel: string; title: string };
  notifications: { ariaLabel: string; title: string; empty: string };
  tasks: { ariaLabel: string; title: string };
  /** Avatar açılır menüsünün TETİKLEYİCİ butonunun aria-label'ı — menü
   * içeriğinin kendi etiketleri (`avatar` altında) ile KARIŞTIRILMASIN. */
  userMenuAriaLabel: string;
  /** Kurgusal kullanıcının unvanı ("İK Yöneticisi") — kişinin ADI ("Deniz
   * Aydın") özel isim, KASITLI OLARAK çevrilmiyor; unvan gerçek bir iş
   * rolü etiketi olduğu için Tier 1 kapsamında. */
  jobTitle: string;
  avatar: { profile: string; settings: string; logout: string };
}

const tr: ProductPreviewWidgetLabels = {
  navAriaLabel: 'Panel önizleme modülleri',
  tabs: {
    ik: 'İnsan Kaynakları',
    izin: 'İzin Yönetimi',
    zaman: 'Zaman Yönetimi',
    performans: 'Performans Yönetimi',
    bordro: 'Bordro',
    iseAlim: 'İşe Alım',
    calisanDeneyimi: 'Çalışan Deneyimi',
    moduller: 'Modüller',
    raporlar: 'Raporlar',
    veriAnalizi: 'Veri Analizi',
    egitimAkademisi: 'Eğitim Akademisi',
  },
  comingSoonBadge: 'Yakında',
  searchPlaceholder: 'Personel ara...',
  lightModeAriaLabel: 'Aydınlık moda geç',
  darkModeAriaLabel: 'Karanlık moda geç',
  analytics: { ariaLabel: 'Analiz', title: 'Bugünün Özeti' },
  shortcuts: { ariaLabel: 'Kısayollar', title: 'Kısayollar' },
  visibility: {
    ariaLabel: 'Görünürlük Ayarları',
    title: 'Görünürlük Ayarları',
    toggles: {
      pendingApprovals: 'Bekleyen onayları göster',
      hideInactive: 'Devre dışı çalışanları gizle',
      compactView: 'Kompakt görünüm',
    },
  },
  languageSelector: { ariaLabel: 'Dil seçici', title: 'Dil Seçin' },
  notifications: { ariaLabel: 'Bildirimler', title: 'Bildirimler', empty: 'Henüz bildirim yok' },
  tasks: { ariaLabel: 'Görevler', title: 'Görevler' },
  userMenuAriaLabel: 'Kullanıcı menüsü',
  jobTitle: 'İK Yöneticisi',
  avatar: { profile: 'Profil', settings: 'Ayarlar', logout: 'Çıkış Yap' },
};

// EN çevirisi — modül isimleri sitenin KENDİ mevcut EN terminolojisiyle
// tutarlı (`src/i18n/en.ts`: "Leave Management"/"Performance Management"
// zaten kullanılıyor, aynı isimler burada da kullanıldı — ikinci bir
// terminoloji İCAT EDİLMEDİ).
const en: ProductPreviewWidgetLabels = {
  navAriaLabel: 'Panel preview modules',
  tabs: {
    ik: 'Human Resources',
    izin: 'Leave Management',
    zaman: 'Time Management',
    performans: 'Performance Management',
    bordro: 'Payroll',
    iseAlim: 'Recruitment',
    calisanDeneyimi: 'Employee Experience',
    moduller: 'Modules',
    raporlar: 'Reports',
    veriAnalizi: 'Data Analysis',
    egitimAkademisi: 'Training Academy',
  },
  comingSoonBadge: 'Coming Soon',
  searchPlaceholder: 'Search employees...',
  lightModeAriaLabel: 'Switch to light mode',
  darkModeAriaLabel: 'Switch to dark mode',
  analytics: { ariaLabel: 'Analytics', title: "Today's Summary" },
  shortcuts: { ariaLabel: 'Shortcuts', title: 'Shortcuts' },
  visibility: {
    ariaLabel: 'Visibility Settings',
    title: 'Visibility Settings',
    toggles: {
      pendingApprovals: 'Show pending approvals',
      hideInactive: 'Hide inactive employees',
      compactView: 'Compact view',
    },
  },
  languageSelector: { ariaLabel: 'Language selector', title: 'Select Language' },
  notifications: { ariaLabel: 'Notifications', title: 'Notifications', empty: 'No notifications yet' },
  tasks: { ariaLabel: 'Tasks', title: 'Tasks' },
  userMenuAriaLabel: 'User menu',
  jobTitle: 'HR Manager',
  avatar: { profile: 'Profile', settings: 'Settings', logout: 'Log Out' },
};

// NL terminolojisi `src/i18n/nl.ts`'ten yeniden kullanıldı: "Verlofbeheer"
// (leaveManagement), "Tijdregistratie" (timeAttendance), "Salarisadministratie"
// (payroll), "Werving" (recruitment), "Medewerkerservaring" (employeeExperience),
// "Rapporten" (reportsTitle), "Modules" (pricing.title'daki "Prijzen & Modules").
// nl.ts genelinde "Human Resources" için "HR" kısaltması kullanılıyor (ör.
// "HR-processen", "HR-manager") — tab adı da bu kalıba uydu.
const nl: ProductPreviewWidgetLabels = {
  navAriaLabel: 'Paneelvoorbeeld modules',
  tabs: {
    ik: 'HR',
    izin: 'Verlofbeheer',
    zaman: 'Tijdregistratie',
    performans: 'Prestatiebeheer',
    bordro: 'Salarisadministratie',
    iseAlim: 'Werving',
    calisanDeneyimi: 'Medewerkerservaring',
    moduller: 'Modules',
    raporlar: 'Rapporten',
    veriAnalizi: 'Data-analyse',
    egitimAkademisi: 'Opleidingsacademie',
  },
  comingSoonBadge: 'Binnenkort',
  searchPlaceholder: 'Medewerkers zoeken...',
  lightModeAriaLabel: 'Schakel naar lichte modus',
  darkModeAriaLabel: 'Schakel naar donkere modus',
  analytics: { ariaLabel: 'Analyse', title: 'Overzicht van Vandaag' },
  shortcuts: { ariaLabel: 'Snelkoppelingen', title: 'Snelkoppelingen' },
  visibility: {
    ariaLabel: 'Zichtbaarheidsinstellingen',
    title: 'Zichtbaarheidsinstellingen',
    toggles: {
      pendingApprovals: 'Openstaande goedkeuringen tonen',
      hideInactive: 'Inactieve medewerkers verbergen',
      compactView: 'Compacte weergave',
    },
  },
  languageSelector: { ariaLabel: 'Taalkiezer', title: 'Selecteer Taal' },
  notifications: { ariaLabel: 'Meldingen', title: 'Meldingen', empty: 'Nog geen meldingen' },
  tasks: { ariaLabel: 'Taken', title: 'Taken' },
  userMenuAriaLabel: 'Gebruikersmenu',
  jobTitle: 'HR-manager',
  avatar: { profile: 'Profiel', settings: 'Instellingen', logout: 'Uitloggen' },
};

// IT terminolojisi `src/i18n/it.ts`'ten yeniden kullanıldı: "Gestione Ferie
// e Permessi" (leaveManagement), "Controllo Accessi" (timeAttendance —
// sitenin KENDİ seçtiği karşılık, ikinci bir terim İCAT EDİLMEDİ), "Buste
// Paga" (payroll), "Selezione del Personale" (recruitment), "Esperienza
// del Dipendente" (employeeExperience), "Report" (reportsTitle), "Moduli"
// (pricing.title'daki "Prezzi e Moduli"), "Risorse Umane" (hero başlığı).
// `jobTitle`, `it.ts`'in KENDİ "Responsabile Risorse Umane" (customer
// story rolü, satır 312) ifadesiyle birebir eşleşiyor.
const it: ProductPreviewWidgetLabels = {
  navAriaLabel: 'Moduli anteprima pannello',
  tabs: {
    ik: 'Risorse Umane',
    izin: 'Gestione Ferie e Permessi',
    zaman: 'Controllo Accessi',
    performans: 'Gestione delle Performance',
    bordro: 'Buste Paga',
    iseAlim: 'Selezione del Personale',
    calisanDeneyimi: 'Esperienza del Dipendente',
    moduller: 'Moduli',
    raporlar: 'Report',
    veriAnalizi: 'Analisi dei Dati',
    egitimAkademisi: 'Accademia della Formazione',
  },
  comingSoonBadge: 'Prossimamente',
  searchPlaceholder: 'Cerca dipendenti...',
  lightModeAriaLabel: 'Passa alla modalità chiara',
  darkModeAriaLabel: 'Passa alla modalità scura',
  analytics: { ariaLabel: 'Analisi', title: 'Riepilogo di Oggi' },
  shortcuts: { ariaLabel: 'Scorciatoie', title: 'Scorciatoie' },
  visibility: {
    ariaLabel: 'Impostazioni di Visibilità',
    title: 'Impostazioni di Visibilità',
    toggles: {
      pendingApprovals: 'Mostra approvazioni in sospeso',
      hideInactive: 'Nascondi dipendenti inattivi',
      compactView: 'Vista compatta',
    },
  },
  languageSelector: { ariaLabel: 'Selettore lingua', title: 'Seleziona Lingua' },
  notifications: { ariaLabel: 'Notifiche', title: 'Notifiche', empty: 'Nessuna notifica al momento' },
  tasks: { ariaLabel: 'Attività', title: 'Attività' },
  userMenuAriaLabel: 'Menu utente',
  jobTitle: 'Responsabile Risorse Umane',
  avatar: { profile: 'Profilo', settings: 'Impostazioni', logout: 'Esci' },
};

// AZ terminolojisi `src/i18n/az.ts`'ten yeniden kullanıldı: "İcazə
// İdarəçiliyi" (leaveManagement), "Əmək Haqqı" (payroll), "İşə Qəbul"
// (recruitment), "İşçi Təcrübəsi" (employeeExperience), "Hesabatlar"
// (reportsTitle), "İnsan Resursları" (hero/nav'da tekrar eden gerçek
// terim). `jobTitle`, az.ts'in KENDİ "İnsan Resursları Müdiri" (customer
// story rolü, satır 302) ifadesiyle birebir eşleşiyor.
const az: ProductPreviewWidgetLabels = {
  navAriaLabel: 'Panel önizləmə modulları',
  tabs: {
    ik: 'İnsan Resursları',
    izin: 'İcazə İdarəçiliyi',
    zaman: 'Vaxt İdarəçiliyi',
    performans: 'Performans İdarəçiliyi',
    bordro: 'Əmək Haqqı',
    iseAlim: 'İşə Qəbul',
    calisanDeneyimi: 'İşçi Təcrübəsi',
    moduller: 'Modullar',
    raporlar: 'Hesabatlar',
    veriAnalizi: 'Məlumat Analizi',
    egitimAkademisi: 'Təlim Akademiyası',
  },
  comingSoonBadge: 'Tezliklə',
  searchPlaceholder: 'İşçi axtar...',
  lightModeAriaLabel: 'İşıqlı rejimə keç',
  darkModeAriaLabel: 'Qaranlıq rejimə keç',
  analytics: { ariaLabel: 'Analitika', title: 'Bugünün Xülasəsi' },
  shortcuts: { ariaLabel: 'Qısayollar', title: 'Qısayollar' },
  visibility: {
    ariaLabel: 'Görünürlük Ayarları',
    title: 'Görünürlük Ayarları',
    toggles: {
      pendingApprovals: 'Gözləyən təsdiqləri göstər',
      hideInactive: 'Qeyri-aktiv işçiləri gizlət',
      compactView: 'Yığcam görünüş',
    },
  },
  languageSelector: { ariaLabel: 'Dil seçici', title: 'Dil Seçin' },
  notifications: { ariaLabel: 'Bildirişlər', title: 'Bildirişlər', empty: 'Hələ bildiriş yoxdur' },
  tasks: { ariaLabel: 'Tapşırıqlar', title: 'Tapşırıqlar' },
  userMenuAriaLabel: 'İstifadəçi menyusu',
  jobTitle: 'İnsan Resursları Müdiri',
  avatar: { profile: 'Profil', settings: 'Ayarlar', logout: 'Çıxış' },
};

const PRODUCT_PREVIEW_WIDGET_LABELS: Partial<Record<Locale, ProductPreviewWidgetLabels>> = { tr, en, nl, it, az };

export function getProductPreviewWidgetLabels(locale: Locale): ProductPreviewWidgetLabels {
  return PRODUCT_PREVIEW_WIDGET_LABELS[locale] ?? tr;
}
