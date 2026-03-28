import { createRoute, z } from '@hono/zod-openapi';
import { sql } from 'drizzle-orm';
import HttpStatusCodes from 'stoker/http-status-codes';
import HttpStatusPhrases from 'stoker/http-status-phrases';
import { jsonContent } from 'stoker/openapi/helpers';
import { db } from '@/db/client';
import { users } from '@/db/schema';
import type { APIHandler } from '@/types/api-env';

const healthResponseSchema = z
  .object({
    status: z.literal(HttpStatusPhrases.OK),
    database: z.enum([HttpStatusPhrases.OK, HttpStatusPhrases.INTERNAL_SERVER_ERROR]),
  })
  .openapi('HealthResponse');

export const route = createRoute({
  method: 'get',
  path: '/health',
  tags: ['Health'],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(healthResponseSchema, 'Service health'),
  },
});

export const handler: APIHandler<typeof route> = async (c) => {
  let databaseStatus: z.infer<typeof healthResponseSchema>['database'] = HttpStatusPhrases.OK;

  try {
    await db.select({ one: sql`1` }).from(users).limit(1);
  } catch {
    databaseStatus = HttpStatusPhrases.INTERNAL_SERVER_ERROR;
  }

  return c.json(
    {
      status: HttpStatusPhrases.OK,
      database: databaseStatus,
    },
    HttpStatusCodes.OK,
  );
};
