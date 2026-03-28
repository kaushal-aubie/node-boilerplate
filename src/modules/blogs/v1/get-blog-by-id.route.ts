import { createRoute } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { notFoundSchema } from '@/lib/app/stoker';
import type { APIHandler } from '@/types/api-env';
import { blogPublicSchema, toPublicBlog } from '../blog.dto';

export const route = createRoute({
  method: 'get',
  path: '/blogs/{id}',
  tags: ['Blogs'],
  summary: 'Get blog by ID',
  description: 'Returns a single blog by its identifier. Uses cache when available.',
  request: { params: IdParamsSchema },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(blogPublicSchema, 'Blog'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id',
    ),
  },
});

export const handler: APIHandler<typeof route> = async (c) => {
  const { id } = c.req.valid('param');
  const row = await c.get('repo').blogs.findByIdCached(id);

  if (!row) {
    return c.json({ message: 'blog_not_found' }, HttpStatusCodes.NOT_FOUND);
  }
  return c.json(toPublicBlog(row), HttpStatusCodes.OK);
};
