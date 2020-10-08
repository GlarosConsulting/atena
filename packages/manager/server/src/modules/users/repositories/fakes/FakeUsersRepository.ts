import merge from 'lodash/merge';
import { v4 } from 'uuid';

import AppError from '@shared/errors/AppError';

import ICreateUserDTO from '../../dtos/ICreateUserDTO';
import User from '../../infra/typeorm/entities/User';
import { Role } from '../../infra/typeorm/entities/UserRole';
import IUsersRepository from '../IUsersRepository';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async findByUsername(username: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.username === username);

    return findUser;
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = new User();

    merge(user, { id: v4(), roles: [] }, data);

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }

  public async removeRoleFromUser(user_id: string, role: Role): Promise<void> {
    const findUser = this.users.find(user => user.id === user_id);

    if (!findUser) {
      throw new AppError('User not found.');
    }

    findUser.roles = findUser.roles.filter(userRole => userRole.role !== role);

    await this.save(findUser);
  }
}

export default FakeUsersRepository;
