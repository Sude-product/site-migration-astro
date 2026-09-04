// Dijital İK Olgunluk Testi — 20 soru + puanlama mantığı.
// Kaynak: idenfit.com'un 3 sayfalık akışı (lead-capture → quiz → sonuç,
// bkz. CLAUDE.md — "Dijital İK Olgunluk Testi" araştırma günlüğü). Kaynağın
// kendi `quiz-script.js`/`result-script.js`'i (site içi inline script'ler,
// ACF'de HİÇBİR quiz verisi yok — tamamen Elementor `content.rendered`'daki
// script bloklarında) tek tek incelenip TypeScript'e elle taşındı — ham JS
// hiç import/eval edilmiyor (calculatorDefinitions.ts'teki AYNI ilke).
//
// BİLİNÇLİ FARK (kaynağa göre, davranışı bozmayan bir temizlik): kaynağın
// akışı 3 AYRI URL + `sessionStorage` kullanıyordu (lead-capture sayfası →
// quiz sayfası → sonuç sayfası). Bu, incelemede DOM'da var olması gereken
// `.e-form__step` class'ının canlı sitenin raw HTML'inde hiç bulunmadığı
// (yalnızca script'in kendi selector'ünde geçiyor, 0 eşleşme) gibi bir
// tutarsızlık da içeriyordu — adım-adım gösterme mekanizmasının curl ile
// doğrulanamayan/güvenilmez bir davranışa dayandığı görüldü. Bu yüzden
// kaynağın JS'i taklit edilmedi; aynı 20 soru + AYNI puanlama formülü,
// TEK sayfa + React `useState` ile üç iç adım (lead-capture/quiz/sonuç)
// olarak temiz baştan yazıldı (bkz. `HrMaturityTest.tsx`).
//
// KARAR 2 (CLAUDE.md) gereği: kaynakta yalnızca TR var (3 sayfanın da
// `pll_translations` alanı yalnızca `tr` içeriyor) — bu dosyadaki metinler
// Hesaplama Araçları'ndaki ilkeyle TUTARLI olarak yalnızca Türkçe, i18n
// sistemine (`src/i18n/*.ts`) hiç bağlanmıyor (yalnızca KEŞFET menüsündeki
// link ETİKETİ zaten 4 dilde var, sayfanın kendi içeriği değil).

export type MaturityAnswerValue = 'evet' | 'kısmen' | 'hayır';

export interface MaturityQuestion {
  /** 1-20, kaynağın kendi soru numaralarıyla birebir (GROUPS eşlemesi bu
   * numaralara dayanıyor, değiştirilemez). */
  id: number;
  category: string;
  text: string;
}

// Kaynak: quiz-script.js'teki `questions` dizisi (20 soru, 6 kategori) —
// birebir taşındı, kaynaktaki `<span>` vurgu parantezleri düz metne
// çevrildi (React tarafında `set:html` gerektirmeyen sade bir string için).
export const MATURITY_QUESTIONS: MaturityQuestion[] = [
  { id: 1, category: 'Temel İK Dijital Altyapı', text: 'Çalışanlara ait evrak ve dokümanlar (ikametgah, diploma, sözleşme vb.) dijital ortamda saklanıyor mu?' },
  { id: 2, category: 'Temel İK Dijital Altyapı', text: 'Bordro süreçlerini dijital bir sistem üzerinden yönetiyor musunuz?' },
  { id: 3, category: 'Temel İK Dijital Altyapı', text: 'Bordro ve izin belgelerini elektronik ortamda imzalatıyor musunuz?' },
  { id: 4, category: 'Zaman & İzin Yönetimi', text: 'Zaman ve devam takibi için bir PDKS (Zaman Yönetimi) sistemi kullanıyor musunuz?' },
  { id: 5, category: 'Zaman & İzin Yönetimi', text: 'İzin süreçlerini dijital bir izin modülü üzerinden yönetiyor musunuz?' },
  { id: 6, category: 'Zaman & İzin Yönetimi', text: 'Çalışanlara izin, giriş-çıkış veya onay süreçleriyle ilgili otomatik hatırlatmalar gönderiyor musunuz?' },
  { id: 7, category: 'Performans, Hedef & Yetkinlik Yönetimi', text: 'Performans değerlendirme süreçlerinizi dijital bir sistemle yürütüyor musunuz?' },
  { id: 8, category: 'Performans, Hedef & Yetkinlik Yönetimi', text: 'Hedef (OKR / KPI) yönetimi yapıyor musunuz?' },
  { id: 9, category: 'Performans, Hedef & Yetkinlik Yönetimi', text: 'Yetkinlik bazlı değerlendirme ve gelişim takibi yapıyor musunuz?' },
  { id: 10, category: 'Performans, Hedef & Yetkinlik Yönetimi', text: 'Performans sonuçlarını yönetime düzenli raporlar halinde sunuyor musunuz?' },
  { id: 11, category: 'İşe Alım & Aday Deneyimi', text: 'İşe alım süreçlerinizi dijital bir sistem üzerinden yönetiyor musunuz?' },
  { id: 12, category: 'İşe Alım & Aday Deneyimi', text: 'ATS (Aday Takip Sistemi) kullanıyor musunuz?' },
  { id: 13, category: 'İşe Alım & Aday Deneyimi', text: 'İşe alım süreçlerinde kişilik, yetkinlik veya yetenek envanterleri kullanıyor musunuz?' },
  { id: 14, category: 'İşe Alım & Aday Deneyimi', text: 'Yapay zeka destekli mülakat veya ön eleme çözümlerinden faydalanıyor musunuz?' },
  { id: 15, category: 'Çalışan Deneyimi & Gelişim', text: 'Çalışan deneyimini ölçen veya yöneten bir sistem kullanıyor musunuz?' },
  { id: 16, category: 'Çalışan Deneyimi & Gelişim', text: 'LMS (Eğitim Yönetim Sistemi) kullanıyor musunuz?' },
  { id: 17, category: 'Çalışan Deneyimi & Gelişim', text: 'Çalışanlara gelişim, eğitim veya geri bildirim süreçlerinde dijital destek sunuyor musunuz?' },
  { id: 18, category: 'Analitik & Stratejik İK', text: 'İK Analitiği (turnover, devamsızlık, performans, bağlılık vb.) kullanıyor musunuz?' },
  { id: 19, category: 'Analitik & Stratejik İK', text: 'Yönetime periyodik ve ölçülebilir İK raporları sunuyor musunuz?' },
  { id: 20, category: 'Analitik & Stratejik İK', text: 'Karar alma süreçlerinde İK verilerinden aktif olarak faydalanıyor musunuz?' },
];

// Kaynak: result-script.js → POINTS.
const POINTS: Record<MaturityAnswerValue, number> = { evet: 5, kısmen: 2, hayır: 0 };

// Kaynak: result-script.js → GROUPS (soru numaralarının alt-gruplara
// dağılımı — 20 sorunun HEPSİ tam olarak bir grupta, birebir taşındı).
const GROUPS: Record<string, number[]> = {
  ozluk: [1],
  bordro: [2],
  dijital_imza: [3],
  pdks: [4],
  izin: [5, 6],
  performans_surec: [7, 8, 9],
  ise_alim: [11, 12, 13, 14],
  egitim: [16],
  calisan_deneyimi: [15, 17],
  raporlama: [10, 18, 19, 20],
};

export type MaturityCategoryKey = 'temel' | 'zaman' | 'performans' | 'ise_alim' | 'analitik';

// Kaynak: result-script.js → CATEGORY_WEIGHTS. Görünen isimler, sayfanın
// kendi pazarlama bölümündeki ("İK Dijital Dönüşümünüzü 5 Kritik Alanda
// Netleştirin") 5 kart başlığıyla birebir eşleşiyor (`maturity-fresh.html`,
// 2026-07-28 taze curl ile doğrulandı) — uydurma isim değil.
export const MATURITY_CATEGORY_LABELS: Record<MaturityCategoryKey, string> = {
  temel: 'Dijital Altyapı & Özlük',
  zaman: 'Zaman & İzin Yönetimi',
  performans: 'Performans & Yetkinlik',
  ise_alim: 'İşe Alım (ATS)',
  analitik: 'Analitik & Raporlama',
};

const CATEGORY_WEIGHTS: Record<MaturityCategoryKey, number> = {
  temel: 30,
  zaman: 20,
  performans: 20,
  ise_alim: 15,
  analitik: 15,
};

// ADIM 3 (2026-09-03) — Teknik spesifikasyon dokümanı v1.0, bölüm 4.2
// "Dinamik Öneri Motoru". Kaynaktaki tablo 5 satır (Temel Altyapı/Zaman &
// İzin/Performans/İşe Alım/Analitik) — bizim 5 `MaturityCategoryKey`'imizle
// birebir eşleşiyor, "Çalışan Deneyimi" gibi ayrı bir 6. satır YOK (o
// dokümanın 6-kategorili taslak sürümüne özgüydü, ADIM 0'da netleşen 5
// kategorili şemada karşılığı bu tabloda gerekmiyor). Metinler dokümandan
// birebir alındı, uydurulmadı.
export const CATEGORY_PAIN_POINTS: Record<MaturityCategoryKey, { message: string; recommendedModule: string }> = {
  temel: { message: 'Evrak operasyonu verimliliğinizi %40 düşürüyor.', recommendedModule: 'Dijital Özlük & Core HR' },
  zaman: { message: 'Hatalı puantaj hesaplamaları maliyet yaratıyor.', recommendedModule: 'Idenfit PDKS' },
  performans: { message: 'Hedefsiz yönetim çalışan bağlılığını düşürür.', recommendedModule: 'Performans Yönetimi' },
  ise_alim: { message: 'Doğru yeteneği bulma süreniz sektör ortalamasının altında.', recommendedModule: 'İşe Alım & ATS' },
  analitik: { message: 'Veriye dayalı karar alamamak stratejik hatalara yol açar.', recommendedModule: 'İK Analitiği Modülü' },
};

/** En düşük puanlı 2 kategoriyi döner (dokümanın "en düşük puan alan 2
 * kategoriyi tespit eder" kuralı) — eşitlik durumunda `Object.keys`'in
 * (dolayısıyla `CATEGORY_WEIGHTS`'in tanım sırası, temel→zaman→performans→
 * ise_alim→analitik) sabit sırasını korur, sonuç deterministik kalır. */
export function getWeakestCategories(categoryScores: Record<MaturityCategoryKey, number>): MaturityCategoryKey[] {
  return (Object.keys(CATEGORY_WEIGHTS) as MaturityCategoryKey[])
    .slice()
    .sort((a, b) => categoryScores[a] - categoryScores[b])
    .slice(0, 2);
}

// ADIM 1'de karşılama ekranındaki dropdown için tanımlanmıştı; ADIM 3'ün
// "Firma Büyüklüğüne Göre Akıllı Filtre"si (teknik spesifikasyon
// dokümanı, bölüm 6) AYNI 3 kovayı kullandığı için buraya (tek kaynak)
// taşındı — `HrMaturityTest.tsx` her ikisini de buradan içe aktarıyor.
export type EmployeeCountBucket = '<50' | '50-250' | '250+';

export const EMPLOYEE_COUNT_OPTIONS: { value: EmployeeCountBucket; label: string }[] = [
  { value: '<50', label: "50'den az" },
  { value: '50-250', label: '50 - 250' },
  { value: '250+', label: "250'den fazla" },
];

// Dokümandan (bölüm 6) birebir — uydurulmadı.
export const EMPLOYEE_COUNT_ADVICE: Record<EmployeeCountBucket, string> = {
  '<50': 'Önceliğiniz temel süreçleri (Özlük, İzin) dijitalleştirmek olmalı.',
  '50-250': 'Önceliğiniz Performans Yönetimi ve ATS ile verimliliği artırmak.',
  '250+': 'Önceliğiniz Veri Analitiği, Entegrasyonlar ve ERP uyumluluğu.',
};

export interface MaturityLevel {
  min: number;
  max: number;
  title: string;
  subtitle: string;
  description: string;
}

// Kaynak: result-script.js → LEVELS, birebir taşındı.
export const MATURITY_LEVELS: MaturityLevel[] = [
  {
    min: 0,
    max: 25,
    title: 'Geleneksel İK',
    subtitle: 'Kaos Yönetimi',
    description:
      'İK süreçleriniz büyük ölçüde Excel ve kağıt formlar üzerinden ilerliyor; bu durum veri kaybı ve yasal riskleri artırırken ekibinizi yoğun bir operasyonel yük altında bırakıyor. Temeli sağlamlaştırarak riskleri sıfırlayın ve her ay manuel işlere harcadığınız yaklaşık 3 iş gününü geri kazanın.',
  },
  {
    min: 26,
    max: 50,
    title: 'Dijitalleşme Yolunda',
    subtitle: 'Parçalı Yapı',
    description:
      'İK süreçlerinizde dijital araçlar kullanmaya başlamış olsanız da sistemler arasında kopukluklar bulunuyor; bu durum veri bütünlüğünü zayıflatırken gizli verimlilik kayıplarına yol açıyor. Süreçlerinizi tek çatı altında birleştirerek veri akışını kesintisiz hale getirin ve farklı sistemler arasında harcadığınız zamanı ortadan kaldırın.',
  },
  {
    min: 51,
    max: 75,
    title: 'Dijital İK',
    subtitle: 'Stratejik Oyuncu',
    description:
      'İK süreçleriniz büyük ölçüde dijitalleşmiş ve ekibiniz teknolojiye uyum sağlamış durumda; artık odak noktanız çalışan gelişimi ve aday deneyimi olmalı. Yetenek yönetimi süreçlerinizi güçlendirerek en iyi çalışanları kazanabilir, geliştirebilir ve uzun vadede elde tutabilirsiniz.',
  },
  {
    min: 76,
    max: 100,
    title: 'Data & AI Odaklı',
    subtitle: 'HR Visionary',
    description:
      'İK süreçleriniz tamamen dijital ve entegre bir yapıya ulaşmış; artık bir sonraki adım veriyi anlamlandırmak ve geleceği öngörmek. İleri analitik ve yapay zeka çözümleriyle sadece mevcut durumu takip etmekle kalmayın, çalışan davranışlarını önceden analiz ederek stratejik kararlarınızı güçlendirin.',
  },
];

export interface MaturityResult {
  totalScore: number;
  level: MaturityLevel;
  categoryScores: Record<MaturityCategoryKey, number>;
  /** ADIM 4 (PDF raporu, "Yetkinlik Karnesi" sayfası) için — 10 alt-grubun
   * kendi ham skoru (`GROUPS`'un anahtarları). Web sonuç ekranı bunu
   * KULLANMIYOR (yalnızca 5 `categoryScores` gösteriliyor), ama hesaplama
   * zaten yapılıyordu — önceden döndürülmüyordu, şimdi PDF'in ihtiyacı
   * için dışa açıldı. */
  groupScores: Record<string, number>;
}

function getLevel(score: number): MaturityLevel {
  return MATURITY_LEVELS.find((l) => score >= l.min && score <= l.max) ?? MATURITY_LEVELS[0];
}

/** Kaynak: result-script.js → weightedAverage(). */
function weightedAverage(items: [number, number][]): number {
  let sum = 0;
  let weight = 0;
  for (const [value, w] of items) {
    sum += value * w;
    weight += w;
  }
  return weight ? Math.round(sum / weight) : 0;
}

// Kaynak: result-script.js → calculateResult(). `answers`, soru id'sinden
// (1-20) cevaba (`evet`/`kısmen`/`hayır`) giden bir haritadır — kaynağın
// `sessionStorage`'daki `{q1: "evet", ...}` biçiminin doğrudan karşılığı,
// ama burada React state'i olarak tutuluyor (bkz. HrMaturityTest.tsx).
export function calculateMaturityResult(answers: Record<number, MaturityAnswerValue>): MaturityResult {
  const groupScores: Record<string, number> = {};

  for (const [group, questionIds] of Object.entries(GROUPS)) {
    let total = 0;
    for (const id of questionIds) {
      total += POINTS[answers[id]] ?? 0;
    }
    groupScores[group] = Math.round((total / (questionIds.length * 5)) * 100);
  }

  const categoryScores: Record<MaturityCategoryKey, number> = {
    temel: weightedAverage([
      [groupScores.ozluk, 1],
      [groupScores.bordro, 1],
      [groupScores.dijital_imza, 1],
    ]),
    zaman: weightedAverage([
      [groupScores.pdks, 1],
      [groupScores.izin, 1],
    ]),
    performans: weightedAverage([
      [groupScores.performans_surec, 3],
      [groupScores.egitim, 1],
      [groupScores.calisan_deneyimi, 2],
    ]),
    ise_alim: groupScores.ise_alim,
    analitik: groupScores.raporlama,
  };

  let total = 0;
  for (const cat of Object.keys(CATEGORY_WEIGHTS) as MaturityCategoryKey[]) {
    total += (categoryScores[cat] / 100) * CATEGORY_WEIGHTS[cat];
  }
  const totalScore = Math.round(total);

  return { totalScore, level: getLevel(totalScore), categoryScores, groupScores };
}

// PDF raporunun "Yetkinlik Karnesi" sayfası için — `GROUPS`'un 10
// anahtarının görünen etiketleri (örnek PDF'teki bar sırası/isimleriyle
// birebir, `hr-report-....pdf`'ten okunarak doğrulandı).
export const GROUP_LABELS: Record<string, string> = {
  ozluk: 'Özlük',
  bordro: 'Bordro Süreci',
  dijital_imza: 'Dijital İmza',
  pdks: 'Pdks',
  izin: 'İzin Yönetimi',
  performans_surec: 'Performans Yönetimi',
  ise_alim: 'İşe Alım',
  egitim: 'Eğitim',
  calisan_deneyimi: 'Çalışan Deneyimi',
  raporlama: 'Raporlama',
};
