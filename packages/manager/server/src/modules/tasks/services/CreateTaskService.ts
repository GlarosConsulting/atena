import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authenticationConfig from '@config/authentication';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Task from '../infra/typeorm/entities/Task';
import ITasksRepository from '../repositories/ITasksRepository';

interface IRequest {
  instrument: string;
  date: Date;
  status: string;
  task: string;
  details: string;
}

@injectable()
class CreateTaskService {
  constructor(
    @inject('TasksRepository')
    private tasksRepository: ITasksRepository,
  ) {}

  public async execute({
    instrument,
    date,
    status,
    task,
    details,
  }: IRequest): Promise<Task> {
    const createdTask = await this.tasksRepository.create({
      instrument,
      date,
      status,
      task,
      details,
    });

    return createdTask;
  }
}

export default CreateTaskService;
