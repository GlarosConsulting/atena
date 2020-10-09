import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import RefreshAccessTokenService from './RefreshAccessTokenService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;
let refreshAccessToken: RefreshAccessTokenService;

describe('RefreshAccessToken', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    refreshAccessToken = new RefreshAccessTokenService(fakeCacheProvider);
  });

  it('should be able to refresh token', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'johndoe',
      password: '123456',
    });

    const { refresh_token } = await authenticateUser.execute({
      username: 'johndoe',
      password: '123456',
    });

    const response = await refreshAccessToken.execute({
      refresh_token,
    });

    expect(response).toHaveProperty('access_token');
  });

  it('should not be able to refresh token without authenticating before', async () => {
    await expect(
      refreshAccessToken.execute({
        refresh_token: 'invalid-token',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to refresh token with invalid token', async () => {
    fakeCacheProvider.save('refresh-tokens', ['refresh-token']);

    await expect(
      refreshAccessToken.execute({
        refresh_token: 'refresh-token',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
