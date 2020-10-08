import { container } from 'tsyringe';

import IExecutionProcess from '@modules/covenant_execution/models/execution_processes/IExecutionProcess';
import IExecutionProcessesPage from '@modules/covenant_execution/pages/IExecutionProcessPage';
import ExtractProgramsListService from '@modules/covenant_execution/services/execution_processes/ExtractExecutionProcessesListService';
import NavigateToExecutionProcessesPageService from '@modules/covenant_execution/services/execution_processes/NavigateToExecutionProcessesPageService';

class ExecutionProcessesPage implements IExecutionProcessesPage {
  public async navigateTo(): Promise<void> {
    const navigateToExecutionProcessesPage = container.resolve(
      NavigateToExecutionProcessesPageService,
    );

    await navigateToExecutionProcessesPage.execute();
  }

  public async getAll(): Promise<IExecutionProcess[]> {
    const extractProgramsList = container.resolve(ExtractProgramsListService);

    const programs = await extractProgramsList.execute();

    return programs;
  }
}

export default ExecutionProcessesPage;
