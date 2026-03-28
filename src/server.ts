import '@/config/load-env';
import type { AddressInfo } from 'node:net';
import { serve } from '@hono/node-server';
import { createApp } from '@/app';
import { ENV_MODE } from '@/config/constants';
import { envVars } from '@/config/env';
import { CacheClient, DatabaseClient, RedisClient } from '@/lib/infra';
import { logger } from '@/lib/logger';
import { writeStartupBanner } from '@/lib/startup-banner';
import packageJSON from '../package.json';

async function main() {
  const database = new DatabaseClient();
  const redis = new RedisClient();
  const cache = new CacheClient(redis.client);

  try {
    await database.connect();
    await redis.connect();
    await cache.connect();
  } catch (err) {
    await Promise.allSettled([cache.disconnect(), redis.disconnect(), database.disconnect()]);
    throw err;
  }
  logger.info('PostgreSQL, Redis, and BentoCache are ready');

  const app = createApp({ database, redis, cache });

  const exposeDocs =
    envVars.NODE_ENV !== ENV_MODE.PRODUCTION || process.env.ENABLE_API_DOCS === 'true';

  const server = serve({ fetch: app.fetch, port: envVars.PORT }, (info: AddressInfo) => {
    logger.info({ port: info.port, env: envVars.NODE_ENV }, 'HTTP server listening');
    writeStartupBanner({
      appName: packageJSON.name,
      version: packageJSON.version,
      nodeEnv: envVars.NODE_ENV,
      address: info,
      docsEnabled: exposeDocs,
    });
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutting down');
    await Promise.allSettled([cache.disconnect(), redis.disconnect(), database.disconnect()]);
    server.close?.();
    process.exit(0);
  };

  process.once('SIGINT', () => void shutdown('SIGINT'));
  process.once('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((err) => {
  logger.error({ err }, 'Startup failed');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception');
});
