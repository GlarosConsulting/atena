import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import { By } from '@modules/search/dtos/ISearchDTO';

import ExtractAgreementsListService from './ExtractAgreementsListService';
import SearchAgreementsService from './SearchAgreementsService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractAgreementsList: ExtractAgreementsListService;

let browser: Browser;
let page: Page;

describe('ExtractAgreementsList', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    searchAgreements = new SearchAgreementsService(page);
    extractAgreementsList = new ExtractAgreementsListService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to extract agreements list', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    expect(agreements).toEqual(
      expect.objectContaining([
        expect.objectContaining({
          agreement_id: expect.any(String),
        }),
      ]),
    );
  });
});
