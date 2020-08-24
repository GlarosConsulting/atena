import Browser from '@scraper/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import { PageHandler } from '@scraper/shared/modules/browser/models/IBrowser';

import mainHandler from './main.handler';

const register: PageHandler = async (
  browser: Browser,
  page: Page,
): Promise<void> => {
  browser.run(page, mainHandler);
};

export default register;
