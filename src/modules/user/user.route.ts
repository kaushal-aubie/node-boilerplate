import type { OpenAPIHono } from '@hono/zod-openapi';
import { API_VERSION_V1 } from '@/config/constants';
import { withApiVersion } from '@/lib/app/versioned-route';
import type { ApiEnv } from '@/types/api-env';
import * as login from './v1/login.route';
import * as logout from './v1/logout.route';
import * as me from './v1/me.route';
import * as register from './v1/register.route';

export function registerUserRoutes(app: OpenAPIHono<ApiEnv>) {
  app
    .openapi(withApiVersion(API_VERSION_V1, register.route), register.handler)
    .openapi(withApiVersion(API_VERSION_V1, logout.route), logout.handler)
    .openapi(withApiVersion(API_VERSION_V1, login.route), login.handler)
    .openapi(withApiVersion(API_VERSION_V1, me.route), me.handler);
}
