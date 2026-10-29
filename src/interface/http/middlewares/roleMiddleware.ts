import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../../../domain/errors/AppError.js';

export function requireRole(allowedRole: 'admin' | 'user') {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Usuario no autenticado'));
    }

    if (req.user.role !== allowedRole) {
      return next(new ForbiddenError(`Acceso denegado: se requiere rol de ${allowedRole}`));
    }

    next();
  };
}

export const soloAdmin = requireRole('admin');
