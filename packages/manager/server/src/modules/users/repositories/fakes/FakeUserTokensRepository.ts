import merge from 'lodash/merge';
import { v4 } from 'uuid';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../../infra/typeorm/entities/UserToken';

class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    merge(userToken, {
      id: v4(),
      token: v4(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const findUserToken = this.userTokens.find(
      userToken => userToken.token === token,
    );

    return findUserToken;
  }

  public async save(userToken: UserToken): Promise<UserToken> {
    const findIndex = this.userTokens.findIndex(
      findUserToken => findUserToken.id === userToken.id,
    );

    this.userTokens[findIndex] = userToken;

    return userToken;
  }
}

export default FakeUserTokensRepository;
