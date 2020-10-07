import ParticipantsPage from '@modules/proposal_data/infra/puppeteer/pages/ParticipantsPage';
import IParticipants from '@modules/proposal_data/models/participants';
import merge from 'lodash/merge';
import { injectable, inject } from 'tsyringe';
import { PartialDeep } from 'type-fest';

import { IHandler } from '@scraper/shared/modules/browser/models/IBrowser';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAgreement from '@shared/models/IAgreement';

@injectable()
class ParticipantsHandler implements IHandler {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async handle(): Promise<void> {
    const participantsPage = new ParticipantsPage();

    await participantsPage.navigateTo();

    const main_participants = await participantsPage.getMainParticipants();

    const data: IParticipants = {
      main_participants,
    };

    const agreement = await this.cacheProvider.recover<IAgreement>(
      'agreement',
      true,
    );

    if (!agreement) return;

    merge(agreement, {
      data: {
        proposal_data: {
          participants: data,
        },
      },
    } as PartialDeep<IAgreement>);

    await this.cacheProvider.save('agreement', agreement, true);
  }
}

export default ParticipantsHandler;
