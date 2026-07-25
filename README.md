# NEXIORA Talent Solutions

Production platform for NEXIORA Talent Solutions Pvt. Ltd. — an enterprise-grade marketing site fused with a real product layer (auth, jobs, applications, candidate dashboard).

## Monorepo Structure

```
nexiora/
├── web/          # Next.js 14 (App Router, TypeScript, Tailwind, shadcn/ui)
├── api/          # NestJS (TypeScript, Prisma, PostgreSQL)
├── docker-compose.yml
└── package.json
```

## Quick Start

### Prerequisites
- Node.js 20+
- Docker Desktop (for local PostgreSQL)
- npm

### One-time setup

```bash
# 1. Start the local PostgreSQL container
docker compose up -d

# 2. Set up the API
cp api/.env.example api/.env
cd api && npm install && npx prisma migrate dev && cd ..

# 3. Set up the frontend
cp web/.env.example web/.env.local
cd web && npm install && cd ..
```

### Day-to-day development

```bash
# Run both servers (from root)
npm run dev

# Or individually:
npm run dev:api    # NestJS on http://localhost:4000
npm run dev:web    # Next.js on http://localhost:3000
```

### Running tests

```bash
npm run test:api        # API unit tests
npm run test:api:e2e    # API end-to-end tests
npm run test:web        # Frontend unit/component tests
```

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | NestJS, TypeScript, Prisma |
| Database | PostgreSQL 16 (Docker, local) |
| Auth | Custom JWT (access + refresh rotation), bcrypt, Passport.js |
| State | TanStack Query + Zustand |
| Testing | Jest + Supertest (api), Jest/RTL + Playwright (web) |

## Environment Variables

See `api/.env.example` and `web/.env.example` for required variables.

**Never commit `.env` files.** All secrets are gitignored.
