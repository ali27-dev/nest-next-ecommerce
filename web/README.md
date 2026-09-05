# Farzara Store — Web

The customer-facing storefront and admin dashboard for Farzara Store, a fashion e-commerce platform. Built with Next.js (App Router) and Tailwind CSS, consuming the [Farzara Store API](../api).

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui (Radix primitives)
- **Icons:** Lucide, react-icons
- **State:** React Context (auth, cart, quick-add) — no external state library

## Features

### Storefront
- Home page with an admin-managed hero carousel and per-category product rows
- Category pages with live filtering (season, fabric, piece count, price) and sorting
- Product detail pages with an image gallery, size/quantity selection, and live price calculation
- Full-text product search with dedicated results page, filters, and pagination
- Client-side cart (persisted to `localStorage`) with quick-add from product cards
- Full checkout flow: delivery details → payment method (COD / EasyPaisa / Bank Transfer) → confirmation
- Order tracking: view status, cancel a pending/processing order, confirm delivery, see payment rejection reasons
- Customer support: open tickets, threaded replies, category tagging
- Auth: register, login, session persistence, proactive token refresh before expiry

### Admin Dashboard (`/admin`)
- Role-guarded (`ADMIN` only), with its own sidebar layout separate from the storefront
- Product management: full CRUD, primary/secondary/gallery image upload
- Category, fabric, and banner management (including category-scoped hero banners)
- Order management: view all orders, override status, delete
- Payment verification: approve or reject EasyPaisa/Bank Transfer payments with a required rejection reason
- Support inbox: view and reply to customer tickets, manage status

## Project Structure

src/
app/
(storefront routes)
admin/ # Admin dashboard, its own layout + guard
api/ # (none — all data comes from the NestJS API)
components/
layout/ # Header, footer, admin shell
product/ # Card, gallery, filters, quick-add
cart/
checkout/
admin/ # Admin-only components
ui/ # shadcn/ui primitives
contexts/ # Auth, Cart, QuickAdd
hooks/
lib/ # api.ts (fetch helpers), labels, utils
types/



## Getting Started

### Prerequisites

- Node.js 20+
- The [Farzara Store API](../api) running locally or deployed

### Setup

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

Start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

### Creating an admin account

Register normally through the app, then promote the account to `ADMIN` directly in the database (via Prisma Studio on the API side, or a direct SQL update) — there is no self-service admin signup, by design.

## Deployment

Deployed on [Netlify](https://netlify.com), using `@netlify/plugin-nextjs` for server-rendered routes.

- **Base directory:** `web`
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Environment variable:** `NEXT_PUBLIC_API_URL` set to the live API's URL (e.g. `https://your-api.onrender.com/api/v1`)

See `netlify.toml` for the exact build configuration.