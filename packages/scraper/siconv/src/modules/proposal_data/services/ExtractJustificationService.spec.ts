import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import { By } from '@modules/search/dtos/ISearchDTO';
import ExtractAgreementsListService from '@modules/search/services/ExtractAgreementsListService';
import OpenAgreementService from '@modules/search/services/OpenAgreementService';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

import ExtractJustificationService from './ExtractJustificationService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractAgreementsList: ExtractAgreementsListService;
let openAgreement: OpenAgreementService;
let extractJustification: ExtractJustificationService;

let browser: Browser;
let page: Page;

describe('ExtractJustification', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch({
      headless: false,
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();

    searchAgreements = new SearchAgreementsService(page);
    extractAgreementsList = new ExtractAgreementsListService(page);
    openAgreement = new OpenAgreementService(page);
    extractJustification = new ExtractJustificationService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to extract justification', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    expect(agreements.length).toBeGreaterThanOrEqual(1);

    const [{ agreement_id }] = agreements;

    await openAgreement.execute({ agreement_id });

    const justification = await extractJustification.execute();

    expect(justification).toHaveProperty('characterization');
    expect(justification).toHaveProperty('target_audience');
    expect(justification).toHaveProperty('solve_problem');
    expect(justification).toHaveProperty('expected_results');
    expect(justification).toHaveProperty('relationship');
    expect(justification).toHaveProperty('categories');
    expect(justification).toHaveProperty('agreement_object');
    expect(justification).toHaveProperty('technical_managerial_capacity');
  });

  it('should not be able to extract justification when page is not an opened agreement', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    await expect(extractJustification.execute()).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should not be able to extract justification when opened opened agreement does not have this section', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    expect(agreements.length).toBeGreaterThanOrEqual(1);

    const [{ agreement_id }] = agreements;

    await openAgreement.execute({ agreement_id });

    jest.spyOn(page, 'findElementsByText').mockImplementationOnce(async () => {
      return [];
    });

    const justification = await extractJustification.execute();

    expect(justification).toBeFalsy();
  });
});
