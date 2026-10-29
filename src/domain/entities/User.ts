export type UserRole = 'admin' | 'user';

export interface UserEntity {
  id: string;
  nombre: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUser = Omit<UserEntity, 'password'>;
