import merge from 'lodash/merge';
import { injectable, inject } from 'tsyringe';
import { PartialDeep } from 'type-fest';

import { IHandler } from '@scraper/shared/modules/browser/models/IBrowser';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAgreement from '@shared/models/IAgreement';

import ProgramsPage from '@modules/proposal_data/infra/puppeteer/pages/ProgramsPage';
import IPrograms from '@modules/proposal_data/models/programs';

@injectable()
class ProgramsHandler implements IHandler {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async handle(): Promise<void> {
    const programsPage = new ProgramsPage();

    await programsPage.navigateTo();

    const programs_list = await programsPage.getAll();

    const data: IPrograms = {
      programs_list,
    };

    const agreement = await this.cacheProvider.recover<IAgreement>('agreement');

    if (!agreement) return;

    merge(agreement, {
      data: {
        proposal_data: {
          programs: data,
        },
      },
    } as PartialDeep<IAgreement>);

    await this.cacheProvider.save('agreement', agreement);
  }
}

export default ProgramsHandler;
