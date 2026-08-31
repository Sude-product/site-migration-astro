# idenfit.com — Astro Migrasyonu

idenfit.com (İK/İnsan Kaynakları SaaS) sitesinin WordPress'ten Astro'ya
migrasyon projesi. Ana sayfa, tüm ürün/modül sayfaları, sektör sayfaları,
blog (622 yazı), hesaplama araçları, dijital İK olgunluk testi ve hukuki/
kurumsal sayfa aileleri dahil olmak üzere sitenin tamamını kapsar.

## Teknoloji Yığını

- **[Astro](https://astro.build)** — statik/prerendered sayfa üretimi,
  `@astrojs/react` ile React island mimarisi (yalnızca gerçek etkileşim
  gereken bileşenler client-side hydrate edilir)
- **React 19** — interaktif bileşenler (formlar, menüler, carousel'ler)
- **Tailwind CSS v4** — CSS-tabanlı tema yapılandırması (`src/styles/global.css`)
- **TypeScript**
- **[Keystatic](https://keystatic.com)** (Cloud) — blog içerik yönetimi
- **[Cloudflare](https://developers.cloudflare.com/pages/)** (Workers +
  Assets adapter, `@astrojs/cloudflare`) — deploy hedefi

i18n desteği (tr/en/nl/it/az) built-in Astro routing ile sağlanır; TR
varsayılan/prefix'siz dil, diğerleri `/en/`, `/nl/`, `/it/`, `/az/`
önekleriyle.

## Kurulum ve Çalıştırma

```sh
npm install
npm run dev
```

Dev sunucusu `http://localhost:4321` adresinde açılır.

| Komut | Açıklama |
| :--- | :--- |
| `npm install` | Bağımlılıkları kurar |
| `npm run dev` | Yerel geliştirme sunucusunu başlatır |
| `npm run dev:clean` | Önbelleği temizleyip dev sunucusunu yeniden başlatır (bağımlılık güncellemesi sonrası önerilir) |
| `npm run build` | Üretim build'ini `./dist/` altına üretir |
| `npm run preview` | Build çıktısını yerelde önizler |
| `npm run astro check` | TypeScript/Astro tip kontrolü |
| `npm run audit` | Bağımlılık güvenlik taraması |

Proje kuralları, mimari kararlar ve geçmiş iş günlüğü için `CLAUDE.md`'ye
bakın.
