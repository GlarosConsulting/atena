import IExecutors from '../models/IExecutors';
import IJustification from '../models/IJustification';
import IMainData from '../models/IMainData';

export default interface IDataPage {
  getMainData(): Promise<IMainData>;
  getExecutors(): Promise<IExecutors>;
  getJustification(): Promise<IJustification>;
}
