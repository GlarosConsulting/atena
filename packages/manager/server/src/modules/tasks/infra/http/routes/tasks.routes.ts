import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import TasksController from '../controllers/TasksController';

const tasksRouter = Router();
const tasksController = new TasksController();

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

export default tasksRouter;
