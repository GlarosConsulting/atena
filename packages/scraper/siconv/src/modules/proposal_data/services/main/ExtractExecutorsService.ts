import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import IExecutors from '../../models/main/IExecutors';

@injectable()
export default class ExtractExecutorsService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IExecutors> {
    const title = await this.page.driver.title();

    if (title !== 'Detalhar Proposta') {
      throw new AppError('You should be on opened agreement page.');
    }

    const findExecutorSubtitles = await this.page.findElementsByText(
      'Executores',
      'td[@class="subtitulo"]',
    );

    if (findExecutorSubtitles.length === 0) {
      return undefined;
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const executors = await this.page.evaluate<IExecutors>(() => {
      const legal_foundation = getTextBySelector(
        '#tr-alterarFundamentoLegal > td.field',
      );
      const organ = getTextBySelector(
        '#tr-alterarFundamentoLegal + #tr-alterarOrgaoConcedente > td.field',
      );
      const linked_organ = getTextBySelector(
        '#tr-alterarOrgaoConcedente + #tr-alterarOrgaoSubordinado > td.field',
      );
      const justification = getTextBySelector(
        '#tr-alterarOrgaoSubordinado + #tr-alterarJustificativa > td.field',
      );
      const categories = getTextBySelector(
        '#tr-alterarJustificativa + #tr-alterarCategorias > td.field',
      );
      const agreement_object = getTextBySelector(
        '#tr-alterarCategorias + #tr-alterarObjetoConvenio > td.field',
      );
      const technical_managerial_capacity = getTextBySelector(
        '#tr-alterarObjetoConvenio + #tr-alterarCapacidadeTecnica > td.field',
      );

      return {
        legal_foundation,
        organ,
        linked_organ,
        justification,
        categories,
        agreement_object,
        technical_managerial_capacity,
      };
    });

    return executors;
  }
}
