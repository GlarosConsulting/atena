import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import LogOutUserService from './LogOutUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;
let logOutUser: LogOutUserService;

describe('LogOutUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    logOutUser = new LogOutUserService(fakeCacheProvider);
  });

  it('should be able to log out', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'johndoe',
      password: '123456',
    });

    const { access_token } = await authenticateUser.execute({
      username: 'johndoe',
      password: '123456',
    });

    const response = await logOutUser.execute({
      access_token,
    });

    expect(response).toBe(true);
  });

  it('should not be able to log out with invalid access token', async () => {
    await expect(
      logOutUser.execute({
        access_token: 'invalid-token',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
