// Hesaplama Araçları — 8 aracın form alanları + hesaplama FORMÜLLERİ.
// Kaynak: idenfit.com/hesaplama-araclari/ (yalnızca TR, bkz.
// `scripts/extract-calculators.mjs` + CLAUDE.md KARAR 2 — EN/IT bu turda
// kasıtlı olarak ERTELENDİ). Metinler (başlık/ikon/not) `calculators.json`'dan
// (`getCalculatorsContent()` ile) geliyor; form ALANLARI ve hesaplama
// MANTIĞI ise buraya elle, kaynağın jQuery/DOM'a bağımlı `<script>`
// bloklarını tek tek inceleyip TypeScript'e çevirerek taşındı — ham JS hiç
// import/eval edilmiyor (projedeki CTA/slug çözümleme mantığıyla aynı ilke).
//
// Doğrulanmış kaynak formülleri (idenfit.com'un canlı JS'inden, 2026-07-23
// itibarıyla) — her `calculate()` fonksiyonunun üstünde kaynağa referans var.
//
// BİLİNÇLİ UX FARKLARI (kaynağa göre, davranışı bozmayan iyileştirmeler):
// - Tarih alanları kaynakta serbest metin + DD/MM/YYYY maskeleme iken,
//   burada native `<input type="date">` kullanılıyor (tarayıcı takvimi,
//   daha güvenilir parse — hesaplama SONUCU aynı, yalnızca giriş UX'i).
// - Para/yüzde alanlarında kaynaktaki "girdiğin rakam kutunun İÇİNE
//   otomatik ' TL'/' %' eklenir" davranışı yerine, birim küçük bir etiket
//   olarak alanın yanında gösteriliyor (React controlled input'ta imleç
//   sıçramasını önlemek için — hesaplama sonucunu etkilemez).
//
// KAYNAK VERİ NOTLARI (düzeltilmedi, olduğu gibi taşındı):
// - Gelir Vergisi hesaplayıcısının "Ücret dışı gelirler" seçeneği kaynakta
//   BOŞ bir vergi dilimi tablosuna sahip (`non_salary_income: []`) — seçilirse
//   sonuç her zaman 0 çıkar. Bu kaynağın kendi eksikliği, biz vergi dilimi
//   uydurmadık.
// - Kurumlar Vergisi'nin yıl seçimi kaynakta 2006-2025 arası (2026 seçeneği
//   YOK) — aynen taşındı, 2026 oranı icat edilmedi.
// - İşveren Maliyeti'nde "Asgari Ücretli" ve "Diğer Ücretli" seçenekleri
//   SGK/işsizlik oranı açısından aynı şekilde hesaplanıyor (yalnızca
//   "Emekli" farklı) — kaynağın kendi mantığı, aynen taşındı.
// - Yemek Ücreti, İşveren Maliyeti, Gelir Vergisi, İhbar Süresi, Kıdem
//   Tazminatı hesaplayıcıları hardcoded YIL-BAĞIMLI sabitler kullanıyor
//   (asgari ücret, vergi dilimleri, SGK oranları, kıdem tavanı) — kaynak
//   site de bunları canlı bir API'den çekmiyor, elle güncelliyor. Bu
//   sabitler `YEAR_CONSTANTS` altında TEK YERDE toplandı ki yıl değişince
//   (ör. 2027 başında) tek dosyadan güncellensin.

export type CalculatorFieldType = 'radio' | 'select' | 'currency' | 'percent' | 'plain-number' | 'date';

export interface CalculatorFieldOption {
  value: string;
  label: string;
}

export interface CalculatorField {
  id: string;
  type: CalculatorFieldType;
  label: string;
  placeholder?: string;
  options?: CalculatorFieldOption[];
  defaultValue?: string;
  /** Verilmezse alan her zaman görünür. */
  visibleWhen?: (values: Record<string, string>) => boolean;
  halfWidth?: boolean;
  /** true ise boş bırakılabilir (ör. İhbar Süresi'nin K.G.V.M'si — boşsa
   * hesaplama fonksiyonu 0 kabul edip en düşük vergi dilimini uygular,
   * kaynaktaki notla tutarlı). Verilmezse alan zorunludur. */
  optional?: boolean;
}

export interface CalculatorResultRow {
  label: string;
  value: number;
  unit: 'currency' | 'percent' | 'days' | 'plain';
}

export interface CalculatorDefinition {
  slug: string;
  title: string;
  icon: string;
  note: string | null;
  fields: CalculatorField[];
  calculate: (values: Record<string, string>) => CalculatorResultRow[] | { error: string };
}

// ============================== Ortak yardımcılar ==============================

function num(values: Record<string, string>, id: string): number {
  const raw = (values[id] ?? '').replace(/[^\d]/g, '');
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? 0 : n;
}

/** `<input type="date">`'in ISO (YYYY-MM-DD) değerini gün farkına çevirir
 * (kaynağın `diffDaysTR()`'ünün native-date-input karşılığı). */
function diffDaysInclusive(startIso: string, endIso: string): number | null {
  if (!startIso || !endIso) return null;
  const start = new Date(startIso + 'T00:00:00Z').getTime();
  const end = new Date(endIso + 'T00:00:00Z').getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((end - start) / msPerDay) + 1;
}

// 2026 için geçerli, kaynak sitenin kendi JS'inde hardcoded yer alan
// yıl-bağımlı sabitler — TEK YERDE toplandı, yıl değişince buradan
// güncellenir (kaynak site de canlı bir API'den çekmiyor).
const YEAR_CONSTANTS = {
  minimumWageAnnualGross2026: 33030 * 12,
  incomeTaxBracketsSalary: [
    { limit: 158000, rate: 0.15 },
    { limit: 330000, rate: 0.2, fixed: 23700 },
    { limit: 800000, rate: 0.27, fixed: 58100 },
    { limit: 4300000, rate: 0.35, fixed: 293000 },
    { limit: Infinity, rate: 0.4, fixed: 1410000 },
  ],
  stampTaxRate: 0.00759,
  severanceCap2026H1: 46655.43,
  mealAllowance: {
    netToGrossConversionRate: 0.6424,
    sgkEmployerContributionRate: 0.2275,
    sgkExemptionPerDay: 158,
    taxExemptionPerDayIncludedKdv: 264,
    taxExemptionPerDayExcludedKdv: 240,
  },
  corporateTaxRatesByYear: {
    2025: 0.25, 2024: 0.25, 2023: 0.25, 2022: 0.23, 2021: 0.25,
    2020: 0.22, 2019: 0.22, 2018: 0.22, 2017: 0.2, 2016: 0.2,
    2015: 0.2, 2014: 0.2, 2013: 0.2, 2012: 0.2, 2011: 0.2,
    2010: 0.2, 2009: 0.2, 2008: 0.2, 2007: 0.2, 2006: 0.2,
  } as Record<string, number>,
};

/** Kaynağın `taxBrackets` mantığının birebir portu — Gelir Vergisi VE
 * İhbar Süresi hesaplayıcısı AYNI dilim tablosunu kullanıyor. */
function incomeTaxRateForBase(base: number): number {
  const b = YEAR_CONSTANTS.incomeTaxBracketsSalary;
  return base <= b[0].limit ? b[0].rate
    : base <= b[1].limit ? b[1].rate
    : base <= b[2].limit ? b[2].rate
    : base <= b[3].limit ? b[3].rate
    : b[4].rate;
}

// ============================== 1. Fazla Mesai Ücreti ==============================
// Kaynak: fazla_mesai formu — `calculate(brutSalary, overtimeHours, excessWorkHours, weeklyNormalHours)`.
// İş Kanunu'nun sabit oranlarına dayanıyor (1.5x/1.25x) — yıla bağlı değil.
function calculateOvertimePay(values: Record<string, string>): CalculatorResultRow[] {
  const workingHourSelection = values.workingHourSelection ?? 'standard_45';
  const brutSalary = num(values, 'monthlyGrossSalary');
  const overtimeHours = num(values, 'overtimeHours');
  const isUnder45 = workingHourSelection === 'under_45';
  const excessWorkHours = isUnder45 ? num(values, 'excessDurationHours') : 0;
  const weeklyNormalHours = isUnder45 ? num(values, 'weeklyWorkingHours') || 45 : 45;

  const dailyHours = weeklyNormalHours / 6;
  const hourlyWage = dailyHours ? brutSalary / 30 / dailyHours : 0;
  const overtimeHourlyRate = hourlyWage * 1.5;
  const excessWorkHourlyRate = hourlyWage * 1.25;
  const totalOvertimePay = overtimeHours * overtimeHourlyRate;
  const totalExcessWorkPay = excessWorkHours * excessWorkHourlyRate;

  const results: CalculatorResultRow[] = [
    { label: 'Fazla mesai saatlik ücreti (brüt)', value: overtimeHourlyRate, unit: 'currency' },
    { label: 'Fazla mesai toplam tutarı (brüt)', value: totalOvertimePay, unit: 'currency' },
    { label: 'Maaş + fazla mesai toplamı (brüt)', value: brutSalary + totalOvertimePay + totalExcessWorkPay, unit: 'currency' },
  ];
  if (isUnder45) {
    results.push(
      { label: 'Fazla sürelerle çalışma saatlik ücreti (brüt)', value: excessWorkHourlyRate, unit: 'currency' },
      { label: 'Fazla sürelerle çalışma toplam tutarı (brüt)', value: totalExcessWorkPay, unit: 'currency' },
      { label: 'Toplam fazla çalışma tutarı (brüt)', value: totalOvertimePay + totalExcessWorkPay, unit: 'currency' },
    );
  }
  return results;
}

// ============================== 2. Gelir Vergisi ==============================
// Kaynak: gelir_vergisi formu. NOT: "Ücret dışı gelirler" seçilirse kaynakta
// dilim tablosu BOŞ (`non_salary_income: []`) — sonuç her zaman 0 çıkar,
// bu kaynağın kendi eksikliği, aynen taşındı (uydurma dilim eklenmedi).
function calculateIncomeTax(values: Record<string, string>): CalculatorResultRow[] {
  const incomeType = values.incomeType ?? 'salary_income';
  const baseTax = num(values, 'baseTax');
  const applyExemption = values.minimumWageExemption === 'true';

  let netIncome = baseTax;
  if (applyExemption) {
    netIncome = Math.max(0, netIncome - YEAR_CONSTANTS.minimumWageAnnualGross2026);
  }

  let taxAmount = 0;
  let effectiveTaxRate = 0;
  if (incomeType === 'salary_income') {
    const brackets = YEAR_CONSTANTS.incomeTaxBracketsSalary;
    for (let i = 0; i < brackets.length; i++) {
      const bracket = brackets[i];
      if (netIncome <= bracket.limit) {
        effectiveTaxRate = bracket.rate * 100;
        const prevLimit = i > 0 ? brackets[i - 1].limit : 0;
        taxAmount += (i > 0 ? (bracket as { fixed?: number }).fixed ?? 0 : 0) + (netIncome - prevLimit) * bracket.rate;
        break;
      } else {
        taxAmount += (bracket as { fixed?: number }).fixed ?? 0;
      }
    }
  }
  // incomeType === 'non_salary_income' => kaynakta dilim yok, taxAmount 0 kalır.

  return [
    { label: 'Uygulanan Gelir Vergisi Oranı', value: effectiveTaxRate, unit: 'percent' },
    { label: 'Hesaplanan Gelir Vergisi Tutarı', value: taxAmount, unit: 'currency' },
    { label: 'Vergi Sonrası Net Gelir', value: baseTax - taxAmount, unit: 'currency' },
  ];
}

// ============================== 3. Yemek Ücreti ==============================
// Kaynak: yemek_ucreti formu — SGK istisnası + gelir vergisi + KDV birlikte hesaplanıyor.
function calculateMealAllowance(values: Record<string, string>): CalculatorResultRow[] {
  const c = YEAR_CONSTANTS.mealAllowance;
  const paymentType = values.paymentType;
  const dailyMealAllowance = num(values, 'dailyMealAllowance');
  const workedDayCount = num(values, 'workedDayCount');
  const paymentMethod = values.paymentMethod ?? 'net';
  let kdvStatus = values.kdvStatus ?? 'included';
  if (paymentType === 'cash_payment') kdvStatus = 'excluded';

  let dailyAllowance = dailyMealAllowance;
  let monthlyTotal: number;

  if (paymentMethod === 'net') {
    if (paymentType === 'meal_card_restaurant_only') {
      dailyAllowance = dailyAllowance / c.netToGrossConversionRate;
    } else {
      const remainingNet = dailyAllowance - c.sgkExemptionPerDay;
      dailyAllowance = remainingNet > 0 ? remainingNet / c.netToGrossConversionRate + c.sgkExemptionPerDay : c.sgkExemptionPerDay;
    }
    monthlyTotal = dailyMealAllowance * workedDayCount;
  } else {
    monthlyTotal = dailyAllowance * workedDayCount;
  }

  const monthlyGrossTotal = dailyAllowance * workedDayCount;

  let sgkExemption: number;
  let sgkBase: number;
  if (paymentType === 'meal_card_restaurant_only') {
    sgkExemption = monthlyGrossTotal;
    sgkBase = 0;
  } else {
    sgkExemption = c.sgkExemptionPerDay * workedDayCount;
    sgkBase = Math.max(0, monthlyGrossTotal - sgkExemption);
  }
  const sgkCost = sgkBase * c.sgkEmployerContributionRate;

  const taxExemptionPerDay = kdvStatus === 'included' ? c.taxExemptionPerDayIncludedKdv : c.taxExemptionPerDayExcludedKdv;
  const taxExemptionTotal = taxExemptionPerDay * workedDayCount;
  const taxBase = Math.max(0, monthlyGrossTotal - taxExemptionTotal);

  let taxAmount = 0;
  let vatAmount = 0;
  if (!(paymentMethod === 'net' && kdvStatus === 'included' && dailyMealAllowance <= taxExemptionPerDay)) {
    taxAmount = taxBase * 0.15;
    vatAmount = taxBase * 0.00759;
  }

  const totalCost = monthlyGrossTotal + sgkCost + taxAmount + vatAmount;

  return [
    { label: 'Aylık Toplam Tutar', value: monthlyTotal, unit: 'currency' },
    { label: 'SGK İstisna Tutarı', value: sgkExemption, unit: 'currency' },
    { label: 'Prime Esas Tutar', value: sgkBase, unit: 'currency' },
    { label: 'Toplam İşveren Maliyeti', value: totalCost, unit: 'currency' },
  ];
}

// ============================== 4. Maaş Zammı ==============================
function calculateSalaryRaise(values: Record<string, string>): CalculatorResultRow[] {
  const calculationType = values.calculationType ?? 'rate';
  const currentNetSalary = num(values, 'currentNetSalary');
  const increasedSalary = num(values, 'increasedSalary');
  const rateOfIncrease = num(values, 'rateOfIncrease');

  let increaseAmount: number;
  let increasedNetSalary: number;
  let increaseRate: number;

  if (calculationType === 'amount') {
    increaseRate = rateOfIncrease;
    increaseAmount = (currentNetSalary * rateOfIncrease) / 100;
    increasedNetSalary = currentNetSalary + increaseAmount;
  } else {
    increasedNetSalary = increasedSalary;
    increaseAmount = increasedNetSalary - currentNetSalary;
    increaseRate = currentNetSalary ? Number(((increaseAmount / currentNetSalary) * 100).toFixed(2)) : 0;
  }

  return [
    { label: 'Zam oranı', value: increaseRate, unit: 'percent' },
    { label: 'Zam tutarı', value: increaseAmount, unit: 'currency' },
    { label: 'Zam sonrası net maaş', value: increasedNetSalary, unit: 'currency' },
  ];
}

// ============================== 5. İhbar Süresi ve Tazminatı ==============================
// Kaynak: ihbar_tazminati formu — İş Kanunu m.17'nin sabit gün dilimleri
// (14/28/42/56) yıla bağlı değil; gelir vergisi oranı için AYNI dilim
// tablosu kullanılıyor (K.G.V.M boş bırakılırsa 0 → %15 dilimine düşer,
// kaynaktaki notla tutarlı).
function calculateNoticePeriod(values: Record<string, string>): CalculatorResultRow[] | { error: string } {
  const workDaysRaw = diffDaysInclusive(values.beginDate, values.endDate);
  if (workDaysRaw === null) return { error: 'Geçerli bir işe giriş / işten çıkış tarihi girin (çıkış, girişten sonra olmalı).' };

  const grossSalary = num(values, 'grossSalary');
  const kgvm = num(values, 'kgvm');

  const noticePeriod = workDaysRaw < 180 ? 14 : workDaysRaw < 540 ? 28 : workDaysRaw < 1080 ? 42 : 56;
  const grossNoticeCompensation = (grossSalary / 30) * noticePeriod;
  const incomeTaxRate = incomeTaxRateForBase(kgvm);
  const incomeTax = grossNoticeCompensation * incomeTaxRate;
  const stampTax = grossNoticeCompensation * YEAR_CONSTANTS.stampTaxRate;
  const netNoticeCompensation = grossNoticeCompensation - incomeTax - stampTax;

  return [
    { label: 'İhbar Süresi', value: noticePeriod, unit: 'days' },
    { label: 'Çalışılan Gün Sayısı', value: workDaysRaw, unit: 'days' },
    { label: 'Net İhbar Tazminatı', value: netNoticeCompensation, unit: 'currency' },
    { label: 'Brüt İhbar Tazminatı', value: grossNoticeCompensation, unit: 'currency' },
    { label: 'Gelir Vergisi Kesintisi', value: incomeTax, unit: 'currency' },
    { label: 'Damga Vergisi', value: stampTax, unit: 'currency' },
  ];
}

// ============================== 6. İşveren Maliyeti ==============================
function calculateEmployerCost(values: Record<string, string>): CalculatorResultRow[] {
  const employeeType = values.employeeType;
  const grossSalary = num(values, 'grossSalary');
  const applyIncentive = values.incentive === 'true';

  const socialSecurityRate = employeeType === 'retired' ? 0.2475 : 0.2075;
  const unemploymentInsuranceRate = employeeType === 'retired' ? 0 : 0.02;

  const socialSecurity = grossSalary * socialSecurityRate;
  const unemploymentInsurance = grossSalary * unemploymentInsuranceRate;
  const totalCost = grossSalary + socialSecurity + unemploymentInsurance;
  const incentive = applyIncentive && employeeType !== 'retired' ? grossSalary * 0.04 : 0;
  const incentivizedCost = totalCost - incentive;
  const employerCost = applyIncentive ? incentivizedCost : totalCost;
  const difference = employerCost - grossSalary;

  return [
    { label: `Toplam İşveren Maliyeti (${applyIncentive ? 'Teşvikli' : 'Teşviksiz'})`, value: employerCost, unit: 'currency' },
    { label: 'Maliyet Farkı', value: difference, unit: 'currency' },
    { label: 'Teşvik Tutarı', value: incentive, unit: 'currency' },
  ];
}

// ============================== 7. Kurumlar Vergisi ==============================
// Kaynak seçim listesi 2006-2025 arası (2026 seçeneği YOK) — aynen taşındı.
function calculateCorporateTax(values: Record<string, string>): CalculatorResultRow[] | { error: string } {
  const taxPeriod = values.taxPeriod;
  const taxRate = YEAR_CONSTANTS.corporateTaxRatesByYear[taxPeriod];
  if (taxRate === undefined) return { error: 'Lütfen bir vergi dönemi seçin.' };

  const baseTaxAmount = num(values, 'baseTaxAmount');
  const taxAmount = baseTaxAmount * taxRate;

  return [
    { label: 'Kurumlar Vergisi Oranı', value: taxRate * 100, unit: 'percent' },
    { label: 'Vergi Matrahı', value: baseTaxAmount, unit: 'currency' },
    { label: 'Kurumlar Vergisi Tutarı', value: taxAmount, unit: 'currency' },
  ];
}

// ============================== 8. Kıdem Tazminatı ==============================
function calculateSeverancePay(values: Record<string, string>): CalculatorResultRow[] | { error: string } {
  const totalWorkDays = diffDaysInclusive(values.beginDate, values.endDate);
  if (totalWorkDays === null) return { error: 'Geçerli bir işe giriş / işten çıkış tarihi girin (çıkış, girişten sonra olmalı).' };

  const grossSalary = num(values, 'grossSalary');
  const severanceCap = YEAR_CONSTANTS.severanceCap2026H1;
  const baseSalary = Math.min(grossSalary, severanceCap);
  const dailySalary = grossSalary / 30;

  const totalWorkYears = Math.floor(totalWorkDays / 365);
  const remainingDaysInYear = totalWorkDays % 365;
  const remainingMonths = Math.floor(remainingDaysInYear / 30);
  const remainingDays = remainingDaysInYear % 30;

  let grossSeverance = baseSalary * totalWorkYears;
  grossSeverance += (baseSalary * remainingMonths) / 12;
  grossSeverance += (baseSalary * remainingDays) / 365;

  const stampTax = grossSeverance * YEAR_CONSTANTS.stampTaxRate;
  const netSeverance = grossSeverance - stampTax;

  return [
    { label: 'Günlük Brüt Ücret', value: dailySalary, unit: 'currency' },
    { label: 'Brüt Kıdem Tazminatı', value: grossSeverance, unit: 'currency' },
    { label: 'Net Kıdem Tazminatı', value: netSeverance, unit: 'currency' },
    { label: 'Hesaplamaya Esas Gün Sayısı', value: totalWorkDays, unit: 'days' },
    { label: 'Kıdem Tazminatına Esas Ücret', value: baseSalary, unit: 'currency' },
    { label: 'Damga Vergisi', value: stampTax, unit: 'currency' },
  ];
}

// ============================== Tanımlar ==============================
// Anchor slug'ları KEŞFET mega-menüsündeki mevcut i18n anahtarlarıyla
// (mega.kesfet.overtimePay vb.) eşleşecek şekilde İngilizce/kebab-case
// seçildi — Donanım sayfasındaki `#rfid` gibi anchor deseniyle tutarlı.
export const CALCULATOR_DEFINITIONS: CalculatorDefinition[] = [
  {
    slug: 'fazla-mesai',
    title: 'Fazla Mesai Ücreti Hesaplama',
    icon: '/wp-content/uploads/2025/12/accordion-fazla-mesai.svg',
    note: 'Haftalık çalışma süresi 45 saati aştığında, aşan kısım fazla mesai kapsamında değerlendirilir.',
    fields: [
      {
        id: 'workingHourSelection',
        type: 'radio',
        label: 'Haftalık çalışma süresi',
        options: [
          { value: 'standard_45', label: '45 saat' },
          { value: 'under_45', label: '45 saatin altında' },
        ],
        defaultValue: 'standard_45',
      },
      { id: 'monthlyGrossSalary', type: 'currency', label: 'Aylık brüt maaş tutarı', halfWidth: true },
      { id: 'overtimeHours', type: 'plain-number', label: 'Fazla mesai toplamı (saat)', halfWidth: true },
      {
        id: 'weeklyWorkingHours',
        type: 'plain-number',
        label: 'Haftalık çalışma saati',
        halfWidth: true,
        visibleWhen: (v) => v.workingHourSelection === 'under_45',
      },
      {
        id: 'excessDurationHours',
        type: 'plain-number',
        label: 'Fazla sürelerle çalışma saati',
        halfWidth: true,
        visibleWhen: (v) => v.workingHourSelection === 'under_45',
      },
    ],
    calculate: calculateOvertimePay,
  },
  {
    slug: 'gelir-vergisi',
    title: 'Gelir Vergisi Hesaplama',
    icon: '/wp-content/uploads/2025/12/accordion-gelir-vergisi.svg',
    note: null,
    fields: [
      {
        id: 'incomeType',
        type: 'radio',
        label: 'Gelir türünü seçin',
        options: [
          { value: 'salary_income', label: 'Ücret geliri' },
          { value: 'non_salary_income', label: 'Ücret dışı gelirler' },
        ],
        defaultValue: 'salary_income',
      },
      { id: 'baseTax', type: 'currency', label: 'Vergi matrahı' },
      {
        id: 'minimumWageExemption',
        type: 'radio',
        label: 'Asgari ücret istisnası uygula',
        options: [
          { value: 'true', label: 'Evet' },
          { value: 'false', label: 'Hayır' },
        ],
        defaultValue: 'false',
      },
    ],
    calculate: calculateIncomeTax,
  },
  {
    slug: 'yemek-ucreti',
    title: 'Yemek Ücreti Hesaplama',
    icon: '/wp-content/uploads/2025/12/accordion-yemek-ucreti.svg',
    note: 'Hesaplama, %15 gelir vergisi dilimi esas alınarak yapılır.',
    fields: [
      {
        id: 'paymentType',
        type: 'select',
        label: 'Ödeme türü seçin',
        options: [
          { value: 'cash_payment', label: 'Nakit Ödeme' },
          { value: 'meal_card_restaurant_only', label: 'Yemek Kartı (Sadece restoran)' },
          { value: 'meal_card_restaurant_and_grocery', label: 'Yemek Kartı (Marketlerde de geçerli)' },
        ],
      },
      { id: 'dailyMealAllowance', type: 'currency', label: 'Günlük yemek ücreti', halfWidth: true },
      { id: 'workedDayCount', type: 'plain-number', label: 'Çalışılan gün sayısı', halfWidth: true },
      {
        id: 'paymentMethod',
        type: 'radio',
        label: 'Ödeme şekli',
        options: [
          { value: 'net', label: 'Net' },
          { value: 'gross', label: 'Brüt' },
        ],
        defaultValue: 'net',
        halfWidth: true,
      },
      {
        id: 'kdvStatus',
        type: 'radio',
        label: 'KDV durumu',
        options: [
          { value: 'included', label: 'Dahil' },
          { value: 'excluded', label: 'Hariç' },
        ],
        defaultValue: 'included',
        halfWidth: true,
        visibleWhen: (v) => v.paymentType !== 'cash_payment',
      },
    ],
    calculate: calculateMealAllowance,
  },
  {
    slug: 'maas-zammi',
    title: 'Maaş Zammı Hesaplama',
    icon: '/wp-content/uploads/2025/12/accordion-maas-zammi.svg',
    note: 'Maaş zammı, belirli bir dönem sonunda çalışanın ücretinde yapılan artıştır.',
    fields: [
      {
        id: 'calculationType',
        type: 'radio',
        label: 'Hesaplama türünü seçin',
        options: [
          { value: 'rate', label: 'Zam Yüzdesi Hesapla' },
          { value: 'amount', label: 'Zam Tutarı Hesapla' },
        ],
        defaultValue: 'rate',
      },
      { id: 'currentNetSalary', type: 'currency', label: 'Mevcut net maaş', halfWidth: true },
      {
        id: 'rateOfIncrease',
        type: 'percent',
        label: 'Zam oranı (%)',
        halfWidth: true,
        visibleWhen: (v) => v.calculationType === 'amount',
      },
      {
        id: 'increasedSalary',
        type: 'currency',
        label: 'Zam sonrası net maaş',
        halfWidth: true,
        visibleWhen: (v) => (v.calculationType ?? 'rate') === 'rate',
      },
    ],
    calculate: calculateSalaryRaise,
  },
  {
    slug: 'ihbar-suresi',
    title: 'İhbar Süresi ve Tazminatı Hesaplama',
    icon: '/wp-content/uploads/2025/12/accordion-ihbar-suresi.svg',
    note: 'Kümülatif gelir vergisi matrahını bilmiyorsanız alanı boş bırakabilirsiniz. Boş bırakıldığında hesaplama %15 vergi dilimine göre yapılır.',
    fields: [
      { id: 'beginDate', type: 'date', label: 'İşe giriş tarihini girin', halfWidth: true },
      { id: 'endDate', type: 'date', label: 'İşten çıkış tarihini girin', halfWidth: true },
      { id: 'grossSalary', type: 'currency', label: 'Aylık brüt maaş tutarı', halfWidth: true },
      { id: 'kgvm', type: 'currency', label: 'K.G.V.M (opsiyonel)', halfWidth: true, optional: true },
    ],
    calculate: calculateNoticePeriod,
  },
  {
    slug: 'isveren-maliyeti',
    title: 'İşveren Maliyeti Hesaplama',
    icon: '/wp-content/uploads/2025/12/accordion-isveren-maliyeti.svg',
    note: 'Hesaplama, çalışana ödenen brüt ücret esas alınarak yapılır. Yol, yemek gibi yan haklar ve diğer ek kalemler dahil edilmez.',
    fields: [
      {
        id: 'employeeType',
        type: 'select',
        label: 'Çalışan türü seçin',
        options: [
          { value: 'minimum_wage_employee', label: 'Asgari Ücretli' },
          { value: 'other_employee', label: 'Diğer Ücretli' },
          { value: 'retired', label: 'Emekli' },
        ],
      },
      { id: 'grossSalary', type: 'currency', label: 'Aylık brüt maaş tutarı' },
      {
        id: 'incentive',
        type: 'radio',
        label: 'Teşvik (Hazine desteği %4)',
        options: [
          { value: 'true', label: 'Evet' },
          { value: 'false', label: 'Hayır' },
        ],
        defaultValue: 'false',
      },
    ],
    calculate: calculateEmployerCost,
  },
  {
    slug: 'kurumlar-vergisi',
    title: 'Kurumlar Vergisi Hesaplama',
    icon: '/wp-content/uploads/2025/12/accordion-kurumlar-vergisi.svg',
    note: 'Kurumlar vergisi, bir hesap dönemi boyunca elde edilen kurum kazancı (safi kazanç) üzerinden hesaplanır.',
    fields: [
      {
        id: 'taxPeriod',
        type: 'select',
        label: 'Vergi dönemi seçin',
        options: Object.keys(YEAR_CONSTANTS.corporateTaxRatesByYear)
          .sort((a, b) => Number(b) - Number(a))
          .map((y) => ({ value: y, label: y })),
      },
      { id: 'baseTaxAmount', type: 'currency', label: 'Vergi matrahı' },
    ],
    calculate: calculateCorporateTax,
  },
  {
    slug: 'kidem-tazminati',
    title: 'Kıdem Tazminatı Hesaplama',
    icon: '/wp-content/uploads/2025/12/accordion-kidem-tazminati.svg',
    note: 'Kıdem tazminatı, iş ilişkisi sona erdiğinde mevzuatta belirtilen şartları sağlayan çalışanlara işveren tarafından ödenen tazminattır.',
    fields: [
      { id: 'beginDate', type: 'date', label: 'İşe giriş tarihini girin', halfWidth: true },
      { id: 'endDate', type: 'date', label: 'İşten çıkış tarihini girin', halfWidth: true },
      { id: 'grossSalary', type: 'currency', label: 'Aylık brüt maaş tutarı' },
    ],
    calculate: calculateSeverancePay,
  },
];
