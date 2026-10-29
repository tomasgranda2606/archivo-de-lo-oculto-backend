import { prisma } from '../database/prisma.js';
import {
  ILeyendaRepository,
  LeyendaFilters,
  PaginationOptions,
  PaginatedResult,
  CreateLeyendaData,
  UpdateLeyendaData,
} from '../../domain/repositories/ILeyendaRepository.js';
import { LeyendaEntity } from '../../domain/entities/Leyenda.js';
import { Prisma } from '@prisma/client';

export class PrismaLeyendaRepository implements ILeyendaRepository {
  async findMany(
    filters: LeyendaFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<LeyendaEntity>> {
    const where: Prisma.LeyendaWhereInput = {};

    if (filters.categoria && filters.categoria !== 'todas') {
      where.categoria = {
        equals: filters.categoria,
        mode: 'insensitive',
      };
    }

    if (filters.search && filters.search.trim().length > 0) {
      const s = filters.search.trim();
      where.OR = [
        { nombre: { contains: s, mode: 'insensitive' } },
        { region: { contains: s, mode: 'insensitive' } },
        { descripcion: { contains: s, mode: 'insensitive' } },
      ];
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const take = pagination.limit;

    const [total, items] = await Promise.all([
      prisma.leyenda.count({ where }),
      prisma.leyenda.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalPages = Math.ceil(total / pagination.limit) || 1;

    return {
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
      },
      data: items,
    };
  }

  async findById(id: string): Promise<LeyendaEntity | null> {
    return prisma.leyenda.findUnique({
      where: { id },
    });
  }

  async create(data: CreateLeyendaData): Promise<LeyendaEntity> {
    return prisma.leyenda.create({
      data,
    });
  }

  async update(id: string, data: UpdateLeyendaData): Promise<LeyendaEntity | null> {
    try {
      return await prisma.leyenda.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.leyenda.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
