import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../../infrastructure/security/JwtService.js';
import { UnauthorizedError } from '../../../domain/errors/AppError.js';

export interface AuthenticatedUser {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const jwtService = new JwtService();

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('Token no proporcionado. Debe incluir la cabecera Authorization: Bearer <token>');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new UnauthorizedError('Formato de token inválido. Debe ser Bearer <token>');
  }

  const token = parts[1];

  try {
    const payload = jwtService.verify(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}
