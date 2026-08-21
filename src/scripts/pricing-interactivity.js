// Fiyatlar sayfası (`/fiyatlar/` vb.) — kartlar/Özellikler/Eklentiler
// arasında senkronize "seçili plan" vurgulaması + sticky plan başlıkları.
// Kaynağın `pricing-tr.js`'indeki `activateColumn()`/sticky-bar mantığının
// vanilla JS karşılığı (2026-08-04, kullanıcı onayıyla — React/hydration
// gerekmez, `marquee-scroll.js` ile aynı ilke). KAPSAM DIŞI (bilinçli,
// kaynakta olsa da bu turda istenmedi): çalışan-sayısına göre dinamik
// fiyat hesaplama (`proOptions`/`smeOptions`) ve satır hover vurgulaması.
const pricingCards = Array.from(document.querySelectorAll('[data-plan-card]'));

if (pricingCards.length) {
  const featureCols = Array.from(document.querySelectorAll('[data-plan-col="feature"]'));
  const addonCols = Array.from(document.querySelectorAll('[data-plan-col="addon"]'));
  const planTitles = Array.from(document.querySelectorAll('[data-plan-title]'));
  const stickyBar = document.getElementById('pricing-sticky-titles');
  const cardsGrid = document.getElementById('pricing-cards');

  // Bir grubun tamamından `is-active`'i kaldırıp yalnızca `index`'teki
  // öğeye ekler — kaynağın `activateColumn()`'daki "forEach remove, sonra
  // tek öğeye add" desenini birebir izliyor.
  const activateInGroup = (group, index) => {
    group.forEach((el) => el.classList.remove('is-active'));
    group[index]?.classList.add('is-active');
  };

  const activatePlan = (index) => {
    activateInGroup(pricingCards, index);
    activateInGroup(featureCols, index);
    activateInGroup(addonCols, index);
    activateInGroup(planTitles, index);

    // Butonlar (kart + eklenti sütunu, `data-plan-btn`) ayrı ele alınıyor —
    // her ikisi de AYNI index'e ait olduğu için tek grup gibi davranmıyor,
    // kaynaktaki gibi kartın KENDİ butonu + o index'teki eklenti sütununun
    // butonu birlikte aktifleşiyor.
    document.querySelectorAll('[data-plan-btn]').forEach((btn) => btn.classList.remove('is-active'));
    pricingCards[index]?.querySelector('[data-plan-btn]')?.classList.add('is-active');
    addonCols[index]?.querySelector('[data-plan-btn]')?.classList.add('is-active');
  };

  activatePlan(0); // sayfa yüklenince kaynaktaki gibi İLK kart (Mikro) seçili

  pricingCards.forEach((card, i) => card.addEventListener('click', () => activatePlan(i)));
  featureCols.forEach((col, i) => col.addEventListener('click', () => activatePlan(i)));
  addonCols.forEach((col, i) => col.addEventListener('click', () => activatePlan(i)));

  if (stickyBar && cardsGrid) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let pricingTicking = false;

    const updateStickyBar = () => {
      const start = cardsGrid.getBoundingClientRect().top + window.scrollY - stickyBar.offsetHeight;
      stickyBar.classList.toggle('is-visible', window.scrollY >= start);
    };

    const onPricingScroll = () => {
      if (pricingTicking) return;
      pricingTicking = true;
      requestAnimationFrame(() => {
        updateStickyBar();
        pricingTicking = false;
      });
    };

    updateStickyBar();
    if (!prefersReducedMotion) {
      window.addEventListener('scroll', onPricingScroll, { passive: true });
      window.addEventListener('resize', onPricingScroll, { passive: true });
    }
  }
}
