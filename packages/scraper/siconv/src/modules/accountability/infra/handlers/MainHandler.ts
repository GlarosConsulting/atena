import merge from 'lodash/merge';
import { injectable, inject } from 'tsyringe';
import { PartialDeep } from 'type-fest';

import { IHandler } from '@scraper/shared/modules/browser/models/IBrowser';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAgreement from '@shared/models/IAgreement';

import DataPage from '@modules/accountability/infra/puppeteer/pages/DataPage';
import IMain from '@modules/accountability/models/main';

@injectable()
class MainHandler implements IHandler {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async handle(): Promise<void> {
    const dataPage = new DataPage();

    const main_data = await dataPage.getMainData();

    const data: IMain = {
      main_data,
      dates: {
        validity: {
          start_date: new Date(),
          end_date: new Date(),
        },
        limit_date: new Date(),
      },
      values: {
        agreement_total_value: 0,
        transfer_value: 0,
        counterpart_value: 0,
        income_value: 0,
      },
    };

    console.log('accountability', data);

    const agreement = await this.cacheProvider.recover<IAgreement>('agreement');

    if (!agreement) return;

    merge(agreement, {
      data: {
        accountability: {
          main: data,
        },
      },
    } as PartialDeep<IAgreement>);

    await this.cacheProvider.save('agreement', agreement);
  }
}

export default MainHandler;
