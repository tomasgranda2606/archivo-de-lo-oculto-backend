import { Router } from 'express';

// Repositorios de infraestructura
import { PrismaUserRepository } from '../../../infrastructure/repositories/PrismaUserRepository.js';
import { PrismaLeyendaRepository } from '../../../infrastructure/repositories/PrismaLeyendaRepository.js';
import { PrismaTestimonioRepository } from '../../../infrastructure/repositories/PrismaTestimonioRepository.js';

// Servicios de infraestructura
import { BcryptPasswordHasher } from '../../../infrastructure/security/BcryptPasswordHasher.js';
import { JwtService } from '../../../infrastructure/security/JwtService.js';

// Casos de uso / Servicios de aplicación
import { AuthService } from '../../../application/services/AuthService.js';
import { LeyendaService } from '../../../application/services/LeyendaService.js';
import { TestimonioService } from '../../../application/services/TestimonioService.js';

// Controladores de presentación
import { AuthController } from '../controllers/AuthController.js';
import { LeyendaController } from '../controllers/LeyendaController.js';
import { TestimonioController } from '../controllers/TestimonioController.js';

// Routers
import { createAuthRouter } from './authRoutes.js';
import { createLeyendaRouter } from './leyendaRoutes.js';
import { createTestimonioRouter } from './testimonioRoutes.js';

export function createApiRouter(): Router {
  const router = Router();

  // 1. Instanciación de adaptadores de infraestructura
  const userRepository = new PrismaUserRepository();
  const leyendaRepository = new PrismaLeyendaRepository();
  const testimonioRepository = new PrismaTestimonioRepository();

  const passwordHasher = new BcryptPasswordHasher();
  const jwtService = new JwtService();

  // 2. Instanciación de capa de aplicación
  const authService = new AuthService(userRepository, passwordHasher, jwtService);
  const leyendaService = new LeyendaService(leyendaRepository);
  const testimonioService = new TestimonioService(testimonioRepository, leyendaRepository);

  // 3. Instanciación de capa de interfaz / controladores
  const authController = new AuthController(authService);
  const leyendaController = new LeyendaController(leyendaService);
  const testimonioController = new TestimonioController(testimonioService);

  // 4. Montaje de rutas
  router.use('/auth', createAuthRouter(authController));
  router.use('/leyendas', createLeyendaRouter(leyendaController));
  router.use('/testimonios', createTestimonioRouter(testimonioController));

  // Health check endpoint
  router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return router;
}
