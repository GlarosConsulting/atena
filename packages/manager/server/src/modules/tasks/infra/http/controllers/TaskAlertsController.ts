import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateTaskAlertService from '@modules/tasks/services/CreateTaskAlertService';

export default class TaskAlertsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const task_id = request.params.id;
    const user_id = request.user.id;
    const { date, description } = request.body;

    const createTaskAlert = container.resolve(CreateTaskAlertService);

    const taskAlert = await createTaskAlert.execute({
      task_id,
      user_id,
      date,
      description,
    });

    return response.json(classToClass(taskAlert));
  }
}
