import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import IMainData from '../models/IMainData';

@injectable()
export default class ExtractMainDataService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IMainData> {
    const title = await this.page.driver.title();

    if (title !== 'Detalhar Proposta') {
      throw new AppError('You should be on an opened agreement page.');
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const mainData = await this.page.driver.evaluate<() => IMainData>(() => {
      const modality = getTextBySelector(
        '#tr-alterarModalidade > td:nth-child(2) > table > tbody > tr > td:nth-child(1)',
      );
      const sent = getTextBySelector(
        '#tr-alterarModalidade > td:nth-child(2) > table > tbody > tr > td:nth-child(3)',
      );
      const siafi_status = getTextBySelector(
        '#tr-alterarModalidade > td:nth-child(2) > table > tbody > tr > td:nth-child(5)',
      );
      const hiring_status = getTextBySelector(
        '#tr-alterarSituacaoContratoAtual > td.field > div',
      );

      const status_value = getTextBySelector(
        '#tr-alterarStatus > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > div',
      );
      const status_committed = getTextBySelector(
        '#tr-alterarStatus > td:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)',
      );
      const status_publication = getTextBySelector(
        '#tr-alterarStatus > td:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(4)',
      );

      const proposal_id = getTextBySelector(
        '#tr-alterarNumeroProposta > td:nth-child(4)',
      );
      const organ_intern_id = getTextBySelector(
        '#tr-alterarNumeroInterno > td.field',
      );
      const process_id = getTextBySelector(
        '#tr-alterarNumeroProcesso > td.field',
      );

      return {
        modality,
        sent,
        siafi_status,
        hiring_status,
        status: {
          value: status_value,
          committed: status_committed,
          publication: status_publication,
        },
        proposal_id,
        organ_intern_id,
        process_id,
      };
    });

    return mainData;
  }
}
