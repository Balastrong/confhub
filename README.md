# ConfHub

Find tech conferences, meetups, and workshops happening around the world — and keep track of the ones that matter to you.

Quick links: **[Live site](https://confhub.tech)** • [Submit an event](https://confhub.tech/events/submit) • [Communities](https://confhub.tech/communities)

What you can do:

- 🔎 Filter events by date, country, tags, and format (in‑person, hybrid, online)
- 📅 Browse an events calendar and explore curated lists
- ✅ RSVP and manage your attendance
- 💬 Comment and join the discussion on event pages
- 🧭 Discover, follow, and manage communities
- ➕ Submit your own events and update community pages

> [!TIP]
> Explore ConfHub live => https://confhub.tech 🚀

## Tech highlights

ConfHub is a web app built with TanStack Start, Vite, and React, featuring authentication, event submissions, RSVPs, comments, and powerful filters.

ConfHub runs server-side on the edge (Netlify Edge target) and uses PostgreSQL with Drizzle ORM for a fast, modern developer experience.

- Powered by TanStack: Start, Router, Query, Form
- React 19, Vite and TypeScript end-to-end
- UI: Tailwind CSS v4, Radix UI primitives, and lucide-react
- Data: PostgreSQL + Drizzle ORM; local dev via Docker
- Auth: Better Auth (email/password + GitHub OAuth)
- Features: event submissions, RSVPs, comments, communities, and filtering by tags/country/mode

Cool isn't it? Maybe worth leaving a star on GitHub! ⭐

## Getting started

Prerequisites:

- pnpm
- Docker (for local Postgres)

### 1) Install dependencies

```bash
pnpm install
```

### 2) Configure environment variables

Copy `.env.example` to `.env.local` and adjust values as needed:

```bash
cp .env.example .env.local
```

Minimum required:

- `DATABASE_URL` — PostgreSQL connection string (see `.env.example` for local)
- OAuth (Better Auth):
  - `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

Google OAuth notes:

- Authorized redirect URI should point to your app domain with the auth endpoint, e.g. `http://localhost:3000/api/auth/callback/google` for local dev and `https://YOUR_DOMAIN/api/auth/callback/google` in production.
- Create credentials in Google Cloud Console (OAuth 2.0 Client ID) for a Web application and add both local and production redirect URIs.

You can also add `.env.production.local` for production (Netlify) or set variables in the Netlify UI.

### 3) Start the database (local)

This repo includes a local Postgres via Docker:

```bash
docker compose up -d
```

Ensure `DATABASE_URL` in your `.env.local` uses `localhost:5432` (see `.env.example`).

### 4) Create/migrate the database

```bash
pnpm db:push
```

Optional tools:

- Generate SQL from schema: `pnpm db:generate`
- Explore DB visually: `pnpm db:studio`

### 5) Seed sample data (optional)

```bash
pnpm db:seed
```

### 6) Run the dev server

```bash
pnpm dev
```

Open http://localhost:3000.

## Data import (bulk events)

- Add or edit events in `data-entry/data.json`
- Import them into the database:

```bash
pnpm db:entry
```

For production environments that use a different env file path:

```bash
pnpm db:entry:prod
```

There’s also a helper instruction at `.github/instructions/import-event.instructions.md` to guide automated data entry from event URLs.

## Environment variables

Server code reads variables via `process.env`. Minimum set:

- `DATABASE_URL` —
  - Local example (Docker): `postgresql://postgres:postgres@localhost:5432/main`
  - Production: use your managed Postgres connection string (e.g., Supabase, RDS, Render)
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` — GitHub OAuth for Better Auth
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth for Better Auth
- Optional: `LOG_DEBUG=1` to enable extra logs in development

Use `.env.local` for development and `.env.production.local` (or Netlify env) for production.

## Deployment (Netlify Edge)

This project is configured for Netlify Edge through TanStack Start:

- Vite plugin: `tanstackStart({ target: "netlify-edge", ... })`
- Make sure your production `DATABASE_URL` and OAuth credentials are set in Netlify environment variables
- Build command: `pnpm build`

After deploy, public assets and server output are placed in `.output` (handled by TanStack Start and Netlify adapter).

## Project structure

A quick mental model of the repo:

- `src/`
  - `routes`: pages and server endpoints (TanStack Router). Includes API endpoints and auth discovery.
  - `components`: UI blocks grouped by domain (auth, events, communities, filters, forms, header, ui primitives).
  - `services`: server handlers plus zod schemas and query keys.
  - `lib`: cross-cutting libs (db schema/migrations/client/seed, auth, sitemap, utilities).
  - `hooks`: reusable React hooks.
  - `app`: entry and styles (router.tsx, globals.css, generated route tree).

## Contributing

Do you want to submit an event? Just send the link here: https://confhub.tech/events/submit
Are you a member of a community? Create one or claim it if it's already existing.

Contributions are welcome! If you find a bug or have an idea, please open an issue or a PR. For larger changes, consider starting a discussion first so we can align on direction.

Recommended workflow:

1. Fork and create a feature branch
2. Add tests or update docs where relevant
3. Run linters/build locally (`pnpm tsc`, `pnpm format` optional)
4. Open a PR with a clear description and screenshots if UI changes
