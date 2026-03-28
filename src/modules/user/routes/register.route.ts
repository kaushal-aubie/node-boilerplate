import { createRoute } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';
import { type RegisterBody, registerBodySchema, selectUserPublicSchema, users } from '@/db/schema';
import { messageResponseSchema } from '@/lib/app/stoker';
import { hashPassword } from '@/lib/crypto/bcrypt';
import { toPublicUser } from '@/middleware/auth.middleware';
import type { APIHandler } from '@/types/api-env';

export const route = createRoute({
  method: 'post',
  path: '/auth/register',
  tags: ['Auth'],
  request: {
    body: jsonContentRequired(registerBodySchema, 'Registration payload'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectUserPublicSchema, 'Registered'),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(messageResponseSchema, 'Bad request'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(registerBodySchema),
      'Validation error(s)',
    ),
  },
});

export const handler: APIHandler<typeof route> = async (c) => {
  const body = c.req.valid('json') as RegisterBody;
  const db = c.get('db');

  const existing = await db.select().from(users).where(eq(users.email, body.email)).limit(1);
  if (existing[0]) {
    return c.json({ message: `User already exists for email ${body.email}` }, 400);
  }

  const passwordHash = await hashPassword(body.password);
  const [created] = await db
    .insert(users)
    .values({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: passwordHash,
      mobile: body.mobile,
    })
    .returning();

  if (!created) {
    return c.json({ message: 'Registration failed' }, 400);
  }

  return c.json(toPublicUser(created), HttpStatusCodes.OK);
};
