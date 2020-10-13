import ITaskAlert from './ITaskAlert';

export default interface ITask {
  id: string;
  instrument: string;
  date: string;
  status: string;
  task: string;
  details: string;
  alerts: ITaskAlert[];
}
