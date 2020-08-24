import { container } from 'tsyringe';

import IExecutors from '@modules/proposal_data/models/IExecutors';
import IJustification from '@modules/proposal_data/models/IJustification';
import IMainData from '@modules/proposal_data/models/IMainData';
import IDataPage from '@modules/proposal_data/pages/IDataPage';
import ExtractExecutorsService from '@modules/proposal_data/services/ExtractExecutorsService';
import ExtractJustificationService from '@modules/proposal_data/services/ExtractJustificationService';
import ExtractMainDataService from '@modules/proposal_data/services/ExtractMainDataService';

class DataPage implements IDataPage {
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
}

export default DataPage;
