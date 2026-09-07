# Cloudflare panelinde tanımlı, repoda OLMAYAN kurallar

**Durum:** 2026-09-07 denetiminde keşfedildi (bulgu SEO-24). Aşağıdaki
yönlendirmeler ve route ayrımları canlıda ÇALIŞIYOR ama kaynaklarının hiçbiri
bu depoda yok — ne `public/_redirects`'te, ne `astro.config.mjs`'in `redirects`
bloğunda, ne git geçmişinde. Yani yalnızca Cloudflare panelinde tanımlılar.

**Neden önemli:** bir sonraki deploy, hesap değişikliği veya panel
temizliğinde sessizce kaybolabilirler. Kaybolduklarında ortaya çıkacak
sorunlar (eski URL'lerin 404'e düşmesi gibi) kod tarafında hiçbir iz
bırakmadığı için teşhisi zor olur.

**⚠️ Bu liste bir panel dökümü DEĞİL — canlı siteye istek atılarak GÖZLENEN
davranıştır.** Panelde burada listelenmeyen başka kurallar da olabilir.
Yetkili bir envanter için Cloudflare panelindeki Rules → Redirect Rules ve
Workers Routes bölümleri kontrol edilmeli.

## Gözlenen davranışlar

| İstek | Sonuç | Doğrulama |
|---|---|---|
| `/tr/blog/<slug>/` | 301 → `/blog/<slug>/` | canlıda 301, yerel build'de **404** |
| `/tr/` , `/tr/<sayfa>/` | 301 → bare karşılığı | canlıda 301, yerel build'de **404** |
| `/sitemap_index.xml` | 301 → `/sitemap-index.xml` | eski Yoast adresi; yeni sitemap adı farklı |
| `/wp-json/**` | eski WordPress origin'ine gidiyor | `x-powered-by: PHP/8.4.23` |
| `/wp-content/plugins/**` | eski origin'e gidiyor | `x-powered-by: WP Rocket/3.19.4` |
| `/wp-content/uploads/**` | **origin'e GİTMİYOR** — yeni sitenin statik dosyaları | yalnızca repoda olan dosyalar 200 |

## Neden `/tr/*` repoya taşınmadı

Taşınabilir (`public/_redirects`'e tek satır) ama panel kuralının kapsamı
tam bilinmiyor — repoya eklenen bir kural panel kuralıyla çakışırsa
davranış belirsizleşir. Doğru sıra: önce panelde kuralın tam tanımı görülüp
buraya yazılmalı, sonra repoya taşınıp panelden kaldırılmalı.

## `/wp-*` route'ları hakkında (açık iş)

Eski WordPress hâlâ ayakta ve `/wp-json/` üzerinden 630 yazının tam gövdesini
servis ediyor. Bu, 2026-09-07'de kanıtlanan bir içerik kaybının kök nedeniydi:
ekip WordPress'e yazı girmeye devam ettiği için 4 Eylül tarihli bir yazı yeni
sitede hiç görünmüyordu (kurtarıldı, bkz. commit "Canlıda 404 veren
yayınlanmış blog yazısını kurtar").

`x-robots-tag: noindex` taşıdığı için indeks etkisi yok — bu bir SEO sorunu
değil, bakımı yapılmayan bir WordPress'in açık kalmış yüzeyi. Kurtarma
tamamlandığına göre bu route'lar kapatılabilir; kapatmadan önce başka bir
şeyin (eski medya, bir entegrasyon) bu yola bağlı olmadığı teyit edilmeli.
