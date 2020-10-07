import ExtractAgreementsListService from '@modules/agreements_list/services/ExtractAgreementsListService';
import OpenAgreementByIdService from '@modules/agreements_list/services/OpenAgreementByIdService';
import { By } from '@modules/search/dtos/ISearchDTO';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import ExtractDatesService from './ExtractDatesService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractAgreementsList: ExtractAgreementsListService;
let openAgreementById: OpenAgreementByIdService;
let extractDates: ExtractDatesService;

let browser: Browser;
let page: Page;

describe('ExtractDates', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    searchAgreements = new SearchAgreementsService(page);
    extractAgreementsList = new ExtractAgreementsListService(page);
    openAgreementById = new OpenAgreementByIdService(page);
    extractDates = new ExtractDatesService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to extract dates', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreementById.execute({ agreement_id });

    const dates = await extractDates.execute();

    expect(dates).toHaveProperty('proposal_date');
    expect(dates).toHaveProperty('signature_date');
    expect(dates).toHaveProperty('published_dou_date');
    expect(dates.validity).toHaveProperty('start_date');
    expect(dates.validity).toHaveProperty('end_date');
    expect(dates).toHaveProperty('accountability_limit_date');
  });

  it('should not be able to extract dates when page is not an opened agreement', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    await expect(extractDates.execute()).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to extract dates when opened opened agreement does not have this section', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreementById.execute({ agreement_id });

    jest
      .spyOn(page, 'findElementsByText')
      .mockImplementationOnce(async () => []);

    const dates = await extractDates.execute();

    expect(dates).toBeFalsy();
  });
});
