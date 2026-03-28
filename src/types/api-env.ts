import type { RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { CacheProvider } from 'bentocache/types';
import type Redis from 'ioredis';
import type { User } from '@/db/schema';
import type { AppDatabase } from '@/lib/infra/database-client';

export type ApiEnv = {
  Variables: {
    user?: User;
    db: AppDatabase;
    redis: Redis;
    cache: CacheProvider;
  };
};

export type APIHandler<R extends RouteConfig> = RouteHandler<R, ApiEnv>;
