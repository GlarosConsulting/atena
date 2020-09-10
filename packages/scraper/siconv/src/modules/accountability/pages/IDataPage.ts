import ISiconvPage from '@shared/pages/ISiconvPage';

import IDates from '../models/main/IDates';
import IMainData from '../models/main/IMainData';
import IValues from '../models/main/IValues';

export default interface IDataPage extends ISiconvPage {
  getMainData(): Promise<IMainData>;
  getDates(): Promise<IDates>;
  getValues(): Promise<IValues>;
}
