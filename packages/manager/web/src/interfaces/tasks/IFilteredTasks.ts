import ITaskFormatted from './ITaskFormatted';

export default interface IFilteredTasks {
  urgent: ITaskFormatted[];
  next: ITaskFormatted[];
}
