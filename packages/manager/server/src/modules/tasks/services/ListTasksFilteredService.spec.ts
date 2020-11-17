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
      contract: 'any-contract',
      date: new Date(),
      status: 'Execução',
      task: 'Contrato/Subconvênio',
      details: 'Cadastrar propostas da empresa',
    });

    fakeTasksRepository.create({
      instrument: '666-777',
      contract: 'any-contract',
      date: addDays(new Date(), 6),
      status: 'Execução',
      task: 'Contrato/Subconvênio',
      details: 'Cadastrar propostas da empresa',
    });

    const task = await listTasksFiltered.execute();

    expect(task).toEqual({
      urgent: expect.arrayContaining([
        expect.objectContaining({
          instrument: expect.any(String),
          contract: expect.any(String),
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
          contract: expect.any(String),
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
