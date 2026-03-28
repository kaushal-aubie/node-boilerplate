import { createRoute } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { messageResponseSchema } from '@/lib/app/stoker';
import { clearAuthCookie } from '@/lib/auth/cookie-auth';
import { requireAuth } from '@/middleware/auth-check';
import type { APIHandler } from '@/types/api-env';

export const route = createRoute({
  method: 'post',
  path: '/auth/logout',
  tags: ['Auth'],
  middleware: [requireAuth] as const,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(messageResponseSchema, 'Logged out'),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(messageResponseSchema, 'Unauthorized'),
  },
});

export const handler: APIHandler<typeof route> = async (c) => {
  await clearAuthCookie(c);
  return c.json({ message: 'User has logged out successfully' }, HttpStatusCodes.OK);
};
