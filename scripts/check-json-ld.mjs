// JSON-LD (structured data) denetimi (2026-08-10) — `check-title-length.mjs`/
// `check-meta-description-length.mjs` ile AYNI desen (`dist/**/*.html`
// taranır, redirect stub'ları hariç tutulur, `readdir({recursive:true})`
// KULLANILMAZ — bkz. o script'lerdeki OneDrive-flakiness notu).
//
// Google'ın Rich Results Test'i / schema.org'un resmi validator'ı bu ortamda
// (internet erişimi/canlı URL olmadan) çağrılamaz — bu script AYNI kuralları
// YEREL olarak uyguluyor: geçerli JSON söz dizimi, `@context`/`@type`
// zorunlu alanları, `BlogPosting` için Google'ın "Article" rich result
// gereksinimleri (headline, image, datePublished — dateModified ÖNERİLEN),
// ISO 8601 tarih formatı doğrulaması, ve `dateModified >= datePublished`
// mantık kontrolü (bir yazı yayınlanmadan ÖNCE "güncellenmiş" olamaz).
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = process.env.DIST_DIR ?? 'dist';
const ISO_8601_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

async function findHtmlFiles(dir) {
  const results = [];
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(fullPath);
      else if (entry.isFile() && entry.name.endsWith('.html')) results.push(fullPath);
    }
  }
  await walk(dir);
  return results;
}

// `BlogPosting`/`Article`'ın Google Rich Results için zorunlu/önerilen alanları.
// `FAQPage` (2026-08-12, ana sayfa SSS bölümü) — `mainEntity`'nin kendisi
// var mı kontrolü burada, İÇ yapısının (her Question'ın `name`+
// `acceptedAnswer.text` taşıması) daha derin kontrolü `validateBlock()`'ta
// AYRI bir FAQPage-özel bloğa yazıldı (aşağıda) — flat alan listesi bunu
// ifade edemiyor.
// `SoftwareApplication` (2026-10-03, ürün/modül sayfaları — bkz. CLAUDE.md
// Açık nokta #29): `name` ZORUNLU tutuluyor.
//
// ⚠️ `offers` BİLİNÇLİ OLARAK ne zorunlu ne önerilen listede. Google'ın
// "Software App" rich result'ı `name` yanında `offers` VEYA `aggregateRating`/
// `review` şart koşuyor, AMA bu projede üçü de kasıtlı olarak YOK: modül
// sayfası bir satın alma birimi değil (fiyat Fiyatlar sayfasının paketlerine
// ait, KOBİ/Pro ikisi de "Teklif Al") ve gerçek bir derecelendirme verimiz
// hiç yok — uydurulamaz. `offers`'ı buraya "önerilen" diye yazmak, kasıtlı
// ve doğru bir kararı her build'de 121 sayfalık bir uyarı gürültüsüne
// çevirirdi. Rich result ÜRETİLMEMESİ bu turda kabul edilmiş bir sonuç
// (gerekçe `ProductPage.astro`'nun ilgili yorum bloğunda).
const REQUIRED_BY_TYPE = {
  BlogPosting: ['headline', 'image', 'datePublished'],
  Article: ['headline', 'image', 'datePublished'],
  FAQPage: ['mainEntity'],
  SoftwareApplication: ['name'],
  // `WebApplication` (2026-10-03, Hesaplama Araçları — şema turu PR 7).
  // `SoftwareApplication`'ın alt tipi; AYNI `name` zorunluluğu geçerli.
  // ⚠️ FARK: burada `offers` ÖNERİLEN listede VAR, `SoftwareApplication`'da
  // YOK. Çelişki değil, ölçülmüş bir ayrım: hesaplama araçları gerçekten
  // bedelsiz ve kayıtsız (saf istemci tarafı, giriş yolu yok), yani bir
  // `Offer` yazmak OLGUSAL OLARAK DOĞRU ve Google'ın rich result şartını
  // (`name` + `offers`) karşılıyor. Ürün/modül sayfalarında ise herkese
  // açık fiyat YOK (KOBİ/Pro "Teklif Al") — orada `offers`'ı önermek
  // yanlış bir iddiaya teşvik olurdu.
  WebApplication: ['name'],
  // `CollectionPage` (2026-10-04, blog liste sayfaları — şema turu PR 9).
  // `WebPage`'in ALT TİPİ; blog listesinde `WebPage` yerine BU tip basılıyor
  // (ayrı bir blok DEĞİL — gerekçe `BaseLayout.astro`'nun `collection` prop
  // yorumunda). `mainEntity`'nin KENDİSİ burada zorunlu DEĞİL (boş listede
  // bilinçli olarak hiç basılmıyor), İÇ yapısının kontrolü aşağıda
  // `validateBlock()`'ta AYRI bir bloğa yazıldı — FAQPage'le AYNI desen,
  // flat alan listesi iç yapıyı ifade edemiyor.
  //
  // ⚠️ `WebPage` bu listede HÂLÂ YOK — yani 255 `WebPage` bloğu hiç
  // doğrulanmıyor (`required=[]`/`recommended=[]` → boş güvence, PR 5'in
  // `SoftwareApplication` için tespit ettiği AYNI boşluk). Bu turda
  // BİLİNÇLİ olarak kapsam dışı bırakıldı (bkz. CLAUDE.md, PR 9 kaydı).
  CollectionPage: ['name', 'url'],
};
// ⚠️ `articleSection` (2026-10-04) burada DİĞERLERİNDEN FARKLI bir gerekçeyle
// duruyor: `dateModified`/`author`/`publisher` Google'ın Article rich result
// ÖNERİLERİ, `articleSection` DEĞİL — Google onu hiç kullanmıyor. Buraya bir
// PROJE DEĞİŞMEZİ olarak yazıldı: `categories` 640/640 yazıda dolu (ölçüldü)
// ve `[slug].astro` alanı DOĞRUDAN ondan türetiyor, yani alanın yokluğu
// yalnızca kategorisiz bir yazı anlamına gelir — bu bir veri kusuru ve
// uyarılmaya değer (panelden yayınlanan yazılar kuralları atlıyor, bkz.
// CLAUDE.md Açık nokta #70).
//
// ⚠️ Bu kontrolün ÇALIŞMASI `[slug].astro`'nun alanı boş kategoride HİÇ
// basmamasına BAĞLI: aşağıdaki döngü `!block[field]` kullanıyor ve
// JavaScript'te boş dizi TRUTHY — düz `[]` basılsa kontrol sessizce geçerdi.
// İki taraf birlikte anlamlı; biri değişirse diğeri boşa düşer.
const RECOMMENDED_BY_TYPE = {
  BlogPosting: ['dateModified', 'author', 'publisher', 'articleSection'],
  Article: ['dateModified', 'author', 'publisher', 'articleSection'],
  SoftwareApplication: ['applicationCategory', 'description', 'url'],
  WebApplication: ['applicationCategory', 'description', 'url', 'offers'],
  // `mainEntity` ÖNERİLEN (zorunlu değil): bir koleksiyon sayfası teknik
  // olarak boş olabilir (liste sayfasının "henüz yazı yok" durumu) ve o
  // hâlde alan bilinçli olarak hiç basılmıyor — boş bir `ItemList` iddia
  // etmek yanlış olurdu. Ama 54/54 liste sayfasının dolu olduğu ölçüldü,
  // yani alanın yokluğu pratikte bir veri kusurudur ve uyarılmaya değer.
  CollectionPage: ['description', 'inLanguage', 'mainEntity'],
};

function validateBlock(block) {
  const errors = [];
  const warnings = [];

  if (!block['@context'] || !String(block['@context']).includes('schema.org')) {
    errors.push('`@context` eksik veya "schema.org" içermiyor');
  }
  if (!block['@type']) {
    errors.push('`@type` eksik');
  }

  const type = block['@type'];
  const required = REQUIRED_BY_TYPE[type] ?? [];
  const recommended = RECOMMENDED_BY_TYPE[type] ?? [];
  for (const field of required) {
    if (!block[field]) errors.push(`zorunlu alan eksik: \`${field}\` (@type: ${type})`);
  }
  for (const field of recommended) {
    if (!block[field]) warnings.push(`önerilen alan eksik: \`${field}\` (@type: ${type})`);
  }

  for (const dateField of ['datePublished', 'dateModified']) {
    const value = block[dateField];
    if (value && !ISO_8601_RE.test(value)) {
      errors.push(`\`${dateField}\` ISO 8601 formatında değil: "${value}"`);
    }
  }

  if (block.datePublished && block.dateModified && ISO_8601_RE.test(block.datePublished) && ISO_8601_RE.test(block.dateModified)) {
    const published = new Date(block.datePublished).getTime();
    const modified = new Date(block.dateModified).getTime();
    if (modified < published) {
      errors.push(`\`dateModified\` (${block.dateModified}) \`datePublished\`'tan (${block.datePublished}) ÖNCE — mantıksız`);
    }
  }

  // `SoftwareApplication.featureList` — ÖZELLİK OLMAYAN girdi sezgisi
  // (2026-10-03). `featureList` sayfanın bölüm başlıklarından TÜRETİLİYOR
  // (bkz. `ProductPage.astro`), ama her bölüm bir ürün özelliği değil:
  // tanıtım ("Neden idenfit") ve kapanış CTA'sı ("Şimdi Başlayın")
  // bölümleri de başlık taşıyor. Bunlar `NON_FEATURE_SECTION_INDEXES`
  // (`productContent.ts`) ile İNDEKSLE dışlanıyor — ama bir bölüm
  // eklenir/çıkarılırsa o indeksler KAYAR ve dışlama sessizce yanlış
  // bölüme kayar.
  //
  // Bu kontrol o kaymayı (ve yeni eklenen benzer başlıkları) yakalar.
  // HATA DEĞİL, UYARI: (a) sezgisel olduğu için yanlış pozitif verebilir,
  // (b) hata yapmak gate'i kırardı ve bilinen taban çizgileri yüzünden
  // zaten kırılgan olan exit-kod durumunu (bkz. CLAUDE.md #36/#70/#78)
  // daha da bozardı.
  //
  // ⚠️ KÜÇÜK HARFE ÇEVİRME İKİ YÖNLÜ BİR TUZAK — ikisi de ölçülerek
  // yakalandı (2026-10-03):
  //  1. Varsayılan `/i` bayrağı / `toLowerCase()`: Türkçe büyük "İ"
  //     (U+0130) `i`'ye EŞLEŞMİYOR → `"İndi Başlayın"` kaçırılır.
  //  2. `toLocaleLowerCase('tr')`: bu kez ASCII büyük "I" NOKTASIZ "ı"ya
  //     (U+0131) dönüyor → `"Inizia Ora"` ve `"Why Idenfit …"` kaçırılır
  //     (gerçek veriyle test edildi: 10 girdinin yalnızca 8'i yakalandı).
  // Çözüm: karşılaştırmadan ÖNCE her iki Türkçe "i" varyantını da düz
  // ASCII "i"ye katla, SONRA locale'den bağımsız `toLowerCase()` uygula.
  // Kalıp listesi de AYNI katlamadan geçiyor ki `"başlayın"` (noktasız ı)
  // ile `"başlayin"` aynı şeye indirgensin.
  const foldI = (s) =>
    String(s)
      .replace(/İ/g, 'i') // İ
      .replace(/ı/g, 'i') // ı
      .toLowerCase()
      .trim();
  if ((type === 'SoftwareApplication' || type === 'WebApplication') && Array.isArray(block.featureList)) {
    const NON_FEATURE_HINTS = [
      'neden idenfit', 'niyə idenfit', 'niye idenfit', 'why idenfit',
      'perché idenfit', 'perche idenfit', 'waarom idenfit',
      'idenfit nedir', 'what is idenfit',
      'şimdi başlayın', 'simdi baslayin', 'indi başlayın', 'hemen başla',
      'start now', 'get started', 'inizia ora', 'inizia subito',
      'begin nu', 'start nu', 'başlayın', 'baslayin',
    ];
    const foldedHints = NON_FEATURE_HINTS.map(foldI);
    for (const item of block.featureList) {
      const norm = foldI(item);
      const hit = foldedHints.find((h) => norm === h || norm.startsWith(h));
      if (hit) {
        warnings.push(
          `\`featureList\` ÖZELLİK OLMAYAN girdi içeriyor olabilir: "${item}" ` +
            `(eşleşen kalıp: "${hit}") — \`NON_FEATURE_SECTION_INDEXES\` indeksleri kaymış olabilir`,
        );
      }
    }
  }

  // `FAQPage`'in Google Rich Results gereksinimleri `mainEntity`'nin
  // İÇİNDE — her `Question`'ın gerçek `name` (boş olmayan) + `acceptedAnswer`
  // taşıması, `acceptedAnswer`'ın da `@type:"Answer"` + gerçek `text`
  // (boş olmayan) taşıması gerekiyor.
  if (type === 'FAQPage' && Array.isArray(block.mainEntity)) {
    if (block.mainEntity.length === 0) {
      errors.push('`mainEntity` boş dizi — en az 1 soru olmalı');
    }
    block.mainEntity.forEach((q, i) => {
      if (q['@type'] !== 'Question') errors.push(`mainEntity[${i}]: \`@type\` "Question" değil`);
      if (!q.name || !String(q.name).trim()) errors.push(`mainEntity[${i}]: \`name\` eksik/boş`);
      const answer = q.acceptedAnswer;
      if (!answer) {
        errors.push(`mainEntity[${i}]: \`acceptedAnswer\` eksik`);
      } else {
        if (answer['@type'] !== 'Answer') errors.push(`mainEntity[${i}].acceptedAnswer: \`@type\` "Answer" değil`);
        if (!answer.text || !String(answer.text).trim()) errors.push(`mainEntity[${i}].acceptedAnswer: \`text\` eksik/boş`);
      }
    });
  }

  // `CollectionPage.mainEntity` → `ItemList` İÇ YAPISI (2026-10-04).
  // Flat alan listesi bunu ifade edemiyor (FAQPage'le AYNI gerekçe). Burada
  // yakalanan sınıf gerçek: `BaseLayout` bu diziyi `position: i + 1` ile
  // ÜRETİYOR ve öğeler sayfanın render sırasından geliyor — bir gün sıralama/
  // dilimleme mantığı değişirse `position`'lar kayar, `numberOfItems`
  // gerçek uzunlukla ayrışır veya URL'ler göreli kalır. Üçü de JSON-LD'de
  // HATA VERMEZ, sessizce yanlış olur.
  if (type === 'CollectionPage' && block.mainEntity) {
    const list = block.mainEntity;
    if (list['@type'] !== 'ItemList') {
      errors.push('`mainEntity`: `@type` "ItemList" değil');
    } else if (!Array.isArray(list.itemListElement)) {
      errors.push('`mainEntity.itemListElement` bir dizi değil');
    } else {
      if (list.itemListElement.length === 0) {
        errors.push('`mainEntity.itemListElement` boş — boş liste yerine alan HİÇ basılmamalı');
      }
      if (list.numberOfItems !== list.itemListElement.length) {
        errors.push(
          `\`mainEntity.numberOfItems\` (${list.numberOfItems}) gerçek öğe sayısıyla (${list.itemListElement.length}) uyuşmuyor`,
        );
      }
      list.itemListElement.forEach((it, i) => {
        if (it['@type'] !== 'ListItem') errors.push(`mainEntity.itemListElement[${i}]: \`@type\` "ListItem" değil`);
        if (it.position !== i + 1) {
          errors.push(`mainEntity.itemListElement[${i}]: \`position\` ${it.position}, beklenen ${i + 1} (1'den artan olmalı)`);
        }
        if (!it.name || !String(it.name).trim()) errors.push(`mainEntity.itemListElement[${i}]: \`name\` eksik/boş`);
        if (!it.url || !String(it.url).trim()) {
          errors.push(`mainEntity.itemListElement[${i}]: \`url\` eksik/boş`);
        } else if (!/^https?:\/\//.test(String(it.url))) {
          // Google göreli URL'leri yok sayıyor (bkz. `image`/`mainEntityOfPage`
          // için AYNI kural, `blog/[slug].astro`'nun `toAbsoluteUrl` yorumu).
          errors.push(`mainEntity.itemListElement[${i}]: \`url\` MUTLAK değil: "${it.url}"`);
        }
      });
    }
  }

  // `offers` → `Offer` İÇ YAPISI (2026-10-04, Fiyatlar sayfası — şema turu
  // PR 10). `SoftwareApplication`/`WebApplication`'ın `offers`'ı ÖNERİLEN
  // listede DEĞİL (ürün/modül sayfalarında bilinçli olarak yok — yukarıdaki
  // asimetri notu), ama VARSA yapısı doğru olmalı: fiyatsız veya para
  // birimsiz bir `Offer` hiçbir şey iletmez ve Google tarafından yok sayılır.
  // Flat alan listesi iç yapıyı ifade edemiyor (FAQPage/ItemList AYNI desen).
  if (block.offers) {
    const offers = Array.isArray(block.offers) ? block.offers : [block.offers];
    offers.forEach((offer, i) => {
      const at = offers.length > 1 ? `offers[${i}]` : '`offers`';
      if (offer['@type'] !== 'Offer') {
        errors.push(`${at}: \`@type\` "Offer" değil`);
        return;
      }
      // `price` 0 OLABİLİR (ücretsiz paket) — bu yüzden truthy kontrolü
      // KULLANILAMAZ: "0" dizesi truthy ama 0 sayısı falsy olurdu.
      if (offer.price === undefined || offer.price === null || String(offer.price).trim() === '') {
        errors.push(`${at}: \`price\` eksik/boş`);
      } else if (!/^\d+(\.\d+)?$/.test(String(offer.price))) {
        // Google para birimi simgesi/ayırıcı İSTEMİYOR, salt sayı bekliyor.
        errors.push(`${at}: \`price\` salt sayı değil: "${offer.price}"`);
      }
      if (!offer.priceCurrency) {
        errors.push(`${at}: \`priceCurrency\` eksik`);
      } else if (!/^[A-Z]{3}$/.test(String(offer.priceCurrency))) {
        errors.push(`${at}: \`priceCurrency\` 3 harfli ISO 4217 kodu değil: "${offer.priceCurrency}"`);
      }
    });
  }

  return { errors, warnings };
}

const files = await findHtmlFiles(DIST_DIR);
if (files.length === 0) {
  console.error(`❌ '${DIST_DIR}/' içinde .html dosyası bulunamadı — önce 'npx astro build' çalıştırın.`);
  process.exit(2);
}

let pagesWithJsonLd = 0;
let pagesWithoutJsonLd = 0;
let totalBlocks = 0;
let invalidBlocks = 0;
let blocksWithWarnings = 0;
const invalidExamples = [];
const warningExamples = [];
const typeCounts = {};

for (const file of files) {
  const html = await readFile(file, 'utf8');
  if (/<meta\s+http-equiv="refresh"/i.test(html)) continue; // redirect stub

  const rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  const matches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  if (matches.length === 0) {
    pagesWithoutJsonLd++;
    continue;
  }
  pagesWithJsonLd++;

  for (const m of matches) {
    totalBlocks++;
    let parsed;
    try {
      parsed = JSON.parse(m[1]);
    } catch (err) {
      invalidBlocks++;
      invalidExamples.push({ file: rel, error: `JSON söz dizimi hatası: ${err.message}` });
      continue;
    }
    typeCounts[parsed['@type']] = (typeCounts[parsed['@type']] ?? 0) + 1;
    const { errors, warnings } = validateBlock(parsed);
    if (errors.length > 0) {
      invalidBlocks++;
      invalidExamples.push({ file: rel, error: errors.join('; ') });
    }
    if (warnings.length > 0) {
      blocksWithWarnings++;
      if (warningExamples.length < 5) warningExamples.push({ file: rel, warning: warnings.join('; ') });
    }
  }
}

console.log('\n=== JSON-LD (Structured Data) Denetimi ===');
console.log(`Taranan sayfa (redirect stub'ları hariç): ${pagesWithJsonLd + pagesWithoutJsonLd}`);
console.log(`JSON-LD içeren sayfa: ${pagesWithJsonLd}`);
console.log(`JSON-LD İÇERMEYEN sayfa: ${pagesWithoutJsonLd} (bilgi amaçlı — henüz yalnızca blog'a kuruldu)`);
console.log(`\nToplam JSON-LD bloğu: ${totalBlocks}`);
console.log('Tür dağılımı:', typeCounts);
console.log(`Geçersiz blok: ${invalidBlocks}`);
console.log(`Uyarılı (önerilen alan eksik) blok: ${blocksWithWarnings}`);

if (invalidExamples.length > 0) {
  console.log('\n--- Geçersiz bloklar (ilk 10) ---');
  for (const e of invalidExamples.slice(0, 10)) console.log(`  ${e.file}: ${e.error}`);
}
if (warningExamples.length > 0) {
  console.log('\n--- Uyarı örnekleri (ilk 5) ---');
  for (const e of warningExamples) console.log(`  ${e.file}: ${e.warning}`);
}

console.log(`\n=== ÖZET: ${invalidBlocks} geçersiz blok ===`);
process.exit(invalidBlocks === 0 ? 0 : 1);
