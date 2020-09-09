import ISiconvPage from '@shared/pages/ISiconvPage';

import IProgram from '@modules/proposal_data/models/programs/IProgram';

export default interface IProgramsPage extends ISiconvPage {
  getAll(): Promise<IProgram[]>;
}
