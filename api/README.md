# Farzara Store — API

The backend for Farzara Store, a fashion e-commerce platform (menswear, womenswear, watches, shoes, perfumes). Built with NestJS, PostgreSQL (via Prisma), and Cloudinary for media storage.

## Tech Stack

- **Framework:** NestJS 11
- **Language:** TypeScript
- **Database:** PostgreSQL (hosted on [Neon](https://neon.tech))
- **ORM:** Prisma 7 (with the `@prisma/adapter-pg` driver adapter)
- **Auth:** JWT (access + refresh token pair), Passport
- **File storage:** Cloudinary
- **Validation:** class-validator / class-transformer

## Features

- **Auth** — register, login, refresh token rotation, logout, role-based access (`USER` / `ADMIN`)
- **Catalog** — categories, fabrics, products with variants (season, piece count, stitch type, sizes, color), full-text and filtered search, sale pricing
- **Cart & Checkout** — server-side cart, transactional checkout that snapshots pricing and decrements stock
- **Payments** — Cash on Delivery, EasyPaisa, and Bank Transfer, with manual admin verification and rejection reasons for the latter two
- **Orders** — full lifecycle (`PENDING` → `PROCESSING` → `DELIVERED`/`CANCELLED`/`FAILED`), customer-initiated cancellation and delivery confirmation, admin status overrides
- **Banners** — admin-managed homepage/category hero carousel images
- **Support** — customer support tickets with threaded replies, category tagging, and status tracking
- **Media** — image upload to Cloudinary for product primary/secondary/gallery images and banners
- **Admin API** — role-guarded endpoints mirroring every customer-facing resource for management (products, categories, fabrics, orders, payments, banners, support)

## Project Structure

src/
common/ # Shared guards, decorators (roles, get-user)
config/ # Cloudinary provider/service/module
modules/
auth/
products/
categories/
fabrics/
cart/
orders/
payments/
banners/
support/
prisma/ # PrismaService (driver-adapter based)
prisma/
schema.prisma
migrations/
seed.ts


Each feature module follows the same shape: `*.controller.ts`, `*.service.ts`, `*.module.ts`, and a `dto/` folder for request validation.

## Getting Started

### Prerequisites

- Node.js 20+
- A PostgreSQL database (Neon recommended — free tier works)
- A Cloudinary account (free tier works)

### Setup

```bash
npm install
```

Create a `.env` file in the project root:

```env
PORT=3001
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

JWT_SECRET=your_access_token_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run migrations and seed the database:

```bash
npx prisma migrate dev
npx tsx prisma/seed.ts
```

Start the dev server:

```bash
npm run start:dev
```

The API runs at `http://localhost:3001`, with all routes prefixed `api/v1`.

### Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Start in watch mode |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run the compiled build |
| `npx prisma studio` | Browse the database visually |
| `npx tsx prisma/seed.ts` | Seed categories, fabrics, and sample products |

## Deployment

Deployed on [Render](https://render.com).

- **Root directory:** `api`
- **Build command:** `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
- **Start command:** `npm run start:prod`
- All environment variables above must be set in Render's dashboard, using production secrets and the live database URL.

## API Documentation

All endpoints are prefixed `/api/v1`. Public read endpoints (products, categories, fabrics, banners) require no authentication. Mutating endpoints require a valid JWT (`Authorization: Bearer <token>`); admin-only endpoints additionally require the `ADMIN` role.