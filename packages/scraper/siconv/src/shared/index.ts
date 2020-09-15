import 'dotenv/config';
import 'reflect-metadata';

import '@shared/container';

import { container } from 'tsyringe';
import { command, Argv } from 'yargs';

import cacheConfig from '@config/cache';

import Executor from '@shared/puppeteer/executor';

interface IArgv extends Argv {
  company: string;
  cacheKey: string;
  verbose: boolean;
}

command(
  'run [company]',
  'Scrap the company CNPJ on Siconv platform',
  yargs => {
    yargs.positional('company', {
      describe: 'Company CNPJ to scrap',
    });
  },
  (argv: IArgv) => {
    const executor = container.resolve(Executor);

    const { company, cacheKey, verbose } = argv;

    if (cacheKey) {
      cacheConfig.key = cacheKey;
    }

    executor
      .run({ company, verbose })
      .then(() => {
        process.exit();
      })
      .catch(err => {
        console.log('Occurred an unexpected error:');
        console.log(err);
      });
  },
)
  .option('cacheKey', {
    type: 'string',
    description: 'Set the custom cache key',
  })
  .option('verbose', {
    type: 'boolean',
    description: 'Run with verbose logging',
  })
  .demandCommand(1)
  .demandOption('company').argv;
