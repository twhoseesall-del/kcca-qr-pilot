# KCCA Urban Information QR Pilot

A Progressive Web App (PWA) and API backend for scanning physical QR codes to view verified urban heritage and planning data in Kampala.

## Architecture
- **Frontend:** React (Vite) + React-Leaflet (Served via Nginx)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL + PostGIS

## Deployment via Coolify

This repository is optimized for deployment on [Coolify](https://coolify.io/). 

### Prerequisites
1. A Coolify instance running on an Ubuntu VPS.
2. A domain name (or subdomains) pointed to your Coolify server.

### Deployment Steps
1. **Create Database:** In Coolify, create a new PostgreSQL resource and enable the **PostGIS** extension.
2. **Deploy Backend:** 
   - Create a new Application, point it to this repo, and set the **Base Directory** to `/backend`.
   - Set the environment variable `DATABASE_URL` to the internal connection string provided by your Coolify PostgreSQL resource.
   - Set the environment variable `PORT` to `3000`.
3. **Deploy Frontend:**
   - Create a new Application, point it to this repo, and set the **Base Directory** to `/frontend`.
   - Set the environment variable `VITE_API_URL` to the public URL of your deployed backend (e.g., `https://api.yourdomain.com`).
