# National Weather Big Data Analytics Platform (SIH26069)

Mission-critical weather intelligence platform for the Ministry of Earth Sciences (MoES), Government of India.

## Features

- **Real-Time Ingestion**: Collects #IMD tagged social media posts and citizen reports
- **AI Verification Engine**: Perceptual hashing, NER location extraction, sensor corroboration
- **3D Tactical Command Center**: CesiumJS-powered globe with incident clusters
- **Citizen Reporter**: Mobile-first PWA with geolocation and image upload
- **PostGIS Geospatial Queries**: ST_DWithin radius queries for AWS station cross-reference

## Quick Start

```bash
# Option 1: Use setup script
cd sih26069 && chmod +x setup.sh && ./setup.sh

# Option 2: Manual setup

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install

# Run both (IMPORTANT: activate venv for backend)
# Terminal 1: cd backend && source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# Terminal 2: cd frontend && npm run dev
```

## Important Notes

- **Python 3.10+ required** for the backend
- **Node.js 18+ required** for the frontend  
- Backend requires PostgreSQL running on `localhost:5432` with database `nwa_platform`
- Always activate the venv before running `uvicorn`: `source venv/bin/activate`

## Routes

- `http://localhost:3000` — Landing Page
- `http://localhost:3000/command` — Command Center Dashboard
- `http://localhost:3000/report` — Citizen Incident Reporter
- `http://localhost:3000/privacy` — Privacy Policy
- `http://localhost:3000/terms` — Terms & Conditions
- `http://localhost:8000/api/v1/docs` — API Documentation
- `http://localhost:8000/health` — Health Check

## Tech Stack

**Frontend**: Next.js 14, TypeScript, Tailwind CSS, React Query, react-hook-form + Zod, CesiumJS (direct)
**Backend**: FastAPI, PostgreSQL + PostGIS, SQLAlchemy 2.0, Celery, Redis

## Architecture

- `frontend/app/` — Next.js App Router pages and API routes
- `frontend/app/command/` — Command Center with 3D CesiumJS globe
- `frontend/app/report/` — Citizen Incident Reporter (PWA)
- `backend/app/` — FastAPI application
- `backend/app/ai/` — AI verification pipeline
- `backend/app/models/` — SQLAlchemy database models
- `backend/app/routers/` — API endpoints
- `backend/app/core/` — Config, database, and utilities
