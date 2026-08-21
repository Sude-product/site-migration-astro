// Dev server'ı TAM temiz şekilde yeniden başlatan tek komutluk yardımcı —
// `astro.config.mjs`'teki `optimizeDeps.force: true` artık HER başlangıçta
// bağımlılık önbelleğini zaten zorla tazeliyor (kalıcı asıl çözüm, bkz.
// CLAUDE.md "Vite bağımlılık önbelleği bozulması"), ama `dist/` build
// çıktısını temizlemek ve süreci gerçekten sıfırdan başlatmak (özellikle
// `npm install`/`uninstall` — ör. Playwright gibi geçici bir araç kurup
// kaldırdıktan SONRA) hâlâ elle 3 ayrı komut gerektiriyordu. Bu script o
// üçünü (durdur → temizle → başlat) TEK adıma indiriyor.
//
// Çalıştırma: `npm run dev:clean` (durdur+temizle+arka planda başlat) veya
// `npm run predev` üzerinden otomatik (yalnızca durdur+temizle, `--cache-only`
// — başlatmayı npm'in kendi `dev` script'ine bırakır, aksi halde iki dev
// server aynı anda başlamaya çalışırdı).
//
// KURAL: `npm install`/`npm uninstall` her çalıştırıldığında (dev server
// AÇIK olsun olmasın) bundan hemen sonra `npm run dev:clean` çalıştırılmalı
// — canlı bir dev server sürecindeyken npm install/uninstall yapmak
// (durdurmadan) paylaşılan bağımlılıkları (ör. esbuild) değiştirip süreci
// bozabiliyor.
import { execSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';

const cacheOnly = process.argv.includes('--cache-only');

function run(cmd) {
  console.log(`$ ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch {
    // `astro dev stop` sunucu zaten kapalıyken (veya hiç başlamamışken)
    // hata verebilir — yok say, bu script'in amacı için sorun değil.
  }
}

run('npx astro dev stop');

for (const dir of ['node_modules/.vite', 'dist']) {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
    console.log(`silindi: ${dir}`);
  }
}

if (cacheOnly) {
  console.log('\n✅ Önbellek temizlendi (--cache-only) — sunucuyu başlatan asıl komut devam edecek.');
} else {
  run('npx astro dev --background');
  console.log('\n✅ Dev server temiz yeniden başlatıldı. Doğrulama: npx astro dev logs');
}
