import { container } from 'tsyringe';

import IAgreement from '@shared/models/IAgreement';

import IAgreementsListPage from '@modules/agreements_list/pages/IAgreementsListPage';
import ExtractAgreementsListService from '@modules/agreements_list/services/ExtractAgreementsListService';
import ExtractListInfoService from '@modules/agreements_list/services/ExtractListInfoService';
import NavigateToPageService from '@modules/agreements_list/services/NavigateToPageService';
import OpenAgreementByIdService from '@modules/agreements_list/services/OpenAgreementByIdService';

class AgreementsListPage implements IAgreementsListPage {
  public async navigateTo(): Promise<void> {
    // useless
  }

  public async getAll(): Promise<IAgreement[]> {
    const extractAgreementsList = container.resolve(
      ExtractAgreementsListService,
    );

    const agreements = await extractAgreementsList.execute();

    return agreements;
  }

  public async openById(agreement_id: string): Promise<void> {
    const openAgreementById = container.resolve(OpenAgreementByIdService);

    await openAgreementById.execute({ agreement_id });
  }

  public async getCurrentPage(): Promise<number> {
    const extractListInfo = container.resolve(ExtractListInfoService);

    const { current_page } = await extractListInfo.execute();

    return current_page;
  }

  public async getTotalPages(): Promise<number> {
    const extractListInfo = container.resolve(ExtractListInfoService);

    const { total_pages } = await extractListInfo.execute();

    return total_pages;
  }

  public async navigateToPage(page: number): Promise<void> {
    const navigateToPage = container.resolve(NavigateToPageService);

    await navigateToPage.execute({ page });
  }
}

export default AgreementsListPage;
