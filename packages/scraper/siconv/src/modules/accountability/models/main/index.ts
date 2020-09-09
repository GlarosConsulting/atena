import IDates from './IDates';
import IMainData from './IMainData';
import IValues from './IValues';

export default interface IMain {
  main_data: IMainData;
  dates: IDates;
  values: IValues;
}
