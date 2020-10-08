import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      username: Joi.string()
        .lowercase()
        .regex(/^[a-z0-9]+([._]?[a-z0-9]+)*$/)
        .required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);
sessionsRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      refresh_token: Joi.string().required(),
    },
  }),
  sessionsController.update,
);
sessionsRouter.delete(
  '/',
  celebrate({
    [Segments.BODY]: {
      access_token: Joi.string().required(),
    },
  }),
  sessionsController.delete,
);

export default sessionsRouter;
