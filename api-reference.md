# api-reference.md — NEXIORA Talent Solutions

Referenced from `CLAUDE.md`. This is the definitive REST API contract between `web/` and `api/`. Base URL at MVP: `http://localhost:4000`. All routes are prefixed `/api/v1` unless noted (versioning applied globally in `main.ts`).

## Conventions

- **Auth header:** `Authorization: Bearer <accessToken>` for protected routes. The refresh token travels only via an httpOnly cookie, never in a request body or header.
- **Standard error shape** (all non-2xx responses):
  ```json
  { "statusCode": 400, "message": "Validation failed", "error": "Bad Request", "timestamp": "2026-07-25T10:00:00.000Z", "path": "/api/v1/auth/signup" }
  ```
  `message` may be a string or an array of field-level validation messages.
- **List responses** always use this envelope, and an empty result set is a valid `200`, never an error:
  ```json
  { "items": [], "total": 0, "page": 1, "pageSize": 20 }
  ```
- **Pagination query params:** `page` (default 1), `pageSize` (default 20, max 50).
- **Roles:** `CANDIDATE`, `RECRUITER`, `ADMIN` — see `business-context.md` §5 for the full permission matrix.

---

## 1. Auth (`/auth`)

### `POST /auth/signup`
- **Auth:** Public
- **Body:** `{ "email": string, "password": string (min 8, 1 upper, 1 lower, 1 digit), "firstName": string, "lastName": string }`
- **201:** `{ "userId": "uuid", "email": "string" }`
- **Errors:** `409` email already exists · `422` validation failure

### `GET /auth/verify-email`
- **Auth:** Public
- **Query:** `token` (string)
- **200:** `{ "message": "Email verified successfully" }`
- **Errors:** `400` invalid or expired token

### `POST /auth/login`
- **Auth:** Public
- **Body:** `{ "email": string, "password": string, "rememberMe": boolean }`
- **200:** `{ "accessToken": "jwt", "user": { "id", "email", "firstName", "lastName", "role", "isEmailVerified" } }` + sets `refreshToken` httpOnly cookie
- **Errors:** `401` invalid credentials · `403` email not verified

### `POST /auth/refresh`
- **Auth:** refresh-token cookie required
- **Body:** none
- **200:** `{ "accessToken": "jwt" }` + rotates the `refreshToken` cookie
- **Errors:** `401` missing/invalid/expired/revoked refresh token

### `POST /auth/logout`
- **Auth:** refresh-token cookie required
- **Body:** none
- **204:** no content; clears the `refreshToken` cookie and revokes it server-side

### `POST /auth/forgot-password`
- **Auth:** Public
- **Body:** `{ "email": string }`
- **200:** `{ "message": "If that email exists, a reset link has been sent." }` (always this generic message, regardless of whether the email exists)
- **Errors:** `429` rate-limited

### `POST /auth/reset-password`
- **Auth:** Public
- **Body:** `{ "token": string, "newPassword": string }`
- **200:** `{ "message": "Password reset successfully" }`
- **Errors:** `400` invalid/expired token · `422` password policy failure

---

## 2. Users (`/users`)

### `GET /users/me`
- **Auth:** any authenticated role
- **200:** `{ "id", "email", "firstName", "lastName", "role", "phone", "avatarUrl", "isEmailVerified", "candidateProfile": { "headline", "summary", "location", "skills": [], "experienceYears", "resumeUrl", "linkedinUrl", "portfolioUrl" } | null }`
- **Errors:** `401` unauthenticated

### `PATCH /users/me`
- **Auth:** any authenticated role
- **Body (all optional):** `{ "firstName", "lastName", "phone", "headline", "summary", "location", "skills": string[], "experienceYears", "linkedinUrl", "portfolioUrl" }`
- **200:** updated user object (same shape as `GET /users/me`)
- **Errors:** `401`, `422` validation failure

---

## 3. Uploads (`/uploads`) — MVP local-disk implementation

### `POST /uploads/resume`
- **Auth:** any authenticated role
- **Body:** `multipart/form-data`, field `file` — PDF or DOCX, ≤5MB
- **201:** `{ "url": "/uploads/resumes/{uuid}-filename.pdf", "key": "resumes/{uuid}-filename.pdf" }` — also sets `candidate_profiles.resume_url` for the current user
- **Errors:** `401`, `413` file too large, `415` unsupported file type

### `POST /uploads/avatar`
- **Auth:** any authenticated role
- **Body:** `multipart/form-data`, field `file` — PNG or JPG, ≤2MB
- **201:** `{ "url": "/uploads/avatars/{uuid}-filename.png" }` — also sets `users.avatar_url`
- **Errors:** `401`, `413`, `415`

> Phase 2 note: when `STORAGE_PROVIDER=s3`, these same routes remain the contract — the implementation swaps to issuing/consuming presigned S3 URLs behind `StorageService`, with no change to request/response shape from the frontend's perspective unless explicitly redesigned at that time.

---

## 4. Companies (`/companies`)

### `GET /companies`
- **Auth:** Public
- **Query:** `page`, `pageSize`
- **200:** list envelope of `{ "id", "name", "logoUrl", "website", "industry", "description", "isVerified" }` — `items: []` is valid and expected at MVP

### `POST /companies` *(Phase 2 — Recruiter/Admin only, documented now for schema completeness, not built until Phase 2)*
- **Auth:** `RECRUITER` or `ADMIN`
- **Body:** `{ "name", "website", "industry", "description" }`
- **201:** created company object
- **Errors:** `401`, `403`, `422`

---

## 5. Jobs (`/jobs`)

### `GET /jobs`
- **Auth:** Public
- **Query:** `page`, `pageSize`, `location?`, `skill?`, `employmentType?`, `experienceLevel?`, `search?` (matches title/description via Postgres full-text search)
- **200:** list envelope of `{ "id", "title", "slug", "companyName", "companyLogoUrl", "location", "employmentType", "experienceLevel", "salaryMin", "salaryMax", "skills": [], "createdAt" }` — only `status=PUBLISHED` jobs are returned; `items: []` is valid
- **Errors:** none (malformed filters are ignored/defaulted, not rejected, to keep public browsing resilient)

### `GET /jobs/:slug`
- **Auth:** Public
- **200:** full job object including `description`, `companyId`, `companyName`, `companyLogoUrl`, plus `hasApplied: boolean` (false for guests)
- **Errors:** `404` job not found or not published

### `POST /jobs`
- **Auth:** `RECRUITER` or `ADMIN`
- **Body:** `{ "companyId", "title", "description", "location", "employmentType", "experienceLevel", "salaryMin?", "salaryMax?", "skills": string[], "status": "DRAFT" | "PUBLISHED" }`
- **201:** created job object (slug auto-generated from title, de-duplicated if needed)
- **Errors:** `401`, `403`, `422`

### `PATCH /jobs/:id`
- **Auth:** `RECRUITER` (own postings only, enforced via `posted_by`) or `ADMIN` (any)
- **Body:** any subset of the create fields
- **200:** updated job object
- **Errors:** `401`, `403` (not the owning recruiter), `404`, `422`

### `DELETE /jobs/:id` *(soft — sets `status=CLOSED`, does not hard-delete)*
- **Auth:** `RECRUITER` (own) or `ADMIN`
- **204:** no content
- **Errors:** `401`, `403`, `404`

---

## 6. Applications (`/applications`)

### `POST /applications`
- **Auth:** `CANDIDATE` (or any authenticated user acting as a candidate)
- **Body:** `{ "jobId": "uuid", "resumeUrl": "string (from /uploads/resume)", "coverLetter?: string" }`
- **201:** created application object `{ "id", "jobId", "status": "SUBMITTED", "appliedAt" }`
- **Errors:** `401`, `404` job not found/not published, `409` already applied to this job

### `GET /applications/me`
- **Auth:** any authenticated role
- **Query:** `page`, `pageSize`
- **200:** list envelope of `{ "id", "jobTitle", "companyName", "status", "appliedAt", "updatedAt" }` — `items: []` is valid (no applications yet)

### `PATCH /applications/:id/withdraw`
- **Auth:** the owning candidate only
- **200:** `{ "id", "status": "WITHDRAWN" }`
- **Errors:** `401`, `403` not the owner, `404`

### `GET /applications/job/:jobId` *(Phase 2 — Recruiter/Admin applicant view)*
- **Auth:** `RECRUITER` (job's own postings) or `ADMIN`
- **200:** list envelope of applicant summaries
- **Errors:** `401`, `403`, `404`

### `PATCH /applications/:id/status` *(Phase 2 — Recruiter/Admin)*
- **Auth:** `RECRUITER` (own postings) or `ADMIN`
- **Body:** `{ "status": "UNDER_REVIEW" | "SHORTLISTED" | "INTERVIEW" | "OFFERED" | "REJECTED" }`
- **200:** updated application object
- **Errors:** `401`, `403`, `404`, `422` invalid status transition

---

## 7. Testimonials (`/testimonials`)

### `GET /testimonials`
- **Auth:** Public
- **Query:** `page`, `pageSize`
- **200:** list envelope of `{ "id", "authorName", "authorRole", "companyName", "quote", "rating" }` — only `is_published=true` rows; `items: []` is valid and expected at MVP

*(Create/update/publish endpoints are Admin-only and belong to Phase 2 — not built at MVP since there is no admin UI yet.)*

---

## 8. Success Stories (`/success-stories`)

### `GET /success-stories`
- **Auth:** Public
- **Query:** `page`, `pageSize`
- **200:** list envelope of `{ "id", "title", "slug", "summary", "coverImageUrl" }` — only `is_published=true`; `items: []` is valid

### `GET /success-stories/:slug`
- **Auth:** Public
- **200:** full story including `body`
- **Errors:** `404`

---

## 9. Contact (`/contact`)

### `POST /contact`
- **Auth:** Public, rate-limited (5/min/IP per `architecture.md` §5)
- **Body:** `{ "name": string, "email": string, "phone?": string, "subject": string, "message": string }`
- **201:** `{ "message": "Thanks — we'll be in touch shortly." }` — stores a `contact_submissions` row and calls `MailService.sendContactNotification()` (console-logged at MVP)
- **Errors:** `422` validation failure, `429` rate-limited

---

## 10. Health (`/health`)

### `GET /health`
- **Auth:** Public
- **200:** `{ "status": "ok", "database": "ok" | "error" }`
- Used for local dev sanity checks and future deployment health checks.
