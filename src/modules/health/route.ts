import type { OpenAPIHono } from '@hono/zod-openapi';
import type { ApiEnv } from '@/types/api-env';
import { registerHealthGetRoute } from './routes/get.route';

export function registerHealthRoutes(app: OpenAPIHono<ApiEnv>) {
  registerHealthGetRoute(app);
}
