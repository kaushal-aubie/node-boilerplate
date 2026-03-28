import { createRoute, type OpenAPIHono } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';
import { db } from '@/db/client';
import { type RegisterBody, registerBodySchema, selectUserPublicSchema, users } from '@/db/schema';
import { hashPassword } from '@/lib/bcrypt';
import { messageResponseSchema } from '@/lib/constants';
import { parseResponse } from '@/lib/json-response';
import { toPublicUser } from '@/middleware/auth.middleware';
import type { ApiEnv } from '@/types/api-env';

const route = createRoute({
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

export function registerAuthRegisterRoute(app: OpenAPIHono<ApiEnv>) {
  app.openapi(route, async (c) => {
    const body = c.req.valid('json') as RegisterBody;

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

    return c.json(
      parseResponse(selectUserPublicSchema, {
        message: 'User has registered successfully',
        data: toPublicUser(created),
      }),
      200,
    );
  });
}
