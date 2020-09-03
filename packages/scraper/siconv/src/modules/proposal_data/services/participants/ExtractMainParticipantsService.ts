import { injectable, inject } from 'tsyringe';

import AppError from '@scraper/shared/errors/AppError';
import injectFunctions from '@scraper/shared/modules/browser/infra/puppeteer/inject';
import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';
import parsePrice from '@scraper/shared/utils/parsePrice';

import IMainParticipants from '@modules/proposal_data/models/participants/IMainParticipants';
import IProgram from '@modules/proposal_data/models/programs/IProgram';

interface IExtractProgram extends Omit<IProgram, 'investment_global_value'> {
  investment_global_value: string;
}

@injectable()
export default class ExtractMainParticipantsService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IMainParticipants> {
    const title = await this.page.driver.title();

    if (title !== 'Participantes da Proposta') {
      throw new AppError("You should be on agreement's 'Participants Page'.");
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const participants = await this.page.evaluate<IMainParticipants>(() => {
      const proponent = getTextBySelector('tr.proponente td.field > div');
      const responsible_proponent = getTextBySelector(
        'tr.responsavelProponente td.field',
      );
      const grantor = getTextBySelector('tr.concedente td.field');
      const responsible_grantor = getTextBySelector(
        'tr.responsavelConcedente td.field > div',
      );

      return {
        proponent,
        responsible_proponent,
        grantor,
        responsible_grantor,
      };
    });

    return participants;
  }
}
