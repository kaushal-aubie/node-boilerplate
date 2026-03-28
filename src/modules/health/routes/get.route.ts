import { createRoute, z } from '@hono/zod-openapi';
import { sql } from 'drizzle-orm';
import HttpStatusCodes from 'stoker/http-status-codes';
import HttpStatusPhrases from 'stoker/http-status-phrases';
import { jsonContent } from 'stoker/openapi/helpers';
import { users } from '@/db/schema';
import type { APIHandler } from '@/types/api-env';

const statusEnum = z.enum([HttpStatusPhrases.OK, HttpStatusPhrases.INTERNAL_SERVER_ERROR]);

const healthResponseSchema = z
  .object({
    status: z.literal(HttpStatusPhrases.OK),
    database: statusEnum,
    redis: statusEnum,
    cache: statusEnum,
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
  const db = c.get('db');
  const redis = c.get('redis');
  const cache = c.get('cache');

  let databaseStatus: z.infer<typeof healthResponseSchema>['database'] = HttpStatusPhrases.OK;
  let redisStatus: z.infer<typeof healthResponseSchema>['redis'] = HttpStatusPhrases.OK;
  let cacheStatus: z.infer<typeof healthResponseSchema>['cache'] = HttpStatusPhrases.OK;

  try {
    await db.select({ one: sql`1` }).from(users).limit(1);
  } catch {
    databaseStatus = HttpStatusPhrases.INTERNAL_SERVER_ERROR;
  }

  try {
    await redis.ping();
  } catch {
    redisStatus = HttpStatusPhrases.INTERNAL_SERVER_ERROR;
  }

  try {
    await cache.has({ key: '__health:probe' });
  } catch {
    cacheStatus = HttpStatusPhrases.INTERNAL_SERVER_ERROR;
  }

  return c.json(
    {
      status: HttpStatusPhrases.OK,
      database: databaseStatus,
      redis: redisStatus,
      cache: cacheStatus,
    },
    HttpStatusCodes.OK,
  );
};
