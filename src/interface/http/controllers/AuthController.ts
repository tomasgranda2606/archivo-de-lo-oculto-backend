import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../../application/services/AuthService.js';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).json({
        message: 'Inicio de sesión exitoso',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  };
}
