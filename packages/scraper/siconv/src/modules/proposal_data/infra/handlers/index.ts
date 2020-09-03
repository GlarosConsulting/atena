import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import { IHandler } from '@scraper/shared/modules/browser/models/IBrowser';

import MainHandler from './MainHandler';
import ParticipantsHandler from './ParticipantsHandler';
import ProgramsHandler from './ProgramsHandler';

class ProposalDataHandler implements IHandler {
  public async handle(browser: Browser, page: Page): Promise<void> {
    await browser.run(page, MainHandler, ProgramsHandler, ParticipantsHandler);
  }
}

export default ProposalDataHandler;
