import ICreateTaskDTO from '../dtos/ICreateTaskDTO';
import Task from '../infra/typeorm/entities/Task';

export default interface ITasksRepository {
  create(data: ICreateTaskDTO): Promise<Task>;
}
