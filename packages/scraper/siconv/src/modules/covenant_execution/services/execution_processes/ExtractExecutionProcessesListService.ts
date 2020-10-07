import IExecutionProcess from '@modules/covenant_execution/models/execution_processes/IExecutionProcess';
import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import parseDate from '@utils/parseDate';

import ExtractAcceptDataDetailsService from './details/ExtractAcceptDataDetailsService';
import ExtractMainDetailsService from './details/ExtractMainDetailsService';
import GoBackFromExecutionProcessDetailsService from './details/GoBackFromExecutionProcessDetailsPageService';
import NavigateToExecutionProcessDetailsPageService from './details/NavigateToExecutionProcessDetailsPageService';

interface IExtractExecutionProcess
  extends Omit<IExecutionProcess, 'publish_date' | 'details'> {
  publish_date: string;
}

@injectable()
export default class ExtractProgramsListService {
  private navigateToExecutionProcessDetailsPage: NavigateToExecutionProcessDetailsPageService;

  private extractMainDetails: ExtractMainDetailsService;

  private extractAcceptDataDetails: ExtractAcceptDataDetailsService;

  private goBackFromExecutionProcessDetails: GoBackFromExecutionProcessDetailsService;

  constructor(
    @inject('Page')
    private page: Page,
  ) {
    this.navigateToExecutionProcessDetailsPage = new NavigateToExecutionProcessDetailsPageService(
      page,
    );
    this.extractMainDetails = new ExtractMainDetailsService(page);
    this.extractAcceptDataDetails = new ExtractAcceptDataDetailsService(page);
    this.goBackFromExecutionProcessDetails = new GoBackFromExecutionProcessDetailsService(
      page,
    );
  }

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
        const execution_process_id = getTextBySelector('.numeroLicitacao', row);
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
          execution_process_id,
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

    const executionProcesses: IExecutionProcess[] = [];

    for (const executionProcess of extractedExecutionProcesses) {
      await this.navigateToExecutionProcessDetailsPage.execute({
        execution_process_id: executionProcess.execution_process_id,
      });

      const main_details = await this.extractMainDetails.execute();
      const accept_data_details = await this.extractAcceptDataDetails.execute();

      await this.goBackFromExecutionProcessDetails.execute();

      executionProcesses.push({
        ...executionProcess,
        publish_date: parseDate(executionProcess.publish_date),
        details: {
          main_details,
          accept_data_details,
        },
      });
    }

    return executionProcesses;
  }
}
