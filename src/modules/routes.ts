import type { OpenAPIHono } from '@hono/zod-openapi';
import type { ApiEnv } from '@/types/api-env';
import { registerBlogRoutes } from './blogs';
import { registerHealthRoutes } from './health';
import { registerUserRoutes } from './user';

export function registerRoutes(app: OpenAPIHono<ApiEnv>) {
  registerBlogRoutes(app);
  registerHealthRoutes(app);
  registerUserRoutes(app);
}
