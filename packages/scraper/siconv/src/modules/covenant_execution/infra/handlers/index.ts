import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import { IHandler } from '@scraper/shared/modules/browser/models/IBrowser';

import CovenantExecutionPage from '../puppeteer/pages/CovenantExecutionPage';
import ExecutionProcessesHandler from './ExecutionProcessesHandler';

class CovenantExecutionHandler implements IHandler {
  public async handle(browser: Browser, page: Page): Promise<void> {
    const covenantExecutionPage = new CovenantExecutionPage();

    await covenantExecutionPage.navigateTo();

    await browser.run(page, ExecutionProcessesHandler);
  }
}

export default CovenantExecutionHandler;
