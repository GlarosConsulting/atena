import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import ExtractAgreementsListService from '@modules/agreements_list/services/ExtractAgreementsListService';
import OpenAgreementByIdService from '@modules/agreements_list/services/OpenAgreementByIdService';
import { By } from '@modules/search/dtos/ISearchDTO';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

import ExtractMainDataService from './ExtractMainDataService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractAgreementsList: ExtractAgreementsListService;
let openAgreementById: OpenAgreementByIdService;
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

    const mainData = await extractMainData.execute();

    expect(mainData).toHaveProperty('modality');
    expect(mainData).toHaveProperty('sent');
    expect(mainData).toHaveProperty('siafi_status');
    expect(mainData).toHaveProperty('hiring_status');
    expect(mainData).toHaveProperty('status');
    expect(mainData.status).toHaveProperty('value');
    expect(mainData.status).toHaveProperty('committed');
    expect(mainData.status).toHaveProperty('publication');
    expect(mainData).toHaveProperty('proposal_id');
    expect(mainData).toHaveProperty('organ_intern_id');
    expect(mainData).toHaveProperty('process_id');
  });

  it('should not be able to extract main data when page is not an opened agreement', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    await expect(extractMainData.execute()).rejects.toBeInstanceOf(AppError);
  });
});
