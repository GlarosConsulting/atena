import 'reflect-metadata';

import { container } from 'tsyringe';

import '@shared/container';

import IBrowser from '@scraper/shared/modules/browser/models/IBrowser';
import IPage from '@scraper/shared/modules/browser/models/IPage';
import PuppeteerBrowser from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import proposalData from '@modules/proposal_data/infra/handlers';
import { By } from '@modules/search/dtos/ISearchDTO';
import AgreementsListPage from '@modules/search/infra/puppeteer/pages/AgreementsListPage';
import SiconvSearchPage from '@modules/search/infra/puppeteer/pages/SearchPage';

import backHandler from '../../handlers/back.handler';

(async () => {
  const puppeteerBrowser = new PuppeteerBrowser();

  const browser = await puppeteerBrowser.launch({ headless: false });
  const page = await browser.newPage();

  container.registerInstance<IBrowser<any, any>>('Browser', browser);
  container.registerInstance<IPage<any>>('Page', page);

  const siconvSearchPage = new SiconvSearchPage();

  await siconvSearchPage.search({
    by: By.CNPJ,
    value: '12.198.693/0001-58',
  });

  const agreementsListPage = new AgreementsListPage();

  const agreements = await agreementsListPage.getAll();

  console.log(agreements);

  const [{ agreement_id }] = agreements;

  await agreementsListPage.openById(agreement_id);

  await browser.use(backHandler);

  await browser.run(page, proposalData);
})();
