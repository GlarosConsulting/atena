import IProgram from '@modules/proposal_data/models/programs/IProgram';

import ISiconvPage from '@shared/pages/ISiconvPage';

export default interface IProgramsPage extends ISiconvPage {
  getAll(): Promise<IProgram[]>;
}
