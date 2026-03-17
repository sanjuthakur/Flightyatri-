# FlightYatri

Production-oriented monorepo starter for a flight discovery app.

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Deploy target:
  - Frontend on Vercel
  - Backend on Render

## Project Structure

```
.
├─ backend
├─ frontend
└─ render.yaml
```

## Local Development

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Server runs at `http://localhost:8080`.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

Set `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## Deploy

### Frontend (Vercel)

1. Import the `frontend` directory as a Vercel project.
2. Set env var:
   - `VITE_API_BASE_URL=https://<your-render-backend>.onrender.com`
3. Build command: `npm run build`
4. Output directory: `dist`

### Backend (Render)

Use the included `render.yaml`, or create a Web Service:

- Root directory: `backend`
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Env vars:
  - `NODE_ENV=production`
  - `PORT=10000`
  - `CLIENT_ORIGIN=https://<your-vercel-domain>`

## API Endpoints

- `GET /health`
- `GET /api/v1/flights?from=DEL&to=BOM&date=2026-03-20&adults=1`
- `GET /api/v1/airports?query=del`

