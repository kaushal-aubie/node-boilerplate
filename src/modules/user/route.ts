import type { OpenAPIHono } from '@hono/zod-openapi';
import type { ApiEnv } from '@/types/api-env';
import * as login from './routes/login.route';
import * as logout from './routes/logout.route';
import * as register from './routes/register.route';

export function registerUserRoutes(app: OpenAPIHono<ApiEnv>) {
  app
    .openapi(register.route, register.handler)
    .openapi(logout.route, logout.handler)
    .openapi(login.route, login.handler);
}
