import merge from 'lodash/merge';
import { injectable, inject } from 'tsyringe';
import { PartialDeep } from 'type-fest';

import { IHandler } from '@scraper/shared/modules/browser/models/IBrowser';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAgreement from '@shared/models/IAgreement';

import IExecutionProcesses from '@modules/covenant_execution/models/execution_processes';

import ExecutionProcessesPage from '../puppeteer/pages/ExecutionProcessesPage';

@injectable()
class ExecutionProcessesHandler implements IHandler {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async handle(): Promise<void> {
    const executionProcessesPage = new ExecutionProcessesPage();

    await executionProcessesPage.navigateTo();

    const execution_processes_list = await executionProcessesPage.getAll();

    const data: IExecutionProcesses = {
      execution_processes_list,
    };

    const agreement = await this.cacheProvider.recover<IAgreement>('agreement');

    if (!agreement) return;

    merge(agreement, {
      data: {
        covenant_execution: {
          execution_process: data,
        },
      },
    } as PartialDeep<IAgreement>);

    await this.cacheProvider.save('agreement', agreement);
  }
}

export default ExecutionProcessesHandler;
