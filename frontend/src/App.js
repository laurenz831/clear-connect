import React, { useState, useEffect } from 'react';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientFlow from './pages/PatientFlow';
import './App.css';

// Adresse des Backends – läuft lokal auf Port 3001
const API = 'http://localhost:3001';

export default function App() {
  // "view" bestimmt welche Panels sichtbar sind
  // 'doctor'  → nur das Arzt-Dashboard
  // 'both'    → beide nebeneinander (gut zum Demonstrieren)
  // 'patient' → nur das Patienten-Tablet
  const [view, setView] = useState('both');

  // "state" ist der aktuelle Zustand der Konsultation vom Backend
  const [state, setState] = useState(null);

  // "error" wird true wenn das Backend nicht erreichbar ist
  const [error, setError] = useState(false);

  // Alle 1 Sekunde fragen wir das Backend: "Was ist gerade los?"
  // So sehen Arzt und Patient immer denselben aktuellen Stand.
  useEffect(() => {
    let active = true;

    async function poll() {
      try {
        const res = await fetch(`${API}/api/state`);
        const data = await res.json();
        if (active) { setState(data); setError(false); }
      } catch {
        if (active) setError(true);
      }
    }

    poll(); // einmal sofort aufrufen
    const interval = setInterval(poll, 1000); // dann jede Sekunde
    return () => { active = false; clearInterval(interval); };
  }, []);

  // Fehler: Backend nicht erreichbar
  if (error) {
    return (
      <div className="connection-error">
        <div className="error-card">
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <h2>Backend nicht erreichbar</h2>
          <p>Starte das Backend in einem Terminal:</p>
          <code>cd backend &amp;&amp; npm run dev</code>
          <p style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>
            Der Server muss auf Port 3001 laufen.
          </p>
        </div>
      </div>
    );
  }

  // Laden: noch keine Antwort vom Backend
  if (!state) {
    return (
      <div className="connection-error">
        <div className="error-card">
          <div className="spinner" />
          <p>Verbinde mit Server…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      {/* Haupt-Bereich: ein oder beide Panels */}
      <div className={`panels panels--${view}`}>
        {(view === 'doctor' || view === 'both') && (
          <div className="panel panel--doctor">
            <DoctorDashboard state={state} api={API} />
          </div>
        )}
        {(view === 'patient' || view === 'both') && (
          <div className="panel panel--patient">
            <PatientFlow state={state} api={API} />
          </div>
        )}
      </div>

      {/* Umschalter unten – nur für die Demo, um zwischen den Ansichten zu wechseln */}
      <nav className="view-switcher">
        <button
          className={`switcher-btn ${view === 'doctor' ? 'active' : ''}`}
          onClick={() => setView('doctor')}
        >
          🖥 Arzt
        </button>
        <button
          className={`switcher-btn ${view === 'both' ? 'active' : ''}`}
          onClick={() => setView('both')}
        >
          ⊞ Beide
        </button>
        <button
          className={`switcher-btn ${view === 'patient' ? 'active' : ''}`}
          onClick={() => setView('patient')}
        >
          📱 Patient
        </button>
      </nav>
    </div>
  );
}
