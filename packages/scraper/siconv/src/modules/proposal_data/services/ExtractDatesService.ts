import { parse as parseDateFns } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import IDates from '../models/IDates';

@injectable()
export default class ExtractBankDataService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IDates> {
    const title = await this.page.driver.title();

    if (title !== 'Detalhar Proposta') {
      throw new AppError('You should be on an opened agreement page.');
    }

    const findDatesSubtitles = await this.page.findElementsByText(
      'Datas',
      'td[@class="subtitulo"]',
    );

    if (findDatesSubtitles.length === 0) {
      return undefined;
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const originalDates = await this.page.driver.evaluate(() => {
      const proposal_date = getTextBySelector(
        '#tr-alterarDataProposta > td.field',
      );
      const signature_date = getTextBySelector(
        '#tr-enviarParaAnaliseDataAssinatura > td.field',
      );
      const published_dou_date = getTextBySelector(
        '#tr-enviarParaAnaliseDataPublicacao > td.field',
      );
      const validity_start_date = getTextBySelector(
        '#tr-alterarInicioVigencia > td.field',
      );
      const validity_end_date = getTextBySelector(
        '#tr-alterarTerminoVigencia > td.field',
      );
      const accountability_limit_date = getTextBySelector(
        '#tr-alterarDataPrestacao > td.field',
      );

      return {
        proposal_date,
        signature_date,
        published_dou_date,
        validity_start_date,
        validity_end_date,
        accountability_limit_date,
      };
    });

    function parse(dateString: string): Date {
      return parseDateFns(dateString, 'dd/MM/yyyy', Date.now());
    }

    const dates: IDates = {
      ...originalDates,
      proposal_date: parse(originalDates.proposal_date),
      signature_date: parse(originalDates.signature_date),
      published_dou_date: parse(originalDates.published_dou_date),
      validity_start_date: parse(originalDates.validity_start_date),
      validity_end_date: parse(originalDates.validity_end_date),
      accountability_limit_date: parse(originalDates.accountability_limit_date),
    };

    return dates;
  }
}
