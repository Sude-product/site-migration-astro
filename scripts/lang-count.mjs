import { readFileSync } from "node:fs";
import { join } from "node:path";

const BASE = join("reference", "wordpress-export");

function langCount(name) {
  const data = JSON.parse(readFileSync(join(BASE, name), "utf-8"));
  const hasField = Object.prototype.hasOwnProperty.call(data[0], "pll_language");
  const counts = {};
  for (const item of data) {
    const lang = item.pll_language ?? "<yok>";
    counts[lang] = (counts[lang] ?? 0) + 1;
  }
  return { total: data.length, hasField, counts };
}

for (const [label, file] of [["POSTS", "posts.json"], ["PAGES", "pages.json"]]) {
  const { total, hasField, counts } = langCount(file);
  console.log(`${label}: toplam=${total} pll_language_alani=${hasField} dagilim=${JSON.stringify(counts)}`);
}
