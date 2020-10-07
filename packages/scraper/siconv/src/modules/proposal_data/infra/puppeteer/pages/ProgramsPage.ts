import IProgram from '@modules/proposal_data/models/programs/IProgram';
import IProgramsPage from '@modules/proposal_data/pages/IProgramsPage';
import ExtractProgramsListService from '@modules/proposal_data/services/programs/ExtractProgramsListService';
import NavigateToProgramsPageService from '@modules/proposal_data/services/programs/NavigateToProgramsPageService';
import { container } from 'tsyringe';

class ProgramsPage implements IProgramsPage {
  public async navigateTo(): Promise<void> {
    const navigateToProgramsPage = container.resolve(
      NavigateToProgramsPageService,
    );

    await navigateToProgramsPage.execute();
  }

  public async getAll(): Promise<IProgram[]> {
    const extractProgramsList = container.resolve(ExtractProgramsListService);

    const programs = await extractProgramsList.execute();

    return programs;
  }
}

export default ProgramsPage;
