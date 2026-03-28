import type { RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type Redis from 'ioredis';
import type { AppDatabase } from '@/db/database-client';
import type { User } from '@/db/schema';

export type ApiEnv = {
  Variables: {
    user?: User;
    db: AppDatabase;
    redis: Redis;
  };
};

export type APIHandler<R extends RouteConfig> = RouteHandler<R, ApiEnv>;
