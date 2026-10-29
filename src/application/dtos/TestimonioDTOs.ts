export interface CreateTestimonioInput {
  leyendaId: string;
  lugar: string;
  descripcion: string;
  fechaAvistamiento?: string | Date;
}
