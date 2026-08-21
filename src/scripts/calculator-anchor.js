// Hesaplama Araçları sayfasına bir anchor ile gelindiğinde (ör. mega-menü
// linki `/hesaplama-araclari/#fazla-mesai`), o aracın <details>'ını otomatik
// açar — native <details> bir wrapping <div id="..."> hedeflendiğinde
// kendiliğinden açılmaz, bu küçük script o boşluğu dolduruyor.
//
// BULUNAN BUG (düzeltildi): önceki sürüm yalnızca AÇMAYI yapıyordu, hiç
// KAPATMIYORDU. Bu, "anchor'lı bir linkten gel → sonra tarayıcı geri
// tuşuyla/hash'siz bir linke tıklayarak anchor'sız hale dön" senaryosunda
// (bu, AYNI SAYFA içinde hash'in kaldırılmasıdır — tarayıcı bunu tam sayfa
// yeniden yükleme YAPMADAN, `hashchange` olayıyla ele alır) önceden açılmış
// akordeonun KAPANMADAN kalmasına yol açıyordu — kullanıcı hash'siz
// sayfaya "geldiğinde" gerçekte hiçbir şey tıklamamış olsa da bir akordeon
// açık görünüyordu. Düzeltme: her çağrıda TÜM akordeonların açık/kapalı
// durumu hash'e göre YENİDEN SENKRONİZE ediliyor (yalnızca eşleşen açık,
// gerisi kapalı; hash boşsa hepsi kapalı) — tek yönlü "aç" yerine simetrik
// "senkronize et" mantığı.
function syncCalculatorAccordionsFromHash() {
  const hash = window.location.hash.replace('#', '');
  // Her `<details>`, React'in `<astro-island>` sarmalayıcısı İÇİNDE
  // render ediliyor (`#<slug> > astro-island > details`) — bu yüzden
  // doğrudan-çocuk seçici (`> details`) YANLIŞLIKLA hiçbir şey
  // eşleştirmiyordu (bulunup düzeltildi). `.querySelector('details')`
  // ara elemanlardan bağımsız, her zaman doğru sonucu bulur.
  document.querySelectorAll('#hesaplama-araclari-list > [id]').forEach((wrapper) => {
    const details = wrapper.querySelector('details');
    if (details) details.open = Boolean(hash) && wrapper.id === hash;
  });
}

syncCalculatorAccordionsFromHash();
window.addEventListener('hashchange', syncCalculatorAccordionsFromHash);
