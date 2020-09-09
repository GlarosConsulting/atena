import IMainData from '@modules/accountability/models/main/IMainData';
import IDataPage from '@modules/accountability/pages/IDataPage';

class DataPage implements IDataPage {
  public async getMainData(): Promise<IMainData> {
    return {
      uf: 'MG',
    };
  }
}

export default DataPage;
