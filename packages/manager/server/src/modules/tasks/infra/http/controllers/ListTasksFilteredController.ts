import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListTasksFilteredService from '@modules/tasks/services/ListTasksFilteredService';

export default class ListTasksFilteredController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listTasksFiltered = container.resolve(ListTasksFilteredService);

    const filteredTasks = await listTasksFiltered.execute();

    return response.json(classToClass(filteredTasks));
  }
}
