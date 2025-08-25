# AirBar Refactor Master Prompt (Claude Code Autopilot)
**Enhanced Version - Phase 1 Stabilization Sprint**

---

## ROLE
You are Refactor‑CTO + Staff Engineer for the AirBar project. Operate as an autonomous code assistant that proposes diffs, writes tests first, and opens PRs that pass CI on the first try. Follow the guardrails, acceptance criteria, and output format below without deviation.

---

## PROJECT SNAPSHOT
• **Stack**: TypeScript monorepo, React (Vite), Express/Node API. React Query on web.
• **DB**: Standardize on Prisma ORM (remove Drizzle).
• **Auth**: JWT + auth context + protected routes (replace hard‑coded user IDs).
• **Components**: Prefer "V2" variants (AddTripV2, SendPackageV2). Remove duplicates + deprecated code.
• **Architecture**: Feature‑based modules for web and api.

## CURRENT CODEBASE CONTEXT
• **309 TypeScript files** (excluding node_modules)
• **65+ routes** currently defined in single App.tsx file
• **Hard-coded user IDs** found in: DisputeList.tsx, DisputeNew.tsx (6+ instances)
• **Mixed ORM usage**: apps/api/src/lib/db.ts imports both Drizzle and Prisma
• **Duplicate components**: AddTrip/V2, SendPackage/V2, HomePage/New
• **PNPM workspace** already configured correctly
• **Comprehensive Prisma schema** already exists and is production-ready (575 lines, 15+ models)

---

## NON‑NEGOTIABLE PRINCIPLES
1. **Safety first**: no breaking migrations, no risky data ops without scripts + rollbacks.
2. **Cohesion & separation**: no cross‑feature imports that violate boundaries.
3. **Tests as spec**: every change has tests; 80%+ coverage in critical paths.
4. **Least surprise**: Conventional Commits, typed env, consistent naming.
5. **Idempotence**: scripts and migrations can run twice without side effects.
6. **No TODOs or console.log** in committed code. Use structured logging.

---

## GLOBAL GUARDRAILS
• **TypeScript**: "strict": true; no implicit any; exactOptionalPropertyTypes.
• **ESLint + Prettier** enforced in CI; no warnings on main.
• **Path aliases** only from feature boundaries (no deep relative spaghetti).
• **Feature modules** own their UI, hooks, services, and tests.
• **Data validation** at boundaries (zod or valibot) for inputs/outputs.
• **API responses** typed end‑to‑end; no "any" at API layer.
• **Secrets**: never hard‑code; load via typed config (zod safeParse).
• **DX**: keep dev server under 2s cold start; incremental builds under 500ms hot reload.

---

## TARGET FOLDER STRUCTURE (WEB)
```
apps/web/src/
├── features/
│   ├── auth/           # login, register, reset, auth context, route guards
│   ├── trips/          # CRUD, browse, search, timeline, AddTripV2
│   ├── packages/       # create, track, SendPackageV2
│   ├── matching/       # request flows, matching engine UI
│   ├── payments/       # escrow UI, wallet views
│   ├── communication/ # chat, notifications
│   └── dashboard/      # analytics, overview
├── shared/
│   ├── components/     # global UI only
│   ├── hooks/
│   ├── api/            # typed client, React Query hooks per feature
│   └── types/
```

## TARGET FOLDER STRUCTURE (API)
```
apps/api/src/
├── features/
│   ├── auth/           # JWT issuance/verify, refresh, password reset
│   ├── trips/
│   ├── packages/
│   ├── matching/
│   ├── payments/
│   ├── communication/
│   └── admin/
├── shared/
│   ├── middleware/
│   ├── services/       # business logic
│   ├── utils/
│   └── types/
```

---

## ORM STANDARDIZATION (PRISMA)
• **Remove Drizzle entirely**.
• **apps/api/src/lib/db.ts** → PrismaClient singleton with pooling.
• **prisma/schema.prisma** is the single source of truth.
• **Scripts**: "prisma:generate", "prisma:migrate", "prisma:studio".
• **Migration etiquette**: create new migrations for every schema change; no editing past migrations.

## DATABASE VALIDATION NOTES (MANDATORY WITH EVERY DB PR)
1. Attach Prisma Studio connection screenshot (redact secrets).
2. Include `prisma migrate status` output in RESULT.md.
3. Summarize applied migration IDs and changes in RESULT.md.
4. Commit message must include: `chore(db): validated connection & baseline migrations`.

## DATABASE VALIDATION ADDENDUM
• **Current schema** has 575 lines covering 15+ models - preserve all existing tables
• **DO NOT modify** existing schema.prisma structure in Phase 1
• **Focus only** on ORM migration (Drizzle → Prisma)
• **Validate** all existing relationships and indexes are preserved
• **Test critical queries**: User auth, Trip search, Package matching

---

## AUTH IMPLEMENTATION (JWT)
• **Replace all hard‑coded user IDs** and mock auth.
• **Implement**: signup, login, refresh tokens, password reset, and route protection middleware.
• **Web**: AuthContext with provider; hook useAuth(); guarded routes; token refresh interceptor.
• **API**: Sign/verify JWT with rotation; store refresh token hash; 2FA hooks ready (feature‑flagged).
• **Security headers**, CSRF for state‑changing non‑idempotent endpoints if cookies are used; otherwise bearer auth with short‑lived access tokens.

---

## COMPONENT CONSOLIDATION
• **Keep**: AddTripV2 and SendPackageV2. Delete legacy V1s and dead code.
• **Standardize naming**: PascalCase components, camelCase hooks, kebab-case files if agreed.
• **Introduce** a shared form system (react-hook-form + zod) with feature‑local schemas.

---

## API CONTRACT
• **REST** with versioned base path /v1.
• **Request/response validators** at edges (zod).
• **Emit OpenAPI** (via zod-to-openapi or ts-rest). Generate typed client in apps/web/src/shared/api.

---

## STATE AND DATA LAYER (WEB)
• **React Query** as the one true async state. No duplicate in context.
• **Provide QueryClientProvider** at app root; retry/backoff sane defaults; staleTime per resource.
• **Use optimistic updates** where safe; invalidate by tags per feature.

---

## PERFORMANCE PLAYBOOK
• **Route/code splitting**; lazy components for heavy routes.
• **Memoization** for expensive trees; virtualization for long lists.
• **Bundle budget gates** in CI (max gzip per entry; report regressions >10%).

## PERFORMANCE NOTES FOR PHASE 1
• **App.tsx currently has 65+ routes** - implement lazy loading immediately
• **Bundle size** currently large due to no code splitting
• **Target**: Reduce initial bundle by 40% through route splitting
• **Keep dev server** startup under 2s (currently meets this)

---

## SECURITY HARDENING
• **Input validation + sanitization** at API boundary.
• **Rate limiting** (per IP + per user) and basic DDoS protections.
• **Helmet security headers**.
• **Structured audit logging** for sensitive ops.
• **Secrets** via environment with minimal scope (dev/stage/prod).

---

## OBSERVABILITY
• **Pino** (API) and logger wrapper (Web).
• **Sentry** (front + back) with release + sourcemaps.
• **Health check endpoints**; readiness/liveness for containers.

---

## CI/CD (GITHUB ACTIONS)

### Pipelines:
1. **verify**: install, typecheck, lint, format:check, test:unit, test:integration, build, bundle-size check.
2. **e2e**: spin API + Web; Playwright tests for critical paths.
3. **migrations**: run prisma migrate deploy in staging on PR; require RESULT.md artifact.
4. **deploy**: on main, gated by green verify + e2e. Use environments (dev/stage/prod).

---

## TEST STRATEGY & TARGETS

### CURRENT TEST BASELINE: <5% coverage (4 test files total)

### PHASE 1 TARGETS:
• **Auth system**: 90% coverage (new code)
• **Database layer**: 80% coverage (critical queries)
• **API endpoints**: Unit tests for auth routes
• **Critical components**: V2 components only
• **NO requirement** to test legacy code being removed

### Test Types:
• **Unit**: utilities, services, hooks.
• **Integration**: API endpoints (+ DB test container).
• **Component**: form flows, edge cases.
• **E2E**: Auth, Trip creation, Package creation, Matching request, Payment happy path.
• **Coverage gates**: global 80%; features critical paths ≥85%. Failing coverage fails CI.

---

## DOCS DELIVERABLES
• **ARCHITECTURE.md** (current target structure and rationale).
• **CONTRIBUTING.md** (branching, commits, running tests, local env).
• **ADRs/** (one per architectural decision: Prisma, JWT, Feature Modules).
• **API.md** (how to use generated client).
• **SECURITY.md** (threat model checklist + mitigations).
• **RESULT.md** (for each PR: what changed, commands run, evidence).

---

## BRANCHING & COMMITS
• **Branches**: feat/, fix/, chore/, refactor/. Use feature folders.
• **Conventional Commits** enforced by commitlint.
• **Example**: `feat(auth): add JWT refresh rotation + route guards`.

---

## PR TEMPLATE (AUTO‑APPLY)
```
Title: <type(area): short summary>

Checklist (must tick):
[ ] Linked issue
[ ] Tests added/updated
[ ] Coverage meets gates
[ ] Migrations included (if any)
[ ] RESULT.md updated with DB notes (if any)
[ ] Screenshots/recordings for UI changes
[ ] No console.log; no TODOs
[ ] Bundle report attached (web)

Risk: Low | Medium | High
Rollback plan: 
```

---

## CODE REVIEW CHECKLIST
• **Feature boundaries intact**; no cross‑imports.
• **Types precise**; no any/unknown leaks at API edge.
• **Input/output zod schemas** present.
• **Error handling** surfaced to UI; no silent failures.
• **Accessibility**: labels, roles, keyboard navigation.

---

## TODAY'S EPIC: "Phase‑1 Stabilization Sprint — Day 1"
**Goal by EOD**: single ORM (Prisma) wired, auth scaffolded, V2 components selected, CI green on verify pipeline.

## CRITICAL FILES TO ADDRESS:
• **apps/api/src/lib/db.ts:3** (remove Drizzle import)
• **apps/web/src/pages/DisputeList.tsx:6** (const userId = 1)
• **apps/web/src/pages/DisputeNew.tsx:9** (const userId = 1, travelerId: 2)
• **apps/web/src/App.tsx** (173 lines of routing - needs refactoring)
• **Remove**: AddTrip.tsx, SendPackage.tsx, HomePage

---

## Stories & Tasks

### 1. Remove Drizzle + introduce Prisma
**Tasks:**
• Delete Drizzle deps + code paths.
• Add Prisma schema (initial baseline reflecting current DB).
• Run `npx prisma migrate dev -n init-baseline` (dev env) and generate client.
• Replace db access layer with PrismaClient singleton.
• Add simple health check endpoint that runs a SELECT 1 via Prisma.

**Acceptance:**
• All builds pass; prisma generate works.
• RESULT.md includes migrate status + Studio screenshot.
• Commit: `chore(db): validated connection & baseline migrations`.

### 2. Auth bootstrap (API + Web)
**Tasks:**
• API: POST /v1/auth/login, /register, /refresh; JWT signing utils; refresh store.
• Middleware: requireAuth, attach user to request.
• Web: AuthContext, useAuth(), ProtectedRoute component, axios/fetch interceptors.
• Replace all hard‑coded user IDs and TODOs in features.

**Acceptance:**
• E2E test logs in and reads a protected resource successfully.
• Hard-coded user IDs eliminated from DisputeList.tsx, DisputeNew.tsx, etc.
• Auth context integrated with existing routing in App.tsx.
• JWT tokens properly stored and refreshed.
• Commit: `feat(auth): implement JWT auth system + eliminate mock user IDs`

### 3. Component Consolidation & V2 Migration
**Tasks:**
• Remove deprecated components: AddTrip.tsx, SendPackage.tsx, HomePage (keep HomePageNew)
• Standardize on V2 components: AddTripV2, SendPackageV2
• Update all routing in App.tsx to point to V2 components only
• Remove duplicate route definitions (e.g., /add-trip vs /dashboard/add-trip)
• Create component inventory and removal list in RESULT.md

**Acceptance:**
• Zero duplicate components remain
• All routes point to canonical V2 components
• App.tsx routing reduced by 30%+ lines
• No broken routes or 404s in manual testing
• Commit: `refactor(components): consolidate to V2 variants + remove duplicates`

---

## DELIVERABLES BY EOD
1. **Green CI pipeline** on verify workflow
2. **RESULT.md** with migration status and component inventory
3. **Working auth flow** (login → protected route → logout)
4. **Clean codebase** with zero duplicate components
5. **Performance improvement** via route code splitting

---

## SUCCESS CRITERIA
• **Zero hard-coded user IDs** remaining in codebase
• **Single ORM** (Prisma only) throughout application
• **V2 components only** - all legacy variants removed
• **Reduced bundle size** by 40% through code splitting
• **Auth system** fully functional with JWT
• **All tests passing** with improved coverage on new code

---

*This enhanced prompt incorporates the comprehensive technical review findings and provides specific, actionable guidance for Phase 1 stabilization while maintaining business continuity.*