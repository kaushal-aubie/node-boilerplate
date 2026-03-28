import type { CacheProvider } from 'bentocache/types';
import type Redis from 'ioredis';
import type { AppDatabase } from '@/lib/infra/database-client';
import { type BlogsRepo, createBlogsRepo } from '@/modules/blogs';
import { createHealthRepo, type HealthRepo } from '@/modules/health';
import { createUsersRepo, type UsersRepo } from '@/modules/user';

export type AppRepo = {
  blogs: BlogsRepo;
  users: UsersRepo;
  health: HealthRepo;
};

export function createAppRepo(db: AppDatabase, cache: CacheProvider, redis: Redis): AppRepo {
  return {
    blogs: createBlogsRepo(db, cache),
    users: createUsersRepo(db, cache),
    health: createHealthRepo(db, redis, cache),
  };
}
