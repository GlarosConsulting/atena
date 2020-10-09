import merge from 'lodash/merge';
import { v4 } from 'uuid';

import ICreateTaskDTO from '../../dtos/ICreateTaskDTO';
import Task from '../../infra/typeorm/entities/Task';
import ITasksRepository from '../ITasksRepository';

class FakeTasksRepository implements ITasksRepository {
  private tasks: Task[] = [];

  public async create(data: ICreateTaskDTO): Promise<Task> {
    const task = new Task();

    merge(task, { id: v4() }, data);

    this.tasks.push(task);

    return task;
  }
}

export default FakeTasksRepository;
