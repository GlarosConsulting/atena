import { container } from 'tsyringe';

import IBankData from '@modules/proposal_data/models/main/IBankData';
import IDates from '@modules/proposal_data/models/main/IDates';
import IExecutors from '@modules/proposal_data/models/main/IExecutors';
import IJustification from '@modules/proposal_data/models/main/IJustification';
import IMainData from '@modules/proposal_data/models/main/IMainData';
import IValues from '@modules/proposal_data/models/main/IValues';
import IDataPage from '@modules/proposal_data/pages/IDataPage';
import ExtractBankDataService from '@modules/proposal_data/services/main/ExtractBankDataService';
import ExtractDatesService from '@modules/proposal_data/services/main/ExtractDatesService';
import ExtractExecutorsService from '@modules/proposal_data/services/main/ExtractExecutorsService';
import ExtractJustificationService from '@modules/proposal_data/services/main/ExtractJustificationService';
import ExtractMainDataService from '@modules/proposal_data/services/main/ExtractMainDataService';
import ExtractValuesService from '@modules/proposal_data/services/main/ExtractValuesService';

class DataPage implements IDataPage {
  public async navigateTo(): Promise<void> {
    // when open agreement, this is the default page
  }

  public async getMainData(): Promise<IMainData> {
    const extractMainData = container.resolve(ExtractMainDataService);

    const mainData = await extractMainData.execute();

    return mainData;
  }

  public async getExecutors(): Promise<IExecutors> {
    const extractExecutors = container.resolve(ExtractExecutorsService);

    const executors = await extractExecutors.execute();

    return executors;
  }

  public async getJustification(): Promise<IJustification> {
    const extractJustification = container.resolve(ExtractJustificationService);

    const justification = await extractJustification.execute();

    return justification;
  }

  public async getBankData(): Promise<IBankData> {
    const extractBankData = container.resolve(ExtractBankDataService);

    const bankData = await extractBankData.execute();

    return bankData;
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
