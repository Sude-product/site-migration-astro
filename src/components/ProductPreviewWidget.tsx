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
  icon: ComponentType<{ className?: string }>;
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

// --- "İnsan Kaynakları" sekmesi — kurgusal veri ---

const HEADCOUNT_MONTHS = ['Eyl', 'Eki', 'Kas', 'Ara', 'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu'];
const HEADCOUNT_DATA = [58, 60, 63, 65, 64, 67, 69, 68, 71, 73, 74, 76];

const HR_EVENTS: { name: string; initials: string; avatarColor: string; description: string; emoji: string }[] = [
  { name: 'Elif Demir', initials: 'ED', avatarColor: '#EC4899', description: 'Doğum Günü — Bugün!', emoji: '🎂' },
  { name: 'Can Aydın', initials: 'CA', avatarColor: '#10B981', description: '2. İş Yıldönümü — 15 Ağustos', emoji: '🏆' },
  { name: 'Zeynep Arslan', initials: 'ZA', avatarColor: '#F59E0B', description: '3. İş Yıldönümü — 18 Ağustos', emoji: '🏆' },
];

// --- "Performans Yönetimi" sekmesi — kurgusal veri (2026-08-13, gerçek
// app.idenfit.com 360° Değerlendirme liste görünümü referans alınarak). ---

const PERFORMANCE_EVALUATIONS: { name: string; initials: string; avatarColor: string; period: string }[] = [
  { name: '2026 Yıl Sonu 360° Değerlendirmesi', initials: 'YS', avatarColor: '#3B82F6', period: '01 Ara 2026 – 31 Ara 2026' },
  { name: 'Q3 Ekip Liderleri Değerlendirmesi', initials: 'EL', avatarColor: '#10B981', period: '01 Eyl 2026 – 30 Eyl 2026' },
  { name: 'Yeni Yönetici Adayları Değerlendirmesi', initials: 'YA', avatarColor: '#F59E0B', period: '15 Ağu 2026 – 15 Eyl 2026' },
  { name: 'Saha Ekibi Performans Taraması', initials: 'SE', avatarColor: '#8B5CF6', period: '01 Ağu 2026 – 31 Ağu 2026' },
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
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => [i * stepX, height - ((v - min) / range) * height] as const);
  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
  const yTicks = [max, Math.round((max + min) / 2), min];

  return (
    <div>
      <div className="flex gap-2">
        <div className={`flex h-40 flex-col justify-between text-right text-[10px] ${isDark ? 'text-gray-400' : 'text-muted'}`}>
          {yTicks.map((v, i) => (
            <span key={i}>{v}</span>
          ))}
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="h-40 flex-1 overflow-visible"
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
      <div className={`mt-2 flex justify-between pl-6 text-[10px] ${isDark ? 'text-gray-400' : 'text-muted'}`}>
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
    <div className="flex gap-3">
      <div className={`flex h-48 flex-col justify-between text-right text-[10px] ${isDark ? 'text-gray-400' : 'text-muted'}`}>
        {axisLabels.map((v, i) => (
          <span key={i}>{v}</span>
        ))}
      </div>
      <div
        className={`flex flex-1 items-end justify-between gap-2 border-l pl-3 sm:gap-3 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
      >
        {data.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={`flex h-48 w-full max-w-10 flex-col-reverse overflow-hidden rounded-t-md ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
            >
              <div className="rounded-t-md bg-brand" style={{ height: `${(d.value / axisMax) * 100}%` }} title={`${d.label}: ${d.value}${unit}`} />
            </div>
            <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-muted'}`}>{d.label}</span>
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
  icon: ComponentType<{ className?: string; style?: { color?: string } }>;
  color: string;
  value: string;
  label: string;
}) {
  const { isDark } = useTheme();
  return (
    <div
      className={`rounded-xl border border-t-4 p-4 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
      style={{ borderTopColor: color }}
    >
      <Icon className="h-5 w-5" style={{ color }} aria-hidden="true" />
      <p className={`mt-3 text-2xl font-bold ${isDark ? 'text-white' : 'text-heading'}`}>{value}</p>
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
    <div className="flex flex-wrap items-center gap-6">
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
          <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-heading'}`}>{centerLabel}</span>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-300' : 'text-body'}`}>
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
    <div className={`flex h-3 w-full overflow-hidden rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
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
  href: string;
}) {
  const { isDark } = useTheme();
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
        <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>{title}</h3>
      </div>
      <a
        href={href}
        className="shrink-0 rounded-full bg-brand-light px-4 py-1.5 text-xs font-semibold whitespace-nowrap text-brand transition-colors hover:bg-brand hover:text-white"
      >
        Detaya Git →
      </a>
    </div>
  );
}

function WidgetCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const { isDark } = useTheme();
  return (
    <div className={`rounded-xl border p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>{title}</h4>
      <p className={`mt-0.5 text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>{subtitle}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function ShiftAttendanceCard() {
  const { isDark } = useTheme();
  return (
    <WidgetCard title="Vardiya Devam Oranı" subtitle="Vardiya bazlı devam durumu">
      <div className="space-y-4">
        {SHIFTS.map((shift) => (
          <div key={shift.label} className="flex items-center gap-3">
            <span className={`w-32 shrink-0 truncate text-xs sm:w-44 sm:text-sm ${isDark ? 'text-gray-300' : 'text-body'}`}>
              {shift.label}
            </span>
            <div className={`h-2.5 flex-1 overflow-hidden rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="h-full rounded-full bg-brand" style={{ width: `${shift.percent}%` }} />
            </div>
            <span className={`w-9 shrink-0 text-right text-sm font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>
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
      <div className="flex gap-3">
        <div className={`flex h-48 flex-col justify-between text-right text-[10px] ${isDark ? 'text-gray-400' : 'text-muted'}`}>
          {axisLabels.map((v) => (
            <span key={v}>{v}</span>
          ))}
        </div>
        <div
          className={`flex flex-1 items-end justify-between gap-2 border-l pl-3 sm:gap-3 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
        >
          {OVERTIME_MONTHS.map((month) => (
            <div key={month.label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={`flex h-48 w-full max-w-8 flex-col-reverse overflow-hidden rounded-t-md ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
              >
                {month.values.map((v, i) => (
                  <div
                    key={BRANCHES[i].name}
                    style={{ height: `${(v / axisMax) * 100}%`, backgroundColor: BRANCHES[i].color }}
                    title={`${BRANCHES[i].name}: ${v} sa`}
                  />
                ))}
              </div>
              <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-muted'}`}>{month.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
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

function TimeManagementTab() {
  return (
    <div>
      <SectionMiniHeader icon={Clock} title="Zaman" href="/puantaj-takip-programi-modulu/" />
      <div className="grid gap-5 lg:grid-cols-2">
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
      <div className="mt-5 grid grid-cols-3 gap-3">
        {withPercent.map((s) => (
          <div key={s.label} className={`rounded-lg border p-3 text-center ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            <p className="text-lg font-bold" style={{ color: s.color }}>
              {s.count}
            </p>
            <p className={`mt-0.5 text-xs ${isDark ? 'text-gray-400' : 'text-muted'}`}>{s.label}</p>
            <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-muted'}`}>%{s.percent}</p>
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {LEAVE_STATS.map((stat) => (
          <StatCard key={stat.label} icon={stat.icon} color={stat.color} value={stat.value} label={stat.label} />
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <LeaveTypeDistributionCard />
        <ApprovalStatusCard />
      </div>
    </div>
  );
}

function HeadcountTrendCard() {
  const { isDark } = useTheme();
  return (
    <WidgetCard title="Headcount Trendi" subtitle="12 aylık çalışan sayısı">
      <LineChart data={HEADCOUNT_DATA} labels={HEADCOUNT_MONTHS} color="#3B82F6" dotFill={isDark ? '#1F2937' : '#ffffff'} />
    </WidgetCard>
  );
}

function BirthdayAnniversaryCard() {
  const { isDark } = useTheme();
  return (
    <WidgetCard title="Doğum Günü & Yıldönümü" subtitle="Bu hafta">
      <div className="space-y-3">
        {HR_EVENTS.map((event) => (
          <div key={event.name} className={`flex items-center gap-3 rounded-lg border p-3 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
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
      <div className="grid gap-5 lg:grid-cols-2">
        <HeadcountTrendCard />
        <BirthdayAnniversaryCard />
      </div>
    </div>
  );
}

// 360° Değerlendirme liste satırı — sol avatar+ad, orta Dönem/Süre, sağ 3
// eylem butonu (yeşil/mor/kırmızı, kullanıcının gönderdiği referans ekran
// görüntüsündeki renk sırası). Butonlar TAMAMEN dekoratif (AppHeaderBar'daki
// AYNI ilke — bu bir pazarlama mockup'ı, gerçek bir değerlendirme akışı YOK),
// bu yüzden `aria-hidden` ile ekran okuyucudan gizleniyor.
function EvaluationRow({ evaluation }: { evaluation: (typeof PERFORMANCE_EVALUATIONS)[number] }) {
  const { isDark } = useTheme();
  return (
    <div
      className={`flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between ${
        isDark ? 'border-gray-700' : 'border-gray-100'
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: evaluation.avatarColor }}
          aria-hidden="true"
        >
          {evaluation.initials}
        </span>
        <p className={`truncate text-sm font-semibold ${isDark ? 'text-white' : 'text-heading'}`}>{evaluation.name}</p>
      </div>
      <div className="shrink-0 sm:w-48">
        <p className={`text-[10px] font-medium tracking-wide uppercase ${isDark ? 'text-gray-500' : 'text-muted'}`}>Dönem / Süre</p>
        <p className={`mt-0.5 text-xs font-medium ${isDark ? 'text-gray-300' : 'text-body'}`}>{evaluation.period}</p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2" aria-hidden="true">
        <span className="rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white" style={{ backgroundColor: '#289C0F' }}>
          Değerlendirmeyi Başlat
        </span>
        <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white">Önizleme</span>
        <span className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white">Kopya Oluştur</span>
      </div>
    </div>
  );
}

function PerformanceManagementTab() {
  return (
    <div>
      <SectionMiniHeader icon={Target} title="Performans Yönetimi" href="/calisan-performans-degerlendirme-sistemi-modulu/" />
      <WidgetCard title="360° Değerlendirmeler" subtitle="Devam eden ve planlanan değerlendirme süreçleri">
        <div className="space-y-3">
          {PERFORMANCE_EVALUATIONS.map((evaluation) => (
            <EvaluationRow key={evaluation.name} evaluation={evaluation} />
          ))}
        </div>
      </WidgetCard>
    </div>
  );
}

// "Verileri Hesapla" — dekoratif kırmızı buton (Veri Analizi sekmesinde
// 2 kez kullanılıyor: tarih aralığı kontrolünün yanında + grafiklerin
// altında bir "yeniden hesapla" kısayolu olarak, referans ekran
// görüntüsündeki AYNI tekrar deseni). `EvaluationRow`'un dekoratif eylem
// butonlarıyla AYNI ilke — gerçek bir hesaplama işlevi YOK, mockup.
function RecalculateButton() {
  return (
    <span
      role="button"
      aria-hidden="true"
      className="inline-flex shrink-0 cursor-default items-center rounded-lg bg-brand px-4 py-2.5 text-xs font-semibold whitespace-nowrap text-white"
    >
      Verileri Hesapla
    </span>
  );
}

function DateRangeCard() {
  const { isDark } = useTheme();
  const fieldClass = `flex h-10 min-w-0 items-center gap-2 rounded-lg border px-3 text-xs font-medium ${
    isDark ? 'border-gray-700 bg-gray-900 text-gray-300' : 'border-gray-200 bg-white text-body'
  }`;
  return (
    <WidgetCard title="Tarih Aralığı" subtitle="Analiz edilecek dönemi seçin">
      <div className="flex flex-wrap items-center gap-3">
        <span className={fieldClass} aria-hidden="true">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          01.01.2026
        </span>
        <span className={isDark ? 'text-gray-500' : 'text-muted'} aria-hidden="true">
          –
        </span>
        <span className={fieldClass} aria-hidden="true">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
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

function DataAnalysisTab() {
  return (
    <div>
      <SectionMiniHeader icon={BarChart3} title="Veri Analizi" href="/hesaplama-araclari/" />
      <div className="space-y-5">
        <DateRangeCard />
        <div className="grid gap-5 lg:grid-cols-2">
          <DepartmentAbsenteeismCard />
          <AbsenteeismTrendCard />
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
  const iconBtnClass = `flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
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
      className={`mb-5 flex flex-wrap items-center justify-between gap-3 border-b pb-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <div className="flex items-center gap-2">
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
          className={`hidden h-9 items-center gap-2 rounded-lg border px-3 text-xs sm:flex ${
            isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 bg-gray-50 text-muted'
          }`}
        >
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
          Personel ara...
        </span>
      </div>
      <div className="flex items-center gap-2">
        <IconDropdown icon={Eye} label="Görünürlük Ayarları" panelKey="visibility" openPanel={openPanel} onToggle={togglePanel} iconBtnClass={iconBtnClass}>
          <VisibilityPanelContent />
        </IconDropdown>
        <IconDropdown
          label="Dil seçici"
          panelKey="language"
          openPanel={openPanel}
          onToggle={togglePanel}
          panelWidthClass="w-64"
          iconBtnClass={`flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-colors ${
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
          iconBtnClass="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-white transition-[filter] hover:brightness-90"
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
          iconBtnClass="flex items-center gap-2.5 rounded-lg transition-colors"
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

export default function ProductPreviewWidget() {
  const [activeTab, setActiveTab] = useState<TabKey>('zaman');
  const [isDark, setIsDark] = useState(false);
  const toggle = () => setIsDark((v) => !v);

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      <div className={`flex flex-col overflow-hidden rounded-b-2xl border border-t-0 lg:flex-row ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        {/* Gerçek sidebar düzeni (2026-08-13, kullanıcı geri bildirimi —
            gönderdiği app.idenfit.com sidebar ekran görüntüsü referans
            alınarak: "modüller idenfit yazısının yanında olmalı, altında
            değil"). Logo + modül listesi BİRLİKTE dar bir sol sidebar
            sütununu oluşturuyor (`lg:w-72`), asıl içerik bu sidebar'ın
            YANINDA (sağında). Modül listesi (2026-08-13, 2. tur) kullanıcının
            gönderdiği tam ekran görüntüsündeki GERÇEK modül isimleriyle
            genişletildi — yalnızca ilk 3'ü (Zaman/İzin/İnsan Kaynakları)
            fonksiyonel, kalanı `enabled:false` (bkz. `TABS` üstündeki yorum). */}
        <div className={`shrink-0 border-b p-5 lg:w-72 lg:border-r lg:border-b-0 ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
          <IdenfitLogo className={`h-6 w-auto sm:h-7 ${isDark ? 'text-white' : 'text-heading'}`} />
          <nav aria-label="Panel önizleme modülleri" className="mt-5 space-y-1">
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
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : 'text-body hover:bg-brand-light hover:text-brand'
                        : isDark
                          ? 'cursor-not-allowed text-gray-600 hover:bg-gray-800/60'
                          : 'cursor-not-allowed text-muted/50 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
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

        <div className={`flex-1 p-4 sm:p-6 ${isDark ? 'bg-gray-950' : 'bg-[#F9FAFB]'}`}>
          <AppHeaderBar />
          <div key={activeTab} role="tabpanel" className="ppw-tab-enter">
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
