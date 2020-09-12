import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

@injectable()
export default class NavigateToExecutionProcessesPageService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    const title = await this.page.driver.title();

    if (title !== 'Listar Ajuste Plano Trabalho') {
      throw new AppError('You should be on covenant execution page.');
    }

    const findProcessoDeExecucaoSubmenus = await this.page.findElementsByText(
      'Processo de Execução',
      'a/div/span/span',
    );

    if (findProcessoDeExecucaoSubmenus.length === 0) {
      throw new AppError(
        'It was not able to navigate to execution processes page.',
      );
    }

    await this.page.clickForNavigate(findProcessoDeExecucaoSubmenus[0]);
  }
}
