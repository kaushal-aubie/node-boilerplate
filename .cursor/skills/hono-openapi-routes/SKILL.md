---
name: hono-openapi-routes
description: Adds and wires Hono OpenAPI routes in this repo. Use when creating or changing API endpoints, versioned routes, blog/user/health modules, or OpenAPI docs for src/modules.
---

# Hono OpenAPI routes (this project)

## Conventions

- API is mounted at **`/api`** (`API_BASE_PATH` in `src/config/constants.ts`). Versions are per module via `withApiVersion` (e.g. `v1`), not a global `/api/v1` prefix only.
- Router type: `OpenAPIHono<ApiEnv>` from `createApiRouter()` (`src/lib/app/create-api-router.ts`). Routes use `createRoute` from `@hono/zod-openapi` and handlers typed as `APIHandler<typeof route>`.
- Each HTTP operation lives in **`src/modules/<feature>/v1/<action>.route.ts`** exporting `route` and `handler`. Aggregate in **`<feature>.route.ts`** with `registerXRoutes(app)` calling `app.openapi(withApiVersion(API_VERSION_V1, x.route), x.handler)`.
- Register the module in **`src/modules/routes.ts`**.
- Use **`stoker`** helpers: `jsonContent`, `jsonContentRequired`, `createErrorSchema`, HTTP status constants, `defaultHook` behavior via the shared OpenAPI setup.
- Auth: import **`requireAuth`** from `@/middleware/auth-check` in `middleware` when the route needs a logged-in user; read `c.get('user')` in the handler.

## Checklist for a new endpoint

1. Add or extend Zod/DTO schemas (e.g. `*.dto.ts` or drizzle-zod from `src/db/schema`).
2. Create `v1/<verb>-<resource>.route.ts` with `createRoute({...})` and `handler`.
3. Register in `<feature>.route.ts` with `withApiVersion(API_VERSION_V1, ...)`.
4. If new feature folder: export `registerXRoutes` and call it from `registerRoutes` in `src/modules/routes.ts`.
5. Run `pnpm check` and fix OpenAPI/schema issues.
