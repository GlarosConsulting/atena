import { container } from 'tsyringe';

import FakeCacheProvider from './fakes/FakeCacheProvider';
import RedisCacheProvider from './implementations/RedisCacheProvider';
import ICacheProvider from './models/ICacheProvider';

const providers = {
  memory: FakeCacheProvider,
  redis: RedisCacheProvider,
};

container.registerSingleton<ICacheProvider>('CacheProvider', providers.memory);
