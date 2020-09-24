import AppError from '@scraper/shared/errors/AppError';
import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import { IHandler } from '@scraper/shared/modules/browser/models/IBrowser';

class GoBackFromAgreementHandler implements IHandler {
  public async handle(_browser: Browser, page: Page): Promise<void> {
    const findBackButtonElements = await page.findElementsBySelector(
      'td.FormLinhaBotoes input[value="Voltar"]',
    );

    if (findBackButtonElements.length === 0) {
      throw new AppError(
        'It was not possible to back to agreements list, not able find back button.',
      );
    }

    await page.clickForNavigate(findBackButtonElements[0]);
  }
}

export default GoBackFromAgreementHandler;
