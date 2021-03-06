import 'dotenv/config';
import 'reflect-metadata';

import '@shared/container';

import { container } from 'tsyringe';
import { command, Argv } from 'yargs';

import cacheConfig from '@config/cache';

import Launcher from '@shared/puppeteer/launcher';

interface IArgv extends Argv {
  company: string;
  cache_key: string;
  headless: boolean;
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
    const launcher = container.resolve(Launcher);

    const { company, cache_key, headless, verbose } = argv;

    if (cache_key) {
      cacheConfig.key = cache_key;
    }

    launcher
      .launch({ company, headless, verbose })
      .catch(err => {
        console.log('Occurred an unexpected error:');
        console.log(err);
      })
      .finally(() => {
        process.exit();
      });
  },
)
  .option('cache_key', {
    type: 'string',
    description: 'Set the custom cache key',
  })
  .option('headless', {
    type: 'boolean',
    default: false,
    description: 'Run with headless browser',
  })
  .option('verbose', {
    type: 'boolean',
    default: false,
    description: 'Run with verbose logging',
  })
  .demandCommand(1)
  .demandOption('company').argv;
