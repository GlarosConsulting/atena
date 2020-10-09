import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateTaskService from './CreateTaskService';

let fakeUsersRepository: FakeUsersRepository;
let createTask: CreateTaskService;

describe('CreateTask', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    createTask = new CreateTaskService(fakeUsersRepository);
  });

  it('should be able to create task', async () => {
    const task = await createTask.execute({
      instrument: '',
      date: new Date(),
      status: '',
      task: '',
      details: '',
    });

    expect(task).toEqual(
      expect.objectContaining({
        instrument: expect.any(String),
        date: expect.any(Date),
        status: expect.any(String),
        task: expect.any(String),
        details: expect.any(String),
      }),
    );
  });
});
