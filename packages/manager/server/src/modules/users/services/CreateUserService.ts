import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  username: string;
  password: string;
  referred_by?: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    name,
    email,
    username,
    password,
    referred_by,
  }: IRequest): Promise<User> {
    const checkEmailExists = await this.usersRepository.findByEmail(email);

    if (checkEmailExists) {
      throw new AppError('Email address already used.');
    }

    const checkUsernameExists = await this.usersRepository.findByUsername(
      username,
    );

    if (checkUsernameExists) {
      throw new AppError('Username already used.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    let referred_by_id;

    if (referred_by) {
      const referredByUser = await this.usersRepository.findByUsername(
        referred_by,
      );

      referred_by_id = referredByUser?.id;
    }

    const user = await this.usersRepository.create({
      name,
      email,
      username,
      password: hashedPassword,
      referred_by_id,
    });

    return user;
  }
}

export default CreateUserService;
