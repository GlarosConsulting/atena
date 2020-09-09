import { container } from 'tsyringe';

import IMainData from '@modules/accountability/models/main/IMainData';
import IDataPage from '@modules/accountability/pages/IDataPage';
import ExtractMainDataService from '@modules/accountability/services/main/ExtractMainDataService';
import NavigateToAccountabilityPageService from '@modules/accountability/services/NavigateToAccountabilityPageService';

class DataPage implements IDataPage {
  public async navigateTo(): Promise<void> {
    const navigateToAccountabilityPage = container.resolve(
      NavigateToAccountabilityPageService,
    );

    await navigateToAccountabilityPage.execute();
  }

  public async getMainData(): Promise<IMainData> {
    const extractMainData = container.resolve(ExtractMainDataService);

    const mainData = await extractMainData.execute();

    return mainData;
  }
}

export default DataPage;
