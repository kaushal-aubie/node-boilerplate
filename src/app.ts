import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import notFound from 'stoker/middlewares/not-found';
import stokerOnError from 'stoker/middlewares/on-error';
import { ENV_MODE, ROUTE_PREFIX } from '@/config/constants';
import { envVars } from '@/config/env';
import { configureOpenAPI } from '@/lib/configure-open-api';
import { createApiRouter } from '@/lib/create-api-router';
import { logger } from '@/lib/logger';
import { registerBlogRoutes } from '@/modules/blogs/route';
import { registerHealthRoutes } from '@/modules/health/route';
import { registerUserRoutes } from '@/modules/user/route';
import type { AppDependencies } from '@/types/app-dependencies';

export function createApp(deps: AppDependencies) {
  const api = createApiRouter().basePath(ROUTE_PREFIX);

  api.use('*', async (c, next) => {
    c.set('db', deps.database.db);
    c.set('redis', deps.redis.client);
    await next();
  });

  registerHealthRoutes(api);
  registerUserRoutes(api);
  registerBlogRoutes(api);

  const root = new Hono();

  root.use(compress());
  root.use(
    '*',
    cors({
      origin: ['http://localhost:3000'],
      allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  if (envVars.NODE_ENV === ENV_MODE.PRODUCTION) {
    root.use(secureHeaders());
  }

  root.use(async (c, next) => {
    const start = Date.now();
    await next();
    logger.info({
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      ms: Date.now() - start,
    });
  });

  root.route('/', api);

  root.get('/', (c) => c.json({ message: 'Server working successfully' }));
  root.get('/ping', (c) => c.text('pong'));

  const exposeDocs =
    envVars.NODE_ENV !== ENV_MODE.PRODUCTION || process.env.ENABLE_API_DOCS === 'true';
  if (exposeDocs) {
    configureOpenAPI(api, root);
  }

  root.notFound(notFound);

  root.onError((err, c) => {
    logger.error({ err }, 'Unhandled error');
    return stokerOnError(err, c);
  });

  return root;
}
