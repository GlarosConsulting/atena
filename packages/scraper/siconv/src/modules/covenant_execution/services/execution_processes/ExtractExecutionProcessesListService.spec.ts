import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import ExtractAgreementsListService from '@modules/agreements_list/services/ExtractAgreementsListService';
import OpenAgreementByIdService from '@modules/agreements_list/services/OpenAgreementByIdService';
import { By } from '@modules/search/dtos/ISearchDTO';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

import NavigateToCovenantExecutionPageService from '../NavigateToCovenantExecutionPageService';
import ExtractExecutionProcessesListService from './ExtractExecutionProcessesListService';
import NavigateToExecutionProcessesPageService from './NavigateToExecutionProcessesPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractAgreementsList: ExtractAgreementsListService;
let openAgreementById: OpenAgreementByIdService;
let navigateToCovenantExecutionPage: NavigateToCovenantExecutionPageService;
let navigateToExecutionProcessesPage: NavigateToExecutionProcessesPageService;
let extractExecutionProcessesList: ExtractExecutionProcessesListService;

let browser: Browser;
let page: Page;

describe('ExtractExecutionProcessesList', () => {
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
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to extract execution processes list', async () => {
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

    const executionProcesses = await extractExecutionProcessesList.execute();

    expect(executionProcesses).toContainEqual(
      expect.objectContaining({
        number: expect.any(String),
        execution_process: expect.any(String),
        process_number: expect.any(String),
        status: expect.any(String),
        origin_system_status: expect.any(String),
        origin_system: expect.any(String),
        execution_process_accept: expect.any(String),
      }),
    );
  });

  it('should not be able to extract execution processes list outside execution processes page', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreementById.execute({ agreement_id });

    await expect(
      extractExecutionProcessesList.execute(),
    ).rejects.toBeInstanceOf(AppError);
  });
});
