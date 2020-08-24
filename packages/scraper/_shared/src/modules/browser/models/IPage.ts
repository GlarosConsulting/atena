import puppeteer from 'puppeteer';

import IGoToOptionsDTO from '@scraper/shared/modules/browser/dtos/IGoToOptionsDTO';

export default interface IPage<Page> {
  driver: Page;

  goTo(
    url: string,
    options?: IGoToOptionsDTO,
  ): Promise<puppeteer.Response | null>;
  select(selector: string, ...values: string[]): Promise<string[]>;
  type(
    selector: string,
    text: string,
    options?: { delay: number },
  ): Promise<void>;
  findElementsByText(
    str: string,
    elementTag?: string,
  ): Promise<puppeteer.ElementHandle[]>;
  clickForNavigate(element: puppeteer.ElementHandle<Element>): Promise<void>;
}
