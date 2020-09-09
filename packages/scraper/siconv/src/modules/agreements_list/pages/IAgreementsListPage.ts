import IAgreement from '@shared/models/IAgreement';
import ISiconvPage from '@shared/pages/ISiconvPage';

export default interface IAgreementsListPage extends ISiconvPage {
  getAll(): Promise<IAgreement[]>;
  openById(id: string): Promise<void>;
  getCurrentPage(): Promise<number>;
  getTotalPages(): Promise<number>;
  navigateToPage(page: number): Promise<void>;
}
