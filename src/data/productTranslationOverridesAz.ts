// Azerbaycan dili (az) — ürün/modül sayfaları için TR kaynaktan gerçek/
// profesyonel çeviri (KARAR 1, 2026-08-21). Ayrı bir dosyada tutulmasının
// nedeni: `productTranslationOverrides.ts`'teki mevcut `PRODUCT_OVERRIDES`
// tablosu zaten 19 trSlug için it/en/nl girdileri barındırıyor — o iç
// içe yapıyı bozmadan `productContent.ts`'in `getProductContent()`'i bu
// dosyayı `locale === 'az'` durumunda AYRI bir öncelik olarak kontrol
// ediyor (bkz. o dosyadaki değişiklik).
import type { ProductBlock, ProductFaqItem } from './productContent';

const DEMO_CTA_URL = 'https://idenfit.com/tr/online-sunum-talep-et/';

export interface ProductOverrideAz {
  hero: ProductBlock;
  sections: ProductBlock[];
  faq: ProductFaqItem[];
}

export const PRODUCT_OVERRIDES_AZ: Record<string, ProductOverrideAz> = {
  'pdks-modulu': {
    hero: {
      title: 'PDKS - Personalın Davamiyyət Nəzarət Sistemi',
      text: 'İdenfit PDKS, həm proqram təminatı, həm də avadanlıq həllərini bir arada təqdim edir. Beləliklə əlavə əməliyyat xərclərini sizin üçün minimuma endirərkən qiymət üstünlüyünüzü qoruyur.',
      ctaText: 'İndi Müraciət Et',
      ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/time-attendance-system1@2x-1.webp', alt: 'time attendance system1@2x 1', width: 1221, height: 1100 },
    },
    sections: [
      {
        title: 'Niyə idenfit',
        text: 'PDKS, yəni "Personalın davamiyyət nəzarət sistemi" personalın müəyyən edilmiş keçid və nəzarət nöqtələrindən giriş-çıxışlarını, PDKS cihaz və avadanlıqları vasitəsilə qeyd altına alan avtomatlaşdırma sistemləridir. İşlənən qeydlər onlayn olaraq PDKS proqramına ötürülərək təhlil edilə bilər və təhlil nəticəsində personalın işə giriş-çıxış saatları, iş saatları və icazələri kimi davamiyyətlə əlaqəli məlumatlar PDKS ilə sağlam şəkildə qeyd altında tutulur. Beləliklə ay sonunda performans, davamiyyət və buna bağlı maaş hesablamaları asanlıqla edilir.',
        ctaText: '', ctaUrl: '',
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/2@2x-1-1.webp', alt: '2@2x 1 1', width: 1258, height: 1079 },
      },
      {
        title: 'Turniket Keçid Sistemləri',
        text: '<p>İdenfit PDKS sistemi ilə turniket və ya keçid nöqtələrinə quraşdırılan sistem sayəsində kimlik doğrulama və işçilərin real zamanlı giriş-çıxış izləməsi asanlıqla edilə bilər.</p>\n<p>idenfit PDKS proqramı sayəsində turniketlərə kartlı keçid, üz oxuma və ya barmaq izi oxuma sistemləri quraşdırılaraq keçidlər müəyyən edilə bilər.</p>\n<p>"Bütün hesabatları alacağınız proqramımız inteqrasiya olduğumuz PDKS cihazları ilə uyğun işləyir."</p>',
        ctaText: 'Ətraflı Məlumat Al', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/3@2x-2.webp', alt: '3@2x 2', width: 941, height: 1120 },
      },
      {
        title: 'Kart Oxuyucular',
        text: "<p>İdenfit mobil PDKS həlləri ilə turniket, qapı və ya giriş-çıxış nöqtələrində proqrama bağlı kart oxuyucular və cihazlara müəyyən edilmiş işçiyə xas kartlar sayəsində müəssisənizdə PDKS tətbiq edə bilərsiniz.</p>\n<p>Sistem, personal kart oxuyucularının işçi kartını oxutduğunda personal kart ID-lərinin zaman damğalı olaraq proqrama ötürülməsi ilə işləyir. Kart oxuyucu ilə qeyd altına alınan məlumatları İdenfit PDKS Proqramı ilə qiymətləndirərək hesabatlaya bilər və işçilərinizin izləməsini və davamiyyət hesablamasını asanlıqla edə bilərsiniz.</p>",
        ctaText: 'Satış Komandası ilə Görüşün', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/4@2x-1.webp', alt: '4@2x 1', width: 1164, height: 1326 },
      },
      {
        title: 'Barmaq İzi Oxuyucular',
        text: '<p>Hər müəssisənin PDKS ehtiyacı bir-birindən fərqlidir. Bəzi müəssisə üçün kart oxuma sistemi daha uyğun olarkən digər bir müəssisə üçün barmaq izi oxuyucu sistemi daha səmərəli ola bilər. İdenfit PDKS həllərindən barmaq izi oxuma və tanıma sistemi ilə barmaq izi oxutaraq nəzarət nöqtələrindən təhlükəsizliklə giriş-çıxış əməliyyatı edilə bilər.</p>\n<p>Barmaq izi oxuyucu ilə qeyd altına alınan məlumatları İdenfit PDKS Proqramı ilə qiymətləndirərək hesabatlaya bilər və işçilərinizin davamiyyət hesablaması əməliyyatlarını asanlıqla edə bilərsiniz.</p>',
        ctaText: 'Əlaqəyə Keçin', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/5@2x-1-1.webp', alt: '5@2x 1 1', width: 1227, height: 1109 },
      },
      {
        title: 'Üz Tanıma Sistemləri',
        text: '<p>Üz tanıma sistemləri, PDKS və keçid nəzarət sistemləri üçün dizayn edilmiş biometrik oxuyuculu izləmə sistemləridir. Yüksək doğrulama nisbəti, aşağı xəta payı, sürətli tanıma xüsusiyyəti və təmassız gigiyenik istifadəsi ilə üz tanıma sistemləri xüsusilə kart oxuyuculara və ya barmaq izi istifadəsinə uyğun olmayan sektorlarda ən praktik və təhlükəsiz izləmə həllərinin başında gəlir.</p>\n<p>Üz tanıma sistemləri ilə qeyd altına alınan məlumatları İdenfit PDKS Proqramı ilə qiymətləndirərək hesabatlaya bilər və işçi izləməsini asanlıqla həyata keçirə bilərsiniz.</p>',
        ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/6@2x-1.png', alt: '6@2x 1', width: 994, height: 1101 },
      },
      {
        title: 'BAB Beacon (Bluetooth)',
        text: '<p>Beacon, reader, wall reader, mobil access tətbiqi kimi keçid və izləmə həlləri ehtiva edən Bab məhsul ailəsi, bluetooth texnologiyası ilə şəxs və ya obyektləri asanlıqla izləməyinizi və idarə etməyinizi təmin edir.</p>\n<p>BAB köməyilə işçilərinizin işə giriş-çıxış saatlarını nəzarət edə, keçid səlahiyyətlərini idarə edə bilərsiniz. Mobil cihazınızla uzaqda olsanız belə istənilən zaman aralığı və istədiyiniz işçilər üçün təhlükəsiz giriş paylaşımı və ya məhdudlaşdırması həyata keçirə bilərsiniz.</p>\n<p>PDKS tərəfində istəsəniz geriyə dönük sorğulama edə və keçmiş məlumatları sistemdən əldə edə bilərsiniz</p>',
        ctaText: 'Pulsuz Sınayın', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/7@2x.png', alt: '7@2x', width: 962, height: 1125 },
      },
      {
        title: 'PDKS Mobil Tətbiq',
        text: 'İşçilər telefonlarına yüklədikləri İdenfit mobil PDKS tətbiqi ilə beacon texnologiyası, GPS, NFC, QR kod kimi texnologiyalarla kimlik və lokasiya doğrulaması edə bilərlər. Ayrıca mobil tətbiq üzərindən əlavə iş saatı və icazə tələblərini də həyata keçirə bilərlər. Mobil cihaz istifadəsi ilə, idenfit personalın davamiyyət nəzarət sistemi tətbiqi sayəsində işçilərin giriş-çıxış məlumatları, icazə, növbə, fasilə qeydləri və əlavə iş saatları qeyd altında tutulur.',
        ctaText: '', ctaUrl: '',
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/idenfit-karekod-tr@2x.webp', alt: 'idenfit karekod tr@2x', width: 438, height: 546 },
      },
      {
        title: 'Personal İzləmə Sistemində Karekod - QR Kod Oxutma Necə İşləyir?',
        text: '<p>İdenfit Mobil PDKS tətbiqində yer alan karekod – QR kod oxutma metodu ilə personal giriş-çıxışlarını asanlıqla edə bilərsiniz. QR kod – karekod oxuma nəticəsində məkan məlumatı anlıq olaraq sistemə qeyd edilir.</p>\n<p>QR kod eyni zamanda kartlı keçid sistemlərində də istifadə olunur. QR kod oxuyucu, kartlı sistemlərdə kart üzərinə basılan karekodu və ya barkodu oxuduğunda işçilərin giriş-çıxış əməliyyatı həyata keçmiş olur.</p>\n<p>"Mobil cihaz və ya telefonların işçi giriş kartı kimi istifadə olunmasını təmin edən texnologiyası sayəsində idenfit mobil PDKS tətbiqi, müəssisələrin əlavə cihaz və xərclərə qatlanmadan personal izləmə sistemi qurmasına imkan verir."</p>',
        ctaText: '', ctaUrl: '',
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/8@2x.png', alt: '8@2x', width: 604, height: 499 },
      },
      {
        title: 'İdenfit PDKS Proqramı Ümumi Xüsusiyyətlər',
        text: '<ul class="list gray"><li>İstifadəçi dostu interfeys</li><li>Hər sektora uyğun modullar</li><li>Bulud əsaslı etibarlı verilənlər bazası</li><li>İstifadəçi əsaslı giriş hüquqları</li><li>Veb əsaslı xidmətlər, masaüstü, mobil giriş</li><li>API dəstəyi ilə bir çox proqrama asan inteqrasiya</li><li>Java proqramlaşdırma dili ilə hazırlanmış güclü infrastruktur</li></ul>',
        ctaText: '', ctaUrl: '', image: null,
      },
    ],
    faq: [
      { question: 'idenfit performans qiymətləndirmə ölçüsü nədir?', answer: 'idenfit, müəssisənizə xas hədəf əsaslı performans və bacarıq qiymətləndirmə sistemi təqdim edir. Qiymətləndirmə ölçüləri fərdiləşdirilə bilən strukturdadır.' },
      { question: 'Performans qiymətləndirmə metodları arasında idenfit hansı sistemi istifadə edir?', answer: 'idenfit 360 dərəcə performans qiymətləndirmə metodu ilə işləyir.' },
      { question: 'Performans qiymətləndirmə nümunələri idenfit sistemində yer alır mı?', answer: 'Sektora xas nümunə qiymətləndirmə formaları idenfit sisteminə inteqrasiya edilə bilər.' },
      { question: 'Performans idarəçiliyi prosesi necə işləyir?', answer: 'idenfit performans idarəetmə sistemi ilə hədəf müəyyənləşdirmə, izləmə və geri bildirim prosesləri tək bir platformada idarə olunur.' },
      { question: '360 dərəcə performans qiymətləndirmə nədir?', answer: 'İşçilərin menecerlər, komanda yoldaşları və alt pillə tərəfindən qiymətləndirildiyi sistemdir.' },
      { question: 'Performans qiymətləndirmə və nəzarət prosesinin mərhələləri nələrdir?', answer: 'İzləmə, ölçmə, hesabatlıq və inkişaf planlaması. Bütün mərhələlər idenfit daxilində izlənə bilər.' },
      { question: 'idenfit 360 dərəcə performans qiymətləndirmə sistemini necə dəstəkləyir?', answer: 'Veb əsaslı proqramı sayəsində fərqli mənbələrdən geri bildirim toplanır və təhlil edilir.' },
      { question: 'Performans qiymətləndirmə meyarları necə müəyyənləşdirilir?', answer: 'Bacarıq, hədəfə nail olma və davranış göstəriciləri əsas alınır. idenfit performans idarəetmə sistemi üzərindən bütün addımlar tamamlana bilər.' },
      { question: 'Performans qiymətləndirmə nə zaman edilir?', answer: 'İllik, 6 aylıq və ya layihə əsaslı dövrlərdə edilə bilər.' },
      { question: 'Performans qiymətləndirmə qeydləri sistemdə saxlanılır mı?', answer: 'Bəli. Bütün qeydlər işçi profilində saxlanılır və giriş təmin edilə bilər.' },
      { question: 'Performans qiymətləndirmə proseduru necə işləyir?', answer: 'Addım-addım qiymətləndirmə başladılır, formalar doldurulur, təhlil edilir və geri bildirim verilir.' },
      { question: 'Performans qiymətləndirmə texnikaları idenfit sisteminə inteqrasiya edilə bilər mi?', answer: 'Bəli, fərqli texnikalar dəstəklənir.' },
      { question: 'Müəssisələrdə performans idarəçiliyi niyə əhəmiyyətlidir?', answer: 'Səmərəlilik və işçi bağlılığı üçün kritik əhəmiyyət daşıyır. idenfit bu prosesi rəqəmsallaşdıraraq asanlaşdırır.' },
      { question: '180 dərəcə performans qiymətləndirmə sistemi nədir?', answer: 'İşçilər yalnız menecerləri tərəfindən qiymətləndirilir. idenfit bu strukturu da dəstəkləyir.' },
      { question: '360 performans idarəçiliyi nəyi əhatə edir?', answer: '360 dərəcə qiymətləndirmə ilə davamlı performans izləməsi və inkişaf izləməsi birlikdə təqdim olunur.' },
      { question: '360 dərəcə performans qiymətləndirmə proqramı olaraq idenfit kifayətdir mi?', answer: 'Bəli. İnteqrasiya olunmuş və fərdiləşdirilə bilən strukturu ilə bütün ehtiyaclara cavab verir.' },
      { question: 'Bacarıq əsaslı performans qiymətləndirmə necə edilir?', answer: 'Müəyyən edilmiş bacarıq dəstləri üzərindən işçi davranışları xallandırılır. Sistem daxilində hazır şablonlar var.' },
      { question: 'Bacarıqlara əsaslanan performans qiymətləndirmə necə işləyir?', answer: 'İşçi davranışları müəyyən edilmiş bacarıqlara görə izlənir və xallandırılır.' },
      { question: '360 dərəcə performans idarəçiliyinin üstünlükləri nələrdir?', answer: 'Əhatəli geri bildirim, davamlı inkişaf və yüksək dəqiqlik. idenfit ilə bütün bu üstünlüklər təqdim olunur.' },
      { question: 'İşçi performans qiymətləndirmə sualları fərdiləşdirilə bilər mi?', answer: 'Bəli, sistem administratoru sual dəstlərini qurum mədəniyyətinə görə tənzimləyə bilər.' },
    ],
  },
  'ise-alim-modulu': {
    hero: {
      title: 'işə qəbul modulu',
      text: 'Yeni bir işçiyə ehtiyac duyduğunuzda, işə qəbul prosesini idarə edərkən, idenfit yanınızdadır!',
      ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/09/isealim1@2x.webp', alt: 'işə qəbul modulu ikonu', width: 1243, height: 1108 },
    },
    sections: [
      {
        title: 'A-dan Z-yə işə qəbul prosesi',
        text: 'idenfit işə qəbul modulu ilə İK departamenti olaraq, işə qəbul prosesini təşkil edən açıq vəzifələrin müəyyənləşdirilməsi və axtarışın fərqli kanallarda paylaşılması, CV hovuzlarının yaradılması, bu CV-lərin hansı kanaldan gəldiyinin müəyyənləşdirilməsi, hansı departamentin bu qəbula ehtiyac duyduğunun müəyyən edilməsi, müsbət namizədlərin növbəti prosesə keçirilməsi və ya mənfi namizədlərin qara siyahıya alınması kimi çox mərhələli işlərin öhdəsindən asanlıqla gəlirsiniz.',
        ctaText: '', ctaUrl: '',
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/09/isealim2@2x.webp', alt: 'Müsahibə xal kartları ikonu', width: 1163, height: 947 },
      },
      {
        title: 'Müsahibə xal kartları',
        text:
          '<p>idenfit işə qəbul modulu ilə insan resursları departamentləri;</p>\n<ul class="list gray"><li>İş elanının fərqli kanallar vasitəsilə yerləşdirilməsi,</li><li>CV-lərin filtrlənib müvafiq departamentə təyin edilməsi,</li><li>Seçilən CV-lərlə ilkin müsahibələrin edilməsi,</li><li>Müsahibə nəticələrinin müsahibə xal kartları üzərindən qiymətləndirilməsi,</li><li>Müsbət keçən namizədlər üçün ikinci müsahibə ilə əlaqədar departamentlərlə təqvim yaradılması,</li><li>Razılaşma əldə edildiyi halda onboarding prosesinə yönləndirilməsi,</li><li>Razılaşma əldə edilməzsə mənfi namizədlərin qara siyahı altında toplanması, bu şəxslərə təşəkkür məktublarının göndərilməsi və ya niyə işə qəbul edilmədiklərinə dair qeyd-məlumat daxil edilməsi,</li><li>Mənfi nəticələnən namizədlə maraqlanan digər departamentlərin də nəticə haqqında məlumatlandırılması kimi iş proseslərini asanlıqla idarə edə bilər.</li></ul>',
        ctaText: 'Onlayn Təqdimat Tələbi', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/09/isealim4@2x.webp', alt: "Dinamik 'çək - daşı - burax' panel ikonu", width: 955, height: 1063 },
      },
      {
        title: "Dinamik 'çək - daşı - burax' panel",
        text: '<p><strong>"Doğru insanları, doğru işə yerləşdirmənin sirri doğru vasitələrdən istifadə etməkdir."</strong></p>',
        ctaText: 'Ətraflı Məlumat Al', ctaUrl: DEMO_CTA_URL, image: null,
      },
    ],
    faq: [
      { question: 'İşə qəbul prosesi necə işləyir?', answer: 'İşə qəbul prosesi açıq vəzifənin müəyyənləşdirilməsi ilə başlayır. Ardından iş elanı hazırlanır, namizəd müraciətləri qəbul edilir, CV-lər incələnir və uyğun görülən namizədlərlə müsahibələr edilir. Müsahibələrdən sonra müsbət namizədlər növbəti mərhələyə keçirilir.' },
      { question: 'İşə qəbul prosesi xəritəsi nədir?', answer: 'İşə qəbul prosesi xəritəsi, bir namizədin müraciət etdiyi andan işə başladığı ana qədər keçdiyi addımların vizuallaşdırılmış formasıdır. Elan yaratma, müraciət toplama, müsahibə, qiymətləndirmə və təklif mərhələləri bu xəritədə yer alır.' },
      { question: 'İşə qəbul prosesi nə qədər çəkir?', answer: 'İşə qəbul müddətini vəzifənin xarakteri, müraciət sıxlığı və şirkətin daxili dinamikaları müəyyənləşdirir.' },
      { question: 'İşə qəbul prosesinin mərhələləri nələrdir?', answer: 'İş elanının yayımlanması, müraciətlərin qəbulu, ilkin seçim, müsahibələr, testlər və qiymətləndirmə, təklif vermə və onboarding prosesidir.' },
      { question: 'İşə qəbul prosesində hansı testlər tətbiq olunur?', answer: 'Namizədlərin bacarıqlarını ölçmək üçün şəxsiyyət inventarları, texniki bilik testləri, keys təhlilləri və istedad testləri istifadə oluna bilər.' },
      { question: 'İşə qəbul prosesi necə olmalıdır?', answer: 'İşə qəbul prosesi şəffaf, nizamlı və namizəd təcrübəsinə əhəmiyyət verən bir strukturda olmalıdır.' },
    ],
  },
  'onboarding-modulu': {
    hero: {
      title: 'Onboarding',
      text: 'idenfit işçilərin onboarding proseslərini problemsiz bir axın içində idarə etməyinizi təmin edir.',
      ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/onboarding1@2x.png', alt: 'onboarding1@2x', width: 1061, height: 1285 },
    },
    sections: [
      {
        title: 'Onboarding prosesində əskik iş qalmasın!',
        text: '<ul class="list gray"><li>İşçilərin işə başlamasından etibarən eyni və ya fərqli departamentlərin görməli olduğu, şəxsi sistem girişlərinin müəyyən edilməsi, giriş səlahiyyətləndirmələrinin edilməsi, e-poçt hesablarının açılması, yemək kartı & telefon xətti kimi haqların müəyyən edilməsi kimi əməliyyatlar sistemə addım-addım təyin edilə bilər.</li></ul><p>idenfit, müntəzəm aparılan işdən çıxış mərhələlərində müəssisənizin pozitiv marka qavrayışını qoruyarkən eyni zamanda işdən çıxan işçiyə də daha az stresli və proqnozlaşdırıla bilən bir proses yaşadır.</p>',
        ctaText: 'Ətraflı Məlumat Al', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/onboarding3@2x.png', alt: 'onboarding3@2x', width: 1089, height: 1197 },
      },
      {
        title: 'Departamentlərarası sürətli ünsiyyət',
        text:
          '<ul class="list gray"><li>Fərqli departamentlərin məsuliyyət sahəsinə girən əməliyyatlar görüntülənə bilər və müvafiq departamentlərdə iş izləmələri edilə bilər.</li><li>Ediləcək işlər, hər işçi üçün ayrı-ayrı əl ilə əməliyyat edilməsi yerinə departament əsaslı müəyyən edilib izlənə bilər</li><li>İşçilərin əlaqədar olduğu departamentlərdə meydana gələn əskik bir əməliyyat varsa prosesə müdaxilə edilə bilər.</li></ul>',
        ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL, image: null,
      },
    ],
    faq: [
      { question: 'Onboarding modulu nədir?', answer: 'idenfit Onboarding modulu, yeni işçilərin işə başlama prosesindəki bütün addımları planlı və tam şəkildə idarə etməyinizi təmin edir.' },
      { question: 'Onboarding modulu hansı əməliyyatları əhatə edir?', answer: 'Sistem girişlərinin müəyyən edilməsi, səlahiyyətləndirmələrin edilməsi, e-poçt və digər hesabların açılması, yemək kartı və telefon xətti kimi haqların təyin edilməsi kimi əməliyyatları addım-addım izləməyinizə imkan tanıyır.' },
    ],
  },
  'offboarding-modulu': {
    hero: {
      title: 'Offboarding Modulu',
      text: 'Offboarding modulu ilə işdən çıxış prosesini proqnozlaşdırıla bilən və stressiz idarə edin!',
      ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/offboarding-1.png', alt: 'offboarding 1', width: 877, height: 1201 },
    },
    sections: [
      {
        title: 'Offboarding prosesini maksimum ünsiyyətlə idarə edin.',
        text:
          '<p>• İşə qəbul prosesində olduğu kimi bir işçinin işdən çıxması vəziyyətində də meydana gələn bütün proses, hər hansı bir problem yaşanmadan sistem üzərindən idarə edilə bilər.</p>\n<p>• Bütün departamentlər eyni zamanda, prosesi davam edən və tamamlanan işlərdən tək panel sayəsində sürətlə xəbərdar olur.</p>\n<p>• Hesabatlıq xüsusiyyəti sayəsində işdən çıxış nisbətləri hesablana bilər və təkmilləşdirmə mövzusunda lazımi tənzimləmələr edilə bilər.</p>',
        ctaText: 'Onlayn Təqdimat Tələbi', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/offboarding-2.webp', alt: 'offboarding 2', width: 1081, height: 765 },
      },
      {
        title: 'Offboarding prosesində həm işçini, həm də müəssisənizi qoruyun.',
        text:
          '<p>İşdən çıxış, tamamlanması lazım olan proseslər düşünüldükdə, həm işçi, həm də insan resursları departamenti üçün stresli bir vəziyyətdir.</p>\n<p>Çıxış haqqında məlumatlandırma görüşünün təşkili, işçiyə doğru proses ötürülməsi, digər departamentlərin proses haqqında məlumatlandırılması və ya əmlak təhvili kimi mövzuların tənzimlənməsi lazım olduqda idenfit Offboarding modulu, prosesi qarışıqlığa yer vermədən idarə etməyinizi təmin edir.</p>\n<p>idenfit, müntəzəm aparılan işdən çıxış mərhələlərində müəssisənizin pozitiv marka qavrayışını qoruyarkən eyni zamanda işdən çıxan işçiyə də daha az stresli və proqnozlaşdırıla bilən bir proses yaşadır.</p>',
        ctaText: 'Əlaqəyə Keçin', ctaUrl: DEMO_CTA_URL, image: null,
      },
    ],
    faq: [
      { question: 'Offboarding modulu nədir?', answer: 'idenfit offboarding modulu, işdən çıxış prosesini addım-addım izləməyinizi və prosesin həm işçi, həm də müəssisə üçün problemsiz, proqnozlaşdırıla bilən və stressiz irəliləməsini təmin edir.' },
      { question: 'Offboarding modulu hansı üstünlükləri təqdim edir?', answer: 'Bütün departamentlərin eyni zamanda məlumatlandırılması, əmlak təhvillərinin izlənməsi, hesabatlıq və işdən çıxış nisbətlərinin təhlili kimi prosesləri tək paneldən idarə etməyinizə imkan tanıyır.' },
      { question: 'Offboarding modulu marka imicinə necə töhfə verir?', answer: 'Prosesin nizamlı, şəffaf və hörmətli şəkildə aparılması, işdən ayrılan işçidə müsbət təəssürat buraxır və şirkətin pozitiv marka qavrayışını gücləndirir.' },
    ],
  },
  'anket-modulu': {
    hero: {
      title: 'Sorğu Modulu',
      text: 'İşçilərin fikirlərini ən qısa yoldan öyrənin, sürətlə hərəkətə keçin!',
      ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/Anket1@2x.png', alt: 'Anket1@2x', width: 950, height: 1261 },
    },
    sections: [
      {
        title: 'Sorğularla müəssisənizin nəbzini tutun!',
        text: 'idenfit sorğu modulu ilə, işçilərə sistem üzərindən hazırlanıb göndərilən sorğu və rəy formaları ilə işçi fikir və görüşləri asan şəkildə toplana bilər və nəticələr istiqamətində daha doğru və sürətli qərarlar alına bilər.',
        ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/Anket3@2x.png', alt: 'Anket3@2x', width: 1080, height: 935 },
      },
      {
        title: 'Departament əsaslı və ya toplu nəticələrə çatın!',
        text:
          '<ul class="list gray"><li>idenfit sorğu modulunda menecerlər, sualları və cavab seçimlərini istədikləri kimi yarada bilərlər.</li><li>Sorğunu toplu tətbiq edə biləcəkləri kimi yalnız müəyyən departamentlərə də edə bilərlər. Beləliklə müəssisə daxilində departament əsaslı və ya toplu qərarları əks etdirən nəticələr əldə edilə bilər.</li><li>Sorğu nəticəsində çıxan məlumatlar geniş əhatəli hesabatlana bilər.</li></ul>',
        ctaText: 'Onlayn Təqdimat Tələbi', ctaUrl: DEMO_CTA_URL, image: null,
      },
    ],
    faq: [
      { question: 'İnsan resursları sorğu proseslərində idenfit necə dəstək olur?', answer: 'idenfit, insan resursları sorğu proseslərində sürətli məlumat toplama, seqment əsaslı təhlil və həssas məlumatları rəqəmsal mühitdə etibarlı saxlama kimi bir çox imkan təqdim edir.' },
      { question: 'İşçi məmnunluq sorğusu niyə edilir?', answer: 'Korporativ inkişaf mövzusunda doğru qərarlar almaq, işçi bağlılığını artırmaq və mümkün riskləri müəyyən etmək məqsədiylə tətbiq edilir.' },
      { question: 'İşçi sorğusu sualları necə müəyyənləşdirilməlidir?', answer: 'Şirkətin hədəfləri və işçi profilinin ehtiyacları istiqamətində xüsusi olaraq qurulmalıdır.' },
      { question: 'İşçi bağlılığı sorğusu ilə işçi məmnunluq sorğusu arasında fərq var mı?', answer: 'Bəli, hədəfləri fərqlidir. İşçi bağlılıq sorğusu işçinin quruma olan aidiyyətini ölçür. Bununla yanaşı işçi məmnunluq sorğu sualları ümumi təcrübə və məmnunluğa fokuslanır. İşçi geri bildirim sorğusu isə anlıq ehtiyac və təklifləri tutma imkanı təmin edir.' },
      { question: 'İşçi məmnunluq sorğusu hesabatı nələri əhatə edir?', answer: 'Personal məmnunluq səviyyələri və qurumda inkişaf etdirilməli sahələr haqqında xülasə və dəyərli məlumatlar təqdim edir.' },
      { question: 'İşçi məmnunluq sorğusu qiymətləndirməsi necə edilir?', answer: 'idenfit üzərindən toplanan cavablar, qrafik və cədvəl dəstəyi ilə işçi məmnunluq sorğusu təhlili şəklində işlənir. Beləliklə menecerlərə mənalı fikirlər təqdim olunur.' },
      { question: 'idenfit bir sorğu idarəetmə proqramı kimi istifadə oluna bilər mi?', answer: 'Bəli, istifadə oluna bilər. idenfit, sorğu yaratma, göndərmə, toplama və təhlil proseslərini tək platformada idarə etmə imkanı təqdim edən əhatəli bir insan resursları proqramıdır.' },
      { question: 'İnsan resursları sorğuları yalnız özəl sektorda mı tətbiq olunur?', answer: 'Xeyr, idenfit dövlət işçi sorğusu daxil olmaqla bütün qurum növlərinə uyğun bir infrastruktur təqdim edir.' },
    ],
  },
  'bordo-onay-modulu': {
    hero: {
      title: 'Əmək Haqqı Modulu',
      text: 'idenfit əmək haqqı modulu, bir çox əmək haqqı hesablama və ERP proqramları ilə ikitərəfli inteqrasiya olaraq işləyir!',
      ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/08/bordro1@2x.webp', alt: 'bordro1@2x', width: 1020, height: 1161 },
    },
    sections: [
      {
        title: 'ERP sistemləri ilə inteqrasiya',
        text:
          '<p>idenfit əmək haqqı modulu ilə,</p>\n<ul class="list gray"><li>İşçilərin əmək haqqı vərəqələri İnsan Resursları menyusundan, Əmək Haqqı bölməsi altında görüntülənə bilər.</li><li>Ay əsasında bütün əmək haqqı vərəqələri sistemə yüklənə bilər.</li></ul>',
        ctaText: 'Onlayn Təqdimat Tələbi', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/08/bordro2@2x.webp', alt: 'bordro2@2x', width: 998, height: 927 },
      },
      {
        title: 'Daxili ƏMƏK HAQQI Modulu',
        text:
          '<p>İdenfit & Datassist ilə,</p>\n<ul class="list gray"><li>Əmək haqqı prosesindəki davamiyyət hazırlığı, hesablama, bəyannamələrin hazırlanması və əmək haqqı bağlanışı kimi bütün prosesləri sistemdə müəyyən edə bilərsiniz.</li><li>idenfit vaxt idarəçiliyi modulu ilə avadanlıqlarınız inteqrasiya olaraq uyğun şəkildə işləyə bilər. Bu sayədə davamiyyət məlumatları ilə tək bir platformadan əmək haqqı yarada bilərsiniz.</li></ul>',
        ctaText: 'Ətraflı Məlumat Al', ctaUrl: DEMO_CTA_URL, image: null,
      },
    ],
    faq: [
      { question: 'İşçi maaş əmək haqqı hazırlıq proseslərində ən çox hansı addımlarda səhv edilir?', answer: 'Ümumiyyətlə əmək haqqı davamiyyət hesablama addımında problem yaşanır. idenfit ilə bu proseslər inteqrasiya olunmuş sistemlər sayəsində xətasız şəkildə həyata keçirilir.' },
      { question: 'Personal maaş əmək haqqını tənzimləyərkən əl ilə iş yükünü azaltmaq mümkün mü?', answer: 'Bəli, idenfit & Datassist ilə əmək haqqı hazırlama prosesində davamiyyət məlumatları avtomatik olaraq uyğunlaşır. Beləliklə əmək haqqı yaratma addımları daha sürətli və xətasız tamamlanır.' },
      { question: 'İnsan resursları əmək haqqı proseslərində idenfit necə töhfələr verir?', answer: 'Əmək haqqı idarəçiliyi, bəyannamə hazırlığı, icazə və iş saatı inteqrasiyası və əmək haqqı yoxlaması kimi addımlar idenfit ilə praktik, təhlükəsiz və standart hala gətirilə bilər.' },
      { question: 'ERP əmək haqqı sorğulama sistemi necə işləyir?', answer: 'ERP, müəssisənin bütün resurslarını inteqrasiya olunmuş şəkildə idarə edən rəqəmsal sistemdir. idenfit, ERP əmək haqqı xidmətləri proqramları ilə ikitərəfli inteqrasiya olaraq işləyərək məlumatların güncəl və nəzarət edilə bilən olmasını təmin edir.' },
    ],
  },
  'calisan-egitim-yonetimi-modulu': {
    hero: {
      title: 'Təlim İdarəçiliyi Modulu',
      text: 'idenfit ilə müəssisə daxili və xarici təlim prosesi & nəticələrini problemsiz idarə edirsiniz.',
      ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/Eğitim1@2x.png', alt: 'Eğitim1@2x', width: 1076, height: 1339 },
    },
    sections: [
      {
        title: 'Təlimə qatılımları idenfit üzərindən izləyin!',
        text:
          '<p>İşçilərin həqiqətən fiziki iştirak tələb edən təlimlərə qatılıb-qatılmadığının izlənməsi,</p>\n<ul class="list gray"><li>Fiziki təlimlərə və ya saha təlimlərinə qatılım beacon və gps texnologiyaları ilə mobil cihaz üzərindən nəzarət oluna bilər.</li><li>Qatılımlar sistem üzərində sessiya kimi müəyyən saatlarda təyin edilə bilər və bu vəziyyətdə mobil cihaz üzərindən daxil edilən saatlar və məlumatlar da real zamanlı olacaq.</li></ul>',
        ctaText: 'Ətraflı Məlumat Al', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/Eğitim2@2x.webp', alt: 'Eğitim2@2x', width: 1115, height: 1336 },
      },
      {
        title: 'Təlimlərinizi idenfit ilə planlayın!',
        text:
          '<p>idenfit təlim idarəçiliyi modulu ilə,</p>\n<ul class="list gray"><li>Müəssisə daxili və xarici təlimlər planlana bilər.</li><li>Təlimlər kateqoriyalara ayrıla bilər və hesabatlana bilər.</li><li>Sistemə təlimçi, iştirakçı və təlim məzmunu təyin edilə bilər.</li></ul>',
        ctaText: 'Ətraflı Məlumat Al', ctaUrl: DEMO_CTA_URL, image: null,
      },
    ],
    faq: [
      { question: 'idenfit bir təlim idarəetmə sistemi olaraq necə işləyir?', answer: 'idenfit təlim idarəçiliyi modulu ilə daxili və xarici bütün təlim prosesləri zəhmətsizcə planlana bilər. İştirakçılar, təlim məzmunları və təlimçi məlumatları sistem üzərindən idarə olunur və hesabatlanır.' },
      { question: 'Təlimlərə qatılım rəqəmsal mühitdə necə doğrulanır?', answer: 'Fiziki təlimlərdə iştirak, mobil cihazlar vasitəsilə GPS və beacon texnologiyaları ilə nəzarət oluna bilər. Sessiya əsaslı təyin edilən təlim saatlarına görə edilən girişlər sistemlə uyğunlaşır və qatılım məlumatları real zamanlı olaraq qeyd edilir.' },
    ],
  },
  'calisan-ozluk-yonetimi-modulu-2': {
    hero: {
      title: 'Şəxsi fayl modulu',
      text: 'idenfit ilə şəxsi faylları rəqəmsal mühitdə güncəl və tam şəkildə etibarlı saxlayın.',
      ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/09/1@2x.png', alt: 'şəxsi fayl modulu', width: 913, height: 1281 },
    },
    sections: [
      {
        title: 'Güncəl və tam şəxsi fayl saxlayın!',
        text: '', ctaText: 'Ətraflı Məlumat Al', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/09/3@2x.png', alt: 'güncəl şəxsi fayl', width: 940, height: 1281 },
      },
      {
        title: 'Şəxsi məlumatlarınız biometrik imza ilə təhlükəsizdir!',
        text:
          '<p>İş Qanununun 75-ci maddəsinə əsasən işəgötürənlər, işə götürülən hər personal üçün şəxsi fayl saxlamağa məcburdur. Zərurət olduğu halda bu sənədləri səlahiyyətli şəxslərə göstərməklə öhdəlidir.</p>\n<p>idenfit şəxsi fayl modulu ilə, işçiyə aid; əmək müqaviləsi, işə qəbul və icazə sənədləri, maliyyə sənədləri, işləmə müddətində aldığı sənədlər, təyinat və iş saatı formaları kimi bütün rəsmi sənəd və qeydləri onlayn sistemdə biometrik imza ilə təsdiqlənmiş olaraq saxlaya bilərsiniz.</p>',
        ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/09/2@2x.png', alt: 'biometrik imza', width: 1129, height: 902 },
      },
      {
        title: 'Şəxsi Məlumatların Qorunması Qanununa uyğun şəkildə məlumatları saxlayın!',
        text:
          '<ul class="list gray"><li>Şəxsi Məlumatların Qorunması Qanunu qaydalarına əsasən işçilərin şəxsi məlumatları sistemdə, işçi mənafeləri istiqamətində anonimləşdirilmiş olaraq saxlanılır.</li><li>Şəxsi faylların rəqəmsal mühitdə qanunvericiliyə uyğun olaraq yaradılması həm işəgötürən, həm də insan resursları departamenti işçiləri üçün vaxt və xərc qənaəti təmin edir.</li></ul><p>İşçilərlə əlaqədar bütün məlumatlara mobil və ya veb üzərindən, internetin olduğu hər an və hər yerdən çatıla bilər.</p>',
        ctaText: 'Onlayn Təqdimat Tələbi', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/09/4@2x.png', alt: 'Şəxsi Məlumatların Qorunması Qanununa uyğun saxlama', width: 1099, height: 1166 },
      },
    ],
    faq: [
      { question: 'idenfit ilə rəqəmsal şəxsi fayl necə saxlanılır?', answer: 'İşçilərə aid müqavilə, icazə formaları, vəzifə sənədləri kimi bütün şəxsi fayl sənədləri sistemdə qanunvericiliyə uyğun şəkildə saxlanılır və hər an əlçatan vəziyyətdə tutulur.' },
      { question: 'Personal şəxsi fayl izləməsi niyə rəqəmsal mühitə daşınmalıdır?', answer: 'Kağız sənədlərlə məşğul olmaq vaxt itirir. Şəxsi fayl idarəçiliyi, rəqəmsal sistemdə həm daha təhlükəsiz, həm də daha sürətli aparılır.' },
      { question: 'İşçi şəxsi faylı hansı məlumatları əhatə edir və necə tənzimlənir?', answer: 'İşə qəbul sənədləri, maaş və icazə tarixçəsi, güncəl məlumatlar kimi bütün işçi şəxsi fayl verilənləri sistemdə saxlanılır, ehtiyac duyulan sahələr üçün xüsusi sahə təyinatları da edilə bilər.' },
      { question: 'Şəxsi Məlumatların Qorunması Qanununa şəxsi fayl qaydalarına uyğunluq necə təmin edilir?', answer: 'idenfit, şəxsi məlumatların qorunması qanunvericiliyinin şəxsi fayl tənzimləmələrinə tam uyğun işləyir. Personal şəxsi fayl sənədləri mövzusunda səlahiyyətsiz giriş qarşısı alınır və məlumat təhlükəsizliyi qorunur.' },
    ],
  },
  'calisan-performans-degerlendirme-sistemi-modulu': {
    hero: {
      title: 'Performans İdarəçiliyi Modulu',
      text: 'Doğru performans qiymətləndirməsi ilə işçilərinizin inkişafına sürət qazandırın!',
      ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/tr_ilk_resim@2x.jpg', alt: 'tr ilk resim@2x', width: 927, height: 1281 },
    },
    sections: [
      {
        title: 'Hədəflər & Bacarıqlar',
        text:
          '<p>idenfit performans idarəçiliyi modulunda, performans şablonu seçimi ilə, panelə hədəf (kpi) və bacarıqlar (competence) təyin edə bilərsiniz.</p>\n<p>Bacarıqlar bölməsinə korporativ, peşəkar, sosial, liderlik, təşkilat bacarığı kimi istədiyiniz qədər fərqli qrupda bacarıq, eyni şəkildə hədəflər bölməsinə departamentinizin müəyyən etdiyi (satış hədəfləri, müştəri məmnunluğu…) hədəfləri fərqli başlıqlar altında təyin edə bilərsiniz. Ölçmək istədiyiniz dəyər, hədəf və bacarıq hovuzundan seçilə bildiyi kimi hovuzda olmayan bir maddə də əlavə edə bilərsiniz.</p>',
        ctaText: 'Satış Komandası ilə Görüşün', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/performans2@2x.png', alt: 'performans2@2x', width: 1099, height: 955 },
      },
      {
        title: '360 Dərəcə Performans Qiymətləndirməsi',
        text:
          '<p>idenfit performans qiymətləndirmə modulu, ənənəvi metodlardan fərqli olaraq, performans qiymətləndirmələrini dövri zaman dilimlərində KPI (Əsas Performans Göstəricisi) yaradacaq şəkildə etməyinizə imkan verir.</p>\n<p>Performans qiymətləndirməsi bir-bir edilə biləcəyi kimi; astı, özü, bərabəri və üstü tərəfindən qiymətləndirilmə imkanı təqdim edərək performans qiymətləndirməsini 360 dərəcə edir. 360 dərəcə performans qiymətləndirməsi işçilərinizin real performanslarını hesablayaraq ədalətli bir proses idarə etməyinizə kömək edir.</p>',
        ctaText: 'Ətraflı Məlumat Al', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/performans3@2x.png', alt: 'performans3@2x', width: 1202, height: 988 },
      },
      {
        title: 'İşçiləriniz hədəflərinə çatsın!',
        text:
          '<p>idenfit ilə performans qiymətləndirməsi edərkən, ənənəvi metodlarla hazırlanan, mürəkkəb cədvəllərlə məşğul olmaq məcburiyyətində qalmırsınız.</p>\n<p>Şəxslərlə əlaqədar davamlı güncəllənən performans dəyərlərini, dövrlər əsasında KPI-lar daxilində, hədəf və bacarıqlar şablonunda bir arada görərək qiymətləndirə bilərsiniz.</p>',
        ctaText: 'Onlayn Təqdimat Tələbi', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/performans4@2x.png', alt: 'performans4@2x', width: 1095, height: 854 },
      },
      {
        title: 'Nəticələrə görə təlim planlayın!',
        text:
          '<p>idenfit, performans qiymətləndirməsinin ötəsində, çıxan nəticələrə görə tədbir görməyinizə də imkan verir. Müəyyən edilmiş dövrlərdə, hədəf və bacarıqlar qiymətləndirməsi nəticələrinə görə işçilərinizi mükafatlandıra və ya performansda təkmilləşdirmə lazımdırsa təlim yönləndirməsi edə bilərsiniz.</p>\n<p>Idenfit-in, istifadəçilərinə təqdim etdiyi, hazır və fərdiləşdirilə bilən performans qiymətləndirmə paneli ilə insan resursları idarəçiliyində, vaxta qənaət təmin edərkən komandanızın performansını və iş səmərəliliyini də real məlumatlarla ölçürsünüz.</p>',
        ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/tr_son_resim@2x.jpg', alt: 'tr son resim@2x', width: 1347, height: 1228 },
      },
    ],
    faq: [
      { question: 'idenfit performans qiymətləndirmə ölçüsü nədir?', answer: 'idenfit, müəssisənizə xas hədəf əsaslı performans və bacarıq qiymətləndirmə sistemi təqdim edir. Performans qiymətləndirmə ölçüləri, KPI-lar və bacarıq qrupları üzərindən fərdiləşdirilə bilər.' },
      { question: 'Performans qiymətləndirmə metodları arasında idenfit hansı sistemi istifadə edir?', answer: 'idenfit, ənənəvi metodların ötəsində dövr əsaslı KPI yaratma və 360 dərəcə performans qiymətləndirmə metodlarını dəstəkləyir. Ayrıca bir-bir qiymətləndirmə imkanı da təqdim edir.' },
      { question: 'Performans qiymətləndirmə nümunələri idenfit sistemində yer alır mı?', answer: 'Bəli. Hədəf və bacarıq hovuzuna müəssisənizə uyğun meyarlar əlavə edə, sektora xas qiymətləndirmə nümunələrini sistemə inteqrasiya edə bilərsiniz. Hovuzda olmayan maddələr əl ilə təyin edilə bilər.' },
      { question: 'Performans idarəçiliyi prosesi necə işləyir?', answer: 'idenfit performans idarəçiliyi modulu ilə performans şablonu seçilir, hədəflər (KPI) və bacarıqlar təyin edilir. Dövrlərin sonunda məlumatlar tək paneldə qiymətləndirilir və çıxan nəticələrə görə tədbir görülür.' },
      { question: '360 dərəcə performans qiymətləndirməsi nədir?', answer: '360 dərəcə performans qiymətləndirməsi, işçinin astısı, üstü, bərabər səviyyəli işçiləri və özü tərəfindən qiymətləndirilməsini əhatə edir.' },
      { question: 'Performans qiymətləndirmə və nəzarət prosesinin mərhələləri nələrdir?', answer: 'idenfit-də proses; hədəf və bacarıqların müəyyən edilməsi, dövr əsaslı ölçmə, nəticələrin hesabatlanması və inkişaf planlaması şəklində işləyir. Bütün mərhələlər tək paneldən izlənə bilər.' },
      { question: 'idenfit 360 dərəcə performans qiymətləndirmə sistemini necə dəstəkləyir?', answer: 'idenfit, veb əsaslı və mobil girişli strukturu ilə fərqli mənbələrdən gələn geri bildirimləri toplayır. KPI-lar, bacarıqlar və dövr əsaslı məlumatlar eyni şablonda təhlil edilir.' },
      { question: 'Performans qiymətləndirmə meyarları necə müəyyənləşdirilir?', answer: 'Departament hədəfləri (məs. satış, müştəri məmnunluğu) və bacarıq qrupları üzərindən müəyyənləşdirilir. Ölçmək istədiyiniz meyarlar hovuzdan seçilə bilər və ya yeni maddələr əlavə edilə bilər.' },
    ],
  },
  'demirbas-yonetimi-modulu': {
    hero: {
      title: 'Əsas vəsaitləri rəqəmsal mühitə daşıyın, nəzarəti asanlaşdırın!',
      text: 'Müəssisənizin sahib olduğu bütün əsas vəsaitləri tək bir paneldə izləmək istəyirsiniz? idenfit Əmlak İdarəçiliyi Modulu, əsas vəsaitlərinizi rəqəmsallaşdıraraq qeydiyyat, izləmə və idarəçilik proseslərini sadələşdirir.',
      ctaText: '', ctaUrl: '',
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/08/hero-demirbaş-tr.png', alt: 'hero demirbaş tr', width: 1137, height: 1260 },
    },
    sections: [
      {
        title: 'idenfit Əmlak Modulu ilə:',
        text:
          '<ul class="list gray"><li>Müəssisənizin sistemdə qeydiyyatlı bütün əsas vəsaitlərini modul üzərindən təyin edə bilərsiniz.</li><li>Hər bir əsas vəsait üçün əmlak təyinatları asanlıqla edilə bilər.</li><li>Əsas vəsaitlərin satın alınma tarixləri, zəmanət müddətləri, seriya nömrələri və model məlumatları sistemə daxil edilə bilər.</li><li>Bütün bu məlumatlar zaman damğası ilə qeyd altına alınır, geriyə dönük izlənə bilənlik təmin edilir.</li><li>Əsas səhifədən Əmlak sekmesinə klikləyərək bütün detallara ani çata bilərsiniz.</li></ul><p>Bu modul, əmlak idarəçiliyini həm şəffaf, həm də səmərəli hala gətirərək vaxta qənaət təmin edir. İster kiçik miqyaslı, ister böyük miqyaslı bir müəssisə olun, rəqəmsallaşdırılmış əsas vəsait izləməsi ilə prosesi təminat altına alırsınız.</p>',
        ctaText: '', ctaUrl: '', image: { url: 'https://idenfit.com/wp-content/uploads/2025/08/web-demirbaş-tr.png', alt: 'web demirbaş tr', width: 1092, height: 1032 },
      },
    ],
    faq: [],
  },
  'dokuman-yonetim-sistemi-modulu': {
    hero: {
      title: 'Sənədlər Modulu',
      text: 'Ortaq girişə açıq, anonim sənədləri işçilərinizin istifadəsinə təqdim edin.',
      ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/dokümanlar1@2x.webp', alt: 'dokümanlar1@2x', width: 1220, height: 1332 },
    },
    sections: [
      {
        title: 'Anonim sənədlər üçün sənədlər modulu!',
        text: '', ctaText: 'Onlayn Təqdimat Tələbi', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/dokümanlar2@2x.webp', alt: 'dokümanlar2@2x', width: 1129, height: 731 },
      },
      {
        title: 'Sənədləri asanlıqla yükləyin!',
        text:
          '<p>Idenfit sənədlər modulu ilə,</p>\n<ul class="list gray"><li>Müəssisə daxilində anonim olaraq saxlanılmaq istənən (şirkət daxili nizamnaməsi, müqavilə nümunələri, təlim sənədləri…) sənəd və vəsiqələr sistemə yüklənə bilər.</li><li>Sənədlər, sənəd siyahısı və sənəd növləri altında qruplaşdırıla bilər.</li></ul><p>Müəssisənin anonim olaraq saxladığı, hər kəsin girişinə açıq sənədlərinizi sistemə asanlıqla yükləyin və paylaşıma təqdim edin!</p>',
        ctaText: 'Satış Komandası ilə Görüşün', ctaUrl: DEMO_CTA_URL, image: null,
      },
    ],
    faq: [
      { question: 'Sənəd idarəetmə sistemi istifadə etmək niyə vacibdir?', answer: 'Sənəd idarəçiliyi sistemləri, sənədlərin rəqəmsal mühitdə saxlanılmasına imkan tanıyır, giriş və güncəlləmə proseslərini asanlaşdırır. Bu sayədə əmək və vaxt itkisinin qarşısını alır.' },
      { question: 'idenfit bir sənəd izləmə sistemi olaraq istifadə oluna bilər mi?', answer: 'Bəli istifadə oluna bilər. Müəssisə daxilində paylaşıma açıq sənədlər sistemə yüklənə bilər, işçilər bu sənədlərə veb və ya mobil tətbiq üzərindən çata bilər və bütün proses mərkəzi olaraq izlənə bilər.' },
      { question: 'Elektron sənəd idarəetmə sistemi ilə hansı növ sənədlər sistemə yüklənə bilər?', answer: 'Şirkət daxili nizamnaməsi, müqavilə nümunələri, təlim qeydləri kimi sənədlər sistemə əlavə edilə bilər.' },
      { question: 'idenfit sənəd idarəetmə proqramı digər sənəd idarəetmə proqramı alternativlərindən necə fərqlənir?', answer: 'Mobil və veb girişi ilə istifadəçi dostu bir interfeys təqdim edir. Klassik sənəd sistemləri yerinə, dinamik bir sənəd idarəetmə sistemi proqramı təcrübəsi yaşadır. Bütöv insan resursları proqramı sayəsində bütün İRİ proseslərini tək paneldə bir araya gətirir.' },
    ],
  },
  'isyeri-saglik-yonetimi-modulu': {
    hero: {
      title: 'Sağlamlıq Modulu',
      text: 'Sağlamlıq laqeyd yanaşılmır, işçilərinizin sağlamlığından xəbərdar olun! idenfit sağlamlıq modulu, işçilərinizin sağlamlıq vəziyyətlərini və varsa xüsusi şərtlərini asanlıqla izləyə bilməyinizə və məlumatlar istiqamətində qeyri-adi baş verə biləcək vəziyyətləri idarə etməyinizə kömək edir.',
      ctaText: '', ctaUrl: '',
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/08/sağlik1@2x.png', alt: 'sağlik1@2x', width: 889, height: 1281 },
    },
    sections: [
      {
        title: 'Təcili müdaxilədə sistemdəki məlumatlardan faydalanın!',
        text:
          '<p>Əksər müəssisə, işə qəbul edərkən işçilərindən sağlamlıq hesabatı, xüsusi vəziyyət hesabatı kimi qurum təsdiqli sənədlər tələb edə bilər. Bəzən də işlənilən vəzifənin tələb etdiyi vəziyyətlərdə işçilərin keçirdiyi əməliyyatlar, müntəzəm istifadə etdiyi dərmanlar, varsa allergiya məlumatlarının da müəssisəyə bildirilməsi tələb edilə bilər.</p>\n<p>Sağlamlıq məlumatları, işçilərin icazələri istiqamətində sistemə daxil edilib, ola biləcək hər hansı bir sağlamlıq probleminidə, təcili vəziyyətlərdə şəxsə uyğun müdaxilə məqsədilə istifadə edilir.</p>',
        ctaText: 'Əlaqəyə Keçin', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/08/sağlik3@2x.png', alt: 'sağlik3@2x', width: 952, height: 1261 },
      },
      {
        title: 'İşçilərinizin sağlamlıq məlumatlarını asanlıqla izləyin!',
        text:
          '<p>idenfit sağlamlıq modulu ilə,</p>\n<ul class="list gray"><li>İşçilərdən alınacaq yazılı icazə və ya öz istəkləri daxilində o şəxslərə aid sağlamlıq vəziyyətləri və keçmişləri, keçirilən əməliyyatlar, müntəzəm istifadə edilən dərmanlar kimi məlumatlar sistemə işlənə bilər.</li><li>Lazım olan vəziyyətlərdə bu şəxslərə ediləcək müdaxilələrin uyğunluğu baxımından, bu məlumatlar qeyd altında tutula bilər.</li><li>İşçilərin sağlamlıq vəziyyətləri, istifadə etdikləri dərmanlar, sağlamlıqla əlaqədar xüsusi vəziyyətləri, qısacası bütün sağlamlıq keçmiş məlumatları sistemdə saxlanıla bilər və təcili müdaxilədə bu məlumatlardan faydalanıla bilər.</li></ul>',
        ctaText: 'Onlayn Təqdimat Tələbi', ctaUrl: DEMO_CTA_URL, image: null,
      },
    ],
    faq: [
      { question: 'Sağlamlıq izləmə sistemi nədir, niyə vacibdir?', answer: 'İşçilərin sağlamlıq məlumatlarını etibarlı şəkildə saxlamağa və lazım olduqda sürətli girişlə doğru müdaxiləyə imkan tanıyan rəqəmsal bir sistemdir.' },
      { question: 'idenfit sağlamlıq idarəçiliyi modulu sağlamlıq izləmə sistemi kimi istifadə oluna bilər mi?', answer: 'Bəli istifadə oluna bilər. İşçilərin əməliyyat keçmişindən müntəzəm dərman istifadəsinə qədər bütün sağlamlıq məlumatları sistem üzərindən izlənə bilər.' },
    ],
  },
  'masraf-yonetimi-modulu': {
    hero: {
      title: 'Xərclər Modulu',
      text: 'Xərcləri; xərc növləri, avanslar və ezamiyyət haqları başlıqları altında kateqoriyalaşdıraraq idarə edin.',
      ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/harcamalar-1.webp', alt: 'harcamalar 1', width: 488, height: 621 },
    },
    sections: [
      {
        title: 'Xərcləri mobildən anlıq idarə edin!',
        text: '', ctaText: 'Satış Komandası ilə Görüşün', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/2@2x-1.webp', alt: '2@2x 1', width: 1364, height: 1228 },
      },
      {
        title: 'Xərclər arasında itməyin!',
        text:
          '<p>idenfit xərclər modulu ilə,</p>\n<ul class="list gray"><li>Müəssisə daxilində və ya xaricində edilən bütün xərclər, məsrəflər real zamanlı olaraq sistemə qeyd edilir və müntəzəm olaraq izlənə bilər.</li><li>İşçi və ya departament əsaslı xərclər, qəbz, faktura və ya çek fotoşəkillərinin çəkilib sistemə yüklənməsi ilə mobildən idarə oluna bilər.</li><li>Edilən xərclərlə əlaqədar sənədlər səlahiyyətlilərə çatdırılıb təsdiqləri alına bilər.</li><li>Səlahiyyətlilərin təsdiq verməmə – xərc tələbini rədd etmə hüququ saxlanılır.</li><li>Axtarılan xərc çoxlu filtrasiya xüsusiyyəti ilə vaxt itirmədən sistem üzərində tapıla bilər.</li></ul>',
        ctaText: 'Ətraflı Məlumat Al', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/4@2x.webp', alt: '4@2x', width: 1098, height: 801 },
      },
      {
        title: 'Xərcləri, avans və ezamiyyət haqqından ayrı-ayrı düşün!',
        text:
          '<p>idenfit xərclər modulu ilə, şirkət daxilindəki xərclər ödəniş mənbəyinə görə kateqoriyalaşdırılaraq sistemə qeyd edilə bilər.</p>\n<ul class="list gray"><li>Xərc siyahısı və xərc növləri ayrı olaraq saxlanıla bilər.</li><li>Ezamiyyət haqqı və avanslar sistemdə ayrı-ayrı saxlanılaraq ödənişlərdəki qarışıqlıqların qarşısı alınır.</li><li>Sistem üzərində, işçilər üçün müəyyən bir ezamiyyət haqqı limiti təyin edilə bilər və işçinin etdiyi xərclər bu ezamiyyət haqqı limitindən avtomatik olaraq düşülür. Limit bitdikdə sistemdən avtomatik bildiriş alınaraq ezamiyyət haqqı əlavəsi edilə bilər.</li><li>Avans alan işçilərin nə qədər avans aldıqları məlumatını təmin edən xərclər modulu, əmək haqqı hazırlanarkən köməkçi modul kimi istifadə oluna bilər.</li></ul>',
        ctaText: 'Onlayn Təqdimat Tələbi', ctaUrl: DEMO_CTA_URL, image: null,
      },
    ],
    faq: [
      { question: 'idenfit bir xərc idarəetmə sistemi olaraq istifadə oluna bilər mi?', answer: 'Bəli istifadə oluna bilər. Şirkət daxili və şirkət xarici bütün xərclər idenfit ilə anlıq olaraq izlənir, sistem üzərindən sənəd və təsdiq axınları praktik şəkildə idarə olunur.' },
      { question: 'Xərc idarəçiliyi prosesləri niyə rəqəmsallaşmalıdır?', answer: 'Əl ilə izlənən xərclər vaxt itkisi və xəta riskini artırır. Rəqəmsal xərc idarəçiliyi həlləri ilə sürət, şəffaflıq və nəzarət asanlığı təmin edilir.' },
      { question: 'Xərc idarəetmə proqramı istifadə etmədən xərcləri izləmək mümkün mü?', answer: 'Mümkündür, lakin xərc idarəetmə tətbiqləri ilə avans, ezamiyyət haqqı və xərc sənədləri tək paneldə toplanır. Beləliklə proses çox daha səmərəli və praktik aparılır.' },
      { question: 'Bütün xərc idarəçiliyi prosesləri tək bir tətbiqdən idarə oluna bilər mi?', answer: 'Bəli, idenfit bir xərc idarəetmə proqramı rolunu üzərinə götürərək avans, ezamiyyət haqqı, xərc sənədi və təsdiq proseslərini tək bir ekranda başdan-başa idarə etməyinizi təmin edir.' },
    ],
  },
  'kurumsal-takvim-modulu': {
    hero: {
      title: 'Şirkət təqvimi',
      text: 'Müəssisə daxili tədbirləri, görüşləri və xatırlatmaları idenfit şirkət təqvimi üzərində yaradaraq komandanızla paylaşın!',
      ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/şirket-tak.1@2x.png', alt: 'şirket tak.1@2x', width: 1016, height: 1168 },
    },
    sections: [
      {
        title: 'Tədbir Yaradın',
        text: '', ctaText: 'Satış Komandası ilə Görüşün', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/şirket-tak.webp', alt: 'şirket tak', width: 1019, height: 820 },
      },
      {
        title: 'Vaxtı İdarə Edin',
        text: 'Şirkət təqvimi üzərində gündəlik proqramınızı, təyin edilən tədbirləri, tədbir zaman aralığını və bu tədbirlərə kimlərin qatıldığı, sessiya növü kimi detallı məlumatları da görüntüləyə bilərsiniz. Şirkət təqviminə həm mobil tətbiqdən, həm də fərdi veb ekranından (https://my.idenfit.com) giriş təmin edə bilərsiniz.',
        ctaText: 'Onlayn Təqdimat Tələbi', ctaUrl: DEMO_CTA_URL, image: null,
      },
    ],
    faq: [
      { question: 'idenfit bir tədbir idarəetmə proqramı olaraq istifadə oluna bilər mi?', answer: 'Bəli istifadə oluna bilər. Bütün görüş və tədbirlər idenfit şirkət təqviminə qeyd edilə bilər. Xatırlatmalar, iştirakçılar və sessiya detalları tək ekrandan idarə oluna bilər.' },
      { question: 'Korporativ təqvim istifadəsi komanda daxili koordinasiyaya necə təsir edir?', answer: 'Idenfit şirkət təqvimi sayəsində komanda üzvləri gündəlik və həftəlik planlamanı eyni platformadan görərək zamanlamanı ortaq və praktik şəkildə həyata keçirə bilər. Beləliklə ünsiyyət kəsintilərinin və üst-üstə düşən proqramların qarşısı alına bilər.' },
    ],
  },
  'ofis-ici-mesajlasma-modulu': {
    hero: {
      title: 'Mesaj Modulu',
      text: 'İşçilər arası bütün mesajlaşmaları və departament daxili toplu elanları idenfit ilə edin!',
      ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/mesajlar1@2x.png', alt: 'mesajlar1@2x', width: 1308, height: 1241 },
    },
    sections: [
      {
        title: 'İşçilər arası "chat" mesajlaşma sistemi',
        text: 'İşçilər mobil tətbiqdə, istəsələr fərdi olaraq, istəsələr mesajlaşma qrupları yaradaraq "chat" sistemi ilə mesajlaşa bilərlər. Beləliklə müəssisə daxili məlumatlar fərqli platformalara daşınmaq məcburiyyətində qalmır.',
        ctaText: 'Onlayn Təqdimat Tələbi', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/mesajlar2@2x.png', alt: 'mesajlar2@2x', width: 1067, height: 955 },
      },
      {
        title: 'idenfit üzərindən mesajlaşmaq sürətli və asandır!',
        text:
          '<p>idenfit mesajlar modulu ilə,</p>\n<ul class="list gray"><li>Görüşmə qeydləri və mühüm inkişaflar anında komanda ilə paylaşıla bilər.</li><li>Sms, e-poçt, tətbiq bildirişi formatındakı mesajlar departament əsaslı bütün işçilərə toplu olaraq və ya filtrasiya xüsusiyyəti ilə yalnız seçilən işçilərə göndərilə bilər.</li><li>Müəssisə ilə əlaqədar və ya ümumi olaraq bütün bildirişlər, eyni zamanda sistem üzərindən toplu elan xarakterli göndərilə bilər.</li><li>Ofis daxilində və ya xaricində olan işçilərlə effektiv şəkildə və vaxt itkisi olmadan ünsiyyət qurulması hədəflənir.</li></ul>',
        ctaText: 'Satış Komandası ilə Görüşün', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/mesajlar4@2x.png', alt: 'mesajlar4@2x', width: 1113, height: 967 },
      },
      {
        title: 'Vebdən sms, e-poçt və bildiriş mesajları göndərin!',
        text:
          '<p>Vebdən mesajlar, sms, e-poçt, tətbiq bildirişi formatındakı mesaj növlərindən biri seçilərək, fərdi olaraq müəyyən etdiyiniz şəxsə və ya birdən çox işçiyə toplu olaraq göndərilə bilər. Mesaj başlığı, mesaj məzmunu və mesajın əhəmiyyət dərəcəsi kimi məlumatlar da sistemə daxil edilə bilər.</p>\n<p>Müəssisə ilə əlaqədar və ya ümumi olaraq bütün bildirişlər, eyni zamanda bütün işçilərə sistem üzərindən toplu olaraq, elan xarakterli göndərilə bilər.</p>',
        ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL, image: null,
      },
    ],
    faq: [
      { question: 'idenfit şirkət daxili ünsiyyət üçün istifadə oluna bilər mi?', answer: 'Bəli istifadə oluna bilər. idenfit, şirkət daxili ünsiyyət proseslərini tək platformada toplayır. Həm bir-bir şirkət daxili chat xüsusiyyəti ilə, həm də departament əsaslı toplu elanlarla bütün komandalarla asanlıqla ünsiyyət qura bilərsiniz.' },
      { question: 'Ofis daxili anlıq mesajlaşma tətbiqi olaraq idenfit kifayətdir mi?', answer: 'idenfit, fərdi və toplu mesajlar üçün hazırlanmış şirkət daxili anlıq mesajlaşma proqramı infrastrukturuna malikdir. E-poçt və telefon trafikinə ehtiyac qalmadan, işçilər öz aralarında və ya menecerləri ilə anlıq olaraq yazışa bilər.' },
      { question: 'idenfit şirkət daxili messenger olaraq necə işləyir?', answer: 'idenfit-in mesajlaşma modulu, bir şirkət daxili chat proqramı kimi işləyir. Veb üzərindən və ya mobil tətbiqdən SMS, e-poçt və mobil bildiriş seçimləri ilə mesajlar göndərilə bilər, məzmun fərdiləşdirilə bilər.' },
      { question: 'Ən təhlükəsiz anlıq mesajlaşma tətbiqləri arasında idenfit niyə öndədir?', answer: 'Məlumatlar bulud infrastrukturunda və səlahiyyətləndirmə sistemi ilə qorunur. Bu sayədə idenfit, ən təhlükəsiz anlıq mesajlaşma tətbiqi meyarlarını qarşılayır. Məlumatlar xarici platformalara daşınmadan təhlükəsizliklə sistemdə qalır.' },
      { question: 'idenfit ilə ofis daxili anlıq mesajlaşma edilə bilər mi?', answer: 'Bəli. İdenfit, ofis daxili anlıq mesajlaşma ehtiyacını qarşılamaqla qalmır, eyni zamanda şirkət daxili ünsiyyət proqramı olaraq da bütün elan və məlumatlandırma proseslərini mərkəzləşdirir.' },
    ],
  },
  'organizasyonel-geri-bildirim-modulu': {
    hero: {
      title: 'Geri Bildirim Modulu',
      text: 'İşçilərdən alınan geri bildirimlərlə, müəssisə daxili motivasiyanı artırın.',
      ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/geri-bildirim1@2x.png', alt: 'geri bildirim1@2x', width: 1203, height: 1305 },
    },
    sections: [
      {
        title: 'Hesabatlarla işçi məmnunluğunu qiymətləndirin!',
        text: 'idenfit geri bildirim modulu ilə, daha xoşbəxt bir müəssisə üçün işçi məmnunluğu real məlumatlarla ölçülür. İşçilərin sistemə daxil etdiyi cavablar təhlil və hesabat halında ətraflı olaraq görüntülənə bilər. Zaman əsaslı olaraq müqayisə (keçən ay və ya keçən həftə…) edilə bilər. Müəssisədə hansı sahələr və ya mövzular işçiləri məmnun edir və ya hansılarında təkmilləşdirmə edilməlidir kimi mövzular, məlumatlar işığında qiymətləndirilə bilər.',
        ctaText: 'Satış Komandası ilə Görüşün', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/geri-bildirim2@2x.webp', alt: 'geri bildirim2@2x', width: 1161, height: 773 },
      },
      {
        title: 'Xoşbəxt işçilər üçün geri bildirimdən faydalanın!',
        text:
          '<p>idenfit geri bildirim modulu ilə,</p>\n<ul class="list gray"><li>İşçilər anlıq və ya gündəlik əhval-ruhiyyələrini əyləncəli bir dizayn üzərindən seçə bilərlər.</li><li>Menecerlər istənilən sualları özləri yarada biləcəkləri kimi cavabları da təyin edə bilərlər.</li><li>Menecerlər seçilən nəticələri şəxs əsasında görüntüləyə bilər və lazımi təkmilləşdirmələri şəxslər üzərindən və ya komanda olaraq edə bilərlər.</li><li>Bu səsvermələr nəticəsində, insan resursları əsas səhifəsində bütün işçilərin xoşbəxtlik və ya narazılıq nisbəti kimi toplu məlumatlara çatıla bilər.</li></ul>',
        ctaText: 'Satış Komandası ilə Görüşün', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/geri-bildirim4@2x.png', alt: 'geri bildirim4@2x', width: 1111, height: 747 },
      },
      {
        title: 'işçilərinizlə ünsiyyətdə qalın!',
        text:
          '<p>Uğurlu müəssisələrin ən mühüm mənbəyi xoşbəxt və məmnun işçilərdir. Menecerlərin işçilərlə davamlı ünsiyyətdə qalması və işçilərin əhval-ruhiyyəsini əhəmiyyətli hesab etdiyini göstərməsi, işçi tərəfində dəyər hissi yaradaraq işçi məmnunluğuna birbaşa təsir edir.</p>\n<p>İşçilərə müəyyən zamanlarda soruşulan suallarla və çoxlu cavab seçmə imkanı ilə müəssisədə sürətli şəkildə işçi əhval-ruhiyyəsi / vəziyyət təhlili edilə bilər. Nəticələrə görə təkmilləşdirmələr, komanda işi və sosial tədbirlər planlana bilər.</p>',
        ctaText: 'Əlaqəyə Keçin', ctaUrl: DEMO_CTA_URL, image: null,
      },
    ],
    faq: [
      { question: 'İşçi geri bildirim sorğusu prosesi idenfit üzərindən necə idarə olunur?', answer: 'Menecerlər, idenfit geri bildirim modulu ilə işçilərə xüsusi sorğular hazırlaya, gələn cavabları şəxs və ya komanda əsaslı görüntüləyərək məmnunluq yönümlü tədbirlər planlaya bilər.' },
      { question: 'Geri bildirim modulu ilə əldə edilən məlumatlar necə istifadə olunur?', answer: 'Toplanan cavablar təhlil edilərək işçi məmnunluğu, motivasiya səviyyəsi və komanda dinamikaları haqqında zaman əsaslı hesabatlar yaradılır. Bu məlumatlar işığında təkmilləşdirmə tədbirləri görülə bilər.' },
    ],
  },
  'puantaj-takip-programi-modulu': {
    hero: {
      title: 'Vaxt və Davamiyyət İdarəçiliyi',
      text: 'Şirkətinizin böyüklüyündən asılı olmayaraq, idenfit işçilərinizin iş növbələrini asanlıqla planlamanızı təmin edir.',
      ctaText: 'Davamiyyət İzləməsinə Başlayın', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/1@2x.webp', alt: '1@2x', width: 1038, height: 1403 },
    },
    sections: [
      {
        title: 'Vaxt İdarəçiliyi',
        text: "idenfit-in vaxt və davamiyyət idarəçiliyi ilə işçilərin gəlişlərini, növbələrini, icazələrini, əlavə iş saatlarını və rəsmi bayramları zəhmətsizcə idarə edə bilərsiniz. idenfit, növbələrin doğru şəkildə hesablandığından əmin olur. Yaxşı hesablanmış növbələr, istifadəçilərin performans qiymətləndirmələrini daha səmərəli şəkildə həyata keçirməyinə kömək edir.",
        ctaText: 'Vaxt İdarəçiliyinə Başlayın', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/puantajtak.2@2x.jpg', alt: 'puantajtak.2@2x', width: 751, height: 1071 },
      },
      {
        title: 'Ağıllı Növbə İdarəçiliyi',
        text:
          '<p>İşçilərinizin işləmək istədikləri növbələri seçmələrinə icazə verə bilər və idenfit-in ağıllı növbə idarəetmə proqramı ilə onlara mövcud növbələri planlaya bilərsiniz. İşçilərinizin növbələri, itirilən saatlar və fasilələr tək bir panel üzərindən görüntülənə bilər və idarə oluna bilər. Ağıllı növbə idarəçiliyində, növbələr sabit, çevik və dinamik növbə olaraq kateqoriyalaşdırıla bilər. Sabit növbələr müəyyən başlanğıc və bitiş saatlarına əsaslanarkən, çevik və dinamik növbələr gün boyunca ümumi iş saatlarını nəzərə alır.</p>\n<p>Həftəlik iş saatlarında əlavə iş saatı ilə əlaqədar bir problem olduqda avtomatik bir bildiriş alacaqsınız, beləliklə bu cür əlavə iş saatlarını təkrar-təkrar həll etmək məcburiyyətində qalmazsınız.</p>',
        ctaText: 'Ağıllı Növbə İdarəçiliyinə Başlayın', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/puantajtak-1.webp', alt: 'puantajtak 1', width: 1147, height: 840 },
      },
      {
        title: 'İllik Təqvim',
        text: "idenfit, hər işçinin illik təqvimində işçilərin gəlişlərini, növbələrini, icazələrini, əlavə iş saatlarını və rəsmi bayramları idarə etməyinizi təmin edir. Məlumatlar əl ilə də tənzimlənə bilər. İllik təqvim, şirkətlərə bütün vaxt və davamiyyət məlumatlarını tək bir idarəetmə panelində təqdim edərək komandanızın vərdişlərini izləməyinizi təmin edir.",
        ctaText: 'İllik Təqvimə Başlayın', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/puantajtak-2.webp', alt: 'puantajtak 2', width: 1109, height: 615 },
      },
      {
        title: 'Növbə Təqvimi',
        text:
          "<p>idenfit-də işçi növbələrini planlamaq, münaqişəsiz növbələri yalnız bir neçə dəqiqə içində planlamaq üçün ehtiyac duyduğunuz bütün fikirləri təmin edir. Tək bir platformadan, növbələri izləyə bilər və təqvimdə bütün növbə planlamasını rəngli və əyləncəli bir dizaynla görə bilərsiniz. Bayramları və uyğunsuzluq vəziyyətlərini asanlıqla nəzərə ala bilər, planlama münaqişələrinin qarşısını ala bilər və büdcə daxilində qalaraq əlavə iş saatını əngəlləyə bilərsiniz.</p>\n<p>idenfit ilə eyni növbə proqramını iki dəfə yaratmağınıza ehtiyac yoxdur. Bunun yerinə, təkrar funksiyamızın çevikliyindən faydalana və ya gələcəkdə istifadə üçün şablonlar yarada bilərsiniz.</p>",
        ctaText: 'Növbə İdarəçiliyinə Başlayın', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/5@2x.webp', alt: '5@2x', width: 801, height: 1074 },
      },
      {
        title: 'Fasilələr',
        text: 'idenfit, növbə növünə bağlı olaraq fasilələri çevik bir şəkildə idarə etməyinizi təmin edir. Fasilələrlə əlaqədar məlumatlar saxlanılır və tələb üzərinə hesabat kimi alına bilər. Fasilələr, idenfit-də şirkət siyasətlərinə görə təyin edilir və əlavə edilir.',
        ctaText: '', ctaUrl: '',
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/6@2x.webp', alt: '6@2x', width: 1071, height: 899 },
      },
      {
        title: 'Canlı və Tarixi Monitorlar',
        text:
          '<p>İşçilərin real zamanlı növbə məlumatları canlı və tarixi monitorlarda görüntülənə bilər. Canlı məlumat monitorunda, işçilərin son 10 real zamanlı hərəkətini görə bilərsiniz. Tarixi məlumat monitoru, personal, tarix və terminal əsasında filtrlənə bilən məlumat tarixçəsini göstərir.</p>\n<p>Kimlik doğrulamasının lazım olduğu terminallarda və ya nəzarət nöqtələrində, işçi fotoşəkilləri idenfit mobil tətbiqi ilə real zamanlı foto çəkim xüsusiyyəti ilə alına bilər. Canlı və tarixi monitorlar tamamilə real zamanlı məlumatlardan ibarətdir.</p>',
        ctaText: '', ctaUrl: '', image: null,
      },
    ],
    faq: [
      { question: 'Vaxt izləməsi nədir və necə hesablanır?', answer: 'Vaxt izləməsi, işçilərin giriş və çıxış saatlarını, icazələrini, fasilələrini və əlavə iş saatlarını izləmək üçün istifadə edilən sistemdir. Doğru məlumatlar hazırlamaq üçün işçilərin vaxt məlumatları vaxt proqramları, vaxt qeydləri və ya xüsusi vaxt izləmə proqramları istifadə edilərək toplanır və nizamlanır.' },
      { question: 'Vaxt proqramları, vaxt qeydləri və vaxt izləməsi nə üçün istifadə olunur?', answer: 'Vaxt proqramları və ya vaxt qeydləri, bir işçinin müəyyən bir müddət ərzində nə qədər işlədiyini, nə zaman icazə aldığını və əlavə iş saatı yığıb-yığmadığını göstərir.' },
      { question: 'Vaxt izləməsi proqramı nədir və necə işləyir?', answer: 'Vaxt izləmə sistemi, işçilərin vaxt məlumatlarını avtomatik olaraq toplayan, nizamlayan və hesabatlayan rəqəmsal bir platformadır – əl ilə girişi ortadan qaldırır və xətaları azaldır.' },
      { question: 'İşçi vaxt və davamiyyəti necə bir vaxt izləmə sistemi vasitəsilə izlənir?', answer: 'İşçi vaxt izləməsi, davamiyyət, icazə və əlavə iş saatı ilə əlaqədar fərdi qeydləri əhatə edir. Şirkət sabit növbələrlə və ya dönən proqramlarla işləyirsə, vaxt izləmə sistemləri hər işçi üçün doğru izləməni təmin edir.' },
      { question: 'İcazə idarəçiliyi vaxt izləmə sistemlərinə necə inteqrasiya edilir?', answer: 'Vaxt izləmə proqramı, icazə idarəetmə modulları ilə inteqrasiya edilmişdir. İllik icazə, xəstəlik günləri, ödənişsiz icazə və bayramlar avtomatik olaraq vaxt izləmə qeydlərində görüntülənir. Bu, davamsızlıq səbəblərinin sistematik olaraq sənədləşdirilməsini təmin edir, əmək haqqı proseslərini asanlaşdırır və auditlər üçün uyğun məlumatlar təqdim edir.' },
    ],
  },
  'personel-servisi-yonetimi-modulu': {
    hero: {
      title: 'Servislər Modulu',
      text: 'Servis kateqoriyalarını idarə edərkən, servis məlumatlarını işçilərlə sistem üzərindən paylaşın!',
      ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/servisler1@2x.webp', alt: 'servisler1@2x', width: 1127, height: 1282 },
    },
    sections: [
      {
        title: 'Ağıllı servis sistemi',
        text:
          '<p>idenfit servis marşrutu modulu ilə,</p>\n<ul class="list gray"><li>Mavi yaxa, ağ yaxa, fərqli növbə servisləri kimi çoxlu servis kateqoriyası barındıran müəssisə işçiləri, hansı servisi hansı sürücünün istifadə etdiyini, sürücünün telefon nömrəsini, avtomobilin modelini və nömrəsini, servis marşrutunu – avtomobilin xəritə üzərində hansı dayanacaqlardan, nə zaman keçdiyi – kimi məlumatları ətraflı olaraq ehtiva edən sistem üzərindən görə bilərlər.</li></ul>',
        ctaText: 'Onlayn Təqdimat Tələbi', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/servisler2@2x.webp', alt: 'servisler2@2x', width: 1056, height: 942 },
      },
    ],
    faq: [
      { question: 'Servis izləmə proqramı istifadə etmək müəssisələrə hansı üstünlükləri təmin edir?', answer: 'Servislərin kim tərəfindən, nə zaman, hansı marşrutda istifadə edildiyini əl ilə izləmək yerinə rəqəmsal sistemlərlə anlıq, xətasız və şəffaf şəkildə idarə etmə imkanı təqdim edir.' },
      { question: 'Personal servis izləmə proqramı işçi təcrübəsinə necə töhfə verir?', answer: 'İşçilər servis avtomobilinin harada olduğunu, təxmini çatma saatını və sürücü məlumatlarını öz ekranından izləyərək vaxt planlamasını daha praktik şəkildə edə bilər.' },
      { question: 'Avtomobil servis izləmə proqramı hansı məlumatlara giriş təmin edir?', answer: 'Avtomobil modeli, nömrə məlumatı, sürücü əlaqə məlumatları və dayanacaq saatları kimi əməliyyat detallarına tək bir paneldən çatma imkanı təqdim edir.' },
      { question: 'Onlayn servis izləmə proqramı ilə menecerlər hansı məlumatları izləyə bilər?', answer: 'Hansı avtomobilin hansı növbəyə xidmət göstərdiyi, marşrut dəyişiklikləri, vaxtında çatma və ya gecikmə kimi performans məlumatları anlıq olaraq görüntülənə bilər.' },
      { question: 'Servis izləmə tətbiqi ilə kağız və telefon trafiki sona çatır mı?', answer: 'Bəli, eyni zamanda vaxt və əmək itkisi qarşısı alınır. Servis avtomobilləri izləmə sistemi, bütün məlumatları mobildə əlçatan hala gətirir. Beləliklə həm menecerlər, həm işçilər güncəl məlumata tək panel üzərindən zəhmətsizcə çatır.' },
    ],
  },
  'notlar-modulu': {
    hero: {
      title: 'Qeydlər Modulu',
      text: 'Departamentiniz və işçiləriniz üçün qeyd almanın ən praktik yolunu istifadə edin!',
      ctaText: 'Əlaqəyə Keçin', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/notlar1@2x.png', alt: 'notlar1@2x', width: 1138, height: 1201 },
    },
    sections: [
      {
        title: 'Xatırlatma xüsusiyyəti ilə qeyd izləməsini interaktiv edin!',
        text: 'İnsan resursları idarəçiliyində işçilərlə əlaqədar qeydlərin izlənməsi mühüm yer tutur. Qeydlərin müvafiq şəxs üzərindən yaradılması və digər modullarla inteqrasiya olaraq tək sistem üzərindən qeyd edilməsi iş yükünü böyük ölçüdə azaldır. idenfit ilə yaradılan qeydlər şəxsə xasdır. Qeyd edilən qeydlərin geriyə dönük görüntülənməsi və izlənməsində idenfit yaradılan qeydləri xatırlatma xüsusiyyəti ilə sistem üzərində işinizi asanlaşdırır.',
        ctaText: 'Ətraflı Məlumat Al', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/notlar2@2x.png', alt: 'notlar2@2x', width: 1053, height: 888 },
      },
      {
        title: 'Şəxs və tarix əsaslı qeydlər yaradın!',
        text:
          '<p>idenfit qeydlər modulu ilə,</p>\n<ul class="list gray"><li>Sistemdə, müəssisə və ya şəxslə əlaqədar qeydlər yaradıla bilər.</li><li>Müvafiq şəxs və tarix əsaslı qeydlər daxil edilə bilər.</li><li>Məzmun və əhəmiyyət dərəcəsi kimi məlumatlar yanında lazım olduqda sənəd əlavə edilə bilər.</li><li>Qeydlər anonim olaraq deyil yaradan şəxsə xasdır və yalnız o şəxs tərəfindən görüntülənə bilər.</li></ul>',
        ctaText: 'Əlaqəyə Keçin', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/notlar4@2x.webp', alt: 'notlar4@2x', width: 1084, height: 757 },
      },
      {
        title: 'Qeydlərinizi digər modullarla tək platformada idarə edin!',
        text: 'idenfit qeydlər modulu ilə qarışıq kağızlar və stikerlər arasında itməzsiniz. İnsan resursları idarəçiliyinin bütün əməliyyatlarını edə biləcəyiniz idenfit proqramı ilə qeydlərinizi də eyni platformada saxlaya bilər, müvafiq şəxslə əlaqədar tarix əsasında qeyd daxil edə və sənəd əlavə edə bilərsiniz.',
        ctaText: 'Onlayn Təqdimat Tələbi', ctaUrl: DEMO_CTA_URL, image: null,
      },
    ],
    faq: [
      { question: 'Qeydlər modulu nədir?', answer: 'idenfit Qeydlər modulu, şəxs və ya müəssisə ilə əlaqədar qeydləri təhlükəsiz şəkildə yaratmağınızı, saxlamağınızı və tarix əsasında izləməyinizi təmin edir.' },
      { question: 'Qeydlər modulunda hansı xüsusiyyətlər var?', answer: 'Şəxs və tarix əsaslı qeyd girişi, məzmun və əhəmiyyət dərəcəsi əlavə etmə, sənəd əlavə etmə, yalnız yaradan şəxsin görüntüləyə biləcəyi fərdi qeydlər və xatırlatma xüsusiyyəti mövcuddur.' },
      { question: 'Qeydlər modulu iş yükünü necə azaldır?', answer: 'Bütün qeydlərin tək sistem üzərindən digər modullarla inteqrasiya olaraq saxlanılması, kağız və post-it qarışıqlığını aradan qaldırır, keçmiş qeydlərin izlənməsini asanlaşdırır.' },
    ],
  },
  'zimmet-yonetimi-modulu': {
    hero: {
      title: 'Əmlak İdarəçiliyi',
      text: 'Əsas vəsaitləri və təyin etdiyiniz əmlakları rəqəmsal mühitdə asanlıqla izləyin!',
      ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/08/zimmetler1@2x.png', alt: 'zimmetler1@2x', width: 1035, height: 1261 },
    },
    sections: [
      {
        title: 'Əsas vəsaitləri və təyin etdiyiniz əmlakları rəqəmsal mühitdə asanlıqla izləyin!',
        text: '', ctaText: 'Əlaqəyə Keçin', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/08/zimmetler3@2x.png', alt: 'zimmetler3@2x', width: 1099, height: 963 },
      },
      {
        title: 'Əmlak təyinatlarını rəqəmsal mühitdə izləyin!',
        text:
          '<p>idenfit əmlak modulu ilə,</p>\n<ul class="list gray"><li>Əsas vəsaitlərin verilmə tarixləri və geri alınması lazım olan tarixlər sistemə daxil edilə bilər.</li><li>Əsas vəsaitlərin geri təhvil verildiyi tarixlər də ayrıca sistemə işlənə bilər.</li><li>Əmlak təyin edilən şəxs və tarixlər üzərindən hesabatlıq alına bilər.</li></ul>',
        ctaText: 'Onlayn Təqdimat Tələbi', ctaUrl: DEMO_CTA_URL, image: null,
      },
    ],
    faq: [
      { question: 'Korporativ əmlak idarəetmə sistemi niyə lazımdır?', answer: 'Xüsusilə böyük miqyaslı müəssisələrdə onlarla əsas vəsaitin kimdə olduğunu izləmək olduqca çətindir. idenfit, bu prosesi tək paneldən idarə etmə imkanı təmin edir.' },
      { question: 'Rəqəmsal əmlak idarəçiliyi ənənəvi metodlardan necə fərqlənir?', answer: 'Excel faylları və ya əl ilə formalar yerinə anlıq giriş, əmlak keçmişi və avtomatik hesabatlar sayəsində nəzarət itkisi yaşanmır. Vaxt və səy itkisi də qarşısı alınır.' },
    ],
  },
  'yillik-izin-takip-programi': {
    hero: {
      title: 'İcazə İdarəçiliyi',
      text: 'idenfit ilə icazələri, ağıllı və çevik platforma üzərindən idarə edin!',
      ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/izinler1@2x.webp', alt: 'izinler1@2x', width: 1210, height: 1350 },
    },
    sections: [
      {
        title: 'İcazə idarəçiliyi & icazə təqvimi',
        text:
          "<p>İcazə idarəçiliyi & icazə təqvimi idenfit ilə istədiyiniz məhdudiyyət və şərtlərdə icazə növləri təyin edə bilərsiniz. Rəsmi bayramları və xüsusi icazələri eyni anda idarə edə bilərsiniz. idenfit işçilərin ehtiyacı olan xəstəlik icazəsi, analıq icazəsi və ya evlilik icazəsi kimi fərqli növlərdə, sərhədsiz icazə hesablaması və icazə köçürmə əməliyyatını dəstəkləyir və sizə xas icazə bölgüləri ilə icazə növünü ətraflandırmanızı təmin edəcək platforma təqdim edir.</p>\n<p>idenfit işçilərinizin tələb etdiyi bütün icazə növlərini tək bir təqvimdə birləşdirərək, illik, aylıq və həftəlik görə bilməyinizi təmin edir. İstənilən icazəni, istifadəçi dostu panel üzərində asanlıqla silə, əlavə edə və ya tənzimləyə bilərsiniz. Ayrıca hər icazə növünü fərqli rənglərdə göstərən panel məlumatlar arasında itməyinizi əngəlləyir.</p>",
        ctaText: '', ctaUrl: '',
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/izinler3@2x.webp', alt: 'izinler3@2x', width: 1114, height: 615 },
      },
      {
        title: 'Təkmilləşdirilmiş icazə seçimləri',
        text:
          '<p>idenfit ilə təkmilləşdirilmiş icazə seçimlərində kimlərin nə qədər icazə tələb etdiyi, hak edişlər və bu icazələri hansı departamentlərin görəcəyi və ya icazələrin nə qədər müddət əvvəldən tələb edilə biləcəyi kimi detallar sistem üzərindən təyin edilə bilər.</p>\n<p>Təsdiq tələb edən icazə növlərində sənəd ibrazı tələb edildikdə hesabatlar və ya sənədlər sistem üzərindən göndərilə bilər və ya icazə sənədlərinə qeyd edilə bilər. İcazə növlərinə görə icazə tələbinin mobildən və ya birbaşa insan resurslarına şəxsən edilməsi lazım olduğunun məlumatını müəssisə sistem üzərində müəyyənləşdirə bilər.</p>',
        ctaText: 'Əlaqəyə Keçin', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/izinler4@2x.webp', alt: 'izinler4@2x', width: 1180, height: 873 },
      },
      {
        title: 'Ağıllı icazə parametrləri',
        text:
          '<p>İcazə növlərini parametrlər vasitəsilə yalnız o icazəni ala biləcək şəxslərin təqviminə avtomatik olaraq göstərərək mümkün qarışıqlıqların qarşısına keçə bilərsiniz. Məsələn, doğum icazəsi kişi işçilərin icazə təqvimində yer almamalı, yalnız qadın işçilərə təyin edilən bir icazə növüdür. Bu kimi parametrləri istifadə edərək icazə idarəçiliyində iş yükündən və vaxtdan qənaət təmin edə bilərsiniz.</p>\n<p>idenfit icazə idarəçiliyində, cinsiyyət, yaş, ailə vəziyyəti və daha bir çox ətraflı parametrlə çevik icazə növləri yaradıb, hədəf işçilərinizə təyin edə bilərsiniz.</p>',
        ctaText: 'Ətraflı Məlumat', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/5@2x-1.webp', alt: '5@2x 1', width: 1186, height: 1106 },
      },
      {
        title: 'Kaskad təsdiq prosesləri',
        text:
          '<p>idenfit icazə idarəçiliyi ilə işçilər, menecerlərindən sürətli şəkildə icazə tələb edə bilər və menecerin icazəni tənzimləməsi vəziyyətində sistem üzərindən göndərilən bir bildirişlə xəbərdar ola bilər. Ayrıca, menecerlər idenfit icazə idarəçiliyi ilə real zamanlı olaraq hansı işçinin icazədə olduğunu, icazəsi yaxınlaşan işçiləri və hər hansı bir işçinin icazə keçmişini görə bilərlər.</p>\n<p>Hesabat icazələrində sistemə müvafiq sənəd yükləndikdə icazə təsdiqə düşmədən yaradılarkən, evlilik icazəsi kimi bir icazədə menecerin təsdiq verməsi gözlənilir. Tələb edilən iznin əvvəlcə departament rəhbərinə, təsdiqləndikdən sonra müvafiq bölmə müdirinə düşməsi kimi sistem üzərində kaskadlaşdırma edilə bilər. İcazəni kimin təsdiqləyə biləcəyi sistem üzərindən təyin edilə biləcəyi kimi alınan icazə bildirişinin hansı müvafiq şəxslərə gedəcəyi də eyni şəkildə müəyyən edilə bilər.</p>\n<p>Təsdiq verilməli olan icazələrdə, kaskad təsdiq proseslərini idenfit ilə yarada bilərsiniz.</p>',
        ctaText: 'İndi Müraciət Et', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/6@2x-1.webp', alt: '6@2x 1', width: 1297, height: 1197 },
      },
      {
        title: 'Çevik icazə seçimləri',
        text:
          '<p>Müəssisələrdə hər bir işçinin yaş, cinsiyyət, ailə vəziyyəti kimi fərdi fərqlərinin olduğu düşünüldükdə hər işçiyə eyni icazə növlərinin müəyyən edilməsi və işçinin təyin edilən icazənin hamısını istifadə etməsinin gözlənilməsi doğru və səmərəli bir yanaşma olmaz. Bu vəziyyət qarışıqlıqlara səbəb ola biləcəyi kimi əlavə iş yükünü də bərabərində gətirir.</p>\n<p>İşçilər icazə növlərində təyin edilən şərtlərə görə icazə tələblərini tam gün, yarım gün və ya rüb gün olaraq tələb edə bilər və icazələrindən istifadə edilən bu müddətlər avtomatik olaraq düşür. idenfit icazə idarəçiliyi ilə işçilərin ödənişli və ya ödənişsiz icazələri, sistemdə qeydiyyatlı olan hak edişlər köməyilə hər yerdən rəqəmsal mühitdə kağız işi olmadan idarə oluna bilər.</p>',
        ctaText: 'Satış Komandası ilə Görüşün', ctaUrl: DEMO_CTA_URL,
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/7@2x.webp', alt: '7@2x', width: 1140, height: 1281 },
      },
      {
        title: 'İcazə idarəçiliyini idenfit-ə buraxın, vaxtınız sizə qalsın!',
        text:
          '<ul class="list gray"><li>Personal bu icazələri asanlıqla mobil və ya planşet tətbiqi üzərindən tələb edə bilər.</li><li>Tələb edilən bu icazələr anlıq olaraq sistem bildirişi və e-poçt olaraq gedir.</li><li>İcazə tələbləri təyin edilmiş menecerlərə sırasıyla təsdiqə gedir.</li><li>İllik icazə müddətləri müəssisələr tərəfindən müəyyən edilir.</li><li>idenfit icazə idarəçiliyi, mürəkkəb illik icazə hesablama proseslərini sizin yerinizə edir.</li><li>İşçi hər icazəyə çıxdığında müvafiq icazə haqqı, icazə balanslarından avtomatik olaraq düşür. Sistem bunu avtomatik olaraq özü edir, əl ilə müdaxilə tələb etmir.</li><li>İcazə növü daxilində müvafiq iznin köçürülə bilən olduğu təyin edilərsə sistem hər il bu hesablamanı avtomatik olaraq edir və menecerlər geriyə dönük icazə hesablaması etmək məcburiyyətində qalmır.</li></ul>',
        ctaText: 'Onlayn Təqdimat Tələbi', ctaUrl: DEMO_CTA_URL, image: null,
      },
    ],
    faq: [
      { question: 'İllik icazə planlaması necə daha səmərəli edilə bilər?', answer: 'idenfit, işçilərin hak edişlərinə görə illik icazə balanslarını avtomatik hesablayaraq planlamanı asanlaşdırır.' },
      { question: 'Personal icazə idarəçiliyi niyə rəqəmsal mühitdə edilməlidir?', answer: 'Əl ilə izləmə vaxt itkisi yaradır və xəta riskini artırır. Rəqəmsal icazə sistemləri ilə bütün tələblər, təsdiqlər və icazə keçmişi və fərqli icazə növləri tək ekranda bir icazə təqvimi üzərindən idarə olunur.' },
      { question: 'idenfit icazə idarəetmə sistemi funksiyası təqdim edən icazə modulu ilə hansı üstünlükləri təmin edir?', answer: 'Bütün icazə növlərini mərkəzi bir strukturda toplayır, təsdiq proseslərini sürətləndirir və kağız işlərini aradan qaldırır. idenfit ilə xüsusi məhdudiyyət və şərtlərdə icazə növləri də təyin edilə bilər.' },
      { question: 'İnsan resursları icazə idarəçiliyi üçün idenfit kifayətdir mi?', answer: 'Bəli, kifayətdir. Çevik qaydalar, kaskad təsdiqlər və parametrli icazə növləri ilə İRİ komandaları üçün güclü bir həll təqdim edir.' },
    ],
  },
  'seyahat-ve-gorevlendirme-yonetimi-modulu': {
    hero: {
      title: 'Səyahət Modulu',
      text: 'İşçi səyahətlərini; transfer, konaklama və iş başlıqları altında kateqoriyalaşdıraraq idarə edin!',
      ctaText: '', ctaUrl: '',
      image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/seyahat1@2x.webp', alt: 'seyahat1@2x', width: 1197, height: 1233 },
    },
    sections: [
      {
        title: 'Səyahət idarəçiliyini idenfit-ə buraxın!',
        text:
          '<p>idenfit səyahət modulu ilə, işçilərinizin ölkə daxili və ya xarici səyahətlərini etibarlı şəkildə idarə edə bilərsiniz. İşçi icazə tələblərində olduğu kimi, gediləcək tarix və yer məlumatlarını daxil edərək səyahət və ya ezamiyyət tələbində bula bilərsiniz.</p>\n<p>İşçilərinizin səyahət və ezamiyyətləri sistemdə sürətlə yaradılıb etibarlı saxlanılır. idenfit səyahət modulu ilə işçinin səyahət və ya ezamiyyətindəki xərc, avans və əmlaklarının izlənməsi edilir, transfer və konaklama detallarının nəzarəti təmin edilir.</p>',
        ctaText: '', ctaUrl: '',
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/seyahat2@2x.webp', alt: 'seyahat2@2x', width: 1137, height: 878 },
      },
      {
        title: 'İşçi ezamiyyətləri üçün səyahət modulu!',
        text:
          '<p>idenfit səyahət modulu ilə,</p>\n<ul class="list gray"><li>İşçinin səyahət və ezamiyyət məlumatları sistem üzərində görülə bilər.</li><li>Transfer, konaklama və iş kimi detalların nəzarəti təmin edilə bilər.</li><li>Səyahət formu üzərindən personal məlumatları və səyahətlə əlaqədar detallara çatıla bilər.</li><li>İşçilərin səyahət prosesində etdikləri xərclər, mobil üzərindən real zamanlı olaraq sistemə qeyd edilir və müntəzəm olaraq izlənə bilər.</li><li>İstənilən xərc, avans və əmlak məlumatına mobil üzərindən anlıq çatıla bilər.</li></ul>',
        ctaText: '', ctaUrl: '',
        image: { url: 'https://idenfit.com/wp-content/uploads/2025/07/seyahat3@2x.webp', alt: 'seyahat3@2x', width: 948, height: 1196 },
      },
    ],
    faq: [
      { question: 'idenfit-in insan resursları proqramı daxilində korporativ səyahət idarəçiliyi modulu yer alır mı?', answer: 'Bəli, idenfit İRİ proqramında yer alan səyahət modulu sayəsində işçilərin ölkə daxili və xarici ezamiyyətləri praktik və mərkəzi şəkildə idarə edilə bilər.' },
      { question: 'Səyahət təşkilatı modulu işçilər üçün ezamiyyət prosesini necə asanlaşdırır?', answer: 'İşçilər mobil cihazları ilə səyahət detallarını, avans və xərc məlumatlarını anlıq olaraq sistemə daxil edə bilər.' },
    ],
  },
};
