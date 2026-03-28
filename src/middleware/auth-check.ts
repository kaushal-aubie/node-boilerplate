import { createMiddleware } from 'hono/factory';
import { getTokenFromRequest } from '@/lib/auth/cookie-auth';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { coerceCreatedUpdated } from '@/lib/date';
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
    const user = await c.get('repo').users.findByIdCached(id);

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
