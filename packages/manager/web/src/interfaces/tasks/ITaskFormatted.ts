import ITask from './ITask';

export default interface ITaskFormatted extends ITask {
  date_formatted: string;
}
