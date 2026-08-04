// SSS sayfasının kategori sekmeleri — idenfit.com'un canlı /sss/ sayfasında
// bulunan gerçek JS mantığının birebir aynısı: tıklanan butona `is-active`,
// eşleşen panelden `hidden` kaldırılır, diğerlerine eklenir. React'e gerek
// yok, vanilla JS yeterli (bkz. scroll-reveal.js'teki aynı yaklaşım).
const buttons = document.querySelectorAll('.faq-tab-btn');
const panels = document.querySelectorAll('.faq-tab-panel');

buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    buttons.forEach((b) => b.classList.remove('is-active'));
    panels.forEach((p) => p.classList.add('hidden'));
    btn.classList.add('is-active');
    const targetId = btn.dataset.faqTab;
    if (targetId) document.getElementById(targetId)?.classList.remove('hidden');
  });
});
