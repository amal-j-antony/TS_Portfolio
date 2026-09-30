# AGENTS.md

Guidance for AI coding agents working in this repository. Stack: **React (frontend) · Express (API) · PostgreSQL (database)**.

The goal is code a teammate can read, change, and trust six months from now. When in doubt, choose the simpler, more explicit, more conventional option.

> Adjust the commands and paths below to match the repo. If something here conflicts with the actual code, follow the code and flag the discrepancy.

---

## 1. Working Agreement

1. **Read before writing.** Look at neighboring files and follow existing patterns before introducing new ones.
2. **Keep changes small and focused.** One concern per change. No drive-by refactors, reformatting, or dependency bumps mixed into a feature.
3. **Don't invent.** Never guess at APIs, column names, env vars, or library behavior. Check the code, schema, or docs.
4. **Ask when ambiguous.** If requirements are unclear or a change is destructive (data loss, breaking API, auth), stop and ask rather than assume.
5. **Leave it better, not bigger.** Fix small issues in code you touch, but don't rewrite what you weren't asked to.
6. **Prove it works.** Run the checks in section 10 before declaring a task done, and say what you ran.

---

## 2. Project Layout

```
/
├── client/                 # React app
│   └── src/
│       ├── features/       # Feature folders (components, hooks, api, tests together)
│       ├── components/     # Shared, presentational UI only
│       ├── hooks/          # Shared hooks
│       ├── lib/            # API client, utils, constants
│       └── routes/         # Route tree, layouts (Bare/Print/AppShell), guards (RequireAuth/RequireRole)
├── server/                 # Express API
│   └── src/
│       ├── routes/         # HTTP layer: routing + request/response only
│       ├── controllers/    # Translate HTTP <-> service calls
│       ├── services/       # Business logic (framework-agnostic)
│       ├── repositories/   # All SQL lives here
│       ├── middleware/     # Auth, validation, error handling, logging
│       ├── db/             # Connection pool, migrations, seeds
│       ├── config/         # Env parsing and validation
│       └── types/          # Shared types / schemas
└── AGENTS.md
```

Client routing structure is defined in section 5.

**Dependency direction (server):** `routes → controllers → services → repositories → db`. Never import upward or skip layers (e.g. no SQL in controllers, no `req`/`res` in services).

---

## 3. General Code Principles

- **Clarity over cleverness.** Write code that reads top to bottom. Avoid dense one-liners and unexplained tricks.
- **Small units.** Functions do one thing. If a function needs "and" in its description, split it. Aim for < ~40 lines per function and < ~300 lines per file as a smell threshold, not a hard rule.
- **Names carry meaning.** Use descriptive names (`getActiveSubscriptionsForUser`, not `getData`). Booleans read as questions (`isLoading`, `hasAccess`).
- **No dead code.** Delete unused code, commented-out blocks, and stale TODOs. Git remembers.
- **No magic values.** Extract repeated or meaningful literals into named constants.
- **DRY with judgment.** Duplicate twice; abstract on the third occurrence, and only if the abstraction is obvious. Prefer duplication over the wrong abstraction.
- **Comments explain *why*, not *what*.** If a comment restates the code, rename or restructure instead.
- **Handle errors deliberately.** No empty `catch` blocks, no swallowed promises.
- **Prefer TypeScript** (if the repo uses it) with `strict` on. Avoid `any`; use `unknown` and narrow. Don't silence the compiler with `@ts-ignore` without a written reason.
- **Immutability by default.** Use `const`, avoid mutating arguments and shared state.
- **Formatting is automated.** Run the formatter and linter; don't hand-format or argue about style.

---

## 4. Frontend (React)

### Structure and components
- Use **function components and hooks** only.
- Organize by **feature**, colocating component, hook, API calls, styles, and tests.
- Keep components **small and focused**. Split when a component handles fetching, state, and heavy rendering at once.
- Separate **presentational** components (props in, JSX out) from **container/logic** (hooks, data fetching).
- Extract reusable logic into **custom hooks** (`useDebouncedValue`, `useCurrentUser`), not into utility classes.
- One exported component per file; filename matches the component (`UserCard.tsx`).

### State and data
- Keep state **as local as possible**. Lift only when needed. Reach for context or a global store only for genuinely shared state.
- Use a **server-state library** (e.g. TanStack Query) for API data instead of hand-rolled `useEffect` + `useState` fetching, if the project has one. Follow what's already in use.
- **Derive, don't duplicate.** Compute values from existing state instead of syncing copies in `useEffect`.
- Avoid `useEffect` for things that belong in event handlers or derivations.
- Include **loading, error, and empty states** for every data-driven view.

### Quality
- Give lists stable `key`s (IDs, never array index for dynamic lists).
- Don't prematurely optimize. Use `useMemo`/`useCallback`/`React.memo` only with a measured reason.
- Use **semantic HTML** and basic accessibility: labels on inputs, alt text, keyboard-operable controls, sufficient contrast, correct button vs. link usage.
- Never put secrets in client code. Anything in the bundle is public.
- Centralize API calls in `lib/api` (or per-feature `api.ts`); components should not build URLs or parse raw responses inline.
- Validate user input on the client for UX, but **never rely on it for security**.

---


### Layouts
- **Pick the layout by purpose.** `BareLayout` is for unauthenticated pages (login). `PrintLayout` is for print views with no nav or chrome. `AppShell` is for everything else in the app.
- Never render `AppShell` chrome (nav, offline banner, save indicator) inside a print page, and never put an authenticated page under `BareLayout`.
- New layouts need a clear reason. Prefer reusing one of the three.
- The `AppShell` save-indicator slot is the only place for global save status. Pages report status into it rather than rendering their own global indicator.

### Auth and role guards
- **`RequireAuth`** wraps every authenticated route. Its loader fetches `/api/auth/me` and, if the user is unauthenticated, redirects to `/login?next=<original path>`. After login, redirect to `next` only if it is a same-origin relative path (prevent open redirects).
- **`RequireRole`** takes an explicit `roles` list (`ADMIN`, `STAFF`). Apply it in **route config**, not inside page components. Do not scatter `if (user.role === ...)` checks across pages for route-level access.
- An authenticated user who lacks the role goes to `/403`, not `/login` and not a blank page.
- `/admin` is guarded once at the parent with `roles=[ADMIN]`. Children inherit it; do not re-guard them.
- Use `<RequireRole>` for whole routes. For hiding individual buttons or menu items, use a shared `useHasRole()` hook so the rule lives in one place.
- Unknown paths fall through to `*` (NotFound).
- The index route `/` redirects **by role**; keep that mapping in one function and update it when roles change.

### Client guards are UX only
- Route guards only improve the experience. They are **not security**. Every API endpoint behind a guarded route must enforce the same authentication and role check on the server (see sections 6 and 8).
- When adding a role-restricted route, add or verify the matching server-side check in the same change, with a test that a forbidden role receives `403`.
- Never trust role or user ID data from the client. The server derives identity from the session.

### Route conventions
- **Admin resources** (`items`, `customers`, `users`) use one list page plus child routes for `new` and `:id` that render as **drawers over the list**. Follow this pattern for new admin resources. The list stays mounted and the drawer closes by navigating back to the parent path.
- Drawer state lives in the URL, not in component state, so it is linkable and survives refresh.
- Keep route definitions in one place (`client/src/routes/`). Pages are lazy-loaded where reasonable.
- Build links through shared path helpers or constants, not hand-written strings scattered through components.
- Route params (`:billId`, `:customerId`) are strings from the URL. Validate and parse them before use, and handle "not found" for bad IDs with a proper NotFound or error state.
- The root owns the error boundary, query client, and session loader. Do not create additional query clients or competing session fetches elsewhere.
- Changing the route tree requires updating this section and any affected tests.

### Route testing
- Test guards: unauthenticated users redirect to `/login?next=...`, wrong-role users reach `/403`, correct-role users see the page.
- Test that `next` is honored after login and that external URLs in `next` are ignored.

---

## 6. Backend (Express)

### Layering
- **Routes**: declare paths, attach middleware, call a controller. No logic.
- **Controllers**: parse/validate input, call a service, shape the HTTP response and status code.
- **Services**: business rules and orchestration. Pure and framework-agnostic so they're easy to test.
- **Repositories**: the *only* place that talks to Postgres.

### API design
- RESTful, **plural nouns**, consistent naming (`GET /users/:id`, `POST /orders`).
- Use correct status codes (`201` create, `204` no content, `400` validation, `401` unauthenticated, `403` forbidden, `404` missing, `409` conflict).
- Version the API when making breaking changes (`/api/v1/...`). **Don't break existing response shapes** without explicit approval.
- Use one **consistent error format**, e.g. `{ "error": { "code": "VALIDATION_FAILED", "message": "...", "details": [...] } }`.
- Paginate list endpoints. Never return unbounded result sets.

### Validation and errors
- **Validate all input** (body, params, query, headers) at the edge with a schema library (e.g. Zod, Joi). Reject early; pass typed, trusted data inward.
- Use **async handlers** with a wrapper (or Express 5 native support) so rejected promises reach the error middleware.
- Throw **typed/custom errors** in services (`NotFoundError`, `ConflictError`); map them to HTTP responses in **one central error-handling middleware**.
- Don't leak stack traces, SQL, or internals to clients. Log them server-side.

### Config and logging
- Read environment variables **once**, in `config/`, validate them at startup, and fail fast if invalid. Never read `process.env` scattered through the code.
- Use a **structured logger** (e.g. pino), not `console.log`. Include request IDs. **Never log secrets, tokens, passwords, or full PII.**
- Provide a health-check endpoint.

---

## 7. Database (PostgreSQL)

### Schema and migrations
- **All schema changes go through migration files**, committed to the repo. Never edit the database by hand or alter a migration that has already been applied; add a new one.
- Migrations should be **small, reversible where practical, and safe to run on a live DB** (e.g. add nullable column → backfill → add constraint, rather than one locking change).
- Use `snake_case` for tables and columns, **plural** table names, and `id` primary keys. Include `created_at` and `updated_at` (`timestamptz`).
- Enforce integrity **in the database**: `NOT NULL`, `UNIQUE`, `CHECK`, and **foreign keys** with deliberate `ON DELETE` behavior.
- Choose correct types: `timestamptz` (not `timestamp`), `numeric` for money (never float), `uuid` or `bigint` for IDs, `jsonb` only when the shape is truly flexible.
- **Index** foreign keys and columns used in frequent `WHERE`/`JOIN`/`ORDER BY`. Verify slow queries with `EXPLAIN ANALYZE` before and after adding indexes.

### Queries
- **Always use parameterized queries** (`$1, $2`). **Never** build SQL by string concatenation or template interpolation with user input.
- Select **explicit columns**, not `SELECT *`, in application code.
- Use a **connection pool** (single shared instance); never open a connection per request.
- Wrap multi-step writes in a **transaction**, and always release the client in a `finally`.
- Watch for **N+1 queries**; fetch related data with joins or batched queries.
- Keep SQL in repositories. Return plain domain objects, not raw driver rows leaking into services.
- Treat destructive operations (`DELETE`, `DROP`, `TRUNCATE`, bulk `UPDATE`) with extreme care; confirm scope and prefer soft deletes where the domain calls for it.

---

## 8. Security Baseline

- **Authentication & authorization**: check authorization on *every* protected route server-side, including resource ownership (prevent IDOR). Don't trust client-supplied user IDs or roles.
- **Passwords**: hash with bcrypt/argon2. Never store or log plaintext.
- **Secrets**: only in environment variables / secret manager. Never commit `.env` files or keys. Keep `.env.example` current.
- **Express hardening**: use `helmet`, configure CORS to an explicit allowlist, add rate limiting on auth and sensitive endpoints, and limit request body size.
- **Injection & XSS**: parameterized SQL only; rely on React's default escaping and avoid `dangerouslySetInnerHTML` (sanitize if unavoidable).
- **Cookies/tokens**: prefer `httpOnly`, `secure`, `sameSite` cookies; keep token lifetimes short.
- **Dependencies**: add new packages sparingly; prefer well-maintained ones. Justify each addition.

---

## 9. Testing

- **Every behavior change ships with tests.** Every bug fix starts with a failing test that reproduces it.
- Follow the test pyramid:
  - **Unit**: services, utilities, hooks; fast and isolated.
  - **Integration**: API routes against a real test Postgres (not mocks of the DB) for repositories and endpoints.
  - **Component**: React Testing Library; test what users see and do, not implementation details.
  - **E2E**: a few critical user journeys only.
- Tests must be **deterministic and independent**: no shared state, no reliance on order, no real network or wall-clock time (mock/freeze them).
- Use clear names: `it("returns 409 when the email is already registered")`.
- Use factories/fixtures for test data; clean up between tests (transaction rollback or truncate).
- Don't delete or weaken a failing test to make it pass. Fix the code or explain why the test is wrong.

---

## 10. Commands and Definition of Done

> Replace with the repo's real scripts.

```bash
# Install
npm install

# Run
npm run dev              # client + server
npm run dev:client
npm run dev:server

# Quality gates
npm run lint
npm run format:check
npm run typecheck
npm test                 # unit + integration
npm run test:e2e

# Database
npm run db:migrate
npm run db:migrate:create -- <name>
npm run db:seed
```

**A task is done when:**
- [ ] Code builds and type-checks with no new errors or warnings
- [ ] Lint and format checks pass
- [ ] New/changed behavior has tests, and the full suite passes
- [ ] Migrations (if any) are included and run cleanly on a fresh DB
- [ ] No leftover debug logs, commented-out code, or unused imports
- [ ] `.env.example`, README, and API docs updated if config or contracts changed
- [ ] Route tree in section 5 updated if routes changed, with matching server-side role checks and guard tests
- [ ] No unrelated changes in the diff

---

## 11. Git and Pull Requests

- Small, atomic commits with clear messages in the imperative mood (`Add pagination to orders endpoint`). Follow Conventional Commits if the repo uses them.
- Never commit secrets, build artifacts, or `node_modules`.
- PR description should state **what changed, why, how it was tested**, and call out risks (migrations, breaking changes, new dependencies).
- Don't force-push shared branches or rewrite history without being asked.

---

## 12. Things to Avoid

- Putting business logic in route handlers or React components
- Role checks inside page components for route-level access, or relying on client guards without a server check
- Adding routes under the wrong layout, or changing the route tree without updating section 5
- Raw SQL outside repositories; string-built SQL of any kind
- Global mutable state, singletons with hidden side effects
- Catch-and-ignore error handling; `console.log` as logging
- Adding a library for something a few lines of code can do
- Large "while I'm here" refactors bundled with feature work
- Editing generated files, lockfiles (by hand), or applied migrations
- Disabling lint rules, type checks, or tests to get green

---

## 13. When You're Unsure

Prefer, in order: **(1)** follow an existing pattern in the repo, **(2)** choose the simplest solution that works, **(3)** ask a clarifying question. If you must make an assumption, state it explicitly in your summary so a human can verify it.
