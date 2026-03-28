import '@/config/load-env';
import { serve } from '@hono/node-server';
import { createApp } from '@/app';
import { envVars } from '@/config/env';
import { logger } from '@/lib/logger';

const app = createApp();

serve({ fetch: app.fetch, port: envVars.PORT }, (info) => {
  logger.info({ port: info.port, env: envVars.NODE_ENV }, 'Server started');
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception');
});
