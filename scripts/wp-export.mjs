// WordPress content exporter
// Fetches all posts, pages, and media from the WordPress REST API
// with pagination (per_page=100, using the X-WP-TotalPages header)
// and a 300ms delay between requests.

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BASE_URL = "https://idenfit.com/wp-json/wp/v2";
const PER_PAGE = 100;
const DELAY_MS = 300;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__dirname, "..", "reference", "wordpress-export");

const ENDPOINTS = [
  { name: "posts", file: "posts.json" },
  { name: "pages", file: "pages.json" },
  { name: "media", file: "media.json" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchAll(endpoint) {
  const results = [];
  let page = 1;
  let totalPages = 1;

  do {
    const url = `${BASE_URL}/${endpoint}?per_page=${PER_PAGE}&page=${page}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      // A 400 with an empty page can happen when page > totalPages; stop cleanly.
      if (res.status === 400 && page > 1) break;
      throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
    }

    // Read total pages from the header on the first request.
    if (page === 1) {
      const header = res.headers.get("x-wp-totalpages");
      totalPages = header ? parseInt(header, 10) : 1;
      const totalItems = res.headers.get("x-wp-total");
      console.log(
        `  ${endpoint}: ${totalItems ?? "?"} items across ${totalPages} page(s)`
      );
    }

    const batch = await res.json();
    if (Array.isArray(batch)) results.push(...batch);

    console.log(`  ${endpoint}: fetched page ${page}/${totalPages} (${results.length} so far)`);

    page += 1;
    if (page <= totalPages) await sleep(DELAY_MS);
  } while (page <= totalPages);

  return results;
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const summary = [];

  for (const { name, file } of ENDPOINTS) {
    console.log(`Fetching ${name}...`);
    const data = await fetchAll(name);
    const outPath = resolve(OUTPUT_DIR, file);
    await writeFile(outPath, JSON.stringify(data, null, 2), "utf8");
    console.log(`  Saved ${data.length} ${name} -> ${outPath}\n`);
    summary.push({ endpoint: name, count: data.length, file: outPath });
  }

  console.log("Export complete:");
  for (const s of summary) {
    console.log(`  ${s.endpoint}: ${s.count} items -> ${s.file}`);
  }
}

main().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
