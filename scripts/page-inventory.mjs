import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = join("reference", "wordpress-export");
const load = (name) => JSON.parse(readFileSync(join(BASE, name), "utf-8"));

const pages = load("pages.json");
const posts = load("posts.json");

const stripHtml = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&amp;|&#8211;|&#8217;|&quot;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const wordCount = (html) => {
  const text = stripHtml(html || "");
  if (!text) return 0;
  return text.split(" ").filter(Boolean).length;
};

const slugPath = (link) => {
  try {
    const u = new URL(link);
    return u.pathname;
  } catch {
    return link;
  }
};

const pageRows = pages.map((p) => ({
  id: p.id,
  title: p.title.rendered.replace(/&#8211;/g, "-").replace(/&amp;/g, "&"),
  slug: p.slug,
  path: slugPath(p.link),
  lang: p.pll_language || "?",
  template: p.template || "(default)",
  words: wordCount(p.content?.rendered),
  modified: (p.modified || "").slice(0, 10),
  parent: p.parent,
}));

// ---- Category grouping (manually reviewed against full 170-title dump) ----
const CATEGORIES = {
  A_home: {
    label: "Ana Sayfa",
    slugs: ["home", "home-en", "home-it", "home-nl"],
  },
  A_about: {
    label: "Hakkımızda / About",
    slugs: ["hakkimizda", "about", "chi-siamo", "over"],
  },
  A_contact: {
    label: "İletişim / Contact",
    slugs: ["iletisim", "contact", "contact-2", "contatti"],
  },
  A_pricing: {
    label: "Fiyatlar / Pricing",
    slugs: ["fiyatlar", "pricing", "pricing-2", "prezzi"],
  },
  A_legal: {
    label: "KVKK / Gizlilik / Sözleşmeler",
    slugs: [
      "kisisel-verilerin-korunmasi",
      "gizlilik-ve-guvenlik-politikasi",
      "data-use-policy",
      "privacy-and-security-policy",
      "protezione-dati-personali",
      "contratto-politica-privacy-e-sicurezza",
      "kvk-protokol",
      "kvk-protocol",
      "mesafeli-satis-sozlesmesi",
      "mesafeli-satis-sozlesmesi-kobi",
      "mesafeli-satis-sozlesmesi-mikro",
      "tuketici-haklari-sozlesmesi",
      "consumer-rights-agreement",
      "contratto-diritti-dei-consumatori",
      "contratto-contratto-di-vendita-a-distanza",
      "distance-sales-contract",
      "customer-sales-agreement-micro",
      "customer-sales-agreement-sme",
    ],
  },
  A_demo_cta: {
    label: "Online Sunum Talebi (ana CTA hedefi)",
    slugs: [
      "online-sunum-talep-et",
      "request-online-presentation",
      "richiedi-presentazione-online",
    ],
  },
  A_modules: {
    label: "Ürün / Modül sayfaları (Bordro, PDKS, İzin, Performans vb.)",
    slugs: [
      "documenten",
      "bedrijfskalender",
      "corporate-calender-module",
      "anket-modulu",
      "bordo-onay-modulu",
      "calisan-egitim-yonetimi-modulu",
      "calisan-ozluk-yonetimi-modulu-2",
      "calisan-performans-degerlendirme-sistemi-modulu",
      "demirbas-yonetimi-modulu",
      "dokuman-yonetim-sistemi-modulu",
      "employee-feedback-module",
      "employee-health-management-module",
      "employee-information-module",
      "employee-internal-communication-module",
      "employee-offboarding-module",
      "employee-onboarding-module",
      "employee-records-management-module",
      "employee-shuttle-management-module",
      "employee-surveys-module",
      "employee-training-management-module",
      "employeerecords-management-module",
      "expense-management-module",
      "feedback-module",
      "fixed-asset-management-module",
      "health-management",
      "hiring-module",
      "hr-document-management-module",
      "human-resources-management-modules",
      "incassos",
      "insan-kaynaklari-isgucu-yonetimi",
      "insan-kaynaklari-yonetimi-modulu",
      "ise-alim-modulu",
      "isyeri-saglik-yonetimi-modulu",
      "kurumsal-takvim-modulu",
      "leave-management",
      "leave-management-module",
      "leave-management-module-2",
      "masraf-yonetimi-modulu",
      "messages-module",
      "moduli-gestione-risorse-umane",
      "modulo-calendario-aziendale",
      "modulo-comunicazione-interna-dipendenti",
      "modulo-fascicolo-personale",
      "modulo-feedback-dipendenti",
      "modulo-gestione-documentale-hr",
      "modulo-gestione-fascicolo-dipendenti",
      "modulo-gestione-ferie-e-permessi",
      "modulo-gestione-formazione-dipendenti",
      "modulo-gestione-navette-dipendenti",
      "modulo-gestione-paghe",
      "modulo-gestione-performance",
      "modulo-gestione-presenze",
      "modulo-gestione-risorse-umane-forza-lavoro",
      "modulo-gestione-salute-dipendenti",
      "modulo-gestione-spese",
      "modulo-note",
      "modulo-offboarding-dipendenti",
      "modulo-onboarding-dipendenti",
      "modulo-reclutamento",
      "modulo-rilevazione-presenze",
      "modulo-sondaggi-dipendenti",
      "notes-module",
      "notes-module-2",
      "notlar-modulu",
      "offboarding-module",
      "offboarding-modulu",
      "ofis-ici-mesajlasma-modulu",
      "onboarding-module",
      "onboarding-modulu",
      "onkostenmodule",
      "organizasyonel-geri-bildirim-modulu",
      "payroll",
      "payroll-management-module",
      "pdks-module",
      "pdks-module-2",
      "pdks-modulu",
      "performance-appraisal-module",
      "performance-management",
      "personel-servisi-yonetimi-modulu",
      "puantaj-takip-programi-modulu",
      "seyahat-ve-gorevlendirme-yonetimi-modulu",
      "shuttle-module",
      "staff-training",
      "survey-module",
      "time-attendance-module",
      "travel-and-assignment-management-module",
      "workforce-management",
      "yillik-izin-takip-programi",
      "zimmet-yonetimi-modulu",
    ],
  },
  B_customers: {
    label: "Müşteriler / Customers",
    slugs: ["musteriler", "customers", "customers-2", "clienti"],
  },
  B_why: {
    label: "Neden İdenfit / Why Idenfit",
    slugs: ["neden-idenfit", "why-idenfit", "perche-idenfit", "waroom-idenfit"],
  },
  B_security: {
    label: "Güvenlik / Security",
    slugs: ["guvenlik", "security", "politica-di-sicurezza"],
  },
  B_hardware: {
    label: "Donanım / Hardware / Suprema",
    slugs: [
      "donanim",
      "hardware",
      "hardware-2",
      "hardware-3",
      "suprema-2",
      "suprema-tools",
      "dispositivi-suprema",
    ],
  },
  B_brand: {
    label: "Global Marka / Unicorn",
    slugs: ["unicorn", "unicorn-idenfit", "marchio-globale", "global-brand"],
  },
  B_faq: {
    label: "SSS / FAQ",
    slugs: ["sss", "faq", "faq-3"],
  },
  B_tools: {
    label: "Hesaplama Araçları + Dijital Olgunluk Testi",
    slugs: [
      "hesaplama-araclari",
      "ik-dijital-olgunluk-testi",
      "ik-dijital-olgunluk-testi-sonucu",
    ],
  },
  B_blog: {
    label: "Blog (liste sayfası)",
    slugs: ["blog"],
  },
  B_thankyou: {
    label: "Teşekkürler sayfaları (form/demo akışı)",
    slugs: ["demo-tesekkurler", "grazie", "thanks", "tesekkurler", "thank-you"],
  },
  C_support: {
    label: "Destek Talebi / Support Request",
    slugs: ["destek-talebi", "support-request", "richiesta-supporto"],
  },
  D_campaign: {
    label: "Kampanya (geçmiş / zamana bağlı)",
    slugs: ["kampanya"],
  },
  D_test: {
    label: "Test / taslak / WP varsayılan sayfalar",
    slugs: ["form-test", "sample-page", "test-tr", "slider-form", "slider-form-en", "ik-dijital-test"],
  },
};

const categorized = new Set();
for (const cat of Object.values(CATEGORIES)) {
  for (const s of cat.slugs) categorized.add(s);
}
const uncategorized = pageRows.filter((r) => !categorized.has(r.slug));

const findRow = (slug) => pageRows.find((r) => r.slug === slug);

// ---- Posts summary ----
const CAT_LABELS = {
  "ik-akademi": "İK Akademi",
  "ik-trendleri": "İK Trendleri",
  "guncel-bilgiler": "Güncel Bilgiler",
  "dijital-ik": "Dijital İK",
  "gecmis-etkinlikler": "Geçmiş Etkinlikler",
  "guncel-bilgiler-tr": "Güncel Bilgiler (TR ek)",
  "uncategorized-tr": "Kategorisiz (TR)",
  "ik-roportajlari": "İK Röportajları",
  "yaklasan-etkinlikler": "Yaklaşan Etkinlikler",
  "ogretici-bilgiler": "Öğretici Bilgiler",
  "yenilikler-tr": "Yenilikler (TR)",
};

const byCat = {};
for (const p of posts) {
  const cats = (p.class_list || [])
    .filter((c) => c.startsWith("category-"))
    .map((c) => c.slice(9));
  for (const c of cats) {
    byCat[c] ??= { count: 0, dates: [] };
    byCat[c].count += 1;
    byCat[c].dates.push(p.modified);
  }
}
for (const c of Object.values(byCat)) c.dates.sort();

const out = {
  pageRows,
  CATEGORIES,
  findRow,
  uncategorized,
  byCat,
  CAT_LABELS,
};

mkdirSync("scripts", { recursive: true });
writeFileSync(
  join("scripts", "_page-inventory-data.json"),
  JSON.stringify(out, null, 2)
);
console.log("Total pages:", pageRows.length);
console.log("Uncategorized:", uncategorized.length, uncategorized.map((r) => r.slug));
console.log("Category sizes:");
for (const [key, cat] of Object.entries(CATEGORIES)) {
  console.log(" ", key, cat.label, "=", cat.slugs.length);
}
