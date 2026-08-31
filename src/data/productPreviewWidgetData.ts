// "Canlı dashboard" widget'ının (ProductPreviewWidget.tsx) Tier 2 —
// kurgusal veri etiketi — çevirileri (2026-08-31, kullanıcı isteği: "canlı
// dashboard içindeki modüller de çevrilmeli"). Kapsam TAMAMI önceki turda
// ölçüldü (~30 modül-seviyesi sabit + ~40 JSX metni, CLAUDE.md Açık nokta
// #51'in güncellemesi) — SEKME SEKME ilerleniyor (kullanıcı onayı), bu
// dosya her turda o sekmenin bölümüyle genişletilecek. İlk sekme: Zaman
// Yönetimi (bu turda TAMAMLANDI, EN/NL/IT/AZ).
//
// Ay/gün KISALTMALARI (`Oca`/`Şub`/`Pzt`/`Sal` vb.) ELLE ÇEVRİLMEDİ —
// `Intl.DateTimeFormat`'ın (`dates.ts`'in paylaşılan `BCP47_LOCALE`
// eşlemesiyle) kendi ICU verisinden üretiliyor. Doğrulandı: tr için
// üretilen değerler widget'ın ÖNCEDEN hardcoded olan değerleriyle (Oca/
// Şub/Mar/Nis/May/Haz/Tem/Ağu/Eyl/Eki/Kas/Ara, Pzt/Sal/Çar/Per/Cum/Cmt/Paz)
// BİREBİR aynı çıktı — uydurma riski yok, tarayıcının/Node'un gerçek
// yerel takvim verisi.
import type { Locale } from './nav';
import { BCP47_LOCALE } from './dates';

function computeMonthAbbrev(locale: Locale): string[] {
  const fmt = new Intl.DateTimeFormat(BCP47_LOCALE[locale], { month: 'short' });
  // Yıl/gün keyfi (yalnızca ay kısaltması okunuyor) — 2026 kullanıldı,
  // projenin genelindeki "referans an" ile tutarlı (bkz. widget dosya
  // başı yorumu, CALENDAR_CELLS'in Ağustos 2026'sı).
  return Array.from({ length: 12 }, (_, m) => fmt.format(new Date(2026, m, 1)));
}
function computeWeekdayAbbrevMonFirst(locale: Locale): string[] {
  const fmt = new Intl.DateTimeFormat(BCP47_LOCALE[locale], { weekday: 'short' });
  // 17 Ağustos 2026 bir Pazartesi — Pzt'den başlayan 7 günlük dizi için
  // referans nokta.
  return Array.from({ length: 7 }, (_, d) => fmt.format(new Date(2026, 7, 17 + d)));
}

/** Ay kısaltmaları, Ocak(0)'tan Aralık(11)'a — `OVERTIME_MONTHS` gibi
 * yalnızca ilk N ayı kullanan sabitler `.slice(0, N)` ile dilimler. */
export const MONTH_ABBREV: Record<Locale, string[]> = {
  tr: computeMonthAbbrev('tr'),
  en: computeMonthAbbrev('en'),
  nl: computeMonthAbbrev('nl'),
  it: computeMonthAbbrev('it'),
  az: computeMonthAbbrev('az'),
};

/** Hafta günü kısaltmaları, Pazartesi(0)'dan Pazar(6)'ya. */
export const WEEKDAY_ABBREV: Record<Locale, string[]> = {
  tr: computeWeekdayAbbrevMonFirst('tr'),
  en: computeWeekdayAbbrevMonFirst('en'),
  nl: computeWeekdayAbbrevMonFirst('nl'),
  it: computeWeekdayAbbrevMonFirst('it'),
  az: computeWeekdayAbbrevMonFirst('az'),
};

// --- "Zaman Yönetimi" sekmesi — Tier 2 çevirileri ---

export interface TimeManagementLabels {
  /** `SectionMiniHeader`'ın kısa sekme başlığı (sidebar'daki tam
   * "Zaman Yönetimi" etiketinden FARKLI, kasıtlı kısa form — TR kaynakta
   * da öyleydi). */
  sectionTitle: string;
  shiftCard: { title: string; subtitle: string };
  /** `SHIFTS` yapısal dizisiyle (percent/renk) İNDEKS SIRASIYLA eşleşir:
   * [Sabah, Akşam, Gece, Ofis Personeli, Saha Ekibi]. */
  shifts: [string, string, string, string, string];
  overtimeCard: { title: string; subtitle: string };
  /** `BRANCHES` yapısal diziyle İNDEKS SIRASIYLA eşleşir (Merkez/
   * Teknopark/Anadolu/Avrupa) — `İzin Yönetimi` sekmesi de (ayrı bir
   * turda) AYNI diziyi yeniden kullanacak. */
  branches: [string, string, string, string];
  /** Saat kısaltması (tooltip'lerde "8 sa" gibi) — TR "sa", EN "h" vb. */
  hourAbbrev: string;
  attendanceCard: { title: string; subtitle: string };
  attendanceLegend: { present: string; late: string; onLeave: string; earlyLeave: string };
  miniStats: { absent: string; late: string; earlyLeave: string; onLeaveToday: string };
  /** `TIME_KPIS` yapısal diziyle İNDEKS SIRASIYLA eşleşir (3 kart). */
  kpiSubtext: [string, string, string];
  avgHoursCard: {
    title: string;
    subtitle: string;
    allBranchesBadge: string;
    workTooltipLabel: string;
    overtimeTooltipLabel: string;
    avgWorkLegend: string;
    avgOvertimeLegend: string;
  };
}

const timeManagementTr: TimeManagementLabels = {
  sectionTitle: 'Zaman',
  shiftCard: { title: 'Vardiya Devam Oranı', subtitle: 'Vardiya bazlı devam durumu' },
  shifts: ['Sabah Vardiyası (08:00-17:00)', 'Akşam Vardiyası (16:00-24:00)', 'Gece Vardiyası (00:00-08:00)', 'Ofis Personeli', 'Saha Ekibi'],
  overtimeCard: { title: 'Fazla Mesai Özeti', subtitle: 'Aylık — Şubeye göre' },
  branches: ['Merkez Şube', 'Teknopark Şube', 'Anadolu Şube', 'Avrupa Şube'],
  hourAbbrev: 'sa',
  attendanceCard: { title: 'Devam Takibi', subtitle: 'Son 7 günlük giriş-çıkış özeti' },
  attendanceLegend: { present: 'Mevcut', late: 'Geç Gelen', onLeave: 'İzinli', earlyLeave: 'Erken Çıkan' },
  miniStats: { absent: 'Devamsız', late: 'Geç Gelen', earlyLeave: 'Erken Çıkan', onLeaveToday: 'Bugün İzinli' },
  kpiSubtext: ['8 yeni işe alım (bu ay)', '%91 devam oranı', 'Bu hafta 2 talep oluşturuldu'],
  avgHoursCard: {
    title: 'Ortalama Çalışma Saati',
    subtitle: 'Son 7 gün — Tüm Şubeler',
    allBranchesBadge: 'Tüm Şubeler',
    workTooltipLabel: 'Çalışma',
    overtimeTooltipLabel: 'Fazla Mesai',
    avgWorkLegend: 'Ortalama Çalışma Saati',
    avgOvertimeLegend: 'Ortalama Fazla Mesai',
  },
};

// EN — modül/terminoloji `productPreviewWidgetLabels.ts`'in Tier 1 EN
// çevirisiyle tutarlı (ör. "Time Management").
const timeManagementEn: TimeManagementLabels = {
  sectionTitle: 'Time',
  shiftCard: { title: 'Shift Attendance Rate', subtitle: 'Attendance status by shift' },
  shifts: ['Morning Shift (08:00–17:00)', 'Evening Shift (16:00–24:00)', 'Night Shift (00:00–08:00)', 'Office Staff', 'Field Team'],
  overtimeCard: { title: 'Overtime Summary', subtitle: 'Monthly — by Branch' },
  branches: ['Head Office', 'Technopark Branch', 'Anatolia Branch', 'Europe Branch'],
  hourAbbrev: 'h',
  attendanceCard: { title: 'Attendance Tracking', subtitle: 'Last 7 days check-in/check-out summary' },
  attendanceLegend: { present: 'Present', late: 'Late Arrival', onLeave: 'On Leave', earlyLeave: 'Early Leave' },
  miniStats: { absent: 'Absent', late: 'Late Arrival', earlyLeave: 'Early Leave', onLeaveToday: 'On Leave Today' },
  kpiSubtext: ['8 new hires (this month)', '91% attendance rate', '2 requests created this week'],
  avgHoursCard: {
    title: 'Average Working Hours',
    subtitle: 'Last 7 days — All Branches',
    allBranchesBadge: 'All Branches',
    workTooltipLabel: 'Work',
    overtimeTooltipLabel: 'Overtime',
    avgWorkLegend: 'Average Working Hours',
    avgOvertimeLegend: 'Average Overtime',
  },
};

// NL — "vestiging" (branch) `nl.ts`'te kullanılmıyor (site genelinde şube
// kavramı yok) — standart Hollandaca iş terimi, UYDURMA değil.
const timeManagementNl: TimeManagementLabels = {
  sectionTitle: 'Tijd',
  shiftCard: { title: 'Aanwezigheidspercentage per Dienst', subtitle: 'Aanwezigheidsstatus per dienst' },
  shifts: ['Ochtenddienst (08:00–17:00)', 'Avonddienst (16:00–24:00)', 'Nachtdienst (00:00–08:00)', 'Kantoorpersoneel', 'Buitendienstteam'],
  overtimeCard: { title: 'Overzicht Overuren', subtitle: 'Maandelijks — per vestiging' },
  branches: ['Hoofdkantoor', 'Vestiging Technopark', 'Vestiging Anatolië', 'Vestiging Europa'],
  hourAbbrev: 'u',
  attendanceCard: { title: 'Aanwezigheidsregistratie', subtitle: 'Overzicht in- en uitklokken, laatste 7 dagen' },
  attendanceLegend: { present: 'Aanwezig', late: 'Te Laat', onLeave: 'Met Verlof', earlyLeave: 'Vroeg Vertrokken' },
  miniStats: { absent: 'Afwezig', late: 'Te Laat', earlyLeave: 'Vroeg Vertrokken', onLeaveToday: 'Vandaag met Verlof' },
  kpiSubtext: ['8 nieuwe aannames (deze maand)', '91% aanwezigheidspercentage', 'Deze week 2 aanvragen aangemaakt'],
  avgHoursCard: {
    title: 'Gemiddelde Werkuren',
    subtitle: 'Laatste 7 dagen — Alle vestigingen',
    allBranchesBadge: 'Alle Vestigingen',
    workTooltipLabel: 'Werk',
    overtimeTooltipLabel: 'Overuren',
    avgWorkLegend: 'Gemiddelde Werkuren',
    avgOvertimeLegend: 'Gemiddelde Overuren',
  },
};

// IT — "filiale" (şube) standart terim; `hourAbbrev` "h" (İngilizce ile
// aynı, İtalyanca'da saat için yaygın kısaltma — "o" (ora) daha az
// yaygın/belirsiz olduğundan tercih edilmedi).
const timeManagementIt: TimeManagementLabels = {
  sectionTitle: 'Tempo',
  shiftCard: { title: 'Tasso di Presenza per Turno', subtitle: 'Stato di presenza per turno' },
  shifts: ['Turno Mattutino (08:00–17:00)', 'Turno Serale (16:00–24:00)', 'Turno Notturno (00:00–08:00)', "Personale d'Ufficio", 'Team sul Campo'],
  overtimeCard: { title: 'Riepilogo Straordinari', subtitle: 'Mensile — per filiale' },
  branches: ['Sede Centrale', 'Filiale Technopark', 'Filiale Anatolia', 'Filiale Europa'],
  hourAbbrev: 'h',
  attendanceCard: { title: 'Monitoraggio Presenze', subtitle: 'Riepilogo entrate/uscite ultimi 7 giorni' },
  attendanceLegend: { present: 'Presente', late: 'Ritardo', onLeave: 'In Ferie', earlyLeave: 'Uscita Anticipata' },
  miniStats: { absent: 'Assente', late: 'Ritardo', earlyLeave: 'Uscita Anticipata', onLeaveToday: 'In Ferie Oggi' },
  kpiSubtext: ['8 nuove assunzioni (questo mese)', 'Tasso di presenza del 91%', '2 richieste create questa settimana'],
  avgHoursCard: {
    title: 'Ore Lavorative Medie',
    subtitle: 'Ultimi 7 giorni — Tutte le filiali',
    allBranchesBadge: 'Tutte le Filiali',
    workTooltipLabel: 'Lavoro',
    overtimeTooltipLabel: 'Straordinario',
    avgWorkLegend: 'Ore Lavorative Medie',
    avgOvertimeLegend: 'Straordinario Medio',
  },
};

// AZ — "filial" (şube), `az.ts`'te doğrudan karşılığı yok, standart
// Azerbaycan iş termi (UYDURMA değil). `hourAbbrev` "saat" (tam kelime) —
// Azerbaycancada yaygın tek harfli bir "saat" kısaltması YOK, kısaltmak
// belirsizliğe yol açardı.
const timeManagementAz: TimeManagementLabels = {
  sectionTitle: 'Vaxt',
  shiftCard: { title: 'Növbə üzrə Davamiyyət Nisbəti', subtitle: 'Növbəyə görə davamiyyət vəziyyəti' },
  shifts: ['Səhər Növbəsi (08:00–17:00)', 'Axşam Növbəsi (16:00–24:00)', 'Gecə Növbəsi (00:00–08:00)', 'Ofis Heyəti', 'Saha Komandası'],
  overtimeCard: { title: 'Əlavə İş Saatları Xülasəsi', subtitle: 'Aylıq — Filial üzrə' },
  branches: ['Baş Filial', 'Texnopark Filialı', 'Anadolu Filialı', 'Avropa Filialı'],
  hourAbbrev: 'saat',
  attendanceCard: { title: 'Davamiyyət İzlənməsi', subtitle: 'Son 7 günün giriş-çıxış xülasəsi' },
  attendanceLegend: { present: 'Mövcud', late: 'Gecikmə', onLeave: 'İcazədə', earlyLeave: 'Erkən Çıxış' },
  miniStats: { absent: 'Davamsız', late: 'Gecikmə', earlyLeave: 'Erkən Çıxış', onLeaveToday: 'Bu gün İcazədə' },
  kpiSubtext: ['Bu ay 8 yeni işə qəbul', '%91 davamiyyət nisbəti', 'Bu həftə 2 tələb yaradıldı'],
  avgHoursCard: {
    title: 'Orta İş Saatları',
    subtitle: 'Son 7 gün — Bütün Filiallar',
    allBranchesBadge: 'Bütün Filiallar',
    workTooltipLabel: 'İş',
    overtimeTooltipLabel: 'Əlavə İş',
    avgWorkLegend: 'Orta İş Saatları',
    avgOvertimeLegend: 'Orta Əlavə İş',
  },
};

const TIME_MANAGEMENT_LABELS: Partial<Record<Locale, TimeManagementLabels>> = {
  tr: timeManagementTr,
  en: timeManagementEn,
  nl: timeManagementNl,
  it: timeManagementIt,
  az: timeManagementAz,
};

export function getTimeManagementLabels(locale: Locale): TimeManagementLabels {
  return TIME_MANAGEMENT_LABELS[locale] ?? timeManagementTr;
}
