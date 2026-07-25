# architecture.md — NEXIORA Talent Solutions

Referenced from `CLAUDE.md`. This is the technical source of truth: stack, database schema, system architecture, auth flow, security, folder structure, and environment configuration. Read this before any backend, database, or infrastructure work.

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | **Next.js 14 (App Router, React 18, TypeScript)** | SSR/SSG for SEO-critical marketing pages + CSR for the authenticated dashboard; file-based routing gives real routes for `/about` and `/contact` (not anchor scrolls) |
| Backend framework | **NestJS (Node.js, TypeScript)** | Modular, DI-based, maps directly onto Controller → Service → Repository layering with first-class Guards/Pipes/Interceptors |
| Language | **TypeScript everywhere** | Shared DTO contracts between `web/` and `api/` reduce integration bugs |
| Database | **PostgreSQL 16** (local via Docker at MVP) | Relational integrity for Users ↔ Applications ↔ Jobs ↔ Companies, ACID guarantees for auth flows |
| ORM | **Prisma** | Type-safe queries, first-class migrations, clean NestJS integration |
| Authentication | **Custom JWT (access + refresh) via Passport.js strategies**, bcrypt password hashing | Full control over refresh rotation, email verification, and role claims — no third-party auth vendor lock-in |
| File storage (MVP) | **Local disk** (`api/uploads/`), behind a `StorageService` interface | No external account needed to start; swappable to S3 later behind the same interface — see §7 |
| File storage (Phase 2) | AWS S3 (or S3-compatible), presigned uploads | Introduced when real credentials are available, per `business-context.md` §6.2 |
| Email (MVP) | **Console/log-based `MailService`** — writes verification/reset links to the server log instead of sending real email | No external account needed to start |
| Email (Phase 2) | Resend or AWS SES, behind the same `MailService` interface | Swap-in only, no controller/service changes needed |
| Caching / rate-limit store (MVP) | **In-memory** (`@nestjs/throttler` default store) | No Redis dependency required to run locally |
| Caching / rate-limit store (Phase 2) | Redis | Introduced when deploying beyond a single instance |
| Search | PostgreSQL full-text search at MVP; Typesense/Elasticsearch considered at Phase 2 if job volume warrants it | Avoids operating a search cluster before there's data to search |
| Deployment target | **Not yet decided** — MVP runs via Docker Compose locally; do not assume a specific host (Vercel/AWS/Railway/etc.) until confirmed | Avoid building host-specific config until this is confirmed with the business |
| Testing | Jest (unit) + Supertest (API/e2e) in `api/`; Jest/RTL (unit) + Playwright (e2e) in `web/` | Standard NestJS/Next.js testing trio |
| Logging | Pino (structured JSON logs) | Fast, structured, ready for future log aggregation |
| Monitoring | Not yet decided (Sentry/Grafana candidates for Phase 2) | Do not wire a monitoring vendor without confirmation |
| File upload handling | Multer (backend, MVP local disk) | Standard NestJS file upload middleware |
| Validation | class-validator + class-transformer (backend DTOs), Zod (frontend forms) | Declarative validation matching NestJS conventions; frontend Zod schemas mirror backend DTO rules |
| Rate limiting | `@nestjs/throttler`, in-memory store at MVP | Protects auth endpoints from brute force without requiring Redis |
| State management (frontend) | TanStack Query (server state/caching) + Zustand (light client/UI state, incl. in-memory access token) | Query handles API caching/refetch; Zustand avoids Redux boilerplate |
| API client | Axios with interceptors (auto-refresh on 401) | Central place for token refresh logic |
| Styling | Tailwind CSS + shadcn/ui | Design-token-driven, fast, consistent with the "enterprise, clean" brief |
| Animation | Framer Motion | Subtle, enterprise-appropriate motion only |
| Charts | Recharts | Reserved for the Phase 2 admin analytics dashboard |
| Package manager | **npm** everywhere | Confirmed choice — do not introduce pnpm/yarn lockfiles |

### 1.1 Why PostgreSQL over alternatives
- **MongoDB** — rejected: the data is inherently relational (Users ↔ Applications ↔ Jobs ↔ Companies); document modeling would force manual referential integrity that Prisma/Postgres give for free.
- **MySQL** — viable, but Postgres has stronger native full-text search (used for MVP job search) and richer constraint/JSON support.
- **Firebase/Firestore** — rejected: weak relational querying, vendor lock-in, poor fit for RBAC-heavy, audit-heavy staffing data.

## 2. Database Schema

All tables use `uuid` primary keys (generated via `gen_random_uuid()` / Prisma `@default(uuid())`), `created_at`/`updated_at` as `timestamptz`.

### `users`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| email | varchar(255) | unique, not null |
| password_hash | varchar(255) | not null |
| first_name | varchar(100) | not null |
| last_name | varchar(100) | not null |
| role | enum(`CANDIDATE`,`RECRUITER`,`ADMIN`) | not null, default `CANDIDATE` |
| is_email_verified | boolean | not null, default false |
| avatar_url | text | nullable |
| phone | varchar(20) | nullable |
| created_at, updated_at | timestamptz | not null |

### `email_verification_tokens`
| id (PK, uuid) | user_id (FK→users, cascade delete) | token_hash (varchar, indexed) | expires_at (timestamptz) | used_at (timestamptz, nullable) |

### `password_reset_tokens`
| id (PK, uuid) | user_id (FK→users, cascade delete) | token_hash (varchar, indexed) | expires_at (timestamptz) | used_at (timestamptz, nullable) |

### `refresh_tokens`
| id (PK, uuid) | user_id (FK→users, cascade delete) | token_hash (varchar, indexed) | device_info (text, nullable) | expires_at (timestamptz) | revoked_at (timestamptz, nullable) | created_at (timestamptz) |

### `candidate_profiles`
| id (PK, uuid) | user_id (FK→users, unique, cascade delete) | headline (varchar(200), nullable) | summary (text, nullable) | location (varchar(150), nullable) | skills (text[], default `{}`) | experience_years (smallint, nullable) | resume_url (text, nullable) | linkedin_url (text, nullable) | portfolio_url (text, nullable) | updated_at (timestamptz) |

### `companies`
| id (PK, uuid) | name (varchar(200), not null) | logo_url (text, nullable) | website (text, nullable) | industry (varchar(100), nullable) | description (text, nullable) | is_verified (boolean, default false) | created_at (timestamptz) |

### `jobs`
| id (PK, uuid) | company_id (FK→companies) | title (varchar(200), not null) | slug (varchar(220), unique, not null) | description (text, not null) | location (varchar(150), not null) | employment_type enum(`FULL_TIME`,`PART_TIME`,`CONTRACT`,`INTERNSHIP`,`REMOTE`,`HYBRID`) | experience_level enum(`ENTRY`,`MID`,`SENIOR`,`LEAD`) | salary_min (integer, nullable) | salary_max (integer, nullable) | skills (text[], default `{}`) | status enum(`DRAFT`,`PUBLISHED`,`CLOSED`) default `DRAFT` | posted_by (FK→users) | created_at, updated_at (timestamptz) | expires_at (timestamptz, nullable) |

### `applications`
| id (PK, uuid) | job_id (FK→jobs) | candidate_id (FK→users) | resume_url (text, not null) | cover_letter (text, nullable) | status enum(`SUBMITTED`,`UNDER_REVIEW`,`SHORTLISTED`,`INTERVIEW`,`OFFERED`,`REJECTED`,`WITHDRAWN`) default `SUBMITTED` | applied_at, updated_at (timestamptz) |
**Unique constraint:** `(job_id, candidate_id)` — a candidate can apply to a given job only once.

### `testimonials`
| id (PK, uuid) | author_name (varchar(150), not null) | author_role (varchar(150), nullable) | company_name (varchar(150), nullable) | quote (text, not null) | rating (smallint 1–5, nullable) | is_published (boolean, default false) | created_at (timestamptz) |

### `success_stories`
| id (PK, uuid) | title (varchar(200), not null) | slug (varchar(220), unique, not null) | summary (text, not null) | body (text, not null) | cover_image_url (text, nullable) | is_published (boolean, default false) | created_at (timestamptz) |

### `contact_submissions`
| id (PK, uuid) | name (varchar(150), not null) | email (varchar(255), not null) | phone (varchar(20), nullable) | subject (varchar(200), not null) | message (text, not null) | status enum(`NEW`,`READ`,`RESPONDED`) default `NEW` | created_at (timestamptz) |

### `audit_logs`
| id (PK, uuid) | actor_id (FK→users, nullable — null for system actions) | action (varchar(100), not null) | entity_type (varchar(50), not null) | entity_id (uuid, nullable) | metadata (jsonb, nullable) | created_at (timestamptz) |

### 2.1 Relationships
- `users (1) — (1) candidate_profiles`
- `users (1) — (many) applications` (as candidate)
- `users (1) — (many) refresh_tokens`
- `users (1) — (many) email_verification_tokens`, `users (1) — (many) password_reset_tokens`
- `companies (1) — (many) jobs`
- `jobs (1) — (many) applications`
- `users (1) — (many) jobs` (as `posted_by`)

### 2.2 Indexes
- `users.email` — unique btree
- `jobs.slug` — unique btree; `jobs.status` — btree; `jobs.location` — btree; GIN index on `jobs.skills`
- `applications(job_id, candidate_id)` — unique composite
- `refresh_tokens.user_id`, `refresh_tokens.token_hash` — btree
- `email_verification_tokens.token_hash`, `password_reset_tokens.token_hash` — btree

## 3. System Architecture

```
┌───────────────────────┐        ┌──────────────────────────────┐        ┌──────────────┐
│  Next.js (web/)         │  HTTPS │  NestJS API (api/)             │  SQL   │  PostgreSQL    │
│  SSR/SSG marketing pages ├───────►│  Controller → DTO/Guard →       ├───────►│  (Docker, local)│
│  CSR dashboard/auth      │◄───────┤  Service → Repository (Prisma)  │◄───────┤                │
└───────────┬─────────────┘        └──────┬─────────────┬─────────┘        └──────────────┘
            │                              │             │
            │ multipart upload             │             │ log line (MVP)
            ▼                              ▼             ▼
   ┌─────────────────┐              ┌──────────────┐  ┌───────────────────┐
   │  api/uploads/      │              │  In-memory     │  │  Console MailService│
   │  (local disk, MVP)  │              │  rate-limit    │  │  (logs verification/│
   └─────────────────┘              │  store        │  │  reset links, MVP)  │
                                     └──────────────┘  └───────────────────┘
```

**Backend layering (every module):** `Controller` (routes, Swagger decorators) → `DTO validation` (class-validator Pipe) → `Guard` (`JwtAuthGuard`, `RolesGuard`) → `Service` (business logic) → `Repository` (Prisma queries, isolates ORM from service logic) → `PostgreSQL`. DTOs are the only objects that cross the controller boundary; Prisma entities never leak directly to the client.

## 4. Authentication Flow

1. **Signup** — `POST /auth/signup` → validate DTO → hash password (bcrypt, cost 12) → create user (`is_email_verified=false`) → generate a verification token (random, hashed before storage, 24h expiry) → `MailService.sendVerificationEmail()` (MVP: logs the link to the server console).
2. **Email Verification** — `GET /auth/verify-email?token=` → hash incoming token, match against `email_verification_tokens`, check not expired/not used → set `is_email_verified=true`, mark token used.
3. **Login** — `POST /auth/login` → verify credentials → require `is_email_verified=true` (else `403`) → issue **access token** (JWT, 15 min expiry) + **refresh token** (opaque random value, hashed, stored in `refresh_tokens`; 7-day expiry, or 30-day if `rememberMe=true`).
4. **Refresh** — `POST /auth/refresh` (reads refresh token from an httpOnly cookie) → validate stored hash + expiry + not revoked → **rotate**: issue a new refresh token, revoke the old one → issue a new access token. Rotation prevents replay of a stolen refresh token past its first reuse.
5. **Forgot Password** — `POST /auth/forgot-password` → generate reset token (hashed, 1h expiry) → email link (console-logged at MVP). Always returns a generic `200` regardless of whether the email exists, to avoid email enumeration.
6. **Reset Password** — `POST /auth/reset-password` → validate token (not expired/not used) → set new password hash → **revoke all existing refresh tokens** for that user (forces re-login on every device).
7. **Logout** — `POST /auth/logout` → revoke the current refresh token, clear the httpOnly cookie.
8. **Role enforcement** — a `RolesGuard` reads the `role` claim embedded in the access token payload and is checked per-route via a `@Roles(...)` decorator, per the table in `business-context.md` §5.

**Token storage:** access token kept in memory (Zustand store), never in localStorage. Refresh token lives only in an httpOnly, Secure (in production), SameSite=Strict cookie. In local HTTP dev, `Secure` is conditionally disabled based on `NODE_ENV`.

## 5. Security

- **Passwords:** bcrypt, cost factor 12; never logged; never included in any API response.
- **JWT:** access tokens signed HS256 at MVP with a server-side secret (`JWT_ACCESS_SECRET`); consider RS256 if/when the frontend needs to verify tokens at the edge without the signing secret (not required at MVP).
- **Refresh tokens:** stored hashed (never plaintext), rotated on every use, revocable per-device, httpOnly cookie only.
- **Rate limiting:** `@nestjs/throttler` on `/auth/*` and `/contact` (e.g., 5 requests/min/IP), in-memory store at MVP.
- **Helmet:** standard secure headers (CSP, HSTS, X-Frame-Options) applied globally in `main.ts`.
- **CORS:** allow-list restricted to the known frontend origin(s) — read from `CORS_ALLOWED_ORIGINS` env var, never `*`.
- **Input validation:** every DTO validated with class-validator; global `ValidationPipe({whitelist: true, forbidNonWhitelisted: true})` rejects any unexpected field.
- **XSS:** React's default escaping + CSP; any rendered rich text (job descriptions, testimonials) is sanitized server-side before storage or client-side before render — never `dangerouslySetInnerHTML` on unsanitized input.
- **SQL injection:** eliminated structurally by Prisma's parameterized queries; no raw string-concatenated SQL.
- **CSRF:** SameSite=Strict cookies + a custom header check (e.g., `X-Requested-With`) required on state-changing requests.
- **File upload security:** allow-list by MIME type and extension (resumes: PDF/DOCX, ≤5MB; avatars: PNG/JPG, ≤2MB), size enforced by Multer config, filenames sanitized/UUID-renamed on disk to prevent path traversal. Virus scanning is a Phase 2 item once real file storage (S3) is in place — flag this gap explicitly in code comments where uploads are accepted at MVP, do not silently skip it.

## 6. Folder Structure (monorepo)

```
nexiora/
├── docker-compose.yml          # Postgres (Redis added in Phase 2)
├── docs/                       # business-context.md, architecture.md, api-reference.md, style-guide.md
├── web/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx                 # Landing
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── jobs/page.tsx
│   │   │   ├── jobs/[slug]/page.tsx
│   │   │   ├── privacy/page.tsx
│   │   │   └── terms/page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── verify-email/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx               # protected-route wrapper
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── dashboard/profile/page.tsx
│   │   │   └── dashboard/applications/page.tsx
│   │   ├── not-found.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                          # Button, Input, Modal, Badge, EmptyState, Skeletons...
│   │   ├── layout/                      # Navbar, Footer
│   │   ├── jobs/                        # JobCard, JobFilterBar
│   │   └── dashboard/                   # StatCard, ApplicationRow
│   ├── lib/
│   │   ├── api-client.ts                # Axios + refresh interceptor
│   │   ├── auth-store.ts                # Zustand auth state
│   │   └── validators/                  # Zod schemas mirroring backend DTOs
│   ├── hooks/                           # useJobs, useApplications (TanStack Query)
│   ├── public/assets/                   # logo, favicons
│   ├── middleware.ts                    # route protection at the edge
│   ├── .env.example
│   └── next.config.ts
├── api/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── common/
│   │   │   ├── guards/                  # JwtAuthGuard, RolesGuard
│   │   │   ├── decorators/              # @Roles(), @CurrentUser()
│   │   │   ├── interceptors/
│   │   │   ├── filters/                 # global exception filter (standard error shape)
│   │   │   └── pipes/
│   │   ├── config/                      # env validation (e.g., via Joi/Zod), config module
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── prisma.service.ts
│   │   ├── modules/
│   │   │   ├── auth/                    # controller, service, strategies/, dto/
│   │   │   ├── users/
│   │   │   ├── jobs/
│   │   │   ├── applications/
│   │   │   ├── companies/
│   │   │   ├── testimonials/
│   │   │   ├── contact/
│   │   │   ├── uploads/                 # StorageService interface + LocalDiskStorageService
│   │   │   └── audit/
│   │   └── mail/                        # MailService interface + ConsoleMailService
│   ├── test/                            # e2e specs
│   ├── uploads/                         # local file storage (gitignored)
│   ├── .env.example
│   └── Dockerfile
└── README.md
```

## 7. File Upload Design (MVP → Phase 2 migration path)

MVP: the frontend uploads directly to the NestJS API via `multipart/form-data` (Multer), which validates type/size and writes to `api/uploads/{category}/{uuid}-{sanitizedFilename}`. The file's public URL is served via a static route (e.g., `GET /uploads/:category/:filename`, only for files the requesting user is authorized to see, per resource — resumes are not publicly listable). The API layer talks to a `StorageService` interface (`save(file): Promise<{url, key}>`, `delete(key): Promise<void>`) so that swapping the `LocalDiskStorageService` implementation for an `S3StorageService` (with presigned URLs) in Phase 2 requires no controller or DTO changes.

## 8. Deployment (status: not yet decided)

MVP runs entirely via `docker-compose.yml` (Postgres only) plus `npm run start:dev` / `npm run dev` locally. **Do not build CI/CD pipelines, Vercel/AWS/Railway configs, or production Dockerfiles for a specific host until the hosting decision is confirmed** — this avoids building throwaway infra config. When a host is chosen, this section will be updated with the specific deployment topology, domain/SSL, and CI/CD pipeline before that work begins.

## 9. Performance & SEO (MVP scope)

- Next.js ISR for `/`, `/about`, `/jobs/[slug]`; SSR for `/jobs` (fresh listings).
- `next/image` for any images (logo, future company logos).
- Pagination on `/jobs` and `/applications` — never return unbounded lists (default page size 20, max 50).
- Per-page metadata via the Next.js Metadata API; `sitemap.xml` generated to include only published jobs/pages; `robots.txt` disallows `/dashboard`.
- `JobPosting` schema.org structured data on job detail pages, added once real jobs exist.
- Semantic HTML (single `<h1>` per page), descriptive `alt` text throughout.

## 10. Environment Variables

### `api/.env.example`
```bash
# App
NODE_ENV=development
PORT=4000
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Database (matches docker-compose.yml local Postgres)
DATABASE_URL=postgresql://nexiora:nexiora_local_pw@localhost:5432/nexiora_dev

# Auth
JWT_ACCESS_SECRET=change-me-local-dev-only
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN_REMEMBER_ME=30d
BCRYPT_SALT_ROUNDS=12

# Mail (MVP: console logger — no real values needed)
MAIL_PROVIDER=console

# Storage (MVP: local disk — no real values needed)
STORAGE_PROVIDER=local
LOCAL_UPLOAD_DIR=./uploads
MAX_RESUME_SIZE_MB=5
MAX_AVATAR_SIZE_MB=2

# Rate limiting
THROTTLE_TTL_SECONDS=60
THROTTLE_LIMIT=5
```

### `web/.env.example`
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

When real providers are introduced in Phase 2, add `MAIL_PROVIDER=resend` / `STORAGE_PROVIDER=s3` variants with their required keys (`RESEND_API_KEY`, `AWS_ACCESS_KEY_ID`, etc.) — do not add these keys before they're actually needed.
