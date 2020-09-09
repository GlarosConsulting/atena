import IPage from '@scraper/shared/modules/browser/models/IPage';

import ISiconvPage from '@shared/pages/ISiconvPage';

import ISearchDTO from '../dtos/ISearchDTO';

export default interface ISearchPage extends ISiconvPage {
  search(data: ISearchDTO): Promise<void>;
}
