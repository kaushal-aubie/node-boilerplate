# node-boilerplate

Opinionated **Node.js** API starter: **Hono**, **Drizzle ORM** (PostgreSQL), **Redis** (cache / BullMQ), **Zod** + OpenAPI docs, **Biome**, **TypeScript**, **Husky** + **commitlint**.

## Requirements

- **Node.js 22+**
- **pnpm** (see `packageManager` in `package.json`)

## Quick start

```bash
corepack enable && corepack prepare pnpm@10.11.0 --activate
git clone https://github.com/kaushal-aubie/node-boilerplate.git <YOUR_PROJECT>
cd <YOUR_PROJECT>
make bootstrap
```

`bootstrap` installs dependencies (Husky), and creates `env/.env.development` from `.env.example` when missing. If pnpm asks to approve build scripts, allow **bcrypt** (and **esbuild** if listed).

Start the API:

```bash
make dev
```

- App: `http://localhost:8000` (see your env for host/port)
- Health check: `GET http://localhost:8000/ping` → `pong`
- API base: `/api` (routes use per-module versioning, e.g. `v1`)

Ensure **PostgreSQL** and **Redis** match `env/.env.development`.

## Scripts

| Command | Purpose |
|--------|---------|
| `make dev` | Dev server (`tsx watch`) |
| `make build` | Compile to `dist/` |
| `make start` | Run compiled app |
| `make check` / `make check-all` | Biome (+ types + build for `check-all`) |
| `make db:migrate` / `make db:generate` / `make db:studio` | Drizzle migrations & tooling |
| `make seed` | Seed DB (development) |
| `make commit` | Commitizen (conventional commits) |

**Drizzle:** `drizzle.config.ts` enables **`strict: true`** so `drizzle-kit` prompts on ambiguous diffs (e.g. column renames). Without it, Kit may generate **drop + add** instead of **rename**, which **drops data**. Do not disable `strict` in production workflows.

Docker helpers: see `Makefile` (`make help`).

## Project layout

| Path | Role |
|------|------|
| `src/server.ts` | HTTP server entry |
| `src/app.ts` | Hono app: CORS, logging, API mount, `/ping` |
| `src/modules/` | Feature modules (routes, repos, DTOs) |
| `src/db/` | Drizzle schema, migrate, seed |
| `src/lib/` | App helpers (OpenAPI, auth, cache, infra) |
| `src/middleware/` | Cross-cutting middleware |
| `docker/` | Dockerfile & Compose |

## Cursor

This repo includes **`.cursor/rules/`** (project conventions) and **`.cursor/skills/`** (workflows for routes, DB). Open them in Cursor to align the agent with this codebase.

## License

ISC
