import { container } from 'tsyringe';

import ISearchDTO from '@modules/search/dtos/ISearchDTO';
import ISearchPage from '@modules/search/pages/ISearchPage';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

class SearchPage implements ISearchPage {
  public async navigateTo(): Promise<void> {
    // TODO
  }

  public async search({ by, value }: ISearchDTO): Promise<void> {
    const searchAgreements = container.resolve(SearchAgreementsService);

    await searchAgreements.execute({ by, value });
  }
}

export default SearchPage;
