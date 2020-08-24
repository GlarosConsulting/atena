import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import IPage from '@scraper/shared/modules/browser/models/IPage';

import siconvConfig from '@config/siconv';

import { By } from '@modules/search/dtos/ISearchDTO';

interface IRequest {
  by: By;
  value: string;
}

@injectable()
export default class SearchAgreementsService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute({ by, value }: IRequest): Promise<void> {
    switch (by) {
      case By.CNPJ:
        await this.page.goTo(siconvConfig.pages.search.url);

        await this.page.select('select#consultarTipoIdentificacao', '1');
        await this.page.type('input#consultarIdentificacao', value);
        await this.page.driver.click(
          'input[name="consultarPropostaPreenchaOsDadosDaConsultaConsultarForm"]',
        );

        await this.page.driver.waitForSelector('h3');
        break;
      default:
        throw new AppError(
          'You should specify the search identifier (e.g. CNPJ).',
        );
    }
  }
}
