import IPuppeteerPage from '@shared/puppeteer/pages/IPuppeteerPage';

import IProgram from '@modules/proposal_data/models/programs/IProgram';

export default interface IProgramsPage extends IPuppeteerPage {
  getAll(): Promise<IProgram[]>;
}
