# Novellia Takehome - Pet Management System

A full-stack pet management application built with React (frontend) and Node.js/Express (backend), featuring a SQLite database for storing pet records, vaccines, and allergies.

## Video Walkthrough
- Part 1 https://www.loom.com/share/4e5f4d0ac0ac4c2f8b606321ea466f55
- Part 2 https://www.loom.com/share/7397a885694a4bc194310fde8f9caa3f

## Project Structure

```
novellia-takehome/
├── frontend/          # React + Vite frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service functions
│   │   └── hooks/         # Custom React hooks
├── backend/           # Node/Express backend server
│   ├── modules/          # Feature modules (pets, vaccines, allergies, analytics)
│   ├── db/               # Database configuration and migrations
│   └── server.ts         # Express server entry point
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Quick Start

### Option 1: Run Everything from Root (Recommended)

Install all dependencies and run both frontend and backend:

```bash
# Install all dependencies (root, backend, and frontend)
npm run install:all

# Set up the database schema
npm run db:push

# Seed the database with sample data (optional)
npm run db:seed

# Run both frontend and backend concurrently
npm run dev
```

This will start:
- **Backend**: `http://localhost:3001`
- **Frontend**: `http://localhost:5173`

### Database Schema

The database includes the following tables:
- **pets**: `id`, `name`, `type`, `dob`, `owner`, `created_at`, `updated_at`
- **vaccines**: `id`, `pet_id`, `name`, `date_administered`, `created_at`, `updated_at`
- **allergies**: `id`, `pet_id`, `name`, `reaction`, `severity`, `created_at`, `updated_at`

## API Endpoints

### Health Check
- `GET /api/health` - Server health check

### Pets
- `GET /api/pets` - Get all pets (supports pagination: `?page=1&limit=20`)
- `GET /api/pets/search?q=<term>` - Search pets by name, type, dob, or owner
- `GET /api/pets/:id` - Get pet by ID (includes vaccines and allergies)
- `POST /api/pets` - Create a new pet
- `PUT /api/pets/:id` - Update a pet (supports partial updates)
- `DELETE /api/pets/:id` - Delete a pet

### Analytics
- `GET /api/analytics` - Get analytics data (pet statistics, vaccine coverage, etc.)

## Development

### Frontend

The frontend is built with:
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation

### Backend

The backend is built with:
- **Node.js** with **Express**
- **TypeScript**
- **Drizzle ORM** for database operations
- **SQLite** (better-sqlite3) for the database

### Database Issues
If you encounter database errors:
1. Delete `backend/db/database.sqlite`
2. Run `npm run db:push` to recreate the schema
3. Run `npm run db:seed` to add sample data

### Port Conflicts
- Backend default port: `3001` (can be set via `PORT` environment variable )
- Frontend default port: `5173` (Vite default)
