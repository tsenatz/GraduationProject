# Project File Structure Rules

This is our strict project file structure. Whenever you write code, create files, or suggest components, make sure they strictly follow this layout. If I ever ask you to put a file in the wrong place, correct me and give me the right path.

## Basic File Structure

```text
Erns/ (or homefinder-single/)
├── app/                        <-- Next.js App Router (Pages, Routes, Layouts)
│   ├── (marketing)/            <-- Home, about, city landing pages
│   ├── homes/[...filters]/     <-- Search results (SSR, shareable URLs)
│   ├── listing/[id]/[slug]/    <-- Property details page
│   ├── (account)/              <-- Saved homes, alerts, inbox
│   ├── (agent)/dashboard/      <-- Agent listing management (Sprint 2 goal)
│   └── api/                    <-- Backend route handlers (Auth, Properties, etc)
│
├── components/                 <-- Shared presentational UI components
│   ├── ui/                     <-- Buttons, inputs, modals (Design system)
│   └── Navigation.tsx
│
├── features/                   <-- Feature-first modules (Keeps code modular)
│   ├── search/                 <-- Filters, query parsing, URL state
│   ├── map/                    <-- Map, clusters, markers
│   ├── listing/                <-- Gallery, details, calculators
│   └── messaging/              <-- Agent-buyer contact forms
│
├── prisma/                     <-- Database (Replaces packages/db)
│   └── schema.prisma           <-- Your Postgres database schema & models
│
├── lib/                        <-- Utils, Zod schemas, helper functions
│   ├── db.ts                   <-- Prisma client instance
│   └── validations.ts          <-- Zod validation schemas
│
├── public/                     <-- Static assets (images, icons)
├── .env                        <-- Environment variables (Database URL, keys)
├── package.json                <-- All dependencies in one place
└── tsconfig.json
```

## Rules
- **Strict Compliance:** Any new file or component MUST be placed according to this layout.
- **Enforce Structure:** If the user requests a file to be placed incorrectly based on this structure, correct the user and provide the proper path.
- **Modularity:** Maintain feature-first modules in the `features/` directory to keep the code modular.
- **Shared Components:** Shared presentational components go in `components/`, with basic design system elements in `components/ui/`.
- **App Router:** Follow Next.js App Router conventions within the `app/` directory.
