# Git Club CHARUSAT — Event Hub

A platform for CHARUSAT students to discover upcoming events, explore past events, and register for Git Club activities.

## Architecture

This project is structured as a monorepo containing two packages:
- **`client/`**: React SPA built with Vite. It uses plain CSS and `react-router-dom` for navigation.
- **`server/`**: Node.js + Express backend providing a REST API. It uses `better-sqlite3` for an embedded, zero-configuration database.

## Installation & Running Locally

Ensure you have Node.js (v24+) installed.

### 1. Install Dependencies
From the root directory, run:
```bash
npm run install:all
```

### 2. Start the Backend
Open a terminal and run:
```bash
npm run dev:server
```
*This starts the Express server on `http://localhost:3001`. The SQLite database will be automatically created and seeded on the first run.*

### 3. Start the Frontend
Open a second terminal and run:
```bash
npm run dev:client
```
*This starts the Vite development server on `http://localhost:5173`. The Vite config automatically proxies `/api` requests to the backend.*

## Registration Flow

When a student registers:
1. The frontend (`EventDetails.jsx`) submits a POST request to `/api/events/:id/register` via the `RegistrationForm` component.
2. The backend (`eventsController.js`) validates the email format and ensures the event is not full, cancelled, or in the past.
3. The backend uses a SQL transaction to ensure data integrity and atomicity. It relies on a `UNIQUE(event_id, email)` constraint in the SQLite schema to gracefully reject duplicate registrations with a `409 Conflict`.
4. On success, the backend returns a confirmation, and the frontend updates the UI to show a success banner.

## Deployment Instructions (Render)

This project is optimized for deployment on [Render.com](https://render.com).

### Frontend (Static Site)
- **Build Command**: `cd client && npm install && npm run build`
- **Publish Directory**: `client/dist`

### Backend (Web Service)
- **Build Command**: `cd server && npm install`
- **Start Command**: `node server.js`
- **Environment Variables**:
  - `PORT`: (Render assigns this automatically)
  - `CORS_ORIGIN`: Set to the URL of your deployed frontend.

### A Note on Database Persistence
This project uses SQLite. On platforms with ephemeral filesystems (like Render's free tier), the database file will be reset upon a redeployment or container restart. However, the `init.js` logic ensures that the database is automatically rebuilt and seeded with demo data when this happens. This trade-off is intentional to keep the hackathon demo simple and dependency-free.
