import { container } from 'tsyringe';

import IMainData from '@modules/accountability/models/main/IMainData';
import IDataPage from '@modules/accountability/pages/IDataPage';
import NavigateToAccountabilityPageService from '@modules/accountability/services/NavigateToAccountabilityPageService';

class DataPage implements IDataPage {
  public async navigateTo(): Promise<void> {
    const navigateToAccountabilityPage = container.resolve(
      NavigateToAccountabilityPageService,
    );

    await navigateToAccountabilityPage.execute();
  }

  public async getMainData(): Promise<IMainData> {
    return {
      uf: 'MG',
    };
  }
}

export default DataPage;
