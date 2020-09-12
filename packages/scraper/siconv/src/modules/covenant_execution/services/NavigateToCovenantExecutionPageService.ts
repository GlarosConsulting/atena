import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

@injectable()
export default class NavigateToCovenantExecutionPageService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    const title = await this.page.driver.title();

    if (title !== 'Detalhar Proposta') {
      throw new AppError('You should be on opened agreement page.');
    }

    const findExecucaoConvenenteMenus = await this.page.findElementsByText(
      'Execução Convenente',
      'a/div[@class="masterTabInactive"]/span/span',
    );

    if (findExecucaoConvenenteMenus.length === 0) {
      throw new AppError(
        'It was not able to navigate to covenant execution page.',
      );
    }

    await findExecucaoConvenenteMenus[0].click();

    const findAjustesDoPTSubmenus = await this.page.findElementsBySelector(
      '#menu_link_-481524888_-1293190284 > div > span > span',
    );

    if (findAjustesDoPTSubmenus.length === 0) {
      throw new AppError('It was not able to navigate to PT adjustments page.');
    }

    await this.page.clickForNavigate(findAjustesDoPTSubmenus[0]);
  }
}
