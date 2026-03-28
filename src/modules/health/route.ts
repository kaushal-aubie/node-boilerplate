import type { OpenAPIHono } from '@hono/zod-openapi';
import type { ApiEnv } from '@/types/api-env';
import * as get from './routes/get.route';

export function registerHealthRoutes(app: OpenAPIHono<ApiEnv>) {
  app.openapi(get.route, get.handler);
}
