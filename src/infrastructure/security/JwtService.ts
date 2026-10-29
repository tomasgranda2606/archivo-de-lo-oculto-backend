import jwt from 'jsonwebtoken';
import { IJwtService } from '../../application/services/AuthService.js';
import { UnauthorizedError } from '../../domain/errors/AppError.js';

export interface TokenPayload {
  id: string;
  role: string;
}

export class JwtService implements IJwtService {
  private secret: string;
  private expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'secret_dev_key_archivo_oculto_default_2026';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  sign(payload: TokenPayload): string {
    // Solo id y role en el payload para no exponer datos sensibles
    return jwt.sign({ id: payload.id, role: payload.role }, this.secret, {
      expiresIn: this.expiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  verify(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as TokenPayload;
      if (!decoded || !decoded.id || !decoded.role) {
        throw new UnauthorizedError('Token inválido');
      }
      return { id: decoded.id, role: decoded.role };
    } catch {
      throw new UnauthorizedError('Token no provisto, inválido o expirado');
    }
  }
}
