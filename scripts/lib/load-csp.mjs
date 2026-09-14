// `src/data/csp.ts`'i (TypeScript, tek yazılı kaynak) düz Node script'lerinden
// okunabilir hâle getirir.
//
// Neden esbuild: `csp.ts` yalnızca tip ANNOTASYONU taşıyor, yani Node'un
// `--experimental-strip-types` bayrağı da işini görürdü — ama o bayrak
// deneysel ve sürüm sürüm davranış değiştirebiliyor. esbuild, Vite/Astro'nun
// ZORUNLU bir bağımlılığı (her zaman kurulu) ve davranışı sabit; build
// zincirinin bir parçası olan bu script'te deneysel bayrağa güvenmemek
// tercih edildi.
//
// Dosyanın hiç import'u olmadığı için tek dosyalık bir transform yeterli —
// bundle'a gerek yok.
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { transform } from 'esbuild';

export const CSP_SOURCE_PATH = 'src/data/csp.ts';

/** `src/data/csp.ts`'in export'larını döndürür. */
export async function loadCspModule(sourcePath = CSP_SOURCE_PATH) {
  const source = await readFile(sourcePath, 'utf8');
  const { code } = await transform(source, { loader: 'ts', format: 'esm' });
  const dir = await mkdtemp(join(tmpdir(), 'csp-'));
  const file = join(dir, 'csp.mjs');
  try {
    await writeFile(file, code, 'utf8');
    return await import(pathToFileURL(file).href);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
