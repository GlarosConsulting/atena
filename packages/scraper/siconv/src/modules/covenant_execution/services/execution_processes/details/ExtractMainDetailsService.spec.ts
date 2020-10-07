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
import ExtractMainDetailsService from './ExtractMainDetailsService';
import NavigateToExecutionProcessDetailsPageService from './NavigateToExecutionProcessDetailsPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractAgreementsList: ExtractAgreementsListService;
let openAgreementById: OpenAgreementByIdService;
let navigateToCovenantExecutionPage: NavigateToCovenantExecutionPageService;
let navigateToExecutionProcessesPage: NavigateToExecutionProcessesPageService;
let extractExecutionProcessesList: ExtractExecutionProcessesListService;
let navigateToExecutionProcessDetailsPage: NavigateToExecutionProcessDetailsPageService;
let extractMainDetails: ExtractMainDetailsService;

let browser: Browser;
let page: Page;

describe('ExtractMainDetails', () => {
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
    extractMainDetails = new ExtractMainDetailsService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to extract execution process main details', async () => {
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

    const mainDetails = await extractMainDetails.execute();

    expect(mainDetails).toEqual(
      expect.objectContaining({
        execution_process: expect.any(String),
        buy_type: expect.any(String),
        bidding_status: expect.any(String),
        resource_origin: expect.any(String),
        financial_resource: expect.any(String),
        modality: expect.any(String),
        bidding_type: expect.any(String),
        process_number: expect.any(String),
        bidding_number: expect.any(String),
        object: expect.any(String),
        legal_foundation: expect.any(String),
        justification: expect.any(String),
        bidding_value: expect.any(Number),
        dates: expect.any(Object),
        homologation_responsible: {
          cpf_document: expect.any(String),
          name: expect.any(String),
          role: expect.any(String),
        },
        city: {
          name: expect.any(String),
          state: expect.any(String),
        },
      }),
    );
  });

  it('should not be able to extract execution process main details outside execution process details page', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreementById.execute({ agreement_id });

    await expect(extractMainDetails.execute()).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to extract main details when execution process details page does not have this section', async () => {
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

    const mainDetails = await extractMainDetails.execute();

    expect(mainDetails).toBeFalsy();
  });
});
