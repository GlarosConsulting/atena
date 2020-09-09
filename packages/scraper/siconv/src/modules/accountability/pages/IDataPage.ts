import ISiconvPage from '@shared/pages/ISiconvPage';

import IMainData from '../models/main/IMainData';

export default interface IDataPage extends ISiconvPage {
  getMainData(): Promise<IMainData>;
}
