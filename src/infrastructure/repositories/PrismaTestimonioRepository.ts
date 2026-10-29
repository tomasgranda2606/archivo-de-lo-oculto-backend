import { prisma } from '../database/prisma.js';
import {
  ITestimonioRepository,
  CreateTestimonioData,
} from '../../domain/repositories/ITestimonioRepository.js';
import { TestimonioEntity } from '../../domain/entities/Testimonio.js';

export class PrismaTestimonioRepository implements ITestimonioRepository {
  async create(data: CreateTestimonioData): Promise<TestimonioEntity> {
    const created = await prisma.testimonio.create({
      data: {
        userId: data.userId,
        leyendaId: data.leyendaId,
        lugar: data.lugar,
        descripcion: data.descripcion,
        fechaAvistamiento: data.fechaAvistamiento ?? null,
      },
      include: {
        leyenda: true,
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return {
      ...created,
      user: created.user
        ? {
            ...created.user,
            role: created.user.role as 'admin' | 'user',
          }
        : undefined,
    };
  }

  async findByUserId(userId: string): Promise<TestimonioEntity[]> {
    const list = await prisma.testimonio.findMany({
      where: { userId },
      include: {
        leyenda: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return list;
  }

  async findAll(): Promise<TestimonioEntity[]> {
    const list = await prisma.testimonio.findMany({
      include: {
        leyenda: true,
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return list.map((item) => ({
      ...item,
      user: item.user
        ? {
            ...item.user,
            role: item.user.role as 'admin' | 'user',
          }
        : undefined,
    }));
  }

  async findById(id: string): Promise<TestimonioEntity | null> {
    const item = await prisma.testimonio.findUnique({
      where: { id },
      include: {
        leyenda: true,
      },
    });

    return item;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.testimonio.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
