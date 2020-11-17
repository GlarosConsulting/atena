import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateTaskService from '@modules/tasks/services/CreateTaskService';

export default class TasksController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { instrument, contract, date, status, task, details } = request.body;

    const createTask = container.resolve(CreateTaskService);

    const createdTask = await createTask.execute({
      instrument,
      contract,
      date,
      status,
      task,
      details,
    });

    return response.json(classToClass(createdTask));
  }
}
