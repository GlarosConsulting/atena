import { IHandler } from '@scraper/shared/modules/browser/models/IBrowser';

import ProgramsPage from '@modules/proposal_data/infra/puppeteer/pages/ProgramsPage';

class ProgramsHandler implements IHandler {
  public async handle(): Promise<void> {
    const programsPage = new ProgramsPage();

    await programsPage.navigateTo();

    const data = await programsPage.getAll();

    console.log('programs', {
      data,
    });
  }
}

export default ProgramsHandler;
