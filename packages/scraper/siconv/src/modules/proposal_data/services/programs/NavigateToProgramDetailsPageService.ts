import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

interface IRequest {
  program_id: string;
}

@injectable()
export default class NavigateToProgramDetailsPageService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute({ program_id }: IRequest): Promise<void> {
    const title = await this.page.driver.title();

    if (title !== 'Programas da Proposta') {
      throw new AppError("You should be on agreement's programs page.");
    }

    const [
      findProgramDetailsButtonElement,
    ] = await this.page.findElementsByText(
      program_id,
      'tbody[@id="tbodyrow"]//div[@class="codigo"]',
      '/../../td[5]/nobr/a',
    );

    if (!findProgramDetailsButtonElement) {
      throw new AppError('It was not able to find program id element.');
    }

    await this.page.clickForNavigate(findProgramDetailsButtonElement);
  }
}
