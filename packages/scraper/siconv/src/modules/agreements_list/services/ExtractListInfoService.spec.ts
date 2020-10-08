import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import { By } from '@modules/search/dtos/ISearchDTO';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

import ExtractListInfoService from './ExtractListInfoService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractListInfo: ExtractListInfoService;

let browser: Browser;
let page: Page;

describe('ExtractListInfo', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    searchAgreements = new SearchAgreementsService(page);
    extractListInfo = new ExtractListInfoService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to extract list info', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const { current_page, total_pages } = await extractListInfo.execute();

    expect(current_page).toEqual(1);
    expect(total_pages).toEqual(4);
  });

  it('should not be able to extract list info outside agreements list page', async () => {
    await expect(extractListInfo.execute()).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to extract list info when list is empty', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '99.999.999/9999-99',
    });

    const { current_page, total_pages } = await extractListInfo.execute();

    expect(current_page).toEqual(0);
    expect(total_pages).toEqual(0);
  });
});
