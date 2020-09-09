import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import { IHandler } from '@scraper/shared/modules/browser/models/IBrowser';

import MainHandler from './MainHandler';

class AccountabilityHandler implements IHandler {
  public async handle(browser: Browser, page: Page): Promise<void> {
    await browser.run(page, MainHandler);
  }
}

export default AccountabilityHandler;
