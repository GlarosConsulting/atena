import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

interface IResponse {
  current_page: number;
  total_pages: number;
}

@injectable()
export default class ExtractListInfoService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IResponse> {
    const title = await this.page.driver.title();

    if (title !== 'Resultado da Consulta de Convênio') {
      throw new AppError('You should be on agreements list page.');
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const listInfoText = await this.page.evaluate(() =>
      getTextBySelector('#listaResultado > span:nth-child(1)'),
    );

    let current_page = 0;
    let total_pages = 0;

    if (listInfoText) {
      const splitListInfoText = listInfoText.split(' ');

      total_pages = Number(splitListInfoText[3]);
      current_page = Number(splitListInfoText[1]);
    }

    return {
      current_page,
      total_pages,
    };
  }
}
