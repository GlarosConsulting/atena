import sleep from '@utils/sleep';
import spawn from '@utils/spawn';

import api from './services/api';

interface ICompany {
  cnpj: string;
}

async function runScraperForCompany(companyCnpj: string) {
  await spawn('yarn', [
    'workspace',
    '@scraper/siconv',
    'start',
    'run',
    companyCnpj,
    '--cache_key',
    '123456789',
    // '--verbose',
  ]);
}

async function run() {
  const { data: companies } = await api.get<ICompany[]>('companies', {
    params: {
      page: 1,
      rowsPerPage: 64,
    },
  });

  for (const company of companies) {
    if (company.cnpj.length !== 14 && company.cnpj.length !== 18) {
      return;
    }

    runScraperForCompany(company.cnpj);

    await sleep(5000);
  }
}

run();
