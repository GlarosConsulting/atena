import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import parsePrice from '@utils/parsePrice';

import IProgram from '@modules/proposal_data/models/programs/IProgram';

interface IExtractProgram extends Omit<IProgram, 'investment_global_value'> {
  investment_global_value: string;
}

@injectable()
export default class ExtractProgramsListService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IProgram[]> {
    const title = await this.page.driver.title();

    if (title !== 'Programas da Proposta') {
      throw new AppError("You should be on agreement's 'Programs Page'.");
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

    const programs = extractedPrograms.map<IProgram>(program => {
      return {
        ...program,
        investment_global_value: parsePrice(program.investment_global_value),
      };
    });

    return programs;
  }
}
