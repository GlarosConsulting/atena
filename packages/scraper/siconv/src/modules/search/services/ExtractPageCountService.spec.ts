import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import { By } from '@modules/search/dtos/ISearchDTO';

import ExtractPageCountService from './ExtractPageCountService';
import SearchAgreementsService from './SearchAgreementsService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractPageCount: ExtractPageCountService;

let browser: Browser;
let page: Page;

describe('ExtractPageCount', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    searchAgreements = new SearchAgreementsService(page);
    extractPageCount = new ExtractPageCountService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to extract page count', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const pageCount = await extractPageCount.execute();

    expect(pageCount).toEqual(4);
  });

  it('should not be able to extract page count outside agreements list page', async () => {
    await expect(extractPageCount.execute()).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to extract page count when list is empty', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '99.999.999/9999-99',
    });

    const pageCount = await extractPageCount.execute();

    expect(pageCount).toEqual(0);
  });
});
