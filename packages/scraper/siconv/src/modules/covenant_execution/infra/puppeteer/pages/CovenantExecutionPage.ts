import ICovenantExecutionPage from '@modules/covenant_execution/pages/ICovenantExecutionPage';
import NavigateToCovenantExecutionPageService from '@modules/covenant_execution/services/NavigateToCovenantExecutionPageService';
import { container } from 'tsyringe';

class CovenantExecutionPage implements ICovenantExecutionPage {
  public async navigateTo(): Promise<void> {
    const navigateToCovenantExecutionPage = container.resolve(
      NavigateToCovenantExecutionPageService,
    );

    await navigateToCovenantExecutionPage.execute();
  }
}

export default CovenantExecutionPage;
