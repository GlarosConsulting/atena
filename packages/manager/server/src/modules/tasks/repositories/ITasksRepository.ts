import ICreateTaskDTO from '../dtos/ICreateTaskDTO';
import Task from '../infra/typeorm/entities/Task';

export default interface ITasksRepository {
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | undefined>;
  create(data: ICreateTaskDTO): Promise<Task>;
}
