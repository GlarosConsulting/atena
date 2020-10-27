import ITask from '@/interfaces/tasks/ITask';

export default interface IFilteredTasks {
  urgent: ITask[];
  next: ITask[];
}
