import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@scraper/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import ExtractAgreementsListService from '@modules/agreements_list/services/ExtractAgreementsListService';
import OpenAgreementByIdService from '@modules/agreements_list/services/OpenAgreementByIdService';
import { By } from '@modules/search/dtos/ISearchDTO';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

import NavigateToAccountabilityPageService from './NavigateToAccountabilityPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let searchAgreements: SearchAgreementsService;
let extractAgreementsList: ExtractAgreementsListService;
let openAgreementById: OpenAgreementByIdService;
let navigateToAccountabilityPage: NavigateToAccountabilityPageService;

let browser: Browser;
let page: Page;

describe('NavigateToAccountabilityPage', () => {
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
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to navigate to accountability page', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreementById.execute({ agreement_id });

    await navigateToAccountabilityPage.execute();

    await expect(page.driver.title()).resolves.toEqual('Plataforma +Brasil');
  });

  it('should not be able to navigate to accountability page when page is not an opened agreement', async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    await expect(navigateToAccountabilityPage.execute()).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it("should not be able to navigate to accountability page when not able to find 'Prestação de Contas' menu", async () => {
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

    await expect(navigateToAccountabilityPage.execute()).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it("should not be able to navigate to accountability page when not able to find 'Prestação de Contas' submenu", async () => {
    await searchAgreements.execute({
      by: By.CNPJ,
      value: '12.198.693/0001-58',
    });

    const agreements = await extractAgreementsList.execute();

    const [{ agreement_id }] = agreements;

    await openAgreementById.execute({ agreement_id });

    jest
      .spyOn(page, 'findElementsByText')
      .mockImplementationOnce(async () => {
        const someAnchorElements = await page.findElementsBySelector('a');

        return someAnchorElements;
      })
      .mockImplementationOnce(async () => []);

    await expect(navigateToAccountabilityPage.execute()).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
