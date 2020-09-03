import Redis, { Redis as RedisClient } from 'ioredis';

import cacheConfig from '@config/cache';

import ICacheProvider from '../models/ICacheProvider';

class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) return null;

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async invalidate(...keys: string[]): Promise<void> {
    await this.client.del(keys);
  }

  public async invalidatePrefix(...prefixes: string[]): Promise<void> {
    const keys: string[] = [];

    for (const prefix of prefixes) {
      const findKeys = await this.client.keys(`${prefix}*`);

      keys.push(...findKeys);
    }

    const pipeline = this.client.pipeline();

    keys.forEach(key => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }
}

export default RedisCacheProvider;
