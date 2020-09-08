import IAgreement from '@shared/models/IAgreement';

export default interface IAgreementsListPage {
  getAll(): Promise<IAgreement[]>;
  openById(id: string): Promise<void>;
  getCurrentPage(): Promise<number>;
  getTotalPages(): Promise<number>;
  navigateToPage(page: number): Promise<void>;
}
