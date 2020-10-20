import ITask from './ITask';

export default interface IFilteredTasks {
  urgent: ITask[];
  next: ITask[];
}
