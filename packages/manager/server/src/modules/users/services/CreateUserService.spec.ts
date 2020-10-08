import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'johndoe',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should be able to create a new user referred by another', async () => {
    const user1 = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'johndoe',
      password: '123456',
    });

    const user2 = await createUser.execute({
      name: 'John Tre',
      email: 'johntre@example.com',
      username: 'johntre',
      password: '123456',
      referred_by: user1.username,
    });

    expect(user2.referred_by_id).toEqual(user1.id);
  });

  it('should be able to create a new user referred by a non-existing user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'johndoe',
      password: '123456',
      referred_by: 'non-existing-user',
    });

    expect(user.referred_by_id).toBeFalsy();
  });

  it('should not be able to create two users with the same email', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'equal.email@example.com',
      username: 'johndoe',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'John Tre',
        email: 'equal.email@example.com',
        username: 'johntre',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create two users with the same username', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'equal_username',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'John Tre',
        email: 'johntre@example.com',
        username: 'equal_username',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
