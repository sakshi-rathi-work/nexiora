# business-context.md — NEXIORA Talent Solutions

Referenced from `CLAUDE.md`. This is the business/product source of truth: what NEXIORA is, who it's for, and what is/isn't in scope. Read this before implementing any feature so behavior matches real business intent, not assumptions.

## 1. Company

- **Legal name:** NEXIORA Talent Solutions Pvt. Ltd.
- **Industry:** Staffing, recruitment, IT consulting, talent acquisition, HR solutions
- **Tagline:** "Connecting Exceptional Talent with Exceptional Companies."
- **Brand positioning:** Premium, modern, corporate, enterprise, clean, trustworthy, professional. Positioned against Deloitte, Accenture, Randstad, Michael Page, Korn Ferry, Adecco — **not** a flashy startup-style brand.
- **Launch state:** Day one, the platform has 0 job listings, 0 hiring companies, 0 testimonials, 0 success stories. This is a deliberate, permanent product requirement until real content is added by the business — not a temporary seeding gap to fill with placeholders.

## 2. Problem Statement & Motivation

Small-to-mid staffing agencies typically run on a fragmented stack: a static marketing site, a separate ATS, email-based applications, and spreadsheets for tracking. This produces a poor candidate experience, no self-service account/application tracking, weak SEO, and a weak digital presence when pitching enterprise hiring clients. NEXIORA replaces this with one system: a marketing/brand layer that reads as enterprise-grade, fused with a real product layer (auth, jobs, applications, dashboards).

## 3. Business Goals

- Establish enterprise-grade brand credibility.
- Convert visitors into registered candidates.
- Give hiring companies a channel to evaluate NEXIORA as a staffing partner (contact form at MVP; self-service job posting in a later phase).
- Build a compounding data asset (candidates, applications, resumes) from day one instead of shipping a brochure site.
- Ship an architecture that scales from 0 to thousands of users without a re-platform.

## 4. Target Audience & Personas

| Persona | Role | Goal | Key Pain Point |
|---|---|---|---|
| **Ananya** | Job Seeker (Candidate), ~4 yrs IT experience | Find and apply to relevant roles fast, track status | Doesn't want to re-enter her resume for every application |
| **Rakesh** | HR Manager at a hiring company | Vet whether NEXIORA is a credible staffing partner | Needs proof of process, not just a contact form |
| **Priya** | Recruiter (internal, Phase 2) | Manage candidate pipeline efficiently | Needs a single dashboard instead of email + spreadsheets |
| **Admin** | Internal (Phase 2) | Own platform data, users, content | Needs full visibility and control with audit trails |

## 5. User Roles (definitive — implement guards exactly to this table)

| Capability | Guest | Candidate | Recruiter | Admin |
|---|---|---|---|---|
| Browse jobs / about / contact | ✅ | ✅ | ✅ | ✅ |
| Signup / Login | ✅ (can initiate) | — | — | — |
| Apply to jobs, view own applications | ❌ | ✅ | ✅ | ✅ |
| Edit own profile | ❌ | ✅ | ✅ | ✅ |
| Post/edit/close jobs | ❌ | ❌ | ✅ (own postings only) | ✅ (all) |
| View applicants for a job | ❌ | ❌ | ✅ (own postings only) | ✅ (all) |
| Change application status | ❌ | ❌ (withdraw own only) | ✅ (own postings' applicants) | ✅ (all) |
| Manage users/roles | ❌ | ❌ | ❌ | ✅ |
| Manage testimonials/success stories | ❌ | ❌ | ❌ | ✅ |
| View audit logs | ❌ | ❌ | ❌ | ✅ |

- New signups default to `CANDIDATE`. There is **no public self-service signup flow for `RECRUITER` or `ADMIN`** at MVP — those roles are assigned manually (directly in the database or via a future admin-only "invite" flow, not yet built). Do not build a role picker on the public signup form.
- A user has exactly one role at a time (no multi-role/permission-group system at MVP).

## 6. Feature Scope

### 6.1 Core Features (MVP — build first, in this order per the roadmap below)
- Public marketing site: Home, About, Services, Contact, Jobs listing, Job Details
- Empty states for jobs, hiring companies, testimonials, success stories (zero dummy data)
- Full authentication: Signup, Email Verification, Login, Logout, Forgot/Reset Password, Remember Me, JWT access + refresh tokens with rotation
- Candidate Dashboard (protected route)
- User Profile (view/edit, avatar, resume upload)
- Job listing with search/filter, correct against an empty dataset
- Job application flow with resume upload
- Application tracking ("My Applications" with status)
- Contact form → stored in DB + emailed to the company inbox (console-logged in local dev)
- Responsive, accessible (WCAG 2.1 AA), SEO-optimized pages

### 6.2 Advanced Features (Phase 2 — do not build until MVP is complete and explicitly requested)
- Recruiter role UI: post/manage jobs, view applicants, change application status
- Admin role UI: manage users, jobs, companies, testimonials, site content
- Hiring company inbound lead capture → converts to a `Company` record
- Resume parsing (auto-fill profile from uploaded resume)
- Saved jobs / job alert emails
- Advanced search (Typesense/Elasticsearch) with facets
- In-app + email notifications on application status change
- Redis-backed caching and rate limiting (MVP uses in-memory rate limiting — see `architecture.md`)
- Real cloud file storage (S3) and transactional email provider (Resend/SES) replacing the local/console stubs

### 6.3 Future Features (not scheduled — do not build speculatively)
- Company/client self-service portal
- Interview scheduling integration
- Candidate skill assessments
- Admin analytics dashboard (funnel metrics)
- Multi-language support
- Mobile app (React Native) reusing the same API

### 6.4 Nice-to-Have (backlog only)
- AI-assisted job matching
- Chat/WhatsApp candidate updates
- Referral program
- Dark mode

## 7. Services Offered (for the "Services" / About content)

NEXIORA offers staffing and consulting services typical of a modern IT staffing agency: **Permanent Placement**, **Contract Staffing**, **Contract-to-Hire**, **Executive Search**, and **IT/HR Consulting Advisory**. This list is a placeholder scope marker for what the Services page should cover structurally — **do not write final marketing copy, pricing, or specific service descriptions without checking with the business owner**; do not invent client names, case studies, or numeric claims (e.g., "500+ placements") anywhere in copy.

## 8. Content & Data Policy (critical)

- Never write fake job postings, fake company names/logos, fake testimonials, or fake success stories into the codebase, seed scripts, or fixtures used by the running app.
- Test fixtures (`*.spec.ts`, `*.test.ts`, Playwright test data) may use obviously-fake data (e.g., `test-user+1@example.com`, "Test Company") scoped only to test files — never data that could leak into a dev/staging database used for demos.
- Legal pages (`Privacy Policy`, `Terms of Service`) need real legal copy from the business before launch — implement the page/route/layout, but insert a clearly marked placeholder (e.g., "Placeholder — legal copy pending review") rather than inventing legal terms.
- Any numeric stat (jobs count, companies count, success rate, users count) must be computed live from the database — never hardcoded, even temporarily, per the reference-site homepage pattern (see `style-guide.md` §Landing Page) which normally shows stats like "48K+ Active Jobs." NEXIORA's version must show the *real*, currently-zero counts, formatted normally (e.g., "0" or "New platform — be the first").

## 9. Roadmap / Milestones (build order)

1. **M0 — Scaffolding:** monorepo, `web/` + `api/` init, Docker Postgres, CI skeleton.
2. **M1 — Design System & Marketing Shell:** Tailwind theme, Navbar/Footer/Button/Input/EmptyState, static `/`, `/about`, `/contact` (form not yet wired), `/privacy`, `/terms`, `/404`.
3. **M2 — Auth Backend:** full `/auth/*` API, email verification via console-logged link, tested end-to-end.
4. **M3 — Auth Frontend:** wire signup/login/verify/reset UI, token refresh interceptor, protected route middleware.
5. **M4 — Dashboard & Profile:** `/users/me`, local-disk resume/avatar upload, `/dashboard`, `/dashboard/profile`.
6. **M5 — Jobs:** `JobsModule`, `CompaniesModule`, `/jobs` list+filter+pagination with empty state, `/jobs/[slug]`.
7. **M6 — Applications:** apply flow, duplicate-prevention, `/dashboard/applications` with status badges.
8. **M7 — Contact, Testimonials, Success Stories:** all remaining public dynamic content, all empty-state-correct.
9. **M8 — Recruiter & Admin (Phase 2 start):** role-scoped job posting/applicant management, audit logging.
10. **M9 — Hardening & Launch:** security review, real provider swap (S3/Resend), Core Web Vitals pass, SEO finalization.

Do not skip ahead to a later milestone's features while an earlier milestone is incomplete, since later milestones assume earlier data models and auth exist.
