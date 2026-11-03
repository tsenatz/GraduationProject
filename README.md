# ERNS — Ethio Rents & Sales

A verified direct-contact real estate platform built for the Ethiopian market. Browse, list, and deal directly with property owners and agents in Addis Ababa — no middleman, no broker fees.

**Live →** [erns.vercel.app](https://erns.vercel.app/)

**Demo video →** []

---

## What it does

- Browse properties for sale and rent across Addis Ababa sub-cities
- Search by map — draw a custom area to filter listings geospatially
- Full bilingual support: English and አማርኛ (Amharic)
- Owner phone numbers are masked until unlocked — no contact leakage
- **3-tier access model:**

| Tier | Price | What you get |
| --- | --- | --- |
| Free Explorer | 0 ETB | Browse, map, photos, specs. Contacts masked. |
| Seeker Pack | 290 ETB one-time | 10 verified owner contact unlocks. Credits never expire. |
| VIP Unlimited | 890 ETB / 30 days | Unlimited contact unlocks, direct negotiation, priority support. |

- Landlord & agent dashboard — publish, edit, and track listings
- In-app messaging with Web Push notifications for tour requests

---

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | CSS Modules, global CSS variables, Lucide React |
| Auth | Auth.js v5 (Credentials + Google OAuth), bcryptjs |
| Database | Supabase PostgreSQL, Prisma 7 with `@prisma/adapter-pg` |
| Storage | Supabase Storage (property photos, documents) |
| Maps | MapLibre GL (geospatial search, polygon drawing) |
| Email & push | Resend API, Web Push API |

---

## Getting started

**You need:** Node.js 20+, a [Supabase](https://supabase.com) project, and a [Resend](https://resend.com) API key.

```bash
# 1. Clone and enter the project
git clone https://github.com/tsenatz/GraduationProject.git
cd GraduationProject/Erns

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
# 4. Sync the database schema
npx prisma db push

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

Create a `.env` file inside `Erns/`:

```env
# Supabase database (pooler for app queries)
DATABASE_URL="postgresql://postgres.[ref]:[password]@pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase database (direct connection for migrations)
DIRECT_URL="postgresql://postgres.[ref]:[password]@pooler.supabase.com:5432/postgres"

# Supabase client
NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="..."

# Auth
AUTH_SECRET="..."                # generate with: npx auth secret
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST=true

# Google OAuth
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."

# Email
RESEND_API_KEY="re_..."
```

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Run the production build |
| `npx prisma db push` | Push schema changes to the database |
| `npx prisma studio` | Browse the database in the browser |

---

## Project structure

```
GraduationProject/
└── Erns/
    ├── app/              # Pages, layouts and API routes (App Router)
    │   ├── (auth)/       # Login, register, email verification
    │   ├── (main)/       # Search, pricing, property detail, favorites
    │   └── rentalmanager/# Landlord and agent dashboard
    ├── components/       # UI components
    │   ├── favorites/    # Property cards, quick-view modal
    │   ├── layout/       # Navbar, footer, language switcher
    │   ├── pricing/      # Tier cards and unlock modal
    │   └── property/     # Full property detail view
    ├── lib/              # Server actions, auth, db, schemas
    └── prisma/           # Database schema
```

---

## Brand colors

| Color | Hex |
| --- | --- |
| Navy | `#0A1931` |
| Blue | `#4A7FA7` |
| Ice Blue | `#B3CFE5` |
| Surface | `#FFFFFF` |
