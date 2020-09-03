import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

@injectable()
export default class NavigateToParticipantsPageService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    const title = await this.page.driver.title();

    if (title !== 'Detalhar Proposta') {
      throw new AppError('You should be on an opened agreement page.');
    }

    const findParticipantesSubmenus = await this.page.findElementsByText(
      'Participantes',
      'a/div/span/span',
    );

    if (findParticipantesSubmenus.length === 0) {
      throw new AppError("It was not able to navigate to 'Participants Page'.");
    }

    await this.page.clickForNavigate(findParticipantesSubmenus[0]);
  }
}
