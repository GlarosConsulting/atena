import ISiconvPage from '@shared/pages/ISiconvPage';

import IBankData from '../models/main/IBankData';
import IDates from '../models/main/IDates';
import IExecutors from '../models/main/IExecutors';
import IJustification from '../models/main/IJustification';
import IMainData from '../models/main/IMainData';
import IValues from '../models/main/IValues';

export default interface IDataPage extends ISiconvPage {
  getMainData(): Promise<IMainData>;
  getExecutors(): Promise<IExecutors>;
  getJustification(): Promise<IJustification>;
  getBankData(): Promise<IBankData>;
  getDates(): Promise<IDates>;
  getValues(): Promise<IValues>;
}
