import { container } from 'tsyringe';

import Page from '@scraper/shared/modules/browser/infra/puppeteer/models/Page';

import ISearchDTO from '@modules/search/dtos/ISearchDTO';
import ISearchPage from '@modules/search/pages/ISearchPage';
import SearchAgreementsService from '@modules/search/services/SearchAgreementsService';

class SearchPage implements ISearchPage {
  public async search({ by, value }: ISearchDTO): Promise<void> {
    const searchAgreements = container.resolve(SearchAgreementsService);

    await searchAgreements.execute({ by, value });
  }
}

export default SearchPage;
