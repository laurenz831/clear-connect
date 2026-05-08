// ClearConnect – Backend Server
// Speichert alles im Arbeitsspeicher (kein Datenbank nötig).
// Beide Frontends (Arzt + Patient) fragen diesen Server jede Sekunde nach dem aktuellen Stand.

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ─── Zustand der Konsultation ────────────────────────────────────────────────
//
// Dieser eine Zustand beschreibt alles was gerade passiert.
// "phase" zeigt in welchem Schritt wir uns befinden:
//
//   'welcome'      → Patient sieht den Willkommensbildschirm
//   'waiting'      → Patient hat Kategorie gewählt, wartet auf Arzt
//   'called'       → Arzt hat Patient aufgerufen
//   'consultation' → Aktives Gespräch, Fragen werden gestellt
//   'finishing'    → Arzt hat Gespräch beendet, Patient wird gefragt
//   'summary'      → Patient prüft die Zusammenfassung
//   'done'         → Alles fertig
//
let state = createInitialState();

function createInitialState() {
  return {
    phase: 'welcome',
    patientCategory: null,    // z.B. 'pain', 'checkup', 'medication', 'other'
    currentQuestion: null,    // { text, category, type } – aktuelle Frage
    currentAnswer: null,      // Antwort des Patienten als Text
    conversation: [],         // [ { sender, text, timestamp } ] – Gesprächsverlauf
    summaryRequested: null,   // true/false – will Patient eine Zusammenfassung?
    summaryConfirmed: null,   // true/false – hat Patient bestätigt?
  };
}

// Hilfsfunktion: aktuelle Uhrzeit als HH:MM
function nowTime() {
  return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

// Hilfsfunktion: Nachricht zum Gesprächsverlauf hinzufügen
function addMessage(sender, text) {
  state.conversation.push({ sender, text, timestamp: nowTime() });
}

// ─── API Endpunkte ────────────────────────────────────────────────────────────

// GET /api/state
// Das Frontend fragt diesen Endpunkt jede Sekunde ab, um den aktuellen Stand zu bekommen
app.get('/api/state', (req, res) => {
  res.json(state);
});

// POST /api/category
// Patient wählt seinen Besuchsgrund aus (z.B. Schmerzen)
app.post('/api/category', (req, res) => {
  const { category } = req.body;
  state.patientCategory = category;
  state.phase = 'waiting';
  addMessage('system', `Patient hat eingecheckt – Grund: ${category}`);
  res.json({ ok: true });
});

// POST /api/call-patient
// Arzt ruft den Patienten ins Zimmer
app.post('/api/call-patient', (req, res) => {
  state.phase = 'called';
  addMessage('system', 'Arzt hat den Patienten aufgerufen');
  res.json({ ok: true });
});

// POST /api/patient-ready
// Patient hat "Verstanden" gedrückt und betritt das Zimmer
app.post('/api/patient-ready', (req, res) => {
  state.phase = 'consultation';
  res.json({ ok: true });
});

// POST /api/question
// Arzt schickt eine Frage an den Patienten
app.post('/api/question', (req, res) => {
  const { text, category, type } = req.body;
  state.currentQuestion = {
    text,
    category: category || 'Frage',
    type: type || 'yesno',   // 'yesno' | 'scale' | 'text'
  };
  state.currentAnswer = null; // alte Antwort löschen
  addMessage('doctor', text);
  res.json({ ok: true });
});

// POST /api/answer
// Patient schickt seine Antwort
app.post('/api/answer', (req, res) => {
  const { text } = req.body;
  state.currentAnswer = text;
  addMessage('patient', text);
  res.json({ ok: true });
});

// POST /api/finish-consultation
// Arzt beendet das Gespräch
app.post('/api/finish-consultation', (req, res) => {
  state.phase = 'finishing';
  res.json({ ok: true });
});

// POST /api/summary-request
// Patient entscheidet ob er eine Zusammenfassung möchte
app.post('/api/summary-request', (req, res) => {
  const { wants } = req.body;
  state.summaryRequested = wants;
  state.phase = wants ? 'summary' : 'done';
  res.json({ ok: true });
});

// POST /api/summary-confirm
// Patient bestätigt die Zusammenfassung
app.post('/api/summary-confirm', (req, res) => {
  const { confirmed } = req.body;
  state.summaryConfirmed = confirmed;
  state.phase = 'done';
  res.json({ ok: true });
});

// POST /api/reset
// Neue Konsultation starten (alles zurücksetzen)
app.post('/api/reset', (req, res) => {
  state = createInitialState();
  res.json({ ok: true });
});

// ─── Server starten ───────────────────────────────────────────────────────────
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ ClearConnect Backend läuft auf http://localhost:${PORT}`);
});
