// Form bildirim e-postalarının başlığındaki idenfit logosu (2026-09-04).
//
// **Neden base64 gömülü:** e-posta istemcileri SVG'yi render ETMİYOR ve
// uzak bir `<img src="https://…">` hem varsayılan olarak engellenebiliyor
// hem de sitenin henüz nihai alan adında olmaması nedeniyle kırılgan
// olurdu (bkz. CLAUDE.md "Görsel bağımlılık kuralı"). Bu PNG SendGrid'e
// `disposition:"inline"` + `content_id` ile ekleniyor, HTML'de
// `<img src="cid:idenfit-logo">` ile çağrılıyor — hiçbir alan adına
// bağımlılık yok, Gmail/Outlook/Apple Mail üçünde de gömülü görüntüleniyor.
//
// **Nasıl üretildi (yeniden üretilebilir):** repodaki GERÇEK logo vektörü
// (`src/components/icons/IdenfitLogo.tsx`, 7 path, viewBox 0 0 98 36 —
// harfler `#070707`, yıldız marka kırmızısı `#FF0000`) 288×106 px'e
// (görüntülenen 96×35'in 3 katı, retina) şeffaf arka planla render edilip
// PNG'ye çevrildi. Logo DEĞİŞİRSE bu sabit yeniden üretilmeli.
export const IDENFIT_LOGO_PNG_BASE64 =
  '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';
