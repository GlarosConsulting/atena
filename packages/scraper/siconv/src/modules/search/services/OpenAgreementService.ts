import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

interface IRequest {
  agreement_id: string;
}

@injectable()
export default class OpenAgreementService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute({ agreement_id }: IRequest): Promise<void> {
    const title = await this.page.driver.title();

    if (title !== 'Resultado da Consulta de Convênio') {
      throw new AppError('You should be on agreements list page.');
    }

    const findAgreementElements = await this.page.findElementsByText(
      agreement_id,
      'div[@class="numeroConvenio"]/a',
    );

    if (findAgreementElements.length === 0) {
      throw new AppError('Agreements list is empty.');
    }

    await this.page.clickForNavigate(findAgreementElements[0]);
  }
}
