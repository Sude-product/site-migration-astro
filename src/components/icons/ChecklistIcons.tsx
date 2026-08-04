// İK Dijital Olgunluk Testi'nin "3 Dakikada Dijital İK Raporunuzu
// Oluşturun" bölümündeki 4 maddelik check-list'in ikonları — idenfit.com'un
// canlı `/ik-dijital-olgunluk-testi/` sayfasından (template id 23868,
// widget `21c6b56`) birebir çıkarıldı (2026-07-29). **Bulgu:** kaynakta bu
// 4 madde AYNI checkmark ikonunu TEKRARLAMIYOR — her maddenin kendi anlamına
// uygun FARKLI bir ikonu var (rozet/skor, büyüteç/analiz, onaylı rapor,
// yıldız/yol haritası). Kaynakta hepsi sabit `stroke="black"` — burada
// `currentColor`'a çevrildi (çağıran yerde `text-heading` ile aynı sonuç,
// tema tutarlılığı için).

interface IconProps {
  className?: string;
}

export function ScoreBadgeIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M19 9C19 10.45 18.57 11.78 17.83 12.89C16.75 14.49 15.04 15.62 13.05 15.91C12.71 15.97 12.36 16 12 16C11.64 16 11.29 15.97 10.95 15.91C8.96 15.62 7.25 14.49 6.17 12.89C5.43 11.78 5 10.45 5 9C5 5.13 8.13 2 12 2C15.87 2 19 5.13 19 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21.2491 18.4704L19.5991 18.8604C19.2291 18.9504 18.9391 19.2304 18.8591 19.6004L18.5091 21.0704C18.3191 21.8704 17.2991 22.1104 16.7691 21.4804L11.9991 16.0004L7.2291 21.4904C6.6991 22.1204 5.6791 21.8804 5.4891 21.0804L5.1391 19.6104C5.0491 19.2404 4.7591 18.9504 4.3991 18.8704L2.7491 18.4804C1.9891 18.3004 1.7191 17.3504 2.2691 16.8004L6.1691 12.9004C7.2491 14.5004 8.9591 15.6304 10.9491 15.9204C11.2891 15.9804 11.6391 16.0104 11.9991 16.0104C12.3591 16.0104 12.7091 15.9804 13.0491 15.9204C15.0391 15.6304 16.7491 14.5004 17.8291 12.9004L21.7291 16.8004C22.2791 17.3404 22.0091 18.2904 21.2491 18.4704Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.58 5.98L13.17 7.15999C13.25 7.31999 13.46 7.48 13.65 7.51L14.72 7.68999C15.4 7.79999 15.56 8.3 15.07 8.79L14.24 9.61998C14.1 9.75998 14.02 10.03 14.07 10.23L14.31 11.26C14.5 12.07 14.07 12.39 13.35 11.96L12.35 11.37C12.17 11.26 11.87 11.26 11.69 11.37L10.69 11.96C9.96997 12.38 9.53997 12.07 9.72997 11.26L9.96997 10.23C10.01 10.04 9.93997 9.75998 9.79997 9.61998L8.96997 8.79C8.47997 8.3 8.63997 7.80999 9.31997 7.68999L10.39 7.51C10.57 7.48 10.78 7.31999 10.86 7.15999L11.45 5.98C11.74 5.34 12.26 5.34 12.58 5.98Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InsightIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" className={className}>
      <path d="M14.0859 12.3641C13.1918 11.6671 12.0673 11.252 10.8458 11.252C8.77361 11.252 7.05346 12.4267 6.19077 14.1651" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.363 11.278C11.7372 9.0419 13.6816 7.33783 16.024 7.33783C18.6341 7.33783 20.75 9.45375 20.75 12.0639C20.75 12.0639 20.75 12.0745 20.7496 12.0944C20.7484 12.2936 20.7349 12.4897 20.7097 12.6823C20.5029 14.6677 18.5484 20.7522 10.7583 20.7522C1.44945 20.7522 0.75036 17.7924 0.75036 17.7924C0.75036 17.7924 0.702641 12.0639 1.70513 8.19712C2.28735 5.95146 2.90173 3.80241 3.31459 2.39519C3.60062 1.4199 4.49511 0.75 5.51148 0.75H8.4396C8.74649 0.75 9.03343 0.902115 9.20569 1.1561L9.90391 2.18553C10.0079 2.33885 10.0635 2.51986 10.0635 2.70515V3.73222C10.0635 4.74802 9.24002 5.57153 8.22418 5.57153H5.7677V6.28492C5.7677 6.95793 5.85933 7.62763 6.03773 8.2766C6.46555 9.83303 6.94951 11.9512 6.19237 14.1643" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.76939 5.57047V4.54116C5.76939 3.87337 6.31073 3.33203 6.97852 3.33203" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.82695 16.8059C3.82695 16.8059 3.88438 16.002 3.19532 15.7148" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ApprovedReportIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M22 13V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.33008 14.4898L9.71008 11.3998C10.0501 10.9598 10.6801 10.8798 11.1201 11.2198L12.9501 12.6598C13.3901 12.9998 14.0201 12.9198 14.3601 12.4898L16.6701 9.50977" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.4792 15.8195L19.7592 16.3894C19.8992 16.6694 20.2492 16.9295 20.5592 16.9895L20.9392 17.0494C22.0792 17.2394 22.3492 18.0794 21.5292 18.9094L21.1792 19.2594C20.9492 19.4994 20.8192 19.9594 20.8892 20.2794L20.9392 20.4895C21.2492 21.8695 20.5192 22.3994 19.3192 21.6794L19.0592 21.5294C18.7492 21.3494 18.2492 21.3494 17.9392 21.5294L17.6792 21.6794C16.4692 22.4094 15.7392 21.8695 16.0592 20.4895L16.1092 20.2794C16.1792 19.9594 16.0492 19.4994 15.8192 19.2594L15.4692 18.9094C14.6492 18.0794 14.9192 17.2394 16.0592 17.0494L16.4392 16.9895C16.7392 16.9395 17.0992 16.6694 17.2392 16.3894L17.5192 15.8195C18.0592 14.7295 18.9392 14.7295 19.4792 15.8195Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RoadmapIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M15.3909 5.21L16.8009 8.02999C16.9909 8.41999 17.5009 8.78999 17.9309 8.86999L20.4809 9.28999C22.1109 9.55999 22.4909 10.74 21.3209 11.92L19.3309 13.91C19.0009 14.24 18.8109 14.89 18.9209 15.36L19.4909 17.82C19.9409 19.76 18.9009 20.52 17.1909 19.5L14.8009 18.08C14.3709 17.82 13.6509 17.82 13.2209 18.08L10.8309 19.5C9.12091 20.51 8.08093 19.76 8.53093 17.82L9.10093 15.36C9.21093 14.9 9.02093 14.25 8.69093 13.91L6.70094 11.92C5.53094 10.75 5.91094 9.56999 7.54094 9.28999L10.0909 8.86999C10.5209 8.79999 11.0309 8.41999 11.2209 8.02999L12.6309 5.21C13.3809 3.68 14.6209 3.68 15.3909 5.21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 5H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
