import { container } from 'tsyringe';

import IAgreement from '@modules/search/models/IAgreement';
import IAgreementsListPage from '@modules/search/pages/IAgreementsListPage';
import ExtractAgreementsListService from '@modules/search/services/ExtractAgreementsListService';
import OpenAgreementService from '@modules/search/services/OpenAgreementService';

class AgreementsListPage implements IAgreementsListPage {
  public async getAll(): Promise<IAgreement[]> {
    const extractAgreementsList = container.resolve(
      ExtractAgreementsListService,
    );

    const agreements = await extractAgreementsList.execute();

    return agreements;
  }

  public async openById(agreement_id: string): Promise<void> {
    const openAgreement = container.resolve(OpenAgreementService);

    await openAgreement.execute({ agreement_id });
  }
}

export default AgreementsListPage;
