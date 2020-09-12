import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import parsePrice from '@utils/parsePrice';

import IValues from '../../models/main/IValues';

interface IExtractValues {
  agreement_total_value: string;
  transfer_value: string;
  counterpart_value: string;
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

    if (title !== 'Plataforma +Brasil') {
      throw new AppError('You should be on main accountability page.');
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const extractedValues = await this.page.evaluate<IExtractValues>(() => {
      const agreement_total_value = getTextBySelector(
        '#mainForm > div.lineGroup > div:nth-child(15) > span.unit.unitData.blueBold',
      );
      const transfer_value = getTextBySelector(
        '#mainForm > div.lineGroup > div:nth-child(16) > span.unit.unitData.blueBold',
      );
      const counterpart_value = getTextBySelector(
        '#mainForm > div.lineGroup > div:nth-child(17) > span.unit.unitData.blueBold',
      );
      const income_value = getTextBySelector(
        '#mainForm > div.lineGroup > div:nth-child(18) > span.unit.unitData.blueBold',
      );

      return {
        agreement_total_value,
        transfer_value,
        counterpart_value,
        income_value,
      };
    });

    const values: IValues = {
      ...extractedValues,
      agreement_total_value: parsePrice(extractedValues.agreement_total_value),
      transfer_value: parsePrice(extractedValues.transfer_value),
      counterpart_value: parsePrice(extractedValues.counterpart_value),
      income_value: parsePrice(extractedValues.income_value),
    };

    return values;
  }
}
