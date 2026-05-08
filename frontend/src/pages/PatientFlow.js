import React, { useState } from 'react';
import { post } from '../services/api';

// Farben für die Schmerzskala: grün (0) → gelb → rot (10)
const SCHMERZFARBEN = [
  '#16a34a','#22c55e','#84cc16','#a3e635',
  '#facc15','#fb923c','#f97316',
  '#ef4444','#dc2626','#b91c1c','#7f1d1d',
];

const KATEGORIE_TEXT = {
  pain:       'Schmerzen',
  checkup:    'Vorsorge / Check-up',
  medication: 'Medikamente',
  other:      'Sonstiges',
};

// Status-Punkt oben rechts im Tablet-Header
function tabletStatus(phase) {
  if (phase === 'welcome' || phase === 'waiting') return { dot: 'waiting',   label: 'Wartend' };
  if (phase === 'called')                         return { dot: 'waiting',   label: 'Aufgerufen' };
  if (phase === 'done')                           return { dot: 'idle',      label: 'Beendet' };
  return                                                 { dot: 'connected', label: 'Verbunden' };
}

// ── Haupt-Komponente ──────────────────────────────────────────────────────────
export default function PatientFlow({ state, api }) {
  // localStep steuert welcome → Kategorie-Auswahl (bevor der erste API-Aufruf passiert)
  const [localStep, setLocalStep] = useState('welcome');
  const [freitext, setFreitext]   = useState('');

  const { dot, label } = tabletStatus(state.phase);
  const aktuelleQ = state.currentQuestion;

  // ── Welcher Bildschirm wird gerade gezeigt? ────────────────
  function inhalt() {
    // Bevor der Patient eingecheckt hat: Willkommen → Kategorie-Auswahl
    if (state.phase === 'welcome') {
      if (localStep === 'welcome')
        return <WillkommenBildschirm onStart={() => setLocalStep('kategorie')} />;
      return <KategorieAuswahl onSelect={kat => post('/api/category', { category: kat })} />;
    }

    if (state.phase === 'waiting')
      return <WartenBildschirm kategorie={state.patientCategory} />;

    if (state.phase === 'called')
      return <AufgerufenBildschirm onReady={() => post('/api/patient-ready')} />;

    if (state.phase === 'consultation') {
      if (!aktuelleQ)               return <VerbundenBildschirm />;
      if (state.currentAnswer)      return <GeantwortetBildschirm antwort={state.currentAnswer} />;
      return (
        <FrageBildschirm
          frage={aktuelleQ}
          freitext={freitext}
          setFreitext={setFreitext}
          onAntwort={text => { setFreitext(''); post('/api/answer', { text }); }}
        />
      );
    }

    if (state.phase === 'finishing')
      return (
        <ZusammenfassungAnfrageBildschirm
          onJa={() => post('/api/summary-request', { wants: true })}
          onNein={() => post('/api/summary-request', { wants: false })}
        />
      );

    if (state.phase === 'summary') {
      const qaPaare = getQAPaare(state.conversation);
      return (
        <ZusammenfassungBildschirm
          kategorie={state.patientCategory}
          qaPaare={qaPaare}
          onBestaetigen={() => post('/api/summary-confirm', { confirmed: true })}
          onAblehnen={() => post('/api/summary-confirm', { confirmed: false })}
        />
      );
    }

    if (state.phase === 'done')
      return <FertigBildschirm />;

    return null;
  }

  return (
    <div className="patient-tablet">
      {/* Tablet-Kopfzeile */}
      <div className="tablet-header">
        <div className="tablet-logo">
          <div className="tablet-logo-icon">♡</div>
          <span className="tablet-logo-name">ClearConnect</span>
        </div>
        <div className="tablet-status">
          <div className={`status-dot ${dot}`} />
          {label}
        </div>
      </div>

      {/* Weißes Inhalts-Panel */}
      <div className="tablet-card">
        {inhalt()}
      </div>
    </div>
  );
}

// ── Hilfsfunktion: Frage-Antwort-Paare aus Verlauf extrahieren ────────────────
function getQAPaare(conversation) {
  const paare = [];
  let aktuelleQ = null;
  for (const msg of conversation) {
    if (msg.sender === 'doctor')              { aktuelleQ = msg.text; }
    else if (msg.sender === 'patient' && aktuelleQ) {
      paare.push({ q: aktuelleQ, a: msg.text });
      aktuelleQ = null;
    }
  }
  return paare;
}

// ── Einzelne Bildschirme ──────────────────────────────────────────────────────

function WillkommenBildschirm({ onStart }) {
  return (
    <div className="tablet-welcome">
      <div className="welcome-icon">♡</div>
      <div className="welcome-title">Willkommen</div>
      <div className="welcome-sub">
        Dieses Tablet hilft Ihnen, mit Ihrem Arzt zu sprechen.
        Tippen Sie auf die großen Buttons, um zu antworten.
      </div>
      {/* Platzhalter für Erklärvideo */}
      <div className="welcome-video-placeholder">
        <div style={{ fontSize: 28 }}>▶</div>
        <span>Erklärvideo (Platzhalter)</span>
      </div>
      <button className="btn-start" onClick={onStart}>
        Start →
      </button>
    </div>
  );
}

function KategorieAuswahl({ onSelect }) {
  return (
    <div className="tablet-category">
      <div className="tablet-step-label">SCHRITT 1 VON 1</div>
      <div className="tablet-big-title">Warum sind Sie heute hier?</div>
      <div className="tablet-hint">Tippen Sie auf eine Option</div>
      <div className="category-grid">
        <button className="category-btn pain"       onClick={() => onSelect('pain')}>
          <span className="cat-emoji">🩺</span>Schmerzen
        </button>
        <button className="category-btn checkup"    onClick={() => onSelect('checkup')}>
          <span className="cat-emoji">💙</span>Vorsorge
        </button>
        <button className="category-btn medication" onClick={() => onSelect('medication')}>
          <span className="cat-emoji">💊</span>Medikamente
        </button>
        <button className="category-btn other"      onClick={() => onSelect('other')}>
          <span className="cat-emoji">❓</span>Sonstiges
        </button>
      </div>
    </div>
  );
}

function WartenBildschirm({ kategorie }) {
  return (
    <div className="tablet-waiting">
      <div className="waiting-icon">🕐</div>
      <div className="waiting-title">Bitte warten</div>
      <div className="waiting-sub">Der Arzt ruft Sie gleich auf.</div>
      <div className="reason-chip">Grund: {KATEGORIE_TEXT[kategorie] ?? kategorie}</div>
    </div>
  );
}

function AufgerufenBildschirm({ onReady }) {
  return (
    <div className="tablet-called">
      <div className="called-tag">DER ARZT IST BEREIT</div>
      <div className="called-icon">🚪</div>
      <div className="called-title">Bitte kommen Sie ins Untersuchungszimmer</div>
      <div className="called-sub">Please come to the examination room.</div>
      <button className="btn-tablet-primary" onClick={onReady}>
        ✓ Verstanden
      </button>
    </div>
  );
}

function VerbundenBildschirm() {
  return (
    <div className="tablet-connected">
      <div className="connected-icon">🟢</div>
      <div className="connected-title">Sie sind verbunden</div>
      <div className="connected-sub">Bitte warten Sie auf die nächste Frage…</div>
    </div>
  );
}

function GeantwortetBildschirm({ antwort }) {
  return (
    <div className="tablet-connected">
      <div className="connected-icon">✅</div>
      <div className="connected-title">Antwort gesendet</div>
      <div className="connected-sub">„{antwort}"</div>
      <div className="connected-sub" style={{ marginTop: 4 }}>Warte auf die nächste Frage…</div>
    </div>
  );
}

function FrageBildschirm({ frage, freitext, setFreitext, onAntwort }) {
  return (
    <div className="tablet-question">
      {/* Frage-Anzeige */}
      <div className="question-top">
        <div className="doctor-asks-label">DER ARZT FRAGT</div>
        <div className="question-text">{frage.text}</div>
      </div>

      {/* Platzhalter für Gebärdensprache-GIF */}
      <div className="sign-lang-placeholder">
        <div className="sign-lang-icon">🤟</div>
        <span>Gebärdensprache GIF / Video (Platzhalter)</span>
      </div>

      <div className="answer-area">
        <div className="answer-area-label">IHRE ANTWORT</div>

        {/* Ja / Nein Buttons */}
        {frage.type === 'yesno' && (
          <div className="yesno-row">
            <button className="btn-yes" onClick={() => onAntwort('Ja')}>✓ Ja</button>
            <button className="btn-no"  onClick={() => onAntwort('Nein')}>✗ Nein</button>
          </div>
        )}

        {/* Schmerzskala */}
        {frage.type === 'scale' && (
          <Schmerzskala onAuswahl={val => onAntwort(`Schmerzstufe: ${val}/10`)} />
        )}

        {/* Freitext immer sichtbar */}
        <textarea
          className="free-text-input"
          placeholder="Oder tippen Sie hier Ihre Antwort ein…"
          value={freitext}
          onChange={e => setFreitext(e.target.value)}
          rows={2}
        />

        {/* Senden-Button nur wenn Text vorhanden */}
        {freitext.trim() && (
          <button className="btn-send-answer" onClick={() => onAntwort(freitext.trim())}>
            ↑ Antwort senden
          </button>
        )}

        {/* Bei Textfragen: Senden-Button immer zeigen */}
        {frage.type === 'text' && !freitext.trim() && (
          <button className="btn-send-answer" disabled>↑ Antwort senden</button>
        )}
      </div>
    </div>
  );
}

function Schmerzskala({ onAuswahl }) {
  return (
    <div className="pain-scale">
      <div className="pain-scale-labels">
        <span>Kein Schmerz</span>
        <span>Stärkster Schmerz</span>
      </div>
      <div className="pain-scale-btns">
        {SCHMERZFARBEN.map((farbe, i) => (
          <button
            key={i}
            className="pain-btn"
            style={{ background: farbe }}
            onClick={() => onAuswahl(i)}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
}

function ZusammenfassungAnfrageBildschirm({ onJa, onNein }) {
  return (
    <div className="tablet-finishing">
      <div className="finishing-icon">📋</div>
      <div className="finishing-title">Möchten Sie eine Zusammenfassung erhalten?</div>
      <div className="finishing-sub">Would you like a summary of today's visit?</div>
      <div className="finishing-buttons">
        <button className="btn-ja"   onClick={onJa}>✓ JA</button>
        <button className="btn-nein" onClick={onNein}>✗ NEIN</button>
      </div>
    </div>
  );
}

function ZusammenfassungBildschirm({ kategorie, qaPaare, onBestaetigen, onAblehnen }) {
  const hinweise = [
    'Alles sieht im Moment gut aus.',
    'Ruhen Sie sich aus und nehmen Sie Ihre Medikamente wie besprochen.',
    'Melden Sie sich bei uns, wenn Sie sich schlechter fühlen.',
  ];

  return (
    <div className="tablet-summary">
      <div className="summary-top">
        <div className="summary-top-title">Ihre Zusammenfassung</div>
        <div className="summary-top-sub">Bitte kurz prüfen</div>
      </div>

      <div className="summary-scroll">
        <div>
          <div className="patient-greeting">Hallo 👋</div>
          <div className="patient-greeting-sub">Hier ist eine kurze Übersicht Ihres heutigen Besuchs.</div>
        </div>

        <div className="summary-reason-card">
          <div className="summary-reason-label">🗓 GRUND DES BESUCHS</div>
          <div className="summary-reason-value">{KATEGORIE_TEXT[kategorie] ?? kategorie}</div>
        </div>

        {qaPaare.length > 0 && (
          <div>
            <div className="summary-qa-title">💬 Worüber wir gesprochen haben</div>
            {qaPaare.map((p, i) => (
              <div key={i} className="summary-qa-item">
                <div className="summary-qa-q">{p.q}</div>
                <div className="summary-qa-a">{p.a}</div>
              </div>
            ))}
          </div>
        )}

        <div className="summary-hints">
          <div className="summary-hints-title">✅ Hinweise</div>
          {hinweise.map((h, i) => (
            <div key={i} className="summary-hint-item">
              <span className="summary-hint-dot">•</span>{h}
            </div>
          ))}
        </div>
      </div>

      <div className="summary-confirm-section">
        <div className="summary-confirm-q">Ist diese Zusammenfassung korrekt?</div>
        <div className="summary-confirm-btns">
          <button className="btn-confirm-yes" onClick={onBestaetigen}>✓ Ja, passt</button>
          <button className="btn-confirm-no"  onClick={onAblehnen}>✗ Nein, bitte anpassen</button>
        </div>
      </div>
    </div>
  );
}

function FertigBildschirm() {
  return (
    <div className="tablet-done">
      <div className="done-icon">✅</div>
      <div className="done-title">Vielen Dank!</div>
      <div className="done-sub">
        Ihr Besuch ist abgeschlossen.<br />
        Wir wünschen Ihnen gute Besserung.
      </div>
    </div>
  );
}
