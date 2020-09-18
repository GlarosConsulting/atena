import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import IAgreement from '@shared/models/IAgreement';

@injectable()
export default class ExtractAgreementsListService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IAgreement[]> {
    const title = await this.page.driver.title();

    if (title !== 'Resultado da Consulta de Convênio') {
      throw new AppError('You should be on agreements list page.');
    }

    const [findTableBodyElement] = await this.page.findElementsBySelector(
      '#tbodyrow',
    );

    if (!findTableBodyElement) {
      return [];
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const agreements = await this.page.evaluate<IAgreement[]>(() => {
      const data: IAgreement[] = [];

      const tableRows = document.querySelectorAll('#tbodyrow tr');

      tableRows.forEach(row => {
        const agreement_id = getTextBySelector('.numeroConvenio a', row);
        const organ = getTextBySelector('.nomeOrgao a', row);
        const status = getTextBySelector('.situacao a', row);
        const start_date = getTextBySelector('.dataInicioExecucao a', row);
        const end_date = getTextBySelector('.dataFimExecucao a', row);
        const program = getTextBySelector('.nomePrograma a', row);

        const agreement: Omit<IAgreement, 'data'> = {
          agreement_id,
          organ,
          status,
          start_date,
          end_date,
          program,
        };

        data.push(agreement as IAgreement);
      });

      return data;
    });

    return agreements;
  }
}
