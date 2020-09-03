import { IHandler } from '@scraper/shared/modules/browser/models/IBrowser';

import ParticipantsPage from '@modules/proposal_data/infra/puppeteer/pages/ParticipantsPage';

class ParticipantsHandler implements IHandler {
  public async handle(): Promise<void> {
    const participantsPage = new ParticipantsPage();

    await participantsPage.navigateTo();

    const main_participants = await participantsPage.getMainParticipants();

    console.log('participants', {
      main_participants,
    });
  }
}

export default ParticipantsHandler;
