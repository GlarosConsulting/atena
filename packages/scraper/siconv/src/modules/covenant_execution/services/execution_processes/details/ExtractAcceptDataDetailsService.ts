import IAcceptDataDetails from '@modules/covenant_execution/models/execution_processes/details/IAcceptDataDetails';
import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import parseDate from '@utils/parseDate';

interface IExtractAcceptDataDetails
  extends Omit<IAcceptDataDetails, 'analysis_date' | 'analysis_record_date'> {
  analysis_date: string;
  analysis_record_date: string;
}

@injectable()
export default class ExtractAcceptDataDetailsService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IAcceptDataDetails> {
    const title = await this.page.driver.title();

    if (title !== 'Detalha Licitacao') {
      throw new AppError('You should be on execution process details page.');
    }

    const [findAcceptDataSubtitle] = await this.page.findElementsByText(
      'Dados do Aceite',
      'div[@class="subTitulo"]',
    );

    if (!findAcceptDataSubtitle) {
      return undefined;
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const extractedAcceptDataDetails = await this.page.evaluate<
      IExtractAcceptDataDetails
    >(() => {
      const responsibility_assignment = getTextBySelector(
        '#tr-alterarDadosAtribuicaoResponsavelAceiteProcessoExecucao > td.field',
      );
      const analysis_date = getTextBySelector(
        '#tr-alterarDadosDataAnaliseAceiteProcessoExecucao > td.field',
      );
      const execution_process_accept = getTextBySelector(
        '#tr-alterarDadosSituacaoAceiteProcessoExecucao > td.field',
      );
      const justification = getTextBySelector(
        '#alterarDadosJustificativaAceiteProcessoExecucao',
      );
      const responsible = getTextBySelector(
        '#tr-alterarDadosResponsavelAceiteProcessoExecucao > td.field',
      );
      const analysis_record_date = getTextBySelector(
        '#tr-alterarDadosDataHoraRegistroAnaliseAceiteProcessoExecucao > td.field',
      );

      return {
        responsibility_assignment,
        analysis_date,
        execution_process_accept,
        justification,
        responsible,
        analysis_record_date,
      };
    });

    const acceptDataDetails: IAcceptDataDetails = {
      ...extractedAcceptDataDetails,
      analysis_date: parseDate(extractedAcceptDataDetails.analysis_date),
      analysis_record_date: parseDate(
        extractedAcceptDataDetails.analysis_record_date,
        'dd/MM/yyyy HH:mm:ss',
      ),
    };

    return acceptDataDetails;
  }
}
