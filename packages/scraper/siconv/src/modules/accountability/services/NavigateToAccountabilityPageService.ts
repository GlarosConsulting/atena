import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

@injectable()
export default class NavigateToAccountabilityPageService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    const title = await this.page.driver.title();

    if (title !== 'Detalhar Proposta') {
      throw new AppError('You should be on an opened agreement page.');
    }

    const findPrestacaoDeContasMenus = await this.page.findElementsByText(
      'Prestação de Contas',
      'a/div[@class="masterTabInactive"]/span/span',
    );

    if (findPrestacaoDeContasMenus.length === 0) {
      throw new AppError('It was not able to navigate to accountability page.');
    }

    await findPrestacaoDeContasMenus[0].click();

    const findPrestacaoDeContasSubmenus = await this.page.findElementsByText(
      'Prestação de Contas',
      'a/div[@class="inactiveTab"]/span/span',
    );

    if (findPrestacaoDeContasSubmenus.length === 0) {
      throw new AppError('It was not able to navigate to accountability page.');
    }

    await this.page.clickForNavigate(findPrestacaoDeContasSubmenus[0]);
  }
}
