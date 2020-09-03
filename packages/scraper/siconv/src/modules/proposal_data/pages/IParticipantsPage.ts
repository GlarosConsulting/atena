import IPuppeteerPage from '@shared/puppeteer/pages/IPuppeteerPage';

import IMainParticipants from '@modules/proposal_data/models/participants/IMainParticipants';

export default interface IParticipantsPage extends IPuppeteerPage {
  getMainParticipants(): Promise<IMainParticipants>;
}
