// TÜM sayfalardaki TEXT NODE içeriğinde (etiket içeriği, attribute DEĞİL —
// attribute'lardaki &quot;/&amp; JSON serileştirme için gerekli ve
// zararsız) çözülmemiş HTML entity kalıntısı arar. FAQ'da bulunan
// &#8217; sınıfı hatanın başka sayfalarda da olup olmadığını sistematik
// kontrol eder.
//
// Çalıştırma: AUDIT_OUT=<path> node scripts/audit-entities.mjs

import { readFileSync } from 'node:fs';

const IN = process.env.AUDIT_OUT || 'audit-data.json';
const pages = JSON.parse(readFileSync(IN, 'utf-8'));
const realPages = pages.filter((p) => !p.isRedirect);

// Yalnızca TEXT NODE'ları çıkar: `>...<` arası, script/style hariç.
function textNodes(html) {
  const cleaned = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  return [...cleaned.matchAll(/>([^<>]+)</g)].map((m) => m[1]);
}

// ÖNEMLİ AYRIM: bare `&#8217;`/`&nbsp;` gibi TEK-kaçışlı entity'ler HTML'de
// GEÇERLİDİR ve tarayıcı bunları doğru şekilde görünen karaktere çözer
// (React/Astro'nun bir apostrof/özel karakteri güvenli şekilde escape
// etmesinin NORMAL sonucu — bug değil). Gerçek bug, kaynak WP verisinin
// ZATEN "&#8217;" gibi bir entity SÖZ DİZİMİNİ (harfler dizisi olarak)
// İÇERMESİ ve bunun düz-metin interpolasyonundan geçerken bir kez daha
// escape edilmesi — bu da HTML'de ÇİFT kaçışlı `&amp;#8217;` üretir;
// tarayıcı bunu YALNIZCA `&` karakterine çözer, geri kalan "#8217;" harfler
// dizisi olarak GÖRÜNÜR kalır (kullanıcının bildirdiği tam bug budur, bkz.
// FAQ). Bu yüzden yalnızca ÇİFT kaçışlı biçim aranıyor.
const ENTITY_RE = /&amp;#x?[0-9a-fA-F]+;|&amp;(?:nbsp|hellip|ndash|mdash|rsquo|lsquo|rdquo|ldquo);/;

const findings = [];
for (const p of realPages) {
  const html = readFileSync(p.file, 'utf-8');
  for (const text of textNodes(html)) {
    const m = text.match(ENTITY_RE);
    if (m) {
      findings.push({ url: p.url, entity: m[0], context: text.trim().slice(0, 100) });
    }
  }
}

console.log(`\n=== HTML ENTITY TARAMASI (${realPages.length} sayfa, text node) ===`);
console.log(`Bulunan: ${findings.length}`);
const byUrl = new Map();
for (const f of findings) {
  if (!byUrl.has(f.url)) byUrl.set(f.url, []);
  byUrl.get(f.url).push(f);
}
for (const [url, items] of byUrl.entries()) {
  console.log(`  ${url}`);
  for (const it of items.slice(0, 5)) console.log(`    ${it.entity}  ::  "${it.context}"`);
  if (items.length > 5) console.log(`    ... (+${items.length - 5} daha)`);
}
