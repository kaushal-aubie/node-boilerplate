import { createRoute, type OpenAPIHono } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { selectUserPublicSchema } from '@/db/schema';
import { messageResponseSchema } from '@/lib/constants';
import { parseResponse } from '@/lib/json-response';
import { requireAuth, toPublicUser } from '@/middleware/auth.middleware';
import type { ApiEnv } from '@/types/api-env';

const route = createRoute({
  method: 'get',
  path: '/users/me',
  tags: ['Users'],
  middleware: [requireAuth] as const,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectUserPublicSchema, 'Current user'),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(messageResponseSchema, 'Unauthorized'),
  },
});

export function registerUsersMeRoute(app: OpenAPIHono<ApiEnv>) {
  app.openapi(route, async (c) => {
    const user = c.get('user');
    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    return c.json(
      parseResponse(selectUserPublicSchema, {
        message: 'Signed in user',
        data: toPublicUser(user),
      }),
      200,
    );
  });
}
