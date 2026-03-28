import type { Context, Next } from 'hono';
import { createAppRepo } from '@/modules/repo';
import type { AppDependencies } from '@/types/app-dependencies';

export function setContext(deps: AppDependencies) {
  return async (c: Context, next: Next) => {
    const db = deps.database.db;
    const cache = deps.cache.bento.use();
    c.set('db', db);
    c.set('redis', deps.redis.client);
    c.set('cache', cache);
    c.set('repo', createAppRepo(db, cache, deps.redis.client));
    await next();
  };
}
