import IBankData from './main/IBankData';
import IDates from './main/IDates';
import IExecutors from './main/IExecutors';
import IJustification from './main/IJustification';
import IMainData from './main/IMainData';

export default interface IMain {
  main_data: IMainData;
  executors: IExecutors;
  justification: IJustification;
  bankData: IBankData;
  dates: IDates;
}
