import merge from 'lodash/merge';
import { v4 } from 'uuid';

import ICreateTaskAlertDTO from '../../dtos/ICreateTaskAlertDTO';
import TaskAlert from '../../infra/typeorm/entities/TaskAlert';
import ITaskAlertsRepository from '../ITaskAlertsRepository';

class FakeTaskAlertsRepository implements ITaskAlertsRepository {
  private taskAlerts: TaskAlert[] = [];

  public async findAll(): Promise<TaskAlert[]> {
    return this.taskAlerts;
  }

  public async create(data: ICreateTaskAlertDTO): Promise<TaskAlert> {
    const taskAlert = new TaskAlert();

    merge(taskAlert, { id: v4() }, data);

    this.taskAlerts.push(taskAlert);

    return taskAlert;
  }
}

export default FakeTaskAlertsRepository;
