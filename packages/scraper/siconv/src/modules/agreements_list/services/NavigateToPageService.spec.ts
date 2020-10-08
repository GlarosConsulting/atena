import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import { By } from '@modules/search/dtos/ISearchDTO';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

import NavigateToPageService from './NavigateToPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let navigateToPage: NavigateToPageService;

let browser: Browser;
let page: Page;

describe('NavigateToPageService', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    searchAgreements = new SearchAgreementsService(page);
    navigateToPage = new NavigateToPageService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to navigate to page 2', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: 'max',
    });

    const clickForNavigate = jest.spyOn(page, 'clickForNavigate');

    await navigateToPage.execute({ page: 2 });

    expect(clickForNavigate).toHaveBeenCalledTimes(1);
  });

  it('should not be able to navigate to page 2 outside agreements list page', async () => {
    await expect(navigateToPage.execute({ page: 2 })).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should not be able to navigate to page 0 or less than one', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: 'max',
    });

    await expect(navigateToPage.execute({ page: 0 })).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should not be able to navigate to page 5 that is greater than total pages, equals to 4', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '27.957.062/0001-42',
    });

    await expect(navigateToPage.execute({ page: 5 })).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should be able to go to next pages and navigate to page 11', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: 'max',
    });

    const clickForNavigate = jest.spyOn(page, 'clickForNavigate');

    await navigateToPage.execute({ page: 11 });

    expect(clickForNavigate).toHaveBeenCalledTimes(1);
  });

  it('should be able to go to next pages and navigate to page 24 then go to previous pages and navigate to page 12', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: 'max',
    });

    const clickForNavigate = jest.spyOn(page, 'clickForNavigate');

    await navigateToPage.execute({ page: 24 });
    await navigateToPage.execute({ page: 12 });

    expect(clickForNavigate).toHaveBeenCalledTimes(5);
  });

  it('should not be able to go to next pages when not able to find next pages anchor', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: 'max',
    });

    const clickForNavigate = jest.spyOn(page, 'clickForNavigate');
    const findElementsByText = jest
      .spyOn(page, 'findElementsByText')
      .mockImplementationOnce(async () => [])
      .mockImplementationOnce(async () => []);

    await expect(navigateToPage.execute({ page: 12 })).rejects.toBeInstanceOf(
      AppError,
    );

    expect(clickForNavigate).not.toHaveBeenCalled();
    expect(findElementsByText).toHaveBeenCalledTimes(2);
  });

  it('should not be able to go to previous pages when not able to find previous pages anchor', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: 'max',
    });

    await navigateToPage.execute({ page: 12 });

    const clickForNavigate = jest.spyOn(page, 'clickForNavigate');
    const findElementsByText = jest
      .spyOn(page, 'findElementsByText')
      .mockImplementationOnce(async () => [])
      .mockImplementationOnce(async () => []);

    await expect(navigateToPage.execute({ page: 2 })).rejects.toBeInstanceOf(
      AppError,
    );

    expect(clickForNavigate).not.toHaveBeenCalled();
    expect(findElementsByText).toHaveBeenCalledTimes(2);
  });
});
