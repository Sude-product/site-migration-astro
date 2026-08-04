import { readFileSync } from "node:fs";
import { join } from "node:path";

const BASE = join("reference", "wordpress-export");
const load = (name) => JSON.parse(readFileSync(join(BASE, name), "utf-8"));

const posts = load("posts.json");
const pages = load("pages.json");

console.log(`COUNTS: posts=${posts.length} pages=${pages.length}`);

// Top-level keys
console.log("\nPOST KEYS:", Object.keys(posts[0]).sort());
console.log("PAGE KEYS:", Object.keys(pages[0]).sort());

// Category & tag slugs (from class_list, e.g. "category-<slug>" / "tag-<slug>")
const catSlug = {};
const tagSlug = {};
for (const p of posts) {
  for (const c of p.class_list ?? []) {
    if (c.startsWith("category-")) catSlug[c.slice(9)] = (catSlug[c.slice(9)] ?? 0) + 1;
    else if (c.startsWith("tag-")) tagSlug[c.slice(4)] = (tagSlug[c.slice(4)] ?? 0) + 1;
  }
}
console.log("\nCATEGORY slugs (posts):", catSlug);
console.log("TAG slug count (posts):", Object.keys(tagSlug).length);
console.log("TAG slugs (posts):", Object.keys(tagSlug));

// Page & post templates
const tally = (items, field) => {
  const c = {};
  for (const it of items) c[it[field] ?? ""] = (c[it[field] ?? ""] ?? 0) + 1;
  return c;
};
console.log("\nPAGE TEMPLATES:", tally(pages, "template"));
console.log("POST TEMPLATES:", tally(posts, "template"));

// Meta keys + ACF keys
function collectMeta(items, label) {
  const metaKeys = {};
  const acfKeys = {};
  for (const it of items) {
    if (it.meta && typeof it.meta === "object" && !Array.isArray(it.meta))
      for (const k of Object.keys(it.meta)) metaKeys[k] = (metaKeys[k] ?? 0) + 1;
    if (it.acf && typeof it.acf === "object" && !Array.isArray(it.acf))
      for (const k of Object.keys(it.acf)) acfKeys[k] = (acfKeys[k] ?? 0) + 1;
  }
  console.log(`\n${label} meta keys:`, metaKeys);
  console.log(`${label} distinct ACF keys:`, Object.keys(acfKeys).length);
}
collectMeta(posts, "POSTS");
collectMeta(pages, "PAGES");

// Language distribution (Polylang)
console.log("\nPAGE languages (pll_language):", tally(pages, "pll_language"));
console.log("POST pll_language field present:", Object.prototype.hasOwnProperty.call(posts[0], "pll_language"));

// Status
console.log("\nPOST statuses:", tally(posts, "status"));
console.log("PAGE statuses:", tally(pages, "status"));
