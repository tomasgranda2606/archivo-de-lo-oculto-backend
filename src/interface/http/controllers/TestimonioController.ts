import { Request, Response, NextFunction } from 'express';
import { TestimonioService } from '../../../application/services/TestimonioService.js';
import { UnauthorizedError } from '../../../domain/errors/AppError.js';

export class TestimonioController {
  constructor(private testimonioService: TestimonioService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Debes iniciar sesión para compartir tu experiencia');
      }

      // REGLA CLAVE DE SEGURIDAD:
      // El id del usuario que crea una interacción se toma del token autenticado, NUNCA del body
      const userId = req.user.id;

      const testimonio = await this.testimonioService.create(userId, req.body);
      res.status(201).json({
        message: 'Testimonio registrado exitosamente en el archivo',
        data: testimonio,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyTestimonios = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Debes iniciar sesión para consultar tus testimonios');
      }

      const testimonios = await this.testimonioService.getMyTestimonios(req.user.id);
      res.status(200).json({
        data: testimonios,
        total: testimonios.length,
      });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const testimonios = await this.testimonioService.getAll();
      res.status(200).json({
        data: testimonios,
        total: testimonios.length,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('No autorizado');
      }

      const { id } = req.params;
      const result = await this.testimonioService.delete(id, req.user);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
