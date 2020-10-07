import ExtractAgreementsListService from '@modules/agreements_list/services/ExtractAgreementsListService';
import NavigateToPageService from '@modules/agreements_list/services/NavigateToPageService';
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
import NavigateToExecutionProcessDetailsPageService from './NavigateToExecutionProcessDetailsPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let navigateToPage: NavigateToPageService;
let extractAgreementsList: ExtractAgreementsListService;
let openAgreement: OpenAgreementByIdService;
let navigateToCovenantExecutionPage: NavigateToCovenantExecutionPageService;
let navigateToExecutionProcessesPage: NavigateToExecutionProcessesPageService;
let extractExecutionProcessesList: ExtractExecutionProcessesListService;
let navigateToExecutionProcessDetailsPage: NavigateToExecutionProcessDetailsPageService;

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
    navigateToPage = new NavigateToPageService(page);
    extractAgreementsList = new ExtractAgreementsListService(page);
    openAgreement = new OpenAgreementByIdService(page);
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
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to navigate to execution process details page', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const { agreement_id } = agreements.find(
      findAgreement => findAgreement.agreement_id === '876519/2018',
    );

    await openAgreement.execute({ agreement_id });

    await navigateToCovenantExecutionPage.execute();

    await navigateToExecutionProcessesPage.execute();

    const [
      { execution_process_id },
    ] = await extractExecutionProcessesList.execute();

    await navigateToExecutionProcessDetailsPage.execute({
      execution_process_id,
    });

    await expect(page.driver.title()).resolves.toEqual('Detalha Licitacao');
  });

  it("should not be able to navigate to execution process details page outside agreement covenant execution's execution processes page", async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    await expect(
      navigateToExecutionProcessDetailsPage.execute({
        execution_process_id: 'any-execution-process-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to navigate to execution process details page when not able to find execution process details button element', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const { agreement_id } = agreements.find(
      findAgreement => findAgreement.agreement_id === '876519/2018',
    );

    await openAgreement.execute({ agreement_id });

    await navigateToCovenantExecutionPage.execute();

    await navigateToExecutionProcessesPage.execute();

    const [
      { execution_process_id },
    ] = await extractExecutionProcessesList.execute();

    jest
      .spyOn(page, 'findElementsByText')
      .mockImplementationOnce(async () => [])
      .mockImplementationOnce(async () => []);

    await expect(
      navigateToExecutionProcessDetailsPage.execute({ execution_process_id }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to navigate to execution process details page when find the first execution process details button element', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    await navigateToPage.execute({ page: 2 });

    const agreements = await extractAgreementsList.execute();

    const { agreement_id } = agreements.find(
      findAgreement => findAgreement.agreement_id === '837439/2016',
    );

    await openAgreement.execute({ agreement_id });

    await navigateToCovenantExecutionPage.execute();

    await navigateToExecutionProcessesPage.execute();

    const [
      { execution_process_id },
    ] = await extractExecutionProcessesList.execute();

    jest
      .spyOn(page, 'findElementsByText')
      .mockImplementationOnce(async () => [])
      .mockImplementationOnce(async () => []);

    await expect(
      navigateToExecutionProcessDetailsPage.execute({ execution_process_id }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
