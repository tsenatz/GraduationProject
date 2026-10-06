# ERNS

A real estate and rental platform built for the Ethiopian market. Find homes to rent or buy, list properties, and deal with verified owners and agents.

> **Status:** early development. Accounts, email and phone verification are done. Listings and search are next.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | CSS Modules, global CSS variables, Lucide React |
| Auth | Auth.js v5 (Credentials + Google), bcryptjs |
| Database | Neon PostgreSQL, Prisma 7 with `@prisma/adapter-neon` |
| Email and validation | Resend, Zod |

## Getting started

**You need:** Node.js 20+, a [Neon](https://neon.tech) database, and a [Resend](https://resend.com) API key.

```bash
# 1. Clone and enter the project
git clone <repo-url>
cd Erns

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env      # then fill in the values below

# 4. Set up the database
npx prisma migrate dev

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://..."     # Neon connection string
AUTH_SECRET="..."                   # generate with: npx auth secret
AUTH_GOOGLE_ID="..."                # Google OAuth client ID
AUTH_GOOGLE_SECRET="..."            # Google OAuth client secret
RESEND_API_KEY="..."                # Resend API key
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Run the production build |
| `npx prisma studio` | Browse the database in the browser |

## Project structure

```
Erns/
├── app/          # Pages, layouts and routes (App Router)
├── components/   # UI components (auth, home, layout, ui)
├── lib/          # Server utilities, actions, auth, db, mail, schemas
├── prisma/       # Database schema
└── public/       # Static images and assets
```

## Brand colors

| Color | Hex |
| --- | --- |
| Navy | `#0A1931` |
| Blue | `#4A7FA7` |
| Ice Blue | `#B3CFE5` |
| Surface | `#FFFFFF` |
