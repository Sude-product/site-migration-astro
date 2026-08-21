// Hukuki sözleşme sayfaları (`LegalPage.astro`, 14 sayfa) — H2 alt başlığı
// eksikliği düzeltmesi (2026-08-13, "H2 eksik" SEO uyarısı keşif turunun
// devamı, bkz. CLAUDE.md Proje Durumu). KÖK NEDEN: kaynak WP içeriği
// (`misc-pages.json`'daki `contentHtml`) 11/14 sayfada gerçek `<h2>`/`<h3>`
// etiketleri yerine görsel taklit kullanıyor — bazı sayfalar (Tüketici
// Hakları/Mesafeli Satış/Gizlilik-Güvenlik Politikası) alt başlıkları
// yalnızca `<p><strong>KALIN METİN</strong></p>` ile taşıyor (hiç heading
// etiketi yok), bazıları (KVKK EN/IT) H1'den doğrudan `<h4>`'e atlıyor
// (H2/H3 hiç yok). `blogHeadingSanitizer.ts` ile AYNI ilke (render-time'da
// tek bir merkezi fonksiyondan geçiriliyor) ama TERS bir dönüşüm: burada
// eksik heading'ler EKLENİYOR (blog'daki gibi FAZLA H1'i indirgemek değil).
//
// Üç ayrı, birbirinden bağımsız desen tespit edilip `<h2>`'ye (gerekirse
// `<h3>`'e) çevriliyor — 14 hukuki sayfanın TAMAMI üzerinde çalıştırılan
// TEK bir fonksiyon, zaten sağlıklı 2 sayfada (KVK Protokol TR+EN) hiçbir
// desen eşleşmediği gerçek veriyle doğrulandı, no-op kalıyor (KVKK TR
// ÖNCEDEN bu listedeydi — 2026-08-13'te kural 3'ün koşulsuz hâle
// getirilmesiyle o da artık bir dönüşümden geçiyor, bkz. kural 3 yorumu):
//
// 1. Tek başına bir paragrafı dolduran kalın metin — `<p><b><strong>METİN
//    </strong></b></p>` (veya `<b>` olmadan `<p><strong>METİN</strong></p>`)
//    — kaynağın kendi editöryal "başlık" deseni. İlk eşleşme sayfanın H1
//    başlığıyla (`pageTitle`) BİREBİR aynıysa atlanıyor (Mesafeli Satış/
//    Gizlilik-Güvenlik'in İKİSİ de kendi başlığını içeriğin başında TEKRAR
//    ediyor — H1/H2'de aynı metnin çiftlenmesini önler). Kaynağın kendi
//    ondalık alt-madde numarası varsa ("7.2. Fiyatlar" gibi, Mesafeli
//    Satış'ta 4 örnek) `<h3>` olarak nested ediliyor — bu numaralandırma
//    MY kodun uydurması değil, kaynağın kendi metninin İÇİNDE zaten var.
// 2. Tek elemanlı `<ol start="N"><li>...</li></ol>` blokları — Mesafeli
//    Satış Sözleşmesi'nin "madde" başlıkları (TARAFLAR, TANIMLAR, KONU
//    vb.) kaynakta HER BİRİ kendi `start=N` değeriyle İZOLE bir liste
//    olarak kodlanmış, gerçek çok-elemanlı listelerden (aynı belgede
//    devam eden numaralı maddeler) BU ŞEKİLDE ayırt ediliyor. `<li>`
//    içeriği kalın (`<b><strong>`) VEYA — kalın değilse — tamamen büyük
//    harf + kısa (≤40 karakter, kaynağın "TARAFLAR" gibi tek istisnası,
//    aynı belgenin diğer maddeleri gibi kalın DEĞİL ama aynı editöryal
//    role sahip) ise `<h2>` (belge madde numaralandırması kullanıyorsa
//    "N. METİN", kullanmıyorsa salt "METİN") çevriliyor, liste tamamen
//    kaldırılıyor. Numaralandırma yalnızca belgede GERÇEKTEN başka bir
//    başlık adayının açık `start=` taşıdığı doğrulanınca uygulanıyor —
//    aksi halde (ör. Tüketici Hakları'nın numarasız tek istisnası,
//    "SATICININ CAYMA HAKKI BİLDİRİMİ...") yanlışlıkla "1." öneki
//    uydurulmasın diye. 27 belge/dil kombinasyonu üzerinde doğrulandı,
//    hiçbir gerçek tek-cümlelik madde içeriği (ör. uzun, küçük harfle
//    başlayan cümleler) yanlışlıkla başlığa çevrilmiyor.
// 3. `<h4>` KOŞULSUZ `<h2>`'ye yükseltiliyor (2026-08-13 GÜNCELLEME —
//    "Başlık hiyerarşisi sıralı değil" SEO uyarısı turu, bkz. CLAUDE.md).
//    ÖNCEDEN bu kural yalnızca "H2/H3 hiç yoksa" tetikleniyordu (KVKK
//    EN/IT'nin H1→H4 atlamasını kapatıyordu) — ama KVKK TR'nin "zaten
//    H2/H3/H4 karışık ama VAR" diye dokunulmayan hâli GERÇEKTE H1→H4→H2→
//    H3→H4×8 sırasıyla render ediyordu (İLK içerik başlığı doğrudan H4,
//    gerçek H2/H3 daha SONRA geliyordu — hâlâ bir atlama, yalnızca VARLIK
//    kontrolü bunu YAKALAMIYORDU). 14 sayfanın TAMAMI üzerinde doğrulandı:
//    H4 YALNIZCA KVKK'nın 3 dilinde (TR/EN/IT) kullanılıyor, başka HİÇBİR
//    legal sayfada yok — bu yüzden koşulsuz promosyon TAMAMEN GÜVENLİ
//    (diğer 11 sayfayı hiç ETKİLEMİYOR, KVKK EN/IT'de davranış AYNI kaldı).
//    KVKK TR'de H4→H2 sonrası sıra: H2(eski H4)→H2(gerçek)→H3(gerçek,
//    ardışık artış yalnızca +1, sorun DEĞİL)→H2(eski H4)×8 — TAMAMEN
//    geçerli, seviye atlaması YOK. Metin İÇERİĞİ değişmedi, yalnızca
//    etiket seviyesi.
//
// Dürüst sınır: Mesafeli Satış Sözleşmesi'nin "madde 7" başlığının
// kendisi kaynakta yok (yalnızca alt maddeleri 7.2/7.3 var, `<ol>`'u
// gerçek 2 elemanlı bir liste olduğu için kural 2'ye yakalanmıyor) —
// bu, düzeltmenin bir eksiği değil, kaynağın kendi asimetrisi.

function normalizeForCompare(text: string): string {
  return text
    .replace(/&#8217;/g, '’')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function isAllCapsHeading(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length === 0 || trimmed.length > 40) return false;
  return trimmed === trimmed.toUpperCase() && /^[A-ZÇĞİÖŞÜ\s]+$/.test(trimmed);
}

export function structureLegalHeadings(html: string, pageTitle: string): string {
  let result = html;

  // Kural 3: her `<h4>` koşulsuz `<h2>`'ye yükseltilir (bkz. dosya başı
  // yorumu — 14 sayfanın YALNIZCA KVKK'sında (TR/EN/IT) H4 var, koşulsuz
  // yükseltme diğer 11 sayfayı hiç etkilemiyor).
  result = result.replace(/<h4(\s[^>]*)?>/gi, '<h2>').replace(/<\/h4>/gi, '</h2>');

  // Kural 2: izole tek-elemanlı <ol> "madde başlığı" blokları.
  const singleItemOlRe =
    /<ol(?:\s+start="(\d+)")?>\s*<li>\s*(?:<b>\s*<strong>\s*([^<]+?)\s*<\/strong>\s*<\/b>|([^<]+?))\s*<\/li>\s*<\/ol>/gi;
  const headerCandidates = [...result.matchAll(singleItemOlRe)].filter((m) => {
    const text = (m[2] ?? m[3] ?? '').trim();
    if (!text) return false;
    if (!m[2] && !isAllCapsHeading(text)) return false;
    return true;
  });
  const usesExplicitNumbering = headerCandidates.some((m) => m[1] !== undefined);
  result = result.replace(singleItemOlRe, (match, start, boldText, plainText) => {
    const text = (boldText ?? plainText ?? '').trim();
    if (!text) return match;
    if (!boldText && !isAllCapsHeading(text)) return match;
    if (!usesExplicitNumbering) return `<h2>${text}</h2>`;
    const number = start ?? '1';
    return `<h2>${number}. ${text}</h2>`;
  });

  // Kural 1: tek başına kalın paragraf.
  let isFirstMatch = true;
  result = result.replace(
    /<p>\s*(?:<b>\s*<strong>\s*([^<]+?)\s*<\/strong>\s*<\/b>|<strong>\s*([^<]+?)\s*<\/strong>)\s*<\/p>/gi,
    (match, boldText, strongOnlyText) => {
      const text = (boldText ?? strongOnlyText ?? '').trim();
      if (!text) return match;
      const skip = isFirstMatch && normalizeForCompare(text) === normalizeForCompare(pageTitle);
      isFirstMatch = false;
      if (skip) return match;
      const tag = /^\d+\.\d+\.?\s/.test(text) ? 'h3' : 'h2';
      return `<${tag}>${text}</${tag}>`;
    },
  );

  return result;
}
