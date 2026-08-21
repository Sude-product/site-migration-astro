// uploads.zip'ten (reference/wordpress-export/uploads.zip, WordPress'in
// kendi wp-content/uploads/YYYY/MM/ yapısını koruyor) belirtilen dosyaları
// çıkarıp `public/wp-content/uploads/...` altına (AYNI göreli yol) yerleştirir.
// Böylece kaynak veride `https://idenfit.com/wp-content/uploads/...` olan bir
// URL, prefix'i `/wp-content/uploads/...`e çevrilerek yerel/relative hale
// gelir — component kodunda hiçbir değişiklik gerekmez (bkz. CLAUDE.md
// "uploads.zip işleme" günlüğü).
//
// Kullanım: node scripts/localize-images.mjs <uploads/2026/03/dosya.png> [...]
// (yol, zip içindeki TAM yol — "uploads/" ile başlar)

import yauzl from 'yauzl';
import { createWriteStream, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ZIP_PATH = 'reference/wordpress-export/uploads.zip';
const DEST_ROOT = 'public/wp-content/uploads';

function extractOne(zipfile, entry) {
  return new Promise((resolve, reject) => {
    zipfile.openReadStream(entry, (err, readStream) => {
      if (err) return reject(err);
      const relPath = entry.fileName.replace(/^uploads\//, '');
      const destPath = join(DEST_ROOT, relPath);
      mkdirSync(dirname(destPath), { recursive: true });
      const writeStream = createWriteStream(destPath);
      readStream.pipe(writeStream);
      writeStream.on('finish', () => resolve(destPath));
      writeStream.on('error', reject);
      readStream.on('error', reject);
    });
  });
}

async function main(wantedPaths) {
  const wanted = new Set(wantedPaths);
  const found = new Set();

  await new Promise((resolve, reject) => {
    yauzl.open(ZIP_PATH, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);
      zipfile.readEntry();
      zipfile.on('entry', async (entry) => {
        if (!wanted.has(entry.fileName)) {
          zipfile.readEntry();
          return;
        }
        found.add(entry.fileName);
        try {
          const dest = await extractOne(zipfile, entry);
          console.log('✓', entry.fileName, '->', dest);
        } catch (e) {
          console.error('✗', entry.fileName, e.message);
        }
        zipfile.readEntry();
      });
      zipfile.on('end', resolve);
      zipfile.on('error', reject);
    });
  });

  const missing = [...wanted].filter((w) => !found.has(w));
  if (missing.length) {
    console.log('\nZip\'te bulunamayan yollar:');
    for (const m of missing) console.log(' -', m);
  }
  console.log(`\n${found.size}/${wanted.size} dosya çıkarıldı.`);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Kullanım: node scripts/localize-images.mjs <uploads/... yolu> [...]');
  process.exit(1);
}
await main(args);
