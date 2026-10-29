import { Request, Response, NextFunction } from 'express';
import { LeyendaService } from '../../../application/services/LeyendaService.js';

export class LeyendaController {
  constructor(private leyendaService: LeyendaService) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 6;
      const categoria = req.query.categoria as string | undefined;
      const search = req.query.search as string | undefined;

      const result = await this.leyendaService.getAll(
        { categoria, search },
        { page, limit }
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const leyenda = await this.leyendaService.getById(id);
      res.status(200).json(leyenda);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const leyenda = await this.leyendaService.create(req.body);
      res.status(201).json({
        message: 'Leyenda creada exitosamente',
        data: leyenda,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const leyenda = await this.leyendaService.update(id, req.body);
      res.status(200).json({
        message: 'Leyenda actualizada exitosamente',
        data: leyenda,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.leyendaService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
