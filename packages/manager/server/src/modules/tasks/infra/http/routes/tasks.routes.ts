import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import ListTasksFilteredController from '../controllers/ListTasksFilteredController';
import TaskAlertsController from '../controllers/TaskAlertsController';
import TasksController from '../controllers/TasksController';

const tasksRouter = Router();
const tasksController = new TasksController();
const taskAlertsController = new TaskAlertsController();
const listTasksFilteredController = new ListTasksFilteredController();

tasksRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      instrument: Joi.string().required(),
      contract: Joi.string().required(),
      date: Joi.date().required(),
      status: Joi.string().required(),
      task: Joi.string().required(),
      details: Joi.string().required(),
      monitor: Joi.boolean().default(false),
    },
  }),
  tasksController.create,
);

tasksRouter.post(
  '/:id/alerts',
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.string().uuid().optional(),
      description: Joi.string().required(),
    },
  }),
  taskAlertsController.create,
);

tasksRouter.get('/filtered', listTasksFilteredController.index);

export default tasksRouter;
