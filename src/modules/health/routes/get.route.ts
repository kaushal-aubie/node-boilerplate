import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { jsonContent } from 'stoker/openapi/helpers';
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
  summary: 'Health check',
  description: 'Reports readiness of the app, database, Redis, and cache layers.',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(healthResponseSchema, 'Service health'),
  },
});

export const handler: APIHandler<typeof route> = async (c) => {
  const health = c.get('repo').health;

  let databaseStatus: z.infer<typeof healthResponseSchema>['database'] = HttpStatusPhrases.OK;
  let redisStatus: z.infer<typeof healthResponseSchema>['redis'] = HttpStatusPhrases.OK;
  let cacheStatus: z.infer<typeof healthResponseSchema>['cache'] = HttpStatusPhrases.OK;

  try {
    await health.probeDatabase();
  } catch {
    databaseStatus = HttpStatusPhrases.INTERNAL_SERVER_ERROR;
  }

  try {
    await health.probeRedis();
  } catch {
    redisStatus = HttpStatusPhrases.INTERNAL_SERVER_ERROR;
  }

  try {
    await health.probeCache();
  } catch (err) {
    console.error(err);
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
