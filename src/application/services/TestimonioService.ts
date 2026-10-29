import { ITestimonioRepository } from '../../domain/repositories/ITestimonioRepository.js';
import { ILeyendaRepository } from '../../domain/repositories/ILeyendaRepository.js';
import { TestimonioEntity } from '../../domain/entities/Testimonio.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../domain/errors/AppError.js';
import { CreateTestimonioInput } from '../dtos/TestimonioDTOs.js';

export class TestimonioService {
  constructor(
    private testimonioRepository: ITestimonioRepository,
    private leyendaRepository: ILeyendaRepository
  ) {}

  async create(userId: string, input: CreateTestimonioInput): Promise<TestimonioEntity> {
    if (!userId) {
      throw new BadRequestError('El usuario creador es requerido');
    }
    if (!input.leyendaId) {
      throw new BadRequestError('Debe asociar el testimonio a una leyenda del catálogo');
    }
    if (!input.lugar || input.lugar.trim().length === 0) {
      throw new BadRequestError('El lugar de los hechos o región es obligatorio');
    }
    if (!input.descripcion || input.descripcion.trim().length < 15) {
      throw new BadRequestError('El testimonio debe tener al menos 15 caracteres');
    }

    const leyenda = await this.leyendaRepository.findById(input.leyendaId);
    if (!leyenda) {
      throw new NotFoundError('La leyenda referenciada no existe');
    }

    let parsedFecha: Date | null = null;
    if (input.fechaAvistamiento) {
      const d = new Date(input.fechaAvistamiento);
      if (!isNaN(d.getTime())) {
        parsedFecha = d;
      }
    }

    return this.testimonioRepository.create({
      userId,
      leyendaId: input.leyendaId,
      lugar: input.lugar.trim(),
      descripcion: input.descripcion.trim(),
      fechaAvistamiento: parsedFecha,
    });
  }

  async getMyTestimonios(userId: string): Promise<TestimonioEntity[]> {
    if (!userId) {
      throw new BadRequestError('Usuario no especificado');
    }
    return this.testimonioRepository.findByUserId(userId);
  }

  async getAll(): Promise<TestimonioEntity[]> {
    return this.testimonioRepository.findAll();
  }

  async delete(
    id: string,
    currentUser: { id: string; role: string }
  ): Promise<{ success: boolean; message: string }> {
    const testimonio = await this.testimonioRepository.findById(id);
    if (!testimonio) {
      throw new NotFoundError('Testimonio no encontrado');
    }

    // Solo el autor o un administrador pueden eliminarlo
    if (currentUser.role !== 'admin' && testimonio.userId !== currentUser.id) {
      throw new ForbiddenError('No tienes permisos para eliminar este testimonio');
    }

    const deleted = await this.testimonioRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('No se pudo eliminar el testimonio');
    }

    return { success: true, message: 'Testimonio eliminado exitosamente' };
  }
}
