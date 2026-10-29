import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

export function createAuthRouter(authController: AuthController): Router {
  const router = Router();

  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.get('/me', authenticateJWT, authController.me);

  return router;
}
