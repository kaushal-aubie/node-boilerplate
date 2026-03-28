import { eq } from 'drizzle-orm';
import { createMiddleware } from 'hono/factory';
import type { User } from '@/db/schema';
import { users } from '@/db/schema';
import { getTokenFromRequest } from '@/lib/auth/cookie-auth';
import { verifyAccessToken } from '@/lib/auth/jwt';
import type { ApiEnv } from '@/types/api-env';

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
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    c.set('user', user);
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
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  };
}
