import type { OpenAPIHono } from '@hono/zod-openapi';
import type { ApiEnv } from '@/types/api-env';
import * as create from './routes/create-blog.route';
import * as remove from './routes/delete-blog.route';
import * as get from './routes/get-blog-by-id.route';
import * as list from './routes/list-blog.route';
import * as patch from './routes/patch-blog.route';

export function registerBlogRoutes(app: OpenAPIHono<ApiEnv>) {
  app
    .openapi(list.route, list.handler)
    .openapi(get.route, get.handler)
    .openapi(create.route, create.handler)
    .openapi(patch.route, patch.handler)
    .openapi(remove.route, remove.handler);
}
