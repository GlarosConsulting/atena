import IAgreement from '../models/IAgreement';

export default interface IAgreementsListPage {
  getAll(): Promise<IAgreement[]>;
  openById(id: string): Promise<void>;
}
