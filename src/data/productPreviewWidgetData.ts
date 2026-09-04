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

/** Yüzde işaretinin sayıdan ÖNCE mi SONRA mı geldiği — tr/az "%29",
 * en/nl/it "29%" (2026-08-31, `kpiSubtext` turunda kurulan emsalin
 * genellenmiş hali). */
const PERCENT_SIGN_BEFORE: Record<Locale, boolean> = { tr: true, en: false, nl: false, it: false, az: true };

export function formatPercent(value: number, locale: Locale): string {
  return PERCENT_SIGN_BEFORE[locale] ? `%${value}` : `${value}%`;
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

// --- "İnsan Kaynakları" sekmesi — Tier 2 çevirileri (2026-08-31, 5. tur) ---

export interface HumanResourcesLabels {
  /** `SectionMiniHeader` başlığı — Tier 1'in `tabs.ik`'siyle AYNI (TR
   * kaynakta zaten tam form). */
  sectionTitle: string;
  headcountCard: { title: string; subtitle: string; totalBadge: string };
  birthdayCard: { title: string; subtitle: string };
  /** `HR_EVENTS` yapısal diziyle İNDEKS SIRASIYLA eşleşir — kişi adları
   * ("Elif Demir" vb.) ÇEVRİLMİYOR, yalnızca `description`. */
  hrEvents: [string, string, string];
  turnoverCard: { title: string; subtitle: string; hiredLegend: string; leftLegend: string };
  /** `TURNOVER_STATS` yapısal diziyle İNDEKS SIRASIYLA eşleşir. */
  turnoverStats: [string, string, string];
  pendingApprovalsCard: { title: string; subtitle: string; totalLabel: string };
  /** `PENDING_APPROVALS` yapısal diziyle İNDEKS SIRASIYLA eşleşir. */
  pendingApprovals: [string, string, string, string, string];
  calendarCard: {
    title: string;
    subtitle: string;
    /** Sabit "Ağustos 2026" — `CALENDAR_CELLS`'in KENDİSİ o aya özgü
     * gerçek takvim matematiği taşıyor, dinamik ÜRETİLMİYOR (widget
     * dosyasının kendi yorumuyla tutarlı). */
    monthLabel: string;
    legendBirthdays: string;
    legendAnniversaries: string;
    legendLeaves: string;
  };
  probationCard: { title: string; subtitle: string };
  contractCard: { title: string; subtitle: string };
  monthUnit: string;
  yearUnit: string;
  dayUnit: string;
}

const humanResourcesTr: HumanResourcesLabels = {
  sectionTitle: 'İnsan Kaynakları',
  headcountCard: { title: 'Headcount Trendi', subtitle: '12 aylık çalışan sayısı', totalBadge: 'Toplam' },
  birthdayCard: { title: 'Doğum Günü & Yıldönümü', subtitle: 'Bu hafta' },
  hrEvents: ['Doğum Günü — Bugün!', '2. İş Yıldönümü — 15 Ağustos', '3. İş Yıldönümü — 18 Ağustos'],
  turnoverCard: { title: 'Çalışan Devir Hızı', subtitle: 'Son 6 ay — işe alım vs ayrılma', hiredLegend: 'İşe Giren', leftLegend: 'Ayrılan' },
  turnoverStats: ['İşe Giren', 'Ayrılan', 'Devir Oranı'],
  pendingApprovalsCard: { title: 'Onay Bekleyen İşlemler', subtitle: 'Bekleyen onay talepleri', totalLabel: 'Toplam Bekleyen' },
  pendingApprovals: ['Avans Talepleri', 'Fazla Mesai Talepleri', 'Eğitim Talepleri', 'Evrak Talepleri', 'Eksik Kayıt Talepleri'],
  calendarCard: {
    title: 'Takvim',
    subtitle: 'Doğum günleri, yıldönümleri ve izinler',
    monthLabel: 'Ağustos 2026',
    legendBirthdays: 'Doğum Günleri',
    legendAnniversaries: 'Yıldönümleri',
    legendLeaves: 'İzinler',
  },
  probationCard: { title: 'Deneme Süresi Takibi', subtitle: 'Deneme süresindeki çalışanlar' },
  contractCard: { title: 'Sözleşme Takibi', subtitle: 'Yenilenmesi gereken sözleşmeler' },
  monthUnit: 'Ay',
  yearUnit: 'Yıl',
  dayUnit: 'gün',
};

const humanResourcesEn: HumanResourcesLabels = {
  sectionTitle: 'Human Resources',
  headcountCard: { title: 'Headcount Trend', subtitle: '12-month employee count', totalBadge: 'Total' },
  birthdayCard: { title: 'Birthdays & Anniversaries', subtitle: 'This week' },
  hrEvents: ['Birthday — Today!', '2nd Work Anniversary — August 15', '3rd Work Anniversary — August 18'],
  turnoverCard: { title: 'Employee Turnover Rate', subtitle: 'Last 6 months — hires vs departures', hiredLegend: 'Hired', leftLegend: 'Left' },
  turnoverStats: ['Hired', 'Left', 'Turnover Rate'],
  pendingApprovalsCard: { title: 'Pending Approvals', subtitle: 'Pending approval requests', totalLabel: 'Total Pending' },
  pendingApprovals: ['Advance Requests', 'Overtime Requests', 'Training Requests', 'Document Requests', 'Missing Record Requests'],
  calendarCard: {
    title: 'Calendar',
    subtitle: 'Birthdays, anniversaries, and leaves',
    monthLabel: 'August 2026',
    legendBirthdays: 'Birthdays',
    legendAnniversaries: 'Anniversaries',
    legendLeaves: 'Leaves',
  },
  probationCard: { title: 'Probation Tracking', subtitle: 'Employees on probation' },
  contractCard: { title: 'Contract Tracking', subtitle: 'Contracts due for renewal' },
  // "Months" (çoğul) — `PROBATION_TRACKING_STRUCTURE`'da bu birim
  // yalnızca 2/6 (>1) değerleriyle kullanılıyor, TR/AZ'ın aksine
  // İngilizce sayı+isim çoğul eki GEREKTİRİYOR.
  monthUnit: 'Months',
  yearUnit: 'Year',
  dayUnit: 'days',
};

const humanResourcesNl: HumanResourcesLabels = {
  sectionTitle: 'HR',
  headcountCard: { title: 'Headcount-trend', subtitle: 'Medewerkersaantal over 12 maanden', totalBadge: 'Totaal' },
  birthdayCard: { title: 'Verjaardagen & Jubilea', subtitle: 'Deze week' },
  hrEvents: ['Verjaardag — Vandaag!', '2e Werkjubileum — 15 augustus', '3e Werkjubileum — 18 augustus'],
  turnoverCard: {
    title: 'Personeelsverloop',
    subtitle: 'Laatste 6 maanden — aannames vs vertrek',
    hiredLegend: 'Aangenomen',
    leftLegend: 'Vertrokken',
  },
  turnoverStats: ['Aangenomen', 'Vertrokken', 'Verloop'],
  pendingApprovalsCard: { title: 'Openstaande Goedkeuringen', subtitle: 'Openstaande goedkeuringsverzoeken', totalLabel: 'Totaal Openstaand' },
  pendingApprovals: [
    'Voorschotaanvragen',
    'Overurenaanvragen',
    'Opleidingsaanvragen',
    'Documentaanvragen',
    'Aanvragen Ontbrekende Registratie',
  ],
  calendarCard: {
    title: 'Kalender',
    subtitle: 'Verjaardagen, jubilea en verlof',
    monthLabel: 'augustus 2026',
    legendBirthdays: 'Verjaardagen',
    legendAnniversaries: 'Jubilea',
    legendLeaves: 'Verlof',
  },
  probationCard: { title: 'Proeftijdregistratie', subtitle: 'Medewerkers in proeftijd' },
  contractCard: { title: 'Contractregistratie', subtitle: 'Contracten met verlengingsdatum' },
  // "Maanden" (çoğul) — Hollandaca'da da >1 için çoğul ek gerekiyor
  // (bkz. EN'deki aynı gerekçe). "Jaar" Hollandaca'da değişmez
  // (tekil/çoğul aynı), bu yüzden `yearUnit` değişmedi.
  monthUnit: 'Maanden',
  yearUnit: 'Jaar',
  dayUnit: 'dagen',
};

const humanResourcesIt: HumanResourcesLabels = {
  sectionTitle: 'Risorse Umane',
  headcountCard: { title: 'Andamento Organico', subtitle: 'Numero dipendenti su 12 mesi', totalBadge: 'Totale' },
  birthdayCard: { title: 'Compleanni e Anniversari', subtitle: 'Questa settimana' },
  hrEvents: ['Compleanno — Oggi!', '2° Anniversario Lavorativo — 15 agosto', '3° Anniversario Lavorativo — 18 agosto'],
  turnoverCard: {
    title: 'Tasso di Turnover',
    subtitle: 'Ultimi 6 mesi — assunzioni vs uscite',
    hiredLegend: 'Assunti',
    leftLegend: 'Usciti',
  },
  turnoverStats: ['Assunti', 'Usciti', 'Tasso di Turnover'],
  pendingApprovalsCard: { title: 'Approvazioni in Sospeso', subtitle: 'Richieste di approvazione in sospeso', totalLabel: 'Totale in Sospeso' },
  pendingApprovals: [
    'Richieste di Anticipo',
    'Richieste Straordinari',
    'Richieste di Formazione',
    'Richieste Documenti',
    'Richieste Registrazioni Mancanti',
  ],
  calendarCard: {
    title: 'Calendario',
    subtitle: 'Compleanni, anniversari e ferie',
    monthLabel: 'agosto 2026',
    legendBirthdays: 'Compleanni',
    legendAnniversaries: 'Anniversari',
    legendLeaves: 'Ferie',
  },
  probationCard: { title: 'Monitoraggio Periodo di Prova', subtitle: 'Dipendenti in periodo di prova' },
  contractCard: { title: 'Monitoraggio Contratti', subtitle: 'Contratti in scadenza per rinnovo' },
  // "Mesi" (çoğul) — İtalyanca'da da >1 için çoğul ek gerekiyor.
  monthUnit: 'Mesi',
  yearUnit: 'Anno',
  dayUnit: 'giorni',
};

const humanResourcesAz: HumanResourcesLabels = {
  sectionTitle: 'İnsan Resursları',
  headcountCard: { title: 'İşçi Sayı Trendi', subtitle: '12 aylıq işçi sayı', totalBadge: 'Cəmi' },
  birthdayCard: { title: 'Ad Günləri və İldönümləri', subtitle: 'Bu həftə' },
  hrEvents: ['Ad Günü — Bu gün!', '2-ci İş İldönümü — 15 avqust', '3-cü İş İldönümü — 18 avqust'],
  turnoverCard: {
    title: 'Kadr Dövriyyəsi',
    subtitle: 'Son 6 ay — işə qəbul və ayrılma',
    hiredLegend: 'İşə Qəbul',
    leftLegend: 'Ayrılan',
  },
  turnoverStats: ['İşə Qəbul', 'Ayrılan', 'Dövriyyə Nisbəti'],
  pendingApprovalsCard: { title: 'Təsdiq Gözləyən Əməliyyatlar', subtitle: 'Gözləyən təsdiq tələbləri', totalLabel: 'Cəmi Gözləyən' },
  pendingApprovals: ['Avans Tələbləri', 'Əlavə İş Tələbləri', 'Təlim Tələbləri', 'Sənəd Tələbləri', 'Çatışmayan Qeyd Tələbləri'],
  calendarCard: {
    title: 'Təqvim',
    subtitle: 'Ad günləri, ildönümləri və icazələr',
    monthLabel: 'Avqust 2026',
    legendBirthdays: 'Ad Günləri',
    legendAnniversaries: 'İldönümləri',
    legendLeaves: 'İcazələr',
  },
  probationCard: { title: 'Sınaq Müddəti İzlənməsi', subtitle: 'Sınaq müddətindəki işçilər' },
  contractCard: { title: 'Müqavilə İzlənməsi', subtitle: 'Yenilənməsi lazım olan müqavilələr' },
  monthUnit: 'Ay',
  yearUnit: 'İl',
  dayUnit: 'gün',
};

const HUMAN_RESOURCES_LABELS: Partial<Record<Locale, HumanResourcesLabels>> = {
  tr: humanResourcesTr,
  en: humanResourcesEn,
  nl: humanResourcesNl,
  it: humanResourcesIt,
  az: humanResourcesAz,
};

export function getHumanResourcesLabels(locale: Locale): HumanResourcesLabels {
  return HUMAN_RESOURCES_LABELS[locale] ?? humanResourcesTr;
}

// --- "Performans Yönetimi" sekmesi — Tier 2 çevirileri (2026-09-01) ---

export interface PerformanceManagementLabels {
  sectionTitle: string;
  /** `PERFORMANCE_KPI_STATS` yapısal diziyle (icon/color) İNDEKS
   * SIRASIYLA eşleşir. `value` yüzde işaretiyse `formatPercent()`'in
   * bu locale için ürettiği BİÇİME uygun elle yazıldı. */
  kpiStats: [{ value: string; label: string }, { value: string; label: string }, { value: string; label: string }, { value: string; label: string }];
  goalsCard: { title: string; subtitle: string };
  /** `PERFORMANCE_GOALS_STRUCTURE` yapısal diziyle İNDEKS SIRASIYLA
   * eşleşir. "Sales"/"Marketing" kategorileri TR kaynakta da İngilizce
   * kullanıldığı için ÇEVRİLMEDİ (bilinçli, kaynağın kendi tercihi). */
  goals: { name: string; scope: string; category: string; status: string }[];
  /** Sabit "2026 H2" — dönem notasyonu dilden bağımsız, TÜM locale'lerde
   * aynı kalıyor. */
  period: string;
  keyResultUnitLabel: string;
  keyResultsCard: {
    title: string;
    /** `{goal}` yer tutucusu `t.goals[0].name` ile değiştirilir —
     * ikinci bir hedef-adı kopyası YAZILMADI. */
    subtitleTemplate: string;
  };
  /** `GOAL_KEY_RESULTS_STRUCTURE` yapısal diziyle İNDEKS SIRASIYLA
   * eşleşir. Para birimi (₺) TÜM locale'lerde AYNI kalıyor — kurgusal
   * şirket Türkiye merkezli, gerçek bir çoklu-para-birimi sistemi YOK. */
  keyResults: { name: string; lastCheckInLabel: string; status: string; currentValueLabel: string; startLabel: string; endLabel: string }[];
  lastCheckInPrefix: string;
  currentPrefix: string;
  /** `${expectedPrefix} ${formatPercent(n)} — ${paceLabel}` şeklinde
   * birleştiriliyor. */
  expectedPrefix: string;
  paceAheadLabel: string;
  paceBehindLabel: string;
}

const performanceManagementTr: PerformanceManagementLabels = {
  sectionTitle: 'Performans Yönetimi',
  kpiStats: [
    { value: '5', label: 'Aktif KPI' },
    { value: '%29', label: 'Ortalama İlerleme' },
    { value: '3', label: 'Riskli / Beklenen Altı' },
    { value: '3', label: 'Check-in Bekleyen' },
  ],
  goalsCard: { title: 'Hedefler (OKR) / KPI', subtitle: 'Şirket, takım ve bireysel hedeflerin ilerleme durumu' },
  goals: [
    { name: 'Yıllık ciroyu %20 artırmak', scope: 'Şirket', category: 'Finansal Hedefler', status: 'Riskli' },
    { name: 'Yeni pazarlara açılmak', scope: 'Takım', category: 'Sales', status: 'Yolunda' },
    { name: 'Yeni nesil mobil deneyimi hayata geçirmek', scope: 'Şirket', category: 'Ürün Geliştirme', status: 'Yolunda' },
    { name: 'Marka bilinirliğini artırmak', scope: 'Takım', category: 'Marketing', status: 'Beklenen Altı' },
  ],
  period: '2026 H2',
  keyResultUnitLabel: 'anahtar sonuç',
  keyResultsCard: { title: 'Anahtar Sonuçlar', subtitleTemplate: '“{goal}” hedefinin ilerleme detayı' },
  keyResults: [
    {
      name: 'Yeni müşteri kazanımı',
      lastCheckInLabel: '20 Ağu',
      status: 'Yolunda',
      currentValueLabel: '26 müşteri',
      startLabel: '0 müşteri',
      endLabel: '40 müşteri',
    },
    {
      name: 'Ortalama sipariş tutarı',
      lastCheckInLabel: '18 Ağu',
      status: 'Riskli',
      currentValueLabel: '155 ₺',
      startLabel: '0 ₺',
      endLabel: '500 ₺',
    },
  ],
  lastCheckInPrefix: 'Son check-in:',
  currentPrefix: 'Güncel:',
  expectedPrefix: 'Takvime göre beklenen',
  paceAheadLabel: 'planın önünde',
  paceBehindLabel: 'planın gerisinde',
};

const performanceManagementEn: PerformanceManagementLabels = {
  sectionTitle: 'Performance Management',
  kpiStats: [
    { value: '5', label: 'Active KPIs' },
    { value: '29%', label: 'Average Progress' },
    { value: '3', label: 'At Risk / Below Expected' },
    { value: '3', label: 'Pending Check-in' },
  ],
  goalsCard: { title: 'Goals (OKR) / KPI', subtitle: 'Progress status of company, team, and individual goals' },
  goals: [
    { name: 'Increase annual revenue by 20%', scope: 'Company', category: 'Financial Goals', status: 'At Risk' },
    { name: 'Expand into new markets', scope: 'Team', category: 'Sales', status: 'On Track' },
    { name: 'Launch the next-gen mobile experience', scope: 'Company', category: 'Product Development', status: 'On Track' },
    { name: 'Increase brand awareness', scope: 'Team', category: 'Marketing', status: 'Below Expected' },
  ],
  period: '2026 H2',
  keyResultUnitLabel: 'key results',
  keyResultsCard: { title: 'Key Results', subtitleTemplate: 'Progress details for “{goal}”' },
  keyResults: [
    {
      name: 'New customer acquisition',
      lastCheckInLabel: '20 Aug',
      status: 'On Track',
      currentValueLabel: '26 customers',
      startLabel: '0 customers',
      endLabel: '40 customers',
    },
    {
      name: 'Average order value',
      lastCheckInLabel: '18 Aug',
      status: 'At Risk',
      currentValueLabel: '155 ₺',
      startLabel: '0 ₺',
      endLabel: '500 ₺',
    },
  ],
  lastCheckInPrefix: 'Last check-in:',
  currentPrefix: 'Current:',
  expectedPrefix: 'Expected by schedule:',
  paceAheadLabel: 'ahead of plan',
  paceBehindLabel: 'behind plan',
};

const performanceManagementNl: PerformanceManagementLabels = {
  sectionTitle: 'Prestatiemanagement',
  kpiStats: [
    { value: '5', label: 'Actieve KPI’s' },
    { value: '29%', label: 'Gemiddelde Voortgang' },
    { value: '3', label: 'Risico / Onder Verwachting' },
    { value: '3', label: 'Check-in in Behandeling' },
  ],
  goalsCard: { title: 'Doelen (OKR) / KPI', subtitle: 'Voortgangsstatus van bedrijfs-, team- en individuele doelen' },
  goals: [
    { name: 'Jaarlijkse omzet met 20% verhogen', scope: 'Bedrijf', category: 'Financiële Doelen', status: 'Risico' },
    { name: 'Uitbreiden naar nieuwe markten', scope: 'Team', category: 'Sales', status: 'Op Schema' },
    { name: 'De mobiele ervaring van de nieuwe generatie lanceren', scope: 'Bedrijf', category: 'Productontwikkeling', status: 'Op Schema' },
    { name: 'Merkbekendheid vergroten', scope: 'Team', category: 'Marketing', status: 'Onder Verwachting' },
  ],
  period: '2026 H2',
  keyResultUnitLabel: 'kernresultaten',
  keyResultsCard: { title: 'Kernresultaten', subtitleTemplate: 'Voortgangsdetails voor “{goal}”' },
  keyResults: [
    {
      name: 'Nieuwe klantenwerving',
      lastCheckInLabel: '20 aug',
      status: 'Op Schema',
      currentValueLabel: '26 klanten',
      startLabel: '0 klanten',
      endLabel: '40 klanten',
    },
    {
      name: 'Gemiddelde orderwaarde',
      lastCheckInLabel: '18 aug',
      status: 'Risico',
      currentValueLabel: '155 ₺',
      startLabel: '0 ₺',
      endLabel: '500 ₺',
    },
  ],
  lastCheckInPrefix: 'Laatste check-in:',
  currentPrefix: 'Huidig:',
  expectedPrefix: 'Verwacht volgens planning:',
  paceAheadLabel: 'voor op planning',
  paceBehindLabel: 'achter op planning',
};

const performanceManagementIt: PerformanceManagementLabels = {
  sectionTitle: 'Gestione delle Performance',
  kpiStats: [
    { value: '5', label: 'KPI Attivi' },
    { value: '29%', label: 'Progresso Medio' },
    { value: '3', label: 'A Rischio / Sotto le Aspettative' },
    { value: '3', label: 'Check-in in Sospeso' },
  ],
  goalsCard: { title: 'Obiettivi (OKR) / KPI', subtitle: 'Stato di avanzamento degli obiettivi aziendali, di team e individuali' },
  goals: [
    { name: 'Aumentare il fatturato annuale del 20%', scope: 'Azienda', category: 'Obiettivi Finanziari', status: 'A Rischio' },
    { name: 'Espandersi in nuovi mercati', scope: 'Team', category: 'Sales', status: 'In Linea' },
    { name: 'Lanciare l’esperienza mobile di nuova generazione', scope: 'Azienda', category: 'Sviluppo Prodotto', status: 'In Linea' },
    { name: 'Aumentare la notorietà del marchio', scope: 'Team', category: 'Marketing', status: 'Sotto le Aspettative' },
  ],
  period: '2026 H2',
  keyResultUnitLabel: 'risultati chiave',
  keyResultsCard: { title: 'Risultati Chiave', subtitleTemplate: 'Dettagli di avanzamento per “{goal}”' },
  keyResults: [
    {
      name: 'Acquisizione nuovi clienti',
      lastCheckInLabel: '20 ago',
      status: 'In Linea',
      currentValueLabel: '26 clienti',
      startLabel: '0 clienti',
      endLabel: '40 clienti',
    },
    {
      name: 'Valore medio ordine',
      lastCheckInLabel: '18 ago',
      status: 'A Rischio',
      currentValueLabel: '155 ₺',
      startLabel: '0 ₺',
      endLabel: '500 ₺',
    },
  ],
  lastCheckInPrefix: 'Ultimo check-in:',
  currentPrefix: 'Attuale:',
  expectedPrefix: 'Atteso secondo pianificazione:',
  paceAheadLabel: 'in anticipo sul piano',
  paceBehindLabel: 'in ritardo sul piano',
};

const performanceManagementAz: PerformanceManagementLabels = {
  sectionTitle: 'Performans İdarəçiliyi',
  kpiStats: [
    { value: '5', label: 'Aktiv KPI' },
    { value: '%29', label: 'Orta İrəliləyiş' },
    { value: '3', label: 'Riskli / Gözlənilənin Altında' },
    { value: '3', label: 'Gözləyən Yoxlama' },
  ],
  goalsCard: { title: 'Hədəflər (OKR) / KPI', subtitle: 'Şirkət, komanda və fərdi hədəflərin irəliləyiş vəziyyəti' },
  goals: [
    { name: 'İllik dövriyyəni 20% artırmaq', scope: 'Şirkət', category: 'Maliyyə Hədəfləri', status: 'Riskli' },
    { name: 'Yeni bazarlara çıxmaq', scope: 'Komanda', category: 'Sales', status: 'Planla Uyğun' },
    { name: 'Yeni nəsil mobil təcrübəni həyata keçirmək', scope: 'Şirkət', category: 'Məhsul İnkişafı', status: 'Planla Uyğun' },
    { name: 'Marka tanınırlığını artırmaq', scope: 'Komanda', category: 'Marketing', status: 'Gözlənilənin Altında' },
  ],
  period: '2026 H2',
  keyResultUnitLabel: 'əsas nəticə',
  keyResultsCard: { title: 'Əsas Nəticələr', subtitleTemplate: '“{goal}” hədəfinin irəliləyiş detalları' },
  keyResults: [
    {
      name: 'Yeni müştəri qazanılması',
      lastCheckInLabel: '20 avq',
      status: 'Planla Uyğun',
      currentValueLabel: '26 müştəri',
      startLabel: '0 müştəri',
      endLabel: '40 müştəri',
    },
    {
      name: 'Orta sifariş məbləği',
      lastCheckInLabel: '18 avq',
      status: 'Riskli',
      currentValueLabel: '155 ₺',
      startLabel: '0 ₺',
      endLabel: '500 ₺',
    },
  ],
  lastCheckInPrefix: 'Son yoxlama:',
  currentPrefix: 'Cari:',
  expectedPrefix: 'Cədvələ görə gözlənilən',
  paceAheadLabel: 'planın qabağında',
  paceBehindLabel: 'planın arxasında',
};

const PERFORMANCE_MANAGEMENT_LABELS: Partial<Record<Locale, PerformanceManagementLabels>> = {
  tr: performanceManagementTr,
  en: performanceManagementEn,
  nl: performanceManagementNl,
  it: performanceManagementIt,
  az: performanceManagementAz,
};

export function getPerformanceManagementLabels(locale: Locale): PerformanceManagementLabels {
  return PERFORMANCE_MANAGEMENT_LABELS[locale] ?? performanceManagementTr;
}

// --- "Veri Analizi" sekmesi — Tier 2 çevirileri (2026-09-01) ---

export interface DataAnalysisLabels {
  /** Tier 1'in `labels.veriAnalizi`siyle AYNI (`HumanResourcesLabels.sectionTitle`
   * emsalinin aynısı) — ikinci bir kopya yerine burada da elle tutuluyor. */
  sectionTitle: string;
  recalculateButtonLabel: string;
  dateRangeCard: { title: string; subtitle: string };
  departmentAbsenteeismCard: { title: string; subtitle: string };
  /** `DEPARTMENT_ABSENTEEISM_STRUCTURE` yapısal diziyle İNDEKS SIRASIYLA eşleşir. */
  departments: [string, string, string, string, string, string];
  absenteeismTrendCard: { title: string; subtitle: string };
  activeEmployeeTrendCard: { title: string; subtitle: string; weeklyBadge: string; monthlyBadge: string };
  /** `DAILY_MOVEMENTS_STRUCTURE` yapısal diziyle İNDEKS SIRASIYLA eşleşir. */
  dailyMovements: [string, string, string, string];
  newArrivalsCard: { title: string; subtitle: string };
  lateArrivalsCard: { title: string; subtitle: string };
}

const dataAnalysisTr: DataAnalysisLabels = {
  sectionTitle: 'Veri Analizi',
  recalculateButtonLabel: 'Verileri Hesapla',
  dateRangeCard: { title: 'Tarih Aralığı', subtitle: 'Analiz edilecek dönemi seçin' },
  departmentAbsenteeismCard: { title: 'Departman Bazlı Devamsızlık Oranı', subtitle: 'Seçili dönem' },
  departments: ['İK', 'Satış', 'Operasyon', 'Finans', 'Üretim', 'Destek'],
  absenteeismTrendCard: { title: 'Aylık Devamsızlık Trendi', subtitle: 'Son 6 ay, %' },
  activeEmployeeTrendCard: { title: 'Aktif Çalışan Sayısı Trendi', subtitle: 'Son 7 hafta', weeklyBadge: 'Haftalık', monthlyBadge: 'Aylık' },
  dailyMovements: ['Gelenler', 'Geç Gelenler', 'Erken Çıkanlar', 'Devamsızlık'],
  newArrivalsCard: { title: 'Çalışan Gelenler Sayısı', subtitle: '12–18 Ağustos 2026' },
  lateArrivalsCard: { title: 'Çalışan Geç Gelenler Sayısı', subtitle: '12–18 Ağustos 2026' },
};

const dataAnalysisEn: DataAnalysisLabels = {
  sectionTitle: 'Data Analysis',
  recalculateButtonLabel: 'Calculate Data',
  dateRangeCard: { title: 'Date Range', subtitle: 'Select the period to analyze' },
  departmentAbsenteeismCard: { title: 'Absenteeism Rate by Department', subtitle: 'Selected period' },
  departments: ['HR', 'Sales', 'Operations', 'Finance', 'Production', 'Support'],
  absenteeismTrendCard: { title: 'Monthly Absenteeism Trend', subtitle: 'Last 6 months, %' },
  activeEmployeeTrendCard: { title: 'Active Employee Count Trend', subtitle: 'Last 7 weeks', weeklyBadge: 'Weekly', monthlyBadge: 'Monthly' },
  dailyMovements: ['Arrivals', 'Late Arrivals', 'Early Departures', 'Absenteeism'],
  newArrivalsCard: { title: 'Employee Arrivals Count', subtitle: 'August 12–18, 2026' },
  lateArrivalsCard: { title: 'Employee Late Arrivals Count', subtitle: 'August 12–18, 2026' },
};

const dataAnalysisNl: DataAnalysisLabels = {
  sectionTitle: 'Data-analyse',
  recalculateButtonLabel: 'Gegevens Berekenen',
  dateRangeCard: { title: 'Datumbereik', subtitle: 'Selecteer de te analyseren periode' },
  departmentAbsenteeismCard: { title: 'Verzuimpercentage per Afdeling', subtitle: 'Geselecteerde periode' },
  departments: ['HR', 'Verkoop', 'Operaties', 'Financiën', 'Productie', 'Ondersteuning'],
  absenteeismTrendCard: { title: 'Maandelijkse Verzuimtrend', subtitle: 'Laatste 6 maanden, %' },
  activeEmployeeTrendCard: {
    title: 'Trend Aantal Actieve Medewerkers',
    subtitle: 'Laatste 7 weken',
    weeklyBadge: 'Wekelijks',
    monthlyBadge: 'Maandelijks',
  },
  dailyMovements: ['Aankomsten', 'Te Laat', 'Vroeg Vertrokken', 'Afwezigheid'],
  newArrivalsCard: { title: 'Aantal Medewerkersaankomsten', subtitle: '12–18 augustus 2026' },
  lateArrivalsCard: { title: 'Aantal Medewerkers Te Laat', subtitle: '12–18 augustus 2026' },
};

const dataAnalysisIt: DataAnalysisLabels = {
  sectionTitle: 'Analisi dei Dati',
  recalculateButtonLabel: 'Calcola Dati',
  dateRangeCard: { title: 'Intervallo di Date', subtitle: 'Seleziona il periodo da analizzare' },
  departmentAbsenteeismCard: { title: 'Tasso di Assenza per Reparto', subtitle: 'Periodo selezionato' },
  departments: ['HR', 'Vendite', 'Operazioni', 'Finanza', 'Produzione', 'Supporto'],
  absenteeismTrendCard: { title: 'Andamento Mensile delle Assenze', subtitle: 'Ultimi 6 mesi, %' },
  activeEmployeeTrendCard: {
    title: 'Andamento Numero Dipendenti Attivi',
    subtitle: 'Ultime 7 settimane',
    weeklyBadge: 'Settimanale',
    monthlyBadge: 'Mensile',
  },
  dailyMovements: ['Arrivi', 'Ritardi', 'Uscite Anticipate', 'Assenza'],
  newArrivalsCard: { title: 'Numero di Arrivi Dipendenti', subtitle: '12–18 agosto 2026' },
  lateArrivalsCard: { title: 'Numero di Ritardi Dipendenti', subtitle: '12–18 agosto 2026' },
};

const dataAnalysisAz: DataAnalysisLabels = {
  sectionTitle: 'Məlumat Analizi',
  recalculateButtonLabel: 'Məlumatları Hesabla',
  dateRangeCard: { title: 'Tarix Aralığı', subtitle: 'Analiz ediləcək dövrü seçin' },
  departmentAbsenteeismCard: { title: 'Departament üzrə Davamsızlıq Nisbəti', subtitle: 'Seçilmiş dövr' },
  departments: ['İK', 'Satış', 'Əməliyyat', 'Maliyyə', 'İstehsal', 'Dəstək'],
  absenteeismTrendCard: { title: 'Aylıq Davamsızlıq Trendi', subtitle: 'Son 6 ay, %' },
  activeEmployeeTrendCard: {
    title: 'Aktiv İşçi Sayı Trendi',
    subtitle: 'Son 7 həftə',
    weeklyBadge: 'Həftəlik',
    monthlyBadge: 'Aylıq',
  },
  dailyMovements: ['Gəlişlər', 'Gecikmələr', 'Erkən Çıxışlar', 'Davamsızlıq'],
  newArrivalsCard: { title: 'İşçi Gəlişləri Sayı', subtitle: '12–18 avqust 2026' },
  lateArrivalsCard: { title: 'İşçi Gecikmələri Sayı', subtitle: '12–18 avqust 2026' },
};

const DATA_ANALYSIS_LABELS: Partial<Record<Locale, DataAnalysisLabels>> = {
  tr: dataAnalysisTr,
  en: dataAnalysisEn,
  nl: dataAnalysisNl,
  it: dataAnalysisIt,
  az: dataAnalysisAz,
};

export function getDataAnalysisLabels(locale: Locale): DataAnalysisLabels {
  return DATA_ANALYSIS_LABELS[locale] ?? dataAnalysisTr;
}

// --- Paylaşılan üst header panelleri — Tier 2 çevirileri (2026-09-01).
// Panel BAŞLIKLARI (`labels.shortcuts.title` vb.) zaten Tier 1'de
// çevrilmişti (`productPreviewWidgetLabels.ts`) — burada yalnızca panel
// İÇERİĞİ (kısayol etiketleri, bekleyen görev metinleri, "Bugünün
// Özeti" satırları, dil seçici listesi) çevriliyor. ---

export interface SharedPanelLabels {
  /** `HEADER_SHORTCUTS` yapısal diziyle İNDEKS SIRASIYLA eşleşir. */
  shortcuts: [string, string, string, string, string, string];
  /** `PENDING_TASKS` yapısal diziyle İNDEKS SIRASIYLA eşleşir. */
  pendingTasks: [string, string, string];
  /** `TODAY_SUMMARY` yapısal diziyle İNDEKS SIRASIYLA eşleşir (yalnızca
   * `label` alanları — `value` alanları çoğunlukla sayısal/evrensel). */
  todaySummaryLabels: [string, string, string];
  /** `TODAY_SUMMARY[1]`ın ("Ortalama Çalışma Süresi") saat+dakika
   * birimli değeri — tam biçimlendirilmiş tek metin (sayı sabit "7"/"42",
   * yalnızca birim kısaltması dile göre değişiyor). */
  avgWorkTimeValue: string;
  /** `LANGUAGE_LIST` yapısal diziyle İNDEKS SIRASIYLA eşleşir (TR/GB/DE/
   * ES/PT/IT/FR/NL/SA/RU/AZ bayrak kodu sırası) — dekoratif dil seçici
   * panelinin 11 dil adı. */
  languageNames: [string, string, string, string, string, string, string, string, string, string, string];
}

const sharedPanelTr: SharedPanelLabels = {
  shortcuts: ['Çalışan Oluştur', 'İzin Oluştur', 'Rapor Oluştur', 'Mesaj Gönder', 'Günlük Puantaj', 'Vardiya Takvimi'],
  pendingTasks: ['3 izin talebi onayını bekliyor', '1 rapor incelemeni bekliyor', 'Q3 performans değerlendirmesi tamamlanmadı'],
  todaySummaryLabels: ['Bugün Giriş Yapan', 'Ortalama Çalışma Süresi', 'Açık Talepler'],
  avgWorkTimeValue: '7s 42dk',
  languageNames: ['Türkçe', 'İngilizce', 'Almanca', 'İspanyolca', 'Portekizce', 'İtalyanca', 'Fransızca', 'Flemenkçe', 'Arapça', 'Rusça', 'Azerbaycanca'],
};

const sharedPanelEn: SharedPanelLabels = {
  shortcuts: ['Create Employee', 'Create Leave', 'Create Report', 'Send Message', 'Daily Timesheet', 'Shift Calendar'],
  pendingTasks: ['3 leave requests awaiting approval', '1 report awaiting your review', 'Q3 performance review not completed'],
  todaySummaryLabels: ['Checked In Today', 'Average Work Time', 'Open Requests'],
  avgWorkTimeValue: '7h 42m',
  languageNames: ['Turkish', 'English', 'German', 'Spanish', 'Portuguese', 'Italian', 'French', 'Dutch', 'Arabic', 'Russian', 'Azerbaijani'],
};

const sharedPanelNl: SharedPanelLabels = {
  shortcuts: ['Medewerker Aanmaken', 'Verlof Aanmaken', 'Rapport Aanmaken', 'Bericht Versturen', 'Dagelijkse Urenregistratie', 'Ploegenrooster'],
  pendingTasks: ['3 verlofaanvragen wachten op goedkeuring', '1 rapport wacht op je beoordeling', 'Q3-prestatiebeoordeling niet voltooid'],
  todaySummaryLabels: ['Vandaag Ingecheckt', 'Gemiddelde Werktijd', 'Openstaande Aanvragen'],
  avgWorkTimeValue: '7u 42m',
  languageNames: ['Turks', 'Engels', 'Duits', 'Spaans', 'Portugees', 'Italiaans', 'Frans', 'Nederlands', 'Arabisch', 'Russisch', 'Azerbeidzjaans'],
};

const sharedPanelIt: SharedPanelLabels = {
  shortcuts: ['Crea Dipendente', 'Crea Ferie', 'Crea Report', 'Invia Messaggio', 'Presenze Giornaliere', 'Calendario Turni'],
  pendingTasks: [
    '3 richieste di ferie in attesa di approvazione',
    '1 report in attesa della tua revisione',
    'Valutazione delle performance del Q3 non completata',
  ],
  todaySummaryLabels: ['Presenti Oggi', 'Tempo di Lavoro Medio', 'Richieste Aperte'],
  avgWorkTimeValue: '7h 42min',
  languageNames: ['Turco', 'Inglese', 'Tedesco', 'Spagnolo', 'Portoghese', 'Italiano', 'Francese', 'Olandese', 'Arabo', 'Russo', 'Azero'],
};

const sharedPanelAz: SharedPanelLabels = {
  shortcuts: ['İşçi Yarat', 'İcazə Yarat', 'Hesabat Yarat', 'Mesaj Göndər', 'Gündəlik Vaxt Cədvəli', 'Növbə Təqvimi'],
  pendingTasks: ['3 icazə tələbi təsdiq gözləyir', '1 hesabat baxışınızı gözləyir', 'Q3 performans qiymətləndirməsi tamamlanmayıb'],
  todaySummaryLabels: ['Bu gün Giriş Edən', 'Orta İş Müddəti', 'Açıq Tələblər'],
  avgWorkTimeValue: '7 saat 42 dəq',
  languageNames: ['Türk', 'İngilis', 'Alman', 'İspan', 'Portuqal', 'İtalyan', 'Fransız', 'Holland', 'Ərəb', 'Rus', 'Azərbaycan'],
};

const SHARED_PANEL_LABELS: Partial<Record<Locale, SharedPanelLabels>> = {
  tr: sharedPanelTr,
  en: sharedPanelEn,
  nl: sharedPanelNl,
  it: sharedPanelIt,
  az: sharedPanelAz,
};

export function getSharedPanelLabels(locale: Locale): SharedPanelLabels {
  return SHARED_PANEL_LABELS[locale] ?? sharedPanelTr;
}
