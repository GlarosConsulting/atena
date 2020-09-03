import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import { IHandler } from '@scraper/shared/modules/browser/models/IBrowser';

import mainHandler from './main.handler';
import participantsHandler from './participants.handler';
import programsHandler from './programs.handler';

class RegisterHandler implements IHandler {
  public async handle(browser: Browser, page: Page): Promise<void> {
    await browser.run(page, mainHandler, programsHandler, participantsHandler);
  }
}

export default RegisterHandler;
