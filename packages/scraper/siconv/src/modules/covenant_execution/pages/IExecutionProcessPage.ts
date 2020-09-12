import ISiconvPage from '@shared/pages/ISiconvPage';

import IExecutionProcess from '../models/execution_processes/IExecutionProcess';

export default interface IExecutionProcessPage extends ISiconvPage {
  getAll(): Promise<IExecutionProcess[]>;
}
