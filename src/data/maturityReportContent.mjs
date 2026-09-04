// ADIM 4 (2026-09-03) — PDF raporunun 4 seviye modeli (A/B/C/D). Metinler
// kullanıcının paylaştığı "İş Analizi ve Teknik Spesifikasyon Dokümanı"
// (Document.pdf, bölüm "3. Olasılıklara Göre 4 Farklı Rapor Modeli" +
// "4. Örnek Rapor İçerik Tasarımı") ile kullanıcının paylaştığı GERÇEK
// örnek PDF çıktısından (hr-report-....pdf, Model C/skor 60) BİREBİR
// alındı — hiçbir cümle uydurulmadı. Örnek PDF'te Document.pdf'ten küçük
// farklarla (birkaç eksik tırnak düzeltmesi, Model C'nin CTA metninin
// "Danışmanımızla görüşün" yerine "Hemen Başlayın!" olması, bazı analiz
// bloklarına Document.pdf'te olmayan bir "Çözüm" satırının eklenmiş
// olması) render edilen metinler görülünce, GERÇEKTEN KULLANILMIŞ/onaylı
// olduğu için örnek PDF'teki hal tercih edildi (yorumlarla işaretlendi).
//
// BİLİNÇLİ UYARLAMA: Document.pdf'in metodoloji paragrafı "6 ana boyut"
// diyor — ama ADIM 0'da netleşen gerçek sistemimiz 5 kategori kullanıyor
// (bkz. CLAUDE.md/konuşma geçmişi). "6" sayısı buraya olduğu gibi
// TAŞINMADI, sistemimizin gerçek kategori sayısıyla (5) uyumlu hale
// getirildi — bu bir içerik UYDURMASI değil, dokümanın kendi metniyle
// GERÇEKTEN kurduğumuz sistem arasındaki bir tutarsızlığın düzeltilmesi.
export const REPORT_METHODOLOGY_TEXT =
  'Bu analiz, İnsan Kaynakları süreçlerinizi 5 ana boyutta (Dijital Altyapı & Özlük, Zaman Yönetimi, Performans, İşe Alım, Analitik) değerlendiren uluslararası HR Tech standartlarına dayanmaktadır. Amacımız, dijitalleşme yolculuğunuzda güçlü kaslarınızı ve gelişim fırsatlarınızı görünür kılarak size özel bir yol haritası sunmaktır.';

/**
 * @typedef {Object} AnalysisBlock
 * @property {string} title
 * @property {string} status
 * @property {string} statusColor
 * @property {string} analysis
 * @property {string} [solution]
 */

/**
 * @typedef {Object} MaturityReportModel
 * @property {string} scoreColor
 * @property {string} headline
 * @property {string} detection
 * @property {AnalysisBlock[]} analysisBlocks
 * @property {{ strengths: string; weaknesses: string; opportunities: string; threats: string }} swot
 * @property {string[]} roadmap
 * @property {string} closingSummary
 * @property {string} recommendedPackage
 * @property {string} ctaLabel
 */

/** @type {Record<'A'|'B'|'C'|'D', MaturityReportModel>} */
export const MATURITY_REPORT_MODELS = {
  A: {
    scoreColor: '#DC2626',
    headline: 'Operasyonel Yük Altındasınız',
    detection:
      'Analiz sonuçları, İK süreçlerinizin büyük oranda manuel yöntemlerle (Excel, e-posta, kağıt) yürütüldüğünü gösteriyor. Bu durum veri güvenliği riski yaratırken, ekibinizin zamanını stratejik işlerden alıp operasyonel işlere hapsetmektedir.',
    analysisBlocks: [
      {
        title: 'Altyapı & Zaman',
        status: 'Kritik',
        statusColor: '#DC2626',
        analysis:
          'Özlük dosyalarının fiziksel saklanması KVKK uyumluluğunuzu tehlikeye atıyor. İzin ve devam takibinin manuel yapılması, bordro hesaplamalarında hata payını artırıyor.',
        solution: 'Dijital Özlük ve Otomatik İzin Modülü.',
      },
      {
        title: 'Yetenek',
        status: 'Yok / Başlanmamış',
        statusColor: '#DC2626',
        analysis:
          'Performans değerlendirmesi sistematik değil. İşe alım süreçlerinde kurumsal hafıza oluşmuyor; aday verileri e-postalarda kayboluyor.',
        solution: 'Temel ATS ve Performans Karnesi yapısına geçiş.',
      },
      {
        title: 'Strateji',
        status: 'Veri Yok',
        statusColor: '#DC2626',
        analysis: 'Dijital veri olmadığı için analitik raporlama yapılamıyor. Kararlar veriye değil, tahminlere dayanıyor.',
      },
    ],
    swot: {
      strengths: 'Değişim ihtiyacının farkındalığı.',
      weaknesses: 'Yüksek operasyonel maliyet, düşük verimlilik.',
      opportunities: 'Dijitalleşme ile %40 zaman tasarrufu potansiyeli.',
      threats: 'Yasal cezalar, evrak kaybı, hatalı maaş ödemeleri.',
    },
    roadmap: [
      'Kağıtsız ofise geçiş (Dijital Özlük) ve E-İmza entegrasyonu.',
      'İzin ve Zaman yönetiminin (PDKS) dijitalleşmesi.',
      'Bordro süreçlerinin otomasyona bağlanması.',
    ],
    closingSummary: 'Önce temeli sağlamlaştırın. Riskleri sıfırlayın.',
    recommendedPackage: 'Idenfit Core HR + Time',
    ctaLabel: 'Danışmanımızla görüşün',
  },
  B: {
    scoreColor: '#F59E0B',
    headline: 'Parçalı Yapı ve Verimlilik Kaybı',
    detection:
      'Dijitalleşme adımları atılmış ancak sistemler birbiriyle konuşmuyor. Veriler farklı adacıklarda (farklı yazılımlar veya Excel) tutuluyor. Mükerrer veri girişi yapıyor ve departmanlar arası iletişim kopukluğu yaşıyorsunuz.',
    analysisBlocks: [
      {
        title: 'Altyapı & Zaman',
        status: 'Gelişime Açık',
        statusColor: '#F59E0B',
        analysis: 'PDKS veya bordro yazılımınız var ancak tam entegre değil. Veri aktarımı sırasında insan hatası riski devam ediyor.',
        solution: 'Uçtan uca entegre (All-in-One) yapı.',
      },
      {
        title: 'Yetenek',
        status: 'Kritik Eksiklik',
        statusColor: '#DC2626',
        analysis: 'Çalışan hedefleri (KPI/OKR) sistemde tanımlı değil. Performans sonuçları eğitim ve ücretlendirme ile otomatik konuşmuyor.',
        solution: 'Performans Yönetimi Modülü.',
      },
      {
        title: 'Strateji',
        status: 'Manuel Raporlama',
        statusColor: '#F59E0B',
        analysis: 'Rapor alabiliyorsunuz ancak farklı sistemlerden gelen veriyi Excel’de birleştirip temizlemeniz zaman alıyor.',
      },
    ],
    swot: {
      strengths: 'Teknoloji kullanım alışkanlığı var.',
      weaknesses: 'Veri bütünlüğü yok, entegrasyon eksik.',
      opportunities: 'Tek platforma geçiş ile lisans maliyetlerini düşürme.',
      threats: 'Veri tutarsızlığı nedeniyle yanlış stratejik kararlar.',
    },
    roadmap: [
      'Tüm sistemlerin tek platformda birleşmesi.',
      'Performans yönetiminin dijitale taşınması.',
      'Çalışan self-servis (mobil) kullanımının artırılması.',
    ],
    closingSummary: 'Veri taşımayı bırakın, sistemleri konuşturun.',
    recommendedPackage: 'Idenfit Entegre İK Paketi',
    ctaLabel: 'Danışmanımızla görüşün',
  },
  // Model C içeriği kullanıcının paylaştığı GERÇEK örnek PDF'ten
  // (hr-report-....pdf, skor 60/100) birebir okunarak alındı — Document.pdf'in
  // taslağından ufak farklar taşıyor (tırnak düzeltmesi, "Hemen Başlayın!"
  // CTA'sı, ek "Çözüm" satırları) çünkü örnek, GERÇEKTEN üretilmiş/onaylı
  // sürüm.
  C: {
    scoreColor: '#16A34A',
    headline: 'Operasyon Tamam, Sıra Yetenekte',
    detection:
      'Tebrikler, operasyonel süreçleriniz büyük ölçüde dijital ve verimli. Temel İK süreçlerini çözmüşsünüz. Şimdi odak noktanızı işleri yürütmekten, yetenekleri çekmeye ve geliştirmeye taşıma zamanı.',
    analysisBlocks: [
      {
        title: 'Altyapı & Zaman',
        status: 'İyi / Optimize',
        statusColor: '#16A34A',
        analysis: 'Temel süreçler (Özlük, İzin, Bordro) kusursuz işliyor. Operasyonel yükünüz minimumda.',
        solution: 'Mikro optimizasyonlar ve self-servis kullanımını artırma.',
      },
      {
        title: 'Yetenek',
        status: 'İyileştirilmeli',
        statusColor: '#F59E0B',
        analysis: 'İşe alımda aday deneyimi ve oryantasyon (onboarding) süreçlerinde dijitalleşme fırsatları var. Yetenek havuzunuzu daha aktif yönetmelisiniz.',
        solution: 'ATS ve İşe Alım Modülleri.',
      },
      {
        title: 'Strateji',
        status: 'Gelişime Açık',
        statusColor: '#F59E0B',
        analysis: 'Çalışan geri bildirimleri (feedback) süreçlerini daha sistematik takip edilmeli. Kültürü dijitalde yaşatmalısınız.',
        solution: 'Feedback, anket ve gelişim takibi modülleri.',
      },
    ],
    swot: {
      strengths: 'Güçlü dijital omurga, verimli operasyon.',
      weaknesses: 'Çalışan deneyimi ve gelişim takibinde manuel noktalar.',
      opportunities: 'İşveren markasını güçlendirmek, turnover oranını düşürmek.',
      threats: 'Yetenek savaşlarında adayları daha hızlı rakiplere kaptırmak.',
    },
    roadmap: [
      'ATS (Aday Takip Sistemi) kurulumu.',
      'Yapay zeka mülakat platformu entegrasyonu.',
      '360 derece işe alım sistemine geçiş.',
    ],
    closingSummary: 'Yetenekleri daha kolay çekmek için deneyime yatırım yapın.',
    recommendedPackage: 'Idenfit Talent',
    ctaLabel: 'Hemen Başlayın!',
  },
  D: {
    scoreColor: '#2563EB',
    headline: 'Geleceğin İK Yönetimi',
    detection:
      'Siz bir HR Tech vizyonerisiniz. Süreçleriniz uçtan uca dijital ve entegre. Sektör lideri konumundasınız. Artık hedefiniz, geçmiş veriyi raporlamaktan öte, öngörücü (predictive) analizler ve yapay zeka (AI) ile geleceği tasarlamak.',
    analysisBlocks: [
      {
        title: 'Altyapı & Zaman',
        status: 'Mükemmel',
        statusColor: '#2563EB',
        analysis: 'Süreçler otonom çalışıyor. Artık verimliliği artırmak için mikro optimizasyonlar yapılabilir.',
      },
      {
        title: 'Yetenek',
        status: 'Çok İyi',
        statusColor: '#16A34A',
        analysis: 'Performans ve yetenek yönetimi dijital. Yapay zeka destekli envanter ve mülakat araçları ile karar alma kalitesini artırabilirsiniz.',
      },
      {
        title: 'Strateji',
        status: 'Odak Noktası',
        statusColor: '#2563EB',
        analysis: 'Veri elinizde var. Şimdi "Hangi çalışan istifa edebilir?" veya "Gelecek yıl hangi yetkinliklere ihtiyaç olacak?" sorularına yapay zeka ile yanıt bulma zamanı.',
      },
    ],
    swot: {
      strengths: 'Veri odaklı kültür, tam entegrasyon, çeviklik.',
      weaknesses: 'Yok — sadece iyileştirme alanları var.',
      opportunities: 'AI ile tahmine dayalı yönetim, stratejik iş ortaklığı.',
      threats: 'Teknolojik atalete düşmek (sürekli yenilenmeme).',
    },
    roadmap: [
      'İleri İK Analitiği ve Dashboard özelleştirmeleri.',
      'AI destekli işe alım araçlarının devreye alınması.',
      'Stratejik iş gücü planlaması (Workforce Planning).',
    ],
    closingSummary: 'Veriyi sadece tutmayın, geleceği tahmin edin.',
    recommendedPackage: 'Idenfit Advanced Analytics & AI',
    ctaLabel: 'Danışmanımızla görüşün',
  },
};

/** Toplam skora göre (0-25/26-50/51-75/76-100) hangi modelin
 * kullanılacağını döner — `maturityTestDefinitions.ts`'teki
 * `MATURITY_LEVELS`'in AYNI 4 sınırıyla birebir. */
export function getReportModelKey(totalScore) {
  if (totalScore <= 25) return 'A';
  if (totalScore <= 50) return 'B';
  if (totalScore <= 75) return 'C';
  return 'D';
}
