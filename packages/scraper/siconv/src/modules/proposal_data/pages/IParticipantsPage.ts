import ISiconvPage from '@shared/pages/ISiconvPage';

import IMainParticipants from '@modules/proposal_data/models/participants/IMainParticipants';

export default interface IParticipantsPage extends ISiconvPage {
  getMainParticipants(): Promise<IMainParticipants>;
}
