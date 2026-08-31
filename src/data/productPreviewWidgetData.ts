// "Canlı dashboard" widget'ının (ProductPreviewWidget.tsx) Tier 2 —
// kurgusal veri etiketi — çevirileri (2026-08-31, kullanıcı isteği: "canlı
// dashboard içindeki modüller de çevrilmeli"). Kapsam TAMAMI önceki turda
// ölçüldü (~30 modül-seviyesi sabit + ~40 JSX metni, CLAUDE.md Açık nokta
// #51'in güncellemesi) — SEKME SEKME ilerleniyor (kullanıcı onayı), bu
// dosya her turda o sekmenin bölümüyle genişletilecek. İlk sekme: Zaman
// Yönetimi (bu turda TAMAMLANDI, EN/NL/IT/AZ).
//
// Ay/hafta günü KISALTMALARI + ondalık ayraç — ELLE ÇEVRİLMEDİ, önce
// `Intl.DateTimeFormat`/`Intl.NumberFormat`'tan ÜRETİLİYORDU (2026-08-31,
// ilk deneme). **DÜZELTME (aynı gün, İzin Yönetimi turunda bulundu):**
// bu yaklaşım GÜVENİLİR DEĞİLDİ — Node'da (build sırasında SSR) `az-AZ`
// için doğru değerler üretiliyordu, ama gerçek tarayıcıda (Chrome,
// hydration sonrası client-side yeniden hesaplama) `az-AZ`'ın hem kısa
// HEM UZUN ay formatı ("M01".."M12" jenerik fallback'e düşüyor) hem de
// ondalık ayracı ("2,1" yerine "2.1") ICU/CLDR verisi EKSİK olduğu için
// BOZUK çıktı veriyordu — canlıda kanıtlandı (`javascript_tool` ile
// tarayıcı konsolunda test edildi, `Intl.DateTimeFormat('az-AZ',
// {month:'short'}).resolvedOptions()` locale'i doğru çözüyor ama stil
// verisi yok). tr/en/nl/it AYNI ortamda sorunsuzdu — yalnızca az'a özgü
// bir ICU kapsam boşluğu. Bu SSR/CSR ARASI bir tutarsızlığa da yol
// açıyordu (sunucu HTML'i doğru, hydration sonrası ekran yanlış).
// **Kalıcı çözüm:** artık HİÇBİR locale runtime `Intl`'e güvenmiyor —
// aşağıdaki tablolar Node'un TAM ICU'suyla üretilip doğrulanmış gerçek
// değerler (uydurma DEĞİL, CLDR takvim/sayı verisi), sabit olarak
// gömüldü. Bu hem az'ın ICU boşluğunu aşıyor hem de SSR/CSR arasında
// birebir tutarlılığı garanti ediyor (hangi ortamda çalışırsa çalışsın).
import type { Locale } from './nav';

/** Ay kısaltmaları, Ocak(0)'tan Aralık(11)'a. */
export const MONTH_ABBREV: Record<Locale, string[]> = {
  tr: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  nl: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  it: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
  az: ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avq', 'sen', 'okt', 'noy', 'dek'],
};

/** Hafta günü kısaltmaları, Pazartesi(0)'dan Pazar(6)'ya. az için
 * gerçek Azerbaycan takvim kısaltması (B.e/Ç.a/Ç/C.a/C/Ş/B — Bazar
 * ertəsi/Çərşənbə axşamı/Çərşənbə/Cümə axşamı/Cümə/Şənbə/Bazar). */
export const WEEKDAY_ABBREV: Record<Locale, string[]> = {
  tr: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  nl: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],
  it: ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'],
  az: ['B.e', 'Ç.a', 'Ç', 'C.a', 'C', 'Ş', 'B'],
};

/** Ondalık sayı ayracı (ör. "2,1" vs "2.1") — `İzin Yönetimi`
 * sekmesinin "kişi başı ortalama" değerleri için. */
const DECIMAL_SEPARATOR: Record<Locale, ',' | '.'> = { tr: ',', en: '.', nl: ',', it: ',', az: ',' };

export function formatDecimal(value: number, locale: Locale): string {
  return value.toString().replace('.', DECIMAL_SEPARATOR[locale]);
}

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

// --- "İzin Yönetimi" sekmesi — Tier 2 çevirileri (2026-08-31, 4. tur) ---

export interface LeaveManagementLabels {
  /** `SectionMiniHeader` başlığı — Zaman'ın kısa "Zaman" formundan
   * FARKLI olarak TR kaynakta zaten tam form ("İzin Yönetimi"). */
  sectionTitle: string;
  /** "gün"/"days" — sayının YANINA eklenen birim (`{value} {dayUnit}`). */
  dayUnit: string;
  /** `LEAVE_STATS` yapısal diziyle İNDEKS SIRASIYLA eşleşir (4 kart). */
  leaveStats: [string, string, string, string];
  leaveTypeCard: { title: string; subtitle: string };
  /** `LEAVE_TYPE_SEGMENTS` yapısal diziyle İNDEKS SIRASIYLA eşleşir. */
  leaveTypeSegments: [string, string];
  approvalCard: { title: string; subtitle: string };
  /** `APPROVAL_STATS` yapısal diziyle İNDEKS SIRASIYLA eşleşir. */
  approvalStats: [string, string, string];
  leaveTrendCard: { title: string; subtitle: string };
  branchLeaveUsageCard: { title: string; subtitle: string };
  leaveConflictCard: { title: string; subtitle: string; branchBadge: string; emptyState: string };
  topLeaveUnitsCard: { title: string; subtitle: string; avgPerPersonLabel: string };
}

const leaveManagementTr: LeaveManagementLabels = {
  sectionTitle: 'İzin Yönetimi',
  dayUnit: 'gün',
  leaveStats: ['Bugün İzinli', 'Onay Bekleyen', 'Bu Ay Kullanılan Gün', 'Reddedilen'],
  leaveTypeCard: { title: 'İzin Türü Dağılımı', subtitle: 'Bu ay kullanılan izinler' },
  leaveTypeSegments: ['Yıllık İzin', 'Taşınma İzni'],
  approvalCard: { title: 'Onay Durumu Özeti', subtitle: 'Bu ayki izin talepleri' },
  approvalStats: ['Onaylandı', 'Bekliyor', 'Reddedildi'],
  leaveTrendCard: { title: 'Aylık İzin Trendi', subtitle: 'Son 6 ay — kullanılan izin günü' },
  branchLeaveUsageCard: { title: 'Birim Bazlı İzin Kullanımı', subtitle: 'Bu ay — birim başına izin oranı' },
  leaveConflictCard: {
    title: 'İzin Çakışma Uyarısı',
    subtitle: 'Aynı gün izinli olanlar',
    branchBadge: 'Şube',
    emptyState: 'İzin çakışması verisi yok',
  },
  topLeaveUnitsCard: { title: 'En Çok İzin Kullanan Birimler', subtitle: 'Top 5 birim — bu ay', avgPerPersonLabel: 'Kişi başı ort:' },
};

const leaveManagementEn: LeaveManagementLabels = {
  sectionTitle: 'Leave Management',
  dayUnit: 'days',
  leaveStats: ['On Leave Today', 'Pending Approval', 'Days Used This Month', 'Rejected'],
  leaveTypeCard: { title: 'Leave Type Distribution', subtitle: 'Leave used this month' },
  leaveTypeSegments: ['Annual Leave', 'Relocation Leave'],
  approvalCard: { title: 'Approval Status Summary', subtitle: "This month's leave requests" },
  approvalStats: ['Approved', 'Pending', 'Rejected'],
  leaveTrendCard: { title: 'Monthly Leave Trend', subtitle: 'Last 6 months — leave days used' },
  branchLeaveUsageCard: { title: 'Leave Usage by Branch', subtitle: 'This month — leave rate per branch' },
  leaveConflictCard: {
    title: 'Leave Conflict Alert',
    subtitle: 'On leave the same day',
    branchBadge: 'Branch',
    emptyState: 'No leave conflict data',
  },
  topLeaveUnitsCard: { title: 'Top Leave-Using Units', subtitle: 'Top 5 units — this month', avgPerPersonLabel: 'Avg per person:' },
};

const leaveManagementNl: LeaveManagementLabels = {
  sectionTitle: 'Verlofbeheer',
  dayUnit: 'dagen',
  leaveStats: ['Vandaag met Verlof', 'In Afwachting van Goedkeuring', 'Gebruikte Dagen Deze Maand', 'Afgewezen'],
  leaveTypeCard: { title: 'Verdeling Verloftypes', subtitle: 'Deze maand gebruikt verlof' },
  leaveTypeSegments: ['Jaarlijks Verlof', 'Verhuisverlof'],
  approvalCard: { title: 'Overzicht Goedkeuringsstatus', subtitle: 'Verlofaanvragen deze maand' },
  approvalStats: ['Goedgekeurd', 'In Afwachting', 'Afgewezen'],
  leaveTrendCard: { title: 'Maandelijkse Verloftrend', subtitle: 'Laatste 6 maanden — gebruikte verlofdagen' },
  branchLeaveUsageCard: { title: 'Verlofgebruik per Vestiging', subtitle: 'Deze maand — verlofpercentage per vestiging' },
  leaveConflictCard: {
    title: 'Verlofconflictmelding',
    subtitle: 'Op dezelfde dag met verlof',
    branchBadge: 'Vestiging',
    emptyState: 'Geen verlofconflictgegevens',
  },
  topLeaveUnitsCard: {
    title: 'Meest Verlof Gebruikende Eenheden',
    subtitle: 'Top 5 eenheden — deze maand',
    avgPerPersonLabel: 'Gem. per persoon:',
  },
};

const leaveManagementIt: LeaveManagementLabels = {
  sectionTitle: 'Gestione Ferie e Permessi',
  dayUnit: 'giorni',
  leaveStats: ['In Ferie Oggi', 'In Attesa di Approvazione', 'Giorni Utilizzati Questo Mese', 'Rifiutate'],
  leaveTypeCard: { title: 'Distribuzione Tipologie di Ferie', subtitle: 'Ferie utilizzate questo mese' },
  leaveTypeSegments: ['Ferie Annuali', 'Permesso per Trasloco'],
  approvalCard: { title: 'Riepilogo Stato Approvazioni', subtitle: 'Richieste di ferie di questo mese' },
  approvalStats: ['Approvate', 'In Attesa', 'Rifiutate'],
  leaveTrendCard: { title: 'Andamento Mensile delle Ferie', subtitle: 'Ultimi 6 mesi — giorni di ferie utilizzati' },
  branchLeaveUsageCard: { title: 'Utilizzo Ferie per Filiale', subtitle: 'Questo mese — tasso di ferie per filiale' },
  leaveConflictCard: {
    title: 'Avviso Sovrapposizione Ferie',
    subtitle: 'In ferie lo stesso giorno',
    branchBadge: 'Filiale',
    emptyState: 'Nessun dato di sovrapposizione ferie',
  },
  topLeaveUnitsCard: {
    title: 'Unità con Maggiore Utilizzo di Ferie',
    subtitle: 'Top 5 unità — questo mese',
    avgPerPersonLabel: 'Media per persona:',
  },
};

const leaveManagementAz: LeaveManagementLabels = {
  sectionTitle: 'İcazə İdarəçiliyi',
  dayUnit: 'gün',
  leaveStats: ['Bu gün İcazədə', 'Təsdiq Gözləyən', 'Bu Ay İstifadə Edilən Gün', 'Rədd Edilən'],
  leaveTypeCard: { title: 'İcazə Növü Bölgüsü', subtitle: 'Bu ay istifadə edilən icazə' },
  leaveTypeSegments: ['İllik İcazə', 'Köçürülmə İcazəsi'],
  approvalCard: { title: 'Təsdiq Statusu Xülasəsi', subtitle: 'Bu ayın icazə tələbləri' },
  approvalStats: ['Təsdiqləndi', 'Gözləyir', 'Rədd Edildi'],
  leaveTrendCard: { title: 'Aylıq İcazə Trendi', subtitle: 'Son 6 ay — istifadə edilən icazə günü' },
  branchLeaveUsageCard: { title: 'Filial üzrə İcazə İstifadəsi', subtitle: 'Bu ay — filial üzrə icazə nisbəti' },
  leaveConflictCard: {
    title: 'İcazə Toqquşması Xəbərdarlığı',
    subtitle: 'Eyni gün icazədə olanlar',
    branchBadge: 'Filial',
    emptyState: 'İcazə toqquşması məlumatı yoxdur',
  },
  topLeaveUnitsCard: {
    title: 'Ən Çox İcazə İstifadə Edən Bölmələr',
    subtitle: 'İlk 5 bölmə — bu ay',
    avgPerPersonLabel: 'Nəfər başına orta:',
  },
};

const LEAVE_MANAGEMENT_LABELS: Partial<Record<Locale, LeaveManagementLabels>> = {
  tr: leaveManagementTr,
  en: leaveManagementEn,
  nl: leaveManagementNl,
  it: leaveManagementIt,
  az: leaveManagementAz,
};

export function getLeaveManagementLabels(locale: Locale): LeaveManagementLabels {
  return LEAVE_MANAGEMENT_LABELS[locale] ?? leaveManagementTr;
}
