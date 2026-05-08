// Vordefinierte Fragebibliothek für das Arzt-Dashboard.
//
// Jede Frage hat:
//   id       – eindeutige Nummer
//   text     – die Frage die dem Patienten angezeigt wird (Deutsch)
//   type     – 'yesno'  → Patient sieht Ja/Nein Buttons
//              'scale'  → Patient sieht Schmerzskala 0–10
//              'text'   → Patient sieht nur ein Textfeld

const questions = [
  {
    category: 'Schmerz · Ort',
    icon: '📍',
    items: [
      { id: 1,  text: 'Wo genau haben Sie Schmerzen?',                   type: 'text'  },
      { id: 2,  text: 'Haben Sie Schmerzen in der Brust?',               type: 'yesno' },
      { id: 3,  text: 'Haben Sie Schmerzen im Bauch?',                   type: 'yesno' },
      { id: 4,  text: 'Haben Sie Schmerzen im Kopf?',                    type: 'yesno' },
      { id: 5,  text: 'Strahlen die Schmerzen in andere Bereiche aus?',  type: 'yesno' },
    ],
  },
  {
    category: 'Schmerz · Intensität',
    icon: '📊',
    items: [
      { id: 6,  text: 'Bewerten Sie Ihre Schmerzen von 0 bis 10', type: 'scale'  },
      { id: 7,  text: 'Sind die Schmerzen stärker als gestern?',   type: 'yesno'  },
      { id: 8,  text: 'Fällt es Ihnen schwer, sich zu bewegen?',   type: 'yesno'  },
      { id: 9,  text: 'Sind die Schmerzen stechend?',              type: 'yesno'  },
      { id: 10, text: 'Sind die Schmerzen dumpf oder drückend?',   type: 'yesno'  },
    ],
  },
  {
    category: 'Schmerz · Dauer',
    icon: '🕐',
    items: [
      { id: 11, text: 'Haben die Schmerzen heute begonnen?',  type: 'yesno' },
      { id: 12, text: 'Wie lange haben Sie schon Schmerzen?', type: 'text'  },
    ],
  },
  {
    category: 'Allgemeinzustand',
    icon: '🩺',
    items: [
      { id: 13, text: 'Fühlen Sie sich müde?', type: 'yesno' },
      { id: 14, text: 'Haben Sie Fieber?',     type: 'yesno' },
      { id: 15, text: 'Haben Sie Husten?',     type: 'yesno' },
      { id: 16, text: 'Haben Sie Atemnot?',    type: 'yesno' },
    ],
  },
  {
    category: 'Medikamente',
    icon: '💊',
    items: [
      { id: 17, text: 'Nehmen Sie Medikamente?',                    type: 'yesno' },
      { id: 18, text: 'Haben Sie Ihre Medikamente heute genommen?', type: 'yesno' },
      { id: 19, text: 'Haben Sie Nebenwirkungen bemerkt?',          type: 'yesno' },
    ],
  },
];

export default questions;
