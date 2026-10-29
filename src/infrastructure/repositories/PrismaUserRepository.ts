import { prisma } from '../database/prisma.js';
import { IUserRepository, CreateUserData } from '../../domain/repositories/IUserRepository.js';
import { UserEntity, SafeUser } from '../../domain/entities/User.js';

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;

    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      password: user.password,
      role: user.role as 'admin' | 'user',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;

    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      password: user.password,
      role: user.role as 'admin' | 'user',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async create(data: CreateUserData): Promise<SafeUser> {
    const user = await prisma.user.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        role: data.role || 'user',
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role as 'admin' | 'user',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
