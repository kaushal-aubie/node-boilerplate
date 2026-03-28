/** Mount path for the API router (no version segment — versions are applied per module). */
export const API_BASE_PATH = '/api';

/** Default API version segment; use in module `*.route.ts` with `withApiVersion`. */
export const API_VERSION_V1 = 'v1' as const;

export enum ENV_MODE {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
}
