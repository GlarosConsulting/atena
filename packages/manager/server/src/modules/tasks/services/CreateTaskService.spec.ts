import FakeTasksRepository from '../repositories/fakes/FakeTasksRepository';
import CreateTaskService from './CreateTaskService';

let fakeTasksRepository: FakeTasksRepository;
let createTask: CreateTaskService;

describe('CreateTask', () => {
  beforeEach(() => {
    fakeTasksRepository = new FakeTasksRepository();

    createTask = new CreateTaskService(fakeTasksRepository);
  });

  it('should be able to create task', async () => {
    const task = await createTask.execute({
      instrument: '777-666',
      contract: 'any-contract',
      date: new Date(),
      status: 'Execução',
      task: 'Contrato/Subconvênio',
      details: 'Cadastrar propostas da empresa',
    });

    expect(task).toEqual(
      expect.objectContaining({
        instrument: expect.any(String),
        date: expect.any(Date),
        status: expect.any(String),
        task: expect.any(String),
        details: expect.any(String),
        alerts: expect.any(Array),
      }),
    );
  });
});
