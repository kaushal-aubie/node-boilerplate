import type { CacheClient } from '@/lib/infra/cache-client';
import type { DatabaseClient } from '@/lib/infra/database-client';
import type { RedisClient } from '@/lib/infra/redis-client';

export type AppDependencies = {
  database: DatabaseClient;
  redis: RedisClient;
  cache: CacheClient;
};
