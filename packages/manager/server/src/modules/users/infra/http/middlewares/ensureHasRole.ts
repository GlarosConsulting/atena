import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import { Role } from '@modules/users/infra/typeorm/entities/UserRole';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

type MiddlewareResponse = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<void>;

export default function ensureHasRole(...roles: Role[]): MiddlewareResponse {
  return async (
    request: Request,
    _: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (!request.user) {
      throw new AppError(
        "The middleware 'ensureAuthenticated' is required to be handled before 'ensureHasRole'.",
        500,
      );
    }

    const usersRepository = container.resolve<IUsersRepository>(
      'UsersRepository',
    );

    const user = await usersRepository.findById(request.user.id);

    if (!user || !user.getRoles().some(role => roles.includes(role))) {
      throw new AppError("You can't access this route.", 403);
    }

    return next();
  };
}
