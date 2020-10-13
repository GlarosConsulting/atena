import { getRepository, Repository } from 'typeorm';

import ICreateTaskAlertDTO from '@modules/tasks/dtos/ICreateTaskAlertDTO';
import ITaskAlertsRepository from '@modules/tasks/repositories/ITaskAlertsRepository';

import TaskAlert from '../entities/TaskAlert';

class TaskAlertsRepository implements ITaskAlertsRepository {
  private ormRepository: Repository<TaskAlert>;

  constructor() {
    this.ormRepository = getRepository(TaskAlert);
  }

  public async create(data: ICreateTaskAlertDTO): Promise<TaskAlert> {
    const taskAlert = this.ormRepository.create(data);

    await this.ormRepository.save(taskAlert);

    return taskAlert;
  }
}

export default TaskAlertsRepository;
