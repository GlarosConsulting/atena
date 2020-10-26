import ITaskAlert from '@/interfaces/tasks/ITaskAlert';

import ITask from './ITask';

export default interface ITaskFormatted extends ITask {
  date_formatted: string;
  last_alert: ITaskAlert | null;
}
