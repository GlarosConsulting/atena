import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import { IHandler } from '@scraper/shared/modules/browser/models/IBrowser';

class BackToMainHandler implements IHandler {
  public async handle(_browser: Browser, page: Page): Promise<void> {
    let title = await page.driver.title();

    while (title !== 'Detalhar Proposta') {
      await page.driver.goBack();

      title = await page.driver.title();
    }
  }
}

export default BackToMainHandler;
