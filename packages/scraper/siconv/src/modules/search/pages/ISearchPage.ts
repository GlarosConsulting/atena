import IPage from '@scraper/shared/modules/browser/models/IPage';

import ISearchDTO from '../dtos/ISearchDTO';

export default interface ISearchPage {
  search(data: ISearchDTO): Promise<void>;
}
