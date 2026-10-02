# AGENTS.md

Guidance for AI coding agents in this repo. Stack: **React + Vite (client)**, **Express 5 (API)**, **PostgreSQL via Drizzle + Neon (database)**, TypeScript throughout.

There are two independent packages — `client/` and `server/` — with no root `package.json`. Install and run commands inside each package.

## 1. Working Agreement

- Read neighboring code before writing; follow existing patterns.
- Keep changes small and focused — one concern per change.
- Don't invent APIs, columns, env vars, or library behavior; check the code.
- Ask before destructive or ambiguous changes.
- Run the checks in section 9 before declaring a task done, and state what you ran.

## 2. Project Layout

```
client/src/
├── routes/            # route-colocated: <name>/route.tsx + its components/data
├── components/        # shared UI only (components/ui = shadcn)
├── lib/               # api client, serverStatus, logger, utils
├── router.tsx         # createBrowserRouter route table
├── root.tsx           # RootLayout + error boundary
└── main.tsx           # QueryClientProvider + RouterProvider

server/src/
├── routes/            # HTTP paths + middleware, no logic
├── controllers/       # request/response shaping
├── services/          # business logic, framework-agnostic
├── repositories/      # the only place that touches the database
├── middleware/        # auth, validation, errors, notFound
├── config/            # env parsing + validation
├── db/                # pool, schemas, seed
├── lib/               # errors, constants
├── types/             # ambient/global types
└── utils/             # logger
```

**Dependency direction (server):** `routes → controllers → services → repositories → db`. Never import upward or skip layers.

## 3. Code Principles

- Clarity over cleverness; small, single-purpose functions.
- Descriptive names; booleans read as questions.
- No dead code, no magic values, no swallowed errors.
- TypeScript `strict`; avoid `any` (use `unknown` and narrow).
- Comments explain *why*, not *what*.
- Immutability by default; no global mutable state.

## 4. Client (React)

- **Route-colocated:** every route lives in `src/routes/<name>/` with `route.tsx` plus its private components and data. Only shared UI goes in `src/components`.
- **Data router:** `createBrowserRouter` in `src/router.tsx`; `src/root.tsx` owns the layout and error boundary; `src/main.tsx` owns the `QueryClientProvider`. Import router APIs from `react-router`, not `react-router-dom`.
- Lazy-load routes via the router `lazy` option.
- Server state via TanStack Query; shared client state via Zustand. No ad-hoc `useEffect` fetching.
- All HTTP goes through `src/lib/api.ts` with `credentials: "include"`. Components never build URLs or parse raw responses.
- Build links through shared path constants/helpers, not scattered strings.
- Every data view handles loading, error, and empty states.
- Semantic HTML, labeled inputs, alt text, keyboard-operable controls, stable list keys.
- Never put secrets in client code — the bundle is public.

## 5. Routing

- Canonical paths: `/` (home), `/blog`, `/book-list`, `/link-archive`, `/login`, `/projects`, and `*` (NotFound). Folder name matches the URL segment.
- Adding a route: create `routes/<name>/route.tsx` and register it in `router.tsx`; keep it lazy.
- **Protected routes:** use a route `loader` that checks the session (`GET /api/v1/auth/me`) and `redirect`s to `/login?next=<path>`. Honor `next` only when it is a same-origin relative path.
- Client guards are UX only — the server enforces authorization on every protected endpoint.

## 6. Server (Express 5)

- **Routes** declare paths + middleware and call a controller. **Controllers** validate input, call a service, and shape the response/status. **Services** hold business rules with no `req`/`res`. **Repositories** are the only place that talks to the database and return domain objects.
- Prefix endpoints with `/api/v1`; use plural nouns and correct status codes.
- One error shape: `{ error: { code, message, details? } }`. Throw typed errors from `lib/errors.ts` and map them in the central `errorHandler`.
- Validate all input (body/params/query) at the edge with Zod via `middleware/validate.ts`.
- Express 5 forwards rejected async handlers — do not add async wrappers.
- Read env only through `config/env.ts` (validated once, fail fast). Never read `process.env` elsewhere.
- Log through `utils/logger.ts` (pino); include request IDs; never log secrets, tokens, or PII.
- Auth: bcrypt-hashed passwords; sessions are httpOnly JWT cookies; `requireAuth` guards protected routes. Endpoints: `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`; health at `GET /api/v1/health`.

## 7. Database

- Drizzle ORM over Neon serverless. Schemas live in `server/src/db/*.ts`.
- Runtime uses `DATABASE_URL_POOLED`; drizzle-kit uses the direct `DATABASE_URL`.
- All schema changes go through `drizzle/` migrations (`db:generate`, `db:migrate`). Never edit an applied migration; add a new one.
- Use `db.transaction()` for any operation with two or more dependent writes; repositories accept `DbClient` (`Db | Tx`).
- Parameterized queries only; select explicit columns, never `SELECT *`.
- `snake_case` plural tables, `id` primary keys, `timestamptz` for time, `numeric` for money.

## 8. Security

- Enforce authentication and authorization on every protected endpoint, including ownership. Never trust client-supplied user or role data.
- helmet, an explicit CORS allowlist with credentials, rate limiting on sensitive endpoints, and a request body-size limit.
- Secrets only in env / a secret manager. Keep `.env.example` current; never commit `.env`.
- Prefer httpOnly, secure, sameSite cookies with short token lifetimes.
- Add dependencies sparingly and justify each one.

## 9. Commands & Definition of Done

```bash
# client
cd client && npm install && npm run dev
npm run build     # tsc -b && vite build
npm run lint

# server
cd server && npm install && npm run dev
npm run type-check
npm run build && npm run start
npm run db:generate
npm run db:migrate
npm run db:seed
```

A task is done when: build and type-check pass with no new errors; lint passes; migrations are included and apply cleanly on a fresh DB; `.env.example` is updated when config or contracts change; there are no debug logs, commented-out code, or unused imports; the route tree and matching server-side checks are updated together; and the diff has no unrelated changes.

## 10. Git & PRs

- Small, atomic commits with imperative messages.
- Never commit secrets, build artifacts, or `node_modules`.
- PRs state what changed, why, and how it was tested, and call out risks.

## 11. Things to Avoid

- Business logic in route handlers or React components; SQL outside repositories; string-built SQL.
- `any`, `@ts-ignore` without a written reason, or disabling lint/type checks.
- Scattered `process.env` reads; `console.log` as logging.
- Adding a library for something a few lines of code can do; large drive-by refactors.

## 12. When You're Unsure

Follow an existing pattern; choose the simplest solution that works; ask a clarifying question.
