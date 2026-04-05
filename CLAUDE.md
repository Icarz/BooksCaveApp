# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (`/backend`)
```bash
npm start          # Run with node
```
No dev script exists — add `"dev": "nodemon server.js"` to `package.json` if live-reload is needed.

### Frontend (`/client`)
```bash
npm run dev        # Vite dev server (proxies /api → localhost:5000)
npm run build      # Production build
npm run lint       # ESLint
```

There are no tests in this project.

## Architecture

**Monorepo with separate backend and client folders.** They are run independently — the Vite dev server proxies `/api/*` to `http://localhost:5000` (configured in `client/vite.config.js`), so both must be running locally.

### Backend (`/backend`)
- `server.js` — Express entry point. Mounts routes, CORS, and error handlers.
- `config/db.js` — Mongoose connection using `MONGO_URI` from `.env`.
- `models/Books.js` — Book schema with an embedded `reviewSchema` array. Stores `userId` (string) to tie books to users. Also stores `volumeId` (Google Books volume ID) for deduplication.
- `models/User.js` — User schema. Has a `saved` array field that is currently unused — books are linked to users via `userId` on the Book model instead.
- `middleware/auth.js` — `protect` middleware: validates Bearer JWT, attaches `req.user` (full user object minus password).
- `routes/authRoutes.js` — `/api/auth/register` and `/api/auth/login`. Issues 1-hour JWTs.
- `routes/googleBooks.js` — Main API. Proxies Google Books search, saves books per-user, handles CRUD and reviews. All mutating routes require `protect`.
- `routes/protected.js` — Stub test route, not used by the frontend.
- `controllers/authMiddleware.js` — Dead code. A duplicate auth router with `express-validator` that is never imported. Can be deleted.

**Required env vars** (in `backend/.env`):
```
MONGO_URI, JWT_SECRET, GOOGLE_BOOKS_API_KEY, FRONTEND_URL, PORT
```

### Frontend (`/client`)
- `main.jsx` — Wraps the app in `<BrowserRouter>` and `<AuthProvider>`.
- `AuthContext.jsx` — Provides `{ isAuthenticated, login, logout }`. Reads from `localStorage` on mount. `login()` only sets state — the token must be written to `localStorage` by the caller (done in `Auth.jsx`).
- `App.jsx` — Defines routes: `/` (Home), `/auth` (Auth), `/saved` (SavedBooks, protected).
- `components/ProtectedRoute.jsx` — Redirects unauthenticated users to `/auth`.
- `pages/Home.jsx` — Fetches Google Books via `/api/google-books?q=...`, handles search + save.
- `pages/SavedBooks.jsx` — Fetches the current user's saved books from `/api/google-books/saved`, supports delete and inline reviews.
- `pages/Auth.jsx` — Combined login/register form. On success, stores `token` and `user` in `localStorage` and calls `login()` from context.
- `components/BookCard.jsx` — Used on Home. Shows search results, conditionally renders "Save to Library" when logged in.
- `components/ReviewForm.jsx` / `ReviewList.jsx` — Used inside SavedBooks cards to post and display reviews for a specific book.

### Key data flow
1. User logs in → JWT stored in `localStorage` → sent as `Authorization: Bearer <token>` on every protected request.
2. Saving a book: frontend sends `volumeId` to `POST /api/google-books/save` → backend fetches full details from Google Books API and persists to MongoDB under the current user's ID.
3. Reviews are embedded subdocuments on the Book model, not a separate collection.

### Known non-issues / dead code
- `User.saved` array field is defined in the schema but never populated — books are linked via `userId` on Book instead.
- `routes/protected.js` is a stub (`GET /api/protected`) with no frontend usage.
