import IDates from '@modules/accountability/models/main/IDates';
import IMainData from '@modules/accountability/models/main/IMainData';
import IValues from '@modules/accountability/models/main/IValues';
import IDataPage from '@modules/accountability/pages/IDataPage';
import ExtractDatesService from '@modules/accountability/services/main/ExtractDatesService';
import ExtractMainDataService from '@modules/accountability/services/main/ExtractMainDataService';
import ExtractValuesService from '@modules/accountability/services/main/ExtractValuesService';
import NavigateToAccountabilityPageService from '@modules/accountability/services/NavigateToAccountabilityPageService';
import { container } from 'tsyringe';

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

  public async getDates(): Promise<IDates> {
    const extractDates = container.resolve(ExtractDatesService);

    const dates = await extractDates.execute();

    return dates;
  }

  public async getValues(): Promise<IValues> {
    const extractValues = container.resolve(ExtractValuesService);

    const values = await extractValues.execute();

    return values;
  }
}

export default DataPage;
