import { getRepository, Repository } from 'typeorm';

import ICreateTaskDTO from '@modules/tasks/dtos/ICreateTaskDTO';
import ITasksRepository from '@modules/tasks/repositories/ITasksRepository';

import Task from '../entities/Task';

class TasksRepository implements ITasksRepository {
  private ormRepository: Repository<Task>;

  constructor() {
    this.ormRepository = getRepository(Task);
  }

  public async findAll(): Promise<Task[]> {
    return this.ormRepository.find({ relations: ['alerts'] });
  }

  public async findById(id: string): Promise<Task | undefined> {
    const task = await this.ormRepository.findOne(id, {
      relations: ['alerts'],
    });

    return task;
  }

  public async create(data: ICreateTaskDTO): Promise<Task> {
    const task = this.ormRepository.create(data);

    await this.ormRepository.save(task);

    return task;
  }
}

export default TasksRepository;
