import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import parseDate from '@utils/parseDate';

import IExecutionProcess from '@modules/covenant_execution/models/execution_processes/IExecutionProcess';

interface IExtractExecutionProcess
  extends Omit<IExecutionProcess, 'publish_date'> {
  publish_date: string;
}

@injectable()
export default class ExtractProgramsListService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IExecutionProcess[]> {
    const title = await this.page.driver.title();

    if (title !== 'Listar Licitacoes') {
      throw new AppError(
        "You should be on agreement covenant execution's execution processes.",
      );
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const extractedExecutionProcesses = await this.page.evaluate<
      IExtractExecutionProcess[]
    >(() => {
      const data: IExtractExecutionProcess[] = [];

      const tableRows = document.querySelectorAll('#tbodyrow tr');

      tableRows.forEach(row => {
        const number = getTextBySelector('.numeroLicitacao', row);
        const execution_process = getTextBySelector('.modalidade', row);
        const publish_date = getTextBySelector('.dataPublicacao', row);
        const process_number = getTextBySelector('.numeroProcesso', row);
        const status = getTextBySelector('.situacao', row);
        const origin_system_status = getTextBySelector(
          '.situacaoSistemaOrigem',
          row,
        );
        const origin_system = getTextBySelector('.sistemaOrigem', row);
        const execution_process_accept = getTextBySelector(
          '.situacaoAceiteProcessoExecucao',
          row,
        );

        const program: IExtractExecutionProcess = {
          number,
          execution_process,
          publish_date,
          process_number,
          status,
          origin_system_status,
          origin_system,
          execution_process_accept,
        };

        data.push(program);
      });

      return data;
    });

    const executionProcesses = extractedExecutionProcesses.map<
      IExecutionProcess
    >(executionProcess => {
      return {
        ...executionProcess,
        publish_date: parseDate(executionProcess.publish_date),
      };
    });

    return executionProcesses;
  }
}
