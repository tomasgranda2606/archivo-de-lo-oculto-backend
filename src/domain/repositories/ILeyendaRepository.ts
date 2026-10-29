import { LeyendaEntity } from '../entities/Leyenda.js';

export interface LeyendaFilters {
  categoria?: string;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T[];
}

export interface CreateLeyendaData {
  nombre: string;
  region: string;
  categoria: string;
  veracidad: number;
  descripcion: string;
  historia: string;
  imagen: string;
}

export type UpdateLeyendaData = Partial<CreateLeyendaData>;

export interface ILeyendaRepository {
  findMany(filters: LeyendaFilters, pagination: PaginationOptions): Promise<PaginatedResult<LeyendaEntity>>;
  findById(id: string): Promise<LeyendaEntity | null>;
  create(data: CreateLeyendaData): Promise<LeyendaEntity>;
  update(id: string, data: UpdateLeyendaData): Promise<LeyendaEntity | null>;
  delete(id: string): Promise<boolean>;
}
