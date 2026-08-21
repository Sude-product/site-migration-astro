import { useEffect, useId, useRef, useState } from 'react';
import {
  Newspaper,
  ClipboardCheck,
  Calculator,
  FileDown,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Briefcase,
  Plane,
  ShoppingBag,
  Zap,
  Heart,
  GraduationCap,
  Shield,
  Building,
  Factory,
  Scale,
  Truck,
} from 'lucide-react';
import { UserIcon, ClockIcon, AwardIcon, PlugIcon } from './icons/IdenfitIcons.tsx';
import {
  OvertimePayIcon,
  IncomeTaxIcon,
  EmployerCostIcon,
  SeverancePayIcon,
  SalaryRaiseIcon,
  CorporateTaxIcon,
  MealAllowanceIcon,
  NoticePeriodIcon,
} from './icons/CalculatorIcons.tsx';
import { BlogIcon, DigitalMaturityTestIcon } from './icons/ExploreIcons.tsx';
import type { MegaMenuIcon } from '../data/navigation';

const CALC_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  overtimePay: OvertimePayIcon,
  incomeTax: IncomeTaxIcon,
  employerCost: EmployerCostIcon,
  severancePay: SeverancePayIcon,
  salaryRaise: SalaryRaiseIcon,
  corporateTax: CorporateTaxIcon,
  mealAllowance: MealAllowanceIcon,
  noticePeriod: NoticePeriodIcon,
};

const EXPLORE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  blog: BlogIcon,
  digitalMaturityTest: DigitalMaturityTestIcon,
};

const LUCIDE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Newspaper,
  ClipboardCheck,
  Calculator,
  FileDown,
  Utensils,
  Briefcase,
  Plane,
  ShoppingBag,
  Zap,
  Heart,
  GraduationCap,
  Shield,
  Building,
  Factory,
  Scale,
  Truck,
};

export function MenuIcon({ icon, className }: { icon?: MegaMenuIcon; className?: string }) {
  if (!icon) return null;
  if (icon.source === 'idenfit') {
    switch (icon.name) {
      case 'user':
        return <UserIcon className={className} />;
      case 'clock':
        return <ClockIcon className={className} />;
      case 'award':
        return <AwardIcon className={className} />;
      case 'plug':
        return <PlugIcon className={className} />;
      default:
        return null;
    }
  }
  if (icon.source === 'calc') {
    const CalcIcon = CALC_ICONS[icon.name];
    if (!CalcIcon) return null;
    return <CalcIcon className={className} />;
  }
  if (icon.source === 'explore') {
    const ExploreIcon = EXPLORE_ICONS[icon.name];
    if (!ExploreIcon) return null;
    return <ExploreIcon className={className} />;
  }
  const Lucide = LUCIDE_ICONS[icon.name];
  if (!Lucide) return null;
  return <Lucide className={className} />;
}

export interface ResolvedLink {
  label: string;
  href: string;
  external?: boolean;
  icon?: MegaMenuIcon;
  /** "Genel Bakış" (hub sayfası) linki — diğer modül linklerinden görsel
   * olarak ayrılır (bkz. Column bileşeni). */
  overview?: boolean;
  /** Yalnızca `linkIconStyle:'content-card'` için — bkz. `navigation.ts`'teki
   * `MegaMenuLink.description` yorumu. */
  description?: string;
}
export interface ResolvedLinksColumn {
  type: 'links';
  title: string;
  icon?: MegaMenuIcon;
  links: ResolvedLink[];
  /** Uzun listeler için (ör. SEKTÖRLER, 12 öğe) çok kolonlu grid. */
  layout?: 'list' | 'grid-2' | 'grid-3';
  /** bkz. `navigation.ts`'teki `LinksColumn.linkIconStyle` yorumu. */
  linkIconStyle?: 'badge' | 'inline' | 'content-card';
}
export interface ResolvedSublistColumn {
  type: 'sublist';
  title: string;
  icon?: MegaMenuIcon;
  href: string;
  external?: boolean;
  items: string[];
}
export interface ResolvedReportCard {
  category: string;
  title: string;
  image: string;
  imageAlt: string;
  href: string;
  external?: boolean;
}
export interface ResolvedCardsColumn {
  type: 'cards';
  title: string;
  icon?: MegaMenuIcon;
  cards: ResolvedReportCard[];
  nextAriaLabel: string;
  prevAriaLabel: string;
}
export type ResolvedColumn = ResolvedLinksColumn | ResolvedSublistColumn | ResolvedCardsColumn;

export interface ResolvedIntro {
  title: string;
  description: string;
  linkLabel?: string;
  linkHref?: string;
}
export interface ResolvedPromo {
  titleLines: string[];
  description: string;
  ctaText: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
}

export interface MegaMenuProps {
  label: string;
  intro?: ResolvedIntro;
  columns: ResolvedColumn[];
  promo?: ResolvedPromo;
  /** Sağ tarafta gösterilen küçük promo kart (görsel + kategori + başlık) —
   * `promo`'dan (ÜRÜNLER'in büyük paneli) FARKLI, `ReportCard`'la aynı şekli
   * kullanan bağımsız bir alan (bkz. `navigation.ts` — `MegaMenuContent.promoCard`). */
  promoCard?: ResolvedReportCard;
}

const CLOSE_DELAY = 300;

// Kart-genişliği (w-28 = 112px) + `gap-3` (12px) — bir "sonraki/önceki"
// tıklaması tam olarak bir kart kadar kaydırır.
const CARD_STEP = 124;

function CardsRow({ cards, nextAriaLabel, prevAriaLabel }: { cards: ResolvedReportCard[]; nextAriaLabel: string; prevAriaLabel: string }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  // `null` = henüz ölçülmedi. Bilinçli ayrım: `atEnd` ölçüm tamamlanana
  // kadar `false` kabul edilir (buton görünür kalır) — `0` başlangıç
  // değeriyle karıştırılırsa (bulunan gerçek bir bug, 2026-07-28) ilk
  // render'da `offset(0) >= maxOffset(0)` her zaman true çıkıp "İleri"
  // oku hiç görünmeden kalıyordu.
  const [maxOffset, setMaxOffset] = useState<number | null>(null);

  // Kaydırılabilir gerçek mesafeyi (track genişliği - görünür alan) ölçüp
  // ok butonlarının ne zaman gizleneceğini belirler — kart sayısı/ekran
  // genişliği değişse de (ör. pencere yeniden boyutlandırılsa) doğru kalır.
  useEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;
      const next = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setMaxOffset(next);
      setOffset((o) => Math.min(o, next));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [cards]);

  const goTo = (direction: 1 | -1) => {
    setOffset((o) => Math.min(maxOffset ?? Infinity, Math.max(0, o + direction * CARD_STEP)));
  };

  const atStart = offset <= 0;
  const atEnd = maxOffset !== null && offset >= maxOffset;

  return (
    <div className="relative">
      <div ref={viewportRef} className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-3 pb-1 transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${offset}px)` }}
        >
          {cards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              target={card.external ? '_blank' : undefined}
              rel={card.external ? 'noopener noreferrer' : undefined}
              role="menuitem"
              className="w-28 shrink-0 rounded-md border border-gray-100 bg-surface p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md motion-reduce:hover:translate-y-0"
            >
              <img src={card.image} alt={card.imageAlt} loading="lazy" className="mb-2 h-28 w-full rounded object-cover" />
              <span className="block text-[10px] font-bold uppercase tracking-wide text-brand">{card.category}</span>
              <span className="mt-0.5 block text-xs leading-snug text-heading">{card.title}</span>
            </a>
          ))}
        </div>
      </div>
      {/* BUG DÜZELTMESİ (2026-07-30): Butonlar önceden `{!atStart && (...)}`/
          `{!atEnd && (...)}` ile DOM'dan TAMAMEN kaldırılıyordu. Sınıra
          ulaşan bir tıklama (ör. son karta gelindiğinde "İleri" oku) o AN
          odaklı olan butonun kendisini DOM'dan siliyordu — tarayıcı, odaklı
          bir eleman DOM'dan kaldırılınca `relatedTarget:null` ile bir
          `focusout` tetikliyor; bu da `MegaMenu`'nün `rootRef` üzerindeki
          "dışarı odaklanınca kapat" listener'ına ulaşıp
          (`rootRef.current.contains(null)` → `false`) mega-menüyü
          KAPATIYORDU (`stopPropagation` eksikliği DEĞİL — click event'i
          değil, ayrı bir focusout event'i, farklı bir mekanizma). Düzeltme:
          butonlar HER ZAMAN DOM'da kalıyor, görünürlük/tıklanabilirlik
          yalnızca CSS (`opacity`/`pointer-events`) ile kontrol ediliyor —
          odaklı bir eleman asla kaldırılmıyor, `focusout` hiç tetiklenmiyor. */}
      <button
        type="button"
        onClick={() => goTo(-1)}
        aria-label={prevAriaLabel}
        aria-hidden={atStart}
        tabIndex={atStart ? -1 : 0}
        className={`absolute -left-3 top-1/3 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-surface shadow-sm transition-all duration-200 hover:scale-110 hover:border-brand hover:text-brand hover:shadow-md motion-reduce:hover:scale-100 ${
          atStart ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <ChevronLeft size={14} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => goTo(1)}
        aria-label={nextAriaLabel}
        aria-hidden={atEnd}
        tabIndex={atEnd ? -1 : 0}
        className={`absolute -right-3 top-1/3 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-surface shadow-sm transition-all duration-200 hover:scale-110 hover:border-brand hover:text-brand hover:shadow-md motion-reduce:hover:scale-100 ${
          atEnd ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <ChevronRight size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

function Column({ column }: { column: ResolvedColumn }) {
  return (
    <div className="flex flex-col gap-3">
      {column.icon && <MenuIcon icon={column.icon} className="text-brand" />}

      {column.type === 'sublist' ? (
        <a
          href={column.href}
          target={column.external ? '_blank' : undefined}
          rel={column.external ? 'noopener noreferrer' : undefined}
          role="menuitem"
          className="flex items-center gap-1 text-sm font-bold text-heading transition-colors hover:text-brand"
        >
          {column.title}
          <ChevronRight size={14} aria-hidden="true" />
        </a>
      ) : (
        <h3 className="text-sm font-bold text-heading">{column.title}</h3>
      )}

      {column.type === 'links' && (
        <>
          {/* "Genel Bakış" (hub sayfası) linki — diğer modül linklerinden
              ayırt edilsin diye listenin üstünde, daha kalın font'la ve
              altında bir ayraçla ayrı render edilir. */}
          {column.links
            .filter((link) => link.overview)
            .map((link) => (
              <a
                key={link.label}
                href={link.href}
                role="menuitem"
                className="mb-1 flex items-center gap-2 border-b border-gray-100 pb-2 text-sm font-bold text-heading transition-colors hover:text-brand"
              >
                {link.icon && <MenuIcon icon={link.icon} className="h-4 w-4 shrink-0 text-brand" />}
                {link.label}
              </a>
            ))}
          <ul
            className={
              column.layout === 'grid-3'
                ? 'grid grid-cols-3 gap-x-6 gap-y-3'
                : column.layout === 'grid-2'
                  ? 'grid grid-cols-2 gap-x-6 gap-y-3'
                  : column.linkIconStyle === 'content-card'
                    ? 'flex flex-col gap-4'
                    : 'flex flex-col gap-2'
            }
          >
            {column.links
              .filter((link) => !link.overview)
              .map((link) =>
                column.linkIconStyle === 'content-card' ? (
                  // KEŞFET → İçerikler (2026-07-30): kaynağın gerçek
                  // #explore-menu HTML'inden ölçülen büyük dairesel rozet +
                  // başlık + açıklama kartı. Rozet: `background-color:#F4CCCE`
                  // (post-24918.css, widget `6aaeea4`/`4208f72`),
                  // `.elementor-icon{font-size:32px;padding:10px}` → çap
                  // 32+2×10=52px. Başlık: `font-size:14px;font-weight:500`.
                  // Açıklama: `font-size:14px;font-weight:400;line-height:1.5em`.
                  <li key={link.label}>
                    <a href={link.href} role="menuitem" className="group flex items-start gap-3">
                      {link.icon && (
                        <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#F4CCCE]">
                          <MenuIcon icon={link.icon} className="h-8 w-8" />
                        </span>
                      )}
                      <span className="flex flex-col pt-1">
                        <span className="text-sm font-medium text-heading transition-colors group-hover:text-brand">
                          {link.label}
                        </span>
                        {link.description && (
                          <span className="mt-0.5 text-sm leading-relaxed text-muted">{link.description}</span>
                        )}
                      </span>
                    </a>
                  </li>
                ) : column.linkIconStyle === 'inline' ? (
                  // KEŞFET → Hesaplamalar (2026-07-28): kaynakta bu liste
                  // rozetsiz, küçük (16px) ikon + metin — SEKTÖRLER'in dolu
                  // kırmızı rozetini burada ZORLAMAK kaynaktan sapardı (bkz.
                  // `navigation.ts`'teki `linkIconStyle` yorumu). Hover rengi
                  // de kırmızı DEĞİL: kaynağın genel `a:hover{color:var(
                  // --uicore-secondary-color)}` kuralı (mor, `#6F2C90`) bu
                  // menüde herhangi bir daha özel override taşımıyor —
                  // `text-secondary` (bizim aynı tona bağlı token'ımız).
                  <li key={link.label}>
                    <a
                      href={link.href}
                      role="menuitem"
                      className="flex items-center gap-2.5 text-sm text-body transition-colors hover:text-secondary"
                    >
                      {link.icon && <MenuIcon icon={link.icon} className="h-4 w-4 shrink-0" />}
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      role="menuitem"
                      className="flex items-center gap-3 text-sm text-body transition-colors hover:text-brand"
                    >
                      {/* Yalnızca SEKTÖRLER'in link-seviyesi ikonları buradan
                          geçiyor (ÜRÜNLER'in modül linklerinde ikon yok, kolon
                          ikonları ayrı render ediliyor) — ÜRÜNLER'in
                          UserIcon/ClockIcon vb. ikon-kutu stiliyle (dolu
                          marka kırmızısı daire + beyaz ikon) tutarlı bir
                          görsel dil için aynı rozet burada da uygulandı
                          (2026-07-27, kullanıcı isteği — önceden düz ikon,
                          arka plansızdı). */}
                      {link.icon && (
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                          <MenuIcon icon={link.icon} className="h-5 w-5" />
                        </span>
                      )}
                      {link.label}
                    </a>
                  </li>
                ),
              )}
          </ul>
        </>
      )}

      {column.type === 'sublist' && (
        <ul className="flex flex-col gap-2">
          {column.items.map((item) => (
            <li key={item}>
              <a
                href={column.href}
                target={column.external ? '_blank' : undefined}
                rel={column.external ? 'noopener noreferrer' : undefined}
                role="menuitem"
                className="flex items-center gap-1.5 text-sm text-body transition-colors hover:text-brand"
              >
                <Calculator size={13} className="shrink-0 text-brand" aria-hidden="true" />
                {item}
              </a>
            </li>
          ))}
        </ul>
      )}

      {column.type === 'cards' && (
        <CardsRow cards={column.cards} nextAriaLabel={column.nextAriaLabel} prevAriaLabel={column.prevAriaLabel} />
      )}
    </div>
  );
}

export default function MegaMenu({ label, intro, columns, promo, promoCard }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const clearTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearTimer();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

  const openNow = () => {
    clearTimer();
    setOpen(true);
  };

  useEffect(() => clearTimer, []);

  // Dışarı odaklanınca kapat (klavye ile Tab'la menüden çıkış).
  useEffect(() => {
    if (!open) return;
    const onFocusOut = (e: FocusEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.relatedTarget as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const node = rootRef.current;
    node?.addEventListener('focusout', onFocusOut);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      node?.removeEventListener('focusout', onFocusOut);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // Kolon grid şablonu: intro (varsa) + kolonlar + promo (varsa).
  // 'cards' kolonu görsel kartlar içerdiği için biraz daha geniş pay alır.
  const templateParts: string[] = [];
  if (intro) templateParts.push('minmax(220px, 260px)');
  templateParts.push(
    ...columns.map((c) => (c.type === 'cards' ? 'minmax(260px, 1.4fr)' : 'minmax(160px, 1fr)')),
  );
  if (promo) templateParts.push('minmax(260px, 300px)');

  // KOMPAKT MOD (2026-07-24): intro/promo YOK ve tek bir düz link listesi
  // kolonu (grid layout DEĞİL — SEKTÖRLER'in 12 öğelik grid-3'ü zengin
  // içerik sayılır, tam genişlik panelde kalır) varsa — ör. KURUMSAL'ın 4
  // basit linki — tam genişlik mega-menü yerine, tetikleyici butonun hemen
  // altında, yalnızca içerik kadar geniş küçük bir dropdown gösterilir.
  // Kullanıcı bunu "ÜRÜNLER/SEKTÖRLER gibi tam genişlik panel, ama
  // KURUMSAL'ın zengin kolon içeriği yok" gözlemiyle istedi.
  const singleLinksColumn =
    !intro && !promo && !promoCard && columns.length === 1 && columns[0].type === 'links' && (!columns[0].layout || columns[0].layout === 'list')
      ? columns[0]
      : null;

  // KOMPAKT + PROMO KART MOD (2026-07-27): KURUMSAL gibi tek düz link
  // listesi kolonuna sahip bir menüde `promoCard` de tanımlıysa, tam
  // genişlik panele geçmek yerine yukarıdaki kompakt dropdown'un GENİŞ
  // hali kullanılır — sol tarafta linkler, sağ tarafta (kullanıcının
  // istediği yerleşim) görsel+kategori+başlıklı kart, `<li>`'ye göre
  // konumlanır (viewport genişliğine yayılmaz).
  const promoCardMode =
    !intro && !promo && promoCard && columns.length === 1 && columns[0].type === 'links' && (!columns[0].layout || columns[0].layout === 'list')
      ? { column: columns[0] as ResolvedLinksColumn, card: promoCard }
      : null;

  const trigger = (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={panelId}
      onClick={() => setOpen((v) => !v)}
      className="nav-link-text flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {label}
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );

  if (singleLinksColumn) {
    return (
      <li ref={rootRef} onMouseEnter={openNow} onMouseLeave={scheduleClose} className="relative">
        {trigger}

        {/* Küçük dropdown: `<li>`'nin kendisine göre (`relative`, tam
            genişlik panelin AKSİNE) konumlanır — yalnızca içerik kadar
            geniş, sayfanın geri kalanı görünür kalır. */}
        <div
          id={panelId}
          role="menu"
          aria-label={label}
          className={`absolute left-0 top-full z-[100] mt-2 min-w-[200px] rounded-md border border-gray-100 bg-menu-surface p-2 shadow-lg transition-all duration-200 ease-out motion-reduce:transition-none motion-reduce:duration-0 ${
            open
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0'
          }`}
        >
          <ul className="flex flex-col gap-0.5">
            {singleLinksColumn.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  role="menuitem"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-body transition-colors hover:bg-brand-light hover:text-brand"
                >
                  {link.icon && <MenuIcon icon={link.icon} className="h-4 w-4 shrink-0 text-brand" />}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  }

  if (promoCardMode) {
    return (
      <li ref={rootRef} onMouseEnter={openNow} onMouseLeave={scheduleClose} className="relative">
        {trigger}

        {/* Kompakt dropdown'un geniş hali: `<li>`'ye göre konumlanır (tam
            genişlik panelin AKSİNE), sol linkler + sağ promo kart yan yana. */}
        <div
          id={panelId}
          role="menu"
          aria-label={label}
          className={`absolute left-0 top-full z-[100] mt-2 flex w-[420px] gap-4 rounded-md border border-gray-100 bg-menu-surface p-4 shadow-lg transition-all duration-200 ease-out motion-reduce:transition-none motion-reduce:duration-0 ${
            open
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0'
          }`}
        >
          <ul className="flex w-36 shrink-0 flex-col gap-0.5">
            {promoCardMode.column.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  role="menuitem"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-body transition-colors hover:bg-brand-light hover:text-brand"
                >
                  {link.icon && <MenuIcon icon={link.icon} className="h-4 w-4 shrink-0 text-brand" />}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={promoCardMode.card.href}
            target={promoCardMode.card.external ? '_blank' : undefined}
            rel={promoCardMode.card.external ? 'noopener noreferrer' : undefined}
            role="menuitem"
            className="group flex flex-1 flex-col overflow-hidden rounded-md border border-gray-100 bg-surface transition-colors hover:border-brand"
          >
            <img
              src={promoCardMode.card.image}
              alt={promoCardMode.card.imageAlt}
              loading="lazy"
              /* Sabit `h-24` + `object-cover`, görselin gerçek oranından
                 (900×809, ~1.11:1) çok daha geniş/kısa bir kutuya sığdırmaya
                 çalışıyordu — bu da üstten/alttan ağır kırpmaya yol açıyordu
                 (2026-07-27 kullanıcı bulgusu). Kutunun `aspect-ratio`'su
                 görselin gerçek oranıyla birebir eşleştirilip `object-contain`
                 kullanıldı — kırpma yok, boşluk da yok (oranlar eşit). */
              className="aspect-[900/809] w-full object-contain"
            />
            <span className="flex flex-col gap-1 p-3">
              <span className="text-[10px] font-bold uppercase tracking-wide text-brand">
                {promoCardMode.card.category}
              </span>
              <span className="text-xs font-bold leading-snug text-heading transition-colors group-hover:text-brand">
                {promoCardMode.card.title}
              </span>
            </span>
          </a>
        </div>
      </li>
    );
  }

  return (
    <li ref={rootRef} onMouseEnter={openNow} onMouseLeave={scheduleClose}>
      {trigger}

      {/*
        Tam genişlik dropdown: konumlandırma en yakın "positioned" ata olan
        <header>'e (sticky) göre yapılır — bu <li>'ye göre DEĞİL, çünkü li
        dar ve viewport'un solunda; ona göre ortalamak paneli viewport
        merkezinden kaydırıp sağ tarafın (ör. hero'daki kırmızı promo kutusu)
        açıkta kalmasına yol açıyordu. `inset-x-0` + header (w-full) sayesinde
        panel gerçek viewport genişliğini kaplar; arkaplan (bg-menu-surface,
        kaynaktaki `#mega-menu` container'ının gerçek rengi — bkz.
        global.css'teki `--color-menu-surface` token yorumu) da aynı
        elemanın üzerinde, tam opak.
      */}
      <div
        id={panelId}
        role="menu"
        aria-label={label}
        className={`absolute inset-x-0 top-full z-[100] border-t border-gray-100 bg-menu-surface shadow-2xl transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:duration-0 ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <div className="mx-auto max-w-6xl bg-menu-surface px-8 py-8">
          <div className="grid gap-6" style={{ gridTemplateColumns: templateParts.join(' ') }}>
            {intro && (
              <div className="flex flex-col gap-3 border-r border-gray-100 pr-6">
                <h3 className="text-base font-bold text-heading">{intro.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{intro.description}</p>
                {intro.linkLabel && intro.linkHref && (
                  <a href={intro.linkHref} role="menuitem" className="text-sm font-semibold text-brand hover:underline">
                    {intro.linkLabel}
                  </a>
                )}
              </div>
            )}

            {columns.map((col) => (
              <Column key={col.title} column={col} />
            ))}

            {promo && (
              <div className="flex flex-col items-center rounded-lg bg-brand-light p-5 text-center">
                {/* Önceden `h-24 w-24 rounded-full object-cover` — küçük,
                    daire içine kırpılmış bir görsel (kaynağın 590×590
                    kare görselinin köşelerini kaybediyordu). Kullanıcı
                    isteğiyle (2026-07-27) büyütüldü + `aspect-square`
                    (görselin gerçek 1:1 oranıyla birebir) + `object-contain`
                    ile TAM görsel, kırpma olmadan gösteriliyor. */}
                <img
                  src={promo.image}
                  alt={promo.imageAlt}
                  loading="lazy"
                  className="mb-3 aspect-square w-full object-contain"
                />
                <h3 className="text-lg font-extrabold leading-tight text-heading">
                  {promo.titleLines.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </h3>
                <p className="mt-2 text-xs text-muted">{promo.description}</p>
                <a
                  href={promo.ctaHref}
                  role="menuitem"
                  className="btn-cta mt-4 px-4 py-2 text-xs font-bold"
                >
                  {promo.ctaText}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
