// KEŞFET mega-menüsünün "Hesaplamalar" kolonundaki 8 linkin ikonları —
// idenfit.com'un canlı `/online-sunum-talep-et/` sayfasındaki (KEŞFET
// menüsünün gerçek kaynağı, bkz. navigation.ts'in başındaki not)
// `elementor-element-1eaf004` (icon-list widget) içinden birebir çıkarıldı
// (path verisi + stroke renkleri, 2026-07-28). ÜRÜNLER/SEKTÖRLER'in dolu
// kırmızı daire + beyaz ikon rozetinden BİLİNÇLİ olarak FARKLI: kaynakta bu
// liste küçük (16×16), rozetsiz, ÇOK RENKLİ çizgi ikonlar kullanıyor — her
// hesaplama aracının KENDİ imza rengi var (kırmızı/amber/mor/bordo/mavi/
// turkuaz/magenta/yeşil), kaynağın kendi tasarım kararı, uydurulmadı.
// Bu yüzden rengi `currentColor`/`--color-brand` gibi tema token'ına DEĞİL,
// her ikonun kendi `stroke` değerine sabitledik (2026-07-28 doğrulaması).

interface IconProps {
  className?: string;
}

export function OvertimePayIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M7.99983 14.6665C11.6798 14.6665 14.6664 11.6798 14.6664 7.99989C14.6664 4.31994 11.6798 1.33331 7.99983 1.33331C4.31988 1.33331 1.33325 4.31994 1.33325 7.99989" stroke="#FF0000" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.4736 10.1199L8.40699 8.88657C8.04699 8.67324 7.75366 8.15991 7.75366 7.73992V5.00662" stroke="#FF0000" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.66667 12.3332C6.66667 12.8956 6.50917 13.4281 6.23167 13.8781C5.71418 14.7481 4.76169 15.3331 3.66671 15.3331C2.57172 15.3331 1.61924 14.7481 1.10174 13.8781C0.824246 13.4281 0.666748 12.8956 0.666748 12.3332C0.666748 10.6757 2.00923 9.33319 3.66671 9.33319C5.32418 9.33319 6.66667 10.6757 6.66667 12.3332Z" stroke="#FF0000" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.83063 12.3153H2.50513" stroke="#FF0000" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.66675 11.1761V13.5094" stroke="#FF0000" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IncomeTaxIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M15.1108 3.77768V5.39099C15.1108 6.44431 14.4441 7.11097 13.3908 7.11097H11.1108V2.45103C11.1108 1.71104 11.7175 1.11105 12.4575 1.11105C13.1841 1.11772 13.8508 1.41105 14.3308 1.89104C14.8108 2.3777 15.1108 3.04436 15.1108 3.77768Z" stroke="#F5AD1F" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.39436 8.7776H8.40035" stroke="#F5AD1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.77759 4.44434V13.7775C1.77759 14.3309 2.40425 14.6442 2.84424 14.3109L3.98423 13.4576C4.25089 13.2576 4.62422 13.2842 4.86421 13.5242L5.97086 14.6375C6.23086 14.8975 6.65752 14.8975 6.91752 14.6375L8.0375 13.5176C8.27083 13.2842 8.64416 13.2576 8.90416 13.4576L10.0441 14.3109C10.4841 14.6375 11.1108 14.3242 11.1108 13.7775V2.44437C11.1108 1.71105 11.7108 1.11105 12.4441 1.11105H5.11088H4.44422C2.44425 1.11105 1.77759 2.30437 1.77759 3.77768V4.44434Z" stroke="#F5AD1F" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.62451 8.93097L8.26446 5.29102" stroke="#F5AD1F" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.57454 5.44438H4.58053" stroke="#F5AD1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EmployerCostIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M13.444 7.31096V4.47101C13.444 1.78438 12.8174 1.11105 10.2974 1.11105H5.25746C2.7375 1.11105 2.11084 1.78438 2.11084 4.47101V11.9776C2.11084 13.7509 3.08417 14.1709 4.26415 12.9042L4.2708 12.8976C4.81746 12.3176 5.65078 12.3642 6.12411 12.9975L6.79744 13.8975" stroke="#772BAE" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.11084 4.44437H10.4441" stroke="#772BAE" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.77759 7.1109H9.77753" stroke="#772BAE" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9183 9.62437L9.55835 11.9843C9.46502 12.0777 9.37834 12.251 9.35834 12.3777L9.23167 13.2777C9.18501 13.6043 9.41168 13.831 9.73834 13.7843L10.6383 13.6577C10.765 13.6377 10.945 13.551 11.0317 13.4577L13.3916 11.0977C13.7983 10.691 13.9916 10.2177 13.3916 9.61772C12.7983 9.02439 12.325 9.21771 11.9183 9.62437Z" stroke="#772BAE" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5771 9.96442C11.7771 10.6844 12.3371 11.2444 13.0571 11.4444" stroke="#772BAE" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SeverancePayIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M8.8533 2.33328H3.62671C1.26007 2.33328 0.666748 2.91995 0.666748 5.25992V10.7398C0.666748 13.0798 1.26007 13.6665 3.62671 13.6665H11.7066C14.0222 13.6665 14.6402 13.1048 14.6657 10.8887V10.2221" stroke="#842438" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.88938 7.88857C5.7178 7.88857 6.38936 7.21699 6.38936 6.38857C6.38936 5.56015 5.7178 4.88861 4.88938 4.88861C4.06097 4.88861 3.3894 5.56015 3.3894 6.38857C3.3894 7.21699 4.06097 7.88857 4.88938 7.88857Z" stroke="#842438" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.55543 11.222C7.55543 9.93369 6.36211 8.88873 4.8888 8.88873C3.41549 8.88873 2.22217 9.93369 2.22217 11.222" stroke="#842438" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.3333 3.99991C15.3333 5.83989 13.84 7.3332 12 7.3332C10.1601 7.3332 8.66675 5.83989 8.66675 3.99991C8.66675 2.15994 10.1601 0.666626 12 0.666626C13.84 0.666626 15.3333 2.15994 15.3333 3.99991Z" stroke="#842438" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.2372 5.05984L12.2039 4.44318C12.0239 4.33651 11.8772 4.07985 11.8772 3.86985V2.5032" stroke="#842438" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.3333 6.5751V8.46787C15.3333 10.0716 13.8415 11.3676 12.0047 11.3676C10.1679 11.3676 8.66675 10.0716 8.66675 8.46787V6.5751C8.66675 8.17881 10.1586 9.31632 12.0047 9.31632C13.8415 9.31632 15.3333 8.16948 15.3333 6.5751Z" stroke="#842438" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.3333 4.22211V6.5748C15.3333 8.1785 13.8415 9.31601 12.0047 9.31601C10.1679 9.31601 8.66675 8.16918 8.66675 6.5748L8.66675 4.22211" stroke="#842438" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SalaryRaiseIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M14.6664 7.99986C14.6664 11.6798 11.6798 14.6664 7.99983 14.6664C4.31988 14.6664 1.33325 11.6798 1.33325 7.99986C1.33325 4.31991 4.31988 1.33328 7.99983 1.33328" stroke="#008EDF" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.6667 0.666611V3.33324H15.3334" stroke="#008EDF" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.6667 5.99982V3.33319H10.0001" stroke="#008EDF" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.55566 4.22208V10.8887C8.48813 10.9627 10.4602 10.7109 10.889 9.1109" stroke="#008EDF" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.77811 7.11089L6.44482 8.88864" stroke="#008EDF" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.33329 5.55554L6 7.3333" stroke="#008EDF" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CorporateTaxIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M4.48656 13.1331C5.03322 12.5464 5.86654 12.5931 6.34653 13.2331L7.01986 14.1331C7.55985 14.8464 8.43317 14.8464 8.97316 14.1331L9.64649 13.2331C10.1265 12.5931 10.9598 12.5464 11.5065 13.1331C12.6931 14.3997 13.6598 13.9797 13.6598 12.2064V4.69321C13.6664 2.00658 13.0398 1.33325 10.5198 1.33325H5.47988C2.95991 1.33325 2.33325 2.00658 2.33325 4.69321V12.1998C2.33325 13.9797 3.30657 14.3931 4.48656 13.1331Z" stroke="#00CFC5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 8.66654L9.99995 4.6666" stroke="#00CFC5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.99642 8.66658H10.0024" stroke="#00CFC5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.99642 4.99992H6.0024" stroke="#00CFC5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MealAllowanceIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M12.9998 8.33303C12.9998 7.41305 13.7464 6.66639 14.6664 6.66639V5.99973C14.6664 3.3331 13.9997 2.66644 11.3331 2.66644H4.66654C1.99991 2.66644 1.33325 3.3331 1.33325 5.99973V6.33306C2.25324 6.33306 2.9999 7.07972 2.9999 7.9997C2.9999 8.91969 2.25324 9.66635 1.33325 9.66635V9.99968C1.33325 12.6663 1.99991 13.333 4.66654 13.333H11.3331C13.9997 13.333 14.6664 12.6663 14.6664 9.99968C13.7464 9.99968 12.9998 9.25302 12.9998 8.33303Z" stroke="#FF00D0" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 9.83318L9.99995 5.83324" stroke="#FF00D0" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.99642 9.8331H10.0024" stroke="#FF00D0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.99642 6.16657H6.0024" stroke="#FF00D0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function NoticePeriodIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M12.0266 8.58873C11.7466 8.86206 11.5866 9.25539 11.6266 9.67538C11.6866 10.3954 12.3466 10.922 13.0666 10.922H14.3332V11.7154C14.3332 13.0953 13.2066 14.222 11.8266 14.222H5.09337C5.64669 13.7353 6.00002 13.022 6.00002 12.222C6.00002 10.7487 4.80671 9.55539 3.33339 9.55539C2.70673 9.55539 2.12674 9.77539 1.66675 10.1421V7.22876C1.66675 5.84878 2.7934 4.72212 4.17338 4.72212H11.8266C13.2066 4.72212 14.3332 5.84878 14.3332 7.22876V8.18875H12.9866C12.6133 8.18875 12.2733 8.3354 12.0266 8.58873Z" stroke="#74BE1F" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.0392 8.86891V10.2423C15.0392 10.6089 14.7459 10.9089 14.3726 10.9222H13.0659C12.3459 10.9222 11.686 10.3956 11.626 9.67558C11.586 9.25559 11.7459 8.86226 12.0259 8.58893C12.2726 8.3356 12.6126 8.18895 12.9859 8.18895H14.3726C14.7459 8.20228 15.0392 8.50225 15.0392 8.86891Z" stroke="#74BE1F" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.66675 7.55536H9.33335" stroke="#74BE1F" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.00001 12.2221C6.00001 13.022 5.64668 13.7354 5.09335 14.222C4.62003 14.6354 4.0067 14.8887 3.33338 14.8887C1.86007 14.8887 0.666748 13.6954 0.666748 12.2221C0.666748 11.3821 1.05341 10.6287 1.66673 10.1421C2.12673 9.77542 2.70672 9.55542 3.33338 9.55542C4.80669 9.55542 6.00001 10.7487 6.00001 12.2221Z" stroke="#74BE1F" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5008 11.3888V12.3887L2.66748 12.8887" stroke="#74BE1F" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.1509 4.69998C11.9909 4.67331 11.8242 4.66665 11.6509 4.66665H4.98433C4.79766 4.66665 4.61767 4.67999 4.44434 4.70665C4.53767 4.51999 4.671 4.34666 4.831 4.18666L6.99764 2.01335C7.91096 1.1067 9.39094 1.1067 10.3043 2.01335L11.4709 3.19335C11.8976 3.61334 12.1242 4.14665 12.1509 4.69998Z" stroke="#74BE1F" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
