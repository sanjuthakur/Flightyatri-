# FlightYatri AI

India-focused flight status MVP with a conversational web interface, mock live operations backend, and deployment-ready monorepo structure.

## What is implemented

- Flight status lookup by flight number
- Route-based search for India domestic, arriving-to-India, and departing-from-India coverage
- Conversational assistant endpoint with guarded fallback behavior
- Freshness metadata and operational disclaimer on results
- Responsive React web UI with status board, watched flights, route search, and chat panel

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Deploy target:
  - Frontend on Vercel
  - Backend on Render

## Project structure

```text
.
|- backend
|- frontend
|- FlightYatri.md
`- render.yaml
```

## Local development

### Backend

```bash
cd backend
npm install
npm run dev
```

API runs at `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Web app runs at `http://localhost:5173`.

### Environment variables

`backend/.env`

```bash
NODE_ENV=development
PORT=8080
CLIENT_ORIGIN=http://localhost:5173
```

`frontend/.env`

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## API endpoints

- `GET /health`
- `GET /api/v1/flights?from=DEL&to=BOM&date=2026-03-20&adults=1`
- `GET /api/v1/flights/status?flightNumber=AI101`
- `GET /api/v1/flights/airports?query=del`
- `GET /api/v1/flights/highlights`
- `GET /api/v1/flights/routes/suggestions`
- `POST /api/v1/chat`

Example chat payload:

```json
{
  "message": "Is AI101 on time?"
}
```

## Product notes

- Current backend uses mock operational data shaped like a live feed.
- The assistant is designed to ask for clarification or fall back instead of fabricating unsupported details.
- Authentication, notifications, and native mobile apps are still future phases from the PRD.

## Deploy

### Backend on Render

Use the included `render.yaml` or create a Render Web Service with:

- Root directory: `backend`
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Environment variables:
  - `NODE_ENV=production`
  - `PORT=10000`
  - `CLIENT_ORIGIN=https://<your-frontend-domain>`

### Frontend on Vercel

- Import the `frontend` directory as a Vercel project
- Set `VITE_API_BASE_URL=https://<your-render-backend>.onrender.com`
- Build command: `npm run build`
- Output directory: `dist`
