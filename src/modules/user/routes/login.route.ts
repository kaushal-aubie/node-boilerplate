import { createRoute, z } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';
import { db } from '@/db/client';
import { type LoginBody, loginBodySchema, selectUserPublicSchema, users } from '@/db/schema';
import { comparePassword } from '@/lib/bcrypt';
import { setAuthCookie } from '@/lib/cookie-auth';
import { createAccessToken } from '@/lib/jwt';
import { messageResponseSchema } from '@/lib/stoker';
import type { APIHandler } from '@/types/api-env';

const loginResponseSchema = z
  .object({
    user: selectUserPublicSchema,
    token: z.string(),
  })
  .openapi('LoginResponse');

export const route = createRoute({
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  request: {
    body: jsonContentRequired(loginBodySchema, 'Credentials'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(loginResponseSchema, 'Logged in'),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(messageResponseSchema, 'Bad request'),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(messageResponseSchema, 'Invalid credentials'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(loginBodySchema),
      'Validation error(s)',
    ),
  },
});

export const handler: APIHandler<typeof route> = async (c) => {
  const body = c.req.valid('json') as LoginBody;

  const [user] = await db.select().from(users).where(eq(users.email, body.email)).limit(1);
  if (!user?.password) {
    return c.json({ message: 'Invalid credentials' }, 400);
  }

  const match = await comparePassword(body.password, user.password);
  if (!match) {
    return c.json({ message: "Credentials don't match" }, 401);
  }

  const token = createAccessToken(user.id);
  await setAuthCookie(c, token);
  return c.json({ user, token }, HttpStatusCodes.OK);
};
