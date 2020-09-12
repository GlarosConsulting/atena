import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import ExtractListInfoService from '@modules/agreements_list/services/ExtractListInfoService';

interface IRequest {
  page: number;
}

@injectable()
export default class NavigateToPageService {
  private extractListInfo: ExtractListInfoService;

  constructor(
    @inject('Page')
    private page: Page,
  ) {
    this.extractListInfo = new ExtractListInfoService(page);
  }

  public async execute({ page }: IRequest): Promise<void> {
    const title = await this.page.driver.title();

    if (title !== 'Resultado da Consulta de Convênio') {
      throw new AppError('You should be on agreements list page.');
    }

    let listInfo = await this.extractListInfo.execute();

    if (page < 1) {
      throw new AppError('Not able to navigate to page less than one.');
    }

    if (page > listInfo.total_pages) {
      throw new AppError(
        'Not able to navigate to page greater than total pages.',
      );
    }

    const goToPreviousPagesList = async () => {
      const findPreviousPagesAnchorElements = await this.page.findElementsByText(
        'Ant',
        'span[@class="pagelinks"]/a',
      );

      if (findPreviousPagesAnchorElements.length === 0) {
        throw new AppError('It was not able to find previous page elements.');
      }

      await this.page.clickForNavigate(findPreviousPagesAnchorElements[0]);
    };

    const goToNextPagesList = async () => {
      const findNextPagesAnchorElements = await this.page.findElementsByText(
        'Próx',
        'span[@class="pagelinks"]/a',
      );

      if (findNextPagesAnchorElements.length === 0) {
        throw new AppError('It was not able to find previous page elements.');
      }

      await this.page.clickForNavigate(findNextPagesAnchorElements[0]);
    };

    let findPageAnchorElements = await this.page.findElementsByText(
      String(page),
      'span[@class="pagelinks"]/a',
    );

    while (findPageAnchorElements.length === 0) {
      listInfo = await this.extractListInfo.execute();

      if (page < listInfo.current_page) {
        await goToPreviousPagesList();
      } else if (page > listInfo.current_page) {
        await goToNextPagesList();
      } else {
        return;
      }

      findPageAnchorElements = await this.page.findElementsByText(
        String(page),
        'span[@class="pagelinks"]/a',
      );
    }

    await this.page.clickForNavigate(findPageAnchorElements[0]);
  }
}
