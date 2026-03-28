import { createRoute } from '@hono/zod-openapi';
import { and, eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { db } from '@/db/client';
import { blogs, selectBlogSchema, updateBlogSchema } from '@/db/schema';
import { messageResponseSchema, notFoundSchema } from '@/lib/stoker';
import { requireAuth } from '@/middleware/auth.middleware';
import type { APIHandler } from '@/types/api-env';

const patchBlogBodySchema = updateBlogSchema
  .partial()
  .refine((val: Record<string, unknown>) => Object.keys(val).length > 0, {
    message: 'No updates provided',
  })
  .openapi('BlogPatchBody');

export const route = createRoute({
  method: 'patch',
  path: '/blogs/{id}',
  tags: ['Blogs'],
  middleware: [requireAuth] as const,
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(patchBlogBodySchema, 'Blog updates'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectBlogSchema, 'Updated'),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(messageResponseSchema, 'Unauthorized'),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(messageResponseSchema, 'Forbidden'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchBlogBodySchema).or(createErrorSchema(IdParamsSchema)),
      'Validation error(s)',
    ),
  },
});

export const handler: APIHandler<typeof route> = async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED);
  }
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');

  const [existing] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
  if (!existing) {
    return c.json({ message: 'blog_not_found' }, HttpStatusCodes.NOT_FOUND);
  }
  if (existing.authorId !== user.id) {
    return c.json({ message: 'forbidden' }, HttpStatusCodes.FORBIDDEN);
  }

  const [row] = await db
    .update(blogs)
    .set({
      ...body,
      updatedAt: new Date(),
    })
    .where(and(eq(blogs.id, id), eq(blogs.authorId, user.id)))
    .returning();

  if (!row) {
    return c.json({ message: 'blog_not_found' }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(row, HttpStatusCodes.OK);
};
