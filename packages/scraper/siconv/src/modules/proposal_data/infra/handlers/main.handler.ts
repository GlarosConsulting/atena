import { PageHandler } from '@scraper/shared/modules/browser/models/IBrowser';

import DataPage from '../puppeteer/pages/DataPage';

const handle: PageHandler = async (): Promise<void> => {
  const dataPage = new DataPage();

  const main_data = await dataPage.getMainData();
  const executors = await dataPage.getExecutors();
  const justification = await dataPage.getJustification();

  console.log('proposal', {
    main_data,
    executors,
    justification,
  });
};

export default handle;
