import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authenticationConfig from '@config/authentication';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  username: string;
  password: string;
}

interface IResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ username, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      throw new AppError('Incorrect username/password combination.', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect username/password combination.', 401);
    }

    const {
      accessTokenSecret,
      refreshTokenSecret,
      expiresIn,
    } = authenticationConfig.jwt;

    const access_token = sign({}, accessTokenSecret, {
      subject: user.id,
      expiresIn,
    });

    const refresh_token = sign({}, refreshTokenSecret, {
      subject: user.id,
    });

    const recoveredRefreshTokens = await this.cacheProvider.recover<
      Record<string, string>
    >('refresh-tokens');

    const refreshTokens = recoveredRefreshTokens || {};

    refreshTokens[user.id] = refresh_token;

    await this.cacheProvider.save('refresh-tokens', refreshTokens);

    return { user, access_token, refresh_token };
  }
}

export default AuthenticateUserService;
