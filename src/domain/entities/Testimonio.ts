import { SafeUser } from './User.js';
import { LeyendaEntity } from './Leyenda.js';

export interface TestimonioEntity {
  id: string;
  userId: string;
  leyendaId: string;
  lugar: string;
  descripcion: string;
  fechaAvistamiento: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user?: SafeUser;
  leyenda?: LeyendaEntity;
}
