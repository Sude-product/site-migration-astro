---
slug: ai-etigi-ik-ise-alim-onyargisi-onleme
title: 'İK''da Yapay Zekâ Etiği: İşe Alım Algoritmalarında Önyargıları Nasıl Önleriz?'
metaTitle: İşe Alım Algoritmalarında Yapay Zekâ Etiği
date: 2026-09-08T23:50:00.000Z
modifiedDate: 2026-09-08T23:51:00.000Z
excerpt: >-
  Yapay zekâ binlerce özgeçmişi saniyeler içinde tarıyor. Peki işe alım
  algoritmaları geçmişin önyargılarını nasıl devralıyor ve bu risk nasıl
  azaltılabilir?
featuredImage:
  image: >-
    /img/blog-featured/ai-etigi-ik-ise-alim-onyargisi-onleme/featuredImage/image.png
  alt: >-
    Aday kartlarından oluşan bir işe alım ekranının iki yanında duran İK
    çalışanları; büyüteç bir adayı öne çıkarıyor, adaya bağlı beyin ve terazi
    simgeleri yapay zekâ ile etik değerlendirmeyi simgeliyor
categories:
  - dijital-ik
tags: []
authorName: sude özdemir
---
# İK'da Yapay Zekâ Etiği: İşe Alım Algoritmalarında Önyargıları Nasıl Önleriz?

Yapay zekâ destekli işe alım sistemleri, İK ekiplerinin binlerce özgeçmişi saniyeler içinde taramasına, aday havuzunu daraltmasına ve süreçleri hızlandırmasına imkân tanıyor. Ancak bu teknolojiler, insan kararlarından beslenen verilerle eğitildiği için, fark edilmeden geçmişteki önyargıları da devralabiliyor. Sonuç: hızlı ama adaletsiz bir işe alım süreci.

Bu yazıda, işe alım algoritmalarında önyargının nereden geldiğini, en sık karşılaşılan türlerini ve şirketlerin bu riski nasıl azaltabileceğini ele alıyoruz.

## Algoritmalar Neden Önyargılı Olabilir?

Yapay zekâ modelleri "tarafsız" değildir; eğitildikleri verinin bir yansımasıdır. Önyargı genellikle üç noktada sisteme sızar:

- **Geçmiş veri:** Model, şirketin son 10 yıldaki işe alım kararlarıyla eğitilirse ve bu kararlar belirli bir demografik gruba yönelik tarihsel bir eğilim taşıyorsa, algoritma bu örüntüyü "başarı kriteri" olarak öğrenir.
- **Vekil değişkenler :** Doğrudan cinsiyet ya da yaş kullanılmasa bile; mezun olunan okul, ikamet edilen semt ya da özgeçmişteki boşluklar gibi görünüşte nötr veriler, dolaylı yoldan korunan özelliklerle güçlü bir ilişki taşıyabilir.
- **Tasarım ve etiketleme hataları:** Modelin hangi metriklere göre optimize edildiği (örneğin "kısa sürede işe başlayan" ya da "yöneticisiyle benzer profil") bizzat insan mühendisler tarafından belirlenir ve bu seçimler de öznelliği beraberinde getirir.

## En Yaygın Önyargı Türleri

**Cinsiyet önyargısı:** Geçmişte teknik pozisyonlara ağırlıklı olarak bir cinsiyetin alınması, modelin kelime seçimlerine bile ("kadın satranç kulübü kaptanı" gibi ifadelere) düşük puan vermesine yol açabilir.

**Yaş önyargısı:** Mezuniyet yılı, "dijital yerli" gibi ifadeler veya belirli teknolojilere aşinalık kriterleri, dolaylı olarak yaş ayrımcılığına dönüşebilir.

**Etnik köken ve isim önyargısı:** Araştırmalar, bazı algoritmaların belirli etnik kökenlere ait isimleri taşıyan özgeçmişlere sistematik olarak daha düşük puan verdiğini göstermiştir.

**Eğitim ve sosyoekonomik önyargı:** Yalnızca belirli üniversitelerden mezunlara öncelik tanıyan modeller, fırsat eşitsizliğini pekiştirebilir ve alternatif yollardan gelen yetenekli adayları eler.

## Önyargıyı Önlemek İçin Somut Stratejiler

### 1. Veri Çeşitliliğini ve Kalitesini Sağlayın

Eğitim verisinin farklı demografik gruplardan, farklı kariyer yollarından ve dengeli bir dağılımdan oluştuğundan emin olun. Tek tip bir başarı profilinden beslenen veri seti, aynı önyargıyı yeniden üretir.

### 2. Düzenli Önyargı Denetimleri  Yapın

Modelin çıktılarını demografik gruplara göre düzenli aralıklarla test edin. "Eşit fırsat farkı" veya "istatistiksel parite" gibi adalet metriklerini takip ederek sapmaları erken tespit edin. Bu denetimleri tek seferlik değil, sürekli bir izleme sürecine dönüştürün.

### 3. Şeffaflık ve Açıklanabilirlik İlkesini Benimseyin

Adayın neden elendiğini ya da öne çıktığını açıklayabilen sistemler tercih edin. Kara kutu modeller, hem hukuki risk hem de güven kaybı yaratır.

### 4. İnsan Gözetimini Sürecin Dışında Bırakmayın

Yapay zekâ, nihai kararı veren değil, öneri sunan bir araç olarak konumlandırılmalı. Özellikle sınırda kalan (borderline) adaylarda mutlaka bir İK uzmanının değerlendirmesi devreye girmeli.

### 5. Vekil Değişkenleri Tespit Edip Ayıklayın

Doğrudan korunan özellikleri çıkarmak yeterli değildir; bu özelliklerle yüksek korelasyon taşıyan dolaylı değişkenleri (posta kodu, okul adı, hobi listesi gibi) de analiz ederek gerekirse modelden çıkarın.

### 6. Yasal Çerçevelere Uyum Sağlayın

Avrupa Birliği'nin Yapay Zekâ Yasası yüksek riskli kategoriler arasında işe alım sistemlerini de sayıyor ve şeffaflık, risk değerlendirmesi gibi yükümlülükler getiriyor. Benzer şekilde ABD'de New York gibi şehirlerde otomatik işe alım araçları için bağımsız denetim zorunluluğu bulunuyor. Şirketinizin faaliyet gösterdiği bölgelerdeki mevzuatı takip etmek, hem etik hem de hukuki bir gereklilik.

### 7. Çeşitli Bir Ekiple Sistem Geliştirin ve Test Edin

Modeli geliştiren ve test eden ekibin kendisi çeşitlilik barındırmıyorsa, gözden kaçan önyargı riskleri de artar. Farklı bakış açılarına sahip bir ekip, kör noktaları daha kolay fark eder.

## Sonuç

Yapay zekâ, işe alım süreçlerini hızlandırma ve ölçeklendirme konusunda güçlü bir araç olsa da, önyargıyı otomatik olarak ortadan kaldırmaz — doğru tasarlanmadığında onu büyütebilir bile. Adil bir işe alım algoritması; çeşitli veri, sürekli denetim, açıklanabilirlik, insan gözetimi ve yasal uyumluluğun bir arada yürütülmesiyle mümkün olur. Bu adımları sürece içselleştiren şirketler, hem daha adil hem de daha güçlü bir yetenek stratejisi kurar.

## Sık Sorulan Sorular

**İşe alım algoritmasında önyargı olup olmadığını nasıl anlarım?** Modelin farklı demografik gruplara (cinsiyet, yaş, etnik köken vb.) verdiği puanları ve eleme oranlarını karşılaştıran bir önyargı denetimi yaparak anlayabilirsiniz. Gruplar arasında istatistiksel olarak anlamlı bir fark varsa, bu bir uyarı sinyalidir.

**Yapay zekâ destekli işe alım araçları yasal olarak zorunlu bir denetime tabi mi?** Bölgeye göre değişir. Avrupa Birliği'nin Yapay Zekâ Yasası, işe alım sistemlerini "yüksek riskli" kategoride değerlendirip şeffaflık ve risk değerlendirmesi zorunluluğu getiriyor; New York gibi bazı ABD şehirlerinde ise otomatik işe alım araçları için bağımsız yıllık denetim şartı bulunuyor. Şirketinizin faaliyet gösterdiği bölgedeki güncel mevzuatı kontrol etmeniz gerekir.

**Küçük bir İK ekibi, büyük bütçe olmadan önyargıyı nasıl azaltabilir?** Pahalı bir denetim yazılımına ihtiyaç duymadan başlanabilir: işe alım kriterlerini yazılı hale getirmek, adayları aynı standart soru setiyle değerlendirmek, sınırda kalan kararları ikinci bir kişiye kontrol ettirmek ve düzenli aralıklarla işe alınan/elenen adayların demografik dağılımını gözden geçirmek düşük maliyetli ama etkili adımlardır.

**Yapay zekâyı işe alım sürecinden tamamen çıkarmak çözüm müdür?** Hayır, gerekli değildir. Doğru tasarlanmış ve denetlenen bir sistem, insan değerlendiricilerin sahip olduğu bilinçsiz önyargıları azaltabilir. Önemli olan, yapay zekâyı nihai karar verici değil, insan gözetimiyle birlikte çalışan bir öneri aracı olarak konumlandırmaktır.
