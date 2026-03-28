import { createRoute } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { selectUserPublicSchema } from '@/db/schema';
import { messageResponseSchema } from '@/lib/app/stoker';
import { requireAuth, toPublicUser } from '@/middleware/auth.middleware';
import type { APIHandler } from '@/types/api-env';

export const route = createRoute({
  method: 'get',
  path: '/auth/me',
  tags: ['Auth'],
  middleware: [requireAuth] as const,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectUserPublicSchema, 'Current user'),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(messageResponseSchema, 'Unauthorized'),
  },
});

export const handler: APIHandler<typeof route> = async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ message: 'Unauthorized' }, 401);
  }
  return c.json(toPublicUser(user), HttpStatusCodes.OK);
};
