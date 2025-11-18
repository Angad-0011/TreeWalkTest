# TreeWalk

TreeWalk is a single-page urban forestry tool that pairs a Leaflet map with a Mapillary-powered street view. Volunteers can explore a neighborhood, label trees, and manage observations fully in the browser.

## Project layout
- `frontend/`: React + TypeScript client.
- `backend/`: FastAPI service that proxies Mapillary image lookups with the `streetlevel` helper.

## Getting started

### Frontend
1. Install dependencies
   ```bash
   cd frontend
   npm install
   ```
2. Run the dev server
   ```bash
   npm run dev
   ```

The app defaults to `http://localhost:5173`. You can configure the backend URL via the `VITE_API_URL` environment variable.

### Backend
1. Create a virtual environment and install dependencies
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Export your Mapillary token and start the API
   ```bash
   export MAPILLARY_CLIENT_TOKEN="<token>"
   uvicorn main:app --reload
   ```

The API exposes `GET /nearest-image?lat=<lat>&lng=<lng>` and returns the closest panorama image id within 100 meters.

### Data import/export
Mission Control in the UI lets you export local annotations as CSV or import an existing CSV to visualize trees on the map.
