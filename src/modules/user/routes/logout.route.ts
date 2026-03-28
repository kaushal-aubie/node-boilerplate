import { createRoute, type OpenAPIHono, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { messageResponseSchema } from '@/lib/constants';
import { clearAuthCookie } from '@/lib/cookie-auth';
import { parseResponse } from '@/lib/json-response';
import { requireAuth } from '@/middleware/auth.middleware';
import type { ApiEnv } from '@/types/api-env';

export const logoutResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi('LogoutResponse');

const route = createRoute({
  method: 'post',
  path: '/auth/logout',
  tags: ['Auth'],
  middleware: [requireAuth] as const,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(logoutResponseSchema, 'Logged out'),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(messageResponseSchema, 'Unauthorized'),
  },
});

export function registerAuthLogoutRoute(app: OpenAPIHono<ApiEnv>) {
  app.openapi(route, async (c) => {
    await clearAuthCookie(c);
    return c.json(
      parseResponse(logoutResponseSchema, { message: 'User has logged out successfully' }),
      200,
    );
  });
}
