import type { OpenAPIHono } from '@hono/zod-openapi';
import type { ApiEnv } from '@/types/api-env';
import { registerBlogsCreateRoute } from './routes/create-blog.route';
import { registerBlogsDeleteRoute } from './routes/delete-blog.route';
import { registerBlogsGetRoute } from './routes/get-blog-by-id.route';
import { registerBlogsListRoute } from './routes/list-blog.route';
import { registerBlogsPatchRoute } from './routes/patch-blog.route';

export function registerBlogRoutes(app: OpenAPIHono<ApiEnv>) {
  registerBlogsListRoute(app);
  registerBlogsGetRoute(app);
  registerBlogsCreateRoute(app);
  registerBlogsPatchRoute(app);
  registerBlogsDeleteRoute(app);
}
