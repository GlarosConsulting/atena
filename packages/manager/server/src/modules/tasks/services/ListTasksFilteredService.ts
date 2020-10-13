import { addDays, isBefore } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Task from '@modules/tasks/infra/typeorm/entities/Task';
import ITasksRepository from '@modules/tasks/repositories/ITasksRepository';

interface IResponse {
  urgent: Task[];
  next: Task[];
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

    tasks.forEach(task => {
      if (isBefore(task.date, addDays(Date.now(), 5))) {
        response.urgent.push(task);
        return;
      }

      response.next.push(task);
    });

    return response;
  }
}
