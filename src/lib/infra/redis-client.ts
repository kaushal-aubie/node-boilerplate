import Redis from 'ioredis';
import { getEnv } from '@/config/env';

export class RedisClient {
  readonly client: Redis;

  constructor() {
    const e = getEnv();
    const common = { lazyConnect: true as const, maxRetriesPerRequest: 3 };
    if (e.REDIS_URL) {
      this.client = new Redis(e.REDIS_URL, common);
    } else {
      this.client = new Redis({
        ...common,
        host: e.REDIS_HOST,
        port: e.REDIS_PORT,
        password: e.REDIS_PASSWORD || undefined,
        db: e.REDIS_DB,
      });
    }
  }

  async connect(): Promise<void> {
    await this.client.connect();
    await this.client.ping();
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}
