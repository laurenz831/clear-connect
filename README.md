# Clear Connect

Eine Plattform, die Patienten mit Fachleuten im Gesundheitswesen verbindet.

## Projektstruktur

```
clear-connect/
├── frontend/          # React-Anwendung
│   └── src/
│       ├── components/
│       │   ├── Patient/
│       │   ├── Doctor/
│       │   └── Common/
│       ├── pages/
│       ├── services/
│       ├── data/
│       ├── App.js
│       └── index.js
│
└── backend/           # Node.js/Express Server
    ├── routes/
    ├── controllers/
    ├── models/
    └── server.js
```

## Installation

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
npm install
npm start
```

## Umgebungsvariablen

Erstellen Sie eine `.env` Datei im Backend-Verzeichnis:

```
MONGODB_URI=mongodb://localhost:27017/clearconnect
PORT=3001
```

## Technologie-Stack

- **Frontend**: React, JavaScript
- **Backend**: Node.js, Express
- **Datenbank**: MongoDB

## Lizenz

MIT
