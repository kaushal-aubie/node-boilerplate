import type { RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { User } from '@/db/schema';

export type ApiEnv = {
  Variables: {
    user?: User;
  };
};

export type APIHandler<R extends RouteConfig> = RouteHandler<R, ApiEnv>;
