import { createRoute, type OpenAPIHono, type RouteHandler } from '@hono/zod-openapi';
import { and, eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { db } from '@/db/client';
import { blogs } from '@/db/schema';
import { messageResponseSchema, notFoundSchema } from '@/lib/constants';
import { parseResponse } from '@/lib/json-response';
import { requireAuth } from '@/middleware/auth.middleware';
import type { ApiEnv } from '@/types/api-env';
import { selectBlogSchema } from '../select-blog.schema';
import { toPublicBlog } from '../to-public-blog';

const insertBlog = createInsertSchema(blogs, {
  title: (s) => s.min(1).max(512),
  content: (s) => s.min(1),
});

const insertBlogBodyBase = insertBlog.omit({
  id: true,
  authorId: true,
  createdAt: true,
  updatedAt: true,
});

const patchBlogBodySchema = insertBlogBodyBase
  .partial()
  .refine((val: Record<string, unknown>) => Object.keys(val).length > 0, {
    message: 'No updates provided',
  })
  .openapi('BlogPatchBody');

const route = createRoute({
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

const handler: RouteHandler<typeof route, ApiEnv> = async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ message: 'Unauthorized' }, 401);
  }
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');

  const [existing] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
  if (!existing) {
    return c.json({ message: 'Blog not found' }, 404);
  }
  if (existing.authorId !== user.id) {
    return c.json({ message: 'Forbidden' }, 403);
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
    return c.json({ message: 'Blog not found' }, 404);
  }

  return c.json(
    parseResponse(selectBlogSchema, { message: 'Blog updated', data: toPublicBlog(row) }),
    200,
  );
};

export function registerBlogsPatchRoute(app: OpenAPIHono<ApiEnv>) {
  app.openapi(route, handler);
}
