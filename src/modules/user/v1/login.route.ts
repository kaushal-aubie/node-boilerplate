import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';
import { selectUserSchema } from '@/db/schema';
import { messageResponseSchema } from '@/lib/app/stoker';
import { setAuthCookie } from '@/lib/auth/cookie-auth';
import { createAccessToken } from '@/lib/auth/jwt';
import { comparePassword } from '@/lib/crypto/bcrypt';
import type { APIHandler } from '@/types/api-env';
import { toPublicUser, userPublicSchema } from '../user.dto';

const loginBodySchema = z
  .object({
    email: selectUserSchema.shape.email,
    password: z.string().min(1),
  })
  .openapi('LoginBody');

const loginResponseSchema = z
  .object({
    user: userPublicSchema,
    token: z.string(),
  })
  .openapi('LoginResponse');

export const route = createRoute({
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  summary: 'Log in',
  description: 'Authenticates with email and password, sets a session cookie, and returns a JWT.',
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
  const body = c.req.valid('json');
  const user = await c.get('repo').users.findByEmail(body.email);
  if (!user?.password) {
    return c.json({ message: 'Invalid credentials' }, 400);
  }

  const match = await comparePassword(body.password, user.password);
  if (!match) {
    return c.json({ message: "Credentials don't match" }, 401);
  }

  const token = createAccessToken(user.id);
  await setAuthCookie(c, token);
  return c.json({ user: toPublicUser(user), token }, HttpStatusCodes.OK);
};
