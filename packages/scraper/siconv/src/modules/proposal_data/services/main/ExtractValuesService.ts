import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import parsePrice from '@utils/parsePrice';

import IValues from '../../models/main/IValues';

interface IExtractValues {
  global_value: string;
  transfer_value: string;
  counterpart_values: {
    total_value: string;
    financial_value: string;
    assets_services_value: string;
  };
  income_value: string;
}

@injectable()
export default class ExtractValuesService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IValues> {
    const title = await this.page.driver.title();

    if (title !== 'Detalhar Proposta') {
      throw new AppError('You should be on opened agreement page.');
    }

    const [findValuesSubtitle] = await this.page.findElementsByText(
      'Valores',
      'td[@class="subtitulo"]',
    );

    if (!findValuesSubtitle) {
      return undefined;
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const extractedValues = await this.page.evaluate<IExtractValues>(() => {
      const global_value = getTextBySelector(
        '#tr-alterarPercentualMinimoContrapartida > td > b',
      );
      const transfer_value = getTextBySelector(
        '#tr-alterarPercentualMinimoContrapartida > td > div:nth-child(3) > b',
      );

      const counterpart_total_value = getTextBySelector(
        '#tr-alterarPercentualMinimoContrapartida > td > div:nth-child(4) > b',
      );
      const counterpart_financial_value = getTextBySelector(
        '#tr-alterarPercentualMinimoContrapartida > td > div:nth-child(5) > b',
      );
      const counterpart_assets_services_value = getTextBySelector(
        '#tr-alterarPercentualMinimoContrapartida > td > div:nth-child(6) > b',
      );

      const income_value = getTextBySelector(
        '#tr-alterarPercentualMinimoContrapartida > td > div:nth-child(7) > b',
      );

      return {
        global_value,
        transfer_value,
        counterpart_values: {
          total_value: counterpart_total_value,
          financial_value: counterpart_financial_value,
          assets_services_value: counterpart_assets_services_value,
        },
        income_value,
      };
    });

    const values: IValues = {
      ...extractedValues,
      global_value: parsePrice(extractedValues.global_value),
      transfer_value: parsePrice(extractedValues.transfer_value),
      counterpart_values: {
        total_value: parsePrice(extractedValues.counterpart_values.total_value),
        financial_value: parsePrice(
          extractedValues.counterpart_values.financial_value,
        ),
        assets_services_value: parsePrice(
          extractedValues.counterpart_values.assets_services_value,
        ),
      },
      income_value: parsePrice(extractedValues.income_value),
    };

    return values;
  }
}
