import type { OpenAPIHono } from '@hono/zod-openapi';
import { API_VERSION_V1 } from '@/config/constants';
import { withApiVersion } from '@/lib/app/versioned-route';
import type { ApiEnv } from '@/types/api-env';
import * as create from './v1/create-blog.route';
import * as remove from './v1/delete-blog.route';
import * as get from './v1/get-blog-by-id.route';
import * as list from './v1/list-blog.route';
import * as patch from './v1/patch-blog.route';

export function registerBlogRoutes(app: OpenAPIHono<ApiEnv>) {
  app
    .openapi(withApiVersion(API_VERSION_V1, list.route), list.handler)
    .openapi(withApiVersion(API_VERSION_V1, get.route), get.handler)
    .openapi(withApiVersion(API_VERSION_V1, create.route), create.handler)
    .openapi(withApiVersion(API_VERSION_V1, patch.route), patch.handler)
    .openapi(withApiVersion(API_VERSION_V1, remove.route), remove.handler);
}
