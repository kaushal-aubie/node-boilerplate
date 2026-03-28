import { createRoute, type OpenAPIHono, z } from '@hono/zod-openapi';
import { sql } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { db } from '@/db/client';
import { users } from '@/db/schema';
import { parseResponse } from '@/lib/json-response';
import type { ApiEnv } from '@/types/api-env';

const healthResponseSchema = z
  .object({
    status: z.literal('ok'),
    database: z.enum(['ok', 'error']),
  })
  .openapi('HealthResponse');

const route = createRoute({
  method: 'get',
  path: '/health',
  tags: ['Health'],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(healthResponseSchema, 'Service health'),
  },
});

export function registerHealthGetRoute(app: OpenAPIHono<ApiEnv>) {
  app.openapi(route, async (c) => {
    let database: 'ok' | 'error' = 'ok';
    try {
      await db.select({ one: sql`1` }).from(users).limit(1);
    } catch {
      database = 'error';
    }
    return c.json(parseResponse(healthResponseSchema, { status: 'ok' as const, database }), 200);
  });
}
