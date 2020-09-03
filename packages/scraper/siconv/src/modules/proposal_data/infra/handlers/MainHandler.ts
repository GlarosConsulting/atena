import { IHandler } from '@scraper/shared/modules/browser/models/IBrowser';

import DataPage from '../puppeteer/pages/DataPage';

class MainHandler implements IHandler {
  public async handle(): Promise<void> {
    const dataPage = new DataPage();

    const main_data = await dataPage.getMainData();
    const executors = await dataPage.getExecutors();
    const justification = await dataPage.getJustification();
    const bankData = await dataPage.getBankData();
    const dates = await dataPage.getDates();

    console.log('proposal', {
      main_data,
      executors,
      justification,
      bankData,
      dates,
    });
  }
}

export default MainHandler;
