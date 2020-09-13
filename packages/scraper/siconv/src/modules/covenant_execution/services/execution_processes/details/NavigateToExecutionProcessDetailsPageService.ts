import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

interface IRequest {
  execution_process_id: string;
}

@injectable()
export default class NavigateToExecutionProcessDetailsPageService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute({ execution_process_id }: IRequest): Promise<void> {
    const title = await this.page.driver.title();

    if (title !== 'Listar Licitacoes') {
      throw new AppError(
        "You should be on agreement covenant execution's execution processes.",
      );
    }

    let [
      findExecutionProcessDetailsButtonElement,
    ] = await this.page.findElementsByText(
      execution_process_id,
      'tbody[@id="tbodyrow"]//div[@class="numeroLicitacao"]',
      '/../../td[8]/nobr/a',
    );

    if (!findExecutionProcessDetailsButtonElement) {
      const [
        nextFindExecutionProcessDetailsButtonElement,
      ] = await this.page.findElementsByText(
        execution_process_id,
        'tbody[@id="tbodyrow"]//div[@class="numeroLicitacao"]',
        '/../../td[9]/nobr/a',
      );

      if (!nextFindExecutionProcessDetailsButtonElement) {
        throw new AppError(
          'It was not able to find execution process details button element.',
        );
      }

      findExecutionProcessDetailsButtonElement = nextFindExecutionProcessDetailsButtonElement;
    }

    await this.page.clickForNavigate(findExecutionProcessDetailsButtonElement);
  }
}
