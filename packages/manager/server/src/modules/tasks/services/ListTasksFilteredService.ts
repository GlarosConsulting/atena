import { addDays, isBefore } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Task from '@modules/tasks/infra/typeorm/entities/Task';
import TaskAlert from '@modules/tasks/infra/typeorm/entities/TaskAlert';
import ITasksRepository from '@modules/tasks/repositories/ITasksRepository';

interface IFilteredTask extends Omit<Task, 'getAlerts'> {
  last_alert: TaskAlert | null;
}

interface IResponse {
  urgent: IFilteredTask[];
  next: IFilteredTask[];
}

@injectable()
export default class ListTasksFilteredService {
  constructor(
    @inject('TasksRepository')
    private tasksRepository: ITasksRepository,
  ) {}

  public async execute(): Promise<IResponse> {
    const tasks = await this.tasksRepository.findAll();

    const response: IResponse = {
      urgent: [],
      next: [],
    };

    tasks.forEach(item => {
      const task: IFilteredTask = {
        ...item,
        last_alert: null,
      };

      if (item.alerts.length > 0) {
        task.last_alert = item.alerts[item.alerts.length - 1];
      }

      if (isBefore(task.date, addDays(Date.now(), 5))) {
        response.urgent.push(task);
        return;
      }

      response.next.push(task);
    });

    return response;
  }
}
