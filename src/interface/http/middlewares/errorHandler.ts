import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../domain/errors/AppError.js';
import { Prisma } from '@prisma/client';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  // Manejo de errores de dominio conocidos
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
    return;
  }

  // Manejo de errores conocidos de Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[]) || [];
      res.status(409).json({
        error: {
          message: `El registro ya existe con ese valor duplicado (${target.join(', ') || 'campo único'})`,
          statusCode: 409,
        },
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        error: {
          message: 'El registro solicitado no fue encontrado',
          statusCode: 404,
        },
      });
      return;
    }

    if (err.code === 'P2003') {
      res.status(400).json({
        error: {
          message: 'Violación de clave foránea: uno de los recursos relacionados no existe',
          statusCode: 400,
        },
      });
      return;
    }
  }

  // Error genérico no controlado (500) sin exponer stack trace
  console.error('Error no controlado:', err.message);
  res.status(500).json({
    error: {
      message: 'Ocurrió un error interno en el servidor',
      statusCode: 500,
    },
  });
}
