import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import ExtractAgreementsListService from '@modules/agreements_list/services/ExtractAgreementsListService';
import OpenAgreementByIdService from '@modules/agreements_list/services/OpenAgreementByIdService';
import { By } from '@modules/search/dtos/ISearchDTO';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

import ExtractProgramsListService from '../ExtractProgramsListService';
import NavigateToProgramsPageService from '../NavigateToProgramsPageService';
import NavigateToProgramDetailsPageService from './NavigateToProgramDetailsPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractAgreementsList: ExtractAgreementsListService;
let openAgreement: OpenAgreementByIdService;
let navigateToProgramsPage: NavigateToProgramsPageService;
let extractProgramsList: ExtractProgramsListService;
let navigateToProgramDetailsPage: NavigateToProgramDetailsPageService;

let browser: Browser;
let page: Page;

describe('NavigateToProgramDetailsPage', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    searchAgreements = new SearchAgreementsService(page);
    extractAgreementsList = new ExtractAgreementsListService(page);
    openAgreement = new OpenAgreementByIdService(page);
    navigateToProgramsPage = new NavigateToProgramsPageService(page);
    extractProgramsList = new ExtractProgramsListService(page);
    navigateToProgramDetailsPage = new NavigateToProgramDetailsPageService(
      page,
    );
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to navigate to program details page', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreement.execute({ agreement_id });

    await navigateToProgramsPage.execute();

    const [{ program_id }] = await extractProgramsList.execute();

    await navigateToProgramDetailsPage.execute({ program_id });

    await expect(page.driver.title()).resolves.toEqual('Valores do Programa');
  });

  it('should not be able to navigate to program details page outside agreement programs page', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    await expect(
      navigateToProgramDetailsPage.execute({ program_id: 'any-program-id' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to navigate to program details page when not able to find program details button element', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreement.execute({ agreement_id });

    await navigateToProgramsPage.execute();

    const [{ program_id }] = await extractProgramsList.execute();

    jest.spyOn(page, 'findElementsByText').mockImplementationOnce(async () => {
      return [];
    });

    await expect(
      navigateToProgramDetailsPage.execute({ program_id }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
