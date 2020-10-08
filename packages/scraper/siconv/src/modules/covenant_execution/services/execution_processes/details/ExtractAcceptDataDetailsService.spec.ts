import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import ExtractAgreementsListService from '@modules/agreements_list/services/ExtractAgreementsListService';
import OpenAgreementByIdService from '@modules/agreements_list/services/OpenAgreementByIdService';
import { By } from '@modules/search/dtos/ISearchDTO';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

import NavigateToCovenantExecutionPageService from '../../NavigateToCovenantExecutionPageService';
import ExtractExecutionProcessesListService from '../ExtractExecutionProcessesListService';
import NavigateToExecutionProcessesPageService from '../NavigateToExecutionProcessesPageService';
import ExtractAcceptDataDetailsService from './ExtractAcceptDataDetailsService';
import NavigateToExecutionProcessDetailsPageService from './NavigateToExecutionProcessDetailsPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractAgreementsList: ExtractAgreementsListService;
let openAgreementById: OpenAgreementByIdService;
let navigateToCovenantExecutionPage: NavigateToCovenantExecutionPageService;
let navigateToExecutionProcessesPage: NavigateToExecutionProcessesPageService;
let extractExecutionProcessesList: ExtractExecutionProcessesListService;
let navigateToExecutionProcessDetailsPage: NavigateToExecutionProcessDetailsPageService;
let extractAcceptDataDetails: ExtractAcceptDataDetailsService;

let browser: Browser;
let page: Page;

describe('ExtractAcceptDataDetails', () => {
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
    extractAcceptDataDetails = new ExtractAcceptDataDetailsService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to extract execution process accept data details', async () => {
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

    const acceptDataDetails = await extractAcceptDataDetails.execute();

    expect(acceptDataDetails).toEqual(
      expect.objectContaining({
        responsibility_assignment: expect.any(String),
        analysis_date: expect.any(Date),
        execution_process_accept: expect.any(String),
        justification: expect.any(String),
        responsible: expect.any(String),
        analysis_record_date: expect.any(Date),
      }),
    );
  });

  it('should not be able to extract execution process accept data details outside execution process details page', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreementById.execute({ agreement_id });

    await expect(extractAcceptDataDetails.execute()).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should not be able to extract accept data details when execution process details page does not have this section', async () => {
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
      .spyOn(page, 'findElementsByText')
      .mockImplementationOnce(async () => []);

    const acceptDataDetails = await extractAcceptDataDetails.execute();

    expect(acceptDataDetails).toBeFalsy();
  });
});
