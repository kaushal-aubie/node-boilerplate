import { createRoute } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { messageResponseSchema } from '@/lib/app/stoker';
import { requireAuth } from '@/middleware/auth-check';
import type { APIHandler } from '@/types/api-env';
import { toPublicUser, userPublicSchema } from '../user.dto';

export const route = createRoute({
  method: 'get',
  path: '/auth/me',
  tags: ['Auth'],
  summary: 'Current user',
  description: 'Returns the authenticated user (no password). Requires a valid session or token.',
  middleware: [requireAuth],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(userPublicSchema, 'Current user'),
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
