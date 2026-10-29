import {
  ILeyendaRepository,
  LeyendaFilters,
  PaginationOptions,
  PaginatedResult,
} from '../../domain/repositories/ILeyendaRepository.js';
import { LeyendaEntity } from '../../domain/entities/Leyenda.js';
import { NotFoundError, BadRequestError } from '../../domain/errors/AppError.js';
import { CreateLeyendaInput, UpdateLeyendaInput } from '../dtos/LeyendaDTOs.js';

export class LeyendaService {
  constructor(private leyendaRepository: ILeyendaRepository) {}

  async getAll(
    filters: LeyendaFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<LeyendaEntity>> {
    const page = pagination.page > 0 ? pagination.page : 1;
    const limit = pagination.limit > 0 && pagination.limit <= 50 ? pagination.limit : 6;

    return this.leyendaRepository.findMany(filters, { page, limit });
  }

  async getById(id: string): Promise<LeyendaEntity> {
    if (!id) {
      throw new BadRequestError('El ID de la leyenda es requerido');
    }

    const leyenda = await this.leyendaRepository.findById(id);
    if (!leyenda) {
      throw new NotFoundError(`Leyenda con ID ${id} no encontrada`);
    }

    return leyenda;
  }

  async create(input: CreateLeyendaInput): Promise<LeyendaEntity> {
    if (!input.nombre || input.nombre.trim().length === 0) {
      throw new BadRequestError('El nombre de la leyenda es obligatorio');
    }
    if (!input.region || input.region.trim().length === 0) {
      throw new BadRequestError('La región de origen es obligatoria');
    }
    if (!input.categoria || input.categoria.trim().length === 0) {
      throw new BadRequestError('La categoría es obligatoria');
    }
    if (!input.descripcion || input.descripcion.trim().length < 10) {
      throw new BadRequestError('La descripción debe tener al menos 10 caracteres');
    }
    if (!input.historia || input.historia.trim().length < 20) {
      throw new BadRequestError('La historia debe tener al menos 20 caracteres');
    }

    return this.leyendaRepository.create({
      nombre: input.nombre.trim(),
      region: input.region.trim(),
      categoria: input.categoria.trim(),
      veracidad: input.veracidad ?? 3,
      descripcion: input.descripcion.trim(),
      historia: input.historia.trim(),
      imagen: input.imagen?.trim() || '/imagenes/placeholder.jpg',
    });
  }

  async update(id: string, input: UpdateLeyendaInput): Promise<LeyendaEntity> {
    await this.getById(id);

    const updated = await this.leyendaRepository.update(id, {
      ...(input.nombre && { nombre: input.nombre.trim() }),
      ...(input.region && { region: input.region.trim() }),
      ...(input.categoria && { categoria: input.categoria.trim() }),
      ...(input.veracidad !== undefined && { veracidad: input.veracidad }),
      ...(input.descripcion && { descripcion: input.descripcion.trim() }),
      ...(input.historia && { historia: input.historia.trim() }),
      ...(input.imagen && { imagen: input.imagen.trim() }),
    });

    if (!updated) {
      throw new NotFoundError(`Leyenda con ID ${id} no encontrada`);
    }

    return updated;
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    await this.getById(id);
    const deleted = await this.leyendaRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError(`No se pudo eliminar la leyenda con ID ${id}`);
    }
    return { success: true, message: 'Leyenda eliminada exitosamente' };
  }
}
