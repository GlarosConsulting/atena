import { container } from 'tsyringe';

import IAgreement from '@modules/search/models/IAgreement';
import IAgreementsListPage from '@modules/search/pages/IAgreementsListPage';
import ExtractAgreementsListService from '@modules/search/services/ExtractAgreementsListService';
import ExtractPageCountService from '@modules/search/services/ExtractPageCountService';
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

  public async getTotalPages(): Promise<number> {
    const extractPageCount = container.resolve(ExtractPageCountService);

    const totalPages = await extractPageCount.execute();

    return totalPages;
  }
}

export default AgreementsListPage;
