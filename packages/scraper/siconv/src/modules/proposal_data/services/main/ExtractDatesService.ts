import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import siconvConfig from '@config/siconv';

import parseDate from '@utils/parseDate';

import IDates from '../../models/main/IDates';

interface IExtractDates {
  proposal_date: string;
  signature_date: string;
  published_dou_date: string;
  validity_start_date: string;
  validity_end_date: string;
  accountability_limit_date: string;
}

@injectable()
export default class ExtractDatesService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IDates> {
    const title = await this.page.driver.title();

    if (title !== 'Detalhar Proposta') {
      throw new AppError('You should be on opened agreement page.');
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
    const originalDates = await this.page.evaluate<IExtractDates>(() => {
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

    const dates: IDates = {
      ...originalDates,
      proposal_date: parseDate(originalDates.proposal_date),
      signature_date: parseDate(originalDates.signature_date),
      published_dou_date: parseDate(originalDates.published_dou_date),
      validity_start_date: parseDate(originalDates.validity_start_date),
      validity_end_date: parseDate(originalDates.validity_end_date),
      accountability_limit_date: parseDate(
        originalDates.accountability_limit_date,
      ),
    };

    return dates;
  }
}
