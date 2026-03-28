import { BentoCache, type BentoStore, bentostore } from 'bentocache';
import { memoryDriver } from 'bentocache/drivers/memory';
import { redisDriver } from 'bentocache/drivers/redis';
import type Redis from 'ioredis';

/**
 * Multi-tier cache (in-memory L1 + Redis L2) via Bentocache.
 * Uses a dedicated ioredis duplicate for L2 so {@link RedisClient.disconnect} is not
 * fought by the driver's own disconnect.
 */
export class CacheClient {
  readonly bento: BentoCache<{ primary: BentoStore }>;
  readonly #l2Redis: Redis;

  constructor(primaryRedis: Redis) {
    this.#l2Redis = primaryRedis.duplicate({ lazyConnect: true });
    const primary = bentostore()
      .useL1Layer(memoryDriver({ maxSize: '20mb' }))
      .useL2Layer(redisDriver({ connection: this.#l2Redis }));
    this.bento = new BentoCache({
      default: 'primary',
      stores: {
        primary,
      },
    });
  }

  async connect(): Promise<void> {
    await this.#l2Redis.connect();
    await this.#l2Redis.ping();
  }

  async disconnect(): Promise<void> {
    await this.bento.disconnect();
  }
}
