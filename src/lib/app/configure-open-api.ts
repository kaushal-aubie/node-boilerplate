/**
 * OpenAPI + Scalar setup inspired by
 * https://github.com/w3cj/hono-open-api-starter/blob/main/src/lib/configure-open-api.ts
 */
import type { OpenAPIHono } from '@hono/zod-openapi';
import { Scalar } from '@scalar/hono-api-reference';
import type { Hono } from 'hono';
import { API_BASE_PATH } from '@/config/constants';
import type { ApiEnv } from '@/types/api-env';
import packageJSON from '../../../package.json';

const openApiDocPath = '/doc';

export function configureOpenAPI(api: OpenAPIHono<ApiEnv>, root: Hono) {
  api.doc31(openApiDocPath, {
    openapi: '3.1.0',
    info: {
      version: packageJSON.version,
      title: packageJSON.name,
      description: packageJSON.description || 'REST API',
    },
    // Path keys already include `API_BASE_PATH` from OpenAPIHono `basePath`; do not repeat it in `servers`.
    servers: [{ url: '/', description: 'API v1' }],
  });

  const specUrl = `${API_BASE_PATH}${openApiDocPath}`;

  root.get(
    '/docs',
    Scalar({
      url: specUrl,
      theme: 'default',
      layout: 'modern',
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'fetch',
      },
      pageTitle: `${packageJSON.name} · API`,
    }),
  );
}
