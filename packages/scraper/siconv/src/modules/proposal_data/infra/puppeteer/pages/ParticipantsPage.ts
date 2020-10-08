import { container } from 'tsyringe';

import IMainParticipants from '@modules/proposal_data/models/participants/IMainParticipants';
import IParticipantsPage from '@modules/proposal_data/pages/IParticipantsPage';
import ExtractMainParticipantsService from '@modules/proposal_data/services/participants/ExtractMainParticipantsService';
import NavigateToParticipantsPageService from '@modules/proposal_data/services/participants/NavigateToParticipantsPageService';

class ParticipantsPage implements IParticipantsPage {
  public async navigateTo(): Promise<void> {
    const navigateToParticipantsPage = container.resolve(
      NavigateToParticipantsPageService,
    );

    await navigateToParticipantsPage.execute();
  }

  public async getMainParticipants(): Promise<IMainParticipants> {
    const extractMainParticipants = container.resolve(
      ExtractMainParticipantsService,
    );

    const participants = extractMainParticipants.execute();

    return participants;
  }
}

export default ParticipantsPage;
