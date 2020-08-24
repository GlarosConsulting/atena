import puppeteer from 'puppeteer';

import IGoToOptionsDTO from '../dtos/IGoToOptionsDTO';
import IPage from './IPage';

export type PageHandler = (
  browser: IBrowser<any, any>,
  page: IPage<any>,
) => Promise<void>;

export default interface IBrowser<Browser, Page extends IPage<any>> {
  driver: Browser;

  newPage(): Promise<Page>;

  newPageAndGoTo(
    url: string,
    options?: IGoToOptionsDTO,
  ): Promise<puppeteer.Response | null>;

  run(page: IPage<any>, ...handlers: PageHandler[]): Promise<void>;

  close(): Promise<void>;
}
