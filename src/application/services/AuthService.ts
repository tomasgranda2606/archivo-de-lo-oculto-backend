import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { ConflictError, UnauthorizedError, BadRequestError } from '../../domain/errors/AppError.js';
import { RegisterInput, LoginInput, AuthResult } from '../dtos/AuthDTOs.js';

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export interface IJwtService {
  sign(payload: { id: string; role: string }): string;
  verify(token: string): { id: string; role: string };
}

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private jwtService: IJwtService
  ) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    if (!input.nombre || input.nombre.trim().length < 3) {
      throw new BadRequestError('El nombre debe tener al menos 3 caracteres');
    }
    if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      throw new BadRequestError('El email proporcionado no tiene un formato válido');
    }
    if (!input.password || input.password.length < 6) {
      throw new BadRequestError('La contraseña debe tener al menos 6 caracteres');
    }

    const existingUser = await this.userRepository.findByEmail(input.email.toLowerCase().trim());
    if (existingUser) {
      throw new ConflictError('El correo electrónico ya se encuentra registrado');
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);

    const newUser = await this.userRepository.create({
      nombre: input.nombre.trim(),
      email: input.email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'user',
    });

    const token = this.jwtService.sign({
      id: newUser.id,
      role: newUser.role,
    });

    return {
      token,
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    if (!input.email || !input.password) {
      throw new BadRequestError('Debe ingresar email y contraseña');
    }

    const user = await this.userRepository.findByEmail(input.email.toLowerCase().trim());
    if (!user) {
      // Mensaje genérico para no revelar si existe el correo
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const isMatch = await this.passwordHasher.compare(input.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const token = this.jwtService.sign({
      id: user.id,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    };
  }
}
