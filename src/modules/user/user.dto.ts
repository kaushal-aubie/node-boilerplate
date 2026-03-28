import { z } from '@hono/zod-openapi';
import type { User } from '@/db/schema';
import { selectUserSchema } from '@/db/schema';
import { toUtcIsoString } from '@/lib/date';

/** OpenAPI + JSON shape for user responses (no password; ISO timestamps). */
export const userPublicSchema = selectUserSchema
  .omit({ password: true })
  .extend({
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi('UserPublic');

export function toPublicUser(u: User) {
  return {
    id: u.id,
    firstName: u.firstName ?? null,
    lastName: u.lastName ?? null,
    email: u.email,
    mobile: u.mobile ?? null,
    createdAt: toUtcIsoString(u.createdAt),
    updatedAt: toUtcIsoString(u.updatedAt),
  };
}
