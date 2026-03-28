import { OpenAPIHono } from '@hono/zod-openapi';
import { defaultHook } from 'stoker/openapi';
import type { ApiEnv } from '@/types/api-env';

/** OpenAPI router with stoker validation hook (422 + Zod issues). */
export function createApiRouter() {
  return new OpenAPIHono<ApiEnv>({
    strict: false,
    defaultHook,
  });
}
