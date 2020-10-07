import IMainParticipants from '@modules/proposal_data/models/participants/IMainParticipants';

import ISiconvPage from '@shared/pages/ISiconvPage';

export default interface IParticipantsPage extends ISiconvPage {
  getMainParticipants(): Promise<IMainParticipants>;
}
