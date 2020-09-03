import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import { By } from '@modules/search/dtos/ISearchDTO';
import ExtractAgreementsListService from '@modules/search/services/ExtractAgreementsListService';
import OpenAgreementService from '@modules/search/services/OpenAgreementService';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

import ExtractMainParticipantsService from './ExtractMainParticipantsService';
import NavigateToParticipantsPageService from './NavigateToParticipantsPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractAgreementsList: ExtractAgreementsListService;
let openAgreement: OpenAgreementService;
let navigateToParticipantsPage: NavigateToParticipantsPageService;
let extractMainParticipants: ExtractMainParticipantsService;

let browser: Browser;
let page: Page;

describe('ExtractMainParticipants', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    searchAgreements = new SearchAgreementsService(page);
    extractAgreementsList = new ExtractAgreementsListService(page);
    openAgreement = new OpenAgreementService(page);
    navigateToParticipantsPage = new NavigateToParticipantsPageService(page);
    extractMainParticipants = new ExtractMainParticipantsService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to extract main participants', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreement.execute({ agreement_id });

    await navigateToParticipantsPage.execute();

    const participants = await extractMainParticipants.execute();

    expect(participants).toEqual({
      proponent: expect.any(String),
      responsible_proponent: expect.any(String),
      grantor: expect.any(String),
      responsible_grantor: expect.any(String),
    });
  });

  it('should not be able to extract main participants outside participants page', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreement.execute({ agreement_id });

    await expect(extractMainParticipants.execute()).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
