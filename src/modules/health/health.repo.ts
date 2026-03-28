import type { CacheProvider } from 'bentocache/types';
import { sql } from 'drizzle-orm';
import type Redis from 'ioredis';
import { users } from '@/db/schema';
import type { AppDatabase } from '@/lib/infra/database-client';

export function createHealthRepo(db: AppDatabase, redis: Redis, cache: CacheProvider) {
  return {
    async probeDatabase(): Promise<void> {
      await db.select({ one: sql`1` }).from(users).limit(1);
    },

    async probeRedis(): Promise<void> {
      await redis.ping();
    },

    async probeCache(): Promise<void> {
      await cache.has({ key: '__health:probe' });
    },
  };
}

export type HealthRepo = ReturnType<typeof createHealthRepo>;
