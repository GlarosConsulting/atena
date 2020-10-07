import DataPage from '@modules/accountability/infra/puppeteer/pages/DataPage';
import IMain from '@modules/accountability/models/main';
import merge from 'lodash/merge';
import { injectable, inject } from 'tsyringe';
import { PartialDeep } from 'type-fest';

import { IHandler } from '@scraper/shared/modules/browser/models/IBrowser';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAgreement from '@shared/models/IAgreement';

@injectable()
class MainHandler implements IHandler {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async handle(): Promise<void> {
    const dataPage = new DataPage();

    const main_data = await dataPage.getMainData();
    const dates = await dataPage.getDates();
    const values = await dataPage.getValues();

    const data: IMain = {
      main_data,
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
        accountability: {
          main: data,
        },
      },
    } as PartialDeep<IAgreement>);

    await this.cacheProvider.save('agreement', agreement, true);
  }
}

export default MainHandler;
