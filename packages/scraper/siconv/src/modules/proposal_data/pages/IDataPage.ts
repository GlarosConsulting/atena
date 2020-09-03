import IPuppeteerPage from '@shared/puppeteer/pages/IPuppeteerPage';

import IBankData from '../models/main/IBankData';
import IDates from '../models/main/IDates';
import IExecutors from '../models/main/IExecutors';
import IJustification from '../models/main/IJustification';
import IMainData from '../models/main/IMainData';

export default interface IDataPage extends IPuppeteerPage {
  getMainData(): Promise<IMainData>;
  getExecutors(): Promise<IExecutors>;
  getJustification(): Promise<IJustification>;
  getBankData(): Promise<IBankData>;
  getDates(): Promise<IDates>;
}
