// idenfit.com'un GERÇEK yıldızı — `IdenfitLogo.tsx`'in taşıdığı tam
// logotype SVG'sinin (viewBox 0 0 98 36) SON path elemanının birebir aynı
// path verisi, yalnızca yıldızın kendi bölgesine (x≈85.4–98, y≈1.3–13.3)
// kırpılmış bir viewBox ile izole edildi — yeni bir şekil ÇİZİLMEDİ.
// `fill="currentColor"` (IdenfitLogo'nun aksine sabit marka kırmızısı
// DEĞİL) — Müşteri Hikayeleri carousel'inin kırmızı/beyaz/gri kart
// varyantlarında kontrast için renk çağıran yerde belirleniyor.
interface Props {
  className?: string;
}

export default function IdenfitStar({ className }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="85 1 13.5 12.5" fill="none" className={className} aria-hidden="true">
      <path
        d="M95.0963 13.2725C94.9391 13.2725 94.7844 13.2209 94.6529 13.1436L91.7629 11.3724L88.8729 13.1436C88.5867 13.3266 88.2232 13.3008 87.9345 13.1178C87.6483 12.909 87.5168 12.5712 87.5968 12.2335L88.3779 8.92588L85.7999 6.71391C85.5395 6.47931 85.4363 6.14158 85.5395 5.80386C85.6426 5.46613 85.9288 5.25731 86.2691 5.23153L89.6798 4.94536L90.9817 1.82077C91.1106 1.50882 91.4252 1.3 91.7629 1.3C92.1006 1.3 92.4126 1.50882 92.544 1.82077L93.846 4.94536L97.2309 5.23153C97.5687 5.25731 97.8548 5.49191 97.9605 5.80386C98.0636 6.14158 97.9605 6.48188 97.7001 6.71391L95.1479 8.92588L95.929 12.2335C96.0064 12.5712 95.8775 12.9115 95.5913 13.1178C95.4624 13.2209 95.2794 13.2751 95.0963 13.2751V13.2725Z"
        fill="currentColor"
      />
    </svg>
  );
}
