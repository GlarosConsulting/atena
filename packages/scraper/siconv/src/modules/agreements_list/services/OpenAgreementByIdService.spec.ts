import { By } from '@modules/search/dtos/ISearchDTO';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import ExtractAgreementsListService from './ExtractAgreementsListService';
import OpenAgreementByIdService from './OpenAgreementByIdService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractAgreementsList: ExtractAgreementsListService;
let openAgreementById: OpenAgreementByIdService;

let browser: Browser;
let page: Page;

describe('OpenAgreementById', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    searchAgreements = new SearchAgreementsService(page);
    extractAgreementsList = new ExtractAgreementsListService(page);
    openAgreementById = new OpenAgreementByIdService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to open agreement by id', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    expect(agreements.length).toBeGreaterThanOrEqual(1);

    const [{ agreement_id }] = agreements;

    await openAgreementById.execute({ agreement_id });

    await expect(page.driver.title()).resolves.toEqual('Detalhar Proposta');
    await expect(
      page.findElementsByText('Dados da Proposta', 'span'),
    ).resolves.toBeTruthy();
  });

  it('should not be able to open agreement by id outside agreements list page', async () => {
    await expect(
      openAgreementById.execute({ agreement_id: 'any-agreement' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to open agreement by id when agreements list is empty', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '27.957.062/0001-42',
    });

    await expect(
      openAgreementById.execute({ agreement_id: 'any-agreement' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
