import type { OpenAPIHono } from '@hono/zod-openapi';
import { API_VERSION_V1 } from '@/config/constants';
import { withApiVersion } from '@/lib/app/versioned-route';
import type { ApiEnv } from '@/types/api-env';
import * as get from './v1/get.route';

export function registerHealthRoutes(app: OpenAPIHono<ApiEnv>) {
  app.openapi(withApiVersion(API_VERSION_V1, get.route), get.handler);
}
