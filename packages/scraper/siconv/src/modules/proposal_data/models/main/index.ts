import IBankData from './IBankData';
import IDates from './IDates';
import IExecutors from './IExecutors';
import IJustification from './IJustification';
import IMainData from './IMainData';
import IValues from './IValues';

export default interface IMain {
  main_data: IMainData;
  executors: IExecutors;
  justification: IJustification;
  bankData: IBankData;
  dates: IDates;
  values: IValues;
}
