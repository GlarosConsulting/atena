import { injectable, inject } from 'tsyringe';

import Task from '../infra/typeorm/entities/Task';
import ITasksRepository from '../repositories/ITasksRepository';

interface IRequest {
  instrument: string;
  contract: string;
  date: Date;
  status: string;
  task: string;
  details: string;
}

@injectable()
export default class CreateTaskService {
  constructor(
    @inject('TasksRepository')
    private tasksRepository: ITasksRepository,
  ) {}

  public async execute({
    instrument,
    contract,
    date,
    status,
    task,
    details,
  }: IRequest): Promise<Task> {
    const createdTask = await this.tasksRepository.create({
      instrument,
      contract,
      date,
      status,
      task,
      details,
    });

    return createdTask;
  }
}
