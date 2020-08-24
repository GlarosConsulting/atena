import { injectable, inject } from 'tsyringe';

import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import IAgreement from '@modules/search/models/IAgreement';

@injectable()
export default class ExtractAgreementsListService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IAgreement[]> {
    await this.page.driver.waitForSelector('#tbodyrow');

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const agreements = await this.page.driver.evaluate<() => IAgreement[]>(
      () => {
        const data: IAgreement[] = [];

        const tableRows = document.querySelectorAll('#tbodyrow tr');

        tableRows.forEach(row => {
          const agreement_id = getTextBySelector('.numeroConvenio a', row);
          const organ = getTextBySelector('.nomeOrgao a', row);
          const status = getTextBySelector('.situacao a', row);
          const start_date = getTextBySelector('.dataInicioExecucao a', row);
          const end_date = getTextBySelector('.dataFimExecucao a', row);
          const program = getTextBySelector('.nomePrograma a', row);

          const agreement = {
            agreement_id,
            organ,
            status,
            start_date,
            end_date,
            program,
          };

          data.push(agreement);
        });

        return data;
      },
    );

    return agreements;
  }
}
