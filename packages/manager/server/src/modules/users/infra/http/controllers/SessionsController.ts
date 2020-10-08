import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import LogOutUserService from '@modules/users/services/LogOutUserService';
import RefreshAccessTokenService from '@modules/users/services/RefreshAccessTokenService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const {
      user,
      access_token,
      refresh_token,
    } = await authenticateUser.execute({
      username,
      password,
    });

    return response.json({
      user: classToClass(user),
      access_token,
      refresh_token,
    });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { refresh_token } = request.body;

    const refreshAccessToken = container.resolve(RefreshAccessTokenService);

    const { access_token } = await refreshAccessToken.execute({
      refresh_token,
    });

    return response.json({ access_token });
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { access_token } = request.body;

    const logOutUser = container.resolve(LogOutUserService);

    await logOutUser.execute({
      access_token,
    });

    return response.json().send();
  }
}
