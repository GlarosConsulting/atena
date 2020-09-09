import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import IJustification from '../../models/main/IJustification';

@injectable()
export default class ExtractJustificationService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IJustification> {
    const title = await this.page.driver.title();

    if (title !== 'Detalhar Proposta') {
      throw new AppError('You should be on opened agreement page.');
    }

    const findJustificationSubtitles = await this.page.findElementsByText(
      'Justificativa',
      'td[@class="subtitulo"]',
    );

    if (findJustificationSubtitles.length === 0) {
      return undefined;
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const justification = await this.page.evaluate<IJustification>(() => {
      const characterization = getTextBySelector(
        '#tr-alterarCaracterizacaoInteressesReciprocos > td.field',
      );
      const target_audience = getTextBySelector(
        '#tr-alterarCaracterizacaoInteressesReciprocos + #tr-alterarPublicoAlvo > td.field',
      );
      const solve_problem = getTextBySelector(
        '#tr-alterarPublicoAlvo + #tr-alterarProblemaASerResolvido > td.field',
      );
      const expected_results = getTextBySelector(
        '#tr-alterarProblemaASerResolvido + #tr-alterarResultadosEsperados > td.field',
      );
      const relationship = getTextBySelector(
        '#tr-alterarResultadosEsperados + #tr-alterarRelacaoPropostaObjetivosProgramas > td.field',
      );
      const categories = getTextBySelector(
        '#tr-alterarRelacaoPropostaObjetivosProgramas + #tr-alterarCategorias > td.field',
      );
      const agreement_object = getTextBySelector(
        '#tr-alterarCategorias + #tr-alterarObjetoConvenio > td.field',
      );
      const technical_managerial_capacity = getTextBySelector(
        '#tr-alterarObjetoConvenio + #tr-alterarCapacidadeTecnica > td.field',
      );

      return {
        characterization,
        target_audience,
        solve_problem,
        expected_results,
        relationship,
        categories,
        agreement_object,
        technical_managerial_capacity,
      };
    });

    return justification;
  }
}
