import { UserEntity, SafeUser } from '../entities/User.js';

export interface CreateUserData {
  nombre: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  create(data: CreateUserData): Promise<SafeUser>;
}
