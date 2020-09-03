import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import { By } from '@modules/search/dtos/ISearchDTO';
import ExtractAgreementsListService from '@modules/search/services/ExtractAgreementsListService';
import OpenAgreementService from '@modules/search/services/OpenAgreementService';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

import ExtractProgramsListService from './ExtractProgramsListService';
import NavigateToProgramsPageService from './NavigateToProgramsPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractAgreementsList: ExtractAgreementsListService;
let openAgreement: OpenAgreementService;
let navigateToProgramsPage: NavigateToProgramsPageService;
let extractProgramsList: ExtractProgramsListService;

let browser: Browser;
let page: Page;

describe('ExtractProgramsList', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    searchAgreements = new SearchAgreementsService(page);
    extractAgreementsList = new ExtractAgreementsListService(page);
    openAgreement = new OpenAgreementService(page);
    navigateToProgramsPage = new NavigateToProgramsPageService(page);
    extractProgramsList = new ExtractProgramsListService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to extract programs list', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreement.execute({ agreement_id });

    await navigateToProgramsPage.execute();

    const programs = await extractProgramsList.execute();

    expect(programs).toContainEqual(
      expect.objectContaining({
        program_id: expect.any(String),
        name: expect.any(String),
        investment_global_value: expect.any(Number),
      }),
    );
  });

  it('should not be able to extract programs list outside programs page', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreement.execute({ agreement_id });

    await expect(extractProgramsList.execute()).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
