import { TestimonioEntity } from '../entities/Testimonio.js';

export interface CreateTestimonioData {
  userId: string;
  leyendaId: string;
  lugar: string;
  descripcion: string;
  fechaAvistamiento?: Date | null;
}

export interface ITestimonioRepository {
  create(data: CreateTestimonioData): Promise<TestimonioEntity>;
  findByUserId(userId: string): Promise<TestimonioEntity[]>;
  findAll(): Promise<TestimonioEntity[]>;
  findById(id: string): Promise<TestimonioEntity | null>;
  delete(id: string): Promise<boolean>;
}
