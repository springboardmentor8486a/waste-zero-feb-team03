# waste-zero-feb-team03

This repository contains a **Node/Express/MongoDB** backend and a **React/Vite/TailwindCSS** frontend for a volunteer-opportunity platform.

## Getting Started

### Backend

1. Change to the `Backend` folder and install dependencies:
   ```bash
   cd Backend
   npm install
   ```
2. Create a `.env` file in `Backend` with at least:
   ```env
   MONGODB_URI=mongodb://localhost:27017/wastezero
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
3. Start the server:
   ```bash
   npm start   # or use nodemon src/server.js if you prefer
   ```
4. (Optional) Seed the database with sample data:
   ```bash
   node src/seed.js
   ```

The backend listens on `http://localhost:5000` and exposes `/auth` and `/users` routes.

### Frontend

1. Switch to the frontend workspace and install:
   ```bash
   cd Frontend/Waste-Zero
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

### Integration

- The frontend `api` service uses base URL `http://localhost:5000` (no `/api` prefix).
- Login and registration forms now call the actual backend endpoints and store
  JWTs in `localStorage` via `AuthContext`.
- Protected pages (`/dashboard/ngo`, `/dashboard/volunteer`) check the token
  and role before allowing access.
