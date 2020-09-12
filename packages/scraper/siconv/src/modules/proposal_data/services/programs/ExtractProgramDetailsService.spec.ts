import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import ExtractAgreementsListService from '@modules/agreements_list/services/ExtractAgreementsListService';
import OpenAgreementByIdService from '@modules/agreements_list/services/OpenAgreementByIdService';
import { By } from '@modules/search/dtos/ISearchDTO';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

import ExtractProgramDetailsService from './ExtractProgramDetailsService';
import ExtractProgramsListService from './ExtractProgramsListService';
import NavigateToProgramDetailsPageService from './NavigateToProgramDetailsPageService';
import NavigateToProgramsPageService from './NavigateToProgramsPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractAgreementsList: ExtractAgreementsListService;
let openAgreementById: OpenAgreementByIdService;
let navigateToProgramsPage: NavigateToProgramsPageService;
let extractProgramsList: ExtractProgramsListService;
let navigateToProgramDetailsPage: NavigateToProgramDetailsPageService;
let extractProgramDetails: ExtractProgramDetailsService;

let browser: Browser;
let page: Page;

describe('ExtractProgramDetails', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    searchAgreements = new SearchAgreementsService(page);
    extractAgreementsList = new ExtractAgreementsListService(page);
    openAgreementById = new OpenAgreementByIdService(page);
    navigateToProgramsPage = new NavigateToProgramsPageService(page);
    extractProgramsList = new ExtractProgramsListService(page);
    navigateToProgramDetailsPage = new NavigateToProgramDetailsPageService(
      page,
    );
    extractProgramDetails = new ExtractProgramDetailsService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to extract program details', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreementById.execute({ agreement_id });

    await navigateToProgramsPage.execute();

    const [{ program_id }] = await extractProgramsList.execute();

    await navigateToProgramDetailsPage.execute({ program_id });

    const details = await extractProgramDetails.execute();

    expect(details).toEqual(
      expect.objectContaining({
        program_id: expect.any(String),
        program_name: expect.any(String),
        investment_items: expect.any(String),
        counterpart_rule: expect.any(String),
        values: {
          investment_items_global_value: expect.any(Number),
          counterpart_values: {
            total_value: expect.any(Number),
            financial_value: expect.any(Number),
            assets_services_value: expect.any(Number),
          },
          transfer_values: {
            total_value: expect.any(Number),
            amendment_value: expect.any(String),
          },
        },
      }),
    );
  });

  it('should not be able to extract program details outside program details page', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreementById.execute({ agreement_id });

    await expect(extractProgramDetails.execute()).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
