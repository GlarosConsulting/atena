import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import parsePrice from '@utils/parsePrice';

import IProgram from '@modules/proposal_data/models/programs/IProgram';

import ExtractProgramDetailsService from './ExtractProgramDetailsService';
import NavigateToProgramDetailsPageService from './NavigateToProgramDetailsPageService';

interface IExtractProgram
  extends Omit<IProgram, 'investment_global_value' | 'details'> {
  investment_global_value: string;
}

@injectable()
export default class ExtractProgramsListService {
  private navigateToProgramDetailsPage: NavigateToProgramDetailsPageService;

  private extractProgramDetails: ExtractProgramDetailsService;

  constructor(
    @inject('Page')
    private page: Page,
  ) {
    this.navigateToProgramDetailsPage = new NavigateToProgramDetailsPageService(
      page,
    );

    this.extractProgramDetails = new ExtractProgramDetailsService(page);
  }

  public async execute(): Promise<IProgram[]> {
    const title = await this.page.driver.title();

    if (title !== 'Programas da Proposta') {
      throw new AppError("You should be on agreement's programs page.");
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const extractedPrograms = await this.page.evaluate<IExtractProgram[]>(
      () => {
        const data: IExtractProgram[] = [];

        const tableRows = document.querySelectorAll('#tbodyrow tr');

        tableRows.forEach(row => {
          const program_id = getTextBySelector('.codigo', row);
          const name = getTextBySelector('.nome', row);
          const investment_global_value = getTextBySelector(
            '.valorGlobalFormatado',
            row,
          );

          const program: IExtractProgram = {
            program_id,
            name,
            investment_global_value,
          };

          data.push(program);
        });

        return data;
      },
    );

    const programs: IProgram[] = [];

    for (const program of extractedPrograms) {
      await this.navigateToProgramDetailsPage.execute({
        program_id: program.program_id,
      });

      const details = await this.extractProgramDetails.execute();

      await this.page.driver.goBack();

      programs.push({
        ...program,
        investment_global_value: parsePrice(program.investment_global_value),
        details,
      });
    }

    return programs;
  }
}
