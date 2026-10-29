export interface CreateLeyendaInput {
  nombre: string;
  region: string;
  categoria: string;
  veracidad?: number;
  descripcion: string;
  historia: string;
  imagen: string;
}

export type UpdateLeyendaInput = Partial<CreateLeyendaInput>;
