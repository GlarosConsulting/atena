import { verify, sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authenticationConfig from '@config/authentication';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  sub: string;
}

interface IRequest {
  refresh_token: string;
}

interface IResponse {
  access_token: string;
}

@injectable()
class RefreshAccessTokenService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ refresh_token }: IRequest): Promise<IResponse> {
    const refreshTokens = await this.cacheProvider.recover<
      Record<string, string>
    >('refresh-tokens');

    if (
      !refreshTokens ||
      !Object.values(refreshTokens).includes(refresh_token)
    ) {
      throw new AppError('Invalid refresh token.', 401);
    }

    const {
      refreshTokenSecret,
      accessTokenSecret,
      expiresIn,
    } = authenticationConfig.jwt;

    try {
      const decoded = verify(refresh_token, refreshTokenSecret);

      const { sub } = decoded as ITokenPayload;

      const access_token = sign({}, accessTokenSecret, {
        subject: sub,
        expiresIn,
      });

      return { access_token };
    } catch (err) {
      throw new AppError('Invalid refresh token.', 401);
    }
  }
}

export default RefreshAccessTokenService;
