import { container } from 'tsyringe';

import MemoryCacheProvider from './implementations/MemoryCacheProvider';
import ICacheProvider from './models/ICacheProvider';

const providers = {
  memory: MemoryCacheProvider,
};

container.registerSingleton<ICacheProvider>('CacheProvider', providers.memory);
