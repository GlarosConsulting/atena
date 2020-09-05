import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

@injectable()
export default class ExtractPageCountService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<number> {
    const title = await this.page.driver.title();

    if (title !== 'Resultado da Consulta de Convênio') {
      throw new AppError('You should be on agreements list page.');
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const listInfoText = await this.page.evaluate(() => {
      return getTextBySelector('#listaResultado > span:nth-child(1)');
    });

    let totalPages = 0;

    if (listInfoText) {
      const splitListInfoText = listInfoText.split(' ');

      totalPages = Number(splitListInfoText[3]);
    }

    return totalPages;
  }
}
