import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import ProfileController from '../controllers/ProfileController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string(),
      email: Joi.string().email(),
      username: Joi.string().lowercase(),
      old_password: Joi.string(),
      password: Joi.string().min(6).optional(),
      password_confirmation: Joi.string().when('password', {
        is: Joi.exist(),
        then: Joi.valid(Joi.ref('password')).required(),
        otherwise: Joi.optional(),
      }),
    },
  }),
  profileController.update,
);

export default profileRouter;
