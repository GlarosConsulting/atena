import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import parseDate from '@utils/parseDate';
import parsePrice from '@utils/parsePrice';

import IMainDetails from '@modules/covenant_execution/models/execution_processes/details/IMainDetails';

interface IExtractMainDetails
  extends Omit<IMainDetails, 'bidding_value' | 'dates'> {
  bidding_value: string;
  dates: {
    notice_publish_date: string;
    homologation_date: string;
    bidding_dates: {
      opening_date: string;
      closure_date: string;
    };
  };
}

@injectable()
export default class ExtractMainDetailsService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IMainDetails> {
    const title = await this.page.driver.title();

    if (title !== 'Detalha Licitacao') {
      throw new AppError('You should be on execution process details page.');
    }

    const [
      findExecutionProcessDataSubtitle,
    ] = await this.page.findElementsByText(
      'Dados do Processo de Execução',
      'div[@class="subTitulo"]',
    );

    if (!findExecutionProcessDataSubtitle) {
      return undefined;
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const extractedMainDetails = await this.page.evaluate<IExtractMainDetails>(
      () => {
        const execution_process = getTextBySelector(
          '#tr-alterarDadosProcessoCompra > td.field',
        );
        const buy_type = getTextBySelector(
          '#tr-alterarDadosTipoCompra > td.field',
        );
        const bidding_status = getTextBySelector(
          '#tr-alterarDadosStatusLicitacao > td.field',
        );
        const resource_origin = getTextBySelector(
          '#tr-alterarDadosOrigemRecurso > td.field',
        );
        const financial_resource = getTextBySelector(
          '#tr-alterarDadosRecursoFinanceiro > td.field',
        );
        const modality = getTextBySelector(
          '#tr-alterarDadosModalidade > td.field',
        );
        const bidding_type = getTextBySelector(
          '#tr-alterarDadosTipoLicitacao > td.field',
        );
        const process_number = getTextBySelector(
          '#tr-alterarDadosNumeroDoProcesso > td.field',
        );
        const bidding_number = getTextBySelector(
          '#tr-alterarDadosNumeroDaLicitacao > td.field',
        );
        const object = document.querySelector('#alterarDadosObjeto')
          .textContent;
        const legal_foundation = getTextBySelector(
          '#tr-alterarDadosFundamentoLegal > td.field',
        );
        const justification = document.querySelector(
          '#tr-alterarDadosFundamentoLegal > td.field',
        ).textContent;
        const bidding_value = getTextBySelector('#alterarDadosJustificativa');

        const notice_publish_date = getTextBySelector(
          '#tr-alterarDadosDataDePublicacaoDoEdital > td.field',
        );
        const homologation_date = getTextBySelector(
          '#tr-alterarDadosDataHomologacao > td.field',
        );

        const bidding_opening_date = getTextBySelector(
          '#tr-alterarDadosDataAberturaLicitacao > td.field',
        );
        const bidding_closure_date = getTextBySelector(
          '#tr-alterarDadosDataEncerramentoLicitacao > td.field',
        );

        const homologation_responsible_cpf_document = getTextBySelector(
          '#tr-alterarDadosCpfHomologador > td.field',
        );
        const homologation_responsible_name = getTextBySelector(
          '#tr-alterarDadosNomeResponsavel > td.field',
        );
        const homologation_responsible_role = getTextBySelector(
          '#tr-alterarDadosFuncaoResponsavel > td.field',
        );

        const city_name = getTextBySelector(
          '#tr-alterarDadosNomeDoMunicipio > td.field',
        );
        const city_state = getTextBySelector(
          '#tr-alterarDadosSiglaUf > td.field',
        );

        return {
          execution_process,
          buy_type,
          bidding_status,
          resource_origin,
          financial_resource,
          modality,
          bidding_type,
          process_number,
          bidding_number,
          object,
          legal_foundation,
          justification,
          bidding_value,
          dates: {
            notice_publish_date,
            homologation_date,
            bidding_dates: {
              opening_date: bidding_opening_date,
              closure_date: bidding_closure_date,
            },
          },
          homologation_responsible: {
            cpf_document: homologation_responsible_cpf_document,
            name: homologation_responsible_name,
            role: homologation_responsible_role,
          },
          city: {
            name: city_name,
            state: city_state,
          },
        };
      },
    );

    const mainDetails: IMainDetails = {
      ...extractedMainDetails,
      bidding_value: parsePrice(extractedMainDetails.bidding_value),
      dates: {
        ...extractedMainDetails.dates,
        notice_publish_date: parseDate(
          extractedMainDetails.dates.notice_publish_date,
        ),
        homologation_date: parseDate(
          extractedMainDetails.dates.homologation_date,
        ),
        bidding_dates: {
          ...extractedMainDetails.dates.bidding_dates,
          opening_date: parseDate(
            extractedMainDetails.dates.bidding_dates.opening_date,
          ),
          closure_date: parseDate(
            extractedMainDetails.dates.bidding_dates.closure_date,
          ),
        },
      },
    };

    return mainDetails;
  }
}
