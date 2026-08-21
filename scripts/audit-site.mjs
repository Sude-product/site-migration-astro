// Genel site denetimi (blog migrasyonundan önce) — `dist/**/index.html`'i
// tarayıp her sayfa için title/description/internal link/img src bilgisini
// çıkarır, kırık iç linkleri ve şüpheli title/description'ları tespit
// eder. Yalnızca RAPOR üretir, hiçbir dosyayı değiştirmez.
//
// Çalıştırma: `astro build` sonrası → `node scripts/audit-site.mjs`
// Çıktı: `scratchpad`'e değil, stdout'a JSON + özet (rapor yazımı ayrı).

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';

function listHtmlFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) out.push(...listHtmlFiles(full));
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

function urlFromFile(file) {
  const rel = relative(DIST, file).split(sep).join('/');
  const path = '/' + rel.replace(/index\.html$/, '');
  return path === '//' ? '/' : path;
}

function decodeAttr(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

const files = listHtmlFiles(DIST);
const pages = [];

for (const file of files) {
  const html = readFileSync(file, 'utf-8');
  const url = urlFromFile(file);
  const isRedirect = /<meta http-equiv="refresh"/.test(html) && /Redirecting from/.test(html);

  if (isRedirect) {
    const locMatch = html.match(/<link rel="canonical" href="([^"]*)"/);
    pages.push({ url, file, isRedirect: true, redirectTo: locMatch ? locMatch[1] : null });
    continue;
  }

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
  const title = titleMatch ? decodeAttr(titleMatch[1]).trim() : null;
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
  const description = descMatch ? decodeAttr(descMatch[1]).trim() : null;

  const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map((m) => decodeAttr(m[1]));
  const internalHrefs = [...new Set(hrefs.filter((h) => h.startsWith('/') && !h.startsWith('//')))];

  const imgSrcs = [...html.matchAll(/<img[^>]*\ssrc="([^"]*)"/g)].map((m) => decodeAttr(m[1]));
  const uniqueImgSrcs = [...new Set(imgSrcs)];

  const langSwitcherMatch = html.match(/LanguageSwitcher[^>]*?props="([^"]*)"/);

  pages.push({
    url,
    file,
    isRedirect: false,
    title,
    description,
    internalHrefs,
    imgSrcs: uniqueImgSrcs,
    hasLangSwitcher: !!langSwitcherMatch,
    langSwitcherPropsRaw: langSwitcherMatch ? langSwitcherMatch[1] : null,
  });
}

const OUT = process.env.AUDIT_OUT || 'audit-data.json';
writeFileSync(OUT, JSON.stringify(pages, null, 0));
console.log(`Toplam ${files.length} dosya tarandı: ${pages.filter((p) => !p.isRedirect).length} gerçek sayfa, ${pages.filter((p) => p.isRedirect).length} redirect stub.`);
console.log(`Çıktı: ${OUT} (sonraki analiz script'leri için ara veri)`);
