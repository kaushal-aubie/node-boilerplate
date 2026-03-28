import type { DatabaseClient } from '@/db/database-client';
import type { RedisClient } from '@/redis/redis-client';

export type AppDependencies = {
  database: DatabaseClient;
  redis: RedisClient;
};
