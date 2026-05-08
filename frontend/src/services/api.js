// Hilfsfunktionen für alle API-Anfragen ans Backend.
// Alle Komponenten importieren diese Funktionen statt fetch() direkt zu benutzen.

const API = 'http://localhost:3001';

// Sendet eine POST-Anfrage ans Backend
// endpoint = z.B. '/api/question'
// body     = Daten die mitgeschickt werden, z.B. { text: 'Haben Sie Schmerzen?' }
export async function post(endpoint, body = {}) {
  const res = await fetch(`${API}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}
