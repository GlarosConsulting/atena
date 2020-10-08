import { verify } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authenticationConfig from '@config/authentication';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  sub: string;
}

interface IRequest {
  access_token: string;
}

@injectable()
class LogOutUserService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ access_token }: IRequest): Promise<boolean> {
    const { accessTokenSecret } = authenticationConfig.jwt;

    try {
      const decoded = verify(access_token, accessTokenSecret);

      const { sub } = decoded as ITokenPayload;

      const recoveredRefreshTokens = await this.cacheProvider.recover<
        Record<string, string>
      >('refresh-token');

      const refreshTokens = recoveredRefreshTokens || {};

      delete refreshTokens[sub];

      await this.cacheProvider.save('refresh-tokens', refreshTokens);

      return true;
    } catch (err) {
      throw new AppError('Invalid refresh token.', 401);
    }
  }
}

export default LogOutUserService;
