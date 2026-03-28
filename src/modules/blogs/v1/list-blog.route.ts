import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import type { APIHandler } from '@/types/api-env';
import { blogPublicSchema, toPublicBlog } from '../blog.dto';

export const route = createRoute({
  method: 'get',
  path: '/blogs',
  tags: ['Blogs'],
  summary: 'List blogs',
  description: 'Returns every blog post. Responses may be served from cache.',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(blogPublicSchema), 'All blogs'),
  },
});

export const handler: APIHandler<typeof route> = async (c) => {
  const rows = await c.get('repo').blogs.listCached();
  return c.json(rows.map(toPublicBlog), HttpStatusCodes.OK);
};
