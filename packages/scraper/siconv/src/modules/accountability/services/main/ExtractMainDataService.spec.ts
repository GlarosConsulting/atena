import ExtractAgreementsListService from '@modules/agreements_list/services/ExtractAgreementsListService';
import OpenAgreementByIdService from '@modules/agreements_list/services/OpenAgreementByIdService';
import { By } from '@modules/search/dtos/ISearchDTO';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import NavigateToAccountabilityPageService from '../NavigateToAccountabilityPageService';
import ExtractMainDataService from './ExtractMainDataService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractAgreementsList: ExtractAgreementsListService;
let openAgreementById: OpenAgreementByIdService;
let navigateToAccountabilityPage: NavigateToAccountabilityPageService;
let extractMainData: ExtractMainDataService;

let browser: Browser;
let page: Page;

describe('ExtractMainData', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    searchAgreements = new SearchAgreementsService(page);
    extractAgreementsList = new ExtractAgreementsListService(page);
    openAgreementById = new OpenAgreementByIdService(page);
    navigateToAccountabilityPage = new NavigateToAccountabilityPageService(
      page,
    );
    extractMainData = new ExtractMainDataService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to extract main data', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreementById.execute({ agreement_id });

    await navigateToAccountabilityPage.execute();

    const mainData = await extractMainData.execute();

    expect(mainData).toHaveProperty('agreement_object');
    expect(mainData).toHaveProperty('granting_organ');
    expect(mainData).toHaveProperty('covenant_hired');
    expect(mainData).toHaveProperty('cnpj');
    expect(mainData).toHaveProperty('uf');
    expect(mainData).toHaveProperty('modality');
    expect(mainData).toHaveProperty('status');
    expect(mainData).toHaveProperty('technical_analysis');
    expect(mainData).toHaveProperty('number');
  });

  it('should not be able to extract main data outside main accountability page', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreementById.execute({ agreement_id });

    await expect(extractMainData.execute()).rejects.toBeInstanceOf(AppError);
  });
});
