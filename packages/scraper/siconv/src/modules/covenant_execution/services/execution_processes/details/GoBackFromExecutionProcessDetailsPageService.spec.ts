import ExtractAgreementsListService from '@modules/agreements_list/services/ExtractAgreementsListService';
import OpenAgreementByIdService from '@modules/agreements_list/services/OpenAgreementByIdService';
import { By } from '@modules/search/dtos/ISearchDTO';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import NavigateToCovenantExecutionPageService from '../../NavigateToCovenantExecutionPageService';
import ExtractExecutionProcessesListService from '../ExtractExecutionProcessesListService';
import NavigateToExecutionProcessesPageService from '../NavigateToExecutionProcessesPageService';
import GoBackFromExecutionProcessDetailsPageService from './GoBackFromExecutionProcessDetailsPageService';
import NavigateToExecutionProcessDetailsPageService from './NavigateToExecutionProcessDetailsPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractAgreementsList: ExtractAgreementsListService;
let openAgreementById: OpenAgreementByIdService;
let navigateToCovenantExecutionPage: NavigateToCovenantExecutionPageService;
let navigateToExecutionProcessesPage: NavigateToExecutionProcessesPageService;
let extractExecutionProcessesList: ExtractExecutionProcessesListService;
let navigateToExecutionProcessDetailsPage: NavigateToExecutionProcessDetailsPageService;
let goBackFromExecutionProcessDetailsPage: GoBackFromExecutionProcessDetailsPageService;

let browser: Browser;
let page: Page;

describe('GoBackFromExecutionProcessDetailsPage', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    searchAgreements = new SearchAgreementsService(page);
    extractAgreementsList = new ExtractAgreementsListService(page);
    openAgreementById = new OpenAgreementByIdService(page);
    navigateToCovenantExecutionPage = new NavigateToCovenantExecutionPageService(
      page,
    );
    navigateToExecutionProcessesPage = new NavigateToExecutionProcessesPageService(
      page,
    );
    extractExecutionProcessesList = new ExtractExecutionProcessesListService(
      page,
    );
    navigateToExecutionProcessDetailsPage = new NavigateToExecutionProcessDetailsPageService(
      page,
    );
    goBackFromExecutionProcessDetailsPage = new GoBackFromExecutionProcessDetailsPageService(
      page,
    );
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to go back from execution process details page', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const { agreement_id } = agreements.find(
      findAgreement => findAgreement.agreement_id === '876519/2018',
    );

    await openAgreementById.execute({ agreement_id });

    await navigateToCovenantExecutionPage.execute();

    await navigateToExecutionProcessesPage.execute();

    const [
      { execution_process_id },
    ] = await extractExecutionProcessesList.execute();

    await navigateToExecutionProcessDetailsPage.execute({
      execution_process_id,
    });

    await goBackFromExecutionProcessDetailsPage.execute();

    await expect(page.driver.title()).resolves.toEqual('Listar Licitacoes');
  });

  it('should not be able to go back from execution process details page outside the same', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreementById.execute({ agreement_id });

    await expect(
      goBackFromExecutionProcessDetailsPage.execute(),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to go back from execution process details page when not able to find go back button element', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const { agreement_id } = agreements.find(
      findAgreement => findAgreement.agreement_id === '876519/2018',
    );

    await openAgreementById.execute({ agreement_id });

    await navigateToCovenantExecutionPage.execute();

    await navigateToExecutionProcessesPage.execute();

    const [
      { execution_process_id },
    ] = await extractExecutionProcessesList.execute();

    await navigateToExecutionProcessDetailsPage.execute({
      execution_process_id,
    });

    jest
      .spyOn(page, 'findElementsBySelector')
      .mockImplementationOnce(async () => []);

    await expect(
      goBackFromExecutionProcessDetailsPage.execute(),
    ).rejects.toBeInstanceOf(AppError);
  });
});
