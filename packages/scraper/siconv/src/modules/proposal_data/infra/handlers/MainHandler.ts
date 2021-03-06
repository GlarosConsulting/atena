import merge from 'lodash/merge';
import { injectable, inject } from 'tsyringe';
import { PartialDeep } from 'type-fest';

import { IHandler } from '@scraper/shared/modules/browser/models/IBrowser';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAgreement from '@shared/models/IAgreement';

import IMain from '@modules/proposal_data/models/main';

import DataPage from '../puppeteer/pages/DataPage';

@injectable()
class MainHandler implements IHandler {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async handle(): Promise<void> {
    const dataPage = new DataPage();

    const main_data = await dataPage.getMainData();
    const executors = await dataPage.getExecutors();
    const justification = await dataPage.getJustification();
    const bankData = await dataPage.getBankData();
    const dates = await dataPage.getDates();
    const values = await dataPage.getValues();

    const data: IMain = {
      main_data,
      executors,
      justification,
      bankData,
      dates,
      values,
    };

    const agreement = await this.cacheProvider.recover<IAgreement>(
      'agreement',
      true,
    );

    if (!agreement) return;

    merge(agreement, {
      data: {
        proposal_data: {
          main: data,
        },
      },
    } as PartialDeep<IAgreement>);

    await this.cacheProvider.save('agreement', agreement, true);
  }
}

export default MainHandler;
