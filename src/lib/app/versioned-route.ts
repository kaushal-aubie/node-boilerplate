import type { RouteConfig } from '@hono/zod-openapi';

/** Prefixes a route path with a version segment (e.g. `v1`, `v2`). Use from each module's `*.route.ts`. */
export function withApiVersion<T extends RouteConfig>(version: string, route: T): T {
  return { ...route, path: `/${version}${route.path}` } as T;
}
