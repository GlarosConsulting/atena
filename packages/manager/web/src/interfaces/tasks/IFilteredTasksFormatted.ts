import ITaskFormatted from './ITaskFormatted';

export default interface IFilteredTasksFormatted {
  urgent: ITaskFormatted[];
  next: ITaskFormatted[];
}
