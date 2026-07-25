# CLAUDE.md — NEXIORA Talent Solutions

This file is the entry point for Claude Code working in this repository. Read it fully before writing any code. It is intentionally short — detailed specs live in `/docs`. Load the relevant doc(s) below **before** touching the related part of the codebase; do not rely on memory of a doc you read earlier in the session if it's been more than a few turns.

## 0. What This Project Is

NEXIORA Talent Solutions Pvt. Ltd. is a staffing & IT consulting agency. This repo builds their production website: a premium, enterprise-grade marketing site (About, Services, Contact, Jobs) fused with a real product layer (signup/login/JWT auth, candidate dashboard, job applications, resume upload). **The platform launches with zero seeded data** — 0 jobs, 0 companies, 0 testimonials, 0 success stories — and every list view must render a correct, designed empty state instead of placeholder/dummy content. Never insert fake jobs, fake companies, fake testimonials, or fake users into seed data or fixtures unless a task explicitly asks for test fixtures scoped to `*.spec.ts` / `*.test.ts` files.

## 1. Reference Docs — read before you build

| Doc | Read before... |
|---|---|
| `docs/business-context.md` | Building any feature — defines what NEXIORA is, who it's for, what's in scope for MVP vs later, and the exact roles/permissions rules |
| `docs/architecture.md` | Any backend, database, or infra work — full tech stack, database schema, folder structure, auth flow, security, env vars |
| `docs/api-reference.md` | Any controller/route/API client work — every endpoint, request/response shape, status codes |
| `docs/style-guide.md` | Any frontend/UI work — brand palette, typography, components, and the page-by-page UX pattern (modeled on the reference site's interaction flow, rebuilt with NEXIORA branding and content) |

If a task spans multiple areas (e.g., "add job applications"), read all four before writing code.

## 2. Repo Structure (monorepo)

```
nexiora/
├── web/                    # Next.js 14 frontend (App Router, TypeScript, Tailwind, shadcn/ui)
├── api/                    # NestJS backend (TypeScript, Prisma, PostgreSQL)
├── docs/                   # This file's companion docs (business-context, architecture, api-reference, style-guide)
├── docker-compose.yml      # Local Postgres (and Redis, once introduced in Phase 2)
├── package.json            # Root scripts that orchestrate web + api
└── README.md
```

`web/` and `api/` are independent npm projects with their own `package.json`. There is no shared workspace tooling (no Turborepo/Nx) at MVP — keep it simple; do not introduce monorepo tooling unless asked.

## 3. Tech Stack (summary — full justification in `docs/architecture.md`)

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion + TanStack Query + Zustand
- **Backend:** NestJS + TypeScript + Prisma + PostgreSQL
- **Auth:** Custom JWT (access + refresh, rotation), bcrypt, Passport.js strategies — no third-party auth vendor
- **File storage (MVP):** local disk under `api/uploads/`, behind a `StorageService` interface so swapping to S3 later touches one file
- **Email (MVP):** console/log-based `MailService` implementation behind a `MailService` interface, swappable to Resend/SES later
- **Package manager:** npm, everywhere (`npm install`, `npm run ...`) — do not introduce pnpm or yarn lockfiles

## 4. Non-Negotiable Rules

1. **No dummy/seed data in the running app.** Empty list endpoints return `200 {items: [], total: 0}`, never fake rows. Frontend must render the `EmptyState` component (see `docs/style-guide.md`) for every empty list, not a broken/blank section.
2. **`/about` and `/contact` are real routed pages**, not anchor-scroll sections on the homepage.
3. **Full auth is required from the start**: signup, email verification (token-based, logged to console in MVP), login, logout, forgot/reset password, JWT access + refresh tokens with rotation, "Remember Me", protected routes, role-based guards. Do not stub or skip any of these.
4. **Follow the backend layering exactly**: Controller → DTO validation (class-validator pipe) → Guard (auth/role) → Service (business logic) → Repository (Prisma) → PostgreSQL. Entities never cross the controller boundary directly — only DTOs.
5. **TypeScript strict mode** in both `web/` and `api/`. No `any` unless justified with a comment.
6. **Every new backend module ships with tests** (unit for services, e2e for the module's endpoints) before it's considered done. Every new frontend flow that touches auth or a form ships with at least one Playwright/RTL test.
7. **Do not assume infrastructure that isn't confirmed.** If a task seems to require a new external service, library, or architectural decision not covered in `/docs`, stop and ask rather than guessing.
8. **Never commit real secrets.** `.env` files are gitignored; `.env.example` (per app) lists required keys with placeholder/local values — see `docs/architecture.md` §Environment Variables.
9. **Build in the milestone order** defined in `docs/business-context.md` §Roadmap unless explicitly told to jump ahead — later milestones depend on earlier ones (e.g., Jobs depends on Auth).

## 5. Local Dev Commands

```bash
# one-time setup
cp api/.env.example api/.env
cp web/.env.example web/.env.local
docker compose up -d              # starts local Postgres
cd api && npm install && npx prisma migrate dev && cd ..
cd web && npm install && cd ..

# day-to-day
cd api && npm run start:dev       # NestJS on http://localhost:4000
cd web && npm run dev             # Next.js on http://localhost:3000

# tests
cd api && npm run test && npm run test:e2e
cd web && npm run test            # component/unit
cd web && npm run test:e2e        # Playwright
```

## 6. Coding Conventions

- **Naming:** `kebab-case` for files/folders, `PascalCase` for React components and Nest classes, `camelCase` for variables/functions, `SCREAMING_SNAKE_CASE` for env vars and enum values.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`), scoped where useful (`feat(auth): add refresh token rotation`).
- **Branches:** `feature/<milestone>-<short-desc>`, e.g. `feature/m2-auth-backend`.
- **DTOs:** one file per DTO under `dto/`, suffixed `CreateXDto`, `UpdateXDto`, `XResponseDto`. Validate with `class-validator`; never trust client input beyond validated DTO shape (`whitelist: true, forbidNonWhitelisted: true` globally).
- **Frontend forms:** validate with Zod, mirroring the backend DTO's rules so client and server never disagree silently.
- **Error handling:** backend throws Nest `HttpException` subclasses with the standard error shape from `docs/api-reference.md`; frontend surfaces errors via the `Toast` component, never a raw `alert()`.

## 7. Definition of Done (per task/milestone)

- [ ] Matches the relevant spec in `/docs` exactly — no unrequested scope, no skipped requirements
- [ ] No hardcoded/dummy data introduced anywhere in app code
- [ ] Empty states render correctly for any new list view
- [ ] Tests written and passing (`npm run test` in the relevant app)
- [ ] TypeScript compiles with no errors (`npm run build`)
- [ ] New env vars (if any) added to the relevant `.env.example` with a comment explaining them
- [ ] If the change affects the API surface, `docs/api-reference.md` is updated in the same PR
- [ ] If the change affects the schema, a Prisma migration is included and `docs/architecture.md`'s schema section is updated in the same PR

## 8. When Unsure

If a request in this repo is ambiguous, conflicts with `/docs`, or would require inventing a business rule (pricing, legal copy, real company names/logos for "hiring companies", specific salary ranges, etc.) — stop and ask rather than inventing placeholder content that could ship to production. This project intentionally has zero fake data; do not "helpfully" add any.
