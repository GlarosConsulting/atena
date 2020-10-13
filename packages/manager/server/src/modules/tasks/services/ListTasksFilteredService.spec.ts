import { addDays } from 'date-fns';

import FakeTasksRepository from '../repositories/fakes/FakeTasksRepository';
import ListTasksFilteredService from './ListTasksFilteredService';

let fakeTasksRepository: FakeTasksRepository;
let listTasksFiltered: ListTasksFilteredService;

describe('ListTasksFiltered', () => {
  beforeEach(() => {
    fakeTasksRepository = new FakeTasksRepository();

    listTasksFiltered = new ListTasksFilteredService(fakeTasksRepository);
  });

  it('should be able to list tasks filtered', async () => {
    fakeTasksRepository.create({
      instrument: '777-666',
      date: new Date(),
      status: 'Execução',
      task: 'Contrato/Subconvênio',
      details: 'Cadastrar propostas da empresa',
    });

    fakeTasksRepository.create({
      instrument: '777-666',
      date: addDays(new Date(), 5),
      status: 'Execução',
      task: 'Contrato/Subconvênio',
      details: 'Cadastrar propostas da empresa',
    });

    const task = await listTasksFiltered.execute();

    expect(task).toEqual({
      urgent: expect.arrayContaining([
        expect.objectContaining({
          instrument: expect.any(String),
          date: expect.any(Date),
          status: expect.any(String),
          task: expect.any(String),
          details: expect.any(String),
          alerts: expect.any(Array),
        }),
      ]),
      next: expect.arrayContaining([
        expect.objectContaining({
          instrument: expect.any(String),
          date: expect.any(Date),
          status: expect.any(String),
          task: expect.any(String),
          details: expect.any(String),
          alerts: expect.any(Array),
        }),
      ]),
    });
  });
});
