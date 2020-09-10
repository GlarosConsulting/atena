import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import parseDate from '@utils/parseDate';

import IDates from '../../models/main/IDates';

interface IExtractDates {
  validity: string;
  limit_date: string;
}

@injectable()
export default class ExtractDatesService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IDates> {
    const title = await this.page.driver.title();

    if (title !== 'Plataforma +Brasil') {
      throw new AppError('You should be on main accountability page.');
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const originalDates = await this.page.evaluate<IExtractDates>(() => {
      const validity = getTextBySelector(
        '#mainForm > div.lineGroup > div:nth-child(13) > span.unit.unitData.blueBold',
      );
      const limit_date = getTextBySelector(
        '#mainForm > div.lineGroup > div:nth-child(14) > span.unit.unitData.blueBold',
      );

      return {
        validity,
        limit_date,
      };
    });

    const [
      validity_start_date_formatted,
      validity_end_date_formatted,
    ] = originalDates.validity.split(' a ');

    const dates: IDates = {
      ...originalDates,
      validity: {
        start_date: parseDate(validity_start_date_formatted),
        end_date: parseDate(validity_end_date_formatted),
      },
      limit_date: parseDate(originalDates.limit_date),
    };

    return dates;
  }
}
