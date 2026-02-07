# Invoicing App — Test Report

**Date:** 2026-02-07
**Environment:** macOS, Bun + Turborepo monorepo
**Web Server:** http://localhost:3004 (Vite dev, TanStack Start)
**API Server:** http://localhost:3013 (Hono + Node.js mode)
**Database:** PostgreSQL 5432 — `invoicing_db`

---

## 1. Bug Fixes Applied (28 total)

### Session 1 — Frontend Fixes
1. **Tailwind CSS not loading** — Created `apps/web/src/styles.css` with `@import "tailwindcss"`, linked in `__root.tsx`, removed conflicting PostCSS plugins.
2. **`<Toaster />` missing** — Added Sonner `<Toaster richColors position="top-right" />` in `__root.tsx`.
3. **oRPC query crashes** — Fixed `invoices.tsx` and `clients.tsx` to use `.queryOptions()`. Converted `tickets.tsx`, `conversations.tsx`, `knowledge.tsx` to placeholders.
4. **`/app/billing` 404 on SSR** — Fixed `router.tsx` import path from stale `"./routes/routeTree.gen"` to `"./routeTree.gen"`. Deleted stale copy.
5. **Missing routes** — Created `forgot-password.tsx`, `terms.tsx`, `privacy.tsx`.
6. **Sitemap** — Fixed to only reference existing routes.
7. **OAuth buttons** — Replaced raw "G"/"GH" text with proper SVG icons in `signup.tsx`.
8. **Auth guard** — Added `beforeLoad` with session check + demo mode bypass in `app.tsx`.

### Session 2 — Critical Hydration Fix
9. **React hydration completely broken** — `client.tsx` was empty, populated with `hydrateRoot()`. Simplified `vite.config.ts` to remove custom start entry override.

### Session 3 — Database & API Setup
10. **Database setup** — Updated `DATABASE_URL` to local PostgreSQL. Fixed `.js` extension imports in schema files. Installed missing `dotenv`. Pushed Drizzle schema (11 tables).
11. **Updated `VITE_PUBLIC_SITE_URL`** — Changed to `http://localhost:3004`.
12. **Vite proxy for API** — Added proxy config forwarding `/api/*` → port 3013.
13. **API env polyfill** — Added middleware polyfilling `c.env` with `process.env` in Node.js mode.
14. **API dev port** — Changed from hardcoded 3001 to configurable 3013.

### Session 4 — Auth Chain Fixes
15. **KV storage crash** — Made `secondaryStorage` conditional (KV unavailable in local dev).
16. **Secure cookies for localhost** — Set `useSecureCookies: false` when `baseURL` starts with `http://localhost`.
17. **Neon serverless driver fix** — Added dual-driver support: `node-postgres` for local, Neon serverless for production.
18. **Drizzle adapter schema mismatch** — Changed `usePlural: false`, passed schema to adapter.
19. **Auth handler error logging** — Added try-catch with detailed logging for debugging.

### Session 4 — Client-Side Auth Fixes
20. **SSR auth guard skip** — Added `if (typeof window === "undefined") return` to skip auth check during SSR.
21. **oRPC client URL fix** — Changed from relative `/api/rpc` to function returning absolute URL.
22. **oRPC organization slug header** — Added `x-organization-slug` header from localStorage.
23. **Redis cache fail-open** — Wrapped `getOrCache()` and `invalidateCache()` in try-catch.

### Session 5 — User Flows & Organization
24. **`/app` index redirect** — Created redirect from `/app` to `/app/dashboard`.
25. **`organizationClient()` plugin** — Added to auth store for org management methods.
26. **Auto-create org on signup** — Creates default org after successful signup.
27. **Persist org on login** — Fetches and persists org slug after login.
28. **Org guard in `/app`** — Fallback guard ensuring active org is set.

---

## 2. Green Theme Standardization

### CSS Architecture
- Defined full green color palette as CSS custom properties in `:root` (light) and `.dark` blocks in `apps/web/src/styles.css`
- Bridged CSS vars to Tailwind v4 via `@theme inline` blocks
- Key tokens: `--primary` = green-600, `--background` = green-tinted white, `--foreground` = green-950

### Files Updated for Green Theme (16 files)

| File | Changes |
|------|---------|
| `styles.css` | Full green theme CSS variables + `@theme` bridge |
| `index.tsx` (landing) | All `gray-*` → semantic tokens, kept green gradients |
| `LoadingSpinner.tsx` | `gray-200/blue-600` → `green-200/green-600` |
| `ErrorBoundary.tsx` | `gray-*` → semantic tokens, button → `bg-primary` |
| `error-page.tsx` | `gray-*` → `green-*`, `blue-600` → `green-600` |
| `not-found-page.tsx` | `gray-*` → semantic + `green-*` |
| `FormField.tsx` | `blue-500` → `green-500`, `gray-*` → semantic |
| `Modal.tsx` | `bg-white` → `bg-card`, `gray-*` → semantic |
| `ErrorMessage.tsx` | `red-*` → `destructive` semantic tokens |
| `Toast.tsx` | Info `blue-*` → `green-*`, close button → semantic |
| `lazy-loading.tsx` | `gray-*` → `bg-secondary`/`bg-muted` |
| `invoices.tsx` | `text-gray-600` → `text-muted-foreground` |
| `clients.tsx` | `text-gray-600` → `text-muted-foreground` |
| `revenue-mix-chart.tsx` | Tick `#6b7280` → `#4b5e54`, tooltip border updated |
| `cash-flow-chart.tsx` | Same tick/tooltip updates |
| `spending-mix-chart.tsx` | Tooltip border → `#d1d9d5` |

### Verification
- **Zero** remaining `bg-blue-*`, `text-blue-*`, `text-gray-*`, or `bg-gray-*` classes in web app
- Codebase-wide grep confirms clean

---

## 3. Visual Test Results

All pages verified in browser (Playwright):

| Page | URL | Status | Notes |
|------|-----|--------|-------|
| Landing (hero) | `/` | PASS | Green gradient bg, green CTA button, dark green text |
| Landing (features) | `/` (scroll) | PASS | White cards, green icons, green-tinted secondary bg |
| Landing (pricing) | `/` (scroll) | PASS | Green buttons, green "Most Popular" badge |
| Landing (CTA) | `/` (scroll) | PASS | Deep green bg, white text |
| Login | `/login` | PASS | Green "Login" button, green-tinted input borders |
| Signup | `/signup` | PASS | Green "Create account" button, Google/GitHub SVG icons |
| Dashboard | `/app/dashboard` | PASS | Redirects from `/app`, placeholder renders |
| Invoices | `/app/invoices` | PASS | Empty list, `text-muted-foreground` subtitle |
| Clients | `/app/clients` | PASS | Empty list, `text-muted-foreground` subtitle |

---

## 4. Functional Test Results

| Flow | Status | Notes |
|------|--------|-------|
| Signup → auto org creation → dashboard | PASS | Tested with `signup-test@invoicing.app` |
| Login → org fetch/persist → dashboard | PASS | Tested with `test@invoicing.app` |
| Auth guard → redirect to `/login` | PASS | Unauthenticated users redirected |
| Demo mode bypass | PASS | `x-demo-mode: true` skips auth |
| `/app` → `/app/dashboard` redirect | PASS | Index route redirect works |
| Invoices API call | PASS | Returns empty list (200 OK) |
| Clients API call | PASS | Returns empty list (200 OK) |
| Redis fail-open | PASS | Upstash ENOTFOUND logged, requests succeed |
| Rate limiter fail-open | PASS | Same — fails open gracefully |

---

## 5. Test Users in Database

| Email | Password | Org Name | Org Slug |
|-------|----------|----------|----------|
| test@invoicing.app | testpassword123 | My Company | my-company |
| browser@invoicing.app | testpassword123 | Browser Company | browser-company |
| signup-test@invoicing.app | testpassword123 | Test Signup's Company | test-signup-company |

---

## 6. Known Pre-existing Issues (Not Addressed)

- Missing `@scalar/hono-api-reference` package (dynamic import with fallback, non-blocking)
- `packages/storage/src/db/client.ts` has `.js` extension on schema import (works in Bun)
- `apps/api/src/lib/permissions.ts` imports non-existent error classes
- `apps/api/src/routers/health.ts` type errors for env vars
- `lazy-loading.tsx` LSP error: `ComponentType` needs type-only import
- `accessibility.ts` LSP error: type mismatch
- Upstash rate limiter ENOTFOUND noise in API logs (placeholder credentials, fails open)
- Unit tests: 4/4 passing (`bun run test`)

---

## 7. Architecture Summary

- **Production**: Web + API co-located in single Cloudflare Worker
- **Local dev**: Separate processes — Vite on 3004, Hono on 3013, proxy forwards `/api/*`
- **Database**: Dual-driver — `node-postgres` locally, `neon-serverless` in production
- **Auth**: Better Auth with `organizationClient()` plugin, secure cookies disabled for localhost
- **Theme**: CSS custom properties → Tailwind v4 `@theme inline` bridge → semantic token classes
