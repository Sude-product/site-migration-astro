import { createContext, useContext, useEffect, useId, useRef, useState, type ComponentType, type ReactNode } from 'react';
import {
  Clock,
  CalendarClock,
  Users,
  UserCheck,
  CalendarDays,
  XCircle,
  Target,
  Wallet,
  UserPlus,
  Heart,
  LayoutGrid,
  FileText,
  BarChart3,
  GraduationCap,
  Search,
  Eye,
  Moon,
  Sun,
  Bell,
  Grid3x3,
  Grid2x2,
  ChevronDown,
  CalendarPlus,
  MessageSquare,
  ClipboardCheck,
  CalendarRange,
  Check,
  EyeOff,
  User,
  Settings,
  LogOut,
  Star,
  Sparkles,
  Lock,
  KeyRound,
  Zap,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  UserX,
  AlertTriangle,
  Flag,
} from 'lucide-react';
import IdenfitLogo from './icons/IdenfitLogo.tsx';
import FlagIcon from './icons/FlagIcon.tsx';
import CountryFlagIcon, { type CountryFlagCode } from './icons/CountryFlagIcon.tsx';

// İnteraktif "ürün önizleme" widget'ı (2026-08-13) — gerçek app.idenfit.com
// panel ekran görüntülerinden (kullanıcı tarafından sağlandı) çıkarılan
// tasarım dili: renkli KPI kartları, ince gri kenarlıklı widget kartları,
// "Detaya Git →" pembe hap butonu, çizgi/donut/stacked-bar grafikler. Aşağıdaki
// TÜM veri (vardiya adları, şube isimleri, saatler, kişi isimleri) KURGUSAL/
// örnek — gerçek çalışan/şirket verisi DEĞİL. Projede chart kütüphanesi yok
// (package.json'da doğrulandı) — grafikler saf CSS/SVG ile çiziliyor, yeni
// bir ağır bağımlılık eklenmedi.
//
// PİLOT (2026-08-13) — "Zaman Yönetimi" + "İzin" + "İnsan Kaynakları" +
// "Performans Yönetimi" + "Veri Analizi" dolu. Kalan sekmeler (Bordro/
// İşe Alım gerçekten "Yakında" — referans ekran görüntüsünde de aynı
// rozetle işaretli; Çalışan Deneyimi/Modüller/Raporlar/Eğitim Akademisi
// sade pasif dolgu — gerçekte var oldukları için "Yakında" YAZILMIYOR,
// yanlış bilgi olurdu) `enabled:false` ile bekliyor, bkz. CLAUDE.md.
//
// Karanlık/aydınlık mod (2026-08-13, kullanıcı talebi — üst çubuktaki ay/güneş
// ikonuna tıklanınca gerçek üründeki gibi tema değişsin): `ThemeContext` ile
// yalnızca BU WIDGET'IN kendi iç renklerini değiştiriyor — site genelinde bir
// dark-mode altyapısı YOK (Tailwind v4 `dark:` variant'ı burada kurulu değil,
// bilinçli olarak KULLANILMADI) ve bu değişiklik sitenin geri kalanını
// ETKİLEMİYOR, tamamen widget'a özel/izole bir state.
const ThemeContext = createContext<{ isDark: boolean; toggle: () => void }>({ isDark: false, toggle: () => {} });
function useTheme() {
  return useContext(ThemeContext);
}

type TabKey =
  | 'zaman'
  | 'izin'
  | 'ik'
  | 'performans'
  | 'bordro'
  | 'ise-alim'
  | 'calisan-deneyimi'
  | 'moduller'
  | 'raporlar'
  | 'veri-analizi'
  | 'egitim-akademisi';

interface TabDef {
  key: TabKey;
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  enabled: boolean;
  /** Yalnızca gerçek üründe de "YAKINDA" rozetiyle gösterilen modüller için
   * (Bordro/İşe Alım, bkz. kullanıcının gönderdiği referans ekran görüntüsü)
   * — diğer pasif/dolgu sekmeler rozetsiz kalır (gerçekte var oldukları
   * için "Yakında" yanlış bilgi olurdu). */
  badge?: string;
}

const TABS: TabDef[] = [
  { key: 'zaman', label: 'Zaman Yönetimi', icon: Clock, enabled: true },
  { key: 'izin', label: 'İzin', icon: CalendarClock, enabled: true },
  { key: 'ik', label: 'İnsan Kaynakları', icon: Users, enabled: true },
  { key: 'performans', label: 'Performans Yönetimi', icon: Target, enabled: true },
  { key: 'bordro', label: 'Bordro', icon: Wallet, enabled: false, badge: 'Yakında' },
  { key: 'ise-alim', label: 'İşe Alım', icon: UserPlus, enabled: false, badge: 'Yakında' },
  { key: 'calisan-deneyimi', label: 'Çalışan Deneyimi', icon: Heart, enabled: false },
  { key: 'moduller', label: 'Modüller', icon: LayoutGrid, enabled: false },
  { key: 'raporlar', label: 'Raporlar', icon: FileText, enabled: false },
  { key: 'veri-analizi', label: 'Veri Analizi', icon: BarChart3, enabled: true },
  { key: 'egitim-akademisi', label: 'Eğitim Akademisi', icon: GraduationCap, enabled: false },
];

// Otomatik sekme gezinmesi (2026-08-20, kullanıcı isteği — Personio.com'un
// ana sayfasındaki canlı dashboard gibi widget'ın kendi kendine gezinmesi)
// yalnızca FONKSİYONEL sekmeler arasında döngü yapıyor — "Yakında" rozetli/
// pasif dolgu sekmeler (Bordro/İşe Alım vb.) zaten tıklanamaz durumda,
// otomatik gezinme de bunları atlıyor.
const ENABLED_TABS = TABS.filter((t) => t.enabled);

// --- "Zaman Yönetimi" sekmesi — kurgusal veri ---

const SHIFTS: { label: string; percent: number }[] = [
  { label: 'Sabah Vardiyası (08:00-17:00)', percent: 94 },
  { label: 'Akşam Vardiyası (16:00-24:00)', percent: 88 },
  { label: 'Gece Vardiyası (00:00-08:00)', percent: 76 },
  { label: 'Ofis Personeli', percent: 97 },
  { label: 'Saha Ekibi', percent: 82 },
];

// Sıra Merkez/Teknopark/Anadolu/Avrupa şubeleriyle sabit — `OVERTIME_MONTHS`
// her ayın `values` dizisi bu SIRAYLA okunuyor.
const BRANCHES: { name: string; color: string }[] = [
  { name: 'Merkez Şube', color: '#3B82F6' },
  { name: 'Teknopark Şube', color: '#10B981' },
  { name: 'Anadolu Şube', color: '#F59E0B' },
  { name: 'Avrupa Şube', color: '#8B5CF6' },
];

const OVERTIME_MONTHS: { label: string; values: number[] }[] = [
  { label: 'Oca', values: [8, 4, 3, 2] },
  { label: 'Şub', values: [6, 5, 2, 3] },
  { label: 'Mar', values: [12, 8, 5, 4] },
  { label: 'Nis', values: [10, 14, 6, 5] },
  { label: 'May', values: [14, 10, 9, 7] },
  { label: 'Haz', values: [11, 13, 8, 6] },
];

// 2026-08-19, kullanıcının paylaştığı gerçek app.idenfit.com "Zaman
// Yönetimi" dashboard ekran görüntüsüyle (Toplam Personel/Bugün Devam
// Eden/Bekleyen İzin Talebi KPI'ları + 4'lü mini istatistik satırı +
// "Devam Takibi" haftalık grafiği) karşılaştırılıp, o ekranda olup
// widget'ta HENÜZ olmayan öğeler eklendi — gerçek sayılar/şirket verisi
// DEĞİL, aynı KURGUSAL veri ilkesiyle (dosya başı yorumu) farklı örnek
// rakamlar kullanıldı.
const TIME_KPIS: {
  icon: ComponentType<{ className?: string; style?: { color?: string }; strokeWidth?: number }>;
  color: string;
  value: string;
  trendUp: boolean;
  trendPercent: string;
  subtext: string;
  sparkline: number[];
}[] = [
  { icon: Users, color: '#3B82F6', value: '156', trendUp: true, trendPercent: '4.20%', subtext: '8 yeni işe alım (bu ay)', sparkline: [40, 44, 42, 48, 52, 58, 62] },
  { icon: UserCheck, color: '#10B981', value: '142', trendUp: false, trendPercent: '2.10%', subtext: '%91 devam oranı', sparkline: [60, 58, 55, 57, 52, 50, 46] },
  { icon: CalendarDays, color: '#F59E0B', value: '6', trendUp: true, trendPercent: '50.00%', subtext: 'Bu hafta 2 talep oluşturuldu', sparkline: [2, 3, 2, 4, 3, 5, 6] },
];

const TIME_MINI_STATS: { color: string; value: string; label: string; sparkline: number[] }[] = [
  { color: '#EF4444', value: '9', label: 'Devamsız', sparkline: [12, 10, 11, 8, 9, 7, 9] },
  { color: '#EF4444', value: '2', label: 'Geç Gelen', sparkline: [1, 2, 3, 1, 2, 4, 2] },
  { color: '#F59E0B', value: '3', label: 'Erken Çıkan', sparkline: [4, 3, 5, 2, 3, 4, 3] },
  { color: '#8B5CF6', value: '5', label: 'Bugün İzinli', sparkline: [3, 4, 3, 5, 4, 6, 5] },
];

// "Devam Takibi" — 7 günlük giriş-çıkış özeti, 4 kategori (gerçek referansla
// AYNI renk kodları: Mevcut mavi/Geç Gelen kırmızı/İzinli amber/Erken Çıkan
// mor). `ATTENDANCE_STATUS_COLORS` sırayla `values` dizisiyle eşleşiyor.
const ATTENDANCE_STATUS_COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6'];
const ATTENDANCE_WEEK: { label: string; values: number[] }[] = [
  { label: 'Pzt', values: [58, 2, 3, 1] },
  { label: 'Sal', values: [61, 1, 2, 2] },
  { label: 'Çar', values: [55, 3, 4, 1] },
  { label: 'Per', values: [60, 2, 1, 3] },
  { label: 'Cum', values: [52, 4, 3, 2] },
  { label: 'Cmt', values: [18, 1, 0, 1] },
  { label: 'Paz', values: [9, 0, 0, 0] },
];

// "Ortalama Çalışma Saati" — haftalık, 2 seri (temel mesai mavi + fazla
// mesai kırmızı üst bindirme), `OvertimeSummaryCard`'ın şube-bazlı aylık
// grafiğinden FARKLI bir kesit (haftalık/tüm şubeler ortalaması).
const AVG_HOURS_WEEK: { label: string; hours: number; overtime: number }[] = [
  { label: 'Pzt', hours: 8, overtime: 0.5 },
  { label: 'Sal', hours: 8.5, overtime: 1.5 },
  { label: 'Çar', hours: 8, overtime: 0 },
  { label: 'Per', hours: 8.5, overtime: 0 },
  { label: 'Cum', hours: 7.5, overtime: 0 },
  { label: 'Cmt', hours: 4, overtime: 0 },
  { label: 'Paz', hours: 0, overtime: 0 },
];

// --- "İzin" sekmesi — kurgusal veri (2026-08-13, gerçek app.idenfit.com
// izin ekranı referans alınarak revize edildi — önceki "Bekleyen İzin
// Talebi tek KPI kartı + izin talebi satırları" sürümünün YERİNE geçti). ---

const LEAVE_STATS: { icon: ComponentType<{ className?: string }>; color: string; value: string; label: string }[] = [
  { icon: UserCheck, color: '#10B981', value: '3', label: 'Bugün İzinli' },
  { icon: Clock, color: '#F59E0B', value: '3', label: 'Onay Bekleyen' },
  { icon: CalendarDays, color: '#3B82F6', value: '24', label: 'Bu Ay Kullanılan Gün' },
  { icon: XCircle, color: '#EF4444', value: '0', label: 'Reddedilen' },
];

// "15 gün" (14+1) — DonutChart'ın merkez etiketiyle toplamı eşleşiyor.
const LEAVE_TYPE_SEGMENTS: { label: string; value: number; color: string }[] = [
  { label: 'Yıllık İzin', value: 14, color: '#3B82F6' },
  { label: 'Taşınma İzni', value: 1, color: '#F59E0B' },
];

// `count`'lar `LEAVE_STATS`'taki "Onay Bekleyen"(3)/"Reddedilen"(0) ile
// TUTARLI — aynı ayın aynı veri kümesi, iki farklı görselleştirme.
const APPROVAL_STATS: { label: string; count: number; color: string }[] = [
  { label: 'Onaylandı', count: 5, color: '#10B981' },
  { label: 'Bekliyor', count: 3, color: '#F59E0B' },
  { label: 'Reddedildi', count: 0, color: '#9CA3AF' },
];

// 2026-08-19 — kullanıcının paylaştığı gerçek app.idenfit.com "İzin"
// dashboard ekran görüntüsüyle karşılaştırılıp, o ekranda olup widget'ta
// HENÜZ olmayan 4 öğe eklendi (Aylık İzin Trendi/Birim Bazlı İzin
// Kullanımı/İzin Çakışma Uyarısı/En Çok İzin Kullanan Birimler) — eski
// içerik (Türü Dağılımı/Onay Durumu Özeti) KALDIRILMADI, altına eklendi
// ("Zaman Yönetimi"nin 12. tur'daki AYNI ilkesi). Birim isimleri gerçek
// ekran görüntüsündeki müşteri hesabı adları ("idenfit"/"Arge Departmanı"
// — o an giriş yapılmış GERÇEK bir müşteri hesabına ait) DEĞİL, widget'ın
// KENDİ kurulu `BRANCHES` setinden (Merkez/Teknopark/Anadolu/Avrupa Şube,
// `OvertimeSummaryCard`'da zaten kullanılıyor) türetildi — ikinci bir
// isim seti İCAT EDİLMEDİ.
const LEAVE_TREND_MONTHS = ['Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu'];
const LEAVE_TREND_DATA = [9, 6, 8, 7, 14, 29];

const LEAVE_BY_BRANCH: { name: string; color: string; days: number; avgPerPerson: string }[] = [
  { name: 'Merkez Şube', color: BRANCHES[0].color, days: 22, avgPerPerson: '2,1 gün' },
  { name: 'Teknopark Şube', color: BRANCHES[1].color, days: 15, avgPerPerson: '1,6 gün' },
  { name: 'Anadolu Şube', color: BRANCHES[2].color, days: 8, avgPerPerson: '1,2 gün' },
  { name: 'Avrupa Şube', color: BRANCHES[3].color, days: 3, avgPerPerson: '0,8 gün' },
];

// --- "İnsan Kaynakları" sekmesi — kurgusal veri ---

const HEADCOUNT_MONTHS = ['Eyl', 'Eki', 'Kas', 'Ara', 'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu'];
const HEADCOUNT_DATA = [58, 60, 63, 65, 64, 67, 69, 68, 71, 73, 74, 76];

const HR_EVENTS: { name: string; initials: string; avatarColor: string; description: string; emoji: string }[] = [
  { name: 'Elif Demir', initials: 'ED', avatarColor: '#EC4899', description: 'Doğum Günü — Bugün!', emoji: '🎂' },
  { name: 'Can Aydın', initials: 'CA', avatarColor: '#10B981', description: '2. İş Yıldönümü — 15 Ağustos', emoji: '🏆' },
  { name: 'Zeynep Arslan', initials: 'ZA', avatarColor: '#F59E0B', description: '3. İş Yıldönümü — 18 Ağustos', emoji: '🏆' },
];

// 2026-08-19 — kullanıcının paylaştığı gerçek app.idenfit.com "İnsan
// Kaynakları" dashboard ekran görüntüsüyle karşılaştırılıp, o ekranda
// olup widget'ta HENÜZ olmayan öğeler eklendi (Çalışan Devir Hızı/Onay
// Bekleyen İşlemler/Takvim/Deneme Süresi Takibi/Sözleşme Takibi) — eski
// içerik (Headcount Trendi/Doğum Günü & Yıldönümü) KALDIRILMADI.
// **Bilinçli sınır:** ekran görüntüsünün en üstündeki, kesik/kırpılmış
// bir donut grafiği (o an giriş yapılmış GERÇEK bir müşteri hesabına ait
// "DLA GIDA"/"Delisan güvenlik firması"/"TEST" gibi gerçek firma adları
// taşıyan bir dağılım) BİLEREK eklenmedi — hem gerçek müşteri verisi
// içeriyor hem de kartın tam başlığı/türü görüntüde kırpılmış, güvenilir
// şekilde yeniden üretilemez. Sayılar (37/17/%22.8 gibi) gerçek ekrandan
// KOPYALANMADI, aynı formatta farklı kurgusal rakamlar üretildi.
const TURNOVER_MONTHS = ['Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu'];
const TURNOVER_HIRED = [5, 6, 4, 8, 9, 10];
const TURNOVER_LEFT = [2, 3, 2, 4, 3, 5];
const TURNOVER_STATS: { label: string; value: string; color: string }[] = [
  { label: 'İşe Giren', value: '42', color: '#10B981' },
  { label: 'Ayrılan', value: '19', color: '#EF4444' },
  { label: 'Devir Oranı', value: '%18.4', color: '#F59E0B' },
];

const PENDING_APPROVALS: {
  icon: ComponentType<{ className?: string; style?: { color?: string }; strokeWidth?: number }>;
  color: string;
  label: string;
  count: number;
}[] = [
  { icon: Wallet, color: '#10B981', label: 'Avans Talepleri', count: 2 },
  { icon: Clock, color: '#8B5CF6', label: 'Fazla Mesai Talepleri', count: 1 },
  { icon: GraduationCap, color: '#3B82F6', label: 'Eğitim Talepleri', count: 3 },
  { icon: FileText, color: '#F59E0B', label: 'Evrak Talepleri', count: 0 },
  { icon: UserX, color: '#EF4444', label: 'Eksik Kayıt Talepleri', count: 1 },
];

// Takvim — gerçek Ağustos 2026 takvimi (hafta PZT'den başlıyor, WP/idenfit
// kaynağıyla AYNI yerleşim: 27 Tem – 6 Eyl arası 42 hücre/6 satır). Gün
// isimleri/sıralaması UYDURMA değil, gerçek takvim matematiği — yalnızca
// hangi günlerin "etkinlik" taşıdığı kurgusal. `isToday` gerçek oturumun
// "bugün"üne (19 Ağustos 2026) denk getirildi, ekran görüntüsündeki 18'e
// DEĞİL (o, ekran görüntüsünün alındığı ANA özgü).
type CalendarEventType = 'birthday' | 'anniversary' | 'leave';
const EVENT_DOT_COLORS: Record<CalendarEventType, string> = {
  birthday: '#EC4899',
  anniversary: '#10B981',
  leave: '#EF4444',
};
const CALENDAR_WEEKDAYS = ['PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT', 'PAZ'];
const CALENDAR_CELLS: { day: number; muted?: boolean; isToday?: boolean; events?: CalendarEventType[] }[] = [
  { day: 27, muted: true },
  { day: 28, muted: true },
  { day: 29, muted: true },
  { day: 30, muted: true },
  { day: 31, muted: true },
  { day: 1 },
  { day: 2 },
  { day: 3 },
  { day: 4 },
  { day: 5 },
  { day: 6 },
  { day: 7 },
  { day: 8 },
  { day: 9 },
  { day: 10 },
  { day: 11 },
  { day: 12 },
  { day: 13 },
  { day: 14 },
  { day: 15, events: ['anniversary'] },
  { day: 16 },
  { day: 17 },
  { day: 18, events: ['anniversary'] },
  { day: 19, isToday: true, events: ['birthday'] },
  { day: 20 },
  { day: 21 },
  { day: 22 },
  { day: 23 },
  { day: 24 },
  { day: 25 },
  { day: 26, events: ['leave'] },
  { day: 27 },
  { day: 28 },
  { day: 29 },
  { day: 30 },
  { day: 31 },
  { day: 1, muted: true },
  { day: 2, muted: true },
  { day: 3, muted: true },
  { day: 4, muted: true },
  { day: 5, muted: true },
  { day: 6, muted: true },
];

interface TrackingBoxData {
  color: string;
  bgLight: string;
  count: number;
  primaryLabel: string;
  secondaryLabel: string;
}
const PROBATION_TRACKING: TrackingBoxData[] = [
  { color: '#EF4444', bgLight: '#FEE2E2', count: 2, primaryLabel: '2 Ay', secondaryLabel: '30 gün' },
  { color: '#F59E0B', bgLight: '#FEF3C7', count: 3, primaryLabel: '6 Ay', secondaryLabel: '180 gün' },
  { color: '#10B981', bgLight: '#D1FAE5', count: 1, primaryLabel: '1 Yıl', secondaryLabel: '365 gün' },
];
const CONTRACT_TRACKING: TrackingBoxData[] = [
  { color: '#EF4444', bgLight: '#FEE2E2', count: 1, primaryLabel: '30 gün', secondaryLabel: '' },
  { color: '#F59E0B', bgLight: '#FEF3C7', count: 2, primaryLabel: '60 gün', secondaryLabel: '' },
  { color: '#10B981', bgLight: '#D1FAE5', count: 0, primaryLabel: '90 gün', secondaryLabel: '' },
];

// --- "Performans Yönetimi" sekmesi — kurgusal veri (2026-08-25, kullanıcının
// paylaştığı gerçek app.idenfit.com Hedefler (OKR)/KPI liste görünümü
// referans alınarak, önceki 360°-Değerlendirme-ağırlıklı içeriğin YERİNE
// geçti). Renkler widget'ın KENDİ kurulu paletinden (#EF4444/#F59E0B/
// #10B981/#3B82F6/#8B5CF6/#EC4899) — yeni bir renk İCAT EDİLMEDİ.

const PERFORMANCE_KPI_STATS: { icon: ComponentType<{ className?: string }>; color: string; value: string; label: string }[] = [
  { icon: Target, color: '#EF4444', value: '5', label: 'Aktif KPI' },
  { icon: TrendingUp, color: '#3B82F6', value: '%29', label: 'Ortalama İlerleme' },
  { icon: AlertTriangle, color: '#F59E0B', value: '3', label: 'Riskli / Beklenen Altı' },
  { icon: Clock, color: '#8B5CF6', value: '3', label: 'Check-in Bekleyen' },
];

interface GoalItem {
  name: string;
  scope: string;
  category: string;
  period: string;
  keyResultCount: number;
  percent: number;
  status: string;
  statusColor: string;
  avatars: { initials: string; color: string }[];
}
const PERFORMANCE_GOALS: GoalItem[] = [
  {
    name: 'Yıllık ciroyu %20 artırmak',
    scope: 'Şirket',
    category: 'Finansal Hedefler',
    period: '2026 H2',
    keyResultCount: 3,
    percent: 31,
    status: 'Riskli',
    statusColor: '#EF4444',
    avatars: [
      { initials: 'DT', color: '#3B82F6' },
      { initials: 'SA', color: '#8B5CF6' },
    ],
  },
  {
    name: 'Yeni pazarlara açılmak',
    scope: 'Takım',
    category: 'Sales',
    period: '2026 H2',
    keyResultCount: 2,
    percent: 44,
    status: 'Yolunda',
    statusColor: '#10B981',
    avatars: [
      { initials: 'GR', color: '#F59E0B' },
      { initials: 'AT', color: '#EC4899' },
    ],
  },
  {
    name: 'Yeni nesil mobil deneyimi hayata geçirmek',
    scope: 'Şirket',
    category: 'Ürün Geliştirme',
    period: '2026 H2',
    keyResultCount: 5,
    percent: 52,
    status: 'Yolunda',
    statusColor: '#10B981',
    avatars: [
      { initials: 'DT', color: '#3B82F6' },
      { initials: 'GR', color: '#10B981' },
    ],
  },
  {
    name: 'Marka bilinirliğini artırmak',
    scope: 'Takım',
    category: 'Marketing',
    period: '2026 H2',
    keyResultCount: 2,
    percent: 12,
    status: 'Beklenen Altı',
    statusColor: '#F59E0B',
    avatars: [
      { initials: 'AC', color: '#EF4444' },
      { initials: 'IK', color: '#3B82F6' },
    ],
  },
];

// Yukarıdaki "Riskli" hedefin ("Yıllık ciroyu %20 artırmak") anahtar sonuç
// kırılımı — kullanıcının paylaştığı ilerleme çubuğu + "takvime göre
// beklenen %" karşılaştırma tasarımını temsil ediyor. Tüm 4 hedef için
// TEKRARLANMADI (widget'ın kompakt dengesini bozmamak için tek örnek).
interface KeyResultItem {
  name: string;
  lastCheckIn: string;
  status: string;
  statusColor: string;
  currentValueLabel: string;
  currentPercent: number;
  startLabel: string;
  endLabel: string;
  expectedPercent: number;
  pace: 'ahead' | 'behind';
}
const GOAL_KEY_RESULTS: KeyResultItem[] = [
  {
    name: 'Yeni müşteri kazanımı',
    lastCheckIn: '20 Ağu',
    status: 'Yolunda',
    statusColor: '#10B981',
    currentValueLabel: '26 müşteri',
    currentPercent: 65,
    startLabel: '0 müşteri',
    endLabel: '40 müşteri',
    expectedPercent: 55,
    pace: 'ahead',
  },
  {
    name: 'Ortalama sipariş tutarı',
    lastCheckIn: '18 Ağu',
    status: 'Riskli',
    statusColor: '#EF4444',
    currentValueLabel: '155 ₺',
    currentPercent: 31,
    startLabel: '0 ₺',
    endLabel: '500 ₺',
    expectedPercent: 42,
    pace: 'behind',
  },
];

// --- "Veri Analizi" sekmesi — kurgusal veri (2026-08-13). Tema:
// departman/aylık devamsızlık analizi — "Zaman Yönetimi" sekmesindeki
// vardiya devam oranlarıyla AYNI konu ailesinden ama farklı bir kesit
// (departman kırılımı + trend), içerik tekrarı değil. ---

const DEPARTMENT_ABSENTEEISM: { label: string; value: number }[] = [
  { label: 'İK', value: 2.1 },
  { label: 'Satış', value: 5.4 },
  { label: 'Operasyon', value: 6.8 },
  { label: 'Finans', value: 1.9 },
  { label: 'Üretim', value: 7.2 },
  { label: 'Destek', value: 3.5 },
];

const ABSENTEEISM_TREND_MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'];
const ABSENTEEISM_TREND_DATA = [4.2, 3.8, 5.1, 4.6, 3.9, 3.2];

// 2026-08-19 — kullanıcının paylaştığı gerçek app.idenfit.com "Veri
// Analizi > Zaman" ve "Veri Analizi > Deneyim" alt sayfa ekran
// görüntülerinden eklendi. Gerçek üründe "Veri Analizi" 6 alt sayfalı
// AYRI bir bölüm (İzin/Deneyim/Envanter/Operasyon/İnsan Kaynakları/
// Zaman) — widget'ın TEK sekmeli yapısına sığdırmak için 2 sayfanın öne
// çıkan modülleri SEÇİLİP yoğunlaştırıldı (kullanıcı "diğer sayfaların
// boyutlarına uyacak şekilde" dedi): "Zaman" alt sayfasındaki 4 AYRI
// tam-boy grafik (Gelenler/Geç Gelenler/Erken Çıkanlar/Devamsızlık),
// `TIME_MINI_STATS`'ın AYNI kompakt deseniyle TEK bir mini-istatistik
// satırına birleştirildi — 4 ayrı kart eklemek bu sekmeyi diğerlerinden
// çok daha uzun yapardı. Sayılar gerçek ekrandan KOPYALANMADI (o ekranda
// "50" gibi bir aykırı değer vardı — muhtemelen toplu bir işlemden,
// temsili değil), aynı formatta farklı kurgusal rakamlar üretildi.
const ACTIVE_EMPLOYEE_TREND_WEEKS = ['06 Tem', '13 Tem', '20 Tem', '27 Tem', '03 Ağu', '10 Ağu', '17 Ağu'];
const ACTIVE_EMPLOYEE_TREND_DATA = [64, 69, 67, 71, 73, 70, 76];

const DAILY_MOVEMENTS: { color: string; value: string; label: string; sparkline: number[] }[] = [
  { color: '#10B981', value: '6', label: 'Gelenler', sparkline: [3, 5, 4, 6, 5, 7, 6] },
  { color: '#F59E0B', value: '2', label: 'Geç Gelenler', sparkline: [1, 3, 2, 4, 2, 3, 2] },
  { color: '#8B5CF6', value: '1', label: 'Erken Çıkanlar', sparkline: [2, 1, 3, 1, 2, 1, 1] },
  { color: '#EF4444', value: '3', label: 'Devamsızlık', sparkline: [5, 3, 4, 2, 6, 3, 3] },
];

// 2026-08-19 (2. tur, aynı gün) — kullanıcı "Veri Analizi diğer
// modüllerden az duruyor, 1-2 grafik daha ekle" dedi: gerçek "Veri
// Analizi > Zaman" ekran görüntüsündeki 4 tam-boy grafikten 2'si
// (Gelenler/Geç Gelenler) `SimpleBarChart` ile tam detay kartı olarak da
// eklendi — `DailyMovements`'ın AYNI kurgusal haftalık rakamları
// (`sparkline` dizileri) yeniden kullanıldı, İKİNCİ bir veri seti
// İCAT EDİLMEDİ (mini-özet ve tam grafik aynı haftayı gösteriyor,
// tutarlı). Gün etiketleri gerçek takvim tarihleri (12-18 Ağustos 2026,
// `HRCalendarCard`'ın "bugün"üyle [19 Ağustos] AYNI haftanın hemen
// öncesi).
const WEEK_DAY_LABELS_AUG = ['12 Ağu', '13 Ağu', '14 Ağu', '15 Ağu', '16 Ağu', '17 Ağu', '18 Ağu'];
const NEW_ARRIVALS_WEEK: { label: string; value: number }[] = WEEK_DAY_LABELS_AUG.map((label, i) => ({
  label,
  value: DAILY_MOVEMENTS[0].sparkline[i],
}));
const LATE_ARRIVALS_WEEK: { label: string; value: number }[] = WEEK_DAY_LABELS_AUG.map((label, i) => ({
  label,
  value: DAILY_MOVEMENTS[1].sparkline[i],
}));

// --- Üst uygulama header'ının "Kısayollar" açılır paneli — kurgusal
// veri (2026-08-13, PİLOT turu). 6 kısayol, kullanıcının referans
// görüntüsünden verilen AYNI sırayla. Gerçek bir hedef/işlev YOK
// (`RecalculateButton`/`EvaluationRow`'un dekoratif eylem butonlarıyla
// AYNI ilke) — panel yalnızca görsel olarak dolu durmalı. ---
const HEADER_SHORTCUTS: { icon: ComponentType<{ className?: string; style?: { color?: string } }>; label: string; color: string }[] = [
  { icon: UserPlus, label: 'Çalışan Oluştur', color: '#3B82F6' },
  { icon: CalendarPlus, label: 'İzin Oluştur', color: '#F59E0B' },
  { icon: FileText, label: 'Rapor Oluştur', color: '#10B981' },
  { icon: MessageSquare, label: 'Mesaj Gönder', color: '#8B5CF6' },
  { icon: ClipboardCheck, label: 'Günlük Puantaj', color: '#EC4899' },
  { icon: CalendarRange, label: 'Vardiya Takvimi', color: '#06B6D4' },
];

// --- "HRTECHTOOLS" paneli (3x3 ızgara ikonu) — kullanıcının verdiği TAM
// spesifikasyon, birebir: idenfit'in kendi entegrasyon ekosistemi/kardeş
// ürünleri. Marka isimleri (HiringOz/DataAssist/Anzera/A.Onkey/Workmana)
// UYDURULMADI, kullanıcının verdiği AYNEN kullanıldı. İkon kaynağı
// (gerçek marka logosu mu) netleşmediği için jenerik lucide ikonlarla
// başlandı (CLAUDE.md'de zaten bu şekilde önerilmişti) — gerçek logo
// sağlanırsa `icon` alanları değiştirilebilir. ---
// 2026-08-14 — canlı app.idenfit.com'un GERÇEK ekran görüntüsüyle piksel
// karşılaştırması sonrası yeniden tasarlandı (önceki sürüm renkli daire
// ikonlar kullanıyordu — gerçek ürün MONOKROM: idenfit'in kendi uygulamaları
// (HR/Performance) düz siyah outline ikon/arka plansız, 3. parti entegrasyonlar
// koyu dolu kare (Payroll/Access) veya altıgen (Workforce) + beyaz ikon.
// **Bilinçli sınır:** Hiring/Payroll/Access/Workforce/LMS ikonları gerçek
// ekran görüntüsünde büyük ihtimalle o firmaların KENDİ marka işaretleri
// (özellikle LMS'in "AnzerA" wordmark'ı net bir logotype) — piksel piksel
// KOPYALANMADI (üçüncü parti marka kimliğini taklit etmemek için), yalnızca
// genel STİL (monokrom, şekil ayrımı) jenerik lucide ikonlarla yakınsandı.
// Etiketler LİTERAL büyük harfle yazıldı (CSS `uppercase` KULLANILMADI —
// "idenfit"/"HiringOz" gibi içinde küçük "i" olan kelimeler `lang="tr"`
// altında CSS uppercase ile "İ" harfine döner, "LATER IS NEVER" bug'ıyla
// AYNI kalıcı ders).
type AppTileStyle = 'plain' | 'dark-square' | 'dark-hexagon' | 'wordmark';
interface AppTileData {
  icon?: ComponentType<{ className?: string; strokeWidth?: number }>;
  /** Yalnızca `style:'wordmark'` için — ikon yerine gösterilen stilize metin. */
  wordmark?: string;
  app: string;
  brand: string;
  style: AppTileStyle;
  /** 2026-08-14 — gerçek dış ürün URL'i, kullanıcının verdiği eşleştirme
   * AYNEN kullanıldı (uydurulmadı). Yeni sekmede açılır. */
  href: string;
}
const APPS_GRID: AppTileData[] = [
  { icon: Star, app: 'HR', brand: 'IDENFIT', style: 'plain', href: 'https://idenfit.com/' },
  { icon: Target, app: 'PERFORMANCE', brand: 'IDENFIT', style: 'plain', href: 'https://app.conectohub.com/' },
  { icon: Sparkles, app: 'HIRING', brand: 'HIRINGOZ', style: 'plain', href: 'https://hiringoz.com/en-US/home' },
  { icon: Lock, app: 'PAYROLL', brand: 'DATASSIST', style: 'dark-square', href: 'https://login.dakika.com.tr/login' },
  { wordmark: 'Anzera', app: 'LMS', brand: 'ANZERA', style: 'wordmark', href: 'https://anzera.com.tr/tr' },
  { icon: KeyRound, app: 'ACCESS', brand: 'A. ONKEY', style: 'dark-square', href: 'https://accessonkey.com/' },
];
const WORKFORCE_APP: AppTileData = {
  icon: Zap,
  app: 'WORKFORCE',
  brand: 'WORKMANA',
  style: 'dark-hexagon',
  href: 'https://workmana.com/tr/',
};
// Koyu kare/altıgen ikon zeminlerinin sabit rengi — gerçek ekran görüntüsünde
// widget'ın kendi karanlık/aydınlık moduyla DEĞİŞMİYOR gibi görünüyor, bu
// yüzden `isDark`'tan bağımsız sabit tutuldu (`LATER IS NEVER`in sabit
// `text-brand` renginiyle AYNI ilke).
const APP_DARK_TILE_BG = '#27272A';

// --- Üst header'ın "Dil seçici" paneli (TR bayrağı) — kullanıcının
// verdiği TAM liste, AYNI sırayla: Türkçe işaretli en üstte, sonra 10
// dil. `CountryFlagIcon.tsx`'te (telefon ülke kodu seçicisinden, 45+
// ülke) bu 11 dilin TAMAMININ bayrağı ZATEN vardı — `FlagIcon.tsx`'in
// yalnızca 4 dile (TR/GB/NL/IT) sahip olması nedeniyle yeni SVG çizmek
// GEREKMEDİ, ikinci bir kaynak İCAT EDİLMEDİ. **Tıklanınca gerçekten dil
// DEĞİŞTİRMEZ** — diğer dekoratif panellerle AYNI ilke, yalnızca görsel
// bir liste (kritik kısıtlama, kullanıcı talimatı). ---
const LANGUAGE_LIST: { code: CountryFlagCode; name: string }[] = [
  { code: 'TR', name: 'Türkçe' },
  { code: 'GB', name: 'İngilizce' },
  { code: 'DE', name: 'Almanca' },
  { code: 'ES', name: 'İspanyolca' },
  { code: 'PT', name: 'Portekizce' },
  { code: 'IT', name: 'İtalyanca' },
  { code: 'FR', name: 'Fransızca' },
  { code: 'NL', name: 'Flemenkçe' },
  { code: 'SA', name: 'Arapça' },
  { code: 'RU', name: 'Rusça' },
  { code: 'AZ', name: 'Azerbaycanca' },
];

// --- 2. zil ("Görevler") — kullanıcı "aynı Bildirimler panelini açabilir
// veya farklı içerik, sen karar ver" dedi. Karar: FARKLI içerik — ilk
// zil (Bildirimler) sistem uyarıları için boş durumda kalırken, bu ikinci
// zil DOLU/aksiyon-gerektiren bekleyen onaylar listesi (İzin sekmesindeki
// "Onay Bekleyen" temasıyla tutarlı) — iki zilin farklı bir amacı
// olduğunu gösteriyor, aksi halde aynı boş paneli iki kez göstermek
// anlamsız olurdu. ---
const PENDING_TASKS: { icon: ComponentType<{ className?: string; style?: { color?: string } }>; color: string; text: string }[] = [
  { icon: CalendarDays, color: '#F59E0B', text: '3 izin talebi onayını bekliyor' },
  { icon: FileText, color: '#3B82F6', text: '1 rapor incelemeni bekliyor' },
  { icon: Target, color: '#8B5CF6', text: 'Q3 performans değerlendirmesi tamamlanmadı' },
];

// --- Analiz (mini bar-chart ikonu) — kullanıcı "sen öner" dedi, referans
// görüntüde net değildi. Kısa bir "Bugünün Özeti" — widget'ın kurgusal
// veri ilkesiyle tutarlı, `LEAVE_STATS`'ın "Onay Bekleyen"(3) sayısıyla
// UYUMLU (aynı kurgusal ay/durum). ---
const TODAY_SUMMARY: { icon: ComponentType<{ className?: string; style?: { color?: string } }>; color: string; label: string; value: string }[] = [
  { icon: UserCheck, color: '#10B981', label: 'Bugün Giriş Yapan', value: '142 / 150' },
  { icon: Clock, color: '#3B82F6', label: 'Ortalama Çalışma Süresi', value: '7s 42dk' },
  { icon: ClipboardCheck, color: '#F59E0B', label: 'Açık Talepler', value: '5' },
];

// --- Paylaşılan görsel parçalar ---

// Büyük çizgi grafiği (Headcount Trendi için). `viewBox` sabit bir iç
// koordinat sistemi (600×160) tanımlıyor, gerçek genişlik CSS ile esniyor —
// `preserveAspectRatio="none"` X/Y'yi bağımsız ölçeklendiriyor (noktalar çok
// geniş/dar konteynerlerde hafifçe oval görünebilir, kabul edilebilir bir
// sadeleştirme — kalıcı bir chart kütüphanesi olmadan tam orantılı ölçekleme
// gereksiz karmaşıklık katardı). `dotFill` karanlık modda noktaların kart
// zeminiyle AYNI renk olması için dışarıdan geçiriliyor (aksi halde beyaz
// noktalar koyu zeminde yabancı dururdu).
function LineChart({
  data,
  labels,
  color = '#3B82F6',
  dotFill = '#ffffff',
}: {
  data: number[];
  labels: string[];
  color?: string;
  dotFill?: string;
}) {
  const { isDark } = useTheme();
  const gradientId = useId();
  const width = 600;
  const height = 160;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  // `pad` (2026-08-21, kullanıcı bulgusu — "çizgi kayması/taşması") —
  // noktalar önceden TAM x=0/x=width ve y=0/y=height'ta duruyordu; `r=3` +
  // `strokeWidth=2` dairesi + `overflow-visible` birleşince son nokta
  // kartın sağ/üst/alt kenarından TAŞIYORDU (canlı taramada görüldü).
  // Çizim alanı her yönden `pad` kadar içeri çekilerek dairelerin
  // TAMAMEN viewBox içinde kalması sağlandı — `overflow-visible` yine de
  // gerekli (hover/vurgu için ileride büyüyebilecek noktalar), ama artık
  // gerçekten taşan bir şey yok.
  const pad = 6;
  const stepX = (width - pad * 2) / (data.length - 1);
  const points = data.map(
    (v, i) => [pad + i * stepX, pad + (height - pad * 2) - ((v - min) / range) * (height - pad * 2)] as const
  );
  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${width - pad},${height} L${pad},${height} Z`;
  const yTicks = [max, Math.round((max + min) / 2), min];

  return (
    <div>
      <div className="flex gap-3">
        <div className={`flex h-36 flex-col justify-between text-right text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>
          {yTicks.map((v, i) => (
            <span key={i}>{v}</span>
          ))}
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="h-36 flex-1 overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
          <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {points.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill={dotFill} stroke={color} strokeWidth="2" />
          ))}
        </svg>
      </div>
      <div className={`mt-2 flex justify-between pl-7 text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

// İki serili çizgi grafiği ("Çalışan Devir Hızı"nın işe giren/ayrılan
// karşılaştırması için, 2026-08-19) — `LineChart`'ın AYNI nokta/yol
// hesaplama tekniğinin 2 seriye genelleştirilmiş hâli, eksen etiketleri
// olmadan (iki serinin farklı ölçeklerini TEK bir sağ-eksende göstermek
// yanıltıcı olurdu — `TrendKpiCard`'ın sparkline'ları gibi eksensiz/sade
// tutuldu, gerçek sayılar zaten üstteki 3 istatistik kutusunda var).
function DualLineChart({
  dataA,
  dataB,
  labels,
  colorA,
  colorB,
  dotFill = '#ffffff',
}: {
  dataA: number[];
  dataB: number[];
  labels: string[];
  colorA: string;
  colorB: string;
  dotFill?: string;
}) {
  const { isDark } = useTheme();
  const width = 600;
  const height = 140;
  const all = [...dataA, ...dataB];
  const max = Math.max(...all);
  const min = Math.min(...all, 0);
  const range = max - min || 1;
  // `pad` — `LineChart`'ın AYNI taşma düzeltmesi (bkz. onun yorumu).
  const pad = 6;
  const stepX = (width - pad * 2) / (dataA.length - 1);
  const toPoints = (data: number[]) =>
    data.map((v, i) => [pad + i * stepX, pad + (height - pad * 2) - ((v - min) / range) * (height - pad * 2)] as const);
  const pointsA = toPoints(dataA);
  const pointsB = toPoints(dataB);
  const pathOf = (pts: readonly (readonly [number, number])[]) =>
    pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-20 w-full overflow-visible" aria-hidden="true">
        <path d={pathOf(pointsA)} fill="none" stroke={colorA} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={pathOf(pointsB)} fill="none" stroke={colorB} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pointsA.map(([x, y], i) => (
          <circle key={`a${i}`} cx={x} cy={y} r="3" fill={dotFill} stroke={colorA} strokeWidth="2" />
        ))}
        {pointsB.map(([x, y], i) => (
          <circle key={`b${i}`} cx={x} cy={y} r="3" fill={dotFill} stroke={colorB} strokeWidth="2" />
        ))}
      </svg>
      <div className={`mt-2 flex justify-between text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

// Tek seri, dolgu renkli sütun grafiği (Veri Analizi'nin departman kırılımı
// için, 2026-08-13) — `OvertimeSummaryCard`'ın çok-şubeli/stacked
// tekniğinin tek-serili sadeleştirilmiş hâli, aynı eksen/ölçekleme mantığı
// yeniden kullanıldı (ayrı bir chart kütüphanesi eklenmedi).
function SimpleBarChart({ data, unit = '' }: { data: { label: string; value: number }[]; unit?: string }) {
  const { isDark } = useTheme();
  const maxValue = Math.max(...data.map((d) => d.value));
  const axisMax = Math.max(5, Math.ceil(maxValue / 5) * 5);
  const axisLabels = [1, 0.75, 0.5, 0.25, 0].map((f) => Math.round(axisMax * f));

  return (
    <div className="flex gap-4">
      <div className={`flex h-44 flex-col justify-between text-right text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>
        {axisLabels.map((v, i) => (
          <span key={i}>{v}</span>
        ))}
      </div>
      <div
        className={`flex flex-1 items-end justify-between gap-3 border-l pl-4 sm:gap-4 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
      >
        {data.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-2.5">
            <div
              className={`flex h-44 w-full max-w-12 flex-col-reverse overflow-hidden rounded-t-md ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
            >
              <div className="rounded-t-md bg-brand" style={{ height: `${(d.value / axisMax) * 100}%` }} title={`${d.label}: ${d.value}${unit}`} />
            </div>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Renkli üst-kenarlıklı istatistik kartı (İzin sekmesinin 4'lü KPI satırı
// için, 2026-08-13) — kullanıcının gönderdiği referans ekran görüntüsündeki
// sade stil (ikon + büyük sayı + etiket, üstte renkli ince kenarlık).
function StatCard({
  icon: Icon,
  color,
  value,
  label,
}: {
  icon: ComponentType<{ className?: string; style?: { color?: string }; strokeWidth?: number }>;
  color: string;
  value: string;
  label: string;
}) {
  const { isDark } = useTheme();
  return (
    <div
      className={`rounded-xl border border-t-4 p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
      style={{ borderTopColor: color }}
    >
      <Icon className="h-5 w-5" style={{ color }} strokeWidth={2.5} aria-hidden="true" />
      <p className={`mt-2.5 text-2xl font-bold ${isDark ? 'text-white' : 'text-heading'}`}>{value}</p>
      <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>{label}</p>
    </div>
  );
}

// Halka (donut) grafik — merkezde toplam değeri gösteriyor, `strokeDasharray`/
// `strokeDashoffset` ile segment payları çiziliyor (`-rotate-90` ile üstten
// başlaması sağlanıyor, standart pasta/halka grafik tekniği).
function DonutChart({ segments, centerLabel }: { segments: { label: string; value: number; color: string }[]; centerLabel: string }) {
  const { isDark } = useTheme();
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let cumulativeFraction = 0;

  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="relative h-28 w-28 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke={isDark ? '#374151' : '#F3F4F6'} strokeWidth="12" />
          {segments.map((s) => {
            const fraction = total > 0 ? s.value / total : 0;
            const dash = fraction * circumference;
            const offset = -(cumulativeFraction * circumference);
            cumulativeFraction += fraction;
            return (
              <circle
                key={s.label}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth="12"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-heading'}`}>{centerLabel}</span>
        </div>
      </div>
      <div className="space-y-2.5">
        {segments.map((s) => (
          <div key={s.label} className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-body'}`}>
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
            <span>
              {s.label}: <strong className={`font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>{s.value}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Çok segmentli yatay ilerleme çubuğu (Onay Durumu Özeti için) — 0
// oranındaki segmentler (ör. "Reddedildi %0") çağıran taraftan filtrelenip
// geçirilmeli, aksi halde görünmez bir 0-genişlik div oluşur (zararsız ama
// gereksiz).
function SegmentedProgressBar({ segments }: { segments: { color: string; percent: number }[] }) {
  const { isDark } = useTheme();
  return (
    <div className={`flex h-3.5 w-full overflow-hidden rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
      {segments.map((s, i) => (
        <div key={i} style={{ width: `${s.percent}%`, backgroundColor: s.color }} />
      ))}
    </div>
  );
}

function SectionMiniHeader({
  icon: Icon,
  title,
  href,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  // Opsiyonel (2026-08-25, kullanıcı isteği) — "Veri Analizi" sekmesi
  // artık BAĞLANMIYOR: kullanıcı "zaten web sitesinden giriliyor, app
  // içinde göstermeye gerek yok" dedi (`/hesaplama-araclari/`'a
  // yönlendiriyordu). `href` verilmezse "Detaya Git →" hiç render
  // edilmez.
  href?: string;
}) {
  const { isDark } = useTheme();
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
        <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>{title}</h3>
      </div>
      {href && (
        <a
          href={href}
          className="shrink-0 rounded-full bg-brand-light px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-brand transition-all hover:bg-brand hover:text-white hover:shadow-[0_2px_8px_rgba(255,0,0,0.35)]"
        >
          Detaya Git →
        </a>
      )}
    </div>
  );
}

function WidgetCard({
  title,
  subtitle,
  headerRight,
  children,
}: {
  title: string;
  subtitle: string;
  /** Başlığın sağında dekoratif bir öğe (ör. "Şube" filtre rozeti) —
   * verilmezse hiçbir şey render edilmez, mevcut kartların tamamı BUNU
   * kullanmadan çalışmaya devam ediyor. */
  headerRight?: ReactNode;
  children: ReactNode;
}) {
  const { isDark } = useTheme();
  return (
    <div
      className={`overflow-hidden rounded-xl border p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.09)] ${
        isDark ? 'border-gray-700 bg-gray-800 hover:border-gray-600' : 'border-gray-200 bg-white hover:border-brand/25'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>{title}</h4>
          <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>{subtitle}</p>
        </div>
        {headerRight}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ShiftAttendanceCard() {
  const { isDark } = useTheme();
  return (
    <WidgetCard title="Vardiya Devam Oranı" subtitle="Vardiya bazlı devam durumu">
      <div className="space-y-4">
        {SHIFTS.map((shift) => (
          <div
            key={shift.label}
            className={`flex items-center gap-3 rounded-lg p-2 -m-2 transition-colors ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
          >
            <span className={`w-36 shrink-0 truncate text-xs sm:w-48 sm:text-sm ${isDark ? 'text-gray-300' : 'text-body'}`}>
              {shift.label}
            </span>
            <div className={`h-3 flex-1 overflow-hidden rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="h-full rounded-full bg-brand" style={{ width: `${shift.percent}%` }} />
            </div>
            <span className={`w-10 shrink-0 text-right text-sm font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>
              %{shift.percent}
            </span>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

function OvertimeSummaryCard() {
  const { isDark } = useTheme();
  const monthTotals = OVERTIME_MONTHS.map((m) => m.values.reduce((a, b) => a + b, 0));
  const axisMax = Math.max(10, Math.ceil(Math.max(...monthTotals) / 10) * 10);
  const axisLabels = [1, 0.75, 0.5, 0.25, 0].map((f) => Math.round(axisMax * f));

  return (
    <WidgetCard title="Fazla Mesai Özeti" subtitle="Aylık — Şubeye göre">
      <div className="flex gap-4">
        <div className={`flex h-36 flex-col justify-between text-right text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>
          {axisLabels.map((v) => (
            <span key={v}>{v}</span>
          ))}
        </div>
        <div
          className={`flex flex-1 items-end justify-between gap-3 border-l pl-4 sm:gap-4 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
        >
          {OVERTIME_MONTHS.map((month) => (
            <div key={month.label} className="flex flex-1 flex-col items-center gap-2.5">
              <div
                className={`flex h-36 w-full max-w-10 flex-col-reverse overflow-hidden rounded-t-md ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
              >
                {month.values.map((v, i) => (
                  <div
                    key={BRANCHES[i].name}
                    style={{ height: `${(v / axisMax) * 100}%`, backgroundColor: BRANCHES[i].color }}
                    title={`${BRANCHES[i].name}: ${v} sa`}
                  />
                ))}
              </div>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>{month.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        {BRANCHES.map((b) => (
          <span key={b.name} className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: b.color }} aria-hidden="true" />
            {b.name}
          </span>
        ))}
      </div>
    </WidgetCard>
  );
}

// Küçük dolgu alan (sparkline) grafiği — `TrendKpiCard`/`MiniTrendStatCard`
// için, 2026-08-19. `useId` ile her SVG'nin kendi benzersiz gradyan id'si
// var (aynı sayfada birden fazla sparkline aynı anda render edildiğinde
// `<linearGradient>` id çakışması OLMASIN diye — bir bar chart'ın aksine
// bu component aynı ekranda 7 kez tekrarlanıyor).
function MiniAreaSparkline({ data, color }: { data: number[]; color: string }) {
  const gradId = useId();
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = data.length > 1 ? 100 / (data.length - 1) : 0;
  const points = data.map((v, i) => `${i * stepX},${32 - ((v - min) / range) * 28}`);
  const linePath = `M${points.join(' L')}`;
  const areaPath = `${linePath} L100,32 L0,32 Z`;
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-10 w-full" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Renkli ikon + trend rozeti (yukarı/aşağı ok + yüzde) + sparkline taşıyan
// KPI kartı — kullanıcının paylaştığı gerçek "Zaman Yönetimi" dashboard
// ekran görüntüsündeki (Toplam Personel/Bugün Devam Eden/Bekleyen İzin
// Talebi) kart stili, 2026-08-19. Trend rengi (yeşil/kırmızı) YALNIZCA
// yön (yukarı/aşağı) gösteriyor — referans görüntüde de "Bekleyen İzin
// Talebi"nin artışı yeşil rozetle gösteriliyordu (metrik anlamı ne olursa
// olsun, mekanik ok-yönü kuralı).
function TrendKpiCard({
  icon: Icon,
  color,
  value,
  trendUp,
  trendPercent,
  subtext,
  sparkline,
}: {
  icon: ComponentType<{ className?: string; style?: { color?: string }; strokeWidth?: number }>;
  color: string;
  value: string;
  trendUp: boolean;
  trendPercent: string;
  subtext: string;
  sparkline: number[];
}) {
  const { isDark } = useTheme();
  const TrendIcon = trendUp ? TrendingUp : TrendingDown;
  return (
    <div
      className={`rounded-xl border p-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.09)] ${
        isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}1A` }}>
          <Icon className="h-4 w-4" style={{ color }} strokeWidth={2.5} aria-hidden="true" />
        </span>
        <span
          className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            trendUp
              ? isDark
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-emerald-50 text-emerald-600'
              : isDark
                ? 'bg-red-500/15 text-red-400'
                : 'bg-red-50 text-red-600'
          }`}
        >
          <TrendIcon className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
          {trendPercent}
        </span>
      </div>
      <p className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-heading'}`}>{value}</p>
      <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>{subtext}</p>
      <div className="mt-1.5">
        <MiniAreaSparkline data={sparkline} color={color} />
      </div>
    </div>
  );
}

// 4'lü mini istatistik satırı (Devamsız/Geç Gelen/Erken Çıkan/Bugün
// İzinli) — referans görüntüdeki "renkli nokta + büyük sayı + sparkline"
// stili, 2026-08-19.
function MiniTrendStatCard({ color, value, label, sparkline }: { color: string; value: string; label: string; sparkline: number[] }) {
  const { isDark } = useTheme();
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.09)] ${
        isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
          <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-heading'}`}>{value}</span>
        </div>
        <p className={`mt-0.5 text-xs whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-muted'}`}>{label}</p>
      </div>
      <div className="min-w-0 flex-1">
        <MiniAreaSparkline data={sparkline} color={color} />
      </div>
    </div>
  );
}

// "Devam Takibi" — 7 günlük, 4 kategorili yığılmış çubuk grafiği (Mevcut/
// Geç Gelen/İzinli/Erken Çıkan), 2026-08-19. `OvertimeSummaryCard`'ın
// şube-bazlı yığılmış çubuk TEKNİĞİNİN aynısı, kategoriler/renkler farklı.
function AttendanceWeekCard() {
  const { isDark } = useTheme();
  const legend = [
    { name: 'Mevcut', color: ATTENDANCE_STATUS_COLORS[0] },
    { name: 'Geç Gelen', color: ATTENDANCE_STATUS_COLORS[1] },
    { name: 'İzinli', color: ATTENDANCE_STATUS_COLORS[2] },
    { name: 'Erken Çıkan', color: ATTENDANCE_STATUS_COLORS[3] },
  ];
  const dayTotals = ATTENDANCE_WEEK.map((d) => d.values.reduce((a, b) => a + b, 0));
  const axisMax = Math.max(10, Math.ceil(Math.max(...dayTotals) / 10) * 10);
  const axisLabels = [1, 0.75, 0.5, 0.25, 0].map((f) => Math.round(axisMax * f));

  return (
    <WidgetCard title="Devam Takibi" subtitle="Son 7 günlük giriş-çıkış özeti">
      <div className="flex gap-4">
        <div className={`flex h-36 flex-col justify-between text-right text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>
          {axisLabels.map((v) => (
            <span key={v}>{v}</span>
          ))}
        </div>
        <div
          className={`flex flex-1 items-end justify-between gap-2 border-l pl-4 sm:gap-3 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
        >
          {ATTENDANCE_WEEK.map((day) => (
            <div key={day.label} className="flex flex-1 flex-col items-center gap-2.5">
              <div
                className={`flex h-36 w-full max-w-8 flex-col-reverse overflow-hidden rounded-t-md ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
              >
                {day.values.map((v, i) => (
                  <div
                    key={legend[i].name}
                    style={{ height: `${(v / axisMax) * 100}%`, backgroundColor: ATTENDANCE_STATUS_COLORS[i] }}
                    title={`${legend[i].name}: ${v}`}
                  />
                ))}
              </div>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>{day.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        {legend.map((l) => (
          <span key={l.name} className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} aria-hidden="true" />
            {l.name}
          </span>
        ))}
      </div>
    </WidgetCard>
  );
}

// "Ortalama Çalışma Saati" — haftalık, 2 seri (temel mesai + fazla mesai
// üst bindirme), 2026-08-19. "Tüm Şubeler" rozeti `HRTECHTOOLS`/dil
// seçici panellerindeki AYNI ilkeyle dekoratif (`aria-hidden`, gerçek bir
// dropdown AÇMIYOR — widget genelinde "gerçek etkileşim yoksa süslemeye
// bırak" kuralı).
function AverageHoursCard() {
  const { isDark } = useTheme();
  const dayTotals = AVG_HOURS_WEEK.map((d) => d.hours + d.overtime);
  const axisMax = Math.max(4, Math.ceil(Math.max(...dayTotals) / 2) * 2);
  const axisLabels = [1, 0.75, 0.5, 0.25, 0].map((f) => Math.round(axisMax * f * 10) / 10);

  return (
    <WidgetCard title="Ortalama Çalışma Saati" subtitle="Son 7 gün — Tüm Şubeler">
      <div className={`mb-1 flex justify-end`}>
        <span
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
            isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-body'
          }`}
          aria-hidden="true"
        >
          Tüm Şubeler
          <ChevronDown className="h-3 w-3" aria-hidden="true" />
        </span>
      </div>
      <div className="flex gap-4">
        <div className={`flex h-36 flex-col justify-between text-right text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>
          {axisLabels.map((v) => (
            <span key={v}>{v}s</span>
          ))}
        </div>
        <div
          className={`flex flex-1 items-end justify-between gap-2 border-l pl-4 sm:gap-3 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
        >
          {AVG_HOURS_WEEK.map((day) => (
            <div key={day.label} className="flex flex-1 flex-col items-center gap-2.5">
              <div
                className={`flex h-36 w-full max-w-8 flex-col-reverse overflow-hidden rounded-t-md ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
              >
                <div className="bg-[#3B82F6]" style={{ height: `${(day.hours / axisMax) * 100}%` }} title={`Çalışma: ${day.hours}s`} />
                <div className="rounded-t-md bg-brand" style={{ height: `${(day.overtime / axisMax) * 100}%` }} title={`Fazla Mesai: ${day.overtime}s`} />
              </div>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>{day.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        <span className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>
          <span className="h-2 w-2 rounded-full bg-[#3B82F6]" aria-hidden="true" />
          Ortalama Çalışma Saati
        </span>
        <span className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>
          <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
          Ortalama Fazla Mesai
        </span>
      </div>
    </WidgetCard>
  );
}

function TimeManagementTab() {
  return (
    <div>
      <SectionMiniHeader icon={Clock} title="Zaman" href="/puantaj-takip-programi-modulu/" />
      {/* 2026-08-19 — kullanıcı gerçek app.idenfit.com "Zaman Yönetimi"
          dashboard ekran görüntüsünü paylaşıp "burada olmayanlar da
          eklensin" dedi: KPI kartları + mini istatistik satırı + "Devam
          Takibi" haftalık grafiği o ekranda VARDI, widget'ta YOKTU —
          eklendi. Önceki içerik (Vardiya Devam Oranı/Fazla Mesai Özeti)
          KALDIRILMADI, yeni içeriğin ALTINA eklendi (kullanıcı "eklensin"
          dedi, "değiştirilsin" değil). */}
      {/* 2026-08-19, 3. tur — kullanıcı "dashboard çok aşağı doğru olmuş,
          boyu kısalt" dedi: bloklar arası boşluk (`mt-4 lg:mt-6`→`mt-3
          lg:mt-4`) + grafik yükseklikleri (`h-44`→`h-36`, bkz. yukarıdaki
          kart component'leri) küçültüldü — içerik AZALMADI, yalnızca
          daha kompakt yerleşti. */}
      <div className="grid gap-3 sm:grid-cols-3 lg:gap-4">
        {TIME_KPIS.map((kpi) => (
          <TrendKpiCard key={kpi.value + kpi.subtext} {...kpi} />
        ))}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:mt-4 lg:grid-cols-4 lg:gap-4">
        {TIME_MINI_STATS.map((stat) => (
          <MiniTrendStatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="mt-3 grid gap-4 lg:mt-4 lg:grid-cols-2 lg:gap-6">
        <AttendanceWeekCard />
        <AverageHoursCard />
      </div>
      <div className="mt-3 grid gap-4 lg:mt-4 lg:grid-cols-2 lg:gap-6">
        <ShiftAttendanceCard />
        <OvertimeSummaryCard />
      </div>
    </div>
  );
}

function LeaveTypeDistributionCard() {
  return (
    <WidgetCard title="İzin Türü Dağılımı" subtitle="Bu ay kullanılan izinler">
      <DonutChart segments={LEAVE_TYPE_SEGMENTS} centerLabel="15 gün" />
    </WidgetCard>
  );
}

function ApprovalStatusCard() {
  const { isDark } = useTheme();
  const total = APPROVAL_STATS.reduce((sum, s) => sum + s.count, 0);
  const withPercent = APPROVAL_STATS.map((s) => ({ ...s, percent: total > 0 ? Math.round((s.count / total) * 100) : 0 }));

  return (
    <WidgetCard title="Onay Durumu Özeti" subtitle="Bu ayki izin talepleri">
      <SegmentedProgressBar segments={withPercent.filter((s) => s.percent > 0).map((s) => ({ color: s.color, percent: s.percent }))} />
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {withPercent.map((s) => (
          <div
            key={s.label}
            className={`rounded-lg border p-3 text-center transition-colors ${isDark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'}`}
          >
            <p className="text-xl font-bold" style={{ color: s.color }}>
              {s.count}
            </p>
            <p className={`mt-0.5 text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>{s.label}</p>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-muted'}`}>%{s.percent}</p>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

// "Aylık İzin Trendi" — 6 aylık, mevcut paylaşılan `LineChart`
// component'i (Headcount Trendi'yle AYNI teknik) yeşil renkle yeniden
// kullanıldı, ikinci bir grafik motoru eklenmedi.
function LeaveTrendCard() {
  const { isDark } = useTheme();
  return (
    <WidgetCard title="Aylık İzin Trendi" subtitle="Son 6 ay — kullanılan izin günü">
      <LineChart data={LEAVE_TREND_DATA} labels={LEAVE_TREND_MONTHS} color="#10B981" dotFill={isDark ? '#1F2937' : '#ffffff'} />
    </WidgetCard>
  );
}

// "Birim Bazlı İzin Kullanımı" — `ShiftAttendanceCard`'ın AYNI satır
// deseni (etiket + oran çubuğu + değer), tek fark her şubenin KENDİ
// `BRANCHES` rengini taşıması.
function BranchLeaveUsageCard() {
  const { isDark } = useTheme();
  const maxDays = Math.max(...LEAVE_BY_BRANCH.map((b) => b.days));
  return (
    <WidgetCard title="Birim Bazlı İzin Kullanımı" subtitle="Bu ay — birim başına izin oranı">
      <div className="space-y-4">
        {LEAVE_BY_BRANCH.map((b) => (
          <div
            key={b.name}
            className={`-m-2 flex items-center gap-3 rounded-lg p-2 transition-colors ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
          >
            <span className={`w-24 shrink-0 truncate text-xs sm:w-32 sm:text-sm ${isDark ? 'text-gray-300' : 'text-body'}`}>{b.name}</span>
            <div className={`h-3 flex-1 overflow-hidden rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="h-full rounded-full" style={{ width: `${(b.days / maxDays) * 100}%`, backgroundColor: b.color }} />
            </div>
            <span className={`w-14 shrink-0 text-right text-sm font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>{b.days} gün</span>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

// "İzin Çakışma Uyarısı" — gerçek ekran görüntüsündeki BOŞ durumun
// AYNISI ("İzin çakışması verisi yok") — bu bir uydurma veri DEĞİL,
// referans üründe de o an gerçekten çakışan izin yoktu, boş-durum metni
// birebir. Sağ üstteki "Şube" rozeti `AverageHoursCard`'ın "Tüm
// Şubeler" rozetiyle AYNI ilke — `aria-hidden`, gerçek bir dropdown
// AÇMIYOR, yalnızca görsel.
function LeaveConflictCard() {
  const { isDark } = useTheme();
  return (
    <WidgetCard
      title="İzin Çakışma Uyarısı"
      subtitle="Aynı gün izinli olanlar"
      headerRight={
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
            isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-body'
          }`}
          aria-hidden="true"
        >
          Şube
          <ChevronDown className="h-3 w-3" aria-hidden="true" />
        </span>
      }
    >
      <p className={`py-10 text-center text-sm ${isDark ? 'text-gray-500' : 'text-muted'}`}>İzin çakışması verisi yok</p>
    </WidgetCard>
  );
}

// "En Çok İzin Kullanan Birimler" — `LEAVE_BY_BRANCH`'in AYNI verisinin
// azalan sırada, numaralı-rozet + oran çubuğu ile İKİNCİ bir
// görselleştirmesi (gerçek referansta da `Birim Bazlı İzin Kullanımı`
// ile AYNI 2 birim tekrar ediliyordu — iki farklı görsel biçim,
// içerik tekrarı kasıtlı).
function TopLeaveUnitsCard() {
  const { isDark } = useTheme();
  const sorted = [...LEAVE_BY_BRANCH].sort((a, b) => b.days - a.days);
  const maxDays = sorted[0]?.days ?? 1;
  return (
    <WidgetCard title="En Çok İzin Kullanan Birimler" subtitle="Top 5 birim — bu ay">
      <div className="space-y-3.5">
        {sorted.map((b, i) => (
          <div key={b.name} className="flex items-center gap-3">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: b.color }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className={`truncate text-sm font-medium ${isDark ? 'text-white' : 'text-heading'}`}>{b.name}</span>
                <span className={`shrink-0 text-sm font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>{b.days} gün</span>
              </div>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-muted'}`}>Kişi başı ort: {b.avgPerPerson}</p>
              <div className={`mt-1.5 h-2 overflow-hidden rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="h-full rounded-full" style={{ width: `${(b.days / maxDays) * 100}%`, backgroundColor: b.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

function LeaveManagementTab() {
  return (
    <div>
      <SectionMiniHeader icon={CalendarClock} title="İzin" href="/yillik-izin-takip-programi/" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {LEAVE_STATS.map((stat) => (
          <StatCard key={stat.label} icon={stat.icon} color={stat.color} value={stat.value} label={stat.label} />
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-6">
        <LeaveTypeDistributionCard />
        <ApprovalStatusCard />
      </div>
      <div className="mt-3 grid gap-4 lg:mt-4 lg:grid-cols-2 lg:gap-6">
        <LeaveTrendCard />
        <BranchLeaveUsageCard />
      </div>
      <div className="mt-3 grid gap-4 lg:mt-4 lg:grid-cols-2 lg:gap-6">
        <LeaveConflictCard />
        <TopLeaveUnitsCard />
      </div>
    </div>
  );
}

// "Toplam" rozeti — `AverageHoursCard`/`LeaveConflictCard`'ın AYNI dekoratif
// filtre ilkesi (`aria-hidden`, gerçek bir dropdown AÇMIYOR), 2026-08-19.
function HeadcountTrendCard() {
  const { isDark } = useTheme();
  return (
    <WidgetCard
      title="Headcount Trendi"
      subtitle="12 aylık çalışan sayısı"
      headerRight={
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
            isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-body'
          }`}
          aria-hidden="true"
        >
          Toplam
          <ChevronDown className="h-3 w-3" aria-hidden="true" />
        </span>
      }
    >
      <LineChart data={HEADCOUNT_DATA} labels={HEADCOUNT_MONTHS} color="#3B82F6" dotFill={isDark ? '#1F2937' : '#ffffff'} />
    </WidgetCard>
  );
}

// "Çalışan Devir Hızı" — 3 istatistik kutusu + `DualLineChart`, 2026-08-19.
function TurnoverRateCard() {
  const { isDark } = useTheme();
  return (
    <WidgetCard title="Çalışan Devir Hızı" subtitle="Son 6 ay — işe alım vs ayrılma">
      <div className="grid grid-cols-3 gap-2">
        {TURNOVER_STATS.map((s) => (
          <div
            key={s.label}
            className={`rounded-lg border p-2 text-center transition-colors ${isDark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'}`}
          >
            <p className="text-lg font-bold" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className={`mt-0.5 text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <DualLineChart
          dataA={TURNOVER_HIRED}
          dataB={TURNOVER_LEFT}
          labels={TURNOVER_MONTHS}
          colorA="#10B981"
          colorB="#EF4444"
          dotFill={isDark ? '#1F2937' : '#ffffff'}
        />
      </div>
      <div className={`mt-2 flex flex-wrap gap-x-4 gap-y-1.5 border-t pt-2 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        <span className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>
          <span className="h-2 w-2 rounded-full bg-[#10B981]" aria-hidden="true" />
          İşe Giren
        </span>
        <span className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>
          <span className="h-2 w-2 rounded-full bg-[#EF4444]" aria-hidden="true" />
          Ayrılan
        </span>
      </div>
    </WidgetCard>
  );
}

// "Onay Bekleyen İşlemler" — ikon+etiket+sayı satırları + alt toplam,
// 2026-08-19.
function PendingApprovalsCard() {
  const { isDark } = useTheme();
  const total = PENDING_APPROVALS.reduce((sum, p) => sum + p.count, 0);
  return (
    <WidgetCard title="Onay Bekleyen İşlemler" subtitle="Bekleyen onay talepleri">
      <div className="space-y-0.5">
        {PENDING_APPROVALS.map((p) => (
          <div
            key={p.label}
            className={`flex items-center gap-2.5 rounded-lg p-1 transition-colors ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${p.color}1A` }}
              aria-hidden="true"
            >
              <p.icon className="h-3.5 w-3.5" style={{ color: p.color }} strokeWidth={2.5} />
            </span>
            <span className={`flex-1 text-sm ${isDark ? 'text-gray-200' : 'text-body'}`}>{p.label}</span>
            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>{p.count}</span>
          </div>
        ))}
      </div>
      <div className={`mt-1.5 flex items-center justify-between border-t pt-1.5 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>Toplam Bekleyen</span>
        <span className="text-sm font-bold text-brand">{total}</span>
      </div>
    </WidgetCard>
  );
}

// "Takvim" — gerçek Ağustos 2026 ay görünümü, 2026-08-19. Nav okları
// `AverageHoursCard`'ın "Tüm Şubeler" rozetiyle AYNI ilke — dekoratif,
// `aria-hidden`, gerçekten ay DEĞİŞTİRMİYOR.
function HRCalendarCard() {
  const { isDark } = useTheme();
  return (
    <WidgetCard
      title="Takvim"
      subtitle="Doğum günleri, yıldönümleri ve izinler"
      headerRight={
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-md border ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-body'}`}
          >
            <ChevronLeft className="h-3 w-3" />
          </span>
          <span className={`text-xs font-medium whitespace-nowrap ${isDark ? 'text-white' : 'text-heading'}`}>Ağustos 2026</span>
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-md border ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-body'}`}
          >
            <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {CALENDAR_WEEKDAYS.map((w) => (
          <span key={w} className={`pb-0.5 text-[9px] font-semibold ${isDark ? 'text-gray-500' : 'text-muted'}`}>
            {w}
          </span>
        ))}
        {CALENDAR_CELLS.map((c, i) => (
          <div
            key={i}
            className={`flex h-6 flex-col items-center justify-start gap-0.5 rounded-md text-[11px] leading-none ${
              c.isToday
                ? `border border-brand font-bold ${isDark ? 'text-white' : 'text-heading'}`
                : c.muted
                  ? isDark
                    ? 'text-gray-600'
                    : 'text-gray-300'
                  : isDark
                    ? 'text-gray-200'
                    : 'text-body'
            }`}
          >
            <span className="mt-0.5">{c.day}</span>
            {c.events && (
              <span className="flex gap-0.5" aria-hidden="true">
                {c.events.map((e, j) => (
                  <span key={j} className="h-1 w-1 rounded-full" style={{ backgroundColor: EVENT_DOT_COLORS[e] }} />
                ))}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className={`mt-1.5 flex flex-wrap gap-x-4 gap-y-1 border-t pt-1.5 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        <span className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: EVENT_DOT_COLORS.birthday }} aria-hidden="true" />
          Doğum Günleri
        </span>
        <span className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: EVENT_DOT_COLORS.anniversary }} aria-hidden="true" />
          Yıldönümleri
        </span>
        <span className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: EVENT_DOT_COLORS.leave }} aria-hidden="true" />
          İzinler
        </span>
      </div>
    </WidgetCard>
  );
}

// "Deneme Süresi Takibi" / "Sözleşme Takibi" — dolgu renkli 3'lü kutu
// satırı, 2026-08-19. İkisi de AYNI `TrackingBoxRow` deseniyle render
// ediliyor (yalnızca veri/alt-etiket farklı).
function TrackingBoxRow({ items }: { items: TrackingBoxData[] }) {
  const { isDark } = useTheme();
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {items.map((item, i) => (
        <div
          key={i}
          className={`rounded-xl p-2 text-center ${isDark ? 'border border-gray-700 bg-gray-900' : ''}`}
          style={!isDark ? { backgroundColor: item.bgLight } : undefined}
        >
          <span className="mx-auto mb-0.5 block h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
          <p className="text-lg font-bold" style={{ color: item.color }}>
            {item.count}
          </p>
          <p className={`mt-0.5 text-xs ${isDark ? 'text-gray-300' : 'text-body'}`}>{item.primaryLabel}</p>
          {item.secondaryLabel && <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-muted'}`}>{item.secondaryLabel}</p>}
        </div>
      ))}
    </div>
  );
}

function ProbationTrackingCard() {
  return (
    <WidgetCard title="Deneme Süresi Takibi" subtitle="Deneme süresindeki çalışanlar">
      <TrackingBoxRow items={PROBATION_TRACKING} />
    </WidgetCard>
  );
}

function ContractTrackingCard() {
  return (
    <WidgetCard title="Sözleşme Takibi" subtitle="Yenilenmesi gereken sözleşmeler">
      <TrackingBoxRow items={CONTRACT_TRACKING} />
    </WidgetCard>
  );
}

function BirthdayAnniversaryCard() {
  const { isDark } = useTheme();
  return (
    <WidgetCard title="Doğum Günü & Yıldönümü" subtitle="Bu hafta">
      <div className="space-y-1.5">
        {HR_EVENTS.map((event) => (
          <div
            key={event.name}
            className={`flex items-center gap-2.5 rounded-lg border p-2 transition-colors ${
              isDark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'
            }`}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: event.avatarColor }}
              aria-hidden="true"
            >
              {event.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`truncate text-sm font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>{event.name}</p>
              <p className={`truncate text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>{event.description}</p>
            </div>
            <span className="text-lg" aria-hidden="true">
              {event.emoji}
            </span>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

function HumanResourcesTab() {
  return (
    <div>
      <SectionMiniHeader icon={Users} title="İnsan Kaynakları" href="/insan-kaynaklari-yonetimi-modulu/" />
      <div className="grid gap-3 lg:grid-cols-2 lg:gap-5">
        <HeadcountTrendCard />
        <BirthdayAnniversaryCard />
      </div>
      <div className="mt-2 grid gap-3 lg:grid-cols-2 lg:gap-5">
        <TurnoverRateCard />
        <PendingApprovalsCard />
      </div>
      <div className="mt-2">
        <HRCalendarCard />
      </div>
      <div className="mt-2 grid gap-3 lg:grid-cols-2 lg:gap-5">
        <ProbationTrackingCard />
        <ContractTrackingCard />
      </div>
    </div>
  );
}

// Tek değerli ilerleme halkası (Hedefler/KPI satırı için) — `DonutChart`'ın
// AYNI SVG tekniği (strokeDasharray + -rotate-90), tek segment + gri track.
function GoalProgressRing({ percent, color }: { percent: number; color: string }) {
  const { isDark } = useTheme();
  const radius = 15.5;
  const circumference = 2 * Math.PI * radius;
  const dash = (Math.min(percent, 100) / 100) * circumference;
  return (
    <div className="relative h-14 w-14 shrink-0">
      <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
        <circle cx="18" cy="18" r={radius} fill="none" stroke={isDark ? '#374151' : '#F3F4F6'} strokeWidth="3.5" />
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-[11px] font-bold ${isDark ? 'text-white' : 'text-heading'}`}>%{percent}</span>
      </div>
    </div>
  );
}

// Hedef/KPI liste satırı — kullanıcının paylaştığı gerçek app.idenfit.com
// Hedefler (OKR)/KPI ekran görüntüsünden (filtre çubuğu/arama/genişleyebilir
// anahtar sonuçlar/Check-in butonları BİLİNÇLİ olarak sadeleştirildi —
// diğer sekmelerin AYNI dekoratif-özet ilkesi, gerçek bir OKR akışı YOK).
function GoalRow({ goal }: { goal: GoalItem }) {
  const { isDark } = useTheme();
  return (
    <div
      className={`flex flex-wrap items-center gap-4 rounded-lg border p-4 transition-shadow duration-200 hover:shadow-[0_4px_14px_rgba(0,0,0,0.07)] ${
        isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <GoalProgressRing percent={goal.percent} color={goal.statusColor} />
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>{goal.name}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-body'}`}>
            {goal.scope}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-body'}`}>
            {goal.category}
          </span>
          <span className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-muted'}`}>
            {goal.period} · {goal.keyResultCount} anahtar sonuç
          </span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap"
          style={{ backgroundColor: `${goal.statusColor}1A`, color: goal.statusColor }}
        >
          {goal.status}
        </span>
        <div className="flex -space-x-2" aria-hidden="true">
          {goal.avatars.map((a) => (
            <span
              key={a.initials}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-2 ${isDark ? 'ring-gray-800' : 'ring-white'}`}
              style={{ backgroundColor: a.color }}
            >
              {a.initials}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Anahtar sonuç satırı — ikon rozeti + ad/son check-in + durum rozeti,
// alt kısımda ilerleme çubuğu (başlangıç/hedef değer etiketli) + "takvime
// göre beklenen %" karşılaştırması (yön okuyla renkli).
function KeyResultRow({ kr }: { kr: KeyResultItem }) {
  const { isDark } = useTheme();
  const PaceIcon = kr.pace === 'ahead' ? TrendingUp : TrendingDown;
  const paceColor = kr.pace === 'ahead' ? '#10B981' : '#EF4444';
  const paceLabel = kr.pace === 'ahead' ? 'planın önünde' : 'planın gerisinde';
  return (
    <div className={`rounded-lg border p-4 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: `${kr.statusColor}1A` }}
            aria-hidden="true"
          >
            <Flag className="h-3.5 w-3.5" style={{ color: kr.statusColor }} strokeWidth={2.5} />
          </span>
          <div>
            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>{kr.name}</p>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-muted'}`}>
              Son check-in: {kr.lastCheckIn} · {kr.status}
            </p>
          </div>
        </div>
        <span
          className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap"
          style={{ backgroundColor: `${kr.statusColor}1A`, color: kr.statusColor }}
        >
          {kr.status}
        </span>
      </div>
      <div className="mt-3">
        <div className={`h-2.5 overflow-hidden rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="h-full rounded-full" style={{ width: `${kr.currentPercent}%`, backgroundColor: kr.statusColor }} />
        </div>
        <div className={`mt-1 flex justify-between text-[11px] ${isDark ? 'text-gray-500' : 'text-muted'}`}>
          <span>{kr.startLabel}</span>
          <span>{kr.endLabel}</span>
        </div>
      </div>
      <p className={`mt-2 flex flex-wrap items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-body'}`}>
        <span>
          Güncel: <strong className={isDark ? 'text-white' : 'text-heading'}>{kr.currentValueLabel} (%{kr.currentPercent})</strong>
        </span>
        <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>|</span>
        <span className="inline-flex items-center gap-1 font-medium" style={{ color: paceColor }}>
          <PaceIcon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
          Takvime göre beklenen %{kr.expectedPercent} — {paceLabel}
        </span>
      </p>
    </div>
  );
}

function PerformanceManagementTab() {
  return (
    <div>
      <SectionMiniHeader icon={Target} title="Performans Yönetimi" href="/calisan-performans-degerlendirme-sistemi-modulu/" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {PERFORMANCE_KPI_STATS.map((stat) => (
          <StatCard key={stat.label} icon={stat.icon} color={stat.color} value={stat.value} label={stat.label} />
        ))}
      </div>
      <div className="mt-3">
        <WidgetCard title="Hedefler (OKR) / KPI" subtitle="Şirket, takım ve bireysel hedeflerin ilerleme durumu">
          <div className="space-y-3">
            {PERFORMANCE_GOALS.map((goal) => (
              <GoalRow key={goal.name} goal={goal} />
            ))}
          </div>
        </WidgetCard>
      </div>
      <div className="mt-3">
        <WidgetCard title="Anahtar Sonuçlar" subtitle="“Yıllık ciroyu %20 artırmak” hedefinin ilerleme detayı">
          <div className="space-y-3">
            {GOAL_KEY_RESULTS.map((kr) => (
              <KeyResultRow key={kr.name} kr={kr} />
            ))}
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}

// "Verileri Hesapla" — dekoratif kırmızı buton (Veri Analizi sekmesinde
// 2 kez kullanılıyor: tarih aralığı kontrolünün yanında + grafiklerin
// altında bir "yeniden hesapla" kısayolu olarak, referans ekran
// görüntüsündeki AYNI tekrar deseni). `GoalRow`'un durum rozetiyle AYNI
// ilke — gerçek bir hesaplama işlevi YOK, mockup.
function RecalculateButton() {
  return (
    <span
      role="button"
      aria-hidden="true"
      className="inline-flex shrink-0 cursor-default items-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-transform hover:scale-105"
    >
      Verileri Hesapla
    </span>
  );
}

function DateRangeCard() {
  const { isDark } = useTheme();
  const fieldClass = `flex h-10 min-w-0 items-center gap-2 rounded-lg border px-3.5 text-sm font-medium transition-colors ${
    isDark ? 'border-gray-700 bg-gray-900 text-gray-100 hover:border-gray-500' : 'border-gray-200 bg-white text-heading hover:border-brand/40'
  }`;
  return (
    <WidgetCard title="Tarih Aralığı" subtitle="Analiz edilecek dönemi seçin">
      <div className="flex flex-wrap items-center gap-3">
        <span className={fieldClass} aria-hidden="true">
          <CalendarDays className="h-4 w-4 shrink-0" strokeWidth={2.5} />
          01.01.2026
        </span>
        <span className={isDark ? 'text-gray-500' : 'text-muted'} aria-hidden="true">
          –
        </span>
        <span className={fieldClass} aria-hidden="true">
          <CalendarDays className="h-4 w-4 shrink-0" strokeWidth={2.5} />
          30.06.2026
        </span>
        <RecalculateButton />
      </div>
    </WidgetCard>
  );
}

function DepartmentAbsenteeismCard() {
  return (
    <WidgetCard title="Departman Bazlı Devamsızlık Oranı" subtitle="Seçili dönem">
      <SimpleBarChart data={DEPARTMENT_ABSENTEEISM} unit="%" />
    </WidgetCard>
  );
}

function AbsenteeismTrendCard() {
  const { isDark } = useTheme();
  return (
    <WidgetCard title="Aylık Devamsızlık Trendi" subtitle="Son 6 ay, %">
      <LineChart
        data={ABSENTEEISM_TREND_DATA}
        labels={ABSENTEEISM_TREND_MONTHS}
        color="#FF0000"
        dotFill={isDark ? '#1F2937' : '#ffffff'}
      />
    </WidgetCard>
  );
}

// "Aktif Çalışan Sayısı Trendi" — gerçek "Veri Analizi > Deneyim" alt
// sayfasının başlık grafiği (2026-08-19). "Haftalık/Aylık" segmentli
// rozeti `AverageHoursCard`/`HRCalendarCard`'ın AYNI dekoratif filtre
// ilkesi (`aria-hidden`, gerçekten veri DEĞİŞTİRMİYOR).
function ActiveEmployeeTrendCard() {
  const { isDark } = useTheme();
  return (
    <WidgetCard
      title="Aktif Çalışan Sayısı Trendi"
      subtitle="Son 7 hafta"
      headerRight={
        <div
          className={`flex shrink-0 items-center gap-1 rounded-full border p-0.5 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
          aria-hidden="true"
        >
          <span className="rounded-full bg-brand px-2.5 py-1 text-xs font-semibold text-white">Haftalık</span>
          <span className={`px-2.5 py-1 text-xs font-medium ${isDark ? 'text-gray-400' : 'text-muted'}`}>Aylık</span>
        </div>
      }
    >
      <LineChart
        data={ACTIVE_EMPLOYEE_TREND_DATA}
        labels={ACTIVE_EMPLOYEE_TREND_WEEKS}
        color="#FF0000"
        dotFill={isDark ? '#1F2937' : '#ffffff'}
      />
    </WidgetCard>
  );
}

// "Günlük Personel Hareketleri" — gerçek "Veri Analizi > Zaman" alt
// sayfasındaki 4 grafiğin (Gelenler/Geç Gelenler/Erken Çıkanlar/
// Devamsızlık) kompakt özeti, `TIME_MINI_STATS`'ın AYNI mini-kart
// deseniyle (`MiniTrendStatCard` yeniden kullanıldı, ikinci bir
// component YAZILMADI).
function DailyMovementsRow() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
      {DAILY_MOVEMENTS.map((stat) => (
        <MiniTrendStatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

// "Çalışan Gelenler Sayısı" / "Çalışan Geç Gelenler Sayısı" — gerçek
// "Veri Analizi > Zaman" alt sayfasındaki 4 tam-boy grafikten 2'sinin
// tam detay hâli (`DailyMovementsRow`'un mini-özetini TAMAMLIYOR, aynı
// haftanın verisi — içerik tekrarı değil, iki farklı görselleştirme
// derinliği).
function NewArrivalsCard() {
  return (
    <WidgetCard title="Çalışan Gelenler Sayısı" subtitle="12–18 Ağustos 2026">
      <SimpleBarChart data={NEW_ARRIVALS_WEEK} />
    </WidgetCard>
  );
}

function LateArrivalsCard() {
  return (
    <WidgetCard title="Çalışan Geç Gelenler Sayısı" subtitle="12–18 Ağustos 2026">
      <SimpleBarChart data={LATE_ARRIVALS_WEEK} />
    </WidgetCard>
  );
}

function DataAnalysisTab() {
  return (
    <div>
      <SectionMiniHeader icon={BarChart3} title="Veri Analizi" />
      <div className="space-y-3">
        <DateRangeCard />
        <div className="grid gap-3 lg:grid-cols-2 lg:gap-5">
          <DepartmentAbsenteeismCard />
          <AbsenteeismTrendCard />
        </div>
        <ActiveEmployeeTrendCard />
        <DailyMovementsRow />
        <div className="grid gap-3 lg:grid-cols-2 lg:gap-5">
          <NewArrivalsCard />
          <LateArrivalsCard />
        </div>
        <div className="flex justify-end">
          <RecalculateButton />
        </div>
      </div>
    </div>
  );
}

// Üst header'ın açılır panelleri (2026-08-13, PİLOT turu — kullanıcının
// gönderdiği referans görüntülerde her ikonun kendi küçük dropdown'ı
// olduğu görüldü). Pilotta yalnızca 2 panel dolduruldu (Kısayollar +
// Bildirimler); bu turda (2026-08-14) kalan 6 ikon de aynı desende
// eklendi: analitik/göz/dil/2. zil/HRTECHTOOLS/avatar.
type HeaderPanelKey = 'shortcuts' | 'notifications' | 'analytics' | 'visibility' | 'language' | 'tasks' | 'apps' | 'avatar';

// Tek seferde en fazla 1 panel açık kalır + dışarı tıklama/`Escape` ile
// kapanır — `AppHeaderBar`'ın `headerRef`'ine bağlı tek bir `useEffect`
// bu mantığı YÖNETİYOR, her ikon kendi outside-click dinleyicisini
// kurmuyor (gereksiz tekrar/performans kaybı önlendi).
// `icon` (varsayılan yuvarlak ikon butonu) VEYA `trigger` (dil seçici gibi
// kendi düzeni olan bir tetikleyici — flag+metin+chevron) — ikisinden
// yalnızca biri geçirilir, `trigger` verilirse `icon` yok sayılır.
function IconDropdown({
  icon: Icon,
  trigger,
  label,
  panelKey,
  openPanel,
  onToggle,
  iconBtnClass,
  align = 'right',
  panelWidthClass = 'w-72',
  hiddenSm = false,
  children,
}: {
  icon?: ComponentType<{ className?: string }>;
  trigger?: ReactNode;
  label: string;
  panelKey: HeaderPanelKey;
  openPanel: HeaderPanelKey | null;
  onToggle: (key: HeaderPanelKey) => void;
  iconBtnClass: string;
  align?: 'left' | 'right';
  panelWidthClass?: string;
  hiddenSm?: boolean;
  children: ReactNode;
}) {
  const { isDark } = useTheme();
  const isOpen = openPanel === panelKey;
  return (
    <div className={`relative ${hiddenSm ? 'hidden sm:block' : ''}`}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => onToggle(panelKey)}
        className={iconBtnClass}
      >
        {trigger ?? (Icon && <Icon className="h-4 w-4" />)}
      </button>
      {isOpen && (
        <div
          className={`absolute top-full z-50 mt-2 ${align === 'right' ? 'right-0' : 'left-0'} ${panelWidthClass} rounded-xl border p-4 shadow-lg ${
            isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function ShortcutsPanelContent() {
  const { isDark } = useTheme();
  return (
    <div>
      <h4 className={`mb-3 text-sm font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>Kısayollar</h4>
      <div className="grid grid-cols-3 gap-1" aria-hidden="true">
        {HEADER_SHORTCUTS.map((shortcut) => (
          <span
            key={shortcut.label}
            role="button"
            className={`flex cursor-default flex-col items-center gap-1.5 rounded-lg p-2 text-center transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            }`}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${shortcut.color}1A` }}
            >
              <shortcut.icon className="h-4 w-4" style={{ color: shortcut.color }} />
            </span>
            <span className={`text-[10.5px] leading-tight font-medium ${isDark ? 'text-gray-200' : 'text-body'}`}>{shortcut.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function NotificationsPanelContent() {
  const { isDark } = useTheme();
  return (
    <div>
      <h4 className={`mb-1 border-b pb-3 text-sm font-semibold ${isDark ? 'border-gray-700 text-white' : 'border-gray-100 text-heading'}`}>
        Bildirimler
      </h4>
      <div className="flex flex-col items-center justify-center gap-2 py-7 text-center" aria-hidden="true">
        <Bell className={`h-7 w-7 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-muted'}`}>Henüz bildirim yok</p>
      </div>
    </div>
  );
}

// Tek bir uygulama karosu (HRTECHTOOLS grid'i + Workforce satırı — AYNI
// görsel birim, iki yerde kullanılıyor).
// 2026-08-14 — 7 kutu artık GERÇEK dış linkler (kullanıcının verdiği
// URL eşleştirmesi, `AppTileData.href`). `role="button"`/`aria-hidden`
// (eski dekoratif-mockup ilkesi) KALDIRILDI — bunlar artık gerçek
// klavye-erişilebilir `<a>` linkleri, görünür metin (app/brand) doğal
// erişilebilir adı sağlıyor. `onNavigate` tıklamada paneli kapatıyor
// (`target="_blank"` yeni sekme açmasıyla ÇAKIŞMIYOR — ikisi bağımsız
// çalışıyor, biri tarayıcıda yeni sekme açar, diğeri bu sayfadaki React
// state'ini günceller).
function AppTile({ tile, onNavigate }: { tile: AppTileData; onNavigate: () => void }) {
  const { isDark } = useTheme();
  let iconSlot: ReactNode;
  if (tile.style === 'wordmark') {
    iconSlot = (
      <span
        className={`flex h-11 items-center justify-center text-base font-bold ${isDark ? 'text-gray-100' : 'text-heading'}`}
        aria-hidden="true"
      >
        {tile.wordmark}
      </span>
    );
  } else if (tile.style === 'dark-square' || tile.style === 'dark-hexagon') {
    const Icon = tile.icon!;
    iconSlot = (
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center ${tile.style === 'dark-square' ? 'rounded-xl' : ''}`}
        style={{
          backgroundColor: APP_DARK_TILE_BG,
          clipPath: tile.style === 'dark-hexagon' ? 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' : undefined,
        }}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
      </span>
    );
  } else {
    const Icon = tile.icon!;
    iconSlot = (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center" aria-hidden="true">
        <Icon className={`h-7 w-7 ${isDark ? 'text-gray-100' : 'text-heading'}`} strokeWidth={2.5} />
      </span>
    );
  }
  return (
    <a
      href={tile.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onNavigate}
      className="flex flex-col items-center gap-1.5 text-center"
    >
      {iconSlot}
      <span className={`text-[11px] leading-tight font-semibold ${isDark ? 'text-gray-100' : 'text-heading'}`}>{tile.app}</span>
      <span className={`text-[9.5px] leading-tight ${isDark ? 'text-gray-500' : 'text-muted'}`}>{tile.brand}</span>
    </a>
  );
}

function AppsPanelContent({ onNavigate }: { onNavigate: () => void }) {
  const { isDark } = useTheme();
  return (
    <div>
      <h4 className={`mb-3 text-center text-base font-bold ${isDark ? 'text-white' : 'text-heading'}`}>HRTECHTOOLS</h4>
      <div className={`rounded-xl border p-5 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="grid grid-cols-3 gap-x-3 gap-y-5">
          {APPS_GRID.map((tile) => (
            <AppTile key={tile.app} tile={tile} onNavigate={onNavigate} />
          ))}
        </div>
        <div className={`mt-5 flex justify-center border-t pt-5 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          <AppTile tile={WORKFORCE_APP} onNavigate={onNavigate} />
        </div>
        {/* CSS `uppercase` KULLANILMADI — sayfa `lang="tr"` taşıdığı için tarayıcı
            Türkçe büyütme kuralını uyguluyor ("is" -> "İS", noktalı İ), bu literal
            bir İngilizce slogan olduğu için metin doğrudan BÜYÜK HARF yazıldı. */}
        <p className="mt-5 text-center text-sm font-bold tracking-widest text-brand" aria-hidden="true">
          LATER IS NEVER
        </p>
      </div>
    </div>
  );
}

// Dil seçici satırı — Türkçe (aktif) `bg-brand-light`+kırmızı+onay ikonuyla
// vurgulanıyor, `LanguageSwitcher.tsx`'in (site geneli gerçek dil
// değiştirici) AYNI görsel dilini izliyor ama TAMAMEN dekoratif.
function LanguageRow({ lang }: { lang: (typeof LANGUAGE_LIST)[number] }) {
  const { isDark } = useTheme();
  const isActive = lang.code === 'TR';
  return (
    <span
      role="button"
      className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors ${
        isActive ? 'bg-brand-light font-semibold text-brand' : isDark ? 'text-gray-200 hover:bg-gray-700' : 'text-body hover:bg-gray-50'
      }`}
    >
      <span className="flex items-center gap-2.5">
        <CountryFlagIcon code={lang.code} />
        <span>{lang.name}</span>
      </span>
      {isActive && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
    </span>
  );
}

function LanguagePanelContent() {
  const { isDark } = useTheme();
  return (
    <div>
      <h4 className={`mb-2 border-b pb-3 text-sm font-semibold ${isDark ? 'border-gray-700 text-white' : 'border-gray-100 text-heading'}`}>
        Dil Seçin
      </h4>
      <div className="space-y-0.5 pt-1" aria-hidden="true">
        {LANGUAGE_LIST.map((lang) => (
          <LanguageRow key={lang.code} lang={lang} />
        ))}
      </div>
    </div>
  );
}

function TasksPanelContent() {
  const { isDark } = useTheme();
  return (
    <div>
      <h4
        className={`mb-1 flex items-center gap-2 border-b pb-3 text-sm font-semibold ${isDark ? 'border-gray-700 text-white' : 'border-gray-100 text-heading'}`}
      >
        Görevler
        <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">{PENDING_TASKS.length}</span>
      </h4>
      <div className="space-y-3 pt-2" aria-hidden="true">
        {PENDING_TASKS.map((task) => (
          <div key={task.text} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${task.color}1A` }}>
              <task.icon className="h-3.5 w-3.5" style={{ color: task.color }} />
            </span>
            <p className={`text-xs leading-snug ${isDark ? 'text-gray-300' : 'text-body'}`}>{task.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AvatarPanelContent() {
  const { isDark } = useTheme();
  const items = [
    { icon: User, label: 'Profil' },
    { icon: Settings, label: 'Ayarlar' },
    { icon: LogOut, label: 'Çıkış Yap' },
  ];
  return (
    <div className="space-y-0.5" aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.label}
          role="button"
          className={`flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors ${
            isDark ? 'text-gray-100 hover:bg-gray-700' : 'text-heading hover:bg-gray-50'
          }`}
        >
          <item.icon className="h-4 w-4 shrink-0" strokeWidth={2.5} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function AnalyticsPanelContent() {
  const { isDark } = useTheme();
  return (
    <div>
      <h4 className={`mb-3 text-sm font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>Bugünün Özeti</h4>
      <div className="space-y-3" aria-hidden="true">
        {TODAY_SUMMARY.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${row.color}1A` }}>
                <row.icon className="h-3.5 w-3.5" style={{ color: row.color }} />
              </span>
              <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-body'}`}>{row.label}</span>
            </span>
            <span className={`text-sm font-semibold whitespace-nowrap ${isDark ? 'text-white' : 'text-heading'}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Dekoratif aç/kapa anahtarı — `ThemeContext`'teki GERÇEK ay/güneş
// butonuyla KARIŞTIRILMAMALI, burada tıklama işlevi yok (`role="switch"`
// yalnızca görsel doğruluk için, `aria-hidden` ile ekran okuyucudan
// gizli — panelin tamamı zaten dekoratif).
function VisibilityToggleRow({ label, on }: { label: string; on: boolean }) {
  const { isDark } = useTheme();
  return (
    <div className="flex items-center justify-between gap-3" aria-hidden="true">
      <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-body'}`}>{label}</span>
      <span
        role="switch"
        aria-checked={on}
        className={`relative flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${on ? 'bg-brand' : isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
      >
        <span className={`absolute h-3.5 w-3.5 rounded-full bg-white transition-transform ${on ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
      </span>
    </div>
  );
}

function VisibilityPanelContent() {
  const { isDark } = useTheme();
  return (
    <div>
      <h4 className={`mb-3 flex items-center gap-2 text-sm font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>
        <EyeOff className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        Görünürlük Ayarları
      </h4>
      <div className="space-y-3">
        <VisibilityToggleRow label="Bekleyen onayları göster" on={true} />
        <VisibilityToggleRow label="Devre dışı çalışanları gizle" on={true} />
        <VisibilityToggleRow label="Kompakt görünüm" on={false} />
      </div>
    </div>
  );
}

// Üst uygulama başlığı (2026-08-13, kullanıcının gönderdiği gerçek
// app.idenfit.com ekran görüntüsü referans alınarak eklendi; aynı gün
// 5 ek referans görüntüyle ikon SIRASI/renk canlılığı birebir eşleştirilecek
// şekilde revize edildi, ardından 2 ikona PİLOT açılır panel eklendi —
// bkz. `IconDropdown` yorumu) — arama kutusu + ikon şeridi (analitik/
// kısayollar/göz/dil/bildirim×2/uygulamalar/avatar), TAMAMI dekoratif/
// statik (gerçek arama/bildirim/dil değiştirme işlevi YOK, bu bir
// pazarlama mockup'ı) — TEK istisna: ay/güneş ikonu, widget'ın kendi
// karanlık/aydınlık temasını değiştiren GERÇEK bir buton. **Renk
// düzeltmesi:** ilk sürüm ikonları `text-muted` (soluk gri, #808080)
// kullanıyordu — kullanıcı bunun "devre dışı" hissi verdiğini belirtti,
// referans görüntüdeki ikonlar koyu/net/tam opaklıkta — `text-heading`e
// (neredeyse siyah) çevrildi. Avatar baş harfleri ("DA")/isim/unvan
// KURGUSAL — gerçek app.idenfit.com ekran görüntüsündeki test hesabının
// gerçek adı ("zerrin sude Ö.") BİLİNÇLİ olarak kullanılmadı (kurgusal
// veri ilkesiyle tutarlı, önceki turdan aynen korundu). TR bayrağı
// projenin KENDİ `FlagIcon` component'i (elle çizilmiş SVG, dil
// değiştiricide zaten kullanılıyor) ile — ikinci bir bayrak kaynağı
// İCAT EDİLMEDİ.
function AppHeaderBar() {
  const { isDark, toggle } = useTheme();
  const iconBtnClass = `flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors hover:scale-105 ${
    isDark ? 'border-gray-700 text-gray-200 hover:bg-gray-800' : 'border-gray-200 text-heading hover:bg-gray-50'
  }`;
  const headerRef = useRef<HTMLDivElement>(null);
  const [openPanel, setOpenPanel] = useState<HeaderPanelKey | null>(null);
  const togglePanel = (key: HeaderPanelKey) => setOpenPanel((prev) => (prev === key ? null : key));

  useEffect(() => {
    if (!openPanel) return;
    function handlePointerDown(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenPanel(null);
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openPanel]);

  return (
    <div
      ref={headerRef}
      className={`mb-4 flex flex-wrap items-center justify-between gap-2.5 border-b pb-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <div className="flex items-center gap-2.5">
        <IconDropdown
          icon={BarChart3}
          label="Analiz"
          panelKey="analytics"
          openPanel={openPanel}
          onToggle={togglePanel}
          iconBtnClass={iconBtnClass}
          align="left"
        >
          <AnalyticsPanelContent />
        </IconDropdown>
        <IconDropdown
          icon={Grid2x2}
          label="Kısayollar"
          panelKey="shortcuts"
          openPanel={openPanel}
          onToggle={togglePanel}
          iconBtnClass={iconBtnClass}
          align="left"
        >
          <ShortcutsPanelContent />
        </IconDropdown>
        <span
          className={`hidden h-9 items-center gap-2 rounded-lg border px-3.5 text-sm sm:flex ${
            isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 bg-gray-50 text-muted'
          }`}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Personel ara...
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <IconDropdown icon={Eye} label="Görünürlük Ayarları" panelKey="visibility" openPanel={openPanel} onToggle={togglePanel} iconBtnClass={iconBtnClass}>
          <VisibilityPanelContent />
        </IconDropdown>
        <IconDropdown
          label="Dil seçici"
          panelKey="language"
          openPanel={openPanel}
          onToggle={togglePanel}
          panelWidthClass="w-64"
          iconBtnClass={`flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-colors hover:scale-105 ${
            isDark ? 'border-gray-700 text-gray-200 hover:bg-gray-800' : 'border-gray-200 text-heading hover:bg-gray-50'
          }`}
          trigger={
            <>
              <FlagIcon code="TR" />
              TR
              <ChevronDown className="h-3 w-3" />
            </>
          }
        >
          <LanguagePanelContent />
        </IconDropdown>
        <button
          type="button"
          onClick={toggle}
          aria-label={isDark ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
          aria-pressed={isDark}
          className={iconBtnClass}
          style={{ color: '#F59E0B' }}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <IconDropdown
          icon={Bell}
          label="Bildirimler"
          panelKey="notifications"
          openPanel={openPanel}
          onToggle={togglePanel}
          iconBtnClass={iconBtnClass}
          hiddenSm
        >
          <NotificationsPanelContent />
        </IconDropdown>
        <IconDropdown icon={Bell} label="Görevler" panelKey="tasks" openPanel={openPanel} onToggle={togglePanel} iconBtnClass={iconBtnClass} hiddenSm>
          <TasksPanelContent />
        </IconDropdown>
        <IconDropdown
          icon={Grid3x3}
          label="HRTECHTOOLS"
          panelKey="apps"
          openPanel={openPanel}
          onToggle={togglePanel}
          // Gerçek app.idenfit.com ekran görüntüsünde bu tetikleyici (diğer
          // ikonların aksine) düz çerçeveli DEĞİL, dolu mor bir kare —
          // projenin zaten var olan `secondary` (#6F2C90) tema token'ı
          // yeniden kullanıldı, yeni bir renk İCAT EDİLMEDİ.
          // `hover:opacity-90` KULLANILMADI — ikonu soluklaştırıyordu, diğer
          // ikon butonlarıyla (arka plan tonu değişen `hover:bg-*`) AYNI
          // ilkeyle `brightness` filtresine çevrildi (opaklık SABİT %100 kalıyor).
          iconBtnClass="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-white transition-[filter,transform] hover:brightness-90 hover:scale-105"
          panelWidthClass="w-[26rem]"
          hiddenSm
        >
          <AppsPanelContent onNavigate={() => setOpenPanel(null)} />
        </IconDropdown>
        <IconDropdown
          label="Kullanıcı menüsü"
          panelKey="avatar"
          openPanel={openPanel}
          onToggle={togglePanel}
          iconBtnClass={`flex items-center gap-2 rounded-lg p-1 transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
          panelWidthClass="w-48"
          trigger={
            <>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">DA</span>
              <span className="hidden leading-tight sm:block">
                <span className={`block text-xs font-semibold whitespace-nowrap ${isDark ? 'text-white' : 'text-heading'}`}>Deniz Aydın</span>
                <span className={`block text-[10px] whitespace-nowrap ${isDark ? 'text-gray-500' : 'text-muted'}`}>İK Yöneticisi</span>
              </span>
            </>
          }
        >
          <AvatarPanelContent />
        </IconDropdown>
      </div>
    </div>
  );
}

// Sekmeler arası bekleme süresi (ms) — kullanıcının her sekmeyi okumasına
// yetecek kadar (`TestimonialCarousel.tsx`nin 6sn'lik otomatik geçişiyle
// AYNI değer, projede zaten kanıtlanmış bir süre).
const AUTO_TAB_INTERVAL_MS = 6000;

export default function ProductPreviewWidget() {
  const [activeTab, setActiveTab] = useState<TabKey>('zaman');
  const [isDark, setIsDark] = useState(false);
  const [autoPaused, setAutoPaused] = useState(false);
  const toggle = () => setIsDark((v) => !v);

  // Otomatik sekme gezinmesi — widget hover/focus edilince VEYA
  // `prefers-reduced-motion` tercih edilmişse durur (`TestimonialCarousel.tsx`
  // ile AYNI erişilebilirlik ilkesi). Kullanıcının elle bir sekmeye
  // tıklaması bu döngüyü DURDURMUYOR — yalnızca o andan itibaren kaldığı
  // yerden devam ediyor (bilinçli: "kendi kendine gezinen" bir demo bir
  // tıklamada kalıcı olarak duracaksa amacına aykırı olurdu).
  useEffect(() => {
    if (autoPaused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      setActiveTab((current) => {
        const currentIndex = ENABLED_TABS.findIndex((t) => t.key === current);
        const nextIndex = (currentIndex + 1) % ENABLED_TABS.length;
        return ENABLED_TABS[nextIndex].key;
      });
    }, AUTO_TAB_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [autoPaused]);

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      <div
        className={`flex flex-col overflow-hidden rounded-b-2xl border border-t-0 lg:flex-row ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
        onMouseEnter={() => setAutoPaused(true)}
        onMouseLeave={() => setAutoPaused(false)}
        onFocus={() => setAutoPaused(true)}
        onBlur={() => setAutoPaused(false)}
      >
        {/* Gerçek sidebar düzeni (2026-08-13, kullanıcı geri bildirimi —
            gönderdiği app.idenfit.com sidebar ekran görüntüsü referans
            alınarak: "modüller idenfit yazısının yanında olmalı, altında
            değil"). Logo + modül listesi BİRLİKTE dar bir sol sidebar
            sütununu oluşturuyor (`lg:w-72`), asıl içerik bu sidebar'ın
            YANINDA (sağında). Modül listesi (2026-08-13, 2. tur) kullanıcının
            gönderdiği tam ekran görüntüsündeki GERÇEK modül isimleriyle
            genişletildi — yalnızca ilk 3'ü (Zaman/İzin/İnsan Kaynakları)
            fonksiyonel, kalanı `enabled:false` (bkz. `TABS` üstündeki yorum). */}
        {/* Sidebar/içerik renk tonu (2026-08-19, kullanıcı isteği — "sol
            panel sağdakinden koyu olacak, renk tonları yer değiştirecek").
            Önceki sürümde sidebar `bg-white`/içerik `bg-[#F9FAFB]`'ydi —
            ikisi neredeyse ayırt edilemeyecek kadar yakındı. Artık sidebar
            projenin KENDİ mega-menü panel tokeni `menu-surface`
            (`#F2F2F2`, bkz. CLAUDE.md tasarım sistemi tablosu — yeni bir
            renk İCAT EDİLMEDİ) ile belirgin şekilde daha koyu, içerik
            (aşağıda) saf beyaza döndü. Karanlık modda AYNI ilke aynen
            uygulandı: sidebar `gray-950` (daha koyu), içerik `gray-900`
            (daha açık) — önceki sürümde bu ilişki TERSTİ. */}
        <div className={`shrink-0 border-b p-5 lg:w-72 lg:border-r lg:border-b-0 lg:p-6 ${isDark ? 'border-gray-700 bg-gray-950' : 'border-gray-200 bg-menu-surface'}`}>
          <IdenfitLogo className={`h-6 w-auto sm:h-7 ${isDark ? 'text-white' : 'text-heading'}`} />
          <nav aria-label="Panel önizleme modülleri" className="mt-6 space-y-1">
            {TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  disabled={!tab.enabled}
                  onClick={() => tab.enabled && setActiveTab(tab.key)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand text-white'
                      : tab.enabled
                        ? isDark
                          ? 'text-gray-100 hover:bg-gray-800 hover:text-white'
                          : 'text-heading hover:bg-brand-light hover:text-brand'
                        : isDark
                          ? 'cursor-not-allowed text-gray-100 hover:bg-gray-800/60'
                          : 'cursor-not-allowed text-heading hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                  <span className="flex-1 truncate">{tab.label}</span>
                  {tab.badge && (
                    <span className="shrink-0 rounded-full bg-brand-light px-2 py-0.5 text-[10px] font-semibold text-brand">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className={`min-w-0 flex-1 p-4 sm:p-6 lg:p-8 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          <AppHeaderBar />
          {/* Sekme yüksekliği stratejisi DEĞİŞTİ (2026-08-20, kullanıcı
              isteği — Personio.com'un ana sayfasındaki dashboard mockup'ıyla
              karşılaştırma sonrası: "dış boyut benzer olsun, daha kısa ve
              anasayfada gezinirken rahat okunsun"). ESKİ yaklaşım (paylaşılan
              `min-h`, en uzun sekmeye göre — 6 turluk ayar geçmişi
              `git log`/eski yorum arşivinde) widget'ı toplam ~1453px dış
              yüksekliğe çıkarıyordu (Personio'nun ölçülen ~870px'ine göre
              ~1.7x). Artık sekme içeriği SABİT bir `max-h` + `overflow-y-auto`
              içinde — header/sidebar HER ZAMAN tam görünür kalıyor (kaydırma
              alanı dışında), yalnızca kart listesi gerektiğinde kendi
              içinde kayıyor. Bu, kısa sekmelerdeki (Veri Analizi ~565px)
              eski "büyük boş alan" sorununu da kendiliğinden çözüyor —
              artık içerik kendi doğal yüksekliğinde durup taşmıyorsa hiç
              kaymıyor. Hiçbir kart/veri KALDIRILMADI, yalnızca dış çerçeve
              sabitlendi. */}
          <div
            key={activeTab}
            role="tabpanel"
            className="ppw-tab-enter max-h-[620px] overflow-y-auto pr-1"
          >
            {activeTab === 'zaman' && <TimeManagementTab />}
            {activeTab === 'izin' && <LeaveManagementTab />}
            {activeTab === 'ik' && <HumanResourcesTab />}
            {activeTab === 'performans' && <PerformanceManagementTab />}
            {activeTab === 'veri-analizi' && <DataAnalysisTab />}
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
