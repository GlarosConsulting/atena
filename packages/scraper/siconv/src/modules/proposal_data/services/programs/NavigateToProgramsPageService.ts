import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

@injectable()
export default class NavigateToProgramsPageService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    const title = await this.page.driver.title();

    if (title !== 'Detalhar Proposta') {
      throw new AppError('You should be on opened agreement page.');
    }

    const findProgramasSubmenus = await this.page.findElementsByText(
      'Programas',
      'a/div/span/span',
    );

    if (findProgramasSubmenus.length === 0) {
      throw new AppError('It was not able to navigate to programs page.');
    }

    await this.page.clickForNavigate(findProgramasSubmenus[0]);
  }
}
