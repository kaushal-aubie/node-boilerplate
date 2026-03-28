import { createRoute, z } from '@hono/zod-openapi';
import { createInsertSchema } from 'drizzle-zod';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';
import { users } from '@/db/schema';
import { messageResponseSchema } from '@/lib/app/stoker';
import { hashPassword } from '@/lib/crypto/bcrypt';
import { toPublicUser } from '@/middleware/auth-check';
import type { APIHandler } from '@/types/api-env';
import { userPublicSchema } from './me.route';

const registerBodySchema = createInsertSchema(users, {
  email: () => z.email(),
  password: (s) => s.min(8),
})
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    password: z.string().min(8),
  })
  .openapi('RegisterBody');

export const route = createRoute({
  method: 'post',
  path: '/auth/register',
  tags: ['Auth'],
  request: {
    body: jsonContentRequired(registerBodySchema, 'Registration payload'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(userPublicSchema, 'Registered'),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(messageResponseSchema, 'Bad request'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(registerBodySchema),
      'Validation error(s)',
    ),
  },
});

export const handler: APIHandler<typeof route> = async (c) => {
  const body = c.req.valid('json');
  const usersRepo = c.get('repo').users;

  if (await usersRepo.existsByEmail(body.email)) {
    return c.json({ message: `User already exists for email ${body.email}` }, 400);
  }

  const passwordHash = await hashPassword(body.password);
  const created = await usersRepo.create({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: passwordHash,
    mobile: body.mobile,
  });

  if (!created) {
    return c.json({ message: 'Registration failed' }, 400);
  }

  return c.json(toPublicUser(created), HttpStatusCodes.OK);
};
