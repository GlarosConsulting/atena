import { container } from 'tsyringe';

import '@modules/users/providers';

import './providers';

import TaskAlertsRepository from '@modules/tasks/infra/typeorm/repositories/TaskAlertsRepository';
import TasksRepository from '@modules/tasks/infra/typeorm/repositories/TasksRepository';
import ITaskAlertsRepository from '@modules/tasks/repositories/ITaskAlertsRepository';
import ITasksRepository from '@modules/tasks/repositories/ITasksRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<ITasksRepository>(
  'TasksRepository',
  TasksRepository,
);

container.registerSingleton<ITaskAlertsRepository>(
  'TaskAlertsRepository',
  TaskAlertsRepository,
);
