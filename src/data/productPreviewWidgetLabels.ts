// "Canlı dashboard" widget'ının (ProductPreviewWidget.tsx) yapısal/arayüz
// metinleri — 2026-08-31, kullanıcı isteği: "dil değişince dashboard'un da
// dili değişsin". Widget 2753 satır, 30+ kurgusal veri sabiti (her biri
// içine Türkçe etiket gömülü, ör. `{ label: 'İşe Giren', value: '42' }`)
// taşıyor — TAMAMININ 5 dile çevrilmesi çok büyük bir iş, kullanıcı
// onayıyla İKİ AŞAMAYA bölündü:
// - TIER 1 (BU DOSYA) — sekme adları, header panel başlıkları/aria-label'ları,
//   arama placeholder'ı, görünürlük/avatar menü öğeleri gibi YAPISAL
//   arayüz metni. Kurgusal veriye (sayı/renk ile aynı objede) BAĞLI DEĞİL.
// - TIER 2 (ERTELENDİ, ayrı bir/birkaç tur) — her sekmenin kart içeriğindeki
//   kurgusal veri etiketleri ("İşe Giren"/"Ayrılan"/ay-gün kısaltmaları vb.)
//   — şimdilik TÜM locale'lerde Türkçe kalıyor (bilinçli, ertelenmiş eksiklik).
//
// Kişi adları ("Elif Demir" vb.) ve marka isimleri (HiringOz/Anzera vb.)
// özel isim — hiçbir zaman çevrilmiyor, bu dosyanın kapsamı DIŞINDA.
//
// `Record<Locale, X>` KULLANILMADI (KARAR 1'in "uydurma/kopya çeviri yok"
// kuralı) — yalnızca tr/en dolu, nl/it/az ayrı turlarda eklenecek. Widget
// eksik bir locale için `PRODUCT_PREVIEW_WIDGET_LABELS[locale] ?? ...tr`
// ile TR'ye düşüyor (sitenin diğer yerlerindeki AYNI kademeli-i18n fallback
// ilkesi, ör. az'ın SSS/hukuki sayfalar için tr'ye düşmesiyle tutarlı).
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

const PRODUCT_PREVIEW_WIDGET_LABELS: Partial<Record<Locale, ProductPreviewWidgetLabels>> = { tr, en };

export function getProductPreviewWidgetLabels(locale: Locale): ProductPreviewWidgetLabels {
  return PRODUCT_PREVIEW_WIDGET_LABELS[locale] ?? tr;
}
