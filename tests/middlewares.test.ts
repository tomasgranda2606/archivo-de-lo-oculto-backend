import { Request, Response, NextFunction } from 'express';
import { authenticateJWT } from '../src/interface/http/middlewares/authMiddleware.js';
import { soloAdmin } from '../src/interface/http/middlewares/roleMiddleware.js';
import { JwtService } from '../src/infrastructure/security/JwtService.js';
import { UnauthorizedError, ForbiddenError } from '../src/domain/errors/AppError.js';

describe('Pruebas Automatizadas de Middlewares (Auth & Roles) - Bonus +3pts', () => {
  const jwtService = new JwtService();

  describe('authenticateJWT', () => {
    it('debe rechazar con 401 si no se envía el header Authorization', () => {
      const req = { headers: {} } as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      expect(() => {
        authenticateJWT(req, res, next);
      }).toThrow(UnauthorizedError);
      expect(next).not.toHaveBeenCalled();
    });

    it('debe rechazar con 401 si el header Authorization no usa el esquema Bearer', () => {
      const req = { headers: { authorization: 'Basic 123456' } } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      expect(() => {
        authenticateJWT(req, res, next);
      }).toThrow(UnauthorizedError);
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar a next con error 401 si el token es inválido o adulterado', () => {
      const req = { headers: { authorization: 'Bearer token_invalido_falso' } } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      authenticateJWT(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('debe autenticar exitosamente y asignar req.user cuando el token es válido', () => {
      const token = jwtService.sign({ id: 'user-uuid-123', role: 'user' });
      const req = { headers: { authorization: `Bearer ${token}` } } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      authenticateJWT(req, res, next);
      expect(req.user).toBeDefined();
      expect(req.user?.id).toBe('user-uuid-123');
      expect(req.user?.role).toBe('user');
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('soloAdmin (Middleware de Rol)', () => {
    it('debe responder con error 403 Forbidden si el rol es "user"', () => {
      const req = { user: { id: 'user-uuid-123', role: 'user' } } as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      soloAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it('debe permitir el acceso si el rol es "admin"', () => {
      const req = { user: { id: 'admin-uuid-456', role: 'admin' } } as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      soloAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('debe rechazar con 401 si no existe req.user', () => {
      const req = {} as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      soloAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
});
