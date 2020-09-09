import IMainData from '../models/main/IMainData';

export default interface IDataPage {
  getMainData(): Promise<IMainData>;
}
