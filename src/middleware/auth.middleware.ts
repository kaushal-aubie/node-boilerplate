import { eq } from 'drizzle-orm';
import { createMiddleware } from 'hono/factory';
import type { User } from '@/db/schema';
import { users } from '@/db/schema';
import { getTokenFromRequest } from '@/lib/auth/cookie-auth';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { cacheGetOrSet } from '@/lib/cache/cache';
import { CACHE_NAMESPACE } from '@/lib/cache/namespaces';
import { coerceCreatedUpdated, toUtcIsoString } from '@/lib/date';
import type { ApiEnv } from '@/types/api-env';

const USER_CACHE_TTL = '5m' as const;

export const requireAuth = createMiddleware<ApiEnv>(async (c, next) => {
  const token = await getTokenFromRequest(c);
  if (!token) {
    return c.json({ message: 'Unauthorized' }, 401);
  }
  try {
    const { user_id } = await verifyAccessToken(token);
    const id = Number(user_id);
    if (Number.isNaN(id)) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    const db = c.get('db');
    const cache = c.get('cache').namespace(CACHE_NAMESPACE.users);
    const key = String(id);

    const user = await cacheGetOrSet<User | undefined>(cache, {
      key,
      ttl: USER_CACHE_TTL,
      factory: async (ctx) => {
        const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
        if (!row) {
          ctx.skip();
          return undefined;
        }
        return row;
      },
    });

    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    c.set('user', coerceCreatedUpdated(user));
    await next();
    return;
  } catch {
    return c.json({ message: 'Unauthorized' }, 401);
  }
});

export function toPublicUser(u: User) {
  return {
    id: u.id,
    firstName: u.firstName ?? null,
    lastName: u.lastName ?? null,
    email: u.email,
    mobile: u.mobile ?? null,
    createdAt: toUtcIsoString(u.createdAt),
    updatedAt: toUtcIsoString(u.updatedAt),
  };
}
