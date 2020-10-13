import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

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
      date: Joi.date().required(),
      status: Joi.string().required(),
      task: Joi.string().required(),
      details: Joi.string().required(),
    },
  }),
  tasksController.create,
);

tasksRouter.post(
  '/:id/alerts',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      date: Joi.date().required(),
      description: Joi.string().required(),
    },
  }),
  taskAlertsController.create,
);

tasksRouter.get('/filtered', listTasksFilteredController.index);

export default tasksRouter;
