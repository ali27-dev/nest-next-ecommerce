# Farzara Store

A full-stack fashion e-commerce platform — menswear, womenswear, watches, shoes, and perfumes — built as a monorepo with a NestJS API and a Next.js storefront/admin dashboard.

| | |
|---|---|
| **Live storefront** | _add your deployed Netlify/Vercel URL here_ |
| **Live API** | _add your deployed Render URL here_ |

## Repositories

This is a monorepo with two independent projects:

- [`api/`](./api) — NestJS backend: REST API, PostgreSQL via Prisma, JWT auth, Cloudinary media storage
- [`web/`](./web) — Next.js frontend: customer storefront and role-guarded admin dashboard

Each has its own `README.md` with detailed setup instructions, scripts, and deployment notes.

## Architecture

Browser
│
▼
Next.js (web) ──────────────► NestJS API (api) ──────────────► PostgreSQL (Neon)
│ │
│ └──────────────────────────► Cloudinary (images)
└── localStorage (cart, session)



- The frontend never talks to the database directly — every read/write goes through the API.
- Auth uses short-lived JWT access tokens with a refresh token pair; the frontend proactively refreshes before expiry and falls back to a silent refresh-and-retry on any `401`.
- Product/banner images are uploaded from the admin dashboard directly to Cloudinary via the API.

## Core Domain

- **Catalog:** Category → Product ← Fabric, with Product carrying season, piece count, stitch type, sizes, and color as filterable attributes
- **Commerce:** Cart → Order → Payment, with Order and Payment tracked as separate lifecycles (an order can exist while its payment is still pending verification)
- **Support:** SupportTicket → SupportMessage, a simple threaded conversation model tied to a customer and optionally an order

## Local Development

Both projects need to run simultaneously:

```bash
# Terminal 1
cd api
npm install
npx prisma migrate dev
npx tsx prisma/seed.ts
npm run start:dev

# Terminal 2
cd web
npm install
npm run dev
```

Visit `http://localhost:3000` for the storefront, `http://localhost:3000/admin` for the dashboard (after promoting an account to `ADMIN`), and `http://localhost:3001/api/v1` for the raw API.

See [`api/README.md`](./api/README.md) and [`web/README.md`](./web/README.md) for full environment variable lists and deployment details.

## Deployment

- **API** — [Render](https://render.com), Root Directory `api`
- **Web** — [Netlify](https://netlify.com), Base Directory `web`, using `@netlify/plugin-nextjs`
- **Database** — [Neon](https://neon.tech) (serverless Postgres)
- **Media** — [Cloudinary](https://cloudinary.com)

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | NestJS 11, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT (access + refresh), Passport |
| Media | Cloudinary |
| Hosting | Netlify (web), Render (api), Neon (database) |