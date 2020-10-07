import ExtractAgreementsListService from '@modules/agreements_list/services/ExtractAgreementsListService';
import OpenAgreementByIdService from '@modules/agreements_list/services/OpenAgreementByIdService';
import { By } from '@modules/search/dtos/ISearchDTO';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import NavigateToCovenantExecutionPageService from '../NavigateToCovenantExecutionPageService';
import NavigateToExecutionProcessesPageService from './NavigateToExecutionProcessesPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractAgreementsList: ExtractAgreementsListService;
let openAgreement: OpenAgreementByIdService;
let navigateToCovenantExecutionPage: NavigateToCovenantExecutionPageService;
let navigateToExecutionProcessesPage: NavigateToExecutionProcessesPageService;

let browser: Browser;
let page: Page;

describe('NavigateToExecutionProcessesPage', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    searchAgreements = new SearchAgreementsService(page);
    extractAgreementsList = new ExtractAgreementsListService(page);
    openAgreement = new OpenAgreementByIdService(page);
    navigateToCovenantExecutionPage = new NavigateToCovenantExecutionPageService(
      page,
    );
    navigateToExecutionProcessesPage = new NavigateToExecutionProcessesPageService(
      page,
    );
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to navigate to execution processes page', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreement.execute({ agreement_id });

    await navigateToCovenantExecutionPage.execute();

    await navigateToExecutionProcessesPage.execute();

    await expect(page.driver.title()).resolves.toEqual('Listar Licitacoes');
  });

  it('should not be able to navigate to execution processes page outside opened agreement page', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    await expect(
      navigateToExecutionProcessesPage.execute(),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to navigate to execution processes page when not able to find 'Processo de Execução' submenu", async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreement.execute({ agreement_id });

    await navigateToCovenantExecutionPage.execute();

    jest
      .spyOn(page, 'findElementsByText')
      .mockImplementationOnce(async () => []);

    await expect(
      navigateToExecutionProcessesPage.execute(),
    ).rejects.toBeInstanceOf(AppError);
  });
});
