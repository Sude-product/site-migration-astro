import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher.tsx';
import { MenuIcon, type ResolvedColumn, type ResolvedIntro, type ResolvedReportCard } from './MegaMenu.tsx';
import IdenfitLogo from './icons/IdenfitLogo.tsx';

interface NavLink {
  label: string;
  href: string;
}

/** Masaüstündeki `<MegaMenu>`'nün gördüğü AYNI çözülmüş veri (bkz.
 * `Header.astro`'daki `resolveMegaMenu()`) — ayrı bir mobil veri kaynağı
 * YOK, tek kaynak `navigation.ts`/`sectorContent.ts`/`hubContent.ts`. */
interface MobileNavItem extends NavLink {
  mega?: {
    intro?: ResolvedIntro;
    columns: ResolvedColumn[];
    promoCard?: ResolvedReportCard;
  };
}

export interface MobileMenuProps {
  navItems: MobileNavItem[];
  login: NavLink;
  demo: NavLink;
  currentLocale: string;
  localeUrls: Record<string, string>;
  labels: { open: string; close: string; nav: string };
}

/** Bir kategorinin (ÜRÜNLER/SEKTÖRLER/KURUMSAL/KEŞFET) akordeon içeriği —
 * masaüstündeki `<Column>`'un mobil/dikey karşılığı. Kartlar (Raporlar)
 * burada yatay kaydırma yerine dikey liste olarak gösterilir (dokunmatik
 * akordeon içinde daha kullanışlı); ÜRÜNLER'in büyük "LATER IS NEVER" promo
 * kutusu (dekoratif, kendi sayfasına özgü bir linki yok) kasıtlı olarak
 * render edilmez. `promoCard` (KURUMSAL'ın görsel+kategori+başlıklı kartı)
 * ise GERÇEK bir sayfaya link taşıdığı için (masaüstüyle aynı içerik) burada
 * da gösterilir — Raporlar kartıyla aynı kompakt satır tasarımı kullanılır. */
function MegaAccordionPanel({
  intro,
  columns,
  promoCard,
}: {
  intro?: ResolvedIntro;
  columns: ResolvedColumn[];
  promoCard?: ResolvedReportCard;
}) {
  return (
    <div className="flex flex-col gap-5 py-3 pl-2">
      {intro && (
        <div className="border-b border-gray-100 pb-3">
          <p className="text-xs leading-relaxed text-muted">{intro.description}</p>
          {intro.linkLabel && intro.linkHref && (
            <a href={intro.linkHref} className="mt-1 inline-block text-xs font-semibold text-brand">
              {intro.linkLabel}
            </a>
          )}
        </div>
      )}

      {columns.map((column) => (
        <div key={column.title} className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            {column.icon && <MenuIcon icon={column.icon} className="h-4 w-4 shrink-0 text-brand" />}
            {column.type === 'sublist' ? (
              <a
                href={column.href}
                target={column.external ? '_blank' : undefined}
                rel={column.external ? 'noopener noreferrer' : undefined}
                className="text-xs font-bold uppercase tracking-wide text-heading"
              >
                {column.title}
              </a>
            ) : (
              <h4 className="text-xs font-bold uppercase tracking-wide text-heading">{column.title}</h4>
            )}
          </div>

          {column.type === 'links' && (
            <ul
              className={`flex flex-col gap-0.5 ${
                column.layout === 'grid-2' ? 'grid grid-cols-2 gap-x-4' : ''
              }`}
            >
              {column.links
                .filter((link) => link.overview)
                .map((link) => (
                  <li key={link.label} className="mb-0.5 border-b border-gray-50 pb-1.5">
                    <a href={link.href} className="flex items-center gap-2 py-1 text-sm font-bold text-heading">
                      {link.icon && <MenuIcon icon={link.icon} className="h-3.5 w-3.5 shrink-0 text-brand" />}
                      {link.label}
                    </a>
                  </li>
                ))}
              {column.links
                .filter((link) => !link.overview)
                .map((link) =>
                  column.linkIconStyle === 'content-card' ? (
                    // KEŞFET → İçerikler: masaüstündeki (MegaMenu.tsx) AYNI
                    // açık pembe (#F4CCCE) rozet + açıklama satırı — bu
                    // kolonun ikonları (Bloglar/Dijital İK Olgunluk Testi)
                    // marka kırmızısını kendi çizgi rengi olarak kullanıyor,
                    // eski kırmızı-rozet stiliyle render edilince ikon
                    // görünmez oluyordu (kırmızı-üstü-kırmızı, 2026-09-02
                    // bulgusu).
                    <li key={link.label}>
                      <a href={link.href} className="flex items-start gap-2.5 py-1 text-sm text-body">
                        {link.icon && (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4CCCE]">
                            <MenuIcon icon={link.icon} className="h-5 w-5" />
                          </span>
                        )}
                        <span className="flex flex-col pt-0.5">
                          <span className="font-medium text-heading">{link.label}</span>
                          {link.description && (
                            <span className="text-xs leading-snug text-muted">{link.description}</span>
                          )}
                        </span>
                      </a>
                    </li>
                  ) : column.linkIconStyle === 'inline' ? (
                    // KEŞFET → Hesaplamalar: masaüstündeki gibi rozetsiz,
                    // ikon kendi renginde — AYNI red-on-red nedeniyle
                    // (overtimePay ikonu kırmızı çizgili) eski rozet stiliyle
                    // görünmez oluyordu.
                    <li key={link.label}>
                      <a href={link.href} className="flex items-center gap-2.5 py-1 text-sm text-body">
                        {link.icon && <MenuIcon icon={link.icon} className="h-4 w-4 shrink-0" />}
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <a href={link.href} className="flex items-center gap-2.5 py-1 text-sm text-body">
                        {/* Masaüstündeki SEKTÖRLER rozetiyle (MegaMenu.tsx)
                            tutarlı — dolu marka kırmızısı daire + beyaz ikon
                            (2026-07-27, kullanıcı isteği). */}
                        {link.icon && (
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                            <MenuIcon icon={link.icon} className="h-4 w-4" />
                          </span>
                        )}
                        {link.label}
                      </a>
                    </li>
                  ),
                )}
            </ul>
          )}

          {column.type === 'sublist' && (
            <ul className="flex flex-col gap-0.5">
              {column.items.map((item) => (
                <li key={item}>
                  <a
                    href={column.href}
                    target={column.external ? '_blank' : undefined}
                    rel={column.external ? 'noopener noreferrer' : undefined}
                    className="block py-1 text-sm text-body"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {column.type === 'cards' && (
            <ul className="flex flex-col gap-2">
              {column.cards.map((card) => (
                <li key={card.title}>
                  <a
                    href={card.href}
                    target={card.external ? '_blank' : undefined}
                    rel={card.external ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-2.5 rounded-md border border-gray-100 p-1.5"
                  >
                    <img src={card.image} alt={card.imageAlt} loading="lazy" className="h-12 w-12 shrink-0 rounded object-cover" />
                    <span className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-brand">{card.category}</span>
                      <span className="text-xs leading-snug text-heading">{card.title}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {promoCard && (
        <a
          href={promoCard.href}
          target={promoCard.external ? '_blank' : undefined}
          rel={promoCard.external ? 'noopener noreferrer' : undefined}
          className="flex items-center gap-2.5 rounded-md border border-gray-100 p-1.5"
        >
          <img
            src={promoCard.image}
            alt={promoCard.imageAlt}
            loading="lazy"
            className="h-12 w-12 shrink-0 rounded object-cover"
          />
          <span className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wide text-brand">{promoCard.category}</span>
            <span className="text-xs leading-snug text-heading">{promoCard.title}</span>
          </span>
        </a>
      )}
    </div>
  );
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: MobileNavItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="nav-link-text flex w-full items-center justify-between rounded-md px-3 py-3 text-left transition-colors hover:bg-brand-light"
      >
        {item.label}
        <ChevronDown size={16} aria-hidden="true" className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div id={panelId} hidden={!isOpen}>
        {item.mega && (
          <MegaAccordionPanel intro={item.mega.intro} columns={item.mega.columns} promoCard={item.mega.promoCard} />
        )}
      </div>
    </li>
  );
}

export default function MobileMenu({
  navItems,
  login,
  demo,
  currentLocale,
  localeUrls,
  labels,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Overlay + panel `document.body`'ye portal'lanıyor. `<header>`'ın
  // `backdrop-blur` (backdrop-filter) sınıfı CSS gereği kendi altındaki
  // `position: fixed` elemanlar için containing block'u header'ın KENDİSİ
  // yapıyor (viewport değil) — bu yüzden `inset-y-0` header'ın ~100px'lik
  // yüksekliğine göre çözülüp paneli/overlay'i sıkıştırıyordu (kısa
  // linkli eski menüde neredeyse fark edilmiyordu, akordeon içeriği
  // uzayınca ortaya çıktı). Portal, bu iki elemanı DOM'da header'ın
  // dışına, doğrudan `<body>`'nin altına taşıyıp `fixed`in viewport'a göre
  // doğru çalışmasını sağlıyor. `mounted` yalnızca client'ta true olur
  // (SSR'da `document` yok) — hydration mismatch olmadan, ilk render
  // sunucudakiyle aynı (portal içeriği yok), `useEffect` sonrası eklenir.
  const [mounted, setMounted] = useState(false);

  // DOM boyutu düzeltmesi (2026-08-10) — bkz. CLAUDE.md Açık nokta #24.
  // Panel + tüm akordeon içeriği (~408 element) önceden `lg:hidden`
  // tetikleyiciye rağmen masaüstünde de HER ZAMAN mount'luydu (yalnızca
  // CSS `translate-x-full`/`pointer-events-none` ile görünmez kılınıyordu).
  // `MegaMenu.tsx`'in aynı "her zaman mount'lu" davranışının AKSİNE
  // (bkz. o dosyadaki satır 241-253 — koşullu unmount geçmişte gerçek bir
  // focus/`focusout` bug'ına yol açmıştı), burada tetikleyicinin kendisi
  // zaten `lg:hidden` ile masaüstünde erişilemez — yani "aç/kapa sırasında
  // odaklı bir elemanın kaybolması" riski YOK, panel yalnızca viewport
  // `lg` eşiğinin (1024px) ALTINDAYKEN hiç mount edilir. `matchMedia`'nın
  // `change` event'i pencere yeniden boyutlandırılsa da (ör. DevTools
  // responsive mod) doğru tepki verir; masaüstüne geçilirken panel açık
  // kalmışsa `setOpen(false)` ile kapatılır (aksi halde görünmez ama
  // "açık" bir state'te takılı kalırdı).
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia('(min-width: 1024px)');
    const update = () => {
      setIsDesktop(mql.matches);
      if (mql.matches) {
        setOpen(false);
        setExpandedSlug(null);
      }
    };
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  // DOM boyutu düzeltmesi, mobil taraf (2026-08-17 — bkz. CLAUDE.md "Large
  // DOM size" GEO/SEO bulgusu). Yukarıdaki 2026-08-10 düzeltmesi paneli
  // yalnızca MASAÜSTÜNDE hiç mount etmiyordu — mobil viewport'ta panel
  // hâlâ `open` state'inden BAĞIMSIZ, hydration'dan hemen sonra tam
  // içeriğiyle (~409 element) mount oluyordu (yalnızca `translate-x-full`
  // ile ekran dışına gizleniyordu). Gerçek Chromium ölçümüyle doğrulandı:
  // bu tek katman mobil DOM boyutunun ~%24'ünü oluşturuyordu. `hasOpened`
  // İLK gerçek açılışa kadar `false` kalıyor — panel yalnızca kullanıcı
  // hamburger'e TIKLADIĞINDA mount edilir. Bir kez açıldıktan sonra
  // BİLEREK bir daha unmount edilmiyor (basit/düşük riskli tasarım —
  // Lighthouse/DevTools'un "aşırı DOM boyutu" denetimi SAYFA YÜKLENİRKEN
  // ölçülür, kullanıcı etkileşiminden SONRAKİ büyüme bu denetimi
  // etkilemez; kapanışta yeniden unmount eden bir zamanlayıcı eklemek
  // gereksiz karmaşıklık+risk olurdu, bkz. `entered` yorumu altta).
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => {
    if (open) setHasOpened(true);
  }, [open]);

  // `entered` — panel/overlay'in görsel (transform/opacity) durumu,
  // `open`'dan BİLEREK AYRI tutuluyor. Neden: panel `hasOpened` `true`
  // olana kadar DOM'da HİÇ yoktu — ilk açılışta `open`'ı DOĞRUDAN class
  // olarak kullansaydık, eleman "translate-x-0" (açık) durumuyla
  // DOĞARDI — CSS transition'ın interpolasyon yapacağı bir ÖNCEKİ durum
  // olmazdı, panel kaymadan aniden belirirdi (ilk açılışta kayma
  // animasyonu KAYBOLURDU — "görsel davranışı bozma" riski TAM BURADA).
  // Çözüm: `entered` başlangıçta `false` — eleman İLK PAINT'te "kapalı"
  // (translate-x-full) durumuyla mount olur, BİR FRAME SONRA (`requestAnimationFrame`)
  // `entered` `true` olur — tarayıcı artık gerçek bir öncesi/sonrası
  // durum çifti görüp CSS transition'ı normal şekilde oynatır. Sonraki
  // her açılış/kapanışta panel zaten mount'lu olduğu için bu gecikme
  // görünmez bir fark yaratmıyor (mount'lu bir elemanda class değişimi
  // transition'ı doğal olarak tetikliyor).
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!hasOpened) return;
    if (open) {
      const raf = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(raf);
    }
    setEntered(false);
  }, [open, hasOpened]);

  // Body scroll kilidi (menü açıkken arka plan kaymasın).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape ile kapat + focus trap (Tab menü içinde döngü yapsın).
  // `hasOpened` deps'e EKLENDİ (2026-08-17, DOM boyutu düzeltmesi) — panel
  // artık İLK açılışta `open` `true` olduğu AYNI render'da henüz mount
  // edilmiş olmuyor (bkz. yukarıdaki `hasOpened`/`entered` yorumu), yani
  // bu effect ilk çalıştığında `panelRef.current` hâlâ `null` olabilir.
  // `hasOpened` `false→true` geçişi effect'i BİR KEZ DAHA tetikleyip
  // (artık panel gerçekten DOM'da) ilk-odak/focus-trap'in doğru
  // elemanlarla çalışmasını sağlıyor — aksi halde ilk açılışta "ilk
  // odaklanabilir öğeye odaklan" davranışı SESSİZCE bozulurdu.
  useEffect(() => {
    if (!open) return;

    // Açılınca ilk odaklanabilir öğeye odaklan.
    const focusables = () =>
      panelRef.current
        ? Array.from(
            panelRef.current.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((el) => el.offsetParent !== null)
        : [];

    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, hasOpened]);

  const close = () => {
    setOpen(false);
    setExpandedSlug(null);
    triggerRef.current?.focus(); // odağı hamburger'e geri ver
  };

  return (
    <>
      {/* Hamburger tetikleyici */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={labels.open}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline-flex items-center justify-center rounded-md p-2 text-heading lg:hidden"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Overlay + panel: `document.body`'ye portal'lanır (bkz. `mounted`
          yorumu yukarıda) — header'ın `backdrop-blur`'ü yüzünden `fixed`in
          viewport yerine header'a göre çözülmesini engeller. `!isDesktop`
          (bkz. yukarıdaki DOM boyutu düzeltmesi yorumu) — masaüstünde bu
          alt ağaç HİÇ oluşturulmaz. `hasOpened` (2026-08-17, mobil DOM
          boyutu düzeltmesi) — kullanıcı hamburger'e tıklamadan bu alt ağaç
          MOBİLDE de hiç mount edilmez. Görsel toggle'lar `open` DEĞİL
          `entered` kullanıyor (bkz. `entered`'ın yukarıdaki yorumu — ilk
          mount'ta kayma animasyonunun oynaması için gereken tek-frame'lik
          gecikme). */}
      {mounted &&
        !isDesktop &&
        hasOpened &&
        createPortal(
          <>
            {/* Overlay (yarı saydam siyah) */}
            <div
              onClick={close}
              aria-hidden="true"
              className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ease-out motion-reduce:transition-none lg:hidden ${
                entered ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            />

            {/* Slide-in panel (sağdan, ekranın ~3/4'ü) */}
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={labels.nav}
              className={`fixed inset-y-0 right-0 z-50 flex w-3/4 max-w-sm flex-col bg-surface shadow-xl transition-transform duration-300 ease-out motion-reduce:transition-none lg:hidden ${
                entered ? 'translate-x-0' : 'pointer-events-none translate-x-full'
              }`}
            >
              {/* Panel başlığı + kapat */}
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <span className="text-heading">
                  <IdenfitLogo className="h-6 w-auto" />
                </span>
                <button
                  type="button"
                  onClick={close}
                  aria-label={labels.close}
                  className="rounded-md p-2 text-heading transition-colors hover:text-brand"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Üst: dil + giriş + CTA (2026-09-02, kullanıcı isteği —
                  önceden panelin EN ALTINDAYDI; dil değiştirici o konumda
                  ekran altına çok yakın kaldığı için açılır liste
                  kırpılıyor/tıklanamıyor gibi görünüyordu — buraya, panelin
                  ÜSTÜNE taşındı. "Giriş Yap" da artık düz metin DEĞİL,
                  masaüstünün "Online Sunum Talebi" butonunda zaten kullanılan
                  AYNI `.btn-cta` (beyaz zemin + kırmızı çerçeve) sınıfıyla
                  gerçek bir butona sarmalandı. */}
              <div className="border-b border-gray-100 px-5 py-4">
                <div className="flex justify-center">
                  <LanguageSwitcher currentLocale={currentLocale} urls={localeUrls} />
                </div>
                <div className="mt-3 flex gap-2">
                  <a
                    href={login.href}
                    onClick={close}
                    className="btn-cta inline-flex flex-1 items-center justify-center px-4 py-2.5 text-center text-sm"
                  >
                    {login.label}
                  </a>
                  <a
                    href={demo.href}
                    onClick={close}
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand/90"
                  >
                    {demo.label}
                  </a>
                </div>
              </div>

              {/* Navigasyon */}
              <nav aria-label={labels.nav} className="flex-1 overflow-y-auto px-5 py-4">
                <ul className="flex flex-col gap-1">
                  {navItems.map((item) =>
                    item.mega ? (
                      <AccordionItem
                        key={item.href}
                        item={item}
                        isOpen={expandedSlug === item.href}
                        onToggle={() => setExpandedSlug((prev) => (prev === item.href ? null : item.href))}
                      />
                    ) : (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          onClick={close}
                          className="nav-link-text block rounded-md px-3 py-3 transition-colors hover:bg-brand-light"
                        >
                          {item.label}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
