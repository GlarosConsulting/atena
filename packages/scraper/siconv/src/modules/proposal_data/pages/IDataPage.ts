import IBankData from '../models/IBankData';
import IDates from '../models/IDates';
import IExecutors from '../models/IExecutors';
import IJustification from '../models/IJustification';
import IMainData from '../models/IMainData';

export default interface IDataPage {
  getMainData(): Promise<IMainData>;
  getExecutors(): Promise<IExecutors>;
  getJustification(): Promise<IJustification>;
  getBankData(): Promise<IBankData>;
  getDates(): Promise<IDates>;
}
