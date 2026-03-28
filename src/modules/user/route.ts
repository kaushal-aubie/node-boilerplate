import type { OpenAPIHono } from '@hono/zod-openapi';
import type { ApiEnv } from '@/types/api-env';
import { registerAuthLoginRoute } from './routes/login.route';
import { registerAuthLogoutRoute } from './routes/logout.route';
import { registerAuthRegisterRoute } from './routes/register.route';

export function registerUserRoutes(app: OpenAPIHono<ApiEnv>) {
  registerAuthRegisterRoute(app);
  registerAuthLoginRoute(app);
  registerAuthLogoutRoute(app);
}
