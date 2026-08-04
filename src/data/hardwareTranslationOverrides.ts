// Donanım sayfasının IT içeriği (`reference/wordpress-export/hardware.json`,
// id 23428) TAMAMEN ham İngilizce — hero ve section_1/2/8'in metni EN ile
// birebir aynı, section_3-7'nin metni de aslında EN (yalnızca HTML
// sarmalaması hafifçe farklı olduğu için `===` karşılaştırması `false`
// dönüyor, ama içerik hâlâ İngilizce) — bu proje boyunca defalarca görülen
// "IT = EN kopyası" örüntüsünün bir tekrarı (bkz. CLAUDE.md KARAR 1). TR
// kaynak metinden gerçek, profesyonel İtalyanca çeviri üretildi.
import type { ProductBlock } from './productContent';
import type { Locale } from './nav';

// bkz. productTranslationOverrides.ts'teki aynı sentinel — `localizeCtaUrl()`
// bunu tanıyıp bizim canonical `online-sunum-talebi` slug'ımıza çeviriyor.
const DEMO_CTA_URL = 'https://idenfit.com/tr/online-sunum-talep-et/';

export interface HardwareOverride {
  hero?: ProductBlock;
  sections?: ProductBlock[];
}

export const HARDWARE_OVERRIDES: Partial<Record<Locale, HardwareOverride>> = {
  it: {
    hero: {
      id: 'entegrasyon',
      title: 'Sistemi di identificazione integrati con diversi dispositivi hardware',
      text: "Grazie a tecnologie come biometria, bluetooth, RFID e GPRS, idenfit si integra con i diversi dispositivi hardware presenti sul mercato, garantendo l'identificazione accurata e il monitoraggio in tempo reale dei tuoi dipendenti.",
      ctaText: 'Richiedi Ora',
      ctaUrl: DEMO_CTA_URL,
      image: {
        url: 'https://idenfit.com/wp-content/uploads/2025/08/Dananimlar1@2x.png',
        alt: 'Dananimlar1@2x',
        width: 1159,
        height: 1174,
      },
    },
    sections: [
      {
        id: 'biyometrik',
        title: 'Soluzioni biometriche sistemi di riconoscimento facciale e rilevamento impronte digitali',
        text: "Grazie all'integrazione con dispositivi di riconoscimento facciale e rilevamento impronte digitali, l'identità dei dipendenti può essere verificata in tempo reale, mentre gli ingressi e le uscite vengono gestiti con facilità.",
        ctaText: '',
        ctaUrl: '',
        image: {
          url: 'https://idenfit.com/wp-content/uploads/2025/08/Donanimlar2@2x.png',
          alt: 'Donanimlar2@2x',
          width: 1012,
          height: 1354,
        },
      },
      {
        id: 'bluetooth',
        title: 'Sistemi di tracciamento accessi in tempo reale via Bluetooth',
        text:
          '<p>Negli ultimi anni, indipendentemente dalle dimensioni, molte aziende incontrano difficoltà nella gestione della sicurezza. La tecnologia Bluetooth semplifica il lavoro delle imprese consentendo accessi e identificazioni sicure.</p>\n' +
          '<p>Con il sistema Bluetooth, gli accessi ai punti critici possono essere identificati tramite smartphone, senza bisogno di chiavi. Allo stesso modo, le porte possono essere aperte e gli accessi gestiti anche a distanza, da qualsiasi punto della struttura.</p>\n' +
          '<p>Con Bab, il sistema di tracciamento di nuova generazione basato su Bluetooth, puoi gestire e monitorare gli accessi dei dipendenti tramite la tecnologia Bluetooth.</p>',
        ctaText: '',
        ctaUrl: '',
        image: {
          url: 'https://idenfit.com/wp-content/uploads/2025/08/4@2x-2.webp',
          alt: '4@2x 2',
          width: 1335,
          height: 1021,
        },
      },
      {
        id: 'platform',
        title: 'Piattaforma hardware centrale',
        text: "La struttura centrale di idenfit è progettata appositamente per connettersi in tempo reale con più dispositivi. Il sistema, agnostico rispetto al brand e flessibile, ti permette di collegare alla piattaforma i dispositivi già acquistati o in tuo possesso, senza problemi di compatibilità.",
        ctaText: '',
        ctaUrl: '',
        image: {
          url: 'https://idenfit.com/wp-content/uploads/2025/08/5@2x.webp',
          alt: '5@2x',
          width: 1016,
          height: 586,
        },
      },
      {
        id: 'rfid',
        title: 'rfid<br>localizzazione<br>in tempo reale',
        text: 'Con la tecnologia RFID puoi monitorare i tuoi beni o i tuoi dipendenti in qualsiasi momento e da qualsiasi luogo. Oltre a tracciare oggetti in movimento, beni aziendali o oggetti di valore, con i lettori RAIN RFID puoi anche monitorare le persone in tempo reale. Questa tecnologia ti permette di vedere i tuoi dipendenti online e sapere facilmente chi, quando e dove si trova.',
        ctaText: '',
        ctaUrl: '',
        image: {
          url: 'https://idenfit.com/wp-content/uploads/2025/08/6@2x.webp',
          alt: '6@2x',
          width: 1081,
          height: 1006,
        },
      },
      {
        id: 'gprs',
        title: 'gprs<br>comunicazione wireless',
        text: 'Grazie alla tecnologia di comunicazione wireless offerta da idenfit, i lettori biometrici e RFID con supporto GSM comunicano direttamente con i server idenfit. In questo modo non devi più preoccuparti di cavi e server locali. Con la funzionalità GPRS, idenfit ti fa risparmiare tempo e costi operativi.',
        ctaText: '',
        ctaUrl: '',
        image: {
          url: 'https://idenfit.com/wp-content/uploads/2025/08/7@2x.webp',
          alt: '7@2x',
          width: 1125,
          height: 942,
        },
      },
      {
        id: 'turnikeler',
        title: 'Sistemi di controllo accessi <br>tornelli',
        text: "Con idenfit, grazie al sistema installato su tornelli o punti di accesso critici, l'identificazione e il monitoraggio in tempo reale degli ingressi e delle uscite dei dipendenti possono essere gestiti con facilità. Gli accessi ai tornelli possono essere identificati tramite sistemi di lettura card, riconoscimento facciale o impronte digitali. Il sistema si integra con qualsiasi tipo di dispositivo.",
        ctaText: '',
        ctaUrl: '',
        image: {
          url: 'https://idenfit.com/wp-content/uploads/2025/08/8@2x.webp',
          alt: '8@2x',
          width: 1118,
          height: 1737,
        },
      },
      {
        id: 'markalar',
        title: 'Marchi approvati integrati con i dispositivi',
        text:
          "<p>La struttura centrale di idenfit è compatibile con i dispositivi avanzati<br />\nelencati di seguito. Grazie alla struttura di comunicazione intelligente e<br />\nalla forma agnostica, offre un'esperienza eccellente per i dipendenti.</p>\n" +
          '<ul class="list">\n<li>Suprema</li>\n<li>ZKTeco</li>\n<li>Bab</li>\n</ul>',
        ctaText: '',
        ctaUrl: '',
        image: {
          url: 'https://idenfit.com/wp-content/uploads/2025/08/9@2x.webp',
          alt: '9@2x',
          width: 1001,
          height: 989,
        },
      },
    ],
  },
};
