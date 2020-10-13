import ICreateTaskAlertDTO from '../dtos/ICreateTaskAlertDTO';
import TaskAlert from '../infra/typeorm/entities/TaskAlert';

export default interface ITaskAlertsRepository {
  create(data: ICreateTaskAlertDTO): Promise<TaskAlert>;
}
