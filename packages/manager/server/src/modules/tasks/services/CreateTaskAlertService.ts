import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import TaskAlert from '@modules/tasks/infra/typeorm/entities/TaskAlert';
import ITaskAlertsRepository from '@modules/tasks/repositories/ITaskAlertsRepository';
import ITasksRepository from '@modules/tasks/repositories/ITasksRepository';

interface IRequest {
  task_id: string;
  user_id: string;
  date: Date;
  description: string;
}

@injectable()
export default class CreateTaskAlertService {
  constructor(
    @inject('TasksRepository')
    private tasksRepository: ITasksRepository,

    @inject('TaskAlertsRepository')
    private taskAlertsRepository: ITaskAlertsRepository,
  ) {}

  public async execute({
    task_id,
    user_id,
    date,
    description,
  }: IRequest): Promise<TaskAlert> {
    const checkTaskExists = await this.tasksRepository.findById(task_id);

    if (!checkTaskExists) {
      throw new AppError('Task not found.', 404);
    }

    const taskAlert = await this.taskAlertsRepository.create({
      task_id,
      user_id,
      date,
      description,
    });

    return taskAlert;
  }
}
