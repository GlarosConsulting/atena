import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

@injectable()
export default class GoBackFromExecutionProcessDetailsService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    const title = await this.page.driver.title();

    if (title !== 'Detalha Licitacao') {
      throw new AppError('You should be on execution process details page.');
    }

    const [findGoBackButtonElement] = await this.page.findElementsBySelector(
      '#form_submit[value="Voltar"]',
    );

    if (!findGoBackButtonElement) {
      throw new AppError('It was not able to find go back button element.');
    }

    await this.page.clickForNavigate(findGoBackButtonElement);
  }
}
