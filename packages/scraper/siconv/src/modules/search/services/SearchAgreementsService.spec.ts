import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import { By } from '@modules/search/dtos/ISearchDTO';

import SearchAgreementsService from './SearchAgreementsService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;

let browser: Browser;
let page: Page;

describe('SearchAgreements', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    searchAgreements = new SearchAgreementsService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to search agreements by cnpj', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    await expect(page.driver.title()).resolves.toMatch(
      'Resultado da Consulta de Convênio',
    );
    await expect(
      page.findElementsByText('Lista de Pré-Convênios/Convênios', 'h3'),
    ).resolves.toBeTruthy();
  });

  it('should not be able to search agreements without specify identifier', async () => {
    await expect(
      searchAgreements.execute({
        by: null,
        value: '12.198.693/0001-58',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
