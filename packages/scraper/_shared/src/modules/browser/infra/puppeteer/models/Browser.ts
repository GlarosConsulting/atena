import puppeteer from 'puppeteer';

import IGoToOptionsDTO from '@scraper/shared/modules/browser/dtos/IGoToOptionsDTO';
import IBrowser, {
  PageHandler,
} from '@scraper/shared/modules/browser/models/IBrowser';

import Page from './Page';

class Browser implements IBrowser<puppeteer.Browser, Page> {
  constructor(public driver: puppeteer.Browser) {}

  public async newPage(): Promise<Page> {
    const page = await this.driver.newPage();

    await page.setViewport({
      width: 1366,
      height: 768,
    });

    return new Page(page);
  }

  public async newPageAndGoTo(
    url: string,
    options?: IGoToOptionsDTO,
  ): Promise<puppeteer.Response | null> {
    const page = await this.newPage();

    await page.driver.setViewport({
      width: 1366,
      height: 768,
    });

    return page.goTo(url, options);
  }

  public async run(page: Page, ...handlers: PageHandler[]): Promise<void> {
    for (const handler of handlers) {
      await handler(this, page);
    }
  }

  public async close(): Promise<void> {
    await this.driver.close();
  }
}

export default Browser;
