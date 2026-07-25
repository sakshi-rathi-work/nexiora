# style-guide.md — NEXIORA Talent Solutions

Referenced from `CLAUDE.md`. This is the design system and the page-by-page UX spec. The **interaction pattern** (navigation rhythm, hero → filters → grid, dashboard tabs, section ordering) is modeled on the reference site (`jobportal-recruitment-theme.netlify.app`) per the project brief — rebuilt with NEXIORA's own component library, copy, and brand palette, and adapted for zero-seed-data launch. Do not copy the reference site's markup, class names, or literal copy.

## 1. Brand Colors

Colors below were sampled directly from the provided NEXIORA logo — do not substitute placeholder colors.

| Token | Hex | Usage |
|---|---|---|
| `--nexiora-navy` | `#122D4E` | Primary brand color — headers, nav background, primary buttons, footer |
| `--nexiora-navy-dark` | `#0A1B33` | Hover/active state for navy elements, dark section backgrounds |
| `--nexiora-gold-start` | `#B89142` | Gradient start (darker end) — accent gradient, icon fills |
| `--nexiora-gold-end` | `#E3BC57` | Gradient end (lighter end) — accent gradient, hover highlights |
| `--nexiora-gold-solid` | `#CFA84C` | Flat gold for text links, small accents, badges where a gradient is impractical |
| `--nexiora-white` | `#FFFFFF` | Base background, card surfaces |
| `--nexiora-off-white` | `#F7F8FA` | Section alternation background (avoids pure-white monotony) |
| `--nexiora-slate` | `#5B6472` | Body text, secondary copy |
| `--nexiora-slate-light` | `#8A93A3` | Placeholder text, disabled states, metadata (dates, tags) |
| `--nexiora-border` | `#E4E7EC` | Card borders, dividers |

**Semantic colors** (kept desaturated to stay corporate, not playful):
| Token | Hex | Usage |
|---|---|---|
| `--status-success` | `#2E7D5B` | "Published", "Offered", success toasts |
| `--status-warning` | `#B8862E` | "Under Review", pending states |
| `--status-info` | `#2E6BB8` | "Interview", informational badges |
| `--status-error` | `#B8422E` | "Rejected", error toasts, form validation errors |
| `--status-neutral` | `#5B6472` | "Draft", "Closed", "Withdrawn" |

The gold gradient (`--nexiora-gold-start` → `--nexiora-gold-end`, typically 135deg) is used sparingly: primary CTA buttons, the active nav-link underline, and small decorative accents — never as a large background fill, to preserve the "enterprise, not flashy" brief.

## 2. Typography

- **Headings:** "Fraunces" (serif, confident, used for H1/H2 on marketing pages) — conveys established/premium rather than startup-flashy. Fallback: `Georgia, serif`.
- **Body & UI:** "Inter" — used for all body copy, form labels, buttons, dashboard UI. Fallback: `system-ui, sans-serif`.
- **Type scale (px):** 12 (caption/meta) · 14 (small body) · 16 (body) · 18 (lead body) · 24 (H4) · 32 (H3) · 48 (H2) · 64 (H1, desktop only — scales to 40 on mobile).
- **Weight usage:** headings 600–700, body 400, emphasized UI labels (badges, nav) 500.
- **Line height:** 1.2 for headings, 1.6 for body copy.

## 3. Spacing & Layout

- **Base unit:** 4px. **Spacing scale:** 8 / 16 / 24 / 32 / 48 / 64 / 96px.
- **Container max-width:** 1280px, with 24px horizontal padding on mobile, 48px on desktop.
- **Section vertical rhythm:** 96px padding-top/bottom on desktop marketing sections, 64px on mobile.
- **Card radius:** 12px (consistent across job cards, testimonial cards, dashboard cards). Buttons: 8px radius (slightly sharper than cards, to read as "clickable UI" vs. "content container").
- **Grid:** 12-column CSS grid on desktop; job/company cards use a responsive grid (`auto-fill, minmax(300px, 1fr)`), stacking to single-column below 768px.

## 4. Iconography & Motion

- **Icons:** Lucide icon set (matches shadcn/ui), 1.5px stroke weight, sized 20/24px in UI, 32/40px in feature highlight sections.
- **Motion (Framer Motion):** fade + 8px upward slide on scroll-into-view for section content, 150–250ms ease-out. No bounce/spring easing, no large parallax, no auto-playing carousels — motion should read as polish, not spectacle.
- **Hover states:** buttons darken by one shade (navy) or intensify the gradient (gold CTA); cards lift with a subtle `box-shadow` increase (no scale-transform, to stay restrained).

## 5. Accessibility

- WCAG 2.1 AA minimum: all text meets 4.5:1 contrast against its background (verify gold-on-white text specifically — use `--nexiora-navy` for text on gold backgrounds, never white-on-gold for body text).
- All interactive elements keyboard-navigable with a visible focus ring (`--nexiora-navy` outline, 2px offset).
- All form inputs have associated `<label>` elements; all images have descriptive `alt` text; all icon-only buttons have `aria-label`.
- Modals trap focus and are dismissible via `Escape`.

## 6. Core Components

| Component | Notes |
|---|---|
| `Navbar` | Sticky, white background with a subtle bottom border on scroll. Logo left, nav links center/left, `Login` + `Sign Up` (or `Dashboard` avatar dropdown if authenticated) right. Real routed links — `/about` and `/contact` are page links, not `#anchor` scrolls. |
| `Footer` | Navy background, white/off-white text, gold link-hover. Columns: brand blurb, "For Job Seekers", "For Employers" *(Phase 2 items grayed out/hidden until built)*, "Company" (About, Login, Dashboard, Contact, Privacy, Terms). |
| `Hero` | Large heading with one gold-accented word/phrase, subheading, search bar (keyword + location + category), and a **live, real stats row** (see §8 — never hardcoded numbers). |
| `ServiceCard` / `JobCard` | White card, `--nexiora-border` outline, 12px radius, company/service icon or logo, title, meta row (location, posted date, tags), CTA button bottom-right. |
| `JobFilterBar` | Sidebar (desktop) / collapsible drawer (mobile): employment type, experience level, salary range, date posted — all with **live counts derived from the current dataset**, showing `(0)` rather than being hidden when a filter option currently has no matches. |
| `Button` | Variants: `primary` (gold gradient, navy text), `secondary` (navy solid, white text), `ghost` (transparent, navy text/border). Sizes: sm/md/lg. |
| `Input` / `TextArea` / `Select` | Consistent 44px height (touch-friendly), `--nexiora-border` default, navy focus ring, red border + inline message on validation error. |
| `Badge` | Used for application/job status — background is a 10%-opacity tint of the relevant semantic color, text is the full-opacity semantic color. |
| `Modal` | Centered, white surface, navy close icon top-right, backdrop blur. |
| `Toast` | Bottom-right, auto-dismiss 4s, colored left border per semantic type. |
| `Pagination` | Numbered, current page in navy solid pill, gold underline on hover for others. |
| `EmptyState` | Icon (Lucide, 48px, `--nexiora-slate-light`) + one-line heading + one-line supporting copy + optional CTA. Reused for: 0 jobs, 0 companies, 0 testimonials, 0 success stories, 0 applications. Copy must be honest, never fake urgency — e.g. *"No open roles right now — new positions are posted as clients confirm hiring needs. Check back soon."* Never invent fake countdown/urgency language. |
| `SkeletonCard` / `SkeletonRow` | Shown only during actual network loading (TanStack Query `isLoading`), never as a permanent substitute for real content. |
| `StatCard` | Dashboard summary tiles (e.g., "Applications Submitted: 0"). |

## 7. Page-by-Page UX (pattern from the reference site, rebuilt with NEXIORA content)

### 7.1 Landing (`/`)
Reference pattern: sticky nav → hero with search → stat band → category grid → featured-jobs grid with tab filters → hiring-companies logo grid → "how it works" numbered steps → value-prop feature trio → testimonials carousel → closing CTA → contact section → footer.

NEXIORA adaptation:
1. **Hero:** Headline about connecting talent with opportunity (gold accent on 1–2 words), subheading, job search bar (keyword/location/category — functional against the live `/jobs` API even when empty), and a **real stats row**: Active Jobs, Hiring Companies, Candidates Placed, formatted from live counts (see §8).
2. **Services grid** *(replaces "Browse by Category" — categories imply a large existing job volume; NEXIORA leads with its consulting services instead, per `business-context.md` §7)*: Permanent Placement, Contract Staffing, Contract-to-Hire, Executive Search, Consulting Advisory — each a card linking to `/services#anchor` or a future `/services` page, not fake job counts per category.
3. **Featured Jobs:** live-fetched from `/jobs?pageSize=6`. If `total > 0`, show up to 6 cards + "View All Jobs" linking to `/jobs`. If `total === 0`, render the `EmptyState` in this section — do not hide the section entirely (keeps page rhythm and signals "jobs go here, none yet").
4. **Hiring Companies:** live-fetched from `/companies?pageSize=8`. Same empty-state rule as above.
5. **How It Works:** four numbered steps (Create Account → Search Jobs → Apply → Get Hired) — static content, safe to write now since it describes the platform's mechanics, not unverified business claims.
6. **Why NEXIORA (value props):** three feature cards — replace the reference site's "AI-Powered Matching / Verified Companies / Lightning-Fast Apply" with NEXIORA-appropriate, truthful claims tied to what's actually built (e.g., "Verified Job Postings", "Direct Application Tracking", "Dedicated Recruiter Support") — do not claim AI matching unless/until that feature (§6.4 of business-context.md) is built.
7. **Testimonials:** live-fetched from `/testimonials`. `EmptyState` when none published yet — do not show placeholder quotes.
8. **Closing CTA:** "Browse Jobs" + "Contact Us" buttons.
9. **Contact teaser section:** short blurb + button linking to `/contact` (real route, not an anchor).
10. **Footer** as defined in §6.

### 7.2 About (`/about`)
Real routed page (not a homepage anchor). Sections: company story/mission (placeholder copy pending business input per `business-context.md` §7–8), leadership/team (omit entirely until real team info is provided — do not invent names/photos), values, and a CTA into `/jobs` or `/contact`.

### 7.3 Contact (`/contact`)
Real routed page. Two-column layout matching the reference pattern: left = contact info cards (Email, Phone, Office, Hours — pending real business details, use clearly marked placeholders), right = contact form (`Name`, `Email`, `Subject`, `Message`) wired to `POST /contact`. Success state replaces the form with a confirmation message; errors surface inline per field via `Toast` + field-level messages.

### 7.4 Jobs (`/jobs`)
Header ("Find your next opportunity"), search bar, `JobFilterBar` (sidebar desktop / drawer mobile) with live counts, sort dropdown (Most Recent / Salary High–Low / Low–High / Relevance), result count ("`{total}` jobs found" — shows "0 jobs found" honestly when empty, paired with the `EmptyState`), job card grid, `Pagination`.

### 7.5 Job Details (`/jobs/[slug]`)
Job title, company (name/logo if available), meta row (location, type, level, posted date), salary range (if provided), full description, skills tag list, sticky "Apply Now" CTA — which routes to `/login?redirect=/jobs/[slug]` if the visitor is a guest, or opens the application flow (resume select/upload + optional cover letter) if authenticated. Shows "You've already applied" state instead of the CTA if `hasApplied=true`.

### 7.6 Login / Signup / Forgot / Reset Password
Centered single-column card on an off-white background, NEXIORA logo top, form below, secondary links (Signup ↔ Login, "Forgot password?"). `Login` includes a "Remember me" checkbox. Password fields have a show/hide toggle. Signup has no role selector (defaults to Candidate per `business-context.md` §5). Email verification and reset-password pages show a clear success/failure state with a next-action button (e.g., "Continue to Login").

### 7.7 Dashboard (`/dashboard`)
Tabbed layout modeled on the reference "My Activity" pattern: **"My Applications"** tab (list of applied jobs with status badges — `EmptyState` reading like *"You haven't applied to any jobs yet"* with a "Browse Jobs" CTA when empty) as the only tab at MVP. A **"My Posted Jobs"** tab is added only in Phase 2 once the Recruiter role UI exists — do not build a placeholder/disabled tab for it at MVP.

### 7.8 Profile (`/dashboard/profile`)
Avatar upload, personal info fields, candidate profile fields (headline, summary, location, skills as tag input, experience years, resume upload with current-file indicator, LinkedIn/portfolio URLs), Save button with inline validation.

### 7.9 Applications (`/dashboard/applications`)
Full list (paginated) of the candidate's applications with status badges, applied date, and a "Withdraw" action for `SUBMITTED`/`UNDER_REVIEW` applications. `EmptyState` when none exist.

### 7.10 Privacy Policy / Terms / 404
Static pages, navy header band, body copy in a single readable column (max-width ~720px). `404` uses the `EmptyState` pattern with a "Back to Home" CTA.

## 8. Rule: No Fabricated Numbers, Ever

The reference site displays large placeholder-style stats ("48K+ Active Jobs", "2.3M+ Job Seekers", "98% Success Rate"). **NEXIORA must never do this.** Every number shown anywhere in the UI (hero stat band, category/job counts, "X jobs found", company open-roles count, testimonial counts) must be computed live from the relevant API's `total`/count field. At launch these will correctly display as `0` or as a neutral message — do not round up, estimate, or replace zero with a vague-but-impressive-sounding phrase that misrepresents the actual number.
