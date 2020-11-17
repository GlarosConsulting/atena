import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeTaskAlertsRepository from '../repositories/fakes/FakeTaskAlertsRepository';
import FakeTasksRepository from '../repositories/fakes/FakeTasksRepository';
import CreateTaskAlertService from './CreateTaskAlertService';

let fakeTasksRepository: FakeTasksRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeTaskAlertsRepository: FakeTaskAlertsRepository;
let createTaskAlert: CreateTaskAlertService;

describe('CreateTaskAlert', () => {
  beforeEach(() => {
    fakeTasksRepository = new FakeTasksRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeTaskAlertsRepository = new FakeTaskAlertsRepository();

    createTaskAlert = new CreateTaskAlertService(
      fakeTasksRepository,
      fakeUsersRepository,
      fakeTaskAlertsRepository,
    );
  });

  it('should be able to create task alert', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    const task = await fakeTasksRepository.create({
      instrument: '777-666',
      contract: 'any-contract',
      date: new Date(),
      status: 'Execução',
      task: 'Contrato/Subconvênio',
      details: 'Cadastrar propostas da empresa',
    });

    const taskAlert = await createTaskAlert.execute({
      task_id: task.id,
      user_id: user.id,
      description: 'Alerta criado',
    });

    expect(taskAlert).toEqual(
      expect.objectContaining({
        task_id: expect.any(String),
        date: expect.any(Date),
        description: expect.any(String),
      }),
    );
  });

  it('should not be able to create task alert with non-existing task id', async () => {
    await expect(
      createTaskAlert.execute({
        task_id: 'non-existing-task',
        user_id: 'any-user',
        description: 'Alerta criado',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create task alert with non-existing user id', async () => {
    const task = await fakeTasksRepository.create({
      instrument: '777-666',
      contract: 'any-contract',
      date: new Date(),
      status: 'Execução',
      task: 'Contrato/Subconvênio',
      details: 'Cadastrar propostas da empresa',
    });

    await expect(
      createTaskAlert.execute({
        task_id: task.id,
        user_id: 'non-existing-user',
        description: 'Alerta criado',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
