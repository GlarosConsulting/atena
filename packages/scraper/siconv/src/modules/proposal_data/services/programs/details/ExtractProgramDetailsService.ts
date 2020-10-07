import IProgramDetails from '@modules/proposal_data/models/programs/IProgramDetails';
import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import parsePrice from '@utils/parsePrice';

interface IExtractProgramDetails extends Omit<IProgramDetails, 'values'> {
  values: {
    investment_items_global_value: string;
    counterpart_values: {
      total_value: string;
      financial_value: string;
      assets_services_value: string;
    };
    transfer_values: {
      total_value: string;
      amendment_value: string;
    };
  };
}

@injectable()
export default class ExtractProgramDetailsService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IProgramDetails> {
    const title = await this.page.driver.title();

    if (title !== 'Valores do Programa') {
      throw new AppError("You should be on agreement program's details page.");
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const extractedProgramDetails = await this.page.evaluate<
      IExtractProgramDetails
    >(() => {
      const program_id = getTextBySelector(
        '#tr-voltarCodigoPrograma > td.field',
      );
      const program_name = getTextBySelector(
        '#tr-voltarNomePrograma > td.field',
      );
      const cps_number = getTextBySelector('#tr-voltarNumeroCPS > td.field');
      const investment_items = getTextBySelector(
        '#tr-voltarItensInvestimento > td.field',
      );
      const counterpart_rule = getTextBySelector(
        '#tr-voltarRegraContrapartida > td.field',
      );

      const investment_items_global_value = getTextBySelector(
        '#tr-voltarValorGlobal > td.field',
      );

      const counterpart_total_value = getTextBySelector(
        '#tr-voltarValorContrapartida > td.field',
      );
      const counterpart_financial_value = getTextBySelector(
        '#tr-voltarValorContrapartidaFinanceira > td.field',
      );
      const counterpart_assets_services_value = getTextBySelector(
        '#tr-voltarValorContrapartidaBensServicos > td.field',
      );

      const transfer_total_value = getTextBySelector(
        '#tr-voltarValorRepasse > td.field',
      );
      const transfer_amendment_value = getTextBySelector(
        '#tr-voltarValorRepasse:nth-child(11) > td.field',
      );

      return {
        program_id,
        program_name,
        cps_number,
        investment_items,
        counterpart_rule,
        values: {
          investment_items_global_value,
          counterpart_values: {
            total_value: counterpart_total_value,
            financial_value: counterpart_financial_value,
            assets_services_value: counterpart_assets_services_value,
          },
          transfer_values: {
            total_value: transfer_total_value,
            amendment_value: transfer_amendment_value,
          },
        },
      };
    });

    const programDetails: IProgramDetails = {
      ...extractedProgramDetails,
      values: {
        ...extractedProgramDetails.values,
        investment_items_global_value: parsePrice(
          extractedProgramDetails.values.investment_items_global_value,
        ),
        counterpart_values: {
          ...extractedProgramDetails.values.counterpart_values,
          total_value: parsePrice(
            extractedProgramDetails.values.counterpart_values.total_value,
          ),
          financial_value: parsePrice(
            extractedProgramDetails.values.counterpart_values.financial_value,
          ),
          assets_services_value: parsePrice(
            extractedProgramDetails.values.counterpart_values
              .assets_services_value,
          ),
        },
        transfer_values: {
          ...extractedProgramDetails.values.transfer_values,
          total_value: parsePrice(
            extractedProgramDetails.values.transfer_values.total_value,
          ),
        },
      },
    };

    return programDetails;
  }
}
