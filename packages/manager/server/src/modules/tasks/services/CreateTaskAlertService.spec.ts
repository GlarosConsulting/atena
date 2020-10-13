import FakeTaskAlertsRepository from '../repositories/fakes/FakeTaskAlertsRepository';
import FakeTasksRepository from '../repositories/fakes/FakeTasksRepository';
import CreateTaskAlertService from './CreateTaskAlertService';

let fakeTasksRepository: FakeTasksRepository;
let fakeTaskAlertsRepository: FakeTaskAlertsRepository;
let createTaskAlert: CreateTaskAlertService;

describe('CreateTaskAlert', () => {
  beforeEach(() => {
    fakeTasksRepository = new FakeTasksRepository();
    fakeTaskAlertsRepository = new FakeTaskAlertsRepository();

    createTaskAlert = new CreateTaskAlertService(
      fakeTasksRepository,
      fakeTaskAlertsRepository,
    );
  });

  it('should be able to create task alert', async () => {
    const task = await fakeTasksRepository.create({
      instrument: '777-666',
      date: new Date(),
      status: 'Execução',
      task: 'Contrato/Subconvênio',
      details: 'Cadastrar propostas da empresa',
    });

    const taskAlert = await createTaskAlert.execute({
      task_id: task.id,
      user_id: 'any-user',
      date: new Date(),
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
});
