import '@/config/load-env';
import { serve } from '@hono/node-server';
import { createApp } from '@/app';
import { envVars } from '@/config/env';
import { DatabaseClient } from '@/db/database-client';
import { logger } from '@/lib/logger';
import { RedisClient } from '@/redis/redis-client';

async function main() {
  const database = new DatabaseClient();
  const redis = new RedisClient();

  try {
    await database.connect();
    await redis.connect();
  } catch (err) {
    await Promise.allSettled([database.disconnect(), redis.disconnect()]);
    throw err;
  }
  logger.info('Database and Redis connected');

  const app = createApp({ database, redis });

  const server = serve({ fetch: app.fetch, port: envVars.PORT }, (info) => {
    logger.info({ port: info.port, env: envVars.NODE_ENV }, 'Server started');
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutting down');
    try {
      await redis.disconnect();
    } catch (err) {
      logger.error({ err }, 'Redis disconnect error');
    }
    try {
      await database.disconnect();
    } catch (err) {
      logger.error({ err }, 'Database disconnect error');
    }
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
